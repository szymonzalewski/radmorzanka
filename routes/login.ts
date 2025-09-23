const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "supersecret";
const bcrypt = require("bcrypt");
const db = require("../db");

router.post("/", async (req: any, res: any) => {
  const { email, password } = req.body ?? {};
  const user = await db.oneOrNone(
    "SELECT id, firstname, surname, email, password_hash, role FROM users WHERE email = $1;",
    [email]
  );
  const ok = await bcrypt.compare(password, user.password_hash);
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({
    id: user.id,
    firstname: user.firstname,
    surname: user.surname,
    email: user.email,
    role: user.role,
    accessToken,
  });
});

module.exports = router;
