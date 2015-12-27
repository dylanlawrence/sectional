(function() {
  'use strict';

  angular
    .module('sectional')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
