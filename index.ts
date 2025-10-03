const express = require("express");
const products = require("./routes/products");
const orders = require("./routes/orders");
const register = require("./routes/register");
const login = require("./routes/login");
const users = require("./routes/user");
const db = require("./db");
const cors = require("cors");
const app = express();
const port = 3003;

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOptions = {
  origin(origin: any, cb: any) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req: any, res: any, next: any) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

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

app.get("/", (_req: any, res: any) => res.send("API OK"));
app.use((_req: any, res: any) =>
  res.status(404).json({ message: "Not found" })
);

app.listen(port, () => {
  console.log("Listening on port 3003");
});
