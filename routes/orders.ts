const express = require("express");
const router = express.Router();
const db = require("../db");
const { auth, requireAdmin } = require("../auth/authMiddleware");

router.get("/", auth, async (req: any, res: any) => {
  const isAdmin = req.user.role === "admin";
  const params = [];
  const where = isAdmin ? "" : "WHERE o.user_id = $1";
  if (!isAdmin) params.push(req.user.id);

  const orders = await db.any(
    `
    SELECT 
       o.id,
        o.user_id AS "userId",
        o.firstname AS "firstname",
        o.surname AS "surname",
      o.order_description AS "orderDescription",
  o.status AS "status",
  o.created_at AS "createdAt",
  o.updated_at AS "updatedAt",
      COALESCE(SUM(op.quantity * op.price), 0) AS "totalPrice",
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'quantity', op.quantity,
            'price', op.price
          )
        ) FILTER (WHERE op.id IS NOT NULL),
        '[]'
      ) AS "orderedProducts"
    FROM orders o
    LEFT JOIN order_products op ON o.id = op.order_id
    LEFT JOIN products p        ON p.id = op.product_id
    ${where}
    GROUP BY o.id
    ORDER BY o.id;
    `,
    params
  );

  res.json({ orders });
});
router.get("/:id", auth, async (req: any, res: any) => {
  const id = Number(req.params.id);
  const order = await db.oneOrNone("SELECT * FROM orders WHERE id=$1", [id]);
  res.json({ order });
});

router.post("/", auth, async (req: any, res: any) => {
  const userId = req.user.id; // z JWT
  const { firstname, surname, orderDescription, status } = req.body;

  const order = await db.one(
    `INSERT INTO orders (user_id, firstname, surname, order_description, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, firstname, surname, order_description, status, created_at, updated_at;`,
    [userId, firstname, surname, orderDescription ?? "", status ?? "NEW"]
  );

  res.json({ order });
});
/*
router.post(
  "/:orderId/products",
  auth,

  async (req: any, res: any) => {
    const orderId = Number(req.params.orderId);
    const { productId, quantity } = req.body;

    const order = await db.oneOrNone(
      "SELECT id, user_id FROM orders WHERE id = $1",
      [orderId]
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const product = await db.oneOrNone(
      "SELECT id, price FROM products WHERE id = $1",
      [productId]
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    const inserted = await db.one(
      `INSERT INTO order_products (order_id, product_id, quantity, price)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (order_id, product_id)
     DO UPDATE SET quantity = order_products.quantity + EXCLUDED.quantity,
                   price    = EXCLUDED.price
     RETURNING order_id, product_id, quantity, price;`,
      [orderId, productId, quantity, Number(product.price)]
    );

    res.json({ item: inserted });
  }
);
*/

router.post("/:orderId/products", auth, async (req: any, res: any) => {
  const orderId = Number(req.params.orderId);
  const { productId, quantity } = req.body;

  if (!Number.isInteger(orderId) || orderId <= 0)
    return res.status(400).json({ message: "Niepoprawny orderId" });
  if (!Number.isInteger(productId) || productId <= 0)
    return res.status(400).json({ message: "Niepoprawny productId" });
  if (!Number.isInteger(quantity) || quantity <= 0)
    return res.status(400).json({ message: "Ilość musi być > 0" });

  try {
    const result = await db.tx(async (t: any) => {
      // 1) Sprawdź zamówienie + własność (jeśli nie-admin)
      const ord = await t.oneOrNone(
        "SELECT id, user_id FROM orders WHERE id = $1",
        [orderId]
      );
      if (!ord) throw { status: 404, message: "Nie znaleziono zamówienia" };
      if (req.user.role !== "admin" && ord.user_id !== req.user.id) {
        throw { status: 403, message: "Brak dostępu do zamówienia" };
      }

      // 2) Pobierz produkt z blokadą i sprawdź zapas
      const prod = await t.oneOrNone(
        "SELECT id, price, quantity FROM products WHERE id = $1 FOR UPDATE",
        [productId]
      );
      if (!prod) throw { status: 404, message: "Nie znaleziono produktu" };
      if (prod.quantity < quantity) {
        throw {
          status: 409,
          message: "Brak wystarczającej ilości w magazynie",
        };
      }

      // 3) Upsert do order_products
      await t.none(
        `INSERT INTO order_products (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (order_id, product_id)
         DO UPDATE SET quantity = order_products.quantity + EXCLUDED.quantity,
                       price    = EXCLUDED.price`,
        [orderId, productId, quantity, Number(prod.price)]
      );

      // 4) Zmniejsz stan magazynowy
      await t.none(
        "UPDATE products SET quantity = quantity - $2 WHERE id = $1",
        [productId, quantity]
      );

      // 5) Znacznik czasu zamówienia
      await t.none("UPDATE orders SET updated_at = NOW() WHERE id = $1", [
        orderId,
      ]);

      // 6) Zwróć aktualny stan zamówienia
      const orderRow = await t.one(
        `SELECT id,
                firstname,
                surname,
                order_description AS "orderDescription",
                status,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
           FROM orders
          WHERE id = $1`,
        [orderId]
      );

      const items = await t.any(
        `SELECT p.id, p.name, op.quantity, op.price
           FROM order_products op
           JOIN products p ON p.id = op.product_id
          WHERE op.order_id = $1
          ORDER BY p.id`,
        [orderId]
      );

      return { ...orderRow, orderedProducts: items };
    });

    res.status(200).json(result);
  } catch (err: any) {
    console.error("ADD TO ORDER error:", err);
    res
      .status(err.status ?? 500)
      .json({ message: err.message ?? "Błąd serwera" });
  }
});

router.put(
  "/:orderId/status",
  auth,
  requireAdmin,
  async (req: any, res: any) => {
    const id = Number(req.params.orderId);
    const { status } = req.body;
    const order = await db.oneOrNone(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, firstname, surname, order_description, status, updated_at;",
      [status, id]
    );
    // dla if
    const validStatuses = [
      "NEW",
      "CONFIRMED",
      "CANCELLED",
      "IN_PREPARATION",
      "READY",
      "DELIVERED",
    ];

    res.json({ order });
  }
);

router.delete("/:id", auth, requireAdmin, async (req: any, res: any) => {
  const id = Number(req.params.id);
  const order = await db.oneOrNone(
    "DELETE FROM orders WHERE id = $1 RETURNING id;",
    [id]
  );
  res.json({ order });
});

module.exports = router;
