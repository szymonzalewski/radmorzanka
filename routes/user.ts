const express = require("express");
const router = express.Router();
const users = require("./usersShare");
const auth = require("../auth/authMiddleware");

router.get("/", auth, (req: any, res: any) => {
  res.send(users);
});

module.exports = router;
