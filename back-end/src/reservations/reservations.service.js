const db = require("../db/connection");

function create(reservation) {
  return db("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(date) {
  return db("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

module.exports = {
  create,
  list,
};
