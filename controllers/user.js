const User = require("../models/user");

exports.register = (req, res) => {
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
};

exports.signin = (req, res) => {
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
};

exports.getUsers = (req, res) => {
	User.find({}, { _id: 0, name: 1, email: 1 }, (err, user) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}

		res.json(user);
	});
};
