(function() {
  'use strict';

  angular
    .module('app')
    .config(Config);

  Config.$inject = ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider'];

  function Config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

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
        component: 'about',
        resolve: {
          load: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
            var deferred = $q.defer();
            require.ensure([], function() {
              var module = require('./about/about.module');
              $ocLazyLoad.inject('app.about');

              deferred.resolve();
            });
            return deferred.promise;
          }]
        }
      })

      .state({
        name: 'contact',
        url: '/contact',
        component: 'contact',
        resolve: {
          load: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
            var deferred = $q.defer();
            require.ensure([], function() {
              var module = require('./contact/contact.module');
              $ocLazyLoad.inject('app.contact');

              deferred.resolve(module);
            });
            return deferred.promise;
          }]
        }
      });

  }

})();