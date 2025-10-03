const express = require("express");
const router = express.Router();
const { auth, requireAdmin } = require("../auth/authMiddleware");

const db = require("../db");

router.get("/", async (req: any, res: any) => {
  const products = await db.any("SELECT * FROM products;");
  res.json({ products });
});

router.get("/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);
  const product = await db.oneOrNone("SELECT * FROM products WHERE id=$1", [
    id,
  ]);
  res.json({ product });
});

router.post("/", auth, requireAdmin, async (req: any, res: any) => {
  const { name, quantity, price } = req.body;
  const product = await db.one(
    "INSERT INTO products (name, quantity, price) VALUES ($1, $2, $3) RETURNING id, name, quantity, price;",
    [name, quantity, price]
  );

  res.json({ product });
});

router.put("/:id", auth, requireAdmin, async (req: any, res: any) => {
  const id = Number(req.params.id);
  const { name, quantity, price } = req.body;
  const product = await db.oneOrNone(
    "UPDATE products SET name = $1, quantity = $2, price = $3 WHERE id = $4 RETURNING id, name, quantity, price;",
    [name, quantity, price, id]
  );

  res.send({ product });
});

router.delete("/:id", auth, requireAdmin, async (req: any, res: any) => {
  const id = Number(req.params.id);
  const product = await db.oneOrNone(
    "DELETE FROM products WHERE id = $1 RETURNING id, name, quantity, price;",
    [id]
  );

  res.json({ product });
});

module.exports = router;
