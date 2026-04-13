const Experience = require("../../models/Experience");
const { makeCrudController } = require("./crudFactory");

module.exports = makeCrudController(Experience, "Experience");