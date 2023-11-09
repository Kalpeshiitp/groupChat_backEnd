const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require('./user');

const Group = sequelize.define('group', {
  groupId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = Group;
