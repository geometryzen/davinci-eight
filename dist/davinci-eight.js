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
    // FIXME: This plays havok with the TypeScript compiler stack and encourages temporary object creation.
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
        VectorN.prototype.clone = function () {
            return new VectorN(this._data, this.modified, this._size);
        };
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
        // TODO: How to prototype this as ...items: T[]
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
            var existing = data[index];
            if (value !== existing) {
                data[index] = value;
                this.data = data;
                this.modified = true;
            }
        };
        VectorN.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            var data = this.data;
            var length = data.length;
            for (var i = 0; i < length; i++) {
                array[offset + i] = data[i];
            }
            return array;
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

define('davinci-eight/math/wedgeXY',["require", "exports"], function (require, exports) {
    /**
     * Computes the z component of the cross-product of Cartesian vector components.
     */
    function wedgeXY(ax, ay, az, bx, by, bz) {
        return ax * by - ay * bx;
    }
    return wedgeXY;
});

define('davinci-eight/math/wedgeYZ',["require", "exports"], function (require, exports) {
    /**
     * Computes the x component of the cross-product of Cartesian vector components.
     */
    function wedgeYZ(ax, ay, az, bx, by, bz) {
        return ay * bz - az * by;
    }
    return wedgeYZ;
});

define('davinci-eight/math/wedgeZX',["require", "exports"], function (require, exports) {
    /**
     * Computes the y component of the cross-product of Cartesian vector components.
     */
    function wedgeZX(ax, ay, az, bx, by, bz) {
        return az * bx - ax * bz;
    }
    return wedgeZX;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Vector3',["require", "exports", '../checks/expectArg', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, expectArg, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
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
            return this.sum(this, v);
        };
        Vector3.prototype.sum = function (a, b) {
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
        Vector3.prototype.rotate = function (spinor) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = spinor.xy;
            var b = spinor.yz;
            var c = spinor.zx;
            var w = spinor.w;
            var ix = w * x - c * z + a * y;
            var iy = w * y - a * x + b * z;
            var iz = w * z - b * y + c * x;
            var iw = b * x + c * y + a * z;
            this.x = ix * w + iw * b + iy * a - iz * c;
            this.y = iy * w + iw * c + iz * b - ix * a;
            this.z = iz * w + iw * a + ix * c - iy * b;
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
            var x = wedgeYZ(ax, ay, az, bx, by, bz);
            var y = wedgeZX(ax, ay, az, bx, by, bz);
            var z = wedgeXY(ax, ay, az, bx, by, bz);
            this.set(x, y, z);
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
        Vector3.prototype.lerp = function (target, alpha) {
            this.x += (target.x - this.x) * alpha;
            this.y += (target.y - this.y) * alpha;
            this.z += (target.z - this.z) * alpha;
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
            return this.difference(this, v);
        };
        Vector3.prototype.difference = function (a, b) {
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

define('davinci-eight/math/_M4_x_M4_',["require", "exports"], function (require, exports) {
    function _M4_x_M4_(ae, be, oe) {
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
    }
    return _M4_x_M4_;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Matrix4',["require", "exports", '../math/AbstractMatrix', '../checks/expectArg', '../checks/isDefined', '../math/_M4_x_M4_'], function (require, exports, AbstractMatrix, expectArg, isDefined, _M4_x_M4_) {
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
        Matrix4.prototype.multiply = function (rhs) {
            return this.product(this, rhs);
        };
        Matrix4.prototype.product = function (a, b) {
            _M4_x_M4_(a.data, b.data, this.data);
            return this;
        };
        // TODO: This should not be here.
        Matrix4.prototype.rotate = function (spinor) {
            var S = Matrix4.rotation(spinor);
            _M4_x_M4_(S.data, this.data, this.data);
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
            _M4_x_M4_(S.data, this.data, this.data);
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
            _M4_x_M4_(T.data, this.data, this.data);
            return this;
        };
        Matrix4.prototype.translation = function (displacement) {
            return this.set(1, 0, 0, displacement.x, 0, 1, 0, displacement.y, 0, 0, 1, displacement.z, 0, 0, 0, 1);
        };
        Matrix4.prototype.__mul__ = function (other) {
            if (other instanceof Matrix4) {
                return Matrix4.identity().product(this, other);
            }
            else if (typeof other === 'number') {
                return this.clone().multiplyScalar(other);
            }
        };
        Matrix4.prototype.__rmul__ = function (other) {
            if (other instanceof Matrix4) {
                return Matrix4.identity().product(other, this);
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
        Symbolic.ATTRIBUTE_COLOR = 'aColor';
        Symbolic.ATTRIBUTE_MATERIAL_INDEX = 'aMaterialIndex';
        Symbolic.ATTRIBUTE_NORMAL = 'aNormal';
        Symbolic.ATTRIBUTE_POSITION = 'aPosition';
        Symbolic.ATTRIBUTE_TEXTURE_COORDS = 'aTextureCoords';
        Symbolic.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        Symbolic.UNIFORM_COLOR = 'uColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        Symbolic.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        Symbolic.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        Symbolic.UNIFORM_PROJECTION_MATRIX = 'uProjection';
        Symbolic.UNIFORM_MODEL_MATRIX = 'uModel';
        Symbolic.UNIFORM_NORMAL_MATRIX = 'uNormal';
        Symbolic.UNIFORM_VIEW_MATRIX = 'uView';
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
        var n = new Vector3().difference(eye, look);
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
        Vector1.prototype.sum = function (a, b) {
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
        Vector1.prototype.difference = function (a, b) {
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
        Vector1.prototype.rotate = function (rotor) {
            return this;
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
            this.difference(v2, v1).multiplyScalar(alpha).add(v1);
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
     * to use the AttribLocation instances managed by the Program because
     * there will be improved integrity and context loss management.
     * @class AttribLocation
     * @implements ContextProgramListener
     */
    var AttribLocation = (function () {
        /**
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * @class AttribLocation
         * @constructor
         * @param manager {ContextManager} Unused. May be used later e.g. for mirroring.
         * @param name {string} The name of the variable as it appears in the GLSL program.
         */
        function AttribLocation(manager, name) {
            expectArg('manager', manager).toBeObject().value;
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
        /**
         * @method enable
         */
        AttribLocation.prototype.enable = function () {
            this._context.enableVertexAttribArray(this._index);
        };
        /**
         * @method disable
         */
        AttribLocation.prototype.disable = function () {
            this._context.disableVertexAttribArray(this._index);
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
        ASSERTIVE: false,
        DEFENSIVE: false,
        GITHUB: 'https://github.com/geometryzen/davinci-eight',
        LAST_AUTHORED_DATE: '2015-09-17',
        NAMESPACE: 'EIGHT',
        LOG_WEBGL_CONTEXT_ATTRIBUTES: false,
        LOG_WEBGL_VERSION: true,
        VERBOSE: true,
        VERSION: '2.97.0'
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
         * @param manager {ContextManager} Unused. May be used later e.g. for mirroring.
         * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
         */
        function UniformLocation(manager, name) {
            this._x = void 0;
            this._y = void 0;
            this._z = void 0;
            this._w = void 0;
            this._matrix4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(function () { return void 0; });
            this._transpose = void 0;
            expectArg('manager', manager).toBeObject().value;
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
            this._context = context;
            // FIXME: Uniform locations are created for a specific program,
            // which means that locations cannot be shared.
            this._location = context.getUniformLocation(program, this._name);
            this._program = program;
        };
        /**
         * @method contextLoss
         */
        UniformLocation.prototype.contextLoss = function () {
            this._context = void 0;
            this._location = void 0;
            this._program = void 0;
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
            this._context.useProgram(this._program);
            this._context.uniform1f(this._location, x);
        };
        /**
         * @method uniform2f
         * @param x {number}
         * @param y {number}
         */
        UniformLocation.prototype.uniform2f = function (x, y) {
            this._context.useProgram(this._program);
            this._context.uniform2f(this._location, x, y);
        };
        /**
         * @method uniform3f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         */
        UniformLocation.prototype.uniform3f = function (x, y, z) {
            this._context.useProgram(this._program);
            this._context.uniform3f(this._location, x, y, z);
        };
        /**
         * @method uniform4f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param w {number}
         */
        UniformLocation.prototype.uniform4f = function (x, y, z, w) {
            this._context.useProgram(this._program);
            this._context.uniform4f(this._location, x, y, z, w);
        };
        /**
         * @method matrix1
         * @param transpose {boolean}
         * @param matrix {Matrix1}
         */
        UniformLocation.prototype.matrix1 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniform1fv(this._location, matrix.data);
        };
        /**
         * @method matrix2
         * @param transpose {boolean}
         * @param matrix {Matrix2}
         */
        UniformLocation.prototype.matrix2 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniformMatrix2fv(this._location, transpose, matrix.data);
        };
        /**
         * @method matrix3
         * @param transpose {boolean}
         * @param matrix {Matrix3}
         */
        UniformLocation.prototype.matrix3 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniformMatrix3fv(this._location, transpose, matrix.data);
        };
        /**
         * @method matrix4
         * @param transpose {boolean}
         * @param matrix {Matrix4}
         */
        UniformLocation.prototype.matrix4 = function (transpose, matrix) {
            this._context.useProgram(this._program);
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
            this._context.useProgram(this._program);
            this._context.uniform1fv(this._location, vector.data);
        };
        /**
         * @method vector2
         * @param vector {Vector2}
         */
        UniformLocation.prototype.vector2 = function (vector) {
            this._context.useProgram(this._program);
            this._context.uniform2fv(this._location, vector.data);
        };
        /**
         * @method vector3
         * @param vector {Vector3}
         */
        UniformLocation.prototype.vector3 = function (vector) {
            this._context.useProgram(this._program);
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
            this._context.useProgram(this._program);
            this._context.uniform4fv(this._location, vector.data);
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

define('davinci-eight/dfx/DrawAttribute',["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    function isVectorN(values) {
        return values instanceof VectorN;
    }
    function checkValues(values) {
        if (!isVectorN(values)) {
            throw new Error("values must be a VectorN");
        }
        return values;
    }
    function isExactMultipleOf(numer, denom) {
        return numer % denom === 0;
    }
    function checkSize(size, values) {
        if (typeof size === 'number') {
            if (!isExactMultipleOf(values.length, size)) {
                throw new Error("values.length must be an exact multiple of size");
            }
        }
        else {
            throw new Error("size must be a number");
        }
        return size;
    }
    /**
     * Holds all the values of a particular attribute.
     * The size property describes how to break up the values.
     * The length of the values should be an integer multiple of the size.
     */
    var DrawAttribute = (function () {
        function DrawAttribute(values, size) {
            this.values = checkValues(values);
            this.size = checkSize(size, values);
        }
        return DrawAttribute;
    })();
    return DrawAttribute;
});

define('davinci-eight/dfx/DrawElements',["require", "exports", '../checks/expectArg', '../math/VectorN'], function (require, exports, expectArg, VectorN) {
    var DrawElements = (function () {
        function DrawElements(k, indices, attributes) {
            // TODO: Looks like a DrawAttributeMap here (implementation only)
            this.attributes = {};
            expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
            expectArg('attributes', attributes).toBeObject();
            this.k = k;
            this.indices = indices;
            this.attributes = attributes;
        }
        return DrawElements;
    })();
    return DrawElements;
});

define('davinci-eight/checks/isNumber',["require", "exports"], function (require, exports) {
    function isNumber(x) {
        return (typeof x === 'number');
    }
    return isNumber;
});

define('davinci-eight/checks/isInteger',["require", "exports", '../checks/isNumber'], function (require, exports, isNumber) {
    function isInteger(x) {
        // % coerces its operand to numbers so a type-check first is required.
        // Not ethat ECMAScript 6 provides Number.isInteger().
        return isNumber(x) && x % 1 === 0;
    }
    return isInteger;
});

define('davinci-eight/dfx/Vertex',["require", "exports"], function (require, exports) {
    function stringVectorN(name, vector) {
        if (vector) {
            return name + vector.toString();
        }
        else {
            return name;
        }
    }
    function stringifyVertex(vertex) {
        var attributes = vertex.attributes;
        var attribsKey = Object.keys(attributes).map(function (name) {
            var vector = attributes[name];
            return stringVectorN(name, vector);
        }).join(' ');
        return attribsKey;
    }
    var Vertex = (function () {
        function Vertex() {
            this.opposing = [];
            this.attributes = {};
        }
        Vertex.prototype.toString = function () {
            return stringifyVertex(this);
        };
        return Vertex;
    })();
    return Vertex;
});

define('davinci-eight/dfx/Simplex',["require", "exports", '../checks/expectArg', '../checks/isInteger', '../dfx/Vertex', '../math/VectorN'], function (require, exports, expectArg, isInteger, Vertex, VectorN) {
    // TODO; Make this checkIntegerArg with a range.
    function checkIntegerArg(name, n, min, max) {
        if (isInteger(n) && n >= min && n <= max) {
            return n;
        }
        // TODO: I don't suppose we can go backwards with a negative count? Hmmm...
        // expectArg(name, n).toBeInClosedInterval(min, max);
        expectArg(name, n).toSatisfy(false, name + " must be an integer in the range [" + min + "," + max + "]");
    }
    function checkCountArg(count) {
        // TODO: The count range should depend upon the k value of the simplex.
        return checkIntegerArg('count', count, 0, 7);
    }
    function concatReduce(a, b) {
        return a.concat(b);
    }
    function expectArgVectorN(name, vector) {
        return expectArg(name, vector).toSatisfy(vector instanceof VectorN, name + ' must be a VectorN').value;
    }
    function lerp(a, b, alpha, data) {
        if (data === void 0) { data = []; }
        expectArg('b', b).toSatisfy(a.length === b.length, "a must be the same length as b");
        var dims = a.length;
        var i;
        var beta = 1 - alpha;
        for (i = 0; i < dims; i++) {
            data.push(beta * a[i] + alpha * b[i]);
        }
        return data;
    }
    function lerpVertexAttributeMap(a, b, alpha) {
        var attribMap = {};
        var keys = Object.keys(a);
        var keysLength = keys.length;
        for (var k = 0; k < keysLength; k++) {
            var key = keys[k];
            attribMap[key] = lerpVectorN(a[key], b[key], alpha);
        }
        return attribMap;
    }
    // TODO: Looks like a static of VectorN or a common function.
    function lerpVectorN(a, b, alpha) {
        return new VectorN(lerp(a.data, b.data, alpha));
    }
    /**
     * A simplex is the generalization of a triangle or tetrahedron to arbitrary dimensions.
     * A k-simplex is the convex hull of its k + 1 vertices.
     */
    var Simplex = (function () {
        /**
         * @class Simplex
         * @constructor
         * @param k {number} The initial number of vertices in the simplex is k + 1.
         */
        function Simplex(k) {
            // TODO: Could use a VectorN<Vertex here?>
            this.vertices = [];
            if (!isInteger(k)) {
                expectArg('k', k).toBeNumber();
            }
            var numVertices = k + 1;
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex());
            }
            var parent = this;
            this.vertices.forEach(function (vertex) {
                vertex.parent = parent;
            });
        }
        Object.defineProperty(Simplex.prototype, "k", {
            get: function () {
                return this.vertices.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         */
        Simplex.indices = function (simplex) {
            return simplex.vertices.map(function (vertex) { return vertex.index; });
        };
        /**
         * Computes the boundary of the simplex.
         */
        Simplex.boundaryMap = function (simplex) {
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.K_FOR_TRIANGLE) {
                var line01 = new Simplex(k - 1);
                line01.vertices[0].parent = line01;
                line01.vertices[0].attributes = simplex.vertices[0].attributes;
                line01.vertices[1].parent = line01;
                line01.vertices[1].attributes = simplex.vertices[1].attributes;
                var line12 = new Simplex(k - 1);
                line12.vertices[0].parent = line12;
                line12.vertices[0].attributes = simplex.vertices[1].attributes;
                line12.vertices[1].parent = line12;
                line12.vertices[1].attributes = simplex.vertices[2].attributes;
                var line20 = new Simplex(k - 1);
                line20.vertices[0].parent = line20;
                line20.vertices[0].attributes = simplex.vertices[2].attributes;
                line20.vertices[1].parent = line20;
                line20.vertices[1].attributes = simplex.vertices[0].attributes;
                return [line01, line12, line20];
            }
            else if (k === Simplex.K_FOR_LINE_SEGMENT) {
                var point0 = new Simplex(k - 1);
                point0.vertices[0].parent = point0;
                point0.vertices[0].attributes = simplex.vertices[0].attributes;
                var point1 = new Simplex(k - 1);
                point1.vertices[0].parent = point1;
                point1.vertices[0].attributes = simplex.vertices[1].attributes;
                return [point0, point1];
            }
            else if (k === Simplex.K_FOR_POINT) {
                // For consistency, we get one empty simplex rather than an empty list.
                return [new Simplex(k - 1)];
            }
            else if (k === Simplex.K_FOR_EMPTY) {
                return [];
            }
            else {
                // TODO: Handle the TETRAHEDRON and general cases.
                throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
            }
        };
        Simplex.subdivideMap = function (simplex) {
            expectArg('simplex', simplex).toBeObject();
            var divs = [];
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.K_FOR_TRIANGLE) {
                var a = vertices[0].attributes;
                var b = vertices[1].attributes;
                var c = vertices[2].attributes;
                var m1 = lerpVertexAttributeMap(a, b, 0.5);
                var m2 = lerpVertexAttributeMap(b, c, 0.5);
                var m3 = lerpVertexAttributeMap(c, a, 0.5);
                var face1 = new Simplex(k);
                face1.vertices[0].attributes = c;
                face1.vertices[1].attributes = m3;
                face1.vertices[2].attributes = m2;
                var face2 = new Simplex(k);
                face2.vertices[0].attributes = a;
                face2.vertices[1].attributes = m1;
                face2.vertices[2].attributes = m3;
                var face3 = new Simplex(k);
                face3.vertices[0].attributes = b;
                face3.vertices[1].attributes = m2;
                face3.vertices[2].attributes = m1;
                var face4 = new Simplex(k);
                face4.vertices[0].attributes = m1;
                face4.vertices[1].attributes = m2;
                face4.vertices[2].attributes = m3;
                divs.push(face1);
                divs.push(face2);
                divs.push(face3);
                divs.push(face4);
            }
            else if (k === Simplex.K_FOR_LINE_SEGMENT) {
                var a = vertices[0].attributes;
                var b = vertices[1].attributes;
                var m = lerpVertexAttributeMap(a, b, 0.5);
                var line1 = new Simplex(k);
                line1.vertices[0].attributes = a;
                line1.vertices[1].attributes = m;
                var line2 = new Simplex(k);
                line2.vertices[0].attributes = m;
                line2.vertices[1].attributes = b;
                divs.push(line1);
                divs.push(line2);
            }
            else if (k === Simplex.K_FOR_POINT) {
                divs.push(simplex);
            }
            else if (k === Simplex.K_FOR_EMPTY) {
            }
            else {
                throw new Error(k + "-simplex is not supported");
            }
            return divs;
        };
        Simplex.boundary = function (geometry, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                geometry = geometry.map(Simplex.boundaryMap).reduce(concatReduce, []);
            }
            return geometry;
        };
        Simplex.subdivide = function (geometry, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                geometry = geometry.map(Simplex.subdivideMap).reduce(concatReduce, []);
            }
            return geometry;
        };
        // TODO: This function destined to be part of Simplex constructor.
        Simplex.setAttributeValues = function (attributes, simplex) {
            var names = Object.keys(attributes);
            var attribsLength = names.length;
            var attribIndex;
            for (attribIndex = 0; attribIndex < attribsLength; attribIndex++) {
                var name_1 = names[attribIndex];
                var values = attributes[name_1];
                var valuesLength = values.length;
                var valueIndex = void 0;
                for (valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
                    simplex.vertices[valueIndex].attributes[name_1] = values[valueIndex];
                }
            }
        };
        // These symbolic constants represent the correct k values for various low-dimesional simplices. 
        // The number of vertices in a k-simplex is k + 1.
        /**
         * An empty set can be consired to be a -1 simplex (algebraic topology).
         */
        Simplex.K_FOR_EMPTY = -1;
        /**
         * A single point may be considered a 0-simplex.
         */
        Simplex.K_FOR_POINT = 0;
        /**
         * A line segment may be considered a 1-simplex.
         */
        Simplex.K_FOR_LINE_SEGMENT = 1;
        /**
         * A 2-simplex is a triangle.
         */
        Simplex.K_FOR_TRIANGLE = 2;
        /**
         * A 3-simplex is a tetrahedron.
         */
        Simplex.K_FOR_TETRAHEDRON = 3;
        /**
         * A 4-simplex is a 5-cell.
         */
        Simplex.K_FOR_FIVE_CELL = 4;
        return Simplex;
    })();
    return Simplex;
});

define('davinci-eight/dfx/checkGeometry',["require", "exports", '../checks/expectArg', '../checks/isDefined', '../dfx/Simplex'], function (require, exports, expectArg, isDefined, Simplex) {
    function stringify(thing, space) {
        var cache = [];
        return JSON.stringify(thing, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }, space);
        cache = null; // Enable garbage collection  
    }
    /**
     * Returns undefined (void 0) for an empty geometry.
     */
    function checkGeometry(geometry) {
        var kValueOfSimplex = void 0;
        var knowns = {};
        var geometryLen = geometry.length;
        for (var i = 0; i < geometryLen; i++) {
            var simplex = geometry[i];
            if (!(simplex instanceof Simplex)) {
                expectArg('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ checkGeometry(). Found " + stringify(simplex, 2));
            }
            var vertices = simplex.vertices;
            // TODO: Check consistency of k-values.
            kValueOfSimplex = simplex.k;
            for (var j = 0, vsLen = vertices.length; j < vsLen; j++) {
                var vertex = vertices[j];
                var attributes = vertex.attributes;
                var keys = Object.keys(attributes);
                var keysLen = keys.length;
                for (var k = 0; k < keysLen; k++) {
                    var key = keys[k];
                    var vector = attributes[key];
                    var known = knowns[key];
                    if (known) {
                        if (known.size !== vector.length) {
                            throw new Error("Something is rotten in Denmark!");
                        }
                    }
                    else {
                        knowns[key] = { size: vector.length };
                    }
                }
            }
        }
        // isDefined is necessary because k = -1, 0, 1, 2, 3, ... are legal and 0 is falsey.
        if (isDefined(kValueOfSimplex)) {
            var info = {
                get attributes() {
                    return knowns;
                },
                get k() {
                    return kValueOfSimplex;
                }
            };
            return info;
        }
        else {
            return void 0;
        }
    }
    return checkGeometry;
});

define('davinci-eight/dfx/computeFaceNormals',["require", "exports", '../core/Symbolic', '../math/Vector3', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, Symbolic, Vector3, wedgeXY, wedgeYZ, wedgeZX) {
    function computeFaceNormals(simplex, positionName, normalName) {
        if (positionName === void 0) { positionName = Symbolic.ATTRIBUTE_POSITION; }
        if (normalName === void 0) { normalName = Symbolic.ATTRIBUTE_NORMAL; }
        var vertex0 = simplex.vertices[0].attributes;
        var vertex1 = simplex.vertices[1].attributes;
        var vertex2 = simplex.vertices[2].attributes;
        var pos0 = vertex0[positionName];
        var pos1 = vertex1[positionName];
        var pos2 = vertex2[positionName];
        var x0 = pos0.getComponent(0);
        var y0 = pos0.getComponent(1);
        var z0 = pos0.getComponent(2);
        var x1 = pos1.getComponent(0);
        var y1 = pos1.getComponent(1);
        var z1 = pos1.getComponent(2);
        var x2 = pos2.getComponent(0);
        var y2 = pos2.getComponent(1);
        var z2 = pos2.getComponent(2);
        var ax = x2 - x1;
        var ay = y2 - y1;
        var az = z2 - z1;
        var bx = x0 - x1;
        var by = y0 - y1;
        var bz = z0 - z1;
        var x = wedgeYZ(ax, ay, az, bx, by, bz);
        var y = wedgeZX(ax, ay, az, bx, by, bz);
        var z = wedgeXY(ax, ay, az, bx, by, bz);
        var normal = new Vector3([x, y, z]).normalize();
        vertex0[normalName] = normal;
        vertex1[normalName] = normal;
        vertex2[normalName] = normal;
    }
    return computeFaceNormals;
});

define('davinci-eight/dfx/triangle',["require", "exports", '../dfx/computeFaceNormals', '../checks/expectArg', '../dfx/Simplex', '../core/Symbolic', '../math/VectorN'], function (require, exports, computeFaceNormals, expectArg, Simplex, Symbolic, VectorN) {
    function triangle(a, b, c, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', b).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', c).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        var simplex = new Simplex(Simplex.K_FOR_TRIANGLE);
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = a;
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = b;
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = c;
        computeFaceNormals(simplex, Symbolic.ATTRIBUTE_POSITION, Symbolic.ATTRIBUTE_NORMAL);
        Simplex.setAttributeValues(attributes, simplex);
        triangles.push(simplex);
        return triangles;
    }
    return triangle;
});

define('davinci-eight/dfx/quadrilateral',["require", "exports", '../checks/expectArg', '../dfx/triangle', '../math/VectorN'], function (require, exports, expectArg, triangle, VectorN) {
    function setAttributes(which, source, target) {
        var names = Object.keys(source);
        var namesLength = names.length;
        var i;
        var name;
        var values;
        for (i = 0; i < namesLength; i++) {
            name = names[i];
            values = source[name];
            target[name] = which.map(function (index) { return values[index]; });
        }
    }
    /**
     * quadrilateral
     *
     *  b-------a
     *  |       |
     *  |       |
     *  |       |
     *  c-------d
     *
     * The quadrilateral is split into two triangles: b-c-a and d-a-c, like a "Z".
     * The zeroth vertex for each triangle is opposite the other triangle.
     */
    function quadrilateral(a, b, c, d, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
        expectArg('c', c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
        expectArg('d', d).toSatisfy(d instanceof VectorN, "d must be a VectorN");
        var triatts = {};
        setAttributes([1, 2, 0], attributes, triatts);
        triangle(b, c, a, triatts, triangles);
        var face1 = triangles[triangles.length - 1];
        setAttributes([3, 0, 2], attributes, triatts);
        triangle(d, a, c, triatts, triangles);
        var face2 = triangles[triangles.length - 1];
        face1.vertices[0].opposing.push(face2);
        face2.vertices[0].opposing.push(face1);
        return triangles;
    }
    return quadrilateral;
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
        Vector2.prototype.sum = function (a, b) {
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
        Vector2.prototype.difference = function (a, b) {
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
        Vector2.prototype.rotate = function (rotor) {
            return this;
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
            this.difference(v2, v1).multiplyScalar(alpha).add(v1);
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

define('davinci-eight/dfx/cube',["require", "exports", '../dfx/quadrilateral', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, quadrilateral, Symbolic, Vector2, Vector3) {
    function vector3(data) {
        return new Vector3([]);
    }
    /**
     * cube as Simplex[]
     *
     *    v6----- v5
     *   /|      /|
     *  v1------v0|
     *  | |     | |
     *  | |v7---|-|v4
     *  |/      |/
     *  v2------v3
     */
    function cube(size) {
        if (size === void 0) { size = 1; }
        var s = size / 2;
        var vec0 = new Vector3([+s, +s, +s]);
        var vec1 = new Vector3([-s, +s, +s]);
        var vec2 = new Vector3([-s, -s, +s]);
        var vec3 = new Vector3([+s, -s, +s]);
        var vec4 = new Vector3([+s, -s, -s]);
        var vec5 = new Vector3([+s, +s, -s]);
        var vec6 = new Vector3([-s, +s, -s]);
        var vec7 = new Vector3([-s, -s, -s]);
        var c00 = new Vector2([0, 0]);
        var c01 = new Vector2([0, 1]);
        var c10 = new Vector2([1, 0]);
        var c11 = new Vector2([1, 1]);
        var attributes = {};
        attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = [c11, c01, c00, c10];
        // We currently call quadrilateral rather than square because of the arguments.
        var front = quadrilateral(vec0, vec1, vec2, vec3, attributes);
        var right = quadrilateral(vec0, vec3, vec4, vec5, attributes);
        var top = quadrilateral(vec0, vec5, vec6, vec1, attributes);
        var left = quadrilateral(vec1, vec6, vec7, vec2, attributes);
        var bottom = quadrilateral(vec7, vec4, vec3, vec2, attributes);
        var back = quadrilateral(vec4, vec7, vec6, vec5, attributes);
        var squares = [front, right, top, left, bottom, back];
        // TODO: Fix up the opposing property so that the cube is fully linked together.
        return squares.reduce(function (a, b) { return a.concat(b); }, []);
    }
    return cube;
});

define('davinci-eight/dfx/square',["require", "exports", '../dfx/quadrilateral', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, quadrilateral, Symbolic, Vector2, Vector3) {
    // square
    //
    //  b-------a
    //  |       | 
    //  |       |
    //  |       |
    //  c-------d
    //
    function square(size) {
        if (size === void 0) { size = 1; }
        var s = size / 2;
        var vec0 = new Vector3([+s, +s, 0]);
        var vec1 = new Vector3([-s, +s, 0]);
        var vec2 = new Vector3([-s, -s, 0]);
        var vec3 = new Vector3([+s, -s, 0]);
        var c00 = new Vector2([0, 0]);
        var c01 = new Vector2([0, 1]);
        var c10 = new Vector2([1, 0]);
        var c11 = new Vector2([1, 1]);
        var coords = [c11, c01, c00, c10];
        var attributes = {};
        attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = coords;
        return quadrilateral(vec0, vec1, vec2, vec3, attributes);
    }
    return square;
});

define('davinci-eight/dfx/tetrahedron',["require", "exports", '../checks/expectArg', '../dfx/triangle', '../math/VectorN'], function (require, exports, expectArg, triangle, VectorN) {
    /**
     * terahedron
     *
     * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
     */
    function tetrahedron(a, b, c, d, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
        expectArg('c', c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
        expectArg('d', d).toSatisfy(d instanceof VectorN, "d must be a VectorN");
        var triatts = {};
        var points = [a, b, c, d];
        var faces = [];
        triangle(points[0], points[1], points[2], triatts, triangles);
        faces.push(triangles[triangles.length - 1]);
        triangle(points[1], points[3], points[2], triatts, triangles);
        faces.push(triangles[triangles.length - 1]);
        triangle(points[2], points[3], points[0], triatts, triangles);
        faces.push(triangles[triangles.length - 1]);
        triangle(points[3], points[1], points[0], triatts, triangles);
        faces.push(triangles[triangles.length - 1]);
        faces[3].vertices[0].opposing.push(faces[0]);
        faces[3].vertices[1].opposing.push(faces[1]);
        faces[3].vertices[2].opposing.push(faces[2]);
        faces[0].vertices[0].opposing.push(faces[1]);
        faces[0].vertices[1].opposing.push(faces[3]);
        faces[0].vertices[2].opposing.push(faces[2]);
        faces[1].vertices[0].opposing.push(faces[2]);
        faces[1].vertices[1].opposing.push(faces[3]);
        faces[1].vertices[2].opposing.push(faces[0]);
        faces[2].vertices[0].opposing.push(faces[3]);
        faces[2].vertices[1].opposing.push(faces[1]);
        faces[2].vertices[2].opposing.push(faces[0]);
        return triangles;
    }
    return tetrahedron;
});

define('davinci-eight/dfx/computeUniqueVertices',["require", "exports"], function (require, exports) {
    // This function has the important side-effect of setting the vertex index property.
    function computeUniqueVertices(geometry) {
        var map = {};
        var vertices = [];
        function munge(vertex) {
            var key = vertex.toString();
            if (map[key]) {
                var existing = map[key];
                vertex.index = existing.index;
            }
            else {
                vertex.index = vertices.length;
                vertices.push(vertex);
                map[key] = vertex;
            }
        }
        geometry.forEach(function (simplex) {
            simplex.vertices.forEach(function (vertex) {
                munge(vertex);
            });
        });
        return vertices;
    }
    return computeUniqueVertices;
});

define('davinci-eight/dfx/toDrawElements',["require", "exports", '../dfx/checkGeometry', '../dfx/computeUniqueVertices', '../dfx/DrawElements', '../dfx/DrawAttribute', '../checks/expectArg', '../dfx/Simplex', '../math/VectorN'], function (require, exports, checkGeometry, computeUniqueVertices, DrawElements, DrawAttribute, expectArg, Simplex, VectorN) {
    function numberList(size, value) {
        var data = [];
        for (var i = 0; i < size; i++) {
            data.push(value);
        }
        return data;
    }
    function attribName(name, attribMap) {
        expectArg('name', name).toBeString();
        expectArg('attribMap', attribMap).toBeObject();
        var meta = attribMap[name];
        if (meta) {
            var alias = meta.name;
            return alias ? alias : name;
        }
        else {
            throw new Error("Unable to compute name; missing attribute specification for " + name);
        }
    }
    function attribSize(key, attribMap) {
        expectArg('key', key).toBeString();
        expectArg('attribMap', attribMap).toBeObject();
        var meta = attribMap[key];
        if (meta) {
            var size = meta.size;
            // TODO: Override the message...
            expectArg('size', size).toBeNumber();
            return meta.size;
        }
        else {
            throw new Error("Unable to compute size; missing attribute specification for " + key);
        }
    }
    function concat(a, b) {
        return a.concat(b);
    }
    function toDrawElements(geometry, geometryInfo) {
        expectArg('geometry', geometry).toBeObject();
        var actuals = checkGeometry(geometry);
        if (geometryInfo) {
            expectArg('geometryInfo', geometryInfo).toBeObject();
        }
        else {
            geometryInfo = actuals;
        }
        var attribMap = geometryInfo.attributes;
        // Cache the keys and keys.length of the specified attributes and declare a loop index.
        var keys = Object.keys(attribMap);
        var keysLen = keys.length;
        var k;
        // Side effect is to set the index property, but it will be be the same as the array index. 
        var vertices = computeUniqueVertices(geometry);
        var vsLength = vertices.length;
        var i;
        // Each simplex produces as many indices as vertices.
        // This is why we need the Vertex to have an temporary index property.
        var indices = geometry.map(Simplex.indices).reduce(concat, []);
        // Create intermediate data structures for output and to cache dimensions and name.
        // For performance an an array will be used whose index is the key index.
        var outputs = [];
        for (k = 0; k < keysLen; k++) {
            var key = keys[k];
            var dims = attribSize(key, attribMap);
            var data = numberList(vsLength * dims, void 0);
            outputs.push({ data: data, dimensions: dims, name: attribName(key, attribMap) });
        }
        // Accumulate attribute data in intermediate data structures.
        for (i = 0; i < vsLength; i++) {
            var vertex = vertices[i];
            var vertexAttribs = vertex.attributes;
            if (vertex.index !== i) {
                expectArg('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
            }
            for (k = 0; k < keysLen; k++) {
                var output = outputs[k];
                var size = output.dimensions;
                var data = vertexAttribs[keys[k]];
                if (!data) {
                    data = new VectorN(numberList(size, 0), false, size);
                }
                data.toArray(output.data, i * output.dimensions);
            }
        }
        // Copy accumulated attribute arrays to output data structure.
        var attributes = {};
        for (k = 0; k < keysLen; k++) {
            var output = outputs[k];
            var data = output.data;
            var vector = new VectorN(data, false, data.length);
            attributes[output.name] = new DrawAttribute(vector, output.dimensions);
        }
        return new DrawElements(geometryInfo.k, new VectorN(indices, false, indices.length), attributes);
    }
    return toDrawElements;
});

define('davinci-eight/utils/refChange',["require", "exports"], function (require, exports) {
    var statistics = {};
    var skip = true;
    var trace = false;
    var traceName = void 0;
    // TODO: Very first time refChange is called, check count is +1
    // FIXME: Use a better sentinel for command mode.
    var LOGGING_NAME_REF_CHANGE = 'refChange';
    function prefix(message) {
        return LOGGING_NAME_REF_CHANGE + ": " + message;
    }
    function log(message) {
        return console.log(prefix(message));
    }
    function warn(message) {
        return console.warn(prefix(message));
    }
    function garbageCollect() {
        var uuids = Object.keys(statistics);
        uuids.forEach(function (uuid) {
            var element = statistics[uuid];
            if (element.refCount === 0) {
                delete statistics[uuid];
            }
        });
    }
    function computeOutstanding() {
        var uuids = Object.keys(statistics);
        var uuidsLength = uuids.length;
        var i;
        var total = 0;
        for (i = 0; i < uuidsLength; i++) {
            var uuid = uuids[i];
            var statistic = statistics[uuid];
            total += statistic.refCount;
        }
        return total;
    }
    function stop() {
        if (skip) {
            warn("Nothing to see because skip mode is " + skip);
        }
        garbageCollect();
        return computeOutstanding();
    }
    function dump() {
        var outstanding = stop();
        if (outstanding > 0) {
            warn(JSON.stringify(statistics, null, 2));
        }
        else {
            log("There are " + outstanding + " outstanding reference counts.");
        }
        return outstanding;
    }
    function refChange(uuid, name, change) {
        if (change === void 0) { change = 0; }
        if (change !== 0 && skip) {
            return;
        }
        if (trace) {
            if (traceName) {
                if (name === traceName) {
                    var element = statistics[uuid];
                    if (element) {
                        log(change + " on " + uuid + " @ " + name);
                    }
                    else {
                        log(change + " on " + uuid + " @ " + name);
                    }
                }
            }
            else {
                // trace everything
                log(change + " on " + uuid + " @ " + name);
            }
        }
        if (change === +1) {
            var element = statistics[uuid];
            if (!element) {
                element = { refCount: 0, name: name, zombie: false };
                statistics[uuid] = element;
            }
            element.refCount += change;
        }
        else if (change === -1) {
            var element = statistics[uuid];
            element.refCount += change;
            if (element.refCount === 0) {
                element.zombie = true;
            }
        }
        else if (change === 0) {
            var message = "" + uuid + " @ " + name;
            log(message);
            if (uuid === 'stop') {
                return stop();
            }
            if (uuid === 'dump') {
                return dump();
            }
            else if (uuid === 'start') {
                skip = false;
                trace = false;
            }
            else if (uuid === 'reset') {
                statistics = {};
                skip = true;
                trace = false;
                traceName = void 0;
            }
            else if (uuid === 'trace') {
                skip = false;
                trace = true;
                traceName = name;
            }
            else {
                throw new Error(prefix("Unexpected command " + message));
            }
        }
        else {
            throw new Error(prefix("change must be +1 or -1 for normal recording, or 0 for logging to the console."));
        }
    }
    return refChange;
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

define('davinci-eight/utils/NumberIUnknownMap',["require", "exports", '../utils/refChange', '../utils/uuid4'], function (require, exports, refChange, uuid4) {
    var LOGGING_NAME = 'NumberIUnknownMap';
    var NumberIUnknownMap = (function () {
        function NumberIUnknownMap() {
            this._refCount = 1;
            this._elements = {};
            this._uuid = uuid4().generate();
            refChange(this._uuid, LOGGING_NAME, +1);
        }
        NumberIUnknownMap.prototype.addRef = function () {
            refChange(this._uuid, LOGGING_NAME, +1);
            this._refCount++;
            return this._refCount;
        };
        NumberIUnknownMap.prototype.release = function () {
            refChange(this._uuid, LOGGING_NAME, -1);
            this._refCount--;
            if (this._refCount === 0) {
                var self_1 = this;
                this.forEach(function (key) {
                    self_1.put(key, void 0);
                });
                this._elements = void 0;
            }
            return this._refCount;
        };
        NumberIUnknownMap.prototype.exists = function (key) {
            var element = this._elements[key];
            return element ? true : false;
        };
        NumberIUnknownMap.prototype.get = function (key) {
            var element = this._elements[key];
            if (element) {
                element.addRef();
                return element;
            }
            else {
                return void 0;
            }
        };
        NumberIUnknownMap.prototype.put = function (key, value) {
            var existing = this._elements[key];
            if (existing) {
                if (value) {
                    if (existing === value) {
                    }
                    else {
                        existing.release();
                        value.addRef();
                        this._elements[key] = value;
                    }
                }
                else {
                    existing.release();
                    this._elements[key] = void 0;
                }
            }
            else {
                // There is no entry at the key specified.
                if (value) {
                    value.addRef();
                    this._elements[key] = value;
                }
                else {
                }
            }
        };
        NumberIUnknownMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            var i;
            var length = keys.length;
            for (i = 0; i < length; i++) {
                var key = keys[i];
                var value = this._elements[key];
                callback(key, value);
            }
        };
        Object.defineProperty(NumberIUnknownMap.prototype, "keys", {
            get: function () {
                // TODO: memoize?
                return Object.keys(this._elements).map(function (keyString) { return parseFloat(keyString); });
            },
            enumerable: true,
            configurable: true
        });
        NumberIUnknownMap.prototype.remove = function (key) {
            this.put(key, void 0);
            delete this._elements[key];
        };
        return NumberIUnknownMap;
    })();
    return NumberIUnknownMap;
});

define('davinci-eight/scene/createDrawList',["require", "exports", '../utils/NumberIUnknownMap'], function (require, exports, NumberIUnknownMap) {
    // FIXME: This should be reference counted
    var ProgramInfo = (function () {
        function ProgramInfo(program) {
            // TODO: This would be nice...
            //public drawables = new IUnknownList<IDrawable>();
            this.drawables = [];
            this.program = program;
        }
        return ProgramInfo;
    })();
    var createDrawList = function () {
        // FIXME Use StringIUnknownMap
        var programs = {};
        var refCount = 1;
        // FIXME: Why keep contexts when you have managers.
        // var _context: WebGLRenderingContext;
        //var _managers: {[id: number]: ContextManager } = {};
        var _managers = new NumberIUnknownMap();
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
            contextFree: function (canvasId) {
                self.traverse(function (drawable) {
                    drawable.contextFree(canvasId);
                });
            },
            contextGain: function (manager) {
                if (!_managers.exists(manager.canvasId)) {
                    _managers.put(manager.canvasId, manager);
                    _managers[manager.canvasId] = manager;
                    manager.addRef();
                }
                Object.keys(programs).forEach(function (programId) {
                    programs[programId].drawables.forEach(function (drawable) {
                        drawable.contextGain(manager);
                    });
                });
            },
            contextLoss: function (canvasId) {
                Object.keys(programs).forEach(function (programId) {
                    programs[programId].drawables.forEach(function (drawable) {
                        drawable.contextLoss(canvasId);
                    });
                });
            },
            add: function (drawable) {
                // If we have managers povide them to the drawable before asking for the program.
                // FIXME: Do we have to be careful about whether the manager has a context?
                _managers.forEach(function (id, manager) {
                    drawable.contextGain(manager);
                });
                // Now let's see if we can get a program...
                var program = drawable.material;
                if (program) {
                    try {
                        var programId = program.programId;
                        if (!programs[programId]) {
                            programs[programId] = new ProgramInfo(program);
                        }
                        programs[programId].drawables.push(drawable);
                        // TODO; When drawables is IUnkownList, this will not be needed.
                        drawable.addRef();
                        _managers.forEach(function (id, manager) {
                            program.contextGain(manager);
                        });
                    }
                    finally {
                        program.release();
                    }
                }
                else {
                }
            },
            remove: function (drawable) {
                var program = drawable.material;
                if (program) {
                    try {
                        var programId = program.programId;
                        if (programs[programId]) {
                            var programInfo = new ProgramInfo(program);
                            var index = programInfo.drawables.indexOf(drawable);
                            if (index >= 0) {
                                programInfo.drawables.splice(index, 1);
                                // TODO: When drawables is IUnknownList, this will not be needed.
                                drawable.release();
                                if (programInfo.drawables.length === 0) {
                                    delete programs[programId];
                                }
                            }
                        }
                        else {
                            throw new Error("drawable not found.");
                        }
                    }
                    finally {
                        program.release();
                    }
                }
            },
            uniform1f: function (name, x) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniform1f(name, x);
                });
            },
            uniform2f: function (name, x, y) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniform2f(name, x, y);
                });
            },
            uniform3f: function (name, x, y, z) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniform3f(name, x, y, z);
                });
            },
            uniform4f: function (name, x, y, z, w) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniform4f(name, x, y, z, w);
                });
            },
            uniformMatrix1: function (name, transpose, matrix) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformMatrix1(name, transpose, matrix);
                });
            },
            uniformMatrix2: function (name, transpose, matrix) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformMatrix2(name, transpose, matrix);
                });
            },
            uniformMatrix3: function (name, transpose, matrix) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformMatrix3(name, transpose, matrix);
                });
            },
            uniformMatrix4: function (name, transpose, matrix) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformMatrix4(name, transpose, matrix);
                });
            },
            uniformVector1: function (name, vector) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformVector1(name, vector);
                });
            },
            uniformVector2: function (name, vector) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformVector2(name, vector);
                });
            },
            uniformVector3: function (name, vector) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformVector3(name, vector);
                });
            },
            uniformVector4: function (name, vector) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
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
    return createDrawList;
});

