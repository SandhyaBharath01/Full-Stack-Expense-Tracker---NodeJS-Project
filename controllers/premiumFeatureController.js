const User = require("../models/userModel")  //loginPageModel
const expenseData = require("../models/expenseModel")  //expenseData
const sequelize = require("../util/database")
const Uploads = require("../models/fileUploadsModel")

exports.getFileHistory = async (req, res) => {
  try {
    const user = req.user;
    const files = await Uploads.findAll({ where: { userId: user.id } });
    res.status(200).json(files);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving file history" });
  }
};

exports.getTableData = async (req, res) => {
  try {
    const user = req.user;
    const response = await expenseData.findAll({
      where: { logindatumId: user.id },
      attributes: ["createdAt", "amount", "description", "category"],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving table data" });
  }
};


exports.showLeaderBoard = async (req, res) => {
    try {
        const leaderboardData = await User.findAll({
            order: [["totalExpense", 'DESC']]
        })
        console.log(leaderboardData)
        res.status(201).json({ leaderboardData })

    } catch (err) {
        res.status(500).json({ err: err })
    }
}
