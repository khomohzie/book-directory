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

				res.send("Book uploaded successfully!");
			});
		});
	} catch (error) {
		console.error(error);
	}
};

exports.update = (req, res) => {
	try {
		const id = req.params.id;
		const { title, isbn, author, sequel } = req.body;

		const bookExists = Book.findOne({ isbn: id }).exec();

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

			res.send("Book updated successfully!");
		});
	} catch (error) {
		console.log(error);
	}
};

exports.remove = (req, res) => {
	try {
		const id = req.params.id;

		const bookExists = Book.findOne({ isbn: id }).exec();

		if (!bookExists) {
			return res.status(400).json({ error: "Book does not exist!" });
		}

		Book.deleteOne({ isbn: id }).exec((err, book) => {
			if (err) {
				return res.status(400).send("Could not be deleted! Try again.");
			}

			res.send("Book deleted successfully!");
		});
	} catch (error) {
		console.log(error);
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

				res.send(book);
			});
	} catch (error) {
		console.log(error);
	}
};

exports.getBooks = async (req, res) => {
	try {
		const bookList = await Book.find()
			.populate("addedBy", "_id name")
			.populate("sequel", "_id name")
			.exec();

		res.send(bookList);
	} catch (error) {
		console.log(error);
	}
};
