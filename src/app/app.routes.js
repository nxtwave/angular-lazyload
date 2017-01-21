(function() {
  'use strict';

  angular
    .module('app')
    .config(Config);

  Config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

      .state({
        name: 'home',
        url: '/home',
        component: 'home'
      })

      .state({
        name: 'about',
        url: '/about',
        component: 'about'
      })

      .state({
        name: 'contact',
        url: '/contact',
        component: 'contact'
      });

  }

})();