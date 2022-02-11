const { check } = require("express-validator");

exports.sequelCreateValidator = [
	check("name")
        .not()
        .isEmpty()
        .withMessage("Name is required"),
];
