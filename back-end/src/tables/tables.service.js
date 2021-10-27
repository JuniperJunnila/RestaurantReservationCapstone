const db = require("../db/connection");

function create(table) {
  return db("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  create,
};
