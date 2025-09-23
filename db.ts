const pgpFactory = require("pg-promise");
const pgp = pgpFactory();

const db = pgp({
  host: "localhost",
  port: 5433,
  database: "radmor",
  user: "postgres",
  password: "mysecretpassword",
});

module.exports = db;
