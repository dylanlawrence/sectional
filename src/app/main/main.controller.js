(function () {
  'use strict';
  angular.module('sectional').controller('MainController', MainController);
  MainController.$inject = ['$scope', '$log', 'ENV', 'User', '$http', 'pouchDB', 'toastr'];

  function MainController($scope, $log, ENV, User, $http, pouchDB, toastr) {

    var vm  = this;
    vm.env  = ENV;
    var db  = pouchDB('default');


    $scope.remoteList = [
      {label:'Couch DB', url:ENV.couchDB + 'default'},
      {label:'Drupal Relaxed DB', url: ENV.drupalDB + 'default'}
    ];

    $scope.remote = $scope.remoteList[0];

    $scope.$watch('remote', function(){
      vm.remoteDB = $scope.remote.url;
    });

    //vm.remoteDB = vm.remoteList[0].url;

    vm.alldocs = [];
    // get all docs loaded in db
    vm.getAllDocs = function () {
      db.allDocs({
        include_docs: true,
        descending: true
      }).then(function (res) {
        vm.alldocs = res.rows;
      });
    };

    vm.changes = db.changes({
      live: true,
      include_docs: true,
      heartbeat:10000
    }).$promise
      .then(null, null, vm.getAllDocs);


    vm.hasDocs = function () {
      return vm.alldocs.length != 0;
    }

    // get some dummy data
    vm.getInitData = function () {
      $http({
        method: 'GET',
        url: 'assets/dummy/documents.json'
      }).then(function successCallback(res) {
        toastr.success('Init Data Loaded Success');
        vm.docs = res.data;
      }, function errorCallback(err) {
        $log.error(err);
      });
    }

    // bulk add it to db
    vm.bulkDocs = function () {
      db.bulkDocs(vm.docs).then(function (result) {
        $log(result);
        toastr.success('Bulk Create Success');
        vm.getAllDocs();
      }).catch(function (err) {
        $log.error(err);
      });
    }

    // replicate To
    vm.replicateTo = function () {

      var opts = {
        ajax: {
          withCredentials: true
        }
      };

      db.replicate.to(vm.remoteDB, opts).on('change', function (info) {
        $log.info(info);
        toastr.success('Replicated to ' + vm.remoteDB);
      }).on('paused', function () {
        toastr.info('Paused Replication for ' + vm.remoteDB);
      }).on('active', function () {}).on('denied', function (info) {
        $log.info(info);
        toastr.error('Denied for ' + vm.remoteDB);
      }).on('complete', function (info) {
        $log.info(info);
        if (info.ok) {
          toastr.success('Completed Replication for ' + vm.remoteDB);
        } else {
          angular.forEach(info.errors, function (v) {
            toastr.error(v.status + ' Error ' + v.message);
          });
        }
      }).on('error', function (err) {
        $log.error(err);
        toastr.error('Failed Replication ' + vm.remoteDB);
      });


    };

    // replicate From
    vm.replicateFrom = function () {

      var opts = {
        heartbeat:10000,
        ajax: {
          withCredentials: true
        }
      };

      db.replicate.from(vm.remoteDB, opts).on('change', function (info) {
        $log.info(info);
        toastr.success('Replicated  From ' + vm.remoteDB);
        vm.getAllDocs();
      }).on('paused', function () {
        toastr.info('Paused Replication for ' + vm.remoteDB);
        vm.getAllDocs();
      }).on('active', function () {}).on('denied', function (info) {
        $log.info(info);
        toastr.error('Denied for ' + vm.remoteDB);
      }).on('complete', function (info) {

        // console.log(info);

        if (info.ok) {
          toastr.success('Completed Replication for ' + vm.remoteDB);
          vm.getAllDocs();
        } else {
          angular.forEach(info.errors, function (v) {
            toastr.error(v.status + ' Error ' + v.message);
          });
        }

      }).on('error', function (err) {
        $log.error(err);
        toastr.error('Failed Replication ' + vm.remoteDB);
      });

    };
  }
})();
