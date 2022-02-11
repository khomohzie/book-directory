const express = require("express");

const router = express.Router();

const { create, readSequel, getSequels } = require("../controllers/sequel");

const { requireUser } = require("../controllers/user");

// validators
const { runValidation } = require("../validators");
const { sequelCreateValidator } = require("../validators/sequel");

router.post(
	"/sequel",
	sequelCreateValidator,
	runValidation,
	requireUser,
	create
);
router.get("/sequel/:slug", readSequel);
router.get("/sequels", getSequels);

module.exports = router;