const Sequelize = require('sequelize');
const config = require('../config/database.js');

const db = {};
const sequelize = new Sequelize(config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;