/*global module*/
module.exports = function( grunt ) {
"use strict";

  var mountFolder = function ( connect, path ) {
    return connect.static( require( "path" ).resolve( path ) );
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    connect: {
      options: {
        port: 9001,
        hostname: "localhost"
      },
      test: {
        options: {
          middleware: function ( connect ) {
            return [
              mountFolder( connect, "." ),
              mountFolder( connect, "test" )
            ];
          }
        }
      }
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      gruntfile: [ "Gruntfile.js" ],
      pagination: [ "*.js", "!Gruntfile.js" ],
      test: "test/spec/**/*.js"
    },
    mocha: {
      all: {
        options: {
          urls: [ "http://localhost:<%= connect.options.port %>/index.html" ]
        }
      }
    }
  });

  // Load all grunt tasks
  require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

  grunt.registerTask( "test", [
    "connect:test",
    "mocha"
  ]);

};
