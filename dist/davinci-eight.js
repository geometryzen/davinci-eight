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

define('davinci-eight/checks/isUndefined',["require", "exports"], function (require, exports) {
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }
    return isUndefined;
});

define('davinci-eight/checks/expectArg',["require", "exports", '../checks/isUndefined'], function (require, exports, isUndefined) {
    function message(standard, override) {
        return isUndefined(override) ? standard : override();
    }
    function expectArg(name, value) {
        var arg = {
            toSatisfy: function (condition, message) {
                if (isUndefined(condition)) {
                    throw new Error("condition must be specified");
                }
                if (isUndefined(message)) {
                    throw new Error("message must be specified");
                }
                if (!condition) {
                    throw new Error(message);
                }
                return arg;
            },
            toBeBoolean: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'boolean') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a boolean.", override));
                }
                return arg;
            },
            toBeDefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue === 'undefined') {
                    var message_1 = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
                    throw new Error(message_1);
                }
                return arg;
            },
            toBeInClosedInterval: function (lower, upper) {
                if (value >= lower && value <= upper) {
                    return arg;
                }
                else {
                    var message_2 = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
                    throw new Error(message_2);
                }
            },
            toBeFunction: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'function') {
                    var message_3 = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
                    throw new Error(message_3);
                }
                return arg;
            },
            toBeNumber: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'number') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a number.", override));
                }
                return arg;
            },
            toBeObject: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'object') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be an object.", override));
                }
                return arg;
            },
            toBeString: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'string') {
                    var message_4 = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
                    throw new Error(message_4);
                }
                return arg;
            },
            toBeUndefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'undefined') {
                    var message_5 = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
                    throw new Error(message_5);
                }
                return arg;
            },
            toNotBeNull: function () {
                if (value === null) {
                    var message_6 = "Expecting argument " + name + " to not be null.";
                    throw new Error(message_6);
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

define('davinci-eight/checks/isDefined',["require", "exports"], function (require, exports) {
    function isDefined(arg) {
        return (typeof arg !== 'undefined');
    }
    return isDefined;
});

define('davinci-eight/math/VectorN',["require", "exports", '../checks/expectArg', '../checks/isDefined', '../checks/isUndefined'], function (require, exports, expectArg, isDefined, isUndefined) {
    function constructorString(T) {
        return "new VectorN<" + T + ">(data: " + T + "[], modified: boolean = false, size?: number)";
    }
    function pushString(T) {
        return "push(value: " + T + "): number";
    }
    function popString(T) {
        return "pop(): " + T;
    }
    function contextNameKind(context, name, kind) {
        return name + " must be a " + kind + " in " + context;
    }
    function contextNameLength(context, name, length) {
        return name + " length must be " + length + " in " + context;
    }
    function ctorDataKind() {
        return contextNameKind(constructorString('T'), 'data', 'T[]');
    }
    function ctorDataLength(length) {
        return function () {
            return contextNameLength(constructorString('T'), 'data', length);
        };
    }
    function verboten(operation) {
        return operation + " is not allowed for a fixed size vector";
    }
    function verbotenPush() {
        return verboten(pushString('T'));
    }
    function verbotenPop() {
        return verboten(popString('T'));
    }
    function ctorModifiedKind() {
        return contextNameKind(constructorString('T'), 'modified', 'boolean');
    }
    function ctorSizeKind() {
        return contextNameKind(constructorString('T'), 'size', 'number');
    }
    var VectorN = (function () {
        function VectorN(data, modified, size) {
            if (modified === void 0) { modified = false; }
            var dataArg = expectArg('data', data).toBeObject(ctorDataKind);
            this.modified = expectArg('modified', modified).toBeBoolean(ctorModifiedKind).value;
            if (isDefined(size)) {
                this._size = expectArg('size', size).toBeNumber(ctorSizeKind).toSatisfy(size >= 0, "size must be positive").value;
                this._data = dataArg.toSatisfy(data.length === size, ctorDataLength(size)()).value;
            }
            else {
                this._size = void 0;
                this._data = dataArg.value;
            }
        }
        Object.defineProperty(VectorN.prototype, "data", {
            get: function () {
                if (this._data) {
                    return this._data;
                }
                else if (this._callback) {
                    var data = this._callback();
                    if (isDefined(this._size)) {
                        expectArg('callback()', data).toSatisfy(data.length === this._size, "callback() length must be " + this._size);
                    }
                    return this._callback();
                }
                else {
                    throw new Error("Vector" + this._size + " is undefined.");
                }
            },
            set: function (data) {
                if (isDefined(this._size)) {
                    expectArg('data', data).toSatisfy(data.length === this._size, "data length must be " + this._size);
                }
                this._data = data;
                this._callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorN.prototype, "callback", {
            get: function () {
                return this._callback;
            },
            set: function (reactTo) {
                this._callback = reactTo;
                this._data = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorN.prototype, "length", {
            get: function () {
                return this.data.length;
            },
            enumerable: true,
            configurable: true
        });
        VectorN.prototype.getComponent = function (index) {
            return this.data[index];
        };
        VectorN.prototype.pop = function () {
            if (isUndefined(this._size)) {
                return this.data.pop();
            }
            else {
                throw new Error(verbotenPop());
            }
        };
        // FIXME: How to prototype this as ...items: T[]
        VectorN.prototype.push = function (value) {
            if (isUndefined(this._size)) {
                var data = this.data;
                var newLength = data.push(value);
                this.data = data;
                return newLength;
            }
            else {
                throw new Error(verbotenPush());
            }
        };
        VectorN.prototype.setComponent = function (index, value) {
            var data = this.data;
            data[index] = value;
            this.data = data;
        };
        VectorN.prototype.toLocaleString = function () {
            return this.data.toLocaleString();
        };
        VectorN.prototype.toString = function () {
            return this.data.toString();
        };
        return VectorN;
    })();
    return VectorN;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Vector3',["require", "exports", '../checks/expectArg', '../math/VectorN'], function (require, exports, expectArg, VectorN) {
    /**
     * @class Vector3
     */
    var Vector3 = (function (_super) {
        __extends(Vector3, _super);
        /**
         * @class Vector3
         * @constructor
         * @param data {number[]} Default is [0, 0, 0].
         * @param modified {boolean} Default is false;
         */
        function Vector3(data, modified) {
            if (data === void 0) { data = [0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 3);
        }
        Vector3.dot = function (a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        };
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
            var e = m.data;
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
            var e = m.data;
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
            return Vector3.dot(this, v);
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
            this.x = expectArg('x', x).toBeNumber().value;
            this.y = expectArg('y', y).toBeNumber().value;
            this.z = expectArg('z', z).toBeNumber().value;
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
    })(VectorN);
    return Vector3;
});

define('davinci-eight/math/AbstractMatrix',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    var AbstractMatrix = (function () {
        function AbstractMatrix(data, length) {
            expectArg('data', data).toSatisfy(data.length === length, 'data must have length ' + length);
            this._data = data;
            this._length = length;
            this.modified = false;
        }
        Object.defineProperty(AbstractMatrix.prototype, "data", {
            get: function () {
                if (this._data) {
                    return this._data;
                }
                else if (this._callback) {
                    var data = this._callback();
                    expectArg('callback()', data).toSatisfy(data.length === this._length, "callback() length must be " + this._length);
                    return this._callback();
                }
                else {
                    throw new Error("Matrix" + Math.sqrt(this._length) + " is undefined.");
                }
            },
            set: function (data) {
                expectArg('data', data).toSatisfy(data.length === this._length, "data length must be " + this._length);
                this._data = data;
                this._callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "callback", {
            get: function () {
                return this._callback;
            },
            set: function (reactTo) {
                this._callback = reactTo;
                this._data = void 0;
            },
            enumerable: true,
            configurable: true
        });
        return AbstractMatrix;
    })();
    return AbstractMatrix;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Matrix4',["require", "exports", '../math/AbstractMatrix', '../checks/expectArg', '../checks/isDefined'], function (require, exports, AbstractMatrix, expectArg, isDefined) {
    /**
     * 4x4 matrix integrating with WebGL.
     *
     * @class Matrix4
     */
    var Matrix4 = (function (_super) {
        __extends(Matrix4, _super);
        // The correspondence between the data property index and the matrix entries is...
        //
        //  0  4  8 12
        //  1  5  9 13
        //  2  6 10 14
        //  3  7 11 15
        /**
         * Constructs a Matrix4 by wrapping a Float32Array.
         * @constructor
         */
        function Matrix4(data) {
            _super.call(this, data, 16);
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
            return Matrix4.identity().rotation(spinor);
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
            this.data.set(m.data);
            return this;
        };
        Matrix4.prototype.determinant = function () {
            var te = this.data;
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
            var te = this.data;
            var me = m.data;
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
            var te = this.data;
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
            var te = this.data;
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
            var te = this.data;
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
            Matrix4.mul(this.data, m.data, this.data);
            return this;
        };
        Matrix4.prototype.multiplyMatrices = function (a, b) {
            Matrix4.mul(a.data, b.data, this.data);
            return this;
        };
        // TODO: This should not be here.
        Matrix4.mul = function (ae, be, oe) {
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
            oe[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            oe[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            oe[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            oe[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            return oe;
        };
        Matrix4.prototype.rotate = function (spinor) {
            var S = Matrix4.rotation(spinor);
            Matrix4.mul(S.data, this.data, this.data);
            return this;
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
            var te = this.data;
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
            Matrix4.mul(S.data, this.data, this.data);
            return this;
        };
        Matrix4.prototype.scaling = function (scale) {
            return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            var te = this.data;
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
            Matrix4.mul(T.data, this.data, this.data);
            return this;
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
    })(AbstractMatrix);
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
        Symbolic.ATTRIBUTE_TEXTURE = 'aTexCoord';
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

define('davinci-eight/cameras/viewArray',["require", "exports", '../math/Vector3', '../checks/expectArg', '../checks/isDefined'], function (require, exports, Vector3, expectArg, isDefined) {
    function viewArray(eye, look, up, matrix) {
        var m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expectArg('matrix', m).toSatisfy(m.length === 16, 'matrix must have length 16');
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
        var d = new Vector3([Vector3.dot(eye, u), Vector3.dot(eye, v), Vector3.dot(eye, n)]).multiplyScalar(-1);
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
        return m;
    }
    return viewArray;
});

define('davinci-eight/cameras/viewMatrix',["require", "exports", '../checks/isDefined', '../math/Matrix4', '../cameras/viewArray'], function (require, exports, isDefined, Matrix4, viewArray) {
    function viewMatrix(eye, look, up, matrix) {
        var m = isDefined(matrix) ? matrix : Matrix4.identity();
        viewArray(eye, look, up, m.data);
        return m;
    }
    return viewMatrix;
});

define('davinci-eight/cameras/view',["require", "exports", '../math/Vector3', '../math/Matrix4', '../core/Symbolic', '../checks/expectArg', '../checks/isUndefined', '../cameras/viewMatrix'], function (require, exports, Vector3, Matrix4, Symbolic, expectArg, isUndefined, computeViewMatrix) {
    /**
     * @class view
     * @constructor
     */
    var view = function (options) {
        var eye = new Vector3();
        var look = new Vector3();
        var up = Vector3.e2;
        var viewMatrix = Matrix4.identity();
        var viewMatrixName = isUndefined(options.viewMatrixName) ? Symbolic.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
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
            accept: function (visitor) {
                if (eye.modified || look.modified || up.modified) {
                    // TODO: view matrix would be better.
                    computeViewMatrix(eye, look, up, viewMatrix);
                    eye.modified = false;
                    look.modified = false;
                    up.modified = false;
                }
                visitor.uniformMatrix4(viewMatrixName, false, viewMatrix);
            }
        };
        return self;
    };
    return view;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Vector1',["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    /**
     * @class Vector1
     */
    var Vector1 = (function (_super) {
        __extends(Vector1, _super);
        /**
         * @class Vector1
         * @constructor
         * @param data {number[]} Default is [0].
         * @param modified {boolean} Default is false.
         */
        function Vector1(data, modified) {
            if (data === void 0) { data = [0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 1);
        }
        Object.defineProperty(Vector1.prototype, "x", {
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
        Vector1.prototype.set = function (x) {
            this.x = x;
            return this;
        };
        Vector1.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector1.prototype.copy = function (v) {
            this.x = v.x;
            return this;
        };
        Vector1.prototype.add = function (v) {
            this.x += v.x;
            return this;
        };
        Vector1.prototype.addScalar = function (s) {
            this.x += s;
            return this;
        };
        Vector1.prototype.addVectors = function (a, b) {
            this.x = a.x + b.x;
            return this;
        };
        Vector1.prototype.exp = function () {
            this.x = Math.exp(this.x);
            return this;
        };
        Vector1.prototype.sub = function (v) {
            this.x -= v.x;
            return this;
        };
        Vector1.prototype.subScalar = function (s) {
            this.x -= s;
            return this;
        };
        Vector1.prototype.subVectors = function (a, b) {
            this.x = a.x - b.x;
            return this;
        };
        Vector1.prototype.multiply = function (v) {
            this.x *= v.x;
            return this;
        };
        Vector1.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            return this;
        };
        Vector1.prototype.divide = function (v) {
            this.x /= v.x;
            return this;
        };
        Vector1.prototype.divideScalar = function (scalar) {
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.x *= invScalar;
            }
            else {
                this.x = 0;
            }
            return this;
        };
        Vector1.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            return this;
        };
        Vector1.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            return this;
        };
        Vector1.prototype.floor = function () {
            this.x = Math.floor(this.x);
            return this;
        };
        Vector1.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            return this;
        };
        Vector1.prototype.round = function () {
            this.x = Math.round(this.x);
            return this;
        };
        Vector1.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            return this;
        };
        Vector1.prototype.negate = function () {
            this.x = -this.x;
            return this;
        };
        Vector1.prototype.distanceTo = function (position) {
            return Math.sqrt(this.quadranceTo(position));
        };
        Vector1.prototype.dot = function (v) {
            return this.x * v.x;
        };
        Vector1.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        Vector1.prototype.normalize = function () {
            return this.divideScalar(this.magnitude());
        };
        Vector1.prototype.quaditude = function () {
            return this.x * this.x;
        };
        Vector1.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            return dx * dx;
        };
        Vector1.prototype.setMagnitude = function (l) {
            var oldLength = this.magnitude();
            if (oldLength !== 0 && l !== oldLength) {
                this.multiplyScalar(l / oldLength);
            }
            return this;
        };
        Vector1.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            return this;
        };
        Vector1.prototype.lerpVectors = function (v1, v2, alpha) {
            this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
            return this;
        };
        Vector1.prototype.equals = function (v) {
            return v.x === this.x;
        };
        Vector1.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            return this;
        };
        Vector1.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            return array;
        };
        Vector1.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            return this;
        };
        Vector1.prototype.clone = function () {
            return new Vector1([this.x]);
        };
        return Vector1;
    })(VectorN);
    return Vector1;
});

define('davinci-eight/cameras/frustum',["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', '../math/Vector1'], function (require, exports, view, Matrix4, Vector1) {
    /**
     * @class frustum
     * @constructor
     * @return {Frustum}
     */
    var frustum = function (viewMatrixName, projectionMatrixName) {
        var base = view(viewMatrixName);
        var left = new Vector1();
        var right = new Vector1();
        var bottom = new Vector1();
        var top = new Vector1();
        var near = new Vector1();
        var far = new Vector1();
        // TODO: We should immediately create with a frustum static constructor?
        var projectionMatrix = Matrix4.identity();
        function updateProjectionMatrix() {
            projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
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
                return left.x;
            },
            set left(value) {
                left.x = value;
                updateProjectionMatrix();
            },
            get right() {
                return right.x;
            },
            set right(value) {
                right.x = value;
                updateProjectionMatrix();
            },
            get bottom() {
                return bottom.x;
            },
            set bottom(value) {
                bottom.x = value;
                updateProjectionMatrix();
            },
            get top() {
                return top.x;
            },
            set top(value) {
                top.x = value;
                updateProjectionMatrix();
            },
            get near() {
                return near.x;
            },
            set near(value) {
                near.x = value;
                updateProjectionMatrix();
            },
            get far() {
                return far.x;
            },
            set far(value) {
                far.x = value;
                updateProjectionMatrix();
            },
            accept: function (visitor) {
                visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix);
                base.accept(visitor);
            }
        };
        return self;
    };
    return frustum;
});

define('davinci-eight/cameras/frustumMatrix',["require", "exports", '../checks/expectArg', '../checks/isDefined'], function (require, exports, expectArg, isDefined) {
    function frustumMatrix(left, right, bottom, top, near, far, matrix) {
        expectArg('left', left).toBeNumber();
        expectArg('right', right).toBeNumber();
        expectArg('bottom', bottom).toBeNumber();
        expectArg('top', top).toBeNumber();
        expectArg('near', near).toBeNumber();
        expectArg('far', far).toBeNumber();
        var m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expectArg('m', m).toSatisfy(m.length === 16, 'elements must have length 16');
        var x = 2 * near / (right - left);
        var y = 2 * near / (top - bottom);
        var a = (right + left) / (right - left);
        var b = (top + bottom) / (top - bottom);
        var c = -(far + near) / (far - near);
        var d = -2 * far * near / (far - near);
        m[0x0] = x;
        m[0x4] = 0;
        m[0x8] = a;
        m[0xC] = 0;
        m[0x1] = 0;
        m[0x5] = y;
        m[0x9] = b;
        m[0xD] = 0;
        m[0x2] = 0;
        m[0x6] = 0;
        m[0xA] = c;
        m[0xE] = d;
        m[0x3] = 0;
        m[0x7] = 0;
        m[0xB] = -1;
        m[0xF] = 0;
        return m;
    }
    return frustumMatrix;
});

define('davinci-eight/cameras/perspectiveArray',["require", "exports", '../cameras/frustumMatrix', '../checks/expectArg'], function (require, exports, frustumMatrix, expectArg) {
    function perspectiveArray(fov, aspect, near, far, matrix) {
        // We can leverage the frustum function, although technically the
        // symmetry in this perspective transformation should reduce the amount
        // of computation required.
        expectArg('fov', fov).toBeNumber();
        expectArg('aspect', aspect).toBeNumber();
        expectArg('near', near).toBeNumber();
        expectArg('far', far).toBeNumber();
        var ymax = near * Math.tan(fov * 0.5); // top
        var ymin = -ymax; // bottom
        var xmin = ymin * aspect; // left
        var xmax = ymax * aspect; // right
        return frustumMatrix(xmin, xmax, ymin, ymax, near, far, matrix);
    }
    return perspectiveArray;
});

define('davinci-eight/cameras/perspectiveMatrix',["require", "exports", '../checks/isDefined', '../math/Matrix4', '../cameras/perspectiveArray'], function (require, exports, isDefined, Matrix4, perspectiveArray) {
    function perspectiveMatrix(fov, aspect, near, far, matrix) {
        var m = isDefined(matrix) ? matrix : Matrix4.identity();
        perspectiveArray(fov, aspect, near, far, m.data);
        return m;
    }
    return perspectiveMatrix;
});

define('davinci-eight/cameras/perspective',["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', 'davinci-eight/core/Symbolic', '../math/Vector1', '../checks/isUndefined', '../checks/expectArg', '../cameras/perspectiveMatrix'], function (require, exports, view, Matrix4, Symbolic, Vector1, isUndefined, expectArg, computePerspectiveMatrix) {
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
        var fov = new Vector1([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
        var aspect = new Vector1([isUndefined(options.aspect) ? 1 : options.aspect]);
        var near = new Vector1([isUndefined(options.near) ? 0.1 : options.near]);
        var far = new Vector1([expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value]);
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
                return fov.x;
            },
            set fov(value) {
                self.setFov(value);
            },
            setFov: function (value) {
                expectArg('fov', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value;
                fov.x = value;
                return self;
            },
            get aspect() {
                return aspect.x;
            },
            set aspect(value) {
                self.setAspect(value);
            },
            setAspect: function (value) {
                expectArg('aspect', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value;
                aspect.x = value;
                return self;
            },
            get near() {
                return near.x;
            },
            set near(value) {
                self.setNear(value);
            },
            setNear: function (value) {
                expectArg('near', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || near.x !== value;
                near.x = value;
                return self;
            },
            get far() {
                return far.x;
            },
            set far(value) {
                self.setFar(value);
            },
            setFar: function (value) {
                expectArg('far', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || far.x !== value;
                far.x = value;
                return self;
            },
            accept: function (visitor) {
                if (matrixNeedsUpdate) {
                    computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                    matrixNeedsUpdate = false;
                }
                visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix);
                base.accept(visitor);
            }
        };
        return self;
    };
    return perspective;
});

define('davinci-eight/core/AttribLocation',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    function existsLocation(location) {
        return location >= 0;
    }
    /**
     * Utility class for managing a shader attribute variable.
     * While this class may be created directly by the user, it is preferable
     * to use the AttribLocation instances managed by the ShaderProgram because
     * there will be improved integrity and context loss management.
     * @class AttribLocation.
     */
    var AttribLocation = (function () {
        /**
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * @class AttribLocation
         * @constructor
         * @param name {string} The name of the variable as it appears in the GLSL program.
         */
        function AttribLocation(monitor, name) {
            this._enabled = void 0;
            this._monitor = expectArg('monitor', monitor).toBeObject().value;
            this._name = expectArg('name', name).toBeString().value;
        }
        Object.defineProperty(AttribLocation.prototype, "index", {
            get: function () {
                return this._index;
            },
            enumerable: true,
            configurable: true
        });
        AttribLocation.prototype.contextFree = function () {
            this.contextLoss();
        };
        AttribLocation.prototype.contextGain = function (context, program) {
            this.contextLoss();
            this._index = context.getAttribLocation(program, this._name);
            this._context = context;
        };
        AttribLocation.prototype.contextLoss = function () {
            this._index = void 0;
            this._context = void 0;
            this._enabled = void 0;
        };
        /**
         * @method vertexPointer
         * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
         * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
         * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
         * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
         */
        AttribLocation.prototype.vertexPointer = function (size, normalized, stride, offset) {
            if (normalized === void 0) { normalized = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this._context.vertexAttribPointer(this._index, size, this._context.FLOAT, normalized, stride, offset);
        };
        AttribLocation.prototype.enable = function () {
            if (this._enabled !== true) {
                this._context.enableVertexAttribArray(this._index);
                this._enabled = true;
            }
        };
        AttribLocation.prototype.disable = function () {
            if (this._enabled !== false) {
                this._context.disableVertexAttribArray(this._index);
                this._enabled = false;
            }
        };
        /**
         * @method toString
         */
        AttribLocation.prototype.toString = function () {
            return ['attribute', this._name].join(' ');
        };
        return AttribLocation;
    })();
    return AttribLocation;
});

define('davinci-eight/core/IdentityAttribProvider',["require", "exports"], function (require, exports) {
    var IdentityAttribProvider = (function () {
        function IdentityAttribProvider() {
            this._refCount = 1;
        }
        IdentityAttribProvider.prototype.draw = function () {
        };
        IdentityAttribProvider.prototype.update = function () {
        };
        IdentityAttribProvider.prototype.getAttribData = function () {
            var attributes = {};
            return attributes;
        };
        IdentityAttribProvider.prototype.getAttribMeta = function () {
            var attributes = {};
            return attributes;
        };
        IdentityAttribProvider.prototype.addRef = function () {
            this._refCount++;
            return this._refCount;
        };
        IdentityAttribProvider.prototype.release = function () {
            this._refCount--;
            if (this._refCount === 0) {
            }
            return this._refCount;
        };
        IdentityAttribProvider.prototype.contextFree = function () {
            this._context = void 0;
        };
        IdentityAttribProvider.prototype.contextGain = function (context) {
            this._context = context;
        };
        IdentityAttribProvider.prototype.contextLoss = function () {
            this._context = void 0;
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
        DefaultAttribProvider.prototype.draw = function () {
        };
        DefaultAttribProvider.prototype.update = function () {
            return _super.prototype.update.call(this);
        };
        DefaultAttribProvider.prototype.getAttribMeta = function () {
            var attributes = _super.prototype.getAttribMeta.call(this);
            attributes[Symbolic.ATTRIBUTE_POSITION] = { glslType: 'vec3', size: 3 };
            return attributes;
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
            this.modified = false;
            expectArg('data', data).toSatisfy(data.length === 3, "data must have length equal to 3");
            this.data = data;
        }
        Object.defineProperty(Color.prototype, "r", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
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
            return Color.luminance(this.r, this.g, this.b);
        };
        Color.prototype.toString = function () {
            return "Color(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        Color.luminance = function (r, g, b) {
            var gamma = 2.2;
            return 0.2126 * Math.pow(r, gamma) + 0.7152 * Math.pow(g, gamma) + 0.0722 * Math.pow(b, gamma);
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
            return new Color([color.r, color.g, color.b]);
        };
        return Color;
    })();
    return Color;
});

define('davinci-eight/core',["require", "exports"], function (require, exports) {
    var core = {
        VERSION: '2.80.0'
    };
    return core;
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

define('davinci-eight/core/Face3',["require", "exports", '../math/Vector3', '../core/Color'], function (require, exports, Vector3, Color) {
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
         * @param normals {Cartesian3[]} The per-vertex normals for this face (3) or face normal (1).
         */
        function Face3(a, b, c, vertexNormals) {
            if (vertexNormals === void 0) { vertexNormals = []; }
            this.normal = new Vector3();
            this.color = new Color();
            this.a = a;
            this.b = b;
            this.c = c;
            this.vertexNormals = vertexNormals;
        }
        Face3.prototype.clone = function () {
            var face = new Face3(this.a, this.b, this.c);
            face.normal = Vector3.copy(this.normal);
            face.color = Color.copy(this.color);
            face.materialIndex = this.materialIndex;
            for (var i = 0, il = this.vertexNormals.length; i < il; i++) {
                face.vertexNormals[i] = Vector3.copy(this.vertexNormals[i]);
            }
            for (var i = 0, il = this.vertexColors.length; i < il; i++) {
                face.vertexColors[i] = Color.copy(this.vertexColors[i]);
            }
            for (var i = 0, il = this.vertexTangents.length; i < il; i++) {
                face.vertexTangents[i] = Vector3.copy(this.vertexTangents[i]);
            }
            return face;
        };
        return Face3;
    })();
    return Face3;
});

define('davinci-eight/objects/primitive',["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    var primitive = function (mesh, program, model) {
        var $context;
        var refCount = 1;
        mesh.addRef();
        program.addRef();
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
            addRef: function () {
                refCount++;
                // console.log("primitive.addRef() => " + refCount);
                return refCount;
            },
            release: function () {
                refCount--;
                // console.log("primitive.release() => " + refCount);
                if (refCount === 0) {
                    mesh.release();
                    mesh = void 0;
                    program.release();
                    program = void 0;
                }
                return refCount;
            },
            contextFree: function () {
                if (isDefined($context)) {
                    $context = void 0;
                    mesh.contextFree();
                    program.contextFree();
                }
            },
            contextGain: function (context) {
                if ($context !== context) {
                    $context = context;
                    mesh.contextGain(context);
                    program.contextGain(context);
                }
            },
            contextLoss: function () {
                if (isDefined($context)) {
                    $context = void 0;
                    mesh.contextLoss();
                    program.contextLoss();
                }
            },
            accept: function (visitor) {
                visitor.primitive(mesh, program, model);
            }
        };
        return self;
    };
    return primitive;
});

define('davinci-eight/core/UniformLocation',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    function matrix4NE(a, b) {
        return a[0x0] !== b[0x0] || a[0x1] !== b[0x1] || a[0x2] !== b[0x2] || a[0x3] !== b[0x3] || a[0x4] !== b[0x4] || a[0x5] !== b[0x5] || a[0x6] !== b[0x6] || a[0x7] !== b[0x7] || a[0x8] !== b[0x8] || a[0x9] !== b[0x9] || a[0xA] !== b[0xA] || a[0xB] !== b[0xB] || a[0xC] !== b[0xC] || a[0xD] !== b[0xD] || a[0xE] !== b[0xE] || a[0xF] !== b[0xF];
    }
    /**
     * Utility class for managing a shader uniform variable.
     * @class UniformLocation
     */
    var UniformLocation = (function () {
        /**
         * @class UniformLocation
         * @constructor
         * @param monitor {RenderingContextMonitor}
         * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
         */
        function UniformLocation(monitor, name) {
            this._x = void 0;
            this._y = void 0;
            this._z = void 0;
            this._w = void 0;
            this._matrix4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(function () { return void 0; });
            this._transpose = void 0;
            this._monitor = expectArg('monitor', monitor).toBeObject().value;
            this._name = expectArg('name', name).toBeString().value;
        }
        /**
         * @method contextFree
         */
        UniformLocation.prototype.contextFree = function () {
            this.contextLoss();
        };
        /**
         * @method contextGain
         * @param context {WebGLRenderingContext}
         * @param program {WebGLProgram}
         */
        UniformLocation.prototype.contextGain = function (context, program) {
            this.contextLoss();
            this._location = context.getUniformLocation(program, this._name);
            this._context = context;
        };
        /**
         * @method contextLoss
         */
        UniformLocation.prototype.contextLoss = function () {
            this._location = void 0;
            this._context = void 0;
            this._x = void 0;
            this._y = void 0;
            this._z = void 0;
            this._w = void 0;
            this._matrix4.map(function () { return void 0; });
            this._transpose = void 0;
        };
        /**
         * @method uniform1f
         * @param x
         */
        UniformLocation.prototype.uniform1f = function (x) {
            if (this._monitor.mirror) {
                if (this._x !== x) {
                    this._context.uniform1f(this._location, x);
                    this._x = x;
                }
            }
            else {
                this._context.uniform1f(this._location, x);
                this._x = void 0;
            }
        };
        /**
         * @method uniform2f
         * @param x {number}
         * @param y {number}
         */
        UniformLocation.prototype.uniform2f = function (x, y) {
            return this._context.uniform2f(this._location, x, y);
        };
        /**
         * @method uniform3f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         */
        UniformLocation.prototype.uniform3f = function (x, y, z) {
            return this._context.uniform3f(this._location, x, y, z);
        };
        /**
         * @method uniform4f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param w {number}
         */
        UniformLocation.prototype.uniform4f = function (x, y, z, w) {
            return this._context.uniform4f(this._location, x, y, z, w);
        };
        /**
         * @method matrix1
         * @param transpose {boolean}
         * @param matrix {Matrix1}
         */
        UniformLocation.prototype.matrix1 = function (transpose, matrix) {
            return this._context.uniform1fv(this._location, matrix.data);
        };
        /**
         * @method matrix2
         * @param transpose {boolean}
         * @param matrix {Matrix2}
         */
        UniformLocation.prototype.matrix2 = function (transpose, matrix) {
            return this._context.uniformMatrix2fv(this._location, transpose, matrix.data);
        };
        /**
         * @method matrix3
         * @param transpose {boolean}
         * @param matrix {Matrix3}
         */
        UniformLocation.prototype.matrix3 = function (transpose, matrix) {
            return this._context.uniformMatrix3fv(this._location, transpose, matrix.data);
        };
        /**
         * @method matrix4
         * @param transpose {boolean}
         * @param matrix {Matrix4}
         */
        UniformLocation.prototype.matrix4 = function (transpose, matrix) {
            var matrix4 = this._matrix4;
            var data = matrix.data;
            if (matrix4NE(matrix4, data) || this._transpose != transpose) {
                this._context.uniformMatrix4fv(this._location, transpose, data);
                // TODO: Use Matrix4.
                matrix4[0x0] = data[0x0];
                matrix4[0x1] = data[0x1];
                matrix4[0x2] = data[0x2];
                matrix4[0x3] = data[0x3];
                matrix4[0x4] = data[0x4];
                matrix4[0x5] = data[0x5];
                matrix4[0x6] = data[0x6];
                matrix4[0x7] = data[0x7];
                matrix4[0x8] = data[0x8];
                matrix4[0x9] = data[0x9];
                matrix4[0xA] = data[0xA];
                matrix4[0xB] = data[0xB];
                matrix4[0xC] = data[0xC];
                matrix4[0xD] = data[0xD];
                matrix4[0xE] = data[0xE];
                matrix4[0xF] = data[0xF];
                this._transpose = transpose;
            }
        };
        /**
         * @method vector1
         * @param vector {Vector1}
         */
        UniformLocation.prototype.vector1 = function (vector) {
            return this._context.uniform1fv(this._location, vector.data);
        };
        /**
         * @method vector2
         * @param vector {Vector2}
         */
        UniformLocation.prototype.vector2 = function (vector) {
            return this._context.uniform2fv(this._location, vector.data);
        };
        /**
         * @method vector3
         * @param vector {Vector3}
         */
        UniformLocation.prototype.vector3 = function (vector) {
            var data = vector.data;
            var x = data[0];
            var y = data[1];
            var z = data[2];
            if (this._x !== x || this._y !== y || this._z !== z) {
                this._context.uniform3fv(this._location, data);
                this._x = x;
                this._y = y;
                this._z = z;
            }
        };
        /**
         * @method vector4
         * @param vector {Vector4}
         */
        UniformLocation.prototype.vector4 = function (vector) {
            return this._context.uniform4fv(this._location, vector.data);
        };
        /**
         * @method toString
         */
        UniformLocation.prototype.toString = function () {
            return ['uniform', this._name].join(' ');
        };
        return UniformLocation;
    })();
    return UniformLocation;
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

define('davinci-eight/dfx/Elements',["require", "exports", '../checks/expectArg', '../math/VectorN'], function (require, exports, expectArg, VectorN) {
    var Elements = (function () {
        function Elements(indices, attributes) {
            this.attributes = {};
            expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
            expectArg('attributes', attributes).toBeObject();
            this.indices = indices;
            this.attributes = attributes;
        }
        return Elements;
    })();
    return Elements;
});

define('davinci-eight/dfx/makeFaceNormalCallback',["require", "exports", '../math/Vector3'], function (require, exports, Vector3) {
    function makeFaceNormalCallback(face) {
        return function () {
            var vA = face.a.position;
            var vB = face.b.position;
            var vC = face.c.position;
            // TODO: rework this so that it does not create any temporary objects, other than the final number[].
            var cb = new Vector3().subVectors(vC, vB);
            var ab = new Vector3().subVectors(vA, vB);
            var normal = new Vector3().crossVectors(cb, ab).normalize();
            return [normal.x, normal.y, normal.z];
        };
    }
    return makeFaceNormalCallback;
});

define('davinci-eight/dfx/FaceVertex',["require", "exports", '../checks/expectArg', '../checks/isUndefined', '../math/Vector3', '../dfx/makeFaceNormalCallback'], function (require, exports, expectArg, isUndefined, Vector3, makeFaceNormalCallback) {
    function expectArgVector3(name, vector) {
        return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
    }
    var FaceVertex = (function () {
        function FaceVertex(position, normal, coords) {
            this.position = expectArgVector3('position', position);
            this.normal = normal;
            this.coords = coords;
        }
        Object.defineProperty(FaceVertex.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (value) {
                this._parent = value;
                if (isUndefined(this.normal)) {
                    this.normal = new Vector3();
                    this.normal.callback = makeFaceNormalCallback(this._parent);
                }
            },
            enumerable: true,
            configurable: true
        });
        return FaceVertex;
    })();
    return FaceVertex;
});

define('davinci-eight/dfx/Face',["require", "exports", '../checks/expectArg', '../dfx/FaceVertex', '../math/Vector3', '../dfx/makeFaceNormalCallback'], function (require, exports, expectArg, FaceVertex, Vector3, makeFaceNormalCallback) {
    function expectArgVector3(name, vector) {
        return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
    }
    var Face = (function () {
        /**
         * @class Face
         * @constructor
         * @param a {FaceVertex}
         * @param b {FaceVertex}
         * @param c {FaceVertex}
         */
        function Face(a, b, c) {
            this._normal = new Vector3();
            this.a = new FaceVertex(expectArgVector3('a', a));
            this.b = new FaceVertex(expectArgVector3('b', b));
            this.c = new FaceVertex(expectArgVector3('c', c));
            this.a.parent = this;
            this.b.parent = this;
            this.c.parent = this;
            this._normal.callback = makeFaceNormalCallback(this);
        }
        Object.defineProperty(Face.prototype, "normal", {
            get: function () {
                return this._normal;
            },
            enumerable: true,
            configurable: true
        });
        return Face;
    })();
    return Face;
});

define('davinci-eight/dfx/Face3Geometry',["require", "exports"], function (require, exports) {
    var Face3Geometry = (function () {
        function Face3Geometry() {
            this.faces = [];
        }
        Face3Geometry.prototype.addFace = function (face) {
            var newLength = this.faces.push(face);
            var index = newLength - 1;
            return index;
        };
        Face3Geometry.prototype.accept = function (visitor) {
            visitor.faces(this.faces);
        };
        return Face3Geometry;
    })();
    return Face3Geometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Vector2',["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    /**
     * @class Vector2
     */
    var Vector2 = (function (_super) {
        __extends(Vector2, _super);
        /**
         * @class Vector2
         * @constructor
         * @param data {number[]} Default is [0, 0].
         * @param modified {boolean} Default is false.
         */
        function Vector2(data, modified) {
            if (data === void 0) { data = [0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 2);
        }
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
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            return this;
        };
        Vector2.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            array[offset + 1] = this.y;
            return array;
        };
        Vector2.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            return this;
        };
        Vector2.prototype.clone = function () {
            return new Vector2([this.x, this.y]);
        };
        return Vector2;
    })(VectorN);
    return Vector2;
});

define('davinci-eight/dfx/makeBoxGeometry',["require", "exports", '../dfx/Face3Geometry', '../dfx/Face', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3Geometry, Face, Vector2, Vector3) {
    function square(vecs, geometry, coords) {
        var faces = new Array();
        var f012 = new Face(vecs[0], vecs[1], vecs[2]);
        f012.a.coords = coords[0];
        f012.b.coords = coords[1];
        f012.c.coords = coords[2];
        geometry.addFace(f012);
        faces.push(f012);
        var f023 = new Face(vecs[0], vecs[2], vecs[3]);
        f023.a.coords = f012.a.coords;
        f023.b.coords = f012.c.coords;
        f023.c.coords = coords[3];
        geometry.addFace(f023);
        faces.push(f023);
        return faces;
    }
    function makeBoxGeometry() {
        // box
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
        //
        var geometry = new Face3Geometry();
        var vec0 = new Vector3([+1, +1, +1]);
        var vec1 = new Vector3([-1, +1, +1]);
        var vec2 = new Vector3([-1, -1, +1]);
        var vec3 = new Vector3([+1, -1, +1]);
        var vec4 = new Vector3([+1, -1, -1]);
        var vec5 = new Vector3([+1, +1, -1]);
        var vec6 = new Vector3([-1, +1, -1]);
        var vec7 = new Vector3([-1, -1, -1]);
        var c00 = new Vector2([0, 0]);
        var c01 = new Vector2([0, 1]);
        var c10 = new Vector2([1, 0]);
        var c11 = new Vector2([1, 1]);
        var coords = [c11, c01, c00, c10];
        square([vec0, vec1, vec2, vec3], geometry, coords); // front
        square([vec0, vec3, vec4, vec5], geometry, coords); // right
        square([vec0, vec5, vec6, vec1], geometry, coords); // top
        square([vec1, vec6, vec7, vec2], geometry, coords); // left
        square([vec7, vec4, vec3, vec2], geometry, coords); // bottom
        square([vec4, vec7, vec6, vec5], geometry, coords); // back
        // GEOMETRY IS REALLY redundant now.
        return geometry.faces;
    }
    return makeBoxGeometry;
});

define('davinci-eight/dfx/stringFaceVertex',["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    function stringVector3(name, vector) {
        return name + vector.x + " " + vector.y + " " + vector.z;
    }
    function stringVector2(name, vector) {
        if (isDefined(vector)) {
            return name + vector.x + " " + vector.y;
        }
        else {
            return name;
        }
    }
    function stringFaceVertex(faceVertex) {
        return stringVector3('P', faceVertex.position) + stringVector3('N', faceVertex.normal) + stringVector2('T', faceVertex.coords);
    }
    return stringFaceVertex;
});

define('davinci-eight/dfx/triangleElementsFromFaces',["require", "exports", '../dfx/Elements', '../checks/expectArg', '../checks/isDefined', '../checks/isUndefined', '../math/VectorN', '../dfx/stringFaceVertex', '../core/Symbolic'], function (require, exports, Elements, expectArg, isDefined, isUndefined, VectorN, stringFaceVertex, Symbolic) {
    var VERTICES_PER_FACE = 3;
    var COORDS_PER_POSITION = 3;
    var COORDS_PER_NORMAL = 3;
    var COORDS_PER_TEXTURE = 2;
    // This function has the important side-effect of setting the index property.
    // TODO: It would be better to copy the Face structure?
    function computeUniques(faces) {
        var map = {};
        var uniques = [];
        function munge(fv) {
            var key = stringFaceVertex(fv);
            if (map[key]) {
                var existing = map[key];
                fv.index = existing.index;
            }
            else {
                fv.index = uniques.length;
                uniques.push(fv);
                map[key] = fv;
            }
        }
        faces.forEach(function (face) {
            munge(face.a);
            munge(face.b);
            munge(face.c);
        });
        return uniques;
    }
    function numberList(size, value) {
        var data = [];
        for (var i = 0; i < size; i++) {
            data.push(value);
        }
        return data;
    }
    function attribName(name, attribMap) {
        if (isUndefined(attribMap)) {
            return name;
        }
        else {
            var alias = attribMap[name];
            return isDefined(alias) ? alias : name;
        }
    }
    function triangleElementsFromFaces(faces, attribMap) {
        expectArg('faces', faces).toBeObject();
        var uniques = computeUniques(faces);
        var elements = {};
        // Although it is possible to use a VectorN here, working with number[] will
        // be faster and will later allow us to fix the length of the VectorN.
        var indices = [];
        var positions = numberList(uniques.length * COORDS_PER_POSITION, void 0);
        var normals = numberList(uniques.length * COORDS_PER_NORMAL, void 0);
        var coords = numberList(uniques.length * COORDS_PER_TEXTURE, void 0);
        faces.forEach(function (face, faceIndex) {
            var a = face.a;
            var b = face.b;
            var c = face.c;
            var offset = faceIndex * 3;
            indices.push(a.index);
            indices.push(b.index);
            indices.push(c.index);
        });
        uniques.forEach(function (unique) {
            var position = unique.position;
            var normal = unique.normal;
            var uvs = unique.coords;
            var index = unique.index;
            var offset2x = index * COORDS_PER_TEXTURE;
            var offset2y = offset2x + 1;
            var offset3x = index * COORDS_PER_POSITION;
            var offset3y = offset3x + 1;
            var offset3z = offset3y + 1;
            positions[offset3x] = position.x;
            positions[offset3y] = position.y;
            positions[offset3z] = position.z;
            normals[offset3x] = normal.x;
            normals[offset3y] = normal.y;
            normals[offset3z] = normal.z;
            if (isDefined(uvs)) {
                coords[offset2x] = uvs.x;
                coords[offset2y] = uvs.y;
            }
            else {
                coords[offset2x] = 0;
                coords[offset2y] = 0;
            }
        });
        var attributes = {};
        // Specifying the size fixes the length of the VectorN, disabling push and pop, etc.
        attributes[attribName(Symbolic.ATTRIBUTE_POSITION, attribMap)] = new VectorN(positions, false, positions.length);
        attributes[attribName(Symbolic.ATTRIBUTE_NORMAL, attribMap)] = new VectorN(normals, false, normals.length);
        attributes[attribName(Symbolic.ATTRIBUTE_TEXTURE, attribMap)] = new VectorN(coords, false, coords.length);
        return new Elements(new VectorN(indices, false, indices.length), attributes);
    }
    return triangleElementsFromFaces;
});

define('davinci-eight/drawLists/scene',["require", "exports", '../checks/expectArg', '../checks/isDefined'], function (require, exports, expectArg, isDefined) {
    var ProgramInfo = (function () {
        function ProgramInfo(program) {
            this.drawables = [];
            this.program = program;
        }
        return ProgramInfo;
    })();
    var scene = function () {
        var programs = {};
        var refCount = 1;
        var $context;
        function traversePrograms(callback) {
            Object.keys(programs).forEach(function (programId) {
                callback(programs[programId].program);
            });
        }
        function traverseProgramInfos(callback) {
            Object.keys(programs).forEach(function (programId) {
                callback(programs[programId]);
            });
        }
        var self = {
            addRef: function () {
                refCount++;
                // console.log("scene.addRef() => " + refCount);
                return refCount;
            },
            release: function () {
                refCount--;
                // console.log("scene.release() => " + refCount);
                if (refCount === 0) {
                    self.traverse(function (drawable) {
                        drawable.release();
                    });
                }
                return refCount;
            },
            contextFree: function () {
                self.traverse(function (drawable) {
                    drawable.contextFree();
                });
            },
            contextGain: function (context) {
                if ($context !== context) {
                    $context = expectArg('context', context).toSatisfy(context instanceof WebGLRenderingContext, "context must implement WebGLRenderingContext").value;
                    Object.keys(programs).forEach(function (programId) {
                        programs[programId].drawables.forEach(function (drawable) {
                            drawable.contextGain(context);
                            var program = drawable.program;
                            var programId = program.programId;
                        });
                    });
                }
            },
            contextLoss: function () {
                if (isDefined($context)) {
                    $context = void 0;
                    Object.keys(programs).forEach(function (programId) {
                        programs[programId].drawables.forEach(function (drawable) {
                            drawable.contextLoss();
                        });
                    });
                }
            },
            add: function (drawable) {
                drawable.addRef();
                var program = drawable.program;
                var programId = program.programId;
                if (!programs[programId]) {
                    programs[programId] = new ProgramInfo(program);
                }
                programs[programId].drawables.push(drawable);
                if ($context) {
                    program.contextGain($context);
                    drawable.contextGain($context);
                }
            },
            remove: function (drawable) {
                var program = drawable.program;
                var programId = program.programId;
                if (programs[programId]) {
                    var programInfo = new ProgramInfo(program);
                    var index = programInfo.drawables.indexOf(drawable);
                    if (index >= 0) {
                        programInfo.drawables.splice(index, 1);
                        if (programInfo.drawables.length === 0) {
                            delete programs[programId];
                        }
                    }
                }
                else {
                    throw new Error("drawable not found.");
                }
            },
            uniform1f: function (name, x) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniform1f(name, x);
                });
            },
            uniform2f: function (name, x, y) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniform2f(name, x, y);
                });
            },
            uniform3f: function (name, x, y, z) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniform3f(name, x, y, z);
                });
            },
            uniform4f: function (name, x, y, z, w) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniform4f(name, x, y, z, w);
                });
            },
            uniformMatrix1: function (name, transpose, matrix) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformMatrix1(name, transpose, matrix);
                });
            },
            uniformMatrix2: function (name, transpose, matrix) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformMatrix2(name, transpose, matrix);
                });
            },
            uniformMatrix3: function (name, transpose, matrix) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformMatrix3(name, transpose, matrix);
                });
            },
            uniformMatrix4: function (name, transpose, matrix) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformMatrix4(name, transpose, matrix);
                });
            },
            uniformVector1: function (name, vector) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformVector1(name, vector);
                });
            },
            uniformVector2: function (name, vector) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformVector2(name, vector);
                });
            },
            uniformVector3: function (name, vector) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformVector3(name, vector);
                });
            },
            uniformVector4: function (name, vector) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformVector4(name, vector);
                });
            },
            traverse: function (callback) {
                Object.keys(programs).forEach(function (programId) {
                    programs[programId].drawables.forEach(callback);
                });
            }
        };
        return self;
    };
    return scene;
});

