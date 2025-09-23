const express = require("express");
const router = express.Router();
const users = require("./usersShare");
const db = require("../db");

const bcrypt = require("bcrypt");

router.post("/", async (req: any, res: any) => {
  const { firstname, surname, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    firstname,
    surname,
    email,
    password: hashedPassword,
    role,
  };
  users.push(user);

  res.send(user);
});

module.exports = router;
