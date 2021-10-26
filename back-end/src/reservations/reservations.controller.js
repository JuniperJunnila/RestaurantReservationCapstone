const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//functional middleware

const _validateProperties = (req, res, next) => {
  const reservation = req.body.data;
  if (!reservation)
    return next({ status: 400, message: "Body of data required" });
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

const _validateDate = (req, res, next) => {
  const { reservation_date } = res.locals;
  if (!typeof reservation_date === "string" || /[^\d|-]/.test(reservation_date))
    return next({
      status: 400,
      message: `Property is not a valid reservation_date: ${reservation_date}`,
    });
};

const _validateTime = (req, res, next) => {
  const { reservation_time } = res.locals;
  if (!typeof reservation_time === "string" || /[^\d|:]/.test(reservation_time))
    return next({
      status: 400,
      message: `Property is not a valid reservation_time: ${reservation_time}`,
    });
};

const _validatePeople = (req, res, next) => {
  const { people } = res.locals;
  if (
    !people ||
    !typeof people === "number" ||
    typeof people === "string" ||
    isNaN(people)
  )
    return next({
      status: 400,
      message: `Property is not valid number of people: ${people}`,
    });
};

const _validateTimeDate = async (req, res, next) => {
  const { reservation_date, reservation_time } = res.locals;
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const closedOn = 2;
  const resTimeDate = new Date(`${reservation_date}T${reservation_time}`);

  if (resTimeDate.getDay() === closedOn) {
    return next({
      status: 400,
      message: `We're sorry, the restaurant is closed on ${weekdays[closedOn]}s.`,
    });
  }

  if (resTimeDate < Date.now())
    return next({
      status: 400,
      message: `Please enter a reservation date and time that is in the future.`,
    });

  next();
};

//organizational middleware

async function _createValidations(req, res, next) {
  _validateProperties(req, res, next);
  _storeProperties(req, res, next);
  _validateDate(req, res, next);
  _validateTime(req, res, next);
  await _validateTimeDate(req, res, next);
  _validatePeople(req, res, next);
  next();
}

//executive functions

async function list(req, res) {
  const { date } = req.query;
  const reservations = await service.list(date);
  res.json({ data: reservations });
}

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(_createValidations), asyncErrorBoundary(create)],
};
