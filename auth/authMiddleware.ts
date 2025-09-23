const jwt = require("jsonwebtoken");
const JWT_SECRET = "supersecret";

function auth(req: any, res: any, next: any) {
  const header = req.headers["authorization"];
  const token = header.split(" ")[1];

  const payload = jwt.verify(token, JWT_SECRET);
  req.user = payload;
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Dostęp tylko dla administratora" });
  }
  next();
}

module.exports = { auth, requireAdmin };
