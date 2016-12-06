(function(global, define) {
  var globalDefine = global.define;
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
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
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
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

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
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
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
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
            return callDep(makeMap(deps, makeRelParts(callback)).f);
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

define('davinci-eight/checks/isDefined',["require", "exports"], function (require, exports) {
    "use strict";
    function isDefined(arg) {
        return (typeof arg !== 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isDefined;
});

define('davinci-eight/checks/mustSatisfy',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/checks/isEQ',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(value, limit) {
        return value === limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/mustBeEQ',["require", "exports", "../checks/mustSatisfy", "../checks/isEQ"], function (require, exports, mustSatisfy_1, isEQ_1) {
    "use strict";
    function mustBeEQ(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isEQ_1.default(value, limit), function () { return "be equal to " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeEQ;
});

define('davinci-eight/checks/isNumber',["require", "exports"], function (require, exports) {
    "use strict";
    function isNumber(x) {
        return (typeof x === 'number');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isNumber;
});

define('davinci-eight/checks/isInteger',["require", "exports", "../checks/isNumber"], function (require, exports, isNumber_1) {
    "use strict";
    function isInteger(x) {
        return isNumber_1.default(x) && x % 1 === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isInteger;
});

define('davinci-eight/checks/mustBeInteger',["require", "exports", "../checks/mustSatisfy", "../checks/isInteger"], function (require, exports, mustSatisfy_1, isInteger_1) {
    "use strict";
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

define('davinci-eight/checks/isString',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(s) {
        return (typeof s === 'string');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isString;
});

define('davinci-eight/checks/mustBeString',["require", "exports", "../checks/mustSatisfy", "../checks/isString"], function (require, exports, mustSatisfy_1, isString_1) {
    "use strict";
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

define('davinci-eight/i18n/readOnly',["require", "exports", "../checks/mustBeString"], function (require, exports, mustBeString_1) {
    "use strict";
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

define('davinci-eight/config',["require", "exports"], function (require, exports) {
    "use strict";
    var Eight = (function () {
        function Eight() {
            this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
            this.LAST_MODIFIED = '2016-12-06';
            this.NAMESPACE = 'EIGHT';
            this.VERSION = '4.0.18';
        }
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
            console.log(message);
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
    }());
    var config = new Eight();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

define('davinci-eight/core/refChange',["require", "exports", "../config", "../checks/isDefined"], function (require, exports, config_1, isDefined_1) {
    "use strict";
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
            return void 0;
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
        return void 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/uuid4',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/core/ShareableBase',["require", "exports", "../checks/isDefined", "../checks/mustBeEQ", "../checks/mustBeInteger", "../checks/mustBeString", "../i18n/readOnly", "./refChange", "./uuid4"], function (require, exports, isDefined_1, mustBeEQ_1, mustBeInteger_1, mustBeString_1, readOnly_1, refChange_1, uuid4_1) {
    "use strict";
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
            enumerable: true,
            configurable: true
        });
        return ShareableBase;
    }());
    exports.ShareableBase = ShareableBase;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLBlendFunc',["require", "exports", "../core/ShareableBase"], function (require, exports, ShareableBase_1) {
    "use strict";
    var WebGLBlendFunc = (function (_super) {
        __extends(WebGLBlendFunc, _super);
        function WebGLBlendFunc(contextManager, sfactor, dfactor) {
            var _this = _super.call(this) || this;
            _this.contextManager = contextManager;
            _this.setLoggingName('WebGLBlendFunc');
            _this.sfactor = sfactor;
            _this.dfactor = dfactor;
            return _this;
        }
        WebGLBlendFunc.prototype.destructor = function (levelUp) {
            this.sfactor = void 0;
            this.dfactor = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        WebGLBlendFunc.prototype.contextFree = function () {
        };
        WebGLBlendFunc.prototype.contextGain = function () {
            this.execute(this.contextManager.gl);
        };
        WebGLBlendFunc.prototype.contextLost = function () {
        };
        WebGLBlendFunc.prototype.execute = function (gl) {
            gl.blendFunc(this.sfactor, this.dfactor);
        };
        return WebGLBlendFunc;
    }(ShareableBase_1.ShareableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebGLBlendFunc;
});

define('davinci-eight/checks/mustBeNumber',["require", "exports", "../checks/mustSatisfy", "../checks/isNumber"], function (require, exports, mustSatisfy_1, isNumber_1) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLClearColor',["require", "exports", "../checks/mustBeNumber", "../core/ShareableBase"], function (require, exports, mustBeNumber_1, ShareableBase_1) {
    "use strict";
    var WebGLClearColor = (function (_super) {
        __extends(WebGLClearColor, _super);
        function WebGLClearColor(contextManager, r, g, b, a) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            if (a === void 0) { a = 1; }
            var _this = _super.call(this) || this;
            _this.contextManager = contextManager;
            _this.setLoggingName('WebGLClearColor');
            _this.r = mustBeNumber_1.default('r', r);
            _this.g = mustBeNumber_1.default('g', g);
            _this.b = mustBeNumber_1.default('b', b);
            _this.a = mustBeNumber_1.default('a', a);
            return _this;
        }
        WebGLClearColor.prototype.destructor = function (levelUp) {
            this.r = void 0;
            this.g = void 0;
            this.b = void 0;
            this.a = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        WebGLClearColor.prototype.contextFree = function () {
        };
        WebGLClearColor.prototype.contextGain = function () {
            mustBeNumber_1.default('r', this.r);
            mustBeNumber_1.default('g', this.g);
            mustBeNumber_1.default('b', this.b);
            mustBeNumber_1.default('a', this.a);
            this.contextManager.gl.clearColor(this.r, this.g, this.b, this.a);
        };
        WebGLClearColor.prototype.contextLost = function () {
        };
        return WebGLClearColor;
    }(ShareableBase_1.ShareableBase));
    exports.WebGLClearColor = WebGLClearColor;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLDisable',["require", "exports", "../checks/mustBeNumber", "../core/ShareableBase"], function (require, exports, mustBeNumber_1, ShareableBase_1) {
    "use strict";
    var WebGLDisable = (function (_super) {
        __extends(WebGLDisable, _super);
        function WebGLDisable(contextManager, capability) {
            var _this = _super.call(this) || this;
            _this.contextManager = contextManager;
            _this.setLoggingName('WebGLDisable');
            _this._capability = mustBeNumber_1.default('capability', capability);
            return _this;
        }
        WebGLDisable.prototype.destructor = function (levelUp) {
            this._capability = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        WebGLDisable.prototype.contextFree = function () {
        };
        WebGLDisable.prototype.contextGain = function () {
            this.contextManager.gl.disable(this._capability);
        };
        WebGLDisable.prototype.contextLost = function () {
        };
        return WebGLDisable;
    }(ShareableBase_1.ShareableBase));
    exports.WebGLDisable = WebGLDisable;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLEnable',["require", "exports", "../checks/mustBeNumber", "../core/ShareableBase"], function (require, exports, mustBeNumber_1, ShareableBase_1) {
    "use strict";
    var WebGLEnable = (function (_super) {
        __extends(WebGLEnable, _super);
        function WebGLEnable(contextManager, capability) {
            var _this = _super.call(this) || this;
            _this.contextManager = contextManager;
            _this.setLoggingName('WebGLEnable');
            _this._capability = mustBeNumber_1.default('capability', capability);
            return _this;
        }
        WebGLEnable.prototype.destructor = function (levelUp) {
            this._capability = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        WebGLEnable.prototype.contextFree = function () {
        };
        WebGLEnable.prototype.contextGain = function () {
            this.contextManager.gl.enable(this._capability);
        };
        WebGLEnable.prototype.contextLost = function () {
        };
        return WebGLEnable;
    }(ShareableBase_1.ShareableBase));
    exports.WebGLEnable = WebGLEnable;
});

define('davinci-eight/checks/isUndefined',["require", "exports"], function (require, exports) {
    "use strict";
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isUndefined;
});

define('davinci-eight/math/VectorN',["require", "exports", "../checks/isDefined", "../checks/isUndefined", "../checks/mustSatisfy"], function (require, exports, isDefined_1, isUndefined_1, mustSatisfy_1) {
    "use strict";
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
    }());
    exports.VectorN = VectorN;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Coords',["require", "exports", "./VectorN"], function (require, exports, VectorN_1) {
    "use strict";
    var Coords = (function (_super) {
        __extends(Coords, _super);
        function Coords(data, modified, size) {
            return _super.call(this, data, modified, size) || this;
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
                        return false;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        };
        return Coords;
    }(VectorN_1.VectorN));
    exports.Coords = Coords;
});

define('davinci-eight/checks/isNull',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(x) {
        return x === null;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/arraysEQ',["require", "exports", "../checks/isDefined", "../checks/isNull", "../checks/isUndefined"], function (require, exports, isDefined_1, isNull_1, isUndefined_1) {
    "use strict";
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
    "use strict";
    function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
        return ax * bx + ay * by + az * bz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorCartesianE3;
});

define('davinci-eight/math/dotVectorE3',["require", "exports", "../math/dotVectorCartesianE3", "../checks/isDefined"], function (require, exports, dotVectorCartesianE3_1, isDefined_1) {
    "use strict";
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

define('davinci-eight/utils/EventEmitter',["require", "exports"], function (require, exports) {
    "use strict";
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
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventEmitter;
});

define('davinci-eight/math/compG3Get',["require", "exports"], function (require, exports) {
    "use strict";
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
            case COORD_W: {
                return m.a;
            }
            case COORD_X: {
                return m.x;
            }
            case COORD_Y: {
                return m.y;
            }
            case COORD_Z: {
                return m.z;
            }
            case COORD_XY: {
                return m.xy;
            }
            case COORD_YZ: {
                return m.yz;
            }
            case COORD_ZX: {
                return m.zx;
            }
            case COORD_XYZ: {
                return m.b;
            }
            default: {
                throw new Error("index => " + index);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gcompE3;
});

define('davinci-eight/math/extE3',["require", "exports"], function (require, exports) {
    "use strict";
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
    "use strict";
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
            case COORD_W: {
                m.a = value;
                break;
            }
            case COORD_X: {
                m.x = value;
                break;
            }
            case COORD_Y: {
                m.y = value;
                break;
            }
            case COORD_Z: {
                m.z = value;
                break;
            }
            case COORD_XY: {
                m.xy = value;
                break;
            }
            case COORD_YZ: {
                m.yz = value;
                break;
            }
            case COORD_ZX: {
                m.zx = value;
                break;
            }
            case COORD_XYZ: {
                m.b = value;
                break;
            }
            default:
                throw new Error("index => " + index);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = compG3Set;
});

define('davinci-eight/math/extG3',["require", "exports", "../math/compG3Get", "../math/extE3", "../math/compG3Set"], function (require, exports, compG3Get_1, extE3_1, compG3Set_1) {
    "use strict";
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

define('davinci-eight/math/gauss',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/math/isScalarG3',["require", "exports"], function (require, exports) {
    "use strict";
    function isScalarG3(m) {
        return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isScalarG3;
});

define('davinci-eight/math/lcoE3',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/math/lcoG3',["require", "exports", "../math/compG3Get", "../math/lcoE3", "../math/compG3Set"], function (require, exports, compG3Get_1, lcoE3_1, compG3Set_1) {
    "use strict";
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

define('davinci-eight/checks/isObject',["require", "exports"], function (require, exports) {
    "use strict";
    function isObject(x) {
        return (typeof x === 'object');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isObject;
});

define('davinci-eight/math/maskG3',["require", "exports", "../checks/isNumber", "../checks/isObject"], function (require, exports, isNumber_1, isObject_1) {
    "use strict";
    var scratch = { a: 0, x: 0, y: 0, z: 0, yz: 0, zx: 0, xy: 0, b: 0 };
    function default_1(arg) {
        if (isObject_1.default(arg) && 'maskG3' in arg) {
            var duck = arg;
            var g = arg;
            if (duck.maskG3 & 0x1) {
                scratch.a = g.a;
            }
            else {
                scratch.a = 0;
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
                scratch.b = g.b;
            }
            else {
                scratch.b = 0;
            }
            return scratch;
        }
        else if (isNumber_1.default(arg)) {
            scratch.a = arg;
            scratch.x = 0;
            scratch.y = 0;
            scratch.z = 0;
            scratch.yz = 0;
            scratch.zx = 0;
            scratch.xy = 0;
            scratch.b = 0;
            return scratch;
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/mulE3',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/math/mulG3',["require", "exports", "../math/compG3Get", "../math/mulE3"], function (require, exports, compG3Get_1, mulE3_1) {
    "use strict";
    function mulG3(a, b, out) {
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.z;
        var a4 = a.xy;
        var a5 = a.yz;
        var a6 = a.zx;
        var a7 = a.b;
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
    exports.default = mulG3;
});

define('davinci-eight/checks/mustBeNonNullObject',["require", "exports", "../checks/mustSatisfy", "../checks/isNull", "../checks/isObject"], function (require, exports, mustSatisfy_1, isNull_1, isObject_1) {
    "use strict";
    function beObject() {
        return "be a non-null `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isObject_1.default(value) && !isNull_1.default(value), beObject, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeObject;
});

define('davinci-eight/math/randomRange',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(a, b) {
        return (b - a) * Math.random() + a;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/rcoE3',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/math/rcoG3',["require", "exports", "../math/compG3Get", "../math/rcoE3", "../math/compG3Set"], function (require, exports, compG3Get_1, rcoE3_1, compG3Set_1) {
    "use strict";
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

define('davinci-eight/math/quadVectorE3',["require", "exports", "../math/dotVectorCartesianE3", "../checks/isDefined", "../checks/isNumber"], function (require, exports, dotVectorCartesianE3_1, isDefined_1, isNumber_1) {
    "use strict";
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
    "use strict";
    function wedgeXY(ax, ay, az, bx, by, bz) {
        return ax * by - ay * bx;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeXY;
});

define('davinci-eight/math/wedgeYZ',["require", "exports"], function (require, exports) {
    "use strict";
    function wedgeYZ(ax, ay, az, bx, by, bz) {
        return ay * bz - az * by;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeYZ;
});

define('davinci-eight/math/wedgeZX',["require", "exports"], function (require, exports) {
    "use strict";
    function wedgeZX(ax, ay, az, bx, by, bz) {
        return az * bx - ax * bz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeZX;
});

define('davinci-eight/math/rotorFromDirectionsE3',["require", "exports", "./dotVectorE3", "./quadVectorE3", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (require, exports, dotVectorE3_1, quadVectorE3_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    "use strict";
    var sqrt = Math.sqrt;
    function default_1(a, b, B, m) {
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
            if (B) {
                m.rotorFromGeneratorAngle(B, Math.PI);
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
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/scpG3',["require", "exports", "../math/compG3Get", "../math/mulE3", "../math/compG3Set"], function (require, exports, compG3Get_1, mulE3_1, compG3Set_1) {
    "use strict";
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
    "use strict";
    function squaredNormG3(m) {
        var a = m.a;
        var x = m.x;
        var y = m.y;
        var z = m.z;
        var yz = m.yz;
        var zx = m.zx;
        var xy = m.xy;
        var b = m.b;
        return a * a + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + b * b;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = squaredNormG3;
});

define('davinci-eight/checks/isArray',["require", "exports"], function (require, exports) {
    "use strict";
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isArray;
});

define('davinci-eight/checks/mustBeArray',["require", "exports", "../checks/mustSatisfy", "../checks/isArray"], function (require, exports, mustSatisfy_1, isArray_1) {
    "use strict";
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

define('davinci-eight/math/stringFromCoordinates',["require", "exports", "../checks/isDefined", "../checks/mustBeArray"], function (require, exports, isDefined_1, mustBeArray_1) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Geometric3',["require", "exports", "./Coords", "./arraysEQ", "./dotVectorE3", "../utils/EventEmitter", "./extG3", "./gauss", "../checks/isDefined", "./isScalarG3", "./lcoG3", "./maskG3", "./mulE3", "./mulG3", "../checks/mustBeNonNullObject", "../checks/mustBeNumber", "../checks/mustSatisfy", "./randomRange", "../i18n/readOnly", "./rcoG3", "./rotorFromDirectionsE3", "./scpG3", "./squaredNormG3", "./stringFromCoordinates", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (require, exports, Coords_1, arraysEQ_1, dotVectorE3_1, EventEmitter_1, extG3_1, gauss_1, isDefined_1, isScalarG3_1, lcoG3_1, maskG3_1, mulE3_1, mulG3_1, mustBeNonNullObject_1, mustBeNumber_1, mustSatisfy_1, randomRange_1, readOnly_1, rcoG3_1, rotorFromDirectionsE3_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    "use strict";
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
        return [m.a, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.b];
    }
    var EVENT_NAME_CHANGE = 'change';
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var cos = Math.cos;
    var log = Math.log;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    function scp(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    function norm(v) {
        return Math.sqrt(scp(v, v));
    }
    function cosVectorVector(a, b) {
        return scp(a, b) / (norm(a) * norm(b));
    }
    var cosines = [];
    var Geometric3 = (function (_super) {
        __extends(Geometric3, _super);
        function Geometric3() {
            return _super.call(this, [0, 0, 0, 0, 0, 0, 0, 0], false, 8) || this;
        }
        Geometric3.prototype.ensureBus = function () {
            if (!this._eventBus) {
                this._eventBus = new EventEmitter_1.default(this);
            }
            return this._eventBus;
        };
        Geometric3.prototype.on = function (eventName, callback) {
            this.ensureBus().addEventListener(eventName, callback);
        };
        Geometric3.prototype.off = function (eventName, callback) {
            this.ensureBus().removeEventListener(eventName, callback);
        };
        Geometric3.prototype.setCoordinate = function (index, newValue, name) {
            var coords = this.coords;
            var previous = coords[index];
            if (newValue !== previous) {
                coords[index] = newValue;
                this.modified = true;
                if (this._eventBus) {
                    this._eventBus.emit(EVENT_NAME_CHANGE, name, newValue);
                }
            }
        };
        Object.defineProperty(Geometric3.prototype, "a", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (a) {
                this.setCoordinate(COORD_SCALAR, a, 'a');
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
        Object.defineProperty(Geometric3.prototype, "b", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (b) {
                this.setCoordinate(COORD_PSEUDO, b, 'b');
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
            this.a += M.a * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.z += M.z * α;
            this.yz += M.yz * α;
            this.zx += M.zx * α;
            this.xy += M.xy * α;
            this.b += M.b * α;
            return this;
        };
        Geometric3.prototype.addPseudo = function (β) {
            this.b += β;
            return this;
        };
        Geometric3.prototype.addScalar = function (α) {
            this.a += α;
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
            this.a = a.a + b.a;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            this.b = a.b + b.b;
            return this;
        };
        Geometric3.prototype.adj = function () {
            return this;
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
            this.a = coordinates[COORD_SCALAR];
            this.x = coordinates[COORD_X];
            this.y = coordinates[COORD_Y];
            this.z = coordinates[COORD_Z];
            this.yz = coordinates[COORD_YZ];
            this.zx = coordinates[COORD_ZX];
            this.xy = coordinates[COORD_XY];
            this.b = coordinates[COORD_PSEUDO];
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
            this.a = M.a;
            this.x = M.x;
            this.y = M.y;
            this.z = M.z;
            this.yz = M.yz;
            this.zx = M.zx;
            this.xy = M.xy;
            this.b = M.b;
            return this;
        };
        Geometric3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        Geometric3.prototype.copySpinor = function (spinor) {
            var contextBuilder = function () { return 'copySpinor'; };
            mustBeNonNullObject_1.default('spinor', spinor, contextBuilder);
            var a = mustBeNumber_1.default('spinor.a', spinor.a, contextBuilder);
            var yz = mustBeNumber_1.default('spinor.yz', spinor.yz, contextBuilder);
            var zx = mustBeNumber_1.default('spinor.zx', spinor.zx, contextBuilder);
            var xy = mustBeNumber_1.default('spinor.xy', spinor.xy, contextBuilder);
            this.zero();
            this.a = a;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            return this;
        };
        Geometric3.prototype.copyVector = function (vector) {
            var contextBuilder = function () { return 'copyVector'; };
            mustBeNonNullObject_1.default('vector', vector, contextBuilder);
            var x = mustBeNumber_1.default('vector.x', vector.x, contextBuilder);
            var y = mustBeNumber_1.default('vector.y', vector.y, contextBuilder);
            var z = mustBeNumber_1.default('vector.z', vector.z, contextBuilder);
            this.zero();
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        Geometric3.prototype.cross = function (m) {
            this.ext(m);
            this.dual(this).neg();
            return this;
        };
        Geometric3.prototype.div = function (m) {
            if (isScalarG3_1.default(m)) {
                return this.divByScalar(m.a);
            }
            else {
                var α = m.a;
                var x = m.x;
                var y = m.y;
                var z = m.z;
                var xy = m.xy;
                var yz = m.yz;
                var zx = m.zx;
                var β = m.b;
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
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.z;
                var a4 = this.xy;
                var a5 = this.yz;
                var a6 = this.zx;
                var a7 = this.b;
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
                this.a = c0;
                this.x = c1;
                this.y = c2;
                this.z = c3;
                this.xy = c4;
                this.yz = c5;
                this.zx = c6;
                this.b = c7;
            }
            return this;
        };
        Geometric3.prototype.divByScalar = function (α) {
            this.a /= α;
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.b /= α;
            return this;
        };
        Geometric3.prototype.div2 = function (a, b) {
            var a0 = a.a;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.a;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        Geometric3.prototype.dual = function (m) {
            var w = -m.b;
            var x = -m.yz;
            var y = -m.zx;
            var z = -m.xy;
            var yz = m.x;
            var zx = m.y;
            var xy = m.z;
            var β = m.a;
            this.a = w;
            this.x = x;
            this.y = y;
            this.z = z;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            this.b = β;
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
            var expW = exp(this.a);
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var φ = sqrt(yz * yz + zx * zx + xy * xy);
            var s = φ !== 0 ? sin(φ) / φ : 1;
            var cosφ = cos(φ);
            this.a = cosφ;
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this.scale(expW);
        };
        Geometric3.prototype.inv = function () {
            var α = this.a;
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var xy = this.xy;
            var yz = this.yz;
            var zx = this.zx;
            var β = this.b;
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
            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.z = X[3];
            this.xy = X[4];
            this.yz = X[5];
            this.zx = X[6];
            this.b = X[7];
            return this;
        };
        Geometric3.prototype.isOne = function () {
            return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
        };
        Geometric3.prototype.isZero = function () {
            return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
        };
        Geometric3.prototype.lerp = function (target, α) {
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.b += (target.b - this.b) * α;
            return this;
        };
        Geometric3.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        Geometric3.prototype.log = function () {
            var α = this.a;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var BB = x * x + y * y + z * z;
            var B = sqrt(BB);
            var f = atan2(B, α) / B;
            this.a = log(sqrt(α * α + BB));
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
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            return this;
        };
        Geometric3.prototype.norm = function () {
            this.a = this.magnitudeSansUnits();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        };
        Geometric3.prototype.normalize = function () {
            var norm = this.magnitude();
            if (norm !== 0) {
                this.a = this.a / norm;
                this.x = this.x / norm;
                this.y = this.y / norm;
                this.z = this.z / norm;
                this.yz = this.yz / norm;
                this.zx = this.zx / norm;
                this.xy = this.xy / norm;
                this.b = this.b / norm;
            }
            return this;
        };
        Geometric3.prototype.one = function () {
            this.a = 1;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        };
        Geometric3.prototype.quad = function () {
            this.a = this.squaredNormSansUnits();
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
            var N = Geometric3.fromVector(n);
            var R = N.clone().mul(this).mul(N).scale(-1);
            this.copy(R);
            return this;
        };
        Geometric3.prototype.rev = function () {
            this.a = +this.a;
            this.x = +this.x;
            this.y = +this.y;
            this.z = +this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
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
            var α = R.a;
            var ix = α * x - c * z + a * y;
            var iy = α * y - a * x + b * z;
            var iz = α * z - b * y + c * x;
            var iα = b * x + c * y + a * z;
            this.x = ix * α + iα * b + iy * a - iz * c;
            this.y = iy * α + iα * c + iz * b - ix * a;
            this.z = iz * α + iα * a + ix * c - iy * b;
            return this;
        };
        Geometric3.prototype.rotorFromAxisAngle = function (axis, θ) {
            var contextBuilder = function () { return "rotorFromAxisAngle"; };
            mustBeNonNullObject_1.default('axis', axis, contextBuilder);
            mustBeNumber_1.default('θ', θ, contextBuilder);
            var x = mustBeNumber_1.default('axis.x', axis.x, contextBuilder);
            var y = mustBeNumber_1.default('axis.y', axis.y, contextBuilder);
            var z = mustBeNumber_1.default('axis.z', axis.z, contextBuilder);
            var squaredNorm = x * x + y * y + z * z;
            mustSatisfy_1.default("axis", squaredNorm !== 0, function () { return "|axis| > 0"; }, contextBuilder);
            var norm = Math.sqrt(squaredNorm);
            var yz = x / norm;
            var zx = y / norm;
            var xy = z / norm;
            return this.rotorFromGeneratorAngle({ yz: yz, zx: zx, xy: xy }, θ);
        };
        Geometric3.prototype.rotorFromDirections = function (a, b) {
            return this.rotorFromVectorToVector(a, b, void 0);
        };
        Geometric3.prototype.rotorFromTwoVectors = function (e1, f1, e2, f2) {
            var R1 = Geometric3.rotorFromDirections(e1, f1);
            var f = Geometric3.fromVector(e2).rotate(R1);
            var B = Geometric3.zero().dual(f);
            var R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
            return this.copy(R2).mul(R1);
        };
        Geometric3.prototype.rotorFromFrameToFrame = function (es, fs) {
            var biggestValue = -1;
            var firstVector;
            for (var i = 0; i < 3; i++) {
                cosines[i] = cosVectorVector(es[i], fs[i]);
                if (cosines[i] > biggestValue) {
                    firstVector = i;
                    biggestValue = cosines[i];
                }
            }
            var secondVector = (firstVector + 1) % 3;
            return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
        };
        Geometric3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            mustBeNonNullObject_1.default('B', B);
            mustBeNumber_1.default('θ', θ);
            var φ = θ / 2;
            var yz = B.yz;
            var zx = B.zx;
            var xy = B.xy;
            var quad = yz * yz + zx * zx + xy * xy;
            var m = Math.sqrt(quad);
            var s = sin(m * φ);
            this.a = cos(m * φ);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = -yz * s / m;
            this.zx = -zx * s / m;
            this.xy = -xy * s / m;
            this.b = 0;
            return this;
        };
        Geometric3.prototype.rotorFromVectorToVector = function (a, b, B) {
            rotorFromDirectionsE3_1.default(a, b, B, this);
            return this;
        };
        Geometric3.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        Geometric3.prototype.scp2 = function (a, b) {
            return scpG3_1.default(a, b, this);
        };
        Geometric3.prototype.scale = function (α) {
            this.a *= α;
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.b *= α;
            return this;
        };
        Geometric3.prototype.slerp = function (target, α) {
            return this;
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
            this.a = dotVectorE3_1.default(a, b);
            this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        Geometric3.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            this.a -= M.a * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.b -= M.b * α;
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
            this.a = a.a - b.a;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.b = a.b - b.b;
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
                case 0: {
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.b = 0;
                    break;
                }
                case 1: {
                    this.a = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.b = 0;
                    break;
                }
                case 2: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.b = 0;
                    break;
                }
                case 3: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    break;
                }
                default: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                    this.b = 0;
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
            this.a = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
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
        ;
        Geometric3.one = function () { return new Geometric3().addScalar(1); };
        ;
        Geometric3.e1 = function () { return Geometric3.vector(1, 0, 0); };
        ;
        Geometric3.e2 = function () { return Geometric3.vector(0, 1, 0); };
        ;
        Geometric3.e3 = function () { return Geometric3.vector(0, 0, 1); };
        ;
        Geometric3.I = function () { return new Geometric3().addPseudo(1); };
        ;
        Geometric3.copy = function (M) {
            var copy = new Geometric3();
            copy.a = M.a;
            copy.x = M.x;
            copy.y = M.y;
            copy.z = M.z;
            copy.yz = M.yz;
            copy.zx = M.zx;
            copy.xy = M.xy;
            copy.b = M.b;
            return copy;
        };
        Geometric3.fromBivector = function (B) {
            var copy = new Geometric3();
            copy.yz = B.yz;
            copy.zx = B.zx;
            copy.xy = B.xy;
            return copy;
        };
        Geometric3.fromScalar = function (scalar) {
            return new Geometric3().copyScalar(scalar.a);
        };
        Geometric3.fromSpinor = function (spinor) {
            var copy = new Geometric3();
            copy.a = spinor.a;
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
            var lowerBound = -1;
            var upperBound = +1;
            var g = new Geometric3();
            g.a = randomRange_1.default(lowerBound, upperBound);
            g.x = randomRange_1.default(lowerBound, upperBound);
            g.y = randomRange_1.default(lowerBound, upperBound);
            g.z = randomRange_1.default(lowerBound, upperBound);
            g.yz = randomRange_1.default(lowerBound, upperBound);
            g.zx = randomRange_1.default(lowerBound, upperBound);
            g.xy = randomRange_1.default(lowerBound, upperBound);
            g.b = randomRange_1.default(lowerBound, upperBound);
            return g;
        };
        Geometric3.rotorFromDirections = function (a, b) {
            return new Geometric3().rotorFromDirections(a, b);
        };
        Geometric3.rotorFromVectorToVector = function (a, b, B) {
            return new Geometric3().rotorFromVectorToVector(a, b, B);
        };
        Geometric3.scalar = function (α) {
            return new Geometric3().copyScalar(α);
        };
        Geometric3.spinor = function (yz, zx, xy, α) {
            var spinor = new Geometric3();
            spinor.yz = yz;
            spinor.zx = zx;
            spinor.xy = xy;
            spinor.a = α;
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
    }(Coords_1.Coords));
    exports.Geometric3 = Geometric3;
});

define('davinci-eight/facets/getViewAttitude',["require", "exports", "../math/Geometric3"], function (require, exports, Geometric3_1) {
    "use strict";
    var u = Geometric3_1.Geometric3.zero();
    var v = Geometric3_1.Geometric3.zero();
    var n = Geometric3_1.Geometric3.zero();
    var e1 = Geometric3_1.Geometric3.vector(1, 0, 0);
    var e2 = Geometric3_1.Geometric3.vector(0, 1, 0);
    var e3 = Geometric3_1.Geometric3.vector(0, 0, 1);
    function getViewAttitude(eye, look, up, R) {
        n.copyVector(eye).subVector(look).normalize();
        u.copyVector(up).dual(u).rco(n).neg();
        v.copy(u).ext(n).dual(v);
        R.one().add(u.mul(e1)).add(v.mul(e2)).add(n.mul(e3));
        R.normalize();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getViewAttitude;
});

define('davinci-eight/math/mulSpinorE3YZ',["require", "exports"], function (require, exports) {
    "use strict";
    function mulSpinorE3YZ(R, S) {
        return R.yz * S.a - R.zx * S.xy + R.xy * S.zx + R.a * S.yz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulSpinorE3YZ;
});

define('davinci-eight/math/mulSpinorE3ZX',["require", "exports"], function (require, exports) {
    "use strict";
    function mulSpinorE3ZX(R, S) {
        return R.yz * S.xy + R.zx * S.a - R.xy * S.yz + R.a * S.zx;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulSpinorE3ZX;
});

define('davinci-eight/math/mulSpinorE3XY',["require", "exports"], function (require, exports) {
    "use strict";
    function mulSpinorE3XY(R, S) {
        return -R.yz * S.zx + R.zx * S.yz + R.xy * S.a + R.a * S.xy;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulSpinorE3XY;
});

define('davinci-eight/math/mulSpinorE3alpha',["require", "exports"], function (require, exports) {
    "use strict";
    function mulSpinorE3alpha(R, S) {
        return -R.yz * S.yz - R.zx * S.zx - R.xy * S.xy + R.a * S.a;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulSpinorE3alpha;
});

define('davinci-eight/checks/mustBeObject',["require", "exports", "../checks/mustSatisfy", "../checks/isObject"], function (require, exports, mustSatisfy_1, isObject_1) {
    "use strict";
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

define('davinci-eight/math/quadSpinorE3',["require", "exports", "../checks/isDefined", "../checks/isNumber"], function (require, exports, isDefined_1, isNumber_1) {
    "use strict";
    function quadSpinorE3(s) {
        if (isDefined_1.default(s)) {
            var α = s.a;
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

define('davinci-eight/math/toStringCustom',["require", "exports", "../math/stringFromCoordinates"], function (require, exports, stringFromCoordinates_1) {
    "use strict";
    function toStringCustom(coordinates, coordToString, labels) {
        var quantityString = stringFromCoordinates_1.default(coordinates, coordToString, labels);
        return quantityString;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = toStringCustom;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Spinor3',["require", "exports", "./Coords", "./dotVectorCartesianE3", "./mulSpinorE3YZ", "./mulSpinorE3ZX", "./mulSpinorE3XY", "./mulSpinorE3alpha", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "./quadSpinorE3", "./randomRange", "../i18n/readOnly", "./rotorFromDirectionsE3", "./toStringCustom", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (require, exports, Coords_1, dotVectorCartesianE3_1, mulSpinorE3YZ_1, mulSpinorE3ZX_1, mulSpinorE3XY_1, mulSpinorE3alpha_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, quadSpinorE3_1, randomRange_1, readOnly_1, rotorFromDirectionsE3_1, toStringCustom_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    "use strict";
    var COORD_YZ = 0;
    var COORD_ZX = 1;
    var COORD_XY = 2;
    var COORD_SCALAR = 3;
    var BASIS_LABELS = ['e23', 'e31', 'e12', '1'];
    function coordinates(m) {
        return [m.yz, m.zx, m.xy, m.a];
    }
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var magicCode = Math.random();
    var Spinor3 = (function (_super) {
        __extends(Spinor3, _super);
        function Spinor3(coordinates, code) {
            var _this = _super.call(this, coordinates, false, 4) || this;
            if (code !== magicCode) {
                throw new Error("Use the static creation methods instead of the constructor");
            }
            return _this;
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
        Object.defineProperty(Spinor3.prototype, "a", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (α) {
                mustBeNumber_1.default('α', α);
                this.modified = this.modified || this.a !== α;
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
            this.a += spinor.a * α;
            return this;
        };
        Spinor3.prototype.add2 = function (a, b) {
            this.a = a.a + b.a;
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
            this.a += α;
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
                this.a = source.a;
                return this;
            }
            else {
                throw new Error("source for copy must be a spinor");
            }
        };
        Spinor3.prototype.copyCoordinates = function (coordinates) {
            this.yz = coordinates[COORD_YZ];
            this.zx = coordinates[COORD_ZX];
            this.xy = coordinates[COORD_XY];
            this.a = coordinates[COORD_SCALAR];
            return this;
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
            var a0 = a.a;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.a;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        Spinor3.prototype.divByScalar = function (α) {
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.a /= α;
            return this;
        };
        Spinor3.prototype.dual = function (v, changeSign) {
            this.a = 0;
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
                return this.yz === that.yz && this.zx === that.zx && this.xy === that.xy && this.a === that.a;
            }
            else {
                return false;
            }
        };
        Spinor3.prototype.exp = function () {
            var w = this.a;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var expW = exp(w);
            var φ = sqrt(x * x + y * y + z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.a = expW * cos(φ);
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
            return this.a === 1 && this.xy === 0 && this.yz === 0 && this.zx === 0;
        };
        Spinor3.prototype.isZero = function () {
            return this.a === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0;
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
            var w = this.a;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var bb = x * x + y * y + z * z;
            var Vector2 = sqrt(bb);
            var R0 = Math.abs(w);
            var R = sqrt(w * w + bb);
            this.a = Math.log(R);
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
            this.a = α;
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
            this.a = α;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            return this;
        };
        Spinor3.prototype.neg = function () {
            this.a = -this.a;
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
            this.a = this.a / m;
            return this;
        };
        Spinor3.prototype.one = function () {
            this.a = 1;
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
            var w = this.a;
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nz = n.z;
            var nn = nx * nx + ny * ny + nz * nz;
            var nB = nx * yz + ny * zx + nz * xy;
            this.a = nn * w;
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
            return this.rotorFromVectorToVector(a, b, void 0);
        };
        Spinor3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -B.yz * s;
            this.zx = -B.zx * s;
            this.xy = -B.xy * s;
            this.a = cos(φ);
            return this;
        };
        Spinor3.prototype.rotorFromVectorToVector = function (a, b, B) {
            rotorFromDirectionsE3_1.default(a, b, B, this);
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
            this.a *= α;
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
            this.a -= s.a * α;
            return this;
        };
        Spinor3.prototype.sub2 = function (a, b) {
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.a = a.a - b.a;
            return this;
        };
        Spinor3.prototype.versor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.a = dotVectorCartesianE3_1.default(ax, ay, az, bx, by, bz);
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
            this.a = 0;
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
                        this.a = 0;
                    }
                    break;
                default: {
                    this.a = 0;
                    this.yz = 0;
                    this.zx = 0;
                    this.xy = 0;
                }
            }
            return this;
        };
        Spinor3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return toStringCustom_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Spinor3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return toStringCustom_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Spinor3.prototype.toPrecision = function (position) {
            var coordToString = function (coord) { return coord.toPrecision(position); };
            return toStringCustom_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Spinor3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return toStringCustom_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Spinor3.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        Spinor3.prototype.ext2 = function (a, b) {
            return this;
        };
        Spinor3.prototype.zero = function () {
            this.a = 0;
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
        Spinor3.fromBivector = function (B) {
            return new Spinor3([B.yz, B.zx, B.xy, 0], magicCode);
        };
        Spinor3.isOne = function (spinor) {
            return spinor.a === 1 && spinor.yz === 0 && spinor.zx === 0 && spinor.xy === 0;
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
    }(Coords_1.Coords));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spinor3;
});

define('davinci-eight/checks/mustBeDefined',["require", "exports", "../checks/mustSatisfy", "../checks/isDefined"], function (require, exports, mustSatisfy_1, isDefined_1) {
    "use strict";
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

define('davinci-eight/checks/expectArg',["require", "exports", "../checks/isUndefined", "../checks/mustBeNumber"], function (require, exports, isUndefined_1, mustBeNumber_1) {
    "use strict";
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

define('davinci-eight/math/AbstractMatrix',["require", "exports", "../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/expectArg", "../i18n/readOnly"], function (require, exports, mustBeDefined_1, mustBeInteger_1, expectArg_1, readOnly_1) {
    "use strict";
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
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractMatrix;
});

define('davinci-eight/math/det3x3',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(m) {
        var m00 = m[0x0], m01 = m[0x3], m02 = m[0x6];
        var m10 = m[0x1], m11 = m[0x4], m12 = m[0x7];
        var m20 = m[0x2], m21 = m[0x5], m22 = m[0x8];
        return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/math/inv3x3',["require", "exports", "../math/det3x3"], function (require, exports, det3x3_1) {
    "use strict";
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
    "use strict";
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
define('davinci-eight/math/Matrix3',["require", "exports", "../math/AbstractMatrix", "../math/det3x3", "../math/inv3x3", "../math/mul3x3", "../checks/mustBeNumber"], function (require, exports, AbstractMatrix_1, det3x3_1, inv3x3_1, mul3x3_1, mustBeNumber_1) {
    "use strict";
    function add3x3(a, b, c) {
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
    }
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
        function Matrix3(elements) {
            return _super.call(this, elements, 3) || this;
        }
        Matrix3.prototype.add = function (rhs) {
            return this.add2(this, rhs);
        };
        Matrix3.prototype.add2 = function (a, b) {
            add3x3(a.elements, b.elements, this.elements);
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
            var α = spinor.a;
            var β = spinor.b;
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
    }(AbstractMatrix_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Matrix3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Vector3',["require", "exports", "./Coords", "./dotVectorE3", "./Matrix3", "../checks/isDefined", "../checks/isNumber", "./randomRange", "../i18n/readOnly", "./toStringCustom", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (require, exports, Coords_1, dotVectorE3_1, Matrix3_1, isDefined_1, isNumber_1, randomRange_1, readOnly_1, toStringCustom_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    "use strict";
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
            return _super.call(this, data, modified, 3) || this;
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
            var w = R.a;
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
        Vector3.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        };
        Vector3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return toStringCustom_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Vector3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return toStringCustom_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Vector3.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return toStringCustom_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        Vector3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return toStringCustom_1.default(coordinates(this), coordToString, BASIS_LABELS);
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
        Vector3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Vector3) {
                return lhs.clone().add(this, 1.0);
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
        Vector3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Vector3) {
                return lhs.clone().sub(this, 1.0);
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
        Vector3.prototype.__div__ = function (rhs) {
            if (isNumber_1.default(rhs)) {
                return this.clone().divByScalar(rhs);
            }
            else {
                return void 0;
            }
        };
        Vector3.prototype.__rdiv__ = function (lhs) {
            return void 0;
        };
        Vector3.prototype.__pos__ = function () {
            return Vector3.copy(this);
        };
        Vector3.prototype.__neg__ = function () {
            return Vector3.copy(this).neg();
        };
        Vector3.copy = function (vector) {
            return new Vector3([vector.x, vector.y, vector.z]);
        };
        Vector3.dual = function (B, changeSign) {
            if (changeSign === void 0) { changeSign = false; }
            if (changeSign) {
                return new Vector3([B.yz, B.zx, B.xy]);
            }
            else {
                return new Vector3([-B.yz, -B.zx, -B.xy]);
            }
        };
        Vector3.e1 = function () {
            return new Vector3([1, 0, 0]);
        };
        Vector3.e2 = function () {
            return new Vector3([0, 1, 0]);
        };
        Vector3.e3 = function () {
            return new Vector3([0, 0, 1]);
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
    }(Coords_1.Coords));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector3;
});

define('davinci-eight/geometries/b2',["require", "exports"], function (require, exports) {
    "use strict";
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
    "use strict";
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

define('davinci-eight/i18n/notImplemented',["require", "exports", "../checks/mustBeString"], function (require, exports, mustBeString_1) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Vector2',["require", "exports", "../math/Coords", "../geometries/b2", "../geometries/b3", "../i18n/notImplemented", "./randomRange", "../math/stringFromCoordinates"], function (require, exports, Coords_1, b2_1, b3_1, notImplemented_1, randomRange_1, stringFromCoordinates_1) {
    "use strict";
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var COORD_Y = 1;
    var Vector2 = (function (_super) {
        __extends(Vector2, _super);
        function Vector2(data, modified) {
            if (data === void 0) { data = [0, 0]; }
            if (modified === void 0) { modified = false; }
            return _super.call(this, data, modified, 2) || this;
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
            var α = spinor.a;
            var β = spinor.b;
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
    }(Coords_1.Coords));
    exports.Vector2 = Vector2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/controls/MouseControls',["require", "exports", "../checks/mustBeObject", "../core/ShareableBase", "../math/Vector2"], function (require, exports, mustBeObject_1, ShareableBase_1, Vector2_1) {
    "use strict";
    var MODE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
    var keys = [65, 83, 68];
    var MouseControls = (function (_super) {
        __extends(MouseControls, _super);
        function MouseControls(wnd) {
            if (wnd === void 0) { wnd = window; }
            var _this = _super.call(this) || this;
            _this.enabled = true;
            _this.noRotate = false;
            _this.noZoom = false;
            _this.noPan = false;
            _this.minDistance = 0;
            _this.maxDistance = Infinity;
            _this.mode = MODE.NONE;
            _this.prevMode = MODE.NONE;
            _this.moveCurr = new Vector2_1.Vector2();
            _this.movePrev = new Vector2_1.Vector2();
            _this.zoomStart = new Vector2_1.Vector2();
            _this.zoomEnd = new Vector2_1.Vector2();
            _this.panStart = new Vector2_1.Vector2();
            _this.panEnd = new Vector2_1.Vector2();
            _this.screenLoc = new Vector2_1.Vector2();
            _this.circleExt = new Vector2_1.Vector2();
            _this.screenExt = new Vector2_1.Vector2();
            _this.mouseOnCircle = new Vector2_1.Vector2();
            _this.mouseOnScreen = new Vector2_1.Vector2();
            _this.setLoggingName('MouseControls');
            _this.wnd = mustBeObject_1.default('wnd', wnd);
            _this.mousedown = function (event) {
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
            _this.mousemove = function (event) {
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
            _this.mouseup = function (event) {
                if (!_this.enabled) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                _this.mode = MODE.NONE;
                _this.wnd.document.removeEventListener('mousemove', _this.mousemove);
                _this.wnd.document.removeEventListener('mouseup', _this.mouseup);
            };
            _this.mousewheel = function (event) {
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
            _this.keydown = function (event) {
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
            _this.keyup = function (event) {
                if (!_this.enabled) {
                    return;
                }
                _this.mode = _this.prevMode;
                _this.wnd.addEventListener('keydown', _this.keydown, false);
            };
            return _this;
        }
        MouseControls.prototype.destructor = function (levelUp) {
            if (this.domElement) {
                this.unsubscribe();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
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
            this.disableContextMenu();
            this.domElement.addEventListener('mousedown', this.mousedown, false);
            this.domElement.addEventListener('mousewheel', this.mousewheel, false);
            this.domElement.addEventListener('DOMMouseScroll', this.mousewheel, false);
            this.wnd.addEventListener('keydown', this.keydown, false);
            this.wnd.addEventListener('keyup', this.keydown, false);
            this.handleResize();
        };
        MouseControls.prototype.unsubscribe = function () {
            if (this.domElement) {
                this.enableContextMenu();
                this.domElement.removeEventListener('mousedown', this.mousedown, false);
                this.domElement.removeEventListener('mousewheel', this.mousewheel, false);
                this.domElement.removeEventListener('DOMMouseScroll', this.mousewheel, false);
                this.domElement = void 0;
                this.wnd.removeEventListener('keydown', this.keydown, false);
                this.wnd.removeEventListener('keyup', this.keydown, false);
            }
        };
        MouseControls.prototype.disableContextMenu = function () {
            if (this.domElement) {
                if (!this.contextmenu) {
                    this.contextmenu = function (event) {
                        event.preventDefault();
                    };
                    this.domElement.addEventListener('contextmenu', this.contextmenu, false);
                }
            }
        };
        MouseControls.prototype.enableContextMenu = function () {
            if (this.domElement) {
                if (this.contextmenu) {
                    this.domElement.removeEventListener('contextmenu', this.contextmenu, false);
                    this.contextmenu = void 0;
                }
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
    }(ShareableBase_1.ShareableBase));
    exports.MouseControls = MouseControls;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/controls/ViewControls',["require", "exports", "./MouseControls", "../math/Vector3"], function (require, exports, MouseControls_1, Vector3_1) {
    "use strict";
    var ViewControls = (function (_super) {
        __extends(ViewControls, _super);
        function ViewControls(view, wnd) {
            if (wnd === void 0) { wnd = window; }
            var _this = _super.call(this, wnd) || this;
            _this.rotateSpeed = 1;
            _this.zoomSpeed = 1;
            _this.panSpeed = 1;
            _this.eye0 = Vector3_1.default.vector(0, 0, 1);
            _this.look0 = Vector3_1.default.zero();
            _this.up0 = Vector3_1.default.vector(0, 1, 0);
            _this.eyeMinusLook = new Vector3_1.default();
            _this.look = new Vector3_1.default();
            _this.up = new Vector3_1.default();
            _this.setLoggingName('ViewControls');
            _this.setView(view);
            return _this;
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
                this.view.eye.x = this.look.x + this.eyeMinusLook.x;
                this.view.eye.y = this.look.y + this.eyeMinusLook.y;
                this.view.eye.z = this.look.z + this.eyeMinusLook.z;
                this.view.look.x = this.look.x;
                this.view.look.y = this.look.y;
                this.view.look.z = this.look.z;
                this.view.up.x = this.up.x;
                this.view.up.y = this.up.y;
                this.view.up.z = this.up.z;
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
                this.view.eye.x = this.eye0.x;
                this.view.eye.y = this.eye0.y;
                this.view.eye.z = this.eye0.z;
                this.view.look.x = this.look0.x;
                this.view.look.y = this.look0.y;
                this.view.look.z = this.look0.z;
                this.view.up.x = this.up0.x;
                this.view.up.y = this.up0.y;
                this.view.up.z = this.up0.z;
            }
            _super.prototype.reset.call(this);
        };
        ViewControls.prototype.setView = function (view) {
            if (view) {
                this.view = view;
            }
            else {
                this.view = void 0;
            }
            this.synchronize();
        };
        ViewControls.prototype.synchronize = function () {
            var view = this.view;
            if (view) {
                this.eye0.copy(view.eye);
                this.look0.copy(view.look);
                this.up0.copy(view.up);
            }
            else {
                this.eye0.setXYZ(0, 0, 1);
                this.look0.zero();
                this.up0.setXYZ(0, 1, 0);
            }
        };
        return ViewControls;
    }(MouseControls_1.MouseControls));
    exports.ViewControls = ViewControls;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/controls/OrbitControls',["require", "exports", "../math/Geometric3", "../facets/getViewAttitude", "../math/Spinor3", "../math/Vector3", "./ViewControls"], function (require, exports, Geometric3_1, getViewAttitude_1, Spinor3_1, Vector3_1, ViewControls_1) {
    "use strict";
    var a = Geometric3_1.Geometric3.zero();
    var b = Geometric3_1.Geometric3.zero();
    var d = Geometric3_1.Geometric3.zero();
    var B = Spinor3_1.default.one();
    var R = Spinor3_1.default.one();
    var X = Vector3_1.default.zero();
    var OrbitControls = (function (_super) {
        __extends(OrbitControls, _super);
        function OrbitControls(view, wnd) {
            if (wnd === void 0) { wnd = window; }
            var _this = _super.call(this, view, wnd) || this;
            _this.setLoggingName('OrbitControls');
            return _this;
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
    }(ViewControls_1.ViewControls));
    exports.OrbitControls = OrbitControls;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/controls/TrackballControls',["require", "exports", "../math/Spinor3", "../math/Vector2", "../math/Vector3", "./ViewControls"], function (require, exports, Spinor3_1, Vector2_1, Vector3_1, ViewControls_1) {
    "use strict";
    var TrackballControls = (function (_super) {
        __extends(TrackballControls, _super);
        function TrackballControls(view, wnd) {
            if (wnd === void 0) { wnd = window; }
            var _this = _super.call(this, view, wnd) || this;
            _this.moveDirection = new Vector3_1.default();
            _this.eyeMinusLookDirection = new Vector3_1.default();
            _this.objectUpDirection = new Vector3_1.default();
            _this.objectSidewaysDirection = new Vector3_1.default();
            _this.B = Spinor3_1.default.zero();
            _this.rotor = Spinor3_1.default.one();
            _this.mouseChange = new Vector2_1.Vector2();
            _this.pan = new Vector3_1.default();
            _this.objectUp = new Vector3_1.default();
            _this.setLoggingName('TrackballControls');
            return _this;
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
    }(ViewControls_1.ViewControls));
    exports.TrackballControls = TrackballControls;
});

define('davinci-eight/core/Attrib',["require", "exports", "../i18n/readOnly"], function (require, exports, readOnly_1) {
    "use strict";
    var Attrib = (function () {
        function Attrib(info) {
            this._name = info.name;
        }
        Object.defineProperty(Attrib.prototype, "index", {
            get: function () {
                return this._index;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('index').message);
            },
            enumerable: true,
            configurable: true
        });
        Attrib.prototype.contextFree = function () {
            this._index = void 0;
            this._gl = void 0;
        };
        Attrib.prototype.contextGain = function (context, program) {
            this._index = context.getAttribLocation(program, this._name);
            this._gl = context;
        };
        Attrib.prototype.contextLost = function () {
            this._index = void 0;
            this._gl = void 0;
        };
        Attrib.prototype.config = function (size, type, normalized, stride, offset) {
            if (normalized === void 0) { normalized = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this._gl.vertexAttribPointer(this._index, size, type, normalized, stride, offset);
        };
        Attrib.prototype.enable = function () {
            this._gl.enableVertexAttribArray(this._index);
        };
        Attrib.prototype.disable = function () {
            this._gl.disableVertexAttribArray(this._index);
        };
        Attrib.prototype.toString = function () {
            return ['attribute', this._name].join(' ');
        };
        return Attrib;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Attrib;
});

define('davinci-eight/core/BeginMode',["require", "exports"], function (require, exports) {
    "use strict";
    (function (BeginMode) {
        BeginMode[BeginMode["POINTS"] = 0] = "POINTS";
        BeginMode[BeginMode["LINES"] = 1] = "LINES";
        BeginMode[BeginMode["LINE_LOOP"] = 2] = "LINE_LOOP";
        BeginMode[BeginMode["LINE_STRIP"] = 3] = "LINE_STRIP";
        BeginMode[BeginMode["TRIANGLES"] = 4] = "TRIANGLES";
        BeginMode[BeginMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        BeginMode[BeginMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(exports.BeginMode || (exports.BeginMode = {}));
    var BeginMode = exports.BeginMode;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BeginMode;
});

define('davinci-eight/core/BlendingFactorDest',["require", "exports"], function (require, exports) {
    "use strict";
    (function (BlendingFactorDest) {
        BlendingFactorDest[BlendingFactorDest["ZERO"] = 0] = "ZERO";
        BlendingFactorDest[BlendingFactorDest["ONE"] = 1] = "ONE";
        BlendingFactorDest[BlendingFactorDest["SRC_COLOR"] = 768] = "SRC_COLOR";
        BlendingFactorDest[BlendingFactorDest["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
        BlendingFactorDest[BlendingFactorDest["SRC_ALPHA"] = 770] = "SRC_ALPHA";
        BlendingFactorDest[BlendingFactorDest["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
        BlendingFactorDest[BlendingFactorDest["DST_ALPHA"] = 772] = "DST_ALPHA";
        BlendingFactorDest[BlendingFactorDest["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
    })(exports.BlendingFactorDest || (exports.BlendingFactorDest = {}));
    var BlendingFactorDest = exports.BlendingFactorDest;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BlendingFactorDest;
});

define('davinci-eight/core/BlendingFactorSrc',["require", "exports"], function (require, exports) {
    "use strict";
    (function (BlendingFactorSrc) {
        BlendingFactorSrc[BlendingFactorSrc["ZERO"] = 0] = "ZERO";
        BlendingFactorSrc[BlendingFactorSrc["ONE"] = 1] = "ONE";
        BlendingFactorSrc[BlendingFactorSrc["DST_COLOR"] = 774] = "DST_COLOR";
        BlendingFactorSrc[BlendingFactorSrc["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
        BlendingFactorSrc[BlendingFactorSrc["SRC_ALPHA_SATURATE"] = 776] = "SRC_ALPHA_SATURATE";
        BlendingFactorSrc[BlendingFactorSrc["SRC_ALPHA"] = 770] = "SRC_ALPHA";
        BlendingFactorSrc[BlendingFactorSrc["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
        BlendingFactorSrc[BlendingFactorSrc["DST_ALPHA"] = 772] = "DST_ALPHA";
        BlendingFactorSrc[BlendingFactorSrc["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
    })(exports.BlendingFactorSrc || (exports.BlendingFactorSrc = {}));
    var BlendingFactorSrc = exports.BlendingFactorSrc;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BlendingFactorSrc;
});

define('davinci-eight/core/Capability',["require", "exports"], function (require, exports) {
    "use strict";
    (function (Capability) {
        Capability[Capability["CULL_FACE"] = 2884] = "CULL_FACE";
        Capability[Capability["BLEND"] = 3042] = "BLEND";
        Capability[Capability["DITHER"] = 3024] = "DITHER";
        Capability[Capability["STENCIL_TEST"] = 2960] = "STENCIL_TEST";
        Capability[Capability["DEPTH_TEST"] = 2929] = "DEPTH_TEST";
        Capability[Capability["SCISSOR_TEST"] = 3089] = "SCISSOR_TEST";
        Capability[Capability["POLYGON_OFFSET_FILL"] = 32823] = "POLYGON_OFFSET_FILL";
        Capability[Capability["SAMPLE_ALPHA_TO_COVERAGE"] = 32926] = "SAMPLE_ALPHA_TO_COVERAGE";
        Capability[Capability["SAMPLE_COVERAGE"] = 32928] = "SAMPLE_COVERAGE";
    })(exports.Capability || (exports.Capability = {}));
    var Capability = exports.Capability;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Capability;
});

define('davinci-eight/core/ClearBufferMask',["require", "exports"], function (require, exports) {
    "use strict";
    (function (ClearBufferMask) {
        ClearBufferMask[ClearBufferMask["DEPTH_BUFFER_BIT"] = 256] = "DEPTH_BUFFER_BIT";
        ClearBufferMask[ClearBufferMask["STENCIL_BUFFER_BIT"] = 1024] = "STENCIL_BUFFER_BIT";
        ClearBufferMask[ClearBufferMask["COLOR_BUFFER_BIT"] = 16384] = "COLOR_BUFFER_BIT";
    })(exports.ClearBufferMask || (exports.ClearBufferMask = {}));
    var ClearBufferMask = exports.ClearBufferMask;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ClearBufferMask;
});

define('davinci-eight/math/clamp',["require", "exports", "../checks/mustBeNumber"], function (require, exports, mustBeNumber_1) {
    "use strict";
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
    "use strict";
    function default_1(value, limit) {
        return value >= limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/mustBeGE',["require", "exports", "../checks/mustSatisfy", "../checks/isGE"], function (require, exports, mustSatisfy_1, isGE_1) {
    "use strict";
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isGE_1.default(value, limit), function () { return "be greater than or equal to " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/isLE',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(value, limit) {
        return value <= limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/mustBeLE',["require", "exports", "../checks/mustSatisfy", "../checks/isLE"], function (require, exports, mustSatisfy_1, isLE_1) {
    "use strict";
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isLE_1.default(value, limit), function () { return "be less than or equal to " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/core/principalAngle',["require", "exports"], function (require, exports) {
    "use strict";
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
define('davinci-eight/core/Color',["require", "exports", "../math/clamp", "../math/Coords", "../checks/isDefined", "../checks/mustBeArray", "../checks/mustBeGE", "../checks/mustBeLE", "../checks/mustBeNumber", "./principalAngle"], function (require, exports, clamp_1, Coords_1, isDefined_1, mustBeArray_1, mustBeGE_1, mustBeLE_1, mustBeNumber_1, principalAngle_1) {
    "use strict";
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    var Color = (function (_super) {
        __extends(Color, _super);
        function Color(r, g, b) {
            var _this = _super.call(this, [r, g, b], false, 3) || this;
            mustBeGE_1.default('r', r, 0);
            mustBeLE_1.default('r', r, 1);
            mustBeGE_1.default('g', g, 0);
            mustBeLE_1.default('g', g, 1);
            mustBeGE_1.default('b', b, 0);
            mustBeLE_1.default('b', b, 1);
            return _this;
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
        Object.defineProperty(Color.prototype, "red", {
            get: function () {
                return this.coords[COORD_R];
            },
            set: function (red) {
                this.coords[COORD_R] = clamp_1.default(red, 0, 1);
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
        Object.defineProperty(Color.prototype, "green", {
            get: function () {
                return this.coords[COORD_G];
            },
            set: function (green) {
                this.coords[COORD_G] = clamp_1.default(green, 0, 1);
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
        Object.defineProperty(Color.prototype, "blue", {
            get: function () {
                return this.coords[COORD_B];
            },
            set: function (blue) {
                this.coords[COORD_B] = clamp_1.default(blue, 0, 1);
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
            }
            else {
                this.r = Math.random();
                this.g = Math.random();
                this.b = Math.random();
            }
            return this;
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
            this.r = this.r * α;
            this.g = this.g * α;
            this.b = this.b * α;
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
                throw new Error(name + " must be a Color.");
            }
        };
        Color.random = function () {
            return Color.fromRGB(Math.random(), Math.random(), Math.random());
        };
        return Color;
    }(Coords_1.Coords));
    exports.Color = Color;
    Color.black = new Color(0, 0, 0);
    Color.blue = new Color(0, 0, 1);
    Color.green = new Color(0, 1, 0);
    Color.cyan = new Color(0, 1, 1);
    Color.red = new Color(1, 0, 0);
    Color.magenta = new Color(1, 0, 1);
    Color.yellow = new Color(1, 1, 0);
    Color.white = new Color(1, 1, 1);
    Color.gray = new Color(0.5, 0.5, 0.5);
    var rgb255 = function (red, green, blue) {
        var UBYTEMAX = 255;
        return new Color(red / UBYTEMAX, green / UBYTEMAX, blue / UBYTEMAX);
    };
    Color.blueviolet = rgb255(138, 43, 226);
    Color.chartreuse = rgb255(127, 255, 0);
    Color.cobalt = rgb255(61, 89, 171);
    Color.hotpink = rgb255(255, 105, 180);
    Color.lime = rgb255(0, 255, 0);
    Color.slateblue = rgb255(113, 113, 198);
    Color.springgreen = rgb255(0, 255, 127);
    Color.teal = rgb255(56, 142, 142);
});

define('davinci-eight/core/DataType',["require", "exports"], function (require, exports) {
    "use strict";
    (function (DataType) {
        DataType[DataType["BYTE"] = 5120] = "BYTE";
        DataType[DataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        DataType[DataType["SHORT"] = 5122] = "SHORT";
        DataType[DataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        DataType[DataType["INT"] = 5124] = "INT";
        DataType[DataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
        DataType[DataType["FLOAT"] = 5126] = "FLOAT";
    })(exports.DataType || (exports.DataType = {}));
    var DataType = exports.DataType;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DataType;
});

define('davinci-eight/base/exchange',["require", "exports"], function (require, exports) {
    "use strict";
    function exchange(mine, yours) {
        if (mine !== yours) {
            if (yours && yours.addRef) {
                yours.addRef();
            }
            if (mine && mine.release) {
                mine.release();
            }
            return yours;
        }
        else {
            return mine;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exchange;
});

define('davinci-eight/core/GraphicsProgramSymbols',["require", "exports"], function (require, exports) {
    "use strict";
    var GraphicsProgramSymbols = (function () {
        function GraphicsProgramSymbols() {
        }
        return GraphicsProgramSymbols;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphicsProgramSymbols;
    GraphicsProgramSymbols.ATTRIBUTE_COLOR = 'aColor';
    GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
    GraphicsProgramSymbols.ATTRIBUTE_NORMAL = 'aNormal';
    GraphicsProgramSymbols.ATTRIBUTE_OPACITY = 'aOpacity';
    GraphicsProgramSymbols.ATTRIBUTE_POSITION = 'aPosition';
    GraphicsProgramSymbols.ATTRIBUTE_TANGENT = 'aTangent';
    GraphicsProgramSymbols.ATTRIBUTE_COORDS = 'aCoords';
    GraphicsProgramSymbols.UNIFORM_ALPHA = 'uAlpha';
    GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
    GraphicsProgramSymbols.UNIFORM_COLOR = 'uColor';
    GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
    GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
    GraphicsProgramSymbols.UNIFORM_IMAGE = 'uImage';
    GraphicsProgramSymbols.UNIFORM_OPACITY = 'uOpacity';
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
});

define('davinci-eight/checks/isBoolean',["require", "exports"], function (require, exports) {
    "use strict";
    function isBoolean(x) {
        return (typeof x === 'boolean');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isBoolean;
});

define('davinci-eight/checks/mustBeBoolean',["require", "exports", "../checks/mustSatisfy", "../checks/isBoolean"], function (require, exports, mustSatisfy_1, isBoolean_1) {
    "use strict";
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

define('davinci-eight/facets/OpacityFacet',["require", "exports", "../checks/mustBeGE", "../checks/mustBeLE", "../checks/mustBeNumber", "../core/GraphicsProgramSymbols"], function (require, exports, mustBeGE_1, mustBeLE_1, mustBeNumber_1, GraphicsProgramSymbols_1) {
    "use strict";
    var OpacityFacet = (function () {
        function OpacityFacet(opacity) {
            if (opacity === void 0) { opacity = 1; }
            mustBeNumber_1.default('opacity', opacity);
            mustBeGE_1.default('opacity', opacity, 0);
            mustBeLE_1.default('opacity', opacity, 1);
            this.opacity = opacity;
        }
        OpacityFacet.prototype.setUniforms = function (visitor) {
            visitor.uniform1f(GraphicsProgramSymbols_1.default.UNIFORM_OPACITY, this.opacity);
        };
        return OpacityFacet;
    }());
    exports.OpacityFacet = OpacityFacet;
});

define('davinci-eight/facets/PointSizeFacet',["require", "exports", "../checks/mustBeInteger", "../core/GraphicsProgramSymbols"], function (require, exports, mustBeInteger_1, GraphicsProgramSymbols_1) {
    "use strict";
    var PointSizeFacet = (function () {
        function PointSizeFacet(pointSize) {
            if (pointSize === void 0) { pointSize = 2; }
            this.pointSize = mustBeInteger_1.default('pointSize', pointSize);
        }
        PointSizeFacet.prototype.setUniforms = function (visitor) {
            visitor.uniform1f(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, this.pointSize);
        };
        return PointSizeFacet;
    }());
    exports.PointSizeFacet = PointSizeFacet;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/ShareableContextConsumer',["require", "exports", "../checks/isUndefined", "../checks/isNull", "../checks/mustBeNonNullObject", "../i18n/readOnly", "./ShareableBase"], function (require, exports, isUndefined_1, isNull_1, mustBeNonNullObject_1, readOnly_1, ShareableBase_1) {
    "use strict";
    var ShareableContextConsumer = (function (_super) {
        __extends(ShareableContextConsumer, _super);
        function ShareableContextConsumer(contextManager) {
            var _this = _super.call(this) || this;
            mustBeNonNullObject_1.default('contextManager', contextManager);
            _this.setLoggingName('ShareableContextConsumer');
            if (!isNull_1.default(contextManager) && !isUndefined_1.default(contextManager)) {
                _this.subscribe(contextManager, false);
            }
            return _this;
        }
        ShareableContextConsumer.prototype.destructor = function (levelUp) {
            this.unsubscribe();
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        ShareableContextConsumer.prototype.subscribe = function (contextManager, synchUp) {
            contextManager = mustBeNonNullObject_1.default('contextManager', contextManager);
            if (!this.contextManager) {
                contextManager.addRef();
                this.contextManager = contextManager;
                contextManager.addContextListener(this);
                if (synchUp) {
                    this.synchUp();
                }
            }
            else {
                if (this.contextManager !== contextManager) {
                    this.unsubscribe();
                    this.subscribe(contextManager, synchUp);
                }
                else {
                }
            }
        };
        ShareableContextConsumer.prototype.synchUp = function () {
            var manager = this.contextManager;
            if (manager) {
                manager.synchronize(this);
            }
        };
        ShareableContextConsumer.prototype.cleanUp = function () {
            if (this.contextManager && this.contextManager.gl) {
                if (this.contextManager.gl.isContextLost()) {
                    this.contextLost();
                }
                else {
                    this.contextFree();
                }
            }
            else {
            }
        };
        ShareableContextConsumer.prototype.unsubscribe = function () {
            if (this.contextManager) {
                this.contextManager.removeContextListener(this);
                this.contextManager.release();
                this.contextManager = void 0;
            }
        };
        ShareableContextConsumer.prototype.contextFree = function () {
        };
        ShareableContextConsumer.prototype.contextGain = function () {
        };
        ShareableContextConsumer.prototype.contextLost = function () {
        };
        Object.defineProperty(ShareableContextConsumer.prototype, "gl", {
            get: function () {
                if (this.contextManager) {
                    return this.contextManager.gl;
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
    }(ShareableBase_1.ShareableBase));
    exports.ShareableContextConsumer = ShareableContextConsumer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/StringShareableMap',["require", "exports", "../core/ShareableBase"], function (require, exports, ShareableBase_1) {
    "use strict";
    var StringShareableMap = (function (_super) {
        __extends(StringShareableMap, _super);
        function StringShareableMap() {
            var _this = _super.call(this) || this;
            _this.elements = {};
            _this.setLoggingName('StringShareableMap');
            return _this;
        }
        StringShareableMap.prototype.destructor = function (levelUp) {
            var _this = this;
            this.forEach(function (key) {
                _this.putWeakRef(key, void 0);
            });
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        StringShareableMap.prototype.exists = function (key) {
            var element = this.elements[key];
            return element ? true : false;
        };
        StringShareableMap.prototype.get = function (key) {
            var element = this.elements[key];
            if (element) {
                if (element.addRef) {
                    element.addRef();
                }
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
            if (value && value.addRef) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        StringShareableMap.prototype.putWeakRef = function (key, value) {
            var elements = this.elements;
            var existing = elements[key];
            if (existing) {
                if (existing.release) {
                    existing.release();
                }
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
    }(ShareableBase_1.ShareableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StringShareableMap;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Drawable',["require", "exports", "../base/exchange", "./GraphicsProgramSymbols", "../checks/isObject", "../checks/isNull", "../checks/isNumber", "../checks/isUndefined", "../checks/mustBeBoolean", "../checks/mustBeNonNullObject", "../facets/OpacityFacet", "../facets/PointSizeFacet", "../core/ShareableContextConsumer", "../collections/StringShareableMap"], function (require, exports, exchange_1, GraphicsProgramSymbols_1, isObject_1, isNull_1, isNumber_1, isUndefined_1, mustBeBoolean_1, mustBeNonNullObject_1, OpacityFacet_1, PointSizeFacet_1, ShareableContextConsumer_1, StringShareableMap_1) {
    "use strict";
    var OPACITY_FACET_NAME = 'opacity';
    var POINTSIZE_FACET_NAME = 'pointSize';
    var Drawable = (function (_super) {
        __extends(Drawable, _super);
        function Drawable(geometry, material, contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeNonNullObject_1.default('contextManager', contextManager)) || this;
            _this._visible = true;
            _this._transparent = false;
            _this.facetMap = new StringShareableMap_1.default();
            _this.setLoggingName('Drawable');
            if (isObject_1.default(geometry)) {
                _this.geometry = geometry;
            }
            if (isObject_1.default(material)) {
                _this.material = material;
            }
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Drawable.prototype.destructor = function (levelUp) {
            this.facetMap.release();
            if (levelUp === 0) {
                this.cleanUp();
            }
            this._geometry = exchange_1.default(this._geometry, void 0);
            this._material = exchange_1.default(this._material, void 0);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Drawable.prototype, "opacity", {
            get: function () {
                var facet = this.getFacet(OPACITY_FACET_NAME);
                if (facet) {
                    return facet.opacity;
                }
                else {
                    return void 0;
                }
            },
            set: function (newOpacity) {
                if (isNumber_1.default(newOpacity)) {
                    var facet = this.getFacet(OPACITY_FACET_NAME);
                    if (facet) {
                        facet.opacity = newOpacity;
                    }
                    else {
                        this.setFacet(OPACITY_FACET_NAME, new OpacityFacet_1.OpacityFacet(newOpacity));
                    }
                }
                else if (isUndefined_1.default(newOpacity) || isNull_1.default(newOpacity)) {
                    this.removeFacet(OPACITY_FACET_NAME);
                }
                else {
                    throw new TypeError("opacity must be a number, undefined, or null.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Drawable.prototype, "pointSize", {
            get: function () {
                var facet = this.getFacet(POINTSIZE_FACET_NAME);
                if (facet) {
                    return facet.pointSize;
                }
                else {
                    return void 0;
                }
            },
            set: function (newPointSize) {
                if (isNumber_1.default(newPointSize)) {
                    var facet = this.getFacet(POINTSIZE_FACET_NAME);
                    if (facet) {
                        facet.pointSize = newPointSize;
                    }
                    else {
                        this.setFacet(POINTSIZE_FACET_NAME, new PointSizeFacet_1.PointSizeFacet(newPointSize));
                    }
                }
                else if (isUndefined_1.default(newPointSize) || isNull_1.default(newPointSize)) {
                    this.removeFacet(POINTSIZE_FACET_NAME);
                }
                else {
                    throw new TypeError("pointSize must be a number, undefined, or null.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Drawable.prototype.bind = function () {
            this._geometry.bind(this._material);
            return this;
        };
        Drawable.prototype.setUniforms = function () {
            var geometry = this._geometry;
            var material = this._material;
            var keys = this.facetMap.keys;
            var keysLength = keys.length;
            for (var i = 0; i < keysLength; i++) {
                var key = keys[i];
                var facet = this.facetMap.getWeakRef(key);
                facet.setUniforms(material);
            }
            geometry.setUniforms(material);
            material.setUniforms(material);
            return this;
        };
        Drawable.prototype.draw = function () {
            if (this._visible) {
                if (this._geometry) {
                    this._geometry.draw();
                }
            }
            return this;
        };
        Drawable.prototype.contextFree = function () {
            if (this._geometry && this._geometry.contextFree) {
                this._geometry.contextFree();
            }
            if (this._material && this._material.contextFree) {
                this._material.contextFree();
            }
            if (_super.prototype.contextFree) {
                _super.prototype.contextFree.call(this);
            }
        };
        Drawable.prototype.contextGain = function () {
            if (this._geometry && this._geometry.contextGain) {
                this._geometry.contextGain();
            }
            if (this._material && this._material.contextGain) {
                this._material.contextGain();
            }
            synchFacets(this._material, this);
            if (_super.prototype.contextGain) {
                _super.prototype.contextGain.call(this);
            }
        };
        Drawable.prototype.contextLost = function () {
            if (this._geometry && this._geometry.contextLost) {
                this._geometry.contextLost();
            }
            if (this._material && this._material.contextLost) {
                this._material.contextLost();
            }
            if (_super.prototype.contextLost) {
                _super.prototype.contextLost.call(this);
            }
        };
        Drawable.prototype.getFacet = function (name) {
            return this.facetMap.get(name);
        };
        Drawable.prototype.render = function (ambients) {
            if (this._visible) {
                this.use().bind().setAmbients(ambients).setUniforms().draw().unbind();
            }
            return this;
        };
        Drawable.prototype.setAmbients = function (ambients) {
            var iL = ambients.length;
            for (var i = 0; i < iL; i++) {
                var facet = ambients[i];
                facet.setUniforms(this._material);
            }
            return this;
        };
        Drawable.prototype.removeFacet = function (name) {
            return this.facetMap.remove(name);
        };
        Drawable.prototype.setFacet = function (name, facet) {
            this.facetMap.put(name, facet);
        };
        Drawable.prototype.unbind = function () {
            this._geometry.unbind(this._material);
            return this;
        };
        Drawable.prototype.use = function () {
            this._material.use();
            return this;
        };
        Object.defineProperty(Drawable.prototype, "geometry", {
            get: function () {
                return exchange_1.default(void 0, this._geometry);
            },
            set: function (geometry) {
                this._geometry = exchange_1.default(this._geometry, geometry);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Drawable.prototype, "material", {
            get: function () {
                return exchange_1.default(void 0, this._material);
            },
            set: function (material) {
                this._material = exchange_1.default(this._material, material);
                synchFacets(this._material, this);
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
                mustBeBoolean_1.default('visible', visible, function () { return _this.getLoggingName(); });
                this._visible = visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Drawable.prototype, "transparent", {
            get: function () {
                return this._transparent;
            },
            set: function (transparent) {
                var _this = this;
                mustBeBoolean_1.default('transparent', transparent, function () { return _this.getLoggingName(); });
                this._transparent = transparent;
            },
            enumerable: true,
            configurable: true
        });
        return Drawable;
    }(ShareableContextConsumer_1.ShareableContextConsumer));
    exports.Drawable = Drawable;
    function synchFacets(material, drawable) {
        if (material) {
            if (material.hasUniform(GraphicsProgramSymbols_1.default.UNIFORM_OPACITY)) {
                if (!isNumber_1.default(drawable.opacity)) {
                    drawable.opacity = 1.0;
                }
            }
            else {
                drawable.removeFacet(OPACITY_FACET_NAME);
            }
            if (material.hasUniform(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE)) {
                if (!isNumber_1.default(drawable.pointSize)) {
                    drawable.pointSize = 2;
                }
            }
            else {
                drawable.removeFacet(POINTSIZE_FACET_NAME);
            }
        }
    }
});

define('davinci-eight/core/DepthFunction',["require", "exports"], function (require, exports) {
    "use strict";
    (function (DepthFunction) {
        DepthFunction[DepthFunction["NEVER"] = 512] = "NEVER";
        DepthFunction[DepthFunction["LESS"] = 513] = "LESS";
        DepthFunction[DepthFunction["EQUAL"] = 514] = "EQUAL";
        DepthFunction[DepthFunction["LEQUAL"] = 515] = "LEQUAL";
        DepthFunction[DepthFunction["GREATER"] = 516] = "GREATER";
        DepthFunction[DepthFunction["NOTEQUAL"] = 517] = "NOTEQUAL";
        DepthFunction[DepthFunction["GEQUAL"] = 518] = "GEQUAL";
        DepthFunction[DepthFunction["ALWAYS"] = 519] = "ALWAYS";
    })(exports.DepthFunction || (exports.DepthFunction = {}));
    var DepthFunction = exports.DepthFunction;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DepthFunction;
});

define('davinci-eight/math/det4x4',["require", "exports"], function (require, exports) {
    "use strict";
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
    "use strict";
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
    "use strict";
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

define('davinci-eight/facets/frustumMatrix',["require", "exports", "../checks/mustBeNumber", "../checks/isDefined"], function (require, exports, mustBeNumber_1, isDefined_1) {
    "use strict";
    function frustumMatrix(left, right, bottom, top, near, far, matrix) {
        mustBeNumber_1.default('left', left);
        mustBeNumber_1.default('right', right);
        mustBeNumber_1.default('bottom', bottom);
        mustBeNumber_1.default('top', top);
        mustBeNumber_1.default('near', near);
        mustBeNumber_1.default('far', far);
        var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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

define('davinci-eight/facets/perspectiveArray',["require", "exports", "./frustumMatrix", "../checks/mustBeNumber"], function (require, exports, frustumMatrix_1, mustBeNumber_1) {
    "use strict";
    function perspectiveArray(fov, aspect, near, far, matrix) {
        mustBeNumber_1.default('fov', fov);
        mustBeNumber_1.default('aspect', aspect);
        mustBeNumber_1.default('near', near);
        mustBeNumber_1.default('far', far);
        var ymax = near * Math.tan(fov * 0.5);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;
        return frustumMatrix_1.default(xmin, xmax, ymin, ymax, near, far, matrix);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = perspectiveArray;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Matrix4',["require", "exports", "../math/AbstractMatrix", "./det4x4", "../math/inv4x4", "../math/mul4x4", "../facets/perspectiveArray"], function (require, exports, AbstractMatrix_1, det4x4_1, inv4x4_1, mul4x4_1, perspectiveArray_1) {
    "use strict";
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
    }
    var Matrix4 = (function (_super) {
        __extends(Matrix4, _super);
        function Matrix4(elements) {
            return _super.call(this, elements, 4) || this;
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
            add4x4(a.elements, b.elements, this.elements);
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
        Matrix4.prototype.perspective = function (fov, aspect, near, far) {
            perspectiveArray_1.default(fov, aspect, near, far, this.elements);
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
            var α = spinor.a;
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
        Matrix4.prototype.translation = function (displacement) {
            var x = displacement.x;
            var y = displacement.y;
            var z = displacement.z;
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
    }(AbstractMatrix_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Matrix4;
});

define('davinci-eight/i18n/notSupported',["require", "exports", "../checks/mustBeString"], function (require, exports, mustBeString_1) {
    "use strict";
    function notSupported(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "Method `" + name + "` is not supported.";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = notSupported;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/GeometryBase',["require", "exports", "../utils/EventEmitter", "../math/Matrix4", "../checks/mustBeObject", "../i18n/notImplemented", "../i18n/notSupported", "./ShareableContextConsumer", "../math/Spinor3"], function (require, exports, EventEmitter_1, Matrix4_1, mustBeObject_1, notImplemented_1, notSupported_1, ShareableContextConsumer_1, Spinor3_1) {
    "use strict";
    var GeometryBase = (function (_super) {
        __extends(GeometryBase, _super);
        function GeometryBase(tilt, contextManager, levelUp) {
            var _this = _super.call(this, contextManager) || this;
            _this.scaling = Matrix4_1.default.one();
            _this.canonicalScale = Matrix4_1.default.one();
            _this.K = Matrix4_1.default.one();
            _this.Kinv = Matrix4_1.default.one();
            _this.Kidentity = true;
            mustBeObject_1.default('contextManager', contextManager);
            _this.setLoggingName("GeometryBase");
            if (tilt && !Spinor3_1.default.isOne(tilt)) {
                _this.Kidentity = false;
                _this.K.rotation(tilt);
                _this.Kinv.copy(_this.K).inv();
            }
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        GeometryBase.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        GeometryBase.prototype.ensureBus = function () {
            if (!this._eventBus) {
                this._eventBus = new EventEmitter_1.default(this);
            }
            return this._eventBus;
        };
        GeometryBase.prototype.on = function (eventName, callback) {
            this.ensureBus().addEventListener(eventName, callback);
        };
        GeometryBase.prototype.off = function (eventName, callback) {
            this.ensureBus().removeEventListener(eventName, callback);
        };
        GeometryBase.prototype.bind = function (material) {
            throw new Error(notSupported_1.default('bind(material: Material)').message);
        };
        GeometryBase.prototype.unbind = function (material) {
            throw new Error(notSupported_1.default('unbind(material: Material)').message);
        };
        GeometryBase.prototype.draw = function () {
            throw new Error(notSupported_1.default('draw()').message);
        };
        GeometryBase.prototype.setUniforms = function (visitor) {
        };
        GeometryBase.prototype.hasPrincipalScale = function (name) {
            throw new Error(notImplemented_1.default("hasPrincipalScale(" + name + ")").message);
        };
        GeometryBase.prototype.getPrincipalScale = function (name) {
            throw new Error(notImplemented_1.default('getPrincipalScale').message);
        };
        GeometryBase.prototype.setPrincipalScale = function (name, value) {
            throw new Error(notImplemented_1.default('setPrincipalScale').message);
        };
        GeometryBase.prototype.getScale = function (i, j) {
            if (this.Kidentity) {
                var sMatrix = this.scaling;
                return sMatrix.getElement(i, j);
            }
            else {
                var sMatrix = this.scaling;
                var cMatrix = this.canonicalScale;
                cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
                return cMatrix.getElement(i, j);
            }
        };
        GeometryBase.prototype.getScaleX = function () {
            return this.getScale(0, 0);
        };
        GeometryBase.prototype.getScaleY = function () {
            return this.getScale(1, 1);
        };
        GeometryBase.prototype.getScaleZ = function () {
            return this.getScale(2, 2);
        };
        GeometryBase.prototype.setScale = function (x, y, z) {
            if (this.Kidentity) {
                var sMatrix = this.scaling;
                var oldX = sMatrix.getElement(0, 0);
                var oldY = sMatrix.getElement(1, 1);
                var oldZ = sMatrix.getElement(2, 2);
                if (x !== oldX) {
                    sMatrix.setElement(0, 0, x);
                    if (this._eventBus) {
                        this._eventBus.emit('change', 'scaling', sMatrix);
                    }
                }
                if (y !== oldY) {
                    sMatrix.setElement(1, 1, y);
                    if (this._eventBus) {
                        this._eventBus.emit('change', 'scaling', sMatrix);
                    }
                }
                if (z !== oldZ) {
                    sMatrix.setElement(2, 2, z);
                    if (this._eventBus) {
                        this._eventBus.emit('change', 'scaling', sMatrix);
                    }
                }
            }
            else {
                var sMatrix = this.scaling;
                var cMatrix = this.canonicalScale;
                cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
                var oldX = cMatrix.getElement(0, 0);
                var oldY = cMatrix.getElement(1, 1);
                var oldZ = cMatrix.getElement(2, 2);
                var matrixChanged = false;
                if (x !== oldX) {
                    cMatrix.setElement(0, 0, x);
                    matrixChanged = true;
                }
                if (y !== oldY) {
                    cMatrix.setElement(1, 1, y);
                    matrixChanged = true;
                }
                if (z !== oldZ) {
                    cMatrix.setElement(2, 2, z);
                    matrixChanged = true;
                }
                if (matrixChanged) {
                    sMatrix.copy(this.K).mul(cMatrix).mul(this.Kinv);
                    if (this._eventBus) {
                        this._eventBus.emit('change', 'scaling', sMatrix);
                    }
                }
            }
        };
        return GeometryBase;
    }(ShareableContextConsumer_1.ShareableContextConsumer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryBase;
});

define('davinci-eight/core/Usage',["require", "exports"], function (require, exports) {
    "use strict";
    (function (Usage) {
        Usage[Usage["STREAM_DRAW"] = 35040] = "STREAM_DRAW";
        Usage[Usage["STATIC_DRAW"] = 35044] = "STATIC_DRAW";
        Usage[Usage["DYNAMIC_DRAW"] = 35048] = "DYNAMIC_DRAW";
    })(exports.Usage || (exports.Usage = {}));
    var Usage = exports.Usage;
    function checkUsage(name, usage) {
        switch (usage) {
            case Usage.STREAM_DRAW:
            case Usage.STATIC_DRAW:
            case Usage.DYNAMIC_DRAW: {
                return;
            }
            default: {
                throw new Error(name + ": Usage must be one of the enumerated values.");
            }
        }
    }
    exports.checkUsage = checkUsage;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Usage;
});

define('davinci-eight/core/computeCount',["require", "exports", "../checks/mustBeInteger"], function (require, exports, mustBeInteger_1) {
    "use strict";
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

define('davinci-eight/core/computeAttributes',["require", "exports", "./computeCount"], function (require, exports, computeCount_1) {
    "use strict";
    function computeAttributes(attributes, aNames) {
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
    exports.default = computeAttributes;
});

define('davinci-eight/core/computePointers',["require", "exports"], function (require, exports) {
    "use strict";
    function computePointers(attributes, aNames) {
        var aNamesLen = aNames.length;
        var pointers = [];
        var offset = 0;
        for (var a = 0; a < aNamesLen; a++) {
            var aName = aNames[a];
            var attrib = attributes[aName];
            pointers.push({ name: aName, size: attrib.size, type: attrib.type, normalized: true, offset: offset });
            offset += attrib.size * 4;
        }
        return pointers;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = computePointers;
});

define('davinci-eight/core/computeStride',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/core/vertexArraysFromPrimitive',["require", "exports", "./computeAttributes", "./computePointers", "./computeStride"], function (require, exports, computeAttributes_1, computePointers_1, computeStride_1) {
    "use strict";
    function vertexArraysFromPrimitive(primitive, order) {
        if (primitive) {
            var keys = order ? order : Object.keys(primitive.attributes);
            var that = {
                mode: primitive.mode,
                indices: primitive.indices,
                attributes: computeAttributes_1.default(primitive.attributes, keys),
                stride: computeStride_1.default(primitive.attributes, keys),
                pointers: computePointers_1.default(primitive.attributes, keys)
            };
            return that;
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vertexArraysFromPrimitive;
});

define('davinci-eight/checks/mustBeUndefined',["require", "exports", "../checks/mustSatisfy", "../checks/isUndefined"], function (require, exports, mustSatisfy_1, isUndefined_1) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/VertexBuffer',["require", "exports", "../checks/mustBeUndefined", "./ShareableContextConsumer"], function (require, exports, mustBeUndefined_1, ShareableContextConsumer_1) {
    "use strict";
    var VertexBuffer = (function (_super) {
        __extends(VertexBuffer, _super);
        function VertexBuffer(contextManager, data, usage, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager) || this;
            _this.data = data;
            _this.usage = usage;
            _this.setLoggingName('VertexBuffer');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        VertexBuffer.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            mustBeUndefined_1.default(this.getLoggingName(), this.webGLBuffer);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        VertexBuffer.prototype.upload = function () {
            var gl = this.gl;
            if (gl) {
                if (this.webGLBuffer) {
                    if (this.data) {
                        gl.bufferData(gl.ARRAY_BUFFER, this.data, this.usage);
                    }
                }
            }
        };
        VertexBuffer.prototype.contextFree = function () {
            if (this.webGLBuffer) {
                var gl = this.gl;
                if (gl) {
                    gl.deleteBuffer(this.webGLBuffer);
                }
                else {
                    console.error(this.getLoggingName() + " must leak WebGLBuffer because WebGLRenderingContext is " + typeof gl);
                }
                this.webGLBuffer = void 0;
            }
            else {
            }
            _super.prototype.contextFree.call(this);
        };
        VertexBuffer.prototype.contextGain = function () {
            _super.prototype.contextGain.call(this);
            var gl = this.gl;
            if (!this.webGLBuffer) {
                this.webGLBuffer = gl.createBuffer();
                this.bind();
                this.upload();
                this.unbind();
            }
            else {
            }
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
        };
        VertexBuffer.prototype.unbind = function () {
            var gl = this.gl;
            if (gl) {
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
            }
        };
        return VertexBuffer;
    }(ShareableContextConsumer_1.ShareableContextConsumer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VertexBuffer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/GeometryArrays',["require", "exports", "./GeometryBase", "../checks/mustBeObject", "./Usage", "./vertexArraysFromPrimitive", "./VertexBuffer"], function (require, exports, GeometryBase_1, mustBeObject_1, Usage_1, vertexArraysFromPrimitive_1, VertexBuffer_1) {
    "use strict";
    var GeometryArrays = (function (_super) {
        __extends(GeometryArrays, _super);
        function GeometryArrays(contextManager, primitive, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, options.tilt, contextManager, levelUp + 1) || this;
            _this.first = 0;
            mustBeObject_1.default('contextManager', contextManager);
            mustBeObject_1.default('primitive', primitive);
            _this.setLoggingName('GeometryArrays');
            _this.attributes = {};
            var vertexArrays = vertexArraysFromPrimitive_1.default(primitive, options.order);
            _this._mode = vertexArrays.mode;
            _this.vbo = new VertexBuffer_1.default(contextManager, new Float32Array(vertexArrays.attributes), Usage_1.default.STATIC_DRAW);
            _this.count = vertexArrays.attributes.length / (vertexArrays.stride / 4);
            _this._stride = vertexArrays.stride;
            _this._pointers = vertexArrays.pointers;
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        GeometryArrays.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            this.vbo.release();
            this.vbo = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        GeometryArrays.prototype.bind = function (material) {
            this.vbo.bind();
            var pointers = this._pointers;
            if (pointers) {
                var iLength = pointers.length;
                for (var i = 0; i < iLength; i++) {
                    var pointer = pointers[i];
                    var attrib = material.getAttrib(pointer.name);
                    if (attrib) {
                        attrib.config(pointer.size, pointer.type, pointer.normalized, this._stride, pointer.offset);
                        attrib.enable();
                    }
                }
            }
            return this;
        };
        GeometryArrays.prototype.draw = function () {
            if (this.gl) {
                this.gl.drawArrays(this._mode, this.first, this.count);
            }
            return this;
        };
        GeometryArrays.prototype.unbind = function (material) {
            var pointers = this._pointers;
            if (pointers) {
                var iLength = pointers.length;
                for (var i = 0; i < iLength; i++) {
                    var pointer = pointers[i];
                    var attrib = material.getAttrib(pointer.name);
                    if (attrib) {
                        attrib.disable();
                    }
                }
            }
            this.vbo.unbind();
            return this;
        };
        return GeometryArrays;
    }(GeometryBase_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryArrays;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/IndexBuffer',["require", "exports", "../checks/mustBeUndefined", "./ShareableContextConsumer"], function (require, exports, mustBeUndefined_1, ShareableContextConsumer_1) {
    "use strict";
    var IndexBuffer = (function (_super) {
        __extends(IndexBuffer, _super);
        function IndexBuffer(contextManager, data, usage, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager) || this;
            _this.data = data;
            _this.usage = usage;
            _this.setLoggingName('IndexBuffer');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        IndexBuffer.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            mustBeUndefined_1.default(this.getLoggingName(), this.webGLBuffer);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        IndexBuffer.prototype.upload = function () {
            var gl = this.gl;
            if (gl) {
                if (this.webGLBuffer) {
                    if (this.data) {
                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.data, this.usage);
                    }
                }
            }
        };
        IndexBuffer.prototype.contextFree = function () {
            if (this.webGLBuffer) {
                var gl = this.gl;
                if (gl) {
                    gl.deleteBuffer(this.webGLBuffer);
                }
                else {
                    console.error(this.getLoggingName() + " must leak WebGLBuffer because WebGLRenderingContext is " + typeof gl);
                }
                this.webGLBuffer = void 0;
            }
            else {
            }
            _super.prototype.contextFree.call(this);
        };
        IndexBuffer.prototype.contextGain = function () {
            _super.prototype.contextGain.call(this);
            var gl = this.gl;
            if (!this.webGLBuffer) {
                this.webGLBuffer = gl.createBuffer();
                this.bind();
                this.upload();
                this.unbind();
            }
            else {
            }
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
        };
        IndexBuffer.prototype.unbind = function () {
            var gl = this.gl;
            if (gl) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            }
        };
        return IndexBuffer;
    }(ShareableContextConsumer_1.ShareableContextConsumer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = IndexBuffer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/GeometryElements',["require", "exports", "./DataType", "./GeometryBase", "./IndexBuffer", "../checks/isArray", "../checks/isNull", "../checks/isUndefined", "../checks/mustBeArray", "../checks/mustBeObject", "./vertexArraysFromPrimitive", "./VertexBuffer", "./Usage"], function (require, exports, DataType_1, GeometryBase_1, IndexBuffer_1, isArray_1, isNull_1, isUndefined_1, mustBeArray_1, mustBeObject_1, vertexArraysFromPrimitive_1, VertexBuffer_1, Usage_1) {
    "use strict";
    var GeometryElements = (function (_super) {
        __extends(GeometryElements, _super);
        function GeometryElements(contextManager, primitive, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, options.tilt, contextManager, levelUp + 1) || this;
            _this.offset = 0;
            mustBeObject_1.default('primitive', primitive);
            mustBeObject_1.default('contextManager', contextManager);
            _this.setLoggingName('GeometryElements');
            var vertexArrays = vertexArraysFromPrimitive_1.default(primitive, options.order);
            _this._mode = vertexArrays.mode;
            _this.count = vertexArrays.indices.length;
            _this.ibo = new IndexBuffer_1.default(contextManager, new Uint16Array(vertexArrays.indices), Usage_1.default.STATIC_DRAW);
            _this._attributes = vertexArrays.attributes;
            _this._stride = vertexArrays.stride;
            if (!isNull_1.default(vertexArrays.pointers) && !isUndefined_1.default(vertexArrays.pointers)) {
                if (isArray_1.default(vertexArrays.pointers)) {
                    _this._pointers = vertexArrays.pointers;
                }
                else {
                    mustBeArray_1.default('data.pointers', vertexArrays.pointers);
                }
            }
            else {
                _this._pointers = [];
            }
            _this.vbo = new VertexBuffer_1.default(contextManager, new Float32Array(vertexArrays.attributes), Usage_1.default.STATIC_DRAW);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        GeometryElements.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            this.ibo.release();
            this.ibo = void 0;
            this.vbo.release();
            this.vbo = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        GeometryElements.prototype.contextFree = function () {
            this.ibo.contextFree();
            this.vbo.contextFree();
            _super.prototype.contextFree.call(this);
        };
        GeometryElements.prototype.contextGain = function () {
            this.ibo.contextGain();
            this.vbo.contextGain();
            _super.prototype.contextGain.call(this);
        };
        GeometryElements.prototype.contextLost = function () {
            this.ibo.contextLost();
            this.vbo.contextLost();
            _super.prototype.contextLost.call(this);
        };
        GeometryElements.prototype.bind = function (material) {
            this.vbo.bind();
            var pointers = this._pointers;
            if (pointers) {
                var iLength = pointers.length;
                for (var i = 0; i < iLength; i++) {
                    var pointer = pointers[i];
                    var attrib = material.getAttrib(pointer.name);
                    if (attrib) {
                        attrib.config(pointer.size, pointer.type, pointer.normalized, this._stride, pointer.offset);
                        attrib.enable();
                    }
                }
            }
            this.ibo.bind();
            return this;
        };
        GeometryElements.prototype.unbind = function (material) {
            this.ibo.unbind();
            var pointers = this._pointers;
            if (pointers) {
                var iLength = pointers.length;
                for (var i = 0; i < iLength; i++) {
                    var pointer = pointers[i];
                    var attrib = material.getAttrib(pointer.name);
                    if (attrib) {
                        attrib.disable();
                    }
                }
            }
            this.vbo.unbind();
            return this;
        };
        GeometryElements.prototype.draw = function () {
            if (this.gl) {
                if (this.count) {
                    this.gl.drawElements(this._mode, this.count, DataType_1.default.UNSIGNED_SHORT, this.offset);
                }
            }
            return this;
        };
        return GeometryElements;
    }(GeometryBase_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryElements;
});

define('davinci-eight/core/PixelFormat',["require", "exports"], function (require, exports) {
    "use strict";
    (function (PixelFormat) {
        PixelFormat[PixelFormat["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
        PixelFormat[PixelFormat["ALPHA"] = 6406] = "ALPHA";
        PixelFormat[PixelFormat["RGB"] = 6407] = "RGB";
        PixelFormat[PixelFormat["RGBA"] = 6408] = "RGBA";
        PixelFormat[PixelFormat["LUMINANCE"] = 6409] = "LUMINANCE";
        PixelFormat[PixelFormat["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
    })(exports.PixelFormat || (exports.PixelFormat = {}));
    var PixelFormat = exports.PixelFormat;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PixelFormat;
});

define('davinci-eight/core/TextureParameterName',["require", "exports"], function (require, exports) {
    "use strict";
    (function (TextureParameterName) {
        TextureParameterName[TextureParameterName["TEXTURE_MAG_FILTER"] = 10240] = "TEXTURE_MAG_FILTER";
        TextureParameterName[TextureParameterName["TEXTURE_MIN_FILTER"] = 10241] = "TEXTURE_MIN_FILTER";
        TextureParameterName[TextureParameterName["TEXTURE_WRAP_S"] = 10242] = "TEXTURE_WRAP_S";
        TextureParameterName[TextureParameterName["TEXTURE_WRAP_T"] = 10243] = "TEXTURE_WRAP_T";
    })(exports.TextureParameterName || (exports.TextureParameterName = {}));
    var TextureParameterName = exports.TextureParameterName;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureParameterName;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Texture',["require", "exports", "../checks/mustBeUndefined", "./ShareableContextConsumer", "./TextureParameterName"], function (require, exports, mustBeUndefined_1, ShareableContextConsumer_1, TextureParameterName_1) {
    "use strict";
    var Texture = (function (_super) {
        __extends(Texture, _super);
        function Texture(target, contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager) || this;
            _this.setLoggingName('Texture');
            _this._target = target;
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Texture.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
            mustBeUndefined_1.default(this.getLoggingName(), this._texture);
        };
        Texture.prototype.contextFree = function () {
            if (this._texture) {
                this.gl.deleteTexture(this._texture);
                this._texture = void 0;
                _super.prototype.contextFree.call(this);
            }
        };
        Texture.prototype.contextGain = function () {
            if (!this._texture) {
                _super.prototype.contextGain.call(this);
                this._texture = this.contextManager.gl.createTexture();
            }
        };
        Texture.prototype.contextLost = function () {
            this._texture = void 0;
            _super.prototype.contextLost.call(this);
        };
        Texture.prototype.bind = function () {
            if (this.gl) {
                this.gl.bindTexture(this._target, this._texture);
            }
            else {
                console.warn(this.getLoggingName() + ".bind() missing WebGL rendering context.");
            }
        };
        Texture.prototype.unbind = function () {
            if (this.gl) {
                this.gl.bindTexture(this._target, null);
            }
            else {
                console.warn(this.getLoggingName() + ".unbind() missing WebGL rendering context.");
            }
        };
        Object.defineProperty(Texture.prototype, "minFilter", {
            get: function () {
                throw new Error('minFilter is write-only');
            },
            set: function (filter) {
                if (this.gl) {
                    this.bind();
                    this.gl.texParameteri(this._target, TextureParameterName_1.default.TEXTURE_MIN_FILTER, filter);
                    this.unbind();
                }
                else {
                    console.warn(this.getLoggingName() + ".minFilter missing WebGL rendering context.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "magFilter", {
            get: function () {
                throw new Error('magFilter is write-only');
            },
            set: function (filter) {
                if (this.gl) {
                    this.bind();
                    this.gl.texParameteri(this._target, TextureParameterName_1.default.TEXTURE_MAG_FILTER, filter);
                    this.unbind();
                }
                else {
                    console.warn(this.getLoggingName() + ".magFilter missing WebGL rendering context.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "wrapS", {
            get: function () {
                throw new Error('wrapS is write-only');
            },
            set: function (mode) {
                if (this.gl) {
                    this.bind();
                    this.gl.texParameteri(this._target, TextureParameterName_1.default.TEXTURE_WRAP_S, mode);
                    this.unbind();
                }
                else {
                    console.warn(this.getLoggingName() + ".wrapS missing WebGL rendering context.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "wrapT", {
            get: function () {
                throw new Error('wrapT is write-only');
            },
            set: function (mode) {
                if (this.gl) {
                    this.bind();
                    this.gl.texParameteri(this._target, TextureParameterName_1.default.TEXTURE_WRAP_T, mode);
                    this.unbind();
                }
                else {
                    console.warn(this.getLoggingName() + ".wrapT missing WebGL rendering context.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.upload = function () {
            throw new Error(this.getLoggingName() + ".upload() must be implemented.");
        };
        return Texture;
    }(ShareableContextConsumer_1.ShareableContextConsumer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Texture;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/ImageTexture',["require", "exports", "./DataType", "./PixelFormat", "./Texture"], function (require, exports, DataType_1, PixelFormat_1, Texture_1) {
    "use strict";
    var ImageTexture = (function (_super) {
        __extends(ImageTexture, _super);
        function ImageTexture(image, target, contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, target, contextManager, levelUp + 1) || this;
            _this.image = image;
            _this.setLoggingName('ImageTexture');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        ImageTexture.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(ImageTexture.prototype, "naturalHeight", {
            get: function () {
                if (this.image) {
                    return this.image.naturalHeight;
                }
                else {
                    return void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageTexture.prototype, "naturalWidth", {
            get: function () {
                if (this.image) {
                    return this.image.naturalWidth;
                }
                else {
                    return void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        ImageTexture.prototype.upload = function () {
            if (this.gl) {
                this.gl.texImage2D(this._target, 0, PixelFormat_1.default.RGBA, PixelFormat_1.default.RGBA, DataType_1.default.UNSIGNED_BYTE, this.image);
            }
            else {
                console.warn(this.getLoggingName() + ".upload() missing WebGL rendering context.");
            }
        };
        return ImageTexture;
    }(Texture_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ImageTexture;
});

define('davinci-eight/facets/ColorFacet',["require", "exports", "../core/Color", "../checks/mustBeNumber", "../core/GraphicsProgramSymbols"], function (require, exports, Color_1, mustBeNumber_1, GraphicsProgramSymbols_1) {
    "use strict";
    var ColorFacet = (function () {
        function ColorFacet(uColorName) {
            if (uColorName === void 0) { uColorName = GraphicsProgramSymbols_1.default.UNIFORM_COLOR; }
            this.uColorName = uColorName;
            this.color = Color_1.Color.fromRGB(1, 1, 1);
        }
        Object.defineProperty(ColorFacet.prototype, "r", {
            get: function () {
                return this.color.r;
            },
            set: function (r) {
                mustBeNumber_1.default('r', r);
                this.color.r = r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "g", {
            get: function () {
                return this.color.g;
            },
            set: function (g) {
                mustBeNumber_1.default('g', g);
                this.color.g = g;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "b", {
            get: function () {
                return this.color.b;
            },
            set: function (b) {
                mustBeNumber_1.default('b', b);
                this.color.b = b;
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
        ColorFacet.prototype.setRGB = function (r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
            return this;
        };
        ColorFacet.prototype.setUniforms = function (visitor) {
            var name = this.uColorName;
            if (name) {
                var color = this.color;
                visitor.uniform3f(name, color.r, color.g, color.b);
            }
        };
        return ColorFacet;
    }());
    exports.ColorFacet = ColorFacet;
    ColorFacet.PROP_RGB = 'rgb';
    ColorFacet.PROP_RED = 'r';
    ColorFacet.PROP_GREEN = 'g';
    ColorFacet.PROP_BLUE = 'b';
});

define('davinci-eight/facets/ModelE3',["require", "exports", "../math/Geometric3"], function (require, exports, Geometric3_1) {
    "use strict";
    var ModelE3 = (function () {
        function ModelE3() {
            this._position = Geometric3_1.Geometric3.zero();
            this._attitude = Geometric3_1.Geometric3.one();
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
        return ModelE3;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ModelE3;
    ModelE3.PROP_ATTITUDE = 'R';
    ModelE3.PROP_POSITION = 'X';
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/ModelFacet',["require", "exports", "../math/Matrix3", "../math/Matrix4", "./ModelE3", "../checks/mustBeObject", "../i18n/readOnly", "../core/GraphicsProgramSymbols"], function (require, exports, Matrix3_1, Matrix4_1, ModelE3_1, mustBeObject_1, readOnly_1, GraphicsProgramSymbols_1) {
    "use strict";
    var ModelFacet = (function (_super) {
        __extends(ModelFacet, _super);
        function ModelFacet() {
            var _this = _super.call(this) || this;
            _this.matS = Matrix4_1.default.one();
            _this._matM = Matrix4_1.default.one();
            _this._matN = Matrix3_1.default.one();
            _this.matR = Matrix4_1.default.one();
            _this.matT = Matrix4_1.default.one();
            _this.X.modified = true;
            _this.R.modified = true;
            _this.matS.modified = true;
            return _this;
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
            visitor.matrix4fv(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, this._matM.elements, false);
            visitor.matrix3fv(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, this._matN.elements, false);
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
        return ModelFacet;
    }(ModelE3_1.default));
    exports.ModelFacet = ModelFacet;
});

define('davinci-eight/core/TextureUnit',["require", "exports"], function (require, exports) {
    "use strict";
    (function (TextureUnit) {
        TextureUnit[TextureUnit["TEXTURE0"] = 33984] = "TEXTURE0";
        TextureUnit[TextureUnit["TEXTURE1"] = 33985] = "TEXTURE1";
        TextureUnit[TextureUnit["TEXTURE2"] = 33986] = "TEXTURE2";
        TextureUnit[TextureUnit["TEXTURE3"] = 33987] = "TEXTURE3";
        TextureUnit[TextureUnit["TEXTURE4"] = 33988] = "TEXTURE4";
        TextureUnit[TextureUnit["TEXTURE5"] = 33989] = "TEXTURE5";
        TextureUnit[TextureUnit["TEXTURE6"] = 33990] = "TEXTURE6";
        TextureUnit[TextureUnit["TEXTURE7"] = 33991] = "TEXTURE7";
        TextureUnit[TextureUnit["TEXTURE8"] = 33992] = "TEXTURE8";
        TextureUnit[TextureUnit["TEXTURE9"] = 33993] = "TEXTURE9";
        TextureUnit[TextureUnit["TEXTURE10"] = 33994] = "TEXTURE10";
        TextureUnit[TextureUnit["TEXTURE11"] = 33995] = "TEXTURE11";
        TextureUnit[TextureUnit["TEXTURE12"] = 33996] = "TEXTURE12";
        TextureUnit[TextureUnit["TEXTURE13"] = 33997] = "TEXTURE13";
        TextureUnit[TextureUnit["TEXTURE14"] = 33998] = "TEXTURE14";
        TextureUnit[TextureUnit["TEXTURE15"] = 33999] = "TEXTURE15";
        TextureUnit[TextureUnit["TEXTURE16"] = 34000] = "TEXTURE16";
        TextureUnit[TextureUnit["TEXTURE17"] = 34001] = "TEXTURE17";
        TextureUnit[TextureUnit["TEXTURE18"] = 34002] = "TEXTURE18";
        TextureUnit[TextureUnit["TEXTURE19"] = 34003] = "TEXTURE19";
        TextureUnit[TextureUnit["TEXTURE20"] = 34004] = "TEXTURE20";
        TextureUnit[TextureUnit["TEXTURE21"] = 34005] = "TEXTURE21";
        TextureUnit[TextureUnit["TEXTURE22"] = 34006] = "TEXTURE22";
        TextureUnit[TextureUnit["TEXTURE23"] = 34007] = "TEXTURE23";
        TextureUnit[TextureUnit["TEXTURE24"] = 34008] = "TEXTURE24";
        TextureUnit[TextureUnit["TEXTURE25"] = 34009] = "TEXTURE25";
        TextureUnit[TextureUnit["TEXTURE26"] = 34010] = "TEXTURE26";
        TextureUnit[TextureUnit["TEXTURE27"] = 34011] = "TEXTURE27";
        TextureUnit[TextureUnit["TEXTURE28"] = 34012] = "TEXTURE28";
        TextureUnit[TextureUnit["TEXTURE29"] = 34013] = "TEXTURE29";
        TextureUnit[TextureUnit["TEXTURE30"] = 34014] = "TEXTURE30";
        TextureUnit[TextureUnit["TEXTURE31"] = 34015] = "TEXTURE31";
        TextureUnit[TextureUnit["ACTIVE_TEXTURE"] = 34016] = "ACTIVE_TEXTURE";
    })(exports.TextureUnit || (exports.TextureUnit = {}));
    var TextureUnit = exports.TextureUnit;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureUnit;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/TextureFacet',["require", "exports", "../base/exchange", "../core/GraphicsProgramSymbols", "../core/ShareableBase", "../core/TextureUnit"], function (require, exports, exchange_1, GraphicsProgramSymbols_1, ShareableBase_1, TextureUnit_1) {
    "use strict";
    var TextureFacet = (function (_super) {
        __extends(TextureFacet, _super);
        function TextureFacet() {
            var _this = _super.call(this) || this;
            _this.unit = TextureUnit_1.default.TEXTURE0;
            _this.setLoggingName('TextureFacet');
            return _this;
        }
        TextureFacet.prototype.destructor = function (levelUp) {
            this._texture = exchange_1.default(this._texture, void 0);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(TextureFacet.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            set: function (value) {
                this._texture = exchange_1.default(this._texture, value);
            },
            enumerable: true,
            configurable: true
        });
        TextureFacet.prototype.setUniforms = function (visitor) {
            if (this._texture) {
                visitor.activeTexture(this.unit);
                this._texture.bind();
                visitor.uniform1i(GraphicsProgramSymbols_1.default.UNIFORM_IMAGE, 0);
            }
        };
        return TextureFacet;
    }(ShareableBase_1.ShareableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureFacet;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Mesh',["require", "exports", "../facets/ColorFacet", "./Drawable", "../facets/ModelFacet", "../checks/mustBeObject", "../i18n/notSupported", "../facets/TextureFacet"], function (require, exports, ColorFacet_1, Drawable_1, ModelFacet_1, mustBeObject_1, notSupported_1, TextureFacet_1) {
    "use strict";
    var COLOR_FACET_NAME = 'color';
    var TEXTURE_FACET_NAME = 'image';
    var MODEL_FACET_NAME = 'model';
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material, contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, geometry, material, mustBeObject_1.default('contextManager', contextManager), levelUp + 1) || this;
            _this.setLoggingName('Mesh');
            _this.setFacet(COLOR_FACET_NAME, new ColorFacet_1.ColorFacet());
            var textureFacet = new TextureFacet_1.default();
            _this.setFacet(TEXTURE_FACET_NAME, textureFacet);
            textureFacet.release();
            _this.setFacet(MODEL_FACET_NAME, new ModelFacet_1.ModelFacet());
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Mesh.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Mesh.prototype, "attitude", {
            get: function () {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    return facet.R;
                }
                else {
                    throw new Error(notSupported_1.default(MODEL_FACET_NAME).message);
                }
            },
            set: function (spinor) {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    facet.R.copySpinor(spinor);
                }
                else {
                    throw new Error(notSupported_1.default(MODEL_FACET_NAME).message);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "R", {
            get: function () {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    return facet.R;
                }
                else {
                    throw new Error(notSupported_1.default(MODEL_FACET_NAME).message);
                }
            },
            set: function (spinor) {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    facet.R.copySpinor(spinor);
                }
                else {
                    throw new Error(notSupported_1.default(MODEL_FACET_NAME).message);
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
                    throw new Error(notSupported_1.default(COLOR_FACET_NAME).message);
                }
            },
            set: function (color) {
                var facet = this.getFacet(COLOR_FACET_NAME);
                if (facet) {
                    facet.color.copy(color);
                }
                else {
                    throw new Error(notSupported_1.default(COLOR_FACET_NAME).message);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "texture", {
            get: function () {
                var facet = this.getFacet(TEXTURE_FACET_NAME);
                if (facet) {
                    var texture = facet.texture;
                    facet.release();
                    return texture;
                }
                else {
                    throw new Error(notSupported_1.default(TEXTURE_FACET_NAME).message);
                }
            },
            set: function (value) {
                var facet = this.getFacet(TEXTURE_FACET_NAME);
                if (facet) {
                    facet.texture = value;
                    facet.release();
                }
                else {
                    throw new Error(notSupported_1.default(TEXTURE_FACET_NAME).message);
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
                    throw new Error(notSupported_1.default(MODEL_FACET_NAME).message);
                }
            },
            set: function (vector) {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    facet.X.copyVector(vector);
                }
                else {
                    throw new Error(notSupported_1.default(MODEL_FACET_NAME).message);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "position", {
            get: function () {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    return facet.X;
                }
                else {
                    throw new Error(notSupported_1.default(MODEL_FACET_NAME).message);
                }
            },
            set: function (vector) {
                var facet = this.getFacet(MODEL_FACET_NAME);
                if (facet) {
                    facet.X.copyVector(vector);
                }
                else {
                    throw new Error(notSupported_1.default(MODEL_FACET_NAME).message);
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
        return Mesh;
    }(Drawable_1.Drawable));
    exports.Mesh = Mesh;
});

define('davinci-eight/core/PixelType',["require", "exports"], function (require, exports) {
    "use strict";
    (function (PixelType) {
        PixelType[PixelType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        PixelType[PixelType["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
        PixelType[PixelType["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
        PixelType[PixelType["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
    })(exports.PixelType || (exports.PixelType = {}));
    var PixelType = exports.PixelType;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PixelType;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/ShareableArray',["require", "exports", "../i18n/readOnly", "../core/ShareableBase"], function (require, exports, readOnly_1, ShareableBase_1) {
    "use strict";
    function transferOwnership(data) {
        if (data) {
            var result = new ShareableArray(data);
            for (var i = 0, iLength = data.length; i < iLength; i++) {
                var element = data[i];
                if (element && element.release) {
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
            var _this = _super.call(this) || this;
            _this.setLoggingName('ShareableArray');
            _this._elements = elements;
            for (var i = 0, l = _this._elements.length; i < l; i++) {
                var element = _this._elements[i];
                if (element.addRef) {
                    element.addRef();
                }
            }
            return _this;
        }
        ShareableArray.prototype.destructor = function (levelUp) {
            for (var i = 0, l = this._elements.length; i < l; i++) {
                var element = this._elements[i];
                if (element.release) {
                    element.release();
                }
            }
            this._elements = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
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
                    if (candidate.addRef) {
                        candidate.addRef();
                    }
                    return candidate;
                }
            }
            return void 0;
        };
        ShareableArray.prototype.get = function (index) {
            var element = this.getWeakRef(index);
            if (element) {
                if (element.addRef) {
                    element.addRef();
                }
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
                if (element.addRef) {
                    element.addRef();
                }
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
            if (element.addRef) {
                element.addRef();
            }
            return this.unshiftWeakRef(element);
        };
        ShareableArray.prototype.unshiftWeakRef = function (element) {
            return this._elements.unshift(element);
        };
        return ShareableArray;
    }(ShareableBase_1.ShareableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShareableArray;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Scene',["require", "exports", "../checks/mustBeNonNullObject", "../collections/ShareableArray", "../core/ShareableContextConsumer"], function (require, exports, mustBeNonNullObject_1, ShareableArray_1, ShareableContextConsumer_1) {
    "use strict";
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager) || this;
            _this.setLoggingName('Scene');
            mustBeNonNullObject_1.default('contextManager', contextManager);
            _this._drawables = new ShareableArray_1.default([]);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Scene.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            this._drawables.release();
            this._drawables = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Scene.prototype.add = function (drawable) {
            mustBeNonNullObject_1.default('drawable', drawable);
            this._drawables.push(drawable);
        };
        Scene.prototype.contains = function (drawable) {
            mustBeNonNullObject_1.default('drawable', drawable);
            return this._drawables.indexOf(drawable) >= 0;
        };
        Scene.prototype.draw = function (ambients) {
            console.warn("Scene.draw is deprecated. Please use the Scene.render method instead.");
            this.render(ambients);
        };
        Scene.prototype.render = function (ambients) {
            var gl = this.gl;
            if (gl) {
                var ds = this._drawables;
                var iLen = ds.length;
                var passOne = false;
                var passTwo = false;
                for (var i = 0; i < iLen; i++) {
                    var d = ds.getWeakRef(i);
                    if (d.transparent) {
                        passTwo = true;
                    }
                    else {
                        passOne = true;
                    }
                }
                if (passOne || passTwo) {
                    if (passTwo) {
                        var previousMask = gl.getParameter(gl.DEPTH_WRITEMASK);
                        if (passOne) {
                            gl.depthMask(true);
                            for (var i = 0; i < iLen; i++) {
                                var d = ds.getWeakRef(i);
                                if (!d.transparent) {
                                    d.render(ambients);
                                }
                            }
                        }
                        gl.depthMask(false);
                        for (var i = 0; i < iLen; i++) {
                            var d = ds.getWeakRef(i);
                            if (d.transparent) {
                                d.render(ambients);
                            }
                        }
                        gl.depthMask(previousMask);
                    }
                    else {
                        for (var i = 0; i < iLen; i++) {
                            var d = ds.getWeakRef(i);
                            if (!d.transparent) {
                                d.render(ambients);
                            }
                        }
                    }
                }
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
            mustBeNonNullObject_1.default('drawable', drawable);
            var index = this._drawables.indexOf(drawable);
            if (index >= 0) {
                this._drawables.splice(index, 1).release();
            }
        };
        Scene.prototype.contextFree = function () {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                if (drawable.contextFree) {
                    drawable.contextFree();
                }
            }
            _super.prototype.contextFree.call(this);
        };
        Scene.prototype.contextGain = function () {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                if (drawable.contextGain) {
                    drawable.contextGain();
                }
            }
            _super.prototype.contextGain.call(this);
        };
        Scene.prototype.contextLost = function () {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                if (drawable.contextLost) {
                    drawable.contextLost();
                }
            }
            _super.prototype.contextLost.call(this);
        };
        return Scene;
    }(ShareableContextConsumer_1.ShareableContextConsumer));
    exports.Scene = Scene;
});

define('davinci-eight/core/makeWebGLShader',["require", "exports"], function (require, exports) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Shader',["require", "exports", "./makeWebGLShader", "../checks/mustBeNumber", "../checks/mustBeString", "../checks/mustBeUndefined", "./ShareableContextConsumer"], function (require, exports, makeWebGLShader_1, mustBeNumber_1, mustBeString_1, mustBeUndefined_1, ShareableContextConsumer_1) {
    "use strict";
    var Shader = (function (_super) {
        __extends(Shader, _super);
        function Shader(source, type, engine) {
            var _this = _super.call(this, engine) || this;
            _this.setLoggingName('Shader');
            _this._source = mustBeString_1.default('source', source);
            _this._shaderType = mustBeNumber_1.default('type', type);
            return _this;
        }
        Shader.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
            mustBeUndefined_1.default(this.getLoggingName(), this._shader);
        };
        Shader.prototype.contextFree = function () {
            if (this._shader) {
                this.contextManager.gl.deleteShader(this._shader);
                this._shader = void 0;
            }
            _super.prototype.contextFree.call(this);
        };
        Shader.prototype.contextGain = function () {
            this._shader = makeWebGLShader_1.default(this.contextManager.gl, this._source, this._shaderType);
            _super.prototype.contextGain.call(this);
        };
        Shader.prototype.contextLost = function () {
            this._shader = void 0;
            _super.prototype.contextLost.call(this);
        };
        return Shader;
    }(ShareableContextConsumer_1.ShareableContextConsumer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Shader;
});

define('davinci-eight/core/TextureMagFilter',["require", "exports"], function (require, exports) {
    "use strict";
    (function (TextureMagFilter) {
        TextureMagFilter[TextureMagFilter["NEAREST"] = 9728] = "NEAREST";
        TextureMagFilter[TextureMagFilter["LINEAR"] = 9729] = "LINEAR";
    })(exports.TextureMagFilter || (exports.TextureMagFilter = {}));
    var TextureMagFilter = exports.TextureMagFilter;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureMagFilter;
});

define('davinci-eight/core/TextureMinFilter',["require", "exports"], function (require, exports) {
    "use strict";
    (function (TextureMinFilter) {
        TextureMinFilter[TextureMinFilter["NEAREST"] = 9728] = "NEAREST";
        TextureMinFilter[TextureMinFilter["LINEAR"] = 9729] = "LINEAR";
        TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
        TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
        TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
        TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
    })(exports.TextureMinFilter || (exports.TextureMinFilter = {}));
    var TextureMinFilter = exports.TextureMinFilter;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureMinFilter;
});

define('davinci-eight/core/TextureTarget',["require", "exports"], function (require, exports) {
    "use strict";
    (function (TextureTarget) {
        TextureTarget[TextureTarget["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
        TextureTarget[TextureTarget["TEXTURE"] = 5890] = "TEXTURE";
    })(exports.TextureTarget || (exports.TextureTarget = {}));
    var TextureTarget = exports.TextureTarget;
    function checkTextureTarget(name, target) {
        switch (target) {
            case TextureTarget.TEXTURE_2D:
            case TextureTarget.TEXTURE: {
                return;
            }
            default: {
                throw new Error(name + ": target must be one of the enumerated values.");
            }
        }
    }
    exports.checkTextureTarget = checkTextureTarget;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureTarget;
});

define('davinci-eight/core/TextureWrapMode',["require", "exports"], function (require, exports) {
    "use strict";
    (function (TextureWrapMode) {
        TextureWrapMode[TextureWrapMode["REPEAT"] = 10497] = "REPEAT";
        TextureWrapMode[TextureWrapMode["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
        TextureWrapMode[TextureWrapMode["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
    })(exports.TextureWrapMode || (exports.TextureWrapMode = {}));
    var TextureWrapMode = exports.TextureWrapMode;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureWrapMode;
});

define('davinci-eight/core/Uniform',["require", "exports", "../checks/isNull", "../checks/mustBeObject"], function (require, exports, isNull_1, mustBeObject_1) {
    "use strict";
    var Uniform = (function () {
        function Uniform(info) {
            if (!isNull_1.default(info)) {
                mustBeObject_1.default('info', info);
                this.name = info.name;
            }
        }
        Uniform.prototype.contextFree = function () {
            this.contextLost();
        };
        Uniform.prototype.contextGain = function (gl, program) {
            this.contextLost();
            this.gl = gl;
            if (!isNull_1.default(this.name)) {
                this.location = gl.getUniformLocation(program, this.name);
            }
            else {
                this.location = null;
            }
        };
        Uniform.prototype.contextLost = function () {
            this.gl = void 0;
            this.location = void 0;
        };
        Uniform.prototype.uniform1f = function (x) {
            var gl = this.gl;
            if (gl) {
                gl.uniform1f(this.location, x);
            }
        };
        Uniform.prototype.uniform1i = function (x) {
            var gl = this.gl;
            if (gl) {
                gl.uniform1i(this.location, x);
            }
        };
        Uniform.prototype.uniform2f = function (x, y) {
            var gl = this.gl;
            if (gl) {
                gl.uniform2f(this.location, x, y);
            }
        };
        Uniform.prototype.uniform2i = function (x, y) {
            var gl = this.gl;
            if (gl) {
                gl.uniform2i(this.location, x, y);
            }
        };
        Uniform.prototype.uniform3f = function (x, y, z) {
            var gl = this.gl;
            if (gl) {
                gl.uniform3f(this.location, x, y, z);
            }
        };
        Uniform.prototype.uniform3i = function (x, y, z) {
            var gl = this.gl;
            if (gl) {
                gl.uniform3i(this.location, x, y, z);
            }
        };
        Uniform.prototype.uniform4f = function (x, y, z, w) {
            var gl = this.gl;
            if (gl) {
                gl.uniform4f(this.location, x, y, z, w);
            }
        };
        Uniform.prototype.uniform4i = function (x, y, z, w) {
            var gl = this.gl;
            if (gl) {
                gl.uniform4i(this.location, x, y, z, w);
            }
        };
        Uniform.prototype.matrix2fv = function (transpose, value) {
            var gl = this.gl;
            if (gl) {
                gl.uniformMatrix2fv(this.location, transpose, value);
            }
        };
        Uniform.prototype.matrix3fv = function (transpose, value) {
            var gl = this.gl;
            if (gl) {
                gl.uniformMatrix3fv(this.location, transpose, value);
            }
        };
        Uniform.prototype.matrix4fv = function (transpose, value) {
            var gl = this.gl;
            if (gl) {
                gl.uniformMatrix4fv(this.location, transpose, value);
            }
        };
        Uniform.prototype.uniform1fv = function (data) {
            var gl = this.gl;
            if (gl) {
                gl.uniform1fv(this.location, data);
            }
        };
        Uniform.prototype.uniform2fv = function (data) {
            var gl = this.gl;
            if (gl) {
                gl.uniform2fv(this.location, data);
            }
        };
        Uniform.prototype.uniform3fv = function (data) {
            var gl = this.gl;
            if (gl) {
                gl.uniform3fv(this.location, data);
            }
        };
        Uniform.prototype.uniform4fv = function (data) {
            var gl = this.gl;
            if (gl) {
                gl.uniform4fv(this.location, data);
            }
        };
        Uniform.prototype.toString = function () {
            return ['uniform', this.name].join(' ');
        };
        return Uniform;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Uniform;
});

define('davinci-eight/core/checkEnums',["require", "exports", "./BeginMode", "./BlendingFactorDest", "./BlendingFactorSrc", "./Capability", "./ClearBufferMask", "./DepthFunction", "./PixelFormat", "./PixelType", "./Usage", "../checks/mustBeEQ"], function (require, exports, BeginMode_1, BlendingFactorDest_1, BlendingFactorSrc_1, Capability_1, ClearBufferMask_1, DepthFunction_1, PixelFormat_1, PixelType_1, Usage_1, mustBeEQ_1) {
    "use strict";
    function checkEnums(gl) {
        mustBeEQ_1.default('LINE_LOOP', BeginMode_1.default.LINE_LOOP, gl.LINE_LOOP);
        mustBeEQ_1.default('LINE_STRIP', BeginMode_1.default.LINE_STRIP, gl.LINE_STRIP);
        mustBeEQ_1.default('LINES', BeginMode_1.default.LINES, gl.LINES);
        mustBeEQ_1.default('POINTS', BeginMode_1.default.POINTS, gl.POINTS);
        mustBeEQ_1.default('TRIANGLE_FAN', BeginMode_1.default.TRIANGLE_FAN, gl.TRIANGLE_FAN);
        mustBeEQ_1.default('TRIANGLE_STRIP', BeginMode_1.default.TRIANGLE_STRIP, gl.TRIANGLE_STRIP);
        mustBeEQ_1.default('TRIANGLES', BeginMode_1.default.TRIANGLES, gl.TRIANGLES);
        mustBeEQ_1.default('ZERO', BlendingFactorDest_1.default.ZERO, gl.ZERO);
        mustBeEQ_1.default('ONE', BlendingFactorDest_1.default.ONE, gl.ONE);
        mustBeEQ_1.default('SRC_COLOR', BlendingFactorDest_1.default.SRC_COLOR, gl.SRC_COLOR);
        mustBeEQ_1.default('ONE_MINUS_SRC_COLOR', BlendingFactorDest_1.default.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_COLOR);
        mustBeEQ_1.default('SRC_ALPHA', BlendingFactorDest_1.default.SRC_ALPHA, gl.SRC_ALPHA);
        mustBeEQ_1.default('ONE_MINUS_SRC_ALPHA', BlendingFactorDest_1.default.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        mustBeEQ_1.default('DST_ALPHA', BlendingFactorDest_1.default.DST_ALPHA, gl.DST_ALPHA);
        mustBeEQ_1.default('ONE_MINUS_DST_ALPHA', BlendingFactorDest_1.default.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
        mustBeEQ_1.default('ZERO', BlendingFactorSrc_1.default.ZERO, gl.ZERO);
        mustBeEQ_1.default('ONE', BlendingFactorSrc_1.default.ONE, gl.ONE);
        mustBeEQ_1.default('DST_COLOR', BlendingFactorSrc_1.default.DST_COLOR, gl.DST_COLOR);
        mustBeEQ_1.default('ONE_MINUS_DST_COLOR', BlendingFactorSrc_1.default.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_DST_COLOR);
        mustBeEQ_1.default('SRC_ALPHA_SATURATE', BlendingFactorSrc_1.default.SRC_ALPHA_SATURATE, gl.SRC_ALPHA_SATURATE);
        mustBeEQ_1.default('SRC_ALPHA', BlendingFactorSrc_1.default.SRC_ALPHA, gl.SRC_ALPHA);
        mustBeEQ_1.default('ONE_MINUS_SRC_ALPHA', BlendingFactorSrc_1.default.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        mustBeEQ_1.default('DST_ALPHA', BlendingFactorSrc_1.default.DST_ALPHA, gl.DST_ALPHA);
        mustBeEQ_1.default('ONE_MINUS_DST_ALPHA', BlendingFactorSrc_1.default.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
        mustBeEQ_1.default('CULL_FACE', Capability_1.default.CULL_FACE, gl.CULL_FACE);
        mustBeEQ_1.default('BLEND', Capability_1.default.BLEND, gl.BLEND);
        mustBeEQ_1.default('DITHER', Capability_1.default.DITHER, gl.DITHER);
        mustBeEQ_1.default('STENCIL_TEST', Capability_1.default.STENCIL_TEST, gl.STENCIL_TEST);
        mustBeEQ_1.default('DEPTH_TEST', Capability_1.default.DEPTH_TEST, gl.DEPTH_TEST);
        mustBeEQ_1.default('SCISSOR_TEST', Capability_1.default.SCISSOR_TEST, gl.SCISSOR_TEST);
        mustBeEQ_1.default('POLYGON_OFFSET_FILL', Capability_1.default.POLYGON_OFFSET_FILL, gl.POLYGON_OFFSET_FILL);
        mustBeEQ_1.default('SAMPLE_ALPHA_TO_COVERAGE', Capability_1.default.SAMPLE_ALPHA_TO_COVERAGE, gl.SAMPLE_ALPHA_TO_COVERAGE);
        mustBeEQ_1.default('SAMPLE_COVERAGE', Capability_1.default.SAMPLE_COVERAGE, gl.SAMPLE_COVERAGE);
        mustBeEQ_1.default('COLOR_BUFFER_BIT', ClearBufferMask_1.default.COLOR_BUFFER_BIT, gl.COLOR_BUFFER_BIT);
        mustBeEQ_1.default('DEPTH_BUFFER_BIT', ClearBufferMask_1.default.DEPTH_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
        mustBeEQ_1.default('STENCIL_BUFFER_BIT', ClearBufferMask_1.default.STENCIL_BUFFER_BIT, gl.STENCIL_BUFFER_BIT);
        mustBeEQ_1.default('ALWAYS', DepthFunction_1.default.ALWAYS, gl.ALWAYS);
        mustBeEQ_1.default('EQUAL', DepthFunction_1.default.EQUAL, gl.EQUAL);
        mustBeEQ_1.default('GEQUAL', DepthFunction_1.default.GEQUAL, gl.GEQUAL);
        mustBeEQ_1.default('GREATER', DepthFunction_1.default.GREATER, gl.GREATER);
        mustBeEQ_1.default('LEQUAL', DepthFunction_1.default.LEQUAL, gl.LEQUAL);
        mustBeEQ_1.default('LESS', DepthFunction_1.default.LESS, gl.LESS);
        mustBeEQ_1.default('NEVER', DepthFunction_1.default.NEVER, gl.NEVER);
        mustBeEQ_1.default('NOTEQUAL', DepthFunction_1.default.NOTEQUAL, gl.NOTEQUAL);
        mustBeEQ_1.default('DEPTH_COMPONENT', PixelFormat_1.default.DEPTH_COMPONENT, gl.DEPTH_COMPONENT);
        mustBeEQ_1.default('ALPHA', PixelFormat_1.default.ALPHA, gl.ALPHA);
        mustBeEQ_1.default('RGB', PixelFormat_1.default.RGB, gl.RGB);
        mustBeEQ_1.default('RGBA', PixelFormat_1.default.RGBA, gl.RGBA);
        mustBeEQ_1.default('LUMINANCE', PixelFormat_1.default.LUMINANCE, gl.LUMINANCE);
        mustBeEQ_1.default('LUMINANCE_ALPHA', PixelFormat_1.default.LUMINANCE_ALPHA, gl.LUMINANCE_ALPHA);
        mustBeEQ_1.default('UNSIGNED_BYTE', PixelType_1.default.UNSIGNED_BYTE, gl.UNSIGNED_BYTE);
        mustBeEQ_1.default('UNSIGNED_SHORT_4_4_4_4', PixelType_1.default.UNSIGNED_SHORT_4_4_4_4, gl.UNSIGNED_SHORT_4_4_4_4);
        mustBeEQ_1.default('UNSIGNED_SHORT_5_5_5_1', PixelType_1.default.UNSIGNED_SHORT_5_5_5_1, gl.UNSIGNED_SHORT_5_5_5_1);
        mustBeEQ_1.default('UNSIGNED_SHORT_5_6_5', PixelType_1.default.UNSIGNED_SHORT_5_6_5, gl.UNSIGNED_SHORT_5_6_5);
        mustBeEQ_1.default('STREAM_DRAW', Usage_1.default.STREAM_DRAW, gl.STREAM_DRAW);
        mustBeEQ_1.default('STATIC_DRAW', Usage_1.default.STATIC_DRAW, gl.STATIC_DRAW);
        mustBeEQ_1.default('DYNAMIC_DRAW', Usage_1.default.DYNAMIC_DRAW, gl.DYNAMIC_DRAW);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = checkEnums;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/EIGHTLogger',["require", "exports", "../config", "../core/ShareableBase"], function (require, exports, config_1, ShareableBase_1) {
    "use strict";
    var EIGHTLogger = (function (_super) {
        __extends(EIGHTLogger, _super);
        function EIGHTLogger(contextManager) {
            var _this = _super.call(this) || this;
            _this.contextManager = contextManager;
            _this.setLoggingName('EIGHTLogger');
            return _this;
        }
        EIGHTLogger.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        EIGHTLogger.prototype.contextFree = function () {
        };
        EIGHTLogger.prototype.contextGain = function () {
            console.log(config_1.default.NAMESPACE + " " + config_1.default.VERSION + " (" + config_1.default.GITHUB + ") " + config_1.default.LAST_MODIFIED);
        };
        EIGHTLogger.prototype.contextLost = function () {
        };
        return EIGHTLogger;
    }(ShareableBase_1.ShareableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EIGHTLogger;
});

define('davinci-eight/core/initWebGL',["require", "exports", "../checks/isDefined"], function (require, exports, isDefined_1) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/VersionLogger',["require", "exports", "../core/ShareableBase"], function (require, exports, ShareableBase_1) {
    "use strict";
    var VersionLogger = (function (_super) {
        __extends(VersionLogger, _super);
        function VersionLogger(contextManager) {
            var _this = _super.call(this) || this;
            _this.contextManager = contextManager;
            _this.setLoggingName("VersionLogger");
            return _this;
        }
        VersionLogger.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        VersionLogger.prototype.contextFree = function () {
        };
        VersionLogger.prototype.contextGain = function () {
            var gl = this.contextManager.gl;
            console.log(gl.getParameter(gl.VERSION));
        };
        VersionLogger.prototype.contextLost = function () {
        };
        return VersionLogger;
    }(ShareableBase_1.ShareableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VersionLogger;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Engine',["require", "exports", "./checkEnums", "./ClearBufferMask", "../commands/EIGHTLogger", "./initWebGL", "../checks/isDefined", "../checks/mustBeObject", "../collections/ShareableArray", "./ShareableBase", "../commands/VersionLogger", "../commands/WebGLClearColor", "../commands/WebGLEnable", "../commands/WebGLDisable"], function (require, exports, checkEnums_1, ClearBufferMask_1, EIGHTLogger_1, initWebGL_1, isDefined_1, mustBeObject_1, ShareableArray_1, ShareableBase_1, VersionLogger_1, WebGLClearColor_1, WebGLEnable_1, WebGLDisable_1) {
    "use strict";
    var Engine = (function (_super) {
        __extends(Engine, _super);
        function Engine(canvas, attributes, doc) {
            if (doc === void 0) { doc = window.document; }
            var _this = _super.call(this) || this;
            _this._users = [];
            _this._commands = new ShareableArray_1.default([]);
            _this.setLoggingName('Engine');
            _this._attributes = attributes;
            _this._commands.pushWeakRef(new EIGHTLogger_1.default(_this));
            _this._commands.pushWeakRef(new VersionLogger_1.default(_this));
            _this._webGLContextLost = function (event) {
                if (isDefined_1.default(_this._gl)) {
                    event.preventDefault();
                    _this._gl = void 0;
                    _this._users.forEach(function (user) {
                        user.contextLost();
                    });
                }
            };
            _this._webGLContextRestored = function (event) {
                if (isDefined_1.default(_this._gl)) {
                    event.preventDefault();
                    _this._gl = initWebGL_1.default(_this._gl.canvas, attributes);
                    _this._users.forEach(function (user) {
                        user.contextGain();
                    });
                }
            };
            if (canvas) {
                _this.start(canvas, doc);
            }
            return _this;
        }
        Engine.prototype.destructor = function (levelUp) {
            this.stop();
            while (this._users.length > 0) {
                this._users.pop();
            }
            this._commands.release();
            _super.prototype.destructor.call(this, levelUp + 1);
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
                if (this._gl) {
                    return this._gl.canvas;
                }
                else {
                    return void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "drawingBufferHeight", {
            get: function () {
                if (this._gl) {
                    return this._gl.drawingBufferHeight;
                }
                else {
                    return void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "drawingBufferWidth", {
            get: function () {
                if (this._gl) {
                    return this._gl.drawingBufferWidth;
                }
                else {
                    return void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype.blendFunc = function (sfactor, dfactor) {
            var gl = this._gl;
            if (gl) {
                gl.blendFunc(sfactor, dfactor);
            }
            return this;
        };
        Engine.prototype.clear = function (mask) {
            if (mask === void 0) { mask = ClearBufferMask_1.default.COLOR_BUFFER_BIT | ClearBufferMask_1.default.DEPTH_BUFFER_BIT; }
            var gl = this._gl;
            if (gl) {
                gl.clear(mask);
            }
            return this;
        };
        Engine.prototype.clearColor = function (red, green, blue, alpha) {
            this._commands.pushWeakRef(new WebGLClearColor_1.WebGLClearColor(this, red, green, blue, alpha));
            var gl = this._gl;
            if (gl) {
                gl.clearColor(red, green, blue, alpha);
            }
            return this;
        };
        Engine.prototype.clearDepth = function (depth) {
            var gl = this._gl;
            if (gl) {
                gl.clearDepth(depth);
            }
            return this;
        };
        Engine.prototype.clearStencil = function (s) {
            var gl = this._gl;
            if (gl) {
                gl.clearStencil(s);
            }
            return this;
        };
        Engine.prototype.depthFunc = function (func) {
            var gl = this._gl;
            if (gl) {
                gl.depthFunc(func);
            }
            return this;
        };
        Engine.prototype.depthMask = function (flag) {
            var gl = this._gl;
            if (gl) {
                gl.depthMask(flag);
            }
            return this;
        };
        Engine.prototype.disable = function (capability) {
            this._commands.pushWeakRef(new WebGLDisable_1.WebGLDisable(this, capability));
            if (this._gl) {
                this._gl.disable(capability);
            }
            return this;
        };
        Engine.prototype.enable = function (capability) {
            this._commands.pushWeakRef(new WebGLEnable_1.WebGLEnable(this, capability));
            if (this._gl) {
                this._gl.enable(capability);
            }
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
            enumerable: true,
            configurable: true
        });
        Engine.prototype.readPixels = function (x, y, width, height, format, type, pixels) {
            if (this._gl) {
                this._gl.readPixels(x, y, width, height, format, type, pixels);
            }
        };
        Engine.prototype.removeContextListener = function (user) {
            mustBeObject_1.default('user', user);
            var index = this._users.indexOf(user);
            if (index >= 0) {
                this._users.splice(index, 1);
            }
        };
        Engine.prototype.size = function (width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
            return this.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
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
                gl.viewport(x, y, width, height);
            }
            return this;
        };
        Engine.prototype.start = function (canvas, doc) {
            if (doc === void 0) { doc = window.document; }
            if (typeof canvas === 'string') {
                var canvasElement = doc.getElementById(canvas);
                if (canvasElement) {
                    return this.start(canvasElement, doc);
                }
                else {
                    throw new Error("canvas argument must be a canvas element id or an HTMLCanvasElement.");
                }
            }
            else if (canvas instanceof HTMLCanvasElement) {
                if (isDefined_1.default(this._gl)) {
                    console.warn(this.getLoggingName() + " Ignoring start() because already started.");
                    return this;
                }
                else {
                    this._gl = initWebGL_1.default(canvas, this._attributes);
                    checkEnums_1.default(this._gl);
                    this.emitStartEvent();
                    canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
                    canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
                }
                return this;
            }
            else {
                this._gl = canvas;
                return this;
            }
        };
        Engine.prototype.stop = function () {
            if (isDefined_1.default(this._gl)) {
                this._gl.canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false);
                this._gl.canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false);
                if (this._gl) {
                    this.emitStopEvent();
                    this._gl = void 0;
                }
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
                consumer.contextGain();
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
                consumer.contextFree();
            }
        };
        Engine.prototype.synchronize = function (consumer) {
            if (this._gl) {
                this.emitContextGain(consumer);
            }
            else {
            }
            return this;
        };
        return Engine;
    }(ShareableBase_1.ShareableBase));
    exports.Engine = Engine;
});

define('davinci-eight/facets/AmbientLight',["require", "exports", "../core/Color", "../checks/mustBeNumber", "../checks/mustBeObject", "../core/GraphicsProgramSymbols"], function (require, exports, Color_1, mustBeNumber_1, mustBeObject_1, GraphicsProgramSymbols_1) {
    "use strict";
    var AmbientLight = (function () {
        function AmbientLight(color) {
            mustBeObject_1.default('color', color);
            this.color = Color_1.Color.white.clone();
            this.color.r = mustBeNumber_1.default('color.r', color.r);
            this.color.g = mustBeNumber_1.default('color.g', color.g);
            this.color.b = mustBeNumber_1.default('color.b', color.b);
        }
        AmbientLight.prototype.setUniforms = function (visitor) {
            var color = this.color;
            visitor.uniform3f(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, color.r, color.g, color.b);
        };
        return AmbientLight;
    }());
    exports.AmbientLight = AmbientLight;
});

define('davinci-eight/facets/DirectionalLight',["require", "exports", "../core/Color", "../math/Geometric3", "../checks/mustBeObject", "../core/GraphicsProgramSymbols", "../math/Vector3"], function (require, exports, Color_1, Geometric3_1, mustBeObject_1, GraphicsProgramSymbols_1, Vector3_1) {
    "use strict";
    var DirectionalLight = (function () {
        function DirectionalLight(direction, color) {
            if (direction === void 0) { direction = Vector3_1.default.vector(0, 0, 1).neg(); }
            if (color === void 0) { color = Color_1.Color.white; }
            mustBeObject_1.default('direction', direction);
            mustBeObject_1.default('color', color);
            this._direction = Geometric3_1.Geometric3.fromVector(direction).normalize();
            this._color = Color_1.Color.copy(color);
        }
        Object.defineProperty(DirectionalLight.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (color) {
                this._color.copy(Color_1.Color.mustBe('color', color));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectionalLight.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (direction) {
                mustBeObject_1.default('direction', direction);
                this._direction.copy(direction);
            },
            enumerable: true,
            configurable: true
        });
        DirectionalLight.prototype.setUniforms = function (visitor) {
            var direction = this._direction;
            visitor.uniform3f(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z);
            var color = this.color;
            visitor.uniform3f(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b);
        };
        return DirectionalLight;
    }());
    exports.DirectionalLight = DirectionalLight;
});

define('davinci-eight/math/det2x2',["require", "exports"], function (require, exports) {
    "use strict";
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
define('davinci-eight/math/Matrix2',["require", "exports", "../math/AbstractMatrix", "../math/det2x2", "../checks/isDefined", "../checks/mustBeInteger", "../checks/mustBeNumber"], function (require, exports, AbstractMatrix_1, det2x2_1, isDefined_1, mustBeInteger_1, mustBeNumber_1) {
    "use strict";
    function add2x2(a, b, c) {
        var a11 = a[0x0], a12 = a[0x2];
        var a21 = a[0x1], a22 = a[0x3];
        var b11 = b[0x0], b12 = b[0x2];
        var b21 = b[0x1], b22 = b[0x3];
        c[0x0] = a11 + b11;
        c[0x2] = a12 + b12;
        c[0x1] = a21 + b21;
        c[0x3] = a22 + b22;
    }
    var Matrix2 = (function (_super) {
        __extends(Matrix2, _super);
        function Matrix2(elements) {
            return _super.call(this, elements, 2) || this;
        }
        Matrix2.prototype.add = function (rhs) {
            return this.add2(this, rhs);
        };
        Matrix2.prototype.add2 = function (a, b) {
            add2x2(a.elements, b.elements, this.elements);
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
    }(AbstractMatrix_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Matrix2;
});

define('davinci-eight/facets/ReflectionFacetE2',["require", "exports", "../checks/mustBeString", "../math/Vector2", "../math/Matrix2", "../i18n/readOnly"], function (require, exports, mustBeString_1, Vector2_1, Matrix2_1, readOnly_1) {
    "use strict";
    var ReflectionFacetE2 = (function () {
        function ReflectionFacetE2(name) {
            this.matrix = Matrix2_1.default.one();
            this.name = mustBeString_1.default('name', name);
            this._normal = new Vector2_1.Vector2().zero();
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
        ReflectionFacetE2.prototype.setUniforms = function (visitor) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.matrix2fv(this.name, this.matrix.elements, false);
        };
        return ReflectionFacetE2;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReflectionFacetE2;
});

define('davinci-eight/facets/ReflectionFacetE3',["require", "exports", "../checks/mustBeString", "../math/Geometric3", "../math/Matrix4", "../i18n/readOnly"], function (require, exports, mustBeString_1, Geometric3_1, Matrix4_1, readOnly_1) {
    "use strict";
    var ReflectionFacetE3 = (function () {
        function ReflectionFacetE3(name) {
            this.matrix = Matrix4_1.default.one();
            this.name = mustBeString_1.default('name', name);
            this._normal = Geometric3_1.Geometric3.zero();
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
        ReflectionFacetE3.prototype.setUniforms = function (visitor) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.matrix4fv(this.name, this.matrix.elements, false);
        };
        return ReflectionFacetE3;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReflectionFacetE3;
});

define('davinci-eight/facets/Vector3Facet',["require", "exports", "../checks/mustBeString", "../math/Vector3"], function (require, exports, mustBeString_1, Vector3_1) {
    "use strict";
    var Vector3Facet = (function () {
        function Vector3Facet(name) {
            this.vector = Vector3_1.default.vector(0, 0, 0);
            this._name = mustBeString_1.default('name', name);
        }
        Object.defineProperty(Vector3Facet.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = mustBeString_1.default('name', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3Facet.prototype, "value", {
            get: function () {
                return this.vector;
            },
            set: function (value) {
                this.vector.copy(value);
            },
            enumerable: true,
            configurable: true
        });
        Vector3Facet.prototype.setUniforms = function (visitor) {
            var v = this.vector;
            visitor.uniform3f(this._name, v.x, v.y, v.z);
        };
        return Vector3Facet;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector3Facet;
});

define('davinci-eight/facets/viewArrayFromEyeLookUp',["require", "exports", "../math/Vector3", "../checks/mustSatisfy", "../checks/isDefined"], function (require, exports, Vector3_1, mustSatisfy_1, isDefined_1) {
    "use strict";
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

define('davinci-eight/facets/viewMatrixFromEyeLookUp',["require", "exports", "../checks/isDefined", "../math/Matrix4", "./viewArrayFromEyeLookUp"], function (require, exports, isDefined_1, Matrix4_1, viewArrayFromEyeLookUp_1) {
    "use strict";
    function default_1(eye, look, up, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : Matrix4_1.default.one();
        viewArrayFromEyeLookUp_1.default(eye, look, up, m.elements);
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/facets/createView',["require", "exports", "../math/Geometric3", "../math/Matrix4", "../core/GraphicsProgramSymbols", "../checks/isUndefined", "./viewMatrixFromEyeLookUp"], function (require, exports, Geometric3_1, Matrix4_1, GraphicsProgramSymbols_1, isUndefined_1, viewMatrixFromEyeLookUp_1) {
    "use strict";
    function createView(options) {
        if (options === void 0) { options = {}; }
        var eye = Geometric3_1.Geometric3.vector(0, 0, 1);
        var look = Geometric3_1.Geometric3.vector(0, 0, 0);
        var up = Geometric3_1.Geometric3.vector(0, 1, 0);
        var viewMatrix = Matrix4_1.default.one();
        var viewMatrixName = isUndefined_1.default(options.viewMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
        eye.modified = true;
        look.modified = true;
        up.modified = true;
        var self = {
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
                self.updateViewMatrix();
                visitor.matrix4fv(viewMatrixName, viewMatrix.elements, false);
            },
            updateViewMatrix: function () {
                if (eye.modified || look.modified || up.modified) {
                    viewMatrixFromEyeLookUp_1.default(eye, look, up, viewMatrix);
                    eye.modified = false;
                    look.modified = false;
                    up.modified = false;
                }
            },
            get viewMatrix() {
                self.updateViewMatrix();
                return viewMatrix;
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
define('davinci-eight/math/Vector1',["require", "exports", "../math/Coords"], function (require, exports, Coords_1) {
    "use strict";
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var Vector1 = (function (_super) {
        __extends(Vector1, _super);
        function Vector1(data, modified) {
            if (data === void 0) { data = [0]; }
            if (modified === void 0) { modified = false; }
            return _super.call(this, data, modified, 1) || this;
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
            return new Vector1([Math.random()]);
        };
        Vector1.zero = function () {
            return new Vector1([0]);
        };
        return Vector1;
    }(Coords_1.Coords));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector1;
});

define('davinci-eight/facets/perspectiveMatrix',["require", "exports", "../checks/isDefined", "../math/Matrix4", "./perspectiveArray"], function (require, exports, isDefined_1, Matrix4_1, perspectiveArray_1) {
    "use strict";
    function perspectiveMatrix(fov, aspect, near, far, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : Matrix4_1.default.one();
        perspectiveArray_1.default(fov, aspect, near, far, m.elements);
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = perspectiveMatrix;
});

define('davinci-eight/facets/createPerspective',["require", "exports", "./createView", "../math/Matrix4", "../core/GraphicsProgramSymbols", "../math/Vector1", "../checks/isUndefined", "../checks/mustBeNumber", "./perspectiveMatrix"], function (require, exports, createView_1, Matrix4_1, GraphicsProgramSymbols_1, Vector1_1, isUndefined_1, mustBeNumber_1, perspectiveMatrix_1) {
    "use strict";
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
                self.updateProjectionMatrix();
                visitor.matrix4fv(projectionMatrixName, projectionMatrix.elements, false);
                base.setUniforms(visitor);
            },
            get projectionMatrix() {
                self.updateProjectionMatrix();
                return projectionMatrix;
            },
            updateProjectionMatrix: function () {
                if (matrixNeedsUpdate) {
                    perspectiveMatrix_1.default(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                    matrixNeedsUpdate = false;
                }
            },
            updateViewMatrix: function () {
                base.updateViewMatrix();
            },
            get viewMatrix() {
                return base.viewMatrix;
            },
            set viewMatrix(value) {
                base.viewMatrix = value;
            }
        };
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createPerspective;
});

define('davinci-eight/facets/PerspectiveCamera',["require", "exports", "./createPerspective", "../checks/mustBeGE", "../checks/mustBeLE", "../checks/mustBeNumber"], function (require, exports, createPerspective_1, mustBeGE_1, mustBeLE_1, mustBeNumber_1) {
    "use strict";
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
        Object.defineProperty(PerspectiveCamera.prototype, "fov", {
            get: function () {
                return this.inner.fov;
            },
            set: function (value) {
                this.inner.fov = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PerspectiveCamera.prototype, "look", {
            get: function () {
                return this.inner.look;
            },
            set: function (look) {
                this.inner.look.copyVector(look);
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(PerspectiveCamera.prototype, "up", {
            get: function () {
                return this.inner.up;
            },
            set: function (up) {
                this.inner.up.copyVector(up);
            },
            enumerable: true,
            configurable: true
        });
        return PerspectiveCamera;
    }());
    exports.PerspectiveCamera = PerspectiveCamera;
});

define('davinci-eight/math/dotVectorE2',["require", "exports", "../checks/isDefined"], function (require, exports, isDefined_1) {
    "use strict";
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
    "use strict";
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
    "use strict";
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

define('davinci-eight/math/mulE2',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/math/rcoE2',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/math/dotVectorCartesianE2',["require", "exports"], function (require, exports) {
    "use strict";
    function dotVectorCartesianE2(ax, ay, bx, by) {
        return ax * bx + ay * by;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorCartesianE2;
});

define('davinci-eight/math/quadVectorE2',["require", "exports", "../math/dotVectorCartesianE2", "../checks/isDefined", "../checks/isNumber"], function (require, exports, dotVectorCartesianE2_1, isDefined_1, isNumber_1) {
    "use strict";
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

define('davinci-eight/math/rotorFromDirectionsE2',["require", "exports", "./dotVectorE2", "./quadVectorE2"], function (require, exports, dotVectorE2_1, quadVectorE2_1) {
    "use strict";
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

define('davinci-eight/math/scpE2',["require", "exports"], function (require, exports) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Geometric2',["require", "exports", "./arraysEQ", "../geometries/b2", "../geometries/b3", "./Coords", "./dotVectorE2", "./extE2", "./gauss", "../checks/isDefined", "../checks/isNumber", "../checks/isObject", "./lcoE2", "./mulE2", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../i18n/notImplemented", "../i18n/notSupported", "./rcoE2", "./rotorFromDirectionsE2", "./scpE2", "./stringFromCoordinates", "./wedgeXY"], function (require, exports, arraysEQ_1, b2_1, b3_1, Coords_1, dotVectorE2_1, extE2_1, gauss_1, isDefined_1, isNumber_1, isObject_1, lcoE2_1, mulE2_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, notImplemented_1, notSupported_1, rcoE2_1, rotorFromDirectionsE2_1, scpE2_1, stringFromCoordinates_1, wedgeXY_1) {
    "use strict";
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
        return [m.a, m.x, m.y, m.b];
    }
    function duckCopy(value) {
        if (isObject_1.default(value)) {
            var m = value;
            if (isNumber_1.default(m.x) && isNumber_1.default(m.y)) {
                if (isNumber_1.default(m.a) && isNumber_1.default(m.b)) {
                    console.warn("Copying GeometricE2 to Geometric2");
                    return Geometric2.copy(m);
                }
                else {
                    console.warn("Copying VectorE2 to Geometric2");
                    return Geometric2.fromVector(m);
                }
            }
            else {
                if (isNumber_1.default(m.a) && isNumber_1.default(m.b)) {
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
            return _super.call(this, [0, 0, 0, 0], false, 4) || this;
        }
        Object.defineProperty(Geometric2.prototype, "a", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (a) {
                this.modified = this.modified || this.coords[COORD_SCALAR] !== a;
                this.coords[COORD_SCALAR] = a;
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
        Object.defineProperty(Geometric2.prototype, "b", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (b) {
                this.modified = this.modified || this.coords[COORD_PSEUDO] !== b;
                this.coords[COORD_PSEUDO] = b;
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
            this.a += M.a * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.b += M.b * α;
            return this;
        };
        Geometric2.prototype.add2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.a = a.a + b.a;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.b = a.b + b.b;
            return this;
        };
        Geometric2.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            this.b += β;
            return this;
        };
        Geometric2.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.a += α;
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
            this.b = -this.b;
            return this;
        };
        Geometric2.prototype.cos = function () {
            throw new Error(notImplemented_1.default('cos').message);
        };
        Geometric2.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        Geometric2.prototype.distanceTo = function (M) {
            var α = this.a - M.a;
            var x = this.x - M.x;
            var y = this.y - M.y;
            var β = this.b - M.b;
            return Math.sqrt(scpE2_1.default(α, x, y, β, α, x, y, β, 0));
        };
        Geometric2.prototype.copy = function (M) {
            mustBeObject_1.default('M', M);
            this.a = M.a;
            this.x = M.x;
            this.y = M.y;
            this.b = M.b;
            return this;
        };
        Geometric2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        Geometric2.prototype.copySpinor = function (spinor) {
            mustBeObject_1.default('spinor', spinor);
            this.a = spinor.a;
            this.x = 0;
            this.y = 0;
            this.b = spinor.b;
            return this;
        };
        Geometric2.prototype.copyVector = function (vector) {
            mustBeObject_1.default('vector', vector);
            this.a = 0;
            this.x = vector.x;
            this.y = vector.y;
            this.b = 0;
            return this;
        };
        Geometric2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var α = b3_1.default(t, this.a, controlBegin.a, controlEnd.a, endPoint.a);
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var β = b3_1.default(t, this.b, controlBegin.b, controlEnd.b, endPoint.b);
            this.a = α;
            this.x = x;
            this.y = y;
            this.b = β;
            return this;
        };
        Geometric2.prototype.normalize = function () {
            var norm = this.magnitude();
            this.a = this.a / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.b = this.b / norm;
            return this;
        };
        Geometric2.prototype.div = function (m) {
            return this.div2(this, m);
        };
        Geometric2.prototype.div2 = function (a, b) {
            var a0 = a.a;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.b;
            this.copy(b).inv();
            var b0 = this.a;
            var b1 = this.x;
            var b2 = this.y;
            var b3 = this.b;
            this.a = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.b = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.divByScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.a /= α;
            this.x /= α;
            this.y /= α;
            this.b /= α;
            return this;
        };
        Geometric2.prototype.dual = function (m) {
            var w = -m.b;
            var x = +m.y;
            var y = -m.x;
            var β = +m.a;
            this.a = w;
            this.x = x;
            this.y = y;
            this.b = β;
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
            var w = this.a;
            var z = this.b;
            var expW = exp(w);
            var φ = sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.a = expW * cos(φ);
            this.b = z * s;
            return this;
        };
        Geometric2.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        Geometric2.prototype.ext2 = function (a, b) {
            var a0 = a.a;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.b;
            var b0 = b.a;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.b;
            this.a = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.b = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.inv = function () {
            var α = this.a;
            var x = this.x;
            var y = this.y;
            var β = this.b;
            var A = [
                [α, x, y, -β],
                [x, α, β, -y],
                [y, -β, α, x],
                [β, -y, x, α]
            ];
            var b = [1, 0, 0, 0];
            var X = gauss_1.default(A, b);
            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.b = X[3];
            return this;
        };
        Geometric2.prototype.isOne = function () {
            return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0;
        };
        Geometric2.prototype.isZero = function () {
            return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0;
        };
        Geometric2.prototype.lco = function (m) {
            return this.lco2(this, m);
        };
        Geometric2.prototype.lco2 = function (a, b) {
            var a0 = a.a;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.b;
            var b0 = b.a;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.b;
            this.a = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.b = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.lerp = function (target, α) {
            mustBeObject_1.default('target', target);
            mustBeNumber_1.default('α', α);
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.b += (target.b - this.b) * α;
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
            var α = this.a;
            var β = this.b;
            this.a = log(sqrt(α * α + β * β));
            this.x = 0;
            this.y = 0;
            this.b = atan2(β, α);
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
            var a0 = a.a;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.b;
            var b0 = b.a;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.b;
            this.a = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.b = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.neg = function () {
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.b = -this.b;
            return this;
        };
        Geometric2.prototype.norm = function () {
            this.a = this.magnitudeSansUnits();
            this.x = 0;
            this.y = 0;
            this.b = 0;
            return this;
        };
        Geometric2.prototype.one = function () {
            this.a = 1;
            this.x = 0;
            this.y = 0;
            this.b = 0;
            return this;
        };
        Geometric2.prototype.pow = function (M) {
            throw new Error(notImplemented_1.default('pow').message);
        };
        Geometric2.prototype.quad = function () {
            this.a = this.squaredNormSansUnits();
            this.x = 0;
            this.y = 0;
            this.b = 0;
            return this;
        };
        Geometric2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var α = b2_1.default(t, this.a, controlPoint.a, endPoint.a);
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var β = b2_1.default(t, this.b, controlPoint.b, endPoint.b);
            this.a = α;
            this.x = x;
            this.y = y;
            this.b = β;
            return this;
        };
        Geometric2.prototype.rco = function (m) {
            return this.rco2(this, m);
        };
        Geometric2.prototype.rco2 = function (a, b) {
            var a0 = a.a;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.b;
            var b0 = b.a;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.b;
            this.a = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.b = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        Geometric2.prototype.reflect = function (n) {
            mustBeObject_1.default('n', n);
            var nx = n.x;
            var ny = n.y;
            mustBeNumber_1.default('n.x', nx);
            mustBeNumber_1.default('n.y', ny);
            var x = this.x;
            var y = this.y;
            var μ = nx * nx - ny * ny;
            var λ = -2 * nx * ny;
            this.a = -this.a;
            this.x = λ * y - μ * x;
            this.y = λ * x + μ * y;
            this.b = +this.b;
            return this;
        };
        Geometric2.prototype.rev = function () {
            this.a = this.a;
            this.x = this.x;
            this.y = this.y;
            this.b = -this.b;
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
            var β = R.b;
            var α = R.a;
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
        Geometric2.prototype.rotorFromVectorToVector = function (a, b) {
            rotorFromDirectionsE2_1.default(a, b, this);
            return this;
        };
        Geometric2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            mustBeObject_1.default('B', B);
            mustBeNumber_1.default('θ', θ);
            var β = B.b;
            var φ = θ / 2;
            this.a = cos(abs(β) * φ);
            this.x = 0;
            this.y = 0;
            this.b = -sin(β * φ);
            return this;
        };
        Geometric2.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        Geometric2.prototype.scp2 = function (a, b) {
            this.a = scpE2_1.default(a.a, a.x, a.y, a.b, b.a, b.x, b.y, b.b, 0);
            this.x = 0;
            this.y = 0;
            this.b = 0;
            return this;
        };
        Geometric2.prototype.scale = function (α) {
            mustBeNumber_1.default('α', α);
            this.a *= α;
            this.x *= α;
            this.y *= α;
            this.b *= α;
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
            this.a = dotVectorE2_1.default(a, b);
            this.x = 0;
            this.y = 0;
            this.b = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
            return this;
        };
        Geometric2.prototype.squaredNorm = function () {
            return this.squaredNormSansUnits();
        };
        Geometric2.prototype.squaredNormSansUnits = function () {
            var w = this.a;
            var x = this.x;
            var y = this.y;
            var B = this.b;
            return w * w + x * x + y * y + B * B;
        };
        Geometric2.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('M', M);
            mustBeNumber_1.default('α', α);
            this.a -= M.a * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.b -= M.b * α;
            return this;
        };
        Geometric2.prototype.sub2 = function (a, b) {
            mustBeObject_1.default('a', a);
            mustBeObject_1.default('b', b);
            this.a = a.a - b.a;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.b = a.b - b.b;
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
                case 0: {
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                    break;
                }
                case 1: {
                    this.a = 0;
                    this.b = 0;
                    break;
                }
                case 2: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    break;
                }
                default: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                }
            }
            return this;
        };
        Geometric2.prototype.zero = function () {
            this.a = 0;
            this.x = 0;
            this.y = 0;
            this.b = 0;
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
            copy.a = M.a;
            copy.x = M.x;
            copy.y = M.y;
            copy.b = M.b;
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
            m.a = α;
            m.x = x;
            m.y = y;
            m.b = β;
            return m;
        };
        Geometric2.fromBivector = function (B) {
            return Geometric2.fromCartesian(0, 0, 0, B.b);
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
        return Geometric2;
    }(Coords_1.Coords));
    exports.Geometric2 = Geometric2;
    Geometric2.BASIS_LABELS = STANDARD_LABELS;
    Geometric2.BASIS_LABELS_COMPASS = COMPASS_LABELS;
    Geometric2.BASIS_LABELS_GEOMETRIC = ARROW_LABELS;
    Geometric2.BASIS_LABELS_STANDARD = STANDARD_LABELS;
});

define('davinci-eight/facets/ModelE2',["require", "exports", "../math/Geometric2"], function (require, exports, Geometric2_1) {
    "use strict";
    var ModelE2 = (function () {
        function ModelE2() {
            this._position = new Geometric2_1.Geometric2().zero();
            this._attitude = new Geometric2_1.Geometric2().zero().addScalar(1);
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
        return ModelE2;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ModelE2;
    ModelE2.PROP_ATTITUDE = 'R';
    ModelE2.PROP_POSITION = 'X';
});

define('davinci-eight/atoms/DrawAttribute',["require", "exports"], function (require, exports) {
    "use strict";
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
        function DrawAttribute(values, size, type) {
            this.values = checkValues(values);
            this.size = checkSize(size, values);
            this.type = type;
        }
        return DrawAttribute;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawAttribute;
});

define('davinci-eight/atoms/DrawPrimitive',["require", "exports", "../checks/mustBeArray", "../checks/mustBeInteger", "../checks/mustBeObject"], function (require, exports, mustBeArray_1, mustBeInteger_1, mustBeObject_1) {
    "use strict";
    var context = function () { return "DrawPrimitive constructor"; };
    var DrawPrimitive = (function () {
        function DrawPrimitive(mode, indices, attributes) {
            this.attributes = {};
            this.mode = mustBeInteger_1.default('mode', mode, context);
            this.indices = mustBeArray_1.default('indices', indices, context);
            this.attributes = mustBeObject_1.default('attributes', attributes, context);
        }
        return DrawPrimitive;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawPrimitive;
});

define('davinci-eight/atoms/reduce',["require", "exports", "../core/BeginMode"], function (require, exports, BeginMode_1) {
    "use strict";
    function copyIndices(src, dest, delta) {
        if (src.indices) {
            var iLen = src.indices.length;
            for (var i = 0; i < iLen; i++) {
                dest.push(src.indices[i] + delta);
            }
        }
    }
    function max(xs) {
        return xs.reduce(function (a, b) { return a > b ? a : b; });
    }
    function joinIndices(previous, current, dest) {
        if (previous.indices) {
            var lastIndex = previous.indices[previous.indices.length - 1];
            if (current.indices) {
                var nextIndex = current.indices[0] + max(previous.indices) + 1;
                dest.push(lastIndex);
                dest.push(nextIndex);
            }
        }
    }
    function ensureAttribute(attributes, name, size, type) {
        if (!attributes[name]) {
            attributes[name] = { values: [], size: size, type: type };
        }
        return attributes[name];
    }
    function copyAttributes(primitive, attributes) {
        var keys = Object.keys(primitive.attributes);
        var kLen = keys.length;
        for (var k = 0; k < kLen; k++) {
            var key = keys[k];
            var srcAttrib = primitive.attributes[key];
            var dstAttrib = ensureAttribute(attributes, key, srcAttrib.size, srcAttrib.type);
            var svalues = srcAttrib.values;
            var vLen = svalues.length;
            for (var v = 0; v < vLen; v++) {
                dstAttrib.values.push(svalues[v]);
            }
        }
    }
    function reduce(primitives) {
        return primitives.reduce(function (previous, current) {
            var indices = [];
            copyIndices(previous, indices, 0);
            joinIndices(previous, current, indices);
            copyIndices(current, indices, max(previous.indices) + 1);
            var attributes = {};
            copyAttributes(previous, attributes);
            copyAttributes(current, attributes);
            return {
                mode: BeginMode_1.default.TRIANGLE_STRIP,
                indices: indices,
                attributes: attributes
            };
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = reduce;
});

define('davinci-eight/atoms/Vertex',["require", "exports", "../math/Coords", "../checks/mustBeGE", "../checks/mustBeInteger"], function (require, exports, Coords_1, mustBeGE_1, mustBeInteger_1) {
    "use strict";
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
            this.coords = new Coords_1.Coords(data, false, numCoordinates);
        }
        Vertex.prototype.toString = function () {
            return stringifyVertex(this);
        };
        return Vertex;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vertex;
});

define('davinci-eight/shapes/ShapeBuilder',["require", "exports", "../math/Geometric3", "../math/Vector3"], function (require, exports, Geometric3_1, Vector3_1) {
    "use strict";
    var ShapeBuilder = (function () {
        function ShapeBuilder() {
            this.stress = Vector3_1.default.vector(1, 1, 1);
            this.tilt = Geometric3_1.Geometric3.one();
            this.offset = Vector3_1.default.zero();
            this.transforms = [];
            this.useNormal = true;
            this.usePosition = true;
            this.useTextureCoord = false;
        }
        ShapeBuilder.prototype.applyTransforms = function (vertex, i, j, iLength, jLength) {
            var tLen = this.transforms.length;
            for (var t = 0; t < tLen; t++) {
                this.transforms[t].exec(vertex, i, j, iLength, jLength);
            }
        };
        return ShapeBuilder;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShapeBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/shapes/AxialShapeBuilder',["require", "exports", "./ShapeBuilder"], function (require, exports, ShapeBuilder_1) {
    "use strict";
    var AxialShapeBuilder = (function (_super) {
        __extends(AxialShapeBuilder, _super);
        function AxialShapeBuilder() {
            var _this = _super.call(this) || this;
            _this.sliceAngle = 2 * Math.PI;
            return _this;
        }
        return AxialShapeBuilder;
    }(ShapeBuilder_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AxialShapeBuilder;
});

define('davinci-eight/math/quadSpinorE2',["require", "exports", "../checks/isDefined", "../checks/isNumber"], function (require, exports, isDefined_1, isNumber_1) {
    "use strict";
    function quadSpinorE2(s) {
        if (isDefined_1.default(s)) {
            var α = s.a;
            var β = s.b;
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
define('davinci-eight/math/Spinor2',["require", "exports", "../math/Coords", "../math/dotVectorCartesianE2", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../i18n/notSupported", "../math/quadSpinorE2", "../math/rotorFromDirectionsE2", "../math/wedgeXY"], function (require, exports, Coords_1, dotVectorCartesianE2_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, notSupported_1, quadSpinorE2_1, rotorFromDirectionsE2_1, wedgeXY_1) {
    "use strict";
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
            return _super.call(this, coordinates, modified, 2) || this;
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
        Object.defineProperty(Spinor2.prototype, "a", {
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (α) {
                mustBeNumber_1.default('α', α);
                this.modified = this.modified || this.a !== α;
                this.coords[COORD_SCALAR] = α;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "b", {
            get: function () {
                return this.coords[COORD_PSEUDO];
            },
            set: function (b) {
                mustBeNumber_1.default('b', b);
                this.modified = this.modified || this.b !== b;
                this.coords[COORD_PSEUDO] = b;
            },
            enumerable: true,
            configurable: true
        });
        Spinor2.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject_1.default('spinor', spinor);
            mustBeNumber_1.default('α', α);
            this.xy += spinor.b * α;
            this.a += spinor.a * α;
            return this;
        };
        Spinor2.prototype.add2 = function (a, b) {
            this.a = a.a + b.a;
            this.xy = a.b + b.b;
            return this;
        };
        Spinor2.prototype.addPseudo = function (β) {
            mustBeNumber_1.default('β', β);
            return this;
        };
        Spinor2.prototype.addScalar = function (α) {
            mustBeNumber_1.default('α', α);
            this.a += α;
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
            this.xy = mustBeNumber_1.default('spinor.b', spinor.b);
            this.a = mustBeNumber_1.default('spinor.a', spinor.a);
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
            var a0 = a.a;
            var a1 = a.b;
            var b0 = b.a;
            var b1 = b.b;
            var quadB = quadSpinorE2_1.default(b);
            this.a = (a0 * b0 + a1 * b1) / quadB;
            this.xy = (a1 * b0 - a0 * b1) / quadB;
            return this;
        };
        Spinor2.prototype.divByScalar = function (α) {
            this.xy /= α;
            this.a /= α;
            return this;
        };
        Spinor2.prototype.exp = function () {
            var α = this.a;
            var β = this.b;
            var expA = Math.exp(α);
            var φ = sqrt(β * β);
            var s = expA * (φ !== 0 ? sin(φ) / φ : 1);
            this.a = expA * cos(φ);
            this.b = β * s;
            return this;
        };
        Spinor2.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNormSansUnits());
            return this;
        };
        Spinor2.prototype.isOne = function () {
            return this.a === 1 && this.b === 0;
        };
        Spinor2.prototype.isZero = function () {
            return this.a === 0 && this.b === 0;
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
            var w = this.a;
            var z = this.xy;
            var bb = z * z;
            var Vector2 = sqrt(bb);
            var R0 = abs(w);
            var R = sqrt(w * w + bb);
            this.a = log(R);
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
            var a0 = a.a;
            var a1 = a.b;
            var b0 = b.a;
            var b1 = b.b;
            this.a = a0 * b0 - a1 * b1;
            this.xy = a0 * b1 + a1 * b0;
            return this;
        };
        Spinor2.prototype.neg = function () {
            this.a = -this.a;
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
            this.a = this.a / modulus;
            return this;
        };
        Spinor2.prototype.one = function () {
            this.a = 1;
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
            var w = this.a;
            var β = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nn = nx * nx + ny * ny;
            this.a = nn * w;
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
            this.xy = -B.b * s;
            this.a = cos(φ);
            return this;
        };
        Spinor2.prototype.rotorFromVectorToVector = function (a, b) {
            rotorFromDirectionsE2_1.default(a, b, this);
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
            this.a *= α;
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
            this.xy -= s.b * α;
            this.a -= s.a * α;
            return this;
        };
        Spinor2.prototype.sub2 = function (a, b) {
            this.xy = a.b - b.b;
            this.a = a.a - b.a;
            return this;
        };
        Spinor2.prototype.versor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.a = dotVectorCartesianE2_1.default(ax, ay, bx, by);
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
                        this.a = 0;
                    }
                    break;
                default: {
                    this.a = 0;
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
            return "Spinor2({β: " + this.xy + ", w: " + this.a + "})";
        };
        Spinor2.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        Spinor2.prototype.ext2 = function (a, b) {
            return this;
        };
        Spinor2.prototype.zero = function () {
            this.a = 0;
            this.xy = 0;
            return this;
        };
        Spinor2.copy = function (spinor) {
            return new Spinor2().copy(spinor);
        };
        Spinor2.fromBivector = function (B) {
            return new Spinor2().zero().addPseudo(B.b);
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
    }(Coords_1.Coords));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spinor2;
});

define('davinci-eight/transforms/Approximation',["require", "exports", "../checks/mustBeNumber", "../math/Coords", "../math/Geometric2", "../math/Geometric3", "../math/Spinor2", "../math/Spinor3", "../math/Vector2", "../math/Vector3"], function (require, exports, mustBeNumber_1, Coords_1, Geometric2_1, Geometric3_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1) {
    "use strict";
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
                if (v instanceof Coords_1.Coords) {
                    v.approx(this.n);
                }
                else if (v instanceof Vector3_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Spinor3_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Vector2_1.Vector2) {
                    v.approx(this.n);
                }
                else if (v instanceof Spinor2_1.default) {
                    v.approx(this.n);
                }
                else if (v instanceof Geometric2_1.Geometric2) {
                    v.approx(this.n);
                }
                else if (v instanceof Geometric3_1.Geometric3) {
                    v.approx(this.n);
                }
                else {
                    throw new Error("Expecting " + aName + " to be a VectorN");
                }
            }
        };
        return Approximation;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Approximation;
});

define('davinci-eight/transforms/Direction',["require", "exports", "../checks/mustBeString", "../math/Geometric2", "../math/Geometric3", "../math/Spinor2", "../math/Spinor3", "../math/Vector2", "../math/Vector3"], function (require, exports, mustBeString_1, Geometric2_1, Geometric3_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1) {
    "use strict";
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
                else if (v instanceof Vector2_1.Vector2) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else if (v instanceof Spinor2_1.default) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else if (v instanceof Geometric3_1.Geometric3) {
                    vertex.attributes[this.sourceName] = v.normalize();
                }
                else if (v instanceof Geometric2_1.Geometric2) {
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
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Direction;
});

define('davinci-eight/transforms/Duality',["require", "exports", "../checks/mustBeBoolean", "../checks/mustBeString", "../i18n/notImplemented", "../math/Spinor2", "../math/Spinor3", "../math/Vector2", "../math/Vector3"], function (require, exports, mustBeBoolean_1, mustBeString_1, notImplemented_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1) {
    "use strict";
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
                else if (v instanceof Vector2_1.Vector2) {
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
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Duality;
});

define('davinci-eight/atoms/numPostsForFence',["require", "exports", "../checks/mustBeBoolean", "../checks/mustBeGE", "../checks/mustBeInteger"], function (require, exports, mustBeBoolean_1, mustBeGE_1, mustBeInteger_1) {
    "use strict";
    function default_1(segmentCount, closed) {
        mustBeInteger_1.default('segmentCount', segmentCount);
        mustBeGE_1.default('segmentCount', segmentCount, 0);
        mustBeBoolean_1.default('closed', closed);
        return closed ? segmentCount : segmentCount + 1;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/atoms/numVerticesForGrid',["require", "exports", "../checks/mustBeInteger"], function (require, exports, mustBeInteger_1) {
    "use strict";
    function default_1(uSegments, vSegments) {
        mustBeInteger_1.default('uSegments', uSegments);
        mustBeInteger_1.default('vSegments', vSegments);
        return (uSegments + 1) * (vSegments + 1);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/geometries/dataFromVectorN',["require", "exports", "../math/Geometric2", "../math/Geometric3", "../math/Vector2", "../math/Vector3"], function (require, exports, Geometric2_1, Geometric3_1, Vector2_1, Vector3_1) {
    "use strict";
    function dataFromVectorN(source) {
        if (source instanceof Geometric3_1.Geometric3) {
            var g3 = source;
            return [g3.x, g3.y, g3.z];
        }
        else if (source instanceof Geometric2_1.Geometric2) {
            var g2 = source;
            return [g2.x, g2.y];
        }
        else if (source instanceof Vector3_1.default) {
            var v3 = source;
            return [v3.x, v3.y, v3.z];
        }
        else if (source instanceof Vector2_1.Vector2) {
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

define('davinci-eight/atoms/VertexPrimitive',["require", "exports", "../core/DataType", "./DrawAttribute", "./DrawPrimitive", "../checks/mustBeArray", "../checks/mustBeGE", "../checks/mustBeInteger", "../i18n/notSupported", "./Vertex", "../geometries/dataFromVectorN"], function (require, exports, DataType_1, DrawAttribute_1, DrawPrimitive_1, mustBeArray_1, mustBeGE_1, mustBeInteger_1, notSupported_1, Vertex_1, dataFromVectorN_1) {
    "use strict";
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
                    attrib = attribs[name_1] = new DrawAttribute_1.default([], size, DataType_1.default.FLOAT);
                }
                for (var k = 0; k < size; k++) {
                    attrib.values.push(data[k]);
                }
            }
        }
        return attribs;
    }
    var VertexPrimitive = (function () {
        function VertexPrimitive(mode, numVertices, numCoordinates) {
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
        VertexPrimitive.prototype.vertexTransform = function (transform) {
            throw new Error(notSupported_1.default('vertexTransform').message);
        };
        VertexPrimitive.prototype.toPrimitive = function () {
            var context = function () { return 'toPrimitive'; };
            mustBeArray_1.default('elements', this.elements, context);
            return new DrawPrimitive_1.default(this.mode, this.elements, attributes(this.elements, this.vertices));
        };
        return VertexPrimitive;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VertexPrimitive;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/atoms/GridPrimitive',["require", "exports", "./numPostsForFence", "./numVerticesForGrid", "../i18n/notSupported", "../i18n/readOnly", "./VertexPrimitive"], function (require, exports, numPostsForFence_1, numVerticesForGrid_1, notSupported_1, readOnly_1, VertexPrimitive_1) {
    "use strict";
    var GridPrimitive = (function (_super) {
        __extends(GridPrimitive, _super);
        function GridPrimitive(mode, uSegments, vSegments) {
            var _this = _super.call(this, mode, numVerticesForGrid_1.default(uSegments, vSegments), 2) || this;
            _this._uClosed = false;
            _this._vClosed = false;
            _this._uSegments = uSegments;
            _this._vSegments = vSegments;
            return _this;
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
    }(VertexPrimitive_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridPrimitive;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/atoms/GridTriangleStrip',["require", "exports", "../core/BeginMode", "../checks/isDefined", "./GridPrimitive", "../checks/mustBeArray", "../checks/mustBeInteger", "./numPostsForFence"], function (require, exports, BeginMode_1, isDefined_1, GridPrimitive_1, mustBeArray_1, mustBeInteger_1, numPostsForFence_1) {
    "use strict";
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
            var _this = _super.call(this, BeginMode_1.default.TRIANGLE_STRIP, uSegments, vSegments) || this;
            _this.elements = triangleStripForGrid(uSegments, vSegments);
            return _this;
        }
        GridTriangleStrip.prototype.vertex = function (uIndex, vIndex) {
            mustBeInteger_1.default('uIndex', uIndex);
            mustBeInteger_1.default('vIndex', vIndex);
            return this.vertices[(this.vSegments - vIndex) * this.uLength + uIndex];
        };
        return GridTriangleStrip;
    }(GridPrimitive_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridTriangleStrip;
});

define('davinci-eight/transforms/ConeTransform',["require", "exports", "../checks/mustBeBoolean", "../checks/mustBeNumber", "../checks/mustBeString", "../math/Spinor3", "../math/Vector3"], function (require, exports, mustBeBoolean_1, mustBeNumber_1, mustBeString_1, Spinor3_1, Vector3_1) {
    "use strict";
    function coneNormal(ρ, h, out) {
        out.copy(ρ);
        var ρ2 = out.squaredNorm();
        out.add(h, ρ2).divByScalar(Math.sqrt(ρ2) * Math.sqrt(1 + ρ2));
    }
    var ConeTransform = (function () {
        function ConeTransform(clockwise, sliceAngle, aPosition, aTangent) {
            this.h = Vector3_1.default.vector(0, 1, 0);
            this.a = Vector3_1.default.vector(0, 0, 1);
            this.b = Vector3_1.default.vector(1, 0, 0);
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
            var ρ = new Vector3_1.default().add(this.a, cosθ).add(this.b, sinθ);
            var x = Vector3_1.default.lerp(ρ, this.h, v);
            vertex.attributes[this.aPosition] = x;
            var normal = Vector3_1.default.zero();
            coneNormal(ρ, this.h, normal);
            vertex.attributes[this.aTangent] = Spinor3_1.default.dual(normal, false);
        };
        return ConeTransform;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConeTransform;
});

define('davinci-eight/transforms/Rotation',["require", "exports", "../checks/mustBeObject", "../math/Spinor3", "../math/Vector3"], function (require, exports, mustBeObject_1, Spinor3_1, Vector3_1) {
    "use strict";
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
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Rotation;
});

define('davinci-eight/transforms/Scaling',["require", "exports", "../checks/mustBeArray", "../checks/mustBeObject", "../math/Spinor3", "../math/Vector3"], function (require, exports, mustBeArray_1, mustBeObject_1, Spinor3_1, Vector3_1) {
    "use strict";
    var Scaling = (function () {
        function Scaling(stress, names) {
            this.stress = Vector3_1.default.copy(mustBeObject_1.default('stress', stress));
            this.names = mustBeArray_1.default('names', names);
        }
        Scaling.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var nLength = this.names.length;
            for (var k = 0; k < nLength; k++) {
                var aName = this.names[k];
                var v = vertex.attributes[aName];
                if (v) {
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
                        throw new Error("Expecting " + aName + " to be a vector with 3 coordinates or a spinor with 4 coordinates.");
                    }
                }
                else {
                    console.warn("Expecting " + aName + " to be a VectorN.");
                }
            }
        };
        return Scaling;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scaling;
});

define('davinci-eight/transforms/Translation',["require", "exports", "../checks/mustBeObject", "../math/Vector3"], function (require, exports, mustBeObject_1, Vector3_1) {
    "use strict";
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
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Translation;
});

define('davinci-eight/transforms/CoordsTransform2D',["require", "exports", "../core/GraphicsProgramSymbols", "../checks/mustBeBoolean", "../math/Vector2"], function (require, exports, GraphicsProgramSymbols_1, mustBeBoolean_1, Vector2_1) {
    "use strict";
    var CoordsTransform2D = (function () {
        function CoordsTransform2D(flipU, flipV, exchangeUV) {
            this.flipU = mustBeBoolean_1.default('flipU', flipU);
            this.flipV = mustBeBoolean_1.default('flipV', flipV);
            this.exchageUV = mustBeBoolean_1.default('exchangeUV', exchangeUV);
        }
        CoordsTransform2D.prototype.exec = function (vertex, i, j, iLength, jLength) {
            var u = i / (iLength - 1);
            var v = j / (jLength - 1);
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = new Vector2_1.Vector2([u, v]);
        };
        return CoordsTransform2D;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CoordsTransform2D;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/shapes/ConicalShellBuilder',["require", "exports", "../transforms/Approximation", "../transforms/Direction", "../transforms/Duality", "../core/GraphicsProgramSymbols", "../atoms/GridTriangleStrip", "./AxialShapeBuilder", "../transforms/ConeTransform", "../transforms/Rotation", "../transforms/Scaling", "../transforms/Translation", "../transforms/CoordsTransform2D", "../math/Vector3"], function (require, exports, Approximation_1, Direction_1, Duality_1, GraphicsProgramSymbols_1, GridTriangleStrip_1, AxialShapeBuilder_1, ConeTransform_1, Rotation_1, Scaling_1, Translation_1, CoordsTransform2D_1, Vector3_1) {
    "use strict";
    var aPosition = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION;
    var aTangent = GraphicsProgramSymbols_1.default.ATTRIBUTE_TANGENT;
    var aNormal = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL;
    var ConicalShellBuilder = (function (_super) {
        __extends(ConicalShellBuilder, _super);
        function ConicalShellBuilder() {
            var _this = _super.call(this) || this;
            _this.radialSegments = 1;
            _this.thetaSegments = 32;
            _this.height = Vector3_1.default.vector(0, 1, 0);
            _this.cutLine = Vector3_1.default.vector(0, 0, 1);
            _this.clockwise = true;
            return _this;
        }
        ConicalShellBuilder.prototype.toPrimitive = function () {
            var coneTransform = new ConeTransform_1.default(this.clockwise, this.sliceAngle, aPosition, aTangent);
            coneTransform.h.copy(this.height);
            coneTransform.a.copy(this.cutLine);
            coneTransform.b.copy(this.height).normalize().cross(this.cutLine);
            this.transforms.push(coneTransform);
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
            return grid.toPrimitive();
        };
        return ConicalShellBuilder;
    }(AxialShapeBuilder_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConicalShellBuilder;
});

define('davinci-eight/transforms/CylinderTransform',["require", "exports", "../checks/mustBeNumber", "../checks/mustBeString", "../math/Spinor3", "../math/Vector3"], function (require, exports, mustBeNumber_1, mustBeString_1, Spinor3_1, Vector3_1) {
    "use strict";
    var CylinderTransform = (function () {
        function CylinderTransform(height, cutLine, clockwise, sliceAngle, orientation, aPosition, aTangent) {
            this.height = Vector3_1.default.copy(height);
            this.cutLine = Vector3_1.default.copy(cutLine);
            this.generator = Spinor3_1.default.dual(this.height.clone().normalize(), clockwise);
            this.sliceAngle = mustBeNumber_1.default('sliceAngle', sliceAngle);
            this.orientation = mustBeNumber_1.default('orientation', orientation);
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
            vertex.attributes[this.aPosition] = ρ.clone().add(this.height, v);
            vertex.attributes[this.aTangent] = Spinor3_1.default.dual(ρ, false).scale(this.orientation);
        };
        return CylinderTransform;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderTransform;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/shapes/CylindricalShellBuilder',["require", "exports", "../transforms/Approximation", "../transforms/Direction", "../transforms/Duality", "../core/GraphicsProgramSymbols", "../atoms/GridTriangleStrip", "./AxialShapeBuilder", "../transforms/CylinderTransform", "../transforms/Rotation", "../transforms/Scaling", "../transforms/Translation", "../transforms/CoordsTransform2D", "../math/Vector3"], function (require, exports, Approximation_1, Direction_1, Duality_1, GraphicsProgramSymbols_1, GridTriangleStrip_1, AxialShapeBuilder_1, CylinderTransform_1, Rotation_1, Scaling_1, Translation_1, CoordsTransform2D_1, Vector3_1) {
    "use strict";
    var aPosition = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION;
    var aTangent = GraphicsProgramSymbols_1.default.ATTRIBUTE_TANGENT;
    var aNormal = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL;
    var CylindricalShellBuilder = (function (_super) {
        __extends(CylindricalShellBuilder, _super);
        function CylindricalShellBuilder() {
            var _this = _super.apply(this, arguments) || this;
            _this.radialSegments = 1;
            _this.thetaSegments = 32;
            _this.height = Vector3_1.default.vector(0, 1, 0);
            _this.cutLine = Vector3_1.default.vector(0, 0, 1);
            _this.clockwise = true;
            _this.convex = true;
            return _this;
        }
        CylindricalShellBuilder.prototype.toPrimitive = function () {
            var orientation = this.convex ? +1 : -1;
            this.transforms.push(new CylinderTransform_1.default(this.height, this.cutLine, this.clockwise, this.sliceAngle, orientation, aPosition, aTangent));
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
            return grid.toPrimitive();
        };
        return CylindricalShellBuilder;
    }(AxialShapeBuilder_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylindricalShellBuilder;
});

define('davinci-eight/transforms/RingTransform',["require", "exports", "../checks/mustBeNumber", "../checks/mustBeString", "../math/Spinor3", "../math/Vector3"], function (require, exports, mustBeNumber_1, mustBeString_1, Spinor3_1, Vector3_1) {
    "use strict";
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
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RingTransform;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/shapes/RingBuilder',["require", "exports", "../transforms/Approximation", "../transforms/Direction", "../transforms/Duality", "../core/GraphicsProgramSymbols", "../atoms/GridTriangleStrip", "./AxialShapeBuilder", "../transforms/RingTransform", "../transforms/Rotation", "../transforms/Scaling", "../transforms/Translation", "../transforms/CoordsTransform2D", "../math/Vector3"], function (require, exports, Approximation_1, Direction_1, Duality_1, GraphicsProgramSymbols_1, GridTriangleStrip_1, AxialShapeBuilder_1, RingTransform_1, Rotation_1, Scaling_1, Translation_1, CoordsTransform2D_1, Vector3_1) {
    "use strict";
    var aPosition = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION;
    var aTangent = GraphicsProgramSymbols_1.default.ATTRIBUTE_TANGENT;
    var aNormal = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL;
    var RingBuilder = (function (_super) {
        __extends(RingBuilder, _super);
        function RingBuilder() {
            var _this = _super.apply(this, arguments) || this;
            _this.innerRadius = 0;
            _this.outerRadius = 1;
            _this.radialSegments = 1;
            _this.thetaSegments = 32;
            _this.e = Vector3_1.default.vector(0, 1, 0);
            _this.cutLine = Vector3_1.default.vector(0, 0, 1);
            _this.clockwise = true;
            return _this;
        }
        RingBuilder.prototype.toPrimitive = function () {
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
            return grid.toPrimitive();
        };
        return RingBuilder;
    }(AxialShapeBuilder_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RingBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/shapes/ArrowBuilder',["require", "exports", "./AxialShapeBuilder", "../shapes/ConicalShellBuilder", "../shapes/CylindricalShellBuilder", "../checks/mustBeDefined", "../atoms/reduce", "../shapes/RingBuilder", "../math/Vector3"], function (require, exports, AxialShapeBuilder_1, ConicalShellBuilder_1, CylindricalShellBuilder_1, mustBeDefined_1, reduce_1, RingBuilder_1, Vector3_1) {
    "use strict";
    var ArrowBuilder = (function (_super) {
        __extends(ArrowBuilder, _super);
        function ArrowBuilder(axis, cutLine, clockwise) {
            var _this = _super.call(this) || this;
            _this.heightCone = 0.20;
            _this.radiusCone = 0.08;
            _this.radiusShaft = 0.01;
            _this.thetaSegments = 16;
            mustBeDefined_1.default('axis', axis);
            mustBeDefined_1.default('cutLine', cutLine);
            _this.e = Vector3_1.default.copy(axis).normalize();
            _this.cutLine = Vector3_1.default.copy(cutLine).normalize();
            _this.clockwise = clockwise;
            return _this;
        }
        ArrowBuilder.prototype.toPrimitive = function () {
            var heightShaft = 1 - this.heightCone;
            var back = Vector3_1.default.copy(this.e).neg();
            var neck = Vector3_1.default.copy(this.e).scale(heightShaft).add(this.offset);
            neck.rotate(this.tilt);
            var tail = Vector3_1.default.copy(this.offset);
            tail.rotate(this.tilt);
            var cone = new ConicalShellBuilder_1.default();
            cone.height.copy(this.e).scale(this.heightCone);
            cone.cutLine.copy(this.cutLine).scale(this.radiusCone);
            cone.clockwise = this.clockwise;
            cone.tilt.mul(this.tilt);
            cone.offset.copy(neck);
            cone.sliceAngle = this.sliceAngle;
            cone.thetaSegments = this.thetaSegments;
            cone.useNormal = this.useNormal;
            cone.usePosition = this.usePosition;
            cone.useTextureCoord = this.useTextureCoord;
            var ring = new RingBuilder_1.default();
            ring.e.copy(back);
            ring.cutLine.copy(this.cutLine);
            ring.clockwise = !this.clockwise;
            ring.innerRadius = this.radiusShaft;
            ring.outerRadius = this.radiusCone;
            ring.tilt.mul(this.tilt);
            ring.offset.copy(neck);
            ring.sliceAngle = this.sliceAngle;
            ring.thetaSegments = this.thetaSegments;
            ring.useNormal = this.useNormal;
            ring.usePosition = this.usePosition;
            ring.useTextureCoord = this.useTextureCoord;
            var shaft = new CylindricalShellBuilder_1.default();
            shaft.height.copy(this.e).normalize().scale(heightShaft);
            shaft.cutLine.copy(this.cutLine).normalize().scale(this.radiusShaft);
            shaft.clockwise = this.clockwise;
            shaft.tilt.mul(this.tilt);
            shaft.offset.copy(tail);
            shaft.sliceAngle = this.sliceAngle;
            shaft.thetaSegments = this.thetaSegments;
            shaft.useNormal = this.useNormal;
            shaft.usePosition = this.usePosition;
            shaft.useTextureCoord = this.useTextureCoord;
            var plug = new RingBuilder_1.default();
            plug.e.copy(back);
            plug.cutLine.copy(this.cutLine);
            plug.clockwise = !this.clockwise;
            plug.innerRadius = 0;
            plug.outerRadius = this.radiusShaft;
            plug.tilt.mul(this.tilt);
            plug.offset.copy(tail);
            plug.sliceAngle = this.sliceAngle;
            plug.thetaSegments = this.thetaSegments;
            plug.useNormal = this.useNormal;
            plug.usePosition = this.usePosition;
            plug.useTextureCoord = this.useTextureCoord;
            return reduce_1.default([cone.toPrimitive(), ring.toPrimitive(), shaft.toPrimitive(), plug.toPrimitive()]);
        };
        return ArrowBuilder;
    }(AxialShapeBuilder_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArrowBuilder;
});

define('davinci-eight/geometries/SimplexMode',["require", "exports"], function (require, exports) {
    "use strict";
    (function (SimplexMode) {
        SimplexMode[SimplexMode["EMPTY"] = -1] = "EMPTY";
        SimplexMode[SimplexMode["POINT"] = 0] = "POINT";
        SimplexMode[SimplexMode["LINE"] = 1] = "LINE";
        SimplexMode[SimplexMode["TRIANGLE"] = 2] = "TRIANGLE";
        SimplexMode[SimplexMode["TETRAHEDRON"] = 3] = "TETRAHEDRON";
        SimplexMode[SimplexMode["FIVE_CELL"] = 4] = "FIVE_CELL";
    })(exports.SimplexMode || (exports.SimplexMode = {}));
    var SimplexMode = exports.SimplexMode;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimplexMode;
});

define('davinci-eight/geometries/Simplex',["require", "exports", "../checks/mustBeEQ", "../checks/mustBeGE", "../checks/mustBeLE", "../checks/mustBeInteger", "./SimplexMode", "../atoms/Vertex", "../math/VectorN"], function (require, exports, mustBeEQ_1, mustBeGE_1, mustBeLE_1, mustBeInteger_1, SimplexMode_1, Vertex_1, VectorN_1) {
    "use strict";
    function checkIntegerArg(name, n, min, max) {
        mustBeInteger_1.default(name, n);
        mustBeGE_1.default(name, n, min);
        mustBeLE_1.default(name, n, max);
        return n;
    }
    function checkCountArg(count) {
        return checkIntegerArg('count', count, 0, 7);
    }
    function concatReduce(a, b) {
        return a.concat(b);
    }
    function lerp(a, b, alpha, data) {
        if (data === void 0) { data = []; }
        mustBeEQ_1.default('a.length', a.length, b.length);
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
        return new VectorN_1.VectorN(lerp(a.coords, b.coords, alpha));
    }
    var Simplex = (function () {
        function Simplex(k) {
            this.vertices = [];
            mustBeInteger_1.default('k', k);
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
            if (k === SimplexMode_1.default.TRIANGLE) {
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
            else if (k === SimplexMode_1.default.LINE) {
                var point0 = new Simplex(k - 1);
                point0.vertices[0].attributes = simplex.vertices[0].attributes;
                var point1 = new Simplex(k - 1);
                point1.vertices[0].attributes = simplex.vertices[1].attributes;
                return [point0, point1];
            }
            else if (k === SimplexMode_1.default.POINT) {
                return [new Simplex(k - 1)];
            }
            else if (k === SimplexMode_1.default.EMPTY) {
                return [];
            }
            else {
                throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
            }
        };
        Simplex.subdivideMap = function (simplex) {
            var divs = [];
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === SimplexMode_1.default.TRIANGLE) {
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
            else if (k === SimplexMode_1.default.LINE) {
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
            else if (k === SimplexMode_1.default.POINT) {
                divs.push(simplex);
            }
            else if (k === SimplexMode_1.default.EMPTY) {
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
            for (var attribIndex = 0; attribIndex < attribsLength; attribIndex++) {
                var name_1 = names[attribIndex];
                var values = attributes[name_1];
                var valuesLength = values.length;
                for (var valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
                    simplex.vertices[valueIndex].attributes[name_1] = values[valueIndex];
                }
            }
        };
        return Simplex;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Simplex;
});

define('davinci-eight/geometries/GeometryMode',["require", "exports"], function (require, exports) {
    "use strict";
    (function (GeometryMode) {
        GeometryMode[GeometryMode["POINT"] = 0] = "POINT";
        GeometryMode[GeometryMode["WIRE"] = 1] = "WIRE";
        GeometryMode[GeometryMode["MESH"] = 2] = "MESH";
    })(exports.GeometryMode || (exports.GeometryMode = {}));
    var GeometryMode = exports.GeometryMode;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeometryMode;
});

define('davinci-eight/geometries/arrowPrimitive',["require", "exports", "../shapes/ArrowBuilder", "../checks/isDefined", "../checks/mustBeObject", "../checks/mustBeNumber", "../math/Vector3", "../math/Spinor3"], function (require, exports, ArrowBuilder_1, isDefined_1, mustBeObject_1, mustBeNumber_1, Vector3_1, Spinor3_1) {
    "use strict";
    function arrowPrimitive(options) {
        if (options === void 0) { options = {}; }
        mustBeObject_1.default('options', options);
        var builder = new ArrowBuilder_1.default(Vector3_1.default.vector(0, 1, 0), Vector3_1.default.vector(0, 0, 1), false);
        if (isDefined_1.default(options.radiusCone)) {
            builder.radiusCone = mustBeNumber_1.default("options.radiusCone", options.radiusCone);
        }
        else {
            options.radiusCone = builder.radiusCone;
        }
        builder.stress.copy(isDefined_1.default(options.stress) ? options.stress : Vector3_1.default.vector(1, 1, 1));
        builder.tilt.copySpinor(isDefined_1.default(options.tilt) ? options.tilt : Spinor3_1.default.one());
        builder.offset.copy(isDefined_1.default(options.offset) ? options.offset : Vector3_1.default.zero());
        return builder.toPrimitive();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = arrowPrimitive;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/ArrowGeometry',["require", "exports", "./arrowPrimitive", "../core/GeometryElements", "../checks/mustBeNumber", "../checks/mustBeNonNullObject", "../i18n/notSupported"], function (require, exports, arrowPrimitive_1, GeometryElements_1, mustBeNumber_1, mustBeNonNullObject_1, notSupported_1) {
    "use strict";
    var ArrowGeometry = (function (_super) {
        __extends(ArrowGeometry, _super);
        function ArrowGeometry(contextManager, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeNonNullObject_1.default('contextManager', contextManager), arrowPrimitive_1.default(options), options, levelUp + 1) || this;
            _this._length = 1.0;
            _this._radiusCone = mustBeNumber_1.default("options.radiusCone", options.radiusCone);
            _this._radius = _this._radiusCone;
            _this.setLoggingName('ArrowGeometry');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        ArrowGeometry.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(ArrowGeometry.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (radius) {
                this.setPrincipalScale('radius', radius);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrowGeometry.prototype, "length", {
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
        ArrowGeometry.prototype.getPrincipalScale = function (name) {
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
        ArrowGeometry.prototype.setPrincipalScale = function (name, value) {
            switch (name) {
                case 'length': {
                    this._length = value;
                    break;
                }
                case 'radius': {
                    this._radius = value;
                    break;
                }
                default: {
                    throw new Error(notSupported_1.default("getPrincipalScale('" + name + "')").message);
                }
            }
            this.scaling.setElement(0, 0, this._length);
            this.scaling.setElement(1, 1, this._length);
            this.scaling.setElement(2, 2, this._length);
        };
        return ArrowGeometry;
    }(GeometryElements_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArrowGeometry;
});

define('davinci-eight/geometries/PrimitivesBuilder',["require", "exports", "../math/Spinor3", "../math/Vector3"], function (require, exports, Spinor3_1, Vector3_1) {
    "use strict";
    var PrimitivesBuilder = (function () {
        function PrimitivesBuilder() {
            this.stress = Vector3_1.default.vector(1, 1, 1);
            this.tilt = Spinor3_1.default.one();
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
        PrimitivesBuilder.prototype.toPrimitives = function () {
            console.warn("toPrimitives() must be implemented by derived classes.");
            return [];
        };
        return PrimitivesBuilder;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PrimitivesBuilder;
});

define('davinci-eight/geometries/computeFaceNormals',["require", "exports", "../core/GraphicsProgramSymbols", "../math/Vector3", "../math/wedgeXY", "../math/wedgeYZ", "../math/wedgeZX"], function (require, exports, GraphicsProgramSymbols_1, Vector3_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    "use strict";
    function computeFaceNormals(simplex, positionName, normalName) {
        if (positionName === void 0) { positionName = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION; }
        if (normalName === void 0) { normalName = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL; }
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
        var x = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
        var y = wedgeZX_1.default(ax, ay, az, bx, by, bz);
        var z = wedgeXY_1.default(ax, ay, az, bx, by, bz);
        var normal = new Vector3_1.default([x, y, z]).normalize();
        vertex0[normalName] = normal;
        vertex1[normalName] = normal;
        vertex2[normalName] = normal;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = computeFaceNormals;
});

define('davinci-eight/math/R3',["require", "exports", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (require, exports, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    "use strict";
    function vec(x, y, z) {
        var scale = function (α) {
            return vec(α * x, α * y, α * z);
        };
        var that = {
            get x() {
                return x;
            },
            get y() {
                return y;
            },
            get z() {
                return z;
            },
            add: function (rhs) {
                return vec(x + rhs.x, y + rhs.y, z + rhs.z);
            },
            cross: function (rhs) {
                var yz = wedgeYZ_1.default(x, y, z, rhs.x, rhs.y, rhs.z);
                var zx = wedgeZX_1.default(x, y, z, rhs.x, rhs.y, rhs.z);
                var xy = wedgeXY_1.default(x, y, z, rhs.x, rhs.y, rhs.z);
                return vec(yz, zx, xy);
            },
            direction: function () {
                var magnitude = Math.sqrt(x * x + y * y + z * z);
                return vec(x / magnitude, y / magnitude, z / magnitude);
            },
            scale: scale,
            sub: function (rhs) {
                return vec(x - rhs.x, y - rhs.y, z - rhs.z);
            }
        };
        return that;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vec;
});

define('davinci-eight/collections/copyToArray',["require", "exports"], function (require, exports) {
    "use strict";
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

define('davinci-eight/geometries/dataLength',["require", "exports", "../math/Geometric2", "../math/Geometric3", "../math/Vector2", "../math/Vector3"], function (require, exports, Geometric2_1, Geometric3_1, Vector2_1, Vector3_1) {
    "use strict";
    function dataLength(source) {
        if (source instanceof Geometric3_1.Geometric3) {
            if (source.length !== 8) {
                throw new Error("source.length is expected to be 8");
            }
            return 3;
        }
        else if (source instanceof Geometric2_1.Geometric2) {
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
        else if (source instanceof Vector2_1.Vector2) {
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

define('davinci-eight/geometries/simplicesToGeometryMeta',["require", "exports", "./dataLength", "../checks/expectArg", "../checks/isDefined", "./Simplex"], function (require, exports, dataLength_1, expectArg_1, isDefined_1, Simplex_1) {
    "use strict";
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
    "use strict";
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

define('davinci-eight/geometries/simplicesToPrimitive',["require", "exports", "../collections/copyToArray", "./dataFromVectorN", "../core/DataType", "../atoms/DrawAttribute", "../core/BeginMode", "../atoms/DrawPrimitive", "./simplicesToGeometryMeta", "./computeUniqueVertices", "../checks/expectArg", "./Simplex", "./SimplexMode", "../math/VectorN"], function (require, exports, copyToArray_1, dataFromVectorN_1, DataType_1, DrawAttribute_1, BeginMode_1, DrawPrimitive_1, simplicesToGeometryMeta_1, computeUniqueVertices_1, expectArg_1, Simplex_1, SimplexMode_1, VectorN_1) {
    "use strict";
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
                    value = new VectorN_1.VectorN(numberList(size, 0), false, size);
                }
                var data = dataFromVectorN_1.default(value);
                copyToArray_1.default(data, output.data, i * output.dimensions);
            }
        }
        var attributes = {};
        for (k = 0; k < keysLen; k++) {
            var output = outputs[k];
            var data = output.data;
            attributes[output.name] = new DrawAttribute_1.default(data, output.dimensions, DataType_1.default.FLOAT);
        }
        switch (geometryMeta.k) {
            case SimplexMode_1.default.TRIANGLE: {
                return new DrawPrimitive_1.default(BeginMode_1.default.TRIANGLES, indices, attributes);
            }
            case SimplexMode_1.default.LINE: {
                return new DrawPrimitive_1.default(BeginMode_1.default.LINES, indices, attributes);
            }
            case SimplexMode_1.default.POINT: {
                return new DrawPrimitive_1.default(BeginMode_1.default.POINTS, indices, attributes);
            }
            case SimplexMode_1.default.EMPTY: {
                return new DrawPrimitive_1.default(BeginMode_1.default.POINTS, indices, attributes);
            }
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
define('davinci-eight/geometries/SimplexPrimitivesBuilder',["require", "exports", "../checks/mustBeBoolean", "../checks/mustBeInteger", "../geometries/PrimitivesBuilder", "../geometries/Simplex", "../geometries/SimplexMode", "../core/GraphicsProgramSymbols", "../geometries/simplicesToPrimitive", "../geometries/simplicesToGeometryMeta", "../math/Vector1", "../math/Vector3"], function (require, exports, mustBeBoolean_1, mustBeInteger_1, PrimitivesBuilder_1, Simplex_1, SimplexMode_1, GraphicsProgramSymbols_1, simplicesToPrimitive_1, simplicesToGeometryMeta_1, Vector1_1, Vector3_1) {
    "use strict";
    var SimplexPrimitivesBuilder = (function (_super) {
        __extends(SimplexPrimitivesBuilder, _super);
        function SimplexPrimitivesBuilder() {
            var _this = _super.call(this) || this;
            _this.data = [];
            _this._k = new Vector1_1.default([SimplexMode_1.default.TRIANGLE]);
            _this.curvedSegments = 16;
            _this.flatSegments = 1;
            _this.orientationColors = false;
            _this._k.modified = true;
            return _this;
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
            var simplex = new Simplex_1.default(SimplexMode_1.default.TRIANGLE);
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
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.vector(1, 0, 0);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.vector(0, 1, 0);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.vector(0, 0, 1);
            }
            return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.lineSegment = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(SimplexMode_1.default.LINE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[1];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.vector(1, 0, 0);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.vector(0, 1, 0);
            }
            return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.point = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(SimplexMode_1.default.POINT);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uvs[0];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.vector(1, 0, 0);
            }
            return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.empty = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(SimplexMode_1.default.EMPTY);
            return this.data.push(simplex);
        };
        return SimplexPrimitivesBuilder;
    }(PrimitivesBuilder_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimplexPrimitivesBuilder;
});

define('davinci-eight/geometries/triangle',["require", "exports", "../geometries/computeFaceNormals", "../checks/expectArg", "../geometries/Simplex", "../geometries/SimplexMode", "../core/GraphicsProgramSymbols", "../math/VectorN"], function (require, exports, computeFaceNormals_1, expectArg_1, Simplex_1, SimplexMode_1, GraphicsProgramSymbols_1, VectorN_1) {
    "use strict";
    function triangle(a, b, c, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.VectorN, "a must be a VectorN");
        expectArg_1.default('b', b).toSatisfy(b instanceof VectorN_1.VectorN, "b must be a VectorN");
        expectArg_1.default('c', c).toSatisfy(c instanceof VectorN_1.VectorN, "c must be a VectorN");
        var simplex = new Simplex_1.default(SimplexMode_1.default.TRIANGLE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = a;
        simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = b;
        simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = c;
        computeFaceNormals_1.default(simplex, GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL);
        Simplex_1.default.setAttributeValues(attributes, simplex);
        triangles.push(simplex);
        return triangles;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = triangle;
});

define('davinci-eight/geometries/quadrilateral',["require", "exports", "../checks/expectArg", "../geometries/triangle", "../math/VectorN"], function (require, exports, expectArg_1, triangle_1, VectorN_1) {
    "use strict";
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
    function quadrilateral(a, b, c, d, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.VectorN, "a must be a VectorN");
        expectArg_1.default('b', b).toSatisfy(b instanceof VectorN_1.VectorN, "b must be a VectorN");
        expectArg_1.default('c', c).toSatisfy(c instanceof VectorN_1.VectorN, "c must be a VectorN");
        expectArg_1.default('d', d).toSatisfy(d instanceof VectorN_1.VectorN, "d must be a VectorN");
        var triatts = {};
        setAttributes([1, 2, 0], attributes, triatts);
        triangle_1.default(b, c, a, triatts, triangles);
        setAttributes([3, 0, 2], attributes, triatts);
        triangle_1.default(d, a, c, triatts, triangles);
        return triangles;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadrilateral;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/BoxGeometry',["require", "exports", "../core/GeometryElements", "../i18n/notSupported", "../checks/isDefined", "../checks/mustBeBoolean", "../checks/mustBeNumber", "../atoms/reduce", "./GeometryMode", "../atoms/GridTriangleStrip", "./PrimitivesBuilder", "../core/GraphicsProgramSymbols", "../math/Spinor3", "../math/Vector2", "../geometries/computeFaceNormals", "../math/R3", "../geometries/SimplexPrimitivesBuilder", "../geometries/quadrilateral", "../geometries/Simplex", "../geometries/SimplexMode", "../math/Vector1", "../math/Vector3"], function (require, exports, GeometryElements_1, notSupported_1, isDefined_1, mustBeBoolean_1, mustBeNumber_1, reduce_1, GeometryMode_1, GridTriangleStrip_1, PrimitivesBuilder_1, GraphicsProgramSymbols_1, Spinor3_1, Vector2_1, computeFaceNormals_1, R3_1, SimplexPrimitivesBuilder_1, quadrilateral_1, Simplex_1, SimplexMode_1, Vector1_1, Vector3_1) {
    "use strict";
    var DEFAULT_A = R3_1.default(1, 0, 0);
    var DEFAULT_B = R3_1.default(0, 1, 0);
    var DEFAULT_C = R3_1.default(0, 0, 1);
    var CuboidSimplexPrimitivesBuilder = (function (_super) {
        __extends(CuboidSimplexPrimitivesBuilder, _super);
        function CuboidSimplexPrimitivesBuilder(a, b, c, k, subdivide, boundary) {
            if (k === void 0) { k = SimplexMode_1.default.TRIANGLE; }
            if (subdivide === void 0) { subdivide = 0; }
            if (boundary === void 0) { boundary = 0; }
            var _this = _super.call(this) || this;
            _this._isModified = true;
            _this._a = Vector3_1.default.copy(a);
            _this._b = Vector3_1.default.copy(b);
            _this._c = Vector3_1.default.copy(c);
            _this.k = k;
            _this.subdivide(subdivide);
            _this.boundary(boundary);
            _this.regenerate();
            return _this;
        }
        Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "a", {
            get: function () {
                return this._a;
            },
            set: function (a) {
                this._a = a;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "b", {
            get: function () {
                return this._b;
            },
            set: function (b) {
                this._b = b;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "c", {
            get: function () {
                return this._c;
            },
            set: function (c) {
                this._c = c;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        CuboidSimplexPrimitivesBuilder.prototype.isModified = function () {
            return this._isModified || _super.prototype.isModified.call(this);
        };
        CuboidSimplexPrimitivesBuilder.prototype.setModified = function (modified) {
            this._isModified = modified;
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        CuboidSimplexPrimitivesBuilder.prototype.regenerate = function () {
            var _this = this;
            this.setModified(false);
            var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function (index) { return void 0; });
            pos[0] = new Vector3_1.default().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
            pos[1] = new Vector3_1.default().add(this._a).sub(this._b).add(this._c).divByScalar(2);
            pos[2] = new Vector3_1.default().add(this._a).add(this._b).add(this._c).divByScalar(2);
            pos[3] = new Vector3_1.default().sub(this._a).add(this._b).add(this._c).divByScalar(2);
            pos[4] = new Vector3_1.default().copy(pos[3]).sub(this._c);
            pos[5] = new Vector3_1.default().copy(pos[2]).sub(this._c);
            pos[6] = new Vector3_1.default().copy(pos[1]).sub(this._c);
            pos[7] = new Vector3_1.default().copy(pos[0]).sub(this._c);
            pos.forEach(function (point) {
                point.rotate(_this.tilt);
                point.add(_this.offset);
            });
            function simplex(indices) {
                var simplex = new Simplex_1.default(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = pos[indices[i]];
                    simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_GEOMETRY_INDEX] = new Vector1_1.default([i]);
                }
                return simplex;
            }
            switch (this.k) {
                case SimplexMode_1.default.POINT: {
                    var points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                    this.data = points.map(function (point) { return simplex(point); });
                    break;
                }
                case SimplexMode_1.default.LINE: {
                    var lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                    this.data = lines.map(function (line) { return simplex(line); });
                    break;
                }
                case SimplexMode_1.default.TRIANGLE: {
                    var faces = [0, 1, 2, 3, 4, 5].map(function (index) { return void 0; });
                    faces[0] = quadrilateral_1.default(pos[0], pos[1], pos[2], pos[3]);
                    faces[1] = quadrilateral_1.default(pos[1], pos[6], pos[5], pos[2]);
                    faces[2] = quadrilateral_1.default(pos[7], pos[0], pos[3], pos[4]);
                    faces[3] = quadrilateral_1.default(pos[6], pos[7], pos[4], pos[5]);
                    faces[4] = quadrilateral_1.default(pos[3], pos[2], pos[5], pos[4]);
                    faces[5] = quadrilateral_1.default(pos[7], pos[6], pos[1], pos[0]);
                    this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);
                    this.data.forEach(function (simplex) {
                        computeFaceNormals_1.default(simplex);
                    });
                    break;
                }
                default: {
                }
            }
            this.check();
        };
        return CuboidSimplexPrimitivesBuilder;
    }(SimplexPrimitivesBuilder_1.default));
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
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = new Vector2_1.Vector2([u, v]);
            }
        }
        return side;
    }
    var CuboidPrimitivesBuilder = (function (_super) {
        __extends(CuboidPrimitivesBuilder, _super);
        function CuboidPrimitivesBuilder() {
            var _this = _super.call(this) || this;
            _this.iSegments = 1;
            _this.jSegments = 1;
            _this.kSegments = 1;
            _this.openBack = false;
            _this.openBase = false;
            _this.openFront = false;
            _this.openLeft = false;
            _this.openRight = false;
            _this.openCap = false;
            _this._a = Vector3_1.default.vector(1, 0, 0);
            _this._b = Vector3_1.default.vector(0, 1, 0);
            _this._c = Vector3_1.default.vector(0, 0, 1);
            _this.sides = [];
            return _this;
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
    }(PrimitivesBuilder_1.default));
    function boxPrimitive(options) {
        if (options === void 0) { options = {}; }
        var width = isDefined_1.default(options.width) ? mustBeNumber_1.default('width', options.width) : 1;
        var height = isDefined_1.default(options.height) ? mustBeNumber_1.default('height', options.height) : 1;
        var depth = isDefined_1.default(options.depth) ? mustBeNumber_1.default('depth', options.depth) : 1;
        var mode = isDefined_1.default(options.mode) ? options.mode : GeometryMode_1.default.MESH;
        switch (mode) {
            case GeometryMode_1.default.POINT: {
                var a = DEFAULT_A.scale(width);
                var b = DEFAULT_B.scale(height);
                var c = DEFAULT_C.scale(depth);
                var builder = new CuboidSimplexPrimitivesBuilder(a, b, c, SimplexMode_1.default.POINT);
                if (options.stress) {
                    builder.stress.copy(options.stress);
                }
                if (options.tilt) {
                    builder.tilt.copySpinor(options.tilt);
                }
                if (options.offset) {
                    builder.offset.copy(options.offset);
                }
                return reduce_1.default(builder.toPrimitives());
            }
            case GeometryMode_1.default.WIRE: {
                var a = DEFAULT_A.scale(width);
                var b = DEFAULT_B.scale(height);
                var c = DEFAULT_C.scale(depth);
                var builder = new CuboidSimplexPrimitivesBuilder(a, b, c, SimplexMode_1.default.LINE);
                if (options.stress) {
                    builder.stress.copy(options.stress);
                }
                if (options.tilt) {
                    builder.tilt.copySpinor(options.tilt);
                }
                if (options.offset) {
                    builder.offset.copy(options.offset);
                }
                return reduce_1.default(builder.toPrimitives());
            }
            default: {
                var builder = new CuboidPrimitivesBuilder();
                builder.width = width;
                builder.height = height;
                builder.depth = depth;
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
                if (options.stress) {
                    builder.stress.copy(options.stress);
                }
                if (options.tilt) {
                    builder.tilt.copySpinor(options.tilt);
                }
                if (options.offset) {
                    builder.offset.copy(options.offset);
                }
                return reduce_1.default(builder.toPrimitives());
            }
        }
    }
    var BoxGeometry = (function (_super) {
        __extends(BoxGeometry, _super);
        function BoxGeometry(contextManager, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager, boxPrimitive(options), options, levelUp + 1) || this;
            _this.w = 1;
            _this.h = 1;
            _this.d = 1;
            _this.setLoggingName('BoxGeometry');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        BoxGeometry.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(BoxGeometry.prototype, "width", {
            get: function () {
                return this.w;
            },
            set: function (value) {
                this.w = value;
                this.setScale(this.w, this.h, this.d);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxGeometry.prototype, "height", {
            get: function () {
                return this.h;
            },
            set: function (value) {
                this.h = value;
                this.setScale(this.w, this.h, this.d);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxGeometry.prototype, "depth", {
            get: function () {
                return this.d;
            },
            set: function (value) {
                this.d = value;
                this.setScale(this.w, this.h, this.d);
            },
            enumerable: true,
            configurable: true
        });
        BoxGeometry.prototype.getPrincipalScale = function (name) {
            switch (name) {
                case 'width': {
                    return this.width;
                }
                case 'height': {
                    return this.height;
                }
                case 'depth': {
                    return this.depth;
                }
                default: {
                    throw new Error(notSupported_1.default("getPrincipalScale('" + name + "')").message);
                }
            }
        };
        BoxGeometry.prototype.setPrincipalScale = function (name, value) {
            switch (name) {
                case 'width': {
                    this.width = value;
                    break;
                }
                case 'height': {
                    this.height = value;
                    break;
                }
                case 'depth': {
                    this.depth = value;
                    break;
                }
                default: {
                    throw new Error(notSupported_1.default("setPrincipalScale('" + name + "')").message);
                }
            }
        };
        return BoxGeometry;
    }(GeometryElements_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BoxGeometry;
});

define('davinci-eight/geometries/arc3',["require", "exports", "../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/mustBeNumber", "../math/Spinor3", "../math/Vector3"], function (require, exports, mustBeDefined_1, mustBeInteger_1, mustBeNumber_1, Spinor3_1, Vector3_1) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CylinderGeometry',["require", "exports", "../i18n/notSupported", "../core/GeometryElements", "../checks/isDefined", "../checks/mustBeBoolean", "../checks/mustBeNumber", "../atoms/reduce", "../geometries/arc3", "../geometries/SimplexPrimitivesBuilder", "../math/Spinor3", "../math/Vector2", "../math/Vector3"], function (require, exports, notSupported_1, GeometryElements_1, isDefined_1, mustBeBoolean_1, mustBeNumber_1, reduce_1, arc3_1, SimplexPrimitivesBuilder_1, Spinor3_1, Vector2_1, Vector3_1) {
    "use strict";
    function computeWallVertices(height, radius, clockwise, stress, tilt, offset, angle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs) {
        var halfHeight = Vector3_1.default.copy(height).scale(0.5);
        var stepH = Vector3_1.default.copy(height).scale(1 / heightSegments);
        var iLength = heightSegments + 1;
        for (var i = 0; i < iLength; i++) {
            var dispH = Vector3_1.default.copy(stepH).scale(i).sub(halfHeight);
            var verticesRow = [];
            var uvsRow = [];
            var v = (heightSegments - i) / heightSegments;
            var arcPoints = arc3_1.default(radius, angle, generator, thetaSegments);
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
                uvsRow.push(new Vector2_1.Vector2([u, v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }
    }
    var CylinderBuilder = (function (_super) {
        __extends(CylinderBuilder, _super);
        function CylinderBuilder(height, cutLine, clockwise) {
            var _this = _super.call(this) || this;
            _this.sliceAngle = 2 * Math.PI;
            _this.openBase = false;
            _this.openCap = false;
            _this.openWall = false;
            _this.height = Vector3_1.default.copy(height);
            _this.cutLine = Vector3_1.default.copy(cutLine);
            _this.clockwise = clockwise;
            _this.setModified(true);
            return _this;
        }
        CylinderBuilder.prototype.regenerate = function () {
            this.data = [];
            var heightSegments = this.flatSegments;
            var thetaSegments = this.curvedSegments;
            var generator = Spinor3_1.default.dual(Vector3_1.default.copy(this.height).normalize(), false);
            var heightHalf = 1 / 2;
            var points = [];
            var tangents = [];
            var vertices = [];
            var uvs = [];
            computeWallVertices(this.height, this.cutLine, this.clockwise, this.stress, this.tilt, this.offset, this.sliceAngle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs);
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
                var top_1 = Vector3_1.default.copy(this.height).scale(heightHalf).add(this.offset);
                var tangent = Spinor3_1.default.dual(Vector3_1.default.copy(this.height).normalize(), false).stress(this.stress).rotate(this.tilt);
                var normal = Vector3_1.default.dual(tangent, true);
                points.push(top_1);
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[heightSegments][j + 1];
                    var v2 = points.length - 1;
                    var v3 = vertices[heightSegments][j];
                    var uv1 = uvs[heightSegments][j + 1].clone();
                    var uv2 = new Vector2_1.Vector2([uv1.x, 1]);
                    var uv3 = uvs[heightSegments][j].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3]);
                }
            }
            if (!this.openBase) {
                var bottom = Vector3_1.default.copy(this.height).scale(-heightHalf).add(this.offset);
                var tangent = Spinor3_1.default.dual(Vector3_1.default.copy(this.height).normalize(), false).neg().stress(this.stress).rotate(this.tilt);
                var normal = Vector3_1.default.dual(tangent, true);
                points.push(bottom);
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[0][j];
                    var v2 = points.length - 1;
                    var v3 = vertices[0][j + 1];
                    var uv1 = uvs[0][j].clone();
                    var uv2 = new Vector2_1.Vector2([uv1.x, 1]);
                    var uv3 = uvs[0][j + 1].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3]);
                }
            }
            this.setModified(false);
        };
        return CylinderBuilder;
    }(SimplexPrimitivesBuilder_1.default));
    function tilt(v, options) {
        if (options === void 0) { options = {}; }
        var vector = Vector3_1.default.copy(v);
        if (options.tilt) {
            vector.rotate(options.tilt);
        }
        return vector;
    }
    function cylinderPrimitive(options) {
        if (options === void 0) { options = {}; }
        var radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default('radius', options.radius) : 1;
        var length = isDefined_1.default(options.length) ? mustBeNumber_1.default('length', options.length) : 1;
        var axis = tilt(Vector3_1.default.vector(0, length, 0), options);
        var cutLine = tilt(Vector3_1.default.vector(0, 0, radius), options);
        var builder = new CylinderBuilder(axis, cutLine, false);
        if (isDefined_1.default(options.openBase)) {
            builder.openBase = mustBeBoolean_1.default('openBase', options.openBase);
        }
        if (isDefined_1.default(options.openCap)) {
            builder.openCap = mustBeBoolean_1.default('openCap', options.openCap);
        }
        if (isDefined_1.default(options.openWall)) {
            builder.openWall = mustBeBoolean_1.default('openWall', options.openWall);
        }
        if (options.offset) {
            builder.offset.copy(options.offset);
        }
        return reduce_1.default(builder.toPrimitives());
    }
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry(contextManager, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager, cylinderPrimitive(options), options, levelUp + 1) || this;
            _this._length = 1;
            _this._radius = 1;
            _this.setLoggingName('CylinderGeometry');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        CylinderGeometry.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
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
                case 'length': {
                    this._length = value;
                    break;
                }
                case 'radius': {
                    this._radius = value;
                    break;
                }
                default: {
                    throw new Error(notSupported_1.default("getPrincipalScale('" + name + "')").message);
                }
            }
            this.setScale(this._radius, this._length, this._radius);
        };
        return CylinderGeometry;
    }(GeometryElements_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderGeometry;
});

define('davinci-eight/checks/isLT',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(value, limit) {
        return value < limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/checks/mustBeLT',["require", "exports", "../checks/mustSatisfy", "../checks/isLT"], function (require, exports, mustSatisfy_1, isLT_1) {
    "use strict";
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isLT_1.default(value, limit), function () { return "be less than " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-eight/atoms/numVerticesForCurve',["require", "exports", "../checks/mustBeInteger"], function (require, exports, mustBeInteger_1) {
    "use strict";
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
define('davinci-eight/atoms/CurvePrimitive',["require", "exports", "../checks/mustBeGE", "../checks/mustBeLT", "../checks/mustBeBoolean", "../checks/mustBeInteger", "./numPostsForFence", "./numVerticesForCurve", "../i18n/readOnly", "./VertexPrimitive"], function (require, exports, mustBeGE_1, mustBeLT_1, mustBeBoolean_1, mustBeInteger_1, numPostsForFence_1, numVerticesForCurve_1, readOnly_1, VertexPrimitive_1) {
    "use strict";
    var CurvePrimitive = (function (_super) {
        __extends(CurvePrimitive, _super);
        function CurvePrimitive(mode, uSegments, uClosed) {
            var _this = _super.call(this, mode, numVerticesForCurve_1.default(uSegments), 1) || this;
            mustBeInteger_1.default('uSegments', uSegments);
            mustBeGE_1.default('uSegments', uSegments, 0);
            mustBeBoolean_1.default('uClosed', uClosed);
            _this._uSegments = uSegments;
            _this._uClosed = uClosed;
            var uLength = _this.uLength;
            for (var uIndex = 0; uIndex < uLength; uIndex++) {
                var coords = _this.vertex(uIndex).coords;
                coords.setComponent(0, uIndex);
            }
            return _this;
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
    }(VertexPrimitive_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CurvePrimitive;
});

define('davinci-eight/atoms/elementsForCurve',["require", "exports", "../checks/isDefined", "../checks/mustBeArray", "./numPostsForFence"], function (require, exports, isDefined_1, mustBeArray_1, numPostsForFence_1) {
    "use strict";
    function elementsForCurve(uSegments, uClosed, elements) {
        elements = isDefined_1.default(elements) ? mustBeArray_1.default('elements', elements) : [];
        var uLength = numPostsForFence_1.default(uSegments, uClosed);
        for (var u = 0; u < uLength; u++) {
            elements.push(u);
        }
        return elements;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = elementsForCurve;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/atoms/LineStrip',["require", "exports", "./CurvePrimitive", "../core/BeginMode", "./elementsForCurve", "../checks/mustBeGE", "../checks/mustBeInteger", "../checks/mustBeLT"], function (require, exports, CurvePrimitive_1, BeginMode_1, elementsForCurve_1, mustBeGE_1, mustBeInteger_1, mustBeLT_1) {
    "use strict";
    var LineStrip = (function (_super) {
        __extends(LineStrip, _super);
        function LineStrip(uSegments) {
            var _this = _super.call(this, BeginMode_1.default.LINE_STRIP, uSegments, false) || this;
            _this.elements = elementsForCurve_1.default(uSegments, false);
            return _this;
        }
        LineStrip.prototype.vertex = function (uIndex) {
            mustBeInteger_1.default('uIndex', uIndex);
            mustBeGE_1.default('uIndex', uIndex, 0);
            mustBeLT_1.default('uIndex', uIndex, this.uLength);
            return this.vertices[uIndex];
        };
        return LineStrip;
    }(CurvePrimitive_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LineStrip;
});

define('davinci-eight/geometries/CurveMode',["require", "exports"], function (require, exports) {
    "use strict";
    (function (CurveMode) {
        CurveMode[CurveMode["POINTS"] = 0] = "POINTS";
        CurveMode[CurveMode["LINES"] = 1] = "LINES";
    })(exports.CurveMode || (exports.CurveMode = {}));
    var CurveMode = exports.CurveMode;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CurveMode;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/atoms/LinePoints',["require", "exports", "./CurvePrimitive", "../core/BeginMode", "./elementsForCurve", "../checks/mustBeGE", "../checks/mustBeInteger", "../checks/mustBeLT"], function (require, exports, CurvePrimitive_1, BeginMode_1, elementsForCurve_1, mustBeGE_1, mustBeInteger_1, mustBeLT_1) {
    "use strict";
    var LinePoints = (function (_super) {
        __extends(LinePoints, _super);
        function LinePoints(uSegments) {
            var _this = _super.call(this, BeginMode_1.default.POINTS, uSegments, false) || this;
            _this.elements = elementsForCurve_1.default(uSegments, false);
            return _this;
        }
        LinePoints.prototype.vertex = function (uIndex) {
            mustBeInteger_1.default('uIndex', uIndex);
            mustBeGE_1.default('uIndex', uIndex, 0);
            mustBeLT_1.default('uIndex', uIndex, this.uLength);
            return this.vertices[uIndex];
        };
        return LinePoints;
    }(CurvePrimitive_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LinePoints;
});

define('davinci-eight/checks/isFunction',["require", "exports"], function (require, exports) {
    "use strict";
    function isFunction(x) {
        return (typeof x === 'function');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isFunction;
});

define('davinci-eight/geometries/curvePrimitive',["require", "exports", "../core/Color", "../core/GraphicsProgramSymbols", "../atoms/LineStrip", "./CurveMode", "../atoms/LinePoints", "../checks/isDefined", "../checks/isFunction", "../checks/mustBeNumber", "../math/Vector3"], function (require, exports, Color_1, GraphicsProgramSymbols_1, LineStrip_1, CurveMode_1, LinePoints_1, isDefined_1, isFunction_1, mustBeNumber_1, Vector3_1) {
    "use strict";
    function aPositionDefault(u) {
        return Vector3_1.default.vector(u, 0, 0);
    }
    function topology(mode, uSegments, uClosed) {
        switch (mode) {
            case CurveMode_1.default.POINTS: {
                return new LinePoints_1.default(uSegments);
            }
            case CurveMode_1.default.LINES: {
                return new LineStrip_1.default(uSegments);
            }
            default: {
                throw new Error("mode must be POINTS or LINES");
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
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Color_1.Color.copy(aColor(u));
        }
    }
    function curvePrimitive(options) {
        var uMin = isDefined_1.default(options.uMin) ? mustBeNumber_1.default('uMin', options.uMin) : 0;
        var uMax = isDefined_1.default(options.uMax) ? mustBeNumber_1.default('uMax', options.uMax) : 1;
        var uSegments = isDefined_1.default(options.uSegments) ? options.uSegments : 1;
        var mode = isDefined_1.default(options.mode) ? options.mode : CurveMode_1.default.LINES;
        var curve = topology(mode, uSegments, false);
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
        return curve.toPrimitive();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = curvePrimitive;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CurveGeometry',["require", "exports", "../core/GeometryElements", "./curvePrimitive"], function (require, exports, GeometryElements_1, curvePrimitive_1) {
    "use strict";
    var CurveGeometry = (function (_super) {
        __extends(CurveGeometry, _super);
        function CurveGeometry(contextManager, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager, curvePrimitive_1.default(options), options, levelUp + 1) || this;
            _this.setLoggingName('CurveGeometry');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        CurveGeometry.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return CurveGeometry;
    }(GeometryElements_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CurveGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/atoms/GridLines',["require", "exports", "../core/BeginMode", "./GridPrimitive", "../checks/mustBeInteger", "./numPostsForFence"], function (require, exports, BeginMode_1, GridPrimitive_1, mustBeInteger_1, numPostsForFence_1) {
    "use strict";
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
            var _this = _super.call(this, BeginMode_1.default.LINES, uSegments, vSegments) || this;
            _this.elements = linesForGrid(uSegments, uClosed, vSegments, vClosed);
            var iLength = numPostsForFence_1.default(uSegments, uClosed);
            var jLength = numPostsForFence_1.default(vSegments, vClosed);
            for (var i = 0; i < iLength; i++) {
                for (var j = 0; j < jLength; j++) {
                    var coords = _this.vertex(i, j).coords;
                    coords.setComponent(0, i);
                    coords.setComponent(1, j);
                }
            }
            return _this;
        }
        GridLines.prototype.vertex = function (i, j) {
            mustBeInteger_1.default('i', i);
            mustBeInteger_1.default('j', j);
            return this.vertices[vertexIndex(i, j, this.uLength, this.vLength)];
        };
        return GridLines;
    }(GridPrimitive_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridLines;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/atoms/GridPoints',["require", "exports", "../core/BeginMode", "./GridPrimitive", "../checks/mustBeInteger", "./numPostsForFence"], function (require, exports, BeginMode_1, GridPrimitive_1, mustBeInteger_1, numPostsForFence_1) {
    "use strict";
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
            var _this = _super.call(this, BeginMode_1.default.POINTS, uSegments, vSegments) || this;
            _this.elements = pointsForGrid(uSegments, uClosed, vSegments, vClosed);
            var iLength = numPostsForFence_1.default(uSegments, uClosed);
            var jLength = numPostsForFence_1.default(vSegments, vClosed);
            for (var i = 0; i < iLength; i++) {
                for (var j = 0; j < jLength; j++) {
                    var coords = _this.vertex(i, j).coords;
                    coords.setComponent(0, i);
                    coords.setComponent(1, j);
                }
            }
            return _this;
        }
        GridPoints.prototype.vertex = function (i, j) {
            mustBeInteger_1.default('i', i);
            mustBeInteger_1.default('j', j);
            return this.vertices[vertexIndex(i, j, this.uLength, this.vLength)];
        };
        return GridPoints;
    }(GridPrimitive_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridPoints;
});

define('davinci-eight/geometries/gridPrimitive',["require", "exports", "../core/BeginMode", "../core/Color", "../core/GraphicsProgramSymbols", "../atoms/GridLines", "../atoms/GridPoints", "../atoms/GridTriangleStrip", "../checks/isDefined", "../checks/isFunction", "../checks/mustBeNumber", "../math/Vector3"], function (require, exports, BeginMode_1, Color_1, GraphicsProgramSymbols_1, GridLines_1, GridPoints_1, GridTriangleStrip_1, isDefined_1, isFunction_1, mustBeNumber_1, Vector3_1) {
    "use strict";
    function aPositionDefault(u, v) {
        return Vector3_1.default.vector(u, v, 0);
    }
    function aNormalDefault(u, v) {
        return Vector3_1.default.vector(0, 0, 1);
    }
    function topology(mode, uSegments, uClosed, vSegments, vClosed) {
        switch (mode) {
            case BeginMode_1.default.POINTS: {
                return new GridPoints_1.default(uSegments, uClosed, vSegments, vClosed);
            }
            case BeginMode_1.default.LINES: {
                return new GridLines_1.default(uSegments, uClosed, vSegments, vClosed);
            }
            case BeginMode_1.default.TRIANGLE_STRIP: {
                return new GridTriangleStrip_1.default(uSegments, vSegments);
            }
            default: {
                throw new Error("mode must be POINTS, LINES or TRIANGLE_STRIP");
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
            vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Color_1.Color.copy(aColor(u, v));
        }
    }
    function gridPrimitive(options) {
        var uMin = isDefined_1.default(options.uMin) ? mustBeNumber_1.default('uMin', options.uMin) : 0;
        var uMax = isDefined_1.default(options.uMax) ? mustBeNumber_1.default('uMax', options.uMax) : 1;
        var uSegments = isDefined_1.default(options.uSegments) ? options.uSegments : 1;
        var vMin = isDefined_1.default(options.vMin) ? mustBeNumber_1.default('vMin', options.vMin) : 0;
        var vMax = isDefined_1.default(options.vMax) ? mustBeNumber_1.default('vMax', options.vMax) : 1;
        var vSegments = isDefined_1.default(options.vSegments) ? options.vSegments : 1;
        var mode = isDefined_1.default(options.mode) ? options.mode : BeginMode_1.default.LINES;
        var grid = topology(mode, uSegments, false, vSegments, false);
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
        return grid.toPrimitive();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gridPrimitive;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/GridGeometry',["require", "exports", "../core/GeometryElements", "./gridPrimitive"], function (require, exports, GeometryElements_1, gridPrimitive_1) {
    "use strict";
    var GridGeometry = (function (_super) {
        __extends(GridGeometry, _super);
        function GridGeometry(contextManager, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager, gridPrimitive_1.default(options), options, levelUp + 1) || this;
            _this.setLoggingName('GridGeometry');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        GridGeometry.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return GridGeometry;
    }(GeometryElements_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/SphereGeometry',["require", "exports", "../geometries/arc3", "../math/Geometric3", "../core/GeometryElements", "./GeometryMode", "../checks/isInteger", "../checks/isNumber", "../checks/isUndefined", "../checks/mustBeGE", "../checks/mustBeInteger", "../checks/mustBeNumber", "../i18n/notSupported", "../atoms/reduce", "../math/R3", "../geometries/SimplexPrimitivesBuilder", "./SimplexMode", "../math/Spinor3", "../math/Vector2", "../math/Vector3"], function (require, exports, arc3_1, Geometric3_1, GeometryElements_1, GeometryMode_1, isInteger_1, isNumber_1, isUndefined_1, mustBeGE_1, mustBeInteger_1, mustBeNumber_1, notSupported_1, reduce_1, R3_1, SimplexPrimitivesBuilder_1, SimplexMode_1, Spinor3_1, Vector2_1, Vector3_1) {
    "use strict";
    var DEFAULT_MERIDIAN = R3_1.default(0, 0, 1);
    var DEFAULT_ZENITH = R3_1.default(0, 1, 0);
    var DEFAULT_AZIMUTH_START = 0;
    var DEFAULT_AZIMUTH_LENGTH = 2 * Math.PI;
    var DEFAULT_AZIMUTH_SEGMENTS = 20;
    var DEFAULT_ELEVATION_START = 0;
    var DEFAULT_ELEVATION_LENGTH = Math.PI;
    var DEFAULT_ELEVATION_SEGMENTS = 10;
    var DEFAULT_RADIUS = 1;
    function computeVertices(stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, points, uvs) {
        var generator = Spinor3_1.default.dual(DEFAULT_ZENITH, false);
        var iLength = elevationSegments + 1;
        var jLength = azimuthSegments + 1;
        for (var i = 0; i < iLength; i++) {
            var v = i / elevationSegments;
            var θ = elevationStart + v * elevationLength;
            var arcRadius = Math.sin(θ);
            var R = Geometric3_1.Geometric3.fromSpinor(generator).scale(-azimuthStart / 2).exp();
            var begin = Geometric3_1.Geometric3.fromVector(DEFAULT_MERIDIAN).rotate(R).scale(arcRadius);
            var arcPoints = arc3_1.default(begin, azimuthLength, generator, azimuthSegments);
            var cosθ = Math.cos(θ);
            var displacement = cosθ;
            for (var j = 0; j < jLength; j++) {
                var point = arcPoints[j].add(DEFAULT_ZENITH, displacement).stress(stress).rotate(tilt).add(offset);
                points.push(point);
                var u = j / azimuthSegments;
                uvs.push(new Vector2_1.Vector2([u, 1 - v]));
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
        throw new Error("n must be in the range [0, 3]");
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
                geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3]);
                geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1]);
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
                geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1]);
                geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
                geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
                geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0]);
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
                geometry.point([points[v0]], [n0], [uv0]);
                geometry.point([points[v1]], [n1], [uv1]);
                geometry.point([points[v2]], [n2], [uv2]);
                geometry.point([points[v3]], [n3], [uv3]);
            }
        }
    }
    var SphereBuilder = (function (_super) {
        __extends(SphereBuilder, _super);
        function SphereBuilder() {
            var _this = _super.call(this) || this;
            _this.tilt = Spinor3_1.default.one();
            _this.azimuthStart = DEFAULT_AZIMUTH_START;
            _this.azimuthLength = DEFAULT_AZIMUTH_LENGTH;
            _this.azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;
            _this.elevationStart = DEFAULT_ELEVATION_START;
            _this.elevationLength = DEFAULT_ELEVATION_LENGTH;
            _this.elevationSegments = DEFAULT_ELEVATION_SEGMENTS;
            _this.setModified(true);
            _this.regenerate();
            return _this;
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
        SphereBuilder.prototype.isModified = function () {
            return _super.prototype.isModified.call(this);
        };
        SphereBuilder.prototype.setModified = function (modified) {
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        SphereBuilder.prototype.regenerate = function () {
            this.data = [];
            var points = [];
            var uvs = [];
            computeVertices(this.stress, this.tilt, this.offset, this.azimuthStart, this.azimuthLength, this.azimuthSegments, this.elevationStart, this.elevationLength, this.elevationSegments, points, uvs);
            switch (this.k) {
                case SimplexMode_1.default.EMPTY: {
                    makeTriangles(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                    break;
                }
                case SimplexMode_1.default.POINT: {
                    makePoints(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                    break;
                }
                case SimplexMode_1.default.LINE: {
                    makeLineSegments(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                    break;
                }
                case SimplexMode_1.default.TRIANGLE: {
                    makeTriangles(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                    break;
                }
                default: {
                    console.warn(this.k + "-simplex is not supported for geometry generation.");
                }
            }
            this.setModified(false);
        };
        return SphereBuilder;
    }(SimplexPrimitivesBuilder_1.default));
    function spherePrimitive(options) {
        if (options === void 0) { options = {}; }
        var builder = new SphereBuilder();
        if (isNumber_1.default(options.radius)) {
            builder.radius = options.radius;
        }
        else if (isUndefined_1.default(options.radius)) {
            builder.radius = DEFAULT_RADIUS;
        }
        else {
            mustBeNumber_1.default('radius', options.radius);
        }
        if (isInteger_1.default(options.mode)) {
            switch (options.mode) {
                case GeometryMode_1.default.POINT: {
                    builder.k = SimplexMode_1.default.POINT;
                    break;
                }
                case GeometryMode_1.default.WIRE: {
                    builder.k = SimplexMode_1.default.LINE;
                    break;
                }
                case GeometryMode_1.default.MESH: {
                    builder.k = SimplexMode_1.default.TRIANGLE;
                    break;
                }
                default: {
                    throw new Error("options.mode must be POINT=" + GeometryMode_1.default.POINT + " or WIRE=" + GeometryMode_1.default.WIRE + " or MESH=" + GeometryMode_1.default.MESH + ".");
                }
            }
        }
        else if (isUndefined_1.default(options.mode)) {
            builder.k = SimplexMode_1.default.TRIANGLE;
        }
        else {
            mustBeInteger_1.default('mode', options.mode);
        }
        if (isNumber_1.default(options.azimuthStart)) {
            builder.azimuthStart = options.azimuthStart;
        }
        else if (isUndefined_1.default(options.azimuthStart)) {
            builder.azimuthStart = DEFAULT_AZIMUTH_START;
        }
        else {
            mustBeNumber_1.default('azimuthStart', options.azimuthStart);
        }
        if (isNumber_1.default(options.azimuthLength)) {
            builder.azimuthLength = options.azimuthLength;
        }
        else if (isUndefined_1.default(options.azimuthLength)) {
            builder.azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        }
        else {
            mustBeNumber_1.default('azimuthLength', options.azimuthLength);
        }
        if (isInteger_1.default(options.azimuthSegments)) {
            builder.azimuthSegments = mustBeGE_1.default('azimuthSegements', options.azimuthSegments, 3);
        }
        else if (isUndefined_1.default(options.azimuthSegments)) {
            builder.azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;
        }
        else {
            mustBeInteger_1.default('azimuthSegments', options.azimuthSegments);
        }
        if (isNumber_1.default(options.elevationStart)) {
            builder.elevationStart = options.elevationStart;
        }
        else if (isUndefined_1.default(options.elevationStart)) {
            builder.elevationStart = DEFAULT_ELEVATION_START;
        }
        else {
            mustBeNumber_1.default('elevationStart', options.elevationStart);
        }
        if (isNumber_1.default(options.elevationLength)) {
            builder.elevationLength = options.elevationLength;
        }
        else if (isUndefined_1.default(options.elevationLength)) {
            builder.elevationLength = DEFAULT_ELEVATION_LENGTH;
        }
        else {
            mustBeNumber_1.default('elevationLength', options.elevationLength);
        }
        if (isInteger_1.default(options.elevationSegments)) {
            builder.elevationSegments = mustBeGE_1.default('elevationSegments', options.elevationSegments, 2);
        }
        else if (isUndefined_1.default(options.elevationSegments)) {
            builder.elevationSegments = DEFAULT_ELEVATION_SEGMENTS;
        }
        else {
            mustBeInteger_1.default('elevationSegments', options.elevationSegments);
        }
        if (options.stress) {
            builder.stress.copy(options.stress);
        }
        if (options.tilt) {
            builder.tilt.copy(options.tilt);
        }
        if (options.offset) {
            builder.offset.copy(options.offset);
        }
        return reduce_1.default(builder.toPrimitives());
    }
    var SphereGeometry = (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(contextManager, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager, spherePrimitive(options), options, levelUp + 1) || this;
            _this.setLoggingName('SphereGeometry');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        SphereGeometry.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(SphereGeometry.prototype, "radius", {
            get: function () {
                return this.getScaleX();
            },
            set: function (radius) {
                this.setScale(radius, radius, radius);
            },
            enumerable: true,
            configurable: true
        });
        SphereGeometry.prototype.getPrincipalScale = function (name) {
            switch (name) {
                case 'radius': {
                    return this.getScaleX();
                }
                default: {
                    throw new Error(notSupported_1.default("getPrincipalScale('" + name + "')").message);
                }
            }
        };
        SphereGeometry.prototype.setPrincipalScale = function (name, value) {
            switch (name) {
                case 'radius': {
                    break;
                }
                default: {
                    throw new Error(notSupported_1.default("setPrincipalScale('" + name + "')").message);
                }
            }
            this.setScale(value, value, value);
        };
        return SphereGeometry;
    }(GeometryElements_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SphereGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/PolyhedronBuilder',["require", "exports", "../geometries/SimplexPrimitivesBuilder", "../geometries/Simplex", "../geometries/SimplexMode", "../core/GraphicsProgramSymbols", "../math/Vector2", "../math/Vector3"], function (require, exports, SimplexPrimitivesBuilder_1, Simplex_1, SimplexMode_1, GraphicsProgramSymbols_1, Vector2_1, Vector3_1) {
    "use strict";
    var a = Vector3_1.default.zero();
    var b = Vector3_1.default.zero();
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
        something['uv'] = new Vector2_1.Vector2([u, 1 - v]);
        return vertex;
    }
    function correctUV(uv, vector, azimuth) {
        if ((azimuth < 0) && (uv.x === 1))
            uv = new Vector2_1.Vector2([uv.x - 1, uv.y]);
        if ((vector.x === 0) && (vector.z === 0))
            uv = new Vector2_1.Vector2([azimuth / 2 / Math.PI + 0.5, uv.y]);
        return uv.clone();
    }
    function normal(v1, v2, v3) {
        a.copy(v2).sub(v1);
        b.copy(v3).sub(v2);
        return Vector3_1.default.copy(a).cross(b).normalize();
    }
    var PolyhedronBuilder = (function (_super) {
        __extends(PolyhedronBuilder, _super);
        function PolyhedronBuilder(vertices, indices, radius, detail) {
            if (radius === void 0) { radius = 1; }
            if (detail === void 0) { detail = 0; }
            var _this = _super.call(this) || this;
            var points = [];
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                prepare(new Vector3_1.default([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
            }
            var faces = [];
            for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
                var v1 = points[indices[i]];
                var v2 = points[indices[i + 1]];
                var v3 = points[indices[i + 2]];
                var n = normal(v1, v2, v3);
                var simplex = new Simplex_1.default(SimplexMode_1.default.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v1;
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(n);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v2;
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(n);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v3;
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(n);
                faces[j] = simplex;
            }
            for (var i = 0, facesLength = faces.length; i < facesLength; i++) {
                subdivide(faces[i], detail, points, _this);
            }
            for (var i = 0, verticesLength = points.length; i < verticesLength; i++) {
                points[i].scale(radius);
            }
            _this.mergeVertices();
            function centroid(v1, v2, v3) {
                var x = (v1.x + v2.x + v3.x) / 3;
                var y = (v1.y + v2.y + v3.y) / 3;
                var z = (v1.z + v2.z + v3.z) / 3;
                return { x: x, y: y, z: z };
            }
            function make(v1, v2, v3, builder) {
                var azi = azimuth(centroid(v1, v2, v3));
                var something1 = v1;
                var something2 = v2;
                var something3 = v3;
                var uv1 = correctUV(something1['uv'], v1, azi);
                var uv2 = correctUV(something2['uv'], v2, azi);
                var uv3 = correctUV(something3['uv'], v3, azi);
                var n = normal(v1, v2, v3);
                var simplex = new Simplex_1.default(SimplexMode_1.default.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v1);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(n);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uv1;
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v2);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(n);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS] = uv2;
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v3);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(n);
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
            return _this;
        }
        PolyhedronBuilder.prototype.regenerate = function () {
        };
        return PolyhedronBuilder;
    }(SimplexPrimitivesBuilder_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PolyhedronBuilder;
});

define('davinci-eight/geometries/tetrahedronPrimitive',["require", "exports", "../checks/isDefined", "../checks/mustBeNumber", "../geometries/PolyhedronBuilder", "../atoms/reduce"], function (require, exports, isDefined_1, mustBeNumber_1, PolyhedronBuilder_1, reduce_1) {
    "use strict";
    var vertices = [
        +1, +1, +1, -1, -1, +1, -1, +1, -1, +1, -1, -1
    ];
    var indices = [
        2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
    ];
    function tetrahedronPrimitive(options) {
        if (options === void 0) { options = {}; }
        var radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default('radius', options.radius) : 1.0;
        var builder = new PolyhedronBuilder_1.default(vertices, indices, radius);
        return reduce_1.default(builder.toPrimitives());
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = tetrahedronPrimitive;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/TetrahedronGeometry',["require", "exports", "../core/GeometryElements", "./tetrahedronPrimitive"], function (require, exports, GeometryElements_1, tetrahedronPrimitive_1) {
    "use strict";
    var TetrahedronGeometry = (function (_super) {
        __extends(TetrahedronGeometry, _super);
        function TetrahedronGeometry(contextManager, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager, tetrahedronPrimitive_1.default(options), options, levelUp + 1) || this;
            _this.setLoggingName('TetrahedronGeometry');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        TetrahedronGeometry.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return TetrahedronGeometry;
    }(GeometryElements_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TetrahedronGeometry;
});

define('davinci-eight/core/makeWebGLProgram',["require", "exports", "./makeWebGLShader"], function (require, exports, makeWebGLShader_1) {
    "use strict";
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
define('davinci-eight/materials/ShaderMaterial',["require", "exports", "../core/Attrib", "../core/DataType", "../checks/isDefined", "../checks/isString", "../checks/isNull", "../core/makeWebGLProgram", "../checks/mustBeArray", "../checks/mustBeNonNullObject", "../checks/mustBeString", "../checks/mustBeUndefined", "../i18n/readOnly", "../core/ShareableContextConsumer", "../core/Uniform"], function (require, exports, Attrib_1, DataType_1, isDefined_1, isString_1, isNull_1, makeWebGLProgram_1, mustBeArray_1, mustBeNonNullObject_1, mustBeString_1, mustBeUndefined_1, readOnly_1, ShareableContextConsumer_1, Uniform_1) {
    "use strict";
    var ShaderMaterial = (function (_super) {
        __extends(ShaderMaterial, _super);
        function ShaderMaterial(vertexShaderSrc, fragmentShaderSrc, attribs, contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeNonNullObject_1.default('contextManager', contextManager)) || this;
            _this._attributesByName = {};
            _this._attributesByIndex = [];
            _this._uniforms = {};
            _this.setLoggingName('ShaderMaterial');
            if (isDefined_1.default(vertexShaderSrc) && !isNull_1.default(vertexShaderSrc)) {
                _this._vertexShaderSrc = mustBeString_1.default('vertexShaderSrc', vertexShaderSrc);
            }
            if (isDefined_1.default(fragmentShaderSrc) && !isNull_1.default(fragmentShaderSrc)) {
                _this._fragmentShaderSrc = mustBeString_1.default('fragmentShaderSrc', fragmentShaderSrc);
            }
            _this._attribs = mustBeArray_1.default('attribs', attribs);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        ShaderMaterial.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            mustBeUndefined_1.default(this.getLoggingName(), this._program);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        ShaderMaterial.prototype.contextGain = function () {
            var gl = this.contextManager.gl;
            if (!this._program && isString_1.default(this._vertexShaderSrc) && isString_1.default(this._fragmentShaderSrc)) {
                this._program = makeWebGLProgram_1.default(gl, this._vertexShaderSrc, this._fragmentShaderSrc, this._attribs);
                this._attributesByName = {};
                this._attributesByIndex = [];
                this._uniforms = {};
                var aLen = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
                for (var a = 0; a < aLen; a++) {
                    var attribInfo = gl.getActiveAttrib(this._program, a);
                    var attrib = new Attrib_1.default(attribInfo);
                    this._attributesByName[attribInfo.name] = attrib;
                    this._attributesByIndex.push(attrib);
                }
                var uLen = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
                for (var u = 0; u < uLen; u++) {
                    var uniformInfo = gl.getActiveUniform(this._program, u);
                    this._uniforms[uniformInfo.name] = new Uniform_1.default(uniformInfo);
                }
                for (var aName in this._attributesByName) {
                    if (this._attributesByName.hasOwnProperty(aName)) {
                        this._attributesByName[aName].contextGain(gl, this._program);
                    }
                }
                for (var uName in this._uniforms) {
                    if (this._uniforms.hasOwnProperty(uName)) {
                        this._uniforms[uName].contextGain(gl, this._program);
                    }
                }
            }
            _super.prototype.contextGain.call(this);
        };
        ShaderMaterial.prototype.contextLost = function () {
            this._program = void 0;
            for (var aName in this._attributesByName) {
                if (this._attributesByName.hasOwnProperty(aName)) {
                    this._attributesByName[aName].contextLost();
                }
            }
            for (var uName in this._uniforms) {
                if (this._uniforms.hasOwnProperty(uName)) {
                    this._uniforms[uName].contextLost();
                }
            }
            _super.prototype.contextLost.call(this);
        };
        ShaderMaterial.prototype.contextFree = function () {
            if (this._program) {
                var gl = this.contextManager.gl;
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
            for (var aName in this._attributesByName) {
                if (this._attributesByName.hasOwnProperty(aName)) {
                    this._attributesByName[aName].contextFree();
                }
            }
            for (var uName in this._uniforms) {
                if (this._uniforms.hasOwnProperty(uName)) {
                    this._uniforms[uName].contextFree();
                }
            }
            _super.prototype.contextFree.call(this);
        };
        Object.defineProperty(ShaderMaterial.prototype, "vertexShaderSrc", {
            get: function () {
                return this._vertexShaderSrc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShaderMaterial.prototype, "fragmentShaderSrc", {
            get: function () {
                return this._fragmentShaderSrc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShaderMaterial.prototype, "attributeNames", {
            get: function () {
                var attributes = this._attributesByName;
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
        ShaderMaterial.prototype.enableAttrib = function (indexOrName) {
            if (typeof indexOrName === 'number') {
                if (this.gl) {
                    this.gl.enableVertexAttribArray(indexOrName);
                }
            }
            else if (typeof indexOrName === 'string') {
                var attribLoc = this._attributesByName[indexOrName];
                if (attribLoc) {
                    attribLoc.enable();
                }
            }
            else {
                throw new TypeError("indexOrName must have type number or string.");
            }
        };
        ShaderMaterial.prototype.enableAttribs = function () {
            var attribLocations = this._attributesByName;
            if (attribLocations) {
                var aNames = Object.keys(attribLocations);
                for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                    attribLocations[aNames[i]].enable();
                }
            }
        };
        ShaderMaterial.prototype.disableAttrib = function (indexOrName) {
            if (typeof indexOrName === 'number') {
                if (this.gl) {
                    this.gl.disableVertexAttribArray(indexOrName);
                }
            }
            else if (typeof indexOrName === 'string') {
                var attribLoc = this._attributesByName[indexOrName];
                if (attribLoc) {
                    attribLoc.disable();
                }
            }
            else {
                throw new TypeError("indexOrName must have type number or string.");
            }
        };
        ShaderMaterial.prototype.disableAttribs = function () {
            var attribLocations = this._attributesByName;
            if (attribLocations) {
                var aNames = Object.keys(attribLocations);
                for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                    attribLocations[aNames[i]].disable();
                }
            }
        };
        ShaderMaterial.prototype.attrib = function (name, value, size, normalized, stride, offset) {
            if (normalized === void 0) { normalized = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            var attrib = this.getAttrib(name);
            if (attrib) {
                value.bind();
                attrib.enable();
                attrib.config(size, DataType_1.default.FLOAT, normalized, stride, offset);
            }
            return this;
        };
        ShaderMaterial.prototype.getAttrib = function (indexOrName) {
            if (typeof indexOrName === 'number') {
                return this._attributesByIndex[indexOrName];
            }
            else if (typeof indexOrName === 'string') {
                return this._attributesByName[indexOrName];
            }
            else {
                throw new TypeError("indexOrName must be a number or a string");
            }
        };
        ShaderMaterial.prototype.getAttribLocation = function (name) {
            var attribLoc = this._attributesByName[name];
            if (attribLoc) {
                return attribLoc.index;
            }
            else {
                return -1;
            }
        };
        ShaderMaterial.prototype.getUniform = function (name) {
            var uniforms = this._uniforms;
            if (uniforms[name]) {
                return uniforms[name];
            }
            else {
                return void 0;
            }
        };
        ShaderMaterial.prototype.hasUniform = function (name) {
            mustBeString_1.default('name', name);
            return isDefined_1.default(this._uniforms[name]);
        };
        ShaderMaterial.prototype.activeTexture = function (texture) {
            if (this.gl) {
                this.gl.activeTexture(texture);
            }
        };
        ShaderMaterial.prototype.uniform1i = function (name, x) {
            var uniformLoc = this.getUniform(name);
            if (uniformLoc) {
                uniformLoc.uniform1i(x);
            }
        };
        ShaderMaterial.prototype.uniform1f = function (name, x) {
            var uniformLoc = this.getUniform(name);
            if (uniformLoc) {
                uniformLoc.uniform1f(x);
            }
        };
        ShaderMaterial.prototype.uniform2f = function (name, x, y) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform2f(x, y);
            }
        };
        ShaderMaterial.prototype.uniform3f = function (name, x, y, z) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform3f(x, y, z);
            }
        };
        ShaderMaterial.prototype.uniform4f = function (name, x, y, z, w) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform4f(x, y, z, w);
            }
        };
        ShaderMaterial.prototype.uniform = function (name, value) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                if (typeof value === 'number') {
                    uniformLoc.uniform1f(value);
                }
                else if (value) {
                    switch (value.length) {
                        case 1: {
                            uniformLoc.uniform1f(value[0]);
                            break;
                        }
                        case 2: {
                            uniformLoc.uniform2f(value[0], value[1]);
                            break;
                        }
                        case 3: {
                            uniformLoc.uniform3f(value[0], value[1], value[2]);
                            break;
                        }
                        case 4: {
                            uniformLoc.uniform4f(value[0], value[1], value[2], value[3]);
                            break;
                        }
                    }
                }
            }
            return this;
        };
        ShaderMaterial.prototype.setUniforms = function (visitor) {
        };
        ShaderMaterial.prototype.use = function () {
            var gl = this.gl;
            if (gl) {
                gl.useProgram(this._program);
            }
            else {
                console.warn(this.getLoggingName() + ".use() missing WebGL rendering context.");
            }
            return this;
        };
        ShaderMaterial.prototype.matrix2fv = function (name, matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.matrix2fv(transpose, matrix);
            }
            return this;
        };
        ShaderMaterial.prototype.matrix3fv = function (name, matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.matrix3fv(transpose, matrix);
            }
            return this;
        };
        ShaderMaterial.prototype.matrix4fv = function (name, matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.matrix4fv(transpose, matrix);
            }
            return this;
        };
        ShaderMaterial.prototype.vector2fv = function (name, data) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform2fv(data);
            }
        };
        ShaderMaterial.prototype.vector3fv = function (name, data) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform3fv(data);
            }
        };
        ShaderMaterial.prototype.vector4fv = function (name, data) {
            var uniformLoc = this._uniforms[name];
            if (uniformLoc) {
                uniformLoc.uniform4fv(data);
            }
        };
        ShaderMaterial.prototype.drawArrays = function (mode, first, count) {
            var gl = this.gl;
            if (gl) {
                gl.drawArrays(mode, first, count);
            }
            return this;
        };
        ShaderMaterial.prototype.drawElements = function (mode, count, type, offset) {
            var gl = this.gl;
            if (gl) {
                gl.drawElements(mode, count, type, offset);
            }
            return this;
        };
        return ShaderMaterial;
    }(ShareableContextConsumer_1.ShareableContextConsumer));
    exports.ShaderMaterial = ShaderMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/HTMLScriptsMaterial',["require", "exports", "../checks/isString", "../checks/mustBeArray", "../checks/mustBeObject", "../checks/mustBeString", "../checks/mustSatisfy", "./ShaderMaterial"], function (require, exports, isString_1, mustBeArray_1, mustBeObject_1, mustBeString_1, mustSatisfy_1, ShaderMaterial_1) {
    "use strict";
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
        mustBeArray_1.default('scriptIds', scriptIds);
        mustSatisfy_1.default('scriptIds', scriptIds.length === 2, function () { return 'have two script element identifiers.'; });
        var result = [scriptIds[0], scriptIds[1]];
        assign(scriptIds[0], dom, result);
        assign(scriptIds[1], dom, result);
        return result;
    }
    var HTMLScriptsMaterial = (function (_super) {
        __extends(HTMLScriptsMaterial, _super);
        function HTMLScriptsMaterial(scriptIds, dom, attribs, contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, vertexShaderSrc(detectShaderType(scriptIds, dom)[0], dom), fragmentShaderSrc(detectShaderType(scriptIds, dom)[1], dom), attribs, contextManager, levelUp + 1) || this;
            _this.setLoggingName('HTMLScriptsMaterial');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        HTMLScriptsMaterial.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return HTMLScriptsMaterial;
    }(ShaderMaterial_1.ShaderMaterial));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HTMLScriptsMaterial;
});

define('davinci-eight/core/getAttribVarName',["require", "exports", "../checks/isDefined", "../checks/mustBeObject", "../checks/mustBeString"], function (require, exports, isDefined_1, mustBeObject_1, mustBeString_1) {
    "use strict";
    function getAttribVarName(attribute, varName) {
        mustBeObject_1.default('attribute', attribute);
        mustBeString_1.default('varName', varName);
        return isDefined_1.default(attribute.name) ? mustBeString_1.default('attribute.name', attribute.name) : varName;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getAttribVarName;
});

define('davinci-eight/materials/glslAttribType',["require", "exports", "../core/GraphicsProgramSymbols", "../checks/mustBeInteger", "../checks/mustBeString"], function (require, exports, GraphicsProgramSymbols_1, mustBeInteger_1, mustBeString_1) {
    "use strict";
    function sizeType(size) {
        mustBeInteger_1.default('size', size);
        switch (size) {
            case 1: {
                return 'float';
            }
            case 2: {
                return 'vec2';
            }
            case 3: {
                return 'vec3';
            }
            case 4: {
                return 'vec4';
            }
            default: {
                throw new Error("Can't compute the GLSL attribute type from size " + size);
            }
        }
    }
    function glslAttribType(key, size) {
        mustBeString_1.default('key', key);
        mustBeInteger_1.default('size', size);
        switch (key) {
            case GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR: {
                return sizeType(size);
            }
            default: {
                return sizeType(size);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = glslAttribType;
});

define('davinci-eight/core/getUniformVarName',["require", "exports", "../checks/isDefined", "../checks/expectArg"], function (require, exports, isDefined_1, expectArg_1) {
    "use strict";
    function getUniformVarName(uniform, varName) {
        expectArg_1.default('uniform', uniform).toBeObject();
        expectArg_1.default('varName', varName).toBeString();
        return isDefined_1.default(uniform.name) ? expectArg_1.default('uniform.name', uniform.name).toBeString().value : varName;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getUniformVarName;
});

define('davinci-eight/materials/fragmentShaderSrc',["require", "exports", "../config", "../core/getUniformVarName", "../core/GraphicsProgramSymbols", "../checks/mustBeBoolean", "../checks/mustBeDefined"], function (require, exports, config_1, getUniformVarName_1, GraphicsProgramSymbols_1, mustBeBoolean_1, mustBeDefined_1) {
    "use strict";
    var emitFragmentPrecision = false;
    function getUniformCodeName(uniforms, name) {
        return getUniformVarName_1.default(uniforms[name], name);
    }
    var SPACE = ' ';
    var UNIFORM = 'uniform' + SPACE;
    var SEMICOLON = ';';
    function default_1(attributes, uniforms, vColor, vCoords, vLight) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniforms', uniforms);
        mustBeBoolean_1.default('vColor', vColor);
        mustBeBoolean_1.default('vCoords', vCoords);
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
        if (vCoords) {
            lines.push("varying highp vec2 vCoords;");
        }
        if (vLight) {
            lines.push("varying highp vec3 vLight;");
        }
        for (var uName in uniforms) {
            if (uniforms.hasOwnProperty(uName)) {
                switch (uniforms[uName].glslType) {
                    case 'sampler2D': {
                        lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
                        break;
                    }
                    default: {
                    }
                }
            }
        }
        lines.push("void main(void) {");
        if (vLight) {
            if (vColor) {
                if (vCoords && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_IMAGE]) {
                    lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols_1.default.UNIFORM_IMAGE + ", vCoords) * vec4(vColor.xyz * vLight, vColor.a);");
                }
                else {
                    lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
                }
            }
            else {
                lines.push("  gl_FragColor = vec4(vLight, 1.0);");
            }
        }
        else {
            if (vColor) {
                if (vCoords && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_IMAGE]) {
                    lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols_1.default.UNIFORM_IMAGE + ", vCoords) * vColor;");
                }
                else {
                    lines.push("  gl_FragColor = vColor;");
                }
            }
            else {
                if (vCoords && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_IMAGE]) {
                    lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols_1.default.UNIFORM_IMAGE + ", vCoords);");
                }
                else {
                    lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
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

define('davinci-eight/materials/vertexShaderSrc',["require", "exports", "../config", "../core/getAttribVarName", "../core/getUniformVarName", "../checks/mustBeBoolean", "../checks/mustBeDefined", "../core/GraphicsProgramSymbols"], function (require, exports, config_1, getAttribVarName_1, getUniformVarName_1, mustBeBoolean_1, mustBeDefined_1, GraphicsProgramSymbols_1) {
    "use strict";
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
    function vertexShaderSrc(attributes, uniforms, vColor, vCoords, vLight) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniforms', uniforms);
        mustBeBoolean_1.default('vColor', vColor);
        mustBeBoolean_1.default('vCoords', vCoords);
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
                switch (uniforms[uName].glslType) {
                    case 'sampler2D': {
                        break;
                    }
                    default: {
                        lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
                    }
                }
            }
        }
        if (vColor) {
            lines.push("varying highp vec4 vColor;");
        }
        if (vCoords) {
            lines.push("varying highp vec2 vCoords;");
        }
        if (vLight) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void) {");
        var glPosition = [];
        glPosition.unshift(SEMICOLON);
        if (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION]) {
            switch (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION].glslType) {
                case 'float': {
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
                    break;
                }
                case 'vec2': {
                    glPosition.unshift(RPAREN);
                    glPosition.unshift('1.0');
                    glPosition.unshift(COMMA);
                    glPosition.unshift('0.0');
                    glPosition.unshift(COMMA);
                    glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
                    glPosition.unshift(LPAREN);
                    glPosition.unshift('vec4');
                    break;
                }
                case 'vec3': {
                    glPosition.unshift(RPAREN);
                    glPosition.unshift('1.0');
                    glPosition.unshift(COMMA);
                    glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
                    glPosition.unshift(LPAREN);
                    glPosition.unshift('vec4');
                    break;
                }
                case 'vec4': {
                    glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
                    break;
                }
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
                    case 'vec4': {
                        lines.push("  vColor = " + colorAttribVarName + SEMICOLON);
                        break;
                    }
                    case 'vec3': {
                        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_OPACITY]) {
                            lines.push("  vColor = vec4(" + colorAttribVarName + ", " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_OPACITY) + ");");
                        }
                        else {
                            lines.push("  vColor = vec4(" + colorAttribVarName + ", 1.0);");
                        }
                        break;
                    }
                    default: {
                        throw new Error("Unexpected type for color attribute: " + attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR].glslType);
                    }
                }
            }
            else if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR]) {
                var colorUniformVarName = getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_COLOR);
                switch (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR].glslType) {
                    case 'vec4': {
                        lines.push("  vColor = " + colorUniformVarName + SEMICOLON);
                        break;
                    }
                    case 'vec3': {
                        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_OPACITY]) {
                            lines.push("  vColor = vec4(" + colorUniformVarName + ", " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_OPACITY) + ");");
                        }
                        else {
                            lines.push("  vColor = vec4(" + colorUniformVarName + ", 1.0);");
                        }
                        break;
                    }
                    default: {
                        throw new Error("Unexpected type for color uniform: " + uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR].glslType);
                    }
                }
            }
            else {
                lines.push("  vColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        if (vCoords) {
            lines.push("  vCoords = aCoords;");
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
    exports.default = vertexShaderSrc;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/SmartGraphicsProgram',["require", "exports", "./fragmentShaderSrc", "./ShaderMaterial", "./vertexShaderSrc"], function (require, exports, fragmentShaderSrc_1, ShaderMaterial_1, vertexShaderSrc_1) {
    "use strict";
    var SmartGraphicsProgram = (function (_super) {
        __extends(SmartGraphicsProgram, _super);
        function SmartGraphicsProgram(aParams, uParams, vColor, vCoords, vLight, contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, vertexShaderSrc_1.default(aParams, uParams, vColor, vCoords, vLight), fragmentShaderSrc_1.default(aParams, uParams, vColor, vCoords, vLight), [], contextManager, levelUp + 1) || this;
            _this.setLoggingName('SmartGraphicsProgram');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        SmartGraphicsProgram.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return SmartGraphicsProgram;
    }(ShaderMaterial_1.ShaderMaterial));
    exports.SmartGraphicsProgram = SmartGraphicsProgram;
});

define('davinci-eight/materials/vColorRequired',["require", "exports", "../core/GraphicsProgramSymbols"], function (require, exports, GraphicsProgramSymbols_1) {
    "use strict";
    function vColorRequired(attributes, uniforms) {
        return !!attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vColorRequired;
});

define('davinci-eight/materials/vCoordsRequired',["require", "exports", "../checks/mustBeDefined", "../core/GraphicsProgramSymbols"], function (require, exports, mustBeDefined_1, GraphicsProgramSymbols_1) {
    "use strict";
    function vCoordsRequired(attributes, uniforms) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniforms', uniforms);
        return !!attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COORDS];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vCoordsRequired;
});

define('davinci-eight/materials/vLightRequired',["require", "exports", "../checks/mustBeDefined", "../core/GraphicsProgramSymbols"], function (require, exports, mustBeDefined_1, GraphicsProgramSymbols_1) {
    "use strict";
    function vLightRequired(attributes, uniforms) {
        mustBeDefined_1.default('attributes', attributes);
        mustBeDefined_1.default('uniforms', uniforms);
        return !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = vLightRequired;
});

define('davinci-eight/materials/GraphicsProgramBuilder',["require", "exports", "../core/getAttribVarName", "./glslAttribType", "../checks/mustBeInteger", "../checks/mustBeString", "../materials/SmartGraphicsProgram", "./vColorRequired", "./vCoordsRequired", "./vLightRequired", "./fragmentShaderSrc", "./vertexShaderSrc"], function (require, exports, getAttribVarName_1, glslAttribType_1, mustBeInteger_1, mustBeString_1, SmartGraphicsProgram_1, vColorRequired_1, vCoordsRequired_1, vLightRequired_1, fragmentShaderSrc_1, vertexShaderSrc_1) {
    "use strict";
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
        GraphicsProgramBuilder.prototype.build = function (contextManager) {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vCoords = vCoordsRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return new SmartGraphicsProgram_1.SmartGraphicsProgram(aParams, this.uParams, vColor, vCoords, vLight, contextManager);
        };
        GraphicsProgramBuilder.prototype.vertexShaderSrc = function () {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vCoords = vCoordsRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return vertexShaderSrc_1.default(aParams, this.uParams, vColor, vCoords, vLight);
        };
        GraphicsProgramBuilder.prototype.fragmentShaderSrc = function () {
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired_1.default(aParams, this.uParams);
            var vCoords = vCoordsRequired_1.default(aParams, this.uParams);
            var vLight = vLightRequired_1.default(aParams, this.uParams);
            return fragmentShaderSrc_1.default(aParams, this.uParams, vColor, vCoords, vLight);
        };
        return GraphicsProgramBuilder;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphicsProgramBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/LineMaterial',["require", "exports", "../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../checks/isDefined", "../checks/isNull", "../checks/isUndefined", "./ShaderMaterial", "../checks/mustBeObject"], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, isDefined_1, isNull_1, isUndefined_1, ShaderMaterial_1, mustBeObject_1) {
    "use strict";
    function builder(options) {
        if (isNull_1.default(options) || isUndefined_1.default(options)) {
            options = { attributes: {}, uniforms: {} };
            options.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_OPACITY] = 'float';
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
        function LineMaterial(contextManager, options, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, vertexShaderSrc(options), fragmentShaderSrc(options), [], contextManager, levelUp + 1) || this;
            _this.setLoggingName('LineMaterial');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        LineMaterial.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return LineMaterial;
    }(ShaderMaterial_1.ShaderMaterial));
    exports.LineMaterial = LineMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/MeshMaterial',["require", "exports", "../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../checks/isDefined", "../checks/isNull", "../checks/isUndefined", "./ShaderMaterial", "../checks/mustBeNonNullObject", "../checks/mustBeObject"], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, isDefined_1, isNull_1, isUndefined_1, ShaderMaterial_1, mustBeNonNullObject_1, mustBeObject_1) {
    "use strict";
    function builder(options) {
        if (isUndefined_1.default(options) || isNull_1.default(options)) {
            options = { attributes: {}, uniforms: {} };
            options.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
            options.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = 3;
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_OPACITY] = 'float';
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
        function MeshMaterial(contextManager, options, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, vertexShaderSrc(options), fragmentShaderSrc(options), [], mustBeNonNullObject_1.default('contextManager', contextManager), levelUp + 1) || this;
            _this.setLoggingName('MeshMaterial');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        MeshMaterial.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return MeshMaterial;
    }(ShaderMaterial_1.ShaderMaterial));
    exports.MeshMaterial = MeshMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/PointMaterial',["require", "exports", "../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../checks/isDefined", "../checks/isNull", "../checks/isUndefined", "./ShaderMaterial", "../checks/mustBeObject"], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, isDefined_1, isNull_1, isUndefined_1, ShaderMaterial_1, mustBeObject_1) {
    "use strict";
    function builder(options) {
        if (isNull_1.default(options) || isUndefined_1.default(options)) {
            options = { attributes: {}, uniforms: {} };
            options.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = 3;
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR] = 'vec3';
            options.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_OPACITY] = 'float';
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
        function PointMaterial(contextManager, options, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, vertexShaderSrc(options), fragmentShaderSrc(options), [], contextManager, levelUp + 1) || this;
            _this.setLoggingName('PointMaterial');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        PointMaterial.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return PointMaterial;
    }(ShaderMaterial_1.ShaderMaterial));
    exports.PointMaterial = PointMaterial;
});

define('davinci-eight/math/mathcore',["require", "exports"], function (require, exports) {
    "use strict";
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
define('davinci-eight/math/Vector4',["require", "exports", "../math/Coords"], function (require, exports, Coords_1) {
    "use strict";
    var Vector4 = (function (_super) {
        __extends(Vector4, _super);
        function Vector4(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            return _super.call(this, data, modified, 4) || this;
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
    }(Coords_1.Coords));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector4;
});

define('davinci-eight/utils/getCanvasElementById',["require", "exports", "../checks/mustBeString", "../checks/mustBeObject"], function (require, exports, mustBeString_1, mustBeObject_1) {
    "use strict";
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/NumberShareableMap',["require", "exports", "../core/ShareableBase"], function (require, exports, ShareableBase_1) {
    "use strict";
    var NumberShareableMap = (function (_super) {
        __extends(NumberShareableMap, _super);
        function NumberShareableMap() {
            var _this = _super.call(this) || this;
            _this._elements = {};
            _this.setLoggingName('NumberShareableMap');
            return _this;
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
    }(ShareableBase_1.ShareableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NumberShareableMap;
});

define('davinci-eight/utils/animation',["require", "exports", "../checks/expectArg"], function (require, exports, expectArg_1) {
    "use strict";
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
        var onDocumentKeyDown = function (event) {
            if (event.keyCode === 27) {
                stopSignal = true;
                event.preventDefault();
            }
        };
        var frameRequestCallback;
        var publicAPI = {
            start: function () {
                if (!publicAPI.isRunning) {
                    setUp();
                    $window.document.addEventListener('keydown', onDocumentKeyDown, false);
                    state = STATE_RUNNING;
                    requestID = $window.requestAnimationFrame(frameRequestCallback);
                }
            },
            stop: function () {
                if (publicAPI.isRunning) {
                    stopSignal = true;
                }
            },
            reset: function () {
                if (publicAPI.isPaused) {
                    startTime = void 0;
                    elapsed = 0;
                    state = STATE_INITIAL;
                }
            },
            get time() {
                return elapsed / MILLIS_PER_SECOND;
            },
            lap: function () {
                if (publicAPI.isRunning) {
                }
            },
            get isRunning() {
                return state === STATE_RUNNING;
            },
            get isPaused() {
                return state === STATE_PAUSED;
            }
        };
        frameRequestCallback = function (timestamp) {
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
        return publicAPI;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = animation;
});

define('davinci-eight/visual/direction',["require", "exports", "../math/R3"], function (require, exports, R3_1) {
    "use strict";
    function default_1(options, canonical) {
        if (options.axis) {
            var axis = options.axis;
            return R3_1.default(axis.x, axis.y, axis.z).direction();
        }
        else {
            return R3_1.default(canonical.x, canonical.y, canonical.z);
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
define('davinci-eight/visual/PrincipalScaleMesh',["require", "exports", "../core/Mesh", "../checks/mustBeObject"], function (require, exports, Mesh_1, mustBeObject_1) {
    "use strict";
    var PrincipalScaleMesh = (function (_super) {
        __extends(PrincipalScaleMesh, _super);
        function PrincipalScaleMesh(contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, void 0, void 0, mustBeObject_1.default('contextManager', contextManager), levelUp + 1) || this;
            _this.setLoggingName('PrincipalScaleMesh');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        PrincipalScaleMesh.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        PrincipalScaleMesh.prototype.getPrincipalScale = function (name) {
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
        PrincipalScaleMesh.prototype.setPrincipalScale = function (name, value) {
            var geometry = this.geometry;
            geometry.setPrincipalScale(name, value);
            var scaling = geometry.scaling;
            this.stress.copy(scaling);
            geometry.release();
        };
        return PrincipalScaleMesh;
    }(Mesh_1.Mesh));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PrincipalScaleMesh;
});

define('davinci-eight/visual/mustBeEngine',["require", "exports", "../core/Engine"], function (require, exports, Engine_1) {
    "use strict";
    function mustBeEngine(engine, className) {
        if (engine instanceof Engine_1.Engine) {
            return engine;
        }
        else {
            throw new Error("Expecting Engine in constructor for class " + className + ".");
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeEngine;
});

define('davinci-eight/visual/setColorOption',["require", "exports", "../checks/isDefined"], function (require, exports, isDefined_1) {
    "use strict";
    function setColorOption(mesh, options, defaultColor) {
        if (isDefined_1.default(options.color)) {
            mesh.color.copy(options.color);
        }
        else if (isDefined_1.default(defaultColor)) {
            mesh.color.copy(defaultColor);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = setColorOption;
});

define('davinci-eight/visual/setDeprecatedOptions',["require", "exports", "../checks/isDefined"], function (require, exports, isDefined_1) {
    "use strict";
    var ATTITUDE_NAME = 'attitude';
    var POSITION_NAME = 'position';
    function setDeprecatedOptions(mesh, options) {
        if (isDefined_1.default(options[POSITION_NAME])) {
            console.warn("options." + POSITION_NAME + " is deprecated. Please use the X (position vector) property instead.");
            mesh.X.copyVector(options[POSITION_NAME]);
        }
        if (isDefined_1.default(options[ATTITUDE_NAME])) {
            console.warn("options." + ATTITUDE_NAME + " is deprecated. Please use the R (attitude rotor) property instead.");
            mesh.R.copySpinor(options[ATTITUDE_NAME]);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = setDeprecatedOptions;
});

define('davinci-eight/visual/tiltFromOptions',["require", "exports", "../math/Geometric3"], function (require, exports, Geometric3_1) {
    "use strict";
    function tiltFromOptions(options, canonical) {
        if (options.tilt) {
            return options.tilt;
        }
        else if (options.axis) {
            var axis = options.axis;
            return Geometric3_1.Geometric3.rotorFromDirections(canonical, axis);
        }
        else {
            return Geometric3_1.Geometric3.one();
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = tiltFromOptions;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Arrow',["require", "exports", "../geometries/ArrowGeometry", "../core/Color", "./direction", "../math/Geometric3", "../materials/MeshMaterial", "./PrincipalScaleMesh", "../checks/isGE", "./mustBeEngine", "../math/quadVectorE3", "./setColorOption", "./setDeprecatedOptions", "./tiltFromOptions", "../math/R3"], function (require, exports, ArrowGeometry_1, Color_1, direction_1, Geometric3_1, MeshMaterial_1, PrincipalScaleMesh_1, isGE_1, mustBeEngine_1, quadVectorE3_1, setColorOption_1, setDeprecatedOptions_1, tiltFromOptions_1, R3_1) {
    "use strict";
    var canonicalAxis = R3_1.default(0, 1, 0);
    var zero = R3_1.default(0, 0, 0);
    var Arrow = (function (_super) {
        __extends(Arrow, _super);
        function Arrow(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'Arrow'), levelUp + 1) || this;
            _this.setLoggingName('Arrow');
            _this.direction0 = direction_1.default(options, canonicalAxis);
            _this._vector = Geometric3_1.Geometric3.fromVector(_this.direction0);
            var geoOptions = {};
            geoOptions.offset = zero;
            geoOptions.tilt = tiltFromOptions_1.default(options, canonicalAxis);
            var geometry = new ArrowGeometry_1.default(engine, geoOptions);
            var matOptions = void 0;
            var material = new MeshMaterial_1.MeshMaterial(engine, matOptions);
            _this.geometry = geometry;
            _this.material = material;
            geometry.release();
            material.release();
            if (options.color) {
                _this.color.copy(options.color);
            }
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            setDeprecatedOptions_1.default(_this, options);
            var cascade = true;
            _this.vectorChangeHandler = function (eventName, key, value, vector) {
                if (cascade) {
                    cascade = false;
                    _this.R.rotorFromDirections(_this.direction0, vector);
                    _this.setPrincipalScale('length', Math.sqrt(quadVectorE3_1.default(vector)));
                    cascade = true;
                }
            };
            _this.attitudeChangeHandler = function (eventName, key, value, attitude) {
                if (cascade) {
                    cascade = false;
                    _this._vector.copyVector(_this.direction0).rotate(_this.R).scale(_this.length);
                    cascade = true;
                }
            };
            _this._vector.on('change', _this.vectorChangeHandler);
            _this.R.on('change', _this.attitudeChangeHandler);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Arrow.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            this._vector.off('change', this.vectorChangeHandler);
            this.R.off('change', this.attitudeChangeHandler);
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Arrow.prototype, "length", {
            get: function () {
                return this.getPrincipalScale('length');
            },
            set: function (length) {
                if (isGE_1.default(length, 0)) {
                    this.setPrincipalScale('length', length);
                    var magnitude = Math.sqrt(quadVectorE3_1.default(this._vector));
                    this._vector.scale(length / magnitude);
                }
                else {
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arrow.prototype, "h", {
            get: function () {
                return this._vector;
            },
            set: function (vector) {
                this._vector.copyVector(vector);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arrow.prototype, "axis", {
            get: function () {
                return this._vector;
            },
            set: function (vector) {
                this._vector.copyVector(vector);
            },
            enumerable: true,
            configurable: true
        });
        return Arrow;
    }(PrincipalScaleMesh_1.default));
    exports.Arrow = Arrow;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/RigidBody',["require", "exports", "../math/Geometric3", "./PrincipalScaleMesh", "../checks/mustBeObject"], function (require, exports, Geometric3_1, PrincipalScaleMesh_1, mustBeObject_1) {
    "use strict";
    var RigidBody = (function (_super) {
        __extends(RigidBody, _super);
        function RigidBody(contextManager, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeObject_1.default('contextManager', contextManager), levelUp + 1) || this;
            _this.L = Geometric3_1.Geometric3.zero();
            _this.m = 1;
            _this.P = Geometric3_1.Geometric3.zero();
            _this.Q = Geometric3_1.Geometric3.zero();
            _this.setLoggingName('RigidBody');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        RigidBody.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return RigidBody;
    }(PrincipalScaleMesh_1.default));
    exports.RigidBody = RigidBody;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Basis',["require", "exports", "../core/BeginMode", "../core/Color", "../facets/ColorFacet", "../core/DataType", "../core/GeometryArrays", "./mustBeEngine", "./RigidBody", "./setColorOption", "./setDeprecatedOptions", "../materials/ShaderMaterial", "../math/Vector3", "../facets/Vector3Facet"], function (require, exports, BeginMode_1, Color_1, ColorFacet_1, DataType_1, GeometryArrays_1, mustBeEngine_1, RigidBody_1, setColorOption_1, setDeprecatedOptions_1, ShaderMaterial_1, Vector3_1, Vector3Facet_1) {
    "use strict";
    var uPointA = 'uPointA';
    var uPointB = 'uPointB';
    var uPointC = 'uPointC';
    var uColorA = 'uColorA';
    var uColorB = 'uColorB';
    var uColorC = 'uColorC';
    var vs = [
        "attribute float aPointIndex;",
        "attribute float aColorIndex;",
        "uniform vec3 " + uPointA + ";",
        "uniform vec3 " + uPointB + ";",
        "uniform vec3 " + uPointC + ";",
        "uniform vec3 " + uColorA + ";",
        "uniform vec3 " + uColorB + ";",
        "uniform vec3 " + uColorC + ";",
        "uniform mat4 uModel;",
        "uniform mat4 uProjection;",
        "uniform mat4 uView;",
        "varying highp vec4 vColor;",
        "",
        "void main(void) {",
        "  vec3 aPosition;",
        "  vec3 aColor;",
        "  if (aPointIndex == 0.0) {",
        "    aPosition = vec3(0.0, 0.0, 0.0);",
        "  }",
        "  if (aPointIndex == 1.0) {",
        "    aPosition = " + uPointA + ";",
        "  }",
        "  if (aPointIndex == 2.0) {",
        "    aPosition = " + uPointB + ";",
        "  }",
        "  if (aPointIndex == 3.0) {",
        "    aPosition = " + uPointC + ";",
        "  }",
        "  if (aColorIndex == 1.0) {",
        "    aColor = " + uColorA + ";",
        "  }",
        "  if (aColorIndex == 2.0) {",
        "    aColor = " + uColorB + ";",
        "  }",
        "  if (aColorIndex == 3.0) {",
        "    aColor = " + uColorC + ";",
        "  }",
        "  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);",
        "  vColor = vec4(aColor, 1.0);",
        "}"
    ].join('\n');
    var fs = [
        "precision mediump float;",
        "varying highp vec4 vColor;",
        "",
        "void main(void) {",
        "  gl_FragColor = vColor;",
        "}"
    ].join('\n');
    var Basis = (function (_super) {
        __extends(Basis, _super);
        function Basis(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'Basis'), levelUp + 1) || this;
            _this.uPointA = new Vector3Facet_1.default(uPointA);
            _this.uPointB = new Vector3Facet_1.default(uPointB);
            _this.uPointC = new Vector3Facet_1.default(uPointC);
            _this.uColorA = new ColorFacet_1.ColorFacet(uColorA);
            _this.uColorB = new ColorFacet_1.ColorFacet(uColorB);
            _this.uColorC = new ColorFacet_1.ColorFacet(uColorC);
            _this.setLoggingName("Basis");
            _this.uPointA.vector = Vector3_1.default.vector(1, 0, 0);
            _this.colorA.copy(Color_1.Color.red);
            _this.uPointB.vector = Vector3_1.default.vector(0, 1, 0);
            _this.colorB.copy(Color_1.Color.green);
            _this.uPointC.vector = Vector3_1.default.vector(0, 0, 1);
            _this.colorC.copy(Color_1.Color.blue);
            var primitive = {
                mode: BeginMode_1.default.LINES,
                attributes: {
                    aPointIndex: { values: [0, 1, 0, 2, 0, 3], size: 1, type: DataType_1.default.FLOAT },
                    aColorIndex: { values: [1, 1, 2, 2, 3, 3], size: 1, type: DataType_1.default.FLOAT }
                }
            };
            var geometry = new GeometryArrays_1.default(engine, primitive);
            _this.geometry = geometry;
            geometry.release();
            var material = new ShaderMaterial_1.ShaderMaterial(vs, fs, [], engine);
            _this.material = material;
            material.release();
            _this.setFacet("Basis-" + uPointA, _this.uPointA);
            _this.setFacet("Basis-" + uPointB, _this.uPointB);
            _this.setFacet("Basis-" + uPointC, _this.uPointC);
            _this.setFacet("Basis-" + uColorA, _this.uColorA);
            _this.setFacet("Basis-" + uColorB, _this.uColorB);
            _this.setFacet("Basis-" + uColorC, _this.uColorC);
            setColorOption_1.default(_this, options, void 0);
            setDeprecatedOptions_1.default(_this, options);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Basis.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Basis.prototype, "a", {
            get: function () {
                return this.uPointA.vector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Basis.prototype, "b", {
            get: function () {
                return this.uPointB.vector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Basis.prototype, "c", {
            get: function () {
                return this.uPointC.vector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Basis.prototype, "colorA", {
            get: function () {
                return this.uColorA.color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Basis.prototype, "colorB", {
            get: function () {
                return this.uColorB.color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Basis.prototype, "colorC", {
            get: function () {
                return this.uColorC.color;
            },
            enumerable: true,
            configurable: true
        });
        return Basis;
    }(RigidBody_1.RigidBody));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Basis;
});

define('davinci-eight/visual/geometryModeFromOptions',["require", "exports", "../checks/isDefined", "../checks/mustBeBoolean", "../checks/mustBeInteger", "../geometries/GeometryMode"], function (require, exports, isDefined_1, mustBeBoolean_1, mustBeInteger_1, GeometryMode_1) {
    "use strict";
    function modeFromOptions(options, fallback) {
        if (fallback === void 0) { fallback = GeometryMode_1.default.MESH; }
        if (isDefined_1.default(options)) {
            if (isDefined_1.default(options.mode)) {
                return mustBeInteger_1.default('mode', options.mode);
            }
            else if (isDefined_1.default(options.wireFrame)) {
                return mustBeBoolean_1.default('wireFrame', options.wireFrame) ? GeometryMode_1.default.WIRE : fallback;
            }
            else if (isDefined_1.default(options.k)) {
                var k = mustBeInteger_1.default('k', options.k);
                switch (k) {
                    case 0: return GeometryMode_1.default.POINT;
                    case 1: return GeometryMode_1.default.WIRE;
                    case 2: return GeometryMode_1.default.MESH;
                    default: {
                        throw new Error("k must be 0, 1, or 2");
                    }
                }
            }
            else {
                return fallback;
            }
        }
        else {
            return fallback;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = modeFromOptions;
});

define('davinci-eight/visual/materialFromOptions',["require", "exports", "../materials/LineMaterial", "../materials/MeshMaterial", "../materials/PointMaterial", "../geometries/SimplexMode"], function (require, exports, LineMaterial_1, MeshMaterial_1, PointMaterial_1, SimplexMode_1) {
    "use strict";
    function materialFromOptions(contextManager, simplexMode, options) {
        switch (simplexMode) {
            case SimplexMode_1.default.POINT: {
                var matOptions = void 0;
                return new PointMaterial_1.PointMaterial(contextManager, matOptions);
            }
            case SimplexMode_1.default.LINE: {
                var matOptions = void 0;
                return new LineMaterial_1.LineMaterial(contextManager, matOptions);
            }
            default: {
                var matOptions = void 0;
                return new MeshMaterial_1.MeshMaterial(contextManager, matOptions);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = materialFromOptions;
});

define('davinci-eight/visual/simplexModeFromOptions',["require", "exports", "../checks/isDefined", "../checks/mustBeBoolean", "../checks/mustBeInteger", "../geometries/SimplexMode"], function (require, exports, isDefined_1, mustBeBoolean_1, mustBeInteger_1, SimplexMode_1) {
    "use strict";
    function simplexFromOptions(options, fallback) {
        if (fallback === void 0) { fallback = SimplexMode_1.default.TRIANGLE; }
        if (isDefined_1.default(options)) {
            if (isDefined_1.default(options.mode)) {
                return mustBeInteger_1.default('mode', options.mode);
            }
            else if (isDefined_1.default(options.wireFrame)) {
                return mustBeBoolean_1.default('wireFrame', options.wireFrame) ? SimplexMode_1.default.LINE : fallback;
            }
            else if (isDefined_1.default(options.k)) {
                var k = mustBeInteger_1.default('k', options.k);
                switch (k) {
                    case -1: return SimplexMode_1.default.EMPTY;
                    case 0: return SimplexMode_1.default.POINT;
                    case 1: return SimplexMode_1.default.LINE;
                    case 2: return SimplexMode_1.default.TRIANGLE;
                    default: {
                        throw new Error("k must be -1, 0, 1, or 2");
                    }
                }
            }
            else {
                return fallback;
            }
        }
        else {
            return fallback;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = simplexFromOptions;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Sphere',["require", "exports", "../core/Color", "./direction", "../math/Geometric3", "../checks/isDefined", "./geometryModeFromOptions", "./materialFromOptions", "./mustBeEngine", "../checks/mustBeNumber", "../checks/mustBeObject", "./RigidBody", "./setColorOption", "./setDeprecatedOptions", "./simplexModeFromOptions", "../geometries/SphereGeometry", "./tiltFromOptions", "../math/R3"], function (require, exports, Color_1, direction_1, Geometric3_1, isDefined_1, geometryModeFromOptions_1, materialFromOptions_1, mustBeEngine_1, mustBeNumber_1, mustBeObject_1, RigidBody_1, setColorOption_1, setDeprecatedOptions_1, simplexModeFromOptions_1, SphereGeometry_1, tiltFromOptions_1, R3_1) {
    "use strict";
    var RADIUS_NAME = 'radius';
    var RADIUS_DEFAULT = 1;
    var canonicalAxis = R3_1.default(0, 1, 0);
    var zero = R3_1.default(0, 0, 0);
    var Sphere = (function (_super) {
        __extends(Sphere, _super);
        function Sphere(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'Sphere'), levelUp + 1) || this;
            _this.setLoggingName('Sphere');
            _this.initialAxis = direction_1.default(options, canonicalAxis);
            var geoMode = geometryModeFromOptions_1.default(options);
            var geoOptions = {};
            geoOptions.mode = geoMode;
            geoOptions.azimuthSegments = options.azimuthSegments;
            geoOptions.azimuthStart = options.azimuthStart;
            geoOptions.azimuthLength = options.azimuthLength;
            geoOptions.elevationLength = options.elevationLength;
            geoOptions.elevationSegments = options.elevationSegments;
            geoOptions.elevationStart = options.elevationStart;
            geoOptions.offset = zero;
            geoOptions.stress = void 0;
            geoOptions.tilt = tiltFromOptions_1.default(options, canonicalAxis);
            var geometry = new SphereGeometry_1.default(engine, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            var material = materialFromOptions_1.default(engine, simplexModeFromOptions_1.default(options), options);
            _this.material = material;
            material.release();
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            setDeprecatedOptions_1.default(_this, options);
            if (isDefined_1.default(options.radius)) {
                _this.radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default(RADIUS_NAME, options.radius) : RADIUS_DEFAULT;
            }
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Sphere.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Sphere.prototype, "radius", {
            get: function () {
                return this.getPrincipalScale(RADIUS_NAME);
            },
            set: function (radius) {
                this.setPrincipalScale(RADIUS_NAME, mustBeNumber_1.default(RADIUS_NAME, radius));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sphere.prototype, "axis", {
            get: function () {
                return Geometric3_1.Geometric3.fromVector(this.initialAxis).rotate(this.R);
            },
            set: function (axis) {
                mustBeObject_1.default('axis', axis);
                this.R.rotorFromDirections(this.initialAxis, axis);
            },
            enumerable: true,
            configurable: true
        });
        return Sphere;
    }(RigidBody_1.RigidBody));
    exports.Sphere = Sphere;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Box',["require", "exports", "../geometries/BoxGeometry", "../core/Color", "../checks/isDefined", "./geometryModeFromOptions", "./materialFromOptions", "../checks/mustBeNumber", "./mustBeEngine", "./RigidBody", "./setColorOption", "./setDeprecatedOptions", "./simplexModeFromOptions"], function (require, exports, BoxGeometry_1, Color_1, isDefined_1, geometryModeFromOptions_1, materialFromOptions_1, mustBeNumber_1, mustBeEngine_1, RigidBody_1, setColorOption_1, setDeprecatedOptions_1, simplexModeFromOptions_1) {
    "use strict";
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(engine, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'Box'), 1) || this;
            _this.setLoggingName('Box');
            var geoMode = geometryModeFromOptions_1.default(options);
            var geoOptions = {};
            geoOptions.mode = geoMode;
            geoOptions.tilt = options.tilt;
            geoOptions.openBack = options.openBack;
            geoOptions.openBase = options.openBase;
            geoOptions.openFront = options.openFront;
            geoOptions.openLeft = options.openLeft;
            geoOptions.openRight = options.openRight;
            geoOptions.openCap = options.openCap;
            var geometry = new BoxGeometry_1.default(engine, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            var material = materialFromOptions_1.default(engine, simplexModeFromOptions_1.default(options), options);
            _this.material = material;
            material.release();
            if (options.color) {
                _this.color.copy(options.color);
            }
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            setDeprecatedOptions_1.default(_this, options);
            _this.width = isDefined_1.default(options.width) ? mustBeNumber_1.default('width', options.width) : 1.0;
            _this.height = isDefined_1.default(options.height) ? mustBeNumber_1.default('height', options.height) : 1.0;
            _this.depth = isDefined_1.default(options.depth) ? mustBeNumber_1.default('depth', options.depth) : 1.0;
            _this.synchUp();
            return _this;
        }
        Box.prototype.destructor = function (levelUp) {
            this.cleanUp();
            _super.prototype.destructor.call(this, levelUp + 1);
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
    }(RigidBody_1.RigidBody));
    exports.Box = Box;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Cylinder',["require", "exports", "./direction", "../core/Color", "../geometries/CylinderGeometry", "../math/Geometric3", "../checks/isDefined", "../materials/MeshMaterial", "./mustBeEngine", "../checks/mustBeNumber", "../checks/mustBeObject", "./RigidBody", "./setColorOption", "./setDeprecatedOptions", "./tiltFromOptions", "../math/R3"], function (require, exports, direction_1, Color_1, CylinderGeometry_1, Geometric3_1, isDefined_1, MeshMaterial_1, mustBeEngine_1, mustBeNumber_1, mustBeObject_1, RigidBody_1, setColorOption_1, setDeprecatedOptions_1, tiltFromOptions_1, R3_1) {
    "use strict";
    var canonicalAxis = R3_1.default(0, 1, 0);
    var zero = R3_1.default(0, 0, 0);
    var Cylinder = (function (_super) {
        __extends(Cylinder, _super);
        function Cylinder(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'Cylinder'), levelUp + 1) || this;
            _this.setLoggingName('Cylinder');
            _this.initialAxis = direction_1.default(options, canonicalAxis);
            var geoOptions = {};
            geoOptions.tilt = tiltFromOptions_1.default(options, canonicalAxis);
            geoOptions.offset = zero;
            geoOptions.openCap = options.openCap;
            geoOptions.openBase = options.openBase;
            geoOptions.openWall = options.openWall;
            var geometry = new CylinderGeometry_1.default(engine, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            var matOptions = null;
            var material = new MeshMaterial_1.MeshMaterial(engine, matOptions);
            _this.material = material;
            material.release();
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            setDeprecatedOptions_1.default(_this, options);
            _this.radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default('radius', options.radius) : 0.5;
            _this.length = isDefined_1.default(options.length) ? mustBeNumber_1.default('length', options.length) : 1.0;
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Cylinder.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Cylinder.prototype, "length", {
            get: function () {
                return this.getPrincipalScale('length');
            },
            set: function (length) {
                if (typeof length === 'number') {
                    this.setPrincipalScale('length', length);
                }
                else {
                    throw new Error("length must be a number");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cylinder.prototype, "radius", {
            get: function () {
                return this.getPrincipalScale('radius');
            },
            set: function (radius) {
                if (typeof radius === 'number') {
                    this.setPrincipalScale('radius', radius);
                }
                else {
                    throw new Error("radius must be a number");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cylinder.prototype, "axis", {
            get: function () {
                return Geometric3_1.Geometric3.fromVector(this.initialAxis).rotate(this.R);
            },
            set: function (axis) {
                mustBeObject_1.default('axis', axis);
                this.R.rotorFromDirections(this.initialAxis, axis);
            },
            enumerable: true,
            configurable: true
        });
        return Cylinder;
    }(RigidBody_1.RigidBody));
    exports.Cylinder = Cylinder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Curve',["require", "exports", "../core/GraphicsProgramSymbols", "../core/Color", "../geometries/CurveGeometry", "../geometries/CurveMode", "../checks/isDefined", "../checks/isFunction", "../checks/isNull", "../checks/isUndefined", "../materials/LineMaterial", "../core/Mesh", "./mustBeEngine", "../checks/mustBeGE", "../checks/mustBeNumber", "../materials/PointMaterial", "./setColorOption", "./setDeprecatedOptions", "../math/Vector3"], function (require, exports, GraphicsProgramSymbols_1, Color_1, CurveGeometry_1, CurveMode_1, isDefined_1, isFunction_1, isNull_1, isUndefined_1, LineMaterial_1, Mesh_1, mustBeEngine_1, mustBeGE_1, mustBeNumber_1, PointMaterial_1, setColorOption_1, setDeprecatedOptions_1, Vector3_1) {
    "use strict";
    function aPositionDefault(u) {
        return Vector3_1.default.vector(u, 0, 0);
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
    function configPoints(contextManager, options, curve) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.mode = CurveMode_1.default.POINTS;
        var geometry = new CurveGeometry_1.default(contextManager, geoOptions);
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
        if (isFunction_1.default(options.aOpacity)) {
            matOptions.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_OPACITY] = 1;
        }
        else {
            matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_OPACITY] = 'float';
        }
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX] = 'mat4';
        matOptions.uniforms[GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE] = 'float';
        var material = new PointMaterial_1.PointMaterial(contextManager, matOptions);
        curve.material = material;
        material.release();
    }
    function configLines(contextManager, options, curve) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.mode = CurveMode_1.default.LINES;
        var geometry = new CurveGeometry_1.default(contextManager, geoOptions);
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
        var material = new LineMaterial_1.LineMaterial(contextManager, matOptions);
        curve.material = material;
        material.release();
    }
    var Curve = (function (_super) {
        __extends(Curve, _super);
        function Curve(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, void 0, void 0, mustBeEngine_1.default(engine, 'Curve'), levelUp + 1) || this;
            _this.setLoggingName('Curve');
            var mode = isDefined_1.default(options.mode) ? options.mode : CurveMode_1.default.LINES;
            switch (mode) {
                case CurveMode_1.default.POINTS: {
                    configPoints(engine, options, _this);
                    break;
                }
                case CurveMode_1.default.LINES: {
                    configLines(engine, options, _this);
                    break;
                }
                default: {
                    throw new Error("'" + mode + "' is not a valid option for mode.");
                }
            }
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            setDeprecatedOptions_1.default(_this, options);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Curve.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return Curve;
    }(Mesh_1.Mesh));
    exports.Curve = Curve;
});

define('davinci-eight/checks/expectOptions',["require", "exports", "./mustBeArray"], function (require, exports, mustBeArray_1) {
    "use strict";
    function expectOptions(expects, actuals) {
        mustBeArray_1.default('expects', expects);
        mustBeArray_1.default('actuals', actuals);
        var iLength = actuals.length;
        for (var i = 0; i < iLength; i++) {
            var actual = actuals[i];
            if (expects.indexOf(actual) < 0) {
                throw new Error(actual + " is not one of the expected options: " + JSON.stringify(expects, null, 2) + ".");
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = expectOptions;
});

define('davinci-eight/checks/mustBeFunction',["require", "exports", "../checks/mustSatisfy", "../checks/isFunction"], function (require, exports, mustSatisfy_1, isFunction_1) {
    "use strict";
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

define('davinci-eight/checks/validate',["require", "exports", "./isDefined"], function (require, exports, isDefined_1) {
    "use strict";
    function validate(name, value, defaultValue, assertFn) {
        if (isDefined_1.default(value)) {
            return assertFn(name, value);
        }
        else {
            return defaultValue;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = validate;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Grid',["require", "exports", "../core/BeginMode", "../core/Color", "../checks/expectOptions", "../core/GraphicsProgramSymbols", "../geometries/GridGeometry", "../checks/isDefined", "../checks/isFunction", "../checks/isNull", "../checks/isUndefined", "../materials/LineMaterial", "../core/Mesh", "../materials/MeshMaterial", "./mustBeEngine", "../checks/mustBeGE", "../checks/mustBeFunction", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../materials/PointMaterial", "../math/R3", "./setColorOption", "./setDeprecatedOptions", "../checks/validate"], function (require, exports, BeginMode_1, Color_1, expectOptions_1, GraphicsProgramSymbols_1, GridGeometry_1, isDefined_1, isFunction_1, isNull_1, isUndefined_1, LineMaterial_1, Mesh_1, MeshMaterial_1, mustBeEngine_1, mustBeGE_1, mustBeFunction_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, PointMaterial_1, R3_1, setColorOption_1, setDeprecatedOptions_1, validate_1) {
    "use strict";
    var COORD_MIN_DEFAULT = -1;
    var COORD_MAX_DEFAULT = +1;
    var GRID_SEGMENTS_DEFAULT = 10;
    var GRID_K_DEFAULT = 1;
    var OPTION_CONTEXT_MANAGER = { name: 'contextManager' };
    var OPTION_ENGINE = { name: 'engine' };
    var OPTION_OFFSET = { name: 'offset' };
    var OPTION_TILT = { name: 'tilt' };
    var OPTION_STRESS = { name: 'stress' };
    var OPTION_COLOR = { name: 'color', assertFn: mustBeObject_1.default };
    var OPTION_POSITION_FUNCTION = { name: 'aPosition', assertFn: mustBeFunction_1.default };
    var OPTION_NORMAL_FUNCTION = { name: 'aNormal', assertFn: mustBeFunction_1.default };
    var OPTION_COLOR_FUNCTION = { name: 'aColor', assertFn: mustBeFunction_1.default };
    var OPTION_UMIN = { name: 'uMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber_1.default };
    var OPTION_UMAX = { name: 'uMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber_1.default };
    var OPTION_USEGMENTS = { name: 'uSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger_1.default };
    var OPTION_VMIN = { name: 'vMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber_1.default };
    var OPTION_VMAX = { name: 'vMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber_1.default };
    var OPTION_VSEGMENTS = { name: 'vSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger_1.default };
    var OPTION_K = { name: 'k', defaultValue: 1, assertFn: mustBeInteger_1.default };
    var OPTIONS = [
        OPTION_CONTEXT_MANAGER,
        OPTION_ENGINE,
        OPTION_OFFSET,
        OPTION_TILT,
        OPTION_STRESS,
        OPTION_COLOR,
        OPTION_POSITION_FUNCTION,
        OPTION_NORMAL_FUNCTION,
        OPTION_COLOR_FUNCTION,
        OPTION_UMIN,
        OPTION_UMAX,
        OPTION_USEGMENTS,
        OPTION_VMIN,
        OPTION_VMAX,
        OPTION_VSEGMENTS,
        OPTION_K
    ];
    var OPTION_NAMES = OPTIONS.map(function (option) { return option.name; });
    function aPositionDefault(u, v) {
        return R3_1.default(u, v, 0);
    }
    function aNormalDefault(u, v) {
        return R3_1.default(0, 0, 1);
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
        target.uMin = validate_1.default('uMin', source.uMin, COORD_MIN_DEFAULT, mustBeNumber_1.default);
        target.uMax = validate_1.default('uMax', source.uMax, COORD_MAX_DEFAULT, mustBeNumber_1.default);
        target.uSegments = validate_1.default('uSegments', source.uSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger_1.default);
        mustBeGE_1.default('uSegments', target.uSegments, 0);
        target.vMin = validate_1.default('vMin', source.vMin, COORD_MIN_DEFAULT, mustBeNumber_1.default);
        target.vMax = validate_1.default('vMax', source.vMax, COORD_MAX_DEFAULT, mustBeNumber_1.default);
        target.vSegments = validate_1.default('vSegments', source.vSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger_1.default);
        mustBeGE_1.default('vSegments', target.vSegments, 0);
    }
    function configPoints(contextManager, options, grid) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.mode = BeginMode_1.default.POINTS;
        var geometry = new GridGeometry_1.default(contextManager, geoOptions);
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
        var material = new PointMaterial_1.PointMaterial(contextManager, matOptions);
        grid.material = material;
        material.release();
    }
    function configLines(contextManager, options, grid) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.mode = BeginMode_1.default.LINES;
        var geometry = new GridGeometry_1.default(contextManager, geoOptions);
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
        var material = new LineMaterial_1.LineMaterial(contextManager, matOptions);
        grid.material = material;
        material.release();
    }
    function configMesh(contextManager, options, grid) {
        var geoOptions = {};
        transferGeometryOptions(options, geoOptions);
        geoOptions.mode = BeginMode_1.default.TRIANGLE_STRIP;
        var geometry = new GridGeometry_1.default(contextManager, geoOptions);
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
        var material = new MeshMaterial_1.MeshMaterial(contextManager, matOptions);
        grid.material = material;
        material.release();
    }
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, void 0, void 0, mustBeEngine_1.default(engine, 'Grid'), levelUp + 1) || this;
            _this.setLoggingName('Grid');
            expectOptions_1.default(OPTION_NAMES, Object.keys(options));
            var k = isDefined_1.default(options.k) ? options.k : GRID_K_DEFAULT;
            switch (k) {
                case 0: {
                    configPoints(engine, options, _this);
                    break;
                }
                case 1: {
                    configLines(engine, options, _this);
                    break;
                }
                case 2: {
                    configMesh(engine, options, _this);
                    break;
                }
                default: {
                    throw new Error("'" + k + "' is not a valid option for k.");
                }
            }
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            setDeprecatedOptions_1.default(_this, options);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Grid.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return Grid;
    }(Mesh_1.Mesh));
    exports.Grid = Grid;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/GridXY',["require", "exports", "../checks/expectOptions", "./Grid", "../checks/isDefined", "./mustBeEngine", "../checks/mustBeFunction", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/validate", "../math/R3"], function (require, exports, expectOptions_1, Grid_1, isDefined_1, mustBeEngine_1, mustBeFunction_1, mustBeInteger_1, mustBeNumber_1, validate_1, R3_1) {
    "use strict";
    var ALLOWED_OPTIONS = ['xMin', 'xMax', 'xSegments', 'yMin', 'yMax', 'ySegments', 'z', 'contextManager', 'engine', 'tilt', 'offset', 'k'];
    function mapOptions(options) {
        expectOptions_1.default(ALLOWED_OPTIONS, Object.keys(options));
        var aPosition;
        if (isDefined_1.default(options.z)) {
            mustBeFunction_1.default('z', options.z);
            aPosition = function (x, y) {
                return R3_1.default(x, y, options.z(x, y));
            };
        }
        else {
            aPosition = function (x, y) {
                return R3_1.default(x, y, 0);
            };
        }
        var uMin = validate_1.default('xMin', options.xMin, undefined, mustBeNumber_1.default);
        var uMax = validate_1.default('xMax', options.xMax, undefined, mustBeNumber_1.default);
        var uSegments = validate_1.default('xSegments', options.xSegments, undefined, mustBeInteger_1.default);
        var vMin = validate_1.default('yMin', options.yMin, undefined, mustBeNumber_1.default);
        var vMax = validate_1.default('yMax', options.yMax, undefined, mustBeNumber_1.default);
        var vSegments = validate_1.default('ySegments', options.ySegments, undefined, mustBeInteger_1.default);
        return {
            uMin: uMin,
            uMax: uMax,
            uSegments: uSegments,
            vMin: vMin,
            vMax: vMax,
            vSegments: vSegments,
            aPosition: aPosition,
            k: options.k
        };
    }
    var GridXY = (function (_super) {
        __extends(GridXY, _super);
        function GridXY(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'GridXY'), mapOptions(options), levelUp + 1) || this;
            _this.setLoggingName('GridXY');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        GridXY.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return GridXY;
    }(Grid_1.Grid));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridXY;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/GridYZ',["require", "exports", "../checks/expectOptions", "./Grid", "../checks/isDefined", "./mustBeEngine", "../checks/mustBeFunction", "../checks/mustBeInteger", "../checks/mustBeNumber", "../math/R3", "../checks/validate"], function (require, exports, expectOptions_1, Grid_1, isDefined_1, mustBeEngine_1, mustBeFunction_1, mustBeInteger_1, mustBeNumber_1, R3_1, validate_1) {
    "use strict";
    var ALLOWED_OPTIONS = ['yMin', 'yMax', 'ySegments', 'zMin', 'zMax', 'zSegments', 'x', 'contextManager', 'engine', 'tilt', 'offset', 'k'];
    function mapOptions(options) {
        expectOptions_1.default(ALLOWED_OPTIONS, Object.keys(options));
        var aPosition;
        if (isDefined_1.default(options.x)) {
            mustBeFunction_1.default('x', options.x);
            aPosition = function (y, z) {
                return R3_1.default(options.x(y, z), y, z);
            };
        }
        else {
            aPosition = function (y, z) {
                return R3_1.default(0, y, z);
            };
        }
        var uMin = validate_1.default('yMin', options.yMin, -1, mustBeNumber_1.default);
        var uMax = validate_1.default('yMax', options.yMax, +1, mustBeNumber_1.default);
        var uSegments = validate_1.default('ySegments', options.ySegments, 10, mustBeInteger_1.default);
        var vMin = validate_1.default('zMin', options.zMin, -1, mustBeNumber_1.default);
        var vMax = validate_1.default('zMax', options.zMax, +1, mustBeNumber_1.default);
        var vSegments = validate_1.default('zSegments', options.zSegments, 10, mustBeInteger_1.default);
        return {
            uMin: uMin,
            uMax: uMax,
            uSegments: uSegments,
            vMin: vMin,
            vMax: vMax,
            vSegments: vSegments,
            aPosition: aPosition,
            k: options.k
        };
    }
    var GridYZ = (function (_super) {
        __extends(GridYZ, _super);
        function GridYZ(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'GridYZ'), mapOptions(options), levelUp + 1) || this;
            _this.setLoggingName('GridYZ');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        GridYZ.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return GridYZ;
    }(Grid_1.Grid));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridYZ;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/GridZX',["require", "exports", "../checks/expectOptions", "./Grid", "../checks/isDefined", "./mustBeEngine", "../checks/mustBeFunction", "../checks/mustBeInteger", "../checks/mustBeNumber", "../math/R3", "../checks/validate"], function (require, exports, expectOptions_1, Grid_1, isDefined_1, mustBeEngine_1, mustBeFunction_1, mustBeInteger_1, mustBeNumber_1, R3_1, validate_1) {
    "use strict";
    var ALLOWED_OPTIONS = ['zMin', 'zMax', 'zSegments', 'xMin', 'xMax', 'xSegments', 'y', 'contextManager', 'engine', 'tilt', 'offset', 'k'];
    function mapOptions(options) {
        expectOptions_1.default(ALLOWED_OPTIONS, Object.keys(options));
        var aPosition;
        if (isDefined_1.default(options.y)) {
            mustBeFunction_1.default('y', options.y);
            aPosition = function (z, x) {
                return R3_1.default(x, options.y(z, x), z);
            };
        }
        else {
            aPosition = function (z, x) {
                return R3_1.default(x, 0, z);
            };
        }
        var uMin = validate_1.default('zMin', options.zMin, -1, mustBeNumber_1.default);
        var uMax = validate_1.default('zMax', options.zMax, +1, mustBeNumber_1.default);
        var uSegments = validate_1.default('zSegments', options.zSegments, 10, mustBeInteger_1.default);
        var vMin = validate_1.default('xMin', options.xMin, -1, mustBeNumber_1.default);
        var vMax = validate_1.default('xMax', options.xMax, +1, mustBeNumber_1.default);
        var vSegments = validate_1.default('xSegments', options.xSegments, 10, mustBeInteger_1.default);
        return {
            uMin: uMin,
            uMax: uMax,
            uSegments: uSegments,
            vMin: vMin,
            vMax: vMax,
            vSegments: vSegments,
            aPosition: aPosition,
            k: options.k
        };
    }
    var GridZX = (function (_super) {
        __extends(GridZX, _super);
        function GridZX(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'GridZX'), mapOptions(options), levelUp + 1) || this;
            _this.setLoggingName('GridZX');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        GridZX.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return GridZX;
    }(Grid_1.Grid));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridZX;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Group',["require", "exports", "../math/Geometric3", "../math/Matrix4", "../collections/ShareableArray", "../core/ShareableBase"], function (require, exports, Geometric3_1, Matrix4_1, ShareableArray_1, ShareableBase_1) {
    "use strict";
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group() {
            var _this = _super.call(this) || this;
            _this.X = Geometric3_1.Geometric3.zero();
            _this.R = Geometric3_1.Geometric3.one();
            _this.stress = Matrix4_1.default.one();
            _this.visible = true;
            _this.setLoggingName('Group');
            _this.members = new ShareableArray_1.default([]);
            return _this;
        }
        Group.prototype.destructor = function (levelUp) {
            this.members.release();
            this.members = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Group.prototype, "position", {
            get: function () {
                return this.X;
            },
            set: function (value) {
                if (value) {
                    this.X.copyVector(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "attitude", {
            get: function () {
                return this.R;
            },
            set: function (value) {
                if (value) {
                    this.R.copySpinor(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Group.prototype.add = function (member) {
            this.members.push(member);
        };
        Group.prototype.remove = function (member) {
            var index = this.members.indexOf(member);
            if (index >= 0) {
                var ms = this.members.splice(index, 1);
                ms.release();
            }
            else {
                return void 0;
            }
        };
        Group.prototype.render = function (ambients) {
            var _this = this;
            if (this.visible) {
                this.members.forEach(function (member) {
                    var x = member.X.x;
                    var y = member.X.y;
                    var z = member.X.z;
                    var a = member.R.a;
                    var xy = member.R.xy;
                    var yz = member.R.yz;
                    var zx = member.R.zx;
                    member.X.rotate(_this.R).add(_this.X);
                    member.R.mul2(_this.R, member.R);
                    member.render(ambients);
                    member.X.x = x;
                    member.X.y = y;
                    member.X.z = z;
                    member.R.a = a;
                    member.R.xy = xy;
                    member.R.yz = yz;
                    member.R.zx = zx;
                });
            }
        };
        return Group;
    }(ShareableBase_1.ShareableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Group;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/HollowCylinderGeometry',["require", "exports", "../shapes/CylindricalShellBuilder", "../core/GeometryElements", "../shapes/RingBuilder", "../atoms/reduce", "../math/Vector3"], function (require, exports, CylindricalShellBuilder_1, GeometryElements_1, RingBuilder_1, reduce_1, Vector3_1) {
    "use strict";
    var e2 = Vector3_1.default.vector(0, 1, 0);
    var e3 = Vector3_1.default.vector(0, 0, 1);
    function hollowCylinderPrimitive(options) {
        if (options === void 0) { options = {}; }
        var height = (typeof options.height === 'object') ? Vector3_1.default.copy(options.height) : e2;
        var cutLine = (typeof options.cutLine === 'object') ? Vector3_1.default.copy(options.cutLine).normalize() : e3;
        var outerRadius = (typeof options.outerRadius === 'number') ? options.outerRadius : 1.0;
        var innerRadius = (typeof options.innerRadius === 'number') ? options.innerRadius : 0.5;
        var sliceAngle = (typeof options.sliceAngle === 'number') ? options.sliceAngle : 2 * Math.PI;
        var walls = new CylindricalShellBuilder_1.default();
        walls.height.copy(height);
        walls.cutLine.copy(cutLine).normalize().scale(outerRadius);
        walls.clockwise = true;
        walls.sliceAngle = sliceAngle;
        walls.offset.copy(height).scale(-0.5);
        var outerWalls = walls.toPrimitive();
        walls.cutLine.normalize().scale(innerRadius);
        walls.convex = false;
        var innerWalls = walls.toPrimitive();
        var ring = new RingBuilder_1.default();
        ring.e.copy(height).normalize();
        ring.cutLine.copy(cutLine);
        ring.clockwise = true;
        ring.innerRadius = innerRadius;
        ring.outerRadius = outerRadius;
        ring.sliceAngle = sliceAngle;
        ring.offset.copy(height).scale(0.5);
        var cap = ring.toPrimitive();
        ring.e.scale(-1);
        ring.clockwise = false;
        ring.offset.copy(height).scale(-0.5);
        var base = ring.toPrimitive();
        return reduce_1.default([outerWalls, innerWalls, cap, base]);
    }
    var HollowCylinderGeometry = (function (_super) {
        __extends(HollowCylinderGeometry, _super);
        function HollowCylinderGeometry(contextManager, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, contextManager, hollowCylinderPrimitive(options), levelUp + 1) || this;
            _this.setLoggingName('HollowCylinderGeometry');
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        HollowCylinderGeometry.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return HollowCylinderGeometry;
    }(GeometryElements_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HollowCylinderGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/HollowCylinder',["require", "exports", "../core/Color", "./direction", "../math/Geometric3", "../geometries/HollowCylinderGeometry", "../materials/MeshMaterial", "./mustBeEngine", "../checks/mustBeObject", "./RigidBody", "./setColorOption", "./setDeprecatedOptions"], function (require, exports, Color_1, direction_1, Geometric3_1, HollowCylinderGeometry_1, MeshMaterial_1, mustBeEngine_1, mustBeObject_1, RigidBody_1, setColorOption_1, setDeprecatedOptions_1) {
    "use strict";
    var HollowCylinder = (function (_super) {
        __extends(HollowCylinder, _super);
        function HollowCylinder(engine, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'HollowCylinder'), 1) || this;
            _this.setLoggingName('HollowCylinder');
            _this.initialAxis = direction_1.default(options, { x: 0, y: 1, z: 0 });
            var geometry = new HollowCylinderGeometry_1.default(engine, options);
            _this.geometry = geometry;
            geometry.release();
            var mmo = { attributes: {}, uniforms: {} };
            mmo.attributes['aPosition'] = 3;
            mmo.attributes['aNormal'] = 3;
            mmo.uniforms['uColor'] = 'vec3';
            mmo.uniforms['uOpacity'] = 'float';
            mmo.uniforms['uModel'] = 'mat4';
            mmo.uniforms['uNormal'] = 'mat3';
            mmo.uniforms['uProjection'] = 'mat4';
            mmo.uniforms['uView'] = 'mat4';
            mmo.uniforms['uAmbientLight'] = 'vec3';
            mmo.uniforms['uDirectionalLightColor'] = 'vec3';
            mmo.uniforms['uDirectionalLightDirection'] = 'vec3';
            var material = new MeshMaterial_1.MeshMaterial(engine, mmo);
            _this.material = material;
            material.release();
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            setDeprecatedOptions_1.default(_this, options);
            _this.synchUp();
            return _this;
        }
        HollowCylinder.prototype.destructor = function (levelUp) {
            this.cleanUp();
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(HollowCylinder.prototype, "axis", {
            get: function () {
                return Geometric3_1.Geometric3.fromVector(this.initialAxis).rotate(this.R);
            },
            set: function (axis) {
                mustBeObject_1.default('axis', axis);
                this.R.rotorFromDirections(this.initialAxis, axis);
            },
            enumerable: true,
            configurable: true
        });
        return HollowCylinder;
    }(RigidBody_1.RigidBody));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HollowCylinder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Minecraft',["require", "exports", "../core/BeginMode", "../core/DataType", "../core/GeometryArrays", "../core/ImageTexture", "../checks/isBoolean", "../checks/isNumber", "../core/Mesh", "../materials/ShaderMaterial"], function (require, exports, BeginMode_1, DataType_1, GeometryArrays_1, ImageTexture_1, isBoolean_1, isNumber_1, Mesh_1, ShaderMaterial_1) {
    "use strict";
    var MinecraftPartKind;
    (function (MinecraftPartKind) {
        MinecraftPartKind[MinecraftPartKind["Head"] = 0] = "Head";
        MinecraftPartKind[MinecraftPartKind["Helm"] = 1] = "Helm";
        MinecraftPartKind[MinecraftPartKind["RightLeg"] = 2] = "RightLeg";
        MinecraftPartKind[MinecraftPartKind["Torso"] = 3] = "Torso";
        MinecraftPartKind[MinecraftPartKind["RightArm"] = 4] = "RightArm";
        MinecraftPartKind[MinecraftPartKind["LeftLeg"] = 5] = "LeftLeg";
        MinecraftPartKind[MinecraftPartKind["LeftArm"] = 6] = "LeftArm";
        MinecraftPartKind[MinecraftPartKind["RightLegLayer2"] = 7] = "RightLegLayer2";
        MinecraftPartKind[MinecraftPartKind["TorsoLayer2"] = 8] = "TorsoLayer2";
        MinecraftPartKind[MinecraftPartKind["RightArmLayer2"] = 9] = "RightArmLayer2";
        MinecraftPartKind[MinecraftPartKind["LeftLegLayer2"] = 10] = "LeftLegLayer2";
        MinecraftPartKind[MinecraftPartKind["LeftArmLayer2"] = 11] = "LeftArmLayer2";
    })(MinecraftPartKind || (MinecraftPartKind = {}));
    var MinecraftSide;
    (function (MinecraftSide) {
        MinecraftSide[MinecraftSide["Top"] = 0] = "Top";
        MinecraftSide[MinecraftSide["Bottom"] = 1] = "Bottom";
        MinecraftSide[MinecraftSide["Right"] = 2] = "Right";
        MinecraftSide[MinecraftSide["Front"] = 3] = "Front";
        MinecraftSide[MinecraftSide["Left"] = 4] = "Left";
        MinecraftSide[MinecraftSide["Back"] = 5] = "Back";
    })(MinecraftSide || (MinecraftSide = {}));
    function dimensions(part, height) {
        var LIMB_SIZE = 0.125 * height;
        var HEAD_SIZE = 0.25 * height;
        var TORSO_LENGTH = 0.375 * height;
        switch (part) {
            case MinecraftPartKind.Head: {
                return [HEAD_SIZE, HEAD_SIZE, HEAD_SIZE];
            }
            case MinecraftPartKind.Helm: {
                return [HEAD_SIZE, HEAD_SIZE, HEAD_SIZE];
            }
            case MinecraftPartKind.LeftLeg:
            case MinecraftPartKind.LeftLegLayer2:
            case MinecraftPartKind.RightLeg:
            case MinecraftPartKind.RightLegLayer2: {
                return [LIMB_SIZE, TORSO_LENGTH, LIMB_SIZE];
            }
            case MinecraftPartKind.Torso:
            case MinecraftPartKind.TorsoLayer2: {
                return [HEAD_SIZE, TORSO_LENGTH, LIMB_SIZE];
            }
            case MinecraftPartKind.LeftArm:
            case MinecraftPartKind.LeftArmLayer2:
            case MinecraftPartKind.RightArm:
            case MinecraftPartKind.RightArmLayer2: {
                return [LIMB_SIZE, TORSO_LENGTH, LIMB_SIZE];
            }
            default: {
                throw new Error("part: " + part);
            }
        }
    }
    function textureBounds(part, side, version, oldSkinLayout) {
        switch (part) {
            case MinecraftPartKind.Head: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [8, 0, 16, 8];
                    }
                    case MinecraftSide.Bottom: {
                        if (oldSkinLayout) {
                            return [16, 0, 24, 8];
                        }
                        else {
                            return [24, 8, 16, 0];
                        }
                    }
                    case MinecraftSide.Right: {
                        return [0, 8, 8, 16];
                    }
                    case MinecraftSide.Front: {
                        return [8, 8, 16, 16];
                    }
                    case MinecraftSide.Left: {
                        return [16, 8, 24, 16];
                    }
                    case MinecraftSide.Back: {
                        return [24, 8, 32, 16];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.Helm: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [40, 0, 48, 8];
                    }
                    case MinecraftSide.Bottom: {
                        return [48, 0, 56, 8];
                    }
                    case MinecraftSide.Right: {
                        return [32, 8, 40, 16];
                    }
                    case MinecraftSide.Front: {
                        return [40, 8, 48, 16];
                    }
                    case MinecraftSide.Left: {
                        return [48, 8, 56, 16];
                    }
                    case MinecraftSide.Back: {
                        return [56, 8, 64, 16];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.RightLeg: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [4, 16, 8, 20];
                    }
                    case MinecraftSide.Bottom: {
                        return [8, 16, 12, 20];
                    }
                    case MinecraftSide.Right: {
                        return [0, 20, 4, 32];
                    }
                    case MinecraftSide.Front: {
                        return [4, 20, 8, 32];
                    }
                    case MinecraftSide.Left: {
                        return [8, 20, 12, 32];
                    }
                    case MinecraftSide.Back: {
                        return [12, 20, 16, 32];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.Torso: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [20, 16, 28, 20];
                    }
                    case MinecraftSide.Bottom: {
                        return [28, 16, 36, 20];
                    }
                    case MinecraftSide.Right: {
                        return [16, 20, 20, 32];
                    }
                    case MinecraftSide.Front: {
                        return [20, 20, 28, 32];
                    }
                    case MinecraftSide.Left: {
                        return [28, 20, 32, 32];
                    }
                    case MinecraftSide.Back: {
                        return [32, 20, 40, 32];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.RightArm: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [44, 16, 48, 20];
                    }
                    case MinecraftSide.Bottom: {
                        return [48, 16, 52, 20];
                    }
                    case MinecraftSide.Right: {
                        return [40, 20, 44, 32];
                    }
                    case MinecraftSide.Front: {
                        return [44, 20, 48, 32];
                    }
                    case MinecraftSide.Left: {
                        return [48, 20, 52, 32];
                    }
                    case MinecraftSide.Back: {
                        return [52, 20, 56, 32];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.LeftLeg: {
                if (version > 0) {
                    switch (side) {
                        case MinecraftSide.Top: {
                            return [20, 48, 24, 52];
                        }
                        case MinecraftSide.Bottom: {
                            return [24, 48, 28, 52];
                        }
                        case MinecraftSide.Right: {
                            return [16, 52, 20, 64];
                        }
                        case MinecraftSide.Front: {
                            return [20, 52, 24, 64];
                        }
                        case MinecraftSide.Left: {
                            return [24, 52, 28, 64];
                        }
                        case MinecraftSide.Back: {
                            return [28, 52, 32, 64];
                        }
                        default: {
                            throw new Error("" + side);
                        }
                    }
                }
                else {
                    switch (side) {
                        case MinecraftSide.Top: {
                            return [8, 16, 4, 20];
                        }
                        case MinecraftSide.Bottom: {
                            return [12, 16, 8, 20];
                        }
                        case MinecraftSide.Right: {
                            return [12, 20, 8, 32];
                        }
                        case MinecraftSide.Front: {
                            return [8, 20, 4, 32];
                        }
                        case MinecraftSide.Left: {
                            return [4, 20, 0, 32];
                        }
                        case MinecraftSide.Back: {
                            return [16, 20, 12, 32];
                        }
                        default: {
                            throw new Error("" + side);
                        }
                    }
                }
            }
            case MinecraftPartKind.LeftArm: {
                if (version > 0) {
                    switch (side) {
                        case MinecraftSide.Top: {
                            return [36, 48, 40, 52];
                        }
                        case MinecraftSide.Bottom: {
                            return [40, 48, 44, 52];
                        }
                        case MinecraftSide.Right: {
                            return [32, 52, 36, 64];
                        }
                        case MinecraftSide.Front: {
                            return [36, 52, 40, 64];
                        }
                        case MinecraftSide.Left: {
                            return [40, 52, 44, 64];
                        }
                        case MinecraftSide.Back: {
                            return [44, 52, 48, 64];
                        }
                        default: {
                            throw new Error("" + side);
                        }
                    }
                }
                else {
                    switch (side) {
                        case MinecraftSide.Top: {
                            return [48, 16, 44, 20];
                        }
                        case MinecraftSide.Bottom: {
                            return [52, 16, 48, 20];
                        }
                        case MinecraftSide.Right: {
                            return [52, 20, 48, 32];
                        }
                        case MinecraftSide.Front: {
                            return [48, 20, 44, 32];
                        }
                        case MinecraftSide.Left: {
                            return [44, 20, 40, 32];
                        }
                        case MinecraftSide.Back: {
                            return [56, 20, 52, 32];
                        }
                        default: {
                            throw new Error("" + side);
                        }
                    }
                }
            }
            case MinecraftPartKind.RightLegLayer2: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [4, 48, 8, 36];
                    }
                    case MinecraftSide.Bottom: {
                        return [8, 48, 12, 36];
                    }
                    case MinecraftSide.Right: {
                        return [0, 36, 4, 48];
                    }
                    case MinecraftSide.Front: {
                        return [4, 36, 8, 48];
                    }
                    case MinecraftSide.Left: {
                        return [8, 36, 12, 48];
                    }
                    case MinecraftSide.Back: {
                        return [12, 36, 16, 48];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.TorsoLayer2: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [20, 48, 28, 36];
                    }
                    case MinecraftSide.Bottom: {
                        return [28, 48, 36, 36];
                    }
                    case MinecraftSide.Right: {
                        return [16, 36, 20, 48];
                    }
                    case MinecraftSide.Front: {
                        return [20, 36, 28, 48];
                    }
                    case MinecraftSide.Left: {
                        return [28, 36, 32, 48];
                    }
                    case MinecraftSide.Back: {
                        return [32, 36, 40, 48];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.RightArmLayer2: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [44, 48, 48, 36];
                    }
                    case MinecraftSide.Bottom: {
                        return [48, 48, 52, 36];
                    }
                    case MinecraftSide.Right: {
                        return [40, 36, 44, 48];
                    }
                    case MinecraftSide.Front: {
                        return [44, 36, 48, 48];
                    }
                    case MinecraftSide.Left: {
                        return [48, 36, 52, 48];
                    }
                    case MinecraftSide.Back: {
                        return [52, 36, 64, 48];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.LeftLegLayer2: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [4, 48, 8, 52];
                    }
                    case MinecraftSide.Bottom: {
                        return [8, 48, 12, 52];
                    }
                    case MinecraftSide.Right: {
                        return [0, 52, 4, 64];
                    }
                    case MinecraftSide.Front: {
                        return [4, 52, 8, 64];
                    }
                    case MinecraftSide.Left: {
                        return [8, 52, 12, 64];
                    }
                    case MinecraftSide.Back: {
                        return [12, 52, 16, 64];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            case MinecraftPartKind.LeftArmLayer2: {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [52, 48, 56, 52];
                    }
                    case MinecraftSide.Bottom: {
                        return [56, 48, 60, 52];
                    }
                    case MinecraftSide.Right: {
                        return [48, 52, 52, 64];
                    }
                    case MinecraftSide.Front: {
                        return [52, 52, 56, 64];
                    }
                    case MinecraftSide.Left: {
                        return [56, 52, 60, 64];
                    }
                    case MinecraftSide.Back: {
                        return [60, 52, 64, 64];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            default: {
                throw new Error("part: " + part);
            }
        }
    }
    function aCoords(part, side, width, height, oldSkinLayout) {
        var cs = textureBounds(part, side, version(width, height), oldSkinLayout);
        var x1 = cs[0] / width;
        var y1 = cs[1] / height;
        var x2 = cs[2] / width;
        var y2 = cs[3] / height;
        return [x1, y2, x2, y2, x1, y1, x2, y2, x2, y1, x1, y1];
    }
    function version(width, height) {
        if (width === 2 * height) {
            return 0;
        }
        else if (width === height) {
            return 1.8;
        }
        else {
            return 0;
        }
    }
    function primitiveFromOptions(texture, options) {
        var partKind = options.partKind;
        var offset = options.offset ? options.offset : { x: 0, y: 0, z: 0 };
        var dims = dimensions(partKind, options.height);
        var positions = [
            [-0.5, -0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, +0.5, +0.5],
            [+0.5, -0.5, +0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5],
            [+0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, +0.5, -0.5],
            [-0.5, -0.5, -0.5], [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5],
            [+0.5, -0.5, +0.5], [+0.5, -0.5, -0.5], [+0.5, +0.5, +0.5],
            [+0.5, -0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5],
            [-0.5, -0.5, -0.5], [-0.5, -0.5, +0.5], [-0.5, +0.5, -0.5],
            [-0.5, -0.5, +0.5], [-0.5, +0.5, +0.5], [-0.5, +0.5, -0.5],
            [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, -0.5],
            [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5],
            [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [-0.5, -0.5, +0.5],
            [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5]
        ]
            .map(function (xs) { return [dims[0] * xs[0], dims[1] * xs[1], dims[2] * xs[2]]; })
            .map(function (xs) { return [xs[0] + offset.x, xs[1] + offset.y, xs[2] + offset.z]; })
            .reduce(function (a, b) { return a.concat(b); });
        var naturalWidth = texture instanceof ImageTexture_1.default ? texture.naturalWidth : 64;
        var naturalHeight = texture instanceof ImageTexture_1.default ? texture.naturalHeight : 64;
        var naturalScale = 64 / naturalWidth;
        var width = naturalWidth * naturalScale;
        var height = naturalHeight * naturalScale;
        var oldSkinLayout = options.oldSkinLayout;
        var coords = [
            aCoords(partKind, MinecraftSide.Front, width, height, oldSkinLayout),
            aCoords(partKind, MinecraftSide.Back, width, height, oldSkinLayout),
            aCoords(partKind, MinecraftSide.Left, width, height, oldSkinLayout),
            aCoords(partKind, MinecraftSide.Right, width, height, oldSkinLayout),
            aCoords(partKind, MinecraftSide.Top, width, height, oldSkinLayout),
            aCoords(partKind, MinecraftSide.Bottom, width, height, oldSkinLayout)
        ].reduce(function (a, b) { return a.concat(b); });
        var primitive = {
            mode: BeginMode_1.default.TRIANGLES,
            attributes: {
                aPosition: { values: positions, size: 3, type: DataType_1.default.FLOAT },
                aCoords: { values: coords, size: 2, type: DataType_1.default.FLOAT }
            }
        };
        return primitive;
    }
    function makeGeometry(graphics, texture, options) {
        return new GeometryArrays_1.default(graphics, primitiveFromOptions(texture, options));
    }
    var vs = [
        'attribute vec3 aPosition;',
        'attribute vec2 aCoords;',
        'uniform mat4 uModel;',
        'uniform mat4 uProjection;',
        'uniform mat4 uView;',
        'varying highp vec2 vCoords;',
        'void main(void) {',
        '  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);',
        '  vCoords = aCoords;',
        '}'
    ].join('\n');
    var fs = [
        'precision mediump float;',
        'varying highp vec2 vCoords;',
        'uniform sampler2D uImage;',
        '  void main(void) {',
        '  gl_FragColor = texture2D(uImage, vec2(vCoords.s, vCoords.t));',
        '}'
    ].join('\n');
    var makeMaterial = function makeMaterial(graphics, options) {
        return new ShaderMaterial_1.ShaderMaterial(vs, fs, [], graphics);
    };
    var MinecraftBodyPart = (function (_super) {
        __extends(MinecraftBodyPart, _super);
        function MinecraftBodyPart(engine, texture, options) {
            var _this = _super.call(this, void 0, void 0, engine) || this;
            _this.setLoggingName('MinecraftBodyPart');
            var geometry = makeGeometry(engine, texture, options);
            _this.geometry = geometry;
            geometry.release();
            var material = makeMaterial(engine, options);
            _this.material = material;
            material.release();
            _this.texture = texture;
            return _this;
        }
        MinecraftBodyPart.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return MinecraftBodyPart;
    }(Mesh_1.Mesh));
    var MinecraftHead = (function (_super) {
        __extends(MinecraftHead, _super);
        function MinecraftHead(engine, texture, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, engine, texture, {
                height: isNumber_1.default(options.height) ? options.height : 1,
                partKind: MinecraftPartKind.Head,
                offset: options.offset,
                oldSkinLayout: isBoolean_1.default(options.oldSkinLayout) ? options.oldSkinLayout : false
            }) || this;
            _this.setLoggingName('MinecraftHead');
            return _this;
        }
        MinecraftHead.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return MinecraftHead;
    }(MinecraftBodyPart));
    exports.MinecraftHead = MinecraftHead;
    var MinecraftTorso = (function (_super) {
        __extends(MinecraftTorso, _super);
        function MinecraftTorso(engine, texture, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, engine, texture, {
                height: isNumber_1.default(options.height) ? options.height : 1,
                partKind: MinecraftPartKind.Torso,
                offset: options.offset,
                oldSkinLayout: isBoolean_1.default(options.oldSkinLayout) ? options.oldSkinLayout : false
            }) || this;
            _this.setLoggingName('MinecraftTorso');
            return _this;
        }
        MinecraftTorso.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return MinecraftTorso;
    }(MinecraftBodyPart));
    exports.MinecraftTorso = MinecraftTorso;
    var MinecraftArmL = (function (_super) {
        __extends(MinecraftArmL, _super);
        function MinecraftArmL(engine, texture, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, engine, texture, {
                height: isNumber_1.default(options.height) ? options.height : 1,
                partKind: MinecraftPartKind.LeftArm,
                offset: options.offset,
                oldSkinLayout: isBoolean_1.default(options.oldSkinLayout) ? options.oldSkinLayout : false
            }) || this;
            _this.setLoggingName('MinecraftArmL');
            return _this;
        }
        MinecraftArmL.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return MinecraftArmL;
    }(MinecraftBodyPart));
    exports.MinecraftArmL = MinecraftArmL;
    var MinecraftArmR = (function (_super) {
        __extends(MinecraftArmR, _super);
        function MinecraftArmR(engine, texture, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, engine, texture, {
                height: isNumber_1.default(options.height) ? options.height : 1,
                partKind: MinecraftPartKind.RightArm,
                offset: options.offset,
                oldSkinLayout: isBoolean_1.default(options.oldSkinLayout) ? options.oldSkinLayout : false
            }) || this;
            _this.setLoggingName('MinecraftArmR');
            return _this;
        }
        MinecraftArmR.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return MinecraftArmR;
    }(MinecraftBodyPart));
    exports.MinecraftArmR = MinecraftArmR;
    var MinecraftLegL = (function (_super) {
        __extends(MinecraftLegL, _super);
        function MinecraftLegL(engine, texture, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, engine, texture, {
                height: isNumber_1.default(options.height) ? options.height : 1,
                partKind: MinecraftPartKind.LeftLeg,
                offset: options.offset,
                oldSkinLayout: isBoolean_1.default(options.oldSkinLayout) ? options.oldSkinLayout : false
            }) || this;
            _this.setLoggingName('MinecraftLegL');
            return _this;
        }
        MinecraftLegL.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return MinecraftLegL;
    }(MinecraftBodyPart));
    exports.MinecraftLegL = MinecraftLegL;
    var MinecraftLegR = (function (_super) {
        __extends(MinecraftLegR, _super);
        function MinecraftLegR(engine, texture, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, engine, texture, {
                height: isNumber_1.default(options.height) ? options.height : 1,
                partKind: MinecraftPartKind.RightLeg,
                offset: options.offset,
                oldSkinLayout: isBoolean_1.default(options.oldSkinLayout) ? options.oldSkinLayout : false
            }) || this;
            _this.setLoggingName('MinecraftLegR');
            return _this;
        }
        MinecraftLegR.prototype.destructor = function (levelUp) {
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        return MinecraftLegR;
    }(MinecraftBodyPart));
    exports.MinecraftLegR = MinecraftLegR;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/MinecraftFigure',["require", "exports", "./Group", "../checks/isBoolean", "../checks/isNumber", "./Minecraft", "./Minecraft", "./Minecraft", "./Minecraft", "./Minecraft", "./Minecraft", "../math/R3"], function (require, exports, Group_1, isBoolean_1, isNumber_1, Minecraft_1, Minecraft_2, Minecraft_3, Minecraft_4, Minecraft_5, Minecraft_6, R3_1) {
    "use strict";
    var e1 = R3_1.default(1, 0, 0);
    var e2 = R3_1.default(0, 1, 0);
    var MinecraftFigure = (function (_super) {
        __extends(MinecraftFigure, _super);
        function MinecraftFigure(engine, texture, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            var height = isNumber_1.default(options.height) ? options.height : 1;
            var scale = height / 32;
            var oldSkinLayout = isBoolean_1.default(options.oldSkinLayout) ? options.oldSkinLayout : false;
            _this.head = new Minecraft_1.MinecraftHead(engine, texture, { height: height, offset: e2.scale(scale * 4), oldSkinLayout: oldSkinLayout });
            _this.head.position.zero().addVector(e2, scale * 24);
            _this.add(_this.head);
            _this.head.release();
            _this.torso = new Minecraft_6.MinecraftTorso(engine, texture, { height: height, oldSkinLayout: oldSkinLayout });
            _this.torso.position.zero().addVector(e2, scale * 18);
            _this.add(_this.torso);
            _this.torso.release();
            _this.armL = new Minecraft_2.MinecraftArmL(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
            _this.armL.position.zero().addVector(e2, scale * 22).addVector(e1, scale * 6);
            _this.add(_this.armL);
            _this.armL.release();
            _this.armR = new Minecraft_3.MinecraftArmR(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
            _this.armR.position.zero().addVector(e2, scale * 22).subVector(e1, scale * 6);
            _this.add(_this.armR);
            _this.armR.release();
            _this.legL = new Minecraft_4.MinecraftLegL(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
            _this.legL.position.zero().addVector(e2, scale * 10).addVector(e1, scale * 2);
            _this.add(_this.legL);
            _this.legL.release();
            _this.legR = new Minecraft_5.MinecraftLegR(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
            _this.legR.position.zero().addVector(e2, scale * 10).subVector(e1, scale * 2);
            _this.add(_this.legR);
            _this.legR.release();
            return _this;
        }
        return MinecraftFigure;
    }(Group_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MinecraftFigure;
});

define('davinci-eight/visual/Parallelepiped',["require", "exports", "../core/BeginMode", "../core/Color", "../core/DataType", "../base/exchange", "../math/Geometric3", "../core/GeometryArrays", "../core/Mesh", "./mustBeEngine", "../core/refChange", "../materials/ShaderMaterial"], function (require, exports, BeginMode_1, Color_1, DataType_1, exchange_1, Geometric3_1, GeometryArrays_1, Mesh_1, mustBeEngine_1, refChange_1, ShaderMaterial_1) {
    "use strict";
    var vertexShaderSrc = [
        "attribute vec3 aCoords;",
        "attribute float aFace;",
        "uniform vec3 a;",
        "uniform vec3 b;",
        "uniform vec3 c;",
        "uniform vec3 color0;",
        "uniform vec3 color1;",
        "uniform vec3 color2;",
        "uniform vec3 color3;",
        "uniform vec3 color4;",
        "uniform vec3 color5;",
        "uniform float uOpacity;",
        "uniform vec3 uPosition;",
        "uniform mat4 uModel;",
        "uniform mat4 uProjection;",
        "uniform mat4 uView;",
        "varying highp vec4 vColor;",
        "",
        "void main(void) {",
        "  vec3 X = aCoords.x * a + aCoords.y * b + aCoords.z * c;",
        "  gl_Position = uProjection * uView * uModel * vec4(X + uPosition, 1.0);",
        "  if (aFace == 0.0) {",
        "    vColor = vec4(color0, uOpacity);",
        "  }",
        "  if (aFace == 1.0) {",
        "    vColor = vec4(color1, uOpacity);",
        "  }",
        "  if (aFace == 2.0) {",
        "    vColor = vec4(color2, uOpacity);",
        "  }",
        "  if (aFace == 3.0) {",
        "    vColor = vec4(color3, uOpacity);",
        "  }",
        "  if (aFace == 4.0) {",
        "    vColor = vec4(color4, uOpacity);",
        "  }",
        "  if (aFace == 5.0) {",
        "    vColor = vec4(color5, uOpacity);",
        "  }",
        "}"
    ].join('\n');
    var fragmentShaderSrc = [
        "precision mediump float;",
        "varying highp vec4 vColor;",
        "",
        "void main(void) {",
        "  gl_FragColor = vColor;",
        "}"
    ].join('\n');
    var vertices = [
        [-0.5, -0.5, +0.5],
        [-0.5, +0.5, +0.5],
        [+0.5, +0.5, +0.5],
        [+0.5, -0.5, +0.5],
        [-0.5, -0.5, -0.5],
        [-0.5, +0.5, -0.5],
        [+0.5, +0.5, -0.5],
        [+0.5, -0.5, -0.5],
    ];
    var aCoords = [];
    var aFaces = [];
    var ID = 'parallelepiped';
    var NAME = 'Parallelepiped';
    function quad(a, b, c, d) {
        var indices = [a, b, c, a, c, d];
        for (var i = 0; i < indices.length; i++) {
            var vertex = vertices[indices[i]];
            var dims = vertex.length;
            for (var d_1 = 0; d_1 < dims; d_1++) {
                aCoords.push(vertex[d_1]);
            }
            aFaces.push(a - 1);
        }
    }
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    var Parallelepiped = (function () {
        function Parallelepiped(engine, levelUp) {
            if (levelUp === void 0) { levelUp = 0; }
            this.levelUp = levelUp;
            this.opacity = 1;
            this.transparent = false;
            this.X = Geometric3_1.Geometric3.zero().clone();
            this.a = Geometric3_1.Geometric3.e1().clone();
            this.b = Geometric3_1.Geometric3.e2().clone();
            this.c = Geometric3_1.Geometric3.e3().clone();
            this.colors = [];
            this.refCount = 0;
            this.contextManager = exchange_1.default(this.contextManager, mustBeEngine_1.default(engine, 'Parallelepiped'));
            this.addRef();
            this.colors[0] = Color_1.Color.gray.clone();
            this.colors[1] = Color_1.Color.gray.clone();
            this.colors[2] = Color_1.Color.gray.clone();
            this.colors[3] = Color_1.Color.gray.clone();
            this.colors[4] = Color_1.Color.gray.clone();
            this.colors[5] = Color_1.Color.gray.clone();
            if (levelUp === 0) {
                engine.synchronize(this);
            }
        }
        Parallelepiped.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                if (this.contextManager && this.contextManager.gl) {
                    if (this.contextManager.gl.isContextLost()) {
                        this.contextLost();
                    }
                    else {
                        this.contextFree();
                    }
                }
                else {
                }
            }
            this.mesh = exchange_1.default(this.mesh, void 0);
            this.contextManager = exchange_1.default(this.contextManager, void 0);
        };
        Parallelepiped.prototype.render = function (ambients) {
            if (this.mesh) {
                var material = this.mesh.material;
                material.use();
                material.getUniform('uOpacity').uniform1f(this.opacity);
                material.getUniform('uPosition').uniform3f(this.X.x, this.X.y, this.X.z);
                material.getUniform('a').uniform3f(this.a.x, this.a.y, this.a.z);
                material.getUniform('b').uniform3f(this.b.x, this.b.y, this.b.z);
                material.getUniform('c').uniform3f(this.c.x, this.c.y, this.c.z);
                for (var i = 0; i < this.colors.length; i++) {
                    material.getUniform("color" + i).uniform3f(this.colors[i].r, this.colors[i].g, this.colors[i].b);
                }
                material.release();
                this.mesh.render(ambients);
            }
        };
        Parallelepiped.prototype.addRef = function () {
            refChange_1.default(ID, NAME, +1);
            this.refCount++;
            return this.refCount;
        };
        Parallelepiped.prototype.release = function () {
            refChange_1.default(ID, NAME, -1);
            this.refCount--;
            if (this.refCount === 0) {
                this.destructor(this.levelUp);
            }
            return this.refCount;
        };
        Parallelepiped.prototype.contextFree = function () {
            this.mesh = exchange_1.default(this.mesh, void 0);
        };
        Parallelepiped.prototype.contextGain = function () {
            if (!this.mesh) {
                var primitive = {
                    mode: BeginMode_1.default.TRIANGLES,
                    attributes: {
                        aCoords: { values: aCoords, size: 3, type: DataType_1.default.FLOAT },
                        aFace: { values: aFaces, size: 1, type: DataType_1.default.FLOAT }
                    }
                };
                var geometry = new GeometryArrays_1.default(this.contextManager, primitive);
                var material = new ShaderMaterial_1.ShaderMaterial(vertexShaderSrc, fragmentShaderSrc, [], this.contextManager);
                this.mesh = new Mesh_1.Mesh(geometry, material, this.contextManager);
                geometry.release();
                material.release();
            }
        };
        Parallelepiped.prototype.contextLost = function () {
            this.mesh = exchange_1.default(this.mesh, void 0);
        };
        return Parallelepiped;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Parallelepiped;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Tetrahedron',["require", "exports", "../core/Color", "../materials/MeshMaterial", "./mustBeEngine", "./RigidBody", "./setColorOption", "./setDeprecatedOptions", "../geometries/TetrahedronGeometry"], function (require, exports, Color_1, MeshMaterial_1, mustBeEngine_1, RigidBody_1, setColorOption_1, setDeprecatedOptions_1, TetrahedronGeometry_1) {
    "use strict";
    var Tetrahedron = (function (_super) {
        __extends(Tetrahedron, _super);
        function Tetrahedron(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'Tetrahedron'), levelUp + 1) || this;
            _this.setLoggingName('Tetrahedron');
            var geoOptions = {};
            var geometry = new TetrahedronGeometry_1.default(engine, geoOptions);
            var matOptions = null;
            var material = new MeshMaterial_1.MeshMaterial(engine, matOptions);
            _this.geometry = geometry;
            _this.material = material;
            geometry.release();
            material.release();
            if (options.color) {
                _this.color.copy(options.color);
            }
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            setDeprecatedOptions_1.default(_this, options);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Tetrahedron.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
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
    }(RigidBody_1.RigidBody));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tetrahedron;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Track',["require", "exports", "../core/BeginMode", "../core/Color", "../core/DataType", "../materials/LineMaterial", "../math/Matrix4", "../core/Mesh", "./mustBeEngine", "./setColorOption", "../core/Usage", "../core/VertexBuffer"], function (require, exports, BeginMode_1, Color_1, DataType_1, LineMaterial_1, Matrix4_1, Mesh_1, mustBeEngine_1, setColorOption_1, Usage_1, VertexBuffer_1) {
    "use strict";
    var FLOATS_PER_VERTEX = 3;
    var BYTES_PER_FLOAT = 4;
    var STRIDE = BYTES_PER_FLOAT * FLOATS_PER_VERTEX;
    var TrackGeometry = (function () {
        function TrackGeometry(contextManager) {
            this.contextManager = contextManager;
            this.scaling = Matrix4_1.default.one();
            this.count = 0;
            this.N = 2;
            this.dirty = true;
            this.refCount = 1;
            this.data = new Float32Array(this.N * FLOATS_PER_VERTEX);
            this.vbo = new VertexBuffer_1.default(contextManager, this.data, Usage_1.default.DYNAMIC_DRAW);
        }
        TrackGeometry.prototype.destructor = function () {
            this.vbo.release();
            this.vbo = void 0;
        };
        TrackGeometry.prototype.bind = function (material) {
            if (this.dirty) {
                this.vbo.bind();
                this.vbo.upload();
                this.vbo.unbind();
                this.dirty = false;
            }
            this.vbo.bind();
            var aPosition = material.getAttrib('aPosition');
            aPosition.config(FLOATS_PER_VERTEX, DataType_1.default.FLOAT, true, STRIDE, 0);
            aPosition.enable();
            return this;
        };
        TrackGeometry.prototype.unbind = function (material) {
            var aPosition = material.getAttrib('aPosition');
            aPosition.disable();
            this.vbo.unbind();
            return this;
        };
        TrackGeometry.prototype.draw = function () {
            this.contextManager.gl.drawArrays(BeginMode_1.default.LINE_STRIP, 0, this.count);
            return this;
        };
        TrackGeometry.prototype.getPrincipalScale = function (name) {
            throw new Error("LineGeometry.getPrincipalScale");
        };
        TrackGeometry.prototype.hasPrincipalScale = function (name) {
            throw new Error("LineGeometry.hasPrincipalScale");
        };
        TrackGeometry.prototype.setPrincipalScale = function (name, value) {
            throw new Error("LineGeometry.setPrincipalScale");
        };
        TrackGeometry.prototype.contextFree = function () {
            this.vbo.contextFree();
        };
        TrackGeometry.prototype.contextGain = function () {
            this.vbo.contextGain();
        };
        TrackGeometry.prototype.contextLost = function () {
            this.vbo.contextLost();
        };
        TrackGeometry.prototype.addRef = function () {
            this.refCount++;
            return this.refCount;
        };
        TrackGeometry.prototype.release = function () {
            this.refCount--;
            if (this.refCount === 0) {
                this.destructor();
            }
            return this.refCount;
        };
        TrackGeometry.prototype.setUniforms = function (visitor) {
        };
        TrackGeometry.prototype.addPoint = function (x, y, z) {
            if (this.count === this.N) {
                this.N = this.N * 2;
                var temp = new Float32Array(this.N * FLOATS_PER_VERTEX);
                temp.set(this.data);
                this.data = temp;
                this.vbo.release();
                this.vbo = new VertexBuffer_1.default(this.contextManager, this.data, Usage_1.default.DYNAMIC_DRAW);
            }
            var offset = this.count * FLOATS_PER_VERTEX;
            this.data[offset + 0] = x;
            this.data[offset + 1] = y;
            this.data[offset + 2] = z;
            this.count++;
            this.dirty = true;
        };
        TrackGeometry.prototype.erase = function () {
            this.count = 0;
        };
        return TrackGeometry;
    }());
    var Track = (function (_super) {
        __extends(Track, _super);
        function Track(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, new TrackGeometry(engine), new LineMaterial_1.LineMaterial(engine), mustBeEngine_1.default(engine, 'Track'), levelUp + 1) || this;
            _this.setLoggingName('Track');
            var geometry = _this.geometry;
            geometry.release();
            geometry.release();
            var material = _this.material;
            material.release();
            material.release();
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Track.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Track.prototype.addPoint = function (point) {
            if (point) {
                var geometry = this.geometry;
                geometry.addPoint(point.x, point.y, point.z);
                geometry.release();
            }
        };
        Track.prototype.clear = function () {
            var geometry = this.geometry;
            geometry.erase();
            geometry.release();
        };
        return Track;
    }(Mesh_1.Mesh));
    exports.Track = Track;
});

define('davinci-eight/math/Modulo',["require", "exports", "../checks/mustBeGE", "../checks/mustBeInteger"], function (require, exports, mustBeGE_1, mustBeInteger_1) {
    "use strict";
    var Modulo = (function () {
        function Modulo() {
            this._value = 0;
            this._size = 0;
        }
        Object.defineProperty(Modulo.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (size) {
                mustBeInteger_1.default('size', size);
                mustBeGE_1.default('size', size, 0);
                this._size = size;
                this.value = this._value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modulo.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value % this._size;
            },
            enumerable: true,
            configurable: true
        });
        Modulo.prototype.inc = function () {
            this._value++;
            if (this._value === this._size) {
                this._value = 0;
            }
            return this._value;
        };
        return Modulo;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Modulo;
});

define('davinci-eight/visual/TrailConfig',["require", "exports"], function (require, exports) {
    "use strict";
    var TrailConfig = (function () {
        function TrailConfig() {
            this.enabled = true;
            this.interval = 10;
            this.retain = 10;
        }
        return TrailConfig;
    }());
    exports.TrailConfig = TrailConfig;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Trail',["require", "exports", "../math/Modulo", "../math/Spinor3", "../math/Vector3", "../checks/mustBeNonNullObject", "../core/ShareableBase", "./TrailConfig"], function (require, exports, Modulo_1, Spinor3_1, Vector3_1, mustBeNonNullObject_1, ShareableBase_1, TrailConfig_1) {
    "use strict";
    var savedX = Vector3_1.default.zero();
    var savedR = Spinor3_1.default.zero();
    var Trail = (function (_super) {
        __extends(Trail, _super);
        function Trail(mesh) {
            var _this = _super.call(this) || this;
            _this.Xs = [];
            _this.Rs = [];
            _this.config = new TrailConfig_1.TrailConfig();
            _this.counter = 0;
            _this.modulo = new Modulo_1.default();
            _this.setLoggingName('Trail');
            mustBeNonNullObject_1.default('mesh', mesh);
            mesh.addRef();
            _this.mesh = mesh;
            return _this;
        }
        Trail.prototype.destructor = function (levelUp) {
            this.mesh.release();
            this.mesh = void 0;
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Trail.prototype.draw = function (ambients) {
            console.warn("Trail.draw is deprecated. Please use the Trail.render method instead.");
            this.render(ambients);
        };
        Trail.prototype.erase = function () {
            this.Xs = [];
            this.Rs = [];
        };
        Trail.prototype.render = function (ambients) {
            if (this.config.enabled) {
                var mesh = this.mesh;
                var X = mesh.X;
                var R = mesh.R;
                savedX.copy(X);
                savedR.copy(R);
                var geometry = mesh.geometry;
                var material = mesh.material;
                material.use();
                var iL = ambients.length;
                for (var i = 0; i < iL; i++) {
                    var facet = ambients[i];
                    facet.setUniforms(material);
                }
                geometry.bind(material);
                var Xs = this.Xs;
                var Rs = this.Rs;
                var iLength = this.modulo.size;
                for (var i = 0; i < iLength; i++) {
                    if (Xs[i]) {
                        X.copyVector(Xs[i]);
                    }
                    if (Rs[i]) {
                        R.copySpinor(Rs[i]);
                    }
                    mesh.setUniforms();
                    geometry.draw();
                }
                geometry.unbind(material);
                geometry.release();
                material.release();
                X.copyVector(savedX);
                R.copySpinor(savedR);
            }
        };
        Trail.prototype.snapshot = function () {
            if (this.config.enabled) {
                if (this.modulo.size !== this.config.retain) {
                    this.modulo.size = this.config.retain;
                    this.modulo.value = 0;
                }
                if (this.counter % this.config.interval === 0) {
                    var index = this.modulo.value;
                    if (this.Xs[index]) {
                        this.Xs[index].copy(this.mesh.X);
                        this.Rs[index].copy(this.mesh.R);
                    }
                    else {
                        this.Xs[index] = Vector3_1.default.copy(this.mesh.X);
                        this.Rs[index] = Spinor3_1.default.copy(this.mesh.R);
                    }
                    this.modulo.inc();
                }
                this.counter++;
            }
        };
        return Trail;
    }(ShareableBase_1.ShareableBase));
    exports.Trail = Trail;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/visual/Turtle',["require", "exports", "../core/BeginMode", "../core/Color", "../core/DataType", "../math/Geometric3", "../core/GeometryArrays", "../materials/LineMaterial", "./mustBeEngine", "./RigidBody", "./setColorOption", "./tiltFromOptions", "../math/R3"], function (require, exports, BeginMode_1, Color_1, DataType_1, Geometric3_1, GeometryArrays_1, LineMaterial_1, mustBeEngine_1, RigidBody_1, setColorOption_1, tiltFromOptions_1, R3_1) {
    "use strict";
    var NOSE = [0, +1, 0];
    var LLEG = [-1, -1, 0];
    var RLEG = [+1, -1, 0];
    var TAIL = [0, -1, 0];
    var CENTER = [0, 0, 0];
    var LEFT = [-0.5, 0, 0];
    var canonicalAxis = R3_1.default(0, 0, 1);
    var zero = R3_1.default(0, 0, 0);
    function concat(a, b) { return a.concat(b); }
    function transform(xs, options) {
        if (options.tilt || options.offset) {
            var points = xs.map(function (coords) { return Geometric3_1.Geometric3.vector(coords[0], coords[1], coords[2]); });
            if (options.tilt) {
                points.forEach(function (point) {
                    point.rotate(options.tilt);
                });
            }
            if (options.offset) {
                points.forEach(function (point) {
                    point.addVector(options.offset);
                });
            }
            return points.map(function (point) { return [point.x, point.y, point.z]; });
        }
        else {
            return xs;
        }
    }
    function primitive(options) {
        var values = transform([CENTER, LEFT, CENTER, TAIL, NOSE, LLEG, NOSE, RLEG, LLEG, RLEG], options).reduce(concat);
        var result = {
            mode: BeginMode_1.default.LINES,
            attributes: {
                'aPosition': { values: values, size: CENTER.length, type: DataType_1.default.FLOAT }
            }
        };
        return result;
    }
    var TurtleGeometry = (function (_super) {
        __extends(TurtleGeometry, _super);
        function TurtleGeometry(contextManager, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, contextManager, primitive(options), options) || this;
            _this.w = 1;
            _this.h = 1;
            _this.d = 1;
            return _this;
        }
        TurtleGeometry.prototype.getPrincipalScale = function (name) {
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
                    throw new Error("getPrincipalScale(" + name + "): name is not a principal scale property.");
                }
            }
        };
        TurtleGeometry.prototype.setPrincipalScale = function (name, value) {
            switch (name) {
                case 'width': {
                    this.w = value;
                    break;
                }
                case 'height': {
                    this.h = value;
                    break;
                }
                case 'depth': {
                    this.d = value;
                    break;
                }
                default: {
                    throw new Error("setPrinciplaScale(" + name + "): name is not a principal scale property.");
                }
            }
            this.setScale(this.w, this.h, this.d);
        };
        return TurtleGeometry;
    }(GeometryArrays_1.default));
    var Turtle = (function (_super) {
        __extends(Turtle, _super);
        function Turtle(engine, options, levelUp) {
            if (options === void 0) { options = {}; }
            if (levelUp === void 0) { levelUp = 0; }
            var _this = _super.call(this, mustBeEngine_1.default(engine, 'Turtle'), levelUp + 1) || this;
            _this.setLoggingName('Turtle');
            var geoOptions = {};
            geoOptions.tilt = tiltFromOptions_1.default(options, canonicalAxis);
            geoOptions.offset = zero;
            var geometry = new TurtleGeometry(engine, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            var material = new LineMaterial_1.LineMaterial(engine);
            _this.material = material;
            material.release();
            _this.height = 0.1;
            _this.width = 0.0618;
            setColorOption_1.default(_this, options, Color_1.Color.gray);
            if (levelUp === 0) {
                _this.synchUp();
            }
            return _this;
        }
        Turtle.prototype.destructor = function (levelUp) {
            if (levelUp === 0) {
                this.cleanUp();
            }
            _super.prototype.destructor.call(this, levelUp + 1);
        };
        Object.defineProperty(Turtle.prototype, "width", {
            get: function () {
                return this.getPrincipalScale('width');
            },
            set: function (width) {
                this.setPrincipalScale('width', width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Turtle.prototype, "height", {
            get: function () {
                return this.getPrincipalScale('height');
            },
            set: function (height) {
                this.setPrincipalScale('height', height);
            },
            enumerable: true,
            configurable: true
        });
        return Turtle;
    }(RigidBody_1.RigidBody));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Turtle;
});

define('davinci-eight/diagram/Diagram3D',["require", "exports", "../math/dotVectorE3", "../math/R3"], function (require, exports, dotVectorE3_1, R3_1) {
    "use strict";
    var Diagram3D = (function () {
        function Diagram3D(canvas, camera) {
            this.camera = camera;
            var canvasElement = document.getElementById('canvas2D');
            this.ctx = canvasElement.getContext('2d');
            this.ctx.strokeStyle = "#FFFFFF";
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '24px Helvetica';
        }
        Object.defineProperty(Diagram3D.prototype, "canvas", {
            get: function () {
                return this.ctx.canvas;
            },
            enumerable: true,
            configurable: true
        });
        Diagram3D.prototype.beginPath = function () {
            this.ctx.beginPath();
        };
        Diagram3D.prototype.clear = function () {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        };
        Diagram3D.prototype.closePath = function () {
            this.ctx.closePath();
        };
        Diagram3D.prototype.fill = function (fillRule) {
            this.ctx.fill(fillRule);
        };
        Diagram3D.prototype.fillText = function (text, X, maxWidth) {
            var coords = this.canvasCoords(X);
            this.ctx.fillText(text, coords.x, coords.y, maxWidth);
        };
        Diagram3D.prototype.moveTo = function (X) {
            var coords = this.canvasCoords(X);
            this.ctx.moveTo(coords.x, coords.y);
        };
        Diagram3D.prototype.lineTo = function (X) {
            var coords = this.canvasCoords(X);
            this.ctx.lineTo(coords.x, coords.y);
        };
        Diagram3D.prototype.stroke = function () {
            this.ctx.stroke();
        };
        Diagram3D.prototype.strokeText = function (text, X, maxWidth) {
            var coords = this.canvasCoords(X);
            this.ctx.strokeText(text, coords.x, coords.y, maxWidth);
        };
        Diagram3D.prototype.canvasCoords = function (X) {
            var camera = this.camera;
            var cameraCoords = view(X, camera.eye, camera.look, camera.up);
            var N = camera.near;
            var F = camera.far;
            var θ = camera.fov;
            var aspect = camera.aspect;
            var canonCoords = perspective(cameraCoords, N, F, θ, aspect);
            var x = (canonCoords.x + 1) * this.ctx.canvas.width / 2;
            var y = (1 - canonCoords.y) * this.ctx.canvas.height / 2;
            return { x: x, y: y };
        };
        return Diagram3D;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Diagram3D;
    function view(X, eye, look, up) {
        var e = R3_1.default(eye.x, eye.y, eye.z);
        var l = R3_1.default(look.x, look.y, look.z);
        var n = e.sub(l).direction();
        var u = R3_1.default(up.x, up.y, up.z).cross(n).direction();
        var v = n.cross(u);
        var du = -dotVectorE3_1.default(eye, u);
        var dv = -dotVectorE3_1.default(eye, v);
        var dn = -dotVectorE3_1.default(eye, n);
        var x = dotVectorE3_1.default(X, u) + du;
        var y = dotVectorE3_1.default(X, v) + dv;
        var z = dotVectorE3_1.default(X, n) + dn;
        return { x: x, y: y, z: z };
    }
    function perspective(X, N, F, fov, aspect) {
        var t = N * Math.tan(fov / 2);
        var b = -t;
        var r = aspect * t;
        var l = -r;
        var x = N * X.x / (X.z * l);
        var y = ((2 * N) * X.y + (t + b) * X.z) / (X.z * (b - t));
        var z = ((F + N) * X.z + 2 * F * N) / (X.z * (F - N));
        return { x: x, y: y, z: z };
    }
});

define('davinci-eight/loaders/TextureLoader',["require", "exports", "../core/ImageTexture", "../checks/isFunction", "../checks/mustBeString", "../checks/mustBeFunction", "../checks/mustBeNonNullObject", "../core/TextureTarget"], function (require, exports, ImageTexture_1, isFunction_1, mustBeString_1, mustBeFunction_1, mustBeNonNullObject_1, TextureTarget_1) {
    "use strict";
    var TextureLoader = (function () {
        function TextureLoader(contextManager) {
            this.contextManager = contextManager;
            mustBeNonNullObject_1.default('contextManager', contextManager);
        }
        TextureLoader.prototype.loadImageTexture = function (url, onLoad, onError) {
            var _this = this;
            mustBeString_1.default('url', url);
            mustBeFunction_1.default('onLoad', onLoad);
            var image = new Image();
            image.onload = function () {
                var texture = new ImageTexture_1.default(image, TextureTarget_1.default.TEXTURE_2D, _this.contextManager);
                texture.bind();
                texture.upload();
                texture.unbind();
                onLoad(texture);
            };
            image.onerror = function () {
                if (isFunction_1.default(onError)) {
                    onError();
                }
            };
            image.src = url;
        };
        return TextureLoader;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureLoader;
});

define('davinci-eight',["require", "exports", "./davinci-eight/commands/WebGLBlendFunc", "./davinci-eight/commands/WebGLClearColor", "./davinci-eight/commands/WebGLDisable", "./davinci-eight/commands/WebGLEnable", "./davinci-eight/controls/OrbitControls", "./davinci-eight/controls/TrackballControls", "./davinci-eight/core/Attrib", "./davinci-eight/core/BeginMode", "./davinci-eight/core/BlendingFactorDest", "./davinci-eight/core/BlendingFactorSrc", "./davinci-eight/core/Capability", "./davinci-eight/core/ClearBufferMask", "./davinci-eight/core/Color", "./davinci-eight/config", "./davinci-eight/core/DataType", "./davinci-eight/core/Drawable", "./davinci-eight/core/DepthFunction", "./davinci-eight/core/GeometryArrays", "./davinci-eight/core/GeometryElements", "./davinci-eight/core/GraphicsProgramSymbols", "./davinci-eight/core/ImageTexture", "./davinci-eight/core/Mesh", "./davinci-eight/core/PixelFormat", "./davinci-eight/core/PixelType", "./davinci-eight/core/Scene", "./davinci-eight/core/Shader", "./davinci-eight/core/Texture", "./davinci-eight/core/TextureMagFilter", "./davinci-eight/core/TextureMinFilter", "./davinci-eight/core/TextureParameterName", "./davinci-eight/core/TextureTarget", "./davinci-eight/core/TextureWrapMode", "./davinci-eight/core/Uniform", "./davinci-eight/core/Usage", "./davinci-eight/core/Engine", "./davinci-eight/core/VertexBuffer", "./davinci-eight/core/IndexBuffer", "./davinci-eight/core/vertexArraysFromPrimitive", "./davinci-eight/facets/AmbientLight", "./davinci-eight/facets/ColorFacet", "./davinci-eight/facets/DirectionalLight", "./davinci-eight/facets/ModelFacet", "./davinci-eight/facets/PointSizeFacet", "./davinci-eight/facets/ReflectionFacetE2", "./davinci-eight/facets/ReflectionFacetE3", "./davinci-eight/facets/Vector3Facet", "./davinci-eight/facets/frustumMatrix", "./davinci-eight/facets/PerspectiveCamera", "./davinci-eight/facets/perspectiveMatrix", "./davinci-eight/facets/viewMatrixFromEyeLookUp", "./davinci-eight/facets/ModelE2", "./davinci-eight/facets/ModelE3", "./davinci-eight/atoms/DrawAttribute", "./davinci-eight/atoms/DrawPrimitive", "./davinci-eight/atoms/reduce", "./davinci-eight/atoms/Vertex", "./davinci-eight/shapes/ArrowBuilder", "./davinci-eight/shapes/ConicalShellBuilder", "./davinci-eight/shapes/CylindricalShellBuilder", "./davinci-eight/shapes/RingBuilder", "./davinci-eight/geometries/Simplex", "./davinci-eight/geometries/GeometryMode", "./davinci-eight/geometries/ArrowGeometry", "./davinci-eight/geometries/BoxGeometry", "./davinci-eight/geometries/CylinderGeometry", "./davinci-eight/geometries/CurveGeometry", "./davinci-eight/geometries/CurveMode", "./davinci-eight/geometries/GridGeometry", "./davinci-eight/geometries/SphereGeometry", "./davinci-eight/geometries/TetrahedronGeometry", "./davinci-eight/materials/HTMLScriptsMaterial", "./davinci-eight/materials/LineMaterial", "./davinci-eight/materials/ShaderMaterial", "./davinci-eight/materials/MeshMaterial", "./davinci-eight/materials/PointMaterial", "./davinci-eight/materials/GraphicsProgramBuilder", "./davinci-eight/math/mathcore", "./davinci-eight/math/Vector1", "./davinci-eight/math/Matrix2", "./davinci-eight/math/Matrix3", "./davinci-eight/math/Matrix4", "./davinci-eight/math/Geometric2", "./davinci-eight/math/Geometric3", "./davinci-eight/math/Spinor2", "./davinci-eight/math/Spinor3", "./davinci-eight/math/Vector2", "./davinci-eight/math/Vector3", "./davinci-eight/math/Vector4", "./davinci-eight/math/VectorN", "./davinci-eight/utils/getCanvasElementById", "./davinci-eight/collections/ShareableArray", "./davinci-eight/collections/NumberShareableMap", "./davinci-eight/core/refChange", "./davinci-eight/core/ShareableBase", "./davinci-eight/collections/StringShareableMap", "./davinci-eight/utils/animation", "./davinci-eight/visual/Arrow", "./davinci-eight/visual/Basis", "./davinci-eight/visual/Sphere", "./davinci-eight/visual/Box", "./davinci-eight/visual/Cylinder", "./davinci-eight/visual/Curve", "./davinci-eight/visual/Grid", "./davinci-eight/visual/GridXY", "./davinci-eight/visual/GridYZ", "./davinci-eight/visual/GridZX", "./davinci-eight/visual/Group", "./davinci-eight/visual/HollowCylinder", "./davinci-eight/visual/Minecraft", "./davinci-eight/visual/MinecraftFigure", "./davinci-eight/visual/Parallelepiped", "./davinci-eight/visual/RigidBody", "./davinci-eight/visual/Tetrahedron", "./davinci-eight/visual/Track", "./davinci-eight/visual/Trail", "./davinci-eight/visual/Turtle", "./davinci-eight/diagram/Diagram3D", "./davinci-eight/loaders/TextureLoader"], function (require, exports, WebGLBlendFunc_1, WebGLClearColor_1, WebGLDisable_1, WebGLEnable_1, OrbitControls_1, TrackballControls_1, Attrib_1, BeginMode_1, BlendingFactorDest_1, BlendingFactorSrc_1, Capability_1, ClearBufferMask_1, Color_1, config_1, DataType_1, Drawable_1, DepthFunction_1, GeometryArrays_1, GeometryElements_1, GraphicsProgramSymbols_1, ImageTexture_1, Mesh_1, PixelFormat_1, PixelType_1, Scene_1, Shader_1, Texture_1, TextureMagFilter_1, TextureMinFilter_1, TextureParameterName_1, TextureTarget_1, TextureWrapMode_1, Uniform_1, Usage_1, Engine_1, VertexBuffer_1, IndexBuffer_1, vertexArraysFromPrimitive_1, AmbientLight_1, ColorFacet_1, DirectionalLight_1, ModelFacet_1, PointSizeFacet_1, ReflectionFacetE2_1, ReflectionFacetE3_1, Vector3Facet_1, frustumMatrix_1, PerspectiveCamera_1, perspectiveMatrix_1, viewMatrixFromEyeLookUp_1, ModelE2_1, ModelE3_1, DrawAttribute_1, DrawPrimitive_1, reduce_1, Vertex_1, ArrowBuilder_1, ConicalShellBuilder_1, CylindricalShellBuilder_1, RingBuilder_1, Simplex_1, GeometryMode_1, ArrowGeometry_1, BoxGeometry_1, CylinderGeometry_1, CurveGeometry_1, CurveMode_1, GridGeometry_1, SphereGeometry_1, TetrahedronGeometry_1, HTMLScriptsMaterial_1, LineMaterial_1, ShaderMaterial_1, MeshMaterial_1, PointMaterial_1, GraphicsProgramBuilder_1, mathcore_1, Vector1_1, Matrix2_1, Matrix3_1, Matrix4_1, Geometric2_1, Geometric3_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1, Vector4_1, VectorN_1, getCanvasElementById_1, ShareableArray_1, NumberShareableMap_1, refChange_1, ShareableBase_1, StringShareableMap_1, animation_1, Arrow_1, Basis_1, Sphere_1, Box_1, Cylinder_1, Curve_1, Grid_1, GridXY_1, GridYZ_1, GridZX_1, Group_1, HollowCylinder_1, Minecraft_1, MinecraftFigure_1, Parallelepiped_1, RigidBody_1, Tetrahedron_1, Track_1, Trail_1, Turtle_1, Diagram3D_1, TextureLoader_1) {
    "use strict";
    var eight = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get VERSION() { return config_1.default.VERSION; },
        get ShaderMaterial() { return ShaderMaterial_1.ShaderMaterial; },
        get HTMLScriptsMaterial() { return HTMLScriptsMaterial_1.default; },
        get LineMaterial() { return LineMaterial_1.LineMaterial; },
        get MeshMaterial() { return MeshMaterial_1.MeshMaterial; },
        get PointMaterial() { return PointMaterial_1.PointMaterial; },
        get GraphicsProgramBuilder() { return GraphicsProgramBuilder_1.default; },
        get BlendingFactorDest() { return BlendingFactorDest_1.default; },
        get BlendingFactorSrc() { return BlendingFactorSrc_1.default; },
        get Capability() { return Capability_1.default; },
        get DepthFunction() { return DepthFunction_1.default; },
        get WebGLBlendFunc() { return WebGLBlendFunc_1.default; },
        get WebGLClearColor() { return WebGLClearColor_1.WebGLClearColor; },
        get WebGLDisable() { return WebGLDisable_1.WebGLDisable; },
        get WebGLEnable() { return WebGLEnable_1.WebGLEnable; },
        get ModelE2() { return ModelE2_1.default; },
        get ModelE3() { return ModelE3_1.default; },
        get ModelFacet() { return ModelFacet_1.ModelFacet; },
        get Simplex() { return Simplex_1.default; },
        get reduce() { return reduce_1.default; },
        get Vertex() { return Vertex_1.default; },
        get frustumMatrix() { return frustumMatrix_1.default; },
        get perspectiveMatrix() { return perspectiveMatrix_1.default; },
        get viewMatrix() { return viewMatrixFromEyeLookUp_1.default; },
        get Scene() { return Scene_1.Scene; },
        get Shader() { return Shader_1.default; },
        get Drawable() { return Drawable_1.Drawable; },
        get PerspectiveCamera() { return PerspectiveCamera_1.PerspectiveCamera; },
        get getCanvasElementById() { return getCanvasElementById_1.default; },
        get Engine() { return Engine_1.Engine; },
        get animation() { return animation_1.default; },
        get BeginMode() { return BeginMode_1.default; },
        get ClearBufferMask() { return ClearBufferMask_1.default; },
        get DataType() { return DataType_1.default; },
        get DrawMode() { return BeginMode_1.default; },
        get PixelFormat() { return PixelFormat_1.default; },
        get PixelType() { return PixelType_1.default; },
        get ImageTexture() { return ImageTexture_1.default; },
        get Texture() { return Texture_1.default; },
        get TextureMagFilter() { return TextureMagFilter_1.default; },
        get TextureMinFilter() { return TextureMinFilter_1.default; },
        get TextureParameterName() { return TextureParameterName_1.default; },
        get TextureTarget() { return TextureTarget_1.default; },
        get TextureWrapMode() { return TextureWrapMode_1.default; },
        get Usage() { return Usage_1.default; },
        get Attrib() { return Attrib_1.default; },
        get Uniform() { return Uniform_1.default; },
        get VertexBuffer() { return VertexBuffer_1.default; },
        get IndexBuffer() { return IndexBuffer_1.default; },
        get Color() { return Color_1.Color; },
        get vertexArraysFromPrimitive() { return vertexArraysFromPrimitive_1.default; },
        get OrbitControls() { return OrbitControls_1.OrbitControls; },
        get TrackballControls() { return TrackballControls_1.TrackballControls; },
        get AmbientLight() { return AmbientLight_1.AmbientLight; },
        get ColorFacet() { return ColorFacet_1.ColorFacet; },
        get DirectionalLight() { return DirectionalLight_1.DirectionalLight; },
        get PointSizeFacet() { return PointSizeFacet_1.PointSizeFacet; },
        get ReflectionFacetE2() { return ReflectionFacetE2_1.default; },
        get ReflectionFacetE3() { return ReflectionFacetE3_1.default; },
        get Vector3Facet() { return Vector3Facet_1.default; },
        get ArrowBuilder() { return ArrowBuilder_1.default; },
        get ArrowGeometry() { return ArrowGeometry_1.default; },
        get BoxGeometry() { return BoxGeometry_1.default; },
        get ConicalShellBuilder() { return ConicalShellBuilder_1.default; },
        get CylinderGeometry() { return CylinderGeometry_1.default; },
        get CylindricalShellBuilder() { return CylindricalShellBuilder_1.default; },
        get CurveGeometry() { return CurveGeometry_1.default; },
        get CurveMode() { return CurveMode_1.default; },
        get GeometryMode() { return GeometryMode_1.default; },
        get GridGeometry() { return GridGeometry_1.default; },
        get RingBuilder() { return RingBuilder_1.default; },
        get SphereGeometry() { return SphereGeometry_1.default; },
        get TetrahedronGeometry() { return TetrahedronGeometry_1.default; },
        get Matrix2() { return Matrix2_1.default; },
        get Matrix3() { return Matrix3_1.default; },
        get Matrix4() { return Matrix4_1.default; },
        get Geometric2() { return Geometric2_1.Geometric2; },
        get Geometric3() { return Geometric3_1.Geometric3; },
        get Vector1() { return Vector1_1.default; },
        get Spinor2() { return Spinor2_1.default; },
        get Spinor3() { return Spinor3_1.default; },
        get Vector2() { return Vector2_1.Vector2; },
        get Vector3() { return Vector3_1.default; },
        get Vector4() { return Vector4_1.default; },
        get VectorN() { return VectorN_1.VectorN; },
        get GraphicsProgramSymbols() { return GraphicsProgramSymbols_1.default; },
        get GeometryArrays() { return GeometryArrays_1.default; },
        get GeometryElements() { return GeometryElements_1.default; },
        get DrawAttribute() { return DrawAttribute_1.default; },
        get DrawPrimitive() { return DrawPrimitive_1.default; },
        get ShareableArray() { return ShareableArray_1.default; },
        get NumberShareableMap() { return NumberShareableMap_1.default; },
        get refChange() { return refChange_1.default; },
        get ShareableBase() { return ShareableBase_1.ShareableBase; },
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
        get Diagram3D() { return Diagram3D_1.default; },
        get TextureLoader() { return TextureLoader_1.default; },
        get Arrow() { return Arrow_1.Arrow; },
        get Basis() { return Basis_1.default; },
        get Sphere() { return Sphere_1.Sphere; },
        get Box() { return Box_1.Box; },
        get Mesh() { return Mesh_1.Mesh; },
        get Cylinder() { return Cylinder_1.Cylinder; },
        get Curve() { return Curve_1.Curve; },
        get Grid() { return Grid_1.Grid; },
        get GridXY() { return GridXY_1.default; },
        get GridYZ() { return GridYZ_1.default; },
        get GridZX() { return GridZX_1.default; },
        get Group() { return Group_1.default; },
        get HollowCylinder() { return HollowCylinder_1.default; },
        get MinecraftFigure() { return MinecraftFigure_1.default; },
        get MinecraftArmL() { return Minecraft_1.MinecraftArmL; },
        get MinecraftArmR() { return Minecraft_1.MinecraftArmR; },
        get MinecraftHead() { return Minecraft_1.MinecraftHead; },
        get MinecraftLegL() { return Minecraft_1.MinecraftLegL; },
        get MinecraftLegR() { return Minecraft_1.MinecraftLegR; },
        get MinecraftTorso() { return Minecraft_1.MinecraftTorso; },
        get Parallelepiped() { return Parallelepiped_1.default; },
        get RigidBody() { return RigidBody_1.RigidBody; },
        get Tetrahedron() { return Tetrahedron_1.default; },
        get Track() { return Track_1.Track; },
        get Trail() { return Trail_1.Trail; },
        get Turtle() { return Turtle_1.default; }
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
