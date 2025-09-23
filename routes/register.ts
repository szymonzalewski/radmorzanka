const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

router.post("/", async (req: any, res: any) => {
  const { firstname, surname, email, password_hash, role } = req.body;

  const hashedPassword = await bcrypt.hash(password_hash, 10);
  const user = await db.one(
    "INSERT INTO users (firstname, surname, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, firstname, surname, email, role, created_at;",
    [firstname, surname, email, hashedPassword, role]
  );

  res.json({ user });
});

module.exports = router;
