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

define('davinci-eight/checks/expectArg',["require", "exports"], function (require, exports) {
    function expectArg(name, value) {
        var arg = {
            toSatisfy: function (condition, message) {
                if (!condition) {
                    throw new Error(message);
                }
                return arg;
            },
            toBeBoolean: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'boolean') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be a boolean.";
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
            toBeInClosedInterval: function (lower, upper) {
                if (value >= lower && value <= upper) {
                    return arg;
                }
                else {
                    var message = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
                    throw new Error(message);
                }
            },
            toBeNumber: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'number') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be a number.";
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

define('davinci-eight/math/Vector3',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    /**
     * @class Vector3
     */
    var Vector3 = (function () {
        /**
         * @class Vector3
         * @constructor
         * @param data {number[]}
         */
        function Vector3(data) {
            if (data === void 0) { data = [0, 0, 0]; }
            this.data = data;
            this.modified = false;
        }
        Object.defineProperty(Vector3.prototype, "data", {
            get: function () {
                if (this.$data) {
                    return this.$data;
                }
                else if (this.$callback) {
                    var data = this.$callback();
                    expectArg('callback()', data).toSatisfy(data.length === 3, "callback() length must be 3");
                    return this.$callback();
                }
                else {
                    throw new Error("Vector3 is undefined.");
                }
            },
            set: function (data) {
                expectArg('data', data).toSatisfy(data.length === 3, "data length must be 3");
                this.$data = data;
                this.$callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "callback", {
            get: function () {
                return this.$callback;
            },
            set: function (reactTo) {
                this.$callback = reactTo;
                this.$data = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.data[0] = value;
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
                return this.data[1];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.data[1] = value;
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
                return this.data[2];
            },
            set: function (value) {
                this.modified = this.modified || this.z !== value;
                this.data[2] = value;
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
            return this.addVectors(this, v);
        };
        Vector3.prototype.addVectors = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        };
        Vector3.prototype.applyMatrix3 = function (m) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var e = m.elements;
            this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
            this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
            this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;
            return this;
        };
        /**
         * Pre-multiplies the column vector corresponding to this vector by the matrix.
         * The result is applied to this vector.
         * Strictly speaking, this method does not make much sense because the dimensions
         * of the square matrix and column vector don't match.
         * TODO: Used by TubeGeometry.
         * @method applyMatrix
         * @param m The 4x4 matrix that pre-multiplies this column vector.
         */
        Vector3.prototype.applyMatrix4 = function (m) {
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
            return new Vector3([this.x, this.y, this.z]);
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
        Vector3.prototype.distanceTo = function (position) {
            return Math.sqrt(this.quadranceTo(position));
        };
        Vector3.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            var dy = this.y - position.y;
            var dz = this.z - position.z;
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
        Vector3.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        Vector3.prototype.quaditude = function () {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return x * x + y * y + z * z;
        };
        Vector3.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            return this;
        };
        Vector3.prototype.normalize = function () {
            return this.divideScalar(this.magnitude());
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
        Vector3.prototype.setMagnitude = function (magnitude) {
            var m = this.magnitude();
            if (m !== 0) {
                if (magnitude !== m) {
                    return this.multiplyScalar(magnitude / m);
                }
                else {
                    return this; // No change
                }
            }
            else {
                // Former magnitude was zero, i.e. a null vector.
                throw new Error("Attempting to set the magnitude of a null vector.");
            }
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
        /**
         * @method copy
         * Copy constructor.
         */
        Vector3.copy = function (vector) {
            return new Vector3([vector.x, vector.y, vector.z]);
        };
        Vector3.e1 = new Vector3([1, 0, 0]);
        Vector3.e2 = new Vector3([0, 1, 0]);
        Vector3.e3 = new Vector3([0, 0, 1]);
        return Vector3;
    })();
    return Vector3;
});

define('davinci-eight/checks/isDefined',["require", "exports"], function (require, exports) {
    function isDefined(arg) {
        return (typeof arg !== 'undefined');
    }
    return isDefined;
});

define('davinci-eight/math/Matrix4',["require", "exports", '../checks/expectArg', '../checks/isDefined'], function (require, exports, expectArg, isDefined) {
    /**
     * 4x4 matrix integrating with WebGL.
     *
     * @class Matrix4
     */
    var Matrix4 = (function () {
        /**
         * Constructs the Matrix4 by wrapping a Float32Array.
         * @constructor
         */
        function Matrix4(elements) {
            expectArg('elements', elements)
                .toSatisfy(elements instanceof Float32Array, "elements must be a Float32Array")
                .toSatisfy(elements.length === 16, 'elements must have length 16');
            this.elements = elements;
        }
        Matrix4.identity = function () {
            return new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
        };
        Matrix4.scaling = function (scale) {
            return Matrix4.identity().scaling(scale);
        };
        Matrix4.translation = function (vector) {
            return Matrix4.identity().translation(vector);
        };
        Matrix4.rotation = function (spinor) {
            if (isDefined(spinor)) {
                expectArg('spinor', spinor).toBeObject();
                return Matrix4.identity().rotation(spinor);
            }
            else {
                return;
            }
        };
        Matrix4.prototype.clone = function () {
            return Matrix4.identity().copy(this);
        };
        Matrix4.prototype.compose = function (scale, attitude, position) {
            // We 
            // this.identity();
            // this.scale(scale);
            this.scaling(scale);
            this.rotate(attitude);
            this.translate(position);
            return this;
        };
        Matrix4.prototype.copy = function (m) {
            this.elements.set(m.elements);
            return this;
        };
        Matrix4.prototype.determinant = function () {
            var te = this.elements;
            var n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
            var n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
            var n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
            var n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
            //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
            var n1122 = n11 * n22;
            var n1123 = n11 * n23;
            var n1124 = n11 * n24;
            var n1221 = n12 * n21;
            var n1223 = n12 * n23;
            var n1224 = n12 * n24;
            var n1321 = n13 * n21;
            var n1322 = n13 * n22;
            var n1324 = n13 * n24;
            var n1421 = n14 * n21;
            var n1422 = n14 * n22;
            var n1423 = n14 * n23;
            return n41 * ((n1423 - n1324) * n32 + (n1224 - n1422) * n33 + (n1322 - n1223) * n34) +
                n42 * ((n1324 - n1423) * n31 + (n1421 - n1124) * n33 + (n1123 - n1321) * n34) +
                n43 * ((n1422 - n1224) * n31 + (n1124 - n1421) * n32 + (n1221 - n1122) * n34) +
                n44 * ((n1223 - n1322) * n31 + (n1321 - n1123) * n32 + (n1122 - n1221) * n33);
        };
        Matrix4.prototype.invert = function (m, throwOnSingular) {
            if (throwOnSingular === void 0) { throwOnSingular = false; }
            // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
            var te = this.elements;
            var me = m.elements;
            var n11 = me[0], n12 = me[4], n13 = me[8], n14 = me[12];
            var n21 = me[1], n22 = me[5], n23 = me[9], n24 = me[13];
            var n31 = me[2], n32 = me[6], n33 = me[10], n34 = me[14];
            var n41 = me[3], n42 = me[7], n43 = me[11], n44 = me[15];
            te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
            te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
            te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
            te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
            te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
            te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
            te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
            te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
            te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
            te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
            te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
            te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
            te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
            te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
            te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
            te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
            var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];
            if (det !== 0) {
                return this.multiplyScalar(1 / det);
            }
            else {
                var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";
                if (throwOnSingular) {
                    throw new Error(msg);
                }
                else {
                    console.warn(msg);
                }
                this.identity();
                return this;
            }
        };
        Matrix4.prototype.identity = function () {
            return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.multiplyScalar = function (s) {
            var te = this.elements;
            te[0] *= s;
            te[4] *= s;
            te[8] *= s;
            te[12] *= s;
            te[1] *= s;
            te[5] *= s;
            te[9] *= s;
            te[13] *= s;
            te[2] *= s;
            te[6] *= s;
            te[10] *= s;
            te[14] *= s;
            te[3] *= s;
            te[7] *= s;
            te[11] *= s;
            te[15] *= s;
            return this;
        };
        Matrix4.prototype.transpose = function () {
            var te = this.elements;
            var tmp;
            tmp = te[1];
            te[1] = te[4];
            te[4] = tmp;
            tmp = te[2];
            te[2] = te[8];
            te[8] = tmp;
            tmp = te[6];
            te[6] = te[9];
            te[9] = tmp;
            tmp = te[3];
            te[3] = te[12];
            te[12] = tmp;
            tmp = te[7];
            te[7] = te[13];
            te[13] = tmp;
            tmp = te[11];
            te[11] = te[14];
            te[14] = tmp;
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
        Matrix4.prototype.rotationAxis = function (axis, angle) {
            // Based on http://www.gamedev.net/reference/articles/article1199.asp
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x, y = axis.y, z = axis.z;
            var tx = t * x, ty = t * y;
            return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.mul = function (m) {
            return Matrix4.mul(this, m, this);
        };
        Matrix4.prototype.multiplyMatrices = function (a, b) {
            return Matrix4.mul(a, b, this);
        };
        Matrix4.mul = function (a, b, out) {
            var ae = a.elements;
            var be = b.elements;
            var oe = out.elements;
            var a11 = ae[0x0], a12 = ae[0x4], a13 = ae[0x8], a14 = ae[0xC];
            var a21 = ae[0x1], a22 = ae[0x5], a23 = ae[0x9], a24 = ae[0xD];
            var a31 = ae[0x2], a32 = ae[0x6], a33 = ae[0xA], a34 = ae[0xE];
            var a41 = ae[0x3], a42 = ae[0x7], a43 = ae[0xB], a44 = ae[0xF];
            var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
            var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
            var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
            var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
            oe[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            oe[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            oe[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            oe[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
            oe[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            oe[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            oe[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            oe[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
            oe[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            oe[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            oe[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            oe[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
            out[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            out[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            out[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            out[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            return out;
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
        Matrix4.prototype.rotate = function (spinor) {
            var S = Matrix4.rotation(spinor);
            return Matrix4.mul(S, this, this);
        };
        /**
         * @method rotate
         * @param attitude  The spinor from which the rotation will be computed.
         */
        Matrix4.prototype.rotation = function (spinor) {
            // The correspondence between quaternions and spinors is
            // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
            var x = -expectArg('spinor.yz', spinor.yz).toBeNumber().value;
            var y = -expectArg('spinor.zx', spinor.zx).toBeNumber().value;
            var z = -expectArg('spinor.xy', spinor.xy).toBeNumber().value;
            var w = expectArg('spinor.w', spinor.w).toBeNumber().value;
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
        /**
         *
         */
        Matrix4.prototype.scale = function (scale) {
            // We treat the scale operation as pre-multiplication: 
            // |x 0 0 0|   |m[0] m[4] m[8] m[C]|   |x * m[0] x * m[4] x * m[8] x * m[C]|
            // |0 y 0 0| * |m[1] m[5] m[9] m[D]| = |y * m[1] y * m[5] y * m[9] y * m[D]|
            // |0 0 z 0|   |m[2] m[6] m[A] m[E]|   |z * m[2] z * m[6] z * m[A] z * m[E]|
            // |0 0 0 1|   |m[3] m[7] m[B] m[F]|   |    m[3]     m[7]     m[B]     m[F]|
            // The following would be post-multiplication:
            // |m[0] m[4] m[8] m[C]|   |x 0 0 0|   |x * m[0] y * m[4] z * m[8]     m[C]|
            // |m[1] m[5] m[9] m[D]| * |0 y 0 0| = |x * m[1] y * m[5] z * m[9]     m[D]|
            // |m[2] m[6] m[A] m[E]|   |0 0 z 0|   |x * m[2] y * m[6] z * m[A]     m[E]|
            // |m[3] m[7] m[B] m[F]|   |0 0 0 1|   |x * m[3] y * m[7] z * m[B]     m[F]|
            var S = Matrix4.scaling(scale);
            return Matrix4.mul(S, this, this);
        };
        Matrix4.prototype.scaling = function (scale) {
            return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
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
        Matrix4.prototype.toFixed = function (digits) {
            if (isDefined(digits)) {
                expectArg('digits', digits).toBeNumber();
            }
            var text = [];
            for (var i = 0; i <= 3; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toFixed(digits); }).join(' '));
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
        Matrix4.prototype.translate = function (displacement) {
            var T = Matrix4.translation(displacement);
            return Matrix4.mul(T, this, this);
        };
        Matrix4.prototype.translation = function (displacement) {
            return this.set(1, 0, 0, displacement.x, 0, 1, 0, displacement.y, 0, 0, 1, displacement.z, 0, 0, 0, 1);
        };
        Matrix4.prototype.__mul__ = function (other) {
            if (other instanceof Matrix4) {
                return Matrix4.identity().multiplyMatrices(this, other);
            }
            else if (typeof other === 'number') {
                return this.clone().multiplyScalar(other);
            }
        };
        Matrix4.prototype.__rmul__ = function (other) {
            if (other instanceof Matrix4) {
                return Matrix4.identity().multiplyMatrices(other, this);
            }
            else if (typeof other === 'number') {
                return this.clone().multiplyScalar(other);
            }
        };
        return Matrix4;
    })();
    return Matrix4;
});

define('davinci-eight/core/Symbolic',["require", "exports"], function (require, exports) {
    /**
     * Canonical variable names, which also act as semantic identifiers for name overrides.
     * These names must be stable to avoid breaking custom vertex and fragment shaders.
     * @class Symbolic
     */
    var Symbolic = (function () {
        function Symbolic() {
        }
        Symbolic.ATTRIBUTE_COLOR = 'aVertexColor';
        Symbolic.ATTRIBUTE_NORMAL = 'aVertexNormal';
        Symbolic.ATTRIBUTE_POSITION = 'aVertexPosition';
        Symbolic.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        Symbolic.UNIFORM_COLOR = 'uColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        Symbolic.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        Symbolic.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        Symbolic.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';
        Symbolic.UNIFORM_MODEL_MATRIX = 'uModelMatrix';
        Symbolic.UNIFORM_NORMAL_MATRIX = 'uNormalMatrix';
        Symbolic.UNIFORM_VIEW_MATRIX = 'uViewMatrix';
        Symbolic.VARYING_COLOR = 'vColor';
        Symbolic.VARYING_LIGHT = 'vLight';
        return Symbolic;
    })();
    return Symbolic;
});

define('davinci-eight/core/DefaultUniformProvider',["require", "exports"], function (require, exports) {
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
         * @method getUniformMeta
         * @return An empty object that derived class may modify.
         */
        DefaultUniformProvider.prototype.getUniformMeta = function () {
            var uniforms = {};
            return uniforms;
        };
        /**
         * @method getUniformData
         * @return An empty object that derived class may modify.
         */
        DefaultUniformProvider.prototype.getUniformData = function () {
            var data = {};
            return data;
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
define('davinci-eight/uniforms/UniformMat4',["require", "exports", '../core/DefaultUniformProvider', '../utils/uuid4', '../checks/isDefined'], function (require, exports, DefaultUniformProvider, uuid4, isDefined) {
    var UniformMat4 = (function (_super) {
        __extends(UniformMat4, _super);
        function UniformMat4(name, id) {
            _super.call(this);
            this.useData = true;
            this.$name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
            this.$varName = isDefined(this.$name) ? this.$name : this.id;
        }
        Object.defineProperty(UniformMat4.prototype, "data", {
            set: function (data) {
                this.$data = data;
                this.useData = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformMat4.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                this.useData = false;
            },
            enumerable: true,
            configurable: true
        });
        UniformMat4.prototype.getValue = function () {
            if (this.useData) {
                return this.$data;
            }
            else {
                return this.$callback();
            }
        };
        UniformMat4.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case this.$varName:
                    {
                        if (this.useData) {
                            return this.$data;
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
        UniformMat4.prototype.getUniformMeta = function () {
            var uniforms = _super.prototype.getUniformMeta.call(this);
            if (isDefined(this.$name)) {
                uniforms[this.id] = { name: this.$name, glslType: 'mat4' };
            }
            else {
                uniforms[this.id] = { glslType: 'mat4' };
            }
            return uniforms;
        };
        UniformMat4.prototype.getUniformData = function () {
            var data = _super.prototype.getUniformData.call(this);
            var value = this.getValue();
            var m4 = { transpose: value.transpose, matrix3: void 0, matrix4: value.matrix4, uniformZs: void 0 };
            if (isDefined(this.$name)) {
                data[this.$name] = m4;
            }
            else {
                data[this.id] = m4;
            }
            return data;
        };
        return UniformMat4;
    })(DefaultUniformProvider);
    return UniformMat4;
});

define('davinci-eight/cameras/view',["require", "exports", '../math/Vector3', '../math/Matrix4', '../core/Symbolic', '../uniforms/UniformMat4', '../checks/expectArg'], function (require, exports, Vector3, Matrix4, Symbolic, UniformMat4, expectArg) {
    /**
     * @class view
     * @constructor
     */
    var view = function (options) {
        options = options || {};
        var eye = new Vector3();
        var look = new Vector3();
        var up = Vector3.e2;
        var viewMatrix = Matrix4.identity();
        var base = new UniformMat4(options.viewMatrixName, Symbolic.UNIFORM_VIEW_MATRIX);
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
            var d = new Vector3([eye.dot(u), eye.dot(v), eye.dot(n)]).multiplyScalar(-1);
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
        var self = {
            get eye() {
                return eye;
            },
            set eye(value) {
                self.setEye(value);
            },
            setEye: function (value) {
                expectArg('eye', value).toBeObject();
                eye.x = value.x;
                eye.y = value.y;
                eye.z = value.z;
                return self;
            },
            get look() {
                return look;
            },
            set look(value) {
                self.setLook(value);
            },
            setLook: function (value) {
                expectArg('look', value).toBeObject();
                look.x = value.x;
                look.y = value.y;
                look.z = value.z;
                return self;
            },
            get up() {
                return up;
            },
            set up(value) {
                self.setUp(value);
            },
            setUp: function (value) {
                expectArg('up', value).toBeObject();
                up.x = value.x;
                up.y = value.y;
                up.z = value.z;
                up.normalize();
                return self;
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
            getUniformMeta: function () {
                return base.getUniformMeta();
            },
            getUniformData: function () {
                return base.getUniformData();
            }
        };
        return self;
    };
    return view;
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
        var options = { viewMatrixName: Symbolic.UNIFORM_VIEW_MATRIX };
        var base = view(options);
        // TODO: We should immediately create with a frustum static constructor?
        var projectionMatrix = Matrix4.identity();
        function updateProjectionMatrix() {
            projectionMatrix.frustum(left, right, bottom, top, near, far);
        }
        updateProjectionMatrix();
        var self = {
            // Delegate to the base camera.
            get eye() {
                return base.eye;
            },
            set eye(value) {
                base.eye = value;
            },
            setEye: function (eye) {
                base.setEye(eye);
                return self;
            },
            get look() {
                return base.look;
            },
            set look(value) {
                base.look = value;
            },
            setLook: function (look) {
                base.setLook(look);
                return self;
            },
            get up() {
                return base.up;
            },
            set up(up) {
                base.setUp(up);
            },
            setUp: function (up) {
                base.setUp(up);
                return self;
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
            getUniformMeta: function () {
                var uniforms = base.getUniformMeta();
                uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX] = { name: UNIFORM_PROJECTION_MATRIX_NAME, glslType: UNIFORM_PROJECTION_MATRIX_TYPE };
                return uniforms;
            },
            getUniformData: function () {
                var data = base.getUniformData();
                return data;
            }
        };
        return self;
    };
    return frustum;
});

define('davinci-eight/checks/isUndefined',["require", "exports"], function (require, exports) {
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }
    return isUndefined;
});

define('davinci-eight/cameras/perspective',["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', 'davinci-eight/core/Symbolic', '../checks/isDefined', '../checks/isUndefined', '../checks/expectArg'], function (require, exports, view, Matrix4, Symbolic, isDefined, isUndefined, expectArg) {
    //let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    /**
     * @class perspective
     * @constructor
     * @param fov {number}
     * @param aspect {number}
     * @param near {number}
     * @param far {number}
     * @return {Perspective}
     */
    var perspective = function (options) {
        options = options || {};
        var fov = isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov;
        var aspect = isUndefined(options.aspect) ? 1 : options.aspect;
        var near = isUndefined(options.near) ? 0.1 : options.near;
        var far = expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value;
        var projectionMatrixName = isUndefined(options.projectionMatrixName) ? Symbolic.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
        var base = view(options);
        var projectionMatrix = Matrix4.identity();
        var matrixNeedsUpdate = true;
        var self = {
            // Delegate to the base camera.
            get eye() {
                return base.eye;
            },
            set eye(eye) {
                base.eye = eye;
            },
            setEye: function (eye) {
                base.setEye(eye);
                return self;
            },
            get look() {
                return base.look;
            },
            set look(value) {
                base.look = value;
            },
            setLook: function (look) {
                base.setLook(look);
                return self;
            },
            get up() {
                return base.up;
            },
            set up(value) {
                base.up = value;
            },
            setUp: function (up) {
                base.setUp(up);
                return self;
            },
            get fov() {
                return fov;
            },
            set fov(value) {
                self.setFov(value);
            },
            setFov: function (value) {
                expectArg('fov', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || fov !== value;
                fov = value;
                return self;
            },
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                self.setAspect(value);
            },
            setAspect: function (value) {
                expectArg('aspect', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || aspect !== value;
                aspect = value;
                return self;
            },
            get near() {
                return near;
            },
            set near(value) {
                self.setNear(value);
            },
            setNear: function (value) {
                expectArg('near', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || near !== value;
                near = value;
                return self;
            },
            get far() {
                return far;
            },
            set far(value) {
                self.setFar(value);
            },
            setFar: function (value) {
                expectArg('far', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || far !== value;
                far = value;
                return self;
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
                expectArg('name', name).toBeString();
                switch (name) {
                    case projectionMatrixName: {
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
            getUniformMeta: function () {
                var meta = base.getUniformMeta();
                if (isDefined(options.projectionMatrixName)) {
                    meta[Symbolic.UNIFORM_PROJECTION_MATRIX] = { name: options.projectionMatrixName, glslType: 'mat4' };
                }
                else {
                    meta[Symbolic.UNIFORM_PROJECTION_MATRIX] = { glslType: 'mat4' };
                }
                return meta;
            },
            getUniformData: function () {
                var data = base.getUniformData();
                data[projectionMatrixName] = self.getUniformMatrix4(projectionMatrixName);
                return data;
            }
        };
        return self;
    };
    return perspective;
});

define('davinci-eight/core/IdentityAttribProvider',["require", "exports"], function (require, exports) {
    var IdentityAttribProvider = (function () {
        function IdentityAttribProvider() {
        }
        IdentityAttribProvider.prototype.draw = function (context) {
        };
        IdentityAttribProvider.prototype.update = function () {
        };
        IdentityAttribProvider.prototype.getAttribArray = function (name) {
            return;
        };
        IdentityAttribProvider.prototype.getAttribMeta = function () {
            var attributes = {};
            return attributes;
        };
        IdentityAttribProvider.prototype.hasElementArray = function () {
            return false;
        };
        IdentityAttribProvider.prototype.getElementArray = function () {
            return;
        };
        return IdentityAttribProvider;
    })();
    return IdentityAttribProvider;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/core/DefaultAttribProvider',["require", "exports", '../core/IdentityAttribProvider', '../core/Symbolic'], function (require, exports, IdentityAttribProvider, Symbolic) {
    var DefaultAttribProvider = (function (_super) {
        __extends(DefaultAttribProvider, _super);
        function DefaultAttribProvider() {
            _super.call(this);
        }
        DefaultAttribProvider.prototype.draw = function (context) {
            /*
            switch(this.drawMode) {
              case DrawMode.POINTS: {
                context.drawArrays(context.POINTS, 0, this.points.length * 1);
              }
              break;
              case DrawMode.LINES: {
                context.drawArrays(context.LINES, 0, this.lines.length * 2);
              }
              break;
              case DrawMode.TRIANGLES: {
                //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
                context.drawArrays(context.TRIANGLES, 0, this.geometry.faces.length * 3);
              }
              break;
              default : {
              }
            }
            */
        };
        DefaultAttribProvider.prototype.update = function () {
            return _super.prototype.update.call(this);
        };
        DefaultAttribProvider.prototype.getAttribArray = function (name) {
            return _super.prototype.getAttribArray.call(this, name);
        };
        DefaultAttribProvider.prototype.getAttribMeta = function () {
            var attributes = _super.prototype.getAttribMeta.call(this);
            attributes[Symbolic.ATTRIBUTE_POSITION] = { glslType: 'vec3', size: 3 };
            return attributes;
        };
        DefaultAttribProvider.prototype.hasElementArray = function () {
            return _super.prototype.hasElementArray.call(this);
        };
        DefaultAttribProvider.prototype.getElementArray = function () {
            return _super.prototype.getElementArray.call(this);
        };
        return DefaultAttribProvider;
    })(IdentityAttribProvider);
    return DefaultAttribProvider;
});

define('davinci-eight/core/Color',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    /**
     * A mutable type representing a color through its RGB components.
     * @class Color
     * WARNING: In many object-oriented designs, types representing values are completely immutable.
     * In a graphics library where data changes rapidly and garbage collection might become an issue,
     * it is common to use reference types, such as in this design. This mutability can lead to
     * difficult bugs because it is hard to reason about where a color may have changed.
     */
    var Color = (function () {
        /**
         * @class Color
         * @constructor
         * @param data {number[]}
         */
        function Color(data) {
            if (data === void 0) { data = [0, 0, 0]; }
            expectArg('data', data).toSatisfy(data.length === 3, "data must have length equal to 3");
            this.data = data;
        }
        Object.defineProperty(Color.prototype, "red", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "green", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "blue", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.clone = function () {
            return new Color([this.data[0], this.data[1], this.data[2]]);
        };
        Color.prototype.luminance = function () {
            return Color.luminance(this.red, this.green, this.blue);
        };
        Color.prototype.toString = function () {
            return "Color(" + this.red + ", " + this.green + ", " + this.blue + ")";
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
                return new Color([R + m, G + m, B + m]);
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
        Color.fromRGB = function (red, green, blue) {
            expectArg('red', red).toBeNumber().toBeInClosedInterval(0, 1);
            expectArg('green', green).toBeNumber().toBeInClosedInterval(0, 1);
            expectArg('blue', blue).toBeNumber().toBeInClosedInterval(0, 1);
            return new Color([red, green, blue]);
        };
        Color.copy = function (color) {
            return new Color([color.red, color.green, color.blue]);
        };
        return Color;
    })();
    return Color;
});

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

define('davinci-eight/core/Face3',["require", "exports"], function (require, exports) {
    /**
     * @class Face3
     */
    var Face3 = (function () {
        /**
         * @class Face3
         * @constructor
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param normals {Vector3[]} The per-vertex normals for this face (3) or face normal (1).
         */
        function Face3(a, b, c, normals) {
            if (normals === void 0) { normals = []; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.normals = normals;
        }
        return Face3;
    })();
    return Face3;
});

define('davinci-eight/core',["require", "exports"], function (require, exports) {
    var core = {
        VERSION: '2.61.0'
    };
    return core;
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
         * @param attributes {AttribProvider}
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
            if (this.attributes.hasElementArray()) {
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
         * @param attributes {AttribProvider}
         */
        ElementArray.prototype.bufferData = function (attributes) {
            if (this.buffer) {
                var elements = attributes.getElementArray();
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

define('davinci-eight/core/getAttribVarName',["require", "exports", '../checks/isDefined', '../checks/expectArg'], function (require, exports, isDefined, expectArg) {
    /**
     * Policy for how an attribute variable name is determined.
     */
    function getAttribVarName(attribute, varName) {
        expectArg('attribute', attribute).toBeObject();
        expectArg('varName', varName).toBeString();
        return isDefined(attribute.name) ? expectArg('attribute.name', attribute.name).toBeString().value : varName;
    }
    return getAttribVarName;
});

define('davinci-eight/programs/setAttributes',["require", "exports"], function (require, exports) {
    /**
     * Sets attributes and binds buffers (deprecated... use {@link module:webgl-utils.setBuffersAndAttributes})
     *
     * Example:
     *
     *     var program = createProgramFromScripts(
     *         gl, ["some-vs", "some-fs");
     *
     *     var attribSetters = createAttributeSetters(program);
     *
     *     var positionBuffer = gl.createBuffer();
     *     var texcoordBuffer = gl.createBuffer();
     *
     *     var attribs = {
     *       a_position: {buffer: positionBuffer, numComponents: 3},
     *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
     *     };
     *
     *     gl.useProgram(program);
     *
     * This will automatically bind the buffers AND set the
     * attributes.
     *
     *     setAttributes(attribSetters, attribs);
     *
     * Properties of attribs. For each attrib you can add
     * properties:
     *
     * *   type: the type of data in the buffer. Default = gl.FLOAT
     * *   normalize: whether or not to normalize the data. Default = false
     * *   stride: the stride. Default = 0
     * *   offset: offset into the buffer. Default = 0
     *
     * For example if you had 3 value float positions, 2 value
     * float texcoord and 4 value uint8 colors you'd setup your
     * attribs like this
     *
     *     var attribs = {
     *       a_position: {buffer: positionBuffer, numComponents: 3},
     *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
     *       a_color: {
     *         buffer: colorBuffer,
     *         numComponents: 4,
     *         type: gl.UNSIGNED_BYTE,
     *         normalize: true,
     *       },
     *     };
     *
     * @param {Object.<string, function>} setters Attribute setters as returned from createAttributeSetters
     * @param {Object.<string, module:webgl-utils.AttribInfo>} buffers AttribInfos mapped by attribute name.
     * @memberOf module:webgl-utils
     * @deprecated use {@link module:webgl-utils.setBuffersAndAttributes}
     */
    function setAttributes(setters, buffers, metas) {
        // setters are defined by the program. buffers are defined for objects but may be consolidated.
        // But if the buffer spec does not exist in the program as a setter, we ignore it.
        Object.keys(buffers).forEach(function (name) {
            var setter = setters[name];
            if (setter) {
                setter(buffers[name], metas[name]);
            }
        });
    }
    return setAttributes;
});

define('davinci-eight/programs/setUniforms',["require", "exports"], function (require, exports) {
    /**
     * Set uniforms and binds related textures.
     *
     * example:
     *
     *     var programInfo = createProgramInfo(
     *         gl, ["some-vs", "some-fs");
     *
     *     var tex1 = gl.createTexture();
     *     var tex2 = gl.createTexture();
     *
     *     ... assume we setup the textures with data ...
     *
     *     var uniforms = {
     *       u_someSampler: tex1,
     *       u_someOtherSampler: tex2,
     *       u_someColor: [1,0,0,1],
     *       u_somePosition: [0,1,1],
     *       u_someMatrix: [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ],
     *     };
     *
     *     gl.useProgram(program);
     *
     * This will automatically bind the textures AND set the
     * uniforms.
     *
     *     setUniforms(programInfo.uniformSetters, uniforms);
     *
     * For the example above it is equivalent to
     *
     *     var texUnit = 0;
     *     gl.activeTexture(gl.TEXTURE0 + texUnit);
     *     gl.bindTexture(gl.TEXTURE_2D, tex1);
     *     gl.uniform1i(u_someSamplerLocation, texUnit++);
     *     gl.activeTexture(gl.TEXTURE0 + texUnit);
     *     gl.bindTexture(gl.TEXTURE_2D, tex2);
     *     gl.uniform1i(u_someSamplerLocation, texUnit++);
     *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
     *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
     *     gl.uniformMatrix4fv(u_someMatrix, false, [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ]);
     *
     * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
     *
     *     var uniforms = {
     *       u_someSampler: tex1,
     *       u_someOtherSampler: tex2,
     *     };
     *
     *     var moreUniforms {
     *       u_someColor: [1,0,0,1],
     *       u_somePosition: [0,1,1],
     *       u_someMatrix: [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ],
     *     };
     *
     *     setUniforms(programInfo.uniformSetters, uniforms);
     *     setUniforms(programInfo.uniformSetters, moreUniforms);
     *
     * @param {Object.<string, function>} setters the setters returned from
     *        `createUniformSetters`.
     * @param {Object.<string, value>} an object with values for the
     *        uniforms.
     * @memberOf module:webgl-utils
     */
    function setUniforms(setters, values) {
        Object.keys(values).forEach(function (name) {
            var setter = setters[name];
            if (setter) {
                setter(values[name]);
            }
            else {
                console.warn("UniformSetter missing for uniform " + name);
            }
        });
    }
    return setUniforms;
});

define('davinci-eight/objects/primitive',["require", "exports", '../core/ElementArray', '../core/getAttribVarName', '../programs/setAttributes', '../programs/setUniforms'], function (require, exports, ElementArray, getAttribVarName, setAttributes, setUniforms) {
    var primitive = function (mesh, program, model) {
        /**
         * Find an attribute by its code name rather than its semantic role (which is the key in AttribMetaInfos)
         */
        function findAttribMetaInfoByVariableName(attribVarName, attributes) {
            for (var name in attributes) {
                var attribute = attributes[name];
                if (getAttribVarName(attribute, name) === attribVarName) {
                    return attribute;
                }
            }
        }
        var context;
        var contextGainId;
        var elements = new ElementArray(mesh);
        var self = {
            get mesh() {
                return mesh;
            },
            get program() {
                return program;
            },
            get model() {
                return model;
            },
            contextFree: function () {
                program.contextFree();
                elements.contextFree();
                context = null;
                contextGainId = null;
            },
            contextGain: function (contextArg, contextId) {
                context = contextArg;
                if (contextGainId !== contextId) {
                    contextGainId = contextId;
                    program.contextGain(context, contextId);
                    elements.contextGain(context, contextId);
                }
            },
            contextLoss: function () {
                program.contextLoss();
                elements.contextLoss();
                context = null;
                contextGainId = null;
            },
            hasContext: function () {
                return program.hasContext();
            },
            /**
             * @method draw
             */
            draw: function () {
                if (!program.hasContext()) {
                    return;
                }
                if (mesh.dynamic) {
                    mesh.update();
                }
                // NEW attributes
                // No problem here because we loop on keys in buffers.
                var buffers = {};
                var metas = mesh.getAttribMeta();
                setAttributes(program.attribSetters, buffers, metas);
                // attributes
                var attributeLocations = program.attributeLocations;
                for (var name in attributeLocations) {
                    var thing = mesh.getAttribArray(name);
                    if (thing) {
                        attributeLocations[name].bufferData(thing.data, thing.usage);
                    }
                    else {
                        // We expect this to be detected long before we get here.
                        throw new Error("mesh implementation claims to support, but does not provide data for, attribute " + name);
                    }
                }
                // elements
                elements.bufferData(mesh);
                setUniforms(program.uniformSetters, model.getUniformData());
                for (var name in attributeLocations) {
                    var attribLocation = attributeLocations[name];
                    attribLocation.enable();
                    var attribute = findAttribMetaInfoByVariableName(attribLocation.name, mesh.getAttribMeta());
                    if (attribute) {
                        var size = attribute.size;
                        var type = context.FLOAT; //attribute.dataType;
                        var normalized = attribute.normalized;
                        var stride = attribute.stride;
                        var offset = attribute.offset;
                        attribLocation.dataFormat(size, type, normalized, stride, offset);
                    }
                    else {
                        throw new Error("The mesh does not support the attribute variable named " + attribLocation.name);
                    }
                }
                elements.bind();
                mesh.draw(context);
                for (var name in attributeLocations) {
                    var attribLocation = attributeLocations[name];
                    attribLocation.disable();
                }
            }
        };
        if (!mesh.dynamic) {
            mesh.update();
        }
        return self;
    };
    return primitive;
});

define('davinci-eight/core/ShaderAttribLocation',["require", "exports", '../core/convertUsage', '../checks/expectArg'], function (require, exports, convertUsage, expectArg) {
    function existsLocation(location) {
        return location >= 0;
    }
    /**
     * Utility class for managing a shader attribute variable.
     * While this class may be created directly by the user, it is preferable
     * to use the ShaderAttribLocation instances managed by the ShaderProgram because
     * there will be improved integrity and context loss management.
     * @class ShaderAttribLocation.
     */
    var ShaderAttribLocation = (function () {
        /**
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * @class ShaderAttribLocation
         * @constructor
         * @param name {string} The name of the variable as it appears in the GLSL program.
         * @param glslType {string} The type of the variable as it appears in the GLSL program.
         */
        function ShaderAttribLocation(name, glslType) {
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
                    throw new Error("Argument glslType in ShaderAttribLocation constructor must be one of float, vec2, vec3, vec4, mat2, mat3, mat4. Got: " + glslType);
                }
            }
        }
        Object.defineProperty(ShaderAttribLocation.prototype, "name", {
            get: function () {
                return this.$name;
            },
            enumerable: true,
            configurable: true
        });
        ShaderAttribLocation.prototype.contextFree = function () {
            if (this.buffer) {
                this.context.deleteBuffer(this.buffer);
                this.contextLoss();
            }
        };
        ShaderAttribLocation.prototype.contextGain = function (context, program, contextId) {
            expectArg('context', context).toBeObject();
            expectArg('program', program).toBeObject();
            this.location = context.getAttribLocation(program, this.name);
            this.context = context;
            if (existsLocation(this.location)) {
                this.buffer = context.createBuffer();
            }
        };
        ShaderAttribLocation.prototype.contextLoss = function () {
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
        ShaderAttribLocation.prototype.dataFormat = function (size, type, normalized, stride, offset) {
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
         * FIXME This should not couple to an AttribProvider.
         * @method bufferData
         */
        ShaderAttribLocation.prototype.bufferData = function (data, usage) {
            if (existsLocation(this.location)) {
                this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
                this.context.bufferData(this.context.ARRAY_BUFFER, data, convertUsage(usage, this.context));
            }
        };
        ShaderAttribLocation.prototype.enable = function () {
            if (existsLocation(this.location)) {
                this.context.enableVertexAttribArray(this.location);
            }
        };
        ShaderAttribLocation.prototype.disable = function () {
            if (existsLocation(this.location)) {
                this.context.disableVertexAttribArray(this.location);
            }
        };
        /**
         * @method toString
         */
        ShaderAttribLocation.prototype.toString = function () {
            return ["ShaderAttribLocation({name: ", this.name, ", glslType: ", this.$glslType + "})"].join('');
        };
        return ShaderAttribLocation;
    })();
    return ShaderAttribLocation;
});

define('davinci-eight/core/ShaderUniformLocation',["require", "exports"], function (require, exports) {
    /**
     * Returns the corresponding bind point for a given sampler type
     */
    function getBindPointForSamplerType(gl, type) {
        if (type === gl.SAMPLER_2D)
            return gl.TEXTURE_2D;
        if (type === gl.SAMPLER_CUBE)
            return gl.TEXTURE_CUBE_MAP;
    }
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
         * @param contextId {string}
         */
        ShaderUniformLocation.prototype.contextGain = function (context, program, contextId) {
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
        ShaderUniformLocation.prototype.createSetter = function (gl, uniformInfo) {
            var uniformLoc = this;
            var name = uniformInfo.name;
            var size = uniformInfo.size;
            var type = uniformInfo.type;
            var isArray = (size > 1 && name.substr(-3) === "[0]");
            if (type === gl.FLOAT && isArray) {
                return function (data) {
                    uniformLoc.uniform1fv(data.vector);
                };
            }
            if (type === gl.FLOAT) {
                return function (data) {
                    uniformLoc.uniform1f(data.x);
                };
            }
            if (type === gl.FLOAT_VEC2) {
                return function (data) {
                    uniformLoc.uniform2fv(data.vector);
                };
            }
            if (type === gl.FLOAT_VEC3) {
                return function (data) {
                    uniformLoc.uniform3fv(data.vector);
                };
            }
            if (type === gl.FLOAT_VEC4) {
                return function (data) {
                    uniformLoc.uniform4fv(data.vector);
                };
            }
            /*
            if (type === gl.INT && isArray) {
              return function(data: UniformDataInfo) {
                gl.uniform1iv(location, data.uniformZs);
              };
            }
            if (type === gl.INT) {
              return function(data: UniformDataInfo) {
                gl.uniform1i(location, data.x);
              };
            }
            if (type === gl.INT_VEC2) {
              return function(data: UniformDataInfo) {
                gl.uniform2iv(location, data.uniformZs);
              };
            }
            if (type === gl.INT_VEC3) {
              return function(data: UniformDataInfo) {
                gl.uniform3iv(location, data.uniformZs);
              };
            }
            if (type === gl.INT_VEC4) {
              return function(data: UniformDataInfo) {
                gl.uniform4iv(location, data.uniformZs);
              };
            }
            if (type === gl.BOOL) {
              return function(data: UniformDataInfo) {
                gl.uniform1iv(location, data.uniformZs);
              };
            }
            if (type === gl.BOOL_VEC2) {
              return function(data: UniformDataInfo) {
                gl.uniform2iv(location, data.uniformZs);
              };
            }
            if (type === gl.BOOL_VEC3) {
              return function(data: UniformDataInfo) {
                gl.uniform3iv(location, data.uniformZs);
              };
            }
            if (type === gl.BOOL_VEC4) {
              return function(data: UniformDataInfo) {
                gl.uniform4iv(location, data.uniformZs);
              };
            }
            */
            if (type === gl.FLOAT_MAT2) {
                return function (data) {
                    uniformLoc.uniformMatrix2fv(data.transpose, data.matrix2);
                };
            }
            if (type === gl.FLOAT_MAT3) {
                return function (data) {
                    uniformLoc.uniformMatrix3fv(data.transpose, data.matrix3);
                };
            }
            if (type === gl.FLOAT_MAT4) {
                return function (data) {
                    uniformLoc.uniformMatrix4fv(data.transpose, data.matrix4);
                };
            }
            /*
            if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
              var units: number[] = [];
              for (var ii = 0; ii < uniformInfo.size; ++ii) { // BUG fixed info
                units.push(textureUnit++);
              }
              return function(bindPoint, units) {
                return function(textures) {
                  gl.uniform1iv(location, units);
                  textures.forEach(function(texture, index) {
                    gl.activeTexture(gl.TEXTURE0 + units[index]);
                    gl.bindTexture(bindPoint, texture);
                  });
                };
              }(getBindPointForSamplerType(gl, type), units);
            }
            if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
              return function(bindPoint, unit) {
                return function(texture) {
                  gl.uniform1i(location, unit);
                  gl.activeTexture(gl.TEXTURE0 + unit);
                  gl.bindTexture(bindPoint, texture);
                };
              }(getBindPointForSamplerType(gl, type), textureUnit++);
            }
            */
            throw ("unknown type: 0x" + type.toString(16)); // we should never get here.
        };
        /**
         * @method uniform1f
         * @param value {number} Value to assign.
         */
        ShaderUniformLocation.prototype.uniform1f = function (value) {
            this.context.uniform1f(this.location, value);
        };
        /**
         * @method uniform1fv
         * @param data {number[]}
         */
        ShaderUniformLocation.prototype.uniform1fv = function (data) {
            this.context.uniform1fv(this.location, data);
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
         * @method uniform3f
         * @param x {number} Horizontal value to assign.
         * @param y {number} Vertical number to assign.
         * @param z {number}
         */
        ShaderUniformLocation.prototype.uniform3f = function (x, y, z) {
            this.context.uniform3f(this.location, x, y, z);
        };
        /**
         * @method uniform3fv
         * @param data {number[]}
         */
        ShaderUniformLocation.prototype.uniform3fv = function (data) {
            this.context.uniform3fv(this.location, data);
        };
        /**
         * @method uniform3f
         * @param x {number} Horizontal value to assign.
         * @param y {number} Vertical number to assign.
         * @param z {number}
         * @param w {number}
         */
        ShaderUniformLocation.prototype.uniform4f = function (x, y, z, w) {
            this.context.uniform4f(this.location, x, y, z, w);
        };
        /**
         * @method uniform4fv
         * @param data {number[]}
         */
        ShaderUniformLocation.prototype.uniform4fv = function (data) {
            this.context.uniform4fv(this.location, data);
        };
        /**
         * @method uniformMatrix2fv
         * @param transpose {boolean}
         * @param matrix {Float32Array}
         */
        ShaderUniformLocation.prototype.uniformMatrix2fv = function (transpose, matrix) {
            if (!(matrix instanceof Float32Array)) {
                throw new Error("matrix must be a Float32Array.");
            }
            this.context.uniformMatrix2fv(this.location, transpose, matrix);
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

define('davinci-eight/drawLists/scene',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    var scene = function () {
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
                    var groupName = drawable.program.programId;
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
            add: function (drawable) {
                drawables.push(drawable);
            },
            remove: function (drawable) {
                var index = drawables.indexOf(drawable);
                if (index >= 0) {
                    drawables.splice(index, 1);
                }
            }
        };
        return publicAPI;
    };
    return scene;
});

define('davinci-eight/math/Sphere',["require", "exports", '../math/Vector3'], function (require, exports, Vector3) {
    var Sphere = (function () {
        function Sphere(center, radius) {
            this.center = (center !== undefined) ? center : new Vector3([0, 0, 0]);
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
        /**
         * Ensures that the normal property of each face is assigned
         * a value equal to the normalized cross product of two edge vectors
         * taken counter-clockwise. This pseudo vector is then taken to face outwards by convention.
         * @method computeFaceNormals
         */
        // TODO: What would happen if we computed unit tangent spinors?
        // Would such elements of the geometry be better behaved than pseudo vectors?
        Geometry.prototype.computeFaceNormals = function () {
            // Avoid  the this pointer in forEach callback function.
            var vertices = this.vertices;
            var computeFaceNormal = function (face) {
                face.normals = [];
                var vA = vertices[face.a];
                var vB = vertices[face.b];
                var vC = vertices[face.c];
                var cb = new Vector3().subVectors(vC, vB);
                var ab = new Vector3().subVectors(vA, vB);
                var normal = new Vector3().crossVectors(cb, ab).normalize();
                face.normals.push(normal);
                face.normals.push(normal);
                face.normals.push(normal);
            };
            this.faces.forEach(computeFaceNormal);
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
                    vertexNormals[face.a].add(face.normals[0]);
                    vertexNormals[face.b].add(face.normals[0]);
                    vertexNormals[face.c].add(face.normals[0]);
                }
            }
            for (v = 0, vl = this.vertices.length; v < vl; v++) {
                vertexNormals[v].normalize();
            }
            for (f = 0, fl = this.faces.length; f < fl; f++) {
                face = this.faces[f];
                face.normals[0] = vertexNormals[face.a].clone();
                face.normals[1] = vertexNormals[face.b].clone();
                face.normals[2] = vertexNormals[face.c].clone();
            }
        };
        Geometry.prototype.mergeVertices = function () {
            /**
             * Hashmap for looking up vertice by position coordinates (and making sure they are unique).
             * key is constructed from coordinates, value is index in vertices array.
             */
            var verticesMap = {};
            /**
             * The list of unique vertices.
             */
            var unique = [];
            /**
             * Index is original index in vertices. Entry is index in unique array.
             */
            var changes = [];
            var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
            var precision = Math.pow(10, precisionPoints);
            var i;
            var il;
            var indices, j, jl;
            for (i = 0, il = this.vertices.length; i < il; i++) {
                var v = this.vertices[i];
                var key = Math.round(v.x * precision) + '_' + Math.round(v.y * precision) + '_' + Math.round(v.z * precision);
                if (verticesMap[key] === void 0) {
                    verticesMap[key] = i;
                    unique.push(this.vertices[i]);
                    changes[i] = unique.length - 1;
                }
                else {
                    changes[i] = changes[verticesMap[key]];
                }
            }
            // if faces are completely degenerate after merging vertices, we
            // have to remove them.
            var faceIndicesToRemove = [];
            // Update the faces to use the unique indices.
            for (i = 0, il = this.faces.length; i < il; i++) {
                var face = this.faces[i];
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

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/GeometryAdapter',["require", "exports", '../core/Line3', '../core/Point3', '../core/Color', '../core/Symbolic', '../core/DefaultAttribProvider', '../core/DataUsage', '../core/DrawMode'], function (require, exports, Line3, Point3, Color, Symbolic, DefaultAttribProvider, DataUsage, DrawMode) {
    function defaultColorFunction(vertexIndex, face, vertexList) {
        return new Color([1.0, 1.0, 1.0]);
    }
    /**
     * Adapter from a Geometry to a AttribProvider.
     * Enables the rapid construction of meshes starting from classes that extend Geometry.
     * Automatically uses elements (vertex indices).
     * @class GeometryAdapter
     * @extends VertexAttributeProivider
     */
    var GeometryAdapter = (function (_super) {
        __extends(GeometryAdapter, _super);
        /**
         * @class GeometryAdapter
         * @constructor
         * @param geometry {Geometry} The geometry that must be adapted to a AttribProvider.
         */
        function GeometryAdapter(geometry, options) {
            _super.call(this);
            this.$drawMode = DrawMode.TRIANGLES;
            this.elementsUsage = DataUsage.STREAM_DRAW;
            this.grayScale = false;
            this.lines = [];
            this.points = [];
            options = options || {};
            options.drawMode = typeof options.drawMode !== 'undefined' ? options.drawMode : DrawMode.TRIANGLES;
            options.elementsUsage = typeof options.elementsUsage !== 'undefined' ? options.elementsUsage : DataUsage.STREAM_DRAW;
            this.positionVarName = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
            this.normalVarName = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
            this.geometry = geometry;
            //  this.color = new Color([1.0, 1.0, 1.0]);
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
        GeometryAdapter.prototype.hasElementArray = function () {
            return true;
        };
        GeometryAdapter.prototype.getElementArray = function () {
            return { usage: this.elementsUsage, data: this.elementArray };
        };
        GeometryAdapter.prototype.getAttribArray = function (name) {
            // FIXME: Need to inject usage for each array type.
            switch (name) {
                case this.positionVarName: {
                    return { usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexPositionArray };
                }
                //      case DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME: {
                //        return {usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexColorArray };
                //      }
                case this.normalVarName: {
                    if (this.$drawMode === DrawMode.TRIANGLES) {
                        return { usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexNormalArray };
                    }
                    else {
                        return;
                    }
                }
                default: {
                    return;
                }
            }
        };
        GeometryAdapter.prototype.getAttribMeta = function () {
            var attribues = {};
            attribues[Symbolic.ATTRIBUTE_POSITION] = {
                name: this.positionVarName,
                glslType: 'vec3',
                size: 3,
                normalized: false,
                stride: 0,
                offset: 0
            };
            /*
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
            */
            if (this.drawMode === DrawMode.TRIANGLES) {
                attribues[Symbolic.ATTRIBUTE_NORMAL] = {
                    name: this.normalVarName,
                    glslType: 'vec3',
                    size: 3,
                    normalized: false,
                    stride: 0,
                    offset: 0
                };
            }
            return attribues;
        };
        GeometryAdapter.prototype.update = function () {
            var vertices = [];
            //  let colors: number[] = [];
            var normals = [];
            var elements = [];
            var vertexList = this.geometry.vertices;
            /*
            let color = this.color;
            let colorFunction = this.colorFunction;
            let colorMaker = function(vertexIndex: number, face: Face3, vertexList: Vector3[]): Color
            {
              if (color)
              {
                return color;
              }
              else if (colorFunction)
              {
                return colorFunction(vertexIndex, face, vertexList);
              }
              else
              {
                return defaultColorFunction(vertexIndex, face, vertexList);
              }
            }
            */
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
                            /*
                            var colorA: Color = color;
                            colors.push(colorA.red);
                            colors.push(colorA.green);
                            colors.push(colorA.blue);
                            colors.push(1.0);
                            */
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
                            /*
                            var colorA: Color = color;
                            var colorB: Color = color;
                            colors.push(colorA.red);
                            colors.push(colorA.green);
                            colors.push(colorA.blue);
                            colors.push(1.0);
                  
                            colors.push(colorB.red);
                            colors.push(colorB.green);
                            colors.push(colorB.blue);
                            colors.push(1.0);
                            */
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
                            // TODO: 3 means per-vertex, 1 means same per face, 0 means compute face normals?
                            if (face.normals.length === 3) {
                                var nA = face.normals[0];
                                var nB = face.normals[1];
                                var nC = face.normals[2];
                                normals.push(nA.x);
                                normals.push(nA.y);
                                normals.push(nA.z);
                                normals.push(nB.x);
                                normals.push(nB.y);
                                normals.push(nB.z);
                                normals.push(nC.x);
                                normals.push(nC.y);
                                normals.push(nC.z);
                            }
                            else if (face.normals.length === 1) {
                                var normal = face.normals[0];
                                normals.push(normal.x);
                                normals.push(normal.y);
                                normals.push(normal.z);
                                normals.push(normal.x);
                                normals.push(normal.y);
                                normals.push(normal.z);
                                normals.push(normal.x);
                                normals.push(normal.y);
                                normals.push(normal.z);
                            }
                            /*
                            var colorA: Color = colorMaker(face.a, face, vertexList);
                            var colorB: Color = colorMaker(face.b, face, vertexList);
                            var colorC: Color = colorMaker(face.c, face, vertexList);
                  
                            colors.push(colorA.red);
                            colors.push(colorA.green);
                            colors.push(colorA.blue);
                            colors.push(1.0);
                  
                            colors.push(colorB.red);
                            colors.push(colorB.green);
                            colors.push(colorB.blue);
                            colors.push(1.0);
                  
                            colors.push(colorC.red);
                            colors.push(colorC.green);
                            colors.push(colorC.blue);
                            colors.push(1.0);
                            */
                        });
                    }
                    break;
                default: {
                }
            }
            this.elementArray = new Uint16Array(elements);
            this.aVertexPositionArray = new Float32Array(vertices);
            //  this.aVertexColorArray = new Float32Array(colors);
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
    })(DefaultAttribProvider);
    return GeometryAdapter;
});

define('davinci-eight/math/Spinor3',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    /**
     * @class Spinor3
     */
    var Spinor3 = (function () {
        function Spinor3(data) {
            if (data === void 0) { data = [0, 0, 0, 1]; }
            this.data = data;
            this.modified = false;
        }
        Object.defineProperty(Spinor3.prototype, "data", {
            get: function () {
                if (this.$data) {
                    return this.$data;
                }
                else if (this.$callback) {
                    var data = this.$callback();
                    expectArg('callback()', data).toSatisfy(data.length === 4, "callback() length must be 4");
                    return this.$callback();
                }
                else {
                    throw new Error("Vector3 is undefined.");
                }
            },
            set: function (data) {
                expectArg('data', data).toSatisfy(data.length === 4, "data length must be 4");
                this.$data = data;
                this.$callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "callback", {
            get: function () {
                return this.$callback;
            },
            set: function (reactTo) {
                this.$callback = reactTo;
                this.$data = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "yz", {
            /**
             * @property yz
             * @type Number
             */
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.modified = this.modified || this.yz !== value;
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "zx", {
            /**
             * @property zx
             * @type Number
             */
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.modified = this.modified || this.zx !== value;
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "xy", {
            /**
             * @property xy
             * @type Number
             */
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.modified = this.modified || this.xy !== value;
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "w", {
            /**
             * @property w
             * @type Number
             */
            get: function () {
                return this.data[3];
            },
            set: function (value) {
                this.modified = this.modified || this.w !== value;
                this.data[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Spinor3.prototype.clone = function () {
            return new Spinor3([this.yz, this.zx, this.xy, this.w]);
        };
        Spinor3.prototype.copy = function (spinor) {
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            this.xy = spinor.xy;
            this.w = spinor.w;
            return this;
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

define('davinci-eight/math/Vector2',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    /**
     * @class Vector2
     */
    var Vector2 = (function () {
        /**
         * @class Vector2
         * @constructor
         * @param data {number[]}
         */
        function Vector2(data) {
            if (data === void 0) { data = [0, 0]; }
            this.data = data;
            this.modified = false;
        }
        Object.defineProperty(Vector2.prototype, "data", {
            get: function () {
                if (this.$data) {
                    return this.$data;
                }
                else if (this.$callback) {
                    var data = this.$callback();
                    expectArg('callback()', data).toSatisfy(data.length === 2, "callback() length must be 2");
                    return this.$callback();
                }
                else {
                    throw new Error("Vector2 is undefined.");
                }
            },
            set: function (data) {
                expectArg('data', data).toSatisfy(data.length === 2, "data length must be 2");
                this.$data = data;
                this.$callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "callback", {
            get: function () {
                return this.$callback;
            },
            set: function (reactTo) {
                this.$callback = reactTo;
                this.$data = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
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
        Vector2.prototype.distanceTo = function (position) {
            return Math.sqrt(this.quadranceTo(position));
        };
        Vector2.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        Vector2.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        Vector2.prototype.normalize = function () {
            return this.divideScalar(this.magnitude());
        };
        Vector2.prototype.quaditude = function () {
            return this.x * this.x + this.y * this.y;
        };
        Vector2.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            var dy = this.y - position.y;
            return dx * dx + dy * dy;
        };
        Vector2.prototype.setMagnitude = function (l) {
            var oldLength = this.magnitude();
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
            return new Vector2([this.x, this.y]);
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
                var rotor = new Spinor3([generator.yz * sinHA, generator.zx * sinHA, generator.xy * sinHA, cosHA]);
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
                        new Vector2([u0, v0]),
                        new Vector2([u1, v0]),
                        new Vector2([u0, v1])
                    ]);
                    this.faces.push(new Face3(d, c, b));
                    this.faceVertexUvs[0].push([
                        new Vector2([u1, v0]),
                        new Vector2([u1, v1]),
                        new Vector2([u0, v1])
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
                    return new Vector3([point[i], point[j], point[k]]);
                });
                var generator = new Spinor3([direction.x, direction.y, direction.z, 0]);
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
define('davinci-eight/geometries/BarnGeometry',["require", "exports", '../geometries/Geometry', '../core/Face3', '../math/Vector3'], function (require, exports, Geometry, Face3, Vector3) {
    /**
     * The basic barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
     * @class BarnGeometry
     */
    var BarnGeometry = (function (_super) {
        __extends(BarnGeometry, _super);
        function BarnGeometry() {
            _super.call(this);
            var vertexList = this.vertices;
            function vertex(x, y, z) {
                vertexList.push(new Vector3([x, y, z]));
            }
            vertex(-0.5, 0.0, -1.0);
            this.vertices.push(new Vector3([0.5, 0.0, -1.0]));
            this.vertices.push(new Vector3([0.5, 1.0, -1.0]));
            this.vertices.push(new Vector3([0.0, 1.5, -1.0]));
            this.vertices.push(new Vector3([-0.5, 1.0, -1.0]));
            this.vertices.push(new Vector3([-0.5, 0.0, 1.0]));
            this.vertices.push(new Vector3([0.5, 0.0, 1.0]));
            this.vertices.push(new Vector3([0.5, 1.0, 1.0]));
            this.vertices.push(new Vector3([0.0, 1.5, 1.0]));
            this.vertices.push(new Vector3([-0.5, 1.0, 1.0]));
            this.faces.push(new Face3(1, 0, 2));
            this.faces.push(new Face3(2, 0, 4));
            this.faces.push(new Face3(2, 4, 3));
            this.faces.push(new Face3(5, 6, 7));
            this.faces.push(new Face3(5, 7, 9));
            this.faces.push(new Face3(9, 7, 8));
            this.faces.push(new Face3(6, 1, 2));
            this.faces.push(new Face3(6, 2, 7));
            this.faces.push(new Face3(9, 0, 5));
            this.faces.push(new Face3(9, 4, 0));
            this.faces.push(new Face3(8, 3, 4));
            this.faces.push(new Face3(8, 4, 9));
            this.faces.push(new Face3(7, 2, 3));
            this.faces.push(new Face3(7, 3, 8));
            this.faces.push(new Face3(5, 0, 1));
            this.faces.push(new Face3(5, 1, 6));
            this.computeFaceNormals();
        }
        return BarnGeometry;
    })(Geometry);
    return BarnGeometry;
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
        function BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments, wireFrame) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (depth === void 0) { depth = 1; }
            if (widthSegments === void 0) { widthSegments = 1; }
            if (heightSegments === void 0) { heightSegments = 1; }
            if (depthSegments === void 0) { depthSegments = 1; }
            if (wireFrame === void 0) { wireFrame = false; }
            _super.call(this);
            var width_half = width / 2;
            var height_half = height / 2;
            var depth_half = depth / 2;
            buildPlane('z', 'y', -1, -1, depth, height, +width_half, 0, this); // px
            buildPlane('z', 'y', +1, -1, depth, height, -width_half, 1, this); // nx
            buildPlane('x', 'z', +1, +1, width, depth, +height_half, 2, this); // py
            buildPlane('x', 'z', +1, -1, width, depth, -height_half, 3, this); // ny
            buildPlane('x', 'y', +1, -1, width, height, +depth_half, 4, this); // pz
            buildPlane('x', 'y', -1, -1, width, height, -depth_half, 5, this); // nz
            function buildPlane(u, v, udir, vdir, width, height, depth, unused, scope) {
                var w;
                var ix;
                var iy;
                var gridX = widthSegments;
                var gridY = heightSegments;
                var width_half = width / 2;
                var height_half = height / 2;
                var offset = scope.vertices.length;
                if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x')) {
                    w = 'z';
                }
                else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {
                    w = 'y';
                    gridY = depthSegments;
                }
                else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {
                    w = 'x';
                    gridX = depthSegments;
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
                        var uva = new Vector2([ix / gridX, 1 - iy / gridY]);
                        var uvb = new Vector2([ix / gridX, 1 - (iy + 1) / gridY]);
                        var uvc = new Vector2([(ix + 1) / gridX, 1 - (iy + 1) / gridY]);
                        var uvd = new Vector2([(ix + 1) / gridX, 1 - iy / gridY]);
                        var face = new Face3(a + offset, b + offset, d + offset);
                        face.normals.push(normal);
                        scope.faces.push(face);
                        scope.faceVertexUvs[0].push([uva, uvb, uvd]);
                        face = new Face3(b + offset, c + offset, d + offset);
                        face.normals.push(normal);
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
            if (radiusTop === void 0) { radiusTop = 1; }
            if (radiusBottom === void 0) { radiusBottom = 1; }
            if (height === void 0) { height = 1; }
            if (radialSegments === void 0) { radialSegments = 16; }
            if (heightSegments === void 0) { heightSegments = 1; }
            if (openEnded === void 0) { openEnded = false; }
            if (thetaStart === void 0) { thetaStart = 0; }
            if (thetaLength === void 0) { thetaLength = 2 * Math.PI; }
            radialSegments = Math.max(radialSegments, 3);
            heightSegments = Math.max(heightSegments, 1);
            _super.call(this);
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
                    uvsRow.push(new Vector2([u, 1 - v]));
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
            if (!openEnded && radiusTop > 0) {
                this.vertices.push(Vector3.e2.clone().multiplyScalar(heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[0][x];
                    var v2 = vertices[0][x + 1];
                    var v3 = this.vertices.length - 1;
                    var n1 = Vector3.e2.clone();
                    var n2 = Vector3.e2.clone();
                    var n3 = Vector3.e2.clone();
                    var uv1 = uvs[0][x].clone();
                    var uv2 = uvs[0][x + 1].clone();
                    var uv3 = new Vector2([uv2.x, 0]);
                    this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
                    this.faceVertexUvs[0].push([uv1, uv2, uv3]);
                }
            }
            // bottom cap
            if (!openEnded && radiusBottom > 0) {
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
                    var uv3 = new Vector2([uv2.x, 1]);
                    this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
                    this.faceVertexUvs[0].push([uv1, uv2, uv3]);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
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
                prepare(new Vector3([vertices[i], vertices[i + 1], vertices[i + 2]]));
            }
            var p = this.vertices;
            var faces = [];
            for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
                var v1 = p[indices[i]];
                var v2 = p[indices[i + 1]];
                var v3 = p[indices[i + 2]];
                faces[j] = new Face3(v1['index'], v2['index'], v3['index'], [v1.clone(), v2.clone(), v3.clone()]);
            }
            var centroid = new Vector3([0, 0, 0]);
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
            this.boundingSphere = new Sphere(new Vector3([0, 0, 0]), radius);
            // Project vector onto sphere's surface
            function prepare(vector) {
                var vertex = vector.normalize().clone();
                vertex['index'] = that.vertices.push(vertex) - 1;
                // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
                var u = azimuth(vector) / 2 / Math.PI + 0.5;
                var v = inclination(vector) / Math.PI + 0.5;
                vertex['uv'] = new Vector2([u, 1 - v]);
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
                    uv = new Vector2([uv.x - 1, uv.y]);
                if ((vector.x === 0) && (vector.z === 0))
                    uv = new Vector2([azimuth / 2 / Math.PI + 0.5, uv.y]);
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

define('davinci-blade/NotImplementedError',["require", "exports"], function (require, exports) {
    function NotImplementedError(message) {
        this.name = 'NotImplementedError';
        this.message = (message || "");
    }
    NotImplementedError.prototype = new Error();
    return NotImplementedError;
});

define('davinci-blade/Rational',["require", "exports", 'davinci-blade/Unit'], function (require, exports, Unit) {
    function RationalError(message) {
        this.name = 'RationalError';
        this.message = (message || "");
    }
    RationalError.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new RationalError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof Rational) {
            return arg;
        }
        else {
            throw new RationalError("Argument '" + arg + "' must be a Rational");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new RationalError("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    var Rational = (function () {
        /**
         * The Rational class represents a rational number.
         *
         * @class Rational
         * @extends Field
         * @constructor
         * @param {number} n The numerator.
         * @param {number} d The denominator.
         */
        function Rational(n, d) {
            assertArgNumber('n', n);
            assertArgNumber('d', d);
            var g;
            var gcd = function (a, b) {
                assertArgNumber('a', a);
                assertArgNumber('b', b);
                var temp;
                if (a < 0) {
                    a = -a;
                }
                if (b < 0) {
                    b = -b;
                }
                if (b > a) {
                    temp = a;
                    a = b;
                    b = temp;
                }
                while (true) {
                    a %= b;
                    if (a === 0) {
                        return b;
                    }
                    b %= a;
                    if (b === 0) {
                        return a;
                    }
                }
            };
            if (d === 0) {
                throw new Error("denominator must not be zero");
            }
            if (n === 0) {
                g = 1;
            }
            else {
                g = gcd(Math.abs(n), Math.abs(d));
            }
            if (d < 0) {
                n = -n;
                d = -d;
            }
            this._numer = n / g;
            this._denom = d / g;
        }
        Object.defineProperty(Rational.prototype, "numer", {
            get: function () {
                return this._numer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rational.prototype, "denom", {
            get: function () {
                return this._denom;
            },
            enumerable: true,
            configurable: true
        });
        Rational.prototype.add = function (rhs) {
            assertArgRational('rhs', rhs);
            return new Rational(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        Rational.prototype.sub = function (rhs) {
            assertArgRational('rhs', rhs);
            return new Rational(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        Rational.prototype.mul = function (rhs) {
            assertArgRational('rhs', rhs);
            return new Rational(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        // TODO: div testing
        Rational.prototype.div = function (rhs) {
            if (typeof rhs === 'number') {
                return new Rational(this._numer, this._denom * rhs);
            }
            else {
                return new Rational(this._numer * rhs._denom, this._denom * rhs._numer);
            }
        };
        Rational.prototype.isZero = function () {
            return this._numer === 0;
        };
        Rational.prototype.negative = function () {
            return new Rational(-this._numer, this._denom);
        };
        Rational.prototype.equals = function (other) {
            if (other instanceof Rational) {
                return this._numer * other._denom === this._denom * other._numer;
            }
            else {
                return false;
            }
        };
        Rational.prototype.toString = function () {
            return "" + this._numer + "/" + this._denom;
        };
        Rational.ONE = new Rational(1, 1);
        Rational.TWO = new Rational(2, 1);
        Rational.MINUS_ONE = new Rational(-1, 1);
        Rational.ZERO = new Rational(0, 1);
        return Rational;
    })();
    return Rational;
});

define('davinci-blade/Dimensions',["require", "exports", 'davinci-blade/Rational'], function (require, exports, Rational) {
    function DimensionError(message) {
        this.name = 'DimensionError';
        this.message = (message || "");
    }
    DimensionError.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new DimensionError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgDimensions(name, arg) {
        if (arg instanceof Dimensions) {
            return arg;
        }
        else {
            throw new DimensionError("Argument '" + arg + "' must be a Dimensions");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof Rational) {
            return arg;
        }
        else {
            throw new DimensionError("Argument '" + arg + "' must be a Rational");
        }
    }
    var Dimensions = (function () {
        /**
         * The Dimensions class captures the physical dimensions associated with a unit of measure.
         *
         * @class Dimensions
         * @constructor
         * @param {Rational} mass The mass component of the dimensions object.
         * @param {Rational} length The length component of the dimensions object.
         * @param {Rational} time The time component of the dimensions object.
         * @param {Rational} charge The charge component of the dimensions object.
         * @param {Rational} temperature The temperature component of the dimensions object.
         * @param {Rational} amount The amount component of the dimensions object.
         * @param {Rational} intensity The intensity component of the dimensions object.
         */
        function Dimensions(theMass, L, T, Q, temperature, amount, intensity) {
            this.L = L;
            this.T = T;
            this.Q = Q;
            this.temperature = temperature;
            this.amount = amount;
            this.intensity = intensity;
            var length = L;
            var time = T;
            var charge = Q;
            if (arguments.length !== 7) {
                throw {
                    name: "DimensionError",
                    message: "Expecting 7 arguments"
                };
            }
            if (typeof theMass === 'number') {
                this._mass = new Rational(theMass, 1);
            }
            else if (theMass instanceof Rational) {
                this._mass = theMass;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "mass must be a Rational or number"
                };
            }
            if (typeof length === 'number') {
                this.L = new Rational(length, 1);
            }
            else if (length instanceof Rational) {
                this.L = length;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "length must be a Rational or number"
                };
            }
            if (typeof time === 'number') {
                this.T = new Rational(time, 1);
            }
            else if (time instanceof Rational) {
                this.T = time;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "time must be a Rational or number"
                };
            }
            if (typeof charge === 'number') {
                this.Q = new Rational(charge, 1);
            }
            else if (charge instanceof Rational) {
                this.Q = charge;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "charge must be a Rational or number"
                };
            }
            if (typeof temperature === 'number') {
                this.temperature = new Rational(temperature, 1);
            }
            else if (temperature instanceof Rational) {
                this.temperature = temperature;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "(thermodynamic) temperature must be a Rational or number"
                };
            }
            if (typeof amount === 'number') {
                this.amount = new Rational(amount, 1);
            }
            else if (amount instanceof Rational) {
                this.amount = amount;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "amount (of substance) must be a Rational or number"
                };
            }
            if (typeof intensity === 'number') {
                this.intensity = new Rational(intensity, 1);
            }
            else if (intensity instanceof Rational) {
                this.intensity = intensity;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "(luminous) intensity must be a Rational or number"
                };
            }
        }
        Object.defineProperty(Dimensions.prototype, "M", {
            /**
            * The <em>mass</em> component of this dimensions instance.
            *
            * @property M
            * @type {Rational}
            */
            get: function () {
                return this._mass;
            },
            enumerable: true,
            configurable: true
        });
        Dimensions.prototype.compatible = function (rhs) {
            if (this._mass.equals(rhs._mass) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
                return this;
            }
            else {
                throw new DimensionError("Dimensions must be equal (" + this + ", " + rhs + ")");
            }
        };
        Dimensions.prototype.mul = function (rhs) {
            return new Dimensions(this._mass.add(rhs._mass), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        Dimensions.prototype.div = function (rhs) {
            return new Dimensions(this._mass.sub(rhs._mass), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        Dimensions.prototype.pow = function (exponent) {
            return new Dimensions(this._mass.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        Dimensions.prototype.sqrt = function () {
            return new Dimensions(this._mass.div(Rational.TWO), this.L.div(Rational.TWO), this.T.div(Rational.TWO), this.Q.div(Rational.TWO), this.temperature.div(Rational.TWO), this.amount.div(Rational.TWO), this.intensity.div(Rational.TWO));
        };
        Dimensions.prototype.dimensionless = function () {
            return this._mass.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        /**
        * Determines whether all the components of the Dimensions instance are zero.
        *
        * @method isZero
        * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
        */
        Dimensions.prototype.isZero = function () {
            return this._mass.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        Dimensions.prototype.negative = function () {
            return new Dimensions(this._mass.negative(), this.L.negative(), this.T.negative(), this.Q.negative(), this.temperature.negative(), this.amount.negative(), this.intensity.negative());
        };
        Dimensions.prototype.toString = function () {
            var stringify = function (rational, label) {
                if (rational.numer === 0) {
                    return null;
                }
                else if (rational.denom === 1) {
                    if (rational.numer === 1) {
                        return "" + label;
                    }
                    else {
                        return "" + label + " ** " + rational.numer;
                    }
                }
                return "" + label + " ** " + rational;
            };
            return [stringify(this._mass, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
                return typeof x === 'string';
            }).join(" * ");
        };
        return Dimensions;
    })();
    return Dimensions;
});

define('davinci-blade/Unit',["require", "exports", 'davinci-blade/Dimensions', 'davinci-blade/Rational'], function (require, exports, Dimensions, Rational) {
    function UnitError(message) {
        this.name = 'UnitError';
        this.message = (message || "");
    }
    UnitError.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new UnitError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgDimensions(name, arg) {
        if (arg instanceof Dimensions) {
            return arg;
        }
        else {
            throw new UnitError("Argument '" + arg + "' must be a Dimensions");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof Rational) {
            return arg;
        }
        else {
            throw new UnitError("Argument '" + arg + "' must be a Rational");
        }
    }
    function assertArgUnit(name, arg) {
        if (arg instanceof Unit) {
            return arg;
        }
        else {
            throw new UnitError("Argument '" + arg + "' must be a Unit");
        }
    }
    function assertArgUnitOrUndefined(name, arg) {
        if (typeof arg === 'undefined') {
            return arg;
        }
        else {
            return assertArgUnit(name, arg);
        }
    }
    var dumbString = function (scale, dimensions, labels) {
        assertArgNumber('scale', scale);
        assertArgDimensions('dimensions', dimensions);
        var operatorStr;
        var scaleString;
        var unitsString;
        var stringify = function (rational, label) {
            if (rational.numer === 0) {
                return null;
            }
            else if (rational.denom === 1) {
                if (rational.numer === 1) {
                    return "" + label;
                }
                else {
                    return "" + label + " ** " + rational.numer;
                }
            }
            return "" + label + " ** " + rational;
        };
        operatorStr = scale === 1 || dimensions.isZero() ? "" : " ";
        scaleString = scale === 1 ? "" : "" + scale;
        unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
            return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
    };
    var unitString = function (scale, dimensions, labels) {
        var patterns = [
            [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, 3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
            [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]
        ];
        var decodes = [
            ["F/m"],
            ["S"],
            ["F"],
            ["N·m ** 2/kg ** 2"],
            ["Hz"],
            ["A"],
            ["m/s ** 2"],
            ["m/s"],
            ["kg·m/s"],
            ["Pa"],
            ["Pa·s"],
            ["W/m ** 2"],
            ["N/m"],
            ["T"],
            ["W/(m·K)"],
            ["V/m"],
            ["N"],
            ["H/m"],
            ["J/K"],
            ["J/(kg·K)"],
            ["J/(mol·K)"],
            ["J/mol"],
            ["J"],
            ["J·s"],
            ["W"],
            ["V"],
            ["Ω"],
            ["H"],
            ["Wb"]
        ];
        var M = dimensions.M;
        var L = dimensions.L;
        var T = dimensions.T;
        var Q = dimensions.Q;
        var temperature = dimensions.temperature;
        var amount = dimensions.amount;
        var intensity = dimensions.intensity;
        for (var i = 0, len = patterns.length; i < len; i++) {
            var pattern = patterns[i];
            if (M.numer === pattern[0] && M.denom === pattern[1] && L.numer === pattern[2] && L.denom === pattern[3] && T.numer === pattern[4] && T.denom === pattern[5] && Q.numer === pattern[6] && Q.denom === pattern[7] && temperature.numer === pattern[8] && temperature.denom === pattern[9] && amount.numer === pattern[10] && amount.denom === pattern[11] && intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
                if (scale !== 1) {
                    return scale + " * " + decodes[i][0];
                }
                else {
                    return decodes[i][0];
                }
            }
        }
        return dumbString(scale, dimensions, labels);
    };
    function add(lhs, rhs) {
        return new Unit(lhs.scale + rhs.scale, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function sub(lhs, rhs) {
        return new Unit(lhs.scale - rhs.scale, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function mul(lhs, rhs) {
        return new Unit(lhs.scale * rhs.scale, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
    }
    function scalarMultiply(alpha, unit) {
        return new Unit(alpha * unit.scale, unit.dimensions, unit.labels);
    }
    function div(lhs, rhs) {
        return new Unit(lhs.scale / rhs.scale, lhs.dimensions.div(rhs.dimensions), lhs.labels);
    }
    var Unit = (function () {
        /**
         * The Unit class represents the units for a measure.
         *
         * @class Unit
         * @constructor
         * @param {number} scale
         * @param {Dimensions} dimensions
         * @param {string[]} labels The label strings to use for each dimension.
         */
        function Unit(scale, dimensions, labels) {
            this.scale = scale;
            this.dimensions = dimensions;
            this.labels = labels;
            if (labels.length !== 7) {
                throw new Error("Expecting 7 elements in the labels array.");
            }
            this.scale = scale;
            this.dimensions = dimensions;
            this.labels = labels;
        }
        Unit.prototype.compatible = function (rhs) {
            if (rhs instanceof Unit) {
                this.dimensions.compatible(rhs.dimensions);
                return this;
            }
            else {
                throw new Error("Illegal Argument for Unit.compatible: " + rhs);
            }
        };
        Unit.prototype.add = function (rhs) {
            assertArgUnit('rhs', rhs);
            return add(this, rhs);
        };
        Unit.prototype.__add__ = function (other) {
            if (other instanceof Unit) {
                return add(this, other);
            }
            else {
                return;
            }
        };
        Unit.prototype.__radd__ = function (other) {
            if (other instanceof Unit) {
                return add(other, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.sub = function (rhs) {
            assertArgUnit('rhs', rhs);
            return sub(this, rhs);
        };
        Unit.prototype.__sub__ = function (other) {
            if (other instanceof Unit) {
                return sub(this, other);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rsub__ = function (other) {
            if (other instanceof Unit) {
                return sub(other, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.mul = function (rhs) {
            assertArgUnit('rhs', rhs);
            return mul(this, rhs);
        };
        Unit.prototype.__mul__ = function (other) {
            if (other instanceof Unit) {
                return mul(this, other);
            }
            else if (typeof other === 'number') {
                return scalarMultiply(other, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rmul__ = function (other) {
            if (other instanceof Unit) {
                return mul(other, this);
            }
            else if (typeof other === 'number') {
                return scalarMultiply(other, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.div = function (rhs) {
            assertArgUnit('rhs', rhs);
            return div(this, rhs);
        };
        Unit.prototype.__div__ = function (other) {
            if (other instanceof Unit) {
                return div(this, other);
            }
            else if (typeof other === 'number') {
                return new Unit(this.scale / other, this.dimensions, this.labels);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rdiv__ = function (other) {
            if (other instanceof Unit) {
                return div(other, this);
            }
            else if (typeof other === 'number') {
                return new Unit(other / this.scale, this.dimensions.negative(), this.labels);
            }
            else {
                return;
            }
        };
        Unit.prototype.pow = function (exponent) {
            assertArgRational('exponent', exponent);
            return new Unit(Math.pow(this.scale, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        Unit.prototype.inverse = function () {
            return new Unit(1 / this.scale, this.dimensions.negative(), this.labels);
        };
        Unit.prototype.isUnity = function () {
            return this.dimensions.dimensionless() && (this.scale === 1);
        };
        Unit.prototype.norm = function () {
            return new Unit(Math.abs(this.scale), this.dimensions, this.labels);
        };
        Unit.prototype.quad = function () {
            return new Unit(this.scale * this.scale, this.dimensions.mul(this.dimensions), this.labels);
        };
        Unit.prototype.toString = function () {
            return unitString(this.scale, this.dimensions, this.labels);
        };
        Unit.isUnity = function (uom) {
            if (typeof uom === 'undefined') {
                return true;
            }
            else if (uom instanceof Unit) {
                return uom.isUnity();
            }
            else {
                throw new Error("isUnity argument must be a Unit or undefined.");
            }
        };
        Unit.assertDimensionless = function (uom) {
            if (!Unit.isUnity(uom)) {
                throw new UnitError("uom must be dimensionless.");
            }
        };
        Unit.compatible = function (lhs, rhs) {
            assertArgUnitOrUndefined('lhs', lhs);
            assertArgUnitOrUndefined('rhs', rhs);
            if (lhs) {
                if (rhs) {
                    return lhs.compatible(rhs);
                }
                else {
                    if (lhs.isUnity()) {
                        return void 0;
                    }
                    else {
                        throw new UnitError(lhs + " is incompatible with 1");
                    }
                }
            }
            else {
                if (rhs) {
                    if (rhs.isUnity()) {
                        return void 0;
                    }
                    else {
                        throw new UnitError("1 is incompatible with " + rhs);
                    }
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.mul = function (lhs, rhs) {
            if (lhs instanceof Unit) {
                if (rhs instanceof Unit) {
                    return lhs.mul(rhs);
                }
                else if (Unit.isUnity(rhs)) {
                    return lhs;
                }
                else {
                    return void 0;
                }
            }
            else if (Unit.isUnity(lhs)) {
                return rhs;
            }
            else {
                return void 0;
            }
        };
        Unit.div = function (lhs, rhs) {
            if (lhs instanceof Unit) {
                if (rhs instanceof Unit) {
                    return lhs.div(rhs);
                }
                else {
                    return lhs;
                }
            }
            else {
                if (rhs instanceof Unit) {
                    return rhs.inverse();
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.sqrt = function (uom) {
            if (typeof uom !== 'undefined') {
                assertArgUnit('uom', uom);
                if (!uom.isUnity()) {
                    return new Unit(Math.sqrt(uom.scale), uom.dimensions.sqrt(), uom.labels);
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        };
        return Unit;
    })();
    return Unit;
});

define('davinci-blade/core',["require", "exports"], function (require, exports) {
    /**
     * Determines whether a property name is callable on an object.
     */
    function isCallableMethod(x, name) {
        return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
    }
    function makeUnaryUniversalFunction(methodName, primitiveFunction) {
        return function (x) {
            if (isCallableMethod(x, methodName)) {
                return x[methodName]();
            }
            else if (typeof x === 'number') {
                var something = x;
                var n = something;
                var thing = primitiveFunction(n);
                return thing;
            }
            else {
                throw new TypeError("x must support " + methodName + "(x)");
            }
        };
    }
    function cosh(x) {
        return (Math.exp(x) + Math.exp(-x)) / 2;
    }
    function sinh(x) {
        return (Math.exp(x) - Math.exp(-x)) / 2;
    }
    var core = {
        VERSION: '1.7.2',
        cos: makeUnaryUniversalFunction('cos', Math.cos),
        cosh: makeUnaryUniversalFunction('cosh', cosh),
        exp: makeUnaryUniversalFunction('exp', Math.exp),
        norm: makeUnaryUniversalFunction('norm', function (x) {
            return Math.abs(x);
        }),
        quad: makeUnaryUniversalFunction('quad', function (x) {
            return x * x;
        }),
        sin: makeUnaryUniversalFunction('sin', Math.sin),
        sinh: makeUnaryUniversalFunction('sinh', sinh),
        sqrt: makeUnaryUniversalFunction('sqrt', Math.sqrt),
        unit: makeUnaryUniversalFunction('unit', function (x) {
            return x / Math.abs(x);
        }),
        Math: {
            cosh: cosh,
            sinh: sinh
        }
    };
    return core;
});

define('davinci-blade/e3ga/Euclidean3',["require", "exports", 'davinci-blade/NotImplementedError', 'davinci-blade/Unit', 'davinci-blade/core'], function (require, exports, NotImplementedError, Unit, core) {
    var cos = Math.cos;
    var cosh = core.Math.cosh;
    var exp = Math.exp;
    var sin = Math.sin;
    var sinh = core.Math.sinh;
    function Euclidean3Error(message) {
        this.name = 'Euclidean3Error';
        this.message = (message || "");
    }
    Euclidean3Error.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new Euclidean3Error("Argument '" + name + "' must be a number");
        }
    }
    function assertArgEuclidean3(name, arg) {
        if (arg instanceof Euclidean3) {
            return arg;
        }
        else {
            throw new Euclidean3Error("Argument '" + arg + "' must be a Euclidean3");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new Euclidean3Error("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    function compute(f, a, b, coord, pack, uom) {
        var a0 = coord(a, 0);
        var a1 = coord(a, 1);
        var a2 = coord(a, 2);
        var a3 = coord(a, 3);
        var a4 = coord(a, 4);
        var a5 = coord(a, 5);
        var a6 = coord(a, 6);
        var a7 = coord(a, 7);
        var b0 = coord(b, 0);
        var b1 = coord(b, 1);
        var b2 = coord(b, 2);
        var b3 = coord(b, 3);
        var b4 = coord(b, 4);
        var b5 = coord(b, 5);
        var b6 = coord(b, 6);
        var b7 = coord(b, 7);
        var x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return pack(x0, x1, x2, x3, x4, x5, x6, x7, uom);
    }
    function addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 + b0);
                }
                break;
            case 1:
                {
                    x = +(a1 + b1);
                }
                break;
            case 2:
                {
                    x = +(a2 + b2);
                }
                break;
            case 3:
                {
                    x = +(a3 + b3);
                }
                break;
            case 4:
                {
                    x = +(a4 + b4);
                }
                break;
            case 5:
                {
                    x = +(a5 + b5);
                }
                break;
            case 6:
                {
                    x = +(a6 + b6);
                }
                break;
            case 7:
                {
                    x = +(a7 + b7);
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    function subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 - b0);
                }
                break;
            case 1:
                {
                    x = +(a1 - b1);
                }
                break;
            case 2:
                {
                    x = +(a2 - b2);
                }
                break;
            case 3:
                {
                    x = +(a3 - b3);
                }
                break;
            case 4:
                {
                    x = +(a4 - b4);
                }
                break;
            case 5:
                {
                    x = +(a5 - b5);
                }
                break;
            case 6:
                {
                    x = +(a6 - b6);
                }
                break;
            case 7:
                {
                    x = +(a7 - b7);
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    /**
     *
     */
    function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    function scpE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = 0;
                }
                break;
            case 2:
                {
                    x = 0;
                }
                break;
            case 3:
                {
                    x = 0;
                }
                break;
            case 4:
                {
                    x = 0;
                }
                break;
            case 5:
                {
                    x = 0;
                }
                break;
            case 6:
                {
                    x = 0;
                }
                break;
            case 7:
                {
                    x = 0;
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    function extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a2 * b0);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a3 * b0);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a1 * b2 - a2 * b1 + a4 * b0);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a2 * b3 - a3 * b2 + a5 * b0);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 - a1 * b3 + a3 * b1 + a6 * b0);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    function lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 - a2 * b4 + a3 * b6 - a5 * b7);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b4 - a3 * b5 - a6 * b7);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 - a1 * b6 + a2 * b5 - a4 * b7);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a3 * b7);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a1 * b7);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 + a2 * b7);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7);
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    function rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(+a1 * b0 + a4 * b2 - a6 * b3 - a7 * b5);
                }
                break;
            case 2:
                {
                    x = +(+a2 * b0 - a4 * b1 + a5 * b3 - a7 * b6);
                }
                break;
            case 3:
                {
                    x = +(+a3 * b0 - a5 * b2 + a6 * b1 - a7 * b4);
                }
                break;
            case 4:
                {
                    x = +(+a4 * b0 + a7 * b3);
                }
                break;
            case 5:
                {
                    x = +(+a5 * b0 + a7 * b1);
                }
                break;
            case 6:
                {
                    x = +(+a6 * b0 + a7 * b2);
                }
                break;
            case 7:
                {
                    x = +(+a7 * b0);
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    var divide = function (a000, a001, a010, a011, a100, a101, a110, a111, b000, b001, b010, b011, b100, b101, b110, b111, uom, dst) {
        var c000, c001, c010, c011, c100, c101, c110, c111, i000, i001, i010, i011, i100, i101, i110, i111, k000, m000, m001, m010, m011, m100, m101, m110, m111, r000, r001, r010, r011, r100, r101, r110, r111, s000, s001, s010, s011, s100, s101, s110, s111, w, x, x000, x001, x010, x011, x100, x101, x110, x111, xy, xyz, y, yz, z, zx;
        r000 = +b000;
        r001 = +b001;
        r010 = +b010;
        r011 = -b011;
        r100 = +b100;
        r101 = -b101;
        r110 = -b110;
        r111 = -b111;
        m000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 0);
        m001 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 1);
        m010 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 2);
        m011 = 0;
        m100 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 3);
        m101 = 0;
        m110 = 0;
        m111 = 0;
        c000 = +m000;
        c001 = -m001;
        c010 = -m010;
        c011 = -m011;
        c100 = -m100;
        c101 = -m101;
        c110 = -m110;
        c111 = +m111;
        s000 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 0);
        s001 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 1);
        s010 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 2);
        s011 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 4);
        s100 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 3);
        s101 = -mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 6);
        s110 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 5);
        s111 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 7);
        k000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, s000, s001, s010, s100, s011, s110, -s101, s111, 0);
        i000 = s000 / k000;
        i001 = s001 / k000;
        i010 = s010 / k000;
        i011 = s011 / k000;
        i100 = s100 / k000;
        i101 = s101 / k000;
        i110 = s110 / k000;
        i111 = s111 / k000;
        x000 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 0);
        x001 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 1);
        x010 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 2);
        x011 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 4);
        x100 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 3);
        x101 = -mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 6);
        x110 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 5);
        x111 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 7);
        w = x000;
        x = x001;
        y = x010;
        z = x100;
        xy = x011;
        yz = x110;
        zx = -x101;
        xyz = x111;
        if (typeof dst !== 'undefined') {
            dst.w = w;
            dst.x = x;
            dst.y = y;
            dst.z = z;
            dst.xy = xy;
            dst.yz = yz;
            dst.zx = zx;
            dst.xyz = xyz;
            dst.uom = uom;
        }
        else {
            return new Euclidean3(w, x, y, z, xy, yz, zx, xyz, uom);
        }
    };
    function stringFromCoordinates(coordinates, numberToString, labels) {
        var i, _i, _ref;
        var str;
        var sb = [];
        var append = function (coord, label) {
            var n;
            if (coord !== 0) {
                if (coord >= 0) {
                    if (sb.length > 0) {
                        sb.push("+");
                    }
                }
                else {
                    sb.push("-");
                }
                n = Math.abs(coord);
                if (n === 1) {
                    sb.push(label);
                }
                else {
                    sb.push(numberToString(n));
                    if (label !== "1") {
                        sb.push("*");
                        sb.push(label);
                    }
                }
            }
        };
        for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            append(coordinates[i], labels[i]);
        }
        if (sb.length > 0) {
            str = sb.join("");
        }
        else {
            str = "0";
        }
        return str;
    }
    /**
     * The Euclidean3 class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
     * @class Euclidean3
     */
    var Euclidean3 = (function () {
        /**
         * Constructs a Euclidean3 from its coordinates.
         * @constructor
         * @param {number} w The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param {number} y The vector component of the multivector in the y-direction.
         * @param {number} z The vector component of the multivector in the z-direction.
         * @param {number} xy The bivector component of the multivector in the xy-plane.
         * @param {number} yz The bivector component of the multivector in the yz-plane.
         * @param {number} zx The bivector component of the multivector in the zx-plane.
         * @param {number} xyz The pseudoscalar part of the multivector.
         * @param uom The optional unit of measure.
         */
        function Euclidean3(w, x, y, z, xy, yz, zx, xyz, uom) {
            this.w = assertArgNumber('w', w);
            this.x = assertArgNumber('x', x);
            this.y = assertArgNumber('y', y);
            this.z = assertArgNumber('z', z);
            this.xy = assertArgNumber('xy', xy);
            this.yz = assertArgNumber('yz', yz);
            this.zx = assertArgNumber('zx', zx);
            this.xyz = assertArgNumber('xyz', xyz);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.scale !== 1) {
                var scale = this.uom.scale;
                this.w *= scale;
                this.x *= scale;
                this.y *= scale;
                this.z *= scale;
                this.xy *= scale;
                this.yz *= scale;
                this.zx *= scale;
                this.xyz *= scale;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Euclidean3.fromCartesian = function (w, x, y, z, xy, yz, zx, xyz, uom) {
            assertArgNumber('w', w);
            assertArgNumber('x', x);
            assertArgNumber('y', y);
            assertArgNumber('z', z);
            assertArgNumber('xy', xy);
            assertArgNumber('yz', yz);
            assertArgNumber('zx', zx);
            assertArgNumber('xyz', xyz);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean3(w, x, y, z, xy, yz, zx, xyz, uom);
        };
        Euclidean3.prototype.coordinates = function () {
            return [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz];
        };
        Euclidean3.prototype.coordinate = function (index) {
            assertArgNumber('index', index);
            switch (index) {
                case 0:
                    return this.w;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.z;
                case 4:
                    return this.xy;
                case 5:
                    return this.yz;
                case 6:
                    return this.zx;
                case 7:
                    return this.xyz;
                default:
                    throw new Euclidean3Error("index must be in the range [0..7]");
            }
        };
        /**
         * Computes the sum of this Euclidean3 and another considered to be the rhs of the binary addition, `+`, operator.
         * This method does not change this Euclidean3.
         * @method add
         * @param rhs {Euclidean3}
         * @return {Euclidean3} This Euclidean3 plus rhs.
         */
        Euclidean3.prototype.add = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(addE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__add__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__radd__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).add(this);
            }
        };
        /**
         * Computes the difference of this Euclidean3 and another considered to be the rhs of the binary subtraction, `-`, operator.
         * This method does not change this Euclidean3.
         * @method sub
         * @param rhs {Euclidean3}
         * @return {Euclidean3} This Euclidean3 minus rhs.
         */
        Euclidean3.prototype.sub = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(subE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__sub__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.sub(other);
            }
            else if (typeof other === 'number') {
                return this.sub(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rsub__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).sub(this);
            }
        };
        Euclidean3.prototype.mul = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(mulE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__mul__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                return this.mul(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rmul__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.mul(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).mul(this);
            }
        };
        Euclidean3.prototype.scalarMultiply = function (rhs) {
            return new Euclidean3(this.w * rhs, this.x * rhs, this.y * rhs, this.z * rhs, this.xy * rhs, this.yz * rhs, this.zx * rhs, this.xyz * rhs, this.uom);
        };
        Euclidean3.prototype.div = function (rhs) {
            assertArgEuclidean3('rhs', rhs);
            return divide(this.w, this.x, this.y, this.xy, this.z, -this.zx, this.yz, this.xyz, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, Unit.div(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__div__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                return this.div(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rdiv__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.div(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
            }
        };
        Euclidean3.prototype.splat = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(scpE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.wedge = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(extE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__vbar__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.splat(other);
            }
            else if (typeof other === 'number') {
                return this.splat(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rvbar__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.splat(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).splat(this);
            }
        };
        Euclidean3.prototype.__wedge__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.wedge(other);
            }
            else if (typeof other === 'number') {
                return this.wedge(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rwedge__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.wedge(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).wedge(this);
            }
        };
        Euclidean3.prototype.lshift = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(lcoE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__lshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.lshift(other);
            }
            else if (typeof other === 'number') {
                return this.lshift(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rlshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.lshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).lshift(this);
            }
        };
        Euclidean3.prototype.rshift = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(rcoE3, [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz], [rhs.w, rhs.x, rhs.y, rhs.z, rhs.xy, rhs.yz, rhs.zx, rhs.xyz], coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__rshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.rshift(other);
            }
            else if (typeof other === 'number') {
                return this.rshift(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        Euclidean3.prototype.__rrshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.rshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, void 0).rshift(this);
            }
        };
        Euclidean3.prototype.pow = function (exponent) {
            throw new Euclidean3Error('pow');
        };
        Euclidean3.prototype.__pos__ = function () {
            return this;
        };
        Euclidean3.prototype.__neg__ = function () {
            return new Euclidean3(-this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        /**
         * ~ (tilde) produces reversion.
         */
        Euclidean3.prototype.__tilde__ = function () {
            return new Euclidean3(this.w, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        Euclidean3.prototype.grade = function (index) {
            assertArgNumber('index', index);
            switch (index) {
                case 0:
                    return Euclidean3.fromCartesian(this.w, 0, 0, 0, 0, 0, 0, 0, this.uom);
                case 1:
                    return Euclidean3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
                case 2:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
                case 3:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.xyz, this.uom);
                default:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        // FIXME: This should return a Euclidean3
        Euclidean3.prototype.dot = function (vector) {
            return this.x * vector.x + this.y * vector.y + this.z * vector.z;
        };
        Euclidean3.prototype.cross = function (vector) {
            var x, x1, x2, y, y1, y2, z, z1, z2;
            x1 = this.x;
            y1 = this.y;
            z1 = this.z;
            x2 = vector.x;
            y2 = vector.y;
            z2 = vector.z;
            x = y1 * z2 - z1 * y2;
            y = z1 * x2 - x1 * z2;
            z = x1 * y2 - y1 * x2;
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, Unit.mul(this.uom, vector.uom));
        };
        Euclidean3.prototype.isZero = function () {
            return (this.w === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        Euclidean3.prototype.length = function () {
            return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz);
        };
        Euclidean3.prototype.cos = function () {
            // TODO: Generalize to full multivector.
            Unit.assertDimensionless(this.uom);
            var cosW = cos(this.w);
            return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        Euclidean3.prototype.cosh = function () {
            throw new NotImplementedError('cosh(Euclidean3)');
        };
        Euclidean3.prototype.exp = function () {
            Unit.assertDimensionless(this.uom);
            var bivector = this.grade(2);
            var a = bivector.norm();
            if (!a.isZero()) {
                var c = a.cos();
                var s = a.sin();
                var B = bivector.unit();
                return c.add(B.mul(s));
            }
            else {
                return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        /**
         * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
         */
        Euclidean3.prototype.norm = function () {
            return new Euclidean3(Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        /**
         * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
         */
        Euclidean3.prototype.quad = function () {
            return new Euclidean3(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, this.uom));
        };
        Euclidean3.prototype.sin = function () {
            // TODO: Generalize to full multivector.
            Unit.assertDimensionless(this.uom);
            var sinW = sin(this.w);
            return new Euclidean3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        Euclidean3.prototype.sinh = function () {
            throw new Euclidean3Error('sinh');
        };
        Euclidean3.prototype.unit = function () {
            return this.div(this.norm());
        };
        Euclidean3.prototype.scalar = function () {
            return this.w;
        };
        Euclidean3.prototype.sqrt = function () {
            return new Euclidean3(Math.sqrt(this.w), 0, 0, 0, 0, 0, 0, 0, Unit.sqrt(this.uom));
        };
        Euclidean3.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates(this.coordinates(), coordToString, labels);
            if (this.uom) {
                var unitString = this.uom.toString().trim();
                if (unitString) {
                    return quantityString + ' ' + unitString;
                }
                else {
                    return quantityString;
                }
            }
            else {
                return quantityString;
            }
        };
        Euclidean3.prototype.toExponential = function () {
            var coordToString = function (coord) {
                return coord.toExponential();
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
        };
        Euclidean3.prototype.toFixed = function (digits) {
            assertArgNumber('digits', digits);
            var coordToString = function (coord) {
                return coord.toFixed(digits);
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
        };
        Euclidean3.prototype.toString = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
        };
        Euclidean3.prototype.toStringIJK = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "i", "j", "k", "ij", "jk", "ki", "I"]);
        };
        Euclidean3.prototype.toStringLATEX = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{3}", "e_{12}", "e_{23}", "e_{31}", "e_{123}"]);
        };
        return Euclidean3;
    })();
    return Euclidean3;
});

define('davinci-blade/e3ga/scalarE3',["require", "exports", 'davinci-blade/e3ga/Euclidean3'], function (require, exports, Euclidean3) {
    var scalarE3 = function (w, uom) {
        return new Euclidean3(w, 0, 0, 0, 0, 0, 0, 0, uom);
    };
    return scalarE3;
});

define('davinci-blade/e3ga/vectorE3',["require", "exports", 'davinci-blade/e3ga/Euclidean3'], function (require, exports, Euclidean3) {
    var vectorE3 = function (x, y, z, uom) {
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0, uom);
    };
    return vectorE3;
});

define('davinci-blade/e3ga/bivectorE3',["require", "exports", 'davinci-blade/e3ga/Euclidean3'], function (require, exports, Euclidean3) {
    var bivectorE3 = function (xy, yz, zx, uom) {
        return new Euclidean3(0, 0, 0, 0, xy, yz, zx, 0, uom);
    };
    return bivectorE3;
});

define('davinci-blade/e3ga/pseudoscalarE3',["require", "exports", 'davinci-blade/e3ga/Euclidean3'], function (require, exports, Euclidean3) {
    var pseudoscalarE3 = function (xyz, uom) {
        return new Euclidean3(0, 0, 0, 0, 0, 0, 0, xyz, uom);
    };
    return pseudoscalarE3;
});

// When using amd-dependency, you must know the file structure of the library being used.
// You must declare a variable for each dependency.
// You may type your variables.
// Be careful to only use the type declarations in type positions that will be erased.
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/EllipticalCylinderGeometry',["require", "exports", "davinci-blade/e3ga/Euclidean3", "davinci-blade/e3ga/scalarE3", "davinci-blade/e3ga/vectorE3", "davinci-blade/e3ga/bivectorE3", "davinci-blade/e3ga/pseudoscalarE3", '../geometries/Geometry'], function (require, exports, Euclidean3, scalarE3, vectorE3, bivectorE3, pseudoscalarE3, Geometry) {
    var EllipticalCylinderGeometry = (function (_super) {
        __extends(EllipticalCylinderGeometry, _super);
        function EllipticalCylinderGeometry() {
            _super.call(this);
            var s = scalarE3(1);
            console.log("s: " + s);
            var m = new Euclidean3(1, 2, 3, 4, 5, 6, 7, 8);
            console.log("m: " + m);
            var v = vectorE3(1, 2, 3);
            console.log("v: " + v);
            var B = bivectorE3(3, 4, 5);
            console.log("B: " + B);
            var I = pseudoscalarE3(6);
            console.log("I: " + I);
        }
        return EllipticalCylinderGeometry;
    })(Geometry);
    return EllipticalCylinderGeometry;
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
define('davinci-eight/geometries/ParametricSurfaceGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry, Vector2, Vector3) {
    /**
     * @author zz85 / https://github.com/zz85
     * Parametric Surfaces Geometry
     * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
     *
     * new ParametricSurfaceGeometry( parametricFunction, uSegments, vSegments );
     */
    var ParametricSurfaceGeometry = (function (_super) {
        __extends(ParametricSurfaceGeometry, _super);
        function ParametricSurfaceGeometry(parametricFunction, uSegments, vSegments) {
            _super.call(this);
            var vertices = this.vertices;
            var faces = this.faces;
            var uvs = this.faceVertexUvs[0];
            var i;
            var j;
            var sliceCount = uSegments + 1;
            for (i = 0; i <= vSegments; i++) {
                var v = i / vSegments;
                for (j = 0; j <= uSegments; j++) {
                    var u = j / uSegments;
                    var p = parametricFunction(u, v);
                    vertices.push(new Vector3([p.x, p.y, p.z]));
                }
            }
            var a;
            var b;
            var c;
            var d;
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
                    uva = new Vector2([j / uSegments, i / vSegments]);
                    uvb = new Vector2([(j + 1) / uSegments, i / vSegments]);
                    uvc = new Vector2([(j + 1) / uSegments, (i + 1) / vSegments]);
                    uvd = new Vector2([j / uSegments, (i + 1) / vSegments]);
                    faces.push(new Face3(a, b, d));
                    uvs.push([uva, uvb, uvd]);
                    faces.push(new Face3(b, c, d));
                    uvs.push([uvb.clone(), uvc, uvd.clone()]);
                }
            }
            this.computeFaceNormals();
            this.computeVertexNormals();
        }
        return ParametricSurfaceGeometry;
    })(Geometry);
    return ParametricSurfaceGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/KleinBottleGeometry',["require", "exports", '../geometries/ParametricSurfaceGeometry', '../math/Vector3'], function (require, exports, ParametricSurfaceGeometry, Vector3) {
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
     * @extends ParametricSurfaceGeometry
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
    })(ParametricSurfaceGeometry);
    return KleinBottleGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/MobiusStripGeometry',["require", "exports", '../geometries/ParametricSurfaceGeometry', '../math/Vector3'], function (require, exports, ParametricSurfaceGeometry, Vector3) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function mobius(u, v) {
        var point = new Vector3([0, 0, 0]);
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
    })(ParametricSurfaceGeometry);
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
            if (radius === void 0) { radius = 1; }
            if (widthSegments === void 0) { widthSegments = 16; }
            if (heightSegments === void 0) { heightSegments = 12; }
            if (phiStart === void 0) { phiStart = 0; }
            if (phiLength === void 0) { phiLength = 2 * Math.PI; }
            if (thetaStart === void 0) { thetaStart = 0; }
            if (thetaLength === void 0) { thetaLength = Math.PI; }
            _super.call(this);
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
                    var vertex = new Vector3([0, 0, 0]);
                    vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                    vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    this.vertices.push(vertex);
                    verticesRow.push(this.vertices.length - 1);
                    uvsRow.push(new Vector2([u, 1 - v]));
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
            this.boundingSphere = new Sphere(new Vector3([0, 0, 0]), radius);
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

define('davinci-eight/math/clamp',["require", "exports"], function (require, exports) {
    function clamp(x, min, max) {
        return (x < min) ? min : ((x > max) ? max : x);
    }
    return clamp;
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
            var pos2 = new Vector3([0, 0, 0]);
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
                return scope.vertices.push(new Vector3([x, y, z])) - 1;
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
                    uva = new Vector2([i / segments, j / radialSegments]);
                    uvb = new Vector2([(i + 1) / segments, j / radialSegments]);
                    uvc = new Vector2([(i + 1) / segments, (j + 1) / radialSegments]);
                    uvd = new Vector2([i / segments, (j + 1) / radialSegments]);
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
            var normal = new Vector3([0, 0, 0]);
            var tangents = [];
            var normals = [];
            var binormals = [];
            var vec = new Vector3([0, 0, 0]);
            var mat = Matrix4.identity();
            var numpoints = segments + 1;
            var theta;
            var epsilon = 0.0001;
            var epsilonSquared = 0.0001 * 0.0001;
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
                normals[0] = new Vector3([0, 0, 0]);
                binormals[0] = new Vector3([0, 0, 0]);
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
                if (vec.magnitude() > epsilon) {
                    vec.normalize();
                    theta = Math.acos(clamp(tangents[i - 1].dot(tangents[i]), -1, 1)); // clamp for floating pt errors
                    // TODO: don't like this applyMatrix4 use applySpinor
                    normals[i].applyMatrix4(mat.rotationAxis(vec, theta));
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
                    // TODO: Don't like this applyMatrix4 use applySpinor
                    normals[i].applyMatrix4(mat.rotationAxis(tangents[i], theta * i));
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
            var center = new Vector3([0, 0, 0]);
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
                    var vertex = new Vector3([0, 0, 0]);
                    var r = computeRadius(i);
                    vertex.x = (R + r * cosV) * cosU;
                    vertex.y = (R + r * cosV) * sinU;
                    vertex.z = r * sinV;
                    this.vertices.push(vertex);
                    uvs.push(new Vector2([i / circleSegments, j / radialSegments]));
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
                    this.faces.push(face);
                    this.faceVertexUvs[0].push([uvs[a].clone(), uvs[b].clone(), uvs[d].clone()]);
                    face = new Face3(b, c, d, [normals[b], normals[c], normals[d]]);
                    this.faces.push(face);
                    this.faceVertexUvs[0].push([uvs[b].clone(), uvs[c].clone(), uvs[d].clone()]);
                }
            }
        }
        return VortexGeometry;
    })(Geometry);
    return VortexGeometry;
});

define('davinci-eight/programs/createAttributeSetters',["require", "exports"], function (require, exports) {
    /**
     * Creates setter functions for all attributes of a shader
     * program. You can pass this to {@link module:webgl-utils.setBuffersAndAttributes} to set all your buffers and attributes.
     *
     * @see {@link module:webgl-utils.setAttributes} for example
     * @param {WebGLProgram} program the program to create setters for.
     * @return {Object.<string, function>} an object with a setter for each attribute by name.
     * @memberOf module:webgl-utils
     */
    function createAttributeSetters(gl, program) {
        var attribSetters = {};
        // An attribute setter function binds a buffer, enables the attribute and describes the attribute property.
        // This implementation captures the context so it would have to be refreshed on context gain.
        // The setter does not actually transfer the attribute data but instead defined how the transfer occurs.
        // Buffers don't exist before we create the setters, but do when they are called.
        function createAttribSetter(index) {
            // TODO: Separate into the WebGLBuffer and the meta data?
            return function (buffer, meta) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.enableVertexAttribArray(index);
                gl.vertexAttribPointer(index, meta.size, meta.type || gl.FLOAT, meta.normalized || false, meta.stride || 0, meta.offset || 0);
            };
        }
        // We discover the attributesnd create a setter for each one.
        var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (var ii = 0; ii < numAttribs; ++ii) {
            var attribInfo = gl.getActiveAttrib(program, ii);
            if (!attribInfo) {
                break;
            }
            var index = gl.getAttribLocation(program, attribInfo.name);
            attribSetters[attribInfo.name] = createAttribSetter(index);
        }
        return attribSetters;
    }
    return createAttributeSetters;
});

define('davinci-eight/programs/glslType',["require", "exports"], function (require, exports) {
    function glslType(type, context) {
        switch (type) {
            case 2: {
                return "foo";
            }
            case context.FLOAT_VEC3: {
                return 'vec3';
            }
            case context.FLOAT_MAT2: {
                return 'mat2';
            }
            case context.FLOAT_MAT3: {
                return 'mat3';
            }
            case context.FLOAT_MAT4: {
                return 'mat4';
            }
            default: {
                throw new Error("Unexpected type: " + type);
            }
        }
    }
    return glslType;
});

define('davinci-eight/programs/shaderProgram',["require", "exports", '../utils/uuid4', '../core/ShaderAttribLocation', '../core/ShaderUniformLocation', '../programs/createAttributeSetters', '../programs/setUniforms', '../programs/glslType'], function (require, exports, uuid4, ShaderAttribLocation, ShaderUniformLocation, createAttributeSetters, setUniforms, glslType) {
    var shaderProgram = function (vertexShader, fragmentShader) {
        if (typeof vertexShader !== 'string') {
            throw new Error("vertexShader argument must be a string.");
        }
        if (typeof fragmentShader !== 'string') {
            throw new Error("fragmentShader argument must be a string.");
        }
        var program;
        var programId;
        var context;
        var contextGainId;
        var attributeLocations = {};
        var attribSetters = {};
        var uniformLocations = {};
        var uniformSetters = {};
        var publicAPI = {
            get vertexShader() {
                return vertexShader;
            },
            get fragmentShader() {
                return fragmentShader;
            },
            get attributeLocations() {
                return attributeLocations;
            },
            get attribSetters() {
                return attribSetters;
            },
            get uniformLocations() {
                return uniformLocations;
            },
            get uniformSetters() {
                return uniformSetters;
            },
            contextFree: function () {
                if (program) {
                    context.deleteProgram(program);
                    program = void 0;
                    programId = void 0;
                    context = void 0;
                    contextGainId = void 0;
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextFree();
                    }
                    for (var uName in uniformLocations) {
                        uniformLocations[uName].contextFree();
                    }
                }
            },
            contextGain: function (contextArg, contextId) {
                context = contextArg;
                if (contextGainId !== contextId) {
                    program = makeWebGLProgram(context, vertexShader, fragmentShader);
                    programId = uuid4().generate();
                    contextGainId = contextId;
                    var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                    for (var a = 0; a < activeAttributes; a++) {
                        var activeInfo = context.getActiveAttrib(program, a);
                        activeInfo.size; // What is this used for?
                        activeInfo.type;
                        if (!attributeLocations[activeInfo.name]) {
                            attributeLocations[activeInfo.name] = new ShaderAttribLocation(activeInfo.name, glslType(activeInfo.type, context));
                        }
                    }
                    var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                    for (var u = 0; u < activeUniforms; u++) {
                        var activeInfo = context.getActiveUniform(program, u);
                        if (!uniformLocations[activeInfo.name]) {
                            uniformLocations[activeInfo.name] = new ShaderUniformLocation(activeInfo.name, glslType(activeInfo.type, context));
                            uniformSetters[activeInfo.name] = uniformLocations[activeInfo.name].createSetter(context, activeInfo);
                        }
                    }
                    // Broadcast contextGain to attribute and uniform locations.
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextGain(contextArg, program, contextId);
                    }
                    Object.keys(uniformLocations).forEach(function (uName) {
                        uniformLocations[uName].contextGain(contextArg, program, contextId);
                    });
                    attribSetters = createAttributeSetters(contextArg, program);
                }
            },
            contextLoss: function () {
                program = void 0;
                programId = void 0;
                context = void 0;
                contextGainId = void 0;
                for (var aName in attributeLocations) {
                    attributeLocations[aName].contextLoss();
                }
                for (var uName in uniformLocations) {
                    uniformLocations[uName].contextLoss();
                }
            },
            hasContext: function () {
                return !!program;
            },
            get program() { return program; },
            get programId() { return programId; },
            use: function () {
                if (context) {
                    context.useProgram(program);
                }
                return publicAPI;
            },
            setUniforms: function (values) {
                setUniforms(uniformSetters, values);
            }
        };
        return publicAPI;
    };
    function makeWebGLShader(gl, source, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        }
        else {
            var message = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Error compiling shader: " + message);
        }
    }
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    function makeWebGLProgram(gl, vertexShader, fragmentShader) {
        var vs = makeWebGLShader(gl, vertexShader, gl.VERTEX_SHADER);
        var fs = makeWebGLShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return program;
        }
        else {
            var message = gl.getProgramInfoLog(program);
            gl.detachShader(program, vs);
            gl.deleteShader(vs);
            gl.detachShader(program, fs);
            gl.deleteShader(fs);
            gl.deleteProgram(program);
            throw new Error("Error linking program: " + message);
        }
    }
    return shaderProgram;
});

define('davinci-eight/core/getUniformVarName',["require", "exports", '../checks/isDefined', '../checks/expectArg'], function (require, exports, isDefined, expectArg) {
    /**
     * Policy for how an uniform variable name is determined.
     */
    function getUniformVarName(uniform, varName) {
        expectArg('uniform', uniform).toBeObject();
        expectArg('varName', varName).toBeString();
        return isDefined(uniform.name) ? expectArg('uniform.name', uniform.name).toBeString().value : varName;
    }
    return getUniformVarName;
});

define('davinci-eight/programs/vertexShader',["require", "exports", '../core/getAttribVarName', '../core/getUniformVarName', '../core/Symbolic'], function (require, exports, getAttribVarName, getUniformVarName, Symbolic) {
    function getUniformCodeName(uniforms, name) {
        return getUniformVarName(uniforms[name], name);
    }
    var SPACE = ' ';
    var ATTRIBUTE = 'attribute' + SPACE;
    var UNIFORM = 'uniform' + SPACE;
    var COMMA = ',' + SPACE;
    var SEMICOLON = ';';
    var LPAREN = '(';
    var RPAREN = ')';
    var TIMES = SPACE + '*' + SPACE;
    var ASSIGN = SPACE + '=' + SPACE;
    var DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME = "directionalLightCosineFactor";
    /**
     *
     */
    function vertexShader(attributes, uniforms, vColor, vLight) {
        var lines = [];
        for (name in attributes) {
            lines.push(ATTRIBUTE + attributes[name].glslType + SPACE + getAttribVarName(attributes[name], name) + SEMICOLON);
        }
        for (name in uniforms) {
            lines.push(UNIFORM + uniforms[name].glslType + SPACE + getUniformCodeName(uniforms, name) + SEMICOLON);
        }
        if (vColor) {
            lines.push("varying highp vec4 vColor;");
        }
        if (vLight) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void) {");
        var glPosition = [];
        glPosition.unshift(SEMICOLON);
        if (attributes[Symbolic.ATTRIBUTE_POSITION]) {
            glPosition.unshift(RPAREN);
            glPosition.unshift("1.0");
            glPosition.unshift(COMMA);
            glPosition.unshift(getAttribVarName(attributes[Symbolic.ATTRIBUTE_POSITION], Symbolic.ATTRIBUTE_POSITION));
            glPosition.unshift(LPAREN);
            glPosition.unshift("vec4");
        }
        else {
            glPosition.unshift("vec4(0.0, 0.0, 0.0, 1.0)");
        }
        if (uniforms[Symbolic.UNIFORM_MODEL_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, Symbolic.UNIFORM_MODEL_MATRIX));
        }
        if (uniforms[Symbolic.UNIFORM_VIEW_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, Symbolic.UNIFORM_VIEW_MATRIX));
        }
        if (uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, Symbolic.UNIFORM_PROJECTION_MATRIX));
        }
        glPosition.unshift(ASSIGN);
        glPosition.unshift("gl_Position");
        glPosition.unshift('  ');
        lines.push(glPosition.join(''));
        if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
            var vColorAssignLines = [];
            var colorAttribVarName = getAttribVarName(attributes[Symbolic.ATTRIBUTE_COLOR], Symbolic.ATTRIBUTE_COLOR);
            switch (attributes[Symbolic.ATTRIBUTE_COLOR].glslType) {
                case 'vec4':
                    {
                        lines.push("  vColor = " + colorAttribVarName + SEMICOLON);
                    }
                    break;
                case 'vec3':
                    {
                        lines.push("  vColor = vec4(" + colorAttribVarName + ", 1.0);");
                    }
                    break;
                default: {
                    throw new Error("Unexpected type for color attribute: " + attributes[Symbolic.ATTRIBUTE_COLOR].glslType);
                }
            }
            lines.push(vColorAssignLines.join(''));
        }
        else if (uniforms[Symbolic.UNIFORM_COLOR]) {
            var vColorAssignLines = [];
            var colorUniformVarName = getUniformCodeName(uniforms, Symbolic.UNIFORM_COLOR);
            switch (uniforms[Symbolic.UNIFORM_COLOR].glslType) {
                case 'vec4':
                    {
                        lines.push("  vColor = " + colorUniformVarName + SEMICOLON);
                    }
                    break;
                case 'vec3':
                    {
                        lines.push("  vColor = vec4(" + colorUniformVarName + ", 1.0);");
                    }
                    break;
                default: {
                    throw new Error("Unexpected type for color uniform: " + uniforms[Symbolic.UNIFORM_COLOR].glslType);
                }
            }
            lines.push(vColorAssignLines.join(''));
        }
        if (vLight) {
            if (uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] && attributes[Symbolic.ATTRIBUTE_NORMAL]) {
                lines.push("  vec3 L = normalize(" + getUniformCodeName(uniforms, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");");
                lines.push("  vec3 N = normalize(" + getUniformCodeName(uniforms, Symbolic.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName(attributes[Symbolic.ATTRIBUTE_NORMAL], Symbolic.ATTRIBUTE_NORMAL) + ");");
                lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(dot(N, L), 0.0);");
                if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
                    lines.push("  vLight = " + getUniformCodeName(uniforms, Symbolic.UNIFORM_AMBIENT_LIGHT) + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
                }
                else {
                    lines.push("  vLight = " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
                }
            }
            else {
                if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
                    lines.push("  vLight = " + getUniformCodeName(uniforms, Symbolic.UNIFORM_AMBIENT_LIGHT) + ";");
                }
                else {
                    lines.push("  vLight = vec3(1.0, 1.0, 1.0);");
                }
            }
        }
        // TODO: This should be made conditional and variable or constant.
        //lines.push("  gl_PointSize = 6.0;");
        lines.push("}");
        var code = lines.join("\n");
        return code;
    }
    return vertexShader;
});

define('davinci-eight/programs/fragmentShader',["require", "exports"], function (require, exports) {
    /**
     *
     */
    function fragmentShader(attributes, uniforms, vColor, vLight) {
        var lines = [];
        if (vColor) {
            lines.push("varying highp vec4 vColor;");
        }
        if (vLight) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void) {");
        var glFragColor = [];
        if (vLight) {
            if (vColor) {
                lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
            }
            else {
                lines.push("  gl_FragColor = vec4(vLight, 1.0);");
            }
        }
        else {
            if (vColor) {
                lines.push("  gl_FragColor = vColor;");
            }
            else {
                lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        lines.push("}");
        var code = lines.join("\n");
        return code;
    }
    return fragmentShader;
});

define('davinci-eight/programs/smartProgram',["require", "exports", './shaderProgram', '../core/Symbolic', '../checks/isDefined', '../programs/vertexShader', '../programs/fragmentShader'], function (require, exports, shaderProgram, Symbolic, isDefined, vertexShader, fragmentShader) {
    function vLightRequired(uniforms) {
        return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    function vColorRequired(attributes, uniforms) {
        return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
    }
    /**
     *
     */
    var smartProgram = function (attributes, uniformsList) {
        if (!isDefined(attributes)) {
            throw new Error("The attributes parameter is required for smartProgram.");
        }
        if (uniformsList) {
        }
        else {
            throw new Error("The uniformsList parameter is required for smartProgram.");
        }
        var uniforms = {};
        uniformsList.forEach(function (uniformsElement) {
            for (var name in uniformsElement) {
                uniforms[name] = uniformsElement[name];
            }
        });
        var vColor = vColorRequired(attributes, uniforms);
        var vLight = vLightRequired(uniforms);
        var innerProgram = shaderProgram(vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight));
        var publicAPI = {
            get program() {
                return innerProgram.program;
            },
            get programId() {
                return innerProgram.programId;
            },
            get attributeLocations() {
                return innerProgram.attributeLocations;
            },
            get attribSetters() {
                return innerProgram.attribSetters;
            },
            get uniformLocations() {
                return innerProgram.uniformLocations;
            },
            get uniformSetters() {
                return innerProgram.uniformSetters;
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
            setUniforms: function (values) {
                return innerProgram.setUniforms(values);
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
define('davinci-eight/math/Matrix3',["require", "exports", "gl-matrix", '../checks/expectArg'], function (require, exports, glMatrix, expectArg) {
    var Matrix3 = (function () {
        /**
         * Constructs the Matrix4 by wrapping a Float32Array.
         * @constructor
         */
        function Matrix3(elements) {
            expectArg('elements', elements)
                .toSatisfy(elements instanceof Float32Array, "elements must be a Float32Array")
                .toSatisfy(elements.length === 9, 'elements must have length 9');
            this.elements = elements;
        }
        Matrix3.identity = function () {
            return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
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
        Matrix3.prototype.identity = function () {
            return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
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
        Matrix3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
            var te = this.elements;
            te[0] = n11;
            te[3] = n12;
            te[6] = n13;
            te[1] = n21;
            te[4] = n22;
            te[7] = n23;
            te[2] = n31;
            te[5] = n32;
            te[8] = n33;
            return this;
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

define('davinci-eight/math/Quaternion',["require", "exports", '../math/Vector3'], function (require, exports, Vector3) {
    var EPS = 0.000001;
    var Quaternion = (function () {
        function Quaternion(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 1; }
            this.onChangeCallback = function () { };
            this._x = x;
            this._y = y;
            this._z = z;
            this._w = w;
        }
        Object.defineProperty(Quaternion.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quaternion.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quaternion.prototype, "z", {
            get: function () {
                return this._z;
            },
            set: function (value) {
                this._z = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quaternion.prototype, "w", {
            get: function () {
                return this._w;
            },
            set: function (value) {
                this._w = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Quaternion.prototype.set = function (x, y, z, w) {
            this._x = x;
            this._y = y;
            this._z = z;
            this._w = w;
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.clone = function () {
            return new Quaternion(this._x, this._y, this._z, this._w);
        };
        Quaternion.prototype.conjugate = function () {
            this._x *= -1;
            this._y *= -1;
            this._z *= -1;
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.copy = function (quaternion) {
            this._x = quaternion.x;
            this._y = quaternion.y;
            this._z = quaternion.z;
            this._w = quaternion.w;
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.dot = function (v) {
            return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
        };
        Quaternion.prototype.inverse = function () {
            this.conjugate().normalize();
            return this;
        };
        Quaternion.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        Quaternion.prototype.multiply = function (q) {
            return this.multiplyQuaternions(this, q);
        };
        Quaternion.prototype.multiplyQuaternions = function (a, b) {
            // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
            var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
            var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
            this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.normalize = function () {
            var l = this.magnitude();
            if (l === 0) {
                this._x = 0;
                this._y = 0;
                this._z = 0;
                this._w = 1;
            }
            else {
                l = 1 / l;
                this._x = this._x * l;
                this._y = this._y * l;
                this._z = this._z * l;
                this._w = this._w * l;
            }
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.onChange = function (callback) {
            this.onChangeCallback = callback;
            return this;
        };
        Quaternion.prototype.quaditude = function () {
            return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
        };
        Quaternion.prototype.setFromAxisAngle = function (axis, angle) {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
            // assumes axis is normalized
            var halfAngle = angle / 2, s = Math.sin(halfAngle);
            this._x = axis.x * s;
            this._y = axis.y * s;
            this._z = axis.z * s;
            this._w = Math.cos(halfAngle);
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.setFromRotationMatrix = function (m) {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
            var te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33, s;
            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                this._w = 0.25 / s;
                this._x = (m32 - m23) * s;
                this._y = (m13 - m31) * s;
                this._z = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
                this._w = (m32 - m23) / s;
                this._x = 0.25 * s;
                this._y = (m12 + m21) / s;
                this._z = (m13 + m31) / s;
            }
            else if (m22 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
                this._w = (m13 - m31) / s;
                this._x = (m12 + m21) / s;
                this._y = 0.25 * s;
                this._z = (m23 + m32) / s;
            }
            else {
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
                this._w = (m21 - m12) / s;
                this._x = (m13 + m31) / s;
                this._y = (m23 + m32) / s;
                this._z = 0.25 * s;
            }
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.setFromUnitVectors = function (vFrom, vTo) {
            // TODO: Could create circularity problems.
            var v1 = new Vector3();
            var r = vFrom.dot(vTo) + 1;
            if (r < EPS) {
                r = 0;
                if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                    v1.set(-vFrom.y, vFrom.x, 0);
                }
                else {
                    v1.set(0, -vFrom.z, vFrom.y);
                }
            }
            else {
                v1.crossVectors(vFrom, vTo);
            }
            this._x = v1.x;
            this._y = v1.y;
            this._z = v1.z;
            this._w = r;
            this.normalize();
            return this;
        };
        Quaternion.prototype.slerp = function (qb, t) {
            if (t === 0)
                return this;
            if (t === 1)
                return this.copy(qb);
            var x = this._x, y = this._y, z = this._z, w = this._w;
            // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
            var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
            if (cosHalfTheta < 0) {
                this._w = -qb._w;
                this._x = -qb._x;
                this._y = -qb._y;
                this._z = -qb._z;
                cosHalfTheta = -cosHalfTheta;
            }
            else {
                this.copy(qb);
            }
            if (cosHalfTheta >= 1.0) {
                this._w = w;
                this._x = x;
                this._y = y;
                this._z = z;
                return this;
            }
            var halfTheta = Math.acos(cosHalfTheta);
            var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < 0.001) {
                this._w = 0.5 * (w + this._w);
                this._x = 0.5 * (x + this._x);
                this._y = 0.5 * (y + this._y);
                this._z = 0.5 * (z + this._z);
                return this;
            }
            var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            this._w = (w * ratioA + this._w * ratioB);
            this._x = (x * ratioA + this._x * ratioB);
            this._y = (y * ratioA + this._y * ratioB);
            this._z = (z * ratioA + this._z * ratioB);
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.equals = function (quaternion) {
            return (quaternion._x === this._x) && (quaternion._y === this._y) && (quaternion._z === this._z) && (quaternion._w === this._w);
        };
        Quaternion.prototype.fromArray = function (array, offset) {
            if (offset === undefined)
                offset = 0;
            this._x = array[offset];
            this._y = array[offset + 1];
            this._z = array[offset + 2];
            this._w = array[offset + 3];
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.toArray = function (array, offset) {
            if (array === undefined)
                array = [];
            if (offset === undefined)
                offset = 0;
            array[offset] = this._x;
            array[offset + 1] = this._y;
            array[offset + 2] = this._z;
            array[offset + 3] = this._w;
            return array;
        };
        Quaternion.slerp = function (qa, qb, qm, t) {
            return qm.copy(qa).slerp(qb, t);
        };
        return Quaternion;
    })();
    return Quaternion;
});

define('davinci-eight/mesh/adapterOptions',["require", "exports", '../core/DrawMode', '../core/Symbolic'], function (require, exports, DrawMode, Symbolic) {
    function adapterOptions(options) {
        if (options === void 0) { options = {
            wireFrame: false
        }; }
        var drawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
        var elementUsage = options.elementUsage;
        var positionVarName = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
        var normalVarName = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
        return {
            drawMode: drawMode,
            elementUsage: elementUsage,
            positionVarName: positionVarName,
            normalVarName: normalVarName
        };
    }
    return adapterOptions;
});

define('davinci-eight/mesh/arrowMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/ArrowGeometry', '../mesh/adapterOptions', '../math/Spinor3'], function (require, exports, GeometryAdapter, ArrowGeometry, adapterOptions, Spinor3) {
    function arrowGeometry(options) {
        options = options || {};
        var scale = 1;
        var attitude = new Spinor3();
        var segments = 12;
        var length = 1;
        var radiusShaft = 0.01;
        var radiusCone = 0.08;
        return new ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, options.coneHeight, options.axis);
    }
    function arrowMesh(options) {
        var base = new GeometryAdapter(arrowGeometry(options), adapterOptions(options));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function () {
                return base.update();
            },
            getAttribArray: function (name) {
                return base.getAttribArray(name);
            },
            getAttribMeta: function () {
                return base.getAttribMeta();
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
            hasElementArray: function () {
                return base.hasElementArray();
            },
            getElementArray: function () {
                return base.getElementArray();
            }
        };
        return publicAPI;
    }
    return arrowMesh;
});

define('davinci-eight/mesh/ArrowBuilder',["require", "exports", '../checks/expectArg', '../checks/isUndefined', '../mesh/arrowMesh', '../math/Vector3'], function (require, exports, expectArg, isUndefined, arrowMesh, Vector3) {
    /**
     * @class ArrowBuilder
     */
    var ArrowBuilder = (function () {
        function ArrowBuilder(options) {
            this.$axis = Vector3.e3.clone();
            options = options || { modelMatrix: 'uModelMatrix' };
            //    this.setWidth(isUndefined(options.width) ? 1 : options.width);
            //    this.setHeight(isUndefined(options.height) ? 1 : options.height);
            //    this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
            //    this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
            //    this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
            //    this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
            this.setFlavor(isUndefined(options.flavor) ? 0 : options.flavor);
            this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
        }
        Object.defineProperty(ArrowBuilder.prototype, "axis", {
            get: function () {
                return this.$axis;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowBuilder.prototype, "flavor", {
            get: function () {
                return this.$flavor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowBuilder.prototype, "height", {
            get: function () {
                return this.$height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowBuilder.prototype, "depth", {
            get: function () {
                return this.$depth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowBuilder.prototype, "widthSegments", {
            get: function () {
                return this.$widthSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowBuilder.prototype, "heightSegments", {
            get: function () {
                return this.$heightSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowBuilder.prototype, "depthSegments", {
            get: function () {
                return this.$depthSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowBuilder.prototype, "coneHeight", {
            get: function () {
                return this.$coneHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowBuilder.prototype, "wireFrame", {
            get: function () {
                return this.$wireFrame;
            },
            enumerable: true,
            configurable: true
        });
        ArrowBuilder.prototype.setAxis = function (axis) {
            expectArg('axis', axis).toBeObject();
            this.$axis.copy(axis);
            return this;
        };
        ArrowBuilder.prototype.setFlavor = function (flavor) {
            expectArg('flavor', flavor).toBeNumber().toSatisfy(flavor >= 0, "flavor must be greater than or equal to zero.");
            this.$flavor = flavor;
            return this;
        };
        ArrowBuilder.prototype.setHeight = function (height) {
            expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
            this.$height = height;
            return this;
        };
        ArrowBuilder.prototype.setDepth = function (depth) {
            expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
            this.$depth = depth;
            return this;
        };
        ArrowBuilder.prototype.setWidthSegments = function (widthSegments) {
            expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
            this.$widthSegments = widthSegments;
            return this;
        };
        ArrowBuilder.prototype.setHeightSegments = function (heightSegments) {
            expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
            this.$heightSegments = heightSegments;
            return this;
        };
        ArrowBuilder.prototype.setDepthSegments = function (depthSegments) {
            expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
            this.$depthSegments = depthSegments;
            return this;
        };
        ArrowBuilder.prototype.setConeHeight = function (coneHeight) {
            expectArg('coneHeight', coneHeight).toBeNumber().toSatisfy(coneHeight >= 0, "coneHeight must be positive.");
            this.$coneHeight = coneHeight;
            return this;
        };
        ArrowBuilder.prototype.setWireFrame = function (wireFrame) {
            expectArg('wireFrame', wireFrame).toBeBoolean();
            this.$wireFrame = wireFrame;
            return this;
        };
        ArrowBuilder.prototype.buildMesh = function () {
            return arrowMesh(this);
        };
        return ArrowBuilder;
    })();
    return ArrowBuilder;
});

define('davinci-eight/mesh/boxMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/BoxGeometry', '../mesh/adapterOptions'], function (require, exports, GeometryAdapter, BoxGeometry, adapterOptions) {
    function boxGeometry(options) {
        options = options || {};
        return new BoxGeometry(options.width, options.height, options.depth, options.widthSegments, options.heightSegments, options.depthSegments, options.wireFrame);
    }
    function boxMesh(options) {
        var base = new GeometryAdapter(boxGeometry(options), adapterOptions(options));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function () {
                return base.update();
            },
            getAttribArray: function (name) {
                return base.getAttribArray(name);
            },
            getAttribMeta: function () {
                return base.getAttribMeta();
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
            hasElementArray: function () {
                return base.hasElementArray();
            },
            getElementArray: function () {
                return base.getElementArray();
            }
        };
        return publicAPI;
    }
    return boxMesh;
});

define('davinci-eight/mesh/BoxBuilder',["require", "exports", '../checks/expectArg', '../checks/isUndefined', '../mesh/boxMesh', '../core/Symbolic'], function (require, exports, expectArg, isUndefined, boxMesh, Symbolic) {
    /**
     * @class BoxBuilder
     */
    var BoxBuilder = (function () {
        function BoxBuilder(options) {
            options = options || {};
            this.setWidth(isUndefined(options.width) ? 1 : options.width);
            this.setHeight(isUndefined(options.height) ? 1 : options.height);
            this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
            this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
            this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
            this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
            this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
            this.setPositionVarName(isUndefined(options.positionVarName) ? Symbolic.ATTRIBUTE_POSITION : options.positionVarName);
            this.setNormalVarName(isUndefined(options.normalVarName) ? Symbolic.ATTRIBUTE_NORMAL : options.normalVarName);
        }
        Object.defineProperty(BoxBuilder.prototype, "width", {
            get: function () {
                return this.$width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxBuilder.prototype, "height", {
            get: function () {
                return this.$height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxBuilder.prototype, "depth", {
            get: function () {
                return this.$depth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxBuilder.prototype, "widthSegments", {
            get: function () {
                return this.$widthSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxBuilder.prototype, "heightSegments", {
            get: function () {
                return this.$heightSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxBuilder.prototype, "depthSegments", {
            get: function () {
                return this.$depthSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxBuilder.prototype, "wireFrame", {
            get: function () {
                return this.$wireFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxBuilder.prototype, "positionVarName", {
            get: function () {
                return this.$positionVarName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxBuilder.prototype, "normalVarName", {
            get: function () {
                return this.$normalVarName;
            },
            enumerable: true,
            configurable: true
        });
        BoxBuilder.prototype.setWidth = function (width) {
            expectArg('width', width).toBeNumber().toSatisfy(width >= 0, "width must be greater than or equal to zero.");
            this.$width = width;
            return this;
        };
        BoxBuilder.prototype.setHeight = function (height) {
            expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
            this.$height = height;
            return this;
        };
        BoxBuilder.prototype.setDepth = function (depth) {
            expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
            this.$depth = depth;
            return this;
        };
        BoxBuilder.prototype.setWidthSegments = function (widthSegments) {
            expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
            this.$widthSegments = widthSegments;
            return this;
        };
        BoxBuilder.prototype.setHeightSegments = function (heightSegments) {
            expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
            this.$heightSegments = heightSegments;
            return this;
        };
        BoxBuilder.prototype.setDepthSegments = function (depthSegments) {
            expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
            this.$depthSegments = depthSegments;
            return this;
        };
        BoxBuilder.prototype.setWireFrame = function (wireFrame) {
            expectArg('wireFrame', wireFrame).toBeBoolean();
            this.$wireFrame = wireFrame;
            return this;
        };
        BoxBuilder.prototype.setPositionVarName = function (positionVarName) {
            expectArg('positionVarName', positionVarName).toBeString();
            this.$positionVarName = positionVarName;
            return this;
        };
        BoxBuilder.prototype.setNormalVarName = function (normalVarName) {
            expectArg('normalVarName', normalVarName).toBeString();
            this.$normalVarName = normalVarName;
            return this;
        };
        BoxBuilder.prototype.buildMesh = function () {
            return boxMesh(this);
        };
        return BoxBuilder;
    })();
    return BoxBuilder;
});

define('davinci-eight/mesh/cylinderMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/CylinderGeometry', '../mesh/adapterOptions'], function (require, exports, GeometryAdapter, CylinderGeometry, adapterOptions) {
    function cylinderGeometry(options) {
        options = options || {};
        return new CylinderGeometry(options.radiusTop, options.radiusBottom, options.height, options.radialSegments, options.heightSegments, options.openEnded, options.thetaStart, options.thetaLength);
    }
    function cylinderMesh(options) {
        var base = new GeometryAdapter(cylinderGeometry(options), adapterOptions(options));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function () {
                return base.update();
            },
            getAttribArray: function (name) {
                return base.getAttribArray(name);
            },
            getAttribMeta: function () {
                return base.getAttribMeta();
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
            hasElementArray: function () {
                return base.hasElementArray();
            },
            getElementArray: function () {
                return base.getElementArray();
            }
        };
        return publicAPI;
    }
    return cylinderMesh;
});

define('davinci-eight/mesh/CylinderArgs',["require", "exports", '../checks/expectArg', '../checks/isUndefined', '../math/Vector3'], function (require, exports, expectArg, isUndefined, Vector3) {
    /**
     * @class CylinderArgs
     */
    var CylinderArgs = (function () {
        function CylinderArgs(options) {
            this.$axis = Vector3.e3.clone();
            options = options || { modelMatrix: 'uModelMatrix' };
            this.setRadiusTop(isUndefined(options.radiusTop) ? 1 : options.radiusTop);
            this.setRadiusBottom(isUndefined(options.radiusBottom) ? 1 : options.radiusBottom);
            this.setHeight(isUndefined(options.height) ? 1 : options.height);
            this.setRadialSegments(isUndefined(options.radialSegments) ? 16 : options.radialSegments);
            this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
            this.setOpenEnded(isUndefined(options.openEnded) ? false : options.openEnded);
            this.setThetaStart(isUndefined(options.thetaStart) ? 0 : options.thetaStart);
            this.setThetaLength(isUndefined(options.thetaLength) ? 2 * Math.PI : options.thetaLength);
            this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
        }
        Object.defineProperty(CylinderArgs.prototype, "radiusTop", {
            get: function () {
                return this.$radiusTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "radiusBottom", {
            get: function () {
                return this.$radiusBottom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "height", {
            get: function () {
                return this.$height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "radialSegments", {
            get: function () {
                return this.$radialSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "heightSegments", {
            get: function () {
                return this.$heightSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "openEnded", {
            get: function () {
                return this.$openEnded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "thetaStart", {
            get: function () {
                return this.$thetaStart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "thetaLength", {
            get: function () {
                return this.$thetaLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "wireFrame", {
            get: function () {
                return this.$wireFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderArgs.prototype, "axis", {
            get: function () {
                return this.$axis;
            },
            enumerable: true,
            configurable: true
        });
        CylinderArgs.prototype.setRadiusTop = function (radiusTop) {
            expectArg('radiusTop', radiusTop).toBeNumber().toSatisfy(radiusTop >= 0, "radiusTop must be greater than or equal to zero.");
            this.$radiusTop = radiusTop;
            return this;
        };
        CylinderArgs.prototype.setRadiusBottom = function (radiusBottom) {
            expectArg('radiusBottom', radiusBottom).toBeNumber().toSatisfy(radiusBottom >= 0, "radiusBottom must be greater than or equal to zero.");
            this.$radiusBottom = radiusBottom;
            return this;
        };
        CylinderArgs.prototype.setHeight = function (height) {
            expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
            this.$height = height;
            return this;
        };
        CylinderArgs.prototype.setRadialSegments = function (radialSegments) {
            expectArg('radialSegments', radialSegments).toBeNumber();
            this.$radialSegments = radialSegments;
            return this;
        };
        CylinderArgs.prototype.setHeightSegments = function (heightSegments) {
            expectArg('heightSegments', heightSegments).toBeNumber();
            this.$heightSegments = heightSegments;
            return this;
        };
        CylinderArgs.prototype.setOpenEnded = function (openEnded) {
            expectArg('openEnded', openEnded).toBeBoolean();
            this.$openEnded = openEnded;
            return this;
        };
        CylinderArgs.prototype.setThetaStart = function (thetaStart) {
            expectArg('thetaStart', thetaStart).toBeNumber();
            this.$thetaStart = thetaStart;
            return this;
        };
        CylinderArgs.prototype.setThetaLength = function (thetaLength) {
            expectArg('thetaLength', thetaLength).toBeNumber();
            this.$thetaLength = thetaLength;
            return this;
        };
        CylinderArgs.prototype.setWireFrame = function (wireFrame) {
            expectArg('wireFrame', wireFrame).toBeBoolean();
            this.$wireFrame = wireFrame;
            return this;
        };
        CylinderArgs.prototype.setAxis = function (axis) {
            expectArg('axis', axis).toBeObject();
            this.$axis.copy(axis);
            return this;
        };
        return CylinderArgs;
    })();
    return CylinderArgs;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/mesh/CylinderMeshBuilder',["require", "exports", '../mesh/CylinderArgs', '../mesh/cylinderMesh'], function (require, exports, CylinderArgs, cylinderMesh) {
    var CylinderMeshBuilder = (function (_super) {
        __extends(CylinderMeshBuilder, _super);
        function CylinderMeshBuilder(options) {
            _super.call(this, options);
        }
        CylinderMeshBuilder.prototype.setRadiusTop = function (radiusTop) {
            _super.prototype.setRadiusTop.call(this, radiusTop);
            return this;
        };
        CylinderMeshBuilder.prototype.setRadiusBottom = function (radiusBottom) {
            _super.prototype.setRadiusBottom.call(this, radiusBottom);
            return this;
        };
        CylinderMeshBuilder.prototype.setHeight = function (height) {
            _super.prototype.setHeight.call(this, height);
            return this;
        };
        CylinderMeshBuilder.prototype.setRadialSegments = function (radialSegments) {
            _super.prototype.setRadialSegments.call(this, radialSegments);
            return this;
        };
        CylinderMeshBuilder.prototype.setHeightSegments = function (heightSegments) {
            _super.prototype.setHeightSegments.call(this, heightSegments);
            return this;
        };
        CylinderMeshBuilder.prototype.setOpenEnded = function (openEnded) {
            _super.prototype.setOpenEnded.call(this, openEnded);
            return this;
        };
        CylinderMeshBuilder.prototype.setThetaStart = function (thetaStart) {
            _super.prototype.setThetaStart.call(this, thetaStart);
            return this;
        };
        CylinderMeshBuilder.prototype.setThetaLength = function (thetaLength) {
            _super.prototype.setThetaLength.call(this, thetaLength);
            return this;
        };
        CylinderMeshBuilder.prototype.setWireFrame = function (wireFrame) {
            _super.prototype.setWireFrame.call(this, wireFrame);
            return this;
        };
        CylinderMeshBuilder.prototype.buildMesh = function () {
            return cylinderMesh(this);
        };
        return CylinderMeshBuilder;
    })(CylinderArgs);
    return CylinderMeshBuilder;
});

define('davinci-eight/mesh/sphereMesh',["require", "exports", '../geometries/GeometryAdapter', '../geometries/SphereGeometry', '../mesh/adapterOptions'], function (require, exports, GeometryAdapter, SphereGeometry, adapterOptions) {
    function sphereGeometry(options) {
        options = options || {};
        return new SphereGeometry(options.radius, options.widthSegments, options.heightSegments, options.phiStart, options.phiLength, options.thetaStart, options.thetaLength);
    }
    function sphereMesh(options) {
        var base = new GeometryAdapter(sphereGeometry(options), adapterOptions(options));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function () {
                return base.update();
            },
            getAttribArray: function (name) {
                return base.getAttribArray(name);
            },
            getAttribMeta: function () {
                return base.getAttribMeta();
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
            hasElementArray: function () {
                return base.hasElementArray();
            },
            getElementArray: function () {
                return base.getElementArray();
            }
        };
        return publicAPI;
    }
    return sphereMesh;
});

define('davinci-eight/mesh/SphereBuilder',["require", "exports", '../checks/expectArg', '../checks/isUndefined', '../mesh/sphereMesh'], function (require, exports, expectArg, isUndefined, sphereMesh) {
    var SphereBuilder = (function () {
        function SphereBuilder(options) {
            options = options || {};
            this.setRadius(isUndefined(options.radius) ? 1 : options.radius);
            this.setPhiStart(isUndefined(options.phiStart) ? 0 : options.phiStart);
            this.setPhiLength(isUndefined(options.phiLength) ? 2 * Math.PI : options.phiLength);
            this.setThetaStart(isUndefined(options.thetaStart) ? 0 : options.thetaStart);
            this.setThetaLength(isUndefined(options.thetaLength) ? Math.PI : options.thetaLength);
            this.setWidthSegments(isUndefined(options.widthSegments) ? 16 : options.widthSegments);
            this.setHeightSegments(isUndefined(options.heightSegments) ? 12 : options.heightSegments);
            this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
        }
        Object.defineProperty(SphereBuilder.prototype, "radius", {
            get: function () {
                return this.$radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "phiStart", {
            get: function () {
                return this.$phiStart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "phiLength", {
            get: function () {
                return this.$phiLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "thetaStart", {
            get: function () {
                return this.$thetaStart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "thetaLength", {
            get: function () {
                return this.$thetaLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "widthSegments", {
            get: function () {
                return this.$widthSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "heightSegments", {
            get: function () {
                return this.$heightSegments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "wireFrame", {
            get: function () {
                return this.$wireFrame;
            },
            enumerable: true,
            configurable: true
        });
        SphereBuilder.prototype.setRadius = function (radius) {
            expectArg('radius', radius).toBeNumber().toSatisfy(radius >= 0, "radius must be greater than or equal to zero.");
            this.$radius = radius;
            return this;
        };
        SphereBuilder.prototype.setPhiStart = function (phiStart) {
            expectArg('phiStart', phiStart).toBeNumber();
            this.$phiStart = phiStart;
            return this;
        };
        SphereBuilder.prototype.setPhiLength = function (phiLength) {
            expectArg('phiLength', phiLength).toBeNumber();
            this.$phiLength = phiLength;
            return this;
        };
        SphereBuilder.prototype.setThetaStart = function (thetaStart) {
            expectArg('thetaStart', thetaStart).toBeNumber();
            this.$thetaStart = thetaStart;
            return this;
        };
        SphereBuilder.prototype.setThetaLength = function (thetaLength) {
            expectArg('thetaLength', thetaLength).toBeNumber();
            this.$thetaLength = thetaLength;
            return this;
        };
        SphereBuilder.prototype.setWidthSegments = function (widthSegments) {
            expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
            this.$widthSegments = widthSegments;
            return this;
        };
        SphereBuilder.prototype.setHeightSegments = function (heightSegments) {
            expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
            this.$heightSegments = heightSegments;
            return this;
        };
        SphereBuilder.prototype.setWireFrame = function (wireFrame) {
            expectArg('wireFrame', wireFrame).toBeBoolean();
            this.$wireFrame = wireFrame;
            return this;
        };
        SphereBuilder.prototype.buildMesh = function () {
            return sphereMesh(this);
        };
        return SphereBuilder;
    })();
    return SphereBuilder;
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
            update: function () {
                return base.update();
            },
            getAttribArray: function (name) {
                return base.getAttribArray(name);
            },
            getAttribMeta: function () {
                return base.getAttribMeta();
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
            hasElementArray: function () {
                return base.hasElementArray();
            },
            getElementArray: function () {
                return base.getElementArray();
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
define('davinci-eight/uniforms/TreeModel',["require", "exports", '../core/DefaultUniformProvider'], function (require, exports, DefaultUniformProvider) {
    /**
     * @class TreeModel
     * @extends DefaultUniformProvider
     */
    var TreeModel = (function (_super) {
        __extends(TreeModel, _super);
        /**
         * @class Model
         * @constructor
         */
        function TreeModel() {
            _super.call(this);
            this.children = [];
        }
        TreeModel.prototype.getParent = function () {
            return this.parent;
        };
        TreeModel.prototype.setParent = function (parent) {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            if (parent) {
                parent.addChild(this);
            }
            this.parent = parent;
        };
        TreeModel.prototype.addChild = function (child) {
            this.children.push(this);
        };
        TreeModel.prototype.removeChild = function (child) {
            var index = this.children.indexOf(child);
            if (index >= 0) {
                this.children.splice(index, 1);
            }
        };
        TreeModel.prototype.getUniformVector3 = function (name) {
            if (this.parent) {
                return this.parent.getUniformVector3(name);
            }
            else {
                return _super.prototype.getUniformVector3.call(this, name);
            }
        };
        /**
         * @method getUniformMatrix3
         * @param name {string}
         */
        TreeModel.prototype.getUniformMatrix3 = function (name) {
            if (this.parent) {
                return this.parent.getUniformMatrix3(name);
            }
            else {
                return _super.prototype.getUniformMatrix3.call(this, name);
            }
        };
        /**
         * @method getUniformMatrix4
         * @param name {string}
         */
        TreeModel.prototype.getUniformMatrix4 = function (name) {
            if (this.parent) {
                return this.parent.getUniformMatrix4(name);
            }
            else {
                return _super.prototype.getUniformMatrix4.call(this, name);
            }
        };
        /**
         * @method getUniformMeta
         */
        TreeModel.prototype.getUniformMeta = function () {
            if (this.parent) {
                return this.parent.getUniformMeta();
            }
            else {
                return _super.prototype.getUniformMeta.call(this);
            }
        };
        /**
         * @method getUniformData
         */
        TreeModel.prototype.getUniformData = function () {
            if (this.parent) {
                return this.parent.getUniformData();
            }
            else {
                return _super.prototype.getUniformData.call(this);
            }
        };
        return TreeModel;
    })(DefaultUniformProvider);
    return TreeModel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformVec3',["require", "exports", '../core/DefaultUniformProvider', '../utils/uuid4', '../checks/expectArg', '../checks/isDefined'], function (require, exports, DefaultUniformProvider, uuid4, expectArg, isDefined) {
    var UniformVec3 = (function (_super) {
        __extends(UniformVec3, _super);
        function UniformVec3(name, id) {
            _super.call(this);
            this.useData = false;
            this.useCallback = false;
            this.$name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
            this.$varName = isDefined(this.$name) ? this.$name : this.id;
        }
        Object.defineProperty(UniformVec3.prototype, "data", {
            get: function () {
                return this.$data;
            },
            set: function (data) {
                this.$data = data;
                if (typeof data !== void 0) {
                    expectArg('data', data).toSatisfy(data.length === 3, "data.length must be 3");
                    this.useData = true;
                    this.useCallback = false;
                }
                else {
                    this.useData = false;
                    this.$callback = void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformVec3.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                if (typeof callback !== void 0) {
                    this.useCallback = true;
                    this.useData = false;
                }
                else {
                    this.useCallback = false;
                    this.$data = void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        UniformVec3.prototype.getUniformVector3 = function (name) {
            switch (name) {
                case this.$varName:
                    {
                        if (this.useData) {
                            return this.$data;
                        }
                        else if (this.useCallback) {
                            return this.$callback();
                        }
                        else {
                            var message = "uniform vec3 " + this.$varName + " has not been assigned a data or callback.";
                            console.warn(message);
                            throw new Error(message);
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformVector3.call(this, name);
                }
            }
        };
        UniformVec3.prototype.getUniformMeta = function () {
            var uniforms = _super.prototype.getUniformMeta.call(this);
            if (isDefined(this.$name)) {
                uniforms[this.id] = { name: this.$name, glslType: 'vec3' };
            }
            else {
                uniforms[this.id] = { glslType: 'vec3' };
            }
            return uniforms;
        };
        UniformVec3.prototype.getUniformData = function () {
            var data = _super.prototype.getUniformData.call(this);
            var value = this.useData ? this.$data : this.$callback();
            data[this.$varName] = { vector: value };
            return data;
        };
        return UniformVec3;
    })(DefaultUniformProvider);
    return UniformVec3;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformColor',["require", "exports", '../core/Color', '../core/DefaultUniformProvider', '../uniforms/UniformVec3'], function (require, exports, Color, DefaultUniformProvider, UniformVec3) {
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
            this.inner = new UniformVec3(name, id);
        }
        Object.defineProperty(UniformColor.prototype, "data", {
            get: function () {
                var data = this.inner.data;
                if (data) {
                    return new Color(data);
                }
                else {
                    return;
                }
            },
            set: function (color) {
                this.inner.data = color.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformColor.prototype, "callback", {
            set: function (callback) {
                this.inner.callback = function () {
                    var color = callback();
                    return color.data;
                };
            },
            enumerable: true,
            configurable: true
        });
        UniformColor.prototype.getUniformVector3 = function (name) {
            return this.inner.getUniformVector3(name);
        };
        UniformColor.prototype.getUniformMeta = function () {
            return this.inner.getUniformMeta();
        };
        UniformColor.prototype.getUniformData = function () {
            return this.inner.getUniformData();
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
define('davinci-eight/uniforms/Node',["require", "exports", '../math/Matrix3', '../math/Matrix4', '../uniforms/TreeModel', '../math/Spinor3', '../core/Symbolic', '../math/Vector3', '../core/Color', '../uniforms/UniformColor'], function (require, exports, Matrix3, Matrix4, TreeModel, Spinor3, Symbolic, Vector3, Color, UniformColor) {
    function localMatrix(scale, attitude, position) {
        var S = Matrix4.identity();
        S.scaling(scale);
        var T = Matrix4.identity();
        T.translation(position);
        var R = Matrix4.identity();
        R.rotation(attitude);
        T.mul(R.mul(S));
        return T;
    }
    /**
     * @class Node
     * @extends TreeModel
     */
    var Node = (function (_super) {
        __extends(Node, _super);
        /**
         * @class Model
         * @constructor
         */
        function Node(options) {
            _super.call(this);
            options = options || {};
            this.modelMatrixName = options.modelMatrixName || Symbolic.UNIFORM_MODEL_MATRIX;
            this.normalMatrixName = options.normalMatrixName || Symbolic.UNIFORM_NORMAL_MATRIX;
            this.colorVarName = options.colorVarName || Symbolic.UNIFORM_COLOR;
            this.position = new Vector3();
            this.attitude = new Spinor3();
            this.scale = new Vector3([1, 1, 1]);
            this.uColor = new UniformColor(this.colorVarName, Symbolic.UNIFORM_COLOR);
        }
        Object.defineProperty(Node.prototype, "color", {
            get: function () {
                return this.uColor.data;
            },
            set: function (color) {
                this.uColor.data = color;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method getUniformVector3
         * @param name {string}
         */
        Node.prototype.getUniformVector3 = function (name) {
            //console.log("getUniformVector3(name='" + name + "')");
            switch (name) {
                case this.colorVarName:
                    {
                        if (this.uColor.data) {
                            return this.uColor.getUniformVector3(name);
                        }
                        else if (this.getParent()) {
                            return this.getParent().getUniformVector3(name);
                        }
                        else {
                            return Color.fromRGB(1, 1, 1).data;
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformVector3.call(this, name);
                }
            }
        };
        Node.prototype.getNormalMatrix = function () {
            // It's unfortunate that we have to recompute the model-view matrix.
            // We could cache it, being careful that we don't assume the callback order.
            // We don't want to compute it in the shader beacause that would be per-vertex.
            var normalMatrix = Matrix3.identity();
            var mv = localMatrix(this.scale, this.attitude, this.position);
            normalMatrix.normalFromMatrix4(mv);
            // TODO: elements in Matrix3 should already be Float32Array
            return normalMatrix.elements;
        };
        /**
         * @method getUniformMatrix3
         * @param name {string}
         */
        Node.prototype.getUniformMatrix3 = function (name) {
            switch (name) {
                case this.normalMatrixName:
                    {
                        return { transpose: false, matrix3: this.getNormalMatrix() };
                    }
                    break;
                default: {
                    return _super.prototype.getUniformMatrix3.call(this, name);
                }
            }
        };
        Node.prototype.getModelMatrix = function () {
            if (this.getParent()) {
                var um4 = this.getParent().getUniformMatrix4(name);
                if (um4) {
                    var m1 = new Matrix4(um4.matrix4);
                    var m2 = localMatrix(this.scale, this.attitude, this.position);
                    var m = Matrix4.identity().multiplyMatrices(m1, m2);
                    return m.elements;
                }
                else {
                    var m = localMatrix(this.scale, this.attitude, this.position);
                    return m.elements;
                }
            }
            else {
                var m = localMatrix(this.scale, this.attitude, this.position);
                return m.elements;
            }
        };
        /**
         * @method getUniformMatrix4
         * @param name {string}
         */
        Node.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case this.modelMatrixName:
                    {
                        return { transpose: false, matrix4: this.getModelMatrix() };
                    }
                    break;
                default: {
                    return this.uColor.getUniformMatrix4(name);
                }
            }
        };
        /**
         * @method getUniformMeta
         */
        Node.prototype.getUniformMeta = function () {
            var uniforms = this.uColor.getUniformMeta();
            uniforms[Symbolic.UNIFORM_MODEL_MATRIX] = { name: this.modelMatrixName, glslType: 'mat4' };
            uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = { name: this.normalMatrixName, glslType: 'mat3' };
            return uniforms;
        };
        /**
         * @method getUniformData
         */
        Node.prototype.getUniformData = function () {
            var data = this.uColor.getUniformData();
            data[Symbolic.UNIFORM_MODEL_MATRIX] = {
                transpose: false,
                matrix3: void 0,
                matrix4: this.getModelMatrix(),
                uniformZs: void 0
            };
            data[Symbolic.UNIFORM_NORMAL_MATRIX] = {
                transpose: false,
                matrix3: this.getNormalMatrix(),
                matrix4: void 0,
                uniformZs: void 0
            };
            return data;
        };
        return Node;
    })(TreeModel);
    return Node;
});

define('davinci-eight/objects/Arrow3D',["require", "exports", '../mesh/CylinderMeshBuilder', '../objects/primitive', '../programs/smartProgram', '../uniforms/Node', '../checks/isDefined'], function (require, exports, CylinderMeshBuilder, primitive, smartProgram, Node, isDefined) {
    var Arrow3D = (function () {
        function Arrow3D(ambients, options) {
            this.$magnitude = 1;
            options = options || {};
            this.$coneHeight = isDefined(options.coneHeight) ? options.coneHeight : 0.2;
            this.model = new Node();
            var headMesh = new CylinderMeshBuilder(options).setRadiusTop(0.0).setRadiusBottom(0.08).setHeight(this.$coneHeight).buildMesh();
            var tailMesh = new CylinderMeshBuilder(options).setRadiusTop(0.01).setRadiusBottom(0.01).buildMesh();
            this.program = smartProgram(headMesh.getAttribMeta(), [this.model.getUniformMeta(), ambients.getUniformMeta()]);
            this.headModel = new Node();
            this.headModel.setParent(this.model);
            this.head = primitive(headMesh, this.program, this.headModel);
            this.tailModel = new Node();
            this.tailModel.setParent(this.model);
            this.setMagnitude(1);
            this.tail = primitive(tailMesh, this.program, this.tailModel);
        }
        Object.defineProperty(Arrow3D.prototype, "magnitude", {
            get: function () {
                return this.tailModel.scale.y + this.$coneHeight;
            },
            set: function (value) {
                this.setMagnitude(value);
            },
            enumerable: true,
            configurable: true
        });
        Arrow3D.prototype.setMagnitude = function (magnitude) {
            this.headModel.position.y = (magnitude - this.$coneHeight) / 2;
            this.tailModel.scale.y = magnitude - this.$coneHeight;
            this.tailModel.position.y = -this.$coneHeight / 2;
            return this;
        };
        Arrow3D.prototype.draw = function () {
            this.head.draw();
            this.tail.draw();
        };
        Arrow3D.prototype.contextFree = function () {
            this.head.contextFree();
            this.tail.contextFree();
        };
        Arrow3D.prototype.contextGain = function (context, contextId) {
            this.head.contextGain(context, contextId);
            this.tail.contextGain(context, contextId);
        };
        Arrow3D.prototype.contextLoss = function () {
            this.head.contextLoss();
            this.tail.contextLoss();
        };
        Arrow3D.prototype.hasContext = function () {
            return this.head.hasContext();
        };
        return Arrow3D;
    })();
    return Arrow3D;
});

define('davinci-eight/objects/arrow',["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/arrowMesh', '../programs/smartProgram', '../objects/Arrow3D', '../checks/expectArg', '../checks/isDefined'], function (require, exports, Node, primitive, arrowMesh, smartProgram, Arrow3D, expectArg, isDefined) {
    var ArrowWrapper = (function () {
        function ArrowWrapper(primitive) {
            this.primitive = primitive;
        }
        Object.defineProperty(ArrowWrapper.prototype, "model", {
            get: function () {
                return this.primitive.model;
            },
            enumerable: true,
            configurable: true
        });
        ArrowWrapper.prototype.setMagnitude = function (magnitude) {
            expectArg('magnitude', magnitude).toBeNumber().toSatisfy(magnitude >= 0, "magnitude must be positive");
            this.primitive.model.scale.x = magnitude;
            this.primitive.model.scale.y = magnitude;
            this.primitive.model.scale.z = magnitude;
            return this;
        };
        Object.defineProperty(ArrowWrapper.prototype, "program", {
            get: function () {
                return this.primitive.program;
            },
            enumerable: true,
            configurable: true
        });
        ArrowWrapper.prototype.draw = function () {
            return this.primitive.draw();
        };
        ArrowWrapper.prototype.contextFree = function () {
            return this.primitive.contextFree();
        };
        ArrowWrapper.prototype.contextGain = function (context, contextId) {
            return this.primitive.contextGain(context, contextId);
        };
        ArrowWrapper.prototype.contextLoss = function () {
            return this.primitive.contextLoss();
        };
        ArrowWrapper.prototype.hasContext = function () {
            return this.primitive.hasContext();
        };
        return ArrowWrapper;
    })();
    // TODO" Should only take the UniformMetaInfos for construction.
    function arrow(ambients, options) {
        options = options || {};
        var flavor = isDefined(options.flavor) ? options.flavor : 0;
        if (flavor === 0) {
            var mesh = arrowMesh(options);
            var model = new Node(options);
            var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
            return new ArrowWrapper(primitive(mesh, shaders, model));
        }
        else {
            return new Arrow3D(ambients, options);
        }
    }
    return arrow;
});

define('davinci-eight/objects/box',["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/boxMesh', '../programs/smartProgram'], function (require, exports, Node, primitive, boxMesh, smartProgram) {
    function box(ambients, options) {
        var mesh = boxMesh(options);
        var model = new Node();
        var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return primitive(mesh, program, model);
    }
    return box;
});

define('davinci-eight/objects/cylinder',["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/cylinderMesh', '../programs/smartProgram'], function (require, exports, Node, primitive, cylinderMesh, smartProgram) {
    function cylinder(ambients, options) {
        var mesh = cylinderMesh(options);
        var model = new Node();
        var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return primitive(mesh, program, model);
    }
    return cylinder;
});

define('davinci-eight/objects/sphere',["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, Node, primitive, sphereMesh, smartProgram) {
    function sphere(ambients, options) {
        var mesh = sphereMesh(options);
        var model = new Node();
        // TODO: Inject a program manager.
        // Would be nice to have dependency injection?
        var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return primitive(mesh, program, model);
    }
    return sphere;
});

define('davinci-eight/objects/vortex',["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/vortexMesh', '../programs/smartProgram'], function (require, exports, Node, primitive, vortexMesh, smartProgram) {
    function vortex(ambients) {
        var mesh = vortexMesh();
        var model = new Node();
        var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return primitive(mesh, program, model);
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
                sum += current.distanceTo(last);
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

define('davinci-eight/renderers/renderer',["require", "exports", '../checks/expectArg', '../core/Color', '../programs/setUniforms'], function (require, exports, expectArg, Color, setUniforms) {
    var renderer = function (canvas, parameters) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        parameters = parameters || {};
        var gl;
        var glId;
        var autoClear = true;
        var clearColor = Color.fromRGB(0, 0, 0);
        var clearAlpha = 0;
        var self = {
            get canvas() { return canvas; },
            get context() { return gl; },
            contextFree: function () {
                gl = void 0;
                glId = void 0;
            },
            contextGain: function (context, contextId) {
                expectArg('contextId', contextId).toBeString();
                var attributes = context.getContextAttributes();
                //console.log(context.getParameter(context.VERSION));
                //console.log("alpha                 => " + attributes.alpha);
                //console.log("antialias             => " + attributes.antialias);
                //console.log("depth                 => " + attributes.depth);
                //console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
                //console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
                //console.log("stencil               => " + attributes.stencil);
                gl = context;
                glId = contextId;
                gl.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearAlpha);
                gl.clearDepth(1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.viewport(0, 0, canvas.width, canvas.height);
            },
            contextLoss: function () {
                gl = void 0;
                glId = void 0;
            },
            hasContext: function () {
                return !!gl;
            },
            get autoClear() {
                return autoClear;
            },
            set autoClear(value) {
                expectArg('autoClear', value).toBeBoolean();
                autoClear = value;
            },
            clearColor: function (red, green, blue, alpha) {
                clearColor.red = red;
                clearColor.green = green;
                clearColor.blue = blue;
                clearAlpha = alpha;
                if (gl) {
                    gl.clearColor(red, green, blue, alpha);
                }
                return self;
            },
            render: function (drawList, ambients) {
                var program;
                expectArg('drawList', drawList).toNotBeNull();
                if (gl) {
                    if (autoClear) {
                        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    }
                    if (!drawList.hasContext()) {
                        drawList.contextGain(gl, glId);
                    }
                    var programLoaded;
                    for (var drawGroupName in drawList.drawGroups) {
                        programLoaded = false;
                        drawList.drawGroups[drawGroupName].forEach(function (drawable) {
                            if (!programLoaded) {
                                var program_1 = drawable.program.use();
                                if (ambients) {
                                    setUniforms(drawable.program.uniformSetters, ambients.getUniformData());
                                }
                                programLoaded = true;
                            }
                            drawable.draw();
                        });
                    }
                }
                else {
                    console.warn("renderer is unable to render because WebGLRenderingContext is missing");
                }
            },
        };
        return self;
    };
    return renderer;
});

define('davinci-eight/uniforms/AmbientLight',["require", "exports", '../core/Color', '../core/Symbolic', '../uniforms/UniformColor'], function (require, exports, Color, Symbolic, UniformColor) {
    /**
     * Provides a uniform variable representing an ambient light.
     * @class AmbientLight
     */
    var AmbientLight = (function () {
        /**
         * @class AmbientLight
         * @constructor
         * @param options {{color?: Color; name?: string}}
         */
        function AmbientLight(options) {
            options = options || {};
            options.color = options.color || new Color([1.0, 1.0, 1.0]);
            //    options.name = options.name || Symbolic.UNIFORM_AMBIENT_LIGHT;
            //    expectArg('options.name', options.name).toBeString().toSatisfy(options.name.length > 0, "options.name must have at least one character");
            this.uColor = new UniformColor(options.name, Symbolic.UNIFORM_AMBIENT_LIGHT);
            this.uColor.data = options.color;
        }
        Object.defineProperty(AmbientLight.prototype, "color", {
            get: function () {
                return this.uColor;
            },
            set: function (color) {
                throw new Error("color is readonly");
            },
            enumerable: true,
            configurable: true
        });
        AmbientLight.prototype.getUniformFloat = function (name) {
            return this.uColor.getUniformFloat(name);
        };
        AmbientLight.prototype.getUniformMatrix2 = function (name) {
            return this.uColor.getUniformMatrix2(name);
        };
        AmbientLight.prototype.getUniformMatrix3 = function (name) {
            return this.uColor.getUniformMatrix3(name);
        };
        AmbientLight.prototype.getUniformMatrix4 = function (name) {
            return this.uColor.getUniformMatrix4(name);
        };
        AmbientLight.prototype.getUniformVector2 = function (name) {
            return this.uColor.getUniformVector2(name);
        };
        AmbientLight.prototype.getUniformVector3 = function (name) {
            return this.uColor.getUniformVector3(name);
        };
        AmbientLight.prototype.getUniformVector4 = function (name) {
            return this.uColor.getUniformVector4(name);
        };
        AmbientLight.prototype.getUniformMeta = function () {
            return this.uColor.getUniformMeta();
        };
        AmbientLight.prototype.getUniformData = function () {
            return this.uColor.getUniformData();
        };
        return AmbientLight;
    })();
    return AmbientLight;
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
        ChainedUniformProvider.prototype.getUniformMeta = function () {
            var uniforms = {};
            var ones = this.provider.getUniformMeta();
            for (name in ones) {
                uniforms[name] = ones[name];
            }
            var twos = this.fallback.getUniformMeta();
            for (name in twos) {
                uniforms[name] = twos[name];
            }
            return uniforms;
        };
        ChainedUniformProvider.prototype.getUniformData = function () {
            var data = {};
            var ones = this.provider.getUniformData();
            for (name in ones) {
                data[name] = ones[name];
            }
            var twos = this.fallback.getUniformData();
            for (name in twos) {
                data[name] = twos[name];
            }
            return data;
        };
        return ChainedUniformProvider;
    })();
    return ChainedUniformProvider;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/MultiUniformProvider',["require", "exports", '../core/DefaultUniformProvider'], function (require, exports, DefaultUniformProvider) {
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
        MultiUniformProvider.prototype.getUniformMeta = function () {
            var meta = _super.prototype.getUniformMeta.call(this);
            this.providers.forEach(function (provider) {
                var metas = provider.getUniformMeta();
                for (var id in metas) {
                    meta[id] = metas[id];
                }
            });
            return meta;
        };
        MultiUniformProvider.prototype.getUniformData = function () {
            var data = _super.prototype.getUniformData.call(this);
            this.providers.forEach(function (provider) {
                var datas = provider.getUniformData();
                for (var id in datas) {
                    data[id] = datas[id];
                }
            });
            return data;
        };
        return MultiUniformProvider;
    })(DefaultUniformProvider);
    return MultiUniformProvider;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniformVector3',["require", "exports", '../math/Vector3', '../core/DefaultUniformProvider', '../uniforms/UniformVec3'], function (require, exports, Vector3, DefaultUniformProvider, UniformVec3) {
    /**
     * Provides a uniform variable with the Vector3 data type.
     * @class UniformVector3
     */
    var UniformVector3 = (function (_super) {
        __extends(UniformVector3, _super);
        /**
         * @class UniformVector3
         * @constructor
         */
        function UniformVector3(name, id) {
            _super.call(this);
            this.inner = new UniformVec3(name, id);
        }
        Object.defineProperty(UniformVector3.prototype, "data", {
            get: function () {
                var data = this.inner.data;
                if (data) {
                    return new Vector3(data);
                }
                else {
                    return;
                }
            },
            set: function (vector) {
                this.inner.data = vector.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformVector3.prototype, "callback", {
            set: function (callback) {
                this.inner.callback = function () {
                    var vector = callback();
                    return vector.data;
                };
            },
            enumerable: true,
            configurable: true
        });
        UniformVector3.prototype.getUniformVector3 = function (name) {
            return this.inner.getUniformVector3(name);
        };
        UniformVector3.prototype.getUniformMeta = function () {
            return this.inner.getUniformMeta();
        };
        UniformVector3.prototype.getUniformData = function () {
            return this.inner.getUniformData();
        };
        return UniformVector3;
    })(DefaultUniformProvider);
    return UniformVector3;
});

define('davinci-eight/uniforms/DirectionalLight',["require", "exports", '../core/Color', '../uniforms/MultiUniformProvider', '../core/Symbolic', '../uniforms/UniformColor', '../uniforms/UniformVector3', '../math/Vector3', '../checks/isDefined'], function (require, exports, Color, MultiUniformProvider, Symbolic, UniformColor, UniformVector3, Vector3, isDefined) {
    /**
     * Provides a uniform variable representing a directional light.
     * @class DirectionalLight
     */
    var DirectionalLight = (function () {
        /**
         * @class DirectionalLight
         * @constructor
         */
        function DirectionalLight(options) {
            options = options || {};
            options.color = options.color || new Color([1.0, 1.0, 1.0]);
            var direction = isDefined(options.direction) ? options.direction : { x: 0, y: 0, z: -1 };
            var colorName = isDefined(options.name) ? options.name + 'Color' : void 0;
            var directionName = isDefined(options.name) ? options.name + 'Direction' : void 0;
            this.uColor = new UniformColor(colorName, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR);
            this.uDirection = new UniformVector3(directionName, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION);
            this.multi = new MultiUniformProvider([this.uColor, this.uDirection]);
            this.uColor.data = options.color;
            this.uDirection.data = new Vector3().copy(direction);
        }
        Object.defineProperty(DirectionalLight.prototype, "color", {
            get: function () {
                return this.uColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectionalLight.prototype, "direction", {
            get: function () {
                return this.uDirection;
            },
            enumerable: true,
            configurable: true
        });
        DirectionalLight.prototype.getUniformFloat = function (name) {
            return this.multi.getUniformFloat(name);
        };
        DirectionalLight.prototype.getUniformMatrix2 = function (name) {
            return this.multi.getUniformMatrix2(name);
        };
        DirectionalLight.prototype.getUniformMatrix3 = function (name) {
            return this.multi.getUniformMatrix3(name);
        };
        DirectionalLight.prototype.getUniformMatrix4 = function (name) {
            return this.multi.getUniformMatrix4(name);
        };
        DirectionalLight.prototype.getUniformVector2 = function (name) {
            return this.multi.getUniformVector2(name);
        };
        DirectionalLight.prototype.getUniformVector3 = function (name) {
            return this.multi.getUniformVector3(name);
        };
        DirectionalLight.prototype.getUniformVector4 = function (name) {
            return this.multi.getUniformVector4(name);
        };
        DirectionalLight.prototype.getUniformMeta = function () {
            return this.multi.getUniformMeta();
        };
        DirectionalLight.prototype.getUniformData = function () {
            return this.multi.getUniformData();
        };
        return DirectionalLight;
    })();
    return DirectionalLight;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/LocalModel',["require", "exports", '../math/Matrix3', '../math/Matrix4', '../core/DefaultUniformProvider', '../math/Spinor3', '../core/Symbolic', '../math/Vector3', '../core/Color', '../uniforms/UniformColor'], function (require, exports, Matrix3, Matrix4, DefaultUniformProvider, Spinor3, Symbolic, Vector3, Color, UniformColor) {
    var UNIFORM_MODEL_MATRIX_NAME = 'uModelMatrix';
    var UNIFORM_MODEL_MATRIX_TYPE = 'mat4';
    var UNIFORM_NORMAL_MATRIX_NAME = 'uNormalMatrix';
    var UNIFORM_NORMAL_MATRIX_TYPE = 'mat3';
    var UNIFORM_COLOR_NAME = 'uColor';
    function modelViewMatrix(position, attitude) {
        var matrix = Matrix4.identity();
        matrix.translation(position);
        var rotation = Matrix4.identity();
        rotation.rotation(attitude);
        matrix.mul(rotation);
        return matrix;
    }
    /**
     * @class LocalModel
     * @extends DefaultUniformProvider
     */
    var LocalModel = (function (_super) {
        __extends(LocalModel, _super);
        /**
         * @class Model
         * @constructor
         */
        function LocalModel() {
            _super.call(this);
            this.position = new Vector3();
            this.attitude = new Spinor3();
            this.scale = new Vector3([1, 1, 1]);
            this.uColor = new UniformColor(UNIFORM_COLOR_NAME, Symbolic.UNIFORM_COLOR);
            this.uColor.data = Color.fromRGB(1, 1, 1);
        }
        Object.defineProperty(LocalModel.prototype, "color", {
            get: function () {
                return this.uColor.data;
            },
            set: function (color) {
                this.uColor.data = color;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method getUniformVector3
         * @param name {string}
         */
        LocalModel.prototype.getUniformVector3 = function (name) {
            return this.uColor.getUniformVector3(name);
        };
        /**
         * @method getUniformMatrix3
         * @param name {string}
         */
        LocalModel.prototype.getUniformMatrix3 = function (name) {
            switch (name) {
                case UNIFORM_NORMAL_MATRIX_NAME:
                    {
                        // It's unfortunate that we have to recompute the model-view matrix.
                        // We could cache it, being careful that we don't assume the callback order.
                        // We don't want to compute it in the shader beacause that would be per-vertex.
                        var normalMatrix = Matrix3.identity();
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
        LocalModel.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case UNIFORM_MODEL_MATRIX_NAME:
                    {
                        var elements = modelViewMatrix(this.position, this.attitude).elements;
                        return { transpose: false, matrix4: new Float32Array(elements) };
                    }
                    break;
                default: {
                    return this.uColor.getUniformMatrix4(name);
                }
            }
        };
        /**
         * @method getUniformMeta
         */
        LocalModel.prototype.getUniformMeta = function () {
            var uniforms = this.uColor.getUniformMeta();
            uniforms[Symbolic.UNIFORM_MODEL_MATRIX] = { name: UNIFORM_MODEL_MATRIX_NAME, glslType: UNIFORM_MODEL_MATRIX_TYPE };
            uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = { name: UNIFORM_NORMAL_MATRIX_NAME, glslType: UNIFORM_NORMAL_MATRIX_TYPE };
            return uniforms;
        };
        return LocalModel;
    })(DefaultUniformProvider);
    return LocalModel;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/uniforms/UniversalJoint',["require", "exports", '../math/Matrix4', '../uniforms/TreeModel', '../math/Spinor3', '../core/Symbolic', '../checks/isUndefined'], function (require, exports, Matrix4, TreeModel, Spinor3, Symbolic, isUndefined) {
    function localMatrix(attitude) {
        // TODO: Why don't we have a static constructor?
        var matrix = Matrix4.identity();
        matrix.rotation(attitude);
        return matrix;
    }
    function attitude(theta, phi) {
        var c = Math.cos(theta / 2);
        var s = Math.sin(theta / 2);
        return new Spinor3([s * Math.sin(phi), -s * Math.cos(phi), 0, c]);
    }
    var UniversalJoint = (function (_super) {
        __extends(UniversalJoint, _super);
        function UniversalJoint(options) {
            _super.call(this);
            this.theta = 0;
            this.phi = 0;
            options = options || {};
            this.modelMatrixVarName = isUndefined(options.modelMatrixVarName) ? Symbolic.UNIFORM_MODEL_MATRIX : options.modelMatrixVarName;
        }
        UniversalJoint.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case this.modelMatrixVarName:
                    {
                        if (this.getParent()) {
                            var m1 = new Matrix4(this.getParent().getUniformMatrix4(name).matrix4);
                            var m2 = localMatrix(attitude(this.theta, this.phi));
                            var m = Matrix4.identity().multiplyMatrices(m1, m2);
                            return { transpose: false, matrix4: m.elements };
                        }
                        else {
                            var m = localMatrix(attitude(this.theta, this.phi));
                            return { transpose: false, matrix4: m.elements };
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformMatrix4.call(this, name);
                }
            }
        };
        return UniversalJoint;
    })(TreeModel);
    return UniversalJoint;
});

define('davinci-eight/uniforms/PointLight',["require", "exports", '../core/Color', '../math/Vector3', '../core/Symbolic', '../uniforms/UniformColor', '../uniforms/UniformVector3', '../uniforms/MultiUniformProvider', '../checks/isDefined'], function (require, exports, Color, Vector3, Symbolic, UniformColor, UniformVector3, MultiUniformProvider, isDefined) {
    /**
     * Provides a uniform variable representing a point light.
     * @class PointLight
     */
    var PointLight = (function () {
        /**
         * @class PointLight
         * @constructor
         */
        function PointLight(options) {
            options = options || {};
            options.color = options.color || new Color([1.0, 1.0, 1.0]);
            options.position = options.position || new Vector3([0.0, 0.0, 0.0]);
            var colorName = isDefined(options.name) ? options.name + 'Color' : void 0;
            var directionName = isDefined(options.name) ? options.name + 'Direction' : void 0;
            this.uColor = new UniformColor(colorName, Symbolic.UNIFORM_POINT_LIGHT_COLOR);
            this.uPosition = new UniformVector3(directionName, Symbolic.UNIFORM_POINT_LIGHT_POSITION);
            this.multi = new MultiUniformProvider([this.uColor, this.uPosition]);
            this.uColor.data = options.color;
            this.uPosition.data = options.position;
        }
        Object.defineProperty(PointLight.prototype, "color", {
            get: function () {
                return this.uColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointLight.prototype, "position", {
            get: function () {
                return this.uPosition;
            },
            enumerable: true,
            configurable: true
        });
        PointLight.prototype.getUniformFloat = function (name) {
            return this.multi.getUniformFloat(name);
        };
        PointLight.prototype.getUniformMatrix2 = function (name) {
            return this.multi.getUniformMatrix2(name);
        };
        PointLight.prototype.getUniformMatrix3 = function (name) {
            return this.multi.getUniformMatrix3(name);
        };
        PointLight.prototype.getUniformMatrix4 = function (name) {
            return this.multi.getUniformMatrix4(name);
        };
        PointLight.prototype.getUniformVector2 = function (name) {
            return this.multi.getUniformVector2(name);
        };
        PointLight.prototype.getUniformVector3 = function (name) {
            return this.multi.getUniformVector3(name);
        };
        PointLight.prototype.getUniformVector4 = function (name) {
            return this.multi.getUniformVector4(name);
        };
        PointLight.prototype.getUniformMeta = function () {
            return this.multi.getUniformMeta();
        };
        PointLight.prototype.getUniformData = function () {
            return this.multi.getUniformData();
        };
        return PointLight;
    })();
    return PointLight;
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
define('davinci-eight/uniforms/UniformFloat',["require", "exports", '../core/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
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
            this.$data = 0;
            this.useData = false;
            this.useCallback = false;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformFloat.prototype, "data", {
            set: function (data) {
                this.$data = data;
                if (typeof data !== void 0) {
                    this.useData = true;
                    this.useCallback = false;
                }
                else {
                    this.useData = false;
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
                    this.useData = false;
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
                        if (this.useData) {
                            return this.$data;
                        }
                        else if (this.useCallback) {
                            return this.$callback();
                        }
                        else {
                            var message = "uniform float " + this.name + " has not been assigned a data or callback.";
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
        UniformFloat.prototype.getUniformMeta = function () {
            var uniforms = _super.prototype.getUniformMeta.call(this);
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
define('davinci-eight/uniforms/UniformVec2',["require", "exports", '../core/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
    var UniformVec2 = (function (_super) {
        __extends(UniformVec2, _super);
        function UniformVec2(name, id) {
            _super.call(this);
            this.$data = [0, 0];
            this.useData = true;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformVec2.prototype, "data", {
            set: function (data) {
                this.$data = data;
                this.useData = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformVec2.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                this.useData = false;
            },
            enumerable: true,
            configurable: true
        });
        UniformVec2.prototype.getUniformVector2 = function (name) {
            switch (name) {
                case this.name:
                    {
                        if (this.useData) {
                            return this.$data;
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
        UniformVec2.prototype.getUniformMeta = function () {
            var uniforms = _super.prototype.getUniformMeta.call(this);
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
define('davinci-eight/uniforms/UniformVec4',["require", "exports", '../core/DefaultUniformProvider', '../utils/uuid4', '../checks/expectArg'], function (require, exports, DefaultUniformProvider, uuid4, expectArg) {
    var UniformVec4 = (function (_super) {
        __extends(UniformVec4, _super);
        function UniformVec4(name, id) {
            _super.call(this);
            this.$data = [0, 0, 0];
            this.useData = true;
            this.name = name;
            this.id = typeof id !== 'undefined' ? id : uuid4().generate();
        }
        Object.defineProperty(UniformVec4.prototype, "data", {
            set: function (data) {
                expectArg('data', data).toSatisfy(data.length === 4, "data length must be 4");
                this.$data = data;
                this.useData = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformVec4.prototype, "callback", {
            set: function (callback) {
                this.$callback = callback;
                this.useData = false;
            },
            enumerable: true,
            configurable: true
        });
        UniformVec4.prototype.getUniformVector4 = function (name) {
            switch (name) {
                case this.name:
                    {
                        if (this.useData) {
                            return this.$data;
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
        UniformVec4.prototype.getUniformMeta = function () {
            var uniforms = _super.prototype.getUniformMeta.call(this);
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
define('davinci-eight/uniforms/UniformSpinor3',["require", "exports", '../math/Spinor3', '../core/DefaultUniformProvider', '../uniforms/UniformVec4'], function (require, exports, Spinor3, DefaultUniformProvider, UniformVec4) {
    /**
     * Provides a uniform variable representing an ambient light.
     * @class UniformSpinor3
     */
    var UniformSpinor3 = (function (_super) {
        __extends(UniformSpinor3, _super);
        /**
         * @class UniformSpinor3
         * @constructor
         */
        function UniformSpinor3(name, id) {
            _super.call(this);
            this.inner = new UniformVec4(name, id);
        }
        Object.defineProperty(UniformSpinor3.prototype, "data", {
            get: function () {
                var data = this.inner.data;
                if (data) {
                    return new Spinor3(data);
                }
                else {
                    return;
                }
            },
            set: function (vector) {
                this.inner.data = vector.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformSpinor3.prototype, "callback", {
            set: function (callback) {
                this.inner.callback = function () {
                    var vector = callback();
                    return vector.data;
                };
            },
            enumerable: true,
            configurable: true
        });
        UniformSpinor3.prototype.getUniformVector4 = function (name) {
            return this.inner.getUniformVector4(name);
        };
        UniformSpinor3.prototype.getUniformMeta = function () {
            return this.inner.getUniformMeta();
        };
        return UniformSpinor3;
    })(DefaultUniformProvider);
    return UniformSpinor3;
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
define('davinci-eight',["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/perspective', 'davinci-eight/core/DefaultAttribProvider', 'davinci-eight/core/Color', 'davinci-eight/core/DataUsage', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Face3', 'davinci-eight/core', 'davinci-eight/objects/primitive', 'davinci-eight/core/DefaultUniformProvider', 'davinci-eight/core/ShaderAttribLocation', 'davinci-eight/core/ShaderUniformLocation', 'davinci-eight/drawLists/scene', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/GeometryAdapter', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BarnGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/EllipticalCylinderGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/ParametricSurfaceGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/shaderProgramFromScripts', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Quaternion', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/mesh/arrowMesh', 'davinci-eight/mesh/ArrowBuilder', 'davinci-eight/mesh/boxMesh', 'davinci-eight/mesh/BoxBuilder', 'davinci-eight/mesh/cylinderMesh', 'davinci-eight/mesh/CylinderArgs', 'davinci-eight/mesh/CylinderMeshBuilder', 'davinci-eight/mesh/sphereMesh', 'davinci-eight/mesh/SphereBuilder', 'davinci-eight/mesh/vortexMesh', 'davinci-eight/objects/arrow', 'davinci-eight/objects/box', 'davinci-eight/objects/cylinder', 'davinci-eight/objects/sphere', 'davinci-eight/objects/vortex', 'davinci-eight/curves/Curve', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/uniforms/AmbientLight', 'davinci-eight/uniforms/ChainedUniformProvider', 'davinci-eight/uniforms/DirectionalLight', 'davinci-eight/uniforms/LocalModel', 'davinci-eight/uniforms/Node', 'davinci-eight/uniforms/TreeModel', 'davinci-eight/uniforms/UniversalJoint', 'davinci-eight/uniforms/MultiUniformProvider', 'davinci-eight/uniforms/PointLight', 'davinci-eight/uniforms/uniforms', 'davinci-eight/uniforms/UniformFloat', 'davinci-eight/uniforms/UniformMat4', 'davinci-eight/uniforms/UniformVec2', 'davinci-eight/uniforms/UniformVec3', 'davinci-eight/uniforms/UniformVec4', 'davinci-eight/uniforms/UniformVector3', 'davinci-eight/uniforms/UniformSpinor3', 'davinci-eight/utils/contextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, view, frustum, perspective, DefaultAttribProvider, Color, DataUsage, DrawMode, Face3, core, primitive, DefaultUniformProvider, ShaderAttribLocation, ShaderUniformLocation, scene, Geometry, GeometryAdapter, ArrowGeometry, BarnGeometry, BoxGeometry, CylinderGeometry, DodecahedronGeometry, EllipticalCylinderGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, ParametricSurfaceGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, shaderProgram, smartProgram, shaderProgramFromScripts, Matrix3, Matrix4, Quaternion, Spinor3, Vector2, Vector3, arrowMesh, ArrowBuilder, boxMesh, BoxBuilder, cylinderMesh, CylinderArgs, CylinderMeshBuilder, sphereMesh, SphereBuilder, vortexMesh, arrow, box, cylinder, sphere, vortex, Curve, initWebGL, renderer, AmbientLight, ChainedUniformProvider, DirectionalLight, LocalModel, Node, TreeModel, UniversalJoint, MultiUniformProvider, PointLight, uniforms, UniformFloat, UniformMat4, UniformVec2, UniformVec3, UniformVec4, UniformVector3, UniformSpinor3, contextMonitor, workbench3D, windowAnimationRunner) {
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
        get scene() { return scene; },
        get renderer() { return renderer; },
        get contextMonitor() { return contextMonitor; },
        workbench: workbench3D,
        animation: windowAnimationRunner,
        get DataUsage() { return DataUsage; },
        get DefaultAttribProvider() { return DefaultAttribProvider; },
        get DefaultUniformProvider() { return DefaultUniformProvider; },
        get primitive() { return primitive; },
        get DrawMode() { return DrawMode; },
        get ShaderAttribLocation() { return ShaderAttribLocation; },
        get ShaderUniformLocation() { return ShaderUniformLocation; },
        get shaderProgram() {
            return shaderProgram;
        },
        get smartProgram() {
            return smartProgram;
        },
        get AmbientLight() { return AmbientLight; },
        get DirectionalLight() { return DirectionalLight; },
        get PointLight() { return PointLight; },
        get Color() { return Color; },
        get Face3() { return Face3; },
        get Geometry() { return Geometry; },
        get GeometryAdapter() { return GeometryAdapter; },
        get ArrowGeometry() { return ArrowGeometry; },
        get BarnGeometry() { return BarnGeometry; },
        get BoxGeometry() { return BoxGeometry; },
        get CylinderGeometry() { return CylinderGeometry; },
        get DodecahedronGeometry() { return DodecahedronGeometry; },
        get EllipticalCylinderGeometry() { return EllipticalCylinderGeometry; },
        get IcosahedronGeometry() { return IcosahedronGeometry; },
        get KleinBottleGeometry() { return KleinBottleGeometry; },
        get MobiusStripGeometry() { return MobiusStripGeometry; },
        get OctahedronGeometry() { return OctahedronGeometry; },
        get ParametricSurfaceGeometry() { return ParametricSurfaceGeometry; },
        get PolyhedronGeometry() { return PolyhedronGeometry; },
        get RevolutionGeometry() { return RevolutionGeometry; },
        get SphereGeometry() { return SphereGeometry; },
        get TetrahedronGeometry() { return TetrahedronGeometry; },
        get TubeGeometry() { return TubeGeometry; },
        get VortexGeometry() { return VortexGeometry; },
        get LocalModel() { return LocalModel; },
        get Node() { return Node; },
        get TreeModel() { return TreeModel; },
        get UniversalJoint() { return UniversalJoint; },
        get UniformFloat() { return UniformFloat; },
        get UniformMat4() { return UniformMat4; },
        get UniformVec2() { return UniformVec2; },
        get UniformVec3() { return UniformVec3; },
        get UniformVec4() { return UniformVec4; },
        get UniformVector3() { return UniformVector3; },
        get UniformSpinor3() { return UniformSpinor3; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get Spinor3() { return Spinor3; },
        get Quaternion() { return Quaternion; },
        get Vector2() { return Vector2; },
        get Vector3() { return Vector3; },
        get Curve() { return Curve; },
        get ChainedUniformProvider() { return ChainedUniformProvider; },
        get MultiUniformProvider() { return MultiUniformProvider; },
        get uniforms() { return uniforms; },
        // mesh
        get arrowMesh() { return arrowMesh; },
        get ArrowBuilder() { return ArrowBuilder; },
        get boxMesh() { return boxMesh; },
        get BoxBuilder() { return BoxBuilder; },
        get CylinderArgs() { return CylinderArgs; },
        get cylinderMesh() { return cylinderMesh; },
        get CylinderMeshBuilder() { return CylinderMeshBuilder; },
        get sphereMesh() { return sphereMesh; },
        get SphereBuilder() { return SphereBuilder; },
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
