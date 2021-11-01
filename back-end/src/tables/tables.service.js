const db = require("../db/connection");

function create(table) {
  return db("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list() {
  return db("tables").select("*").orderBy("table_name");
}

function listById(table_id) {
  return db("tables").select("*").where({ table_id: table_id }).first();
}

function listResById(reservation_id) {
  return db("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function occupy(table_id) {
  return db("tables")
    .where({ table_id: table_id })
    .update({ occupied: true });
}

module.exports = {
  create,
  list,
  listById,
  listResById,
  occupy,
};
