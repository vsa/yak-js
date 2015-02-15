/* global module:false */

/**
 * Gruntfile for yakjs
 * @param {?} grunt
 */
module.exports = function grunt(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    var buildDir = './build/';

    // Source and Project directories
    var serverDir = './server/';
    var serverSrcDir = serverDir + 'src/';
    var uiDir = './ui/';
    var uiSrcDir = uiDir + 'src/';

    // Distribution directories.
    var distDir = './dist/';
    var tmpDir = distDir + 'tmp/';
    var pkgDir = './dist/yakjs/';
    var uiPkgDir = pkgDir + 'ui/';

    var banner = ['/**',
            ' * ' + pkg.name,
            ' * @version ' + pkg.version,
            ' * @author ' + pkg.author,
            ' * @created ' + grunt.template.today('yyyy-mm-dd'),
            ' * @license ' + pkg.license,
        ' */\n\n'].join('\n');

    var uiFooter = 'yak.ui.version = \'' + pkg.version + '\';\n';

    grunt.initConfig({
        pkg: pkg,
        clean: {
            dist: [distDir],
            tmp: [tmpDir]
        }
    });

    grunt.config.merge({
        uglify: {
            options: {
                banner: banner
            },
            build: {
                src: pkgDir + pkg.name + '.js',
                dest: pkgDir + pkg.name + '.min.js'
            }
        }
    });

    grunt.config.merge({
        concat: {
            options: {
                separator: '\n'
            },
            server: {
                options: {
                    banner: banner,
                },
                src: [
                        serverDir + '_namespaces.js',
                        serverSrcDir + '**/*.js',
                        serverDir + '_bootstrap.js'
                ],
                dest: pkgDir + pkg.name + '.js',
                nonull: true
            },
            api: {
                options: {
                    banner: banner
                },
                src: [
                        serverDir + '_namespaces.js',
                        serverSrcDir + 'api/**/*.js'
                ],
                dest: uiPkgDir + 'scripts/' + pkg.name + '-api.js',
                nonull: true
            },
            ui: {
                options: {
                    banner: banner,
                    footer: uiFooter
                },
                src: [
                        uiDir + '_namespaces.js',
                        uiSrcDir + '**/*.js',
                        uiDir + '_bootstrap.js'
                ],
                dest: uiPkgDir + 'scripts/' + pkg.name + '-ui.js',
                nonull: true
            },
            less: {
                options: {},
                src: [
                        uiSrcDir + '**/*.less'
                ],
                dest: tmpDir + 'less/' + pkg.name + '-style.less',
                nonull: true
            }
        }
    });

    grunt.config.merge({
        copy: {
            server: {
                files: [
                    {flatten:true, src: ['README.md', 'LICENSE', 'package.json'], dest: pkgDir},
                    {flatten:false, src: ['node_modules/ws/**'], dest: pkgDir},
                    {flatten:false, src: ['node_modules/underscore/**'], dest: pkgDir},
                    {flatten:false, src: ['node_modules/npm/**'], dest: pkgDir},
                    {flatten:false, src: ['node_modules/express/**'], dest: pkgDir},
                    {flatten:false, src: ['node_modules/body-parser/**'], dest: pkgDir},
                    {flatten:true, cwd: serverSrcDir + 'shell/', src: ['*.bat', '*.sh'], dest: pkgDir, expand: true}
                ]
            },
            defaultPlugins: {
                files: [
                    { flatten:true, cwd: serverDir + 'plugins/', src: ['*.js'], dest: pkgDir + 'plugins/', expand: true}
                ]
            },
            defaultInstances: {
                files: [
                    { flatten:true, cwd: serverDir + 'instances/', src: ['*.json'], dest: pkgDir + 'instances/', expand: true}
                ]
            },
            defaultStores: {
                files: [
                    { flatten:true, cwd: serverDir + 'stores/', src: ['*.*'], dest: pkgDir + 'stores/', expand: true}
                ]
            },
            ui: {
                files: [
                    {expand: true, cwd: uiSrcDir, src: ['**/*.*', '!**/*.less', '!**/*.js', '!**/*.mustache'], dest: uiPkgDir, filter: 'isFile'},
                    {expand: true, cwd: uiDir, src: ['ext/**/*'], dest: uiPkgDir}
                ]
            }
        }
    });

    grunt.config.merge({
        eslint: {
            options: {
                config: '.eslintrc'
            },
            server: [serverSrcDir + '**/*.js']
        }
    });

    grunt.config.merge({
        watch: {
            server: {
                files: [serverDir + '**/*.js'],
                tasks: ['compile-server'],
                options: {
                    spawn: false
                }
            },
            client: {
                files: [uiDir + '**/*.*'],
                tasks: ['compile-ui'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.config.merge({
        less: {
            options: {
                paths: [tmpDir + 'less/']
            },
            src: {
                expand: true,
                cwd:    tmpDir + 'less/',
                src:    pkg.name + '-style.less',
                dest:   uiPkgDir + 'style/',
                ext:    '.css'
            }
        }
    });

    grunt.config.merge({
        mustache: {
            dist: {
                files: {
                    src: [uiSrcDir + '**/*.mustache']
                },
                srcMerge: uiSrcDir + 'index.html',
                    target: uiPkgDir + 'index.html'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadTasks(buildDir + 'grunt-tasks');

    grunt.registerTask('compile-server', ['concat:server', 'concat:api', 'uglify']);
    grunt.registerTask('compile-ui', ['concat:api', 'concat:ui', 'concat:less', 'copy:ui', 'less', 'mustache']);

    grunt.registerTask('build-server', [
        'compile-server',
        'copy:server',
        'copy:defaultPlugins',
        'copy:defaultInstances',
        'copy:defaultStores',
        'eslint:server']);
    grunt.registerTask('build-ui', ['compile-ui', 'clean:tmp']);

    grunt.registerTask('dev', ['build-server', 'build-ui', 'watch']);
    grunt.registerTask('compile', ['compile-server', 'compile-ui']);
    grunt.registerTask('build', ['clean', 'build-server', 'build-ui']);

    // TASK: default
    grunt.registerTask('default', ['build']);
};