define('davinci-eight/math/Sphere',["require", "exports"], function (require, exports) {
    var Sphere = (function () {
        function Sphere(center, radius) {
            this.center = (center !== undefined) ? center : { x: 0, y: 0, z: 0 };
            this.radius = (radius !== undefined) ? radius : 0;
        }
        Sphere.prototype.setFromPoints = function (points) {
            throw new Error("Not Implemented: Sphere.setFromPoints");
        };
        return Sphere;
    })();
    return Sphere;
});

define('davinci-eight/geometries/Geometry3',["require", "exports", '../math/Sphere', '../math/Vector3'], function (require, exports, Sphere, Vector3) {
    function updateFaceNormal(face, vertices) {
        face.vertexNormals = [];
        var vA = vertices[face.a];
        var vB = vertices[face.b];
        var vC = vertices[face.c];
        var cb = new Vector3().subVectors(vC, vB);
        var ab = new Vector3().subVectors(vA, vB);
        var normal = new Vector3().crossVectors(cb, ab).normalize();
        // TODO: I think we only need to push one normal here?
        face.vertexNormals.push(normal);
        face.vertexNormals.push(normal);
        face.vertexNormals.push(normal);
    }
    /**
     * @class Geometry3
     */
    var Geometry3 = (function () {
        function Geometry3() {
            this.vertices = [];
            this.faces = [];
            this.faceVertexUvs = [[]];
            this.dynamic = true;
            this.verticesNeedUpdate = false;
            this.elementsNeedUpdate = false;
            this.uvsNeedUpdate = false;
            this.boundingSphere = new Sphere({ x: 0, y: 0, z: 0 }, Infinity);
        }
        Geometry3.prototype.computeBoundingSphere = function () {
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
        Geometry3.prototype.computeFaceNormals = function () {
            // Avoid the this pointer in forEach callback function.
            var vertices = this.vertices;
            var updateFaceNormalCallback = function (face) { return updateFaceNormal(face, vertices); };
            this.faces.forEach(updateFaceNormalCallback);
        };
        Geometry3.prototype.computeVertexNormals = function (areaWeighted) {
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
                    vertexNormals[face.a].add(face.vertexNormals[0]);
                    vertexNormals[face.b].add(face.vertexNormals[0]);
                    vertexNormals[face.c].add(face.vertexNormals[0]);
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
        /**
         * Updates the geometry by merging closely separated vertices.
         * @method mergeVertices
         * @param precisionPoints {number} number of decimal points, eg. 4 for epsilon of 0.0001
         */
        Geometry3.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
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
        return Geometry3;
    })();
    return Geometry3;
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

define('davinci-eight/core/ArrayBuffer',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    // TODO: Rename this to avoid jshint
    var ArrayBuffer = (function () {
        function ArrayBuffer(monitor) {
            this._refCount = 1;
            this._monitor = expectArg('montor', monitor).toBeObject().value;
        }
        ArrayBuffer.prototype.addRef = function () {
            this._refCount++;
            // console.log("ArrayBuffer.addRef() => " + this._refCount);
            return this._refCount;
        };
        ArrayBuffer.prototype.release = function () {
            this._refCount--;
            // console.log("ArrayBuffer.release() => " + this._refCount);
            if (this._refCount === 0) {
                this.contextFree();
            }
            return this._refCount;
        };
        ArrayBuffer.prototype.contextFree = function () {
            if (this._buffer) {
                this._context.deleteBuffer(this._buffer);
                // console.log("WebGLBuffer deleted");
                this._buffer = void 0;
            }
            this._context = void 0;
        };
        ArrayBuffer.prototype.contextGain = function (context) {
            if (this._context !== context) {
                this.contextFree();
                this._context = context;
                this._buffer = context.createBuffer();
            }
        };
        ArrayBuffer.prototype.contextLoss = function () {
            this._buffer = void 0;
            this._context = void 0;
        };
        /**
         * @method bind
         */
        ArrayBuffer.prototype.bind = function (target) {
            if (this._context) {
                this._context.bindBuffer(target, this._buffer);
            }
            else {
                console.warn("ArrayBuffer.bind() missing WebGLRenderingContext.");
            }
        };
        return ArrayBuffer;
    })();
    return ArrayBuffer;
});

define('davinci-eight/core/ElementBuffer',["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    /**
     * Manages the WebGLBuffer used to support gl.drawElements().
     * @class ElementBuffer
     */
    var ElementBuffer = (function () {
        /**
         * @class ElementArray
         * @constructor
         */
        function ElementBuffer() {
            this._refCount = 0;
        }
        ElementBuffer.prototype.addRef = function () {
            this._refCount++;
        };
        ElementBuffer.prototype.release = function () {
            this._refCount--;
            if (this._refCount === 0) {
                this.contextFree();
            }
        };
        /**
         * @method contextFree
         */
        ElementBuffer.prototype.contextFree = function () {
            if (this._buffer) {
                this._context.deleteBuffer(this._buffer);
                this._buffer = void 0;
            }
            this._context = void 0;
        };
        /**
         * @method contextGain
         * @param context {WebGLRenderingContext}
         */
        ElementBuffer.prototype.contextGain = function (context) {
            if (this._context !== context) {
                this.contextFree();
                this._context = context;
                this._buffer = context.createBuffer();
            }
        };
        /**
         * @method contextLoss
         */
        ElementBuffer.prototype.contextLoss = function () {
            this._buffer = void 0;
            this._context = void 0;
        };
        /**
         * @method bind
         */
        ElementBuffer.prototype.bind = function () {
            if (this._context) {
                this._context.bindBuffer(this._context.ELEMENT_ARRAY_BUFFER, this._buffer);
            }
            else {
                console.warn("ElementBuffer.bind() missing WebGLRenderingContext");
            }
        };
        /**
         * @method data
         * @param data {Uint16Array}
         * @param usage {number} Optional. Defaults to STREAM_DRAW.
         */
        ElementBuffer.prototype.data = function (data, usage) {
            if (this._context) {
                usage = isDefined(usage) ? usage : this._context.STREAM_DRAW;
                this._context.bufferData(this._context.ELEMENT_ARRAY_BUFFER, data, usage);
            }
            else {
                console.warn("ElementBuffer.data() missing WebGLRenderingContext");
            }
        };
        return ElementBuffer;
    })();
    return ElementBuffer;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/GeometryAdapter',["require", "exports", '../checks/expectArg', '../core/Line3', '../core/Point3', '../core/Symbolic', '../core/DefaultAttribProvider', '../core/DrawMode', '../core/ArrayBuffer', '../core/ElementBuffer'], function (require, exports, expectArg, Line3, Point3, Symbolic, DefaultAttribProvider, DrawMode, ArrayBuffer, ElementBuffer) {
    function computeAttribData(positionVarName, positionBuffer, normalVarName, normalBuffer, drawMode) {
        var attributes = {};
        attributes[positionVarName] = { buffer: positionBuffer, size: 3 };
        if (drawMode === DrawMode.TRIANGLES) {
            attributes[normalVarName] = { buffer: normalBuffer, size: 3 };
        }
        return attributes;
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
         * @param monitor {RenderingContextMonitor}
         * @param geometry {Geometry3} The geometry that must be adapted to a AttribProvider.
         */
        function GeometryAdapter(monitor, geometry, options) {
            _super.call(this);
            this.$drawMode = DrawMode.TRIANGLES;
            this.grayScale = false;
            this.lines = [];
            this.points = [];
            expectArg('monitor', monitor).toBeObject();
            expectArg('geometry', geometry).toBeObject();
            options = options || {};
            options.drawMode = typeof options.drawMode !== 'undefined' ? options.drawMode : DrawMode.TRIANGLES;
            // TODO: Sharing of buffers.
            this.indexBuffer = new ElementBuffer();
            this.indexBuffer.addRef();
            this.positionVarName = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
            this.positionBuffer = new ArrayBuffer(monitor);
            this.positionBuffer.addRef();
            this.normalVarName = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
            this.normalBuffer = new ArrayBuffer(monitor);
            this.normalBuffer.addRef();
            this.geometry = geometry;
            this.geometry.dynamic = false;
            this.$drawMode = options.drawMode;
            this.elementsUsage = options.elementsUsage;
            this.attributeDataInfos = computeAttribData(this.positionVarName, this.positionBuffer, this.normalVarName, this.normalBuffer, this.drawMode);
        }
        GeometryAdapter.prototype.addRef = function () {
            this._refCount++;
            // console.log("GeometryAdapter.addRef() => " + this._refCount);
            return this._refCount;
        };
        GeometryAdapter.prototype.release = function () {
            this._refCount--;
            // console.log("GeometryAdapter.release() => " + this._refCount);
            if (this._refCount === 0) {
                this.indexBuffer.release();
                this.indexBuffer = void 0;
                this.positionBuffer.release();
                this.positionBuffer = void 0;
                this.normalBuffer.release();
                this.normalBuffer = void 0;
            }
            return this._refCount;
        };
        GeometryAdapter.prototype.contextFree = function () {
            this.indexBuffer.contextFree();
            this.positionBuffer.contextFree();
            this.normalBuffer.contextFree();
            _super.prototype.contextFree.call(this);
        };
        GeometryAdapter.prototype.contextGain = function (context) {
            _super.prototype.contextGain.call(this, context);
            this.elementsUsage = typeof this.elementsUsage !== 'undefined' ? this.elementsUsage : context.STREAM_DRAW;
            this.indexBuffer.contextGain(context);
            this.positionBuffer.contextGain(context);
            this.normalBuffer.contextGain(context);
            this.update();
        };
        GeometryAdapter.prototype.contextLoss = function () {
            this.indexBuffer.contextLoss();
            this.positionBuffer.contextLoss();
            this.normalBuffer.contextLoss();
            _super.prototype.contextLoss.call(this);
        };
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
        GeometryAdapter.prototype.draw = function () {
            if (this._context) {
                switch (this.drawMode) {
                    case DrawMode.POINTS:
                        {
                            this._context.drawArrays(this._context.POINTS, 0, this.points.length * 1);
                        }
                        break;
                    case DrawMode.LINES:
                        {
                            this._context.drawArrays(this._context.LINES, 0, this.lines.length * 2);
                        }
                        break;
                    case DrawMode.TRIANGLES:
                        {
                            //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
                            this._context.drawArrays(this._context.TRIANGLES, 0, this.geometry.faces.length * 3);
                        }
                        break;
                    default: {
                    }
                }
            }
            else {
                console.warn("GeometryAdapter.draw() missing WebGLRenderingContext");
            }
        };
        Object.defineProperty(GeometryAdapter.prototype, "dynamic", {
            get: function () {
                return this.geometry.dynamic;
            },
            enumerable: true,
            configurable: true
        });
        GeometryAdapter.prototype.getAttribData = function () {
            return this.attributeDataInfos;
        };
        GeometryAdapter.prototype.getAttribMeta = function () {
            var attributes = {};
            attributes[Symbolic.ATTRIBUTE_POSITION] = {
                name: this.positionVarName,
                glslType: 'vec3',
                size: 3,
                normalized: false,
                stride: 0,
                offset: 0
            };
            if (this.drawMode === DrawMode.TRIANGLES) {
                attributes[Symbolic.ATTRIBUTE_NORMAL] = {
                    name: this.normalVarName,
                    glslType: 'vec3',
                    size: 3,
                    normalized: false,
                    stride: 0,
                    offset: 0
                };
            }
            return attributes;
        };
        GeometryAdapter.prototype.update = function () {
            var vertices = [];
            var normals = [];
            var elements = [];
            var vertexList = this.geometry.vertices;
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
                            if (face.vertexNormals.length === 3) {
                                var nA = face.vertexNormals[0];
                                var nB = face.vertexNormals[1];
                                var nC = face.vertexNormals[2];
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
                            else if (face.vertexNormals.length === 1) {
                                var normal = face.vertexNormals[0];
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
                        });
                    }
                    break;
                default: {
                }
            }
            this.elementArray = new Uint16Array(elements);
            this.indexBuffer.bind();
            this._context.bufferData(this._context.ELEMENT_ARRAY_BUFFER, this.elementArray, this._context.DYNAMIC_DRAW);
            this.aVertexPositionArray = new Float32Array(vertices);
            this.positionBuffer.bind(this._context.ARRAY_BUFFER);
            this._context.bufferData(this._context.ARRAY_BUFFER, this.aVertexPositionArray, this._context.DYNAMIC_DRAW);
            this.aVertexNormalArray = new Float32Array(normals);
            this.normalBuffer.bind(this._context.ARRAY_BUFFER);
            this._context.bufferData(this._context.ARRAY_BUFFER, this.aVertexNormalArray, this._context.DYNAMIC_DRAW);
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

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Spinor3',["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    /**
     * @class Spinor3
     */
    var Spinor3 = (function (_super) {
        __extends(Spinor3, _super);
        function Spinor3(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 1]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 4);
        }
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
        Spinor3.prototype.add = function (rhs) {
            return this;
        };
        Spinor3.prototype.addVectors = function (a, b) {
            return this;
        };
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
        Spinor3.prototype.divideScalar = function (scalar) {
            this.yz /= scalar;
            this.zx /= scalar;
            this.xy /= scalar;
            this.w /= scalar;
            return this;
        };
        Spinor3.prototype.exp = function () {
            var w = this.w;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var expW = Math.exp(w);
            var B = Math.sqrt(yz * yz + zx * zx + xy * xy);
            var s = expW * (B !== 0 ? Math.sin(B) / B : 1);
            this.w = expW * Math.cos(B);
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this;
        };
        Spinor3.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        Spinor3.prototype.multiply = function (rhs) {
            var a0 = this.w;
            var a1 = this.yz;
            var a2 = this.zx;
            var a3 = this.xy;
            var b0 = rhs.w;
            var b1 = rhs.yz;
            var b2 = rhs.zx;
            var b3 = rhs.xy;
            this.w = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        Spinor3.prototype.multiplyScalar = function (scalar) {
            this.yz *= scalar;
            this.zx *= scalar;
            this.xy *= scalar;
            this.w *= scalar;
            return this;
        };
        Spinor3.prototype.quaditude = function () {
            var w = this.w;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            return w * w + yz * yz + zx * zx + xy * xy;
        };
        Spinor3.prototype.sub = function (rhs) {
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
    })(VectorN);
    return Spinor3;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/RevolutionGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry3', '../math/Spinor3', '../math/Vector2'], function (require, exports, Face3, Geometry3, Spinor3, Vector2) {
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
    })(Geometry3);
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
define('davinci-eight/geometries/BarnGeometry',["require", "exports", '../geometries/Geometry3', '../core/Face3', '../math/Vector3'], function (require, exports, Geometry3, Face3, Vector3) {
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
    })(Geometry3);
    return BarnGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/BoxGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry3', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry3, Vector2, Vector3) {
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
                        face.vertexNormals.push(normal);
                        scope.faces.push(face);
                        scope.faceVertexUvs[0].push([uva, uvb, uvd]);
                        face = new Face3(b + offset, c + offset, d + offset);
                        face.vertexNormals.push(normal);
                        scope.faces.push(face);
                        scope.faceVertexUvs[0].push([uvb.clone(), uvc, uvd.clone()]);
                    }
                }
            }
            this.mergeVertices();
        }
        return BoxGeometry;
    })(Geometry3);
    return BoxGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/CylinderGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry3', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry3, Vector2, Vector3) {
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
                    na = Vector3.copy(this.vertices[vertices[0][x]]);
                    nb = Vector3.copy(this.vertices[vertices[0][x + 1]]);
                }
                else {
                    na = Vector3.copy(this.vertices[vertices[1][x]]);
                    nb = Vector3.copy(this.vertices[vertices[1][x + 1]]);
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
    })(Geometry3);
    return CylinderGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/PolyhedronGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry3', '../math/Sphere', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry3, Sphere, Vector2, Vector3) {
    var PolyhedronGeometry = (function (_super) {
        __extends(PolyhedronGeometry, _super);
        function PolyhedronGeometry(vertices, indices, radius, detail) {
            if (radius === void 0) { radius = 1; }
            if (detail === void 0) { detail = 0; }
            _super.call(this);
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
                // FIXME: Using some modifications of the data structures given.
                // TODO: Optimize vector copies.
                faces[j] = new Face3(v1['index'], v2['index'], v3['index'], [Vector3.copy(v1), Vector3.copy(v2), Vector3.copy(v3)]);
            }
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
                this.vertices[i].x *= radius;
                this.vertices[i].y *= radius;
                this.vertices[i].z *= radius;
            }
            // Merge vertices
            this.mergeVertices();
            this.computeFaceNormals();
            this.boundingSphere = new Sphere(new Vector3([0, 0, 0]), radius);
            /*
             * Project vector onto sphere's surface
             */
            function prepare(vector) {
                var vertex = Vector3.copy(vector).normalize();
                vertex['index'] = that.vertices.push(vertex) - 1;
                // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
                var u = azimuth(vector) / 2 / Math.PI + 0.5;
                var v = inclination(vector) / Math.PI + 0.5;
                vertex['uv'] = new Vector2([u, 1 - v]);
                return vertex;
            }
            function centroid(v1, v2, v3) {
                var x = (v1.x + v2.x + v3.x) / 3;
                var y = (v1.y + v2.y + v3.y) / 3;
                var z = (v1.z + v2.z + v3.z) / 3;
                return { x: x, y: y, z: z };
            }
            // Approximate a curved face with recursively sub-divided triangles.
            function make(v1, v2, v3) {
                var face = new Face3(v1['index'], v2['index'], v3['index'], [Vector3.copy(v1), Vector3.copy(v2), Vector3.copy(v3)]);
                that.faces.push(face);
                var azi = azimuth(centroid(v1, v2, v3));
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
                    var aj = prepare(Vector3.copy(a).lerp(c, i / cols));
                    var bj = prepare(Vector3.copy(b).lerp(c, i / cols));
                    var rows = cols - i;
                    for (var j = 0; j <= rows; j++) {
                        if (j == 0 && i == cols) {
                            v[i][j] = aj;
                        }
                        else {
                            v[i][j] = prepare(Vector3.copy(aj).lerp(bj, j / rows));
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
            function inclination(pos) {
                return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
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
    })(Geometry3);
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
define('davinci-eight/geometries/EllipticalCylinderGeometry',["require", "exports", "davinci-blade/e3ga/Euclidean3", "davinci-blade/e3ga/scalarE3", "davinci-blade/e3ga/vectorE3", "davinci-blade/e3ga/bivectorE3", "davinci-blade/e3ga/pseudoscalarE3", '../geometries/Geometry3'], function (require, exports, Euclidean3, scalarE3, vectorE3, bivectorE3, pseudoscalarE3, Geometry3) {
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
    })(Geometry3);
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
define('davinci-eight/geometries/SurfaceGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry3', '../math/Vector2', '../checks/expectArg'], function (require, exports, Face3, Geometry3, Vector2, expectArg) {
    /**
     * @author zz85 / https://github.com/zz85
     * Parametric Surfaces Geometry
     * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
     *
     * new SurfaceGeometry( parametricFunction, uSegments, vSegments );
     */
    var SurfaceGeometry = (function (_super) {
        __extends(SurfaceGeometry, _super);
        function SurfaceGeometry(parametricFunction, uSegments, vSegments) {
            _super.call(this);
            expectArg('parametricFunction', parametricFunction).toBeFunction();
            expectArg('uSegments', uSegments).toBeNumber();
            expectArg('vSegments', vSegments).toBeNumber();
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
                    var point = parametricFunction(u, v);
                    // Make a copy just in case the function is returning mutable references.
                    vertices.push({ x: point.x, y: point.y, z: point.z });
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
        return SurfaceGeometry;
    })(Geometry3);
    return SurfaceGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/KleinBottleGeometry',["require", "exports", '../geometries/SurfaceGeometry', '../math/Vector3'], function (require, exports, SurfaceGeometry, Vector3) {
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
     * @extends SurfaceGeometry
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
    })(SurfaceGeometry);
    return KleinBottleGeometry;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/MobiusStripGeometry',["require", "exports", '../geometries/SurfaceGeometry', '../math/Vector3'], function (require, exports, SurfaceGeometry, Vector3) {
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
    })(SurfaceGeometry);
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
define('davinci-eight/geometries/SphereGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry3', '../math/Sphere', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry3, Sphere, Vector2, Vector3) {
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
                    var n1 = Vector3.copy(this.vertices[v1]).normalize();
                    var n2 = Vector3.copy(this.vertices[v2]).normalize();
                    var n3 = Vector3.copy(this.vertices[v3]).normalize();
                    var n4 = Vector3.copy(this.vertices[v4]).normalize();
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
    })(Geometry3);
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
define('davinci-eight/geometries/TubeGeometry',["require", "exports", '../math/clamp', '../core/Face3', '../geometries/Geometry3', '../math/Matrix4', '../math/Vector2', '../math/Vector3'], function (require, exports, clamp, Face3, Geometry3, Matrix4, Vector2, Vector3) {
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
    })(Geometry3);
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
define('davinci-eight/geometries/VortexGeometry',["require", "exports", '../core/Face3', '../geometries/Geometry3', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry3, Vector2, Vector3) {
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
    })(Geometry3);
    return VortexGeometry;
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

