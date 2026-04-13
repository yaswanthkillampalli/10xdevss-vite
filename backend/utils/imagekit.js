const crypto = require("crypto");

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;

const IMAGEKIT_AUTH_TTL_SECONDS = Number(process.env.IMAGEKIT_AUTH_TTL_SECONDS || 600);

const assertImageKitConfig = () => {
  const missing = [];

  if (!IMAGEKIT_PUBLIC_KEY) missing.push("IMAGEKIT_PUBLIC_KEY");
  if (!IMAGEKIT_PRIVATE_KEY) missing.push("IMAGEKIT_PRIVATE_KEY");

  if (missing.length) {
    throw new Error(`Missing ImageKit env values: ${missing.join(", ")}`);
  }
};

const createImageKitAuthParams = () => {
  assertImageKitConfig();

  const token = crypto.randomBytes(16).toString("hex");
  const expire = Math.floor(Date.now() / 1000) + IMAGEKIT_AUTH_TTL_SECONDS;
  const signature = crypto
    .createHmac("sha1", IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest("hex");

  return {
    signature,
    expire,
    token,
    publicKey: IMAGEKIT_PUBLIC_KEY,
  };
};

module.exports = { createImageKitAuthParams };