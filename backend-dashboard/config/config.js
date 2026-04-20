require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "inventaris_plp_tik",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
    timezone: "+07:00",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST || "database_test",
    host: process.env.DB_HOST,
    dialect: "postgres",
    timezone: "+07:00",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    timezone: "+07:00",
    logging: false
  }
};