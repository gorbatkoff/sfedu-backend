const crypto = require("crypto");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userModel = require("../models/userModel");

const privateKey = fs.readFileSync("private.pem", "utf8");

const decryptData = (encryptedData) => {
  return crypto
    .privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedData, "base64"),
    )
    .toString();
};

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtKey, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.status(409).json("User with this email already exist");

    if (!name || !email || !password)
      return res.status(400).json("All fields are required");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be valid");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be a strong password");

    user = new userModel({ name, surname, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, surname, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const decryptedEmail = decryptData(email);
    const decryptedPassword = decryptData(password);

    console.log("Decrypted Email:", decryptedEmail);
    console.log("Decrypted Password:", decryptedPassword);

    let user = await userModel.findOne({ email: decryptedEmail });

    if (!user) return res.status(400).json("Invalid email or password");

    const isValidPassword = await bcrypt.compare(
      decryptedPassword,
      user.password,
    );

    if (!isValidPassword) {
      return res.status(400).json("Invalid email or password");
    }

    const token = createToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: decryptedEmail,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    let user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    let users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getPublicKey = (req, res) => {
  const publicKey = fs.readFileSync("public.pem", "utf8");
  res.json({ publicKey });
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  getPublicKey,
};