define('davinci-eight/programs/shaderProgram',["require", "exports", '../checks/isDefined', '../utils/uuid4', '../core/AttribLocation', '../core/UniformLocation'], function (require, exports, isDefined, uuid4, AttribLocation, UniformLocation) {
    function makeWebGLShader(ctx, source, type) {
        var shader = ctx.createShader(type);
        ctx.shaderSource(shader, source);
        ctx.compileShader(shader);
        var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
        if (compiled) {
            return shader;
        }
        else {
            if (!ctx.isContextLost()) {
                var message = ctx.getShaderInfoLog(shader);
                ctx.deleteShader(shader);
                throw new Error("Error compiling shader: " + message);
            }
            else {
                throw new Error("Context lost while compiling shader");
            }
        }
    }
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    function makeWebGLProgram(ctx, vertexShader, fragmentShader, attribs) {
        // create our shaders
        var vs = makeWebGLShader(ctx, vertexShader, ctx.VERTEX_SHADER);
        var fs = makeWebGLShader(ctx, fragmentShader, ctx.FRAGMENT_SHADER);
        // Create the program object.
        var program = ctx.createProgram();
        // console.log("WebGLProgram created");
        // Attach our two shaders to the program.
        ctx.attachShader(program, vs);
        ctx.attachShader(program, fs);
        // Bind attributes allows us to specify the index that an attribute should be bound to.
        for (var index = 0; index < attribs.length; ++index) {
            ctx.bindAttribLocation(program, index, attribs[index]);
        }
        // Link the program.
        ctx.linkProgram(program);
        // Check the link status
        var linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
        if (linked || ctx.isContextLost()) {
            return program;
        }
        else {
            var message = ctx.getProgramInfoLog(program);
            ctx.detachShader(program, vs);
            ctx.deleteShader(vs);
            ctx.detachShader(program, fs);
            ctx.deleteShader(fs);
            ctx.deleteProgram(program);
            throw new Error("Error linking program: " + message);
        }
    }
    var shaderProgram = function (monitor, vertexShader, fragmentShader, attribs) {
        if (typeof vertexShader !== 'string') {
            throw new Error("vertexShader argument must be a string.");
        }
        if (typeof fragmentShader !== 'string') {
            throw new Error("fragmentShader argument must be a string.");
        }
        var refCount = 1;
        var program;
        var $context;
        var uuid = uuid4().generate();
        var attributeLocations = {};
        var uniformLocations = {};
        var self = {
            get vertexShader() {
                return vertexShader;
            },
            get fragmentShader() {
                return fragmentShader;
            },
            get attributes() {
                return attributeLocations;
            },
            get uniforms() {
                return uniformLocations;
            },
            addRef: function () {
                refCount++;
                // console.log("shaderProgram.addRef() => " + refCount);
                return refCount;
            },
            release: function () {
                refCount--;
                // console.log("shaderProgram.release() => " + refCount);
                if (refCount === 0) {
                    self.contextFree();
                }
                return refCount;
            },
            contextFree: function () {
                if (isDefined($context)) {
                    if (program) {
                        // console.log("WebGLProgram deleted");
                        $context.deleteProgram(program);
                        program = void 0;
                    }
                    $context = void 0;
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextFree();
                    }
                    for (var uName in uniformLocations) {
                        uniformLocations[uName].contextFree();
                    }
                }
            },
            contextGain: function (context) {
                if ($context !== context) {
                    self.contextFree();
                    $context = context;
                    program = makeWebGLProgram(context, vertexShader, fragmentShader, attribs);
                    var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                    for (var a = 0; a < activeAttributes; a++) {
                        var activeAttribInfo = context.getActiveAttrib(program, a);
                        var name_1 = activeAttribInfo.name;
                        if (!attributeLocations[name_1]) {
                            attributeLocations[name_1] = new AttribLocation(monitor, name_1);
                        }
                    }
                    var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                    for (var u = 0; u < activeUniforms; u++) {
                        var activeUniformInfo = context.getActiveUniform(program, u);
                        var name_2 = activeUniformInfo.name;
                        if (!uniformLocations[name_2]) {
                            uniformLocations[name_2] = new UniformLocation(monitor, name_2);
                        }
                    }
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextGain(context, program);
                    }
                    for (var uName in uniformLocations) {
                        uniformLocations[uName].contextGain(context, program);
                    }
                }
            },
            contextLoss: function () {
                program = void 0;
                $context = void 0;
                for (var aName in attributeLocations) {
                    attributeLocations[aName].contextLoss();
                }
                for (var uName in uniformLocations) {
                    uniformLocations[uName].contextLoss();
                }
            },
            get program() { return program; },
            get programId() { return uuid; },
            use: function () {
                if ($context) {
                    $context.useProgram(program);
                }
                else {
                    console.warn("shaderProgram.use() missing WebGLRenderingContext");
                }
                return self;
            },
            enableAttrib: function (name) {
                var attribLoc = attributeLocations[name];
                if (attribLoc) {
                    attribLoc.enable();
                }
            },
            setAttributes: function (values) {
                for (var name in attributeLocations) {
                    var attribLoc = attributeLocations[name];
                    var data = values[name];
                    if (data) {
                        data.buffer.bind($context.ARRAY_BUFFER);
                        attribLoc.vertexPointer(data.size, data.normalized, data.stride, data.offset);
                    }
                    else {
                        throw new Error("The mesh does not support the attribute variable named " + name);
                    }
                }
            },
            uniform1f: function (name, x) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform1f(x);
                }
            },
            uniform2f: function (name, x, y) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform2f(x, y);
                }
            },
            uniform3f: function (name, x, y, z) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform3f(x, y, z);
                }
            },
            uniform4f: function (name, x, y, z, w) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform4f(x, y, z, w);
                }
            },
            uniformMatrix1: function (name, transpose, matrix) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.matrix1(transpose, matrix);
                }
            },
            uniformMatrix2: function (name, transpose, matrix) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.matrix2(transpose, matrix);
                }
            },
            uniformMatrix3: function (name, transpose, matrix) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.matrix3(transpose, matrix);
                }
            },
            uniformMatrix4: function (name, transpose, matrix) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.matrix4(transpose, matrix);
                }
            },
            uniformVector1: function (name, vector) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.vector1(vector);
                }
            },
            uniformVector2: function (name, vector) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.vector2(vector);
                }
            },
            uniformVector3: function (name, vector) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.vector3(vector);
                }
            },
            uniformVector4: function (name, vector) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.vector4(vector);
                }
            }
        };
        return self;
    };
    return shaderProgram;
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

