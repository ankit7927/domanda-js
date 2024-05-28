require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./configs/config.db");
const cookieParser = require("cookie-parser")
const datetime = require("date-and-time");
const hbs = require("hbs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false, }));
app.use(cookieParser())
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));
hbs.registerHelper("parsedate", (date)=> {
    return datetime.format(date.data.root.createdAt, "DD/MM/YY")
})

if (process.env.NODE_ENV === "dev") {
    const morgan = require("morgan");
    app.use(morgan("dev"));
}
connectDB();

app.use("/api", require("./routes/api/route.root"))
app.use("", require("./routes/site/route.root"))

mongoose.connection.once("open", () => {
    console.log("connected to database");
    app.listen(port, () => {
        console.log(`server started on ${port}`);
    });
});

mongoose.connection.on("error", (error) => {
    console.log(error);
});

