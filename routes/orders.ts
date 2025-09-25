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
      o.user_id         AS "userId",
      o.firstname,
      o.surname,
      o.order_description AS "orderDescription",
      o.status,
      o.created_at      AS "createdAt",
      o.updated_at      AS "updatedAt",
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
router.get("/:id", async (req: any, res: any) => {
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

router.post("/:orderId/products", auth, async (req: any, res: any) => {
  const orderId = Number(req.params.orderId);
  const { productId, quantity } = req.body;

  // sprawdź czy zamówienie istnieje i czy user ma do niego prawa
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
});

router.put("/:orderId/status", async (req: any, res: any) => {
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
});

router.delete("/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);
  const order = await db.oneOrNone(
    "DELETE FROM orders WHERE id = $1 RETURNING id;",
    [id]
  );
  res.json({ order });
});

module.exports = router;
