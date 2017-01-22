(function() {
  'use strict';

  angular.module('app', [
    'ui.router',
    'oc.lazyLoad',

    'app.home',

    'app.layout'
  ]);

  require('bootstrap/dist/css/bootstrap.css');
  require('../sass/app.scss');

  require('./app.routes');

  require('./home/home.module.js');

  require('./layout/layout.module.js');

})();

