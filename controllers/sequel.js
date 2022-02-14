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

			res.status(200).json(data);
		});
	} catch (err) {
		console.log(err);
		return res
			.status(400)
			.send("Failed to create sequel! Please try again.");
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
		]);

		res.status(200).send(sequelData);
	} catch (err) {
		console.log(err);
		return res
			.status(400)
			.send("Failed to fetch sequel! Please try again.");
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
		]);
		// .populate("addedBy", "_id name")
		// .exec();

		res.status(200).send(sequelList);
	} catch (err) {
		console.log(err);
		return res.status(400).send("Request failed! Please try again.");
	}
};
