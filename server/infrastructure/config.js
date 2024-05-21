require("dotenv").config();

module.exports = {
  PORT: process.env.SERVER_PORT || 5100,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/stratatask",
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "stratatask-wants-to-succeed-by-hiring-moroccan-devs",
};
