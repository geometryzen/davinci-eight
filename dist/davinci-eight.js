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

define('davinci-eight/core',["require", "exports"], function (require, exports) {
    var core = {
        VERSION: '2.8.0'
    };
    return core;
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

define('davinci-blade/Euclidean3',["require", "exports", 'davinci-blade/NotImplementedError', 'davinci-blade/Unit'], function (require, exports, NotImplementedError, Unit) {
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
                return this.add(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__radd__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).add(this);
            }
        };
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
                return this.sub(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rsub__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).sub(this);
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
                return this.mul(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rmul__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.mul(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).mul(this);
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
                return this.div(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rdiv__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.div(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).div(this);
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
                return this.splat(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rvbar__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.splat(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).splat(this);
            }
        };
        Euclidean3.prototype.__wedge__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.wedge(other);
            }
            else if (typeof other === 'number') {
                return this.wedge(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rwedge__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.wedge(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).wedge(this);
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
                return this.lshift(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rlshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.lshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).lshift(this);
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
                return this.rshift(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rrshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.rshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).rshift(this);
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
        Euclidean3.prototype.length = function () {
            return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz);
        };
        Euclidean3.prototype.cos = function () {
            Unit.assertDimensionless(this.uom);
            var cosW = Math.cos(this.w);
            return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0, undefined);
        };
        Euclidean3.prototype.cosh = function () {
            throw new NotImplementedError('cosh(Euclidean3)');
        };
        Euclidean3.prototype.exp = function () {
            throw new NotImplementedError('exp(Euclidean3)');
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
            throw new Euclidean3Error('sin');
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

define('davinci-eight/math/e3ga/scalarE3',["require", "exports", "davinci-blade/Euclidean3"], function (require, exports, Euclidean3) {
    var scalarE3 = function (w) {
        return new Euclidean3(w, 0, 0, 0, 0, 0, 0, 0);
    };
    return scalarE3;
});

define('davinci-eight/math/e3ga/vectorE3',["require", "exports", "davinci-blade/Euclidean3"], function (require, exports, Euclidean3) {
    /**
     * Constructs and returns a Euclidean 3D vector from its cartesian components.
     * @param x The x component of the vector.
     * @param y The y component of the vector.
     * @param z The z component of the vector.
     */
    var vectorE3 = function (x, y, z) {
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0);
    };
    return vectorE3;
});
// Remarks
// 1. The amd-dependency causes the correct AMD dependency array and variable name.
// 2. The declare var just keeps the TypeScript compiler happy beacuse this code does not know about Euclidean3.
// 3. The 'any' is required because specifying blade.Euclidean3 does not seem to describe the constructor.
// With the aforementioned, we get a clean compile. 
;
define('davinci-eight/core/object3D',["require", "exports", 'davinci-eight/math/e3ga/scalarE3', 'davinci-eight/math/e3ga/vectorE3'], function (require, exports, scalarE3, vectorE3) {
    var object3D = function () {
        var publicAPI = {
            position: vectorE3(0, 0, 0),
            attitude: scalarE3(1),
        };
        return publicAPI;
    };
    return object3D;
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
define('davinci-eight/math/Matrix4',["require", "exports", "gl-matrix"], function (require, exports, glMatrix) {
    /// <reference path="../../../src/gl-matrix.d.ts" />
    var Matrix4 = (function () {
        function Matrix4() {
            this.elements = glMatrix.mat4.create();
        }
        Matrix4.prototype.identity = function () {
            glMatrix.mat4.identity(this.elements);
        };
        Matrix4.prototype.makePerspective = function (fov, aspect, near, far) {
            glMatrix.mat4.perspective(this.elements, fov * Math.PI / 180, aspect, near, far);
        };
        Matrix4.prototype.translate = function (position) {
            glMatrix.mat4.translate(this.elements, this.elements, [position.x, position.y, position.z]);
        };
        Matrix4.prototype.rotate = function (rotation) {
            glMatrix.mat4.fromQuat(this.elements, [rotation.yz, rotation.zx, rotation.xy, rotation.w]);
        };
        Matrix4.prototype.mul = function (matrix) {
            glMatrix.mat4.mul(this.elements, this.elements, matrix.elements);
        };
        return Matrix4;
    })();
    return Matrix4;
});

define('davinci-eight/cameras/Camera',["require", "exports", '../math/Matrix4'], function (require, exports, Matrix4) {
    var UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    var UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';
    var Camera = (function () {
        function Camera(spec) {
            this.projectionMatrix = new Matrix4();
        }
        Camera.prototype.getUniformMatrix3 = function (name) {
            return null;
        };
        Camera.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case UNIFORM_PROJECTION_MATRIX_NAME: {
                    var value = new Float32Array(this.projectionMatrix.elements);
                    return { transpose: false, matrix4: value };
                }
                default: {
                    return null;
                }
            }
        };
        Camera.getUniformMetaInfo = function () {
            return { projectionMatrix: { name: UNIFORM_PROJECTION_MATRIX_NAME, type: UNIFORM_PROJECTION_MATRIX_TYPE } };
        };
        return Camera;
    })();
    return Camera;
});

define('davinci-eight/cameras/camera',["require", "exports", "gl-matrix", 'davinci-eight/core/object3D'], function (require, exports, glMatrix, object3D) {
    /**
     * @class camera
     */
    var camera = function () {
        var base = object3D();
        var projectionMatrix = glMatrix.mat4.create();
        var that = {
            // Delegate to the base camera.
            get position() { return base.position; },
            set position(value) { base.position = value; },
            get attitude() { return base.attitude; },
            set attitude(value) { base.attitude = value; },
            get projectionMatrix() { return projectionMatrix; }
        };
        return that;
    };
    return camera;
});

define('davinci-eight/cameras/perspectiveCamera',["require", "exports", "gl-matrix", 'davinci-eight/cameras/camera'], function (require, exports, glMatrix, camera) {
    var perspectiveCamera = function (fov, aspect, near, far) {
        if (fov === void 0) { fov = 75 * Math.PI / 180; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 2000; }
        var base = camera();
        function updateProjectionMatrix() {
            glMatrix.mat4.perspective(base.projectionMatrix, fov, aspect, near, far);
        }
        updateProjectionMatrix();
        var publicAPI = {
            // Delegate to the base camera.
            get position() { return base.position; },
            set position(value) { base.position = value; },
            get attitude() { return base.attitude; },
            set attitude(value) { base.attitude = value; },
            // Extensions
            get aspect() { return aspect; },
            set aspect(value) {
                aspect = value;
                updateProjectionMatrix();
            },
            get projectionMatrix() { return base.projectionMatrix; }
        };
        return publicAPI;
    };
    return perspectiveCamera;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('davinci-eight/cameras/PerspectiveCamera',["require", "exports", './Camera'], function (require, exports, Camera) {
    /**
     *
     */
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(fov, aspect, near, far) {
            if (fov === void 0) { fov = 75; }
            if (aspect === void 0) { aspect = 1; }
            if (near === void 0) { near = 0.1; }
            if (far === void 0) { far = 2000; }
            _super.call(this);
            this.projectionMatrix.makePerspective(fov, aspect, near, far);
        }
        return PerspectiveCamera;
    })(Camera);
    return PerspectiveCamera;
});

define('davinci-eight/scenes/scene',["require", "exports", 'davinci-eight/core/object3D'], function (require, exports, object3D) {
    var scene = function () {
        var drawables = [];
        var drawGroups = {};
        // TODO: What do we want out of the base object3D?
        var base = object3D();
        var gl;
        var contextId;
        var that = {
            get drawGroups() { return drawGroups; },
            get children() { return drawables; },
            contextFree: function (context) {
                for (var i = 0, length = drawables.length; i < length; i++) {
                    drawables[i].contextFree(context);
                }
            },
            contextGain: function (context, contextId) {
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
        return that;
    };
    return scene;
});

define('davinci-eight/renderers/webGLRenderer',["require", "exports"], function (require, exports) {
    var FrameworkDrawContext = (function () {
        function FrameworkDrawContext() {
            this.startTime = Date.now();
            this.frameTime = 0;
        }
        FrameworkDrawContext.prototype.time = function () {
            return this.frameTime;
        };
        FrameworkDrawContext.prototype.frameBegin = function () {
        };
        FrameworkDrawContext.prototype.frameEnd = function () {
            this.frameTime = Date.now() - this.startTime;
        };
        return FrameworkDrawContext;
    })();
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
    var renderer = function (parameters) {
        parameters = parameters || {};
        var canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');
        var alpha = parameters.alpha !== undefined ? parameters.alpha : false;
        var depth = parameters.depth !== undefined ? parameters.depth : true;
        var stencil = parameters.stencil !== undefined ? parameters.stencil : true;
        var antialias = parameters.antialias !== undefined ? parameters.antialias : false;
        var premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
        var preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;
        var drawContext = new FrameworkDrawContext();
        var context;
        var contextGainId;
        var devicePixelRatio = 1;
        var autoClearColor = true;
        var autoClearDepth = true;
        function setViewport(x, y, width, height) {
            if (context) {
                context.viewport(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, height * devicePixelRatio);
            }
        }
        var publicAPI = {
            get canvas() { return canvas; },
            get context() { return context; },
            contextFree: function () {
                context = void 0;
            },
            contextGain: function (contextArg, contextGainId) {
                context = contextArg;
                context.clearColor(32 / 256, 32 / 256, 32 / 256, 1.0);
                context.enable(context.DEPTH_TEST);
            },
            contextLoss: function () {
            },
            hasContext: function () {
                return !!context;
            },
            clearColor: function (r, g, b, a) {
                if (context) {
                    context.clearColor(r, g, b, a);
                }
            },
            render: function (scene, ambientUniforms) {
                drawContext.frameBegin();
                context.clearColor(0.8, 0.8, 0.8, 1.0);
                context.enable(context.DEPTH_TEST);
                context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
                var drawGroups = {};
                if (!scene.hasContext()) {
                    scene.contextGain(context, contextGainId);
                }
                var programLoaded;
                var time = drawContext.time();
                var drawHandler = function (drawable, index) {
                    if (!programLoaded) {
                        drawable.useProgram(context);
                        programLoaded = true;
                    }
                    drawable.draw(context, time, ambientUniforms);
                };
                for (var drawGroupName in scene.drawGroups) {
                    programLoaded = false;
                    scene.drawGroups[drawGroupName].forEach(drawHandler);
                }
            },
            setViewport: setViewport,
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
        context = initWebGL(canvas, attributes);
        contextGainId = Math.random().toString();
        setViewport(0, 0, canvas.width, canvas.height);
        return publicAPI;
    };
    return renderer;
});

define('davinci-eight/objects/ShaderAttributeVariable',["require", "exports"], function (require, exports) {
    /// <reference path="../geometries/Geometry.d.ts" />
    function computeUsage(geometry, context) {
        return geometry.dynamic() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
    }
    function existsLocation(location) {
        return location >= 0;
    }
    /**
     * Utility class for managing a shader attribute variable.
     */
    var ShaderAttributeVariable = (function () {
        function ShaderAttributeVariable(name, size, normalized, stride, offset) {
            this.name = name;
            this.size = size;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
        }
        ShaderAttributeVariable.prototype.contextFree = function (context) {
            if (this.buffer) {
                context.deleteBuffer(this.buffer);
                this.contextLoss();
            }
        };
        ShaderAttributeVariable.prototype.contextGain = function (context, program) {
            this.location = context.getAttribLocation(program, this.name);
            if (existsLocation(this.location)) {
                this.buffer = context.createBuffer();
            }
        };
        ShaderAttributeVariable.prototype.contextLoss = function () {
            this.location = void 0;
            this.buffer = void 0;
        };
        // Not really bind so much as describing
        ShaderAttributeVariable.prototype.bind = function (context) {
            if (existsLocation(this.location)) {
                // TODO: We could assert that we have a buffer.
                context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
                // 6.14 Fixed point support.
                // The WebGL API does not support the GL_FIXED data type.
                // Consequently, we hard-code the FLOAT constant.
                context.vertexAttribPointer(this.location, this.size, context.FLOAT, this.normalized, this.stride, this.offset);
            }
        };
        ShaderAttributeVariable.prototype.bufferData = function (context, geometry) {
            if (existsLocation(this.location)) {
                var data = geometry.getVertexAttributeData(this.name);
                if (data) {
                    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
                    context.bufferData(context.ARRAY_BUFFER, data, computeUsage(geometry, context));
                }
                else {
                    // We expect this to be detected by the mesh long before we get here.
                    throw new Error("Geometry implementation claims to support but does not provide data for attribute " + this.name);
                }
            }
        };
        ShaderAttributeVariable.prototype.enable = function (context) {
            if (existsLocation(this.location)) {
                context.enableVertexAttribArray(this.location);
            }
        };
        ShaderAttributeVariable.prototype.disable = function (context) {
            if (existsLocation(this.location)) {
                context.disableVertexAttribArray(this.location);
            }
        };
        return ShaderAttributeVariable;
    })();
    return ShaderAttributeVariable;
});

define('davinci-eight/objects/ElementArray',["require", "exports"], function (require, exports) {
    /// <reference path="../geometries/Geometry.d.ts" />
    function computeUsage(geometry, context) {
        return geometry.dynamic() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
    }
    /**
     * Manages the (optional) WebGLBuffer used to support gl.drawElements().
     */
    var ElementArray = (function () {
        function ElementArray(geometry) {
            this.geometry = geometry;
        }
        ElementArray.prototype.contextFree = function (context) {
            if (this.buffer) {
                context.deleteBuffer(this.buffer);
                this.buffer = void 0;
            }
        };
        ElementArray.prototype.contextGain = function (context) {
            if (this.geometry.hasElements()) {
                this.buffer = context.createBuffer();
            }
        };
        ElementArray.prototype.contextLoss = function () {
            this.buffer = void 0;
        };
        ElementArray.prototype.bufferData = function (context, geometry) {
            if (this.buffer) {
                var elements = geometry.getElements();
                context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.buffer);
                var usage = computeUsage(geometry, context);
                context.bufferData(context.ELEMENT_ARRAY_BUFFER, elements, usage);
            }
        };
        ElementArray.prototype.bind = function (context) {
            if (this.buffer) {
                context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.buffer);
            }
        };
        return ElementArray;
    })();
    return ElementArray;
});

define('davinci-eight/objects/ShaderUniformVariable',["require", "exports"], function (require, exports) {
    /**
     * Utility class for managing a shader uniform variable.
     */
    var ShaderUniformVariable = (function () {
        function ShaderUniformVariable(name, type) {
            this.name = name;
            this.type = type;
            switch (type) {
                case 'mat3':
                case 'mat4':
                    {
                    }
                    break;
                default: {
                    throw new Error("Illegal argument type: " + type);
                }
            }
        }
        ShaderUniformVariable.prototype.contextGain = function (context, program) {
            this.location = context.getUniformLocation(program, this.name);
        };
        ShaderUniformVariable.prototype.matrix = function (context, transpose, matrix) {
            switch (this.type) {
                case 'mat3':
                    {
                        context.uniformMatrix3fv(this.location, transpose, matrix);
                    }
                    break;
                case 'mat4':
                    {
                        context.uniformMatrix4fv(this.location, transpose, matrix);
                    }
                    break;
                default: {
                    throw new Error("Illegal argument type: " + this.type);
                }
            }
        };
        ShaderUniformVariable.prototype.toString = function () {
            return [this.type, this.name].join(' ');
        };
        return ShaderUniformVariable;
    })();
    return ShaderUniformVariable;
});

define('davinci-eight/objects/ChainedUniformProvider',["require", "exports"], function (require, exports) {
    /// <reference path='../renderers/UniformProvider.d.ts'/>
    var ChainedUniformProvider = (function () {
        function ChainedUniformProvider(provider, fallback) {
            this.provider = provider;
            this.fallback = fallback;
        }
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
        return ChainedUniformProvider;
    })();
    return ChainedUniformProvider;
});

define('davinci-eight/objects/mesh',["require", "exports", './ShaderAttributeVariable', 'davinci-eight/core/object3D', 'davinci-eight/objects/ElementArray', 'davinci-eight/objects/ShaderUniformVariable', './ChainedUniformProvider'], function (require, exports, ShaderAttributeVariable, object3D, ElementArray, ShaderUniformVariable, ChainedUniformProvider) {
    var mesh = function (geometry, material, meshUniforms) {
        /**
         * Find an attribute by its code name rather than its semantic role (which is the key in AttributeMetaInfos)
         */
        function findAttributeByVariableName(name, attributes) {
            for (var key in attributes) {
                var attribute = attributes[key];
                if (attribute.name === name) {
                    return attribute;
                }
            }
        }
        /**
         * Constructs a ShaderAttributeVariable from a declaration.
         */
        function vertexAttrib(declaration) {
            var name = declaration.name;
            var attribute = findAttributeByVariableName(name, geometry.getAttributeMetaInfos());
            if (attribute) {
                var size = attribute.size;
                var normalized = attribute.normalized;
                var stride = attribute.stride;
                var offset = attribute.offset;
                // TODO: Maybe type should be passed along?
                return new ShaderAttributeVariable(name, size, normalized, stride, offset);
            }
            else {
                throw new Error("The geometry does not support the attribute variable named " + name);
            }
        }
        /**
         * Constructs a ShaderUniformVariable from a declaration.
         */
        function shaderUniformFromDecl(declaration) {
            var modifiers = declaration.modifiers;
            var type = declaration.type;
            var name = declaration.name;
            return new ShaderUniformVariable(name, type);
        }
        var base = object3D();
        var contextGainId;
        var elements = new ElementArray(geometry);
        var vertexAttributes = material.attributes.map(vertexAttrib);
        var uniformVariables = material.uniforms.map(shaderUniformFromDecl);
        if (uniformVariables.length > 0) {
            if (typeof meshUniforms === 'undefined') {
                throw new Error('meshUniforms argument must be supplied for shader uniform variables.');
            }
            else {
                if (typeof meshUniforms !== 'object') {
                    throw new Error('meshUniforms must be an object.');
                }
            }
        }
        function updateGeometry(context, time) {
            // Make sure to update the geometry first so that the material gets the correct data.
            geometry.update(time, material.attributes);
            vertexAttributes.forEach(function (vertexAttribute) {
                vertexAttribute.bufferData(context, geometry);
            });
            elements.bufferData(context, geometry);
        }
        var publicAPI = {
            get geometry() {
                return geometry;
            },
            get material() {
                return material;
            },
            contextFree: function (context) {
                material.contextFree(context);
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.contextFree(context);
                });
                elements.contextFree(context);
            },
            contextGain: function (context, contextId) {
                if (contextGainId !== contextId) {
                    contextGainId = contextId;
                    material.contextGain(context, contextId);
                    // Cache the attribute variable locations.
                    vertexAttributes.forEach(function (vertexAttribute) {
                        vertexAttribute.contextGain(context, material.program);
                    });
                    elements.contextGain(context);
                    if (!geometry.dynamic()) {
                        updateGeometry(context, 0);
                    }
                    // Cache the uniform variable locations.
                    uniformVariables.forEach(function (uniformVariable) {
                        uniformVariable.contextGain(context, material.program);
                    });
                }
            },
            contextLoss: function () {
                material.contextLoss();
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.contextLoss();
                });
                elements.contextLoss();
            },
            hasContext: function () {
                return material.hasContext();
            },
            get drawGroupName() { return material.programId; },
            useProgram: function (context) {
                context.useProgram(material.program);
            },
            draw: function (context, time, ambientUniforms) {
                if (material.hasContext()) {
                    if (geometry.dynamic()) {
                        updateGeometry(context, time);
                    }
                    // Update the uniform location values.
                    uniformVariables.forEach(function (uniformVariable) {
                        if (meshUniforms) {
                            var chainedProvider = new ChainedUniformProvider(meshUniforms, ambientUniforms);
                            switch (uniformVariable.type) {
                                case 'mat3':
                                    {
                                        var m3data = chainedProvider.getUniformMatrix3(uniformVariable.name);
                                        if (m3data) {
                                            uniformVariable.matrix(context, m3data.transpose, m3data.matrix3);
                                        }
                                        else {
                                            throw new Error("Expecting data from mesh callback for uniform " + uniformVariable.name);
                                        }
                                    }
                                    break;
                                case 'mat4':
                                    {
                                        var m4data = chainedProvider.getUniformMatrix4(uniformVariable.name);
                                        if (m4data) {
                                            uniformVariable.matrix(context, m4data.transpose, m4data.matrix4);
                                        }
                                        else {
                                            throw new Error("Expecting data from mesh callback for uniform " + uniformVariable.name);
                                        }
                                    }
                                    break;
                                default: {
                                    throw new Error("uniform type => " + uniformVariable.type);
                                }
                            }
                        }
                        else {
                            // Backstop in case it's not being checked in construction
                            throw new Error("callback not supplied");
                        }
                    });
                    vertexAttributes.forEach(function (vertexAttribute) {
                        vertexAttribute.enable(context);
                    });
                    vertexAttributes.forEach(function (vertexAttribute) {
                        vertexAttribute.bind(context);
                    });
                    geometry.draw(context);
                    elements.bind(context);
                    vertexAttributes.forEach(function (vertexAttribute) {
                        vertexAttribute.disable(context);
                    });
                }
            },
            get position() { return base.position; },
            set position(position) { base.position = position; },
            get attitude() { return base.attitude; },
            set attitude(attitude) { base.attitude = attitude; }
        };
        return publicAPI;
    };
    return mesh;
});

