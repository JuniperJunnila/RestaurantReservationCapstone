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
    .whereNot({status: 'finished'})
    .orderBy("reservation_time");
}

function listById(reservation_id) {
  return db("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .orderBy("reservation_time");
}

function toSeated(reservation_id) {
  return db("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: "seated" });
}

function toFinished(reservation_id) {
  return db("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: "finished" });
}

function toBooked(reservation_id) {
  return db("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: "booked" });
}

module.exports = {
  create,
  list,
  listById,
  toBooked,
  toSeated,
  toFinished,
};
