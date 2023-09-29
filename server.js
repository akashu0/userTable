require("dotenv").config();
const express = require("express");
const Routes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Files
app.use(express.static("public"));

app.use("/", Routes);

app.listen(PORT, () => {
  console.log("Server running on port 5000");
});
