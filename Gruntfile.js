module.exports = function (grunt) {

	grunt.initConfig({
		concat: {
			js: {
			  src: [
				  'public/js/example.js',
				  'public/js/example2.js'
			  ],
			  dest: 'public/dist/main.js',
			},
			css:{
				src: [
					'public/css/example.css',
					'public/css/example2.css'
				],
			  	dest: 'public/dist/main.css',
			}
		},

		uglify: {
			js: {
				files: {
					'public/dist/main.min.js': ['public/dist/main.js']
				}
			}
		},

		cssmin: {
			options: {
				shorthandCompacting: false,
				// roundingPrecision: -1
			},
			target: {
				files: {
					'public/dist/main.min.css': ['public/dist/main.css']
				}
			}
		},

		csslint: {
		  strict: {
		    options: {
		      import: 2
		    },
		    src: ['public/dist/main.css']
		  },
		  lax: {
		    options: {
		      import: false
		    },
		    src: ['public/dist/main.css']
		  }
		},

		watch: {
			js: {
				files: ['public/js/**/*.js'],
				tasks: ['concat:js'],
			},
			css: {
				files: ['public/css/**/*.css'],
				tasks: ['concat:css'],
			},

			uglify: {
				files: ['public/dist/main.js'],
				tasks: ['uglify:js'],
			}
		},
	});


	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	grunt.registerTask('default', ['concat', 'uglify:js',  'watch']);
	grunt.registerTask('chrome', [ 'uglify:chrome']);
};