define('davinci-eight/scene/Mesh',["require", "exports", '../utils/NumberIUnknownMap', '../utils/refChange', '../utils/uuid4'], function (require, exports, NumberIUnknownMap, refChange, uuid4) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'Mesh';
    /**
     * @class Mesh
     * @implements IDrawable
     */
    var Mesh = (function () {
        // FIXME: Do we insist on a ContextMonitor here.
        // We can also assume that we are OK because of the Scene - but can't assume that there is one?
        function Mesh(geometry, material, model) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this.geometry = geometry;
            this._material = material;
            this._material.addRef();
            this.meshes = new NumberIUnknownMap();
            this.model = model;
            refChange(this._uuid, LOGGING_NAME, +1);
            // 1. Apply subdivide and boundary if needed, acting on simplices.
            // 2. Check the geometry to produce the geometry info.
            // 3 Compute DrawElements from the Simplex geometry.
            // 4 Wait for contextGain.
            //    var simplices = Simplex.subdivide(geometry.simplices, 2);
            //    simplices = Simplex.boundary(simplices, 1);
            //    let geometryInfo: GeometryInfo = checkGeometry(simplices);
            //    this.elements = toDrawElements(simplices, geometryInfo);
        }
        Mesh.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME, +1);
            return this._refCount;
        };
        Mesh.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME, -1);
            if (this._refCount === 0) {
                this.meshes.release();
                this.meshes = void 0;
                this._material.release();
                this._material = void 0;
            }
            return this._refCount;
        };
        Mesh.prototype.draw = function () {
            console.warn("Mesh.draw() needs canvas id");
            // FIXME: We need a canvasID;
            var canvasId = void 0;
            var mesh = this.meshes.get(canvasId);
            if (mesh) {
                this.material.use(canvasId);
                this.model.accept(this._material);
                mesh.bind(this._material);
                mesh.draw();
                mesh.unbind();
                mesh.release();
            }
            else {
                console.warn(LOGGING_NAME + " draw method has mesh or canvasId, canvasId => " + canvasId);
            }
        };
        Mesh.prototype.contextFree = function (canvasId) {
            this._material.contextFree(canvasId);
        };
        Mesh.prototype.contextGain = function (manager) {
            // 5. create the mesh and cache the IMesh result.
            if (this.elements) {
                var mesh = manager.createDrawElementsMesh(this.elements);
                this.meshes.put(manager.canvasId, mesh);
                mesh.release();
                this._material.contextGain(manager);
            }
            else {
                console.warn(LOGGING_NAME + " contextGain method has no elements, canvasId => " + manager.canvasId);
            }
        };
        Mesh.prototype.contextLoss = function (canvasId) {
            this._material.contextLoss(canvasId);
        };
        Object.defineProperty(Mesh.prototype, "material", {
            /**
             * @property material
             *
             * Provides a reference counted reference to the material.
             */
            get: function () {
                this._material.addRef();
                return this._material;
            },
            enumerable: true,
            configurable: true
        });
        return Mesh;
    })();
    return Mesh;
});

