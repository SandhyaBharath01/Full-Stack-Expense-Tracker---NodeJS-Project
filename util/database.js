const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host:process.env.DB_HOST,
  dialectOptions: {
    connectTimeout: 60000, // Set the timeout value in milliseconds
  },
});

console.log(sequelize);

module.exports = sequelize;
