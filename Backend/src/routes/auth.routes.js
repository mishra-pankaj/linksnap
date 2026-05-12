const express = require("express")
const  authControllers = require("../controllers/auth.contoller")
const router = express.Router()
const loginLimit = require("../middlewares/loginlimiter")

router.post("/register",authControllers.registerUser)
router.post("/login", loginLimit,authControllers.loginUser)
router.get("/logout", authControllers.logoutUser)


module.exports = router