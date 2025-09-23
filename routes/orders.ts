const express = require("express");
const router = express.Router();
const { generateProducts } = require("./mocks/fakeProducts");
const products = generateProducts(10);
const db = require("../db");

const orders: any[] = [];

router.get("/", (req: any, res: any) => {
  res.send(orders);
});
router.get("/:id", (req: any, res: any) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  res.send(order);
});

router.post("/", (req: any, res: any) => {
  const { firstname, surname, orderDescription } = req.body;
  const order = {
    id: orders.length + 1,
    firstname,
    surname,
    orderDescription,
    status: "NEW",
    orderedProducts: [],
  };
  orders.push(order);
  res.send(orders);
});

router.post("/:orderId/products", (req: any, res: any) => {
  const orderId = Number(req.params.orderId);
  const { productId, quantity } = req.body;
  const order = orders.find((o) => o.id === orderId);
  const product = products.find((p: any) => p.id === productId);

  order.orderedProducts.push({
    id: productId,
    name: product.name,
    quantity: product.quantity,
    price: product.price,
  });
  res.send(order);
});

router.put("/:orderId/status", (req: any, res: any) => {
  const id = Number(req.params.orderId);
  const { status } = req.body;
  const order = orders.find((o) => o.id === id);
  // dla if
  const validStatuses = [
    "NEW",
    "CONFIRMED",
    "CANCELLED",
    "IN_PREPARATION",
    "READY",
    "DELIVERED",
  ];
  order.status = status;

  res.send(order);
});

router.delete("/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  const order = orders.find((o) => o.id === id);

  const index = orders.indexOf(order);
  orders.splice(index, 1);
  res.send(order);
});

module.exports = router;
