var version = require('./build/version'),
    setup = require('./build/setup');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-nuget');

    var ports = {
        server: 8002,
        livereload: 35730
    };
    var meta = {
        name: 'Fayde.Controls'
    };

    grunt.initConfig({
        ports: ports,
        meta: meta,
        pkg: grunt.file.readJSON('./package.json'),
        clean: {
            bower: ['./lib'],
            testsite: ['./testsite/lib'],
            test: ['./test/lib']
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
                    { src: './lib/fayde', dest: './test/lib/fayde' },
                    { src: './lib/minerva', dest: './test/lib/minerva' },
                    { src: './lib/qunit', dest: './test/lib/qunit' },
                    { src: './lib/requirejs', dest: './test/lib/requirejs' },
                    { src: './lib/requirejs-text', dest: './test/lib/requirejs-text' },
                    { src: './themes', dest: './test/lib/fayde.controls/themes' },
                    { src: './fayde.controls.js', dest: './test/lib/fayde.controls/fayde.controls.js' },
                    { src: './fayde.controls.d.ts', dest: './test/lib/fayde.controls/fayde.controls.d.ts' },
                    { src: './fayde.controls.js.map', dest: './test/lib/fayde.controls/fayde.controls.js.map' },
                    { src: './src', dest: './test/lib/fayde.controls/src' }
                ]
            },
            testsite: {
                files: [
                    { src: './lib/fayde', dest: './testsite/lib/fayde' },
                    { src: './lib/minerva', dest: './testsite/lib/minerva' },
                    { src: './lib/qunit', dest: './testsite/lib/qunit' },
                    { src: './lib/requirejs', dest: './testsite/lib/requirejs' },
                    { src: './lib/requirejs-text', dest: './testsite/lib/requirejs-text' },
                    { src: './themes', dest: './testsite/lib/fayde.controls/themes' },
                    { src: './fayde.controls.js', dest: './testsite/lib/fayde.controls/fayde.controls.js' },
                    { src: './fayde.controls.d.ts', dest: './testsite/lib/fayde.controls/fayde.controls.d.ts' },
                    { src: './fayde.controls.js.map', dest: './testsite/lib/fayde.controls/fayde.controls.js.map' },
                    { src: './src', dest: './testsite/lib/fayde.controls/src' }
                ]
            },
            localminerva: {
                files: [
                    { src: '../minerva', dest: './lib/minerva' }
                ]
            },
            localfayde: {
                files: [
                    { src: '../fayde', dest: './lib/fayde' }
                ]
            }
        },
        typescript: {
            build: {
                src: ['./lib/minerva/minerva.d.ts', './lib/fayde/fayde.d.ts', './src/_Version.ts', './src/*.ts', './src/**/*.ts'],
                dest: '<%= meta.name %>.js',
                options: {
                    target: 'es5',
                    declaration: true,
                    sourceMap: true
                }
            },
            test: {
                src: ['./lib/minerva/minerva.d.ts', './lib/fayde/fayde.d.ts', './test/**/*.ts', '!./test/lib/**/*.ts'],
                dest: './test/.build',
                options: {
                    target: 'es5',
                    basePath: './test/tests',
                    module: 'amd',
                    sourceMap: true
                }
            },
            testsite: {
                src: ['./lib/minerva/minerva.d.ts', './lib/fayde/fayde.d.ts', './testsite/**/*.ts', '!./testsite/lib/**/*.ts'],
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourceMap: true
                }
            }
        },
        qunit: {
            all: ['test/**/*.html']
        },
        connect: {
            server: {
                options: {
                    port: ports.server,
                    base: './testsite/'
                }
            }
        },
        watch: {
            src: {
                files: ['src/**/*.ts'],
                tasks: ['typescript:build']
            },
            testsitets: {
                files: ['testsite/**/*.ts'],
                tasks: ['typescript:testsite']
            },
            testsitejs: {
                files: ['testsite/**/*.js'],
                options: {
                    livereload: ports.livereload
                }
            },
            testsitefay: {
                files: ['testsite/**/*.fap', 'testsite/**/*.fayde'],
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
        nugetpack: {
            dist: {
                src: './nuget/<%= meta.name %>.nuspec',
                dest: './nuget/',
                options: {
                    version: '<%= pkg.version %>'
                }
            }
        },
        nugetpush: {
            dist: {
                src: './nuget/<%= meta.name %>.<%= pkg.version %>.nupkg'
            }
        }
    });

    grunt.registerTask('default', ['version:apply', 'typescript:build']);
    grunt.registerTask('test', ['version:apply', 'typescript:build', 'typescript:test', 'qunit']);
    grunt.registerTask('testsite', ['version:apply', 'typescript:build', 'typescript:testsite', 'connect', 'open', 'watch']);
    setup(grunt);
    version(grunt);
    grunt.registerTask('package', ['nugetpack:dist']);
    grunt.registerTask('publish', ['nugetpack:dist', 'nugetpush:dist']);
    grunt.registerTask('lib:reset', ['clean', 'setup', 'symlink:test', 'symlink:testsite']);
    grunt.registerTask('link:minerva', ['symlink:localminerva']);
    grunt.registerTask('link:fayde', ['symlink:localfayde']);
};