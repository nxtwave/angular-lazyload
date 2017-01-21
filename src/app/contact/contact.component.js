(function() {
  'use strict';

  angular
    .module('app.contact')
    .component('contact', {
      template: require('./contact.view.html'),
      controller: ContactController,
      controllerAs: 'vm'
    });

  function ContactController() {
    var vm = this;

    vm.title = 'Contact';
  }

})();
