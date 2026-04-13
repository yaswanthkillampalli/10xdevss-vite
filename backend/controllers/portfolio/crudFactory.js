const { successResponse, errorResponse } = require("../../utils/response");

const makeCrudController = (Model, modelName) => ({
  getAll: async (req, res) => {
    try {
      const items = await Model.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return successResponse(res, {
        message: `${modelName} records fetched.`,
        data: items,
      });
    } catch (error) {
      console.error(`${modelName} getAll error:`, error);
      return errorResponse(res, { statusCode: 500, message: `Could not fetch ${modelName} records.` });
    }
  },

  getOne: async (req, res) => {
    try {
      const item = await Model.findOne({ _id: req.params.id, userId: req.user._id });
      if (!item) {
        return errorResponse(res, { statusCode: 404, message: `${modelName} not found.` });
      }
      return successResponse(res, { message: `${modelName} fetched.`, data: item });
    } catch (error) {
      console.error(`${modelName} getOne error:`, error);
      return errorResponse(res, { statusCode: 500, message: `Could not fetch ${modelName}.` });
    }
  },

  create: async (req, res) => {
    try {
      const item = await Model.create({ ...req.body, userId: req.user._id });
      return successResponse(res, {
        statusCode: 201,
        message: `${modelName} created successfully.`,
        data: item,
      });
    } catch (error) {
      console.error(`${modelName} create error:`, error);
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((entry) => ({
          field: entry.path,
          message: entry.message,
        }));
        return errorResponse(res, { statusCode: 422, message: "Validation failed.", errors });
      }
      if (error.code === 11000) {
        return errorResponse(res, { statusCode: 409, message: `This ${modelName} already exists.` });
      }
      return errorResponse(res, { statusCode: 500, message: `Could not create ${modelName}.` });
    }
  },

  update: async (req, res) => {
    try {
      const { userId, ...updateData } = req.body;

      const item = await Model.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!item) {
        return errorResponse(res, { statusCode: 404, message: `${modelName} not found.` });
      }
      return successResponse(res, { message: `${modelName} updated successfully.`, data: item });
    } catch (error) {
      console.error(`${modelName} update error:`, error);
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((entry) => ({
          field: entry.path,
          message: entry.message,
        }));
        return errorResponse(res, { statusCode: 422, message: "Validation failed.", errors });
      }
      return errorResponse(res, { statusCode: 500, message: `Could not update ${modelName}.` });
    }
  },

  remove: async (req, res) => {
    try {
      const item = await Model.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
      if (!item) {
        return errorResponse(res, { statusCode: 404, message: `${modelName} not found.` });
      }
      return successResponse(res, { message: `${modelName} deleted successfully.` });
    } catch (error) {
      console.error(`${modelName} delete error:`, error);
      return errorResponse(res, { statusCode: 500, message: `Could not delete ${modelName}.` });
    }
  },
});

module.exports = { makeCrudController };