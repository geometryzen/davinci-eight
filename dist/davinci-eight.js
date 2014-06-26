(function(global, define) {
  var globalDefine = global.define;
/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../vendor/almond/almond", function(){});

define('eight/core',["require", "exports"], function(require, exports) {
    var eight = {
        VERSION: '0.0.1'
    };

    
    return eight;
});

define('eight/core/geometry',["require", "exports"], function(require, exports) {
    var geometry = function (spec) {
        var that = {
            vertices: [],
            vertexIndices: [],
            colors: [],
            primitiveMode: function (gl) {
                return gl.TRIANGLES;
            }
        };

        return that;
    };
    
    return geometry;
});

define('eight/core/material',["require", "exports"], function(require, exports) {
    var material = function (spec) {
        var api = {};

        return api;
    };

    
    return material;
});

define('eight/math/e3ga/euclidean3',["require", "exports"], function(require, exports) {
    var euclidean3 = function (spec) {
        return null;
    };

    
    return euclidean3;
});

define('eight/math/e3ga/scalarE3',["require", "exports", 'eight/math/e3ga/euclidean3'], function(require, exports, euclidean3) {
    var scalarE3 = function (w) {
        return euclidean3({ 'w': w });
    };

    
    return scalarE3;
});

define('eight/math/e3ga/vectorE3',["require", "exports", 'eight/math/e3ga/euclidean3'], function(require, exports, euclidean3) {
    var vectorE3 = function (x, y, z) {
        return euclidean3({ 'x': x, 'y': y, 'z': z });
    };

    
    return vectorE3;
});

define('eight/math/e3ga/bivectorE3',["require", "exports", 'eight/math/e3ga/euclidean3'], function(require, exports, euclidean3) {
    var bivectorE3 = function (xy, yz, zx) {
        return euclidean3({ xy: xy, yz: yz, zx: zx });
    };

    
    return bivectorE3;
});

define('eight/core/object3D',["require", "exports", 'eight/math/e3ga/euclidean3'], function(require, exports, euclidean3) {
    var object3D = function () {
        var that = {
            position: euclidean3(),
            attitude: euclidean3({ w: 1 }),
            onContextGain: function (gl) {
                console.error("Missing onContextGain function");
            },
            onContextLoss: function () {
                console.error("Missing onContextLoss function");
            },
            tearDown: function () {
                console.error("Missing tearDown function");
            },
            updateMatrix: function () {
                console.error("Missing updateMatrix function");
            },
            draw: function (projectionMatrix) {
                console.error("Missing draw function");
            }
        };

        return that;
    };

    
    return object3D;
});

define('eight/cameras/camera',["require", "exports", 'eight/core/object3D'], function(require, exports, object3D) {
    var camera = function () {
        var that = object3D();

        return that;
    };

    
    return camera;
});

define('eight/cameras/perspectiveCamera',["require", "exports", 'eight/cameras/camera'], function(require, exports, camera) {
    var perspectiveCamera = function (fov, aspect, near, far) {
        if (typeof fov === "undefined") { fov = 50; }
        if (typeof aspect === "undefined") { aspect = 1; }
        if (typeof near === "undefined") { near = 0.1; }
        if (typeof far === "undefined") { far = 2000; }
        var base = camera();

        var that = {
            get position() {
                return base.position;
            },
            set position(position) {
                base.position = position;
            },
            get attitude() {
                return base.attitude;
            },
            set attitude(attitude) {
                base.attitude = attitude;
            },
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                aspect = value;
            },
            updateProjectionMatrix: updateProjectionMatrix
        };

        var updateProjectionMatrix = function () {
        };

        return that;
    };

    
    return perspectiveCamera;
});

define('eight/scenes/scene',["require", "exports", 'eight/core/object3D'], function(require, exports, object3D) {
    var scene = function () {
        var kids = [];

        var base = object3D();

        var that = {
            get children() {
                return kids;
            },
            onContextGain: function (gl) {
                for (var i = 0, length = kids.length; i < length; i++) {
                    kids[i].onContextGain(gl);
                }
            },
            onContextLoss: function () {
                for (var i = 0, length = kids.length; i < length; i++) {
                    kids[i].onContextLoss();
                }
            },
            tearDown: function () {
                for (var i = 0, length = kids.length; i < length; i++) {
                    kids[i].tearDown();
                }
            },
            add: function (child) {
                kids.push(child);
            }
        };

        return that;
    };

    
    return scene;
});

define('eight/renderers/webGLRenderer',["require", "exports", 'eight/core'], function(require, exports, core) {
    var webGLRenderer = function (parameters) {
        console.log('eight.js', core.VERSION);

        parameters = parameters || {};

        var canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');
        var alpha = parameters.alpha !== undefined ? parameters.alpha : false;
        var depth = parameters.depth !== undefined ? parameters.depth : true;
        var stencil = parameters.stencil !== undefined ? parameters.stencil : true;
        var antialias = parameters.antialias !== undefined ? parameters.antialias : false;
        var premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
        var preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

        var gl;

        var setViewport = function (x, y, width, height) {
            if (gl) {
                gl.viewport(x, y, width, height);
            }
        };

        function initGL() {
            try  {
                var attributes = {
                    'alpha': alpha,
                    'depth': depth,
                    'stencil': stencil,
                    'antialias': antialias,
                    'premultipliedAlpha': premultipliedAlpha,
                    'preserveDrawingBuffer': preserveDrawingBuffer
                };

                gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);

                if (gl === null) {
                    throw 'Error creating WebGL context.';
                }
            } catch (e) {
                console.error(e);
            }
        }

        var that = {
            get canvas() {
                return canvas;
            },
            get context() {
                return gl;
            },
            onContextGain: function (context) {
                gl = context;
                gl.clearColor(32 / 256, 32 / 256, 32 / 256, 1.0);
                gl.enable(gl.DEPTH_TEST);
            },
            onContextLoss: function () {
            },
            clearColor: function (r, g, b, a) {
                if (gl) {
                    gl.clearColor(r, g, b, a);
                }
            },
            render: function (scene, camera) {
                if (gl) {
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    var children = scene.children;
                    for (var i = 0, length = children.length; i < length; i++) {
                        children[i].draw(camera.projectionMatrix);
                    }
                }
            },
            viewport: function (x, y, width, height) {
                if (gl) {
                    gl.viewport(x, y, width, height);
                }
            },
            setSize: function (width, height, updateStyle) {
                canvas.width = width;
                canvas.height = height;

                if (updateStyle !== false) {
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                }

                setViewport(0, 0, width, height);
            }
        };

        initGL();

        return that;
    };

    
    return webGLRenderer;
});

