const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

function create() {
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response });
}

module.exports = {
  create: [asyncErrorBoundary(create)],
};
