const express = require("express");
const user_route = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/upload"), function (err, success) {
      if (err) {
        throw err;
      }
    });
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, function (error, success) {
      if (error) {
        throw error;
      }
    });
  },
});
const upload = multer({ storage: storage });

const userController = require("../controller/userContoller.js");

// user_route.get("/", userController.landingPage);
user_route.post(
  "/insert",
  auth,
  upload.single("user_image"),
  userController.addNewUser
);
user_route.put("/update", auth, userController.update_user);
user_route.get("/details/:user_id", userController.user_details);
user_route.get("/image/:user_id", userController.get_userImage);
user_route.delete("/delete/:user_id", userController.delete_userbyid);

module.exports = user_route;
