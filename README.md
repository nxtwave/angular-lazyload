# angular-lazyload

This is a seed project for Angular 1.5+ using Webpack and Bootstrap. It demonstrates 

* using Angular UI Router to route to Angular 1.5 components
* bundling the Angular application code,
* bundling the CSS/SCSS code,
* bundling the vendor library code,
* running and testing the application with Webpack Dev Server
* **Lazy Loading** of secondary feature modules

## Lazy Loading

Lazy loading is the main feature of this proof-of-concept. For scaling a large Angular application, we want to
minimize the initial load size and load time and only load portions of the application as they are required
based on user navigation. 

We load the home module for the home page on application startup. When the user navigates to the contact page,
the contact module is loaded, and when the user navigates to the about page, the about module is loaded. The 
application is too small to measure the performance difference. However, you can monitor the loading of resources
through the browser console.

## Application Stack:

* Angular 1.5+
* Angular-UI-Router
* ocLazyLoad
* Javascript 5
* Bootstrap 3.x
* Webpack 2.x
* Webpack-Dev-Server 2.x (for dev testing)

## Scripts:

* build - creates the bundled JS/HTML/CSS for the application in the target directory
* start - starts the application for dev on localhost:8000

# How to Structure App for Webpack

It requires a few minor tweaks to support the Webpack build. Normally, a Webpack build 
starts from the top level source and traverses to find all the code. But with
an Angular application, the top level source is the application module with only Angular
specific text references to the feature modules. 

For lazy loading, only the main feature module is included as a dependency for the app module. The secondary
feature modules are loaded on demand in the route definitions. It uses a third party module called ocLazyLoader
for registration of the lazy loaded module.

## Application Module

We make these modifications to the application module:

* Add require method calls to the main app module to make Webpack traverse the next levels
* Add require method calls to the feature modules to make Webpack traverse the next levels
of application code, notice that only the home feature module (app.home) is loaded as a dependency.
* Add require method calls to the components to include the view templates
* Add require method calls for the CSS to insert the styles

```
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
```
## Feature Modules

The main application module requires the primary feature module. Now each feature module must require
each component and supporting script of the module.

### Home Feature Module

The home feature module requires the home component, and the home component will require the view template file.

```
(function() {
  'use strict';

  angular
    .module('app.home', []);

  require('./home.component.js');

})();
```

### Contact Feature Module

The contact feature module requires the contact component, and the contact component will require the 
view template file.

```
(function () {
  'use strict';

  angular
    .module('app.contact', []);

  require('./contact.component');

})();
```

### About Feature Module

The about feature module requires the about component, and the about component will require the 
view template file.

```
(function() {
  'use strict';

  angular
    .module('app.about', []);

  require('./about.component');

})();
```

## Index.html

The index.html file references the compiled CSS and Javascript files. The file is maintained
in the src/app directory. It is copied to the output public directory by the build process.

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Angular-Webpack-Seed</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link href="bundle.css" rel="stylesheet">

</head>

<body ng-app="app">
  <layout></layout>
  
  <script src="manifest.js"></script>
  <script src="vendor.js"></script>
  <script src="app.js"></script>
</body>
</html>

```

## Application Router

The application router contains each application state which routes to an application component. The home
state maps directly to the home component as it was loaded on application startup. The contact state and the
about state use a resolver to load the module on-demand.

```
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
```

## Webpack Configuration

The application is configured to use separate bundles for application specific code and
vendor library code. It also bundles the CSS and creates a separate css file.

### Entry

The entry for the app bundle starts at the top of the application with application module. The
app bundle will include the main feature bundle, but it will not include the secondary feature
bundles to be loaded lazily.

The entry for the vendor bundle sets an array of vendor library modules, including angular,
angular router, ocLazyLoad, and bootstrap. All vendor library modules will be bundled into a single
file vendor.js.

```
  entry: {

    app: [
      './src/app/app.module.js'
    ],

    vendor: [
      'angular',
      'angular-ui-router',
      'oclazyload',
      'bootstrap'
    ]

  },
```

### Output

The output is set to use the output directory of public and use the filenames for each
bundle created.

```
  output: {
    filename: '[name].js',
    path: './public'
  }
```

### Loaders

The configuration uses custom loaders for file types other than Javascript. 

* CSS - The css loader uses a plugin to extract the styles into a separate file. This is
preferred for caching of the css file and to make sure that a page can be styled prior to
full loading of the Javascript bundle.

* File - The file loader is used to load font files that Webpack will encounter while 
traversing the bootstrap CSS.

* HTML - The html loader is used for loading the html view templates and storing in the
application bundle.

```
  module: {
    loaders: [

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?sourceMap'
        })
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'raw-loader!sass-loader'
        })
      },

      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },

      {
        test: /\.html$/,
        loaders: ['html-loader']
      }

    ]
  }
```

### Plugins

* CommonsChunk - Extracts the common modules from all the bundles and adds them to a common
bundle.

* ExtractText - Sends the bundled CSS styles into a separate file instead of bundling
within the app bundle.

* Provide - It establishes references for JQuery with '$' and 'jquery'.

* Uglify - minimizes and optimizes the bundle output for production.

* CopyWebpack - It is used to copy the index.html from the src/app directory to the
public directory.

```
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','manifest']
    }),

    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false,
      allChunks: true
    }),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),

    new CopyWebpackPlugin(
      [
        {
          from: './src/app/index.html',
          to: './index.html'
        }
      ],
      {
        copyUnmodified: true
      }
    )

  ]
```

# Getting Started

You can clone or fork this repository and then use it as a starting point for your new
application by creating your own components and views. 

```
git clone https://github.com/nxtwave/angular-lazyload.git

npm install
npm start
```

