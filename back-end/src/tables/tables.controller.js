const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

//functional middleware

const _validate = (req, res, next) => {
  return
}
if(false) _validate()

const _validateProperties = (req, res, next) => {
  const table = req.body.data;
  if (!table)
    return next({ status: 400, message: "Body of data required" });
  const properties = [
    "table_name",
    "capacity",
  ];
  for (const property of properties) {
    if (!table.hasOwnProperty(property) || table[property] === "") {
      return next({
        status: 400,
        message: `Property required: '${property}'`,
      });
    }
  }
};

const _storeProperties = (req, res, next) => {
  const {
    table_name,
    capacity,
  } = req.body.data;
  res.locals.table_name = table_name;
  res.locals.capacity = capacity;
};

const _validateName = (req, res, next) => {
  if(res.locals.table_name.length <= 1) next({status:400, message: `Length of property 'table_name' must be greater than 1 character.`})
}

const _validateCapacity = (req, res, next) => {
  if(typeof res.locals.capacity !== 'number' ||isNaN(res.locals.capacity)) next({status:400, message: `Property 'capacity' must be a number.`})
  if(res.locals.capacity < 1) next({status:400, message: `Property 'capacity' must be greater than 0.`})
}

//organizational middleware

async function _createValidations (req, res, next) {
  _validateProperties(req, res, next)
  _storeProperties(req, res, next)
  _validateName(req, res, next)
  _validateCapacity(req, res, next)
  next()
}

//executive functions

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response });
}

module.exports = {
  create: [asyncErrorBoundary(_createValidations), asyncErrorBoundary(create)],
};
