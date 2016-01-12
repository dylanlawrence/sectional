(function () {
  'use strict';


  angular.module('sectional')
    .filter('getById', getByIdFilter);

  function getByIdFilter() {

    return function (input, id) {
      var i = 0;
      for (; i < input.length; i++) {
        if (input[i].id == id) {
          return input[i];
        }
      }
      return null;
    }
  }


})();
