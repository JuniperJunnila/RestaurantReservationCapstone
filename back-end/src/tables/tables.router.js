const cors = require('cors');
const methodNotAllowed = require('../errors/methodNotAllowed');
const router = require("express").Router();
const controller = require('./tables.controller')

router.use(cors())

router.route('/').post(controller.create).all(methodNotAllowed)

module.exports = router