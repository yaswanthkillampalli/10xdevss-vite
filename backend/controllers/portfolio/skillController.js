const Skill = require("../../models/Skill");
const { makeCrudController } = require("./crudFactory");

module.exports = makeCrudController(Skill, "Skill");