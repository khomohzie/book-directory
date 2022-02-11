const { check } = require("express-validator");

exports.addBookValidation = [
    check("title")
        .not()
        .isEmpty()
        .withMessage("Title is required"),
    check("addedBy")
        .not()
        .isEmpty()
        .withMessage("User is required"),
];
