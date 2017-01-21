(function() {
  'use strict';

  angular.module('app', [
    'ui.router',

    'app.home',
    'app.contact',
    'app.about',

    'app.layout'
  ]);

  require('bootstrap/dist/css/bootstrap.css');
  require('../sass/app.scss');

  require('./app.routes');

  require('./home/home.module.js');
  require('./contact/contact.module.js');
  require('./about/about.module.js');

  require('./layout/layout.module.js');

})();

