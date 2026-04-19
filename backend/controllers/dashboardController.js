const Project = require("../models/Project");
const Certification = require("../models/Certification");
const Publication = require("../models/Publication");
const Achievement = require("../models/Achievement");
const Experience = require("../models/Experience");
const Skill = require("../models/Skill");
const UserProfile = require("../models/UserProfile");
const { successResponse, errorResponse } = require("../utils/response");

const toInitials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const attachOwners = async (items) => {
  if (!items.length) return [];

  const userIds = items
    .map((item) => item.userId?._id || item.userId)
    .filter(Boolean)
    .map((id) => String(id));

  const uniqueUserIds = [...new Set(userIds)];

  const profiles = await UserProfile.find({ userId: { $in: uniqueUserIds } })
    .select("userId avatar")
    .lean();

  const profileByUserId = new Map(
    profiles.map((profile) => [
      String(profile.userId),
      {
        avatar: profile.avatar || null,
      },
    ])
  );

  return items.map((item) => {
    const user = item.userId || {};
    const userId = String(user._id || user);
    const ownerName = user.fullName || "Unknown";
    const ownerRole = user.role || "student";
    const ownerProfile = profileByUserId.get(userId) || {};

    return {
      ...item,
      owner: {
        id: userId,
        name: ownerName,
        role: ownerRole,
        rollId: user.rollId || null,
        avatar: ownerProfile.avatar || toInitials(ownerName),
        profileLink: `/profile/${userId}`,
      },
    };
  });
};

const getDashboardOverview = async (req, res) => {
  try {
    const recentLimit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);

    const [
      projectCount,
      skillCount,
      certificationCount,
      publicationCount,
      achievementCount,
      experienceCount,
      profile,
      recentProjectsRaw,
      recentCertificationsRaw,
    ] = await Promise.all([
      Project.countDocuments({ userId: req.user._id }),
      Skill.countDocuments({ userId: req.user._id }),
      Certification.countDocuments({ userId: req.user._id }),
      Publication.countDocuments({ userId: req.user._id }),
      Achievement.countDocuments({ userId: req.user._id }),
      Experience.countDocuments({ userId: req.user._id }),
      UserProfile.findOne({ userId: req.user._id }).select("avatar").lean(),
      Project.find({ userId: { $ne: req.user._id } })
        .sort({ createdAt: -1 })
        .limit(recentLimit)
        .populate("userId", "fullName rollId role")
        .lean(),
      Certification.find({ userId: { $ne: req.user._id } })
        .sort({ createdAt: -1 })
        .limit(recentLimit)
        .populate("userId", "fullName rollId role")
        .lean(),
    ]);

    const recentProjectsWithOwner = await attachOwners(recentProjectsRaw);
    const recentCertificationsWithOwner = await attachOwners(recentCertificationsRaw);

    return successResponse(res, {
      message: "Dashboard overview fetched successfully.",
      data: {
        user: {
          id: req.user._id,
          fullName: req.user.fullName,
          rollId: req.user.rollId,
          role: req.user.role,
          avatar: profile?.avatar || toInitials(req.user.fullName),
        },
        stats: {
          projects: projectCount,
          skills: skillCount,
          certifications: certificationCount,
          publications: publicationCount,
          achievements: achievementCount,
          experience: experienceCount,
        },
        recentProjects: recentProjectsWithOwner.map((item) => ({
          id: item._id,
          title: item.title,
          status: item.status,
          stack: item.techStack || [],
          createdAt: item.createdAt,
          owner: item.owner,
        })),
        recentCertifications: recentCertificationsWithOwner.map((item) => ({
          id: item._id,
          title: item.title,
          issuingOrganization: item.issuingOrganization,
          issueDate: item.issueDate,
          credentialId: item.credentialId,
          createdAt: item.createdAt,
          owner: item.owner,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return errorResponse(res, {
      statusCode: 500,
      message: "Could not fetch dashboard overview.",
    });
  }
};

module.exports = { getDashboardOverview };
