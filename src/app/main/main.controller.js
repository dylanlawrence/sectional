(function() {
    'use strict';
    angular.module('sectional').controller('MainController', MainController);
    MainController.$inject = ['ENV', 'User', '$http', 'pouchDB', 'toastr'];

    function MainController(ENV, User, $http, pouchDB, toastr) {
        var vm = this;
        var db = pouchDB('default');
        var remoteDB = ENV.remoteDB + 'relaxed/default';



        function onChange(change) {
          vm.alldocs.push(change);
        }

        vm.changes = db.changes({
          live: true,
          include_docs: true
        }).$promise
          .then(null, null, onChange);


        //console.log(ENV);
        vm.alldocs = [];
        // get all docs loaded in db
        vm.getAllDocs = function(){
            db.allDocs({
                include_docs: true,
                descending: true
            }).then(function(res) {
                vm.alldocs = res.rows;
            });
        }

        vm.getAllDocs();

        vm.hasDocs = function(){
            return vm.alldocs.length != 0;
        }
        // get some dummy data
        vm.getInitData = function() {
                $http({
                    method: 'GET',
                    url: 'assets/dummy/documents.json'
                }).then(function successCallback(response) {
                    toastr.success('Init Data Loaded Success');
                    vm.docs = response.data;
                }, function errorCallback(response) {});
            }

        // bulk add it to db
        vm.bulkDocs = function() {
                db.bulkDocs(vm.docs).then(function(result) {
                    toastr.success('Bulk Import Success');
                    vm.getAllDocs();
                }).catch(function(err) {
                    console.log(err);
                });
            }

        // replicate To
        vm.replicateTo = function() {

            var opts = {
                ajax: {
                  withCredentials:true
                }
            };

            db.replicate.to(remoteDB, opts).on('change', function(info) {
                toastr.success('Replicated to ' + remoteDB);
            }).on('paused', function() {
                toastr.warn('Paused Replication for ' + remoteDB);
            }).on('active', function() {}).on('denied', function(info) {
                toastr.error('Denied for ' + remoteDB);
            }).on('complete', function(info) {

                console.log(info);

                if(info.ok){
                  toastr.success('Completed Replication for ' + remoteDB);
                }else{
                  angular.forEach( info.errors, function(v,k){
                    toastr.error(v.status + ' Error ' + v.message);
                  });
                }

            }).on('error', function(err) {
                toastr.error('Failed Replication ' + remoteDB);
            });
        };

      // replicate From
      vm.replicateFrom = function() {

        var opts = {
          ajax: {
            withCredentials:true
          }
        };

        db.replicate.from(remoteDB, opts).on('change', function(info) {
          toastr.success('Replicated  From ' + remoteDB);
          vm.getAllDocs();
        }).on('paused', function() {
          toastr.info('Paused Replication for ' + remoteDB);
          vm.getAllDocs();
        }).on('active', function() {}).on('denied', function(info) {
          toastr.error('Denied for ' + remoteDB);
        }).on('complete', function(info) {

          console.log(info);

          if(info.ok){
            toastr.success('Completed Replication for ' + remoteDB);
            vm.getAllDocs();
          } else {
            angular.forEach( info.errors, function(v,k){
              toastr.error(v.status + ' Error ' + v.message);
            });
          }

        }).on('error', function(err) {
          toastr.error('Failed Replication ' + remoteDB);
        });

      };



    };
})();
