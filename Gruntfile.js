module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appName: 'Slider Pro',
    jsFileName: 'jquery.sliderPro',
    cssFileName: 'slider-pro',
    banner: '/*!\n' +
            '* <%= pkg.prettyName %> - v<%= pkg.version %>\n' +
            '* Homepage: <%= pkg.homepage %>\n' +
            '* Author: <%= pkg.author.name %>\n' +
            '* Author URL: <%= pkg.author.url %>\n*/\n',
    concat: {
      options: {
        separator: '\n\n',
        banner: '<%= banner %>'
      },
      js: {
        src: [
          'src/js/jquery.sliderPro.core.js',
          'src/js/jquery.sliderPro.thumbnails.js',
          'src/js/jquery.sliderPro.conditionalImages.js',
          'src/js/jquery.sliderPro.retina.js',
          'src/js/jquery.sliderPro.lazyLoading.js',
          'src/js/jquery.sliderPro.layers.js',
          'src/js/jquery.sliderPro.fade.js',
          'src/js/jquery.sliderPro.touchSwipe.js',
          'src/js/jquery.sliderPro.caption.js',
          'src/js/jquery.sliderPro.deepLinking.js',
          'src/js/jquery.sliderPro.autoplay.js',
          'src/js/jquery.sliderPro.keyboard.js',
          'src/js/jquery.sliderPro.fullScreen.js',
          'src/js/jquery.sliderPro.buttons.js',
          'src/js/jquery.sliderPro.arrows.js',
          'src/js/jquery.sliderPro.thumbnailTouchSwipe.js',
          'src/js/jquery.sliderPro.thumbnailArrows.js',
          'src/js/jquery.sliderPro.video.js'
        ],
        dest: 'dist/js/<%= jsFileName %>.js'
      },
      css: {
        src: [
          'src/css/slider-pro.core.css',
          'src/css/slider-pro.thumbnails.css',
          'src/css/slider-pro.layers.css',
          'src/css/slider-pro.touch-swipe.css',
          'src/css/slider-pro.caption.css',
          'src/css/slider-pro.full-screen.css',
          'src/css/slider-pro.buttons.css',
          'src/css/slider-pro.arrows.css',
          'src/css/slider-pro.thumbnail-arrows.css',
          'src/css/slider-pro.video.css',
          'src/css/slider-pro.wp.css'
        ],
        dest: 'dist/css/<%= cssFileName %>.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/js/<%= jsFileName %>.min.js': '<%= concat.js.dest %>'
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/css/<%= cssFileName %>.min.css': '<%= concat.css.dest %>'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= concat.js.src %>', '<%= concat.css.src %>'],
      tasks: ['jshint', 'concat', 'uglify', 'cssmin']
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);

};