const express = require("express");
const router = express.Router();
const users = require("./usersShare");

router.get("/", (req: any, res: any) => {
  res.send(users);
});

module.exports = router;
