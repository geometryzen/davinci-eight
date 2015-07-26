(function(global, define) {
  var globalDefine = global.define;
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
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
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

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
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
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
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

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

define('davinci-eight/core/DataUsage',["require", "exports"], function (require, exports) {
    var DataUsage;
    (function (DataUsage) {
        DataUsage[DataUsage["STATIC_DRAW"] = 0] = "STATIC_DRAW";
        DataUsage[DataUsage["DYNAMIC_DRAW"] = 1] = "DYNAMIC_DRAW";
        DataUsage[DataUsage["STREAM_DRAW"] = 2] = "STREAM_DRAW";
    })(DataUsage || (DataUsage = {}));
    return DataUsage;
});

define('davinci-eight/core/DrawMode',["require", "exports"], function (require, exports) {
    var DrawMode;
    (function (DrawMode) {
        DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
        DrawMode[DrawMode["LINES"] = 1] = "LINES";
        DrawMode[DrawMode["TRIANGLES"] = 2] = "TRIANGLES";
    })(DrawMode || (DrawMode = {}));
    return DrawMode;
});

define('davinci-eight/core',["require", "exports"], function (require, exports) {
    var core = {
        VERSION: '2.29.0'
    };
    return core;
});

define('davinci-eight/math/Vector3',["require", "exports"], function (require, exports) {
    /**
     * @class Vector3
     */
    var Vector3 = (function () {
        /**
         * @class Vector3
         * @constructor
         * @param vector [{x,y,z}]
         */
        function Vector3(vector) {
            this.$x = vector ? vector.x : 0;
            this.$y = vector ? vector.y : 0;
            this.$z = vector ? vector.z : 0;
            this.modified = false;
        }
        Object.defineProperty(Vector3.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
            get: function () {
                return this.$x;
            },
            set: function (value) {
                this.modified = this.modified || this.$x !== value;
                this.$x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
            get: function () {
                return this.$y;
            },
            set: function (value) {
                this.modified = this.modified || this.$y !== value;
                this.$y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            /**
             * @property z
             * @type Number
             */
            get: function () {
                return this.$z;
            },
            set: function (value) {
                this.modified = this.modified || this.$z !== value;
                this.$z = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Performs in-place addition of vectors.
         *
         * @method add
         * @param v {Vector3} The vector to add to this vector.
         */
        Vector3.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        };
        Vector3.prototype.applyMatrix4 = function (m) {
            // input: THREE.Matrix4 affine matrix
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
            return this;
        };
        Vector3.prototype.applyQuaternion = function (q) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var qx = q.x;
            var qy = q.y;
            var qz = q.z;
            var qw = q.w;
            // calculate quat * vector
            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;
            // calculate (quat * vector) * inverse quat
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return this;
        };
        Vector3.prototype.applySpinor = function (spinor) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var qx = spinor.yz;
            var qy = spinor.zx;
            var qz = spinor.xy;
            var qw = spinor.w;
            // calculate quat * vector
            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;
            // calculate (quat * vector) * inverse quat
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return this;
        };
        Vector3.prototype.clone = function () {
            return new Vector3({ x: this.x, y: this.y, z: this.z });
        };
        Vector3.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };
        Vector3.prototype.cross = function (v) {
            return this.crossVectors(this, v);
        };
        Vector3.prototype.crossVectors = function (a, b) {
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            return this;
        };
        Vector3.prototype.distance = function (v) {
            return Math.sqrt(this.quadrance(v));
        };
        Vector3.prototype.quadrance = function (v) {
            var dx = this.x - v.x;
            var dy = this.y - v.y;
            var dz = this.z - v.z;
            return dx * dx + dy * dy + dz * dz;
        };
        Vector3.prototype.divideScalar = function (scalar) {
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.x *= invScalar;
                this.y *= invScalar;
                this.z *= invScalar;
            }
            else {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            return this;
        };
        Vector3.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        };
        Vector3.prototype.length = function () {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return Math.sqrt(x * x + y * y + z * z);
        };
        Vector3.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            return this;
        };
        Vector3.prototype.normalize = function () {
            return this.divideScalar(this.length());
        };
        Vector3.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
        };
        Vector3.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        };
        Vector3.prototype.set = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        Vector3.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector3.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Vector3.prototype.setZ = function (z) {
            this.z = z;
            return this;
        };
        Vector3.prototype.sub = function (v) {
            return this.subVectors(this, v);
        };
        Vector3.prototype.subVectors = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        Vector3.prototype.toString = function () {
            return "Vector3({x: " + this.x + ", y: " + this.y + ", z: " + this.z + "})";
        };
        Vector3.e1 = new Vector3({ x: 1, y: 0, z: 0 });
        Vector3.e2 = new Vector3({ x: 0, y: 1, z: 0 });
        Vector3.e3 = new Vector3({ x: 0, y: 0, z: 1 });
        return Vector3;
    })();
    return Vector3;
});

define('davinci-eight/math/Spinor3',["require", "exports"], function (require, exports) {
    /**
     * @class Spinor3
     */
    var Spinor3 = (function () {
        function Spinor3(spinor) {
            this.yz = spinor ? spinor.yz : 0;
            this.zx = spinor ? spinor.zx : 0;
            this.xy = spinor ? spinor.xy : 0;
            this.w = spinor ? spinor.w : 1;
        }
        Spinor3.prototype.clone = function () {
            return new Spinor3({ yz: this.yz, zx: this.zx, xy: this.xy, w: this.w });
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        Spinor3.prototype.toString = function () {
            return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})";
        };
        return Spinor3;
    })();
    return Spinor3;
});

define('davinci-eight/core/object3D',["require", "exports", '../math/Vector3', '../math/Spinor3'], function (require, exports, Vector3, Spinor3) {
    /**
     * @return {Node3D} The constructed object.
     */
    var object3D = function () {
        var position = new Vector3();
        var attitude = new Spinor3();
        var scale = new Vector3({ x: 1, y: 1, z: 1 });
        var parent = null;
        var children = [];
        var publicAPI = {
            get position() {
                return position;
            },
            set position(value) {
                position = value;
            },
            get attitude() {
                return attitude;
            },
            set attitude(value) {
                attitude = value;
            },
            get scale() {
                return scale;
            },
            set scale(value) {
                scale = value;
            },
            get parent() {
                return parent;
            },
            get children() {
                return children;
            },
            translateOnAxis: function (axis, distance) {
                throw new Error('Not Implemented');
                return publicAPI;
            }
        };
        return publicAPI;
    };
    return object3D;
});

define('davinci-eight/math/Matrix4',["require", "exports"], function (require, exports) {
    /**
     * 4x4 matrix integrating with WebGL.
     * @class Matrix4
     *
     * The correspondence between the elements property index and the matrix entries is...
     *
     *  0  4  8 12
     *  1  5  9 13
     *  2  6 10 14
     *  3  7 11 15
     */
    var Matrix4 = (function () {
        /**
         * Constructs the Matrix4 initialized to the identity matrix.
         * @constructor
         */
        function Matrix4() {
            /**
             * @property elements
             * @type Float32Array
             */
            this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
        Matrix4.prototype.identity = function () {
            this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            return this;
        };
        /**
         *
         */
        Matrix4.prototype.frustum = function (left, right, bottom, top, near, far) {
            var te = this.elements;
            var x = 2 * near / (right - left);
            var y = 2 * near / (top - bottom);
            var a = (right + left) / (right - left);
            var b = (top + bottom) / (top - bottom);
            var c = -(far + near) / (far - near);
            var d = -2 * far * near / (far - near);
            te[0] = x;
            te[4] = 0;
            te[8] = a;
            te[12] = 0;
            te[1] = 0;
            te[5] = y;
            te[9] = b;
            te[13] = 0;
            te[2] = 0;
            te[6] = 0;
            te[10] = c;
            te[14] = d;
            te[3] = 0;
            te[7] = 0;
            te[11] = -1;
            te[15] = 0;
            return this;
        };
        Matrix4.prototype.makeRotationAxis = function (axis, angle) {
            // Based on http://www.gamedev.net/reference/articles/article1199.asp
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x, y = axis.y, z = axis.z;
            var tx = t * x, ty = t * y;
            this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
            return this;
        };
        Matrix4.prototype.mul = function (m) {
            return this.multiplyMatrices(this, m);
        };
        Matrix4.prototype.multiplyMatrices = function (a, b) {
            var ae = a.elements;
            var be = b.elements;
            var te = this.elements;
            var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
            var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
            var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
            var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
            var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
            var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
            var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
            var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
            te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
            te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
            te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
            te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            return this;
        };
        /**
         * Sets the elements of the target matrix to the perspective transformation.
         * The perspective transformation maps homogeneous world coordinates into
         * a cubic viewing volume such that an orthogonal projection of that viewing
         * volume will give the correct linear perspective.
         * @method perspective
         * @param fov {Number} field of view in the vertical direction, measured in radians.
         * @param aspect {Number} The ratio of view width divided by view height.
         * @param near {Number} The distance to the near field plane.
         * @param far {Number} The distance to the far field plane.
         */
        Matrix4.prototype.perspective = function (fov, aspect, near, far) {
            // We can leverage the frustum function, although technically the
            // symmetry in this perspective transformation should reduce the amount
            // of computation required.
            var ymax = near * Math.tan(fov * 0.5); // top
            var ymin = -ymax; // bottom
            var xmin = ymin * aspect; // left
            var xmax = ymax * aspect; // right
            return this.frustum(xmin, xmax, ymin, ymax, near, far);
        };
        /**
         * @method rotate
         * @param attitude  The spinor from which the rotation will be computed.
         */
        Matrix4.prototype.rotate = function (spinor) {
            // The correspondence between quaternions and spinors is
            // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
            var x = -spinor.yz;
            var y = -spinor.zx;
            var z = -spinor.xy;
            var w = spinor.w;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2;
            var yy = y * y2, yz = y * z2, zz = z * z2;
            var wx = w * x2, wy = w * y2, wz = w * z2;
            this.set(1 - yy - zz, xy - wz, xz + wy, 0, xy + wz, 1 - xx - zz, yz - wx, 0, xz - wy, yz + wx, 1 - xx - yy, 0, 0, 0, 0, 1);
            return this;
        };
        /**
         * @method
         * @param i {number} the zero-based index of the row.
         */
        Matrix4.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
        };
        Matrix4.prototype.scale = function (x, y, z) {
            this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
            return this;
        };
        Matrix4.prototype.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            var te = this.elements;
            te[0] = n11;
            te[4] = n12;
            te[8] = n13;
            te[12] = n14;
            te[1] = n21;
            te[5] = n22;
            te[9] = n23;
            te[13] = n24;
            te[2] = n31;
            te[6] = n32;
            te[10] = n33;
            te[14] = n34;
            te[3] = n41;
            te[7] = n42;
            te[11] = n43;
            te[15] = n44;
            return this;
        };
        Matrix4.prototype.toFixed = function (n) {
            var text = [];
            for (var i = 0; i <= 3; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toFixed(n); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix4.prototype.toString = function () {
            var text = [];
            for (var i = 0; i <= 3; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix4.prototype.translate = function (position) {
            this.set(1, 0, 0, position.x, 0, 1, 0, position.y, 0, 0, 1, position.z, 0, 0, 0, 1);
            return this;
        };
        return Matrix4;
    })();
    return Matrix4;
});

define('davinci-eight/core/Symbolic',["require", "exports"], function (require, exports) {
    var Symbolic = (function () {
        function Symbolic() {
        }
        Symbolic.ATTRIBUTE_POSITION = 'position';
        Symbolic.ATTRIBUTE_COLOR = 'color';
        Symbolic.ATTRIBUTE_NORMAL = 'normal';
        Symbolic.UNIFORM_PROJECTION_MATRIX = 'projectionMatrix';
        Symbolic.UNIFORM_MODEL_MATRIX = 'modelMatrix';
        Symbolic.UNIFORM_VIEW_MATRIX = 'viewMatrix';
        Symbolic.UNIFORM_NORMAL_MATRIX = 'normalMatrix';
        Symbolic.UNIFORM_AMBIENT_LIGHT = 'ambientLight';
        return Symbolic;
    })();
    return Symbolic;
});

define('davinci-eight/uniforms/DefaultUniformProvider',["require", "exports"], function (require, exports) {
    /**
     * @class DefaultUniformProvider
     */
    var DefaultUniformProvider = (function () {
        /**
         * @class DefaultUniformProvider
         * @constructor
         */
        function DefaultUniformProvider() {
        }
        /**
         * @method getUniformFloat
         */
        DefaultUniformProvider.prototype.getUniformFloat = function (name) {
            return;
        };
        /**
         * @method getUniformMatrix2
         */
        DefaultUniformProvider.prototype.getUniformMatrix2 = function (name) {
            return;
        };
        /**
         * @method getUniformMatrix3
         */
        DefaultUniformProvider.prototype.getUniformMatrix3 = function (name) {
            return;
        };
        /**
         * @method getUniformMatrix4
         */
        DefaultUniformProvider.prototype.getUniformMatrix4 = function (name) {
            return;
        };
        /**
         * @method getUniformVector2
         */
        DefaultUniformProvider.prototype.getUniformVector2 = function (name) {
            return;
        };
        /**
         * @method getUniformVector3
         */
        DefaultUniformProvider.prototype.getUniformVector3 = function (name) {
            return;
        };
        /**
         * @method getUniformVector4
         */
        DefaultUniformProvider.prototype.getUniformVector4 = function (name) {
            return;
        };
        /**
         *
         * @method getUniformMetaInfos
         * @return An empty object that derived class may modify.
         */
        DefaultUniformProvider.prototype.getUniformMetaInfos = function () {
            var uniforms = {};
            return uniforms;
        };
        return DefaultUniformProvider;
    })();
    return DefaultUniformProvider;
});

define('davinci-eight/utils/uuid4',["require", "exports"], function (require, exports) {
    function uuid4() {
        var maxFromBits = function (bits) {
            return Math.pow(2, bits);
        };
        var limitUI04 = maxFromBits(4);
        var limitUI06 = maxFromBits(6);
        var limitUI08 = maxFromBits(8);
        var limitUI12 = maxFromBits(12);
        var limitUI14 = maxFromBits(14);
        var limitUI16 = maxFromBits(16);
        var limitUI32 = maxFromBits(32);
        var limitUI40 = maxFromBits(40);
        var limitUI48 = maxFromBits(48);
        var getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        var randomUI06 = function () {
            return getRandomInt(0, limitUI06 - 1);
        };
        var randomUI08 = function () {
            return getRandomInt(0, limitUI08 - 1);
        };
        var randomUI12 = function () {
            return getRandomInt(0, limitUI12 - 1);
        };
        var randomUI16 = function () {
            return getRandomInt(0, limitUI16 - 1);
        };
        var randomUI32 = function () {
            return getRandomInt(0, limitUI32 - 1);
        };
        var randomUI48 = function () {
            return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
        };
        var paddedString = function (str, length, z) {
            str = String(str);
            z = (!z) ? '0' : z;
            var i = length - str.length;
            for (; i > 0; i >>>= 1, z += z) {
                if (i & 1) {
                    str = z + str;
                }
            }
            return str;
        };
        var fromParts = function (timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
            var hex = paddedString(timeLow.toString(16), 8) +
                '-' +
                paddedString(timeMid.toString(16), 4) +
                '-' +
                paddedString(timeHiAndVersion.toString(16), 4) +
                '-' +
                paddedString(clockSeqHiAndReserved.toString(16), 2) +
                paddedString(clockSeqLow.toString(16), 2) +
                '-' +
                paddedString(node.toString(16), 12);
            return hex;
        };
        return {
            generate: function () {
                return fromParts(randomUI32(), randomUI16(), 0x4000 | randomUI12(), 0x80 | randomUI06(), randomUI08(), randomUI48());
            },
            // addition by Ka-Jan to test for validity
            // Based on: http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
            validate: function (uuid) {
                var testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                return testPattern.test(uuid);
            }
        };
    }
    return uuid4;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformMat4',["require", "exports", '../uniforms/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
    var UniformMat4 = (function (_super) {
        __extends(UniformMat4, _super);
        function UniformMat4(name, id) {
            _super.call(this);
            this.useValue = true;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformMat4.prototype, "value", {
            set: function (value) {
                this.$value = value;
                this.useValue = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformMat4.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                this.useValue = false;
            },
            enumerable: true,
            configurable: true
        });
        UniformMat4.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case this.name:
                    {
                        if (this.useValue) {
                            return this.$value;
                        }
                        else {
                            return this.$callback();
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformMatrix4.call(this, name);
                }
            }
        };
        UniformMat4.prototype.getUniformMetaInfos = function () {
            var uniforms = _super.prototype.getUniformMetaInfos.call(this);
            uniforms[this.id] = { name: this.name, glslType: 'mat4' };
            return uniforms;
        };
        return UniformMat4;
    })(DefaultUniformProvider);
    return UniformMat4;
});

define('davinci-eight/cameras/view',["require", "exports", '../math/Vector3', '../math/Matrix4', '../core/Symbolic', '../uniforms/UniformMat4'], function (require, exports, Vector3, Matrix4, Symbolic, UniformMat4) {
    var UNIFORM_VIEW_MATRIX_NAME = 'uViewMatrix';
    /**
     * @class view
     * @constructor
     */
    var view = function () {
        var eye = new Vector3();
        var look = new Vector3();
        var up = Vector3.e2;
        var viewMatrix = new Matrix4();
        var base = new UniformMat4(UNIFORM_VIEW_MATRIX_NAME, Symbolic.UNIFORM_VIEW_MATRIX);
        base.callback = function () {
            if (eye.modified || look.modified || up.modified) {
                updateViewMatrix();
                eye.modified = false;
                look.modified = false;
                up.modified = false;
            }
            return { transpose: false, matrix4: viewMatrix.elements };
        };
        function updateViewMatrix() {
            var n = new Vector3().subVectors(eye, look);
            if (n.x === 0 && n.y === 0 && n.z === 0) {
                // View direction is ambiguous.
                n.z = 1;
            }
            else {
                n.normalize();
            }
            var u = new Vector3().crossVectors(up, n);
            var v = new Vector3().crossVectors(n, u);
            var d = new Vector3({ x: eye.dot(u), y: eye.dot(v), z: eye.dot(n) }).multiplyScalar(-1);
            var m = viewMatrix.elements;
            m[0] = u.x;
            m[4] = u.y;
            m[8] = u.z;
            m[12] = d.x;
            m[1] = v.x;
            m[5] = v.y;
            m[9] = v.z;
            m[13] = d.y;
            m[2] = n.x;
            m[6] = n.y;
            m[10] = n.z;
            m[14] = d.z;
            m[3] = 0;
            m[7] = 0;
            m[11] = 0;
            m[15] = 1;
        }
        // Force an update of the view matrix.
        eye.modified = true;
        look.modified = true;
        up.modified = true;
        var publicAPI = {
            get eye() {
                return eye;
            },
            set eye(value) {
                eye.x = value.x;
                eye.y = value.y;
                eye.z = value.z;
            },
            get look() {
                return look;
            },
            set look(value) {
                look.x = value.x;
                look.y = value.y;
                look.z = value.z;
            },
            get up() {
                return up;
            },
            set up(value) {
                up.x = value.x;
                up.y = value.y;
                up.z = value.z;
                up.normalize();
            },
            getUniformFloat: function (name) {
                return base.getUniformFloat(name);
            },
            getUniformMatrix2: function (name) {
                return base.getUniformMatrix2(name);
            },
            getUniformMatrix3: function (name) {
                return base.getUniformMatrix3(name);
            },
            getUniformMatrix4: function (name) {
                return base.getUniformMatrix4(name);
            },
            getUniformVector2: function (name) {
                return base.getUniformVector2(name);
            },
            getUniformVector3: function (name) {
                return base.getUniformVector3(name);
            },
            getUniformVector4: function (name) {
                return base.getUniformVector4(name);
            },
            getUniformMetaInfos: function () {
                return base.getUniformMetaInfos();
            }
        };
        return publicAPI;
    };
    return view;
});

define('davinci-eight/math/clamp',["require", "exports"], function (require, exports) {
    function clamp(x, min, max) {
        return (x < min) ? min : ((x > max) ? max : x);
    }
    return clamp;
});

define('davinci-eight/core/Color',["require", "exports", '../math/clamp'], function (require, exports, clamp) {
    /**
     * @class Color
     */
    var Color = (function () {
        function Color(red, green, blue, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.alpha = typeof alpha === 'number' ? clamp(alpha, 0, 1) : 1;
        }
        Color.prototype.luminance = function () {
            return Color.luminance(this.red, this.green, this.blue);
        };
        Color.prototype.toString = function () {
            return "Color(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
        };
        Color.luminance = function (red, green, blue) {
            var gamma = 2.2;
            return 0.2126 * Math.pow(red, gamma) + 0.7152 * Math.pow(green, gamma) + 0.0722 * Math.pow(blue, gamma);
        };
        /**
         * Converts an angle, radius, height to a color on a color wheel.
         */
        Color.fromHSL = function (H, S, L) {
            var C = (1 - Math.abs(2 * L - 1)) * S;
            function normalizeAngle(angle) {
                if (angle > 2 * Math.PI) {
                    return normalizeAngle(angle - 2 * Math.PI);
                }
                else if (angle < 0) {
                    return normalizeAngle(angle + 2 * Math.PI);
                }
                else {
                    return angle;
                }
            }
            function matchLightness(R, G, B) {
                var x = Color.luminance(R, G, B);
                var m = L - (0.5 * C);
                return new Color(R + m, G + m, B + m, 1.0);
            }
            var sextant = ((normalizeAngle(H) / Math.PI) * 3) % 6;
            var X = C * (1 - Math.abs(sextant % 2 - 1));
            if (sextant >= 0 && sextant < 1) {
                return matchLightness(C, X /*C*(sextant-0)*/, 0.0);
            }
            else if (sextant >= 1 && sextant < 2) {
                return matchLightness(X /*C*(2-sextant)*/, C, 0.0);
            }
            else if (sextant >= 2 && sextant < 3) {
                return matchLightness(0.0, C, C * (sextant - 2));
            }
            else if (sextant >= 3 && sextant < 4) {
                return matchLightness(0.0, C * (4 - sextant), C);
            }
            else if (sextant >= 4 && sextant < 5) {
                return matchLightness(X, 0.0, C);
            }
            else if (sextant >= 5 && sextant < 6) {
                return matchLightness(C, 0.0, X);
            }
            else {
                return matchLightness(0.0, 0.0, 0.0);
            }
        };
        return Color;
    })();
    return Color;
});

define('davinci-eight/cameras/frustum',["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', 'davinci-eight/core/Symbolic'], function (require, exports, view, Matrix4, Symbolic) {
    var UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    var UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';
    /**
     * @class frustum
     * @constructor
     * @param left {number}
     * @param right {number}
     * @param bottom {number}
     * @param top {number}
     * @param near {number}
     * @param far {number}
     * @return {Frustum}
     */
    var frustum = function (left, right, bottom, top, near, far) {
        if (left === void 0) { left = -1; }
        if (right === void 0) { right = 1; }
        if (bottom === void 0) { bottom = -1; }
        if (top === void 0) { top = 1; }
        if (near === void 0) { near = 1; }
        if (far === void 0) { far = 1000; }
        var base = view();
        var projectionMatrix = new Matrix4();
        function updateProjectionMatrix() {
            projectionMatrix.frustum(left, right, bottom, top, near, far);
        }
        updateProjectionMatrix();
        var publicAPI = {
            // Delegate to the base camera.
            get eye() {
                return base.eye;
            },
            set eye(value) {
                base.eye = value;
            },
            get look() {
                return base.look;
            },
            set look(value) {
                base.look = value;
            },
            get up() {
                return base.up;
            },
            set up(value) {
                base.up = value;
            },
            get left() {
                return left;
            },
            set left(value) {
                left = value;
                updateProjectionMatrix();
            },
            get right() {
                return right;
            },
            set right(value) {
                right = value;
                updateProjectionMatrix();
            },
            get bottom() {
                return bottom;
            },
            set bottom(value) {
                bottom = value;
                updateProjectionMatrix();
            },
            get top() {
                return top;
            },
            set top(value) {
                top = value;
                updateProjectionMatrix();
            },
            get near() {
                return near;
            },
            set near(value) {
                near = value;
                updateProjectionMatrix();
            },
            get far() {
                return far;
            },
            set far(value) {
                far = value;
                updateProjectionMatrix();
            },
            getUniformFloat: function (name) {
                return base.getUniformFloat(name);
            },
            getUniformMatrix2: function (name) {
                return base.getUniformMatrix2(name);
            },
            getUniformMatrix3: function (name) {
                return base.getUniformMatrix3(name);
            },
            getUniformMatrix4: function (name) {
                switch (name) {
                    case UNIFORM_PROJECTION_MATRIX_NAME: {
                        return { transpose: false, matrix4: projectionMatrix.elements };
                    }
                    default: {
                        return base.getUniformMatrix4(name);
                    }
                }
            },
            getUniformVector2: function (name) {
                return base.getUniformVector2(name);
            },
            getUniformVector3: function (name) {
                return base.getUniformVector3(name);
            },
            getUniformVector4: function (name) {
                return base.getUniformVector4(name);
            },
            getUniformMetaInfos: function () {
                var uniforms = base.getUniformMetaInfos();
                uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX] = { name: UNIFORM_PROJECTION_MATRIX_NAME, glslType: UNIFORM_PROJECTION_MATRIX_TYPE };
                return uniforms;
            }
        };
        return publicAPI;
    };
    return frustum;
});

define('davinci-eight/cameras/perspective',["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', 'davinci-eight/core/Symbolic'], function (require, exports, view, Matrix4, Symbolic) {
    var UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    var UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';
    /**
     * @class perspective
     * @constructor
     * @param fov {number}
     * @param aspect {number}
     * @param near {number}
     * @param far {number}
     * @return {LinearPerspectiveCamera}
     */
    var perspective = function (fov, aspect, near, far) {
        if (fov === void 0) { fov = 75 * Math.PI / 180; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 2000; }
        var base = view();
        var projectionMatrix = new Matrix4();
        var matrixNeedsUpdate = true;
        var self = {
            // Delegate to the base camera.
            get eye() {
                return base.eye;
            },
            set eye(value) {
                base.eye = value;
            },
            setEye: function (eye) {
                self.eye = eye;
                return self;
            },
            get look() {
                return base.look;
            },
            set look(value) {
                base.look = value;
            },
            get up() {
                return base.up;
            },
            set up(value) {
                base.up = value;
            },
            get fov() {
                return fov;
            },
            set fov(value) {
                fov = value;
                matrixNeedsUpdate = matrixNeedsUpdate || fov !== value;
            },
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                aspect = value;
                matrixNeedsUpdate = matrixNeedsUpdate || aspect !== value;
            },
            setAspect: function (aspect) {
                self.aspect = aspect;
                return self;
            },
            get near() {
                return near;
            },
            set near(value) {
                near = value;
                matrixNeedsUpdate = matrixNeedsUpdate || near !== value;
            },
            get far() {
                return far;
            },
            set far(value) {
                far = value;
                matrixNeedsUpdate = matrixNeedsUpdate || far !== value;
            },
            getUniformFloat: function (name) {
                return base.getUniformFloat(name);
            },
            getUniformMatrix2: function (name) {
                return base.getUniformMatrix2(name);
            },
            getUniformMatrix3: function (name) {
                return base.getUniformMatrix3(name);
            },
            getUniformMatrix4: function (name) {
                switch (name) {
                    case UNIFORM_PROJECTION_MATRIX_NAME: {
                        if (matrixNeedsUpdate) {
                            projectionMatrix.perspective(fov, aspect, near, far);
                            matrixNeedsUpdate = false;
                        }
                        return { transpose: false, matrix4: projectionMatrix.elements };
                    }
                    default: {
                        return base.getUniformMatrix4(name);
                    }
                }
            },
            getUniformVector2: function (name) {
                return base.getUniformVector2(name);
            },
            getUniformVector3: function (name) {
                return base.getUniformVector3(name);
            },
            getUniformVector4: function (name) {
                return base.getUniformVector4(name);
            },
            getUniformMetaInfos: function () {
                var uniforms = base.getUniformMetaInfos();
                uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX] = { name: UNIFORM_PROJECTION_MATRIX_NAME, glslType: UNIFORM_PROJECTION_MATRIX_TYPE };
                return uniforms;
            }
        };
        return self;
    };
    return perspective;
});

define('davinci-eight/checks/expectArg',["require", "exports"], function (require, exports) {
    function expectArg(name, value) {
        var arg = {
            toSatisfy: function (condition, message) {
                if (!condition) {
                    throw new Error(message);
                }
                return arg;
            },
            toBeDefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue === 'undefined') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeObject: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'object') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be an object.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeString: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'string') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeUndefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'undefined') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
                    throw new Error(message);
                }
                return arg;
            },
            toNotBeNull: function () {
                if (value === null) {
                    var message = "Expecting argument " + name + " to not be null.";
                    throw new Error(message);
                }
                else {
                    return arg;
                }
            },
            get value() {
                return value;
            }
        };
        return arg;
    }
    return expectArg;
});

define('davinci-eight/worlds/world',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    var world = function () {
        var drawables = [];
        var drawGroups = {};
        var gl;
        var contextId;
        var publicAPI = {
            get drawGroups() { return drawGroups; },
            get children() { return drawables; },
            contextFree: function () {
                drawables.forEach(function (drawable) {
                    drawable.contextFree();
                });
                gl = void 0;
                contextId = void 0;
            },
            contextGain: function (context, contextId) {
                expectArg('context', context).toSatisfy(context instanceof WebGLRenderingContext, "context must implement WebGLRenderingContext");
                expectArg('contextId', contextId).toBeString();
                gl = context;
                contextId = contextId;
                drawables.forEach(function (drawable) {
                    drawable.contextGain(context, contextId);
                    var groupName = drawable.drawGroupName;
                    if (!drawGroups[groupName]) {
                        drawGroups[groupName] = [];
                    }
                    drawGroups[groupName].push(drawable);
                });
            },
            contextLoss: function () {
                drawables.forEach(function (drawable) {
                    drawable.contextLoss();
                });
                gl = void 0;
                contextId = void 0;
            },
            hasContext: function () {
                return !!gl;
            },
            add: function (child) {
                drawables.push(child);
            }
        };
        return publicAPI;
    };
    return world;
});

define('davinci-eight/renderers/ViewportArgs',["require", "exports"], function (require, exports) {
    var ViewportArgs = (function () {
        function ViewportArgs(x, y, width, height) {
            this.x = 0;
            this.y = 0;
            this.width = width;
            this.height = height;
            this.modified = false;
        }
        return ViewportArgs;
    })();
    return ViewportArgs;
});

