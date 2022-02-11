const express = require("express");

const router = express.Router();

const {
	create,
	readBook,
	update,
	remove,
	getBooks,
} = require("../controllers/book");

const { requireUser, canUpdateDeleteBook } = require("../controllers/user");

// validators
const { runValidation } = require("../validators");
const { addBookValidation } = require("../validators/book");

router.post("/book", requireUser, addBookValidation, runValidation, create);
router.put("/book/:id", requireUser, canUpdateDeleteBook, update);
router.delete("/book/:id", requireUser, canUpdateDeleteBook, remove);
router.get("/book/:id", readBook);
router.get("/books", getBooks);

module.exports = router;
