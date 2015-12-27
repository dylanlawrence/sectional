(function() {
  'use strict';

  angular
      .module('sectional')
      .service('User', User);

  /** @ngInject */
  function User() {
    
    var data = [{}];

    this.getTec = getTec;

    function getTec() {
      return data;
    }
    
  }

})();