define('davinci-eight/scene/PerspectiveCamera',["require", "exports", '../utils/refChange', '../utils/uuid4', '../math/Vector3'], function (require, exports, refChange, uuid4, Vector3) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_PERSPECTIVE_CAMERA = 'PerspectiveCamera';
    /**
     * @module EIGHT
     * @class PerspectiveCamera
     * @implements ICamera
     * @implements UniformData
     */
    var PerspectiveCamera = (function () {
        function PerspectiveCamera(fov, aspect, near, far) {
            this.position = new Vector3();
            this._refCount = 1;
            this._uuid = uuid4().generate();
            // FIXME: If cameras do become drawable, then we might want monitoring.
            refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, +1);
        }
        PerspectiveCamera.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, +1);
            return this._refCount;
        };
        PerspectiveCamera.prototype.accept = function (visitor) {
            console.warn("PerspectiveCamera is ignoring visitor. How impolite!");
        };
        PerspectiveCamera.prototype.contextFree = function () {
        };
        PerspectiveCamera.prototype.contextGain = function (manager) {
        };
        PerspectiveCamera.prototype.contextLoss = function () {
        };
        PerspectiveCamera.prototype.draw = function () {
            // Do nothing.
        };
        PerspectiveCamera.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, -1);
            return this._refCount;
        };
        return PerspectiveCamera;
    })();
    return PerspectiveCamera;
});

