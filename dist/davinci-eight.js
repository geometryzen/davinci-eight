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

define('davinci-eight/checks/mustSatisfy',["require", "exports"], function (require, exports) {
    function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
        if (!condition) {
            var message = messageBuilder ? messageBuilder() : "satisfy some condition";
            var context = contextBuilder ? " in " + contextBuilder() : "";
            throw new Error(name + " must " + message + context + ".");
        }
    }
    return mustSatisfy;
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

define('davinci-eight/i18n/readOnly',["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString) {
    /**
     *
     */
    function readOnly(name) {
        mustBeString('name', name);
        var message = {
            get message() {
                return "Property `" + name + "` is readonly.";
            }
        };
        return message;
    }
    return readOnly;
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
    function error(message) {
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
            if (element) {
                element.refCount += change;
                if (element.refCount === 0) {
                    element.zombie = true;
                }
            }
            else {
                error(change + " on " + uuid + " @ " + name);
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

define('davinci-eight/utils/Shareable',["require", "exports", '../checks/mustBeString', '../i18n/readOnly', '../utils/refChange', '../utils/uuid4'], function (require, exports, mustBeString, readOnly, refChange, uuid4) {
    var Shareable = (function () {
        /**
         * <p>
         * Convenient base class for derived classes implementing <code>IUnknown</code>.
         * </p>
         * @class Shareable
         * @extends IUnknown
         * @constructor
         * @param type {string} The human-readable name of the derived type.
         */
        function Shareable(type) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._type = mustBeString('type', type);
            refChange(this._uuid, type, +1);
        }
        /**
         * <p>
         * Notifies this instance that something is dereferencing it.
         * </p>
         *
         * @method addRef
         * @return {number} The new value of the reference count.
         */
        Shareable.prototype.addRef = function (client) {
            this._refCount++;
            refChange(this._uuid, this._type, +1);
            return this._refCount;
        };
        /**
         * <p>
         * Notifies this instance that something is dereferencing it.
         * </p>
         *
         * @method release
         * @return {number} The new value of the reference count.
         */
        Shareable.prototype.release = function (client) {
            this._refCount--;
            refChange(this._uuid, this._type, -1);
            var refCount = this._refCount;
            if (refCount === 0) {
                // destructor called with `true` means grumble if the method has not been overridden.
                this.destructor(true);
                this._refCount = void 0;
                this._type = void 0;
                this._uuid = void 0;
            }
            return refCount;
        };
        /**
         * <p>
         * Outputs a warning to the console that this method should be implemented by the derived class.
         * </p>
         * <p>
         * <em>This method should be implemented by derived classes.</em>
         * </p>
         * <p>
         * <em>Not implementing this method in a derived class risks leaking resources allocated by the derived class.</em>
         * </p>
         * @method destructor
         * @return {void}
         * @protected
         */
        Shareable.prototype.destructor = function (grumble) {
            if (grumble === void 0) { grumble = false; }
            if (grumble) {
                console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
            }
        };
        Object.defineProperty(Shareable.prototype, "uuid", {
            /**
             * @property uuid
             * @type {string}
             * @readOnly
             */
            get: function () {
                return this._uuid;
            },
            set: function (unused) {
                throw new Error(readOnly('uuid').message);
            },
            enumerable: true,
            configurable: true
        });
        return Shareable;
    })();
    return Shareable;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/IUnknownArray',["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    /**
     * Essentially constructs the IUnknownArray without incrementing the
     * reference count of the elements, and without creating zombies.
     */
    function transferOwnership(data) {
        if (data) {
            var result = new IUnknownArray(data);
            // The result has now taken ownership of the elements, so we can release.
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
    /**
     * @class IUnknownArray
     * @extends Shareable
     */
    var IUnknownArray = (function (_super) {
        __extends(IUnknownArray, _super);
        /**
         * Collection class for maintaining an array of types derived from IUnknown.
         * Provides a safer way to maintain reference counts than a native array.
         * @class IUnknownArray
         * @constructor
         */
        function IUnknownArray(elements) {
            if (elements === void 0) { elements = []; }
            _super.call(this, 'IUnknownArray');
            this._elements = elements;
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].addRef();
            }
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        IUnknownArray.prototype.destructor = function () {
            for (var i = 0, l = this._elements.length; i < l; i++) {
                this._elements[i].release();
            }
            this._elements = void 0;
            // Don't set the userName property to undefined so that we can report zombie calls.
            _super.prototype.destructor.call(this);
        };
        /**
         * Gets the element at the specified index, incrementing the reference count.
         * @method get
         * @param index {number}
         * @return {T}
         */
        IUnknownArray.prototype.get = function (index) {
            var element = this.getWeakRef(index);
            if (element) {
                element.addRef();
            }
            return element;
        };
        /**
         * Gets the element at the specified index, without incrementing the reference count.
         * @method getWeakRef
         * @param index {number}
         * @return {T}
         */
        IUnknownArray.prototype.getWeakRef = function (index) {
            return this._elements[index];
        };
        /**
         * @method indexOf
         * @param searchElement {T}
         * @param [fromIndex]
         * @return {number}
         */
        IUnknownArray.prototype.indexOf = function (searchElement, fromIndex) {
            return this._elements.indexOf(searchElement, fromIndex);
        };
        Object.defineProperty(IUnknownArray.prototype, "length", {
            /**
             * @property length
             * @return {number}
             */
            get: function () {
                if (this._elements) {
                    return this._elements.length;
                }
                else {
                    console.warn("IUnknownArray is now a zombie, length is undefined");
                    return void 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The slice() method returns a shallow copy of a portion of an array into a new array object.
         * It does not remove elements from the original array.
         * @method slice
         * @param [begin] {number}
         * @param [end] {number}
         */
        IUnknownArray.prototype.slice = function (begin, end) {
            return new IUnknownArray(this._elements.slice(begin, end));
        };
        /**
         * The splice() method changes the content of an array by removing existing elements and/or adding new elements.
         * @method splice
         * @param index {number}
         * @param deleteCount {number}
         * @return {IUnkownArray<T>}
         */
        IUnknownArray.prototype.splice = function (index, deleteCount) {
            // The release burdon is on the caller now.
            return transferOwnership(this._elements.splice(index, deleteCount));
        };
        /**
         * @method shift
         * @return {T}
         */
        IUnknownArray.prototype.shift = function () {
            // No need to addRef because ownership is being transferred to caller.
            return this._elements.shift();
        };
        /**
         * Traverse without Reference Counting
         * @method forEach
         * @param callback {(value: T, index: number)=>void}
         * @return {void}
         */
        IUnknownArray.prototype.forEach = function (callback) {
            return this._elements.forEach(callback);
        };
        /**
         * Pushes an element onto the tail of the list and increments the element reference count.
         * @method push
         * @param element {T}
         * @return {number}
         */
        IUnknownArray.prototype.push = function (element) {
            if (element) {
                element.addRef();
            }
            return this.pushWeakRef(element);
        };
        /**
         * Pushes an element onto the tail of the list without incrementing the element reference count.
         * @method pushWeakRef
         * @param element {T}
         * @return {number}
         */
        IUnknownArray.prototype.pushWeakRef = function (element) {
            return this._elements.push(element);
        };
        /**
         * @method pop
         * @return {T}
         */
        IUnknownArray.prototype.pop = function () {
            // No need to addRef because ownership is being transferred to caller.
            return this._elements.pop();
        };
        IUnknownArray.prototype.unshift = function (element) {
            element.addRef();
            return this.unshiftWeakRef(element);
        };
        IUnknownArray.prototype.unshiftWeakRef = function (element) {
            return this._elements.unshift(element);
        };
        return IUnknownArray;
    })(Shareable);
    return IUnknownArray;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/SlideCommands',["require", "exports", '../collections/IUnknownArray', '../utils/Shareable'], function (require, exports, IUnknownArray, Shareable) {
    var SlideCommands = (function (_super) {
        __extends(SlideCommands, _super);
        function SlideCommands() {
            _super.call(this, 'SlideCommands');
            this.commands = new IUnknownArray();
        }
        SlideCommands.prototype.destructor = function () {
            this.commands.release();
            this.commands = void 0;
            _super.prototype.destructor.call(this);
        };
        SlideCommands.prototype.pushWeakRef = function (command) {
            return this.commands.pushWeakRef(command);
        };
        SlideCommands.prototype.redo = function (slide, director) {
            for (var i = 0, iLength = this.commands.length; i < iLength; i++) {
                this.commands.getWeakRef(i).redo(slide, director);
            }
        };
        SlideCommands.prototype.undo = function (slide, director) {
            for (var i = this.commands.length - 1; i >= 0; i--) {
                this.commands.getWeakRef(i).undo(slide, director);
            }
        };
        return SlideCommands;
    })(Shareable);
    return SlideCommands;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/StringIUnknownMap',["require", "exports", '../checks/mustBeString', '../utils/Shareable'], function (require, exports, mustBeString, Shareable) {
    /**
     * @class StringIUnknownMap
     * @extends Shareable
     */
    var StringIUnknownMap = (function (_super) {
        __extends(StringIUnknownMap, _super);
        /**
         * <p>
         * A map of <code>string</code> to <code>V extends IUnknown</code>.
         * </p>
         * @class StringIUnknownMap
         * @constructor
         */
        function StringIUnknownMap() {
            _super.call(this, 'StringIUnknownMap');
            /**
             * @property elements
             * @type {{[key: string]: V}}
             */
            this.elements = {};
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        StringIUnknownMap.prototype.destructor = function () {
            var self = this;
            this.forEach(function (key) {
                self.putWeakRef(key, void 0);
            });
            _super.prototype.destructor.call(this);
        };
        /**
         * Determines whether the key exists in the map with a defined value.
         * @method exists
         * @param key {string}
         * @return {boolean} <p><code>true</code> if there is an element at the specified key.</p>
         */
        StringIUnknownMap.prototype.exists = function (key) {
            var element = this.elements[key];
            return element ? true : false;
        };
        /**
         * @method get
         * @param key {string}
         * @return {V}
         */
        StringIUnknownMap.prototype.get = function (key) {
            var element = this.elements[key];
            if (element) {
                element.addRef();
                return element;
            }
            else {
                return void 0;
            }
        };
        /**
         * @method getWeakRef
         * @param key {string}
         * @return {V}
         */
        StringIUnknownMap.prototype.getWeakRef = function (key) {
            return this.elements[key];
        };
        /**
         * @method put
         * @param key {string}
         * @param value {V}
         * @return {void}
         */
        StringIUnknownMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        /**
         * @method putWeakRef
         * @param key {string}
         * @param value {V}
         * @return {void}
         */
        StringIUnknownMap.prototype.putWeakRef = function (key, value) {
            mustBeString('key', key);
            var elements = this.elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
        };
        /**
         * @method forEach
         * @param callback {(key: string, value: V) => void}
         */
        StringIUnknownMap.prototype.forEach = function (callback) {
            var keys = this.keys;
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                var key = keys[i];
                callback(key, this.elements[key]);
            }
        };
        Object.defineProperty(StringIUnknownMap.prototype, "keys", {
            /**
             * @property keys
             * @type {string[]}
             */
            get: function () {
                return Object.keys(this.elements);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StringIUnknownMap.prototype, "values", {
            /**
             * @property values
             * @type {V[]}
             */
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
        /**
         * @method remove
         * @param key {string}
         * @return {V}
         */
        StringIUnknownMap.prototype.remove = function (key) {
            mustBeString('key', key);
            var value = this.elements[key];
            delete this.elements[key];
            return value;
        };
        return StringIUnknownMap;
    })(Shareable);
    return StringIUnknownMap;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/Slide',["require", "exports", '../collections/IUnknownArray', '../utils/Shareable', '../slideshow/SlideCommands', '../collections/StringIUnknownMap'], function (require, exports, IUnknownArray, Shareable, SlideCommands, StringIUnknownMap) {
    /**
     * @class Slide
     */
    var Slide = (function (_super) {
        __extends(Slide, _super);
        /**
         * @class Slide
         * @constructor
         */
        function Slide() {
            _super.call(this, 'Slide');
            /**
             * The time standard for this Slide.
             */
            this.now = 0;
            this.prolog = new SlideCommands();
            this.epilog = new SlideCommands();
            this.targets = [];
            this.mirrors = new StringIUnknownMap();
        }
        Slide.prototype.destructor = function () {
            this.prolog.release();
            this.prolog = void 0;
            this.epilog.release();
            this.epilog = void 0;
            this.targets = void 0;
            this.mirrors.release();
            this.mirrors = void 0;
            _super.prototype.destructor.call(this);
        };
        Slide.prototype.ensureTarget = function (target) {
            if (this.targets.indexOf(target) < 0) {
                this.targets.push(target);
            }
        };
        Slide.prototype.ensureMirror = function (target) {
            if (!this.mirrors.exists(target.uuid)) {
                this.mirrors.putWeakRef(target.uuid, new Mirror());
            }
        };
        Slide.prototype.pushAnimation = function (target, propName, animation) {
            this.ensureTarget(target);
            this.ensureMirror(target);
            var mirror = this.mirrors.getWeakRef(target.uuid);
            mirror.ensureAnimationLane(propName);
            var animationLane = mirror.animationLanes.getWeakRef(propName);
            animationLane.push(animation);
        };
        Slide.prototype.popAnimation = function (target, propName) {
            var mirror = this.mirrors.getWeakRef(target.uuid);
            var animationLane = mirror.animationLanes.getWeakRef(propName);
            return animationLane.pop();
        };
        /**
         * Update all currently running animations.
         * Essentially calls `apply` on each IAnimation in the queues of active objects.
         * @method advance
         * @param interval {number} Advances the static Slide.now property.
         */
        Slide.prototype.advance = function (interval) {
            this.now += interval;
            for (var i = 0, iLength = this.targets.length; i < iLength; i++) {
                var target = this.targets[i];
                /**
                 * `offset` is variable used to keep things running on schedule.
                 * If an animation finishes before the interval, it reports the
                 * duration `extra` that brings the tome to `now`. Subsequent animations
                 * get a head start by considering their start time to be now - offset.
                 */
                var offset = 0;
                var mirror = this.mirrors.getWeakRef(target.uuid);
                var names = mirror.animationLanes.keys;
                for (var j = 0; j < names.length; j++) {
                    var propName = names[j];
                    var animationLane = mirror.animationLanes.getWeakRef(propName);
                    offset = animationLane.apply(target, propName, this.now, offset);
                }
            }
        };
        Slide.prototype.doProlog = function (director, forward) {
            if (forward) {
                this.prolog.redo(this, director);
            }
            else {
                this.prolog.undo(this, director);
            }
        };
        Slide.prototype.doEpilog = function (director, forward) {
            if (forward) {
                this.epilog.redo(this, director);
            }
            else {
                this.epilog.undo(this, director);
            }
        };
        Slide.prototype.undo = function (director) {
            for (var i = 0, iLength = this.targets.length; i < iLength; i++) {
                var target = this.targets[i];
                var mirror = this.mirrors.getWeakRef(target.uuid);
                var names = mirror.animationLanes.keys;
                for (var j = 0; j < names.length; j++) {
                    var propName = names[j];
                    var animationLane = mirror.animationLanes.getWeakRef(propName);
                    animationLane.undo(target, propName);
                }
            }
        };
        return Slide;
    })(Shareable);
    var AnimationLane = (function (_super) {
        __extends(AnimationLane, _super);
        function AnimationLane() {
            _super.call(this, 'AnimationLane');
            this.completed = new IUnknownArray();
            this.remaining = new IUnknownArray();
        }
        AnimationLane.prototype.destructor = function () {
            this.completed.release();
            this.completed = void 0;
            this.remaining.release();
            this.remaining = void 0;
            _super.prototype.destructor.call(this);
        };
        AnimationLane.prototype.pop = function () {
            if (this.remaining.length > 0) {
                return this.remaining.pop();
            }
            else {
                return this.completed.pop();
            }
        };
        AnimationLane.prototype.push = function (animation) {
            return this.remaining.push(animation);
        };
        AnimationLane.prototype.pushWeakRef = function (animation) {
            return this.remaining.pushWeakRef(animation);
        };
        AnimationLane.prototype.apply = function (target, propName, now, offset) {
            var done = false;
            while (!done) {
                if (this.remaining.length > 0) {
                    var animation = this.remaining.getWeakRef(0);
                    animation.apply(target, propName, now, offset);
                    if (animation.done(target, propName)) {
                        offset = animation.extra(now);
                        this.completed.push(this.remaining.shift());
                    }
                    else {
                        done = true;
                    }
                }
                else {
                    done = true;
                }
            }
            return offset;
        };
        AnimationLane.prototype.undo = function (target, propName) {
            while (this.completed.length > 0) {
                this.remaining.unshift(this.completed.pop());
            }
            for (var i = this.remaining.length - 1; i >= 0; i--) {
                var animation = this.remaining.getWeakRef(i);
                animation.undo(target, propName);
            }
        };
        return AnimationLane;
    })(Shareable);
    /**
     * The companion to a target: IAnimationTarget containing animation state.
     */
    var Mirror = (function (_super) {
        __extends(Mirror, _super);
        function Mirror() {
            _super.call(this, 'Mirror');
            this.animationLanes = new StringIUnknownMap();
        }
        Mirror.prototype.destructor = function () {
            this.animationLanes.release();
            this.animationLanes = void 0;
            _super.prototype.destructor.call(this);
        };
        Mirror.prototype.ensureAnimationLane = function (key) {
            if (!this.animationLanes.exists(key)) {
                this.animationLanes.putWeakRef(key, new AnimationLane());
            }
        };
        return Mirror;
    })(Shareable);
    return Slide;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/Director',["require", "exports", '../slideshow/Slide', '../collections/IUnknownArray', '../utils/Shareable'], function (require, exports, Slide, IUnknownArray, Shareable) {
    /**
     * @class Director
     */
    var Director = (function (_super) {
        __extends(Director, _super);
        /**
         * @class Director
         * @constructor
         */
        function Director() {
            _super.call(this, 'Director');
            this.step = -1; // Position before the first slide.
            this.slides = new IUnknownArray([]);
            this.facets = {};
        }
        Director.prototype.destructor = function () {
            this.slides.release();
            this.slides = void 0;
            this.facets = void 0;
        };
        Director.prototype.addFacet = function (facet, facetName) {
            this.facets[facetName] = facet;
        };
        Director.prototype.getFacet = function (facetName) {
            return this.facets[facetName];
        };
        Director.prototype.removeFacet = function (facetName) {
            var facet = this.getFacet(facetName);
            delete this.facets[facetName];
            return facet;
        };
        /**
         * Creates a new Slide.
         * @method createSlide
         * @return {Slide}
         */
        Director.prototype.createSlide = function () {
            return new Slide();
        };
        Director.prototype.go = function (step, instant) {
            if (instant === void 0) { instant = false; }
            if (this.slides.length === 0) {
                return;
            }
            while (step < 0)
                step += this.slides.length + 1;
        };
        Director.prototype.forward = function (instant, delay) {
            if (instant === void 0) { instant = true; }
            if (delay === void 0) { delay = 0; }
            if (!this.canForward()) {
                return;
            }
            var slideLeaving = this.slides.getWeakRef(this.step);
            var slideEntering = this.slides.getWeakRef(this.step + 1);
            var self = this;
            var apply = function () {
                if (slideLeaving) {
                    slideLeaving.doEpilog(self, true);
                }
                if (slideEntering) {
                    slideEntering.doProlog(self, true);
                }
                self.step++;
            };
            if (delay) {
                setTimeout(apply, delay);
            }
            else {
                apply();
            }
        };
        Director.prototype.canForward = function () {
            return this.step < this.slides.length;
        };
        Director.prototype.backward = function (instant, delay) {
            if (instant === void 0) { instant = true; }
            if (delay === void 0) { delay = 0; }
            if (!this.canBackward()) {
                return;
            }
            var slideLeaving = this.slides.getWeakRef(this.step);
            var slideEntering = this.slides.getWeakRef(this.step - 1);
            var self = this;
            var apply = function () {
                if (slideLeaving) {
                    slideLeaving.undo(self);
                    slideLeaving.doProlog(self, false);
                }
                if (slideEntering) {
                    slideEntering.doEpilog(self, false);
                }
                self.step--;
            };
            if (delay) {
                setTimeout(apply, delay);
            }
            else {
                apply();
            }
        };
        Director.prototype.canBackward = function () {
            return this.step > -1;
        };
        Director.prototype.pushSlide = function (slide) {
            return this.slides.push(slide);
        };
        Director.prototype.popSlide = function (slide) {
            return this.slides.pop();
        };
        Director.prototype.advance = function (interval) {
            var slideIndex = this.step;
            if (slideIndex >= 0 && slideIndex < this.slides.length) {
                var slide = this.slides.get(slideIndex);
                if (slide) {
                    try {
                        slide.advance(interval);
                    }
                    finally {
                        slide.release();
                    }
                }
                else {
                    // This should never happen if we manage the index properly.
                    console.warn("No slide found at index " + this.step);
                }
            }
        };
        return Director;
    })(Shareable);
    return Director;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/DirectorKeyboardHandler',["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    var DirectorKeyboardHandler = (function (_super) {
        __extends(DirectorKeyboardHandler, _super);
        function DirectorKeyboardHandler(director) {
            _super.call(this, 'DirectorKeyboardHandler');
            this.director = director;
            this.director.addRef();
        }
        DirectorKeyboardHandler.prototype.destructor = function () {
            this.director.release();
            this.director = void 0;
            _super.prototype.destructor.call(this);
        };
        DirectorKeyboardHandler.prototype.keyDown = function (event) {
        };
        DirectorKeyboardHandler.prototype.keyUp = function (event) {
            switch (event.keyCode) {
                case 37:
                    {
                        this.director.backward();
                    }
                    break;
                case 39: {
                    this.director.forward();
                }
                default: {
                }
            }
        };
        return DirectorKeyboardHandler;
    })(Shareable);
    return DirectorKeyboardHandler;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/animations/WaitAnimation',["require", "exports", '../../utils/Shareable'], function (require, exports, Shareable) {
    var WaitAnimation = (function (_super) {
        __extends(WaitAnimation, _super);
        function WaitAnimation(duration) {
            _super.call(this, 'WaitAnimation');
            this.duration = duration;
            this.fraction = 0;
        }
        WaitAnimation.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        WaitAnimation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
            }
            if (this.duration > 0) {
                this.fraction = Math.min(1, (now - this.start) / this.duration);
            }
            else {
                this.fraction = 1;
            }
        };
        WaitAnimation.prototype.skip = function () {
            this.duration = 0;
        };
        WaitAnimation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        WaitAnimation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        WaitAnimation.prototype.done = function (target, propName) {
            return this.fraction === 1;
        };
        WaitAnimation.prototype.undo = function (target, propName) {
            this.start = void 0;
            this.fraction = 0;
        };
        return WaitAnimation;
    })(Shareable);
    return WaitAnimation;
});

define('davinci-eight/checks/isNumber',["require", "exports"], function (require, exports) {
    function isNumber(x) {
        return (typeof x === 'number');
    }
    return isNumber;
});

define('davinci-eight/checks/mustBeNumber',["require", "exports", '../checks/mustSatisfy', '../checks/isNumber'], function (require, exports, mustSatisfy, isNumber) {
    function beANumber() {
        return "be a `number`";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
        return value;
    }
    return mustBeInteger;
});

define('davinci-eight/math/clamp',["require", "exports", '../checks/mustBeNumber'], function (require, exports, mustBeNumber) {
    function clamp(x, min, max) {
        mustBeNumber('x', x);
        mustBeNumber('min', min);
        mustBeNumber('max', max);
        return (x < min) ? min : ((x > max) ? max : x);
    }
    return clamp;
});

define('davinci-eight/checks/isArray',["require", "exports"], function (require, exports) {
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    return isArray;
});

define('davinci-eight/checks/mustBeArray',["require", "exports", '../checks/mustSatisfy', '../checks/isArray'], function (require, exports, mustSatisfy, isArray) {
    function beAnArray() {
        return "be an array";
    }
    function mustBeArray(name, value, contextBuilder) {
        mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
        return value;
    }
    return mustBeArray;
});

define('davinci-eight/core/principalAngle',["require", "exports"], function (require, exports) {
    /**
     * Converts the angle specified into one in the closed interval [0, Math.PI]
     */
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
    return principalAngle;
});

define('davinci-eight/checks/isUndefined',["require", "exports"], function (require, exports) {
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }
    return isUndefined;
});

define('davinci-eight/checks/expectArg',["require", "exports", '../checks/isUndefined', '../checks/mustBeNumber'], function (require, exports, isUndefined, mustBeNumber) {
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
                var something = value;
                var x = something;
                mustBeNumber('x', x);
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
    /**
     * @class VectorN<T>
     */
    var VectorN = (function () {
        /**
         * @class VectorN<T>
         * @constructor
         * @param data {T[]}
         * @param modified [boolean = false]
         * @param [size]
         */
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
        Object.defineProperty(VectorN.prototype, "coords", {
            /**
             * @property data
             * @type {T[]}
             */
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
                this.modified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorN.prototype, "callback", {
            /**
             * @property callback
             * @type {() => T[]}
             */
            get: function () {
                return this._callback;
            },
            set: function (reactTo) {
                this._callback = reactTo;
                this._data = void 0;
                this.modified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorN.prototype, "length", {
            /**
             * @property length
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this.coords.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method clone
         * @return {VectorN<T>}
         */
        VectorN.prototype.clone = function () {
            return new VectorN(this._data, this.modified, this._size);
        };
        /**
         * @method getComponent
         * @param index {number}
         * @return {T}
         */
        VectorN.prototype.getComponent = function (index) {
            return this.coords[index];
        };
        /**
         * @method pop
         * @return {T}
         */
        VectorN.prototype.pop = function () {
            if (isUndefined(this._size)) {
                return this.coords.pop();
            }
            else {
                throw new Error(verbotenPop());
            }
        };
        /**
         * @method push
         * @param value {T}
         * @return {number}
         */
        VectorN.prototype.push = function (value) {
            if (isUndefined(this._size)) {
                var data = this.coords;
                var newLength = data.push(value);
                this.coords = data;
                return newLength;
            }
            else {
                throw new Error(verbotenPush());
            }
        };
        /**
         * @method setComponent
         * @param index {number}
         * @param value {T}
         * @return {void}
         */
        VectorN.prototype.setComponent = function (index, value) {
            var data = this.coords;
            var existing = data[index];
            if (value !== existing) {
                data[index] = value;
                this.coords = data;
                this.modified = true;
            }
        };
        /**
         * @method toArray
         * @param [array = []] {T[]}
         * @param [offset = 0] {number}
         * @return {T[]}
         */
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
        /**
         * @method toLocaleString
         * @return {string}
         */
        VectorN.prototype.toLocaleString = function () {
            return this.coords.toLocaleString();
        };
        /**
         * @method toString
         * @return {string}
         */
        VectorN.prototype.toString = function () {
            return this.coords.toString();
        };
        return VectorN;
    })();
    return VectorN;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/Color',["require", "exports", '../math/clamp', '../checks/mustBeArray', '../checks/mustBeNumber', '../core/principalAngle', '../math/VectorN'], function (require, exports, clamp, mustBeArray, mustBeNumber, principalAngle, VectorN) {
    var pow = Math.pow;
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    /**
     * <p>
     * A mutable type representing a color through its RGB components.
     * </p>
     * <p>
     * WARNING: In many object-oriented designs, types representing values are completely immutable.
     * In a graphics library where data changes rapidly and garbage collection might become an issue,
     * it is common to use reference types, such as in this design. This mutability can lead to
     * difficult bugs because it is hard to reason about where a color may have changed.
     * </p>
     *
     * @class Color
     * @extends VectorN
     * @implements ColorRGB
     */
    var Color = (function (_super) {
        __extends(Color, _super);
        /**
         * @class Color
         * @constructor
         * @param data {number[]}
         * @param areYouSure {boolean}
         */
        function Color(r, g, b) {
            _super.call(this, [r, g, b], false, 3);
        }
        Object.defineProperty(Color.prototype, "r", {
            /**
             * @property r
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_R];
            },
            set: function (r) {
                this.coords[COORD_R] = clamp(r, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            /**
             * @property g
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_G];
            },
            set: function (g) {
                this.coords[COORD_G] = clamp(g, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            /**
             * @property b
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_B];
            },
            set: function (b) {
                this.coords[COORD_B] = clamp(b, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method clone
         * @return {Color}
         * @chainable
         */
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b);
        };
        /**
         * @method copy
         * @param color {ColorRGB}
         * @return {Color}
         * @chainable
         */
        Color.prototype.copy = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            return this;
        };
        /**
         * @method interpolate
         * @param target {ColorRGB}
         * @param α {number}
         * @return {Color}
         * @chainable
         */
        Color.prototype.interpolate = function (target, α) {
            this.r += (target.r - this.r) * α;
            this.g += (target.g - this.g) * α;
            this.b += (target.b - this.b) * α;
            return this;
        };
        Object.defineProperty(Color.prototype, "luminance", {
            /**
             * @property luminance
             * @type {number}
             * @readOnly
             */
            get: function () {
                return Color.luminance(this.r, this.g, this.b);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method toString
         * @return {string}
         */
        Color.prototype.toString = function () {
            // FIXME: Use vector stuff
            return "Color(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        /**
         * @method luminance
         * @param r {number}
         * @param g {number}
         * @param b {number}
         * @return {number}
         * @static
         */
        Color.luminance = function (r, g, b) {
            mustBeNumber('r', r);
            mustBeNumber('g', g);
            mustBeNumber('b', b);
            var γ = 2.2;
            return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
        };
        /**
         * @method fromColor
         * @param color {ColorRGB}
         * @return {Color}
         * @static
         * @chainable
         */
        Color.fromColor = function (color) {
            return new Color(color.r, color.g, color.b);
        };
        /**
         * @method fromCoords
         * @param coords {number[]}
         * @return {Color}
         * @chainable
         */
        Color.fromCoords = function (coords) {
            mustBeArray('coords', coords);
            var r = mustBeNumber('r', coords[COORD_R]);
            var g = mustBeNumber('g', coords[COORD_G]);
            var b = mustBeNumber('b', coords[COORD_B]);
            return new Color(r, g, b);
        };
        /**
         * Converts an angle, radius, height to a color on a color wheel.
         * @method fromHSL
         * @param H {number}
         * @param S {number}
         * @param L {number}
         * @return {Color}
         * @static
         * @chainable
         */
        Color.fromHSL = function (H, S, L) {
            mustBeNumber('H', H);
            mustBeNumber('S', S);
            mustBeNumber('L', L);
            var C = (1 - Math.abs(2 * L - 1)) * S;
            /**
             * This function captures C and L
             */
            function matchLightness(R, G, B) {
                var x = Color.luminance(R, G, B);
                var m = L - 0.5 * C;
                return new Color(R + m, G + m, B + m);
            }
            var sextant = ((principalAngle(H) / Math.PI) * 3) % 6;
            var X = C * (1 - Math.abs(sextant % 2 - 1));
            if (sextant >= 0 && sextant < 1) {
                return matchLightness(C, X /*C*(sextant-0)*/, 0);
            }
            else if (sextant >= 1 && sextant < 2) {
                return matchLightness(X /*C*(2-sextant)*/, C, 0);
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
        /**
         * @method fromRGB
         * @param r {number}
         * @param g {number}
         * @param b {number}
         * @return {Color}
         * @static
         * @chainable
         */
        Color.fromRGB = function (r, g, b) {
            mustBeNumber('r', r);
            mustBeNumber('g', g);
            mustBeNumber('b', b);
            return new Color(r, g, b);
        };
        /**
         * @method interpolate
         * @param a {ColorRGB}
         * @param b {ColorRGB}
         * @param α {number}
         * @return {Color}
         * @static
         * @chainable
         */
        Color.interpolate = function (a, b, α) {
            return Color.fromColor(a).interpolate(b, α);
        };
        /**
         * @property black
         * @type {Color}
         * @static
         */
        Color.black = new Color(0, 0, 0);
        /**
         * @property blue
         * @type {Color}
         * @static
         */
        Color.blue = new Color(0, 0, 1);
        /**
         * @property green
         * @type {Color}
         * @static
         */
        Color.green = new Color(0, 1, 0);
        /**
         * @property cyan
         * @type {Color}
         * @static
         */
        Color.cyan = new Color(0, 1, 1);
        /**
         * @property red
         * @type {Color}
         * @static
         */
        Color.red = new Color(1, 0, 0);
        /**
         * @property magenta
         * @type {Color}
         * @static
         */
        Color.magenta = new Color(1, 0, 1);
        /**
         * @property yellow
         * @type {Color}
         * @static
         */
        Color.yellow = new Color(1, 1, 0);
        /**
         * @property white
         * @type {Color}
         * @static
         */
        Color.white = new Color(1, 1, 1);
        return Color;
    })(VectorN);
    return Color;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/animations/ColorAnimation',["require", "exports", '../../utils/Shareable', '../../core/Color'], function (require, exports, Shareable, Color) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var ColorAnimation = (function (_super) {
        __extends(ColorAnimation, _super);
        function ColorAnimation(color, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'ColorAnimation');
            this.from = void 0;
            this.to = Color.fromColor(color);
            this.duration = duration;
            this.start = 0;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        ColorAnimation.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        ColorAnimation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
                if (this.from === void 0) {
                    var data = target.getProperty(propName);
                    if (data) {
                        this.from = Color.fromCoords(data);
                    }
                }
            }
            var from = this.from;
            var to = this.to;
            var ease = this.ease;
            // Calculate animation progress / fraction.
            var fraction;
            if (this.duration > 0) {
                fraction = Math.min(1, (now - this.start) / (this.duration || 1));
            }
            else {
                fraction = 1;
            }
            this.fraction = fraction;
            // Simple easing support.
            var rolloff;
            switch (ease) {
                case 'in':
                    rolloff = 1 - (1 - fraction) * (1 - fraction);
                    break;
                case 'out':
                    rolloff = fraction * fraction;
                    break;
                case 'linear':
                    rolloff = fraction;
                    break;
                default:
                    rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
                    break;
            }
            target.setProperty(propName, Color.interpolate(from, to, rolloff).coords);
        };
        ColorAnimation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        ColorAnimation.prototype.skip = function (target, propName) {
            this.duration = 0;
            this.fraction = 1;
            this.done(target, propName);
        };
        ColorAnimation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        ColorAnimation.prototype.done = function (target, propName) {
            if (this.fraction === 1) {
                // Set final value.
                target.setProperty(propName, this.to.coords);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        ColorAnimation.prototype.undo = function (target, propName) {
            if (this.from) {
                target.setProperty(propName, this.from.coords);
                this.from = void 0;
                this.start = void 0;
                this.fraction = 0;
            }
        };
        return ColorAnimation;
    })(Shareable);
    return ColorAnimation;
});

// Quadratic Bezier
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
    return b2;
});

// Cubic Bezier Functions
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
    function b3(t, p0, p1, p2, p3) {
        return b3p0(t, p0) + b3p1(t, p1) + b3p2(t, p2) + b3p3(t, p3);
    }
    return b3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/R2',["require", "exports", '../geometries/b2', '../geometries/b3', '../math/VectorN'], function (require, exports, b2, b3, VectorN) {
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var COORD_Y = 1;
    /**
     * @class R2
     */
    var R2 = (function (_super) {
        __extends(R2, _super);
        /**
         * @class R2
         * @constructor
         * @param data {number[]} Default is [0, 0].
         * @param modified {boolean} Default is false.
         */
        function R2(data, modified) {
            if (data === void 0) { data = [0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 2);
        }
        Object.defineProperty(R2.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
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
        Object.defineProperty(R2.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
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
        R2.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        R2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        R2.prototype.add = function (v, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.x += v.x * alpha;
            this.y += v.y * alpha;
            return this;
        };
        R2.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ m * this<sup>T</sup></code>
         * </p>
         * @method applyMatrix
         * @param m {Matrix2}
         * @return {R2} <code>this</code>
         * @chainable
         */
        R2.prototype.applyMatrix = function (m) {
            var x = this.x;
            var y = this.y;
            var e = m.elements;
            this.x = e[0x0] * x + e[0x2] * y;
            this.y = e[0x1] * x + e[0x3] * y;
            return this;
        };
        /**
         * @method cubicBezier
         * @param t {number}
         * @param controlBegin {VectorE2}
         * @param endPoint {VectorE2}
         * @return {R2}
         */
        R2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            this.x = x;
            this.y = y;
            return this;
        };
        R2.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        R2.prototype.subScalar = function (s) {
            this.x -= s;
            this.y -= s;
            return this;
        };
        R2.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        };
        R2.prototype.scale = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        R2.prototype.divByScalar = function (scalar) {
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
        R2.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            if (this.y > v.y) {
                this.y = v.y;
            }
            return this;
        };
        R2.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            if (this.y < v.y) {
                this.y = v.y;
            }
            return this;
        };
        R2.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        };
        R2.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        };
        R2.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        };
        R2.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            return this;
        };
        /**
         * @method neg
         * @return {R2} <code>this</code>
         * @chainable
         */
        R2.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        /**
         * @method distanceTo
         * @param point {VectorE2}
         * @return {number}
         */
        R2.prototype.distanceTo = function (position) {
            return sqrt(this.quadranceTo(position));
        };
        R2.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        R2.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        R2.prototype.direction = function () {
            return this.divByScalar(this.magnitude());
        };
        R2.prototype.squaredNorm = function () {
            return this.x * this.x + this.y * this.y;
        };
        R2.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            var dy = this.y - position.y;
            return dx * dx + dy * dy;
        };
        /**
         * @method quadraticBezier
         * @param t {number}
         * @param controlPoint {VectorE2}
         * @param endPoint {VectorE2}
         * @return {R2}
         */
        R2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2(t, this.x, controlPoint.x, endPoint.x);
            var y = b2(t, this.y, controlPoint.y, endPoint.y);
            this.x = x;
            this.y = y;
            return this;
        };
        R2.prototype.reflect = function (n) {
            // FIXME: TODO
            return this;
        };
        R2.prototype.rotate = function (rotor) {
            return this;
        };
        /**
         * this ⟼ this + (v - this) * α
         * @method lerp
         * @param v {VectorE2}
         * @param α {number}
         * @return {R2}
         * @chainable
         */
        R2.prototype.lerp = function (v, α) {
            this.x += (v.x - this.x) * α;
            this.y += (v.y - this.y) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @param α {number}
         * @return {R2} <code>this</code>
         * @chainable
         */
        R2.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        R2.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y));
        };
        R2.prototype.slerp = function (v, α) {
            return this;
        };
        R2.prototype.toExponential = function () {
            return "TODO: R2.toExponential";
        };
        R2.prototype.toFixed = function (digits) {
            return "TODO: R2.toString";
        };
        R2.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            return this;
        };
        R2.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            return this;
        };
        R2.prototype.clone = function () {
            return new R2([this.x, this.y]);
        };
        /**
         * Sets this vector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {R2}
         * @chainable
         */
        R2.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            return this;
        };
        /**
         * @method copy
         * @param vector {VectorE2}
         * @return {R2}
         * @static
         */
        R2.copy = function (vector) {
            return new R2([vector.x, vector.y]);
        };
        /**
         * @method lerp
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @param α {number}
         * @return {R2} <code>a + α * (b - a)</code>
         * @static
         */
        R2.lerp = function (a, b, α) {
            return R2.copy(b).sub(a).scale(α).add(a);
        };
        /**
         * @method random
         * @return {R2}
         * @static
         */
        R2.random = function () {
            return new R2([Math.random(), Math.random()]);
        };
        return R2;
    })(VectorN);
    return R2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/animations/Vector2Animation',["require", "exports", '../../utils/Shareable', '../../math/R2'], function (require, exports, Shareable, R2) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var Vector2Animation = (function (_super) {
        __extends(Vector2Animation, _super);
        function Vector2Animation(value, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'Vector2Animation');
            this.to = R2.copy(value);
            this.duration = duration;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        Vector2Animation.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Vector2Animation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
                if (this.from === void 0) {
                    var data = target.getProperty(propName);
                    if (data) {
                        this.from = new R2(data);
                    }
                }
            }
            var ease = this.ease;
            // Calculate animation progress / fraction.
            var fraction;
            if (this.duration > 0) {
                fraction = Math.min(1, (now - this.start) / (this.duration || 1));
            }
            else {
                fraction = 1;
            }
            this.fraction = fraction;
            // Simple easing support.
            var rolloff;
            switch (ease) {
                case 'in':
                    rolloff = 1 - (1 - fraction) * (1 - fraction);
                    break;
                case 'out':
                    rolloff = fraction * fraction;
                    break;
                case 'linear':
                    rolloff = fraction;
                    break;
                default:
                    rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
                    break;
            }
            var lerp = R2.lerp(this.from, this.to, rolloff);
            // The animator sends the data back to the animation target suitable for the R2 constructor.
            target.setProperty(propName, lerp.coords);
        };
        Vector2Animation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Vector2Animation.prototype.skip = function (target, propName) {
            this.duration = 0;
            this.fraction = 1;
            this.done(target, propName);
        };
        Vector2Animation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        Vector2Animation.prototype.done = function (target, propName) {
            if (this.fraction === 1) {
                // Set final value.
                target.setProperty(propName, this.to.coords);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        Vector2Animation.prototype.undo = function (target, propName) {
            if (this.from) {
                target.setProperty(propName, this.from.coords);
                this.from = void 0;
                this.start = void 0;
                this.fraction = 0;
            }
        };
        return Vector2Animation;
    })(Shareable);
    return Vector2Animation;
});

define('davinci-eight/math/dotVectorCartesianE3',["require", "exports"], function (require, exports) {
    /**
     * Computes the dot product of the Cartesian components in a Euclidean metric
     */
    function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
        return ax * bx + ay * by + az * bz;
    }
    return dotVectorCartesianE3;
});

define('davinci-eight/math/dotVectorE3',["require", "exports", '../math/dotVectorCartesianE3', '../checks/isDefined'], function (require, exports, dotVectorCartesianE3, isDefined) {
    function dotVectorE3(a, b) {
        if (isDefined(a) && isDefined(b)) {
            return dotVectorCartesianE3(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        else {
            return void 0;
        }
    }
    return dotVectorE3;
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
    return addE3;
});

define('davinci-eight/math/compG3Get',["require", "exports"], function (require, exports) {
    // Symbolic constants for the coordinate indices into the data array.
    // These are chosen to match those used by Euclidean3.
    // TODO: The goal should be to protect the user from changes in ordering.
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
                return m.α;
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
                return m.β;
            }
            default: {
                throw new Error("index => " + index);
            }
        }
    }
    return gcompE3;
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
    return extE3;
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
                m.α = value;
                break;
            case COORD_X:
                m.x = value;
                break;
            case COORD_Y:
                m.y = value;
                break;
            case COORD_Z:
                m.z = value;
                break;
            case COORD_XY:
                m.xy = value;
                break;
            case COORD_YZ:
                m.yz = value;
                break;
            case COORD_ZX:
                m.zx = value;
                break;
            case COORD_XYZ:
                m.β = value;
                break;
            default:
                throw new Error("index => " + index);
        }
    }
    return compG3Set;
});

define('davinci-eight/math/extG3',["require", "exports", '../math/compG3Get', '../math/extE3', '../math/compG3Set'], function (require, exports, get, extE3, set) {
    function extG3(a, b, out) {
        var a0 = get(a, 0);
        var a1 = get(a, 1);
        var a2 = get(a, 2);
        var a3 = get(a, 3);
        var a4 = get(a, 4);
        var a5 = get(a, 5);
        var a6 = get(a, 6);
        var a7 = get(a, 7);
        var b0 = get(b, 0);
        var b1 = get(b, 1);
        var b2 = get(b, 2);
        var b3 = get(b, 3);
        var b4 = get(b, 4);
        var b5 = get(b, 5);
        var b6 = get(b, 6);
        var b7 = get(b, 7);
        for (var i = 0; i < 8; i++) {
            set(out, i, extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    return extG3;
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
    return lcoE3;
});

define('davinci-eight/math/lcoG3',["require", "exports", '../math/compG3Get', '../math/lcoE3', '../math/compG3Set'], function (require, exports, get, lcoE3, set) {
    function lcoG3(a, b, out) {
        var a0 = get(a, 0);
        var a1 = get(a, 1);
        var a2 = get(a, 2);
        var a3 = get(a, 3);
        var a4 = get(a, 4);
        var a5 = get(a, 5);
        var a6 = get(a, 6);
        var a7 = get(a, 7);
        var b0 = get(b, 0);
        var b1 = get(b, 1);
        var b2 = get(b, 2);
        var b3 = get(b, 3);
        var b4 = get(b, 4);
        var b5 = get(b, 5);
        var b6 = get(b, 6);
        var b7 = get(b, 7);
        for (var i = 0; i < 8; i++) {
            set(out, i, lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    return lcoG3;
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
    /**
     * Determines whether a property name is callable on an object.
     */
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
        // unit: makeUnaryUniversalFunction('unit', function(x: number) {return x / Math.abs(x);}),
        Math: {
            cosh: cosh,
            sinh: sinh
        }
    };
    return mathcore;
});

define('davinci-eight/math/mulE3',["require", "exports"], function (require, exports) {
    /**
     * Multiplication of G3.
     * This was originally written for asm.
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
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    return mulE3;
});

define('davinci-eight/math/mulG3',["require", "exports", '../math/compG3Get', '../math/mulE3', '../math/compG3Set'], function (require, exports, get, mulE3, set) {
    function mulG3(a, b, out) {
        var a0 = get(a, 0);
        var a1 = get(a, 1);
        var a2 = get(a, 2);
        var a3 = get(a, 3);
        var a4 = get(a, 4);
        var a5 = get(a, 5);
        var a6 = get(a, 6);
        var a7 = get(a, 7);
        var b0 = get(b, 0);
        var b1 = get(b, 1);
        var b2 = get(b, 2);
        var b3 = get(b, 3);
        var b4 = get(b, 4);
        var b5 = get(b, 5);
        var b6 = get(b, 6);
        var b7 = get(b, 7);
        for (var i = 0; i < 8; i++) {
            set(out, i, mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    return mulG3;
});

define('davinci-eight/checks/isInteger',["require", "exports", '../checks/isNumber'], function (require, exports, isNumber) {
    function isInteger(x) {
        // % coerces its operand to numbers so a typeof test is required.
        // Not ethat ECMAScript 6 provides Number.isInteger().
        return isNumber(x) && x % 1 === 0;
    }
    return isInteger;
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/NotImplementedError',["require", "exports"], function (require, exports) {
    var NotImplementedError = (function (_super) {
        __extends(NotImplementedError, _super);
        function NotImplementedError(message) {
            _super.call(this, message);
            this.name = 'NotImplementedError';
        }
        return NotImplementedError;
    })(Error);
    return NotImplementedError;
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
    return rcoE3;
});

define('davinci-eight/math/rcoG3',["require", "exports", '../math/compG3Get', '../math/rcoE3', '../math/compG3Set'], function (require, exports, get, rcoE3, set) {
    function rcoG3(a, b, out) {
        var a0 = get(a, 0);
        var a1 = get(a, 1);
        var a2 = get(a, 2);
        var a3 = get(a, 3);
        var a4 = get(a, 4);
        var a5 = get(a, 5);
        var a6 = get(a, 6);
        var a7 = get(a, 7);
        var b0 = get(b, 0);
        var b1 = get(b, 1);
        var b2 = get(b, 2);
        var b3 = get(b, 3);
        var b4 = get(b, 4);
        var b5 = get(b, 5);
        var b6 = get(b, 6);
        var b7 = get(b, 7);
        for (var i = 0; i < 8; i++) {
            set(out, i, rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    return rcoG3;
});

define('davinci-eight/math/scpG3',["require", "exports", '../math/compG3Get', '../math/mulE3', '../math/compG3Set'], function (require, exports, get, mulE3, set) {
    function scpG3(a, b, out) {
        var a0 = get(a, 0);
        var a1 = get(a, 1);
        var a2 = get(a, 2);
        var a3 = get(a, 3);
        var a4 = get(a, 4);
        var a5 = get(a, 5);
        var a6 = get(a, 6);
        var a7 = get(a, 7);
        var b0 = get(b, 0);
        var b1 = get(b, 1);
        var b2 = get(b, 2);
        var b3 = get(b, 3);
        var b4 = get(b, 4);
        var b5 = get(b, 5);
        var b6 = get(b, 6);
        var b7 = get(b, 7);
        set(out, 0, mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
        set(out, 1, 0);
        set(out, 2, 0);
        set(out, 3, 0);
        set(out, 4, 0);
        set(out, 5, 0);
        set(out, 6, 0);
        set(out, 7, 0);
        return out;
    }
    return scpG3;
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
    return squaredNormG3;
});

define('davinci-eight/math/stringFromCoordinates',["require", "exports", '../checks/isDefined', '../checks/mustBeArray'], function (require, exports, isDefined, mustBeArray) {
    function isLabelOne(label) {
        if (typeof label === 'string') {
            return label === "1";
        }
        else {
            var labels = mustBeArray('label', label);
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
            var labels = mustBeArray('label', label);
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
                // The coordinate is negative.
                if (typeof label === 'string') {
                    // There's only one label, we must use minus signs.
                    sb.push("-");
                }
                else {
                    var labels = mustBeArray('label', label);
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
                        // This could be considered an error, but we'll let appendLabel deal with it!
                        sb.push("-");
                    }
                }
            }
            var n = Math.abs(coord);
            if (n === 1) {
                // 1 times something is just 1, so we only need the label.
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
            if (isDefined(coord)) {
                appendCoord(coord, numberToString, labels[i], sb);
            }
            else {
                // We'll just say that the whole thing is undefined.
                return void 0;
            }
        }
        return sb.length > 0 ? sb.join("") : "0";
    }
    return stringFromCoordinates;
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
    return subE3;
});

define('davinci-eight/math/QQ',["require", "exports", '../checks/mustBeInteger', '../i18n/readOnly'], function (require, exports, mustBeInteger, readOnly) {
    /**
     * @class QQ
     */
    var QQ = (function () {
        /**
         * The QQ class represents a rational number, ℚ.
         *
         * The QQ implementation is that of an <em>immutable</em> (value) type.
         *
         * The numerator and denominator are reduced to their lowest form.
         *
         * @class QQ
         * @constructor
         * @param {number} n The numerator, an integer.
         * @param {number} d The denominator, an integer.
         */
        function QQ(n, d) {
            mustBeInteger('n', n);
            mustBeInteger('d', d);
            var g;
            var gcd = function (a, b) {
                mustBeInteger('a', a);
                mustBeInteger('b', b);
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
            /**
             * @property numer
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._numer;
            },
            set: function (unused) {
                throw new Error(readOnly('numer').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
            /**
             * @property denom
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._denom;
            },
            set: function (unused) {
                throw new Error(readOnly('denom').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method add
         * @param rhs {QQ}
         * @return {QQ}
         */
        QQ.prototype.add = function (rhs) {
            return new QQ(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        /**
         * @method sub
         * @param rhs {QQ}
         * @return {QQ}
         */
        QQ.prototype.sub = function (rhs) {
            return new QQ(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        /**
         * @method mul
         * @param rhs {QQ}
         * @return {QQ}
         */
        QQ.prototype.mul = function (rhs) {
            return new QQ(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        /**
         * @method div
         * @param rhs {QQ}
         * @return {QQ}
         */
        QQ.prototype.div = function (rhs) {
            if (typeof rhs === 'number') {
                return new QQ(this._numer, this._denom * rhs);
            }
            else {
                return new QQ(this._numer * rhs._denom, this._denom * rhs._numer);
            }
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        QQ.prototype.isOne = function () {
            return this._numer === 1 && this._denom === 1;
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        QQ.prototype.isZero = function () {
            return this._numer === 0 && this._denom === 1;
        };
        /**
         * Computes the multiplicative inverse of this rational number.
         * @method inv
         * @return {QQ}
         */
        QQ.prototype.inv = function () {
            return new QQ(this._denom, this._numer);
        };
        /**
         * Computes the additive inverse of this rational number.
         * @method neg
         * @return {QQ}
         */
        QQ.prototype.neg = function () {
            return new QQ(-this._numer, this._denom);
        };
        /**
         * @method equals
         * @param other {QQ}
         * @return {boolean}
         */
        QQ.prototype.equals = function (other) {
            if (other instanceof QQ) {
                return this._numer * other._denom === this._denom * other._numer;
            }
            else {
                return false;
            }
        };
        /**
         * Computes a non-normative string representation of this rational.
         */
        QQ.prototype.toString = function () {
            return "" + this._numer + "/" + this._denom + "";
        };
        /**
         * @method __add__
         * @param rhs {any}
         * @return {QQ}
         * @private
         */
        QQ.prototype.__add__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.add(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __radd__
         * @param lhs {any}
         * @return {QQ}
         * @private
         */
        QQ.prototype.__radd__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __sub__
         * @param rhs {any}
         * @return {QQ}
         * @private
         */
        QQ.prototype.__sub__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.sub(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rsub__
         * @param lhs {any}
         * @return {QQ}
         * @private
         */
        QQ.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.sub(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __mul__
         * @param rhs {any}
         * @return {QQ}
         * @private
         */
        QQ.prototype.__mul__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rmul__
         * @param lhs {any}
         * @return {QQ}
         * @private
         */
        QQ.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __div__
         * @param div {any}
         * @return {QQ}
         * @private
         */
        QQ.prototype.__div__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rdiv__
         * @param lhs {any}
         * @return {QQ}
         * @private
         */
        QQ.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __pos__
         * @return {QQ}
         * @private
         */
        QQ.prototype.__pos__ = function () {
            return this;
        };
        /**
         * @method __neg__
         * @return {QQ}
         * @private
         */
        QQ.prototype.__neg__ = function () {
            return this.neg();
        };
        /**
         * @property ONE
         * @type {QQ}
         * @static
         */
        QQ.ONE = new QQ(1, 1);
        /**
         * @property TWO
         * @type {QQ}
         * @static
         */
        QQ.TWO = new QQ(2, 1);
        /**
         * @property MINUS_ONE
         * @type {QQ}
         * @static
         */
        QQ.MINUS_ONE = new QQ(-1, 1);
        /**
         * @property ZERO
         * @type {QQ}
         * @static
         */
        QQ.ZERO = new QQ(0, 1);
        return QQ;
    })();
    return QQ;
});

define('davinci-eight/math/Dimensions',["require", "exports", '../math/QQ'], function (require, exports, QQ) {
    var R0 = QQ.ZERO;
    var R1 = QQ.ONE;
    var M1 = QQ.MINUS_ONE;
    function assertArgDimensions(name, arg) {
        if (arg instanceof Dimensions) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a Dimensions");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof QQ) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a QQ");
        }
    }
    /**
     * @class Dimensions
     */
    var Dimensions = (function () {
        /**
         * The Dimensions class captures the physical dimensions associated with a unit of measure.
         *
         * @class Dimensions
         * @constructor
         * @param {QQ} M The mass component of the dimensions object.
         * @param {QQ} L The length component of the dimensions object.
         * @param {QQ} T The time component of the dimensions object.
         * @param {QQ} Q The charge component of the dimensions object.
         * @param {QQ} temperature The temperature component of the dimensions object.
         * @param {QQ} amount The amount component of the dimensions object.
         * @param {QQ} intensity The intensity component of the dimensions object.
         */
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
        /**
         * Returns the dimensions if they are all equal, otherwise throws an <code>Error</code>
         * @method compatible
         * @param rhs {Dimensions}
         * @return {Dimensions} <code>this</code>
         */
        Dimensions.prototype.compatible = function (rhs) {
            if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
                return this;
            }
            else {
                throw new Error("Dimensions must be equal (" + this + ", " + rhs + ")");
            }
        };
        /**
         * Multiplies dimensions by adding rational exponents.
         * @method mul
         * @param rhs {Dimensions}
         * @return {Dimensions} <code>this * rhs</code>
         */
        Dimensions.prototype.mul = function (rhs) {
            return new Dimensions(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        /**
         * Divides dimensions by subtracting rational exponents.
         * @method div
         * @param rhs {Dimensions}
         * @return {Dimensions} <code>this / rhs</code>
         */
        Dimensions.prototype.div = function (rhs) {
            return new Dimensions(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        /**
         * Computes the power function by multiplying rational exponents.
         * @method div
         * @param rhs {Dimensions}
         * @return {Dimensions} <code>pow(this, rhs)</code>
         */
        Dimensions.prototype.pow = function (exponent) {
            return new Dimensions(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        /**
         * Computes the square root by dividing each rational component by two.
         * @method sqrt
         * @return {Dimensions}
         */
        Dimensions.prototype.sqrt = function () {
            return new Dimensions(this.M.div(QQ.TWO), this.L.div(QQ.TWO), this.T.div(QQ.TWO), this.Q.div(QQ.TWO), this.temperature.div(QQ.TWO), this.amount.div(QQ.TWO), this.intensity.div(QQ.TWO));
        };
        /**
         * Determines whether all the exponents of this dimensions number are zero.
         *
         * @method isOne
         * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
         */
        Dimensions.prototype.isOne = function () {
            return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        Dimensions.prototype.isZero = function () {
            return false;
        };
        /**
         * Computes the multiplicative inverse of this dimensions number.
         * This is achived by changing the signs of all the exponent quantities.
         * @method inv
         * @return {Dimensions}
         */
        Dimensions.prototype.inv = function () {
            return new Dimensions(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
        };
        Dimensions.prototype.neg = function () {
            return this;
        };
        /**
         * Creates a representation of this <code>Dimensions</code> instance.
         * @method toString
         * @return {string}
         */
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
        /**
         * @method __add__
         * @param rhs {any}
         * @return {Dimensions}
         */
        Dimensions.prototype.__add__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.compatible(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __radd__
         * @param lhs {any}
         * @return {Dimensions}
         */
        Dimensions.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.compatible(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __sub__
         * @param rhs {any}
         * @return {Dimensions}
         */
        Dimensions.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.compatible(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rsub__
         * @param lhs {any}
         * @return {Dimensions}
         */
        Dimensions.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.compatible(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __mul__
         * @param rhs {any}
         * @return {Dimensions}
         */
        Dimensions.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rmul__
         * @param lhs {any}
         * @return {Dimensions}
         */
        Dimensions.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __div__
         * @param rhs {any}
         * @return {Dimensions}
         */
        Dimensions.prototype.__div__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rdiv__
         * @param lhs {any}
         * @return {Dimensions}
         */
        Dimensions.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __pos__
         * @return {Dimensions}
         */
        Dimensions.prototype.__pos__ = function () {
            return this;
        };
        /**
         * @method __neg__
         * @return {Dimensions}
         */
        Dimensions.prototype.__neg__ = function () {
            return this;
        };
        /**
         * @property ONE
         * @type {Dimensions}
         * @static
         */
        Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0);
        /**
         * @property MASS
         * @type {Dimensions}
         * @static
         */
        Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
        /**
         * @property LENGTH
         * @type {Dimensions}
         * @static
         */
        Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
        /**
         * @property TIME
         * @type {Dimensions}
         * @static
         */
        Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
        /**
         * @property CHARGE
         * @type {Dimensions}
         * @static
         */
        Dimensions.CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
        /**
         * @property CURRENT
         * @type {Dimensions}
         * @static
         */
        Dimensions.CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0);
        /**
         * @property TEMPERATURE
         * @type {Dimensions}
         * @static
         */
        Dimensions.TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
        /**
         * @property AMOUNT
         * @type {Dimensions}
         * @static
         */
        Dimensions.AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
        /**
         * @property INTENSITY
         * @type {Dimensions}
         * @static
         */
        Dimensions.INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1);
        return Dimensions;
    })();
    return Dimensions;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/UnitError',["require", "exports"], function (require, exports) {
    var UnitError = (function (_super) {
        __extends(UnitError, _super);
        function UnitError(message) {
            _super.call(this, message);
            this.name = 'UnitError';
        }
        return UnitError;
    })(Error);
    return UnitError;
});

define('davinci-eight/math/Unit',["require", "exports", '../math/Dimensions', '../math/QQ', '../math/UnitError'], function (require, exports, Dimensions, QQ, UnitError) {
    var LABELS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'candela'];
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
        if (arg instanceof QQ) {
            return arg;
        }
        else {
            throw new UnitError("Argument '" + arg + "' must be a QQ");
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
    var dumbString = function (multiplier, dimensions, labels) {
        assertArgNumber('multiplier', multiplier);
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
        operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
        scaleString = multiplier === 1 ? "" : "" + multiplier;
        unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
            return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
    };
    var unitString = function (multiplier, dimensions, labels) {
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
        return dumbString(multiplier, dimensions, labels);
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
    /**
     * @class Unit
     */
    var Unit = (function () {
        /**
         * The Unit class represents the units for a measure.
         *
         * @class Unit
         * @constructor
         * @param {number} multiplier
         * @param {Dimensions} dimensions
         * @param {string[]} labels The label strings to use for each dimension.
         */
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
        /**
         * @method compatible
         * @param rhs {Unit}
         * @return {Unit}
         */
        Unit.prototype.compatible = function (rhs) {
            if (rhs instanceof Unit) {
                this.dimensions.compatible(rhs.dimensions);
                return this;
            }
            else {
                throw new Error("Illegal Argument for Unit.compatible: " + rhs);
            }
        };
        /**
         * @method add
         * @param rhs {Unit}
         * @return {Unit}
         */
        Unit.prototype.add = function (rhs) {
            assertArgUnit('rhs', rhs);
            return add(this, rhs);
        };
        /**
         * @method __add__
         * @param rhs {Unit}
         * @return {Unit}
         * @private
         */
        Unit.prototype.__add__ = function (rhs) {
            if (rhs instanceof Unit) {
                return add(this, rhs);
            }
            else {
                return;
            }
        };
        /**
         * @method __radd__
         * @param lhs {Unit}
         * @return {Unit}
         * @private
         */
        Unit.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Unit) {
                return add(lhs, this);
            }
            else {
                return;
            }
        };
        /**
         * @method sub
         * @param rhs {Unit}
         * @return {Unit}
         */
        Unit.prototype.sub = function (rhs) {
            assertArgUnit('rhs', rhs);
            return sub(this, rhs);
        };
        /**
         * @method __sub__
         * @param rhs {Unit}
         * @return {Unit}
         */
        Unit.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Unit) {
                return sub(this, rhs);
            }
            else {
                return;
            }
        };
        /**
         * @method __rsub__
         * @param lhs {Unit}
         * @return {Unit}
         */
        Unit.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Unit) {
                return sub(lhs, this);
            }
            else {
                return;
            }
        };
        /**
         * @method mul
         * @param rhs {Unit}
         * @return {Unit}
         */
        Unit.prototype.mul = function (rhs) {
            assertArgUnit('rhs', rhs);
            return mul(this, rhs);
        };
        /**
         * @method __mul__
         * @param rhs {Unit}
         * @return {Unit}
         */
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
        /**
         * @method __rmul__
         * @param lhs {Unit}
         * @return {Unit}
         */
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
            assertArgUnit('rhs', rhs);
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
        Unit.prototype.pow = function (exponent) {
            assertArgRational('exponent', exponent);
            return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        /**
         * @method inv
         * @return {Unit}
         */
        Unit.prototype.inv = function () {
            return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
        };
        /**
         * @method neg
         * @return {Unit}
         */
        Unit.prototype.neg = function () {
            return new Unit(-this.multiplier, this.dimensions, this.labels);
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        Unit.prototype.isOne = function () {
            return this.dimensions.isOne() && (this.multiplier === 1);
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        Unit.prototype.isZero = function () {
            return this.dimensions.isZero() || (this.multiplier === 0);
        };
        /**
         * @method lerp
         * @param target: {Unit}
         * @param α {number}
         * @return {Unit}
         */
        Unit.prototype.lerp = function (target, α) {
            return this;
        };
        /**
         * @method norm
         * @return {Unit}
         */
        Unit.prototype.norm = function () {
            return new Unit(Math.abs(this.multiplier), this.dimensions, this.labels);
        };
        /**
         * @method quad
         * @return {Unit}
         */
        Unit.prototype.quad = function () {
            return new Unit(this.multiplier * this.multiplier, this.dimensions.mul(this.dimensions), this.labels);
        };
        /**
         * @method reflect
         * @param n {Unit}
         * @return {Unit}
         */
        Unit.prototype.reflect = function (n) {
            return this;
        };
        /**
         * @method rotate
         * @param rotor {Unit}
         * @return {Unit}
         */
        Unit.prototype.rotate = function (rotor) {
            return this;
        };
        Unit.prototype.scale = function (α) {
            return new Unit(this.multiplier * α, this.dimensions, this.labels);
        };
        /**
         * @method slerp
         * @param target: {Unit}
         * @param α {number}
         * @return {Unit}
         */
        Unit.prototype.slerp = function (target, α) {
            return this;
        };
        Unit.prototype.toExponential = function () {
            return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.toFixed = function (digits) {
            return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.toString = function () {
            return unitString(this.multiplier, this.dimensions, this.labels);
        };
        /**
         * @method __pos__
         * @return {Unit}
         * @private
         */
        Unit.prototype.__pos__ = function () {
            return this;
        };
        /**
         * @method __neg__
         * @return {Unit}
         * @private
         */
        Unit.prototype.__neg__ = function () {
            return this.neg();
        };
        /**
         * @method isOne
         * @param uom {Unit}
         * @return {boolean}
         * @static
         */
        Unit.isOne = function (uom) {
            if (typeof uom === 'undefined') {
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
                    if (lhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new UnitError(lhs + " is incompatible with 1");
                    }
                }
            }
            else {
                if (rhs) {
                    if (rhs.isOne()) {
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
                    return rhs.inv();
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.sqrt = function (uom) {
            if (typeof uom !== 'undefined') {
                assertArgUnit('uom', uom);
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
        Unit.ONE = new Unit(1.0, Dimensions.ONE, LABELS_SI);
        Unit.KILOGRAM = new Unit(1.0, Dimensions.MASS, LABELS_SI);
        Unit.METER = new Unit(1.0, Dimensions.LENGTH, LABELS_SI);
        Unit.SECOND = new Unit(1.0, Dimensions.TIME, LABELS_SI);
        Unit.COULOMB = new Unit(1.0, Dimensions.CHARGE, LABELS_SI);
        Unit.AMPERE = new Unit(1.0, Dimensions.CURRENT, LABELS_SI);
        Unit.KELVIN = new Unit(1.0, Dimensions.TEMPERATURE, LABELS_SI);
        Unit.MOLE = new Unit(1.0, Dimensions.AMOUNT, LABELS_SI);
        Unit.CANDELA = new Unit(1.0, Dimensions.INTENSITY, LABELS_SI);
        return Unit;
    })();
    return Unit;
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
    return BASIS_LABELS_G3_GEOMETRIC;
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
    return BASIS_LABELS_G3_HAMILTON;
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
    return BASIS_LABELS_G3_STANDARD;
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
    return BASIS_LABELS_G3_STANDARD_HTML;
});

define('davinci-eight/math/Euclidean3',["require", "exports", '../math/addE3', '../geometries/b2', '../geometries/b3', '../math/extG3', '../checks/isDefined', '../math/lcoG3', '../math/mathcore', '../math/mulE3', '../math/mulG3', '../checks/mustBeInteger', '../checks/mustBeNumber', '../math/NotImplementedError', '../math/rcoG3', '../i18n/readOnly', '../math/scpG3', '../math/squaredNormG3', '../math/stringFromCoordinates', '../math/subE3', '../math/Unit', '../math/BASIS_LABELS_G3_GEOMETRIC', '../math/BASIS_LABELS_G3_HAMILTON', '../math/BASIS_LABELS_G3_STANDARD', '../math/BASIS_LABELS_G3_STANDARD_HTML'], function (require, exports, addE3, b2, b3, extG3, isDefined, lcoG3, mathcore, mulE3, mulG3, mustBeInteger, mustBeNumber, NotImplementedError, rcoG3, readOnly, scpG3, squaredNormG3, stringFromCoordinates, subE3, Unit, BASIS_LABELS_G3_GEOMETRIC, BASIS_LABELS_G3_HAMILTON, BASIS_LABELS_G3_STANDARD, BASIS_LABELS_G3_STANDARD_HTML) {
    var cos = Math.cos;
    var cosh = mathcore.Math.cosh;
    var exp = Math.exp;
    var sin = Math.sin;
    var sinh = mathcore.Math.sinh;
    var sqrt = Math.sqrt;
    function assertArgEuclidean3(name, arg) {
        if (arg instanceof Euclidean3) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a Euclidean3");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new Error("Argument '" + uom + "' must be a Unit or undefined");
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
    // FIXME: Need to use tensor representations to find inverse, if it exists.
    // I don't remember how I came up with this, but part was Hestenes NFCM problem (7.2) p38.
    // Let A = α + a, where a is a non-zero vector.
    // Find inv(A) as a function of α and a.
    // etc
    // Perwass describes how to convert multivectors to a tensor representation and then use
    // matrices to find inverses. Essentially we are invoking theorems on the determinant
    // which apply to the antisymmetric product.
    var divide = function (a000, // a.w
        a001, // a.x
        a010, // a.y
        a011, // a.xy
        a100, // a.z
        a101, // -a.zx or a.xz
        a110, // a.yz
        a111, // a.xyz
        b000, // b.w
        b001, // b.x
        b010, // b.y
        b011, // b.xy
        b100, // b.z
        b101, // -b.zx or b.xz
        b110, // b.yz
        b111, // b.xyz
        uom) {
        var c000;
        var c001;
        var c010;
        var c011;
        var c100;
        var c101;
        var c110;
        var c111;
        var i000;
        var i001;
        var i010;
        var i011;
        var i100;
        var i101;
        var i110;
        var i111;
        var k000;
        var m000;
        var m001;
        var m010;
        var m011;
        var m100;
        var m101;
        var m110;
        var m111;
        var r000;
        var r001;
        var r010;
        var r011;
        var r100;
        var r101;
        var r110;
        var r111;
        var s000;
        var s001;
        var s010;
        var s011;
        var s100;
        var s101;
        var s110;
        var s111;
        var w;
        var x;
        var x000;
        var x001;
        var x010;
        var x011;
        var x100;
        var x101;
        var x110;
        var x111;
        var xy;
        var β;
        var y;
        var yz;
        var z;
        var zx;
        // This looks like the reversion of b, but there is a strange sign flip for zx
        // r = ~b
        r000 = +b000; // => b.w
        r001 = +b001; // => b.x
        r010 = +b010; // => b.y
        r011 = -b011; // => -b.xy
        r100 = +b100; // => b.z
        r101 = -b101; // => +b.zx
        r110 = -b110; // => -b.yz
        r111 = -b111; // => -b.xyz
        // m = (b * r) grades 0 and 1
        m000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 0);
        m001 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 1);
        m010 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 2);
        m011 = 0;
        m100 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 3);
        m101 = 0;
        m110 = 0;
        m111 = 0;
        // Clifford conjugation.
        // c = cc(m)
        c000 = +m000;
        c001 = -m001;
        c010 = -m010;
        c011 = -m011;
        c100 = -m100;
        c101 = -m101;
        c110 = -m110;
        c111 = +m111;
        // s = r * c
        s000 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 0);
        s001 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 1);
        s010 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 2);
        s011 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 4);
        s100 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 3);
        s101 = -mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 6);
        s110 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 5);
        s111 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 7);
        // k = (b * s), grade 0 part
        k000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, s000, s001, s010, s100, s011, s110, -s101, s111, 0);
        // i = s / k
        i000 = s000 / k000;
        i001 = s001 / k000;
        i010 = s010 / k000;
        i011 = s011 / k000;
        i100 = s100 / k000;
        i101 = s101 / k000;
        i110 = s110 / k000;
        i111 = s111 / k000;
        // x = a * i
        x000 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 0);
        x001 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 1);
        x010 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 2);
        x011 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 4);
        x100 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 3);
        x101 = -mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 6);
        x110 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 5);
        x111 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 7);
        // this = x
        //      = a * i
        //      = a * s / k
        //      = a * s / grade(b * s, 0)
        //      = a * r * c / grade(b * r * c, 0)
        //      = a * r * cc(b * r) / grade(b * r * cc(b * r), 0)
        //      = a * ~b * cc(b * ~b) / grade(b * ~b * cc(b * ~b), 0)
        w = x000;
        x = x001;
        y = x010;
        z = x100;
        xy = x011;
        yz = x110;
        zx = -x101;
        β = x111;
        return new Euclidean3(w, x, y, z, xy, yz, zx, β, uom);
    };
    /**
     * @class Euclidean3
     */
    var Euclidean3 = (function () {
        /**
         * The Euclidean3 class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
         * Constructs a Euclidean3 from its coordinates.
         * @constructor
         * @param {number} α The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param {number} y The vector component of the multivector in the y-direction.
         * @param {number} z The vector component of the multivector in the z-direction.
         * @param {number} xy The bivector component of the multivector in the xy-plane.
         * @param {number} yz The bivector component of the multivector in the yz-plane.
         * @param {number} zx The bivector component of the multivector in the zx-plane.
         * @param {number} β The pseudoscalar part of the multivector.
         * @param uom The optional unit of measure.
         */
        function Euclidean3(α, x, y, z, xy, yz, zx, β, uom) {
            this.w = mustBeNumber('α', α);
            this.x = mustBeNumber('x', x);
            this.y = mustBeNumber('y', y);
            this.z = mustBeNumber('z', z);
            this.xy = mustBeNumber('xy', xy);
            this.yz = mustBeNumber('yz', yz);
            this.zx = mustBeNumber('zx', zx);
            this.xyz = mustBeNumber('β', β);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this.w *= multiplier;
                this.x *= multiplier;
                this.y *= multiplier;
                this.z *= multiplier;
                this.xy *= multiplier;
                this.yz *= multiplier;
                this.zx *= multiplier;
                this.xyz *= multiplier;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Euclidean3, "BASIS_LABELS_GEOMETRIC", {
            get: function () { return BASIS_LABELS_G3_GEOMETRIC; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_HAMILTON", {
            get: function () { return BASIS_LABELS_G3_HAMILTON; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_STANDARD", {
            get: function () { return BASIS_LABELS_G3_STANDARD; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_STANDARD_HTML", {
            get: function () { return BASIS_LABELS_G3_STANDARD_HTML; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Euclidean3.prototype, "α", {
            /**
             * The scalar part of this multivector.
             * @property α
             * @return {number}
             */
            get: function () {
                return this.w;
            },
            set: function (unused) {
                throw new Error(readOnly('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean3.prototype, "β", {
            /**
             * The pseudoscalar part of this multivector.
             * @property β
             * @return {number}
             */
            get: function () {
                return this.xyz;
            },
            set: function (unused) {
                throw new Error(readOnly('β').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method fromCartesian
         * @param α {number}
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param xy {number}
         * @param yz {number}
         * @param zx {number}
         * @param β {number}
         * @param uom [Unit]
         * @return {Euclidean3}
         * @chainable
         * @static
         */
        Euclidean3.fromCartesian = function (α, x, y, z, xy, yz, zx, β, uom) {
            mustBeNumber('α', α);
            mustBeNumber('x', x);
            mustBeNumber('y', y);
            mustBeNumber('z', z);
            mustBeNumber('xy', xy);
            mustBeNumber('yz', yz);
            mustBeNumber('zx', zx);
            mustBeNumber('β', β);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean3(α, x, y, z, xy, yz, zx, β, uom);
        };
        Object.defineProperty(Euclidean3.prototype, "coords", {
            /**
             * @property coords
             * @type {number[]}
             */
            get: function () {
                return [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz];
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method coordinate
         * @param index {number}
         * @return {number}
         */
        Euclidean3.prototype.coordinate = function (index) {
            mustBeNumber('index', index);
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
                    throw new Error("index must be in the range [0..7]");
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
            return compute(addE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
        };
        /**
         * Computes <code>this + Iβ</code>
         * @method addPseudo
         * @param β {number}
         * @return {Euclidean3} <code>this</code>
         * @chainable
         */
        Euclidean3.prototype.addPseudo = function (β) {
            if (isDefined(β)) {
                mustBeNumber('β', β);
                return new Euclidean3(this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz + β, this.uom);
            }
            else {
                // Consider returning an undefined sentinel?
                // This would allow chained methods to continue.
                // The first check might then be isNumber. 
                return void 0;
            }
        };
        /**
         * Computes <code>this + α</code>
         * @method addScalar
         * @param α {number}
         * @return {Euclidean3} <code>this</code>
         * @chainable
         */
        Euclidean3.prototype.addScalar = function (α) {
            if (isDefined(α)) {
                mustBeNumber('α', α);
                return new Euclidean3(this.w + α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz, this.uom);
            }
            else {
                // Consider returning an undefined sentinel?
                // This would allow chained methods to continue.
                // The first check might then be isNumber. 
                return void 0;
            }
        };
        /**
         * @method __add__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__add__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.add(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.addScalar(rhs);
            }
        };
        /**
         * @method __radd__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.add(this);
            }
            else if (typeof lhs === 'number') {
                return this.addScalar(lhs);
            }
        };
        /**
         * @method adj
         * @return {Euclidean3}
         * @chainable
         * @beta
         */
        Euclidean3.prototype.adj = function () {
            // TODO
            return this;
        };
        /**
         * @method angle
         * @return {Euclidean3}
         */
        Euclidean3.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * Computes the <e>Clifford conjugate</em> of this multivector.
         * The grade multiplier is -1<sup>x(x+1)/2</sup>
         * @method conj
         * @return {Euclidean3}
         * @chainable
         */
        Euclidean3.prototype.conj = function () {
            return new Euclidean3(this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.xyz, this.uom);
        };
        /**
         * @method cubicBezier
         * @param t {number}
         * @param controlBegin {GeometricE3}
         * @param controlEnd {GeometricE3}
         * @param endPoint {GeometricE3}
         * @return {Euclidean3}
         * @chainable
         */
        Euclidean3.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var z = b3(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        /**
         * @method direction
         * @return {Euclidean3}
         */
        Euclidean3.prototype.direction = function () {
            return this.div(this.norm());
        };
        /**
         * @method sub
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.sub = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(subE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
        };
        /**
         * @method __sub__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.addScalar(-rhs);
            }
        };
        /**
         * @method __rsub__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.sub(this);
            }
            else if (typeof lhs === 'number') {
                return this.neg().addScalar(lhs);
            }
        };
        /**
         * @method mul
         * @param rhs {Euclidean3}
         */
        Euclidean3.prototype.mul = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            mulG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method __mul__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        /**
         * @method __rmul__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        /**
         * @method scale
         * @param α {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.scale = function (α) {
            return new Euclidean3(this.w * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.xyz * α, this.uom);
        };
        /**
         * @method div
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.div = function (rhs) {
            assertArgEuclidean3('rhs', rhs);
            return divide(this.w, this.x, this.y, this.xy, this.z, -this.zx, this.yz, this.xyz, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, Unit.div(this.uom, rhs.uom));
        };
        /**
         * @method divByScalar
         * @param α {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.divByScalar = function (α) {
            return new Euclidean3(this.w / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.xyz / α, this.uom);
        };
        /**
         * @method __div__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__div__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.div(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.divByScalar(rhs);
            }
        };
        /**
         * @method __rdiv__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.div(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
            }
        };
        /**
         * @method dual
         * @return {Euclidean3}
         * @beta
         */
        Euclidean3.prototype.dual = function () {
            // FIXME: TODO
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        /**
         * @method scp
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.scp = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            scpG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method ext
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.ext = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            extG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method __vbar__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scp(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        /**
         * @method __rvbar__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.scp(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
            }
        };
        /**
         * @method __wedge__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        /**
         * @method __rwedge__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.ext(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        /**
         * @method lco
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.lco = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            lcoG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method __lshift__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.lco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        /**
         * @method __rlshift__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.lco(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
            }
        };
        /**
         * @method rco
         * @param rhs {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.rco = function (rhs) {
            var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
            var w = out.w;
            rcoG3(this, rhs, Euclidean3.mutator(out));
            return out;
        };
        /**
         * @method __rshift__
         * @param rhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Euclidean3) {
                return this.rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.rco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        /**
         * @method __rrshift__
         * @param lhs {any}
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Euclidean3) {
                return lhs.rco(this);
            }
            else if (typeof lhs === 'number') {
                return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
            }
        };
        /**
         * @method pow
         * @param exponent {Euclidean3}
         * @return {Euclidean3}
         * @beta
         */
        Euclidean3.prototype.pow = function (exponent) {
            // assertArgEuclidean3('exponent', exponent);
            throw new Error('pow');
        };
        /**
         * @method __bang__
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__bang__ = function () {
            return this.inv();
        };
        /**
         * Unary plus(+).
         * @method __pos__
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__pos__ = function () {
            return this;
        };
        /**
         * @method neg
         * @return {Euclidean3} <code>-1 * this</code>
         */
        Euclidean3.prototype.neg = function () {
            return new Euclidean3(-this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        /**
         * Unary minus (-).
         * @method __neg__
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__neg__ = function () {
            return this.neg();
        };
        /**
         * @method rev
         * @return {Euclidean3}
         */
        Euclidean3.prototype.rev = function () {
            return new Euclidean3(this.w, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        /**
         * ~ (tilde) produces reversion.
         * @method __tilde__
         * @return {Euclidean3}
         * @private
         */
        Euclidean3.prototype.__tilde__ = function () {
            return this.rev();
        };
        /**
         * @method grade
         * @param grade {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
            switch (grade) {
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
        /**
         * Intentionally undocumented
         */
        /*
        dot(vector: Euclidean3): number {
          return this.x * vector.x + this.y * vector.y + this.z * vector.z;
        }
        */
        /**
         * @method cross
         * @param vector {Euclidean3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.cross = function (vector) {
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
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, Unit.mul(this.uom, vector.uom));
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        Euclidean3.prototype.isOne = function () {
            return (this.w === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        Euclidean3.prototype.isZero = function () {
            return (this.w === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        /*
        length() {
          return sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz);
        }
        */
        /**
         * @method lerp
         * @param target {Euclidean3}
         * @param α {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.lerp = function (target, α) {
            // FIXME: TODO
            return this;
        };
        /**
         * @method cos
         * @return {Euclidean3}
         */
        Euclidean3.prototype.cos = function () {
            // TODO: Generalize to full multivector.
            Unit.assertDimensionless(this.uom);
            var cosW = cos(this.w);
            return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        /**
         * @method cosh
         * @return {Euclidean3}
         */
        Euclidean3.prototype.cosh = function () {
            //Unit.assertDimensionless(this.uom);
            throw new NotImplementedError('cosh(Euclidean3)');
        };
        /**
         * @method distanceTo
         * @param point {Euclidean3}
         * @return {number}
         */
        Euclidean3.prototype.distanceTo = function (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return sqrt(dx * dx + dy * dy + dz * dz);
        };
        /**
         * @method equals
         * @param other {Euclidean3}
         * @return {boolean}
         */
        Euclidean3.prototype.equals = function (other) {
            throw new Error("TODO: Euclidean3.equals");
        };
        /**
         * @method exp
         * @return {Euclidean3}
         */
        Euclidean3.prototype.exp = function () {
            Unit.assertDimensionless(this.uom);
            var bivector = this.grade(2);
            var a = bivector.norm();
            if (!a.isZero()) {
                var c = a.cos();
                var s = a.sin();
                var B = bivector.direction();
                return c.add(B.mul(s));
            }
            else {
                return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        /**
         * Computes the <em>inverse</em> of this multivector, if it exists.
         * inv(A) = ~A / (A * ~A)
         * @method inv
         * @return {Euclidean3}
         * @beta
         */
        Euclidean3.prototype.inv = function () {
            // FIXME: This is not the definition above.
            return this.rev().divByScalar(this.squaredNorm());
        };
        /**
         * @method log
         * @return {Euclidean3}
         */
        Euclidean3.prototype.log = function () {
            // FIXME: TODO
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        Euclidean3.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
         * @method norm
         * @return {Euclidean3}
         */
        Euclidean3.prototype.norm = function () {
            return new Euclidean3(this.magnitude(), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        /**
         * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
         * @method quad
         * @return {Euclidean3}
         */
        Euclidean3.prototype.quad = function () {
            return new Euclidean3(this.squaredNorm(), 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, this.uom));
        };
        /**
         * @method quadraticBezier
         * @param t {number}
         * @param controlPoint {GeometricE3}
         * @param endPoint {GeometricE3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2(t, this.x, controlPoint.x, endPoint.x);
            var y = b2(t, this.y, controlPoint.y, endPoint.y);
            var z = b2(t, this.z, controlPoint.z, endPoint.z);
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        /**
         * @method squaredNorm
         * @return {number}
         */
        Euclidean3.prototype.squaredNorm = function () {
            return squaredNormG3(this);
        };
        /**
         * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
         * @method reflect
         * @param n {VectorE3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.reflect = function (n) {
            // TODO: Optimize to minimize object creation and increase performance.
            var m = Euclidean3.fromVectorE3(n);
            return m.mul(this).mul(m).scale(-1);
        };
        /**
         * @method rotate
         * @param s {SpinorE3}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.rotate = function (s) {
            // TODO
            return this;
        };
        /**
         * @method sin
         * @return {Euclidean3}
         */
        Euclidean3.prototype.sin = function () {
            // TODO: Generalize to full multivector.
            Unit.assertDimensionless(this.uom);
            var sinW = sin(this.w);
            return new Euclidean3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        /**
         * @method sinh
         * @return {Euclidean3}
         */
        Euclidean3.prototype.sinh = function () {
            //Unit.assertDimensionless(this.uom);
            throw new Error('sinh');
        };
        /**
         * @method slerp
         * @param target {Euclidean3}
         * @param α {number}
         * @return {Euclidean3}
         */
        Euclidean3.prototype.slerp = function (target, α) {
            // FIXME: TODO
            return this;
        };
        /**
         * @method sqrt
         * @return {Euclidean3}
         */
        Euclidean3.prototype.sqrt = function () {
            return new Euclidean3(sqrt(this.w), 0, 0, 0, 0, 0, 0, 0, Unit.sqrt(this.uom));
        };
        /**
         * @method tan
         * @return {Euclidean3}
         */
        Euclidean3.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        /**
         * Intentionally undocumented.
         */
        Euclidean3.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates(this.coords, coordToString, labels);
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
        /**
         * @method toExponential
         * @return {string}
         */
        Euclidean3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        /**
         * @method toFixed
         * @param [digits] {number}
         * @return {string}
         */
        Euclidean3.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        /**
         * @method toString
         * @return {string}
         */
        Euclidean3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        /**
         * Provides access to the internals of Euclidean3 in order to use `product` functions.
         */
        Euclidean3.mutator = function (M) {
            var that = {
                set α(α) {
                    M.w = α;
                },
                set x(x) {
                    M.x = x;
                },
                set y(y) {
                    M.y = y;
                },
                set z(z) {
                    M.z = z;
                },
                set yz(yz) {
                    M.yz = yz;
                },
                set zx(zx) {
                    M.zx = zx;
                },
                set xy(xy) {
                    M.xy = xy;
                },
                set β(β) {
                    M.xyz = β;
                },
                magnitude: function () {
                    throw new Error("magnitude() should not be needed.");
                },
                squaredNorm: function () {
                    throw new Error("squaredNorm() should not be needed.");
                }
            };
            return that;
        };
        /**
         * @method copy
         * @param m {GeometricE3}
         * @return {Euclidean3}
         * @static
         */
        Euclidean3.copy = function (m) {
            if (m instanceof Euclidean3) {
                return m;
            }
            else {
                return new Euclidean3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, void 0);
            }
        };
        /**
         * @method fromSpinorE3
         * @param spinor {SpinorE3}
         * @return {Euclidean3}
         * @static
         */
        Euclidean3.fromSpinorE3 = function (spinor) {
            if (isDefined(spinor)) {
                return new Euclidean3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method fromVectorE3
         * @param vector {VectorE3}
         * @return {Euclidean3}
         * @static
         */
        Euclidean3.fromVectorE3 = function (vector) {
            if (isDefined(vector)) {
                return new Euclidean3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        /**
         * @property BASIS_LABELS
         * @type {string[][]}
         */
        Euclidean3.BASIS_LABELS = BASIS_LABELS_G3_STANDARD;
        /**
         * @property zero
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.zero = new Euclidean3(0, 0, 0, 0, 0, 0, 0, 0);
        /**
         * @property one
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.one = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0);
        /**
         * @property e1
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.e1 = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
        /**
         * @property e2
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.e2 = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
        /**
         * @property e3
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.e3 = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
        /**
         * @property kilogram
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.kilogram = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KILOGRAM);
        /**
         * @property meter
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.meter = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.METER);
        /**
         * @property second
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.second = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.SECOND);
        /**
         * @property coulomb
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.coulomb = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.COULOMB);
        /**
         * @property ampere
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.ampere = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.AMPERE);
        /**
         * @property kelvin
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.kelvin = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KELVIN);
        /**
         * @property mole
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.mole = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.MOLE);
        /**
         * @property candela
         * @type {Euclidean3}
         * @static
         */
        Euclidean3.candela = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.CANDELA);
        return Euclidean3;
    })();
    return Euclidean3;
});

define('davinci-eight/math/AbstractMatrix',["require", "exports", '../checks/mustBeInteger', '../checks/expectArg', '../i18n/readOnly'], function (require, exports, mustBeInteger, expectArg, readOnly) {
    /**
     * @class AbstractMatrix
     */
    var AbstractMatrix = (function () {
        /**
         * @class AbstractMatrix
         * @constructor
         * @param elements {Float32Array}
         * @param dimensions {number}
         */
        function AbstractMatrix(elements, dimensions) {
            this._dimensions = mustBeInteger('dimensions', dimensions);
            this._length = dimensions * dimensions;
            expectArg('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
            this._elements = elements;
            this.modified = false;
        }
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
            /**
             * @property elements
             * @type {Float32Array}
             */
            get: function () {
                if (this._elements) {
                    return this._elements;
                }
                else if (this._callback) {
                    var elements = this._callback();
                    expectArg('callback()', elements).toSatisfy(elements.length === this._length, "callback() length must be " + this._length);
                    return this._callback();
                }
                else {
                    throw new Error("Matrix" + Math.sqrt(this._length) + " is undefined.");
                }
            },
            set: function (elements) {
                expectArg('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
                this._elements = elements;
                this._callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "callback", {
            /**
             * @property callback
             * @type {() => Float32Array}
             */
            get: function () {
                return this._callback;
            },
            set: function (reactTo) {
                this._callback = reactTo;
                this._elements = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
            /**
             * @property dimensions
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._dimensions;
            },
            set: function (unused) {
                throw new Error(readOnly('dimensions').message);
            },
            enumerable: true,
            configurable: true
        });
        return AbstractMatrix;
    })();
    return AbstractMatrix;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Matrix3',["require", "exports", '../math/AbstractMatrix'], function (require, exports, AbstractMatrix) {
    /**
     * @class Matrix3
     * @extends AbstractMatrix
     */
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
        /**
         * 3x3 (square) matrix of numbers.
         * Constructs a Matrix3 by wrapping a Float32Array.
         * @class Matrix3
         * @constructor
         */
        function Matrix3(elements) {
            _super.call(this, elements, 3);
        }
        /**
         * <p>
         * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
         * </p>
         * @method one
         * @return {Matrix3}
         * @static
         */
        Matrix3.one = function () {
            return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        /**
         * <p>
         * Creates a new matrix with all elements zero.
         * </p>
         * @method zero
         * @return {Matrix3}
         * @static
         */
        Matrix3.zero = function () {
            return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        Matrix3.prototype.determinant = function () {
            return 1;
        };
        Matrix3.prototype.getInverse = function (matrix, throwOnInvertible) {
            // input: Matrix4
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
                this.one();
                return this;
            }
            this.scale(1.0 / det);
            return this;
        };
        /**
         * @method one
         * @return {Matrix3}
         */
        Matrix3.prototype.one = function () {
            return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Matrix3.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        /**
         * @method row
         * @param i {number} the zero-based index of the row.
         * @return {number[]}
         */
        Matrix3.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[3 + i], te[6 + i]];
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
        Matrix3.prototype.mul2 = function (a, b) {
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
        Matrix3.prototype.toString = function () {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
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
    })(AbstractMatrix);
    return Matrix3;
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/Matrix4',["require", "exports", '../math/AbstractMatrix', '../checks/expectArg', '../checks/isDefined', '../checks/mustBeNumber', '../math/_M4_x_M4_'], function (require, exports, AbstractMatrix, expectArg, isDefined, mustBeNumber, _M4_x_M4_) {
    /**
     * @class Matrix4
     * @extends AbstractMatrix
     */
    var Matrix4 = (function (_super) {
        __extends(Matrix4, _super);
        // The correspondence between the elements property index and the matrix entries is...
        //
        //  0  4  8 12
        //  1  5  9 13
        //  2  6 10 14
        //  3  7 11 15
        /**
         * 4x4 (square) matrix of numbers.
         * Constructs a Matrix4 by wrapping a Float32Array.
         * @class Matrix4
         * @constructor
         */
        function Matrix4(elements) {
            _super.call(this, elements, 4);
        }
        /**
         * <p>
         * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
         * </p>
         * @method one
         * @return {Matrix4}
         * @static
         */
        Matrix4.one = function () {
            return new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
        };
        /**
         * <p>
         * Creates a new matrix with all elements zero.
         * </p>
         * @method zero
         * @return {Matrix4}
         * @chainable
         * @static
         */
        Matrix4.zero = function () {
            return new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        /**
         * @method scaling
         * @param scale {VectorE3}
         * @return {Matrix4}
         * @chainable
         * @static
         */
        Matrix4.scaling = function (scale) {
            return Matrix4.one().scaling(scale);
        };
        /**
         * @method translation
         * @param vector {VectorE3}
         * @return {Matrix4}
         * @chainable
         * @static
         */
        Matrix4.translation = function (vector) {
            return Matrix4.one().translation(vector);
        };
        /**
         * @method rotation
         * @param spinor {SpinorE3}
         * @return {Matrix4}
         * @chainable
         * @static
         */
        Matrix4.rotation = function (spinor) {
            return Matrix4.one().rotation(spinor);
        };
        /**
         * Returns a copy of this Matrix4 instance.
         * @method clone
         * @return {Matrix4}
         */
        Matrix4.prototype.clone = function () {
            return Matrix4.zero().copy(this);
        };
        /**
         * @method compose
         * @param scale {VectorE3}
         * @param attitude {SpinorE3}
         * @param position {VectorE3}
         * @return {Matrix4}
         */
        Matrix4.prototype.compose = function (scale, attitude, position) {
            // We 
            // this.one();
            // this.scale(scale);
            this.scaling(scale);
            this.rotate(attitude);
            this.translate(position);
            return this;
        };
        /**
         * @method copy
         * @param m {Matrix4}
         * @return {Matrix4}
         */
        Matrix4.prototype.copy = function (m) {
            this.elements.set(m.elements);
            return this;
        };
        /**
         * @method determinant
         * @return {number}
         */
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
        /**
         * @method invert
         * @param m {Matrix4}
         * @return {Matrix4}
         * @deprecated
         * @private
         */
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
                return this.scale(1 / det);
            }
            else {
                var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";
                if (throwOnSingular) {
                    throw new Error(msg);
                }
                else {
                    console.warn(msg);
                }
                this.one();
                return this;
            }
        };
        /**
         * Sets this matrix to the identity element for multiplication, <b>1</b>.
         * @method one
         * @return {Matrix4}
         */
        Matrix4.prototype.one = function () {
            return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        /**
         * @method scale
         * @param s {number}
         * @return {Matrix4}
         */
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
        /**
         * @method transpose
         * @return {Matrix4}
         */
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
         * @method frustum
         * @param left {number}
         * @param right {number}
         * @param bottom {number}
         * @param top {number}
         * @param near {number}
         * @param far {number}
         * @return {Matrix4}
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
        /**
         * @method rotationAxis
         * @param axis {VectorE3}
         * @param angle {number}
         * @return {Matrix4}
         * @chainable
         * @beta
         */
        Matrix4.prototype.rotationAxis = function (axis, angle) {
            // Based on http://www.gamedev.net/reference/articles/article1199.asp
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x, y = axis.y, z = axis.z;
            var tx = t * x, ty = t * y;
            return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        };
        /**
         * @method mul
         * @param rhs {Matrix4}
         * @return {Matrix4}
         */
        Matrix4.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        /**
         * @method mul2
         * @param a {Matrix4}
         * @param b {Matrix4}
         * @return {Matrix4}
         */
        Matrix4.prototype.mul2 = function (a, b) {
            _M4_x_M4_(a.elements, b.elements, this.elements);
            return this;
        };
        /**
         * @method rmul
         * @param lhs {Matrix4}
         * @return {Matrix4}
         */
        Matrix4.prototype.rmul = function (lhs) {
            return this.mul2(lhs, this);
        };
        /**
         * <p>
         * <code>this ⟼ reflection(n)</code>
         * </p>
         * @method reflection
         * @param n {VectorE3}
         * @return {Matrix4}
         */
        Matrix4.prototype.reflection = function (n) {
            var nx = mustBeNumber('n.x', n.x);
            var ny = mustBeNumber('n.y', n.y);
            var nz = mustBeNumber('n.z', n.z);
            var aa = -2 * nx * ny;
            var cc = -2 * ny * nz;
            var bb = -2 * nz * nx;
            var xx = 1 - 2 * nx * nx;
            var yy = 1 - 2 * ny * ny;
            var zz = 1 - 2 * nz * nz;
            this.set(xx, aa, bb, 0, aa, yy, cc, 0, bb, cc, zz, 0, 0, 0, 0, 1);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ rotation(spinor) * this</code>
         * </p>
         * @method rotate
         * @param spinor {SpinorE3}
         * @return {Matrix4}
         */
        Matrix4.prototype.rotate = function (spinor) {
            return this.rmul(Matrix4.rotation(spinor));
        };
        /**
         * <p>
         * <code>this ⟼ rotation(spinor)</code>
         * </p>
         * @method rotation
         * @param attitude  The spinor from which the rotation will be computed.
         * @return {Matrix4}
         */
        Matrix4.prototype.rotation = function (spinor) {
            // The correspondence between quaternions and spinors is
            // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
            var x = -expectArg('spinor.yz', spinor.yz).toBeNumber().value;
            var y = -expectArg('spinor.zx', spinor.zx).toBeNumber().value;
            var z = -expectArg('spinor.xy', spinor.xy).toBeNumber().value;
            var α = expectArg('spinor.α', spinor.α).toBeNumber().value;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2;
            var yy = y * y2, yz = y * z2, zz = z * z2;
            var wx = α * x2, wy = α * y2, wz = α * z2;
            this.set(1 - yy - zz, xy - wz, xz + wy, 0, xy + wz, 1 - xx - zz, yz - wx, 0, xz - wy, yz + wx, 1 - xx - yy, 0, 0, 0, 0, 1);
            return this;
        };
        /**
         * @method row
         * @param i {number} the zero-based index of the row.
         * @return {Array<number>}
         */
        Matrix4.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
        };
        /**
         * @method scaleXYZ
         * @param scale {VectorE3}
         * @return {Matrix4}
         */
        Matrix4.prototype.scaleXYZ = function (scale) {
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
            return this.rmul(Matrix4.scaling(scale));
        };
        /**
         * @method scaling
         * @param scale {VectorE3}
         * @return {Matrix4}
         */
        Matrix4.prototype.scaling = function (scale) {
            return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
        };
        /**
         * @method set
         * @return {Matrix4}
         * @private
         */
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
        /**
         * @method toFixed
         * @param [digits] {number}
         * @return {string}
         */
        Matrix4.prototype.toFixed = function (digits) {
            if (isDefined(digits)) {
                expectArg('digits', digits).toBeNumber();
            }
            var text = [];
            for (var i = 0; i <= this.dimensions - 1; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toFixed(digits); }).join(' '));
            }
            return text.join('\n');
        };
        /**
         * @method toString
         * @return {string}
         */
        Matrix4.prototype.toString = function () {
            var text = [];
            for (var i = 0; i <= 3; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
        };
        /**
         * <p>
         * <code>this ⟼ translation(spinor) * this</code>
         * </p>
         * @method translate
         * @param displacement {VectorE3}
         * @return {Matrix4}
         */
        Matrix4.prototype.translate = function (displacement) {
            return this.rmul(Matrix4.translation(displacement));
        };
        /**
         * @method translation
         * @param displacement {VectorE3}
         * @return {Matrix4}
         */
        Matrix4.prototype.translation = function (displacement) {
            return this.set(1, 0, 0, displacement.x, 0, 1, 0, displacement.y, 0, 0, 1, displacement.z, 0, 0, 0, 1);
        };
        /**
         * @method __mul__
         * @param rhs {Matrix4|number}
         * @return {Matrix4}
         * @chainable
         * @private
         */
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
        /**
         * @method __rmul__
         * @param lhs {Matrix4|number}
         * @return {Matrix4}
         * @chainable
         * @private
         */
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
    })(AbstractMatrix);
    return Matrix4;
});

define('davinci-eight/checks/isObject',["require", "exports"], function (require, exports) {
    function isObject(x) {
        return (typeof x === 'object');
    }
    return isObject;
});

define('davinci-eight/checks/mustBeObject',["require", "exports", '../checks/mustSatisfy', '../checks/isObject'], function (require, exports, mustSatisfy, isObject) {
    function beObject() {
        return "be an `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy(name, isObject(value), beObject, contextBuilder);
        return value;
    }
    return mustBeObject;
});

define('davinci-eight/math/toStringCustom',["require", "exports", '../math/stringFromCoordinates'], function (require, exports, stringFromCoordinates) {
    function toStringCustom(coordinates, uom, coordToString, labels) {
        var quantityString = stringFromCoordinates(coordinates, coordToString, labels);
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
    return toStringCustom;
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/R3',["require", "exports", '../math/dotVectorE3', '../math/Euclidean3', '../math/Matrix3', '../math/Matrix4', '../checks/isDefined', '../checks/isNumber', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/toStringCustom', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, dotVectorE3, Euclidean3, Matrix3, Matrix4, isDefined, isNumber, mustBeNumber, mustBeObject, toStringCustom, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    var COORD_Y = 1;
    var COORD_Z = 2;
    var BASIS_LABELS = ['e1', 'e2', 'e3'];
    /**
     * Coordinates corresponding to basis labels.
     */
    function coordinates(m) {
        return [m.x, m.y, m.z];
    }
    /**
     * @class R3
     * @extends VectorN<number>
     */
    var R3 = (function (_super) {
        __extends(R3, _super);
        /**
         * @class R3
         * @constructor
         * @param [data = [0, 0, 0]] {number[]}
         * @param modified [boolean = false]
         */
        function R3(data, modified) {
            if (data === void 0) { data = [0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 3);
        }
        /**
         * @method dot
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {number}
         * @static
         */
        R3.dot = function (a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        };
        Object.defineProperty(R3.prototype, "x", {
            /**
             * @property x
             * @type {number}
             */
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
        Object.defineProperty(R3.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
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
        Object.defineProperty(R3.prototype, "z", {
            /**
             * @property z
             * @type Number
             */
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
        /**
         * <p>
         * <code>this ⟼ this + vector * α</code>
         * </p>
         * @method add
         * @param vector {R3}
         * @param [α = 1] {number}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.add = function (vector, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('vector', vector);
            mustBeNumber('α', α);
            this.x += vector.x * α;
            this.y += vector.y * α;
            this.z += vector.z * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.add2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ m * this<sup>T</sup></code>
         * </p>
         * @method applyMatrix
         * @param m {Matrix3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.applyMatrix = function (m) {
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
         * TODO: Used by TubeSimplexGeometry.
         * @method applyMatrix4
         * @param m The 4x4 matrix that pre-multiplies this column vector.
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.applyMatrix4 = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
            this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
            this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @method reflect
         * @param n {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.reflect = function (n) {
            mustBeObject('n', n);
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
        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @method rotate
         * @param R {SpinorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.rotate = function (R) {
            mustBeObject('R', R);
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
        /**
         * @method clone
         * @return {R3} <code>copy(this)</code>
         */
        R3.prototype.clone = function () {
            return new R3([this.x, this.y, this.z]);
        };
        /**
         * <p>
         * <code>this ⟼ copy(v)</code>
         * </p>
         * @method copy
         * @param v {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.copy = function (v) {
            mustBeObject('v', v);
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };
        /**
         * Copies the coordinate values into this <code>R3</code>.
         * @method copyCoordinates
         * @param coordinates {number[]}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.copyCoordinates = function (coordinates) {
            // Copy using the setters so that the modified flag is updated.
            this.x = coordinates[COORD_X];
            this.y = coordinates[COORD_Y];
            this.z = coordinates[COORD_Z];
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this ✕ v</code>
         * </p>
         * @method cross
         * @param v {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.cross = function (v) {
            mustBeObject('v', v);
            return this.cross2(this, v);
        };
        /**
         * <p>
         * <code>this ⟼ a ✕ b</code>
         * </p>
         * @method cross2
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.cross2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.x = wedgeYZ(ax, ay, az, bx, by, bz);
            this.y = wedgeZX(ax, ay, az, bx, by, bz);
            this.z = wedgeXY(ax, ay, az, bx, by, bz);
            return this;
        };
        /**
         * @method distanceTo
         * @param point {VectorE3}
         * @return {number}
         */
        R3.prototype.distanceTo = function (point) {
            if (isDefined(point)) {
                return sqrt(this.quadranceTo(point));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method quadranceTo
         * @param point {VectorE3}
         * @return {number}
         */
        R3.prototype.quadranceTo = function (point) {
            if (isDefined(point)) {
                var dx = this.x - point.x;
                var dy = this.y - point.y;
                var dz = this.z - point.z;
                return dx * dx + dy * dy + dz * dz;
            }
            else {
                return void 0;
            }
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.divByScalar = function (α) {
            mustBeNumber('α', α);
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
        /**
         * @method dot
         * @param v {VectorE3}
         * @return {number}
         */
        R3.prototype.dot = function (v) {
            return R3.dot(this, v);
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        R3.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * @method neg
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {VectorE3}
         * @param α {number}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.lerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @param α {number}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.lerp2 = function (a, b, α) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            mustBeNumber('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / norm(this)</code>
         * </p>
         * @method direction
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.direction = function () {
            return this.divByScalar(this.magnitude());
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         */
        R3.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.x *= α;
            this.y *= α;
            this.z *= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this</code>, with components modified.
         * </p>
         * @method set
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @return {R3} <code>this</code>
         * @chainable
         * @deprecated
         */
        R3.prototype.setXYZ = function (x, y, z) {
            this.x = mustBeNumber('x', x);
            this.y = mustBeNumber('y', y);
            this.z = mustBeNumber('z', z);
            return this;
        };
        /**
         * @method setY
         * @param {number}
         * @deprecated
         */
        // FIXME: This is used by Cone and Cylinder Simplex Geometry
        R3.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        R3.prototype.slerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            return this;
        };
        /**
         * Returns the (Euclidean) inner product of this vector with itself.
         * @method squaredNorm
         * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
         */
        R3.prototype.squaredNorm = function () {
            // quad = scp(v, rev(v)) = scp(v, v)
            // TODO: This is correct but could be optimized.
            return dotVectorE3(this, this);
        };
        /**
         * <p>
         * <code>this ⟼ this - v</code>
         * </p>
         * @method sub
         * @param v {VectorE3}
         * @param [α = 1] {number}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.sub = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('v', v);
            mustBeNumber('α', α);
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {R3} <code>this</code>
         * @chainable
         */
        R3.prototype.sub2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        };
        /**
         * @method toExponential
         * @return {string}
         */
        R3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        /**
         * @method toFixed
         * @param [digits] {number}
         * @return {string}
         */
        R3.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        /**
         * @method toString
         * @return {string}
         */
        R3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        /**
         * Sets this vector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {R3}
         * @chainable
         */
        R3.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        R3.prototype.__add__ = function (rhs) {
            if (rhs instanceof R3) {
                return this.clone().add(rhs, 1.0);
            }
            else {
                return void 0;
            }
        };
        R3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof R3) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method mul
         * @param rhs {number}
         * @return {R3}
         * @private
         */
        R3.prototype.__mul__ = function (rhs) {
            if (isNumber(rhs)) {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method rmul
         * @param lhs {number}
         * @return {R3}
         * @private
         */
        R3.prototype.__rmul__ = function (lhs) {
            if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else if (lhs instanceof Matrix3) {
                var m33 = lhs;
                return this.clone().applyMatrix(m33);
            }
            else if (lhs instanceof Matrix4) {
                var m44 = lhs;
                return this.clone().applyMatrix4(m44);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method copy
         * @param vector {VectorE3}
         * @return {R3}
         * @static
         */
        R3.copy = function (vector) {
            return new R3([vector.x, vector.y, vector.z]);
        };
        /**
         * @method lerp
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @param α {number}
         * @return {R3} <code>a + α * (b - a)</code>
         * @static
         */
        R3.lerp = function (a, b, α) {
            return R3.copy(b).sub(a).scale(α).add(a);
        };
        /**
         * @method random
         * @return {R3}
         * @static
         */
        R3.random = function () {
            return new R3([Math.random(), Math.random(), Math.random()]);
        };
        /**
         * @property e1
         * @type {Euclidean3}
         * @static
         */
        R3.e1 = Euclidean3.e1;
        /**
         * @property e2
         * @type {Euclidean3}
         * @static
         */
        R3.e2 = Euclidean3.e2;
        /**
         * @property e3
         * @type {Euclidean3}
         * @static
         */
        R3.e3 = Euclidean3.e3;
        return R3;
    })(VectorN);
    return R3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/animations/Vector3Animation',["require", "exports", '../../utils/Shareable', '../../math/R3'], function (require, exports, Shareable, R3) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var Vector3Animation = (function (_super) {
        __extends(Vector3Animation, _super);
        function Vector3Animation(value, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'Vector3Animation');
            this.to = R3.copy(value);
            this.duration = duration;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        Vector3Animation.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Vector3Animation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
                if (this.from === void 0) {
                    var data = target.getProperty(propName);
                    if (data) {
                        // Make sure to copy the coordinates so that we aren't
                        // holding onto a reference to a mutable number array.
                        this.from = new R3().copyCoordinates(data);
                    }
                }
            }
            var ease = this.ease;
            // Calculate animation progress / fraction.
            var fraction;
            if (this.duration > 0) {
                fraction = Math.min(1, (now - this.start) / (this.duration || 1));
            }
            else {
                fraction = 1;
            }
            this.fraction = fraction;
            // Simple easing support.
            var rolloff;
            switch (ease) {
                case 'in':
                    rolloff = 1 - (1 - fraction) * (1 - fraction);
                    break;
                case 'out':
                    rolloff = fraction * fraction;
                    break;
                case 'linear':
                    rolloff = fraction;
                    break;
                default:
                    rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
                    break;
            }
            var lerp = R3.lerp(this.from, this.to, rolloff);
            target.setProperty(propName, lerp.coords);
        };
        Vector3Animation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Vector3Animation.prototype.skip = function (target, propName) {
            this.duration = 0;
            this.fraction = 1;
            this.done(target, propName);
        };
        Vector3Animation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        Vector3Animation.prototype.done = function (target, propName) {
            if (this.fraction === 1) {
                // Set final value.
                target.setProperty(propName, this.to.coords);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        Vector3Animation.prototype.undo = function (target, propName) {
            if (this.from) {
                target.setProperty(propName, this.from.coords);
                this.from = void 0;
                this.start = void 0;
                this.fraction = 0;
            }
        };
        return Vector3Animation;
    })(Shareable);
    return Vector3Animation;
});

define('davinci-eight/math/dotVectorCartesianE2',["require", "exports"], function (require, exports) {
    /**
     * Computes the dot product of the Cartesian components in a Euclidean metric
     */
    function dotVectorCartesianE2(ax, ay, bx, by) {
        return ax * bx + ay * by;
    }
    return dotVectorCartesianE2;
});

define('davinci-eight/math/dotVectorE2',["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    function dotVectorE2(a, b) {
        if (isDefined(a) && isDefined(b)) {
            return a.x * b.x + a.y * b.y;
        }
        else {
            return void 0;
        }
    }
    return dotVectorE2;
});

define('davinci-eight/math/quadSpinorE2',["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined, isNumber) {
    function quadSpinorE2(s) {
        if (isDefined(s)) {
            var α = s.α;
            var xy = s.xy;
            if (isNumber(α) && isNumber(xy)) {
                return α * α + xy * xy;
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    return quadSpinorE2;
});

define('davinci-eight/math/quadVectorE2',["require", "exports", '../math/dotVectorCartesianE2', '../checks/isDefined', '../checks/isNumber'], function (require, exports, dotVectorCartesianE2, isDefined, isNumber) {
    function quadVectorE2(vector) {
        if (isDefined(vector)) {
            var x = vector.x;
            var y = vector.y;
            if (isNumber(x) && isNumber(y)) {
                return dotVectorCartesianE2(x, y, x, y);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    return quadVectorE2;
});

define('davinci-eight/math/rotorFromDirections',["require", "exports"], function (require, exports) {
    var sqrt = Math.sqrt;
    /**
     * Sets this multivector to a rotor representing a rotation from a to b.
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * Returns undefined (void 0) if the vectors are anti-parallel.
     */
    function rotorFromDirections(a, b, quad, dot, m) {
        var quadA = quad(a);
        var absA = sqrt(quadA);
        var quadB = quad(b);
        var absB = sqrt(quadB);
        var BA = absB * absA;
        var denom = sqrt(2 * (quadB * quadA + BA * dot(b, a)));
        if (denom !== 0) {
            m = m.spinor(b, a);
            m = m.addScalar(BA);
            m = m.divByScalar(denom);
            return m;
        }
        else {
            // The denominator is zero when |a||b| + a << b = 0.
            // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
            // Then a and b are anti-parallel.
            // The plane of the rotation is ambiguous.
            return void 0;
        }
    }
    return rotorFromDirections;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/SpinG2',["require", "exports", '../math/dotVectorCartesianE2', '../math/dotVectorE2', '../checks/isDefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadSpinorE2', '../math/quadVectorE2', '../math/rotorFromDirections', '../math/VectorN', '../math/wedgeXY'], function (require, exports, dotVectorCartesian, dotVector, isDefined, mustBeInteger, mustBeNumber, mustBeObject, quadSpinor, quadVector, rotorFromDirections, VectorN, wedgeXY) {
    // Symbolic constants for the coordinate indices into the coords array.
    var COORD_XY = 0;
    var COORD_ALPHA = 1;
    function one() {
        var coords = [0, 0];
        coords[COORD_ALPHA] = 1;
        coords[COORD_XY] = 0;
        return coords;
    }
    var PI = Math.PI;
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var log = Math.log;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    /**
     * @class SpinG2
     * @extends VectorN<number>
     */
    var SpinG2 = (function (_super) {
        __extends(SpinG2, _super);
        /**
         * Constructs a <code>SpinG2</code> from a <code>number[]</code>.
         * For a <em>geometric</em> implementation, use the static methods.
         * @class SpinG2
         * @constructor
         */
        function SpinG2(coordinates, modified) {
            if (coordinates === void 0) { coordinates = one(); }
            if (modified === void 0) { modified = false; }
            _super.call(this, coordinates, modified, 2);
        }
        Object.defineProperty(SpinG2.prototype, "xy", {
            /**
             * The bivector part of this spinor as a number.
             * @property xy
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                mustBeNumber('xy', xy);
                this.modified = this.modified || this.xy !== xy;
                this.coords[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG2.prototype, "α", {
            /**
             * The scalar part of this spinor as a number.
             * @property α
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_ALPHA];
            },
            set: function (α) {
                mustBeNumber('α', α);
                this.modified = this.modified || this.α !== α;
                this.coords[COORD_ALPHA] = α;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * <code>this ⟼ this + α * spinor</code>
         * </p>
         * @method add
         * @param spinor {SpinorE2}
         * @param [α = 1] {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('spinor', spinor);
            mustBeNumber('α', α);
            this.xy += spinor.xy * α;
            this.α += spinor.α * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.xy = a.xy + b.xy;
            return this;
        };
        /**
         * Intentionally undocumented.
         */
        SpinG2.prototype.addPseudo = function (β) {
            mustBeNumber('β', β);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α</code>
         * </p>
         * @method addScalar
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.addScalar = function (α) {
            mustBeNumber('α', α);
            this.α += α;
            return this;
        };
        /**
         * @method adj
         * @return {number}
         * @beta
         */
        SpinG2.prototype.adj = function () {
            throw new Error('TODO: SpinG2.adj');
        };
        /**
         * @method angle
         * @return {SpinG2}
         */
        SpinG2.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * @method clone
         * @return {SpinG2} A copy of <code>this</code>.
         * @chainable
         */
        SpinG2.prototype.clone = function () {
            return SpinG2.copy(this);
        };
        /**
         * <p>
         * <code>this ⟼ (w, -B)</code>
         * </p>
         * @method conj
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.conj = function () {
            this.xy = -this.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copy
         * @param spinor {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.copy = function (spinor) {
            mustBeObject('spinor', spinor);
            this.xy = mustBeNumber('spinor.xy', spinor.xy);
            this.α = mustBeNumber('spinor.α', spinor.α);
            return this;
        };
        /**
         * Sets this spinor to the value of the scalar, <code>α</code>.
         * @method copyScalar
         * @param α {number} The scalar to be copied.
         * @return {SpinG2}
         * @chainable
         */
        SpinG2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        /**
         * Intentionally undocumented.
         */
        SpinG2.prototype.copySpinor = function (spinor) {
            return this.copy(spinor);
        };
        /**
         * Intentionally undocumented.
         */
        SpinG2.prototype.copyVector = function (vector) {
            // The spinor has no vector components.
            return this.zero();
        };
        SpinG2.prototype.cos = function () {
            throw new Error("SpinG2.cos");
        };
        SpinG2.prototype.cosh = function () {
            throw new Error("SpinG2.cosh");
        };
        /**
         * <p>
         * <code>this ⟼ this / s</code>
         * </p>
         * @method div
         * @param s {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.div = function (s) {
            return this.div2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.xy;
            var b0 = b.α;
            var b1 = b.xy;
            var quadB = quadSpinor(b);
            this.α = (a0 * b0 + a1 * b1) / quadB;
            this.xy = (a1 * b0 - a0 * b1) / quadB;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.divByScalar = function (α) {
            this.xy /= α;
            this.α /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.exp = function () {
            var w = this.α;
            var z = this.xy;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            // FIXME: DRY
            var φ = sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.xy = z * s;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         * @method inv
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNorm());
            return this;
        };
        SpinG2.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        SpinG2.prototype.lco2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG2(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {SpinorE2}
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        // FIXME: Should really be slerp?
        SpinG2.prototype.lerp = function (target, α) {
            var R2 = SpinG2.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * <p>
         * @method lerp2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.log = function () {
            // FIXME: This is wrong see G2.
            var w = this.α;
            var z = this.xy;
            // FIXME: DRY
            var bb = z * z;
            var R2 = sqrt(bb);
            var R0 = abs(w);
            var R = sqrt(w * w + bb);
            this.α = log(R);
            var f = atan2(R2, R0) / R2;
            this.xy = z * f;
            return this;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        SpinG2.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param s {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.mul = function (s) {
            return this.mul2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.xy;
            var b0 = b.α;
            var b1 = b.xy;
            this.α = a0 * b0 - a1 * b1;
            this.xy = a0 * b1 + a1 * b0;
            return this;
        };
        /**
         * @method neg
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.neg = function () {
            this.α = -this.α;
            this.xy = -this.xy;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {SpinG2} <code>this</code>
        * @chainable
        */
        SpinG2.prototype.norm = function () {
            var norm = this.magnitude();
            return this.zero().addScalar(norm);
        };
        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method direction
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.direction = function () {
            var modulus = this.magnitude();
            this.xy = this.xy / modulus;
            this.α = this.α / modulus;
            return this;
        };
        /**
         * Sets this spinor to the identity element for multiplication, <b>1</b>.
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.one = function () {
            this.α = 1;
            this.xy = 0;
            return this;
        };
        SpinG2.prototype.pow = function () {
            throw new Error("SpinG2.pow");
        };
        /**
        * <p>
        * <code>this ⟼ this * conj(this)</code>
        * </p>
        * @method quad
        * @return {SpinG2} <code>this</code>
        * @chainable
        */
        SpinG2.prototype.quad = function () {
            var squaredNorm = this.squaredNorm();
            return this.zero().addScalar(squaredNorm);
        };
        SpinG2.prototype.sin = function () {
            throw new Error("SpinG2.sin");
        };
        SpinG2.prototype.sinh = function () {
            throw new Error("SpinG2.sinh");
        };
        /**
         * @method squaredNorm
         * @return {number} <code>this * conj(this)</code>
         */
        SpinG2.prototype.squaredNorm = function () {
            return quadSpinor(this);
        };
        SpinG2.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        SpinG2.prototype.rco2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG2(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this = (w, B) ⟼ (w, -B)</code>
         * </p>
         * @method reverse
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.rev = function () {
            this.xy *= -1;
            return this;
        };
        /**
         * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
         * The geometric formula for bivector reflection is B' = n * B * n.
         * @method reflect
         * @param n {VectorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.reflect = function (n) {
            var w = this.α;
            var β = this.xy;
            var nx = n.x;
            var ny = n.y;
            var nn = nx * nx + ny * ny;
            this.α = nn * w;
            this.xy = -nn * β;
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ rotor * this * rev(rotor)</code>
         * </p>
         * @method rotate
         * @param rotor {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.rotate = function (rotor) {
            console.warn("SpinG2.rotate is not implemented");
            return this;
        };
        /**
         * <p>
         * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
         * </p>
         * @method rotorFromDirections
         * @param a {VectorE2} The <em>from</em> vector.
         * @param b {VectorE2} The <em>to</em> vector.
         * @return {SpinG2} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        SpinG2.prototype.rotorFromDirections = function (a, b) {
            if (isDefined(rotorFromDirections(a, b, quadVector, dotVector, this))) {
                return this;
            }
            else {
            }
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @method rotorFromGeneratorAngle
         * @param B {SpinorE2}
         * @param θ {number}
         * @return {SpinG2} <code>this</code>
         */
        SpinG2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        SpinG2.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        SpinG2.prototype.scp2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG2(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         * @return {SpinG2} <code>this</code>
         */
        SpinG2.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.xy *= α;
            this.α *= α;
            return this;
        };
        SpinG2.prototype.slerp = function (target, α) {
            var R2 = SpinG2.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this - s * α</code>
         * </p>
         * @method sub
         * @param s {SpinorE2}
         * @param [α = 1] {number}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('s', s);
            mustBeNumber('α', α);
            this.xy -= s.xy * α;
            this.α -= s.α * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.sub2 = function (a, b) {
            this.xy = a.xy - b.xy;
            this.α = a.α - b.α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this SpinG2 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @return {SpinG2}
         */
        SpinG2.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.α = dotVectorCartesian(ax, ay, bx, by);
            // TODO: This is a bit wasteful.
            this.xy = wedgeXY(ax, ay, 0, bx, by, 0);
            return this;
        };
        SpinG2.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
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
        SpinG2.prototype.toExponential = function () {
            // FIXME: Do like others.
            return this.toString();
        };
        SpinG2.prototype.toFixed = function (digits) {
            // FIXME: Do like others.
            return this.toString();
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        SpinG2.prototype.toString = function () {
            return "SpinG2({β: " + this.xy + ", w: " + this.α + "})";
        };
        SpinG2.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        SpinG2.prototype.ext2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG2(a, b, this)
            return this;
        };
        /**
         * Sets this spinor to the identity element for addition, <b>0</b>.
         * @return {SpinG2} <code>this</code>
         * @chainable
         */
        SpinG2.prototype.zero = function () {
            this.α = 0;
            this.xy = 0;
            return this;
        };
        /**
         * @method copy
         * @param spinor {SpinorE2}
         * @return {SpinG2} A copy of the <code>spinor</code> argument.
         * @static
         */
        SpinG2.copy = function (spinor) {
            return new SpinG2().copy(spinor);
        };
        /**
         * @method lerp
         * @param a {SpinorE2}
         * @param b {SpinorE2}
         * @param α {number}
         * @return {SpinG2} <code>a + α * (b - a)</code>
         * @static
         */
        SpinG2.lerp = function (a, b, α) {
            return SpinG2.copy(a).lerp(b, α);
        };
        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE2} The <em>from</em> vector.
         * @param b {VectorE2} The <em>to</em> vector.
         * @return {SpinG2}
         * @static
         */
        SpinG2.rotorFromDirections = function (a, b) {
            return new SpinG2().rotorFromDirections(a, b);
        };
        return SpinG2;
    })(VectorN);
    return SpinG2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/animations/Spinor2Animation',["require", "exports", '../../utils/Shareable', '../../math/SpinG2'], function (require, exports, Shareable, SpinG2) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var Spinor2Animation = (function (_super) {
        __extends(Spinor2Animation, _super);
        function Spinor2Animation(value, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'Spinor2Animation');
            this.from = void 0;
            this.to = SpinG2.copy(value);
            this.duration = duration;
            this.start = 0;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        Spinor2Animation.prototype.destructor = function () {
        };
        Spinor2Animation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
                if (this.from === void 0) {
                    var data = target.getProperty(propName);
                    if (data) {
                        this.from = new SpinG2();
                        this.from.coords = data;
                    }
                }
            }
            var from = this.from;
            var to = this.to;
            var ease = this.ease;
            // Calculate animation progress / fraction.
            var fraction;
            if (this.duration > 0) {
                fraction = Math.min(1, (now - this.start) / (this.duration || 1));
            }
            else {
                fraction = 1;
            }
            this.fraction = fraction;
            // Simple easing support.
            var rolloff;
            switch (ease) {
                case 'in':
                    rolloff = 1 - (1 - fraction) * (1 - fraction);
                    break;
                case 'out':
                    rolloff = fraction * fraction;
                    break;
                case 'linear':
                    rolloff = fraction;
                    break;
                default:
                    rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
                    break;
            }
            var lerp = SpinG2.lerp(from, to, fraction);
            target.setProperty(propName, lerp.coords);
        };
        Spinor2Animation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Spinor2Animation.prototype.skip = function (target, propName) {
            this.duration = 0;
            this.fraction = 1;
            this.done(target, propName);
        };
        Spinor2Animation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        Spinor2Animation.prototype.done = function (target, propName) {
            if (this.fraction === 1) {
                target.setProperty(propName, this.to.coords);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        Spinor2Animation.prototype.undo = function (target, propName) {
            if (this.from) {
                target.setProperty(propName, this.from.coords);
                this.from = void 0;
                this.start = void 0;
                this.fraction = 0;
            }
        };
        return Spinor2Animation;
    })(Shareable);
    return Spinor2Animation;
});

define('davinci-eight/math/quadSpinorE3',["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined, isNumber) {
    function quadSpinorE3(s) {
        if (isDefined(s)) {
            var α = s.α;
            var x = s.yz;
            var y = s.zx;
            var z = s.xy;
            if (isNumber(α) && isNumber(x) && isNumber(y) && isNumber(z)) {
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
    return quadSpinorE3;
});

define('davinci-eight/math/quadVectorE3',["require", "exports", '../math/dotVectorCartesianE3', '../checks/isDefined', '../checks/isNumber'], function (require, exports, dotVectorCartesianE3, isDefined, isNumber) {
    function quadVectorE3(vector) {
        if (isDefined(vector)) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            if (isNumber(x) && isNumber(y) && isNumber(z)) {
                return dotVectorCartesianE3(x, y, z, x, y, z);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    return quadVectorE3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/SpinG3',["require", "exports", '../math/dotVectorCartesianE3', '../math/dotVectorE3', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadSpinorE3', '../math/quadVectorE3', '../math/rotorFromDirections', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, dotVectorCartesianE3, dotVector, mustBeInteger, mustBeNumber, mustBeObject, quadSpinor, quadVector, rotorFromDirections, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    // Symbolic constants for the coordinate indices into the coords array.
    var COORD_YZ = 0;
    var COORD_ZX = 1;
    var COORD_XY = 2;
    var COORD_SCALAR = 3;
    function one() {
        var coords = [0, 0, 0, 0];
        coords[COORD_SCALAR] = 1;
        return coords;
    }
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    /**
     * @class SpinG3
     * @extends VectorN<number>
     */
    var SpinG3 = (function (_super) {
        __extends(SpinG3, _super);
        /**
         * Constructs a <code>SpinG3</code> from a <code>number[]</code>.
         * For a <em>geometric</em> implementation, use the static methods.
         * @class SpinG3
         * @constructor
         */
        function SpinG3(coordinates, modified) {
            if (coordinates === void 0) { coordinates = one(); }
            if (modified === void 0) { modified = false; }
            _super.call(this, coordinates, modified, 4);
        }
        Object.defineProperty(SpinG3.prototype, "yz", {
            /**
             * @property yz
             * @type Number
             */
            get: function () {
                return this.coords[COORD_YZ];
            },
            set: function (yz) {
                mustBeNumber('yz', yz);
                this.modified = this.modified || this.yz !== yz;
                this.coords[COORD_YZ] = yz;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "zx", {
            /**
             * @property zx
             * @type Number
             */
            get: function () {
                return this.coords[COORD_ZX];
            },
            set: function (zx) {
                mustBeNumber('zx', zx);
                this.modified = this.modified || this.zx !== zx;
                this.coords[COORD_ZX] = zx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "xy", {
            /**
             * @property xy
             * @type Number
             */
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                mustBeNumber('xy', xy);
                this.modified = this.modified || this.xy !== xy;
                this.coords[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "α", {
            /**
             * @property α
             * @type Number
             */
            get: function () {
                return this.coords[COORD_SCALAR];
            },
            set: function (α) {
                mustBeNumber('α', α);
                this.modified = this.modified || this.α !== α;
                this.coords[COORD_SCALAR] = α;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * <code>this ⟼ this + α * spinor</code>
         * </p>
         * @method add
         * @param spinor {SpinorE3}
         * @param [α = 1] {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.add = function (spinor, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('spinor', spinor);
            mustBeNumber('α', α);
            this.yz += spinor.yz * α;
            this.zx += spinor.zx * α;
            this.xy += spinor.xy * α;
            this.α += spinor.α * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.add2 = function (a, b) {
            this.α = a.α + b.α;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            return this;
        };
        /**
         * Intentionally undocumented.
         */
        SpinG3.prototype.addPseudo = function (β) {
            mustBeNumber('β', β);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α</code>
         * </p>
         * @method addScalar
         * @param α {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.addScalar = function (α) {
            mustBeNumber('α', α);
            this.α += α;
            return this;
        };
        /**
         * @method adj
         * @return {number}
         * @beta
         */
        SpinG3.prototype.adj = function () {
            throw new Error('TODO: SpinG3.adj');
        };
        /**
         * @method angle
         * @return {SpinG3}
         */
        SpinG3.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * @method clone
         * @return {SpinG3} A copy of <code>this</code>.
         * @chainable
         */
        SpinG3.prototype.clone = function () {
            return SpinG3.copy(this);
        };
        /**
         * <p>
         * <code>this ⟼ (w, -B)</code>
         * </p>
         * @method conj
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.conj = function () {
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copy
         * @param spinor {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.copy = function (spinor) {
            mustBeObject('spinor', spinor);
            this.yz = mustBeNumber('spinor.yz', spinor.yz);
            this.zx = mustBeNumber('spinor.zx', spinor.zx);
            this.xy = mustBeNumber('spinor.xy', spinor.xy);
            this.α = mustBeNumber('spinor.α', spinor.α);
            return this;
        };
        /**
         * Sets this spinor to the value of the scalar, <code>α</code>.
         * @method copyScalar
         * @param α {number} The scalar to be copied.
         * @return {SpinG3}
         * @chainable
         */
        SpinG3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        /**
         * Intentionally undocumented.
         */
        SpinG3.prototype.copySpinor = function (s) {
            return this.copy(s);
        };
        /**
         * Intentionally undocumented.
         */
        SpinG3.prototype.copyVector = function (vector) {
            return this.zero();
        };
        /**
         * <p>
         * <code>this ⟼ this / s</code>
         * </p>
         * @method div
         * @param s {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.div = function (s) {
            return this.div2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.div2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // How does this compare to G3
            // It would be interesting to DRY this out.
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.α = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.divByScalar = function (α) {
            this.yz /= α;
            this.zx /= α;
            this.xy /= α;
            this.α /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ dual(v) = I * v</code>
         * </p>
         * @method dual
         * @param v {VectorE3} The vector whose dual will be used to set this spinor.
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.dual = function (v) {
            mustBeObject('v', v);
            this.α = 0;
            this.yz = mustBeNumber('v.x', v.x);
            this.zx = mustBeNumber('v.y', v.y);
            this.xy = mustBeNumber('v.z', v.z);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.exp = function () {
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            // FIXME: DRY
            var φ = sqrt(x * x + y * y + z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.yz = x * s;
            this.zx = y * s;
            this.xy = z * s;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         * @method inv
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.inv = function () {
            this.conj();
            this.divByScalar(this.squaredNorm());
            return this;
        };
        SpinG3.prototype.lco = function (rhs) {
            return this.lco2(this, rhs);
        };
        SpinG3.prototype.lco2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {SpinorE3}
         * @param α {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        // FIXME: Should really be slerp?
        SpinG3.prototype.lerp = function (target, α) {
            var R2 = SpinG3.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * <p>
         * @method lerp2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @param α {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.log = function () {
            // FIXME: Wrong
            var w = this.α;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            // FIXME: DRY
            var bb = x * x + y * y + z * z;
            var R2 = sqrt(bb);
            var R0 = Math.abs(w);
            var R = sqrt(w * w + bb);
            this.α = Math.log(R);
            var θ = Math.atan2(R2, R0) / R2;
            // The angle, θ, produced by atan2 will be in the range [-π, +π]
            this.yz = x * θ;
            this.zx = y * θ;
            this.xy = z * θ;
            return this;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        SpinG3.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param s {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.mul = function (s) {
            return this.mul2(this, s);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // It would be interesting to DRY this out.
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.α = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
         * @method neg
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.neg = function () {
            this.α = -this.α;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {SpinG3} <code>this</code>
        * @chainable
        */
        SpinG3.prototype.norm = function () {
            var norm = this.magnitude();
            return this.zero().addScalar(norm);
        };
        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method direction
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.direction = function () {
            var modulus = this.magnitude();
            this.yz = this.yz / modulus;
            this.zx = this.zx / modulus;
            this.xy = this.xy / modulus;
            this.α = this.α / modulus;
            return this;
        };
        /**
         * Sets this spinor to the identity element for multiplication, <b>1</b>.
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.one = function () {
            this.α = 1;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ this * conj(this)</code>
        * </p>
        * @method quad
        * @return {SpinG3} <code>this</code>
        * @chainable
        */
        SpinG3.prototype.quad = function () {
            var squaredNorm = this.squaredNorm();
            return this.zero().addScalar(squaredNorm);
        };
        /**
         * @method squaredNorm
         * @return {number} <code>this * conj(this)</code>
         */
        SpinG3.prototype.squaredNorm = function () {
            return quadSpinor(this);
        };
        SpinG3.prototype.rco = function (rhs) {
            return this.rco2(this, rhs);
        };
        SpinG3.prototype.rco2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this = (w, B) ⟼ (w, -B)</code>
         * </p>
         * @method reverse
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.rev = function () {
            this.yz *= -1;
            this.zx *= -1;
            this.xy *= -1;
            return this;
        };
        /**
         * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
         * The geometric formula for bivector reflection is B' = n * B * n.
         * @method reflect
         * @param n {VectorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.reflect = function (n) {
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
        /**
         * <p>
         * <code>this = ⟼ rotor * this * rev(rotor)</code>
         * </p>
         * @method rotate
         * @param rotor {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.rotate = function (rotor) {
            console.warn("SpinG3.rotate is not implemented");
            return this;
        };
        /**
         * <p>
         * Computes a rotor, R, from two vectors, where
         * R = (abs(b) * abs(a) + b * a) / sqrt(2 * (quad(b) * quad(a) + abs(b) * abs(a) * b << a))
         * </p>
         * @method rotor
         * @param a {VectorE3} The <em>from</em> vector.
         * @param b {VectorE3} The <em>to</em> vector.
         * @return {SpinG3} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        SpinG3.prototype.rotorFromDirections = function (a, b) {
            return rotorFromDirections(a, b, quadVector, dotVector, this);
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
         * </p>
         * @method rotorFromAxisAngle
         * @param axis {VectorE3}
         * @param θ {number}
         * @return {SpinG3} <code>this</code>
         */
        SpinG3.prototype.rotorFromAxisAngle = function (axis, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -axis.x * s;
            this.zx = -axis.y * s;
            this.xy = -axis.z * s;
            this.α = cos(φ);
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @method rotorFromGeneratorAngle
         * @param B {SpinorE3}
         * @param θ {number}
         * @return {SpinG3} <code>this</code>
         */
        SpinG3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -B.yz * s;
            this.zx = -B.zx * s;
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        SpinG3.prototype.scp = function (rhs) {
            return this.scp2(this, rhs);
        };
        SpinG3.prototype.scp2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         * @return {SpinG3} <code>this</code>
         */
        SpinG3.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.yz *= α;
            this.zx *= α;
            this.xy *= α;
            this.α *= α;
            return this;
        };
        SpinG3.prototype.slerp = function (target, α) {
            var R2 = SpinG3.copy(target);
            var R1 = this.clone();
            var R = R2.mul(R1.inv());
            R.log();
            R.scale(α);
            R.exp();
            this.copy(R);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this - s * α</code>
         * </p>
         * @method sub
         * @param s {SpinorE3}
         * @param [α = 1] {number}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.sub = function (s, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('s', s);
            mustBeNumber('α', α);
            this.yz -= s.yz * α;
            this.zx -= s.zx * α;
            this.xy -= s.xy * α;
            this.α -= s.α * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.sub2 = function (a, b) {
            this.yz = a.yz - b.yz;
            this.zx = a.zx - b.zx;
            this.xy = a.xy - b.xy;
            this.α = a.α - b.α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this SpinG3 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {SpinG3}
         */
        SpinG3.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.α = dotVectorCartesianE3(ax, ay, az, bx, by, bz);
            this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY(ax, ay, az, bx, by, bz);
            return this;
        };
        SpinG3.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
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
        SpinG3.prototype.toExponential = function () {
            // FIXME: Do like others.
            return this.toString();
        };
        SpinG3.prototype.toFixed = function (digits) {
            // FIXME: Do like others.
            return this.toString();
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        SpinG3.prototype.toString = function () {
            return "SpinG3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.α + "})";
        };
        SpinG3.prototype.ext = function (rhs) {
            return this.ext2(this, rhs);
        };
        SpinG3.prototype.ext2 = function (a, b) {
            // FIXME: How to leverage? Maybe break up? Don't want performance hit.
            // scpG3(a, b, this)
            return this;
        };
        /**
         * Sets this spinor to the identity element for addition, <b>0</b>.
         * @return {SpinG3} <code>this</code>
         * @chainable
         */
        SpinG3.prototype.zero = function () {
            this.α = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
         * @method copy
         * @param spinor {SpinorE3}
         * @return {SpinG3} A copy of the <code>spinor</code> argument.
         * @static
         */
        SpinG3.copy = function (spinor) {
            return new SpinG3().copy(spinor);
        };
        /**
         * Computes I * <code>v</code>, the dual of <code>v</code>.
         * @method dual
         * @param v {VectorE3}
         * @return {SpinG3}
         */
        SpinG3.dual = function (v) {
            return new SpinG3().dual(v);
        };
        /**
         * @method lerp
         * @param a {SpinorE3}
         * @param b {SpinorE3}
         * @param α {number}
         * @return {SpinG3} <code>a + α * (b - a)</code>
         * @static
         */
        SpinG3.lerp = function (a, b, α) {
            return SpinG3.copy(a).lerp(b, α);
        };
        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE3} The <em>from</em> vector.
         * @param b {VectorE3} The <em>to</em> vector.
         * @return {SpinG3}
         * @static
         */
        SpinG3.rotorFromDirections = function (a, b) {
            return new SpinG3().rotorFromDirections(a, b);
        };
        return SpinG3;
    })(VectorN);
    return SpinG3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/slideshow/animations/Spinor3Animation',["require", "exports", '../../utils/Shareable', '../../math/SpinG3'], function (require, exports, Shareable, SpinG3) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var Spinor3Animation = (function (_super) {
        __extends(Spinor3Animation, _super);
        function Spinor3Animation(value, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'Spinor3Animation');
            this.from = void 0;
            this.to = SpinG3.copy(value);
            this.duration = duration;
            this.start = 0;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        Spinor3Animation.prototype.destructor = function () {
        };
        Spinor3Animation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
                if (this.from === void 0) {
                    var data = target.getProperty(propName);
                    if (data) {
                        this.from = new SpinG3();
                        this.from.coords = data;
                    }
                }
            }
            var from = this.from;
            var to = this.to;
            var ease = this.ease;
            // Calculate animation progress / fraction.
            var fraction;
            if (this.duration > 0) {
                fraction = Math.min(1, (now - this.start) / (this.duration || 1));
            }
            else {
                fraction = 1;
            }
            this.fraction = fraction;
            // Simple easing support.
            var rolloff;
            switch (ease) {
                case 'in':
                    rolloff = 1 - (1 - fraction) * (1 - fraction);
                    break;
                case 'out':
                    rolloff = fraction * fraction;
                    break;
                case 'linear':
                    rolloff = fraction;
                    break;
                default:
                    rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
                    break;
            }
            var lerp = SpinG3.lerp(from, to, fraction);
            target.setProperty(propName, lerp.coords);
        };
        Spinor3Animation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Spinor3Animation.prototype.skip = function (target, propName) {
            this.duration = 0;
            this.fraction = 1;
            this.done(target, propName);
        };
        Spinor3Animation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        Spinor3Animation.prototype.done = function (target, propName) {
            if (this.fraction === 1) {
                target.setProperty(propName, this.to.coords);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        Spinor3Animation.prototype.undo = function (target, propName) {
            if (this.from) {
                target.setProperty(propName, this.from.coords);
                this.from = void 0;
                this.start = void 0;
                this.fraction = 0;
            }
        };
        return Spinor3Animation;
    })(Shareable);
    return Spinor3Animation;
});

define('davinci-eight/core/Symbolic',["require", "exports"], function (require, exports) {
    /**
     * <p>
     * Canonical variable names, which also act as semantic identifiers for name overrides.
     * These names must be stable to avoid breaking custom vertex and fragment shaders.
     * </p>
     *
     * @class Symbolic
     */
    var Symbolic = (function () {
        function Symbolic() {
        }
        /**
         * 'aColor'
         * @property ATTRIBUTE_COLOR
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_COLOR = 'aColor';
        /**
         * 'aGeometryIndex'
         * @property ATTRIBUTE_GEOMETRY_INDEX
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
        /**
         * 'aNormal'
         * @property ATTRIBUTE_NORMAL
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_NORMAL = 'aNormal';
        /**
         * 'aPosition'
         * @property ATTRIBUTE_POSITION
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_POSITION = 'aPosition';
        /**
         * 'aTextureCoords'
         * @property ATTRIBUTE_TEXTURE_COORDS
         * @type {string}
         * @static
         */
        Symbolic.ATTRIBUTE_TEXTURE_COORDS = 'aTextureCoords';
        /**
         * 'uAlpha'
         * @property UNIFORM_ALPHA
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_ALPHA = 'uAlpha';
        /**
         * 'uAmbientLight'
         * @property UNIFORM_AMBIENT_LIGHT
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        /**
         * 'uColor'
         * @property UNIFORM_COLOR
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_COLOR = 'uColor';
        /**
         * 'uDirectionalLightColor'
         * @property UNIFORM_DIRECTIONAL_LIGHT_COLOR
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        /**
         * 'uDirectionalLightDirection'
         * @property UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        /**
         * 'uPointLightColor'
         * @property UNIFORM_POINT_LIGHT_COLOR
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        /**
         * 'uPointLightPosition'
         * @property UNIFORM_POINT_LIGHT_POSITION
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        /**
         * 'uPointSize'
         * @property UNIFORM_POINT_SIZE
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_POINT_SIZE = 'uPointSize';
        /**
         * 'uProjection'
         * @property UNIFORM_PROJECTION_MATRIX
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_PROJECTION_MATRIX = 'uProjection';
        /**
         * 'uReflectionOne'
         * @property UNIFORM_REFLECTION_ONE_MATRIX
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';
        /**
         * 'uReflectionTwo'
         * @property UNIFORM_REFLECTION_TWO_MATRIX
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';
        /**
         * 'uModel'
         * @property UNIFORM_MODEL_MATRIX
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_MODEL_MATRIX = 'uModel';
        /**
         * 'uNormal'
         * @property UNIFORM_NORMAL_MATRIX
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_NORMAL_MATRIX = 'uNormal';
        /**
         * 'uView'
         * @property UNIFORM_VIEW_MATRIX
         * @type {string}
         * @static
         */
        Symbolic.UNIFORM_VIEW_MATRIX = 'uView';
        /**
         * 'vColor'
         * @property VARYING_COLOR
         * @type {string}
         * @static
         */
        Symbolic.VARYING_COLOR = 'vColor';
        /**
         * 'vLight'
         * @property VARYING_LIGHT
         * @type {string}
         * @static
         */
        Symbolic.VARYING_LIGHT = 'vLight';
        return Symbolic;
    })();
    return Symbolic;
});

define('davinci-eight/cameras/viewArray',["require", "exports", '../math/R3', '../checks/expectArg', '../checks/isDefined'], function (require, exports, R3, expectArg, isDefined) {
    function viewArray(eye, look, up, matrix) {
        var m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expectArg('matrix', m).toSatisfy(m.length === 16, 'matrix must have length 16');
        var n = new R3().sub2(eye, look);
        if (n.x === 0 && n.y === 0 && n.z === 0) {
            // View direction is ambiguous.
            n.z = 1;
        }
        else {
            n.direction();
        }
        var u = new R3().cross2(up, n);
        var v = new R3().cross2(n, u);
        var d = new R3([R3.dot(eye, u), R3.dot(eye, v), R3.dot(eye, n)]).scale(-1);
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
        var m = isDefined(matrix) ? matrix : Matrix4.one();
        viewArray(eye, look, up, m.elements);
        return m;
    }
    return viewMatrix;
});

define('davinci-eight/cameras/createView',["require", "exports", '../math/Euclidean3', '../math/R3', '../math/Matrix4', '../checks/mustBeNumber', '../checks/mustBeObject', '../core/Symbolic', '../checks/isUndefined', '../cameras/viewMatrix'], function (require, exports, Euclidean3, R3, Matrix4, mustBeNumber, mustBeObject, Symbolic, isUndefined, computeViewMatrix) {
    /**
     * @class createView
     * @constructor
     */
    var createView = function (options) {
        var refCount = 1;
        var eye = new R3();
        var look = new R3();
        var up = R3.copy(Euclidean3.e2);
        var viewMatrix = Matrix4.one();
        var viewMatrixName = isUndefined(options.viewMatrixName) ? Symbolic.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
        // Force an update of the view matrix.
        eye.modified = true;
        look.modified = true;
        up.modified = true;
        var self = {
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                return refCount;
            },
            get uuid() {
                return "";
            },
            getProperty: function (name) {
                return void 0;
            },
            setProperty: function (name, value) {
            },
            get eye() {
                return eye;
            },
            set eye(value) {
                self.setEye(value);
            },
            /**
             * @method setEye
             * @param eye {R3}
             * @return {View} `this` instance.
             */
            setEye: function (eye_) {
                mustBeObject('eye', eye_);
                eye.x = mustBeNumber('eye.x', eye_.x);
                eye.y = mustBeNumber('eye.y', eye_.y);
                eye.z = mustBeNumber('eye.z', eye_.z);
                return self;
            },
            get look() {
                return look;
            },
            set look(value) {
                self.setLook(value);
            },
            setLook: function (value) {
                mustBeObject('look', value);
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
                mustBeObject('up', value);
                up.x = value.x;
                up.y = value.y;
                up.z = value.z;
                up.direction();
                return self;
            },
            setUniforms: function (visitor, canvasId) {
                if (eye.modified || look.modified || up.modified) {
                    // TODO: view matrix would be better.
                    computeViewMatrix(eye, look, up, viewMatrix);
                    eye.modified = false;
                    look.modified = false;
                    up.modified = false;
                }
                visitor.uniformMatrix4(viewMatrixName, false, viewMatrix, canvasId);
            }
        };
        return self;
    };
    return createView;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/R1',["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var COORD_X = 0;
    /**
     * @class R1
     */
    var R1 = (function (_super) {
        __extends(R1, _super);
        /**
         * @class R1
         * @constructor
         * @param data {number[]} Default is [0].
         * @param modified {boolean} Default is false.
         */
        function R1(data, modified) {
            if (data === void 0) { data = [0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 1);
        }
        Object.defineProperty(R1.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
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
        R1.prototype.set = function (x) {
            this.x = x;
            return this;
        };
        R1.prototype.add = function (vector, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.x += vector.x * alpha;
            return this;
        };
        R1.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            return this;
        };
        R1.prototype.scp = function (v) {
            return this;
        };
        R1.prototype.adj = function () {
            throw new Error('TODO: R1.adj');
        };
        R1.prototype.conj = function () {
            return this;
        };
        R1.prototype.copy = function (v) {
            this.x = v.x;
            return this;
        };
        R1.prototype.determinant = function () {
            return this.x;
        };
        R1.prototype.dual = function () {
            return this;
        };
        R1.prototype.exp = function () {
            this.x = exp(this.x);
            return this;
        };
        R1.prototype.one = function () {
            this.x = 1;
            return this;
        };
        R1.prototype.inv = function () {
            this.x = 1 / this.x;
            return this;
        };
        R1.prototype.lco = function (v) {
            return this;
        };
        R1.prototype.log = function () {
            this.x = log(this.x);
            return this;
        };
        R1.prototype.mul = function (v) {
            this.x *= v.x;
            return this;
        };
        R1.prototype.norm = function () {
            return this;
        };
        R1.prototype.div = function (v) {
            this.x /= v.x;
            return this;
        };
        R1.prototype.divByScalar = function (scalar) {
            this.x /= scalar;
            return this;
        };
        R1.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            return this;
        };
        R1.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            return this;
        };
        R1.prototype.floor = function () {
            this.x = Math.floor(this.x);
            return this;
        };
        R1.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            return this;
        };
        R1.prototype.rev = function () {
            return this;
        };
        R1.prototype.rco = function (v) {
            return this;
        };
        R1.prototype.round = function () {
            this.x = Math.round(this.x);
            return this;
        };
        R1.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            return this;
        };
        R1.prototype.scale = function (scalar) {
            this.x *= scalar;
            return this;
        };
        R1.prototype.sub = function (v) {
            this.x -= v.x;
            return this;
        };
        R1.prototype.subScalar = function (s) {
            this.x -= s;
            return this;
        };
        R1.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            return this;
        };
        /**
         * @method neg
         * @return {R1} <code>this</code>
         */
        R1.prototype.neg = function () {
            this.x = -this.x;
            return this;
        };
        /**
         * @method distanceTo
         * @param point {VectorE1}
         * @return {number}
         */
        R1.prototype.distanceTo = function (position) {
            return sqrt(this.quadranceTo(position));
        };
        R1.prototype.dot = function (v) {
            return this.x * v.x;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        R1.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        R1.prototype.direction = function () {
            return this.divByScalar(this.magnitude());
        };
        R1.prototype.mul2 = function (a, b) {
            return this;
        };
        R1.prototype.quad = function () {
            var x = this.x;
            this.x = x * x;
            return this;
        };
        R1.prototype.squaredNorm = function () {
            return this.x * this.x;
        };
        R1.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            return dx * dx;
        };
        R1.prototype.reflect = function (n) {
            // FIXME: TODO
            return this;
        };
        R1.prototype.rotate = function (rotor) {
            return this;
        };
        /**
         * this ⟼ this + α * (v - this)</code>
         * @method lerp
         * @param v {VectorE1}
         * @param α {number}
         * @return {MutanbleNumber}
         * @chainable
         */
        R1.prototype.lerp = function (v, α) {
            this.x += (v.x - this.x) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {R1}
         * @param b {R1}
         * @param α {number}
         * @return {R1}
         * @chainable
         */
        R1.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        R1.prototype.equals = function (v) {
            return v.x === this.x;
        };
        R1.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            return this;
        };
        R1.prototype.slerp = function (v, α) {
            return this;
        };
        R1.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            return array;
        };
        R1.prototype.toExponential = function () {
            return "TODO: R1.toExponential";
        };
        R1.prototype.toFixed = function (digits) {
            return "TODO: R1.toFixed";
        };
        R1.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            return this;
        };
        R1.prototype.clone = function () {
            return new R1([this.x]);
        };
        R1.prototype.ext = function (v) {
            return this;
        };
        /**
         * Sets this vector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {R1}
         * @chainable
         */
        R1.prototype.zero = function () {
            this.x = 0;
            return this;
        };
        return R1;
    })(VectorN);
    return R1;
});

define('davinci-eight/cameras/createFrustum',["require", "exports", 'davinci-eight/cameras/createView', 'davinci-eight/math/Matrix4', '../math/R1'], function (require, exports, createView, Matrix4, R1) {
    /**
     * @function createFrustum
     * @constructor
     * @return {Frustum}
     */
    var createFrustum = function (viewMatrixName, projectionMatrixName) {
        var refCount = 1;
        var base = createView(viewMatrixName);
        var left = new R1();
        var right = new R1();
        var bottom = new R1();
        var top = new R1();
        var near = new R1();
        var far = new R1();
        // TODO: We should immediately create with a frustum static constructor?
        var projectionMatrix = Matrix4.one();
        function updateProjectionMatrix() {
            projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
        }
        updateProjectionMatrix();
        var self = {
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                return refCount;
            },
            get uuid() {
                return "";
            },
            getProperty: function (name) {
                return void 0;
            },
            setProperty: function (name, value) {
            },
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
            setUniforms: function (visitor, canvasId) {
                visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix, canvasId);
                base.setUniforms(visitor, canvasId);
            }
        };
        return self;
    };
    return createFrustum;
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
        var m = isDefined(matrix) ? matrix : Matrix4.one();
        perspectiveArray(fov, aspect, near, far, m.elements);
        return m;
    }
    return perspectiveMatrix;
});

define('davinci-eight/cameras/createPerspective',["require", "exports", '../cameras/createView', '../math/Matrix4', '../core/Symbolic', '../math/R1', '../checks/isUndefined', '../checks/expectArg', '../cameras/perspectiveMatrix'], function (require, exports, createView, Matrix4, Symbolic, R1, isUndefined, expectArg, computePerspectiveMatrix) {
    /**
     * @function createPerspective
     * @constructor
     * @param fov {number}
     * @param aspect {number}
     * @param near {number}
     * @param far {number}
     * @return {Perspective}
     */
    var createPerspective = function (options) {
        options = options || {};
        var fov = new R1([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
        var aspect = new R1([isUndefined(options.aspect) ? 1 : options.aspect]);
        var near = new R1([isUndefined(options.near) ? 0.1 : options.near]);
        var far = new R1([expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value]);
        var projectionMatrixName = isUndefined(options.projectionMatrixName) ? Symbolic.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
        var refCount = 1;
        var base = createView(options);
        var projectionMatrix = Matrix4.one();
        var matrixNeedsUpdate = true;
        var self = {
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                return refCount;
            },
            get uuid() {
                return "";
            },
            getProperty: function (name) {
                return void 0;
            },
            setProperty: function (name, value) {
            },
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
            setUniforms: function (visitor, canvasId) {
                if (matrixNeedsUpdate) {
                    computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                    matrixNeedsUpdate = false;
                }
                visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix, canvasId);
                base.setUniforms(visitor, canvasId);
            }
        };
        return self;
    };
    return createPerspective;
});

define('davinci-eight/commands/BlendFactor',["require", "exports"], function (require, exports) {
    /**
     * <p>
     * The enumerated blending factors for use with <code>WebGLBlendFunc</code>.
     * </p>
     * <p>
     * These values correspond to the values required for <code>gl.blendFunc</code>
     * but are not the same values.
     * </p>
     * <p>
     * Assuming destination with RGBA values of (R<sub>d</sub>, G<sub>d</sub>, B<sub>d</sub>, A<sub>d</sub>),
     * and source fragment with values (R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub>, A<sub>s</sub>),
     * <ul>
     * <li>R<sub>result</sub> = R<sub>s</sub> * S<sub>r</sub> + R<sub>d</sub> * D<sub>r</sub></li>
     * </ul>
     * </p>
     * @class BlendFactor
     */
    var BlendFactor;
    (function (BlendFactor) {
        /**
         * @property DST_ALPHA
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["DST_ALPHA"] = 0] = "DST_ALPHA";
        /**
         * @property DST_COLOR
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["DST_COLOR"] = 1] = "DST_COLOR";
        /**
         * @property ONE
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["ONE"] = 2] = "ONE";
        /**
         * @property ONE_MINUS_DST_ALPHA
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["ONE_MINUS_DST_ALPHA"] = 3] = "ONE_MINUS_DST_ALPHA";
        /**
         * @property ONE_MINUS_DST_COLOR
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["ONE_MINUS_DST_COLOR"] = 4] = "ONE_MINUS_DST_COLOR";
        /**
         * @property ONE_MINUS_SRC_ALPHA
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["ONE_MINUS_SRC_ALPHA"] = 5] = "ONE_MINUS_SRC_ALPHA";
        /**
         * @property ONE_MINUS_SRC_COLOR
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["ONE_MINUS_SRC_COLOR"] = 6] = "ONE_MINUS_SRC_COLOR";
        /**
         * @property SRC_ALPHA
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["SRC_ALPHA"] = 7] = "SRC_ALPHA";
        /**
         * @property SRC_ALPHA_SATURATE
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["SRC_ALPHA_SATURATE"] = 8] = "SRC_ALPHA_SATURATE";
        /**
         * @property SRC_COLOR
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["SRC_COLOR"] = 9] = "SRC_COLOR";
        /**
         * @property ZERO
         * @type {BlendFactor}
         */
        BlendFactor[BlendFactor["ZERO"] = 10] = "ZERO";
    })(BlendFactor || (BlendFactor = {}));
    return BlendFactor;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLBlendFunc',["require", "exports", '../commands/BlendFactor', '../utils/Shareable'], function (require, exports, BlendFactor, Shareable) {
    var factors = [
        BlendFactor.DST_ALPHA,
        BlendFactor.DST_COLOR,
        BlendFactor.ONE,
        BlendFactor.ONE_MINUS_DST_ALPHA,
        BlendFactor.ONE_MINUS_DST_COLOR,
        BlendFactor.ONE_MINUS_SRC_ALPHA,
        BlendFactor.ONE_MINUS_SRC_COLOR,
        BlendFactor.SRC_ALPHA,
        BlendFactor.SRC_ALPHA_SATURATE,
        BlendFactor.SRC_COLOR,
        BlendFactor.ZERO
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
            case BlendFactor.ONE: return gl.ONE;
            case BlendFactor.SRC_ALPHA: return gl.SRC_ALPHA;
            default: {
                throw new Error(factor + " is not a valid factor.");
            }
        }
    }
    /**
     * @class WebGLBlendFunc
     * @extends Shareable
     * @implements IContextCommand
     * @implements IContextConsumer
     */
    var WebGLBlendFunc = (function (_super) {
        __extends(WebGLBlendFunc, _super);
        /**
         * @class WebGLBlendFunc
         * @constructor
         * @param sfactor {BlendFactor}
         * @param dfactor {BlendFactor}
         */
        function WebGLBlendFunc(sfactor, dfactor) {
            _super.call(this, 'WebGLBlendFunc');
            this.sfactor = mustBeFactor('sfactor', sfactor);
            this.dfactor = mustBeFactor('dfactor', dfactor);
        }
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        WebGLBlendFunc.prototype.contextFree = function (canvasId) {
            // do nothing
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        WebGLBlendFunc.prototype.contextGain = function (manager) {
            this.execute(manager.gl);
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        WebGLBlendFunc.prototype.contextLost = function (canvasId) {
            // do nothing
        };
        WebGLBlendFunc.prototype.execute = function (gl) {
            gl.blendFunc(factor(this.sfactor, gl), factor(this.dfactor, gl));
        };
        /**
         * @method destructor
         * @return {void}
         */
        WebGLBlendFunc.prototype.destructor = function () {
            this.sfactor = void 0;
            this.dfactor = void 0;
        };
        return WebGLBlendFunc;
    })(Shareable);
    return WebGLBlendFunc;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLClearColor',["require", "exports", '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, mustBeNumber, Shareable) {
    /**
     * <p>
     * clearColor(red: number, green: number, blue: number, alpha: number): void
     * <p>
     * @class WebGLClearColor
     * @extends Shareable
     * @implements IContextCommand
     * @implements IContextConsumer
     */
    var WebGLClearColor = (function (_super) {
        __extends(WebGLClearColor, _super);
        /**
         * @class WebGLClearColor
         * @constructor
         */
        function WebGLClearColor(red, green, blue, alpha) {
            if (red === void 0) { red = 0; }
            if (green === void 0) { green = 0; }
            if (blue === void 0) { blue = 0; }
            if (alpha === void 0) { alpha = 1; }
            _super.call(this, 'WebGLClearColor');
            this.red = mustBeNumber('red', red);
            this.green = mustBeNumber('green', green);
            this.blue = mustBeNumber('blue', blue);
            this.alpha = mustBeNumber('alpha', alpha);
        }
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        WebGLClearColor.prototype.contextFree = function (canvasId) {
            // do nothing
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        WebGLClearColor.prototype.contextGain = function (manager) {
            mustBeNumber('red', this.red);
            mustBeNumber('green', this.green);
            mustBeNumber('blue', this.blue);
            mustBeNumber('alpha', this.alpha);
            manager.gl.clearColor(this.red, this.green, this.blue, this.alpha);
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        WebGLClearColor.prototype.contextLost = function (canvasId) {
            // do nothing
        };
        /**
         * @method destructor
         * @return {void}
         */
        WebGLClearColor.prototype.destructor = function () {
            this.red = void 0;
            this.green = void 0;
            this.blue = void 0;
            this.alpha = void 0;
            _super.prototype.destructor.call(this);
        };
        return WebGLClearColor;
    })(Shareable);
    return WebGLClearColor;
});

define('davinci-eight/commands/Capability',["require", "exports"], function (require, exports) {
    /**
     * A capability that may be enabled or disabled for a <code>WebGLRenderingContext</code>.
     * @class Capability
     */
    var Capability;
    (function (Capability) {
        /**
         * Blend computed fragment color values with color buffer values.
         * @property BLEND
         * @type {Capability}
         */
        Capability[Capability["BLEND"] = 0] = "BLEND";
        /**
         * Let polygons be culled.
         * @property CULL_FACE
         * @type {Capability}
         */
        Capability[Capability["CULL_FACE"] = 1] = "CULL_FACE";
        /**
         * Enable updates of the depth buffer.
         * @property DEPTH_TEST
         * @type {Capability}
         */
        Capability[Capability["DEPTH_TEST"] = 2] = "DEPTH_TEST";
        /**
         * Add an offset to the depth values of a polygon's fragments.
         * @property POLYGON_OFFSET_FILL
         * @type {Capability}
         */
        Capability[Capability["POLYGON_OFFSET_FILL"] = 3] = "POLYGON_OFFSET_FILL";
        /**
         * Abandon fragments outside a scissor rectangle.
         * @property SCISSOR_TEST
         * @type {Capability}
         */
        Capability[Capability["SCISSOR_TEST"] = 4] = "SCISSOR_TEST";
    })(Capability || (Capability = {}));
    return Capability;
});

define('davinci-eight/checks/mustBeDefined',["require", "exports", '../checks/mustSatisfy', '../checks/isDefined'], function (require, exports, mustSatisfy, isDefined) {
    function beDefined() {
        return "not be be `undefined`";
    }
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
        return value;
    }
    return mustBeDefined;
});

define('davinci-eight/commands/glCapability',["require", "exports", '../commands/Capability', '../checks/isDefined', '../checks/mustBeDefined', '../checks/mustBeInteger'], function (require, exports, Capability, isDefined, mustBeDefined, mustBeInteger) {
    // Converts the Capability enum to a WebGLRenderingContext symbolic constant.
    function glCapability(capability, gl) {
        if (isDefined(capability)) {
            mustBeInteger('capability', capability);
            mustBeDefined('gl', gl);
            switch (capability) {
                case Capability.BLEND: return gl.BLEND;
                case Capability.CULL_FACE: return gl.CULL_FACE;
                case Capability.DEPTH_TEST: return gl.DEPTH_TEST;
                case Capability.POLYGON_OFFSET_FILL: return gl.POLYGON_OFFSET_FILL;
                case Capability.SCISSOR_TEST: return gl.SCISSOR_TEST;
                default: {
                    throw new Error(capability + " is not a valid capability.");
                }
            }
        }
        else {
            return void 0;
        }
    }
    return glCapability;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLDisable',["require", "exports", '../commands/glCapability', '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, glCapability, mustBeNumber, Shareable) {
    /**
     * <p>
     * disable(capability: Capability): void
     * <p>
     * @class WebGLDisable
     * @extends Shareable
     * @implements IContextCommand
     * @implements IContextConsumer
     */
    var WebGLDisable = (function (_super) {
        __extends(WebGLDisable, _super);
        /**
         * @class WebGLDisable
         * @constructor
         * @param capability {string} The name of the WebGLRenderingContext property to be disabled.
         */
        function WebGLDisable(capability) {
            _super.call(this, 'WebGLDisable');
            this._capability = mustBeNumber('capability', capability);
        }
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        WebGLDisable.prototype.contextFree = function (canvasId) {
            // do nothing
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        WebGLDisable.prototype.contextGain = function (manager) {
            manager.gl.disable(glCapability(this._capability, manager.gl));
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        WebGLDisable.prototype.contextLost = function (canvasId) {
            // do nothing
        };
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        WebGLDisable.prototype.destructor = function () {
            this._capability = void 0;
            _super.prototype.destructor.call(this);
        };
        return WebGLDisable;
    })(Shareable);
    return WebGLDisable;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/commands/WebGLEnable',["require", "exports", '../commands/glCapability', '../checks/mustBeNumber', '../utils/Shareable'], function (require, exports, glCapability, mustBeNumber, Shareable) {
    /**
     * <p>
     * enable(capability: Capability): void
     * <p>
     * @class WebGLEnable
     * @extends Shareable
     * @implements IContextCommand
     * @implements IContextConsumer
     */
    var WebGLEnable = (function (_super) {
        __extends(WebGLEnable, _super);
        /**
         * @class WebGLEnable
         * @constructor
         * @param capability {Capability} The capability to be enabled.
         */
        function WebGLEnable(capability) {
            _super.call(this, 'WebGLEnable');
            this._capability = mustBeNumber('capability', capability);
        }
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        WebGLEnable.prototype.contextFree = function (canvasId) {
            // do nothing
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        WebGLEnable.prototype.contextGain = function (manager) {
            manager.gl.enable(glCapability(this._capability, manager.gl));
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        WebGLEnable.prototype.contextLost = function (canvasId) {
            // do nothing
        };
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        WebGLEnable.prototype.destructor = function () {
            this._capability = void 0;
            _super.prototype.destructor.call(this);
        };
        return WebGLEnable;
    })(Shareable);
    return WebGLEnable;
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
     * @implements IContextProgramConsumer
     */
    var AttribLocation = (function () {
        /**
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * @class AttribLocation
         * @constructor
         * @param manager {IContextProvider} Unused. May be used later e.g. for mirroring.
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
            this.contextLost();
        };
        AttribLocation.prototype.contextGain = function (context, program) {
            this.contextLost();
            this._index = context.getAttribLocation(program, this._name);
            this._context = context;
        };
        AttribLocation.prototype.contextLost = function () {
            this._index = void 0;
            this._context = void 0;
        };
        /**
         * @method vertexPointer
         * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
         * @param normalized {boolean} Used for WebGL rendering context vertexAttribPointer method.
         * @param stride {number} Used for WebGL rendering context vertexAttribPointer method.
         * @param offset {number} Used for WebGL rendering context vertexAttribPointer method.
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

define('davinci-eight/core',["require", "exports"], function (require, exports) {
    /**
     *
     */
    var core = {
        strict: false,
        GITHUB: 'https://github.com/geometryzen/davinci-eight',
        APIDOC: 'http://www.mathdoodle.io/vendor/davinci-eight@2.102.0/documentation/index.html',
        LAST_MODIFIED: '2015-11-15',
        NAMESPACE: 'EIGHT',
        verbose: true,
        VERSION: '2.154.0'
    };
    return core;
});

define('davinci-eight/core/DrawMode',["require", "exports"], function (require, exports) {
    /**
     * The enumerated modes of drawing WebGL primitives.
     * @class DrawMode
     */
    var DrawMode;
    (function (DrawMode) {
        /**
         * @property POINTS
         * @type {DrawMode}
         */
        DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
        /**
         * @property LINES
         * @type {DrawMode}
         */
        DrawMode[DrawMode["LINES"] = 1] = "LINES";
        /**
         * @property LINE_STRIP
         * @type {DrawMode}
         */
        DrawMode[DrawMode["LINE_STRIP"] = 2] = "LINE_STRIP";
        /**
         * @property LINE_LOOP
         * @type {DrawMode}
         */
        DrawMode[DrawMode["LINE_LOOP"] = 3] = "LINE_LOOP";
        /**
         * @property TRIANGLES
         * @type {DrawMode}
         */
        DrawMode[DrawMode["TRIANGLES"] = 4] = "TRIANGLES";
        /**
         * @property TRIANGLE_STRIP
         * @type {DrawMode}
         */
        DrawMode[DrawMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        /**
         * @property TRIANGLE_FAN
         * @type {DrawMode}
         */
        DrawMode[DrawMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(DrawMode || (DrawMode = {}));
    return DrawMode;
});

define('davinci-eight/core/UniformLocation',["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    /**
     * Utility class for managing a shader uniform variable.
     * @class UniformLocation
     */
    var UniformLocation = (function () {
        /**
         * @class UniformLocation
         * @constructor
         * @param manager {IContextProvider} Unused. May be used later e.g. for mirroring.
         * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
         */
        function UniformLocation(manager, name) {
            expectArg('manager', manager).toBeObject().value;
            this._name = expectArg('name', name).toBeString().value;
        }
        /**
         * @method contextFree
         */
        UniformLocation.prototype.contextFree = function () {
            this.contextLost();
        };
        /**
         * @method contextGain
         * @param context {WebGLRenderingContext}
         * @param program {WebGLProgram}
         */
        UniformLocation.prototype.contextGain = function (context, program) {
            this.contextLost();
            this._context = context;
            // FIXME: Uniform locations are created for a specific program,
            // which means that locations cannot be shared.
            this._location = context.getUniformLocation(program, this._name);
            this._program = program;
        };
        /**
         * @method contextLost
         */
        UniformLocation.prototype.contextLost = function () {
            this._context = void 0;
            this._location = void 0;
            this._program = void 0;
        };
        /**
         * @method cartesian1
         * @param coords {VectorE1}
         */
        UniformLocation.prototype.cartesian1 = function (coords) {
            this._context.useProgram(this._program);
            this._context.uniform1f(this._location, coords.x);
        };
        /**
         * @method cartesian2
         * @param coords {VectorE2}
         */
        UniformLocation.prototype.cartesian2 = function (coords) {
            this._context.useProgram(this._program);
            this._context.uniform2f(this._location, coords.x, coords.y);
        };
        /**
         * @method cartesian3
         * @param coords {VectorE3}
         */
        UniformLocation.prototype.cartesian3 = function (coords) {
            if (coords) {
                this._context.useProgram(this._program);
                this._context.uniform3f(this._location, coords.x, coords.y, coords.z);
            }
        };
        /**
         * @method cartesian4
         * @param coords {VectorE4}
         */
        UniformLocation.prototype.cartesian4 = function (coords) {
            this._context.useProgram(this._program);
            this._context.uniform4f(this._location, coords.x, coords.y, coords.z, coords.w);
        };
        /**
         * @method uniform1f
         * @param x {number}
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
         * @param matrix {R1}
         */
        UniformLocation.prototype.matrix1 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniform1fv(this._location, matrix.coords);
        };
        /**
         * @method matrix2
         * @param transpose {boolean}
         * @param matrix {Matrix2}
         */
        UniformLocation.prototype.matrix2 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniformMatrix2fv(this._location, transpose, matrix.elements);
        };
        /**
         * @method matrix3
         * @param transpose {boolean}
         * @param matrix {Matrix3}
         */
        UniformLocation.prototype.matrix3 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniformMatrix3fv(this._location, transpose, matrix.elements);
        };
        /**
         * @method matrix4
         * @param transpose {boolean}
         * @param matrix {Matrix4}
         */
        UniformLocation.prototype.matrix4 = function (transpose, matrix) {
            if (matrix) {
                this._context.useProgram(this._program);
                this._context.uniformMatrix4fv(this._location, transpose, matrix.elements);
            }
        };
        /**
         * @method vector2
         * @param data {number[]}
         */
        UniformLocation.prototype.vector2 = function (data) {
            this._context.useProgram(this._program);
            this._context.uniform2fv(this._location, data);
        };
        /**
         * @method vector3
         * @param data {number[]}
         */
        UniformLocation.prototype.vector3 = function (data) {
            this._context.useProgram(this._program);
            this._context.uniform3fv(this._location, data);
        };
        /**
         * @method vector4
         * @param data {number[]}
         */
        UniformLocation.prototype.vector4 = function (data) {
            this._context.useProgram(this._program);
            this._context.uniform4fv(this._location, data);
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
            var low = 0;
            var high = il - 1;
            var comparison;
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
            if (t1 < 0)
                t1 = 0;
            if (t2 > 1)
                t2 = 1;
            var pt1 = this.getPoint(t1);
            var pt2 = this.getPoint(t2);
            var tangent = pt2.sub(pt1);
            return tangent.direction();
        };
        Curve.prototype.getTangentAt = function (u) {
            var t = this.getUtoTmapping(u);
            return this.getTangent(t);
        };
        return Curve;
    })();
    return Curve;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/devices/Keyboard',["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    function makeKeyDownHandler(keyboard, handler) {
        return function (event) {
            keyboard.currentlyPressedKeys[event.keyCode] = true;
            handler.keyDown(event);
        };
    }
    function makeKeyUpHandler(keyboard, handler) {
        return function (event) {
            keyboard.currentlyPressedKeys[event.keyCode] = false;
            handler.keyUp(event);
        };
    }
    var Keyboard = (function (_super) {
        __extends(Keyboard, _super);
        function Keyboard(handler, document) {
            if (document === void 0) { document = window.document; }
            _super.call(this, 'Keyboard');
            this.currentlyPressedKeys = [];
            this.attach(handler, document);
        }
        Keyboard.prototype.destructor = function () {
            this.detach();
            _super.prototype.destructor.call(this);
        };
        Keyboard.prototype.attach = function (handler, document, useCapture) {
            if (document === void 0) { document = window.document; }
            if (this.document !== document) {
                this.detach();
                this.handler = handler;
                this.handler.addRef();
                this.document = document;
                this.useCapture = useCapture;
                this.keyDownHandler = makeKeyDownHandler(this, handler);
                this.keyUpHandler = makeKeyUpHandler(this, handler);
                this.document.addEventListener('keydown', this.keyDownHandler, useCapture);
                this.document.addEventListener('keyup', this.keyUpHandler, useCapture);
            }
        };
        Keyboard.prototype.detach = function () {
            if (this.document) {
                this.document.removeEventListener('keydown', this.keyDownHandler, this.useCapture);
                this.document.removeEventListener('keyup', this.keyUpHandler, this.useCapture);
                this.handler.release();
                this.handler = void 0;
                this.document = void 0;
                this.useCapture = void 0;
                this.keyDownHandler = void 0;
                this.keyUpHandler = void 0;
            }
        };
        return Keyboard;
    })(Shareable);
    return Keyboard;
});

define('davinci-eight/geometries/DrawAttribute',["require", "exports"], function (require, exports) {
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
    function checkSize(chunkSize, values) {
        if (typeof chunkSize === 'number') {
            if (!isExactMultipleOf(values.length, chunkSize)) {
                throw new Error("values.length must be an exact multiple of chunkSize");
            }
        }
        else {
            throw new Error("chunkSize must be a number");
        }
        return chunkSize;
    }
    /**
     * @class DrawAttribute
     */
    var DrawAttribute = (function () {
        /**
         * @class DrawAttribute
         * @constructor
         * @param values {number[]}
         * @param chunkSize {number}
         */
        function DrawAttribute(values, chunkSize) {
            // mustBeArray('values', values)
            // mustBeInteger('chunkSize', chunkSize)
            this.values = checkValues(values);
            this.chunkSize = checkSize(chunkSize, values);
        }
        return DrawAttribute;
    })();
    return DrawAttribute;
});

define('davinci-eight/geometries/DrawPrimitive',["require", "exports", '../checks/mustBeInteger'], function (require, exports, mustBeInteger) {
    /**
     * @class DrawPrimitive
     */
    var DrawPrimitive = (function () {
        /**
         * @class DrawPrimitive
         * @constructor
         * @param mode {DrawMode} <p>The geometric primitive type.</p>
         * @param indices {number[]} <p>A list of index into the attributes</p>
         * @param attributes {{[name:string]: DrawAttribute}}
         */
        function DrawPrimitive(mode, indices, attributes) {
            // TODO: Looks like a DrawAttributeMap here (implementation only)
            /**
             * @property attributes
             * @type {{[name:string]: DrawAttribute}}
             */
            this.attributes = {};
            mustBeInteger('mode', mode);
            this.mode = mode;
            this.indices = indices;
            this.attributes = attributes;
        }
        return DrawPrimitive;
    })();
    return DrawPrimitive;
});

define('davinci-eight/geometries/Vertex',["require", "exports"], function (require, exports) {
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
            this.attributes = {};
        }
        Vertex.prototype.toString = function () {
            return stringifyVertex(this);
        };
        return Vertex;
    })();
    return Vertex;
});

define('davinci-eight/geometries/Simplex',["require", "exports", '../checks/expectArg', '../checks/isInteger', '../geometries/Vertex', '../math/VectorN'], function (require, exports, expectArg, isInteger, Vertex, VectorN) {
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
        return new VectorN(lerp(a.coords, b.coords, alpha));
    }
    /**
     * @class Simplex
     */
    var Simplex = (function () {
        /**
         * A simplex is the generalization of a point, line, triangle or tetrahedron to arbitrary dimensions.
         * A k-simplex is the convex hull of its k + 1 vertices.
         * @class Simplex
         * @constructor
         * @param k {number} The initial number of vertices in the simplex is k + 1.
         */
        function Simplex(k) {
            /**
             * The vertices of the simplex.
             * @property
             * @type {Vertex[]}
             */
            this.vertices = [];
            if (!isInteger(k)) {
                expectArg('k', k).toBeNumber();
            }
            var numVertices = k + 1;
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex());
            }
        }
        Object.defineProperty(Simplex.prototype, "k", {
            /**
             * The dimensionality of the simplex.
             * @property k
             * @type {number}
             * @readonly
             */
            get: function () {
                return this.vertices.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         */
        // FIXME: We don't need the index property on the vertex (needs some work).
        Simplex.indices = function (simplex) {
            return simplex.vertices.map(function (vertex) { return vertex.index; });
        };
        /**
         * Computes the boundary of the simplex.
         * @method boundaryMap
         * @param simplex {Simplex}
         * @return {Simplex[]}
         * @private
         */
        Simplex.boundaryMap = function (simplex) {
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.TRIANGLE) {
                var line01 = new Simplex(k - 1);
                line01.vertices[0].attributes = simplex.vertices[0].attributes;
                line01.vertices[1].attributes = simplex.vertices[1].attributes;
                var line12 = new Simplex(k - 1);
                line12.vertices[0].attributes = simplex.vertices[1].attributes;
                line12.vertices[1].attributes = simplex.vertices[2].attributes;
                var line20 = new Simplex(k - 1);
                line20.vertices[0].attributes = simplex.vertices[2].attributes;
                line20.vertices[1].attributes = simplex.vertices[0].attributes;
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
                // For consistency, we get one empty simplex rather than an empty list.
                return [new Simplex(k - 1)];
            }
            else if (k === Simplex.EMPTY) {
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
        /**
         * Computes the result of the boundary operation performed `count` times.
         * @method boundary
         * @param simplices {Simplex[]}
         * @param count {number}
         * @return {Simplex[]}
         */
        Simplex.boundary = function (simplices, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                simplices = simplices.map(Simplex.boundaryMap).reduce(concatReduce, []);
            }
            return simplices;
        };
        /**
         * Computes the result of the subdivide operation performed `count` times.
         * @method subdivide
         * @param simplices {Simplex[]}
         * @param count {number}
         * @return {Simplex[]}
         */
        Simplex.subdivide = function (simplices, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                simplices = simplices.map(Simplex.subdivideMap).reduce(concatReduce, []);
            }
            return simplices;
        };
        // TODO: This function destined to be part of Simplex constructor.
        // FIXME still used from triangle.ts!
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
         * @property EMPTY
         * @type {number}
         * @static
         */
        Simplex.EMPTY = -1;
        /**
         * A single point may be considered a 0-simplex.
         * @property POINT
         * @type {number}
         * @static
         */
        Simplex.POINT = 0;
        /**
         * A line segment may be considered a 1-simplex.
         * @property LINE
         * @type {number}
         * @static
         */
        Simplex.LINE = 1;
        /**
         * A 2-simplex is a triangle.
         * @property TRIANGLE
         * @type {number}
         * @static
         */
        Simplex.TRIANGLE = 2;
        /**
         * A 3-simplex is a tetrahedron.
         * @property TETRAHEDRON
         * @type {number}
         * @static
         */
        Simplex.TETRAHEDRON = 3;
        /**
         * A 4-simplex is a 5-cell.
         * @property FIVE_CELL
         * @type {number}
         * @static
         */
        Simplex.FIVE_CELL = 4;
        return Simplex;
    })();
    return Simplex;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/G3',["require", "exports", '../math/dotVectorE3', '../math/Euclidean3', '../math/extG3', '../math/lcoG3', '../math/mulG3', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../math/quadSpinorE3', '../math/quadVectorE3', '../math/rcoG3', '../i18n/readOnly', '../math/rotorFromDirections', '../math/scpG3', '../math/squaredNormG3', '../math/stringFromCoordinates', '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, dotVector, Euclidean3, extG3, lcoG3, mulG3, mustBeInteger, mustBeNumber, mustBeObject, mustBeString, quadSpinor, quadVector, rcoG3, readOnly, rotorFromDirections, scpG3, squaredNormG3, stringFromCoordinates, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    // Symbolic constants for the coordinate indices into the data array.
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var cos = Math.cos;
    var log = Math.log;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
    /**
     * Coordinates corresponding to basis labels.
     */
    function coordinates(m) {
        return [m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β];
    }
    function makeConstantE3(label, α, x, y, z, yz, zx, xy, β) {
        mustBeString('label', label);
        mustBeNumber('α', α);
        mustBeNumber('x', x);
        mustBeNumber('y', y);
        mustBeNumber('z', z);
        mustBeNumber('yz', yz);
        mustBeNumber('zx', zx);
        mustBeNumber('xy', xy);
        mustBeNumber('β', β);
        var that;
        that = {
            get α() {
                return α;
            },
            set α(unused) {
                throw new Error(readOnly(label + '.α').message);
            },
            get x() {
                return x;
            },
            set x(unused) {
                throw new Error(readOnly(label + '.x').message);
            },
            get y() {
                return y;
            },
            set y(unused) {
                throw new Error(readOnly(label + '.y').message);
            },
            get z() {
                return z;
            },
            set z(unused) {
                throw new Error(readOnly(label + '.x').message);
            },
            get yz() {
                return yz;
            },
            set yz(unused) {
                throw new Error(readOnly(label + '.yz').message);
            },
            get zx() {
                return zx;
            },
            set zx(unused) {
                throw new Error(readOnly(label + '.zx').message);
            },
            get xy() {
                return xy;
            },
            set xy(unused) {
                throw new Error(readOnly(label + '.xy').message);
            },
            get β() {
                return β;
            },
            set β(unused) {
                throw new Error(readOnly(label + '.β').message);
            },
            magnitude: function () {
                // FIXME: should be the full multivector.
                return sqrt(quadSpinor(that));
            },
            squaredNorm: function () {
                // FIXME: should be the full multivector.
                return quadSpinor(that);
            },
            toString: function () {
                return label;
            }
        };
        return that;
    }
    var zero = makeConstantE3('0', 0, 0, 0, 0, 0, 0, 0, 0);
    var one = makeConstantE3('1', 1, 0, 0, 0, 0, 0, 0, 0);
    var e1 = makeConstantE3('e1', 0, 1, 0, 0, 0, 0, 0, 0);
    var e2 = makeConstantE3('e2', 0, 0, 1, 0, 0, 0, 0, 0);
    var e3 = makeConstantE3('e2', 0, 0, 0, 1, 0, 0, 0, 0);
    var I = makeConstantE3('I', 0, 0, 0, 0, 0, 0, 0, 1);
    /**
     * @class G3
     * @extends GeometricE3
     * @beta
     */
    var G3 = (function (_super) {
        __extends(G3, _super);
        /**
         * Constructs a <code>G3</code>.
         * The multivector is initialized to zero.
         * @class G3
         * @beta
         * @constructor
         */
        function G3() {
            _super.call(this, [0, 0, 0, 0, 0, 0, 0, 0], false, 8);
        }
        Object.defineProperty(G3.prototype, "α", {
            /**
             * The scalar part of this multivector.
             * @property α
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_W];
            },
            set: function (α) {
                mustBeNumber('α', α);
                this.modified = this.modified || this.coords[COORD_W] !== α;
                this.coords[COORD_W] = α;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "x", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
             * @property x
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_X];
            },
            set: function (x) {
                mustBeNumber('x', x);
                this.modified = this.modified || this.coords[COORD_X] !== x;
                this.coords[COORD_X] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "y", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
             * @property y
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_Y];
            },
            set: function (y) {
                mustBeNumber('y', y);
                this.modified = this.modified || this.coords[COORD_Y] !== y;
                this.coords[COORD_Y] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "z", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
             * @property z
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_Z];
            },
            set: function (z) {
                mustBeNumber('z', z);
                this.modified = this.modified || this.coords[COORD_Z] !== z;
                this.coords[COORD_Z] = z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "yz", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
             * @property yz
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_YZ];
            },
            set: function (yz) {
                mustBeNumber('yz', yz);
                this.modified = this.modified || this.coords[COORD_YZ] !== yz;
                this.coords[COORD_YZ] = yz;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "zx", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
             * @property zx
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_ZX];
            },
            set: function (zx) {
                mustBeNumber('zx', zx);
                this.modified = this.modified || this.coords[COORD_ZX] !== zx;
                this.coords[COORD_ZX] = zx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "xy", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
             * @property xy
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                mustBeNumber('xy', xy);
                this.modified = this.modified || this.coords[COORD_XY] !== xy;
                this.coords[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "β", {
            /**
             * The pseudoscalar part of this multivector.
             * @property β
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_XYZ];
            },
            set: function (β) {
                mustBeNumber('β', β);
                this.modified = this.modified || this.coords[COORD_XYZ] !== β;
                this.coords[COORD_XYZ] = β;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @method add
         * @param M {GeometricE3}
         * @param [α = 1] {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('M', M);
            mustBeNumber('α', α);
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
        /**
         * <p>
         * <code>this ⟼ this + Iβ</code>
         * </p>
         * @method addPseudo
         * @param β {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.addPseudo = function (β) {
            mustBeNumber('β', β);
            this.β += β;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α</code>
         * </p>
         * @method addScalar
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.addScalar = function (α) {
            mustBeNumber('α', α);
            this.α += α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @method addVector
         * @param v {VectorE3}
         * @param [α = 1] {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('v', v);
            mustBeNumber('α', α);
            this.x += v.x * α;
            this.y += v.y * α;
            this.z += v.z * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.add2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
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
        G3.prototype.adj = function () {
            throw new Error('TODO: G3.adj');
        };
        /**
         * @method angle
         * @return {G3}
         */
        G3.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * @method clone
         * @return {G3} <code>copy(this)</code>
         * @chainable
         */
        G3.prototype.clone = function () {
            return G3.copy(this);
        };
        /**
         * <p>
         * <code>this ⟼ conjugate(this)</code>
         * </p>
         * @method conj
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.conj = function () {
            // FIXME: This is only the bivector part.
            // Also need to think about various involutions.
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @method lco
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.lco = function (m) {
            return this.lco2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @method lco2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.lco2 = function (a, b) {
            return lcoG3(a, b, this);
        };
        /**
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @method rco
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rco = function (m) {
            return this.rco2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @method rco2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rco2 = function (a, b) {
            return rcoG3(a, b, this);
        };
        /**
         * <p>
         * <code>this ⟼ copy(v)</code>
         * </p>
         * @method copy
         * @param M {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.copy = function (M) {
            mustBeObject('M', M);
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
        /**
         * Sets this multivector to the value of the scalar, <code>α</code>.
         * @method copyScalar
         * @return {G3}
         * @chainable
         */
        G3.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copySpinor
         * @param spinor {SpinorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.copySpinor = function (spinor) {
            mustBeObject('spinor', spinor);
            this.zero();
            this.α = spinor.α;
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            this.xy = spinor.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         * @method copyVector
         * @param vector {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.copyVector = function (vector) {
            mustBeObject('vector', vector);
            this.zero();
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         * @method div
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.div = function (m) {
            return this.div2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.divByScalar = function (α) {
            mustBeNumber('α', α);
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
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.div2 = function (a, b) {
            // FIXME: Generalize
            var a0 = a.α;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.α;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // It would be interesting to DRY this out.
            this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.α = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * @method dual
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.dual = function (m) {
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
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.exp = function () {
            // It's always the case that the scalar commutes with every other
            // grade of the multivector, so we can pull it out the front.
            var expW = exp(this.α);
            // In G3 we have the special case that the pseudoscalar also commutes.
            // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
            var cosβ = cos(this.β);
            var sinβ = sin(this.β);
            // We are left with the vector and bivector components.
            // For a bivector (usual case), let B = I * φ, where φ is a vector.
            // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = sqrt(yz * yz + zx * zx + xy * xy);
            var s = φ !== 0 ? sin(φ) / φ : 1;
            var cosφ = cos(φ);
            // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
            // The mixture of vector and bivector parts is more complex!
            this.α = cosφ;
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this.scale(expW);
        };
        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         * @method inv
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.inv = function () {
            // FIXME: TODO
            this.conj();
            // this.divByScalar(this.squaredNorm());
            return this;
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        G3.prototype.isOne = function () {
            return this.α === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        G3.prototype.isZero = function () {
            return this.α === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {GeometricE3}
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.lerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
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
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.lerp2 = function (a, b, α) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            mustBeNumber('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.log = function () {
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
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        G3.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.mul = function (m) {
            return this.mul2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.mul2 = function (a, b) {
            return mulG3(a, b, this);
        };
        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         * @method neg
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.neg = function () {
            this.α = -this.α;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.β = -this.β;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {G3} <code>this</code>
        * @chainable
        */
        G3.prototype.norm = function () {
            // FIXME: TODO
            this.α = this.magnitude();
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method direction
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.direction = function () {
            // The squaredNorm is the squared norm.
            var norm = this.magnitude();
            this.α = this.α / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.z = this.z / norm;
            this.yz = this.yz / norm;
            this.zx = this.zx / norm;
            this.xy = this.xy / norm;
            this.β = this.β / norm;
            return this;
        };
        /**
         * Sets this multivector to the identity element for multiplication, <b>1</b>.
         * @method one
         * @return {G3}
         * @chainable
         */
        G3.prototype.one = function () {
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
        /**
        * <p>
        * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
        * </p>
        * @method quad
        * @return {G3} <code>this</code>
        * @chainable
        */
        G3.prototype.quad = function () {
            // FIXME: TODO
            this.α = this.squaredNorm();
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        /**
         * Computes the <em>squared norm</em> of this multivector.
         * @method squaredNorm
         * @return {number} <code>this * conj(this)</code>
         */
        G3.prototype.squaredNorm = function () {
            return squaredNormG3(this);
        };
        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @method reflect
         * @param n {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.reflect = function (n) {
            // TODO: Optimize.
            mustBeObject('n', n);
            var N = Euclidean3.fromVectorE3(n);
            var M = Euclidean3.copy(this);
            var R = N.mul(M).mul(N).scale(-1);
            this.copy(R);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         * @method reverse
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rev = function () {
            // reverse has a ++-- structure on the grades.
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
        /**
         * @method __tilde__
         * @return {G3}
         */
        G3.prototype.__tilde__ = function () {
            return G3.copy(this).rev();
        };
        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @method rotate
         * @param R {SpinorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rotate = function (R) {
            mustBeObject('R', R);
            // FIXME: This only rotates the vector components.
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
        /**
         * <p>
         * Computes a rotor, R, from two unit vectors, where
         * R = (1 + b * a) / sqrt(2 * (1 + b << a))
         * </p>
         * @method rotorFromDirections
         * @param b {VectorE3} The ending unit vector
         * @param a {VectorE3} The starting unit vector
         * @return {G3} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        G3.prototype.rotorFromDirections = function (b, a) {
            return rotorFromDirections(a, b, quadVector, dotVector, this);
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
         * </p>
         * @method rotorFromAxisAngle
         * @param axis {VectorE3}
         * @param θ {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rotorFromAxisAngle = function (axis, θ) {
            // FIXME: TODO
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -axis.x * s;
            this.zx = -axis.y * s;
            this.xy = -axis.z * s;
            this.α = cos(φ);
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @method rotorFromGeneratorAngle
         * @param B {SpinorE3}
         * @param θ {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            // FIXME: TODO
            var φ = θ / 2;
            var s = sin(φ);
            this.yz = -B.yz * s;
            this.zx = -B.zx * s;
            this.xy = -B.xy * s;
            this.α = cos(φ);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @method align
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @method scp2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.scp2 = function (a, b) {
            return scpG3(a, b, this);
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         */
        G3.prototype.scale = function (α) {
            mustBeNumber('α', α);
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
        G3.prototype.slerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            // TODO
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this G3 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {G3} <code>this</code>
         */
        G3.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.zero();
            this.α = dotVector(a, b);
            this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY(ax, ay, az, bx, by, bz);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @method sub
         * @param M {GeometricE3}
         * @param [α = 1] {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('M', M);
            mustBeNumber('α', α);
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
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.sub2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
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
        /**
         * Returns a string representing the number in exponential notation.
         * @method toExponential
         * @return {string}
         */
        G3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
        };
        /**
         * Returns a string representing the number in fixed-point notation.
         * @method toFixed
         * @param [fractionDigits] {number}
         * @return {string}
         */
        G3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
        };
        /**
         * Returns a string representation of the number.
         * @method toString
         * @return {string}
         */
        G3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
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
        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @method wedge
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @method ext2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        G3.prototype.ext2 = function (a, b) {
            return extG3(a, b, this);
        };
        /**
         * Sets this multivector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {G3}
         * @chainable
         */
        G3.prototype.zero = function () {
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
        /**
         * @method __add__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__add__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).add(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).add(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __div__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__div__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).div(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).divByScalar(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rdiv__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).div(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).div(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __mul__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rmul__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).mul(this);
            }
            else if (typeof lhs === 'number') {
                // Scalar multiplication commutes.
                return G3.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __radd__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).add(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __sub__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.fromScalar(rhs).neg().add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rsub__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).sub(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).sub(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __wedge__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).ext(rhs);
            }
            else if (typeof rhs === 'number') {
                // The outer product with a scalar is scalar multiplication.
                return G3.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rwedge__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).ext(this);
            }
            else if (typeof lhs === 'number') {
                // The outer product with a scalar is scalar multiplication, and commutes.
                return G3.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __lshift__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).lco(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rlshift__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).lco(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).lco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rshift__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).rco(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rrshift__
         * @param other {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).rco(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).rco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __vbar__
         * @param rhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G3) {
                return G3.copy(this).scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return G3.copy(this).scp(G3.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rvbar__
         * @param lhs {any}
         * @return {G3}
         * @private
         */
        G3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G3) {
                return G3.copy(lhs).scp(this);
            }
            else if (typeof lhs === 'number') {
                return G3.fromScalar(lhs).scp(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __bang__
         * @return {G3}
         * @private
         * @chainable
         */
        G3.prototype.__bang__ = function () {
            return G3.copy(this).inv();
        };
        /**
         * @method __pos__
         * @return {G3}
         * @private
         * @chainable
         */
        G3.prototype.__pos__ = function () {
            return G3.copy(this); /*.pos()*/
        };
        /**
         * @method __neg__
         * @return {G3}
         * @private
         * @chainable
         */
        G3.prototype.__neg__ = function () {
            return G3.copy(this).neg();
        };
        Object.defineProperty(G3, "zero", {
            /**
             * The identity element for addition, <b>0</b>.
             * @property zero
             * @type {G3}
             * @readOnly
             * @static
             */
            get: function () { return G3.copy(zero); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "one", {
            /**
             * The identity element for multiplication, <b>1</b>.
             * @property one
             * @type {G3}
             * @readOnly
             * @static
             */
            get: function () { return G3.copy(one); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "e1", {
            /**
             * Basis vector corresponding to the <code>x</code> coordinate.
             * @property e1
             * @type {G3}
             * @readOnly
             * @static
             */
            get: function () { return G3.copy(e1); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "e2", {
            /**
             * Basis vector corresponding to the <code>y</code> coordinate.
             * @property e2
             * @type {G3}
             * @readOnly
             * @static
             */
            get: function () { return G3.copy(e2); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "e3", {
            /**
             * Basis vector corresponding to the <code>y</code> coordinate.
             * @property e3
             * @type {G3}
             * @readOnly
             * @static
             */
            get: function () { return G3.copy(e3); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "I", {
            /**
             * Basis vector corresponding to the <code>β</code> coordinate.
             * @property I
             * @type {G3}
             * @readOnly
             * @static
             */
            get: function () { return G3.copy(I); },
            enumerable: true,
            configurable: true
        });
        ;
        /**
         * @method copy
         * @param M {GeometricE3}
         * @return {G3}
         * @static
         */
        G3.copy = function (M) {
            var copy = new G3();
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
        /**
         * @method fromScalar
         * @param α {number}
         * @return {G3}
         * @static
         * @chainable
         */
        G3.fromScalar = function (α) {
            return new G3().copyScalar(α);
        };
        /**
         * @method fromSpinor
         * @param spinor {SpinorE3}
         * @return {G3}
         * @static
         * @chainable
         */
        G3.fromSpinor = function (spinor) {
            var copy = new G3();
            copy.α = spinor.α;
            copy.yz = spinor.yz;
            copy.zx = spinor.yz;
            copy.xy = spinor.xy;
            return copy;
        };
        /**
         * @method fromVector
         * @param vector {VectorE3}
         * @return {G3}
         * @static
         * @chainable
         */
        G3.fromVector = function (vector) {
            var copy = new G3();
            copy.x = vector.x;
            copy.y = vector.y;
            copy.z = vector.z;
            return copy;
        };
        /**
        * @method lerp
        * @param A {GeometricE3}
        * @param B {GeometricE3}
        * @param α {number}
        * @return {G3} <code>A + α * (B - A)</code>
        * @static
        * @chainable
        */
        G3.lerp = function (A, B, α) {
            return G3.copy(A).lerp(B, α);
        };
        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE3} The <em>from</em> vector.
         * @param b {VectorE3} The <em>to</em> vector.
         * @return {G3}
         * @static
         */
        G3.rotorFromDirections = function (a, b) {
            return new G3().rotorFromDirections(a, b);
        };
        return G3;
    })(VectorN);
    return G3;
});

define('davinci-eight/geometries/dataLength',["require", "exports", '../math/G3', '../math/R2', '../math/R3'], function (require, exports, G3, R2, R3) {
    /**
     * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
     * geometric numbers fo vertex attributes, but allows us to extract the vector (grade-1) part?
     */
    function dataLength(source) {
        if (source instanceof G3) {
            return 3;
        }
        else if (source instanceof R3) {
            if (source.length !== 3) {
                throw new Error("source.length is expected to be 3");
            }
            return 3;
        }
        else if (source instanceof R2) {
            if (source.length !== 2) {
                throw new Error("source.length is expected to be 2");
            }
            return 2;
        }
        else {
            // console.warn("dataLength(source: VectorN<number>): number[], source.length => " + source.length)
            return source.length;
        }
    }
    return dataLength;
});

define('davinci-eight/geometries/simplicesToGeometryMeta',["require", "exports", '../geometries/dataLength', '../checks/expectArg', '../checks/isDefined', '../geometries/Simplex'], function (require, exports, dataLength, expectArg, isDefined, Simplex) {
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
    function simplicesToGeometryMeta(geometry) {
        var kValueOfSimplex = void 0;
        var knowns = {};
        var geometryLen = geometry.length;
        for (var i = 0; i < geometryLen; i++) {
            var simplex = geometry[i];
            if (!(simplex instanceof Simplex)) {
                expectArg('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
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
                    var value = attributes[key];
                    var dLength = dataLength(value);
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
    return simplicesToGeometryMeta;
});

define('davinci-eight/geometries/computeFaceNormals',["require", "exports", '../core/Symbolic', '../math/R3', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, Symbolic, R3, wedgeXY, wedgeYZ, wedgeZX) {
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
        var normal = new R3([x, y, z]).direction();
        vertex0[normalName] = normal;
        vertex1[normalName] = normal;
        vertex2[normalName] = normal;
    }
    return computeFaceNormals;
});

define('davinci-eight/geometries/triangle',["require", "exports", '../geometries/computeFaceNormals', '../checks/expectArg', '../geometries/Simplex', '../core/Symbolic', '../math/VectorN'], function (require, exports, computeFaceNormals, expectArg, Simplex, Symbolic, VectorN) {
    function triangle(a, b, c, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', b).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', c).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        var simplex = new Simplex(Simplex.TRIANGLE);
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = a;
        // simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.e1
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = b;
        // simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.e2
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = c;
        // simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.e3
        computeFaceNormals(simplex, Symbolic.ATTRIBUTE_POSITION, Symbolic.ATTRIBUTE_NORMAL);
        Simplex.setAttributeValues(attributes, simplex);
        triangles.push(simplex);
        return triangles;
    }
    return triangle;
});

define('davinci-eight/geometries/quadrilateral',["require", "exports", '../checks/expectArg', '../geometries/triangle', '../math/VectorN'], function (require, exports, expectArg, triangle, VectorN) {
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
        setAttributes([3, 0, 2], attributes, triatts);
        triangle(d, a, c, triatts, triangles);
        return triangles;
    }
    return quadrilateral;
});

define('davinci-eight/geometries/cube',["require", "exports", '../geometries/quadrilateral', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, quadrilateral, Symbolic, R2, R3) {
    function vector3(data) {
        return new R3([]);
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
        var vec0 = new R3([+s, +s, +s]);
        var vec1 = new R3([-s, +s, +s]);
        var vec2 = new R3([-s, -s, +s]);
        var vec3 = new R3([+s, -s, +s]);
        var vec4 = new R3([+s, -s, -s]);
        var vec5 = new R3([+s, +s, -s]);
        var vec6 = new R3([-s, +s, -s]);
        var vec7 = new R3([-s, -s, -s]);
        var c00 = new R2([0, 0]);
        var c01 = new R2([0, 1]);
        var c10 = new R2([1, 0]);
        var c11 = new R2([1, 1]);
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

define('davinci-eight/geometries/square',["require", "exports", '../geometries/quadrilateral', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, quadrilateral, Symbolic, R2, R3) {
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
        var vec0 = new R3([+s, +s, 0]);
        var vec1 = new R3([-s, +s, 0]);
        var vec2 = new R3([-s, -s, 0]);
        var vec3 = new R3([+s, -s, 0]);
        var c00 = new R2([0, 0]);
        var c01 = new R2([0, 1]);
        var c10 = new R2([1, 0]);
        var c11 = new R2([1, 1]);
        var coords = [c11, c01, c00, c10];
        var attributes = {};
        attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = coords;
        return quadrilateral(vec0, vec1, vec2, vec3, attributes);
    }
    return square;
});

define('davinci-eight/geometries/tetrahedron',["require", "exports", '../checks/expectArg', '../geometries/triangle', '../math/VectorN'], function (require, exports, expectArg, triangle, VectorN) {
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
        return triangles;
    }
    return tetrahedron;
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
    return copyToArray;
});

define('davinci-eight/geometries/dataFromVectorN',["require", "exports", '../math/G3', '../math/R2', '../math/R3'], function (require, exports, G3, R2, R3) {
    /**
     * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
     * geometric numbers fo vertex attributes, but allows us to extract the vector (grade-1) part?
     */
    function dataFromVectorN(source) {
        if (source instanceof G3) {
            var g3 = source;
            return [g3.x, g3.y, g3.z];
        }
        else if (source instanceof R3) {
            var v3 = source;
            return [v3.x, v3.y, v3.z];
        }
        else if (source instanceof R2) {
            var v2 = source;
            return [v2.x, v2.y];
        }
        else {
            // console.warn("dataFromVectorN(source: VectorN<number>): number[], source.length => " + source.length)
            return source.coords;
        }
    }
    return dataFromVectorN;
});

define('davinci-eight/geometries/computeUniqueVertices',["require", "exports"], function (require, exports) {
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

define('davinci-eight/geometries/simplicesToDrawPrimitive',["require", "exports", '../collections/copyToArray', '../geometries/dataFromVectorN', '../core/DrawMode', '../geometries/simplicesToGeometryMeta', '../geometries/computeUniqueVertices', '../geometries/DrawPrimitive', '../geometries/DrawAttribute', '../checks/expectArg', '../geometries/Simplex', '../math/VectorN'], function (require, exports, copyToArray, dataFromVectorN, DrawMode, simplicesToGeometryMeta, computeUniqueVertices, DrawPrimitive, DrawAttribute, expectArg, Simplex, VectorN) {
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
    function simplicesToDrawPrimitive(simplices, geometryMeta) {
        expectArg('simplices', simplices).toBeObject();
        var actuals = simplicesToGeometryMeta(simplices);
        if (geometryMeta) {
            expectArg('geometryMeta', geometryMeta).toBeObject();
        }
        else {
            geometryMeta = actuals;
        }
        var attribMap = geometryMeta.attributes;
        // Cache the keys and keys.length of the specified attributes and declare a loop index.
        var keys = Object.keys(attribMap);
        var keysLen = keys.length;
        var k;
        // Side effect is to set the index property, but it will be be the same as the array index. 
        var vertices = computeUniqueVertices(simplices);
        var vsLength = vertices.length;
        var i;
        // Each simplex produces as many indices as vertices.
        // This is why we need the Vertex to have an temporary index property.
        var indices = simplices.map(Simplex.indices).reduce(concat, []);
        // Create intermediate data structures for output and to cache dimensions and name.
        // For performance an array will be used whose index is the key index.
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
                var value = vertexAttribs[keys[k]];
                if (!value) {
                    value = new VectorN(numberList(size, 0), false, size);
                }
                // TODO: Merge functions to avoid creating temporary array.
                var data = dataFromVectorN(value);
                copyToArray(data, output.data, i * output.dimensions);
            }
        }
        // Copy accumulated attribute arrays to output data structure.
        var attributes = {};
        for (k = 0; k < keysLen; k++) {
            var output = outputs[k];
            var data = output.data;
            attributes[output.name] = new DrawAttribute(data, output.dimensions);
        }
        switch (geometryMeta.k) {
            case Simplex.TRIANGLE: {
                return new DrawPrimitive(DrawMode.TRIANGLES, indices, attributes);
            }
            case Simplex.LINE: {
                return new DrawPrimitive(DrawMode.LINES, indices, attributes);
            }
            case Simplex.POINT: {
                return new DrawPrimitive(DrawMode.POINTS, indices, attributes);
            }
            case Simplex.EMPTY: {
                // It should be possible to no-op render an EMPTY simplex.
                return new DrawPrimitive(DrawMode.POINTS, indices, attributes);
            }
            default: {
                throw new Error("k => " + geometryMeta.k);
            }
        }
    }
    return simplicesToDrawPrimitive;
});

define('davinci-eight/topologies/Topology',["require", "exports", '../geometries/DrawAttribute', '../geometries/DrawPrimitive', '../checks/mustBeInteger', '../geometries/Vertex', '../geometries/dataFromVectorN'], function (require, exports, DrawAttribute, DrawPrimitive, mustBeInteger, Vertex, dataFromVectorN) {
    function attributes(elements, vertices) {
        var attribs = {};
        for (var vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
            var vertex = vertices[vertexIndex];
            var names = Object.keys(vertex.attributes);
            for (var namesIndex = 0; namesIndex < names.length; namesIndex++) {
                var name = names[namesIndex];
                var data = dataFromVectorN(vertex.attributes[name]);
                var chunkSize = data.length;
                var attrib = attribs[name];
                if (!attrib) {
                    attrib = attribs[name] = new DrawAttribute([], chunkSize);
                }
                for (var coordIndex = 0; coordIndex < chunkSize; coordIndex++) {
                    attrib.values.push(data[coordIndex]);
                }
            }
        }
        return attribs;
    }
    /**
     * @class Topology
     */
    var Topology = (function () {
        /**
         * Abstract base class for all geometric primitive types
         * @class Topology
         * @constructor
         * @param mode {DrawMode}
         * @param numVertices {number}
         */
        function Topology(mode, numVertices) {
            this.mode = mustBeInteger('mode', mode);
            mustBeInteger('numVertices', numVertices);
            this.vertices = [];
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex());
            }
        }
        /**
         * Creates the elements in a format required for WebGL.
         * This may involve creating some redundancy in order to get WebGL efficiency.
         * Thus, we should regard the topology as normalized
         * @method toDrawPrimitive
         * @return {DrawPrimitive}
         */
        Topology.prototype.toDrawPrimitive = function () {
            return new DrawPrimitive(this.mode, this.elements, attributes(this.elements, this.vertices));
        };
        return Topology;
    })();
    return Topology;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/topologies/PointTopology',["require", "exports", '../core/DrawMode', '../topologies/Topology'], function (require, exports, DrawMode, Topology) {
    /**
     * @class PointTopology
     */
    var PointTopology = (function (_super) {
        __extends(PointTopology, _super);
        /**
         * Abstract base class for geometric primitives POINTS.
         * @class PointTopology
         * @constructor
         * @param numVertices {number}
         */
        function PointTopology(numVertices) {
            _super.call(this, DrawMode.POINTS, numVertices);
        }
        return PointTopology;
    })(Topology);
    return PointTopology;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/topologies/LineTopology',["require", "exports", '../topologies/Topology'], function (require, exports, Topology) {
    /**
     * @class LineTopology
     */
    var LineTopology = (function (_super) {
        __extends(LineTopology, _super);
        /**
         * Abstract base class for geometric primitives LINES, LINE_STRIP and LINE_LOOP.
         * @class LineTopology
         * @constructor
         * @param mode {DrawMode}
         * @param numVertices {number}
         */
        function LineTopology(mode, numVertices) {
            _super.call(this, mode, numVertices);
        }
        return LineTopology;
    })(Topology);
    return LineTopology;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/topologies/MeshTopology',["require", "exports", '../topologies/Topology'], function (require, exports, Topology) {
    /**
     * @class MeshTopology
     * @extends Topology
     */
    var MeshTopology = (function (_super) {
        __extends(MeshTopology, _super);
        /**
         * Abstract base class for topologies rendered using TRIANGLES, TRIANGLE_STRIP and TRIANGLE_FAN.
         * @class MeshTopology
         * @constructor
         * @param mode {DrawMode}
         * @param numVertices {number}
         */
        function MeshTopology(mode, numVertices) {
            _super.call(this, mode, numVertices);
        }
        return MeshTopology;
    })(Topology);
    return MeshTopology;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/topologies/GridTopology',["require", "exports", '../core/DrawMode', '../checks/isDefined', '../topologies/MeshTopology', '../checks/mustBeArray', '../checks/mustBeInteger', '../i18n/readOnly'], function (require, exports, DrawMode, isDefined, MeshTopology, mustBeArray, mustBeInteger, readOnly) {
    function numPostsForFence(segmentCount) {
        mustBeInteger('segmentCount', segmentCount);
        return segmentCount + 1;
    }
    function dimensionsForGrid(segmentCounts) {
        mustBeArray('segmentCounts', segmentCounts);
        return segmentCounts.map(numPostsForFence);
    }
    function numVerticesForGrid(uSegments, vSegments) {
        mustBeInteger('uSegments', uSegments);
        mustBeInteger('vSegments', vSegments);
        return dimensionsForGrid([uSegments, vSegments]).reduce(function (a, b) { return a * b; }, 1);
    }
    function triangleStripForGrid(uSegments, vSegments, elements) {
        // Make sure that we have somewhere valid to store the result.
        elements = isDefined(elements) ? mustBeArray('elements', elements) : [];
        var uLength = numPostsForFence(uSegments);
        var lastVertex = uSegments + uLength * vSegments;
        /**
         * The number of elements needed if we executed a strip per row.
         * Remark Notice the asymmetry. Could be a performance impact.
         */
        var eSimple = 2 * uLength * vSegments;
        /**
         * Index for triangle strip array.
         */
        var j = 0;
        // FIXME: Loop 0 <= i < eSimple (Edsger W. Dijksta)
        // For this algorithm, imagine a little vertical loop containing two dots.
        // The uppermost dot we shall call the `top` and the lowermost the `bottom`.
        // Advancing i by two each time corresponds to advancing this loop one place to the right.
        for (var i = 1; i <= eSimple; i += 2) {
            var k = (i - 1) / 2; // etc
            // top element
            elements[j] = (i - 1) / 2;
            // bottom element
            elements[j + 1] = elements[j] + uLength;
            // check for end of column
            if (elements[j + 1] % uLength === uSegments) {
                // Don't add degenerate triangles if we are on either
                // 1. the last vertex of the first row
                // 2. the last vertex of the last row.
                if (elements[j + 1] !== uSegments && elements[j + 1] !== lastVertex) {
                    // additional vertex degenerate triangle
                    // The next point is the same as the one before
                    elements[j + 2] = elements[j + 1];
                    // additional vertex degenerate triangle
                    // 
                    elements[j + 3] = (1 + i) / 2;
                    // Increment j for the two duplicate vertices
                    j += 2;
                }
            }
            // Increment j for this step.
            j += 2;
        }
        return elements;
    }
    /**
     * @class GridTopology
     * @extends MeshTopology
     */
    var GridTopology = (function (_super) {
        __extends(GridTopology, _super);
        function GridTopology(uSegments, vSegments) {
            _super.call(this, DrawMode.TRIANGLE_STRIP, numVerticesForGrid(uSegments, vSegments));
            this.elements = triangleStripForGrid(uSegments, vSegments);
            this._uSegments = uSegments;
            this._vSegments = vSegments;
        }
        Object.defineProperty(GridTopology.prototype, "uSegments", {
            get: function () {
                return this._uSegments;
            },
            set: function (unused) {
                throw new Error(readOnly('uSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "uLength", {
            get: function () {
                return numPostsForFence(this._uSegments);
            },
            set: function (unused) {
                throw new Error(readOnly('uLength').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vSegments", {
            get: function () {
                return this._vSegments;
            },
            set: function (unused) {
                throw new Error(readOnly('vSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vLength", {
            get: function () {
                return numPostsForFence(this._vSegments);
            },
            set: function (unused) {
                throw new Error(readOnly('vLength').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * Provides access to each vertex so that attributes may be set.
         * The indices
         * </p>
         * @method vertex
         * @param uIndex {number} The zero-based `horizontal` index.
         * @param vIndex {number} The zero-based 'vertical` index.
         * @return {Vertex} The vertex corresponding to the specified coordinates.
         * @example
             var topo = new EIGHT.GridTopology(1, 1)
             topo.vertex(uIndex, vIndex).attributes('aPosition') = new R3([i - 0.5, j - 0.5, 0])
         */
        GridTopology.prototype.vertex = function (uIndex, vIndex) {
            mustBeInteger('uIndex', uIndex);
            mustBeInteger('vIndex', vIndex);
            return this.vertices[(this._vSegments - vIndex) * this.uLength + uIndex];
        };
        return GridTopology;
    })(MeshTopology);
    return GridTopology;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/collections/NumberIUnknownMap',["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    // FIXME: Maybe use a dynamic flag implying JIT keys, otherwise recompute as we go along.
    var LOGGING_NAME = 'NumberIUnknownMap';
    /**
     * @class NumberIUnknownMap<V>
     */
    var NumberIUnknownMap = (function (_super) {
        __extends(NumberIUnknownMap, _super);
        /**
         * @class NumberIUnknownMap<V>
         * @constructor
         */
        function NumberIUnknownMap() {
            _super.call(this, LOGGING_NAME);
            this._elements = {};
        }
        NumberIUnknownMap.prototype.destructor = function () {
            var self = this;
            this.forEach(function (key, value) {
                if (value) {
                    value.release();
                }
            });
            this._elements = void 0;
        };
        NumberIUnknownMap.prototype.exists = function (key) {
            var element = this._elements[key];
            return element ? true : false;
        };
        NumberIUnknownMap.prototype.get = function (key) {
            var element = this.getWeakRef(key);
            if (element) {
                element.addRef();
            }
            return element;
        };
        // FIXME
        /*private*/ NumberIUnknownMap.prototype.getWeakRef = function (index) {
            return this._elements[index];
        };
        NumberIUnknownMap.prototype.put = function (key, value) {
            if (value) {
                value.addRef();
            }
            this.putWeakRef(key, value);
        };
        // FIXME
        /*private*/ NumberIUnknownMap.prototype.putWeakRef = function (key, value) {
            var elements = this._elements;
            var existing = elements[key];
            if (existing) {
                existing.release();
            }
            elements[key] = value;
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
                // FIXME: cache? Maybe, clients may use this to iterate. forEach is too slow.
                return Object.keys(this._elements).map(function (keyString) { return parseFloat(keyString); });
            },
            enumerable: true,
            configurable: true
        });
        NumberIUnknownMap.prototype.remove = function (key) {
            // Strong or Weak doesn't matter because the value is `undefined`.
            this.put(key, void 0);
            delete this._elements[key];
        };
        return NumberIUnknownMap;
    })(Shareable);
    return NumberIUnknownMap;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/scene/createDrawList',["require", "exports", '../collections/IUnknownArray', '../collections/NumberIUnknownMap', '../utils/refChange', '../utils/Shareable', '../collections/StringIUnknownMap', '../utils/uuid4'], function (require, exports, IUnknownArray, NumberIUnknownMap, refChange, Shareable, StringIUnknownMap, uuid4) {
    var CLASS_NAME_DRAWLIST = "createDrawList";
    var CLASS_NAME_GROUP = "DrawableGroup";
    var CLASS_NAME_ALL = "DrawableGroups";
    // FIXME; Probably good to have another collection of DrawableGroup
    /**
     * A grouping of IDrawable, by IMaterial.
     */
    // FIXME: extends Shareable
    var DrawableGroup = (function () {
        function DrawableGroup(program) {
            this._drawables = new IUnknownArray();
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._program = program;
            this._program.addRef();
            refChange(this._uuid, CLASS_NAME_GROUP, +1);
        }
        DrawableGroup.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, CLASS_NAME_GROUP, +1);
            return this._refCount;
        };
        DrawableGroup.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, CLASS_NAME_GROUP, -1);
            if (this._refCount === 0) {
                this._program.release();
                this._program = void 0;
                this._drawables.release();
                this._drawables = void 0;
                this._refCount = void 0;
                this._uuid = void 0;
                return 0;
            }
            else {
                return this._refCount;
            }
        };
        Object.defineProperty(DrawableGroup.prototype, "material", {
            get: function () {
                this._program.addRef();
                return this._program;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * accept provides a way to push out the IMaterial without bumping the reference count.
         */
        DrawableGroup.prototype.acceptProgram = function (visitor) {
            visitor(this._program);
        };
        Object.defineProperty(DrawableGroup.prototype, "length", {
            get: function () {
                return this._drawables.length;
            },
            enumerable: true,
            configurable: true
        });
        DrawableGroup.prototype.containsDrawable = function (drawable) {
            return this._drawables.indexOf(drawable) >= 0;
        };
        DrawableGroup.prototype.push = function (drawable) {
            this._drawables.push(drawable);
        };
        DrawableGroup.prototype.remove = function (drawable) {
            var drawables = this._drawables;
            var index = drawables.indexOf(drawable);
            if (index >= 0) {
                // We don't actually need the returned element so release it.
                drawables.splice(index, 1).release();
            }
        };
        DrawableGroup.prototype.draw = function (ambients, canvasId) {
            var i;
            var length;
            var drawables = this._drawables;
            var material = this._program;
            material.use(canvasId);
            if (ambients) {
                ambients.forEach(function (ambient) {
                    ambient.setUniforms(material, canvasId);
                });
            }
            length = drawables.length;
            for (i = 0; i < length; i++) {
                var drawable = drawables.get(i);
                drawable.draw(canvasId);
                drawable.release();
            }
        };
        DrawableGroup.prototype.traverseDrawables = function (callback) {
            this._drawables.forEach(callback);
        };
        return DrawableGroup;
    })();
    /**
     * Should look like a set of Drawable Groups. Maybe like a Scene!
     */
    var DrawableGroups = (function (_super) {
        __extends(DrawableGroups, _super);
        function DrawableGroups() {
            _super.call(this, CLASS_NAME_ALL);
            /**
             * Mapping from programId to DrawableGroup ~ (IMaterial,IDrawable[])
             */
            this._groups = new StringIUnknownMap();
        }
        DrawableGroups.prototype.destructor = function () {
            this._groups.release();
            this._groups = void 0;
            _super.prototype.destructor.call(this);
        };
        DrawableGroups.prototype.add = function (drawable) {
            // Now let's see if we can get a program...
            var program = drawable.material;
            if (program) {
                try {
                    var programId = program.uuid;
                    var group = this._groups.get(programId);
                    if (!group) {
                        group = new DrawableGroup(program);
                        this._groups.put(programId, group);
                    }
                    if (!group.containsDrawable(drawable)) {
                        group.push(drawable);
                    }
                    group.release();
                }
                finally {
                    program.release();
                }
            }
            else {
            }
        };
        DrawableGroups.prototype.containsDrawable = function (drawable) {
            var material = drawable.material;
            if (material) {
                try {
                    var group = this._groups.getWeakRef(material.uuid);
                    if (group) {
                        return group.containsDrawable(drawable);
                    }
                    else {
                        return false;
                    }
                }
                finally {
                    material.release();
                }
            }
            else {
                return false;
            }
        };
        DrawableGroups.prototype.remove = function (drawable) {
            var material = drawable.material;
            if (material) {
                try {
                    var programId = material.uuid;
                    if (this._groups.exists(programId)) {
                        var group = this._groups.get(programId);
                        try {
                            group.remove(drawable);
                            if (group.length === 0) {
                                this._groups.remove(programId).release();
                            }
                        }
                        finally {
                            group.release();
                        }
                    }
                    else {
                    }
                }
                finally {
                    material.release();
                }
            }
        };
        DrawableGroups.prototype.draw = function (ambients, canvasId) {
            // Manually hoisted variable declarations.
            var drawGroups;
            var materialKey;
            var materialKeys;
            var materialsLength;
            var i;
            var drawGroup;
            drawGroups = this._groups;
            materialKeys = drawGroups.keys;
            materialsLength = materialKeys.length;
            for (i = 0; i < materialsLength; i++) {
                materialKey = materialKeys[i];
                drawGroup = drawGroups.get(materialKey);
                drawGroup.draw(ambients, canvasId);
                drawGroup.release();
            }
        };
        // FIXME: Rename to traverse
        DrawableGroups.prototype.traverseDrawables = function (callback, callback2) {
            this._groups.forEach(function (groupId, group) {
                group.acceptProgram(callback2);
                group.traverseDrawables(callback);
            });
        };
        DrawableGroups.prototype.traversePrograms = function (callback) {
            this._groups.forEach(function (groupId, group) {
                group.acceptProgram(callback);
            });
        };
        return DrawableGroups;
    })(Shareable);
    var createDrawList = function () {
        var drawableGroups = new DrawableGroups();
        var canvasIdToManager = new NumberIUnknownMap();
        var refCount = 1;
        var uuid = uuid4().generate();
        var self = {
            addRef: function () {
                refCount++;
                refChange(uuid, CLASS_NAME_DRAWLIST, +1);
                return refCount;
            },
            release: function () {
                refCount--;
                refChange(uuid, CLASS_NAME_DRAWLIST, -1);
                if (refCount === 0) {
                    drawableGroups.release();
                    drawableGroups = void 0;
                    canvasIdToManager.release();
                    canvasIdToManager = void 0;
                    refCount = void 0;
                    uuid = void 0;
                    return 0;
                }
                else {
                    return refCount;
                }
            },
            contextFree: function (canvasId) {
                drawableGroups.traverseDrawables(function (drawable) {
                    drawable.contextFree(canvasId);
                }, function (program) {
                    program.contextFree(canvasId);
                });
                canvasIdToManager.remove(canvasId);
            },
            /**
             * method contextGain
             */
            contextGain: function (manager) {
                if (!canvasIdToManager.exists(manager.canvasId)) {
                    // Cache the manager.
                    canvasIdToManager.put(manager.canvasId, manager);
                    // Broadcast to drawables and materials.
                    drawableGroups.traverseDrawables(function (drawable) {
                        drawable.contextGain(manager);
                    }, function (material) {
                        material.contextGain(manager);
                    });
                }
            },
            contextLost: function (canvasId) {
                if (canvasIdToManager.exists(canvasId)) {
                    drawableGroups.traverseDrawables(function (drawable) {
                        drawable.contextLost(canvasId);
                    }, function (material) {
                        material.contextLost(canvasId);
                    });
                    canvasIdToManager.remove(canvasId);
                }
            },
            add: function (drawable) {
                // If we have canvasIdToManager povide them to the drawable before asking for the program.
                // FIXME: Do we have to be careful about whether the manager has a context?
                canvasIdToManager.forEach(function (id, manager) {
                    drawable.contextGain(manager);
                });
                drawableGroups.add(drawable);
            },
            containsDrawable: function (drawable) {
                return drawableGroups.containsDrawable(drawable);
            },
            draw: function (ambients, canvasId) {
                drawableGroups.draw(ambients, canvasId);
            },
            getDrawablesByName: function (name) {
                var result = new IUnknownArray();
                drawableGroups.traverseDrawables(function (candidate) {
                    if (candidate.name === name) {
                        result.push(candidate);
                    }
                }, function (program) {
                });
                return result;
            },
            remove: function (drawable) {
                drawableGroups.remove(drawable);
            },
            // FIXME: canvasId not being used?
            traverse: function (callback, canvasId, prolog) {
                drawableGroups.traverseDrawables(callback, prolog);
            }
        };
        refChange(uuid, CLASS_NAME_DRAWLIST, +1);
        return self;
    };
    return createDrawList;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/scene/Drawable',["require", "exports", '../checks/isDefined', '../collections/IUnknownArray', '../collections/NumberIUnknownMap', '../utils/Shareable', '../collections/StringIUnknownMap'], function (require, exports, isDefined, IUnknownArray, NumberIUnknownMap, Shareable, StringIUnknownMap) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'Drawable';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class Drawable
     * @extends Shareable
     * @extends IDrawable
     */
    var Drawable = (function (_super) {
        __extends(Drawable, _super);
        // FIXME: Do we insist on a IContextMonitor here.
        // We can also assume that we are OK because of the Scene - but can't assume that there is one?
        /**
         * @class Drawable
         * @constructor
         * @param primitives {DrawPrimitive[]}
         * @param material {M}
         * @param model {U}
         */
        function Drawable(primitives, material) {
            _super.call(this, LOGGING_NAME);
            this.primitives = primitives;
            this._material = material;
            this._material.addRef();
            this.buffersByCanvasId = new NumberIUnknownMap();
            this.uniforms = new StringIUnknownMap();
        }
        Drawable.prototype.destructor = function () {
            this.primitives = void 0;
            this.buffersByCanvasId.release();
            this.buffersByCanvasId = void 0;
            this._material.release();
            this._material = void 0;
            this.uniforms.release();
            this.uniforms = void 0;
        };
        Drawable.prototype.draw = function (canvasId) {
            // We know we are going to need a "good" canvasId to perform the buffers lookup.
            // So we may as well test that condition now.
            if (isDefined(canvasId)) {
                var material = this._material;
                var buffers = this.buffersByCanvasId.getWeakRef(canvasId);
                if (isDefined(buffers)) {
                    material.use(canvasId);
                    // FIXME: The name is unused. Think we should just have a list
                    // and then access using either the real uniform name or a property name.
                    this.uniforms.forEach(function (name, uniform) {
                        uniform.setUniforms(material, canvasId);
                    });
                    for (var i = 0; i < buffers.length; i++) {
                        var buffer = buffers.getWeakRef(i);
                        buffer.bind(material /*, aNameToKeyName*/); // FIXME: Why not part of the API?
                        buffer.draw();
                        buffer.unbind();
                    }
                }
            }
        };
        Drawable.prototype.contextFree = function (canvasId) {
            this._material.contextFree(canvasId);
        };
        Drawable.prototype.contextGain = function (manager) {
            // 1. Replace the existing buffer geometry if we have geometry. 
            if (this.primitives) {
                for (var i = 0; i < this.primitives.length; i++) {
                    var primitive = this.primitives[i];
                    if (!this.buffersByCanvasId.exists(manager.canvasId)) {
                        this.buffersByCanvasId.putWeakRef(manager.canvasId, new IUnknownArray([]));
                    }
                    var buffers = this.buffersByCanvasId.getWeakRef(manager.canvasId);
                    buffers.pushWeakRef(manager.createBufferGeometry(primitive));
                }
            }
            else {
                console.warn(LOGGING_NAME + " contextGain method has no elements, canvasId => " + manager.canvasId);
            }
            // 2. Delegate the context to the material.
            this._material.contextGain(manager);
        };
        Drawable.prototype.contextLost = function (canvasId) {
            this._material.contextLost(canvasId);
        };
        /**
         * @method getFacet
         * @param name {string}
         * @return {IFacet}
         */
        Drawable.prototype.getFacet = function (name) {
            return this.uniforms.get(name);
        };
        Drawable.prototype.setFacet = function (name, value) {
            this.uniforms.put(name, value);
            return value;
        };
        Object.defineProperty(Drawable.prototype, "material", {
            /**
             * @property material
             * @type {M}
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
        return Drawable;
    })(Shareable);
    return Drawable;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/scene/PerspectiveCamera',["require", "exports", '../cameras/createPerspective', '../i18n/readOnly', '../checks/mustBeObject', '../checks/mustBeNumber', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, createPerspective, readOnly, mustBeObject, mustBeNumber, mustBeString, Shareable) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var CLASS_NAME = 'PerspectiveCamera';
    /**
     * @class PerspectiveCamera
     */
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        /**
         * <p>
         *
         * </p>
         * @class PerspectiveCamera
         * @constructor
         * @param [fov = 75 * Math.PI / 180] {number}
         * @param [aspect=1] {number}
         * @param [near=0.1] {number}
         * @param [far=2000] {number}
         * @example
         *   var camera = new EIGHT.PerspectiveCamera()
         *   camera.setAspect(canvas.clientWidth / canvas.clientHeight)
         *   camera.setFov(3.0 * e3)
         */
        function PerspectiveCamera(fov, aspect, near, far) {
            if (fov === void 0) { fov = 75 * Math.PI / 180; }
            if (aspect === void 0) { aspect = 1; }
            if (near === void 0) { near = 0.1; }
            if (far === void 0) { far = 2000; }
            _super.call(this, 'PerspectiveCamera');
            mustBeNumber('fov', fov);
            mustBeNumber('aspect', aspect);
            mustBeNumber('near', near);
            mustBeNumber('far', far);
            this.inner = createPerspective({ fov: fov, aspect: aspect, near: near, far: far });
        }
        PerspectiveCamera.prototype.destructor = function () {
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        PerspectiveCamera.prototype.setUniforms = function (visitor, canvasId) {
            this.inner.setNear(this.near);
            this.inner.setFar(this.far);
            this.inner.setUniforms(visitor, canvasId);
        };
        PerspectiveCamera.prototype.contextFree = function () {
        };
        PerspectiveCamera.prototype.contextGain = function (manager) {
        };
        PerspectiveCamera.prototype.contextLost = function () {
        };
        PerspectiveCamera.prototype.draw = function (canvasId) {
            console.warn(CLASS_NAME + ".draw(" + canvasId + ")");
            // Do nothing.
        };
        PerspectiveCamera.prototype.getProperty = function (name) {
            mustBeString('name', name);
            switch (name) {
                case PerspectiveCamera.PROP_EYE:
                case PerspectiveCamera.PROP_POSITION: {
                    return this.eye.coords;
                    break;
                }
                default: {
                }
            }
        };
        PerspectiveCamera.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeObject('value', value);
            switch (name) {
                case PerspectiveCamera.PROP_EYE:
                case PerspectiveCamera.PROP_POSITION: {
                    this.eye.copyCoordinates(value);
                    break;
                }
                default: {
                }
            }
        };
        Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
            /**
             * The aspect ratio (width / height) of the camera viewport.
             * @property aspect
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this.inner.aspect;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setAspect
         * @param aspect {number}
         * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
         * @chainable
         */
        PerspectiveCamera.prototype.setAspect = function (aspect) {
            this.inner.aspect = aspect;
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "eye", {
            /**
             * The position of the camera.
             * @property eye
             * @type {R3}
             * @readOnly
             */
            get: function () {
                return this.inner.eye;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setEye
         * @param eye {VectorE3}
         * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
         * @chainable
         */
        PerspectiveCamera.prototype.setEye = function (eye) {
            this.inner.setEye(eye);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "fov", {
            /**
             * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
             * Measured in radians.
             * @property fov
             * @type {number}
             * @readOnly
             */
            // TODO: Field of view could be specified as an Aspect + Magnitude of a SpinG3!?
            get: function () {
                return this.inner.fov;
            },
            set: function (unused) {
                throw new Error(readOnly('fov').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setFov
         * @param fov {number}
         * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
         * @chainable
         */
        PerspectiveCamera.prototype.setFov = function (fov) {
            mustBeNumber('fov', fov);
            this.inner.fov = fov;
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "look", {
            get: function () {
                return this.inner.look;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setLook = function (look) {
            this.inner.setLook(look);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "near", {
            /**
             * The distance to the near plane.
             * @property near
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this.inner.near;
            },
            set: function (unused) {
                throw new Error(readOnly('near').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setNear
         * @param near {number}
         * @return {PerspectiveCamera} <p><code>this</code> instance, <em>without incrementing the reference count</em>.</p>
         * @chainable
         */
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
            set: function (unused) {
                throw new Error(readOnly('up').message);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setUp = function (up) {
            this.inner.setUp(up);
            return this;
        };
        /**
         * The name of the property that designates the position.
         * @property PROP_POSITION
         * @type {string}
         * @default 'X'
         * @static
         * @readOnly
         */
        PerspectiveCamera.PROP_POSITION = 'X';
        PerspectiveCamera.PROP_EYE = 'eye';
        return PerspectiveCamera;
    })(Shareable);
    return PerspectiveCamera;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/scene/MonitorList',["require", "exports", '../utils/Shareable', '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, Shareable, mustSatisfy, isInteger) {
    function beInstanceOfContextMonitors() {
        return "be an instance of MonitorList";
    }
    function beContextMonitorArray() {
        return "be IContextMonitor[]";
    }
    function identity(monitor) {
        return monitor;
    }
    var METHOD_ADD = 'addContextListener';
    var METHOD_REMOVE = 'removeContextListener';
    /**
     * Implementation Only.
     */
    var MonitorList = (function (_super) {
        __extends(MonitorList, _super);
        function MonitorList(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, 'MonitorList');
            this.monitors = monitors.map(identity);
            this.monitors.forEach(function (monitor) {
                monitor.addRef();
            });
        }
        MonitorList.prototype.destructor = function () {
            this.monitors.forEach(function (monitor) {
                monitor.release();
            });
        };
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
        MonitorList.prototype.synchronize = function (user) {
            this.monitors.forEach(function (monitor) {
                monitor.synchronize(user);
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
        MonitorList.synchronize = function (user, monitors) {
            MonitorList.verify('monitors', monitors, function () { return 'MonitorList.removeContextListener'; });
            monitors.forEach(function (monitor) {
                monitor.synchronize(user);
            });
        };
        return MonitorList;
    })(Shareable);
    return MonitorList;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/scene/Scene',["require", "exports", '../scene/createDrawList', '../scene/MonitorList', '../utils/Shareable'], function (require, exports, createDrawList, MonitorList, Shareable) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    /**
     * @class Scene
     * @extends Shareable
     * @extends IDrawList
     */
    var Scene = (function (_super) {
        __extends(Scene, _super);
        // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
        /**
         * <p>
         * A <code>Scene</code> is a collection of drawable instances arranged in some order.
         * The precise order is implementation defined.
         * The collection may be traversed for general processing using callback/visitor functions.
         * </p>
         * @class Scene
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         */
        function Scene(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, LOGGING_NAME);
            MonitorList.verify('monitors', monitors, ctorContext);
            this.drawList = createDrawList();
            this.monitors = new MonitorList(monitors);
            this.monitors.addContextListener(this);
            this.monitors.synchronize(this);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        Scene.prototype.destructor = function () {
            this.monitors.removeContextListener(this);
            this.monitors.release();
            this.monitors = void 0;
            this.drawList.release();
            this.drawList = void 0;
        };
        /**
         * <p>
         * Adds the <code>drawable</code> to this <code>Scene</code>.
         * </p>
         * @method add
         * @param drawable {IDrawable}
         * @return {Void}
         * <p>
         * This method returns <code>undefined</code>.
         * </p>
         */
        Scene.prototype.add = function (drawable) {
            return this.drawList.add(drawable);
        };
        Scene.prototype.containsDrawable = function (drawable) {
            return this.drawList.containsDrawable(drawable);
        };
        /**
         * <p>
         * Traverses the collection of drawables, drawing each one.
         * </p>
         * @method draw
         * @param ambients {IFacet[]}
         * @param canvasId {number}
         * @return {void}
         * @beta
         */
        Scene.prototype.draw = function (ambients, canvasId) {
            return this.drawList.draw(ambients, canvasId);
        };
        /**
         * Gets a collection of drawable elements by name.
         * @method getDrawablesByName
         * @param name {string}
         */
        Scene.prototype.getDrawablesByName = function (name) {
            return this.drawList.getDrawablesByName(name);
        };
        /**
         * <p>
         * Removes the <code>drawable</code> from this <code>Scene</code>.
         * </p>
         * @method remove
         * @param drawable {IDrawable}
         * @return {Void}
         * <p>
         * This method returns <code>undefined</code>.
         * </p>
         */
        Scene.prototype.remove = function (drawable) {
            return this.drawList.remove(drawable);
        };
        /**
         * <p>
         * Traverses the collection of drawables, calling the specified callback arguments.
         * </p>
         * @method traverse
         * @param callback {(drawable: IDrawable) => void} Callback function for each drawable.
         * @param canvasId {number} Identifies the canvas.
         * @param prolog {(material: IMaterial) => void} Callback function for each material.
         * @return {void}
         */
        Scene.prototype.traverse = function (callback, canvasId, prolog) {
            this.drawList.traverse(callback, canvasId, prolog);
        };
        Scene.prototype.contextFree = function (canvasId) {
            this.drawList.contextFree(canvasId);
        };
        Scene.prototype.contextGain = function (manager) {
            this.drawList.contextGain(manager);
        };
        Scene.prototype.contextLost = function (canvasId) {
            this.drawList.contextLost(canvasId);
        };
        return Scene;
    })(Shareable);
    return Scene;
});

define('davinci-eight/renderers/renderer',["require", "exports", '../collections/IUnknownArray', '../utils/refChange', '../utils/uuid4', '../commands/WebGLClearColor', '../commands/WebGLEnable', '../commands/WebGLDisable'], function (require, exports, IUnknownArray, refChange, uuid4, WebGLClearColor, WebGLEnable, WebGLDisable) {
    var CLASS_NAME = "CanonicalIContextRenderer";
    /**
     * We need to know the canvasId so that we can tell drawables where to draw.
     * However, we don't need an don't want a canvas because we can only get that once the
     * canvas has loaded. I suppose a promise would be OK, but that's for another day.
     *
     * Part of the role of this class is to manage the commands that are executed at startup/prolog.
     */
    var renderer = function () {
        var _manager;
        var uuid = uuid4().generate();
        var refCount = 1;
        var commands = new IUnknownArray([]);
        var self = {
            addRef: function () {
                refCount++;
                refChange(uuid, CLASS_NAME, +1);
                return refCount;
            },
            get canvas() {
                return _manager ? _manager.canvas : void 0;
            },
            get commands() {
                return commands;
            },
            get gl() {
                return _manager ? _manager.gl : void 0;
            },
            clearColor: function (red, green, blue, alpha) {
                commands.pushWeakRef(new WebGLClearColor(red, green, blue, alpha));
            },
            contextFree: function (canvasId) {
                commands.forEach(function (command) {
                    command.contextFree(canvasId);
                });
                _manager = void 0;
            },
            contextGain: function (manager) {
                // This object is single context, so we only ever get called with one manager at a time (serially).
                _manager = manager;
                commands.forEach(function (command) {
                    command.contextGain(manager);
                });
            },
            contextLost: function (canvasId) {
                commands.forEach(function (command) {
                    command.contextLost(canvasId);
                });
                _manager = void 0;
            },
            disable: function (capability) {
                commands.pushWeakRef(new WebGLDisable(capability));
            },
            enable: function (capability) {
                commands.pushWeakRef(new WebGLEnable(capability));
            },
            viewport: function (x, y, width, height) {
                return self.gl.viewport(x, y, width, height);
            },
            release: function () {
                refCount--;
                refChange(uuid, CLASS_NAME, -1);
                if (refCount === 0) {
                    commands.release();
                    commands = void 0;
                    return 0;
                }
                else {
                    return refCount;
                }
            }
        };
        refChange(uuid, CLASS_NAME, +1);
        return self;
    };
    return renderer;
});

define('davinci-eight/checks/isBoolean',["require", "exports"], function (require, exports) {
    function isBoolean(x) {
        return (typeof x === 'boolean');
    }
    return isBoolean;
});

define('davinci-eight/checks/mustBeBoolean',["require", "exports", '../checks/mustSatisfy', '../checks/isBoolean'], function (require, exports, mustSatisfy, isBoolean) {
    function beBoolean() {
        return "be `boolean`";
    }
    function mustBeBoolean(name, value, contextBuilder) {
        mustSatisfy(name, isBoolean(value), beBoolean, contextBuilder);
        return value;
    }
    return mustBeBoolean;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/core/BufferResource',["require", "exports", '../checks/isDefined', '../checks/mustBeBoolean', '../checks/mustBeObject', '../utils/Shareable'], function (require, exports, isDefined, mustBeBoolean, mustBeObject, Shareable) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var CLASS_NAME = 'BufferResource';
    /**
     * @class BufferResource
     * @extends Shareable
     */
    var BufferResource = (function (_super) {
        __extends(BufferResource, _super);
        /**
         * @class BufferResource
         * @constructor
         * @param manager {IContextProvider}
         * @param isElements {boolean}
         */
        function BufferResource(manager, isElements) {
            _super.call(this, CLASS_NAME);
            this.manager = mustBeObject('manager', manager);
            this._isElements = mustBeBoolean('isElements', isElements);
            manager.addContextListener(this);
            manager.synchronize(this);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        BufferResource.prototype.destructor = function () {
            this.contextFree(this.manager.canvasId);
            this.manager.removeContextListener(this);
            this.manager = void 0;
            this._isElements = void 0;
        };
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        BufferResource.prototype.contextFree = function (canvasId) {
            if (this._buffer) {
                var gl = this.manager.gl;
                if (isDefined(gl)) {
                    gl.deleteBuffer(this._buffer);
                }
                else {
                    console.error(CLASS_NAME + " must leak WebGLBuffer because WebGLRenderingContext is " + typeof gl);
                }
                this._buffer = void 0;
            }
            else {
            }
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        BufferResource.prototype.contextGain = function (manager) {
            if (this.manager.canvasId === manager.canvasId) {
                if (!this._buffer) {
                    this._buffer = manager.gl.createBuffer();
                }
                else {
                }
            }
            else {
                console.warn("BufferResource ignoring contextGain for canvasId " + manager.canvasId);
            }
        };
        /**
         * @method contextLost
         * @return {void}
         */
        BufferResource.prototype.contextLost = function () {
            this._buffer = void 0;
        };
        /**
         * @method bind
         * @return {void}
         */
        BufferResource.prototype.bind = function () {
            var gl = this.manager.gl;
            if (gl) {
                var target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
                gl.bindBuffer(target, this._buffer);
            }
            else {
                console.warn(CLASS_NAME + " bind() missing WebGL rendering context.");
            }
        };
        /**
         * @method unbind
         * @return {void}
         */
        BufferResource.prototype.unbind = function () {
            var gl = this.manager.gl;
            if (gl) {
                var target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
                gl.bindBuffer(target, null);
            }
            else {
                console.warn(CLASS_NAME + " unbind() missing WebGL rendering context.");
            }
        };
        return BufferResource;
    })(Shareable);
    return BufferResource;
});

define('davinci-eight/renderers/initWebGL',["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    /**
     * Returns the WebGLRenderingContext given a canvas.
     * canvas
     * attributes
     * If the canvas is undefined then an undefined value is returned for the context.
     */
    function initWebGL(canvas, attributes) {
        // We'll be hyper-functional. An undefined canvas begets and undefined context.
        // Clients must check their context output or canvas input.
        if (isDefined(canvas)) {
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
        else {
            // An undefined canvas results in an undefined context.
            return void 0;
        }
    }
    return initWebGL;
});

define('davinci-eight/utils/randumbInteger',["require", "exports"], function (require, exports) {
    /**
     * Initially used to give me a canvasId.
     * Using the big-enough space principle to avoid collisions.
     */
    function randumbInteger() {
        var r = Math.random();
        var s = r * 1000000;
        var i = Math.round(s);
        return i;
    }
    return randumbInteger;
});

define('davinci-eight/resources/TextureResource',["require", "exports", '../checks/expectArg', '../utils/refChange', '../utils/uuid4'], function (require, exports, expectArg, refChange, uuid4) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_ITEXTURE = 'ITexture';
    var ms = new Array();
    var os = [];
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
            monitor.synchronize(this);
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
        TextureResource.prototype.contextLost = function () {
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
                console.warn(LOGGING_NAME_ITEXTURE + " bind() missing WebGL rendering context.");
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
                console.warn(LOGGING_NAME_ITEXTURE + " unbind() missing WebGL rendering context.");
            }
        };
        return TextureResource;
    })();
    return TextureResource;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/utils/contextProxy',["require", "exports", '../core/BufferResource', '../core/DrawMode', '../core', '../geometries/DrawPrimitive', '../checks/expectArg', '../renderers/initWebGL', '../checks/isDefined', '../checks/isUndefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeString', '../utils/randumbInteger', '../utils/refChange', '../utils/Shareable', '../collections/StringIUnknownMap', '../resources/TextureResource', '../utils/uuid4'], function (require, exports, BufferResource, DrawMode, core, DrawPrimitive, expectArg, initWebGL, isDefined, isUndefined, mustBeInteger, mustBeNumber, mustBeString, randumbInteger, refChange, Shareable, StringIUnknownMap, TextureResource, uuid4) {
    var LOGGING_NAME_ELEMENTS_BLOCK = 'ElementsBlock';
    var LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib';
    var LOGGING_NAME_MESH = 'Drawable';
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
     * class GeometryDataCommand
     * private
     */
    var GeometryDataCommand = (function () {
        /**
         * class GeometryDataCommand
         * constructor
         */
        function GeometryDataCommand(mode, count, type, offset) {
            mustBeInteger('mode', mode);
            mustBeInteger('count', count);
            mustBeInteger('type', type);
            mustBeInteger('offset', offset);
            this.mode = mode;
            this.count = count;
            this.type = type;
            this.offset = offset;
        }
        /**
         * Executes the drawElements command using the instance state.
         * method execute
         * param gl {WebGLRenderingContext}
         */
        GeometryDataCommand.prototype.execute = function (gl) {
            if (isDefined(gl)) {
                switch (this.mode) {
                    case DrawMode.TRIANGLE_STRIP:
                        {
                            gl.drawElements(gl.TRIANGLE_STRIP, this.count, this.type, this.offset);
                        }
                        break;
                    case DrawMode.TRIANGLE_FAN:
                        {
                            gl.drawElements(gl.TRIANGLE_FAN, this.count, this.type, this.offset);
                        }
                        break;
                    case DrawMode.TRIANGLES:
                        {
                            gl.drawElements(gl.TRIANGLES, this.count, this.type, this.offset);
                        }
                        break;
                    case DrawMode.LINE_STRIP:
                        {
                            gl.drawElements(gl.LINE_STRIP, this.count, this.type, this.offset);
                        }
                        break;
                    case DrawMode.LINE_LOOP:
                        {
                            gl.drawElements(gl.LINE_LOOP, this.count, this.type, this.offset);
                        }
                        break;
                    case DrawMode.LINES:
                        {
                            gl.drawElements(gl.LINES, this.count, this.type, this.offset);
                        }
                        break;
                    case DrawMode.POINTS:
                        {
                            gl.drawElements(gl.POINTS, this.count, this.type, this.offset);
                        }
                        break;
                    default: {
                        throw new Error("mode: " + this.mode);
                    }
                }
            }
            else {
                console.warn("HFW: Er, like hey dude! You're asking me to draw something without a context. That's not cool, but I won't complain.");
            }
        };
        return GeometryDataCommand;
    })();
    /**
     * class ElementsBlock
     */
    var ElementsBlock = (function (_super) {
        __extends(ElementsBlock, _super);
        /**
         * class ElementsBlock
         * constructor
         */
        function ElementsBlock(indexBuffer, attributes, drawCommand) {
            _super.call(this, LOGGING_NAME_ELEMENTS_BLOCK);
            this._indexBuffer = indexBuffer;
            this._indexBuffer.addRef();
            this._attributes = attributes;
            this._attributes.addRef();
            this.drawCommand = drawCommand;
        }
        ElementsBlock.prototype.destructor = function () {
            this._attributes.release();
            this._attributes = void 0;
            this._indexBuffer.release();
            this._indexBuffer = void 0;
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ElementsBlock.prototype, "indexBuffer", {
            get: function () {
                this._indexBuffer.addRef();
                return this._indexBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementsBlock.prototype, "attributes", {
            get: function () {
                this._attributes.addRef();
                return this._attributes;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsBlock;
    })(Shareable);
    var ElementsBlockAttrib = (function (_super) {
        __extends(ElementsBlockAttrib, _super);
        function ElementsBlockAttrib(buffer, size, normalized, stride, offset) {
            _super.call(this, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE);
            this._buffer = buffer;
            this._buffer.addRef();
            this.size = size;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
        }
        ElementsBlockAttrib.prototype.destructor = function () {
            this._buffer.release();
            this._buffer = void 0;
            this.size = void 0;
            this.normalized = void 0;
            this.stride = void 0;
            this.offset = void 0;
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
    })(Shareable);
    function isBufferUsage(usage) {
        mustBeNumber('usage', usage);
        switch (usage) {
            case WebGLRenderingContext.STATIC_DRAW: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    function messageUnrecognizedMesh(uuid) {
        mustBeString('uuid', uuid);
        return uuid + " is not a recognized mesh uuid";
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
    function bindProgramAttribLocations(program, canvasId, block, aNameToKeyName) {
        // FIXME: Expecting canvasId here.
        // FIXME: This is where we get the IMaterial attributes property.
        // FIXME: Can we invert this?
        // What are we offering to the program:
        // block.attributes (reference counted)
        // Offer a NumberIUnknownList<IAttributePointer> which we have prepared up front
        // in order to get the name -> index correct.
        // Then attribute setting should go much faster
        var attribLocations = program.attributes(canvasId);
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
                    // FIXME Would be nice to be able to get a weak reference to the buffer.
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
            console.warn("bindProgramAttribLocations: program.attributes is falsey.");
        }
    }
    function unbindProgramAttribLocations(program, canvasId) {
        // FIXME: Not sure if this suggests a disableAll() or something more symmetric.
        var attribLocations = program.attributes(canvasId);
        if (attribLocations) {
            Object.keys(attribLocations).forEach(function (aName) {
                attribLocations[aName].disable();
            });
        }
        else {
            console.warn("unbindProgramAttribLocations: program.attributes is falsey.");
        }
    }
    /**
     * Implementation of IBufferGeometry coupled to the 'blocks' implementation.
     */
    var BufferGeometry = (function (_super) {
        __extends(BufferGeometry, _super);
        function BufferGeometry(canvasId, gl, blocks) {
            _super.call(this, 'BufferGeometry');
            this.canvasId = canvasId;
            this._blocks = blocks;
            this._blocks.addRef();
            this.gl = gl;
        }
        BufferGeometry.prototype.destructor = function () {
            // FIXME: Check status of Material?
            this._blocks.release();
            _super.prototype.destructor.call(this);
        };
        BufferGeometry.prototype.bind = function (program, aNameToKeyName) {
            if (this._program !== program) {
                if (this._program) {
                    this.unbind();
                }
                var block = this._blocks.get(this.uuid);
                if (block) {
                    if (program) {
                        this._program = program;
                        this._program.addRef();
                        var indexBuffer = block.indexBuffer;
                        indexBuffer.bind();
                        indexBuffer.release();
                        bindProgramAttribLocations(this._program, this.canvasId, block, aNameToKeyName);
                    }
                    else {
                        expectArg('program', program).toBeObject();
                    }
                    block.release();
                }
                else {
                    throw new Error(messageUnrecognizedMesh(this.uuid));
                }
            }
        };
        BufferGeometry.prototype.draw = function () {
            var block = this._blocks.get(this.uuid);
            if (block) {
                // FIXME: Wondering why we don't just make this a parameter?
                // On the other hand, buffer geometry is only good for one context.
                block.drawCommand.execute(this.gl);
                block.release();
            }
            else {
                throw new Error(messageUnrecognizedMesh(this.uuid));
            }
        };
        BufferGeometry.prototype.unbind = function () {
            if (this._program) {
                var block = this._blocks.get(this.uuid);
                if (block) {
                    // FIXME: Ask block to unbind index buffer and avoid addRef/release
                    var indexBuffer = block.indexBuffer;
                    indexBuffer.unbind();
                    indexBuffer.release();
                    // FIXME: Looks like an IMaterial method!
                    unbindProgramAttribLocations(this._program, this.canvasId);
                    block.release();
                }
                else {
                    throw new Error(messageUnrecognizedMesh(this.uuid));
                }
                // We bumped up the reference count during bind. Now we are done.
                this._program.release();
                // Important! The existence of _program indicates the binding state.
                this._program = void 0;
            }
        };
        return BufferGeometry;
    })(Shareable);
    function webgl(attributes) {
        // expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        // mustBeInteger('canvasId', canvasId, webglFunctionalConstructorContextBuilder);
        var uuid = uuid4().generate();
        var _blocks = new StringIUnknownMap();
        // Remark: We only hold weak references to users so that the lifetime of resource
        // objects is not affected by the fact that they are listening for gl events.
        // Users should automatically add themselves upon construction and remove upon release.
        // // FIXME: Really? Not IUnknownArray<IIContextConsumer> ?
        var users = [];
        function addContextListener(user) {
            expectArg('user', user).toBeObject();
            var index = users.indexOf(user);
            if (index < 0) {
                users.push(user);
            }
            else {
                console.warn("user already exists for addContextListener");
            }
        }
        /**
         * Implementation of removeContextListener for the kahuna.
         */
        function removeContextListener(user) {
            expectArg('user', user).toBeObject();
            var index = users.indexOf(user);
            if (index >= 0) {
                // FIXME: Potential leak here if IContextConsumer extends IUnknown
                var removals = users.splice(index, 1);
            }
            else {
            }
        }
        function synchronize(user) {
            if (gl) {
                if (gl.isContextLost()) {
                    user.contextLost(_canvasId);
                }
                else {
                    user.contextGain(kahuna);
                }
            }
            else {
            }
        }
        // TODO: Being a local function, capturing blocks, it was not obvious
        // that blocks should need reference counting.
        // Might be good to create a shareable class?
        function createBufferGeometryDeprecatedMaybe(uuid, canvasId) {
            var refCount = 0;
            var _program = void 0;
            var mesh = {
                addRef: function () {
                    refCount++;
                    refChange(uuid, LOGGING_NAME_MESH, +1);
                    _blocks.addRef();
                    return refCount;
                },
                release: function () {
                    refCount--;
                    refChange(uuid, LOGGING_NAME_MESH, -1);
                    if (refCount === 0) {
                        if (_blocks.exists(uuid)) {
                            _blocks.remove(uuid).release();
                        }
                        else {
                            console.warn("[System Error] " + messageUnrecognizedMesh(uuid));
                        }
                        _blocks.release();
                    }
                    return refCount;
                },
                get uuid() {
                    return uuid;
                },
                bind: function (program, aNameToKeyName) {
                    if (_program !== program) {
                        if (_program) {
                            mesh.unbind();
                        }
                        var block = _blocks.get(uuid);
                        if (block) {
                            if (program) {
                                _program = program;
                                _program.addRef();
                                var indexBuffer = block.indexBuffer;
                                indexBuffer.bind();
                                indexBuffer.release();
                                bindProgramAttribLocations(_program, canvasId, block, aNameToKeyName);
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
                    var block = _blocks.get(uuid);
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
                        var block = _blocks.get(uuid);
                        if (block) {
                            // FIXME: Ask block to unbind index buffer and avoid addRef/release
                            var indexBuffer = block.indexBuffer;
                            indexBuffer.unbind();
                            indexBuffer.release();
                            // FIXME: Looks like an IMaterial method!
                            unbindProgramAttribLocations(_program, _canvasId);
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
            mesh.addRef();
            return mesh;
        }
        var gl;
        /**
         * We must cache the canvas so that we can remove listeners when `stop() is called.
         * Only between `start()` and `stop()` is canvas defined.
         * We use a canvasBuilder so the other initialization can happen while we are waiting
         * for the DOM to load.
         */
        var _canvas;
        var _canvasId;
        var refCount = 0;
        var tokenArg = expectArg('token', "");
        var webGLContextLost = function (event) {
            if (isDefined(_canvas)) {
                event.preventDefault();
                gl = void 0;
                users.forEach(function (user) {
                    user.contextLost(_canvasId);
                });
            }
        };
        var webGLContextRestored = function (event) {
            if (isDefined(_canvas)) {
                event.preventDefault();
                gl = initWebGL(_canvas, attributes);
                users.forEach(function (user) {
                    user.contextGain(kahuna);
                });
            }
        };
        var kahuna = {
            get canvasId() {
                return _canvasId;
            },
            /**
             *
             */
            createBufferGeometry: function (primitive, usage) {
                expectArg('primitive', primitive).toSatisfy(primitive instanceof DrawPrimitive, "primitive must be an instance of DrawPrimitive");
                if (isDefined(usage)) {
                    expectArg('usage', usage).toSatisfy(isBufferUsage(usage), "usage must be on of STATIC_DRAW, ...");
                }
                else {
                    // TODO; Perhaps a simpler way to be Hyper Functional Warrior is to use WebGLRenderingContext.STATIC_DRAW?
                    usage = isDefined(gl) ? gl.STATIC_DRAW : void 0;
                }
                // It's going to get pretty hopeless without a WebGL context.
                // If that's the case, let's just return undefined now before we start allocating useless stuff.
                if (isUndefined(gl)) {
                    if (core.verbose) {
                        console.warn("Impossible to create a buffer geometry without a WebGL context. Sorry, no dice!");
                    }
                    return void 0;
                }
                var mesh = new BufferGeometry(_canvasId, gl, _blocks);
                // let mesh: IBufferGeometry = createBufferGeometryDeprecatedMaybe(uuid4().generate(), _canvasId)
                var indexBuffer = kahuna.createElementArrayBuffer();
                indexBuffer.bind();
                if (isDefined(gl)) {
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(primitive.indices), usage);
                }
                else {
                    console.warn("Unable to bufferData to ELEMENT_ARRAY_BUFFER, WebGL context is undefined.");
                }
                indexBuffer.unbind();
                var attributes = new StringIUnknownMap();
                var names = Object.keys(primitive.attributes);
                var namesLength = names.length;
                var i;
                for (i = 0; i < namesLength; i++) {
                    var name_1 = names[i];
                    var buffer = kahuna.createArrayBuffer();
                    buffer.bind();
                    var vertexAttrib = primitive.attributes[name_1];
                    var data = vertexAttrib.values;
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
                    var attribute = new ElementsBlockAttrib(buffer, vertexAttrib.chunkSize, false, 0, 0);
                    attributes.put(name_1, attribute);
                    attribute.release();
                    buffer.unbind();
                    buffer.release();
                }
                // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                var drawCommand = new GeometryDataCommand(primitive.mode, primitive.indices.length, gl.UNSIGNED_SHORT, 0);
                var block = new ElementsBlock(indexBuffer, attributes, drawCommand);
                _blocks.put(mesh.uuid, block);
                block.release();
                attributes.release();
                indexBuffer.release();
                return mesh;
            },
            start: function (canvas, canvasId) {
                if (canvasId === void 0) { canvasId = 0; }
                var alreadyStarted = isDefined(_canvas);
                if (!alreadyStarted) {
                    // cache the arguments
                    _canvas = canvas;
                    _canvasId = canvasId;
                }
                else {
                    // We'll assert that if we have a canvas element then we should have a canvas id.
                    mustBeInteger('_canvasId', _canvasId);
                    // We'll just be idempotent and ignore the call because we've already been started.
                    // To use the canvas might conflict with one we have dynamically created.
                    if (core.verbose) {
                        console.warn("Ignoring `start()` because already started.");
                    }
                    return;
                }
                // What if we were given a "no-op" canvasBuilder that returns undefined for the canvas.
                // To not complain is the way of the hyper-functional warrior.
                if (isDefined(_canvas)) {
                    gl = initWebGL(_canvas, attributes);
                    users.forEach(function (user) {
                        kahuna.synchronize(user);
                    });
                    _canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                    _canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                }
            },
            stop: function () {
                if (isDefined(_canvas)) {
                    _canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                    _canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
                    if (gl) {
                        if (gl.isContextLost()) {
                            users.forEach(function (user) { user.contextLost(_canvasId); });
                        }
                        else {
                            users.forEach(function (user) { user.contextFree(_canvasId); });
                        }
                        gl = void 0;
                    }
                    _canvas = void 0;
                    _canvasId = void 0;
                }
            },
            addContextListener: function (user) {
                addContextListener(user);
            },
            removeContextListener: function (user) {
                removeContextListener(user);
            },
            synchronize: function (user) {
                synchronize(user);
            },
            get canvas() {
                if (!_canvas) {
                    // Interesting little side-effect!
                    // Love the way kahuna talks in the third person.
                    kahuna.start(document.createElement('canvas'), randumbInteger());
                }
                return _canvas;
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
                    _blocks.release();
                    while (users.length > 0) {
                        var user = users.pop();
                    }
                }
                return refCount;
            },
            createArrayBuffer: function () {
                // TODO: Replace with functional constructor pattern?
                return new BufferResource(kahuna, false);
            },
            createElementArrayBuffer: function () {
                // TODO: Replace with functional constructor pattern?
                // FIXME
                // It's a bit draconian to insist that there be a WegGLRenderingContext.
                // Especially whenthe BufferResource willl be listening for context coming and goings.
                // Let's be Hyper-Functional Warrior and let it go.
                // Only problem is, we don't know if we should be handling elements or attributes. No problem.
                return new BufferResource(kahuna, true);
            },
            createTexture2D: function () {
                // TODO: Replace with functional constructor pattern.
                // FIXME Does this mean that Texture only has one IContextMonitor?
                return new TextureResource([kahuna], mustBeContext(gl, 'createTexture2D()').TEXTURE_2D);
            },
            createTextureCubeMap: function () {
                // TODO: Replace with functional constructor pattern.
                return new TextureResource([kahuna], mustBeContext(gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
            }
        };
        kahuna.addRef();
        return kahuna;
    }
    return webgl;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/scene/ContextGL',["require", "exports", '../renderers/renderer', '../utils/contextProxy', '../core', '../checks/mustBeDefined', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, createRenderer, contextProxy, core, mustBeDefined, readOnly, Shareable) {
    function beHTMLCanvasElement() {
        return "be an HTMLCanvasElement";
    }
    var defaultCanvasBuilder = function () { return document.createElement('canvas'); };
    /**
     * @class ContextGL
     */
    var ContextGL = (function (_super) {
        __extends(ContextGL, _super);
        /**
         * @class ContextGL
         * @constructor
         * @param [attributes] {WebGLContextAttributes} Allow the context to be configured.
         * @beta
         */
        // FIXME: Move attributes to start()
        function ContextGL(attributes) {
            _super.call(this, 'ContextGL');
            this._kahuna = contextProxy(attributes);
            this._renderer = createRenderer();
            this._kahuna.addContextListener(this._renderer);
            this._kahuna.synchronize(this._renderer);
        }
        /**
         * @method destructor
         * return {void}
         * @protected
         */
        ContextGL.prototype.destructor = function () {
            this._kahuna.removeContextListener(this._renderer);
            this._kahuna.release();
            this._kahuna = void 0;
            this._renderer.release();
            this._renderer = void 0;
            _super.prototype.destructor.call(this);
        };
        /**
         * @method addContextListener
         * @param user {IContextConsumer}
         * @return {void}
         */
        ContextGL.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        Object.defineProperty(ContextGL.prototype, "canvas", {
            /**
             * @property canvas
             * @type {HTMLCanvasElement}
             */
            get: function () {
                return this._kahuna.canvas;
            },
            set: function (canvas) {
                this._kahuna.canvas = canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContextGL.prototype, "canvasId", {
            /**
             * @property canvasId
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._kahuna.canvasId;
            },
            set: function (unused) {
                // FIXME: DRY delegate to kahuna? Should give the same result.
                throw new Error(readOnly('canvasId').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContextGL.prototype, "commands", {
            /**
             * @property commands
             * @type {IUnknownArray}
             * @beta
             */
            get: function () {
                return this._renderer.commands;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
         * <p>
         * @method clearColor
         * @param red {number}
         * @param green {number}
         * @param blue {number}
         * @param alpha {number}
         * @return {void}
         */
        ContextGL.prototype.clearColor = function (red, green, blue, alpha) {
            return this._renderer.clearColor(red, green, blue, alpha);
        };
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        ContextGL.prototype.contextFree = function (canvasId) {
            return this._renderer.contextFree(canvasId);
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        ContextGL.prototype.contextGain = function (manager) {
            return this._renderer.contextGain(manager);
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        ContextGL.prototype.contextLost = function (canvasId) {
            this._renderer.contextLost(canvasId);
        };
        /**
         * @method createArrayBuffer
         * @return {IBuffer}
         */
        ContextGL.prototype.createArrayBuffer = function () {
            return this._kahuna.createArrayBuffer();
        };
        /**
         * @method createBufferGeometry
         * @param primitive {DrawPrimitive}
         * @param [usage] {number}
         * @return {IBufferGeometry}
         */
        ContextGL.prototype.createBufferGeometry = function (primitive, usage) {
            return this._kahuna.createBufferGeometry(primitive, usage);
        };
        /**
         * @method createElementArrayBuffer
         * @return {IBuffer}
         */
        ContextGL.prototype.createElementArrayBuffer = function () {
            return this._kahuna.createElementArrayBuffer();
        };
        /**
         * @method createTextureCubeMap
         * @return {ITextureCubeMap}
         */
        ContextGL.prototype.createTextureCubeMap = function () {
            return this._kahuna.createTextureCubeMap();
        };
        /**
         * @method createTexture2D
         * @return {ITexture2D}
         */
        ContextGL.prototype.createTexture2D = function () {
            return this._kahuna.createTexture2D();
        };
        /**
         * Turns off specific WebGL capabilities for this context.
         * @method disable
         * @param capability {Capability}
         * @return {void} This method does not return a value.
         */
        ContextGL.prototype.disable = function (capability) {
            return this._renderer.disable(capability);
        };
        /**
         * Turns on specific WebGL capabilities for this context.
         * @method enable
         * @param capability {Capability}
         * @return {void} This method does not return a value.
         */
        ContextGL.prototype.enable = function (capability) {
            return this._renderer.enable(capability);
        };
        Object.defineProperty(ContextGL.prototype, "gl", {
            /**
             * @property gl
             * @type {WebGLRenderingContext}
             * @readOnly
             */
            get: function () {
                return this._kahuna.gl;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method removeContextListener
         * @param user {IContextConsumer}
         * @return {void}
         */
        ContextGL.prototype.removeContextListener = function (user) {
            return this._kahuna.removeContextListener(user);
        };
        /**
         * Defines what part of the canvas will be used in rendering the drawing buffer.
         * @method viewport
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         * @return {void} This method does not return a value.
         */
        ContextGL.prototype.viewport = function (x, y, width, height) {
            return this._renderer.viewport(x, y, width, height);
        };
        /**
         * Initializes the WebGL context for the specified <code>canvas</code>.
         * @method start
         * @param canvas {HTMLCanvasElement} The HTML canvas element.
         * @param [canvasId] {number} An optional user-defined alias for the canvas when using multi-canvas.
         * @return {void}
         */
        ContextGL.prototype.start = function (canvas, canvasId) {
            // FIXME: DRY delegate to kahuna.
            if (!(canvas instanceof HTMLElement)) {
                if (core.verbose) {
                    console.warn("canvas must be an HTMLCanvasElement to start the context.");
                }
                return;
            }
            mustBeDefined('canvas', canvas);
            this._kahuna.start(canvas, canvasId);
        };
        /**
         * @method stop
         * @return {void}
         */
        ContextGL.prototype.stop = function () {
            return this._kahuna.stop();
        };
        /**
         * @method synchronize
         * @param user {IContextConsumer}
         * @return {void}
         */
        ContextGL.prototype.synchronize = function (user) {
            return this._kahuna.synchronize(user);
        };
        return ContextGL;
    })(Shareable);
    return ContextGL;
});

define('davinci-eight/math/CartesianE3',["require", "exports", '../checks/mustBeNumber', '../i18n/readOnly'], function (require, exports, mustBeNumber, readOnly) {
    var zero;
    var e1;
    var e2;
    var e3;
    /**
     * @class CartesianE3
     */
    var CartesianE3 = (function () {
        /**
         * A lightweight immutable type representing Cartesian coordinates (in Euclidean space).
         * @class CartesianE3
         * @constructor
         * @param x {number} The <em>x coordinate</em>.
         * @param y {number} The <em>y coordinate</em>.
         * @param z {number} The <em>z coordinate</em>.
         */
        function CartesianE3(x, y, z, areYouSure) {
            mustBeNumber('x', x);
            mustBeNumber('y', y);
            mustBeNumber('z', z);
            this.coordinates = [x, y, z];
            if (!areYouSure) {
                console.warn("Try constructing CartesianE3 from geometric static methods.");
            }
        }
        Object.defineProperty(CartesianE3.prototype, "x", {
            get: function () {
                return this.coordinates[0];
            },
            set: function (unused) {
                throw new Error(readOnly('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "y", {
            get: function () {
                return this.coordinates[1];
            },
            set: function (unused) {
                throw new Error(readOnly('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "z", {
            get: function () {
                return this.coordinates[2];
            },
            set: function (unused) {
                throw new Error(readOnly('z').message);
            },
            enumerable: true,
            configurable: true
        });
        CartesianE3.prototype.magnitude = function () {
            return Math.sqrt(this.squaredNorm());
        };
        CartesianE3.prototype.squaredNorm = function () {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return x * x + y * y + z * z;
        };
        Object.defineProperty(CartesianE3, "zero", {
            /**
             * @property zero
             * @type {CartesianE3}
             * @static
             */
            get: function () { return zero; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3, "e1", {
            /**
             * @property e1
             * @type {CartesianE3}
             * @static
             */
            get: function () { return e1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3, "e2", {
            /**
             * @property e2
             * @type {CartesianE3}
             * @static
             */
            get: function () { return e2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3, "e3", {
            /**
             * @property e3
             * @type {CartesianE3}
             * @static
             */
            get: function () { return e3; },
            enumerable: true,
            configurable: true
        });
        /**
         * @method fromVectorE3
         * @param vector {VectorE3}
         * @return {CartesianE3}
         * @static
         */
        CartesianE3.fromVectorE3 = function (vector) {
            return new CartesianE3(vector.x, vector.y, vector.z, true);
        };
        /**
         * @method direction
         * @param vector {VectorE3}
         * @return {CartesianE3}
         * @static
         */
        CartesianE3.direction = function (vector) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            var m = Math.sqrt(x * x + y * y + z * z);
            return new CartesianE3(x / m, y / m, z / m, true);
        };
        return CartesianE3;
    })();
    zero = new CartesianE3(0, 0, 0, true);
    e1 = new CartesianE3(1, 0, 0, true);
    e2 = new CartesianE3(0, 1, 0, true);
    e3 = new CartesianE3(0, 0, 1, true);
    return CartesianE3;
});

define('davinci-eight/geometries/Geometry',["require", "exports", '../math/CartesianE3', '../checks/mustBeBoolean', '../checks/mustBeObject'], function (require, exports, CartesianE3, mustBeBoolean, mustBeObject) {
    /**
     * @class Geometry
     */
    var Geometry = (function () {
        /**
         * @class Geometry
         * @constructor
         */
        function Geometry() {
            /**
             * @property _position
             * @type {CartesianE3}
             * @private
             */
            this._position = CartesianE3.zero;
            /**
             * @property useTextureCoords
             * @type {boolean}
             */
            this.useTextureCoords = false;
        }
        Object.defineProperty(Geometry.prototype, "position", {
            /**
             * <p>
             * The local `position` property used for geometry generation.
             * </p>
             * @property position
             * @type {CartesianE3}
             */
            get: function () {
                return this._position;
            },
            set: function (position) {
                this.setPosition(position);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {Geometry}
         * @chainable
         */
        Geometry.prototype.enableTextureCoords = function (enable) {
            mustBeBoolean('enable', enable);
            this.useTextureCoords = enable;
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return Geometry
         * @chainable
         */
        Geometry.prototype.setPosition = function (position) {
            mustBeObject('position', position);
            this._position = CartesianE3.fromVectorE3(position);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        Geometry.prototype.toPrimitives = function () {
            console.warn("Geometry.toPrimitives() must be implemented by derived classes.");
            return [];
        };
        return Geometry;
    })();
    return Geometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/SimplexGeometry',["require", "exports", '../math/Euclidean3', '../checks/mustBeBoolean', '../checks/mustBeInteger', '../geometries/Geometry', '../geometries/Simplex', '../core/Symbolic', '../geometries/simplicesToDrawPrimitive', '../geometries/simplicesToGeometryMeta', '../math/R1', '../math/R3'], function (require, exports, Euclidean3, mustBeBoolean, mustBeInteger, Geometry, Simplex, Symbolic, simplicesToDrawPrimitive, simplicesToGeometryMeta, R1, R3) {
    /**
     * @class SimplexGeometry
     * @extends Geometry
     */
    var SimplexGeometry = (function (_super) {
        __extends(SimplexGeometry, _super);
        /**
         * <p>
         * A list of simplices (data) with information about dimensionality and vertex properties (meta).
         * This class should be used as an abstract base or concrete class when constructing
         * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
         * </p>
         * @class SimplexGeometry
         * @constructor
         */
        function SimplexGeometry() {
            _super.call(this);
            /**
             * The geometry as a list of simplices.
             * A simplex, in the context of WebGL, will usually represent a triangle, line or point.
             * @property data
             * @type {Simplex[]}
             */
            this.data = [];
            /**
             * The dimensionality of the simplices in this geometry.
             * @property _k
             * @type {number}
             * @private
             */
            this._k = new R1([Simplex.TRIANGLE]);
            /**
             * Specifies the number of segments to use in curved directions.
             * @property curvedSegments
             * @type {number}
             * @beta
             */
            this.curvedSegments = 16;
            /**
             * Specifies the number of segments to use on flat surfaces.
             * @property flatSegments
             * @type {number}
             * @beta
             */
            this.flatSegments = 1;
            /**
             * <p>
             * Specifies that the geometry should set colors on vertex attributes
             * for visualizing orientation of triangles
             * </p>
             * @property orientationColors
             * @type {boolean}
             * @beta
             */
            this.orientationColors = false;
            // Force regenerate, even if derived classes don't call setModified.
            this._k.modified = true;
        }
        Object.defineProperty(SimplexGeometry.prototype, "k", {
            /**
             * <p>
             * The dimensionality of the simplices in this geometry.
             * </p>
             * <p>
             * The <code>k</code> parameter affects geometry generation.
             * </p>
             * <code>k</code> must be an integer.
             * @property k
             * @type {number}
             */
            get: function () {
                return this._k.x;
            },
            set: function (k) {
                this._k.x = mustBeInteger('k', k);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Used to regenerate the simplex data from geometry parameters.
         * This method should be implemented by the derived geometry class.
         * @method regenerate
         * @return {void}
         */
        SimplexGeometry.prototype.regenerate = function () {
            console.warn("`public regenerate(): void` method should be implemented in derived class.");
        };
        /**
         * Used to determine whether the geometry must be recalculated.
         * The base implementation is pessimistic and returns <code>true</code>.
         * This method should be implemented by the derived class to reduce frequent recalculation.
         * @method isModified
         * @return {boolean} if the parameters defining the geometry have been modified.
         */
        SimplexGeometry.prototype.isModified = function () {
            return this._k.modified;
        };
        /**
         * Sets the modification state of <code>this</code> instance.
         * Derived classes should override this method if they contain parameters which affect geometry calculation.
         * @method setModified
         * @param modified {boolean} The value that the modification state will be set to.
         * @return {SimplexGeometry} `this` instance.
         * @chainable
         */
        SimplexGeometry.prototype.setModified = function (modified) {
            mustBeBoolean('modified', modified);
            this._k.modified = modified;
            return this;
        };
        /**
         * <p>
         * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
         * </p>
         * <p>
         * The boundary operation converts simplices of dimension `n` to `n - 1`.
         * For example, triangles are converted to lines.
         * </p>
         *
         * @method boundary
         * @param [times] {number} Determines the number of times the boundary operation is applied to this instance.
         * @return {SimplexGeometry}
         */
        SimplexGeometry.prototype.boundary = function (times) {
            if (this.isModified()) {
                this.regenerate();
            }
            this.data = Simplex.boundary(this.data, times);
            return this.check();
        };
        /**
         * Updates the meta property of this instance to match the data.
         *
         * @method check
         * @return {SimplexGeometry}
         * @beta
         */
        // FIXME: Rename to something more suggestive.
        SimplexGeometry.prototype.check = function () {
            this.meta = simplicesToGeometryMeta(this.data);
            return this;
        };
        /**
         * <p>
         * Applies the subdivide operation to each Simplex in this instance the specified number of times.
         * </p>
         * <p>
         * The subdivide operation creates new simplices of the same dimension as the originals.
         * </p>
         *
         * @method subdivide
         * @param [times] {number} Determines the number of times the subdivide operation is applied to this instance.
         * @return {SimplexGeometry}
         */
        SimplexGeometry.prototype.subdivide = function (times) {
            if (this.isModified()) {
                this.regenerate();
            }
            this.data = Simplex.subdivide(this.data, times);
            this.check();
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {SimplexGeometry}
         * @chainable
         */
        SimplexGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        SimplexGeometry.prototype.toPrimitives = function () {
            if (this.isModified()) {
                this.regenerate();
            }
            this.check();
            return [simplicesToDrawPrimitive(this.data, this.meta)];
        };
        /**
         * @method mergeVertices
         * @param [precisionPonts = 4] {number}
         * @return {void}
         * @protected
         * @beta
         */
        SimplexGeometry.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("SimplexGeometry.mergeVertices not yet implemented");
        };
        /**
         * Convenience method for pushing attribute data as a triangular simplex
         * @method triangle
         * @param positions {R3[]}
         * @param normals {R3[]}
         * @param uvs {R2[]}
         * @return {number}
         * @beta
         */
        SimplexGeometry.prototype.triangle = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.TRIANGLE);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[2];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[2];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
            simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[2];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e2);
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e3);
            }
            return this.data.push(simplex);
        };
        /**
         * Convenience method for pushing attribute data as a line segment simplex
         * @method lineSegment
         * @param positions {R3[]}
         * @param normals {R3[]}
         * @param uvs {R2[]}
         * @return {number}
         */
        SimplexGeometry.prototype.lineSegment = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.LINE);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e2);
            }
            return this.data.push(simplex);
        };
        /**
         * Convenience method for pushing attribute data as a point simplex
         * @method point
         * @param positions {R3[]}
         * @param normals {R3[]}
         * @param uvs {R2[]}
         * @return {number}
         */
        SimplexGeometry.prototype.point = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.POINT);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1);
            }
            return this.data.push(simplex);
        };
        /**
         * Convenience method for pushing attribute data as an empty simplex
         * @method empty
         * @param positions {R3[]}
         * @param normals {R3[]}
         * @param uvs {R2[]}
         * @return {number}
         */
        SimplexGeometry.prototype.empty = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.EMPTY);
            return this.data.push(simplex);
        };
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {SimplexGeometry}
         */
        SimplexGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return SimplexGeometry;
    })(Geometry);
    return SimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/AxialSimplexGeometry',["require", "exports", '../math/CartesianE3', '../checks/mustBeObject', '../geometries/SimplexGeometry'], function (require, exports, CartesianE3, mustBeObject, SimplexGeometry) {
    /**
     * @class AxialSimplexGeometry
     * @extends SimplexGeometry
     */
    var AxialSimplexGeometry = (function (_super) {
        __extends(AxialSimplexGeometry, _super);
        /**
         * <p>
         * A geometry which has axial symmetry, giving it an <code>axis</code> property.
         * </p>
         * <p>
         * Calls the base class constructor.
         * Provides the <code>type</code> to the <code>SimplexGeometry</code> base class.
         * Makes a copy of the axis, normalizes the copy and initializes the <code>axis</axis> property.
         * </p>
         * @class AxialSimplexGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         */
        function AxialSimplexGeometry(axis) {
            _super.call(this);
            this.setAxis(axis);
        }
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {AxialSimplexGeometry}
         * @chainable
         */
        AxialSimplexGeometry.prototype.setAxis = function (axis) {
            mustBeObject('axis', axis);
            this.axis = CartesianE3.direction(axis);
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {AxialSimplexGeometry}
         * @chainable
         */
        AxialSimplexGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {AxialSimplexGeometry}
         * @chainable
         */
        AxialSimplexGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return AxialSimplexGeometry;
    })(SimplexGeometry);
    return AxialSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/AxialGeometry',["require", "exports", '../math/CartesianE3', '../geometries/Geometry', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/R3'], function (require, exports, CartesianE3, Geometry, mustBeNumber, mustBeObject, R3) {
    /**
     * @class AxialGeometry
     */
    var AxialGeometry = (function (_super) {
        __extends(AxialGeometry, _super);
        /**
         * @class AxialGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         * @param sliceStart [VectorE3] A direction, orthogonal to <code>axis</code>.
         */
        function AxialGeometry(axis, sliceStart) {
            _super.call(this);
            /**
             * @property _sliceAngle
             * @type {number}
             * @private
             */
            this._sliceAngle = 2 * Math.PI;
            this.setAxis(axis);
            if (sliceStart) {
                this.setSliceStart(sliceStart);
            }
            else {
                this.setSliceStart(R3.random().cross(axis));
            }
        }
        Object.defineProperty(AxialGeometry.prototype, "axis", {
            /**
             * @property axis
             * @type {CartesianE3}
             */
            get: function () {
                return this._axis;
            },
            set: function (axis) {
                this.setAxis(axis);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {AxialGeometry}
         * @chainable
         */
        AxialGeometry.prototype.setAxis = function (axis) {
            mustBeObject('axis', axis);
            this._axis = CartesianE3.direction(axis);
            this.setSliceStart(R3.random().cross(this._axis));
            return this;
        };
        Object.defineProperty(AxialGeometry.prototype, "sliceAngle", {
            /**
             * @property sliceAngle
             * @type {number}
             * @default 2 * Math.PI
             */
            get: function () {
                return this._sliceAngle;
            },
            set: function (sliceAngle) {
                mustBeNumber('sliceAngle', sliceAngle);
                this._sliceAngle = sliceAngle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AxialGeometry.prototype, "sliceStart", {
            /**
             * The (unit vector) direction of the start of the slice.
             * @property sliceStart
             * @type {CartesianE3}
             */
            get: function () {
                return this._sliceStart;
            },
            set: function (sliceStart) {
                this.setSliceStart(sliceStart);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {AxialGeometry}
         * @chainable
         */
        AxialGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        AxialGeometry.prototype.setSliceStart = function (sliceStart) {
            mustBeObject('sliceStart', sliceStart);
            this._sliceStart = CartesianE3.direction(sliceStart);
        };
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {AxialGeometry}
         */
        AxialGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return AxialGeometry;
    })(Geometry);
    return AxialGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/ConeGeometry',["require", "exports", '../geometries/AxialGeometry', '../topologies/GridTopology', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, AxialGeometry, GridTopology, Symbolic, R2, R3) {
    /**
     * @class ConeGeometry
     */
    var ConeGeometry = (function (_super) {
        __extends(ConeGeometry, _super);
        /**
         * @class ConeGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
         */
        function ConeGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            /**
             * @property radius
             * @type {number}
             */
            this.radius = 1;
            /**
             * @property height
             * @type {number}
             */
            this.height = 1;
            /**
             * @property thetaSegments
             * @type {number}
             */
            this.thetaSegments = 16;
        }
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {ConeGeometry}
         * @chainable
         */
        ConeGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {ConeGeometry}
         * @chainable
         */
        ConeGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method tPrimitives
         * @return {DrawPrimitive[]}
         */
        ConeGeometry.prototype.toPrimitives = function () {
            var topo = new GridTopology(this.thetaSegments, 1);
            var uLength = topo.uLength;
            var uSegments = uLength - 1;
            var vLength = topo.vLength;
            var vSegments = vLength - 1;
            var a = R3.copy(this.sliceStart).direction().scale(this.radius);
            var b = new R3().cross2(a, this.axis).direction().scale(this.radius);
            var h = R3.copy(this.axis).scale(this.height);
            for (var uIndex = 0; uIndex < uLength; uIndex++) {
                var u = uIndex / uSegments;
                var theta = this.sliceAngle * u;
                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);
                for (var vIndex = 0; vIndex < vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var position = new R3().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v);
                    var peak = R3.copy(h).sub(position);
                    var normal = new R3().cross2(peak, position).cross(peak).direction();
                    var vertex = topo.vertex(uIndex, vIndex);
                    vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position);
                    vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    if (this.useTextureCoords) {
                        vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v]);
                    }
                }
            }
            return [topo.toDrawPrimitive()];
        };
        ConeGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return ConeGeometry;
    })(AxialGeometry);
    return ConeGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CylinderGeometry',["require", "exports", '../geometries/AxialGeometry', '../topologies/GridTopology', '../math/SpinG3', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, AxialGeometry, GridTopology, SpinG3, Symbolic, R2, R3) {
    /**
     * @class CylinderGeometry
     */
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        /**
         * @class CylinderGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
         */
        function CylinderGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            /**
             * @property radius
             * @type {number}
             * @default 1
             */
            this.radius = 1;
            /**
             * @property height
             * @type {number}
             * @default 1
             */
            this.height = 1;
            /**
             * @property thetaSegments
             * @type {number}
             * @default 16
             */
            this.thetaSegments = 16;
        }
        CylinderGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        CylinderGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        CylinderGeometry.prototype.toPrimitives = function () {
            var uSegments = this.thetaSegments;
            var vSegments = 1;
            var topo = new GridTopology(uSegments, vSegments);
            var axis = this.axis;
            var generator = SpinG3.dual(axis);
            for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
                var u = uIndex / uSegments;
                var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
                for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var normal = R3.copy(this.sliceStart).rotate(rotor);
                    var position = normal.clone().scale(this.radius).add(this.axis, v * this.height);
                    var vertex = topo.vertex(uIndex, vIndex);
                    vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position);
                    vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    if (this.useTextureCoords) {
                        vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v]);
                    }
                }
            }
            return [topo.toDrawPrimitive()];
        };
        CylinderGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return CylinderGeometry;
    })(AxialGeometry);
    return CylinderGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/RingGeometry',["require", "exports", '../topologies/GridTopology', '../geometries/AxialGeometry', '../core/Symbolic', '../math/R2', '../math/G3'], function (require, exports, GridTopology, AxialGeometry, Symbolic, R2, G3) {
    /**
     * @class RingGeometry
     */
    var RingGeometry = (function (_super) {
        __extends(RingGeometry, _super);
        /**
         * @class RingGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
         */
        function RingGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            /**
             * @property innerRadius
             * @type {number}
             */
            this.innerRadius = 0;
            /**
             * @property outerRadius
             * @type {number}
             */
            this.outerRadius = 1;
            /**
             * @property thetaSegments
             * @type {number}
             */
            this.thetaSegments = 16;
        }
        /**
         * @method setAxis
         * @param axis
         * @return {RingGeometry}
         * @chainable
         */
        RingGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {RingGeometry}
         * @chainable
         */
        RingGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        RingGeometry.prototype.toPrimitives = function () {
            var uSegments = this.thetaSegments;
            var vSegments = 1;
            var topo = new GridTopology(uSegments, vSegments);
            var a = this.outerRadius;
            var b = this.innerRadius;
            var axis = G3.fromVector(this.axis);
            var start = G3.fromVector(this.sliceStart);
            var generator = new G3().dual(axis);
            for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
                var u = uIndex / uSegments;
                var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
                for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
                    var v = vIndex / vSegments;
                    var position = start.clone().rotate(rotor).scale(b + (a - b) * v);
                    var vertex = topo.vertex(uIndex, vIndex);
                    vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.addVector(this.position);
                    vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = axis;
                    if (this.useTextureCoords) {
                        vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v]);
                    }
                }
            }
            return [topo.toDrawPrimitive()];
        };
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {RingGeometry}
         * @chainable
         */
        RingGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return RingGeometry;
    })(AxialGeometry);
    return RingGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/ArrowGeometry',["require", "exports", '../geometries/ConeGeometry', '../geometries/CylinderGeometry', '../geometries/AxialGeometry', '../geometries/RingGeometry', '../math/R3'], function (require, exports, ConeGeometry, CylinderGeometry, AxialGeometry, RingGeometry, R3) {
    /**
     * @class ArrowGeometry
     */
    var ArrowGeometry = (function (_super) {
        __extends(ArrowGeometry, _super);
        /**
         * @class ArrowGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         * @param sliceStart [VectorE3] A direction, orthogonal to <code>axis</code>.
         */
        function ArrowGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            /**
             * @property heightCone
             * @type {number}
             */
            this.heightCone = 0.20;
            /**
             * @property radiusCone
             * @type {number}
             */
            this.radiusCone = 0.08;
            /**
             * @property radiusShaft
             * @type {number}
             */
            this.radiusShaft = 0.01;
            /**
             * @property thetaSegments
             * @type {number}
             */
            this.thetaSegments = 16;
        }
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {ArrowGeometry}
         * @chainable
         */
        ArrowGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {ArrowGeometry}
         * @chaninable
         */
        ArrowGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        ArrowGeometry.prototype.toPrimitives = function () {
            var heightShaft = 1 - this.heightCone;
            /**
             * The opposite direction to the axis.
             */
            var back = R3.copy(this.axis).scale(-1);
            /**
             * The neck is the place where the cone meets the shaft.
             */
            var neck = R3.copy(this.axis).scale(heightShaft).add(this.position);
            /**
             * The tail is the the position of the blunt end of the arrow.
             */
            var tail = R3.copy(this.position);
            var cone = new ConeGeometry(this.axis, this.sliceStart);
            cone.radius = this.radiusCone;
            cone.height = this.heightCone;
            cone.setPosition(neck);
            cone.axis = this.axis;
            cone.sliceAngle = this.sliceAngle;
            cone.thetaSegments = this.thetaSegments;
            cone.useTextureCoords = this.useTextureCoords;
            /**
             * The `disc` fills the space between the cone and the shaft.
             */
            var disc = new RingGeometry(back, this.sliceStart);
            disc.innerRadius = this.radiusShaft;
            disc.outerRadius = this.radiusCone;
            disc.setPosition(neck);
            disc.sliceAngle = -this.sliceAngle;
            disc.thetaSegments = this.thetaSegments;
            disc.useTextureCoords = this.useTextureCoords;
            /**
             * The `shaft` is the slim part of the arrow.
             */
            var shaft = new CylinderGeometry(this.axis, this.sliceStart);
            shaft.radius = this.radiusShaft;
            shaft.height = heightShaft;
            shaft.setPosition(tail);
            shaft.sliceAngle = this.sliceAngle;
            shaft.thetaSegments = this.thetaSegments;
            shaft.useTextureCoords = this.useTextureCoords;
            /**
             * The `plug` fills the end of the shaft.
             */
            var plug = new RingGeometry(back, this.sliceStart);
            plug.innerRadius = 0;
            plug.outerRadius = this.radiusShaft;
            plug.setPosition(tail);
            plug.sliceAngle = -this.sliceAngle;
            plug.thetaSegments = this.thetaSegments;
            plug.useTextureCoords = this.useTextureCoords;
            return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce(function (a, b) { return a.concat(b); }, []);
        };
        ArrowGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return ArrowGeometry;
    })(AxialGeometry);
    return ArrowGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/BarnSimplexGeometry',["require", "exports", '../geometries/computeFaceNormals', '../math/Euclidean3', '../geometries/SimplexGeometry', '../geometries/quadrilateral', '../geometries/Simplex', '../core/Symbolic', '../geometries/triangle', '../math/G3'], function (require, exports, computeFaceNormals, Euclidean3, SimplexGeometry, quad, Simplex, Symbolic, triangle, G3) {
    /**
     * @module EIGHT
     * @submodule geometries
     * @class BarnSimplexGeometry
     */
    var BarnSimplexGeometry = (function (_super) {
        __extends(BarnSimplexGeometry, _super);
        /**
         * A barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
         * @class BarnSimplexGeometry
         * @constructor
         */
        function BarnSimplexGeometry() {
            _super.call(this);
            // FIXME: decouple from Euclidean3
            this.a = G3.fromVector(Euclidean3.e1);
            this.b = G3.fromVector(Euclidean3.e2);
            this.c = G3.fromVector(Euclidean3.e3);
            this.regenerate();
        }
        BarnSimplexGeometry.prototype.isModified = function () {
            return this.a.modified || this.b.modified || this.c.modified || _super.prototype.isModified.call(this);
        };
        BarnSimplexGeometry.prototype.setModified = function (modified) {
            this.a.modified = modified;
            this.b.modified = modified;
            this.c.modified = modified;
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        BarnSimplexGeometry.prototype.regenerate = function () {
            this.setModified(false);
            // FIXME: R3 would probably work fine here.
            var points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (index) { return void 0; });
            // Define the anchor points relative to the origin.
            points[0] = new G3().sub(this.a).sub(this.b).sub(this.c).divByScalar(2);
            points[1] = new G3().add(this.a).sub(this.b).sub(this.c).divByScalar(2);
            points[6] = new G3().add(this.a).sub(this.b).add(this.c).divByScalar(2);
            points[5] = new G3().sub(this.a).sub(this.b).add(this.c).divByScalar(2);
            points[4] = new G3().copy(points[0]).add(this.b);
            points[2] = new G3().copy(points[1]).add(this.b);
            points[7] = new G3().copy(points[6]).add(this.b);
            points[9] = new G3().copy(points[5]).add(this.b);
            points[3] = G3.lerp(points[4], points[2], 0.5).scale(2).add(this.b).divByScalar(2);
            points[8] = G3.lerp(points[7], points[9], 0.5).scale(2).add(this.b).divByScalar(2);
            // Translate the points according to the position.
            var position = G3.fromVector(this.position);
            points = points.map(function (point) { return point.add(position); });
            function simplex(indices) {
                var simplex = new Simplex(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    // Why does this work? It's because of dataFromVectorN
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = points[indices[i]];
                }
                return simplex;
            }
            switch (this.k) {
                case 0:
                    {
                        var simplices = points.map(function (point) {
                            var simplex = new Simplex(0);
                            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = point;
                            return simplex;
                        });
                        this.data = simplices;
                    }
                    break;
                case 1:
                    {
                        var lines = [[0, 1], [1, 6], [6, 5], [5, 0], [1, 2], [6, 7], [5, 9], [0, 4], [4, 3], [3, 2], [9, 8], [8, 7], [9, 4], [8, 3], [7, 2]];
                        this.data = lines.map(function (line) { return simplex(line); });
                    }
                    break;
                case 2:
                    {
                        var faces = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (index) { return void 0; });
                        faces[0] = quad(points[0], points[5], points[9], points[4]);
                        faces[1] = quad(points[3], points[4], points[9], points[8]);
                        faces[2] = quad(points[2], points[3], points[8], points[7]);
                        faces[3] = quad(points[1], points[2], points[7], points[6]);
                        faces[4] = quad(points[0], points[1], points[6], points[5]);
                        faces[5] = quad(points[5], points[6], points[7], points[9]);
                        faces[6] = quad(points[0], points[4], points[2], points[1]);
                        faces[7] = triangle(points[9], points[7], points[8]);
                        faces[8] = triangle(points[2], points[4], points[3]);
                        this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);
                        this.data.forEach(function (simplex) {
                            computeFaceNormals(simplex);
                        });
                    }
                    break;
                default: {
                }
            }
            // Compute the meta data.
            this.check();
        };
        return BarnSimplexGeometry;
    })(SimplexGeometry);
    return BarnSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/SliceSimplexGeometry',["require", "exports", '../geometries/AxialSimplexGeometry', '../checks/isDefined', '../checks/mustBeNumber', '../math/R3'], function (require, exports, AxialSimplexGeometry, isDefined, mustBeNumber, R3) {
    function perpendicular(axis) {
        return R3.random().cross(axis).direction();
    }
    /**
     * @class SliceSimplexGeometry
     * @extends AxialSimplexGeometry
     */
    var SliceSimplexGeometry = (function (_super) {
        __extends(SliceSimplexGeometry, _super);
        /**
         * <p>
         * Calls the base class constructor.
         * </p>
         * <p>
         * Provides the <code>axis</code> to the <code>AxialSimplexGeometry</code> base class.
         * </p>
         * <p>
         * Provides the <code>type</code> to the <code>AxialSimplexGeometry</code> base class.
         * </p>
         * @class SliceSimplexGeometry
         * @constructor
         * @param [axis = e3] {VectorE3} The <code>axis</code> property.
         * @param [sliceStart] {VectorE3} The <code>sliceStart</code> property.
         * @param [sliceAngle = 2 * Math.PI] {number} The <code>sliceAngle</code> property.
         */
        function SliceSimplexGeometry(axis, sliceStart, sliceAngle) {
            if (axis === void 0) { axis = R3.e3; }
            if (sliceAngle === void 0) { sliceAngle = 2 * Math.PI; }
            _super.call(this, axis);
            /**
             * <p>
             * The angle of the slice, measured in radians.
             * </p>
             * @property sliceAngle
             * @type {number}
             */
            this.sliceAngle = 2 * Math.PI;
            if (isDefined(sliceStart)) {
                // TODO: Verify that sliceStart is orthogonal to axis.
                this.sliceStart = R3.copy(sliceStart).direction();
            }
            else {
                this.sliceStart = perpendicular(this.axis);
            }
            this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        }
        return SliceSimplexGeometry;
    })(AxialSimplexGeometry);
    return SliceSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/ConeSimplexGeometry',["require", "exports", '../math/Euclidean3', '../geometries/SliceSimplexGeometry', '../math/R2', '../math/R3'], function (require, exports, Euclidean3, SliceSimplexGeometry, R2, R3) {
    /**
     * @class ConeSimplexGeometry
     * @extends SliceSimplexGeometry
     */
    var ConeSimplexGeometry = (function (_super) {
        __extends(ConeSimplexGeometry, _super);
        /**
         * @class ConeSimplexGeometry
         * @constructor
         * @param [radiusTop = 0.5] {number}
         * @param [radius = 0.5] {number}
         * @param [height = 1] {number}
         * @param [openTop = false] {boolean}
         * @param [openBottom = false] {boolean}
         * @param [thetaStart = 0] {number}
         */
        function ConeSimplexGeometry(radius, height, axis, radiusTop, openTop, openBottom, thetaStart) {
            if (radius === void 0) { radius = 0.5; }
            if (height === void 0) { height = 1; }
            if (radiusTop === void 0) { radiusTop = 0.0; }
            if (openTop === void 0) { openTop = false; }
            if (openBottom === void 0) { openBottom = false; }
            if (thetaStart === void 0) { thetaStart = 0; }
            _super.call(this, axis, void 0, void 0);
            this.radiusTop = radiusTop;
            this.radius = radius;
            this.height = height;
            this.openTop = openTop;
            this.openBottom = openBottom;
            this.thetaStart = thetaStart;
        }
        ConeSimplexGeometry.prototype.regenerate = function () {
            var radiusBottom = this.radius;
            var radiusTop = this.radiusTop;
            var height = this.height;
            var heightSegments = this.flatSegments;
            var radialSegments = this.curvedSegments;
            var openTop = this.openTop;
            var openBottom = this.openBottom;
            var thetaStart = this.thetaStart;
            var sliceAngle = this.sliceAngle;
            var heightHalf = height / 2;
            var x;
            var y;
            var points = [];
            var vertices = [];
            var uvs = [];
            for (y = 0; y <= heightSegments; y++) {
                var verticesRow = [];
                var uvsRow = [];
                var v = y / heightSegments;
                var radius = v * (radiusBottom - radiusTop) + radiusTop;
                for (x = 0; x <= radialSegments; x++) {
                    var u = x / radialSegments;
                    var vertex = new R3();
                    vertex.x = radius * Math.sin(u * sliceAngle + thetaStart);
                    vertex.y = -v * height + heightHalf;
                    vertex.z = radius * Math.cos(u * sliceAngle + thetaStart);
                    points.push(vertex);
                    verticesRow.push(points.length - 1);
                    uvsRow.push(new R2([u, 1 - v]));
                }
                vertices.push(verticesRow);
                uvs.push(uvsRow);
            }
            var tanTheta = (radiusBottom - radiusTop) / height;
            var na;
            var nb;
            for (x = 0; x < radialSegments; x++) {
                if (radiusTop !== 0) {
                    na = R3.copy(points[vertices[0][x]]);
                    nb = R3.copy(points[vertices[0][x + 1]]);
                }
                else {
                    na = R3.copy(points[vertices[1][x]]);
                    nb = R3.copy(points[vertices[1][x + 1]]);
                }
                na.setY(Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta).direction();
                nb.setY(Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta).direction();
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
                    this.triangle([points[v1], points[v2], points[v4]], [n1, n2, n4], [uv1, uv2, uv4]);
                    this.triangle([points[v2], points[v3], points[v4]], [n2.clone(), n3, n4.clone()], [uv2.clone(), uv3, uv4.clone()]);
                }
            }
            // top cap
            if (!openTop && radiusTop > 0) {
                points.push(R3.copy(Euclidean3.e2).scale(heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[0][x];
                    var v2 = vertices[0][x + 1];
                    var v3 = points.length - 1;
                    var n1 = R3.copy(Euclidean3.e2);
                    var n2 = R3.copy(Euclidean3.e2);
                    var n3 = R3.copy(Euclidean3.e2);
                    var uv1 = uvs[0][x].clone();
                    var uv2 = uvs[0][x + 1].clone();
                    var uv3 = new R2([uv2.x, 0]);
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            // bottom cap
            if (!openBottom && radiusBottom > 0) {
                points.push(R3.copy(Euclidean3.e2).scale(-heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[heightSegments][x + 1];
                    var v2 = vertices[heightSegments][x];
                    var v3 = points.length - 1;
                    var n1 = R3.copy(Euclidean3.e2).scale(-1);
                    var n2 = R3.copy(Euclidean3.e2).scale(-1);
                    var n3 = R3.copy(Euclidean3.e2).scale(-1);
                    var uv1 = uvs[heightSegments][x + 1].clone();
                    var uv2 = uvs[heightSegments][x].clone();
                    var uv3 = new R2([uv2.x, 1]);
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
        };
        return ConeSimplexGeometry;
    })(SliceSimplexGeometry);
    return ConeSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CuboidGeometry',["require", "exports", '../math/Euclidean3', '../topologies/GridTopology', '../geometries/Geometry', '../checks/mustBeNumber', '../math/R3', '../core/Symbolic', '../math/R2'], function (require, exports, Euclidean3, GridTopology, Geometry, mustBeNumber, R3, Symbolic, R2) {
    function side(basis, uSegments, vSegments) {
        var normal = R3.copy(basis[0]).cross(basis[1]).direction();
        var aNeg = R3.copy(basis[0]).scale(-0.5);
        var aPos = R3.copy(basis[0]).scale(+0.5);
        var bNeg = R3.copy(basis[1]).scale(-0.5);
        var bPos = R3.copy(basis[1]).scale(+0.5);
        var cPos = R3.copy(basis[2]).scale(+0.5);
        var side = new GridTopology(uSegments, vSegments);
        for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
            for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
                var u = uIndex / uSegments;
                var v = vIndex / vSegments;
                var a = R3.copy(aNeg).lerp(aPos, u);
                var b = R3.copy(bNeg).lerp(bPos, v);
                var vertex = side.vertex(uIndex, vIndex);
                vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = R3.copy(a).add(b).add(cPos);
                vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v]);
            }
        }
        return side;
    }
    /**
     * @class CuboidGeometry
     */
    var CuboidGeometry = (function (_super) {
        __extends(CuboidGeometry, _super);
        /**
         * @class CuboidGeometry
         * @constructor
         */
        function CuboidGeometry() {
            _super.call(this);
            this.iSegments = 1;
            this.jSegments = 1;
            this.kSegments = 1;
            this._a = R3.copy(Euclidean3.e1);
            this._b = R3.copy(Euclidean3.e2);
            this._c = R3.copy(Euclidean3.e3);
            this.sides = [];
        }
        Object.defineProperty(CuboidGeometry.prototype, "width", {
            /**
             * @property width
             * @type {number}
             */
            get: function () {
                return this._a.magnitude();
            },
            set: function (width) {
                mustBeNumber('width', width);
                this._a.direction().scale(width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "height", {
            /**
             * @property height
             * @type {number}
             */
            get: function () {
                return this._b.magnitude();
            },
            set: function (height) {
                mustBeNumber('height', height);
                this._b.direction().scale(height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "depth", {
            /**
             * @property depth
             * @type {number}
             */
            get: function () {
                return this._c.magnitude();
            },
            set: function (depth) {
                mustBeNumber('depth', depth);
                this._c.direction().scale(depth);
            },
            enumerable: true,
            configurable: true
        });
        CuboidGeometry.prototype.regenerate = function () {
            this.sides = [];
            // front
            this.sides.push(side([this._a, this._b, this._c], this.iSegments, this.jSegments));
            // right
            this.sides.push(side([R3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
            // left
            this.sides.push(side([this._c, this._b, R3.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
            // back
            this.sides.push(side([R3.copy(this._a).scale(-1), this._b, R3.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
            // top
            this.sides.push(side([this._a, R3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
            // bottom
            this.sides.push(side([this._a, this._c, R3.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {CuboidGeometry}
         */
        CuboidGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        CuboidGeometry.prototype.toPrimitives = function () {
            this.regenerate();
            return this.sides.map(function (side) { return side.toDrawPrimitive(); });
        };
        CuboidGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return CuboidGeometry;
    })(Geometry);
    return CuboidGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CuboidSimplexGeometry',["require", "exports", '../math/CartesianE3', '../geometries/computeFaceNormals', '../geometries/SimplexGeometry', '../geometries/quadrilateral', '../geometries/Simplex', '../core/Symbolic', '../math/R1', '../math/R3'], function (require, exports, CartesianE3, computeFaceNormals, SimplexGeometry, quad, Simplex, Symbolic, R1, R3) {
    /**
     * @class CuboidSimplexGeometry
     * @extends SimplexGeometry
     */
    var CuboidSimplexGeometry = (function (_super) {
        __extends(CuboidSimplexGeometry, _super);
        /**
         * <p>
         * The <code>CuboidSimplexGeometry</code> generates simplices representing a cuboid, or more precisely a parallelepiped.
         * The parallelepiped is parameterized by the three vectors <b>a</b>, <b>b</b>, and <b>c</b>.
         * The property <code>k</code> represents the dimensionality of the vertices.
         * The default settings create a unit cube centered at the origin.
         * </p>
         * @class CuboidSimplexGeometry
         * @constructor
         * @param [a = e1] {VectorE3}
         * @param [b = e2] {VectorE3}
         * @param [c = e3] {VectorE3}
         * @param [k = Simplex.TRIANGLE] {number}
         * @param [subdivide = 0] {number = 0}
         * @param [boundary = 0] {number}
         * @example
             var geometry = new EIGHT.CuboidSimplexGeometry();
             var primitive = geometry.toDrawPrimitive();
             var material = new EIGHT.MeshMaterial();
             var cube = new EIGHT.Drawable([primitive], material);
         */
        function CuboidSimplexGeometry(a, b, c, k, subdivide, boundary) {
            if (a === void 0) { a = CartesianE3.e1; }
            if (b === void 0) { b = CartesianE3.e2; }
            if (c === void 0) { c = CartesianE3.e3; }
            if (k === void 0) { k = Simplex.TRIANGLE; }
            if (subdivide === void 0) { subdivide = 0; }
            if (boundary === void 0) { boundary = 0; }
            _super.call(this);
            /**
             * Used to mark the parameters of this object dirty when they are possibly shared.
             * @property _isModified
             * @type {boolean}
             * @private
             */
            this._isModified = true;
            this._a = CartesianE3.fromVectorE3(a);
            this._b = CartesianE3.fromVectorE3(b);
            this._c = CartesianE3.fromVectorE3(c);
            this.k = k;
            this.subdivide(subdivide);
            this.boundary(boundary);
            this.regenerate();
        }
        Object.defineProperty(CuboidSimplexGeometry.prototype, "a", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e1.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property a
             * @type {CartesianE3}
             */
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
        Object.defineProperty(CuboidSimplexGeometry.prototype, "b", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e2.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property b
             * @type {CartesianE3}
             */
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
        Object.defineProperty(CuboidSimplexGeometry.prototype, "c", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e3.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property c
             * @type {CartesianE3}
             */
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
        CuboidSimplexGeometry.prototype.isModified = function () {
            return this._isModified || _super.prototype.isModified.call(this);
        };
        /**
         * @method setModified
         * @param modified {boolean} The value that the modification state will be set to.
         * @return {CuboidSimplexGeometry} `this` instance.
         */
        CuboidSimplexGeometry.prototype.setModified = function (modified) {
            this._isModified = modified;
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        /**
         * regenerate the geometry based upon the current parameters.
         * @method regenerate
         * @return {void}
         */
        CuboidSimplexGeometry.prototype.regenerate = function () {
            this.setModified(false);
            // Define the anchor points relative to the origin.
            var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function (index) { return void 0; });
            pos[0] = new R3().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
            pos[1] = new R3().add(this._a).sub(this._b).add(this._c).divByScalar(2);
            pos[2] = new R3().add(this._a).add(this._b).add(this._c).divByScalar(2);
            pos[3] = new R3().sub(this._a).add(this._b).add(this._c).divByScalar(2);
            pos[4] = new R3().copy(pos[3]).sub(this._c);
            pos[5] = new R3().copy(pos[2]).sub(this._c);
            pos[6] = new R3().copy(pos[1]).sub(this._c);
            pos[7] = new R3().copy(pos[0]).sub(this._c);
            // Translate the points according to the position.
            var position = this.position;
            pos.forEach(function (point) {
                point.add(position);
            });
            function simplex(indices) {
                var simplex = new Simplex(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]];
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_GEOMETRY_INDEX] = new R1([i]);
                }
                return simplex;
            }
            switch (this.k) {
                case 0:
                    {
                        var points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                        this.data = points.map(function (point) { return simplex(point); });
                    }
                    break;
                case 1:
                    {
                        var lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                        this.data = lines.map(function (line) { return simplex(line); });
                    }
                    break;
                case 2:
                    {
                        var faces = [0, 1, 2, 3, 4, 5].map(function (index) { return void 0; });
                        faces[0] = quad(pos[0], pos[1], pos[2], pos[3]);
                        faces[1] = quad(pos[1], pos[6], pos[5], pos[2]);
                        faces[2] = quad(pos[7], pos[0], pos[3], pos[4]);
                        faces[3] = quad(pos[6], pos[7], pos[4], pos[5]);
                        faces[4] = quad(pos[3], pos[2], pos[5], pos[4]);
                        faces[5] = quad(pos[7], pos[6], pos[1], pos[0]);
                        this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);
                        this.data.forEach(function (simplex) {
                            computeFaceNormals(simplex);
                        });
                    }
                    break;
                default: {
                }
            }
            // Compute the meta data.
            this.check();
        };
        return CuboidSimplexGeometry;
    })(SimplexGeometry);
    return CuboidSimplexGeometry;
});

define('davinci-eight/geometries/arc3',["require", "exports", '../checks/mustBeDefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../math/SpinG3', '../math/R3'], function (require, exports, mustBeDefined, mustBeInteger, mustBeNumber, SpinG3, R3) {
    /**
     * Computes a list of points corresponding to an arc centered on the origin.
     * param begin {VectorE3} The begin position.
     * param angle: {number} The angle of the rotation.
     * param generator {SpinorE3} The generator of the rotation.
     * param segments {number} The number of segments.
     */
    function arc3(begin, angle, generator, segments) {
        mustBeDefined('begin', begin);
        mustBeNumber('angle', angle);
        mustBeDefined('generator', generator);
        mustBeInteger('segments', segments);
        /**
         * The return value is an array of points with length => segments + 1.
         */
        var points = [];
        /**
         * Temporary point that we will advance for each segment.
         */
        var point = R3.copy(begin);
        /**
         * The rotor that advances us through one segment.
         */
        var rotor = SpinG3.copy(generator).scale((-angle / 2) / segments).exp();
        points.push(point.clone());
        for (var i = 0; i < segments; i++) {
            point.rotate(rotor);
            points.push(point.clone());
        }
        return points;
    }
    return arc3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/CylinderSimplexGeometry',["require", "exports", '../geometries/arc3', '../geometries/SliceSimplexGeometry', '../math/SpinG3', '../math/R2', '../math/R3'], function (require, exports, arc3, SliceSimplexGeometry, SpinG3, R2, R3) {
    // TODO: The caps don't have radial segments!
    function computeVertices(radius, height, axis, start, angle, generator, heightSegments, thetaSegments, points, vertices, uvs) {
        var begin = R3.copy(start).scale(radius);
        var halfHeight = R3.copy(axis).scale(0.5 * height);
        /**
         * A displacement in the direction of axis that we must move for each height step.
         */
        var stepH = R3.copy(axis).direction().scale(height / heightSegments);
        for (var i = 0; i <= heightSegments; i++) {
            /**
             * The displacement to the current level.
             */
            var dispH = R3.copy(stepH).scale(i).sub(halfHeight);
            var verticesRow = [];
            var uvsRow = [];
            /**
             * Interesting that the v coordinate is 1 at the base and 0 at the top!
             * This is because i originally went from top to bottom.
             */
            var v = (heightSegments - i) / heightSegments;
            /**
             * arcPoints.length => thetaSegments + 1
             */
            var arcPoints = arc3(begin, angle, generator, thetaSegments);
            /**
             * j < arcPoints.length => j <= thetaSegments
             */
            for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
                var point = arcPoints[j].add(dispH);
                /**
                 * u will vary from 0 to 1, because j goes from 0 to thetaSegments
                 */
                var u = j / thetaSegments;
                points.push(point);
                verticesRow.push(points.length - 1);
                uvsRow.push(new R2([u, v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }
    }
    /**
     * @class CylinderSimplexGeometry
     * @extends SliceSimplexGeometry
     */
    var CylinderSimplexGeometry = (function (_super) {
        __extends(CylinderSimplexGeometry, _super);
        /**
         * <p>
         * Constructs a Cylindrical Shell.
         * </p>
         * <p>
         * Sets the <code>sliceAngle</code> property to <code>2 * Math.PI</p>.
         * </p>
         * @class CylinderSimplexGeometry
         * @constructor
         * @param [radius = 1] {number}
         * @param [height = 1] {number}
         * @param axis [VectorE3 = R3.e2]
         * @param openTop [boolean = false]
         * @param openBottom [boolean = false]
         */
        function CylinderSimplexGeometry(radius, height, axis, openTop, openBottom) {
            if (radius === void 0) { radius = 1; }
            if (height === void 0) { height = 1; }
            if (axis === void 0) { axis = R3.e2; }
            if (openTop === void 0) { openTop = false; }
            if (openBottom === void 0) { openBottom = false; }
            _super.call(this, axis, void 0, void 0);
            this.radius = radius;
            this.height = height;
            this.openTop = openTop;
            this.openBottom = openBottom;
            this.setModified(true);
        }
        CylinderSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var radius = this.radius;
            //let height = this.height
            var heightSegments = this.flatSegments;
            var thetaSegments = this.curvedSegments;
            var generator = SpinG3.dual(this.axis);
            var heightHalf = this.height / 2;
            var points = [];
            // The double array allows us to manage the i,j indexing more naturally.
            // The alternative is to use an indexing function.
            var vertices = [];
            var uvs = [];
            computeVertices(radius, this.height, this.axis, this.sliceStart, this.sliceAngle, generator, heightSegments, thetaSegments, points, vertices, uvs);
            var na;
            var nb;
            // sides
            for (var j = 0; j < thetaSegments; j++) {
                if (radius !== 0) {
                    na = R3.copy(points[vertices[0][j]]);
                    nb = R3.copy(points[vertices[0][j + 1]]);
                }
                else {
                    na = R3.copy(points[vertices[1][j]]);
                    nb = R3.copy(points[vertices[1][j + 1]]);
                }
                // FIXME: This isn't geometric.
                na.setY(0).direction();
                nb.setY(0).direction();
                for (var i = 0; i < heightSegments; i++) {
                    /**
                     *  2-------3
                     *  |       |
                     *  |       |
                     *  |       |
                     *  1-------4
                     */
                    var v1 = vertices[i][j];
                    var v2 = vertices[i + 1][j];
                    var v3 = vertices[i + 1][j + 1];
                    var v4 = vertices[i][j + 1];
                    // The normals for 1 and 2 are the same.
                    // The normals for 3 and 4 are the same.
                    var n1 = na.clone();
                    var n2 = na.clone();
                    var n3 = nb.clone();
                    var n4 = nb.clone();
                    var uv1 = uvs[i][j].clone();
                    var uv2 = uvs[i + 1][j].clone();
                    var uv3 = uvs[i + 1][j + 1].clone();
                    var uv4 = uvs[i][j + 1].clone();
                    this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3]);
                    this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()]);
                }
            }
            // top cap
            if (!this.openTop && radius > 0) {
                // Push an extra point for the center of the top.
                points.push(R3.copy(this.axis).scale(heightHalf));
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[heightSegments][j + 1];
                    var v2 = points.length - 1;
                    var v3 = vertices[heightSegments][j];
                    var n1 = R3.copy(this.axis);
                    var n2 = R3.copy(this.axis);
                    var n3 = R3.copy(this.axis);
                    var uv1 = uvs[heightSegments][j + 1].clone();
                    // Check this
                    var uv2 = new R2([uv1.x, 1]);
                    var uv3 = uvs[heightSegments][j].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            // bottom cap
            if (!this.openBottom && radius > 0) {
                // Push an extra point for the center of the bottom.
                points.push(R3.copy(this.axis).scale(-heightHalf));
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[0][j];
                    var v2 = points.length - 1;
                    var v3 = vertices[0][j + 1];
                    var n1 = R3.copy(this.axis).scale(-1);
                    var n2 = R3.copy(this.axis).scale(-1);
                    var n3 = R3.copy(this.axis).scale(-1);
                    var uv1 = uvs[0][j].clone();
                    // TODO: Check this
                    var uv2 = new R2([uv1.x, 1]);
                    var uv3 = uvs[0][j + 1].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
            this.setModified(false);
        };
        return CylinderSimplexGeometry;
    })(SliceSimplexGeometry);
    return CylinderSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/PolyhedronSimplexGeometry',["require", "exports", '../math/Euclidean3', '../geometries/SimplexGeometry', '../geometries/Simplex', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, Euclidean3, SimplexGeometry, Simplex, Symbolic, R2, R3) {
    // Angle around the Y axis, counter-clockwise when looking from above.
    function azimuth(vector) {
        return Math.atan2(vector.z, -vector.x);
    }
    // Angle above the XZ plane.
    function inclination(pos) {
        return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
    }
    /**
     * Modifies the incoming point by projecting it onto the unit sphere.
     * Add the point to the array of points
     * Sets a hidden `index` property to the index in `points`
     * Computes the texture coordinates and sticks them in the hidden `uv` property as a R2.
     * OK!
     */
    function prepare(point, points) {
        var vertex = R3.copy(point).direction();
        points.push(vertex);
        // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
        var u = azimuth(point) / 2 / Math.PI + 0.5;
        var v = inclination(point) / Math.PI + 0.5;
        var something = vertex;
        something['uv'] = new R2([u, 1 - v]);
        return vertex;
    }
    // Texture fixing helper. Spheres have some odd behaviours.
    function correctUV(uv, vector, azimuth) {
        if ((azimuth < 0) && (uv.x === 1))
            uv = new R2([uv.x - 1, uv.y]);
        if ((vector.x === 0) && (vector.z === 0))
            uv = new R2([azimuth / 2 / Math.PI + 0.5, uv.y]);
        return uv.clone();
    }
    /**
     * @class PolyhedronSimplexGeometry
     * @extends SimplexGeometry
     */
    var PolyhedronSimplexGeometry = (function (_super) {
        __extends(PolyhedronSimplexGeometry, _super);
        /**
         * @class PolyhedronSimplexGeometry
         * @constructor
         *
         */
        function PolyhedronSimplexGeometry(vertices, indices, radius, detail) {
            if (radius === void 0) { radius = 1; }
            if (detail === void 0) { detail = 0; }
            _super.call(this);
            var that = this;
            var points = [];
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                prepare(new R3([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
            }
            var faces = [];
            for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
                var v1 = points[indices[i]];
                var v2 = points[indices[i + 1]];
                var v3 = points[indices[i + 2]];
                // FIXME: Using some modifications of the data structures given.
                // TODO: Optimize vector copies.
                var simplex = new Simplex(Simplex.TRIANGLE);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = v1;
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v1);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = v2;
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v2);
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = v3;
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v3);
                faces[j] = simplex;
            }
            for (var i = 0, facesLength = faces.length; i < facesLength; i++) {
                subdivide(faces[i], detail, points);
            }
            // Handle case when face straddles the seam
            /*
                for ( var i = 0, faceVertexUvsZeroLength = this.faceVertexUvs[ 0 ].length; i < faceVertexUvsZeroLength; i++ ) {
            
                  var uvs = this.faceVertexUvs[ 0 ][ i ];
            
                  var x0 = uvs[ 0 ].x;
                  var x1 = uvs[ 1 ].x;
                  var x2 = uvs[ 2 ].x;
            
                  var max = Math.max( x0, Math.max( x1, x2 ) );
                  var min = Math.min( x0, Math.min( x1, x2 ) );
            
                  if ( max > 0.9 && min < 0.1 ) { // 0.9 is somewhat arbitrary
            
                    if ( x0 < 0.2 ) uvs[ 0 ].x += 1;
                    if ( x1 < 0.2 ) uvs[ 1 ].x += 1;
                    if ( x2 < 0.2 ) uvs[ 2 ].x += 1;
            
                  }
            
                }
            */
            // Apply radius
            for (var i = 0, verticesLength = points.length; i < verticesLength; i++) {
                points[i].x *= radius;
                points[i].y *= radius;
                points[i].z *= radius;
            }
            // Merge vertices
            this.mergeVertices();
            //    this.computeFaceNormals();
            //    this.boundingSphere = new Sphere(new R3([0, 0, 0]), radius);
            function centroid(v1, v2, v3) {
                var x = (v1.x + v2.x + v3.x) / 3;
                var y = (v1.y + v2.y + v3.y) / 3;
                var z = (v1.z + v2.z + v3.z) / 3;
                return new Euclidean3(0, x, y, z, 0, 0, 0, 0);
            }
            // Approximate a curved face with recursively sub-divided triangles.
            function make(v1, v2, v3) {
                var azi = azimuth(centroid(v1, v2, v3));
                var something1 = v1;
                var something2 = v2;
                var something3 = v3;
                var uv1 = correctUV(something1['uv'], v1, azi);
                var uv2 = correctUV(something2['uv'], v2, azi);
                var uv3 = correctUV(something3['uv'], v3, azi);
                var simplex = new Simplex(Simplex.TRIANGLE);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = R3.copy(v1);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v1);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv1;
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = R3.copy(v2);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v2);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv2;
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = R3.copy(v3);
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v3);
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv3;
                that.data.push(simplex);
            }
            // Analytically subdivide a face to the required detail level.
            function subdivide(face, detail, points) {
                var cols = Math.pow(2, detail);
                var a = prepare(face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION], points);
                var b = prepare(face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION], points);
                var c = prepare(face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION], points);
                var v = [];
                // Construct all of the vertices for this subdivision.
                for (var i = 0; i <= cols; i++) {
                    v[i] = [];
                    var aj = prepare(R3.copy(a).lerp(c, i / cols), points);
                    var bj = prepare(R3.copy(b).lerp(c, i / cols), points);
                    var rows = cols - i;
                    for (var j = 0; j <= rows; j++) {
                        if (j == 0 && i == cols) {
                            v[i][j] = aj;
                        }
                        else {
                            v[i][j] = prepare(R3.copy(aj).lerp(bj, j / rows), points);
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
        }
        return PolyhedronSimplexGeometry;
    })(SimplexGeometry);
    return PolyhedronSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/DodecahedronSimplexGeometry',["require", "exports", '../geometries/PolyhedronSimplexGeometry'], function (require, exports, PolyhedronSimplexGeometry) {
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
    /**
     * @class DodecahedronSimplexGeometry
     * @extends PolyhedronSimplexGeometry
     */
    var DodecahedronSimplexGeometry = (function (_super) {
        __extends(DodecahedronSimplexGeometry, _super);
        /**
         * @class DodecahedronSimplexGeometry
         * @constructor
         * @param [radius] {number}
         * @param [detail] {number}
         */
        function DodecahedronSimplexGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return DodecahedronSimplexGeometry;
    })(PolyhedronSimplexGeometry);
    return DodecahedronSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/IcosahedronSimplexGeometry',["require", "exports", '../geometries/PolyhedronSimplexGeometry'], function (require, exports, PolyhedronSimplexGeometry) {
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
    /**
     * @class IcosahedronSimplexGeometry
     * @extends PolyhedronSimplexGeometry
     */
    var IcosahedronSimplexGeometry = (function (_super) {
        __extends(IcosahedronSimplexGeometry, _super);
        /**
         * @class OcosahedronGeometry
         * @constructor
         * @param [radius] {number}
         * @param [detail] {number}
         */
        function IcosahedronSimplexGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return IcosahedronSimplexGeometry;
    })(PolyhedronSimplexGeometry);
    return IcosahedronSimplexGeometry;
});

define('davinci-eight/checks/isFunction',["require", "exports"], function (require, exports) {
    function isFunction(x) {
        return (typeof x === 'function');
    }
    return isFunction;
});

define('davinci-eight/checks/mustBeFunction',["require", "exports", '../checks/mustSatisfy', '../checks/isFunction'], function (require, exports, mustSatisfy, isFunction) {
    function beFunction() {
        return "be a function";
    }
    function mustBeFunction(name, value, contextBuilder) {
        mustSatisfy(name, isFunction(value), beFunction, contextBuilder);
        return value;
    }
    return mustBeFunction;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/GridSimplexGeometry',["require", "exports", '../geometries/Simplex', '../geometries/SimplexGeometry', '../core/Symbolic', '../math/R2', '../math/R3', '../checks/mustBeFunction', '../checks/mustBeInteger'], function (require, exports, Simplex, SimplexGeometry, Symbolic, R2, R3, mustBeFunction, mustBeInteger) {
    /**
     * @class GridSimplexGeometry
     */
    var GridSimplexGeometry = (function (_super) {
        __extends(GridSimplexGeometry, _super);
        /**
         * @class GridSimplexGeometry
         * @constructor
         * @param parametricFunction {(u: number, v: number) => VectorE3}
         * @param uSegments {number}
         * @param vSegments {number}
         */
        function GridSimplexGeometry(parametricFunction, uSegments, vSegments) {
            _super.call(this);
            mustBeFunction('parametricFunction', parametricFunction);
            mustBeInteger('uSegments', uSegments);
            mustBeInteger('vSegments', vSegments);
            /**
             * Temporary array of points.
             */
            var points = [];
            var i;
            var j;
            var sliceCount = uSegments + 1;
            for (i = 0; i <= vSegments; i++) {
                var v = i / vSegments;
                for (j = 0; j <= uSegments; j++) {
                    var u = j / uSegments;
                    var point = parametricFunction(u, v);
                    // Make a copy just in case the function is returning mutable references.
                    points.push(R3.copy(point));
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
                    uva = new R2([j / uSegments, i / vSegments]);
                    uvb = new R2([(j + 1) / uSegments, i / vSegments]);
                    uvc = new R2([(j + 1) / uSegments, (i + 1) / vSegments]);
                    uvd = new R2([j / uSegments, (i + 1) / vSegments]);
                    var simplex = new Simplex(Simplex.TRIANGLE);
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a];
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uva;
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b];
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d];
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                    this.data.push(simplex);
                    var simplex = new Simplex(Simplex.TRIANGLE);
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b];
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c];
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvc;
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d];
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                    this.data.push(simplex);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
        }
        return GridSimplexGeometry;
    })(SimplexGeometry);
    return GridSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/KleinBottleSimplexGeometry',["require", "exports", '../geometries/GridSimplexGeometry', '../math/R3'], function (require, exports, GridSimplexGeometry, R3) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function klein(u, v) {
        var point = new R3();
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
        return point.scale(0.1);
    }
    /**
     * By connecting the edge of a Mobius Strip we get a Klein Bottle.
     * http://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html
     * @class KleinBottleSimplexGeometry
     * @extends GridSimplexGeometry
     */
    var KleinBottleSimplexGeometry = (function (_super) {
        __extends(KleinBottleSimplexGeometry, _super);
        /**
         * @class KleinBottleSimplexGeometry
         * @constructor
         * @param uSegments {number}
         * @param vSegments {number}
         */
        function KleinBottleSimplexGeometry(uSegments, vSegments) {
            _super.call(this, klein, uSegments, vSegments);
        }
        return KleinBottleSimplexGeometry;
    })(GridSimplexGeometry);
    return KleinBottleSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/Simplex1Geometry',["require", "exports", '../geometries/SimplexGeometry', '../geometries/Simplex', '../core/Symbolic', '../math/R3'], function (require, exports, SimplexGeometry, Simplex, Symbolic, R3) {
    //import VectorN = require('../math/VectorN')
    /**
     * @class Simplex1Geometry
     */
    var Simplex1Geometry = (function (_super) {
        __extends(Simplex1Geometry, _super);
        /**
         * @class Simplex1Geometry
         * @constructor
         */
        function Simplex1Geometry() {
            _super.call(this);
            this.head = new R3([1, 0, 0]);
            this.tail = new R3([0, 1, 0]);
            this.calculate();
        }
        Simplex1Geometry.prototype.calculate = function () {
            var pos = [0, 1].map(function (index) { return void 0; });
            pos[0] = this.tail;
            pos[1] = this.head;
            function simplex(indices) {
                var simplex = new Simplex(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]];
                }
                return simplex;
            }
            this.data = [[0, 1]].map(function (line) { return simplex(line); });
            // Compute the meta data.
            this.check();
        };
        return Simplex1Geometry;
    })(SimplexGeometry);
    return Simplex1Geometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/MobiusStripSimplexGeometry',["require", "exports", '../geometries/GridSimplexGeometry', '../math/R3'], function (require, exports, GridSimplexGeometry, R3) {
    var cos = Math.cos;
    var sin = Math.sin;
    var pi = Math.PI;
    function mobius(u, v) {
        var point = new R3([0, 0, 0]);
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
    var MobiusStripSimplexGeometry = (function (_super) {
        __extends(MobiusStripSimplexGeometry, _super);
        function MobiusStripSimplexGeometry(uSegments, vSegments) {
            _super.call(this, mobius, uSegments, vSegments);
        }
        return MobiusStripSimplexGeometry;
    })(GridSimplexGeometry);
    return MobiusStripSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/OctahedronSimplexGeometry',["require", "exports", '../geometries/PolyhedronSimplexGeometry'], function (require, exports, PolyhedronSimplexGeometry) {
    var vertices = [
        1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1
    ];
    var indices = [
        0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2
    ];
    /**
     * @class OctahedronSimplexGeometry
     * @extends PolyhedronSimplexGeometry
     */
    var OctahedronSimplexGeometry = (function (_super) {
        __extends(OctahedronSimplexGeometry, _super);
        /**
         * @class OctahedronSimplexGeometry
         * @constructor
         * @param [radius] {number}
         * @param [detail] {number}
         */
        function OctahedronSimplexGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return OctahedronSimplexGeometry;
    })(PolyhedronSimplexGeometry);
    return OctahedronSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/RevolutionSimplexGeometry',["require", "exports", '../geometries/SimplexGeometry', '../math/SpinG3', '../math/R2'], function (require, exports, SimplexGeometry, SpinG3, R2) {
    /**
     * @class RevolutionSimplexGeometry
     */
    var RevolutionSimplexGeometry = (function (_super) {
        __extends(RevolutionSimplexGeometry, _super);
        /**
         * @class RevolutionSimplexGeometry
         * @constructor
         */
        function RevolutionSimplexGeometry() {
            _super.call(this);
        }
        /**
         * @method revolve
         * @param points {R3[]}
         * @param generator {SpinG3}
         * @param segments {number}
         * @param phiStart {number}
         * @param phiLength {number}
         * @param attitude {SpinG3}
         */
        RevolutionSimplexGeometry.prototype.revolve = function (points, generator, segments, phiStart, phiLength, attitude) {
            if (segments === void 0) { segments = 12; }
            if (phiStart === void 0) { phiStart = 0; }
            if (phiLength === void 0) { phiLength = 2 * Math.PI; }
            /**
             * Temporary list of points.
             */
            var vertices = [];
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
            var R = new SpinG3();
            for (i = 0, il = halfPlanes; i < il; i++) {
                var φ = phiStart + i * phiStep;
                R.rotorFromGeneratorAngle(generator, φ);
                for (j = 0, jl = points.length; j < jl; j++) {
                    var vertex = points[j].clone();
                    // The generator tells us how to rotate the points.
                    vertex.rotate(R);
                    // The attitude tells us where we want the symmetry axis to be.
                    if (attitude) {
                        vertex.rotate(attitude);
                    }
                    vertices.push(vertex);
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
                    this.triangle([vertices[d], vertices[b], vertices[a]], [], [new R2([u0, v0]), new R2([u1, v0]), new R2([u0, v1])]);
                    this.triangle([vertices[d], vertices[c], vertices[b]], [], [new R2([u1, v0]), new R2([u1, v1]), new R2([u0, v1])]);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
        };
        return RevolutionSimplexGeometry;
    })(SimplexGeometry);
    return RevolutionSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/RingSimplexGeometry',["require", "exports", '../geometries/arc3', '../geometries/Simplex', '../geometries/SliceSimplexGeometry', '../math/SpinG3', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, arc3, Simplex, SliceSimplexGeometry, SpinG3, Symbolic, R2, R3) {
    // TODO: If the Ring is closed (angle = 2 * PI) then we get some redundancy at the join.
    // TODO: If the innerRadius is zero then the quadrilaterals have degenerate triangles.
    // TODO: May be more efficient to calculate points for the outer circle then scale them inwards.
    /**
     *
     */
    function computeVertices(a, b, axis, start, angle, generator, radialSegments, thetaSegments, vertices, uvs) {
        /**
         * `t` is the vector perpendicular to s in the plane of the ring.
         * We could use the generator an PI / 4 to calculate this or the cross product as here.
         */
        var perp = R3.copy(axis).cross(start);
        /**
         * The distance of the vertex from the origin and center.
         */
        var radius = b;
        var radiusStep = (a - b) / radialSegments;
        for (var i = 0; i < radialSegments + 1; i++) {
            var begin = R3.copy(start).scale(radius);
            var arcPoints = arc3(begin, angle, generator, thetaSegments);
            for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
                var arcPoint = arcPoints[j];
                vertices.push(arcPoint);
                // The coordinates vary between -a and +a, which we map to 0 and 1.
                uvs.push(new R2([(arcPoint.dot(start) / a + 1) / 2, (arcPoint.dot(perp) / a + 1) / 2]));
            }
            radius += radiusStep;
        }
    }
    /**
     * Our traversal will generate the following mapping into the vertices and uvs arrays.
     * This is standard for two looping variables.
     */
    function vertexIndex(i, j, thetaSegments) {
        return i * (thetaSegments + 1) + j;
    }
    function makeTriangles(vertices, uvs, axis, radialSegments, thetaSegments, geometry) {
        for (var i = 0; i < radialSegments; i++) {
            // Our traversal has resulted in the following formula for the index
            // into the vertices or uvs array
            // vertexIndex(i, j) => i * (thetaSegments + 1) + j
            /**
             * The index along the start radial line where j = 0. This is just index(i,0)
             */
            var startLineIndex = i * (thetaSegments + 1);
            for (var j = 0; j < thetaSegments; j++) {
                /**
                 * The index of the corner of the quadrilateral with the lowest value of i and j.
                 * This corresponds to the smallest radius and smallest angle counterclockwise.
                 */
                var quadIndex = startLineIndex + j;
                var v0 = quadIndex;
                var v1 = quadIndex + thetaSegments + 1; // Move outwards one segment.
                var v2 = quadIndex + thetaSegments + 2; // Then move one segment along the radius.
                geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [R3.copy(axis), R3.copy(axis), R3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
                v0 = quadIndex; // Start at the same corner
                v1 = quadIndex + thetaSegments + 2; // Move diagonally outwards and along radial
                v2 = quadIndex + 1; // Then move radially inwards
                geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [R3.copy(axis), R3.copy(axis), R3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
            }
        }
    }
    function makeLineSegments(vertices, radialSegments, thetaSegments, data) {
        for (var i = 0; i < radialSegments; i++) {
            for (var j = 0; j < thetaSegments; j++) {
                var simplex = new Simplex(Simplex.LINE);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j + 1, thetaSegments)];
                data.push(simplex);
                var simplex = new Simplex(Simplex.LINE);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, j, thetaSegments)];
                data.push(simplex);
            }
            // TODO: We probably don't need these lines when the thing is closed 
            var simplex = new Simplex(Simplex.LINE);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, thetaSegments, thetaSegments)];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, thetaSegments, thetaSegments)];
            data.push(simplex);
        }
        // Lines for the outermost circle.
        for (var j = 0; j < thetaSegments; j++) {
            var simplex = new Simplex(Simplex.LINE);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j, thetaSegments)];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j + 1, thetaSegments)];
            data.push(simplex);
        }
    }
    function makePoints(vertices, radialSegments, thetaSegments, data) {
        for (var i = 0; i <= radialSegments; i++) {
            for (var j = 0; j <= thetaSegments; j++) {
                var simplex = new Simplex(Simplex.POINT);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
                data.push(simplex);
            }
        }
    }
    function makeEmpty(vertices, radialSegments, thetaSegments, data) {
        for (var i = 0; i <= radialSegments; i++) {
            for (var j = 0; j <= thetaSegments; j++) {
                var simplex = new Simplex(Simplex.EMPTY);
                data.push(simplex);
            }
        }
    }
    /**
     * @class RingSimplexGeometry
     * @extends SliceSimplexGeometry
     */
    var RingSimplexGeometry = (function (_super) {
        __extends(RingSimplexGeometry, _super);
        /**
         * <p>
         * Creates an annulus with a single hole.
         * </p>
         * <p>
         * Sets the <code>sliceAngle</code> property to <code>2 * Math.PI</p>.
         * </p>
         * @class RingSimplexGeometry
         * @constructor
         * @param [a = 1] {number} The outer radius
         * @param [b = 0] {number} The inner radius
         * @param [axis] {VectorE3} The <code>axis</code> property.
         * @param [sliceStart] {VectorE3} The <code>sliceStart</code> property.
         * @param [sliceAngle] {number} The <code>sliceAngle</code> property.
         */
        function RingSimplexGeometry(a, b, axis, sliceStart, sliceAngle) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            _super.call(this, axis, sliceStart, sliceAngle);
            this.a = a;
            this.b = b;
        }
        /**
         * @method isModified
         * @return {boolean}
         */
        RingSimplexGeometry.prototype.isModified = function () {
            return _super.prototype.isModified.call(this);
        };
        /**
         * @method regenerate
         * @return {void}
         */
        RingSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var radialSegments = this.flatSegments;
            var thetaSegments = this.curvedSegments;
            var generator = SpinG3.dual(this.axis);
            var vertices = [];
            var uvs = [];
            computeVertices(this.a, this.b, this.axis, this.sliceStart, this.sliceAngle, generator, radialSegments, thetaSegments, vertices, uvs);
            switch (this.k) {
                case Simplex.EMPTY:
                    {
                        makeEmpty(vertices, radialSegments, thetaSegments, this.data);
                    }
                    break;
                case Simplex.POINT:
                    {
                        makePoints(vertices, radialSegments, thetaSegments, this.data);
                    }
                    break;
                case Simplex.LINE:
                    {
                        makeLineSegments(vertices, radialSegments, thetaSegments, this.data);
                    }
                    break;
                case Simplex.TRIANGLE:
                    {
                        makeTriangles(vertices, uvs, this.axis, radialSegments, thetaSegments, this);
                    }
                    break;
                default: {
                    console.warn(this.k + "-simplex is not supported for geometry generation.");
                }
            }
            this.setModified(false);
        };
        /**
         * @method setModified
         * @param modified {boolean}
         * @return {RingSimplexGeometry}
         * @chainable
         */
        RingSimplexGeometry.prototype.setModified = function (modified) {
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        return RingSimplexGeometry;
    })(SliceSimplexGeometry);
    return RingSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/SphericalPolarSimplexGeometry',["require", "exports", '../geometries/arc3', '../checks/mustBeNumber', '../math/R1', '../geometries/Simplex', '../geometries/SliceSimplexGeometry', '../math/SpinG3', '../math/R2', '../math/R3'], function (require, exports, arc3, mustBeNumber, R1, Simplex, SliceSimplexGeometry, SpinG3, R2, R3) {
    function computeVertices(radius, axis, phiStart, phiLength, thetaStart, thetaLength, heightSegments, widthSegments, points, uvs) {
        var generator = SpinG3.dual(axis);
        var iLength = heightSegments + 1;
        var jLength = widthSegments + 1;
        for (var i = 0; i < iLength; i++) {
            var v = i / heightSegments;
            var θ = thetaStart + v * thetaLength;
            var arcRadius = radius * Math.sin(θ);
            var begin = R3.copy(phiStart).scale(arcRadius);
            var arcPoints = arc3(begin, phiLength, generator, widthSegments);
            /**
             * Displacement that we need to add to each arc point to get the
             * distance position parallel to the axis correct.
             */
            var cosθ = Math.cos(θ);
            for (var j = 0; j < jLength; j++) {
                var u = j / widthSegments;
                var point = arcPoints[j].add(axis, cosθ);
                points.push(point);
                uvs.push(new R2([u, 1 - v]));
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
                // Form a quadrilateral. v0 through v3 give the indices into the points array.
                var v0 = vertexIndex(qIndex, 0, widthSegments);
                var v1 = vertexIndex(qIndex, 1, widthSegments);
                var v2 = vertexIndex(qIndex, 2, widthSegments);
                var v3 = vertexIndex(qIndex, 3, widthSegments);
                // The normal vectors for the sphere are simply the normalized position vectors.
                var n0 = R3.copy(points[v0]).direction();
                var n1 = R3.copy(points[v1]).direction();
                var n2 = R3.copy(points[v2]).direction();
                var n3 = R3.copy(points[v3]).direction();
                // Grab the uv coordinates too.
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                // Special case the north and south poles by only creating one triangle.
                // FIXME: What's the geometric equivalent here?
                if (false /*Math.abs(points[v0].y) === radius*/) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false /*Math.abs(points[v2].y) === radius*/) {
                    uv2.x = (uv2.x + uv3.x) / 2;
                    geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
                }
                else {
                    // The other patches create two triangles.
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
                // The normal vectors for the sphere are simply the normalized position vectors.
                var n0 = R3.copy(points[v0]).direction();
                var n1 = R3.copy(points[v1]).direction();
                var n2 = R3.copy(points[v2]).direction();
                var n3 = R3.copy(points[v3]).direction();
                // Grab the uv coordinates too.
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                // Special case the north and south poles by only creating one triangle.
                // FIXME: What's the geometric equivalent here?
                if (false /*Math.abs(points[v0].y) === radius*/) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false /*Math.abs(points[v2].y) === radius*/) {
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
                // The normal vectors for the sphere are simply the normalized position vectors.
                var n0 = R3.copy(points[v0]).direction();
                var n1 = R3.copy(points[v1]).direction();
                var n2 = R3.copy(points[v2]).direction();
                var n3 = R3.copy(points[v3]).direction();
                // Grab the uv coordinates too.
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                // Special case the north and south poles by only creating one triangle.
                // FIXME: What's the geometric equivalent here?
                if (false /*Math.abs(points[v0].y) === radius*/) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false /*Math.abs(points[v2].y) === radius*/) {
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
    /**
     * @class SphericalPolarSimplexGeometry
     * @extends SliceSimplexGeometry
     */
    var SphericalPolarSimplexGeometry = (function (_super) {
        __extends(SphericalPolarSimplexGeometry, _super);
        /**
         * Constructs a geometry consisting of triangular simplices based on spherical coordinates.
         * @class SphericalPolarSimplexGeometry
         * @constructor
         * @param [radius = 1] {number}
         * @param [axis] {VectorE3}
         * @param [phiStart] {vectorE3}
         * @param [phiLength = 2 * Math.PI] {number}
         * @param [thetaStart = 0] {number}
         * @param [thetaLength = Math.PI] {number}
         */
        function SphericalPolarSimplexGeometry(radius, axis, phiStart, phiLength, thetaStart, thetaLength) {
            if (radius === void 0) { radius = 1; }
            if (phiLength === void 0) { phiLength = 2 * Math.PI; }
            if (thetaStart === void 0) { thetaStart = 0; }
            if (thetaLength === void 0) { thetaLength = Math.PI; }
            _super.call(this, axis, phiStart, phiLength);
            this._radius = new R1([radius]);
            this.thetaLength = thetaLength;
            this.thetaStart = thetaStart;
            this.setModified(true);
            this.regenerate();
        }
        Object.defineProperty(SphericalPolarSimplexGeometry.prototype, "radius", {
            /**
             * @property radius
             * @type {number}
             */
            get: function () {
                return this._radius.x;
            },
            set: function (radius) {
                this._radius.x = mustBeNumber('radius', radius);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphericalPolarSimplexGeometry.prototype, "phiLength", {
            /**
             * @property phiLength
             * @type {number}
             */
            get: function () {
                return this.sliceAngle;
            },
            set: function (phiLength) {
                this.sliceAngle = phiLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphericalPolarSimplexGeometry.prototype, "phiStart", {
            /**
             * Defines a start half-plane relative to the <code>axis</code> property.
             * @property phiStart
             * @type {R3}
             */
            get: function () {
                return this.sliceStart;
            },
            set: function (phiStart) {
                this.sliceStart.copy(phiStart);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {SphericalPolarSimplexGeometry}
         * @chainable
         */
        SphericalPolarSimplexGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {SphericalPolarSimplexGeometry}
         * @chainable
         */
        SphericalPolarSimplexGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        SphericalPolarSimplexGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        /**
         * @method isModified
         * @return {boolean}
         */
        SphericalPolarSimplexGeometry.prototype.isModified = function () {
            return this._radius.modified || _super.prototype.isModified.call(this);
        };
        /**
         * @method setModified
         * @param modified {boolean}
         * @return {SphericalPolarSimplexGeometry}
         * @chainable
         */
        SphericalPolarSimplexGeometry.prototype.setModified = function (modified) {
            _super.prototype.setModified.call(this, modified);
            this._radius.modified = modified;
            return this;
        };
        /**
         * @method regenerate
         * @return {void}
         */
        SphericalPolarSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var heightSegments = this.curvedSegments;
            var widthSegments = this.curvedSegments;
            // Output. Could this be {[name:string]:VertexN<number>}[]
            var points = [];
            var uvs = [];
            computeVertices(this.radius, this.axis, this.phiStart, this.phiLength, this.thetaStart, this.thetaLength, heightSegments, widthSegments, points, uvs);
            switch (this.k) {
                case Simplex.EMPTY:
                    {
                        makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex.POINT:
                    {
                        makePoints(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex.LINE:
                    {
                        makeLineSegments(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex.TRIANGLE:
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
        return SphericalPolarSimplexGeometry;
    })(SliceSimplexGeometry);
    return SphericalPolarSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/TetrahedronSimplexGeometry',["require", "exports", '../geometries/PolyhedronSimplexGeometry'], function (require, exports, PolyhedronSimplexGeometry) {
    var vertices = [
        1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
    ];
    var indices = [
        2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
    ];
    /**
     * @class TetrahedronSimplexGeometry
     * @extends PolyhedronSimplexGeometry
     */
    var TetrahedronSimplexGeometry = (function (_super) {
        __extends(TetrahedronSimplexGeometry, _super);
        /**
         * @class TetrahedronSimplexGeometry
         * @constructor
         * @param [radius] {number}
         * @param [detail] {number}
         */
        function TetrahedronSimplexGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return TetrahedronSimplexGeometry;
    })(PolyhedronSimplexGeometry);
    return TetrahedronSimplexGeometry;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/geometries/VortexSimplexGeometry',["require", "exports", '../math/Euclidean3', '../geometries/SimplexGeometry', '../checks/mustBeInteger', '../math/SpinG3', '../math/R2', '../math/R3'], function (require, exports, Euclidean3, SimplexGeometry, mustBeInteger, SpinG3, R2, R3) {
    function perpendicular(to) {
        var random = new R3([Math.random(), Math.random(), Math.random()]);
        random.cross(to).direction();
        return new Euclidean3(0, random.x, random.y, random.z, 0, 0, 0, 0);
    }
    /**
     * @class VortexSimplexGeometry
     */
    var VortexSimplexGeometry = (function (_super) {
        __extends(VortexSimplexGeometry, _super);
        /**
         * @class VortexSimplexGeometry
         * @constructor
         */
        function VortexSimplexGeometry() {
            _super.call(this);
            this.radius = 1;
            this.radiusCone = 0.08;
            this.radiusShaft = 0.01;
            this.lengthCone = 0.2;
            this.lengthShaft = 0.8;
            this.arrowSegments = 8;
            this.radialSegments = 12;
            this.generator = SpinG3.dual(R3.e3);
            this.setModified(true);
        }
        VortexSimplexGeometry.prototype.isModified = function () {
            return this.generator.modified;
        };
        /**
         * @method setModified
         * @param modified {boolean}
         * @return {VortexSimplexGeometry}
         */
        VortexSimplexGeometry.prototype.setModified = function (modified) {
            this.generator.modified = modified;
            return this;
        };
        /**
         * @method regenerate
         * @return {void}
         */
        VortexSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var radius = this.radius;
            var radiusCone = this.radiusCone;
            var radiusShaft = this.radiusShaft;
            var radialSegments = this.radialSegments;
            var axis = new Euclidean3(0, -this.generator.yz, -this.generator.zx, -this.generator.xy, 0, 0, 0, 0);
            var radial = perpendicular(axis);
            // FIXME: Change to scale
            var R0 = radial.scale(this.radius);
            // FIXME: More elegant way to construct a Euclidean3 from a SpinorE3.
            var generator = new Euclidean3(this.generator.α, 0, 0, 0, this.generator.xy, this.generator.yz, this.generator.zx, 0);
            var Rminor0 = axis.ext(radial);
            var n = 9;
            var circleSegments = this.arrowSegments * n;
            var tau = Math.PI * 2;
            var center = new R3([0, 0, 0]);
            var normals = [];
            var points = [];
            var uvs = [];
            var alpha = this.lengthShaft / (this.lengthCone + this.lengthShaft);
            var factor = tau / this.arrowSegments;
            var theta = alpha / (n - 2);
            function computeAngle(index) {
                mustBeInteger('index', index);
                var m = index % n;
                if (m === n - 1) {
                    return computeAngle(index - 1);
                }
                else {
                    var a = (index - m) / n;
                    return factor * (a + m * theta);
                }
            }
            function computeRadius(index) {
                mustBeInteger('index', index);
                var m = index % n;
                if (m === n - 1) {
                    return radiusCone;
                }
                else {
                    return radiusShaft;
                }
            }
            for (var j = 0; j <= radialSegments; j++) {
                // v is the angle inside the vortex tube.
                var v = tau * j / radialSegments;
                for (var i = 0; i <= circleSegments; i++) {
                    // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
                    var u = computeAngle(i);
                    var Rmajor = generator.scale(-u / 2).exp();
                    center.copy(R0).rotate(Rmajor);
                    var vertex = R3.copy(center);
                    var r0 = axis.scale(computeRadius(i));
                    var Rminor = Rmajor.mul(Rminor0).mul(Rmajor.__tilde__()).scale(-v / 2).exp();
                    // var Rminor = Rminor0.clone().rotate(Rmajor).scale(-v/2).exp()
                    var r = Rminor.mul(r0).mul(Rminor.__tilde__());
                    vertex.add2(center, r);
                    points.push(vertex);
                    uvs.push(new R2([i / circleSegments, j / radialSegments]));
                    normals.push(R3.copy(r).direction());
                }
            }
            for (var j = 1; j <= radialSegments; j++) {
                for (var i = 1; i <= circleSegments; i++) {
                    var a = (circleSegments + 1) * j + i - 1;
                    var b = (circleSegments + 1) * (j - 1) + i - 1;
                    var c = (circleSegments + 1) * (j - 1) + i;
                    var d = (circleSegments + 1) * j + i;
                    this.triangle([points[a], points[b], points[d]], [normals[a], normals[b], normals[d]], [uvs[a], uvs[b], uvs[d]]);
                    this.triangle([points[b], points[c], points[d]], [normals[b], normals[c], normals[d]], [uvs[b], uvs[c], uvs[d]]);
                }
            }
            this.setModified(false);
        };
        return VortexSimplexGeometry;
    })(SimplexGeometry);
    return VortexSimplexGeometry;
});

define('davinci-eight/programs/makeWebGLShader',["require", "exports"], function (require, exports) {
    /**
     *
     */
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
                throw new Error("Error compiling shader: " + message);
            }
            else {
                throw new Error("Context lost while compiling shader");
            }
        }
    }
    return makeWebGLShader;
});

define('davinci-eight/programs/makeWebGLProgram',["require", "exports", '../programs/makeWebGLShader'], function (require, exports, makeWebGLShader) {
    function makeWebGLProgram(ctx, vertexShader, fragmentShader, attribs) {
        // create our shaders
        var vs = makeWebGLShader(ctx, vertexShader, ctx.VERTEX_SHADER);
        var fs = makeWebGLShader(ctx, fragmentShader, ctx.FRAGMENT_SHADER);
        // Create the program object.
        var program = ctx.createProgram();
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
    return makeWebGLProgram;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/programs/SimpleWebGLProgram',["require", "exports", '../core/AttribLocation', '../programs/makeWebGLProgram', '../core/UniformLocation', '../utils/Shareable'], function (require, exports, AttribLocation, makeWebGLProgram, UniformLocation, Shareable) {
    /**
     * This class is "simple because" it assumes exactly one vertex shader and on fragment shader.
     * This class assumes that it will only be supporting a single WebGL rendering context.
     * The existence of the manager in the constructor enables it to enforce this invariant.
     */
    var SimpleWebGLProgram = (function (_super) {
        __extends(SimpleWebGLProgram, _super);
        function SimpleWebGLProgram(manager, vertexShader, fragmentShader, attribs) {
            _super.call(this, 'SimpleWebGLProgram');
            this.attributes = {};
            this.uniforms = {};
            this.manager = manager;
            // Interesting. CM can't be addRefd!
            // manager.addRef()
            this.vertexShader = vertexShader;
            this.fragmentShader = fragmentShader;
            this.attribs = attribs;
            this.manager.addContextListener(this);
            this.manager.synchronize(this);
        }
        SimpleWebGLProgram.prototype.destructor = function () {
            var manager = this.manager;
            var canvasId = manager.canvasId;
            // If the program has been allocated, find out what to do with it.
            // (we may have been disconnected from listening)
            if (this.program) {
                var gl = manager.gl;
                if (gl) {
                    if (gl.isContextLost()) {
                        this.contextLost(canvasId);
                    }
                    else {
                        this.contextFree(canvasId);
                    }
                }
                else {
                    console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
                }
            }
            manager.removeContextListener(this);
            // this.manager.release()
            this.manager = void 0;
        };
        SimpleWebGLProgram.prototype.contextGain = function (manager) {
            if (!this.program) {
                this.program = makeWebGLProgram(manager.gl, this.vertexShader, this.fragmentShader, this.attribs);
                var context = manager.gl;
                var program = this.program;
                var attributes = this.attributes;
                var uniforms = this.uniforms;
                var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                for (var a = 0; a < activeAttributes; a++) {
                    var activeAttribInfo = context.getActiveAttrib(program, a);
                    var name_1 = activeAttribInfo.name;
                    if (!attributes[name_1]) {
                        attributes[name_1] = new AttribLocation(manager, name_1);
                    }
                }
                var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                for (var u = 0; u < activeUniforms; u++) {
                    var activeUniformInfo = context.getActiveUniform(program, u);
                    var name_2 = activeUniformInfo.name;
                    if (!uniforms[name_2]) {
                        uniforms[name_2] = new UniformLocation(manager, name_2);
                    }
                }
                for (var aName in attributes) {
                    attributes[aName].contextGain(context, program);
                }
                for (var uName in uniforms) {
                    uniforms[uName].contextGain(context, program);
                }
            }
        };
        SimpleWebGLProgram.prototype.contextLost = function (canvasId) {
            this.program = void 0;
            for (var aName in this.attributes) {
                this.attributes[aName].contextLost();
            }
            for (var uName in this.uniforms) {
                this.uniforms[uName].contextLost();
            }
        };
        SimpleWebGLProgram.prototype.contextFree = function (canvasId) {
            if (this.program) {
                var gl = this.manager.gl;
                if (gl) {
                    if (!gl.isContextLost()) {
                        gl.deleteProgram(this.program);
                    }
                    else {
                    }
                }
                else {
                    console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
                }
                this.program = void 0;
            }
            for (var aName in this.attributes) {
                this.attributes[aName].contextFree();
            }
            for (var uName in this.uniforms) {
                this.uniforms[uName].contextFree();
            }
        };
        SimpleWebGLProgram.prototype.use = function () {
            this.manager.gl.useProgram(this.program);
        };
        return SimpleWebGLProgram;
    })(Shareable);
    return SimpleWebGLProgram;
});

define('davinci-eight/programs/createMaterial',["require", "exports", '../core', '../scene/MonitorList', '../collections/NumberIUnknownMap', '../checks/mustBeInteger', '../checks/mustBeString', '../utils/uuid4', '../utils/refChange', '../programs/SimpleWebGLProgram'], function (require, exports, core, MonitorList, NumberIUnknownMap, mustBeInteger, mustBeString, uuid4, refChange, SimpleWebGLProgram) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_IMATERIAL = 'IMaterial';
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    // FIXME: Handle list of shaders? Else createSimpleProgram
    var createMaterial = function (monitors, vertexShader, fragmentShader, attribs) {
        MonitorList.verify('monitors', monitors, function () { return "createMaterial"; });
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
        var programsByCanvasId = new NumberIUnknownMap();
        var uuid = uuid4().generate();
        var self = {
            get vertexShader() {
                return vertexShader;
            },
            get fragmentShader() {
                return fragmentShader;
            },
            attributes: function (canvasId) {
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    return program.attributes;
                }
            },
            uniforms: function (canvasId) {
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    return program.uniforms;
                }
            },
            addRef: function () {
                refChange(uuid, LOGGING_NAME_IMATERIAL, +1);
                refCount++;
                return refCount;
            },
            release: function () {
                refChange(uuid, LOGGING_NAME_IMATERIAL, -1);
                refCount--;
                if (refCount === 0) {
                    MonitorList.removeContextListener(self, monitors);
                    programsByCanvasId.release();
                }
                return refCount;
            },
            contextFree: function (canvasId) {
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    program.contextFree(canvasId);
                    programsByCanvasId.remove(canvasId);
                }
            },
            contextGain: function (manager) {
                var canvasId;
                var sprog;
                canvasId = manager.canvasId;
                if (!programsByCanvasId.exists(canvasId)) {
                    sprog = new SimpleWebGLProgram(manager, vertexShader, fragmentShader, attribs);
                    programsByCanvasId.putWeakRef(canvasId, sprog);
                }
                else {
                    sprog = programsByCanvasId.getWeakRef(canvasId);
                }
                sprog.contextGain(manager);
            },
            contextLost: function (canvasId) {
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    program.contextLost(canvasId);
                    programsByCanvasId.remove(canvasId);
                }
            },
            get uuid() {
                return uuid;
            },
            use: function (canvasId) {
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    program.use();
                }
                else {
                    console.warn(LOGGING_NAME_IMATERIAL + " use(canvasId: number) missing WebGLRenderingContext");
                }
            },
            enableAttrib: function (name, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var attribLoc = program.attributes[name];
                    if (attribLoc) {
                        attribLoc.enable();
                    }
                    else {
                    }
                }
                else {
                }
            },
            disableAttrib: function (name, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var attribLoc = program.attributes[name];
                    if (attribLoc) {
                        attribLoc.enable();
                    }
                    else {
                    }
                }
                else {
                }
            },
            uniform1f: function (name, x, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform1f(x);
                    }
                    else {
                    }
                }
                else {
                }
            },
            uniform2f: function (name, x, y, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform2f(x, y);
                    }
                }
            },
            uniform3f: function (name, x, y, z, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform3f(x, y, z);
                    }
                }
            },
            uniform4f: function (name, x, y, z, w, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform4f(x, y, z, w);
                    }
                }
            },
            uniformMatrix2: function (name, transpose, matrix, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.matrix2(transpose, matrix);
                    }
                }
            },
            uniformMatrix3: function (name, transpose, matrix, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.matrix3(transpose, matrix);
                    }
                }
            },
            uniformMatrix4: function (name, transpose, matrix, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.matrix4(transpose, matrix);
                    }
                }
                else {
                    if (core.verbose) {
                        console.warn("Ignoring uniformMatrix4 for " + name + " because `typeof canvasId` is " + typeof canvasId);
                    }
                }
            },
            uniformVectorE2: function (name, vector, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.cartesian2(vector);
                    }
                }
            },
            uniformVectorE3: function (name, vector, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.cartesian3(vector);
                    }
                }
            },
            uniformVectorE4: function (name, vector, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.cartesian4(vector);
                    }
                }
            },
            vector2: function (name, data, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector2(data);
                    }
                }
            },
            vector3: function (name, data, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector3(data);
                    }
                }
            },
            vector4: function (name, data, canvasId) {
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector4(data);
                    }
                }
            }
        };
        MonitorList.addContextListener(self, monitors);
        MonitorList.synchronize(self, monitors);
        refChange(uuid, LOGGING_NAME_IMATERIAL, +1);
        return self;
    };
    return createMaterial;
});

define('davinci-eight/programs/fragmentShader',["require", "exports", '../checks/mustBeBoolean', '../checks/mustBeDefined'], function (require, exports, mustBeBoolean, mustBeDefined) {
    /**
     * Generates a fragment shader
     */
    function fragmentShader(attributes, uniforms, vColor, vLight) {
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniforms', uniforms);
        mustBeBoolean('vColor', vColor);
        mustBeBoolean('vLight', vLight);
        var lines = [];
        lines.push("// generated fragment shader");
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
    return mergeStringMapList;
});

define('davinci-eight/programs/vColorRequired',["require", "exports", '../core/Symbolic'], function (require, exports, Symbolic) {
    function vColorRequired(attributes, uniforms) {
        return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
    }
    return vColorRequired;
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

define('davinci-eight/programs/vertexShader',["require", "exports", '../core/getAttribVarName', '../core/getUniformVarName', '../checks/mustBeBoolean', '../checks/mustBeDefined', '../core/Symbolic'], function (require, exports, getAttribVarName, getUniformVarName, mustBeBoolean, mustBeDefined, Symbolic) {
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
    function indent(n) {
        return SPACE + SPACE;
    }
    /**
     * Generates a vertex shader.
     */
    function vertexShader(attributes, uniforms, vColor, vLight) {
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniforms', uniforms);
        mustBeBoolean('vColor', vColor);
        mustBeBoolean('vLight', vLight);
        var lines = [];
        lines.push("// generated vertex shader");
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
        // Reflections are applied first.
        if (uniforms[Symbolic.UNIFORM_REFLECTION_ONE_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, Symbolic.UNIFORM_REFLECTION_ONE_MATRIX));
        }
        if (uniforms[Symbolic.UNIFORM_REFLECTION_TWO_MATRIX]) {
            glPosition.unshift(TIMES);
            glPosition.unshift(getUniformCodeName(uniforms, Symbolic.UNIFORM_REFLECTION_TWO_MATRIX));
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
        if (uniforms[Symbolic.UNIFORM_POINT_SIZE]) {
            lines.push("  gl_PointSize = " + getUniformCodeName(uniforms, Symbolic.UNIFORM_POINT_SIZE) + ";");
        }
        if (vColor) {
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
            else {
                lines.push("  vColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        if (vLight) {
            if (uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] && attributes[Symbolic.ATTRIBUTE_NORMAL]) {
                lines.push("  vec3 L = normalize(" + getUniformCodeName(uniforms, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");");
                lines.push("  vec3 N = normalize(" + getUniformCodeName(uniforms, Symbolic.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName(attributes[Symbolic.ATTRIBUTE_NORMAL], Symbolic.ATTRIBUTE_NORMAL) + ");");
                lines.push("  // The minus sign arises because L is the light direction, so we need dot(N, -L) = -dot(N, L)");
                lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(-dot(N, L), 0.0);");
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
        lines.push("}");
        var code = lines.join("\n");
        return code;
    }
    return vertexShader;
});

define('davinci-eight/programs/vLightRequired',["require", "exports", '../checks/mustBeDefined', '../core/Symbolic'], function (require, exports, mustBeDefined, Symbolic) {
    function vLightRequired(attributes, uniforms) {
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniforms', uniforms);
        return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
    }
    return vLightRequired;
});

define('davinci-eight/programs/smartProgram',["require", "exports", '../scene/MonitorList', '../programs/fragmentShader', '../utils/mergeStringMapList', '../checks/mustBeDefined', './createMaterial', '../programs/vColorRequired', '../programs/vertexShader', '../programs/vLightRequired'], function (require, exports, MonitorList, fragmentShader, mergeStringMapList, mustBeDefined, createMaterial, vColorRequired, vertexShader, vLightRequired) {
    /**
     *
     */
    var smartProgram = function (monitors, attributes, uniformsList, bindings) {
        MonitorList.verify('monitors', monitors, function () { return "smartProgram"; });
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniformsList', uniformsList);
        var uniforms = mergeStringMapList(uniformsList);
        var vColor = vColorRequired(attributes, uniforms);
        var vLight = vLightRequired(attributes, uniforms);
        var innerProgram = createMaterial(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);
        var self = {
            get uuid() {
                return innerProgram.uuid;
            },
            attributes: function (canvasId) {
                return innerProgram.attributes(canvasId);
            },
            uniforms: function (canvasId) {
                return innerProgram.uniforms(canvasId);
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
            contextLost: function (canvasId) {
                return innerProgram.contextLost(canvasId);
            },
            use: function (canvasId) {
                return innerProgram.use(canvasId);
            },
            enableAttrib: function (name, canvasId) {
                return innerProgram.enableAttrib(name, canvasId);
            },
            disableAttrib: function (name, canvasId) {
                return innerProgram.disableAttrib(name, canvasId);
            },
            uniform1f: function (name, x, canvasId) {
                return innerProgram.uniform1f(name, x, canvasId);
            },
            uniform2f: function (name, x, y, canvasId) {
                return innerProgram.uniform2f(name, x, y, canvasId);
            },
            uniform3f: function (name, x, y, z, canvasId) {
                return innerProgram.uniform3f(name, x, y, z, canvasId);
            },
            uniform4f: function (name, x, y, z, w, canvasId) {
                return innerProgram.uniform4f(name, x, y, z, w, canvasId);
            },
            uniformMatrix2: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix2(name, transpose, matrix, canvasId);
            },
            uniformMatrix3: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix3(name, transpose, matrix, canvasId);
            },
            uniformMatrix4: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix4(name, transpose, matrix, canvasId);
            },
            uniformVectorE2: function (name, vector, canvasId) {
                return innerProgram.uniformVectorE2(name, vector, canvasId);
            },
            uniformVectorE3: function (name, vector, canvasId) {
                return innerProgram.uniformVectorE3(name, vector, canvasId);
            },
            uniformVectorE4: function (name, vector, canvasId) {
                return innerProgram.uniformVectorE4(name, vector, canvasId);
            },
            vector2: function (name, data, canvasId) {
                return innerProgram.vector2(name, data, canvasId);
            },
            vector3: function (name, data, canvasId) {
                return innerProgram.vector3(name, data, canvasId);
            },
            vector4: function (name, data, canvasId) {
                return innerProgram.vector4(name, data, canvasId);
            }
        };
        return self;
    };
    return smartProgram;
});

define('davinci-eight/programs/programFromScripts',["require", "exports", '../programs/createMaterial', '../checks/expectArg', '../scene/MonitorList'], function (require, exports, createMaterial, expectArg, MonitorList) {
    // FIXME: Lists of scripts, using the type to distinguish vertex/fragment?
    // FIXME: Temporary rename simpleProgramFromScripts?
    /**
     * @method programFromScripts
     * @param monitors {IContextMonitor[]}
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
        return createMaterial(monitors, vertexShader, fragmentShader, attribs);
    }
    return programFromScripts;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/Material',["require", "exports", '../core', '../checks/isDefined', '../checks/isUndefined', '../scene/MonitorList', '../checks/mustBeInteger', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, core, isDefined, isUndefined, MonitorList, mustBeInteger, mustBeString, Shareable) {
    function consoleWarnDroppedUniform(clazz, suffix, name, canvasId) {
        console.warn(clazz + " dropped uniform" + suffix + " " + name);
        console.warn("`typeof canvasId` is " + typeof canvasId);
    }
    /**
     * @class Material
     * @extends Shareable
     */
    var Material = (function (_super) {
        __extends(Material, _super);
        // FIXME: Make uuid and use Shareable
        // public programId = uuid4().generate();
        /**
         * @class Material
         * @constructor
         * @param contexts {IContextMonitor[]}
         * @param type {string} The class name, used for logging.
         */
        function Material(contexts, type) {
            _super.call(this, 'Material');
            this.readyPending = false;
            MonitorList.verify('contexts', contexts);
            mustBeString('type', type);
            this._monitors = MonitorList.copy(contexts);
            this.type = type;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        Material.prototype.destructor = function () {
            this._monitors.removeContextListener(this);
            this._monitors.release();
            this._monitors = void 0;
            if (this.inner) {
                this.inner.release();
                this.inner = void 0;
            }
        };
        /**
         * @method makeReady
         * @param async {boolean}
         * @protected
         */
        Material.prototype.makeReady = function (async) {
            if (!this.readyPending) {
                this.readyPending = true;
                this._monitors.addContextListener(this);
                this._monitors.synchronize(this);
            }
        };
        Object.defineProperty(Material.prototype, "monitors", {
            /**
             * @property monitors
             * @type {IContextMonitor[]}
             */
            get: function () {
                return this._monitors.toArray();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "fragmentShader", {
            /**
             * @property fragmentShader
             * @type {string}
             */
            get: function () {
                return this.inner ? this.inner.fragmentShader : void 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method use
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.use = function (canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (core.strict) {
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
                    if (core.verbose) {
                        console.warn(this.type + " is not ready for use. Maybe did not receive contextGain?");
                    }
                }
            }
        };
        /**
         * @method attributes
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {{[name: string]: AttribLocation}}
         */
        Material.prototype.attributes = function (canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            // FIXME: Why is this called?
            // FIXME: The map should be protected but that is slow
            // FIXME Clear need for performant solution.
            if (this.inner) {
                return this.inner.attributes(canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.attributes(canvasId);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method uniforms
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {{[name: string]: UniformLocation}}
         */
        Material.prototype.uniforms = function (canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                return this.inner.uniforms(canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.uniforms(canvasId);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method enableAttrib
         * @param name {string}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.enableAttrib = function (name, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                return this.inner.enableAttrib(name, canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.enableAttrib(name, canvasId);
                }
                else {
                    console.warn(this.type + " enableAttrib()");
                }
            }
        };
        /**
         * @method disableAttrib
         * @param name {string}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.disableAttrib = function (name, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                return this.inner.disableAttrib(name, canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.disableAttrib(name, canvasId);
                }
                else {
                    console.warn(this.type + " disableAttrib()");
                }
            }
        };
        /**
         * @method contextFree
         * @param canvasId {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.contextFree = function (canvasId) {
            if (this.inner) {
                this.inner.contextFree(canvasId);
            }
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        Material.prototype.contextGain = function (manager) {
            if (isUndefined(this.inner)) {
                this.inner = this.createMaterial();
            }
            if (isDefined(this.inner)) {
                this.inner.contextGain(manager);
            }
        };
        /**
         * @method contextLost
         * @param canvasId {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.contextLost = function (canvasId) {
            if (this.inner) {
                this.inner.contextLost(canvasId);
            }
        };
        /**
         * @method createMaterial
         * @return {IMaterial}
         * @protected
         */
        Material.prototype.createMaterial = function () {
            // FIXME Since we get contextGain by canvas, expect canvasId to be an argument?
            throw new Error("Material createMaterial method is virtual and should be implemented by " + this.type);
        };
        /**
         * @method uniform1f
         * @param name {string}
         * @param x {number}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniform1f = function (name, x, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniform1f(name, x, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform1f(name, x, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '1f', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniform2f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniform2f = function (name, x, y, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniform2f(name, x, y, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform2f(name, x, y, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '2f', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniform3f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniform3f = function (name, x, y, z, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniform3f(name, x, y, z, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform3f(name, x, y, z, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '3f', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniform4f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param w {number}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniform4f = function (name, x, y, z, w, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniform4f(name, x, y, z, w, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform4f(name, x, y, z, w, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '4f', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniformMatrix2
         * @param name {string}
         * @param transpose {boolean}
         * @param matrix {Matrix2}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformMatrix2 = function (name, transpose, matrix, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformMatrix2(name, transpose, matrix, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix2(name, transpose, matrix, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix2', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniformMatrix3
         * @param name {string}
         * @param transpose {boolean}
         * @param matrix {Matrix3}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformMatrix3 = function (name, transpose, matrix, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformMatrix3(name, transpose, matrix, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix3(name, transpose, matrix, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix3', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniformMatrix4
         * @param name {string}
         * @param transpose {boolean}
         * @param matrix {Matrix4}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformMatrix4 = function (name, transpose, matrix, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformMatrix4(name, transpose, matrix, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix4(name, transpose, matrix, canvasId);
                }
                else {
                    if (!readyPending) {
                        if (core.verbose) {
                            consoleWarnDroppedUniform(this.type, 'Matrix4', name, canvasId);
                        }
                    }
                }
            }
        };
        /**
         * @method uniformVectorE2
         * @param name {string}
         * @param vector {VectorE2}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformVectorE2 = function (name, vector, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformVectorE2(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVectorE2(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'R2', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniformVectorE3
         * @param name {string}
         * @param vector {VectorE3}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformVectorE3 = function (name, vector, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformVectorE3(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVectorE3(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'R3', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniformVectorE4
         * @param name {string}
         * @param vector {VectorE4}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformVectorE4 = function (name, vector, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformVectorE4(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVectorE4(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'R4', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method vector2
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.vector2 = function (name, data, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.vector2(name, data, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vector2(name, data, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'vector2', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method vector3
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.vector3 = function (name, data, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.vector3(name, data, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vector3(name, data, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'vector3', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method vector4
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.vector4 = function (name, data, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.vector4(name, data, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vector4(name, data, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'vector4', name, canvasId);
                    }
                }
            }
        };
        Object.defineProperty(Material.prototype, "vertexShader", {
            /**
             * @property vertexShader
             * @type {string}
             */
            get: function () {
                return this.inner ? this.inner.vertexShader : void 0;
            },
            enumerable: true,
            configurable: true
        });
        return Material;
    })(Shareable);
    return Material;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
     * @class HTMLScriptsMaterial
     * @extends Material
     */
    var HTMLScriptsMaterial = (function (_super) {
        __extends(HTMLScriptsMaterial, _super);
        /**
         * @class HTMLScriptsMaterial
         * @constructor
         * @param contexts {IContextMonitor[]}
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
        /**
         * @method createMaterial
         * @return {IMaterial}
         */
        HTMLScriptsMaterial.prototype.createMaterial = function () {
            var vsId = this.scriptIds[0];
            var fsId = this.scriptIds[1];
            return programFromScripts(this.monitors, vsId, fsId, this.dom, this.attributeBindings);
        };
        return HTMLScriptsMaterial;
    })(Material);
    return HTMLScriptsMaterial;
});

define('davinci-eight/programs/glslAttribType',["require", "exports", '../core/Symbolic', '../checks/mustBeInteger', '../checks/mustBeString'], function (require, exports, Symbolic, mustBeInteger, mustBeString) {
    function sizeType(size) {
        mustBeInteger('size', size);
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
            default: {
                throw new Error("Can't compute the GLSL attribute type from size " + size);
            }
        }
    }
    function glslAttribType(key, size) {
        mustBeString('key', key);
        mustBeInteger('size', size);
        switch (key) {
            case Symbolic.ATTRIBUTE_COLOR: {
                return 'vec3';
            }
            default: {
                return sizeType(size);
            }
        }
    }
    return glslAttribType;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/SmartMaterial',["require", "exports", '../programs/fragmentShader', '../materials/Material', '../programs/createMaterial', '../programs/vertexShader'], function (require, exports, fragmentShader, Material, createMaterial, vertexShader) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'SmartMaterial';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * <p>
     * SmartMaterial constructs a vertex shader and a fragment shader.
     * The shader codes are configured by specifying attributes, uniforms and varyings.
     * The default configuration is produces minimal shaders.
     * <p>
     * @class SmartMaterial
     * @extends Material
     */
    var SmartMaterial = (function (_super) {
        __extends(SmartMaterial, _super);
        /**
         * @class SmartMaterial
         * @constructor
         * @param contexts {IContextMonitor[]}
         * @param geometry {GeometryMeta} This parameter determines the attributes used in the shaders.
         */
        function SmartMaterial(contexts, aParams, uParams, vColor, vLight) {
            // A super call must be the first statement in the constructor when a class
            // contains initialized propertied or has parameter properties (TS2376).
            _super.call(this, contexts, LOGGING_NAME);
            this.aParams = {};
            this.uParams = {};
            this.vColor = false;
            this.vLight = false;
            this.aParams = aParams;
            this.uParams = uParams;
            this.vColor = vColor;
            this.vLight = vLight;
            // We can start eagerly or omit this call entirely and wait till we are use(d).
            this.makeReady(false);
        }
        SmartMaterial.prototype.createMaterial = function () {
            var bindings = [];
            return createMaterial(this.monitors, this.vertexShader, this.fragmentShader, bindings);
        };
        Object.defineProperty(SmartMaterial.prototype, "vertexShader", {
            get: function () {
                return vertexShader(this.aParams, this.uParams, this.vColor, this.vLight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartMaterial.prototype, "fragmentShader", {
            get: function () {
                return fragmentShader(this.aParams, this.uParams, this.vColor, this.vLight);
            },
            enumerable: true,
            configurable: true
        });
        return SmartMaterial;
    })(Material);
    return SmartMaterial;
});

define('davinci-eight/materials/SmartMaterialBuilder',["require", "exports", '../core/getAttribVarName', '../core/getUniformVarName', '../programs/glslAttribType', '../checks/mustBeInteger', '../checks/mustBeString', '../materials/SmartMaterial', '../programs/vColorRequired', '../programs/vLightRequired'], function (require, exports, getAttribVarName, getUniformVarName, glslAttribType, mustBeInteger, mustBeString, SmartMaterial, vColorRequired, vLightRequired) {
    function computeAttribParams(values) {
        var result = {};
        var keys = Object.keys(values);
        var keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var attribute = values[key];
            var chunkSize = mustBeInteger('chunkSize', attribute.chunkSize);
            var varName = getAttribVarName(attribute, key);
            result[varName] = { glslType: glslAttribType(key, chunkSize) };
        }
        return result;
    }
    function updateUniformMeta(uniforms) {
        uniforms.forEach(function (values) {
            var keys = Object.keys(values);
            var keysLength = keys.length;
            for (var i = 0; i < keysLength; i++) {
                var key = keys[i];
                var uniform = values[key];
                var varName = getUniformVarName(uniform, key);
                this.uParams[varName] = { glslType: uniform.glslType };
            }
        });
    }
    /**
     * @class SmartMaterialBuilder
     */
    var SmartMaterialBuilder = (function () {
        /**
         * @class SmartMaterialBuilder
         * @constructor
         * @param primitive [DrawPrimitive]
         */
        function SmartMaterialBuilder(primitive) {
            this.aMeta = {};
            this.uParams = {};
            if (primitive) {
                var attributes = primitive.attributes;
                var keys = Object.keys(attributes);
                var keysLength = keys.length;
                for (var i = 0; i < keysLength; i++) {
                    var key = keys[i];
                    var attribute = attributes[key];
                    this.attribute(key, attribute.chunkSize);
                }
            }
        }
        /**
         * Declares that the material should have an `attribute` with the specified name and chunkSize.
         * @method attribute
         * @param name {string}
         * @param chunkSize {number}
         */
        SmartMaterialBuilder.prototype.attribute = function (name, chunkSize) {
            mustBeString('name', name);
            mustBeInteger('chunkSize', chunkSize);
            this.aMeta[name] = { chunkSize: chunkSize };
            return this;
        };
        /**
         * Declares that the material should have a `uniform` with the specified name and type.
         * @method uniform
         * @param name {string}
         * @param type {string} The GLSL type. e.g. 'float', 'vec3', 'mat2'
         */
        SmartMaterialBuilder.prototype.uniform = function (name, type) {
            mustBeString('name', name);
            mustBeString('type', type); // Must also be a valid GLSL type.
            this.uParams[name] = { glslType: type };
            return this;
        };
        /**
         * @method build
         * @param contexts {IContextMonitor[]}
         * @return {Material}
         */
        SmartMaterialBuilder.prototype.build = function (contexts) {
            // FIXME: Push this calculation down into the functions.
            // Then the data structures are based on chunkSize.
            // uniforms based on numeric type?
            var aParams = computeAttribParams(this.aMeta);
            var vColor = vColorRequired(aParams, this.uParams);
            var vLight = vLightRequired(aParams, this.uParams);
            return new SmartMaterial(contexts, aParams, this.uParams, vColor, vLight);
        };
        return SmartMaterialBuilder;
    })();
    return SmartMaterialBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/LineMaterial',["require", "exports", '../materials/Material', '../materials/SmartMaterialBuilder', '../core/Symbolic'], function (require, exports, Material, SmartMaterialBuilder, Symbolic) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'LineMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class LineMaterial
     * @extends Material
     */
    var LineMaterial = (function (_super) {
        __extends(LineMaterial, _super);
        // A super call must be the first statement in the constructor when a class
        // contains initialized propertied or has parameter properties (TS2376).
        /**
         * @class LineMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         * @parameters [MeshNormalParameters]
         */
        function LineMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        LineMaterial.prototype.createMaterial = function () {
            var smb = new SmartMaterialBuilder();
            smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            return smb.build(this.monitors);
        };
        return LineMaterial;
    })(Material);
    return LineMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/MeshMaterial',["require", "exports", '../materials/Material', '../materials/SmartMaterialBuilder', '../core/Symbolic'], function (require, exports, Material, SmartMaterialBuilder, Symbolic) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'MeshMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class MeshMaterial
     * @extends Material
     */
    var MeshMaterial = (function (_super) {
        __extends(MeshMaterial, _super);
        /**
         * @class MeshMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         * @parameters [MeshNormalParameters]
         */
        function MeshMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        MeshMaterial.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        /**
         * @method createMaterial
         * @return {IMaterial}
         * @protected
         */
        MeshMaterial.prototype.createMaterial = function () {
            var smb = new SmartMaterialBuilder();
            smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
            smb.attribute(Symbolic.ATTRIBUTE_NORMAL, 3);
            // smb.attribute(Symbolic.ATTRIBUTE_COLOR, 3);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_NORMAL_MATRIX, 'mat3');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_AMBIENT_LIGHT, 'vec3');
            smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
            return smb.build(this.monitors);
        };
        return MeshMaterial;
    })(Material);
    return MeshMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/MeshLambertMaterial',["require", "exports", '../materials/Material', '../materials/SmartMaterialBuilder', '../core/Symbolic'], function (require, exports, Material, SmartMaterialBuilder, Symbolic) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'MeshLambertMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class MeshLambertMaterial
     * @extends Material
     */
    var MeshLambertMaterial = (function (_super) {
        __extends(MeshLambertMaterial, _super);
        /**
         *
         * @class MeshLambertMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         */
        function MeshLambertMaterial(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        MeshLambertMaterial.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        MeshLambertMaterial.prototype.createMaterial = function () {
            var smb = new SmartMaterialBuilder();
            smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
            smb.attribute(Symbolic.ATTRIBUTE_NORMAL, 3);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_NORMAL_MATRIX, 'mat3');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
            return smb.build(this.monitors);
        };
        return MeshLambertMaterial;
    })(Material);
    return MeshLambertMaterial;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/materials/PointMaterial',["require", "exports", '../materials/Material', '../materials/SmartMaterialBuilder', '../core/Symbolic'], function (require, exports, Material, SmartMaterialBuilder, Symbolic) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'PointMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class PointMaterial
     * @extends Material
     */
    var PointMaterial = (function (_super) {
        __extends(PointMaterial, _super);
        // A super call must be the first statement in the constructor when a class
        // contains initialized propertied or has parameter properties (TS2376).
        /**
         * @class PointMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         * @parameters [MeshNormalParameters]
         */
        function PointMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        PointMaterial.prototype.createMaterial = function () {
            var smb = new SmartMaterialBuilder();
            smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_POINT_SIZE, 'float');
            return smb.build(this.monitors);
        };
        return PointMaterial;
    })(Material);
    return PointMaterial;
});

define('davinci-eight/mappers/RoundUniform',["require", "exports"], function (require, exports) {
    var RoundUniform = (function () {
        function RoundUniform() {
        }
        Object.defineProperty(RoundUniform.prototype, "next", {
            get: function () {
                // FIXME: No reference counting yet.
                return this._next;
            },
            set: function (next) {
                // FIXME: No reference counting yet.
                this._next = next;
            },
            enumerable: true,
            configurable: true
        });
        RoundUniform.prototype.uniform1f = function (name, x, canvasId) {
            if (this._next) {
                this._next.uniform1f(name, Math.round(x), canvasId);
            }
        };
        RoundUniform.prototype.uniform2f = function (name, x, y) {
            console.warn("uniform");
        };
        RoundUniform.prototype.uniform3f = function (name, x, y, z) {
            console.warn("uniform");
        };
        RoundUniform.prototype.uniform4f = function (name, x, y, z, w) {
            console.warn("uniform");
        };
        RoundUniform.prototype.uniformMatrix2 = function (name, transpose, matrix) {
            console.warn("uniform");
        };
        RoundUniform.prototype.uniformMatrix3 = function (name, transpose, matrix) {
            console.warn("uniform");
        };
        RoundUniform.prototype.uniformMatrix4 = function (name, transpose, matrix) {
            console.warn("uniform");
        };
        RoundUniform.prototype.uniformVectorE2 = function (name, vector) {
            console.warn("uniformVectorE2");
        };
        RoundUniform.prototype.uniformVectorE3 = function (name, vector) {
            console.warn("uniformVectorE3");
        };
        RoundUniform.prototype.uniformVectorE4 = function (name, vector) {
            console.warn("uniformVectorE4");
        };
        RoundUniform.prototype.vector2 = function (name, data, canvasId) {
            this._next.vector2(name, data, canvasId);
        };
        RoundUniform.prototype.vector3 = function (name, data, canvasId) {
            this._next.vector3(name, data, canvasId);
        };
        RoundUniform.prototype.vector4 = function (name, data, canvasId) {
            this._next.vector4(name, data, canvasId);
        };
        return RoundUniform;
    })();
    return RoundUniform;
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
    return extE2;
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
    return lcoE2;
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
    return rcoE2;
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
    return mulE2;
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
    return scpE2;
});

define('davinci-eight/math/Euclidean2',["require", "exports", '../geometries/b2', '../geometries/b3', '../math/extE2', '../checks/isDefined', '../math/lcoE2', '../math/rcoE2', '../math/mulE2', '../checks/mustBeInteger', '../checks/mustBeNumber', '../i18n/readOnly', '../math/scpE2', '../math/stringFromCoordinates', '../math/Unit'], function (require, exports, b2, b3, extE2, isDefined, lcoE2, rcoE2, mulE2, mustBeInteger, mustBeNumber, readOnly, scpE2, stringFromCoordinates, Unit) {
    var exp = Math.exp;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    function assertArgEuclidean2(name, arg) {
        if (arg instanceof Euclidean2) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a Euclidean2");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new Error("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
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
    function addE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
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
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
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
    var divide = function (a00, a01, a10, a11, b00, b01, b10, b11, uom) {
        var c00;
        var c01;
        var c10;
        var c11;
        var i00;
        var i01;
        var i10;
        var i11;
        var k00;
        var m00;
        var m01;
        var m10;
        var m11;
        var r00;
        var r01;
        var r10;
        var r11;
        var s00;
        var s01;
        var s10;
        var s11;
        var x00;
        var x01;
        var x10;
        var x11;
        r00 = +b00;
        r01 = +b01;
        r10 = +b10;
        r11 = -b11;
        m00 = b00 * r00 + b01 * r01 + b10 * r10 - b11 * r11;
        m01 = 0;
        m10 = 0;
        m11 = 0;
        c00 = +m00;
        c01 = -m01;
        c10 = -m10;
        c11 = -m11;
        s00 = r00 * c00 + r01 * c01 + r10 * c10 - r11 * c11;
        s01 = r00 * c01 + r01 * c00 - r10 * c11 + r11 * c10;
        s10 = r00 * c10 + r01 * c11 + r10 * c00 - r11 * c01;
        s11 = r00 * c11 + r01 * c10 - r10 * c01 + r11 * c00;
        k00 = b00 * s00 + b01 * s01 + b10 * s10 - b11 * s11;
        i00 = s00 / k00;
        i01 = s01 / k00;
        i10 = s10 / k00;
        i11 = s11 / k00;
        x00 = a00 * i00 + a01 * i01 + a10 * i10 - a11 * i11;
        x01 = a00 * i01 + a01 * i00 - a10 * i11 + a11 * i10;
        x10 = a00 * i10 + a01 * i11 + a10 * i00 - a11 * i01;
        x11 = a00 * i11 + a01 * i10 - a10 * i01 + a11 * i00;
        return new Euclidean2(x00, x01, x10, x11, uom);
    };
    /**
     * @class Euclidean2
     */
    var Euclidean2 = (function () {
        /**
         * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
         *
         * @class Euclidean2
         * @constructor
         * @param {number} α The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param {number} y The vector component of the multivector in the y-direction.
         * @param {number} β The pseudoscalar part of the multivector.
         * @param uom The optional unit of measure.
         */
        function Euclidean2(α, x, y, β, uom) {
            this.w = mustBeNumber('α', α);
            this.x = mustBeNumber('x', x);
            this.y = mustBeNumber('y', y);
            this.xy = mustBeNumber('β', β);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this.w *= multiplier;
                this.x *= multiplier;
                this.y *= multiplier;
                this.xy *= multiplier;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Euclidean2.prototype, "α", {
            /**
             * The scalar part of this multivector.
             * @property α
             * @return {number}
             */
            get: function () {
                return this.w;
            },
            set: function (unused) {
                throw new Error(readOnly('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean2.prototype, "β", {
            /**
             * The pseudoscalar part of this multivector.
             * @property β
             * @return {number}
             */
            get: function () {
                return this.xy;
            },
            set: function (unused) {
                throw new Error(readOnly('β').message);
            },
            enumerable: true,
            configurable: true
        });
        // FIXME: Replace x & y with a VectorE2, a
        Euclidean2.prototype.fromCartesian = function (α, x, y, β, uom) {
            mustBeNumber('α', α);
            mustBeNumber('x', x);
            mustBeNumber('y', y);
            mustBeNumber('β', β);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean2(α, x, y, β, uom);
        };
        Euclidean2.prototype.fromPolar = function (α, r, θ, β, uom) {
            mustBeNumber('α', α);
            mustBeNumber('r', r);
            mustBeNumber('θ', θ);
            mustBeNumber('β', β);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean2(α, r * cos(θ), r * sin(θ), β, uom);
        };
        Object.defineProperty(Euclidean2.prototype, "coords", {
            get: function () {
                return [this.w, this.x, this.y, this.xy];
            },
            enumerable: true,
            configurable: true
        });
        Euclidean2.prototype.coordinate = function (index) {
            mustBeNumber('index', index);
            switch (index) {
                case 0:
                    return this.w;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.xy;
                default:
                    throw new Error("index must be in the range [0..3]");
            }
        };
        Euclidean2.add = function (a, b) {
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
        Euclidean2.prototype.add = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.add(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean2.prototype.addPseudo = function (β) {
            return new Euclidean2(this.α, this.x, this.y, this.β + β, this.uom);
        };
        Euclidean2.prototype.addScalar = function (α) {
            return new Euclidean2(this.α + α, this.x, this.y, this.β, this.uom);
        };
        Euclidean2.prototype.adj = function () {
            throw new Error("TODO: adj");
        };
        Euclidean2.prototype.__add__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__radd__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).add(this);
            }
        };
        /**
         * @method angle
         * @return {Euclidean2}
         */
        Euclidean2.prototype.angle = function () {
            return this.log().grade(2);
        };
        Euclidean2.prototype.clone = function () {
            return this;
        };
        Euclidean2.prototype.conj = function () {
            throw new Error("TODO: adj");
        };
        Euclidean2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            return new Euclidean2(0, x, y, 0, this.uom);
        };
        Euclidean2.prototype.direction = function () {
            throw new Error('direction');
        };
        Euclidean2.prototype.distanceTo = function (point) {
            throw new Error("TODO: Euclidean2.distanceTo");
        };
        Euclidean2.prototype.equals = function (point) {
            throw new Error("TODO: Euclidean2.equals");
        };
        Euclidean2.sub = function (a, b) {
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
        Euclidean2.prototype.sub = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.sub(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__sub__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.sub(other);
            }
            else if (typeof other === 'number') {
                return this.sub(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rsub__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).sub(this);
            }
        };
        Euclidean2.prototype.mul = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var a0 = this.w;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.xy;
            var b0 = rhs.w;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.xy;
            var c0 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var c1 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var c2 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var c3 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return new Euclidean2(c0, c1, c2, c3, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__mul__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                return this.mul(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rmul__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.mul(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).mul(this);
            }
        };
        Euclidean2.prototype.scale = function (α) {
            return new Euclidean2(this.w * α, this.x * α, this.y * α, this.xy * α, this.uom);
        };
        Euclidean2.prototype.div = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            return divide(this.w, this.x, this.y, this.xy, rhs.w, rhs.x, rhs.y, rhs.xy, Unit.div(this.uom, rhs.uom));
        };
        Euclidean2.prototype.divByScalar = function (α) {
            return new Euclidean2(this.w / α, this.x / α, this.y / α, this.xy / α, this.uom);
        };
        Euclidean2.prototype.__div__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.div(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rdiv__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.div(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).div(this);
            }
        };
        Euclidean2.scp = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            var x1 = 0;
            var x2 = 0;
            var x3 = 0;
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.scp = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var a0 = this.w;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.xy;
            var b0 = this.w;
            var b1 = this.x;
            var b2 = this.y;
            var b3 = this.xy;
            var c0 = scpE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            return new Euclidean2(c0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.ext = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.ext = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.ext(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__wedge__ = function (other) {
            if (other instanceof Euclidean2) {
                var rhs = other;
                return this.ext(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.ext(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rwedge__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.ext(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).ext(this);
            }
        };
        Euclidean2.lshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.lerp = function (target, α) {
            // FIXME: TODO
            return this;
        };
        Euclidean2.prototype.lco = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.lshift(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__lshift__ = function (other) {
            if (other instanceof Euclidean2) {
                var rhs = other;
                return this.lco(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.lco(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rlshift__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.lco(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).lco(this);
            }
        };
        Euclidean2.rshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.rco = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.rshift(this.coords, rhs.coords);
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__rshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.rco(other);
            }
            else if (typeof other === 'number') {
                return this.rco(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rrshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.rco(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).rco(this);
            }
        };
        Euclidean2.prototype.__vbar__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.scp(other);
            }
            else if (typeof other === 'number') {
                return this.scp(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rvbar__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.scp(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).scp(this);
            }
        };
        Euclidean2.prototype.pow = function (exponent) {
            // assertArgEuclidean2('exponent', exponent);
            throw new Error('pow');
        };
        Euclidean2.prototype.__bang__ = function () {
            return this.inv();
        };
        Euclidean2.prototype.__pos__ = function () {
            return this;
        };
        Euclidean2.prototype.neg = function () {
            return new Euclidean2(-this.α, -this.x, -this.y, -this.β, this.uom);
        };
        Euclidean2.prototype.__neg__ = function () {
            return this.neg();
        };
        /**
         * ~ (tilde) produces reversion.
         */
        Euclidean2.prototype.__tilde__ = function () {
            return new Euclidean2(this.α, this.x, this.y, -this.β, this.uom);
        };
        Euclidean2.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
            switch (grade) {
                case 0:
                    return new Euclidean2(this.α, 0, 0, 0, this.uom);
                case 1:
                    return new Euclidean2(0, this.x, this.y, 0, this.uom);
                case 2:
                    return new Euclidean2(0, 0, 0, this.β, this.uom);
                default:
                    return new Euclidean2(0, 0, 0, 0, this.uom);
            }
        };
        Euclidean2.prototype.cos = function () {
            throw new Error('cos');
        };
        Euclidean2.prototype.cosh = function () {
            throw new Error('cosh');
        };
        Euclidean2.prototype.exp = function () {
            Unit.assertDimensionless(this.uom);
            var expα = exp(this.α);
            var cosβ = cos(this.β);
            var sinβ = sin(this.β);
            return new Euclidean2(expα * cosβ, 0, 0, expα * sinβ, this.uom);
        };
        Euclidean2.prototype.inv = function () {
            throw new Error('inv');
        };
        Euclidean2.prototype.log = function () {
            throw new Error('log');
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        Euclidean2.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        Euclidean2.prototype.norm = function () {
            return new Euclidean2(this.magnitude(), 0, 0, 0, this.uom);
        };
        Euclidean2.prototype.quad = function () {
            return new Euclidean2(this.squaredNorm(), 0, 0, 0, Unit.mul(this.uom, this.uom));
        };
        Euclidean2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2(t, this.x, controlPoint.x, endPoint.x);
            var y = b2(t, this.y, controlPoint.y, endPoint.y);
            return new Euclidean2(0, x, y, 0, this.uom);
        };
        Euclidean2.prototype.squaredNorm = function () {
            return this.w * this.w + this.x * this.x + this.y * this.y + this.xy * this.xy;
        };
        /**
         * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
         * @method reflect
         * @param n {VectorE2}
         * @return {Euclidean2}
         */
        Euclidean2.prototype.reflect = function (n) {
            // TODO: Optimize to minimize object creation and increase performance.
            var m = Euclidean2.fromVectorE2(n);
            return m.mul(this).mul(m).scale(-1);
        };
        Euclidean2.prototype.rev = function () {
            throw new Error('rev');
        };
        Euclidean2.prototype.rotate = function (R) {
            throw new Error('rotate');
        };
        Euclidean2.prototype.sin = function () {
            throw new Error('sin');
        };
        Euclidean2.prototype.sinh = function () {
            throw new Error('sinh');
        };
        Euclidean2.prototype.slerp = function (target, α) {
            // FIXME: TODO
            return this;
        };
        /**
         * @method tan
         * @return {Euclidean2}
         */
        Euclidean2.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        Euclidean2.prototype.isOne = function () { return this.w === 1 && this.x === 0 && this.y === 0 && this.xy === 0; };
        Euclidean2.prototype.isNaN = function () { return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.xy); };
        Euclidean2.prototype.isZero = function () { return this.w === 0 && this.x === 0 && this.y === 0 && this.xy === 0; };
        Euclidean2.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates(this.coords, coordToString, labels);
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
        Euclidean2.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toStringIJK = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
        };
        Euclidean2.prototype.toStringLATEX = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{12}"]);
        };
        /**
         * @method copy
         * @param M {GeometricE2}
         * @return {Euclidean2}
         * @static
         */
        Euclidean2.copy = function (m) {
            if (m instanceof Euclidean2) {
                return m;
            }
            else {
                return new Euclidean2(m.α, m.x, m.y, m.β, void 0);
            }
        };
        /**
         * @method fromVectorE2
         * @param vector {VectorE2}
         * @return {Euclidean2}
         * @static
         */
        Euclidean2.fromVectorE2 = function (vector) {
            if (isDefined(vector)) {
                if (vector instanceof Euclidean2) {
                    return new Euclidean2(0, vector.x, vector.y, 0, vector.uom);
                }
                else {
                    return new Euclidean2(0, vector.x, vector.y, 0, void 0);
                }
            }
            else {
                return void 0;
            }
        };
        return Euclidean2;
    })();
    return Euclidean2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/G2',["require", "exports", '../geometries/b2', '../geometries/b3', '../math/dotVectorE2', '../math/Euclidean2', '../math/extE2', '../checks/isDefined', '../checks/isNumber', '../checks/isObject', '../math/lcoE2', '../math/mulE2', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../math/quadVectorE2', '../math/rcoE2', '../math/rotorFromDirections', '../math/scpE2', '../math/stringFromCoordinates', '../math/VectorN', '../math/wedgeXY'], function (require, exports, b2, b3, dotVector, Euclidean2, extE2, isDefined, isNumber, isObject, lcoE2, mulE2, mustBeInteger, mustBeNumber, mustBeObject, quadVector, rcoE2, rotorFromDirections, scpE2, stringFromCoordinates, VectorN, wedgeXY) {
    // Symbolic constants for the coordinate indices into the data array.
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_XY = 3;
    var PI = Math.PI;
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var exp = Math.exp;
    var log = Math.log;
    var cos = Math.cos;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    //let ANTICLOCKWISE_GAPPED_CIRCLE = "⟲"
    //let ANTICLOCKWISE_CLOSED_CIRCLE = "⥀"
    //let CLOCKWISE_GAPPED_CIRCLE = "⟳"
    var LEFTWARDS_ARROW = "←";
    var RIGHTWARDS_ARROW = "→";
    var UPWARDS_ARROW = "↑";
    var DOWNWARDS_ARROW = "↓";
    var BULLSEYE = "◎";
    var CLOCKWISE_OPEN_CIRCLE_ARROW = "↻";
    var ANTICLOCKWISE_OPEN_CIRCLE_ARROW = "↺";
    var ARROW_LABELS = ["1", [LEFTWARDS_ARROW, RIGHTWARDS_ARROW], [DOWNWARDS_ARROW, UPWARDS_ARROW], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
    var STANDARD_LABELS = ["1", "e1", "e2", "I"];
    /**
     * Coordinates corresponding to basis labels.
     */
    function coordinates(m) {
        return [m.α, m.x, m.y, m.β];
    }
    /**
     * Promotes an unknown value to a G2, or returns undefined.
     */
    function duckCopy(value) {
        if (isObject(value)) {
            var m = value;
            if (isNumber(m.x) && isNumber(m.y)) {
                if (isNumber(m.α) && isNumber(m.β)) {
                    console.warn("Copying GeometricE2 to G2");
                    return G2.copy(m);
                }
                else {
                    console.warn("Copying VectorE2 to G2");
                    return G2.fromVector(m);
                }
            }
            else {
                if (isNumber(m.α) && isNumber(m.β)) {
                    console.warn("Copying SpinorE2 to G2");
                    return G2.fromSpinor(m);
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
    /**
     * @class G2
     * @extends VectorN
     * @beta
     */
    var G2 = (function (_super) {
        __extends(G2, _super);
        /**
         * Constructs a <code>G2</code>.
         * The multivector is initialized to zero.
         * @class G2
         * @beta
         * @constructor
         */
        function G2() {
            _super.call(this, [0, 0, 0, 0], false, 4);
        }
        Object.defineProperty(G2.prototype, "α", {
            /**
             * The coordinate corresponding to the unit standard basis scalar.
             * @property α
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_W];
            },
            set: function (α) {
                this.modified = this.modified || this.coords[COORD_W] !== α;
                this.coords[COORD_W] = α;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "x", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
             * @property x
             * @type {number}
             */
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
        Object.defineProperty(G2.prototype, "y", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
             * @property y
             * @type {number}
             */
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
        Object.defineProperty(G2.prototype, "β", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
             * @property β
             * @type {number}
             */
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (β) {
                this.modified = this.modified || this.coords[COORD_XY] !== β;
                this.coords[COORD_XY] = β;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "xy", {
            get: function () {
                return this.coords[COORD_XY];
            },
            set: function (xy) {
                this.modified = this.modified || this.coords[COORD_XY] !== xy;
                this.coords[COORD_XY] = xy;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @method add
         * @param M {GeometricE2}
         * @param [α = 1] {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('M', M);
            mustBeNumber('α', α);
            this.α += M.α * α;
            this.x += M.x * α;
            this.y += M.y * α;
            this.β += M.β * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + Iβ</code>
         * </p>
         * @method addPseudo
         * @param β {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.addPseudo = function (β) {
            mustBeNumber('β', β);
            this.β += β;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α</code>
         * </p>
         * @method addScalar
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.addScalar = function (α) {
            mustBeNumber('α', α);
            this.α += α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @method addVector
         * @param v {VectorE2}
         * @param [α = 1] {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('v', v);
            mustBeNumber('α', α);
            this.x += v.x * α;
            this.y += v.y * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.add2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.α = a.α + b.α;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.β = a.β + b.β;
            return this;
        };
        G2.prototype.adj = function () {
            throw new Error('TODO: G2.adj');
        };
        /**
         * @method angle
         * @return {G2}
         */
        G2.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * @method clone
         * @return {G2} <code>copy(this)</code>
         */
        G2.prototype.clone = function () {
            var m = new G2();
            m.copy(this);
            return m;
        };
        /**
         * <p>
         * <code>this ⟼ conjugate(this)</code>
         * </p>
         * @method conj
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.conj = function () {
            // FIXME: This is only the bivector part.
            // Also need to think about various involutions.
            this.β = -this.β;
            return this;
        };
        G2.prototype.cos = function () {
            throw new Error("TODO: G2.cos");
        };
        G2.prototype.cosh = function () {
            throw new Error("TODO: G2.cosh");
        };
        G2.prototype.distanceTo = function (point) {
            throw new Error("TODO: G2.distanceTo");
        };
        G2.prototype.equals = function (point) {
            throw new Error("TODO: G2.equals");
        };
        /**
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         * @method copy
         * @param M {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.copy = function (M) {
            mustBeObject('M', M);
            this.α = M.α;
            this.x = M.x;
            this.y = M.y;
            this.β = M.β;
            return this;
        };
        /**
         * Sets this multivector to the value of the scalar, <code>α</code>.
         * @method copyScalar
         * @return {G2}
         * @chainable
         */
        G2.prototype.copyScalar = function (α) {
            return this.zero().addScalar(α);
        };
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copySpinor
         * @param spinor {SpinorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.copySpinor = function (spinor) {
            mustBeObject('spinor', spinor);
            this.α = spinor.α;
            this.x = 0;
            this.y = 0;
            this.β = spinor.xy;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         * @method copyVector
         * @param vector {VectorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.copyVector = function (vector) {
            mustBeObject('vector', vector);
            this.α = 0;
            this.x = vector.x;
            this.y = vector.y;
            this.β = 0;
            return this;
        };
        /**
         * @method cubicBezier
         * @param t {number}
         * @param controlBegin {GeometricE2}
         * @param controlEnd {GeometricE2}
         * @param endPoint {GeometricE2}
         * @return {G2}
         */
        G2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var α = b3(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
            var x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var β = b3(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
            this.α = α;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         * @method div
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.div = function (m) {
            return this.div2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.divByScalar = function (α) {
            mustBeNumber('α', α);
            this.α /= α;
            this.x /= α;
            this.y /= α;
            this.β /= α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.div2 = function (a, b) {
            // FIXME: Generalize
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * @method dual
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.dual = function (m) {
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
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.exp = function () {
            var w = this.α;
            var z = this.β;
            var expW = exp(w);
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = sqrt(z * z);
            var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
            this.α = expW * cos(φ);
            this.β = z * s;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         * @method inv
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.inv = function () {
            // FIXME: TODO
            this.conj();
            // this.divByScalar(this.squaredNorm());
            return this;
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        G2.prototype.isOne = function () {
            return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        G2.prototype.isZero = function () {
            return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        /**
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @method lco
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.lco = function (m) {
            return this.lco2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @method lco2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.lco2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {GeometricE2}
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.lerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            this.α += (target.α - this.α) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.β += (target.β - this.β) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.lerp2 = function (a, b, α) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            mustBeNumber('α', α);
            this.copy(a).lerp(b, α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(sqrt(w * w + β * β)) + <b>e</b><sub>1</sub><b>e</b><sub>2</sub> * atan2(β, w)</code>
         * </p>
         * @method log
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.log = function () {
            // FIXME: This only handles the spinor components.
            var α = this.α;
            var β = this.β;
            this.α = log(sqrt(α * α + β * β));
            this.x = 0;
            this.y = 0;
            this.β = atan2(β, α);
            return this;
        };
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * @method magnitude
         * @return {number}
         */
        G2.prototype.magnitude = function () {
            return sqrt(this.squaredNorm());
        };
        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.mul = function (m) {
            return this.mul2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.mul2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         * @method neg
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.neg = function () {
            this.α = -this.α;
            this.x = -this.x;
            this.y = -this.y;
            this.β = -this.β;
            return this;
        };
        /**
        * <p>
        * <code>this ⟼ sqrt(this * conj(this))</code>
        * </p>
        * @method norm
        * @return {G2} <code>this</code>
        * @chainable
        */
        G2.prototype.norm = function () {
            this.α = this.magnitude();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method direction
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.direction = function () {
            // The squaredNorm is the squared norm.
            var norm = sqrt(this.squaredNorm());
            this.α = this.α / norm;
            this.x = this.x / norm;
            this.y = this.y / norm;
            this.β = this.β / norm;
            return this;
        };
        /**
         * Sets this multivector to the identity element for multiplication, <b>1</b>.
         * @method one
         * @return {G2}
         * @chainable
         */
        G2.prototype.one = function () {
            this.α = 1;
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        G2.prototype.pow = function () {
            throw new Error("TODO: G2.pow");
        };
        /**
         * <p>
         * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
         * </p>
         * <p>
         * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
         * </p>
         * @method quad
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.quad = function () {
            this.α = this.squaredNorm();
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        /**
         * @method quadraticBezier
         * @param t {number}
         * @param controlPoint {GeometricE2}
         * @param endPoint {GeometricE2}
         * @return {G2}
         */
        G2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var α = b2(t, this.α, controlPoint.α, endPoint.α);
            var x = b2(t, this.x, controlPoint.x, endPoint.x);
            var y = b2(t, this.y, controlPoint.y, endPoint.y);
            var β = b2(t, this.β, controlPoint.β, endPoint.β);
            this.α = α;
            this.x = x;
            this.y = y;
            this.β = β;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @method rco
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.rco = function (m) {
            return this.rco2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @method rco2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.rco2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @method reflect
         * @param n {VectorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.reflect = function (n) {
            // TODO: Optimize.
            mustBeObject('n', n);
            var N = Euclidean2.fromVectorE2(n);
            var M = Euclidean2.copy(this);
            var R = N.mul(M).mul(N).scale(-1);
            this.copy(R);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         * @method reverse
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.rev = function () {
            // reverse has a ++-- structure.
            this.α = this.α;
            this.x = this.x;
            this.y = this.y;
            this.β = -this.β;
            return this;
        };
        G2.prototype.sin = function () {
            throw new Error("G2.sin");
        };
        G2.prototype.sinh = function () {
            throw new Error("G2.sinh");
        };
        /**
         * @method __tilde__
         * @return {G2}
         */
        G2.prototype.__tilde__ = function () {
            return G2.copy(this).rev();
        };
        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @method rotate
         * @param R {SpinorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.rotate = function (R) {
            mustBeObject('R', R);
            // FIXME: This only rotates the vector components.
            var x = this.x;
            var y = this.y;
            var a = R.xy;
            var α = R.α;
            var ix = α * x + a * y;
            var iy = α * y - a * x;
            this.x = ix * α + iy * a;
            this.y = iy * α - ix * a;
            return this;
        };
        /**
         * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE2} The starting vector
         * @param b {VectorE2} The ending vector
         * @return {G2} <code>this</code> The rotor representing a rotation from a to b.
         * @chainable
         */
        G2.prototype.rotorFromDirections = function (a, b) {
            if (isDefined(rotorFromDirections(a, b, quadVector, dotVector, this))) {
                return this;
            }
            else {
                // In two dimensions, the rotation plane is not ambiguous.
                // FIXME: This is a bit dubious.
                // Probably better to make undefined a first-class concept.
                this.rotorFromGeneratorAngle(G2.I, PI);
            }
            return this;
        };
        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @method rotorFromGeneratorAngle
         * @param B {SpinorE2}
         * @param θ {number}
         * @return {G2} <code>this</code>
         */
        G2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            mustBeObject('B', B);
            mustBeNumber('θ', θ);
            // We assume that B really is just a bivector
            // by ignoring scalar and vector components.
            // Normally, B will have unit magnitude and B * B => -1.
            // However, we don't assume that is the case.
            // The effect will be a scaling of the angle.
            // A non unitary rotor, on the other hand, will scale the transformation.
            // We must also take into account the orientation of B.
            var β = B.xy;
            /**
             * Sandwich operation means we need the half-angle.
             */
            var φ = θ / 2;
            /**
             * scalar part = cos(|B| * θ / 2)
             */
            this.α = cos(abs(β) * φ);
            this.x = 0;
            this.y = 0;
            /**
             * pseudo part = -unit(B) * sin(|B| * θ / 2)
             */
            this.β = -sin(β * φ);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @method align
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.scp = function (m) {
            return this.scp2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @method scp2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.scp2 = function (a, b) {
            this.α = scpE2(a.α, a.x, a.y, a.β, b.α, b.x, b.y, b.β, 0);
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         */
        G2.prototype.scale = function (α) {
            mustBeNumber('α', α);
            this.α *= α;
            this.x *= α;
            this.y *= α;
            this.β *= α;
            return this;
        };
        G2.prototype.slerp = function (target, α) {
            mustBeObject('target', target);
            mustBeNumber('α', α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b = a · b + a ^ b</code>
         * </p>
         * Sets this G2 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @return {G2} <code>this</code>
         */
        G2.prototype.spinor = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var bx = b.x;
            var by = b.y;
            this.α = dotVector(a, b);
            this.x = 0;
            this.y = 0;
            this.β = wedgeXY(ax, ay, 0, bx, by, 0); // FIXME wedgeVectorsE2
            return this;
        };
        /**
         * Computes the <em>squared norm</em> of this <code>G2</code> multivector.
         * @method squaredNorm
         * @return {number} <code>this | ~this</code>
         */
        G2.prototype.squaredNorm = function () {
            var w = this.α;
            var x = this.x;
            var y = this.y;
            var B = this.β;
            return w * w + x * x + y * y + B * B;
        };
        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @method sub
         * @param M {GeometricE2}
         * @param [α = 1] {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            mustBeObject('M', M);
            mustBeNumber('α', α);
            this.α -= M.α * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.β -= M.β * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.sub2 = function (a, b) {
            mustBeObject('a', a);
            mustBeObject('b', b);
            this.α = a.α - b.α;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.β = a.β - b.β;
            return this;
        };
        /**
         * Returns a string representing the number in exponential notation.
         * @method toExponential
         * @return {string}
         */
        G2.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return stringFromCoordinates(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        /**
         * Returns a string representing the number in fixed-point notation.
         * @method toFixed
         * @param [fractionDigits] {number}
         * @return {string}
         */
        G2.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        /**
         * Returns a string representation of the number.
         * @method toString
         * @return {string}
         */
        G2.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return stringFromCoordinates(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        G2.prototype.grade = function (grade) {
            mustBeInteger('grade', grade);
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
        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @method wedge
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.ext = function (m) {
            return this.ext2(this, m);
        };
        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @method ext2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        G2.prototype.ext2 = function (a, b) {
            var a0 = a.α;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.β;
            var b0 = b.α;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.β;
            this.α = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            this.x = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            this.y = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            this.β = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return this;
        };
        /**
         * Sets this multivector to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {G2}
         * @chainable
         */
        G2.prototype.zero = function () {
            this.α = 0;
            this.x = 0;
            this.y = 0;
            this.β = 0;
            return this;
        };
        /**
         * @method __add__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__add__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).add(rhs);
            }
            else if (typeof rhs === 'number') {
                // Addition commutes, but addScalar might be useful.
                return G2.fromScalar(rhs).add(this);
            }
            else {
                var rhsCopy = duckCopy(rhs);
                if (rhsCopy) {
                    // rhs is a copy and addition commutes.
                    return rhsCopy.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __div__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__div__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).div(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).divByScalar(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rdiv__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).div(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).div(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __mul__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).scale(rhs);
            }
            else {
                var rhsCopy = duckCopy(rhs);
                if (rhsCopy) {
                    // rhsCopy is a copy but multiplication does not commute.
                    // If we had rmul then we could mutate the rhs!
                    return this.__mul__(rhsCopy);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __rmul__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).mul(this);
            }
            else if (typeof lhs === 'number') {
                // Scalar multiplication commutes.
                return G2.copy(this).scale(lhs);
            }
            else {
                var lhsCopy = duckCopy(lhs);
                if (lhsCopy) {
                    // lhs is a copy, so we can mutate it, and use it on the left.
                    return lhsCopy.mul(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __radd__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).add(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).add(this);
            }
            else {
                var lhsCopy = duckCopy(lhs);
                if (lhsCopy) {
                    // lhs is a copy, so we can mutate it.
                    return lhsCopy.add(this);
                }
                else {
                    return void 0;
                }
            }
        };
        /**
         * @method __sub__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.fromScalar(-rhs).add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rsub__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).sub(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).sub(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __wedge__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).ext(rhs);
            }
            else if (typeof rhs === 'number') {
                // The outer product with a scalar is simply scalar multiplication.
                return G2.copy(this).scale(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rwedge__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).ext(this);
            }
            else if (typeof lhs === 'number') {
                // The outer product with a scalar is simply scalar multiplication, and commutes.
                return G2.copy(this).scale(lhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __lshift__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).lco(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rlshift__
         * @param other {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).lco(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).lco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rshift__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).rco(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rrshift__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).rco(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).rco(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __vbar__
         * @param rhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G2) {
                return G2.copy(this).scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return G2.copy(this).scp(G2.fromScalar(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __rvbar__
         * @param lhs {any}
         * @return {G2}
         * @private
         */
        G2.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G2) {
                return G2.copy(lhs).scp(this);
            }
            else if (typeof lhs === 'number') {
                return G2.fromScalar(lhs).scp(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @method __bang__
         * @return {G2}
         * @private
         * @chainable
         */
        G2.prototype.__bang__ = function () {
            return G2.copy(this).inv();
        };
        /**
         * @method __pos__
         * @return {G2}
         * @private
         * @chainable
         */
        G2.prototype.__pos__ = function () {
            // It's important that we make a copy whenever using operators.
            return G2.copy(this); /*.pos()*/
        };
        /**
         * @method __neg__
         * @return {G2}
         * @private
         * @chainable
         */
        G2.prototype.__neg__ = function () {
            return G2.copy(this).neg();
        };
        /**
         * Intentionally undocumented.
         */
        G2.fromCartesian = function (α, x, y, β) {
            var m = new G2();
            m.α = α;
            m.x = x;
            m.y = y;
            m.β = β;
            return m;
        };
        /**
         * @method copy
         * @param M {GeometricE2}
         * @return {G2}
         * @static
         */
        G2.copy = function (M) {
            var copy = new G2();
            copy.α = M.α;
            copy.x = M.x;
            copy.y = M.y;
            copy.β = M.β;
            return copy;
        };
        /**
         * @method fromScalar
         * @param α {number}
         * @return {G2}
         * @static
         * @chainable
         */
        G2.fromScalar = function (α) {
            return new G2().addScalar(α);
        };
        /**
         * @method fromSpinor
         * @param spinor {SpinorE2}
         * @return {G2}
         * @static
         */
        G2.fromSpinor = function (spinor) {
            return new G2().copySpinor(spinor);
        };
        /**
         * @method fromVector
         * @param vector {VectorE2}
         * @return {G2}
         * @static
         */
        G2.fromVector = function (vector) {
            if (isDefined(vector)) {
                return new G2().copyVector(vector);
            }
            else {
                // We could also return an undefined value here!
                return void 0;
            }
        };
        /**
        * @method lerp
        * @param A {GeometricE2}
        * @param B {GeometricE2}
        * @param α {number}
        * @return {G2} <code>A + α * (B - A)</code>
        * @static
        */
        G2.lerp = function (A, B, α) {
            return G2.copy(A).lerp(B, α);
            // return G2.copy(B).sub(A).scale(α).add(A)
        };
        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @method rotorFromDirections
         * @param a {VectorE2} The <em>from</em> vector.
         * @param b {VectorE2} The <em>to</em> vector.
         * @return {G2}
         * @static
         */
        G2.rotorFromDirections = function (a, b) {
            return new G2().rotorFromDirections(a, b);
        };
        /**
         * @property BASIS_LABELS
         * @type {(string | string[])[]}
         */
        G2.BASIS_LABELS = STANDARD_LABELS;
        /**
         * The identity element for addition, <b>0</b>.
         * @property zero
         * @type {G2}
         * @readOnly
         * @static
         */
        G2.zero = G2.fromCartesian(0, 0, 0, 0);
        /**
         * The identity element for multiplication, <b>1</b>.
         * @property one
         * @type {G2}
         * @readOnly
         * @static
         */
        G2.one = G2.fromCartesian(1, 0, 0, 0);
        /**
         * Basis vector corresponding to the <code>x</code> coordinate.
         * @property e1
         * @type {G2}
         * @readOnly
         * @static
         */
        G2.e1 = G2.fromCartesian(0, 1, 0, 0);
        /**
         * Basis vector corresponding to the <code>y</code> coordinate.
         * @property e2
         * @type {G2}
         * @readOnly
         * @static
         */
        G2.e2 = G2.fromCartesian(0, 0, 1, 0);
        /**
         * Basis vector corresponding to the <code>β</code> coordinate.
         * @property I
         * @type {G2}
         * @readOnly
         * @static
         */
        G2.I = G2.fromCartesian(0, 0, 0, 1);
        return G2;
    })(VectorN);
    return G2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/math/R4',["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    var exp = Math.exp;
    var log = Math.log;
    var sqrt = Math.sqrt;
    /**
     * @class R4
     */
    var R4 = (function (_super) {
        __extends(R4, _super);
        /**
         * @class R4
         * @constructor
         * @param data {number[]} Default is [0, 0, 0, 0].
         * @param modified {boolean} Default is false.
         */
        function R4(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 4);
        }
        Object.defineProperty(R4.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
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
        Object.defineProperty(R4.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
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
        Object.defineProperty(R4.prototype, "z", {
            /**
             * @property z
             * @type Number
             */
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
        Object.defineProperty(R4.prototype, "w", {
            /**
             * @property w
             * @type Number
             */
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
        R4.prototype.setW = function (w) {
            this.w = w;
            return this;
        };
        R4.prototype.add = function (vector, α) {
            if (α === void 0) { α = 1; }
            this.x += vector.x * α;
            this.y += vector.y * α;
            this.z += vector.z * α;
            this.w += vector.w * α;
            return this;
        };
        R4.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.w = a.w + b.w;
            return this;
        };
        R4.prototype.clone = function () {
            return new R4([this.x, this.y, this.z, this.w]);
        };
        R4.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = v.w;
            return this;
        };
        R4.prototype.divByScalar = function (α) {
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.w /= α;
            return this;
        };
        R4.prototype.lerp = function (target, α) {
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.w += (target.w - this.w) * α;
            return this;
        };
        R4.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        R4.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
            return this;
        };
        R4.prototype.scale = function (α) {
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.w *= α;
            return this;
        };
        R4.prototype.reflect = function (n) {
            // TODO
            return this;
        };
        R4.prototype.rotate = function (rotor) {
            // TODO
            return this;
        };
        R4.prototype.slerp = function (target, α) {
            return this;
        };
        R4.prototype.sub = function (v, α) {
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            this.w -= v.w * α;
            return this;
        };
        R4.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;
            return this;
        };
        R4.prototype.magnitude = function () {
            throw new Error("TODO: R4.magnitude()");
        };
        R4.prototype.squaredNorm = function () {
            throw new Error("TODO: R4.squaredNorm()");
        };
        R4.prototype.toExponential = function () {
            return "TODO R4.toExponential";
        };
        R4.prototype.toFixed = function (digits) {
            return "TODO R4.toFixed";
        };
        R4.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
            return this;
        };
        return R4;
    })(VectorN);
    return R4;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/AmbientLight',["require", "exports", '../core/Color', '../checks/mustBeNumber', '../checks/mustBeObject', '../utils/Shareable', '../core/Symbolic'], function (require, exports, Color, mustBeNumber, mustBeObject, Shareable, Symbolic) {
    var LOGGING_NAME = 'AmbientLight';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class AmbientLight
     * @extends Shareable
     */
    var AmbientLight = (function (_super) {
        __extends(AmbientLight, _super);
        /**
         * Constructs a white light in the -e3 direction.
         * @class AmbientLight
         * @constructor
         */
        function AmbientLight(color) {
            _super.call(this, 'AmbientLight');
            mustBeObject('color', color);
            // FIXME: Need some kind of locking for constants
            this.color = Color.white.clone();
            this.color.r = mustBeNumber('color.r', color.r);
            this.color.g = mustBeNumber('color.g', color.g);
            this.color.b = mustBeNumber('color.b', color.b);
        }
        /**
         * @method destructor
         * @type {void}
         * @protected
         */
        AmbientLight.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        AmbientLight.prototype.getProperty = function (name) {
            return void 0;
        };
        AmbientLight.prototype.setProperty = function (name, value) {
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        AmbientLight.prototype.setUniforms = function (visitor, canvasId) {
            var coords = [this.color.r, this.color.g, this.color.b];
            visitor.vector3(Symbolic.UNIFORM_AMBIENT_LIGHT, coords, canvasId);
        };
        return AmbientLight;
    })(Shareable);
    return AmbientLight;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/ColorFacet',["require", "exports", '../checks/mustBeNumber', '../utils/Shareable', '../core/Symbolic'], function (require, exports, mustBeNumber, Shareable, Symbolic) {
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    /**
     * @class ColorFacet
     */
    var ColorFacet = (function (_super) {
        __extends(ColorFacet, _super);
        /**
         * @class ColorFacet
         * @constructor
         */
        function ColorFacet() {
            _super.call(this, 'ColorFacet');
            /**
             * @property xyz
             * @type {number[]}
             * @private
             */
            this.xyz = [1, 1, 1];
            /**
             * @property a
             * @type {number}
             * @private
             */
            this.a = 1;
            this.uColorName = Symbolic.UNIFORM_COLOR;
            this.uAlphaName = Symbolic.UNIFORM_ALPHA;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ColorFacet.prototype.destructor = function () {
            this.xyz = void 0;
            _super.prototype.destructor.call(this);
        };
        ColorFacet.prototype.incRef = function () {
            this.addRef();
            return this;
        };
        ColorFacet.prototype.decRef = function () {
            this.release();
            return this;
        };
        Object.defineProperty(ColorFacet.prototype, "r", {
            /**
             * The red component of the color.
             * @property r
             * @type {number}
             */
            get: function () {
                return this.xyz[COORD_R];
            },
            set: function (red) {
                mustBeNumber('red', red);
                this.xyz[COORD_R] = red;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "g", {
            /**
             * The green component of the color.
             * @property g
             * @type {number}
             */
            get: function () {
                return this.xyz[COORD_G];
            },
            set: function (green) {
                mustBeNumber('green', green);
                this.xyz[COORD_G] = green;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "b", {
            /**
             * The blue component of the color.
             * @property b
             * @type {number}
             */
            get: function () {
                return this.xyz[COORD_B];
            },
            set: function (blue) {
                this.xyz[COORD_B] = blue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "α", {
            /**
             * The alpha component of the color.
             * @property α
             * @type {number}
             */
            get: function () {
                return this.a;
            },
            set: function (α) {
                this.a = α;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method scaleRGB
         * @param α {number}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.scaleRGB = function (α) {
            this.r *= α;
            this.g *= α;
            this.b *= α;
            return this;
        };
        /**
         * @method scaleRGBA
         * @param α {number}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.scaleRGBA = function (α) {
            this.r *= α;
            this.g *= α;
            this.b *= α;
            this.α *= α;
            return this;
        };
        /**
         * @method setColorRGB
         * @param color {ColorRGB}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.setColorRGB = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            return this;
        };
        /**
         * @method setColorRGBA
         * @param color {ColorRGBA}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.setColorRGBA = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            this.α = color.α;
            return this;
        };
        /**
         * @method setRGB
         * @param red {number}
         * @param green {number}
         * @param blue {number}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.setRGB = function (red, green, blue) {
            this.r = red;
            this.g = green;
            this.b = blue;
            return this;
        };
        /**
         * @method setRGBA
         * @param red {number}
         * @param green {number}
         * @param blue {number}
         * @param α {number}
         * @return {ColorFacet}
         * @chainable
         */
        ColorFacet.prototype.setRGBA = function (red, green, blue, α) {
            this.r = red;
            this.g = green;
            this.b = blue;
            this.α = α;
            return this;
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
        ColorFacet.prototype.getProperty = function (name) {
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
                    console.warn("ColorFacet.getProperty " + name);
                    return void 0;
                }
            }
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param data {number[]}
         * @return {void}
         */
        ColorFacet.prototype.setProperty = function (name, data) {
            switch (name) {
                case ColorFacet.PROP_RGB: {
                    this.r = data[COORD_R];
                    this.g = data[COORD_G];
                    this.b = data[COORD_B];
                    break;
                }
                case ColorFacet.PROP_RED: {
                    this.r = data[COORD_R];
                    break;
                }
                default: {
                    console.warn("ColorFacet.setProperty " + name);
                }
            }
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        ColorFacet.prototype.setUniforms = function (visitor, canvasId) {
            if (this.uColorName) {
                visitor.vector3(this.uColorName, this.xyz, canvasId);
            }
            if (this.uAlphaName) {
                visitor.uniform1f(this.uAlphaName, this.a, canvasId);
            }
        };
        /**
         * property PROP_RGB
         * @type {string}
         * @static
         */
        ColorFacet.PROP_RGB = 'rgb';
        /**
         * property PROP_RGBA
         * @type {string}
         * @static
         */
        ColorFacet.PROP_RGBA = 'rgba';
        /**
         * property PROP_RED
         * @type {string}
         * @static
         */
        ColorFacet.PROP_RED = 'red';
        /**
         * property PROP_GREEN
         * @type {string}
         * @static
         */
        ColorFacet.PROP_GREEN = 'green';
        /**
         * property PROP_BLUE
         * @type {string}
         * @static
         */
        ColorFacet.PROP_BLUE = 'blue';
        /**
         * property PROP_ALPHA
         * @type {string}
         * @static
         */
        ColorFacet.PROP_ALPHA = 'alpha';
        return ColorFacet;
    })(Shareable);
    return ColorFacet;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/DirectionalLight',["require", "exports", '../core/Color', '../checks/mustBeObject', '../checks/mustBeString', '../utils/Shareable', '../core/Symbolic', '../math/R3'], function (require, exports, Color, mustBeObject, mustBeString, Shareable, Symbolic, R3) {
    var LOGGING_NAME = 'DirectionalLight';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class DirectionalLight
     * @extends Shareable
     */
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        /**
         * @class DirectionalLight
         * @constructor
         * @param direction {VectorE3}
         * @param color [ColorRGB = Color.white]
         */
        function DirectionalLight(direction, color) {
            if (color === void 0) { color = Color.white; }
            _super.call(this, 'DirectionalLight');
            mustBeObject('direction', direction);
            mustBeObject('color', color);
            this.direction = R3.copy(direction).direction();
            this.color = Color.fromColor(color);
        }
        /**
         * @method destructor
         * @type {void}
         * @protected
         */
        DirectionalLight.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
        DirectionalLight.prototype.getProperty = function (name) {
            mustBeString('name', name);
            switch (name) {
                case DirectionalLight.PROP_COLOR: {
                    return this.color.coords;
                }
                case DirectionalLight.PROP_DIRECTION: {
                    return this.direction.coords;
                }
                default: {
                    console.warn("unknown property: " + name);
                }
            }
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param value {number[]}
         * @return {void}
         */
        DirectionalLight.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeObject('value', value);
            switch (name) {
                case DirectionalLight.PROP_COLOR: {
                    this.color.coords = value;
                    break;
                }
                case DirectionalLight.PROP_DIRECTION: {
                    this.direction.coords = value;
                    break;
                }
                default: {
                    console.warn("unknown property: " + name);
                }
            }
        };
        /**
         * @method setColor
         * @param color {ColorRGB}
         * @return {DirectionalLight}
         * @chainable
         */
        DirectionalLight.prototype.setColor = function (color) {
            mustBeObject('color', color);
            this.color.copy(color);
            return this;
        };
        /**
         * @method setDirection
         * @param direction {VectorE3}
         * @return {DirectionalLight}
         * @chainable
         */
        DirectionalLight.prototype.setDirection = function (direction) {
            mustBeObject('direction', direction);
            this.direction.copy(direction).direction();
            return this;
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        DirectionalLight.prototype.setUniforms = function (visitor, canvasId) {
            visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.coords, canvasId);
            var coords = [this.color.r, this.color.g, this.color.b];
            visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, coords, canvasId);
        };
        /**
         * The name of the property that designates the color.
         * @property PROP_COLOR
         * @type {string}
         * @default 'color'
         * @static
         * @readOnly
         */
        DirectionalLight.PROP_COLOR = 'color';
        /**
         * The name of the property that designates the direction.
         * @property PROP_DIRECTION
         * @type {string}
         * @default 'direction'
         * @static
         * @readOnly
         */
        DirectionalLight.PROP_DIRECTION = 'direction';
        return DirectionalLight;
    })(Shareable);
    return DirectionalLight;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/EulerFacet',["require", "exports", '../i18n/readOnly', '../utils/Shareable', '../math/R3'], function (require, exports, readOnly, Shareable, R3) {
    /**
     * @class EulerFacet
     */
    var EulerFacet = (function (_super) {
        __extends(EulerFacet, _super);
        /**
         * @class EulerFacet
         * @constructor
         */
        function EulerFacet() {
            _super.call(this, 'EulerFacet');
            this._rotation = new R3();
        }
        EulerFacet.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        EulerFacet.prototype.getProperty = function (name) {
            return void 0;
        };
        EulerFacet.prototype.setProperty = function (name, value) {
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        EulerFacet.prototype.setUniforms = function (visitor, canvasId) {
            console.warn("EulerFacet.setUniforms");
        };
        Object.defineProperty(EulerFacet.prototype, "rotation", {
            /**
             * @property rotation
             * @type {R3}
             * @readOnly
             */
            get: function () {
                return this._rotation;
            },
            set: function (unused) {
                throw new Error(readOnly('rotation').message);
            },
            enumerable: true,
            configurable: true
        });
        return EulerFacet;
    })(Shareable);
    return EulerFacet;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/models/ModelE3',["require", "exports", '../checks/mustBeString', '../math/G3', '../math/R3', '../math/SpinG3', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, mustBeString, G3, R3, SpinG3, readOnly, Shareable) {
    /**
     * @class ModelE3
     */
    var ModelE3 = (function (_super) {
        __extends(ModelE3, _super);
        /**
         * <p>
         * A collection of properties for Rigid Body Modeling.
         * </p>
         * <p>
         * ModelE3 implements IFacet required for manipulating a drawable object.
         * </p>
         * <p>
         * Constructs a ModelE3 at the origin and with unity attitude.
         * </p>
         * @class ModelE3
         * @constructor
         * @param type [string = 'ModelE3'] The name used for reference counting.
         */
        function ModelE3(type) {
            if (type === void 0) { type = 'ModelE3'; }
            _super.call(this, mustBeString('type', type));
            /**
             * @property _position
             * @type {G3}
             * @private
             */
            this._position = new G3().zero();
            /**
             * @property _attitude
             * @type {G3}
             * @private
             */
            this._attitude = new G3().zero().addScalar(1);
            /**
             * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
             * @property _posCache
             * @type {R3}
             * @private
             */
            this._posCache = new R3();
            /**
             * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
             * @property _attCache
             * @type {SpinG3}
             * @private
             */
            this._attCache = new SpinG3();
            this._position.modified = true;
            this._attitude.modified = true;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ModelE3.prototype.destructor = function () {
            this._position = void 0;
            this._attitude = void 0;
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ModelE3.prototype, "R", {
            /**
             * <p>
             * The <em>attitude</em>, a unitary spinor.
             * </p>
             * @property R
             * @type G3
             * @readOnly
             */
            get: function () {
                return this._attitude;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelE3.PROP_ATTITUDE).message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelE3.prototype, "X", {
            /**
             * <p>
             * The <em>position</em>, a vector.
             * The vector <b>X</b> designates the center of mass of the body (Physics).
             * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
             * </p>
             *
             * @property X
             * @type G3
             * @readOnly
             */
            get: function () {
                return this._position;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelE3.PROP_POSITION).message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
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
        /**
         * @method setProperty
         * @param name {string}
         * @param data {number[]}
         * @return {void}
         */
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
        };
        /**
         * The name of the property that designates the attitude.
         * @property PROP_ATTITUDE
         * @type {string}
         * @default 'R'
         * @static
         * @readOnly
         */
        ModelE3.PROP_ATTITUDE = 'R';
        /**
         * The name of the property that designates the position.
         * @property PROP_POSITION
         * @type {string}
         * @default 'X'
         * @static
         * @readOnly
         */
        ModelE3.PROP_POSITION = 'X';
        return ModelE3;
    })(Shareable);
    return ModelE3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/ModelFacetE3',["require", "exports", '../math/Matrix3', '../math/Matrix4', '../models/ModelE3', '../checks/mustBeString', '../math/R3', '../i18n/readOnly', '../core/Symbolic'], function (require, exports, Matrix3, Matrix4, ModelE3, mustBeString, R3, readOnly, Symbolic) {
    /**
     * @class ModelFacetE3
     */
    var ModelFacetE3 = (function (_super) {
        __extends(ModelFacetE3, _super);
        /**
         * <p>
         * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
         * </p>
         * <p>
         * In Physics, the drawable object may represent a rigid body.
         * In Computer Graphics, the drawable object is a collection of drawing primitives.
         * </p>
         * <p>
         * ModelFacetE3 implements IFacet required for manipulating a drawable object.
         * </p>
         * <p>
         * Constructs a ModelFacetE3 at the origin and with unity attitude.
         * </p>
         * @class ModelFacetE3
         * @constructor
         * @param type [string = 'ModelFacetE3'] The name used for reference counting.
         */
        function ModelFacetE3(type) {
            if (type === void 0) { type = 'ModelFacetE3'; }
            _super.call(this, mustBeString('type', type));
            // FIXME: I don't like this non-geometric scaling.
            this._scaleXYZ = new R3([1, 1, 1]);
            this.matM = Matrix4.one();
            this.matN = Matrix3.one();
            this.matR = Matrix4.one();
            this.matS = Matrix4.one();
            this.matT = Matrix4.one();
            this._scaleXYZ.modified = true;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ModelFacetE3.prototype.destructor = function () {
            this._scaleXYZ = void 0;
            this.matM = void 0;
            this.matN = void 0;
            this.matR = void 0;
            this.matS = void 0;
            this.matT = void 0;
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ModelFacetE3.prototype, "scaleXYZ", {
            /**
             * @property scaleXYZ
             * @type R3
             * @readOnly
             */
            get: function () {
                return this._scaleXYZ;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelFacetE3.PROP_SCALEXYZ).message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         */
        ModelFacetE3.prototype.setUniforms = function (visitor, canvasId) {
            if (this.X.modified) {
                this.matT.translation(this.X);
                this.X.modified = false;
            }
            if (this.R.modified) {
                this.matR.rotation(this.R);
                this.R.modified = false;
            }
            if (this.scaleXYZ.modified) {
                this.matS.scaling(this.scaleXYZ);
                this.scaleXYZ.modified = false;
            }
            this.matM.copy(this.matT).mul(this.matR).mul(this.matS);
            this.matN.normalFromMatrix4(this.matM);
            visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.matM, canvasId);
            visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.matN, canvasId);
        };
        /**
         * @method incRef
         * @return {ModelFacetE3}
         * @chainable
         */
        ModelFacetE3.prototype.incRef = function () {
            this.addRef();
            return this;
        };
        /**
         * @method decRef
         * @return {ModelFacetE3}
         * @chainable
         */
        ModelFacetE3.prototype.decRef = function () {
            this.release();
            return this;
        };
        // FIXME: Make this scale so that we can be geometric?
        ModelFacetE3.PROP_SCALEXYZ = 'scaleXYZ';
        return ModelFacetE3;
    })(ModelE3);
    return ModelFacetE3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/PointSizeFacet',["require", "exports", '../checks/mustBeInteger', '../utils/Shareable', '../core/Symbolic'], function (require, exports, mustBeInteger, Shareable, Symbolic) {
    var LOGGING_NAME = 'PointSizeFacet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class PointSizeFacet
     */
    var PointSizeFacet = (function (_super) {
        __extends(PointSizeFacet, _super);
        /**
         * @class PointSizeFacet
         * @constructor
         * @param [pointSize = 2] {number}
         */
        function PointSizeFacet(pointSize) {
            if (pointSize === void 0) { pointSize = 2; }
            _super.call(this, 'PointSizeFacet');
            this.pointSize = mustBeInteger('pointSize', pointSize);
        }
        PointSizeFacet.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        PointSizeFacet.prototype.getProperty = function (name) {
            return void 0;
        };
        PointSizeFacet.prototype.setProperty = function (name, value) {
        };
        PointSizeFacet.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniform1f(Symbolic.UNIFORM_POINT_SIZE, this.pointSize, canvasId);
        };
        return PointSizeFacet;
    })(Shareable);
    return PointSizeFacet;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/ReflectionFacet',["require", "exports", '../math/CartesianE3', '../checks/mustBeArray', '../checks/mustBeString', '../math/R3', '../math/Matrix4', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, CartesianE3, mustBeArray, mustBeString, R3, Matrix4, readOnly, Shareable) {
    /**
     * @class ReflectionFacet
     * @extends Shareable
     */
    var ReflectionFacet = (function (_super) {
        __extends(ReflectionFacet, _super);
        /**
         * @class ReflectionFacet
         * @constructor
         * @param name {string} The name of the uniform variable.
         */
        function ReflectionFacet(name) {
            _super.call(this, 'ReflectionFacet');
            /**
             * @property matrix
             * @type {Matrix4}
             * @private
             */
            this.matrix = Matrix4.one();
            this.name = mustBeString('name', name);
            // The mathematics of the reflection causes a zero vector to be the identity transformation.
            this._normal = new R3().copy(CartesianE3.zero);
            this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacet.prototype, "normal", {
            /**
             * @property normal
             * @type R3
             * @readOnly
             */
            get: function () {
                return this._normal;
            },
            set: function (unused) {
                throw new Error(readOnly('normal').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ReflectionFacet.prototype.destructor = function () {
            this._normal = void 0;
            this.matrix = void 0;
            _super.prototype.destructor.call(this);
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {Array<number>}
         */
        ReflectionFacet.prototype.getProperty = function (name) {
            mustBeString('name', name);
            return void 0;
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param value {Array<number>}
         * @return {void}
         */
        ReflectionFacet.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeArray('value', value);
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        ReflectionFacet.prototype.setUniforms = function (visitor, canvasId) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.uniformMatrix4(this.name, false, this.matrix, canvasId);
        };
        return ReflectionFacet;
    })(Shareable);
    return ReflectionFacet;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/RigidBodyFacetE3',["require", "exports", '../facets/ModelFacetE3', '../math/G3'], function (require, exports, ModelFacetE3, G3) {
    /**
     * @class RigidBodyFacetE3
     * @extends ModelFacetE3
     */
    var RigidBodyFacetE3 = (function (_super) {
        __extends(RigidBodyFacetE3, _super);
        /**
         * <p>
         * Constructs a RigidBodyFacetE3.
         * </p>
         * @class RigidBodyFacetE3
         * @constructor
         * @param [type = 'RigidBodyFacetE3'] {string} The name used for reference counting.
         */
        function RigidBodyFacetE3(type) {
            if (type === void 0) { type = 'RigidBodyFacetE3'; }
            _super.call(this, type);
            /**
             * <p>
             * The <em>linear velocity</em>, a vector.
             * </p>
             * @property V
             * @type {G3}
             * @default 0
             */
            this.V = new G3().zero();
            /**
             * <p>
             * The <em>rotational velocity</em>, a bivector.
             * </p>
             * @property Ω
             * @type {G3}
             * @default <b>1</b>
             */
            this.Ω = new G3().one();
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        RigidBodyFacetE3.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        RigidBodyFacetE3.prototype.getProperty = function (name) {
            return _super.prototype.getProperty.call(this, name);
        };
        RigidBodyFacetE3.prototype.setProperty = function (name, value) {
            return _super.prototype.setProperty.call(this, name, value);
        };
        return RigidBodyFacetE3;
    })(ModelFacetE3);
    return RigidBodyFacetE3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/facets/Vector3Facet',["require", "exports", '../checks/mustBeObject', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, mustBeObject, mustBeString, Shareable) {
    var LOGGING_NAME = 'Vector3Facet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class Vector3Facet
     */
    var Vector3Facet = (function (_super) {
        __extends(Vector3Facet, _super);
        /**
         * @class Vector3Facet
         * @constructor
         * @param name {string}
         * @param vector {R3}
         */
        function Vector3Facet(name, vector) {
            _super.call(this, 'Vector3Facet');
            this._name = mustBeString('name', name, contextBuilder);
            this._vector = mustBeObject('vector', vector, contextBuilder);
        }
        Vector3Facet.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Vector3Facet.prototype.getProperty = function (name) {
            return void 0;
        };
        Vector3Facet.prototype.setProperty = function (name, value) {
        };
        Vector3Facet.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniformVectorE3(this._name, this._vector, canvasId);
        };
        return Vector3Facet;
    })(Shareable);
    return Vector3Facet;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/models/ModelE2',["require", "exports", '../checks/mustBeString', '../math/G2', '../math/R2', '../math/SpinG2', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, mustBeString, G2, R2, SpinG2, readOnly, Shareable) {
    /**
     * @class ModelE2
     */
    var ModelE2 = (function (_super) {
        __extends(ModelE2, _super);
        /**
         * <p>
         * A collection of properties for Rigid Body Modeling.
         * </p>
         * <p>
         * ModelE2 implements IFacet required for manipulating a drawable object.
         * </p>
         * <p>
         * Constructs a ModelE2 at the origin and with unity attitude.
         * </p>
         * @class ModelE2
         * @constructor
         * @param type [string = 'ModelE2'] The name used for reference counting.
         */
        function ModelE2(type) {
            if (type === void 0) { type = 'ModelE2'; }
            _super.call(this, mustBeString('type', type));
            this._position = new G2().zero();
            this._attitude = new G2().zero().addScalar(1);
            /**
             * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
             * @property _posCache
             * @type {R2}
             * @private
             */
            this._posCache = new R2();
            /**
             * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
             * @property _attCache
             * @type {SpinG2}
             * @private
             */
            this._attCache = new SpinG2();
            this._position.modified = true;
            this._attitude.modified = true;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ModelE2.prototype.destructor = function () {
            this._position = void 0;
            this._attitude = void 0;
        };
        Object.defineProperty(ModelE2.prototype, "R", {
            /**
             * <p>
             * The <em>attitude</em>, a unitary spinor.
             * </p>
             * @property R
             * @type G2
             * @readOnly
             */
            get: function () {
                return this._attitude;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelE2.PROP_ATTITUDE).message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelE2.prototype, "X", {
            /**
             * <p>
             * The <em>position</em>, a vector.
             * The vector <b>X</b> designates the center of mass of the body (Physics).
             * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
             * </p>
             *
             * @property X
             * @type G2
             * @readOnly
             */
            get: function () {
                return this._position;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelE2.PROP_POSITION).message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
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
        /**
         * @method setProperty
         * @param name {string}
         * @param data {number[]}
         * @return {void}
         */
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
        };
        /**
         * The name of the property that designates the attitude.
         * @property PROP_ATTITUDE
         * @type {string}
         * @default 'R'
         * @static
         * @readOnly
         */
        ModelE2.PROP_ATTITUDE = 'R';
        /**
         * The name of the property that designates the position.
         * @property PROP_POSITION
         * @type {string}
         * @default 'X'
         * @static
         * @readOnly
         */
        ModelE2.PROP_POSITION = 'X';
        return ModelE2;
    })(Shareable);
    return ModelE2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/models/RigidBodyE2',["require", "exports", '../models/ModelE2', '../math/G2'], function (require, exports, ModelE2, G2) {
    /**
     * @class RigidBodyE2
     * @extends ModelE2
     */
    var RigidBodyE2 = (function (_super) {
        __extends(RigidBodyE2, _super);
        /**
         * <p>
         * Constructs a RigidBodyE2.
         * </p>
         * @class RigidBodyE2
         * @constructor
         * @param [type = 'RigidBodyE2'] {string} The name used for reference counting.
         */
        function RigidBodyE2(type) {
            if (type === void 0) { type = 'RigidBodyE2'; }
            _super.call(this, type);
            /**
             * <p>
             * The <em>linear velocity</em>, a vector.
             * </p>
             * @property V
             * @type {G2}
             */
            this.V = new G2().zero();
            /**
             * <p>
             * The <em>rotational velocity</em>, a spinor.
             * </p>
             * @property Ω
             * @type {G2}
             */
            this.Ω = new G2().zero().addScalar(1);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        RigidBodyE2.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        return RigidBodyE2;
    })(ModelE2);
    return RigidBodyE2;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-eight/models/RigidBodyE3',["require", "exports", '../models/ModelE3', '../math/G3'], function (require, exports, ModelE3, G3) {
    /**
     * @class RigidBodyE3
     * @extends ModelE3
     */
    var RigidBodyE3 = (function (_super) {
        __extends(RigidBodyE3, _super);
        /**
         * <p>
         * Constructs a RigidBodyE3.
         * </p>
         * @class RigidBodyE3
         * @constructor
         * @param [type = 'RigidBodyE3'] {string} The name used for reference counting.
         */
        function RigidBodyE3(type) {
            if (type === void 0) { type = 'RigidBodyE3'; }
            _super.call(this, type);
            /**
             * <p>
             * The <em>linear velocity</em>, a vector.
             * </p>
             * @property V
             * @type {G3}
             */
            this.V = new G3().zero();
            /**
             * <p>
             * The <em>rotational velocity</em>, a spinor.
             * </p>
             * @property Ω
             * @type {G3}
             */
            this.Ω = new G3().zero().addScalar(1);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        RigidBodyE3.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        return RigidBodyE3;
    })(ModelE3);
    return RigidBodyE3;
});

define('davinci-eight/utils/workbench3D',["require", "exports"], function (require, exports) {
    var EVENT_NAME_RESIZE = 'resize';
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
     * canvas: An HTML canvas element to be inserted.
     * TODO: We should remove the camera as being too opinionated, replace with a callback providing
     */
    // FIXME: With renderer typed as `any`, anything could happen.
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
     * class WindowAnimationRunner
     * constructor
     * param animate The `animate` function is called for each animation frame.
     * param options.setUp The `setUp` function is called synchronously each time the start() method is called.
     * param options.tearDown The `tearDown` function is called asynchronously each time the animation is stopped.
     * param options.terminate The `terminate` function is called to determine whether the animation should stop.
     * param options.window {Window} The window in which the animation will run. Defaults to the global window.
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

define('davinci-eight',["require", "exports", 'davinci-eight/slideshow/Slide', 'davinci-eight/slideshow/Director', 'davinci-eight/slideshow/DirectorKeyboardHandler', 'davinci-eight/slideshow/animations/WaitAnimation', 'davinci-eight/slideshow/animations/ColorAnimation', 'davinci-eight/slideshow/animations/Vector2Animation', 'davinci-eight/slideshow/animations/Vector3Animation', 'davinci-eight/slideshow/animations/Spinor2Animation', 'davinci-eight/slideshow/animations/Spinor3Animation', 'davinci-eight/cameras/createFrustum', 'davinci-eight/cameras/createPerspective', 'davinci-eight/cameras/createView', 'davinci-eight/cameras/frustumMatrix', 'davinci-eight/cameras/perspectiveMatrix', 'davinci-eight/cameras/viewMatrix', 'davinci-eight/commands/BlendFactor', 'davinci-eight/commands/WebGLBlendFunc', 'davinci-eight/commands/WebGLClearColor', 'davinci-eight/commands/Capability', 'davinci-eight/commands/WebGLDisable', 'davinci-eight/commands/WebGLEnable', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Symbolic', 'davinci-eight/core/UniformLocation', 'davinci-eight/curves/Curve', 'davinci-eight/devices/Keyboard', 'davinci-eight/geometries/DrawAttribute', 'davinci-eight/geometries/DrawPrimitive', 'davinci-eight/geometries/Simplex', 'davinci-eight/geometries/Vertex', 'davinci-eight/geometries/simplicesToGeometryMeta', 'davinci-eight/geometries/computeFaceNormals', 'davinci-eight/geometries/cube', 'davinci-eight/geometries/quadrilateral', 'davinci-eight/geometries/square', 'davinci-eight/geometries/tetrahedron', 'davinci-eight/geometries/simplicesToDrawPrimitive', 'davinci-eight/geometries/triangle', 'davinci-eight/topologies/Topology', 'davinci-eight/topologies/PointTopology', 'davinci-eight/topologies/LineTopology', 'davinci-eight/topologies/MeshTopology', 'davinci-eight/topologies/GridTopology', 'davinci-eight/scene/createDrawList', 'davinci-eight/scene/Drawable', 'davinci-eight/scene/PerspectiveCamera', 'davinci-eight/scene/Scene', 'davinci-eight/scene/ContextGL', 'davinci-eight/geometries/AxialSimplexGeometry', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BarnSimplexGeometry', 'davinci-eight/geometries/ConeGeometry', 'davinci-eight/geometries/ConeSimplexGeometry', 'davinci-eight/geometries/CuboidGeometry', 'davinci-eight/geometries/CuboidSimplexGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/CylinderSimplexGeometry', 'davinci-eight/geometries/DodecahedronSimplexGeometry', 'davinci-eight/geometries/IcosahedronSimplexGeometry', 'davinci-eight/geometries/KleinBottleSimplexGeometry', 'davinci-eight/geometries/Simplex1Geometry', 'davinci-eight/geometries/MobiusStripSimplexGeometry', 'davinci-eight/geometries/OctahedronSimplexGeometry', 'davinci-eight/geometries/SliceSimplexGeometry', 'davinci-eight/geometries/GridSimplexGeometry', 'davinci-eight/geometries/PolyhedronSimplexGeometry', 'davinci-eight/geometries/RevolutionSimplexGeometry', 'davinci-eight/geometries/RingGeometry', 'davinci-eight/geometries/RingSimplexGeometry', 'davinci-eight/geometries/SphericalPolarSimplexGeometry', 'davinci-eight/geometries/TetrahedronSimplexGeometry', 'davinci-eight/geometries/VortexSimplexGeometry', 'davinci-eight/programs/createMaterial', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/programFromScripts', 'davinci-eight/materials/Material', 'davinci-eight/materials/HTMLScriptsMaterial', 'davinci-eight/materials/LineMaterial', 'davinci-eight/materials/MeshMaterial', 'davinci-eight/materials/MeshLambertMaterial', 'davinci-eight/materials/PointMaterial', 'davinci-eight/materials/SmartMaterialBuilder', 'davinci-eight/mappers/RoundUniform', 'davinci-eight/math/Dimensions', 'davinci-eight/math/Euclidean2', 'davinci-eight/math/Euclidean3', 'davinci-eight/math/mathcore', 'davinci-eight/math/R1', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/QQ', 'davinci-eight/math/Unit', 'davinci-eight/math/G2', 'davinci-eight/math/G3', 'davinci-eight/math/SpinG2', 'davinci-eight/math/SpinG3', 'davinci-eight/math/R2', 'davinci-eight/math/R3', 'davinci-eight/math/R4', 'davinci-eight/math/VectorN', 'davinci-eight/facets/AmbientLight', 'davinci-eight/facets/ColorFacet', 'davinci-eight/facets/DirectionalLight', 'davinci-eight/facets/EulerFacet', 'davinci-eight/facets/ModelFacetE3', 'davinci-eight/facets/PointSizeFacet', 'davinci-eight/facets/ReflectionFacet', 'davinci-eight/facets/RigidBodyFacetE3', 'davinci-eight/facets/Vector3Facet', 'davinci-eight/models/ModelE2', 'davinci-eight/models/ModelE3', 'davinci-eight/models/RigidBodyE2', 'davinci-eight/models/RigidBodyE3', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/utils/contextProxy', 'davinci-eight/collections/IUnknownArray', 'davinci-eight/collections/NumberIUnknownMap', 'davinci-eight/utils/refChange', 'davinci-eight/utils/Shareable', 'davinci-eight/collections/StringIUnknownMap', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, Slide, Director, DirectorKeyboardHandler, WaitAnimation, ColorAnimation, Vector2Animation, Vector3Animation, Spinor2Animation, Spinor3Animation, createFrustum, createPerspective, createView, frustumMatrix, perspectiveMatrix, viewMatrix, BlendFactor, WebGLBlendFunc, WebGLClearColor, Capability, WebGLDisable, WebGLEnable, AttribLocation, Color, core, DrawMode, Symbolic, UniformLocation, Curve, Keyboard, DrawAttribute, DrawPrimitive, Simplex, Vertex, simplicesToGeometryMeta, computeFaceNormals, cube, quadrilateral, square, tetrahedron, simplicesToDrawPrimitive, triangle, Topology, PointTopology, LineTopology, MeshTopology, GridTopology, createDrawList, Drawable, PerspectiveCamera, Scene, ContextGL, AxialSimplexGeometry, ArrowGeometry, BarnSimplexGeometry, ConeGeometry, ConeSimplexGeometry, CuboidGeometry, CuboidSimplexGeometry, CylinderGeometry, CylinderSimplexGeometry, DodecahedronSimplexGeometry, IcosahedronSimplexGeometry, KleinBottleSimplexGeometry, Simplex1Geometry, MobiusStripSimplexGeometry, OctahedronSimplexGeometry, SliceSimplexGeometry, GridSimplexGeometry, PolyhedronSimplexGeometry, RevolutionSimplexGeometry, RingGeometry, RingSimplexGeometry, SphericalPolarSimplexGeometry, TetrahedronSimplexGeometry, VortexSimplexGeometry, createMaterial, smartProgram, programFromScripts, Material, HTMLScriptsMaterial, LineMaterial, MeshMaterial, MeshLambertMaterial, PointMaterial, SmartMaterialBuilder, RoundUniform, Dimensions, Euclidean2, Euclidean3, mathcore, R1, Matrix3, Matrix4, QQ, Unit, G2, G3, SpinG2, SpinG3, R2, R3, R4, VectorN, AmbientLight, ColorFacet, DirectionalLight, EulerFacet, ModelFacetE3, PointSizeFacet, ReflectionFacet, RigidBodyFacetE3, Vector3Facet, ModelE2, ModelE3, RigidBodyE2, RigidBodyE3, initWebGL, renderer, contextProxy, IUnknownArray, NumberIUnknownMap, refChange, Shareable, StringIUnknownMap, workbench3D, windowAnimationRunner) {
    /**
     * @module EIGHT
     */
    var eight = {
        /**
         * The publish date of the latest version of the library.
         * @property LAST_MODIFIED
         * @type string
         * @readOnly
         */
        get LAST_MODIFIED() { return core.LAST_MODIFIED; },
        get strict() {
            return core.strict;
        },
        set strict(value) {
            core.strict = value;
        },
        /**
         * The semantic version of the library.
         * @property VERSION
         * @type string
         * @readOnly
         */
        get VERSION() { return core.VERSION; },
        // slideshow
        get Slide() { return Slide; },
        get Director() { return Director; },
        get DirectorKeyboardHandler() { return DirectorKeyboardHandler; },
        get ColorAnimation() { return ColorAnimation; },
        get WaitAnimation() { return WaitAnimation; },
        get Vector2Animation() { return Vector2Animation; },
        get Vector3Animation() { return Vector3Animation; },
        get Spinor2Animation() { return Spinor2Animation; },
        get Spinor3Animation() { return Spinor3Animation; },
        // devices
        get Keyboard() { return Keyboard; },
        // TODO: Arrange in alphabetical order in order to assess width of API.
        // materials
        get HTMLScriptsMaterial() { return HTMLScriptsMaterial; },
        get Material() { return Material; },
        get LineMaterial() { return LineMaterial; },
        get MeshMaterial() { return MeshMaterial; },
        get MeshLambertMaterial() { return MeshLambertMaterial; },
        get PointMaterial() { return PointMaterial; },
        get SmartMaterialBuilder() { return SmartMaterialBuilder; },
        //commands
        get BlendFactor() { return BlendFactor; },
        get Capability() { return Capability; },
        get WebGLBlendFunc() { return WebGLBlendFunc; },
        get WebGLClearColor() { return WebGLClearColor; },
        get WebGLDisable() { return WebGLDisable; },
        get WebGLEnable() { return WebGLEnable; },
        get initWebGL() { return initWebGL; },
        get createFrustum() { return createFrustum; },
        get createPerspective() { return createPerspective; },
        get createView() { return createView; },
        get ModelE2() { return ModelE2; },
        get ModelE3() { return ModelE3; },
        get EulerFacet() { return EulerFacet; },
        get RigidBodyFacetE3() { return RigidBodyFacetE3; },
        get ModelFacetE3() { return ModelFacetE3; },
        get RigidBodyE2() { return RigidBodyE2; },
        get RigidBodyE3() { return RigidBodyE3; },
        get Simplex() { return Simplex; },
        get Vertex() { return Vertex; },
        get frustumMatrix() { return frustumMatrix; },
        get perspectiveMatrix() { return perspectiveMatrix; },
        get viewMatrix() { return viewMatrix; },
        get Scene() { return Scene; },
        get Drawable() { return Drawable; },
        get PerspectiveCamera() { return PerspectiveCamera; },
        get ContextGL() { return ContextGL; },
        get createDrawList() { return createDrawList; },
        get renderer() { return renderer; },
        get webgl() { return contextProxy; },
        workbench: workbench3D,
        animation: windowAnimationRunner,
        get DrawMode() { return DrawMode; },
        get AttribLocation() { return AttribLocation; },
        get UniformLocation() { return UniformLocation; },
        get createMaterial() {
            return createMaterial;
        },
        get smartProgram() {
            return smartProgram;
        },
        get Color() { return Color; },
        get AxialSimplexGeometry() { return AxialSimplexGeometry; },
        get ArrowGeometry() { return ArrowGeometry; },
        get BarnSimplexGeometry() { return BarnSimplexGeometry; },
        get ConeGeometry() { return ConeGeometry; },
        get ConeSimplexGeometry() { return ConeSimplexGeometry; },
        get CuboidGeometry() { return CuboidGeometry; },
        get CuboidSimplexGeometry() { return CuboidSimplexGeometry; },
        get CylinderGeometry() { return CylinderGeometry; },
        get CylinderSimplexGeometry() { return CylinderSimplexGeometry; },
        get DodecahedronSimplexGeometry() { return DodecahedronSimplexGeometry; },
        get IcosahedronSimplexGeometry() { return IcosahedronSimplexGeometry; },
        get KleinBottleSimplexGeometry() { return KleinBottleSimplexGeometry; },
        get Simplex1Geometry() { return Simplex1Geometry; },
        get MobiusStripSimplexGeometry() { return MobiusStripSimplexGeometry; },
        get OctahedronSimplexGeometry() { return OctahedronSimplexGeometry; },
        get GridSimplexGeometry() { return GridSimplexGeometry; },
        get PolyhedronSimplexGeometry() { return PolyhedronSimplexGeometry; },
        get RevolutionSimplexGeometry() { return RevolutionSimplexGeometry; },
        get RingGeometry() { return RingGeometry; },
        get RingSimplexGeometry() { return RingSimplexGeometry; },
        get SliceSimplexGeometry() { return SliceSimplexGeometry; },
        get SphericalPolarSimplexGeometry() { return SphericalPolarSimplexGeometry; },
        get TetrahedronSimplexGeometry() { return TetrahedronSimplexGeometry; },
        // get TextSimplexGeometry() { return TextSimplexGeometry },
        get VortexSimplexGeometry() { return VortexSimplexGeometry; },
        get Topology() { return Topology; },
        get PointTopology() { return PointTopology; },
        get LineTopology() { return LineTopology; },
        get MeshTopology() { return MeshTopology; },
        get GridTopology() { return GridTopology; },
        get Dimensions() { return Dimensions; },
        get Unit() { return Unit; },
        get Euclidean2() { return Euclidean2; },
        get Euclidean3() { return Euclidean3; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get QQ() { return QQ; },
        get G2() { return G2; },
        get G3() { return G3; },
        get R1() { return R1; },
        get SpinG2() { return SpinG2; },
        get SpinG3() { return SpinG3; },
        get R2() { return R2; },
        get R3() { return R3; },
        get R4() { return R4; },
        get VectorN() { return VectorN; },
        get Curve() { return Curve; },
        // mappers
        get RoundUniform() { return RoundUniform; },
        get simplicesToGeometryMeta() { return simplicesToGeometryMeta; },
        get computeFaceNormals() { return computeFaceNormals; },
        get cube() { return cube; },
        get quadrilateral() { return quadrilateral; },
        get square() { return square; },
        get tetrahedron() { return tetrahedron; },
        get triangle() { return triangle; },
        get simplicesToDrawPrimitive() { return simplicesToDrawPrimitive; },
        get Symbolic() { return Symbolic; },
        // programs
        get programFromScripts() { return programFromScripts; },
        get DrawAttribute() { return DrawAttribute; },
        get DrawPrimitive() { return DrawPrimitive; },
        // facets
        get AmbientLight() { return AmbientLight; },
        get ColorFacet() { return ColorFacet; },
        get DirectionalLight() { return DirectionalLight; },
        get PointSizeFacet() { return PointSizeFacet; },
        get ReflectionFacet() { return ReflectionFacet; },
        get Vector3Facet() { return Vector3Facet; },
        // utils
        get IUnknownArray() { return IUnknownArray; },
        get NumberIUnknownMap() { return NumberIUnknownMap; },
        get refChange() { return refChange; },
        get Shareable() { return Shareable; },
        get StringIUnknownMap() { return StringIUnknownMap; },
        // universal math functions
        get cos() { return mathcore.cos; },
        get cosh() { return mathcore.cosh; },
        get exp() { return mathcore.exp; },
        get log() { return mathcore.log; },
        get norm() { return mathcore.norm; },
        get quad() { return mathcore.quad; },
        get sin() { return mathcore.sin; },
        get sinh() { return mathcore.sinh; },
        get sqrt() { return mathcore.sqrt; }
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