define('davinci-eight/renderers/viewport',["require", "exports", '../core/Color', '../renderers/ViewportArgs', '../checks/expectArg'], function (require, exports, Color, ViewportArgs, expectArg) {
    var viewport = function (canvas, parameters) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        parameters = parameters || {};
        var alpha = parameters.alpha !== undefined ? parameters.alpha : false;
        var depth = parameters.depth !== undefined ? parameters.depth : true;
        var stencil = parameters.stencil !== undefined ? parameters.stencil : true;
        var antialias = parameters.antialias !== undefined ? parameters.antialias : false;
        var premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
        var preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;
        //var drawContext = new FrameworkDrawContext();
        var context;
        var contextId;
        var devicePixelRatio = 1;
        var autoClearColor = true;
        var autoClearDepth = true;
        var clearColor = new Color(1.0, 1.0, 1.0, 1.0);
        // If we had an active context then we might use context.drawingBufferWidth etc.
        var viewport = new ViewportArgs(0, 0, canvas.width, canvas.height);
        function setViewport(x, y, width, height) {
            if (context) {
                context.viewport(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, height * devicePixelRatio);
            }
        }
        function clear() {
            var mask = 0;
            if (context) {
                if (autoClearColor) {
                    mask |= context.COLOR_BUFFER_BIT;
                }
                if (autoClearDepth) {
                    mask |= context.DEPTH_BUFFER_BIT;
                }
                context.clear(mask);
            }
        }
        var publicAPI = {
            get canvas() { return canvas; },
            get context() { return context; },
            contextFree: function () {
                context = void 0;
                contextId = void 0;
            },
            contextGain: function (contextArg, contextIdArg) {
                context = contextArg;
                contextId = contextIdArg;
                context.enable(context.DEPTH_TEST);
                context.enable(context.SCISSOR_TEST);
            },
            contextLoss: function () {
                context = void 0;
                contextId = void 0;
            },
            hasContext: function () {
                return !!context;
            },
            clearColor: function (red, green, blue, alpha) {
                clearColor.red = red;
                clearColor.green = green;
                clearColor.blue = blue;
                clearColor.alpha = alpha;
                //
            },
            render: function (world, views) {
                expectArg('world', world).toNotBeNull();
                if (context) {
                    context.scissor(viewport.x, viewport.y, viewport.width, viewport.height);
                    context.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
                    context.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearColor.alpha);
                    clear();
                    if (!world.hasContext()) {
                        world.contextGain(context, contextId);
                    }
                    var programLoaded;
                    for (var drawGroupName in world.drawGroups) {
                        programLoaded = false;
                        world.drawGroups[drawGroupName].forEach(function (drawable) {
                            if (!programLoaded) {
                                drawable.useProgram();
                                programLoaded = true;
                            }
                            views.forEach(function (view) {
                                drawable.draw(view);
                            });
                        });
                    }
                }
                else {
                    console.warn("viewport is unable to render because WebGLRenderingContext is missing");
                }
            },
            setViewport: setViewport,
            get x() {
                return viewport.x;
            },
            set x(value) {
                viewport.x = value;
            },
            get y() {
                return viewport.y;
            },
            set y(value) {
                viewport.y = value;
            },
            get width() {
                return viewport.width;
            },
            set width(value) {
                viewport.width = value;
            },
            get height() {
                return viewport.height;
            },
            set height(value) {
                viewport.height = value;
            },
            setSize: function (width, height, updateStyle) {
                canvas.width = width * devicePixelRatio;
                canvas.height = height * devicePixelRatio;
                if (updateStyle !== false) {
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                }
                setViewport(0, 0, width, height);
            }
        };
        var attributes = {
            'alpha': alpha,
            'depth': depth,
            'stencil': stencil,
            'antialias': antialias,
            'premultipliedAlpha': premultipliedAlpha,
            'preserveDrawingBuffer': preserveDrawingBuffer
        };
        return publicAPI;
    };
    return viewport;
});

define('davinci-eight/core/convertUsage',["require", "exports", '../core/DataUsage'], function (require, exports, DataUsage) {
    function convertUsage(usage, context) {
        switch (usage) {
            case DataUsage.DYNAMIC_DRAW: {
                return context.DYNAMIC_DRAW;
            }
            case DataUsage.STATIC_DRAW: {
                return context.STATIC_DRAW;
            }
            case DataUsage.STREAM_DRAW: {
                return context.STREAM_DRAW;
            }
            default: {
                throw new Error("Unexpected usage: " + usage);
            }
        }
    }
    return convertUsage;
});

define('davinci-eight/core/ElementArray',["require", "exports", '../core/convertUsage'], function (require, exports, convertUsage) {
    /**
     * Manages the (optional) WebGLBuffer used to support gl.drawElements().
     * @class ElementArray
     */
    var ElementArray = (function () {
        /**
         * @class ElementArray
         * @constructor
         * @param attributes {AttributeProvider}
         */
        function ElementArray(attributes) {
            this.attributes = attributes;
        }
        /**
         * @method contextFree
         */
        ElementArray.prototype.contextFree = function () {
            if (this.buffer) {
                this.context.deleteBuffer(this.buffer);
                this.buffer = void 0;
            }
            this.context = void 0;
        };
        /**
         * @method contextGain
         * @param context {WebGLRenderingContext}
         */
        ElementArray.prototype.contextGain = function (context, contextId) {
            if (this.attributes.hasElements()) {
                this.buffer = context.createBuffer();
            }
            this.context = context;
        };
        /**
         * @method contextLoss
         */
        ElementArray.prototype.contextLoss = function () {
            this.buffer = void 0;
            this.context = void 0;
        };
        /**
         * @method bufferData
         * @param attributes {AttributeProvider}
         */
        ElementArray.prototype.bufferData = function (attributes) {
            if (this.buffer) {
                var elements = attributes.getElements();
                this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
                var usage = convertUsage(elements.usage, this.context);
                this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, elements.data, usage);
            }
        };
        /**
         * @method bind
         */
        ElementArray.prototype.bind = function () {
            if (this.buffer) {
                this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
            }
        };
        return ElementArray;
    })();
    return ElementArray;
});

define('davinci-eight/uniforms/ChainedUniformProvider',["require", "exports"], function (require, exports) {
    var ChainedUniformProvider = (function () {
        function ChainedUniformProvider(provider, fallback) {
            this.provider = provider;
            this.fallback = fallback;
        }
        ChainedUniformProvider.prototype.getUniformFloat = function (name) {
            var data = this.provider.getUniformFloat(name);
            if (typeof data === 'number') {
                return data;
            }
            else {
                return this.fallback.getUniformFloat(name);
            }
        };
        ChainedUniformProvider.prototype.getUniformMatrix2 = function (name) {
            var m2 = this.provider.getUniformMatrix2(name);
            if (m2) {
                return m2;
            }
            else {
                return this.fallback.getUniformMatrix2(name);
            }
        };
        ChainedUniformProvider.prototype.getUniformMatrix3 = function (name) {
            var m3 = this.provider.getUniformMatrix3(name);
            if (m3) {
                return m3;
            }
            else {
                return this.fallback.getUniformMatrix3(name);
            }
        };
        ChainedUniformProvider.prototype.getUniformMatrix4 = function (name) {
            var m4 = this.provider.getUniformMatrix4(name);
            if (m4) {
                return m4;
            }
            else {
                return this.fallback.getUniformMatrix4(name);
            }
        };
        ChainedUniformProvider.prototype.getUniformVector2 = function (name) {
            var v2 = this.provider.getUniformVector2(name);
            if (v2) {
                return v2;
            }
            else {
                return this.fallback.getUniformVector2(name);
            }
        };
        ChainedUniformProvider.prototype.getUniformVector3 = function (name) {
            var v3 = this.provider.getUniformVector3(name);
            if (v3) {
                return v3;
            }
            else {
                return this.fallback.getUniformVector3(name);
            }
        };
        ChainedUniformProvider.prototype.getUniformVector4 = function (name) {
            var v4 = this.provider.getUniformVector4(name);
            if (v4) {
                return v4;
            }
            else {
                return this.fallback.getUniformVector4(name);
            }
        };
        ChainedUniformProvider.prototype.getUniformMetaInfos = function () {
            var uniforms = {};
            var ones = this.provider.getUniformMetaInfos();
            for (name in ones) {
                uniforms[name] = ones[name];
            }
            var twos = this.fallback.getUniformMetaInfos();
            for (name in twos) {
                uniforms[name] = twos[name];
            }
            return uniforms;
        };
        return ChainedUniformProvider;
    })();
    return ChainedUniformProvider;
});

define('davinci-eight/objects/drawableModel',["require", "exports", '../core/ElementArray', '../uniforms/ChainedUniformProvider'], function (require, exports, ElementArray, ChainedUniformProvider) {
    var drawableModel = function (mesh, shaders, model) {
        /**
         * Find an attribute by its code name rather than its semantic role (which is the key in AttributeMetaInfos)
         */
        function findAttributeMetaInfoByVariableName(name, attributes) {
            for (var key in attributes) {
                var attribute = attributes[key];
                if (attribute.name === name) {
                    return attribute;
                }
            }
        }
        /**
         * Constructs a ShaderAttributeLocation from a declaration.
         */
        function shaderAttributeLocationFromDecl(declaration) {
            // Looking up the attribute meta info gives us some early warning if the mesh is deficient.
            var attribute = findAttributeMetaInfoByVariableName(declaration.name, mesh.getAttributeMetaInfos());
            if (attribute) {
                return shaders.attributeLocation(declaration.name);
            }
            else {
                var message = "The mesh does not support attribute " + declaration.type + " " + declaration.name;
                console.warn(message);
                throw new Error(message);
            }
        }
        /**
         * Constructs a ShaderUniformLocation from a declaration.
         */
        function shaderUniformLocationFromDecl(declaration) {
            // By using the ShaderProgram, we get to delegate the management of uniform locations. 
            return shaders.uniformLocation(declaration.name);
        }
        function checkUniformsCompleteAndReady(provider) {
            var metas = provider.getUniformMetaInfos();
            shaders.uniforms.forEach(function (uniformDecl) {
                var match = void 0;
                for (var id in metas) {
                    var candidate = metas[id];
                    if (candidate.name === uniformDecl.name) {
                        match = candidate;
                    }
                }
                if (match === void 0) {
                    var message = "Missing uniform " + uniformDecl.type + " " + uniformDecl.name;
                    console.warn(message);
                    throw new Error(message);
                }
                else {
                    if (match.glslType !== uniformDecl.type) {
                        var message = "Mismatch in uniform types " + uniformDecl.name;
                        console.warn(message);
                        throw new Error(message);
                    }
                    else {
                    }
                }
            });
        }
        var context;
        var contextGainId;
        var elements = new ElementArray(mesh);
        var vertexAttributes = shaders.attributes.map(shaderAttributeLocationFromDecl);
        var uniformVariables = shaders.uniforms.map(shaderUniformLocationFromDecl);
        function updateGeometry() {
            // Make sure to update the mesh first so that the shaders gets the correct data.
            mesh.update(shaders.attributes);
            vertexAttributes.forEach(function (vertexAttribute) {
                var thing = mesh.getVertexAttributeData(vertexAttribute.name);
                if (thing) {
                    vertexAttribute.bufferData(thing.data, thing.usage);
                }
                else {
                    // We expect this to be detected long before we get here.
                    throw new Error("mesh implementation claims to support but does not provide data for attribute " + vertexAttribute.name);
                }
            });
            elements.bufferData(mesh);
        }
        var publicAPI = {
            get mesh() {
                return mesh;
            },
            get shaders() {
                return shaders;
            },
            get model() {
                return model;
            },
            contextFree: function () {
                shaders.contextFree();
                elements.contextFree();
                context = null;
                contextGainId = null;
            },
            contextGain: function (contextArg, contextId) {
                context = contextArg;
                if (contextGainId !== contextId) {
                    contextGainId = contextId;
                    shaders.contextGain(context, contextId);
                    elements.contextGain(context, contextId);
                    if (!mesh.dynamic) {
                        updateGeometry();
                    }
                }
            },
            contextLoss: function () {
                shaders.contextLoss();
                elements.contextLoss();
                context = null;
                contextGainId = null;
            },
            hasContext: function () {
                return shaders.hasContext();
            },
            get drawGroupName() { return shaders.programId; },
            /**
             * @method useProgram
             */
            useProgram: function () { return shaders.use(); },
            /**
             * @method draw
             * @param ambients {UniformProvider}
             */
            draw: function (ambients) {
                if (shaders.hasContext()) {
                    if (mesh.dynamic) {
                        updateGeometry();
                    }
                    var chainedProvider = new ChainedUniformProvider(model, ambients);
                    checkUniformsCompleteAndReady(chainedProvider);
                    // check we have them all.
                    // check they are all initialized.
                    // Update the uniform location values.
                    uniformVariables.forEach(function (uniformVariable) {
                        switch (uniformVariable.glslType) {
                            case 'float':
                                {
                                    var data = chainedProvider.getUniformFloat(uniformVariable.name);
                                    if (typeof data !== 'undefined') {
                                        if (typeof data === 'number') {
                                            uniformVariable.uniform1f(data);
                                        }
                                        else {
                                            throw new Error("Expecting typeof data for uniform float " + uniformVariable.name + " to be 'number'.");
                                        }
                                    }
                                    else {
                                        throw new Error("Expecting data for uniform float " + uniformVariable.name);
                                    }
                                }
                                break;
                            case 'vec2':
                                {
                                    var data = chainedProvider.getUniformVector2(uniformVariable.name);
                                    if (data) {
                                        if (data.length === 2) {
                                            uniformVariable.uniform2fv(data);
                                        }
                                        else {
                                            throw new Error("Expecting data for uniform vec2 " + uniformVariable.name + " to be number[] with length 2");
                                        }
                                    }
                                    else {
                                        throw new Error("Expecting data for uniform vec2 " + uniformVariable.name);
                                    }
                                }
                                break;
                            case 'vec3':
                                {
                                    var data = chainedProvider.getUniformVector3(uniformVariable.name);
                                    if (data) {
                                        if (data.length === 3) {
                                            uniformVariable.uniform3fv(data);
                                        }
                                        else {
                                            throw new Error("Expecting data for uniform " + uniformVariable.name + " to be number[] with length 3");
                                        }
                                    }
                                    else {
                                        throw new Error("Expecting data for uniform " + uniformVariable.name);
                                    }
                                }
                                break;
                            case 'vec4':
                                {
                                    var data = chainedProvider.getUniformVector4(uniformVariable.name);
                                    if (data) {
                                        if (data.length === 4) {
                                            uniformVariable.uniform4fv(data);
                                        }
                                        else {
                                            throw new Error("Expecting data for uniform " + uniformVariable.name + " to be number[] with length 4");
                                        }
                                    }
                                    else {
                                        throw new Error("Expecting data for uniform " + uniformVariable.name);
                                    }
                                }
                                break;
                            case 'mat3':
                                {
                                    var data = chainedProvider.getUniformMatrix3(uniformVariable.name);
                                    if (data) {
                                        uniformVariable.uniformMatrix3fv(data.transpose, data.matrix3);
                                    }
                                    else {
                                        throw new Error("Expecting data for uniform " + uniformVariable.name);
                                    }
                                }
                                break;
                            case 'mat4':
                                {
                                    var data = chainedProvider.getUniformMatrix4(uniformVariable.name);
                                    if (data) {
                                        uniformVariable.uniformMatrix4fv(data.transpose, data.matrix4);
                                    }
                                    else {
                                        throw new Error("Expecting data for uniform " + uniformVariable.name);
                                    }
                                }
                                break;
                            default: {
                                throw new Error("Unexpected uniform GLSL type in drawableModel.draw: " + uniformVariable.glslType);
                            }
                        }
                    });
                    vertexAttributes.forEach(function (vertexAttribute) {
                        vertexAttribute.enable();
                    });
                    vertexAttributes.forEach(function (vertexAttribute) {
                        var attribute = findAttributeMetaInfoByVariableName(vertexAttribute.name, mesh.getAttributeMetaInfos());
                        if (attribute) {
                            var size = attribute.size;
                            var type = context.FLOAT; //attribute.dataType;
                            var normalized = attribute.normalized;
                            var stride = attribute.stride;
                            var offset = attribute.offset;
                            vertexAttribute.dataFormat(size, type, normalized, stride, offset);
                        }
                        else {
                            throw new Error("The mesh does not support the attribute variable named " + vertexAttribute.name);
                        }
                    });
                    elements.bind();
                    mesh.draw(context);
                    vertexAttributes.forEach(function (vertexAttribute) {
                        vertexAttribute.disable();
                    });
                }
            }
        };
        return publicAPI;
    };
    return drawableModel;
});

define('davinci-eight/core/Face3',["require", "exports", '../math/Vector3'], function (require, exports, Vector3) {
    var Face3 = (function () {
        function Face3(a, b, c, normal) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.normal = normal instanceof Vector3 ? normal : new Vector3();
            this.vertexNormals = normal instanceof Array ? normal : [];
        }
        return Face3;
    })();
    return Face3;
});