define('davinci-eight/checks/mustSatisfy',["require", "exports"], function (require, exports) {
    function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
        if (!condition) {
            if (messageBuilder) {
                var message = messageBuilder();
                if (contextBuilder) {
                    var context = contextBuilder();
                    throw new Error(name + " must " + message + " in " + context + ".");
                }
                else {
                    throw new Error(name + " must " + message + ".");
                }
            }
            else {
                var message = "satisfy some condition";
                if (contextBuilder) {
                    var context = contextBuilder();
                    throw new Error(name + " must " + message + " in " + context + ".");
                }
                else {
                    throw new Error(name + " must " + message + ".");
                }
            }
        }
    }
    return mustSatisfy;
});

define('davinci-eight/scene/MonitorList',["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy, isInteger) {
    function beInstanceOfContextMonitors() {
        return "be an instance of MonitorList";
    }
    function beContextMonitorArray() {
        return "be ContextMonitor[]";
    }
    function identity(monitor) {
        return monitor;
    }
    var METHOD_ADD = 'addContextListener';
    var METHOD_REMOVE = 'removeContextListener';
    /**
     * Implementation Only.
     */
    var MonitorList = (function () {
        function MonitorList(monitors) {
            if (monitors === void 0) { monitors = []; }
            this.monitors = monitors.map(identity);
        }
        MonitorList.prototype.addContextListener = function (user) {
            this.monitors.forEach(function (monitor) {
                monitor.addContextListener(user);
            });
        };
        MonitorList.prototype.push = function (monitor) {
            this.monitors.push(monitor);
        };
        MonitorList.prototype.removeContextListener = function (user) {
            this.monitors.forEach(function (monitor) {
                monitor.removeContextListener(user);
            });
        };
        MonitorList.prototype.toArray = function () {
            return this.monitors.map(identity);
        };
        MonitorList.copy = function (monitors) {
            return new MonitorList(monitors);
        };
        MonitorList.isInstanceOf = function (candidate) {
            return candidate instanceof MonitorList;
        };
        MonitorList.assertInstance = function (name, candidate, contextBuilder) {
            if (MonitorList.isInstanceOf(candidate)) {
                return candidate;
            }
            else {
                mustSatisfy(name, false, beInstanceOfContextMonitors, contextBuilder);
                throw new Error();
            }
        };
        MonitorList.verify = function (name, monitors, contextBuilder) {
            mustSatisfy(name, isInteger(monitors['length']), beContextMonitorArray, contextBuilder);
            var monitorsLength = monitors.length;
            for (var i = 0; i < monitorsLength; i++) {
            }
            return monitors;
        };
        MonitorList.addContextListener = function (user, monitors) {
            MonitorList.verify('monitors', monitors, function () { return 'MonitorList.addContextListener'; });
            monitors.forEach(function (monitor) {
                monitor.addContextListener(user);
            });
        };
        MonitorList.removeContextListener = function (user, monitors) {
            MonitorList.verify('monitors', monitors, function () { return 'MonitorList.removeContextListener'; });
            monitors.forEach(function (monitor) {
                monitor.removeContextListener(user);
            });
        };
        return MonitorList;
    })();
    return MonitorList;
});

define('davinci-eight/scene/Scene',["require", "exports", '../scene/MonitorList', '../scene/createDrawList', '../utils/refChange', '../utils/uuid4'], function (require, exports, MonitorList, createDrawList, refChange, uuid4) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    /**
     * @module EIGHT
     * @class Scene
     * @implements IDrawList
     */
    var Scene = (function () {
        // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
        function Scene(monitors) {
            this._drawList = createDrawList();
            this._refCount = 1;
            this._uuid = uuid4().generate();
            MonitorList.verify('monitors', monitors, ctorContext);
            this.monitors = new MonitorList(monitors);
            this.monitors.addContextListener(this);
            refChange(this._uuid, LOGGING_NAME, +1);
        }
        Scene.prototype.add = function (drawable) {
            this._drawList.add(drawable);
        };
        Scene.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME, +1);
            return this._refCount;
        };
        Scene.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME, -1);
            if (this._refCount === 0) {
                this.monitors.removeContextListener(this);
                this.monitors = void 0;
                this._drawList.release();
                this._drawList = void 0;
            }
            return this._refCount;
        };
        Scene.prototype.remove = function (drawable) {
            this._drawList.remove(drawable);
        };
        Scene.prototype.traverse = function (callback) {
            this._drawList.traverse(callback);
        };
        Scene.prototype.contextFree = function (canvasId) {
            this._drawList.contextFree(canvasId);
        };
        Scene.prototype.contextGain = function (manager) {
            this._drawList.contextGain(manager);
        };
        Scene.prototype.contextLoss = function (canvasId) {
            this._drawList.contextLoss(canvasId);
        };
        Scene.prototype.uniform1f = function (name, x) {
            this._drawList.uniform1f(name, x);
        };
        Scene.prototype.uniform2f = function (name, x, y) {
            this._drawList.uniform2f(name, x, y);
        };
        Scene.prototype.uniform3f = function (name, x, y, z) {
            this._drawList.uniform3f(name, x, y, z);
        };
        Scene.prototype.uniform4f = function (name, x, y, z, w) {
            this._drawList.uniform4f(name, x, y, z, w);
        };
        Scene.prototype.uniformMatrix1 = function (name, transpose, matrix) {
            this._drawList.uniformMatrix1(name, transpose, matrix);
        };
        Scene.prototype.uniformMatrix2 = function (name, transpose, matrix) {
            this._drawList.uniformMatrix2(name, transpose, matrix);
        };
        Scene.prototype.uniformMatrix3 = function (name, transpose, matrix) {
            this._drawList.uniformMatrix3(name, transpose, matrix);
        };
        Scene.prototype.uniformMatrix4 = function (name, transpose, matrix) {
            this._drawList.uniformMatrix4(name, transpose, matrix);
        };
        Scene.prototype.uniformVector1 = function (name, vector) {
            this._drawList.uniformVector1(name, vector);
        };
        Scene.prototype.uniformVector2 = function (name, vector) {
            this._drawList.uniformVector2(name, vector);
        };
        Scene.prototype.uniformVector3 = function (name, vector) {
            this._drawList.uniformVector3(name, vector);
        };
        Scene.prototype.uniformVector4 = function (name, vector) {
            this._drawList.uniformVector4(name, vector);
        };
        return Scene;
    })();
    return Scene;
});

define('davinci-eight/core/BufferResource',["require", "exports", '../checks/expectArg', '../utils/refChange', '../utils/uuid4'], function (require, exports, expectArg, refChange, uuid4) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_IBUFFER = 'IBuffer';
    function checkTarget(target) {
        return target;
    }
    // TODO: Replace this with a functional constructor to prevent tinkering.
    var BufferResource = (function () {
        function BufferResource(monitor, target) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._monitor = expectArg('montor', monitor).toBeObject().value;
            this._target = checkTarget(target);
            refChange(this._uuid, LOGGING_NAME_IBUFFER, +1);
            monitor.addContextListener(this);
        }
        BufferResource.prototype.destructor = function () {
            if (this._buffer) {
                this._gl.deleteBuffer(this._buffer);
                this._buffer = void 0;
            }
            this._gl = void 0;
            this._monitor.removeContextListener(this);
            this._monitor = void 0;
            this._refCount = void 0;
            this._target = void 0;
            this._uuid = void 0;
        };
        BufferResource.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME_IBUFFER, +1);
            return this._refCount;
        };
        BufferResource.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME_IBUFFER, -1);
            if (this._refCount === 0) {
                this.destructor();
                return 0;
            }
            else {
                return this._refCount;
            }
        };
        BufferResource.prototype.contextFree = function () {
            if (this._buffer) {
                this._gl.deleteBuffer(this._buffer);
                this._buffer = void 0;
            }
            this._gl = void 0;
        };
        BufferResource.prototype.contextGain = function (manager) {
            // FIXME: Support for multiple contexts. Do I need multiple buffers?
            // Remark. The constructor says I will only be working with one context.
            // However, if that is the case, what if someone adds me to a different context.
            // Answer, I can detect this condition by looking a canvasId.
            // But can I prevent it in the API?
            // I don't think so. That would require typed contexts.
            var gl = manager.gl;
            if (this._gl !== gl) {
                this.contextFree();
                this._gl = gl;
                this._buffer = gl.createBuffer();
            }
        };
        BufferResource.prototype.contextLoss = function () {
            this._buffer = void 0;
            this._gl = void 0;
        };
        /**
         * @method bind
         */
        BufferResource.prototype.bind = function () {
            if (this._gl) {
                this._gl.bindBuffer(this._target, this._buffer);
            }
            else {
                console.warn(LOGGING_NAME_IBUFFER + " bind() missing WebGLRenderingContext.");
            }
        };
        /**
         * @method unbind
         */
        BufferResource.prototype.unbind = function () {
            if (this._gl) {
                this._gl.bindBuffer(this._target, null);
            }
            else {
                console.warn(LOGGING_NAME_IBUFFER + " unbind() missing WebGLRenderingContext.");
            }
        };
        return BufferResource;
    })();
    return BufferResource;
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

define('davinci-eight/checks/mustBeInteger',["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy, isInteger) {
    function beAnInteger() {
        return "be an integer";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
        return value;
    }
    return mustBeInteger;
});

define('davinci-eight/utils/RefCount',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    var RefCount = (function () {
        function RefCount(callback) {
            this._refCount = 1;
            expectArg('callback', callback).toBeFunction();
            this._callback = callback;
        }
        RefCount.prototype.addRef = function () {
            this._refCount++;
            return this._refCount;
        };
        RefCount.prototype.release = function () {
            if (this._refCount > 0) {
                this._refCount--;
                if (this._refCount === 0) {
                    var callback = this._callback;
                    this._callback = void 0;
                    callback();
                }
                return this._refCount;
            }
            else {
                console.warn("release() called with refCount already " + this._refCount);
            }
        };
        return RefCount;
    })();
    return RefCount;
});

define('davinci-eight/utils/StringIUnknownMap',["require", "exports", '../utils/refChange', '../utils/uuid4'], function (require, exports, refChange, uuid4) {
    var LOGGING_NAME_IUNKNOWN_MAP = 'StringIUnknownMap';
    var StringIUnknownMap = (function () {
        function StringIUnknownMap() {
            this._refCount = 1;
            this._elements = {};
            this._uuid = uuid4().generate();
            refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, +1);
        }
        StringIUnknownMap.prototype.addRef = function () {
            refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, +1);
            this._refCount++;
            return this._refCount;
        };
        StringIUnknownMap.prototype.release = function () {
            refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, -1);
            this._refCount--;
            if (this._refCount === 0) {
                var self_1 = this;
                this.forEach(function (key) {
                    self_1.put(key, void 0);
                });
                this._elements = void 0;
            }
            return this._refCount;
        };
        StringIUnknownMap.prototype.exists = function (key) {
            var element = this._elements[key];
            return element ? true : false;
        };
        StringIUnknownMap.prototype.get = function (key) {
            var element = this._elements[key];
            if (element) {
                element.addRef();
                return element;
            }
            else {
                return void 0;
            }
        };
        StringIUnknownMap.prototype.put = function (key, value) {
            var existing = this._elements[key];
            if (existing) {
                if (value) {
                    if (existing === value) {
                    }
                    else {
                        existing.release();
                        value.addRef();
                        this._elements[key] = value;
                    }
                }
                else {
                    existing.release();
                    this._elements[key] = void 0;
                }
            }
            else {
                // There is no entry at the key specified.
                if (value) {
                    value.addRef();
                    this._elements[key] = value;
                }
                else {
                }
            }
        };
        StringIUnknownMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            var i;
            var length = keys.length;
            for (i = 0; i < length; i++) {
                var key = keys[i];
                var value = this._elements[key];
                callback(key, value);
            }
        };
        Object.defineProperty(StringIUnknownMap.prototype, "keys", {
            get: function () {
                // TODO: memoize
                return Object.keys(this._elements);
            },
            enumerable: true,
            configurable: true
        });
        StringIUnknownMap.prototype.remove = function (key) {
            this.put(key, void 0);
            delete this._elements[key];
        };
        return StringIUnknownMap;
    })();
    return StringIUnknownMap;
});

