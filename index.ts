const express = require("express");
const products = require("./routes/products");
const orders = require("./routes/orders");
const register = require("./routes/register");
const login = require("./routes/login");
const users = require("./routes/user");
const db = require("./db");

const app = express();
const port = 3003;

app.use(express.json());
app.use("/products", products);
app.use("/orders", orders);
app.use("/register", register);
app.use("/login", login);
app.use("/users", users);

// Test połączenia
db.connect()
  .then((obj: any) => {
    console.log("Connected to database");
    obj.done();
  })
  .catch((error: any) => {
    console.error("ERROR:", error.message);
  });

app.listen(port, () => {
  console.log("Listening on port 3003");
});
