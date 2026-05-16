const express = require("express")
const  urlcontroller = require("../controllers/url.controller")
const router = express.Router()
const loginLimit = require("../middlewares/loginlimiter")
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/shorten",authMiddleware.optional,urlcontroller.shortenUrl)
router.get("/links",authMiddleware.required, urlcontroller.getUserLinks)
router.get("/analytics/:shortId", authMiddleware.required, urlcontroller.getAnalytics)
router.get("/:shortId",authMiddleware.optional,urlcontroller.redirectURL)
module.exports = router