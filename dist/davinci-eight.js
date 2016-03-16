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

define("../bower_components/almond/almond", function(){});

define('davinci-eight/checks/isUndefined',["require", "exports"], function (require, exports) {
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isUndefined;
});

define('davinci-eight/checks/mustSatisfy',["require", "exports"], function (require, exports) {
    function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
        if (!condition) {
            var message = messageBuilder ? messageBuilder() : "satisfy some condition";
            var context = contextBuilder ? " in " + contextBuilder() : "";
            throw new Error(name + " must " + message + context + ".");
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustSatisfy;
});

define('davinci-eight/checks/isNumber',["require", "exports"], function (require, exports) {
    function isNumber(x) {
        return (typeof x === 'number');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isNumber;
});

define('davinci-eight/checks/mustBeNumber',["require", "exports", '../checks/mustSatisfy', '../checks/isNumber'], function (require, exports, mustSatisfy_1, isNumber_1) {
    function beANumber() {
        return "be a `number`";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/expectArg',["require", "exports", '../checks/isUndefined', '../checks/mustBeNumber'], function (require, exports, isUndefined_1, mustBeNumber_1) {
    function message(standard, override) {
        return isUndefined_1.default(override) ? standard : override();
    }
    function expectArg(name, value) {
        var arg = {
            toSatisfy: function (condition, message) {
                if (isUndefined_1.default(condition)) {
                    throw new Error("condition must be specified");
                }
                if (isUndefined_1.default(message)) {
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
                var something = value;
                var x = something;
                mustBeNumber_1.default('x', x);
                if (x >= lower && x <= upper) {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = expectArg;
});

define('davinci-eight/utils/animation',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg_1) {
    function defaultSetUp() {
    }
    function defaultTearDown(animateException) {
        if (animateException) {
            var message = "Exception raised during animate function: " + animateException;
            console.warn(message);
        }
    }
    function defaultTerminate(time) {
        return false;
    }
    function animation(animate, options) {
        if (options === void 0) { options = {}; }
        var STATE_INITIAL = 1;
        var STATE_RUNNING = 2;
        var STATE_PAUSED = 3;
        var $window = expectArg_1.default('options.window', options.window || window).toNotBeNull().value;
        var setUp = expectArg_1.default('options.setUp', options.setUp || defaultSetUp).value;
        var tearDown = expectArg_1.default('options.tearDown', options.tearDown || defaultTearDown).value;
        var terminate = expectArg_1.default('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;
        var stopSignal = false;
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
                stopSignal = false;
                $window.cancelAnimationFrame(requestID);
                if (publicAPI.isRunning) {
                    state = STATE_PAUSED;
                    startTime = void 0;
                }
                else {
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
            if (event.keyCode === 27) {
                stopSignal = true;
                event.preventDefault();
            }
        };
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
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = animation;
});

define('davinci-eight/checks/isBoolean',["require", "exports"], function (require, exports) {
    function isBoolean(x) {
        return (typeof x === 'boolean');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isBoolean;
});

define('davinci-eight/checks/isDefined',["require", "exports"], function (require, exports) {
    function isDefined(arg) {
        return (typeof arg !== 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isDefined;
});

define('davinci-eight/checks/isFunction',["require", "exports"], function (require, exports) {
    function isFunction(x) {
        return (typeof x === 'function');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isFunction;
});

define('davinci-eight/checks/isInteger',["require", "exports", '../checks/isNumber'], function (require, exports, isNumber_1) {
    function isInteger(x) {
        return isNumber_1.default(x) && x % 1 === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isInteger;
});

define('davinci-eight/checks/mustBeInteger',["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy_1, isInteger_1) {
    function beAnInteger() {
        return "be an integer";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isInteger_1.default(value), beAnInteger, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeInteger;
});

define('davinci-eight/base/incLevel',["require", "exports", '../checks/mustBeInteger'], function (require, exports, mustBeInteger_1) {
    function default_1(levelUp) {
        return mustBeInteger_1.default('levelUp', levelUp) + 1;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/isString',["require", "exports"], function (require, exports) {
    function isString(s) {
        return (typeof s === 'string');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isString;
});

define('davinci-eight/checks/mustBeString',["require", "exports", '../checks/mustSatisfy', '../checks/isString'], function (require, exports, mustSatisfy_1, isString_1) {
    function beAString() {
        return "be a string";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/i18n/readOnly',["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString_1) {
    function readOnly(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "Property `" + name + "` is readonly.";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = readOnly;
});

define('davinci-eight/checks/isEQ',["require", "exports"], function (require, exports) {
    function default_1(value, limit) {
        return value === limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/mustBeEQ',["require", "exports", '../checks/mustSatisfy', '../checks/isEQ'], function (require, exports, mustSatisfy_1, isEQ_1) {
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isEQ_1.default(value, limit), function () { return "be equal to " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/ErrorMode',["require", "exports"], function (require, exports) {
    var ErrorMode;
    (function (ErrorMode) {
        ErrorMode[ErrorMode["STRICT"] = 0] = "STRICT";
        ErrorMode[ErrorMode["IGNORE"] = 1] = "IGNORE";
        ErrorMode[ErrorMode["WARNME"] = 2] = "WARNME";
    })(ErrorMode || (ErrorMode = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ErrorMode;
});

define('davinci-eight/config',["require", "exports", './core/ErrorMode'], function (require, exports, ErrorMode_1) {
    var Eight = (function () {
        function Eight() {
            this._errorMode = ErrorMode_1.default.STRICT;
            this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
            this.LAST_MODIFIED = '2016-03-16';
            this.NAMESPACE = 'EIGHT';
            this.VERSION = '2.224.0';
        }
        Object.defineProperty(Eight.prototype, "errorMode", {
            get: function () {
                return this._errorMode;
            },
            set: function (errorMode) {
                switch (errorMode) {
                    case ErrorMode_1.default.IGNORE:
                    case ErrorMode_1.default.STRICT:
                    case ErrorMode_1.default.WARNME:
                        {
                            this._errorMode = errorMode;
                        }
                        break;
                    default: {
                        throw new Error("errorMode must be one of IGNORE, STRICT, or WARNME.");
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Eight.prototype.log = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message);
        };
        Eight.prototype.info = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.info(message);
        };
        Eight.prototype.warn = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.warn(message);
        };
        Eight.prototype.error = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.error(message);
        };
        return Eight;
    })();
    var config = new Eight();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

define('davinci-eight/core/refChange',["require", "exports", '../config', '../checks/isDefined'], function (require, exports, config_1, isDefined_1) {
    var statistics = {};
    var chatty = true;
    var skip = true;
    var trace = false;
    var traceName = void 0;
    var LOGGING_NAME_REF_CHANGE = 'refChange';
    function prefix(message) {
        return LOGGING_NAME_REF_CHANGE + ": " + message;
    }
    function log(message) {
        return config_1.default.log(prefix(message));
    }
    function warn(message) {
        return config_1.default.warn(prefix(message));
    }
    function error(message) {
        return config_1.default.error(prefix(message));
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
        var total = 0;
        for (var i = 0; i < uuidsLength; i++) {
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
    function outstandingMessage(outstanding) {
        return "There are " + outstanding + " outstanding reference counts.";
    }
    function dump() {
        var outstanding = stop();
        if (outstanding > 0) {
            config_1.default.warn("Memory Leak!");
            config_1.default.warn(outstandingMessage(outstanding));
            config_1.default.warn(JSON.stringify(statistics, null, 2));
        }
        else {
            if (chatty) {
                config_1.default.log(outstandingMessage(outstanding));
            }
        }
        return outstanding;
    }
    function default_1(uuid, name, change) {
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
                log(change + " on " + uuid + " @ " + name);
            }
        }
        if (change === +1) {
            var element = statistics[uuid];
            if (!element) {
                element = { refCount: 0, name: name, zombie: false };
                statistics[uuid] = element;
            }
            else {
                element.name = name;
            }
            element.refCount += change;
        }
        else if (change === -1) {
            var element = statistics[uuid];
            if (element) {
                element.refCount += change;
                if (element.refCount === 0) {
                    element.zombie = true;
                }
                else if (element.refCount < 0) {
                    error("refCount < 0 for " + name);
                }
            }
            else {
                error(change + " on " + uuid + " @ " + name);
            }
        }
        else if (change === 0) {
            var message = isDefined_1.default(name) ? uuid + " @ " + name : uuid;
            if (uuid === 'stop') {
                if (chatty) {
                    log(message);
                }
                return stop();
            }
            else {
                if (uuid === 'dump') {
                    return dump();
                }
                else if (uuid === 'verbose') {
                    chatty = true;
                }
                else if (uuid === 'quiet') {
                    chatty = false;
                }
                else if (uuid === 'start') {
                    if (chatty) {
                        log(message);
                    }
                    skip = false;
                    trace = false;
                }
                else if (uuid === 'reset') {
                    if (chatty) {
                        log(message);
                    }
                    statistics = {};
                    chatty = true;
                    skip = true;
                    trace = false;
                    traceName = void 0;
                }
                else if (uuid === 'trace') {
                    if (chatty) {
                        log(message);
                    }
                    skip = false;
                    trace = true;
                    traceName = name;
                }
                else {
                    throw new Error(prefix("Unexpected command uuid => " + uuid + ", name => " + name));
                }
            }
        }
        else {
            throw new Error(prefix("change must be +1 or -1 for normal recording, or 0 for logging to the console."));
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/uuid4',["require", "exports"], function (require, exports) {
    function uuid4() {
        var maxFromBits = function (bits) {
            return Math.pow(2, bits);
        };
        var limitUI06 = maxFromBits(6);
        var limitUI08 = maxFromBits(8);
        var limitUI12 = maxFromBits(12);
        var limitUI16 = maxFromBits(16);
        var limitUI32 = maxFromBits(32);
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
            validate: function (uuid) {
                var testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                return testPattern.test(uuid);
            }
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = uuid4;
});

define('davinci-eight/core/ShareableBase',["require", "exports", '../checks/isDefined', '../checks/mustBeEQ', '../checks/mustBeInteger', '../checks/mustBeString', '../i18n/readOnly', './refChange', './uuid4'], function (require, exports, isDefined_1, mustBeEQ_1, mustBeInteger_1, mustBeString_1, readOnly_1, refChange_1, uuid4_1) {
    var ShareableBase = (function () {
        function ShareableBase() {
            this._refCount = 1;
            this._uuid = uuid4_1.default().generate();
            this._levelUp = -1;
            this._type = 'ShareableBase';
            this._levelUp += 1;
            refChange_1.default(this._uuid, this._type, +1);
        }
        ShareableBase.prototype.destructor = function (levelUp, grumble) {
            if (grumble === void 0) { grumble = false; }
            mustBeInteger_1.default('levelUp', levelUp);
            mustBeEQ_1.default(this._type + " constructor-destructor chain mismatch: destructor index " + levelUp, levelUp, this._levelUp);
            if (grumble) {
                console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
            }
            this._levelUp = void 0;
        };
        Object.defineProperty(ShareableBase.prototype, "levelUp", {
            get: function () {
                return this._levelUp;
            },
            set: function (levelUp) {
                throw new Error(readOnly_1.default('levelUp').message);
            },
            enumerable: true,
            configurable: true
        });
        ShareableBase.prototype.isZombie = function () {
            return typeof this._refCount === 'undefined';
        };
        ShareableBase.prototype.addRef = function () {
            this._refCount++;
            refChange_1.default(this._uuid, this._type, +1);
            return this._refCount;
        };
        ShareableBase.prototype.getLoggingName = function () {
            return this._type;
        };
        ShareableBase.prototype.setLoggingName = function (name) {
            this._type = mustBeString_1.default('name', name);
            this._levelUp += 1;
            refChange_1.default(this._uuid, name, +1);
            refChange_1.default(this._uuid, name, -1);
        };
        ShareableBase.prototype.release = function () {
            this._refCount--;
            refChange_1.default(this._uuid, this._type, -1);
            var refCount = this._refCount;
            if (refCount === 0) {
                this.destructor(0, true);
                this._refCount = void 0;
                if (isDefined_1.default(this._levelUp)) {
                    throw new Error(this._type + ".destructor method is not calling all the way up the chain.");
                }
            }
            return refCount;
        };
        Object.defineProperty(ShareableBase.prototype, "uuid", {
            get: function () {
                return this._uuid;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uuid').message);
            },
            enumerable: true,
            configurable: true
        });
        return ShareableBase;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShareableBase;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/ShareableArray',["require", "exports", '../base/incLevel', '../i18n/readOnly', '../core/ShareableBase'], function (require, exports, incLevel_1, readOnly_1, ShareableBase_1) {
    function transferOwnership(data) {
        if (data) {
            var result = new ShareableArray(data);
            for (var i = 0, iLength = data.length; i < iLength; i++) {
                var element = data[i];
                if (element) {
                    element.release();
                }
            }
            return result;
        }
        else {
            return void 0;
        }
    }
    var ShareableArray = (function (_super) {
        __extends(ShareableArray, _super);
        function ShareableArray(elements) {
            if (elements === void 0) { elements = []; }
            _super.call(this);
            this.setLoggingName('ShareableArray');
            this._elements = elements;
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].addRef();
            }
        }
        ShareableArray.prototype.destructor = function (level) {
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].release();
            }
            this._elements = void 0;
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        ShareableArray.prototype.find = function (match) {
            var result = new ShareableArray([]);
            var elements = this._elements;
            var iLen = elements.length;
            for (var i = 0; i < iLen; i++) {
                var candidate = elements[i];
                if (match(candidate)) {
                    result.push(candidate);
                }
            }
            return result;
        };
        ShareableArray.prototype.findOne = function (match) {
            var elements = this._elements;
            for (var i = 0, iLength = elements.length; i < iLength; i++) {
                var candidate = elements[i];
                if (match(candidate)) {
                    candidate.addRef();
                    return candidate;
                }
            }
            return void 0;
        };
        ShareableArray.prototype.get = function (index) {
            var element = this.getWeakRef(index);
            if (element) {
                element.addRef();
            }
            return element;
        };
        ShareableArray.prototype.getWeakRef = function (index) {
            return this._elements[index];
        };
        ShareableArray.prototype.indexOf = function (searchElement, fromIndex) {
            return this._elements.indexOf(searchElement, fromIndex);
        };
        Object.defineProperty(ShareableArray.prototype, "length", {
            get: function () {
                if (this._elements) {
                    return this._elements.length;
                }
                else {
                    console.warn("ShareableArray is now a zombie, length is undefined");
                    return void 0;
                }
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('length').message);
            },
            enumerable: true,
            configurable: true
        });
        ShareableArray.prototype.slice = function (begin, end) {
            return new ShareableArray(this._elements.slice(begin, end));
        };
        ShareableArray.prototype.splice = function (index, deleteCount) {
            return transferOwnership(this._elements.splice(index, deleteCount));
        };
        ShareableArray.prototype.shift = function () {
            return this._elements.shift();
        };
        ShareableArray.prototype.forEach = function (callback) {
            return this._elements.forEach(callback);
        };
        ShareableArray.prototype.push = function (element) {
            if (element) {
                element.addRef();
            }
            return this.pushWeakRef(element);
        };
        ShareableArray.prototype.pushWeakRef = function (element) {
            return this._elements.push(element);
        };
        ShareableArray.prototype.pop = function () {
            return this._elements.pop();
        };
        ShareableArray.prototype.unshift = function (element) {
            element.addRef();
            return this.unshiftWeakRef(element);
        };
        ShareableArray.prototype.unshiftWeakRef = function (element) {
            return this._elements.unshift(element);
        };
        return ShareableArray;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShareableArray;
});

define('davinci-eight/checks/mustBeFunction',["require", "exports", '../checks/mustSatisfy', '../checks/isFunction'], function (require, exports, mustSatisfy_1, isFunction_1) {
    function beFunction() {
        return "be a function";
    }
    function mustBeFunction(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isFunction_1.default(value), beFunction, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeFunction;
});

define('davinci-eight/checks/isObject',["require", "exports"], function (require, exports) {
    function isObject(x) {
        return (typeof x === 'object');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isObject;
});

define('davinci-eight/checks/mustBeObject',["require", "exports", '../checks/mustSatisfy', '../checks/isObject'], function (require, exports, mustSatisfy_1, isObject_1) {
    function beObject() {
        return "be an `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isObject_1.default(value), beObject, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeObject;
});

define('davinci-eight/checks/mustBeUndefined',["require", "exports", '../checks/mustSatisfy', '../checks/isUndefined'], function (require, exports, mustSatisfy_1, isUndefined_1) {
    function beUndefined() {
        return "be 'undefined'";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isUndefined_1.default(value), beUndefined, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/base/BrowserApp',["require", "exports", '../checks/isBoolean', '../checks/isDefined', '../checks/isFunction', '../checks/isUndefined', '../collections/ShareableArray', '../checks/mustBeFunction', '../checks/mustBeObject', '../checks/mustBeUndefined', '../core/refChange'], function (require, exports, isBoolean_1, isDefined_1, isFunction_1, isUndefined_1, ShareableArray_1, mustBeFunction_1, mustBeObject_1, mustBeUndefined_1, refChange_1) {
    var BrowserApp = (function () {
        function BrowserApp(options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            this.memcheck = defaultMemCheck(options);
            if (this.memcheck) {
                refChange_1.default('quiet');
                refChange_1.default('start');
            }
            this.window = defaultWindow(options);
            this.domLoaded = function () {
                _this.window.document.removeEventListener('DOMContentLoaded', _this.domLoaded);
                _this.domLoaded = void 0;
                _this.shutDown = function (ev) {
                    _this.window.removeEventListener('unload', _this.shutDown);
                    _this.shutDown = void 0;
                    mustBeUndefined_1.default('shutDown', _this.shutDown);
                    mustBeUndefined_1.default('domLoaded', _this.domLoaded);
                    _this.destructor();
                    if (isDefined_1.default(_this.managed)) {
                        console.warn("You must call super.destructor() as the last statement in your BroswerApp-derived class.");
                        _this.managed.release();
                        _this.managed = void 0;
                    }
                };
                mustBeObject_1.default('window', _this.window);
                mustBeFunction_1.default('shutDown', _this.shutDown);
                mustBeUndefined_1.default('domLoaded', _this.domLoaded);
                _this.window.addEventListener('unload', _this.shutDown);
                _this.initialize();
            };
            mustBeObject_1.default('window', this.window);
            mustBeUndefined_1.default('shutDown', this.shutDown);
            mustBeFunction_1.default('domLoaded', this.domLoaded);
            this.window.document.addEventListener('DOMContentLoaded', this.domLoaded);
        }
        BrowserApp.prototype.isWaiting = function () {
            return isFunction_1.default(this.domLoaded);
        };
        BrowserApp.prototype.isRunning = function () {
            return isFunction_1.default(this.shutDown);
        };
        BrowserApp.prototype.isZombie = function () {
            return isUndefined_1.default(this.shutDown) && isUndefined_1.default(this.domLoaded);
        };
        BrowserApp.prototype.manage = function (managed) {
            if (this.managed) {
                this.managed.pushWeakRef(managed);
            }
            else {
                throw new Error("You must call super.initialize() as the first statement in your BroswerApp-derived initialize method.");
            }
        };
        BrowserApp.prototype.initialize = function () {
            if (isUndefined_1.default(this.managed)) {
                this.managed = new ShareableArray_1.default();
            }
        };
        BrowserApp.prototype.destructor = function () {
            if (this.managed) {
                this.managed.release();
                this.managed = void 0;
            }
            if (this.memcheck) {
                refChange_1.default('stop');
                refChange_1.default('dump');
            }
        };
        return BrowserApp;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BrowserApp;
    function defaultMemCheck(options) {
        if (isBoolean_1.default(options.memcheck)) {
            return options.memcheck;
        }
        else {
            return false;
        }
    }
    function defaultWindow(options) {
        if (options.window) {
            return mustBeObject_1.default('options.window', options.window);
        }
        else {
            return window;
        }
    }
});

define('davinci-eight/commands/Capability',["require", "exports"], function (require, exports) {
    var Capability;
    (function (Capability) {
        Capability[Capability["BLEND"] = 0] = "BLEND";
        Capability[Capability["CULL_FACE"] = 1] = "CULL_FACE";
        Capability[Capability["DEPTH_TEST"] = 2] = "DEPTH_TEST";
        Capability[Capability["POLYGON_OFFSET_FILL"] = 3] = "POLYGON_OFFSET_FILL";
        Capability[Capability["SCISSOR_TEST"] = 4] = "SCISSOR_TEST";
    })(Capability || (Capability = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Capability;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/EIGHTLogger',["require", "exports", '../config', '../core/ShareableBase'], function (require, exports, config_1, ShareableBase_1) {
    var EIGHTLogger = (function (_super) {
        __extends(EIGHTLogger, _super);
        function EIGHTLogger() {
            _super.call(this);
            this.setLoggingName('EIGHTLogger');
        }
        EIGHTLogger.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        EIGHTLogger.prototype.contextFree = function (contextProvider) {
        };
        EIGHTLogger.prototype.contextGain = function (contextProvider) {
            console.log(config_1.default.NAMESPACE + " " + config_1.default.VERSION + " (" + config_1.default.GITHUB + ") " + config_1.default.LAST_MODIFIED);
        };
        EIGHTLogger.prototype.contextLost = function () {
        };
        Object.defineProperty(EIGHTLogger.prototype, "name", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        return EIGHTLogger;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EIGHTLogger;
});

define('davinci-eight/core/DrawMode',["require", "exports"], function (require, exports) {
    var DrawMode;
    (function (DrawMode) {
        DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
        DrawMode[DrawMode["LINES"] = 1] = "LINES";
        DrawMode[DrawMode["LINE_STRIP"] = 2] = "LINE_STRIP";
        DrawMode[DrawMode["TRIANGLES"] = 3] = "TRIANGLES";
        DrawMode[DrawMode["TRIANGLE_STRIP"] = 4] = "TRIANGLE_STRIP";
    })(DrawMode || (DrawMode = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawMode;
});

define('davinci-eight/core/drawModeToGL',["require", "exports", './DrawMode'], function (require, exports, DrawMode_1) {
    function default_1(mode, gl) {
        switch (mode) {
            case DrawMode_1.default.TRIANGLE_STRIP:
                return gl.TRIANGLE_STRIP;
            case DrawMode_1.default.TRIANGLES:
                return gl.TRIANGLES;
            case DrawMode_1.default.LINE_STRIP:
                return gl.LINE_STRIP;
            case DrawMode_1.default.LINES:
                return gl.LINES;
            case DrawMode_1.default.POINTS:
                return gl.POINTS;
            default:
                throw new Error("Unexpected mode: " + mode);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/base/DefaultContextProvider',["require", "exports", '../core/drawModeToGL', '../i18n/readOnly', '../core/ShareableBase'], function (require, exports, drawModeToGL_1, readOnly_1, ShareableBase_1) {
    var DefaultContextProvider = (function (_super) {
        __extends(DefaultContextProvider, _super);
        function DefaultContextProvider(engine) {
            _super.call(this);
            this.setLoggingName('DefaultContextProvider');
            this.engine = engine;
        }
        DefaultContextProvider.prototype.destructor = function (levelUp) {
            this.engine = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(DefaultContextProvider.prototype, "gl", {
            get: function () {
                if (this.engine) {
                    return this.engine.gl;
                }
                else {
                    throw new Error(this._type + ".engine is undefined.");
                }
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('gl').message);
            },
            enumerable: true,
            configurable: true
        });
        DefaultContextProvider.prototype.disableVertexAttribArray = function (index) {
            var gl = this.gl;
            gl.disableVertexAttribArray(index);
        };
        DefaultContextProvider.prototype.drawArrays = function (mode, first, count) {
            var gl = this.gl;
            gl.drawArrays(mode, first, count);
        };
        DefaultContextProvider.prototype.drawElements = function (mode, count, offset) {
            var gl = this.gl;
            gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
        };
        DefaultContextProvider.prototype.drawModeToGL = function (drawMode) {
            return drawModeToGL_1.default(drawMode, this.gl);
        };
        DefaultContextProvider.prototype.enableVertexAttribArray = function (index) {
            var gl = this.gl;
            gl.enableVertexAttribArray(index);
        };
        DefaultContextProvider.prototype.isContextLost = function () {
            var gl = this.gl;
            if (gl) {
                return gl.isContextLost();
            }
            else {
                throw new Error("WebGLRenderingContext is undefined.");
            }
        };
        DefaultContextProvider.prototype.vertexAttribPointer = function (index, size, normalized, stride, offset) {
            var gl = this.gl;
            gl.vertexAttribPointer(index, size, gl.FLOAT, normalized, stride, offset);
        };
        return DefaultContextProvider;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultContextProvider;
});

define('davinci-eight/core/initWebGL',["require", "exports", '../checks/isDefined'], function (require, exports, isDefined_1) {
    function initWebGL(canvas, attributes) {
        if (isDefined_1.default(canvas)) {
            var context;
            try {
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
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = initWebGL;
});

define('davinci-eight/checks/mustBeBoolean',["require", "exports", '../checks/mustSatisfy', '../checks/isBoolean'], function (require, exports, mustSatisfy_1, isBoolean_1) {
    function beBoolean() {
        return "be `boolean`";
    }
    function mustBeBoolean(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isBoolean_1.default(value), beBoolean, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeBoolean;
});

define('davinci-eight/checks/mustBeDefined',["require", "exports", '../checks/mustSatisfy', '../checks/isDefined'], function (require, exports, mustSatisfy_1, isDefined_1) {
    function beDefined() {
        return "not be 'undefined'";
    }
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isDefined_1.default(value), beDefined, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeDefined;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/VersionLogger',["require", "exports", '../core/ShareableBase'], function (require, exports, ShareableBase_1) {
    var QUALIFIED_NAME = 'EIGHT.VersionLogger';
    var VersionLogger = (function (_super) {
        __extends(VersionLogger, _super);
        function VersionLogger() {
            _super.call(this);
            this.setLoggingName(QUALIFIED_NAME);
        }
        VersionLogger.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        VersionLogger.prototype.contextFree = function () {
        };
        VersionLogger.prototype.contextGain = function (manager) {
            var gl = manager.gl;
            console.log(gl.getParameter(gl.VERSION));
        };
        VersionLogger.prototype.contextLost = function () {
        };
        Object.defineProperty(VersionLogger.prototype, "name", {
            get: function () {
                return QUALIFIED_NAME;
            },
            enumerable: true,
            configurable: true
        });
        return VersionLogger;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VersionLogger;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLClearColor',["require", "exports", '../checks/mustBeNumber', '../core/ShareableBase'], function (require, exports, mustBeNumber_1, ShareableBase_1) {
    var WebGLClearColor = (function (_super) {
        __extends(WebGLClearColor, _super);
        function WebGLClearColor(red, green, blue, alpha) {
            if (red === void 0) { red = 0; }
            if (green === void 0) { green = 0; }
            if (blue === void 0) { blue = 0; }
            if (alpha === void 0) { alpha = 1; }
            _super.call(this);
            this.setLoggingName('WebGLClearColor');
            this.red = mustBeNumber_1.default('red', red);
            this.green = mustBeNumber_1.default('green', green);
            this.blue = mustBeNumber_1.default('blue', blue);
            this.alpha = mustBeNumber_1.default('alpha', alpha);
        }
        WebGLClearColor.prototype.destructor = function (levelUp) {
            this.red = void 0;
            this.green = void 0;
            this.blue = void 0;
            this.alpha = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        WebGLClearColor.prototype.contextFree = function (manager) {
        };
        WebGLClearColor.prototype.contextGain = function (manager) {
            mustBeNumber_1.default('red', this.red);
            mustBeNumber_1.default('green', this.green);
            mustBeNumber_1.default('blue', this.blue);
            mustBeNumber_1.default('alpha', this.alpha);
            manager.gl.clearColor(this.red, this.green, this.blue, this.alpha);
        };
        WebGLClearColor.prototype.contextLost = function () {
        };
        return WebGLClearColor;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLClearColor;
});

define('davinci-eight/commands/glCapability',["require", "exports", '../commands/Capability', '../checks/isDefined', '../checks/mustBeDefined', '../checks/mustBeInteger'], function (require, exports, Capability_1, isDefined_1, mustBeDefined_1, mustBeInteger_1) {
    function glCapability(capability, gl) {
        if (isDefined_1.default(capability)) {
            mustBeInteger_1.default('capability', capability);
            mustBeDefined_1.default('gl', gl);
            switch (capability) {
                case Capability_1.default.BLEND: return gl.BLEND;
                case Capability_1.default.CULL_FACE: return gl.CULL_FACE;
                case Capability_1.default.DEPTH_TEST: return gl.DEPTH_TEST;
                case Capability_1.default.POLYGON_OFFSET_FILL: return gl.POLYGON_OFFSET_FILL;
                case Capability_1.default.SCISSOR_TEST: return gl.SCISSOR_TEST;
                default: {
                    throw new Error(capability + " is not a valid capability.");
                }
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = glCapability;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLEnable',["require", "exports", '../commands/glCapability', '../checks/mustBeNumber', '../core/ShareableBase'], function (require, exports, glCapability_1, mustBeNumber_1, ShareableBase_1) {
    var WebGLEnable = (function (_super) {
        __extends(WebGLEnable, _super);
        function WebGLEnable(capability) {
            _super.call(this);
            this.setLoggingName('WebGLEnable');
            this._capability = mustBeNumber_1.default('capability', capability);
        }
        WebGLEnable.prototype.destructor = function (levelUp) {
            this._capability = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        WebGLEnable.prototype.contextFree = function (manager) {
        };
        WebGLEnable.prototype.contextGain = function (manager) {
            manager.gl.enable(glCapability_1.default(this._capability, manager.gl));
        };
        WebGLEnable.prototype.contextLost = function () {
        };
        return WebGLEnable;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLEnable;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLDisable',["require", "exports", '../commands/glCapability', '../checks/mustBeNumber', '../core/ShareableBase'], function (require, exports, glCapability_1, mustBeNumber_1, ShareableBase_1) {
    var WebGLDisable = (function (_super) {
        __extends(WebGLDisable, _super);
        function WebGLDisable(capability) {
            _super.call(this);
            this.setLoggingName('WebGLDisable');
            this._capability = mustBeNumber_1.default('capability', capability);
        }
        WebGLDisable.prototype.destructor = function (levelUp) {
            this._capability = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        WebGLDisable.prototype.contextFree = function (manager) {
        };
        WebGLDisable.prototype.contextGain = function (manager) {
            manager.gl.disable(glCapability_1.default(this._capability, manager.gl));
        };
        WebGLDisable.prototype.contextLost = function () {
        };
        return WebGLDisable;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLDisable;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Engine',["require", "exports", '../commands/Capability', '../config', '../commands/EIGHTLogger', './ErrorMode', '../base/DefaultContextProvider', '../base/incLevel', './initWebGL', '../checks/isDefined', '../checks/mustBeBoolean', '../checks/mustBeDefined', '../checks/mustBeObject', '../checks/mustSatisfy', '../i18n/readOnly', '../collections/ShareableArray', './ShareableBase', '../commands/VersionLogger', '../commands/WebGLClearColor', '../commands/WebGLEnable', '../commands/WebGLDisable'], function (require, exports, Capability_1, config_1, EIGHTLogger_1, ErrorMode_1, DefaultContextProvider_1, incLevel_1, initWebGL_1, isDefined_1, mustBeBoolean_1, mustBeDefined_1, mustBeObject_1, mustSatisfy_1, readOnly_1, ShareableArray_1, ShareableBase_1, VersionLogger_1, WebGLClearColor_1, WebGLEnable_1, WebGLDisable_1) {
    var Engine = (function (_super) {
        __extends(Engine, _super);
        function Engine(attributes) {
            var _this = this;
            _super.call(this);
            this._users = [];
            this._commands = new ShareableArray_1.default([]);
            this._mayUseCache = true;
            this.colorFlag = true;
            this.depthFlag = true;
            this.stencilFlag = false;
            this.clearMask = clearMask(this.colorFlag, this.depthFlag, this.stencilFlag, null);
            this._viewportArgs = {
                x: void 0,
                y: void 0,
                width: void 0,
                height: void 0
            };
            this.setLoggingName('Engine');
            this._attributes = attributes;
            this._commands.pushWeakRef(new EIGHTLogger_1.default());
            this._commands.pushWeakRef(new VersionLogger_1.default());
            this._contextProvider = new DefaultContextProvider_1.default(this);
            this.enable(Capability_1.default.DEPTH_TEST);
            this.clearColor(0.1, 0.1, 0.1, 1.0);
            this._webGLContextLost = function (event) {
                if (isDefined_1.default(_this._canvas)) {
                    event.preventDefault();
                    _this._gl = void 0;
                    _this._users.forEach(function (user) {
                        user.contextLost();
                    });
                }
            };
            this._webGLContextRestored = function (event) {
                if (isDefined_1.default(_this._canvas)) {
                    event.preventDefault();
                    _this._gl = initWebGL_1.default(_this._canvas, attributes);
                    _this._users.forEach(function (user) {
                        user.contextGain(_this._contextProvider);
                    });
                }
            };
        }
        Engine.prototype.destructor = function (levelUp) {
            this.stop();
            this._contextProvider.release();
            while (this._users.length > 0) {
                this._users.pop();
            }
            this._commands.release();
            _super.prototype.destructor.call(this, incLevel_1.default(levelUp));
        };
        Engine.prototype.addContextListener = function (user) {
            mustBeObject_1.default('user', user);
            var index = this._users.indexOf(user);
            if (index < 0) {
                this._users.push(user);
            }
            else {
                console.warn("user already exists for addContextListener");
            }
        };
        Object.defineProperty(Engine.prototype, "canvas", {
            get: function () {
                if (!this._canvas) {
                    this.start(document.createElement('canvas'));
                }
                return this._canvas;
            },
            set: function (canvas) {
                throw new Error(readOnly_1.default('canvas').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "commands", {
            get: function () {
                this._commands.addRef();
                return this._commands;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('commands').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "mayUseCache", {
            get: function () {
                return this._mayUseCache;
            },
            set: function (mayUseCache) {
                this._mayUseCache = mustBeBoolean_1.default('mayUseCache', mayUseCache);
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype.clearColor = function (red, green, blue, alpha) {
            this._commands.pushWeakRef(new WebGLClearColor_1.default(red, green, blue, alpha));
            var gl = this._gl;
            if (gl) {
                gl.clearColor(red, green, blue, alpha);
            }
            return this;
        };
        Engine.prototype.disable = function (capability) {
            this._commands.pushWeakRef(new WebGLDisable_1.default(capability));
            return this;
        };
        Engine.prototype.enable = function (capability) {
            this._commands.pushWeakRef(new WebGLEnable_1.default(capability));
            return this;
        };
        Object.defineProperty(Engine.prototype, "gl", {
            get: function () {
                if (this._gl) {
                    return this._gl;
                }
                else {
                    return void 0;
                }
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('gl').message);
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype.removeContextListener = function (user) {
            mustBeObject_1.default('user', user);
            var index = this._users.indexOf(user);
            if (index >= 0) {
                this._users.splice(index, 1);
            }
        };
        Engine.prototype.clear = function () {
            var gl = this._gl;
            if (gl) {
                gl.clear(this.clearMask);
            }
        };
        Engine.prototype.getMaxViewportDims = function () {
            var gl = this._gl;
            if (gl) {
                return gl.getParameter(gl.MAX_VIEWPORT_DIMS);
            }
            else {
                return void 0;
            }
        };
        Engine.prototype.getViewport = function () {
            var gl = this._gl;
            if (gl) {
                return gl.getParameter(gl.VIEWPORT);
            }
            else {
                return void 0;
            }
        };
        Engine.prototype.viewport = function (x, y, width, height) {
            var gl = this._gl;
            if (gl) {
                if (this._mayUseCache) {
                    var args = this._viewportArgs;
                    if (x !== args.x || y !== args.y || width !== args.width || height !== args.height) {
                        gl.viewport(x, y, width, height);
                        args.x = x;
                        args.y = y;
                        args.width = width;
                        args.height = height;
                    }
                }
                else {
                    gl.viewport(x, y, width, height);
                }
            }
            else {
                if (config_1.default.errorMode === ErrorMode_1.default.WARNME) {
                    console.warn(this._type + ".viewport(" + x + ", " + y + ", " + width + ", " + height + ") ignored because no context.");
                }
            }
            return this;
        };
        Engine.prototype.start = function (canvas) {
            if (!(canvas instanceof HTMLCanvasElement)) {
                console.warn("canvas must be an HTMLCanvasElement to start the context.");
                return this;
            }
            mustBeDefined_1.default('canvas', canvas);
            var alreadyStarted = isDefined_1.default(this._canvas);
            if (!alreadyStarted) {
                this._canvas = canvas;
            }
            else {
                console.warn(this._type + " Ignoring start() because already started.");
                return;
            }
            if (isDefined_1.default(this._canvas)) {
                this._gl = initWebGL_1.default(this._canvas, this._attributes);
                this.clearMask = clearMask(this.colorFlag, this.depthFlag, this.stencilFlag, this._gl);
                this.emitStartEvent();
                this._canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
                this._canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
            }
            return this;
        };
        Engine.prototype.stop = function () {
            if (isDefined_1.default(this._canvas)) {
                this._canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false);
                this._canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false);
                if (this._gl) {
                    this.emitStopEvent();
                    this._gl = void 0;
                }
                this._canvas = void 0;
            }
            return this;
        };
        Engine.prototype.emitStartEvent = function () {
            var _this = this;
            this._users.forEach(function (user) {
                _this.emitContextGain(user);
            });
            this._commands.forEach(function (command) {
                _this.emitContextGain(command);
            });
        };
        Engine.prototype.emitContextGain = function (consumer) {
            if (this._gl.isContextLost()) {
                consumer.contextLost();
            }
            else {
                consumer.contextGain(this._contextProvider);
            }
        };
        Engine.prototype.emitStopEvent = function () {
            var _this = this;
            this._users.forEach(function (user) {
                _this.emitContextFree(user);
            });
            this._commands.forEach(function (command) {
                _this.emitContextFree(command);
            });
        };
        Engine.prototype.emitContextFree = function (consumer) {
            if (this._gl.isContextLost()) {
                consumer.contextLost();
            }
            else {
                consumer.contextFree(this._contextProvider);
            }
        };
        Engine.prototype.synchronize = function (consumer) {
            if (this._gl) {
                this.emitContextGain(consumer);
            }
            else {
            }
        };
        return Engine;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Engine;
    function clearMask(colorFlag, depthFlag, stencilFlag, gl) {
        var mask = 0;
        if (colorFlag) {
            if (gl) {
                mustSatisfy_1.default('COLOR_BUFFER_BIT', gl.COLOR_BUFFER_BIT === 0x4000, function () { return 'clearMask'; });
                mask |= gl.COLOR_BUFFER_BIT;
            }
            else {
                mask |= 0x4000;
            }
        }
        if (depthFlag) {
            if (gl) {
                mustSatisfy_1.default('DEPTH_BUFFER_BIT', gl.DEPTH_BUFFER_BIT === 0x0100, function () { return 'clearMask'; });
                mask |= gl.DEPTH_BUFFER_BIT;
            }
            else {
                mask |= 0x0100;
            }
        }
        if (stencilFlag) {
            if (gl) {
                mustSatisfy_1.default('STENCIL_BUFFER_BIT', gl.STENCIL_BUFFER_BIT === 0x0400, function () { return 'clearMask'; });
                mask |= gl.STENCIL_BUFFER_BIT;
            }
            else {
                mask |= 0x0400;
            }
        }
        return mask;
    }
});

define('davinci-eight/utils/getCanvasElementById',["require", "exports", '../checks/mustBeString', '../checks/mustBeObject'], function (require, exports, mustBeString_1, mustBeObject_1) {
    function getCanvasElementById(elementId, dom) {
        if (dom === void 0) { dom = window.document; }
        mustBeString_1.default('elementId', elementId);
        mustBeObject_1.default('document', dom);
        var element = dom.getElementById(elementId);
        if (element instanceof HTMLCanvasElement) {
            return element;
        }
        else {
            throw new Error(elementId + " is not an HTMLCanvasElement.");
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getCanvasElementById;
});

define('davinci-eight/utils/exists',["require", "exports"], function (require, exports) {
    function exists(v) {
        return !(v === void 0 || v === null);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exists;
});

define('davinci-eight/utils/isBrowser',["require", "exports"], function (require, exports) {
    function isBrowser() {
        return typeof window === 'object' && typeof document === 'object';
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isBrowser;
});

define('davinci-eight/utils/getDimensions',["require", "exports", './exists', './isBrowser'], function (require, exports, exists_1, isBrowser_1) {
    function getDimensions(elementId, doc) {
        var pixelDimRegExp = /\d+(\.\d*)?px/;
        if (!isBrowser_1.default() || elementId === null) {
            return {
                width: 500,
                height: 500
            };
        }
        var element = doc.getElementById(elementId);
        if (!exists_1.default(element)) {
            throw new Error("\nHTML container element '" + elementId + "' not found.");
        }
        var display = element.style.display;
        if (display !== 'none' && display !== null) {
            if (element.clientWidth > 0 && element.clientHeight > 0) {
                return { width: element.clientWidth, height: element.clientHeight };
            }
            var style = window.getComputedStyle ? window.getComputedStyle(element) : element.style;
            return {
                width: pixelDimRegExp.test(style.width) ? parseFloat(style.width) : 0,
                height: pixelDimRegExp.test(style.height) ? parseFloat(style.height) : 0
            };
        }
        var els = element.style;
        var originalVisibility = els.visibility;
        var originalPosition = els.position;
        var originalDisplay = els.display;
        els.visibility = 'hidden';
        els.position = 'absolute';
        els.display = 'block';
        var originalWidth = element.clientWidth;
        var originalHeight = element.clientHeight;
        els.display = originalDisplay;
        els.position = originalPosition;
        els.visibility = originalVisibility;
        return {
            width: originalWidth,
            height: originalHeight
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getDimensions;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/base/EngineApp',["require", "exports", './BrowserApp', '../core/Engine', '../utils/getCanvasElementById', '../utils/getDimensions', '../checks/isString', '../checks/mustBeNumber'], function (require, exports, BrowserApp_1, Engine_1, getCanvasElementById_1, getDimensions_1, isString_1, mustBeNumber_1) {
    var EngineApp = (function (_super) {
        __extends(EngineApp, _super);
        function EngineApp(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, options);
            this.engine = new Engine_1.default();
            this.canvasId = defaultCanvasId(options);
        }
        EngineApp.prototype.destructor = function () {
            if (this.engine) {
                this.engine.stop();
                this.engine.release();
                this.engine = void 0;
            }
            _super.prototype.destructor.call(this);
        };
        EngineApp.prototype.clear = function () {
            this.engine.clear();
        };
        EngineApp.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            var dom = this.window.document;
            this.canvas = getCanvasElementById_1.default(this.canvasId, dom);
            if (this.canvas) {
                var dimensions = getDimensions_1.default(this.canvasId, dom);
                this.canvas.width = mustBeNumber_1.default('canvas.width', dimensions.width);
                this.canvas.height = mustBeNumber_1.default('canvas.height', dimensions.height);
                this.engine.start(this.canvas);
            }
            else {
                throw new Error(this.canvasId + " must be the elementId of a canvas element.");
            }
        };
        return EngineApp;
    })(BrowserApp_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EngineApp;
    function defaultCanvasId(options) {
        if (isString_1.default(options.canvasId)) {
            return options.canvasId;
        }
        else {
            return 'canvas';
        }
    }
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/base/AnimationApp',["require", "exports", '../utils/animation', './EngineApp'], function (require, exports, animation_1, EngineApp_1) {
    var AnimationApp = (function (_super) {
        __extends(AnimationApp, _super);
        function AnimationApp(options) {
            var _this = this;
            _super.call(this, options);
            var winAniOptions = {};
            winAniOptions.window = this.window;
            var animate = function (time) {
                _this.animate(time);
            };
            this.animation = animation_1.default(animate, winAniOptions);
        }
        AnimationApp.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        AnimationApp.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        AnimationApp.prototype.animate = function (time) {
            throw new Error("derived class must implement the protected animate(time: number): void method.");
        };
        AnimationApp.prototype.start = function () {
            if (!this.animation.isRunning) {
                this.animation.start();
            }
        };
        AnimationApp.prototype.stop = function () {
            if (this.animation.isRunning) {
                this.animation.stop();
            }
        };
        AnimationApp.prototype.reset = function () {
            if (this.animation.isPaused) {
                this.animation.reset();
            }
        };
        return AnimationApp;
    })(EngineApp_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AnimationApp;
});

define('davinci-eight/commands/BlendFactor',["require", "exports"], function (require, exports) {
    var BlendFactor;
    (function (BlendFactor) {
        BlendFactor[BlendFactor["DST_ALPHA"] = 0] = "DST_ALPHA";
        BlendFactor[BlendFactor["DST_COLOR"] = 1] = "DST_COLOR";
        BlendFactor[BlendFactor["ONE"] = 2] = "ONE";
        BlendFactor[BlendFactor["ONE_MINUS_DST_ALPHA"] = 3] = "ONE_MINUS_DST_ALPHA";
        BlendFactor[BlendFactor["ONE_MINUS_DST_COLOR"] = 4] = "ONE_MINUS_DST_COLOR";
        BlendFactor[BlendFactor["ONE_MINUS_SRC_ALPHA"] = 5] = "ONE_MINUS_SRC_ALPHA";
        BlendFactor[BlendFactor["ONE_MINUS_SRC_COLOR"] = 6] = "ONE_MINUS_SRC_COLOR";
        BlendFactor[BlendFactor["SRC_ALPHA"] = 7] = "SRC_ALPHA";
        BlendFactor[BlendFactor["SRC_ALPHA_SATURATE"] = 8] = "SRC_ALPHA_SATURATE";
        BlendFactor[BlendFactor["SRC_COLOR"] = 9] = "SRC_COLOR";
        BlendFactor[BlendFactor["ZERO"] = 10] = "ZERO";
    })(BlendFactor || (BlendFactor = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BlendFactor;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLBlendFunc',["require", "exports", '../commands/BlendFactor', '../base/incLevel', '../core/ShareableBase'], function (require, exports, BlendFactor_1, incLevel_1, ShareableBase_1) {
    var factors = [
        BlendFactor_1.default.DST_ALPHA,
        BlendFactor_1.default.DST_COLOR,
        BlendFactor_1.default.ONE,
        BlendFactor_1.default.ONE_MINUS_DST_ALPHA,
        BlendFactor_1.default.ONE_MINUS_DST_COLOR,
        BlendFactor_1.default.ONE_MINUS_SRC_ALPHA,
        BlendFactor_1.default.ONE_MINUS_SRC_COLOR,
        BlendFactor_1.default.SRC_ALPHA,
        BlendFactor_1.default.SRC_ALPHA_SATURATE,
        BlendFactor_1.default.SRC_COLOR,
        BlendFactor_1.default.ZERO
    ];
    function mustBeFactor(name, factor) {
        if (factors.indexOf(factor) >= 0) {
            return factor;
        }
        else {
            throw new Error(factor + " is not a valid factor.");
        }
    }
    function factor(factor, gl) {
        switch (factor) {
            case BlendFactor_1.default.ONE: return gl.ONE;
            case BlendFactor_1.default.SRC_ALPHA: return gl.SRC_ALPHA;
            default: {
                throw new Error(factor + " is not a valid factor.");
            }
        }
    }
    var WebGLBlendFunc = (function (_super) {
        __extends(WebGLBlendFunc, _super);
        function WebGLBlendFunc(sfactor, dfactor) {
            _super.call(this);
            this.setLoggingName('WebGLBlendFunc');
            this.sfactor = mustBeFactor('sfactor', sfactor);
            this.dfactor = mustBeFactor('dfactor', dfactor);
        }
        WebGLBlendFunc.prototype.destructor = function (level) {
            this.sfactor = void 0;
            this.dfactor = void 0;
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        WebGLBlendFunc.prototype.contextFree = function (manager) {
        };
        WebGLBlendFunc.prototype.contextGain = function (manager) {
            this.execute(manager.gl);
        };
        WebGLBlendFunc.prototype.contextLost = function () {
        };
        WebGLBlendFunc.prototype.execute = function (gl) {
            gl.blendFunc(factor(this.sfactor, gl), factor(this.dfactor, gl));
        };
        return WebGLBlendFunc;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLBlendFunc;
});

define('davinci-eight/math/VectorN',["require", "exports", '../checks/isDefined', '../checks/isUndefined', '../checks/mustSatisfy'], function (require, exports, isDefined_1, isUndefined_1, mustSatisfy_1) {
    function pushString(T) {
        return "push(value: " + T + "): number";
    }
    function popString(T) {
        return "pop(): " + T;
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
    var VectorN = (function () {
        function VectorN(data, modified, size) {
            if (modified === void 0) { modified = false; }
            this.modified = modified;
            if (isDefined_1.default(size)) {
                this._size = size;
                this._coords = data;
                mustSatisfy_1.default('data.length', data.length === size, function () { return "" + size; });
            }
            else {
                this._size = void 0;
                this._coords = data;
            }
        }
        Object.defineProperty(VectorN.prototype, "coords", {
            get: function () {
                return this._coords;
            },
            set: function (data) {
                this._coords = data;
                this.modified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorN.prototype, "length", {
            get: function () {
                return this.coords.length;
            },
            enumerable: true,
            configurable: true
        });
        VectorN.prototype.clone = function () {
            return new VectorN(this._coords, this.modified, this._size);
        };
        VectorN.prototype.getComponent = function (index) {
            return this.coords[index];
        };
        VectorN.prototype.pop = function () {
            if (isUndefined_1.default(this._size)) {
                return this.coords.pop();
            }
            else {
                throw new Error(verbotenPop());
            }
        };
        VectorN.prototype.push = function (value) {
            if (isUndefined_1.default(this._size)) {
                var data = this.coords;
                var newLength = data.push(value);
                this.coords = data;
                return newLength;
            }
            else {
                throw new Error(verbotenPush());
            }
        };
        VectorN.prototype.setComponent = function (index, value) {
            var coords = this.coords;
            var previous = coords[index];
            if (value !== previous) {
                coords[index] = value;
                this.coords = coords;
                this.modified = true;
            }
        };
        VectorN.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            var data = this.coords;
            var length = data.length;
            for (var i = 0; i < length; i++) {
                array[offset + i] = data[i];
            }
            return array;
        };
        VectorN.prototype.toLocaleString = function () {
            return this.coords.toLocaleString();
        };
        VectorN.prototype.toString = function () {
            return this.coords.toString();
        };
        return VectorN;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VectorN;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Coords',["require", "exports", './VectorN'], function (require, exports, VectorN_1) {
    var Coords = (function (_super) {
        __extends(Coords, _super);
        function Coords(data, modified, size) {
            _super.call(this, data, modified, size);
        }
        Coords.prototype.approx = function (n) {
            var max = 0;
            var iLen = this._coords.length;
            for (var i = 0; i < iLen; i++) {
                max = Math.max(max, Math.abs(this._coords[i]));
            }
            var threshold = max * Math.pow(10, -n);
            for (var i = 0; i < iLen; i++) {
                if (Math.abs(this._coords[i]) < threshold) {
                    this._coords[i] = 0;
                }
            }
        };
        Coords.prototype.equals = function (coords) {
            if (coords instanceof Coords) {
                var iLen = this._coords.length;
                for (var i = 0; i < iLen; i++) {
                    if (this.coords[i] !== coords[i]) {
                        console.log(i + " is different");
                        return false;
                    }
                }
                return true;
            }
            else {
                console.log("It's not a Coords");
                return false;
            }
        };
        return Coords;
    })(VectorN_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Coords;
});

define('davinci-eight/checks/isNull',["require", "exports"], function (require, exports) {
    function default_1(x) {
        return x === null;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/arraysEQ',["require", "exports", '../checks/isDefined', '../checks/isNull', '../checks/isUndefined'], function (require, exports, isDefined_1, isNull_1, isUndefined_1) {
    function default_1(a, b) {
        if (isDefined_1.default(a)) {
            if (isDefined_1.default(b)) {
                if (!isNull_1.default(a)) {
                    if (!isNull_1.default(b)) {
                        var aLen = a.length;
                        var bLen = b.length;
                        if (aLen === bLen) {
                            for (var i = 0; i < aLen; i++) {
                                if (a[i] !== b[i]) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return isNull_1.default(b);
                }
            }
            else {
                return false;
            }
        }
        else {
            return isUndefined_1.default(b);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/dotVectorCartesianE3',["require", "exports"], function (require, exports) {
    function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
        return ax * bx + ay * by + az * bz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorCartesianE3;
});

define('davinci-eight/math/dotVectorE3',["require", "exports", '../math/dotVectorCartesianE3', '../checks/isDefined'], function (require, exports, dotVectorCartesianE3_1, isDefined_1) {
    function dotVectorE3(a, b) {
        if (isDefined_1.default(a) && isDefined_1.default(b)) {
            return dotVectorCartesianE3_1.default(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorE3;
});

define('davinci-eight/math/addE3',["require", "exports"], function (require, exports) {
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
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = addE3;
});

define('davinci-eight/geometries/b2',["require", "exports"], function (require, exports) {
    function b2p0(t, p) {
        var k = 1 - t;
        return k * k * p;
    }
    function b2p1(t, p) {
        return 2 * (1 - t) * t * p;
    }
    function b2p2(t, p) {
        return t * t * p;
    }
    function b2(t, begin, control, end) {
        return b2p0(t, begin) + b2p1(t, control) + b2p2(t, end);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = b2;
});

define('davinci-eight/geometries/b3',["require", "exports"], function (require, exports) {
    function b3p0(t, p) {
        var k = 1 - t;
        return k * k * k * p;
    }
    function b3p1(t, p) {
        var k = 1 - t;
        return 3 * k * k * t * p;
    }
    function b3p2(t, p) {
        var k = 1 - t;
        return 3 * k * t * t * p;
    }
    function b3p3(t, p) {
        return t * t * t * p;
    }
    function default_1(t, p0, p1, p2, p3) {
        return b3p0(t, p0) + b3p1(t, p1) + b3p2(t, p2) + b3p3(t, p3);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/compG3Get',["require", "exports"], function (require, exports) {
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    function gcompE3(m, index) {
        switch (index) {
            case COORD_W:
                {
                    return m.α;
                }
                break;
            case COORD_X:
                {
                    return m.x;
                }
                break;
            case COORD_Y:
                {
                    return m.y;
                }
                break;
            case COORD_Z:
                {
                    return m.z;
                }
                break;
            case COORD_XY:
                {
                    return m.xy;
                }
                break;
            case COORD_YZ:
                {
                    return m.yz;
                }
                break;
            case COORD_ZX:
                {
                    return m.zx;
                }
                break;
            case COORD_XYZ:
                {
                    return m.β;
                }
                break;
            default: {
                throw new Error("index => " + index);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gcompE3;
});

define('davinci-eight/math/extE3',["require", "exports"], function (require, exports) {
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
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = extE3;
});

define('davinci-eight/math/compG3Set',["require", "exports"], function (require, exports) {
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    function compG3Set(m, index, value) {
        switch (index) {
            case COORD_W:
                {
                    m.α = value;
                }
                break;
            case COORD_X:
                {
                    m.x = value;
                }
                break;
            case COORD_Y:
                {
                    m.y = value;
                }
                break;
            case COORD_Z:
                {
                    m.z = value;
                }
                break;
            case COORD_XY:
                {
                    m.xy = value;
                }
                break;
            case COORD_YZ:
                {
                    m.yz = value;
                }
                break;
            case COORD_ZX:
                {
                    m.zx = value;
                }
                break;
            case COORD_XYZ:
                {
                    m.β = value;
                }
                break;
            default:
                throw new Error("index => " + index);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = compG3Set;
});

define('davinci-eight/math/extG3',["require", "exports", '../math/compG3Get', '../math/extE3', '../math/compG3Set'], function (require, exports, compG3Get_1, extE3_1, compG3Set_1) {
    function extG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, extE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = extG3;
});

define('davinci-eight/math/lcoE3',["require", "exports"], function (require, exports) {
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
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoE3;
});

define('davinci-eight/math/lcoG3',["require", "exports", '../math/compG3Get', '../math/lcoE3', '../math/compG3Set'], function (require, exports, compG3Get_1, lcoE3_1, compG3Set_1) {
    function lcoG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, lcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoG3;
});

define('davinci-eight/math/mulE3',["require", "exports"], function (require, exports) {
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
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulE3;
});

define('davinci-eight/math/mulG3',["require", "exports", '../math/compG3Get', '../math/mulE3'], function (require, exports, compG3Get_1, mulE3_1) {
    function default_1(a, b, out) {
        var a0 = a.α;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.z;
        var a4 = a.xy;
        var a5 = a.yz;
        var a6 = a.zx;
        var a7 = a.β;
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        var iLen = out.length;
        for (var i = 0; i < iLen; i++) {
            out[i] = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/gauss',["require", "exports"], function (require, exports) {
    var abs = Math.abs;
    function makeColumnVector(n, v) {
        var a = [];
        for (var i = 0; i < n; i++) {
            a.push(v);
        }
        return a;
    }
    function rowWithMaximumInColumn(A, column, N) {
        var biggest = abs(A[column][column]);
        var maxRow = column;
        for (var row = column + 1; row < N; row++) {
            if (abs(A[row][column]) > biggest) {
                biggest = abs(A[row][column]);
                maxRow = row;
            }
        }
        return maxRow;
    }
    function swapRows(A, i, j, N) {
        var colLength = N + 1;
        for (var column = i; column < colLength; column++) {
            var temp = A[j][column];
            A[j][column] = A[i][column];
            A[i][column] = temp;
        }
    }
    function makeZeroBelow(A, i, N) {
        for (var row = i + 1; row < N; row++) {
            var c = -A[row][i] / A[i][i];
            for (var column = i; column < N + 1; column++) {
                if (i === column) {
                    A[row][column] = 0;
                }
                else {
                    A[row][column] += c * A[i][column];
                }
            }
        }
    }
    function solve(A, N) {
        var x = makeColumnVector(N, 0);
        for (var i = N - 1; i > -1; i--) {
            x[i] = A[i][N] / A[i][i];
            for (var k = i - 1; k > -1; k--) {
                A[k][N] -= A[k][i] * x[i];
            }
        }
        return x;
    }
    function gauss(A, b) {
        var N = A.length;
        for (var i = 0; i < N; i++) {
            var Ai = A[i];
            var bi = b[i];
            Ai.push(bi);
        }
        for (var j = 0; j < N; j++) {
            swapRows(A, j, rowWithMaximumInColumn(A, j, N), N);
            makeZeroBelow(A, j, N);
        }
        return solve(A, N);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gauss;
});

define('davinci-eight/i18n/notImplemented',["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString_1) {
    function default_1(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "'" + name + "' method is not yet implemented.";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/i18n/notSupported',["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString_1) {
    function default_1(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "Method `" + name + "` is not supported.";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/quadSpinorE3',["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined_1, isNumber_1) {
    function quadSpinorE3(s) {
        if (isDefined_1.default(s)) {
            var α = s.α;
            var x = s.yz;
            var y = s.zx;
            var z = s.xy;
            if (isNumber_1.default(α) && isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
                return α * α + x * x + y * y + z * z;
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadSpinorE3;
});

define('davinci-eight/math/rcoE3',["require", "exports"], function (require, exports) {
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
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoE3;
});

define('davinci-eight/math/rcoG3',["require", "exports", '../math/compG3Get', '../math/rcoE3', '../math/compG3Set'], function (require, exports, compG3Get_1, rcoE3_1, compG3Set_1) {
    function rcoG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, rcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoG3;
});

define('davinci-eight/math/scpG3',["require", "exports", '../math/compG3Get', '../math/mulE3', '../math/compG3Set'], function (require, exports, compG3Get_1, mulE3_1, compG3Set_1) {
    function scpG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        compG3Set_1.default(out, 0, mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
        compG3Set_1.default(out, 1, 0);
        compG3Set_1.default(out, 2, 0);
        compG3Set_1.default(out, 3, 0);
        compG3Set_1.default(out, 4, 0);
        compG3Set_1.default(out, 5, 0);
        compG3Set_1.default(out, 6, 0);
        compG3Set_1.default(out, 7, 0);
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = scpG3;
});

define('davinci-eight/math/squaredNormG3',["require", "exports"], function (require, exports) {
    function squaredNormG3(m) {
        var w = m.α;
        var x = m.x;
        var y = m.y;
        var z = m.z;
        var yz = m.yz;
        var zx = m.zx;
        var xy = m.xy;
        var v = m.β;
        return w * w + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + v * v;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = squaredNormG3;
});

define('davinci-eight/checks/isArray',["require", "exports"], function (require, exports) {
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isArray;
});

define('davinci-eight/checks/mustBeArray',["require", "exports", '../checks/mustSatisfy', '../checks/isArray'], function (require, exports, mustSatisfy_1, isArray_1) {
    function beAnArray() {
        return "be an array";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isArray_1.default(value), beAnArray, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/stringFromCoordinates',["require", "exports", '../checks/isDefined', '../checks/mustBeArray'], function (require, exports, isDefined_1, mustBeArray_1) {
    function isLabelOne(label) {
        if (typeof label === 'string') {
            return label === "1";
        }
        else {
            var labels = mustBeArray_1.default('label', label);
            if (labels.length === 2) {
                return isLabelOne(labels[0]) && isLabelOne(labels[1]);
            }
            else if (labels.length === 1) {
                return isLabelOne(labels[0]);
            }
            else {
                return false;
            }
        }
    }
    function appendLabel(coord, label, sb) {
        if (typeof label === 'string') {
            sb.push(label);
        }
        else {
            var labels = mustBeArray_1.default('label', label);
            if (labels.length === 2) {
                sb.push(coord > 0 ? labels[1] : labels[0]);
            }
            else if (labels.length === 1) {
                sb.push(labels[0]);
            }
            else if (labels.length === 0) {
            }
            else {
                throw new Error("Unexpected basis label array length: " + labels.length);
            }
        }
    }
    function appendCoord(coord, numberToString, label, sb) {
        if (coord !== 0) {
            if (coord >= 0) {
                if (sb.length > 0) {
                    sb.push("+");
                }
            }
            else {
                if (typeof label === 'string') {
                    sb.push("-");
                }
                else {
                    var labels = mustBeArray_1.default('label', label);
                    if (labels.length === 2) {
                        if (labels[0] !== labels[1]) {
                            if (sb.length > 0) {
                                sb.push("+");
                            }
                        }
                        else {
                            sb.push("-");
                        }
                    }
                    else if (labels.length === 1) {
                        sb.push("-");
                    }
                    else {
                        sb.push("-");
                    }
                }
            }
            var n = Math.abs(coord);
            if (n === 1) {
                appendLabel(coord, label, sb);
            }
            else {
                sb.push(numberToString(n));
                if (!isLabelOne(label)) {
                    sb.push("*");
                    appendLabel(coord, label, sb);
                }
                else {
                }
            }
        }
        else {
        }
    }
    function stringFromCoordinates(coordinates, numberToString, labels) {
        var sb = [];
        for (var i = 0, iLength = coordinates.length; i < iLength; i++) {
            var coord = coordinates[i];
            if (isDefined_1.default(coord)) {
                appendCoord(coord, numberToString, labels[i], sb);
            }
            else {
                return void 0;
            }
        }
        return sb.length > 0 ? sb.join("") : "0";
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = stringFromCoordinates;
});

define('davinci-eight/math/subE3',["require", "exports"], function (require, exports) {
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
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = subE3;
});

define('davinci-eight/math/QQ',["require", "exports", '../checks/mustBeInteger', '../i18n/readOnly'], function (require, exports, mustBeInteger_1, readOnly_1) {
    var magicCode = Math.random();
    var QQ = (function () {
        function QQ(n, d, code) {
            if (code !== magicCode) {
                throw new Error("Use the static create method instead of the constructor");
            }
            mustBeInteger_1.default('n', n);
            mustBeInteger_1.default('d', d);
            var g;
            var gcd = function (a, b) {
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
        Object.defineProperty(QQ.prototype, "numer", {
            get: function () {
                return this._numer;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('numer').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
            get: function () {
                return this._denom;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('denom').message);
            },
            enumerable: true,
            configurable: true
        });
        QQ.prototype.add = function (rhs) {
            return QQ.valueOf(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.sub = function (rhs) {
            return QQ.valueOf(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.mul = function (rhs) {
            return QQ.valueOf(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.div = function (rhs) {
            var numer = this._numer * rhs._denom;
            var denom = this._denom * rhs._numer;
            if (numer === 0) {
                if (denom === 0) {
                    return QQ.valueOf(numer, denom);
                }
                else {
                    return QQ.ZERO;
                }
            }
            else {
                if (denom === 0) {
                    return QQ.valueOf(numer, denom);
                }
                else {
                    return QQ.valueOf(numer, denom);
                }
            }
        };
        QQ.prototype.isOne = function () {
            return this._numer === 1 && this._denom === 1;
        };
        QQ.prototype.isZero = function () {
            return this._numer === 0 && this._denom === 1;
        };
        QQ.prototype.hashCode = function () {
            return 37 * this.numer + 13 * this.denom;
        };
        QQ.prototype.inv = function () {
            return QQ.valueOf(this._denom, this._numer);
        };
        QQ.prototype.neg = function () {
            return QQ.valueOf(-this._numer, this._denom);
        };
        QQ.prototype.equals = function (other) {
            if (other instanceof QQ) {
                return this._numer * other._denom === this._denom * other._numer;
            }
            else {
                return false;
            }
        };
        QQ.prototype.toString = function () {
            return "" + this._numer + "/" + this._denom + "";
        };
        QQ.prototype.__add__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.add(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__radd__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.add(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__sub__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.sub(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.sub(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__mul__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__div__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__pos__ = function () {
            return this;
        };
        QQ.prototype.__neg__ = function () {
            return this.neg();
        };
        QQ.valueOf = function (n, d) {
            if (n === 0) {
                if (d !== 0) {
                    return QQ.ZERO;
                }
                else {
                }
            }
            else if (d === 0) {
            }
            else if (n === d) {
                return QQ.ONE;
            }
            else if (n === 1) {
                if (d === 2) {
                    return QQ.POS_01_02;
                }
                else if (d === 3) {
                    return QQ.POS_01_03;
                }
                else if (d === 4) {
                    return QQ.POS_01_04;
                }
                else if (d === 5) {
                    return QQ.POS_01_05;
                }
                else if (d === -3) {
                    return QQ.NEG_01_03;
                }
            }
            else if (n === -1) {
                if (d === 1) {
                    return QQ.NEG_01_01;
                }
                else if (d === 3) {
                    return QQ.NEG_01_03;
                }
            }
            else if (n === 2) {
                if (d === 1) {
                    return QQ.POS_02_01;
                }
                else if (d === 3) {
                    return QQ.POS_02_03;
                }
            }
            else if (n === -2) {
                if (d === 1) {
                    return QQ.NEG_02_01;
                }
            }
            else if (n === 3) {
                if (d === 1) {
                    return QQ.POS_03_01;
                }
            }
            else if (n === -3) {
                if (d === 1) {
                    return QQ.NEG_03_01;
                }
            }
            else if (n === 4) {
                if (d === 1) {
                    return QQ.POS_04_01;
                }
            }
            else if (n === 5) {
                if (d === 1) {
                    return QQ.POS_05_01;
                }
            }
            else if (n === 6) {
                if (d === 1) {
                    return QQ.POS_06_01;
                }
            }
            else if (n === 7) {
                if (d === 1) {
                    return QQ.POS_07_01;
                }
            }
            else if (n === 8) {
                if (d === 1) {
                    return QQ.POS_08_01;
                }
            }
            return new QQ(n, d, magicCode);
        };
        QQ.POS_08_01 = new QQ(8, 1, magicCode);
        QQ.POS_07_01 = new QQ(7, 1, magicCode);
        QQ.POS_06_01 = new QQ(6, 1, magicCode);
        QQ.POS_05_01 = new QQ(5, 1, magicCode);
        QQ.POS_04_01 = new QQ(4, 1, magicCode);
        QQ.POS_03_01 = new QQ(3, 1, magicCode);
        QQ.POS_02_01 = new QQ(2, 1, magicCode);
        QQ.ONE = new QQ(1, 1, magicCode);
        QQ.POS_01_02 = new QQ(1, 2, magicCode);
        QQ.POS_01_03 = new QQ(1, 3, magicCode);
        QQ.POS_01_04 = new QQ(1, 4, magicCode);
        QQ.POS_01_05 = new QQ(1, 5, magicCode);
        QQ.ZERO = new QQ(0, 1, magicCode);
        QQ.NEG_01_03 = new QQ(-1, 3, magicCode);
        QQ.NEG_01_01 = new QQ(-1, 1, magicCode);
        QQ.NEG_02_01 = new QQ(-2, 1, magicCode);
        QQ.NEG_03_01 = new QQ(-3, 1, magicCode);
        QQ.POS_02_03 = new QQ(2, 3, magicCode);
        return QQ;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = QQ;
});

define('davinci-eight/math/Dimensions',["require", "exports", '../math/QQ', '../i18n/notSupported'], function (require, exports, QQ_1, notSupported_1) {
    var R0 = QQ_1.default.valueOf(0, 1);
    var R1 = QQ_1.default.valueOf(1, 1);
    var R2 = QQ_1.default.valueOf(2, 1);
    var M1 = QQ_1.default.valueOf(-1, 1);
    function assertArgRational(name, arg) {
        if (arg instanceof QQ_1.default) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a QQ");
        }
    }
    var Dimensions = (function () {
        function Dimensions(M, L, T, Q, temperature, amount, intensity) {
            this.M = M;
            this.L = L;
            this.T = T;
            this.Q = Q;
            this.temperature = temperature;
            this.amount = amount;
            this.intensity = intensity;
            assertArgRational('M', M);
            assertArgRational('L', L);
            assertArgRational('T', T);
            assertArgRational('Q', Q);
            assertArgRational('temperature', temperature);
            assertArgRational('amount', amount);
            assertArgRational('intensity', intensity);
            if (arguments.length !== 7) {
                throw new Error("Expecting 7 arguments");
            }
        }
        Dimensions.prototype.compatible = function (rhs) {
            if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
                return this;
            }
            else {
                if (this.isOne()) {
                    if (rhs.isOne()) {
                        throw new Error();
                    }
                    else {
                        throw new Error("Dimensions must be equal (dimensionless, " + rhs + ")");
                    }
                }
                else {
                    if (rhs.isOne()) {
                        throw new Error("Dimensions must be equal (" + this + ", dimensionless)");
                    }
                    else {
                        throw new Error("Dimensions must be equal (" + this + ", " + rhs + ")");
                    }
                }
            }
        };
        Dimensions.prototype.mul = function (rhs) {
            return new Dimensions(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        Dimensions.prototype.div = function (rhs) {
            return new Dimensions(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        Dimensions.prototype.pow = function (exponent) {
            return new Dimensions(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        Dimensions.prototype.sqrt = function () {
            return new Dimensions(this.M.div(R2), this.L.div(R2), this.T.div(R2), this.Q.div(R2), this.temperature.div(R2), this.amount.div(R2), this.intensity.div(R2));
        };
        Dimensions.prototype.isOne = function () {
            return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        Dimensions.prototype.isZero = function () {
            throw new Error(notSupported_1.default('isZero').message);
        };
        Dimensions.prototype.inv = function () {
            return new Dimensions(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
        };
        Dimensions.prototype.neg = function () {
            throw new Error(notSupported_1.default('neg').message);
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
            return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
                return typeof x === 'string';
            }).join(" * ");
        };
        Dimensions.prototype.__add__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.compatible(rhs);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.compatible(this);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.compatible(rhs);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.compatible(this);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__div__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__pos__ = function () {
            return this;
        };
        Dimensions.prototype.__neg__ = function () {
            return this;
        };
        Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0);
        Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
        Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
        Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
        Dimensions.CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
        Dimensions.CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0);
        Dimensions.TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
        Dimensions.AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
        Dimensions.INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1);
        return Dimensions;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Dimensions;
});

define('davinci-eight/math/Unit',["require", "exports", '../math/Dimensions', '../i18n/notImplemented', '../i18n/notSupported'], function (require, exports, Dimensions_1, notImplemented_1, notSupported_1) {
    var SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];
    var patterns = [
        [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
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
        ["C/kg"],
        ["C/m ** 3"],
        ["J/kg"],
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
    var dumbString = function (multiplier, formatted, dimensions, labels) {
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
        var operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
        var scaleString = multiplier === 1 ? "" : formatted;
        var unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
            return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
    };
    var unitString = function (multiplier, formatted, dimensions, labels) {
        var M = dimensions.M;
        var L = dimensions.L;
        var T = dimensions.T;
        var Q = dimensions.Q;
        var temperature = dimensions.temperature;
        var amount = dimensions.amount;
        var intensity = dimensions.intensity;
        for (var i = 0, len = patterns.length; i < len; i++) {
            var pattern = patterns[i];
            if (M.numer === pattern[0] && M.denom === pattern[1] &&
                L.numer === pattern[2] && L.denom === pattern[3] &&
                T.numer === pattern[4] && T.denom === pattern[5] &&
                Q.numer === pattern[6] && Q.denom === pattern[7] &&
                temperature.numer === pattern[8] && temperature.denom === pattern[9] &&
                amount.numer === pattern[10] && amount.denom === pattern[11] &&
                intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
                if (multiplier !== 1) {
                    return multiplier + " * " + decodes[i][0];
                }
                else {
                    return decodes[i][0];
                }
            }
        }
        return dumbString(multiplier, formatted, dimensions, labels);
    };
    function add(lhs, rhs) {
        return new Unit(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function sub(lhs, rhs) {
        return new Unit(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function mul(lhs, rhs) {
        return new Unit(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
    }
    function scale(α, unit) {
        return new Unit(α * unit.multiplier, unit.dimensions, unit.labels);
    }
    function div(lhs, rhs) {
        return new Unit(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
    }
    var Unit = (function () {
        function Unit(multiplier, dimensions, labels) {
            this.multiplier = multiplier;
            this.dimensions = dimensions;
            this.labels = labels;
            if (labels.length !== 7) {
                throw new Error("Expecting 7 elements in the labels array.");
            }
            this.multiplier = multiplier;
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
            return add(this, rhs);
        };
        Unit.prototype.__add__ = function (rhs) {
            if (rhs instanceof Unit) {
                return add(this, rhs);
            }
            else {
                return;
            }
        };
        Unit.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Unit) {
                return add(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.sub = function (rhs) {
            return sub(this, rhs);
        };
        Unit.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Unit) {
                return sub(this, rhs);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Unit) {
                return sub(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.mul = function (rhs) {
            return mul(this, rhs);
        };
        Unit.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Unit) {
                return mul(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return scale(rhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Unit) {
                return mul(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return scale(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.div = function (rhs) {
            return div(this, rhs);
        };
        Unit.prototype.divByScalar = function (α) {
            return new Unit(this.multiplier / α, this.dimensions, this.labels);
        };
        Unit.prototype.__div__ = function (other) {
            if (other instanceof Unit) {
                return div(this, other);
            }
            else if (typeof other === 'number') {
                return new Unit(this.multiplier / other, this.dimensions, this.labels);
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
                return new Unit(other / this.multiplier, this.dimensions.inv(), this.labels);
            }
            else {
                return;
            }
        };
        Unit.prototype.pattern = function () {
            var ns = [];
            ns.push(this.dimensions.M.numer);
            ns.push(this.dimensions.M.denom);
            ns.push(this.dimensions.L.numer);
            ns.push(this.dimensions.L.denom);
            ns.push(this.dimensions.T.numer);
            ns.push(this.dimensions.T.denom);
            ns.push(this.dimensions.Q.numer);
            ns.push(this.dimensions.Q.denom);
            ns.push(this.dimensions.temperature.numer);
            ns.push(this.dimensions.temperature.denom);
            ns.push(this.dimensions.amount.numer);
            ns.push(this.dimensions.amount.denom);
            ns.push(this.dimensions.intensity.numer);
            ns.push(this.dimensions.intensity.denom);
            return JSON.stringify(ns);
        };
        Unit.prototype.pow = function (exponent) {
            return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        Unit.prototype.inv = function () {
            return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
        };
        Unit.prototype.neg = function () {
            return new Unit(-this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.isOne = function () {
            return this.dimensions.isOne() && (this.multiplier === 1);
        };
        Unit.prototype.isZero = function () {
            return this.dimensions.isZero() || (this.multiplier === 0);
        };
        Unit.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        Unit.prototype.norm = function () {
            return new Unit(Math.abs(this.multiplier), this.dimensions, this.labels);
        };
        Unit.prototype.quad = function () {
            return new Unit(this.multiplier * this.multiplier, this.dimensions.mul(this.dimensions), this.labels);
        };
        Unit.prototype.reflect = function (n) {
            return this;
        };
        Unit.prototype.rotate = function (rotor) {
            return this;
        };
        Unit.prototype.scale = function (α) {
            return new Unit(this.multiplier * α, this.dimensions, this.labels);
        };
        Unit.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        Unit.prototype.sqrt = function () {
            return new Unit(Math.sqrt(this.multiplier), this.dimensions.sqrt(), this.labels);
        };
        Unit.prototype.stress = function (σ) {
            throw new Error(notSupported_1.default('stress').message);
        };
        Unit.prototype.toExponential = function (fractionDigits) {
            return unitString(this.multiplier, this.multiplier.toExponential(fractionDigits), this.dimensions, this.labels);
        };
        Unit.prototype.toFixed = function (fractionDigits) {
            return unitString(this.multiplier, this.multiplier.toFixed(fractionDigits), this.dimensions, this.labels);
        };
        Unit.prototype.toPrecision = function (precision) {
            return unitString(this.multiplier, this.multiplier.toPrecision(precision), this.dimensions, this.labels);
        };
        Unit.prototype.toString = function (radix) {
            return unitString(this.multiplier, this.multiplier.toString(radix), this.dimensions, this.labels);
        };
        Unit.prototype.__pos__ = function () {
            return this;
        };
        Unit.prototype.__neg__ = function () {
            return this.neg();
        };
        Unit.isOne = function (uom) {
            if (uom === void 0) {
                return true;
            }
            else if (uom instanceof Unit) {
                return uom.isOne();
            }
            else {
                throw new Error("isOne argument must be a Unit or undefined.");
            }
        };
        Unit.assertDimensionless = function (uom) {
            if (!Unit.isOne(uom)) {
                throw new Error("uom must be dimensionless.");
            }
        };
        Unit.compatible = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.compatible(rhs);
                }
                else {
                    if (lhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new Error(lhs + " is incompatible with 1");
                    }
                }
            }
            else {
                if (rhs) {
                    if (rhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new Error("1 is incompatible with " + rhs);
                    }
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.mul = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.mul(rhs);
                }
                else if (Unit.isOne(rhs)) {
                    return lhs;
                }
                else {
                    return void 0;
                }
            }
            else if (Unit.isOne(lhs)) {
                return rhs;
            }
            else {
                return void 0;
            }
        };
        Unit.div = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.div(rhs);
                }
                else {
                    return lhs;
                }
            }
            else {
                if (rhs) {
                    return rhs.inv();
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.sqrt = function (uom) {
            if (typeof uom !== 'undefined') {
                if (!uom.isOne()) {
                    return new Unit(Math.sqrt(uom.multiplier), uom.dimensions.sqrt(), uom.labels);
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        };
        Unit.ONE = new Unit(1.0, Dimensions_1.default.ONE, SYMBOLS_SI);
        Unit.KILOGRAM = new Unit(1.0, Dimensions_1.default.MASS, SYMBOLS_SI);
        Unit.METER = new Unit(1.0, Dimensions_1.default.LENGTH, SYMBOLS_SI);
        Unit.SECOND = new Unit(1.0, Dimensions_1.default.TIME, SYMBOLS_SI);
        Unit.COULOMB = new Unit(1.0, Dimensions_1.default.CHARGE, SYMBOLS_SI);
        Unit.AMPERE = new Unit(1.0, Dimensions_1.default.CURRENT, SYMBOLS_SI);
        Unit.KELVIN = new Unit(1.0, Dimensions_1.default.TEMPERATURE, SYMBOLS_SI);
        Unit.MOLE = new Unit(1.0, Dimensions_1.default.AMOUNT, SYMBOLS_SI);
        Unit.CANDELA = new Unit(1.0, Dimensions_1.default.INTENSITY, SYMBOLS_SI);
        return Unit;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Unit;
});

define('davinci-eight/math/BASIS_LABELS_G3_GEOMETRIC',["require", "exports"], function (require, exports) {
    var SCALAR_POS_SYMBOL = "1";
    var E1_NEG_SYMBOL = "←";
    var E1_POS_SYMBOL = "→";
    var E2_POS_SYMBOL = "↑";
    var E2_NEG_SYMBOL = "↓";
    var E3_POS_SYMBOL = "⊙";
    var E3_NEG_SYMBOL = "⊗";
    var E12_NEG_SYMBOL = "↻";
    var E12_POS_SYMBOL = "↺";
    var E31_POS_SYMBOL = "⊶";
    var E31_NEG_SYMBOL = "⊷";
    var E23_NEG_SYMBOL = "⬘";
    var E23_POS_SYMBOL = "⬙";
    var PSEUDO_POS_SYMBOL = "☐";
    var PSEUDO_NEG_SYMBOL = "■";
    var BASIS_LABELS_G3_GEOMETRIC = [
        [SCALAR_POS_SYMBOL, SCALAR_POS_SYMBOL],
        [E1_NEG_SYMBOL, E1_POS_SYMBOL],
        [E2_NEG_SYMBOL, E2_POS_SYMBOL],
        [E3_NEG_SYMBOL, E3_POS_SYMBOL],
        [E12_NEG_SYMBOL, E12_POS_SYMBOL],
        [E23_NEG_SYMBOL, E23_POS_SYMBOL],
        [E31_NEG_SYMBOL, E31_POS_SYMBOL],
        [PSEUDO_NEG_SYMBOL, PSEUDO_POS_SYMBOL]
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BASIS_LABELS_G3_GEOMETRIC;
});

define('davinci-eight/math/BASIS_LABELS_G3_HAMILTON',["require", "exports"], function (require, exports) {
    var SCALAR_SYMBOL = "1";
    var E1_SYMBOL = "i";
    var E2_SYMBOL = "j";
    var E3_SYMBOL = "k";
    var E12_SYMBOL = "ij";
    var E23_SYMBOL = "jk";
    var E31_SYMBOL = "ki";
    var PSEUDO_SYMBOL = "ijk";
    var BASIS_LABELS_G3_HAMILTON = [
        [SCALAR_SYMBOL],
        [E1_SYMBOL],
        [E2_SYMBOL],
        [E3_SYMBOL],
        [E12_SYMBOL],
        [E23_SYMBOL],
        [E31_SYMBOL],
        [PSEUDO_SYMBOL]
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BASIS_LABELS_G3_HAMILTON;
});

define('davinci-eight/math/BASIS_LABELS_G3_STANDARD',["require", "exports"], function (require, exports) {
    var SCALAR_SYMBOL = "1";
    var E1_SYMBOL = "e1";
    var E2_SYMBOL = "e2";
    var E3_SYMBOL = "e3";
    var E12_SYMBOL = "e12";
    var E23_SYMBOL = "e23";
    var E31_SYMBOL = "e31";
    var PSEUDO_SYMBOL = "I";
    var BASIS_LABELS_G3_STANDARD = [
        [SCALAR_SYMBOL],
        [E1_SYMBOL],
        [E2_SYMBOL],
        [E3_SYMBOL],
        [E12_SYMBOL],
        [E23_SYMBOL],
        [E31_SYMBOL],
        [PSEUDO_SYMBOL]
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BASIS_LABELS_G3_STANDARD;
});

define('davinci-eight/math/BASIS_LABELS_G3_STANDARD_HTML',["require", "exports"], function (require, exports) {
    var SCALAR_SYMBOL = "1";
    var E1_SYMBOL = "<b>e</b><sub>1</sub>";
    var E2_SYMBOL = "<b>e</b><sub>2</sub>";
    var E3_SYMBOL = "<b>e</b><sub>3</sub>";
    var E12_SYMBOL = E1_SYMBOL + E2_SYMBOL;
    var E23_SYMBOL = E2_SYMBOL + E3_SYMBOL;
    var E31_SYMBOL = E3_SYMBOL + E1_SYMBOL;
    var PSEUDO_SYMBOL = E1_SYMBOL + E2_SYMBOL + E3_SYMBOL;
    var BASIS_LABELS_G3_STANDARD_HTML = [
        [SCALAR_SYMBOL],
        [E1_SYMBOL],
        [E2_SYMBOL],
        [E3_SYMBOL],
        [E12_SYMBOL],
        [E23_SYMBOL],
        [E31_SYMBOL],
        [PSEUDO_SYMBOL]
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BASIS_LABELS_G3_STANDARD_HTML;
});

define('davinci-eight/math/G3',["require", "exports", './addE3', '../geometries/b2', '../geometries/b3', './extG3', './lcoG3', './mulG3', './gauss', '../i18n/notImplemented', '../i18n/notSupported', './quadSpinorE3', './rcoG3', '../i18n/readOnly', './scpG3', './squaredNormG3', './stringFromCoordinates', './subE3', './Unit', './BASIS_LABELS_G3_GEOMETRIC', './BASIS_LABELS_G3_HAMILTON', './BASIS_LABELS_G3_STANDARD', './BASIS_LABELS_G3_STANDARD_HTML'], function (require, exports, addE3_1, b2_1, b3_1, extG3_1, lcoG3_1, mulG3_1, gauss_1, notImplemented_1, notSupported_1, quadSpinorE3_1, rcoG3_1, readOnly_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, subE3_1, Unit_1, BASIS_LABELS_G3_GEOMETRIC_1, BASIS_LABELS_G3_HAMILTON_1, BASIS_LABELS_G3_STANDARD_1, BASIS_LABELS_G3_STANDARD_HTML_1) {
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_PSEUDO = 7;
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
    var G3 = (function () {
        function G3(α, x, y, z, xy, yz, zx, β, uom) {
            this._coords = [0, 0, 0, 0, 0, 0, 0, 0];
            this._coords[COORD_SCALAR] = α;
            this._coords[COORD_X] = x;
            this._coords[COORD_Y] = y;
            this._coords[COORD_Z] = z;
            this._coords[COORD_XY] = xy;
            this._coords[COORD_YZ] = yz;
            this._coords[COORD_ZX] = zx;
            this._coords[COORD_PSEUDO] = β;
            this.uom = uom;
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this._coords[COORD_SCALAR] *= multiplier;
                this._coords[COORD_X] *= multiplier;
                this._coords[COORD_Y] *= multiplier;
                this._coords[COORD_Z] *= multiplier;
                this._coords[COORD_XY] *= multiplier;
                this._coords[COORD_YZ] *= multiplier;
                this._coords[COORD_ZX] *= multiplier;
                this._coords[COORD_PSEUDO] *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(G3, "BASIS_LABELS_GEOMETRIC", {
            get: function () { return BASIS_LABELS_G3_GEOMETRIC_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_HAMILTON", {
            get: function () { return BASIS_LABELS_G3_HAMILTON_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_STANDARD", {
            get: function () { return BASIS_LABELS_G3_STANDARD_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_STANDARD_HTML", {
            get: function () { return BASIS_LABELS_G3_STANDARD_HTML_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3.prototype, "α", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "alpha", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('alpha').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "x", {
            get: function () {
                return this._coords[COORD_X];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "y", {
            get: function () {
                return this._coords[COORD_Y];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "z", {
            get: function () {
                return this._coords[COORD_Z];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('z').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "xy", {
            get: function () {
                return this._coords[COORD_XY];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('xy').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "yz", {
            get: function () {
                return this._coords[COORD_YZ];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('yz').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "zx", {
            get: function () {
                return this._coords[COORD_ZX];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('zx').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "β", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('β').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "beta", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('beta').message);
            },
            enumerable: true,
            configurable: true
        });
        G3.fromCartesian = function (α, x, y, z, xy, yz, zx, β, uom) {
            return new G3(α, x, y, z, xy, yz, zx, β, uom);
        };
        Object.defineProperty(G3.prototype, "coords", {
            get: function () {
                return [this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β];
            },
            enumerable: true,
            configurable: true
        });
        G3.prototype.coordinate = function (index) {
            switch (index) {
                case 0:
                    return this.α;
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
                    return this.β;
                default:
                    throw new Error("index must be in the range [0..7]");
            }
        };
        G3.prototype.add = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return G3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(addE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G3.prototype.addPseudo = function (β) {
            return new G3(this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β + β.multiplier, Unit_1.default.compatible(this.uom, β));
        };
        G3.prototype.addScalar = function (α) {
            return new G3(this.α + α.multiplier, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β, Unit_1.default.compatible(this.uom, α));
        };
        G3.prototype.__add__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.add(rhs);
            }
            else if (rhs instanceof Unit_1.default) {
                return this.addScalar(rhs);
            }
        };
        G3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.add(this);
            }
            else if (lhs instanceof Unit_1.default) {
                return this.addScalar(lhs);
            }
        };
        G3.prototype.adj = function () {
            throw new Error(notImplemented_1.default('adj').message);
        };
        G3.prototype.angle = function () {
            return this.log().grade(2);
        };
        G3.prototype.conj = function () {
            return new G3(this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.β, this.uom);
        };
        G3.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var z = b3_1.default(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
            return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.direction = function () {
            return this.div(this.norm());
        };
        G3.prototype.sub = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return G3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(subE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.sub(rhs);
            }
            else if (rhs instanceof Unit_1.default) {
                return this.addScalar(rhs.neg());
            }
        };
        G3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.sub(this);
            }
            else if (lhs instanceof Unit_1.default) {
                return this.neg().addScalar(lhs);
            }
        };
        G3.prototype.mul = function (rhs) {
            var out = new G3(0, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            mulG3_1.default(this, rhs, out._coords);
            return out;
        };
        G3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        G3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        G3.prototype.scale = function (α) {
            return new G3(this.α * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.β * α, this.uom);
        };
        G3.prototype.div = function (rhs) {
            return this.mul(rhs.inv());
        };
        G3.prototype.divByScalar = function (α) {
            return new G3(this.α / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.β / α, this.uom);
        };
        G3.prototype.__div__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.div(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.divByScalar(rhs);
            }
        };
        G3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.div(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
            }
        };
        G3.prototype.dual = function () {
            throw new Error(notImplemented_1.default('dual').message);
        };
        G3.prototype.scp = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            scpG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.ext = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            extG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scp(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.scp(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
            }
        };
        G3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        G3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.ext(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        G3.prototype.lco = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            lcoG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.lco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.lco(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
            }
        };
        G3.prototype.rco = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            rcoG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.rco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.rco(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
            }
        };
        G3.prototype.pow = function (exponent) {
            throw new Error('pow');
        };
        G3.prototype.__bang__ = function () {
            return this.inv();
        };
        G3.prototype.__pos__ = function () {
            return this;
        };
        G3.prototype.neg = function () {
            return new G3(-this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
        };
        G3.prototype.__neg__ = function () {
            return this.neg();
        };
        G3.prototype.rev = function () {
            return new G3(this.α, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
        };
        G3.prototype.__tilde__ = function () {
            return this.rev();
        };
        G3.prototype.grade = function (grade) {
            switch (grade) {
                case 0:
                    return G3.fromCartesian(this.α, 0, 0, 0, 0, 0, 0, 0, this.uom);
                case 1:
                    return G3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
                case 2:
                    return G3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
                case 3:
                    return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.β, this.uom);
                default:
                    return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        G3.prototype.cross = function (vector) {
            var x;
            var x1;
            var x2;
            var y;
            var y1;
            var y2;
            var z;
            var z1;
            var z2;
            x1 = this.x;
            y1 = this.y;
            z1 = this.z;
            x2 = vector.x;
            y2 = vector.y;
            z2 = vector.z;
            x = y1 * z2 - z1 * y2;
            y = z1 * x2 - x1 * z2;
            z = x1 * y2 - y1 * x2;
            return new G3(0, x, y, z, 0, 0, 0, 0, Unit_1.default.mul(this.uom, vector.uom));
        };
        G3.prototype.isOne = function () {
            return (this.α === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
        };
        G3.prototype.isZero = function () {
            return (this.α === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
        };
        G3.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        G3.prototype.cos = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var cosW = Math.cos(this.α);
            return new G3(cosW, 0, 0, 0, 0, 0, 0, 0);
        };
        G3.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        G3.prototype.distanceTo = function (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        };
        G3.prototype.equals = function (other) {
            if (this.α === other.α && this.x === other.x && this.y === other.y && this.z === other.z && this.xy === other.xy && this.yz === other.yz && this.zx === other.zx && this.β === other.β) {
                if (this.uom) {
                    if (other.uom) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (other.uom) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            else {
                return false;
            }
        };
        G3.prototype.exp = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var bivector = this.grade(2);
            var a = bivector.norm();
            if (!a.isZero()) {
                var c = a.cos();
                var s = a.sin();
                var B = bivector.direction();
                return c.add(B.mul(s));
            }
            else {
                return new G3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        G3.prototype.inv = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var xy = this.xy;
            var yz = this.yz;
            var zx = this.zx;
            var β = this.β;
            var A = [
                [α, x, y, z, -xy, -yz, -zx, -β],
                [x, α, xy, -zx, -y, -β, z, -yz],
                [y, -xy, α, yz, x, -z, -β, -zx],
                [z, zx, -yz, α, -β, y, -x, -xy],
                [xy, -y, x, β, α, zx, -yz, z],
                [yz, β, -z, y, -zx, α, xy, x],
                [zx, z, β, -x, yz, -xy, α, y],
                [β, yz, zx, xy, z, x, y, α]
            ];
            var b = [1, 0, 0, 0, 0, 0, 0, 0];
            var X = gauss_1.default(A, b);
            var uom = this.uom ? this.uom.inv() : void 0;
            return new G3(X[0], X[1], X[2], X[3], X[4], X[5], X[6], X[7], uom);
        };
        G3.prototype.log = function () {
            throw new Error(notImplemented_1.default('log').message);
        };
        G3.prototype.magnitude = function () {
            return this.norm();
        };
        G3.prototype.magnitudeSansUnits = function () {
            return Math.sqrt(this.squaredNormSansUnits());
        };
        G3.prototype.norm = function () {
            return new G3(this.magnitudeSansUnits(), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.quad = function () {
            return this.squaredNorm();
        };
        G3.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var z = b2_1.default(t, this.z, controlPoint.z, endPoint.z);
            return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.squaredNorm = function () {
            return new G3(this.squaredNormSansUnits(), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        G3.prototype.squaredNormSansUnits = function () {
            return squaredNormG3_1.default(this);
        };
        G3.prototype.stress = function (σ) {
            throw new Error(notSupported_1.default('stress').message);
        };
        G3.prototype.reflect = function (n) {
            var m = G3.fromVector(n);
            return m.mul(this).mul(m).scale(-1);
        };
        G3.prototype.rotate = function (R) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var α = R.α;
            var quadR = quadSpinorE3_1.default(R);
            var ix = α * x - c * z + a * y;
            var iy = α * y - a * x + b * z;
            var iz = α * z - b * y + c * x;
            var iα = b * x + c * y + a * z;
            var αOut = quadR * this.α;
            var xOut = ix * α + iα * b + iy * a - iz * c;
            var yOut = iy * α + iα * c + iz * b - ix * a;
            var zOut = iz * α + iα * a + ix * c - iy * b;
            var βOut = quadR * this.β;
            return G3.fromCartesian(αOut, xOut, yOut, zOut, 0, 0, 0, βOut, this.uom);
        };
        G3.prototype.sin = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var sinW = Math.sin(this.α);
            return new G3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        G3.prototype.sinh = function () {
            throw new Error(notImplemented_1.default('sinh').message);
        };
        G3.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        G3.prototype.sqrt = function () {
            return new G3(Math.sqrt(this.α), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.sqrt(this.uom));
        };
        G3.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        G3.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
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
        G3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.mutator = function (M) {
            var that = {
                set α(α) {
                    M._coords[COORD_SCALAR] = α;
                },
                set x(x) {
                    M._coords[COORD_X] = x;
                },
                set y(y) {
                    M._coords[COORD_Y] = y;
                },
                set z(z) {
                    M._coords[COORD_Z] = z;
                },
                set yz(yz) {
                    M._coords[COORD_YZ] = yz;
                },
                set zx(zx) {
                    M._coords[COORD_ZX] = zx;
                },
                set xy(xy) {
                    M._coords[COORD_XY] = xy;
                },
                set β(β) {
                    M._coords[COORD_PSEUDO] = β;
                }
            };
            return that;
        };
        G3.copy = function (m, uom) {
            return new G3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, uom);
        };
        G3.direction = function (vector) {
            if (vector) {
                return new G3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0).direction();
            }
            else {
                return void 0;
            }
        };
        G3.fromSpinor = function (spinor) {
            if (spinor) {
                return new G3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        G3.fromVector = function (vector, uom) {
            if (vector) {
                return new G3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, uom);
            }
            else {
                return void 0;
            }
        };
        G3.random = function (uom) {
            return new G3(Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), uom);
        };
        G3.scalar = function (α, uom) {
            return new G3(α, 0, 0, 0, 0, 0, 0, 0, uom);
        };
        G3.vector = function (x, y, z, uom) {
            return new G3(0, x, y, z, 0, 0, 0, 0, uom);
        };
        G3.BASIS_LABELS = BASIS_LABELS_G3_STANDARD_1.default;
        G3.zero = new G3(0, 0, 0, 0, 0, 0, 0, 0);
        G3.one = new G3(1, 0, 0, 0, 0, 0, 0, 0);
        G3.e1 = new G3(0, 1, 0, 0, 0, 0, 0, 0);
        G3.e2 = new G3(0, 0, 1, 0, 0, 0, 0, 0);
        G3.e3 = new G3(0, 0, 0, 1, 0, 0, 0, 0);
        G3.kilogram = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KILOGRAM);
        G3.meter = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.METER);
        G3.second = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.SECOND);
        G3.coulomb = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.COULOMB);
        G3.ampere = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.AMPERE);
        G3.kelvin = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KELVIN);
        G3.mole = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.MOLE);
        G3.candela = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.CANDELA);
        return G3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = G3;
});

define('davinci-eight/utils/EventEmitter',["require", "exports"], function (require, exports) {
    var EventEmitter = (function () {
        function EventEmitter(owner) {
            this.owner = owner;
        }
        EventEmitter.prototype.addEventListener = function (eventName, callback) {
            this._eventRegistry = this._eventRegistry || {};
            var listeners = this._eventRegistry[eventName];
            if (!listeners) {
                listeners = this._eventRegistry[eventName] = [];
            }
            if (listeners.indexOf(callback) === -1) {
                listeners.push(callback);
            }
            return callback;
        };
        EventEmitter.prototype.removeEventListener = function (eventName, callback) {
            this._eventRegistry = this._eventRegistry || {};
            var listeners = this._eventRegistry[eventName];
            if (!listeners)
                return;
            var index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        };
        EventEmitter.prototype.emit = function (eventName, key, value) {
            if (this._eventRegistry) {
                var listeners = this._eventRegistry[eventName];
                if (listeners) {
                    var iLength = listeners.length;
                    if (iLength) {
                        for (var i = 0; i < iLength; i++) {
                            listeners[i](eventName, key, value, this.owner);
                        }
                    }
                }
            }
        };
        return EventEmitter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventEmitter;
});

define('davinci-eight/math/isScalarG3',["require", "exports"], function (require, exports) {
    function default_1(m) {
        return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.β === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/maskG3',["require", "exports", '../checks/isNumber', '../checks/isObject'], function (require, exports, isNumber_1, isObject_1) {
    var scratch = { α: 0, x: 0, y: 0, z: 0, yz: 0, zx: 0, xy: 0, β: 0 };
    function default_1(arg) {
        if (isObject_1.default(arg) && 'maskG3' in arg) {
            var duck = arg;
            var g = arg;
            if (duck.maskG3 & 0x1) {
                scratch.α = g.α;
            }
            else {
                scratch.α = 0;
            }
            if (duck.maskG3 & 0x2) {
                scratch.x = g.x;
                scratch.y = g.y;
                scratch.z = g.z;
            }
            else {
                scratch.x = 0;
                scratch.y = 0;
                scratch.z = 0;
            }
            if (duck.maskG3 & 0x4) {
                scratch.yz = g.yz;
                scratch.zx = g.zx;
                scratch.xy = g.xy;
            }
            else {
                scratch.yz = 0;
                scratch.zx = 0;
                scratch.xy = 0;
            }
            if (duck.maskG3 & 0x8) {
                scratch.β = g.β;
            }
            else {
                scratch.β = 0;
            }
            return scratch;
        }
        else if (isNumber_1.default(arg)) {
            scratch.α = arg;
            scratch.x = 0;
            scratch.y = 0;
            scratch.z = 0;
            scratch.yz = 0;
            scratch.zx = 0;
            scratch.xy = 0;
            scratch.β = 0;
            return scratch;
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/randomRange',["require", "exports"], function (require, exports) {
    function default_1(a, b) {
        return (b - a) * Math.random() + a;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/quadVectorE3',["require", "exports", '../math/dotVectorCartesianE3', '../checks/isDefined', '../checks/isNumber'], function (require, exports, dotVectorCartesianE3_1, isDefined_1, isNumber_1) {
    function quadVectorE3(vector) {
        if (isDefined_1.default(vector)) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            if (isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
                return dotVectorCartesianE3_1.default(x, y, z, x, y, z);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadVectorE3;
});

define('davinci-eight/math/wedgeXY',["require", "exports"], function (require, exports) {
    function wedgeXY(ax, ay, az, bx, by, bz) {
        return ax * by - ay * bx;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeXY;
});

define('davinci-eight/math/wedgeYZ',["require", "exports"], function (require, exports) {
    function wedgeYZ(ax, ay, az, bx, by, bz) {
        return ay * bz - az * by;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeYZ;
});

define('davinci-eight/math/wedgeZX',["require", "exports"], function (require, exports) {
    function wedgeZX(ax, ay, az, bx, by, bz) {
        return az * bx - ax * bz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeZX;
});

define('davinci-eight/math/rotorFromDirectionsE3',["require", "exports", './dotVectorE3', './quadVectorE3', './wedgeXY', './wedgeYZ', './wedgeZX'], function (require, exports, dotVectorE3_1, quadVectorE3_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    var sqrt = Math.sqrt;
    function default_1(a, b, m) {
        var quadA = quadVectorE3_1.default(a);
        var absA = sqrt(quadA);
        var quadB = quadVectorE3_1.default(b);
        var absB = sqrt(quadB);
        var BA = absB * absA;
        var dotBA = dotVectorE3_1.default(b, a);
        var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
        if (denom !== 0) {
            m = m.versor(b, a);
            m = m.addScalar(BA);
            m = m.divByScalar(denom);
        }
        else {
            var rx = Math.random();
            var ry = Math.random();
            var rz = Math.random();
            m.zero();
            m.yz = wedgeYZ_1.default(rx, ry, rz, a.x, a.y, a.z);
            m.zx = wedgeZX_1.default(rx, ry, rz, a.x, a.y, a.z);
            m.xy = wedgeXY_1.default(rx, ry, rz, a.x, a.y, a.z);
            m.normalize();
            m.rotorFromGeneratorAngle(m, Math.PI);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Geometric3',["require", "exports", './Coords', './arraysEQ', './dotVectorE3', './G3', '../utils/EventEmitter', './extG3', './gauss', '../checks/isDefined', './isScalarG3', './lcoG3', './maskG3', './mulE3', './mulG3', '../i18n/notImplemented', './randomRange', '../i18n/readOnly', './rcoG3', './rotorFromDirectionsE3', './scpG3', './squaredNormG3', './stringFromCoordinates', './wedgeXY', './wedgeYZ', './wedgeZX'], function (require, exports, Coords_1, arraysEQ_1, dotVectorE3_1, G3_1, EventEmitter_1, extG3_1, gauss_1, isDefined_1, isScalarG3_1, lcoG3_1, maskG3_1, mulE3_1, mulG3_1, notImplemented_1, randomRange_1, readOnly_1, rcoG3_1, rotorFromDirectionsE3_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_PSEUDO = 7;
    var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
    function coordinates(m) {
        return [m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β];
    }
    var EVENT_NAME_CHANGE = 'change';
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var cos = Math.cos;
    var log = Math.log;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var Geometric3 = (function (_super) {
        __extends(Geometric3, _super);
        function Geometric3() {
            _super.call(this, [0, 0, 0, 0, 0, 0, 0, 0], false, 8);
            this.eventBus = new EventEmitter_1.default(this);
        }
        Geometric3.prototype.on = function (eventName, callback) {
            this.eventBus.addEventListener(eventName, callback);
        };
        Geometric3.prototype.off = function (eventName, callback) {
            this.eventBus.removeEventListener(eventName, callback);
        };
        Geometric3.prototype.setCoordinate = function (index, newValue, name) {
            var coords = this.coords;
            var previous = coords[index];
            if (newValue !== previous) {
                coords[index] = newValue;
                this.modified = true;
                this.eventBus.emit(EVENT_NAME_CHANGE, name, newValue);
            }
        };
        Object.defineProperty(Geometric3.prototype, "α", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (α) {
                this.setCoordinate(COORD_SCALAR, α, 'α');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "alpha", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (alpha) {
                this.setCoordinate(COORD_SCALAR, alpha, 'alpha');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "x", {
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (x) {
                this.setCoordinate(COORD_X, x, 'x');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "y", {
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (y) {
                this.setCoordinate(COORD_Y, y, 'y');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "z", {
            get: function () {
                return this.coords[COORD_Z];
            },
            set: function (z) {
                this.setCoordinate(COORD_Z, z, 'z');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "yz", {
            get: function () {
                return this.coords[COORD_YZ];
            },
            set: function (yz) {
                this.setCoordinate(COORD_YZ, yz, 'yz');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "zx", {
            get: function () {
                return this.coords[COORD_ZX];
            },
            set: function (zx) {
                this.setCoordinate(COORD_ZX, zx, 'zx');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "xy", {
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                this.setCoordinate(COORD_XY, xy, 'xy');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "β", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (β) {
                this.setCoordinate(COORD_PSEUDO, β, 'β');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "beta", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (beta) {
                this.setCoordinate(COORD_PSEUDO, beta, 'beta');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "maskG3", {
            get: function () {
                var coords = this._coords;
                var α = coords[COORD_SCALAR];
                var x = coords[COORD_X];
                var y = coords[COORD_Y];
                var z = coords[COORD_Z];
                var yz = coords[COORD_YZ];
                var zx = coords[COORD_ZX];
                var xy = coords[COORD_XY];
                var β = coords[COORD_PSEUDO];
                var mask = 0x0;
                if (α !== 0) {
                    mask += 0x1;
                }
                if (x !== 0 || y !== 0 || z !== 0) {
                    mask += 0x2;
                }
                if (yz !== 0 || zx !== 0 || xy !== 0) {
                    mask += 0x4;
                }
                if (β !== 0) {
                    mask += 0x8;
                }
                return mask;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('maskG3').message);
            },
            enumerable: true,
            configurable: true
        });
        Geometric3.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            this.α += M.α * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.z += M.z * α;
            this.yz += M.yz * α;
            this.zx += M.zx * α;
            this.xy += M.xy * α;
            this.β += M.β * α;
            return this;
        };
        Geometric3.prototype.addPseudo = function (β) {
            this.β += β;
            return this;
        };
        Geometric3.prototype.addScalar = function (α) {
            this.α += α;
            return this;
        };
        Geometric3.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            this.x += v.x * α;
            this.y += v.y * α;
            this.z += v.z * α;
            return this;
        };
        Geometric3.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            this.β = a.β + b.β;
            return this;
        };
        Geometric3.prototype.adj = function () {
            throw new Error('TODO: Geometric3.adj');
        };
        Geometric3.prototype.angle = function () {
            return this.log().grade(2);
        };
        Geometric3.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Geometric3.prototype.clone = function () {
            return Geometric3.copy(this);
        };
        Geometric3.prototype.conj = function () {
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        Geometric3.prototype.copyCoordinates = function (coordinates) {
            this.α = coordinates[COORD_SCALAR];
            this.x = coordinates[COORD_X];
            this.y = coordinates[COORD_Y];
            this.z = coordinates[COORD_Z];
            this.yz = coordinates[COORD_YZ];
            this.zx = coordinates[COORD_ZX];
            this.xy = coordinates[COORD_XY];
            this.β = coordinates[COORD_PSEUDO];
            return this;
        };
        Geometric3.prototype.distanceTo = function (point) {
            if (isDefined_1.default(point)) {
                return sqrt(this.quadranceTo(point));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.quadranceTo = function (point) {
            if (isDefined_1.default(point)) {
                var dx = this.x - point.x;
                var dy = this.y - point.y;
                var dz = this.z - point.z;
                return dx * dx + dy * dy + dz * dz;
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.lco = function (m) {
            return this.lco2(this, m);
        };
        Geometric3.prototype.lco2 = function (a, b) {
            return lcoG3_1.default(a, b, this);
        };
        Geometric3.prototype.rco = function (m) {
            return this.rco2(this, m);
        };
        Geometric3.prototype.rco2 = function (a, b) {
            return rcoG3_1.default(a, b, this);
        };
        Geometric3.prototype.copy = function (M) {
            this.α = M.α;
            this.x = M.x;
            this.y = M.y;
            this.z = M.z;
            this.yz = M.yz;
            this.zx = M.zx;
            this.xy = M.xy;
            this.β = M.β;
            return this;
        };
        Geometric3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        Geometric3.prototype.copySpinor = function (spinor) {
            this.zero();
            this.α = spinor.α;
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            this.xy = spinor.xy;
            return this;
        };
        Geometric3.prototype.copyVector = function (vector) {
            this.zero();
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
            return this;
        };
        Geometric3.prototype.div = function (m) {
            if (isScalarG3_1.default(m)) {
                return this.divByScalar(m.α);
            }
            else {
                var α = m.α;
                var x = m.x;
                var y = m.y;
                var z = m.z;
                var xy = m.xy;
                var yz = m.yz;
                var zx = m.zx;
                var β = m.β;
                var A = [
                    [α, x, y, z, -xy, -yz, -zx, -β],
                    [x, α, xy, -zx, -y, -β, z, -yz],
                    [y, -xy, α, yz, x, -z, -β, -zx],
                    [z, zx, -yz, α, -β, y, -x, -xy],
                    [xy, -y, x, β, α, zx, -yz, z],
                    [yz, β, -z, y, -zx, α, xy, x],
                    [zx, z, β, -x, yz, -xy, α, y],
                    [β, yz, zx, xy, z, x, y, α]
                ];
                var b = [1, 0, 0, 0, 0, 0, 0, 0];
                var X = gauss_1.default(A, b);
                var a0 = this.α;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.z;
                var a4 = this.xy;
                var a5 = this.yz;
                var a6 = this.zx;
                var a7 = this.β;
                var b0 = X[0];
                var b1 = X[1];
                var b2 = X[2];
                var b3 = X[3];
                var b4 = X[4];
                var b5 = X[5];
                var b6 = X[6];
                var b7 = X[7];
                var c0 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                var c1 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                var c2 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                var c3 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                var c4 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                var c5 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                var c6 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                var c7 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
                this.α = c0;
                this.x = c1;
                this.y = c2;
                this.z = c3;
                this.xy = c4;
                this.yz = c5;
                this.zx = c6;
                this.β = c7;
            }
            return this;
        };
        Geometric3.prototype.divByScalar = function (α) {
            this.α /= α;
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.β /= α;
            return this;
        };
        Geometric3.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        Geometric3.prototype.dual = function (m) {
            var w = -m.β;
            var x = -m.yz;
            var y = -m.zx;
            var z = -m.xy;
            var yz = m.x;
            var zx = m.y;
            var xy = m.z;
            var β = m.α;
            this.α = w;
            this.x = x;
            this.y = y;
            this.z = z;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            this.β = β;
            return this;
        };
        Geometric3.prototype.equals = function (other) {
            if (other instanceof Geometric3) {
                var that = other;
                return arraysEQ_1.default(this.coords, that.coords);
            }
            else {
                return false;
            }
        };
        Geometric3.prototype.exp = function () {
            var expW = exp(this.α);
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var φ = sqrt(yz * yz + zx * zx + xy * xy);
            var s = φ !== 0 ? sin(φ) / φ : 1;
            var cosφ = cos(φ);
            this.α = cosφ;
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this.scale(expW);
        };
        Geometric3.prototype.inv = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var xy = this.xy;
            var yz = this.yz;
            var zx = this.zx;
            var β = this.β;
            var A = [
                [α, x, y, z, -xy, -yz, -zx, -β],
                [x, α, xy, -zx, -y, -β, z, -yz],
                [y, -xy, α, yz, x, -z, -β, -zx],
                [z, zx, -yz, α, -β, y, -x, -xy],
                [xy, -y, x, β, α, zx, -yz, z],
                [yz, β, -z, y, -zx, α, xy, x],
                [zx, z, β, -x, yz, -xy, α, y],
                [β, yz, zx, xy, z, x, y, α]
            ];
            var b = [1, 0, 0, 0, 0, 0, 0, 0];
            var X = gauss_1.default(A, b);
            this.α = X[0];
            this.x = X[1];
            this.y = X[2];
            this.z = X[3];
            this.xy = X[4];
            this.yz = X[5];
            this.zx = X[6];
            this.β = X[7];
            return this;
        };
        Geometric3.prototype.isOne = function () {
            return this.α === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        Geometric3.prototype.isZero = function () {
            return this.α === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        Geometric3.prototype.lerp = function (target, α) {
            this.α += (target.α - this.α) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.β += (target.β - this.β) * α;
            return this;
        };
        Geometric3.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        Geometric3.prototype.log = function () {
            var α = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var BB = x * x + y * y + z * z;
            var B = sqrt(BB);
            var f = atan2(B, α) / B;
            this.α = log(sqrt(α * α + BB));
            this.yz = x * f;
            this.zx = y * f;
            this.xy = z * f;
            return this;
        };
        Geometric3.prototype.magnitude = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Geometric3.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Geometric3.prototype.mul = function (m) {
            return this.mul2(this, m);
        };
        Geometric3.prototype.mul2 = function (a, b) {
            mulG3_1.default(a, b, this._coords);
            return this;
        };
        Geometric3.prototype.neg = function () {
            this.α = -this.α;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.β = -this.β;
            return this;
        };
        Geometric3.prototype.norm = function () {
            this.α = this.magnitudeSansUnits();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.β = 0;
            return this;
        };
        Geometric3.prototype.normalize = function () {
            var norm = this.magnitude();
            if (norm !== 0) {
                this.α = this.α / norm;
                this.x = this.x / norm;
                this.y = this.y / norm;
                this.z = this.z / norm;
                this.yz = this.yz / norm;
                this.zx = this.zx / norm;
                this.xy = this.xy / norm;
                this.β = this.β / norm;
            }
            return this;
        };
        Geometric3.prototype.one = function () {
            this.α = 1;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.β = 0;
            return this;
        };
        Geometric3.prototype.quad = function () {
            this.α = this.squaredNormSansUnits();
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        Geometric3.prototype.squaredNorm = function () {
            return this.squaredNormSansUnits();
        };
        Geometric3.prototype.squaredNormSansUnits = function () {
            return squaredNormG3_1.default(this);
        };
        Geometric3.prototype.reflect = function (n) {
            var N = G3_1.default.fromVector(n);
            var M = G3_1.default.copy(this);
            var R = N.mul(M).mul(N).scale(-1);
            this.copy(R);
            return this;
        };
        Geometric3.prototype.rev = function () {
            this.α = +this.α;
            this.x = +this.x;
            this.y = +this.y;
            this.z = +this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.β = -this.β;
            return this;
        };
        Geometric3.prototype.__tilde__ = function () {
            return Geometric3.copy(this).rev();
        };
        Geometric3.prototype.rotate = function (R) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var α = R.α;
            var ix = α * x - c * z + a * y;
            var iy = α * y - a * x + b * z;
            var iz = α * z - b * y + c * x;
            var iα = b * x + c * y + a * z;
            this.x = ix * α + iα * b + iy * a - iz * c;
            this.y = iy * α + iα * c + iz * b - ix * a;
            this.z = iz * α + iα * a + ix * c - iy * b;
            return this;
        };
        Geometric3.prototype.rotorFromDirections = function (a, b) {
            rotorFromDirectionsE3_1.default(a, b, this);
            return this;
        };
        Geometric3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var yz = B.yz;
            var zx = B.zx;
            var xy = B.xy;
            var quad = yz * yz + zx * zx + xy * xy;
            var m = Math.sqrt(quad);
            var s = sin(m * φ);
            this.α = cos(m * φ);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = -yz * s / m;
            this.zx = -zx * s / m;
            this.xy = -xy * s / m;
            this.β = 0;
            return this;
        };
        Geometric3.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        Geometric3.prototype.scp2 = function (a, b) {
            return scpG3_1.default(a, b, this);
        };
        Geometric3.prototype.scale = function (α) {
            this.α *= α;
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.β *= α;
            return this;
        };
        Geometric3.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        Geometric3.prototype.stress = function (σ) {
            this.x *= σ.x;
            this.y *= σ.y;
            this.z *= σ.z;
            return this;
        };
        Geometric3.prototype.versor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.zero();
            this.α = dotVectorE3_1.default(a, b);
            this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        Geometric3.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            this.α -= M.α * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.β -= M.β * α;
            return this;
        };
        Geometric3.prototype.subVector = function (v, α) {
            if (α === void 0) { α = 1; }
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        };
        Geometric3.prototype.sub2 = function (a, b) {
            this.α = a.α - b.α;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.β = a.β - b.β;
            return this;
        };
        Geometric3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Geometric3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Geometric3.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Geometric3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Geometric3.prototype.grade = function (grade) {
            switch (grade) {
                case 0:
                    {
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.β = 0;
                    }
                    break;
                case 1:
                    {
                        this.α = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.β = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.β = 0;
                    }
                    break;
                case 3:
                    {
                        this.α = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.β = 0;
                }
            }
            return this;
        };
        Geometric3.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        Geometric3.prototype.ext2 = function (a, b) {
            return extG3_1.default(a, b, this);
        };
        Geometric3.prototype.zero = function () {
            this.α = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.β = 0;
            return this;
        };
        Geometric3.prototype.__add__ = function (rhs) {
            var duckR = maskG3_1.default(rhs);
            if (duckR) {
                return this.clone().add(duckR);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__div__ = function (rhs) {
            var duckR = maskG3_1.default(rhs);
            if (duckR) {
                return this.clone().div(duckR);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return Geometric3.copy(lhs).div(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric3.scalar(lhs).div(this);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__mul__ = function (rhs) {
            var duckR = maskG3_1.default(rhs);
            if (duckR) {
                return this.clone().mul(duckR);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return Geometric3.copy(lhs).mul(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric3.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return Geometric3.copy(lhs).add(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric3.scalar(lhs).add(this);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__sub__ = function (rhs) {
            var duckR = maskG3_1.default(rhs);
            if (duckR) {
                return this.clone().sub(duckR);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return Geometric3.copy(lhs).sub(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric3.scalar(lhs).sub(this);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return Geometric3.copy(this).ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric3.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return Geometric3.copy(lhs).ext(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric3.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return Geometric3.copy(this).lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric3.copy(this).lco(Geometric3.scalar(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return Geometric3.copy(lhs).lco(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric3.scalar(lhs).lco(this);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return Geometric3.copy(this).rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric3.copy(this).rco(Geometric3.scalar(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return Geometric3.copy(lhs).rco(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric3.scalar(lhs).rco(this);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return Geometric3.copy(this).scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric3.copy(this).scp(Geometric3.scalar(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return Geometric3.copy(lhs).scp(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric3.scalar(lhs).scp(this);
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__bang__ = function () {
            return Geometric3.copy(this).inv();
        };
        Geometric3.prototype.__pos__ = function () {
            return Geometric3.copy(this);
        };
        Geometric3.prototype.__neg__ = function () {
            return Geometric3.copy(this).neg();
        };
        Geometric3.zero = function () { return new Geometric3(); };
        Geometric3.one = function () { return new Geometric3().addScalar(1); };
        Geometric3.e1 = function () { return Geometric3.vector(1, 0, 0); };
        Geometric3.e2 = function () { return Geometric3.vector(0, 1, 0); };
        Geometric3.e3 = function () { return Geometric3.vector(0, 0, 1); };
        Geometric3.I = function () { return new Geometric3().addPseudo(1); };
        Geometric3.copy = function (M) {
            var copy = new Geometric3();
            copy.α = M.α;
            copy.x = M.x;
            copy.y = M.y;
            copy.z = M.z;
            copy.yz = M.yz;
            copy.zx = M.zx;
            copy.xy = M.xy;
            copy.β = M.β;
            return copy;
        };
        Geometric3.fromScalar = function (scalar) {
            return new Geometric3().copyScalar(scalar.α);
        };
        Geometric3.fromSpinor = function (spinor) {
            var copy = new Geometric3();
            copy.α = spinor.α;
            copy.yz = spinor.yz;
            copy.zx = spinor.zx;
            copy.xy = spinor.xy;
            return copy;
        };
        Geometric3.fromVector = function (vector) {
            var copy = new Geometric3();
            copy.x = vector.x;
            copy.y = vector.y;
            copy.z = vector.z;
            return copy;
        };
        Geometric3.lerp = function (A, B, α) {
            return Geometric3.copy(A).lerp(B, α);
        };
        Geometric3.random = function () {
            var g = new Geometric3();
            g.α = randomRange_1.default(-1, 1);
            g.x = randomRange_1.default(-1, 1);
            g.y = randomRange_1.default(-1, 1);
            g.z = randomRange_1.default(-1, 1);
            g.yz = randomRange_1.default(-1, 1);
            g.zx = randomRange_1.default(-1, 1);
            g.xy = randomRange_1.default(-1, 1);
            g.β = randomRange_1.default(-1, 1);
            g.normalize();
            return g;
        };
        Geometric3.rotorFromDirections = function (a, b) {
            return new Geometric3().rotorFromDirections(a, b);
        };
        Geometric3.scalar = function (α) {
            return new Geometric3().copyScalar(α);
        };
        Geometric3.spinor = function (yz, zx, xy, α) {
            var spinor = new Geometric3();
            spinor.yz = yz;
            spinor.zx = zx;
            spinor.xy = xy;
            spinor.α = α;
            spinor.modified = false;
            return spinor;
        };
        Geometric3.vector = function (x, y, z) {
            var v = new Geometric3();
            v.x = x;
            v.y = y;
            v.z = z;
            v.modified = false;
            return v;
        };
        Geometric3.wedge = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            var yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            var zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            var xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return Geometric3.spinor(yz, zx, xy, 0);
        };
        return Geometric3;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Geometric3;
});

define('davinci-eight/math/R3',["require", "exports", '../checks/isDefined', '../checks/isObject', '../checks/isNull', '../checks/isNumber', '../i18n/notImplemented', '../checks/mustBeNumber', '../checks/mustBeObject', '../i18n/readOnly', './stringFromCoordinates', './Unit'], function (require, exports, isDefined_1, isObject_1, isNull_1, isNumber_1, notImplemented_1, mustBeNumber_1, mustBeObject_1, readOnly_1, stringFromCoordinates_1, Unit_1) {
    var BASIS_LABELS = ['e1', 'e2', 'e3'];
    var R3 = (function () {
        function R3(x, y, z, uom) {
            mustBeNumber_1.default('x', x);
            mustBeNumber_1.default('y', y);
            mustBeNumber_1.default('z', z);
            mustBeObject_1.default('uom', uom);
            var m = uom.multiplier;
            if (m !== 1) {
                this._coords = [m * x, m * y, m * z];
                this._uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
            else {
                this._coords = [x, y, z];
                this._uom = uom;
            }
        }
        Object.defineProperty(R3.prototype, "x", {
            get: function () {
                return this._coords[0];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R3.prototype, "y", {
            get: function () {
                return this._coords[1];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R3.prototype, "z", {
            get: function () {
                return this._coords[2];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('z').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R3.prototype, "uom", {
            get: function () {
                return this._uom;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uom').message);
            },
            enumerable: true,
            configurable: true
        });
        R3.prototype.add = function (rhs, α) {
            if (α === void 0) { α = 1; }
            throw new Error(notImplemented_1.default('add').message);
        };
        R3.prototype.divByScalar = function (α) {
            return new R3(this.x, this.y, this.z, this.uom.div(α));
        };
        R3.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        R3.prototype.magnitude = function () {
            return this.squaredNorm().sqrt();
        };
        R3.prototype.neg = function () {
            return new R3(-this.x, -this.y, -this.z, this.uom);
        };
        R3.prototype.reflect = function (n) {
            throw new Error(notImplemented_1.default('reflect').message);
        };
        R3.prototype.rotate = function (R) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var w = R.α;
            var ix = w * x - c * z + a * y;
            var iy = w * y - a * x + b * z;
            var iz = w * z - b * y + c * x;
            var iw = b * x + c * y + a * z;
            var ox = ix * w + iw * b + iy * a - iz * c;
            var oy = iy * w + iw * c + iz * b - ix * a;
            var oz = iz * w + iw * a + ix * c - iy * b;
            return new R3(ox, oy, oz, this.uom);
        };
        R3.prototype.scale = function (α) {
            return new R3(this.x, this.y, this.z, this.uom.mul(α));
        };
        R3.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        R3.prototype.squaredNorm = function () {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return this.uom.quad().scale(x * x + y * y + z * z);
        };
        R3.prototype.stress = function (σ) {
            return R3.vector(this.x * σ.x, this.y * σ.y, this.z * σ.z, this.uom);
        };
        R3.prototype.sub = function (rhs, α) {
            if (α === void 0) { α = 1; }
            throw new Error(notImplemented_1.default('sub').message);
        };
        R3.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates_1.default(this._coords, coordToString, labels);
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
        R3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return this.toStringCustom(coordToString, BASIS_LABELS);
        };
        R3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return this.toStringCustom(coordToString, BASIS_LABELS);
        };
        R3.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return this.toStringCustom(coordToString, BASIS_LABELS);
        };
        R3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return this.toStringCustom(coordToString, BASIS_LABELS);
        };
        R3.prototype.__add__ = function (rhs) {
            if (isObject_1.default(rhs) && !isNull_1.default(rhs))
                if (isNumber_1.default(rhs.x) && isNumber_1.default(rhs.y) && isNumber_1.default(rhs.z)) {
                    return R3.vector(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, this.uom);
                }
                else {
                    return void 0;
                }
        };
        R3.fromVector = function (vector, uom) {
            return new R3(vector.x, vector.y, vector.z, uom);
        };
        R3.direction = function (vector) {
            if (isDefined_1.default(vector)) {
                var x = vector.x;
                var y = vector.y;
                var z = vector.z;
                var m = Math.sqrt(x * x + y * y + z * z);
                return new R3(x / m, y / m, z / m, Unit_1.default.ONE);
            }
            else {
                return void 0;
            }
        };
        R3.vector = function (x, y, z, uom) {
            return new R3(x, y, z, uom);
        };
        R3.zero = new R3(0, 0, 0, Unit_1.default.ONE);
        R3.e1 = new R3(1, 0, 0, Unit_1.default.ONE);
        R3.e2 = new R3(0, 1, 0, Unit_1.default.ONE);
        R3.e3 = new R3(0, 0, 1, Unit_1.default.ONE);
        return R3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = R3;
});

define('davinci-eight/facets/getViewAttitude',["require", "exports", '../math/Geometric3', '../math/R3'], function (require, exports, Geometric3_1, R3_1) {
    var u = Geometric3_1.default.zero();
    var v = Geometric3_1.default.zero();
    var n = Geometric3_1.default.zero();
    var e1 = Geometric3_1.default.fromVector(R3_1.default.e1);
    var e2 = Geometric3_1.default.fromVector(R3_1.default.e2);
    var e3 = Geometric3_1.default.fromVector(R3_1.default.e3);
    function default_1(eye, look, up, R) {
        n.copyVector(eye).subVector(look).normalize();
        u.copyVector(up).dual(u).rco(n).neg();
        v.copy(u).ext(n).dual(v);
        R.one().add(u.mul(e1)).add(v.mul(e2)).add(n.mul(e3));
        R.normalize();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/mulSpinorE3YZ',["require", "exports"], function (require, exports) {
    function default_1(R, S) {
        return R.yz * S.α - R.zx * S.xy + R.xy * S.zx + R.α * S.yz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/mulSpinorE3ZX',["require", "exports"], function (require, exports) {
    function default_1(R, S) {
        return R.yz * S.xy + R.zx * S.α - R.xy * S.yz + R.α * S.zx;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/mulSpinorE3XY',["require", "exports"], function (require, exports) {
    function default_1(R, S) {
        return -R.yz * S.zx + R.zx * S.yz + R.xy * S.α + R.α * S.xy;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/mulSpinorE3alpha',["require", "exports"], function (require, exports) {
    function default_1(R, S) {
        return -R.yz * S.yz - R.zx * S.zx - R.xy * S.xy + R.α * S.α;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/toStringCustom',["require", "exports", '../math/stringFromCoordinates'], function (require, exports, stringFromCoordinates_1) {
    function toStringCustom(coordinates, uom, coordToString, labels) {
        var quantityString = stringFromCoordinates_1.default(coordinates, coordToString, labels);
        if (uom) {
            var unitString = uom.toString().trim();
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
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = toStringCustom;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Spinor3',["require", "exports", './Coords', './dotVectorCartesianE3', './mulSpinorE3YZ', './mulSpinorE3ZX', './mulSpinorE3XY', './mulSpinorE3alpha', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', './quadSpinorE3', './randomRange', '../i18n/readOnly', './rotorFromDirectionsE3', './toStringCustom', './wedgeXY', './wedgeYZ', './wedgeZX'], function (require, exports, Coords_1, dotVectorCartesianE3_1, mulSpinorE3YZ_1, mulSpinorE3ZX_1, mulSpinorE3XY_1, mulSpinorE3alpha_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, quadSpinorE3_1, randomRange_1, readOnly_1, rotorFromDirectionsE3_1, toStringCustom_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    var COORD_YZ = 0;
    var COORD_ZX = 1;
    var COORD_XY = 2;
    var COORD_SCALAR = 3;
    var BASIS_LABELS = ['e23', 'e31', 'e12', '1'];
    function coordinates(m) {
        return [m.yz, m.zx, m.xy, m.α];
    }
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var magicCode = Math.random();
    var Spinor3 = (function (_super) {
        __extends(Spinor3, _super);
        function Spinor3(coordinates, code) {
            _super.call(this, coordinates, false, 4);
            if (code !== magicCode) {
                throw new Error("Use the static creation methods instead of the constructor");
            }
        }
        Object.defineProperty(Spinor3.prototype, "yz", {
            get: function () {
                return this._coords[COORD_YZ];
            },
            set: function (yz) {
                mustBeNumber_1.default('yz', yz);
                this.modified = this.modified || this.yz !== yz;
                this._coords[COORD_YZ] = yz;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "zx", {
            get: function () {
                return this._coords[COORD_ZX];
            },
            set: function (zx) {
                mustBeNumber_1.default('zx', zx);
                this.modified = this.modified || this.zx !== zx;
                this._coords[COORD_ZX] = zx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "xy", {
            get: function () {
                return this._coords[COORD_XY];
            },
            set: function (xy) {
                mustBeNumber_1.default('xy', xy);
                this.modified = this.modified || this.xy !== xy;
                this._coords[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "alpha", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (alpha) {
                mustBeNumber_1.default('alpha', alpha);
                this.modified = this.modified || this.alpha !== alpha;
                this._coords[COORD_SCALAR] = alpha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "α", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (α) {
                mustBeNumber_1.default('α', α);
                this.modified = this.modified || this.α !== α;
                this._coords[COORD_SCALAR] = α;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "maskG3", {
            get: function () {
                var coords = this._coords;
                var α = coords[COORD_SCALAR];
                var yz = coords[COORD_YZ];
                var zx = coords[COORD_ZX];
                var xy = coords[COORD_XY];
                var m = 0x0;
                if (α !== 0) {
                    m += 0x1;
                }
                if (yz !== 0 || zx !== 0 || xy !== 0) {
                    m += 0x4;
                }
                return m;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('maskG3').message);
            },
            enumerable: true,
            configurable: true
        });
        Spinor3.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('spinor', spinor);
            mustBeNumber_1.default('α', α);
            this.yz += spinor.yz * α;
            this.zx += spinor.zx * α;
            this.xy += spinor.xy * α;
            this.α += spinor.α * α;
            return this;
        };
        Spinor3.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            return this;
        };
        Spinor3.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            return this;
        };
        Spinor3.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.α += α;
            return this;
        };
        Spinor3.prototype.adj = function () {
            throw new Error('TODO: Spinor3.adj');
        };
        Spinor3.prototype.angle = function () {
            return this.log().grade(2);
        };
        Spinor3.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Spinor3.prototype.clone = function () {
            return Spinor3.copy(this);
        };
        Spinor3.prototype.conj = function () {
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        Spinor3.prototype.copy = function (source) {
            if (source) {
                this.yz = source.yz;
                this.zx = source.zx;
                this.xy = source.xy;
                this.α = source.α;
                return this;
            }
            else {
                throw new Error("source for copy must be a spinor");
            }
        };
        Spinor3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        Spinor3.prototype.copySpinor = function (s) {
            return this.copy(s);
        };
        Spinor3.prototype.copyVector = function (vector) {
            return this.zero();
        };
        Spinor3.prototype.div = function (s) {
            return this.div2(this, s);
        };
        Spinor3.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        Spinor3.prototype.divByScalar = function (α) {
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.α /= α;
            return this;
        };
        Spinor3.prototype.dual = function (v, changeSign) {
            this.α = 0;
            this.yz = v.x;
            this.zx = v.y;
            this.xy = v.z;
            if (changeSign) {
                this.neg();
            }
            return this;
        };
        Spinor3.prototype.equals = function (other) {
            if (other instanceof Spinor3) {
                var that = other;
                return this.yz === that.yz && this.zx === that.zx && this.xy === that.xy && this.α === that.α;
            }
            else {
                return false;
            }
        };
        Spinor3.prototype.exp = function () {
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var expW = exp(w);
            var φ = sqrt(x * x + y * y + z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.yz = x * s;
            this.zx = y * s;
            this.xy = z * s;
            return this;
        };
        Spinor3.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNormSansUnits());
            return this;
        };
        Spinor3.prototype.isOne = function () {
            return this.α === 1 && this.xy === 0 && this.yz === 0 && this.zx === 0;
        };
        Spinor3.prototype.isZero = function () {
            return this.α === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0;
        };
        Spinor3.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        Spinor3.prototype.lco2 = function (a, b) {
            return this;
        };
        Spinor3.prototype.lerp = function (target, α) {
            var Vector2 = Spinor3.copy(target);
            var Vector1 = this.clone();
            var R = Vector2.mul(Vector1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        Spinor3.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        Spinor3.prototype.log = function () {
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var bb = x * x + y * y + z * z;
            var Vector2 = sqrt(bb);
            var R0 = Math.abs(w);
            var R = sqrt(w * w + bb);
            this.α = Math.log(R);
            var θ = Math.atan2(Vector2, R0) / Vector2;
            this.yz = x * θ;
            this.zx = y * θ;
            this.xy = z * θ;
            return this;
        };
        Spinor3.prototype.magnitude = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Spinor3.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Spinor3.prototype.mul = function (rhs) {
            var α = mulSpinorE3alpha_1.default(this, rhs);
            var yz = mulSpinorE3YZ_1.default(this, rhs);
            var zx = mulSpinorE3ZX_1.default(this, rhs);
            var xy = mulSpinorE3XY_1.default(this, rhs);
            this.α = α;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            return this;
        };
        Spinor3.prototype.mul2 = function (a, b) {
            var α = mulSpinorE3alpha_1.default(a, b);
            var yz = mulSpinorE3YZ_1.default(a, b);
            var zx = mulSpinorE3ZX_1.default(a, b);
            var xy = mulSpinorE3XY_1.default(a, b);
            this.α = α;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            return this;
        };
        Spinor3.prototype.neg = function () {
            this.α = -this.α;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        Spinor3.prototype.norm = function () {
            var norm = this.magnitudeSansUnits();
            return this.zero().addScalar(norm);
        };
        Spinor3.prototype.normalize = function () {
            var m = this.magnitude();
            this.yz = this.yz / m;
            this.zx = this.zx / m;
            this.xy = this.xy / m;
            this.α = this.α / m;
            return this;
        };
        Spinor3.prototype.one = function () {
            this.α = 1;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        Spinor3.prototype.quad = function () {
            var squaredNorm = this.squaredNormSansUnits();
            return this.zero().addScalar(squaredNorm);
        };
        Spinor3.prototype.squaredNorm = function () {
            return quadSpinorE3_1.default(this);
        };
        Spinor3.prototype.squaredNormSansUnits = function () {
            return quadSpinorE3_1.default(this);
        };
        Spinor3.prototype.stress = function (σ) {
            this.yz = this.yz * σ.y * σ.z;
            this.zx = this.zx * σ.z * σ.x;
            this.xy = this.xy * σ.x * σ.y;
            return this;
        };
        Spinor3.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        Spinor3.prototype.rco2 = function (a, b) {
            return this;
        };
        Spinor3.prototype.rev = function () {
            this.yz *= -1;
            this.zx *= -1;
            this.xy *= -1;
            return this;
        };
        Spinor3.prototype.reflect = function (n) {
            var w = this.α;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var nn = nx * nx + ny * ny + nz * nz;
            var nB = nx * yz + ny * zx + nz * xy;
            this.α = nn * w;
            this.xy = 2 * nz * nB - nn * xy;
            this.yz = 2 * nx * nB - nn * yz;
            this.zx = 2 * ny * nB - nn * zx;
            return this;
        };
        Spinor3.prototype.rotate = function (R) {
            this.rev();
            this.mul2(R, this);
            this.rev();
            this.mul2(R, this);
            return this;
        };
        Spinor3.prototype.rotorFromDirections = function (a, b) {
            rotorFromDirectionsE3_1.default(a, b, this);
            return this;
        };
        Spinor3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -B.yz * s;
            this.zx = -B.zx * s;
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        Spinor3.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        Spinor3.prototype.scp2 = function (a, b) {
            return this;
        };
        Spinor3.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.α *= α;
            return this;
        };
        Spinor3.prototype.slerp = function (target, α) {
            var Vector2 = Spinor3.copy(target);
            var Vector1 = this.clone();
            var R = Vector2.mul(Vector1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        Spinor3.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('s', s);
            mustBeNumber_1.default('α', α);
            this.yz -= s.yz * α;
            this.zx -= s.zx * α;
            this.xy -= s.xy * α;
            this.α -= s.α * α;
            return this;
        };
        Spinor3.prototype.sub2 = function (a, b) {
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.α = a.α - b.α;
            return this;
        };
        Spinor3.prototype.versor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.α = dotVectorCartesianE3_1.default(ax, ay, az, bx, by, bz);
            this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        Spinor3.prototype.wedge = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.α = 0;
            this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        Spinor3.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                }
            }
            return this;
        };
        Spinor3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Spinor3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Spinor3.prototype.toPrecision = function (position) {
            var coordToString = function (coord) { return coord.toPrecision(position); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Spinor3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Spinor3.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        Spinor3.prototype.ext2 = function (a, b) {
            return this;
        };
        Spinor3.prototype.zero = function () {
            this.α = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        Spinor3.copy = function (spinor) {
            var s = Spinor3.zero().copy(spinor);
            s.modified = false;
            return s;
        };
        Spinor3.dual = function (v, changeSign) {
            return Spinor3.zero().dual(v, changeSign);
        };
        Spinor3.isOne = function (spinor) {
            return spinor.α === 1 && spinor.yz === 0 && spinor.zx === 0 && spinor.xy === 0;
        };
        Spinor3.lerp = function (a, b, α) {
            return Spinor3.copy(a).lerp(b, α);
        };
        Spinor3.one = function () {
            return Spinor3.spinor(0, 0, 0, 1);
        };
        Spinor3.random = function () {
            var yz = randomRange_1.default(-1, 1);
            var zx = randomRange_1.default(-1, 1);
            var xy = randomRange_1.default(-1, 1);
            var α = randomRange_1.default(-1, 1);
            return Spinor3.spinor(yz, zx, xy, α).normalize();
        };
        Spinor3.rotorFromDirections = function (a, b) {
            return Spinor3.zero().rotorFromDirections(a, b);
        };
        Spinor3.spinor = function (yz, zx, xy, α) {
            return new Spinor3([yz, zx, xy, α], magicCode);
        };
        Spinor3.wedge = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            var yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            var zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            var xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return Spinor3.spinor(yz, zx, xy, 0);
        };
        Spinor3.zero = function () {
            return Spinor3.spinor(0, 0, 0, 0);
        };
        return Spinor3;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spinor3;
});

define('davinci-eight/math/AbstractMatrix',["require", "exports", '../checks/mustBeDefined', '../checks/mustBeInteger', '../checks/expectArg', '../i18n/readOnly'], function (require, exports, mustBeDefined_1, mustBeInteger_1, expectArg_1, readOnly_1) {
    var AbstractMatrix = (function () {
        function AbstractMatrix(elements, dimensions) {
            this._elements = mustBeDefined_1.default('elements', elements);
            this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
            this._length = dimensions * dimensions;
            expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
            this.modified = false;
        }
        Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
            get: function () {
                return this._dimensions;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('dimensions').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
            get: function () {
                return this._elements;
            },
            set: function (elements) {
                expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
                this._elements = elements;
            },
            enumerable: true,
            configurable: true
        });
        AbstractMatrix.prototype.copy = function (m) {
            this.elements.set(m.elements);
            return this;
        };
        AbstractMatrix.prototype.getElement = function (row, column) {
            return this.elements[row + column * this._dimensions];
        };
        AbstractMatrix.prototype.isOne = function () {
            for (var i = 0; i < this._dimensions; i++) {
                for (var j = 0; j < this._dimensions; j++) {
                    var value = this.getElement(i, j);
                    if (i === j) {
                        if (value !== 1) {
                            return false;
                        }
                    }
                    else {
                        if (value !== 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };
        AbstractMatrix.prototype.setElement = function (row, column, value) {
            this.elements[row + column * this._dimensions] = value;
        };
        return AbstractMatrix;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractMatrix;
});

define('davinci-eight/math/add3x3',["require", "exports"], function (require, exports) {
    function default_1(a, b, c) {
        var a11 = a[0x0], a12 = a[0x3], a13 = a[0x6];
        var a21 = a[0x1], a22 = a[0x4], a23 = a[0x7];
        var a31 = a[0x2], a32 = a[0x5], a33 = a[0x8];
        var b11 = b[0x0], b12 = b[0x3], b13 = b[0x6];
        var b21 = b[0x1], b22 = b[0x4], b23 = b[0x7];
        var b31 = b[0x2], b32 = b[0x5], b33 = b[0x8];
        c[0x0] = a11 + b11;
        c[0x3] = a12 + b12;
        c[0x6] = a13 + b13;
        c[0x1] = a21 + b21;
        c[0x4] = a22 + b22;
        c[0x7] = a23 + b23;
        c[0x2] = a31 + b31;
        c[0x5] = a32 + b32;
        c[0x8] = a33 + b33;
        return c;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/det3x3',["require", "exports"], function (require, exports) {
    function default_1(m) {
        var m00 = m[0x0], m01 = m[0x3], m02 = m[0x6];
        var m10 = m[0x1], m11 = m[0x4], m12 = m[0x7];
        var m20 = m[0x2], m21 = m[0x5], m22 = m[0x8];
        return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/inv3x3',["require", "exports", '../math/det3x3'], function (require, exports, det3x3_1) {
    function inv3x3(m, te) {
        var det = det3x3_1.default(m);
        var m11 = m[0x0], m12 = m[0x3], m13 = m[0x6];
        var m21 = m[0x1], m22 = m[0x4], m23 = m[0x7];
        var m31 = m[0x2], m32 = m[0x5], m33 = m[0x8];
        var o11 = m22 * m33 - m23 * m32;
        var o12 = m13 * m32 - m12 * m33;
        var o13 = m12 * m23 - m13 * m22;
        var o21 = m23 * m31 - m21 * m33;
        var o22 = m11 * m33 - m13 * m31;
        var o23 = m13 * m21 - m11 * m23;
        var o31 = m21 * m32 - m22 * m31;
        var o32 = m12 * m31 - m11 * m32;
        var o33 = m11 * m22 - m12 * m21;
        var α = 1 / det;
        te[0x0] = o11 * α;
        te[0x3] = o12 * α;
        te[0x6] = o13 * α;
        te[0x1] = o21 * α;
        te[0x4] = o22 * α;
        te[0x7] = o23 * α;
        te[0x2] = o31 * α;
        te[0x5] = o32 * α;
        te[0x8] = o33 * α;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = inv3x3;
});

define('davinci-eight/math/mul3x3',["require", "exports"], function (require, exports) {
    function mul3x3(a, b, c) {
        var a11 = a[0x0], a12 = a[0x3], a13 = a[0x6];
        var a21 = a[0x1], a22 = a[0x4], a23 = a[0x7];
        var a31 = a[0x2], a32 = a[0x5], a33 = a[0x8];
        var b11 = b[0x0], b12 = b[0x3], b13 = b[0x6];
        var b21 = b[0x1], b22 = b[0x4], b23 = b[0x7];
        var b31 = b[0x2], b32 = b[0x5], b33 = b[0x8];
        c[0x0] = a11 * b11 + a12 * b21 + a13 * b31;
        c[0x3] = a11 * b12 + a12 * b22 + a13 * b32;
        c[0x6] = a11 * b13 + a12 * b23 + a13 * b33;
        c[0x1] = a21 * b11 + a22 * b21 + a23 * b31;
        c[0x4] = a21 * b12 + a22 * b22 + a23 * b32;
        c[0x7] = a21 * b13 + a22 * b23 + a23 * b33;
        c[0x2] = a31 * b11 + a32 * b21 + a33 * b31;
        c[0x5] = a31 * b12 + a32 * b22 + a33 * b32;
        c[0x8] = a31 * b13 + a32 * b23 + a33 * b33;
        return c;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mul3x3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Matrix3',["require", "exports", '../math/AbstractMatrix', '../math/add3x3', '../math/det3x3', '../math/inv3x3', '../math/mul3x3', '../checks/mustBeNumber'], function (require, exports, AbstractMatrix_1, add3x3_1, det3x3_1, inv3x3_1, mul3x3_1, mustBeNumber_1) {
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
        function Matrix3(elements) {
            _super.call(this, elements, 3);
        }
        Matrix3.prototype.add = function (rhs) {
            return this.add2(this, rhs);
        };
        Matrix3.prototype.add2 = function (a, b) {
            add3x3_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Matrix3.prototype.clone = function () {
            return Matrix3.zero().copy(this);
        };
        Matrix3.prototype.det = function () {
            return det3x3_1.default(this.elements);
        };
        Matrix3.prototype.invertUpperLeft = function (matrix, throwOnSingular) {
            if (throwOnSingular === void 0) { throwOnSingular = false; }
            var me = matrix.elements;
            var te = this.elements;
            te[0] = me[0xA] * me[5] - me[6] * me[9];
            te[1] = -me[0xA] * me[1] + me[2] * me[9];
            te[2] = me[6] * me[1] - me[2] * me[5];
            te[3] = -me[10] * me[4] + me[6] * me[8];
            te[4] = me[10] * me[0] - me[2] * me[8];
            te[5] = -me[6] * me[0] + me[2] * me[4];
            te[6] = me[9] * me[4] - me[5] * me[8];
            te[7] = -me[9] * me[0] + me[1] * me[8];
            te[8] = me[5] * me[0] - me[1] * me[4];
            var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
            if (det === 0) {
                var msg = "Matrix3.invertUpperLeft(): can't invert matrix, determinant is 0";
                if (throwOnSingular) {
                    throw new Error(msg);
                }
                else {
                    console.warn(msg);
                    this.one();
                }
                return this;
            }
            else {
                this.scale(1 / det);
                return this;
            }
        };
        Matrix3.prototype.inv = function () {
            inv3x3_1.default(this.elements, this.elements);
            return this;
        };
        Matrix3.prototype.isOne = function () {
            var te = this.elements;
            var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
            var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
            var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
            return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1);
        };
        Matrix3.prototype.isZero = function () {
            var te = this.elements;
            var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
            var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
            var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
            return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0);
        };
        Matrix3.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        Matrix3.prototype.rmul = function (lhs) {
            mul3x3_1.default(lhs.elements, this.elements, this.elements);
            return this;
        };
        Matrix3.prototype.mul2 = function (a, b) {
            mul3x3_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Matrix3.prototype.neg = function () {
            return this.scale(-1);
        };
        Matrix3.prototype.normalFromMatrix4 = function (m) {
            return this.invertUpperLeft(m).transpose();
        };
        Matrix3.prototype.one = function () {
            return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Matrix3.prototype.reflection = function (n) {
            var nx = mustBeNumber_1.default('n.x', n.x);
            var ny = mustBeNumber_1.default('n.y', n.y);
            var aa = -2 * nx * ny;
            var xx = 1 - 2 * nx * nx;
            var yy = 1 - 2 * ny * ny;
            this.set(xx, aa, 0, aa, yy, 0, 0, 0, 1);
            return this;
        };
        Matrix3.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[3 + i], te[6 + i]];
        };
        Matrix3.prototype.rotate = function (spinor) {
            return this.rmul(Matrix3.rotation(spinor));
        };
        Matrix3.prototype.rotation = function (spinor) {
            var α = spinor.α;
            var β = spinor.β;
            var S = α * α - β * β;
            var A = 2 * α * β;
            this.set(S, A, 0, -A, S, 0, 0, 0, 1);
            return this;
        };
        Matrix3.prototype.scale = function (s) {
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
        Matrix3.prototype.sub = function (rhs) {
            var te = this.elements;
            var t11 = te[0];
            var t21 = te[1];
            var t31 = te[2];
            var t12 = te[3];
            var t22 = te[4];
            var t32 = te[5];
            var t13 = te[6];
            var t23 = te[7];
            var t33 = te[5];
            var re = rhs.elements;
            var r11 = re[0];
            var r21 = re[1];
            var r31 = re[2];
            var r12 = re[3];
            var r22 = re[4];
            var r32 = re[5];
            var r13 = re[6];
            var r23 = re[7];
            var r33 = re[8];
            var m11 = t11 - r11;
            var m21 = t21 - r21;
            var m31 = t31 - r31;
            var m12 = t12 - r12;
            var m22 = t22 - r22;
            var m32 = t32 - r32;
            var m13 = t13 - r13;
            var m23 = t23 - r23;
            var m33 = t33 - r33;
            return this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        };
        Matrix3.prototype.toExponential = function (fractionDigits) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix3.prototype.toFixed = function (fractionDigits) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix3.prototype.toPrecision = function (precision) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toPrecision(precision); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix3.prototype.toString = function (radix) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix3.prototype.translation = function (d) {
            var x = d.x;
            var y = d.y;
            return this.set(1, 0, x, 0, 1, y, 0, 0, 1);
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
        Matrix3.prototype.zero = function () {
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Matrix3.prototype.__add__ = function (rhs) {
            if (rhs instanceof Matrix3) {
                return this.clone().add(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Matrix3) {
                return lhs.clone().add(this);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Matrix3) {
                return this.clone().mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Matrix3) {
                return lhs.clone().mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__pos__ = function () {
            return this.clone();
        };
        Matrix3.prototype.__neg__ = function () {
            return this.clone().scale(-1);
        };
        Matrix3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Matrix3) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Matrix3) {
                return lhs.clone().sub(this);
            }
            else {
                return void 0;
            }
        };
        Matrix3.one = function () {
            return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        Matrix3.reflection = function (n) {
            return Matrix3.zero().reflection(n);
        };
        Matrix3.rotation = function (spinor) {
            return Matrix3.zero().rotation(spinor);
        };
        Matrix3.translation = function (d) {
            return Matrix3.zero().translation(d);
        };
        Matrix3.zero = function () {
            return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        return Matrix3;
    })(AbstractMatrix_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Matrix3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Vector3',["require", "exports", './Coords', './dotVectorE3', './Matrix3', '../checks/isDefined', '../checks/isNumber', './randomRange', '../i18n/readOnly', './toStringCustom', './wedgeXY', './wedgeYZ', './wedgeZX'], function (require, exports, Coords_1, dotVectorE3_1, Matrix3_1, isDefined_1, isNumber_1, randomRange_1, readOnly_1, toStringCustom_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var COORD_Y = 1;
    var COORD_Z = 2;
    var BASIS_LABELS = ['e1', 'e2', 'e3'];
    function coordinates(m) {
        return [m.x, m.y, m.z];
    }
    var Vector3 = (function (_super) {
        __extends(Vector3, _super);
        function Vector3(data, modified) {
            if (data === void 0) { data = [0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 3);
        }
        Vector3.dot = function (a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        };
        Object.defineProperty(Vector3.prototype, "x", {
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.coords[COORD_X] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.coords[COORD_Y] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            get: function () {
                return this.coords[COORD_Z];
            },
            set: function (value) {
                this.modified = this.modified || this.z !== value;
                this.coords[COORD_Z] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "maskG3", {
            get: function () {
                return this.isZero() ? 0x0 : 0x2;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('maskG3').message);
            },
            enumerable: true,
            configurable: true
        });
        Vector3.prototype.add = function (vector, α) {
            if (α === void 0) { α = 1; }
            this.x += vector.x * α;
            this.y += vector.y * α;
            this.z += vector.z * α;
            return this;
        };
        Vector3.prototype.applyMatrix = function (σ) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var e = σ.elements;
            this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
            this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
            this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;
            return this;
        };
        Vector3.prototype.applyMatrix4 = function (σ) {
            var x = this.x, y = this.y, z = this.z;
            var e = σ.elements;
            this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
            this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
            this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];
            return this;
        };
        Vector3.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Vector3.prototype.reflect = function (n) {
            var ax = this.x;
            var ay = this.y;
            var az = this.z;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var dot2 = (ax * nx + ay * ny + az * nz) * 2;
            this.x = ax - dot2 * nx;
            this.y = ay - dot2 * ny;
            this.z = az - dot2 * nz;
            return this;
        };
        Vector3.prototype.rotate = function (R) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var w = R.α;
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
            return new Vector3([this.x, this.y, this.z], this.modified);
        };
        Vector3.prototype.copy = function (source) {
            if (source) {
                this.x = source.x;
                this.y = source.y;
                this.z = source.z;
                return this;
            }
            else {
                throw new Error("source for copy must be a vector");
            }
        };
        Vector3.prototype.copyCoordinates = function (coordinates) {
            this.x = coordinates[COORD_X];
            this.y = coordinates[COORD_Y];
            this.z = coordinates[COORD_Z];
            return this;
        };
        Vector3.prototype.cross = function (v) {
            return this.cross2(this, v);
        };
        Vector3.prototype.cross2 = function (a, b) {
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.x = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.y = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.z = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        Vector3.prototype.distanceTo = function (point) {
            if (isDefined_1.default(point)) {
                return sqrt(this.quadranceTo(point));
            }
            else {
                return void 0;
            }
        };
        Vector3.prototype.quadranceTo = function (point) {
            if (isDefined_1.default(point)) {
                var dx = this.x - point.x;
                var dy = this.y - point.y;
                var dz = this.z - point.z;
                return dx * dx + dy * dy + dz * dz;
            }
            else {
                return void 0;
            }
        };
        Vector3.prototype.divByScalar = function (α) {
            if (α !== 0) {
                var invScalar = 1 / α;
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
        Vector3.prototype.dual = function (B, changeSign) {
            if (changeSign) {
                this.x = B.yz;
                this.y = B.zx;
                this.z = B.xy;
            }
            else {
                this.x = -B.yz;
                this.y = -B.zx;
                this.z = -B.xy;
            }
            return this;
        };
        Vector3.prototype.equals = function (other) {
            if (other instanceof Vector3) {
                return this.x === other.x && this.y === other.y && this.z === other.z;
            }
            else {
                return false;
            }
        };
        Vector3.prototype.isZero = function () {
            return this.x === 0 && this.y === 0 && this.z === 0;
        };
        Vector3.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        Vector3.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };
        Vector3.prototype.lerp = function (target, α) {
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            return this;
        };
        Vector3.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        Vector3.prototype.normalize = function () {
            var m = this.magnitude();
            if (m !== 0) {
                return this.divByScalar(m);
            }
            else {
                return this.zero();
            }
        };
        Vector3.prototype.scale = function (α) {
            this.x *= α;
            this.y *= α;
            this.z *= α;
            return this;
        };
        Vector3.prototype.stress = function (σ) {
            this.x *= σ.x;
            this.y *= σ.y;
            this.z *= σ.z;
            return this;
        };
        Vector3.prototype.setXYZ = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        Vector3.prototype.slerp = function (target, α) {
            return this;
        };
        Vector3.prototype.squaredNorm = function () {
            return dotVectorE3_1.default(this, this);
        };
        Vector3.prototype.sub = function (v, α) {
            if (α === void 0) { α = 1; }
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        };
        Vector3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Vector3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Vector3.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Vector3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Vector3.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        Vector3.prototype.__add__ = function (rhs) {
            if (rhs instanceof Vector3) {
                return this.clone().add(rhs, 1.0);
            }
            else {
                return void 0;
            }
        };
        Vector3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Vector3) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        Vector3.prototype.__mul__ = function (rhs) {
            if (isNumber_1.default(rhs)) {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Vector3.prototype.__rmul__ = function (lhs) {
            if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else if (lhs instanceof Matrix3_1.default) {
                return this.clone().applyMatrix(lhs);
            }
            else {
                return void 0;
            }
        };
        Vector3.copy = function (vector) {
            return new Vector3([vector.x, vector.y, vector.z]);
        };
        Vector3.dual = function (B, changeSign) {
            if (changeSign) {
                return new Vector3([B.yz, B.zx, B.xy]);
            }
            else {
                return new Vector3([-B.yz, -B.zx, -B.xy]);
            }
        };
        Vector3.isInstance = function (x) {
            return x instanceof Vector3;
        };
        Vector3.lerp = function (a, b, α) {
            return Vector3.copy(b).sub(a).scale(α).add(a);
        };
        Vector3.random = function () {
            var x = randomRange_1.default(-1, 1);
            var y = randomRange_1.default(-1, 1);
            var z = randomRange_1.default(-1, 1);
            return Vector3.vector(x, y, z).normalize();
        };
        Vector3.vector = function (x, y, z) {
            return new Vector3([x, y, z]);
        };
        Vector3.zero = function () {
            return new Vector3([0, 0, 0]);
        };
        return Vector3;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Vector2',["require", "exports", '../math/Coords', '../geometries/b2', '../geometries/b3', '../i18n/notImplemented', './randomRange', '../math/stringFromCoordinates'], function (require, exports, Coords_1, b2_1, b3_1, notImplemented_1, randomRange_1, stringFromCoordinates_1) {
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var COORD_Y = 1;
    var Vector2 = (function (_super) {
        __extends(Vector2, _super);
        function Vector2(data, modified) {
            if (data === void 0) { data = [0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 2);
        }
        Object.defineProperty(Vector2.prototype, "x", {
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.coords[COORD_X] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "y", {
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.coords[COORD_Y] = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector2.prototype.add = function (v, α) {
            if (α === void 0) { α = 1; }
            this.x += v.x * α;
            this.y += v.y * α;
            return this;
        };
        Vector2.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            return this;
        };
        Vector2.prototype.applyMatrix = function (σ) {
            var x = this.x;
            var y = this.y;
            var e = σ.elements;
            this.x = e[0x0] * x + e[0x2] * y;
            this.y = e[0x1] * x + e[0x3] * y;
            return this;
        };
        Vector2.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Vector2.prototype.clone = function () {
            return new Vector2([this.x, this.y]);
        };
        Vector2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        Vector2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            this.x = x;
            this.y = y;
            return this;
        };
        Vector2.prototype.distanceTo = function (position) {
            return sqrt(this.quadranceTo(position));
        };
        Vector2.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vector2.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        };
        Vector2.prototype.scale = function (α) {
            this.x *= α;
            this.y *= α;
            return this;
        };
        Vector2.prototype.divByScalar = function (α) {
            this.x /= α;
            this.y /= α;
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
        Vector2.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Vector2.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        Vector2.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        Vector2.prototype.normalize = function () {
            return this.divByScalar(this.magnitude());
        };
        Vector2.prototype.squaredNorm = function () {
            return this.x * this.x + this.y * this.y;
        };
        Vector2.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            var dy = this.y - position.y;
            return dx * dx + dy * dy;
        };
        Vector2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            this.x = x;
            this.y = y;
            return this;
        };
        Vector2.prototype.reflect = function (n) {
            throw new Error(notImplemented_1.default('reflect').message);
        };
        Vector2.prototype.rotate = function (spinor) {
            var x = this.x;
            var y = this.y;
            var α = spinor.α;
            var β = spinor.β;
            var p = α * α - β * β;
            var q = 2 * α * β;
            this.x = p * x + q * y;
            this.y = p * y - q * x;
            return this;
        };
        Vector2.prototype.lerp = function (v, α) {
            this.x += (v.x - this.x) * α;
            this.y += (v.y - this.y) * α;
            return this;
        };
        Vector2.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        Vector2.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y));
        };
        Vector2.prototype.stress = function (σ) {
            this.x *= σ.x;
            this.y *= σ.y;
            return this;
        };
        Vector2.prototype.slerp = function (v, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        Vector2.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return stringFromCoordinates_1.default(this.coords, coordToString, ['e1', 'e2']);
        };
        Vector2.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates_1.default(this.coords, coordToString, ['e1', 'e2']);
        };
        Vector2.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return stringFromCoordinates_1.default(this.coords, coordToString, ['e1', 'e2']);
        };
        Vector2.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return stringFromCoordinates_1.default(this.coords, coordToString, ['e1', 'e2']);
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
        Vector2.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            return this;
        };
        Vector2.copy = function (vector) {
            return Vector2.vector(vector.x, vector.y);
        };
        Vector2.lerp = function (a, b, α) {
            return Vector2.copy(b).sub(a).scale(α).add(a);
        };
        Vector2.random = function () {
            var x = randomRange_1.default(-1, 1);
            var y = randomRange_1.default(-1, 1);
            return Vector2.vector(x, y).normalize();
        };
        Vector2.vector = function (x, y) {
            return new Vector2([x, y]);
        };
        Vector2.zero = function () {
            return Vector2.vector(0, 0);
        };
        return Vector2;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/controls/MouseControls',["require", "exports", '../base/incLevel', '../checks/mustBeObject', '../core/ShareableBase', '../math/Vector2'], function (require, exports, incLevel_1, mustBeObject_1, ShareableBase_1, Vector2_1) {
    var MODE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
    var keys = [65, 83, 68];
    var MouseControls = (function (_super) {
        __extends(MouseControls, _super);
        function MouseControls(wnd) {
            var _this = this;
            _super.call(this);
            this.enabled = true;
            this.noRotate = false;
            this.noZoom = false;
            this.noPan = false;
            this.minDistance = 0;
            this.maxDistance = Infinity;
            this.mode = MODE.NONE;
            this.prevMode = MODE.NONE;
            this.moveCurr = new Vector2_1.default();
            this.movePrev = new Vector2_1.default();
            this.zoomStart = new Vector2_1.default();
            this.zoomEnd = new Vector2_1.default();
            this.panStart = new Vector2_1.default();
            this.panEnd = new Vector2_1.default();
            this.screenLoc = new Vector2_1.default();
            this.circleExt = new Vector2_1.default();
            this.screenExt = new Vector2_1.default();
            this.mouseOnCircle = new Vector2_1.default();
            this.mouseOnScreen = new Vector2_1.default();
            this.setLoggingName('MouseControls');
            this.wnd = mustBeObject_1.default('wnd', wnd);
            this.mousedown = function (event) {
                if (!_this.enabled) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                if (_this.mode === MODE.NONE) {
                    _this.mode = event.button;
                }
                if (_this.mode === MODE.ROTATE && !_this.noRotate) {
                    _this.updateMouseOnCircle(event);
                    _this.moveCurr.copy(_this.mouseOnCircle);
                    _this.movePrev.copy(_this.mouseOnCircle);
                }
                else if (_this.mode === MODE.ZOOM && !_this.noZoom) {
                    _this.updateMouseOnScreen(event);
                    _this.zoomStart.copy(_this.mouseOnScreen);
                    _this.zoomEnd.copy(_this.mouseOnScreen);
                }
                else if (_this.mode === MODE.PAN && !_this.noPan) {
                    _this.updateMouseOnScreen(event);
                    _this.panStart.copy(_this.mouseOnScreen);
                    _this.panEnd.copy(_this.mouseOnScreen);
                }
                _this.wnd.document.addEventListener('mousemove', _this.mousemove, false);
                _this.wnd.document.addEventListener('mouseup', _this.mouseup, false);
            };
            this.mousemove = function (event) {
                if (!_this.enabled) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                if (_this.mode === MODE.ROTATE && !_this.noRotate) {
                    _this.movePrev.copy(_this.moveCurr);
                    _this.updateMouseOnCircle(event);
                    _this.moveCurr.copy(_this.mouseOnCircle);
                }
                else if (_this.mode === MODE.ZOOM && !_this.noZoom) {
                    _this.updateMouseOnScreen(event);
                    _this.zoomEnd.copy(_this.mouseOnScreen);
                }
                else if (_this.mode === MODE.PAN && !_this.noPan) {
                    _this.updateMouseOnScreen(event);
                    _this.panEnd.copy(_this.mouseOnScreen);
                }
            };
            this.mouseup = function (event) {
                if (!_this.enabled) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                _this.mode = MODE.NONE;
                _this.wnd.document.removeEventListener('mousemove', _this.mousemove);
                _this.wnd.document.removeEventListener('mouseup', _this.mouseup);
            };
            this.mousewheel = function (event) {
                if (!_this.enabled) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                var delta = 0;
                if (event.wheelDelta) {
                    delta = event.wheelDelta / 40;
                }
                else if (event.detail) {
                    delta = event.detail / 3;
                }
                _this.zoomStart.y += delta * 0.01;
            };
            this.keydown = function (event) {
                if (!_this.enabled) {
                    return;
                }
                _this.wnd.removeEventListener('keydown', _this.keydown, false);
                _this.prevMode = _this.mode;
                if (_this.mode !== MODE.NONE) {
                    return;
                }
                else if (event.keyCode === keys[MODE.ROTATE] && !_this.noRotate) {
                    _this.mode = MODE.ROTATE;
                }
                else if (event.keyCode === keys[MODE.ZOOM] && !_this.noRotate) {
                    _this.mode = MODE.ZOOM;
                }
                else if (event.keyCode === keys[MODE.PAN] && !_this.noRotate) {
                    _this.mode = MODE.PAN;
                }
            };
            this.keyup = function (event) {
                if (!_this.enabled) {
                    return;
                }
                _this.mode = _this.prevMode;
                _this.wnd.addEventListener('keydown', _this.keydown, false);
            };
            this.contextmenu = function (event) {
                event.preventDefault();
            };
        }
        MouseControls.prototype.destructor = function (levelUp) {
            if (this.domElement) {
                this.unsubscribe();
            }
            _super.prototype.destructor.call(this, incLevel_1.default(levelUp));
        };
        MouseControls.prototype.move = function (x, y) {
            this.moveCurr.x = x;
            this.moveCurr.y = y;
        };
        MouseControls.prototype.subscribe = function (domElement) {
            if (this.domElement) {
                this.unsubscribe();
            }
            this.domElement = domElement;
            this.domElement.addEventListener('contextmenu', this.contextmenu, false);
            this.domElement.addEventListener('mousedown', this.mousedown, false);
            this.domElement.addEventListener('mousewheel', this.mousewheel, false);
            this.domElement.addEventListener('DOMMouseScroll', this.mousewheel, false);
            this.wnd.addEventListener('keydown', this.keydown, false);
            this.wnd.addEventListener('keyup', this.keydown, false);
            this.handleResize();
        };
        MouseControls.prototype.unsubscribe = function () {
            if (this.domElement) {
                this.domElement.removeEventListener('contextmenu', this.contextmenu, false);
                this.domElement.removeEventListener('mousedown', this.mousedown, false);
                this.domElement.removeEventListener('mousewheel', this.mousewheel, false);
                this.domElement.removeEventListener('DOMMouseScroll', this.mousewheel, false);
                this.domElement = void 0;
                this.wnd.removeEventListener('keydown', this.keydown, false);
                this.wnd.removeEventListener('keyup', this.keydown, false);
            }
        };
        MouseControls.prototype.reset = function () {
            this.mode = MODE.NONE;
        };
        MouseControls.prototype.updateMouseOnCircle = function (mouse) {
            this.mouseOnCircle.x = mouse.pageX;
            this.mouseOnCircle.y = -mouse.pageY;
            this.mouseOnCircle.sub(this.screenLoc).scale(2).sub(this.circleExt).divByScalar(this.circleExt.x);
        };
        MouseControls.prototype.updateMouseOnScreen = function (mouse) {
            this.mouseOnScreen.x = mouse.pageX;
            this.mouseOnScreen.y = -mouse.pageY;
            this.mouseOnScreen.sub(this.screenLoc);
            this.mouseOnScreen.x /= this.circleExt.x;
            this.mouseOnScreen.y /= this.circleExt.y;
        };
        MouseControls.prototype.handleResize = function () {
            if (false) {
            }
            else {
                var boundingRect = this.domElement.getBoundingClientRect();
                var domElement = this.domElement.ownerDocument.documentElement;
                this.screenLoc.x = boundingRect.left + window.pageXOffset - domElement.clientLeft;
                this.screenLoc.y = -(boundingRect.top + window.pageYOffset - domElement.clientTop);
                this.circleExt.x = boundingRect.width;
                this.circleExt.y = -boundingRect.height;
                this.screenExt.x = boundingRect.width;
                this.screenExt.y = boundingRect.height;
            }
        };
        return MouseControls;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MouseControls;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/controls/ViewControls',["require", "exports", './MouseControls', '../math/Vector3'], function (require, exports, MouseControls_1, Vector3_1) {
    var ViewControls = (function (_super) {
        __extends(ViewControls, _super);
        function ViewControls(view, wnd) {
            _super.call(this, wnd);
            this.rotateSpeed = 1;
            this.zoomSpeed = 1;
            this.panSpeed = 1;
            this.eye0 = Vector3_1.default.zero();
            this.look0 = Vector3_1.default.zero();
            this.up0 = Vector3_1.default.zero();
            this.eyeMinusLook = new Vector3_1.default();
            this.look = new Vector3_1.default();
            this.up = new Vector3_1.default();
            this.setLoggingName('ViewControls');
            this.setView(view);
        }
        ViewControls.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        ViewControls.prototype.hasView = function () {
            return !!this.view;
        };
        ViewControls.prototype.update = function () {
            if (this.view) {
                this.eyeMinusLook.copy(this.view.eye).sub(this.view.look);
                this.look.copy(this.view.look);
                this.up.copy(this.view.up);
                if (!this.noRotate) {
                    this.rotateCamera();
                }
                if (!this.noZoom) {
                    this.zoomCamera();
                }
                if (!this.noPan) {
                    this.panCamera();
                }
                this.view.eye.copyVector(this.look).addVector(this.eyeMinusLook);
                this.view.look.copyVector(this.look);
                this.view.up.copyVector(this.up);
            }
        };
        ViewControls.prototype.rotateCamera = function () {
        };
        ViewControls.prototype.zoomCamera = function () {
            var factor = 1 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed;
            if (factor !== 1 && factor > 0) {
                this.eyeMinusLook.scale(factor);
                this.zoomStart.copy(this.zoomEnd);
            }
        };
        ViewControls.prototype.panCamera = function () {
        };
        ViewControls.prototype.reset = function () {
            if (this.view) {
                this.view.eye.copyVector(this.eye0);
                this.view.look.copyVector(this.look0);
                this.view.up.copyVector(this.up0);
            }
            _super.prototype.reset.call(this);
        };
        ViewControls.prototype.setView = function (view) {
            if (view) {
                this.eye0.copy(view.eye);
                this.look0.copy(view.look);
                this.up0.copy(view.up);
                this.view = view;
            }
            else {
                this.view = void 0;
            }
        };
        return ViewControls;
    })(MouseControls_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ViewControls;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/controls/OrbitControls',["require", "exports", '../math/Geometric3', '../facets/getViewAttitude', '../math/Spinor3', '../math/Vector3', './ViewControls'], function (require, exports, Geometric3_1, getViewAttitude_1, Spinor3_1, Vector3_1, ViewControls_1) {
    var a = Geometric3_1.default.zero();
    var b = Geometric3_1.default.zero();
    var d = Geometric3_1.default.zero();
    var B = Spinor3_1.default.one();
    var R = Spinor3_1.default.one();
    var X = Vector3_1.default.zero();
    var OrbitControls = (function (_super) {
        __extends(OrbitControls, _super);
        function OrbitControls(view, wnd) {
            _super.call(this, view, wnd);
            this.setLoggingName('OrbitControls');
        }
        OrbitControls.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        OrbitControls.prototype.rotateCamera = function () {
            if (this.hasView()) {
                var Δs = this.moveCurr.distanceTo(this.movePrev);
                if (Δs > 0) {
                    var ψ = Δs * 2 * Math.PI * this.rotateSpeed;
                    X.copy(this.eyeMinusLook).add(this.look);
                    getViewAttitude_1.default(X, this.look, this.up, R);
                    a.zero();
                    a.x = this.movePrev.x;
                    a.y = this.movePrev.y;
                    b.zero();
                    b.x = this.moveCurr.x;
                    b.y = this.moveCurr.y;
                    d.copy(b).sub(a);
                    d.rotate(R);
                    X.normalize();
                    B.wedge(X, d).normalize();
                    R.copy(B).scale(+ψ / 2).exp();
                    this.eyeMinusLook.rotate(R);
                }
            }
            this.movePrev.copy(this.moveCurr);
        };
        return OrbitControls;
    })(ViewControls_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = OrbitControls;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/controls/TrackballControls',["require", "exports", '../math/Spinor3', '../math/Vector2', '../math/Vector3', './ViewControls'], function (require, exports, Spinor3_1, Vector2_1, Vector3_1, ViewControls_1) {
    var TrackballControls = (function (_super) {
        __extends(TrackballControls, _super);
        function TrackballControls(view, wnd) {
            _super.call(this, view, wnd);
            this.moveDirection = new Vector3_1.default();
            this.eyeMinusLookDirection = new Vector3_1.default();
            this.objectUpDirection = new Vector3_1.default();
            this.objectSidewaysDirection = new Vector3_1.default();
            this.B = Spinor3_1.default.zero();
            this.rotor = Spinor3_1.default.one();
            this.mouseChange = new Vector2_1.default();
            this.pan = new Vector3_1.default();
            this.objectUp = new Vector3_1.default();
            this.setLoggingName('TrackballControls');
        }
        TrackballControls.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        TrackballControls.prototype.rotateCamera = function () {
            if (this.hasView()) {
                this.moveDirection.setXYZ(this.moveCurr.x - this.movePrev.x, this.moveCurr.y - this.movePrev.y, 0);
                var Δs = this.moveDirection.magnitude();
                if (Δs > 0) {
                    var ψ = Δs * 2 * Math.PI * this.rotateSpeed;
                    this.eyeMinusLookDirection.copy(this.eyeMinusLook).normalize();
                    this.objectUpDirection.copy(this.up).normalize();
                    this.objectSidewaysDirection.copy(this.objectUpDirection).cross(this.eyeMinusLookDirection);
                    this.objectUpDirection.scale(this.moveCurr.y - this.movePrev.y);
                    this.objectSidewaysDirection.scale(this.moveCurr.x - this.movePrev.x);
                    this.moveDirection.copy(this.objectUpDirection).add(this.objectSidewaysDirection).normalize();
                    this.B.wedge(this.moveDirection, this.eyeMinusLookDirection).normalize();
                    this.rotor.rotorFromGeneratorAngle(this.B, ψ);
                    this.eyeMinusLook.rotate(this.rotor);
                    this.up.rotate(this.rotor);
                    this.movePrev.copy(this.moveCurr);
                }
            }
        };
        TrackballControls.prototype.panCamera = function () {
            if (this.hasView()) {
                this.mouseChange.copy(this.panEnd).sub(this.panStart);
                if (this.mouseChange.squaredNorm()) {
                    this.mouseChange.scale(this.eyeMinusLook.magnitude() * this.panSpeed);
                    this.pan.copy(this.eyeMinusLook).cross(this.up).normalize().scale(this.mouseChange.x);
                    this.objectUp.copy(this.up).normalize().scale(this.mouseChange.y);
                    this.pan.add(this.objectUp);
                    this.look.add(this.pan);
                    this.panStart.copy(this.panEnd);
                }
            }
        };
        return TrackballControls;
    })(ViewControls_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TrackballControls;
});

define('davinci-eight/core/AttribLocation',["require", "exports", '../i18n/readOnly'], function (require, exports, readOnly_1) {
    var AttribLocation = (function () {
        function AttribLocation(info) {
            this._name = info.name;
        }
        Object.defineProperty(AttribLocation.prototype, "index", {
            get: function () {
                return this._index;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('index').message);
            },
            enumerable: true,
            configurable: true
        });
        AttribLocation.prototype.contextFree = function () {
            this._index = void 0;
            this._gl = void 0;
        };
        AttribLocation.prototype.contextGain = function (context, program) {
            this._index = context.getAttribLocation(program, this._name);
            this._gl = context;
        };
        AttribLocation.prototype.contextLost = function () {
            this._index = void 0;
            this._gl = void 0;
        };
        AttribLocation.prototype.vertexPointer = function (size, normalized, stride, offset) {
            if (normalized === void 0) { normalized = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this._gl.vertexAttribPointer(this._index, size, this._gl.FLOAT, normalized, stride, offset);
        };
        AttribLocation.prototype.enable = function () {
            this._gl.enableVertexAttribArray(this._index);
        };
        AttribLocation.prototype.disable = function () {
            this._gl.disableVertexAttribArray(this._index);
        };
        AttribLocation.prototype.toString = function () {
            return ['attribute', this._name].join(' ');
        };
        return AttribLocation;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AttribLocation;
});

define('davinci-eight/math/clamp',["require", "exports", '../checks/mustBeNumber'], function (require, exports, mustBeNumber_1) {
    function clamp(x, min, max) {
        mustBeNumber_1.default('x', x);
        mustBeNumber_1.default('min', min);
        mustBeNumber_1.default('max', max);
        return (x < min) ? min : ((x > max) ? max : x);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = clamp;
});

define('davinci-eight/checks/isGE',["require", "exports"], function (require, exports) {
    function default_1(value, limit) {
        return value >= limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/mustBeGE',["require", "exports", '../checks/mustSatisfy', '../checks/isGE'], function (require, exports, mustSatisfy_1, isGE_1) {
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isGE_1.default(value, limit), function () { return "be greater than or equal to " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/isLE',["require", "exports"], function (require, exports) {
    function default_1(value, limit) {
        return value <= limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/mustBeLE',["require", "exports", '../checks/mustSatisfy', '../checks/isLE'], function (require, exports, mustSatisfy_1, isLE_1) {
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isLE_1.default(value, limit), function () { return "be less than or equal to " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/principalAngle',["require", "exports"], function (require, exports) {
    function principalAngle(angle) {
        if (angle > 2 * Math.PI) {
            return principalAngle(angle - 2 * Math.PI);
        }
        else if (angle < 0) {
            return principalAngle(angle + 2 * Math.PI);
        }
        else {
            return angle;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = principalAngle;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Color',["require", "exports", '../math/clamp', '../math/Coords', '../config', '../core/ErrorMode', '../checks/isDefined', '../checks/mustBeArray', '../checks/mustBeGE', '../checks/mustBeLE', '../checks/mustBeNumber', './principalAngle'], function (require, exports, clamp_1, Coords_1, config_1, ErrorMode_1, isDefined_1, mustBeArray_1, mustBeGE_1, mustBeLE_1, mustBeNumber_1, principalAngle_1) {
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    var Color = (function (_super) {
        __extends(Color, _super);
        function Color(r, g, b) {
            _super.call(this, [r, g, b], false, 3);
            mustBeGE_1.default('r', r, 0);
            mustBeLE_1.default('r', r, 1);
            mustBeGE_1.default('g', g, 0);
            mustBeLE_1.default('g', g, 1);
            mustBeGE_1.default('b', b, 0);
            mustBeLE_1.default('b', b, 1);
        }
        Object.defineProperty(Color.prototype, "r", {
            get: function () {
                return this.coords[COORD_R];
            },
            set: function (r) {
                this.coords[COORD_R] = clamp_1.default(r, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            get: function () {
                return this.coords[COORD_G];
            },
            set: function (g) {
                this.coords[COORD_G] = clamp_1.default(g, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            get: function () {
                return this.coords[COORD_B];
            },
            set: function (b) {
                this.coords[COORD_B] = clamp_1.default(b, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.add = function (rhs) {
            return this;
        };
        Color.prototype.add2 = function (a, b) {
            return this;
        };
        Color.prototype.applyMatrix = function (σ) {
            return this;
        };
        Color.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b);
        };
        Color.prototype.copy = function (color) {
            if (isDefined_1.default(color)) {
                this.r = color.r;
                this.g = color.g;
                this.b = color.b;
                return this;
            }
            else {
                this.r = Math.random();
                this.g = Math.random();
                this.b = Math.random();
            }
        };
        Color.prototype.divByScalar = function (α) {
            return this;
        };
        Color.prototype.lerp = function (target, α) {
            this.r += (target.r - this.r) * α;
            this.g += (target.g - this.g) * α;
            this.b += (target.b - this.b) * α;
            return this;
        };
        Object.defineProperty(Color.prototype, "luminance", {
            get: function () {
                return Color.luminance(this.r, this.g, this.b);
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.neg = function () {
            return this;
        };
        Color.prototype.reflect = function (n) {
            return this;
        };
        Color.prototype.rotate = function (R) {
            return this;
        };
        Color.prototype.scale = function (α) {
            return this;
        };
        Color.prototype.slerp = function (target, α) {
            return this;
        };
        Color.prototype.stress = function (σ) {
            return this;
        };
        Color.prototype.sub = function (rhs) {
            return this;
        };
        Color.prototype.sub2 = function (a, b) {
            return this;
        };
        Color.prototype.toExponential = function (fractionDigits) {
            return this.toString();
        };
        Color.prototype.toFixed = function (fractionDigits) {
            return this.toString();
        };
        Color.prototype.toPrecision = function (precision) {
            return this.toString();
        };
        Color.prototype.toString = function () {
            return "Color(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        Color.prototype.zero = function () {
            return this;
        };
        Color.copy = function (color) {
            return new Color(color.r, color.g, color.b);
        };
        Color.luminance = function (r, g, b) {
            mustBeNumber_1.default('r', r);
            mustBeNumber_1.default('g', g);
            mustBeNumber_1.default('b', b);
            var pow = Math.pow;
            var γ = 2.2;
            return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
        };
        Color.fromCoords = function (coords) {
            mustBeArray_1.default('coords', coords);
            var r = mustBeNumber_1.default('r', coords[COORD_R]);
            var g = mustBeNumber_1.default('g', coords[COORD_G]);
            var b = mustBeNumber_1.default('b', coords[COORD_B]);
            return new Color(r, g, b);
        };
        Color.fromHSL = function (H, S, L) {
            mustBeNumber_1.default('H', H);
            mustBeNumber_1.default('S', S);
            mustBeNumber_1.default('L', L);
            var C = (1 - Math.abs(2 * L - 1)) * S;
            function matchLightness(R, G, B) {
                var m = L - 0.5 * C;
                return new Color(R + m, G + m, B + m);
            }
            var sextant = ((principalAngle_1.default(H) / Math.PI) * 3) % 6;
            var X = C * (1 - Math.abs(sextant % 2 - 1));
            if (sextant >= 0 && sextant < 1) {
                return matchLightness(C, X, 0);
            }
            else if (sextant >= 1 && sextant < 2) {
                return matchLightness(X, C, 0);
            }
            else if (sextant >= 2 && sextant < 3) {
                return matchLightness(0, C, C * (sextant - 2));
            }
            else if (sextant >= 3 && sextant < 4) {
                return matchLightness(0, C * (4 - sextant), C);
            }
            else if (sextant >= 4 && sextant < 5) {
                return matchLightness(X, 0, C);
            }
            else if (sextant >= 5 && sextant < 6) {
                return matchLightness(C, 0, X);
            }
            else {
                return matchLightness(0, 0, 0);
            }
        };
        Color.fromRGB = function (r, g, b) {
            mustBeNumber_1.default('r', r);
            mustBeNumber_1.default('g', g);
            mustBeNumber_1.default('b', b);
            return new Color(clamp_1.default(r, 0, 1), clamp_1.default(g, 0, 1), clamp_1.default(b, 0, 1));
        };
        Color.isInstance = function (x) {
            return x instanceof Color;
        };
        Color.lerp = function (a, b, α) {
            return Color.copy(a).lerp(b, clamp_1.default(α, 0, 1));
        };
        Color.mustBe = function (name, color) {
            if (Color.isInstance(color)) {
                return color;
            }
            else {
                switch (config_1.default.errorMode) {
                    case ErrorMode_1.default.IGNORE: {
                        return Color.random();
                    }
                    case ErrorMode_1.default.WARNME: {
                        console.warn(name + " must be a Color.");
                        return Color.random();
                    }
                    default: {
                        throw new Error(name + " must be a Color.");
                    }
                }
            }
        };
        Color.random = function () {
            return Color.fromRGB(Math.random(), Math.random(), Math.random());
        };
        Color.black = new Color(0, 0, 0);
        Color.blue = new Color(0, 0, 1);
        Color.green = new Color(0, 1, 0);
        Color.cyan = new Color(0, 1, 1);
        Color.red = new Color(1, 0, 0);
        Color.magenta = new Color(1, 0, 1);
        Color.yellow = new Color(1, 1, 0);
        Color.white = new Color(1, 1, 1);
        Color.gray = new Color(0.5, 0.5, 0.5);
        return Color;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Color;
});

define('davinci-eight/base/exchange',["require", "exports"], function (require, exports) {
    function default_1(mine, yours) {
        if (mine !== yours) {
            if (yours) {
                yours.addRef();
            }
            if (mine) {
                mine.release();
            }
            return yours;
        }
        else {
            return mine;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/cleanUp',["require", "exports"], function (require, exports) {
    function cleanUp(contextProvider, consumer) {
        if (contextProvider) {
            if (contextProvider.isContextLost()) {
                consumer.contextLost();
            }
            else {
                consumer.contextFree(contextProvider);
            }
        }
        else {
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = cleanUp;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/ShareableContextConsumer',["require", "exports", './cleanUp', './Engine', '../base/incLevel', '../checks/isUndefined', '../checks/isNull', '../checks/mustBeBoolean', '../checks/mustBeObject', '../i18n/readOnly', './ShareableBase'], function (require, exports, cleanUp_1, Engine_1, incLevel_1, isUndefined_1, isNull_1, mustBeBoolean_1, mustBeObject_1, readOnly_1, ShareableBase_1) {
    var ShareableContextConsumer = (function (_super) {
        __extends(ShareableContextConsumer, _super);
        function ShareableContextConsumer(engine) {
            _super.call(this);
            this.setLoggingName('ShareableContextConsumer');
            if (engine instanceof Engine_1.default) {
                this.subscribe(engine, false);
            }
            else if (!isNull_1.default(engine) && !isUndefined_1.default(engine)) {
                throw new Error("engine must be an Engine or null or undefined. typeof engine => " + typeof engine);
            }
        }
        ShareableContextConsumer.prototype.destructor = function (level) {
            this.unsubscribe(false);
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        ShareableContextConsumer.prototype.subscribe = function (engine, synchronize) {
            engine = mustBeObject_1.default('engine', engine);
            synchronize = mustBeBoolean_1.default('synchronize', synchronize);
            if (!this.engine) {
                engine.addRef();
                this.engine = engine;
                engine.addContextListener(this);
                if (synchronize) {
                    engine.synchronize(this);
                }
            }
            else {
                if (this.engine !== engine) {
                    this.unsubscribe(synchronize);
                    this.subscribe(engine, synchronize);
                }
                else {
                }
            }
        };
        ShareableContextConsumer.prototype.synchUp = function () {
            var engine = this.engine;
            if (engine) {
                engine.synchronize(this);
            }
        };
        ShareableContextConsumer.prototype.cleanUp = function () {
            cleanUp_1.default(this.contextProvider, this);
        };
        ShareableContextConsumer.prototype.unsubscribe = function (synchronize) {
            synchronize = mustBeBoolean_1.default('synchronize', synchronize);
            if (this.engine) {
                if (synchronize) {
                    cleanUp_1.default(this.contextProvider, this);
                }
                this.engine.removeContextListener(this);
                this.engine.release();
                this.engine = void 0;
            }
        };
        ShareableContextConsumer.prototype.contextFree = function (contextProvider) {
            if (this.contextProvider) {
                this.contextProvider.release();
                this.contextProvider = void 0;
            }
        };
        ShareableContextConsumer.prototype.contextGain = function (contextProvider) {
            if (this.contextProvider !== contextProvider) {
                if (this.contextProvider) {
                    this.contextProvider.release();
                    this.contextProvider = void 0;
                }
                contextProvider.addRef();
                this.contextProvider = contextProvider;
            }
        };
        ShareableContextConsumer.prototype.contextLost = function () {
            if (this.contextProvider) {
                this.contextProvider.release();
                this.contextProvider = void 0;
            }
        };
        Object.defineProperty(ShareableContextConsumer.prototype, "gl", {
            get: function () {
                if (this.contextProvider) {
                    return this.contextProvider.gl;
                }
                else {
                    return void 0;
                }
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('gl').message);
            },
            enumerable: true,
            configurable: true
        });
        return ShareableContextConsumer;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShareableContextConsumer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Drawable',["require", "exports", '../base/exchange', '../checks/isDefined', '../checks/mustBeBoolean', '../core/ShareableContextConsumer'], function (require, exports, exchange_1, isDefined_1, mustBeBoolean_1, ShareableContextConsumer_1) {
    var Drawable = (function (_super) {
        __extends(Drawable, _super);
        function Drawable(geometry, material, engine) {
            _super.call(this, engine);
            this._visible = true;
            this.setLoggingName('Drawable');
            if (isDefined_1.default(geometry)) {
                this.geometry = geometry;
            }
            if (isDefined_1.default(material)) {
                this.material = material;
            }
            this._facets = {};
        }
        Drawable.prototype.destructor = function (levelUp) {
            this._geometry = exchange_1.default(this._geometry, void 0);
            this._material = exchange_1.default(this._material, void 0);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Drawable.prototype, "fragmentShaderSrc", {
            get: function () {
                if (this._material) {
                    return this._material.fragmentShaderSrc;
                }
                else {
                    return void 0;
                }
            },
            set: function (fragmentShaderSrc) {
                if (this._material) {
                    this._material.fragmentShaderSrc = fragmentShaderSrc;
                }
                else {
                    throw new Error("Unable to set fragmentShaderSrc because " + this._type + ".material is not defined.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Drawable.prototype, "vertexShaderSrc", {
            get: function () {
                if (this._material) {
                    return this._material.vertexShaderSrc;
                }
                else {
                    return void 0;
                }
            },
            set: function (vertexShaderSrc) {
                var material = this._material;
                if (material) {
                    material.vertexShaderSrc = vertexShaderSrc;
                }
                else {
                    throw new Error("Unableto  set vertexShaderSrc because " + this._type + ".material is not defined.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Drawable.prototype.setUniforms = function () {
            var material = this._material;
            var facets = this._facets;
            var keys = Object.keys(facets);
            var keysLength = keys.length;
            for (var i = 0; i < keysLength; i++) {
                var key = keys[i];
                var facet = facets[key];
                facet.setUniforms(material);
            }
        };
        Drawable.prototype.draw = function (ambients) {
            if (this._visible) {
                var material = this._material;
                material.use();
                var iL = ambients.length;
                for (var i = 0; i < iL; i++) {
                    var facet = ambients[i];
                    facet.setUniforms(material);
                }
                this.setUniforms();
                this._geometry.draw(material);
            }
        };
        Drawable.prototype.contextFree = function (context) {
            this._geometry.contextFree(context);
            this._material.contextFree(context);
            _super.prototype.contextFree.call(this, context);
        };
        Drawable.prototype.contextGain = function (context) {
            this._geometry.contextGain(context);
            this._material.contextGain(context);
            _super.prototype.contextGain.call(this, context);
        };
        Drawable.prototype.contextLost = function () {
            this._geometry.contextLost();
            this._material.contextLost();
            _super.prototype.contextLost.call(this);
        };
        Drawable.prototype.getFacet = function (name) {
            return this._facets[name];
        };
        Drawable.prototype.setFacet = function (name, facet) {
            this._facets[name] = facet;
        };
        Object.defineProperty(Drawable.prototype, "geometry", {
            get: function () {
                if (this._geometry) {
                    this._geometry.addRef();
                    return this._geometry;
                }
                else {
                    return void 0;
                }
            },
            set: function (geometry) {
                this._geometry = exchange_1.default(this._geometry, geometry);
                if (this._geometry && this.contextProvider) {
                    this._geometry.contextGain(this.contextProvider);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Drawable.prototype, "material", {
            get: function () {
                if (this._material) {
                    this._material.addRef();
                    return this._material;
                }
                else {
                    return void 0;
                }
            },
            set: function (material) {
                this._material = exchange_1.default(this._material, material);
                if (this._material && this.contextProvider) {
                    this._material.contextGain(this.contextProvider);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Drawable.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (visible) {
                var _this = this;
                mustBeBoolean_1.default('visible', visible, function () { return _this._type; });
                this._visible = visible;
            },
            enumerable: true,
            configurable: true
        });
        return Drawable;
    })(ShareableContextConsumer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Drawable;
});

define('davinci-eight/core/computeCount',["require", "exports", '../checks/mustBeInteger'], function (require, exports, mustBeInteger_1) {
    function default_1(attribs, aNames) {
        var aNamesLen = aNames.length;
        for (var a = 0; a < aNamesLen; a++) {
            var aName = aNames[a];
            var attrib = attribs[aName];
            var vLength = attrib.values.length;
            var size = mustBeInteger_1.default('size', attrib.size);
            return vLength / size;
        }
        return 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/computeAttributes',["require", "exports", './computeCount'], function (require, exports, computeCount_1) {
    function default_1(attributes, aNames) {
        var aNamesLen = aNames.length;
        var values = [];
        var iLen = computeCount_1.default(attributes, aNames);
        for (var i = 0; i < iLen; i++) {
            for (var a = 0; a < aNamesLen; a++) {
                var aName = aNames[a];
                var attrib = attributes[aName];
                var size = attrib.size;
                for (var s = 0; s < size; s++) {
                    values.push(attrib.values[i * size + s]);
                }
            }
        }
        return values;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/computePointers',["require", "exports"], function (require, exports) {
    function default_1(attributes, aNames) {
        var aNamesLen = aNames.length;
        var pointers = [];
        var offset = 0;
        for (var a = 0; a < aNamesLen; a++) {
            var aName = aNames[a];
            var attrib = attributes[aName];
            pointers.push({ name: aName, size: attrib.size, normalized: true, offset: offset });
            offset += attrib.size * 4;
        }
        return pointers;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/computeStride',["require", "exports"], function (require, exports) {
    function default_1(attributes, aNames) {
        var aNamesLen = aNames.length;
        var stride = 0;
        for (var a = 0; a < aNamesLen; a++) {
            var aName = aNames[a];
            var attrib = attributes[aName];
            stride += attrib.size * 4;
        }
        return stride;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/GeometryLeaf',["require", "exports", '../config', './ErrorMode', '../base/incLevel', '../checks/isNumber', '../i18n/notImplemented', '../i18n/notSupported', '../i18n/readOnly', './ShareableContextConsumer'], function (require, exports, config_1, ErrorMode_1, incLevel_1, isNumber_1, notImplemented_1, notSupported_1, readOnly_1, ShareableContextConsumer_1) {
    var GeometryLeaf = (function (_super) {
        __extends(GeometryLeaf, _super);
        function GeometryLeaf(engine) {
            _super.call(this, engine);
            this.setLoggingName('GeometryLeaf');
        }
        GeometryLeaf.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(GeometryLeaf.prototype, "drawMode", {
            get: function () {
                return this._drawMode;
            },
            set: function (drawMode) {
                this._drawMode = drawMode;
                if (this.contextProvider) {
                    this.drawMode = this.contextProvider.drawModeToGL(drawMode);
                }
            },
            enumerable: true,
            configurable: true
        });
        GeometryLeaf.prototype.isLeaf = function () {
            return true;
        };
        Object.defineProperty(GeometryLeaf.prototype, "partsLength", {
            get: function () {
                return 0;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('partsLength').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryLeaf.prototype, "scaling", {
            get: function () {
                throw new Error(notImplemented_1.default('get scaling').message);
            },
            set: function (scaling) {
                throw new Error(notImplemented_1.default('set scaling').message);
            },
            enumerable: true,
            configurable: true
        });
        GeometryLeaf.prototype.addPart = function (geometry) {
            throw new Error(notSupported_1.default('addPart').message);
        };
        GeometryLeaf.prototype.contextGain = function (contextProvider) {
            if (isNumber_1.default(this._drawMode)) {
                this.mode = contextProvider.drawModeToGL(this._drawMode);
            }
            else {
                switch (config_1.default.errorMode) {
                    case ErrorMode_1.default.WARNME: {
                        console.warn(this._type + ".drawMode must be a number.");
                    }
                    default: {
                    }
                }
            }
            if (!isNumber_1.default(this._stride)) {
                switch (config_1.default.errorMode) {
                    case ErrorMode_1.default.WARNME: {
                        console.warn(this._type + ".stride must be a number.");
                    }
                    default: {
                    }
                }
            }
            _super.prototype.contextGain.call(this, contextProvider);
        };
        GeometryLeaf.prototype.removePart = function (index) {
            throw new Error(notSupported_1.default('removePart').message);
        };
        GeometryLeaf.prototype.getPart = function (index) {
            throw new Error(notSupported_1.default('getPart').message);
        };
        GeometryLeaf.prototype.draw = function (material) {
            throw new Error(notSupported_1.default('draw').message);
        };
        GeometryLeaf.prototype.hasPrincipalScale = function (name) {
            throw new Error(notImplemented_1.default("hasPrincipalScale(" + name + ")").message);
        };
        GeometryLeaf.prototype.getPrincipalScale = function (name) {
            throw new Error(notImplemented_1.default('getPrincipalScale').message);
        };
        GeometryLeaf.prototype.setPrincipalScale = function (name, value) {
            throw new Error(notImplemented_1.default('setPrincipalScale').message);
        };
        return GeometryLeaf;
    })(ShareableContextConsumer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryLeaf;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/VertexBuffer',["require", "exports", '../checks/mustBeObject', '../checks/mustBeUndefined', './ShareableContextConsumer'], function (require, exports, mustBeObject_1, mustBeUndefined_1, ShareableContextConsumer_1) {
    function bufferVertexData(contextProvider, buffer, data) {
        if (contextProvider) {
            var gl = contextProvider.gl;
            if (gl) {
                if (buffer) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    if (data) {
                        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
                    }
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                }
            }
        }
    }
    var VertexBuffer = (function (_super) {
        __extends(VertexBuffer, _super);
        function VertexBuffer(engine) {
            _super.call(this, engine);
            this.setLoggingName('VertexBuffer');
            this.synchUp();
        }
        VertexBuffer.prototype.destructor = function (levelUp) {
            this.cleanUp();
            mustBeUndefined_1.default(this._type, this.webGLBuffer);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(VertexBuffer.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (data) {
                this._data = data;
                bufferVertexData(this.contextProvider, this.webGLBuffer, this._data);
            },
            enumerable: true,
            configurable: true
        });
        VertexBuffer.prototype.contextFree = function (contextProvider) {
            mustBeObject_1.default('contextProvider', contextProvider);
            if (this.webGLBuffer) {
                var gl = contextProvider.gl;
                if (gl) {
                    gl.deleteBuffer(this.webGLBuffer);
                }
                else {
                    console.error((this._type + " must leak WebGLBuffer because WebGLRenderingContext is ") + typeof gl);
                }
                this.webGLBuffer = void 0;
            }
            else {
            }
            _super.prototype.contextFree.call(this, contextProvider);
        };
        VertexBuffer.prototype.contextGain = function (contextProvider) {
            mustBeObject_1.default('contextProvider', contextProvider);
            var gl = contextProvider.gl;
            if (!this.webGLBuffer) {
                this.webGLBuffer = gl.createBuffer();
                bufferVertexData(contextProvider, this.webGLBuffer, this._data);
            }
            else {
            }
            _super.prototype.contextGain.call(this, contextProvider);
        };
        VertexBuffer.prototype.contextLost = function () {
            this.webGLBuffer = void 0;
            _super.prototype.contextLost.call(this);
        };
        VertexBuffer.prototype.bind = function () {
            var gl = this.gl;
            if (gl) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.webGLBuffer);
            }
            else {
                console.warn(this._type + ".bind() ignored because no context.");
            }
        };
        VertexBuffer.prototype.unbind = function () {
            var gl = this.gl;
            if (gl) {
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
            }
            else {
                console.warn(this._type + ".unbind() ignored because no context.");
            }
        };
        return VertexBuffer;
    })(ShareableContextConsumer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VertexBuffer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/GeometryArrays',["require", "exports", './computeAttributes', './computeCount', './computePointers', './computeStride', '../config', './ErrorMode', './GeometryLeaf', '../base/incLevel', './VertexBuffer'], function (require, exports, computeAttributes_1, computeCount_1, computePointers_1, computeStride_1, config_1, ErrorMode_1, GeometryLeaf_1, incLevel_1, VertexBuffer_1) {
    var GeometryArrays = (function (_super) {
        __extends(GeometryArrays, _super);
        function GeometryArrays(engine) {
            _super.call(this, engine);
            this.first = 0;
            this.setLoggingName('GeometryArrays');
            this.attributes = {};
            this.vbo = new VertexBuffer_1.default(engine);
        }
        GeometryArrays.prototype.destructor = function (level) {
            this.vbo.release();
            this.vbo = void 0;
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        GeometryArrays.prototype.contextFree = function (contextProvider) {
            this.vbo.contextFree(contextProvider);
            _super.prototype.contextFree.call(this, contextProvider);
        };
        GeometryArrays.prototype.contextGain = function (contextProvider) {
            this.vbo.contextGain(contextProvider);
            _super.prototype.contextGain.call(this, contextProvider);
        };
        GeometryArrays.prototype.contextLost = function () {
            this.vbo.contextLost();
            _super.prototype.contextLost.call(this);
        };
        GeometryArrays.prototype.draw = function (material) {
            var contextProvider = this.contextProvider;
            if (contextProvider) {
                this.vbo.bind();
                var pointers = this._pointers;
                if (pointers) {
                    var iLength = pointers.length;
                    for (var i = 0; i < iLength; i++) {
                        var pointer = pointers[i];
                        var attribLoc = material.getAttribLocation(pointer.name);
                        if (attribLoc >= 0) {
                            contextProvider.vertexAttribPointer(attribLoc, pointer.size, pointer.normalized, this._stride, pointer.offset);
                            contextProvider.enableVertexAttribArray(attribLoc);
                        }
                    }
                }
                else {
                    switch (config_1.default.errorMode) {
                        case ErrorMode_1.default.WARNME: {
                            console.warn(this._type + ".pointers must be an array.");
                        }
                        default: {
                        }
                    }
                }
                this.contextProvider.drawArrays(this.mode, this.first, this.count);
                this.vbo.unbind();
            }
        };
        GeometryArrays.prototype.getAttribute = function (name) {
            return this.attributes[name];
        };
        GeometryArrays.prototype.setAttribute = function (name, attribute) {
            this.attributes[name] = attribute;
            var aNames = Object.keys(this.attributes);
            this.count = computeCount_1.default(this.attributes, aNames);
            this._stride = computeStride_1.default(this.attributes, aNames);
            this._pointers = computePointers_1.default(this.attributes, aNames);
            var array = computeAttributes_1.default(this.attributes, aNames);
            this.vbo.data = new Float32Array(array);
        };
        return GeometryArrays;
    })(GeometryLeaf_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryArrays;
});

define('davinci-eight/math/add4x4',["require", "exports"], function (require, exports) {
    function add4x4(a, b, c) {
        var a11 = a[0x0], a12 = a[0x4], a13 = a[0x8], a14 = a[0xC];
        var a21 = a[0x1], a22 = a[0x5], a23 = a[0x9], a24 = a[0xD];
        var a31 = a[0x2], a32 = a[0x6], a33 = a[0xA], a34 = a[0xE];
        var a41 = a[0x3], a42 = a[0x7], a43 = a[0xB], a44 = a[0xF];
        var b11 = b[0x0], b12 = b[0x4], b13 = b[0x8], b14 = b[0xC];
        var b21 = b[0x1], b22 = b[0x5], b23 = b[0x9], b24 = b[0xD];
        var b31 = b[0x2], b32 = b[0x6], b33 = b[0xA], b34 = b[0xE];
        var b41 = b[0x3], b42 = b[0x7], b43 = b[0xB], b44 = b[0xF];
        c[0x0] = a11 + b11;
        c[0x4] = a12 + b12;
        c[0x8] = a13 + b13;
        c[0xC] = a14 + b14;
        c[0x1] = a21 + b21;
        c[0x5] = a22 + b22;
        c[0x9] = a23 + b23;
        c[0xD] = a24 + b24;
        c[0x2] = a31 + b31;
        c[0x6] = a32 + b32;
        c[0xA] = a33 + b33;
        c[0xE] = a34 + b34;
        c[0x3] = a41 + b41;
        c[0x7] = a42 + b42;
        c[0xB] = a43 + b43;
        c[0xF] = a44 + b44;
        return c;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = add4x4;
});

define('davinci-eight/math/det4x4',["require", "exports"], function (require, exports) {
    function default_1(m) {
        var n11 = m[0x0], n12 = m[0x4], n13 = m[0x8], n14 = m[0xC];
        var n21 = m[0x1], n22 = m[0x5], n23 = m[0x9], n24 = m[0xD];
        var n31 = m[0x2], n32 = m[0x6], n33 = m[0xA], n34 = m[0xE];
        var n41 = m[0x3], n42 = m[0x7], n43 = m[0xB], n44 = m[0xF];
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
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/inv4x4',["require", "exports"], function (require, exports) {
    function inv4x4(src, dest) {
        var n11 = src[0x0], n12 = src[0x4], n13 = src[0x8], n14 = src[0xC];
        var n21 = src[0x1], n22 = src[0x5], n23 = src[0x9], n24 = src[0xD];
        var n31 = src[0x2], n32 = src[0x6], n33 = src[0xA], n34 = src[0xE];
        var n41 = src[0x3], n42 = src[0x7], n43 = src[0xB], n44 = src[0xF];
        var o11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
        var o12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
        var o13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
        var o14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
        var o21 = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
        var o22 = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
        var o23 = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
        var o24 = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
        var o31 = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
        var o32 = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
        var o33 = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
        var o34 = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
        var o41 = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
        var o42 = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
        var o43 = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
        var o44 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
        var det = n11 * o11 + n21 * o12 + n31 * o13 + n41 * o14;
        var α = 1 / det;
        dest[0x0] = o11 * α;
        dest[0x4] = o12 * α;
        dest[0x8] = o13 * α;
        dest[0xC] = o14 * α;
        dest[0x1] = o21 * α;
        dest[0x5] = o22 * α;
        dest[0x9] = o23 * α;
        dest[0xD] = o24 * α;
        dest[0x2] = o31 * α;
        dest[0x6] = o32 * α;
        dest[0xA] = o33 * α;
        dest[0xE] = o34 * α;
        dest[0x3] = o41 * α;
        dest[0x7] = o42 * α;
        dest[0xB] = o43 * α;
        dest[0xF] = o44 * α;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = inv4x4;
});

define('davinci-eight/math/mul4x4',["require", "exports"], function (require, exports) {
    function mul4x4(a, b, c) {
        var a11 = a[0x0], a12 = a[0x4], a13 = a[0x8], a14 = a[0xC];
        var a21 = a[0x1], a22 = a[0x5], a23 = a[0x9], a24 = a[0xD];
        var a31 = a[0x2], a32 = a[0x6], a33 = a[0xA], a34 = a[0xE];
        var a41 = a[0x3], a42 = a[0x7], a43 = a[0xB], a44 = a[0xF];
        var b11 = b[0x0], b12 = b[0x4], b13 = b[0x8], b14 = b[0xC];
        var b21 = b[0x1], b22 = b[0x5], b23 = b[0x9], b24 = b[0xD];
        var b31 = b[0x2], b32 = b[0x6], b33 = b[0xA], b34 = b[0xE];
        var b41 = b[0x3], b42 = b[0x7], b43 = b[0xB], b44 = b[0xF];
        c[0x0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        c[0x4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        c[0x8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        c[0xC] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        c[0x1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        c[0x5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        c[0x9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        c[0xD] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        c[0x2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        c[0x6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        c[0xA] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        c[0xE] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        c[0x3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        c[0x7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        c[0xB] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        c[0xF] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return c;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mul4x4;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Matrix4',["require", "exports", '../math/AbstractMatrix', '../math/add4x4', './det4x4', '../math/inv4x4', '../math/mul4x4'], function (require, exports, AbstractMatrix_1, add4x4_1, det4x4_1, inv4x4_1, mul4x4_1) {
    var Matrix4 = (function (_super) {
        __extends(Matrix4, _super);
        function Matrix4(elements) {
            _super.call(this, elements, 4);
        }
        Matrix4.one = function () {
            return new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
        };
        Matrix4.zero = function () {
            return new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        Matrix4.scaling = function (scale) {
            return Matrix4.one().scaling(scale);
        };
        Matrix4.translation = function (vector) {
            return Matrix4.one().translation(vector);
        };
        Matrix4.rotation = function (spinor) {
            return Matrix4.one().rotation(spinor);
        };
        Matrix4.prototype.add = function (rhs) {
            return this.add2(this, rhs);
        };
        Matrix4.prototype.add2 = function (a, b) {
            add4x4_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Matrix4.prototype.clone = function () {
            return Matrix4.zero().copy(this);
        };
        Matrix4.prototype.compose = function (scale, attitude, position) {
            this.scaling(scale);
            this.rotate(attitude);
            this.translate(position);
            return this;
        };
        Matrix4.prototype.copy = function (m) {
            this.elements.set(m.elements);
            return this;
        };
        Matrix4.prototype.det = function () {
            return det4x4_1.default(this.elements);
        };
        Matrix4.prototype.inv = function () {
            inv4x4_1.default(this.elements, this.elements);
            return this;
        };
        Matrix4.prototype.one = function () {
            return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.scale = function (s) {
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
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x, y = axis.y, z = axis.z;
            var tx = t * x, ty = t * y;
            return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        Matrix4.prototype.mul2 = function (a, b) {
            mul4x4_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Matrix4.prototype.rmul = function (lhs) {
            return this.mul2(lhs, this);
        };
        Matrix4.prototype.reflection = function (n) {
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var aa = -2 * nx * ny;
            var cc = -2 * ny * nz;
            var bb = -2 * nz * nx;
            var xx = 1 - 2 * nx * nx;
            var yy = 1 - 2 * ny * ny;
            var zz = 1 - 2 * nz * nz;
            this.set(xx, aa, bb, 0, aa, yy, cc, 0, bb, cc, zz, 0, 0, 0, 0, 1);
            return this;
        };
        Matrix4.prototype.rotate = function (spinor) {
            return this.rmul(Matrix4.rotation(spinor));
        };
        Matrix4.prototype.rotation = function (spinor) {
            var x = -spinor.yz;
            var y = -spinor.zx;
            var z = -spinor.xy;
            var α = spinor.α;
            var x2 = x + x;
            var y2 = y + y;
            var z2 = z + z;
            var xx = x * x2;
            var xy = x * y2;
            var xz = x * z2;
            var yy = y * y2;
            var yz = y * z2;
            var zz = z * z2;
            var wx = α * x2;
            var wy = α * y2;
            var wz = α * z2;
            this.set(1 - yy - zz, xy - wz, xz + wy, 0, xy + wz, 1 - xx - zz, yz - wx, 0, xz - wy, yz + wx, 1 - xx - yy, 0, 0, 0, 0, 1);
            return this;
        };
        Matrix4.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
        };
        Matrix4.prototype.scaleXYZ = function (scale) {
            return this.rmul(Matrix4.scaling(scale));
        };
        Matrix4.prototype.scaling = function (scale) {
            return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            var te = this.elements;
            te[0x0] = n11;
            te[0x4] = n12;
            te[0x8] = n13;
            te[0xC] = n14;
            te[0x1] = n21;
            te[0x5] = n22;
            te[0x9] = n23;
            te[0xD] = n24;
            te[0x2] = n31;
            te[0x6] = n32;
            te[0xA] = n33;
            te[0xE] = n34;
            te[0x3] = n41;
            te[0x7] = n42;
            te[0xB] = n43;
            te[0xF] = n44;
            return this;
        };
        Matrix4.prototype.toExponential = function (fractionDigits) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix4.prototype.toFixed = function (fractionDigits) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix4.prototype.toPrecision = function (fractionDigits) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toPrecision(fractionDigits); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix4.prototype.toString = function (radix) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix4.prototype.translate = function (d) {
            return this.rmul(Matrix4.translation(d));
        };
        Matrix4.prototype.translation = function (d) {
            var x = d.x;
            var y = d.y;
            var z = d.z;
            return this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        };
        Matrix4.prototype.zero = function () {
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Matrix4.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Matrix4) {
                return Matrix4.one().mul2(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix4.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Matrix4) {
                return Matrix4.one().mul2(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else {
                return void 0;
            }
        };
        return Matrix4;
    })(AbstractMatrix_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Matrix4;
});

define('davinci-eight/i18n/shouldBeImplementedBy',["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString_1) {
    function default_1(name, type) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "Method '" + name + "' should be implemented by " + type + ".";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/GeometryContainer',["require", "exports", '../collections/ShareableArray', '../base/incLevel', '../math/Matrix4', '../i18n/notSupported', '../i18n/readOnly', '../core/ShareableBase', '../i18n/shouldBeImplementedBy', '../math/Spinor3'], function (require, exports, ShareableArray_1, incLevel_1, Matrix4_1, notSupported_1, readOnly_1, ShareableBase_1, shouldBeImplementedBy_1, Spinor3_1) {
    var GeometryContainer = (function (_super) {
        __extends(GeometryContainer, _super);
        function GeometryContainer(tilt) {
            _super.call(this);
            this.scaling = Matrix4_1.default.one();
            this.canonicalScale = Matrix4_1.default.one();
            this.K = Matrix4_1.default.one();
            this.Kinv = Matrix4_1.default.one();
            this.Kidentity = true;
            this.setLoggingName('GeometryContainer');
            this._parts = new ShareableArray_1.default([]);
            if (tilt && !Spinor3_1.default.isOne(tilt)) {
                this.Kidentity = false;
                this.K.rotation(tilt);
                this.Kinv.copy(this.K).inv();
            }
        }
        GeometryContainer.prototype.destructor = function (level) {
            this._parts.release();
            this._parts = void 0;
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(GeometryContainer.prototype, "data", {
            get: function () {
                throw new Error(notSupported_1.default('data').message);
            },
            set: function (data) {
                throw new Error(notSupported_1.default('data').message);
            },
            enumerable: true,
            configurable: true
        });
        GeometryContainer.prototype.isLeaf = function () {
            return false;
        };
        Object.defineProperty(GeometryContainer.prototype, "partsLength", {
            get: function () {
                return this._parts.length;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('partsLength').message);
            },
            enumerable: true,
            configurable: true
        });
        GeometryContainer.prototype.addPart = function (geometry) {
            this._parts.push(geometry);
        };
        GeometryContainer.prototype.removePart = function (index) {
            var removals = this._parts.splice(index, 1);
            removals.release();
        };
        GeometryContainer.prototype.getPart = function (index) {
            return this._parts.get(index);
        };
        GeometryContainer.prototype.draw = function (material) {
            this._parts.forEach(function (buffer) {
                buffer.draw(material);
            });
        };
        GeometryContainer.prototype.contextFree = function (contextProvider) {
            this._parts.forEach(function (buffer) {
                buffer.contextFree(contextProvider);
            });
        };
        GeometryContainer.prototype.contextGain = function (contextProvider) {
            this._parts.forEach(function (buffer) {
                buffer.contextGain(contextProvider);
            });
        };
        GeometryContainer.prototype.contextLost = function () {
            this._parts.forEach(function (buffer) {
                buffer.contextLost();
            });
        };
        GeometryContainer.prototype.hasPrincipalScale = function (name) {
            throw new Error(shouldBeImplementedBy_1.default('hasPrincipalScale', this._type).message);
        };
        GeometryContainer.prototype.getPrincipalScale = function (name) {
            throw new Error(shouldBeImplementedBy_1.default('getPrincipalScale', this._type).message);
        };
        GeometryContainer.prototype.setPrincipalScale = function (name, value) {
            throw new Error(shouldBeImplementedBy_1.default('setPrincipalScale', this._type).message);
        };
        GeometryContainer.prototype.setScale = function (x, y, z) {
            if (this.Kidentity) {
                this.scaling.setElement(0, 0, x);
                this.scaling.setElement(1, 1, y);
                this.scaling.setElement(2, 2, z);
            }
            else {
                this.canonicalScale.copy(this.Kinv).mul(this.scaling).mul(this.K);
                this.canonicalScale.setElement(0, 0, x);
                this.canonicalScale.setElement(1, 1, y);
                this.canonicalScale.setElement(2, 2, z);
                this.scaling.copy(this.K).mul(this.canonicalScale).mul(this.Kinv);
            }
        };
        return GeometryContainer;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryContainer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/IndexBuffer',["require", "exports", '../base/incLevel', '../checks/mustBeObject', '../checks/mustBeUndefined', './ShareableContextConsumer'], function (require, exports, incLevel_1, mustBeObject_1, mustBeUndefined_1, ShareableContextConsumer_1) {
    function bufferIndexData(contextProvider, buffer, data) {
        if (contextProvider) {
            var gl = contextProvider.gl;
            if (gl) {
                if (buffer) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                    if (data) {
                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
                    }
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                }
            }
        }
    }
    var IndexBuffer = (function (_super) {
        __extends(IndexBuffer, _super);
        function IndexBuffer(engine) {
            _super.call(this, engine);
            this.setLoggingName('IndexBuffer');
            this.synchUp();
        }
        IndexBuffer.prototype.destructor = function (level) {
            this.cleanUp();
            mustBeUndefined_1.default(this._type, this.webGLBuffer);
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(IndexBuffer.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (data) {
                this._data = data;
                bufferIndexData(this.contextProvider, this.webGLBuffer, this._data);
            },
            enumerable: true,
            configurable: true
        });
        IndexBuffer.prototype.contextFree = function (contextProvider) {
            mustBeObject_1.default('contextProvider', contextProvider);
            if (this.webGLBuffer) {
                var gl = contextProvider.gl;
                if (gl) {
                    gl.deleteBuffer(this.webGLBuffer);
                }
                else {
                    console.error((this._type + " must leak WebGLBuffer because WebGLRenderingContext is ") + typeof gl);
                }
                this.webGLBuffer = void 0;
            }
            else {
            }
            _super.prototype.contextFree.call(this, contextProvider);
        };
        IndexBuffer.prototype.contextGain = function (contextProvider) {
            mustBeObject_1.default('contextProvider', contextProvider);
            var gl = contextProvider.gl;
            if (!this.webGLBuffer) {
                this.webGLBuffer = gl.createBuffer();
                bufferIndexData(contextProvider, this.webGLBuffer, this._data);
            }
            else {
            }
            _super.prototype.contextGain.call(this, contextProvider);
        };
        IndexBuffer.prototype.contextLost = function () {
            this.webGLBuffer = void 0;
            _super.prototype.contextLost.call(this);
        };
        IndexBuffer.prototype.bind = function () {
            var gl = this.gl;
            if (gl) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webGLBuffer);
            }
            else {
                console.warn(this._type + ".bind() ignored because no context.");
            }
        };
        IndexBuffer.prototype.unbind = function () {
            var gl = this.gl;
            if (gl) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            }
            else {
                console.warn(this._type + ".unbind() ignored because no context.");
            }
        };
        return IndexBuffer;
    })(ShareableContextConsumer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = IndexBuffer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/GeometryElements',["require", "exports", '../config', './ErrorMode', './GeometryLeaf', '../base/incLevel', './IndexBuffer', '../checks/isArray', '../checks/isNull', '../checks/isObject', '../checks/isUndefined', '../checks/mustBeArray', '../checks/mustBeObject', '../i18n/readOnly', './VertexBuffer'], function (require, exports, config_1, ErrorMode_1, GeometryLeaf_1, incLevel_1, IndexBuffer_1, isArray_1, isNull_1, isObject_1, isUndefined_1, mustBeArray_1, mustBeObject_1, readOnly_1, VertexBuffer_1) {
    var GeometryElements = (function (_super) {
        __extends(GeometryElements, _super);
        function GeometryElements(data, engine) {
            _super.call(this, engine);
            this.offset = 0;
            this.setLoggingName('GeometryElements');
            this.ibo = new IndexBuffer_1.default(engine);
            this.vbo = new VertexBuffer_1.default(engine);
            if (!isNull_1.default(data) && !isUndefined_1.default(data)) {
                if (isObject_1.default(data)) {
                    this.drawMode = data.drawMode;
                    this.setIndices(data.indices);
                    this._attributes = data.attributes;
                    this._stride = data.stride;
                    if (!isNull_1.default(data.pointers) && !isUndefined_1.default(data.pointers)) {
                        if (isArray_1.default(data.pointers)) {
                            this._pointers = data.pointers;
                        }
                        else {
                            mustBeArray_1.default('data.pointers', data.pointers);
                        }
                    }
                    else {
                        this._pointers = [];
                    }
                    this.vbo.data = new Float32Array(data.attributes);
                }
                else {
                    mustBeObject_1.default('data', data);
                }
            }
            else {
                this._pointers = [];
            }
        }
        GeometryElements.prototype.destructor = function (level) {
            this.ibo.release();
            this.ibo = void 0;
            this.vbo.release();
            this.vbo = void 0;
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(GeometryElements.prototype, "attributes", {
            get: function () {
                return this._attributes;
            },
            set: function (attributes) {
                if (isArray_1.default(attributes)) {
                    this._attributes = attributes;
                    this.vbo.data = new Float32Array(attributes);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryElements.prototype, "data", {
            get: function () {
                return {
                    drawMode: this.drawMode,
                    indices: this._indices,
                    attributes: this._attributes,
                    stride: this._stride,
                    pointers: this._pointers
                };
            },
            set: function (data) {
                throw new Error(readOnly_1.default('data').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryElements.prototype, "indices", {
            get: function () {
                return this._indices;
            },
            set: function (indices) {
                this.setIndices(indices);
            },
            enumerable: true,
            configurable: true
        });
        GeometryElements.prototype.setIndices = function (indices) {
            if (!isNull_1.default(indices) && !isUndefined_1.default(indices)) {
                if (isArray_1.default(indices)) {
                    this._indices = indices;
                    this.count = indices.length;
                    this.ibo.data = new Uint16Array(indices);
                }
                else {
                    mustBeArray_1.default('indices', indices);
                }
            }
            else {
            }
        };
        Object.defineProperty(GeometryElements.prototype, "pointers", {
            get: function () {
                return this._pointers;
            },
            set: function (pointers) {
                this._pointers = pointers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryElements.prototype, "stride", {
            get: function () {
                return this._stride;
            },
            set: function (stride) {
                this._stride = stride;
            },
            enumerable: true,
            configurable: true
        });
        GeometryElements.prototype.contextFree = function (contextProvider) {
            this.ibo.contextFree(contextProvider);
            this.vbo.contextFree(contextProvider);
            _super.prototype.contextFree.call(this, contextProvider);
        };
        GeometryElements.prototype.contextGain = function (contextProvider) {
            this.ibo.contextGain(contextProvider);
            this.vbo.contextGain(contextProvider);
            _super.prototype.contextGain.call(this, contextProvider);
        };
        GeometryElements.prototype.contextLost = function () {
            this.ibo.contextLost();
            this.vbo.contextLost();
            _super.prototype.contextLost.call(this);
        };
        GeometryElements.prototype.draw = function (material) {
            var contextProvider = this.contextProvider;
            if (contextProvider) {
                this.vbo.bind();
                var pointers = this._pointers;
                if (pointers) {
                    var iLength = pointers.length;
                    for (var i = 0; i < iLength; i++) {
                        var pointer = pointers[i];
                        var attribLoc = material.getAttribLocation(pointer.name);
                        if (attribLoc >= 0) {
                            contextProvider.vertexAttribPointer(attribLoc, pointer.size, pointer.normalized, this._stride, pointer.offset);
                            contextProvider.enableVertexAttribArray(attribLoc);
                        }
                    }
                }
                else {
                    switch (config_1.default.errorMode) {
                        case ErrorMode_1.default.WARNME: {
                            console.warn(this._type + ".pointers must be an array.");
                        }
                        default: {
                        }
                    }
                }
                this.ibo.bind();
                if (this.count) {
                    contextProvider.drawElements(this.mode, this.count, this.offset);
                }
                else {
                    switch (config_1.default.errorMode) {
                        case ErrorMode_1.default.WARNME: {
                            console.warn(this._type + ".indices must be an array.");
                        }
                        default: {
                        }
                    }
                }
                this.ibo.unbind();
                this.vbo.unbind();
            }
        };
        return GeometryElements;
    })(GeometryLeaf_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryElements;
});

define('davinci-eight/core/GraphicsProgramSymbols',["require", "exports"], function (require, exports) {
    var GraphicsProgramSymbols = (function () {
        function GraphicsProgramSymbols() {
        }
        GraphicsProgramSymbols.ATTRIBUTE_COLOR = 'aColor';
        GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
        GraphicsProgramSymbols.ATTRIBUTE_NORMAL = 'aNormal';
        GraphicsProgramSymbols.ATTRIBUTE_POSITION = 'aPosition';
        GraphicsProgramSymbols.ATTRIBUTE_TANGENT = 'aTangent';
        GraphicsProgramSymbols.ATTRIBUTE_COORDS = 'aCoords';
        GraphicsProgramSymbols.UNIFORM_ALPHA = 'uAlpha';
        GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        GraphicsProgramSymbols.UNIFORM_COLOR = 'uColor';
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        GraphicsProgramSymbols.UNIFORM_POINT_SIZE = 'uPointSize';
        GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX = 'uProjection';
        GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';
        GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';
        GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX = 'uModel';
        GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX = 'uNormal';
        GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX = 'uView';
        GraphicsProgramSymbols.VARYING_COLOR = 'vColor';
        GraphicsProgramSymbols.VARYING_LIGHT = 'vLight';
        return GraphicsProgramSymbols;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphicsProgramSymbols;
});

define('davinci-eight/facets/ColorFacet',["require", "exports", '../core/Color', '../checks/mustBeNumber', '../core/GraphicsProgramSymbols'], function (require, exports, Color_1, mustBeNumber_1, GraphicsProgramSymbols_1) {
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    function checkPropertyName(name) {
        if (typeof name !== 'string') {
            var msg = "ColorFacet property 'name' must be a string.";
            throw new TypeError(msg);
        }
        switch (name) {
            case ColorFacet.PROP_RGB: return;
            default: {
                var msg = "ColorFacet property 'name' must be one of " + [ColorFacet.PROP_RGB, ColorFacet.PROP_RED, ColorFacet.PROP_GREEN, ColorFacet.PROP_BLUE] + ".";
                throw new Error(msg);
            }
        }
    }
    var ColorFacet = (function () {
        function ColorFacet() {
            this.color = Color_1.default.fromRGB(1, 1, 1);
            this.uColorName = GraphicsProgramSymbols_1.default.UNIFORM_COLOR;
        }
        Object.defineProperty(ColorFacet.prototype, "r", {
            get: function () {
                return this.color.r;
            },
            set: function (red) {
                mustBeNumber_1.default('red', red);
                this.color.r = red;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "g", {
            get: function () {
                return this.color.g;
            },
            set: function (green) {
                mustBeNumber_1.default('green', green);
                this.color.g = green;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "b", {
            get: function () {
                return this.color.b;
            },
            set: function (blue) {
                mustBeNumber_1.default('blue', blue);
                this.color.b = blue;
            },
            enumerable: true,
            configurable: true
        });
        ColorFacet.prototype.scaleRGB = function (α) {
            this.r *= α;
            this.g *= α;
            this.b *= α;
            return this;
        };
        ColorFacet.prototype.setRGB = function (red, green, blue) {
            this.r = red;
            this.g = green;
            this.b = blue;
            return this;
        };
        ColorFacet.prototype.getProperty = function (name) {
            checkPropertyName(name);
            switch (name) {
                case ColorFacet.PROP_RGB: {
                    return [this.r, this.g, this.b];
                }
                case ColorFacet.PROP_RED: {
                    return [this.r];
                }
                case ColorFacet.PROP_GREEN: {
                    return [this.g];
                }
                default: {
                    return void 0;
                }
            }
        };
        ColorFacet.prototype.setProperty = function (name, data) {
            checkPropertyName(name);
            switch (name) {
                case ColorFacet.PROP_RGB:
                    {
                        this.r = data[COORD_R];
                        this.g = data[COORD_G];
                        this.b = data[COORD_B];
                    }
                    break;
                case ColorFacet.PROP_RED:
                    {
                        this.r = data[COORD_R];
                    }
                    break;
                default: {
                }
            }
            return this;
        };
        ColorFacet.prototype.setUniforms = function (visitor) {
            var name = this.uColorName;
            if (name) {
                var color = this.color;
                visitor.uniform3f(name, color.r, color.g, color.b);
            }
        };
        ColorFacet.PROP_RGB = 'rgb';
        ColorFacet.PROP_RED = 'r';
        ColorFacet.PROP_GREEN = 'g';
        ColorFacet.PROP_BLUE = 'b';
        return ColorFacet;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ColorFacet;
});

define('davinci-eight/facets/ModelE3',["require", "exports", '../math/Geometric3', '../math/Vector3', '../math/Spinor3'], function (require, exports, Geometric3_1, Vector3_1, Spinor3_1) {
    'use strict';
    var ModelE3 = (function () {
        function ModelE3() {
            this._position = Geometric3_1.default.zero();
            this._attitude = Geometric3_1.default.one();
            this._posCache = Vector3_1.default.zero();
            this._attCache = Spinor3_1.default.one();
            this._position.modified = true;
            this._attitude.modified = true;
        }
        Object.defineProperty(ModelE3.prototype, "R", {
            get: function () {
                return this._attitude;
            },
            set: function (attitude) {
                this._attitude.copySpinor(attitude);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelE3.prototype, "X", {
            get: function () {
                return this._position;
            },
            set: function (position) {
                this._position.copyVector(position);
            },
            enumerable: true,
            configurable: true
        });
        ModelE3.prototype.getProperty = function (name) {
            switch (name) {
                case ModelE3.PROP_ATTITUDE: {
                    return this._attCache.copy(this._attitude).coords;
                }
                case ModelE3.PROP_POSITION: {
                    return this._posCache.copy(this._position).coords;
                }
                default: {
                    console.warn("ModelE3.getProperty " + name);
                    return void 0;
                }
            }
        };
        ModelE3.prototype.setProperty = function (name, data) {
            switch (name) {
                case ModelE3.PROP_ATTITUDE:
                    {
                        this._attCache.coords = data;
                        this._attitude.copySpinor(this._attCache);
                    }
                    break;
                case ModelE3.PROP_POSITION:
                    {
                        this._posCache.coords = data;
                        this._position.copyVector(this._posCache);
                    }
                    break;
                default: {
                    console.warn("ModelE3.setProperty " + name);
                }
            }
            return this;
        };
        ModelE3.PROP_ATTITUDE = 'R';
        ModelE3.PROP_POSITION = 'X';
        return ModelE3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ModelE3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/ModelFacet',["require", "exports", '../math/Matrix3', '../math/Matrix4', './ModelE3', '../checks/mustBeArray', '../checks/mustBeObject', '../checks/mustBeString', '../i18n/readOnly', '../core/GraphicsProgramSymbols'], function (require, exports, Matrix3_1, Matrix4_1, ModelE3_1, mustBeArray_1, mustBeObject_1, mustBeString_1, readOnly_1, GraphicsProgramSymbols_1) {
    var ModelFacet = (function (_super) {
        __extends(ModelFacet, _super);
        function ModelFacet() {
            _super.call(this);
            this.matS = Matrix4_1.default.one();
            this._matM = Matrix4_1.default.one();
            this._matN = Matrix3_1.default.one();
            this.matR = Matrix4_1.default.one();
            this.matT = Matrix4_1.default.one();
            this.X.modified = true;
            this.R.modified = true;
            this.matS.modified = true;
        }
        Object.defineProperty(ModelFacet.prototype, "stress", {
            get: function () {
                return this.matS;
            },
            set: function (stress) {
                mustBeObject_1.default('stress', stress);
                this.matS.copy(stress);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelFacet.prototype, "matrix", {
            get: function () {
                return this._matM;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('matrix').message);
            },
            enumerable: true,
            configurable: true
        });
        ModelFacet.prototype.setUniforms = function (visitor) {
            this.updateMatrices();
            visitor.mat4(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, this._matM, false);
            visitor.mat3(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, this._matN, false);
        };
        ModelFacet.prototype.updateMatrices = function () {
            var modified = false;
            if (this.X.modified) {
                this.matT.translation(this.X);
                this.X.modified = false;
                modified = true;
            }
            if (this.R.modified) {
                this.matR.rotation(this.R);
                this.R.modified = false;
                modified = true;
            }
            if (this.matS.modified) {
                modified = true;
            }
            if (modified) {
                this._matM.copy(this.matT).mul(this.matR).mul(this.matS);
                if (this._matM.det() !== 0) {
                    this._matN.normalFromMatrix4(this._matM);
                }
                else {
                    this._matN.one();
                }
            }
        };
        ModelFacet.prototype.setProperty = function (name, data) {
            mustBeString_1.default('name', name);
            mustBeArray_1.default('data', data);
            _super.prototype.setProperty.call(this, name, data);
            return this;
        };
        return ModelFacet;
    })(ModelE3_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ModelFacet;
});

define('davinci-eight/facets/PointSizeFacet',["require", "exports", '../checks/mustBeArray', '../checks/mustBeInteger', '../checks/mustBeString', '../core/GraphicsProgramSymbols'], function (require, exports, mustBeArray_1, mustBeInteger_1, mustBeString_1, GraphicsProgramSymbols_1) {
    var LOGGING_NAME = 'PointSizeFacet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var PointSizeFacet = (function () {
        function PointSizeFacet(pointSize) {
            if (pointSize === void 0) { pointSize = 2; }
            this.pointSize = mustBeInteger_1.default('pointSize', pointSize);
        }
        PointSizeFacet.prototype.getProperty = function (name) {
            return void 0;
        };
        PointSizeFacet.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name, contextBuilder);
            mustBeArray_1.default('value', value, contextBuilder);
            return this;
        };
        PointSizeFacet.prototype.setUniforms = function (visitor) {
            visitor.uniform1f(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, this.pointSize);
        };
        return PointSizeFacet;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointSizeFacet;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Mesh',["require", "exports", '../facets/ColorFacet', './Drawable', '../facets/ModelFacet', '../facets/PointSizeFacet', '../i18n/notSupported'], function (require, exports, ColorFacet_1, Drawable_1, ModelFacet_1, PointSizeFacet_1, notSupported_1) {
    var COLOR_FACET_NAME = 'color';
    var MODEL_FACET_NAME = 'model';
    var POINT_FACET_NAME = 'point';
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material, engine) {
            _super.call(this, geometry, material, engine);
            this.setLoggingName('Mesh');
            var modelFacet = new ModelFacet_1.default();
            this.setFacet(MODEL_FACET_NAME, modelFacet);
            var colorFacet = new ColorFacet_1.default();
            this.setFacet(COLOR_FACET_NAME, colorFacet);
            var pointFacet = new PointSizeFacet_1.default();
            this.setFacet(POINT_FACET_NAME, pointFacet);
        }
        Mesh.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Mesh.prototype, "R", {
            get: function () {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    return facet.R;
                }
                else {
                    throw new Error(notSupported_1.default('R').message);
                }
            },
            set: function (R) {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    facet.R.copySpinor(R);
                }
                else {
                    throw new Error(notSupported_1.default('R').message);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "color", {
            get: function () {
                var facet = this.getFacet(COLOR_FACET_NAME);
                if (facet) {
                    return facet.color;
                }
                else {
                    throw new Error(notSupported_1.default('color').message);
                }
            },
            set: function (color) {
                var facet = this.getFacet(COLOR_FACET_NAME);
                if (facet) {
                    facet.color.copy(color);
                }
                else {
                    throw new Error(notSupported_1.default('color').message);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "X", {
            get: function () {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    return facet.X;
                }
                else {
                    throw new Error(notSupported_1.default('X').message);
                }
            },
            set: function (X) {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    facet.X.copyVector(X);
                }
                else {
                    throw new Error(notSupported_1.default('X').message);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "stress", {
            get: function () {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    return facet.stress;
                }
                else {
                    throw new Error(notSupported_1.default('stress').message);
                }
            },
            set: function (stress) {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    facet.stress.copy(stress);
                }
                else {
                    throw new Error(notSupported_1.default('stress').message);
                }
            },
            enumerable: true,
            configurable: true
        });
        Mesh.prototype.getPrincipalScale = function (name) {
            var geometry = this.geometry;
            if (geometry) {
                var value = geometry.getPrincipalScale(name);
                geometry.release();
                return value;
            }
            else {
                throw new Error("getPrincipalScale('" + name + "') is not available because geometry is not defined.");
            }
        };
        Mesh.prototype.setPrincipalScale = function (name, value) {
            var geometry = this.geometry;
            geometry.setPrincipalScale(name, value);
            var scaling = geometry.scaling;
            this.stress.copy(scaling);
            geometry.release();
        };
        return Mesh;
    })(Drawable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Mesh;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Scene',["require", "exports", '../collections/ShareableArray', '../base/incLevel', '../checks/mustBeObject', '../core/ShareableBase', '../core/ShareableContextConsumer'], function (require, exports, ShareableArray_1, incLevel_1, mustBeObject_1, ShareableBase_1, ShareableContextConsumer_1) {
    var ScenePart = (function (_super) {
        __extends(ScenePart, _super);
        function ScenePart(geometry, drawable) {
            _super.call(this);
            this.setLoggingName('ScenePart');
            this._geometry = geometry;
            this._geometry.addRef();
            this._drawable = drawable;
            this._drawable.addRef();
        }
        ScenePart.prototype.destructor = function (level) {
            this._geometry.release();
            this._drawable.release();
            this._geometry = void 0;
            this._drawable = void 0;
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        ScenePart.prototype.draw = function (ambients) {
            if (this._drawable.visible) {
                var material = this._drawable.material;
                material.use();
                if (ambients) {
                    var aLength = ambients.length;
                    for (var a = 0; a < aLength; a++) {
                        var ambient = ambients[a];
                        ambient.setUniforms(material);
                    }
                }
                this._drawable.setUniforms();
                this._geometry.draw(material);
                material.release();
            }
        };
        return ScenePart;
    })(ShareableBase_1.default);
    function partsFromMesh(drawable) {
        mustBeObject_1.default('drawable', drawable);
        var parts = new ShareableArray_1.default([]);
        var geometry = drawable.geometry;
        if (geometry.isLeaf()) {
            var scenePart = new ScenePart(geometry, drawable);
            parts.pushWeakRef(scenePart);
        }
        else {
            var iLen = geometry.partsLength;
            for (var i = 0; i < iLen; i++) {
                var geometryPart = geometry.getPart(i);
                var scenePart = new ScenePart(geometryPart, drawable);
                geometryPart.release();
                parts.pushWeakRef(scenePart);
            }
        }
        geometry.release();
        return parts;
    }
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(engine) {
            _super.call(this, engine);
            this.setLoggingName('Scene');
            mustBeObject_1.default('engine', engine);
            this._drawables = new ShareableArray_1.default([]);
            this._parts = new ShareableArray_1.default([]);
            this.synchUp();
        }
        Scene.prototype.destructor = function (levelUp) {
            this.cleanUp();
            this._drawables.release();
            this._parts.release();
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Scene.prototype.add = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            this._drawables.push(drawable);
            var drawParts = partsFromMesh(drawable);
            var iLen = drawParts.length;
            for (var i = 0; i < iLen; i++) {
                var part = drawParts.get(i);
                this._parts.push(part);
                part.release();
            }
            drawParts.release();
            this.synchUp();
        };
        Scene.prototype.contains = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            return this._drawables.indexOf(drawable) >= 0;
        };
        Scene.prototype.draw = function (ambients) {
            var parts = this._parts;
            var iLen = parts.length;
            for (var i = 0; i < iLen; i++) {
                parts.getWeakRef(i).draw(ambients);
            }
        };
        Scene.prototype.find = function (match) {
            return this._drawables.find(match);
        };
        Scene.prototype.findOne = function (match) {
            return this._drawables.findOne(match);
        };
        Scene.prototype.findOneByName = function (name) {
            return this.findOne(function (drawable) { return drawable.name === name; });
        };
        Scene.prototype.findByName = function (name) {
            return this.find(function (drawable) { return drawable.name === name; });
        };
        Scene.prototype.remove = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            var index = this._drawables.indexOf(drawable);
            if (index >= 0) {
                this._drawables.splice(index, 1).release();
            }
        };
        Scene.prototype.contextFree = function (context) {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextFree(context);
            }
            _super.prototype.contextFree.call(this, context);
        };
        Scene.prototype.contextGain = function (context) {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextGain(context);
            }
            _super.prototype.contextGain.call(this, context);
        };
        Scene.prototype.contextLost = function () {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextLost();
            }
            _super.prototype.contextLost.call(this);
        };
        return Scene;
    })(ShareableContextConsumer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scene;
});

define('davinci-eight/core/UniformLocation',["require", "exports", '../config', '../core/ErrorMode', '../checks/isNull', '../checks/mustBeObject'], function (require, exports, config_1, ErrorMode_1, isNull_1, mustBeObject_1) {
    var UniformLocation = (function () {
        function UniformLocation(info) {
            if (!isNull_1.default(info)) {
                mustBeObject_1.default('info', info);
                this.name = info.name;
            }
            else {
                var msg = "UniformLocation constructor called with null info: WebGLActiveInfo.";
                switch (config_1.default.errorMode) {
                    case ErrorMode_1.default.IGNORE:
                        {
                            this.name = null;
                        }
                        break;
                    case ErrorMode_1.default.WARNME:
                        {
                            console.warn(msg);
                            this.name = null;
                        }
                        break;
                    default: {
                        throw new Error(msg);
                    }
                }
            }
        }
        UniformLocation.prototype.contextFree = function () {
            this.contextLost();
        };
        UniformLocation.prototype.contextGain = function (gl, program) {
            this.contextLost();
            this.gl = gl;
            if (!isNull_1.default(this.name)) {
                this.location = gl.getUniformLocation(program, this.name);
            }
            else {
                this.location = null;
            }
        };
        UniformLocation.prototype.contextLost = function () {
            this.gl = void 0;
            this.location = void 0;
        };
        UniformLocation.prototype.uniform1f = function (x) {
            this.gl.uniform1f(this.location, x);
        };
        UniformLocation.prototype.uniform2f = function (x, y) {
            this.gl.uniform2f(this.location, x, y);
        };
        UniformLocation.prototype.uniform3f = function (x, y, z) {
            this.gl.uniform3f(this.location, x, y, z);
        };
        UniformLocation.prototype.uniform4f = function (x, y, z, w) {
            this.gl.uniform4f(this.location, x, y, z, w);
        };
        UniformLocation.prototype.matrix2fv = function (transpose, value) {
            this.gl.uniformMatrix2fv(this.location, transpose, value);
        };
        UniformLocation.prototype.matrix3fv = function (transpose, value) {
            this.gl.uniformMatrix3fv(this.location, transpose, value);
        };
        UniformLocation.prototype.matrix4fv = function (transpose, value) {
            this.gl.uniformMatrix4fv(this.location, transpose, value);
        };
        UniformLocation.prototype.uniform1fv = function (data) {
            this.gl.uniform1fv(this.location, data);
        };
        UniformLocation.prototype.uniform2fv = function (data) {
            this.gl.uniform2fv(this.location, data);
        };
        UniformLocation.prototype.uniform3fv = function (data) {
            this.gl.uniform3fv(this.location, data);
        };
        UniformLocation.prototype.uniform4fv = function (data) {
            this.gl.uniform4fv(this.location, data);
        };
        UniformLocation.prototype.toString = function () {
            return ['uniform', this.name].join(' ');
        };
        return UniformLocation;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UniformLocation;
});

define('davinci-eight/facets/AmbientLight',["require", "exports", '../core/Color', '../checks/mustBeArray', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../core/GraphicsProgramSymbols'], function (require, exports, Color_1, mustBeArray_1, mustBeNumber_1, mustBeObject_1, mustBeString_1, GraphicsProgramSymbols_1) {
    var LOGGING_NAME = 'AmbientLight';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var AmbientLight = (function () {
        function AmbientLight(color) {
            mustBeObject_1.default('color', color);
            this.color = Color_1.default.white.clone();
            this.color.r = mustBeNumber_1.default('color.r', color.r);
            this.color.g = mustBeNumber_1.default('color.g', color.g);
            this.color.b = mustBeNumber_1.default('color.b', color.b);
        }
        AmbientLight.prototype.getProperty = function (name) {
            return void 0;
        };
        AmbientLight.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name, contextBuilder);
            mustBeArray_1.default('value', value, contextBuilder);
            return this;
        };
        AmbientLight.prototype.setUniforms = function (visitor) {
            var color = this.color;
            visitor.uniform3f(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, color.r, color.g, color.b);
        };
        return AmbientLight;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AmbientLight;
});

define('davinci-eight/facets/DirectionalLight',["require", "exports", '../core/Color', '../math/Geometric3', '../checks/mustBeObject', '../checks/mustBeString', '../core/GraphicsProgramSymbols', '../math/R3'], function (require, exports, Color_1, Geometric3_1, mustBeObject_1, mustBeString_1, GraphicsProgramSymbols_1, R3_1) {
    var LOGGING_NAME = 'DirectionalLight';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var DirectionalLight = (function () {
        function DirectionalLight(direction, color) {
            if (direction === void 0) { direction = R3_1.default.e3.neg(); }
            if (color === void 0) { color = Color_1.default.white; }
            mustBeObject_1.default('direction', direction);
            mustBeObject_1.default('color', color);
            this._direction = Geometric3_1.default.fromVector(direction).normalize();
            this._color = Color_1.default.copy(color);
        }
        Object.defineProperty(DirectionalLight.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (color) {
                this._color.copy(Color_1.default.mustBe('color', color));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectionalLight.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (direction) {
                this._direction.copy(direction);
            },
            enumerable: true,
            configurable: true
        });
        DirectionalLight.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name, contextBuilder);
            switch (name) {
                case DirectionalLight.PROP_COLOR: {
                    return this._color.coords;
                }
                case DirectionalLight.PROP_DIRECTION: {
                    return this._direction.coords;
                }
                default: {
                    console.warn("unknown property: " + name);
                }
            }
        };
        DirectionalLight.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name, contextBuilder);
            mustBeObject_1.default('value', value, contextBuilder);
            switch (name) {
                case DirectionalLight.PROP_COLOR:
                    {
                        this._color.coords = value;
                    }
                    break;
                case DirectionalLight.PROP_DIRECTION:
                    {
                        this._direction.coords = value;
                    }
                    break;
                default: {
                    console.warn("unknown property: " + name);
                }
            }
            return this;
        };
        DirectionalLight.prototype.setColor = function (color) {
            mustBeObject_1.default('color', color);
            this._color.copy(color);
            return this;
        };
        DirectionalLight.prototype.setDirection = function (direction) {
            mustBeObject_1.default('direction', direction);
            this._direction.copyVector(direction).normalize();
            return this;
        };
        DirectionalLight.prototype.setUniforms = function (visitor) {
            var direction = this._direction;
            visitor.uniform3f(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z);
            var color = this.color;
            visitor.uniform3f(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b);
        };
        DirectionalLight.PROP_COLOR = 'color';
        DirectionalLight.PROP_DIRECTION = 'direction';
        return DirectionalLight;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DirectionalLight;
});

define('davinci-eight/math/add2x2',["require", "exports"], function (require, exports) {
    function default_1(a, b, c) {
        var a11 = a[0x0], a12 = a[0x2];
        var a21 = a[0x1], a22 = a[0x3];
        var b11 = b[0x0], b12 = b[0x2];
        var b21 = b[0x1], b22 = b[0x3];
        c[0x0] = a11 + b11;
        c[0x2] = a12 + b12;
        c[0x1] = a21 + b21;
        c[0x3] = a22 + b22;
        return c;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/det2x2',["require", "exports"], function (require, exports) {
    function default_1(m) {
        var n11 = m[0x0];
        var n12 = m[0x2];
        var n21 = m[0x1];
        var n22 = m[0x3];
        return n11 * n22 - n12 * n21;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Matrix2',["require", "exports", '../math/AbstractMatrix', '../math/add2x2', '../math/det2x2', '../checks/isDefined', '../checks/mustBeInteger', '../checks/mustBeNumber'], function (require, exports, AbstractMatrix_1, add2x2_1, det2x2_1, isDefined_1, mustBeInteger_1, mustBeNumber_1) {
    var Matrix2 = (function (_super) {
        __extends(Matrix2, _super);
        function Matrix2(elements) {
            _super.call(this, elements, 2);
        }
        Matrix2.prototype.add = function (rhs) {
            return this.add2(this, rhs);
        };
        Matrix2.prototype.add2 = function (a, b) {
            add2x2_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Matrix2.prototype.clone = function () {
            var te = this.elements;
            var m11 = te[0];
            var m21 = te[1];
            var m12 = te[2];
            var m22 = te[3];
            return Matrix2.zero().set(m11, m12, m21, m22);
        };
        Matrix2.prototype.det = function () {
            return det2x2_1.default(this.elements);
        };
        Matrix2.prototype.inv = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            var det = this.det();
            return this.set(d, -b, -c, a).scale(1 / det);
        };
        Matrix2.prototype.isOne = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            return (a === 1 && b === 0 && c === 0 && d === 1);
        };
        Matrix2.prototype.isZero = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            return (a === 0 && b === 0 && c === 0 && d === 0);
        };
        Matrix2.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        Matrix2.prototype.mul2 = function (a, b) {
            var ae = a.elements;
            var a11 = ae[0];
            var a21 = ae[1];
            var a12 = ae[2];
            var a22 = ae[3];
            var be = b.elements;
            var b11 = be[0];
            var b21 = be[1];
            var b12 = be[2];
            var b22 = be[3];
            var m11 = a11 * b11 + a12 * b21;
            var m12 = a11 * b12 + a12 * b22;
            var m21 = a21 * b11 + a22 * b21;
            var m22 = a21 * b12 + a22 * b22;
            return this.set(m11, m12, m21, m22);
        };
        Matrix2.prototype.neg = function () {
            return this.scale(-1);
        };
        Matrix2.prototype.one = function () {
            return this.set(1, 0, 0, 1);
        };
        Matrix2.prototype.reflection = function (n) {
            var nx = mustBeNumber_1.default('n.x', n.x);
            var xx = 1 - 2 * nx * nx;
            return this.set(xx, 0, 0, 1);
        };
        Matrix2.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[2 + i]];
        };
        Matrix2.prototype.scale = function (α) {
            var te = this.elements;
            var m11 = te[0] * α;
            var m21 = te[1] * α;
            var m12 = te[2] * α;
            var m22 = te[3] * α;
            return this.set(m11, m12, m21, m22);
        };
        Matrix2.prototype.set = function (m11, m12, m21, m22) {
            var te = this.elements;
            te[0x0] = m11;
            te[0x2] = m12;
            te[0x1] = m21;
            te[0x3] = m22;
            return this;
        };
        Matrix2.prototype.sub = function (rhs) {
            var te = this.elements;
            var t11 = te[0];
            var t21 = te[1];
            var t12 = te[2];
            var t22 = te[3];
            var re = rhs.elements;
            var r11 = re[0];
            var r21 = re[1];
            var r12 = re[2];
            var r22 = re[3];
            var m11 = t11 - r11;
            var m21 = t21 - r21;
            var m12 = t12 - r12;
            var m22 = t22 - r22;
            return this.set(m11, m12, m21, m22);
        };
        Matrix2.prototype.toExponential = function (fractionDigits) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix2.prototype.toFixed = function (fractionDigits) {
            if (isDefined_1.default(fractionDigits)) {
                mustBeInteger_1.default('fractionDigits', fractionDigits);
            }
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix2.prototype.toPrecision = function (precision) {
            if (isDefined_1.default(precision)) {
                mustBeInteger_1.default('precision', precision);
            }
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toPrecision(precision); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix2.prototype.toString = function (radix) {
            var text = [];
            for (var i = 0, iLength = this.dimensions; i < iLength; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix2.prototype.translation = function (d) {
            var x = d.x;
            return this.set(1, x, 0, 1);
        };
        Matrix2.prototype.zero = function () {
            return this.set(0, 0, 0, 0);
        };
        Matrix2.prototype.__add__ = function (rhs) {
            if (rhs instanceof Matrix2) {
                return this.clone().add(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Matrix2) {
                return lhs.clone().add(this);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Matrix2) {
                return this.clone().mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Matrix2) {
                return lhs.clone().mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__pos__ = function () {
            return this.clone();
        };
        Matrix2.prototype.__neg__ = function () {
            return this.clone().scale(-1);
        };
        Matrix2.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Matrix2) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Matrix2) {
                return lhs.clone().sub(this);
            }
            else {
                return void 0;
            }
        };
        Matrix2.one = function () {
            return new Matrix2(new Float32Array([1, 0, 0, 1]));
        };
        Matrix2.reflection = function (n) {
            return Matrix2.zero().reflection(n);
        };
        Matrix2.zero = function () {
            return new Matrix2(new Float32Array([0, 0, 0, 0]));
        };
        return Matrix2;
    })(AbstractMatrix_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Matrix2;
});

define('davinci-eight/facets/ReflectionFacetE2',["require", "exports", '../checks/mustBeArray', '../checks/mustBeString', '../math/Vector2', '../math/Matrix2', '../i18n/readOnly'], function (require, exports, mustBeArray_1, mustBeString_1, Vector2_1, Matrix2_1, readOnly_1) {
    var ReflectionFacetE2 = (function () {
        function ReflectionFacetE2(name) {
            this.matrix = Matrix2_1.default.one();
            this.name = mustBeString_1.default('name', name);
            this._normal = new Vector2_1.default().zero();
            this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE2.prototype, "normal", {
            get: function () {
                return this._normal;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('normal').message);
            },
            enumerable: true,
            configurable: true
        });
        ReflectionFacetE2.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name);
            return void 0;
        };
        ReflectionFacetE2.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name);
            mustBeArray_1.default('value', value);
            return this;
        };
        ReflectionFacetE2.prototype.setUniforms = function (visitor) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.mat2(this.name, this.matrix, false);
        };
        return ReflectionFacetE2;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReflectionFacetE2;
});

define('davinci-eight/facets/ReflectionFacetE3',["require", "exports", '../checks/mustBeArray', '../checks/mustBeString', '../math/Geometric3', '../math/Matrix4', '../i18n/readOnly'], function (require, exports, mustBeArray_1, mustBeString_1, Geometric3_1, Matrix4_1, readOnly_1) {
    var ReflectionFacetE3 = (function () {
        function ReflectionFacetE3(name) {
            this.matrix = Matrix4_1.default.one();
            this.name = mustBeString_1.default('name', name);
            this._normal = Geometric3_1.default.zero();
            this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE3.prototype, "normal", {
            get: function () {
                return this._normal;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('normal').message);
            },
            enumerable: true,
            configurable: true
        });
        ReflectionFacetE3.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name);
            return void 0;
        };
        ReflectionFacetE3.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name);
            mustBeArray_1.default('value', value);
            return this;
        };
        ReflectionFacetE3.prototype.setUniforms = function (visitor) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.mat4(this.name, this.matrix, false);
        };
        return ReflectionFacetE3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReflectionFacetE3;
});

define('davinci-eight/facets/Vector3Facet',["require", "exports", '../checks/mustBeObject', '../checks/mustBeString'], function (require, exports, mustBeObject_1, mustBeString_1) {
    var LOGGING_NAME = 'Vector3Facet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var Vector3Facet = (function () {
        function Vector3Facet(name, vector) {
            this._name = mustBeString_1.default('name', name, contextBuilder);
            this._vector = mustBeObject_1.default('vector', vector, contextBuilder);
        }
        Vector3Facet.prototype.getProperty = function (name) {
            return void 0;
        };
        Vector3Facet.prototype.setProperty = function (name, value) {
            return this;
        };
        Vector3Facet.prototype.setUniforms = function (visitor) {
            var v = this._vector;
            visitor.uniform3f(this._name, v.x, v.y, v.z);
        };
        return Vector3Facet;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector3Facet;
});

define('davinci-eight/facets/frustumMatrix',["require", "exports", '../checks/expectArg', '../checks/isDefined'], function (require, exports, expectArg_1, isDefined_1) {
    function frustumMatrix(left, right, bottom, top, near, far, matrix) {
        expectArg_1.default('left', left).toBeNumber();
        expectArg_1.default('right', right).toBeNumber();
        expectArg_1.default('bottom', bottom).toBeNumber();
        expectArg_1.default('top', top).toBeNumber();
        expectArg_1.default('near', near).toBeNumber();
        expectArg_1.default('far', far).toBeNumber();
        var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expectArg_1.default('m', m).toSatisfy(m.length === 16, 'elements must have length 16');
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = frustumMatrix;
});

define('davinci-eight/facets/viewArrayFromEyeLookUp',["require", "exports", '../math/Vector3', '../checks/mustSatisfy', '../checks/isDefined'], function (require, exports, Vector3_1, mustSatisfy_1, isDefined_1) {
    var n = new Vector3_1.default();
    var u = new Vector3_1.default();
    var v = new Vector3_1.default();
    function viewArray(eye, look, up, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        mustSatisfy_1.default('matrix', m.length === 16, function () { return 'matrix must have length 16'; });
        n.copy(eye).sub(look);
        if (n.x === 0 && n.y === 0 && n.z === 0) {
            n.z = 1;
        }
        else {
            n.normalize();
        }
        n.approx(12).normalize();
        u.copy(up).cross(n).approx(12).normalize();
        v.copy(n).cross(u).approx(12).normalize();
        m[0x0] = u.x;
        m[0x4] = u.y;
        m[0x8] = u.z;
        m[0xC] = -Vector3_1.default.dot(eye, u);
        m[0x1] = v.x;
        m[0x5] = v.y;
        m[0x9] = v.z;
        m[0xD] = -Vector3_1.default.dot(eye, v);
        m[0x2] = n.x;
        m[0x6] = n.y;
        m[0xA] = n.z;
        m[0xE] = -Vector3_1.default.dot(eye, n);
        m[0x3] = 0.0;
        m[0x7] = 0.0;
        m[0xB] = 0.0;
        m[0xF] = 1;
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = viewArray;
});

define('davinci-eight/facets/viewMatrixFromEyeLookUp',["require", "exports", '../checks/isDefined', '../math/Matrix4', './viewArrayFromEyeLookUp'], function (require, exports, isDefined_1, Matrix4_1, viewArrayFromEyeLookUp_1) {
    function default_1(eye, look, up, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : Matrix4_1.default.one();
        viewArrayFromEyeLookUp_1.default(eye, look, up, m.elements);
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/facets/createView',["require", "exports", '../math/Geometric3', '../math/G3', '../math/Matrix4', '../core/GraphicsProgramSymbols', '../checks/isUndefined', './viewMatrixFromEyeLookUp'], function (require, exports, Geometric3_1, G3_1, Matrix4_1, GraphicsProgramSymbols_1, isUndefined_1, viewMatrixFromEyeLookUp_1) {
    function createView(options) {
        if (options === void 0) { options = {}; }
        var eye = Geometric3_1.default.copy(G3_1.default.e3);
        var look = Geometric3_1.default.copy(G3_1.default.zero);
        var up = Geometric3_1.default.copy(G3_1.default.e2);
        var viewMatrix = Matrix4_1.default.one();
        var viewMatrixName = isUndefined_1.default(options.viewMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
        eye.modified = true;
        look.modified = true;
        up.modified = true;
        var self = {
            setProperty: function (name, value) {
                return self;
            },
            get eye() {
                return eye;
            },
            set eye(newEye) {
                self.setEye(newEye);
            },
            setEye: function (newEye) {
                eye.copyVector(newEye);
                return self;
            },
            get look() {
                return look;
            },
            set look(newLook) {
                self.setLook(newLook);
            },
            setLook: function (newLook) {
                look.copyVector(newLook);
                return self;
            },
            get up() {
                return up;
            },
            set up(newUp) {
                self.setUp(newUp);
            },
            setUp: function (newUp) {
                up.copyVector(newUp);
                up.normalize();
                return self;
            },
            setUniforms: function (visitor) {
                if (eye.modified || look.modified || up.modified) {
                    viewMatrixFromEyeLookUp_1.default(eye, look, up, viewMatrix);
                    eye.modified = false;
                    look.modified = false;
                    up.modified = false;
                }
                visitor.mat4(viewMatrixName, viewMatrix, false);
            }
        };
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createView;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Vector1',["require", "exports", '../math/Coords'], function (require, exports, Coords_1) {
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var Vector1 = (function (_super) {
        __extends(Vector1, _super);
        function Vector1(data, modified) {
            if (data === void 0) { data = [0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 1);
        }
        Object.defineProperty(Vector1.prototype, "x", {
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.coords[COORD_X] = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector1.prototype.set = function (x) {
            this.x = x;
            return this;
        };
        Vector1.prototype.add = function (vector, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.x += vector.x * alpha;
            return this;
        };
        Vector1.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            return this;
        };
        Vector1.prototype.scp = function (v) {
            return this;
        };
        Vector1.prototype.adj = function () {
            throw new Error('TODO: Vector1.adj');
        };
        Vector1.prototype.applyMatrix = function (σ) {
            var x = this.x;
            var e = σ.elements;
            this.x = e[0x0] * x;
            return this;
        };
        Vector1.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Vector1.prototype.conj = function () {
            return this;
        };
        Vector1.prototype.copy = function (v) {
            this.x = v.x;
            return this;
        };
        Vector1.prototype.det = function () {
            return this.x;
        };
        Vector1.prototype.dual = function () {
            return this;
        };
        Vector1.prototype.exp = function () {
            this.x = exp(this.x);
            return this;
        };
        Vector1.prototype.one = function () {
            this.x = 1;
            return this;
        };
        Vector1.prototype.inv = function () {
            this.x = 1 / this.x;
            return this;
        };
        Vector1.prototype.lco = function (v) {
            return this;
        };
        Vector1.prototype.log = function () {
            this.x = log(this.x);
            return this;
        };
        Vector1.prototype.mul = function (v) {
            this.x *= v.x;
            return this;
        };
        Vector1.prototype.norm = function () {
            return this;
        };
        Vector1.prototype.div = function (v) {
            this.x /= v.x;
            return this;
        };
        Vector1.prototype.divByScalar = function (scalar) {
            this.x /= scalar;
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
        Vector1.prototype.rev = function () {
            return this;
        };
        Vector1.prototype.rco = function (v) {
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
        Vector1.prototype.scale = function (scalar) {
            this.x *= scalar;
            return this;
        };
        Vector1.prototype.stress = function (σ) {
            this.x *= σ.x;
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
        Vector1.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            return this;
        };
        Vector1.prototype.neg = function () {
            this.x = -this.x;
            return this;
        };
        Vector1.prototype.distanceTo = function (position) {
            return sqrt(this.quadranceTo(position));
        };
        Vector1.prototype.dot = function (v) {
            return this.x * v.x;
        };
        Vector1.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        Vector1.prototype.normalize = function () {
            return this.divByScalar(this.magnitude());
        };
        Vector1.prototype.mul2 = function (a, b) {
            return this;
        };
        Vector1.prototype.quad = function () {
            var x = this.x;
            this.x = x * x;
            return this;
        };
        Vector1.prototype.squaredNorm = function () {
            return this.x * this.x;
        };
        Vector1.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            return dx * dx;
        };
        Vector1.prototype.reflect = function (n) {
            return this;
        };
        Vector1.prototype.reflection = function (n) {
            return this;
        };
        Vector1.prototype.rotate = function (rotor) {
            return this;
        };
        Vector1.prototype.lerp = function (v, α) {
            this.x += (v.x - this.x) * α;
            return this;
        };
        Vector1.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
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
        Vector1.prototype.slerp = function (v, α) {
            return this;
        };
        Vector1.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            return array;
        };
        Vector1.prototype.toExponential = function (fractionDigits) {
            return "TODO: Vector1.toExponential";
        };
        Vector1.prototype.toFixed = function (fractionDigits) {
            return "TODO: Vector1.toFixed";
        };
        Vector1.prototype.toPrecision = function (precision) {
            return "TODO: Vector1.toPrecision";
        };
        Vector1.prototype.toString = function (radix) {
            return "TODO: Vector1.toString";
        };
        Vector1.prototype.translation = function (d) {
            return this.one();
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
        Vector1.prototype.ext = function (v) {
            return this;
        };
        Vector1.prototype.zero = function () {
            this.x = 0;
            return this;
        };
        Vector1.random = function () {
            return new Vector1[Math.random()];
        };
        Vector1.zero = function () {
            return new Vector1[0];
        };
        return Vector1;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector1;
});

define('davinci-eight/facets/perspectiveArray',["require", "exports", './frustumMatrix', '../checks/expectArg'], function (require, exports, frustumMatrix_1, expectArg_1) {
    function perspectiveArray(fov, aspect, near, far, matrix) {
        expectArg_1.default('fov', fov).toBeNumber();
        expectArg_1.default('aspect', aspect).toBeNumber();
        expectArg_1.default('near', near).toBeNumber();
        expectArg_1.default('far', far).toBeNumber();
        var ymax = near * Math.tan(fov * 0.5);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;
        return frustumMatrix_1.default(xmin, xmax, ymin, ymax, near, far, matrix);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = perspectiveArray;
});

define('davinci-eight/facets/perspectiveMatrix',["require", "exports", '../checks/isDefined', '../math/Matrix4', './perspectiveArray'], function (require, exports, isDefined_1, Matrix4_1, perspectiveArray_1) {
    function perspectiveMatrix(fov, aspect, near, far, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : Matrix4_1.default.one();
        perspectiveArray_1.default(fov, aspect, near, far, m.elements);
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = perspectiveMatrix;
});

define('davinci-eight/facets/createPerspective',["require", "exports", './createView', '../math/Matrix4', '../core/GraphicsProgramSymbols', '../math/Vector1', '../checks/isUndefined', '../checks/mustBeNumber', './perspectiveMatrix'], function (require, exports, createView_1, Matrix4_1, GraphicsProgramSymbols_1, Vector1_1, isUndefined_1, mustBeNumber_1, perspectiveMatrix_1) {
    function createPerspective(options) {
        if (options === void 0) { options = {}; }
        var fov = new Vector1_1.default([isUndefined_1.default(options.fov) ? 75 * Math.PI / 180 : options.fov]);
        var aspect = new Vector1_1.default([isUndefined_1.default(options.aspect) ? 1 : options.aspect]);
        var near = new Vector1_1.default([isUndefined_1.default(options.near) ? 0.1 : options.near]);
        var far = new Vector1_1.default([mustBeNumber_1.default('options.far', isUndefined_1.default(options.far) ? 2000 : options.far)]);
        var projectionMatrixName = isUndefined_1.default(options.projectionMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
        var base = createView_1.default(options);
        var projectionMatrix = Matrix4_1.default.one();
        var matrixNeedsUpdate = true;
        var self = {
            setProperty: function (name, value) {
                return self;
            },
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
                mustBeNumber_1.default('fov', value);
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
                mustBeNumber_1.default('aspect', value);
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
                if (value !== near.x) {
                    near.x = value;
                    matrixNeedsUpdate = true;
                }
                return self;
            },
            get far() {
                return far.x;
            },
            set far(value) {
                self.setFar(value);
            },
            setFar: function (value) {
                if (value !== far.x) {
                    far.x = value;
                    matrixNeedsUpdate = true;
                }
                return self;
            },
            setUniforms: function (visitor) {
                if (matrixNeedsUpdate) {
                    perspectiveMatrix_1.default(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                    matrixNeedsUpdate = false;
                }
                visitor.mat4(projectionMatrixName, projectionMatrix, false);
                base.setUniforms(visitor);
            }
        };
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createPerspective;
});

define('davinci-eight/facets/PerspectiveCamera',["require", "exports", './createPerspective', '../i18n/readOnly', '../checks/mustBeObject', '../checks/mustBeGE', '../checks/mustBeLE', '../checks/mustBeNumber', '../checks/mustBeString'], function (require, exports, createPerspective_1, readOnly_1, mustBeObject_1, mustBeGE_1, mustBeLE_1, mustBeNumber_1, mustBeString_1) {
    var PerspectiveCamera = (function () {
        function PerspectiveCamera(fov, aspect, near, far) {
            if (fov === void 0) { fov = 45 * Math.PI / 180; }
            if (aspect === void 0) { aspect = 1; }
            if (near === void 0) { near = 0.1; }
            if (far === void 0) { far = 1000; }
            mustBeNumber_1.default('fov', fov);
            mustBeGE_1.default('fov', fov, 0);
            mustBeLE_1.default('fov', fov, Math.PI);
            mustBeNumber_1.default('aspect', aspect);
            mustBeGE_1.default('aspect', aspect, 0);
            mustBeNumber_1.default('near', near);
            mustBeGE_1.default('near', near, 0);
            mustBeNumber_1.default('far', far);
            mustBeGE_1.default('far', far, 0);
            this.inner = createPerspective_1.default({ fov: fov, aspect: aspect, near: near, far: far });
        }
        PerspectiveCamera.prototype.setUniforms = function (visitor) {
            this.inner.setNear(this.near);
            this.inner.setFar(this.far);
            this.inner.setUniforms(visitor);
        };
        PerspectiveCamera.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name);
            switch (name) {
                case PerspectiveCamera.PROP_EYE:
                case PerspectiveCamera.PROP_POSITION: {
                    return this.eye.coords;
                }
                default: {
                }
            }
        };
        PerspectiveCamera.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name);
            mustBeObject_1.default('value', value);
            switch (name) {
                case PerspectiveCamera.PROP_EYE:
                case PerspectiveCamera.PROP_POSITION:
                    {
                        this.eye.copyCoordinates(value);
                    }
                    break;
                default: {
                }
            }
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
            get: function () {
                return this.inner.aspect;
            },
            set: function (aspect) {
                this.inner.aspect = aspect;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setAspect = function (aspect) {
            this.inner.aspect = aspect;
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "eye", {
            get: function () {
                return this.inner.eye;
            },
            set: function (eye) {
                this.inner.eye.copyVector(eye);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setEye = function (eye) {
            this.inner.setEye(eye);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "fov", {
            get: function () {
                return this.inner.fov;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('fov').message);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setFov = function (fov) {
            mustBeNumber_1.default('fov', fov);
            this.inner.fov = fov;
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "look", {
            get: function () {
                return this.inner.look;
            },
            set: function (look) {
                this.inner.setLook(look);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setLook = function (look) {
            this.inner.setLook(look);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "near", {
            get: function () {
                return this.inner.near;
            },
            set: function (near) {
                this.inner.near = near;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setNear = function (near) {
            this.inner.setNear(near);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "far", {
            get: function () {
                return this.inner.far;
            },
            set: function (far) {
                this.inner.far = far;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setFar = function (far) {
            this.inner.setFar(far);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "up", {
            get: function () {
                return this.inner.up;
            },
            set: function (up) {
                this.inner.up = up;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setUp = function (up) {
            this.inner.setUp(up);
            return this;
        };
        PerspectiveCamera.PROP_POSITION = 'X';
        PerspectiveCamera.PROP_EYE = 'eye';
        return PerspectiveCamera;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PerspectiveCamera;
});

define('davinci-eight/math/dotVectorE2',["require", "exports", '../checks/isDefined'], function (require, exports, isDefined_1) {
    function dotVectorE2(a, b) {
        if (isDefined_1.default(a) && isDefined_1.default(b)) {
            return a.x * b.x + a.y * b.y;
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorE2;
});

define('davinci-eight/math/extE2',["require", "exports"], function (require, exports) {
    function extE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
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
                    x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = extE2;
});

define('davinci-eight/math/lcoE2',["require", "exports"], function (require, exports) {
    function lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 - a2 * b3);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b3);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoE2;
});

define('davinci-eight/math/rcoE2',["require", "exports"], function (require, exports) {
    function rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(-a1 * b0 - a3 * b2);
                }
                break;
            case 2:
                {
                    x = +(-a2 * b0 + a3 * b1);
                }
                break;
            case 3:
                {
                    x = +(a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoE2;
});

define('davinci-eight/math/mulE2',["require", "exports"], function (require, exports) {
    function mulE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulE2;
});

define('davinci-eight/math/scpE2',["require", "exports"], function (require, exports) {
    function scpE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        switch (index) {
            case 0:
                return a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            case 1:
                return 0;
            case 2:
                return 0;
            case 3:
                return 0;
            default:
                throw new Error("index must be in the range [0..3]");
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = scpE2;
});

define('davinci-eight/math/G2',["require", "exports", '../geometries/b2', '../geometries/b3', './extE2', './gauss', './lcoE2', './rcoE2', './mulE2', '../i18n/notImplemented', '../i18n/notSupported', '../i18n/readOnly', './scpE2', './stringFromCoordinates', './Unit'], function (require, exports, b2_1, b3_1, extE2_1, gauss_1, lcoE2_1, rcoE2_1, mulE2_1, notImplemented_1, notSupported_1, readOnly_1, scpE2_1, stringFromCoordinates_1, Unit_1) {
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_PSEUDO = 3;
    function add00(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a00 + b00);
    }
    function add01(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a01 + b01);
    }
    function add10(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a10 + b10);
    }
    function add11(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a11 + b11);
    }
    function subE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
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
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    var G2 = (function () {
        function G2(α, x, y, β, uom) {
            if (α === void 0) { α = 0; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (β === void 0) { β = 0; }
            this._coords = [0, 0, 0, 0];
            this._coords[COORD_SCALAR] = α;
            this._coords[COORD_X] = x;
            this._coords[COORD_Y] = y;
            this._coords[COORD_PSEUDO] = β;
            this.uom = uom;
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this._coords[COORD_SCALAR] *= multiplier;
                this._coords[COORD_X] *= multiplier;
                this._coords[COORD_Y] *= multiplier;
                this._coords[COORD_PSEUDO] *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(G2, "zero", {
            get: function () {
                return G2._zero;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('zero').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "one", {
            get: function () {
                return G2._one;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('one').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "e1", {
            get: function () {
                return G2._e1;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('e1').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "e2", {
            get: function () {
                return G2._e2;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('e2').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "I", {
            get: function () {
                return G2._I;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('I').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "α", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "alpha", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('alpha').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "x", {
            get: function () {
                return this._coords[COORD_X];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "y", {
            get: function () {
                return this._coords[COORD_Y];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "β", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('β').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "beta", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('beta').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "coords", {
            get: function () {
                return [this.α, this.x, this.y, this.β];
            },
            enumerable: true,
            configurable: true
        });
        G2.prototype.coordinate = function (index) {
            switch (index) {
                case 0:
                    return this.α;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.β;
                default:
                    throw new Error("index must be in the range [0..3]");
            }
        };
        G2.add = function (a, b) {
            var a00 = a[0];
            var a01 = a[1];
            var a10 = a[2];
            var a11 = a[3];
            var b00 = b[0];
            var b01 = b[1];
            var b10 = b[2];
            var b11 = b[3];
            var x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
            var x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
            var x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
            var x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
            return [x00, x01, x10, x11];
        };
        G2.prototype.add = function (rhs) {
            var xs = G2.add(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G2.prototype.addPseudo = function (β) {
            return new G2(this.α, this.x, this.y, this.β + β.multiplier, Unit_1.default.compatible(this.uom, β));
        };
        G2.prototype.addScalar = function (α) {
            return new G2(this.α + α.multiplier, this.x, this.y, this.β, Unit_1.default.compatible(this.uom, α));
        };
        G2.prototype.adj = function () {
            throw new Error("TODO: adj");
        };
        G2.prototype.__add__ = function (other) {
            if (other instanceof G2) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__radd__ = function (other) {
            if (other instanceof G2) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).add(this);
            }
        };
        G2.prototype.angle = function () {
            return this.log().grade(2);
        };
        G2.prototype.conj = function () {
            throw new Error(notImplemented_1.default('conj').message);
        };
        G2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var α = b3_1.default(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var β = b3_1.default(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
            return new G2(α, x, y, β, this.uom);
        };
        G2.prototype.direction = function () {
            var m = this.magnitudeSansUnits();
            if (m !== 1) {
                return new G2(this.α / m, this.x / m, this.y / m, this.β / m);
            }
            else {
                if (this.uom) {
                    return new G2(this.α, this.x, this.y, this.β);
                }
                else {
                    return this;
                }
            }
        };
        G2.prototype.distanceTo = function (point) {
            throw new Error(notImplemented_1.default('diistanceTo').message);
        };
        G2.prototype.equals = function (point) {
            throw new Error(notImplemented_1.default('equals').message);
        };
        G2.sub = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.sub = function (rhs) {
            var xs = G2.sub(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G2.prototype.__sub__ = function (other) {
            if (other instanceof G2) {
                return this.sub(other);
            }
            else if (typeof other === 'number') {
                return this.sub(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rsub__ = function (other) {
            if (other instanceof G2) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).sub(this);
            }
        };
        G2.prototype.mul = function (rhs) {
            var a0 = this.α;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.β;
            var b0 = rhs.α;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.β;
            var c0 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var c1 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var c2 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var c3 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return new G2(c0, c1, c2, c3, Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__mul__ = function (other) {
            if (other instanceof G2) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                return this.mul(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rmul__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.mul(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).mul(this);
            }
        };
        G2.prototype.scale = function (α) {
            return new G2(this.α * α, this.x * α, this.y * α, this.β * α, this.uom);
        };
        G2.prototype.div = function (rhs) {
            return this.mul(rhs.inv());
        };
        G2.prototype.divByScalar = function (α) {
            return new G2(this.α / α, this.x / α, this.y / α, this.β / α, this.uom);
        };
        G2.prototype.__div__ = function (other) {
            if (other instanceof G2) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.div(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rdiv__ = function (other) {
            if (other instanceof G2) {
                return other.div(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).div(this);
            }
        };
        G2.prototype.scp = function (rhs) {
            var a0 = this.α;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.β;
            var b0 = rhs.α;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.β;
            var c0 = scpE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            return new G2(c0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.ext = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.ext = function (rhs) {
            var xs = G2.ext(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__wedge__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return this.ext(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.ext(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rwedge__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.ext(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).ext(this);
            }
        };
        G2.lshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        G2.prototype.lco = function (rhs) {
            var xs = G2.lshift(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__lshift__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return this.lco(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.lco(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rlshift__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.lco(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).lco(this);
            }
        };
        G2.rshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.rco = function (rhs) {
            var xs = G2.rshift(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__rshift__ = function (other) {
            if (other instanceof G2) {
                return this.rco(other);
            }
            else if (typeof other === 'number') {
                return this.rco(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rrshift__ = function (other) {
            if (other instanceof G2) {
                return other.rco(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).rco(this);
            }
        };
        G2.prototype.__vbar__ = function (other) {
            if (other instanceof G2) {
                return this.scp(other);
            }
            else if (typeof other === 'number') {
                return this.scp(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rvbar__ = function (other) {
            if (other instanceof G2) {
                return other.scp(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).scp(this);
            }
        };
        G2.prototype.pow = function (exponent) {
            throw new Error(notImplemented_1.default('pow').message);
        };
        G2.prototype.__bang__ = function () {
            return this.inv();
        };
        G2.prototype.__pos__ = function () {
            return this;
        };
        G2.prototype.neg = function () {
            return new G2(-this.α, -this.x, -this.y, -this.β, this.uom);
        };
        G2.prototype.__neg__ = function () {
            return this.neg();
        };
        G2.prototype.__tilde__ = function () {
            return this.rev();
        };
        G2.prototype.grade = function (grade) {
            switch (grade) {
                case 0:
                    return new G2(this.α, 0, 0, 0, this.uom);
                case 1:
                    return new G2(0, this.x, this.y, 0, this.uom);
                case 2:
                    return new G2(0, 0, 0, this.β, this.uom);
                default:
                    return new G2(0, 0, 0, 0, this.uom);
            }
        };
        G2.prototype.cos = function () {
            throw new Error(notImplemented_1.default('cos').message);
        };
        G2.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        G2.prototype.exp = function () {
            Unit_1.default.assertDimensionless(this.uom);
            if (this.isSpinor()) {
                var expα = Math.exp(this.α);
                var cosβ = Math.cos(this.β);
                var sinβ = Math.sin(this.β);
                return new G2(expα * cosβ, 0, 0, expα * sinβ);
            }
            else {
                throw new Error(notImplemented_1.default("exp(" + this.toString() + ")").message);
            }
        };
        G2.prototype.inv = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var β = this.β;
            var A = [
                [α, x, y, -β],
                [x, α, β, -y],
                [y, -β, α, x],
                [β, -y, x, α]
            ];
            var b = [1, 0, 0, 0];
            var X = gauss_1.default(A, b);
            var uom = this.uom ? this.uom.inv() : void 0;
            return new G2(X[0], X[1], X[2], X[3], uom);
        };
        G2.prototype.isSpinor = function () {
            return this.x === 0 && this.y === 0;
        };
        G2.prototype.log = function () {
            throw new Error(notImplemented_1.default('log').message);
        };
        G2.prototype.magnitude = function () {
            return this.norm();
        };
        G2.prototype.magnitudeSansUnits = function () {
            return Math.sqrt(this.squaredNormSansUnits());
        };
        G2.prototype.norm = function () {
            return new G2(this.magnitudeSansUnits(), 0, 0, 0, this.uom);
        };
        G2.prototype.quad = function () {
            return new G2(this.squaredNormSansUnits(), 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        G2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var α = b2_1.default(t, this.α, controlPoint.α, endPoint.α);
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var β = b2_1.default(t, this.β, controlPoint.β, endPoint.β);
            return new G2(α, x, y, β, this.uom);
        };
        G2.prototype.squaredNorm = function () {
            return this.quad();
        };
        G2.prototype.squaredNormSansUnits = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var β = this.β;
            return α * α + x * x + y * y + β * β;
        };
        G2.prototype.stress = function (σ) {
            throw new Error(notSupported_1.default('stress').message);
        };
        G2.prototype.reflect = function (n) {
            var m = G2.fromVectorE2(n);
            return m.mul(this).mul(m).scale(-1);
        };
        G2.prototype.rev = function () {
            return new G2(this.α, this.x, this.y, -this.β, this.uom);
        };
        G2.prototype.rotate = function (spinor) {
            var x = this.x;
            var y = this.y;
            var α = spinor.α;
            var β = spinor.β;
            var α2 = α * α;
            var β2 = β * β;
            var p = α2 - β2;
            var q = 2 * α * β;
            var s = α2 + β2;
            return new G2(s * this.α, p * x + q * y, p * y - q * x, s * this.β, this.uom);
        };
        G2.prototype.sin = function () {
            throw new Error(notImplemented_1.default('sin').message);
        };
        G2.prototype.sinh = function () {
            throw new Error(notImplemented_1.default('sinh').message);
        };
        G2.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        G2.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        G2.prototype.isOne = function () { return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0; };
        G2.prototype.isNaN = function () { return isNaN(this.α) || isNaN(this.x) || isNaN(this.y) || isNaN(this.β); };
        G2.prototype.isZero = function () { return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0; };
        G2.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
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
        G2.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toStringIJK = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
        };
        G2.copy = function (m) {
            if (m instanceof G2) {
                return m;
            }
            else {
                return new G2(m.α, m.x, m.y, m.β, void 0);
            }
        };
        G2.fromVectorE2 = function (vector) {
            if (vector) {
                if (vector instanceof G2) {
                    return new G2(0, vector.x, vector.y, 0, vector.uom);
                }
                else {
                    return new G2(0, vector.x, vector.y, 0, void 0);
                }
            }
            else {
                return void 0;
            }
        };
        G2.vector = function (x, y, uom) {
            return new G2(0, x, y, 0, uom);
        };
        G2._zero = new G2(0, 0, 0, 0);
        G2._one = new G2(1, 0, 0, 0);
        G2._e1 = new G2(0, 1, 0, 0);
        G2._e2 = new G2(0, 0, 1, 0);
        G2._I = new G2(0, 0, 0, 1);
        G2.kilogram = new G2(1, 0, 0, 0, Unit_1.default.KILOGRAM);
        G2.meter = new G2(1, 0, 0, 0, Unit_1.default.METER);
        G2.second = new G2(1, 0, 0, 0, Unit_1.default.SECOND);
        G2.coulomb = new G2(1, 0, 0, 0, Unit_1.default.COULOMB);
        G2.ampere = new G2(1, 0, 0, 0, Unit_1.default.AMPERE);
        G2.kelvin = new G2(1, 0, 0, 0, Unit_1.default.KELVIN);
        G2.mole = new G2(1, 0, 0, 0, Unit_1.default.MOLE);
        G2.candela = new G2(1, 0, 0, 0, Unit_1.default.CANDELA);
        return G2;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = G2;
});

define('davinci-eight/math/dotVectorCartesianE2',["require", "exports"], function (require, exports) {
    function dotVectorCartesianE2(ax, ay, bx, by) {
        return ax * bx + ay * by;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorCartesianE2;
});

define('davinci-eight/math/quadVectorE2',["require", "exports", '../math/dotVectorCartesianE2', '../checks/isDefined', '../checks/isNumber'], function (require, exports, dotVectorCartesianE2_1, isDefined_1, isNumber_1) {
    function quadVectorE2(vector) {
        if (isDefined_1.default(vector)) {
            var x = vector.x;
            var y = vector.y;
            if (isNumber_1.default(x) && isNumber_1.default(y)) {
                return dotVectorCartesianE2_1.default(x, y, x, y);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadVectorE2;
});

define('davinci-eight/math/rotorFromDirectionsE2',["require", "exports", './dotVectorE2', './quadVectorE2'], function (require, exports, dotVectorE2_1, quadVectorE2_1) {
    var sqrt = Math.sqrt;
    function default_1(a, b, m) {
        var quadA = quadVectorE2_1.default(a);
        var absA = sqrt(quadA);
        var quadB = quadVectorE2_1.default(b);
        var absB = sqrt(quadB);
        var BA = absB * absA;
        var dotBA = dotVectorE2_1.default(b, a);
        var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
        if (denom !== 0) {
            m = m.versor(b, a);
            m = m.addScalar(BA);
            m = m.divByScalar(denom);
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Geometric2',["require", "exports", './arraysEQ', '../geometries/b2', '../geometries/b3', './Coords', './dotVectorE2', './G2', './extE2', './gauss', '../checks/isDefined', '../checks/isNumber', '../checks/isObject', './lcoE2', './mulE2', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../i18n/notImplemented', '../i18n/notSupported', './rcoE2', './rotorFromDirectionsE2', './scpE2', './stringFromCoordinates', './wedgeXY'], function (require, exports, arraysEQ_1, b2_1, b3_1, Coords_1, dotVectorE2_1, G2_1, extE2_1, gauss_1, isDefined_1, isNumber_1, isObject_1, lcoE2_1, mulE2_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, notImplemented_1, notSupported_1, rcoE2_1, rotorFromDirectionsE2_1, scpE2_1, stringFromCoordinates_1, wedgeXY_1) {
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_PSEUDO = 3;
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var log = Math.log;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var LEFTWARDS_ARROW = "←";
    var RIGHTWARDS_ARROW = "→";
    var UPWARDS_ARROW = "↑";
    var DOWNWARDS_ARROW = "↓";
    var CLOCKWISE_OPEN_CIRCLE_ARROW = "↻";
    var ANTICLOCKWISE_OPEN_CIRCLE_ARROW = "↺";
    var ARROW_LABELS = ["1", [LEFTWARDS_ARROW, RIGHTWARDS_ARROW], [DOWNWARDS_ARROW, UPWARDS_ARROW], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
    var COMPASS_LABELS = ["1", ['W', 'E'], ['S', 'N'], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
    var STANDARD_LABELS = ["1", "e1", "e2", "I"];
    function coordinates(m) {
        return [m.α, m.x, m.y, m.β];
    }
    function duckCopy(value) {
        if (isObject_1.default(value)) {
            var m = value;
            if (isNumber_1.default(m.x) && isNumber_1.default(m.y)) {
                if (isNumber_1.default(m.α) && isNumber_1.default(m.β)) {
                    console.warn("Copying GeometricE2 to Geometric2");
                    return Geometric2.copy(m);
                }
                else {
                    console.warn("Copying VectorE2 to Geometric2");
                    return Geometric2.fromVector(m);
                }
            }
            else {
                if (isNumber_1.default(m.α) && isNumber_1.default(m.β)) {
                    console.warn("Copying SpinorE2 to Geometric2");
                    return Geometric2.fromSpinor(m);
                }
                else {
                    return void 0;
                }
            }
        }
        else {
            return void 0;
        }
    }
    var Geometric2 = (function (_super) {
        __extends(Geometric2, _super);
        function Geometric2() {
            _super.call(this, [0, 0, 0, 0], false, 4);
        }
        Object.defineProperty(Geometric2.prototype, "α", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (α) {
                this.modified = this.modified || this.coords[COORD_SCALAR] !== α;
                this.coords[COORD_SCALAR] = α;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "alpha", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (alpha) {
                this.modified = this.modified || this.coords[COORD_SCALAR] !== alpha;
                this.coords[COORD_SCALAR] = alpha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "x", {
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (x) {
                this.modified = this.modified || this.coords[COORD_X] !== x;
                this.coords[COORD_X] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "y", {
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (y) {
                this.modified = this.modified || this.coords[COORD_Y] !== y;
                this.coords[COORD_Y] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "β", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (β) {
                this.modified = this.modified || this.coords[COORD_PSEUDO] !== β;
                this.coords[COORD_PSEUDO] = β;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "beta", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (beta) {
                this.modified = this.modified || this.coords[COORD_PSEUDO] !== beta;
                this.coords[COORD_PSEUDO] = beta;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "xy", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (xy) {
                this.modified = this.modified || this.coords[COORD_PSEUDO] !== xy;
                this.coords[COORD_PSEUDO] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Geometric2.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('M', M);
            mustBeNumber_1.default('α', α);
            this.α += M.α * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.β += M.β * α;
            return this;
        };
        Geometric2.prototype.add2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.α = a.α + b.α;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.β = a.β + b.β;
            return this;
        };
        Geometric2.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            this.β += β;
            return this;
        };
        Geometric2.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.α += α;
            return this;
        };
        Geometric2.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('v', v);
            mustBeNumber_1.default('α', α);
            this.x += v.x * α;
            this.y += v.y * α;
            return this;
        };
        Geometric2.prototype.adj = function () {
            throw new Error(notImplemented_1.default('adj').message);
        };
        Geometric2.prototype.angle = function () {
            return this.log().grade(2);
        };
        Geometric2.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Geometric2.prototype.clone = function () {
            var m = new Geometric2();
            m.copy(this);
            return m;
        };
        Geometric2.prototype.conj = function () {
            this.β = -this.β;
            return this;
        };
        Geometric2.prototype.cos = function () {
            throw new Error(notImplemented_1.default('cos').message);
        };
        Geometric2.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        Geometric2.prototype.distanceTo = function (M) {
            var α = this.α - M.α;
            var x = this.x - M.x;
            var y = this.y - M.y;
            var β = this.β - M.β;
            return Math.sqrt(scpE2_1.default(α, x, y, β, α, x, y, β, 0));
        };
        Geometric2.prototype.copy = function (M) {
            mustBeObject_1.default('M', M);
            this.α = M.α;
            this.x = M.x;
            this.y = M.y;
            this.β = M.β;
            return this;
        };
        Geometric2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        Geometric2.prototype.copySpinor = function (spinor) {
            mustBeObject_1.default('spinor', spinor);
            this.α = spinor.α;
            this.x = 0;
            this.y = 0;
            this.β = spinor.β;
            return this;
        };
        Geometric2.prototype.copyVector = function (vector) {
            mustBeObject_1.default('vector', vector);
            this.α = 0;
            this.x = vector.x;
            this.y = vector.y;
            this.β = 0;
            return this;
        };
        Geometric2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var α = b3_1.default(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var β = b3_1.default(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
            this.α = α;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        Geometric2.prototype.normalize = function () {
            var norm = this.magnitude();
            this.α = this.α / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.β = this.β / norm;
            return this;
        };
        Geometric2.prototype.div = function (m) {
            return this.div2(this, m);
        };
        Geometric2.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            this.copy(b).inv();
            var b0 = this.α;
            var b1 = this.x;
            var b2 = this.y;
            var b3 = this.β;
            this.α = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.divByScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.α /= α;
            this.x /= α;
            this.y /= α;
            this.β /= α;
            return this;
        };
        Geometric2.prototype.dual = function (m) {
            var w = -m.β;
            var x = +m.y;
            var y = -m.x;
            var β = +m.α;
            this.α = w;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        Geometric2.prototype.equals = function (other) {
            if (other instanceof Geometric2) {
                var that = other;
                return arraysEQ_1.default(this.coords, that.coords);
            }
            else {
                return false;
            }
        };
        Geometric2.prototype.exp = function () {
            var w = this.α;
            var z = this.β;
            var expW = exp(w);
            var φ = sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.β = z * s;
            return this;
        };
        Geometric2.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        Geometric2.prototype.ext2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.inv = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var β = this.β;
            var A = [
                [α, x, y, -β],
                [x, α, β, -y],
                [y, -β, α, x],
                [β, -y, x, α]
            ];
            var b = [1, 0, 0, 0];
            var X = gauss_1.default(A, b);
            this.α = X[0];
            this.x = X[1];
            this.y = X[2];
            this.β = X[3];
            return this;
        };
        Geometric2.prototype.isOne = function () {
            return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        Geometric2.prototype.isZero = function () {
            return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        Geometric2.prototype.lco = function (m) {
            return this.lco2(this, m);
        };
        Geometric2.prototype.lco2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.lerp = function (target, α) {
            mustBeObject_1.default('target', target);
            mustBeNumber_1.default('α', α);
            this.α += (target.α - this.α) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.β += (target.β - this.β) * α;
            return this;
        };
        Geometric2.prototype.lerp2 = function (a, b, α) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            mustBeNumber_1.default('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        Geometric2.prototype.log = function () {
            var α = this.α;
            var β = this.β;
            this.α = log(sqrt(α * α + β * β));
            this.x = 0;
            this.y = 0;
            this.β = atan2(β, α);
            return this;
        };
        Geometric2.prototype.magnitude = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Geometric2.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Geometric2.prototype.mul = function (m) {
            return this.mul2(this, m);
        };
        Geometric2.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.neg = function () {
            this.α = -this.α;
            this.x = -this.x;
            this.y = -this.y;
            this.β = -this.β;
            return this;
        };
        Geometric2.prototype.norm = function () {
            this.α = this.magnitudeSansUnits();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        Geometric2.prototype.one = function () {
            this.α = 1;
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        Geometric2.prototype.pow = function (M) {
            throw new Error(notImplemented_1.default('pow').message);
        };
        Geometric2.prototype.quad = function () {
            this.α = this.squaredNormSansUnits();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        Geometric2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var α = b2_1.default(t, this.α, controlPoint.α, endPoint.α);
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var β = b2_1.default(t, this.β, controlPoint.β, endPoint.β);
            this.α = α;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        Geometric2.prototype.rco = function (m) {
            return this.rco2(this, m);
        };
        Geometric2.prototype.rco2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.reflect = function (n) {
            mustBeObject_1.default('n', n);
            var N = G2_1.default.fromVectorE2(n);
            var M = G2_1.default.copy(this);
            var R = N.mul(M).mul(N).scale(-1);
            this.copy(R);
            return this;
        };
        Geometric2.prototype.rev = function () {
            this.α = this.α;
            this.x = this.x;
            this.y = this.y;
            this.β = -this.β;
            return this;
        };
        Geometric2.prototype.sin = function () {
            throw new Error(notImplemented_1.default('sin').message);
        };
        Geometric2.prototype.sinh = function () {
            throw new Error(notImplemented_1.default('sinh').message);
        };
        Geometric2.prototype.rotate = function (R) {
            mustBeObject_1.default('R', R);
            var x = this.x;
            var y = this.y;
            var β = R.β;
            var α = R.α;
            var ix = α * x + β * y;
            var iy = α * y - β * x;
            this.x = ix * α + iy * β;
            this.y = iy * α - ix * β;
            return this;
        };
        Geometric2.prototype.rotorFromDirections = function (a, b) {
            rotorFromDirectionsE2_1.default(a, b, this);
            return this;
        };
        Geometric2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            mustBeObject_1.default('B', B);
            mustBeNumber_1.default('θ', θ);
            var β = B.β;
            var φ = θ / 2;
            this.α = cos(abs(β) * φ);
            this.x = 0;
            this.y = 0;
            this.β = -sin(β * φ);
            return this;
        };
        Geometric2.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        Geometric2.prototype.scp2 = function (a, b) {
            this.α = scpE2_1.default(a.α, a.x, a.y, a.β, b.α, b.x, b.y, b.β, 0);
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        Geometric2.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.α *= α;
            this.x *= α;
            this.y *= α;
            this.β *= α;
            return this;
        };
        Geometric2.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        Geometric2.prototype.stress = function (σ) {
            throw new Error(notSupported_1.default('stress').message);
        };
        Geometric2.prototype.versor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.α = dotVectorE2_1.default(a, b);
            this.x = 0;
            this.y = 0;
            this.β = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
            return this;
        };
        Geometric2.prototype.squaredNorm = function () {
            return this.squaredNormSansUnits();
        };
        Geometric2.prototype.squaredNormSansUnits = function () {
            var w = this.α;
            var x = this.x;
            var y = this.y;
            var B = this.β;
            return w * w + x * x + y * y + B * B;
        };
        Geometric2.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('M', M);
            mustBeNumber_1.default('α', α);
            this.α -= M.α * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.β -= M.β * α;
            return this;
        };
        Geometric2.prototype.sub2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.α = a.α - b.α;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.β = a.β - b.β;
            return this;
        };
        Geometric2.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
        };
        Geometric2.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
        };
        Geometric2.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
        };
        Geometric2.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
        };
        Geometric2.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.x = 0;
                        this.y = 0;
                        this.β = 0;
                    }
                    break;
                case 1:
                    {
                        this.α = 0;
                        this.β = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                        this.x = 0;
                        this.y = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.x = 0;
                    this.y = 0;
                    this.β = 0;
                }
            }
            return this;
        };
        Geometric2.prototype.zero = function () {
            this.α = 0;
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        Geometric2.prototype.__add__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return Geometric2.copy(this).add(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric2.scalar(rhs).add(this);
            }
            else {
                var rhsCopy = duckCopy(rhs);
                if (rhsCopy) {
                    return rhsCopy.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        Geometric2.prototype.__div__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return Geometric2.copy(this).div(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric2.copy(this).divByScalar(rhs);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return Geometric2.copy(lhs).div(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric2.scalar(lhs).div(this);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return Geometric2.copy(this).mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric2.copy(this).scale(rhs);
            }
            else {
                var rhsCopy = duckCopy(rhs);
                if (rhsCopy) {
                    return this.__mul__(rhsCopy);
                }
                else {
                    return void 0;
                }
            }
        };
        Geometric2.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return Geometric2.copy(lhs).mul(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric2.copy(this).scale(lhs);
            }
            else {
                var lhsCopy = duckCopy(lhs);
                if (lhsCopy) {
                    return lhsCopy.mul(this);
                }
                else {
                    return void 0;
                }
            }
        };
        Geometric2.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return Geometric2.copy(lhs).add(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric2.scalar(lhs).add(this);
            }
            else {
                var lhsCopy = duckCopy(lhs);
                if (lhsCopy) {
                    return lhsCopy.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        Geometric2.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return Geometric2.copy(this).sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric2.scalar(-rhs).add(this);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return Geometric2.copy(lhs).sub(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric2.scalar(lhs).sub(this);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return Geometric2.copy(this).ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric2.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return Geometric2.copy(lhs).ext(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric2.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return Geometric2.copy(this).lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric2.copy(this).lco(Geometric2.scalar(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return Geometric2.copy(lhs).lco(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric2.scalar(lhs).lco(this);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return Geometric2.copy(this).rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric2.copy(this).rco(Geometric2.scalar(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return Geometric2.copy(lhs).rco(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric2.scalar(lhs).rco(this);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return Geometric2.copy(this).scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return Geometric2.copy(this).scp(Geometric2.scalar(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return Geometric2.copy(lhs).scp(this);
            }
            else if (typeof lhs === 'number') {
                return Geometric2.scalar(lhs).scp(this);
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__bang__ = function () {
            return Geometric2.copy(this).inv();
        };
        Geometric2.prototype.__tilde__ = function () {
            return Geometric2.copy(this).rev();
        };
        Geometric2.prototype.__pos__ = function () {
            return Geometric2.copy(this);
        };
        Geometric2.prototype.__neg__ = function () {
            return Geometric2.copy(this).neg();
        };
        Geometric2.copy = function (M) {
            var copy = new Geometric2();
            copy.α = M.α;
            copy.x = M.x;
            copy.y = M.y;
            copy.β = M.β;
            return copy;
        };
        Geometric2.e1 = function () {
            return Geometric2.vector(1, 0);
        };
        Geometric2.e2 = function () {
            return Geometric2.vector(0, 1);
        };
        Geometric2.fromCartesian = function (α, x, y, β) {
            var m = new Geometric2();
            m.α = α;
            m.x = x;
            m.y = y;
            m.β = β;
            return m;
        };
        Geometric2.fromSpinor = function (spinor) {
            return new Geometric2().copySpinor(spinor);
        };
        Geometric2.fromVector = function (vector) {
            if (isDefined_1.default(vector)) {
                return new Geometric2().copyVector(vector);
            }
            else {
                return void 0;
            }
        };
        Geometric2.I = function () {
            return Geometric2.pseudo(1);
        };
        Geometric2.lerp = function (A, B, α) {
            return Geometric2.copy(A).lerp(B, α);
        };
        Geometric2.one = function () {
            return Geometric2.scalar(1);
        };
        Geometric2.rotorFromDirections = function (a, b) {
            return new Geometric2().rotorFromDirections(a, b);
        };
        Geometric2.pseudo = function (β) {
            return Geometric2.fromCartesian(0, 0, 0, β);
        };
        Geometric2.scalar = function (α) {
            return Geometric2.fromCartesian(α, 0, 0, 0);
        };
        Geometric2.vector = function (x, y) {
            return Geometric2.fromCartesian(0, x, y, 0);
        };
        Geometric2.zero = function () {
            return Geometric2.scalar(0);
        };
        Geometric2.BASIS_LABELS = STANDARD_LABELS;
        Geometric2.BASIS_LABELS_COMPASS = COMPASS_LABELS;
        Geometric2.BASIS_LABELS_GEOMETRIC = ARROW_LABELS;
        Geometric2.BASIS_LABELS_STANDARD = STANDARD_LABELS;
        return Geometric2;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Geometric2;
});

define('davinci-eight/math/quadSpinorE2',["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined_1, isNumber_1) {
    function quadSpinorE2(s) {
        if (isDefined_1.default(s)) {
            var α = s.α;
            var β = s.β;
            if (isNumber_1.default(α) && isNumber_1.default(β)) {
                return α * α + β * β;
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadSpinorE2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Spinor2',["require", "exports", '../math/Coords', '../math/dotVectorCartesianE2', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../i18n/notSupported', '../math/quadSpinorE2', '../math/rotorFromDirectionsE2', '../math/wedgeXY'], function (require, exports, Coords_1, dotVectorCartesianE2_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, notSupported_1, quadSpinorE2_1, rotorFromDirectionsE2_1, wedgeXY_1) {
    var COORD_SCALAR = 1;
    var COORD_PSEUDO = 0;
    function one() {
        var coords = [0, 0];
        coords[COORD_SCALAR] = 1;
        coords[COORD_PSEUDO] = 0;
        return coords;
    }
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var log = Math.log;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var Spinor2 = (function (_super) {
        __extends(Spinor2, _super);
        function Spinor2(coordinates, modified) {
            if (coordinates === void 0) { coordinates = one(); }
            if (modified === void 0) { modified = false; }
            _super.call(this, coordinates, modified, 2);
        }
        Object.defineProperty(Spinor2.prototype, "xy", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (xy) {
                mustBeNumber_1.default('xy', xy);
                this.modified = this.modified || this.xy !== xy;
                this.coords[COORD_PSEUDO] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "alpha", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (alpha) {
                mustBeNumber_1.default('alpha', alpha);
                this.modified = this.modified || this.alpha !== alpha;
                this.coords[COORD_SCALAR] = alpha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "α", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (α) {
                mustBeNumber_1.default('α', α);
                this.modified = this.modified || this.α !== α;
                this.coords[COORD_SCALAR] = α;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "β", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (β) {
                mustBeNumber_1.default('β', β);
                this.modified = this.modified || this.β !== β;
                this.coords[COORD_PSEUDO] = β;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "beta", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (beta) {
                mustBeNumber_1.default('beta', beta);
                this.modified = this.modified || this.beta !== beta;
                this.coords[COORD_PSEUDO] = beta;
            },
            enumerable: true,
            configurable: true
        });
        Spinor2.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('spinor', spinor);
            mustBeNumber_1.default('α', α);
            this.xy += spinor.β * α;
            this.α += spinor.α * α;
            return this;
        };
        Spinor2.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.xy = a.β + b.β;
            return this;
        };
        Spinor2.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            return this;
        };
        Spinor2.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.α += α;
            return this;
        };
        Spinor2.prototype.adj = function () {
            throw new Error('TODO: Spinor2.adj');
        };
        Spinor2.prototype.angle = function () {
            return this.log().grade(2);
        };
        Spinor2.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Spinor2.prototype.clone = function () {
            var spinor = Spinor2.copy(this);
            spinor.modified = this.modified;
            return spinor;
        };
        Spinor2.prototype.conj = function () {
            this.xy = -this.xy;
            return this;
        };
        Spinor2.prototype.copy = function (spinor) {
            mustBeObject_1.default('spinor', spinor);
            this.xy = mustBeNumber_1.default('spinor.β', spinor.β);
            this.α = mustBeNumber_1.default('spinor.α', spinor.α);
            return this;
        };
        Spinor2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        Spinor2.prototype.copySpinor = function (spinor) {
            return this.copy(spinor);
        };
        Spinor2.prototype.copyVector = function (vector) {
            return this.zero();
        };
        Spinor2.prototype.cos = function () {
            throw new Error("Spinor2.cos");
        };
        Spinor2.prototype.cosh = function () {
            throw new Error("Spinor2.cosh");
        };
        Spinor2.prototype.div = function (s) {
            return this.div2(this, s);
        };
        Spinor2.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.β;
            var b0 = b.α;
            var b1 = b.β;
            var quadB = quadSpinorE2_1.default(b);
            this.α = (a0 * b0 + a1 * b1) / quadB;
            this.xy = (a1 * b0 - a0 * b1) / quadB;
            return this;
        };
        Spinor2.prototype.divByScalar = function (α) {
            this.xy /= α;
            this.α /= α;
            return this;
        };
        Spinor2.prototype.exp = function () {
            var α = this.α;
            var β = this.β;
            var expA = Math.exp(α);
            var φ = sqrt(β * β);
            var s = expA * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expA * cos(φ);
            this.β = β * s;
            return this;
        };
        Spinor2.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNormSansUnits());
            return this;
        };
        Spinor2.prototype.isOne = function () {
            return this.α === 1 && this.β === 0;
        };
        Spinor2.prototype.isZero = function () {
            return this.α === 0 && this.β === 0;
        };
        Spinor2.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        Spinor2.prototype.lco2 = function (a, b) {
            return this;
        };
        Spinor2.prototype.lerp = function (target, α) {
            var Vector2 = Spinor2.copy(target);
            var Vector1 = this.clone();
            var R = Vector2.mul(Vector1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        Spinor2.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        Spinor2.prototype.log = function () {
            var w = this.α;
            var z = this.xy;
            var bb = z * z;
            var Vector2 = sqrt(bb);
            var R0 = abs(w);
            var R = sqrt(w * w + bb);
            this.α = log(R);
            var f = atan2(Vector2, R0) / Vector2;
            this.xy = z * f;
            return this;
        };
        Spinor2.prototype.magnitude = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Spinor2.prototype.magnitudeSansUnits = function () {
            return sqrt(this.squaredNormSansUnits());
        };
        Spinor2.prototype.mul = function (s) {
            return this.mul2(this, s);
        };
        Spinor2.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.β;
            var b0 = b.α;
            var b1 = b.β;
            this.α = a0 * b0 - a1 * b1;
            this.xy = a0 * b1 + a1 * b0;
            return this;
        };
        Spinor2.prototype.neg = function () {
            this.α = -this.α;
            this.xy = -this.xy;
            return this;
        };
        Spinor2.prototype.norm = function () {
            var norm = this.magnitudeSansUnits();
            return this.zero().addScalar(norm);
        };
        Spinor2.prototype.normalize = function () {
            var modulus = this.magnitudeSansUnits();
            this.xy = this.xy / modulus;
            this.α = this.α / modulus;
            return this;
        };
        Spinor2.prototype.one = function () {
            this.α = 1;
            this.xy = 0;
            return this;
        };
        Spinor2.prototype.pow = function () {
            throw new Error("Spinor2.pow");
        };
        Spinor2.prototype.quad = function () {
            var squaredNorm = this.squaredNormSansUnits();
            return this.zero().addScalar(squaredNorm);
        };
        Spinor2.prototype.sin = function () {
            throw new Error("Spinor2.sin");
        };
        Spinor2.prototype.sinh = function () {
            throw new Error("Spinor2.sinh");
        };
        Spinor2.prototype.squaredNorm = function () {
            return this.squaredNormSansUnits();
        };
        Spinor2.prototype.squaredNormSansUnits = function () {
            return quadSpinorE2_1.default(this);
        };
        Spinor2.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        Spinor2.prototype.rco2 = function (a, b) {
            return this;
        };
        Spinor2.prototype.rev = function () {
            this.xy *= -1;
            return this;
        };
        Spinor2.prototype.reflect = function (n) {
            var w = this.α;
            var β = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nn = nx * nx + ny * ny;
            this.α = nn * w;
            this.xy = -nn * β;
            return this;
        };
        Spinor2.prototype.rotate = function (rotor) {
            console.warn("Spinor2.rotate is not implemented");
            return this;
        };
        Spinor2.prototype.rotorFromDirections = function (a, b) {
            rotorFromDirectionsE2_1.default(a, b, this);
            return this;
        };
        Spinor2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.xy = -B.β * s;
            this.α = cos(φ);
            return this;
        };
        Spinor2.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        Spinor2.prototype.scp2 = function (a, b) {
            return this;
        };
        Spinor2.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.xy *= α;
            this.α *= α;
            return this;
        };
        Spinor2.prototype.slerp = function (target, α) {
            var Vector2 = Spinor2.copy(target);
            var Vector1 = this.clone();
            var R = Vector2.mul(Vector1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        Spinor2.prototype.stress = function (σ) {
            throw new Error(notSupported_1.default('stress').message);
        };
        Spinor2.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('s', s);
            mustBeNumber_1.default('α', α);
            this.xy -= s.β * α;
            this.α -= s.α * α;
            return this;
        };
        Spinor2.prototype.sub2 = function (a, b) {
            this.xy = a.β - b.β;
            this.α = a.α - b.α;
            return this;
        };
        Spinor2.prototype.versor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.α = dotVectorCartesianE2_1.default(ax, ay, bx, by);
            this.xy = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
            return this;
        };
        Spinor2.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0:
                    {
                        this.xy = 0;
                    }
                    break;
                case 2:
                    {
                        this.α = 0;
                    }
                    break;
                default: {
                    this.α = 0;
                    this.xy = 0;
                }
            }
            return this;
        };
        Spinor2.prototype.toExponential = function (fractionDigits) {
            return this.toString();
        };
        Spinor2.prototype.toFixed = function (fractionDigits) {
            return this.toString();
        };
        Spinor2.prototype.toPrecision = function (precision) {
            return this.toString();
        };
        Spinor2.prototype.toString = function (radix) {
            return "Spinor2({β: " + this.xy + ", w: " + this.α + "})";
        };
        Spinor2.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        Spinor2.prototype.ext2 = function (a, b) {
            return this;
        };
        Spinor2.prototype.zero = function () {
            this.α = 0;
            this.xy = 0;
            return this;
        };
        Spinor2.copy = function (spinor) {
            return new Spinor2().copy(spinor);
        };
        Spinor2.lerp = function (a, b, α) {
            return Spinor2.copy(a).lerp(b, α);
        };
        Spinor2.one = function () {
            return Spinor2.zero().addScalar(1);
        };
        Spinor2.rotorFromDirections = function (a, b) {
            return new Spinor2().rotorFromDirections(a, b);
        };
        Spinor2.zero = function () {
            return new Spinor2([0, 0], false);
        };
        return Spinor2;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spinor2;
});

define('davinci-eight/facets/ModelE2',["require", "exports", '../math/Geometric2', '../math/Vector2', '../math/Spinor2'], function (require, exports, Geometric2_1, Vector2_1, Spinor2_1) {
    var ModelE2 = (function () {
        function ModelE2() {
            this._position = new Geometric2_1.default().zero();
            this._attitude = new Geometric2_1.default().zero().addScalar(1);
            this._posCache = new Vector2_1.default();
            this._attCache = new Spinor2_1.default();
            this._position.modified = true;
            this._attitude.modified = true;
        }
        Object.defineProperty(ModelE2.prototype, "R", {
            get: function () {
                return this._attitude;
            },
            set: function (attitude) {
                this._attitude.copy(attitude);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelE2.prototype, "X", {
            get: function () {
                return this._position;
            },
            set: function (position) {
                this._position.copy(position);
            },
            enumerable: true,
            configurable: true
        });
        ModelE2.prototype.getProperty = function (name) {
            switch (name) {
                case ModelE2.PROP_ATTITUDE: {
                    return this._attCache.copy(this._attitude).coords;
                }
                case ModelE2.PROP_POSITION: {
                    return this._posCache.copy(this._position).coords;
                }
                default: {
                    console.warn("ModelE2.getProperty " + name);
                    return void 0;
                }
            }
        };
        ModelE2.prototype.setProperty = function (name, data) {
            switch (name) {
                case ModelE2.PROP_ATTITUDE:
                    {
                        this._attCache.coords = data;
                        this._attitude.copySpinor(this._attCache);
                    }
                    break;
                case ModelE2.PROP_POSITION:
                    {
                        this._posCache.coords = data;
                        this._position.copyVector(this._posCache);
                    }
                    break;
                default: {
                    console.warn("ModelE2.setProperty " + name);
                }
            }
            return this;
        };
        ModelE2.PROP_ATTITUDE = 'R';
        ModelE2.PROP_POSITION = 'X';
        return ModelE2;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ModelE2;
});

define('davinci-eight/geometries/primitives/DrawAttribute',["require", "exports"], function (require, exports) {
    function isVectorN(values) {
        return true;
    }
    function checkValues(values) {
        if (!isVectorN(values)) {
            throw new Error("values must be a number[]");
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
    var DrawAttribute = (function () {
        function DrawAttribute(values, size) {
            this.values = checkValues(values);
            this.size = checkSize(size, values);
        }
        return DrawAttribute;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawAttribute;
});

define('davinci-eight/geometries/primitives/DrawPrimitive',["require", "exports", '../../checks/mustBeArray', '../../checks/mustBeInteger', '../../checks/mustBeObject'], function (require, exports, mustBeArray_1, mustBeInteger_1, mustBeObject_1) {
    var context = function () { return "DrawPrimitive constructor"; };
    var DrawPrimitive = (function () {
        function DrawPrimitive(mode, indices, attributes) {
            this.attributes = {};
            this.mode = mustBeInteger_1.default('mode', mode, context);
            this.indices = mustBeArray_1.default('indices', indices, context);
            this.attributes = mustBeObject_1.default('attributes', attributes, context);
        }
        return DrawPrimitive;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawPrimitive;
});

define('davinci-eight/geometries/primitives/Vertex',["require", "exports", '../../math/Coords', '../../checks/mustBeGE', '../../checks/mustBeInteger'], function (require, exports, Coords_1, mustBeGE_1, mustBeInteger_1) {
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
        function Vertex(numCoordinates) {
            this.attributes = {};
            mustBeInteger_1.default('numCoordinates', numCoordinates);
            mustBeGE_1.default('numCoordinates', numCoordinates, 0);
            var data = [];
            for (var i = 0; i < numCoordinates; i++) {
                data.push(0);
            }
            this.coords = new Coords_1.default(data, false, numCoordinates);
        }
        Vertex.prototype.toString = function () {
            return stringifyVertex(this);
        };
        return Vertex;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vertex;
});

define('davinci-eight/geometries/Simplex',["require", "exports", '../checks/expectArg', '../checks/isInteger', './primitives/Vertex', '../math/VectorN'], function (require, exports, expectArg_1, isInteger_1, Vertex_1, VectorN_1) {
    function checkIntegerArg(name, n, min, max) {
        if (isInteger_1.default(n) && n >= min && n <= max) {
            return n;
        }
        expectArg_1.default(name, n).toSatisfy(false, name + " must be an integer in the range [" + min + "," + max + "]");
    }
    function checkCountArg(count) {
        return checkIntegerArg('count', count, 0, 7);
    }
    function concatReduce(a, b) {
        return a.concat(b);
    }
    function lerp(a, b, alpha, data) {
        if (data === void 0) { data = []; }
        expectArg_1.default('b', b).toSatisfy(a.length === b.length, "a must be the same length as b");
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
    function lerpVectorN(a, b, alpha) {
        return new VectorN_1.default(lerp(a.coords, b.coords, alpha));
    }
    var Simplex = (function () {
        function Simplex(k) {
            this.vertices = [];
            if (!isInteger_1.default(k)) {
                expectArg_1.default('k', k).toBeNumber();
            }
            var numVertices = k + 1;
            var numCoordinates = 0;
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex_1.default(numCoordinates));
            }
        }
        Object.defineProperty(Simplex.prototype, "k", {
            get: function () {
                return this.vertices.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        Simplex.indices = function (simplex) {
            return simplex.vertices.map(function (vertex) { return vertex.index; });
        };
        Simplex.boundaryMap = function (simplex) {
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.TRIANGLE) {
                var line01 = new Simplex(k - 1);
                line01.vertices[0].attributes = vertices[0].attributes;
                line01.vertices[1].attributes = vertices[1].attributes;
                var line12 = new Simplex(k - 1);
                line12.vertices[0].attributes = vertices[1].attributes;
                line12.vertices[1].attributes = vertices[2].attributes;
                var line20 = new Simplex(k - 1);
                line20.vertices[0].attributes = vertices[2].attributes;
                line20.vertices[1].attributes = vertices[0].attributes;
                return [line01, line12, line20];
            }
            else if (k === Simplex.LINE) {
                var point0 = new Simplex(k - 1);
                point0.vertices[0].attributes = simplex.vertices[0].attributes;
                var point1 = new Simplex(k - 1);
                point1.vertices[0].attributes = simplex.vertices[1].attributes;
                return [point0, point1];
            }
            else if (k === Simplex.POINT) {
                return [new Simplex(k - 1)];
            }
            else if (k === Simplex.EMPTY) {
                return [];
            }
            else {
                throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
            }
        };
        Simplex.subdivideMap = function (simplex) {
            expectArg_1.default('simplex', simplex).toBeObject();
            var divs = [];
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.TRIANGLE) {
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
            else if (k === Simplex.LINE) {
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
            else if (k === Simplex.POINT) {
                divs.push(simplex);
            }
            else if (k === Simplex.EMPTY) {
            }
            else {
                throw new Error(k + "-simplex is not supported");
            }
            return divs;
        };
        Simplex.boundary = function (simplices, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                simplices = simplices.map(Simplex.boundaryMap).reduce(concatReduce, []);
            }
            return simplices;
        };
        Simplex.subdivide = function (simplices, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                simplices = simplices.map(Simplex.subdivideMap).reduce(concatReduce, []);
            }
            return simplices;
        };
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
        Simplex.EMPTY = -1;
        Simplex.POINT = 0;
        Simplex.LINE = 1;
        Simplex.TRIANGLE = 2;
        Simplex.TETRAHEDRON = 3;
        Simplex.FIVE_CELL = 4;
        return Simplex;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Simplex;
});

define('davinci-eight/core/vertexArraysFromPrimitive',["require", "exports", './computeAttributes', './computePointers', './computeStride'], function (require, exports, computeAttributes_1, computePointers_1, computeStride_1) {
    function default_1(primitive, order) {
        var keys = order ? order : Object.keys(primitive.attributes);
        var that = {
            drawMode: primitive.mode,
            indices: primitive.indices,
            attributes: computeAttributes_1.default(primitive.attributes, keys),
            stride: computeStride_1.default(primitive.attributes, keys),
            pointers: computePointers_1.default(primitive.attributes, keys)
        };
        return that;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/geometries/PrimitivesBuilder',["require", "exports", '../math/Geometric3', '../core/GeometryElements', '../core/GeometryContainer', '../math/Vector3', '../core/vertexArraysFromPrimitive'], function (require, exports, Geometric3_1, GeometryElements_1, GeometryContainer_1, Vector3_1, vertexArraysFromPrimitive_1) {
    var PrimitivesBuilder = (function () {
        function PrimitivesBuilder() {
            this.stress = Vector3_1.default.vector(1, 1, 1);
            this.tilt = Geometric3_1.default.one();
            this.offset = Vector3_1.default.zero();
            this.transforms = [];
            this.useNormal = true;
            this.usePosition = true;
            this.useTextureCoord = false;
        }
        PrimitivesBuilder.prototype.applyTransforms = function (vertex, i, j, iLength, jLength) {
            var tLen = this.transforms.length;
            for (var t = 0; t < tLen; t++) {
                this.transforms[t].exec(vertex, i, j, iLength, jLength);
            }
        };
        PrimitivesBuilder.prototype.toGeometry = function (engine) {
            var container = new GeometryContainer_1.default(this.tilt);
            var ps = this.toPrimitives();
            var iLen = ps.length;
            for (var i = 0; i < iLen; i++) {
                var dataSource = ps[i];
                var geometry = new GeometryElements_1.default(vertexArraysFromPrimitive_1.default(dataSource), engine);
                container.addPart(geometry);
                geometry.release();
            }
            return container;
        };
        PrimitivesBuilder.prototype.toVertexArrays = function () {
            var arrays = [];
            var ps = this.toPrimitives();
            var iLen = ps.length;
            for (var i = 0; i < iLen; i++) {
                arrays.push(vertexArraysFromPrimitive_1.default(ps[i]));
            }
            return arrays;
        };
        PrimitivesBuilder.prototype.toPrimitives = function () {
            console.warn("toPrimitives() must be implemented by derived classes.");
            return [];
        };
        return PrimitivesBuilder;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PrimitivesBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/AxialPrimitivesBuilder',["require", "exports", '../geometries/PrimitivesBuilder'], function (require, exports, PrimitivesBuilder_1) {
    var AxialPrimitivesBuilder = (function (_super) {
        __extends(AxialPrimitivesBuilder, _super);
        function AxialPrimitivesBuilder() {
            _super.call(this);
            this.sliceAngle = 2 * Math.PI;
        }
        return AxialPrimitivesBuilder;
    })(PrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AxialPrimitivesBuilder;
});

define('davinci-eight/geometries/transforms/Approximation',["require", "exports", '../../checks/mustBeNumber', '../../math/Coords', '../../math/Geometric2', '../../math/Geometric3', '../../math/Spinor2', '../../math/Spinor3', '../../math/Vector2', '../../math/Vector3'], function (require, exports, mustBeNumber_1, Coords_1, Geometric2_1, Geometric3_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1) {
    var Approximation = (function () {
        function Approximation(n, names) {
            this.n = mustBeNumber_1.default('n', n);
            this.names = names;
        }
        Approximation.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var nLength = this.names.length;
            for (var k = 0; k < nLength; k++) {
                var aName = this.names[k];
                var v = vertex.attributes[aName];
                if (v instanceof Coords_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Vector3_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Spinor3_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Vector2_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Spinor2_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Geometric2_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Geometric3_1.default) {
                    v.approx(this.n);
                }
                else {
                    throw new Error("Expecting " + aName + " to be a Coords");
                }
            }
        };
        return Approximation;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Approximation;
});

define('davinci-eight/geometries/transforms/Direction',["require", "exports", '../../checks/mustBeString', '../../math/Geometric2', '../../math/Geometric3', '../../math/Spinor2', '../../math/Spinor3', '../../math/Vector2', '../../math/Vector3'], function (require, exports, mustBeString_1, Geometric2_1, Geometric3_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1) {
    var Direction = (function () {
        function Direction(sourceName) {
            this.sourceName = mustBeString_1.default('sourceName', sourceName);
        }
        Direction.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var v = vertex.attributes[this.sourceName];
            if (v) {
                if (v instanceof Vector3_1.default) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else if (v instanceof Spinor3_1.default) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else if (v instanceof Vector2_1.default) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else if (v instanceof Spinor2_1.default) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else if (v instanceof Geometric3_1.default) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else if (v instanceof Geometric2_1.default) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else {
                    throw new Error("Expecting " + this.sourceName + " to be a Vector, Spinor, or Geometric");
                }
            }
            else {
                throw new Error("Vertex attribute " + this.sourceName + " was not found");
            }
        };
        return Direction;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Direction;
});

define('davinci-eight/geometries/transforms/Duality',["require", "exports", '../../checks/mustBeBoolean', '../../checks/mustBeString', '../../i18n/notImplemented', '../../math/Spinor2', '../../math/Spinor3', '../../math/Vector2', '../../math/Vector3'], function (require, exports, mustBeBoolean_1, mustBeString_1, notImplemented_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1) {
    var Duality = (function () {
        function Duality(sourceName, outputName, changeSign, removeSource) {
            this.sourceName = mustBeString_1.default('sourceName', sourceName);
            this.outputName = mustBeString_1.default('outputName', outputName);
            this.changeSign = mustBeBoolean_1.default('changeSign', changeSign);
            this.removeSource = mustBeBoolean_1.default('removeSource', removeSource);
        }
        Duality.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var v = vertex.attributes[this.sourceName];
            if (v) {
                if (v instanceof Vector3_1.default) {
                    var spinor = Spinor3_1.default.dual(v, this.changeSign);
                    vertex.attributes[this.outputName] = spinor;
                }
                else if (v instanceof Spinor3_1.default) {
                    var vector = Vector3_1.default.dual(v, this.changeSign);
                    vertex.attributes[this.outputName] = vector;
                }
                else if (v instanceof Vector2_1.default) {
                    throw new Error(notImplemented_1.default('dual(vector: Vector2)').message);
                }
                else if (v instanceof Spinor2_1.default) {
                    throw new Error(notImplemented_1.default('dual(spinor: Spinor2)').message);
                }
                else {
                    throw new Error("Expecting " + this.sourceName + " to be a Vector3 or Spinor");
                }
                if (this.removeSource) {
                    delete vertex.attributes[this.sourceName];
                }
            }
            else {
                throw new Error("Vertex attribute " + this.sourceName + " was not found");
            }
        };
        return Duality;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Duality;
});

define('davinci-eight/geometries/dataFromVectorN',["require", "exports", '../math/Geometric2', '../math/Geometric3', '../math/Vector2', '../math/Vector3'], function (require, exports, Geometric2_1, Geometric3_1, Vector2_1, Vector3_1) {
    function dataFromVectorN(source) {
        if (source instanceof Geometric3_1.default) {
            var g3 = source;
            return [g3.x, g3.y, g3.z];
        }
        else if (source instanceof Geometric2_1.default) {
            var g2 = source;
            return [g2.x, g2.y];
        }
        else if (source instanceof Vector3_1.default) {
            var v3 = source;
            return [v3.x, v3.y, v3.z];
        }
        else if (source instanceof Vector2_1.default) {
            var v2 = source;
            return [v2.x, v2.y];
        }
        else {
            return source.coords;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dataFromVectorN;
});

define('davinci-eight/geometries/primitives/GeometryPrimitive',["require", "exports", './DrawAttribute', './DrawPrimitive', '../../checks/mustBeArray', '../../checks/mustBeGE', '../../checks/mustBeInteger', '../../i18n/notSupported', '../../core/vertexArraysFromPrimitive', './Vertex', '../dataFromVectorN'], function (require, exports, DrawAttribute_1, DrawPrimitive_1, mustBeArray_1, mustBeGE_1, mustBeInteger_1, notSupported_1, vertexArraysFromPrimitive_1, Vertex_1, dataFromVectorN_1) {
    function attributes(unused, vertices) {
        var attribs = {};
        var iLen = vertices.length;
        for (var i = 0; i < iLen; i++) {
            var vertex = vertices[i];
            var names = Object.keys(vertex.attributes);
            var jLen = names.length;
            for (var j = 0; j < jLen; j++) {
                var name_1 = names[j];
                var data = dataFromVectorN_1.default(vertex.attributes[name_1]);
                var size = data.length;
                var attrib = attribs[name_1];
                if (!attrib) {
                    attrib = attribs[name_1] = new DrawAttribute_1.default([], size);
                }
                for (var k = 0; k < size; k++) {
                    attrib.values.push(data[k]);
                }
            }
        }
        return attribs;
    }
    var GeometryPrimitive = (function () {
        function GeometryPrimitive(mode, numVertices, numCoordinates) {
            this.mode = mustBeInteger_1.default('mode', mode);
            mustBeInteger_1.default('numVertices', numVertices);
            mustBeGE_1.default('numVertices', numVertices, 0);
            mustBeInteger_1.default('numCoordinates', numCoordinates);
            mustBeGE_1.default('numCoordinates', numCoordinates, 0);
            this.vertices = [];
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex_1.default(numCoordinates));
            }
        }
        GeometryPrimitive.prototype.vertexTransform = function (transform) {
            throw new Error(notSupported_1.default('vertexTransform').message);
        };
        GeometryPrimitive.prototype.toPrimitive = function () {
            var context = function () { return 'toPrimitive'; };
            mustBeArray_1.default('elements', this.elements, context);
            return new DrawPrimitive_1.default(this.mode, this.elements, attributes(this.elements, this.vertices));
        };
        GeometryPrimitive.prototype.toVertexArrays = function (names) {
            return vertexArraysFromPrimitive_1.default(this.toPrimitive(), names);
        };
        return GeometryPrimitive;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryPrimitive;
});

define('davinci-eight/geometries/primitives/numPostsForFence',["require", "exports", '../../checks/mustBeBoolean', '../../checks/mustBeGE', '../../checks/mustBeInteger'], function (require, exports, mustBeBoolean_1, mustBeGE_1, mustBeInteger_1) {
    function default_1(segmentCount, closed) {
        mustBeInteger_1.default('segmentCount', segmentCount);
        mustBeGE_1.default('segmentCount', segmentCount, 0);
        mustBeBoolean_1.default('closed', closed);
        return closed ? segmentCount : segmentCount + 1;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/geometries/primitives/numVerticesForGrid',["require", "exports", '../../checks/mustBeInteger'], function (require, exports, mustBeInteger_1) {
    function default_1(uSegments, vSegments) {
        mustBeInteger_1.default('uSegments', uSegments);
        mustBeInteger_1.default('vSegments', vSegments);
        return (uSegments + 1) * (vSegments + 1);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/primitives/GridPrimitive',["require", "exports", './GeometryPrimitive', './numPostsForFence', './numVerticesForGrid', '../../i18n/notSupported', '../../i18n/readOnly'], function (require, exports, GeometryPrimitive_1, numPostsForFence_1, numVerticesForGrid_1, notSupported_1, readOnly_1) {
    var GridPrimitive = (function (_super) {
        __extends(GridPrimitive, _super);
        function GridPrimitive(mode, uSegments, vSegments) {
            _super.call(this, mode, numVerticesForGrid_1.default(uSegments, vSegments), 2);
            this._uClosed = false;
            this._vClosed = false;
            this._uSegments = uSegments;
            this._vSegments = vSegments;
        }
        Object.defineProperty(GridPrimitive.prototype, "uSegments", {
            get: function () {
                return this._uSegments;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridPrimitive.prototype, "uLength", {
            get: function () {
                return numPostsForFence_1.default(this._uSegments, this._uClosed);
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uLength').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridPrimitive.prototype, "vSegments", {
            get: function () {
                return this._vSegments;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('vSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridPrimitive.prototype, "vLength", {
            get: function () {
                return numPostsForFence_1.default(this._vSegments, this._vClosed);
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('vLength').message);
            },
            enumerable: true,
            configurable: true
        });
        GridPrimitive.prototype.vertexTransform = function (transform) {
            var iLen = this.vertices.length;
            for (var i = 0; i < iLen; i++) {
                var vertex = this.vertices[i];
                var u = vertex.coords.getComponent(0);
                var v = vertex.coords.getComponent(1);
                transform.exec(vertex, u, v, this.uLength, this.vLength);
            }
        };
        GridPrimitive.prototype.vertex = function (i, j) {
            throw new Error(notSupported_1.default('vertex').message);
        };
        return GridPrimitive;
    })(GeometryPrimitive_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridPrimitive;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/primitives/GridTriangleStrip',["require", "exports", '../../core/DrawMode', '../../checks/isDefined', './GridPrimitive', '../../checks/mustBeArray', '../../checks/mustBeInteger', './numPostsForFence'], function (require, exports, DrawMode_1, isDefined_1, GridPrimitive_1, mustBeArray_1, mustBeInteger_1, numPostsForFence_1) {
    function triangleStripForGrid(uSegments, vSegments, elements) {
        elements = isDefined_1.default(elements) ? mustBeArray_1.default('elements', elements) : [];
        var uLength = numPostsForFence_1.default(uSegments, false);
        var lastVertex = uSegments + uLength * vSegments;
        var eSimple = 2 * uLength * vSegments;
        var j = 0;
        for (var i = 1; i <= eSimple; i += 2) {
            elements[j] = (i - 1) / 2;
            elements[j + 1] = elements[j] + uLength;
            if (elements[j + 1] % uLength === uSegments) {
                if (elements[j + 1] !== uSegments && elements[j + 1] !== lastVertex) {
                    elements[j + 2] = elements[j + 1];
                    elements[j + 3] = (1 + i) / 2;
                    j += 2;
                }
            }
            j += 2;
        }
        return elements;
    }
    var GridTriangleStrip = (function (_super) {
        __extends(GridTriangleStrip, _super);
        function GridTriangleStrip(uSegments, vSegments) {
            _super.call(this, DrawMode_1.default.TRIANGLE_STRIP, uSegments, vSegments);
            this.elements = triangleStripForGrid(uSegments, vSegments);
        }
        GridTriangleStrip.prototype.vertex = function (uIndex, vIndex) {
            mustBeInteger_1.default('uIndex', uIndex);
            mustBeInteger_1.default('vIndex', vIndex);
            return this.vertices[(this.vSegments - vIndex) * this.uLength + uIndex];
        };
        return GridTriangleStrip;
    })(GridPrimitive_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridTriangleStrip;
});

define('davinci-eight/geometries/transforms/ConeTransform',["require", "exports", '../../checks/mustBeBoolean', '../../checks/mustBeNumber', '../../checks/mustBeString', '../../math/R3', '../../math/Spinor3', '../../math/Vector3'], function (require, exports, mustBeBoolean_1, mustBeNumber_1, mustBeString_1, R3_1, Spinor3_1, Vector3_1) {
    function coneNormal(ρ, h, out) {
        out.copy(ρ);
        var ρ2 = out.squaredNorm();
        out.add(h, ρ2).divByScalar(Math.sqrt(ρ2) * Math.sqrt(1 + ρ2));
    }
    var ConeTransform = (function () {
        function ConeTransform(e, cutLine, clockwise, sliceAngle, aPosition, aTangent) {
            this.e = R3_1.default.direction(e);
            this.cutLine = R3_1.default.direction(cutLine);
            this.b = new Vector3_1.default().cross2(e, cutLine).normalize();
            this.clockwise = mustBeBoolean_1.default('clockwise', clockwise);
            this.sliceAngle = mustBeNumber_1.default('sliceAngle', sliceAngle);
            this.aPosition = mustBeString_1.default('aPosition', aPosition);
            this.aTangent = mustBeString_1.default('aTangent', aTangent);
        }
        ConeTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var uSegments = iLength - 1;
            var u = i / uSegments;
            var vSegments = jLength - 1;
            var v = j / vSegments;
            var sign = this.clockwise ? -1 : +1;
            var θ = sign * this.sliceAngle * u;
            var cosθ = Math.cos(θ);
            var sinθ = Math.sin(θ);
            var ρ = new Vector3_1.default().add(this.cutLine, cosθ).add(this.b, sinθ);
            var x = Vector3_1.default.lerp(ρ, this.e, v);
            vertex.attributes[this.aPosition] = x;
            var normal = Vector3_1.default.zero();
            coneNormal(ρ, this.e, normal);
            vertex.attributes[this.aTangent] = Spinor3_1.default.dual(normal, false);
        };
        return ConeTransform;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConeTransform;
});

define('davinci-eight/geometries/transforms/Rotation',["require", "exports", '../../checks/mustBeObject', '../../math/Spinor3', '../../math/Vector3'], function (require, exports, mustBeObject_1, Spinor3_1, Vector3_1) {
    var Rotation = (function () {
        function Rotation(R, names) {
            this.R = Spinor3_1.default.copy(mustBeObject_1.default('R', R));
            this.names = names;
        }
        Rotation.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var nLength = this.names.length;
            for (var k = 0; k < nLength; k++) {
                var aName = this.names[k];
                var v = vertex.attributes[aName];
                if (v.length === 3) {
                    var vector = Vector3_1.default.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                    vector.rotate(this.R);
                    vertex.attributes[aName] = vector;
                }
                else if (v.length === 4) {
                    var spinor = Spinor3_1.default.spinor(v.getComponent(0), v.getComponent(1), v.getComponent(2), v.getComponent(3));
                    spinor.rotate(this.R);
                    vertex.attributes[aName] = spinor;
                }
                else {
                    throw new Error("Expecting " + aName + " to be a vector with 3 coordinates");
                }
            }
        };
        return Rotation;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Rotation;
});

define('davinci-eight/geometries/transforms/Scaling',["require", "exports", '../../checks/mustBeObject', '../../math/Spinor3', '../../math/Vector3'], function (require, exports, mustBeObject_1, Spinor3_1, Vector3_1) {
    var Scaling = (function () {
        function Scaling(stress, names) {
            this.stress = Vector3_1.default.copy(mustBeObject_1.default('stress', stress));
            this.names = names;
        }
        Scaling.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var nLength = this.names.length;
            for (var k = 0; k < nLength; k++) {
                var aName = this.names[k];
                var v = vertex.attributes[aName];
                if (v.length === 3) {
                    var vector = Vector3_1.default.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                    vector.stress(this.stress);
                    vertex.attributes[aName] = vector;
                }
                else if (v.length === 4) {
                    var spinor = Spinor3_1.default.spinor(v.getComponent(0), v.getComponent(1), v.getComponent(2), v.getComponent(3));
                    spinor.stress(this.stress);
                    vertex.attributes[aName] = spinor;
                }
                else {
                    throw new Error("Expecting " + aName + " to be a vector with 3 coordinates");
                }
            }
        };
        return Scaling;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scaling;
});

define('davinci-eight/geometries/transforms/Translation',["require", "exports", '../../checks/mustBeObject', '../../math/Vector3'], function (require, exports, mustBeObject_1, Vector3_1) {
    var Translation = (function () {
        function Translation(s, names) {
            this.s = Vector3_1.default.copy(mustBeObject_1.default('s', s));
            this.names = names;
        }
        Translation.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var nLength = this.names.length;
            for (var k = 0; k < nLength; k++) {
                var aName = this.names[k];
                var v = vertex.attributes[aName];
                if (v.length === 3) {
                    var vector = Vector3_1.default.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                    vector.add(this.s);
                    vertex.attributes[aName] = vector;
                }
                else {
                    throw new Error("Expecting " + aName + " to be a vector with 3 coordinates");
                }
            }
        };
        return Translation;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Translation;
});

define('davinci-eight/geometries/transforms/CoordsTransform2D',["require", "exports", '../../core/GraphicsProgramSymbols', '../../checks/mustBeBoolean', '../../math/Vector2'], function (require, exports, GraphicsProgramSymbols_1, mustBeBoolean_1, Vector2_1) {
    var CoordsTransform2D = (function () {
        function CoordsTransform2D(flipU, flipV, exchangeUV) {
            this.flipU = mustBeBoolean_1.default('flipU', flipU);
            this.flipV = mustBeBoolean_1.default('flipV', flipV);
            this.exchageUV = mustBeBoolean_1.default('exchangeUV', exchangeUV);
        }
        CoordsTransform2D.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var u = i / (iLength - 1);
            var v = j / (jLength - 1);
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = new Vector2_1.default([u, v]);
        };
        return CoordsTransform2D;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CoordsTransform2D;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/ConicalShellBuilder',["require", "exports", './transforms/Approximation', './transforms/Direction', './transforms/Duality', '../core/GraphicsProgramSymbols', './primitives/GridTriangleStrip', './AxialPrimitivesBuilder', './transforms/ConeTransform', './transforms/Rotation', '../math/R3', './transforms/Scaling', './transforms/Translation', './transforms/CoordsTransform2D'], function (require, exports, Approximation_1, Direction_1, Duality_1, GraphicsProgramSymbols_1, GridTriangleStrip_1, AxialPrimitivesBuilder_1, ConeTransform_1, Rotation_1, R3_1, Scaling_1, Translation_1, CoordsTransform2D_1) {
    var aPosition = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION;
    var aTangent = GraphicsProgramSymbols_1.default.ATTRIBUTE_TANGENT;
    var aNormal = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL;
    var ConicalShellBuilder = (function (_super) {
        __extends(ConicalShellBuilder, _super);
        function ConicalShellBuilder(e, cutLine, clockwise) {
            _super.call(this);
            this.radialSegments = 1;
            this.thetaSegments = 32;
            this.e = R3_1.default.direction(e);
            this.cutLine = R3_1.default.direction(cutLine);
            this.clockwise = clockwise;
        }
        Object.defineProperty(ConicalShellBuilder.prototype, "radius", {
            get: function () {
                return this.stress.x;
            },
            set: function (radius) {
                this.stress.x = radius;
                this.stress.z = radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConicalShellBuilder.prototype, "height", {
            get: function () {
                return this.stress.y;
            },
            set: function (height) {
                this.stress.y = height;
            },
            enumerable: true,
            configurable: true
        });
        ConicalShellBuilder.prototype.toPrimitives = function () {
            this.transforms.push(new ConeTransform_1.default(this.e, this.cutLine, this.clockwise, this.sliceAngle, aPosition, aTangent));
            this.transforms.push(new Scaling_1.default(this.stress, [aPosition, aTangent]));
            this.transforms.push(new Rotation_1.default(this.tilt, [aPosition, aTangent]));
            this.transforms.push(new Translation_1.default(this.offset, [aPosition]));
            this.transforms.push(new Duality_1.default(aTangent, aNormal, true, true));
            this.transforms.push(new Direction_1.default(aNormal));
            this.transforms.push(new Approximation_1.default(9, [aPosition, aNormal]));
            if (this.useTextureCoord) {
                this.transforms.push(new CoordsTransform2D_1.default(false, false, false));
            }
            var grid = new GridTriangleStrip_1.default(this.thetaSegments, this.radialSegments);
            var iLength = grid.uLength;
            for (var i = 0; i < iLength; i++) {
                var jLength = grid.vLength;
                for (var j = 0; j < jLength; j++) {
                    this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength);
                }
            }
            return [grid.toPrimitive()];
        };
        return ConicalShellBuilder;
    })(AxialPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConicalShellBuilder;
});

define('davinci-eight/geometries/transforms/CylinderTransform',["require", "exports", '../../checks/mustBeNumber', '../../checks/mustBeString', '../../math/Spinor3', '../../math/Vector3'], function (require, exports, mustBeNumber_1, mustBeString_1, Spinor3_1, Vector3_1) {
    var CylinderTransform = (function () {
        function CylinderTransform(e, cutLine, clockwise, sliceAngle, aPosition, aTangent) {
            this.e = Vector3_1.default.copy(e);
            this.cutLine = Vector3_1.default.copy(cutLine);
            this.generator = Spinor3_1.default.dual(e, clockwise);
            this.sliceAngle = mustBeNumber_1.default('sliceAngle', sliceAngle);
            this.aPosition = mustBeString_1.default('aPosition', aPosition);
            this.aTangent = mustBeString_1.default('aTangent', aTangent);
        }
        CylinderTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var uSegments = iLength - 1;
            var u = i / uSegments;
            var vSegments = jLength - 1;
            var v = j / vSegments;
            var rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp();
            var ρ = Vector3_1.default.copy(this.cutLine).rotate(rotor);
            vertex.attributes[this.aPosition] = ρ.clone().add(this.e, v);
            vertex.attributes[this.aTangent] = Spinor3_1.default.dual(ρ, false);
        };
        return CylinderTransform;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderTransform;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CylindricalShellBuilder',["require", "exports", './transforms/Approximation', './transforms/Direction', './transforms/Duality', '../core/GraphicsProgramSymbols', './primitives/GridTriangleStrip', './AxialPrimitivesBuilder', './transforms/CylinderTransform', './transforms/Rotation', './transforms/Scaling', './transforms/Translation', './transforms/CoordsTransform2D', '../math/Vector3'], function (require, exports, Approximation_1, Direction_1, Duality_1, GraphicsProgramSymbols_1, GridTriangleStrip_1, AxialPrimitivesBuilder_1, CylinderTransform_1, Rotation_1, Scaling_1, Translation_1, CoordsTransform2D_1, Vector3_1) {
    var aPosition = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION;
    var aTangent = GraphicsProgramSymbols_1.default.ATTRIBUTE_TANGENT;
    var aNormal = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL;
    var CylindricalShellBuilder = (function (_super) {
        __extends(CylindricalShellBuilder, _super);
        function CylindricalShellBuilder(e, cutLine, clockwise) {
            _super.call(this);
            this.radialSegments = 1;
            this.thetaSegments = 32;
            this.e = Vector3_1.default.copy(e);
            this.cutLine = Vector3_1.default.copy(cutLine);
            this.clockwise = clockwise;
        }
        Object.defineProperty(CylindricalShellBuilder.prototype, "radius", {
            get: function () {
                return this.stress.x;
            },
            set: function (radius) {
                this.stress.x = radius;
                this.stress.z = radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylindricalShellBuilder.prototype, "height", {
            get: function () {
                return this.stress.y;
            },
            set: function (height) {
                this.stress.y = height;
            },
            enumerable: true,
            configurable: true
        });
        CylindricalShellBuilder.prototype.toPrimitives = function () {
            this.transforms.push(new CylinderTransform_1.default(this.e, this.cutLine, this.clockwise, this.sliceAngle, aPosition, aTangent));
            this.transforms.push(new Scaling_1.default(this.stress, [aPosition, aTangent]));
            this.transforms.push(new Rotation_1.default(this.tilt, [aPosition, aTangent]));
            this.transforms.push(new Translation_1.default(this.offset, [aPosition]));
            this.transforms.push(new Duality_1.default(aTangent, aNormal, true, true));
            this.transforms.push(new Direction_1.default(aNormal));
            this.transforms.push(new Approximation_1.default(9, [aPosition, aNormal]));
            if (this.useTextureCoord) {
                this.transforms.push(new CoordsTransform2D_1.default(false, false, false));
            }
            var grid = new GridTriangleStrip_1.default(this.thetaSegments, this.radialSegments);
            var iLength = grid.uLength;
            for (var i = 0; i < iLength; i++) {
                var jLength = grid.vLength;
                for (var j = 0; j < jLength; j++) {
                    this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength);
                }
            }
            var primitive = grid.toPrimitive();
            return [primitive];
        };
        return CylindricalShellBuilder;
    })(AxialPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylindricalShellBuilder;
});

define('davinci-eight/geometries/transforms/RingTransform',["require", "exports", '../../checks/mustBeNumber', '../../checks/mustBeString', '../../math/Spinor3', '../../math/Vector3'], function (require, exports, mustBeNumber_1, mustBeString_1, Spinor3_1, Vector3_1) {
    var RingTransform = (function () {
        function RingTransform(e, cutLine, clockwise, a, b, sliceAngle, aPosition, aTangent) {
            this.e = Vector3_1.default.copy(e);
            this.innerRadius = mustBeNumber_1.default('a', a);
            this.outerRadius = mustBeNumber_1.default('b', b);
            this.sliceAngle = mustBeNumber_1.default('sliceAngle', sliceAngle);
            this.generator = Spinor3_1.default.dual(e, clockwise);
            this.cutLine = Vector3_1.default.copy(cutLine).normalize();
            this.aPosition = mustBeString_1.default('aPosition', aPosition);
            this.aTangent = mustBeString_1.default('aTangent', aTangent);
        }
        RingTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var uSegments = iLength - 1;
            var u = i / uSegments;
            var vSegments = jLength - 1;
            var v = j / vSegments;
            var b = this.innerRadius;
            var a = this.outerRadius;
            var rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp();
            var position = Vector3_1.default.copy(this.cutLine).rotate(rotor).scale(b + (a - b) * v);
            var tangent = Spinor3_1.default.dual(this.e, false);
            vertex.attributes[this.aPosition] = position;
            vertex.attributes[this.aTangent] = tangent;
        };
        return RingTransform;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RingTransform;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/RingBuilder',["require", "exports", './transforms/Approximation', './transforms/Direction', './transforms/Duality', '../core/GraphicsProgramSymbols', './primitives/GridTriangleStrip', './AxialPrimitivesBuilder', './transforms/RingTransform', './transforms/Rotation', './transforms/Scaling', './transforms/Translation', './transforms/CoordsTransform2D', '../math/Vector3'], function (require, exports, Approximation_1, Direction_1, Duality_1, GraphicsProgramSymbols_1, GridTriangleStrip_1, AxialPrimitivesBuilder_1, RingTransform_1, Rotation_1, Scaling_1, Translation_1, CoordsTransform2D_1, Vector3_1) {
    var aPosition = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION;
    var aTangent = GraphicsProgramSymbols_1.default.ATTRIBUTE_TANGENT;
    var aNormal = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL;
    var RingBuilder = (function (_super) {
        __extends(RingBuilder, _super);
        function RingBuilder(e, cutLine, clockwise) {
            _super.call(this);
            this.innerRadius = 0;
            this.outerRadius = 1;
            this.radialSegments = 1;
            this.thetaSegments = 32;
            this.e = Vector3_1.default.copy(e);
            this.cutLine = Vector3_1.default.copy(cutLine);
            this.clockwise = clockwise;
        }
        RingBuilder.prototype.toPrimitives = function () {
            this.transforms.push(new RingTransform_1.default(this.e, this.cutLine, this.clockwise, this.outerRadius, this.innerRadius, this.sliceAngle, aPosition, aTangent));
            this.transforms.push(new Scaling_1.default(this.stress, [aPosition, aTangent]));
            this.transforms.push(new Rotation_1.default(this.tilt, [aPosition, aTangent]));
            this.transforms.push(new Translation_1.default(this.offset, [aPosition]));
            this.transforms.push(new Duality_1.default(aTangent, aNormal, true, true));
            this.transforms.push(new Direction_1.default(aNormal));
            this.transforms.push(new Approximation_1.default(9, [aPosition, aNormal]));
            if (this.useTextureCoord) {
                this.transforms.push(new CoordsTransform2D_1.default(false, false, false));
            }
            var grid = new GridTriangleStrip_1.default(this.thetaSegments, this.radialSegments);
            var iLength = grid.uLength;
            for (var i = 0; i < iLength; i++) {
                var jLength = grid.vLength;
                for (var j = 0; j < jLength; j++) {
                    this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength);
                }
            }
            return [grid.toPrimitive()];
        };
        return RingBuilder;
    })(AxialPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RingBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/ArrowBuilder',["require", "exports", './AxialPrimitivesBuilder', './ConicalShellBuilder', './CylindricalShellBuilder', '../checks/mustBeDefined', '../geometries/RingBuilder', '../math/R3', '../math/Vector3'], function (require, exports, AxialPrimitivesBuilder_1, ConicalShellBuilder_1, CylindricalShellBuilder_1, mustBeDefined_1, RingBuilder_1, R3_1, Vector3_1) {
    var ArrowBuilder = (function (_super) {
        __extends(ArrowBuilder, _super);
        function ArrowBuilder(axis, cutLine, clockwise) {
            _super.call(this);
            this.heightCone = 0.20;
            this.radiusCone = 0.08;
            this.radiusShaft = 0.01;
            this.thetaSegments = 16;
            mustBeDefined_1.default('axis', axis);
            mustBeDefined_1.default('cutLine', cutLine);
            this.e = R3_1.default.direction(axis);
            this.cutLine = R3_1.default.direction(cutLine);
            this.clockwise = clockwise;
        }
        ArrowBuilder.prototype.toPrimitives = function () {
            var heightShaft = 1 - this.heightCone;
            var back = this.e.neg();
            var neck = Vector3_1.default.copy(this.e).scale(heightShaft).add(this.offset);
            neck.rotate(this.tilt);
            var tail = Vector3_1.default.copy(this.offset);
            tail.rotate(this.tilt);
            var cone = new ConicalShellBuilder_1.default(this.e, this.cutLine, this.clockwise);
            cone.radius = this.radiusCone;
            cone.height = this.heightCone;
            cone.tilt.mul(this.tilt);
            cone.offset.copy(neck);
            cone.sliceAngle = this.sliceAngle;
            cone.thetaSegments = this.thetaSegments;
            cone.useNormal = this.useNormal;
            cone.usePosition = this.usePosition;
            cone.useTextureCoord = this.useTextureCoord;
            var disc = new RingBuilder_1.default(back, this.cutLine, !this.clockwise);
            disc.innerRadius = this.radiusShaft;
            disc.outerRadius = this.radiusCone;
            disc.tilt.mul(this.tilt);
            disc.offset.copy(neck);
            disc.sliceAngle = this.sliceAngle;
            disc.thetaSegments = this.thetaSegments;
            disc.useNormal = this.useNormal;
            disc.usePosition = this.usePosition;
            disc.useTextureCoord = this.useTextureCoord;
            var shaft = new CylindricalShellBuilder_1.default(this.e, this.cutLine, this.clockwise);
            shaft.radius = this.radiusShaft;
            shaft.height = heightShaft;
            shaft.tilt.mul(this.tilt);
            shaft.offset.copy(tail);
            shaft.sliceAngle = this.sliceAngle;
            shaft.thetaSegments = this.thetaSegments;
            shaft.useNormal = this.useNormal;
            shaft.usePosition = this.usePosition;
            shaft.useTextureCoord = this.useTextureCoord;
            var plug = new RingBuilder_1.default(back, this.cutLine, !this.clockwise);
            plug.innerRadius = 0;
            plug.outerRadius = this.radiusShaft;
            plug.tilt.mul(this.tilt);
            plug.offset.copy(tail);
            plug.sliceAngle = this.sliceAngle;
            plug.thetaSegments = this.thetaSegments;
            plug.useNormal = this.useNormal;
            plug.usePosition = this.usePosition;
            plug.useTextureCoord = this.useTextureCoord;
            return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce(function (a, b) { return a.concat(b); }, []);
        };
        return ArrowBuilder;
    })(AxialPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArrowBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/ArrowGeometry',["require", "exports", './ArrowBuilder', '../core/GeometryContainer', '../core/GeometryElements', '../base/incLevel', '../checks/isDefined', '../checks/mustBeObject', '../math/R3', '../math/Spinor3', '../math/Vector3', '../core/vertexArraysFromPrimitive'], function (require, exports, ArrowBuilder_1, GeometryContainer_1, GeometryElements_1, incLevel_1, isDefined_1, mustBeObject_1, R3_1, Spinor3_1, Vector3_1, vertexArraysFromPrimitive_1) {
    var ArrowGeometry = (function (_super) {
        __extends(ArrowGeometry, _super);
        function ArrowGeometry(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, options.tilt);
            this.setLoggingName('ArrowGeometry');
            mustBeObject_1.default('options', options);
            var builder = new ArrowBuilder_1.default(R3_1.default.e2, R3_1.default.e3, false);
            builder.stress.copy(isDefined_1.default(options.stress) ? options.stress : Vector3_1.default.vector(1, 1, 1));
            builder.tilt.copySpinor(isDefined_1.default(options.tilt) ? options.tilt : Spinor3_1.default.one());
            builder.offset.copy(isDefined_1.default(options.offset) ? options.offset : Vector3_1.default.zero());
            var ps = builder.toPrimitives();
            var iLen = ps.length;
            for (var i = 0; i < iLen; i++) {
                var dataSource = ps[i];
                var geometry = new GeometryElements_1.default(vertexArraysFromPrimitive_1.default(dataSource), options.engine);
                this.addPart(geometry);
                geometry.release();
            }
        }
        ArrowGeometry.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        ArrowGeometry.prototype.getPrincipalScale = function (name) {
            return this.scaling.getElement(0, 0);
        };
        ArrowGeometry.prototype.setPrincipalScale = function (name, value) {
            this.scaling.setElement(0, 0, value);
            this.scaling.setElement(1, 1, value);
            this.scaling.setElement(2, 2, value);
        };
        return ArrowGeometry;
    })(GeometryContainer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArrowGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CuboidPrimitivesBuilder',["require", "exports", '../math/G3', './primitives/GridTriangleStrip', './PrimitivesBuilder', '../core/GraphicsProgramSymbols', '../checks/mustBeNumber', '../math/Spinor3', '../math/Vector3', '../math/Vector2'], function (require, exports, G3_1, GridTriangleStrip_1, PrimitivesBuilder_1, GraphicsProgramSymbols_1, mustBeNumber_1, Spinor3_1, Vector3_1, Vector2_1) {
    function side(tilt, offset, basis, uSegments, vSegments) {
        var tangent = Spinor3_1.default.wedge(basis[0], basis[1]).rotate(tilt);
        var normal = Vector3_1.default.dual(tangent, true).normalize();
        var aNeg = Vector3_1.default.copy(basis[0]).scale(-0.5);
        var aPos = Vector3_1.default.copy(basis[0]).scale(+0.5);
        var bNeg = Vector3_1.default.copy(basis[1]).scale(-0.5);
        var bPos = Vector3_1.default.copy(basis[1]).scale(+0.5);
        var cPos = Vector3_1.default.copy(basis[2]).scale(+0.5);
        var side = new GridTriangleStrip_1.default(uSegments, vSegments);
        for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
            for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
                var u = uIndex / uSegments;
                var v = vIndex / vSegments;
                var a = Vector3_1.default.copy(aNeg).lerp(aPos, u);
                var b = Vector3_1.default.copy(bNeg).lerp(bPos, v);
                var vertex = side.vertex(uIndex, vIndex);
                var position = Vector3_1.default.copy(a).add(b).add(cPos);
                position.rotate(tilt);
                position.add(offset);
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position;
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = new Vector2_1.default([u, v]);
            }
        }
        return side;
    }
    var CuboidPrimitivesBuilder = (function (_super) {
        __extends(CuboidPrimitivesBuilder, _super);
        function CuboidPrimitivesBuilder() {
            _super.call(this);
            this.iSegments = 1;
            this.jSegments = 1;
            this.kSegments = 1;
            this.openBack = false;
            this.openBase = false;
            this.openFront = false;
            this.openLeft = false;
            this.openRight = false;
            this.openCap = false;
            this._a = Vector3_1.default.copy(G3_1.default.e1);
            this._b = Vector3_1.default.copy(G3_1.default.e2);
            this._c = Vector3_1.default.copy(G3_1.default.e3);
            this.sides = [];
        }
        Object.defineProperty(CuboidPrimitivesBuilder.prototype, "width", {
            get: function () {
                return this._a.magnitude();
            },
            set: function (width) {
                mustBeNumber_1.default('width', width);
                this._a.normalize().scale(width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidPrimitivesBuilder.prototype, "height", {
            get: function () {
                return this._b.magnitude();
            },
            set: function (height) {
                mustBeNumber_1.default('height', height);
                this._b.normalize().scale(height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidPrimitivesBuilder.prototype, "depth", {
            get: function () {
                return this._c.magnitude();
            },
            set: function (depth) {
                mustBeNumber_1.default('depth', depth);
                this._c.normalize().scale(depth);
            },
            enumerable: true,
            configurable: true
        });
        CuboidPrimitivesBuilder.prototype.regenerate = function () {
            this.sides = [];
            var t = this.tilt;
            var o = this.offset;
            if (!this.openFront) {
                this.sides.push(side(t, o, [this._a, this._b, this._c], this.iSegments, this.jSegments));
            }
            if (!this.openRight) {
                this.sides.push(side(t, o, [Vector3_1.default.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
            }
            if (!this.openLeft) {
                this.sides.push(side(t, o, [this._c, this._b, Vector3_1.default.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
            }
            if (!this.openBack) {
                this.sides.push(side(t, o, [Vector3_1.default.copy(this._a).scale(-1), this._b, Vector3_1.default.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
            }
            if (!this.openCap) {
                this.sides.push(side(t, o, [this._a, Vector3_1.default.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
            }
            if (!this.openBase) {
                this.sides.push(side(t, o, [this._a, this._c, Vector3_1.default.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
            }
        };
        CuboidPrimitivesBuilder.prototype.toPrimitives = function () {
            this.regenerate();
            return this.sides.map(function (side) { return side.toPrimitive(); });
        };
        return CuboidPrimitivesBuilder;
    })(PrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CuboidPrimitivesBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/BoxGeometry',["require", "exports", '../core/GeometryContainer', '../core/GeometryElements', '../base/incLevel', '../checks/isDefined', '../checks/mustBeBoolean', '../checks/mustBeNumber', '../i18n/notSupported', './CuboidPrimitivesBuilder', '../core/vertexArraysFromPrimitive'], function (require, exports, GeometryContainer_1, GeometryElements_1, incLevel_1, isDefined_1, mustBeBoolean_1, mustBeNumber_1, notSupported_1, CuboidPrimitivesBuilder_1, vertexArraysFromPrimitive_1) {
    var BoxGeometry = (function (_super) {
        __extends(BoxGeometry, _super);
        function BoxGeometry(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, options.tilt);
            this.w = 1;
            this.h = 1;
            this.d = 1;
            this.setLoggingName('BoxGeometry');
            var builder = new CuboidPrimitivesBuilder_1.default();
            builder.width = isDefined_1.default(options.width) ? mustBeNumber_1.default('width', options.width) : 1;
            builder.height = isDefined_1.default(options.height) ? mustBeNumber_1.default('height', options.height) : 1;
            builder.depth = isDefined_1.default(options.depth) ? mustBeNumber_1.default('depth', options.depth) : 1;
            if (isDefined_1.default(options.openBack)) {
                builder.openBack = mustBeBoolean_1.default('openBack', options.openBack);
            }
            if (isDefined_1.default(options.openBase)) {
                builder.openBase = mustBeBoolean_1.default('openBase', options.openBase);
            }
            if (isDefined_1.default(options.openFront)) {
                builder.openFront = mustBeBoolean_1.default('openFront', options.openFront);
            }
            if (isDefined_1.default(options.openLeft)) {
                builder.openLeft = mustBeBoolean_1.default('openLeft', options.openLeft);
            }
            if (isDefined_1.default(options.openRight)) {
                builder.openRight = mustBeBoolean_1.default('openRight', options.openRight);
            }
            if (isDefined_1.default(options.openCap)) {
                builder.openCap = mustBeBoolean_1.default('openCap', options.openCap);
            }
            if (options.tilt) {
                builder.tilt.copySpinor(options.tilt);
            }
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            var ps = builder.toPrimitives();
            var iLen = ps.length;
            for (var i = 0; i < iLen; i++) {
                var dataSource = ps[i];
                var geometry = new GeometryElements_1.default(vertexArraysFromPrimitive_1.default(dataSource), options.engine);
                this.addPart(geometry);
                geometry.release();
            }
        }
        BoxGeometry.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        BoxGeometry.prototype.getPrincipalScale = function (name) {
            switch (name) {
                case 'width': {
                    return this.w;
                }
                case 'height': {
                    return this.h;
                }
                case 'depth': {
                    return this.d;
                }
                default: {
                    throw new Error(notSupported_1.default("getPrincipalScale('" + name + "')").message);
                }
            }
        };
        BoxGeometry.prototype.setPrincipalScale = function (name, value) {
            switch (name) {
                case 'width':
                    {
                        this.w = value;
                    }
                    break;
                case 'height':
                    {
                        this.h = value;
                    }
                    break;
                case 'depth':
                    {
                        this.d = value;
                    }
                    break;
                default: {
                    throw new Error(notSupported_1.default("setPrincipalScale('" + name + "')").message);
                }
            }
            this.setScale(this.w, this.h, this.d);
        };
        return BoxGeometry;
    })(GeometryContainer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BoxGeometry;
});

define('davinci-eight/geometries/arc3',["require", "exports", '../checks/mustBeDefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../math/Spinor3', '../math/Vector3'], function (require, exports, mustBeDefined_1, mustBeInteger_1, mustBeNumber_1, Spinor3_1, Vector3_1) {
    function arc3(begin, angle, generator, segments) {
        mustBeDefined_1.default('begin', begin);
        mustBeNumber_1.default('angle', angle);
        mustBeDefined_1.default('generator', generator);
        mustBeInteger_1.default('segments', segments);
        var points = [];
        var point = Vector3_1.default.copy(begin);
        var rotor = Spinor3_1.default.copy(generator).scale((-angle / 2) / segments).exp();
        points.push(point.clone());
        for (var i = 0; i < segments; i++) {
            point.rotate(rotor);
            points.push(point.clone());
        }
        return points;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = arc3;
});

define('davinci-eight/collections/copyToArray',["require", "exports"], function (require, exports) {
    function copyToArray(source, destination, offset) {
        if (destination === void 0) { destination = []; }
        if (offset === void 0) { offset = 0; }
        var length = source.length;
        for (var i = 0; i < length; i++) {
            destination[offset + i] = source[i];
        }
        return destination;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = copyToArray;
});

define('davinci-eight/geometries/dataLength',["require", "exports", '../math/Geometric2', '../math/Geometric3', '../math/Vector2', '../math/Vector3'], function (require, exports, Geometric2_1, Geometric3_1, Vector2_1, Vector3_1) {
    function dataLength(source) {
        if (source instanceof Geometric3_1.default) {
            if (source.length !== 8) {
                throw new Error("source.length is expected to be 8");
            }
            return 3;
        }
        else if (source instanceof Geometric2_1.default) {
            if (source.length !== 4) {
                throw new Error("source.length is expected to be 4");
            }
            return 2;
        }
        else if (source instanceof Vector3_1.default) {
            if (source.length !== 3) {
                throw new Error("source.length is expected to be 3");
            }
            return 3;
        }
        else if (source instanceof Vector2_1.default) {
            if (source.length !== 2) {
                throw new Error("source.length is expected to be 2");
            }
            return 2;
        }
        else {
            return source.length;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dataLength;
});

define('davinci-eight/geometries/simplicesToGeometryMeta',["require", "exports", './dataLength', '../checks/expectArg', '../checks/isDefined', './Simplex'], function (require, exports, dataLength_1, expectArg_1, isDefined_1, Simplex_1) {
    function stringify(thing, space) {
        var cache = [];
        return JSON.stringify(thing, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        }, space);
    }
    function simplicesToGeometryMeta(geometry) {
        var kValueOfSimplex = void 0;
        var knowns = {};
        var geometryLen = geometry.length;
        for (var i = 0; i < geometryLen; i++) {
            var simplex = geometry[i];
            if (!(simplex instanceof Simplex_1.default)) {
                expectArg_1.default('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
            }
            var vertices = simplex.vertices;
            kValueOfSimplex = simplex.k;
            for (var j = 0, vsLen = vertices.length; j < vsLen; j++) {
                var vertex = vertices[j];
                var attributes = vertex.attributes;
                var keys = Object.keys(attributes);
                var keysLen = keys.length;
                for (var k = 0; k < keysLen; k++) {
                    var key = keys[k];
                    var value = attributes[key];
                    var dLength = dataLength_1.default(value);
                    var known = knowns[key];
                    if (known) {
                        if (known.size !== dLength) {
                            throw new Error("Something is rotten in Denmark!");
                        }
                    }
                    else {
                        knowns[key] = { size: dLength };
                    }
                }
            }
        }
        if (isDefined_1.default(kValueOfSimplex)) {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = simplicesToGeometryMeta;
});

define('davinci-eight/geometries/computeUniqueVertices',["require", "exports"], function (require, exports) {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = computeUniqueVertices;
});

define('davinci-eight/geometries/simplicesToPrimitive',["require", "exports", '../collections/copyToArray', './dataFromVectorN', './primitives/DrawAttribute', '../core/DrawMode', './primitives/DrawPrimitive', './simplicesToGeometryMeta', './computeUniqueVertices', '../checks/expectArg', './Simplex', '../math/VectorN'], function (require, exports, copyToArray_1, dataFromVectorN_1, DrawAttribute_1, DrawMode_1, DrawPrimitive_1, simplicesToGeometryMeta_1, computeUniqueVertices_1, expectArg_1, Simplex_1, VectorN_1) {
    function numberList(size, value) {
        var data = [];
        for (var i = 0; i < size; i++) {
            data.push(value);
        }
        return data;
    }
    function attribName(name, attribMap) {
        expectArg_1.default('name', name).toBeString();
        expectArg_1.default('attribMap', attribMap).toBeObject();
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
        expectArg_1.default('key', key).toBeString();
        expectArg_1.default('attribMap', attribMap).toBeObject();
        var meta = attribMap[key];
        if (meta) {
            var size = meta.size;
            expectArg_1.default('size', size).toBeNumber();
            return meta.size;
        }
        else {
            throw new Error("Unable to compute size; missing attribute specification for " + key);
        }
    }
    function concat(a, b) {
        return a.concat(b);
    }
    function default_1(simplices, geometryMeta) {
        expectArg_1.default('simplices', simplices).toBeObject();
        var actuals = simplicesToGeometryMeta_1.default(simplices);
        if (geometryMeta) {
            expectArg_1.default('geometryMeta', geometryMeta).toBeObject();
        }
        else {
            geometryMeta = actuals;
        }
        var attribMap = geometryMeta.attributes;
        var keys = Object.keys(attribMap);
        var keysLen = keys.length;
        var k;
        var vertices = computeUniqueVertices_1.default(simplices);
        var vsLength = vertices.length;
        var i;
        var indices = simplices.map(Simplex_1.default.indices).reduce(concat, []);
        var outputs = [];
        for (k = 0; k < keysLen; k++) {
            var key = keys[k];
            var dims = attribSize(key, attribMap);
            var data = numberList(vsLength * dims, void 0);
            outputs.push({ data: data, dimensions: dims, name: attribName(key, attribMap) });
        }
        for (i = 0; i < vsLength; i++) {
            var vertex = vertices[i];
            var vertexAttribs = vertex.attributes;
            if (vertex.index !== i) {
                expectArg_1.default('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
            }
            for (k = 0; k < keysLen; k++) {
                var output = outputs[k];
                var size = output.dimensions;
                var value = vertexAttribs[keys[k]];
                if (!value) {
                    value = new VectorN_1.default(numberList(size, 0), false, size);
                }
                var data = dataFromVectorN_1.default(value);
                copyToArray_1.default(data, output.data, i * output.dimensions);
            }
        }
        var attributes = {};
        for (k = 0; k < keysLen; k++) {
            var output = outputs[k];
            var data = output.data;
            attributes[output.name] = new DrawAttribute_1.default(data, output.dimensions);
        }
        switch (geometryMeta.k) {
            case Simplex_1.default.TRIANGLE:
                {
                    return new DrawPrimitive_1.default(DrawMode_1.default.TRIANGLES, indices, attributes);
                }
                break;
            case Simplex_1.default.LINE:
                {
                    return new DrawPrimitive_1.default(DrawMode_1.default.LINES, indices, attributes);
                }
                break;
            case Simplex_1.default.POINT:
                {
                    return new DrawPrimitive_1.default(DrawMode_1.default.POINTS, indices, attributes);
                }
                break;
            case Simplex_1.default.EMPTY:
                {
                    return new DrawPrimitive_1.default(DrawMode_1.default.POINTS, indices, attributes);
                }
                break;
            default: {
                throw new Error("k => " + geometryMeta.k);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/SimplexPrimitivesBuilder',["require", "exports", '../math/G3', '../checks/mustBeBoolean', '../checks/mustBeInteger', '../geometries/PrimitivesBuilder', '../geometries/Simplex', '../core/GraphicsProgramSymbols', '../geometries/simplicesToPrimitive', '../geometries/simplicesToGeometryMeta', '../math/Vector1', '../math/Vector3'], function (require, exports, G3_1, mustBeBoolean_1, mustBeInteger_1, PrimitivesBuilder_1, Simplex_1, GraphicsProgramSymbols_1, simplicesToPrimitive_1, simplicesToGeometryMeta_1, Vector1_1, Vector3_1) {
    var SimplexPrimitivesBuilder = (function (_super) {
        __extends(SimplexPrimitivesBuilder, _super);
        function SimplexPrimitivesBuilder() {
            _super.call(this);
            this.data = [];
            this._k = new Vector1_1.default([Simplex_1.default.TRIANGLE]);
            this.curvedSegments = 16;
            this.flatSegments = 1;
            this.orientationColors = false;
            this._k.modified = true;
        }
        Object.defineProperty(SimplexPrimitivesBuilder.prototype, "k", {
            get: function () {
                return this._k.x;
            },
            set: function (k) {
                this._k.x = mustBeInteger_1.default('k', k);
            },
            enumerable: true,
            configurable: true
        });
        SimplexPrimitivesBuilder.prototype.regenerate = function () {
            throw new Error("`protected regenerate(): void` method should be implemented in derived class.");
        };
        SimplexPrimitivesBuilder.prototype.isModified = function () {
            return this._k.modified;
        };
        SimplexPrimitivesBuilder.prototype.setModified = function (modified) {
            mustBeBoolean_1.default('modified', modified);
            this._k.modified = modified;
            return this;
        };
        SimplexPrimitivesBuilder.prototype.boundary = function (times) {
            this.regenerate();
            this.data = Simplex_1.default.boundary(this.data, times);
            return this.check();
        };
        SimplexPrimitivesBuilder.prototype.check = function () {
            this.meta = simplicesToGeometryMeta_1.default(this.data);
            return this;
        };
        SimplexPrimitivesBuilder.prototype.subdivide = function (times) {
            this.regenerate();
            this.data = Simplex_1.default.subdivide(this.data, times);
            this.check();
            return this;
        };
        SimplexPrimitivesBuilder.prototype.toPrimitives = function () {
            this.regenerate();
            this.check();
            return [simplicesToPrimitive_1.default(this.data, this.meta)];
        };
        SimplexPrimitivesBuilder.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
        };
        SimplexPrimitivesBuilder.prototype.triangle = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[2];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[2];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[1];
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[2];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e1);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e2);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e3);
            }
            return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.lineSegment = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(Simplex_1.default.LINE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[1];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e1);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e2);
            }
            return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.point = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(Simplex_1.default.POINT);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[0];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e1);
            }
            return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.empty = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(Simplex_1.default.EMPTY);
            return this.data.push(simplex);
        };
        return SimplexPrimitivesBuilder;
    })(PrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimplexPrimitivesBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/SliceSimplexPrimitivesBuilder',["require", "exports", '../geometries/SimplexPrimitivesBuilder'], function (require, exports, SimplexPrimitivesBuilder_1) {
    var SliceSimplexPrimitivesBuilder = (function (_super) {
        __extends(SliceSimplexPrimitivesBuilder, _super);
        function SliceSimplexPrimitivesBuilder() {
            _super.call(this);
            this.sliceAngle = 2 * Math.PI;
        }
        return SliceSimplexPrimitivesBuilder;
    })(SimplexPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SliceSimplexPrimitivesBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CylinderBuilder',["require", "exports", '../geometries/arc3', '../math/R3', '../geometries/SliceSimplexPrimitivesBuilder', '../math/Spinor3', '../math/Unit', '../math/Vector2', '../math/Vector3'], function (require, exports, arc3_1, R3_1, SliceSimplexPrimitivesBuilder_1, Spinor3_1, Unit_1, Vector2_1, Vector3_1) {
    function computeWallVertices(e, cutLine, clockwise, stress, tilt, offset, angle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs) {
        var halfHeight = e.scale(Unit_1.default.ONE.scale(0.5));
        var stepH = e.scale(Unit_1.default.ONE.scale(1 / heightSegments));
        var iLength = heightSegments + 1;
        for (var i = 0; i < iLength; i++) {
            var dispH = Vector3_1.default.copy(stepH).scale(i).sub(halfHeight);
            var verticesRow = [];
            var uvsRow = [];
            var v = (heightSegments - i) / heightSegments;
            var arcPoints = arc3_1.default(cutLine, angle, generator, thetaSegments);
            var jLength = arcPoints.length;
            for (var j = 0; j < jLength; j++) {
                var point = arcPoints[j];
                var tangent = Spinor3_1.default.dual(point, false);
                point.add(dispH);
                point.stress(stress);
                point.rotate(tilt);
                point.add(offset);
                tangent.stress(stress);
                tangent.rotate(tilt);
                var u = j / thetaSegments;
                points.push(point);
                tangents.push(tangent);
                verticesRow.push(points.length - 1);
                uvsRow.push(new Vector2_1.default([u, v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }
    }
    var CylinderBuilder = (function (_super) {
        __extends(CylinderBuilder, _super);
        function CylinderBuilder(e, cutLine, clockwise) {
            _super.call(this);
            this.openBase = false;
            this.openCap = false;
            this.openWall = false;
            this.e = R3_1.default.direction(e);
            this.cutLine = R3_1.default.direction(cutLine);
            this.clockwise = clockwise;
            this.setModified(true);
        }
        CylinderBuilder.prototype.regenerate = function () {
            this.data = [];
            var heightSegments = this.flatSegments;
            var thetaSegments = this.curvedSegments;
            var generator = Spinor3_1.default.dual(this.e, false);
            var heightHalf = 1 / 2;
            var points = [];
            var tangents = [];
            var vertices = [];
            var uvs = [];
            computeWallVertices(this.e, this.cutLine, this.clockwise, this.stress, this.tilt, this.offset, this.sliceAngle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs);
            if (!this.openWall) {
                for (var j = 0; j < thetaSegments; j++) {
                    for (var i = 0; i < heightSegments; i++) {
                        var v1 = vertices[i][j];
                        var v2 = vertices[i + 1][j];
                        var v3 = vertices[i + 1][j + 1];
                        var v4 = vertices[i][j + 1];
                        var n1 = Vector3_1.default.dual(tangents[v1], true).normalize();
                        var n2 = Vector3_1.default.dual(tangents[v2], true).normalize();
                        var n3 = Vector3_1.default.dual(tangents[v3], true).normalize();
                        var n4 = Vector3_1.default.dual(tangents[v4], true).normalize();
                        var uv1 = uvs[i][j].clone();
                        var uv2 = uvs[i + 1][j].clone();
                        var uv3 = uvs[i + 1][j + 1].clone();
                        var uv4 = uvs[i][j + 1].clone();
                        this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3]);
                        this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()]);
                    }
                }
            }
            if (!this.openCap) {
                var top_1 = Vector3_1.default.copy(this.e).scale(heightHalf).add(this.offset);
                var tangent = Spinor3_1.default.dual(this.e, false).stress(this.stress).rotate(this.tilt);
                var normal = Vector3_1.default.dual(tangent, true);
                points.push(top_1);
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[heightSegments][j + 1];
                    var v2 = points.length - 1;
                    var v3 = vertices[heightSegments][j];
                    var uv1 = uvs[heightSegments][j + 1].clone();
                    var uv2 = new Vector2_1.default([uv1.x, 1]);
                    var uv3 = uvs[heightSegments][j].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3]);
                }
            }
            if (!this.openBase) {
                var bottom = Vector3_1.default.copy(this.e).scale(-heightHalf).add(this.offset);
                var tangent = Spinor3_1.default.dual(this.e, false).neg().stress(this.stress).rotate(this.tilt);
                var normal = Vector3_1.default.dual(tangent, true);
                points.push(bottom);
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[0][j];
                    var v2 = points.length - 1;
                    var v3 = vertices[0][j + 1];
                    var uv1 = uvs[0][j].clone();
                    var uv2 = new Vector2_1.default([uv1.x, 1]);
                    var uv3 = uvs[0][j + 1].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3]);
                }
            }
            this.setModified(false);
        };
        return CylinderBuilder;
    })(SliceSimplexPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CylinderGeometry',["require", "exports", './CylinderBuilder', '../base/incLevel', '../checks/isDefined', '../checks/mustBeBoolean', '../i18n/notSupported', '../core/GeometryContainer', '../core/GeometryElements', '../math/R3', '../core/vertexArraysFromPrimitive'], function (require, exports, CylinderBuilder_1, incLevel_1, isDefined_1, mustBeBoolean_1, notSupported_1, GeometryContainer_1, GeometryElements_1, R3_1, vertexArraysFromPrimitive_1) {
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, options.tilt);
            this._length = 1;
            this._radius = 1;
            this.setLoggingName('CylinderGeometry');
            var builder = new CylinderBuilder_1.default(R3_1.default.e2, R3_1.default.e3, false);
            if (isDefined_1.default(options.openBase)) {
                builder.openBase = mustBeBoolean_1.default('openBase', options.openBase);
            }
            if (isDefined_1.default(options.openCap)) {
                builder.openCap = mustBeBoolean_1.default('openCap', options.openCap);
            }
            if (isDefined_1.default(options.openWall)) {
                builder.openWall = mustBeBoolean_1.default('openWall', options.openWall);
            }
            if (options.tilt) {
                builder.tilt.copySpinor(options.tilt);
            }
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            var ps = builder.toPrimitives();
            var iLen = ps.length;
            for (var i = 0; i < iLen; i++) {
                var dataSource = ps[i];
                var geometry = new GeometryElements_1.default(vertexArraysFromPrimitive_1.default(dataSource), options.engine);
                this.addPart(geometry);
                geometry.release();
            }
        }
        CylinderGeometry.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(CylinderGeometry.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (radius) {
                this._radius = radius;
                this.setPrincipalScale('radius', radius);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderGeometry.prototype, "length", {
            get: function () {
                return this._length;
            },
            set: function (length) {
                this._length = length;
                this.setPrincipalScale('length', length);
            },
            enumerable: true,
            configurable: true
        });
        CylinderGeometry.prototype.getPrincipalScale = function (name) {
            switch (name) {
                case 'length': {
                    return this._length;
                }
                case 'radius': {
                    return this._radius;
                }
                default: {
                    throw new Error(notSupported_1.default("getPrincipalScale('" + name + "')").message);
                }
            }
        };
        CylinderGeometry.prototype.setPrincipalScale = function (name, value) {
            switch (name) {
                case 'length':
                    {
                        this._length = value;
                    }
                    break;
                case 'radius':
                    {
                        this._radius = value;
                    }
                    break;
                default: {
                    throw new Error(notSupported_1.default("getPrincipalScale('" + name + "')").message);
                }
            }
            this.setScale(this._radius, this._length, this._radius);
        };
        return CylinderGeometry;
    })(GeometryContainer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/primitives/GridLines',["require", "exports", '../../core/DrawMode', './GridPrimitive', '../../checks/mustBeInteger', './numPostsForFence'], function (require, exports, DrawMode_1, GridPrimitive_1, mustBeInteger_1, numPostsForFence_1) {
    function vertexIndex(i, j, iLength, jLength) {
        return j * iLength + i;
    }
    function linesForGrid(uSegments, uClosed, vSegments, vClosed) {
        var iLength = numPostsForFence_1.default(uSegments, uClosed);
        var jLength = numPostsForFence_1.default(vSegments, vClosed);
        var elements = [];
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < jLength; j++) {
                if (i < uSegments) {
                    elements.push(vertexIndex(i, j, iLength, jLength));
                    elements.push(vertexIndex(i + 1, j, iLength, jLength));
                }
                if (j < vSegments) {
                    elements.push(vertexIndex(i, j, iLength, jLength));
                    elements.push(vertexIndex(i, j + 1, iLength, jLength));
                }
            }
        }
        return elements;
    }
    var GridLines = (function (_super) {
        __extends(GridLines, _super);
        function GridLines(uSegments, uClosed, vSegments, vClosed) {
            _super.call(this, DrawMode_1.default.LINES, uSegments, vSegments);
            this.elements = linesForGrid(uSegments, uClosed, vSegments, vClosed);
            var iLength = numPostsForFence_1.default(uSegments, uClosed);
            var jLength = numPostsForFence_1.default(vSegments, vClosed);
            for (var i = 0; i < iLength; i++) {
                for (var j = 0; j < jLength; j++) {
                    var coords = this.vertex(i, j).coords;
                    coords.setComponent(0, i);
                    coords.setComponent(1, j);
                }
            }
        }
        GridLines.prototype.vertex = function (i, j) {
            mustBeInteger_1.default('i', i);
            mustBeInteger_1.default('j', j);
            return this.vertices[vertexIndex(i, j, this.uLength, this.vLength)];
        };
        return GridLines;
    })(GridPrimitive_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridLines;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/primitives/GridPoints',["require", "exports", '../../core/DrawMode', './GridPrimitive', '../../checks/mustBeInteger', './numPostsForFence'], function (require, exports, DrawMode_1, GridPrimitive_1, mustBeInteger_1, numPostsForFence_1) {
    function vertexIndex(i, j, iLength, jLength) {
        return j * iLength + i;
    }
    function pointsForGrid(uSegments, uClosed, vSegments, vClosed) {
        var iLength = numPostsForFence_1.default(uSegments, uClosed);
        var jLength = numPostsForFence_1.default(vSegments, vClosed);
        var elements = [];
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < jLength; j++) {
                elements.push(vertexIndex(i, j, iLength, jLength));
            }
        }
        return elements;
    }
    var GridPoints = (function (_super) {
        __extends(GridPoints, _super);
        function GridPoints(uSegments, uClosed, vSegments, vClosed) {
            _super.call(this, DrawMode_1.default.POINTS, uSegments, vSegments);
            this.elements = pointsForGrid(uSegments, uClosed, vSegments, vClosed);
            var iLength = numPostsForFence_1.default(uSegments, uClosed);
            var jLength = numPostsForFence_1.default(vSegments, vClosed);
            for (var i = 0; i < iLength; i++) {
                for (var j = 0; j < jLength; j++) {
                    var coords = this.vertex(i, j).coords;
                    coords.setComponent(0, i);
                    coords.setComponent(1, j);
                }
            }
        }
        GridPoints.prototype.vertex = function (i, j) {
            mustBeInteger_1.default('i', i);
            mustBeInteger_1.default('j', j);
            return this.vertices[vertexIndex(i, j, this.uLength, this.vLength)];
        };
        return GridPoints;
    })(GridPrimitive_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridPoints;
});

define('davinci-eight/geometries/gridVertexArrays',["require", "exports", '../core/Color', '../core/DrawMode', '../core/GraphicsProgramSymbols', './primitives/GridLines', './primitives/GridPoints', './primitives/GridTriangleStrip', '../checks/isDefined', '../checks/isFunction', '../checks/mustBeNumber', '../math/R3', '../math/Unit', '../math/Vector3'], function (require, exports, Color_1, DrawMode_1, GraphicsProgramSymbols_1, GridLines_1, GridPoints_1, GridTriangleStrip_1, isDefined_1, isFunction_1, mustBeNumber_1, R3_1, Unit_1, Vector3_1) {
    function aPositionDefault(u, v) {
        return R3_1.default.vector(u, v, 0, Unit_1.default.ONE);
    }
    function aNormalDefault(u, v) {
        return R3_1.default.e3;
    }
    function topology(drawMode, uSegments, uClosed, vSegments, vClosed) {
        switch (drawMode) {
            case DrawMode_1.default.POINTS: {
                return new GridPoints_1.default(uSegments, uClosed, vSegments, vClosed);
            }
            case DrawMode_1.default.LINES: {
                return new GridLines_1.default(uSegments, uClosed, vSegments, vClosed);
            }
            case DrawMode_1.default.TRIANGLE_STRIP: {
                return new GridTriangleStrip_1.default(uSegments, vSegments);
            }
            default: {
                throw new Error("drawMode must be POINTS, LINES or TRIANGLE_STRIP");
            }
        }
    }
    function transformVertex(vertex, u, v, options) {
        var aPosition = isDefined_1.default(options.aPosition) ? options.aPosition : aPositionDefault;
        var aNormal = isDefined_1.default(options.aNormal) ? options.aNormal : aNormalDefault;
        var aColor = isDefined_1.default(options.aColor) ? options.aColor : void 0;
        if (isFunction_1.default(aPosition)) {
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(aPosition(u, v));
        }
        if (isFunction_1.default(aNormal)) {
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(aNormal(u, v));
        }
        if (isFunction_1.default(aColor)) {
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Color_1.default.copy(aColor(u, v));
        }
    }
    function default_1(options) {
        var uMin = isDefined_1.default(options.uMin) ? mustBeNumber_1.default('uMin', options.uMin) : 0;
        var uMax = isDefined_1.default(options.uMax) ? mustBeNumber_1.default('uMax', options.uMax) : 1;
        var uSegments = isDefined_1.default(options.uSegments) ? options.uSegments : 1;
        var vMin = isDefined_1.default(options.vMin) ? mustBeNumber_1.default('vMin', options.vMin) : 0;
        var vMax = isDefined_1.default(options.vMax) ? mustBeNumber_1.default('vMax', options.vMax) : 1;
        var vSegments = isDefined_1.default(options.vSegments) ? options.vSegments : 1;
        var drawMode = isDefined_1.default(options.drawMode) ? options.drawMode : DrawMode_1.default.LINES;
        var grid = topology(drawMode, uSegments, false, vSegments, false);
        var iLen = grid.uLength;
        var jLen = grid.vLength;
        if (uSegments > 0) {
            if (vSegments > 0) {
                for (var i = 0; i < iLen; i++) {
                    for (var j = 0; j < jLen; j++) {
                        var vertex = grid.vertex(i, j);
                        var u = uMin + (uMax - uMin) * i / uSegments;
                        var v = vMin + (vMax - vMin) * j / vSegments;
                        transformVertex(vertex, u, v, options);
                    }
                }
            }
            else {
                for (var i = 0; i < iLen; i++) {
                    var vertex = grid.vertex(i, 0);
                    var u = uMin + (uMax - uMin) * i / uSegments;
                    var v = (vMin + vMax) / 2;
                    transformVertex(vertex, u, v, options);
                }
            }
        }
        else {
            if (vSegments > 0) {
                for (var j = 0; j < jLen; j++) {
                    var vertex = grid.vertex(0, j);
                    var u = (uMin + uMax) / 2;
                    var v = vMin + (vMax - vMin) * j / vSegments;
                    transformVertex(vertex, u, v, options);
                }
            }
            else {
                var vertex = grid.vertex(0, 0);
                var u = (uMin + uMax) / 2;
                var v = (vMin + vMax) / 2;
                transformVertex(vertex, u, v, options);
            }
        }
        var vas = grid.toVertexArrays();
        return vas;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/GridGeometry',["require", "exports", '../core/GeometryElements', './gridVertexArrays', '../base/incLevel'], function (require, exports, GeometryElements_1, gridVertexArrays_1, incLevel_1) {
    var GridGeometry = (function (_super) {
        __extends(GridGeometry, _super);
        function GridGeometry(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, gridVertexArrays_1.default(options), options.engine);
            this.setLoggingName('GridGeometry');
        }
        GridGeometry.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        return GridGeometry;
    })(GeometryElements_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/SphereBuilder',["require", "exports", '../geometries/arc3', '../math/R3', '../checks/mustBeNumber', '../geometries/Simplex', '../geometries/SliceSimplexPrimitivesBuilder', '../math/Spinor3', '../math/Vector2', '../math/Vector3'], function (require, exports, arc3_1, R3_1, mustBeNumber_1, Simplex_1, SliceSimplexPrimitivesBuilder_1, Spinor3_1, Vector2_1, Vector3_1) {
    function computeVertices(stress, tilt, offset, phiLength, thetaLength, heightSegments, widthSegments, points, uvs) {
        var generator = Spinor3_1.default.dual(R3_1.default.e3, false);
        var iLength = heightSegments + 1;
        var jLength = widthSegments + 1;
        for (var i = 0; i < iLength; i++) {
            var v = i / heightSegments;
            var θ = v * thetaLength;
            var arcRadius = Math.sin(θ);
            var begin = Vector3_1.default.copy(R3_1.default.e1).scale(arcRadius);
            var arcPoints = arc3_1.default(begin, phiLength, generator, widthSegments);
            var cosθ = Math.cos(θ);
            var displacement = cosθ;
            for (var j = 0; j < jLength; j++) {
                var point = arcPoints[j].add(R3_1.default.e3, displacement);
                point.stress(stress);
                point.rotate(tilt);
                point.add(offset);
                points.push(point.rotate(tilt));
                var u = j / widthSegments;
                uvs.push(new Vector2_1.default([u, 1 - v]));
            }
        }
    }
    function quadIndex(i, j, innerSegments) {
        return i * (innerSegments + 1) + j;
    }
    function vertexIndex(qIndex, n, innerSegments) {
        switch (n) {
            case 0: return qIndex + 1;
            case 1: return qIndex;
            case 2: return qIndex + innerSegments + 1;
            case 3: return qIndex + innerSegments + 2;
        }
    }
    function makeTriangles(points, uvs, radius, heightSegments, widthSegments, geometry) {
        for (var i = 0; i < heightSegments; i++) {
            for (var j = 0; j < widthSegments; j++) {
                var qIndex = quadIndex(i, j, widthSegments);
                var v0 = vertexIndex(qIndex, 0, widthSegments);
                var v1 = vertexIndex(qIndex, 1, widthSegments);
                var v2 = vertexIndex(qIndex, 2, widthSegments);
                var v3 = vertexIndex(qIndex, 3, widthSegments);
                var n0 = Vector3_1.default.copy(points[v0]).normalize();
                var n1 = Vector3_1.default.copy(points[v1]).normalize();
                var n2 = Vector3_1.default.copy(points[v2]).normalize();
                var n3 = Vector3_1.default.copy(points[v3]).normalize();
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                if (false) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false) {
                    uv2.x = (uv2.x + uv3.x) / 2;
                    geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
                }
                else {
                    geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3]);
                    geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1]);
                }
            }
        }
    }
    function makeLineSegments(points, uvs, radius, heightSegments, widthSegments, geometry) {
        for (var i = 0; i < heightSegments; i++) {
            for (var j = 0; j < widthSegments; j++) {
                var qIndex = quadIndex(i, j, widthSegments);
                var v0 = vertexIndex(qIndex, 0, widthSegments);
                var v1 = vertexIndex(qIndex, 1, widthSegments);
                var v2 = vertexIndex(qIndex, 2, widthSegments);
                var v3 = vertexIndex(qIndex, 3, widthSegments);
                var n0 = Vector3_1.default.copy(points[v0]).normalize();
                var n1 = Vector3_1.default.copy(points[v1]).normalize();
                var n2 = Vector3_1.default.copy(points[v2]).normalize();
                var n3 = Vector3_1.default.copy(points[v3]).normalize();
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                if (false) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false) {
                    uv2.x = (uv2.x + uv3.x) / 2;
                    geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
                }
                else {
                    geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1]);
                    geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
                    geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
                    geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0]);
                }
            }
        }
    }
    function makePoints(points, uvs, radius, heightSegments, widthSegments, geometry) {
        for (var i = 0; i < heightSegments; i++) {
            for (var j = 0; j < widthSegments; j++) {
                var qIndex = quadIndex(i, j, widthSegments);
                var v0 = vertexIndex(qIndex, 0, widthSegments);
                var v1 = vertexIndex(qIndex, 1, widthSegments);
                var v2 = vertexIndex(qIndex, 2, widthSegments);
                var v3 = vertexIndex(qIndex, 3, widthSegments);
                var n0 = Vector3_1.default.copy(points[v0]).normalize();
                var n1 = Vector3_1.default.copy(points[v1]).normalize();
                var n2 = Vector3_1.default.copy(points[v2]).normalize();
                var n3 = Vector3_1.default.copy(points[v3]).normalize();
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                if (false) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false) {
                    uv2.x = (uv2.x + uv3.x) / 2;
                    geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
                }
                else {
                    geometry.point([points[v0]], [n0], [uv0]);
                    geometry.point([points[v1]], [n1], [uv1]);
                    geometry.point([points[v2]], [n2], [uv2]);
                    geometry.point([points[v3]], [n3], [uv3]);
                }
            }
        }
    }
    var SphereBuilder = (function (_super) {
        __extends(SphereBuilder, _super);
        function SphereBuilder() {
            _super.call(this);
            this.thetaLength = Math.PI;
            this.setModified(true);
            this.regenerate();
        }
        Object.defineProperty(SphereBuilder.prototype, "radius", {
            get: function () {
                return this.stress.x;
            },
            set: function (radius) {
                mustBeNumber_1.default('radius', radius);
                this.stress.x = radius;
                this.stress.y = radius;
                this.stress.z = radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "phiLength", {
            get: function () {
                return this.sliceAngle;
            },
            set: function (phiLength) {
                mustBeNumber_1.default('phiLength', phiLength);
                this.sliceAngle = phiLength;
            },
            enumerable: true,
            configurable: true
        });
        SphereBuilder.prototype.isModified = function () {
            return _super.prototype.isModified.call(this);
        };
        SphereBuilder.prototype.setModified = function (modified) {
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        SphereBuilder.prototype.regenerate = function () {
            this.data = [];
            var heightSegments = this.curvedSegments;
            var widthSegments = this.curvedSegments;
            var points = [];
            var uvs = [];
            computeVertices(this.stress, this.tilt, this.offset, this.phiLength, this.thetaLength, heightSegments, widthSegments, points, uvs);
            switch (this.k) {
                case Simplex_1.default.EMPTY:
                    {
                        makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex_1.default.POINT:
                    {
                        makePoints(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex_1.default.LINE:
                    {
                        makeLineSegments(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex_1.default.TRIANGLE:
                    {
                        makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                default: {
                    console.warn(this.k + "-simplex is not supported for geometry generation.");
                }
            }
            this.setModified(false);
        };
        return SphereBuilder;
    })(SliceSimplexPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SphereBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/SphereGeometry',["require", "exports", '../core/GeometryContainer', '../core/GeometryElements', '../base/incLevel', '../i18n/notSupported', './SphereBuilder', '../core/vertexArraysFromPrimitive'], function (require, exports, GeometryContainer_1, GeometryElements_1, incLevel_1, notSupported_1, SphereBuilder_1, vertexArraysFromPrimitive_1) {
    var SphereGeometry = (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, void 0);
            this._radius = 1;
            this.setLoggingName('SphereGeometry');
            var builder = new SphereBuilder_1.default();
            var ps = builder.toPrimitives();
            var iLen = ps.length;
            for (var i = 0; i < iLen; i++) {
                var p = ps[i];
                var geometry = new GeometryElements_1.default(vertexArraysFromPrimitive_1.default(p), options.engine);
                this.addPart(geometry);
                geometry.release();
            }
        }
        SphereGeometry.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(SphereGeometry.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (radius) {
                this._radius = radius;
                this.setPrincipalScale('radius', radius);
            },
            enumerable: true,
            configurable: true
        });
        SphereGeometry.prototype.getPrincipalScale = function (name) {
            switch (name) {
                case 'radius': {
                    return this._radius;
                }
                default: {
                    throw new Error(notSupported_1.default("getPrincipalScale('" + name + "')").message);
                }
            }
        };
        SphereGeometry.prototype.setPrincipalScale = function (name, value) {
            switch (name) {
                case 'radius':
                    {
                        this._radius = value;
                    }
                    break;
                default: {
                    throw new Error(notSupported_1.default("setPrincipalScale('" + name + "')").message);
                }
            }
            this.setScale(this._radius, this._radius, this._radius);
        };
        return SphereGeometry;
    })(GeometryContainer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SphereGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/PolyhedronBuilder',["require", "exports", '../math/G3', '../geometries/SimplexPrimitivesBuilder', '../geometries/Simplex', '../core/GraphicsProgramSymbols', '../math/Vector2', '../math/Vector3'], function (require, exports, G3_1, SimplexPrimitivesBuilder_1, Simplex_1, GraphicsProgramSymbols_1, Vector2_1, Vector3_1) {
    function azimuth(vector) {
        return Math.atan2(vector.z, -vector.x);
    }
    function inclination(pos) {
        return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
    }
    function prepare(point, points) {
        var vertex = Vector3_1.default.copy(point).normalize();
        points.push(vertex);
        var u = azimuth(point) / 2 / Math.PI + 0.5;
        var v = inclination(point) / Math.PI + 0.5;
        var something = vertex;
        something['uv'] = new Vector2_1.default([u, 1 - v]);
        return vertex;
    }
    function correctUV(uv, vector, azimuth) {
        if ((azimuth < 0) && (uv.x === 1))
            uv = new Vector2_1.default([uv.x - 1, uv.y]);
        if ((vector.x === 0) && (vector.z === 0))
            uv = new Vector2_1.default([azimuth / 2 / Math.PI + 0.5, uv.y]);
        return uv.clone();
    }
    var PolyhedronBuilder = (function (_super) {
        __extends(PolyhedronBuilder, _super);
        function PolyhedronBuilder(vertices, indices, radius, detail) {
            if (radius === void 0) { radius = 1; }
            if (detail === void 0) { detail = 0; }
            _super.call(this);
            var points = [];
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                prepare(new Vector3_1.default([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
            }
            var faces = [];
            for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
                var v1 = points[indices[i]];
                var v2 = points[indices[i + 1]];
                var v3 = points[indices[i + 2]];
                var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v1;
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v1);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v2;
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v2);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v3;
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v3);
                faces[j] = simplex;
            }
            for (var i = 0, facesLength = faces.length; i < facesLength; i++) {
                subdivide(faces[i], detail, points, this);
            }
            for (var i = 0, verticesLength = points.length; i < verticesLength; i++) {
                points[i].scale(radius);
            }
            this.mergeVertices();
            function centroid(v1, v2, v3) {
                var x = (v1.x + v2.x + v3.x) / 3;
                var y = (v1.y + v2.y + v3.y) / 3;
                var z = (v1.z + v2.z + v3.z) / 3;
                return new G3_1.default(0, x, y, z, 0, 0, 0, 0);
            }
            function make(v1, v2, v3, builder) {
                var azi = azimuth(centroid(v1, v2, v3));
                var something1 = v1;
                var something2 = v2;
                var something3 = v3;
                var uv1 = correctUV(something1['uv'], v1, azi);
                var uv2 = correctUV(something2['uv'], v2, azi);
                var uv3 = correctUV(something3['uv'], v3, azi);
                var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v1);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v1);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uv1;
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v2);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v2);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uv2;
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v3);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v3);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uv3;
                builder.data.push(simplex);
            }
            function subdivide(face, detail, points, builder) {
                var cols = Math.pow(2, detail);
                var a = prepare(face.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
                var b = prepare(face.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
                var c = prepare(face.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
                var v = [];
                for (var i = 0; i <= cols; i++) {
                    v[i] = [];
                    var aj = prepare(Vector3_1.default.copy(a).lerp(c, i / cols), points);
                    var bj = prepare(Vector3_1.default.copy(b).lerp(c, i / cols), points);
                    var rows = cols - i;
                    for (var j = 0; j <= rows; j++) {
                        if (j === 0 && i === cols) {
                            v[i][j] = aj;
                        }
                        else {
                            v[i][j] = prepare(Vector3_1.default.copy(aj).lerp(bj, j / rows), points);
                        }
                    }
                }
                for (var i = 0; i < cols; i++) {
                    for (var j = 0; j < 2 * (cols - i) - 1; j++) {
                        var k = Math.floor(j / 2);
                        if (j % 2 === 0) {
                            make(v[i][k + 1], v[i + 1][k], v[i][k], builder);
                        }
                        else {
                            make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k], builder);
                        }
                    }
                }
            }
        }
        PolyhedronBuilder.prototype.regenerate = function () {
        };
        return PolyhedronBuilder;
    })(SimplexPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PolyhedronBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/TetrahedronGeometry',["require", "exports", '../core/GeometryContainer', '../core/GeometryElements', '../checks/isDefined', '../checks/mustBeNumber', '../geometries/PolyhedronBuilder', '../core/vertexArraysFromPrimitive'], function (require, exports, GeometryContainer_1, GeometryElements_1, isDefined_1, mustBeNumber_1, PolyhedronBuilder_1, vertexArraysFromPrimitive_1) {
    var vertices = [
        +1, +1, +1, -1, -1, +1, -1, +1, -1, +1, -1, -1
    ];
    var indices = [
        2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
    ];
    var TetrahedronGeometry = (function (_super) {
        __extends(TetrahedronGeometry, _super);
        function TetrahedronGeometry(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, options.tilt);
            this.setLoggingName('TetrahedronGeometry');
            var radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default('radius', options.radius) : 1.0;
            var builder = new PolyhedronBuilder_1.default(vertices, indices, radius);
            var ps = builder.toPrimitives();
            var iLen = ps.length;
            for (var i = 0; i < iLen; i++) {
                var p = ps[i];
                var geometry = new GeometryElements_1.default(vertexArraysFromPrimitive_1.default(p), options.engine);
                this.addPart(geometry);
                geometry.release();
            }
        }
        TetrahedronGeometry.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return TetrahedronGeometry;
    })(GeometryContainer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TetrahedronGeometry;
});

define('davinci-eight/core/makeWebGLShader',["require", "exports", '../config', './ErrorMode'], function (require, exports, config_1, ErrorMode_1) {
    function decodeType(gl, type) {
        if (type === gl.VERTEX_SHADER) {
            return "VERTEX_SHADER";
        }
        else if (type === gl.FRAGMENT_SHADER) {
            return "FRAGMENT_SHADER";
        }
        else {
            return "type => " + type + " shader";
        }
    }
    function makeWebGLShader(gl, source, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (compiled) {
            return shader;
        }
        else {
            if (!gl.isContextLost()) {
                var message = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                switch (config_1.default.errorMode) {
                    case ErrorMode_1.default.WARNME: {
                        config_1.default.warn("Error compiling " + decodeType(gl, type) + ". Cause: " + message + ".");
                    }
                }
                throw new Error(message);
            }
            else {
                throw new Error("Context lost while compiling " + decodeType(gl, type) + ".");
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = makeWebGLShader;
});

define('davinci-eight/core/makeWebGLProgram',["require", "exports", './makeWebGLShader'], function (require, exports, makeWebGLShader_1) {
    function makeWebGLProgram(ctx, vertexShaderSrc, fragmentShaderSrc, attribs) {
        var vs = makeWebGLShader_1.default(ctx, vertexShaderSrc, ctx.VERTEX_SHADER);
        var fs = makeWebGLShader_1.default(ctx, fragmentShaderSrc, ctx.FRAGMENT_SHADER);
        var program = ctx.createProgram();
        ctx.attachShader(program, vs);
        ctx.attachShader(program, fs);
        for (var index = 0; index < attribs.length; ++index) {
            ctx.bindAttribLocation(program, index, attribs[index]);
        }
        ctx.linkProgram(program);
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = makeWebGLProgram;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/MaterialBase',["require", "exports", '../core/AttribLocation', '../config', '../base/incLevel', '../checks/isDefined', '../checks/isString', '../checks/isNull', '../core/makeWebGLProgram', '../core/ErrorMode', '../checks/mustBeArray', '../checks/mustBeString', '../checks/mustBeUndefined', '../i18n/readOnly', '../core/ShareableContextConsumer', '../core/UniformLocation'], function (require, exports, AttribLocation_1, config_1, incLevel_1, isDefined_1, isString_1, isNull_1, makeWebGLProgram_1, ErrorMode_1, mustBeArray_1, mustBeString_1, mustBeUndefined_1, readOnly_1, ShareableContextConsumer_1, UniformLocation_1) {
    var MaterialBase = (function (_super) {
        __extends(MaterialBase, _super);
        function MaterialBase(vertexShaderSrc, fragmentShaderSrc, attribs, engine) {
            _super.call(this, engine);
            this._attributes = {};
            this._uniforms = {};
            this.setLoggingName('MaterialBase');
            if (isDefined_1.default(vertexShaderSrc) && !isNull_1.default(vertexShaderSrc)) {
                this._vertexShaderSrc = mustBeString_1.default('vertexShaderSrc', vertexShaderSrc);
            }
            if (isDefined_1.default(fragmentShaderSrc) && !isNull_1.default(fragmentShaderSrc)) {
                this._fragmentShaderSrc = mustBeString_1.default('fragmentShaderSrc', fragmentShaderSrc);
            }
            this._attribs = mustBeArray_1.default('attribs', attribs);
        }
        MaterialBase.prototype.destructor = function (level) {
            if (level === 0) {
                this.cleanUp();
            }
            mustBeUndefined_1.default(this._type, this._program);
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        MaterialBase.prototype.contextGain = function (context) {
            var gl = context.gl;
            if (!this._program && isString_1.default(this._vertexShaderSrc) && isString_1.default(this._fragmentShaderSrc)) {
                this._program = makeWebGLProgram_1.default(gl, this._vertexShaderSrc, this._fragmentShaderSrc, this._attribs);
                this._attributes = {};
                this._uniforms = {};
                var aLen = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
                for (var a = 0; a < aLen; a++) {
                    var attribInfo = gl.getActiveAttrib(this._program, a);
                    this._attributes[attribInfo.name] = new AttribLocation_1.default(attribInfo);
                }
                var uLen = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
                for (var u = 0; u < uLen; u++) {
                    var uniformInfo = gl.getActiveUniform(this._program, u);
                    this._uniforms[uniformInfo.name] = new UniformLocation_1.default(uniformInfo);
                }
                for (var aName in this._attributes) {
                    if (this._attributes.hasOwnProperty(aName)) {
                        this._attributes[aName].contextGain(gl, this._program);
                    }
                }
                for (var uName in this._uniforms) {
                    if (this._uniforms.hasOwnProperty(uName)) {
                        this._uniforms[uName].contextGain(gl, this._program);
                    }
                }
            }
            _super.prototype.contextGain.call(this, context);
        };
        MaterialBase.prototype.contextLost = function () {
            this._program = void 0;
            for (var aName in this._attributes) {
                if (this._attributes.hasOwnProperty(aName)) {
                    this._attributes[aName].contextLost();
                }
            }
            for (var uName in this._uniforms) {
                if (this._uniforms.hasOwnProperty(uName)) {
                    this._uniforms[uName].contextLost();
                }
            }
            _super.prototype.contextLost.call(this);
        };
        MaterialBase.prototype.contextFree = function (context) {
            if (this._program) {
                var gl = context.gl;
                if (gl) {
                    if (!gl.isContextLost()) {
                        gl.deleteProgram(this._program);
                    }
                    else {
                    }
                }
                else {
                    console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
                }
                this._program = void 0;
            }
            for (var aName in this._attributes) {
                if (this._attributes.hasOwnProperty(aName)) {
                    this._attributes[aName].contextFree();
                }
            }
            for (var uName in this._uniforms) {
                if (this._uniforms.hasOwnProperty(uName)) {
                    this._uniforms[uName].contextFree();
                }
            }
            _super.prototype.contextFree.call(this, context);
        };
        MaterialBase.prototype.use = function () {
            var gl = this.gl;
            if (gl) {
                gl.useProgram(this._program);
            }
            else {
                console.warn(this._type + ".use() missing WebGL rendering context.");
            }
        };
        Object.defineProperty(MaterialBase.prototype, "vertexShaderSrc", {
            get: function () {
                return this._vertexShaderSrc;
            },
            set: function (vertexShaderSrc) {
                this._vertexShaderSrc = mustBeString_1.default('vertexShaderSrc', vertexShaderSrc);
                if (this.contextProvider) {
                    this.contextProvider.addRef();
                    var contextProvider = this.contextProvider;
                    try {
                        this.contextFree(contextProvider);
                        this.contextGain(contextProvider);
                    }
                    finally {
                        contextProvider.release();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "fragmentShaderSrc", {
            get: function () {
                return this._fragmentShaderSrc;
            },
            set: function (fragmentShaderSrc) {
                this._fragmentShaderSrc = mustBeString_1.default('fragmentShaderSrc', fragmentShaderSrc);
                if (this.contextProvider) {
                    this.contextProvider.addRef();
                    var contextProvider = this.contextProvider;
                    try {
                        this.contextFree(contextProvider);
                        this.contextGain(contextProvider);
                    }
                    finally {
                        contextProvider.release();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "attributeNames", {
            get: function () {
                var attributes = this._attributes;
                if (attributes) {
                    return Object.keys(attributes);
                }
                else {
                    return void 0;
                }
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('attributeNames').message);
            },
            enumerable: true,
            configurable: true
        });
        MaterialBase.prototype.enableAttrib = function (name) {
            var attribLoc = this._attributes[name];
            if (attribLoc) {
                attribLoc.enable();
            }
        };
        MaterialBase.prototype.enableAttribs = function () {
            var attribLocations = this._attributes;
            if (attribLocations) {
                var aNames = Object.keys(attribLocations);
                for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                    attribLocations[aNames[i]].enable();
                }
            }
        };
        MaterialBase.prototype.disableAttrib = function (name) {
            var attribLoc = this._attributes[name];
            if (attribLoc) {
                attribLoc.disable();
            }
        };
        MaterialBase.prototype.disableAttribs = function () {
            var attribLocations = this._attributes;
            if (attribLocations) {
                var aNames = Object.keys(attribLocations);
                for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                    attribLocations[aNames[i]].disable();
                }
            }
        };
        MaterialBase.prototype.getAttribLocation = function (name) {
            var attribLoc = this._attributes[name];
            if (attribLoc) {
                return attribLoc.index;
            }
            else {
                return -1;
            }
        };
        MaterialBase.prototype.getUniformLocation = function (name) {
            var uniforms = this._uniforms;
            if (uniforms[name]) {
                return this._uniforms[name];
            }
            else {
                var msg = "uniform " + name + " not found.";
                switch (config_1.default.errorMode) {
                    case ErrorMode_1.default.WARNME: {
                        console.warn(msg);
                        return new UniformLocation_1.default(null);
                    }
                    case ErrorMode_1.default.IGNORE: {
                        return new UniformLocation_1.default(null);
                    }
                    default: {
                        throw new Error(msg);
                    }
                }
            }
        };
        MaterialBase.prototype.hasUniformLocation = function (name) {
            return isDefined_1.default(this._uniforms[name]);
        };
        MaterialBase.prototype.vertexPointer = function (name, size, normalized, stride, offset) {
            var attributeLocation = this._attributes[name];
            attributeLocation.vertexPointer(size, normalized, stride, offset);
        };
        MaterialBase.prototype.uniform1f = function (name, x) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform1f(x);
            }
        };
        MaterialBase.prototype.uniform2f = function (name, x, y) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform2f(x, y);
            }
        };
        MaterialBase.prototype.uniform3f = function (name, x, y, z) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform3f(x, y, z);
            }
        };
        MaterialBase.prototype.uniform4f = function (name, x, y, z, w) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform4f(x, y, z, w);
            }
        };
        MaterialBase.prototype.mat2 = function (name, matrix, transpose) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.matrix2fv(transpose, matrix.elements);
            }
        };
        MaterialBase.prototype.mat3 = function (name, matrix, transpose) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.matrix3fv(transpose, matrix.elements);
            }
        };
        MaterialBase.prototype.mat4 = function (name, matrix, transpose) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.matrix4fv(transpose, matrix.elements);
            }
        };
        MaterialBase.prototype.vec2 = function (name, vector) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform2f(vector.x, vector.y);
            }
        };
        MaterialBase.prototype.vec3 = function (name, vector) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform3f(vector.x, vector.y, vector.z);
            }
        };
        MaterialBase.prototype.vec4 = function (name, vector) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform4f(vector.x, vector.y, vector.z, vector.w);
            }
        };
        MaterialBase.prototype.vector2fv = function (name, data) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform2fv(data);
            }
        };
        MaterialBase.prototype.vector3fv = function (name, data) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform3fv(data);
            }
        };
        MaterialBase.prototype.vector4fv = function (name, data) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform4fv(data);
            }
        };
        return MaterialBase;
    })(ShareableContextConsumer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MaterialBase;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/HTMLScriptsMaterial',["require", "exports", '../base/incLevel', '../checks/isString', '../checks/mustBeArray', '../checks/mustBeObject', '../checks/mustBeString', '../checks/mustSatisfy', './MaterialBase'], function (require, exports, incLevel_1, isString_1, mustBeArray_1, mustBeObject_1, mustBeString_1, mustSatisfy_1, MaterialBase_1) {
    function getHTMLElementById(elementId, dom) {
        var element = dom.getElementById(mustBeString_1.default('elementId', elementId));
        if (element) {
            return element;
        }
        else {
            throw new Error("'" + elementId + "' is not a valid element identifier.");
        }
    }
    function vertexShaderSrc(vsId, dom) {
        mustBeString_1.default('vsId', vsId);
        mustBeObject_1.default('dom', dom);
        return getHTMLElementById(vsId, dom).textContent;
    }
    function fragmentShaderSrc(fsId, dom) {
        mustBeString_1.default('fsId', fsId);
        mustBeObject_1.default('dom', dom);
        return getHTMLElementById(fsId, dom).textContent;
    }
    function assign(elementId, dom, result) {
        var htmlElement = dom.getElementById(elementId);
        if (htmlElement instanceof HTMLScriptElement) {
            var script = htmlElement;
            if (isString_1.default(script.type)) {
                if (script.type.indexOf('vertex') >= 0) {
                    result[0] = elementId;
                }
                else if (script.type.indexOf('fragment') >= 0) {
                    result[1] = elementId;
                }
                else {
                }
            }
            if (isString_1.default(script.textContent)) {
                if (script.textContent.indexOf('gl_Position') >= 0) {
                    result[0] = elementId;
                }
                else if (script.textContent.indexOf('gl_FragColor') >= 0) {
                    result[1] = elementId;
                }
                else {
                }
            }
        }
    }
    function detectShaderType(scriptIds, dom) {
        var result = [scriptIds[0], scriptIds[1]];
        assign(scriptIds[0], dom, result);
        assign(scriptIds[1], dom, result);
        return result;
    }
    var HTMLScriptsMaterial = (function (_super) {
        __extends(HTMLScriptsMaterial, _super);
        function HTMLScriptsMaterial(scriptIds, dom, attribs, engine) {
            _super.call(this, void 0, void 0, attribs, engine);
            this.loaded = false;
            this.setLoggingName('HTMLScriptsMaterial');
            mustBeArray_1.default('scriptIds', scriptIds);
            mustSatisfy_1.default('scriptIds', scriptIds.length === 2, function () { return 'have two script element identifiers.'; });
            this.scriptIds = [scriptIds[0], scriptIds[1]];
            this.dom = dom;
        }
        HTMLScriptsMaterial.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        HTMLScriptsMaterial.prototype.contextGain = function (contextProvider) {
            if (!this.loaded) {
                var scriptIds = detectShaderType(this.scriptIds, this.dom);
                this.vertexShaderSrc = vertexShaderSrc(scriptIds[0], this.dom);
                this.fragmentShaderSrc = fragmentShaderSrc(scriptIds[1], this.dom);
                this.loaded = true;
            }
            _super.prototype.contextGain.call(this, contextProvider);
        };
        return HTMLScriptsMaterial;
    })(MaterialBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HTMLScriptsMaterial;
});

define('davinci-eight/core/getAttribVarName',["require", "exports", '../checks/isDefined', '../checks/mustBeObject', '../checks/mustBeString'], function (require, exports, isDefined_1, mustBeObject_1, mustBeString_1) {
    function getAttribVarName(attribute, varName) {
        mustBeObject_1.default('attribute', attribute);
        mustBeString_1.default('varName', varName);
        return isDefined_1.default(attribute.name) ? mustBeString_1.default('attribute.name', attribute.name) : varName;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getAttribVarName;
});

define('davinci-eight/materials/glslAttribType',["require", "exports", '../core/GraphicsProgramSymbols', '../checks/mustBeInteger', '../checks/mustBeString'], function (require, exports, GraphicsProgramSymbols_1, mustBeInteger_1, mustBeString_1) {
    function sizeType(size) {
        mustBeInteger_1.default('size', size);
        switch (size) {
            case 1:
                {
                    return 'float';
                }
                break;
            case 2:
                {
                    return 'vec2';
                }
                break;
            case 3:
                {
                    return 'vec3';
                }
                break;
            case 4:
                {
                    return 'vec4';
                }
                break;
            default: {
                throw new Error("Can't compute the GLSL attribute type from size " + size);
            }
        }
    }
    function glslAttribType(key, size) {
        mustBeString_1.default('key', key);
        mustBeInteger_1.default('size', size);
        switch (key) {
            case GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR:
                {
                    return 'vec3';
                }
                break;
            default: {
                return sizeType(size);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = glslAttribType;
});

define('davinci-eight/materials/fragmentShaderSrc',["require", "exports", '../config', '../checks/mustBeBoolean', '../checks/mustBeDefined'], function (require, exports, config_1, mustBeBoolean_1, mustBeDefined_1) {
    var emitFragmentPrecision = false;
    function default_1(attributes, uniforms, vColor, vLight) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniforms', uniforms);
        mustBeBoolean_1.default('vColor', vColor);
        mustBeBoolean_1.default('vLight', vLight);
        var lines = [];
        lines.push("// fragment shader generated by " + config_1.default.NAMESPACE + " " + config_1.default.VERSION);
        if (emitFragmentPrecision) {
            lines.push("#ifdef GL_ES");
            lines.push("#  ifdef GL_FRAGMENT_PRECISION_HIGH");
            lines.push("precision highp float;");
            lines.push("#  else");
            lines.push("precision mediump float;");
            lines.push("#  endif");
            lines.push("#endif");
        }
        if (vColor) {
            lines.push("varying highp vec4 vColor;");
        }
        if (vLight) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void) {");
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
        lines.push("");
        var code = lines.join("\n");
        return code;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/getUniformVarName',["require", "exports", '../checks/isDefined', '../checks/expectArg'], function (require, exports, isDefined_1, expectArg_1) {
    function getUniformVarName(uniform, varName) {
        expectArg_1.default('uniform', uniform).toBeObject();
        expectArg_1.default('varName', varName).toBeString();
        return isDefined_1.default(uniform.name) ? expectArg_1.default('uniform.name', uniform.name).toBeString().value : varName;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getUniformVarName;
});

define('davinci-eight/materials/vertexShaderSrc',["require", "exports", '../config', '../core/getAttribVarName', '../core/getUniformVarName', '../checks/mustBeBoolean', '../checks/mustBeDefined', '../core/GraphicsProgramSymbols'], function (require, exports, config_1, getAttribVarName_1, getUniformVarName_1, mustBeBoolean_1, mustBeDefined_1, GraphicsProgramSymbols_1) {
    function getUniformCodeName(uniforms, name) {
        return getUniformVarName_1.default(uniforms[name], name);
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
    function default_1(attributes, uniforms, vColor, vLight) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniforms', uniforms);
        mustBeBoolean_1.default('vColor', vColor);
        mustBeBoolean_1.default('vLight', vLight);
        var lines = [];
        lines.push("// vertex shader generated by " + config_1.default.NAMESPACE + " " + config_1.default.VERSION);
        for (var aName in attributes) {
            if (attributes.hasOwnProperty(aName)) {
                lines.push(ATTRIBUTE + attributes[aName].glslType + SPACE + getAttribVarName_1.default(attributes[aName], aName) + SEMICOLON);
            }
        }
        for (var uName in uniforms) {
            if (uniforms.hasOwnProperty(uName)) {
                lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
            }
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
        if (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION]) {
            switch (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION].glslType) {
                case 'float':
                    {
                        glPosition.unshift(RPAREN);
                        glPosition.unshift('1.0');
                        glPosition.unshift(COMMA);
                        glPosition.unshift('0.0');
                        glPosition.unshift(COMMA);
                        glPosition.unshift('0.0');
                        glPosition.unshift(COMMA);
                        glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
                        glPosition.unshift(LPAREN);
                        glPosition.unshift('vec4');
                    }
                    break;
                case 'vec2':
                    {
                        glPosition.unshift(RPAREN);
                        glPosition.unshift('1.0');
                        glPosition.unshift(COMMA);
                        glPosition.unshift('0.0');
                        glPosition.unshift(COMMA);
                        glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
                        glPosition.unshift(LPAREN);
                        glPosition.unshift('vec4');
                    }
                    break;
                case 'vec3':
                    {
                        glPosition.unshift(RPAREN);
                        glPosition.unshift('1.0');
                        glPosition.unshift(COMMA);
                        glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
                        glPosition.unshift(LPAREN);
                        glPosition.unshift('vec4');
                    }
                    break;
                case 'vec4':
                    {
                        glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
                    }
                    break;
            }
        }
        else {
            glPosition.unshift("vec4(0.0, 0.0, 0.0, 1.0)");
        }
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_ONE_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_ONE_MATRIX));
        }
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_TWO_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_TWO_MATRIX));
        }
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX));
        }
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX));
        }
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX));
        }
        glPosition.unshift(ASSIGN);
        glPosition.unshift("gl_Position");
        glPosition.unshift('  ');
        lines.push(glPosition.join(''));
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE]) {
            lines.push("  gl_PointSize = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE) + ";");
        }
        if (vColor) {
            if (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR]) {
                var colorAttribVarName = getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR], GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR);
                switch (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR].glslType) {
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
                        throw new Error("Unexpected type for color attribute: " + attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR].glslType);
                    }
                }
            }
            else if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR]) {
                var colorUniformVarName = getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_COLOR);
                switch (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR].glslType) {
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
                        throw new Error("Unexpected type for color uniform: " + uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR].glslType);
                    }
                }
            }
            else {
                lines.push("  vColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        if (vLight) {
            if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX] && attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL]) {
                lines.push("  vec3 L = normalize(" + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");");
                lines.push("  vec3 N = normalize(" + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL], GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL) + ");");
                lines.push("  // The minus sign arises because L is the light direction, so we need dot(N, -L) = -dot(N, L)");
                lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(-dot(N, L), 0.0);");
                if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT]) {
                    lines.push("  vLight = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT) + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
                }
                else {
                    lines.push("  vLight = " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
                }
            }
            else {
                if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT]) {
                    lines.push("  vLight = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT) + ";");
                }
                else {
                    lines.push("  vLight = vec3(1.0, 1.0, 1.0);");
                }
            }
        }
        lines.push("}");
        lines.push("");
        var code = lines.join("\n");
        return code;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/SmartGraphicsProgram',["require", "exports", './fragmentShaderSrc', './MaterialBase', './vertexShaderSrc'], function (require, exports, fragmentShaderSrc_1, MaterialBase_1, vertexShaderSrc_1) {
    var SmartGraphicsProgram = (function (_super) {
        __extends(SmartGraphicsProgram, _super);
        function SmartGraphicsProgram(aParams, uParams, vColor, vLight, engine) {
            _super.call(this, vertexShaderSrc_1.default(aParams, uParams, vColor, vLight), fragmentShaderSrc_1.default(aParams, uParams, vColor, vLight), [], engine);
            this.setLoggingName('SmartGraphicsProgram');
        }
        SmartGraphicsProgram.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return SmartGraphicsProgram;
    })(MaterialBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SmartGraphicsProgram;
});

define('davinci-eight/materials/vColorRequired',["require", "exports", '../core/GraphicsProgramSymbols'], function (require, exports, GraphicsProgramSymbols_1) {
    function vColorRequired(attributes, uniforms) {
        return !!attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vColorRequired;
});

define('davinci-eight/materials/vLightRequired',["require", "exports", '../checks/mustBeDefined', '../core/GraphicsProgramSymbols'], function (require, exports, mustBeDefined_1, GraphicsProgramSymbols_1) {
    function vLightRequired(attributes, uniforms) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniforms', uniforms);
        return !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vLightRequired;
});

define('davinci-eight/materials/GraphicsProgramBuilder',["require", "exports", '../core/getAttribVarName', './glslAttribType', '../checks/mustBeInteger', '../checks/mustBeString', '../materials/SmartGraphicsProgram', './vColorRequired', './vLightRequired', './fragmentShaderSrc', './vertexShaderSrc'], function (require, exports, getAttribVarName_1, glslAttribType_1, mustBeInteger_1, mustBeString_1, SmartGraphicsProgram_1, vColorRequired_1, vLightRequired_1, fragmentShaderSrc_1, vertexShaderSrc_1) {
    function computeAttribParams(values) {
        var result = {};
        var keys = Object.keys(values);
        var keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var attribute = values[key];
            var size = mustBeInteger_1.default('size', attribute.size);
            var varName = getAttribVarName_1.default(attribute, key);
            result[varName] = { glslType: glslAttribType_1.default(key, size) };
        }
        return result;
    }
    var GraphicsProgramBuilder = (function () {
        function GraphicsProgramBuilder(primitive) {
            this.aMeta = {};
            this.uParams = {};
            if (primitive) {
                var attributes = primitive.attributes;
                var keys = Object.keys(attributes);
                for (var i = 0, iLength = keys.length; i < iLength; i++) {
                    var key = keys[i];
                    var attribute = attributes[key];
                    this.attribute(key, attribute.size);
                }
            }
        }
        GraphicsProgramBuilder.prototype.attribute = function (name, size) {
            mustBeString_1.default('name', name);
            mustBeInteger_1.default('size', size);
            this.aMeta[name] = { size: size };
            return this;
        };
        GraphicsProgramBuilder.prototype.uniform = function (name, type) {
            mustBeString_1.default('name', name);
            mustBeString_1.default('type', type);
            this.uParams[name] = { glslType: type };
            return this;
        };
        GraphicsProgramBuilder.prototype.build = function (engine) {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return new SmartGraphicsProgram_1.default(aParams, this.uParams, vColor, vLight, engine);
        };
        GraphicsProgramBuilder.prototype.vertexShaderSrc = function () {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return vertexShaderSrc_1.default(aParams, this.uParams, vColor, vLight);
        };
        GraphicsProgramBuilder.prototype.fragmentShaderSrc = function () {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return fragmentShaderSrc_1.default(aParams, this.uParams, vColor, vLight);
        };
        return GraphicsProgramBuilder;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphicsProgramBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/LineMaterial',["require", "exports", '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols', '../base/incLevel', '../checks/isDefined', '../checks/isNull', '../checks/isUndefined', './MaterialBase', '../checks/mustBeObject'], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, incLevel_1, isDefined_1, isNull_1, isUndefined_1, MaterialBase_1, mustBeObject_1) {
    function builder(options) {
        if (isNull_1.default(options) || isUndefined_1.default(options)) {
            options = { attributes: {}, uniforms: {} };
            options.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
        }
        else {
            mustBeObject_1.default('options', options);
        }
        var attributes = isDefined_1.default(options.attributes) ? options.attributes : {};
        var uniforms = isDefined_1.default(options.uniforms) ? options.uniforms : {};
        var gpb = new GraphicsProgramBuilder_1.default();
        var aNames = Object.keys(attributes);
        for (var a = 0; a < aNames.length; a++) {
            var aName = aNames[a];
            var size = attributes[aName];
            gpb.attribute(aName, size);
        }
        var uNames = Object.keys(uniforms);
        for (var u = 0; u < uNames.length; u++) {
            var uName = uNames[u];
            var type = uniforms[uName];
            gpb.uniform(uName, type);
        }
        return gpb;
    }
    function vertexShaderSrc(options) {
        return builder(options).vertexShaderSrc();
    }
    function fragmentShaderSrc(options) {
        return builder(options).fragmentShaderSrc();
    }
    var LineMaterial = (function (_super) {
        __extends(LineMaterial, _super);
        function LineMaterial(options, engine) {
            _super.call(this, vertexShaderSrc(options), fragmentShaderSrc(options), [], engine);
            this.setLoggingName('LineMaterial');
        }
        LineMaterial.prototype.destructor = function (level) {
            if (level === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        return LineMaterial;
    })(MaterialBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LineMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/MeshMaterial',["require", "exports", '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols', '../base/incLevel', '../checks/isDefined', '../checks/isNull', '../checks/isUndefined', './MaterialBase', '../checks/mustBeObject'], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, incLevel_1, isDefined_1, isNull_1, isUndefined_1, MaterialBase_1, mustBeObject_1) {
    function builder(options) {
        if (isUndefined_1.default(options) || isNull_1.default(options)) {
            options = { attributes: {}, uniforms: {} };
            options.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
            options.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = 3;
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX] = 'mat3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT] = 'vec3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
        }
        else {
            mustBeObject_1.default('options', options);
        }
        var attributes = isDefined_1.default(options.attributes) ? options.attributes : {};
        var uniforms = isDefined_1.default(options.uniforms) ? options.uniforms : {};
        var gpb = new GraphicsProgramBuilder_1.default();
        var aNames = Object.keys(attributes);
        for (var a = 0; a < aNames.length; a++) {
            var aName = aNames[a];
            var size = attributes[aName];
            gpb.attribute(aName, size);
        }
        var uNames = Object.keys(uniforms);
        for (var u = 0; u < uNames.length; u++) {
            var uName = uNames[u];
            var type = uniforms[uName];
            gpb.uniform(uName, type);
        }
        return gpb;
    }
    function vertexShaderSrc(options) {
        return builder(options).vertexShaderSrc();
    }
    function fragmentShaderSrc(options) {
        return builder(options).fragmentShaderSrc();
    }
    var MeshMaterial = (function (_super) {
        __extends(MeshMaterial, _super);
        function MeshMaterial(options, engine) {
            _super.call(this, vertexShaderSrc(options), fragmentShaderSrc(options), [], engine);
            this.setLoggingName('MeshMaterial');
        }
        MeshMaterial.prototype.destructor = function (level) {
            if (level === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        return MeshMaterial;
    })(MaterialBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MeshMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/MeshNormalMaterial',["require", "exports", '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols', './MaterialBase'], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, MaterialBase_1) {
    function builder() {
        var gpb = new GraphicsProgramBuilder_1.default();
        gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
        gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
        return gpb;
    }
    function vertexShaderSrc() {
        return builder().vertexShaderSrc();
    }
    function fragmentShaderSrc() {
        return builder().fragmentShaderSrc();
    }
    var MeshNormalMaterial = (function (_super) {
        __extends(MeshNormalMaterial, _super);
        function MeshNormalMaterial() {
            _super.call(this, vertexShaderSrc(), fragmentShaderSrc(), [], null);
            this.setLoggingName('MeshNormalMaterial');
        }
        return MeshNormalMaterial;
    })(MaterialBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MeshNormalMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/PointMaterial',["require", "exports", '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols', '../checks/isDefined', '../checks/isNull', '../checks/isUndefined', './MaterialBase', '../checks/mustBeObject'], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, isDefined_1, isNull_1, isUndefined_1, MaterialBase_1, mustBeObject_1) {
    function builder(options) {
        if (isNull_1.default(options) || isUndefined_1.default(options)) {
            options = { attributes: {}, uniforms: {} };
            options.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE] = 'float';
        }
        else {
            mustBeObject_1.default('options', options);
        }
        var attributes = isDefined_1.default(options.attributes) ? options.attributes : {};
        var uniforms = isDefined_1.default(options.uniforms) ? options.uniforms : {};
        var gpb = new GraphicsProgramBuilder_1.default();
        var aNames = Object.keys(attributes);
        for (var a = 0; a < aNames.length; a++) {
            var aName = aNames[a];
            var size = attributes[aName];
            gpb.attribute(aName, size);
        }
        var uNames = Object.keys(uniforms);
        for (var u = 0; u < uNames.length; u++) {
            var uName = uNames[u];
            var type = uniforms[uName];
            gpb.uniform(uName, type);
        }
        return gpb;
    }
    function vertexShaderSrc(options) {
        return builder(options).vertexShaderSrc();
    }
    function fragmentShaderSrc(options) {
        return builder(options).fragmentShaderSrc();
    }
    var PointMaterial = (function (_super) {
        __extends(PointMaterial, _super);
        function PointMaterial(options, engine) {
            _super.call(this, vertexShaderSrc(options), fragmentShaderSrc(options), [], engine);
            this.setLoggingName('PointMaterial');
        }
        PointMaterial.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return PointMaterial;
    })(MaterialBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointMaterial;
});

define('davinci-eight/utils/mergeStringMapList',["require", "exports"], function (require, exports) {
    function mergeStringMapList(ms) {
        var result = {};
        ms.forEach(function (m) {
            var keys = Object.keys(m);
            var keysLength = keys.length;
            for (var i = 0; i < keysLength; i++) {
                var key = keys[i];
                var value = m[key];
                result[key] = value;
            }
        });
        return result;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mergeStringMapList;
});

define('davinci-eight/materials/smartProgram',["require", "exports", './fragmentShaderSrc', '../utils/mergeStringMapList', '../checks/mustBeDefined', './MaterialBase', './vColorRequired', './vertexShaderSrc', './vLightRequired'], function (require, exports, fragmentShaderSrc_1, mergeStringMapList_1, mustBeDefined_1, MaterialBase_1, vColorRequired_1, vertexShaderSrc_1, vLightRequired_1) {
    function smartProgram(attributes, uniformsList, bindings, engine) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniformsList', uniformsList);
        var uniforms = mergeStringMapList_1.default(uniformsList);
        var vColor = vColorRequired_1.default(attributes, uniforms);
        var vLight = vLightRequired_1.default(attributes, uniforms);
        return new MaterialBase_1.default(vertexShaderSrc_1.default(attributes, uniforms, vColor, vLight), fragmentShaderSrc_1.default(attributes, uniforms, vColor, vLight), bindings, engine);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = smartProgram;
});

define('davinci-eight/materials/programFromScripts',["require", "exports", '../checks/mustBeObject', '../checks/mustBeString', './MaterialBase'], function (require, exports, mustBeObject_1, mustBeString_1, MaterialBase_1) {
    function programFromScripts(vsId, fsId, dom, attribs, engine) {
        mustBeString_1.default('vsId', vsId);
        mustBeString_1.default('fsId', fsId);
        mustBeObject_1.default('dom', dom);
        function $(elementId) {
            var element = dom.getElementById(mustBeString_1.default('elementId', elementId));
            if (element) {
                return element;
            }
            else {
                throw new Error(elementId + " is not a valid DOM element identifier.");
            }
        }
        var vertexShaderSrc = $(vsId).textContent;
        var fragmentShaderSrc = $(fsId).textContent;
        return new MaterialBase_1.default(vertexShaderSrc, fragmentShaderSrc, attribs, engine);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = programFromScripts;
});

define('davinci-eight/math/mathcore',["require", "exports"], function (require, exports) {
    var abs = Math.abs;
    var acos = Math.acos;
    var asin = Math.asin;
    var atan = Math.atan;
    var cos = Math.cos;
    var exp = Math.exp;
    var log = Math.log;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var tan = Math.tan;
    function isCallableMethod(x, name) {
        return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
    }
    function makeUnaryUniversalFunction(methodName, primitiveFunction) {
        return function (x) {
            var something = x;
            if (isCallableMethod(x, methodName)) {
                return something[methodName]();
            }
            else if (typeof x === 'number') {
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
        return (exp(x) + exp(-x)) / 2;
    }
    function sinh(x) {
        return (exp(x) - exp(-x)) / 2;
    }
    function tanh(x) {
        return sinh(x) / cosh(x);
    }
    function quad(x) {
        return x * x;
    }
    var mathcore = {
        acos: makeUnaryUniversalFunction('acos', acos),
        asin: makeUnaryUniversalFunction('asin', asin),
        atan: makeUnaryUniversalFunction('atan', atan),
        cos: makeUnaryUniversalFunction('cos', cos),
        cosh: makeUnaryUniversalFunction('cosh', cosh),
        exp: makeUnaryUniversalFunction('exp', exp),
        log: makeUnaryUniversalFunction('log', log),
        norm: makeUnaryUniversalFunction('norm', abs),
        quad: makeUnaryUniversalFunction('quad', quad),
        sin: makeUnaryUniversalFunction('sin', sin),
        sinh: makeUnaryUniversalFunction('sinh', sinh),
        sqrt: makeUnaryUniversalFunction('sqrt', sqrt),
        tan: makeUnaryUniversalFunction('tan', tan),
        tanh: makeUnaryUniversalFunction('tanh', tanh),
        Math: {
            cosh: cosh,
            sinh: sinh
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mathcore;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Vector4',["require", "exports", '../math/Coords'], function (require, exports, Coords_1) {
    var Vector4 = (function (_super) {
        __extends(Vector4, _super);
        function Vector4(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 4);
        }
        Object.defineProperty(Vector4.prototype, "x", {
            get: function () {
                return this.coords[0];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.coords[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "y", {
            get: function () {
                return this.coords[1];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.coords[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "z", {
            get: function () {
                return this.coords[2];
            },
            set: function (value) {
                this.modified = this.modified || this.z !== value;
                this.coords[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "w", {
            get: function () {
                return this.coords[3];
            },
            set: function (value) {
                this.modified = this.modified || this.w !== value;
                this.coords[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector4.prototype.setW = function (w) {
            this.w = w;
            return this;
        };
        Vector4.prototype.add = function (vector, α) {
            if (α === void 0) { α = 1; }
            this.x += vector.x * α;
            this.y += vector.y * α;
            this.z += vector.z * α;
            this.w += vector.w * α;
            return this;
        };
        Vector4.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.w = a.w + b.w;
            return this;
        };
        Vector4.prototype.applyMatrix = function (σ) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var w = this.w;
            var e = σ.elements;
            this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC] * w;
            this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD] * w;
            this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE] * w;
            this.w = e[0x3] * x + e[0x7] * y + e[0xB] * z + e[0xF] * w;
            return this;
        };
        Vector4.prototype.approx = function (n) {
            _super.prototype.approx.call(this, n);
            return this;
        };
        Vector4.prototype.clone = function () {
            return new Vector4([this.x, this.y, this.z, this.w], this.modified);
        };
        Vector4.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = v.w;
            return this;
        };
        Vector4.prototype.divByScalar = function (α) {
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.w /= α;
            return this;
        };
        Vector4.prototype.lerp = function (target, α) {
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.w += (target.w - this.w) * α;
            return this;
        };
        Vector4.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        Vector4.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
            return this;
        };
        Vector4.prototype.scale = function (α) {
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.w *= α;
            return this;
        };
        Vector4.prototype.reflect = function (n) {
            return this;
        };
        Vector4.prototype.rotate = function (rotor) {
            return this;
        };
        Vector4.prototype.stress = function (σ) {
            this.x *= σ.x;
            this.y *= σ.y;
            this.z *= σ.z;
            this.w *= σ.w;
            return this;
        };
        Vector4.prototype.slerp = function (target, α) {
            return this;
        };
        Vector4.prototype.sub = function (v, α) {
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            this.w -= v.w * α;
            return this;
        };
        Vector4.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;
            return this;
        };
        Vector4.prototype.magnitude = function () {
            throw new Error("TODO: Vector4.magnitude()");
        };
        Vector4.prototype.squaredNorm = function () {
            throw new Error("TODO: Vector4.squaredNorm()");
        };
        Vector4.prototype.toExponential = function (fractionDigits) {
            return "TODO Vector4.toExponential";
        };
        Vector4.prototype.toFixed = function (fractionDigits) {
            return "TODO Vector4.toFixed";
        };
        Vector4.prototype.toPrecision = function (precision) {
            return "TODO Vector4.toFixed";
        };
        Vector4.prototype.toString = function (radix) {
            return "TODO Vector4.toString";
        };
        Vector4.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
            return this;
        };
        return Vector4;
    })(Coords_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector4;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/overlay/base/Board',["require", "exports", '../../base/incLevel', '../../core/ShareableBase'], function (require, exports, incLevel_1, ShareableBase_1) {
    var Board = (function (_super) {
        __extends(Board, _super);
        function Board(container, renderer) {
            _super.call(this);
            this.setLoggingName('Board');
            this.container = container;
            this.renderer = renderer;
        }
        Board.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        return Board;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Board;
});

define('davinci-eight/overlay/renderers/AbstractRenderer',["require", "exports"], function (require, exports) {
    var AbstractRenderer = (function () {
        function AbstractRenderer() {
        }
        return AbstractRenderer;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractRenderer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/overlay/renderers/CanvasRenderer',["require", "exports", './AbstractRenderer'], function (require, exports, AbstractRenderer_1) {
    var CanvasRenderer = (function (_super) {
        __extends(CanvasRenderer, _super);
        function CanvasRenderer(domElement, dimensions) {
            _super.call(this);
        }
        return CanvasRenderer;
    })(AbstractRenderer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CanvasRenderer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/overlay/renderers/NoRenderer',["require", "exports", './AbstractRenderer'], function (require, exports, AbstractRenderer_1) {
    var NoRenderer = (function (_super) {
        __extends(NoRenderer, _super);
        function NoRenderer() {
            _super.apply(this, arguments);
        }
        return NoRenderer;
    })(AbstractRenderer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NoRenderer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/overlay/renderers/SVGRenderer',["require", "exports", './AbstractRenderer'], function (require, exports, AbstractRenderer_1) {
    var SVGRenderer = (function (_super) {
        __extends(SVGRenderer, _super);
        function SVGRenderer(domElement, dimensions) {
            _super.call(this);
        }
        return SVGRenderer;
    })(AbstractRenderer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SVGRenderer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/overlay/base/GeometryElement',["require", "exports", '../../base/incLevel', '../../core/ShareableBase'], function (require, exports, incLevel_1, ShareableBase_1) {
    var GeometryElement = (function (_super) {
        __extends(GeometryElement, _super);
        function GeometryElement() {
            _super.call(this);
            this.setLoggingName('GeometryElement');
        }
        GeometryElement.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        return GeometryElement;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryElement;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/overlay/base/Text',["require", "exports", './GeometryElement', '../../base/incLevel'], function (require, exports, GeometryElement_1, incLevel_1) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text() {
            _super.call(this);
            this.setLoggingName('Text');
        }
        Text.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        return Text;
    })(GeometryElement_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Text;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/overlay/renderers/VMLRenderer',["require", "exports", './AbstractRenderer'], function (require, exports, AbstractRenderer_1) {
    var VMLRenderer = (function (_super) {
        __extends(VMLRenderer, _super);
        function VMLRenderer(domElement) {
            _super.call(this);
        }
        return VMLRenderer;
    })(AbstractRenderer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VMLRenderer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/overlay/Overlay',["require", "exports", './base/Board', './renderers/CanvasRenderer', '../utils/getDimensions', '../base/incLevel', '../checks/mustBeString', '../checks/mustBeObject', './renderers/NoRenderer', '../core/ShareableBase', './renderers/SVGRenderer', './base/Text', './renderers/VMLRenderer'], function (require, exports, Board_1, CanvasRenderer_1, getDimensions_1, incLevel_1, mustBeString_1, mustBeObject_1, NoRenderer_1, ShareableBase_1, SVGRenderer_1, Text_1, VMLRenderer_1) {
    function initRenderer(elementId, dimensions, doc, rendererKind) {
        mustBeString_1.default('elementId', elementId);
        mustBeObject_1.default('dimensions', dimensions);
        mustBeObject_1.default('doc', doc);
        mustBeString_1.default('rendererKin', rendererKind);
        var domElement = doc.getElementById(elementId);
        while (domElement.firstChild) {
            domElement.removeChild(domElement.firstChild);
        }
        if (rendererKind === 'svg') {
            return new SVGRenderer_1.default(domElement, dimensions);
        }
        else if (rendererKind === 'vml') {
            return new VMLRenderer_1.default(domElement);
        }
        else if (rendererKind === 'canvas') {
            return new CanvasRenderer_1.default(domElement, dimensions);
        }
        else {
            return new NoRenderer_1.default();
        }
    }
    var Overlay = (function (_super) {
        __extends(Overlay, _super);
        function Overlay(elementId, options) {
            if (options === void 0) { options = {}; }
            _super.call(this);
            this.setLoggingName('Overlay');
            var dimensions = getDimensions_1.default(elementId, document);
            this.renderer = initRenderer(elementId, dimensions, document, 'svg');
            this.board = new Board_1.default(elementId, this.renderer);
        }
        Overlay.prototype.destructor = function (level) {
            this.board.release();
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Overlay.prototype.createText = function () {
            var text = new Text_1.default();
            return text;
        };
        return Overlay;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Overlay;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/NumberShareableMap',["require", "exports", '../core/ShareableBase'], function (require, exports, ShareableBase_1) {
    var NumberShareableMap = (function (_super) {
        __extends(NumberShareableMap, _super);
        function NumberShareableMap() {
            _super.call(this);
            this._elements = {};
            this.setLoggingName('NumberShareableMap');
        }
        NumberShareableMap.prototype.destructor = function (levelUp) {
            this.forEach(function (key, value) {
                if (value) {
                    value.release();
                }
            });
            this._elements = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        NumberShareableMap.prototype.exists = function (key) {
            var element = this._elements[key];
            return element ? true : false;
        };
        NumberShareableMap.prototype.get = function (key) {
            var element = this.getWeakRef(key);
            if (element) {
                element.addRef();
            }
            return element;
        };
        NumberShareableMap.prototype.getWeakRef = function (index) {
            return this._elements[index];
        };
        NumberShareableMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        NumberShareableMap.prototype.putWeakRef = function (key, value) {
            var elements = this._elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
        };
        NumberShareableMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                var key = keys[i];
                var value = this._elements[key];
                callback(key, value);
            }
        };
        Object.defineProperty(NumberShareableMap.prototype, "keys", {
            get: function () {
                return Object.keys(this._elements).map(function (keyString) { return parseFloat(keyString); });
            },
            enumerable: true,
            configurable: true
        });
        NumberShareableMap.prototype.remove = function (key) {
            this.put(key, void 0);
            delete this._elements[key];
        };
        return NumberShareableMap;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NumberShareableMap;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/StringShareableMap',["require", "exports", '../base/incLevel', '../core/ShareableBase'], function (require, exports, incLevel_1, ShareableBase_1) {
    var StringShareableMap = (function (_super) {
        __extends(StringShareableMap, _super);
        function StringShareableMap() {
            _super.call(this);
            this.elements = {};
            this.setLoggingName('StringShareableMap');
        }
        StringShareableMap.prototype.destructor = function (level) {
            var _this = this;
            this.forEach(function (key) {
                _this.putWeakRef(key, void 0);
            });
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        StringShareableMap.prototype.exists = function (key) {
            var element = this.elements[key];
            return element ? true : false;
        };
        StringShareableMap.prototype.get = function (key) {
            var element = this.elements[key];
            if (element) {
                element.addRef();
                return element;
            }
            else {
                return void 0;
            }
        };
        StringShareableMap.prototype.getWeakRef = function (key) {
            return this.elements[key];
        };
        StringShareableMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        StringShareableMap.prototype.putWeakRef = function (key, value) {
            var elements = this.elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
        };
        StringShareableMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                var key = keys[i];
                callback(key, this.elements[key]);
            }
        };
        Object.defineProperty(StringShareableMap.prototype, "keys", {
            get: function () {
                return Object.keys(this.elements);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StringShareableMap.prototype, "values", {
            get: function () {
                var values = [];
                var keys = this.keys;
                for (var i = 0, iLength = keys.length; i < iLength; i++) {
                    var key = keys[i];
                    values.push(this.elements[key]);
                }
                return values;
            },
            enumerable: true,
            configurable: true
        });
        StringShareableMap.prototype.remove = function (key) {
            var value = this.elements[key];
            delete this.elements[key];
            return value;
        };
        return StringShareableMap;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StringShareableMap;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Arrow',["require", "exports", '../geometries/ArrowGeometry', '../math/Geometric3', '../materials/MeshMaterial', '../core/Mesh', '../checks/mustBeDefined', '../math/quadVectorE3', '../math/R3'], function (require, exports, ArrowGeometry_1, Geometric3_1, MeshMaterial_1, Mesh_1, mustBeDefined_1, quadVectorE3_1, R3_1) {
    function direction(options, fallback) {
        if (options.vector) {
            return R3_1.default.direction(options.vector);
        }
        else {
            return fallback;
        }
    }
    var Arrow = (function (_super) {
        __extends(Arrow, _super);
        function Arrow(options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            _super.call(this, void 0, void 0, options.engine);
            this.setLoggingName('Arrow');
            this.direction0 = direction(options, R3_1.default.e2);
            this._vector = Geometric3_1.default.fromVector(this.direction0);
            var geoOptions = {};
            geoOptions.engine = options.engine;
            var geometry = new ArrowGeometry_1.default(geoOptions);
            var matOptions = void 0;
            var material = new MeshMaterial_1.default(matOptions, options.engine);
            this.geometry = geometry;
            this.material = material;
            geometry.release();
            material.release();
            if (options.color) {
                this.color.copy(options.color);
            }
            if (options.position) {
                this.X.copyVector(options.position);
            }
            var cascade = true;
            this.vectorChangeHandler = function (eventName, key, value, vector) {
                if (cascade) {
                    cascade = false;
                    _this.R.rotorFromDirections(_this.direction0, vector);
                    _this.setPrincipalScale('length', Math.sqrt(quadVectorE3_1.default(vector)));
                    cascade = true;
                }
            };
            this.attitudeChangeHandler = function (eventName, key, value, attitude) {
                if (cascade) {
                    cascade = false;
                    _this._vector.copyVector(_this.direction0).rotate(_this.R).scale(_this.length);
                    cascade = true;
                }
            };
            this._vector.on('change', this.vectorChangeHandler);
            this.R.on('change', this.attitudeChangeHandler);
        }
        Arrow.prototype.destructor = function (levelUp) {
            this._vector.off('change', this.vectorChangeHandler);
            this.R.off('change', this.attitudeChangeHandler);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Arrow.prototype, "length", {
            get: function () {
                return this.getPrincipalScale('length');
            },
            set: function (length) {
                this.setPrincipalScale('length', length);
                var magnitude = Math.sqrt(quadVectorE3_1.default(this._vector));
                this._vector.scale(length / magnitude);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arrow.prototype, "h", {
            get: function () {
                return this._vector;
            },
            set: function (h) {
                mustBeDefined_1.default('h', h);
                this._vector.copyVector(h);
            },
            enumerable: true,
            configurable: true
        });
        return Arrow;
    })(Mesh_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Arrow;
});

define('davinci-eight/visual/direction',["require", "exports", '../math/R3'], function (require, exports, R3_1) {
    function default_1(options) {
        if (options.axis) {
            return R3_1.default.direction(options.axis);
        }
        else {
            return R3_1.default.e2;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/RigidBody',["require", "exports", '../math/Geometric3', '../core/Mesh', '../checks/mustBeObject', '../math/R3', '../math/Unit'], function (require, exports, Geometric3_1, Mesh_1, mustBeObject_1, R3_1, Unit_1) {
    var RigidBody = (function (_super) {
        __extends(RigidBody, _super);
        function RigidBody(geometry, material, engine, initialAxis) {
            _super.call(this, geometry, material, engine);
            this.L = Geometric3_1.default.zero();
            this.m = 1;
            this.P = Geometric3_1.default.zero();
            this.Q = Geometric3_1.default.zero();
            this.setLoggingName('RigidBody');
            this.initialAxis = R3_1.default.fromVector(initialAxis, Unit_1.default.ONE);
        }
        RigidBody.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(RigidBody.prototype, "axis", {
            get: function () {
                return Geometric3_1.default.fromVector(this.initialAxis).rotate(this.R);
            },
            set: function (axis) {
                mustBeObject_1.default('axis', axis);
                this.R.rotorFromDirections(this.initialAxis, axis);
            },
            enumerable: true,
            configurable: true
        });
        return RigidBody;
    })(Mesh_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RigidBody;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Sphere',["require", "exports", './direction', '../base/incLevel', '../checks/isDefined', '../materials/MeshMaterial', '../checks/mustBeNumber', './RigidBody', '../geometries/SphereGeometry'], function (require, exports, direction_1, incLevel_1, isDefined_1, MeshMaterial_1, mustBeNumber_1, RigidBody_1, SphereGeometry_1) {
    var Sphere = (function (_super) {
        __extends(Sphere, _super);
        function Sphere(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, void 0, void 0, options.engine, direction_1.default(options));
            this.setLoggingName('Sphere');
            var geoOptions = {};
            geoOptions.engine = options.engine;
            var geometry = new SphereGeometry_1.default(geoOptions);
            this.geometry = geometry;
            geometry.release();
            var matOptions = void 0;
            var material = new MeshMaterial_1.default(matOptions, options.engine);
            this.material = material;
            material.release();
            if (options.color) {
                this.color.copy(options.color);
            }
            if (options.position) {
                this.X.copyVector(options.position);
            }
            this.radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default('radius', options.radius) : 1.0;
        }
        Sphere.prototype.destructor = function (level) {
            if (level === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(Sphere.prototype, "radius", {
            get: function () {
                return this.getPrincipalScale('radius');
            },
            set: function (radius) {
                this.setPrincipalScale('radius', radius);
            },
            enumerable: true,
            configurable: true
        });
        return Sphere;
    })(RigidBody_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Sphere;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Box',["require", "exports", '../geometries/BoxGeometry', './direction', '../base/incLevel', '../checks/isDefined', '../materials/MeshMaterial', '../checks/mustBeNumber', './RigidBody'], function (require, exports, BoxGeometry_1, direction_1, incLevel_1, isDefined_1, MeshMaterial_1, mustBeNumber_1, RigidBody_1) {
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, void 0, void 0, options.engine, direction_1.default(options));
            this.setLoggingName('Box');
            var geoOptions = {};
            geoOptions.engine = options.engine;
            geoOptions.tilt = options.tilt;
            geoOptions.offset = options.offset;
            geoOptions.openBack = options.openBack;
            geoOptions.openBase = options.openBase;
            geoOptions.openFront = options.openFront;
            geoOptions.openLeft = options.openLeft;
            geoOptions.openRight = options.openRight;
            geoOptions.openCap = options.openCap;
            var geometry = new BoxGeometry_1.default(geoOptions);
            this.geometry = geometry;
            geometry.release();
            var matOptions = void 0;
            var material = new MeshMaterial_1.default(matOptions, options.engine);
            this.material = material;
            material.release();
            if (options.color) {
                this.color.copy(options.color);
            }
            if (options.position) {
                this.X.copyVector(options.position);
            }
            if (options.attitude) {
                this.R.copySpinor(options.attitude);
            }
            this.width = isDefined_1.default(options.width) ? mustBeNumber_1.default('width', options.width) : 1.0;
            this.height = isDefined_1.default(options.height) ? mustBeNumber_1.default('height', options.height) : 1.0;
            this.depth = isDefined_1.default(options.depth) ? mustBeNumber_1.default('depth', options.depth) : 1.0;
        }
        Box.prototype.destructor = function (level) {
            if (level === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(Box.prototype, "width", {
            get: function () {
                return this.getPrincipalScale('width');
            },
            set: function (width) {
                this.setPrincipalScale('width', width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "height", {
            get: function () {
                return this.getPrincipalScale('height');
            },
            set: function (height) {
                this.setPrincipalScale('height', height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "depth", {
            get: function () {
                return this.getPrincipalScale('depth');
            },
            set: function (depth) {
                this.setPrincipalScale('depth', depth);
            },
            enumerable: true,
            configurable: true
        });
        return Box;
    })(RigidBody_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Box;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/RigidBodyWithUnits',["require", "exports", '../math/G3', '../base/incLevel', '../checks/mustBeObject', '../core/ShareableBase', '../math/Unit'], function (require, exports, G3_1, incLevel_1, mustBeObject_1, ShareableBase_1, Unit_1) {
    var UNIT_P = Unit_1.default.KILOGRAM.mul(Unit_1.default.METER).div(Unit_1.default.SECOND);
    var UNIT_L = UNIT_P.mul(Unit_1.default.METER);
    var RigidBodyWithUnits = (function (_super) {
        __extends(RigidBodyWithUnits, _super);
        function RigidBodyWithUnits(mesh, axis) {
            _super.call(this);
            this._mass = G3_1.default.scalar(1, Unit_1.default.KILOGRAM);
            this._P = G3_1.default.scalar(0, UNIT_P);
            this._L = G3_1.default.scalar(0, UNIT_L);
            this._charge = G3_1.default.scalar(0, Unit_1.default.COULOMB);
            this.setLoggingName('RigidBodyWithUnits');
            this.mesh = mustBeObject_1.default('mesh', mesh);
            this.mesh.addRef();
            this.base = G3_1.default.direction(mustBeObject_1.default('axis', axis));
        }
        RigidBodyWithUnits.prototype.destructor = function (level) {
            this.mesh.release();
            this.mesh = void 0;
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(RigidBodyWithUnits.prototype, "axis", {
            get: function () {
                return this.base.rotate(this.mesh.R);
            },
            set: function (axis) {
                mustBeObject_1.default('axis', axis);
                this.mesh.R.rotorFromDirections(this.base, axis);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBodyWithUnits.prototype, "R", {
            get: function () {
                return G3_1.default.fromSpinor(this.mesh.R);
            },
            set: function (R) {
                var _this = this;
                mustBeObject_1.default('R', R, function () { return _this._type; });
                Unit_1.default.compatible(R.uom, Unit_1.default.ONE);
                this.mesh.R.copySpinor(R);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBodyWithUnits.prototype, "L", {
            get: function () {
                return this._L;
            },
            set: function (L) {
                var _this = this;
                mustBeObject_1.default('L', L, function () { return _this._type; });
                Unit_1.default.compatible(L.uom, UNIT_L);
                this._L = L;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBodyWithUnits.prototype, "m", {
            get: function () {
                return this._mass;
            },
            set: function (m) {
                var _this = this;
                mustBeObject_1.default('m', m, function () { return _this._type; });
                Unit_1.default.compatible(m.uom, Unit_1.default.KILOGRAM);
                this._mass = m;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBodyWithUnits.prototype, "P", {
            get: function () {
                return this._P;
            },
            set: function (P) {
                var _this = this;
                mustBeObject_1.default('P', P, function () { return _this._type; });
                Unit_1.default.compatible(P.uom, UNIT_P);
                this._P = P;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBodyWithUnits.prototype, "Q", {
            get: function () {
                return this._charge;
            },
            set: function (Q) {
                var _this = this;
                mustBeObject_1.default('Q', Q, function () { return _this._type; });
                Unit_1.default.compatible(Q.uom, Unit_1.default.COULOMB);
                this._charge = Q;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBodyWithUnits.prototype, "X", {
            get: function () {
                return G3_1.default.fromVector(this.mesh.X, Unit_1.default.METER);
            },
            set: function (X) {
                var _this = this;
                mustBeObject_1.default('X', X, function () { return _this._type; });
                Unit_1.default.compatible(X.uom, Unit_1.default.METER);
                this.mesh.X.copy(X);
            },
            enumerable: true,
            configurable: true
        });
        return RigidBodyWithUnits;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RigidBodyWithUnits;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Cylinder',["require", "exports", './direction', '../geometries/CylinderGeometry', '../base/incLevel', '../checks/isDefined', '../materials/MeshMaterial', '../checks/mustBeNumber', './RigidBody'], function (require, exports, direction_1, CylinderGeometry_1, incLevel_1, isDefined_1, MeshMaterial_1, mustBeNumber_1, RigidBody_1) {
    var Cylinder = (function (_super) {
        __extends(Cylinder, _super);
        function Cylinder(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, void 0, void 0, options.engine, direction_1.default(options));
            this.setLoggingName('Cylinder');
            var geoOptions = {};
            geoOptions.engine = options.engine;
            geoOptions.tilt = options.tilt;
            geoOptions.offset = options.offset;
            geoOptions.openCap = options.openCap;
            geoOptions.openBase = options.openBase;
            geoOptions.openWall = options.openWall;
            var geometry = new CylinderGeometry_1.default(geoOptions);
            this.geometry = geometry;
            geometry.release();
            var matOptions = null;
            var material = new MeshMaterial_1.default(matOptions, options.engine);
            this.material = material;
            material.release();
            if (options.color) {
                this.color.copy(options.color);
            }
            if (options.position) {
                this.X.copyVector(options.position);
            }
            if (options.attitude) {
                this.R.copySpinor(options.attitude);
            }
            this.radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default('radius', options.radius) : 0.5;
            this.length = isDefined_1.default(options.length) ? mustBeNumber_1.default('length', options.length) : 1.0;
        }
        Cylinder.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(Cylinder.prototype, "length", {
            get: function () {
                return this.getPrincipalScale('length');
            },
            set: function (length) {
                this.setPrincipalScale('length', length);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cylinder.prototype, "radius", {
            get: function () {
                return this.getPrincipalScale('radius');
            },
            set: function (radius) {
                this.setPrincipalScale('radius', radius);
            },
            enumerable: true,
            configurable: true
        });
        return Cylinder;
    })(RigidBody_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Cylinder;
});

define('davinci-eight/checks/isLT',["require", "exports"], function (require, exports) {
    function default_1(value, limit) {
        return value < limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/mustBeLT',["require", "exports", '../checks/mustSatisfy', '../checks/isLT'], function (require, exports, mustSatisfy_1, isLT_1) {
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isLT_1.default(value, limit), function () { return "be less than " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/geometries/primitives/numVerticesForCurve',["require", "exports", '../../checks/mustBeInteger'], function (require, exports, mustBeInteger_1) {
    function default_1(uSegments) {
        mustBeInteger_1.default('uSegments', uSegments);
        return uSegments + 1;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/primitives/CurvePrimitive',["require", "exports", './GeometryPrimitive', '../../checks/mustBeGE', '../../checks/mustBeLT', '../../checks/mustBeBoolean', '../../checks/mustBeInteger', './numPostsForFence', './numVerticesForCurve', '../../i18n/readOnly'], function (require, exports, GeometryPrimitive_1, mustBeGE_1, mustBeLT_1, mustBeBoolean_1, mustBeInteger_1, numPostsForFence_1, numVerticesForCurve_1, readOnly_1) {
    var CurvePrimitive = (function (_super) {
        __extends(CurvePrimitive, _super);
        function CurvePrimitive(mode, uSegments, uClosed) {
            _super.call(this, mode, numVerticesForCurve_1.default(uSegments), 1);
            mustBeInteger_1.default('uSegments', uSegments);
            mustBeGE_1.default('uSegments', uSegments, 0);
            mustBeBoolean_1.default('uClosed', uClosed);
            this._uSegments = uSegments;
            this._uClosed = uClosed;
            var uLength = this.uLength;
            for (var uIndex = 0; uIndex < uLength; uIndex++) {
                var coords = this.vertex(uIndex).coords;
                coords.setComponent(0, uIndex);
            }
        }
        Object.defineProperty(CurvePrimitive.prototype, "uSegments", {
            get: function () {
                return this._uSegments;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurvePrimitive.prototype, "uLength", {
            get: function () {
                return numPostsForFence_1.default(this._uSegments, this._uClosed);
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uLength').message);
            },
            enumerable: true,
            configurable: true
        });
        CurvePrimitive.prototype.vertexTransform = function (transform) {
            var iLen = this.vertices.length;
            for (var i = 0; i < iLen; i++) {
                var vertex = this.vertices[i];
                var u = vertex.coords.getComponent(0);
                transform.exec(vertex, u, 0, this.uLength, 0);
            }
        };
        CurvePrimitive.prototype.vertex = function (uIndex) {
            mustBeInteger_1.default('uIndex', uIndex);
            mustBeGE_1.default('uIndex', uIndex, 0);
            mustBeLT_1.default('uIndex', uIndex, this.uLength);
            return this.vertices[uIndex];
        };
        return CurvePrimitive;
    })(GeometryPrimitive_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CurvePrimitive;
});

define('davinci-eight/geometries/primitives/elementsForCurve',["require", "exports", '../../checks/isDefined', '../../checks/mustBeArray', './numPostsForFence'], function (require, exports, isDefined_1, mustBeArray_1, numPostsForFence_1) {
    function default_1(uSegments, uClosed, elements) {
        elements = isDefined_1.default(elements) ? mustBeArray_1.default('elements', elements) : [];
        var uLength = numPostsForFence_1.default(uSegments, uClosed);
        for (var u = 0; u < uLength; u++) {
            elements.push(u);
        }
        return elements;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/primitives/LineStrip',["require", "exports", './CurvePrimitive', '../../core/DrawMode', './elementsForCurve', '../../checks/mustBeGE', '../../checks/mustBeInteger', '../../checks/mustBeLT'], function (require, exports, CurvePrimitive_1, DrawMode_1, elementsForCurve_1, mustBeGE_1, mustBeInteger_1, mustBeLT_1) {
    var LineStrip = (function (_super) {
        __extends(LineStrip, _super);
        function LineStrip(uSegments) {
            _super.call(this, DrawMode_1.default.LINE_STRIP, uSegments, false);
            this.elements = elementsForCurve_1.default(uSegments, false);
        }
        LineStrip.prototype.vertex = function (uIndex) {
            mustBeInteger_1.default('uIndex', uIndex);
            mustBeGE_1.default('uIndex', uIndex, 0);
            mustBeLT_1.default('uIndex', uIndex, this.uLength);
            return this.vertices[uIndex];
        };
        return LineStrip;
    })(CurvePrimitive_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LineStrip;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/primitives/LinePoints',["require", "exports", './CurvePrimitive', '../../core/DrawMode', './elementsForCurve', '../../checks/mustBeGE', '../../checks/mustBeInteger', '../../checks/mustBeLT'], function (require, exports, CurvePrimitive_1, DrawMode_1, elementsForCurve_1, mustBeGE_1, mustBeInteger_1, mustBeLT_1) {
    var LinePoints = (function (_super) {
        __extends(LinePoints, _super);
        function LinePoints(uSegments) {
            _super.call(this, DrawMode_1.default.POINTS, uSegments, false);
            this.elements = elementsForCurve_1.default(uSegments, false);
        }
        LinePoints.prototype.vertex = function (uIndex) {
            mustBeInteger_1.default('uIndex', uIndex);
            mustBeGE_1.default('uIndex', uIndex, 0);
            mustBeLT_1.default('uIndex', uIndex, this.uLength);
            return this.vertices[uIndex];
        };
        return LinePoints;
    })(CurvePrimitive_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LinePoints;
});

define('davinci-eight/geometries/curveVertexArrays',["require", "exports", '../core/Color', '../core/DrawMode', '../core/GraphicsProgramSymbols', './primitives/LineStrip', './primitives/LinePoints', '../checks/isDefined', '../checks/isFunction', '../checks/mustBeNumber', '../math/R3', '../math/Unit', '../math/Vector3'], function (require, exports, Color_1, DrawMode_1, GraphicsProgramSymbols_1, LineStrip_1, LinePoints_1, isDefined_1, isFunction_1, mustBeNumber_1, R3_1, Unit_1, Vector3_1) {
    function aPositionDefault(u) {
        return R3_1.default.vector(u, 0, 0, Unit_1.default.ONE);
    }
    function topology(drawMode, uSegments, uClosed) {
        switch (drawMode) {
            case DrawMode_1.default.POINTS: {
                return new LinePoints_1.default(uSegments);
            }
            case DrawMode_1.default.LINES: {
                return new LineStrip_1.default(uSegments);
            }
            default: {
                throw new Error("drawMode must be POINTS, LINES");
            }
        }
    }
    function transformVertex(vertex, u, options) {
        var aPosition = isDefined_1.default(options.aPosition) ? options.aPosition : aPositionDefault;
        var aColor = isDefined_1.default(options.aColor) ? options.aColor : void 0;
        if (isFunction_1.default(aPosition)) {
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(aPosition(u));
        }
        if (isFunction_1.default(aColor)) {
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Color_1.default.copy(aColor(u));
        }
    }
    function default_1(options) {
        var uMin = isDefined_1.default(options.uMin) ? mustBeNumber_1.default('uMin', options.uMin) : 0;
        var uMax = isDefined_1.default(options.uMax) ? mustBeNumber_1.default('uMax', options.uMax) : 1;
        var uSegments = isDefined_1.default(options.uSegments) ? options.uSegments : 1;
        var drawMode = isDefined_1.default(options.drawMode) ? options.drawMode : DrawMode_1.default.LINES;
        var curve = topology(drawMode, uSegments, false);
        var iLen = curve.uLength;
        if (uSegments > 0) {
            for (var i = 0; i < iLen; i++) {
                var vertex = curve.vertex(i);
                var u = uMin + (uMax - uMin) * i / uSegments;
                transformVertex(vertex, u, options);
            }
        }
        else {
            var vertex = curve.vertex(0);
            var u = (uMin + uMax) / 2;
            transformVertex(vertex, u, options);
        }
        var vas = curve.toVertexArrays();
        return vas;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CurveGeometry',["require", "exports", '../core/GeometryElements', './curveVertexArrays'], function (require, exports, GeometryElements_1, curveVertexArrays_1) {
    var CurveGeometry = (function (_super) {
        __extends(CurveGeometry, _super);
        function CurveGeometry(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, curveVertexArrays_1.default(options), options.engine);
            this.setLoggingName('CurveGeometry');
        }
        CurveGeometry.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return CurveGeometry;
    })(GeometryElements_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CurveGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Curve',["require", "exports", '../core/DrawMode', '../core/GraphicsProgramSymbols', '../geometries/CurveGeometry', '../base/incLevel', '../checks/isDefined', '../checks/isFunction', '../checks/isNull', '../checks/isUndefined', '../materials/LineMaterial', '../core/Mesh', '../checks/mustBeGE', '../checks/mustBeNumber', '../materials/PointMaterial', '../math/R3', '../math/Unit'], function (require, exports, DrawMode_1, GraphicsProgramSymbols_1, CurveGeometry_1, incLevel_1, isDefined_1, isFunction_1, isNull_1, isUndefined_1, LineMaterial_1, Mesh_1, mustBeGE_1, mustBeNumber_1, PointMaterial_1, R3_1, Unit_1) {
    function aPositionDefault(u) {
        return R3_1.default.vector(u, 0, 0, Unit_1.default.ONE);
    }
    function isFunctionOrNull(x) {
        return isFunction_1.default(x) || isNull_1.default(x);
    }
    function isFunctionOrUndefined(x) {
        return isFunction_1.default(x) || isUndefined_1.default(x);
    }
    function transferGeometryOptions(options, geoOptions) {
        if (isFunctionOrNull(options.aPosition)) {
            geoOptions.aPosition = options.aPosition;
        }
        else if (isUndefined_1.default(options.aPosition)) {
            geoOptions.aPosition = aPositionDefault;
        }
        else {
            throw new Error("aPosition must be one of function, null, or undefined.");
        }
        if (isFunctionOrNull(options.aColor)) {
            geoOptions.aColor = options.aColor;
        }
        else if (isUndefined_1.default(options.aColor)) {
        }
        else {
            throw new Error("aColor must be one of function, null, or undefined.");
        }
        if (isDefined_1.default(options.uMax)) {
            geoOptions.uMax = mustBeNumber_1.default('uMax', options.uMax);
        }
        else {
            geoOptions.uMax = +0.5;
        }
        if (isDefined_1.default(options.uMin)) {
            geoOptions.uMin = mustBeNumber_1.default('uMin', options.uMin);
        }
        else {
            geoOptions.uMin = -0.5;
        }
        if (isDefined_1.default(options.uSegments)) {
            geoOptions.uSegments = mustBeGE_1.default('uSegments', options.uSegments, 0);
        }
        else {
            geoOptions.uSegments = 1;
        }
    }
    function configPoints(options, curve) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.drawMode = DrawMode_1.default.POINTS;
        var geometry = new CurveGeometry_1.default(geoOptions);
        curve.geometry = geometry;
        geometry.release();
        var matOptions = { attributes: {}, uniforms: {} };
        if (isFunctionOrUndefined(options.aPosition)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
        }
        else if (isNull_1.default(options.aPosition)) {
        }
        else {
            throw new Error();
        }
        if (isFunction_1.default(options.aColor)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = 3;
        }
        else {
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
        }
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE] = 'float';
        var material = new PointMaterial_1.default(matOptions, options.engine);
        curve.material = material;
        material.release();
    }
    function configLines(options, curve) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.drawMode = DrawMode_1.default.LINES;
        var geometry = new CurveGeometry_1.default(geoOptions);
        curve.geometry = geometry;
        geometry.release();
        var matOptions = { attributes: {}, uniforms: {} };
        if (isFunctionOrUndefined(options.aPosition)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
        }
        else if (isNull_1.default(options.aPosition)) {
        }
        else {
            throw new Error();
        }
        if (isFunction_1.default(options.aColor)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = 3;
        }
        else {
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
        }
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
        var material = new LineMaterial_1.default(matOptions, options.engine);
        curve.material = material;
        material.release();
    }
    var Curve = (function (_super) {
        __extends(Curve, _super);
        function Curve(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, void 0, void 0, options.engine);
            this.setLoggingName('Curve');
            var drawMode = isDefined_1.default(options.drawMode) ? options.drawMode : DrawMode_1.default.LINES;
            switch (drawMode) {
                case DrawMode_1.default.POINTS:
                    {
                        configPoints(options, this);
                    }
                    break;
                case DrawMode_1.default.LINES:
                case DrawMode_1.default.LINE_STRIP:
                    {
                        configLines(options, this);
                    }
                    break;
                default: {
                    throw new Error("'" + drawMode + "' is not a valid option for drawMode.");
                }
            }
        }
        Curve.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        return Curve;
    })(Mesh_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Curve;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Grid',["require", "exports", '../core/DrawMode', '../core/GraphicsProgramSymbols', '../geometries/GridGeometry', '../base/incLevel', '../checks/isDefined', '../checks/isFunction', '../checks/isNull', '../checks/isUndefined', '../materials/LineMaterial', '../core/Mesh', '../materials/MeshMaterial', '../checks/mustBeGE', '../checks/mustBeNumber', '../materials/PointMaterial', '../math/R3', '../math/Unit'], function (require, exports, DrawMode_1, GraphicsProgramSymbols_1, GridGeometry_1, incLevel_1, isDefined_1, isFunction_1, isNull_1, isUndefined_1, LineMaterial_1, Mesh_1, MeshMaterial_1, mustBeGE_1, mustBeNumber_1, PointMaterial_1, R3_1, Unit_1) {
    function aPositionDefault(u, v) {
        return R3_1.default.vector(u, v, 0, Unit_1.default.ONE);
    }
    function aNormalDefault(u, v) {
        return R3_1.default.e3;
    }
    function isFunctionOrNull(x) {
        return isFunction_1.default(x) || isNull_1.default(x);
    }
    function isFunctionOrUndefined(x) {
        return isFunction_1.default(x) || isUndefined_1.default(x);
    }
    function transferGeometryOptions(source, target) {
        if (isFunctionOrNull(source.aPosition)) {
            target.aPosition = source.aPosition;
        }
        else if (isUndefined_1.default(source.aPosition)) {
            target.aPosition = aPositionDefault;
        }
        else {
            throw new Error("aPosition must be one of function, null, or undefined.");
        }
        if (isFunctionOrNull(source.aNormal)) {
            target.aNormal = source.aNormal;
        }
        else if (isUndefined_1.default(source.aNormal)) {
            target.aNormal = aNormalDefault;
        }
        else {
            throw new Error("aNormal must be one of function, null, or undefined.");
        }
        if (isFunctionOrNull(source.aColor)) {
            target.aColor = source.aColor;
        }
        else if (isUndefined_1.default(source.aColor)) {
        }
        else {
            throw new Error("aColor must be one of function, null, or undefined.");
        }
        if (isDefined_1.default(source.uMax)) {
            target.uMax = mustBeNumber_1.default('uMax', source.uMax);
        }
        else {
            target.uMax = +0.5;
        }
        if (isDefined_1.default(source.uMin)) {
            target.uMin = mustBeNumber_1.default('uMin', source.uMin);
        }
        else {
            target.uMin = -0.5;
        }
        if (isDefined_1.default(source.uSegments)) {
            target.uSegments = mustBeGE_1.default('uSegments', source.uSegments, 0);
        }
        else {
            target.uSegments = 1;
        }
        if (isDefined_1.default(source.vMax)) {
            target.vMax = mustBeNumber_1.default('vMax', source.vMax);
        }
        else {
            target.vMax = +0.5;
        }
        if (isDefined_1.default(source.vMin)) {
            target.vMin = mustBeNumber_1.default('vMin', source.vMin);
        }
        else {
            target.vMin = -0.5;
        }
        if (isDefined_1.default(source.vSegments)) {
            target.vSegments = mustBeGE_1.default('vSegments', source.vSegments, 0);
        }
        else {
            target.vSegments = 1;
        }
    }
    function configPoints(options, grid) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.drawMode = DrawMode_1.default.POINTS;
        var geometry = new GridGeometry_1.default(geoOptions);
        grid.geometry = geometry;
        geometry.release();
        var matOptions = { attributes: {}, uniforms: {} };
        if (isFunctionOrUndefined(options.aPosition)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
        }
        else if (isNull_1.default(options.aPosition)) {
        }
        else {
            throw new Error();
        }
        if (isFunction_1.default(options.aColor)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = 3;
        }
        else {
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
        }
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE] = 'float';
        var material = new PointMaterial_1.default(matOptions, options.engine);
        grid.material = material;
        material.release();
    }
    function configLines(options, grid) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.drawMode = DrawMode_1.default.LINES;
        var geometry = new GridGeometry_1.default(geoOptions);
        grid.geometry = geometry;
        geometry.release();
        var matOptions = { attributes: {}, uniforms: {} };
        if (isFunctionOrUndefined(options.aPosition)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
        }
        else if (isNull_1.default(options.aPosition)) {
        }
        else {
            throw new Error();
        }
        if (isFunction_1.default(options.aNormal)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = 3;
        }
        if (isFunction_1.default(options.aColor)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = 3;
        }
        else {
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
        }
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
        var material = new LineMaterial_1.default(matOptions, options.engine);
        grid.material = material;
        material.release();
    }
    function configMesh(options, grid) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.drawMode = DrawMode_1.default.TRIANGLE_STRIP;
        var geometry = new GridGeometry_1.default(geoOptions);
        grid.geometry = geometry;
        geometry.release();
        var matOptions = { attributes: {}, uniforms: {} };
        if (isFunctionOrUndefined(options.aPosition)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
        }
        else if (isNull_1.default(options.aPosition)) {
        }
        else {
            throw new Error();
        }
        if (isFunctionOrUndefined(options.aNormal)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = 3;
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX] = 'mat3';
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
        }
        else if (isNull_1.default(options.aNormal)) {
        }
        else {
            throw new Error();
        }
        if (isFunction_1.default(options.aColor)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = 3;
        }
        else if (isNull_1.default(options.aColor)) {
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
        }
        else if (isUndefined_1.default(options.aColor)) {
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
        }
        else {
            throw new Error();
        }
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT] = 'vec3';
        var material = new MeshMaterial_1.default(matOptions, options.engine);
        grid.material = material;
        material.release();
    }
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, void 0, void 0, null);
            this.setLoggingName('Grid');
            var drawMode = isDefined_1.default(options.drawMode) ? options.drawMode : DrawMode_1.default.LINES;
            switch (drawMode) {
                case DrawMode_1.default.POINTS:
                    {
                        configPoints(options, this);
                    }
                    break;
                case DrawMode_1.default.LINES:
                case DrawMode_1.default.LINE_STRIP:
                    {
                        configLines(options, this);
                    }
                    break;
                case DrawMode_1.default.TRIANGLE_STRIP:
                case DrawMode_1.default.TRIANGLES:
                    {
                        configMesh(options, this);
                    }
                    break;
                default: {
                    throw new Error("'" + drawMode + "' is not a valid option for drawMode.");
                }
            }
        }
        Grid.prototype.destructor = function (level) {
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        return Grid;
    })(Mesh_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Grid;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Tetrahedron',["require", "exports", '../core/Mesh', '../materials/MeshMaterial', '../geometries/TetrahedronGeometry'], function (require, exports, Mesh_1, MeshMaterial_1, TetrahedronGeometry_1) {
    var Tetrahedron = (function (_super) {
        __extends(Tetrahedron, _super);
        function Tetrahedron(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, void 0, void 0, options.engine);
            this.setLoggingName('Tetrahedron');
            var geoOptions = {};
            geoOptions.engine = options.engine;
            var geometry = new TetrahedronGeometry_1.default(geoOptions);
            var matOptions = null;
            var material = new MeshMaterial_1.default(matOptions, options.engine);
            this.geometry = geometry;
            this.material = material;
            geometry.release();
            material.release();
        }
        Tetrahedron.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Tetrahedron.prototype, "radius", {
            get: function () {
                return this.getPrincipalScale('radius');
            },
            set: function (radius) {
                this.setPrincipalScale('radius', radius);
            },
            enumerable: true,
            configurable: true
        });
        return Tetrahedron;
    })(Mesh_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tetrahedron;
});

define('davinci-eight/visual/TrailConfig',["require", "exports", '../config', '../core/ErrorMode', '../checks/isBoolean', '../checks/mustBeBoolean'], function (require, exports, config_1, ErrorMode_1, isBoolean_1, mustBeBoolean_1) {
    'use strict';
    var TrailConfig = (function () {
        function TrailConfig() {
            this._enabled = true;
            this.interval = 10;
            this.retain = 10;
        }
        Object.defineProperty(TrailConfig.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (enabled) {
                if (isBoolean_1.default(enabled)) {
                    this._enabled = enabled;
                }
                else {
                    switch (config_1.default.errorMode) {
                        case ErrorMode_1.default.IGNORE:
                            {
                            }
                            break;
                        case ErrorMode_1.default.WARNME:
                            {
                                console.warn("TrailConfig.enabled must be a boolean");
                            }
                            break;
                        default: {
                            mustBeBoolean_1.default('enabled', enabled);
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        return TrailConfig;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TrailConfig;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Trail',["require", "exports", '../base/incLevel', '../checks/mustBeObject', '../core/ShareableBase', './TrailConfig'], function (require, exports, incLevel_1, mustBeObject_1, ShareableBase_1, TrailConfig_1) {
    var Trail = (function (_super) {
        __extends(Trail, _super);
        function Trail(mesh) {
            _super.call(this);
            this.Xs = [];
            this.Rs = [];
            this.config = new TrailConfig_1.default();
            this.counter = 0;
            this.setLoggingName('Trail');
            mustBeObject_1.default('mesh', mesh);
            mesh.addRef();
            this.mesh = mesh;
        }
        Trail.prototype.destructor = function (level) {
            this.mesh.release();
            this.mesh = void 0;
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Trail.prototype.erase = function () {
            this.Xs = [];
            this.Rs = [];
        };
        Trail.prototype.snapshot = function () {
            if (this.config.enabled) {
                if (this.counter % this.config.interval === 0) {
                    this.Xs.unshift(this.mesh.X.clone());
                    this.Rs.unshift(this.mesh.R.clone());
                }
                while (this.Xs.length > this.config.retain) {
                    this.Xs.pop();
                    this.Rs.pop();
                }
                this.counter++;
            }
        };
        Trail.prototype.draw = function (ambients) {
            if (this.config.enabled) {
                var X = this.mesh.X.clone();
                var R = this.mesh.R.clone();
                var iLength = this.Xs.length;
                for (var i = 0; i < iLength; i++) {
                    this.mesh.X.copyVector(this.Xs[i]);
                    this.mesh.R.copySpinor(this.Rs[i]);
                    this.mesh.draw(ambients);
                }
                this.mesh.X.copy(X);
                this.mesh.R.copy(R);
            }
        };
        return Trail;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Trail;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Viewport',["require", "exports", '../facets/AmbientLight', '../core/Color', '../facets/DirectionalLight', '../core/Engine', '../base/exchange', '../checks/mustBeInteger', '../facets/PerspectiveCamera', '../math/R3', '../core/ShareableBase'], function (require, exports, AmbientLight_1, Color_1, DirectionalLight_1, Engine_1, exchange_1, mustBeInteger_1, PerspectiveCamera_1, R3_1, ShareableBase_1) {
    var Viewport = (function (_super) {
        __extends(Viewport, _super);
        function Viewport(engine) {
            _super.call(this);
            this.ambients = [];
            this.ambLight = new AmbientLight_1.default(Color_1.default.gray);
            this.dirLight = new DirectionalLight_1.default(R3_1.default.e3.neg(), Color_1.default.gray);
            this.camera = new PerspectiveCamera_1.default();
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.setLoggingName('Viewport');
            if (engine instanceof Engine_1.default) {
                engine.addRef();
                this.engine = engine;
            }
            else {
                throw new Error("engine must be an Engine");
            }
            this.ambients.push(this.ambLight);
            this.ambients.push(this.dirLight);
            this.ambients.push(this.camera);
        }
        Object.defineProperty(Viewport.prototype, "scene", {
            get: function () {
                var scene = this._scene;
                if (scene) {
                    scene.addRef();
                    return scene;
                }
            },
            set: function (scene) {
                this._scene = exchange_1.default(this._scene, scene);
            },
            enumerable: true,
            configurable: true
        });
        Viewport.prototype.draw = function () {
            if (this._scene) {
                if (this.engine) {
                    this.engine.viewport(this.x, this.y, this.width, this.height);
                }
                this._scene.draw(this.ambients);
            }
        };
        Viewport.prototype.setPortal = function (x, y, width, height) {
            mustBeInteger_1.default('x', x);
            mustBeInteger_1.default('y', y);
            mustBeInteger_1.default('width', width);
            mustBeInteger_1.default('width', width);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            if (this.camera) {
                this.camera.setAspect(width / height);
            }
        };
        Viewport.prototype.destructor = function (levelUp) {
            this.engine = exchange_1.default(this.engine, void 0);
            this._scene = exchange_1.default(this._scene, void 0);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return Viewport;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Viewport;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/DrawList',["require", "exports", '../base/incLevel', '../collections/ShareableArray', '../core/ShareableContextConsumer'], function (require, exports, incLevel_1, ShareableArray_1, ShareableContextConsumer_1) {
    var DrawList = (function (_super) {
        __extends(DrawList, _super);
        function DrawList(engine) {
            _super.call(this, engine);
            this.setLoggingName('DrawList');
            this.things = new ShareableArray_1.default([]);
        }
        DrawList.prototype.destructor = function (level) {
            this.things.release();
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        DrawList.prototype.add = function (drawable) {
            this.things.push(drawable);
        };
        DrawList.prototype.draw = function (ambients) {
            var iLen = this.things.length;
            for (var i = 0; i < iLen; i++) {
                var mesh = this.things.getWeakRef(i);
                mesh.draw(ambients);
            }
        };
        DrawList.prototype.contextFree = function (context) {
            var iLen = this.things.length;
            for (var i = 0; i < iLen; i++) {
                var mesh = this.things.getWeakRef(i);
                mesh.contextFree(context);
            }
            _super.prototype.contextFree.call(this, context);
        };
        DrawList.prototype.contextGain = function (context) {
            var iLen = this.things.length;
            for (var i = 0; i < iLen; i++) {
                var mesh = this.things.getWeakRef(i);
                mesh.contextGain(context);
            }
            _super.prototype.contextGain.call(this, context);
        };
        DrawList.prototype.contextLost = function () {
            var iLen = this.things.length;
            for (var i = 0; i < iLen; i++) {
                var mesh = this.things.getWeakRef(i);
                mesh.contextLost();
            }
            _super.prototype.contextLost.call(this);
        };
        return DrawList;
    })(ShareableContextConsumer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawList;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/World',["require", "exports", '../core/Color', '../facets/AmbientLight', '../base/incLevel', '../i18n/readOnly', '../core/ShareableBase'], function (require, exports, Color_1, AmbientLight_1, incLevel_1, readOnly_1, ShareableBase_1) {
    var World = (function (_super) {
        __extends(World, _super);
        function World(renderer, drawList, ambients, controls) {
            _super.call(this);
            this._ambientLight = new AmbientLight_1.default(Color_1.default.fromRGB(0.3, 0.3, 0.3));
            this.setLoggingName('World');
            renderer.addRef();
            this.renderer = renderer;
            drawList.addRef();
            this.drawList = drawList;
            this.drawList.subscribe(renderer, true);
            this._ambients = ambients;
            this._ambients.push(this._ambientLight);
            controls.addRef();
            this._controls = controls;
        }
        World.prototype.destructor = function (level) {
            this.controls.release();
            this.drawList.unsubscribe(true);
            this.drawList.release();
            this.renderer.release();
            _super.prototype.destructor.call(this, incLevel_1.default(level));
        };
        Object.defineProperty(World.prototype, "ambients", {
            get: function () {
                return this._ambients;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('ambients').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "ambientLight", {
            get: function () {
                return this._ambientLight;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('ambientLight').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "canvas", {
            get: function () {
                return this.renderer.canvas;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('canvas').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "controls", {
            get: function () {
                return this._controls;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('controls').message);
            },
            enumerable: true,
            configurable: true
        });
        World.prototype.add = function (drawable) {
            this.drawList.add(drawable);
        };
        return World;
    })(ShareableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = World;
});

define('davinci-eight/visual/bootstrap',["require", "exports", '../core/Color', '../math/R3', '../facets/DirectionalLight', '../checks/isDefined', '../checks/mustBeBoolean', '../checks/mustBeFunction', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', './DrawList', '../facets/PerspectiveCamera', '../core/refChange', '../controls/TrackballControls', './World', '../core/Engine'], function (require, exports, Color_1, R3_1, DirectionalLight_1, isDefined_1, mustBeBoolean_1, mustBeFunction_1, mustBeNumber_1, mustBeObject_1, mustBeString_1, DrawList_1, PerspectiveCamera_1, refChange_1, TrackballControls_1, World_1, Engine_1) {
    function default_1(canvasId, animate, options) {
        if (options === void 0) { options = {}; }
        console.warn("The bootstrap function is deprecated. Use SingleViewApp instead.");
        mustBeString_1.default('canvasId', canvasId);
        mustBeFunction_1.default('animate', animate);
        mustBeObject_1.default('options', options);
        options.height = isDefined_1.default(options.height) ? mustBeNumber_1.default('options.height', options.height) : void 0;
        options.memcheck = isDefined_1.default(options.memcheck) ? mustBeBoolean_1.default('options.memcheck', options.memcheck) : true;
        options.onload = isDefined_1.default(options.onload) ? mustBeFunction_1.default('options.onload', options.onload) : void 0;
        options.onunload = isDefined_1.default(options.onunload) ? mustBeFunction_1.default('options.onunload', options.onunload) : void 0;
        options.width = isDefined_1.default(options.width) ? mustBeNumber_1.default('options.width', options.width) : void 0;
        if (options.memcheck) {
            refChange_1.default('start', 'bootstrap');
        }
        var engine = new Engine_1.default();
        engine.clearColor(0.1, 0.1, 0.1, 1.0);
        var drawList = new DrawList_1.default(engine);
        var ambients = [];
        var dirLight = new DirectionalLight_1.default(R3_1.default.e3.neg(), Color_1.default.white);
        ambients.push(dirLight);
        var camera = new PerspectiveCamera_1.default();
        ambients.push(camera);
        var controls = new TrackballControls_1.default(camera, window);
        var world = new World_1.default(engine, drawList, ambients, controls);
        var requestId;
        function step(timestamp) {
            requestId = window.requestAnimationFrame(step);
            engine.clear();
            controls.update();
            dirLight.direction.copyVector(camera.look).sub(camera.eye);
            try {
                animate(timestamp);
            }
            catch (e) {
                window.cancelAnimationFrame(requestId);
                console.warn(e);
            }
            drawList.draw(ambients);
        }
        window.onload = function () {
            var canvas = document.getElementById(canvasId);
            if (isDefined_1.default(options.height)) {
                canvas.height = options.height;
            }
            else {
                canvas.height = 600;
            }
            if (isDefined_1.default(options.width)) {
                canvas.width = options.width;
            }
            else {
                canvas.width = 600;
            }
            engine.start(canvas);
            controls.subscribe(world.canvas);
            controls.rotateSpeed = 4;
            if (options.onload) {
                options.onload();
            }
            requestId = window.requestAnimationFrame(step);
        };
        window.onunload = function () {
            if (options.onunload) {
                options.onunload();
            }
            controls.release();
            drawList.release();
            engine.release();
            if (options.memcheck) {
                refChange_1.default('stop', 'onunload');
                refChange_1.default('dump', 'onunload');
            }
        };
        return world;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/SingleViewApp',["require", "exports", '../base/AnimationApp', '../core/Scene', './Viewport'], function (require, exports, AnimationApp_1, Scene_1, Viewport_1) {
    var SingleViewApp = (function (_super) {
        __extends(SingleViewApp, _super);
        function SingleViewApp(options) {
            _super.call(this, options);
            this.view = new Viewport_1.default(this.engine);
        }
        SingleViewApp.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            var view = this.view;
            view.setPortal(0, 0, this.canvas.width, this.canvas.height);
            var scene = new Scene_1.default(this.engine);
            try {
                view.scene = scene;
            }
            finally {
                scene.release();
            }
        };
        SingleViewApp.prototype.draw = function () {
            this.view.draw();
        };
        SingleViewApp.prototype.destructor = function () {
            this.view.release();
            _super.prototype.destructor.call(this);
        };
        return SingleViewApp;
    })(AnimationApp_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SingleViewApp;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/MultiViewApp',["require", "exports", '../base/AnimationApp', '../checks/isInteger', '../checks/mustBeGE', '../checks/mustBeInteger', '../core/Scene', '../collections/ShareableArray', './Viewport'], function (require, exports, AnimationApp_1, isInteger_1, mustBeGE_1, mustBeInteger_1, Scene_1, ShareableArray_1, Viewport_1) {
    var MultiViewApp = (function (_super) {
        __extends(MultiViewApp, _super);
        function MultiViewApp(options) {
            if (options === void 0) { options = {}; }
            _super.call(this, options);
            this.views = new ShareableArray_1.default();
            var numViews = defaultNumViews(options);
            mustBeInteger_1.default('numViews', numViews);
            mustBeGE_1.default('numViews', numViews, 0);
            for (var i = 0; i < numViews; i++) {
                this.views.pushWeakRef(new Viewport_1.default(this.engine));
            }
        }
        MultiViewApp.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            var w = this.canvas.width;
            var h = this.canvas.height;
            var scene = new Scene_1.default(this.engine);
            var views = this.views;
            var iLen = views.length;
            for (var i = 0; i < iLen; i++) {
                var view = views.getWeakRef(i);
                view.scene = scene;
                view.setPortal(0, 0, w, h);
            }
            scene.release();
        };
        MultiViewApp.prototype.draw = function () {
            var views = this.views;
            var iLen = views.length;
            for (var i = 0; i < iLen; i++) {
                var view = views.getWeakRef(i);
                view.draw();
            }
        };
        MultiViewApp.prototype.destructor = function () {
            this.views.release();
            _super.prototype.destructor.call(this);
        };
        return MultiViewApp;
    })(AnimationApp_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MultiViewApp;
    function defaultNumViews(options) {
        if (isInteger_1.default(options.numViews)) {
            return options.numViews;
        }
        else {
            return 1;
        }
    }
});

define('davinci-eight',["require", "exports", './davinci-eight/base/AnimationApp', './davinci-eight/base/BrowserApp', './davinci-eight/base/EngineApp', './davinci-eight/commands/BlendFactor', './davinci-eight/commands/WebGLBlendFunc', './davinci-eight/commands/WebGLClearColor', './davinci-eight/commands/Capability', './davinci-eight/commands/WebGLDisable', './davinci-eight/commands/WebGLEnable', './davinci-eight/controls/OrbitControls', './davinci-eight/controls/TrackballControls', './davinci-eight/core/AttribLocation', './davinci-eight/core/Color', './davinci-eight/config', './davinci-eight/core/Drawable', './davinci-eight/core/DrawMode', './davinci-eight/core/ErrorMode', './davinci-eight/core/GeometryArrays', './davinci-eight/core/GeometryContainer', './davinci-eight/core/GeometryElements', './davinci-eight/core/GraphicsProgramSymbols', './davinci-eight/core/Mesh', './davinci-eight/core/Scene', './davinci-eight/core/UniformLocation', './davinci-eight/core/Engine', './davinci-eight/core/VertexBuffer', './davinci-eight/facets/AmbientLight', './davinci-eight/facets/ColorFacet', './davinci-eight/facets/DirectionalLight', './davinci-eight/facets/ModelFacet', './davinci-eight/facets/PointSizeFacet', './davinci-eight/facets/ReflectionFacetE2', './davinci-eight/facets/ReflectionFacetE3', './davinci-eight/facets/Vector3Facet', './davinci-eight/facets/frustumMatrix', './davinci-eight/facets/PerspectiveCamera', './davinci-eight/facets/perspectiveMatrix', './davinci-eight/facets/viewMatrixFromEyeLookUp', './davinci-eight/facets/ModelE2', './davinci-eight/facets/ModelE3', './davinci-eight/geometries/primitives/DrawAttribute', './davinci-eight/geometries/primitives/DrawPrimitive', './davinci-eight/geometries/Simplex', './davinci-eight/geometries/primitives/Vertex', './davinci-eight/geometries/ArrowGeometry', './davinci-eight/geometries/BoxGeometry', './davinci-eight/geometries/CylinderGeometry', './davinci-eight/geometries/GridGeometry', './davinci-eight/geometries/SphereGeometry', './davinci-eight/geometries/TetrahedronGeometry', './davinci-eight/geometries/ArrowBuilder', './davinci-eight/geometries/ConicalShellBuilder', './davinci-eight/geometries/CylindricalShellBuilder', './davinci-eight/geometries/CylinderBuilder', './davinci-eight/geometries/RingBuilder', './davinci-eight/materials/HTMLScriptsMaterial', './davinci-eight/materials/LineMaterial', './davinci-eight/materials/MeshMaterial', './davinci-eight/materials/MeshNormalMaterial', './davinci-eight/materials/PointMaterial', './davinci-eight/materials/GraphicsProgramBuilder', './davinci-eight/materials/smartProgram', './davinci-eight/materials/programFromScripts', './davinci-eight/math/Dimensions', './davinci-eight/math/G2', './davinci-eight/math/G3', './davinci-eight/math/mathcore', './davinci-eight/math/Vector1', './davinci-eight/math/Matrix2', './davinci-eight/math/Matrix3', './davinci-eight/math/Matrix4', './davinci-eight/math/QQ', './davinci-eight/math/R3', './davinci-eight/math/Unit', './davinci-eight/math/Geometric2', './davinci-eight/math/Geometric3', './davinci-eight/math/Spinor2', './davinci-eight/math/Spinor3', './davinci-eight/math/Vector2', './davinci-eight/math/Vector3', './davinci-eight/math/Vector4', './davinci-eight/math/VectorN', './davinci-eight/overlay/Overlay', './davinci-eight/utils/getCanvasElementById', './davinci-eight/collections/ShareableArray', './davinci-eight/collections/NumberShareableMap', './davinci-eight/core/refChange', './davinci-eight/core/ShareableBase', './davinci-eight/collections/StringShareableMap', './davinci-eight/utils/animation', './davinci-eight/visual/Arrow', './davinci-eight/visual/Sphere', './davinci-eight/visual/Box', './davinci-eight/visual/RigidBody', './davinci-eight/visual/RigidBodyWithUnits', './davinci-eight/visual/Cylinder', './davinci-eight/visual/Curve', './davinci-eight/visual/Grid', './davinci-eight/visual/Tetrahedron', './davinci-eight/visual/Trail', './davinci-eight/visual/Viewport', './davinci-eight/visual/bootstrap', './davinci-eight/visual/SingleViewApp', './davinci-eight/visual/MultiViewApp'], function (require, exports, AnimationApp_1, BrowserApp_1, EngineApp_1, BlendFactor_1, WebGLBlendFunc_1, WebGLClearColor_1, Capability_1, WebGLDisable_1, WebGLEnable_1, OrbitControls_1, TrackballControls_1, AttribLocation_1, Color_1, config_1, Drawable_1, DrawMode_1, ErrorMode_1, GeometryArrays_1, GeometryContainer_1, GeometryElements_1, GraphicsProgramSymbols_1, Mesh_1, Scene_1, UniformLocation_1, Engine_1, VertexBuffer_1, AmbientLight_1, ColorFacet_1, DirectionalLight_1, ModelFacet_1, PointSizeFacet_1, ReflectionFacetE2_1, ReflectionFacetE3_1, Vector3Facet_1, frustumMatrix_1, PerspectiveCamera_1, perspectiveMatrix_1, viewMatrixFromEyeLookUp_1, ModelE2_1, ModelE3_1, DrawAttribute_1, DrawPrimitive_1, Simplex_1, Vertex_1, ArrowGeometry_1, BoxGeometry_1, CylinderGeometry_1, GridGeometry_1, SphereGeometry_1, TetrahedronGeometry_1, ArrowBuilder_1, ConicalShellBuilder_1, CylindricalShellBuilder_1, CylinderBuilder_1, RingBuilder_1, HTMLScriptsMaterial_1, LineMaterial_1, MeshMaterial_1, MeshNormalMaterial_1, PointMaterial_1, GraphicsProgramBuilder_1, smartProgram_1, programFromScripts_1, Dimensions_1, G2_1, G3_1, mathcore_1, Vector1_1, Matrix2_1, Matrix3_1, Matrix4_1, QQ_1, R3_1, Unit_1, Geometric2_1, Geometric3_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1, Vector4_1, VectorN_1, Overlay_1, getCanvasElementById_1, ShareableArray_1, NumberShareableMap_1, refChange_1, ShareableBase_1, StringShareableMap_1, animation_1, Arrow_1, Sphere_1, Box_1, RigidBody_1, RigidBodyWithUnits_1, Cylinder_1, Curve_1, Grid_1, Tetrahedron_1, Trail_1, Viewport_1, bootstrap_1, SingleViewApp_1, MultiViewApp_1) {
    var eight = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get errorMode() {
            return config_1.default.errorMode;
        },
        set errorMode(errorMode) {
            if (typeof errorMode === 'number') {
                config_1.default.errorMode = errorMode;
            }
            else {
                throw new TypeError('errorMode must be a ErrorMode');
            }
        },
        get VERSION() { return config_1.default.VERSION; },
        get AnimationApp() { return AnimationApp_1.default; },
        get BrowserApp() { return BrowserApp_1.default; },
        get EngineApp() { return EngineApp_1.default; },
        get HTMLScriptsMaterial() { return HTMLScriptsMaterial_1.default; },
        get LineMaterial() { return LineMaterial_1.default; },
        get MeshMaterial() { return MeshMaterial_1.default; },
        get MeshNormalMaterial() { return MeshNormalMaterial_1.default; },
        get PointMaterial() { return PointMaterial_1.default; },
        get GraphicsProgramBuilder() { return GraphicsProgramBuilder_1.default; },
        get BlendFactor() { return BlendFactor_1.default; },
        get Capability() { return Capability_1.default; },
        get WebGLBlendFunc() { return WebGLBlendFunc_1.default; },
        get WebGLClearColor() { return WebGLClearColor_1.default; },
        get WebGLDisable() { return WebGLDisable_1.default; },
        get WebGLEnable() { return WebGLEnable_1.default; },
        get ModelE2() { return ModelE2_1.default; },
        get ModelE3() { return ModelE3_1.default; },
        get ModelFacet() { return ModelFacet_1.default; },
        get Simplex() { return Simplex_1.default; },
        get Vertex() { return Vertex_1.default; },
        get frustumMatrix() { return frustumMatrix_1.default; },
        get perspectiveMatrix() { return perspectiveMatrix_1.default; },
        get viewMatrix() { return viewMatrixFromEyeLookUp_1.default; },
        get Scene() { return Scene_1.default; },
        get Drawable() { return Drawable_1.default; },
        get PerspectiveCamera() { return PerspectiveCamera_1.default; },
        get getCanvasElementById() { return getCanvasElementById_1.default; },
        get Engine() { return Engine_1.default; },
        get animation() { return animation_1.default; },
        get DrawMode() { return DrawMode_1.default; },
        get ErrorMode() { return ErrorMode_1.default; },
        get AttribLocation() { return AttribLocation_1.default; },
        get UniformLocation() { return UniformLocation_1.default; },
        get VertexBuffer() { return VertexBuffer_1.default; },
        get smartProgram() {
            return smartProgram_1.default;
        },
        get Color() { return Color_1.default; },
        get OrbitControls() { return OrbitControls_1.default; },
        get TrackballControls() { return TrackballControls_1.default; },
        get AmbientLight() { return AmbientLight_1.default; },
        get ColorFacet() { return ColorFacet_1.default; },
        get DirectionalLight() { return DirectionalLight_1.default; },
        get PointSizeFacet() { return PointSizeFacet_1.default; },
        get ReflectionFacetE2() { return ReflectionFacetE2_1.default; },
        get ReflectionFacetE3() { return ReflectionFacetE3_1.default; },
        get Vector3Facet() { return Vector3Facet_1.default; },
        get ArrowBuilder() { return ArrowBuilder_1.default; },
        get ArrowGeometry() { return ArrowGeometry_1.default; },
        get BoxGeometry() { return BoxGeometry_1.default; },
        get ConicalShellBuilder() { return ConicalShellBuilder_1.default; },
        get CylinderBuilder() { return CylinderBuilder_1.default; },
        get CylinderGeometry() { return CylinderGeometry_1.default; },
        get CylindricalShellBuilder() { return CylindricalShellBuilder_1.default; },
        get GridGeometry() { return GridGeometry_1.default; },
        get RingBuilder() { return RingBuilder_1.default; },
        get SphereGeometry() { return SphereGeometry_1.default; },
        get TetrahedronGeometry() { return TetrahedronGeometry_1.default; },
        get Dimensions() { return Dimensions_1.default; },
        get Unit() { return Unit_1.default; },
        get G2() { return G2_1.default; },
        get G3() { return G3_1.default; },
        get Matrix2() { return Matrix2_1.default; },
        get Matrix3() { return Matrix3_1.default; },
        get Matrix4() { return Matrix4_1.default; },
        get QQ() { return QQ_1.default; },
        get R3() { return R3_1.default; },
        get Geometric2() { return Geometric2_1.default; },
        get Geometric3() { return Geometric3_1.default; },
        get Vector1() { return Vector1_1.default; },
        get Spinor2() { return Spinor2_1.default; },
        get Spinor3() { return Spinor3_1.default; },
        get Vector2() { return Vector2_1.default; },
        get Vector3() { return Vector3_1.default; },
        get Vector4() { return Vector4_1.default; },
        get VectorN() { return VectorN_1.default; },
        get GraphicsProgramSymbols() { return GraphicsProgramSymbols_1.default; },
        get GeometryArrays() { return GeometryArrays_1.default; },
        get GeometryContainer() { return GeometryContainer_1.default; },
        get GeometryElements() { return GeometryElements_1.default; },
        get Overlay() { return Overlay_1.default; },
        get programFromScripts() { return programFromScripts_1.default; },
        get DrawAttribute() { return DrawAttribute_1.default; },
        get DrawPrimitive() { return DrawPrimitive_1.default; },
        get ShareableArray() { return ShareableArray_1.default; },
        get NumberShareableMap() { return NumberShareableMap_1.default; },
        get refChange() { return refChange_1.default; },
        get ShareableBase() { return ShareableBase_1.default; },
        get StringShareableMap() { return StringShareableMap_1.default; },
        get cos() { return mathcore_1.default.cos; },
        get cosh() { return mathcore_1.default.cosh; },
        get exp() { return mathcore_1.default.exp; },
        get log() { return mathcore_1.default.log; },
        get norm() { return mathcore_1.default.norm; },
        get quad() { return mathcore_1.default.quad; },
        get sin() { return mathcore_1.default.sin; },
        get sinh() { return mathcore_1.default.sinh; },
        get sqrt() { return mathcore_1.default.sqrt; },
        get Arrow() { return Arrow_1.default; },
        get Sphere() { return Sphere_1.default; },
        get Box() { return Box_1.default; },
        get Mesh() { return Mesh_1.default; },
        get RigidBody() { return RigidBody_1.default; },
        get RigidBodyWithUnits() { return RigidBodyWithUnits_1.default; },
        get Cylinder() { return Cylinder_1.default; },
        get Curve() { return Curve_1.default; },
        get Grid() { return Grid_1.default; },
        get Tetrahedron() { return Tetrahedron_1.default; },
        get Trail() { return Trail_1.default; },
        get Viewport() { return Viewport_1.default; },
        get SingleViewApp() { return SingleViewApp_1.default; },
        get MultiViewApp() { return MultiViewApp_1.default; },
        get bootstrap() { return bootstrap_1.default; }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = eight;
});

  var library = require('davinci-eight').default;
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
