const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const cors = require("cors");
app.use(cors());


const dotenv = require("dotenv");
dotenv.config();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const morgan = require("morgan");
app.use(morgan("combined", { stream: accessLogStream }));

const sequelize = require("./util/database");

const userRouter = require("./router/userRouter");
const expenseRouter = require("./router/expenseRouter");
const purchaseMembershipRouter = require("./router/purchaseMembershipRouter");
const leaderboardRouter = require("./router/leaderboardRouter");
const reportsRouter = require("./router/reportsRouter");
const Uploads = require("./models/fileUploadsModel")

const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/ordersModel");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/user", userRouter);

app.use("/homePage", expenseRouter);
app.use("/expense", expenseRouter);

app.use("/purchase", purchaseMembershipRouter);

app.use("/premium", leaderboardRouter);


app.use("/reports", reportsRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Uploads)
Uploads.belongsTo(User)

// need to write app.use and console statement


sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 2222);
    console.log("server started at port 2222");
  })
  .catch((err) => console.log(err));
