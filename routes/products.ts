const { generateProducts } = require("./mocks/fakeProducts");
const express = require("express");
const router = express.Router();

const products = generateProducts(10);

router.get("/", (req: any, res: any) => {
  res.send(products);
});

router.get("/:id", (req: any, res: any) => {
  const product = products.find((p: any) => p.id === parseInt(req.params.id));
  res.send(product);
});

router.post("/", (req: any, res: any) => {
  const product = {
    id: products.length + 1,
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
  };
  products.push(product);
  res.send(product);
});

router.put("/:id", (req: any, res: any) => {
  const product = products.find((p: any) => p.id === parseInt(req.params.id));
  product.name = req.body.name;
  product.quantity = req.body.quantity;
  product.price = req.body.price;

  res.send(product);
});

router.delete("/:id", (req: any, res: any) => {
  const product = products.find((p: any) => p.id === parseInt(req.params.id));

  const index = products.indexOf(product);
  products.splice(index, 1);
  res.send(product);
});

module.exports = router;
