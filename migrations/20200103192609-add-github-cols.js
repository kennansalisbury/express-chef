'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'githubId', Sequelize.STRING) //addColumn([table to add to], [column name], [data type] )
    .then(() => {
      return queryInterface.addColumn('users', 'githubToken', Sequelize.STRING)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'githubId', Sequelize.STRING)
    .then(() => {
      return queryInterface.removeColumn('users', 'githubToken', Sequelize.STRING)
    })
  }
};
