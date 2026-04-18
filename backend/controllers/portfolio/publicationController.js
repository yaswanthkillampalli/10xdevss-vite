const Publication = require("../../models/Publication");
const { makeCrudController } = require("./crudFactory");

const baseController = makeCrudController(Publication, "Publication");

const getDiscover = async (req, res) => {
	try {
		const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);

		const publications = await Publication.find({ userId: { $ne: req.user._id } })
			.sort({ createdAt: -1 })
			.limit(limit)
			.lean();

		return res.status(200).json({
			success: true,
			message: "Recent public publications fetched successfully.",
			data: publications.map((item) => ({
				id: item._id,
				title: item.title,
				abstract: item.abstract,
				authors: item.authors || [],
				venue: item.venue,
				venueType: item.venueType,
				publishedDate: item.publishedDate,
				doi: item.doi,
				citationCount: item.citationCount || 0,
				tags: item.tags || [],
				createdAt: item.createdAt,
			})),
		});
	} catch (error) {
		console.error("Publication discover error:", error);
		return res.status(500).json({
			success: false,
			message: "Could not fetch recent publications.",
		});
	}
};

module.exports = {
	...baseController,
	getDiscover,
};