const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 4003;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DB =
  "mongodb+srv://schlechter_hire_truck:dduEU6ZjCwDnja9V@clusterhiretruck.d0nc694.mongodb.net/Hire_Truck_db?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB Connection Successful!");
  });

const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

const UserRouter = require("./routes/users");
app.use("/user", UserRouter);

server.listen(PORT, () => {
  console.log(`Backend app listening at http://localhost:${PORT}`);
});
