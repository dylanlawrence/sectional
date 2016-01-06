(function() {
  'use strict';

  angular
    .module('sectional')
    .directive('entityItem', entityItem);


  function entityItem() {

    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/main/entity.item.html',
      scope: {
        doc: '=',
        show:'='
      },
      controller: EntityController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    EntityController.$inject = ['$mdDialog'];
    function EntityController($mdDialog) {

      var vm = this;

      vm.openDialog = function() {
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Opening from the left')
            .content(vm)
            .ariaLabel('Left to right demo')
            .ok('Nice!')
        );
      };

      vm.getIcon = function(){

        if(!vm.doc)
          return;

        var entity_type = vm.doc.hasOwnProperty('@type') ? vm.doc['@type'] : 'search';

        var entity_type = vm.doc.hasOwnProperty('type') ?  vm.doc['type'][0]['target_id'] +'-'+ entity_type : entity_type;


        switch(entity_type){
          case 'user' :
            return 'person';
          case 'node' :
            return 'device_hub';
          case 'property-node' :
            return 'place';
          case 'article-node' :
            return 'library_books';
        }

      };

      //'person';
      //vm.getIcon(d.doc)

      //vm.relativeDate = moment(vm.creationDate).fromNow();

    }

  }








})();
