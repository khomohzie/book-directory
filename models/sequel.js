const mongoose = require("mongoose");

const sequelSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			unique: true,
			index: true,
		},
		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Sequel", sequelSchema);
