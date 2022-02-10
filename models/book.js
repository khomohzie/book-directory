const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		isbn: {
			type: Number,
		},
		author: {
			type: String,
		},
		sequel: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sequel",
		},
		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
