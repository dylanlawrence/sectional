(function() {
  'use strict';

  angular
    .module('sectional')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');


    Offline.options = {
      interceptRequests: false,
      requests: false,
      reconnect: {
        initialDelay: 3,
        delay: (500)
      }
    };


    Offline.on('up', function(e){
      console.log("we're back, Let's Party!");
    } , '');

    Offline.on('down', function(e){
      console.log("We're down, Oh Crap!");
    } , '');

    Offline.on('confirmed-down', function(e){
      console.log('Still Down');
    } , '');

  }

})();
