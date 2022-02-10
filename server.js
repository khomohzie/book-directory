require("dotenv").config();
const express = require("express");
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 4000;

// middlewares
app.use(bodyParser.json());
app.use(morgan("dev"));

// database
mongoose
	.connect(process.env.DATABASE)
	.then(() => console.log("DB connected"))
	.catch((err) => console.log(err));

// routes
readdirSync("./routes").map((fileName) =>
	app.use("/api", require(`./routes/${fileName}`))
);

// start listening on port
app.listen(port, () => console.log(`Server is running on port ${port}`));
