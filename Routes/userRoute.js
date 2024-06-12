const express = require("express");
const {
  registerUser,
  loginUser,
  getPublicKey,
  findUser,
  getUsers,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/public-key", getPublicKey);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

module.exports = router;
