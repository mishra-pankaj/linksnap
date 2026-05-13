const express = require("express")
const  urlcontroller = require("../controllers/url.controller")
const router = express.Router()
const loginLimit = require("../middlewares/loginlimiter")
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/shorten",authMiddleware.optional,urlcontroller.shortenUrl)

module.exports = router