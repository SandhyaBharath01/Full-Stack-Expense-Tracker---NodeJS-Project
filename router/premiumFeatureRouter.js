const express = require("express")
const router = express.Router()
const userAuthentication = require("../middleware/auth")
const premiumControllers = require("../controllers/premiumFeatureController")

router.get("/premium/getFileHistory", userAuthentication.authenticate, premiumControllers.getFileHistory)

router.get("/premium/showleaderboard", userAuthentication.authenticate,
    premiumControllers.showLeaderBoard);
    
router.get("/premium/getTableData", userAuthentication.authenticate, premiumControllers.getTableData)

module.exports = router