define('davinci-eight/core/ShaderAttributeLocation',["require", "exports", '../core/convertUsage'], function (require, exports, convertUsage) {
    function existsLocation(location) {
        return location >= 0;
    }
    /**
     * Utility class for managing a shader attribute variable.
     * While this class may be created directly by the user, it is preferable
     * to use the ShaderAttributeLocation instances managed by the ShaderProgram because
     * there will be improved integrity and context loss management.
     * @class ShaderAttributeLocation.
     */
    var ShaderAttributeLocation = (function () {
        /**
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * @class ShaderAttributeLocation
         * @constructor
         * @param name {string} The name of the variable as it appears in the GLSL program.
         * @param glslType {string} The type of the variable as it appears in the GLSL program.
         */
        function ShaderAttributeLocation(name, glslType) {
            this.$name = name;
            switch (glslType) {
                case 'float':
                case 'vec2':
                case 'vec3':
                case 'vec4':
                case 'mat2':
                case 'mat3':
                case 'mat4':
                    {
                        this.$glslType = glslType;
                    }
                    break;
                default: {
                    // TODO
                    throw new Error("Argument glslType in ShaderAttributeLocation constructor must be one of float, vec2, vec3, vec4, mat2, mat3, mat4. Got: " + glslType);
                }
            }
        }
        Object.defineProperty(ShaderAttributeLocation.prototype, "name", {
            get: function () {
                return this.$name;
            },
            enumerable: true,
            configurable: true
        });
        ShaderAttributeLocation.prototype.contextFree = function () {
            if (this.buffer) {
                this.context.deleteBuffer(this.buffer);
                this.contextLoss();
            }
        };
        ShaderAttributeLocation.prototype.contextGain = function (context, program) {
            this.location = context.getAttribLocation(program, this.name);
            this.context = context;
            if (existsLocation(this.location)) {
                this.buffer = context.createBuffer();
            }
        };
        ShaderAttributeLocation.prototype.contextLoss = function () {
            this.location = void 0;
            this.buffer = void 0;
            this.context = void 0;
        };
        /**
         * @method dataFormat
         * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
         * @param type {number} Specifies the data type of each component in the array. gl.FLOAT (default) or gl.FIXED.
         * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
         * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
         * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
         */
        ShaderAttributeLocation.prototype.dataFormat = function (size, type, normalized, stride, offset) {
            if (normalized === void 0) { normalized = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            if (existsLocation(this.location)) {
                // TODO: We could assert that we have a buffer.
                this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
                // 6.14 Fixed point support.
                // The WebGL API does not support the GL_FIXED data type.
                // Consequently, we hard-code the FLOAT constant.
                this.context.vertexAttribPointer(this.location, size, type, normalized, stride, offset);
            }
        };
        /**
         * FIXME This should not couple to an AttributeProvider.
         * @method bufferData
         */
        ShaderAttributeLocation.prototype.bufferData = function (data, usage) {
            if (existsLocation(this.location)) {
                this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
                this.context.bufferData(this.context.ARRAY_BUFFER, data, convertUsage(usage, this.context));
            }
        };
        /*
        bufferData(attributes: AttributeProvider) {
          if (existsLocation(this.location)) {
            let thing = attributes.getVertexAttributeData(this.name);
            if (thing) {
              this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
              this.context.bufferData(this.context.ARRAY_BUFFER, thing.data, convertUsage(thing.usage, this.context));
            }
            else {
              // We expect this to be detected long before we get here.
              throw new Error("Geometry implementation claims to support but does not provide data for attribute " + this.name);
            }
          }
        }
        */
        ShaderAttributeLocation.prototype.enable = function () {
            if (existsLocation(this.location)) {
                this.context.enableVertexAttribArray(this.location);
            }
        };
        ShaderAttributeLocation.prototype.disable = function () {
            if (existsLocation(this.location)) {
                this.context.disableVertexAttribArray(this.location);
            }
        };
        /**
         * @method toString
         */
        ShaderAttributeLocation.prototype.toString = function () {
            return ["ShaderAttributeLocation({name: ", this.name, ", glslType: ", this.$glslType + "})"].join('');
        };
        return ShaderAttributeLocation;
    })();
    return ShaderAttributeLocation;
});

define('davinci-eight/core/ShaderUniformLocation',["require", "exports"], function (require, exports) {
    /**
     * Utility class for managing a shader uniform variable.
     * @class ShaderUniformLocation
     */
    var ShaderUniformLocation = (function () {
        /**
         * @class ShaderUniformLocation
         * @constructor
         * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
         * @param glslType {string} The type of the uniform variale, as it appears in the GLSL shader code.
         */
        function ShaderUniformLocation(name, glslType) {
            this.name = name;
            switch (glslType) {
                case 'float':
                case 'vec2':
                case 'vec3':
                case 'vec4':
                case 'mat2':
                case 'mat3':
                case 'mat4':
                    {
                        this.glslType = glslType;
                    }
                    break;
                default: {
                    throw new Error("Illegal argument glslType in ShaderUniformLocation constructor: " + glslType);
                }
            }
        }
        /**
         * @method contextFree
         */
        ShaderUniformLocation.prototype.contextFree = function () {
            this.location = null;
            this.context = null;
        };
        /**
         * @method contextGain
         * @param context {WebGLRenderingContext}
         * @param program {WebGLProgram}
         */
        ShaderUniformLocation.prototype.contextGain = function (context, program) {
            this.location = context.getUniformLocation(program, this.name);
            this.context = context;
        };
        /**
         * @method contextLoss
         */
        ShaderUniformLocation.prototype.contextLoss = function () {
            this.location = null;
            this.context = null;
        };
        /**
         * @method uniform1f
         * @param value {number} Value to assign.
         */
        ShaderUniformLocation.prototype.uniform1f = function (value) {
            this.context.uniform1f(this.location, value);
        };
        /**
         * @method uniform2f
         * @param x {number} Horizontal value to assign.
         * @param y {number} Vertical number to assign.
         */
        ShaderUniformLocation.prototype.uniform2f = function (x, y) {
            this.context.uniform2f(this.location, x, y);
        };
        /**
         * @method uniform2fv
         * @param data {number[]}
         */
        ShaderUniformLocation.prototype.uniform2fv = function (data) {
            this.context.uniform2fv(this.location, data);
        };
        /**
         * @method uniform3fv
         * @param data {number[]}
         */
        ShaderUniformLocation.prototype.uniform3fv = function (data) {
            this.context.uniform3fv(this.location, data);
        };
        /**
         * @method uniform4fv
         * @param data {number[]}
         */
        ShaderUniformLocation.prototype.uniform4fv = function (data) {
            this.context.uniform4fv(this.location, data);
        };
        /**
         * @method uniformMatrix3fv
         * @param transpose {boolean}
         * @param matrix {Float32Array}
         */
        ShaderUniformLocation.prototype.uniformMatrix3fv = function (transpose, matrix) {
            if (!(matrix instanceof Float32Array)) {
                throw new Error("matrix must be a Float32Array.");
            }
            this.context.uniformMatrix3fv(this.location, transpose, matrix);
        };
        /**
         * @method uniformMatrix4fv
         * @param transpose {boolean}
         * @param matrix {Float32Array}
         */
        ShaderUniformLocation.prototype.uniformMatrix4fv = function (transpose, matrix) {
            if (!(matrix instanceof Float32Array)) {
                throw new Error("matrix must be a Float32Array.");
            }
            this.context.uniformMatrix4fv(this.location, transpose, matrix);
        };
        /**
         * @method toString
         */
        ShaderUniformLocation.prototype.toString = function () {
            return ["ShaderUniformLocation({name: ", this.name, ", glslType: ", this.glslType + "})"].join('');
        };
        return ShaderUniformLocation;
    })();
    return ShaderUniformLocation;
});

define('davinci-eight/math/Sphere',["require", "exports", '../math/Vector3'], function (require, exports, Vector3) {
    var Sphere = (function () {
        function Sphere(center, radius) {
            this.center = (center !== undefined) ? center : new Vector3();
            this.radius = (radius !== undefined) ? radius : 0;
        }
        Sphere.prototype.setFromPoints = function (points) {
            throw new Error("Not Implemented: Sphere.setFromPoints");
        };
        return Sphere;
    })();
    return Sphere;
});

define('davinci-eight/geometries/Geometry',["require", "exports", '../math/Sphere', '../math/Vector3'], function (require, exports, Sphere, Vector3) {
    /**
     * @class Geometry
     */
    var Geometry = (function () {
        function Geometry() {
            this.vertices = [];
            this.faces = [];
            this.faceVertexUvs = [[]];
            this.dynamic = true;
            this.verticesNeedUpdate = false;
            this.elementsNeedUpdate = false;
            this.uvsNeedUpdate = false;
            this.boundingSphere = null;
        }
        Geometry.prototype.computeBoundingSphere = function () {
            if (this.boundingSphere === null) {
                this.boundingSphere = new Sphere();
            }
            this.boundingSphere.setFromPoints(this.vertices);
        };
        Geometry.prototype.computeFaceNormals = function () {
            var cb = new Vector3();
            var ab = new Vector3();
            for (var f = 0, fl = this.faces.length; f < fl; f++) {
                var face = this.faces[f];
                var vA = this.vertices[face.a];
                var vB = this.vertices[face.b];
                var vC = this.vertices[face.c];
                cb.subVectors(vC, vB);
                ab.subVectors(vA, vB);
                cb.cross(ab);
                cb.normalize();
                face.normal.copy(cb);
            }
        };
        Geometry.prototype.computeVertexNormals = function (areaWeighted) {
            var v;
            var vl = this.vertices.length;
            var f;
            var fl;
            var face;
            // For each vertex, we will compute a vertexNormal.
            // Store the results in an Array<Vector3>
            var vertexNormals = new Array(this.vertices.length);
            for (v = 0, vl = this.vertices.length; v < vl; v++) {
                vertexNormals[v] = new Vector3();
            }
            if (areaWeighted) {
                // vertex normals weighted by triangle areas
                // http://www.iquilezles.org/www/articles/normals/normals.htm
                var vA;
                var vB;
                var vC;
                var cb = new Vector3();
                var ab = new Vector3();
                for (f = 0, fl = this.faces.length; f < fl; f++) {
                    face = this.faces[f];
                    vA = this.vertices[face.a];
                    vB = this.vertices[face.b];
                    vC = this.vertices[face.c];
                    cb.subVectors(vC, vB);
                    ab.subVectors(vA, vB);
                    cb.cross(ab);
                    vertexNormals[face.a].add(cb);
                    vertexNormals[face.b].add(cb);
                    vertexNormals[face.c].add(cb);
                }
            }
            else {
                for (f = 0, fl = this.faces.length; f < fl; f++) {
                    face = this.faces[f];
                    vertexNormals[face.a].add(face.normal);
                    vertexNormals[face.b].add(face.normal);
                    vertexNormals[face.c].add(face.normal);
                }
            }
            for (v = 0, vl = this.vertices.length; v < vl; v++) {
                vertexNormals[v].normalize();
            }
            for (f = 0, fl = this.faces.length; f < fl; f++) {
                face = this.faces[f];
                face.vertexNormals[0] = vertexNormals[face.a].clone();
                face.vertexNormals[1] = vertexNormals[face.b].clone();
                face.vertexNormals[2] = vertexNormals[face.c].clone();
            }
        };
        Geometry.prototype.mergeVertices = function () {
            var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
            var unique = [], changes = [];
            var v;
            var key;
            var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
            var precision = Math.pow(10, precisionPoints);
            var i;
            var il;
            var face;
            var indices, j, jl;
            for (i = 0, il = this.vertices.length; i < il; i++) {
                v = this.vertices[i];
                key = Math.round(v.x * precision) + '_' + Math.round(v.y * precision) + '_' + Math.round(v.z * precision);
                if (verticesMap[key] === undefined) {
                    verticesMap[key] = i;
                    unique.push(this.vertices[i]);
                    changes[i] = unique.length - 1;
                }
                else {
                    //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
                    changes[i] = changes[verticesMap[key]];
                }
            }
            ;
            // if faces are completely degenerate after merging vertices, we
            // have to remove them.
            var faceIndicesToRemove = [];
            for (i = 0, il = this.faces.length; i < il; i++) {
                face = this.faces[i];
                face.a = changes[face.a];
                face.b = changes[face.b];
                face.c = changes[face.c];
                indices = [face.a, face.b, face.c];
                var dupIndex = -1;
                // if any duplicate vertices are found in a Face3
                // we have to remove the face as nothing can be saved
                for (var n = 0; n < 3; n++) {
                    if (indices[n] == indices[(n + 1) % 3]) {
                        dupIndex = n;
                        faceIndicesToRemove.push(i);
                        break;
                    }
                }
            }
            for (i = faceIndicesToRemove.length - 1; i >= 0; i--) {
                var idx = faceIndicesToRemove[i];
                this.faces.splice(idx, 1);
                for (j = 0, jl = this.faceVertexUvs.length; j < jl; j++) {
                    this.faceVertexUvs[j].splice(idx, 1);
                }
            }
            // Use unique set of vertices
            var diff = this.vertices.length - unique.length;
            this.vertices = unique;
            return diff;
        };
        return Geometry;
    })();
    return Geometry;
});

define('davinci-eight/core/Line3',["require", "exports"], function (require, exports) {
    /**
     * @class Line3
     */
    var Line3 = (function () {
        /**
         * @class Line3
         * @constructor
         * @param a {number} The index of a vertex in some array.
         * @param b {number} The index of a vertex in some array.
         */
        function Line3(a, b) {
            this.a = a;
            this.b = b;
        }
        return Line3;
    })();
    return Line3;
});

define('davinci-eight/core/Point3',["require", "exports"], function (require, exports) {
    /**
     * @class Point3
     */
    var Point3 = (function () {
        /**
         * @class Point3
         * @constructor
         * @param a {number} The index of a vertex in some array.
         */
        function Point3(a) {
            this.a = a;
        }
        return Point3;
    })();
    return Point3;
});

define('davinci-eight/geometries/GeometryAdapter',["require", "exports", '../core/Line3', '../core/Point3', '../core/Color', '../core/Symbolic', '../core/DataUsage', '../core/DrawMode'], function (require, exports, Line3, Point3, Color, Symbolic, DataUsage, DrawMode) {
    var DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME = 'aVertexPosition';
    var DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME = 'aVertexColor';
    var DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME = 'aVertexNormal';
    function defaultColorFunction(vertexIndex, face, vertexList, normal) {
        return new Color(normal.x, normal.y, normal.z, 1.0);
    }
    /**
     * Adapter from a Geometry to a AttributeProvider.
     * @class GeometryAdapter
     * @extends VertexAttributeProivider
     */
    var GeometryAdapter = (function () {
        /**
         * @class GeometryAdapter
         * @constructor
         * @param geometry {Geometry} The geometry that must be adapted to a AttributeProvider.
         */
        function GeometryAdapter(geometry, options) {
            this.$drawMode = DrawMode.TRIANGLES;
            this.elementsUsage = DataUsage.STREAM_DRAW;
            this.grayScale = false;
            this.lines = [];
            this.points = [];
            options = options || {};
            options.drawMode = typeof options.drawMode !== 'undefined' ? options.drawMode : DrawMode.TRIANGLES;
            options.elementsUsage = typeof options.elementsUsage !== 'undefined' ? options.elementsUsage : DataUsage.STREAM_DRAW;
            this.geometry = geometry;
            this.color = new Color(1.0, 1.0, 0.0, 1.0);
            this.geometry.dynamic = false;
            this.$drawMode = options.drawMode;
            this.elementsUsage = options.elementsUsage;
        }
        Object.defineProperty(GeometryAdapter.prototype, "drawMode", {
            get: function () {
                return this.$drawMode;
            },
            set: function (value) {
                // Changing the drawMode after accessing attribute meta data causes
                // a shader program to be created that does not agree with
                // what the mesh is able to provide.
                throw new Error("The drawMode property is readonly");
            },
            enumerable: true,
            configurable: true
        });
        GeometryAdapter.prototype.draw = function (context) {
            switch (this.drawMode) {
                case DrawMode.POINTS:
                    {
                        context.drawArrays(context.POINTS, 0, this.points.length * 1);
                    }
                    break;
                case DrawMode.LINES:
                    {
                        context.drawArrays(context.LINES, 0, this.lines.length * 2);
                    }
                    break;
                case DrawMode.TRIANGLES:
                    {
                        //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
                        context.drawArrays(context.TRIANGLES, 0, this.geometry.faces.length * 3);
                    }
                    break;
                default: {
                }
            }
        };
        Object.defineProperty(GeometryAdapter.prototype, "dynamic", {
            get: function () {
                return this.geometry.dynamic;
            },
            enumerable: true,
            configurable: true
        });
        GeometryAdapter.prototype.hasElements = function () {
            return true;
        };
        GeometryAdapter.prototype.getElements = function () {
            return { usage: this.elementsUsage, data: this.elementArray };
        };
        GeometryAdapter.prototype.getVertexAttributeData = function (name) {
            // FIXME: Need to inject usage for each array type.
            switch (name) {
                case DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME: {
                    return { usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexPositionArray };
                }
                case DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME: {
                    return { usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexColorArray };
                }
                case DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME: {
                    return { usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexNormalArray };
                }
                default: {
                    return;
                }
            }
        };
        GeometryAdapter.prototype.getAttributeMetaInfos = function () {
            var attribues = {};
            attribues[Symbolic.ATTRIBUTE_POSITION] = {
                name: DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME,
                glslType: 'vec3',
                size: 3,
                normalized: false,
                stride: 0,
                offset: 0
            };
            if (!this.grayScale) {
                attribues[Symbolic.ATTRIBUTE_COLOR] = {
                    name: DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME,
                    glslType: 'vec4',
                    size: 4,
                    normalized: false,
                    stride: 0,
                    offset: 0
                };
            }
            if (this.drawMode === DrawMode.TRIANGLES) {
                attribues[Symbolic.ATTRIBUTE_NORMAL] = {
                    name: DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME,
                    glslType: 'vec3',
                    size: 3,
                    normalized: false,
                    stride: 0,
                    offset: 0
                };
            }
            return attribues;
        };
        GeometryAdapter.prototype.update = function (attributes) {
            var vertices = [];
            var colors = [];
            var normals = [];
            var elements = [];
            var vertexList = this.geometry.vertices;
            var color = this.color;
            var colorFunction = this.colorFunction;
            var colorMaker = function (vertexIndex, face, vertexList, normal) {
                if (color) {
                    return color;
                }
                else if (colorFunction) {
                    return colorFunction(vertexIndex, face, vertexList, normal);
                }
                else {
                    return defaultColorFunction(vertexIndex, face, vertexList, normal);
                }
            };
            switch (this.drawMode) {
                case DrawMode.POINTS:
                    {
                        this.points = [];
                        this.computePoints();
                        this.points.forEach(function (point) {
                            elements.push(point.a);
                            var vA = vertexList[point.a];
                            vertices.push(vA.x);
                            vertices.push(vA.y);
                            vertices.push(vA.z);
                            var colorA = color;
                            colors.push(colorA.red);
                            colors.push(colorA.green);
                            colors.push(colorA.blue);
                            colors.push(colorA.alpha);
                        });
                    }
                    break;
                case DrawMode.LINES:
                    {
                        this.lines = [];
                        this.computeLines();
                        this.lines.forEach(function (line) {
                            elements.push(line.a);
                            elements.push(line.b);
                            var vA = vertexList[line.a];
                            vertices.push(vA.x);
                            vertices.push(vA.y);
                            vertices.push(vA.z);
                            var vB = vertexList[line.b];
                            vertices.push(vB.x);
                            vertices.push(vB.y);
                            vertices.push(vB.z);
                            var colorA = color;
                            var colorB = color;
                            colors.push(colorA.red);
                            colors.push(colorA.green);
                            colors.push(colorA.blue);
                            colors.push(colorA.alpha);
                            colors.push(colorB.red);
                            colors.push(colorB.green);
                            colors.push(colorB.blue);
                            colors.push(colorB.alpha);
                        });
                    }
                    break;
                case DrawMode.TRIANGLES:
                    {
                        this.geometry.faces.forEach(function (face) {
                            elements.push(face.a);
                            elements.push(face.b);
                            elements.push(face.c);
                            var vA = vertexList[face.a];
                            vertices.push(vA.x);
                            vertices.push(vA.y);
                            vertices.push(vA.z);
                            var vB = vertexList[face.b];
                            vertices.push(vB.x);
                            vertices.push(vB.y);
                            vertices.push(vB.z);
                            var vC = vertexList[face.c];
                            vertices.push(vC.x);
                            vertices.push(vC.y);
                            vertices.push(vC.z);
                            // Make copies where needed to avoid mutating the geometry.
                            var a = vertexList[face.a];
                            var b = vertexList[face.b].clone();
                            var c = vertexList[face.c].clone();
                            var perp = b.sub(a).cross(c.sub(a));
                            // TODO: This is simply the normalize() function.
                            var normal = perp.divideScalar(perp.length());
                            normals.push(normal.x);
                            normals.push(normal.y);
                            normals.push(normal.z);
                            normals.push(normal.x);
                            normals.push(normal.y);
                            normals.push(normal.z);
                            normals.push(normal.x);
                            normals.push(normal.y);
                            normals.push(normal.z);
                            var colorA = colorMaker(face.a, face, vertexList, normal);
                            var colorB = colorMaker(face.b, face, vertexList, normal);
                            var colorC = colorMaker(face.c, face, vertexList, normal);
                            colors.push(colorA.red);
                            colors.push(colorA.green);
                            colors.push(colorA.blue);
                            colors.push(colorA.alpha);
                            colors.push(colorB.red);
                            colors.push(colorB.green);
                            colors.push(colorB.blue);
                            colors.push(colorB.alpha);
                            colors.push(colorC.red);
                            colors.push(colorC.green);
                            colors.push(colorC.blue);
                            colors.push(colorC.alpha);
                        });
                    }
                    break;
                default: {
                }
            }
            this.elementArray = new Uint16Array(elements);
            this.aVertexPositionArray = new Float32Array(vertices);
            this.aVertexColorArray = new Float32Array(colors);
            this.aVertexNormalArray = new Float32Array(normals);
        };
        GeometryAdapter.prototype.computeLines = function () {
            var lines = this.lines;
            this.geometry.faces.forEach(function (face) {
                lines.push(new Line3(face.a, face.b));
                lines.push(new Line3(face.b, face.c));
                lines.push(new Line3(face.c, face.a));
            });
        };
        GeometryAdapter.prototype.computePoints = function () {
            var points = this.points;
            this.geometry.faces.forEach(function (face) {
                points.push(new Point3(face.a));
                points.push(new Point3(face.b));
                points.push(new Point3(face.c));
            });
        };
        return GeometryAdapter;
    })();
    return GeometryAdapter;
});

define('davinci-eight/math/Vector2',["require", "exports"], function (require, exports) {
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
        Vector2.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vector2.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector2.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Vector2.prototype.setComponent = function (index, value) {
            switch (index) {
                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                default: throw new Error('index is out of range: ' + index);
            }
        };
        Vector2.prototype.getComponent = function (index) {
            switch (index) {
                case 0: return this.x;
                case 1: return this.y;
                default: throw new Error('index is out of range: ' + index);
            }
        };
        Vector2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        Vector2.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        };
        Vector2.prototype.addScalar = function (s) {
            this.x += s;
            this.y += s;
            return this;
        };
        Vector2.prototype.addVectors = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            return this;
        };
        Vector2.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vector2.prototype.subScalar = function (s) {
            this.x -= s;
            this.y -= s;
            return this;
        };
        Vector2.prototype.subVectors = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        };
        Vector2.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };
        Vector2.prototype.multiplyScalar = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        Vector2.prototype.divide = function (v) {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        };
        Vector2.prototype.divideScalar = function (scalar) {
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.x *= invScalar;
                this.y *= invScalar;
            }
            else {
                this.x = 0;
                this.y = 0;
            }
            return this;
        };
        Vector2.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            if (this.y > v.y) {
                this.y = v.y;
            }
            return this;
        };
        Vector2.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            if (this.y < v.y) {
                this.y = v.y;
            }
            return this;
        };
        Vector2.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        };
        Vector2.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        };
        Vector2.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        };
        Vector2.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            return this;
        };
        Vector2.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Vector2.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        Vector2.prototype.lengthSq = function () {
            return this.x * this.x + this.y * this.y;
        };
        Vector2.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Vector2.prototype.normalize = function () {
            return this.divideScalar(this.length());
        };
        Vector2.prototype.distanceTo = function (v) {
            return Math.sqrt(this.distanceToSquared(v));
        };
        Vector2.prototype.distanceToSquared = function (v) {
            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;
        };
        Vector2.prototype.setLength = function (l) {
            var oldLength = this.length();
            if (oldLength !== 0 && l !== oldLength) {
                this.multiplyScalar(l / oldLength);
            }
            return this;
        };
        Vector2.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            return this;
        };
        Vector2.prototype.lerpVectors = function (v1, v2, alpha) {
            this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
            return this;
        };
        Vector2.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y));
        };
        Vector2.prototype.fromArray = function (array, offset) {
            if (offset === undefined)
                offset = 0;
            this.x = array[offset];
            this.y = array[offset + 1];
            return this;
        };
        Vector2.prototype.toArray = function (array, offset) {
            if (array === undefined)
                array = [];
            if (offset === undefined)
                offset = 0;
            array[offset] = this.x;
            array[offset + 1] = this.y;
            return array;
        };
        Vector2.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === undefined)
                offset = 0;
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            return this;
        };
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };
        return Vector2;
    })();
    return Vector2;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/RevolutionGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Spinor3', '../math/Vector2'], function (require, exports, Face3, Geometry, Spinor3, Vector2) {
    var RevolutionGeometry = (function (_super) {
        __extends(RevolutionGeometry, _super);
        function RevolutionGeometry(points, generator, segments, phiStart, phiLength, attitude) {
            _super.call(this);
            segments = segments || 12;
            phiStart = phiStart || 0;
            phiLength = phiLength || 2 * Math.PI;
            // Determine heuristically whether the user intended to make a complete revolution.
            var isClosed = Math.abs(2 * Math.PI - Math.abs(phiLength - phiStart)) < 0.0001;
            // The number of vertical half planes (phi constant).
            var halfPlanes = isClosed ? segments : segments + 1;
            var inverseSegments = 1.0 / segments;
            var phiStep = (phiLength - phiStart) * inverseSegments;
            var i;
            var j;
            var il;
            var jl;
            for (i = 0, il = halfPlanes; i < il; i++) {
                var phi = phiStart + i * phiStep;
                var halfAngle = phi / 2;
                var cosHA = Math.cos(halfAngle);
                var sinHA = Math.sin(halfAngle);
                // TODO: This is simply the exp(B theta / 2), maybe needs a sign.
                var rotor = new Spinor3({ yz: generator.yz * sinHA, zx: generator.zx * sinHA, xy: generator.xy * sinHA, w: cosHA });
                for (j = 0, jl = points.length; j < jl; j++) {
                    var vertex = points[j].clone();
                    // The generator tells us how to rotate the points.
                    vertex.applySpinor(rotor);
                    // The attitude tells us where we want the symmetry axis to be.
                    if (attitude) {
                        vertex.applySpinor(attitude);
                    }
                    this.vertices.push(vertex);
                }
            }
            var inversePointLength = 1.0 / (points.length - 1);
            var np = points.length;
            // The denominator for modulo index arithmetic.
            var wrap = np * halfPlanes;
            for (i = 0, il = segments; i < il; i++) {
                for (j = 0, jl = points.length - 1; j < jl; j++) {
                    var base = j + np * i;
                    var a = base % wrap;
                    var b = (base + np) % wrap;
                    var c = (base + 1 + np) % wrap;
                    var d = (base + 1) % wrap;
                    var u0 = i * inverseSegments;
                    var v0 = j * inversePointLength;
                    var u1 = u0 + inverseSegments;
                    var v1 = v0 + inversePointLength;
                    this.faces.push(new Face3(d, b, a));
                    this.faceVertexUvs[0].push([
                        new Vector2(u0, v0),
                        new Vector2(u1, v0),
                        new Vector2(u0, v1)
                    ]);
                    this.faces.push(new Face3(d, c, b));
                    this.faceVertexUvs[0].push([
                        new Vector2(u1, v0),
                        new Vector2(u1, v1),
                        new Vector2(u0, v1)
                    ]);
                }
            }
            this.computeFaceNormals();
            this.computeVertexNormals();
        }
        return RevolutionGeometry;
    })(Geometry);
    return RevolutionGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/ArrowGeometry',["require", "exports", '../geometries/RevolutionGeometry', '../math/Spinor3', '../math/Vector3'], function (require, exports, RevolutionGeometry, Spinor3, Vector3) {
    var ArrowGeometry = (function (_super) {
        __extends(ArrowGeometry, _super);
        function ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, lengthCone, axis) {
            if (scale === void 0) { scale = 1; }
            if (attitude === void 0) { attitude = new Spinor3(); }
            if (segments === void 0) { segments = 12; }
            if (length === void 0) { length = 1; }
            if (radiusShaft === void 0) { radiusShaft = 0.01; }
            if (radiusCone === void 0) { radiusCone = 0.08; }
            if (lengthCone === void 0) { lengthCone = 0.20; }
            if (axis === void 0) { axis = Vector3.e3.clone(); }
            scale = scale || 1;
            attitude = attitude || new Spinor3();
            length = (length || 1) * scale;
            radiusShaft = (radiusShaft || 0.01) * scale;
            radiusCone = (radiusCone || 0.08) * scale;
            lengthCone = (lengthCone || 0.20) * scale;
            axis = axis || Vector3.e3.clone();
            var lengthShaft = length - lengthCone;
            var halfLength = length / 2;
            var permutation = function (direction) {
                if (direction.x) {
                    return 2;
                }
                else if (direction.y) {
                    return 1;
                }
                else {
                    return 0;
                }
            };
            var orientation = function (direction) {
                if (direction.x > 0) {
                    return +1;
                }
                else if (direction.x < 0) {
                    return -1;
                }
                else if (direction.y > 0) {
                    return +1;
                }
                else if (direction.y < 0) {
                    return -1;
                }
                else if (direction.z > 0) {
                    return +1;
                }
                else if (direction.z < 0) {
                    return -1;
                }
                else {
                    return 0;
                }
            };
            var computeArrow = function (direction) {
                var cycle = permutation(direction);
                var sign = orientation(direction);
                var i = (cycle + 0) % 3;
                var j = (cycle + 1) % 3;
                var k = (cycle + 2) % 3;
                var shL = halfLength * sign;
                var data = [
                    [0, 0, halfLength * sign],
                    [radiusCone, 0, (lengthShaft - halfLength) * sign],
                    [radiusShaft, 0, (lengthShaft - halfLength) * sign],
                    [radiusShaft, 0, (-halfLength) * sign],
                    [0, 0, (-halfLength) * sign]
                ];
                var points = data.map(function (point) {
                    return new Vector3({ x: point[i], y: point[j], z: point[k] });
                });
                var generator = new Spinor3({ yz: direction.x, zx: direction.y, xy: direction.z, w: 0 });
                return { "points": points, "generator": generator };
            };
            var arrow = computeArrow(axis);
            _super.call(this, arrow.points, arrow.generator, segments, 0, 2 * Math.PI, attitude);
        }
        return ArrowGeometry;
    })(RevolutionGeometry);
    return ArrowGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/BoxGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry, Vector2, Vector3) {
    var BoxGeometry = (function (_super) {
        __extends(BoxGeometry, _super);
        function BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
            if (widthSegments === void 0) { widthSegments = 1; }
            if (heightSegments === void 0) { heightSegments = 1; }
            if (depthSegments === void 0) { depthSegments = 1; }
            _super.call(this);
            this.widthSegments = widthSegments || 1;
            this.heightSegments = heightSegments || 1;
            this.depthSegments = depthSegments || 1;
            var scope = this;
            var width_half = width / 2;
            var height_half = height / 2;
            var depth_half = depth / 2;
            buildPlane('z', 'y', -1, -1, depth, height, width_half, 0); // px
            buildPlane('z', 'y', 1, -1, depth, height, -width_half, 1); // nx
            buildPlane('x', 'z', 1, 1, width, depth, height_half, 2); // py
            buildPlane('x', 'z', 1, -1, width, depth, -height_half, 3); // ny
            buildPlane('x', 'y', 1, -1, width, height, depth_half, 4); // pz
            buildPlane('x', 'y', -1, -1, width, height, -depth_half, 5); // nz
            function buildPlane(u, v, udir, vdir, width, height, depth, unused) {
                var w, ix, iy, gridX = scope.widthSegments, gridY = scope.heightSegments, width_half = width / 2, height_half = height / 2, offset = scope.vertices.length;
                if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x')) {
                    w = 'z';
                }
                else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {
                    w = 'y';
                    gridY = scope.depthSegments;
                }
                else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {
                    w = 'x';
                    gridX = scope.depthSegments;
                }
                var gridX1 = gridX + 1, gridY1 = gridY + 1, segment_width = width / gridX, segment_height = height / gridY, normal = new Vector3();
                normal[w] = depth > 0 ? 1 : -1;
                for (iy = 0; iy < gridY1; iy++) {
                    for (ix = 0; ix < gridX1; ix++) {
                        var vector = new Vector3();
                        vector[u] = (ix * segment_width - width_half) * udir;
                        vector[v] = (iy * segment_height - height_half) * vdir;
                        vector[w] = depth;
                        scope.vertices.push(vector);
                    }
                }
                for (iy = 0; iy < gridY; iy++) {
                    for (ix = 0; ix < gridX; ix++) {
                        var a = ix + gridX1 * iy;
                        var b = ix + gridX1 * (iy + 1);
                        var c = (ix + 1) + gridX1 * (iy + 1);
                        var d = (ix + 1) + gridX1 * iy;
                        var uva = new Vector2(ix / gridX, 1 - iy / gridY);
                        var uvb = new Vector2(ix / gridX, 1 - (iy + 1) / gridY);
                        var uvc = new Vector2((ix + 1) / gridX, 1 - (iy + 1) / gridY);
                        var uvd = new Vector2((ix + 1) / gridX, 1 - iy / gridY);
                        var face = new Face3(a + offset, b + offset, d + offset);
                        face.normal.copy(normal);
                        face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone());
                        scope.faces.push(face);
                        scope.faceVertexUvs[0].push([uva, uvb, uvd]);
                        face = new Face3(b + offset, c + offset, d + offset);
                        face.normal.copy(normal);
                        face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone());
                        scope.faces.push(face);
                        scope.faceVertexUvs[0].push([uvb.clone(), uvc, uvd.clone()]);
                    }
                }
            }
            this.mergeVertices();
        }
        return BoxGeometry;
    })(Geometry);
    return BoxGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/CylinderGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry, Vector2, Vector3) {
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            _super.call(this);
            radiusTop = radiusTop !== undefined ? radiusTop : 1;
            radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
            height = height !== undefined ? height : 1;
            radialSegments = radialSegments || 16;
            heightSegments = heightSegments || 1;
            openEnded = openEnded !== undefined ? openEnded : false;
            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : 2 * Math.PI;
            var heightHalf = height / 2;
            var x;
            var y;
            var vertices = [];
            var uvs = [];
            for (y = 0; y <= heightSegments; y++) {
                var verticesRow = [];
                var uvsRow = [];
                var v = y / heightSegments;
                var radius = v * (radiusBottom - radiusTop) + radiusTop;
                for (x = 0; x <= radialSegments; x++) {
                    var u = x / radialSegments;
                    var vertex = new Vector3();
                    vertex.x = radius * Math.sin(u * thetaLength + thetaStart);
                    vertex.y = -v * height + heightHalf;
                    vertex.z = radius * Math.cos(u * thetaLength + thetaStart);
                    this.vertices.push(vertex);
                    verticesRow.push(this.vertices.length - 1);
                    uvsRow.push(new Vector2(u, 1 - v));
                }
                vertices.push(verticesRow);
                uvs.push(uvsRow);
            }
            var tanTheta = (radiusBottom - radiusTop) / height;
            var na;
            var nb;
            for (x = 0; x < radialSegments; x++) {
                if (radiusTop !== 0) {
                    na = this.vertices[vertices[0][x]].clone();
                    nb = this.vertices[vertices[0][x + 1]].clone();
                }
                else {
                    na = this.vertices[vertices[1][x]].clone();
                    nb = this.vertices[vertices[1][x + 1]].clone();
                }
                na.setY(Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta).normalize();
                nb.setY(Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta).normalize();
                for (y = 0; y < heightSegments; y++) {
                    var v1 = vertices[y][x];
                    var v2 = vertices[y + 1][x];
                    var v3 = vertices[y + 1][x + 1];
                    var v4 = vertices[y][x + 1];
                    var n1 = na.clone();
                    var n2 = na.clone();
                    var n3 = nb.clone();
                    var n4 = nb.clone();
                    var uv1 = uvs[y][x].clone();
                    var uv2 = uvs[y + 1][x].clone();
                    var uv3 = uvs[y + 1][x + 1].clone();
                    var uv4 = uvs[y][x + 1].clone();
                    this.faces.push(new Face3(v1, v2, v4, [n1, n2, n4]));
                    this.faceVertexUvs[0].push([uv1, uv2, uv4]);
                    this.faces.push(new Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]));
                    this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()]);
                }
            }
            // top cap
            if (openEnded === false && radiusTop > 0) {
                this.vertices.push(Vector3.e2.clone().multiplyScalar(heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[0][x];
                    var v2 = vertices[0][x + 1];
                    var v3 = this.vertices.length - 1;
                    var n1 = Vector3.e2;
                    var n2 = Vector3.e2;
                    var n3 = Vector3.e2;
                    var uv1 = uvs[0][x].clone();
                    var uv2 = uvs[0][x + 1].clone();
                    var uv3 = new Vector2(uv2.x, 0);
                    this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
                    this.faceVertexUvs[0].push([uv1, uv2, uv3]);
                }
            }
            // bottom cap
            if (openEnded === false && radiusBottom > 0) {
                this.vertices.push(Vector3.e2.clone().multiplyScalar(-heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[heightSegments][x + 1];
                    var v2 = vertices[heightSegments][x];
                    var v3 = this.vertices.length - 1;
                    var n1 = Vector3.e2.clone().multiplyScalar(-1);
                    var n2 = Vector3.e2.clone().multiplyScalar(-1);
                    var n3 = Vector3.e2.clone().multiplyScalar(-1);
                    var uv1 = uvs[heightSegments][x + 1].clone();
                    var uv2 = uvs[heightSegments][x].clone();
                    var uv3 = new Vector2(uv2.x, 1);
                    this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
                    this.faceVertexUvs[0].push([uv1, uv2, uv3]);
                }
            }
            this.computeFaceNormals();
        }
        return CylinderGeometry;
    })(Geometry);
    return CylinderGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/PolyhedronGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Sphere', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry, Sphere, Vector2, Vector3) {
    var PolyhedronGeometry = (function (_super) {
        __extends(PolyhedronGeometry, _super);
        function PolyhedronGeometry(vertices, indices, radius, detail) {
            _super.call(this);
            this.type = 'PolyhedronGeometry';
            this.parameters = {
                vertices: vertices,
                indices: indices,
                radius: radius,
                detail: detail
            };
            radius = radius || 1;
            detail = detail || 0;
            var that = this;
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                prepare(new Vector3({ x: vertices[i], y: vertices[i + 1], z: vertices[i + 2] }));
            }
            var p = this.vertices;
            var faces = [];
            for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
                var v1 = p[indices[i]];
                var v2 = p[indices[i + 1]];
                var v3 = p[indices[i + 2]];
                faces[j] = new Face3(v1['index'], v2['index'], v3['index'], [v1.clone(), v2.clone(), v3.clone()]);
            }
            var centroid = new Vector3();
            for (var i = 0, facesLength = faces.length; i < facesLength; i++) {
                subdivide(faces[i], detail);
            }
            // Handle case when face straddles the seam
            for (var i = 0, faceVertexUvsZeroLength = this.faceVertexUvs[0].length; i < faceVertexUvsZeroLength; i++) {
                var uvs = this.faceVertexUvs[0][i];
                var x0 = uvs[0].x;
                var x1 = uvs[1].x;
                var x2 = uvs[2].x;
                var max = Math.max(x0, Math.max(x1, x2));
                var min = Math.min(x0, Math.min(x1, x2));
                if (max > 0.9 && min < 0.1) {
                    if (x0 < 0.2)
                        uvs[0].x += 1;
                    if (x1 < 0.2)
                        uvs[1].x += 1;
                    if (x2 < 0.2)
                        uvs[2].x += 1;
                }
            }
            // Apply radius
            for (var i = 0, verticesLength = this.vertices.length; i < verticesLength; i++) {
                this.vertices[i].multiplyScalar(radius);
            }
            // Merge vertices
            this.mergeVertices();
            this.computeFaceNormals();
            this.boundingSphere = new Sphere(new Vector3(), radius);
            // Project vector onto sphere's surface
            function prepare(vector) {
                var vertex = vector.normalize().clone();
                vertex['index'] = that.vertices.push(vertex) - 1;
                // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
                var u = azimuth(vector) / 2 / Math.PI + 0.5;
                var v = inclination(vector) / Math.PI + 0.5;
                vertex['uv'] = new Vector2(u, 1 - v);
                return vertex;
            }
            // Approximate a curved face with recursively sub-divided triangles.
            function make(v1, v2, v3) {
                var face = new Face3(v1['index'], v2['index'], v3['index'], [v1.clone(), v2.clone(), v3.clone()]);
                that.faces.push(face);
                centroid.copy(v1).add(v2).add(v3).divideScalar(3);
                var azi = azimuth(centroid);
                that.faceVertexUvs[0].push([
                    correctUV(v1['uv'], v1, azi),
                    correctUV(v2['uv'], v2, azi),
                    correctUV(v3['uv'], v3, azi)
                ]);
            }
            // Analytically subdivide a face to the required detail level.
            function subdivide(face, detail) {
                var cols = Math.pow(2, detail);
                var a = prepare(that.vertices[face.a]);
                var b = prepare(that.vertices[face.b]);
                var c = prepare(that.vertices[face.c]);
                var v = [];
                // Construct all of the vertices for this subdivision.
                for (var i = 0; i <= cols; i++) {
                    v[i] = [];
                    var aj = prepare(a.clone().lerp(c, i / cols));
                    var bj = prepare(b.clone().lerp(c, i / cols));
                    var rows = cols - i;
                    for (var j = 0; j <= rows; j++) {
                        if (j == 0 && i == cols) {
                            v[i][j] = aj;
                        }
                        else {
                            v[i][j] = prepare(aj.clone().lerp(bj, j / rows));
                        }
                    }
                }
                // Construct all of the faces.
                for (var i = 0; i < cols; i++) {
                    for (var j = 0; j < 2 * (cols - i) - 1; j++) {
                        var k = Math.floor(j / 2);
                        if (j % 2 == 0) {
                            make(v[i][k + 1], v[i + 1][k], v[i][k]);
                        }
                        else {
                            make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k]);
                        }
                    }
                }
            }
            // Angle around the Y axis, counter-clockwise when looking from above.
            function azimuth(vector) {
                return Math.atan2(vector.z, -vector.x);
            }
            // Angle above the XZ plane.
            function inclination(vector) {
                return Math.atan2(-vector.y, Math.sqrt((vector.x * vector.x) + (vector.z * vector.z)));
            }
            // Texture fixing helper. Spheres have some odd behaviours.
            function correctUV(uv, vector, azimuth) {
                if ((azimuth < 0) && (uv.x === 1))
                    uv = new Vector2(uv.x - 1, uv.y);
                if ((vector.x === 0) && (vector.z === 0))
                    uv = new Vector2(azimuth / 2 / Math.PI + 0.5, uv.y);
                return uv.clone();
            }
        }
        return PolyhedronGeometry;
    })(Geometry);
    return PolyhedronGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/DodecahedronGeometry',["require", "exports", '../geometries/PolyhedronGeometry'], function (require, exports, PolyhedronGeometry) {
    var t = (1 + Math.sqrt(5)) / 2;
    var r = 1 / t;
    var vertices = [
        // (±1, ±1, ±1)
        -1, -1, -1, -1, -1, 1,
        -1, 1, -1, -1, 1, 1,
        1, -1, -1, 1, -1, 1,
        1, 1, -1, 1, 1, 1,
        // (0, ±1/φ, ±φ)
        0, -r, -t, 0, -r, t,
        0, r, -t, 0, r, t,
        // (±1/φ, ±φ, 0)
        -r, -t, 0, -r, t, 0,
        r, -t, 0, r, t, 0,
        // (±φ, 0, ±1/φ)
        -t, 0, -r, t, 0, -r,
        -t, 0, r, t, 0, r
    ];
    var indices = [
        3, 11, 7, 3, 7, 15, 3, 15, 13,
        7, 19, 17, 7, 17, 6, 7, 6, 15,
        17, 4, 8, 17, 8, 10, 17, 10, 6,
        8, 0, 16, 8, 16, 2, 8, 2, 10,
        0, 12, 1, 0, 1, 18, 0, 18, 16,
        6, 10, 2, 6, 2, 13, 6, 13, 15,
        2, 16, 18, 2, 18, 3, 2, 3, 13,
        18, 1, 9, 18, 9, 11, 18, 11, 3,
        4, 14, 12, 4, 12, 0, 4, 0, 8,
        11, 9, 5, 11, 5, 19, 11, 19, 7,
        19, 5, 14, 19, 14, 4, 19, 4, 17,
        1, 12, 14, 1, 14, 5, 1, 5, 9
    ];
    var DodecahedronGeometry = (function (_super) {
        __extends(DodecahedronGeometry, _super);
        function DodecahedronGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return DodecahedronGeometry;
    })(PolyhedronGeometry);
    return DodecahedronGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/IcosahedronGeometry',["require", "exports", '../geometries/PolyhedronGeometry'], function (require, exports, PolyhedronGeometry) {
    var t = (1 + Math.sqrt(5)) / 2;
    var vertices = [
        -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0,
        0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t,
        t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1
    ];
    var indices = [
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
        1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
        3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
        4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
    ];
    var IcosahedronGeometry = (function (_super) {
        __extends(IcosahedronGeometry, _super);
        function IcosahedronGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
            this.type = 'IcosahedronGeometry';
        }
        return IcosahedronGeometry;
    })(PolyhedronGeometry);
    return IcosahedronGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/ParametricGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Vector2'], function (require, exports, Face3, Geometry, Vector2) {
    /**
     * @author zz85 / https://github.com/zz85
     * Parametric Surfaces Geometry
     * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
     *
     * new ParametricGeometry( parametricFunction, uSegments, vSegments );
     */
    var ParametricGeometry = (function (_super) {
        __extends(ParametricGeometry, _super);
        function ParametricGeometry(parametricFunction, uSegments, vSegments) {
            _super.call(this);
            var verts = this.vertices;
            var faces = this.faces;
            var uvs = this.faceVertexUvs[0];
            var i;
            var j;
            var p;
            var u;
            var v;
            var sliceCount = uSegments + 1;
            for (i = 0; i <= vSegments; i++) {
                v = i / vSegments;
                for (j = 0; j <= uSegments; j++) {
                    u = j / uSegments;
                    p = parametricFunction(u, v);
                    verts.push(p);
                }
            }
            var a, b, c, d;
            var uva;
            var uvb;
            var uvc;
            var uvd;
            for (i = 0; i < vSegments; i++) {
                for (j = 0; j < uSegments; j++) {
                    a = i * sliceCount + j;
                    b = i * sliceCount + j + 1;
                    c = (i + 1) * sliceCount + j + 1;
                    d = (i + 1) * sliceCount + j;
                    uva = new Vector2(j / uSegments, i / vSegments);
                    uvb = new Vector2((j + 1) / uSegments, i / vSegments);
                    uvc = new Vector2((j + 1) / uSegments, (i + 1) / vSegments);
                    uvd = new Vector2(j / uSegments, (i + 1) / vSegments);
                    faces.push(new Face3(a, b, d));
                    uvs.push([uva, uvb, uvd]);
                    faces.push(new Face3(b, c, d));
                    uvs.push([uvb.clone(), uvc, uvd.clone()]);
                }
            }
            this.computeFaceNormals();
            this.computeVertexNormals();
        }
        return ParametricGeometry;
    })(Geometry);
    return ParametricGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/KleinBottleGeometry',["require", "exports", '../geometries/ParametricGeometry', '../math/Vector3'], function (require, exports, ParametricGeometry, Vector3) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function klein(u, v) {
        var point = new Vector3();
        u = u * 2 * pi;
        v = v * 2 * pi;
        if (u < pi) {
            point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(u) * cos(v);
            point.z = -8 * sin(u) - 2 * (1 - cos(u) / 2) * sin(u) * cos(v);
        }
        else {
            point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(v + pi);
            point.z = -8 * sin(u);
        }
        point.y = -2 * (1 - cos(u) / 2) * sin(v);
        return point;
    }
    /**
     * By connecting the edge of a Mobius Strip we get a Klein Bottle.
     * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
     * @class KleinBottleGeometry
     * @extends ParametricGeometry
     */
    var KleinBottleGeometry = (function (_super) {
        __extends(KleinBottleGeometry, _super);
        /**
         * @class KleinBottleGeometry
         * @constructor
         * @param uSegments {number}
         * @param vSegments {number}
         */
        function KleinBottleGeometry(uSegments, vSegments) {
            _super.call(this, klein, uSegments, vSegments);
        }
        return KleinBottleGeometry;
    })(ParametricGeometry);
    return KleinBottleGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/MobiusStripGeometry',["require", "exports", '../geometries/ParametricGeometry', '../math/Vector3'], function (require, exports, ParametricGeometry, Vector3) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function mobius(u, v) {
        var point = new Vector3();
        /**
         * radius
         */
        var R = 1;
        /**
         * half-width
         */
        var w = 0.05;
        var s = (2 * u - 1) * w; // [-w, w]
        var t = 2 * pi * v; // [0, 2pi]
        point.x = (R + s * cos(t / 2)) * cos(t);
        point.y = (R + s * cos(t / 2)) * sin(t);
        point.z = s * sin(t / 2);
        return point;
    }
    /**
     * http://virtualmathmuseum.org/Surface/moebius_strip/moebius_strip.html
     */
    var MobiusStripGeometry = (function (_super) {
        __extends(MobiusStripGeometry, _super);
        function MobiusStripGeometry(uSegments, vSegments) {
            _super.call(this, mobius, uSegments, vSegments);
        }
        return MobiusStripGeometry;
    })(ParametricGeometry);
    return MobiusStripGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/OctahedronGeometry',["require", "exports", '../geometries/PolyhedronGeometry'], function (require, exports, PolyhedronGeometry) {
    var vertices = [
        1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1
    ];
    var indices = [
        0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2
    ];
    var OctahedronGeometry = (function (_super) {
        __extends(OctahedronGeometry, _super);
        function OctahedronGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return OctahedronGeometry;
    })(PolyhedronGeometry);
    return OctahedronGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/SphereGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Sphere', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry, Sphere, Vector2, Vector3) {
    var SphereGeometry = (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
            _super.call(this);
            radius = radius || 1;
            widthSegments = Math.max(3, Math.floor(widthSegments) || 16);
            heightSegments = Math.max(2, Math.floor(heightSegments) || 12);
            phiStart = phiStart !== undefined ? phiStart : 0;
            phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;
            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;
            var x;
            var y;
            var vertices = [];
            var uvs = [];
            for (y = 0; y <= heightSegments; y++) {
                var verticesRow = [];
                var uvsRow = [];
                for (x = 0; x <= widthSegments; x++) {
                    var u = x / widthSegments;
                    var v = y / heightSegments;
                    var vertex = new Vector3();
                    vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                    vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    this.vertices.push(vertex);
                    verticesRow.push(this.vertices.length - 1);
                    uvsRow.push(new Vector2(u, 1 - v));
                }
                vertices.push(verticesRow);
                uvs.push(uvsRow);
            }
            for (y = 0; y < heightSegments; y++) {
                for (x = 0; x < widthSegments; x++) {
                    var v1 = vertices[y][x + 1];
                    var v2 = vertices[y][x];
                    var v3 = vertices[y + 1][x];
                    var v4 = vertices[y + 1][x + 1];
                    var n1 = this.vertices[v1].clone().normalize();
                    var n2 = this.vertices[v2].clone().normalize();
                    var n3 = this.vertices[v3].clone().normalize();
                    var n4 = this.vertices[v4].clone().normalize();
                    var uv1 = uvs[y][x + 1].clone();
                    var uv2 = uvs[y][x].clone();
                    var uv3 = uvs[y + 1][x].clone();
                    var uv4 = uvs[y + 1][x + 1].clone();
                    if (Math.abs(this.vertices[v1].y) === radius) {
                        uv1.x = (uv1.x + uv2.x) / 2;
                        this.faces.push(new Face3(v1, v3, v4, [n1, n3, n4]));
                        this.faceVertexUvs[0].push([uv1, uv3, uv4]);
                    }
                    else if (Math.abs(this.vertices[v3].y) === radius) {
                        uv3.x = (uv3.x + uv4.x) / 2;
                        this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
                        this.faceVertexUvs[0].push([uv1, uv2, uv3]);
                    }
                    else {
                        this.faces.push(new Face3(v1, v2, v4, [n1, n2, n4]));
                        this.faceVertexUvs[0].push([uv1, uv2, uv4]);
                        this.faces.push(new Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]));
                        this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()]);
                    }
                }
            }
            this.computeFaceNormals();
            this.boundingSphere = new Sphere(new Vector3(), radius);
        }
        return SphereGeometry;
    })(Geometry);
    return SphereGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/TetrahedronGeometry',["require", "exports", '../geometries/PolyhedronGeometry'], function (require, exports, PolyhedronGeometry) {
    var vertices = [
        1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
    ];
    var indices = [
        2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
    ];
    var TetrahedronGeometry = (function (_super) {
        __extends(TetrahedronGeometry, _super);
        function TetrahedronGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return TetrahedronGeometry;
    })(PolyhedronGeometry);
    return TetrahedronGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/TubeGeometry',["require", "exports", '../math/clamp', '../core/Face3', '../geometries/Geometry', '../math/Matrix4', '../math/Vector2', '../math/Vector3'], function (require, exports, clamp, Face3, Geometry, Matrix4, Vector2, Vector3) {
    var TubeGeometry = (function (_super) {
        __extends(TubeGeometry, _super);
        function TubeGeometry(path, segments, radius, radialSegments, closed, taper) {
            _super.call(this);
            segments = segments || 64;
            radius = radius || 0.05;
            radialSegments = radialSegments || 16;
            closed = closed || false;
            taper = taper || TubeGeometry.NoTaper;
            var grid = [];
            var scope = this;
            var tangent;
            var normal;
            var binormal;
            var numpoints = segments + 1;
            var u;
            var v;
            var r;
            var cx;
            var cy;
            var pos;
            var pos2 = new Vector3();
            var i;
            var j;
            var ip;
            var jp;
            var a;
            var b;
            var c;
            var d;
            var uva;
            var uvb;
            var uvc;
            var uvd;
            var frames = new FrenetFrames(path, segments, closed);
            var tangents = frames.tangents;
            var normals = frames.normals;
            var binormals = frames.binormals;
            // proxy internals
            this.tangents = tangents;
            this.normals = normals;
            this.binormals = binormals;
            function vert(x, y, z) {
                return scope.vertices.push(new Vector3({ x: x, y: y, z: z })) - 1;
            }
            // consruct the grid
            for (i = 0; i < numpoints; i++) {
                grid[i] = [];
                u = i / (numpoints - 1);
                pos = path.getPointAt(u);
                tangent = tangents[i];
                normal = normals[i];
                binormal = binormals[i];
                r = radius * taper(u);
                for (j = 0; j < radialSegments; j++) {
                    v = j / radialSegments * 2 * Math.PI;
                    cx = -r * Math.cos(v); // TODO: Hack: Negating it so it faces outside.
                    cy = r * Math.sin(v);
                    pos2.copy(pos);
                    pos2.x += cx * normal.x + cy * binormal.x;
                    pos2.y += cx * normal.y + cy * binormal.y;
                    pos2.z += cx * normal.z + cy * binormal.z;
                    grid[i][j] = vert(pos2.x, pos2.y, pos2.z);
                }
            }
            for (i = 0; i < segments; i++) {
                for (j = 0; j < radialSegments; j++) {
                    ip = (closed) ? (i + 1) % segments : i + 1;
                    jp = (j + 1) % radialSegments;
                    a = grid[i][j]; // *** NOT NECESSARILY PLANAR ! ***
                    b = grid[ip][j];
                    c = grid[ip][jp];
                    d = grid[i][jp];
                    uva = new Vector2(i / segments, j / radialSegments);
                    uvb = new Vector2((i + 1) / segments, j / radialSegments);
                    uvc = new Vector2((i + 1) / segments, (j + 1) / radialSegments);
                    uvd = new Vector2(i / segments, (j + 1) / radialSegments);
                    this.faces.push(new Face3(a, b, d));
                    this.faceVertexUvs[0].push([uva, uvb, uvd]);
                    this.faces.push(new Face3(b, c, d));
                    this.faceVertexUvs[0].push([uvb.clone(), uvc, uvd.clone()]);
                }
            }
            this.computeFaceNormals();
            this.computeVertexNormals();
        }
        TubeGeometry.NoTaper = function (u) { return 1; };
        TubeGeometry.SinusoidalTaper = function (u) { return Math.sin(Math.PI * u); };
        return TubeGeometry;
    })(Geometry);
    // For computing of Frenet frames, exposing the tangents, normals and binormals the spline
    var FrenetFrames = (function () {
        function FrenetFrames(path, segments, closed) {
            var normal = new Vector3();
            var tangents = [];
            var normals = [];
            var binormals = [];
            var vec = new Vector3();
            var mat = new Matrix4();
            var numpoints = segments + 1;
            var theta;
            var epsilon = 0.0001;
            var smallest;
            // TODO: The folloowing should be a Vector3
            var tx;
            var ty;
            var tz;
            var i;
            var u;
            // expose internals
            this.tangents = tangents;
            this.normals = normals;
            this.binormals = binormals;
            // compute the tangent vectors for each segment on the path
            for (i = 0; i < numpoints; i++) {
                u = i / (numpoints - 1);
                tangents[i] = path.getTangentAt(u);
                tangents[i].normalize();
            }
            initialNormal3();
            /*
            function initialNormal1(lastBinormal) {
              // fixed start binormal. Has dangers of 0 vectors
              normals[ 0 ] = new THREE.Vector3();
              binormals[ 0 ] = new THREE.Vector3();
              if (lastBinormal===undefined) lastBinormal = new THREE.Vector3( 0, 0, 1 );
              normals[ 0 ].crossVectors( lastBinormal, tangents[ 0 ] ).normalize();
              binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] ).normalize();
            }
            function initialNormal2() {
              // This uses the Frenet-Serret formula for deriving binormal
              var t2 = path.getTangentAt( epsilon );
              normals[ 0 ] = new THREE.Vector3().subVectors( t2, tangents[ 0 ] ).normalize();
              binormals[ 0 ] = new THREE.Vector3().crossVectors( tangents[ 0 ], normals[ 0 ] );
              normals[ 0 ].crossVectors( binormals[ 0 ], tangents[ 0 ] ).normalize(); // last binormal x tangent
              binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] ).normalize();
            }
            */
            function initialNormal3() {
                // select an initial normal vector perpendicular to the first tangent vector,
                // and in the direction of the smallest tangent xyz component
                normals[0] = new Vector3();
                binormals[0] = new Vector3();
                smallest = Number.MAX_VALUE;
                tx = Math.abs(tangents[0].x);
                ty = Math.abs(tangents[0].y);
                tz = Math.abs(tangents[0].z);
                if (tx <= smallest) {
                    smallest = tx;
                    normal.set(1, 0, 0);
                }
                if (ty <= smallest) {
                    smallest = ty;
                    normal.set(0, 1, 0);
                }
                if (tz <= smallest) {
                    normal.set(0, 0, 1);
                }
                vec.crossVectors(tangents[0], normal).normalize();
                normals[0].crossVectors(tangents[0], vec);
                binormals[0].crossVectors(tangents[0], normals[0]);
            }
            // compute the slowly-varying normal and binormal vectors for each segment on the path
            for (i = 1; i < numpoints; i++) {
                normals[i] = normals[i - 1].clone();
                binormals[i] = binormals[i - 1].clone();
                vec.crossVectors(tangents[i - 1], tangents[i]);
                if (vec.length() > epsilon) {
                    vec.normalize();
                    theta = Math.acos(clamp(tangents[i - 1].dot(tangents[i]), -1, 1)); // clamp for floating pt errors
                    normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));
                }
                binormals[i].crossVectors(tangents[i], normals[i]);
            }
            // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same
            if (closed) {
                theta = Math.acos(clamp(normals[0].dot(normals[numpoints - 1]), -1, 1));
                theta /= (numpoints - 1);
                if (tangents[0].dot(vec.crossVectors(normals[0], normals[numpoints - 1])) > 0) {
                    theta = -theta;
                }
                for (i = 1; i < numpoints; i++) {
                    // twist a little...
                    normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i));
                    binormals[i].crossVectors(tangents[i], normals[i]);
                }
            }
        }
        return FrenetFrames;
    })();
    return TubeGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/VortexGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry, Vector2, Vector3) {
    var VortexGeometry = (function (_super) {
        __extends(VortexGeometry, _super);
        function VortexGeometry(radius, radiusCone, radiusShaft, lengthCone, lengthShaft, arrowSegments, radialSegments) {
            if (radius === void 0) { radius = 1; }
            if (radiusCone === void 0) { radiusCone = 0.08; }
            if (radiusShaft === void 0) { radiusShaft = 0.01; }
            if (lengthCone === void 0) { lengthCone = 0.2; }
            if (lengthShaft === void 0) { lengthShaft = 0.8; }
            if (arrowSegments === void 0) { arrowSegments = 8; }
            if (radialSegments === void 0) { radialSegments = 12; }
            _super.call(this);
            var scope = this;
            var n = 9;
            radius = radius || 1;
            radiusCone = radiusCone || 0.08;
            radiusShaft = radiusShaft || 0.01;
            lengthCone = lengthCone || 0.2;
            lengthShaft = lengthShaft || 0.8;
            arrowSegments = arrowSegments || 8;
            var circleSegments = arrowSegments * n;
            radialSegments = radialSegments || 12;
            var twoPI = Math.PI * 2;
            var R = radius;
            var center = new Vector3();
            var uvs = [];
            var normals = [];
            var alpha = lengthShaft / (lengthCone + lengthShaft);
            var factor = twoPI / arrowSegments;
            var theta = alpha / (n - 2);
            function computeAngle(circleSegments, i) {
                var m = i % n;
                if (m === n - 1) {
                    return computeAngle(circleSegments, i - 1);
                }
                else {
                    var a = (i - m) / n;
                    return factor * (a + m * theta);
                }
            }
            function computeRadius(i) {
                var m = i % n;
                if (m === n - 1) {
                    return radiusCone;
                }
                else {
                    return radiusShaft;
                }
            }
            for (var j = 0; j <= radialSegments; j++) {
                // v is the angle inside the vortex tube.
                var v = twoPI * j / radialSegments;
                var cosV = Math.cos(v);
                var sinV = Math.sin(v);
                for (var i = 0; i <= circleSegments; i++) {
                    // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
                    var u = computeAngle(circleSegments, i);
                    var cosU = Math.cos(u);
                    var sinU = Math.sin(u);
                    center.x = R * cosU;
                    center.y = R * sinU;
                    var vertex = new Vector3();
                    var r = computeRadius(i);
                    vertex.x = (R + r * cosV) * cosU;
                    vertex.y = (R + r * cosV) * sinU;
                    vertex.z = r * sinV;
                    this['vertices'].push(vertex);
                    uvs.push(new Vector2(i / circleSegments, j / radialSegments));
                    normals.push(vertex.clone().sub(center).normalize());
                }
            }
            for (var j = 1; j <= radialSegments; j++) {
                for (var i = 1; i <= circleSegments; i++) {
                    var a = (circleSegments + 1) * j + i - 1;
                    var b = (circleSegments + 1) * (j - 1) + i - 1;
                    var c = (circleSegments + 1) * (j - 1) + i;
                    var d = (circleSegments + 1) * j + i;
                    var face = new Face3(a, b, d, [normals[a], normals[b], normals[d]]);
                    face.normal.add(normals[a]);
                    face.normal.add(normals[b]);
                    face.normal.add(normals[d]);
                    face.normal.normalize();
                    this.faces.push(face);
                    this.faceVertexUvs[0].push([uvs[a].clone(), uvs[b].clone(), uvs[d].clone()]);
                    face = new Face3(b, c, d, [normals[b], normals[c], normals[d]]);
                    face.normal.add(normals[b]);
                    face.normal.add(normals[c]);
                    face.normal.add(normals[d]);
                    face.normal.normalize();
                    this.faces.push(face);
                    this.faceVertexUvs[0].push([uvs[b].clone(), uvs[c].clone(), uvs[d].clone()]);
                }
            }
        }
        return VortexGeometry;
    })(Geometry);
    return VortexGeometry;
});