define('eight/materials/meshBasicMaterial',["require", "exports", 'eight/core/material'], function(require, exports, material) {
    var meshBasicMaterial = function (spec) {
        var api = material(spec);

        return api;
    };

    
    return meshBasicMaterial;
});

define('eight/shaders/shader-vs',["require", "exports"], function(require, exports) {
    var source = [
        "attribute vec3 aVertexPosition;",
        "attribute vec3 aVertexColor;",
        "attribute vec3 aVertexNormal;",
        "uniform mat4 uMVMatrix;",
        "uniform mat3 uNormalMatrix;",
        "uniform mat4 uPMatrix;",
        "varying highp vec4 vColor;",
        "varying highp vec3 vLight;",
        "void main(void)",
        "{",
        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
        "vColor = vec4(aVertexColor, 1.0);",
        "vec3 ambientLight = vec3(0.1, 0.1, 0.1);",
        "vec3 diffuseLightColor = vec3(0.5, 0.5, 0.5);",
        "vec3 L = normalize(vec3(10.0, 10.0, 5.0));",
        "vec3 N = normalize(uNormalMatrix * aVertexNormal);",
        "float diffuseLightAmount = max(dot(N, L), 0.0);",
        "vLight = ambientLight + (diffuseLightAmount * diffuseLightColor);",
        "}"
    ].join('\n');
    
    return source;
});

define('eight/shaders/shader-fs',["require", "exports"], function(require, exports) {
    var source = [
        "varying highp vec4 vColor;",
        "varying highp vec3 vLight;",
        "void main(void)",
        "{",
        "gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);",
        "}"
    ].join('\n');
    
    return source;
});

