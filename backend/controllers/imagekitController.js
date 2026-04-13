const { createImageKitAuthParams } = require("../utils/imagekit");
const { successResponse, errorResponse } = require("../utils/response");

const getAuthParams = async (req, res) => {
  try {
    const auth = createImageKitAuthParams();

    return successResponse(res, {
      statusCode: 200,
      message: "ImageKit auth parameters generated successfully.",
      data: auth,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return errorResponse(res, {
      statusCode: 500,
      message: "Could not generate ImageKit auth parameters.",
    });
  }
};

module.exports = { getAuthParams };