define('davinci-eight/glsl/literals',["require", "exports"], function (require, exports) {
    var literals = [
        // current
        'precision',
        'highp',
        'mediump',
        'lowp',
        'attribute',
        'const',
        'uniform',
        'varying',
        'break',
        'continue',
        'do',
        'for',
        'while',
        'if',
        'else',
        'in',
        'out',
        'inout',
        'float',
        'int',
        'void',
        'bool',
        'true',
        'false',
        'discard',
        'return',
        'mat2',
        'mat3',
        'mat4',
        'vec2',
        'vec3',
        'vec4',
        'ivec2',
        'ivec3',
        'ivec4',
        'bvec2',
        'bvec3',
        'bvec4',
        'sampler1D',
        'sampler2D',
        'sampler3D',
        'samplerCube',
        'sampler1DShadow',
        'sampler2DShadow',
        'struct',
        'asm',
        'class',
        'union',
        'enum',
        'typedef',
        'template',
        'this',
        'packed',
        'goto',
        'switch',
        'default',
        'inline',
        'noinline',
        'volatile',
        'public',
        'static',
        'extern',
        'external',
        'interface',
        'long',
        'short',
        'double',
        'half',
        'fixed',
        'unsigned',
        'input',
        'output',
        'hvec2',
        'hvec3',
        'hvec4',
        'dvec2',
        'dvec3',
        'dvec4',
        'fvec2',
        'fvec3',
        'fvec4',
        'sampler2DRect',
        'sampler3DRect',
        'sampler2DRectShadow',
        'sizeof',
        'cast',
        'namespace',
        'using'
    ];
    return literals;
});

define('davinci-eight/glsl/operators',["require", "exports"], function (require, exports) {
    var operators = [
        '<<=',
        '>>=',
        '++',
        '--',
        '<<',
        '>>',
        '<=',
        '>=',
        '==',
        '!=',
        '&&',
        '||',
        '+=',
        '-=',
        '*=',
        '/=',
        '%=',
        '&=',
        '^^',
        '^=',
        '|=',
        '(',
        ')',
        '[',
        ']',
        '.',
        '!',
        '~',
        '*',
        '/',
        '%',
        '+',
        '-',
        '<',
        '>',
        '&',
        '^',
        '|',
        '?',
        ':',
        '=',
        ',',
        ';',
        '{',
        '}'
    ];
    return operators;
});

define('davinci-eight/glsl/builtins',["require", "exports"], function (require, exports) {
    var builtins = [
        'gl_Position',
        'gl_PointSize',
        'gl_ClipVertex',
        'gl_FragCoord',
        'gl_FrontFacing',
        'gl_FragColor',
        'gl_FragData',
        'gl_FragDepth',
        'gl_Color',
        'gl_SecondaryColor',
        'gl_Normal',
        'gl_Vertex',
        'gl_MultiTexCoord0',
        'gl_MultiTexCoord1',
        'gl_MultiTexCoord2',
        'gl_MultiTexCoord3',
        'gl_MultiTexCoord4',
        'gl_MultiTexCoord5',
        'gl_MultiTexCoord6',
        'gl_MultiTexCoord7',
        'gl_FogCoord',
        'gl_MaxLights',
        'gl_MaxClipPlanes',
        'gl_MaxTextureUnits',
        'gl_MaxTextureCoords',
        'gl_MaxVertexAttribs',
        'gl_MaxVertexUniformComponents',
        'gl_MaxVaryingFloats',
        'gl_MaxVertexTextureImageUnits',
        'gl_MaxCombinedTextureImageUnits',
        'gl_MaxTextureImageUnits',
        'gl_MaxFragmentUniformComponents',
        'gl_MaxDrawBuffers',
        'gl_ModelViewMatrix',
        'gl_CameraMatrix',
        'gl_ModelViewCameraMatrix',
        'gl_TextureMatrix',
        'gl_NormalMatrix',
        'gl_ModelViewMatrixInverse',
        'gl_CameraMatrixInverse',
        'gl_ModelViewCameraMatrixInverse',
        'gl_TextureMatrixInverse',
        'gl_ModelViewMatrixTranspose',
        'gl_CameraMatrixTranspose',
        'gl_ModelViewCameraMatrixTranspose',
        'gl_TextureMatrixTranspose',
        'gl_ModelViewMatrixInverseTranspose',
        'gl_CameraMatrixInverseTranspose',
        'gl_ModelViewCameraMatrixInverseTranspose',
        'gl_TextureMatrixInverseTranspose',
        'gl_NormalScale',
        'gl_DepthRangeParameters',
        'gl_DepthRange',
        'gl_ClipPlane',
        'gl_PointParameters',
        'gl_Point',
        'gl_MaterialParameters',
        'gl_FrontMaterial',
        'gl_BackMaterial',
        'gl_LightSourceParameters',
        'gl_LightSource',
        'gl_LightModelParameters',
        'gl_LightModel',
        'gl_LightModelProducts',
        'gl_FrontLightModelProduct',
        'gl_BackLightModelProduct',
        'gl_LightProducts',
        'gl_FrontLightProduct',
        'gl_BackLightProduct',
        'gl_FogParameters',
        'gl_Fog',
        'gl_TextureEnvColor',
        'gl_EyePlaneS',
        'gl_EyePlaneT',
        'gl_EyePlaneR',
        'gl_EyePlaneQ',
        'gl_ObjectPlaneS',
        'gl_ObjectPlaneT',
        'gl_ObjectPlaneR',
        'gl_ObjectPlaneQ',
        'gl_FrontColor',
        'gl_BackColor',
        'gl_FrontSecondaryColor',
        'gl_BackSecondaryColor',
        'gl_TexCoord',
        'gl_FogFragCoord',
        'gl_Color',
        'gl_SecondaryColor',
        'gl_TexCoord',
        'gl_FogFragCoord',
        'gl_PointCoord',
        'radians',
        'degrees',
        'sin',
        'cos',
        'tan',
        'asin',
        'acos',
        'atan',
        'pow',
        'exp',
        'log',
        'exp2',
        'log2',
        'sqrt',
        'inversesqrt',
        'abs',
        'sign',
        'floor',
        'ceil',
        'fract',
        'mod',
        'min',
        'max',
        'clamp',
        'mix',
        'step',
        'smoothstep',
        'length',
        'distance',
        'dot',
        'cross',
        'normalize',
        'faceforward',
        'reflect',
        'refract',
        'matrixCompMult',
        'lessThan',
        'lessThanEqual',
        'greaterThan',
        'greaterThanEqual',
        'equal',
        'notEqual',
        'any',
        'all',
        'not',
        'texture2D',
        'texture2DProj',
        'texture2DLod',
        'texture2DProjLod',
        'textureCube',
        'textureCubeLod',
        'dFdx',
        'dFdy'
    ];
    return builtins;
});

define('davinci-eight/glsl/tokenize',["require", "exports", './literals', './operators', './builtins'], function (require, exports, literals, operators, builtins) {
    var NORMAL = 999; // <-- never emitted
    var TOKEN = 9999; // <-- never emitted
    // These things are called mode(s) and correspond to the following map.
    var BLOCK_COMMENT = 0;
    var LINE_COMMENT = 1;
    var PREPROCESSOR = 2;
    var OPERATOR = 3;
    var INTEGER = 4;
    var FLOAT = 5;
    var IDENT = 6;
    var BUILTIN = 7;
    var KEYWORD = 8;
    var WHITESPACE = 9;
    var EOF = 10;
    var HEX = 11;
    var map = [
        'block-comment',
        'line-comment',
        'preprocessor',
        'operator',
        'integer',
        'float',
        'ident',
        'builtin',
        'keyword',
        'whitespace',
        'eof',
        'integer'
    ];
    function tokenize() {
        function token(data) {
            if (data.length) {
                tokens.push({
                    type: map[mode],
                    data: data,
                    position: start,
                    line: line,
                    column: col
                });
            }
        }
        function write(chunk) {
            i = 0;
            input += chunk;
            len = input.length;
            var last;
            while (c = input[i], i < len) {
                last = i;
                switch (mode) {
                    case BLOCK_COMMENT:
                        i = block_comment();
                        break;
                    case LINE_COMMENT:
                        i = line_comment();
                        break;
                    case PREPROCESSOR:
                        i = preprocessor();
                        break;
                    case OPERATOR:
                        i = operator();
                        break;
                    case INTEGER:
                        i = integer();
                        break;
                    case HEX:
                        i = hex();
                        break;
                    case FLOAT:
                        i = decimal();
                        break;
                    case TOKEN:
                        i = readtoken();
                        break;
                    case WHITESPACE:
                        i = whitespace();
                        break;
                    case NORMAL:
                        i = normal();
                        break;
                }
                if (last !== i) {
                    switch (input[last]) {
                        case '\n':
                            col = 0;
                            ++line;
                            break;
                        default:
                            ++col;
                            break;
                    }
                }
            }
            total += i;
            input = input.slice(i);
            return tokens;
        }
        function end(chunk) {
            if (content.length) {
                token(content.join(''));
            }
            mode = EOF;
            token('(eof)');
            return tokens;
        }
        function normal() {
            content = content.length ? [] : content;
            if (last === '/' && c === '*') {
                start = total + i - 1;
                mode = BLOCK_COMMENT;
                last = c;
                return i + 1;
            }
            if (last === '/' && c === '/') {
                start = total + i - 1;
                mode = LINE_COMMENT;
                last = c;
                return i + 1;
            }
            if (c === '#') {
                mode = PREPROCESSOR;
                start = total + i;
                return i;
            }
            if (/\s/.test(c)) {
                mode = WHITESPACE;
                start = total + i;
                return i;
            }
            isnum = /\d/.test(c);
            isoperator = /[^\w_]/.test(c);
            start = total + i;
            mode = isnum ? INTEGER : isoperator ? OPERATOR : TOKEN;
            return i;
        }
        function whitespace() {
            if (/[^\s]/g.test(c)) {
                token(content.join(''));
                mode = NORMAL;
                return i;
            }
            content.push(c);
            last = c;
            return i + 1;
        }
        function preprocessor() {
            if (c === '\n' && last !== '\\') {
                token(content.join(''));
                mode = NORMAL;
                return i;
            }
            content.push(c);
            last = c;
            return i + 1;
        }
        function line_comment() {
            return preprocessor();
        }
        function block_comment() {
            if (c === '/' && last === '*') {
                content.push(c);
                token(content.join(''));
                mode = NORMAL;
                return i + 1;
            }
            content.push(c);
            last = c;
            return i + 1;
        }
        function operator() {
            if (last === '.' && /\d/.test(c)) {
                mode = FLOAT;
                return i;
            }
            if (last === '/' && c === '*') {
                mode = BLOCK_COMMENT;
                return i;
            }
            if (last === '/' && c === '/') {
                mode = LINE_COMMENT;
                return i;
            }
            if (c === '.' && content.length) {
                while (determine_operator(content)) {
                }
                mode = FLOAT;
                return i;
            }
            if (c === ';' || c === ')' || c === '(') {
                if (content.length) {
                    while (determine_operator(content)) {
                    }
                }
                token(c);
                mode = NORMAL;
                return i + 1;
            }
            var is_composite_operator = content.length === 2 && c !== '=';
            if (/[\w_\d\s]/.test(c) || is_composite_operator) {
                while (determine_operator(content)) {
                }
                mode = NORMAL;
                return i;
            }
            content.push(c);
            last = c;
            return i + 1;
        }
        function determine_operator(buf) {
            var j = 0, idx, res;
            do {
                idx = operators.indexOf(buf.slice(0, buf.length + j).join(''));
                res = operators[idx];
                if (idx === -1) {
                    if (j-- + buf.length > 0) {
                        continue;
                    }
                    res = buf.slice(0, 1).join('');
                }
                token(res);
                start += res.length;
                content = content.slice(res.length);
                return content.length;
            } while (1);
        }
        function hex() {
            if (/[^a-fA-F0-9]/.test(c)) {
                token(content.join(''));
                mode = NORMAL;
                return i;
            }
            content.push(c);
            last = c;
            return i + 1;
        }
        function integer() {
            if (c === '.') {
                content.push(c);
                mode = FLOAT;
                last = c;
                return i + 1;
            }
            if (/[eE]/.test(c)) {
                content.push(c);
                mode = FLOAT;
                last = c;
                return i + 1;
            }
            if (c === 'x' && content.length === 1 && content[0] === '0') {
                mode = HEX;
                content.push(c);
                last = c;
                return i + 1;
            }
            if (/[^\d]/.test(c)) {
                token(content.join(''));
                mode = NORMAL;
                return i;
            }
            content.push(c);
            last = c;
            return i + 1;
        }
        function decimal() {
            if (c === 'f') {
                content.push(c);
                last = c;
                i += 1;
            }
            if (/[eE]/.test(c)) {
                content.push(c);
                last = c;
                return i + 1;
            }
            if (/[^\d]/.test(c)) {
                token(content.join(''));
                mode = NORMAL;
                return i;
            }
            content.push(c);
            last = c;
            return i + 1;
        }
        function readtoken() {
            if (/[^\d\w_]/.test(c)) {
                var contentstr = content.join('');
                if (literals.indexOf(contentstr) > -1) {
                    mode = KEYWORD;
                }
                else if (builtins.indexOf(contentstr) > -1) {
                    mode = BUILTIN;
                }
                else {
                    mode = IDENT;
                }
                token(content.join(''));
                mode = NORMAL;
                return i;
            }
            content.push(c);
            last = c;
            return i + 1;
        }
        var i = 0;
        var total = 0;
        var mode = NORMAL;
        var c;
        var last;
        var content = [];
        var tokens = [];
        var token_idx = 0;
        var token_offs = 0;
        var line = 1;
        var col = 0;
        var start = 0;
        var isnum = false;
        var isoperator = false;
        var input = '';
        var len;
        return function (data) {
            tokens = [];
            if (data !== null) {
                return write(data);
            }
            return end();
        };
    }
    return tokenize;
});

define('davinci-eight/glsl/tokenizeString',["require", "exports", './tokenize'], function (require, exports, tokenize) {
    function tokenizeString(str) {
        var generator = tokenize();
        var tokens = [];
        tokens = tokens.concat(generator(str));
        tokens = tokens.concat(generator(null));
        return tokens;
    }
    return tokenizeString;
});

