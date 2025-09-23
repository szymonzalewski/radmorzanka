const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req: any, res: any) => {
  const orders = await db.any(
    "SELECT o.id, o.firstname, o.surname, o.order_description, o.status, o.created_at, o.updated_at, COALESCE(SUM(op.quantity * op.price), 0) AS total_price, COALESCE( json_agg( json_build_object( 'id', p.id, 'name', p.name, 'quantity', op.quantity, 'price', op.price ) ) FILTER (WHERE op.id IS NOT NULL), '[]' ) AS ordered_products FROM orders o LEFT JOIN order_products op ON o.id = op.order_id LEFT JOIN products p ON p.id = op.product_id GROUP BY o.id ORDER BY o.id;"
  );
  res.json({ orders });
});
router.get("/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);
  const order = await db.oneOrNone("SELECT * FROM orders WHERE id=$1", [id]);
  res.json({ order });
});

router.post("/", async (req: any, res: any) => {
  const { firstname, surname, orderDescription, status } = req.body;
  const order = await db.one(
    "INSERT INTO orders (firstname, surname, order_description, status) VALUES ($1, $2, $3, $4) RETURNING id, firstname, surname, order_description, status;",
    [firstname, surname, orderDescription, status ?? "NEW"]
  );

  res.json({ order });
});

router.post("/:orderId/products", async (req: any, res: any) => {
  const orderId = Number(req.params.orderId);
  const { productId, quantity } = req.body;
  const product = await db.oneOrNone(
    "SELECT price FROM products WHERE id = $1",
    [productId]
  );
  const order = await db.one(
    "INSERT INTO order_products (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING order_id, product_id, quantity, price;",
    [orderId, productId, quantity, product.price]
  );

  res.json({ order });
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
