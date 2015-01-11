var version = require('./build/version'),
    setup = require('./build/setup'),
    path = require('path'),
    connect_livereload = require('connect-livereload'),
    gunify = require('grunt-fayde-unify');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    var unify = gunify(grunt);

    var ports = {
        server: 8002,
        livereload: 35730
    };
    var meta = {
        name: 'Fayde.Controls'
    };

    var dirs = {
        test: {
            root: 'test',
            build: 'test/.build',
            lib: 'test/lib'
        },
        testsite: {
            root: 'testsite',
            build: 'testsite/.build',
            lib: 'testsite/lib'
        }
    };

    function mount(connect, dir) {
        return connect.static(path.resolve(dir));
    }

    grunt.initConfig({
        ports: ports,
        meta: meta,
        dirs: dirs,
        pkg: grunt.file.readJSON('./package.json'),
        clean: {
            bower: ['./lib'],
            testsite: [dirs.testsite.lib],
            test: [dirs.test.lib]
        },
        setup: {
            base: {
                cwd: '.'
            }
        },
        symlink: {
            options: {
                overwrite: true
            },
            test: {
                files: [
                    {
                        expand: true,
                        src: ['themes/', 'dist/', 'src/'],
                        dest: '<%= dirs.test.lib %>/<%= meta.name %>'
                    },
                    {
                        expand: true,
                        cwd: 'lib/',
                        src: ['*'],
                        dest: dirs.test.lib,
                        filter: 'isDirectory'
                    }
                ]
            },
            testsite: {
                files: [
                    {
                        expand: true,
                        src: ['themes/', 'dist/', 'src/'],
                        dest: '<%= dirs.testsite.lib %>/<%= meta.name %>'
                    },
                    {
                        expand: true,
                        cwd: 'lib/',
                        src: ['*', '!qunit'],
                        dest: dirs.testsite.lib,
                        filter: 'isDirectory'
                    }
                ]
            },
            localnullstone: {
                files: [
                    {src: '../nullstone', dest: './lib/nullstone'}
                ]
            },
            localminerva: {
                files: [
                    {src: '../minerva', dest: './lib/minerva'}
                ]
            },
            localfayde: {
                files: [
                    {src: '../fayde', dest: './lib/fayde'}
                ]
            }
        },
        typescript: {
            build: {
                src: [
                    'typings/**/*.d.ts',
                    './src/_Version.ts',
                    './src/_Library.ts',
                    './src/*.ts',
                    './src/**/*.ts'
                ].concat(unify.typings({includeSelf: false})),
                dest: './dist/<%= meta.name %>.js',
                options: {
                    target: 'es5',
                    declaration: true,
                    sourceMap: true
                }
            },
            test: {
                src: [
                    'typings/**/*.d.ts',
                    '<%= dirs.test.root %>/**/*.ts',
                    '!<%= dirs.test.lib %>/**/*.ts'
                ].concat(unify.typings()),
                dest: dirs.test.build,
                options: {
                    target: 'es5',
                    basePath: dirs.test.root,
                    module: 'amd',
                    sourceMap: true
                }
            },
            testsite: {
                src: [
                    'typings/*.d.ts',
                    '<%= dirs.testsite.root %>/**/*.ts',
                    '!<%= dirs.testsite.lib %>/**/*.ts'
                ].concat(unify.typings()),
                dest: dirs.testsite.build,
                options: {
                    target: 'es5',
                    basePath: dirs.testsite.root,
                    module: 'amd',
                    sourceMap: true
                }
            }
        },
        qunit: {
            all: ['<%= dirs.test.root %>/*.html']
        },
        connect: {
            server: {
                options: {
                    port: ports.server,
                    base: dirs.testsite.root,
                    middleware: function (connect) {
                        return [
                            connect_livereload({ port: ports.livereload }),
                            mount(connect, dirs.testsite.build),
                            mount(connect, dirs.testsite.root)
                        ];
                    }
                }
            }
        },
        watch: {
            src: {
                files: ['src/**/*.ts'],
                tasks: ['typescript:build']
            },
            testsitets: {
                files: [
                    '<%= dirs.testsite.root %>/**/*.ts',
                    '!<%= dirs.testsite.lib %>/**/*.ts'
                ],
                tasks: ['typescript:testsite']
            },
            testsitejs: {
                files: [
                    '<%= dirs.testsite.build %>/**/*.js'
                ],
                options: {
                    livereload: ports.livereload
                }
            },
            testsitefay: {
                files: [
                    '<%= dirs.testsite.root %>/**/*.fap',
                    '<%= dirs.testsite.root %>/**/*.fayde'
                ],
                options: {
                    livereload: ports.livereload
                }
            }
        },
        open: {
            testsite: {
                path: 'http://localhost:<%= ports.server %>/default.html'
            }
        },
        version: {
            bump: {
            },
            apply: {
                src: './build/_VersionTemplate._ts',
                dest: './src/_Version.ts'
            }
        },
        uglify: {
            options: {
                sourceMap: function (path) {
                    return path.replace(/(.*).min.js/, "$1.js.map");
                },
                sourceMapIn: 'dist/<%= meta.name %>.js.map',
                sourceMapIncludeSources: true
            },
            dist: {
                src: ['dist/<%= meta.name %>.js'],
                dest: 'dist/<%= meta.name %>.min.js'
            }
        }
    });

    grunt.registerTask('default', ['typescript:build']);
    grunt.registerTask('test', ['typescript:build', 'typescript:test', 'qunit']);
    grunt.registerTask('testsite', ['typescript:build', 'typescript:testsite', 'connect', 'open', 'watch']);
    setup(grunt);
    version(grunt);
    grunt.registerTask('lib:reset', ['clean', 'setup', 'symlink:test', 'symlink:testsite']);
    grunt.registerTask('link:minerva', ['symlink:localminerva']);
    grunt.registerTask('link:nullstone', ['symlink:localnullstone']);
    grunt.registerTask('link:fayde', ['symlink:localfayde']);
    grunt.registerTask('dist:upbuild', ['version:bump', 'version:apply', 'typescript:build', 'uglify:dist']);
    grunt.registerTask('dist:upminor', ['version:bump:minor', 'version:apply', 'typescript:build', 'uglify:dist']);
    grunt.registerTask('dist:upmajor', ['version:bump:major', 'version:apply', 'typescript:build', 'uglify:dist']);
};