//
// See javascript.crockford.com/tdop/tdop.html
//
// We assume that the source text has been transformed into an array of tokens.
//
/// <reference path='./Symbol.d.ts'/>
/// <reference path='./Token.d.ts'/>
define('davinci-eight/glsl/expr',["require", "exports"], function (require, exports) {
    var state;
    /**
     * The current token.
     */
    var token;
    var tokens;
    var idx;
    function fail(message) {
        return function () { return state.unexpected(message); };
    }
    /**
     * The prototype for all other symbols. Its method will usually be overridden.
     */
    var original_symbol = {
        nud: function () {
            return this.children && this.children.length ? this : fail('unexpected')();
        },
        led: fail('missing operator')
    };
    var symbol_table = {};
    var itself = function () {
        return this;
    };
    /**
     * A function that makes symbols and looks them up in a cache.
     * @param id Identifier
     * @param bp Binding Power. Optional. Defaults to zero.
     */
    function symbol(id, bp) {
        var sym = symbol_table[id];
        bp = bp || 0;
        if (sym) {
            if (bp > sym.lbp) {
                sym.lbp = bp;
            }
        }
        else {
            sym = Object.create(original_symbol);
            sym.id = id;
            sym.lbp = bp;
            symbol_table[id] = sym;
        }
        return sym;
    }
    function infix(id, bp, led) {
        var sym = symbol(id, bp);
        sym.led = led || function (left) {
            this.children = [left, expression(bp)];
            this.type = 'binary';
            return this;
        };
    }
    function infixr(id, bp, led) {
        var sym = symbol(id, bp);
        sym.led = led || function (left) {
            this.children = [left, expression(bp - 1)];
            this.type = 'binary';
            return this;
        };
        return sym;
    }
    function prefix(id, nud) {
        var sym = symbol(id);
        sym.nud = nud || function () {
            this.children = [expression(70)];
            this.type = 'unary';
            return this;
        };
        return sym;
    }
    function suffix(id) {
        var sym = symbol(id, 150);
        sym.led = function (left) {
            this.children = [left];
            this.type = 'suffix';
            return this;
        };
    }
    function assignment(id) {
        return infixr(id, 10, function (left) {
            this.children = [left, expression(9)];
            this.assignment = true;
            this.type = 'assign';
            return this;
        });
    }
    // parentheses included to avoid collisions with user-defined tokens.
    symbol('(ident)').nud = itself;
    symbol('(keyword)').nud = itself;
    symbol('(builtin)').nud = itself;
    symbol('(literal)').nud = itself;
    symbol('(end)'); // Indicates the end of the token stream.
    symbol(':');
    symbol(';');
    symbol(',');
    symbol(')');
    symbol(']');
    symbol('}');
    infixr('&&', 30);
    infixr('||', 30);
    infix('|', 43);
    infix('^', 44);
    infix('&', 45);
    infix('==', 46);
    infix('!=', 46);
    infix('<', 47);
    infix('<=', 47);
    infix('>', 47);
    infix('>=', 47);
    infix('>>', 48);
    infix('<<', 48);
    infix('+', 50);
    infix('-', 50);
    infix('*', 60);
    infix('/', 60);
    infix('%', 60);
    infix('?', 20, function (left) {
        this.children = [left, expression(0), (advance(':'), expression(0))]; // original.
        //this.children = [];
        //this.children.push(left);
        //this.children.push(expression(0));
        //advance(':');
        //this.children.push(expression(0));
        this.type = 'ternary';
        return this;
    });
    infix('.', 80, function (left) {
        token.type = 'literal';
        state.fake(token);
        this.children = [left, token];
        advance();
        return this;
    });
    infix('[', 80, function (left) {
        this.children = [left, expression(0)];
        this.type = 'binary';
        advance(']');
        return this;
    });
    infix('(', 80, function (left) {
        this.children = [left];
        this.type = 'call';
        if (token.data !== ')') {
            while (1) {
                this.children.push(expression(0));
                if (token.data !== ',') {
                    break;
                }
                advance(',');
            }
        }
        advance(')');
        return this;
    });
    prefix('-');
    prefix('+');
    prefix('!');
    prefix('~');
    prefix('defined');
    prefix('(', function () {
        this.type = 'group';
        this.children = [expression(0)];
        advance(')');
        return this;
    });
    prefix('++');
    prefix('--');
    suffix('++');
    suffix('--');
    assignment('=');
    assignment('+=');
    assignment('-=');
    assignment('*=');
    assignment('/=');
    assignment('%=');
    assignment('&=');
    assignment('|=');
    assignment('^=');
    assignment('>>=');
    assignment('<<=');
    function expr(incoming_state, incoming_tokens) {
        function emit(node) {
            state.unshift(node, false);
            for (var i = 0, len = node.children.length; i < len; ++i) {
                emit(node.children[i]);
            }
            state.shift();
        }
        state = incoming_state;
        tokens = incoming_tokens;
        idx = 0;
        var result;
        if (!tokens.length) {
            return;
        }
        advance();
        result = expression(0);
        result.parent = state[0];
        emit(result);
        if (idx < tokens.length) {
            throw new Error('did not use all tokens');
        }
        result.parent.children = [result];
    }
    /**
     * The heart of top-down precedence parsing (Pratt).
     * @param rbp Right Binding Power.
     */
    function expression(rbp) {
        var left;
        var t = token;
        advance();
        left = t.nud();
        while (rbp < token.lbp) {
            t = token;
            advance();
            left = t.led(left);
        }
        return left;
    }
    /**
     * Make a new token from the next simple object in the array and assign to the token variable
     */
    function advance(id) {
        var next;
        var value;
        var type;
        /**
         * Symbol obtained from the symbol lookup table.
         */
        var output;
        if (id && token.data !== id) {
            return state.unexpected('expected `' + id + '`, got `' + token.data + '`');
        }
        if (idx >= tokens.length) {
            token = symbol_table['(end)'];
            return;
        }
        next = tokens[idx++];
        value = next.data;
        type = next.type;
        if (type === 'ident') {
            output = state.scope.find(value) || state.create_node();
            type = output.type;
        }
        else if (type === 'builtin') {
            output = symbol_table['(builtin)'];
        }
        else if (type === 'keyword') {
            output = symbol_table['(keyword)'];
        }
        else if (type === 'operator') {
            output = symbol_table[value];
            if (!output) {
                return state.unexpected('unknown operator `' + value + '`');
            }
        }
        else if (type === 'float' || type === 'integer') {
            type = 'literal';
            output = symbol_table['(literal)'];
        }
        else {
            return state.unexpected('unexpected token.');
        }
        if (output) {
            if (!output.nud) {
                output.nud = itself;
            }
            if (!output.children) {
                output.children = [];
            }
        }
        // FIXME: This should be assigning to token?
        output = Object.create(output);
        output.token = next;
        output.type = type;
        if (!output.data) {
            output.data = value;
        }
        // I don't think the assignment is required.
        // It also may be effing up the type safety.
        return token = output;
    }
    return expr;
});

define('davinci-eight/glsl/Scope',["require", "exports"], function (require, exports) {
    var Scope = (function () {
        function Scope(state) {
            this.state = state;
            this.scopes = [];
            this.current = null;
        }
        Scope.prototype.enter = function (s) {
            this.scopes.push(this.current = this.state[0].scope = s || {});
        };
        Scope.prototype.exit = function () {
            this.scopes.pop();
            this.current = this.scopes[this.scopes.length - 1];
        };
        Scope.prototype.define = function (str) {
            this.current[str] = this.state[0];
        };
        Scope.prototype.find = function (name, fail) {
            for (var i = this.scopes.length - 1; i > -1; --i) {
                if (this.scopes[i].hasOwnProperty(name)) {
                    return this.scopes[i][name];
                }
            }
            return null;
        };
        return Scope;
    })();
    return Scope;
});

define('davinci-eight/glsl/parser',["require", "exports", './expr', './Scope'], function (require, exports, full_parse_expr, Scope) {
    // singleton!
    var Advance = {};
    var DEBUG = false;
    var IDENT = 0;
    var STMT = 1;
    var STMTLIST = 2;
    var STRUCT = 3;
    var FUNCTION = 4;
    var FUNCTIONARGS = 5;
    var DECL = 6;
    var DECLLIST = 7;
    var FORLOOP = 8;
    var WHILELOOP = 9;
    var IF = 10;
    var EXPR = 11;
    var PRECISION = 12;
    var COMMENT = 13;
    var PREPROCESSOR = 14;
    var KEYWORD = 15;
    var KEYWORD_OR_IDENT = 16;
    var RETURN = 17;
    var BREAK = 18;
    var CONTINUE = 19;
    var DISCARD = 20;
    var DOWHILELOOP = 21;
    var PLACEHOLDER = 22;
    var QUANTIFIER = 23;
    var DECL_ALLOW_ASSIGN = 0x1;
    var DECL_ALLOW_COMMA = 0x2;
    var DECL_REQUIRE_NAME = 0x4;
    var DECL_ALLOW_INVARIANT = 0x8;
    var DECL_ALLOW_STORAGE = 0x10;
    var DECL_NO_INOUT = 0x20;
    var DECL_ALLOW_STRUCT = 0x40;
    var DECL_STATEMENT = 0xFF;
    var DECL_FUNCTION = DECL_STATEMENT & ~(DECL_ALLOW_ASSIGN | DECL_ALLOW_COMMA | DECL_NO_INOUT | DECL_ALLOW_INVARIANT | DECL_REQUIRE_NAME);
    var DECL_STRUCT = DECL_STATEMENT & ~(DECL_ALLOW_ASSIGN | DECL_ALLOW_INVARIANT | DECL_ALLOW_STORAGE | DECL_ALLOW_STRUCT);
    var QUALIFIERS = ['const', 'attribute', 'uniform', 'varying'];
    var NO_ASSIGN_ALLOWED = false;
    var NO_COMMA_ALLOWED = false;
    // map of tokens to stmt types
    var token_map = {
        'block-comment': COMMENT,
        'line-comment': COMMENT,
        'preprocessor': PREPROCESSOR
    };
    // map of stmt types to human
    var stmt_type = [
        'ident',
        'stmt',
        'stmtlist',
        'struct',
        'function',
        'functionargs',
        'decl',
        'decllist',
        'forloop',
        'whileloop',
        'if',
        'expr',
        'precision',
        'comment',
        'preprocessor',
        'keyword',
        'keyword_or_ident',
        'return',
        'break',
        'continue',
        'discard',
        'do-while',
        'placeholder',
        'quantifier'
    ];
    function parser() {
        function reader(data) {
            if (data === null) {
                return end(), program;
            }
            nodes = [];
            write(data);
            return nodes;
        }
        function write(input) {
            if (input.type === 'whitespace' || input.type === 'line-comment' || input.type === 'block-comment') {
                whitespace.push(input);
                return;
            }
            tokens.push(input);
            token = token || tokens[0];
            if (token && whitespace.length) {
                token.preceding = token.preceding || [];
                token.preceding = token.preceding.concat(whitespace);
                whitespace = [];
            }
            while (take()) {
                switch (state[0].mode) {
                    case STMT:
                        parse_stmt();
                        break;
                    case STMTLIST:
                        parse_stmtlist();
                        break;
                    case DECL:
                        parse_decl();
                        break;
                    case DECLLIST:
                        parse_decllist();
                        break;
                    case EXPR:
                        parse_expr();
                        break;
                    case STRUCT:
                        parse_struct(true, true);
                        break;
                    case PRECISION:
                        parse_precision();
                        break;
                    case IDENT:
                        parse_ident();
                        break;
                    case KEYWORD:
                        parse_keyword();
                        break;
                    case KEYWORD_OR_IDENT:
                        parse_keyword_or_ident();
                        break;
                    case FUNCTION:
                        parse_function();
                        break;
                    case FUNCTIONARGS:
                        parse_function_args();
                        break;
                    case FORLOOP:
                        parse_forloop();
                        break;
                    case WHILELOOP:
                        parse_whileloop();
                        break;
                    case DOWHILELOOP:
                        parse_dowhileloop();
                        break;
                    case RETURN:
                        parse_return();
                        break;
                    case IF:
                        parse_if();
                        break;
                    case QUANTIFIER:
                        parse_quantifier();
                        break;
                }
            }
        }
        // stream functions ---------------------------------------------
        function end(tokens) {
            if (arguments.length) {
                write(tokens);
            }
            if (state.length > 1) {
                unexpected('unexpected EOF');
                return;
            }
            complete = true;
        }
        function take() {
            if (errored || !state.length) {
                return false;
            }
            return (token = tokens[0]);
        }
        // ----- state manipulation --------
        function special_fake(x) {
            state.unshift(x);
            state.shift();
        }
        function special_unshift(_node, add_child) {
            _node.parent = state[0];
            var ret = [].unshift.call(this, _node);
            add_child = add_child === undefined ? true : add_child;
            if (DEBUG) {
                var pad = '';
                for (var i = 0, len = this.length - 1; i < len; ++i) {
                    pad += ' |';
                }
            }
            if (add_child && node !== _node) {
                node.children.push(_node);
            }
            node = _node;
            return ret;
        }
        function special_shift() {
            var _node = [].shift.call(this), okay = check[this.length], emit = false;
            if (DEBUG) {
                var pad = '';
                for (var i = 0, len = this.length; i < len; ++i) {
                    pad += ' |';
                }
            }
            if (check.length) {
                if (typeof check[0] === 'function') {
                    emit = check[0](_node);
                }
                else if (okay !== undefined) {
                    emit = okay.test ? okay.test(_node.type) : okay === _node.type;
                }
            }
            else {
                emit = true;
            }
            if (emit && !errored) {
                nodes.push(_node);
            }
            node = _node.parent;
            return _node;
        }
        // parse states ---------------
        function parse_stmtlist() {
            function normal_mode() {
                if (token.data === state[0].expecting) {
                    return state.scope.exit(), state.shift();
                }
                switch (token.type) {
                    case 'preprocessor':
                        state.fake(adhoc());
                        tokens.shift();
                        return;
                    default:
                        state.unshift(stmt());
                        return;
                }
            }
            // determine the type of the statement
            // and then start parsing
            return stative(function () { state.scope.enter(); return Advance; }, normal_mode)();
        }
        function parse_stmt() {
            if (state[0].brace) {
                if (token.data !== '}') {
                    return unexpected('expected `}`, got ' + token.data);
                }
                state[0].brace = false;
                return tokens.shift(), state.shift();
            }
            switch (token.type) {
                case 'eof': return got_eof();
                case 'keyword':
                    switch (token.data) {
                        case 'for': return state.unshift(forstmt());
                        case 'if': return state.unshift(ifstmt());
                        case 'while': return state.unshift(whilestmt());
                        case 'do': return state.unshift(dowhilestmt());
                        case 'break': return state.fake(mknode(BREAK, token)), tokens.shift();
                        case 'continue': return state.fake(mknode(CONTINUE, token)), tokens.shift();
                        case 'discard': return state.fake(mknode(DISCARD, token)), tokens.shift();
                        case 'return': return state.unshift(returnstmt());
                        case 'precision': return state.unshift(precision());
                    }
                    return state.unshift(decl(DECL_STATEMENT));
                case 'ident':
                    var lookup;
                    if (lookup = state.scope.find(token.data)) {
                        if (lookup.parent.type === 'struct') {
                            // this is strictly untrue, you could have an
                            // expr that starts with a struct constructor.
                            //      ... sigh
                            return state.unshift(decl(DECL_STATEMENT));
                        }
                        return state.unshift(expr(';'));
                    }
                case 'operator':
                    if (token.data === '{') {
                        state[0].brace = true;
                        var n = stmtlist(); // FIXME
                        n.expecting = '}';
                        return tokens.shift(), state.unshift(n);
                    }
                    if (token.data === ';') {
                        return tokens.shift(), state.shift();
                    }
                default: return state.unshift(expr(';'));
            }
        }
        function got_eof() {
            if (ended) {
                errored = true;
            }
            ended = true;
            return state.shift();
        }
        function parse_decl() {
            function invariant_or_not() {
                if (token.data === 'invariant') {
                    if (stmt.flags & DECL_ALLOW_INVARIANT) {
                        state.unshift(keyword());
                        return Advance;
                    }
                    else {
                        return unexpected('`invariant` is not allowed here');
                    }
                }
                else {
                    state.fake(mknode(PLACEHOLDER, { data: '', position: token.position }));
                    return Advance;
                }
            }
            function storage_or_not() {
                if (is_storage(token)) {
                    if (stmt.flags & DECL_ALLOW_STORAGE) {
                        state.unshift(keyword());
                        return Advance;
                    }
                    else {
                        return unexpected('storage is not allowed here');
                    }
                }
                else {
                    state.fake(mknode(PLACEHOLDER, { data: '', position: token.position }));
                    return Advance;
                }
            }
            function parameter_or_not() {
                if (is_parameter(token)) {
                    if (!(stmt.flags & DECL_NO_INOUT)) {
                        state.unshift(keyword());
                        return Advance;
                    }
                    else {
                        return unexpected('parameter is not allowed here');
                    }
                }
                else {
                    state.fake(mknode(PLACEHOLDER, { data: '', position: token.position }));
                    return Advance;
                }
            }
            function precision_or_not() {
                if (is_precision(token)) {
                    state.unshift(keyword());
                    return Advance;
                }
                else {
                    state.fake(mknode(PLACEHOLDER, { data: '', position: token.position }));
                    return Advance;
                }
            }
            function struct_or_type() {
                if (token.data === 'struct') {
                    if (!(stmt.flags & DECL_ALLOW_STRUCT)) {
                        return unexpected('cannot nest structs');
                    }
                    state.unshift(struct());
                    return Advance;
                }
                if (token.type === 'keyword') {
                    state.unshift(keyword());
                    return Advance;
                }
                var lookup = state.scope.find(token.data);
                if (lookup) {
                    state.fake(Object.create(lookup));
                    tokens.shift();
                    return Advance;
                }
                return unexpected('expected user defined type, struct or keyword, got ' + token.data);
            }
            function maybe_name() {
                if (token.data === ',' && !(stmt.flags & DECL_ALLOW_COMMA)) {
                    return state.shift();
                }
                if (token.data === '[') {
                    // oh lord.
                    state.unshift(quantifier());
                    return;
                }
                if (token.data === ')') {
                    return state.shift();
                }
                if (token.data === ';') {
                    return stmt.stage + 3;
                }
                if (token.type !== 'ident' && token.type !== 'builtin') {
                    return unexpected('expected identifier, got ' + token.data);
                }
                stmt.collected_name = tokens.shift();
                return Advance;
            }
            function maybe_lparen() {
                if (token.data === '(') {
                    tokens.unshift(stmt.collected_name);
                    delete stmt.collected_name;
                    state.unshift(fn());
                    return stmt.stage + 2;
                }
                return Advance;
            }
            function is_decllist() {
                tokens.unshift(stmt.collected_name);
                delete stmt.collected_name;
                state.unshift(decllist());
                return Advance;
            }
            function done() {
                return state.shift();
            }
            var stmt = state[0];
            return stative(invariant_or_not, storage_or_not, parameter_or_not, precision_or_not, struct_or_type, maybe_name, maybe_lparen, is_decllist, done)();
        }
        function parse_decllist() {
            // grab ident
            if (token.type === 'ident') {
                var name = token.data;
                state.unshift(ident());
                state.scope.define(name);
                return;
            }
            if (token.type === 'operator') {
                if (token.data === ',') {
                    // multi-decl!
                    if (!(state[1].flags & DECL_ALLOW_COMMA)) {
                        return state.shift();
                    }
                    return tokens.shift();
                }
                else if (token.data === '=') {
                    if (!(state[1].flags & DECL_ALLOW_ASSIGN)) {
                        return unexpected('`=` is not allowed here.');
                    }
                    tokens.shift();
                    state.unshift(expr(',', ';'));
                    return;
                }
                else if (token.data === '[') {
                    state.unshift(quantifier());
                    return;
                }
            }
            return state.shift();
        }
        function parse_keyword_or_ident() {
            if (token.type === 'keyword') {
                state[0].type = 'keyword';
                state[0].mode = KEYWORD;
                return;
            }
            if (token.type === 'ident') {
                state[0].type = 'ident';
                state[0].mode = IDENT;
                return;
            }
            return unexpected('expected keyword or user-defined name, got ' + token.data);
        }
        function parse_keyword() {
            if (token.type !== 'keyword') {
                return unexpected('expected keyword, got ' + token.data);
            }
            return state.shift(), tokens.shift();
        }
        function parse_ident() {
            if (token.type !== 'ident') {
                return unexpected('expected user-defined name, got ' + token.data);
            }
            state[0].data = token.data;
            return state.shift(), tokens.shift();
        }
        function parse_expr() {
            function parseexpr(tokens) {
                try {
                    full_parse_expr(state, tokens);
                }
                catch (err) {
                    errored = true;
                    throw err;
                }
                return state.shift();
            }
            var expecting = state[0].expecting;
            state[0].tokens = state[0].tokens || [];
            if (state[0].parenlevel === undefined) {
                state[0].parenlevel = 0;
                state[0].bracelevel = 0;
            }
            if (state[0].parenlevel < 1 && expecting.indexOf(token.data) > -1) {
                return parseexpr(state[0].tokens);
            }
            if (token.data === '(') {
                ++state[0].parenlevel;
            }
            else if (token.data === ')') {
                --state[0].parenlevel;
            }
            switch (token.data) {
                case '{':
                    ++state[0].bracelevel;
                    break;
                case '}':
                    --state[0].bracelevel;
                    break;
                case '(':
                    ++state[0].parenlevel;
                    break;
                case ')':
                    --state[0].parenlevel;
                    break;
            }
            if (state[0].parenlevel < 0) {
                return unexpected('unexpected `)`');
            }
            if (state[0].bracelevel < 0) {
                return unexpected('unexpected `}`');
            }
            state[0].tokens.push(tokens.shift());
            return;
        }
        // node types ---------------
        function n(type) {
            // this is a function factory that suffices for most kinds of expressions and statements
            return function () {
                return mknode(type, token);
            };
        }
        function adhoc() {
            return mknode(token_map[token.type], token, node);
        }
        function decl(flags) {
            var _ = mknode(DECL, token, node); // FIXME
            _.flags = flags;
            return _;
        }
        function struct(allow_assign, allow_comma) {
            var _ = mknode(STRUCT, token, node); // FIXME
            _.allow_assign = allow_assign === undefined ? true : allow_assign;
            _.allow_comma = allow_comma === undefined ? true : allow_comma;
            return _;
        }
        function expr(arg0, arg1) {
            var n = mknode(EXPR, token, node); // FIXME
            n.expecting = [].slice.call(arguments);
            return n;
        }
        function keyword(default_value) {
            var t = token;
            if (default_value) {
                t = { 'type': '(implied)', data: '(default)', position: t.position };
            }
            return mknode(KEYWORD, t, node);
        }
        // utils ----------------------------
        // FIXME: This should return the Error and let the site throw it.
        function unexpected(str) {
            errored = true;
            throw new Error((str || 'unexpected ' + state) +
                ' at line ' + state[0].token.line);
        }
        function assert(type, data) {
            return 1,
                assert_null_string_or_array(type, token.type) &&
                    assert_null_string_or_array(data, token.data);
        }
        function assert_null_string_or_array(x, y) {
            switch (typeof x) {
                case 'string':
                    if (y !== x) {
                        unexpected('expected `' + x + '`, got ' + y + '\n' + token.data);
                    }
                    return !errored;
                case 'object':
                    if (x && x.indexOf(y) === -1) {
                        unexpected('expected one of `' + x.join('`, `') + '`, got ' + y);
                    }
                    return !errored;
            }
            return true;
        }
        // stative ----------------------------
        function stative(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, argA, argB) {
            var steps = [].slice.call(arguments), step, result;
            return function () {
                var current = state[0];
                // FIXME
                //current.stage || (current.stage = 0)
                if (!current.stage) {
                    current.stage = 0;
                }
                step = steps[current.stage];
                if (!step) {
                    return unexpected('parser in undefined state!');
                }
                result = step();
                if (result === Advance) {
                    return ++current.stage;
                }
                if (result === undefined) {
                    return;
                }
                current.stage = result;
            };
        }
        function advance(op, t) {
            t = t || 'operator';
            return function () {
                if (!assert(t, op)) {
                    return;
                }
                var last = tokens.shift(), children = state[0].children, last_node = children[children.length - 1];
                if (last_node && last_node.token && last.preceding) {
                    last_node.token.succeeding = last_node.token.succeeding || [];
                    last_node.token.succeeding = last_node.token.succeeding.concat(last.preceding);
                }
                return Advance;
            };
        }
        function advance_expr(until) {
            return function () {
                state.unshift(expr(until));
                return Advance;
            };
        }
        function advance_ident(declare) {
            return declare ? function () {
                var name = token.data;
                return assert('ident') && (state.unshift(ident()), state.scope.define(name), Advance);
            } : function () {
                if (!assert('ident')) {
                    return;
                }
                var s = Object.create(state.scope.find(token.data));
                s.token = token;
                return (tokens.shift(), Advance);
            };
        }
        function advance_stmtlist() {
            return function () {
                var n = stmtlist(); // FIXME
                n.expecting = '}';
                return state.unshift(n), Advance;
            };
        }
        function maybe_stmtlist(skip) {
            return function () {
                var current = state[0].stage;
                if (token.data !== '{') {
                    return state.unshift(stmt()), current + skip;
                }
                return tokens.shift(), Advance;
            };
        }
        function popstmt() {
            return function () { return state.shift(), state.shift(); };
        }
        function setup_stative_parsers() {
            // could also be
            // struct { } decllist
            parse_struct =
                stative(advance('struct', 'keyword'), function () {
                    if (token.data === '{') {
                        state.fake(mknode(IDENT, { data: '', position: token.position, type: 'ident' }));
                        return Advance;
                    }
                    return advance_ident(true)();
                }, function () { state.scope.enter(); return Advance; }, advance('{'), function () {
                    if (token.type === 'preprocessor') {
                        state.fake(adhoc());
                        tokens.shift();
                        return;
                    }
                    if (token.data === '}') {
                        state.scope.exit();
                        tokens.shift();
                        return state.shift();
                    }
                    if (token.data === ';') {
                        tokens.shift();
                        return;
                    }
                    state.unshift(decl(DECL_STRUCT));
                });
            parse_precision =
                stative(function () { return tokens.shift(), Advance; }, function () {
                    return assert('keyword', ['lowp', 'mediump', 'highp']) && (state.unshift(keyword()), Advance);
                }, function () { return (state.unshift(keyword()), Advance); }, function () { return state.shift(); });
            parse_quantifier =
                stative(advance('['), advance_expr(']'), advance(']'), function () { return state.shift(); });
            parse_forloop =
                stative(advance('for', 'keyword'), advance('('), function () {
                    var lookup;
                    if (token.type === 'ident') {
                        if (!(lookup = state.scope.find(token.data))) {
                            lookup = state.create_node();
                        }
                        if (lookup.parent.type === 'struct') {
                            return state.unshift(decl(DECL_STATEMENT)), Advance;
                        }
                    }
                    else if (token.type === 'builtin' || token.type === 'keyword') {
                        return state.unshift(decl(DECL_STATEMENT)), Advance;
                    }
                    return advance_expr(';')();
                }, advance(';'), advance_expr(';'), advance(';'), advance_expr(')'), advance(')'), maybe_stmtlist(3), advance_stmtlist(), advance('}'), popstmt());
            parse_if =
                stative(advance('if', 'keyword'), advance('('), advance_expr(')'), advance(')'), maybe_stmtlist(3), advance_stmtlist(), advance('}'), function () {
                    if (token.data === 'else') {
                        return tokens.shift(), state.unshift(stmt()), Advance;
                    }
                    return popstmt()();
                }, popstmt());
            parse_return =
                stative(advance('return', 'keyword'), function () {
                    if (token.data === ';') {
                        return Advance;
                    }
                    return state.unshift(expr(';')), Advance;
                }, function () { tokens.shift(), popstmt()(); });
            parse_whileloop =
                stative(advance('while', 'keyword'), advance('('), advance_expr(')'), advance(')'), maybe_stmtlist(3), advance_stmtlist(), advance('}'), popstmt());
            parse_dowhileloop =
                stative(advance('do', 'keyword'), maybe_stmtlist(3), advance_stmtlist(), advance('}'), advance('while', 'keyword'), advance('('), advance_expr(')'), advance(')'), popstmt());
            parse_function =
                stative(function () {
                    for (var i = 1, len = state.length; i < len; ++i) {
                        if (state[i].mode === FUNCTION) {
                            return unexpected('function definition is not allowed within another function');
                        }
                    }
                    return Advance;
                }, function () {
                    if (!assert('ident')) {
                        return;
                    }
                    var name = token.data;
                    var lookup = state.scope.find(name);
                    state.unshift(ident());
                    state.scope.define(name);
                    state.scope.enter(lookup ? lookup.scope : null);
                    return Advance;
                }, advance('('), function () { return state.unshift(fnargs()), Advance; }, advance(')'), function () {
                    // forward decl
                    if (token.data === ';') {
                        return state.scope.exit(), state.shift(), state.shift();
                    }
                    return Advance;
                }, advance('{'), advance_stmtlist(), advance('}'), function () { state.scope.exit(); return Advance; }, function () { return state.shift(), state.shift(), state.shift(); });
            parse_function_args =
                stative(function () {
                    if (token.data === 'void') {
                        state.fake(keyword());
                        tokens.shift();
                        return Advance;
                    }
                    if (token.data === ')') {
                        state.shift();
                        return;
                    }
                    if (token.data === 'struct') {
                        state.unshift(struct(NO_ASSIGN_ALLOWED, NO_COMMA_ALLOWED));
                        return Advance;
                    }
                    state.unshift(decl(DECL_FUNCTION));
                    return Advance;
                }, function () {
                    if (token.data === ',') {
                        tokens.shift();
                        return 0;
                    }
                    if (token.data === ')') {
                        state.shift();
                        return;
                    }
                    unexpected('expected one of `,` or `)`, got ' + token.data);
                });
        }
        /// END OF INNER FUNCTIONS
        var stmtlist = n(STMTLIST), stmt = n(STMT), decllist = n(DECLLIST), precision = n(PRECISION), ident = n(IDENT), keyword_or_ident = n(KEYWORD_OR_IDENT), fn = n(FUNCTION), fnargs = n(FUNCTIONARGS), forstmt = n(FORLOOP), ifstmt = n(IF), whilestmt = n(WHILELOOP), returnstmt = n(RETURN), dowhilestmt = n(DOWHILELOOP), quantifier = n(QUANTIFIER);
        var parse_struct, parse_precision, parse_quantifier, parse_forloop, parse_if, parse_return, parse_whileloop, parse_dowhileloop, parse_function, parse_function_args;
        var check = arguments.length ? [].slice.call(arguments) : [];
        var complete = false;
        var ended = false;
        var depth = 0;
        var state = []; // FIXME
        var nodes = [];
        var tokens = [];
        var whitespace = [];
        var errored = false;
        var program;
        var token;
        var node;
        // setup state
        state.shift = special_shift;
        state.unshift = special_unshift;
        state.fake = special_fake;
        state.unexpected = unexpected;
        state.scope = new Scope(state); // FIXME The only place where we create a Scope?
        state.create_node = function () {
            var n = mknode(IDENT, token); // FIXME
            n.parent = reader['program']; // FIXME
            return n;
        };
        setup_stative_parsers();
        // setup root node
        node = stmtlist();
        node.expecting = '(eof)';
        node.mode = STMTLIST;
        node.token = { type: '(program)', data: '(program)' };
        program = node;
        reader['program'] = program; // FIXME
        reader['scope'] = function (scope) {
            if (arguments.length === 1) {
                state.scope = scope;
            }
            return state.scope;
        };
        state.unshift(node);
        return reader;
    }
    function mknode(mode, sourcetoken, unused) {
        return {
            mode: mode,
            token: sourcetoken,
            children: [],
            type: stmt_type[mode],
            id: (Math.random() * 0xFFFFFFFF).toString(16)
        };
    }
    function is_storage(token) {
        return token.data === 'const' ||
            token.data === 'attribute' ||
            token.data === 'uniform' ||
            token.data === 'varying';
    }
    function is_parameter(token) {
        return token.data === 'in' ||
            token.data === 'inout' ||
            token.data === 'out';
    }
    function is_precision(token) {
        return token.data === 'highp' ||
            token.data === 'mediump' ||
            token.data === 'lowp';
    }
    return parser;
});

define('davinci-eight/glsl/parse',["require", "exports", '../glsl/tokenizeString', '../glsl/parser'], function (require, exports, tokenizeString, parser) {
    function parse(code) {
        var tokens = tokenizeString(code);
        var reader = parser();
        for (var i = 0; i < tokens.length; i++) {
            reader(tokens[i]);
        }
        var ast = reader(null);
        return ast;
    }
    return parse;
});

