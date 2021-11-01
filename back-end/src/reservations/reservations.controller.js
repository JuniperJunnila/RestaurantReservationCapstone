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
};

const _validateTimeSameDay = async (req, res, next) => {
  const _asDateString = (date) => {
    return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
      .toString(10)
      .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
  };
  const { reservation_time, reservation_date } = res.locals;
  const today = _asDateString(new Date());
  const now = new Date().getHours() * 100 + new Date().getMinutes();
  const time = Number(reservation_time.slice(0, 2) + reservation_time.slice(3));
  const open = 1030;
  const close = 2230;
  const _timeString = (timeString) => {
    timeString = timeString.toString();
    if (timeString.length <= 2) timeString = "00" + timeString;
    return timeString.slice(0, 2) + ":" + timeString.slice(2);
  };
  const messages = [
    `Please enter a reservation date and time that is in the future.`,
    `This time is before our restaurant is open, please enter a time after ${_timeString(
      open
    )}.`,
    `Our restaurant closes at ${_timeString(
      close
    )}, please enter a time before ${_timeString(
      close - 100
    )} to allow your party the time to eat.`,
  ];
  if (today === reservation_date && time <= now) {
    next({
      status: 400,
      message: messages[0],
    });
  } else if (time < open && time > 0) {
    next({
      status: 400,
      message: messages[1],
    });
  } else if (time > close - 100) {
    next({
      status: 400,
      message: messages[2],
    });
  }
};

const _validateId = async (req, res, next) => {
  const { reservation_id } = req.params;
  const reservation = await service.listById(reservation_id);
  if (!reservation || reservation.length === 0) {
    return next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`,
    });
  }
  res.locals.reservation = reservation;
  next()
};

//organizational middleware

async function _createValidations(req, res, next) {
  _validateProperties(req, res, next);
  _storeProperties(req, res, next);
  _validateDate(req, res, next);
  _validateTime(req, res, next);
  await _validateTimeSameDay(req, res, next);
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

async function listById(req, res) {
  const { reservation } = res.locals;
  res.status(200).json({ data: reservation[0] });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(_createValidations), asyncErrorBoundary(create)],
  listById: [asyncErrorBoundary(_validateId), asyncErrorBoundary(listById)],
};
