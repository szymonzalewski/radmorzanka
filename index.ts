const express = require("express");
const products = require("./routes/products");
const orders = require("./routes/orders");

const app = express();
const port = 3003;

app.use(express.json());
app.use("/products", products);
app.use("/orders", orders);

app.listen(port, () => {
  console.log("Listening on port 3003");
});