define('davinci-eight/glsl/DefaultNodeEventHandler',["require", "exports"], function (require, exports) {
    /// <reference path='NodeEventHandler.d.ts'/>
    var DefaultNodeEventHandler = (function () {
        function DefaultNodeEventHandler() {
        }
        DefaultNodeEventHandler.prototype.beginStatementList = function () {
        };
        DefaultNodeEventHandler.prototype.endStatementList = function () {
        };
        DefaultNodeEventHandler.prototype.beginStatement = function () {
        };
        DefaultNodeEventHandler.prototype.endStatement = function () {
        };
        DefaultNodeEventHandler.prototype.beginDeclaration = function () {
        };
        DefaultNodeEventHandler.prototype.endDeclaration = function () {
        };
        DefaultNodeEventHandler.prototype.declaration = function (kind, modifiers, type, names) {
        };
        DefaultNodeEventHandler.prototype.beginDeclarationList = function () {
        };
        DefaultNodeEventHandler.prototype.endDeclarationList = function () {
        };
        DefaultNodeEventHandler.prototype.beginFunction = function () {
        };
        DefaultNodeEventHandler.prototype.endFunction = function () {
        };
        DefaultNodeEventHandler.prototype.beginFunctionArgs = function () {
        };
        DefaultNodeEventHandler.prototype.endFunctionArgs = function () {
        };
        DefaultNodeEventHandler.prototype.beginExpression = function () {
        };
        DefaultNodeEventHandler.prototype.endExpression = function () {
        };
        DefaultNodeEventHandler.prototype.beginAssign = function () {
        };
        DefaultNodeEventHandler.prototype.endAssign = function () {
        };
        DefaultNodeEventHandler.prototype.identifier = function (name) {
        };
        DefaultNodeEventHandler.prototype.keyword = function (word) {
        };
        DefaultNodeEventHandler.prototype.builtin = function (name) {
        };
        return DefaultNodeEventHandler;
    })();
    return DefaultNodeEventHandler;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/glsl/NodeWalker',["require", "exports", './DefaultNodeEventHandler'], function (require, exports, DefaultNodeEventHandler) {
    var DeclarationBuilder = (function (_super) {
        __extends(DeclarationBuilder, _super);
        function DeclarationBuilder(next) {
            _super.call(this);
            this.modifiers = [];
            this.names = [];
            this.next = next;
        }
        DeclarationBuilder.prototype.beginDeclaration = function () {
            this.kind = void 0;
            this.type = void 0;
            this.modifiers = [];
            this.names = [];
        };
        DeclarationBuilder.prototype.endDeclaration = function () {
            if (this.kind) {
                this.next.declaration(this.kind, this.modifiers, this.type, this.names);
            }
            else {
            }
        };
        DeclarationBuilder.prototype.identifier = function (name) {
            this.names.push(name);
        };
        DeclarationBuilder.prototype.keyword = function (word) {
            switch (word) {
                case 'attribute':
                case 'const':
                case 'uniform':
                case 'varying':
                    {
                        this.kind = word;
                    }
                    break;
                case 'float':
                case 'int':
                case 'mat2':
                case 'mat3':
                case 'mat4':
                case 'vec2':
                case 'vec3':
                case 'vec4':
                case 'void':
                    {
                        this.type = word;
                    }
                    break;
                case 'highp':
                case 'precision':
                    {
                        this.modifiers.push(word);
                    }
                    break;
                default: {
                    throw new Error("Unexpected keyword: " + word);
                }
            }
        };
        return DeclarationBuilder;
    })(DefaultNodeEventHandler);
    var NodeWalker = (function () {
        function NodeWalker() {
        }
        NodeWalker.prototype.walk = function (node, handler) {
            var walker = this;
            switch (node.type) {
                case 'assign':
                    {
                        handler.beginAssign();
                        node.children.forEach(function (child) {
                            walker.walk(child, handler);
                        });
                        handler.endAssign();
                    }
                    break;
                case 'builtin':
                    {
                        handler.builtin(node.token.data);
                    }
                    break;
                case 'binary':
                    {
                    }
                    break;
                case 'call':
                    {
                    }
                    break;
                case 'decl':
                    {
                        var builder = new DeclarationBuilder(handler);
                        builder.beginDeclaration();
                        node.children.forEach(function (child) {
                            walker.walk(child, builder);
                        });
                        builder.endDeclaration();
                    }
                    break;
                case 'decllist':
                    {
                        handler.beginDeclarationList();
                        node.children.forEach(function (child) {
                            walker.walk(child, handler);
                        });
                        handler.endDeclarationList();
                    }
                    break;
                case 'expr':
                    {
                        handler.beginExpression();
                        node.children.forEach(function (child) {
                            walker.walk(child, handler);
                        });
                        handler.endExpression();
                    }
                    break;
                case 'forloop':
                    {
                    }
                    break;
                case 'function':
                    {
                        handler.beginFunction();
                        node.children.forEach(function (child) {
                            walker.walk(child, handler);
                        });
                        handler.endFunction();
                    }
                    break;
                case 'functionargs':
                    {
                        handler.beginFunctionArgs();
                        node.children.forEach(function (child) {
                            walker.walk(child, handler);
                        });
                        handler.endFunctionArgs();
                    }
                    break;
                case 'ident':
                    {
                        handler.identifier(node.token.data);
                    }
                    break;
                case 'keyword':
                    {
                        handler.keyword(node.token.data);
                    }
                    break;
                case 'literal':
                    {
                    }
                    break;
                case 'placeholder':
                    {
                    }
                    break;
                case 'precision':
                    {
                    }
                    break;
                case 'stmt':
                    {
                        handler.beginStatement();
                        node.children.forEach(function (child) {
                            walker.walk(child, handler);
                        });
                        handler.endStatement();
                    }
                    break;
                case 'stmtlist':
                    {
                        handler.beginStatementList();
                        node.children.forEach(function (child) {
                            walker.walk(child, handler);
                        });
                        handler.endStatementList();
                    }
                    break;
                default: {
                    throw new Error("type: " + node.type);
                }
            }
        };
        return NodeWalker;
    })();
    return NodeWalker;
});

define('davinci-eight/glsl/Declaration',["require", "exports"], function (require, exports) {
    var Declaration = (function () {
        function Declaration(kind, modifiers, type, name) {
            this.kind = kind;
            this.modifiers = modifiers;
            this.type = type;
            this.name = name;
        }
        return Declaration;
    })();
    return Declaration;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/glsl/ProgramArgs',["require", "exports", './DefaultNodeEventHandler', './Declaration'], function (require, exports, DefaultNodeEventHandler, Declaration) {
    var ProgramArgs = (function (_super) {
        __extends(ProgramArgs, _super);
        function ProgramArgs() {
            _super.call(this);
            this.attributes = [];
            this.constants = [];
            this.uniforms = [];
            this.varyings = [];
        }
        ProgramArgs.prototype.declaration = function (kind, modifiers, type, names) {
            var targets = {};
            targets['attribute'] = this.attributes;
            targets['const'] = this.constants;
            targets['uniform'] = this.uniforms;
            targets['varying'] = this.varyings;
            var target = targets[kind];
            if (target) {
                names.forEach(function (name) {
                    target.push(new Declaration(kind, modifiers, type, name));
                });
            }
            else {
                throw new Error("Unexpected declaration kind: " + kind);
            }
        };
        return ProgramArgs;
    })(DefaultNodeEventHandler);
    return ProgramArgs;
});

define('davinci-eight/programs/shaderProgram',["require", "exports", '../glsl/parse', '../glsl/NodeWalker', '../glsl/ProgramArgs', '../utils/uuid4', '../core/ShaderAttributeLocation', '../core/ShaderUniformLocation'], function (require, exports, parse, NodeWalker, ProgramArgs, uuid4, ShaderAttributeLocation, ShaderUniformLocation) {
    var shaderProgram = function (vertexShader, fragmentShader) {
        if (typeof vertexShader !== 'string') {
            throw new Error("vertexShader argument must be a string.");
        }
        if (typeof fragmentShader !== 'string') {
            throw new Error("fragmentShader argument must be a string.");
        }
        function analyze() {
            // TODO: uniform with same name in both files.
            // TODO: varying correlation.
            function shaderVariable(d) {
                return { modifiers: d.modifiers, type: d.type, name: d.name };
            }
            function analyzeVertexShader() {
                try {
                    var vsTree = parse(vertexShader);
                    var walker = new NodeWalker();
                    var args = new ProgramArgs();
                    walker.walk(vsTree, args);
                    // attributes
                    args.attributes.forEach(function (a) {
                        var attributeDecl = shaderVariable(a);
                        attributeDecls.push(attributeDecl);
                        attributeLocations[attributeDecl.name] = new ShaderAttributeLocation(attributeDecl.name, attributeDecl.type);
                    });
                    // uniforms
                    args.uniforms.forEach(function (u) {
                        var uniformDecl = shaderVariable(u);
                        uniformDecls.push(uniformDecl);
                        uniformLocations[uniformDecl.name] = new ShaderUniformLocation(uniformDecl.name, uniformDecl.type);
                    });
                    // varyings
                    args.varyings.forEach(function (v) {
                        var varyingDecl = shaderVariable(v);
                        varyingDecls.push(varyingDecl);
                    });
                }
                catch (e) {
                    console.log(e);
                }
            }
            function analyzeFragmentShader() {
                try {
                    var fsTree = parse(fragmentShader);
                    var walker = new NodeWalker();
                    var args = new ProgramArgs();
                    walker.walk(fsTree, args);
                    // attributes
                    // uniforms
                    args.uniforms.forEach(function (u) {
                        var uniformDecl = shaderVariable(u);
                        uniformDecls.push(uniformDecl);
                        uniformLocations[uniformDecl.name] = new ShaderUniformLocation(uniformDecl.name, uniformDecl.type);
                    });
                }
                catch (e) {
                    console.log(e);
                }
            }
            analyzeVertexShader();
            analyzeFragmentShader();
        }
        var program;
        var programId;
        var context;
        var contextGainId;
        var attributeDecls = [];
        var constantDecls = [];
        var uniformDecls = [];
        var varyingDecls = [];
        var attributeLocations = {};
        var uniformLocations = {};
        var publicAPI = {
            get vertexShader() {
                return vertexShader;
            },
            get fragmentShader() {
                return fragmentShader;
            },
            get attributes() {
                return attributeDecls;
            },
            get constants() {
                return constantDecls;
            },
            get uniforms() {
                return uniformDecls;
            },
            get varyings() {
                return varyingDecls;
            },
            contextFree: function () {
                if (program) {
                    context.deleteProgram(program);
                    program = void 0;
                    programId = void 0;
                    context = void 0;
                    contextGainId = void 0;
                    attributeDecls.forEach(function (attributeDecl) {
                        attributeLocations[attributeDecl.name].contextFree();
                    });
                    uniformDecls.forEach(function (uniformDecl) {
                        uniformLocations[uniformDecl.name].contextFree();
                    });
                }
            },
            contextGain: function (contextArg, contextId) {
                context = contextArg;
                if (contextGainId !== contextId) {
                    program = makeWebGLProgram(context, vertexShader, fragmentShader);
                    programId = uuid4().generate();
                    contextGainId = contextId;
                    attributeDecls.forEach(function (attributeDecl) {
                        attributeLocations[attributeDecl.name].contextGain(contextArg, program);
                    });
                    uniformDecls.forEach(function (uniformDecl) {
                        uniformLocations[uniformDecl.name].contextGain(contextArg, program);
                    });
                }
            },
            contextLoss: function () {
                program = void 0;
                programId = void 0;
                context = void 0;
                contextGainId = void 0;
                attributeDecls.forEach(function (attributeDecl) {
                    attributeLocations[attributeDecl.name].contextLoss();
                });
                uniformDecls.forEach(function (uniformDecl) {
                    uniformLocations[uniformDecl.name].contextLoss();
                });
            },
            hasContext: function () {
                return !!program;
            },
            get program() { return program; },
            get programId() { return programId; },
            use: function () {
                if (context) {
                    return context.useProgram(program);
                }
            },
            attributeLocation: function (name) {
                if (attributeLocations[name]) {
                    return attributeLocations[name];
                }
                else {
                    throw new Error(name + " is not an attribute variable in the shader program.");
                }
            },
            uniformLocation: function (name) {
                if (uniformLocations[name]) {
                    return uniformLocations[name];
                }
                else {
                    throw new Error(name + " is not a uniform variable in the shader program.");
                }
            }
        };
        analyze();
        return publicAPI;
    };
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    function makeWebGLProgram(gl, vertexShader, fragmentShader) {
        // TODO: Proper cleanup if we throw an error at any point.
        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertexShader);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vs));
        }
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragmentShader);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fs));
        }
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }
        return program;
    }
    return shaderProgram;
});

define('davinci-eight/programs/pointsProgram',["require", "exports", '../programs/shaderProgram'], function (require, exports, shaderProgram) {
    /**
     *
     */
    var vertexShader = [
        "attribute vec3 aVertexPosition;",
        "attribute vec3 aVertexColor;",
        "",
        "uniform mat4 uMVMatrix;",
        "uniform mat4 uPMatrix;",
        "",
        "varying highp vec4 vColor;",
        "void main(void)",
        "{",
        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
        "vColor = vec4(aVertexColor, 1.0);",
        "gl_PointSize = 6.0;",
        "}"
    ].join("\n");
    /**
     *
     */
    var fragmentShader = [
        "varying highp vec4 vColor;",
        "void main(void)",
        "{",
        "gl_FragColor = vColor;",
        "}"
    ].join("\n");
    /**
     *
     */
    var pointsProgram = function () {
        var innerProgram = shaderProgram(vertexShader, fragmentShader);
        var publicAPI = {
            get attributes() {
                return innerProgram.attributes;
            },
            get constants() {
                return innerProgram.constants;
            },
            get uniforms() {
                return innerProgram.uniforms;
            },
            get varyings() {
                return innerProgram.varyings;
            },
            get program() {
                return innerProgram.program;
            },
            get programId() {
                return innerProgram.programId;
            },
            contextFree: function () {
                return innerProgram.contextFree();
            },
            contextGain: function (context, contextGainId) {
                return innerProgram.contextGain(context, contextGainId);
            },
            contextLoss: function () {
                return innerProgram.contextLoss();
            },
            hasContext: function () {
                return innerProgram.hasContext();
            },
            get vertexShader() {
                return innerProgram.vertexShader;
            },
            get fragmentShader() {
                return innerProgram.fragmentShader;
            },
            use: function () {
                return innerProgram.use();
            },
            attributeLocation: function (name) {
                return innerProgram.attributeLocation(name);
            },
            uniformLocation: function (name) {
                return innerProgram.uniformLocation(name);
            }
        };
        return publicAPI;
    };
    return pointsProgram;
});

define('davinci-eight/programs/smartProgram',["require", "exports", './shaderProgram', '../core/Symbolic'], function (require, exports, shaderProgram, Symbolic) {
    var SPACE = ' ';
    var ATTRIBUTE = 'attribute' + SPACE;
    var UNIFORM = 'uniform' + SPACE;
    var COMMA = ',' + SPACE;
    var SEMICOLON = ';';
    var LPAREN = '(';
    var RPAREN = ')';
    var TIMES = SPACE + '*' + SPACE;
    var ASSIGN = SPACE + '=' + SPACE;
    /**
     *
     */
    var vertexShader = function (attributes, uniforms) {
        var lines = [];
        for (name in attributes) {
            lines.push(ATTRIBUTE + attributes[name].glslType + SPACE + attributes[name].name + SEMICOLON);
        }
        for (name in uniforms) {
            lines.push(UNIFORM + uniforms[name].glslType + SPACE + uniforms[name].name + SEMICOLON);
        }
        if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
            lines.push("varying highp vec4 vColor;");
        }
        lines.push("varying highp vec3 vLight;");
        lines.push("void main(void) {");
        var glPosition = [];
        glPosition.unshift(SEMICOLON);
        glPosition.unshift(RPAREN);
        glPosition.unshift("1.0");
        glPosition.unshift(COMMA);
        glPosition.unshift(attributes[Symbolic.ATTRIBUTE_POSITION].name);
        glPosition.unshift(LPAREN);
        glPosition.unshift("vec4");
        if (uniforms[Symbolic.UNIFORM_MODEL_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(uniforms[Symbolic.UNIFORM_MODEL_MATRIX].name);
        }
        if (uniforms[Symbolic.UNIFORM_VIEW_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(uniforms[Symbolic.UNIFORM_VIEW_MATRIX].name);
        }
        if (uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX].name);
        }
        glPosition.unshift(ASSIGN);
        glPosition.unshift("gl_Position");
        lines.push(glPosition.join(''));
        if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
            switch (attributes[Symbolic.ATTRIBUTE_COLOR].glslType) {
                case 'vec4':
                    {
                        lines.push("  vColor = " + attributes[Symbolic.ATTRIBUTE_COLOR].name + SEMICOLON);
                    }
                    break;
                case 'vec3':
                    {
                        lines.push("  vColor = vec4(" + attributes[Symbolic.ATTRIBUTE_COLOR].name + ", 1.0);");
                    }
                    break;
                default:
                    {
                        throw new Error("Unexpected type for color attribute: " + attributes[Symbolic.ATTRIBUTE_COLOR].glslType);
                    }
            }
        }
        if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
            lines.push("  vec3 ambientLight = " + uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT].name + SEMICOLON);
        }
        if (uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] && attributes[Symbolic.ATTRIBUTE_NORMAL]) {
            lines.push("  vec3 diffuseLightColor = vec3(0.8, 0.8, 0.8);");
            lines.push("  vec3 L = normalize(vec3(8.0, 10.0, 5.0));");
            lines.push("  vec3 N = normalize(" + uniforms[Symbolic.UNIFORM_NORMAL_MATRIX].name + " * " + attributes[Symbolic.ATTRIBUTE_NORMAL].name + ");");
            lines.push("  float diffuseLightAmount = max(dot(N, L), 0.0);");
            if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
                lines.push("  vLight = ambientLight + diffuseLightAmount * diffuseLightColor;");
            }
            else {
                lines.push("  vLight = diffuseLightAmount * diffuseLightColor;");
            }
        }
        else {
            if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
                lines.push("  vLight = ambientLight;");
            }
            else {
                lines.push("  vLight = vec3(1.0, 1.0, 1.0);");
            }
        }
        lines.push("  gl_PointSize = 6.0;");
        lines.push("}");
        var code = lines.join("\n");
        return code;
    };
    /**
     *
     */
    var fragmentShader = function (attributes, uniforms) {
        var lines = [];
        if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
            lines.push("varying highp vec4 vColor;");
        }
        lines.push("varying highp vec3 vLight;");
        lines.push("void main(void) {");
        if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
            lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
        }
        else {
            lines.push("  gl_FragColor = vec4(vLight, 1.0);");
        }
        lines.push("}");
        var code = lines.join("\n");
        return code;
    };
    /**
     *
     */
    var smartProgram = function (attributes, uniformsList) {
        if (attributes) {
        }
        else {
            throw new Error("The attributes parameter is required for smartProgram.");
        }
        if (uniformsList) {
        }
        else {
            throw new Error("The uniforms parameter is required for smartProgram.");
        }
        var uniforms = {};
        uniformsList.forEach(function (uniformsElement) {
            for (var name in uniformsElement) {
                uniforms[name] = uniformsElement[name];
            }
        });
        var innerProgram = shaderProgram(vertexShader(attributes, uniforms), fragmentShader(attributes, uniforms));
        var publicAPI = {
            get attributes() {
                return innerProgram.attributes;
            },
            get constants() {
                return innerProgram.constants;
            },
            get uniforms() {
                return innerProgram.uniforms;
            },
            get varyings() {
                return innerProgram.varyings;
            },
            get program() {
                return innerProgram.program;
            },
            get programId() {
                return innerProgram.programId;
            },
            get vertexShader() {
                return innerProgram.vertexShader;
            },
            get fragmentShader() {
                return innerProgram.fragmentShader;
            },
            contextFree: function () {
                return innerProgram.contextFree();
            },
            contextGain: function (context, contextGainId) {
                return innerProgram.contextGain(context, contextGainId);
            },
            contextLoss: function () {
                return innerProgram.contextLoss();
            },
            hasContext: function () {
                return innerProgram.hasContext();
            },
            use: function () {
                return innerProgram.use();
            },
            attributeLocation: function (name) {
                return innerProgram.attributeLocation(name);
            },
            uniformLocation: function (name) {
                return innerProgram.uniformLocation(name);
            }
        };
        return publicAPI;
    };
    return smartProgram;
});

define('davinci-eight/programs/shaderProgramFromScripts',["require", "exports", '../programs/shaderProgram'], function (require, exports, shaderProgram) {
    /**
     * @method shaderProgramFromScripts
     * @param vsId {string} The vertex shader script element identifier.
     * @param fsId {string} The fragment shader script element identifier.
     * @param $document {Document} The document containing the script elements.
     */
    function shaderProgramFromScripts(vsId, fsId, $document) {
        if ($document === void 0) { $document = document; }
        function $(id) {
            return $document.getElementById(id);
        }
        return shaderProgram($(vsId).textContent, $(fsId).textContent);
    }
    return shaderProgramFromScripts;
});

/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.0
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

