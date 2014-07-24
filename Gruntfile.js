var version = require('./build/version'),
    setup = require('./build/setup');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-nuget');

    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        setup: {
            testsite: {
                cwd: './testsite'
            }
        },
        typescript: {
            build: {
                src: ['src/_Version.ts', 'src/*.ts', 'src/**/*.ts'],
                dest: 'Fayde.Controls.js',
                options: {
                    target: 'es5',
                    declaration: true,
                    sourceMap: true
                }
            },
            testsite: {
                src: ['testsite/**/*.ts'],
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourceMap: true
                }
            }
        },
        copy: {
            pretestsite: {
                files: [
                    { expand: true, flatten: true, src: ['Themes/*'], dest: 'testsite/lib/Fayde.Controls/Themes', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['Fayde.Controls.js'], dest: 'testsite/lib/Fayde.Controls', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['Fayde.Controls.d.ts'], dest: 'testsite/lib/Fayde.Controls', filter: 'isFile' }
                ]
            },
            deploy: {
                files: [
                    { expand: true, flatten: true, src: ['Themes/*'], dest: 'nuget/content/lib/Fayde.Controls/Themes', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['Fayde.Controls.js'], dest: 'nuget/content/lib/Fayde.Controls', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['Fayde.Controls.d.ts'], dest: 'nuget/content/lib/Fayde.Controls', filter: 'isFile' }
                ]
            }
        },
        connect: {
            server: {
                options: {
                    port: 8002,
                    base: './testsite/'
                }
            }
        },
        watch: {
            src: {
                files: ['src/**/*.ts'],
                tasks: ['typescript:build']
            },
            dist: {
                files: ['Fayde.Controls.js'],
                tasks: ['copy:pretestsite']
            },
            testsitets: {
                files: ['testsite/**/*.ts'],
                tasks: ['typescript:testsite']
            },
            testsitejs: {
                files: ['testsite/**/*.js'],
                options: {
                    livereload: 35730
                }
            },
            testsitefay: {
                files: ['testsite/**/*.fap', 'testsite/**/*.fayde'],
                options: {
                    livereload: 35730
                }
            }
        },
        open: {
            testsite: {
                path: 'http://localhost:8002/default.html'
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
                src: './nuget/Fayde.Controls.nuspec',
                dest: './nuget/',
                options: {
                    version: '<%= pkg.version %>'
                }
            }
        },
        nugetpush: {
            dist: {
                src: './nuget/Fayde.Controls.<%= pkg.version %>.nupkg'
            }
        }
    });

    grunt.registerTask('default', ['version:apply', 'typescript:build']);
    grunt.registerTask('testsite', ['setup:testsite', 'version:apply', 'typescript:build', 'copy:pretestsite', 'typescript:testsite', 'connect', 'open', 'watch']);
    setup(grunt);
    version(grunt);
    grunt.registerTask('package', ['copy:deploy', 'nugetpack:dist']);
    grunt.registerTask('publish', ['copy:deploy', 'nugetpack:dist', 'nugetpush:dist']);
};