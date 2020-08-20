module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	clean: ['dist'],
	copy: {
		main: {
			files: [
				{ expand: true, src: ['assets/css/**'], dest: 'dist/' },
				{ expand: true, src: ['assets/js/**'], dest: 'dist/' },
				{ expand: true, src: ['assets/fonts/**'], dest: 'dist/'},
				{ expand: true, src: ['assets/img/**'], dest: 'dist/'},
				{ expand: true, src: ['cec/**'], dest: 'dist/'},
				{ expand: true, src: ['docs/**'], dest: 'dist/'},
				{ expand: true, src: ['images/**'], dest: 'dist/'},
				{ expand: true, src: ['index/<%= pkg.indexVersion %>/*'], dest: 'dist/', flatten: true },
				{ expand: true, src: ['privacy-policy/**'], dest: 'dist/' },
				{ expand: true, src: ['utility/**'], dest: 'dist/' },
				{ expand: true, src: ['sitemap.xml'], dest: 'dist/' },
				{ expand: true, src: ['.htaccess'], dest: 'dist/' },
				{ expand: true, src: ['web.config'], dest: 'dist/' },
				{ expand: true, src: ['utility_partners.txt'], dest: 'dist/' }
			]
		},
		final: {
			files: [
				{
					expand: true,
					cwd: 'dist/assets/css/<%= pkg.assetsCSSVersion %>/',
					src: ['powerkiosk.min.css', 'styles.css', 'custom.css'],
					dest: 'dist/assets/css/<%= pkg.assetsCSSVersion %>/',
					rename: function(dest, src) {
						return dest + "_" + src.replace(/\.css$/, ".scss");
					}
				}
			]
		}
	},
	concat: { // will load the list in order
		main: { // main files
			src: ['<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/custom-bindings.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/global-constants.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/custom-validation.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/AgentViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/AcknowledgementViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/DateOfBirthViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/VerifyViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/LocationViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/ContractStartDateViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/CustomerViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/RateClassViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/RateViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/FilterItemViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/EntityViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/ServiceTypeViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/UtilityPartners.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/LetterOfAuthorizationViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/SpecialNoticeViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/CustomerDisclosureStatementViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/ServiceViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/ProviderViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/BaseRateViewModel.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/PowerKioskECommerce.js'],
			dest: '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalFile %>.min.js'
		},
		theme: { // theme file
			src: ['<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/jquery.fancybox-2.1.5.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/owl.carousel.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/powerkioskdirect-theme.js'],
			dest: '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalThemeFile %>.min.js'
		},
		utilities: { // utilities file
			src: ['<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/modernizr-2.6.2-respond-1.1.0.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/jquery.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/knockout.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/knockout.validation.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/ekko-lightbox.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/moment.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/bootstrap.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/jquery.autoNumeric.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/jquery.easing-1.3.pack.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/scrollTop.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/scrollTo.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/select2.full.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/tooltip.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/bootstrap-datetimepicker.min.js',
				  '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/accounting.min.js',
					'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/js-cookie.js'
				],
			dest: '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalUtilitiesFile %>.min.js'
		},
		final: {
			src: [
				'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalUtilitiesFile %>.min.js',
				'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalFile %>.min.js',
				'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalThemeFile %>.min.js',
			],
			dest: '<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/pk.min.js'
		}
	},
	cssmin: {
		options: {
			mergeIntoShorthands: false,
			restructuring: false,
			roundingPrecision: -1,
			report: 'gzip'
		},
		target: {
			files: {
				'<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/<%= pkg.finalFile %>.min.css':
					['<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/google-fonts.css',
					 '<%= pkg.assetsCSSLocation %>/font-awesome-4.6.2/css/font-awesome.min.css',
					 '<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/bootstrap.min.css',
					 '<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/jquery-ui.min.css',
					 '<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/bootstrap-datetimepicker.css',
					 '<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/select2.min.css',
					 '<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/awesome-bootstrap-checkbox.css',
					 '<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/owl.carousel.css',
					 '<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/owl.theme.default.min.css',
					 '<%= pkg.assetsCSSLocation %>/<%= pkg.assetsCSSVersion %>/jquery.fancybox.css'
					]
			}
		}
	},
	uglify: {
		my_target: {
		  files: {
			'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalFile %>.min.js': ['<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalFile %>.min.js'],
			'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalThemeFile %>.min.js': ['<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalThemeFile %>.min.js'],
			'<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalUtilitiesFile %>.min.js': ['<%= pkg.assetsJSLocation %>/<%= pkg.assetsJSVersion %>/<%= pkg.finalUtilitiesFile %>.min.js']
		  }
		}
	},
	sass: {
		dist: {
			files: [{
				src: 'dist/assets/css/<%= pkg.assetsCSSVersion %>/pk-vendor.scss',
				dest: 'dist/assets/css/<%= pkg.assetsCSSVersion %>/pk-vendor.css'
			}, {
				src: 'dist/assets/css/<%= pkg.assetsCSSVersion %>/pk.scss',
				dest: 'dist/assets/css/<%= pkg.assetsCSSVersion %>/pk.css'
			}]
		}
	},
	});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default tasks. - run just by executing "grunt" at the command line
  grunt.registerTask('default', ['clean', 'copy:main', 'concat:main', 'concat:theme', 'concat:utilities', 'cssmin', 'uglify', 'copy:final', 'sass', 'concat:final']);
  grunt.registerTask('test', ['clean', 'copy:main', 'concat:main', 'concat:theme', 'concat:utilities', 'cssmin', 'uglify', 'copy:final', 'sass', 'concat:final']);
};