define('davinci-eight/resources/TextureResource',["require", "exports", '../checks/expectArg', '../utils/refChange', '../utils/uuid4'], function (require, exports, expectArg, refChange, uuid4) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_ITEXTURE = 'ITexture';
    var ms = new Array();
    var os = [];
    // What is the difference?
    var TextureResource = (function () {
        function TextureResource(monitors, target) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            // FIXME: Supprt multiple canvas.
            var monitor = monitors[0];
            this._monitor = expectArg('montor', monitor).toBeObject().value;
            this._target = target;
            refChange(this._uuid, LOGGING_NAME_ITEXTURE, +1);
            monitor.addContextListener(this);
        }
        TextureResource.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME_ITEXTURE, +1);
            return this._refCount;
        };
        TextureResource.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME_ITEXTURE, -1);
            if (this._refCount === 0) {
                this._monitor.removeContextListener(this);
                this.contextFree();
            }
            return this._refCount;
        };
        TextureResource.prototype.contextFree = function () {
            // FIXME: I need to know which context.
            if (this._texture) {
                this._gl.deleteTexture(this._texture);
                this._texture = void 0;
            }
            this._gl = void 0;
        };
        TextureResource.prototype.contextGain = function (manager) {
            // FIXME: Support multiple canvas.
            var gl = manager.gl;
            if (this._gl !== gl) {
                this.contextFree();
                this._gl = gl;
                // I must create a texture for each monitor.
                // But I only get gl events one at a time.
                this._texture = gl.createTexture();
            }
        };
        TextureResource.prototype.contextLoss = function () {
            // FIXME: I need to know which context.
            this._texture = void 0;
            this._gl = void 0;
        };
        /**
         * @method bind
         */
        TextureResource.prototype.bind = function () {
            if (this._gl) {
                this._gl.bindTexture(this._target, this._texture);
            }
            else {
                console.warn(LOGGING_NAME_ITEXTURE + " bind() missing WebGLRenderingContext.");
            }
        };
        /**
         * @method unbind
         */
        TextureResource.prototype.unbind = function () {
            if (this._gl) {
                this._gl.bindTexture(this._target, null);
            }
            else {
                console.warn(LOGGING_NAME_ITEXTURE + " unbind() missing WebGLRenderingContext.");
            }
        };
        return TextureResource;
    })();
    return TextureResource;
});

