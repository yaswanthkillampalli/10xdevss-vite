const Achievement = require("../../models/Achievement");
const { makeCrudController } = require("./crudFactory");

const baseController = makeCrudController(Achievement, "Achievement");

const getDiscover = async (req, res) => {
	try {
		const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);

		const achievements = await Achievement.find({ userId: { $ne: req.user._id } })
			.sort({ createdAt: -1 })
			.limit(limit)
			.lean();

		return res.status(200).json({
			success: true,
			message: "Recent public achievements fetched successfully.",
			data: achievements.map((item) => ({
				id: item._id,
				title: item.title,
				description: item.description,
				issuingOrganization: item.issuingOrganization,
				date: item.date,
				type: item.type,
				url: item.url,
				image: item.image || null,
				createdAt: item.createdAt,
			})),
		});
	} catch (error) {
		console.error("Achievement discover error:", error);
		return res.status(500).json({
			success: false,
			message: "Could not fetch recent achievements.",
		});
	}
};

module.exports = {
	...baseController,
	getDiscover,
};