define('eight/objects/mesh',["require", "exports", 'eight/core/geometry', 'eight/materials/meshBasicMaterial', 'eight/core/object3D', 'eight/shaders/shader-vs', 'eight/shaders/shader-fs'], function(require, exports, geometryConstructor, meshBasicMaterial, object3D, vs_source, fs_source) {
    var mesh = function (geometry, material) {
        var gl = null;
        var vs = null;
        var fs = null;
        var program = null;
        var vbo = null;
        var vbn = null;
        var vbc = null;
        var mvMatrixUniform = null;
        var normalMatrixUniform = null;
        var pMatrixUniform = null;
        var mvMatrix = mat4.create();
        var normalMatrix = mat3.create();
        geometry = geometry || geometryConstructor();
        material = material || meshBasicMaterial({ 'color': Math.random() * 0xffffff });

        var base = object3D();

        var that = {
            get position() {
                return base.position;
            },
            set position(position) {
                base.position = position;
            },
            get attitude() {
                return base.attitude;
            },
            set attitude(attitude) {
                base.attitude = attitude;
            },
            projectionMatrix: mat4.create(),
            onContextGain: function (context) {
                gl = context;

                vs = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vs, vs_source);
                gl.compileShader(vs);
                if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS) && !gl.isContextLost()) {
                    var infoLog = gl.getShaderInfoLog(vs);
                    alert("Error compiling vertex shader:\n" + infoLog);
                }

                fs = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fs, fs_source);
                gl.compileShader(fs);
                if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS) && !gl.isContextLost()) {
                    var infoLog = gl.getShaderInfoLog(fs);
                    alert("Error compiling fragment shader:\n" + infoLog);
                }

                program = gl.createProgram();

                gl.attachShader(program, vs);
                gl.attachShader(program, fs);
                gl.linkProgram(program);

                if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
                    var infoLog = gl.getProgramInfoLog(program);
                    alert("Error linking program:\n" + infoLog);
                }

                vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), gl.STATIC_DRAW);

                vbn = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbn);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);

                vbc = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbc);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.colors), gl.STATIC_DRAW);

                mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
                normalMatrixUniform = gl.getUniformLocation(program, "uNormalMatrix");
                pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
            },
            onContextLoss: function () {
                vs = null;
                fs = null;
                program = null;
                vbc = null;
                vbo = null;
                vbn = null;
                mvMatrixUniform = null;
                pMatrixUniform = null;
            },
            tearDown: function () {
                gl.deleteShader(vs);
                gl.deleteShader(fs);
                gl.deleteProgram(program);
            },
            updateMatrix: function () {
                var v = vec3.fromValues(that.position.x, that.position.y, that.position.z);
                var q = quat.fromValues(-that.attitude.yz, -that.attitude.zx, -that.attitude.xy, that.attitude.w);

                mat4.fromRotationTranslation(mvMatrix, q, v);

                mat3.normalFromMat4(normalMatrix, mvMatrix);
            },
            draw: function (projectionMatrix) {
                if (gl) {
                    gl.useProgram(program);

                    that.updateMatrix();

                    gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);
                    gl.uniformMatrix3fv(normalMatrixUniform, false, normalMatrix);
                    gl.uniformMatrix4fv(pMatrixUniform, false, projectionMatrix);

                    var vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
                    gl.enableVertexAttribArray(vertexPositionAttribute);

                    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

                    var vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
                    gl.enableVertexAttribArray(vertexNormalAttribute);
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbn);
                    gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

                    var vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
                    gl.enableVertexAttribArray(vertexColorAttribute);
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbc);
                    gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

                    gl.drawArrays(gl.TRIANGLES, 0, geometry.triangles.length * 3);
                }
            }
        };

        return that;
    };

    
    return mesh;
});

define('eight/utils/webGLContextMonitor',["require", "exports"], function(require, exports) {
    var webGLContextMonitor = function (canvas, contextLoss, contextGain) {
        var webGLContextLost = function (event) {
            event.preventDefault();
            contextLoss();
        };

        var webGLContextRestored = function (event) {
            event.preventDefault();
            var gl = canvas.getContext('webgl');
            contextGain(gl);
        };

        var that = {
            start: function () {
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
            },
            stop: function () {
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
            }
        };

        return that;
    };

    
    return webGLContextMonitor;
});

