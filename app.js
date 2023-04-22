
const express = require("express")
const cookieParser = require("cookie-parser")
const errorMiddileware = require("./middleware/error")
const app = express()

app.use(express.json())
app.use(cookieParser())

//Route imports

const student = require("./routes/studentRoute")

app.use("/api/v1",student)
// middleware for errors

app.use(errorMiddileware)


module.exports = app