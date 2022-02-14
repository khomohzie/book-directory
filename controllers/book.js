const Book = require("../models/book");

exports.create = (req, res) => {
	try {
		const { title, isbn, author, sequel, addedBy } = req.body;

		Book.findOne({ isbn }).exec((err, book) => {
			if (book) {
				return res.status(400).send("Book already exists!");
			}

			let newBook = new Book({ title, isbn, author, sequel, addedBy });
			newBook.save((err, success) => {
				if (err) return res.status(400).json({ error: err });

				res.status(200).send("Book uploaded successfully!");
			});
		});
	} catch (error) {
		console.error(error);
		return res.status(400).send("Failed to save book! Please try again.");
	}
};

exports.update = async (req, res) => {
	try {
		const id = req.params.id;
		const { title, isbn, author, sequel } = req.body;

		const bookExists = await Book.findOne({ isbn: id }).exec();

		if (!bookExists) {
			return res.status(400).json({ error: "Book does not exist!" });
		}

		// Only update fields for which new values are entered else leave as-is.
		const updateField = (newValue, oldValue) =>
			!newValue ? oldValue : newValue;

		const updatedBook = {
			...bookExists,
			title: updateField(title, bookExists.title),
			isbn: updateField(isbn, bookExists.isbn),
			author: updateField(author, bookExists.author),
			sequel: updateField(sequel, bookExists.sequel),
		};

		Book.updateOne(
			{ isbn: id },
			{
				$set: {
					title: updatedBook.title,
					isbn: updatedBook.isbn,
					author: updatedBook.author,
					Sequel: updatedBook.sequel,
				},
			}
		).exec((err, book) => {
			if (err) {
				return res
					.status(400)
					.send("Could not be updated! Maybe duplicate isbn.");
			}

			res.status(200).send("Book updated successfully!");
		});
	} catch (error) {
		console.log(error);
		return res.status(400).send("Failed to update book! Please try again.");
	}
};

exports.remove = async (req, res) => {
	try {
		const id = req.params.id;

		const bookExists = await Book.findOne({ isbn: id }).exec();

		if (!bookExists) {
			return res.status(400).json({ error: "Book does not exist!" });
		}

		Book.deleteOne({ isbn: id }).exec((err, book) => {
			if (err) {
				return res.status(400).send("Could not be deleted! Try again.");
			}

			res.status(200).send("Book deleted successfully!");
		});
	} catch (error) {
		console.log(error);
		return res.status(400).send("Failed to delete book! Please try again.");
	}
};

exports.readBook = (req, res) => {
	try {
		const id = req.params.id;

		const bookExists = Book.findOne({ isbn: id })
			.populate("addedBy", "_id name")
			.populate("sequel", "_id name")
			.exec((err, book) => {
				if (err || !book) {
					return res
						.status(400)
						.json({ error: "Book does not exist!" });
				}

				res.status(200).send(book);
			});
	} catch (error) {
		console.log(error);
		return res.status(400).send("Request failed! Please try again.");
	}
};

exports.getBooks = async (req, res) => {
	try {
		const bookList = await Book.find()
			.populate("addedBy", "_id name")
			.populate("sequel", "_id name")
			.exec();

		res.status(200).send(bookList);
	} catch (error) {
		console.log(error);
		return res.status(400).send("Request failed! Please try again.");
	}
};