define('davinci-eight/utils/contextProxy',["require", "exports", '../core/BufferResource', '../dfx/DrawElements', '../checks/expectArg', '../renderers/initWebGL', '../checks/isDefined', '../checks/isNumber', '../checks/mustBeInteger', '../utils/RefCount', '../utils/refChange', '../dfx/Simplex', '../utils/StringIUnknownMap', '../resources/TextureResource', '../utils/uuid4'], function (require, exports, BufferResource, DrawElements, expectArg, initWebGL, isDefined, isNumber, mustBeInteger, RefCount, refChange, Simplex, StringIUnknownMap, TextureResource, uuid4) {
    var LOGGING_NAME_ELEMENTS_BLOCK = 'ElementsBlock';
    var LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib';
    var LOGGING_NAME_MESH = 'Mesh';
    var LOGGING_NAME_KAHUNA = 'ContextKahuna';
    function webglFunctionalConstructorContextBuilder() {
        // The following string represents how this API is exposed.
        return "webgl functional constructor";
    }
    function mustBeContext(gl, method) {
        if (gl) {
            return gl;
        }
        else {
            throw new Error(method + ": gl: WebGLRenderingContext is not defined. Either gl has been lost or start() not called.");
        }
    }
    /**
     * This could become an encapsulated call?
     */
    var DrawElementsCommand = (function () {
        function DrawElementsCommand(mode, count, type, offset) {
            this.mode = mode;
            this.count = count;
            this.type = type;
            this.offset = offset;
        }
        DrawElementsCommand.prototype.execute = function (gl) {
            gl.drawElements(this.mode, this.count, this.type, this.offset);
        };
        return DrawElementsCommand;
    })();
    var ElementsBlock = (function () {
        function ElementsBlock(indexBuffer, attributes, drawCommand) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._indexBuffer = indexBuffer;
            this._indexBuffer.addRef();
            this._attributes = attributes;
            this._attributes.addRef();
            this.drawCommand = drawCommand;
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, +1);
        }
        Object.defineProperty(ElementsBlock.prototype, "indexBuffer", {
            get: function () {
                this._indexBuffer.addRef();
                return this._indexBuffer;
            },
            enumerable: true,
            configurable: true
        });
        ElementsBlock.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, +1);
            return this._refCount;
        };
        ElementsBlock.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, -1);
            if (this._refCount === 0) {
                this._attributes.release();
                this._indexBuffer.release();
            }
            return this._refCount;
        };
        Object.defineProperty(ElementsBlock.prototype, "attributes", {
            get: function () {
                this._attributes.addRef();
                return this._attributes;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsBlock;
    })();
    /**
     *
     */
    var ElementsBlockAttrib = (function () {
        function ElementsBlockAttrib(buffer, size, normalized, stride, offset) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._buffer = buffer;
            this._buffer.addRef();
            this.size = size;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, +1);
        }
        ElementsBlockAttrib.prototype.addRef = function () {
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, +1);
            this._refCount++;
            return this._refCount;
        };
        ElementsBlockAttrib.prototype.release = function () {
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, -1);
            this._refCount--;
            if (this._refCount === 0) {
                this._buffer.release();
            }
            return this._refCount;
        };
        Object.defineProperty(ElementsBlockAttrib.prototype, "buffer", {
            get: function () {
                this._buffer.addRef();
                return this._buffer;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsBlockAttrib;
    })();
    // TODO: If mode provided, check consistent with elements.k.
    // expectArg('mode', mode).toSatisfy(isDrawMode(mode, gl), "mode must be one of TRIANGLES, ...");
    function drawMode(k, mode, gl) {
        switch (k) {
            case Simplex.K_FOR_TRIANGLE: {
                return gl.TRIANGLES;
            }
            case Simplex.K_FOR_LINE_SEGMENT: {
                return gl.LINES;
            }
            case Simplex.K_FOR_POINT: {
                return gl.POINTS;
            }
            case Simplex.K_FOR_EMPTY: {
                return void 0;
            }
            default: {
                throw new Error("Unexpected k-simplex dimension, k => " + k);
            }
        }
    }
    function isDrawMode(mode, gl) {
        if (!isNumber(mode)) {
            expectArg('mode', mode).toBeNumber();
        }
        switch (mode) {
            case gl.TRIANGLES: {
                return true;
            }
            case gl.LINES: {
                return true;
            }
            case gl.POINTS: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    function isBufferUsage(usage, gl) {
        expectArg('usage', usage).toBeNumber();
        switch (usage) {
            case gl.STATIC_DRAW: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    function messageUnrecognizedMesh(meshUUID) {
        expectArg('meshUUID', meshUUID).toBeString();
        return meshUUID + " is not a recognized mesh uuid";
    }
    function attribKey(aName, aNameToKeyName) {
        if (aNameToKeyName) {
            var key = aNameToKeyName[aName];
            return key ? key : aName;
        }
        else {
            return aName;
        }
    }
    // FIXME: Use this function pair to replace BEGIN..END
    /**
     *
     */
    function bindProgramAttribLocations(program, block, aNameToKeyName) {
        // FIXME: This is where we get the IProgram attributes property.
        // FIXME: Can we invert this?
        // What are we offering to the program:
        // block.attributes (reference counted)
        // Offer a NumberIUnknownList<IAttributePointer> which we have prepared up front
        // in order to get the name -> index correct.
        // Then attribute setting shoul go much faster
        var attribLocations = program.attributes;
        if (attribLocations) {
            var aNames = Object.keys(attribLocations);
            var aNamesLength = aNames.length;
            var i;
            for (i = 0; i < aNamesLength; i++) {
                var aName = aNames[i];
                var key = attribKey(aName, aNameToKeyName);
                var attributes = block.attributes;
                var attribute = attributes.get(key);
                if (attribute) {
                    // Associate the attribute buffer with the attribute location.
                    var buffer = attribute.buffer;
                    buffer.bind();
                    var attributeLocation = attribLocations[aName];
                    attributeLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
                    buffer.unbind();
                    attributeLocation.enable();
                    buffer.release();
                    attribute.release();
                }
                else {
                    // The attribute available may not be required by the program.
                    // TODO: (1) Named programs, (2) disable warning by attribute?
                    // Do not allow Attribute 0 to be disabled.
                    console.warn("program attribute " + aName + " is not satisfied by the mesh");
                }
                attributes.release();
            }
        }
        else {
            console.warn("unbindProgramAttribLocations: program.attributes is falsey.");
        }
    }
    function unbindProgramAttribLocations(program) {
        // FIXME: Not sure if this suggests a disableAll() or something more symmetric.
        var attribLocations = program.attributes;
        if (attribLocations) {
            Object.keys(attribLocations).forEach(function (aName) {
                attribLocations[aName].disable();
            });
        }
        else {
            console.warn("unbindProgramAttribLocations: program.attributes is falsey.");
        }
    }
    function webgl(canvas, canvasId, attributes) {
        if (canvasId === void 0) { canvasId = 0; }
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement @ webgl function");
        mustBeInteger('canvasId', canvasId, webglFunctionalConstructorContextBuilder);
        var uuid = uuid4().generate();
        var blocks = new StringIUnknownMap();
        // Remark: We only hold weak references to users so that the lifetime of resource
        // objects is not affected by the fact that they are listening for gl events.
        // Users should automatically add themselves upon construction and remove upon release.
        var users = [];
        function addContextListener(user) {
            expectArg('user', user).toBeObject();
            users.push(user);
            if (gl) {
                user.contextGain(kahuna);
            }
        }
        function removeContextListener(user) {
            expectArg('user', user).toBeObject();
            var index = users.indexOf(user);
            if (index >= 0) {
                var removals = users.splice(index, 1);
                removals.forEach(function (user) {
                    // What's going on here?
                });
            }
        }
        function meshRemover(blockUUID) {
            return function () {
                if (blocks.exists(blockUUID)) {
                    blocks.remove(blockUUID);
                }
                else {
                    console.warn("[System Error] " + messageUnrecognizedMesh(blockUUID));
                }
            };
        }
        function createDrawElementsMesh(uuid) {
            var refCount = new RefCount(meshRemover(uuid));
            var _program = void 0;
            var mesh = {
                addRef: function () {
                    refChange(uuid, LOGGING_NAME_MESH, +1);
                    return refCount.addRef();
                },
                release: function () {
                    refChange(uuid, LOGGING_NAME_MESH, -1);
                    return refCount.release();
                },
                get uuid() {
                    return uuid;
                },
                bind: function (program, aNameToKeyName) {
                    if (_program !== program) {
                        if (_program) {
                            mesh.unbind();
                        }
                        var block = blocks.get(uuid);
                        if (block) {
                            if (program) {
                                _program = program;
                                _program.addRef();
                                var indexBuffer = block.indexBuffer;
                                indexBuffer.bind();
                                indexBuffer.release();
                                bindProgramAttribLocations(_program, block, aNameToKeyName);
                            }
                            else {
                                expectArg('program', program).toBeObject();
                            }
                            block.release();
                        }
                        else {
                            throw new Error(messageUnrecognizedMesh(uuid));
                        }
                    }
                },
                draw: function () {
                    var block = blocks.get(uuid);
                    if (block) {
                        block.drawCommand.execute(gl);
                        block.release();
                    }
                    else {
                        throw new Error(messageUnrecognizedMesh(uuid));
                    }
                },
                unbind: function () {
                    if (_program) {
                        var block = blocks.get(uuid);
                        if (block) {
                            var indexBuffer = block.indexBuffer;
                            indexBuffer.unbind();
                            indexBuffer.release();
                            unbindProgramAttribLocations(_program);
                            block.release();
                        }
                        else {
                            throw new Error(messageUnrecognizedMesh(uuid));
                        }
                        // We bumped up the reference count during bind. Now we are done.
                        _program.release();
                        // Important! The existence of _program indicates the binding state.
                        _program = void 0;
                    }
                }
            };
            refChange(uuid, LOGGING_NAME_MESH, +1);
            return mesh;
        }
        // FIXME Rename to gl
        var gl;
        var refCount = 1;
        var mirror = false;
        var tokenArg = expectArg('token', "");
        var webGLContextLost = function (event) {
            event.preventDefault();
            gl = void 0;
            users.forEach(function (user) {
                user.contextLoss(canvasId);
            });
        };
        var webGLContextRestored = function (event) {
            event.preventDefault();
            gl = initWebGL(canvas, attributes);
            users.forEach(function (user) {
                user.contextGain(kahuna);
            });
        };
        var kahuna = {
            get canvasId() {
                return canvasId;
            },
            /**
             *
             */
            createDrawElementsMesh: function (elements, mode, usage) {
                expectArg('elements', elements).toSatisfy(elements instanceof DrawElements, "elements must be an instance of DrawElements");
                mode = drawMode(elements.k, mode, gl);
                if (!isDefined(mode)) {
                    // An empty simplex (k = -1 or vertices.length = k + 1 = 0) begets
                    // something that can't be drawn (no mode) and it is invisible anyway.
                    // In such a case we choose not to allocate any buffers. What would be the usage?
                    return void 0;
                }
                if (isDefined(usage)) {
                    expectArg('usage', usage).toSatisfy(isBufferUsage(usage, gl), "usage must be on of STATIC_DRAW, ...");
                }
                else {
                    usage = gl.STATIC_DRAW;
                }
                var mesh = createDrawElementsMesh(uuid4().generate());
                var indexBuffer = kahuna.createElementArrayBuffer();
                indexBuffer.bind();
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
                indexBuffer.unbind();
                var attributes = new StringIUnknownMap();
                var names = Object.keys(elements.attributes);
                var namesLength = names.length;
                var i;
                for (i = 0; i < namesLength; i++) {
                    var name_1 = names[i];
                    var buffer = kahuna.createArrayBuffer();
                    buffer.bind();
                    var vertexAttrib = elements.attributes[name_1];
                    var data = vertexAttrib.values.data;
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
                    var attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
                    attributes.put(name_1, attribute);
                    attribute.release();
                    buffer.unbind();
                    buffer.release();
                }
                // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                switch (elements.k) {
                }
                var drawCommand = new DrawElementsCommand(mode, elements.indices.length, gl.UNSIGNED_SHORT, 0);
                var block = new ElementsBlock(indexBuffer, attributes, drawCommand);
                blocks.put(mesh.uuid, block);
                block.release();
                attributes.release();
                indexBuffer.release();
                return mesh;
            },
            start: function () {
                gl = initWebGL(canvas, attributes);
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                users.forEach(function (user) { user.contextGain(kahuna); });
            },
            stop: function () {
                gl = void 0;
                users.forEach(function (user) { user.contextFree(canvasId); });
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
            },
            addContextListener: function (user) {
                addContextListener(user);
            },
            removeContextListener: function (user) {
                removeContextListener(user);
            },
            get gl() {
                if (gl) {
                    return gl;
                }
                else {
                    console.warn("property gl: WebGLRenderingContext is not defined. Either gl has been lost or start() not called.");
                    return void 0;
                }
            },
            addRef: function () {
                refCount++;
                refChange(uuid, LOGGING_NAME_KAHUNA, +1);
                return refCount;
            },
            release: function () {
                refCount--;
                refChange(uuid, LOGGING_NAME_KAHUNA, -1);
                if (refCount === 0) {
                    blocks.release();
                    while (users.length > 0) {
                        var user = users.pop();
                    }
                }
                return refCount;
            },
            clearColor: function (red, green, blue, alpha) {
                if (gl) {
                    return gl.clearColor(red, green, blue, alpha);
                }
            },
            clearDepth: function (depth) {
                if (gl) {
                    return gl.clearDepth(depth);
                }
            },
            drawArrays: function (mode, first, count) {
                if (gl) {
                    return gl.drawArrays(mode, first, count);
                }
            },
            drawElements: function (mode, count, type, offset) {
                if (gl) {
                    return gl.drawElements(mode, count, type, offset);
                }
            },
            depthFunc: function (func) {
                if (gl) {
                    return gl.depthFunc(func);
                }
            },
            enable: function (capability) {
                if (gl) {
                    return gl.enable(capability);
                }
            },
            createArrayBuffer: function () {
                // TODO: Replace with functional constructor pattern.
                return new BufferResource(kahuna, mustBeContext(gl, 'createArrayBuffer()').ARRAY_BUFFER);
            },
            createElementArrayBuffer: function () {
                // TODO: Replace with functional constructor pattern.
                return new BufferResource(kahuna, mustBeContext(gl, 'createElementArrayBuffer()').ELEMENT_ARRAY_BUFFER);
            },
            createTexture2D: function () {
                // TODO: Replace with functional constructor pattern.
                // FIXME Does this mean that Texture only has one ContextMonitor?
                return new TextureResource([kahuna], mustBeContext(gl, 'createTexture2D()').TEXTURE_2D);
            },
            createTextureCubeMap: function () {
                // TODO: Replace with functional constructor pattern.
                return new TextureResource([kahuna], mustBeContext(gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
            },
            get mirror() {
                return mirror;
            },
            set mirror(value) {
                mirror = expectArg('mirror', value).toBeBoolean().value;
            }
        };
        refChange(uuid, LOGGING_NAME_KAHUNA, +1);
        return kahuna;
    }
    return webgl;
});

define('davinci-eight/renderers/renderer',["require", "exports", '../core', '../core/Color', '../checks/expectArg', '../utils/uuid4'], function (require, exports, core, Color, expectArg, uuid4) {
    var CLASS_NAME = "ContextRenderer";
    // FIXME: multi-context monitors: etc
    // FIXME; Remove attributes
    /**
     *
     */
    var renderer = function (canvas) {
        // FIXME: Replace.
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        // Forced to cache this becuase of the need to avoid duplicating every call by wrapping.
        var gl = void 0;
        var autoClear = true;
        var clearColor = Color.fromRGB(0, 0, 0);
        var clearAlpha = 0;
        var uuid = uuid4().generate();
        function drawHandler(drawable) {
            drawable.draw();
        }
        var self = {
            get canvas() { return canvas; },
            get gl() { return gl; },
            contextFree: function () {
                gl = void 0;
            },
            contextGain: function (manager) {
                // FIXME: multi-context
                gl = manager.gl;
                console.log(core.NAMESPACE + " " + core.VERSION + " (" + core.GITHUB + ") " + core.LAST_AUTHORED_DATE);
                if (core.LOG_WEBGL_VERSION) {
                    console.log(gl.getParameter(gl.VERSION));
                }
                if (core.LOG_WEBGL_CONTEXT_ATTRIBUTES) {
                    var attributes = gl.getContextAttributes();
                    console.log("alpha                 => " + attributes.alpha);
                    console.log("antialias             => " + attributes.antialias);
                    console.log("depth                 => " + attributes.depth);
                    console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
                    console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
                    console.log("stencil               => " + attributes.stencil);
                }
                gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha);
                gl.clearDepth(1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.viewport(0, 0, canvas.width, canvas.height);
            },
            contextLoss: function () {
                gl = void 0;
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
                if (gl) {
                    gl.clearColor(red, green, blue, alpha);
                }
            },
            render: function (drawList) {
                if (gl) {
                    if (autoClear) {
                        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

define('davinci-eight/scene/WebGLRenderer',["require", "exports", '../utils/contextProxy', '../renderers/renderer', '../checks/mustBeInteger', '../checks/mustSatisfy', '../utils/refChange', '../utils/uuid4'], function (require, exports, contextProxy, createRenderer, mustBeInteger, mustSatisfy, refChange, uuid4) {
    var LOGGING_NAME = 'WebGLRenderer';
    // FIXME: ContextManger may be reference counted so this class may need to be too.
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    function beHTMLCanvasElement() {
        return "be an HTMLCanvasElement";
    }
    var WebGLRenderer = (function () {
        function WebGLRenderer(canvas, canvasId, attributes) {
            if (canvasId === void 0) { canvasId = 0; }
            this._refCount = 1;
            this._uuid = uuid4().generate();
            if (canvas) {
                mustSatisfy('canvas', canvas instanceof HTMLCanvasElement, beHTMLCanvasElement, ctorContext);
                this._canvas = canvas;
            }
            else {
                this._canvas = document.createElement('canvas');
            }
            this._canvasId = mustBeInteger('canvasId', canvasId, ctorContext);
            // FIXME: dangerous chaining?
            // FIXME: The proxy is reference counted so WebGLRenderer should be too.
            this._kahuna = contextProxy(this._canvas, canvasId, attributes);
            this._renderer = createRenderer(this._canvas);
            // Provide the manager with access to the WebGLRenderingContext.
            this._kahuna.addContextListener(this._renderer);
            refChange(this._uuid, LOGGING_NAME, +1);
        }
        WebGLRenderer.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        WebGLRenderer.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME, +1);
            return this._refCount;
        };
        Object.defineProperty(WebGLRenderer.prototype, "canvasId", {
            get: function () {
                return this._canvasId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebGLRenderer.prototype, "gl", {
            // FIXME: Rename this property to gl, which is the normal usage.
            get: function () {
                return this._kahuna.gl;
            },
            enumerable: true,
            configurable: true
        });
        WebGLRenderer.prototype.createDrawElementsMesh = function (elements, mode, usage) {
            return this._kahuna.createDrawElementsMesh(elements, mode, usage);
        };
        Object.defineProperty(WebGLRenderer.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        WebGLRenderer.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME, -1);
            if (this._refCount === 0) {
                this._kahuna.release();
                this._canvas = void 0;
                this._canvasId = void 0;
                this._kahuna = void 0;
                this._refCount = void 0;
                this._renderer = void 0;
                return 0;
            }
            else {
                return this._refCount;
            }
        };
        WebGLRenderer.prototype.removeContextListener = function (user) {
            this._kahuna.removeContextListener(user);
        };
        WebGLRenderer.prototype.render = function (scene, ambients) {
            // FIXME: The camera will provide uniforms, but I need to get them into the renderer loop.
            // This implies camera should implement UniformData and we pass that in as ambients.
            // This allows us to generalize the WebGLRenderer API.
            this._renderer.render(scene, ambients);
        };
        WebGLRenderer.prototype.setClearColor = function (color, alpha) {
            if (alpha === void 0) { alpha = 1.0; }
            console.warn("WegGLRenderer.setClearColor(). Making it up as we go along.");
            this._renderer.clearColor(0.2, 0.2, 0.2, alpha);
        };
        WebGLRenderer.prototype.setSize = function (width, height, updateStyle) {
            console.warn("WegGLRenderer.setSize()");
        };
        WebGLRenderer.prototype.start = function () {
            this._kahuna.start();
        };
        WebGLRenderer.prototype.stop = function () {
            this._kahuna.stop();
        };
        return WebGLRenderer;
    })();
    return WebGLRenderer;
});

define('davinci-eight/geometries/Geometry',["require", "exports"], function (require, exports) {
    /**
     * @class Geometry
     */
    var Geometry = (function () {
        //public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
        function Geometry() {
            //public simplices: Simplex[] = [];
            this.dynamic = true;
            this.verticesNeedUpdate = false;
            this.elementsNeedUpdate = false;
            this.uvsNeedUpdate = false;
        }
        Geometry.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            console.warn("Geometry.mergeVertices not yet implemented");
        };
        return Geometry;
    })();
    return Geometry;
});

define('davinci-eight/dfx/Complex',["require", "exports", '../dfx/Simplex'], function (require, exports, Simplex) {
    /**
     * @class Complex
     */
    var Complex = (function () {
        //public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
        function Complex() {
            this.simplices = [];
            this.dynamic = true;
            this.verticesNeedUpdate = false;
            this.elementsNeedUpdate = false;
            this.uvsNeedUpdate = false;
        }
        Complex.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("Complex.mergeVertices not yet implemented");
        };
        Complex.prototype.boundary = function (count) {
            this.simplices = Simplex.boundary(this.simplices, count);
        };
        Complex.prototype.subdivide = function (count) {
            this.simplices = Simplex.subdivide(this.simplices, count);
        };
        return Complex;
    })();
    return Complex;
});

define('davinci-eight/checks/mustBeNumber',["require", "exports", '../checks/mustSatisfy', '../checks/isNumber'], function (require, exports, mustSatisfy, isNumber) {
    function beANumber() {
        return "be a number";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
        return value;
    }
    return mustBeInteger;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/geometries/BoxComplex',["require", "exports", '../dfx/Complex', '../checks/mustBeInteger', '../checks/mustBeNumber', '../dfx/Simplex', '../core/Symbolic', '../math/Vector1', '../math/Vector2', '../math/Vector3'], function (require, exports, Complex, mustBeInteger, mustBeNumber, Simplex, Symbolic, Vector1, Vector2, Vector3) {
    function boxCtor() {
        return "BoxComplex constructor";
    }
    /**
     * @class BoxComplex
     * @extends Complex
     */
    var BoxComplex = (function (_super) {
        __extends(BoxComplex, _super);
        function BoxComplex(width, height, depth, widthSegments, heightSegments, depthSegments, wireFrame) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (depth === void 0) { depth = 1; }
            if (widthSegments === void 0) { widthSegments = 1; }
            if (heightSegments === void 0) { heightSegments = 1; }
            if (depthSegments === void 0) { depthSegments = 1; }
            if (wireFrame === void 0) { wireFrame = false; }
            _super.call(this);
            mustBeNumber('width', width, boxCtor);
            mustBeNumber('height', height, boxCtor);
            mustBeNumber('depth', depth, boxCtor);
            mustBeInteger('widthSegments', widthSegments, boxCtor);
            mustBeInteger('heightSegments', heightSegments, boxCtor);
            mustBeInteger('depthSegments', depthSegments, boxCtor);
            // Temporary storage for points.
            // The approach is:
            // 1. Compute the points first.
            // 2. Compute the faces and have them reference the points.
            // 3. Throw away the temporary storage of points. 
            var points = [];
            var geometry = this;
            var width_half = width / 2;
            var height_half = height / 2;
            var depth_half = depth / 2;
            buildPlane('z', 'y', -1, -1, depth, height, +width_half, new Vector1([0])); // positive-x
            buildPlane('z', 'y', +1, -1, depth, height, -width_half, new Vector1([1])); // negative-x
            buildPlane('x', 'z', +1, +1, width, depth, +height_half, new Vector1([2])); // positive-y
            buildPlane('x', 'z', +1, -1, width, depth, -height_half, new Vector1([3])); // negative-y
            buildPlane('x', 'y', +1, -1, width, height, +depth_half, new Vector1([4])); // positive-z
            buildPlane('x', 'y', -1, -1, width, height, -depth_half, new Vector1([5])); // negative-z
            function buildPlane(u, v, udir, vdir, width, height, depth, materialIndex) {
                var w;
                var ix;
                var iy;
                var gridX = widthSegments;
                var gridY = heightSegments;
                var width_half = width / 2;
                var height_half = height / 2;
                var offset = points.length;
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
                var gridX1 = gridX + 1;
                var gridY1 = gridY + 1;
                var segment_width = width / gridX;
                var segment_height = height / gridY;
                // The normal starts out as all zeros.
                var normal = new Vector3();
                // This bit of code sets the appropriate coordinate in the normal vector.
                normal[w] = depth > 0 ? 1 : -1;
                // Compute the points.
                for (iy = 0; iy < gridY1; iy++) {
                    for (ix = 0; ix < gridX1; ix++) {
                        var point = new Vector3();
                        // This bit of code sets the appropriate coordinate in the position vector.
                        point[u] = (ix * segment_width - width_half) * udir;
                        point[v] = (iy * segment_height - height_half) * vdir;
                        point[w] = depth;
                        points.push(point);
                    }
                }
                // Compute the triangular faces using the pre-computed points.
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
                        var face = new Simplex(Simplex.K_FOR_TRIANGLE);
                        face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a + offset];
                        face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                        face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uva;
                        face.vertices[0].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                        face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b + offset];
                        face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                        face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                        face.vertices[1].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                        face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d + offset];
                        face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                        face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                        face.vertices[2].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                        geometry.simplices.push(face);
                        face = new Simplex(Simplex.K_FOR_TRIANGLE);
                        face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b + offset];
                        face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                        face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                        face.vertices[0].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                        face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c + offset];
                        face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                        face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvc;
                        face.vertices[1].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                        face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d + offset];
                        face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                        face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                        face.vertices[2].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                        geometry.simplices.push(face);
                    }
                }
            }
            if (wireFrame) {
                this.boundary();
            }
            // This construction duplicates vertices along the edges of the cube.
            this.mergeVertices();
        }
        return BoxComplex;
    })(Complex);
    return BoxComplex;
});

