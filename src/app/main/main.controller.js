(function() {
    'use strict';
    angular.module('sectional').controller('MainController', MainController);
    MainController.$inject = ['$http', 'pouchDB', 'toastr'];

    function MainController($http, pouchDB, toastr) {
        
        var vm = this;
        var db = pouchDB('default');
        var remoteDB = 'http://aqua.local/relaxed/default';
        
        db.allDocs({
            include_docs: true,
            descending: true
        }).then(function(res) {
            vm.data = res;
        });

        //
        $http({
            method: 'GET',
            url: 'app/main/documents.json',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(function successCallback(response) {
            //console.log(response);
            vm.docs = response.data;
        }, function errorCallback(response) {});


        // bulk 
        vm.bulkDocs = function() {
            db.bulkDocs(vm.docs).then(function(result) {
                // handle result
            }).catch(function(err) {
                console.log(err);
            });
            toastr.success('Bulk Import Success');
        }

        // replicate To
        vm.replicateTo = function() {

            db.replicate.to(remoteDB, function (err, result) {
              
              toastr.success('replicated to ' + remoteDB);
              done();
            });
            
        }
    };
})();