!function(t,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define('gl-matrix',n);else{var r=n();for(var a in r)("object"==typeof exports?exports:t)[a]=r[a]}}(this,function(){return function(t){function n(a){if(r[a])return r[a].exports;var e=r[a]={exports:{},id:a,loaded:!1};return t[a].call(e.exports,e,e.exports,n),e.loaded=!0,e.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){n.glMatrix=r(1),n.mat2=r(2),n.mat2d=r(3),n.mat3=r(4),n.mat4=r(5),n.quat=r(6),n.vec2=r(9),n.vec3=r(7),n.vec4=r(8)},function(t,n){var r={};r.EPSILON=1e-6,r.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,r.RANDOM=Math.random,r.setMatrixArrayType=function(t){GLMAT_ARRAY_TYPE=t};var a=Math.PI/180;r.toRadian=function(t){return t*a},t.exports=r},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},e.clone=function(t){var n=new a.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},e.transpose=function(t,n){if(t===n){var r=n[1];t[1]=n[2],t[2]=r}else t[0]=n[0],t[1]=n[2],t[2]=n[1],t[3]=n[3];return t},e.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*u-e*a;return o?(o=1/o,t[0]=u*o,t[1]=-a*o,t[2]=-e*o,t[3]=r*o,t):null},e.adjoint=function(t,n){var r=n[0];return t[0]=n[3],t[1]=-n[1],t[2]=-n[2],t[3]=r,t},e.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},e.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],c=r[1],f=r[2],s=r[3];return t[0]=a*i+u*c,t[1]=e*i+o*c,t[2]=a*f+u*s,t[3]=e*f+o*s,t},e.mul=e.multiply,e.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),c=Math.cos(r);return t[0]=a*c+u*i,t[1]=e*c+o*i,t[2]=a*-i+u*c,t[3]=e*-i+o*c,t},e.scale=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],c=r[1];return t[0]=a*i,t[1]=e*i,t[2]=u*c,t[3]=o*c,t},e.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=-r,t[3]=a,t},e.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t},e.str=function(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},e.LDU=function(t,n,r,a){return t[2]=a[2]/a[0],r[0]=a[0],r[1]=a[1],r[3]=a[3]-t[2]*r[1],[t,n,r]},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(6);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},e.clone=function(t){var n=new a.ARRAY_TYPE(6);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},e.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=r*u-a*e;return c?(c=1/c,t[0]=u*c,t[1]=-a*c,t[2]=-e*c,t[3]=r*c,t[4]=(e*i-u*o)*c,t[5]=(a*o-r*i)*c,t):null},e.determinant=function(t){return t[0]*t[3]-t[1]*t[2]},e.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=r[0],s=r[1],h=r[2],M=r[3],l=r[4],v=r[5];return t[0]=a*f+u*s,t[1]=e*f+o*s,t[2]=a*h+u*M,t[3]=e*h+o*M,t[4]=a*l+u*v+i,t[5]=e*l+o*v+c,t},e.mul=e.multiply,e.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=Math.sin(r),s=Math.cos(r);return t[0]=a*s+u*f,t[1]=e*s+o*f,t[2]=a*-f+u*s,t[3]=e*-f+o*s,t[4]=i,t[5]=c,t},e.scale=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=r[0],s=r[1];return t[0]=a*f,t[1]=e*f,t[2]=u*s,t[3]=o*s,t[4]=i,t[5]=c,t},e.translate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=r[0],s=r[1];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=a*f+u*s+i,t[5]=e*f+o*s+c,t},e.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=-r,t[3]=a,t[4]=0,t[5]=0,t},e.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t[4]=0,t[5]=0,t},e.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=n[0],t[5]=n[1],t},e.str=function(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.fromMat4=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[4],t[4]=n[5],t[5]=n[6],t[6]=n[8],t[7]=n[9],t[8]=n[10],t},e.clone=function(t){var n=new a.ARRAY_TYPE(9);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.transpose=function(t,n){if(t===n){var r=n[1],a=n[2],e=n[5];t[1]=n[3],t[2]=n[6],t[3]=r,t[5]=n[7],t[6]=a,t[7]=e}else t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8];return t},e.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8],h=s*o-i*f,M=-s*u+i*c,l=f*u-o*c,v=r*h+a*M+e*l;return v?(v=1/v,t[0]=h*v,t[1]=(-s*a+e*f)*v,t[2]=(i*a-e*o)*v,t[3]=M*v,t[4]=(s*r-e*c)*v,t[5]=(-i*r+e*u)*v,t[6]=l*v,t[7]=(-f*r+a*c)*v,t[8]=(o*r-a*u)*v,t):null},e.adjoint=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8];return t[0]=o*s-i*f,t[1]=e*f-a*s,t[2]=a*i-e*o,t[3]=i*c-u*s,t[4]=r*s-e*c,t[5]=e*u-r*i,t[6]=u*f-o*c,t[7]=a*c-r*f,t[8]=r*o-a*u,t},e.determinant=function(t){var n=t[0],r=t[1],a=t[2],e=t[3],u=t[4],o=t[5],i=t[6],c=t[7],f=t[8];return n*(f*u-o*c)+r*(-f*e+o*i)+a*(c*e-u*i)},e.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=r[0],l=r[1],v=r[2],m=r[3],p=r[4],d=r[5],A=r[6],R=r[7],w=r[8];return t[0]=M*a+l*o+v*f,t[1]=M*e+l*i+v*s,t[2]=M*u+l*c+v*h,t[3]=m*a+p*o+d*f,t[4]=m*e+p*i+d*s,t[5]=m*u+p*c+d*h,t[6]=A*a+R*o+w*f,t[7]=A*e+R*i+w*s,t[8]=A*u+R*c+w*h,t},e.mul=e.multiply,e.translate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=r[0],l=r[1];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=i,t[5]=c,t[6]=M*a+l*o+f,t[7]=M*e+l*i+s,t[8]=M*u+l*c+h,t},e.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=Math.sin(r),l=Math.cos(r);return t[0]=l*a+M*o,t[1]=l*e+M*i,t[2]=l*u+M*c,t[3]=l*o-M*a,t[4]=l*i-M*e,t[5]=l*c-M*u,t[6]=f,t[7]=s,t[8]=h,t},e.scale=function(t,n,r){var a=r[0],e=r[1];return t[0]=a*n[0],t[1]=a*n[1],t[2]=a*n[2],t[3]=e*n[3],t[4]=e*n[4],t[5]=e*n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},e.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=n[0],t[7]=n[1],t[8]=1,t},e.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=0,t[3]=-r,t[4]=a,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=n[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.fromMat2d=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=0,t[3]=n[2],t[4]=n[3],t[5]=0,t[6]=n[4],t[7]=n[5],t[8]=1,t},e.fromQuat=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r+r,i=a+a,c=e+e,f=r*o,s=a*o,h=a*i,M=e*o,l=e*i,v=e*c,m=u*o,p=u*i,d=u*c;return t[0]=1-h-v,t[3]=s-d,t[6]=M+p,t[1]=s+d,t[4]=1-f-v,t[7]=l-m,t[2]=M-p,t[5]=l+m,t[8]=1-f-h,t},e.normalFromMat4=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8],h=n[9],M=n[10],l=n[11],v=n[12],m=n[13],p=n[14],d=n[15],A=r*i-a*o,R=r*c-e*o,w=r*f-u*o,q=a*c-e*i,Y=a*f-u*i,g=e*f-u*c,y=s*m-h*v,x=s*p-M*v,P=s*d-l*v,E=h*p-M*m,T=h*d-l*m,b=M*d-l*p,D=A*b-R*T+w*E+q*P-Y*x+g*y;return D?(D=1/D,t[0]=(i*b-c*T+f*E)*D,t[1]=(c*P-o*b-f*x)*D,t[2]=(o*T-i*P+f*y)*D,t[3]=(e*T-a*b-u*E)*D,t[4]=(r*b-e*P+u*x)*D,t[5]=(a*P-r*T-u*y)*D,t[6]=(m*g-p*Y+d*q)*D,t[7]=(p*w-v*g-d*R)*D,t[8]=(v*Y-m*w+d*A)*D,t):null},e.str=function(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(16);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.clone=function(t){var n=new a.ARRAY_TYPE(16);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],n},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.transpose=function(t,n){if(t===n){var r=n[1],a=n[2],e=n[3],u=n[6],o=n[7],i=n[11];t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=r,t[6]=n[9],t[7]=n[13],t[8]=a,t[9]=u,t[11]=n[14],t[12]=e,t[13]=o,t[14]=i}else t[0]=n[0],t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=n[1],t[5]=n[5],t[6]=n[9],t[7]=n[13],t[8]=n[2],t[9]=n[6],t[10]=n[10],t[11]=n[14],t[12]=n[3],t[13]=n[7],t[14]=n[11],t[15]=n[15];return t},e.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8],h=n[9],M=n[10],l=n[11],v=n[12],m=n[13],p=n[14],d=n[15],A=r*i-a*o,R=r*c-e*o,w=r*f-u*o,q=a*c-e*i,Y=a*f-u*i,g=e*f-u*c,y=s*m-h*v,x=s*p-M*v,P=s*d-l*v,E=h*p-M*m,T=h*d-l*m,b=M*d-l*p,D=A*b-R*T+w*E+q*P-Y*x+g*y;return D?(D=1/D,t[0]=(i*b-c*T+f*E)*D,t[1]=(e*T-a*b-u*E)*D,t[2]=(m*g-p*Y+d*q)*D,t[3]=(M*Y-h*g-l*q)*D,t[4]=(c*P-o*b-f*x)*D,t[5]=(r*b-e*P+u*x)*D,t[6]=(p*w-v*g-d*R)*D,t[7]=(s*g-M*w+l*R)*D,t[8]=(o*T-i*P+f*y)*D,t[9]=(a*P-r*T-u*y)*D,t[10]=(v*Y-m*w+d*A)*D,t[11]=(h*w-s*Y-l*A)*D,t[12]=(i*x-o*E-c*y)*D,t[13]=(r*E-a*x+e*y)*D,t[14]=(m*R-v*q-p*A)*D,t[15]=(s*q-h*R+M*A)*D,t):null},e.adjoint=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8],h=n[9],M=n[10],l=n[11],v=n[12],m=n[13],p=n[14],d=n[15];return t[0]=i*(M*d-l*p)-h*(c*d-f*p)+m*(c*l-f*M),t[1]=-(a*(M*d-l*p)-h*(e*d-u*p)+m*(e*l-u*M)),t[2]=a*(c*d-f*p)-i*(e*d-u*p)+m*(e*f-u*c),t[3]=-(a*(c*l-f*M)-i*(e*l-u*M)+h*(e*f-u*c)),t[4]=-(o*(M*d-l*p)-s*(c*d-f*p)+v*(c*l-f*M)),t[5]=r*(M*d-l*p)-s*(e*d-u*p)+v*(e*l-u*M),t[6]=-(r*(c*d-f*p)-o*(e*d-u*p)+v*(e*f-u*c)),t[7]=r*(c*l-f*M)-o*(e*l-u*M)+s*(e*f-u*c),t[8]=o*(h*d-l*m)-s*(i*d-f*m)+v*(i*l-f*h),t[9]=-(r*(h*d-l*m)-s*(a*d-u*m)+v*(a*l-u*h)),t[10]=r*(i*d-f*m)-o*(a*d-u*m)+v*(a*f-u*i),t[11]=-(r*(i*l-f*h)-o*(a*l-u*h)+s*(a*f-u*i)),t[12]=-(o*(h*p-M*m)-s*(i*p-c*m)+v*(i*M-c*h)),t[13]=r*(h*p-M*m)-s*(a*p-e*m)+v*(a*M-e*h),t[14]=-(r*(i*p-c*m)-o*(a*p-e*m)+v*(a*c-e*i)),t[15]=r*(i*M-c*h)-o*(a*M-e*h)+s*(a*c-e*i),t},e.determinant=function(t){var n=t[0],r=t[1],a=t[2],e=t[3],u=t[4],o=t[5],i=t[6],c=t[7],f=t[8],s=t[9],h=t[10],M=t[11],l=t[12],v=t[13],m=t[14],p=t[15],d=n*o-r*u,A=n*i-a*u,R=n*c-e*u,w=r*i-a*o,q=r*c-e*o,Y=a*c-e*i,g=f*v-s*l,y=f*m-h*l,x=f*p-M*l,P=s*m-h*v,E=s*p-M*v,T=h*p-M*m;return d*T-A*E+R*P+w*x-q*y+Y*g},e.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=n[9],l=n[10],v=n[11],m=n[12],p=n[13],d=n[14],A=n[15],R=r[0],w=r[1],q=r[2],Y=r[3];return t[0]=R*a+w*i+q*h+Y*m,t[1]=R*e+w*c+q*M+Y*p,t[2]=R*u+w*f+q*l+Y*d,t[3]=R*o+w*s+q*v+Y*A,R=r[4],w=r[5],q=r[6],Y=r[7],t[4]=R*a+w*i+q*h+Y*m,t[5]=R*e+w*c+q*M+Y*p,t[6]=R*u+w*f+q*l+Y*d,t[7]=R*o+w*s+q*v+Y*A,R=r[8],w=r[9],q=r[10],Y=r[11],t[8]=R*a+w*i+q*h+Y*m,t[9]=R*e+w*c+q*M+Y*p,t[10]=R*u+w*f+q*l+Y*d,t[11]=R*o+w*s+q*v+Y*A,R=r[12],w=r[13],q=r[14],Y=r[15],t[12]=R*a+w*i+q*h+Y*m,t[13]=R*e+w*c+q*M+Y*p,t[14]=R*u+w*f+q*l+Y*d,t[15]=R*o+w*s+q*v+Y*A,t},e.mul=e.multiply,e.translate=function(t,n,r){var a,e,u,o,i,c,f,s,h,M,l,v,m=r[0],p=r[1],d=r[2];return n===t?(t[12]=n[0]*m+n[4]*p+n[8]*d+n[12],t[13]=n[1]*m+n[5]*p+n[9]*d+n[13],t[14]=n[2]*m+n[6]*p+n[10]*d+n[14],t[15]=n[3]*m+n[7]*p+n[11]*d+n[15]):(a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=n[9],l=n[10],v=n[11],t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=i,t[5]=c,t[6]=f,t[7]=s,t[8]=h,t[9]=M,t[10]=l,t[11]=v,t[12]=a*m+i*p+h*d+n[12],t[13]=e*m+c*p+M*d+n[13],t[14]=u*m+f*p+l*d+n[14],t[15]=o*m+s*p+v*d+n[15]),t},e.scale=function(t,n,r){var a=r[0],e=r[1],u=r[2];return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t[4]=n[4]*e,t[5]=n[5]*e,t[6]=n[6]*e,t[7]=n[7]*e,t[8]=n[8]*u,t[9]=n[9]*u,t[10]=n[10]*u,t[11]=n[11]*u,t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t},e.rotate=function(t,n,r,e){var u,o,i,c,f,s,h,M,l,v,m,p,d,A,R,w,q,Y,g,y,x,P,E,T,b=e[0],D=e[1],L=e[2],_=Math.sqrt(b*b+D*D+L*L);return Math.abs(_)<a.EPSILON?null:(_=1/_,b*=_,D*=_,L*=_,u=Math.sin(r),o=Math.cos(r),i=1-o,c=n[0],f=n[1],s=n[2],h=n[3],M=n[4],l=n[5],v=n[6],m=n[7],p=n[8],d=n[9],A=n[10],R=n[11],w=b*b*i+o,q=D*b*i+L*u,Y=L*b*i-D*u,g=b*D*i-L*u,y=D*D*i+o,x=L*D*i+b*u,P=b*L*i+D*u,E=D*L*i-b*u,T=L*L*i+o,t[0]=c*w+M*q+p*Y,t[1]=f*w+l*q+d*Y,t[2]=s*w+v*q+A*Y,t[3]=h*w+m*q+R*Y,t[4]=c*g+M*y+p*x,t[5]=f*g+l*y+d*x,t[6]=s*g+v*y+A*x,t[7]=h*g+m*y+R*x,t[8]=c*P+M*E+p*T,t[9]=f*P+l*E+d*T,t[10]=s*P+v*E+A*T,t[11]=h*P+m*E+R*T,n!==t&&(t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t)},e.rotateX=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[4],o=n[5],i=n[6],c=n[7],f=n[8],s=n[9],h=n[10],M=n[11];return n!==t&&(t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[4]=u*e+f*a,t[5]=o*e+s*a,t[6]=i*e+h*a,t[7]=c*e+M*a,t[8]=f*e-u*a,t[9]=s*e-o*a,t[10]=h*e-i*a,t[11]=M*e-c*a,t},e.rotateY=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[0],o=n[1],i=n[2],c=n[3],f=n[8],s=n[9],h=n[10],M=n[11];return n!==t&&(t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[0]=u*e-f*a,t[1]=o*e-s*a,t[2]=i*e-h*a,t[3]=c*e-M*a,t[8]=u*a+f*e,t[9]=o*a+s*e,t[10]=i*a+h*e,t[11]=c*a+M*e,t},e.rotateZ=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[0],o=n[1],i=n[2],c=n[3],f=n[4],s=n[5],h=n[6],M=n[7];return n!==t&&(t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[0]=u*e+f*a,t[1]=o*e+s*a,t[2]=i*e+h*a,t[3]=c*e+M*a,t[4]=f*e-u*a,t[5]=s*e-o*a,t[6]=h*e-i*a,t[7]=M*e-c*a,t},e.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t},e.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=n[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromRotation=function(t,n,r){var e,u,o,i=r[0],c=r[1],f=r[2],s=Math.sqrt(i*i+c*c+f*f);return Math.abs(s)<a.EPSILON?null:(s=1/s,i*=s,c*=s,f*=s,e=Math.sin(n),u=Math.cos(n),o=1-u,t[0]=i*i*o+u,t[1]=c*i*o+f*e,t[2]=f*i*o-c*e,t[3]=0,t[4]=i*c*o-f*e,t[5]=c*c*o+u,t[6]=f*c*o+i*e,t[7]=0,t[8]=i*f*o+c*e,t[9]=c*f*o-i*e,t[10]=f*f*o+u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)},e.fromXRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=r,t[7]=0,t[8]=0,t[9]=-r,t[10]=a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromYRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=0,t[2]=-r,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=r,t[9]=0,t[10]=a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromZRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=0,t[3]=0,t[4]=-r,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromRotationTranslation=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=a+a,c=e+e,f=u+u,s=a*i,h=a*c,M=a*f,l=e*c,v=e*f,m=u*f,p=o*i,d=o*c,A=o*f;return t[0]=1-(l+m),t[1]=h+A,t[2]=M-d,t[3]=0,t[4]=h-A,t[5]=1-(s+m),t[6]=v+p,t[7]=0,t[8]=M+d,t[9]=v-p,t[10]=1-(s+l),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t},e.fromRotationTranslationScale=function(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3],c=e+e,f=u+u,s=o+o,h=e*c,M=e*f,l=e*s,v=u*f,m=u*s,p=o*s,d=i*c,A=i*f,R=i*s,w=a[0],q=a[1],Y=a[2];return t[0]=(1-(v+p))*w,t[1]=(M+R)*w,t[2]=(l-A)*w,t[3]=0,t[4]=(M-R)*q,t[5]=(1-(h+p))*q,t[6]=(m+d)*q,t[7]=0,t[8]=(l+A)*Y,t[9]=(m-d)*Y,t[10]=(1-(h+v))*Y,t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t},e.fromRotationTranslationScaleOrigin=function(t,n,r,a,e){var u=n[0],o=n[1],i=n[2],c=n[3],f=u+u,s=o+o,h=i+i,M=u*f,l=u*s,v=u*h,m=o*s,p=o*h,d=i*h,A=c*f,R=c*s,w=c*h,q=a[0],Y=a[1],g=a[2],y=e[0],x=e[1],P=e[2];return t[0]=(1-(m+d))*q,t[1]=(l+w)*q,t[2]=(v-R)*q,t[3]=0,t[4]=(l-w)*Y,t[5]=(1-(M+d))*Y,t[6]=(p+A)*Y,t[7]=0,t[8]=(v+R)*g,t[9]=(p-A)*g,t[10]=(1-(M+m))*g,t[11]=0,t[12]=r[0]+y-(t[0]*y+t[4]*x+t[8]*P),t[13]=r[1]+x-(t[1]*y+t[5]*x+t[9]*P),t[14]=r[2]+P-(t[2]*y+t[6]*x+t[10]*P),t[15]=1,t},e.fromQuat=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r+r,i=a+a,c=e+e,f=r*o,s=a*o,h=a*i,M=e*o,l=e*i,v=e*c,m=u*o,p=u*i,d=u*c;return t[0]=1-h-v,t[1]=s+d,t[2]=M-p,t[3]=0,t[4]=s-d,t[5]=1-f-v,t[6]=l+m,t[7]=0,t[8]=M+p,t[9]=l-m,t[10]=1-f-h,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.frustum=function(t,n,r,a,e,u,o){var i=1/(r-n),c=1/(e-a),f=1/(u-o);return t[0]=2*u*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*u*c,t[6]=0,t[7]=0,t[8]=(r+n)*i,t[9]=(e+a)*c,t[10]=(o+u)*f,t[11]=-1,t[12]=0,t[13]=0,t[14]=o*u*2*f,t[15]=0,t},e.perspective=function(t,n,r,a,e){var u=1/Math.tan(n/2),o=1/(a-e);return t[0]=u/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=u,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(e+a)*o,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*e*a*o,t[15]=0,t},e.perspectiveFromFieldOfView=function(t,n,r,a){var e=Math.tan(n.upDegrees*Math.PI/180),u=Math.tan(n.downDegrees*Math.PI/180),o=Math.tan(n.leftDegrees*Math.PI/180),i=Math.tan(n.rightDegrees*Math.PI/180),c=2/(o+i),f=2/(e+u);return t[0]=c,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=f,t[6]=0,t[7]=0,t[8]=-((o-i)*c*.5),t[9]=(e-u)*f*.5,t[10]=a/(r-a),t[11]=-1,t[12]=0,t[13]=0,t[14]=a*r/(r-a),t[15]=0,t},e.ortho=function(t,n,r,a,e,u,o){var i=1/(n-r),c=1/(a-e),f=1/(u-o);return t[0]=-2*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*f,t[11]=0,t[12]=(n+r)*i,t[13]=(e+a)*c,t[14]=(o+u)*f,t[15]=1,t},e.lookAt=function(t,n,r,u){var o,i,c,f,s,h,M,l,v,m,p=n[0],d=n[1],A=n[2],R=u[0],w=u[1],q=u[2],Y=r[0],g=r[1],y=r[2];return Math.abs(p-Y)<a.EPSILON&&Math.abs(d-g)<a.EPSILON&&Math.abs(A-y)<a.EPSILON?e.identity(t):(M=p-Y,l=d-g,v=A-y,m=1/Math.sqrt(M*M+l*l+v*v),M*=m,l*=m,v*=m,o=w*v-q*l,i=q*M-R*v,c=R*l-w*M,m=Math.sqrt(o*o+i*i+c*c),m?(m=1/m,o*=m,i*=m,c*=m):(o=0,i=0,c=0),f=l*c-v*i,s=v*o-M*c,h=M*i-l*o,m=Math.sqrt(f*f+s*s+h*h),m?(m=1/m,f*=m,s*=m,h*=m):(f=0,s=0,h=0),t[0]=o,t[1]=f,t[2]=M,t[3]=0,t[4]=i,t[5]=s,t[6]=l,t[7]=0,t[8]=c,t[9]=h,t[10]=v,t[11]=0,t[12]=-(o*p+i*d+c*A),t[13]=-(f*p+s*d+h*A),t[14]=-(M*p+l*d+v*A),t[15]=1,t)},e.str=function(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))},t.exports=e},function(t,n,r){var a=r(1),e=r(4),u=r(7),o=r(8),i={};i.create=function(){var t=new a.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},i.rotationTo=function(){var t=u.create(),n=u.fromValues(1,0,0),r=u.fromValues(0,1,0);return function(a,e,o){var c=u.dot(e,o);return-.999999>c?(u.cross(t,n,e),u.length(t)<1e-6&&u.cross(t,r,e),u.normalize(t,t),i.setAxisAngle(a,t,Math.PI),a):c>.999999?(a[0]=0,a[1]=0,a[2]=0,a[3]=1,a):(u.cross(t,e,o),a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=1+c,i.normalize(a,a))}}(),i.setAxes=function(){var t=e.create();return function(n,r,a,e){return t[0]=a[0],t[3]=a[1],t[6]=a[2],t[1]=e[0],t[4]=e[1],t[7]=e[2],t[2]=-r[0],t[5]=-r[1],t[8]=-r[2],i.normalize(n,i.fromMat3(n,t))}}(),i.clone=o.clone,i.fromValues=o.fromValues,i.copy=o.copy,i.set=o.set,i.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},i.setAxisAngle=function(t,n,r){r=.5*r;var a=Math.sin(r);return t[0]=a*n[0],t[1]=a*n[1],t[2]=a*n[2],t[3]=Math.cos(r),t},i.add=o.add,i.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],c=r[1],f=r[2],s=r[3];return t[0]=a*s+o*i+e*f-u*c,t[1]=e*s+o*c+u*i-a*f,t[2]=u*s+o*f+a*c-e*i,t[3]=o*s-a*i-e*c-u*f,t},i.mul=i.multiply,i.scale=o.scale,i.rotateX=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),c=Math.cos(r);return t[0]=a*c+o*i,t[1]=e*c+u*i,t[2]=u*c-e*i,t[3]=o*c-a*i,t},i.rotateY=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),c=Math.cos(r);return t[0]=a*c-u*i,t[1]=e*c+o*i,t[2]=u*c+a*i,t[3]=o*c-e*i,t},i.rotateZ=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),c=Math.cos(r);return t[0]=a*c+e*i,t[1]=e*c-a*i,t[2]=u*c+o*i,t[3]=o*c-u*i,t},i.calculateW=function(t,n){var r=n[0],a=n[1],e=n[2];return t[0]=r,t[1]=a,t[2]=e,t[3]=Math.sqrt(Math.abs(1-r*r-a*a-e*e)),t},i.dot=o.dot,i.lerp=o.lerp,i.slerp=function(t,n,r,a){var e,u,o,i,c,f=n[0],s=n[1],h=n[2],M=n[3],l=r[0],v=r[1],m=r[2],p=r[3];return u=f*l+s*v+h*m+M*p,0>u&&(u=-u,l=-l,v=-v,m=-m,p=-p),1-u>1e-6?(e=Math.acos(u),o=Math.sin(e),i=Math.sin((1-a)*e)/o,c=Math.sin(a*e)/o):(i=1-a,c=a),t[0]=i*f+c*l,t[1]=i*s+c*v,t[2]=i*h+c*m,t[3]=i*M+c*p,t},i.sqlerp=function(){var t=i.create(),n=i.create();return function(r,a,e,u,o,c){return i.slerp(t,a,o,c),i.slerp(n,e,u,c),i.slerp(r,t,n,2*c*(1-c)),r}}(),i.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*r+a*a+e*e+u*u,i=o?1/o:0;return t[0]=-r*i,t[1]=-a*i,t[2]=-e*i,t[3]=u*i,t},i.conjugate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=n[3],t},i.length=o.length,i.len=i.length,i.squaredLength=o.squaredLength,i.sqrLen=i.squaredLength,i.normalize=o.normalize,i.fromMat3=function(t,n){var r,a=n[0]+n[4]+n[8];if(a>0)r=Math.sqrt(a+1),t[3]=.5*r,r=.5/r,t[0]=(n[5]-n[7])*r,t[1]=(n[6]-n[2])*r,t[2]=(n[1]-n[3])*r;else{var e=0;n[4]>n[0]&&(e=1),n[8]>n[3*e+e]&&(e=2);var u=(e+1)%3,o=(e+2)%3;r=Math.sqrt(n[3*e+e]-n[3*u+u]-n[3*o+o]+1),t[e]=.5*r,r=.5/r,t[3]=(n[3*u+o]-n[3*o+u])*r,t[u]=(n[3*u+e]+n[3*e+u])*r,t[o]=(n[3*o+e]+n[3*e+o])*r}return t},i.str=function(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},t.exports=i},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(3);return t[0]=0,t[1]=0,t[2]=0,t},e.clone=function(t){var n=new a.ARRAY_TYPE(3);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n},e.fromValues=function(t,n,r){var e=new a.ARRAY_TYPE(3);return e[0]=t,e[1]=n,e[2]=r,e},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t},e.set=function(t,n,r,a){return t[0]=n,t[1]=r,t[2]=a,t},e.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t},e.subtract=function(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t},e.sub=e.subtract,e.multiply=function(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t},e.mul=e.multiply,e.divide=function(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t},e.div=e.divide,e.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t},e.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t},e.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t},e.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t},e.distance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2];return Math.sqrt(r*r+a*a+e*e)},e.dist=e.distance,e.squaredDistance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2];return r*r+a*a+e*e},e.sqrDist=e.squaredDistance,e.length=function(t){var n=t[0],r=t[1],a=t[2];return Math.sqrt(n*n+r*r+a*a)},e.len=e.length,e.squaredLength=function(t){var n=t[0],r=t[1],a=t[2];return n*n+r*r+a*a},e.sqrLen=e.squaredLength,e.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t},e.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t},e.normalize=function(t,n){var r=n[0],a=n[1],e=n[2],u=r*r+a*a+e*e;return u>0&&(u=1/Math.sqrt(u),t[0]=n[0]*u,t[1]=n[1]*u,t[2]=n[2]*u),t},e.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]},e.cross=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],c=r[2];return t[0]=e*c-u*i,t[1]=u*o-a*c,t[2]=a*i-e*o,t},e.lerp=function(t,n,r,a){var e=n[0],u=n[1],o=n[2];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t[2]=o+a*(r[2]-o),t},e.hermite=function(t,n,r,a,e,u){var o=u*u,i=o*(2*u-3)+1,c=o*(u-2)+u,f=o*(u-1),s=o*(3-2*u);return t[0]=n[0]*i+r[0]*c+a[0]*f+e[0]*s,t[1]=n[1]*i+r[1]*c+a[1]*f+e[1]*s,t[2]=n[2]*i+r[2]*c+a[2]*f+e[2]*s,t},e.bezier=function(t,n,r,a,e,u){var o=1-u,i=o*o,c=u*u,f=i*o,s=3*u*i,h=3*c*o,M=c*u;return t[0]=n[0]*f+r[0]*s+a[0]*h+e[0]*M,t[1]=n[1]*f+r[1]*s+a[1]*h+e[1]*M,t[2]=n[2]*f+r[2]*s+a[2]*h+e[2]*M,t},e.random=function(t,n){n=n||1;var r=2*a.RANDOM()*Math.PI,e=2*a.RANDOM()-1,u=Math.sqrt(1-e*e)*n;return t[0]=Math.cos(r)*u,t[1]=Math.sin(r)*u,t[2]=e*n,t},e.transformMat4=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[3]*a+r[7]*e+r[11]*u+r[15];return o=o||1,t[0]=(r[0]*a+r[4]*e+r[8]*u+r[12])/o,t[1]=(r[1]*a+r[5]*e+r[9]*u+r[13])/o,t[2]=(r[2]*a+r[6]*e+r[10]*u+r[14])/o,t},e.transformMat3=function(t,n,r){var a=n[0],e=n[1],u=n[2];return t[0]=a*r[0]+e*r[3]+u*r[6],t[1]=a*r[1]+e*r[4]+u*r[7],t[2]=a*r[2]+e*r[5]+u*r[8],t},e.transformQuat=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],c=r[2],f=r[3],s=f*a+i*u-c*e,h=f*e+c*a-o*u,M=f*u+o*e-i*a,l=-o*a-i*e-c*u;return t[0]=s*f+l*-o+h*-c-M*-i,t[1]=h*f+l*-i+M*-o-s*-c,t[2]=M*f+l*-c+s*-i-h*-o,t},e.rotateX=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[0],u[1]=e[1]*Math.cos(a)-e[2]*Math.sin(a),u[2]=e[1]*Math.sin(a)+e[2]*Math.cos(a),t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},e.rotateY=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[2]*Math.sin(a)+e[0]*Math.cos(a),u[1]=e[1],u[2]=e[2]*Math.cos(a)-e[0]*Math.sin(a),t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},e.rotateZ=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[0]*Math.cos(a)-e[1]*Math.sin(a),u[1]=e[0]*Math.sin(a)+e[1]*Math.cos(a),u[2]=e[2],t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},e.forEach=function(){var t=e.create();return function(n,r,a,e,u,o){var i,c;for(r||(r=3),a||(a=0),c=e?Math.min(e*r+a,n.length):n.length,i=a;c>i;i+=r)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],u(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2];return n}}(),e.angle=function(t,n){var r=e.fromValues(t[0],t[1],t[2]),a=e.fromValues(n[0],n[1],n[2]);e.normalize(r,r),e.normalize(a,a);var u=e.dot(r,a);return u>1?0:Math.acos(u)},e.str=function(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t},e.clone=function(t){var n=new a.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n},e.fromValues=function(t,n,r,e){var u=new a.ARRAY_TYPE(4);return u[0]=t,u[1]=n,u[2]=r,u[3]=e,u},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t},e.set=function(t,n,r,a,e){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t},e.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t},e.subtract=function(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t},e.sub=e.subtract,e.multiply=function(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t[3]=n[3]*r[3],t},e.mul=e.multiply,e.divide=function(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t[3]=n[3]/r[3],t},e.div=e.divide,e.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t[3]=Math.min(n[3],r[3]),t},e.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t[3]=Math.max(n[3],r[3]),t},e.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t},e.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t},e.distance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2],u=n[3]-t[3];return Math.sqrt(r*r+a*a+e*e+u*u)},e.dist=e.distance,e.squaredDistance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2],u=n[3]-t[3];return r*r+a*a+e*e+u*u},e.sqrDist=e.squaredDistance,e.length=function(t){var n=t[0],r=t[1],a=t[2],e=t[3];return Math.sqrt(n*n+r*r+a*a+e*e)},e.len=e.length,e.squaredLength=function(t){var n=t[0],r=t[1],a=t[2],e=t[3];return n*n+r*r+a*a+e*e},e.sqrLen=e.squaredLength,e.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=-n[3],t},e.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t[3]=1/n[3],t},e.normalize=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*r+a*a+e*e+u*u;return o>0&&(o=1/Math.sqrt(o),t[0]=r*o,t[1]=a*o,t[2]=e*o,t[3]=u*o),t},e.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]},e.lerp=function(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t[2]=o+a*(r[2]-o),t[3]=i+a*(r[3]-i),t},e.random=function(t,n){return n=n||1,t[0]=a.RANDOM(),t[1]=a.RANDOM(),t[2]=a.RANDOM(),t[3]=a.RANDOM(),e.normalize(t,t),e.scale(t,t,n),t},e.transformMat4=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3];return t[0]=r[0]*a+r[4]*e+r[8]*u+r[12]*o,t[1]=r[1]*a+r[5]*e+r[9]*u+r[13]*o,t[2]=r[2]*a+r[6]*e+r[10]*u+r[14]*o,t[3]=r[3]*a+r[7]*e+r[11]*u+r[15]*o,t},e.transformQuat=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],c=r[2],f=r[3],s=f*a+i*u-c*e,h=f*e+c*a-o*u,M=f*u+o*e-i*a,l=-o*a-i*e-c*u;return t[0]=s*f+l*-o+h*-c-M*-i,t[1]=h*f+l*-i+M*-o-s*-c,t[2]=M*f+l*-c+s*-i-h*-o,t[3]=n[3],t},e.forEach=function(){var t=e.create();return function(n,r,a,e,u,o){var i,c;for(r||(r=4),a||(a=0),c=e?Math.min(e*r+a,n.length):n.length,i=a;c>i;i+=r)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],t[3]=n[i+3],u(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2],n[i+3]=t[3];return n}}(),e.str=function(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(2);return t[0]=0,t[1]=0,t},e.clone=function(t){var n=new a.ARRAY_TYPE(2);return n[0]=t[0],n[1]=t[1],n},e.fromValues=function(t,n){var r=new a.ARRAY_TYPE(2);return r[0]=t,r[1]=n,r},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t},e.set=function(t,n,r){return t[0]=n,t[1]=r,t},e.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t},e.subtract=function(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t},e.sub=e.subtract,e.multiply=function(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t},e.mul=e.multiply,e.divide=function(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t},e.div=e.divide,e.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t},e.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t},e.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t},e.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t},e.distance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1];return Math.sqrt(r*r+a*a)},e.dist=e.distance,e.squaredDistance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1];return r*r+a*a},e.sqrDist=e.squaredDistance,e.length=function(t){var n=t[0],r=t[1];return Math.sqrt(n*n+r*r)},e.len=e.length,e.squaredLength=function(t){var n=t[0],r=t[1];return n*n+r*r},e.sqrLen=e.squaredLength,e.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t},e.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t},e.normalize=function(t,n){var r=n[0],a=n[1],e=r*r+a*a;return e>0&&(e=1/Math.sqrt(e),t[0]=n[0]*e,t[1]=n[1]*e),t},e.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]},e.cross=function(t,n,r){var a=n[0]*r[1]-n[1]*r[0];return t[0]=t[1]=0,t[2]=a,t},e.lerp=function(t,n,r,a){var e=n[0],u=n[1];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t},e.random=function(t,n){n=n||1;var r=2*a.RANDOM()*Math.PI;return t[0]=Math.cos(r)*n,t[1]=Math.sin(r)*n,t},e.transformMat2=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[2]*e,t[1]=r[1]*a+r[3]*e,t},e.transformMat2d=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[2]*e+r[4],t[1]=r[1]*a+r[3]*e+r[5],t},e.transformMat3=function(t,n,r){
var a=n[0],e=n[1];return t[0]=r[0]*a+r[3]*e+r[6],t[1]=r[1]*a+r[4]*e+r[7],t},e.transformMat4=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[4]*e+r[12],t[1]=r[1]*a+r[5]*e+r[13],t},e.forEach=function(){var t=e.create();return function(n,r,a,e,u,o){var i,c;for(r||(r=2),a||(a=0),c=e?Math.min(e*r+a,n.length):n.length,i=a;c>i;i+=r)t[0]=n[i],t[1]=n[i+1],u(t,t,o),n[i]=t[0],n[i+1]=t[1];return n}}(),e.str=function(t){return"vec2("+t[0]+", "+t[1]+")"},t.exports=e}])});
define('davinci-eight/math/Matrix3',["require", "exports", "gl-matrix"], function (require, exports, glMatrix) {
    var Matrix3 = (function () {
        function Matrix3() {
            this.elements = glMatrix.mat3.create();
        }
        Matrix3.prototype.identity = function () {
            glMatrix.mat3.identity(this.elements);
        };
        Matrix3.prototype.getInverse = function (matrix, throwOnInvertible) {
            // input: THREE.Matrix4
            // ( based on http://code.google.com/p/webgl-mjs/ )
            var me = matrix.elements;
            var te = this.elements;
            te[0] = me[10] * me[5] - me[6] * me[9];
            te[1] = -me[10] * me[1] + me[2] * me[9];
            te[2] = me[6] * me[1] - me[2] * me[5];
            te[3] = -me[10] * me[4] + me[6] * me[8];
            te[4] = me[10] * me[0] - me[2] * me[8];
            te[5] = -me[6] * me[0] + me[2] * me[4];
            te[6] = me[9] * me[4] - me[5] * me[8];
            te[7] = -me[9] * me[0] + me[1] * me[8];
            te[8] = me[5] * me[0] - me[1] * me[4];
            var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
            // no inverse
            if (det === 0) {
                var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";
                if (throwOnInvertible || !throwOnInvertible) {
                    throw new Error(msg);
                }
                else {
                    console.warn(msg);
                }
                this.identity();
                return this;
            }
            this.multiplyScalar(1.0 / det);
            return this;
        };
        Matrix3.prototype.multiplyScalar = function (s) {
            var m = this.elements;
            m[0] *= s;
            m[3] *= s;
            m[6] *= s;
            m[1] *= s;
            m[4] *= s;
            m[7] *= s;
            m[2] *= s;
            m[5] *= s;
            m[8] *= s;
            return this;
        };
        Matrix3.prototype.normalFromMatrix4 = function (m) {
            this.getInverse(m).transpose();
        };
        Matrix3.prototype.transpose = function () {
            var tmp;
            var m = this.elements;
            tmp = m[1];
            m[1] = m[3];
            m[3] = tmp;
            tmp = m[2];
            m[2] = m[6];
            m[6] = tmp;
            tmp = m[5];
            m[5] = m[7];
            m[7] = tmp;
            return this;
        };
        return Matrix3;
    })();
    return Matrix3;
});

define('davinci-eight/mesh/adapterOptions',["require", "exports", '../core/DrawMode'], function (require, exports, DrawMode) {
    function adapterOptions(options) {
        var drawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
        return {
            drawMode: drawMode
        };
    }
    return adapterOptions;
});

define('davinci-eight/mesh/checkMeshArgs',["require", "exports"], function (require, exports) {
    function checkMeshArgs(options) {
        options = options || {};
        var wireFrame = typeof options.wireFrame === 'undefined' ? false : options.wireFrame;
        return {
            wireFrame: wireFrame
        };
    }
    return checkMeshArgs;
});

define('davinci-eight/mesh/arrowMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/ArrowGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, ArrowGeometry, adapterOptions, checkMeshArgs) {
    function arrowGeometry(options) {
        return new ArrowGeometry();
    }
    function arrowMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(arrowGeometry(checkedOptions), adapterOptions(checkedOptions));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function (attributes) {
                return base.update(attributes);
            },
            getVertexAttributeData: function (name) {
                return base.getVertexAttributeData(name);
            },
            getAttributeMetaInfos: function () {
                return base.getAttributeMetaInfos();
            },
            get drawMode() {
                return base.drawMode;
            },
            set drawMode(value) {
                base.drawMode = value;
            },
            get dynamic() {
                return base.dynamic;
            },
            hasElements: function () {
                return base.hasElements();
            },
            getElements: function () {
                return base.getElements();
            }
        };
        return publicAPI;
    }
    return arrowMesh;
});

define('davinci-eight/mesh/boxMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/BoxGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, BoxGeometry, adapterOptions, checkMeshArgs) {
    function boxGeometry(options) {
        return new BoxGeometry(1, 1, 1);
    }
    function boxMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(boxGeometry(checkedOptions), adapterOptions(checkedOptions));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function (attributes) {
                return base.update(attributes);
            },
            getVertexAttributeData: function (name) {
                return base.getVertexAttributeData(name);
            },
            getAttributeMetaInfos: function () {
                return base.getAttributeMetaInfos();
            },
            get drawMode() {
                return base.drawMode;
            },
            set drawMode(value) {
                base.drawMode = value;
            },
            get dynamic() {
                return base.dynamic;
            },
            hasElements: function () {
                return base.hasElements();
            },
            getElements: function () {
                return base.getElements();
            }
        };
        return publicAPI;
    }
    return boxMesh;
});

define('davinci-eight/mesh/cylinderMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/CylinderGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, CylinderGeometry, adapterOptions, checkMeshArgs) {
    function sphereGeometry(options) {
        return new CylinderGeometry();
    }
    function cylinderMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(sphereGeometry(checkedOptions), adapterOptions(checkedOptions));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function (attributes) {
                return base.update(attributes);
            },
            getVertexAttributeData: function (name) {
                return base.getVertexAttributeData(name);
            },
            getAttributeMetaInfos: function () {
                return base.getAttributeMetaInfos();
            },
            get drawMode() {
                return base.drawMode;
            },
            set drawMode(value) {
                base.drawMode = value;
            },
            get dynamic() {
                return base.dynamic;
            },
            hasElements: function () {
                return base.hasElements();
            },
            getElements: function () {
                return base.getElements();
            }
        };
        return publicAPI;
    }
    return cylinderMesh;
});

define('davinci-eight/mesh/sphereMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/SphereGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, SphereGeometry, adapterOptions, checkMeshArgs) {
    function sphereGeometry(options) {
        return new SphereGeometry();
    }
    function sphereMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(sphereGeometry(checkedOptions), adapterOptions(checkedOptions));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function (attributes) {
                return base.update(attributes);
            },
            getVertexAttributeData: function (name) {
                return base.getVertexAttributeData(name);
            },
            getAttributeMetaInfos: function () {
                return base.getAttributeMetaInfos();
            },
            get drawMode() {
                return base.drawMode;
            },
            set drawMode(value) {
                base.drawMode = value;
            },
            get dynamic() {
                return base.dynamic;
            },
            hasElements: function () {
                return base.hasElements();
            },
            getElements: function () {
                return base.getElements();
            }
        };
        return publicAPI;
    }
    return sphereMesh;
});

