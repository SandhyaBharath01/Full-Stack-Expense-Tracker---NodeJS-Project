const Sequelize = require("sequelize");
const sequelize = new Sequelize("expensetracker", "root", "sandhya", {
  dialect: "mysql",
  host: "localhost",
});

console.log(sequelize);

module.exports = sequelize;
