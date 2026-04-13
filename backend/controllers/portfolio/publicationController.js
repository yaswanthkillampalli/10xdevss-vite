const Publication = require("../../models/Publication");
const { makeCrudController } = require("./crudFactory");

module.exports = makeCrudController(Publication, "Publication");