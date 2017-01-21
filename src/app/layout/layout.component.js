(function() {
  'use strict';

  angular
    .module('app.layout')
    .component('layout', {
      template: require('./layout.view.html'),
      controller: LayoutController,
      controllerAs: 'vm'
    });

  function LayoutController() {
    var vm = this;

    vm.title = 'Der Samen';

  }

})();
