'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'facebookId', Sequelize.STRING) //addColumn([table to add to], [column name], [data type] )
    .then(() => {
      return queryInterface.addColumn('users', 'facebookToken', Sequelize.STRING)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'facebookId') 
    .then(() => {
      return queryInterface.removeColumn('users', 'facebookToken')
    })
  }
};
