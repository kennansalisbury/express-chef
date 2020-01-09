'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING
  }, {});
  category.associate = function(models) {
    models.category.belongsTo(models.user, {
      onDelete: 'CASCADE'
    })
    models.category.belongsToMany(models.recipe, {
      through: 'recipes_categories',
      hooks: true,
      onDelete: 'CASCADE'
    })
  };
  return category;
};