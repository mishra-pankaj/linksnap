require("dotenv").config()
const express = require("express")
const connectdb = require("./db/db")
const app = express()
cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const urlRoutes= require("../src/routes/url.routes")
app.use(express.json())
app.use(cookieParser())

connectdb()

app.use("/api/auth", authRoutes)
app.use("/api/url", urlRoutes)
module.exports=app