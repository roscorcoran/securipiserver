'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'myServer.js',
          // Will turn into: `node OPT1 OPT2 ... OPTN path/to/server.js ARG1 ARG2 ... ARGN`
          // (e.g. opts: ['node_modules/coffee-script/bin/coffee'] will correctly parse coffee-script)
          opts: [ ],
          args: [ ],

          // Setting to `false` will effectively just run `node path/to/server.js`
          //background: true,

          // Called when the spawned server throws errors
          //fallback: function() {},

          // Override node env's PORT
          port: 8080,

          // Override node env's NODE_ENV
          //node_env: undefined,

          // Consider the server to be "running" after an explicit delay (in milliseconds)
          // (e.g. when server has no initial output)
          //delay: 0,

          // Regular expression that matches server output to indicate it is "running"
          //output: ".+",

          // Set --debug
          //debug: false
        }
      },
      prod: {
        options: {
          script: 'path/to/prod/server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'path/to/test/server.js'
        }
      }
    },
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      src: ['myServer.js', 'Gruntfile.js', 'models/*.js', 'routes/*.js'],
      options: {
        node: true,
        devel:true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          require: true,
          define: true,
          requirejs: true,
          describe: true,
          expect: true,
          it: true
        },
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      express: {
        files:  [ 'myServer.js', 'Gruntfile.js', 'models/*.js', 'routes/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  // Default task.
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('server', [ 'express:dev', 'watch' ]);

};
