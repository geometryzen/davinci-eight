module.exports = function(grunt) {

  var path = require('path');
  var cp = require('child_process');
  var Q = require('q');
  var Builder = require('systemjs-builder');

  // Project configuration.
  grunt.initConfig({

    // Access the package file contents for later use.
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.
    clean: {
      src: ['amd', 'dist', 'documentation', 'system', '.tscache']
    },

    exec: {
      'test': {
        command: 'npm test',
        stdout: true,
        stderr: true
      }
    },

    requirejs: {
      compile: {
        options: {
          mainConfigFile: "requirejs.config.js",
          paths: {
          }
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      amd: {
        src: 'dist/davinci-eight.js',
        dest: 'dist/davinci-eight.min.js'
      },
      system: {
        src: 'dist/davinci-eight-system-es5.js',
        dest: 'dist/davinci-eight-system-es5.min.js'
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: 'src/modules/',
        src: ['davinci-eight.d.ts'],
        dest: 'dist/'
      }
    },

    connect: {
        test: {
            options: {
                port: 8080
            }
        }
    },
    jasmine: {
        taskName: {
            src: 'amd/**/*.js',
            options: {
                specs: 'test/amd/*_test.js',
                host: 'http://127.0.0.1:8080/',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                      baseUrl: 'amd/',
                      paths: {
                      }
                    }
                }
            }
        }
    },

    ts: {
      amdES5 : {
        tsconfig: {
          tsconfig: './tsconfig.amd.json',
          ignoreFiles: true,
          ignoreSettings: true
        },
        options: {
          fast: 'never',
          module: 'amd',
          target: 'ES5',
          moduleResolution: "classic",
          noImplicitAny: false,
          outDir: 'amd',
          sourceMap: false,
          verbose: false
        }
      },
      systemES5 : {
        tsconfig: {
          tsconfig: './tsconfig.system.json',
          ignoreFiles: true,
          ignoreSettings: true
        },
        options: {
          fast: 'never',
          module: 'system',
          target: 'ES5',
          noImplicitAny: false,
          outDir: 'system',
          sourceMap: false,
          verbose: false
        }
      }
    },

    tslint: {
      src: [
        "src/davinci-eight/cameras/Perspective.ts",
        "src/davinci-eight/cameras/PerspectiveCamera.ts",
        "src/davinci-eight/cameras/View.ts",
        "src/davinci-eight/cameras/createFrustum.ts",
        "src/davinci-eight/cameras/createPerspective.ts",
        "src/davinci-eight/cameras/createView.ts",
        "src/davinci-eight/cameras/frustumMatrix.ts",
        "src/davinci-eight/cameras/perspectiveArray.ts",
        "src/davinci-eight/cameras/perspectiveMatrix.ts",
        "src/davinci-eight/cameras/viewArray.ts",
        "src/davinci-eight/cameras/viewMatrix.ts",
        "src/davinci-eight/checks/mustBeArray.ts",
        "src/davinci-eight/checks/mustBeNumber.ts",
        "src/davinci-eight/checks/mustBeString.ts",
        "src/davinci-eight/collections/IUnknownArray.ts",
        "src/davinci-eight/collections/NumberIUnknownMap.ts",
        "src/davinci-eight/collections/StringIUnknownMap.ts",
        "src/davinci-eight/collections/copyToArray.ts",
        "src/davinci-eight/commands/BlendFactor.ts",
        "src/davinci-eight/commands/Capability.ts",
        "src/davinci-eight/commands/ContextAttributesLogger.ts",
        "src/davinci-eight/commands/EIGHTLogger.ts",
        "src/davinci-eight/commands/VersionLogger.ts",
        "src/davinci-eight/commands/WebGLBlendFunc.ts",
        "src/davinci-eight/commands/WebGLClearColor.ts",
        "src/davinci-eight/commands/WebGLDisable.ts",
        "src/davinci-eight/commands/WebGLEnable.ts",
        "src/davinci-eight/commands/glCapability.ts",
        "src/davinci-eight/core/AttribLocation.ts",
        "src/davinci-eight/core/AttribMetaInfo.ts",
        "src/davinci-eight/core/BufferResource.ts",
        "src/davinci-eight/core/Color.ts",
        "src/davinci-eight/core/ColorRGB.ts",
        "src/davinci-eight/core/ColorRGBA.ts",
        "src/davinci-eight/core/ContextController.ts",
        "src/davinci-eight/core/ContextKahuna.ts",
        "src/davinci-eight/core/ContextUnique.ts",
        "src/davinci-eight/core/DrawMode.ts",
        "src/davinci-eight/core/Facet.ts",
        "src/davinci-eight/core/FacetVisitor.ts",
        "src/davinci-eight/core/UniformLocation.ts",
        "src/davinci-eight/core/principalAngle.ts",
        "src/davinci-eight/facets/AmbientLight.ts",
        "src/davinci-eight/facets/ColorFacet.ts",
        "src/davinci-eight/facets/DirectionalLight.ts",
        "src/davinci-eight/facets/EulerFacet.ts",
        "src/davinci-eight/facets/ModelFacet.ts",
        "src/davinci-eight/facets/PointSizeFacet.ts",
        "src/davinci-eight/facets/ReflectionFacetE2.ts",
        "src/davinci-eight/facets/ReflectionFacetE3.ts",
        "src/davinci-eight/facets/Vector3Facet.ts",
        "src/davinci-eight/geometries/AxialSimplexGeometry.ts",
        "src/davinci-eight/geometries/CylinderSimplexGeometry.ts",
        "src/davinci-eight/geometries/SimplexGeometry.ts",
        "src/davinci-eight/geometries/SliceSimplexGeometry.ts",
        "src/davinci-eight/math/Euclidean3.ts",
        "src/davinci-eight/math/G3.ts",
        "src/davinci-eight/math/Mat2R.ts",
        "src/davinci-eight/math/Mat3R.ts",
        "src/davinci-eight/math/Mat4R.ts",
        "src/davinci-eight/math/R1.ts",
        "src/davinci-eight/math/R2.ts",
        "src/davinci-eight/math/R3.ts",
        "src/davinci-eight/math/R4.ts",
        "src/davinci-eight/math/VectorN.ts",
        "src/davinci-eight/models/ModelE2.ts",
        "src/davinci-eight/models/ModelE3.ts",
        "src/davinci-eight/programs/SimpleWebGLProgram.ts",
        "src/davinci-eight/programs/createGraphicsProgram.ts",
        "src/davinci-eight/programs/fragmentShader.ts",
        "src/davinci-eight/programs/glslAttribType.ts",
        "src/davinci-eight/programs/makeWebGLProgram.ts",
        "src/davinci-eight/programs/makeWebGLShader.ts",
        "src/davinci-eight/programs/programFromScripts.ts",
        "src/davinci-eight/programs/smartProgram.ts",
        "src/davinci-eight/programs/vColorRequired.ts",
        "src/davinci-eight/programs/vLightRequired.ts",
        "src/davinci-eight/programs/vertexShader.ts",
        "src/davinci-eight/renderers/IContextRenderer.ts",
        "src/davinci-eight/renderers/initWebGL.ts",
        "src/davinci-eight/renderers/renderer.ts",
        "src/davinci-eight/resources/GraphicsBuffers.ts",
        "src/davinci-eight/scene/Drawable.ts",
        "src/davinci-eight/scene/WebGLRenderer.ts",
        "src/davinci-eight/scene/MonitorList.ts",
        "src/davinci-eight/scene/Scene.ts",
        "src/davinci-eight/scene/createDrawList.ts",
        "src/davinci-eight/utils/EventEmitter.ts",
        "src/davinci-eight/utils/RefCount.ts",
        "src/davinci-eight/utils/Shareable.ts",
        "src/davinci-eight/visual/Arrow.ts",
        "src/davinci-eight/visual/Box.ts",
        "src/davinci-eight/visual/Cylinder.ts",
        "src/davinci-eight/visual/Sphere.ts",
        "src/davinci-eight/visual/VisualComponent.ts",
        "src/davinci-eight/visual/createArrow.ts",
        "src/davinci-eight/visual/createBox.ts",
        "src/davinci-eight/visual/createCylinder.ts",
        "src/davinci-eight/visual/createSphere.ts",
        "src/davinci-eight/visual/vector.ts",
        "src/davinci-eight/visual/visualCache.ts"
      ],
      options: {
        configuration: 'tslint.json'
      }
    },

    watch: {
      scripts: {
        files: ['src/davinci-eight/**/*.ts'],
        tasks: ['ts:systemES5'],
        options: {
          spawn: false
        }
      }
    },

    // Check JavaScript files for errors/warnings
    jshint: {
        src: [
            'Gruntfile.js',
            'amd/**/*.js',
            'cjs/**/*.js',
            'spec/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    },
    // Build TypeScript documentation.
    yuidoc: {
        compile: {
            name: '<%= pkg.name %>',
            description: '<%= pkg.description %>',
            version: '<%= pkg.version %>',
            url: '<%= pkg.homepage %>',
            logo: '../assets/logo.png',
            options: {
                linkNatives: false, // Native types get linked to MDN.
                quiet: true,
                writeJSON: true,
                excludes: [],
                extension: '.ts',
                paths: ['src/davinci-eight'],
                outdir: 'documentation',
                syntaxtype: 'js'  // YUIDocs doesn't understand TypeScript.
            }
        }
    },
    complexity: {
      generic: {
          src: ['amd/**/*.js'],
          options: {
              jsLintXML: 'report.xml', // create XML JSLint-like report
              checkstyleXML: 'checkstyle.xml', // create checkstyle report
              errorsOnly: false, // show only maintainability errors
              cyclomatic: 3,
              halstead: 8,
              maintainability: 100
          }
      }
    }
  });

  function tsc(tsfile, option) {
    var command = "node " + path.resolve(path.dirname(require.resolve("typescript")), "tsc ");
    var optArray = Object.keys(option || {}).reduce(function(res, key) {
            res.push(key);
            if(option[key]){
                res.push(option[key]);
            }
            return res;
        }, []);

    return Q.Promise(function(resolve, reject) {
      var cmd = command + " " + tsfile + " " + optArray.join(" ");
      var childProcess = cp.exec(cmd, {});
      childProcess.stdout.on('data', function (d) { grunt.log.writeln(d); });
      childProcess.stderr.on('data', function (d) { grunt.log.error(d); });

      childProcess.on('exit', function(code) {
        if (code !== 0) {
          reject();
        }
        resolve();
      });
    });
  }

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc'); // enable the YUIDocs task.
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');

  function bundle() {
    // Set the baseURL and load the configuration file.
    var builder = new Builder('./system', './config.js');

    var options = {
      minify: false,
      mangle: true,
      sourceMaps: true,
      lowResSourceMaps: true
    };

    return builder.bundle('davinci-eight.js', 'dist/davinci-eight-system-es5.js', options);
  }

  grunt.registerTask('bundle', "Bundle into system modules", function() {
    var done = this.async();
    bundle()
    .then(function(){
      done(true);
    })
    .catch(function(err){
      console.log(err);
      done(false);
    });
  });

  var compilerSources = [
      "src/davinci-eight.ts"
  ];

  function ES5(xs) {
      return ['--target ES5'].concat(xs);
  }

  function AMD(xs) {
      return ['--module amd'].concat(xs);
  }

  function COMMONJS(xs) {
      return ['--module commonjs'].concat(xs);
  }

  function noImplicitAny(xs) {
      return ['--noImplicitAny'].concat(xs);
  }

  function removeComments(xs) {
      return ['--removeComments'].concat(xs);
  }

  function outDir(where, xs) {
      return ['--outDir', where].concat(xs);
  }

  var argsAMD = AMD(ES5(noImplicitAny(compilerSources)));
  var argsCJS = COMMONJS(ES5(compilerSources));

  grunt.registerTask('buildAMD', "Build", function(){
    var done = this.async();
    tsc(['--declaration'].concat(outDir('amd', argsAMD)).join(" ")).then(function(){
      done(true);
    }).catch(function(){
      done(false);
    });
  });

  grunt.registerTask('buildCJS', "Build", function(){
    var done = this.async();
    tsc(['--declaration'].concat(outDir('cjs', argsCJS)).join(" ")).then(function(){
      done(true);
    }).catch(function(){
      done(false);
    });
  });

  grunt.registerTask('test', ['connect:test', 'jasmine']);

  grunt.registerTask('testAll', ['exec:test', 'test']);

  grunt.registerTask('docs', ['clean', 'compile', 'copy', 'yuidoc']);

  grunt.registerTask('system', ['ts:systemES5', 'bundle']);

  grunt.registerTask('amd', ['ts:amdES5', 'requirejs']);

  grunt.registerTask('dev', ['clean', 'amd', 'copy']);

  grunt.registerTask('default', ['clean', 'tslint', 'system', 'amd', 'uglify', 'copy', 'yuidoc']);
};
