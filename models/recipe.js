'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define('recipe', {
    title: DataTypes.STRING,
    source: DataTypes.STRING,
    sourceUrl: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    time: DataTypes.INTEGER,
    servings: DataTypes.INTEGER,
    ingredientsText: DataTypes.TEXT,
    ingredients: DataTypes.JSONB,
    instructionsText: DataTypes.TEXT,
    instructions: DataTypes.JSONB,
    type: DataTypes.STRING,
    diet: DataTypes.STRING,
    health: DataTypes.STRING
  }, {});
  recipe.associate = function(models) {
    models.recipe.belongsToMany(models.user, {through: 'users_recipes'})
    models.recipe.belongsToMany(models.category, {through: 'recipes_categories'})
  };
  return recipe;
};