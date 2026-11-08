const Users = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const throwError = require("../utils/throwError");

const secretKey = process.env.SECRET_KEY;
function setToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: "7d" });
}
async function getUsers(req, res) {
  const users = await Users.find();
  res.json({
    name: users.name,
    email: users.email,
  });
}

async function getOneUser(req, res) {
  const userId = req.user.userId;
  const user = await Users.findById(userId);
  if (!user) {
    throwError("user not loged in or you are not auhtorized", 404);
  }
  return res.json({
    _id:user._id,
    name: user.name,
    email: user.email,
  });
}

async function createUser(req, res) {
  let { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 5);

  const user = await Users.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  const token = setToken({ userId: user._id });

  return res.status(201).json({
    message: "User created successfully",
    data: {
      _id:user._id,
      name: user.name,
      email: user.email,
    },
    token: token,
  });
}

async function loginUser(req, res) {

    let { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      throwError( "Invalid email or password",401)
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throwError("Invalid email or password",401)
    }
    const token = setToken({ userId: user._id });
    return res.status(200).json({
      message: "Login successful",
      token: token,
      data: {
        _id:user._id,
        name: user.name,
        email: user.email,
      },
    });

}

module.exports = { getUsers, createUser, loginUser, getOneUser };
