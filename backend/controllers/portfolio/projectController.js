const Project = require("../../models/Project");
const { makeCrudController } = require("./crudFactory");

module.exports = makeCrudController(Project, "Project");