const express = require("express");
const router = express.Router();
const { auth, requireAdmin } = require("../auth/authMiddleware");
const db = require("../db");

router.get("/", auth, requireAdmin, async (req: any, res: any) => {
  const users = await db.any("SELECT * FROM users;");
  res.json({ users });
});

module.exports = router;
