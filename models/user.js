const mongoose = require("mongoose");
const crypto = require("crypto");

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
		},
		salt: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema.methods = {
	encryptPassword: function (enteredPassword) {
		if (enteredPassword.length >= 6) {
			this.salt = crypto.randomBytes(16).toString("hex");
			this.password = crypto
				.pbkdf2Sync(enteredPassword, this.salt, 10000, 64, "sha512")
				.toString("hex");
		} else {
			throw new Error("Password should have at least 6 characters.");
		}
	},

	authenticatePassword: function (enteredPassword) {
		return (
			this.password ===
			crypto
				.pbkdf2Sync(enteredPassword, this.salt, 10000, 64, "sha512")
				.toString("hex")
		);
	},
};

module.exports = mongoose.model("User", userSchema);