define('davinci-eight/mesh/vortexMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/VortexGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, VortexGeometry, adapterOptions, checkMeshArgs) {
    function vortexGeometry(options) {
        return new VortexGeometry();
    }
    function vortexMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(vortexGeometry(checkedOptions), adapterOptions(checkedOptions));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function (attributes) {
                return base.update(attributes);
            },
            getVertexAttributeData: function (name) {
                return base.getVertexAttributeData(name);
            },
            getAttributeMetaInfos: function () {
                return base.getAttributeMetaInfos();
            },
            get drawMode() {
                return base.drawMode;
            },
            set drawMode(value) {
                base.drawMode = value;
            },
            get dynamic() {
                return base.dynamic;
            },
            hasElements: function () {
                return base.hasElements();
            },
            getElements: function () {
                return base.getElements();
            }
        };
        return publicAPI;
    }
    return vortexMesh;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/ModelMatrixUniformProvider',["require", "exports", '../math/Matrix3', '../math/Matrix4', '../uniforms/DefaultUniformProvider', '../core/Symbolic'], function (require, exports, Matrix3, Matrix4, DefaultUniformProvider, Symbolic) {
    var UNIFORM_MODEL_MATRIX_NAME = 'uModelMatrix';
    var UNIFORM_MODEL_MATRIX_TYPE = 'mat4';
    var UNIFORM_NORMAL_MATRIX_NAME = 'uNormalMatrix';
    var UNIFORM_NORMAL_MATRIX_TYPE = 'mat3';
    function modelViewMatrix(position, attitude) {
        var matrix = new Matrix4();
        matrix.identity();
        matrix.translate(position);
        var rotation = new Matrix4();
        rotation.rotate(attitude);
        matrix.mul(rotation);
        return matrix;
    }
    /**
     * @class ModelMatrixUniformProvider
     * @extends DefaultUniformProvider
     */
    var ModelMatrixUniformProvider = (function (_super) {
        __extends(ModelMatrixUniformProvider, _super);
        /**
         * @class Model
         * @constructor
         */
        function ModelMatrixUniformProvider() {
            _super.call(this);
            this.position = { x: 0, y: 0, z: 0 };
            this.attitude = { yz: 0, zx: 0, xy: 0, w: 1 };
        }
        /**
         * @method getUniformMatrix3
         * @param name {string}
         */
        ModelMatrixUniformProvider.prototype.getUniformMatrix3 = function (name) {
            switch (name) {
                case UNIFORM_NORMAL_MATRIX_NAME:
                    {
                        // It's unfortunate that we have to recompute the model-view matrix.
                        // We could cache it, being careful that we don't assume the callback order.
                        // We don't want to compute it in the shader beacause that would be per-vertex.
                        var normalMatrix = new Matrix3();
                        var mv = modelViewMatrix(this.position, this.attitude);
                        normalMatrix.normalFromMatrix4(mv);
                        return { transpose: false, matrix3: new Float32Array(normalMatrix.elements) };
                    }
                    break;
                default: {
                    return _super.prototype.getUniformMatrix3.call(this, name);
                }
            }
        };
        /**
         * @method getUniformMatrix4
         * @param name {string}
         */
        ModelMatrixUniformProvider.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case UNIFORM_MODEL_MATRIX_NAME:
                    {
                        var elements = modelViewMatrix(this.position, this.attitude).elements;
                        return { transpose: false, matrix4: new Float32Array(elements) };
                    }
                    break;
                default: {
                    return _super.prototype.getUniformMatrix4.call(this, name);
                }
            }
        };
        /**
         * @method getUniformMetaInfos
         */
        ModelMatrixUniformProvider.prototype.getUniformMetaInfos = function () {
            return ModelMatrixUniformProvider.getUniformMetaInfos();
        };
        ModelMatrixUniformProvider.getUniformMetaInfos = function () {
            var uniforms = {};
            uniforms[Symbolic.UNIFORM_MODEL_MATRIX] = { name: UNIFORM_MODEL_MATRIX_NAME, glslType: UNIFORM_MODEL_MATRIX_TYPE };
            uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = { name: UNIFORM_NORMAL_MATRIX_NAME, glslType: UNIFORM_NORMAL_MATRIX_TYPE };
            return uniforms;
        };
        return ModelMatrixUniformProvider;
    })(DefaultUniformProvider);
    return ModelMatrixUniformProvider;
});

define('davinci-eight/objects/arrow',["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/arrowMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, arrowMesh, smartProgram) {
    function arrow(ambients) {
        var mesh = arrowMesh();
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return arrow;
});

define('davinci-eight/objects/box',["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/boxMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, boxMesh, smartProgram) {
    function box(ambients) {
        var mesh = boxMesh();
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return box;
});

define('davinci-eight/objects/cylinder',["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/cylinderMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, cylinderMesh, smartProgram) {
    function cylinder(ambients) {
        var mesh = cylinderMesh();
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return cylinder;
});

define('davinci-eight/objects/sphere',["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, sphereMesh, smartProgram) {
    function sphere(ambients) {
        var mesh = sphereMesh();
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return sphere;
});

define('davinci-eight/objects/vortex',["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/vortexMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, vortexMesh, smartProgram) {
    function vortex(ambients) {
        var mesh = vortexMesh();
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return vortex;
});

define('davinci-eight/curves/Curve',["require", "exports"], function (require, exports) {
    /**
     * @author zz85 / http://www.lab4games.net/zz85/blog
     * Extensible curve object
     *
     * Some common of Curve methods
     * .getPoint(t), getTangent(t)
     * .getPointAt(u), getTagentAt(u)
     * .getPoints(), .getSpacedPoints()
     * .getLength()
     * .updateArcLengths()
     *
     * This following classes subclasses Curve:
     *
     * LineCurve
     * QuadraticBezierCurve
     * CubicBezierCurve
     * SplineCurve
     * ArcCurve
     * EllipseCurve
     * ClosedSplineCurve
     *
     */
    var Curve = (function () {
        function Curve() {
        }
        /**
         * Virtual base class method to overwrite and implement in subclasses
         * t belongs to [0, 1]
         */
        Curve.prototype.getPoint = function (t) {
            throw new Error("Curve.getPoint() not implemented!");
        };
        /**
         * Get point at relative position in curve according to arc length
         */
        Curve.prototype.getPointAt = function (u) {
            var t = this.getUtoTmapping(u);
            return this.getPoint(t);
        };
        Curve.prototype.getPoints = function (divisions) {
            if (!divisions) {
                divisions = 5;
            }
            var d;
            var pts = [];
            for (d = 0; d <= divisions; d++) {
                pts.push(this.getPoint(d / divisions));
            }
            return pts;
        };
        Curve.prototype.getSpacedPoints = function (divisions) {
            if (!divisions) {
                divisions = 5;
            }
            var d;
            var pts = [];
            for (d = 0; d <= divisions; d++) {
                pts.push(this.getPointAt(d / divisions));
            }
            return pts;
        };
        Curve.prototype.getLength = function () {
            var lengths = this.getLengths();
            return lengths[lengths.length - 1];
        };
        Curve.prototype.getLengths = function (divisions) {
            if (!divisions)
                divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions) : 200;
            if (this.cacheArcLengths
                && (this.cacheArcLengths.length == divisions + 1)
                && !this.needsUpdate) {
                //console.log( "cached", this.cacheArcLengths );
                return this.cacheArcLengths;
            }
            this.needsUpdate = false;
            var cache = [];
            var current;
            var last = this.getPoint(0);
            var p;
            var sum = 0;
            cache.push(0);
            for (p = 1; p <= divisions; p++) {
                current = this.getPoint(p / divisions);
                sum += current.distance(last);
                cache.push(sum);
                last = current;
            }
            this.cacheArcLengths = cache;
            return cache; // { sums: cache, sum:sum }; Sum is in the last element.
        };
        Curve.prototype.updateArcLengths = function () {
            this.needsUpdate = true;
            this.getLengths();
        };
        /**
         * Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance
         */
        Curve.prototype.getUtoTmapping = function (u, distance) {
            var arcLengths = this.getLengths();
            var i = 0, il = arcLengths.length;
            var targetArcLength; // The targeted u distance value to get
            if (distance) {
                targetArcLength = distance;
            }
            else {
                targetArcLength = u * arcLengths[il - 1];
            }
            //var time = Date.now();
            // binary search for the index with largest value smaller than target u distance
            var low = 0, high = il - 1, comparison;
            while (low <= high) {
                i = Math.floor(low + (high - low) / 2); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats
                comparison = arcLengths[i] - targetArcLength;
                if (comparison < 0) {
                    low = i + 1;
                }
                else if (comparison > 0) {
                    high = i - 1;
                }
                else {
                    high = i;
                    break;
                }
            }
            i = high;
            //console.log('b' , i, low, high, Date.now()- time);
            if (arcLengths[i] == targetArcLength) {
                var t = i / (il - 1);
                return t;
            }
            // we could get finer grain at lengths, or use simple interpolatation between two points
            var lengthBefore = arcLengths[i];
            var lengthAfter = arcLengths[i + 1];
            var segmentLength = lengthAfter - lengthBefore;
            // determine where we are between the 'before' and 'after' points
            var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;
            // add that fractional amount to t
            var t = (i + segmentFraction) / (il - 1);
            return t;
        };
        /**
         * Returns a unit vector tangent at t
         * In case any sub curve does not implement its tangent derivation,
         * 2 points a small delta apart will be used to find its gradient
         * which seems to give a reasonable approximation
         */
        Curve.prototype.getTangent = function (t) {
            var delta = 0.0001;
            var t1 = t - delta;
            var t2 = t + delta;
            // Capping in case of danger
            if (t1 < 0)
                t1 = 0;
            if (t2 > 1)
                t2 = 1;
            var pt1 = this.getPoint(t1);
            var pt2 = this.getPoint(t2);
            // TypeScript Generics don't help here because we can't do T extends Vector<T>. 
            var vec = pt2['clone']().sub(pt1);
            return vec.normalize();
        };
        Curve.prototype.getTangentAt = function (u) {
            var t = this.getUtoTmapping(u);
            return this.getTangent(t);
        };
        return Curve;
    })();
    return Curve;
});

define('davinci-eight/renderers/initWebGL',["require", "exports"], function (require, exports) {
    function initWebGL(canvas, attributes) {
        var context;
        try {
            // Try to grab the standard context. If it fails, fallback to experimental.
            context = (canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
        }
        catch (e) {
        }
        if (context) {
            return context;
        }
        else {
            throw new Error("Unable to initialize WebGL. Your browser may not support it.");
        }
    }
    return initWebGL;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformVec4',["require", "exports", '../uniforms/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
    var UniformVec4 = (function (_super) {
        __extends(UniformVec4, _super);
        function UniformVec4(name, id) {
            _super.call(this);
            this.$value = [0, 0, 0];
            this.useValue = true;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformVec4.prototype, "value", {
            set: function (value) {
                this.$value = value;
                this.useValue = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformVec4.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                this.useValue = false;
            },
            enumerable: true,
            configurable: true
        });
        UniformVec4.prototype.getUniformVector4 = function (name) {
            switch (name) {
                case this.name:
                    {
                        if (this.useValue) {
                            return this.$value;
                        }
                        else {
                            return this.$callback();
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformVector4.call(this, name);
                }
            }
        };
        UniformVec4.prototype.getUniformMetaInfos = function () {
            var uniforms = _super.prototype.getUniformMetaInfos.call(this);
            uniforms[this.id] = { name: this.name, glslType: 'vec4' };
            return uniforms;
        };
        return UniformVec4;
    })(DefaultUniformProvider);
    return UniformVec4;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformColor',["require", "exports", '../uniforms/DefaultUniformProvider', '../uniforms/UniformVec4'], function (require, exports, DefaultUniformProvider, UniformVec4) {
    /**
     * Provides a uniform variable representing an ambient light.
     * @class UniformColor
     */
    var UniformColor = (function (_super) {
        __extends(UniformColor, _super);
        /**
         * @class UniformColor
         * @constructor
         */
        function UniformColor(name, id) {
            _super.call(this);
            this.inner = new UniformVec4(name, id);
        }
        Object.defineProperty(UniformColor.prototype, "value", {
            set: function (color) {
                this.inner.value = [color.red, color.green, color.blue, color.alpha];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformColor.prototype, "callback", {
            set: function (callback) {
                this.inner.callback = function () {
                    var color = callback();
                    return [color.red, color.green, color.blue];
                };
            },
            enumerable: true,
            configurable: true
        });
        UniformColor.prototype.getUniformVector4 = function (name) {
            return this.inner.getUniformVector4(name);
        };
        UniformColor.prototype.getUniformMetaInfos = function () {
            return this.inner.getUniformMetaInfos();
        };
        return UniformColor;
    })(DefaultUniformProvider);
    return UniformColor;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/AmbientLight',["require", "exports", '../core/Symbolic', '../uniforms/UniformColor'], function (require, exports, Symbolic, UniformColor) {
    var UNIFORM_AMBIENT_LIGHT_NAME = 'uAmbientLight';
    /**
     * Provides a uniform variable representing an ambient light.
     * @class AmbientLight
     */
    var AmbientLight = (function (_super) {
        __extends(AmbientLight, _super);
        /**
         * @class AmbientLight
         * @constructor
         */
        function AmbientLight(color) {
            _super.call(this, UNIFORM_AMBIENT_LIGHT_NAME, Symbolic.UNIFORM_AMBIENT_LIGHT);
            this.value = color;
        }
        return AmbientLight;
    })(UniformColor);
    return AmbientLight;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/MultiUniformProvider',["require", "exports", '../uniforms/DefaultUniformProvider'], function (require, exports, DefaultUniformProvider) {
    function isDefined(value) { return value !== void 0; }
    var MultiUniformProvider = (function (_super) {
        __extends(MultiUniformProvider, _super);
        function MultiUniformProvider(providers) {
            _super.call(this);
            this.providers = [];
            this.providers = providers;
        }
        MultiUniformProvider.prototype.getUniformFloat = function (name) {
            var values = this.providers.map(function (provider) { return provider.getUniformFloat(name); }).filter(isDefined);
            if (values.length === 1) {
                return values[0];
            }
            else {
                return _super.prototype.getUniformFloat.call(this, name);
            }
        };
        MultiUniformProvider.prototype.getUniformMatrix2 = function (name) {
            var values = this.providers.map(function (provider) { return provider.getUniformMatrix2(name); }).filter(isDefined);
            if (values.length === 1) {
                return values[0];
            }
            else {
                return _super.prototype.getUniformMatrix2.call(this, name);
            }
        };
        MultiUniformProvider.prototype.getUniformMatrix3 = function (name) {
            var values = this.providers.map(function (provider) { return provider.getUniformMatrix3(name); }).filter(isDefined);
            if (values.length === 1) {
                return values[0];
            }
            else {
                return _super.prototype.getUniformMatrix3.call(this, name);
            }
        };
        MultiUniformProvider.prototype.getUniformMatrix4 = function (name) {
            var values = this.providers.map(function (provider) { return provider.getUniformMatrix4(name); }).filter(isDefined);
            if (values.length === 1) {
                return values[0];
            }
            else {
                return _super.prototype.getUniformMatrix4.call(this, name);
            }
        };
        MultiUniformProvider.prototype.getUniformVector2 = function (name) {
            var values = this.providers.map(function (provider) { return provider.getUniformVector2(name); }).filter(isDefined);
            if (values.length === 1) {
                return values[0];
            }
            else {
                return _super.prototype.getUniformVector2.call(this, name);
            }
        };
        MultiUniformProvider.prototype.getUniformVector3 = function (name) {
            var values = this.providers.map(function (provider) { return provider.getUniformVector3(name); }).filter(isDefined);
            if (values.length === 1) {
                return values[0];
            }
            else {
                return _super.prototype.getUniformVector3.call(this, name);
            }
        };
        MultiUniformProvider.prototype.getUniformVector4 = function (name) {
            var values = this.providers.map(function (provider) { return provider.getUniformVector4(name); }).filter(isDefined);
            if (values.length === 1) {
                return values[0];
            }
            else {
                return _super.prototype.getUniformVector4.call(this, name);
            }
        };
        MultiUniformProvider.prototype.getUniformMetaInfos = function () {
            var uniforms = _super.prototype.getUniformMetaInfos.call(this);
            this.providers.forEach(function (provider) {
                var metas = provider.getUniformMetaInfos();
                for (var id in metas) {
                    uniforms[id] = metas[id];
                }
            });
            return uniforms;
        };
        return MultiUniformProvider;
    })(DefaultUniformProvider);
    return MultiUniformProvider;
});

define('davinci-eight/uniforms/uniforms',["require", "exports", '../uniforms/MultiUniformProvider'], function (require, exports, MultiUniformProvider) {
    /**
     * @method uniforms
     */
    function uniforms(providers) {
        return new MultiUniformProvider(providers);
    }
    return uniforms;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformFloat',["require", "exports", '../uniforms/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
    /**
     * @class UniformFloat
     */
    var UniformFloat = (function (_super) {
        __extends(UniformFloat, _super);
        /**
         * @class UniformFloat
         * @constructor
         * @param name {string}
         * @param name {id}
         */
        function UniformFloat(name, id) {
            _super.call(this);
            this.$value = 0;
            this.useValue = false;
            this.useCallback = false;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformFloat.prototype, "value", {
            set: function (value) {
                this.$value = value;
                if (typeof value !== void 0) {
                    this.useValue = true;
                    this.useCallback = false;
                }
                else {
                    this.useValue = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformFloat.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                if (typeof callback !== void 0) {
                    this.useCallback = true;
                    this.useValue = false;
                }
                else {
                    this.useCallback = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        UniformFloat.prototype.getUniformFloat = function (name) {
            switch (name) {
                case this.name:
                    {
                        if (this.useValue) {
                            return this.$value;
                        }
                        else if (this.useCallback) {
                            return this.$callback();
                        }
                        else {
                            var message = "uniform float " + this.name + " has not been assigned a value or callback.";
                            console.warn(message);
                            throw new Error(message);
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformFloat.call(this, name);
                }
            }
        };
        UniformFloat.prototype.getUniformMetaInfos = function () {
            var uniforms = _super.prototype.getUniformMetaInfos.call(this);
            uniforms[this.id] = { name: this.name, glslType: 'float' };
            return uniforms;
        };
        return UniformFloat;
    })(DefaultUniformProvider);
    return UniformFloat;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformVec2',["require", "exports", '../uniforms/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
    var UniformVec2 = (function (_super) {
        __extends(UniformVec2, _super);
        function UniformVec2(name, id) {
            _super.call(this);
            this.$value = [0, 0];
            this.useValue = true;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformVec2.prototype, "value", {
            set: function (value) {
                this.$value = value;
                this.useValue = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformVec2.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                this.useValue = false;
            },
            enumerable: true,
            configurable: true
        });
        UniformVec2.prototype.getUniformVector2 = function (name) {
            switch (name) {
                case this.name:
                    {
                        if (this.useValue) {
                            return this.$value;
                        }
                        else {
                            return this.$callback();
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformVector2.call(this, name);
                }
            }
        };
        UniformVec2.prototype.getUniformMetaInfos = function () {
            var uniforms = _super.prototype.getUniformMetaInfos.call(this);
            uniforms[this.id] = { name: this.name, glslType: 'vec2' };
            return uniforms;
        };
        return UniformVec2;
    })(DefaultUniformProvider);
    return UniformVec2;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformVec3',["require", "exports", '../uniforms/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
    var UniformVec3 = (function (_super) {
        __extends(UniformVec3, _super);
        function UniformVec3(name, id) {
            _super.call(this);
            this.$value = [0, 0, 0];
            this.useValue = true;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformVec3.prototype, "value", {
            set: function (value) {
                this.$value = value;
                this.useValue = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformVec3.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                this.useValue = false;
            },
            enumerable: true,
            configurable: true
        });
        UniformVec3.prototype.getUniformVector3 = function (name) {
            switch (name) {
                case this.name:
                    {
                        if (this.useValue) {
                            return this.$value;
                        }
                        else {
                            return this.$callback();
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformVector3.call(this, name);
                }
            }
        };
        UniformVec3.prototype.getUniformMetaInfos = function () {
            var uniforms = _super.prototype.getUniformMetaInfos.call(this);
            uniforms[this.id] = { name: this.name, glslType: 'vec3' };
            return uniforms;
        };
        return UniformVec3;
    })(DefaultUniformProvider);
    return UniformVec3;
});

define('davinci-eight/utils/contextMonitor',["require", "exports", '../utils/uuid4', '../renderers/initWebGL', '../checks/expectArg'], function (require, exports, uuid4, initWebGL, expectArg) {
    function contextMonitor(canvas, attributes) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        var users = [];
        var context;
        var contextId;
        var webGLContextLost = function (event) {
            event.preventDefault();
            context = void 0;
            contextId = void 0;
            users.forEach(function (user) {
                user.contextLoss();
            });
        };
        var webGLContextRestored = function (event) {
            event.preventDefault();
            context = initWebGL(canvas, attributes);
            contextId = uuid4().generate();
            users.forEach(function (user) {
                user.contextGain(context, contextId);
            });
        };
        var self = {
            start: function () {
                context = initWebGL(canvas, attributes);
                contextId = uuid4().generate();
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                users.forEach(function (user) {
                    user.contextGain(context, contextId);
                });
                return self;
            },
            stop: function () {
                context = void 0;
                contextId = void 0;
                users.forEach(function (user) {
                    user.contextFree();
                });
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
                return self;
            },
            addContextUser: function (user) {
                expectArg('user', user).toBeObject();
                users.push(user);
                if (context && !user.hasContext()) {
                    user.contextGain(context, contextId);
                }
                return self;
            },
            get context() {
                return context;
            }
        };
        return self;
    }
    ;
    return contextMonitor;
});

define('davinci-eight/utils/workbench3D',["require", "exports"], function (require, exports) {
    /**
     * @const
     * @type {string}
     */
    var EVENT_NAME_RESIZE = 'resize';
    /**
     * @const
     * @type {string}
     */
    var TAG_NAME_CANVAS = 'canvas';
    function removeElementsByTagName(doc, tagname) {
        var elements = doc.getElementsByTagName(tagname);
        for (var i = elements.length - 1; i >= 0; i--) {
            var e = elements[i];
            e.parentNode.removeChild(e);
        }
    }
    /**
     * Creates and returns a workbench3D thing.
     * @param canvas An HTML canvas element to be inserted.
     * TODO: We should remove the camera as being too opinionated, replace with a callback providing
     */
    var workbench3D = function (canvas, renderer, camera, win) {
        if (win === void 0) { win = window; }
        var doc = win.document;
        function syncToWindow() {
            var width = win.innerWidth;
            var height = win.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
        }
        var onWindowResize = function (event) { syncToWindow(); };
        var that = {
            setUp: function () {
                doc.body.insertBefore(canvas, doc.body.firstChild);
                win.addEventListener(EVENT_NAME_RESIZE, onWindowResize, false);
                syncToWindow();
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

define('davinci-eight/utils/windowAnimationRunner',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    function defaultSetUp() {
    }
    function defaultTearDown(animateException) {
        if (animateException) {
            var message = "Exception raised during animate function: " + animateException;
            console.warn(message);
        }
    }
    function defaultTerminate(time) {
        // Never ending, because whenever asked we say nee.
        return false;
    }
    /**
     * Creates an object implementing a stopwatch API that makes callbacks to user-supplied functions.
     * @param animate The `animate` function is called for each animation frame.
     * @param options.setUp The `setUp` function is called synchronously each time the start() method is called.
     * @param options.tearDown The `tearDown` function is called asynchronously each time the animation is stopped.
     * @param options.terminate The `terminate` function is called to determine whether the animation should stop.
     * @param options.window {Window} The window in which the animation will run. Defaults to the global window.
     */
    var animation = function (animate, options) {
        // TODO: Use enum when TypeScript compiler version is appropriate.
        var STATE_INITIAL = 1;
        var STATE_RUNNING = 2;
        var STATE_PAUSED = 3;
        options = options || {};
        var $window = expectArg('options.window', options.window || window).toNotBeNull().value;
        var setUp = expectArg('options.setUp', options.setUp || defaultSetUp).value;
        var tearDown = expectArg('options.tearDown', options.tearDown || defaultTearDown).value;
        var terminate = expectArg('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;
        var stopSignal = false; // 27 is Esc
        //  var pauseKeyPressed = false;  // 19
        //  var enterKeyPressed = false;  // 13
        var startTime;
        var elapsed = 0;
        var MILLIS_PER_SECOND = 1000;
        var requestID = null;
        var animateException;
        var state = STATE_INITIAL;
        var frameRequestCallback = function (timestamp) {
            if (startTime) {
                elapsed = elapsed + timestamp - startTime;
            }
            startTime = timestamp;
            if (stopSignal || terminate(elapsed / MILLIS_PER_SECOND)) {
                // Clear the stopSignal.
                stopSignal = false;
                $window.cancelAnimationFrame(requestID);
                if (publicAPI.isRunning) {
                    state = STATE_PAUSED;
                    startTime = void 0;
                }
                else {
                    // TODO: Can we recover?
                    console.error("stopSignal received while not running.");
                }
                $window.document.removeEventListener('keydown', onDocumentKeyDown, false);
                try {
                    tearDown(animateException);
                }
                catch (e) {
                    console.warn("Exception raised during tearDown function: " + e);
                }
            }
            else {
                requestID = $window.requestAnimationFrame(frameRequestCallback);
                // If an exception happens, cache it to be reported later and simulate a stopSignal.
                try {
                    animate(elapsed / MILLIS_PER_SECOND);
                }
                catch (e) {
                    animateException = e;
                    stopSignal = true;
                }
            }
        };
        var onDocumentKeyDown = function (event) {
            // TODO: It would be nice for all key responses to be soft-defined.
            // In other words, a mapping of event (keyCode) to action (start, stop, reset)
            if (event.keyCode === 27) {
                stopSignal = true;
                event.preventDefault();
            }
            /*
            else if (event.keyCode === 19) {
              pauseKeyPressed = true;
              event.preventDefault();
            }
            else if (event.keyCode === 13) {
              enterKeyPressed = true;
              event.preventDefault();
            }
            */
        };
        // The public API is a classic stopwatch.
        // The states are INITIAL, RUNNING, PAUSED.
        var publicAPI = {
            start: function () {
                if (!publicAPI.isRunning) {
                    setUp();
                    $window.document.addEventListener('keydown', onDocumentKeyDown, false);
                    state = STATE_RUNNING;
                    requestID = $window.requestAnimationFrame(frameRequestCallback);
                }
                else {
                    throw new Error("The `start` method may only be called when not running.");
                }
            },
            stop: function () {
                if (publicAPI.isRunning) {
                    stopSignal = true;
                }
                else {
                    throw new Error("The `stop` method may only be called when running.");
                }
            },
            reset: function () {
                if (publicAPI.isPaused) {
                    startTime = void 0;
                    elapsed = 0;
                    state = STATE_INITIAL;
                }
                else {
                    throw new Error("The `reset` method may only be called when paused.");
                }
            },
            get time() {
                return elapsed / MILLIS_PER_SECOND;
            },
            lap: function () {
                if (publicAPI.isRunning) {
                }
                else {
                    throw new Error("The `lap` method may only be called when running.");
                }
            },
            get isRunning() {
                return state === STATE_RUNNING;
            },
            get isPaused() {
                return state === STATE_PAUSED;
            }
        };
        return publicAPI;
    };
    return animation;
});

/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define('davinci-eight',["require", "exports", 'davinci-eight/core/DataUsage', 'davinci-eight/core/DrawMode', 'davinci-eight/core', 'davinci-eight/core/object3D', 'davinci-eight/cameras/view', 'davinci-eight/core/Color', 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/perspective', 'davinci-eight/worlds/world', 'davinci-eight/renderers/viewport', 'davinci-eight/objects/drawableModel', 'davinci-eight/core/Face3', 'davinci-eight/core/ShaderAttributeLocation', 'davinci-eight/core/ShaderUniformLocation', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/GeometryAdapter', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/ParametricGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/programs/pointsProgram', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/shaderProgramFromScripts', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/mesh/arrowMesh', 'davinci-eight/mesh/boxMesh', 'davinci-eight/mesh/cylinderMesh', 'davinci-eight/mesh/sphereMesh', 'davinci-eight/mesh/vortexMesh', 'davinci-eight/objects/arrow', 'davinci-eight/objects/box', 'davinci-eight/objects/cylinder', 'davinci-eight/objects/sphere', 'davinci-eight/objects/vortex', 'davinci-eight/curves/Curve', 'davinci-eight/renderers/initWebGL', 'davinci-eight/uniforms/AmbientLight', 'davinci-eight/uniforms/ChainedUniformProvider', 'davinci-eight/uniforms/DefaultUniformProvider', 'davinci-eight/uniforms/ModelMatrixUniformProvider', 'davinci-eight/uniforms/MultiUniformProvider', 'davinci-eight/uniforms/uniforms', 'davinci-eight/uniforms/UniformFloat', 'davinci-eight/uniforms/UniformMat4', 'davinci-eight/uniforms/UniformVec2', 'davinci-eight/uniforms/UniformVec3', 'davinci-eight/uniforms/UniformVec4', 'davinci-eight/utils/contextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, DataUsage, DrawMode, core, object3D, view, Color, frustum, perspective, world, viewport, drawableModel, Face3, ShaderAttributeLocation, ShaderUniformLocation, Geometry, GeometryAdapter, ArrowGeometry, BoxGeometry, CylinderGeometry, DodecahedronGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, ParametricGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, pointsProgram, shaderProgram, smartProgram, shaderProgramFromScripts, Matrix3, Matrix4, Spinor3, Vector2, Vector3, arrowMesh, boxMesh, cylinderMesh, sphereMesh, vortexMesh, arrow, box, cylinder, sphere, vortex, Curve, initWebGL, AmbientLight, ChainedUniformProvider, DefaultUniformProvider, ModelMatrixUniformProvider, MultiUniformProvider, uniforms, UniformFloat, UniformMat4, UniformVec2, UniformVec3, UniformVec4, contextMonitor, workbench3D, windowAnimationRunner) {
    /*
    import BoxMesh = require('davinci-eight/mesh/BoxMesh');
    import CuboidMesh = require('davinci-eight/mesh/CuboidMesh');
    import CurveMesh = require('davinci-eight/mesh/CurveMesh');
    import EllipsoidMesh = require('davinci-eight/mesh/EllipsoidMesh');
    import LatticeMesh = require('davinci-eight/mesh/LatticeMesh');
    import box = require('davinci-eight/mesh/box');
    import prism = require('davinci-eight/mesh/prism');
    import cuboid = require('davinci-eight/mesh/cuboid');
    import ellipsoid = require('davinci-eight/mesh/ellipsoid');
    import RGBMesh = require('davinci-eight/mesh/RGBMesh');
    */
    /**
     * @module EIGHT
     */
    var eight = {
        /**
         * The semantic version of the library.
         * @property VERSION
         * @type String
         */
        'VERSION': core.VERSION,
        get initWebGL() { return initWebGL; },
        get view() { return view; },
        get frustum() { return frustum; },
        get perspective() { return perspective; },
        get world() { return world; },
        object3D: object3D,
        get viewport() { return viewport; },
        get contextMonitor() { return contextMonitor; },
        workbench: workbench3D,
        animation: windowAnimationRunner,
        get DataUsage() { return DataUsage; },
        get drawableModel() { return drawableModel; },
        get DrawMode() { return DrawMode; },
        get ShaderAttributeLocation() { return ShaderAttributeLocation; },
        get ShaderUniformLocation() { return ShaderUniformLocation; },
        get pointsProgram() {
            return pointsProgram;
        },
        get shaderProgram() {
            return shaderProgram;
        },
        get smartProgram() {
            return smartProgram;
        },
        get AmbientLight() { return AmbientLight; },
        get Color() { return Color; },
        get Face3() { return Face3; },
        get Geometry() { return Geometry; },
        get GeometryAdapter() { return GeometryAdapter; },
        get ArrowGeometry() { return ArrowGeometry; },
        get BoxGeometry() { return BoxGeometry; },
        get CylinderGeometry() { return CylinderGeometry; },
        get DodecahedronGeometry() { return DodecahedronGeometry; },
        get IcosahedronGeometry() { return IcosahedronGeometry; },
        get KleinBottleGeometry() { return KleinBottleGeometry; },
        get MobiusStripGeometry() { return MobiusStripGeometry; },
        get OctahedronGeometry() { return OctahedronGeometry; },
        get ParametricGeometry() { return ParametricGeometry; },
        get PolyhedronGeometry() { return PolyhedronGeometry; },
        get RevolutionGeometry() { return RevolutionGeometry; },
        get SphereGeometry() { return SphereGeometry; },
        get TetrahedronGeometry() { return TetrahedronGeometry; },
        get TubeGeometry() { return TubeGeometry; },
        get VortexGeometry() { return VortexGeometry; },
        get ModelMatrixUniformProvider() { return ModelMatrixUniformProvider; },
        get UniformFloat() { return UniformFloat; },
        get UniformMat4() { return UniformMat4; },
        get UniformVec2() { return UniformVec2; },
        get UniformVec3() { return UniformVec3; },
        get UniformVec4() { return UniformVec4; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get Spinor3() { return Spinor3; },
        get Vector2() { return Vector2; },
        get Vector3() { return Vector3; },
        get Curve() { return Curve; },
        get ChainedUniformProvider() { return ChainedUniformProvider; },
        get DefaultUniformProvider() { return DefaultUniformProvider; },
        get MultiUniformProvider() { return MultiUniformProvider; },
        get uniforms() { return uniforms; },
        // mesh
        get arrowMesh() { return arrowMesh; },
        get boxMesh() { return boxMesh; },
        get cylinderMesh() { return cylinderMesh; },
        get sphereMesh() { return sphereMesh; },
        get vortexMesh() { return vortexMesh; },
        // objects
        get arrow() { return arrow; },
        get box() { return box; },
        get cylinder() { return cylinder; },
        get sphere() { return sphere; },
        get vortex() { return vortex; },
        // programs
        get shaderProgramFromScripts() { return shaderProgramFromScripts; },
    };
    return eight;
});

  var library = require('davinci-eight');
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