define('davinci-eight/math/Matrix3',["require", "exports", "gl-matrix"], function (require, exports, glMatrix) {
    var Matrix3 = (function () {
        function Matrix3() {
            this.elements = glMatrix.mat3.create();
        }
        Matrix3.prototype.identity = function () {
            glMatrix.mat3.identity(this.elements);
        };
        Matrix3.prototype.normalFromMatrix4 = function (matrix) {
            glMatrix.mat3.normalFromMat4(this.elements, matrix.elements);
        };
        return Matrix3;
    })();
    return Matrix3;
});

define('davinci-eight/objects/Mesh',["require", "exports", "davinci-blade/Euclidean3", './mesh', '../math/Matrix3', '../math/Matrix4'], function (require, exports, Euclidean3, mesh, Matrix3, Matrix4) {
    function modelViewMatrix(position, attitude) {
        var matrix = new Matrix4();
        matrix.identity();
        matrix.translate(position);
        var rotation = new Matrix4();
        rotation.rotate(attitude);
        matrix.mul(rotation);
        return matrix;
    }
    var MeshUniformProvider = (function () {
        function MeshUniformProvider() {
        }
        MeshUniformProvider.prototype.getUniformMatrix3 = function (name) {
            switch (name) {
                case 'uN':
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
                    return null;
                }
            }
        };
        MeshUniformProvider.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case 'uMV':
                    {
                        var elements = modelViewMatrix(this.position, this.attitude).elements;
                        return { transpose: false, matrix4: new Float32Array(elements) };
                    }
                    break;
                default: {
                    return null;
                }
            }
        };
        return MeshUniformProvider;
    })();
    var Mesh = (function () {
        function Mesh(geometry, material) {
            this.meshUniformProvider = new MeshUniformProvider();
            this.innerMesh = mesh(geometry, material, this.meshUniformProvider);
        }
        Object.defineProperty(Mesh.prototype, "geometry", {
            get: function () {
                return this.innerMesh.geometry;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "material", {
            get: function () {
                return this.innerMesh.material;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "attitude", {
            get: function () {
                return this.innerMesh.attitude;
            },
            set: function (value) {
                this.innerMesh.attitude = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "position", {
            get: function () {
                return this.innerMesh.position;
            },
            set: function (value) {
                this.innerMesh.position = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "drawGroupName", {
            get: function () {
                return this.innerMesh.drawGroupName;
            },
            enumerable: true,
            configurable: true
        });
        Mesh.prototype.useProgram = function (context) {
            this.innerMesh.useProgram(context);
        };
        Mesh.prototype.draw = function (context, time, uniformProvider) {
            this.meshUniformProvider.position = this.innerMesh.position;
            this.meshUniformProvider.attitude = this.innerMesh.attitude;
            return this.innerMesh.draw(context, time, uniformProvider);
        };
        Mesh.prototype.contextFree = function (context) {
            return this.innerMesh.contextFree(context);
        };
        Mesh.prototype.contextGain = function (context, contextGainId) {
            return this.innerMesh.contextGain(context, contextGainId);
        };
        Mesh.prototype.contextLoss = function () {
            return this.innerMesh.contextLoss();
        };
        Mesh.prototype.hasContext = function () {
            return this.innerMesh.hasContext();
        };
        Mesh.getUniformMetaInfo = function () {
            var uniforms = {};
            uniforms['modelViewMatrix'] = { name: 'uMV', type: 'mat4' };
            uniforms['normalMatrix'] = { name: 'uN', type: 'mat3' };
            return uniforms;
        };
        return Mesh;
    })();
    return Mesh;
});

define('davinci-eight/utils/webGLContextMonitor',["require", "exports"], function (require, exports) {
    var webGLContextMonitor = function (canvas, contextFree, contextGain, contextLoss) {
        var webGLContextLost = function (event) {
            event.preventDefault();
            contextLoss();
        };
        var webGLContextRestored = function (event) {
            event.preventDefault();
            var gl = canvas.getContext('webgl');
            // Using Math.random() is good enough for now. The Birthday problem!
            contextGain(gl, Math.random().toString());
        };
        var publicAPI = {
            start: function (context) {
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                contextGain(context, Math.random().toString());
            },
            stop: function () {
                contextFree();
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
            }
        };
        return publicAPI;
    };
    return webGLContextMonitor;
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

define('davinci-eight/utils/windowAnimationRunner',["require", "exports"], function (require, exports) {
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
            }
            else {
                startTime = timestamp;
                elapsed = 0;
            }
            if (escKeyPressed || terminate(elapsed / MILLIS_PER_SECOND)) {
                escKeyPressed = false;
                win.cancelAnimationFrame(requestID);
                win.document.removeEventListener('keydown', onDocumentKeyDown, false);
                try {
                    tearDown(exception);
                }
                catch (e) {
                    console.log("Exception thrown by tearDown method. " + e);
                }
            }
            else {
                requestID = win.requestAnimationFrame(animate);
                try {
                    tick(elapsed / MILLIS_PER_SECOND);
                }
                catch (e) {
                    console.log("Exception thrown by tick method. " + e);
                    exception = e;
                    escKeyPressed = true;
                }
            }
        };
        var onDocumentKeyDown = function (event) {
            if (event.keyCode === 27) {
                escKeyPressed = true;
                event.preventDefault();
            }
            else if (event.keyCode === 19) {
                pauseKeyPressed = true;
                event.preventDefault();
            }
            else if (event.keyCode === 13) {
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

define('davinci-eight/geometries/box',["require", "exports", 'davinci-eight/math/e3ga/vectorE3'], function (require, exports, vectorE3) {
    var vertexList = [
        // front (+z) face (labelled 0, 1, 2, 3 from lower left counterclockwise from front)
        vectorE3(-0.5, -0.5, +0.5),
        vectorE3(+0.5, -0.5, +0.5),
        vectorE3(+0.5, +0.5, +0.5),
        vectorE3(-0.5, +0.5, +0.5),
        // rear (-z) face (labelled 4, 5, 6, 7 from lower left counterclockwise from front)
        vectorE3(-0.5, -0.5, -0.5),
        vectorE3(+0.5, -0.5, -0.5),
        vectorE3(+0.5, +0.5, -0.5),
        vectorE3(-0.5, +0.5, -0.5)
    ];
    var triangles = [
        // front
        [0, 1, 2],
        [0, 2, 3],
        // rear
        [4, 7, 5],
        [5, 7, 6],
        // left
        [0, 7, 4],
        [0, 3, 7],
        // right
        [1, 5, 2],
        [2, 5, 6],
        // top
        [2, 7, 3],
        [2, 6, 7],
        // bottom
        [0, 5, 1],
        [0, 4, 5]
    ];
    var box = function (spec) {
        var elements = [];
        var aVertexPositionArray;
        var aVertexColorArray;
        var aVertexNormalArray;
        var publicAPI = {
            draw: function (context) {
                context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
            },
            dynamic: function () { return false; },
            getAttributeMetaInfos: function () {
                return {
                    position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                    color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                    normal: { name: 'aVertexNormal', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
                };
            },
            hasElements: function () {
                return false;
            },
            getElements: function () {
                // We don't support element arrays (yet).
                return;
            },
            getVertexAttributeData: function (name) {
                switch (name) {
                    case 'aVertexPosition': {
                        return aVertexPositionArray;
                    }
                    case 'aVertexColor': {
                        return aVertexColorArray;
                    }
                    case 'aVertexNormal': {
                        return aVertexNormalArray;
                    }
                    default: {
                        return;
                    }
                }
            },
            update: function (time, attributes) {
                var names = attributes.map(function (attribute) { return attribute.name; });
                var requirePosition = names.indexOf('aVertexPosition') >= 0;
                var requireColor = names.indexOf('aVertexColor') >= 0;
                var requireNormal = names.indexOf('aVertexNormal') >= 0;
                // Insist that things won't work without aVertexPosition.
                // We just degrade gracefully if the other attribute arrays are not required.
                if (!requirePosition) {
                    throw new Error("Box geometry is expecting to provide aVertexPosition");
                }
                var vertices = [];
                var colors = [];
                var normals = [];
                triangles.forEach(function (triangle, index) {
                    elements.push(triangle[0]);
                    elements.push(triangle[1]);
                    elements.push(triangle[2]);
                    if (requirePosition) {
                        for (var j = 0; j < 3; j++) {
                            vertices.push(vertexList[triangle[j]].x);
                            vertices.push(vertexList[triangle[j]].y);
                            vertices.push(vertexList[triangle[j]].z);
                        }
                    }
                    if (requireColor) {
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
                    }
                    if (requireNormal) {
                        var v0 = vertexList[triangle[0]];
                        var v1 = vertexList[triangle[1]];
                        var v2 = vertexList[triangle[2]];
                        var perp = v1.sub(v0).cross(v2.sub(v0));
                        var normal = perp.div(perp.norm());
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
                if (requirePosition) {
                    aVertexPositionArray = new Float32Array(vertices);
                }
                if (requireColor) {
                    aVertexColorArray = new Float32Array(colors);
                }
                if (requireNormal) {
                    aVertexNormalArray = new Float32Array(normals);
                }
            }
        };
        return publicAPI;
    };
    return box;
});

define('davinci-eight/geometries/cuboid',["require", "exports", "davinci-blade/Euclidean3"], function (require, exports, Euclidean3) {
    var triangles = [
        // front
        [0, 1, 2],
        [0, 2, 3],
        // rear
        [4, 7, 5],
        [5, 7, 6],
        // left
        [0, 7, 4],
        [0, 3, 7],
        // right
        [1, 5, 2],
        [2, 5, 6],
        // top
        [2, 7, 3],
        [2, 6, 7],
        // bottom
        [0, 5, 1],
        [0, 4, 5]
    ];
    // TODO: We'd like to be able to use anything here and have some adapter fix the names.
    var DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME = 'aVertexPosition';
    var DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME = 'aVertexColor';
    var DEFAULT_VERTEX_ATTRIBUTE_COLOR_VALUE = [1.0, 0.0, 0.0];
    var DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME = 'aVertexNormal';
    var cuboid = function (spec) {
        function getOverride(which, prop, defaultValue, type) {
            if (spec && spec[which] && typeof spec[which][prop] === type) {
                return spec[which][prop];
            }
            else {
                return defaultValue;
            }
        }
        var VERTEX_ATTRIBUTE_POSITION = getOverride('position', 'name', DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME, 'string');
        var VERTEX_ATTRIBUTE_COLOR = getOverride('color', 'name', DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME, 'string');
        var VERTEX_ATTRIBUTE_NORMAL = getOverride('normal', 'name', DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME, 'string');
        var a = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
        var b = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
        var c = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
        var grayScale = false;
        var vertexAttributeColor = getOverride('color', 'value', DEFAULT_VERTEX_ATTRIBUTE_COLOR_VALUE, 'object');
        var elements = [];
        var aVertexPositionArray;
        var aVertexColorArray;
        var aVertexNormalArray;
        var publicAPI = {
            get a() {
                return a;
            },
            set a(value) {
                a = value;
            },
            get b() {
                return b;
            },
            set b(value) {
                b = value;
            },
            get c() {
                return c;
            },
            set c(value) {
                c = value;
            },
            get color() {
                return vertexAttributeColor;
            },
            set color(value) {
                vertexAttributeColor = value;
            },
            get grayScale() {
                return grayScale;
            },
            set grayScale(value) {
                grayScale = value;
            },
            draw: function (context) {
                context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
            },
            dynamic: function () { return false; },
            getAttributeMetaInfos: function () {
                var attribues = {};
                attribues['position'] = {
                    name: VERTEX_ATTRIBUTE_POSITION,
                    type: 'vec3',
                    size: 3,
                    normalized: false,
                    stride: 0,
                    offset: 0 };
                if (!grayScale) {
                    attribues['color'] = {
                        name: VERTEX_ATTRIBUTE_COLOR,
                        type: 'vec3',
                        size: 3,
                        normalized: false,
                        stride: 0,
                        offset: 0 };
                }
                attribues['normal'] = {
                    name: VERTEX_ATTRIBUTE_NORMAL,
                    type: 'vec3',
                    size: 3,
                    normalized: false,
                    stride: 0,
                    offset: 0 };
                return attribues;
            },
            hasElements: function () {
                return false;
            },
            getElements: function () {
                // We don't support element arrays (yet).
                return;
            },
            getVertexAttributeData: function (name) {
                switch (name) {
                    case VERTEX_ATTRIBUTE_POSITION: {
                        return aVertexPositionArray;
                    }
                    case VERTEX_ATTRIBUTE_COLOR: {
                        if (!grayScale) {
                            return aVertexColorArray;
                        }
                        else {
                            throw new Error('color requested when not available');
                        }
                    }
                    case VERTEX_ATTRIBUTE_NORMAL: {
                        return aVertexNormalArray;
                    }
                    default: {
                        return;
                    }
                }
            },
            update: function (time, attributes) {
                function computeVertexList() {
                    var vertexList = [
                        // front (+z) face (labelled 0, 1, 2, 3 from lower left counterclockwise from front)
                        c.sub(a).sub(b).scalarMultiply(0.5),
                        c.add(a).sub(b).scalarMultiply(0.5),
                        c.add(a).add(b).scalarMultiply(0.5),
                        c.sub(a).add(b).scalarMultiply(0.5),
                        // rear (-z) face (labelled 4, 5, 6, 7 from lower left counterclockwise from front)
                        c.scalarMultiply(-1).sub(a).sub(b).scalarMultiply(0.5),
                        c.scalarMultiply(-1).add(a).sub(b).scalarMultiply(0.5),
                        c.scalarMultiply(-1).add(a).add(b).scalarMultiply(0.5),
                        c.scalarMultiply(-1).sub(a).add(b).scalarMultiply(0.5)
                    ];
                    return vertexList;
                }
                var names = attributes.map(function (attribute) { return attribute.name; });
                var requirePosition = names.indexOf(VERTEX_ATTRIBUTE_POSITION) >= 0;
                var requireColor = names.indexOf(VERTEX_ATTRIBUTE_COLOR) >= 0;
                var requireNormal = names.indexOf(VERTEX_ATTRIBUTE_NORMAL) >= 0;
                // Insist that things won't work without aVertexPosition.
                // We just degrade gracefully if the other attribute arrays are not required.
                if (!requirePosition) {
                    throw new Error("Cuboid geometry is expecting to provide " + VERTEX_ATTRIBUTE_POSITION);
                }
                var vertices = [];
                var colors = [];
                var normals = [];
                var vertexList = computeVertexList();
                triangles.forEach(function (triangle, index) {
                    elements.push(triangle[0]);
                    elements.push(triangle[1]);
                    elements.push(triangle[2]);
                    if (requirePosition) {
                        for (var j = 0; j < 3; j++) {
                            vertices.push(vertexList[triangle[j]].x);
                            vertices.push(vertexList[triangle[j]].y);
                            vertices.push(vertexList[triangle[j]].z);
                        }
                    }
                    if (requireColor) {
                        colors.push(vertexAttributeColor[0]);
                        colors.push(vertexAttributeColor[1]);
                        colors.push(vertexAttributeColor[2]);
                        colors.push(vertexAttributeColor[0]);
                        colors.push(vertexAttributeColor[1]);
                        colors.push(vertexAttributeColor[2]);
                        colors.push(vertexAttributeColor[0]);
                        colors.push(vertexAttributeColor[1]);
                        colors.push(vertexAttributeColor[2]);
                    }
                    if (requireNormal) {
                        var v0 = vertexList[triangle[0]];
                        var v1 = vertexList[triangle[1]];
                        var v2 = vertexList[triangle[2]];
                        var perp = v1.sub(v0).cross(v2.sub(v0));
                        var normal = perp.div(perp.norm());
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
                if (requirePosition) {
                    aVertexPositionArray = new Float32Array(vertices);
                }
                if (requireColor) {
                    aVertexColorArray = new Float32Array(colors);
                }
                if (requireNormal) {
                    aVertexNormalArray = new Float32Array(normals);
                }
            }
        };
        return publicAPI;
    };
    return cuboid;
});

define('davinci-eight/geometries/ellipsoid',["require", "exports", "davinci-blade/Euclidean3"], function (require, exports, Euclidean3) {
    //
    // Computing the geometry of an ellipsoid (essentially a deformed sphere) is rather
    // intricate owing to the fact that the spherical coordinate parameters, theta and phi,
    // have different characteristics.
    //
    // The smallest number of segments corresponds to two tetrahedrons.
    // This is actually the worst case which occurs when theta includes the poles
    // and phi closes.
    var THETA_SEGMENTS_MINIMUM = 2;
    var PHI_SEGMENTS_MINIMUM = 3;
    // For more realism, use more segments. The complexity of computation goes as the square.
    var REALISM = 7;
    var THETA_SEGMENTS_DEFAULT = THETA_SEGMENTS_MINIMUM * REALISM;
    var PHI_SEGMENTS_DEFAULT = PHI_SEGMENTS_MINIMUM * REALISM;
    function cacheTrig(segments, start, length, cosCache, sinCache) {
        for (var index = 0; index <= segments; index++) {
            var angle = start + index * length / segments;
            cosCache.push(Math.cos(angle));
            sinCache.push(Math.sin(angle));
        }
    }
    function computeVertex(a, b, c, cosTheta, sinTheta, cosPhi, sinPhi) {
        // Optimize for the north and south pole by simplifying the calculation.
        // This has no other effect than for performance.
        var optimize = false;
        var northPole = optimize && (cosTheta === +1);
        var southPole = optimize && (cosTheta === -1);
        if (northPole) {
            return b;
        }
        else if (southPole) {
            return b.scalarMultiply(-1);
        }
        else {
            var A = a.scalarMultiply(cosPhi).scalarMultiply(sinTheta);
            var B = b.scalarMultiply(cosTheta);
            var C = c.scalarMultiply(sinPhi).scalarMultiply(sinTheta);
            return A.add(B).add(C);
        }
    }
    var ellipsoid = function (spec) {
        var a = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
        var b = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
        var c = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
        var thetaSegments = THETA_SEGMENTS_DEFAULT;
        var thetaStart = 0;
        var thetaLength = Math.PI;
        var phiSegments = PHI_SEGMENTS_DEFAULT;
        var phiStart = 0;
        var phiLength = 2 * Math.PI;
        var elements = [];
        var triangles = [];
        var aVertexPositionArray;
        var aVertexColorArray;
        var aVertexNormalArray;
        var publicAPI = {
            get a() {
                return a;
            },
            set a(value) {
                a = value;
            },
            get b() {
                return b;
            },
            set b(value) {
                b = value;
            },
            get c() {
                return c;
            },
            set c(value) {
                c = value;
            },
            get thetaSegments() {
                return thetaSegments;
            },
            set thetaSegments(value) {
                thetaSegments = Math.max(THETA_SEGMENTS_MINIMUM, Math.floor(value) || THETA_SEGMENTS_DEFAULT);
            },
            get thetaStart() {
                return thetaStart;
            },
            set thetaStart(value) {
                thetaStart = value;
            },
            get thetaLength() {
                return thetaLength;
            },
            set thetaLength(value) {
                thetaLength = Math.max(0, Math.min(value, Math.PI));
            },
            get phiSegments() {
                return phiSegments;
            },
            set phiSegments(value) {
                phiSegments = Math.max(PHI_SEGMENTS_MINIMUM, Math.floor(value) || PHI_SEGMENTS_DEFAULT);
            },
            get phiStart() {
                return phiStart;
            },
            set phiStart(value) {
                phiStart = value;
            },
            get phiLength() {
                return phiLength;
            },
            set phiLength(value) {
                phiLength = Math.max(0, Math.min(value, 2 * Math.PI));
            },
            draw: function (context) {
                context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
            },
            dynamic: function () { return false; },
            getAttributeMetaInfos: function () {
                return {
                    position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                    color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                    normal: { name: 'aVertexNormal', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
                };
            },
            hasElements: function () {
                return false;
            },
            getElements: function () {
                // We don't support element arrays (yet).
                return;
            },
            getVertexAttributeData: function (name) {
                switch (name) {
                    case 'aVertexPosition': {
                        return aVertexPositionArray;
                    }
                    case 'aVertexColor': {
                        return aVertexColorArray;
                    }
                    case 'aVertexNormal': {
                        return aVertexNormalArray;
                    }
                    default: {
                        return;
                    }
                }
            },
            update: function (time, attributes) {
                // This function depends on how the vertexList is computed.
                function vertexIndex(thetaIndex, phiIndex) {
                    return thetaIndex * (phiSegments + 1) + phiIndex;
                }
                function computeVertexList(cosThetaCache, sinThetaCache, cosPhiCache, sinPhiCache) {
                    var vertexList = [];
                    var cosTheta;
                    var sinTheta;
                    var cosPhi;
                    var sinPhi;
                    for (var thetaIndex = 0; thetaIndex <= thetaSegments; thetaIndex++) {
                        cosTheta = cosThetaCache[thetaIndex];
                        sinTheta = sinThetaCache[thetaIndex];
                        // We compute more phi points because phi may not return back to the start.
                        for (var phiIndex = 0; phiIndex <= phiSegments; phiIndex++) {
                            cosPhi = cosPhiCache[phiIndex];
                            sinPhi = sinPhiCache[phiIndex];
                            vertexList.push(computeVertex(a, b, c, cosTheta, sinTheta, cosPhi, sinPhi));
                        }
                    }
                    return vertexList;
                }
                function computeTriangles() {
                    var faces = [];
                    for (var thetaIndex = 0; thetaIndex < thetaSegments; thetaIndex++) {
                        for (var phiIndex = 0; phiIndex < phiSegments; phiIndex++) {
                            var index1 = vertexIndex(thetaIndex, phiIndex);
                            var index2 = vertexIndex(thetaIndex, phiIndex + 1);
                            var index3 = vertexIndex(thetaIndex + 1, phiIndex + 1);
                            var index4 = vertexIndex(thetaIndex + 1, phiIndex);
                            faces.push([index1, index2, index3]);
                            faces.push([index1, index3, index4]);
                        }
                    }
                    return faces;
                }
                var names = attributes.map(function (attribute) { return attribute.name; });
                var requirePosition = names.indexOf('aVertexPosition') >= 0;
                var requireColor = names.indexOf('aVertexColor') >= 0;
                var requireNormal = names.indexOf('aVertexNormal') >= 0;
                // Insist that things won't work without aVertexPosition.
                // We just degrade gracefully if the other attribute arrays are not required.
                if (!requirePosition) {
                    throw new Error("Box geometry is expecting to provide aVertexPosition");
                }
                var vertices = [];
                var colors = [];
                var normals = [];
                // Cache values of cosine and sine of theta and phi.
                var cosThetaCache = [];
                var sinThetaCache = [];
                cacheTrig(thetaSegments, thetaStart, thetaLength, cosThetaCache, sinThetaCache);
                var cosPhiCache = [];
                var sinPhiCache = [];
                cacheTrig(phiSegments, phiStart, phiLength, cosPhiCache, sinPhiCache);
                var vertexList = computeVertexList(cosThetaCache, sinThetaCache, cosPhiCache, sinPhiCache);
                triangles = computeTriangles();
                triangles.forEach(function (triangle, index) {
                    elements.push(triangle[0]);
                    elements.push(triangle[1]);
                    elements.push(triangle[2]);
                    if (requirePosition) {
                        for (var j = 0; j < 3; j++) {
                            vertices.push(vertexList[triangle[j]].x);
                            vertices.push(vertexList[triangle[j]].y);
                            vertices.push(vertexList[triangle[j]].z);
                        }
                    }
                    if (requireColor) {
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
                        colors.push(0.0);
                        colors.push(0.0);
                        colors.push(1.0);
                    }
                    if (requireNormal) {
                        var v0 = vertexList[triangle[0]];
                        var v1 = vertexList[triangle[1]];
                        var v2 = vertexList[triangle[2]];
                        var perp = v1.sub(v0).cross(v2.sub(v0));
                        var normal = perp.div(perp.norm());
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
                if (requirePosition) {
                    aVertexPositionArray = new Float32Array(vertices);
                }
                if (requireColor) {
                    aVertexColorArray = new Float32Array(colors);
                }
                if (requireNormal) {
                    aVertexNormalArray = new Float32Array(normals);
                }
            }
        };
        return publicAPI;
    };
    return ellipsoid;
});

define('davinci-eight/geometries/prism',["require", "exports", 'davinci-eight/math/e3ga/vectorE3'], function (require, exports, vectorE3) {
    // The numbering of the front face, seen from the front is
    //   5
    //  3 4
    // 0 1 2 
    // The numbering of the back face, seen from the front is
    //   B
    //  9 A
    // 6 7 8 
    // There are 12 vertices in total.
    var vertexList = [
        // front face
        vectorE3(-1.0, 0.0, +0.5),
        vectorE3(0.0, 0.0, +0.5),
        vectorE3(1.0, 0.0, +0.5),
        vectorE3(-0.5, 1.0, +0.5),
        vectorE3(0.5, 1.0, +0.5),
        vectorE3(0.0, 2.0, +0.5),
        // rear face
        vectorE3(-1.0, 0.0, -0.5),
        vectorE3(0.0, 0.0, -0.5),
        vectorE3(1.0, 0.0, -0.5),
        vectorE3(-0.5, 1.0, -0.5),
        vectorE3(0.5, 1.0, -0.5),
        vectorE3(0.0, 2.0, -0.5)
    ];
    // I'm not sure why the left and right side have 4 faces, but the botton only 2.
    // Symmetry would suggest making them the same.
    // There are 18 faces in total.
    var triangles = [
        //front face
        [0, 1, 3],
        [1, 4, 3],
        [1, 2, 4],
        [3, 4, 5],
        //rear face
        [6, 9, 7],
        [7, 9, 10],
        [7, 10, 8],
        [9, 11, 10],
        //left side
        [0, 3, 6],
        [3, 9, 6],
        [3, 5, 9],
        [5, 11, 9],
        //right side
        [2, 8, 4],
        [4, 8, 10],
        [4, 10, 5],
        [5, 10, 11],
        //bottom faces
        [0, 6, 8],
        [0, 8, 2]
    ];
    /**
     * Constructs and returns a Prism geometry object.
     */
    var prism = function (spec) {
        var elements = [];
        var vertices = [];
        var normals = [];
        var colors = [];
        triangles.forEach(function (triangle, index) {
            elements.push(triangle[0]);
            elements.push(triangle[1]);
            elements.push(triangle[2]);
            // Normals will be the same for each vertex of a triangle.
            var v0 = vertexList[triangle[0]];
            var v1 = vertexList[triangle[1]];
            var v2 = vertexList[triangle[2]];
            var perp = v1.sub(v0).cross(v2.sub(v0));
            var normal = perp.div(perp.norm());
            for (var j = 0; j < 3; j++) {
                vertices.push(vertexList[triangle[j]].x);
                vertices.push(vertexList[triangle[j]].y);
                vertices.push(vertexList[triangle[j]].z);
                normals.push(normal.x);
                normals.push(normal.y);
                normals.push(normal.z);
                colors.push(1.0);
                colors.push(0.0);
                colors.push(0.0);
            }
        });
        var publicAPI = {
            draw: function (context) {
                context.drawArrays(context.TRIANGLES, 0, triangles.length * 3);
            },
            dynamic: function () { return false; },
            getAttributeMetaInfos: function () {
                return {
                    position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                    color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                    normal: { name: 'aVertexNormal', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
                };
            },
            hasElements: function () {
                return false;
            },
            getElements: function () {
                // We don't support element arrays.
                return null;
            },
            getVertexAttributeData: function (name) {
                switch (name) {
                    case 'aVertexPosition': {
                        return new Float32Array(vertices);
                    }
                    default: {
                        return;
                    }
                }
            },
            update: function (time, attributes) {
            }
        };
        return publicAPI;
    };
    return prism;
});

/// <reference path="../geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
define('davinci-eight/geometries/CurveGeometry',["require", "exports"], function (require, exports) {
    function makeArray(length) {
        var xs = [];
        for (var i = 0; i < length; i++) {
            xs.push(1.0);
            xs.push(1.0);
            xs.push(1.0);
        }
        return xs;
    }
    var CurveGeometry = (function () {
        function CurveGeometry(n, generator) {
            this.n = n;
            this.generator = generator;
        }
        CurveGeometry.prototype.draw = function (context) {
            context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
        };
        CurveGeometry.prototype.dynamic = function () {
            return true;
        };
        CurveGeometry.prototype.getAttributeMetaInfos = function () {
            return {
                position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
            };
        };
        CurveGeometry.prototype.hasElements = function () {
            return true;
        };
        CurveGeometry.prototype.getElements = function () {
            return this.elements;
        };
        CurveGeometry.prototype.getVertexAttributeData = function (name) {
            switch (name) {
                case 'aVertexPosition': {
                    return this.vertices;
                }
                case 'aVertexColor': {
                    return this.vertexColors;
                }
                default: {
                    return;
                }
            }
        };
        CurveGeometry.prototype.update = function (time) {
            var n = this.n;
            var generator = this.generator;
            var vs = [];
            var indices = [];
            for (var i = 0; i < n; i++) {
                var pos = generator(i, time);
                vs.push(pos.x);
                vs.push(pos.y);
                vs.push(pos.z);
                indices.push(i);
            }
            this.elements = new Uint16Array(indices);
            this.vertices = new Float32Array(vs);
            this.vertexColors = new Float32Array(makeArray(indices.length));
        };
        return CurveGeometry;
    })();
    return CurveGeometry;
});

/// <reference path="../geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
define('davinci-eight/geometries/LatticeGeometry',["require", "exports"], function (require, exports) {
    function makeArray(length) {
        var xs = [];
        for (var i = 0; i < length; i++) {
            xs.push(1.0);
            xs.push(1.0);
            xs.push(1.0);
        }
        return xs;
    }
    var LatticeGeometry = (function () {
        function LatticeGeometry(I, J, K, generator) {
            this.I = I;
            this.J = J;
            this.K = K;
            this.generator = generator;
        }
        LatticeGeometry.prototype.draw = function (context) {
            context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
        };
        LatticeGeometry.prototype.dynamic = function () {
            return true;
        };
        LatticeGeometry.prototype.getAttributeMetaInfos = function () {
            return {
                position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
            };
        };
        LatticeGeometry.prototype.hasElements = function () {
            return true;
        };
        LatticeGeometry.prototype.getElements = function () {
            return this.elements;
        };
        LatticeGeometry.prototype.getVertexAttributeData = function (name) {
            switch (name) {
                case 'aVertexPosition': {
                    return this.vertices;
                }
                case 'aVertexColor': {
                    return this.vertexColors;
                }
                case 'aVertexNormal': {
                    return this.vertexNormals;
                }
                default: {
                    return;
                }
            }
        };
        LatticeGeometry.prototype.update = function (time) {
            var I = this.I;
            var J = this.J;
            var K = this.K;
            var generator = this.generator;
            var vs = [];
            var ps = [];
            var pointIndex = 0;
            for (var i = -I; i <= I; i++) {
                for (var j = -J; j <= J; j++) {
                    for (var k = -K; k <= K; k++) {
                        var pos = generator(i, j, k, time);
                        vs.push(pos.x);
                        vs.push(pos.y);
                        vs.push(pos.z);
                        ps.push(pointIndex);
                        pointIndex++;
                    }
                }
            }
            this.elements = new Uint16Array(ps);
            this.vertices = new Float32Array(vs);
            this.vertexColors = new Float32Array(makeArray(ps.length));
            this.vertexNormals = new Float32Array(makeArray(ps.length));
        };
        return LatticeGeometry;
    })();
    return LatticeGeometry;
});

define('davinci-eight/geometries/BoxGeometry',["require", "exports", '../geometries/cuboid'], function (require, exports, cuboid) {
    var BoxGeometry = (function () {
        function BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
            this.cuboid = cuboid();
            this.cuboid.a = this.cuboid.a.scalarMultiply(width);
            this.cuboid.b = this.cuboid.b.scalarMultiply(height);
            this.cuboid.c = this.cuboid.c.scalarMultiply(depth);
        }
        BoxGeometry.prototype.draw = function (context) {
            return this.cuboid.draw(context);
        };
        BoxGeometry.prototype.dynamic = function () {
            return this.cuboid.dynamic();
        };
        BoxGeometry.prototype.hasElements = function () {
            return this.cuboid.hasElements();
        };
        BoxGeometry.prototype.getElements = function () {
            return this.cuboid.getElements();
        };
        BoxGeometry.prototype.getVertexAttributeData = function (name) {
            return this.cuboid.getVertexAttributeData(name);
        };
        BoxGeometry.prototype.getAttributeMetaInfos = function () {
            return this.cuboid.getAttributeMetaInfos();
        };
        BoxGeometry.prototype.update = function (time, attributes) {
            return this.cuboid.update(time, attributes);
        };
        return BoxGeometry;
    })();
    return BoxGeometry;
});

/// <reference path="../geometries/Geometry.d.ts" />
define('davinci-eight/geometries/RGBGeometry',["require", "exports"], function (require, exports) {
    var RGBGeometry = (function () {
        function RGBGeometry() {
        }
        RGBGeometry.prototype.draw = function (context) {
            context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
        };
        RGBGeometry.prototype.dynamic = function () {
            return false;
        };
        RGBGeometry.prototype.getAttributeMetaInfos = function () {
            return {
                position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
                color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
            };
        };
        RGBGeometry.prototype.hasElements = function () {
            return true;
        };
        RGBGeometry.prototype.getElements = function () {
            return this.elements;
        };
        RGBGeometry.prototype.getVertexAttributeData = function (name) {
            switch (name) {
                case 'aVertexPosition': {
                    return this.vertices;
                }
                case 'aVertexColor': {
                    return this.vertexColors;
                }
                default: {
                    return;
                }
            }
        };
        RGBGeometry.prototype.update = function (time, attributes) {
            var vs = [
                0, 0, 1,
                0, 0, 0,
                1, 0, 1,
                1, 0, 0,
                0, 1, 1,
                0, 1, 0,
                1, 1, 1,
                1, 1, 0
            ].map(function (coord) { return coord - 0.5; });
            var cs = [
                0, 0, 0,
                0, 0, 1,
                0, 1, 0,
                0, 1, 1,
                1, 0, 0,
                1, 0, 1,
                1, 1, 0,
                1, 1, 1 // white
            ];
            //var ls: number[] = [0,1,0,2,0,4,1,3,1,5,2,3,2,6,3,7,4,6,5,7,4,5,6,7];
            //this.lines = new Uint16Array(ls);
            var ps = [0, 1, 2, 3, 4, 5, 6, 7];
            this.elements = new Uint16Array(ps);
            this.vertices = new Float32Array(vs);
            this.vertexColors = new Float32Array(cs);
        };
        return RGBGeometry;
    })();
    return RGBGeometry;
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
        'gl_ProjectionMatrix',
        'gl_ModelViewProjectionMatrix',
        'gl_TextureMatrix',
        'gl_NormalMatrix',
        'gl_ModelViewMatrixInverse',
        'gl_ProjectionMatrixInverse',
        'gl_ModelViewProjectionMatrixInverse',
        'gl_TextureMatrixInverse',
        'gl_ModelViewMatrixTranspose',
        'gl_ProjectionMatrixTranspose',
        'gl_ModelViewProjectionMatrixTranspose',
        'gl_TextureMatrixTranspose',
        'gl_ModelViewMatrixInverseTranspose',
        'gl_ProjectionMatrixInverseTranspose',
        'gl_ModelViewProjectionMatrixInverseTranspose',
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
                case 'uniform':
                case 'varying':
                    {
                        this.kind = word;
                    }
                    break;
                case 'float':
                case 'mat3':
                case 'mat4':
                case 'vec3':
                case 'vec4':
                case 'void':
                    {
                        this.type = word;
                    }
                    break;
                case 'highp':
                    {
                        this.modifiers.push(word);
                    }
                    break;
                default: {
                    throw new Error("keyword: " + word);
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
            this.uniforms = [];
            this.varyings = [];
        }
        ProgramArgs.prototype.declaration = function (kind, modifiers, type, names) {
            var targets = {};
            targets['attribute'] = this.attributes;
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

define('davinci-eight/materials/shaderMaterial',["require", "exports", '../glsl/parse', '../glsl/NodeWalker', '../glsl/ProgramArgs', '../utils/uuid4'], function (require, exports, parse, NodeWalker, ProgramArgs, uuid4) {
    var shaderMaterial = function () {
        var vertexShader;
        var fragmentShader;
        var program;
        var programId;
        var contextGainId;
        var attributes = [];
        var uniforms = [];
        var varyings = [];
        var publicAPI = {
            get vertexShader() {
                return vertexShader;
            },
            set vertexShader(value) {
                try {
                    var program_1 = parse(value);
                    vertexShader = value;
                    var walker = new NodeWalker();
                    var args = new ProgramArgs();
                    walker.walk(program_1, args);
                    attributes = args.attributes.map(function (a) { return { modifiers: a.modifiers, type: a.type, name: a.name }; });
                    uniforms = args.uniforms.map(function (u) { return { modifiers: u.modifiers, type: u.type, name: u.name }; });
                    varyings = args.varyings.map(function (v) { return { modifiers: v.modifiers, type: v.type, name: v.name }; });
                }
                catch (e) {
                    console.log(e);
                }
            },
            get fragmentShader() {
                return fragmentShader;
            },
            set fragmentShader(value) {
                try {
                    var fragTree = parse(value);
                    fragmentShader = value;
                }
                catch (e) {
                    console.log(e);
                }
            },
            get attributes() {
                return attributes;
            },
            get uniforms() {
                return uniforms;
            },
            get varyings() {
                return varyings;
            },
            contextFree: function (context) {
                if (program) {
                    context.deleteProgram(program);
                    program = void 0;
                    programId = void 0;
                    contextGainId = void 0;
                }
            },
            contextGain: function (context, contextId) {
                if (contextGainId !== contextId) {
                    program = makeProgram(context, vertexShader, fragmentShader);
                    programId = uuid4().generate();
                    contextGainId = contextId;
                }
            },
            contextLoss: function () {
                program = void 0;
                programId = void 0;
                contextGainId = void 0;
            },
            hasContext: function () {
                return !!program;
            },
            get program() { return program; },
            get programId() { return programId; }
        };
        return publicAPI;
    };
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    function makeProgram(gl, vertexShader, fragmentShader) {
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
    return shaderMaterial;
});

define('davinci-eight/materials/pointsMaterial',["require", "exports", './shaderMaterial'], function (require, exports, material) {
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
    var pointsMaterial = function () {
        // The inner object compiles the shaders and introspects them.
        var inner = material();
        inner.vertexShader = vertexShader;
        inner.fragmentShader = fragmentShader;
        var publicAPI = {
            get attributes() {
                return inner.attributes;
            },
            get uniforms() {
                return inner.uniforms;
            },
            get varyings() {
                return inner.varyings;
            },
            get program() {
                return inner.program;
            },
            get programId() {
                return inner.programId;
            },
            contextFree: function (context) {
                return inner.contextFree(context);
            },
            contextGain: function (context, contextGainId) {
                return inner.contextGain(context, contextGainId);
            },
            contextLoss: function () {
                return inner.contextLoss();
            },
            hasContext: function () {
                return inner.hasContext();
            }
        };
        return publicAPI;
    };
    return pointsMaterial;
});

define('davinci-eight/materials/smartMaterial',["require", "exports", './shaderMaterial'], function (require, exports, material) {
    /**
     *
     */
    var vertexShader = function (attributes, uniforms) {
        var lines = [];
        if (attributes['position']) {
            lines.push("attribute " + attributes['position'].type + " " + attributes['position'].name + ";");
        }
        if (attributes['color']) {
            lines.push("attribute " + attributes['color'].type + " " + attributes['color'].name + ";");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("attribute " + attributes['normal'].type + " " + attributes['normal'].name + ";");
        }
        if (uniforms['projectionMatrix']) {
            lines.push("uniform " + uniforms['projectionMatrix'].type + " " + uniforms['projectionMatrix'].name + ";");
        }
        if (uniforms['modelViewMatrix']) {
            lines.push("uniform " + uniforms['modelViewMatrix'].type + " " + uniforms['modelViewMatrix'].name + ";");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("uniform " + uniforms['normalMatrix'].type + " " + uniforms['normalMatrix'].name + ";");
        }
        if (attributes['color']) {
            lines.push("varying highp vec4 vColor;");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void)");
        lines.push("{");
        if (uniforms['projectionMatrix']) {
            if (uniforms['modelViewMatrix']) {
                lines.push("  gl_Position = " + uniforms['projectionMatrix'].name + " * " + uniforms['modelViewMatrix'].name + " * vec4(" + attributes['position'].name + ", 1.0);");
            }
            else {
                lines.push("  gl_Position = " + uniforms['projectionMatrix'].name + " * vec4(" + attributes['position'].name + ", 1.0);");
            }
        }
        else {
            if (uniforms['modelViewMatrix']) {
                lines.push("  gl_Position = " + uniforms['modelViewMatrix'].name + " * vec4(" + attributes['position'].name + ", 1.0);");
            }
            else {
                lines.push("  gl_Position = vec4(" + attributes['position'].name + ", 1.0);");
            }
        }
        if (attributes['color']) {
            lines.push("  vColor = vec4(" + attributes['color'].name + ", 1.0);");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("  vec3 ambientLight = vec3(0.3, 0.3, 0.3);");
            lines.push("  vec3 diffuseLightColor = vec3(0.8, 0.8, 0.8);");
            lines.push("  vec3 L = normalize(vec3(8.0, 10.0, 5.0));");
            lines.push("  vec3 N = normalize(" + uniforms['normalMatrix'].name + " * " + attributes['normal'].name + ");");
            lines.push("  float diffuseLightAmount = max(dot(N, L), 0.0);");
            lines.push("  vLight = ambientLight + (diffuseLightAmount * diffuseLightColor);");
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
        if (attributes['color']) {
            lines.push("varying highp vec4 vColor;");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void)");
        lines.push("{");
        if (attributes['color']) {
            if (uniforms['normalMatrix'] && attributes['normal']) {
                lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
            }
            else {
                lines.push("  gl_FragColor = vColor;");
            }
        }
        else {
            if (uniforms['normalMatrix'] && attributes['normal']) {
                lines.push("  gl_FragColor = vec4(vLight, 1.0);");
            }
            else {
                lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        lines.push("}");
        var code = lines.join("\n");
        return code;
    };
    /**
     *
     */
    var smartMaterial = function (attributes, uniforms) {
        if (attributes) {
        }
        else {
            throw new Error("The attributes parameter is required for smartMaterial.");
        }
        if (uniforms) {
        }
        else {
            throw new Error("The uniforms parameter is required for smartMaterial.");
        }
        var inner = material();
        inner.vertexShader = vertexShader(attributes, uniforms);
        inner.fragmentShader = fragmentShader(attributes, uniforms);
        var publicAPI = {
            get attributes() {
                return inner.attributes;
            },
            get uniforms() {
                return inner.uniforms;
            },
            get varyings() {
                return inner.varyings;
            },
            get program() {
                return inner.program;
            },
            get programId() {
                return inner.programId;
            },
            contextFree: function (context) {
                return inner.contextFree(context);
            },
            contextGain: function (context, contextGainId) {
                return inner.contextGain(context, contextGainId);
            },
            contextLoss: function () {
                return inner.contextLoss();
            },
            hasContext: function () {
                return inner.hasContext();
            }
        };
        return publicAPI;
    };
    return smartMaterial;
});

define('davinci-eight/materials/MeshBasicMaterial',["require", "exports", '../cameras/Camera', '../objects/Mesh', '../materials/smartMaterial'], function (require, exports, Camera, Mesh, smartMaterial) {
    // Can we defer the creation of smartMaterial until the geometry is known?
    // Maybe the mesh tells the material ablout the geometry?
    var attributes = {
        position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
        color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
        normal: { name: 'aVertexNormal', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
    };
    var MeshBasicMaterial = (function () {
        function MeshBasicMaterial() {
            var uniforms = Camera.getUniformMetaInfo();
            var descriptors = Mesh.getUniformMetaInfo();
            for (var name in descriptors) {
                uniforms[name] = descriptors[name];
            }
            this.material = smartMaterial(attributes, uniforms);
        }
        MeshBasicMaterial.prototype.contextFree = function (context) {
            return this.material.contextFree(context);
        };
        MeshBasicMaterial.prototype.contextGain = function (context, contextGainId) {
            return this.material.contextGain(context, contextGainId);
        };
        MeshBasicMaterial.prototype.contextLoss = function () {
            return this.material.contextLoss();
        };
        MeshBasicMaterial.prototype.hasContext = function () {
            return this.material.hasContext();
        };
        Object.defineProperty(MeshBasicMaterial.prototype, "attributes", {
            get: function () {
                return this.material.attributes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MeshBasicMaterial.prototype, "uniforms", {
            get: function () {
                return this.material.uniforms;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MeshBasicMaterial.prototype, "varyings", {
            get: function () {
                return this.material.varyings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MeshBasicMaterial.prototype, "program", {
            get: function () {
                return this.material.program;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MeshBasicMaterial.prototype, "programId", {
            get: function () {
                return this.material.programId;
            },
            enumerable: true,
            configurable: true
        });
        return MeshBasicMaterial;
    })();
    return MeshBasicMaterial;
});

/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define('davinci-eight',["require", "exports", 'davinci-eight/core', 'davinci-eight/core/object3D', 'davinci-eight/cameras/Camera', 'davinci-eight/cameras/perspectiveCamera', 'davinci-eight/cameras/PerspectiveCamera', 'davinci-eight/scenes/scene', 'davinci-eight/renderers/webGLRenderer', 'davinci-eight/objects/mesh', 'davinci-eight/objects/Mesh', 'davinci-eight/utils/webGLContextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner', 'davinci-eight/geometries/box', 'davinci-eight/geometries/cuboid', 'davinci-eight/geometries/ellipsoid', 'davinci-eight/geometries/prism', 'davinci-eight/geometries/CurveGeometry', 'davinci-eight/geometries/LatticeGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/RGBGeometry', 'davinci-eight/materials/pointsMaterial', 'davinci-eight/materials/shaderMaterial', 'davinci-eight/materials/smartMaterial', 'davinci-eight/objects/ShaderAttributeVariable', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/materials/MeshBasicMaterial'], function (require, exports, core, object3D, Camera, perspectiveCamera, PerspectiveCamera, scene, webGLRenderer, mesh, Mesh, webGLContextMonitor, workbench3D, windowAnimationRunner, box, cuboid, ellipsoid, prism, CurveGeometry, LatticeGeometry, BoxGeometry, RGBGeometry, pointsMaterial, shaderMaterial, smartMaterial, ShaderAttributeVariable, Matrix3, Matrix4, MeshBasicMaterial) {
    var eight = {
        'VERSION': core.VERSION,
        perspective: perspectiveCamera,
        get Camera() { return Camera; },
        get PerspectiveCamera() { return PerspectiveCamera; },
        scene: scene,
        object3D: object3D,
        renderer: webGLRenderer,
        contextMonitor: webGLContextMonitor,
        workbench: workbench3D,
        animationRunner: windowAnimationRunner,
        get mesh() { return mesh; },
        get Mesh() { return Mesh; },
        /**
         * Constructs and returns a box geometry.
         */
        get box() { return box; },
        get cuboid() { return cuboid; },
        get ellipsoid() { return ellipsoid; },
        prism: prism,
        CurveGeometry: CurveGeometry,
        LatticeGeometry: LatticeGeometry,
        get BoxGeometry() { return BoxGeometry; },
        RGBGeometry: RGBGeometry,
        ShaderAttributeVariable: ShaderAttributeVariable,
        get pointsMaterial() {
            return pointsMaterial;
        },
        get shaderMaterial() {
            return shaderMaterial;
        },
        get smartMaterial() {
            return smartMaterial;
        },
        get MeshBasicMaterial() {
            return MeshBasicMaterial;
        },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; }
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
