const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        isbn: {
            type: Number,
            required: true,
            unique: true
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
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