define('davinci-eight/programs/shaderProgram',["require", "exports", '../core/AttribLocation', '../scene/MonitorList', '../utils/uuid4', '../core/UniformLocation', '../utils/refChange'], function (require, exports, AttribLocation, MonitorList, uuid4, UniformLocation, refChange) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_IPROGRAM = 'IProgram';
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
    // FIXME: Rename to program or createProgram
    // FIXME: Handle list of shaders? Else createSimpleProgram
    var shaderProgram = function (monitors, vertexShader, fragmentShader, attribs) {
        MonitorList.verify('monitors', monitors, function () { return "shaderProgram"; });
        // FIXME multi-context
        if (typeof vertexShader !== 'string') {
            throw new Error("vertexShader argument must be a string.");
        }
        if (typeof fragmentShader !== 'string') {
            throw new Error("fragmentShader argument must be a string.");
        }
        var refCount = 1;
        /**
         * Because we are multi-canvas aware, programs are tracked by the canvas id.
         */
        var programs = {};
        /**
         * Because we are multi-canvas aware, gls are tracked by the canvas id.
         * We need to hold onto a WebGLRenderingContext so that we can delete programs.
         */
        var gls = {};
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
                refChange(uuid, LOGGING_NAME_IPROGRAM, +1);
                refCount++;
                return refCount;
            },
            release: function () {
                refChange(uuid, LOGGING_NAME_IPROGRAM, -1);
                refCount--;
                if (refCount === 0) {
                    MonitorList.removeContextListener(self, monitors);
                    var keys = Object.keys(gls).map(function (key) { return parseInt(key); });
                    var keysLength = keys.length;
                    for (var k = 0; k < keysLength; k++) {
                        var canvasId = keys[k];
                        self.contextFree(canvasId);
                    }
                }
                return refCount;
            },
            contextFree: function (canvasId) {
                var $context = gls[canvasId];
                if ($context) {
                    var program = programs[canvasId];
                    if (program) {
                        $context.deleteProgram(program);
                        programs[canvasId] = void 0;
                    }
                    gls[canvasId] = void 0;
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextFree();
                    }
                    for (var uName in uniformLocations) {
                        uniformLocations[uName].contextFree();
                    }
                }
            },
            contextGain: function (manager) {
                // FIXME: multi-canvas
                var canvasId = manager.canvasId;
                if (gls[canvasId] !== manager.gl) {
                    self.contextFree(canvasId);
                    gls[canvasId] = manager.gl;
                    var context = manager.gl;
                    var program = makeWebGLProgram(context, vertexShader, fragmentShader, attribs);
                    programs[manager.canvasId] = program;
                    var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                    for (var a = 0; a < activeAttributes; a++) {
                        var activeAttribInfo = context.getActiveAttrib(program, a);
                        var name_1 = activeAttribInfo.name;
                        if (!attributeLocations[name_1]) {
                            attributeLocations[name_1] = new AttribLocation(manager, name_1);
                        }
                    }
                    var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                    for (var u = 0; u < activeUniforms; u++) {
                        var activeUniformInfo = context.getActiveUniform(program, u);
                        var name_2 = activeUniformInfo.name;
                        if (!uniformLocations[name_2]) {
                            uniformLocations[name_2] = new UniformLocation(manager, name_2);
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
            contextLoss: function (canvasId) {
                programs[canvasId] = void 0;
                gls[canvasId] = void 0;
                for (var aName in attributeLocations) {
                    attributeLocations[aName].contextLoss();
                }
                for (var uName in uniformLocations) {
                    uniformLocations[uName].contextLoss();
                }
            },
            get program() {
                console.warn("shaderProgram program property is assuming canvas id = 0");
                var canvasId = 0;
                var program = programs[canvasId];
                // It's a WebGLProgram, no reference count management required.
                return program;
            },
            get programId() {
                return uuid;
            },
            use: function (canvasId) {
                var context = gls[canvasId];
                if (context) {
                    context.useProgram(programs[canvasId]);
                }
                else {
                    console.warn(LOGGING_NAME_IPROGRAM + " use() missing WebGLRenderingContext");
                }
                return self;
            },
            enableAttrib: function (name) {
                var attribLoc = attributeLocations[name];
                if (attribLoc) {
                    attribLoc.enable();
                }
            },
            disableAttrib: function (name) {
                var attribLoc = attributeLocations[name];
                if (attribLoc) {
                    attribLoc.disable();
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
        MonitorList.addContextListener(self, monitors);
        refChange(uuid, LOGGING_NAME_IPROGRAM, +1);
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

define('davinci-eight/programs/smartProgram',["require", "exports", '../scene/MonitorList', '../programs/fragmentShader', './shaderProgram', '../core/Symbolic', '../programs/vertexShader'], function (require, exports, MonitorList, fragmentShader, shaderProgram, Symbolic, vertexShader) {
    function vLightRequired(uniforms) {
        return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    function vColorRequired(attributes, uniforms) {
        return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
    }
    /**
     *
     */
    var smartProgram = function (monitors, attributes, uniforms, bindings) {
        MonitorList.verify('monitors', monitors, function () { return "smartProgram"; });
        if (!attributes) {
            throw new Error("The attributes parameter is required for smartProgram.");
        }
        if (!uniforms) {
            throw new Error("The uniformsList parameter is required for smartProgram.");
        }
        var vColor = vColorRequired(attributes, uniforms);
        var vLight = vLightRequired(uniforms);
        var innerProgram = shaderProgram(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);
        var self = {
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
            contextFree: function (canvasId) {
                return innerProgram.contextFree(canvasId);
            },
            contextGain: function (manager) {
                return innerProgram.contextGain(manager);
            },
            contextLoss: function (canvasId) {
                return innerProgram.contextLoss(canvasId);
            },
            use: function (canvasId) {
                return innerProgram.use(canvasId);
            },
            enableAttrib: function (name) {
                return innerProgram.enableAttrib(name);
            },
            disableAttrib: function (name) {
                return innerProgram.disableAttrib(name);
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

define('davinci-eight/programs/programFromScripts',["require", "exports", '../programs/shaderProgram', '../checks/expectArg', '../scene/MonitorList'], function (require, exports, shaderProgram, expectArg, MonitorList) {
    // FIXME: Lists of scripts, using the type to distinguish vertex/fragment?
    // FIXME: Temporary rename simpleProgramFromScripts?
    /**
     * @method programFromScripts
     * @param monitors {ContextMonitor[]}
     * @param vsId {string} The vertex shader script element identifier.
     * @param fsId {string} The fragment shader script element identifier.
     * @param $document {Document} The document containing the script elements.
     */
    function programFromScripts(monitors, vsId, fsId, $document, attribs) {
        if (attribs === void 0) { attribs = []; }
        MonitorList.verify('monitors', monitors, function () { return "programFromScripts"; });
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
        return shaderProgram(monitors, vertexShader, fragmentShader, attribs);
    }
    return programFromScripts;
});

define('davinci-eight/checks/isString',["require", "exports"], function (require, exports) {
    function isString(s) {
        return (typeof s === 'string');
    }
    return isString;
});

define('davinci-eight/checks/mustBeString',["require", "exports", '../checks/mustSatisfy', '../checks/isString'], function (require, exports, mustSatisfy, isString) {
    function beAString() {
        return "be a string";
    }
    function mustBeString(name, value, contextBuilder) {
        mustSatisfy(name, isString(value), beAString, contextBuilder);
        return value;
    }
    return mustBeString;
});

define('davinci-eight/materials/Material',["require", "exports", '../core', '../scene/MonitorList', '../checks/mustBeInteger', '../checks/mustBeString', '../utils/refChange', '../utils/uuid4'], function (require, exports, core, MonitorList, mustBeInteger, mustBeString, refChange, uuid4) {
    function consoleWarnDroppedUniform(clazz, suffix, name) {
        console.warn(clazz + " dropped uniform" + suffix + " " + name);
    }
    /**
     * @module EIGHT
     * @class Material
     * @implements IProgram
     */
    var Material = (function () {
        /**
         * @constructor
         * @param contexts {ContextMonitor[]}
         * @param type {string} The class name, used for logging and serialization.
         */
        function Material(contexts, type) {
            this.readyPending = false;
            this.programId = uuid4().generate();
            this._refCount = 1;
            MonitorList.verify('contexts', contexts);
            mustBeString('type', type);
            this._monitors = MonitorList.copy(contexts);
            // FIXME multi-context support.
            this.type = type;
            refChange(this.programId, this.type, this._refCount);
        }
        Material.prototype.makeReady = function (async) {
            if (!this.readyPending) {
                this.readyPending = true;
                this._monitors.addContextListener(this);
            }
        };
        Object.defineProperty(Material.prototype, "monitors", {
            get: function () {
                return this._monitors.toArray();
            },
            enumerable: true,
            configurable: true
        });
        Material.prototype.addRef = function () {
            this._refCount++;
            refChange(this.programId, this.type, +1);
            return this._refCount;
        };
        Material.prototype.release = function () {
            this._refCount--;
            refChange(this.programId, this.type, -1);
            if (this._refCount === 0) {
                this._monitors.removeContextListener(this);
                if (this.inner) {
                    this.inner.release();
                    this.inner = void 0;
                }
            }
            return this._refCount;
        };
        // FIXME; I'm going to need to know which monitor.
        Material.prototype.use = function (canvasId) {
            if (core.ASSERTIVE) {
                mustBeInteger('canvasid', canvasId);
            }
            if (this.inner) {
                return this.inner.use(canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.use(canvasId);
                }
                else {
                    console.warn(this.type + " use()");
                }
            }
        };
        Object.defineProperty(Material.prototype, "attributes", {
            get: function () {
                // FIXME: Why is this called.
                // FIXME: The map should be protected but that is slow
                // FIXME Clear need for performant solution.
                if (this.inner) {
                    return this.inner.attributes;
                }
                else {
                    var async = false;
                    this.makeReady(async);
                    if (this.inner) {
                        return this.inner.attributes;
                    }
                    else {
                        return void 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "uniforms", {
            get: function () {
                if (this.inner) {
                    return this.inner.uniforms;
                }
                else {
                    var async = false;
                    this.makeReady(async);
                    if (this.inner) {
                        return this.inner.uniforms;
                    }
                    else {
                        return void 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Material.prototype.enableAttrib = function (name) {
            if (this.inner) {
                return this.inner.enableAttrib(name);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.enableAttrib(name);
                }
                else {
                    console.warn(this.type + " enableAttrib()");
                }
            }
        };
        Material.prototype.disableAttrib = function (name) {
            if (this.inner) {
                return this.inner.disableAttrib(name);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.disableAttrib(name);
                }
                else {
                    console.warn(this.type + " disableAttrib()");
                }
            }
        };
        Material.prototype.contextFree = function (canvasId) {
            if (this.inner) {
                this.inner.contextFree(canvasId);
            }
        };
        Material.prototype.contextGain = function (manager) {
            this.inner = this.createProgram();
        };
        Material.prototype.contextLoss = function (canvasId) {
            if (this.inner) {
                this.inner.contextLoss(canvasId);
            }
        };
        Material.prototype.createProgram = function () {
            // FIXME; Since we get contextGain by canvas, expect canvasId to be an argument?
            // FIXME: We just delegate contextGain to the program.
            console.warn("Material createProgram method is virtual and should be implemented by " + this.type);
            return void 0;
        };
        Material.prototype.uniform1f = function (name, x) {
            if (this.inner) {
                this.inner.uniform1f(name, x);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform1f(name, x);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '1f', name);
                    }
                }
            }
        };
        Material.prototype.uniform2f = function (name, x, y) {
            if (this.inner) {
                this.inner.uniform2f(name, x, y);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform2f(name, x, y);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '2f', name);
                    }
                }
            }
        };
        Material.prototype.uniform3f = function (name, x, y, z) {
            if (this.inner) {
                this.inner.uniform3f(name, x, y, z);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform3f(name, x, y, z);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '3f', name);
                    }
                }
            }
        };
        Material.prototype.uniform4f = function (name, x, y, z, w) {
            if (this.inner) {
                this.inner.uniform4f(name, x, y, z, w);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform4f(name, x, y, z, w);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '4f', name);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix1 = function (name, transpose, matrix) {
            if (this.inner) {
                this.inner.uniformMatrix1(name, transpose, matrix);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix1(name, transpose, matrix);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix1', name);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix2 = function (name, transpose, matrix) {
            if (this.inner) {
                this.inner.uniformMatrix2(name, transpose, matrix);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix2(name, transpose, matrix);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix2', name);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix3 = function (name, transpose, matrix) {
            if (this.inner) {
                this.inner.uniformMatrix3(name, transpose, matrix);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix3(name, transpose, matrix);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix3', name);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix4 = function (name, transpose, matrix) {
            if (this.inner) {
                this.inner.uniformMatrix4(name, transpose, matrix);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix4(name, transpose, matrix);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix4', name);
                    }
                }
            }
        };
        Material.prototype.uniformVector1 = function (name, vector) {
            if (this.inner) {
                this.inner.uniformVector1(name, vector);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector1(name, vector);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector1', name);
                    }
                }
            }
        };
        Material.prototype.uniformVector2 = function (name, vector) {
            if (this.inner) {
                this.inner.uniformVector2(name, vector);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector2(name, vector);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector2', name);
                    }
                }
            }
        };
        Material.prototype.uniformVector3 = function (name, vector) {
            if (this.inner) {
                this.inner.uniformVector3(name, vector);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector3(name, vector);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector3', name);
                    }
                }
            }
        };
        Material.prototype.uniformVector4 = function (name, vector) {
            if (this.inner) {
                this.inner.uniformVector4(name, vector);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector4(name, vector);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector4', name);
                    }
                }
            }
        };
        return Material;
    })();
    return Material;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/materials/HTMLScriptsMaterial',["require", "exports", '../materials/Material', '../checks/mustSatisfy', '../programs/programFromScripts'], function (require, exports, Material, mustSatisfy, programFromScripts) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var CLASS_NAME = 'HTMLScriptsMaterial';
    function nameBuilder() {
        return CLASS_NAME;
    }
    /**
     * @module EIGHT
     * @class HTMLScriptsMaterial
     * @extends Material
     */
    var HTMLScriptsMaterial = (function (_super) {
        __extends(HTMLScriptsMaterial, _super);
        /**
         * @constructor
         * @param contexts {ContextMonitor[]}
         * @param scriptIds {string[]}
         * @param dom {Document}
         */
        function HTMLScriptsMaterial(contexts, scriptIds, dom) {
            if (scriptIds === void 0) { scriptIds = []; }
            if (dom === void 0) { dom = document; }
            _super.call(this, contexts, CLASS_NAME);
            this.attributeBindings = [];
            // For now, we limit the implementation to only a vertex shader and a fragment shader.
            mustSatisfy('scriptIds', scriptIds.length === 2, function () { return "scriptIds must be [vsId, fsId]"; });
            this.scriptIds = scriptIds.map(function (scriptId) { return scriptId; });
            this.dom = dom;
        }
        HTMLScriptsMaterial.prototype.createProgram = function () {
            var vsId = this.scriptIds[0];
            var fsId = this.scriptIds[1];
            return programFromScripts(this.monitors, vsId, fsId, this.dom, this.attributeBindings);
        };
        return HTMLScriptsMaterial;
    })(Material);
    return HTMLScriptsMaterial;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/materials/MeshNormalMaterial',["require", "exports", '../materials/Material'], function (require, exports, Material) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'MeshNormalMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @module EIGHT
     * @class MeshNormalMaterial
     * @extends Material
     */
    var MeshNormalMaterial = (function (_super) {
        __extends(MeshNormalMaterial, _super);
        // A super call must be the first statement in the constructor when a class
        // contains initialized propertied or has parameter properties (TS2376).
        function MeshNormalMaterial(contexts) {
            _super.call(this, contexts, LOGGING_NAME);
            //
            // Perform state initialization here.
            //
        }
        MeshNormalMaterial.prototype.contextGain = function (manager) {
            console.warn(LOGGING_NAME + ' contextGain method TODO');
        };
        return MeshNormalMaterial;
    })(Material);
    return MeshNormalMaterial;
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
        Matrix3.prototype.determinant = function () {
            return 1;
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
        Matrix3.prototype.multiply = function (rhs) {
            return this.product(this, rhs);
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
        Matrix3.prototype.product = function (a, b) {
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
    /**
     * Quaternion is retained for reference only.
     * Quaternion should not be exposed.
     */
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
        Quaternion.prototype.sum = function (a, b) {
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
        Quaternion.prototype.lerp = function (target, alpha) {
            this.x += (target.x - this.x) * alpha;
            this.y += (target.y - this.y) * alpha;
            this.z += (target.z - this.z) * alpha;
            this.w += (target.w - this.w) * alpha;
            return this;
        };
        Quaternion.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        Quaternion.prototype.multiply = function (q) {
            return this.product(this, q);
        };
        Quaternion.prototype.product = function (a, b) {
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
        Quaternion.prototype.rotate = function (rotor) {
            // TODO: This would require creating a temporary so we fall back to components.
            return this.product(rotor, this);
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
        Quaternion.prototype.difference = function (a, b) {
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

define('davinci-eight/math/rotor3',["require", "exports", '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    var INDEX_YZ = 0;
    var INDEX_ZX = 1;
    var INDEX_XY = 2;
    var INDEX_W = 3;
    var INDEX_A = 0;
    var INDEX_B = 1;
    var INDEX_C = 2;
    /**
     * Functional constructor for producing a Rotor3.
     * The function is named so as to avoid case-insensitive collisions with Rotor3.
     * This will be exposed as `rotor3`.
     * We only need 2 parameters because the sum of the squares of the components is 1.
     * Perhaps we should think of the third as being part of a cache?
     * Extending this idea, what if
     */
    function rotor3() {
        // For mutable classes, perhaps no-arg constructors make sense,
        // or maybe we have specialized constructors that maintain a data structure?
        // yz <=> a <=> 0
        // zx <=> b <=> 1
        // xy <=> c <=> 2
        // We choose any kind of data structure to store our state.
        var data = new VectorN([0, 0, 0, 1], false, 4);
        var self = {
            get modified() {
                return data.modified;
            },
            set modified(value) {
                data.modified = value;
            },
            get yz() {
                return data.getComponent(INDEX_YZ);
            },
            set yz(value) {
                data.setComponent(INDEX_YZ, value);
            },
            get zx() {
                return data.getComponent(INDEX_ZX);
            },
            set zx(value) {
                data.setComponent(INDEX_ZX, value);
            },
            get xy() {
                return data.getComponent(INDEX_XY);
            },
            set xy(value) {
                data.setComponent(INDEX_XY, value);
            },
            get w() {
                return data.getComponent(INDEX_W);
            },
            set w(value) {
                data.setComponent(INDEX_W, value);
            },
            copy: function (spinor) {
                self.w = spinor.w;
                self.yz = spinor.yz;
                self.zx = spinor.zx;
                self.xy = spinor.xy;
                return self;
            },
            exp: function () {
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
            },
            multiply: function (spinor) {
                return self.product(self, spinor);
            },
            multiplyScalar: function (s) {
                self.w *= s;
                self.yz *= s;
                self.zx *= s;
                self.xy *= s;
                return self;
            },
            product: function (n, m) {
                var n0 = n.w;
                var n1 = n.yz;
                var n2 = n.zx;
                var n3 = n.xy;
                var m0 = m.w;
                var m1 = m.yz;
                var m2 = m.zx;
                var m3 = m.xy;
                // TODO; We are assuming that the inputs are unit vectors!
                var W = n0 * m0 - n1 * m1 - n2 * m2 - n3 * m3;
                var A = n0 * m1 + n1 * m0 - n2 * m3 + n3 * m2;
                var B = n0 * m2 + n1 * m3 + n2 * m0 - n3 * m1;
                var C = n0 * m3 - n1 * m2 + n2 * m1 + n3 * m0;
                var magnitude = Math.sqrt(W * W + A * A + B * B + C * C);
                self.w = W / magnitude;
                self.yz = A / magnitude;
                self.zx = B / magnitude;
                self.xy = C / magnitude;
                return self;
            },
            reverse: function () {
                self.yz *= -1;
                self.zx *= -1;
                self.xy *= -1;
                return self;
            },
            toString: function () {
                return ['Rotor3 => ', JSON.stringify({ yz: self.yz, zx: self.zx, xy: self.xy, w: self.w })].join('');
            },
            wedgeVectors: function (a, b) {
                var ax = a.x, ay = a.y, az = a.z;
                var bx = b.x, by = b.y, bz = b.z;
                this.w = 0;
                this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
                this.zx = wedgeZX(ax, ay, az, bx, by, bz);
                this.xy = wedgeXY(ax, ay, az, bx, by, bz);
                return this;
            }
        };
        return self;
    }
    return rotor3;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/math/Spinor3',["require", "exports", '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
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
        Spinor3.prototype.sum = function (a, b) {
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
        Spinor3.prototype.lerp = function (target, alpha) {
            this.xy += (target.xy - this.xy) * alpha;
            this.yz += (target.yz - this.yz) * alpha;
            this.zx += (target.zx - this.zx) * alpha;
            this.w += (target.w - this.w) * alpha;
            return this;
        };
        Spinor3.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        Spinor3.prototype.multiply = function (rhs) {
            return this.product(this, rhs);
        };
        Spinor3.prototype.product = function (a, b) {
            var a0 = a.w;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.w;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
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
        Spinor3.prototype.reverse = function () {
            this.yz *= -1;
            this.zx *= -1;
            this.xy *= -1;
            return this;
        };
        Spinor3.prototype.rotate = function (rotor) {
            return this;
        };
        Spinor3.prototype.sub = function (rhs) {
            return this;
        };
        Spinor3.prototype.difference = function (a, b) {
            return this;
        };
        Spinor3.prototype.wedgeVectors = function (a, b) {
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.w = 0;
            this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY(ax, ay, az, bx, by, bz);
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
        Vector4.prototype.sum = function (a, b) {
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
        Vector4.prototype.lerp = function (target, alpha) {
            this.x += (target.x - this.x) * alpha;
            this.y += (target.y - this.y) * alpha;
            this.z += (target.z - this.z) * alpha;
            this.w += (target.w - this.w) * alpha;
            return this;
        };
        Vector4.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            this.w *= scalar;
            return this;
        };
        Vector4.prototype.rotate = function (rotor) {
            return this;
        };
        Vector4.prototype.sub = function (rhs) {
            return this;
        };
        Vector4.prototype.difference = function (a, b) {
            return this;
        };
        return Vector4;
    })(VectorN);
    return Vector4;
});

define('davinci-eight/mesh/ArrowBuilder',["require", "exports", '../checks/expectArg', '../checks/isUndefined', '../math/Vector3', '../core/Symbolic'], function (require, exports, expectArg, isUndefined, Vector3, Symbolic) {
    /**
     * @class ArrowBuilder
     */
    var ArrowBuilder = (function () {
        function ArrowBuilder(options) {
            this.$axis = Vector3.e3.clone();
            options = options || { modelMatrix: Symbolic.UNIFORM_MODEL_MATRIX };
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
        return ArrowBuilder;
    })();
    return ArrowBuilder;
});

define('davinci-eight/mesh/CylinderArgs',["require", "exports", '../checks/expectArg', '../checks/isUndefined', '../math/Vector3', '../core/Symbolic'], function (require, exports, expectArg, isUndefined, Vector3, Symbolic) {
    /**
     * @class CylinderArgs
     */
    var CylinderArgs = (function () {
        function CylinderArgs(options) {
            this.$axis = Vector3.e3.clone();
            options = options || { modelMatrix: Symbolic.UNIFORM_MODEL_MATRIX };
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

define('davinci-eight/utils/Model',["require", "exports", '../math/Matrix3', '../math/Matrix4', '../math/rotor3', '../core/Symbolic', '../math/Vector3'], function (require, exports, Matrix3, Matrix4, rotor3, Symbolic, Vector3) {
    /**
     * Model implements UniformData required for manipulating a body.
     */
    var Model = (function () {
        function Model() {
            this.position = new Vector3();
            this.attitude = rotor3();
            this.scale = new Vector3([1, 1, 1]);
            this.color = new Vector3([1, 1, 1]);
            this.M = Matrix4.identity();
            this.N = Matrix3.identity();
            this.R = Matrix4.identity();
            this.S = Matrix4.identity();
            this.T = Matrix4.identity();
            this.position.modified = true;
            this.attitude.modified = true;
            this.scale.modified = true;
            this.color.modified = true;
        }
        Model.prototype.accept = function (visitor) {
            if (this.position.modified) {
                this.T.translation(this.position);
                this.position.modified = false;
            }
            if (this.attitude.modified) {
                this.R.rotation(this.attitude);
                this.attitude.modified = false;
            }
            if (this.scale.modified) {
                this.S.scaling(this.scale);
                this.scale.modified = false;
            }
            this.M.copy(this.T).multiply(this.R).multiply(this.S);
            this.N.normalFromMatrix4(this.M);
            visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.M);
            visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.N);
            visitor.uniformVector3(Symbolic.UNIFORM_COLOR, this.color);
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
define('davinci-eight',["require", "exports", 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/frustumMatrix', 'davinci-eight/cameras/perspective', 'davinci-eight/cameras/perspectiveMatrix', 'davinci-eight/cameras/view', 'davinci-eight/cameras/viewMatrix', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Face3', 'davinci-eight/core/Symbolic', 'davinci-eight/core/UniformLocation', 'davinci-eight/curves/Curve', 'davinci-eight/dfx/DrawAttribute', 'davinci-eight/dfx/DrawElements', 'davinci-eight/dfx/Simplex', 'davinci-eight/dfx/Vertex', 'davinci-eight/dfx/checkGeometry', 'davinci-eight/dfx/computeFaceNormals', 'davinci-eight/dfx/cube', 'davinci-eight/dfx/quadrilateral', 'davinci-eight/dfx/square', 'davinci-eight/dfx/tetrahedron', 'davinci-eight/dfx/toDrawElements', 'davinci-eight/dfx/triangle', 'davinci-eight/scene/createDrawList', 'davinci-eight/scene/Mesh', 'davinci-eight/scene/PerspectiveCamera', 'davinci-eight/scene/Scene', 'davinci-eight/scene/WebGLRenderer', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/BoxComplex', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/programFromScripts', 'davinci-eight/materials/Material', 'davinci-eight/materials/HTMLScriptsMaterial', 'davinci-eight/materials/MeshNormalMaterial', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Quaternion', 'davinci-eight/math/rotor3', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector1', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/math/Vector4', 'davinci-eight/math/VectorN', 'davinci-eight/mesh/ArrowBuilder', 'davinci-eight/mesh/CylinderArgs', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/utils/contextProxy', 'davinci-eight/utils/Model', 'davinci-eight/utils/refChange', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, frustum, frustumMatrix, perspective, perspectiveMatrix, view, viewMatrix, AttribLocation, Color, core, DrawMode, Face3, Symbolic, UniformLocation, Curve, DrawAttribute, DrawElements, Simplex, Vertex, checkGeometry, computeFaceNormals, cube, quadrilateral, square, tetrahedron, toDrawElements, triangle, createDrawList, Mesh, PerspectiveCamera, Scene, WebGLRenderer, Geometry, BoxComplex, shaderProgram, smartProgram, programFromScripts, Material, HTMLScriptsMaterial, MeshNormalMaterial, Matrix3, Matrix4, Quaternion, rotor3, Spinor3, Vector1, Vector2, Vector3, Vector4, VectorN, ArrowBuilder, CylinderArgs, initWebGL, renderer, contextProxy, Model, refChange, workbench3D, windowAnimationRunner) {
    /**
     * @module EIGHT
     */
    var eight = {
        /**
         * The publish date of the latest version of the library.
         * @property LAST_AUTHORED_DATE
         * @type string
         */
        get LAST_AUTHORED_DATE() { return core.LAST_AUTHORED_DATE; },
        /**
         * The semantic version of the library.
         * @property VERSION
         * @type string
         */
        get VERSION() { return core.VERSION; },
        // TODO: Arrange in alphabetical order in order to assess width of API.
        // materials
        get HTMLScriptsMaterial() { return HTMLScriptsMaterial; },
        get Material() { return Material; },
        get MeshNormalMaterial() { return MeshNormalMaterial; },
        get initWebGL() { return initWebGL; },
        get Model() { return Model; },
        get Simplex() { return Simplex; },
        get Vertex() { return Vertex; },
        get frustum() { return frustum; },
        get frustumMatrix() { return frustumMatrix; },
        get perspective() { return perspective; },
        get perspectiveMatrix() { return perspectiveMatrix; },
        get view() { return view; },
        get viewMatrix() { return viewMatrix; },
        get Scene() { return Scene; },
        get Mesh() { return Mesh; },
        get PerspectiveCamera() { return PerspectiveCamera; },
        get WebGLRenderer() { return WebGLRenderer; },
        get createDrawList() { return createDrawList; },
        get renderer() { return renderer; },
        get webgl() { return contextProxy; },
        workbench: workbench3D,
        animation: windowAnimationRunner,
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
        get Geometry() { return Geometry; },
        //  get ArrowGeometry() { return ArrowGeometry; },
        //  get BarnGeometry() { return BarnGeometry; },
        get BoxComplex() { return BoxComplex; },
        //  get CylinderGeometry() { return CylinderGeometry; },
        //  get DodecahedronGeometry() { return DodecahedronGeometry; },
        //  get EllipticalCylinderGeometry() { return EllipticalCylinderGeometry; },
        //  get IcosahedronGeometry() { return IcosahedronGeometry; },
        //  get KleinBottleGeometry() { return KleinBottleGeometry; },
        //  get MobiusStripGeometry() { return MobiusStripGeometry; },
        //  get OctahedronGeometry() { return OctahedronGeometry; },
        //  get SurfaceGeometry() { return SurfaceGeometry; },
        //  get PolyhedronGeometry() { return PolyhedronGeometry; },
        //  get RevolutionGeometry() { return RevolutionGeometry; },
        //  get SphereGeometry() { return SphereGeometry; },
        //  get TetrahedronGeometry() { return TetrahedronGeometry; },
        //  get TubeGeometry() { return TubeGeometry; },
        //  get VortexGeometry() { return VortexGeometry; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get rotor3() { return rotor3; },
        get Spinor3() { return Spinor3; },
        get Quaternion() { return Quaternion; },
        get Vector1() { return Vector1; },
        get Vector2() { return Vector2; },
        get Vector3() { return Vector3; },
        get Vector4() { return Vector4; },
        get VectorN() { return VectorN; },
        get Curve() { return Curve; },
        // mesh
        get ArrowBuilder() { return ArrowBuilder; },
        get checkGeometry() { return checkGeometry; },
        get computeFaceNormals() { return computeFaceNormals; },
        get cube() { return cube; },
        get quadrilateral() { return quadrilateral; },
        get square() { return square; },
        get tetrahedron() { return tetrahedron; },
        get triangle() { return triangle; },
        get toDrawElements() { return toDrawElements; },
        get CylinderArgs() { return CylinderArgs; },
        get Symbolic() { return Symbolic; },
        // programs
        get programFromScripts() { return programFromScripts; },
        get DrawAttribute() { return DrawAttribute; },
        get DrawElements() { return DrawElements; },
        // utils
        get refChange() { return refChange; }
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
