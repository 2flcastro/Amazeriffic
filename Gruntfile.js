module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'client/src/js/jquery.min.js' : 'bower_components/jquery/dist/jquery.js',
          'client/src/js/app.min.js' : 'client/src/js/app.js',
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'client/src/css/normalize.min.css' : 'bower_components/normalize-css/normalize.css',
          'client/src/css/skeleton.min.css' : 'client/src/css/skeleton.css',
          'client/src/css/styles.min.css' : 'client/src/css/styles.css',
        }
      }
    },
    concat: {
      js: {
        src: ['client/src/js/jquery.min.js', 'client/src/js/app.min.js'],
        dest: 'client/dist/app.min.js',
      },
      css: {
        src: ['client/src/css/normalize.min.css', 'client/src/css/skeleton.min.css', 'client/src/css/styles.min.css'],
        dest: 'client/dist/styles.min.css',
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Tasks
  grunt.registerTask('minimize', ['uglify', 'cssmin']);
  grunt.registerTask('concatenate', ['concat']);
  grunt.registerTask('default', ['uglify', 'cssmin', 'concat']);
};
