const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//functional middleware

const _validateProperties = (req, res, next) => {
  const reservation = req.body.data;
  const properties = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  for (const property of properties) {
    if (!reservation.hasOwnProperty(property) || reservation[property] === "") {
      return next({
        status: 400,
        message: `Property required: '${property}'`,
      });
    }
  }
};

const _storeProperties = (req, res, next) => {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;
  res.locals.first_name = first_name;
  res.locals.last_name = last_name;
  res.locals.mobile_number = mobile_number;
  res.locals.reservation_date = reservation_date;
  res.locals.reservation_time = reservation_time;
  res.locals.people = people;
};

//organizational middleware

function _createValidations(req, res, next) {
  _validateProperties(req, res, next);
  _storeProperties(req, res, next);
  next();
}

//executive functions

async function list(req, res) {
  console.log(req.query);
  const { date } = req.query;
  const reservations = await service.list(date);
  const response = reservations.filter((res) => res.status !== "finished");
  res.json({ data: response });
}

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(_createValidations), asyncErrorBoundary(create)],
};
