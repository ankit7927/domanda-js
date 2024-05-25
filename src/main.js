require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./configs/config.db");
const { engine } = require("express-handlebars");
const path = require("path")

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false, }));
app.engine('handlebars', engine({extname: ".hbs"}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"));

if (process.env.NODE_ENV === "dev") {
    const morgan = require("morgan");
    app.use(morgan("dev"));
}

connectDB()

app.use("/api", require("./routes/api/route.root"))
app.use("", (req, res)=>{
    res.render("index.hbs")
})

mongoose.connection.once("open", () => {
    console.log("connected to database");
    app.listen(port, () => {
        console.log(`server started on ${port}`);
    });
});

mongoose.connection.on("error", (error) => {
    console.log(error);
});