define('eight/utils/workbench3D',["require", "exports"], function(require, exports) {
    var EVENT_NAME_RESIZE = 'resize';

    var TAG_NAME_CANVAS = 'canvas';

    function removeElementsByTagName(doc, tagname) {
        var elements = doc.getElementsByTagName(tagname);
        for (var i = elements.length - 1; i >= 0; i--) {
            var e = elements[i];
            e.parentNode.removeChild(e);
        }
    }

    var workbench3D = function (canvas, renderer, camera, win) {
        win = win || window;
        var doc = win.document;

        function onWindowResize(event) {
            var width = win.innerWidth;
            var height = win.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        var that = {
            setUp: function () {
                doc.body.insertBefore(canvas, doc.body.firstChild);
                win.addEventListener(EVENT_NAME_RESIZE, onWindowResize, false);
            },
            tearDown: function () {
                win.removeEventListener(EVENT_NAME_RESIZE, onWindowResize, false);
                removeElementsByTagName(doc, TAG_NAME_CANVAS);
            }
        };

        return that;
    };

    
    return workbench3D;
});

define('eight/utils/windowAnimationRunner',["require", "exports"], function(require, exports) {
    var windowAnimationRunner = function (tick, terminate, setUp, tearDown, win) {
        win = win || window;
        var escKeyPressed = false;
        var pauseKeyPressed = false;
        var enterKeyPressed = false;
        var startTime = null;
        var elapsed = null;
        var MILLIS_PER_SECOND = 1000;
        var requestID = null;
        var exception = null;

        var animate = function (timestamp) {
            if (startTime) {
                elapsed = timestamp - startTime;
            } else {
                startTime = timestamp;
                elapsed = 0;
            }

            if (escKeyPressed || terminate(elapsed / MILLIS_PER_SECOND)) {
                escKeyPressed = false;

                win.cancelAnimationFrame(requestID);
                win.document.removeEventListener('keydown', onDocumentKeyDown, false);
                try  {
                    tearDown(exception);
                } catch (e) {
                    console.log(e);
                }
            } else {
                requestID = win.requestAnimationFrame(animate);
                try  {
                    tick(elapsed / MILLIS_PER_SECOND);
                } catch (e) {
                    exception = e;
                    escKeyPressed = true;
                }
            }
        };

        var onDocumentKeyDown = function (event) {
            if (event.keyCode == 27) {
                escKeyPressed = true;
                event.preventDefault();
            } else if (event.keyCode == 19) {
                pauseKeyPressed = true;
                event.preventDefault();
            } else if (event.keyCode == 13) {
                enterKeyPressed = true;
                event.preventDefault();
            }
        };

        var that = {
            start: function () {
                setUp();
                win.document.addEventListener('keydown', onDocumentKeyDown, false);
                requestID = win.requestAnimationFrame(animate);
            },
            stop: function () {
                escKeyPressed = true;
            }
        };

        return that;
    };

    
    return windowAnimationRunner;
});

define('eight/geometries/boxGeometry',["require", "exports", 'eight/core/geometry', 'eight/math/e3ga/vectorE3'], function(require, exports, geometry, vectorE3) {
    var vertexList = [
        vectorE3(-0.5, -0.5, +0.5),
        vectorE3(+0.5, -0.5, +0.5),
        vectorE3(+0.5, +0.5, +0.5),
        vectorE3(-0.5, +0.5, +0.5),
        vectorE3(-0.5, -0.5, -0.5),
        vectorE3(+0.5, -0.5, -0.5),
        vectorE3(+0.5, +0.5, -0.5),
        vectorE3(-0.5, +0.5, -0.5)
    ];

    var triangles = [
        [0, 1, 2],
        [0, 2, 3],
        [4, 7, 5],
        [5, 7, 6],
        [0, 7, 4],
        [0, 3, 7],
        [1, 5, 2],
        [2, 5, 6],
        [2, 7, 3],
        [2, 6, 7],
        [0, 5, 1],
        [0, 4, 5]
    ];

    var boxGeometry = function (spec) {
        var base = geometry(spec);

        var api = {
            triangles: triangles,
            vertices: [],
            normals: [],
            colors: []
        };

        for (var t = 0; t < triangles.length; t++) {
            var triangle = triangles[t];

            var v0 = vertexList[triangle[0]];
            var v1 = vertexList[triangle[1]];
            var v2 = vertexList[triangle[2]];

            var perp = v1.sub(v0).cross(v2.sub(v0));
            var normal = perp.div(perp.norm());

            for (var j = 0; j < 3; j++) {
                api.vertices.push(vertexList[triangle[j]].x);
                api.vertices.push(vertexList[triangle[j]].y);
                api.vertices.push(vertexList[triangle[j]].z);

                api.normals.push(normal.x);
                api.normals.push(normal.y);
                api.normals.push(normal.z);

                api.colors.push(0.0);
                api.colors.push(0.0);
                api.colors.push(1.0);
            }
        }
        return api;
    };

    
    return boxGeometry;
});

define('eight/geometries/prismGeometry',["require", "exports", 'eight/core/geometry', 'eight/math/e3ga/vectorE3'], function(require, exports, geometry, vectorE3) {
    var vertexList = [
        vectorE3(-1.0, 0.0, +0.5),
        vectorE3(0.0, 0.0, +0.5),
        vectorE3(1.0, 0.0, +0.5),
        vectorE3(-0.5, 1.0, +0.5),
        vectorE3(0.5, 1.0, +0.5),
        vectorE3(0.0, 2.0, +0.5),
        vectorE3(-1.0, 0.0, -0.5),
        vectorE3(0.0, 0.0, -0.5),
        vectorE3(1.0, 0.0, -0.5),
        vectorE3(-0.5, 1.0, -0.5),
        vectorE3(0.5, 1.0, -0.5),
        vectorE3(0.0, 2.0, -0.5)
    ];

    var triangles = [
        [0, 1, 3],
        [1, 4, 3],
        [1, 2, 4],
        [3, 4, 5],
        [6, 9, 7],
        [7, 9, 10],
        [7, 10, 8],
        [9, 11, 10],
        [0, 3, 6],
        [3, 9, 6],
        [3, 5, 9],
        [5, 11, 9],
        [2, 8, 4],
        [4, 8, 10],
        [4, 10, 5],
        [5, 10, 11],
        [0, 6, 8],
        [0, 8, 2]
    ];

    var prismGeometry = function (spec) {
        var base = geometry(spec);

        var api = {
            triangles: triangles,
            vertices: [],
            normals: [],
            colors: []
        };

        for (var t = 0; t < triangles.length; t++) {
            var triangle = triangles[t];

            var v0 = vertexList[triangle[0]];
            var v1 = vertexList[triangle[1]];
            var v2 = vertexList[triangle[2]];

            var perp = v1.sub(v0).cross(v2.sub(v0));
            var normal = perp.div(perp.norm());

            for (var j = 0; j < 3; j++) {
                api.vertices.push(vertexList[triangle[j]].x);
                api.vertices.push(vertexList[triangle[j]].y);
                api.vertices.push(vertexList[triangle[j]].z);

                api.normals.push(normal.x);
                api.normals.push(normal.y);
                api.normals.push(normal.z);

                api.colors.push(1.0);
                api.colors.push(0.0);
                api.colors.push(0.0);
            }
        }
        return api;
    };

    
    return prismGeometry;
});

define('eight/materials/meshNormalMaterial',["require", "exports", 'eight/core/material'], function(require, exports, material) {
    var meshNormalMaterial = function (spec) {
        var api = material(spec);

        return api;
    };

    
    return meshNormalMaterial;
});

define('eight',["require", "exports", 'eight/core', 'eight/core/geometry', 'eight/core/material', 'eight/math/e3ga/euclidean3', 'eight/math/e3ga/scalarE3', 'eight/math/e3ga/vectorE3', 'eight/math/e3ga/bivectorE3', 'eight/core/object3D', 'eight/cameras/perspectiveCamera', 'eight/scenes/scene', 'eight/renderers/webGLRenderer', 'eight/objects/mesh', 'eight/utils/webGLContextMonitor', 'eight/utils/workbench3D', 'eight/utils/windowAnimationRunner', 'eight/geometries/boxGeometry', 'eight/geometries/prismGeometry', 'eight/materials/meshBasicMaterial', 'eight/materials/meshNormalMaterial'], function(require, exports, core, geometry, material, euclidean3, scalarE3, vectorE3, bivectorE3, object3D, perspectiveCamera, scene, webGLRenderer, mesh, webGLContextMonitor, workbench3D, windowAnimationRunner, boxGeometry, prismGeometry, meshBasicMaterial, meshNormalMaterial) {
    var eight = {
        'VERSION': core.VERSION,
        perspectiveCamera: perspectiveCamera,
        euclidean3: euclidean3,
        scalarE3: scalarE3,
        vectorE3: vectorE3,
        bivectorE3: bivectorE3,
        scene: scene,
        object3D: object3D,
        webGLRenderer: webGLRenderer,
        webGLContextMonitor: webGLContextMonitor,
        workbench3D: workbench3D,
        windowAnimationRunner: windowAnimationRunner,
        mesh: mesh,
        geometry: geometry,
        boxGeometry: boxGeometry,
        prismGeometry: prismGeometry,
        material: material,
        meshBasicMaterial: meshBasicMaterial,
        meshNormalMaterial: meshNormalMaterial
    };
    
    return eight;
});

  var library = require('eight');
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['EIGHT'] = library;
  }
}(this));
