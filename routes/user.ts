const express = require("express");
const router = express.Router();
const users = require("./usersShare");
const auth = require("../auth/authMiddleware");
const db = require("../db");

router.get("/", auth, (req: any, res: any) => {
  res.send(users);
});

module.exports = router;
