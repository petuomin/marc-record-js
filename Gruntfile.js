'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib: {
				src: ['lib/**/*.js']
			},
		 
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: [ 'test/*spec.js' ]
			}
		},

		mocha_istanbul: {
           
            coveralls: {
                src: ['test'],
                options: {
                    coverage: true,
                    check: {
                        lines: 100,
                        statements: 100,
                        branches: 100,
                        functions: 100
                    }
                }
            }
        },


	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha-istanbul');

	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('test', ['mochaTest']);
	grunt.registerTask('coverage', ['mocha_istanbul']);

	grunt.registerTask('default', ['lint', 'test', 'coverage']);
};
