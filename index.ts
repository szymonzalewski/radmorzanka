const express = require("express");
const products = require("./routes/products");
const orders = require("./routes/orders");
const register = require("./routes/register");
const login = require("./routes/login");
const users = require("./routes/user");

const app = express();
const port = 3003;

app.use(express.json());
app.use("/products", products);
app.use("/orders", orders);
app.use("/register", register);
app.use("/login", login);
app.use("/users", users);

app.listen(port, () => {
  console.log("Listening on port 3003");
});
