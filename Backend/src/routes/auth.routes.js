const express = require("express")
const  authControllers = require("../controllers/auth.contoller")
const router = express.Router()
const rateLimit = require("express-rate-limit")

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,// limit each IP to 5 requests per windowMs
    message: {
        message: "Too many login attempts. Try again after 1 minute."
    }
})

router.post("/register",authControllers.registerUser)
router.post("/login", loginLimiter,authControllers.loginUser)
router.get("/logout", authControllers.logoutUser)


module.exports = router