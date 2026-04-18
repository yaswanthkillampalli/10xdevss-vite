const Project = require("../../models/Project");
const UserProfile = require("../../models/UserProfile");
const { makeCrudController } = require("./crudFactory");

const baseController = makeCrudController(Project, "Project");

const toInitials = (name = "") =>
	String(name)
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((chunk) => chunk[0])
		.join("")
		.toUpperCase() || "U";

const getDiscover = async (req, res) => {
	try {
		const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);

		const projects = await Project.find({ userId: { $ne: req.user._id } })
			.sort({ createdAt: -1 })
			.limit(limit)
			.populate("userId", "fullName rollId")
			.lean();

		const ownerIds = [...new Set(projects.map((item) => String(item.userId?._id || item.userId)).filter(Boolean))];
		const profiles = await UserProfile.find({ userId: { $in: ownerIds } })
			.select("userId avatar")
			.lean();

		const avatarByUserId = new Map(profiles.map((profile) => [String(profile.userId), profile.avatar || null]));

		return res.status(200).json({
			success: true,
			message: "Recent public projects fetched successfully.",
			data: projects.map((item) => {
				const ownerId = String(item.userId?._id || item.userId);
				const ownerName = item.userId?.fullName || "Unknown";

				return {
					id: item._id,
					title: item.title,
					description: item.description,
					techStack: item.techStack || [],
					githubUrl: item.githubUrl || null,
					liveUrl: item.liveUrl || null,
					status: item.status,
					startDate: item.startDate,
					endDate: item.endDate,
					isFeatured: Boolean(item.isFeatured),
					createdAt: item.createdAt,
					owner: {
						id: ownerId,
						name: ownerName,
						rollId: item.userId?.rollId || null,
						avatar: avatarByUserId.get(ownerId) || toInitials(ownerName),
					},
				};
			}),
		});
	} catch (error) {
		console.error("Project discover error:", error);
		return res.status(500).json({
			success: false,
			message: "Could not fetch recent projects.",
		});
	}
};

module.exports = {
	...baseController,
	getDiscover,
};