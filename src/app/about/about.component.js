(function() {
  'use strict';

  angular
    .module('app.about')
    .component('about', {
      template: require('./about.view.html'),
      controller: AboutController,
      controllerAs: 'vm'
    });

  function AboutController() {
    var vm = this;

    vm.title = 'About';
  }

})();
