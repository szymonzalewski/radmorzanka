const { generateProducts } = require("./products");
const express = require("express");

const app = express();
const port = 3003;

app.use(express.json());

const products = generateProducts(10);

app.get("/products", (req: any, res: any) => {
  res.send(products);
});

app.get("/products/:id", (req: any, res: any) => {
  const product = products.find((p: any) => p.id === parseInt(req.params.id));
  res.send(product);
});

app.post("/products", (req: any, res: any) => {
  const product = {
    id: products.length + 1,
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
  };
  products.push(product);
  res.send(product);
});

app.put("/products/:id", (req: any, res: any) => {
  const product = products.find((p: any) => p.id === parseInt(req.params.id));
  product.name = req.body.name;
  product.quantity = req.body.quantity;
  product.price = req.body.price;

  res.send(product);
});

app.delete("/products/:id", (req: any, res: any) => {
  const product = products.find((p: any) => p.id === parseInt(req.params.id));

  const index = products.indexOf(product);
  products.splice(index, 1);
  res.send(product);
});

app.listen(port, () => {
  console.log("Listening on port 3003");
});
