'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_categories = sequelize.define('users_categories', {
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {});
  users_categories.associate = function(models) {
    // associations can be defined here
  };
  return users_categories;
};