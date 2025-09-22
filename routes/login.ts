const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "supersecret";
const bcrypt = require("bcrypt");
const users = require("./usersShare");

router.post("/", async (req: any, res: any) => {
  const { email, password } = req.body ?? {};
  const user = users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase()
  );
  const ok = await bcrypt.compare(password, user.password);
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.send(accessToken);
});

module.exports = router;