define('davinci-eight/core/getUniformVarName',["require", "exports", '../checks/isDefined', '../checks/expectArg'], function (require, exports, isDefined, expectArg) {
    /**
     * Policy for how a uniform variable name is determined.
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
        for (var aName in attributes) {
            lines.push(ATTRIBUTE + attributes[aName].glslType + SPACE + getAttribVarName(attributes[aName], aName) + SEMICOLON);
        }
        for (var uName in uniforms) {
            lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
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
        }
        else if (uniforms[Symbolic.UNIFORM_COLOR]) {
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

define('davinci-eight/programs/smartProgram',["require", "exports", '../programs/fragmentShader', '../checks/isDefined', './shaderProgram', '../core/Symbolic', '../programs/vertexShader'], function (require, exports, fragmentShader, isDefined, shaderProgram, Symbolic, vertexShader) {
    function vLightRequired(uniforms) {
        return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    function vColorRequired(attributes, uniforms) {
        return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
    }
    /**
     *
     */
    var smartProgram = function (monitor, attributes, uniformsList, attribs) {
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
        var innerProgram = shaderProgram(monitor, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), attribs);
        var self = {
            get program() {
                return innerProgram.program;
            },
            get programId() {
                return innerProgram.programId;
            },
            get attributes() {
                return innerProgram.attributes;
            },
            get uniforms() {
                return innerProgram.uniforms;
            },
            get vertexShader() {
                return innerProgram.vertexShader;
            },
            get fragmentShader() {
                return innerProgram.fragmentShader;
            },
            addRef: function () {
                return innerProgram.addRef();
            },
            release: function () {
                return innerProgram.release();
            },
            contextFree: function () {
                return innerProgram.contextFree();
            },
            contextGain: function (context) {
                return innerProgram.contextGain(context);
            },
            contextLoss: function () {
                return innerProgram.contextLoss();
            },
            use: function () {
                return innerProgram.use();
            },
            enableAttrib: function (name) {
                return innerProgram.enableAttrib(name);
            },
            setAttributes: function (values) {
                return innerProgram.setAttributes(values);
            },
            uniform1f: function (name, x) {
                return innerProgram.uniform1f(name, x);
            },
            uniform2f: function (name, x, y) {
                return innerProgram.uniform2f(name, x, y);
            },
            uniform3f: function (name, x, y, z) {
                return innerProgram.uniform3f(name, x, y, z);
            },
            uniform4f: function (name, x, y, z, w) {
                return innerProgram.uniform4f(name, x, y, z, w);
            },
            uniformMatrix1: function (name, transpose, matrix) {
                return innerProgram.uniformMatrix1(name, transpose, matrix);
            },
            uniformMatrix2: function (name, transpose, matrix) {
                return innerProgram.uniformMatrix2(name, transpose, matrix);
            },
            uniformMatrix3: function (name, transpose, matrix) {
                return innerProgram.uniformMatrix3(name, transpose, matrix);
            },
            uniformMatrix4: function (name, transpose, matrix) {
                return innerProgram.uniformMatrix4(name, transpose, matrix);
            },
            uniformVector1: function (name, vector) {
                return innerProgram.uniformVector1(name, vector);
            },
            uniformVector2: function (name, vector) {
                return innerProgram.uniformVector2(name, vector);
            },
            uniformVector3: function (name, vector) {
                return innerProgram.uniformVector3(name, vector);
            },
            uniformVector4: function (name, vector) {
                return innerProgram.uniformVector4(name, vector);
            }
        };
        return self;
    };
    return smartProgram;
});

