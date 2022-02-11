const Sequel = require("../models/sequel");

exports.create = async (req, res) => {
	try {
		const { name, addedBy } = req.body;

		let slug = name.toLowerCase().split(" ").join("-");

		let sequel = new Sequel({ name, slug, addedBy });

		await sequel.save((err, data) => {
			if (err) {
				return res.status(400).json({
					Message: "Try changing the sequel name.",
					error: err,
				});
			}

			res.json(data);
		});
	} catch (err) {
		console.log(err);
	}
};

exports.readSequel = async (req, res) => {
	try {
		const { slug } = req.params;

		const sequelExists = await Sequel.findOne({ slug });

		if (!sequelExists) {
			return res.status(400).json({ error: "Sequel does not exist!" });
		}

		const sequelData = await Sequel.aggregate([
			{
				$match: {
					slug,
				},
			},
			{
				$lookup: {
					from: "books",
					localField: "_id",
					foreignField: "sequel",
					as: "books",
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "addedBy",
					foreignField: "_id",
					as: "addedBy",
				},
			},
		]);

		res.send(sequelData);
	} catch (err) {
		console.log(err);
	}
};

exports.getSequels = async (req, res) => {
	try {
		const sequelList = await Sequel.aggregate([
			{
				$lookup: {
					from: "books",
					localField: "_id",
					foreignField: "sequel",
					as: "books",
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "addedBy",
					foreignField: "_id",
					as: "addedBy",
				},
			},
		]);
		// .populate("addedBy", "_id name")
		// .exec();

		res.send(sequelList);
	} catch (err) {
		console.log(err);
	}
};
