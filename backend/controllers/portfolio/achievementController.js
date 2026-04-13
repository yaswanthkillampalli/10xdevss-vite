const Achievement = require("../../models/Achievement");
const { makeCrudController } = require("./crudFactory");

module.exports = makeCrudController(Achievement, "Achievement");