define('davinci-eight/programs/programFromScripts',["require", "exports", '../programs/shaderProgram', '../checks/expectArg'], function (require, exports, shaderProgram, expectArg) {
    /**
     * @method programFromScripts
     * @param monitor {RenderingContextMonitor}
     * @param vsId {string} The vertex shader script element identifier.
     * @param fsId {string} The fragment shader script element identifier.
     * @param $document {Document} The document containing the script elements.
     */
    function programFromScripts(monitor, vsId, fsId, $document, attribs) {
        if (attribs === void 0) { attribs = []; }
        expectArg('vsId', vsId).toBeString();
        expectArg('fsId', fsId).toBeString();
        expectArg('$document', $document).toBeObject();
        function $(id) {
            expectArg('id', id).toBeString();
            var element = $document.getElementById(id);
            if (element) {
                return element;
            }
            else {
                throw new Error(id + " is not a valid DOM element identifier.");
            }
        }
        var vertexShader = $(vsId).textContent;
        var fragmentShader = $(fsId).textContent;
        return shaderProgram(monitor, vertexShader, fragmentShader, attribs);
    }
    return programFromScripts;
});

define('davinci-eight/resources/Texture',["require", "exports"], function (require, exports) {
    var Texture = (function () {
        function Texture(monitor) {
            this._refCount = 1;
        }
        Texture.prototype.addRef = function () {
            this._refCount++;
            return this._refCount;
        };
        Texture.prototype.release = function () {
            this._refCount--;
            if (this._refCount === 0) {
                this.contextFree();
            }
            return this._refCount;
        };
        Texture.prototype.contextFree = function () {
            if (this._texture) {
                this._context.deleteTexture(this._texture);
                // console.log("WebGLTexture deleted");
                this._texture = void 0;
            }
            this._context = void 0;
        };
        Texture.prototype.contextGain = function (context) {
            if (this._context !== context) {
                this.contextFree();
                this._context = context;
                this._texture = context.createTexture();
            }
        };
        Texture.prototype.contextLoss = function () {
            this._texture = void 0;
            this._context = void 0;
        };
        /**
         * @method bind
         * @parameter target {number}
         */
        Texture.prototype.bind = function (target) {
            if (this._context) {
                this._context.bindTexture(target, this._texture);
            }
            else {
                console.warn("Texture.bind(target) missing WebGLRenderingContext.");
            }
        };
        return Texture;
    })();
    return Texture;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Matrix3',["require", "exports", '../math/AbstractMatrix'], function (require, exports, AbstractMatrix) {
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
        /**
         * Constructs a Matrix4 by wrapping a Float32Array.
         * @constructor
         */
        function Matrix3(data) {
            _super.call(this, data, 9);
        }
        Matrix3.identity = function () {
            return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        Matrix3.prototype.getInverse = function (matrix, throwOnInvertible) {
            // input: THREE.Matrix4
            // ( based on http://code.google.com/p/webgl-mjs/ )
            var me = matrix.data;
            var te = this.data;
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
            var m = this.data;
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
            var te = this.data;
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
            var m = this.data;
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
    })(AbstractMatrix);
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
        Quaternion.prototype.add = function (element) {
            return this;
        };
        Quaternion.prototype.addVectors = function (a, b) {
            return this;
        };
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
        Quaternion.prototype.divideScalar = function (scalar) {
            return this;
        };
        Quaternion.prototype.dot = function (v) {
            return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
        };
        Quaternion.prototype.exp = function () {
            return this;
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
        Quaternion.prototype.multiplyScalar = function (scalar) {
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
            var te = m.data, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33, s;
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
        Quaternion.prototype.sub = function (rhs) {
            return this;
        };
        Quaternion.prototype.equals = function (quaternion) {
            return (quaternion._x === this._x) && (quaternion._y === this._y) && (quaternion._z === this._z) && (quaternion._w === this._w);
        };
        Quaternion.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this._x = array[offset];
            this._y = array[offset + 1];
            this._z = array[offset + 2];
            this._w = array[offset + 3];
            this.onChangeCallback();
            return this;
        };
        Quaternion.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
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

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Vector4',["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    /**
     * @class Vector4
     */
    var Vector4 = (function (_super) {
        __extends(Vector4, _super);
        /**
         * @class Vector4
         * @constructor
         * @param data {number[]} Default is [0, 0, 0, 0].
         * @param modified {boolean} Default is false.
         */
        function Vector4(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 4);
        }
        Object.defineProperty(Vector4.prototype, "x", {
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
        Vector4.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Object.defineProperty(Vector4.prototype, "y", {
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
        Vector4.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Object.defineProperty(Vector4.prototype, "z", {
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
        Vector4.prototype.setZ = function (z) {
            this.z = z;
            return this;
        };
        Object.defineProperty(Vector4.prototype, "w", {
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
        Vector4.prototype.setW = function (w) {
            this.w = w;
            return this;
        };
        Vector4.prototype.add = function (rhs) {
            return this;
        };
        Vector4.prototype.addVectors = function (a, b) {
            return this;
        };
        Vector4.prototype.clone = function () {
            return new Vector4([this.x, this.y, this.z, this.w]);
        };
        Vector4.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = v.w;
            return this;
        };
        Vector4.prototype.divideScalar = function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            this.z /= scalar;
            this.w /= scalar;
            return this;
        };
        Vector4.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            this.w *= scalar;
            return this;
        };
        Vector4.prototype.sub = function (rhs) {
            return this;
        };
        return Vector4;
    })(VectorN);
    return Vector4;
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
    function arrowMesh(monitor, options) {
        var base = new GeometryAdapter(monitor, arrowGeometry(options), adapterOptions(options));
        var refCount = 1;
        var publicAPI = {
            draw: function () {
                return base.draw();
            },
            update: function () {
                return base.update();
            },
            getAttribData: function () {
                return base.getAttribData();
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
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                if (refCount === 0) {
                    base.release();
                    base = void 0;
                }
                return refCount;
            },
            contextFree: function () {
                return base.contextFree();
            },
            contextGain: function (context) {
                return base.contextGain(context);
            },
            contextLoss: function () {
                return base.contextLoss();
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
        ArrowBuilder.prototype.buildMesh = function (monitor) {
            return arrowMesh(monitor, this);
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
    function boxMesh(monitor, options) {
        var base = new GeometryAdapter(monitor, boxGeometry(options), adapterOptions(options));
        base.addRef();
        var refCount = 1;
        var self = {
            draw: function () {
                return base.draw();
            },
            update: function () {
                return base.update();
            },
            getAttribData: function () {
                return base.getAttribData();
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
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                if (refCount === 0) {
                    base.release();
                    base = void 0;
                }
                return refCount;
            },
            contextFree: function () {
                return base.contextFree();
            },
            contextGain: function (context) {
                return base.contextGain(context);
            },
            contextLoss: function () {
                return base.contextLoss();
            }
        };
        return self;
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
        BoxBuilder.prototype.buildMesh = function (monitor) {
            return boxMesh(monitor, this);
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
    function cylinderMesh(monitor, options) {
        var base = new GeometryAdapter(monitor, cylinderGeometry(options), adapterOptions(options));
        var refCount = 1;
        var publicAPI = {
            draw: function () {
                return base.draw();
            },
            update: function () {
                return base.update();
            },
            getAttribData: function () {
                return base.getAttribData();
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
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                if (refCount === 0) {
                    base.release();
                    base = void 0;
                }
                return refCount;
            },
            contextFree: function () {
                return base.contextFree();
            },
            contextGain: function (context) {
                return base.contextGain(context);
            },
            contextLoss: function () {
                return base.contextLoss();
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
        CylinderMeshBuilder.prototype.buildMesh = function (monitor) {
            return cylinderMesh(monitor, this);
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
    function sphereMesh(monitor, options) {
        var base = new GeometryAdapter(monitor, sphereGeometry(options), adapterOptions(options));
        var refCount = 1;
        var publicAPI = {
            draw: function () {
                return base.draw();
            },
            update: function () {
                return base.update();
            },
            getAttribData: function () {
                return base.getAttribData();
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
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                if (refCount === 0) {
                    base.release();
                    base = void 0;
                }
                return refCount;
            },
            contextFree: function () {
                return base.contextFree();
            },
            contextGain: function (context) {
                return base.contextGain(context);
            },
            contextLoss: function () {
                return base.contextLoss();
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
        SphereBuilder.prototype.buildMesh = function (monitor) {
            return sphereMesh(monitor, this);
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
    function vortexMesh(monitor, options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(monitor, vortexGeometry(checkedOptions), adapterOptions(checkedOptions));
        var refCount = 1;
        var publicAPI = {
            draw: function () {
                return base.draw();
            },
            update: function () {
                return base.update();
            },
            getAttribData: function () {
                return base.getAttribData();
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
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                if (refCount === 0) {
                    base.release();
                    base = void 0;
                }
                return refCount;
            },
            contextFree: function () {
                return base.contextFree();
            },
            contextGain: function (context) {
                return base.contextGain(context);
            },
            contextLoss: function () {
                return base.contextLoss();
            }
        };
        return publicAPI;
    }
    return vortexMesh;
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

define('davinci-eight/renderers/renderer',["require", "exports", '../core/Color', '../checks/expectArg'], function (require, exports, Color, expectArg) {
    var DefaultDrawableVisitor = (function () {
        function DefaultDrawableVisitor() {
        }
        DefaultDrawableVisitor.prototype.primitive = function (mesh, program, model) {
            if (mesh.dynamic) {
                mesh.update();
            }
            program.use();
            model.accept(program);
            program.setAttributes(mesh.getAttribData());
            var attributes = program.attributes;
            // TODO: Would be nice to have a program shortcut...
            Object.keys(attributes).forEach(function (key) {
                attributes[key].enable();
            });
            mesh.draw();
            // TODO: Would be nice to have a program shortcut...
            Object.keys(attributes).forEach(function (key) {
                attributes[key].disable();
            });
        };
        return DefaultDrawableVisitor;
    })();
    // This visitor is completely stateless so we can create it here.
    var drawVisitor = new DefaultDrawableVisitor();
    var renderer = function (canvas, parameters) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        parameters = parameters || {};
        var $context = void 0;
        var refCount = 1;
        var autoClear = true;
        var clearColor = Color.fromRGB(0, 0, 0);
        var clearAlpha = 0;
        function drawHandler(drawable) {
            drawable.accept(drawVisitor);
        }
        var self = {
            get canvas() { return canvas; },
            get context() { return $context; },
            addRef: function () {
                refCount++;
                // console.log("renderer.addRef() => " + refCount);
                return refCount;
            },
            release: function () {
                refCount--;
                // console.log("renderer.release() => " + refCount);
                if (refCount === 0) {
                    $context = void 0;
                }
                return refCount;
            },
            contextFree: function () {
                $context = void 0;
            },
            contextGain: function (context) {
                //let attributes: WebGLContextAttributes = context.getContextAttributes();
                //console.log(context.getParameter(context.VERSION));
                //console.log("alpha                 => " + attributes.alpha);
                //console.log("antialias             => " + attributes.antialias);
                //console.log("depth                 => " + attributes.depth);
                //console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
                //console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
                //console.log("stencil               => " + attributes.stencil);
                $context = context;
                context.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha);
                context.clearDepth(1.0);
                context.enable($context.DEPTH_TEST);
                context.depthFunc($context.LEQUAL);
                context.viewport(0, 0, canvas.width, canvas.height);
            },
            contextLoss: function () {
                $context = void 0;
            },
            get autoClear() {
                return autoClear;
            },
            set autoClear(value) {
                autoClear = expectArg('autoClear', value).toBeBoolean().value;
            },
            clearColor: function (red, green, blue, alpha) {
                clearColor.r = expectArg('red', red).toBeNumber().value;
                clearColor.g = expectArg('green', green).toBeNumber().value;
                clearColor.b = expectArg('blue', blue).toBeNumber().value;
                clearAlpha = expectArg('alpha', alpha).toBeNumber().value;
                if ($context) {
                    $context.clearColor(red, green, blue, alpha);
                }
            },
            render: function (drawList) {
                if ($context) {
                    if (autoClear) {
                        $context.clear($context.COLOR_BUFFER_BIT | $context.DEPTH_BUFFER_BIT);
                    }
                }
                else {
                    console.warn("renderer is unable to clear because WebGLRenderingContext is missing");
                }
                drawList.traverse(drawHandler);
            }
        };
        return self;
    };
    return renderer;
});

define('davinci-eight/utils/contextProxy',["require", "exports", '../core/ArrayBuffer', '../dfx/Elements', '../renderers/initWebGL', '../checks/expectArg', '../checks/isDefined', '../checks/isUndefined', '../core/Symbolic', '../resources/Texture'], function (require, exports, ArrayBuffer, Elements, initWebGL, expectArg, isDefined, isUndefined, Symbolic, Texture) {
    var ElementBlob = (function () {
        function ElementBlob(elements, indices, positions, drawMode, drawType) {
            this.elements = elements;
            this.indices = indices;
            this.positions = positions;
            this.drawMode = drawMode;
            this.drawType = drawType;
        }
        return ElementBlob;
    })();
    function isDrawMode(mode, context) {
        expectArg('mode', mode).toBeNumber();
        switch (mode) {
            case context.TRIANGLES: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    function isBufferUsage(usage, context) {
        expectArg('usage', usage).toBeNumber();
        switch (usage) {
            case context.STATIC_DRAW: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    function messageUnrecognizedToken(token) {
        expectArg('token', token).toBeString();
        return token + " is not a recognized token";
    }
    function assertProgram(argName, program) {
        expectArg(argName, program).toBeObject();
    }
    function attribName(name, attribMap) {
        if (isUndefined(attribMap)) {
            return name;
        }
        else {
            var alias = attribMap[name];
            return isDefined(alias) ? alias : name;
        }
    }
    function contextProxy(canvas, attributes) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        var users = [];
        var context;
        var refCount = 1;
        var mirror = true;
        var tokenMap = {};
        var tokenArg = expectArg('token', "");
        var webGLContextLost = function (event) {
            event.preventDefault();
            context = void 0;
            users.forEach(function (user) {
                user.contextLoss();
            });
        };
        var webGLContextRestored = function (event) {
            event.preventDefault();
            context = initWebGL(canvas, attributes);
            users.forEach(function (user) {
                user.contextGain(context);
            });
        };
        var self = {
            checkIn: function (elements, mode, usage) {
                expectArg('elements', elements).toSatisfy(elements instanceof Elements, "elements must be an instance of Elements");
                expectArg('mode', mode).toSatisfy(isDrawMode(mode, context), "mode must be one of TRIANGLES, ...");
                if (isDefined(usage)) {
                    expectArg('usage', usage).toSatisfy(isBufferUsage(usage, context), "usage must be on of STATIC_DRAW, ...");
                }
                else {
                    usage = context.STATIC_DRAW;
                }
                var token = Math.random().toString();
                // indices
                var indices = self.vertexBuffer();
                indices.bind(context.ELEMENT_ARRAY_BUFFER);
                context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
                context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
                // attributes
                var positions = self.vertexBuffer();
                positions.bind(context.ARRAY_BUFFER);
                // TODO: Here we are looking for the attribute in a specific location, but later data-driven.
                context.bufferData(context.ARRAY_BUFFER, new Float32Array(elements.attributes[Symbolic.ATTRIBUTE_POSITION].data), usage);
                context.bindBuffer(context.ARRAY_BUFFER, null);
                // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                tokenMap[token] = new ElementBlob(elements, indices, positions, mode, context.UNSIGNED_SHORT);
                return token;
            },
            setUp: function (token, program, attribMap) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    if (isDefined(program)) {
                        var indices = blob.indices;
                        indices.bind(context.ELEMENT_ARRAY_BUFFER);
                        var positions = blob.positions;
                        positions.bind(context.ARRAY_BUFFER);
                        // TODO: This hard coded name should vanish.
                        var aName = attribName(Symbolic.ATTRIBUTE_POSITION, attribMap);
                        var posLocation = program.attributes[aName];
                        if (isDefined(posLocation)) {
                            posLocation.vertexPointer(3);
                        }
                        else {
                            throw new Error(aName + " is not a valid program attribute");
                        }
                        context.bindBuffer(context.ARRAY_BUFFER, null);
                    }
                    else {
                        assertProgram('program', program);
                    }
                }
                else {
                    throw new Error(messageUnrecognizedToken(token));
                }
            },
            draw: function (token) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    var elements = blob.elements;
                    context.drawElements(blob.drawMode, elements.indices.length, blob.drawType, 0);
                }
                else {
                    throw new Error(messageUnrecognizedToken(token));
                }
            },
            tearDown: function (token, program) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
                }
                else {
                    throw new Error(messageUnrecognizedToken(token));
                }
            },
            checkOut: function (token) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    var indices = blob.indices;
                    self.removeContextUser(indices);
                    // Do the same for the attributes.
                    delete tokenMap[token];
                    return blob.elements;
                }
                else {
                    throw new Error(messageUnrecognizedToken(token));
                }
            },
            start: function () {
                context = initWebGL(canvas, attributes);
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                users.forEach(function (user) { user.contextGain(context); });
                return self;
            },
            stop: function () {
                context = void 0;
                users.forEach(function (user) { user.contextFree(); });
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
                return self;
            },
            addContextUser: function (user) {
                expectArg('user', user).toBeObject();
                user.addRef();
                users.push(user);
                if (context) {
                    user.contextGain(context);
                }
                return self;
            },
            removeContextUser: function (user) {
                expectArg('user', user).toBeObject();
                var index = users.indexOf(user);
                if (index >= 0) {
                    users.splice(index, 1);
                    user.release();
                }
                return self;
            },
            get context() {
                if (isDefined(context)) {
                    return context;
                }
                else {
                    console.warn("property context: WebGLRenderingContext is not defined. Either context has been lost or start() not called.");
                    return void 0;
                }
            },
            addRef: function () {
                refCount++;
                // console.log("monitor.addRef() => " + refCount);
                return refCount;
            },
            release: function () {
                refCount--;
                // console.log("monitor.release() => " + refCount);
                if (refCount === 0) {
                    while (users.length > 0) {
                        users.pop().release();
                    }
                }
                return refCount;
            },
            clearColor: function (red, green, blue, alpha) {
                if (context) {
                    return context.clearColor(red, green, blue, alpha);
                }
            },
            clearDepth: function (depth) {
                if (context) {
                    return context.clearDepth(depth);
                }
            },
            drawArrays: function (mode, first, count) {
                if (context) {
                    return context.drawArrays(mode, first, count);
                }
            },
            drawElements: function (mode, count, type, offset) {
                if (context) {
                    return context.drawElements(mode, count, type, offset);
                }
            },
            depthFunc: function (func) {
                if (context) {
                    return context.depthFunc(func);
                }
            },
            enable: function (capability) {
                if (context) {
                    return context.enable(capability);
                }
            },
            texture: function () {
                var texture = new Texture(self);
                self.addContextUser(texture);
                return texture;
            },
            vertexBuffer: function () {
                var vbo = new ArrayBuffer(self);
                self.addContextUser(vbo);
                return vbo;
            },
            get mirror() {
                return mirror;
            },
            set mirror(value) {
                mirror = expectArg('mirror', value).toBeBoolean().value;
            }
        };
        return self;
    }
    return contextProxy;
});

define('davinci-eight/utils/Model',["require", "exports", '../math/Matrix3', '../math/Matrix4', '../math/Spinor3', '../math/Vector3'], function (require, exports, Matrix3, Matrix4, Spinor3, Vector3) {
    /**
     * Model implements UniformData required for manipulating a body.
     */
    var Model = (function () {
        /**
         * Model implements UniformData required for manipulating a body.
         */
        function Model() {
            this.position = new Vector3(); // default is the origin.
            this.attitude = new Spinor3(); // default is unity.
            this.scale = new Vector3([1, 1, 1]); // default is to not scale.
            this.color = new Vector3([1, 1, 1]); // default is white.
            this.position.modified = true;
            this.attitude.modified = true;
            this.scale.modified = true;
            this.color.modified = true;
        }
        Model.prototype.accept = function (visitor) {
            var S = Matrix4.identity();
            S.scaling(this.scale);
            var T = Matrix4.identity();
            T.translation(this.position);
            var R = Matrix4.identity();
            R.rotation(this.attitude);
            var M = T.mul(R.mul(S));
            var N = Matrix3.identity();
            N.normalFromMatrix4(M);
            visitor.uniformMatrix4('uModelMatrix', false, M);
            visitor.uniformMatrix3('uNormalMatrix', false, N);
            visitor.uniformVector3('uColor', this.color);
        };
        return Model;
    })();
    return Model;
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
define('davinci-eight',["require", "exports", 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/frustumMatrix', 'davinci-eight/cameras/perspective', 'davinci-eight/cameras/perspectiveMatrix', 'davinci-eight/cameras/view', 'davinci-eight/cameras/viewMatrix', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/DefaultAttribProvider', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Face3', 'davinci-eight/objects/primitive', 'davinci-eight/core/UniformLocation', 'davinci-eight/curves/Curve', 'davinci-eight/dfx/Elements', 'davinci-eight/dfx/Face', 'davinci-eight/dfx/FaceVertex', 'davinci-eight/dfx/makeBoxGeometry', 'davinci-eight/dfx/triangleElementsFromFaces', 'davinci-eight/drawLists/scene', 'davinci-eight/geometries/Geometry3', 'davinci-eight/geometries/GeometryAdapter', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BarnGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/EllipticalCylinderGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/SurfaceGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/programFromScripts', 'davinci-eight/resources/Texture', 'davinci-eight/core/ArrayBuffer', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Quaternion', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector1', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/math/Vector4', 'davinci-eight/math/VectorN', 'davinci-eight/mesh/arrowMesh', 'davinci-eight/mesh/ArrowBuilder', 'davinci-eight/mesh/boxMesh', 'davinci-eight/mesh/BoxBuilder', 'davinci-eight/mesh/cylinderMesh', 'davinci-eight/mesh/CylinderArgs', 'davinci-eight/mesh/CylinderMeshBuilder', 'davinci-eight/mesh/sphereMesh', 'davinci-eight/mesh/SphereBuilder', 'davinci-eight/mesh/vortexMesh', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/utils/contextProxy', 'davinci-eight/utils/Model', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, frustum, frustumMatrix, perspective, perspectiveMatrix, view, viewMatrix, AttribLocation, DefaultAttribProvider, Color, core, DrawMode, Face3, primitive, UniformLocation, Curve, Elements, Face, FaceVertex, makeBoxGeometry, triangleElementsFromFaces, scene, Geometry3, GeometryAdapter, ArrowGeometry, BarnGeometry, BoxGeometry, CylinderGeometry, DodecahedronGeometry, EllipticalCylinderGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, SurfaceGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, shaderProgram, smartProgram, programFromScripts, Texture, ArrayBuffer, Matrix3, Matrix4, Quaternion, Spinor3, Vector1, Vector2, Vector3, Vector4, VectorN, arrowMesh, ArrowBuilder, boxMesh, BoxBuilder, cylinderMesh, CylinderArgs, CylinderMeshBuilder, sphereMesh, SphereBuilder, vortexMesh, initWebGL, renderer, contextProxy, Model, workbench3D, windowAnimationRunner) {
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
        // TODO: Arrange in alphabetical order in order to assess width of API.
        get initWebGL() { return initWebGL; },
        get Model() { return Model; },
        get Face() { return Face; },
        get FaceVertex() { return FaceVertex; },
        get frustum() { return frustum; },
        get frustumMatrix() { return frustumMatrix; },
        get perspective() { return perspective; },
        get perspectiveMatrix() { return perspectiveMatrix; },
        get view() { return view; },
        get viewMatrix() { return viewMatrix; },
        get scene() { return scene; },
        get renderer() { return renderer; },
        get webgl() { return contextProxy; },
        workbench: workbench3D,
        animation: windowAnimationRunner,
        get DefaultAttribProvider() { return DefaultAttribProvider; },
        get primitive() { return primitive; },
        get DrawMode() { return DrawMode; },
        get AttribLocation() { return AttribLocation; },
        get UniformLocation() { return UniformLocation; },
        get shaderProgram() {
            return shaderProgram;
        },
        get smartProgram() {
            return smartProgram;
        },
        get Color() { return Color; },
        get Face3() { return Face3; },
        get Geometry3() { return Geometry3; },
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
        get SurfaceGeometry() { return SurfaceGeometry; },
        get PolyhedronGeometry() { return PolyhedronGeometry; },
        get RevolutionGeometry() { return RevolutionGeometry; },
        get SphereGeometry() { return SphereGeometry; },
        get TetrahedronGeometry() { return TetrahedronGeometry; },
        get TubeGeometry() { return TubeGeometry; },
        get VortexGeometry() { return VortexGeometry; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get Spinor3() { return Spinor3; },
        get Quaternion() { return Quaternion; },
        get Vector1() { return Vector1; },
        get Vector2() { return Vector2; },
        get Vector3() { return Vector3; },
        get Vector4() { return Vector4; },
        get VectorN() { return VectorN; },
        get Curve() { return Curve; },
        // mesh
        get arrowMesh() { return arrowMesh; },
        get ArrowBuilder() { return ArrowBuilder; },
        get boxMesh() { return boxMesh; },
        get BoxBuilder() { return BoxBuilder; },
        get boxFaces() { return makeBoxGeometry; },
        get CylinderArgs() { return CylinderArgs; },
        get cylinderMesh() { return cylinderMesh; },
        get CylinderMeshBuilder() { return CylinderMeshBuilder; },
        get sphereMesh() { return sphereMesh; },
        get SphereBuilder() { return SphereBuilder; },
        get vortexMesh() { return vortexMesh; },
        // programs
        get programFromScripts() { return programFromScripts; },
        // resources
        get Texture() { return Texture; },
        get triangleElementsFromFaces() { return triangleElementsFromFaces; },
        get ArrayBuffer() { return ArrayBuffer; },
        get Elements() { return Elements; }
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
