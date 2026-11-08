const express = require("express");
const { protection } = require("../middlewares/authMiddleware");
const {validateSignUp,validateLogin} = require("../middlewares/validateMiddleware")

const {
  getUsers,
  createUser,
  loginUser,
  getOneUser,
} = require("../controllers/usersControllers");

const router = express.Router();
router.get("/", protection, getUsers);

router.get("/myId", protection, getOneUser);
router.post("/signup",validateSignUp, createUser);

router.post("/login",validateLogin, loginUser);

module.exports = router;
