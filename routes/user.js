const express = require("express");

const router = express.Router();

const { register, signin, getUsers } = require("../controllers/user");

// validators
const { runValidation } = require("../validators");
const {
	userSignupValidator,
	userSigninValidator,
} = require("../validators/auth");

router.post("/signup", userSignupValidator, runValidation, register);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/users", getUsers);

module.exports = router;
