const User = require("../models/user");
const Book = require("../models/book");

exports.register = (req, res) => {
	try {
		const { name, email, password } = req.body;

		User.findOne({ email }).exec((err, user) => {
			if (user) {
				return res.status(400).json({
					error: "Email is taken",
				});
			}

			let newUser = new User({ name, email, password });
			newUser.save((err, success) => {
				if (err) {
					return res.status(400).json({
						error: err,
					});
				}

				res.json({
					message: "Signup success! Please signin.",
				});
			});
		});
	} catch (err) {
		console.log(err);
	}
};

exports.signin = (req, res) => {
	try {
		const { email, password } = req.body;

		User.findOne({ email }).exec((err, user) => {
			if (err || !user) {
				return res.status(400).json({
					error: "User with that email does not exist. Please signup.",
				});
			}

			if (password !== user.password) {
				return res.status(400).json({
					error: "Email and password do not match.",
				});
			}

			const { _id, name, email } = user;

			return res.json({
				user: { _id, name, email },
			});
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getUsers = (req, res) => {
	try {
		User.find({}, { _id: 0, name: 1, email: 1 }, (err, user) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}

			res.json(user);
		});
	} catch (err) {
		console.log(err);
	}
};

exports.requireUser = (req, res, next) => {
	try {
		User.findOne({ _id: req.body.addedBy }, (err, user) => {
			if (err || !user) {
				return res
					.status(400)
					.send("Unauthorized! Create an account first.");
			}

			next();
		});
	} catch (error) {
		console.log(error);
	}
};

exports.canUpdateDeleteBook = (req, res, next) => {
	try {
		const id = req.params.id;

		Book.findOne({ isbn: id }).exec((err, data) => {
			if (err || !data) {
				return res.status(400).json({ error: "Book not found!" });
			}

			let authorizedUser =
				data.addedBy._id.toString() === req.body.addedBy;

			if (!authorizedUser) {
				return res.status(400).send("You are not authorized");
			}

			next();
		});
	} catch (error) {
		console.log(error);
	}
};
