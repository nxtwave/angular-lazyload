# angular-webpack-seed
This is a seed project for Angular 1.5+ using Webpack and Bootstrap

So I have built many Angular apps using Bower, and I am fairly new to Webpack. I wanted to remove Bower Components and bundle my app using Webpack into a an app bundle and a vendor bundle. Bundling Angular was fairly simple, but bundling Bootstrap was much more complex. The only examples I found were using ES6, and my apps are still on ES5. I pieced together several examples until I made it work.

Application Stack:

* Angular 1.5+
* Javascript 5
* Bootstrap 3.x
* Webpack 2.x
* Webpack-Dev-Server 2.x (for dev testing)

Scripts:

* build - creates the bundled JS/HTML/CSS for the application in the target directory
* start - starts the application for dev on localhost:8000

# How to Structure App for Webpack

It requires a few minor tweaks to support the Webpack build. Normally, a Webpack build 
starts from the top level source and traverses to find all the code. But with
an Angular application, the top level source is the application module with only Angular
specific text references to the feature modules. 

## Application Module

We make these modifications to the application module:

* Add require method calls to the feature modules to make Webpack traverse the next levels
of application code
* Add require method calls for the CSS to insert the styles

```
(function() {
  'use strict';

  angular.module('app', [
    'app.home',
    'app.layout'
  ]);

  require('bootstrap/dist/css/bootstrap.css');
  require('./app.css');

  require('./home/home.module.js');
  require('./layout/layout.module.js');

})();
```
## Feature Modules

The main application module required the feature module. Now the feature module must require
each component and supporting script of the module.

### Layout Feature Module

```
(function() {
  'use strict';

  angular
    .module('app.layout',[]);

  require('./layout.component.js');

})();
```

### Home Feature Module

```
(function() {
  'use strict';

  angular
    .module('app.home', []);

  require('./home.component.js');

})();
```

## Feature Components

The build is configured to load the view templates into the application javascript (app.js).
So instead of referencing the view templates, the component "requires" the template.

### Layout Feature Component

```
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
```

### Home Feature Component

```
(function() {
  'use strict';

  angular
    .module('app.home')
    .component('home', {
      template: require('./home.view.html'),
      controller: HomeController,
      controllerAs: 'vm'
    });

  function HomeController() {
    var vm = this;

    vm.title = 'Home';

    vm.$onInit = function() {
      console.log('app.home.oninit');
    };

  }
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

## Webpack Configuration

The application is configured to use separate bundles for application specific code and
vendor library code. It also bundles the CSS and creates a separate css file.

### Entry

The entry for the app bundle starts at the top of the application with application module.
The entry for the vendor bundle sets an array of vendor library modules, including angular
and bootstrap.

```
  entry: {

    app: [
      './src/app/app.module.js'
    ],

    vendor: [
      'angular',
      'bootstrap'
    ]

  }
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

    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
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
git clone https://github.com/nxtwave/angular-webpack-seed.git

npm install
npm start
```

The seed application will build, start and run on your browser. But I think you may 
likely use this sample as a general guideline for your new or existing app. Or you 
might just use it to fix that 'one little thing' that has you stuck.
