module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      ejs: {
        files: ['server/views/**'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['www/**/*.html'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['www/css/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['www/js/**'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: './server/server.js',
          exec: 'node',
          args: [],
          ignoredFiles: ['README.md', 'www/**','node_modules/**', '.DS_Store'],
          watchedExtensions: ['js','coffee'],
          watchedFolders: ['server', 'config'],
          debug: true,
          delayTime: 0.5,
          env: {
            PORT: 8080
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      dev: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  //Load NPM tasks 
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
//    grunt.registerTask('default', ['jshint', 'concurrent']);
  grunt.registerTask('default', ['concurrent:dev']);
};