(function() {
  'use strict';

  angular
    .module('sectional')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    //$log.debug('runBlock end');

    Offline.options = {
      interceptRequests: false,
      requests: false,
      reconnect: {
        initialDelay: 3,
        delay: (500)
      }
    };

    Offline.on('up', function(e){
      $log.debug(e);
      $log.info("we're back, Let's Party!");
    } , '');

    Offline.on('down', function(e){
      $log.debug(e);
      $log.info("We're down, Oh Crap!");
    } , '');

    Offline.on('confirmed-down', function(e){
      $log.debug(e);
      $log.info('Still Down');
    } , '');

  }

})();
