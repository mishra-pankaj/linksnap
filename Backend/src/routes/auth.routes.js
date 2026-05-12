const express = require("express")
const  authControllers = require("../controllers/auth.contoller")
const router = express.Router()

router.post("/register",authControllers.registerUser)
router.post("/login", authControllers.loginUser)
router.get("/logout", authControllers.logoutUser)


module.exports = router