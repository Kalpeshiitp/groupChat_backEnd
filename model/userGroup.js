const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Group = require('./group');

const UserGroup = sequelize.define('userGroup', {
  userGroupId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'groupId',
    },
  },
});

module.exports = UserGroup;
