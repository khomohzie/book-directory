const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			maxlength: 64,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
