"use strict";

module.exports = function( grunt ) {

  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      paginate: "jquery.paginate.js"
    }
  });

  grunt.loadNpmTasks( "grunt-contrib-jshint" );

};
