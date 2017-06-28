(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.EIGHT = global.EIGHT || {})));
}(this, (function (exports) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function isDefined(arg) {
    return (typeof arg !== 'undefined');
}

/**
 * throws name + " must " + message + [" in " + context] + "."
 */
function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
    if (!condition) {
        var message = messageBuilder ? messageBuilder() : "satisfy some condition";
        var context = contextBuilder ? " in " + contextBuilder() : "";
        throw new Error(name + " must " + message + context + ".");
    }
}

function isEQ(value, limit) {
    return value === limit;
}

function mustBeEQ(name, value, limit, contextBuilder) {
    mustSatisfy(name, isEQ(value, limit), function () { return "be equal to " + limit; }, contextBuilder);
    return value;
}

function isNumber(x) {
    return (typeof x === 'number');
}

function isInteger(x) {
    // % coerces its operand to numbers so a typeof test is required.
    // Note that ECMAScript 6 provides Number.isInteger().
    return isNumber(x) && x % 1 === 0;
}

function beAnInteger() {
    return "be an integer";
}
function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
    return value;
}

function isString(s) {
    return (typeof s === 'string');
}

function beAString() {
    return "be a string";
}
function mustBeString(name, value, contextBuilder) {
    mustSatisfy(name, isString(value), beAString, contextBuilder);
    return value;
}

function readOnly(name) {
    mustBeString('name', name);
    var message = {
        get message() {
            return "Property `" + name + "` is readonly.";
        }
    };
    return message;
}

var Eight = (function () {
    function Eight() {
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2017-05-12';
        this.NAMESPACE = 'EIGHT';
        this.VERSION = '6.1.1';
    }
    Eight.prototype.log = function (message) {
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    };
    Eight.prototype.info = function (message) {
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    };
    Eight.prototype.warn = function (message) {
        // This should allow us to unit test and run in environments without a console.
        console.warn(message);
    };
    Eight.prototype.error = function (message) {
        // This should allow us to unit test and run in environments without a console.
        console.error(message);
    };
    return Eight;
}());
/**
 *
 */
var config = new Eight();

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
    return config.log(prefix(message));
}
function warn(message) {
    return config.warn(prefix(message));
}
function error$1(message) {
    return config.error(prefix(message));
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
        config.warn("Memory Leak!");
        config.warn(outstandingMessage(outstanding));
        config.warn(JSON.stringify(statistics, null, 2));
    }
    else {
        if (chatty) {
            config.log(outstandingMessage(outstanding));
        }
    }
    return outstanding;
}
function refChange(uuid, name, change) {
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
        else {
            // It's more efficient to synchronize the name than by using a change of zero.
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
                error$1("refCount < 0 for " + name);
            }
        }
        else {
            error$1(change + " on " + uuid + " @ " + name);
        }
    }
    else if (change === 0) {
        // When the value of change is zero, the uuid is either a command or a method on an exisiting uuid.
        var message = isDefined(name) ? uuid + " @ " + name : uuid;
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
        // addition by Ka-Jan to test for validity
        // Based on: http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
        validate: function (uuid) {
            var testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return testPattern.test(uuid);
        }
    };
}

/**
 * <p>
 * Convenient base class for derived classes implementing <code>Shareable</code>.
 * </p>
 *
 *
 *     class MyShareableClass extends ShareableBase {
 *       constructor() {
 *         // First thing you do is call super to invoke constructors up the chain.
 *         super()
 *         // Setting the logging name is both a good practice and increments the tally
 *         // of constructors in the constructor chain. The runtime architecture will
 *         // verify that the number of destructor calls matches these logging name calls.
 *         this.setLoggingName('MyShareableClass')
 *         // Finally, your initialization code here.
 *         // addRef and shared resources, maybe create owned resources.
 *       }
 *       protected destructor(levelUp: number): void {
 *         // Firstly, your termination code here.
 *         // Release any shared resources and/or delete any owned resources.
 *         // Last thing you do is to call the super destructor, incrementing the level.
 *         // The runtime architecture will verify that the destructor count matches the
 *         // constructor count.
 *         super.destructor(levelUp + 1)
 *       }
 *     }
 *
 */
var ShareableBase = (function () {
    /**
     *
     */
    function ShareableBase() {
        /**
         * The unique identifier used for reference count monitoring.
         */
        this._uuid = uuid4().generate();
        this._type = 'ShareableBase';
        this._levelUp = 0;
        this._refCount = 1;
        refChange(this._uuid, this._type, +1);
    }
    /**
     * Experimental
     *
     * restore (a zombie) to life.
     */
    ShareableBase.prototype.resurrector = function (levelUp, grumble) {
        if (grumble === void 0) { grumble = false; }
        if (grumble) {
            throw new Error("`protected resurrector(levelUp: number): void` method should be implemented by `" + this._type + "`.");
        }
        this._levelUp = 0;
        this._refCount = 1;
        refChange(this._uuid, this._type, +1);
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
     *
     * @param levelUp A number that should be incremented for each destructor call.
     */
    ShareableBase.prototype.destructor = function (levelUp, grumble) {
        if (grumble === void 0) { grumble = false; }
        mustBeInteger('levelUp', levelUp);
        mustBeEQ(this._type + " constructor-destructor chain mismatch: destructor index " + levelUp, levelUp, this._levelUp);
        if (grumble) {
            console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
        }
        // This is the sentinel that this destructor was eventually called.
        // We can check this invariant in the final release method.
        this._levelUp = void 0;
    };
    Object.defineProperty(ShareableBase.prototype, "levelUp", {
        /**
         * Returns the total length of the inheritance hierarchy that this instance is involved in.
         */
        get: function () {
            return this._levelUp;
        },
        set: function (levelUp) {
            // The only way the level gets changed is through setLoggingName.
            throw new Error(readOnly('levelUp').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * An object is a zombie if it has been released by all who have held references.
     * In some cases it may be possible to recycle a zombie.
     */
    ShareableBase.prototype.isZombie = function () {
        return typeof this._refCount === 'undefined';
    };
    /**
     * <p>
     * Notifies this instance that something is referencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    ShareableBase.prototype.addRef = function () {
        if (this.isZombie()) {
            this.resurrector(0, true);
            return this._refCount;
        }
        else {
            this._refCount++;
            refChange(this._uuid, this._type, +1);
            return this._refCount;
        }
    };
    /**
     * Returns the name that was assigned by the call to the setLoggingName method.
     */
    ShareableBase.prototype.getLoggingName = function () {
        return this._type;
    };
    /**
     * This method is for use within constructors.
     *
     * Immediately after a call to the super class constructor, make a call to setLoggingName.
     * This will have the effect of refining the name used for reporting reference counts.
     *
     * This method has the secondary purpose of enabling a tally of the number of classes
     * in the constructor chain. This enables the runtime architecture to verify that destructor
     * chains are consistent with constructor chains, which is a good practice for cleaning up resources.
     *
     * Notice that this method is intentionally protected to discourage it from being called outside of the constructor.
     *
     * @param name This will usually be set to the name of the class.
     */
    ShareableBase.prototype.setLoggingName = function (name) {
        this._type = mustBeString('name', name);
        this._levelUp += 1;
        // Update the name used by the reference count tracking.
        refChange(this._uuid, name, +1);
        refChange(this._uuid, name, -1);
    };
    /**
     * <p>
     * Notifies this instance that something is dereferencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    ShareableBase.prototype.release = function () {
        this._refCount--;
        refChange(this._uuid, this._type, -1);
        var refCount = this._refCount;
        if (refCount === 0) {
            // destructor called with `true` means grumble if the method has not been overridden.
            // The following will call the most derived class first, if such a destructor exists.
            this.destructor(0, true);
            // refCount is used to indicate zombie status so let that go to undefined.
            this._refCount = void 0;
            // Keep the type and uuid around for debugging reference count problems.
            // this._type = void 0
            // this._uuid = void 0
            if (isDefined(this._levelUp)) {
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
        // do nothing
    };
    WebGLBlendFunc.prototype.contextGain = function () {
        this.execute(this.contextManager.gl);
    };
    WebGLBlendFunc.prototype.contextLost = function () {
        // do nothing
    };
    WebGLBlendFunc.prototype.execute = function (gl) {
        gl.blendFunc(this.sfactor, this.dfactor);
    };
    return WebGLBlendFunc;
}(ShareableBase));

function beANumber() {
    return "be a `number`";
}
function mustBeNumber(name, value, contextBuilder) {
    mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
    return value;
}

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
        _this.r = mustBeNumber('r', r);
        _this.g = mustBeNumber('g', g);
        _this.b = mustBeNumber('b', b);
        _this.a = mustBeNumber('a', a);
        return _this;
    }
    /**
     *
     */
    WebGLClearColor.prototype.destructor = function (levelUp) {
        this.r = void 0;
        this.g = void 0;
        this.b = void 0;
        this.a = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    WebGLClearColor.prototype.contextFree = function () {
        // Do nothing;
    };
    WebGLClearColor.prototype.contextGain = function () {
        mustBeNumber('r', this.r);
        mustBeNumber('g', this.g);
        mustBeNumber('b', this.b);
        mustBeNumber('a', this.a);
        this.contextManager.gl.clearColor(this.r, this.g, this.b, this.a);
    };
    WebGLClearColor.prototype.contextLost = function () {
        // Do nothing;
    };
    return WebGLClearColor;
}(ShareableBase));

/**
 * disable(capability: Capability): void
 */
var WebGLDisable = (function (_super) {
    __extends(WebGLDisable, _super);
    function WebGLDisable(contextManager, capability) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        _this.setLoggingName('WebGLDisable');
        _this._capability = mustBeNumber('capability', capability);
        return _this;
    }
    WebGLDisable.prototype.destructor = function (levelUp) {
        this._capability = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    WebGLDisable.prototype.contextFree = function () {
        // do nothing
    };
    WebGLDisable.prototype.contextGain = function () {
        this.contextManager.gl.disable(this._capability);
    };
    WebGLDisable.prototype.contextLost = function () {
        // do nothing
    };
    return WebGLDisable;
}(ShareableBase));

/**
 * enable(capability: Capability): void
 */
var WebGLEnable = (function (_super) {
    __extends(WebGLEnable, _super);
    function WebGLEnable(contextManager, capability) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        _this.setLoggingName('WebGLEnable');
        _this._capability = mustBeNumber('capability', capability);
        return _this;
    }
    WebGLEnable.prototype.destructor = function (levelUp) {
        this._capability = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    WebGLEnable.prototype.contextFree = function () {
        // do nothing
    };
    WebGLEnable.prototype.contextGain = function () {
        this.contextManager.gl.enable(this._capability);
    };
    WebGLEnable.prototype.contextLost = function () {
        // do nothing
    };
    return WebGLEnable;
}(ShareableBase));

function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

function approx(coords, n) {
    var max = 0;
    var iLen = coords.length;
    for (var i = 0; i < iLen; i++) {
        max = Math.max(max, Math.abs(coords[i]));
    }
    var threshold = max * Math.pow(10, -n);
    for (var i = 0; i < iLen; i++) {
        if (Math.abs(coords[i]) < threshold) {
            coords[i] = 0;
        }
    }
}

function isNull(x) {
    return x === null;
}

function isUndefined(arg) {
    return (typeof arg === 'undefined');
}

function arraysEQ(a, b) {
    if (isDefined(a)) {
        if (isDefined(b)) {
            if (!isNull(a)) {
                if (!isNull(b)) {
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
                return isNull(b);
            }
        }
        else {
            return false;
        }
    }
    else {
        return isUndefined(b);
    }
}

function dotVectorE3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

// GraphicsProgramSymbols constants for the coordinate indices into the data array.
// These are chosen to match those used by G3.
// TODO: The goal should be to protect the user from changes in ordering.
var COORD_W = 0;
var COORD_X$1 = 1;
var COORD_Y$1 = 2;
var COORD_Z$1 = 3;
var COORD_XY$1 = 4;
var COORD_YZ$1 = 5;
var COORD_ZX$1 = 6;
var COORD_XYZ = 7;
function compG3Get(m, index) {
    switch (index) {
        case COORD_W: {
            return m.a;
        }
        case COORD_X$1: {
            return m.x;
        }
        case COORD_Y$1: {
            return m.y;
        }
        case COORD_Z$1: {
            return m.z;
        }
        case COORD_XY$1: {
            return m.xy;
        }
        case COORD_YZ$1: {
            return m.yz;
        }
        case COORD_ZX$1: {
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

var COORD_W$1 = 0;
var COORD_X$2 = 1;
var COORD_Y$2 = 2;
var COORD_Z$2 = 3;
var COORD_XY$2 = 4;
var COORD_YZ$2 = 5;
var COORD_ZX$2 = 6;
var COORD_XYZ$1 = 7;
function compG3Set(m, index, value) {
    switch (index) {
        case COORD_W$1: {
            m.a = value;
            break;
        }
        case COORD_X$2: {
            m.x = value;
            break;
        }
        case COORD_Y$2: {
            m.y = value;
            break;
        }
        case COORD_Z$2: {
            m.z = value;
            break;
        }
        case COORD_XY$2: {
            m.xy = value;
            break;
        }
        case COORD_YZ$2: {
            m.yz = value;
            break;
        }
        case COORD_ZX$2: {
            m.zx = value;
            break;
        }
        case COORD_XYZ$1: {
            m.b = value;
            break;
        }
        default:
            throw new Error("index => " + index);
    }
}

function extG3(a, b, out) {
    var a0 = compG3Get(a, 0);
    var a1 = compG3Get(a, 1);
    var a2 = compG3Get(a, 2);
    var a3 = compG3Get(a, 3);
    var a4 = compG3Get(a, 4);
    var a5 = compG3Get(a, 5);
    var a6 = compG3Get(a, 6);
    var a7 = compG3Get(a, 7);
    var b0 = compG3Get(b, 0);
    var b1 = compG3Get(b, 1);
    var b2 = compG3Get(b, 2);
    var b3 = compG3Get(b, 3);
    var b4 = compG3Get(b, 4);
    var b5 = compG3Get(b, 5);
    var b6 = compG3Get(b, 6);
    var b7 = compG3Get(b, 7);
    for (var i = 0; i < 8; i++) {
        compG3Set(out, i, extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
}

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
/**
 * Gaussian elimination
 * Ax = b
 */
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

function isScalarG3(m) {
    return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
}

function isObject(x) {
    return (typeof x === 'object');
}

/**
 * Determines whether the argument supports the VectorE3 interface.
 * The argument must be a non-null object and must support the x, y, and z numeric properties.
 */
function isVectorE3(v) {
    if (isObject(v) && !isNull(v)) {
        return isNumber(v.x) && isNumber(v.y) && isNumber(v.z);
    }
    else {
        return false;
    }
}

function isVectorG3(m) {
    return m.a === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
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
            throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
}

function lcoG3(a, b, out) {
    var a0 = compG3Get(a, 0);
    var a1 = compG3Get(a, 1);
    var a2 = compG3Get(a, 2);
    var a3 = compG3Get(a, 3);
    var a4 = compG3Get(a, 4);
    var a5 = compG3Get(a, 5);
    var a6 = compG3Get(a, 6);
    var a7 = compG3Get(a, 7);
    var b0 = compG3Get(b, 0);
    var b1 = compG3Get(b, 1);
    var b2 = compG3Get(b, 2);
    var b3 = compG3Get(b, 3);
    var b4 = compG3Get(b, 4);
    var b5 = compG3Get(b, 5);
    var b6 = compG3Get(b, 6);
    var b7 = compG3Get(b, 7);
    for (var i = 0; i < 8; i++) {
        compG3Set(out, i, lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
}

/**
 * Sets the lock on the argument and returns the same argument.
 */
function lock(m) {
    m.lock();
    return m;
}
var TargetLockedError = (function (_super) {
    __extends(TargetLockedError, _super);
    /**
     * `operationName` is the name of the operation, without parentheses or parameters.
     */
    function TargetLockedError(operationName) {
        return _super.call(this, "target of operation '" + operationName + "' must be mutable.") || this;
    }
    return TargetLockedError;
}(Error));
var TargetUnlockedError = (function (_super) {
    __extends(TargetUnlockedError, _super);
    /**
     * `operationName` is the name of the operation, without parentheses.
     */
    function TargetUnlockedError(operationName) {
        return _super.call(this, "target of operation '" + operationName + "' must be immutable.") || this;
    }
    return TargetUnlockedError;
}(Error));
function lockable() {
    var lock_ = void 0;
    var that = {
        isLocked: function () {
            return typeof lock_ === 'number';
        },
        lock: function () {
            if (that.isLocked()) {
                throw new Error("already locked");
            }
            else {
                lock_ = Math.random();
                return lock_;
            }
        },
        unlock: function (token) {
            if (typeof token !== 'number') {
                throw new Error("token must be a number.");
            }
            if (!that.isLocked()) {
                throw new Error("not locked");
            }
            else if (lock_ === token) {
                lock_ = void 0;
            }
            else {
                throw new Error("unlock denied");
            }
        }
    };
    return that;
}
/**
 * Lockable Mixin
 */
var LockableMixin = (function () {
    function LockableMixin() {
    }
    LockableMixin.prototype.isLocked = function () {
        return typeof this['lock_'] === 'number';
    };
    LockableMixin.prototype.lock = function () {
        if (this.isLocked()) {
            throw new Error("already locked");
        }
        else {
            this['lock_'] = Math.random();
            return this['lock_'];
        }
    };
    LockableMixin.prototype.unlock = function (token) {
        if (typeof token !== 'number') {
            throw new Error("token must be a number.");
        }
        if (!this.isLocked()) {
            throw new Error("not locked");
        }
        else if (this['lock_'] === token) {
            this['lock_'] = void 0;
        }
        else {
            throw new Error("unlock denied");
        }
    };
    return LockableMixin;
}());

var scratch = { a: 0, x: 0, y: 0, z: 0, yz: 0, zx: 0, xy: 0, b: 0 };
function maskG3(arg) {
    if (isObject(arg) && 'maskG3' in arg) {
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
    else if (isNumber(arg)) {
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

/**
 * Multiplication of Geometric3.
 * This was originally written for asm.
 */
function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    switch (index) {
        case 0: {
            return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7;
        }
        case 1: {
            return a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5;
        }
        case 2: {
            return a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6;
        }
        case 3: {
            return a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4;
        }
        case 4: {
            return a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3;
        }
        case 5: {
            return a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1;
        }
        case 6: {
            return a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2;
        }
        case 7: {
            return a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0;
        }
        default: {
            throw new Error("index must be in the range [0..7]");
        }
    }
}

/**
 * Computes a random number within the specified range.
 */
function randomRange(a, b) {
    return (b - a) * Math.random() + a;
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
            throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
}

function rcoG3(a, b, out) {
    var a0 = compG3Get(a, 0);
    var a1 = compG3Get(a, 1);
    var a2 = compG3Get(a, 2);
    var a3 = compG3Get(a, 3);
    var a4 = compG3Get(a, 4);
    var a5 = compG3Get(a, 5);
    var a6 = compG3Get(a, 6);
    var a7 = compG3Get(a, 7);
    var b0 = compG3Get(b, 0);
    var b1 = compG3Get(b, 1);
    var b2 = compG3Get(b, 2);
    var b3 = compG3Get(b, 3);
    var b4 = compG3Get(b, 4);
    var b5 = compG3Get(b, 5);
    var b6 = compG3Get(b, 6);
    var b7 = compG3Get(b, 7);
    for (var i = 0; i < 8; i++) {
        compG3Set(out, i, rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
}

function quadVectorE3(vector) {
    var x = vector.x;
    var y = vector.y;
    var z = vector.z;
    return x * x + y * y + z * z;
}

/**
 * Computes the z component of the cross-product of Cartesian vector components.
 */
function wedgeXY(ax, ay, az, bx, by, bz) {
    return ax * by - ay * bx;
}

/**
 * Computes the x component of the cross-product of Cartesian vector components.
 */
function wedgeYZ(ax, ay, az, bx, by, bz) {
    return ay * bz - az * by;
}

/**
 * Computes the y component of the cross-product of Cartesian vector components.
 */
function wedgeZX(ax, ay, az, bx, by, bz) {
    return az * bx - ax * bz;
}

var sqrt = Math.sqrt;
var cosPIdiv4 = Math.cos(Math.PI / 4);
var sinPIdiv4 = Math.sin(Math.PI / 4);
/**
 * Sets the output spinor to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * If the vectors are anti-parallel, making the plane of rotation ambiguous,
 * the bivector B will be used if specified.
 * Otherwise, sets the output spinor to a random bivector if the vectors are anti-parallel.
 * The result is independent of the magnitudes of a and b.
 */
function rotorFromDirectionsE3(a, b, B, m) {
    // Optimization for equal vectors.
    if (a.x === b.x && a.y === b.y && a.z === b.z) {
        // An easy optimization is simply to compare the vectors for equality.
        m.one();
        return;
    }
    // Optimizations for cardinal directions.
    if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
        // e1 to e2
        m.zero();
        m.a = cosPIdiv4;
        m.xy = -sinPIdiv4;
        return;
    }
    if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
        // e1 to e3
        m.zero();
        m.a = cosPIdiv4;
        m.zx = sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
        // e2 to e1
        m.zero();
        m.a = cosPIdiv4;
        m.xy = sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
        // e2 to e3
        m.zero();
        m.a = cosPIdiv4;
        m.yz = -sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 1 && b.y === 0 && b.z === 0) {
        // e3 to e1
        m.zero();
        m.a = cosPIdiv4;
        m.zx = -sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 1 && b.z === 0) {
        // e3 to e2
        m.zero();
        m.a = cosPIdiv4;
        m.yz = sinPIdiv4;
        return;
    }
    if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
        // e1 to -e2
        m.zero();
        m.a = cosPIdiv4;
        m.xy = sinPIdiv4;
        return;
    }
    if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
        // e1 to -e3
        m.zero();
        m.a = cosPIdiv4;
        m.zx = -sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
        // e2 to -e1
        m.zero();
        m.a = cosPIdiv4;
        m.xy = -sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
        // e2 to -e3
        m.zero();
        m.a = cosPIdiv4;
        m.yz = sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === -1 && b.y === 0 && b.z === 0) {
        // e3 to -e1
        m.zero();
        m.a = cosPIdiv4;
        m.zx = sinPIdiv4;
        return;
    }
    if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === -1 && b.z === 0) {
        // e3 to -e2
        m.zero();
        m.a = cosPIdiv4;
        m.yz = -sinPIdiv4;
        return;
    }
    if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
        // -e1 to +e2
        m.zero();
        m.a = cosPIdiv4;
        m.xy = sinPIdiv4;
        return;
    }
    if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
        // -e1 to +e3
        m.zero();
        m.a = cosPIdiv4;
        m.zx = -sinPIdiv4;
        return;
    }
    // Optimizations when the plane of rotation is ambiguous and a default bivector is not defined.
    if (typeof B === 'undefined') {
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
            // +e1 to -e1.
            m.zero();
            m.xy = -1;
            return;
        }
        if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
            // -e1 to +e1.
            m.zero();
            m.xy = -1;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
            // +e2 to -e2.
            m.zero();
            m.xy = -1;
            return;
        }
        if (a.x === 0 && a.y === -1 && a.z === 0 && b.x === 0 && b.y === +1 && b.z === 0) {
            // -e2 to +e2.
            m.zero();
            m.xy = -1;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 0 && b.z === -1) {
            // +e3 to -e3.
            m.zero();
            m.zx = -1;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === -1 && b.x === 0 && b.y === 0 && b.z === +1) {
            // -e3 to +e3.
            m.zero();
            m.zx = -1;
            return;
        }
    }
    var quadA = quadVectorE3(a);
    var absA = sqrt(quadA);
    var quadB = quadVectorE3(b);
    var absB = sqrt(quadB);
    var BA = absB * absA;
    var dotBA = dotVectorE3(b, a);
    var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
    if (denom !== 0) {
        m = m.versor(b, a);
        m = m.addScalar(BA);
        m = m.divByScalar(denom);
    }
    else {
        // The denominator is zero when |a||b| + a << b = 0.
        // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
        // Then a and b are anti-parallel.
        // The plane of the rotation is ambiguous.
        // Compute a random bivector containing the start vector, then turn
        // it into a rotor that achieves the 180-degree rotation.
        if (B) {
            m.rotorFromGeneratorAngle(B, Math.PI);
        }
        else {
            var rx = Math.random();
            var ry = Math.random();
            var rz = Math.random();
            m.zero();
            m.yz = wedgeYZ(rx, ry, rz, a.x, a.y, a.z);
            m.zx = wedgeZX(rx, ry, rz, a.x, a.y, a.z);
            m.xy = wedgeXY(rx, ry, rz, a.x, a.y, a.z);
            m.normalize();
            m.rotorFromGeneratorAngle(m, Math.PI);
        }
    }
}

function scpG3(a, b, out) {
    var a0 = compG3Get(a, 0);
    var a1 = compG3Get(a, 1);
    var a2 = compG3Get(a, 2);
    var a3 = compG3Get(a, 3);
    var a4 = compG3Get(a, 4);
    var a5 = compG3Get(a, 5);
    var a6 = compG3Get(a, 6);
    var a7 = compG3Get(a, 7);
    var b0 = compG3Get(b, 0);
    var b1 = compG3Get(b, 1);
    var b2 = compG3Get(b, 2);
    var b3 = compG3Get(b, 3);
    var b4 = compG3Get(b, 4);
    var b5 = compG3Get(b, 5);
    var b6 = compG3Get(b, 6);
    var b7 = compG3Get(b, 7);
    compG3Set(out, 0, mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
    compG3Set(out, 1, 0);
    compG3Set(out, 2, 0);
    compG3Set(out, 3, 0);
    compG3Set(out, 4, 0);
    compG3Set(out, 5, 0);
    compG3Set(out, 6, 0);
    compG3Set(out, 7, 0);
    return out;
}

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

function isArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
}

function beAnArray() {
    return "be an array";
}
function mustBeArray(name, value, contextBuilder) {
    mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
    return value;
}

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
            // Do nothing.
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
                // 1 times anything is just the thing.
                // We don't need the scalar label, but maybe we might?
            }
        }
    }
    else {
        // Do nothing if the coordinate is zero.
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

// Symbolic constants for the coordinate indices into the data array.
var COORD_SCALAR = 0;
var COORD_X = 1;
var COORD_Y = 2;
var COORD_Z = 3;
var COORD_XY = 4;
var COORD_YZ = 5;
var COORD_ZX = 6;
var COORD_PSEUDO = 7;
// FIXME: Change to Canonical ordering.
var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
var zero = function zero() {
    return [0, 0, 0, 0, 0, 0, 0, 0];
};
var scalar = function scalar(a) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    return coords;
};
var vector = function vector(x, y, z) {
    var coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    return coords;
};
var bivector = function bivector(yz, zx, xy) {
    var coords = zero();
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};
var spinor = function spinor(a, yz, zx, xy) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};
var multivector = function multivector(a, x, y, z, yz, zx, xy, b) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    coords[COORD_PSEUDO] = b;
    return coords;
};
var pseudo = function pseudo(b) {
    var coords = zero();
    coords[COORD_PSEUDO] = b;
    return coords;
};
function coordinates(m) {
    var coords = zero();
    coords[COORD_SCALAR] = m.a;
    coords[COORD_X] = m.x;
    coords[COORD_Y] = m.y;
    coords[COORD_Z] = m.z;
    coords[COORD_YZ] = m.yz;
    coords[COORD_ZX] = m.zx;
    coords[COORD_XY] = m.xy;
    coords[COORD_PSEUDO] = m.b;
    return coords;
}
/**
 * cos(a, b) = (a | b) / |a||b|
 */
function cosVectorVector(a, b) {
    function scp(c, d) {
        return c.x * d.x + c.y * d.y + c.z * d.z;
    }
    function norm(v) {
        return Math.sqrt(scp(v, v));
    }
    return scp(a, b) / (norm(a) * norm(b));
}
/**
 * Scratch variable for holding cosines.
 */
var cosines = [];
/**
 *
 */
var Geometric3 = (function () {
    /**
     * Constructs a <code>Geometric3</code>.
     * The multivector is initialized to zero.
     * coords [a, x, y, z, xy, yz, zx, b]
     */
    function Geometric3(coords) {
        if (coords === void 0) { coords = [0, 0, 0, 0, 0, 0, 0, 0]; }
        mustBeEQ('coords.length', coords.length, 8);
        this.coords_ = coords;
        this.modified_ = false;
    }
    Object.defineProperty(Geometric3.prototype, "length", {
        get: function () {
            return 8;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Geometric3.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    /**
     * Consistently set a coordinate value in the most optimized way,
     * by checking for a change from the old value to the new value.
     * The modified flag is only set to true if the value has changed.
     * Throws an exception if this multivector is locked.
     */
    Geometric3.prototype.setCoordinate = function (index, newValue, name) {
        if (this.isLocked()) {
            throw new TargetLockedError("set " + name);
        }
        var coords = this.coords_;
        var oldValue = coords[index];
        if (newValue !== oldValue) {
            coords[index] = newValue;
            this.modified_ = true;
        }
    };
    Object.defineProperty(Geometric3.prototype, "a", {
        /**
         * The scalar part of this multivector.
         */
        get: function () {
            return this.coords_[COORD_SCALAR];
        },
        set: function (a) {
            this.setCoordinate(COORD_SCALAR, a, 'a');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "x", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_X];
        },
        set: function (x) {
            this.setCoordinate(COORD_X, x, 'x');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "y", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_Y];
        },
        set: function (y) {
            this.setCoordinate(COORD_Y, y, 'y');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "z", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_Z];
        },
        set: function (z) {
            this.setCoordinate(COORD_Z, z, 'z');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "yz", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_YZ];
        },
        set: function (yz) {
            this.setCoordinate(COORD_YZ, yz, 'yz');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "zx", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_ZX];
        },
        set: function (zx) {
            this.setCoordinate(COORD_ZX, zx, 'zx');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "xy", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_XY];
        },
        set: function (xy) {
            this.setCoordinate(COORD_XY, xy, 'xy');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "b", {
        /**
         * The pseudoscalar part of this multivector.
         */
        get: function () {
            return this.coords_[COORD_PSEUDO];
        },
        set: function (b) {
            this.setCoordinate(COORD_PSEUDO, b, 'b');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "maskG3", {
        /**
         * A bitmask describing the grades.
         *
         * 0x0 = zero
         * 0x1 = scalar
         * 0x2 = vector
         * 0x4 = bivector
         * 0x8 = pseudoscalar
         */
        get: function () {
            var coords = this.coords_;
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
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a multivector value to this multivector with optional scaling.
     *
     * this ⟼ this + M * alpha
     *
     * @param M The multivector to be added to this multivector.
     * @param alpha An optional scale factor that multiplies the multivector argument.
     *
     * @returns this + M * alpha
     */
    Geometric3.prototype.add = function (M, alpha) {
        if (alpha === void 0) { alpha = 1; }
        if (this.isLocked()) {
            return lock(this.clone().add(M, alpha));
        }
        else {
            this.a += M.a * alpha;
            this.x += M.x * alpha;
            this.y += M.y * alpha;
            this.z += M.z * alpha;
            this.yz += M.yz * alpha;
            this.zx += M.zx * alpha;
            this.xy += M.xy * alpha;
            this.b += M.b * alpha;
            return this;
        }
    };
    /**
     * Adds a bivector value to this multivector.
     *
     * this ⟼ this + B
     *
     * @returns this + B
     */
    Geometric3.prototype.addBivector = function (B) {
        if (this.isLocked()) {
            return lock(this.clone().addBivector(B));
        }
        else {
            this.yz += B.yz;
            this.zx += B.zx;
            this.xy += B.xy;
            return this;
        }
    };
    /**
     * Adds a pseudoscalar value to this multivector.
     *
     * this ⟼ this + I * β
     *
     * @param β The pseudoscalar value to be added to this multivector.
     * @returns this + I * β
     */
    Geometric3.prototype.addPseudo = function (β) {
        if (this.isLocked()) {
            return lock(this.clone().addPseudo(β));
        }
        else {
            this.b += β;
            return this;
        }
    };
    /**
     * Adds a scalar value to this multivector.
     *
     * @param alpha The scalar value to be added to this multivector.
     * @return this + alpha
     */
    Geometric3.prototype.addScalar = function (alpha) {
        if (this.isLocked()) {
            return lock(this.clone().addScalar(alpha));
        }
        else {
            this.a += alpha;
            return this;
        }
    };
    /**
     * Adds a vector value to this multivector.
     *
     * @param v The vector to be added.
     * @param alpha The scaling factor for the vector.
     * @returns this + v * alpha
     */
    Geometric3.prototype.addVector = function (v, alpha) {
        if (alpha === void 0) { alpha = 1; }
        if (this.isLocked()) {
            return this.clone().addVector(v, alpha);
        }
        else {
            this.x += v.x * alpha;
            this.y += v.y * alpha;
            this.z += v.z * alpha;
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric3.prototype.add2 = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('add2');
        }
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
    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns The arg of <code>this</code> multivector.
     */
    Geometric3.prototype.arg = function () {
        if (this.isLocked()) {
            return lock(this.clone().arg());
        }
        else {
            return this.log().grade(2);
        }
    };
    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
     */
    Geometric3.prototype.approx = function (n) {
        if (this.isLocked()) {
            return lock(this.clone().approx(n));
        }
        else {
            approx(this.coords_, n);
            return this;
        }
    };
    /**
     * @returns <code>copy(this)</code>
     */
    Geometric3.prototype.clone = function () {
        return Geometric3.copy(this);
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    Geometric3.prototype.conj = function () {
        if (this.isLocked()) {
            return lock(this.clone().conj());
        }
        else {
            // The grade 0 (scalar) coordinate is unchanged.
            // The grade 1 (vector) coordinates change sign.
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            // The grade 2 (bivector) coordinates change sign.
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            // The grade 3 (pseudoscalar) coordinate is unchanged.
            return this;
        }
    };
    /**
     * Copies the coordinate values into this <code>Geometric3</code>.
     *
     * @param coordinates The coordinates in order a, x, y, z, yz, zx, xy, b.
     */
    Geometric3.prototype.copyCoordinates = function (coordinates) {
        if (this.isLocked()) {
            throw new TargetLockedError('copyCoordinates');
        }
        // Copy using the setters so that the modified flag is updated.
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
    /**
     * @param point
     */
    Geometric3.prototype.distanceTo = function (point) {
        if (point) {
            return Math.sqrt(this.quadranceTo(point));
        }
        else {
            throw new Error("point must be a VectorE3");
        }
    };
    /**
     * Computes the quadrance from this position (vector) to the specified point.
     */
    Geometric3.prototype.quadranceTo = function (point) {
        if (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return dx * dx + dy * dy + dz * dz;
        }
        else {
            throw new Error("point must be a VectorE3");
        }
    };
    /**
     * Left contraction of this multivector with another multivector.
     * @param m
     * @returns this << m
     */
    Geometric3.prototype.lco = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().lco(m));
        }
        else {
            return this.lco2(this, m);
        }
    };
    /**
     * Sets this multivector to a << b
     *
     * @param a
     * @param b
     * @returns a << b
     */
    Geometric3.prototype.lco2 = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('lco2');
        }
        return lcoG3(a, b, this);
    };
    /**
     * Right contraction.
     *
     * A >> B = grade(A * B, a - b) = <code>A.rco(B)</code>
     *
     * @returns this >> rhs
     */
    Geometric3.prototype.rco = function (m) {
        return this.rco2(this, m);
    };
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric3.prototype.rco2 = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('rco2');
        }
        return rcoG3(a, b, this);
    };
    /**
     * Sets this multivector to be a copy of another multivector.
     * @returns copy(M)
     */
    Geometric3.prototype.copy = function (M) {
        if (this.isLocked()) {
            throw new TargetLockedError('copy');
        }
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
    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     */
    Geometric3.prototype.copyScalar = function (α) {
        if (this.isLocked()) {
            throw new TargetLockedError('copyScalar');
        }
        this.setCoordinate(COORD_SCALAR, α, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_Z, 0, 'z');
        this.setCoordinate(COORD_YZ, 0, 'yz');
        this.setCoordinate(COORD_ZX, 0, 'zx');
        this.setCoordinate(COORD_XY, 0, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        return this;
    };
    /**
     * Copies the spinor argument value into this multivector.
     * The non-spinor components are set to zero.
     *
     * @param spinor The spinor to be copied.
     */
    Geometric3.prototype.copySpinor = function (spinor) {
        if (this.isLocked()) {
            throw new TargetLockedError('copySpinor');
        }
        this.setCoordinate(COORD_SCALAR, spinor.a, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_Z, 0, 'z');
        this.setCoordinate(COORD_YZ, spinor.yz, 'yz');
        this.setCoordinate(COORD_ZX, spinor.zx, 'zx');
        this.setCoordinate(COORD_XY, spinor.xy, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        return this;
    };
    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    Geometric3.prototype.copyVector = function (vector) {
        if (this.isLocked()) {
            throw new TargetLockedError('copyVector');
        }
        this.setCoordinate(COORD_SCALAR, 0, 'a');
        this.setCoordinate(COORD_X, vector.x, 'x');
        this.setCoordinate(COORD_Y, vector.y, 'y');
        this.setCoordinate(COORD_Z, vector.z, 'z');
        this.setCoordinate(COORD_YZ, 0, 'yz');
        this.setCoordinate(COORD_ZX, 0, 'zx');
        this.setCoordinate(COORD_XY, 0, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        return this;
    };
    /**
     * Sets this multivector to the generalized vector cross product with another multivector.
     * <p>
     * <code>this ⟼ -I * (this ^ m)</code>
     * </p>
     */
    Geometric3.prototype.cross = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().cross(m));
        }
        else {
            this.ext(m);
            this.dual(this).neg();
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     *
     * @param m The multivector dividend.
     * @returns this / m
     */
    Geometric3.prototype.div = function (m) {
        if (isScalarG3(m)) {
            return this.divByScalar(m.a);
        }
        else if (isVectorG3(m)) {
            return this.divByVector(m);
        }
        else {
            if (this.isLocked()) {
                return lock(this.clone().div(m));
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
                var X = gauss(A, b);
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
                var c0 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                var c1 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                var c2 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                var c3 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                var c4 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                var c5 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                var c6 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                var c7 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
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
        }
    };
    /**
     * Division of this multivector by a scalar.
     *
     * @returns this / alpha
     */
    Geometric3.prototype.divByScalar = function (alpha) {
        if (this.isLocked()) {
            return lock(this.clone().divByScalar(alpha));
        }
        else {
            this.a /= alpha;
            this.x /= alpha;
            this.y /= alpha;
            this.z /= alpha;
            this.yz /= alpha;
            this.zx /= alpha;
            this.xy /= alpha;
            this.b /= alpha;
            return this;
        }
    };
    /**
     * this ⟼ this / v
     *
     * @param v The vector on the right hand side of the / operator.
     * @returns this / v
     */
    Geometric3.prototype.divByVector = function (v) {
        if (this.isLocked()) {
            return this.clone().divByVector(v);
        }
        else {
            var x = v.x;
            var y = v.y;
            var z = v.z;
            var squaredNorm = x * x + y * y + z * z;
            return this.mulByVector(v).divByScalar(squaredNorm);
        }
    };
    /**
     * this ⟼ a / b
     */
    Geometric3.prototype.div2 = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('div2');
        }
        else {
            // FIXME: Generalize
            var a0 = a.a;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.a;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // It would be interesting to DRY this out.
            this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.a = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        }
    };
    /**
     * this ⟼ dual(m) = I * m
     */
    Geometric3.prototype.dual = function (m) {
        if (this.isLocked()) {
            return this.clone().dual(m);
        }
        else {
            if (m) {
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
            }
            else {
                return this.dual(this);
            }
        }
    };
    /**
     * @param other
     * @returns
     */
    Geometric3.prototype.equals = function (other) {
        if (other instanceof Geometric3) {
            var that = other;
            return arraysEQ(this.coords_, that.coords_);
        }
        else {
            return false;
        }
    };
    /**
     * this ⟼ exp(this)
     */
    Geometric3.prototype.exp = function () {
        if (this.isLocked()) {
            return lock(this.clone().exp());
        }
        else {
            // It's always the case that the scalar commutes with every other
            // grade of the multivector, so we can pull it out the front.
            var expW = Math.exp(this.a);
            // In Geometric3 we have the special case that the pseudoscalar also commutes.
            // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
            // let cosβ = cos(this.b)
            // let sinβ = sin(this.b)
            // We are left with the vector and bivector components.
            // For a bivector (usual case), let B = I * φ, where φ is a vector.
            // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = Math.sqrt(yz * yz + zx * zx + xy * xy);
            var s = φ !== 0 ? Math.sin(φ) / φ : 1;
            var cosφ = Math.cos(φ);
            // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
            // The mixture of vector and bivector parts is more complex!
            this.a = cosφ;
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this.scale(expW);
        }
    };
    /**
     * @returns inverse(this)
     */
    Geometric3.prototype.inv = function () {
        if (this.isLocked()) {
            return lock(this.clone().inv());
        }
        else {
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
            var X = gauss(A, b);
            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.z = X[3];
            this.xy = X[4];
            this.yz = X[5];
            this.zx = X[6];
            this.b = X[7];
            return this;
        }
    };
    /**
     * Determins whether this multivector is exactly zero.
     */
    Geometric3.prototype.isOne = function () {
        return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
    };
    /**
     * Determins whether this multivector is exactly one.
     */
    Geometric3.prototype.isZero = function () {
        return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
    };
    /**
     * @returns this + α * (target - this)
     */
    Geometric3.prototype.lerp = function (target, α) {
        if (this.isLocked()) {
            return lock(this.clone().lerp(target, α));
        }
        else {
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    };
    /**
     * Linear interpolation.
     * Sets this multivector to a + α * (b - a)
     */
    Geometric3.prototype.lerp2 = function (a, b, α) {
        if (this.isLocked()) {
            throw new TargetLockedError('lerp2');
        }
        this.copy(a).lerp(b, α);
        return this;
    };
    /**
     * this ⟼ log(this)
     *
     * @returns log(this)
     */
    Geometric3.prototype.log = function () {
        if (this.isLocked()) {
            return lock(this.clone().log());
        }
        else {
            var α = this.a;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var BB = x * x + y * y + z * z;
            var B = Math.sqrt(BB);
            var f = Math.atan2(B, α) / B;
            this.a = Math.log(Math.sqrt(α * α + BB));
            this.yz = x * f;
            this.zx = y * f;
            this.xy = z * f;
            return this;
        }
    };
    /**
     * magnitude(this) = sqrt(this | ~this)
     */
    Geometric3.prototype.magnitude = function () {
        return Math.sqrt(this.quaditude());
    };
    /**
     * this ⟼ this * m
     *
     * @returns this * m
     */
    Geometric3.prototype.mul = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().mul(m));
        }
        else {
            return this.mul2(this, m);
        }
    };
    Geometric3.prototype.mulByVector = function (vector) {
        var a0 = this.a;
        var a1 = this.x;
        var a2 = this.y;
        var a3 = this.z;
        var a4 = this.xy;
        var a5 = this.yz;
        var a6 = this.zx;
        var a7 = this.b;
        var b0 = 0;
        var b1 = vector.x;
        var b2 = vector.y;
        var b3 = vector.z;
        var b4 = 0;
        var b5 = 0;
        var b6 = 0;
        var b7 = 0;
        // TODO: substitute a cheaper multiplication function.
        this.a = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        this.x = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        this.y = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        this.z = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        this.xy = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        this.yz = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        this.zx = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        this.b = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return this;
    };
    /**
     * this ⟼ a * b
     */
    Geometric3.prototype.mul2 = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('mul2');
        }
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.z;
        var a4 = a.xy;
        var a5 = a.yz;
        var a6 = a.zx;
        var a7 = a.b;
        var b0 = b.a;
        var b1 = b.x;
        var b2 = b.y;
        var b3 = b.z;
        var b4 = b.xy;
        var b5 = b.yz;
        var b6 = b.zx;
        var b7 = b.b;
        this.a = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        this.x = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        this.y = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        this.z = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        this.xy = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        this.yz = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        this.zx = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        this.b = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return this;
    };
    /**
     * this ⟼ -1 * this
     *
     * @returns -1 * this
     */
    Geometric3.prototype.neg = function () {
        if (this.isLocked()) {
            return lock(this.clone().neg());
        }
        else {
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            return this;
        }
    };
    /**
     * norm(A) = |A| = A | ~A, where | is the scalar product and ~ is reversion.
     *
     * this ⟼ magnitude(this) = sqrt(scp(this, rev(this))) = sqrt(this | ~this)
     *
     * @returns norm(this)
     */
    Geometric3.prototype.norm = function () {
        if (this.isLocked()) {
            return lock(this.clone().norm());
        }
        else {
            this.a = this.magnitude();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        }
    };
    /**
     * @returns this / magnitude(this)
     */
    Geometric3.prototype.direction = function () {
        return this.normalize();
    };
    /**
     * this ⟼ this / magnitude(this)
     *
     * If the magnitude is zero (a null multivector), this multivector is unchanged.
     * Since the metric is Euclidean, this will only happen if the multivector is also the
     * zero multivector.
     */
    Geometric3.prototype.normalize = function () {
        if (this.isLocked()) {
            return lock(this.clone().normalize());
        }
        else {
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
        }
    };
    /**
     * Sets this multivector to the identity element for multiplication, 1.
     */
    Geometric3.prototype.one = function () {
        if (this.isLocked()) {
            throw new TargetLockedError('one');
        }
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
    /**
     * squaredNorm(A) = |A||A| = A | ~A
     *
     * Returns the (squared) norm of this multivector.
     *
     * If this multivector is mutable (unlocked), then it is set to the squared norm of this multivector,
     * and the return value is this multivector.
     * If thus multivector is immutable (locked), then a new multivector is returned which is also immutable.
     *
     * this ⟼ squaredNorm(this) = scp(this, rev(this)) = this | ~this
     *
     * @returns squaredNorm(this)
     */
    Geometric3.prototype.squaredNorm = function () {
        if (this.isLocked()) {
            return lock(this.clone().squaredNorm());
        }
        else {
            this.a = squaredNormG3(this);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        }
    };
    /**
     * Computes the square of the magnitude.
     */
    Geometric3.prototype.quaditude = function () {
        return squaredNormG3(this);
    };
    /**
     * Sets this multivector to its reflection in the plane orthogonal to vector n.
     *
     * Mathematically,
     *
     * this ⟼ - n * this * n
     *
     * Geometrically,
     *
     * Reflects this multivector in the plane orthogonal to the unit vector, n.
     *
     * If n is not a unit vector then the result is scaled by n squared.
     *
     * @param n The unit vector that defines the reflection plane.
     */
    Geometric3.prototype.reflect = function (n) {
        if (this.isLocked()) {
            return lock(this.clone().reflect(n));
        }
        else {
            var n1 = n.x;
            var n2 = n.y;
            var n3 = n.z;
            var n11 = n1 * n1;
            var n22 = n2 * n2;
            var n33 = n3 * n3;
            var nn = n11 + n22 + n33;
            var f1 = 2 * n2 * n3;
            var f2 = 2 * n3 * n1;
            var f3 = 2 * n1 * n2;
            var t1 = n22 + n33 - n11;
            var t2 = n33 + n11 - n22;
            var t3 = n11 + n22 - n33;
            var cs = this.coords_;
            var a = cs[COORD_SCALAR];
            var x1 = cs[COORD_X];
            var x2 = cs[COORD_Y];
            var x3 = cs[COORD_Z];
            var B3 = cs[COORD_XY];
            var B1 = cs[COORD_YZ];
            var B2 = cs[COORD_ZX];
            var b = cs[COORD_PSEUDO];
            this.setCoordinate(COORD_SCALAR, -nn * a, 'a');
            this.setCoordinate(COORD_X, x1 * t1 - x2 * f3 - x3 * f2, 'x');
            this.setCoordinate(COORD_Y, x2 * t2 - x3 * f1 - x1 * f3, 'y');
            this.setCoordinate(COORD_Z, x3 * t3 - x1 * f2 - x2 * f1, 'z');
            this.setCoordinate(COORD_XY, B3 * t3 - B1 * f2 - B2 * f1, 'xy');
            this.setCoordinate(COORD_YZ, B1 * t1 - B2 * f3 - B3 * f2, 'yz');
            this.setCoordinate(COORD_ZX, B2 * t2 - B3 * f1 - B1 * f3, 'zx');
            this.setCoordinate(COORD_PSEUDO, -nn * b, 'b');
            return this;
        }
    };
    /**
     * this ⟼ reverse(this)
     */
    Geometric3.prototype.rev = function () {
        if (this.isLocked()) {
            return lock(this.clone().rev());
        }
        else {
            // reverse has a ++-- structure on the grades.
            this.a = +this.a;
            this.x = +this.x;
            this.y = +this.y;
            this.z = +this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            return this;
        }
    };
    /**
     * Rotates this multivector using a rotor, R.
     *
     * @returns R * this * reverse(R) = R * this * ~R
     */
    Geometric3.prototype.rotate = function (R) {
        if (this.isLocked()) {
            return lock(this.clone().rotate(R));
        }
        else {
            // TODO: This only rotates the vector components. The bivector components will change.
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
        }
    };
    /**
     * Sets this multivector to a rotor that rotates through angle θ around the specified axis.
     *
     * @param axis The (unit) vector defining the rotation direction.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    Geometric3.prototype.rotorFromAxisAngle = function (axis, θ) {
        if (this.isLocked()) {
            throw new TargetLockedError('rotorFromAxisAngle');
        }
        // Compute the dual of the axis to obtain the corresponding bivector.
        var x = axis.x;
        var y = axis.y;
        var z = axis.z;
        var squaredNorm = x * x + y * y + z * z;
        if (squaredNorm === 1) {
            return this.rotorFromGeneratorAngle({ yz: x, zx: y, xy: z }, θ);
        }
        else {
            var norm = Math.sqrt(squaredNorm);
            var yz = x / norm;
            var zx = y / norm;
            var xy = z / norm;
            return this.rotorFromGeneratorAngle({ yz: yz, zx: zx, xy: xy }, θ);
        }
    };
    /**
     * Computes a rotor, R, from two unit vectors, where
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     *
     * @param a The starting vector
     * @param b The ending vector
     * @returns The rotor representing a rotation from a to b.
     */
    Geometric3.prototype.rotorFromDirections = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('rotorFromDirections');
        }
        var B = void 0;
        return this.rotorFromVectorToVector(a, b, B);
    };
    /**
     * Helper function for rotorFromFrameToFrame.
     */
    Geometric3.prototype.rotorFromTwoVectors = function (e1, f1, e2, f2) {
        // FIXME: This creates a lot of temporary objects.
        // Compute the rotor that takes e1 to f1.
        // There is no concern that the two vectors are anti-parallel.
        var R1 = Geometric3.rotorFromDirections(e1, f1);
        // Compute the image of e2 under the first rotation in order to calculate R2.
        var f = Geometric3.fromVector(e2).rotate(R1);
        // In case of rotation for antipodal vectors, define the fallback rotation bivector.
        var B = Geometric3.dualOfVector(f1);
        // Compute R2
        var R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
        // The total rotor, R, is the composition of R1 followed by R2.
        return this.mul2(R2, R1);
    };
    /**
     *
     */
    Geometric3.prototype.rotorFromFrameToFrame = function (es, fs) {
        if (this.isLocked()) {
            throw new TargetLockedError('rotorFromFrameToFrame');
        }
        // There is instability when the rotation angle is near 180 degrees.
        // So we don't use the formula based upon reciprocal frames.
        // Our algorithm is to first pick the vector that stays most aligned with itself.
        // This allows for the possibility that the other two vectors may become anti-aligned.
        // Observe that all three vectors can't be anti-aligned because that would be a reflection!
        // We then compute the rotor R1 that maps this first vector to its image.
        // Allowing then for the possibility that the remaining vectors may have ambiguous rotors,
        // we compute the dual of this image vector as the default rotation plane for one of the
        // other vectors. We only need to calculate the rotor R2 for one more vector because our
        // frames are orthogonal and so R1 and R2 determine R.
        //
        var biggestValue = -1;
        var firstVector = void 0;
        for (var i = 0; i < 3; i++) {
            cosines[i] = cosVectorVector(es[i], fs[i]);
            if (cosines[i] > biggestValue) {
                firstVector = i;
                biggestValue = cosines[i];
            }
        }
        if (typeof firstVector === 'number') {
            var secondVector = (firstVector + 1) % 3;
            return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
        }
        else {
            throw new Error("Unable to compute rotor.");
        }
    };
    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    Geometric3.prototype.rotorFromGeneratorAngle = function (B, θ) {
        if (this.isLocked()) {
            throw new TargetLockedError('rotorFromGeneratorAngle');
        }
        var φ = θ / 2;
        var yz = B.yz;
        var zx = B.zx;
        var xy = B.xy;
        var absB = Math.sqrt(yz * yz + zx * zx + xy * xy);
        var mφ = absB * φ;
        var sinDivAbsB = Math.sin(mφ) / absB;
        this.a = Math.cos(mφ);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = -yz * sinDivAbsB;
        this.zx = -zx * sinDivAbsB;
        this.xy = -xy * sinDivAbsB;
        this.b = 0;
        return this;
    };
    /**
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     */
    Geometric3.prototype.rotorFromVectorToVector = function (a, b, B) {
        if (this.isLocked()) {
            throw new TargetLockedError('rotorFromVectorToVector');
        }
        rotorFromDirectionsE3(a, b, B, this);
        return this;
    };
    /**
     * Scalar Product
     * @returns scp(this, rhs) = this | rhs
     */
    Geometric3.prototype.scp = function (rhs) {
        if (this.isLocked()) {
            return lock(this.clone().scp(rhs));
        }
        else {
            return this.scp2(this, rhs);
        }
    };
    /**
     * this ⟼ scp(a, b) = a | b
     */
    Geometric3.prototype.scp2 = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('scp2');
        }
        return scpG3(a, b, this);
    };
    /**
     * this ⟼ this * alpha
     */
    Geometric3.prototype.scale = function (alpha) {
        if (this.isLocked()) {
            return lock(this.clone().scale(alpha));
        }
        else {
            this.a *= alpha;
            this.x *= alpha;
            this.y *= alpha;
            this.z *= alpha;
            this.yz *= alpha;
            this.zx *= alpha;
            this.xy *= alpha;
            this.b *= alpha;
            return this;
        }
    };
    /**
     * Applies the diagonal elements of a scaling matrix to this multivector.
     *
     * @param σ
     */
    Geometric3.prototype.stress = function (σ) {
        if (this.isLocked()) {
            return lock(this.clone().stress(σ));
        }
        else {
            this.x *= σ.x;
            this.y *= σ.y;
            this.z *= σ.z;
            // TODO: Action on other components TBD.
            return this;
        }
    };
    /**
     * Sets this multivector to the geometric product of the arguments.
     * This multivector must be mutable (in the unlocked state).
     *
     * this ⟼ a * b
     *
     * @param a The vector on the left of the operator.
     * @param b The vector on the right of the operator.
     *
     * @returns the geometric product, a * b, of the vector arguments.
     */
    Geometric3.prototype.versor = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('versor');
        }
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        this.zero();
        this.a = dotVectorE3(a, b);
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    /**
     * @returns this - M * α
     */
    Geometric3.prototype.sub = function (M, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return lock(this.clone().sub(M, α));
        }
        else {
            this.a -= M.a * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.b -= M.b * α;
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ this - v * α</code>
     * </p>
     *
     * @param v
     * @param α
     * @returns this - v * α
     */
    Geometric3.prototype.subVector = function (v, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return lock(this.clone().subVector(v, α));
        }
        else {
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric3.prototype.sub2 = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('sub2');
        }
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
    /**
     *
     */
    Geometric3.prototype.toArray = function () {
        return coordinates(this);
    };
    /**
     * Returns a string representing the number in exponential notation.
     */
    Geometric3.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * Returns a string representing the number in fixed-point notation.
     */
    Geometric3.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     *
     */
    Geometric3.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * Returns a string representation of this multivector.
     */
    Geometric3.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * Extraction of grade <em>i</em>.
     *
     * If this multivector is mutable (unlocked) then it is set to the result.
     *
     * @param i The index of the grade to be extracted.
     */
    Geometric3.prototype.grade = function (i) {
        if (this.isLocked()) {
            return lock(this.clone().grade(i));
        }
        mustBeInteger('i', i);
        switch (i) {
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
    /**
     * @returns this ^ m
     */
    Geometric3.prototype.ext = function (m) {
        if (this.isLocked()) {
            return lock(this.clone().ext(m));
        }
        else {
            return this.ext2(this, m);
        }
    };
    /**
     * Sets this multivector to the outer product of `a` and `b`.
     * this ⟼ a ^ b
     */
    Geometric3.prototype.ext2 = function (a, b) {
        if (this.isLocked()) {
            throw new TargetLockedError('ext2');
        }
        return extG3(a, b, this);
    };
    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    Geometric3.prototype.zero = function () {
        if (this.isLocked()) {
            throw new TargetLockedError('zero');
        }
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
    /**
     * Implements `this + rhs` as addition.
     * The returned value is locked.
     */
    Geometric3.prototype.__add__ = function (rhs) {
        var duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().add(duckR));
        }
        else if (isVectorE3(rhs)) {
            return lock(this.clone().addVector(rhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs + this` as addition.
     * The returned value is locked.
     */
    Geometric3.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).add(this));
        }
        else if (isVectorE3(lhs)) {
            return lock(Geometric3.fromVector(lhs).add(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this / rhs` as division.
     * The returned value is locked.
     */
    Geometric3.prototype.__div__ = function (rhs) {
        var duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().div(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs / this` as division.
     * The returned value is locked.
     */
    Geometric3.prototype.__rdiv__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).div(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this * rhs` as the geometric product.
     * The returned value is locked.
     */
    Geometric3.prototype.__mul__ = function (rhs) {
        var duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().mul(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs * this` as the geometric product.
     * The returned value is locked.
     */
    Geometric3.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.copy(this).scale(lhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this - rhs` as subtraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__sub__ = function (rhs) {
        var duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().sub(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs - this` as subtraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this ^ rhs` as the extension.
     * The returned value is locked.
     */
    Geometric3.prototype.__wedge__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).ext(rhs));
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is scalar multiplication.
            return lock(Geometric3.copy(this).scale(rhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs ^ this` as the extension.
     * The returned value is locked.
     */
    Geometric3.prototype.__rwedge__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).ext(this));
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return lock(Geometric3.copy(this).scale(lhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this << rhs` as the left contraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__lshift__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).lco(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs << this` as the left contraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__rlshift__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this >> rhs` as the right contraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__rshift__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).rco(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs >> this` as the right contraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__rrshift__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this | rhs` as the scalar product.
     * The returned value is locked.
     */
    Geometric3.prototype.__vbar__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric3.copy(this).scp(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs | this` as the scalar product.
     * The returned value is locked.
     */
    Geometric3.prototype.__rvbar__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric3.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `!this` as the inverse (if it exists) of `this`.
     * The returned value is locked.
     */
    Geometric3.prototype.__bang__ = function () {
        return lock(Geometric3.copy(this).inv());
    };
    /**
     * Implements `+this` as `this`.
     * The returned value is locked.
     */
    Geometric3.prototype.__pos__ = function () {
        return lock(Geometric3.copy(this));
    };
    /**
     * Implements `-this` as the negative of `this`.
     * The returned value is locked.
     */
    Geometric3.prototype.__neg__ = function () {
        return lock(Geometric3.copy(this).neg());
    };
    /**
     * Implements `~this` as the reversion of `this`.
     * The returned value is locked.
     */
    Geometric3.prototype.__tilde__ = function () {
        return lock(Geometric3.copy(this).rev());
    };
    /**
     *
     */
    Geometric3.one = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric3.ONE : Geometric3.scalar(1);
    };
    /**
     * Constructs the basis vector e1.
     * Locking the vector prevents mutation.
     */
    Geometric3.e1 = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric3.E1 : Geometric3.vector(1, 0, 0);
    };
    /**
     * Constructs the basis vector e2.
     * Locking the vector prevents mutation.
     */
    Geometric3.e2 = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric3.E2 : Geometric3.vector(0, 1, 0);
    };
    /**
     * Constructs the basis vector e3.
     * Locking the vector prevents mutation.
     */
    Geometric3.e3 = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric3.E3 : Geometric3.vector(0, 0, 1);
    };
    /**
     *
     */
    Geometric3.I = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric3.PSEUDO : Geometric3.pseudo(1);
    };
    /**
     * Constructs a mutable bivector with the coordinates `yz`, `zx`, and `xy`.
     */
    Geometric3.bivector = function (yz, zx, xy) {
        return new Geometric3(bivector(yz, zx, xy));
    };
    /**
     * Constructs a mutable multivector by copying a multivector.
     */
    Geometric3.copy = function (M) {
        return new Geometric3(coordinates(M));
    };
    /**
     * Constructs a mutable multivector which is the dual of the bivector `B`.
     */
    Geometric3.dualOfBivector = function (B) {
        return new Geometric3(vector(-B.yz, -B.zx, -B.xy));
    };
    /**
     * Constructs a mutable multivector which is the dual of the vector `v`.
     */
    Geometric3.dualOfVector = function (v) {
        return new Geometric3(bivector(v.x, v.y, v.z));
    };
    /**
     * Constructs a mutable multivector by copying the bivector `B`.
     */
    Geometric3.fromBivector = function (B) {
        return Geometric3.bivector(B.yz, B.zx, B.xy);
    };
    /**
     * Constructs a mutable multivector by copying the scalar `α`.
     */
    Geometric3.fromScalar = function (α) {
        return Geometric3.scalar(α.a);
    };
    /**
     * Constructs a mutable multivector by copying the spinor `s`.
     */
    Geometric3.fromSpinor = function (s) {
        return Geometric3.spinor(s.yz, s.zx, s.xy, s.a);
    };
    /**
     * Constructs a mutable multivector by copying the vector `v`.
     */
    Geometric3.fromVector = function (v) {
        return Geometric3.vector(v.x, v.y, v.z);
    };
    /**
     * Constructs a mutable multivector that linearly interpolates `A` and `B`, A + α * (B - A)
     */
    Geometric3.lerp = function (A, B, α) {
        return Geometric3.copy(A).lerp(B, α);
    };
    /**
     * Constructs a mutable pseudoscalar with the magnitude `β`.
     */
    Geometric3.pseudo = function (β) {
        return new Geometric3(pseudo(β));
    };
    /**
     * Computes a multivector with random components in the range [lowerBound, upperBound].
     */
    Geometric3.random = function (lowerBound, upperBound) {
        if (lowerBound === void 0) { lowerBound = -1; }
        if (upperBound === void 0) { upperBound = +1; }
        var a = randomRange(lowerBound, upperBound);
        var x = randomRange(lowerBound, upperBound);
        var y = randomRange(lowerBound, upperBound);
        var z = randomRange(lowerBound, upperBound);
        var yz = randomRange(lowerBound, upperBound);
        var zx = randomRange(lowerBound, upperBound);
        var xy = randomRange(lowerBound, upperBound);
        var b = randomRange(lowerBound, upperBound);
        return new Geometric3(multivector(a, x, y, z, yz, zx, xy, b));
    };
    /**
     * Computes the rotor that rotates vector `a` to vector `b`.
     * The result is independent of the magnitudes of `a` and `b`.
     */
    Geometric3.rotorFromDirections = function (a, b) {
        return new Geometric3(zero()).rotorFromDirections(a, b);
    };
    Geometric3.rotorFromFrameToFrame = function (es, fs) {
        return new Geometric3(zero()).rotorFromFrameToFrame(es, fs);
    };
    /**
     * Computes the rotor that rotates vector `a` to vector `b`.
     * The bivector B provides the plane of rotation when `a` and `b` are anti-aligned.
     * The result is independent of the magnitudes of `a` and `b`.
     */
    Geometric3.rotorFromVectorToVector = function (a, b, B) {
        return new Geometric3(zero()).rotorFromVectorToVector(a, b, B);
    };
    /**
     * Constructs a mutable scalar with the magnitude `α`.
     */
    Geometric3.scalar = function (α) {
        return new Geometric3(scalar(α));
    };
    /**
     * Constructs a mutable scalar with the coordinates `yz`, `zx`, `xy`, and `α`.
     */
    Geometric3.spinor = function (yz, zx, xy, α) {
        return new Geometric3(spinor(α, yz, zx, xy));
    };
    /**
     * Constructs a mutable vector with the coordinates `x`, `y`, and `z`.
     */
    Geometric3.vector = function (x, y, z) {
        return new Geometric3(vector(x, y, z));
    };
    /**
     * Constructs a mutable bivector as the outer product of two vectors.
     */
    Geometric3.wedge = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var yz = wedgeYZ(ax, ay, az, bx, by, bz);
        var zx = wedgeZX(ax, ay, az, bx, by, bz);
        var xy = wedgeXY(ax, ay, az, bx, by, bz);
        return Geometric3.bivector(yz, zx, xy);
    };
    /**
     *
     */
    Geometric3.zero = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric3.ZERO : new Geometric3(zero());
    };
    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    Geometric3.ZERO = new Geometric3(scalar(0));
    /**
     * The identity element for multiplication, `1`.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.ONE = new Geometric3(scalar(1));
    /**
     * The basis element corresponding to the vector `x` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.E1 = new Geometric3(vector(1, 0, 0));
    /**
     * The basis element corresponding to the vector `y` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.E2 = new Geometric3(vector(0, 1, 0));
    /**
     * The basis element corresponding to the vector `z` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.E3 = new Geometric3(vector(0, 0, 1));
    /**
     * The basis element corresponding to the pseudoscalar `b` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.PSEUDO = new Geometric3(pseudo(1));
    return Geometric3;
}());
applyMixins(Geometric3, [LockableMixin]);
Geometric3.E1.lock();
Geometric3.E2.lock();
Geometric3.E3.lock();
Geometric3.PSEUDO.lock();
Geometric3.ONE.lock();
Geometric3.ZERO.lock();

var u = Geometric3.zero(false);
var v = Geometric3.zero(false);
var n = Geometric3.zero(false);
var e1 = Geometric3.E1;
var e2 = Geometric3.E2;
var e3 = Geometric3.E3;
function getViewAttitude(eye, look, up, R) {
    // The attitude is obtained by computing the rotor required to rotate
    // the standard reference frame u, v, n = (e1, e2, e3) to the new reference
    // frame.
    // n = direction(X - look)
    n.copyVector(eye).subVector(look).normalize();
    // u = -(dual(up) >> n) (right contraction turns vector in opposite sense to bivector)
    u.copyVector(up).dual(u).rco(n).neg();
    // v = dual(u ^ n)
    v.copy(u).ext(n).dual(v);
    // We recover the rotor as follows:
    // R = ψ / sqrt(ψ * ~ψ), where ψ = 1 + u * e1 + v * e2 + n * e3
    // We can use e1, e2, e3 as the reciprocal vectors because in an orthogonal
    // frame they are the same as the standard basis vectors.
    // We don't need u, v, w after we recover the rotor, so use them in the
    // intermediate calculation
    R.one().add(u.mul(e1)).add(v.mul(e2)).add(n.mul(e3));
    R.normalize();
}

/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 */
function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
    return ax * bx + ay * by + az * bz;
}

function mulSpinorE3YZ(R, S) {
    return R.yz * S.a - R.zx * S.xy + R.xy * S.zx + R.a * S.yz;
}

function mulSpinorE3ZX(R, S) {
    return R.yz * S.xy + R.zx * S.a - R.xy * S.yz + R.a * S.zx;
}

function mulSpinorE3XY(R, S) {
    return -R.yz * S.zx + R.zx * S.yz + R.xy * S.a + R.a * S.xy;
}

function mulSpinorE3alpha(R, S) {
    return -R.yz * S.yz - R.zx * S.zx - R.xy * S.xy + R.a * S.a;
}

function beObject() {
    return "be an `object`";
}
function mustBeObject(name, value, contextBuilder) {
    mustSatisfy(name, isObject(value), beObject, contextBuilder);
    return value;
}

function quadSpinorE3(s) {
    if (isDefined(s)) {
        var α = s.a;
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

function toStringCustom(coordinates, coordToString, labels) {
    var quantityString = stringFromCoordinates(coordinates, coordToString, labels);
    return quantityString;
}

// Constants for the coordinate indices into the coords array.
var COORD_YZ$3 = 0;
var COORD_ZX$3 = 1;
var COORD_XY$3 = 2;
var COORD_SCALAR$1 = 3;
var BASIS_LABELS$1 = ['e23', 'e31', 'e12', '1'];
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates$1(m) {
    return [m.yz, m.zx, m.xy, m.a];
}
var exp = Math.exp;
var cos = Math.cos;
var sin = Math.sin;
var sqrt$1 = Math.sqrt;
var magicCode = Math.random();
/**
 * A Geometric Number representing the even sub-algebra of G3.
 */
var Spinor3 = (function () {
    /**
     * @param coords [yz, zx, xy, a]
     * @param code
     */
    function Spinor3(coords, code) {
        if (code !== magicCode) {
            throw new Error("Use the static creation methods instead of the constructor");
        }
        this.coords_ = coords;
        this.modified_ = false;
    }
    Object.defineProperty(Spinor3.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "yz", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>23</sub> basis bivector.
         */
        get: function () {
            return this.coords_[COORD_YZ$3];
        },
        set: function (yz) {
            if (this.isLocked()) {
                throw new TargetLockedError('set yz');
            }
            mustBeNumber('yz', yz);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_YZ$3] !== yz;
            coords[COORD_YZ$3] = yz;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "zx", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>31</sub> basis bivector.
         */
        get: function () {
            return this.coords_[COORD_ZX$3];
        },
        set: function (zx) {
            if (this.isLocked()) {
                throw new TargetLockedError('zx');
            }
            mustBeNumber('zx', zx);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_ZX$3] !== zx;
            coords[COORD_ZX$3] = zx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "xy", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>12</sub> basis bivector.
         */
        get: function () {
            return this.coords_[COORD_XY$3];
        },
        set: function (xy) {
            if (this.isLocked()) {
                throw new TargetLockedError('xy');
            }
            mustBeNumber('xy', xy);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_XY$3] !== xy;
            coords[COORD_XY$3] = xy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "a", {
        /**
         * The coordinate corresponding to the <b>1</b> basis scalar.
         */
        get: function () {
            return this.coords_[COORD_SCALAR$1];
        },
        set: function (α) {
            if (this.isLocked()) {
                throw new TargetLockedError('a');
            }
            mustBeNumber('α', α);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_SCALAR$1] !== α;
            coords[COORD_SCALAR$1] = α;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "length", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor3.prototype, "maskG3", {
        /**
         *
         */
        get: function () {
            var coords = this.coords_;
            var α = coords[COORD_SCALAR$1];
            var yz = coords[COORD_YZ$3];
            var zx = coords[COORD_ZX$3];
            var xy = coords[COORD_XY$3];
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
            throw new Error(readOnly('maskG3').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @param spinor
     * @param α
     * @returns this + α * spinor
     */
    Spinor3.prototype.add = function (spinor, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('spinor', spinor);
        mustBeNumber('α', α);
        this.yz += spinor.yz * α;
        this.zx += spinor.zx * α;
        this.xy += spinor.xy * α;
        this.a += spinor.a * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     *
     * @param a
     * @param b
     * @returns a + b
     */
    Spinor3.prototype.add2 = function (a, b) {
        this.a = a.a + b.a;
        this.yz = a.yz + b.yz;
        this.zx = a.zx + b.zx;
        this.xy = a.xy + b.xy;
        return this;
    };
    /**
     * Intentionally undocumented.
     * @return this + I * β
     */
    Spinor3.prototype.addPseudo = function (β) {
        mustBeNumber('β', β);
        return this;
    };
    /**
     * this ⟼ this + α
     *
     * @param α
     * @returns this + α
     */
    Spinor3.prototype.addScalar = function (α) {
        mustBeNumber('α', α);
        this.a += α;
        return this;
    };
    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns arg(this)
     */
    Spinor3.prototype.arg = function () {
        if (this.isLocked()) {
            return lock(this.clone().arg());
        }
        else {
            return this.log().grade(2);
        }
    };
    /**
     *
     */
    Spinor3.prototype.approx = function (n) {
        approx(this.coords_, n);
        return this;
    };
    /**
     * Returns an unlocked (mutable) copy of `this`.
     */
    Spinor3.prototype.clone = function () {
        return Spinor3.spinor(this.yz, this.zx, this.xy, this.a);
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    Spinor3.prototype.conj = function () {
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ copy(source)</code>
     * </p>
     *
     * @method copy
     * @param source {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
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
        // Copy using the setters so that the modified flag is updated.
        this.yz = coordinates[COORD_YZ$3];
        this.zx = coordinates[COORD_ZX$3];
        this.xy = coordinates[COORD_XY$3];
        this.a = coordinates[COORD_SCALAR$1];
        return this;
    };
    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     *
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.copyScalar = function (α) {
        return this.zero().addScalar(α);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor3.prototype.copySpinor = function (s) {
        return this.copy(s);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor3.prototype.copyVector = function (vector) {
        return this.zero();
    };
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     *
     * @method div
     * @param s {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.div = function (s) {
        return this.div2(this, s);
    };
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @method div2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.div2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.yz;
        var a2 = a.zx;
        var a3 = a.xy;
        var b0 = b.a;
        var b1 = b.yz;
        var b2 = b.zx;
        var b3 = b.xy;
        // Compare this to the product for Quaternions
        // How does this compare to Geometric3
        // It would be interesting to DRY this out.
        this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     *
     * @method divByScalar
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.divByScalar = function (α) {
        this.yz /= α;
        this.zx /= α;
        this.xy /= α;
        this.a /= α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ dual(v) = I * v</code>
     * </p>
     *
     * @method dual
     * @param v {VectorE3} The vector whose dual will be used to set this spinor.
     * @param changeSign {boolean}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
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
    /**
     * <code>this ⟼ e<sup>this</sup></code>
     *
     * @returns exp(this)
     */
    Spinor3.prototype.exp = function () {
        var w = this.a;
        var x = this.yz;
        var y = this.zx;
        var z = this.xy;
        var expW = exp(w);
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        // FIXME: DRY
        var φ = sqrt$1(x * x + y * y + z * z);
        var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
        this.a = expW * cos(φ);
        this.yz = x * s;
        this.zx = y * s;
        this.xy = z * s;
        return this;
    };
    Spinor3.prototype.getComponent = function (index) {
        return this.coords_[index];
    };
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     *
     * @method inv
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.inv = function () {
        this.conj();
        this.divByScalar(this.squaredNormSansUnits());
        return this;
    };
    /**
     * @method isOne
     * @return {boolean}
     */
    Spinor3.prototype.isOne = function () {
        return this.a === 1 && this.xy === 0 && this.yz === 0 && this.zx === 0;
    };
    /**
     * @method isZero
     * @return {boolean}
     */
    Spinor3.prototype.isZero = function () {
        return this.a === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0;
    };
    /**
     * @method lco
     * @param rhs {Spinor3}
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.lco = function (rhs) {
        return this.lco2(this, rhs);
    };
    /**
     *
     */
    Spinor3.prototype.lco2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     *
     * @method lerp
     * @param target {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
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
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     *
     * @method lerp2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.lerp2 = function (a, b, α) {
        this.sub2(b, a).scale(α).add(a);
        return this;
    };
    /**
     * this ⟼ log(this)
     */
    Spinor3.prototype.log = function () {
        // FIXME: Wrong
        var w = this.a;
        var x = this.yz;
        var y = this.zx;
        var z = this.xy;
        // FIXME: DRY
        var bb = x * x + y * y + z * z;
        var Vector2 = sqrt$1(bb);
        var R0 = Math.abs(w);
        var R = sqrt$1(w * w + bb);
        this.a = Math.log(R);
        var θ = Math.atan2(Vector2, R0) / Vector2;
        // The angle, θ, produced by atan2 will be in the range [-π, +π]
        this.yz = x * θ;
        this.zx = y * θ;
        this.xy = z * θ;
        return this;
    };
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     * <p>
     * This method does not change this multivector.
     * </p>
     *
     * @method magnitude
     * @return {number}
     */
    Spinor3.prototype.magnitude = function () {
        return sqrt$1(this.squaredNormSansUnits());
    };
    /**
     * Intentionally undocumented.
     */
    Spinor3.prototype.magnitudeSansUnits = function () {
        return sqrt$1(this.squaredNormSansUnits());
    };
    /**
     * <p>
     * <code>this ⟼ this * rhs</code>
     * </p>
     *
     * @method mul
     * @param rhs {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.mul = function (rhs) {
        var α = mulSpinorE3alpha(this, rhs);
        var yz = mulSpinorE3YZ(this, rhs);
        var zx = mulSpinorE3ZX(this, rhs);
        var xy = mulSpinorE3XY(this, rhs);
        this.a = α;
        this.yz = yz;
        this.zx = zx;
        this.xy = xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @method mul2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.mul2 = function (a, b) {
        var α = mulSpinorE3alpha(a, b);
        var yz = mulSpinorE3YZ(a, b);
        var zx = mulSpinorE3ZX(a, b);
        var xy = mulSpinorE3XY(a, b);
        this.a = α;
        this.yz = yz;
        this.zx = zx;
        this.xy = xy;
        return this;
    };
    /**
     * @method neg
     *
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.neg = function () {
        this.a = -this.a;
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     *
     * @method norm
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.norm = function () {
        var norm = this.magnitudeSansUnits();
        return this.zero().addScalar(norm);
    };
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     *
     * @method normalize
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.normalize = function () {
        var m = this.magnitude();
        this.yz = this.yz / m;
        this.zx = this.zx / m;
        this.xy = this.xy / m;
        this.a = this.a / m;
        return this;
    };
    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     *
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.one = function () {
        this.a = 1;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this * conj(this)</code>
     * </p>
     *
     * @method quad
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.quad = function () {
        var squaredNorm = this.squaredNormSansUnits();
        return this.zero().addScalar(squaredNorm);
    };
    /**
     * <p>
     * This method does not change this multivector.
     * </p>
     *
     * @method squaredNorm
     * @return {number}
     */
    Spinor3.prototype.squaredNorm = function () {
        return quadSpinorE3(this);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor3.prototype.squaredNormSansUnits = function () {
        return quadSpinorE3(this);
    };
    /**
     * @method stress
     * @param σ {VectorE3}
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.stress = function (σ) {
        // There is no change to the scalar coordinate, α.
        this.yz = this.yz * σ.y * σ.z;
        this.zx = this.zx * σ.z * σ.x;
        this.xy = this.xy * σ.x * σ.y;
        return this;
    };
    Spinor3.prototype.rco = function (rhs) {
        return this.rco2(this, rhs);
    };
    Spinor3.prototype.rco2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this;
    };
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     *
     * @method rev
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.rev = function () {
        this.yz *= -1;
        this.zx *= -1;
        this.xy *= -1;
        return this;
    };
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     *
     * @method reflect
     * @param n {VectorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
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
    /**
     * <p>
     * <code>this = ⟼ R * this * rev(R)</code>
     * </p>
     *
     * @method rotate
     * @param R {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.rotate = function (R) {
        // R * this * rev(R) = R * rev(R * rev(this));
        this.rev();
        this.mul2(R, this);
        this.rev();
        this.mul2(R, this);
        return this;
    };
    /**
     * <p>
     * Computes a rotor, R, from two vectors, where
     * R = (abs(b) * abs(a) + b * a) / sqrt(2 * (quad(b) * quad(a) + abs(b) * abs(a) * b << a))
     * </p>
     *
     * @method rotorFromDirections
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     * @return {Spinor3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    Spinor3.prototype.rotorFromDirections = function (a, b) {
        return this.rotorFromVectorToVector(a, b, void 0);
    };
    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     *
     * @param B The unit bivector that generates the rotation.
     * @param θ The rotation angle in radians.
     */
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
        rotorFromDirectionsE3(a, b, B, this);
        return this;
    };
    Spinor3.prototype.scp = function (rhs) {
        return this.scp2(this, rhs);
    };
    Spinor3.prototype.scp2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     *
     * @method scale
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.scale = function (α) {
        mustBeNumber('α', α);
        this.yz *= α;
        this.zx *= α;
        this.xy *= α;
        this.a *= α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     *
     * @method sub
     * @param s {SpinorE3}
     * @param [α = 1] {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.sub = function (s, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('s', s);
        mustBeNumber('α', α);
        this.yz -= s.yz * α;
        this.zx -= s.zx * α;
        this.xy -= s.xy * α;
        this.a -= s.a * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @method sub2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    Spinor3.prototype.sub2 = function (a, b) {
        this.yz = a.yz - b.yz;
        this.zx = a.zx - b.zx;
        this.xy = a.xy - b.xy;
        this.a = a.a - b.a;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * Sets this Spinor3 to the geometric product, a * b, of the vector arguments.
     *
     * @param a
     * @param b
     */
    Spinor3.prototype.versor = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        this.a = dotVectorCartesianE3(ax, ay, az, bx, by, bz);
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     *
     * Sets this Spinor3 to the exterior product, a ^ b, of the vector arguments.
     *
     * @method wedge
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.wedge = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        this.a = 0;
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    /**
     * @method grade
     * @param grade {number}
     * @return {Spinor3}
     * @chainable
     */
    Spinor3.prototype.grade = function (grade) {
        mustBeInteger('grade', grade);
        switch (grade) {
            case 0: {
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                break;
            }
            case 2: {
                this.a = 0;
                break;
            }
            default: {
                this.a = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
            }
        }
        return this;
    };
    /**
     *
     */
    Spinor3.prototype.toArray = function () {
        return coordinates$1(this);
    };
    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Spinor3.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return toStringCustom(coordinates$1(this), coordToString, BASIS_LABELS$1);
    };
    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Spinor3.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return toStringCustom(coordinates$1(this), coordToString, BASIS_LABELS$1);
    };
    /**
     * @method toPrecision
     * @param [position] {number}
     * @return {string}
     */
    Spinor3.prototype.toPrecision = function (position) {
        var coordToString = function (coord) { return coord.toPrecision(position); };
        return toStringCustom(coordinates$1(this), coordToString, BASIS_LABELS$1);
    };
    /**
     * @method toString
     * @param [radix] {number}
     * @return {string} A non-normative string representation of the target.
     */
    Spinor3.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return toStringCustom(coordinates$1(this), coordToString, BASIS_LABELS$1);
    };
    Spinor3.prototype.ext = function (rhs) {
        return this.ext2(this, rhs);
    };
    Spinor3.prototype.ext2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG3(a, b, this)
        return this;
    };
    /**
     * Sets this spinor to the identity element for addition, <b>0</b>.
     *
     * @return {Spinor3} <code>this</code>
     */
    Spinor3.prototype.zero = function () {
        this.a = 0;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        return this;
    };
    /**
     * @param spinor The spinor to be copied.
     * @returns A copy of the spinor argument.
     */
    Spinor3.copy = function (spinor) {
        var s = Spinor3.zero.clone().copy(spinor);
        s.modified_ = false;
        return s;
    };
    /**
     * Computes I * v, the dual of v.
     *
     * @param v
     * @param changeSign
     * @returns I * v
     */
    Spinor3.dual = function (v, changeSign) {
        return Spinor3.zero.clone().dual(v, changeSign);
    };
    Spinor3.fromBivector = function (B) {
        return new Spinor3([B.yz, B.zx, B.xy, 0], magicCode);
    };
    /**
     *
     */
    Spinor3.isOne = function (spinor) {
        return spinor.a === 1 && spinor.yz === 0 && spinor.zx === 0 && spinor.xy === 0;
    };
    /**
     * @param a
     * @param b
     * @param α
     * @returns a + α * (b - a)
     */
    Spinor3.lerp = function (a, b, α) {
        return Spinor3.copy(a).lerp(b, α);
    };
    /**
     * <p>
     * Computes a unit spinor with a random direction.
     * </p>
     */
    Spinor3.random = function () {
        var yz = randomRange(-1, 1);
        var zx = randomRange(-1, 1);
        var xy = randomRange(-1, 1);
        var α = randomRange(-1, 1);
        return Spinor3.spinor(yz, zx, xy, α).normalize();
    };
    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     *
     * @param a The <em>from</em> vector.
     * @param b The <em>to</em> vector.
     */
    Spinor3.rotorFromDirections = function (a, b) {
        return Spinor3.zero.clone().rotorFromDirections(a, b);
    };
    /**
     * Constructs a new Spinor3 from coordinates.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param a The coordinate corresponding to the 1 basis scalar.
     */
    Spinor3.spinor = function (yz, zx, xy, a) {
        return new Spinor3([yz, zx, xy, a], magicCode);
    };
    /**
     * @param a
     * @param b
     */
    Spinor3.wedge = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var yz = wedgeYZ(ax, ay, az, bx, by, bz);
        var zx = wedgeZX(ax, ay, az, bx, by, bz);
        var xy = wedgeXY(ax, ay, az, bx, by, bz);
        return Spinor3.spinor(yz, zx, xy, 0);
    };
    /**
     *
     */
    Spinor3.one = Spinor3.spinor(0, 0, 0, 1);
    /**
     *
     */
    Spinor3.zero = Spinor3.spinor(0, 0, 0, 0);
    return Spinor3;
}());
applyMixins(Spinor3, [LockableMixin]);
Spinor3.one.lock();
Spinor3.zero.lock();

function beDefined() {
    return "not be 'undefined'";
}
function mustBeDefined(name, value, contextBuilder) {
    mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
    return value;
}

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

/**
 * Base class for matrices with the expectation that they will be used with WebGL.
 * The underlying data storage is a <code>Float32Array</code>.
 */
var AbstractMatrix = (function () {
    /**
     * @param elements
     * @param dimensions
     */
    function AbstractMatrix(elements, dimensions) {
        this.lock_ = lockable();
        this.elements_ = mustBeDefined('elements', elements);
        this.dimensions_ = mustBeInteger('dimensions', dimensions);
        this.length_ = dimensions * dimensions;
        expectArg('elements', elements).toSatisfy(elements.length === this.length_, 'elements must have length ' + this.length_);
        this.modified = false;
    }
    AbstractMatrix.prototype.isLocked = function () {
        return this.lock_.isLocked();
    };
    AbstractMatrix.prototype.lock = function () {
        return this.lock_.lock();
    };
    AbstractMatrix.prototype.unlock = function (token) {
        return this.lock_.unlock(token);
    };
    Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
        get: function () {
            return this.dimensions_;
        },
        set: function (unused) {
            throw new Error(readOnly('dimensions').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMatrix.prototype, "elements", {
        get: function () {
            return this.elements_;
        },
        set: function (elements) {
            if (this.isLocked()) {
                throw new TargetLockedError('elements');
            }
            expectArg('elements', elements).toSatisfy(elements.length === this.length_, "elements length must be " + this.length_);
            this.elements_ = elements;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMatrix.prototype.copy = function (m) {
        if (this.isLocked()) {
            throw new TargetLockedError('copy');
        }
        this.elements.set(m.elements);
        return this;
    };
    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    AbstractMatrix.prototype.getElement = function (row, column) {
        return this.elements[row + column * this.dimensions_];
    };
    /**
     * Determines whether this matrix is the identity matrix.
     */
    AbstractMatrix.prototype.isOne = function () {
        for (var i = 0; i < this.dimensions_; i++) {
            for (var j = 0; j < this.dimensions_; j++) {
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
    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     * @param value The value of the element.
     */
    AbstractMatrix.prototype.setElement = function (row, column, value) {
        if (this.isLocked()) {
            throw new TargetLockedError('setElement');
        }
        this.elements[row + column * this.dimensions_] = value;
    };
    return AbstractMatrix;
}());

/**
 * Computes the determinant of a 3x3 (square) matrix where the elements are assumed to be in column-major order.
 */
function det3x3(m) {
    var m00 = m[0x0], m01 = m[0x3], m02 = m[0x6];
    var m10 = m[0x1], m11 = m[0x4], m12 = m[0x7];
    var m20 = m[0x2], m21 = m[0x5], m22 = m[0x8];
    return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
}

/**
 * Computes the inverse of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
function inv3x3(m, te) {
    var det = det3x3(m);
    var m11 = m[0x0], m12 = m[0x3], m13 = m[0x6];
    var m21 = m[0x1], m22 = m[0x4], m23 = m[0x7];
    var m31 = m[0x2], m32 = m[0x5], m33 = m[0x8];
    // Row 1
    var o11 = m22 * m33 - m23 * m32;
    var o12 = m13 * m32 - m12 * m33;
    var o13 = m12 * m23 - m13 * m22;
    // Row 2
    var o21 = m23 * m31 - m21 * m33;
    var o22 = m11 * m33 - m13 * m31;
    var o23 = m13 * m21 - m11 * m23;
    // Row 3
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
/**
 * <p>
 * A 3x3 (square) matrix of <code>number</code>s.
 * </p>
 * <p>
 * An adapter over a <code>Float32Array</code>, enabling it to be used directly with WebGL.
 * </p>
 * <p>
 * The 9 elements are stored in <em>column-major</em> order (the order expected by WebGL):
 * <table>
 * <tr><td>0</td><td>3</td><td>6</td></tr>
 * <tr><td>1</td><td>4</td><td>7</td></tr>
 * <tr><td>2</td><td>5</td><td>8</td></tr>
 * </table>
 * </p>
 */
var Matrix3 = (function (_super) {
    __extends(Matrix3, _super);
    /**
     * @param elements
     */
    function Matrix3(elements) {
        return _super.call(this, elements, 3) || this;
    }
    /**
     *
     */
    Matrix3.prototype.add = function (rhs) {
        if (this.isLocked()) {
            throw new TargetLockedError('add');
        }
        return this.add2(this, rhs);
    };
    /**
     *
     */
    Matrix3.prototype.add2 = function (a, b) {
        add3x3(a.elements, b.elements, this.elements);
        return this;
    };
    /**
     * Returns a copy of this Matrix3 instance.
     */
    Matrix3.prototype.clone = function () {
        return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])).copy(this);
    };
    /**
     * Computes the determinant.
     */
    Matrix3.prototype.det = function () {
        return det3x3(this.elements);
    };
    /**
     * <p>
     * Sets this matrix to the inverse of the upper-left 3x3 portion of a 4x4 matrix.
     * </p>
     *
     * @param matrix
     * @param throwOnSingular
     */
    Matrix3.prototype.invertUpperLeft = function (matrix, throwOnSingular) {
        if (throwOnSingular === void 0) { throwOnSingular = false; }
        var me = matrix.elements;
        var te = this.elements;
        // Compute the determinants of the minors.
        // This is the Laplacian development by minors.
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
                // FIXME: At this point we have mutated this matrix.
                // It would be better to leave it unchanged.
                throw new Error(msg);
            }
            else {
                console.warn(msg);
                // We set to the identity matrix to minimize the damage when used in a WebGL shader.
                this.one();
            }
            return this;
        }
        else {
            this.scale(1 / det);
            return this;
        }
    };
    /**
     *
     */
    Matrix3.prototype.inv = function () {
        inv3x3(this.elements, this.elements);
        return this;
    };
    /**
     *
     */
    Matrix3.prototype.isOne = function () {
        var te = this.elements;
        var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
        var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
        var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
        return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1);
    };
    /**
     *
     */
    Matrix3.prototype.isZero = function () {
        var te = this.elements;
        var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
        var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
        var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
        return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0);
    };
    /**
     * @param rhs
     */
    Matrix3.prototype.mul = function (rhs) {
        return this.mul2(this, rhs);
    };
    /**
     * @param lhs
     */
    Matrix3.prototype.rmul = function (lhs) {
        mul3x3(lhs.elements, this.elements, this.elements);
        return this;
    };
    /**
     * @param a
     * @param b
     */
    Matrix3.prototype.mul2 = function (a, b) {
        mul3x3(a.elements, b.elements, this.elements);
        return this;
    };
    /**
     *
     */
    Matrix3.prototype.neg = function () {
        return this.scale(-1);
    };
    /**
     * <p>
     * Sets this 3x3 matrix to the matrix required to properly transform normal vectors
     * (pseudo or axial vectors) based upon the 4x4 matrix used to transform polar vectors.
     * </p>
     *
     * @param m
     */
    Matrix3.prototype.normalFromMatrix4 = function (m) {
        return this.invertUpperLeft(m).transpose();
    };
    /**
     *
     */
    Matrix3.prototype.one = function () {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    };
    /**
     * <p>
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * </p>
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     *
     * @param n
     */
    Matrix3.prototype.reflection = function (n) {
        var nx = mustBeNumber('n.x', n.x);
        var ny = mustBeNumber('n.y', n.y);
        var aa = -2 * nx * ny;
        var xx = 1 - 2 * nx * nx;
        var yy = 1 - 2 * ny * ny;
        this.set(xx, aa, 0, aa, yy, 0, 0, 0, 1);
        return this;
    };
    /**
     * @param i the zero-based index of the row.
     */
    Matrix3.prototype.row = function (i) {
        var te = this.elements;
        return [te[0 + i], te[3 + i], te[6 + i]];
    };
    /**
     * @param spinor
     */
    Matrix3.prototype.rotate = function (spinor) {
        // TODO: This is creating a temporary.
        return this.rmul(Matrix3.rotation(spinor));
    };
    /**
     * @param spinor
     */
    Matrix3.prototype.rotation = function (spinor) {
        var α = spinor.a;
        var β = spinor.b;
        var S = α * α - β * β;
        var A = 2 * α * β;
        this.set(S, A, 0, -A, S, 0, 0, 0, 1);
        return this;
    };
    /**
     * @param s
     */
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
    /**
     * <p>
     * Sets all elements of this matrix to the supplied values (provided in <em>row-major</em> order).
     * </p>
     * <p>
     * An advantage of this method is that the function call resembles the matrix written out.
     * </p>
     * <p>
     * The parameters are named according to the 1-based row and column.
     * </p>
     *
     * @param n11
     * @param n12
     * @param n13
     * @param n21
     * @param n22
     * @param n23
     * @param n31
     * @param n32
     * @param n33
     */
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
    /**
     * @param rhs
     */
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
    /**
     * @param fractionDigits
     */
    Matrix3.prototype.toExponential = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @param fractionDigits
     */
    Matrix3.prototype.toFixed = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @param precision
     */
    Matrix3.prototype.toPrecision = function (precision) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toPrecision(precision); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @param radix
     */
    Matrix3.prototype.toString = function (radix) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * <p>
     * Computes the homogeneous translation matrix for a 2D translation.
     * </p>
     *
     * @param d
     */
    Matrix3.prototype.translation = function (d) {
        var x = d.x;
        var y = d.y;
        return this.set(1, 0, x, 0, 1, y, 0, 0, 1);
    };
    /**
     *
     */
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
    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     */
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
    /**
     * @param n
     */
    Matrix3.reflection = function (n) {
        return Matrix3.zero.clone().reflection(n);
    };
    /**
     * @param spinor
     */
    Matrix3.rotation = function (spinor) {
        return Matrix3.zero.clone().rotation(spinor);
    };
    /**
     * @param d
     */
    Matrix3.translation = function (d) {
        return Matrix3.zero.clone().translation(d);
    };
    /**
     * The identity matrix for multiplication.
     * The matrix is locked (immutable), but may be cloned.
     */
    Matrix3.one = lock(new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])));
    /**
     * The identity matrix for addition.
     * The matrix is locked (immutable), but may be cloned.
     */
    Matrix3.zero = lock(new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])));
    return Matrix3;
}(AbstractMatrix));

var sqrt$2 = Math.sqrt;
var COORD_X$3 = 0;
var COORD_Y$3 = 1;
var COORD_Z$3 = 2;
var BASIS_LABELS$2 = ['e1', 'e2', 'e3'];
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates$2(m) {
    return [m.x, m.y, m.z];
}
/**
 *
 */
var Vector3 = (function () {
    /**
     * @param coords
     * @param modified
     */
    function Vector3(coords, modified) {
        if (coords === void 0) { coords = [0, 0, 0]; }
        if (modified === void 0) { modified = false; }
        this.coords_ = coords;
        this.modified_ = modified;
    }
    /**
     * @param a
     * @param b
     */
    Vector3.dot = function (a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };
    Object.defineProperty(Vector3.prototype, "length", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Vector3.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    Object.defineProperty(Vector3.prototype, "x", {
        /**
         * The coordinate corresponding to the e1 basis vector.
         */
        get: function () {
            return this.coords_[COORD_X$3];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new TargetLockedError('set x');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_X$3] !== value;
            coords[COORD_X$3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "y", {
        /**
         * The coordinate corresponding to the e2 basis vector.
         */
        get: function () {
            return this.coords_[COORD_Y$3];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new TargetLockedError('set y');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_Y$3] !== value;
            coords[COORD_Y$3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "z", {
        /**
         * The coordinate corresponding to the e3 basis vector.
         */
        get: function () {
            return this.coords_[COORD_Z$3];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new TargetLockedError('set z');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_Z$3] !== value;
            coords[COORD_Z$3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "maskG3", {
        /**
         *
         */
        get: function () {
            return this.isZero() ? 0x0 : 0x2;
        },
        set: function (unused) {
            throw new Error(readOnly('maskG3').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * <p>
     * <code>this ⟼ this + vector * α</code>
     * </p>
     *
     * @method add
     * @param vector {Vector3}
     * @param [α = 1] {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.add = function (vector, α) {
        if (α === void 0) { α = 1; }
        this.x += vector.x * α;
        this.y += vector.y * α;
        this.z += vector.z * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @param σ
     */
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
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeSimplexGeometry.
     *
     * @method applyMatrix4
     * @param σ The 4x4 matrix that pre-multiplies this column vector.
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.applyMatrix4 = function (σ) {
        var x = this.x, y = this.y, z = this.z;
        var e = σ.elements;
        this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
        this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
        this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];
        return this;
    };
    /**
     *
     */
    Vector3.prototype.approx = function (n) {
        approx(this.coords_, n);
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     *
     * @method reflect
     * @param n {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
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
    /**
     * @param R
     * @returns R * this * reverse(R)
     */
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
    /**
     * @method clone
     * @return {Vector3} <code>copy(this)</code>
     */
    Vector3.prototype.clone = function () {
        return new Vector3([this.x, this.y, this.z], this.modified_);
    };
    /**
     * this ⟼ copy(source)
     *
     * @returns copy(this)
     */
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
    /**
     * Copies the coordinate values into this <code>Vector3</code>.
     *
     * @param coordinates {number[]}
     * @returns
     */
    Vector3.prototype.copyCoordinates = function (coordinates) {
        // Copy using the setters so that the modified flag is updated.
        this.x = coordinates[COORD_X$3];
        this.y = coordinates[COORD_Y$3];
        this.z = coordinates[COORD_Z$3];
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this ✕ v</code>
     * </p>
     *
     * @method cross
     * @param v {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.cross = function (v) {
        return this.cross2(this, v);
    };
    /**
     * <code>this ⟼ a ✕ b</code>
     *
     * @param a
     * @param b
     * @returns a x b
     */
    Vector3.prototype.cross2 = function (a, b) {
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
    Vector3.prototype.distanceTo = function (point) {
        if (isDefined(point)) {
            return sqrt$2(this.quadranceTo(point));
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
    Vector3.prototype.quadranceTo = function (point) {
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
     * @return {Vector3} <code>this</code>
     * @chainable
     */
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
    /**
     * @method dot
     * @param v {VectorE3}
     * @return {number}
     */
    Vector3.prototype.dot = function (v) {
        return Vector3.dot(this, v);
    };
    /**
     * <p>
     * <code>this ⟼ I * B</code>
     * </p>
     *
     * Sets this vector to the dual of the bivector, B.
     * If changeSign is <code>true</code>, the direction of the resulting vector is reversed.
     *
     * @method dual
     * @param B {SpinorE3}
     * @param changeSign {boolean}
     * @return {Vector3}
     * @chainable
     */
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
    /**
     * @method equals
     * @param other {any}
     * @return {boolean}
     */
    Vector3.prototype.equals = function (other) {
        if (other instanceof Vector3) {
            return this.x === other.x && this.y === other.y && this.z === other.z;
        }
        else {
            return false;
        }
    };
    /**
     * @method isZero
     * @return {boolean}
     */
    Vector3.prototype.isZero = function () {
        return this.x === 0 && this.y === 0 && this.z === 0;
    };
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {number}
     */
    Vector3.prototype.magnitude = function () {
        return sqrt$2(this.squaredNorm());
    };
    /**
     * @method neg
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.neg = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     *
     * @method lerp
     * @param target {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.lerp = function (target, α) {
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
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.lerp2 = function (a, b, α) {
        this.copy(a).lerp(b, α);
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this / norm(this)</code>
     * </p>
     *
     * @method normalize
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.normalize = function () {
        var m = this.magnitude();
        if (m !== 0) {
            return this.divByScalar(m);
        }
        else {
            return this.zero();
        }
    };
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     *
     * @method scale
     * @param α {number}
     */
    Vector3.prototype.scale = function (α) {
        this.x *= α;
        this.y *= α;
        this.z *= α;
        return this;
    };
    /**
     * @method stress
     * @param σ {VectorE3}
     * @return Vector3
     */
    Vector3.prototype.stress = function (σ) {
        this.x *= σ.x;
        this.y *= σ.y;
        this.z *= σ.z;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this</code>, with components modified.
     * </p>
     *
     * @method set
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    Vector3.prototype.setXYZ = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    /**
     * Returns the (Euclidean) inner product of this vector with itself.
     *
     * @method squaredNorm
     * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
     */
    Vector3.prototype.squaredNorm = function () {
        // quad = scp(v, rev(v)) = scp(v, v)
        // TODO: This is correct but could be optimized.
        return dotVectorE3(this, this);
    };
    /**
     * <p>
     * <code>this ⟼ this - v</code>
     * </p>
     *
     * @method sub
     * @param v {VectorE3}
     * @param [α = 1] {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
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
    /**
     *
     */
    Vector3.prototype.toArray = function () {
        return coordinates$2(this);
    };
    /**
     * @param fractionDigits
     * @returns
     */
    Vector3.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return toStringCustom(coordinates$2(this), coordToString, BASIS_LABELS$2);
    };
    /**
     * @param fractionDigits
     * @returns
     */
    Vector3.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return toStringCustom(coordinates$2(this), coordToString, BASIS_LABELS$2);
    };
    /**
     * @param precision
     * @returns
     */
    Vector3.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return toStringCustom(coordinates$2(this), coordToString, BASIS_LABELS$2);
    };
    /**
     * @param radix
     * @returns
     */
    Vector3.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return toStringCustom(coordinates$2(this), coordToString, BASIS_LABELS$2);
    };
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     */
    Vector3.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    };
    Vector3.prototype.__add__ = function (rhs) {
        if (rhs instanceof Vector3) {
            return lock(this.clone().add(rhs, 1.0));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Vector3) {
            return lock(lhs.clone().add(this, 1.0));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__sub__ = function (rhs) {
        if (rhs instanceof Vector3) {
            return lock(this.clone().sub(rhs));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Vector3) {
            return lock(lhs.clone().sub(this, 1.0));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__mul__ = function (rhs) {
        if (isNumber(rhs)) {
            return lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__rmul__ = function (lhs) {
        if (typeof lhs === 'number') {
            return lock(this.clone().scale(lhs));
        }
        else if (lhs instanceof Matrix3) {
            return lock(this.clone().applyMatrix(lhs));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__div__ = function (rhs) {
        if (isNumber(rhs)) {
            return lock(this.clone().divByScalar(rhs));
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__rdiv__ = function (lhs) {
        return void 0;
    };
    Vector3.prototype.__pos__ = function () {
        return lock(Vector3.copy(this));
    };
    Vector3.prototype.__neg__ = function () {
        return lock(Vector3.copy(this).neg());
    };
    /**
     * @method copy
     * @param vector {VectorE3}
     * @return {Vector3}
     * @static
     * @chainable
     */
    Vector3.copy = function (vector) {
        return new Vector3([vector.x, vector.y, vector.z]);
    };
    /**
     * Constructs a vector which is the dual of the supplied bivector, B.
     * The convention used is dual(m) = I * m.
     * If a sign change is desired from this convention, set changeSign to true.
     */
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
    /**
     *
     */
    Vector3.isInstance = function (x) {
        return x instanceof Vector3;
    };
    /**
     * @method lerp
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>a + α * (b - a)</code>
     * @static
     * @chainable
     */
    Vector3.lerp = function (a, b, α) {
        return Vector3.copy(b).sub(a).scale(α).add(a);
    };
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     *
     * @method random
     * @return {Vector3}
     * @static
     * @chainable
     */
    Vector3.random = function () {
        var x = randomRange(-1, 1);
        var y = randomRange(-1, 1);
        var z = randomRange(-1, 1);
        return Vector3.vector(x, y, z).normalize();
    };
    /**
     * @method vector
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {Vector3}
     * @static
     * @chainable
     */
    Vector3.vector = function (x, y, z) {
        return new Vector3([x, y, z]);
    };
    /**
     * @method zero
     * @return {Vector3}
     * @static
     * @chainable
     */
    Vector3.zero = function () {
        return new Vector3([0, 0, 0]);
    };
    return Vector3;
}());
applyMixins(Vector3, [LockableMixin]);

// Quadratic Bezier
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

// Cubic Bezier Functions
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

function notImplemented(name) {
    mustBeString('name', name);
    var message = {
        get message() {
            return "'" + name + "' method is not yet implemented.";
        }
    };
    return message;
}

var sqrt$3 = Math.sqrt;
var COORD_X$4 = 0;
var COORD_Y$4 = 1;
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates$3(m) {
    return [m.x, m.y];
}
/**
 *
 */
var Vector2 = (function () {
    /**
     * @param coords The x coordinate and y coordinate.
     * @param modified
     */
    function Vector2(coords, modified) {
        if (coords === void 0) { coords = [0, 0]; }
        if (modified === void 0) { modified = false; }
        this.coords_ = coords;
        this.modified_ = modified;
    }
    Object.defineProperty(Vector2.prototype, "length", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Vector2.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    Object.defineProperty(Vector2.prototype, "x", {
        /**
         *
         */
        get: function () {
            return this.coords_[COORD_X$4];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new TargetLockedError('set x');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_X$4] !== value;
            coords[COORD_X$4] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        /**
         *
         */
        get: function () {
            return this.coords_[COORD_Y$4];
        },
        set: function (value) {
            if (this.isLocked()) {
                throw new TargetLockedError('set y');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_Y$4] !== value;
            coords[COORD_Y$4] = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param v
     * @param α
     * @returns
     */
    Vector2.prototype.add = function (v, α) {
        if (α === void 0) { α = 1; }
        this.x += v.x * α;
        this.y += v.y * α;
        return this;
    };
    /**
     * @param a
     * @param b
     * @returns
     */
    Vector2.prototype.add2 = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @method applyMatrix
     * @param σ {Matrix2}
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    Vector2.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var y = this.y;
        var e = σ.elements;
        this.x = e[0x0] * x + e[0x2] * y;
        this.y = e[0x1] * x + e[0x3] * y;
        return this;
    };
    /**
     * @method approx
     * @param n {number}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.approx = function (n) {
        approx(this.coords_, n);
        return this;
    };
    /**
     * @method clone
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.clone = function () {
        return new Vector2([this.x, this.y]);
    };
    /**
     * @method copy
     * @param v {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {VectorE2}
     * @param endPoint {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
        var x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        var y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        this.x = x;
        this.y = y;
        return this;
    };
    /**
     * @method distanceTo
     * @param point {VectorE2}
     * @return {number}
     */
    Vector2.prototype.distanceTo = function (position) {
        return sqrt$3(this.quadranceTo(position));
    };
    /**
     * @method sub
     * @param v {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    /*
    subScalar(s: number) {
        this.x -= s;
        this.y -= s;
        return this;
    }
    */
    /**
     * @method sub2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.sub2 = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    };
    /**
     * @method scale
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.scale = function (α) {
        this.x *= α;
        this.y *= α;
        return this;
    };
    /**
     * @method divByScalar
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
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
    /**
     * @method neg
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    Vector2.prototype.neg = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {number}
     */
    Vector2.prototype.magnitude = function () {
        return sqrt$3(this.squaredNorm());
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
    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {VectorE2}
     * @param endPoint {VectorE2}
     * @return {Vector2}
     */
    Vector2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
        var x = b2(t, this.x, controlPoint.x, endPoint.x);
        var y = b2(t, this.y, controlPoint.y, endPoint.y);
        this.x = x;
        this.y = y;
        return this;
    };
    Vector2.prototype.reflect = function (n) {
        throw new Error(notImplemented('reflect').message);
    };
    /**
     * @method rotate
     * @param spinor {SpinorE2}
     * @return {Vector2}
     * @chainable
     */
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
    /**
     * this ⟼ this + (v - this) * α
     *
     * @method lerp
     * @param v {VectorE2}
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    Vector2.prototype.lerp = function (v, α) {
        this.x += (v.x - this.x) * α;
        this.y += (v.y - this.y) * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     *
     * @method lerp2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    Vector2.prototype.lerp2 = function (a, b, α) {
        this.copy(a).lerp(b, α);
        return this;
    };
    Vector2.prototype.equals = function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    };
    /**
     * @method stress
     * @param σ {VectorE2}
     * @return {Vector2}
     */
    Vector2.prototype.stress = function (σ) {
        this.x *= σ.x;
        this.y *= σ.y;
        return this;
    };
    /**
     *
     */
    Vector2.prototype.toArray = function () {
        return coordinates$3(this);
    };
    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Vector2.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    };
    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Vector2.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    };
    /**
     * @method toPrecision
     * @param [precision] {number}
     * @return {string}
     */
    Vector2.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    };
    /**
     * @method toString
     * @param [radix] {number}
     * @return {string}
     */
    Vector2.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
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
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     */
    Vector2.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    Vector2.prototype.__neg__ = function () {
        return lock(this.clone().neg());
    };
    /**
     * @method copy
     *
     * @param vector {VectorE2}
     * @return {Vector2}
     * @static
     * @chainable
     */
    Vector2.copy = function (vector) {
        return Vector2.vector(vector.x, vector.y);
    };
    /**
     * @method lerp
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {Vector2} <code>a + α * (b - a)</code>
     * @static
     * @chainable
     */
    Vector2.lerp = function (a, b, α) {
        return Vector2.copy(b).sub(a).scale(α).add(a);
    };
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    Vector2.random = function () {
        var x = randomRange(-1, 1);
        var y = randomRange(-1, 1);
        return Vector2.vector(x, y).normalize();
    };
    Vector2.vector = function (x, y) {
        return new Vector2([x, y]);
    };
    Vector2.zero = Vector2.vector(0, 0);
    return Vector2;
}());
applyMixins(Vector2, [LockableMixin]);
Vector2.zero.lock();

var MODE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
/**
 * The index into the keys array is ROTATE=0, ZOOM=1, PAN=2
 */
var keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];
/**
 *
 */
var MouseControls = (function (_super) {
    __extends(MouseControls, _super);
    /**
     *
     * @param wnd
     */
    function MouseControls(wnd) {
        if (wnd === void 0) { wnd = window; }
        var _this = _super.call(this) || this;
        /**
         *
         * @default true
         */
        _this.enabled = true;
        /**
         *
         * @default false
         */
        _this.noRotate = false;
        /**
         *
         * @default false
         */
        _this.noZoom = false;
        /**
         *
         * @default false
         */
        _this.noPan = false;
        /**
         *
         * @default 0
         */
        _this.minDistance = 0;
        /**
         *
         * @default Infinity
         */
        _this.maxDistance = Infinity;
        /**
         * The mouse controls operate modally. You can only do one thing (rotate, zoom, or pan) at a time.
         */
        _this.mode = MODE.NONE;
        /**
         * Using the keyboard allows us to change modes, so we keep this so that we can revert.
         */
        _this.prevMode = MODE.NONE;
        /**
         *
         */
        _this.moveCurr = new Vector2();
        /**
         *
         */
        _this.movePrev = new Vector2();
        /**
         *
         */
        _this.zoomStart = new Vector2();
        /**
         *
         */
        _this.zoomEnd = new Vector2();
        /**
         *
         */
        _this.panStart = new Vector2();
        /**
         *
         */
        _this.panEnd = new Vector2();
        /**
         * Initialized by calling handleResize
         */
        _this.screenLoc = new Vector2();
        /**
         * Think of this vector as running from the top left corner of the screen.
         */
        _this.circleExt = new Vector2();
        /**
         * Think of this vector as running from the bottom left corner of the screen.
         */
        _this.screenExt = new Vector2();
        _this.mouseOnCircle = new Vector2();
        _this.mouseOnScreen = new Vector2();
        _this.setLoggingName('MouseControls');
        _this.wnd = mustBeObject('wnd', wnd);
        /**
         *
         */
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
        /**
         *
         */
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
        /**
         *
         */
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
        /**
         *
         */
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
        /**
         *
         */
        _this.keydown = function (event) {
            if (!_this.enabled) {
                return;
            }
            _this.wnd.removeEventListener('keydown', _this.keydown, false);
            _this.prevMode = _this.mode;
            if (_this.mode !== MODE.NONE) {
                // If we are already in a mode then keydown can't change it.
                // The key must go down before the mouse causes us to enter a mode.
                return;
            }
            else if (event.keyCode === keys[MODE.ROTATE] && !_this.noRotate) {
                // Pressing 'A'...
                _this.mode = MODE.ROTATE;
            }
            else if (event.keyCode === keys[MODE.ZOOM] && !_this.noRotate) {
                // Pressing 'S'...
                _this.mode = MODE.ZOOM;
            }
            else if (event.keyCode === keys[MODE.PAN] && !_this.noRotate) {
                // Pressing 'D'...
                _this.mode = MODE.PAN;
            }
        };
        /**
         *
         */
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
    /**
     * Simulates a movement of the mouse in coordinates -1 to +1 in both directions.
     *
     * @param x
     * @param y
     */
    MouseControls.prototype.move = function (x, y) {
        this.moveCurr.x = x;
        this.moveCurr.y = y;
    };
    /**
     * @param domElement
     */
    MouseControls.prototype.subscribe = function (domElement) {
        if (this.domElement) {
            this.unsubscribe();
        }
        this.domElement = domElement;
        this.disableContextMenu();
        this.domElement.addEventListener('mousedown', this.mousedown, false);
        this.domElement.addEventListener('mousewheel', this.mousewheel, false);
        this.domElement.addEventListener('DOMMouseScroll', this.mousewheel, false); // Firefox
        this.wnd.addEventListener('keydown', this.keydown, false);
        this.wnd.addEventListener('keyup', this.keydown, false);
        this.handleResize();
    };
    /**
     *
     */
    MouseControls.prototype.unsubscribe = function () {
        if (this.domElement) {
            this.enableContextMenu();
            this.domElement.removeEventListener('mousedown', this.mousedown, false);
            this.domElement.removeEventListener('mousewheel', this.mousewheel, false);
            this.domElement.removeEventListener('DOMMouseScroll', this.mousewheel, false); // Firefox
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
    /**
     *
     */
    MouseControls.prototype.reset = function () {
        this.mode = MODE.NONE;
    };
    /**
     * Computes coordinates in the range [-1,+1] in both e1 and e2 directions.
     * e1 goes to the RIGHT
     * e2 goes UP
     * Updates the mouseOnCircle property.
     *
     * @param mouse
     */
    MouseControls.prototype.updateMouseOnCircle = function (mouse) {
        this.mouseOnCircle.x = mouse.pageX;
        this.mouseOnCircle.y = -mouse.pageY;
        this.mouseOnCircle.sub(this.screenLoc).scale(2).sub(this.circleExt).divByScalar(this.circleExt.x);
    };
    /**
     * Computes coordinates in the range [0,1] in both e1 and e2 directions.
     * e1 goes to the RIGHT
     * e2 goes DOWN
     * Updates the mouseOnScreen property.
     *
     * @param mouse
     */
    MouseControls.prototype.updateMouseOnScreen = function (mouse) {
        this.mouseOnScreen.x = mouse.pageX;
        this.mouseOnScreen.y = -mouse.pageY;
        this.mouseOnScreen.sub(this.screenLoc);
        this.mouseOnScreen.x /= this.circleExt.x;
        this.mouseOnScreen.y /= this.circleExt.y;
    };
    /**
     * This should be called whenever the window is resized.
     */
    MouseControls.prototype.handleResize = function () {
        {
            var boundingRect = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
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
}(ShareableBase));

/**
 *
 */
var ViewControls = (function (_super) {
    __extends(ViewControls, _super);
    /**
     * @param view
     * @param wnd
     */
    function ViewControls(view, wnd) {
        if (wnd === void 0) { wnd = window; }
        var _this = _super.call(this, wnd) || this;
        /**
         *
         * @default 1
         */
        _this.rotateSpeed = 1;
        /**
         *
         * @default 1
         */
        _this.zoomSpeed = 1;
        /**
         *
         * @default 1
         */
        _this.panSpeed = 1;
        /**
         * The view.eye value when the view was acquired by this view controller.
         */
        _this.eye0 = Vector3.vector(0, 0, 1);
        /**
         * The view.look value when the view was acquired by this view controller.
         */
        _this.look0 = Vector3.zero();
        /**
         * The view.up value when the view was acquired by this view controller.
         */
        _this.up0 = Vector3.vector(0, 1, 0);
        /**
         *
         */
        _this.eyeMinusLook = new Vector3();
        /**
         *
         */
        _this.look = new Vector3();
        /**
         *
         */
        _this.up = new Vector3();
        _this.setLoggingName('ViewControls');
        _this.setView(view);
        return _this;
    }
    ViewControls.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     * @returns
     */
    ViewControls.prototype.hasView = function () {
        return !!this.view;
    };
    /**
     * This should be called inside the animation frame to update the camera location.
     * Notice that the movement of the mouse controls is decoupled from the effect.
     * We also want to avoid temporary object creation in this and called methods by recycling variables.
     */
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
    /**
     *
     */
    ViewControls.prototype.rotateCamera = function () {
        // Do nothing.
    };
    /**
     *
     */
    ViewControls.prototype.zoomCamera = function () {
        var factor = 1 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed;
        if (factor !== 1 && factor > 0) {
            this.eyeMinusLook.scale(factor);
            this.zoomStart.copy(this.zoomEnd);
        }
    };
    /**
     *
     */
    ViewControls.prototype.panCamera = function () {
        // Do nothing
    };
    /**
     *
     */
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
    /**
     * @param view
     */
    ViewControls.prototype.setView = function (view) {
        if (view) {
            this.view = view;
        }
        else {
            this.view = void 0;
        }
        this.synchronize();
    };
    /**
     *
     */
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
}(MouseControls));

// Scratch variables to aboid creating temporary objects.
var a = Geometric3.zero(false);
var b = Geometric3.zero(false);
var d = Geometric3.zero(false);
var B = Spinor3.one.clone();
var R = Spinor3.one.clone();
var X = Vector3.zero();
/**
 * <p>
 * <code>OrbitControls</code> move a camera over a sphere such that the camera up vector
 * remains aligned with the local north vector.
 * </p>
 * <p>
 * For rotations, the final camera position dictates a new camera local reference frame.
 * A rotor may be calculated that rotates the camera from its old reference frame to the
 * new reference frame. This rotor may also be interpolated for animations.
 * </p>
 */
var OrbitControls = (function (_super) {
    __extends(OrbitControls, _super);
    /**
     * @param view
     * @param wnd
     */
    function OrbitControls(view, wnd) {
        if (wnd === void 0) { wnd = window; }
        var _this = _super.call(this, view, wnd) || this;
        _this.setLoggingName('OrbitControls');
        return _this;
    }
    /**
     * @param levelUp
     */
    OrbitControls.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    OrbitControls.prototype.rotateCamera = function () {
        if (this.hasView()) {
            var Δs = this.moveCurr.distanceTo(this.movePrev);
            if (Δs > 0) {
                var ψ = Δs * 2 * Math.PI * this.rotateSpeed;
                // We'll need the attitude of the camera in order to convert our mouse motion and
                // vector from the origin to the screen. Reverse the target attitude to get the
                // rotor that we must apply to get the true rotation.
                X.copy(this.eyeMinusLook).add(this.look);
                getViewAttitude(X, this.look, this.up, R);
                a.zero();
                a.x = this.movePrev.x;
                a.y = this.movePrev.y;
                b.zero();
                b.x = this.moveCurr.x;
                b.y = this.moveCurr.y;
                d.copy(b).sub(a);
                d.rotate(R);
                X.normalize();
                // B = direction(X ^ d)
                B.wedge(X, d).normalize();
                // R is the rotor that moves the camera from its previous position.
                // Notice the plus sign, because the camera moves in the opposite orientation.
                R.copy(B).scale(+ψ / 2).exp();
                this.eyeMinusLook.rotate(R);
            }
        }
        this.movePrev.copy(this.moveCurr);
    };
    return OrbitControls;
}(ViewControls));

/**
 * <p>
 * Allows a camera to be manipulated using mouse controls.
 * </p>
 *
 *     // The trackball controls a view implementation such as a camera.
 *     const camera = new EIGHT.PerspectiveCamera()
 *
 *     // Create TrackballControls anytime.
 *     const controls = new EIGHT.TrackballControls(camera)
 *
 *     // Subscribe to mouse events, usually in the window.onload function.
 *     controls.subscribe(canvas)
 *
 *     // Update the camera position, usually in the animate function.
 *     controls.update()
 *
 *     // Stop listening to mouse events.
 *     controls.unsubscribe()
 *
 *     // Inform the controls they are no longer needed, usually in the window.onunload function.
 *     controls.release()
 *
 * You may decide to update directional lighting to synchronize with the camera.
 */
var TrackballControls = (function (_super) {
    __extends(TrackballControls, _super);
    function TrackballControls(view, wnd) {
        if (wnd === void 0) { wnd = window; }
        var _this = _super.call(this, view, wnd) || this;
        // Working storage for calculations that update the camera.
        _this.moveDirection = new Vector3();
        _this.eyeMinusLookDirection = new Vector3();
        _this.objectUpDirection = new Vector3();
        _this.objectSidewaysDirection = new Vector3();
        /**
         * The bivector for a rotation.
         */
        _this.B = Spinor3.zero.clone();
        _this.rotor = Spinor3.one.clone();
        _this.mouseChange = new Vector2();
        _this.pan = new Vector3();
        _this.objectUp = new Vector3();
        _this.setLoggingName('TrackballControls');
        return _this;
    }
    TrackballControls.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    TrackballControls.prototype.rotateCamera = function () {
        if (this.hasView()) {
            this.moveDirection.setXYZ(this.moveCurr.x - this.movePrev.x, this.moveCurr.y - this.movePrev.y, 0);
            var Δs = this.moveDirection.magnitude();
            if (Δs > 0) {
                var ψ = Δs * 2 * Math.PI * this.rotateSpeed;
                this.eyeMinusLookDirection.copy(this.eyeMinusLook).normalize();
                // Compute the unit vector pointing in the camera up direction.
                // We assume (and maintain) that the up direction is aligned with e2 in the mouse coordinate frame.
                this.objectUpDirection.copy(this.up).normalize();
                // Compute the unit vector pointing to the viewers right.
                this.objectSidewaysDirection.copy(this.objectUpDirection).cross(this.eyeMinusLookDirection);
                // Scale these unit vectors (ahem) according to the mouse movements.
                this.objectUpDirection.scale(this.moveCurr.y - this.movePrev.y);
                this.objectSidewaysDirection.scale(this.moveCurr.x - this.movePrev.x);
                // Compute the move direction from the components.
                this.moveDirection.copy(this.objectUpDirection).add(this.objectSidewaysDirection).normalize();
                // Compute the axis of rotation. This computation appears to be off by a sign (-1), but
                // that's because the camera will move while the scene stays still.
                this.B.wedge(this.moveDirection, this.eyeMinusLookDirection).normalize();
                // Compute the rotor for rotating the eye vector.
                this.rotor.rotorFromGeneratorAngle(this.B, ψ);
                // Move the viewing point relative to the target.
                this.eyeMinusLook.rotate(this.rotor);
                // Here's where we maintain the camera's up vector in the viewing plane.
                // It seems inconsistent that we affect the camera.up vector, but not the camera.position.
                // That's probably because we are going to combine pan and zoom.
                this.up.rotate(this.rotor);
                this.movePrev.copy(this.moveCurr);
            }
        }
    };
    /**
     *
     */
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
}(ViewControls));

/**
 * An object-oriented representation of an <code>attribute</code> in a GLSL shader program.
 */
var Attrib = (function () {
    /**
     *
     */
    function Attrib(contextManager, info) {
        /**
         *
         */
        this.suppressWarnings = true;
        this._name = info.name;
    }
    Object.defineProperty(Attrib.prototype, "index", {
        /**
         * Returns the cached index obtained by calling <code>getAttribLocation</code> on the
         * <code>WebGLRenderingContext</code>.
         */
        get: function () {
            return this._index;
        },
        set: function (unused) {
            throw new Error(readOnly('index').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Notifies this <code>Attrib</code> of a browser free WebGL context event.
     * This <code>Attrib</code> responds by setting its cached index and context to undefined.
     */
    Attrib.prototype.contextFree = function () {
        // Nothing to deallocate. Just reflect notification in state variables.
        // This is coincidentally the same as contextLost, but not appropriate for DRY.
        this._index = void 0;
        this._gl = void 0;
    };
    /**
     * Notifies this <code>Attrib</code> of a browser gain WebGL context event.
     * This <code>Attrib</code> responds by obtaining and caching attribute index.
     *
     * @param context
     * @param program
     */
    Attrib.prototype.contextGain = function (context, program) {
        this._index = context.getAttribLocation(program, this._name);
        this._gl = context;
    };
    /**
     * Notifies this <code>Attrib</code> of a browser lost WebGL context event.
     * This <code>Attrib</code> responds by setting its cached index and context to undefined.
     */
    Attrib.prototype.contextLost = function () {
        this._index = void 0;
        this._gl = void 0;
    };
    /**
     * Specifies the data formats and locations of vertex attributes in a vertex attributes array.
     * Calls the <code>vertexAttribPointer</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index and the supplied parameters.
     * Note that the <code>type</code> parameter is hard-code to <code>FLOAT</code>.
     *
     * @param size The number of components per attribute. Must be 1, 2, 3, or 4.
     * @param type The data type of each component in the array.
     * @param normalized Specifies whether fixed-point data values should be normalized (true), or are converted to fixed point vales (false) when accessed.
     * @param stride The distance in bytes between the beginning of consecutive vertex attributes.
     * @param offset The offset in bytes of the first component in the vertex attribute array. Must be a multiple of type.
     */
    Attrib.prototype.config = function (size, type, normalized, stride, offset) {
        if (normalized === void 0) { normalized = false; }
        if (stride === void 0) { stride = 0; }
        if (offset === void 0) { offset = 0; }
        // TODO: Notice that when this function is called, the cached index is used.
        // This suggests that we should used the cached indices to to look up attributes
        // when we are in the animation loop.
        if (this._gl) {
            this._gl.vertexAttribPointer(this._index, size, type, normalized, stride, offset);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn("vertexAttribPointer(index = " + this._index + ", size = " + size + ", type = " + type + ", normalized = " + normalized + ", stride = " + stride + ", offset = " + offset + ")");
            }
        }
    };
    /**
     * Calls the <code>enableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     */
    Attrib.prototype.enable = function () {
        if (this._gl) {
            this._gl.enableVertexAttribArray(this._index);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn("enableVertexAttribArray(index = " + this._index + ")");
            }
        }
    };
    /**
     * Calls the <code>disableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     */
    Attrib.prototype.disable = function () {
        if (this._gl) {
            this._gl.disableVertexAttribArray(this._index);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn("disableVertexAttribArray(index = " + this._index + ")");
            }
        }
    };
    /**
     * Returns the address of the specified vertex attribute.
     * Experimental.
     */
    Attrib.prototype.getOffset = function () {
        if (this._gl) {
            // The API docs don't permit the pname attribute to be anything other than VERTEX_ATTRIB_ARRAY_POINTER.
            return this._gl.getVertexAttribOffset(this._index, this._gl.VERTEX_ATTRIB_ARRAY_POINTER);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn("getVertexAttribOffset(index = " + this._index + ", VERTEX_ATTRIB_ARRAY_POINTER)");
            }
            return void 0;
        }
    };
    /**
     * Returns a non-normative string representation of the GLSL attribute.
     */
    Attrib.prototype.toString = function () {
        return ['attribute', this._name].join(' ');
    };
    return Attrib;
}());

/**
 * The enumerated modes of drawing WebGL primitives.
 *
 * https://www.khronos.org/registry/webgl/specs/1.0/
 */

(function (BeginMode) {
    BeginMode[BeginMode["POINTS"] = 0] = "POINTS";
    BeginMode[BeginMode["LINES"] = 1] = "LINES";
    BeginMode[BeginMode["LINE_LOOP"] = 2] = "LINE_LOOP";
    BeginMode[BeginMode["LINE_STRIP"] = 3] = "LINE_STRIP";
    BeginMode[BeginMode["TRIANGLES"] = 4] = "TRIANGLES";
    BeginMode[BeginMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    BeginMode[BeginMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(exports.BeginMode || (exports.BeginMode = {}));

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

/**
 * A capability that may be enabled or disabled for a WebGLRenderingContext.
 */

(function (Capability) {
    /**
     * Let polygons be culled.
     */
    Capability[Capability["CULL_FACE"] = 2884] = "CULL_FACE";
    /**
     * Blend computed fragment color values with color buffer values.
     */
    Capability[Capability["BLEND"] = 3042] = "BLEND";
    /**
     *
     */
    Capability[Capability["DITHER"] = 3024] = "DITHER";
    /**
     *
     */
    Capability[Capability["STENCIL_TEST"] = 2960] = "STENCIL_TEST";
    /**
     * Enable updates of the depth buffer.
     */
    Capability[Capability["DEPTH_TEST"] = 2929] = "DEPTH_TEST";
    /**
     * Abandon fragments outside a scissor rectangle.
     */
    Capability[Capability["SCISSOR_TEST"] = 3089] = "SCISSOR_TEST";
    /**
     * Add an offset to the depth values of a polygon's fragments.
     */
    Capability[Capability["POLYGON_OFFSET_FILL"] = 32823] = "POLYGON_OFFSET_FILL";
    /**
     *
     */
    Capability[Capability["SAMPLE_ALPHA_TO_COVERAGE"] = 32926] = "SAMPLE_ALPHA_TO_COVERAGE";
    /**
     *
     */
    Capability[Capability["SAMPLE_COVERAGE"] = 32928] = "SAMPLE_COVERAGE";
})(exports.Capability || (exports.Capability = {}));

(function (ClearBufferMask) {
    ClearBufferMask[ClearBufferMask["DEPTH_BUFFER_BIT"] = 256] = "DEPTH_BUFFER_BIT";
    ClearBufferMask[ClearBufferMask["STENCIL_BUFFER_BIT"] = 1024] = "STENCIL_BUFFER_BIT";
    ClearBufferMask[ClearBufferMask["COLOR_BUFFER_BIT"] = 16384] = "COLOR_BUFFER_BIT";
})(exports.ClearBufferMask || (exports.ClearBufferMask = {}));

function clamp(x, min, max) {
    mustBeNumber('x', x);
    mustBeNumber('min', min);
    mustBeNumber('max', max);
    return (x < min) ? min : ((x > max) ? max : x);
}

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
/**
 *
 */
var VectorN = (function () {
    /**
     *
     * @param data
     * @param modified
     * @param size
     */
    function VectorN(data, modified, size) {
        if (modified === void 0) { modified = false; }
        /**
         *
         */
        this.lock_ = lockable();
        this.modified_ = modified;
        if (isDefined(size)) {
            this.size_ = size;
            this.data_ = data;
            mustSatisfy('data.length', data.length === size, function () { return "" + size; });
        }
        else {
            this.size_ = void 0;
            this.data_ = data;
        }
    }
    VectorN.prototype.isLocked = function () {
        return this.lock_.isLocked();
    };
    VectorN.prototype.lock = function () {
        return this.lock_.lock();
    };
    VectorN.prototype.unlock = function (token) {
        return this.lock_.unlock(token);
    };
    Object.defineProperty(VectorN.prototype, "coords", {
        /**
         *
         */
        get: function () {
            return this.data_;
        },
        set: function (data) {
            if (this.isLocked()) {
                throw new TargetLockedError('coords');
            }
            this.data_ = data;
            this.modified_ = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VectorN.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VectorN.prototype, "length", {
        /**
         *
         */
        get: function () {
            return this.coords.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    VectorN.prototype.clone = function () {
        return new VectorN(this.data_, this.modified_, this.size_);
    };
    /**
     * @param index
     */
    VectorN.prototype.getComponent = function (index) {
        return this.coords[index];
    };
    /**
     *
     */
    VectorN.prototype.pop = function () {
        if (this.isLocked()) {
            throw new TargetLockedError('pop');
        }
        if (isUndefined(this.size_)) {
            return this.coords.pop();
        }
        else {
            throw new Error(verbotenPop());
        }
    };
    /**
     * @param value
     * @returns
     */
    VectorN.prototype.push = function (value) {
        if (this.isLocked()) {
            throw new TargetLockedError('push');
        }
        if (isUndefined(this.size_)) {
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
     * @param index
     * @param value
     */
    VectorN.prototype.setComponent = function (index, value) {
        if (this.isLocked()) {
            throw new TargetLockedError('setComponent');
        }
        var coords = this.coords;
        var previous = coords[index];
        if (value !== previous) {
            coords[index] = value;
            this.coords = coords;
            this.modified_ = true;
        }
    };
    /**
     * @param array
     * @param offset
     * @returns
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
     * @returns
     */
    VectorN.prototype.toLocaleString = function () {
        return this.coords.toLocaleString();
    };
    /**
     * @returns
     */
    VectorN.prototype.toString = function () {
        return this.coords.toString();
    };
    return VectorN;
}());

/**
 *
 */
var Coords = (function (_super) {
    __extends(Coords, _super);
    /**
     *
     */
    function Coords(coords, modified, size) {
        return _super.call(this, coords, modified, size) || this;
    }
    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate to zero.
     * @param n The exponent used to determine which components are set to zero.
     * @returns approx(this)
     */
    Coords.prototype.approx = function (n) {
        var max = 0;
        var coords = this.coords;
        var iLen = coords.length;
        for (var i = 0; i < iLen; i++) {
            max = Math.max(max, Math.abs(coords[i]));
        }
        var threshold = max * Math.pow(10, -n);
        for (var i = 0; i < iLen; i++) {
            if (Math.abs(coords[i]) < threshold) {
                coords[i] = 0;
            }
        }
    };
    /**
     *
     */
    Coords.prototype.equals = function (other) {
        if (other instanceof Coords) {
            var iLen = this.coords.length;
            for (var i = 0; i < iLen; i++) {
                if (this.coords[i] !== other.coords[i]) {
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
}(VectorN));

function isGE(value, limit) {
    return value >= limit;
}

function mustBeGE(name, value, limit, contextBuilder) {
    mustSatisfy(name, isGE(value, limit), function () { return "be greater than or equal to " + limit; }, contextBuilder);
    return value;
}

function isLE(value, limit) {
    return value <= limit;
}

function mustBeLE(name, value, limit, contextBuilder) {
    mustSatisfy(name, isLE(value, limit), function () { return "be less than or equal to " + limit; }, contextBuilder);
    return value;
}

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

var COORD_R = 0;
var COORD_G = 1;
var COORD_B = 2;
var rgb255 = function rgb255(red, green, blue) {
    var UBYTEMAX = 255;
    return new Color(red / UBYTEMAX, green / UBYTEMAX, blue / UBYTEMAX);
};
/**
 * A mutable type representing a color through its RGB components.
 */
var Color = (function (_super) {
    __extends(Color, _super);
    function Color(r, g, b) {
        var _this = _super.call(this, [r, g, b], false, 3) || this;
        mustBeGE('r', r, 0);
        mustBeLE('r', r, 1);
        mustBeGE('g', g, 0);
        mustBeLE('g', g, 1);
        mustBeGE('b', b, 0);
        mustBeLE('b', b, 1);
        return _this;
    }
    Object.defineProperty(Color.prototype, "r", {
        /**
         * The red coordinate (component) of this color.
         */
        get: function () {
            return this.coords[COORD_R];
        },
        set: function (r) {
            if (this.isLocked()) {
                throw new TargetLockedError('set r');
            }
            this.coords[COORD_R] = clamp(r, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "red", {
        get: function () {
            return this.coords[COORD_R];
        },
        set: function (red) {
            if (this.isLocked()) {
                throw new TargetLockedError('set red');
            }
            this.coords[COORD_R] = clamp(red, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "g", {
        /**
         * The green coordinate (component) of this color.
         */
        get: function () {
            return this.coords[COORD_G];
        },
        set: function (g) {
            if (this.isLocked()) {
                throw new TargetLockedError('set g');
            }
            this.coords[COORD_G] = clamp(g, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "green", {
        get: function () {
            return this.coords[COORD_G];
        },
        set: function (green) {
            if (this.isLocked()) {
                throw new TargetLockedError('set green');
            }
            this.coords[COORD_G] = clamp(green, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "b", {
        /**
         * The blue coordinate (component) of this color.
         */
        get: function () {
            return this.coords[COORD_B];
        },
        set: function (b) {
            if (this.isLocked()) {
                throw new TargetLockedError('set b');
            }
            this.coords[COORD_B] = clamp(b, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "blue", {
        get: function () {
            return this.coords[COORD_B];
        },
        set: function (blue) {
            if (this.isLocked()) {
                throw new TargetLockedError('set blue');
            }
            this.coords[COORD_B] = clamp(blue, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a color in which any rgb component whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate is zero.
     * @param n The exponent used to determine which components are set to zero.
     * @returns approx(this)
     */
    Color.prototype.approx = function (n) {
        if (this.isLocked()) {
            return lock(this.clone().approx(n));
        }
        else {
            _super.prototype.approx.call(this, n);
            return this;
        }
    };
    /**
     * @returns a mutable instance of this color.
     */
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b);
    };
    /**
     * Copies the specified color into this Color instance.
     * @param color The color to be copied.
     * @returns
     */
    Color.prototype.copy = function (color) {
        if (this.isLocked()) {
            throw new TargetLockedError('copy');
        }
        if (isDefined(color)) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
        }
        else {
            // We can choose what to do based upon a global setting?
            this.r = Math.random();
            this.g = Math.random();
            this.b = Math.random();
        }
        return this;
    };
    /**
     * Linearly interpolates from this color to the specified color.
     * @param target The color returned when α = 1.
     * @param α The parameter that determines the composition of the color.
     * @returns this + (target - this) * α
     */
    Color.prototype.lerp = function (target, α) {
        if (this.isLocked()) {
            return lock(this.clone().lerp(target, α));
        }
        else {
            this.r += (target.r - this.r) * α;
            this.g += (target.g - this.g) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    };
    Object.defineProperty(Color.prototype, "luminance", {
        /**
         * Computes the luminance of this color.
         */
        get: function () {
            return Color.luminance(this.r, this.g, this.b);
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Color.prototype.scale = function (α) {
        if (this.isLocked()) {
            return lock(this.clone().scale(α));
        }
        else {
            this.r = this.r * α;
            this.g = this.g * α;
            this.b = this.b * α;
            return this;
        }
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
    /**
     * @returns A string representation of this color.
     */
    Color.prototype.toString = function (radix) {
        return "Color(" + this.r.toString(radix) + ", " + this.g.toString(radix) + ", " + this.b.toString(radix) + ")";
    };
    /**
     * @param color The color to be copied.
     * @returns A mutable copy of the specified color.
     */
    Color.copy = function (color) {
        return new Color(color.r, color.g, color.b);
    };
    /**
     * @param r
     * @param g
     * @param b
     * @returns
     */
    Color.luminance = function (r, g, b) {
        mustBeNumber('r', r);
        mustBeNumber('g', g);
        mustBeNumber('b', b);
        var pow = Math.pow;
        var γ = 2.2;
        return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
    };
    /**
     * @param coords
     * @returns
     */
    /*
    public static fromCoords(coords: number[]): Color {
        mustBeArray('coords', coords);
        const r = mustBeNumber('r', coords[COORD_R]);
        const g = mustBeNumber('g', coords[COORD_G]);
        const b = mustBeNumber('b', coords[COORD_B]);
        return new Color(r, g, b);
    }
    */
    /**
     * Converts an angle, radius, height to a color on a color wheel.
     *
     * @param H
     * @param S
     * @param L
     * @returns
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
            // var x = Color.luminance(R, G, B)
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
     * Constructs a new mutable instance of Color from the rgb components.
     * The components are clamped to the range [0, 1].
     *
     * @param r The red component.
     * @param g The green component.
     * @param b The blue component.
     */
    Color.fromRGB = function (r, g, b) {
        mustBeNumber('r', r);
        mustBeNumber('g', g);
        mustBeNumber('b', b);
        return new Color(clamp(r, 0, 1), clamp(g, 0, 1), clamp(b, 0, 1));
    };
    Color.isInstance = function (x) {
        return x instanceof Color;
    };
    /**
     * @param a
     * @param b
     * @param α
     * @returns
     */
    Color.lerp = function (a, b, α) {
        return Color.copy(a).lerp(b, clamp(α, 0, 1));
    };
    Color.mustBe = function (name, color) {
        if (Color.isInstance(color)) {
            return color;
        }
        else {
            throw new Error(name + " must be a Color.");
        }
    };
    /**
     * Creates a color in which the red, green, and blue properties lie in the range [0, 1].
     */
    Color.random = function () {
        return Color.fromRGB(Math.random(), Math.random(), Math.random());
    };
    return Color;
}(Coords));
/**
 *
 */
Color.black = lock(new Color(0, 0, 0));
/**
 *
 */
Color.blue = lock(new Color(0, 0, 1));
/**
 *
 */
Color.green = lock(new Color(0, 1, 0));
/**
 *
 */
Color.cyan = lock(new Color(0, 1, 1));
/**
 *
 */
Color.red = lock(new Color(1, 0, 0));
/**
 *
 */
Color.magenta = lock(new Color(1, 0, 1));
/**
 *
 */
Color.yellow = lock(new Color(1, 1, 0));
/**
 *
 */
Color.white = lock(new Color(1, 1, 1));
/**
 *
 */
Color.gray = lock(new Color(0.5, 0.5, 0.5));
/**
 *
 */
Color.blueviolet = lock(rgb255(138, 43, 226));
/**
 *
 */
Color.chartreuse = lock(rgb255(127, 255, 0));
/**
 *
 */
Color.cobalt = lock(rgb255(61, 89, 171));
/**
 *
 */
Color.hotpink = lock(rgb255(255, 105, 180));
/**
 *
 */
Color.lime = lock(rgb255(0, 255, 0));
/**
 *
 */
Color.slateblue = lock(rgb255(113, 113, 198));
/**
 *
 */
Color.springgreen = lock(rgb255(0, 255, 127));
/**
 *
 */
Color.teal = lock(rgb255(56, 142, 142));

/**
 * DataType with values from WebGLRenderingContextBase.
 *
 * https://www.khronos.org/registry/webgl/specs/1.0/
 */

(function (DataType) {
    DataType[DataType["BYTE"] = 5120] = "BYTE";
    DataType[DataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    DataType[DataType["SHORT"] = 5122] = "SHORT";
    DataType[DataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    DataType[DataType["INT"] = 5124] = "INT";
    DataType[DataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    DataType[DataType["FLOAT"] = 5126] = "FLOAT";
})(exports.DataType || (exports.DataType = {}));

/**
 * exchange(thing to release, thing to addRef)
 */
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
        // Keep mine, it's the same as yours anyway.
        return mine;
    }
}

/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 */
var GraphicsProgramSymbols = (function () {
    function GraphicsProgramSymbols() {
    }
    /**
     * 'aColor'
     */
    GraphicsProgramSymbols.ATTRIBUTE_COLOR = 'aColor';
    /**
     * 'aGeometryIndex'
     */
    GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
    /**
     * 'aNormal'
     */
    GraphicsProgramSymbols.ATTRIBUTE_NORMAL = 'aNormal';
    /**
     * 'aOpacity'
     */
    GraphicsProgramSymbols.ATTRIBUTE_OPACITY = 'aOpacity';
    /**
     * 'aPosition'
     */
    GraphicsProgramSymbols.ATTRIBUTE_POSITION = 'aPosition';
    /**
     * 'aTangent'
     */
    GraphicsProgramSymbols.ATTRIBUTE_TANGENT = 'aTangent';
    /**
     * 'aCoords'
     */
    GraphicsProgramSymbols.ATTRIBUTE_COORDS = 'aCoords';
    /**
     * 'uAlpha'
     */
    GraphicsProgramSymbols.UNIFORM_ALPHA = 'uAlpha';
    /**
     * 'uAmbientLight'
     */
    GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
    /**
     * 'uColor'
     */
    GraphicsProgramSymbols.UNIFORM_COLOR = 'uColor';
    /**
     * 'uDirectionalLightColor'
     */
    GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
    /**
     * 'uDirectionalLightDirection'
     */
    GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
    /**
     * 'uImage'
     */
    GraphicsProgramSymbols.UNIFORM_IMAGE = 'uImage';
    /**
     * 'uOpacity'
     */
    GraphicsProgramSymbols.UNIFORM_OPACITY = 'uOpacity';
    /**
     * 'uPointLightColor'
     */
    GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
    /**
     * 'uPointLightPosition'
     */
    GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
    /**
     * 'uPointSize'
     */
    GraphicsProgramSymbols.UNIFORM_POINT_SIZE = 'uPointSize';
    /**
     * 'uProjection'
     */
    GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX = 'uProjection';
    /**
     * 'uReflectionOne'
     */
    GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';
    /**
     * 'uReflectionTwo'
     */
    GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';
    /**
     * 'uModel'
     */
    GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX = 'uModel';
    /**
     * 'uNormal'
     */
    GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX = 'uNormal';
    /**
     * 'uView'
     */
    GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX = 'uView';
    /**
     * 'vColor'
     */
    GraphicsProgramSymbols.VARYING_COLOR = 'vColor';
    /**
     * 'vCoords'
     */
    GraphicsProgramSymbols.VARYING_COORDS = 'vCoords';
    /**
     * 'vLight'
     */
    GraphicsProgramSymbols.VARYING_LIGHT = 'vLight';
    return GraphicsProgramSymbols;
}());

function isBoolean(x) {
    return (typeof x === 'boolean');
}

function beBoolean() {
    return "be `boolean`";
}
function mustBeBoolean(name, value, contextBuilder) {
    mustSatisfy(name, isBoolean(value), beBoolean, contextBuilder);
    return value;
}

function beObject$1() {
    return "be a non-null `object`";
}
function mustBeNonNullObject(name, value, contextBuilder) {
    mustSatisfy(name, isObject(value) && !isNull(value), beObject$1, contextBuilder);
    return value;
}

/**
 *
 */
var OpacityFacet = (function () {
    /**
     *
     */
    function OpacityFacet(opacity) {
        if (opacity === void 0) { opacity = 1; }
        mustBeNumber('opacity', opacity);
        mustBeGE('opacity', opacity, 0);
        mustBeLE('opacity', opacity, 1);
        this.opacity = opacity;
    }
    /**
     *
     */
    OpacityFacet.prototype.setUniforms = function (visitor) {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_OPACITY, this.opacity);
    };
    return OpacityFacet;
}());

/**
 *
 */
var PointSizeFacet = (function () {
    /**
     *
     */
    function PointSizeFacet(pointSize) {
        if (pointSize === void 0) { pointSize = 2; }
        this.pointSize = mustBeInteger('pointSize', pointSize);
    }
    /**
     *
     */
    PointSizeFacet.prototype.setUniforms = function (visitor) {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, this.pointSize);
    };
    return PointSizeFacet;
}());

/**
 *
 */
var ShareableContextConsumer = (function (_super) {
    __extends(ShareableContextConsumer, _super);
    /**
     *
     */
    function ShareableContextConsumer(contextManager) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        /**
         * Keep track of subscription state
         */
        _this.isSubscribed = false;
        // The buck stops here so we must assert the existence of the contextManager. 
        mustBeNonNullObject('contextManager', contextManager);
        _this.setLoggingName('ShareableContextConsumer');
        contextManager.addRef();
        _this.subscribe(false);
        return _this;
    }
    /**
     *
     */
    ShareableContextConsumer.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ShareableContextConsumer');
        this.contextManager.addRef();
        this.subscribe(false);
    };
    /**
     *
     */
    ShareableContextConsumer.prototype.destructor = function (levelUp) {
        this.unsubscribe(false);
        this.contextManager.release();
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     * Instructs the consumer to subscribe to context events.
     *
     * This method is idempotent; calling it more than once with the same <code>ContextManager</code> does not change the state.
     */
    ShareableContextConsumer.prototype.subscribe = function (synchUp) {
        if (!this.isSubscribed) {
            this.contextManager.addContextListener(this);
            this.isSubscribed = true;
            if (synchUp) {
                this.synchUp();
            }
        }
    };
    /**
     * Instructs the consumer to unsubscribe from context events.
     *
     * This method is idempotent; calling it more than once does not change the state.
     */
    ShareableContextConsumer.prototype.unsubscribe = function (cleanUp) {
        if (this.isSubscribed) {
            this.contextManager.removeContextListener(this);
            this.isSubscribed = false;
            if (cleanUp) {
                this.cleanUp();
            }
        }
    };
    /**
     *
     */
    ShareableContextConsumer.prototype.synchUp = function () {
        this.contextManager.synchronize(this);
    };
    /**
     *
     */
    ShareableContextConsumer.prototype.cleanUp = function () {
        if (this.gl) {
            if (this.gl.isContextLost()) {
                this.contextLost();
            }
            else {
                this.contextFree();
            }
        }
        else {
            // There is no contextProvider so resources should already be clean.
        }
    };
    ShareableContextConsumer.prototype.contextFree = function () {
        // Do nothing.
    };
    ShareableContextConsumer.prototype.contextGain = function () {
        // Do nothing.
    };
    ShareableContextConsumer.prototype.contextLost = function () {
        // Do nothing.
    };
    Object.defineProperty(ShareableContextConsumer.prototype, "gl", {
        /**
         * Provides access to the underlying WebGL context.
         */
        get: function () {
            return this.contextManager.gl;
        },
        enumerable: true,
        configurable: true
    });
    return ShareableContextConsumer;
}(ShareableBase));

/**
 *
 */
var StringShareableMap = (function (_super) {
    __extends(StringShareableMap, _super);
    /**
     * A map of string to V extends Shareable.
     */
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
    /**
     * Determines whether the key exists in the map with a defined value.
     */
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
}(ShareableBase));

var OPACITY_FACET_NAME = 'opacity';
var POINTSIZE_FACET_NAME = 'pointSize';
var DRAWABLE_LOGGING_NAME = 'Drawable';
/**
 * This class may be used as either a base class or standalone.
 */
var Drawable = (function (_super) {
    __extends(Drawable, _super);
    /**
     *
     */
    function Drawable(geometry, material, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, mustBeNonNullObject('contextManager', contextManager)) || this;
        _this._visible = true;
        _this._transparent = false;
        _this.facetMap = new StringShareableMap();
        _this.setLoggingName(DRAWABLE_LOGGING_NAME);
        if (isObject(geometry)) {
            // The assignment takes care of the addRef.
            _this.geometry = geometry;
        }
        if (isObject(material)) {
            // The assignment takes care of the addRef.
            _this.material = material;
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Drawable.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName(DRAWABLE_LOGGING_NAME);
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    Drawable.prototype.destructor = function (levelUp) {
        this.facetMap.release();
        if (levelUp === 0) {
            this.cleanUp();
        }
        this._geometry = exchange(this._geometry, void 0);
        this._material = exchange(this._material, void 0);
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
            if (isNumber(newOpacity)) {
                var facet = this.getFacet(OPACITY_FACET_NAME);
                if (facet) {
                    facet.opacity = newOpacity;
                }
                else {
                    this.setFacet(OPACITY_FACET_NAME, new OpacityFacet(newOpacity));
                }
            }
            else if (isUndefined(newOpacity) || isNull(newOpacity)) {
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
            if (isNumber(newPointSize)) {
                var facet = this.getFacet(POINTSIZE_FACET_NAME);
                if (facet) {
                    facet.pointSize = newPointSize;
                }
                else {
                    this.setFacet(POINTSIZE_FACET_NAME, new PointSizeFacet(newPointSize));
                }
            }
            else if (isUndefined(newPointSize) || isNull(newPointSize)) {
                this.removeFacet(POINTSIZE_FACET_NAME);
            }
            else {
                throw new TypeError("pointSize must be a number, undefined, or null.");
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * A convenience method for calling geometry.bind(material).
     */
    Drawable.prototype.bind = function () {
        this._geometry.bind(this._material);
        return this;
    };
    /**
     * Sets the Material uniforms from the Facets of this composite object.
     */
    Drawable.prototype.setUniforms = function () {
        var material = this._material;
        var keys = this.facetMap.keys;
        var keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var facet = this.facetMap.getWeakRef(key);
            facet.setUniforms(material);
        }
        return this;
    };
    /**
     *
     */
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
    /**
     * @param name The name of the Facet.
     */
    Drawable.prototype.getFacet = function (name) {
        return this.facetMap.get(name);
    };
    /**
     * A convenience method for performing all of the methods required for rendering.
     * The following methods are called in order.
     * use()
     * bind()
     * setAmbients(ambients)
     * setUniforms()
     * draw()
     * unbind()
     * In particle simulations it may be useful to call the underlying methods directly.
     */
    Drawable.prototype.render = function (ambients) {
        if (this._visible) {
            this.use().bind().setAmbients(ambients).setUniforms().draw().unbind();
        }
        return this;
    };
    /**
     * Updates the Material uniforms from the ambient Facets argument.
     */
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
    /**
     * @param name The name of the Facet.
     * @param facet The Facet.
     */
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
        /**
         * Provides a reference counted reference to the geometry property.
         */
        get: function () {
            return exchange(void 0, this._geometry);
        },
        set: function (geometry) {
            this._geometry = exchange(this._geometry, geometry);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "material", {
        /**
         * Provides a reference counted reference to the material property.
         */
        get: function () {
            return exchange(void 0, this._material);
        },
        set: function (material) {
            this._material = exchange(this._material, material);
            synchFacets(this._material, this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "visible", {
        /**
         * @default true
         */
        get: function () {
            return this._visible;
        },
        set: function (visible) {
            var _this = this;
            mustBeBoolean('visible', visible, function () { return _this.getLoggingName(); });
            this._visible = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "transparent", {
        /**
         * @default false
         */
        get: function () {
            return this._transparent;
        },
        set: function (transparent) {
            var _this = this;
            mustBeBoolean('transparent', transparent, function () { return _this.getLoggingName(); });
            this._transparent = transparent;
        },
        enumerable: true,
        configurable: true
    });
    return Drawable;
}(ShareableContextConsumer));
/**
 * Helper function to synchronize and optimize facets.
 */
function synchFacets(material, drawable) {
    if (material) {
        // Ensure that the opacity property is initialized if the material has a corresponding uniform.
        if (material.hasUniform(GraphicsProgramSymbols.UNIFORM_OPACITY)) {
            if (!isNumber(drawable.opacity)) {
                drawable.opacity = 1.0;
            }
        }
        else {
            drawable.removeFacet(OPACITY_FACET_NAME);
        }
        // Ensure that the pointSize property is initialized if the material has a corresponding uniform.
        if (material.hasUniform(GraphicsProgramSymbols.UNIFORM_POINT_SIZE)) {
            if (!isNumber(drawable.pointSize)) {
                drawable.pointSize = 2;
            }
        }
        else {
            drawable.removeFacet(POINTSIZE_FACET_NAME);
        }
    }
}

/**
 * An enumeration specifying the depth comparison function, which sets the conditions
 * under which the pixel will be drawn. The default value is LESS.
 */

(function (DepthFunction) {
    /**
     * never pass
     */
    DepthFunction[DepthFunction["NEVER"] = 512] = "NEVER";
    /**
     * pass if the incoming value is less than the depth buffer value
     */
    DepthFunction[DepthFunction["LESS"] = 513] = "LESS";
    /**
     * pass if the incoming value equals the the depth buffer value
     */
    DepthFunction[DepthFunction["EQUAL"] = 514] = "EQUAL";
    /**
     * pass if the incoming value is less than or equal to the depth buffer value
     */
    DepthFunction[DepthFunction["LEQUAL"] = 515] = "LEQUAL";
    /**
     * pass if the incoming value is greater than the depth buffer value
     */
    DepthFunction[DepthFunction["GREATER"] = 516] = "GREATER";
    /**
     * pass if the incoming value is not equal to the depth buffer value
     */
    DepthFunction[DepthFunction["NOTEQUAL"] = 517] = "NOTEQUAL";
    /**
     * pass if the incoming value is greater than or equal to the depth buffer value
     */
    DepthFunction[DepthFunction["GEQUAL"] = 518] = "GEQUAL";
    /**
     * always pass
     */
    DepthFunction[DepthFunction["ALWAYS"] = 519] = "ALWAYS";
})(exports.DepthFunction || (exports.DepthFunction = {}));

function notSupported(name) {
    mustBeString('name', name);
    var message = {
        get message() {
            return "Method `" + name + "` is not supported.";
        }
    };
    return message;
}

/**
 * GeometryBase
 */
var GeometryBase = (function (_super) {
    __extends(GeometryBase, _super);
    /**
     *
     */
    function GeometryBase(contextManager, levelUp) {
        var _this = _super.call(this, contextManager) || this;
        _this.setLoggingName("GeometryBase");
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GeometryBase.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName("GeometryBase");
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    GeometryBase.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    GeometryBase.prototype.bind = function (material) {
        mustBeDefined('material', material);
        throw new Error(notSupported("bind(material: Material)").message);
    };
    /**
     *
     */
    GeometryBase.prototype.unbind = function (material) {
        mustBeDefined('material', material);
        throw new Error(notSupported("unbind(material: Material)").message);
    };
    /**
     *
     */
    GeometryBase.prototype.draw = function () {
        throw new Error(notSupported('draw()').message);
    };
    return GeometryBase;
}(ShareableContextConsumer));

/**
 * WebGLBuffer usage.
 */

(function (Usage) {
    /**
     * Contents of the buffer are likely to not be used often.
     * Contents are written to the buffer, but not read.
     */
    Usage[Usage["STREAM_DRAW"] = 35040] = "STREAM_DRAW";
    /**
     * Contents of the buffer are likely to be used often and not change often.
     * Contents are written to the buffer, but not read.
     */
    Usage[Usage["STATIC_DRAW"] = 35044] = "STATIC_DRAW";
    /**
     * Contents of the buffer are likely to be used often and change often.
     * Contents are written to the buffer, but not read.
     */
    Usage[Usage["DYNAMIC_DRAW"] = 35048] = "DYNAMIC_DRAW";
})(exports.Usage || (exports.Usage = {}));

/**
 * Computes the number of elements represented by the attribute values.
 */
function computeCount(attribs, aNames) {
    var aNamesLen = aNames.length;
    // TODO: We currently return after computing the count for the first aName, but we should
    // perform a consistency check.
    for (var a = 0; a < aNamesLen; a++) {
        var aName = aNames[a];
        var attrib = attribs[aName];
        var vLength = attrib.values.length;
        var size = mustBeInteger('size', attrib.size);
        return vLength / size;
    }
    return 0;
}

/**
 * Computes the interleaved attribute values array.
 */
function computeAttributes(attributes, aNames) {
    var aNamesLen = aNames.length;
    var values = [];
    var iLen = computeCount(attributes, aNames);
    for (var i = 0; i < iLen; i++) {
        // Looping over the attribute name as the inner loop creates the interleaving.
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

/**
 * @deprecated
 */
function computePointers(attributes, aNames) {
    var aNamesLen = aNames.length;
    var pointers = [];
    var offset = 0;
    for (var a = 0; a < aNamesLen; a++) {
        var aName = aNames[a];
        var attrib = attributes[aName];
        // FIXME: It's a lot more complicated choosing these parameters than for the simple FLOAT case.
        pointers.push({ name: aName, size: attrib.size, type: attrib.type, normalized: true, offset: offset });
        offset += attrib.size * 4; // We're assuming that the data type is gl.FLOAT
    }
    return pointers;
}

/**
 * Computes the stride for a given collection of attributes.
 */
function computeStride(attributes, aNames) {
    var aNamesLen = aNames.length;
    var stride = 0;
    for (var a = 0; a < aNamesLen; a++) {
        var aName = aNames[a];
        var attrib = attributes[aName];
        stride += attrib.size * 4; // We're assuming that the data type is gl.FLOAT
    }
    return stride;
}

/**
 * Converts the Primitive to the interleaved VertexArrays format.
 * This conversion is performed for eddiciency; it allows multiple attributes to be
 * combined into a single array of numbers so that it may be stored in a single vertex buffer.
 *
 * @param primitive The Primitive to be converted.
 * @param order The ordering of the attributes.
 */
function vertexArraysFromPrimitive(primitive, order) {
    if (primitive) {
        var keys = order ? order : Object.keys(primitive.attributes);
        var that = {
            mode: primitive.mode,
            indices: primitive.indices,
            attributes: computeAttributes(primitive.attributes, keys),
            stride: computeStride(primitive.attributes, keys),
            pointers: computePointers(primitive.attributes, keys)
        };
        return that;
    }
    else {
        return void 0;
    }
}

var BufferObjects;
(function (BufferObjects) {
    BufferObjects[BufferObjects["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
    BufferObjects[BufferObjects["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
    BufferObjects[BufferObjects["ARRAY_BUFFER_BINDING"] = 34964] = "ARRAY_BUFFER_BINDING";
    BufferObjects[BufferObjects["ELEMENT_ARRAY_BUFFER_BINDING"] = 34965] = "ELEMENT_ARRAY_BUFFER_BINDING";
})(BufferObjects || (BufferObjects = {}));

function beUndefined() {
    return "be 'undefined'";
}
function mustBeUndefined(name, value, contextBuilder) {
    mustSatisfy(name, isUndefined(value), beUndefined, contextBuilder);
    return value;
}

/**
 * A wrapper around a WebGLBuffer with binding to ARRAY_BUFFER.
 */
var VertexBuffer = (function (_super) {
    __extends(VertexBuffer, _super);
    /**
     *
     */
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
    /**
     *
     */
    VertexBuffer.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('VertexBuffer');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    VertexBuffer.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        mustBeUndefined(this.getLoggingName(), this.webGLBuffer);
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    VertexBuffer.prototype.upload = function () {
        var gl = this.gl;
        if (gl) {
            if (this.webGLBuffer) {
                if (this.data) {
                    gl.bufferData(BufferObjects.ARRAY_BUFFER, this.data, this.usage);
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
            // It's a duplicate, ignore.
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
            // It's a duplicate, ignore the call.
        }
    };
    VertexBuffer.prototype.contextLost = function () {
        this.webGLBuffer = void 0;
        _super.prototype.contextLost.call(this);
    };
    VertexBuffer.prototype.bind = function () {
        var gl = this.gl;
        if (gl) {
            gl.bindBuffer(BufferObjects.ARRAY_BUFFER, this.webGLBuffer);
        }
    };
    VertexBuffer.prototype.unbind = function () {
        var gl = this.gl;
        if (gl) {
            gl.bindBuffer(BufferObjects.ARRAY_BUFFER, null);
        }
    };
    return VertexBuffer;
}(ShareableContextConsumer));

/**
 * A concrete Geometry for supporting drawArrays.
 */
var GeometryArrays = (function (_super) {
    __extends(GeometryArrays, _super);
    /**
     *
     */
    function GeometryArrays(contextManager, primitive, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, levelUp + 1) || this;
        /**
         * The <code>first</code> parameter in the drawArrays call.
         * This is currently hard-code to zero because this class only supportes buffering one primitive.
         */
        _this.first = 0;
        mustBeNonNullObject('primitive', primitive);
        _this.setLoggingName('GeometryArrays');
        // FIXME: order as an option
        var vertexArrays = vertexArraysFromPrimitive(primitive, options.order);
        _this.mode = vertexArrays.mode;
        _this.vbo = new VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), exports.Usage.STATIC_DRAW);
        // FIXME: Hacky
        _this.count = vertexArrays.attributes.length / (vertexArrays.stride / 4);
        // FIXME: stride is not quite appropriate here because we don't have BYTES.
        _this.stride = vertexArrays.stride;
        _this.pointers = vertexArrays.pointers;
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GeometryArrays.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('GeometryArrays');
        this.vbo.addRef();
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    GeometryArrays.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.vbo.release();
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    GeometryArrays.prototype.bind = function (material) {
        this.vbo.bind();
        var pointers = this.pointers;
        if (pointers) {
            var iLength = pointers.length;
            for (var i = 0; i < iLength; i++) {
                var pointer = pointers[i];
                var attrib = material.getAttrib(pointer.name);
                if (attrib) {
                    attrib.config(pointer.size, pointer.type, pointer.normalized, this.stride, pointer.offset);
                    attrib.enable();
                }
            }
        }
        return this;
    };
    GeometryArrays.prototype.draw = function () {
        if (this.gl) {
            this.gl.drawArrays(this.mode, this.first, this.count);
        }
        return this;
    };
    GeometryArrays.prototype.unbind = function (material) {
        var pointers = this.pointers;
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
}(GeometryBase));

/**
 * A wrapper around a WebGLBuffer with binding to ELEMENT_ARRAY_BUFFER.
 */
var IndexBuffer = (function (_super) {
    __extends(IndexBuffer, _super);
    /**
     *
     */
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
    /**
     *
     */
    IndexBuffer.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('IndexBuffer');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    IndexBuffer.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        mustBeUndefined(this.getLoggingName(), this.webGLBuffer);
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    IndexBuffer.prototype.upload = function () {
        var gl = this.gl;
        if (gl) {
            if (this.webGLBuffer) {
                if (this.data) {
                    gl.bufferData(BufferObjects.ELEMENT_ARRAY_BUFFER, this.data, this.usage);
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
            // It's a duplicate, ignore.
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
            // It's a duplicate, ignore the call.
        }
    };
    IndexBuffer.prototype.contextLost = function () {
        this.webGLBuffer = void 0;
        _super.prototype.contextLost.call(this);
    };
    /**
     * Binds the underlying WebGLBuffer to the ELEMENT_ARRAY_BUFFER target.
     */
    IndexBuffer.prototype.bind = function () {
        var gl = this.gl;
        if (gl) {
            gl.bindBuffer(BufferObjects.ELEMENT_ARRAY_BUFFER, this.webGLBuffer);
        }
    };
    IndexBuffer.prototype.unbind = function () {
        var gl = this.gl;
        if (gl) {
            gl.bindBuffer(BufferObjects.ELEMENT_ARRAY_BUFFER, null);
        }
    };
    return IndexBuffer;
}(ShareableContextConsumer));

/**
 * A Geometry that supports interleaved vertex buffers.
 */
var GeometryElements = (function (_super) {
    __extends(GeometryElements, _super);
    /**
     *
     */
    function GeometryElements(contextManager, primitive, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, levelUp + 1) || this;
        /**
         * Hard-coded to zero right now.
         * This suggests that the index buffer could be used for several gl.drawElements(...)
         */
        _this.offset = 0;
        _this.setLoggingName('GeometryElements');
        mustBeNonNullObject('primitive', primitive);
        var vertexArrays = vertexArraysFromPrimitive(primitive, options.order);
        _this.mode = vertexArrays.mode;
        _this.count = vertexArrays.indices.length;
        _this.ibo = new IndexBuffer(contextManager, new Uint16Array(vertexArrays.indices), exports.Usage.STATIC_DRAW);
        _this.stride = vertexArrays.stride;
        if (!isNull(vertexArrays.pointers) && !isUndefined(vertexArrays.pointers)) {
            if (isArray(vertexArrays.pointers)) {
                _this.pointers = vertexArrays.pointers;
            }
            else {
                mustBeArray('data.pointers', vertexArrays.pointers);
            }
        }
        else {
            _this.pointers = [];
        }
        _this.vbo = new VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), exports.Usage.STATIC_DRAW);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GeometryElements.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('GeometryElements');
        this.ibo.addRef();
        this.vbo.addRef();
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    GeometryElements.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.ibo.release();
        this.vbo.release();
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
        var pointers = this.pointers;
        if (pointers) {
            var iLength = pointers.length;
            for (var i = 0; i < iLength; i++) {
                var pointer = pointers[i];
                var attrib = material.getAttrib(pointer.name);
                if (attrib) {
                    attrib.config(pointer.size, pointer.type, pointer.normalized, this.stride, pointer.offset);
                    attrib.enable();
                }
            }
        }
        this.ibo.bind();
        return this;
    };
    GeometryElements.prototype.unbind = function (material) {
        this.ibo.unbind();
        var pointers = this.pointers;
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
                this.gl.drawElements(this.mode, this.count, exports.DataType.UNSIGNED_SHORT, this.offset);
            }
        }
        return this;
    };
    return GeometryElements;
}(GeometryBase));

(function (PixelFormat) {
    PixelFormat[PixelFormat["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
    PixelFormat[PixelFormat["ALPHA"] = 6406] = "ALPHA";
    PixelFormat[PixelFormat["RGB"] = 6407] = "RGB";
    PixelFormat[PixelFormat["RGBA"] = 6408] = "RGBA";
    PixelFormat[PixelFormat["LUMINANCE"] = 6409] = "LUMINANCE";
    PixelFormat[PixelFormat["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
})(exports.PixelFormat || (exports.PixelFormat = {}));

/**
 *
 */

(function (TextureParameterName) {
    TextureParameterName[TextureParameterName["TEXTURE_MAG_FILTER"] = 10240] = "TEXTURE_MAG_FILTER";
    TextureParameterName[TextureParameterName["TEXTURE_MIN_FILTER"] = 10241] = "TEXTURE_MIN_FILTER";
    TextureParameterName[TextureParameterName["TEXTURE_WRAP_S"] = 10242] = "TEXTURE_WRAP_S";
    TextureParameterName[TextureParameterName["TEXTURE_WRAP_T"] = 10243] = "TEXTURE_WRAP_T";
})(exports.TextureParameterName || (exports.TextureParameterName = {}));

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
        mustBeUndefined(this.getLoggingName(), this._texture);
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
    /**
     *
     */
    Texture.prototype.bind = function () {
        if (this.gl) {
            this.gl.bindTexture(this._target, this._texture);
        }
        else {
            console.warn(this.getLoggingName() + ".bind() missing WebGL rendering context.");
        }
    };
    /**
     *
     */
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
                this.gl.texParameteri(this._target, exports.TextureParameterName.TEXTURE_MIN_FILTER, filter);
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
                this.gl.texParameteri(this._target, exports.TextureParameterName.TEXTURE_MAG_FILTER, filter);
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
                this.gl.texParameteri(this._target, exports.TextureParameterName.TEXTURE_WRAP_S, mode);
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
                this.gl.texParameteri(this._target, exports.TextureParameterName.TEXTURE_WRAP_T, mode);
                this.unbind();
            }
            else {
                console.warn(this.getLoggingName() + ".wrapT missing WebGL rendering context.");
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Texture.prototype.upload = function () {
        throw new Error(this.getLoggingName() + ".upload() must be implemented.");
    };
    return Texture;
}(ShareableContextConsumer));

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
            this.gl.texImage2D(this._target, 0, exports.PixelFormat.RGBA, exports.PixelFormat.RGBA, exports.DataType.UNSIGNED_BYTE, this.image);
        }
        else {
            console.warn(this.getLoggingName() + ".upload() missing WebGL rendering context.");
        }
    };
    return ImageTexture;
}(Texture));

/**
 *
 */
function vectorCopy(vector) {
    return vec(vector.x, vector.y, vector.z);
}
function vectorFromCoords(x, y, z) {
    return vec(x, y, z);
}
function vec(x, y, z) {
    var dot = function dot(rhs) {
        return x * rhs.x + y * rhs.y + z * rhs.z;
    };
    var magnitude = function () {
        return Math.sqrt(x * x + y * y + z * z);
    };
    var projectionOnto = function projectionOnto(b) {
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var scp = x * bx + y * by + z * bz;
        var quad = bx * bx + by * by + bz * bz;
        var k = scp / quad;
        return vec(k * bx, k * by, k * bz);
    };
    var rejectionFrom = function rejectionFrom(b) {
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var scp = x * bx + y * by + z * bz;
        var quad = bx * bx + by * by + bz * bz;
        var k = scp / quad;
        return vec(x - k * bx, y - k * by, z - k * bz);
    };
    var rotate = function rotate(R) {
        var a = R.xy;
        var b = R.yz;
        var c = R.zx;
        var α = R.a;
        var ix = α * x - c * z + a * y;
        var iy = α * y - a * x + b * z;
        var iz = α * z - b * y + c * x;
        var iα = b * x + c * y + a * z;
        return vec(ix * α + iα * b + iy * a - iz * c, iy * α + iα * c + iz * b - ix * a, iz * α + iα * a + ix * c - iy * b);
    };
    var scale = function scale(α) {
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
            var yz = wedgeYZ(x, y, z, rhs.x, rhs.y, rhs.z);
            var zx = wedgeZX(x, y, z, rhs.x, rhs.y, rhs.z);
            var xy = wedgeXY(x, y, z, rhs.x, rhs.y, rhs.z);
            return vec(yz, zx, xy);
        },
        direction: function () {
            var magnitude = Math.sqrt(x * x + y * y + z * z);
            if (magnitude !== 0) {
                return vec(x / magnitude, y / magnitude, z / magnitude);
            }
            else {
                // direction is ambiguous (undefined) for the zero vector.
                return void 0;
            }
        },
        dot: dot,
        magnitude: magnitude,
        projectionOnto: projectionOnto,
        rejectionFrom: rejectionFrom,
        rotate: rotate,
        scale: scale,
        sub: function (rhs) {
            return vec(x - rhs.x, y - rhs.y, z - rhs.z);
        },
        __add__: function (rhs) {
            return vec(x + rhs.x, y + rhs.y, z + rhs.z);
        },
        __radd__: function (lhs) {
            return vec(lhs.x + x, lhs.y + y, lhs.z + z);
        },
        __sub__: function (rhs) {
            return vec(x - rhs.x, y - rhs.y, z - rhs.z);
        },
        __rsub__: function (lhs) {
            return vec(lhs.x - x, lhs.y - y, lhs.z - z);
        },
        __mul__: function (rhs) {
            mustBeNumber('rhs', rhs);
            return vec(x * rhs, y * rhs, z * rhs);
        },
        __rmul__: function (lhs) {
            mustBeNumber('lhs', lhs);
            return vec(lhs * x, lhs * y, lhs * z);
        },
        __pos__: function () {
            return that;
        },
        __neg__: function () {
            return vec(-x, -y, -z);
        },
        toString: function () {
            return "[" + x + ", " + y + ", " + z + "]";
        }
    };
    return Object.freeze(that);
}

var canonicalAxis = vec(0, 1, 0);
var canonicalMeridian = vec(0, 0, 1);
/**
 * tilt takes precedence over axis and meridian.
 */

/**
 *
 */
var ColorFacet = (function () {
    /**
     *
     */
    function ColorFacet(uColorName) {
        if (uColorName === void 0) { uColorName = GraphicsProgramSymbols.UNIFORM_COLOR; }
        this.uColorName = uColorName;
        /**
         *
         */
        this.color = Color.fromRGB(1, 1, 1);
    }
    Object.defineProperty(ColorFacet.prototype, "r", {
        /**
         * The red component of the color.
         */
        get: function () {
            return this.color.r;
        },
        set: function (r) {
            mustBeNumber('r', r);
            this.color.r = r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorFacet.prototype, "g", {
        /**
         * The green component of the color.
         */
        get: function () {
            return this.color.g;
        },
        set: function (g) {
            mustBeNumber('g', g);
            this.color.g = g;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorFacet.prototype, "b", {
        /**
         * The blue component of the color.
         */
        get: function () {
            return this.color.b;
        },
        set: function (b) {
            mustBeNumber('b', b);
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
    /**
     *
     */
    ColorFacet.prototype.setUniforms = function (visitor) {
        var name = this.uColorName;
        if (name) {
            var color = this.color;
            visitor.uniform3f(name, color.r, color.g, color.b);
        }
    };
    /**
     *
     */
    ColorFacet.PROP_RGB = 'rgb';
    /**
     *
     */
    ColorFacet.PROP_RED = 'r';
    /**
     *
     */
    ColorFacet.PROP_GREEN = 'g';
    /**
     *
     */
    ColorFacet.PROP_BLUE = 'b';
    return ColorFacet;
}());

/**
 * Computes the determinant of a 4x4 (square) matrix where the elements are assumed to be in column-major order.
 */
function det4x4(m) {
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

/**
 * Computes the inverse of a 4x4 (square) matrix where the elements are assumed to be in column-major order.
 */
function inv4x4(src, dest) {
    var n11 = src[0x0], n12 = src[0x4], n13 = src[0x8], n14 = src[0xC];
    var n21 = src[0x1], n22 = src[0x5], n23 = src[0x9], n24 = src[0xD];
    var n31 = src[0x2], n32 = src[0x6], n33 = src[0xA], n34 = src[0xE];
    var n41 = src[0x3], n42 = src[0x7], n43 = src[0xB], n44 = src[0xF];
    // Row 1
    var o11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    var o12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    var o13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    var o14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    // Row 2
    var o21 = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    var o22 = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    var o23 = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    var o24 = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    // Row 3
    var o31 = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    var o32 = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    var o33 = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    var o34 = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    // Row 4
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

function frustumMatrix(left, right, bottom, top, near, far, matrix) {
    mustBeNumber('left', left);
    mustBeNumber('right', right);
    mustBeNumber('bottom', bottom);
    mustBeNumber('top', top);
    mustBeNumber('near', near);
    mustBeNumber('far', far);
    var m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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

/**
 * Computes the matrix for the viewing transformation.
 * @param fov The angle subtended at the apex of the viewing pyramid.
 * @param aspect The ratio of width / height of the viewing pyramid.
 * @param near The distance from the camera eye point to the near plane.
 * @param far The distance from the camera eye point to the far plane.
 */
function perspectiveArray(fov, aspect, near, far, matrix) {
    // We can leverage the frustum function, although technically the
    // symmetry in this perspective transformation should reduce the amount
    // of computation required.
    mustBeNumber('fov', fov);
    mustBeNumber('aspect', aspect);
    mustBeNumber('near', near);
    mustBeNumber('far', far);
    var ymax = near * Math.tan(fov * 0.5); // top
    var ymin = -ymax; // bottom
    var xmin = ymin * aspect; // left
    var xmax = ymax * aspect; // right
    return frustumMatrix(xmin, xmax, ymin, ymax, near, far, matrix);
}

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
/**
 * A 4x4 (square) matrix of numbers.
 *
 * An adapter for a `Float32Array`.
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
     *
     */
    function Matrix4(elements) {
        return _super.call(this, elements, 4) || this;
    }
    /**
     * Constructs a 4x4 matrix that performs the scaling specified by the vector.
     */
    Matrix4.scaling = function (scale) {
        return Matrix4.one.clone().scaling(scale);
    };
    /**
     * Constructs a 4x4 matrix that performs the translation specified by the vector.
     */
    Matrix4.translation = function (vector) {
        return Matrix4.one.clone().translation(vector);
    };
    /**
     * Constructs a 4x4 matrix that performs the rotation specified by the spinor.
     */
    Matrix4.rotation = function (spinor) {
        return Matrix4.one.clone().rotation(spinor);
    };
    /**
     * Sets this matrix to `this + rhs`.
     */
    Matrix4.prototype.add = function (rhs) {
        if (this.isLocked()) {
            throw new TargetLockedError('add');
        }
        return this.add2(this, rhs);
    };
    /**
     * Sets this matrix to `a + b`.
     */
    Matrix4.prototype.add2 = function (a, b) {
        add4x4(a.elements, b.elements, this.elements);
        return this;
    };
    /**
     * Returns a copy of this Matrix4 instance.
     */
    Matrix4.prototype.clone = function () {
        return new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).copy(this);
    };
    /**
     * Sets this matrix to perform the specified scaling, rotation, and translation.
     */
    Matrix4.prototype.compose = function (S, R, T) {
        this.scaling(S);
        this.rotate(R);
        this.translate(T);
        return this;
    };
    /**
     * Copies the specified matrix into this matrix.
     */
    Matrix4.prototype.copy = function (m) {
        this.elements.set(m.elements);
        return this;
    };
    /**
     * Computes the determinant.
     */
    Matrix4.prototype.det = function () {
        return det4x4(this.elements);
    };
    /**
     * Sets the elements of this matrix to that of its inverse.
     */
    Matrix4.prototype.inv = function () {
        inv4x4(this.elements, this.elements);
        return this;
    };
    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     */
    Matrix4.prototype.one = function () {
        return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    /**
     * Multiplies all elements of this matrix by the specified value.
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
     * Sets this matrix to its transpose.
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
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
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
     * Sets this matrix to the viewing transformation.
     * This is the matrix that may be applied to points in the truncated viewing pyramid.
     * The resulting points then lie in the image space (cube).
     */
    Matrix4.prototype.perspective = function (fov, aspect, near, far) {
        perspectiveArray(fov, aspect, near, far, this.elements);
        return this;
    };
    /**
     * @param axis
     * @param angle
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
     *
     */
    Matrix4.prototype.mul = function (rhs) {
        return this.mul2(this, rhs);
    };
    /**
     *
     */
    Matrix4.prototype.mul2 = function (a, b) {
        mul4x4(a.elements, b.elements, this.elements);
        return this;
    };
    /**
     *
     */
    Matrix4.prototype.rmul = function (lhs) {
        return this.mul2(lhs, this);
    };
    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     *
     * this ⟼ reflection(n)
     *
     * @param n
     */
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
    /**
     * this ⟼ rotation(spinor) * this
     *
     * @param spinor
     */
    Matrix4.prototype.rotate = function (spinor) {
        return this.rmul(Matrix4.rotation(spinor));
    };
    /**
     * Sets this matrix to be equivalent to the spinor.
     *
     * this ⟼ rotation(spinor)
     *
     * @param attitude  The spinor from which the rotation will be computed.
     */
    Matrix4.prototype.rotation = function (spinor) {
        // The correspondence between quaternions and spinors is
        // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
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
    /**
     * @param i the zero-based index of the row.
     */
    Matrix4.prototype.row = function (i) {
        var te = this.elements;
        return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
    };
    /**
     *
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
     *
     */
    Matrix4.prototype.scaling = function (scale) {
        return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
    };
    /**
     *
     */
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
    /**
     *
     */
    Matrix4.prototype.toExponential = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     *
     */
    Matrix4.prototype.toFixed = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     *
     */
    Matrix4.prototype.toPrecision = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toPrecision(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     *
     */
    Matrix4.prototype.toString = function (radix) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * this ⟼ translation(spinor) * this
     */
    Matrix4.prototype.translate = function (d) {
        return this.rmul(Matrix4.translation(d));
    };
    /**
     * Sets this matrix to be equivalent to the displacement vector argument.
     */
    Matrix4.prototype.translation = function (displacement) {
        var x = displacement.x;
        var y = displacement.y;
        var z = displacement.z;
        return this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    };
    /**
     * Sets this matrix to the identity element for addition, 0.
     */
    Matrix4.prototype.zero = function () {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    };
    Matrix4.prototype.__mul__ = function (rhs) {
        if (rhs instanceof Matrix4) {
            return lock(Matrix4.one.clone().mul2(this, rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    };
    Matrix4.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Matrix4) {
            return lock(Matrix4.one.clone().mul2(lhs, this));
        }
        else if (typeof lhs === 'number') {
            return lock(this.clone().scale(lhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * The identity matrix for multiplication, 1.
     * The matrix is locked (immutable), but may be cloned.
     */
    Matrix4.one = lock(new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])));
    /**
     * The identity matrix for addition, 0.
     * The matrix is locked (immutable), but may be cloned.
     */
    Matrix4.zero = lock(new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])));
    return Matrix4;
}(AbstractMatrix));

/**
 *
 */
var ModelE3 = (function () {
    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE3 implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelE3 at the origin and with unity attitude.
     * </p>
     */
    function ModelE3() {
        this._position = Geometric3.zero(false);
        this._attitude = Geometric3.one(false);
        this._position.modified = true;
        this._attitude.modified = true;
    }
    Object.defineProperty(ModelE3.prototype, "R", {
        /**
         * <p>
         * The <em>attitude</em>, a rotor.
         * </p>
         */
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
        /**
         * <p>
         * The <em>position</em>, a vector.
         * </p>
         */
        get: function () {
            return this._position;
        },
        set: function (position) {
            this._position.copyVector(position);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The name of the property that designates the attitude.
     */
    ModelE3.PROP_ATTITUDE = 'R';
    /**
     * The name of the property that designates the position.
     */
    ModelE3.PROP_POSITION = 'X';
    return ModelE3;
}());

/**
 *
 */
var ModelFacet = (function (_super) {
    __extends(ModelFacet, _super);
    /**
     * <p>
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     * </p>
     * <p>
     * In Physics, the composite object may represent a rigid body.
     * In Computer Graphics, the composite object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacet implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelFacet at the origin and with unity attitude.
     * </p>
     */
    function ModelFacet() {
        var _this = _super.call(this) || this;
        /**
         * @default diag(1, 1, 1, 1)
         */
        _this.matS = Matrix4.one.clone();
        _this._matM = Matrix4.one.clone();
        _this._matN = Matrix3.one.clone();
        _this.matR = Matrix4.one.clone();
        _this.matT = Matrix4.one.clone();
        _this.X.modified = true;
        _this.R.modified = true;
        _this.matS.modified = true;
        return _this;
    }
    Object.defineProperty(ModelFacet.prototype, "stress", {
        /**
         * Stress (tensor)
         */
        get: function () {
            return this.matS;
        },
        set: function (stress) {
            mustBeObject('stress', stress);
            this.matS.copy(stress);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelFacet.prototype, "matrix", {
        /**
         *
         * @readOnly
         */
        get: function () {
            return this._matM;
        },
        set: function (unused) {
            throw new Error(readOnly('matrix').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ModelFacet.prototype.setUniforms = function (visitor) {
        this.updateMatrices();
        visitor.matrix4fv(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, this._matM.elements, false);
        visitor.matrix3fv(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, this._matN.elements, false);
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
                // If the scaling matrix determinant is zero, so too will be the matrix M.
                // If M is singular then it will not be possible to compute the matrix for transforming normals.
                // In any case, the geometry not be visible.
                // So we just set the normals matrix to the identity.
                this._matN.one();
            }
        }
    };
    return ModelFacet;
}(ModelE3));

/**
 * This function computes the reference axis of an object.
 */
function referenceAxis(options, fallback) {
    if (options.tilt) {
        var axis = Geometric3.fromVector(canonicalAxis).rotate(options.tilt);
        return vec(axis.x, axis.y, axis.z);
    }
    else if (options.axis) {
        var axis = options.axis;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (typeof options.height === 'object') {
        console.warn("height is deprecated. Please use axis instead.");
        var axis = options.height;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.meridian) {
        var B = Geometric3.dualOfVector(canonicalAxis);
        var tilt = Geometric3.rotorFromVectorToVector(canonicalMeridian, options.meridian, B);
        var axis = Geometric3.fromVector(canonicalAxis).rotate(tilt);
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.cutLine) {
        console.warn("cutLine is deprecated. Please use meridian instead.");
        var B = Geometric3.dualOfVector(canonicalAxis);
        var tilt = Geometric3.rotorFromVectorToVector(canonicalMeridian, options.cutLine, B);
        var axis = Geometric3.fromVector(canonicalAxis).rotate(tilt);
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else {
        return vec(fallback.x, fallback.y, fallback.z);
    }
}

/**
 * This function computes the reference meridian of an object.
 */
function referenceMeridian(options, fallback) {
    if (options.tilt) {
        var meridian = Geometric3.fromVector(canonicalMeridian).rotate(options.tilt);
        return vec(meridian.x, meridian.y, meridian.z);
    }
    else if (options.meridian) {
        var meridian = options.meridian;
        return vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (options.cutLine) {
        console.warn("cutLine is deprecated. Please use meridian instead.");
        var meridian = options.cutLine;
        return vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (options.axis) {
        var B = Geometric3.dualOfVector(canonicalMeridian);
        var tilt = Geometric3.rotorFromVectorToVector(canonicalAxis, options.axis, B);
        var meridian = Geometric3.fromVector(canonicalMeridian).rotate(tilt);
        return vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (typeof options.height === 'object') {
        console.warn("height is deprecated. Please use axis instead.");
        var axis = options.height;
        var B = Geometric3.dualOfVector(canonicalMeridian);
        var tilt = Geometric3.rotorFromVectorToVector(canonicalAxis, axis, B);
        var meridian = Geometric3.fromVector(canonicalMeridian).rotate(tilt);
        return vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else {
        return vec(fallback.x, fallback.y, fallback.z);
    }
}

/**
 *
 */
var TextureUnit;
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
})(TextureUnit || (TextureUnit = {}));

var TextureFacet = (function (_super) {
    __extends(TextureFacet, _super);
    function TextureFacet() {
        var _this = _super.call(this) || this;
        _this.unit = TextureUnit.TEXTURE0;
        _this.setLoggingName('TextureFacet');
        return _this;
    }
    TextureFacet.prototype.destructor = function (levelUp) {
        this._texture = exchange(this._texture, void 0);
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(TextureFacet.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        set: function (value) {
            this._texture = exchange(this._texture, value);
        },
        enumerable: true,
        configurable: true
    });
    TextureFacet.prototype.setUniforms = function (visitor) {
        if (this._texture) {
            visitor.activeTexture(this.unit);
            this._texture.bind();
            visitor.uniform1i(GraphicsProgramSymbols.UNIFORM_IMAGE, 0);
            // this._texture.unbind();
        }
    };
    return TextureFacet;
}(ShareableBase));

var COLOR_FACET_NAME = 'color';
var TEXTURE_FACET_NAME = 'image';
var MODEL_FACET_NAME = 'model';
/**
 * The standard pairing of a Geometry and a Material.
 */
var Mesh = (function (_super) {
    __extends(Mesh, _super);
    /**
     * Initializes this Mesh with a ColorFacet ('color'), a TextureFacet ('image'), and a ModelFacet ('model').
     *
     * @param geometry An optional Geometry, which may be supplied later.
     * @param material An optional Material, which may be supplied later.
     * @param contextManager
     * @param options
     * @param levelUp The zero-based level of this instance in an inheritance hierarchy.
     */
    function Mesh(geometry, material, contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, geometry, material, contextManager, levelUp + 1) || this;
        /**
         * Scratch variable for intermediate calculation value.
         * This can probably be raised to a module level constant.
         */
        _this.canonicalScale = Matrix4.one.clone();
        _this.setLoggingName('Mesh');
        _this.setFacet(COLOR_FACET_NAME, new ColorFacet());
        var textureFacet = new TextureFacet();
        _this.setFacet(TEXTURE_FACET_NAME, textureFacet);
        textureFacet.release();
        _this.setFacet(MODEL_FACET_NAME, new ModelFacet());
        _this.referenceAxis = referenceAxis(options, canonicalAxis).direction();
        _this.referenceMeridian = referenceMeridian(options, canonicalMeridian).rejectionFrom(_this.referenceAxis).direction();
        var tilt = Geometric3.rotorFromFrameToFrame([canonicalAxis, canonicalMeridian, canonicalAxis.cross(canonicalMeridian)], [_this.referenceAxis, _this.referenceMeridian, _this.referenceAxis.cross(_this.referenceMeridian)]);
        if (tilt && !Spinor3.isOne(tilt)) {
            _this.Kidentity = false;
            _this.K = Matrix4.one.clone();
            _this.K.rotation(tilt);
            _this.Kinv = Matrix4.one.clone();
            _this.Kinv.copy(_this.K).inv();
        }
        else {
            _this.Kidentity = true;
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Mesh.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Mesh.prototype, "attitude", {
        /**
         * Attitude (spinor). This is an alias for the R property.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.R;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (spinor) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.R.copySpinor(spinor);
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "R", {
        /**
         * Attitude (spinor). This is an alias for the attitude property.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.R;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (spinor) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.R.copySpinor(spinor);
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "color", {
        /**
         * Color
         */
        get: function () {
            var facet = this.getFacet(COLOR_FACET_NAME);
            if (facet) {
                return facet.color;
            }
            else {
                throw new Error(notSupported(COLOR_FACET_NAME).message);
            }
        },
        set: function (color) {
            var facet = this.getFacet(COLOR_FACET_NAME);
            if (facet) {
                facet.color.copy(color);
            }
            else {
                throw new Error(notSupported(COLOR_FACET_NAME).message);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "texture", {
        /**
         * Texture (image).
         */
        get: function () {
            var facet = this.getFacet(TEXTURE_FACET_NAME);
            if (facet) {
                var texture = facet.texture;
                facet.release();
                return texture;
            }
            else {
                throw new Error(notSupported(TEXTURE_FACET_NAME).message);
            }
        },
        set: function (value) {
            var facet = this.getFacet(TEXTURE_FACET_NAME);
            if (facet) {
                facet.texture = value;
                facet.release();
            }
            else {
                throw new Error(notSupported(TEXTURE_FACET_NAME).message);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "X", {
        /**
         * Position (vector). This is an alias for the position property.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.X;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (vector) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.X.copyVector(vector);
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "position", {
        /**
         * Position (vector). This is an alias for the X property.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.X;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (vector) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.X.copyVector(vector);
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "stress", {
        /**
         * Stress (tensor)
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.stress;
            }
            else {
                throw new Error(notSupported('stress').message);
            }
        },
        set: function (stress) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.stress.copy(stress);
            }
            else {
                throw new Error(notSupported('stress').message);
            }
        },
        enumerable: true,
        configurable: true
    });
    Mesh.prototype.getScale = function (i, j) {
        if (this.Kidentity) {
            var sMatrix = this.stress;
            return sMatrix.getElement(i, j);
        }
        else {
            var sMatrix = this.stress;
            var cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
            return cMatrix.getElement(i, j);
        }
    };
    Mesh.prototype.getScaleX = function () {
        return this.getScale(0, 0);
    };
    Mesh.prototype.getScaleY = function () {
        return this.getScale(1, 1);
    };
    Mesh.prototype.getScaleZ = function () {
        return this.getScale(2, 2);
    };
    /**
     * Implementations of setPrincipalScale are expected to call this method.
     */
    Mesh.prototype.setScale = function (x, y, z) {
        if (this.Kidentity) {
            var sMatrix = this.stress;
            var oldX = sMatrix.getElement(0, 0);
            var oldY = sMatrix.getElement(1, 1);
            var oldZ = sMatrix.getElement(2, 2);
            if (x !== oldX) {
                sMatrix.setElement(0, 0, x);
            }
            if (y !== oldY) {
                sMatrix.setElement(1, 1, y);
            }
            if (z !== oldZ) {
                sMatrix.setElement(2, 2, z);
            }
        }
        else {
            var sMatrix = this.stress;
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
            }
        }
    };
    /**
     * Implementation of the axis (get) property.
     * Derived classes may overide to perform scaling.
     */
    Mesh.prototype.getAxis = function () {
        return this.referenceAxis.rotate(this.attitude);
    };
    /**
     * Implementation of the axis (set) property.
     * Derived classes may overide to perform scaling.
     */
    Mesh.prototype.setAxis = function (axis) {
        var squaredNorm = quadVectorE3(axis);
        if (squaredNorm > 0) {
            this.attitude.rotorFromDirections(this.referenceAxis, axis);
        }
        else {
            // The axis direction is undefined.
            this.attitude.one();
        }
    };
    Object.defineProperty(Mesh.prototype, "axis", {
        /**
         * The current axis (unit vector) of the mesh.
         */
        get: function () {
            return this.getAxis();
        },
        set: function (axis) {
            this.setAxis(axis);
        },
        enumerable: true,
        configurable: true
    });
    Mesh.prototype.getMeridian = function () {
        return this.referenceMeridian.rotate(this.attitude);
    };
    Object.defineProperty(Mesh.prototype, "meridian", {
        /**
         * The current meridian (unit vector) of the mesh.
         */
        get: function () {
            return this.getMeridian();
        },
        set: function (value) {
            var meridian = vectorCopy(value).rejectionFrom(this.axis).direction();
            var B = Geometric3.dualOfVector(this.axis);
            var R = Geometric3.rotorFromVectorToVector(this.meridian, meridian, B);
            this.attitude.mul2(R, this.attitude);
        },
        enumerable: true,
        configurable: true
    });
    return Mesh;
}(Drawable));

(function (PixelType) {
    PixelType[PixelType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    PixelType[PixelType["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
    PixelType[PixelType["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
    PixelType[PixelType["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
})(exports.PixelType || (exports.PixelType = {}));

/**
 * Essentially constructs the ShareableArray without incrementing the
 * reference count of the elements, and without creating zombies.
 */
function transferOwnership(data) {
    if (data) {
        var result = new ShareableArray(data);
        // The result has now taken ownership of the elements, so we can release.
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
/**
 * <p>
 * Collection class for maintaining an array of types derived from Shareable.
 * </p>
 * <p>
 * Provides a safer way to maintain reference counts than a native array.
 * </p>
 */
var ShareableArray = (function (_super) {
    __extends(ShareableArray, _super);
    /**
     *
     */
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
    /**
     *
     */
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
    /**
     *
     */
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
    /**
     *
     */
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
    /**
     * Gets the element at the specified index, incrementing the reference count.
     */
    ShareableArray.prototype.get = function (index) {
        var element = this.getWeakRef(index);
        if (element) {
            if (element.addRef) {
                element.addRef();
            }
        }
        return element;
    };
    /**
     * Gets the element at the specified index, without incrementing the reference count.
     */
    ShareableArray.prototype.getWeakRef = function (index) {
        return this._elements[index];
    };
    /**
     *
     */
    ShareableArray.prototype.indexOf = function (searchElement, fromIndex) {
        return this._elements.indexOf(searchElement, fromIndex);
    };
    Object.defineProperty(ShareableArray.prototype, "length", {
        /**
         *
         */
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
            throw new Error(readOnly('length').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The slice() method returns a shallow copy of a portion of an array into a new array object.
     *
     * It does not remove elements from the original array.
     */
    ShareableArray.prototype.slice = function (begin, end) {
        return new ShareableArray(this._elements.slice(begin, end));
    };
    /**
     * The splice() method changes the content of an array by removing existing elements and/or adding new elements.
     */
    ShareableArray.prototype.splice = function (index, deleteCount) {
        // The release burdon is on the caller now.
        return transferOwnership(this._elements.splice(index, deleteCount));
    };
    /**
     *
     */
    ShareableArray.prototype.shift = function () {
        // No need to addRef because ownership is being transferred to caller.
        return this._elements.shift();
    };
    /**
     * Traverse without Reference Counting
     */
    ShareableArray.prototype.forEach = function (callback) {
        return this._elements.forEach(callback);
    };
    /**
     * Pushes <code>element</code> onto the tail of the list and increments the element reference count.
     */
    ShareableArray.prototype.push = function (element) {
        if (element) {
            if (element.addRef) {
                element.addRef();
            }
        }
        return this.pushWeakRef(element);
    };
    /**
     * Pushes <code>element</code> onto the tail of the list <em>without</em> incrementing the <code>element</code> reference count.
     */
    ShareableArray.prototype.pushWeakRef = function (element) {
        return this._elements.push(element);
    };
    /**
     *
     */
    ShareableArray.prototype.pop = function () {
        // No need to addRef because ownership is being transferred to caller.
        return this._elements.pop();
    };
    /**
     *
     */
    ShareableArray.prototype.unshift = function (element) {
        if (element.addRef) {
            element.addRef();
        }
        return this.unshiftWeakRef(element);
    };
    /**
     * <p>
     * <code>unshift</code> <em>without</em> incrementing the <code>element</code> reference count.
     * </p>
     */
    ShareableArray.prototype.unshiftWeakRef = function (element) {
        return this._elements.unshift(element);
    };
    return ShareableArray;
}(ShareableBase));

/**
 * A collection of Renderable objects.
 */
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene(contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager) || this;
        _this.setLoggingName('Scene');
        mustBeNonNullObject('contextManager', contextManager);
        _this._drawables = new ShareableArray([]);
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
        mustBeNonNullObject('drawable', drawable);
        this._drawables.push(drawable);
    };
    Scene.prototype.contains = function (drawable) {
        mustBeNonNullObject('drawable', drawable);
        return this._drawables.indexOf(drawable) >= 0;
    };
    /**
     * @deprecated. Use the render method instead.
     */
    Scene.prototype.draw = function (ambients) {
        console.warn("Scene.draw is deprecated. Please use the Scene.render method instead.");
        this.render(ambients);
    };
    /**
     * Traverses the collection of Renderable objects, calling render(ambients) on each one.
     * The rendering takes place in two stages.
     * In the first stage, non-transparent objects are drawn.
     * In the second state, transparent objects are drawn.
     */
    Scene.prototype.render = function (ambients) {
        var gl = this.gl;
        if (gl) {
            var ds = this._drawables;
            var iLen = ds.length;
            /**
             * true is non-transparent objects exist.
             */
            var passOne = false;
            /**
             * true if transparent objects exist.
             */
            var passTwo = false;
            // Zeroth pass through objects determines what kind of objects exist.
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
                        // Render non-transparent objects in the first pass.
                        gl.depthMask(true);
                        for (var i = 0; i < iLen; i++) {
                            var d = ds.getWeakRef(i);
                            if (!d.transparent) {
                                d.render(ambients);
                            }
                        }
                    }
                    // Render transparent objects in the second pass.
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
                    // There must be non-transparent objects, render them.
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
        mustBeNonNullObject('drawable', drawable);
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
}(ShareableContextConsumer));

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
            throw new Error(message);
        }
        else {
            throw new Error("Context lost while compiling " + decodeType(gl, type) + ".");
        }
    }
}

/**
 *
 */
var Shader = (function (_super) {
    __extends(Shader, _super);
    function Shader(source, type, engine) {
        var _this = _super.call(this, engine) || this;
        _this.setLoggingName('Shader');
        _this._source = mustBeString('source', source);
        _this._shaderType = mustBeNumber('type', type);
        return _this;
    }
    Shader.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
        mustBeUndefined(this.getLoggingName(), this._shader);
    };
    Shader.prototype.contextFree = function () {
        if (this._shader) {
            this.contextManager.gl.deleteShader(this._shader);
            this._shader = void 0;
        }
        _super.prototype.contextFree.call(this);
    };
    Shader.prototype.contextGain = function () {
        this._shader = makeWebGLShader(this.contextManager.gl, this._source, this._shaderType);
        _super.prototype.contextGain.call(this);
    };
    Shader.prototype.contextLost = function () {
        this._shader = void 0;
        _super.prototype.contextLost.call(this);
    };
    return Shader;
}(ShareableContextConsumer));

/**
 *
 */

(function (TextureMagFilter) {
    TextureMagFilter[TextureMagFilter["NEAREST"] = 9728] = "NEAREST";
    TextureMagFilter[TextureMagFilter["LINEAR"] = 9729] = "LINEAR";
})(exports.TextureMagFilter || (exports.TextureMagFilter = {}));

/**
 *
 */

(function (TextureMinFilter) {
    TextureMinFilter[TextureMinFilter["NEAREST"] = 9728] = "NEAREST";
    TextureMinFilter[TextureMinFilter["LINEAR"] = 9729] = "LINEAR";
    TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
    TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
    TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
    TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
})(exports.TextureMinFilter || (exports.TextureMinFilter = {}));

/**
 *
 */

(function (TextureTarget) {
    TextureTarget[TextureTarget["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
    TextureTarget[TextureTarget["TEXTURE"] = 5890] = "TEXTURE";
})(exports.TextureTarget || (exports.TextureTarget = {}));

/**
 *
 */

(function (TextureWrapMode) {
    TextureWrapMode[TextureWrapMode["REPEAT"] = 10497] = "REPEAT";
    TextureWrapMode[TextureWrapMode["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    TextureWrapMode[TextureWrapMode["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(exports.TextureWrapMode || (exports.TextureWrapMode = {}));

/**
 * A wrapper around a <code>WebGLUniformLocation</code>.
 */
var Uniform = (function () {
    function Uniform(info) {
        if (!isNull(info)) {
            mustBeObject('info', info);
            this.name = info.name;
        }
    }
    Uniform.prototype.contextFree = function () {
        this.contextLost();
    };
    Uniform.prototype.contextGain = function (gl, program) {
        this.contextLost();
        this.gl = gl;
        // If the location is null, no uniforms are updated and no error code is generated.
        if (!isNull(this.name)) {
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
    /**
     * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
     */
    Uniform.prototype.matrix2fv = function (transpose, value) {
        var gl = this.gl;
        if (gl) {
            gl.uniformMatrix2fv(this.location, transpose, value);
        }
    };
    /**
     * Sets a uniform location of type <code>mat3</code> in a <code>WebGLProgram</code>.
     */
    Uniform.prototype.matrix3fv = function (transpose, value) {
        var gl = this.gl;
        if (gl) {
            gl.uniformMatrix3fv(this.location, transpose, value);
        }
    };
    /**
     * Sets a uniform location of type <code>mat4</code> in a <code>WebGLProgram</code>.
     */
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

/**
 * Verify that the enums match the values in the WebGL rendering context.
 */
function checkEnums(gl) {
    // BeginMode
    mustBeEQ('LINE_LOOP', exports.BeginMode.LINE_LOOP, gl.LINE_LOOP);
    mustBeEQ('LINE_STRIP', exports.BeginMode.LINE_STRIP, gl.LINE_STRIP);
    mustBeEQ('LINES', exports.BeginMode.LINES, gl.LINES);
    mustBeEQ('POINTS', exports.BeginMode.POINTS, gl.POINTS);
    mustBeEQ('TRIANGLE_FAN', exports.BeginMode.TRIANGLE_FAN, gl.TRIANGLE_FAN);
    mustBeEQ('TRIANGLE_STRIP', exports.BeginMode.TRIANGLE_STRIP, gl.TRIANGLE_STRIP);
    mustBeEQ('TRIANGLES', exports.BeginMode.TRIANGLES, gl.TRIANGLES);
    // BlendingFactorDest
    mustBeEQ('ZERO', exports.BlendingFactorDest.ZERO, gl.ZERO);
    mustBeEQ('ONE', exports.BlendingFactorDest.ONE, gl.ONE);
    mustBeEQ('SRC_COLOR', exports.BlendingFactorDest.SRC_COLOR, gl.SRC_COLOR);
    mustBeEQ('ONE_MINUS_SRC_COLOR', exports.BlendingFactorDest.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_COLOR);
    mustBeEQ('SRC_ALPHA', exports.BlendingFactorDest.SRC_ALPHA, gl.SRC_ALPHA);
    mustBeEQ('ONE_MINUS_SRC_ALPHA', exports.BlendingFactorDest.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    mustBeEQ('DST_ALPHA', exports.BlendingFactorDest.DST_ALPHA, gl.DST_ALPHA);
    mustBeEQ('ONE_MINUS_DST_ALPHA', exports.BlendingFactorDest.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
    // BlendingFactorSrc
    mustBeEQ('ZERO', exports.BlendingFactorSrc.ZERO, gl.ZERO);
    mustBeEQ('ONE', exports.BlendingFactorSrc.ONE, gl.ONE);
    mustBeEQ('DST_COLOR', exports.BlendingFactorSrc.DST_COLOR, gl.DST_COLOR);
    mustBeEQ('ONE_MINUS_DST_COLOR', exports.BlendingFactorSrc.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_DST_COLOR);
    mustBeEQ('SRC_ALPHA_SATURATE', exports.BlendingFactorSrc.SRC_ALPHA_SATURATE, gl.SRC_ALPHA_SATURATE);
    mustBeEQ('SRC_ALPHA', exports.BlendingFactorSrc.SRC_ALPHA, gl.SRC_ALPHA);
    mustBeEQ('ONE_MINUS_SRC_ALPHA', exports.BlendingFactorSrc.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    mustBeEQ('DST_ALPHA', exports.BlendingFactorSrc.DST_ALPHA, gl.DST_ALPHA);
    mustBeEQ('ONE_MINUS_DST_ALPHA', exports.BlendingFactorSrc.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
    // BufferObjects
    mustBeEQ('ARRAY_BUFFER', BufferObjects.ARRAY_BUFFER, gl.ARRAY_BUFFER);
    mustBeEQ('ARRAY_BUFFER_BINDING', BufferObjects.ARRAY_BUFFER_BINDING, gl.ARRAY_BUFFER_BINDING);
    mustBeEQ('ELEMENT_ARRAY_BUFFER', BufferObjects.ELEMENT_ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER);
    mustBeEQ('ELEMENT_ARRAY_BUFFER_BINDING', BufferObjects.ELEMENT_ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING);
    // Capability
    mustBeEQ('CULL_FACE', exports.Capability.CULL_FACE, gl.CULL_FACE);
    mustBeEQ('BLEND', exports.Capability.BLEND, gl.BLEND);
    mustBeEQ('DITHER', exports.Capability.DITHER, gl.DITHER);
    mustBeEQ('STENCIL_TEST', exports.Capability.STENCIL_TEST, gl.STENCIL_TEST);
    mustBeEQ('DEPTH_TEST', exports.Capability.DEPTH_TEST, gl.DEPTH_TEST);
    mustBeEQ('SCISSOR_TEST', exports.Capability.SCISSOR_TEST, gl.SCISSOR_TEST);
    mustBeEQ('POLYGON_OFFSET_FILL', exports.Capability.POLYGON_OFFSET_FILL, gl.POLYGON_OFFSET_FILL);
    mustBeEQ('SAMPLE_ALPHA_TO_COVERAGE', exports.Capability.SAMPLE_ALPHA_TO_COVERAGE, gl.SAMPLE_ALPHA_TO_COVERAGE);
    mustBeEQ('SAMPLE_COVERAGE', exports.Capability.SAMPLE_COVERAGE, gl.SAMPLE_COVERAGE);
    // ClearBufferMask
    mustBeEQ('COLOR_BUFFER_BIT', exports.ClearBufferMask.COLOR_BUFFER_BIT, gl.COLOR_BUFFER_BIT);
    mustBeEQ('DEPTH_BUFFER_BIT', exports.ClearBufferMask.DEPTH_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
    mustBeEQ('STENCIL_BUFFER_BIT', exports.ClearBufferMask.STENCIL_BUFFER_BIT, gl.STENCIL_BUFFER_BIT);
    // DepthFunction
    mustBeEQ('ALWAYS', exports.DepthFunction.ALWAYS, gl.ALWAYS);
    mustBeEQ('EQUAL', exports.DepthFunction.EQUAL, gl.EQUAL);
    mustBeEQ('GEQUAL', exports.DepthFunction.GEQUAL, gl.GEQUAL);
    mustBeEQ('GREATER', exports.DepthFunction.GREATER, gl.GREATER);
    mustBeEQ('LEQUAL', exports.DepthFunction.LEQUAL, gl.LEQUAL);
    mustBeEQ('LESS', exports.DepthFunction.LESS, gl.LESS);
    mustBeEQ('NEVER', exports.DepthFunction.NEVER, gl.NEVER);
    mustBeEQ('NOTEQUAL', exports.DepthFunction.NOTEQUAL, gl.NOTEQUAL);
    // PixelFormat
    mustBeEQ('DEPTH_COMPONENT', exports.PixelFormat.DEPTH_COMPONENT, gl.DEPTH_COMPONENT);
    mustBeEQ('ALPHA', exports.PixelFormat.ALPHA, gl.ALPHA);
    mustBeEQ('RGB', exports.PixelFormat.RGB, gl.RGB);
    mustBeEQ('RGBA', exports.PixelFormat.RGBA, gl.RGBA);
    mustBeEQ('LUMINANCE', exports.PixelFormat.LUMINANCE, gl.LUMINANCE);
    mustBeEQ('LUMINANCE_ALPHA', exports.PixelFormat.LUMINANCE_ALPHA, gl.LUMINANCE_ALPHA);
    // PixelType
    mustBeEQ('UNSIGNED_BYTE', exports.PixelType.UNSIGNED_BYTE, gl.UNSIGNED_BYTE);
    mustBeEQ('UNSIGNED_SHORT_4_4_4_4', exports.PixelType.UNSIGNED_SHORT_4_4_4_4, gl.UNSIGNED_SHORT_4_4_4_4);
    mustBeEQ('UNSIGNED_SHORT_5_5_5_1', exports.PixelType.UNSIGNED_SHORT_5_5_5_1, gl.UNSIGNED_SHORT_5_5_5_1);
    mustBeEQ('UNSIGNED_SHORT_5_6_5', exports.PixelType.UNSIGNED_SHORT_5_6_5, gl.UNSIGNED_SHORT_5_6_5);
    // Usage
    mustBeEQ('STREAM_DRAW', exports.Usage.STREAM_DRAW, gl.STREAM_DRAW);
    mustBeEQ('STATIC_DRAW', exports.Usage.STATIC_DRAW, gl.STATIC_DRAW);
    mustBeEQ('DYNAMIC_DRAW', exports.Usage.DYNAMIC_DRAW, gl.DYNAMIC_DRAW);
    return gl;
}

/**
 * Displays details about EIGHT to the console.
 */
var EIGHTLogger = (function (_super) {
    __extends(EIGHTLogger, _super);
    function EIGHTLogger() {
        var _this = _super.call(this) || this;
        _this.setLoggingName('EIGHTLogger');
        return _this;
    }
    EIGHTLogger.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    EIGHTLogger.prototype.contextFree = function () {
        // Does nothing.
    };
    /**
     * Logs the namespace, version, GitHub URL, and last modified date to the console.
     */
    EIGHTLogger.prototype.contextGain = function () {
        console.log(config.NAMESPACE + " " + config.VERSION + " (" + config.GITHUB + ") " + config.LAST_MODIFIED);
    };
    EIGHTLogger.prototype.contextLost = function () {
        // Do nothing.
    };
    return EIGHTLogger;
}(ShareableBase));

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
            // Do nothing.
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

/**
 * Displays details about the WegGL version to the console.
 */
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
        // Do nothing.
    };
    VersionLogger.prototype.contextGain = function () {
        var gl = this.contextManager.gl;
        console.log(gl.getParameter(gl.VERSION));
    };
    VersionLogger.prototype.contextLost = function () {
        // Do nothing.
    };
    return VersionLogger;
}(ShareableBase));

/**
 * A wrapper around an HTMLCanvasElement providing access to the WebGLRenderingContext
 * and notifications of context loss and restore. An instance of the Engine will usually
 * be a required parameter for any consumer of WebGL resources.
 *
 *
 *     export const e1 = EIGHT.Geometric3.e1;
 *     export const e2 = EIGHT.Geometric3.e2;
 *     export const e3 = EIGHT.Geometric3.e3;
 *
 *     const engine = new EIGHT.Engine('canvas3D')
 *       .size(500, 500)
 *       .clearColor(0.1, 0.1, 0.1, 1.0)
 *       .enable(EIGHT.Capability.DEPTH_TEST)
 *
 *     const scene = new EIGHT.Scene(engine)
 *
 *     const ambients: EIGHT.Facet[] = []
 *
 *     const camera = new EIGHT.PerspectiveCamera()
 *     camera.eye = e2 + 3 * e3
 *     ambients.push(camera)
 *
 *     const dirLight = new EIGHT.DirectionalLight()
 *     ambients.push(dirLight)
 *
 *     const trackball = new EIGHT.TrackballControls(camera)
 *     trackball.subscribe(engine.canvas)
 *
 *     const box = new EIGHT.Box(engine)
 *     box.color = EIGHT.Color.green
 *     scene.add(box)
 *
 *     const animate = function(timestamp: number) {
 *       engine.clear()
 *
 *       trackball.update()
 *
 *       dirLight.direction = camera.look - camera.eye
 *
 *       box.attitude.rotorFromAxisAngle(e2, timestamp * 0.001)
 *
 *       scene.render(ambients)
 *
 *       requestAnimationFrame(animate)
 *     }
 *
 *     requestAnimationFrame(animate)
 */
var Engine = (function (_super) {
    __extends(Engine, _super);
    /**
     * @param canvas
     * @param attributes Allows the context to be configured.
     * @param doc The document object model that contains the canvas identifier.
     */
    function Engine(canvas, attributes, doc) {
        if (attributes === void 0) { attributes = {}; }
        if (doc === void 0) { doc = window.document; }
        var _this = _super.call(this) || this;
        // Remark: We only hold weak references to users so that the lifetime of resource
        // objects is not affected by the fact that they are listening for gl events.
        // Users should automatically add themselves upon construction and remove upon release.
        _this._users = [];
        /**
         * Actions that are executed when a WebGLRenderingContext is gained.
         */
        _this._commands = new ShareableArray([]);
        /**
         * The cache of Geometry.
         */
        _this.geometries = {};
        /**
         * The cache of Material.
         */
        _this.materials = {};
        _this.setLoggingName('Engine');
        _this._attributes = attributes;
        if (attributes.eightLogging) {
            _this._commands.pushWeakRef(new EIGHTLogger());
        }
        if (attributes.webglLogging) {
            _this._commands.pushWeakRef(new VersionLogger(_this));
        }
        _this._webGLContextLost = function (event) {
            if (isDefined(_this._gl)) {
                event.preventDefault();
                _this._gl = void 0;
                _this._users.forEach(function (user) {
                    user.contextLost();
                });
            }
        };
        _this._webGLContextRestored = function (event) {
            if (isDefined(_this._gl)) {
                event.preventDefault();
                _this._gl = initWebGL(_this._gl.canvas, attributes);
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
    /**
     *
     */
    Engine.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('Engine');
        this._commands = new ShareableArray([]);
    };
    /**
     *
     */
    Engine.prototype.destructor = function (levelUp) {
        this.stop();
        while (this._users.length > 0) {
            this._users.pop();
        }
        this._commands.release();
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    Engine.prototype.addContextListener = function (user) {
        mustBeNonNullObject('user', user);
        var index = this._users.indexOf(user);
        if (index < 0) {
            this._users.push(user);
        }
        else {
            console.warn("user already exists for addContextListener");
        }
    };
    Object.defineProperty(Engine.prototype, "canvas", {
        /**
         * The canvas element associated with the WebGLRenderingContext.
         */
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
    /**
     * <p>
     * Sets the graphics buffers to values preselected by clearColor, clearDepth or clearStencil.
     * </p>
     */
    Engine.prototype.clear = function (mask) {
        if (mask === void 0) { mask = exports.ClearBufferMask.COLOR_BUFFER_BIT | exports.ClearBufferMask.DEPTH_BUFFER_BIT; }
        var gl = this._gl;
        if (gl) {
            gl.clear(mask);
        }
        return this;
    };
    /**
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     */
    Engine.prototype.clearColor = function (red, green, blue, alpha) {
        this._commands.pushWeakRef(new WebGLClearColor(this, red, green, blue, alpha));
        var gl = this._gl;
        if (gl) {
            gl.clearColor(red, green, blue, alpha);
        }
        return this;
    };
    /**
     * Specifies the clear value for the depth buffer.
     * This specifies what depth value to use when calling the clear() method.
     * The value is clamped between 0 and 1.
     *
     * @param depth Specifies the depth value used when the depth buffer is cleared.
     * The default value is 1.
     */
    Engine.prototype.clearDepth = function (depth) {
        var gl = this._gl;
        if (gl) {
            gl.clearDepth(depth);
        }
        return this;
    };
    /**
     * @param s Specifies the index used when the stencil buffer is cleared.
     * The default value is 0.
     */
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
    /**
     * Disables the specified WebGL capability.
     */
    Engine.prototype.disable = function (capability) {
        this._commands.pushWeakRef(new WebGLDisable(this, capability));
        if (this._gl) {
            this._gl.disable(capability);
        }
        return this;
    };
    /**
     * Enables the specified WebGL capability.
     */
    Engine.prototype.enable = function (capability) {
        this._commands.pushWeakRef(new WebGLEnable(this, capability));
        if (this._gl) {
            this._gl.enable(capability);
        }
        return this;
    };
    Object.defineProperty(Engine.prototype, "gl", {
        /**
         * The underlying WebGL rendering context.
         */
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
    /**
     *
     */
    Engine.prototype.readPixels = function (x, y, width, height, format, type, pixels) {
        if (this._gl) {
            this._gl.readPixels(x, y, width, height, format, type, pixels);
        }
    };
    /**
     * @param user
     */
    Engine.prototype.removeContextListener = function (user) {
        mustBeNonNullObject('user', user);
        var index = this._users.indexOf(user);
        if (index >= 0) {
            this._users.splice(index, 1);
        }
    };
    /**
     * A convenience method for setting the width and height properties of the
     * underlying canvas and for setting the viewport to the drawing buffer height and width.
     */
    Engine.prototype.size = function (width, height) {
        this.canvas.width = mustBeNumber('width', width);
        this.canvas.height = mustBeNumber('height', height);
        return this.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    };
    /**
     * The viewport width and height are clamped to a range that is
     * implementation dependent.
     *
     * @returns e.g. Int32Array[16384, 16384]
     */
    Engine.prototype.getMaxViewportDims = function () {
        var gl = this._gl;
        if (gl) {
            return gl.getParameter(gl.MAX_VIEWPORT_DIMS);
        }
        else {
            return void 0;
        }
    };
    /**
     * Returns the current viewport settings.
     *
     * @returns e.g. Int32Array[x, y, width, height]
     */
    Engine.prototype.getViewport = function () {
        var gl = this._gl;
        if (gl) {
            return gl.getParameter(gl.VIEWPORT);
        }
        else {
            return void 0;
        }
    };
    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     *
     * @param x
     * @param y
     * @param width
     * @param height
     */
    Engine.prototype.viewport = function (x, y, width, height) {
        var gl = this._gl;
        if (gl) {
            gl.viewport(x, y, width, height);
        }
        return this;
    };
    /**
     * Initializes the <code>WebGLRenderingContext</code> for the specified <code>HTMLCanvasElement</code>.
     *
     * @param canvas The HTML canvas element or canvas element identifier.
     * @param doc The document object model that contains the canvas identifier.
     */
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
            if (isDefined(this._gl)) {
                // We'll just be idempotent and ignore the call because we've already been started.
                // To use the canvas might conflict with one we have dynamically created.
                console.warn(this.getLoggingName() + " Ignoring start() because already started.");
                return this;
            }
            else {
                this._gl = checkEnums(initWebGL(canvas, this._attributes));
                this.emitStartEvent();
                canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
            }
            return this;
        }
        else {
            if (isDefined(canvas)) {
                this._gl = checkEnums(canvas);
            }
            return this;
        }
    };
    /**
     *
     */
    Engine.prototype.stop = function () {
        if (isDefined(this._gl)) {
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
    /**
     * @param consumer
     */
    Engine.prototype.synchronize = function (consumer) {
        if (this._gl) {
            this.emitContextGain(consumer);
        }
        else {
            // FIXME: Broken symmetry?
        }
        return this;
    };
    /**
     *
     */
    Engine.prototype.getCacheGeometry = function (geometryKey) {
        mustBeNonNullObject('geometryKey', geometryKey);
        mustBeString('geometryKey.kind', geometryKey.kind);
        var key = JSON.stringify(geometryKey);
        var geometry = this.geometries[key];
        if (geometry && geometry.addRef) {
            geometry.addRef();
        }
        return geometry;
    };
    /**
     *
     */
    Engine.prototype.putCacheGeometry = function (geometryKey, geometry) {
        mustBeNonNullObject('geometryKey', geometryKey);
        mustBeNonNullObject('geometry', geometry);
        mustBeString('geometryKey.kind', geometryKey.kind);
        var key = JSON.stringify(geometryKey);
        this.geometries[key] = geometry;
    };
    /**
     *
     */
    Engine.prototype.getCacheMaterial = function (materialKey) {
        mustBeNonNullObject('materialKey', materialKey);
        mustBeString('materialKey.kind', materialKey.kind);
        var key = JSON.stringify(materialKey);
        var material = this.materials[key];
        if (material && material.addRef) {
            material.addRef();
        }
        return material;
    };
    /**
     *
     */
    Engine.prototype.putCacheMaterial = function (materialKey, material) {
        mustBeNonNullObject('materialKey', materialKey);
        mustBeNonNullObject('material', material);
        mustBeString('materialKey.kind', materialKey.kind);
        var key = JSON.stringify(materialKey);
        this.materials[key] = material;
    };
    /**
     * Computes the coordinates of a point in the image cube corresponding to device coordinates.
     * @param deviceX The x-coordinate of the device event.
     * @param deviceY The y-coordinate of the device event.
     * @param imageZ The optional value to use as the resulting depth coordinate.
     */
    Engine.prototype.deviceToImageCoords = function (deviceX, deviceY, imageZ) {
        if (imageZ === void 0) { imageZ = 0; }
        mustBeNumber('deviceX', deviceX);
        mustBeNumber('deviceY', deviceY);
        mustBeNumber('imageZ', imageZ);
        mustBeGE('imageZ', imageZ, -1);
        mustBeLE('imageZ', imageZ, +1);
        var imageX = ((2 * deviceX) / this.canvas.width) - 1;
        var imageY = 1 - (2 * deviceY) / this.canvas.height;
        return vectorFromCoords(imageX, imageY, imageZ);
    };
    return Engine;
}(ShareableBase));

/**
 *
 */
var AmbientLight = (function () {
    /**
     *
     */
    function AmbientLight(color) {
        mustBeObject('color', color);
        // FIXME: Need some kind of locking for constants
        this.color = Color.white.clone();
        this.color.r = mustBeNumber('color.r', color.r);
        this.color.g = mustBeNumber('color.g', color.g);
        this.color.b = mustBeNumber('color.b', color.b);
    }
    /**
     *
     */
    AmbientLight.prototype.setUniforms = function (visitor) {
        var color = this.color;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, color.r, color.g, color.b);
    };
    return AmbientLight;
}());

/**
 *
 */
var DirectionalLight = (function () {
    function DirectionalLight(direction, color) {
        if (direction === void 0) { direction = Vector3.vector(0, 0, 1).neg(); }
        if (color === void 0) { color = Color.white; }
        mustBeObject('direction', direction);
        mustBeObject('color', color);
        this.direction_ = Geometric3.fromVector(direction).normalize();
        this.color_ = Color.copy(color);
    }
    Object.defineProperty(DirectionalLight.prototype, "color", {
        get: function () {
            return this.color_;
        },
        set: function (color) {
            this.color_.copy(Color.mustBe('color', color));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "direction", {
        get: function () {
            return this.direction_;
        },
        set: function (direction) {
            mustBeObject('direction', direction);
            this.direction_.copy(direction);
        },
        enumerable: true,
        configurable: true
    });
    DirectionalLight.prototype.setUniforms = function (visitor) {
        var direction = this.direction_;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z);
        var color = this.color_;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b);
    };
    return DirectionalLight;
}());

/**
 * Computes the determinant of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
function det2x2(m) {
    var n11 = m[0x0];
    var n12 = m[0x2];
    var n21 = m[0x1];
    var n22 = m[0x3];
    return n11 * n22 - n12 * n21;
}

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
/**
 *
 */
var Matrix2 = (function (_super) {
    __extends(Matrix2, _super);
    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Matrix2 by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 2
     * 1 3
     *
     * @param elements The elements of the matrix in column-major order.
     */
    function Matrix2(elements) {
        return _super.call(this, elements, 2) || this;
    }
    Matrix2.prototype.add = function (rhs) {
        if (this.isLocked()) {
            throw new TargetLockedError('add');
        }
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
        return new Matrix2(new Float32Array([0, 0, 0, 0])).set(m11, m12, m21, m22);
    };
    /**
     * Computes the determinant.
     */
    Matrix2.prototype.det = function () {
        return det2x2(this.elements);
    };
    /**
     * Sets this matrix to its inverse.
     */
    Matrix2.prototype.inv = function () {
        var te = this.elements;
        var a = te[0];
        var c = te[1];
        var b = te[2];
        var d = te[3];
        var det = this.det();
        return this.set(d, -b, -c, a).scale(1 / det);
    };
    /**
     * Determines whether this matrix is the identity matrix for multiplication.
     */
    Matrix2.prototype.isOne = function () {
        var te = this.elements;
        var a = te[0];
        var c = te[1];
        var b = te[2];
        var d = te[3];
        return (a === 1 && b === 0 && c === 0 && d === 1);
    };
    /**
     * Determines whether this matrix is the identity matrix for addition.
     */
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
    /**
     * Sets this matrix to its additive inverse.
     */
    Matrix2.prototype.neg = function () {
        return this.scale(-1);
    };
    /**
     * Sets this matrix to the identity element for multiplication, 1.
     */
    Matrix2.prototype.one = function () {
        return this.set(1, 0, 0, 1);
    };
    /**
     * Sets this matrix to the transformation for a
     * reflection in the line normal to the unit vector <code>n</code>.
     *
     * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
     *
     */
    Matrix2.prototype.reflection = function (n) {
        var nx = mustBeNumber('n.x', n.x);
        var xx = 1 - 2 * nx * nx;
        return this.set(xx, 0, 0, 1);
    };
    /**
     * Returns the row for the specified index.
     * @param i the zero-based index of the row.
     */
    Matrix2.prototype.row = function (i) {
        var te = this.elements;
        return [te[0 + i], te[2 + i]];
    };
    /**
     * Multiplies this matrix by the scale factor, α.
     */
    Matrix2.prototype.scale = function (α) {
        var te = this.elements;
        var m11 = te[0] * α;
        var m21 = te[1] * α;
        var m12 = te[2] * α;
        var m22 = te[3] * α;
        return this.set(m11, m12, m21, m22);
    };
    /**
     * Sets all elements of this matrix to the supplied row-major values m11, ..., m22.
     * @method set
     * @param m11 {number}
     * @param m12 {number}
     * @param m21 {number}
     * @param m22 {number}
     * @return {Matrix2}
     * @chainable
     */
    Matrix2.prototype.set = function (m11, m12, m21, m22) {
        var te = this.elements;
        // The elements are stored in column-major order.
        te[0x0] = m11;
        te[0x2] = m12;
        te[0x1] = m21;
        te[0x3] = m22;
        return this;
    };
    /**
     * @method sub
     * @param rhs {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
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
    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Matrix2.prototype.toExponential = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Matrix2.prototype.toFixed = function (fractionDigits) {
        if (isDefined(fractionDigits)) {
            mustBeInteger('fractionDigits', fractionDigits);
        }
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @method toPrecision
     * @param [precision] {number}
     * @return {string}
     */
    Matrix2.prototype.toPrecision = function (precision) {
        if (isDefined(precision)) {
            mustBeInteger('precision', precision);
        }
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toPrecision(precision); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @method toString
     * @param [radix] {number}
     * @return {string}
     */
    Matrix2.prototype.toString = function (radix) {
        var text = [];
        for (var i = 0, iLength = this.dimensions; i < iLength; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @method translation
     * @param d {VectorE1}
     * @return {Matrix2}
     * @chainable
     */
    Matrix2.prototype.translation = function (d) {
        var x = d.x;
        return this.set(1, x, 0, 1);
    };
    /**
     * Sets this matrix to the identity element for addition, 0.
     */
    Matrix2.prototype.zero = function () {
        return this.set(0, 0, 0, 0);
    };
    Matrix2.prototype.__add__ = function (rhs) {
        if (rhs instanceof Matrix2) {
            return lock(this.clone().add(rhs));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Matrix2) {
            return lock(lhs.clone().add(this));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__mul__ = function (rhs) {
        if (rhs instanceof Matrix2) {
            return lock(this.clone().mul(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Matrix2) {
            return lock(lhs.clone().mul(this));
        }
        else if (typeof lhs === 'number') {
            return lock(this.clone().scale(lhs));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__pos__ = function () {
        return lock(this.clone());
    };
    Matrix2.prototype.__neg__ = function () {
        return lock(this.clone().scale(-1));
    };
    Matrix2.prototype.__sub__ = function (rhs) {
        if (rhs instanceof Matrix2) {
            return lock(this.clone().sub(rhs));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Matrix2) {
            return lock(lhs.clone().sub(this));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Matrix2.reflection = function (n) {
        return Matrix2.zero.clone().reflection(n);
    };
    Matrix2.one = lock(new Matrix2(new Float32Array([1, 0, 0, 1])));
    Matrix2.zero = lock(new Matrix2(new Float32Array([0, 0, 0, 0])));
    return Matrix2;
}(AbstractMatrix));

/**
 *
 */
var ReflectionFacetE2 = (function () {
    /**
     * @param name The name of the uniform variable.
     */
    function ReflectionFacetE2(name) {
        /**
         *
         */
        this.matrix = Matrix2.one.clone();
        this.name = mustBeString('name', name);
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = new Vector2().zero();
        this._normal.modified = true;
    }
    Object.defineProperty(ReflectionFacetE2.prototype, "normal", {
        /**
         *
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
     *
     */
    ReflectionFacetE2.prototype.setUniforms = function (visitor) {
        if (this._normal.modified) {
            this.matrix.reflection(this._normal);
            this._normal.modified = false;
        }
        visitor.matrix2fv(this.name, this.matrix.elements, false);
    };
    return ReflectionFacetE2;
}());

/**
 *
 */
var ReflectionFacetE3 = (function () {
    /**
     * @param name {string} The name of the uniform variable.
     */
    function ReflectionFacetE3(name) {
        this.matrix = Matrix4.one.clone();
        this.name = mustBeString('name', name);
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = Geometric3.zero(false);
        this._normal.modified = true;
    }
    Object.defineProperty(ReflectionFacetE3.prototype, "normal", {
        get: function () {
            return this._normal;
        },
        set: function (unused) {
            throw new Error(readOnly('normal').message);
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

/**
 * Updates a uniform vec3 shader parameter from a VectorE3.
 * Using a VectorE3 makes assignment easier, which is the dominant use case.
 */
var Vector3Facet = (function () {
    function Vector3Facet(name) {
        /**
         * Intentionally provide access to the mutable property.
         * The value property provides interoperability with other types.
         */
        this.vector = Vector3.vector(0, 0, 0);
        this._name = mustBeString('name', name);
    }
    Object.defineProperty(Vector3Facet.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = mustBeString('name', value);
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
    /**
     *
     */
    Vector3Facet.prototype.setUniforms = function (visitor) {
        var v = this.vector;
        visitor.uniform3f(this._name, v.x, v.y, v.z);
    };
    return Vector3Facet;
}());

// Assume single-threaded to avoid temporary object creation.
var n$1 = new Vector3();
var u$1 = new Vector3();
var v$1 = new Vector3();
function viewArrayFromEyeLookUp(eye, look, up, matrix) {
    var m = isDefined(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    mustSatisfy('matrix', m.length === 16, function () { return 'matrix must have length 16'; });
    n$1.copy(eye).sub(look);
    if (n$1.x === 0 && n$1.y === 0 && n$1.z === 0) {
        // view direction is ambiguous.
        n$1.z = 1;
    }
    else {
        n$1.normalize();
    }
    n$1.approx(12).normalize();
    u$1.copy(up).cross(n$1).approx(12).normalize();
    v$1.copy(n$1).cross(u$1).approx(12).normalize();
    m[0x0] = u$1.x;
    m[0x4] = u$1.y;
    m[0x8] = u$1.z;
    m[0xC] = -Vector3.dot(eye, u$1);
    m[0x1] = v$1.x;
    m[0x5] = v$1.y;
    m[0x9] = v$1.z;
    m[0xD] = -Vector3.dot(eye, v$1);
    m[0x2] = n$1.x;
    m[0x6] = n$1.y;
    m[0xA] = n$1.z;
    m[0xE] = -Vector3.dot(eye, n$1);
    m[0x3] = 0.0;
    m[0x7] = 0.0;
    m[0xB] = 0.0;
    m[0xF] = 1;
    return m;
}

function viewMatrixFromEyeLookUp(eye, look, up, matrix) {
    var m = isDefined(matrix) ? matrix : Matrix4.one.clone();
    viewArrayFromEyeLookUp(eye, look, up, m.elements);
    return m;
}

/**
 *
 */
var ViewTransform = (function () {
    /**
     *
     */
    function ViewTransform() {
        /**
         *
         */
        this._eye = Geometric3.vector(0, 0, 1);
        /**
         *
         */
        this._look = Geometric3.vector(0, 0, 0);
        /**
         *
         */
        this._up = Geometric3.vector(0, 1, 0);
        /**
         *
         */
        this.matrix = Matrix4.one.clone();
        /**
         *
         */
        this.matrixName = GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX;
        this._eye.modified = true;
        this._look.modified = true;
        this._up.modified = true;
    }
    /**
     *
     */
    ViewTransform.prototype.cameraToWorldCoords = function (cameraCoords) {
        // TODO: Pick the coordinates of n, u, v out of the matrix?
        var n = Vector3.copy(this.eye).sub(this.look).normalize();
        var u = Vector3.copy(this.up).cross(n).normalize();
        var v = Vector3.copy(n).cross(u).normalize();
        var u0 = cameraCoords[0];
        var u1 = cameraCoords[1];
        var u2 = cameraCoords[2];
        return this.eye.clone().addVector(u, u0).addVector(v, u1).addVector(n, u2);
    };
    /**
     *
     */
    ViewTransform.prototype.setUniforms = function (visitor) {
        if (this._eye.modified || this._look.modified || this._up.modified) {
            viewMatrixFromEyeLookUp(this._eye, this._look, this._up, this.matrix);
            this._eye.modified = false;
            this._look.modified = false;
            this._up.modified = false;
        }
        visitor.matrix4fv(this.matrixName, this.matrix.elements, false);
    };
    Object.defineProperty(ViewTransform.prototype, "eye", {
        /**
         * The position of the camera, a vector.
         */
        get: function () {
            return this._eye;
        },
        set: function (eye) {
            this._eye.copyVector(eye);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewTransform.prototype, "look", {
        /**
         * The point that is being looked at.
         */
        get: function () {
            return this._look;
        },
        set: function (look) {
            this._look.copyVector(look);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewTransform.prototype, "up", {
        /**
         * The approximate up direction.
         */
        get: function () {
            return this._up;
        },
        set: function (up) {
            this._up.copyVector(up);
        },
        enumerable: true,
        configurable: true
    });
    return ViewTransform;
}());

/**
 *
 */
var PerspectiveTransform = (function () {
    /**
     *
     */
    function PerspectiveTransform(fov, aspect, near, far) {
        if (fov === void 0) { fov = 45 * Math.PI / 180; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 1000; }
        /**
         *
         */
        this.matrix = Matrix4.one.clone();
        /**
         *
         */
        this.matrixName = GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX;
        /**
         *
         */
        this.matrixNeedsUpdate = true;
        // Initialize properties through setters in order to incorporate validation.
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }
    Object.defineProperty(PerspectiveTransform.prototype, "aspect", {
        /**
         * The aspect ratio (width / height) of the camera viewport.
         */
        get: function () {
            return this._aspect;
        },
        set: function (aspect) {
            if (this._aspect !== aspect) {
                mustBeNumber('aspect', aspect);
                mustBeGE('aspect', aspect, 0);
                this._aspect = aspect;
                this.matrixNeedsUpdate = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "fov", {
        /**
         * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
         * Measured in radians.
         */
        get: function () {
            return this._fov;
        },
        set: function (fov) {
            if (this._fov !== fov) {
                mustBeNumber('fov', fov);
                mustBeGE('fov', fov, 0);
                mustBeLE('fov', fov, Math.PI);
                this._fov = fov;
                this.matrixNeedsUpdate = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "near", {
        /**
         * The distance to the near plane.
         */
        get: function () {
            return this._near;
        },
        set: function (near) {
            if (this._near !== near) {
                mustBeNumber('near', near);
                mustBeGE('near', near, 0);
                this._near = near;
                this.matrixNeedsUpdate = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "far", {
        /**
         * The distance to the far plane.
         */
        get: function () {
            return this._far;
        },
        set: function (far) {
            if (this._far !== far) {
                mustBeNumber('far', far);
                mustBeGE('far', far, 0);
                this._far = far;
                this.matrixNeedsUpdate = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    PerspectiveTransform.prototype.setUniforms = function (visitor) {
        if (this.matrixNeedsUpdate) {
            this.matrix.perspective(this._fov, this._aspect, this._near, this._far);
            this.matrixNeedsUpdate = false;
        }
        visitor.matrix4fv(this.matrixName, this.matrix.elements, false);
    };
    /**
     * Converts from image cube coordinates to camera coordinates.
     * This method performs the inverse of the perspective transformation.
     */
    PerspectiveTransform.prototype.imageToCameraCoords = function (x, y, z) {
        /**
         * Near plane distance.
         */
        var n = this.near;
        /**
         * Far plane distance.
         */
        var f = this.far;
        /**
         * Difference of f and n.
         */
        var d = f - n;
        /**
         * Sum of f and n.
         */
        var s = f + n;
        /**
         * Homogeneous coordinates weight.
         */
        var weight = (s - d * z) / (2 * f * n);
        var t = Math.tan(this.fov / 2);
        var u = this.aspect * t * x / weight;
        var v = t * y / weight;
        var w = -1 / weight;
        return [u, v, w];
    };
    return PerspectiveTransform;
}());

/**
 * <p>
 * The <code>PerspectiveCamera</code> provides projection matrix and view matrix uniforms to the
 * current <code>Material</code>.
 * </p>
 * <p>
 * The <code>PerspectiveCamera</code> plays the role of a host in the <em>Visitor</em> pattern.
 * The <code>FacetVistor</code> will normally be a <code>Material</code> implementation. The  accepting
 * method is called <code>setUniforms</code>.
 * <p>
 *
 *     const ambients: Facet[] = []
 *
 *     const camera = new EIGHT.PerspectiveCamera()
 *     camera.aspect = canvas.clientWidth / canvas.clientHeight
 *     camera.eye = Geometric3.copyVector(R3.e3)
 *     ambients.push(camera)
 *
 *     scene.draw(ambients)
 *
 * <p>The camera is initially positioned at <b>e</b><sub>3</sub>.</p>
 */
var PerspectiveCamera = (function () {
    /**
     *
     * @param fov The field of view.
     * @param aspect The aspect is the ratio width / height.
     * @param near The distance of the near plane from the camera.
     * @param far The distance of the far plane from the camera.
     */
    function PerspectiveCamera(fov, aspect, near, far) {
        if (fov === void 0) { fov = 45 * Math.PI / 180; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 1000; }
        this.P = new PerspectiveTransform(fov, aspect, near, far);
        this.V = new ViewTransform();
    }
    /**
     * Converts from image cube coordinates to world coordinates.
     * @param imageX The x-coordinate in the image cube. -1 <= x <= +1.
     * @param imageY The y-coordinate in the image cube. -1 <= y <= +1.
     * @param imageZ The z-coordinate in the image cube. -1 <= z <= +1.
     */
    PerspectiveCamera.prototype.imageToWorldCoords = function (imageX, imageY, imageZ) {
        var cameraCoords = this.P.imageToCameraCoords(imageX, imageY, imageZ);
        return Geometric3.fromVector(this.V.cameraToWorldCoords(cameraCoords));
    };
    /**
     *
     */
    PerspectiveCamera.prototype.setUniforms = function (visitor) {
        this.V.setUniforms(visitor);
        this.P.setUniforms(visitor);
    };
    Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
        /**
         * The aspect ratio (width / height) of the camera viewport.
         */
        get: function () {
            return this.P.aspect;
        },
        set: function (aspect) {
            this.P.aspect = aspect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "eye", {
        /**
         * The position of the camera, a vector.
         */
        get: function () {
            return this.V.eye;
        },
        set: function (eye) {
            this.V.eye.copyVector(eye);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "fov", {
        /**
         * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
         * Measured in radians.
         */
        get: function () {
            return this.P.fov;
        },
        set: function (value) {
            this.P.fov = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "look", {
        /**
         * The point that is being looked at.
         */
        get: function () {
            return this.V.look;
        },
        set: function (look) {
            this.V.look.copyVector(look);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "near", {
        /**
         * The distance to the near plane.
         */
        get: function () {
            return this.P.near;
        },
        set: function (near) {
            this.P.near = near;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "far", {
        /**
         * The distance to the far plane.
         */
        get: function () {
            return this.P.far;
        },
        set: function (far) {
            this.P.far = far;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "up", {
        /**
         * The approximate up direction.
         */
        get: function () {
            return this.V.up;
        },
        set: function (up) {
            this.V.up.copyVector(up);
        },
        enumerable: true,
        configurable: true
    });
    return PerspectiveCamera;
}());

function perspectiveMatrix(fov, aspect, near, far, matrix) {
    var m = isDefined(matrix) ? matrix : Matrix4.one.clone();
    perspectiveArray(fov, aspect, near, far, m.elements);
    return m;
}

function dotVectorE2(a, b) {
    if (isDefined(a) && isDefined(b)) {
        return a.x * b.x + a.y * b.y;
    }
    else {
        return void 0;
    }
}

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

/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 */
function dotVectorCartesianE2(ax, ay, bx, by) {
    return ax * bx + ay * by;
}

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

var sqrt$5 = Math.sqrt;
/**
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * Returns undefined (void 0) if the vectors are anti-parallel.
 */
function rotorFromDirectionsE2(a, b, m) {
    var quadA = quadVectorE2(a);
    var absA = sqrt$5(quadA);
    var quadB = quadVectorE2(b);
    var absB = sqrt$5(quadB);
    var BA = absB * absA;
    var dotBA = dotVectorE2(b, a);
    var denom = sqrt$5(2 * (quadB * quadA + BA * dotBA));
    if (denom !== 0) {
        m = m.versor(b, a);
        m = m.addScalar(BA);
        m = m.divByScalar(denom);
    }
    else {
        // The denominator is zero when |a||b| + a << b = 0.
        // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
        // Then a and b are anti-parallel.
        // The plane of the rotation is ambiguous.
        return void 0;
    }
}

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

// symbolic constants for the coordinate indices into the data array.
var COORD_SCALAR$2 = 0;
var COORD_X$5 = 1;
var COORD_Y$5 = 2;
var COORD_PSEUDO$1 = 3;
var abs$1 = Math.abs;
var atan2 = Math.atan2;
var exp$1 = Math.exp;
var log$1 = Math.log;
var cos$1 = Math.cos;
var sin$1 = Math.sin;
var sqrt$4 = Math.sqrt;
var LEFTWARDS_ARROW = "←";
var RIGHTWARDS_ARROW = "→";
var UPWARDS_ARROW = "↑";
var DOWNWARDS_ARROW = "↓";
var CLOCKWISE_OPEN_CIRCLE_ARROW = "↻";
var ANTICLOCKWISE_OPEN_CIRCLE_ARROW = "↺";
var ARROW_LABELS = ["1", [LEFTWARDS_ARROW, RIGHTWARDS_ARROW], [DOWNWARDS_ARROW, UPWARDS_ARROW], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
var COMPASS_LABELS = ["1", ['W', 'E'], ['S', 'N'], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
var STANDARD_LABELS = ["1", "e1", "e2", "I"];
var zero$1 = function zero() {
    return [0, 0, 0, 0];
};
var scalar$1 = function scalar(a) {
    var coords = zero$1();
    coords[COORD_SCALAR$2] = a;
    return coords;
};
var vector$1 = function vector(x, y) {
    var coords = zero$1();
    coords[COORD_X$5] = x;
    coords[COORD_Y$5] = y;
    return coords;
};
var pseudo$1 = function pseudo(b) {
    var coords = zero$1();
    coords[COORD_PSEUDO$1] = b;
    return coords;
};
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates$4(m) {
    var coords = zero$1();
    coords[COORD_SCALAR$2] = m.a;
    coords[COORD_X$5] = m.x;
    coords[COORD_Y$5] = m.y;
    coords[COORD_PSEUDO$1] = m.b;
    return coords;
}
/**
 * Promotes an unknown value to a Geometric2, or returns undefined.
 */
function duckCopy(value) {
    if (isObject(value)) {
        var m = value;
        if (isNumber(m.x) && isNumber(m.y)) {
            if (isNumber(m.a) && isNumber(m.b)) {
                console.warn("Copying GeometricE2 to Geometric2");
                return Geometric2.copy(m);
            }
            else {
                console.warn("Copying VectorE2 to Geometric2");
                return Geometric2.fromVector(m);
            }
        }
        else {
            if (isNumber(m.a) && isNumber(m.b)) {
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
/**
 *
 */
var Geometric2 = (function () {
    /**
     * [scalar, x, y, pseudo]
     */
    function Geometric2(coords, modified) {
        if (coords === void 0) { coords = [0, 0, 0, 0]; }
        if (modified === void 0) { modified = false; }
        mustBeEQ('coords.length', coords.length, 4);
        this.coords_ = coords;
        this.modified_ = modified;
    }
    Object.defineProperty(Geometric2.prototype, "length", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Geometric2.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    Object.defineProperty(Geometric2.prototype, "a", {
        get: function () {
            return this.coords_[COORD_SCALAR$2];
        },
        set: function (a) {
            if (this.isLocked()) {
                throw new TargetLockedError('set a');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_SCALAR$2] !== a;
            coords[COORD_SCALAR$2] = a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "x", {
        get: function () {
            return this.coords_[COORD_X$5];
        },
        set: function (x) {
            if (this.isLocked()) {
                throw new TargetLockedError('set x');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_X$5] !== x;
            coords[COORD_X$5] = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "y", {
        get: function () {
            return this.coords_[COORD_Y$5];
        },
        set: function (y) {
            if (this.isLocked()) {
                throw new TargetLockedError('set y');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_Y$5] !== y;
            coords[COORD_Y$5] = y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "b", {
        get: function () {
            return this.coords_[COORD_PSEUDO$1];
        },
        set: function (b) {
            if (this.isLocked()) {
                throw new TargetLockedError('set b');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_PSEUDO$1] !== b;
            coords[COORD_PSEUDO$1] = b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric2.prototype, "xy", {
        /**
         *
         */
        get: function () {
            return this.coords_[COORD_PSEUDO$1];
        },
        set: function (xy) {
            if (this.isLocked()) {
                throw new TargetLockedError('set xy');
            }
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_PSEUDO$1] !== xy;
            coords[COORD_PSEUDO$1] = xy;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * this ⟼ this + M * α
     */
    Geometric2.prototype.add = function (M, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('M', M);
        mustBeNumber('α', α);
        this.a += M.a * α;
        this.x += M.x * α;
        this.y += M.y * α;
        this.b += M.b * α;
        return this;
    };
    /**
     * this ⟼ a + b
     */
    Geometric2.prototype.add2 = function (a, b) {
        mustBeObject('a', a);
        mustBeObject('b', b);
        this.a = a.a + b.a;
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.b = a.b + b.b;
        return this;
    };
    /**
     * this ⟼ this + Iβ
     */
    Geometric2.prototype.addPseudo = function (β) {
        mustBeNumber('β', β);
        this.b += β;
        return this;
    };
    /**
     * this ⟼ this + α
     */
    Geometric2.prototype.addScalar = function (α) {
        mustBeNumber('α', α);
        this.a += α;
        return this;
    };
    /**
     * this ⟼ this + v * α
     */
    Geometric2.prototype.addVector = function (v, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('v', v);
        mustBeNumber('α', α);
        this.x += v.x * α;
        this.y += v.y * α;
        return this;
    };
    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns The arg of <code>this</code> multivector.
     */
    Geometric2.prototype.arg = function () {
        if (this.isLocked()) {
            return lock(this.clone().arg());
        }
        else {
            return this.log().grade(2);
        }
    };
    /**
     *
     */
    Geometric2.prototype.approx = function (n) {
        approx(this.coords_, n);
        return this;
    };
    /**
     * copy(this)
     */
    Geometric2.prototype.clone = function () {
        var m = new Geometric2([0, 0, 0, 0]);
        m.copy(this);
        return m;
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    Geometric2.prototype.conj = function () {
        // FIXME: This is only the bivector part.
        // Also need to think about various involutions.
        this.b = -this.b;
        return this;
    };
    /**
     *
     */
    Geometric2.prototype.cos = function () {
        throw new Error(notImplemented('cos').message);
    };
    /**
     *
     */
    Geometric2.prototype.cosh = function () {
        throw new Error(notImplemented('cosh').message);
    };
    /**
     *
     */
    Geometric2.prototype.distanceTo = function (M) {
        var α = this.a - M.a;
        var x = this.x - M.x;
        var y = this.y - M.y;
        var β = this.b - M.b;
        return Math.sqrt(scpE2(α, x, y, β, α, x, y, β, 0));
    };
    /**
     * this ⟼ copy(M)
     */
    Geometric2.prototype.copy = function (M) {
        mustBeObject('M', M);
        this.a = M.a;
        this.x = M.x;
        this.y = M.y;
        this.b = M.b;
        return this;
    };
    /**
     * Sets this multivector to the value of the scalar, α.
     */
    Geometric2.prototype.copyScalar = function (α) {
        return this.zero().addScalar(α);
    };
    /**
     * this ⟼ copy(spinor)
     */
    Geometric2.prototype.copySpinor = function (spinor) {
        mustBeObject('spinor', spinor);
        this.a = spinor.a;
        this.x = 0;
        this.y = 0;
        this.b = spinor.b;
        return this;
    };
    /**
     * this ⟼ copyVector(vector)
     */
    Geometric2.prototype.copyVector = function (vector) {
        mustBeObject('vector', vector);
        this.a = 0;
        this.x = vector.x;
        this.y = vector.y;
        this.b = 0;
        return this;
    };
    /**
     *
     */
    Geometric2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
        var α = b3(t, this.a, controlBegin.a, controlEnd.a, endPoint.a);
        var x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        var y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        var β = b3(t, this.b, controlBegin.b, controlEnd.b, endPoint.b);
        this.a = α;
        this.x = x;
        this.y = y;
        this.b = β;
        return this;
    };
    /**
     * this ⟼ this / magnitude(this)
     */
    Geometric2.prototype.normalize = function () {
        if (this.isLocked()) {
            throw new TargetLockedError('normalize');
        }
        var norm = this.magnitude();
        this.a = this.a / norm;
        this.x = this.x / norm;
        this.y = this.y / norm;
        this.b = this.b / norm;
        return this;
    };
    /**
     * this ⟼ this / m
     */
    Geometric2.prototype.div = function (m) {
        return this.div2(this, m);
    };
    /**
     * this ⟼ a / b
     */
    Geometric2.prototype.div2 = function (a, b) {
        // Invert b using this then multiply, being careful to account for the case
        // when a and this are the same instance by getting a's coordinates first.
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.b;
        this.copy(b).inv();
        var b0 = this.a;
        var b1 = this.x;
        var b2$$1 = this.y;
        var b3$$1 = this.b;
        this.a = mulE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 0);
        this.x = mulE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 1);
        this.y = mulE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 2);
        this.b = mulE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 3);
        return this;
    };
    /**
     * this ⟼ this / α
     */
    Geometric2.prototype.divByScalar = function (α) {
        mustBeNumber('α', α);
        this.a /= α;
        this.x /= α;
        this.y /= α;
        this.b /= α;
        return this;
    };
    /**
     * this ⟼ dual(m) = I * m
     */
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
    /**
     *
     */
    Geometric2.prototype.equals = function (other) {
        if (other instanceof Geometric2) {
            var that = other;
            return arraysEQ(this.coords_, that.coords_);
        }
        else {
            return false;
        }
    };
    /**
     * this ⟼ exp(this)
     */
    Geometric2.prototype.exp = function () {
        var w = this.a;
        var z = this.b;
        var expW = exp$1(w);
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        var φ = sqrt$4(z * z);
        var s = expW * (φ !== 0 ? sin$1(φ) / φ : 1);
        this.a = expW * cos$1(φ);
        this.b = z * s;
        return this;
    };
    /**
     * this ⟼ this ^ m
     */
    Geometric2.prototype.ext = function (m) {
        return this.ext2(this, m);
    };
    /**
     * this ⟼ a ^ b
     */
    Geometric2.prototype.ext2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.b;
        var b0 = b.a;
        var b1 = b.x;
        var b2$$1 = b.y;
        var b3$$1 = b.b;
        this.a = extE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 0);
        this.x = extE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 1);
        this.y = extE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 2);
        this.b = extE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 3);
        return this;
    };
    /**
     * Sets this multivector to its inverse, if it exists.
     */
    Geometric2.prototype.inv = function () {
        // We convert the mutivector/geometric product into a tensor
        // representation with the consequence that inverting the multivector
        // is equivalent to solving a matrix equation, AX = b for X.
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
        var X = gauss(A, b);
        this.a = X[0];
        this.x = X[1];
        this.y = X[2];
        this.b = X[3];
        return this;
    };
    /**
     *
     */
    Geometric2.prototype.isOne = function () {
        return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0;
    };
    /**
     *
     */
    Geometric2.prototype.isZero = function () {
        return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0;
    };
    /**
     * this ⟼ this << m
     */
    Geometric2.prototype.lco = function (m) {
        return this.lco2(this, m);
    };
    /**
     * this ⟼ a << b
     */
    Geometric2.prototype.lco2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.b;
        var b0 = b.a;
        var b1 = b.x;
        var b2$$1 = b.y;
        var b3$$1 = b.b;
        this.a = lcoE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 0);
        this.x = lcoE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 1);
        this.y = lcoE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 2);
        this.b = lcoE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 3);
        return this;
    };
    /**
     * this ⟼ this + α * (target - this)
     */
    Geometric2.prototype.lerp = function (target, α) {
        mustBeObject('target', target);
        mustBeNumber('α', α);
        this.a += (target.a - this.a) * α;
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.b += (target.b - this.b) * α;
        return this;
    };
    /**
     * this ⟼ a + α * (b - a)
     */
    Geometric2.prototype.lerp2 = function (a, b, α) {
        mustBeObject('a', a);
        mustBeObject('b', b);
        mustBeNumber('α', α);
        this.copy(a).lerp(b, α);
        return this;
    };
    /**
     * this ⟼ log(sqrt(α * α + β * β)) + e1e2 * atan2(β, α),
     * where α is the scalar part of `this`,
     * and β is the pseudoscalar part of `this`.
     */
    Geometric2.prototype.log = function () {
        // FIXME: This only handles the spinor components.
        var α = this.a;
        var β = this.b;
        this.a = log$1(sqrt$4(α * α + β * β));
        this.x = 0;
        this.y = 0;
        this.b = atan2(β, α);
        return this;
    };
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * This method does not change this multivector.
     */
    Geometric2.prototype.magnitude = function () {
        return sqrt$4(this.quaditude());
    };
    /**
     * this ⟼ this * m
     */
    Geometric2.prototype.mul = function (m) {
        return this.mul2(this, m);
    };
    /**
     * this ⟼ a * b
     */
    Geometric2.prototype.mul2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.b;
        var b0 = b.a;
        var b1 = b.x;
        var b2$$1 = b.y;
        var b3$$1 = b.b;
        this.a = mulE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 0);
        this.x = mulE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 1);
        this.y = mulE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 2);
        this.b = mulE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 3);
        return this;
    };
    /**
     * this ⟼ -1 * this
     */
    Geometric2.prototype.neg = function () {
        this.a = -this.a;
        this.x = -this.x;
        this.y = -this.y;
        this.b = -this.b;
        return this;
    };
    /**
     * this ⟼ sqrt(this * conj(this))
     */
    Geometric2.prototype.norm = function () {
        this.a = this.magnitude();
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    };
    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     */
    Geometric2.prototype.one = function () {
        this.a = 1;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    };
    /**
     *
     */
    Geometric2.prototype.pow = function (M) {
        mustBeObject('M', M);
        throw new Error(notImplemented('pow').message);
    };
    /**
     * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
     *
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    Geometric2.prototype.quad = function () {
        this.a = this.quaditude();
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    };
    /**
     *
     */
    Geometric2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
        var α = b2(t, this.a, controlPoint.a, endPoint.a);
        var x = b2(t, this.x, controlPoint.x, endPoint.x);
        var y = b2(t, this.y, controlPoint.y, endPoint.y);
        var β = b2(t, this.b, controlPoint.b, endPoint.b);
        this.a = α;
        this.x = x;
        this.y = y;
        this.b = β;
        return this;
    };
    /**
     * this ⟼ this >> m
     */
    Geometric2.prototype.rco = function (m) {
        return this.rco2(this, m);
    };
    /**
     * this ⟼ a >> b
     */
    Geometric2.prototype.rco2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.b;
        var b0 = b.a;
        var b1 = b.x;
        var b2$$1 = b.y;
        var b3$$1 = b.b;
        this.a = rcoE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 0);
        this.x = rcoE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 1);
        this.y = rcoE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 2);
        this.b = rcoE2(a0, a1, a2, a3, b0, b1, b2$$1, b3$$1, 3);
        return this;
    };
    /**
     * this ⟼ - n * this * n
     */
    Geometric2.prototype.reflect = function (n) {
        mustBeObject('n', n);
        var nx = n.x;
        var ny = n.y;
        mustBeNumber('n.x', nx);
        mustBeNumber('n.y', ny);
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
    /**
     * this ⟼ rev(this)
     */
    Geometric2.prototype.rev = function () {
        // reverse has a ++-- structure.
        this.a = this.a;
        this.x = this.x;
        this.y = this.y;
        this.b = -this.b;
        return this;
    };
    /**
     *
     */
    Geometric2.prototype.sin = function () {
        throw new Error(notImplemented('sin').message);
    };
    /**
     *
     */
    Geometric2.prototype.sinh = function () {
        throw new Error(notImplemented('sinh').message);
    };
    /**
     * this ⟼ R * this * rev(R)
     */
    Geometric2.prototype.rotate = function (R) {
        mustBeObject('R', R);
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
    /**
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     */
    Geometric2.prototype.rotorFromDirections = function (a, b) {
        rotorFromDirectionsE2(a, b, this);
        return this;
    };
    Geometric2.prototype.rotorFromVectorToVector = function (a, b) {
        rotorFromDirectionsE2(a, b, this);
        return this;
    };
    /**
     * this ⟼ exp(- B * θ / 2)
     */
    Geometric2.prototype.rotorFromGeneratorAngle = function (B, θ) {
        mustBeObject('B', B);
        mustBeNumber('θ', θ);
        // We assume that B really is just a bivector
        // by ignoring scalar and vector components.
        // Normally, B will have unit magnitude and B * B => -1.
        // However, we don't assume that is the case.
        // The effect will be a scaling of the angle.
        // A non unitary rotor, on the other hand, will scale the transformation.
        // We must also take into account the orientation of B.
        var β = B.b;
        /**
         * Sandwich operation means we need the half-angle.
         */
        var φ = θ / 2;
        /**
         * scalar part = cos(|B| * θ / 2)
         */
        this.a = cos$1(abs$1(β) * φ);
        this.x = 0;
        this.y = 0;
        /**
         * pseudo part = -unit(B) * sin(|B| * θ / 2)
         */
        this.b = -sin$1(β * φ);
        return this;
    };
    /**
     * this ⟼ scp(this, m)
     */
    Geometric2.prototype.scp = function (m) {
        return this.scp2(this, m);
    };
    /**
     * this ⟼ scp(a, b)
     */
    Geometric2.prototype.scp2 = function (a, b) {
        this.a = scpE2(a.a, a.x, a.y, a.b, b.a, b.x, b.y, b.b, 0);
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    };
    /**
     * this ⟼ this * α
     */
    Geometric2.prototype.scale = function (α) {
        mustBeNumber('α', α);
        this.a *= α;
        this.x *= α;
        this.y *= α;
        this.b *= α;
        return this;
    };
    /**
     *
     */
    Geometric2.prototype.stress = function (σ) {
        mustBeObject('σ', σ);
        throw new Error(notSupported('stress').message);
    };
    /**
     * this ⟼ a * b = a · b + a ^ b
     *
     * Sets this Geometric2 to the geometric product, a * b, of the vector arguments.
     */
    Geometric2.prototype.versor = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var bx = b.x;
        var by = b.y;
        this.a = dotVectorE2(a, b);
        this.x = 0;
        this.y = 0;
        this.b = wedgeXY(ax, ay, 0, bx, by, 0);
        return this;
    };
    /**
     * this ⟼ this * ~this
     */
    Geometric2.prototype.squaredNorm = function () {
        this.a = this.magnitude();
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    };
    /**
     * @returns the square of the <code>magnitude</code> of <code>this</code>.
     */
    Geometric2.prototype.quaditude = function () {
        var a = this.a;
        var x = this.x;
        var y = this.y;
        var b = this.b;
        return a * a + x * x + y * y + b * b;
    };
    /**
     * this ⟼ this - M * α
     */
    Geometric2.prototype.sub = function (M, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('M', M);
        mustBeNumber('α', α);
        this.a -= M.a * α;
        this.x -= M.x * α;
        this.y -= M.y * α;
        this.b -= M.b * α;
        return this;
    };
    /**
     * this ⟼ a - b
     */
    Geometric2.prototype.sub2 = function (a, b) {
        mustBeObject('a', a);
        mustBeObject('b', b);
        this.a = a.a - b.a;
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.b = a.b - b.b;
        return this;
    };
    /**
     *
     */
    Geometric2.prototype.toArray = function () {
        return coordinates$4(this);
    };
    /**
     * Returns a representation of this multivector in exponential notation.
     */
    Geometric2.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates$4(this), coordToString, Geometric2.BASIS_LABELS);
    };
    /**
     * Returns a representation of this multivector in fixed-point notation.
     */
    Geometric2.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates$4(this), coordToString, Geometric2.BASIS_LABELS);
    };
    /**
     * Returns a representation of this multivector in exponential or fixed-point notation.
     */
    Geometric2.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates$4(this), coordToString, Geometric2.BASIS_LABELS);
    };
    /**
     * Returns a representation of this multivector.
     */
    Geometric2.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return stringFromCoordinates(coordinates$4(this), coordToString, Geometric2.BASIS_LABELS);
    };
    /**
     * Extraction of grade <em>i</em>.
     *
     * If this multivector is mutable (unlocked) then it is set to the result.
     *
     * @param i The index of the grade to be extracted.
     */
    Geometric2.prototype.grade = function (i) {
        if (this.isLocked()) {
            return lock(this.clone().grade(i));
        }
        mustBeInteger('i', i);
        switch (i) {
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
    /**
     * Sets this multivector to the identity element for addition, 0.
     *
     * this ⟼ 0
     */
    Geometric2.prototype.zero = function () {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    };
    /**
     * Implements this + rhs as addition.
     * The returned value is locked.
     */
    Geometric2.prototype.__add__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).add(rhs));
        }
        else if (typeof rhs === 'number') {
            // Addition commutes, but addScalar might be useful.
            return lock(Geometric2.scalar(rhs).add(this));
        }
        else {
            var rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
                // rhs is a copy and addition commutes.
                return lock(rhsCopy.add(this));
            }
            else {
                return void 0;
            }
        }
    };
    /**
     *
     */
    Geometric2.prototype.__div__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).div(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).divByScalar(rhs));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__rdiv__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).div(this));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__mul__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).mul(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).scale(rhs));
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
     *
     */
    Geometric2.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.copy(this).scale(lhs));
        }
        else {
            var lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
                // lhs is a copy, so we can mutate it, and use it on the left.
                return lock(lhsCopy.mul(this));
            }
            else {
                return void 0;
            }
        }
    };
    /**
     *
     */
    Geometric2.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).add(this));
        }
        else {
            var lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
                // lhs is a copy, so we can mutate it.
                return lock(lhsCopy.add(this));
            }
            else {
                return void 0;
            }
        }
    };
    /**
     *
     */
    Geometric2.prototype.__sub__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).sub(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.scalar(-rhs).add(this));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__wedge__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).ext(rhs));
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is simply scalar multiplication.
            return lock(Geometric2.copy(this).scale(rhs));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__rwedge__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).ext(this));
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is simply scalar multiplication, and commutes.
            return lock(Geometric2.copy(this).scale(lhs));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__lshift__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).lco(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__rlshift__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__rshift__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).rco(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__rrshift__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__vbar__ = function (rhs) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).scp(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__rvbar__ = function (lhs) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.prototype.__bang__ = function () {
        return lock(Geometric2.copy(this).inv());
    };
    /**
     *
     */
    Geometric2.prototype.__tilde__ = function () {
        return lock(Geometric2.copy(this).rev());
    };
    /**
     *
     */
    Geometric2.prototype.__pos__ = function () {
        // It's important that we make a copy whenever using operators.
        return lock(Geometric2.copy(this));
    };
    /**
     *
     */
    Geometric2.prototype.__neg__ = function () {
        return lock(Geometric2.copy(this).neg());
    };
    /**
     *
     */
    Geometric2.copy = function (M) {
        return new Geometric2([M.a, M.x, M.y, M.b]);
    };
    /**
     * Constructs the basis vector e1.
     * Locking the vector prevents mutation.
     */
    Geometric2.e1 = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric2.E1 : Geometric2.vector(1, 0);
    };
    /**
     * Constructs the basis vector e2.
     * Locking the vector prevents mutation.
     */
    Geometric2.e2 = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric2.E2 : Geometric2.vector(0, 1);
    };
    /**
     *
     */
    Geometric2.fromCartesian = function (a, x, y, b) {
        return new Geometric2([a, x, y, b]);
    };
    Geometric2.fromBivector = function (B) {
        return Geometric2.fromCartesian(0, 0, 0, B.b);
    };
    /**
     *
     */
    Geometric2.fromSpinor = function (spinor) {
        return new Geometric2([spinor.a, 0, 0, spinor.b]);
    };
    /**
     *
     */
    Geometric2.fromVector = function (v) {
        if (isDefined(v)) {
            return new Geometric2([0, v.x, v.y, 0]);
        }
        else {
            // We could also return an undefined value here!
            return void 0;
        }
    };
    /**
     *
     */
    Geometric2.I = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric2.PSEUDO : Geometric2.pseudo(1);
    };
    /**
     * A + α * (B - A)
     */
    Geometric2.lerp = function (A, B, α) {
        return Geometric2.copy(A).lerp(B, α);
        // return Geometric2.copy(B).sub(A).scale(α).add(A)
    };
    /**
     *
     */
    Geometric2.one = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric2.ONE : Geometric2.scalar(1);
    };
    /**
     * Computes the rotor that rotates vector a to vector b.
     */
    Geometric2.rotorFromDirections = function (a, b) {
        return new Geometric2().rotorFromDirections(a, b);
    };
    /**
     *
     */
    Geometric2.pseudo = function (β) {
        return Geometric2.fromCartesian(0, 0, 0, β);
    };
    /**
     *
     */
    Geometric2.scalar = function (α) {
        return Geometric2.fromCartesian(α, 0, 0, 0);
    };
    /**
     *
     */
    Geometric2.vector = function (x, y) {
        return Geometric2.fromCartesian(0, x, y, 0);
    };
    /**
     *
     */
    Geometric2.zero = function (lock$$1) {
        if (lock$$1 === void 0) { lock$$1 = false; }
        return lock$$1 ? Geometric2.ZERO : new Geometric2(zero$1());
    };
    /**
     *
     */
    Geometric2.BASIS_LABELS = STANDARD_LABELS;
    /**
     *
     */
    Geometric2.BASIS_LABELS_COMPASS = COMPASS_LABELS;
    /**
     *
     */
    Geometric2.BASIS_LABELS_GEOMETRIC = ARROW_LABELS;
    /**
     *
     */
    Geometric2.BASIS_LABELS_STANDARD = STANDARD_LABELS;
    /**
     * The basis element corresponding to the vector `x` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric2.E1 = new Geometric2(vector$1(1, 0));
    /**
     * The basis element corresponding to the vector `y` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric2.E2 = new Geometric2(vector$1(0, 1));
    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    Geometric2.PSEUDO = new Geometric2(pseudo$1(1));
    /**
     * The identity element for multiplication, `1`.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric2.ONE = new Geometric2(scalar$1(1));
    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    Geometric2.ZERO = new Geometric2(scalar$1(0));
    return Geometric2;
}());
applyMixins(Geometric2, [LockableMixin]);
Geometric2.E1.lock();
Geometric2.E2.lock();
Geometric2.ONE.lock();
Geometric2.PSEUDO.lock();
Geometric2.ZERO.lock();

/**
 *
 */
var ModelE2 = (function () {
    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE2 implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelE2 at the origin and with unity attitude.
     * </p>
     */
    function ModelE2() {
        this._position = new Geometric2().zero();
        this._attitude = new Geometric2().zero().addScalar(1);
        this._position.modified = true;
        this._attitude.modified = true;
    }
    Object.defineProperty(ModelE2.prototype, "R", {
        /**
         * <p>
         * The <em>attitude</em>, a unitary spinor.
         * </p>
         */
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
        /**
         * <p>
         * The <em>position</em>, a vector.
         * The vector <b>X</b> designates the center of mass of the body (Physics).
         * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
         * </p>
         */
        get: function () {
            return this._position;
        },
        set: function (position) {
            this._position.copy(position);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The name of the property that designates the attitude.
     */
    ModelE2.PROP_ATTITUDE = 'R';
    /**
     * The name of the property that designates the position.
     */
    ModelE2.PROP_POSITION = 'X';
    return ModelE2;
}());

function isVectorN(values) {
    return Array.isArray(values);
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
/**
 * A convenience class for implementing the Attribute interface.
 */
var DrawAttribute = (function () {
    function DrawAttribute(values, size, type) {
        // mustBeArray('values', values)
        // mustBeInteger('size', size)
        this.values = checkValues(values);
        this.size = checkSize(size, values);
        this.type = type;
    }
    return DrawAttribute;
}());

var context = function () { return "DrawPrimitive constructor"; };
/**
 * A convenience class for implementing the Primitive interface.
 */
var DrawPrimitive = (function () {
    function DrawPrimitive(mode, indices, attributes) {
        this.attributes = {};
        this.mode = mustBeInteger('mode', mode, context);
        this.indices = mustBeArray('indices', indices, context);
        this.attributes = mustBeObject('attributes', attributes, context);
    }
    return DrawPrimitive;
}());

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
            // Make this triangle degenerate.
            dest.push(lastIndex);
            // Join to the next triangle strip.
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
/**
 * reduces multiple TRIANGLE_STRIP Primitives to a single TRAINGLE_STRIP Primitive.
 */
function reduce(primitives) {
    for (var i = 0; i < primitives.length; i++) {
        var primitive = primitives[i];
        if (primitive.mode !== exports.BeginMode.TRIANGLE_STRIP) {
            throw new Error("mode (" + primitive.mode + ") must be TRIANGLE_STRIP");
        }
    }
    return primitives.reduce(function (previous, current) {
        var indices = [];
        copyIndices(previous, indices, 0);
        joinIndices(previous, current, indices);
        copyIndices(current, indices, max(previous.indices) + 1);
        var attributes = {};
        copyAttributes(previous, attributes);
        copyAttributes(current, attributes);
        return {
            mode: exports.BeginMode.TRIANGLE_STRIP,
            indices: indices,
            attributes: attributes
        };
    });
}

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
/**
 * The data for a vertex in a normalized and uncompressed format that is easy to manipulate.
 */
var Vertex = (function () {
    /**
     * @param numCoordinates The number of coordinates (dimensionality).
     */
    function Vertex(numCoordinates) {
        /**
         * The attribute data for this vertex.
         */
        this.attributes = {};
        mustBeInteger('numCoordinates', numCoordinates);
        mustBeGE('numCoordinates', numCoordinates, 0);
        var data = [];
        for (var i = 0; i < numCoordinates; i++) {
            data.push(0);
        }
        this.coords = new Coords(data, false, numCoordinates);
    }
    /**
     * @returns A string representation of this vertex.
     */
    Vertex.prototype.toString = function () {
        return stringifyVertex(this);
    };
    return Vertex;
}());

var ShapeBuilder = (function () {
    /**
     *
     */
    function ShapeBuilder() {
        /**
         * The scaling to apply to the geometry in the initial configuration.
         * This has a slightly strange sounding name because it involves a
         * reference frame specific transformation.
         *
         * This may be replaced by a Matrix3 in future.
         */
        this.stress = Vector3.vector(1, 1, 1);
        /**
         * The rotor to apply to the geometry (after scale has been applied).
         */
        this.tilt = Geometric3.one(false);
        /**
         * The translation to apply to the geometry (after tilt has been applied).
         */
        this.offset = Vector3.zero();
        /**
         *
         */
        this.transforms = [];
        /**
         * Determines whether to include normals in the geometry.
         */
        this.useNormal = true;
        /**
         * Determines whether to include positions in the geometry.
         */
        this.usePosition = true;
        /**
         * Determines whether to include texture coordinates in the geometry.
         */
        this.useTextureCoord = false;
        // Do nothing.
    }
    ShapeBuilder.prototype.applyTransforms = function (vertex, i, j, iLength, jLength) {
        var tLen = this.transforms.length;
        for (var t = 0; t < tLen; t++) {
            this.transforms[t].exec(vertex, i, j, iLength, jLength);
        }
    };
    return ShapeBuilder;
}());

/**
 *
 */
var AxialShapeBuilder = (function (_super) {
    __extends(AxialShapeBuilder, _super);
    /**
     *
     */
    function AxialShapeBuilder() {
        var _this = _super.call(this) || this;
        /**
         * The sliceAngle is the angle from the cutLine to the end of the slice.
         * A positive slice angle represents a counter-clockwise rotation around
         * the symmetry axis direction.
         */
        _this.sliceAngle = 2 * Math.PI;
        return _this;
    }
    return AxialShapeBuilder;
}(ShapeBuilder));

function quadSpinorE2(s) {
    if (isDefined(s)) {
        var α = s.a;
        var β = s.b;
        if (isNumber(α) && isNumber(β)) {
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

// Symbolic constants for the coordinate indices into the coords array.
var COORD_SCALAR$3 = 1;
var COORD_PSEUDO$2 = 0;
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates$5(m) {
    return [m.b, m.a];
}
function one() {
    var coords = [0, 0];
    coords[COORD_SCALAR$3] = 1;
    coords[COORD_PSEUDO$2] = 0;
    return coords;
}
var abs$2 = Math.abs;
var atan2$1 = Math.atan2;
var log$2 = Math.log;
var cos$2 = Math.cos;
var sin$2 = Math.sin;
var sqrt$6 = Math.sqrt;
/**
 *
 */
var Spinor2 = (function () {
    /**
     *
     */
    function Spinor2(coords, modified) {
        if (coords === void 0) { coords = one(); }
        if (modified === void 0) { modified = false; }
        this.coords_ = coords;
        this.modified_ = modified;
    }
    Object.defineProperty(Spinor2.prototype, "length", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor2.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Spinor2.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    Object.defineProperty(Spinor2.prototype, "xy", {
        /**
         * The bivector part of this spinor as a number.
         */
        get: function () {
            return this.coords_[COORD_PSEUDO$2];
        },
        set: function (xy) {
            if (this.isLocked()) {
                throw new TargetLockedError('xy');
            }
            mustBeNumber('xy', xy);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_PSEUDO$2] !== xy;
            coords[COORD_PSEUDO$2] = xy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor2.prototype, "a", {
        /**
         * The scalar part of this spinor as a number.
         */
        get: function () {
            return this.coords_[COORD_SCALAR$3];
        },
        set: function (α) {
            if (this.isLocked()) {
                throw new TargetLockedError('a');
            }
            mustBeNumber('α', α);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_SCALAR$3] !== α;
            coords[COORD_SCALAR$3] = α;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinor2.prototype, "b", {
        /**
         * The pseudoscalar part of this spinor as a number.
         */
        get: function () {
            return this.coords_[COORD_PSEUDO$2];
        },
        set: function (b) {
            if (this.isLocked()) {
                throw new TargetLockedError('b');
            }
            mustBeNumber('b', b);
            var coords = this.coords_;
            this.modified_ = this.modified_ || coords[COORD_PSEUDO$2] !== b;
            coords[COORD_PSEUDO$2] = b;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * <code>this ⟼ this + α * spinor</code>
     *
     * @param spinor
     * @param α
     * @return this
     */
    Spinor2.prototype.add = function (spinor, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('spinor', spinor);
        mustBeNumber('α', α);
        this.xy += spinor.b * α;
        this.a += spinor.a * α;
        return this;
    };
    /**
     *
     * this ⟼ a + b
     *
     * @param a
     * @param b
     * @return this
     */
    Spinor2.prototype.add2 = function (a, b) {
        this.a = a.a + b.a;
        this.xy = a.b + b.b;
        return this;
    };
    /**
     * Intentionally undocumented.
     */
    Spinor2.prototype.addPseudo = function (β) {
        mustBeNumber('β', β);
        return this;
    };
    /**
     * this ⟼ this + α
     *
     * @param α
     * @return this
     */
    Spinor2.prototype.addScalar = function (α) {
        mustBeNumber('α', α);
        this.a += α;
        return this;
    };
    /**
     * arg(A) = grade(log(A), 2)
     */
    Spinor2.prototype.arg = function () {
        return this.log().grade(2);
    };
    /**
     *
     */
    Spinor2.prototype.approx = function (n) {
        approx(this.coords_, n);
        return this;
    };
    /**
     * @return A copy of this
     */
    Spinor2.prototype.clone = function () {
        var spinor = Spinor2.copy(this);
        spinor.modified_ = this.modified_;
        return spinor;
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    Spinor2.prototype.conj = function () {
        this.xy = -this.xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.copy = function (spinor) {
        mustBeObject('spinor', spinor);
        this.xy = mustBeNumber('spinor.b', spinor.b);
        this.a = mustBeNumber('spinor.a', spinor.a);
        return this;
    };
    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {Spinor2}
     * @chainable
     */
    Spinor2.prototype.copyScalar = function (α) {
        return this.zero().addScalar(α);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor2.prototype.copySpinor = function (spinor) {
        return this.copy(spinor);
    };
    /**
     * Intentionally undocumented.
     */
    Spinor2.prototype.copyVector = function (vector) {
        // The spinor has no vector components.
        return this.zero();
    };
    Spinor2.prototype.cos = function () {
        throw new Error("Spinor2.cos");
    };
    Spinor2.prototype.cosh = function () {
        throw new Error("Spinor2.cosh");
    };
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.div = function (s) {
        return this.div2(this, s);
    };
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.div2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.b;
        var b0 = b.a;
        var b1 = b.b;
        var quadB = quadSpinorE2(b);
        this.a = (a0 * b0 + a1 * b1) / quadB;
        this.xy = (a1 * b0 - a0 * b1) / quadB;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.divByScalar = function (α) {
        this.xy /= α;
        this.a /= α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     *
     * @method exp
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.exp = function () {
        var α = this.a;
        var β = this.b;
        var expA = Math.exp(α);
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        // FIXME: DRY
        var φ = sqrt$6(β * β);
        var s = expA * (φ !== 0 ? sin$2(φ) / φ : 1);
        this.a = expA * cos$2(φ);
        this.b = β * s;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.inv = function () {
        this.conj();
        this.divByScalar(this.quaditude());
        return this;
    };
    /**
     * @method isOne
     * @return {boolean}
     */
    Spinor2.prototype.isOne = function () {
        return this.a === 1 && this.b === 0;
    };
    /**
     * @method isZero
     * @return {boolean}
     */
    Spinor2.prototype.isZero = function () {
        return this.a === 0 && this.b === 0;
    };
    Spinor2.prototype.lco = function (rhs) {
        return this.lco2(this, rhs);
    };
    Spinor2.prototype.lco2 = function (a, b) {
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
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
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
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     * @method lerp2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.lerp2 = function (a, b, α) {
        this.sub2(b, a).scale(α).add(a);
        return this;
    };
    /**
     * this ⟼ log(this)
     *
     * @returns log(this)
     */
    Spinor2.prototype.log = function () {
        if (this.isLocked()) {
            return lock(this.clone().log());
        }
        else {
            // FIXME: This is wrong see Geometric2.
            var w = this.a;
            var z = this.xy;
            // FIXME: DRY
            var bb = z * z;
            var Vector2 = sqrt$6(bb);
            var R0 = abs$2(w);
            var R = sqrt$6(w * w + bb);
            this.a = log$2(R);
            var f = atan2$1(Vector2, R0) / Vector2;
            this.xy = z * f;
            return this;
        }
    };
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     * <p>
     * This method does not change this spinor.
     * </p>
     *
     * @method magnitude
     * @return {number}
     */
    Spinor2.prototype.magnitude = function () {
        return sqrt$6(this.quaditude());
    };
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param s {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.mul = function (s) {
        return this.mul2(this, s);
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.mul2 = function (a, b) {
        var a0 = a.a;
        var a1 = a.b;
        var b0 = b.a;
        var b1 = b.b;
        this.a = a0 * b0 - a1 * b1;
        this.xy = a0 * b1 + a1 * b0;
        return this;
    };
    /**
     * @method neg
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.neg = function () {
        this.a = -this.a;
        this.xy = -this.xy;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     * @method norm
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.norm = function () {
        var norm = this.magnitude();
        return this.zero().addScalar(norm);
    };
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.normalize = function () {
        var modulus = this.magnitude();
        this.xy = this.xy / modulus;
        this.a = this.a / modulus;
        return this;
    };
    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.one = function () {
        this.a = 1;
        this.xy = 0;
        return this;
    };
    Spinor2.prototype.pow = function () {
        throw new Error("Spinor2.pow");
    };
    /**
     * @returns The square of the magnitude.
     */
    Spinor2.prototype.quaditude = function () {
        return quadSpinorE2(this);
    };
    Spinor2.prototype.sin = function () {
        throw new Error("Spinor2.sin");
    };
    Spinor2.prototype.sinh = function () {
        throw new Error("Spinor2.sinh");
    };
    /**
     * <p>
     * <code>this ⟼ this * conj(this)</code>
     * </p>
     * @method quad
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.squaredNorm = function () {
        var squaredNorm = this.quaditude();
        return this.zero().addScalar(squaredNorm);
    };
    Spinor2.prototype.rco = function (rhs) {
        return this.rco2(this, rhs);
    };
    Spinor2.prototype.rco2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG2(a, b, this)
        return this;
    };
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.rev = function () {
        this.xy *= -1;
        return this;
    };
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     */
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
    /**
     * <p>
     * <code>this = ⟼ rotor * this * rev(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.rotate = function (rotor) {
        console.warn("Spinor2.rotate is not implemented");
        return this;
    };
    /**
     * <p>
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     * </p>
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {Spinor2} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    Spinor2.prototype.rotorFromDirections = function (a, b) {
        rotorFromDirectionsE2(a, b, this);
        return this;
    };
    /**
     *
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     *
     * @param B
     * @param θ
     * @returns <code>this</code>
     */
    Spinor2.prototype.rotorFromGeneratorAngle = function (B, θ) {
        var φ = θ / 2;
        var s = sin$2(φ);
        this.xy = -B.b * s;
        this.a = cos$2(φ);
        return this;
    };
    Spinor2.prototype.rotorFromVectorToVector = function (a, b) {
        rotorFromDirectionsE2(a, b, this);
        return this;
    };
    Spinor2.prototype.scp = function (rhs) {
        return this.scp2(this, rhs);
    };
    Spinor2.prototype.scp2 = function (a, b) {
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
     * @return {Spinor2} <code>this</code>
     */
    Spinor2.prototype.scale = function (α) {
        mustBeNumber('α', α);
        this.xy *= α;
        this.a *= α;
        return this;
    };
    Spinor2.prototype.stress = function (σ) {
        throw new Error(notSupported('stress').message);
    };
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     * @method sub
     * @param s {SpinorE2}
     * @param [α = 1] {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.sub = function (s, α) {
        if (α === void 0) { α = 1; }
        mustBeObject('s', s);
        mustBeNumber('α', α);
        this.xy -= s.b * α;
        this.a -= s.a * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    Spinor2.prototype.sub2 = function (a, b) {
        this.xy = a.b - b.b;
        this.a = a.a - b.a;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Spinor2 to the geometric product a * b of the vector arguments.
     *
     * @method versor
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Spinor2}
     */
    Spinor2.prototype.versor = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var bx = b.x;
        var by = b.y;
        this.a = dotVectorCartesianE2(ax, ay, bx, by);
        // TODO: Optimize because we aren't using z.
        this.xy = wedgeXY(ax, ay, 0, bx, by, 0);
        return this;
    };
    Spinor2.prototype.grade = function (i) {
        if (this.isLocked()) {
            return lock(this.clone().grade(i));
        }
        mustBeInteger('i', i);
        switch (i) {
            case 0: {
                this.xy = 0;
                break;
            }
            case 2: {
                this.a = 0;
                break;
            }
            default: {
                this.a = 0;
                this.xy = 0;
            }
        }
        return this;
    };
    /**
     *
     */
    Spinor2.prototype.toArray = function () {
        return coordinates$5(this);
    };
    Spinor2.prototype.toExponential = function (fractionDigits) {
        // FIXME: Do like others.
        return this.toString();
    };
    Spinor2.prototype.toFixed = function (fractionDigits) {
        // FIXME: Do like others.
        return this.toString();
    };
    Spinor2.prototype.toPrecision = function (precision) {
        // FIXME: Do like others.
        return this.toString();
    };
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    Spinor2.prototype.toString = function (radix) {
        return "Spinor2({β: " + this.xy + ", w: " + this.a + "})";
    };
    Spinor2.prototype.ext = function (rhs) {
        return this.ext2(this, rhs);
    };
    Spinor2.prototype.ext2 = function (a, b) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG2(a, b, this)
        return this;
    };
    /**
     * Sets this spinor to the identity element for addition, 0
     */
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
    /**
     * a + α * (b - a)
     */
    Spinor2.lerp = function (a, b, α) {
        return Spinor2.copy(a).lerp(b, α);
    };
    /**
     *
     */
    Spinor2.one = function () {
        return Spinor2.zero().addScalar(1);
    };
    /**
     * Computes the rotor that rotates vector a to vector b.
     */
    Spinor2.rotorFromDirections = function (a, b) {
        return new Spinor2().rotorFromDirections(a, b);
    };
    /**
     *
     */
    Spinor2.zero = function () {
        return new Spinor2([0, 0], false);
    };
    return Spinor2;
}());
applyMixins(Spinor2, [LockableMixin]);

/**
 * A `Transform` that calls the `approx` method on a `Vertex` attribute.
 */
var Approximation = (function () {
    /**
     * @param n The value that will be passed to the `approx` method.
     * @param names The names of the attributes that are affected.
     */
    function Approximation(n, names) {
        this.n = mustBeNumber('n', n);
        this.names = names;
    }
    Approximation.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v instanceof Coords) {
                v.approx(this.n);
            }
            else if (v instanceof Vector3) {
                v.approx(this.n);
            }
            else if (v instanceof Spinor3) {
                v.approx(this.n);
            }
            else if (v instanceof Vector2) {
                v.approx(this.n);
            }
            else if (v instanceof Spinor2) {
                v.approx(this.n);
            }
            else if (v instanceof Geometric2) {
                v.approx(this.n);
            }
            else if (v instanceof Geometric3) {
                v.approx(this.n);
            }
            else {
                throw new Error("Expecting " + aName + " to be a VectorN");
            }
        }
    };
    return Approximation;
}());

var Direction = (function () {
    function Direction(sourceName) {
        this.sourceName = mustBeString('sourceName', sourceName);
    }
    Direction.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var v = vertex.attributes[this.sourceName];
        if (v) {
            if (v instanceof Vector3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Spinor3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Vector2) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Spinor2) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Geometric3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Geometric2) {
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

/**
 * Applies a duality transformation to the specified attributes of a vertex, creating a new attribute.
 * The convention used is pre-multiplication by the pseudoscalar.
 */
var Duality = (function () {
    function Duality(sourceName, outputName, changeSign, removeSource) {
        this.sourceName = mustBeString('sourceName', sourceName);
        this.outputName = mustBeString('outputName', outputName);
        this.changeSign = mustBeBoolean('changeSign', changeSign);
        this.removeSource = mustBeBoolean('removeSource', removeSource);
    }
    Duality.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var v = vertex.attributes[this.sourceName];
        if (v) {
            if (v instanceof Vector3) {
                var spinor = Spinor3.dual(v, this.changeSign);
                vertex.attributes[this.outputName] = spinor;
            }
            else if (v instanceof Spinor3) {
                var vector = Vector3.dual(v, this.changeSign);
                vertex.attributes[this.outputName] = vector;
            }
            else if (v instanceof Vector2) {
                throw new Error(notImplemented('dual(vector: Vector2)').message);
            }
            else if (v instanceof Spinor2) {
                throw new Error(notImplemented('dual(spinor: Spinor2)').message);
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

/**
 * Computes the number of posts to build a fence from the number of segments.
 */
function numPostsForFence(segmentCount, closed) {
    mustBeInteger('segmentCount', segmentCount);
    mustBeGE('segmentCount', segmentCount, 0);
    mustBeBoolean('closed', closed);
    return closed ? segmentCount : segmentCount + 1;
}

/**
 * Computes the number of vertices required to construct a grid.
 */
function numVerticesForGrid(uSegments, vSegments) {
    mustBeInteger('uSegments', uSegments);
    mustBeInteger('vSegments', vSegments);
    return (uSegments + 1) * (vSegments + 1);
}

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
function dataFromVectorN(source) {
    if (source instanceof Geometric3) {
        var g3 = source;
        return [g3.x, g3.y, g3.z];
    }
    else if (source instanceof Geometric2) {
        var g2 = source;
        return [g2.x, g2.y];
    }
    else if (source instanceof Vector3) {
        var v3 = source;
        return [v3.x, v3.y, v3.z];
    }
    else if (source instanceof Vector2) {
        var v2 = source;
        return [v2.x, v2.y];
    }
    else {
        // console.warn("dataFromVectorN(source: VectorN<number>): number[], source.length => " + source.length)
        return source.toArray();
    }
}

function checkSize$1(length) {
    if (length === 1) {
        return 1;
    }
    else if (length === 2) {
        return 2;
    }
    else if (length === 3) {
        return 3;
    }
    else if (length === 4) {
        return 4;
    }
    else {
        throw new Error("length must be 1, 2, 3, or 4");
    }
}
/**
 * This helper function converts Vertex (VectorN) attributes into the Primitive (number[]) format.
 * There is some magic in the conversion of various types (Geometric2, Geometric3, Vector2, Vector3)
 * to number[], but the basic rule is that the vector grade is extracted and used in a way that is
 * consistent with the linear dimension (2,3), so there should be no surprises.
 */
function attributes(elements, vertices) {
    mustBeArray('elements', elements);
    var attribs = {};
    var iLen = vertices.length;
    for (var i = 0; i < iLen; i++) {
        var vertex = vertices[i];
        var names = Object.keys(vertex.attributes);
        var jLen = names.length;
        for (var j = 0; j < jLen; j++) {
            var name_1 = names[j];
            var data = dataFromVectorN(vertex.attributes[name_1]);
            var size = checkSize$1(data.length);
            var attrib = attribs[name_1];
            if (!attrib) {
                attrib = attribs[name_1] = new DrawAttribute([], size, exports.DataType.FLOAT);
            }
            for (var k = 0; k < size; k++) {
                attrib.values.push(data[k]);
            }
        }
    }
    return attribs;
}
/**
 * The VertexPrimitive class provides the preferred method for creating geometries.
 * Classes derived from VertexPrimitive create vertices and pathways through them
 * with indices such as TRIANGLE_STRIP. (Reversing this procedure from an arbitrary
 * collection of simplices is an NP problem). The resulting topology can then be
 * modified by a parameterized function either prior to buffering or in a shader.
 * VertexPrimitive uses the Vertex structure which is based on VectorN for ease of mesh
 * generation and transformation. Topolgy provides a toPrimitive method which results
 * in a more compact representation based upon number[]. An even more compact
 * representation is VertexArrays, which interleaves the vertex.
 */
var VertexPrimitive = (function () {
    /**
     * Constructs a VertexPrimitive and initializes the vertices property with the required number of vertices.
     *
     * @param mode
     * @param numVertices
     * @param numCoordinates The number of coordinates required to label each vertex.
     */
    function VertexPrimitive(mode, numVertices, numCoordinates) {
        this.mode = mustBeInteger('mode', mode);
        mustBeInteger('numVertices', numVertices);
        mustBeGE('numVertices', numVertices, 0);
        mustBeInteger('numCoordinates', numCoordinates);
        mustBeGE('numCoordinates', numCoordinates, 0);
        this.vertices = [];
        for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex(numCoordinates));
        }
    }
    VertexPrimitive.prototype.vertexTransform = function (transform) {
        mustBeNonNullObject('transform', transform);
        // Derived classes must implement in order to supply correct ranges.
        throw new Error(notSupported('vertexTransform').message);
    };
    /**
     *
     */
    VertexPrimitive.prototype.toPrimitive = function () {
        // Derived classes are responsible for allocating the elements array.
        var context = function () { return 'toPrimitive'; };
        mustBeArray('elements', this.elements, context);
        return new DrawPrimitive(this.mode, this.elements, attributes(this.elements, this.vertices));
    };
    return VertexPrimitive;
}());

/**
 * Used for creating a VertexPrimitive for a surface.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 */
var GridPrimitive = (function (_super) {
    __extends(GridPrimitive, _super);
    function GridPrimitive(mode, uSegments, vSegments) {
        var _this = _super.call(this, mode, numVerticesForGrid(uSegments, vSegments), 2) || this;
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
        set: function (uSegments) {
            mustBeInteger('uSegments', uSegments);
            throw new Error(readOnly('uSegments').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "uLength", {
        /**
         * uLength = uSegments + 1
         */
        get: function () {
            return numPostsForFence(this._uSegments, this._uClosed);
        },
        set: function (uLength) {
            mustBeInteger('uLength', uLength);
            throw new Error(readOnly('uLength').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "vSegments", {
        get: function () {
            return this._vSegments;
        },
        set: function (vSegments) {
            mustBeInteger('vSegments', vSegments);
            throw new Error(readOnly('vSegments').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "vLength", {
        /**
         * vLength = vSegments + 1
         */
        get: function () {
            return numPostsForFence(this._vSegments, this._vClosed);
        },
        set: function (vLength) {
            mustBeInteger('vLength', vLength);
            throw new Error(readOnly('vLength').message);
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
    /**
     * Derived classes must override.
     */
    GridPrimitive.prototype.vertex = function (i, j) {
        mustBeInteger('i', i);
        mustBeInteger('j', j);
        throw new Error(notSupported('vertex').message);
    };
    return GridPrimitive;
}(VertexPrimitive));

function triangleStripForGrid(uSegments, vSegments, elements) {
    // Make sure that we have somewhere valid to store the result.
    elements = isDefined(elements) ? mustBeArray('elements', elements) : [];
    var uLength = numPostsForFence(uSegments, false /* open */);
    var lastVertex = uSegments + uLength * vSegments;
    /**
     * The number of elements needed if we executed a strip per row.
     * Remark Notice the asymmetry. Could be a performance impact.
     */
    var eSimple = 2 * uLength * vSegments;
    /**
     * Index for TRIANGLE_STRIP array.
     */
    var j = 0;
    // FIXME: Loop 0 <= i < eSimple (Edsger W. Dijksta)
    // For this algorithm, imagine a little vertical loop containing two dots.
    // The uppermost dot we shall call the `top` and the lowermost the `bottom`.
    // Advancing i by two each time corresponds to advancing this loop one place to the right.
    for (var i = 1; i <= eSimple; i += 2) {
        // const k = (i - 1) / 2 // etc
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
 * Used for creating TRIANGLE_STRIP primitives.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 */
var GridTriangleStrip = (function (_super) {
    __extends(GridTriangleStrip, _super);
    /**
     * @param uSegments
     * @param vSegments
     */
    function GridTriangleStrip(uSegments, vSegments) {
        var _this = _super.call(this, exports.BeginMode.TRIANGLE_STRIP, uSegments, vSegments) || this;
        _this.elements = triangleStripForGrid(uSegments, vSegments);
        return _this;
    }
    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     * @param vIndex An integer. 0 <= vIndex < vLength
     */
    GridTriangleStrip.prototype.vertex = function (uIndex, vIndex) {
        mustBeInteger('uIndex', uIndex);
        mustBeInteger('vIndex', vIndex);
        // I'm not sure why the indexing here reverses the second index direction.
        return this.vertices[(this.vSegments - vIndex) * this.uLength + uIndex];
    };
    return GridTriangleStrip;
}(GridPrimitive));

function coneNormal(ρ, h, out) {
    out.copy(ρ);
    var ρ2 = out.squaredNorm();
    out.add(h, ρ2).divByScalar(Math.sqrt(ρ2) * Math.sqrt(1 + ρ2));
}
/**
 *
 */
var ConeTransform = (function () {
    /**
     * @param clockwise
     * @param sliceAngle
     * @param aPosition The name to use for the position attribute.
     * @param aTangent The name to use for the tangent plane attribute.
     */
    function ConeTransform(clockwise, sliceAngle, aPosition, aTangent) {
        /**
         * The vector from the base of the cone to the apex.
         * The default is e2.
         */
        this.h = Vector3.vector(0, 1, 0);
        /**
         * The radius vector and the initial direction for a slice.
         * The default is e3.
         */
        this.a = Vector3.vector(0, 0, 1);
        /**
         * The perpendicular radius vector.
         * We compute this so that the grid wraps around the cone with
         * u increasing with θ and v increasing toward the apex of the cone.
         * The default is e1.
         */
        this.b = Vector3.vector(1, 0, 0);
        this.clockwise = mustBeBoolean('clockwise', clockwise);
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        this.aPosition = mustBeString('aPosition', aPosition);
        this.aTangent = mustBeString('aTangent', aTangent);
    }
    ConeTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
        // Let e be the unit vector in the symmetry axis of the cone.
        // Let ρ be a point on the base of the cone.
        // Then the normal to the cone n is given by
        //
        // n = (ρ * ρ * e + ρ) / (|ρ| * sqrt(1 + ρ * ρ))
        //
        // This formula is derived by finding the vector in the plane of e and ρ
        // that is normal to the vector (e - ρ) and normalized to unity.
        // The formula always gives a formula that is well defined provided |ρ| is non-zero.
        //
        // In order to account for the stress and tilt operations, compute the normal using
        // the transformed ρ and h
        var uSegments = iLength - 1;
        var u = i / uSegments;
        var vSegments = jLength - 1;
        var v = j / vSegments;
        var sign = this.clockwise ? -1 : +1;
        var θ = sign * this.sliceAngle * u;
        var cosθ = Math.cos(θ);
        var sinθ = Math.sin(θ);
        /**
         * Point on the base of the cone.
         */
        var ρ = new Vector3().add(this.a, cosθ).add(this.b, sinθ);
        /**
         * Point on the standard cone at uIndex, vIndex.
         */
        var x = Vector3.lerp(ρ, this.h, v);
        vertex.attributes[this.aPosition] = x;
        var normal = Vector3.zero();
        coneNormal(ρ, this.h, normal);
        vertex.attributes[this.aTangent] = Spinor3.dual(normal, false);
    };
    return ConeTransform;
}());

var Rotation = (function () {
    function Rotation(R, names) {
        this.R = Spinor3.copy(mustBeObject('R', R));
        this.names = names;
    }
    Rotation.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v.length === 3) {
                var vector = Vector3.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                vector.rotate(this.R);
                vertex.attributes[aName] = vector;
            }
            else if (v.length === 4) {
                var spinor = Spinor3.spinor(v.getComponent(0), v.getComponent(1), v.getComponent(2), v.getComponent(3));
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

var Scaling = (function () {
    function Scaling(stress, names) {
        this.stress = Vector3.copy(mustBeObject('stress', stress));
        this.names = mustBeArray('names', names);
    }
    Scaling.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v) {
                if (v.length === 3) {
                    var vector = Vector3.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                    vector.stress(this.stress);
                    vertex.attributes[aName] = vector;
                }
                else if (v.length === 4) {
                    var spinor = Spinor3.spinor(v.getComponent(0), v.getComponent(1), v.getComponent(2), v.getComponent(3));
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

/**
 * Applies a translation to the specified attributes of a vertex.
 */
var Translation = (function () {
    function Translation(s, names) {
        this.s = Vector3.copy(mustBeObject('s', s));
        this.names = names;
    }
    Translation.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v.length === 3) {
                var vector = Vector3.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
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

/**
 * Applies coordinates to a surface.
 */
var CoordsTransform2D = (function () {
    function CoordsTransform2D(flipU, flipV, exchangeUV) {
        this.flipU = mustBeBoolean('flipU', flipU);
        this.flipV = mustBeBoolean('flipV', flipV);
        this.exchageUV = mustBeBoolean('exchangeUV', exchangeUV);
    }
    /**
     * @method exec
     * @param vertex {Vertex}
     * @param i {number}
     * @param j {number}
     * @param iLength {number}
     * @param jLength {number}
     */
    CoordsTransform2D.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var u = i / (iLength - 1);
        var v = j / (jLength - 1);
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector2([u, v]);
    };
    return CoordsTransform2D;
}());

/**
 *
 */
var ConicalShellBuilder = (function (_super) {
    __extends(ConicalShellBuilder, _super);
    function ConicalShellBuilder() {
        var _this = _super.call(this) || this;
        /**
         *
         */
        _this.radialSegments = 1;
        /**
         *
         */
        _this.thetaSegments = 32;
        _this.height = Vector3.vector(0, 1, 0);
        _this.cutLine = Vector3.vector(0, 0, 1);
        _this.clockwise = true;
        return _this;
    }
    /**
     *
     */
    ConicalShellBuilder.prototype.toPrimitive = function () {
        // Define local constants so that names in shader programs will reflect the current program symbols.
        var aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION;
        var aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT;
        var aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL;
        var coneTransform = new ConeTransform(this.clockwise, this.sliceAngle, aPosition, aTangent);
        coneTransform.h.copy(this.height);
        coneTransform.a.copy(this.cutLine);
        coneTransform.b.copy(this.height).normalize().cross(this.cutLine);
        this.transforms.push(coneTransform);
        this.transforms.push(new Scaling(this.stress, [aPosition, aTangent]));
        this.transforms.push(new Rotation(this.tilt, [aPosition, aTangent]));
        this.transforms.push(new Translation(this.offset, [aPosition]));
        // Use a duality transformation with a sign change to convert the tangent planes to vectors.
        this.transforms.push(new Duality(aTangent, aNormal, true, true));
        // Normalize the normal vectors.
        this.transforms.push(new Direction(aNormal));
        // Discard insignificant coordinates.
        this.transforms.push(new Approximation(9, [aPosition, aNormal]));
        if (this.useTextureCoord) {
            this.transforms.push(new CoordsTransform2D(false, false, false));
        }
        var grid = new GridTriangleStrip(this.thetaSegments, this.radialSegments);
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
}(AxialShapeBuilder));

/**
 *
 */
var CylinderTransform = (function () {
    /**
     * @param sliceAngle
     * @param aPosition The name to use for the position attribute.
     * @param aTangent The name to use for the tangent plane attribute.
     */
    function CylinderTransform(height, cutLine, clockwise, sliceAngle, orientation, aPosition, aTangent) {
        this.height = Vector3.copy(height);
        this.cutLine = Vector3.copy(cutLine);
        this.generator = Spinor3.dual(this.height.clone().normalize(), clockwise);
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        this.orientation = mustBeNumber('orientation', orientation);
        this.aPosition = mustBeString('aPosition', aPosition);
        this.aTangent = mustBeString('aTangent', aTangent);
    }
    CylinderTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var uSegments = iLength - 1;
        var u = i / uSegments;
        var vSegments = jLength - 1;
        var v = j / vSegments;
        var rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp();
        /**
         * Point on the wall of the cylinder, initially with no vertical component.
         */
        var ρ = Vector3.copy(this.cutLine).rotate(rotor);
        vertex.attributes[this.aPosition] = ρ.clone().add(this.height, v);
        vertex.attributes[this.aTangent] = Spinor3.dual(ρ, false).scale(this.orientation);
    };
    return CylinderTransform;
}());

/**
 * This implementation only builds the walls of the cylinder (by wrapping a grid)
 */
var CylindricalShellBuilder = (function (_super) {
    __extends(CylindricalShellBuilder, _super);
    function CylindricalShellBuilder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.radialSegments = 1;
        _this.thetaSegments = 32;
        /**
         * The axis of symmetry and the height.
         */
        _this.height = Vector3.vector(0, 1, 0);
        /**
         * The initial direction and the radius vector.
         */
        _this.cutLine = Vector3.vector(0, 0, 1);
        _this.clockwise = true;
        _this.convex = true;
        return _this;
    }
    /**
     *
     */
    CylindricalShellBuilder.prototype.toPrimitive = function () {
        // Define local constants so that names in shader programs will reflect the current program symbols.
        var aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION;
        var aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT;
        var aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL;
        var orientation = this.convex ? +1 : -1;
        this.transforms.push(new CylinderTransform(this.height, this.cutLine, this.clockwise, this.sliceAngle, orientation, aPosition, aTangent));
        this.transforms.push(new Scaling(this.stress, [aPosition, aTangent]));
        this.transforms.push(new Rotation(this.tilt, [aPosition, aTangent]));
        this.transforms.push(new Translation(this.offset, [aPosition]));
        // Use a duality transformation with a sign change to convert the tangent planes to vectors.
        this.transforms.push(new Duality(aTangent, aNormal, true, true));
        // Normalize the normal vectors.
        this.transforms.push(new Direction(aNormal));
        // Discard insignificant coordinates.
        this.transforms.push(new Approximation(9, [aPosition, aNormal]));
        if (this.useTextureCoord) {
            this.transforms.push(new CoordsTransform2D(false, false, false));
        }
        var grid = new GridTriangleStrip(this.thetaSegments, this.radialSegments);
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
}(AxialShapeBuilder));

var RingTransform = (function () {
    /**
     * @param e The axis normal to the plane of the ring.
     * @param cutLine
     * @param clockwise
     * @param a The outer radius.
     * @param b The inner radius.
     * @param aPosition The name to use for the position attribute.
     */
    function RingTransform(e, cutLine, clockwise, a, b, sliceAngle, aPosition, aTangent) {
        this.e = Vector3.copy(e);
        this.innerRadius = mustBeNumber('a', a);
        this.outerRadius = mustBeNumber('b', b);
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        this.generator = Spinor3.dual(e, clockwise);
        this.cutLine = Vector3.copy(cutLine).normalize();
        this.aPosition = mustBeString('aPosition', aPosition);
        this.aTangent = mustBeString('aTangent', aTangent);
    }
    RingTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var uSegments = iLength - 1;
        var u = i / uSegments;
        var vSegments = jLength - 1;
        var v = j / vSegments;
        var b = this.innerRadius;
        var a = this.outerRadius;
        var rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp();
        var position = Vector3.copy(this.cutLine).rotate(rotor).scale(b + (a - b) * v);
        var tangent = Spinor3.dual(this.e, false);
        vertex.attributes[this.aPosition] = position;
        vertex.attributes[this.aTangent] = tangent;
    };
    return RingTransform;
}());

/**
 * Constructs a one-sided ring using a TRIANGLE_STRIP.
 */
var RingBuilder = (function (_super) {
    __extends(RingBuilder, _super);
    function RingBuilder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The radius of the hole in the ring.
         */
        _this.innerRadius = 0;
        /**
         * The radius of the outer edge of the ring.
         */
        _this.outerRadius = 1;
        /**
         * The number of segments in the radial direction.
         */
        _this.radialSegments = 1;
        /**
         * The number of segments in the angular direction.
         */
        _this.thetaSegments = 32;
        /**
         * The direction of the normal vector perpendicular to the plane of the ring.
         */
        _this.e = Vector3.vector(0, 1, 0);
        /**
         * The direction from which a slice is created.
         */
        _this.cutLine = Vector3.vector(0, 0, 1);
        /**
         * The orientation of the slice relative to the cutLine.
         */
        _this.clockwise = true;
        return _this;
    }
    /**
     *
     */
    RingBuilder.prototype.toPrimitive = function () {
        // Define local constants so that names in shader programs will reflect the current program symbols.
        var aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION;
        var aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT;
        var aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL;
        this.transforms.push(new RingTransform(this.e, this.cutLine, this.clockwise, this.outerRadius, this.innerRadius, this.sliceAngle, aPosition, aTangent));
        this.transforms.push(new Scaling(this.stress, [aPosition, aTangent]));
        this.transforms.push(new Rotation(this.tilt, [aPosition, aTangent]));
        this.transforms.push(new Translation(this.offset, [aPosition]));
        // Use a duality transformation with a sign change to convert the tangent planes to vectors.
        this.transforms.push(new Duality(aTangent, aNormal, true, true));
        // Normalize the normal vectors.
        this.transforms.push(new Direction(aNormal));
        // Discard insignificant coordinates.
        this.transforms.push(new Approximation(9, [aPosition, aNormal]));
        if (this.useTextureCoord) {
            this.transforms.push(new CoordsTransform2D(false, false, false));
        }
        var grid = new GridTriangleStrip(this.thetaSegments, this.radialSegments);
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
}(AxialShapeBuilder));

/**
 * <p>
 * This class does not default the initial <b>axis</b>.
 * </p>
 * <p>
 * This class does not default the <b>cutLine</b>.
 * </p>
 */
var ArrowBuilder = (function (_super) {
    __extends(ArrowBuilder, _super);
    /**
     *
     * @param axis The direction of the arrow. The argument is normalized to a unit vector.
     * @param cutLine The direction of the start of the arrow slice. The argument is normalized to a unit vector.
     * @param clockwise The orientation
     */
    function ArrowBuilder(axis, cutLine, clockwise) {
        var _this = _super.call(this) || this;
        _this.heightCone = 0.20;
        _this.radiusCone = 0.08;
        _this.radiusShaft = 0.01;
        _this.thetaSegments = 16;
        mustBeDefined('axis', axis);
        mustBeDefined('cutLine', cutLine);
        _this.e = Vector3.copy(axis).normalize();
        _this.cutLine = Vector3.copy(cutLine).normalize();
        _this.clockwise = clockwise;
        return _this;
    }
    /**
     *
     */
    ArrowBuilder.prototype.toPrimitive = function () {
        var heightShaft = 1 - this.heightCone;
        /**
         * The opposite direction to the axis.
         */
        var back = Vector3.copy(this.e).neg();
        /**
         * The neck is the place where the cone meets the shaft.
         */
        var neck = Vector3.copy(this.e).scale(heightShaft).add(this.offset);
        neck.rotate(this.tilt);
        /**
         * The tail is the the position of the blunt end of the arrow.
         */
        var tail = Vector3.copy(this.offset);
        tail.rotate(this.tilt);
        /**
         * The `cone` forms the head of the arrow.
         */
        var cone = new ConicalShellBuilder();
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
        /**
         * The `ring` fills the space between the cone and the shaft.
         */
        var ring = new RingBuilder();
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
        /**
         * The `shaft` is the slim part of the arrow.
         */
        var shaft = new CylindricalShellBuilder();
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
        /**
         * The `plug` fills the end of the shaft.
         */
        var plug = new RingBuilder();
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
        return reduce([cone.toPrimitive(), ring.toPrimitive(), shaft.toPrimitive(), plug.toPrimitive()]);
    };
    return ArrowBuilder;
}(AxialShapeBuilder));

/**
 * The common low values for a Simplex.
 */
var SimplexMode;
(function (SimplexMode) {
    SimplexMode[SimplexMode["EMPTY"] = -1] = "EMPTY";
    SimplexMode[SimplexMode["POINT"] = 0] = "POINT";
    SimplexMode[SimplexMode["LINE"] = 1] = "LINE";
    SimplexMode[SimplexMode["TRIANGLE"] = 2] = "TRIANGLE";
    SimplexMode[SimplexMode["TETRAHEDRON"] = 3] = "TETRAHEDRON";
    SimplexMode[SimplexMode["FIVE_CELL"] = 4] = "FIVE_CELL";
})(SimplexMode || (SimplexMode = {}));

function checkIntegerArg(name, n, min, max) {
    mustBeInteger(name, n);
    mustBeGE(name, n, min);
    mustBeLE(name, n, max);
    return n;
}
function checkCountArg(count) {
    // TODO: The count range should depend upon the k value of the simplex.
    return checkIntegerArg('count', count, 0, 7);
}
function concatReduce(a, b) {
    return a.concat(b);
}
function lerp(a, b, alpha, data) {
    if (data === void 0) { data = []; }
    mustBeEQ('a.length', a.length, b.length);
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
    return new VectorN(lerp(a.toArray(), b.toArray(), alpha));
}
var Simplex = (function () {
    function Simplex(k) {
        this.vertices = [];
        mustBeInteger('k', k);
        var numVertices = k + 1;
        var numCoordinates = 0;
        for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex(numCoordinates));
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
        if (k === SimplexMode.TRIANGLE) {
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
        else if (k === SimplexMode.LINE) {
            var point0 = new Simplex(k - 1);
            point0.vertices[0].attributes = simplex.vertices[0].attributes;
            var point1 = new Simplex(k - 1);
            point1.vertices[0].attributes = simplex.vertices[1].attributes;
            return [point0, point1];
        }
        else if (k === SimplexMode.POINT) {
            // For consistency, we get one empty simplex rather than an empty list.
            return [new Simplex(k - 1)];
        }
        else if (k === SimplexMode.EMPTY) {
            return [];
        }
        else {
            // TODO: Handle the TETRAHEDRON and general cases.
            throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
        }
    };
    Simplex.subdivideMap = function (simplex) {
        var divs = [];
        var vertices = simplex.vertices;
        var k = simplex.k;
        if (k === SimplexMode.TRIANGLE) {
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
        else if (k === SimplexMode.LINE) {
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
        else if (k === SimplexMode.POINT) {
            divs.push(simplex);
        }
        else if (k === SimplexMode.EMPTY) {
            // Ignore, don't push is the generalization.
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
    /**
     * Copies the attributes onto all vertices of the simplex.
     */
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

/**
 * Determines how a Geometry will be rendered.
 */

(function (GeometryMode) {
    /**
     *
     */
    GeometryMode[GeometryMode["POINT"] = 0] = "POINT";
    /**
     *
     */
    GeometryMode[GeometryMode["WIRE"] = 1] = "WIRE";
    /**
     *
     */
    GeometryMode[GeometryMode["MESH"] = 2] = "MESH";
})(exports.GeometryMode || (exports.GeometryMode = {}));

var canonicalAxis$1 = vec(0, 1, 0);
var canonicalCutLine = vec(0, 0, 1);
var getAxis = function getAxis(options) {
    if (isDefined(options.axis)) {
        return options.axis;
    }
    else {
        return canonicalAxis$1;
    }
};
var getCutLine = function getCutLine(options) {
    if (isDefined(options.meridian)) {
        return options.meridian;
    }
    else {
        return canonicalCutLine;
    }
};
/**
 *
 */
function arrowPrimitive(options) {
    if (options === void 0) { options = { kind: 'ArrowGeometry' }; }
    mustBeObject('options', options);
    var builder = new ArrowBuilder(getAxis(options), getCutLine(options), false);
    if (isDefined(options.radiusCone)) {
        builder.radiusCone = mustBeNumber("options.radiusCone", options.radiusCone);
    }
    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1));
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero());
    return builder.toPrimitive();
}

/**
 * <p>
 * A convenience class for creating an arrow.
 * </p>
 * <p>
 * The initial axis unit vector defaults to <b>e<b><sub>2</sub>
 * </p>
 * <p>
 * The cutLine unit vector defaults to <b>e<b><sub>3</sub>
 * </p>
 */
var ArrowGeometry = (function (_super) {
    __extends(ArrowGeometry, _super);
    /**
     *
     */
    function ArrowGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'ArrowGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, arrowPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('ArrowGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    ArrowGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ArrowGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    ArrowGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return ArrowGeometry;
}(GeometryElements));

/**
 * A framework, as a base class, for building primitives by applying transformations to vertices.
 */
var PrimitivesBuilder = (function () {
    function PrimitivesBuilder() {
        /**
         * The scaling to apply to the geometry in the initial configuration.
         * This has a slightly strange sounding name because it involves a
         * reference frame specific transformation.
         *
         * This may be replaced by a Matrix3 in future.
         */
        this.stress = Vector3.vector(1, 1, 1);
        /**
         * The rotation to apply to the geometry (after the stress has been applied).
         */
        this.tilt = Spinor3.one.clone();
        /**
         * The translation to apply to the geometry (after tilt has been applied).
         */
        this.offset = Vector3.zero();
        /**
         *
         */
        this.transforms = [];
        /**
         * Determines whether to include normals in the geometry.
         */
        this.useNormal = true;
        /**
         * Determines whether to include positions in the geometry.
         */
        this.usePosition = true;
        /**
         * Determines whether to include texture coordinates in the geometry.
         */
        this.useTextureCoord = false;
        // Do nothing.
    }
    /**
     * Applies the transforms defined in this class to the vertex specified.
     */
    PrimitivesBuilder.prototype.applyTransforms = function (vertex, i, j, iLength, jLength) {
        var tLen = this.transforms.length;
        for (var t = 0; t < tLen; t++) {
            this.transforms[t].exec(vertex, i, j, iLength, jLength);
        }
    };
    /**
     * Derived classes must implement.
     */
    PrimitivesBuilder.prototype.toPrimitives = function () {
        console.warn("toPrimitives() must be implemented by derived classes.");
        return [];
    };
    return PrimitivesBuilder;
}());

function computeFaceNormals(simplex, positionName, normalName) {
    if (positionName === void 0) { positionName = GraphicsProgramSymbols.ATTRIBUTE_POSITION; }
    if (normalName === void 0) { normalName = GraphicsProgramSymbols.ATTRIBUTE_NORMAL; }
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

function copyToArray(source, destination, offset) {
    if (destination === void 0) { destination = []; }
    if (offset === void 0) { offset = 0; }
    var length = source.length;
    for (var i = 0; i < length; i++) {
        destination[offset + i] = source[i];
    }
    return destination;
}

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
function dataLength(source) {
    if (source instanceof Geometric3) {
        if (source.length !== 8) {
            throw new Error("source.length (" + source.length + ") is expected to be 8");
        }
        return 3;
    }
    else if (source instanceof Geometric2) {
        if (source.length !== 4) {
            throw new Error("source.length (" + source.length + ") is expected to be 4");
        }
        return 2;
    }
    else if (source instanceof Vector3) {
        if (source.length !== 3) {
            throw new Error("source.length (" + source.length + ") is expected to be 3");
        }
        return 3;
    }
    else if (source instanceof Vector2) {
        if (source.length !== 2) {
            throw new Error("source.length (" + source.length + ") is expected to be 2");
        }
        return 2;
    }
    else {
        if (source.length === 1) {
            return 1;
        }
        else if (source.length === 2) {
            return 2;
        }
        else if (source.length === 3) {
            return 3;
        }
        else if (source.length === 4) {
            return 4;
        }
        else {
            throw new Error("dataLength(source: VectorN<number>): AttributeSizeType, source.length => " + source.length);
        }
    }
}

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
function simplicesToPrimitive(simplices, geometryMeta) {
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
    // Side effect is to set the index property, but it will be be the same as the array index. 
    var vertices = computeUniqueVertices(simplices);
    var vsLength = vertices.length;
    // Each simplex produces as many indices as vertices.
    // This is why we need the Vertex to have an temporary index property.
    var indices = simplices.map(Simplex.indices).reduce(concat, []);
    // Create intermediate data structures for output and to cache dimensions and name.
    // For performance an array will be used whose index is the key index.
    var outputs = [];
    for (var k = 0; k < keysLen; k++) {
        var key = keys[k];
        var dims = attribSize(key, attribMap);
        var data = numberList(vsLength * dims, void 0);
        outputs.push({ data: data, dimensions: dims, name: attribName(key, attribMap) });
    }
    // Accumulate attribute data in intermediate data structures.
    for (var i = 0; i < vsLength; i++) {
        var vertex = vertices[i];
        var vertexAttribs = vertex.attributes;
        if (vertex.index !== i) {
            expectArg('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
        }
        for (var k = 0; k < keysLen; k++) {
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
    for (var k = 0; k < keysLen; k++) {
        var output = outputs[k];
        var data = output.data;
        attributes[output.name] = new DrawAttribute(data, output.dimensions, exports.DataType.FLOAT);
    }
    switch (geometryMeta.k) {
        case SimplexMode.TRIANGLE: {
            return new DrawPrimitive(exports.BeginMode.TRIANGLES, indices, attributes);
        }
        case SimplexMode.LINE: {
            return new DrawPrimitive(exports.BeginMode.LINES, indices, attributes);
        }
        case SimplexMode.POINT: {
            return new DrawPrimitive(exports.BeginMode.POINTS, indices, attributes);
        }
        case SimplexMode.EMPTY: {
            // It should be possible to no-op an EMPTY simplex.
            return new DrawPrimitive(exports.BeginMode.POINTS, indices, attributes);
        }
        default: {
            throw new Error("k => " + geometryMeta.k);
        }
    }
}

var exp$2 = Math.exp;
var log$3 = Math.log;
var sqrt$7 = Math.sqrt;
var COORD_X$6 = 0;
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
        return _super.call(this, data, modified, 1) || this;
    }
    Object.defineProperty(Vector1.prototype, "x", {
        /**
         * @property x
         * @type Number
         */
        get: function () {
            return this.coords[COORD_X$6];
        },
        set: function (value) {
            this.modified = this.modified || this.x !== value;
            this.coords[COORD_X$6] = value;
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
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @method applyMatrix
     * @param σ {Matrix1}
     * @return {Vector1} <code>this</code>
     * @chainable
     */
    Vector1.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var e = σ.elements;
        this.x = e[0x0] * x;
        return this;
    };
    /**
     * @method approx
     * @param n {number}
     * @return {Vector1}
     * @chainable
     */
    Vector1.prototype.approx = function (n) {
        _super.prototype.approx.call(this, n);
        return this;
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
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
        this.x = exp$2(this.x);
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
        this.x = log$3(this.x);
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
    /**
     * @method neg
     * @return {Vector1} <code>this</code>
     */
    Vector1.prototype.neg = function () {
        this.x = -this.x;
        return this;
    };
    /**
     * @method distanceTo
     * @param point {VectorE1}
     * @return {number}
     */
    Vector1.prototype.distanceTo = function (position) {
        return sqrt$7(this.quadranceTo(position));
    };
    Vector1.prototype.dot = function (v) {
        return this.x * v.x;
    };
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    Vector1.prototype.magnitude = function () {
        return sqrt$7(this.squaredNorm());
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
        // FIXME: TODO
        return this;
    };
    Vector1.prototype.reflection = function (n) {
        // FIXME: TODO
        return this;
    };
    Vector1.prototype.rotate = function (rotor) {
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
    Vector1.prototype.lerp = function (v, α) {
        this.x += (v.x - this.x) * α;
        return this;
    };
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {Vector1}
     * @param b {Vector1}
     * @param α {number}
     * @return {Vector1}
     * @chainable
     */
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
    /**
     * @method translation
     * @param d {VectorE0}
     * @return {Vector1}
     * @chainable
     */
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
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Vector1}
     * @chainable
     */
    Vector1.prototype.zero = function () {
        this.x = 0;
        return this;
    };
    /**
     * @method random
     * @return {Vector1}
     * @static
     * @chainable
     */
    Vector1.random = function () {
        return new Vector1([Math.random()]);
    };
    /**
     *
     */
    Vector1.zero = function () {
        return new Vector1([0]);
    };
    return Vector1;
}(Coords));

var SimplexPrimitivesBuilder = (function (_super) {
    __extends(SimplexPrimitivesBuilder, _super);
    function SimplexPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.data = [];
        _this._k = new Vector1([SimplexMode.TRIANGLE]);
        _this.curvedSegments = 16;
        _this.flatSegments = 1;
        _this.orientationColors = false;
        // Force regenerate, even if derived classes don't call setModified.
        _this._k.modified = true;
        return _this;
    }
    Object.defineProperty(SimplexPrimitivesBuilder.prototype, "k", {
        get: function () {
            return this._k.x;
        },
        set: function (k) {
            this._k.x = mustBeInteger('k', k);
        },
        enumerable: true,
        configurable: true
    });
    SimplexPrimitivesBuilder.prototype.regenerate = function () {
        throw new Error("`protected regenerate(): void` method should be implemented in derived class.");
    };
    /**
     *
     */
    SimplexPrimitivesBuilder.prototype.isModified = function () {
        return this._k.modified;
    };
    SimplexPrimitivesBuilder.prototype.setModified = function (modified) {
        mustBeBoolean('modified', modified);
        this._k.modified = modified;
        return this;
    };
    SimplexPrimitivesBuilder.prototype.boundary = function (times) {
        this.regenerate();
        this.data = Simplex.boundary(this.data, times);
        return this.check();
    };
    SimplexPrimitivesBuilder.prototype.check = function () {
        this.meta = simplicesToGeometryMeta(this.data);
        return this;
    };
    SimplexPrimitivesBuilder.prototype.subdivide = function (times) {
        this.regenerate();
        this.data = Simplex.subdivide(this.data, times);
        this.check();
        return this;
    };
    SimplexPrimitivesBuilder.prototype.toPrimitives = function () {
        this.regenerate();
        this.check();
        return [simplicesToPrimitive(this.data, this.meta)];
    };
    SimplexPrimitivesBuilder.prototype.mergeVertices = function () {
        // console.warn("SimplexPrimitivesBuilder.mergeVertices not yet implemented");
    };
    SimplexPrimitivesBuilder.prototype.triangle = function (positions, normals, uvs) {
        var simplex = new Simplex(SimplexMode.TRIANGLE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[2];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[2];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[2];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 1, 0);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 0, 1);
        }
        return this.data.push(simplex);
    };
    SimplexPrimitivesBuilder.prototype.lineSegment = function (positions, normals, uvs) {
        var simplex = new Simplex(SimplexMode.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[1];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 1, 0);
        }
        return this.data.push(simplex);
    };
    SimplexPrimitivesBuilder.prototype.point = function (positions, normals, uvs) {
        var simplex = new Simplex(SimplexMode.POINT);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
        }
        return this.data.push(simplex);
    };
    return SimplexPrimitivesBuilder;
}(PrimitivesBuilder));

function triangle(a, b, c, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    var simplex = new Simplex(SimplexMode.TRIANGLE);
    simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = a;
    // simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e1
    simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = b;
    // simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e2
    simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = c;
    // simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.e3
    computeFaceNormals(simplex, GraphicsProgramSymbols.ATTRIBUTE_POSITION, GraphicsProgramSymbols.ATTRIBUTE_NORMAL);
    Simplex.setAttributeValues(attributes, simplex);
    triangles.push(simplex);
    return triangles;
}

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
    var triatts = {};
    setAttributes([1, 2, 0], attributes, triatts);
    triangle(b, c, a, triatts, triangles);
    setAttributes([3, 0, 2], attributes, triatts);
    triangle(d, a, c, triatts, triangles);
    return triangles;
}

var canonicalAxis$2 = vec(0, 1, 0);
var canonicalMeridian$1 = vec(0, 0, 1);
/**
 * e1
 */
var DEFAULT_A = vec(1, 0, 0);
/**
 * e2
 */
var DEFAULT_B = vec(0, 1, 0);
/**
 * e3
 */
var DEFAULT_C = vec(0, 0, 1);
var CuboidSimplexPrimitivesBuilder = (function (_super) {
    __extends(CuboidSimplexPrimitivesBuilder, _super);
    function CuboidSimplexPrimitivesBuilder(a, b, c, k, subdivide, boundary) {
        if (k === void 0) { k = SimplexMode.TRIANGLE; }
        if (subdivide === void 0) { subdivide = 0; }
        if (boundary === void 0) { boundary = 0; }
        var _this = _super.call(this) || this;
        _this._isModified = true;
        _this._a = Vector3.copy(a);
        _this._b = Vector3.copy(b);
        _this._c = Vector3.copy(c);
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
        // Define the anchor points relative to the origin.
        var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function () { return void 0; });
        pos[0] = new Vector3().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
        pos[1] = new Vector3().add(this._a).sub(this._b).add(this._c).divByScalar(2);
        pos[2] = new Vector3().add(this._a).add(this._b).add(this._c).divByScalar(2);
        pos[3] = new Vector3().sub(this._a).add(this._b).add(this._c).divByScalar(2);
        pos[4] = new Vector3().copy(pos[3]).sub(this._c);
        pos[5] = new Vector3().copy(pos[2]).sub(this._c);
        pos[6] = new Vector3().copy(pos[1]).sub(this._c);
        pos[7] = new Vector3().copy(pos[0]).sub(this._c);
        // Perform the scale, tilt, offset active transformation.
        pos.forEach(function (point) {
            // point.scale(this.scale.x)
            point.rotate(_this.tilt);
            point.add(_this.offset);
        });
        function simplex(indices) {
            var simplex = new Simplex(indices.length - 1);
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]];
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX] = new Vector1([i]);
            }
            return simplex;
        }
        switch (this.k) {
            case SimplexMode.POINT: {
                var points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                this.data = points.map(function (point) { return simplex(point); });
                break;
            }
            case SimplexMode.LINE: {
                var lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                this.data = lines.map(function (line) { return simplex(line); });
                break;
            }
            case SimplexMode.TRIANGLE: {
                var faces = [0, 1, 2, 3, 4, 5].map(function () { return void 0; });
                faces[0] = quadrilateral(pos[0], pos[1], pos[2], pos[3]);
                faces[1] = quadrilateral(pos[1], pos[6], pos[5], pos[2]);
                faces[2] = quadrilateral(pos[7], pos[0], pos[3], pos[4]);
                faces[3] = quadrilateral(pos[6], pos[7], pos[4], pos[5]);
                faces[4] = quadrilateral(pos[3], pos[2], pos[5], pos[4]);
                faces[5] = quadrilateral(pos[7], pos[6], pos[1], pos[0]);
                this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);
                this.data.forEach(function (simplex) {
                    computeFaceNormals(simplex);
                });
                break;
            }
            default: {
                // Do nothing.
            }
        }
        // Compute the meta data.
        this.check();
    };
    return CuboidSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder));
function side(tilt, offset, basis, uSegments, vSegments) {
    // The normal will be the same for all vertices in the side, so we compute it once here.
    // Perform the stress ant tilt transformations on the tangent bivector before computing the normal.
    var tangent = Spinor3.wedge(basis[0], basis[1]).rotate(tilt);
    var normal = Vector3.dual(tangent, true).normalize();
    var aNeg = Vector3.copy(basis[0]).scale(-0.5);
    var aPos = Vector3.copy(basis[0]).scale(+0.5);
    var bNeg = Vector3.copy(basis[1]).scale(-0.5);
    var bPos = Vector3.copy(basis[1]).scale(+0.5);
    var cPos = Vector3.copy(basis[2]).scale(+0.5);
    var side = new GridTriangleStrip(uSegments, vSegments);
    for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
        for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
            var u = uIndex / uSegments;
            var v = vIndex / vSegments;
            var a = Vector3.copy(aNeg).lerp(aPos, u);
            var b = Vector3.copy(bNeg).lerp(bPos, v);
            var vertex = side.vertex(uIndex, vIndex);
            var position = Vector3.copy(a).add(b).add(cPos);
            // Perform the stress, tilt, offset transformations (in that order)
            position.rotate(tilt);
            position.add(offset);
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position;
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal;
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector2([u, 1 - v]);
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
        /**
         * The "width" direction. The default value is e1.
         */
        _this._a = Vector3.vector(1, 0, 0);
        /**
         * The "height" direction. The default value is e2.
         */
        _this._b = Vector3.vector(0, 1, 0);
        /**
         * The "depth" direction. The default value is e3.
         */
        _this._c = Vector3.vector(0, 0, 1);
        _this.sides = [];
        return _this;
    }
    Object.defineProperty(CuboidPrimitivesBuilder.prototype, "width", {
        get: function () {
            return this._a.magnitude();
        },
        set: function (width) {
            mustBeNumber('width', width);
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
            mustBeNumber('height', height);
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
            mustBeNumber('depth', depth);
            this._c.normalize().scale(depth);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates six TRIANGLE_STRIP faces using the GridTriangleStrip helper.
     */
    CuboidPrimitivesBuilder.prototype.regenerate = function () {
        this.sides = [];
        var t = this.tilt;
        var o = this.offset;
        if (!this.openFront) {
            this.sides.push(side(t, o, [this._a, this._b, this._c], this.iSegments, this.jSegments));
        }
        if (!this.openRight) {
            this.sides.push(side(t, o, [Vector3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
        }
        if (!this.openLeft) {
            this.sides.push(side(t, o, [this._c, this._b, Vector3.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
        }
        if (!this.openBack) {
            this.sides.push(side(t, o, [Vector3.copy(this._a).scale(-1), this._b, Vector3.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
        }
        if (!this.openCap) {
            this.sides.push(side(t, o, [this._a, Vector3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
        }
        if (!this.openBase) {
            this.sides.push(side(t, o, [this._a, this._c, Vector3.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        }
    };
    CuboidPrimitivesBuilder.prototype.toPrimitives = function () {
        this.regenerate();
        return this.sides.map(function (side) { return side.toPrimitive(); });
    };
    return CuboidPrimitivesBuilder;
}(PrimitivesBuilder));
function boxPrimitive(options) {
    if (options === void 0) { options = { kind: 'BoxGeometry' }; }
    var width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1;
    var height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1;
    var depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1;
    var axis = isDefined(options.axis) ? vectorCopy(options.axis).direction() : vec(0, 1, 0);
    var meridian = (isDefined(options.meridian) ? vectorCopy(options.meridian) : vec(0, 0, 1)).rejectionFrom(axis).direction();
    var tilt = Geometric3.rotorFromFrameToFrame([canonicalAxis$2, canonicalMeridian$1, canonicalAxis$2.cross(canonicalMeridian$1)], [axis, meridian, axis.cross(meridian)]);
    var mode = isDefined(options.mode) ? options.mode : exports.GeometryMode.MESH;
    switch (mode) {
        case exports.GeometryMode.POINT: {
            var a = DEFAULT_A.scale(width);
            var b = DEFAULT_B.scale(height);
            var c = DEFAULT_C.scale(depth);
            var builder = new CuboidSimplexPrimitivesBuilder(a, b, c, SimplexMode.POINT);
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            var primitives = builder.toPrimitives();
            if (primitives.length === 1) {
                return primitives[0];
            }
            else {
                throw new Error("Expecting CuboidSimplexPrimitivesBuilder to return one Primitive.");
            }
        }
        case exports.GeometryMode.WIRE: {
            var a = DEFAULT_A.scale(width);
            var b = DEFAULT_B.scale(height);
            var c = DEFAULT_C.scale(depth);
            var builder = new CuboidSimplexPrimitivesBuilder(a, b, c, SimplexMode.LINE);
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            var primitives = builder.toPrimitives();
            if (primitives.length === 1) {
                return primitives[0];
            }
            else {
                throw new Error("Expecting CuboidSimplexPrimitivesBuilder to return one Primitive.");
            }
        }
        default: {
            var builder = new CuboidPrimitivesBuilder();
            builder.width = width;
            builder.height = height;
            builder.depth = depth;
            if (isDefined(options.openBack)) {
                builder.openBack = mustBeBoolean('openBack', options.openBack);
            }
            if (isDefined(options.openBase)) {
                builder.openBase = mustBeBoolean('openBase', options.openBase);
            }
            if (isDefined(options.openFront)) {
                builder.openFront = mustBeBoolean('openFront', options.openFront);
            }
            if (isDefined(options.openLeft)) {
                builder.openLeft = mustBeBoolean('openLeft', options.openLeft);
            }
            if (isDefined(options.openRight)) {
                builder.openRight = mustBeBoolean('openRight', options.openRight);
            }
            if (isDefined(options.openCap)) {
                builder.openCap = mustBeBoolean('openCap', options.openCap);
            }
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            return reduce(builder.toPrimitives());
        }
    }
}
/**
 * A convenience class for creating a BoxGeometry.
 */
var BoxGeometry = (function (_super) {
    __extends(BoxGeometry, _super);
    /**
     *
     */
    function BoxGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'BoxGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, boxPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('BoxGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    BoxGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('BoxGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    BoxGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return BoxGeometry;
}(GeometryElements));

/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * begin {VectorE3} The begin position.
 * angle: {number} The angle of the rotation.
 * generator {SpinorE3} The generator of the rotation.
 * segments {number} The number of segments.
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
    var point = Vector3.copy(begin);
    /**
     * The rotor that advances us through one segment.
     */
    var rotor = Spinor3.copy(generator).scale((-angle / 2) / segments).exp();
    points.push(point.clone());
    for (var i = 0; i < segments; i++) {
        point.rotate(rotor);
        points.push(point.clone());
    }
    return points;
}

var canonicalAxis$3 = vec(0, 1, 0);
// const canonicalMeridian = vec(0, 0, 1);
/**
 * @param height The vector in the height direction. The length also gives the cylinder length.
 * @param radius The vector in the radius direction. The length also gives the cylinder radius.
 * @param clockwise
 * @param stress
 * @param tilt
 * @param offset
 * @param angle
 * @param generator
 * @param heightSegments
 * @param thetaSegments
 * @param points
 * @param tangents
 * @param vertices
 * @param uvs
 */
function computeWallVertices(height, radius, clockwise, stress, tilt, offset, angle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs) {
    /**
     *
     */
    var halfHeight = Vector3.copy(height).scale(0.5);
    /**
     * A displacement in the direction of axis that we must move for each height step.
     */
    var stepH = Vector3.copy(height).scale(1 / heightSegments);
    var iLength = heightSegments + 1;
    for (var i = 0; i < iLength; i++) {
        /**
         * The displacement to the current level.
         */
        var dispH = Vector3.copy(stepH).scale(i).sub(halfHeight);
        var verticesRow = [];
        var uvsRow = [];
        /**
         * The texture coordinate in the north-south direction.
         */
        var v = (heightSegments - i) / heightSegments;
        /**
         * arcPoints.length => thetaSegments + 1
         */
        var arcPoints = arc3(radius, angle, generator, thetaSegments);
        /**
         * j < arcPoints.length => j <= thetaSegments
         */
        var jLength = arcPoints.length;
        for (var j = 0; j < jLength; j++) {
            // Starting with a point on the wall of the regular cylinder...
            var point = arcPoints[j];
            // Compute the tangent bivector before moving the point up the wall, it need not be normalized.
            var tangent = Spinor3.dual(point, false);
            // Add the displacement up the wall to get the point to the correct height.
            point.add(dispH);
            // Subject the point to the stress, tilt, offset transformations.
            point.stress(stress);
            point.rotate(tilt);
            point.add(offset);
            // Subject the tangent bivector to the stress and tilt (no need for offset).
            tangent.stress(stress);
            tangent.rotate(tilt);
            /**
             * u will vary from 0 to 1, because j goes from 0 to thetaSegments
             */
            var u = j / thetaSegments;
            points.push(point);
            tangents.push(tangent);
            verticesRow.push(points.length - 1);
            uvsRow.push(new Vector2([u, v]));
        }
        vertices.push(verticesRow);
        uvs.push(uvsRow);
    }
}
/**
 *
 */
var CylinderSimplexPrimitivesBuilder = (function (_super) {
    __extends(CylinderSimplexPrimitivesBuilder, _super);
    function CylinderSimplexPrimitivesBuilder(height, cutLine, clockwise, mode) {
        var _this = _super.call(this) || this;
        _this.mode = mode;
        _this.sliceAngle = 2 * Math.PI;
        _this.openBase = false;
        _this.openCap = false;
        _this.openWall = false;
        _this.height = Vector3.copy(height);
        _this.cutLine = Vector3.copy(cutLine);
        _this.clockwise = clockwise;
        _this.setModified(true);
        return _this;
    }
    CylinderSimplexPrimitivesBuilder.prototype.regenerate = function () {
        this.data = [];
        var heightSegments = this.flatSegments;
        var thetaSegments = this.curvedSegments;
        var generator = Spinor3.dual(Vector3.copy(this.height).normalize(), false);
        var heightHalf = 1 / 2;
        var points = [];
        var tangents = [];
        // The double array allows us to manage the i,j indexing more naturally.
        // The alternative is to use an indexing function.
        var vertices = [];
        var uvs = [];
        computeWallVertices(this.height, this.cutLine, this.clockwise, this.stress, this.tilt, this.offset, this.sliceAngle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs);
        if (!this.openWall) {
            for (var j = 0; j < thetaSegments; j++) {
                for (var i = 0; i < heightSegments; i++) {
                    /**
                     * We're going to touch every quadrilateral in the wall and split it into two triangles,
                     * 2-1-3 and 4-3-1 (both counter-clockwise when viewed from outside).
                     *
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
                    // Compute the normals and normalize them
                    var n1 = Vector3.dual(tangents[v1], true).normalize();
                    var n2 = Vector3.dual(tangents[v2], true).normalize();
                    var n3 = Vector3.dual(tangents[v3], true).normalize();
                    var n4 = Vector3.dual(tangents[v4], true).normalize();
                    var uv1 = uvs[i][j].clone();
                    var uv2 = uvs[i + 1][j].clone();
                    var uv3 = uvs[i + 1][j + 1].clone();
                    var uv4 = uvs[i][j + 1].clone();
                    switch (this.mode) {
                        case exports.GeometryMode.MESH: {
                            this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3]);
                            this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()]);
                            break;
                        }
                        case exports.GeometryMode.WIRE: {
                            this.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
                            this.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
                            this.lineSegment([points[v3], points[v3]], [n3, n4], [uv3, uv4]);
                            this.lineSegment([points[v4], points[v1]], [n4, n1], [uv4, uv1]);
                            break;
                        }
                        case exports.GeometryMode.POINT: {
                            this.point([points[v1]], [n1], [uv1]);
                            this.point([points[v2]], [n2], [uv2]);
                            this.point([points[v3]], [n3], [uv3]);
                            this.point([points[v4]], [n4], [uv4]);
                            break;
                        }
                    }
                }
            }
        }
        if (!this.openCap) {
            // Push an extra point for the center of the cap.
            var top_1 = Vector3.copy(this.height).scale(heightHalf).add(this.offset);
            var tangent = Spinor3.dual(Vector3.copy(this.height).normalize(), false).stress(this.stress).rotate(this.tilt);
            var normal = Vector3.dual(tangent, true);
            points.push(top_1);
            for (var j = 0; j < thetaSegments; j++) {
                var v1 = vertices[heightSegments][j + 1];
                var v2 = points.length - 1;
                var v3 = vertices[heightSegments][j];
                // We probably should devise a way to either disable texturing or use a different texture.
                var uv1 = uvs[heightSegments][j + 1].clone();
                var uv3 = uvs[heightSegments][j].clone();
                // The texturing on the end is a funky continuation of the sides.
                // const uv2: Vector2 = new Vector2([(uv1.x + uv3.x) / 2, 1]);
                // The texturing on the end is a uniform continuation of the sides.
                var uv2 = new Vector2([(uv1.x + uv3.x) / 2, (uv1.y + uv3.y) / 2]);
                switch (this.mode) {
                    case exports.GeometryMode.MESH: {
                        this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3]);
                        break;
                    }
                    case exports.GeometryMode.WIRE: {
                        this.lineSegment([points[v1], points[v2]], [normal, normal], [uv1, uv2]);
                        this.lineSegment([points[v2], points[v3]], [normal, normal], [uv2, uv3]);
                        this.lineSegment([points[v3], points[v1]], [normal, normal], [uv3, uv1]);
                        break;
                    }
                    case exports.GeometryMode.POINT: {
                        this.point([points[v1]], [normal], [uv1]);
                        this.point([points[v2]], [normal], [uv2]);
                        this.point([points[v3]], [normal], [uv3]);
                        break;
                    }
                }
            }
        }
        if (!this.openBase) {
            // Push an extra point for the center of the base.
            var bottom = Vector3.copy(this.height).scale(-heightHalf).add(this.offset);
            var tangent = Spinor3.dual(Vector3.copy(this.height).normalize(), false).neg().stress(this.stress).rotate(this.tilt);
            var normal = Vector3.dual(tangent, true);
            points.push(bottom);
            for (var j = 0; j < thetaSegments; j++) {
                var v1 = vertices[0][j];
                var v2 = points.length - 1;
                var v3 = vertices[0][j + 1];
                // We probably should devise a way to either disable texturing or use a different texture.
                var uv1 = uvs[0][j].clone();
                var uv3 = uvs[0][j + 1].clone();
                // The texturing on the end is a funky continuation of the sides.
                // const uv2: Vector2 = new Vector2([(uv1.x + uv3.x) / 2, 0]);
                // The texturing on the end is a uniform continuation of the sides.
                var uv2 = new Vector2([(uv1.x + uv3.x) / 2, (uv1.y + uv3.y) / 2]);
                switch (this.mode) {
                    case exports.GeometryMode.MESH: {
                        this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3]);
                        break;
                    }
                    case exports.GeometryMode.WIRE: {
                        this.lineSegment([points[v1], points[v2]], [normal, normal], [uv1, uv2]);
                        this.lineSegment([points[v2], points[v3]], [normal, normal], [uv2, uv3]);
                        this.lineSegment([points[v3], points[v1]], [normal, normal], [uv3, uv1]);
                        break;
                    }
                    case exports.GeometryMode.POINT: {
                        this.point([points[v1]], [normal], [uv1]);
                        this.point([points[v2]], [normal], [uv2]);
                        this.point([points[v3]], [normal], [uv3]);
                        break;
                    }
                }
            }
        }
        this.setModified(false);
    };
    return CylinderSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder));
function getAxis$1(options) {
    if (options === void 0) { options = { kind: 'CylinderGeometry' }; }
    if (isDefined(options.axis)) {
        return options.axis;
    }
    else if (isDefined(options.length)) {
        return vec(0, mustBeNumber('length', options.length), 0);
    }
    else {
        return vec(0, 1, 0);
    }
}
function getMeridian(options) {
    if (options === void 0) { options = { kind: 'CylinderGeometry' }; }
    if (isDefined(options.meridian)) {
        return options.meridian;
    }
    else if (isDefined(options.radius)) {
        return vec(0, 0, mustBeNumber('radius', options.radius));
    }
    else {
        return vec(0, 0, 1);
    }
}
/**
 * TODO: Support GeometryMode.
 */
function cylinderPrimitive(options) {
    if (options === void 0) { options = { kind: 'CylinderGeometry' }; }
    /**
     * The canonical axis is in the e2 direction.
     */
    var height = getAxis$1(options);
    /**
     * The canonical cutLine is in the e3 direction.
     */
    var cutLine = getMeridian(options);
    var mode = isDefined(options.mode) ? options.mode : exports.GeometryMode.MESH;
    var builder = new CylinderSimplexPrimitivesBuilder(height, cutLine, false, mode);
    if (isDefined(options.openBase)) {
        builder.openBase = mustBeBoolean('openBase', options.openBase);
    }
    if (isDefined(options.openCap)) {
        builder.openCap = mustBeBoolean('openCap', options.openCap);
    }
    if (isDefined(options.openWall)) {
        builder.openWall = mustBeBoolean('openWall', options.openWall);
    }
    if (isDefined(options.heightSegments)) {
        builder.flatSegments = mustBeInteger("heightSegments", options.heightSegments);
    }
    if (isDefined(options.thetaSegments)) {
        builder.curvedSegments = mustBeInteger("thetaSegments", options.thetaSegments);
    }
    if (options.offset) {
        builder.offset.copy(options.offset);
    }
    var primitives = builder.toPrimitives();
    if (primitives.length === 1) {
        return primitives[0];
    }
    else {
        throw new Error("Expecting CylinderSimplexPrimitivesBuilder to return one Primitive.");
    }
}
function baseOptions(options) {
    var axis = getAxis$1(options);
    var tilt = Geometric3.rotorFromDirections(canonicalAxis$3, axis);
    return { tilt: tilt };
}
/**
 * A geometry for a Cylinder.
 */
var CylinderGeometry = (function (_super) {
    __extends(CylinderGeometry, _super);
    /**
     *
     */
    function CylinderGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'CylinderGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, cylinderPrimitive(options), baseOptions(options), levelUp + 1) || this;
        _this.setLoggingName('CylinderGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    CylinderGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('CylinderGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    CylinderGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return CylinderGeometry;
}(GeometryElements));

function isLT(value, limit) {
    return value < limit;
}

function mustBeLT(name, value, limit, contextBuilder) {
    mustSatisfy(name, isLT(value, limit), function () { return "be less than " + limit; }, contextBuilder);
    return value;
}

/**
 * Computes the number of vertices required to construct a curve.
 */
function numVerticesForCurve(uSegments) {
    mustBeInteger('uSegments', uSegments);
    return uSegments + 1;
}

/**
 *
 */
var CurvePrimitive = (function (_super) {
    __extends(CurvePrimitive, _super);
    /**
     * @param mode
     * @param uSegments
     * @param uClosed
     */
    function CurvePrimitive(mode, uSegments, uClosed) {
        var _this = _super.call(this, mode, numVerticesForCurve(uSegments), 1) || this;
        mustBeInteger('uSegments', uSegments);
        mustBeGE('uSegments', uSegments, 0);
        mustBeBoolean('uClosed', uClosed);
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
        set: function (uSegments) {
            mustBeInteger('uSegments', uSegments);
            throw new Error(readOnly('uSegments').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CurvePrimitive.prototype, "uLength", {
        /**
         * uLength = uSegments + 1
         */
        get: function () {
            return numPostsForFence(this._uSegments, this._uClosed);
        },
        set: function (uLength) {
            mustBeInteger('uLength', uLength);
            throw new Error(readOnly('uLength').message);
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
        mustBeInteger('uIndex', uIndex);
        mustBeGE('uIndex', uIndex, 0);
        mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    };
    return CurvePrimitive;
}(VertexPrimitive));

function elementsForCurve(uSegments, uClosed, elements) {
    // Make sure that we have somewhere valid to store the result.
    elements = isDefined(elements) ? mustBeArray('elements', elements) : [];
    // The number of fence posts depends upon whether the curve is open or closed.
    var uLength = numPostsForFence(uSegments, uClosed);
    for (var u = 0; u < uLength; u++) {
        elements.push(u);
    }
    return elements;
}

var LineStrip = (function (_super) {
    __extends(LineStrip, _super);
    /**
     * @param uSegments
     */
    function LineStrip(uSegments) {
        var _this = _super.call(this, exports.BeginMode.LINE_STRIP, uSegments, false) || this;
        // We are rendering a LINE_STRIP so the figure will not be closed.
        _this.elements = elementsForCurve(uSegments, false);
        return _this;
    }
    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     */
    LineStrip.prototype.vertex = function (uIndex) {
        mustBeInteger('uIndex', uIndex);
        mustBeGE('uIndex', uIndex, 0);
        mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    };
    return LineStrip;
}(CurvePrimitive));

/**
 * Determines how a Curve will be rendered.
 */

(function (CurveMode) {
    /**
     *
     */
    CurveMode[CurveMode["POINTS"] = 0] = "POINTS";
    /**
     *
     */
    CurveMode[CurveMode["LINES"] = 1] = "LINES";
})(exports.CurveMode || (exports.CurveMode = {}));

/**
 *
 */
var LinePoints = (function (_super) {
    __extends(LinePoints, _super);
    /**
     * @param uSegments
     */
    function LinePoints(uSegments) {
        var _this = _super.call(this, exports.BeginMode.POINTS, uSegments, false) || this;
        _this.elements = elementsForCurve(uSegments, false);
        return _this;
    }
    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     */
    LinePoints.prototype.vertex = function (uIndex) {
        mustBeInteger('uIndex', uIndex);
        mustBeGE('uIndex', uIndex, 0);
        mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    };
    return LinePoints;
}(CurvePrimitive));

function isFunction(x) {
    return (typeof x === 'function');
}

function aPositionDefault(u) {
    return Vector3.vector(u, 0, 0);
}
function topology(mode, uSegments, uClosed) {
    switch (mode) {
        case exports.CurveMode.POINTS: {
            return new LinePoints(uSegments);
        }
        case exports.CurveMode.LINES: {
            return new LineStrip(uSegments);
        }
        default: {
            throw new Error("mode must be POINTS or LINES");
        }
    }
}
function transformVertex(vertex, u, options) {
    var aPosition = isDefined(options.aPosition) ? options.aPosition : aPositionDefault;
    var aColor = isDefined(options.aColor) ? options.aColor : void 0;
    if (isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(aPosition(u));
    }
    if (isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color.copy(aColor(u));
    }
}
function curvePrimitive(options) {
    var uMin = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0;
    var uMax = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1;
    var uSegments = isDefined(options.uSegments) ? options.uSegments : 1;
    var mode = isDefined(options.mode) ? options.mode : exports.CurveMode.LINES;
    // Working on the assumption that the grid is open in both directions.
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

/**
 * A Geometry for representing functions of one scalar parameter.
 */
var CurveGeometry = (function (_super) {
    __extends(CurveGeometry, _super);
    function CurveGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'CurveGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, curvePrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('CurveGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    CurveGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('CurveGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    CurveGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return CurveGeometry;
}(GeometryElements));

/**
 * Computes the vertex index from integer coordinates.
 * Both lengths are included for symmetry!
 */
function vertexIndex(i, j, iLength, jLength) {
    mustBeInteger('iLength', iLength);
    mustBeInteger('jLength', jLength);
    return j * iLength + i;
}
function linesForGrid(uSegments, uClosed, vSegments, vClosed) {
    var iLength = numPostsForFence(uSegments, uClosed);
    var jLength = numPostsForFence(vSegments, vClosed);
    var elements = [];
    for (var i = 0; i < iLength; i++) {
        for (var j = 0; j < jLength; j++) {
            // The first line is in the direction of increasing i.
            // 
            if (i < uSegments) {
                elements.push(vertexIndex(i, j, iLength, jLength));
                elements.push(vertexIndex(i + 1, j, iLength, jLength));
            }
            // The second line is in the direction of increasing j.
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
    /**
     * @param uSegments
     * @param uClosed
     * @param vSegments
     * @param vClosed
     */
    function GridLines(uSegments, uClosed, vSegments, vClosed) {
        var _this = _super.call(this, exports.BeginMode.LINES, uSegments, vSegments) || this;
        _this.elements = linesForGrid(uSegments, uClosed, vSegments, vClosed);
        var iLength = numPostsForFence(uSegments, uClosed);
        var jLength = numPostsForFence(vSegments, vClosed);
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < jLength; j++) {
                var coords = _this.vertex(i, j).coords;
                coords.setComponent(0, i);
                coords.setComponent(1, j);
            }
        }
        return _this;
    }
    /**
     * @method vertex
     * @param i An integer. 0 <= i < uLength
     * @param j An integer. 0 <= j < vLength
     */
    GridLines.prototype.vertex = function (i, j) {
        mustBeInteger('i', i);
        mustBeInteger('j', j);
        return this.vertices[vertexIndex(i, j, this.uLength, this.vLength)];
    };
    return GridLines;
}(GridPrimitive));

/**
 * Computes the vertex index from integer coordinates.
 * Both lengths are included for symmetry!
 */
function vertexIndex$1(i, j, iLength, jLength) {
    mustBeInteger('iLength', iLength);
    mustBeInteger('jLength', jLength);
    return j * iLength + i;
}
function pointsForGrid(uSegments, uClosed, vSegments, vClosed) {
    var iLength = numPostsForFence(uSegments, uClosed);
    var jLength = numPostsForFence(vSegments, vClosed);
    var elements = [];
    for (var i = 0; i < iLength; i++) {
        for (var j = 0; j < jLength; j++) {
            elements.push(vertexIndex$1(i, j, iLength, jLength));
        }
    }
    return elements;
}
/**
 *
 */
var GridPoints = (function (_super) {
    __extends(GridPoints, _super);
    /**
     * @param uSegments
     * @param uClosed
     * @param vSegments
     * @param vClosed
     */
    function GridPoints(uSegments, uClosed, vSegments, vClosed) {
        var _this = _super.call(this, exports.BeginMode.POINTS, uSegments, vSegments) || this;
        _this.elements = pointsForGrid(uSegments, uClosed, vSegments, vClosed);
        var iLength = numPostsForFence(uSegments, uClosed);
        var jLength = numPostsForFence(vSegments, vClosed);
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < jLength; j++) {
                var coords = _this.vertex(i, j).coords;
                coords.setComponent(0, i);
                coords.setComponent(1, j);
            }
        }
        return _this;
    }
    /**
     * @param i An integer. 0 <= i < uLength
     * @param j An integer. 0 <= j < vLength
     */
    GridPoints.prototype.vertex = function (i, j) {
        mustBeInteger('i', i);
        mustBeInteger('j', j);
        return this.vertices[vertexIndex$1(i, j, this.uLength, this.vLength)];
    };
    return GridPoints;
}(GridPrimitive));

/**
 *
 */
function topology$1(mode, uSegments, uClosed, vSegments, vClosed) {
    switch (mode) {
        case exports.GeometryMode.POINT: {
            return new GridPoints(uSegments, uClosed, vSegments, vClosed);
        }
        case exports.GeometryMode.WIRE: {
            return new GridLines(uSegments, uClosed, vSegments, vClosed);
        }
        case exports.GeometryMode.MESH: {
            return new GridTriangleStrip(uSegments, vSegments);
        }
        default: {
            throw new Error("mode must be POINT = " + exports.GeometryMode.POINT + ", WIRE = " + exports.GeometryMode.WIRE + " or MESH = " + exports.GeometryMode.MESH);
        }
    }
}
/**
 * Decorates the vertex with aPosition, aNormal, and aColor attributes,
 * but only if these functions are provided in the options.
 */
function transformVertex$1(vertex, u, v, options) {
    var aPosition = isDefined(options.aPosition) ? options.aPosition : void 0;
    var aNormal = isDefined(options.aNormal) ? options.aNormal : void 0;
    var aColor = isDefined(options.aColor) ? options.aColor : void 0;
    var aCoords = isDefined(options.aCoords) ? options.aCoords : void 0;
    if (isFunction(aCoords)) {
        var coords = aCoords(u, v);
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = Vector2.vector(coords.u, coords.v);
    }
    if (isFunction(aPosition)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(aPosition(u, v));
    }
    if (isFunction(aNormal)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(aNormal(u, v));
    }
    if (isFunction(aColor)) {
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Color.copy(aColor(u, v));
    }
}
function gridPrimitive(options) {
    var uMin = isDefined(options.uMin) ? mustBeNumber('uMin', options.uMin) : 0;
    var uMax = isDefined(options.uMax) ? mustBeNumber('uMax', options.uMax) : 1;
    var uSegments = isDefined(options.uSegments) ? mustBeNumber('uSegments', options.uSegments) : 1;
    var uClosed = isDefined(options.uClosed) ? mustBeBoolean('uClosed', options.uClosed) : false;
    var vMin = isDefined(options.vMin) ? mustBeNumber('vMin', options.vMin) : 0;
    var vMax = isDefined(options.vMax) ? mustBeNumber('vMax', options.vMax) : 1;
    var vSegments = isDefined(options.vSegments) ? mustBeNumber('vSegments', options.vSegments) : 1;
    var vClosed = isDefined(options.vClosed) ? mustBeBoolean('vClosed', options.vClosed) : false;
    var mode = isDefined(options.mode) ? options.mode : exports.GeometryMode.WIRE;
    var grid = topology$1(mode, uSegments, uClosed, vSegments, vClosed);
    var iLen = grid.uLength;
    var jLen = grid.vLength;
    if (uSegments > 0) {
        if (vSegments > 0) {
            for (var i = 0; i < iLen; i++) {
                for (var j = 0; j < jLen; j++) {
                    var vertex = grid.vertex(i, j);
                    var u = uMin + (uMax - uMin) * i / uSegments;
                    var v = vMin + (vMax - vMin) * j / vSegments;
                    transformVertex$1(vertex, u, v, options);
                }
            }
        }
        else {
            for (var i = 0; i < iLen; i++) {
                var vertex = grid.vertex(i, 0);
                var u = uMin + (uMax - uMin) * i / uSegments;
                var v = (vMin + vMax) / 2;
                transformVertex$1(vertex, u, v, options);
            }
        }
    }
    else {
        if (vSegments > 0) {
            for (var j = 0; j < jLen; j++) {
                var vertex = grid.vertex(0, j);
                var u = (uMin + uMax) / 2;
                var v = vMin + (vMax - vMin) * j / vSegments;
                transformVertex$1(vertex, u, v, options);
            }
        }
        else {
            var vertex = grid.vertex(0, 0);
            var u = (uMin + uMax) / 2;
            var v = (vMin + vMax) / 2;
            transformVertex$1(vertex, u, v, options);
        }
    }
    return grid.toPrimitive();
}

/**
 * A Geometry for representing functions of two scalar parameters.
 */
var GridGeometry = (function (_super) {
    __extends(GridGeometry, _super);
    /**
     *
     */
    function GridGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'GridGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, gridPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('GridGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GridGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('GridGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    GridGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return GridGeometry;
}(GeometryElements));

var DEFAULT_MERIDIAN = vec(0, 0, 1);
var DEFAULT_ZENITH = vec(0, 1, 0);
var DEFAULT_AZIMUTH_START = 0;
var DEFAULT_AZIMUTH_LENGTH = 2 * Math.PI;
var DEFAULT_AZIMUTH_SEGMENTS = 20;
var DEFAULT_ELEVATION_START = 0;
var DEFAULT_ELEVATION_LENGTH = Math.PI;
var DEFAULT_ELEVATION_SEGMENTS = 10;
var DEFAULT_RADIUS = 1;
function computeVertices(stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, points, uvs) {
    var generator = Spinor3.dual(DEFAULT_ZENITH, false);
    var iLength = elevationSegments + 1;
    var jLength = azimuthSegments + 1;
    for (var i = 0; i < iLength; i++) {
        var v = i / elevationSegments;
        var θ = elevationStart + v * elevationLength;
        var arcRadius = Math.sin(θ);
        var R = Geometric3.fromSpinor(generator).scale(-azimuthStart / 2).exp();
        var begin = Geometric3.fromVector(DEFAULT_MERIDIAN).rotate(R).scale(arcRadius);
        var arcPoints = arc3(begin, azimuthLength, generator, azimuthSegments);
        /**
         * Displacement that we need to add (in the axis direction) to each arc point to get the
         * distance position parallel to the axis correct.
         */
        var cosθ = Math.cos(θ);
        var displacement = cosθ;
        for (var j = 0; j < jLength; j++) {
            var point = arcPoints[j].add(DEFAULT_ZENITH, displacement).stress(stress).rotate(tilt).add(offset);
            points.push(point);
            var u = j / azimuthSegments;
            uvs.push(new Vector2([u, v]));
        }
    }
}
function quadIndex(i, j, innerSegments) {
    return i * (innerSegments + 1) + j;
}
function vertexIndex$2(qIndex, n, innerSegments) {
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
            // Form a quadrilateral. v0 through v3 give the indices into the points array.
            var v0 = vertexIndex$2(qIndex, 0, widthSegments);
            var v1 = vertexIndex$2(qIndex, 1, widthSegments);
            var v2 = vertexIndex$2(qIndex, 2, widthSegments);
            var v3 = vertexIndex$2(qIndex, 3, widthSegments);
            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0 = Vector3.copy(points[v0]).normalize();
            var n1 = Vector3.copy(points[v1]).normalize();
            var n2 = Vector3.copy(points[v2]).normalize();
            var n3 = Vector3.copy(points[v3]).normalize();
            // Grab the uv coordinates too.
            var uv0 = uvs[v0].clone();
            var uv1 = uvs[v1].clone();
            var uv2 = uvs[v2].clone();
            var uv3 = uvs[v3].clone();
            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              // The other patches create two triangles.
              geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3])
              geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1])
            }
            */
            geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3]);
            geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1]);
        }
    }
}
function makeLineSegments(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            var qIndex = quadIndex(i, j, widthSegments);
            var v0 = vertexIndex$2(qIndex, 0, widthSegments);
            var v1 = vertexIndex$2(qIndex, 1, widthSegments);
            var v2 = vertexIndex$2(qIndex, 2, widthSegments);
            var v3 = vertexIndex$2(qIndex, 3, widthSegments);
            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0 = Vector3.copy(points[v0]).normalize();
            var n1 = Vector3.copy(points[v1]).normalize();
            var n2 = Vector3.copy(points[v2]).normalize();
            var n3 = Vector3.copy(points[v3]).normalize();
            // Grab the uv coordinates too.
            var uv0 = uvs[v0].clone();
            var uv1 = uvs[v1].clone();
            var uv2 = uvs[v2].clone();
            var uv3 = uvs[v3].clone();
            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1])
              geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2])
              geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3])
              geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0])
            }
            */
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
            var v0 = vertexIndex$2(qIndex, 0, widthSegments);
            var v1 = vertexIndex$2(qIndex, 1, widthSegments);
            var v2 = vertexIndex$2(qIndex, 2, widthSegments);
            var v3 = vertexIndex$2(qIndex, 3, widthSegments);
            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0 = Vector3.copy(points[v0]).normalize();
            var n1 = Vector3.copy(points[v1]).normalize();
            var n2 = Vector3.copy(points[v2]).normalize();
            var n3 = Vector3.copy(points[v3]).normalize();
            // Grab the uv coordinates too.
            var uv0 = uvs[v0].clone();
            var uv1 = uvs[v1].clone();
            var uv2 = uvs[v2].clone();
            var uv3 = uvs[v3].clone();
            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              geometry.point([points[v0]], [n0], [uv0])
              geometry.point([points[v1]], [n1], [uv1])
              geometry.point([points[v2]], [n2], [uv2])
              geometry.point([points[v3]], [n3], [uv3])
            }
            */
            geometry.point([points[v0]], [n0], [uv0]);
            geometry.point([points[v1]], [n1], [uv1]);
            geometry.point([points[v2]], [n2], [uv2]);
            geometry.point([points[v3]], [n3], [uv3]);
        }
    }
}
var SphereSimplexPrimitivesBuilder = (function (_super) {
    __extends(SphereSimplexPrimitivesBuilder, _super);
    function SphereSimplexPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.tilt = Spinor3.one.clone();
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
    Object.defineProperty(SphereSimplexPrimitivesBuilder.prototype, "radius", {
        get: function () {
            return this.stress.x;
        },
        set: function (radius) {
            mustBeNumber('radius', radius);
            this.stress.x = radius;
            this.stress.y = radius;
            this.stress.z = radius;
        },
        enumerable: true,
        configurable: true
    });
    SphereSimplexPrimitivesBuilder.prototype.isModified = function () {
        return _super.prototype.isModified.call(this);
    };
    SphereSimplexPrimitivesBuilder.prototype.setModified = function (modified) {
        _super.prototype.setModified.call(this, modified);
        return this;
    };
    SphereSimplexPrimitivesBuilder.prototype.regenerate = function () {
        this.data = [];
        // Output. Could this be {[name:string]:VertexN<number>}[]
        var points = [];
        var uvs = [];
        computeVertices(this.stress, this.tilt, this.offset, this.azimuthStart, this.azimuthLength, this.azimuthSegments, this.elevationStart, this.elevationLength, this.elevationSegments, points, uvs);
        switch (this.k) {
            case SimplexMode.EMPTY: {
                makeTriangles(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.POINT: {
                makePoints(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.LINE: {
                makeLineSegments(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.TRIANGLE: {
                makeTriangles(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            default: {
                console.warn(this.k + "-simplex is not supported for geometry generation.");
            }
        }
        this.setModified(false);
    };
    return SphereSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder));
function spherePrimitive(options) {
    if (options === void 0) { options = { kind: 'SphereGeometry' }; }
    var builder = new SphereSimplexPrimitivesBuilder();
    // Radius
    if (isNumber(options.radius)) {
        builder.radius = options.radius;
    }
    else if (isUndefined(options.radius)) {
        builder.radius = DEFAULT_RADIUS;
    }
    else {
        mustBeNumber('radius', options.radius);
    }
    if (isInteger(options.mode)) {
        switch (options.mode) {
            case exports.GeometryMode.POINT: {
                builder.k = SimplexMode.POINT;
                break;
            }
            case exports.GeometryMode.WIRE: {
                builder.k = SimplexMode.LINE;
                break;
            }
            case exports.GeometryMode.MESH: {
                builder.k = SimplexMode.TRIANGLE;
                break;
            }
            default: {
                throw new Error("options.mode must be POINT=" + exports.GeometryMode.POINT + " or WIRE=" + exports.GeometryMode.WIRE + " or MESH=" + exports.GeometryMode.MESH + ".");
            }
        }
    }
    else if (isUndefined(options.mode)) {
        builder.k = SimplexMode.TRIANGLE;
    }
    else {
        mustBeInteger('mode', options.mode);
    }
    // Azimuth Start
    if (isNumber(options.azimuthStart)) {
        builder.azimuthStart = options.azimuthStart;
    }
    else if (isUndefined(options.azimuthStart)) {
        builder.azimuthStart = DEFAULT_AZIMUTH_START;
    }
    else {
        mustBeNumber('azimuthStart', options.azimuthStart);
    }
    // Azimuth Length
    if (isNumber(options.azimuthLength)) {
        builder.azimuthLength = options.azimuthLength;
    }
    else if (isUndefined(options.azimuthLength)) {
        builder.azimuthLength = DEFAULT_AZIMUTH_LENGTH;
    }
    else {
        mustBeNumber('azimuthLength', options.azimuthLength);
    }
    // Azimuth Segments
    if (isInteger(options.azimuthSegments)) {
        builder.azimuthSegments = mustBeGE('azimuthSegements', options.azimuthSegments, 3);
    }
    else if (isUndefined(options.azimuthSegments)) {
        builder.azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;
    }
    else {
        mustBeInteger('azimuthSegments', options.azimuthSegments);
    }
    // Elevation Start
    if (isNumber(options.elevationStart)) {
        builder.elevationStart = options.elevationStart;
    }
    else if (isUndefined(options.elevationStart)) {
        builder.elevationStart = DEFAULT_ELEVATION_START;
    }
    else {
        mustBeNumber('elevationStart', options.elevationStart);
    }
    // Elevation Length
    if (isNumber(options.elevationLength)) {
        builder.elevationLength = options.elevationLength;
    }
    else if (isUndefined(options.elevationLength)) {
        builder.elevationLength = DEFAULT_ELEVATION_LENGTH;
    }
    else {
        mustBeNumber('elevationLength', options.elevationLength);
    }
    // Elevation Segments
    if (isInteger(options.elevationSegments)) {
        builder.elevationSegments = mustBeGE('elevationSegments', options.elevationSegments, 2);
    }
    else if (isUndefined(options.elevationSegments)) {
        builder.elevationSegments = DEFAULT_ELEVATION_SEGMENTS;
    }
    else {
        mustBeInteger('elevationSegments', options.elevationSegments);
    }
    if (options.stress) {
        builder.stress.copy(options.stress);
    }
    if (options.offset) {
        builder.offset.copy(options.offset);
    }
    var primitives = builder.toPrimitives();
    if (primitives.length === 1) {
        return primitives[0];
    }
    else {
        throw new Error("Expecting SphereSimplexPrimitivesBuilder to return one Primitive.");
    }
}
/**
 * A convenience class for creating a sphere.
 */
var SphereGeometry = (function (_super) {
    __extends(SphereGeometry, _super);
    /**
     *
     */
    function SphereGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'SphereGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, spherePrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('SphereGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    SphereGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('SphereGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    SphereGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return SphereGeometry;
}(GeometryElements));

/**
 * Scratch variables to avoid creating temporary objects.
 */
var a$1 = Vector3.zero();
var b$1 = Vector3.zero();
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
 * Computes the texture coordinates and sticks them in the hidden `uv` property as a Vector2.
 * OK!
 */
function prepare(point, points) {
    // Copy the point and project it onto the unit sphere.
    var vertex = Vector3.copy(point).normalize();
    points.push(vertex);
    // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
    var u = azimuth(point) / 2 / Math.PI + 0.5;
    var v = inclination(point) / Math.PI + 0.5;
    var something = vertex;
    // This is a bit ugly from a type-safety perspective.
    // We could avoid it by working with a Vertex object instead.
    something['uv'] = new Vector2([u, 1 - v]);
    return vertex;
}
// Texture fixing helper.
function correctUV(uv, vector, azimuth) {
    if ((azimuth < 0) && (uv.x === 1))
        uv = new Vector2([uv.x - 1, uv.y]);
    if ((vector.x === 0) && (vector.z === 0))
        uv = new Vector2([azimuth / 2 / Math.PI + 0.5, uv.y]);
    return uv.clone();
}
/**
 * Computes the normal associated with the three position vectors taken to represent a triangle with CCW-outside orientation.
 */
function normal(v1, v2, v3) {
    a$1.copy(v2).sub(v1);
    b$1.copy(v3).sub(v2);
    return Vector3.copy(a$1).cross(b$1).normalize();
}
/**
 * In elementary geometry, a polyhedron is a solid in three dimensions with
 * flat polygonal faces, straight edges and sharp corners or vertices.
 */
var PolyhedronBuilder = (function (_super) {
    __extends(PolyhedronBuilder, _super);
    /**
     *
     * param vertices {number} An array of 3 * N numbers representing N vertices.
     * param indices {number} An array of 3 * M numbers representing M triangles.
     *
     * param radius The distance of the polyhedron points from the origin.
     * param detail The number of times to subdivide the triangles in the faces.
     */
    function PolyhedronBuilder(vertices, indices, radius, detail) {
        if (radius === void 0) { radius = 1; }
        if (detail === void 0) { detail = 0; }
        var _this = _super.call(this) || this;
        var points = [];
        // Normalize the vertices onto a unit sphere, compute UV coordinates and return the points.
        for (var i = 0, l = vertices.length; i < l; i += 3) {
            prepare(new Vector3([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
        }
        var faces = [];
        // Compute the Simplex faces, as given by the triples of indices.
        for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
            var v1 = points[indices[i]];
            var v2 = points[indices[i + 1]];
            var v3 = points[indices[i + 2]];
            var n = normal(v1, v2, v3);
            var simplex = new Simplex(SimplexMode.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v1;
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v2;
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v3;
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            faces[j] = simplex;
        }
        // Further subdivide the faces if more detail is required.
        for (var i = 0, facesLength = faces.length; i < facesLength; i++) {
            subdivide(faces[i], detail, points, _this);
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
            points[i].scale(radius);
        }
        // Merge vertices
        _this.mergeVertices();
        function centroid(v1, v2, v3) {
            var x = (v1.x + v2.x + v3.x) / 3;
            var y = (v1.y + v2.y + v3.y) / 3;
            var z = (v1.z + v2.z + v3.z) / 3;
            return { x: x, y: y, z: z };
        }
        // Approximate a curved face with recursively sub-divided triangles.
        function make(v1, v2, v3, builder) {
            var azi = azimuth(centroid(v1, v2, v3));
            var something1 = v1;
            var something2 = v2;
            var something3 = v3;
            // This is a bit ugly from a type-safety perspective.
            var uv1 = correctUV(something1['uv'], v1, azi);
            var uv2 = correctUV(something2['uv'], v2, azi);
            var uv3 = correctUV(something3['uv'], v3, azi);
            var n = normal(v1, v2, v3);
            var simplex = new Simplex(SimplexMode.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(v1);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv1;
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(v2);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv2;
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(v3);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv3;
            builder.data.push(simplex);
        }
        // Subdivide a face to the required detail level.
        function subdivide(face, detail, points, builder) {
            var cols = Math.pow(2, detail);
            var a = prepare(face.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var b = prepare(face.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var c = prepare(face.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var v = [];
            // Construct all of the vertices for this subdivision.
            for (var i = 0; i <= cols; i++) {
                v[i] = [];
                var aj = prepare(Vector3.copy(a).lerp(c, i / cols), points);
                var bj = prepare(Vector3.copy(b).lerp(c, i / cols), points);
                var rows = cols - i;
                for (var j = 0; j <= rows; j++) {
                    if (j === 0 && i === cols) {
                        v[i][j] = aj;
                    }
                    else {
                        v[i][j] = prepare(Vector3.copy(aj).lerp(bj, j / rows), points);
                    }
                }
            }
            // Construct all of the faces.
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
        // Ignore, we shouldn't but we do.
    };
    return PolyhedronBuilder;
}(SimplexPrimitivesBuilder));

//
// Imagine 4 vertices sitting on some of the vertices of a cube of side-length 2.
// The vertices are:
// [0] (+1, +1, +1)
// [1] (-1, -1, +1)
// [2] (-1, +1, -1)
// [3] (+1, -1, -1)
//
// This is seen to form a tetrahedron because all of the side lengths are
// the same, sqrt(8), because the side length of the cube is 2. So we have
// four equilateral triangles stiched together to form a tetrahedron.
//
var vertices = [
    +1, +1, +1, -1, -1, +1, -1, +1, -1, +1, -1, -1
];
//
// The following 12 indices comprise four triangles.
// Each triangle is traversed counter-clockwise as seen from the outside. 
//
var indices = [
    2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
];
function tetrahedronPrimitive(options) {
    if (options === void 0) { options = { kind: 'TetrahedronGeometry' }; }
    var radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 1.0;
    var builder = new PolyhedronBuilder(vertices, indices, radius);
    var primitives = builder.toPrimitives();
    if (primitives.length === 1) {
        return primitives[0];
    }
    else {
        throw new Error("Expecting PolyhedronBuilder to return one Primitive.");
    }
}

/**
 * A convenience class for creating a tetrahedron geometry.
 */
var TetrahedronGeometry = (function (_super) {
    __extends(TetrahedronGeometry, _super);
    /**
     *
     */
    function TetrahedronGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'TetrahedronGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, tetrahedronPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('TetrahedronGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    TetrahedronGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('TetrahedronGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    TetrahedronGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return TetrahedronGeometry;
}(GeometryElements));

function makeWebGLProgram(ctx, vertexShaderSrc, fragmentShaderSrc, attribs) {
    // create our shaders
    var vs = makeWebGLShader(ctx, vertexShaderSrc, ctx.VERTEX_SHADER);
    var fs = makeWebGLShader(ctx, fragmentShaderSrc, ctx.FRAGMENT_SHADER);
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

/**
 *
 */
var ShaderMaterial = (function (_super) {
    __extends(ShaderMaterial, _super);
    /**
     * @param vertexShaderSrc The vertex shader source code.
     * @param fragmentShaderSrc The fragment shader source code.
     * @param attribs The attribute ordering.
     * @param engine The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    function ShaderMaterial(vertexShaderSrc, fragmentShaderSrc, attribs, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager) || this;
        /**
         *
         */
        _this._attributesByName = {};
        _this._attributesByIndex = [];
        /**
         *
         */
        _this._uniforms = {};
        _this.setLoggingName('ShaderMaterial');
        if (isDefined(vertexShaderSrc) && !isNull(vertexShaderSrc)) {
            _this._vertexShaderSrc = mustBeString('vertexShaderSrc', vertexShaderSrc);
        }
        if (isDefined(fragmentShaderSrc) && !isNull(fragmentShaderSrc)) {
            _this._fragmentShaderSrc = mustBeString('fragmentShaderSrc', fragmentShaderSrc);
        }
        _this._attribs = mustBeArray('attribs', attribs);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    ShaderMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ShaderMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    ShaderMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        mustBeUndefined(this.getLoggingName(), this._program);
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    ShaderMaterial.prototype.contextGain = function () {
        var gl = this.contextManager.gl;
        if (!this._program && isString(this._vertexShaderSrc) && isString(this._fragmentShaderSrc)) {
            this._program = makeWebGLProgram(gl, this._vertexShaderSrc, this._fragmentShaderSrc, this._attribs);
            this._attributesByName = {};
            this._attributesByIndex = [];
            this._uniforms = {};
            var aLen = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
            for (var a = 0; a < aLen; a++) {
                var attribInfo = gl.getActiveAttrib(this._program, a);
                var attrib = new Attrib(this.contextManager, attribInfo);
                this._attributesByName[attribInfo.name] = attrib;
                this._attributesByIndex.push(attrib);
            }
            var uLen = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
            for (var u = 0; u < uLen; u++) {
                var uniformInfo = gl.getActiveUniform(this._program, u);
                this._uniforms[uniformInfo.name] = new Uniform(uniformInfo);
            }
            // TODO: This would be more efficient over the array.
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
    /**
     *
     */
    ShaderMaterial.prototype.contextLost = function () {
        this._program = void 0;
        for (var aName in this._attributesByName) {
            // TODO: This would be better over the array.
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
    /**
     *
     */
    ShaderMaterial.prototype.contextFree = function () {
        if (this._program) {
            var gl = this.contextManager.gl;
            if (gl) {
                if (!gl.isContextLost()) {
                    gl.deleteProgram(this._program);
                }
                else {
                    // WebGL has lost the context, effectively cleaning up everything.
                }
            }
            else {
                console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
            }
            this._program = void 0;
        }
        // TODO
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
        /**
         *
         */
        get: function () {
            return this._vertexShaderSrc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderMaterial.prototype, "fragmentShaderSrc", {
        /**
         *
         */
        get: function () {
            return this._fragmentShaderSrc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderMaterial.prototype, "attributeNames", {
        /**
         *
         */
        get: function () {
            // I wonder if it might be better to use the array and preserve order. 
            var attributes = this._attributesByName;
            if (attributes) {
                return Object.keys(attributes);
            }
            else {
                return void 0;
            }
        },
        set: function (unused) {
            throw new Error(readOnly('attributeNames').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Convenience method for dereferencing the name to an attribute location, followed by enabling the attribute.
     */
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
    /**
     *
     */
    ShaderMaterial.prototype.enableAttribs = function () {
        var attribLocations = this._attributesByName;
        if (attribLocations) {
            // TODO: Store loactions as a plain array in order to avoid temporaries (aNames)
            var aNames = Object.keys(attribLocations);
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                attribLocations[aNames[i]].enable();
            }
        }
    };
    /**
     *
     */
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
    /**
     *
     */
    ShaderMaterial.prototype.disableAttribs = function () {
        var attribLocations = this._attributesByName;
        if (attribLocations) {
            // TODO: Store loactions as a plain array in order to avoid temporaries (aNames)
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
            attrib.config(size, exports.DataType.FLOAT, normalized, stride, offset);
        }
        return this;
    };
    ShaderMaterial.prototype.getAttrib = function (indexOrName) {
        if (typeof indexOrName === 'number') {
            // FIXME
            return this._attributesByIndex[indexOrName];
        }
        else if (typeof indexOrName === 'string') {
            return this._attributesByName[indexOrName];
        }
        else {
            throw new TypeError("indexOrName must be a number or a string");
        }
    };
    /**
     * Returns the location (index) of the attribute with the specified name.
     * Returns <code>-1</code> if the name does not correspond to an attribute.
     */
    ShaderMaterial.prototype.getAttribLocation = function (name) {
        var attribLoc = this._attributesByName[name];
        if (attribLoc) {
            return attribLoc.index;
        }
        else {
            return -1;
        }
    };
    /**
     * Returns a <code>Uniform</code> object corresponding to the <code>uniform</code>
     * parameter of the same name in the shader code. If a uniform parameter of the specified name
     * does not exist, this method returns undefined (void 0).
     */
    ShaderMaterial.prototype.getUniform = function (name) {
        var uniforms = this._uniforms;
        if (uniforms[name]) {
            return uniforms[name];
        }
        else {
            return void 0;
        }
    };
    /**
     * <p>
     * Determines whether a <code>uniform</code> with the specified <code>name</code> exists in the <code>WebGLProgram</code>.
     * </p>
     */
    ShaderMaterial.prototype.hasUniform = function (name) {
        mustBeString('name', name);
        return isDefined(this._uniforms[name]);
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
    /**
     *
     */
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
    /**
     * @param mode Specifies the type of the primitive being rendered.
     * @param first Specifies the starting index in the array of vector points.
     * @param count The number of points to be rendered.
     */
    ShaderMaterial.prototype.drawArrays = function (mode, first, count) {
        var gl = this.gl;
        if (gl) {
            gl.drawArrays(mode, first, count);
        }
        return this;
    };
    /**
     * @param mode Specifies the type of the primitive being rendered.
     * @param count The number of elements to be rendered.
     * @param type The type of the values in the element array buffer.
     * @param offset Specifies an offset into the element array buffer.
     */
    ShaderMaterial.prototype.drawElements = function (mode, count, type, offset) {
        var gl = this.gl;
        if (gl) {
            gl.drawElements(mode, count, type, offset);
        }
        return this;
    };
    return ShaderMaterial;
}(ShareableContextConsumer));

function getHTMLElementById(elementId, dom) {
    var element = dom.getElementById(mustBeString('elementId', elementId));
    if (element) {
        return element;
    }
    else {
        throw new Error("'" + elementId + "' is not a valid element identifier.");
    }
}
function vertexShaderSrc(vsId, dom) {
    mustBeString('vsId', vsId);
    mustBeObject('dom', dom);
    return getHTMLElementById(vsId, dom).textContent;
}
function fragmentShaderSrc(fsId, dom) {
    mustBeString('fsId', fsId);
    mustBeObject('dom', dom);
    return getHTMLElementById(fsId, dom).textContent;
}
function assign(elementId, dom, result) {
    var htmlElement = dom.getElementById(elementId);
    if (htmlElement instanceof HTMLScriptElement) {
        var script = htmlElement;
        if (isString(script.type)) {
            if (script.type.indexOf('vertex') >= 0) {
                result[0] = elementId;
            }
            else if (script.type.indexOf('fragment') >= 0) {
                result[1] = elementId;
            }
            else {
                // Do nothing
            }
        }
        if (isString(script.textContent)) {
            if (script.textContent.indexOf('gl_Position') >= 0) {
                result[0] = elementId;
            }
            else if (script.textContent.indexOf('gl_FragColor') >= 0) {
                result[1] = elementId;
            }
            else {
                // Do nothing
            }
        }
    }
}
function detectShaderType(scriptIds, dom) {
    mustBeArray('scriptIds', scriptIds);
    mustSatisfy('scriptIds', scriptIds.length === 2, function () { return 'have two script element identifiers.'; });
    var result = [scriptIds[0], scriptIds[1]];
    assign(scriptIds[0], dom, result);
    assign(scriptIds[1], dom, result);
    return result;
}
/**
 * A shareable WebGL program based upon shader source code in HTML script elements.
 *
 * This class provides a convenient way of creating custom GLSL programs.
 * The scripts are lazily loaded so that the constructor may be called before
 * the DOM has finished loading.
 */
var HTMLScriptsMaterial = (function (_super) {
    __extends(HTMLScriptsMaterial, _super);
    /**
     * @param scriptIds The element identifiers for the vertex and fragment shader respectively.
     * @param dom The document object model that owns the script elements.
     * @param attribs An array of strings containing the order of attributes.
     * @param contextManager
     * @param levelUp
     */
    function HTMLScriptsMaterial(scriptIds, dom, attribs, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc(detectShaderType(scriptIds, dom)[0], dom), fragmentShaderSrc(detectShaderType(scriptIds, dom)[1], dom), attribs, contextManager, levelUp + 1) || this;
        _this.setLoggingName('HTMLScriptsMaterial');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    HTMLScriptsMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('HTMLScriptsMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    HTMLScriptsMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return HTMLScriptsMaterial;
}(ShaderMaterial));

/**
 * Policy for how an attribute variable name is determined.
 */
function getAttribVarName(attribute, varName) {
    mustBeObject('attribute', attribute);
    mustBeString('varName', varName);
    return isDefined(attribute.name) ? mustBeString('attribute.name', attribute.name) : varName;
}

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
        case 4: {
            return 'vec4';
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
        case GraphicsProgramSymbols.ATTRIBUTE_COLOR: {
            // No need to hard-code to 'vec3' anymore.
            return sizeType(size);
        }
        default: {
            return sizeType(size);
        }
    }
}

function vColorRequired(attributes, uniforms) {
    return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols.UNIFORM_COLOR];
}

function vCoordsRequired(attributes, uniforms) {
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniforms', uniforms);
    return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS];
}

function vLightRequired(attributes, uniforms) {
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniforms', uniforms);
    return !!uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
}

/**
 * Policy for how a uniform variable name is determined.
 */
function getUniformVarName(uniform, varName) {
    expectArg('uniform', uniform).toBeObject();
    expectArg('varName', varName).toBeString();
    return isDefined(uniform.name) ? expectArg('uniform.name', uniform.name).toBeString().value : varName;
}

var emitFragmentPrecision = false;
function getUniformCodeName(uniforms, name) {
    return getUniformVarName(uniforms[name], name);
}
var SPACE = ' ';
var UNIFORM = 'uniform' + SPACE;
var SEMICOLON = ';';
/**
 * Generates a fragment shader
 */
function fragmentShaderSrc$2(attributes, uniforms, vColor, vCoords, vLight) {
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniforms', uniforms);
    mustBeBoolean(GraphicsProgramSymbols.VARYING_COLOR, vColor);
    mustBeBoolean(GraphicsProgramSymbols.VARYING_COORDS, vCoords);
    mustBeBoolean(GraphicsProgramSymbols.VARYING_LIGHT, vLight);
    var lines = [];
    lines.push("// fragment shader generated by " + config.NAMESPACE + " " + config.VERSION);
    // Only the fragment shader requires an explicit precision for floats.
    // For fragment shaders, highp might not be available, which can be tested using the GL_FRAGMENT_PRECISION_HIGH macro.
    // TODO: Make this an option.
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
        lines.push("varying highp vec4 " + GraphicsProgramSymbols.VARYING_COLOR + ";");
    }
    if (vCoords) {
        lines.push("varying highp vec2 " + GraphicsProgramSymbols.VARYING_COORDS + ";");
    }
    if (vLight) {
        lines.push("varying highp vec3 " + GraphicsProgramSymbols.VARYING_LIGHT + ";");
    }
    for (var uName in uniforms) {
        if (uniforms.hasOwnProperty(uName)) {
            switch (uniforms[uName].glslType) {
                case 'sampler2D': {
                    lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
                    break;
                }
                default: {
                    // Do nothing.
                }
            }
        }
    }
    lines.push("void main(void) {");
    if (vLight) {
        if (vColor) {
            if (vCoords && uniforms[GraphicsProgramSymbols.UNIFORM_IMAGE]) {
                lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols.UNIFORM_IMAGE + ", " + GraphicsProgramSymbols.VARYING_COORDS + ") * vec4(" + GraphicsProgramSymbols.VARYING_COLOR + ".xyz * " + GraphicsProgramSymbols.VARYING_LIGHT + ", " + GraphicsProgramSymbols.VARYING_COLOR + ".a);");
            }
            else {
                lines.push("  gl_FragColor = vec4(" + GraphicsProgramSymbols.VARYING_COLOR + ".xyz * " + GraphicsProgramSymbols.VARYING_LIGHT + ", " + GraphicsProgramSymbols.VARYING_COLOR + ".a);");
            }
        }
        else {
            if (vCoords && uniforms[GraphicsProgramSymbols.UNIFORM_IMAGE]) {
                lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols.UNIFORM_IMAGE + ", " + GraphicsProgramSymbols.VARYING_COORDS + ") * vec4(" + GraphicsProgramSymbols.VARYING_LIGHT + ", 1.0);");
            }
            else {
                lines.push("  gl_FragColor = vec4(" + GraphicsProgramSymbols.VARYING_LIGHT + ", 1.0);");
            }
        }
    }
    else {
        if (vColor) {
            if (vCoords && uniforms[GraphicsProgramSymbols.UNIFORM_IMAGE]) {
                lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols.UNIFORM_IMAGE + ", " + GraphicsProgramSymbols.VARYING_COORDS + ") * " + GraphicsProgramSymbols.VARYING_COLOR + ";");
            }
            else {
                lines.push("  gl_FragColor = " + GraphicsProgramSymbols.VARYING_COLOR + ";");
            }
        }
        else {
            if (vCoords && uniforms[GraphicsProgramSymbols.UNIFORM_IMAGE]) {
                lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols.UNIFORM_IMAGE + ", " + GraphicsProgramSymbols.VARYING_COORDS + ");");
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

function getUniformCodeName$1(uniforms, name) {
    return getUniformVarName(uniforms[name], name);
}
var SPACE$1 = ' ';
var ATTRIBUTE = 'attribute' + SPACE$1;
var UNIFORM$1 = 'uniform' + SPACE$1;
var COMMA = ',' + SPACE$1;
var SEMICOLON$1 = ';';
var LPAREN = '(';
var RPAREN = ')';
var TIMES = SPACE$1 + '*' + SPACE$1;
var ASSIGN = SPACE$1 + '=' + SPACE$1;
var DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME = "directionalLightCosineFactor";
/**
 * Generates a vertex shader.
 */
function vertexShaderSrc$2(attributes, uniforms, vColor, vCoords, vLight) {
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniforms', uniforms);
    mustBeBoolean(GraphicsProgramSymbols.VARYING_COLOR, vColor);
    mustBeBoolean(GraphicsProgramSymbols.VARYING_COORDS, vCoords);
    mustBeBoolean(GraphicsProgramSymbols.VARYING_LIGHT, vLight);
    var lines = [];
    lines.push("// vertex shader generated by " + config.NAMESPACE + " " + config.VERSION);
    // The precision is implicitly highp for vertex shaders.
    // So there is no need to add preamble for changing the precision unless
    // we want to lower the precision.
    for (var aName in attributes) {
        if (attributes.hasOwnProperty(aName)) {
            lines.push(ATTRIBUTE + attributes[aName].glslType + SPACE$1 + getAttribVarName(attributes[aName], aName) + SEMICOLON$1);
        }
    }
    for (var uName in uniforms) {
        if (uniforms.hasOwnProperty(uName)) {
            switch (uniforms[uName].glslType) {
                case 'sampler2D': {
                    break;
                }
                default: {
                    lines.push(UNIFORM$1 + uniforms[uName].glslType + SPACE$1 + getUniformCodeName$1(uniforms, uName) + SEMICOLON$1);
                }
            }
        }
    }
    if (vColor) {
        lines.push("varying highp vec4 " + GraphicsProgramSymbols.VARYING_COLOR + ";");
    }
    if (vCoords) {
        lines.push("varying highp vec2 " + GraphicsProgramSymbols.VARYING_COORDS + ";");
    }
    if (vLight) {
        lines.push("varying highp vec3 " + GraphicsProgramSymbols.VARYING_LIGHT + ";");
    }
    lines.push("void main(void) {");
    var glPosition = [];
    glPosition.unshift(SEMICOLON$1);
    if (attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION]) {
        switch (attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION].glslType) {
            case 'float': {
                // This case would be unusual; just providing an x-coordinate.
                // We must provide defaults for the y-, z-, and w-coordinates.
                glPosition.unshift(RPAREN);
                glPosition.unshift('1.0');
                glPosition.unshift(COMMA);
                glPosition.unshift('0.0');
                glPosition.unshift(COMMA);
                glPosition.unshift('0.0');
                glPosition.unshift(COMMA);
                glPosition.unshift(getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], GraphicsProgramSymbols.ATTRIBUTE_POSITION));
                glPosition.unshift(LPAREN);
                glPosition.unshift('vec4');
                break;
            }
            case 'vec2': {
                // This case happens when the user wants to work in 2D.
                // We must provide a value for the homogeneous w-coordinate,
                // as well as the z-coordinate.
                glPosition.unshift(RPAREN);
                glPosition.unshift('1.0');
                glPosition.unshift(COMMA);
                glPosition.unshift('0.0');
                glPosition.unshift(COMMA);
                glPosition.unshift(getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], GraphicsProgramSymbols.ATTRIBUTE_POSITION));
                glPosition.unshift(LPAREN);
                glPosition.unshift('vec4');
                break;
            }
            case 'vec3': {
                // This is probably the most common case, 3D but only x-, y-, z-coordinates.
                // We must provide a value for the homogeneous w-coordinate.
                glPosition.unshift(RPAREN);
                glPosition.unshift('1.0');
                glPosition.unshift(COMMA);
                glPosition.unshift(getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], GraphicsProgramSymbols.ATTRIBUTE_POSITION));
                glPosition.unshift(LPAREN);
                glPosition.unshift('vec4');
                break;
            }
            case 'vec4': {
                // This happens when the use is working in homodeneous coordinates.
                // We don't need to use the constructor function at all.
                glPosition.unshift(getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], GraphicsProgramSymbols.ATTRIBUTE_POSITION));
                break;
            }
        }
    }
    else {
        glPosition.unshift("vec4(0.0, 0.0, 0.0, 1.0)");
    }
    // Reflections are applied first.
    if (uniforms[GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX]) {
        glPosition.unshift(TIMES);
        glPosition.unshift(getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX));
    }
    glPosition.unshift(ASSIGN);
    glPosition.unshift("gl_Position");
    glPosition.unshift('  ');
    lines.push(glPosition.join(''));
    if (uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE]) {
        lines.push("  gl_PointSize = " + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_POINT_SIZE) + ";");
    }
    if (vColor) {
        if (attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR]) {
            var colorAttribVarName = getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR], GraphicsProgramSymbols.ATTRIBUTE_COLOR);
            switch (attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR].glslType) {
                case 'vec4': {
                    lines.push("  " + GraphicsProgramSymbols.VARYING_COLOR + " = " + colorAttribVarName + SEMICOLON$1);
                    break;
                }
                case 'vec3': {
                    if (uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY]) {
                        lines.push("  " + GraphicsProgramSymbols.VARYING_COLOR + " = vec4(" + colorAttribVarName + ", " + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_OPACITY) + ");");
                    }
                    else {
                        lines.push("  " + GraphicsProgramSymbols.VARYING_COLOR + " = vec4(" + colorAttribVarName + ", 1.0);");
                    }
                    break;
                }
                default: {
                    throw new Error("Unexpected type for color attribute: " + attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR].glslType);
                }
            }
        }
        else if (uniforms[GraphicsProgramSymbols.UNIFORM_COLOR]) {
            var colorUniformVarName = getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_COLOR);
            switch (uniforms[GraphicsProgramSymbols.UNIFORM_COLOR].glslType) {
                case 'vec4': {
                    lines.push("  vColor = " + colorUniformVarName + SEMICOLON$1);
                    break;
                }
                case 'vec3': {
                    if (uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY]) {
                        lines.push("  " + GraphicsProgramSymbols.VARYING_COLOR + " = vec4(" + colorUniformVarName + ", " + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_OPACITY) + ");");
                    }
                    else {
                        lines.push("  " + GraphicsProgramSymbols.VARYING_COLOR + " = vec4(" + colorUniformVarName + ", 1.0);");
                    }
                    break;
                }
                default: {
                    throw new Error("Unexpected type for color uniform: " + uniforms[GraphicsProgramSymbols.UNIFORM_COLOR].glslType);
                }
            }
        }
        else {
            lines.push("  " + GraphicsProgramSymbols.VARYING_COLOR + " = vec4(1.0, 1.0, 1.0, 1.0);");
        }
    }
    if (vCoords) {
        lines.push("  " + GraphicsProgramSymbols.VARYING_COORDS + " = " + GraphicsProgramSymbols.ATTRIBUTE_COORDS + ";");
    }
    if (vLight) {
        if (uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] && attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL]) {
            lines.push("  vec3 L = normalize(" + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");");
            lines.push("  vec3 N = normalize(" + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName(attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL], GraphicsProgramSymbols.ATTRIBUTE_NORMAL) + ");");
            lines.push("  // The minus sign arises because L is the light direction, so we need dot(N, -L) = -dot(N, L)");
            lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(-dot(N, L), 0.0);");
            if (uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT]) {
                lines.push("  " + GraphicsProgramSymbols.VARYING_LIGHT + " = " + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT) + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
            }
            else {
                lines.push("  " + GraphicsProgramSymbols.VARYING_LIGHT + " = " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
            }
        }
        else {
            if (uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT]) {
                lines.push("  " + GraphicsProgramSymbols.VARYING_LIGHT + " = " + getUniformCodeName$1(uniforms, GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT) + ";");
            }
            else {
                lines.push("  " + GraphicsProgramSymbols.VARYING_LIGHT + " = vec3(1.0, 1.0, 1.0);");
            }
        }
    }
    lines.push("}");
    lines.push("");
    var code = lines.join("\n");
    return code;
}

function computeAttribParams(values) {
    var result = {};
    var keys = Object.keys(values);
    var keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
        var key = keys[i];
        var attribute = values[key];
        mustBeInteger('size', attribute.size);
        var varName = getAttribVarName(attribute, key);
        result[varName] = { glslType: glslAttribType(key, attribute.size) };
    }
    return result;
}
/**
 * GraphicsProgramBuilder is the builder pattern for generating vertex and fragment shader source code.
 */
var GraphicsProgramBuilder = (function () {
    /**
     * @param primitive
     */
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
        mustBeString('name', name);
        mustBeInteger('size', size);
        this.aMeta[name] = { size: size };
        return this;
    };
    GraphicsProgramBuilder.prototype.uniform = function (name, glslType) {
        mustBeString('name', name);
        mustBeString('glslType', glslType);
        this.uParams[name] = { glslType: glslType };
        return this;
    };
    /**
     * Computes vertex shader source code consistent with the state of this builder.
     */
    GraphicsProgramBuilder.prototype.vertexShaderSrc = function () {
        var aParams = computeAttribParams(this.aMeta);
        var vColor = vColorRequired(aParams, this.uParams);
        var vCoords = vCoordsRequired(aParams, this.uParams);
        var vLight = vLightRequired(aParams, this.uParams);
        return vertexShaderSrc$2(aParams, this.uParams, vColor, vCoords, vLight);
    };
    /**
     * Computes fragment shader source code consistent with the state of this builder.
     */
    GraphicsProgramBuilder.prototype.fragmentShaderSrc = function () {
        var aParams = computeAttribParams(this.aMeta);
        var vColor = vColorRequired(aParams, this.uParams);
        var vCoords = vCoordsRequired(aParams, this.uParams);
        var vLight = vLightRequired(aParams, this.uParams);
        return fragmentShaderSrc$2(aParams, this.uParams, vColor, vCoords, vLight);
    };
    return GraphicsProgramBuilder;
}());

function builder(options) {
    if (isNull(options) || isUndefined(options)) {
        options = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
        options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    }
    else {
        mustBeObject('options', options);
    }
    var attributes = isDefined(options.attributes) ? options.attributes : {};
    var uniforms = isDefined(options.uniforms) ? options.uniforms : {};
    var gpb = new GraphicsProgramBuilder();
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
function vertexShaderSrc$1(options) {
    return builder(options).vertexShaderSrc();
}
function fragmentShaderSrc$1(options) {
    return builder(options).fragmentShaderSrc();
}
/**
 * Generates a WebGLProgram suitable for use with LINES, and LINE_STRIP.
 *
 * <table>
 * <tr>
 * <td>attribute</td><td>vec3</td><td>aPosition</td>
 * </tr>
 * </table>
 */
var LineMaterial = (function (_super) {
    __extends(LineMaterial, _super);
    /**
     *
     */
    function LineMaterial(contextManager, options, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc$1(options), fragmentShaderSrc$1(options), [], contextManager, levelUp + 1) || this;
        _this.setLoggingName('LineMaterial');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    LineMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('LineMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    LineMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return LineMaterial;
}(ShaderMaterial));

function builder$1(options) {
    if (isUndefined(options) || isNull(options)) {
        options = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = 2;
        options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    }
    else {
        mustBeObject('options', options);
    }
    var attributes = isDefined(options.attributes) ? options.attributes : {};
    var uniforms = isDefined(options.uniforms) ? options.uniforms : {};
    var gpb = new GraphicsProgramBuilder();
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
function vertexShaderSrc$3(options) {
    return builder$1(options).vertexShaderSrc();
}
function fragmentShaderSrc$3(options) {
    return builder$1(options).fragmentShaderSrc();
}
var LOGGING_NAME_MESH_MATERIAL = 'MeshMaterial';
/**
 *
 */
var MeshMaterial = (function (_super) {
    __extends(MeshMaterial, _super);
    /**
     *
     */
    function MeshMaterial(contextManager, options, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc$3(options), fragmentShaderSrc$3(options), [], contextManager, levelUp + 1) || this;
        _this.setLoggingName(LOGGING_NAME_MESH_MATERIAL);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    MeshMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName(LOGGING_NAME_MESH_MATERIAL);
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    MeshMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MeshMaterial;
}(ShaderMaterial));

function builder$2(options) {
    if (isNull(options) || isUndefined(options)) {
        options = { kind: 'PointMaterial', attributes: {}, uniforms: {} };
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
        options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    }
    else {
        mustBeObject('options', options);
    }
    var attributes = isDefined(options.attributes) ? options.attributes : {};
    var uniforms = isDefined(options.uniforms) ? options.uniforms : {};
    var gpb = new GraphicsProgramBuilder();
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
function vertexShaderSrc$4(options) {
    return builder$2(options).vertexShaderSrc();
}
function fragmentShaderSrc$4(options) {
    return builder$2(options).fragmentShaderSrc();
}
/**
 *
 */
var PointMaterial = (function (_super) {
    __extends(PointMaterial, _super);
    /**
     *
     */
    function PointMaterial(contextManager, options, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc$4(options), fragmentShaderSrc$4(options), [], contextManager, levelUp + 1) || this;
        _this.setLoggingName('PointMaterial');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    PointMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('PointMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    PointMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return PointMaterial;
}(ShaderMaterial));

/**
 * Determines whether a property name is callable on an object.
 */
function isCallableMethod(x, name) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
}
/**
 * Constructs a function that can apply the operator to objects that implement the operator as a method.
 * Falls back to the primitive function when the argument is a number.
 */
function makeUnaryUniversalFunction(methodName, primitiveFunction) {
    return function (x) {
        if (isCallableMethod(x, methodName)) {
            return x[methodName]();
        }
        else if (typeof x === 'number') {
            return primitiveFunction(x);
        }
        else {
            throw new TypeError("x must support " + methodName + "(x)");
        }
    };
}
function coshNumber(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
}
function sinhNumber(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
}
function tanhNumber(x) {
    return sinhNumber(x) / coshNumber(x);
}
var acos = makeUnaryUniversalFunction('acos', Math.acos);
var asin = makeUnaryUniversalFunction('asin', Math.asin);
var atan = makeUnaryUniversalFunction('atan', Math.atan);
var cos$3 = makeUnaryUniversalFunction('cos', Math.cos);
var cosh = makeUnaryUniversalFunction('cosh', coshNumber);
var exp$3 = makeUnaryUniversalFunction('exp', Math.exp);
var log$4 = makeUnaryUniversalFunction('log', Math.log);
var norm = makeUnaryUniversalFunction('norm', Math.abs);
var quad = makeUnaryUniversalFunction('quad', function (x) { return x * x; });
var sin$3 = makeUnaryUniversalFunction('sin', Math.sin);
var sinh = makeUnaryUniversalFunction('sinh', sinhNumber);
var sqrt$8 = makeUnaryUniversalFunction('sqrt', Math.sqrt);
var tan = makeUnaryUniversalFunction('tan', Math.tan);
var tanh = makeUnaryUniversalFunction('tanh', tanhNumber);

/**
 *
 */
var Vector4 = (function (_super) {
    __extends(Vector4, _super);
    /**
     * @class Vector4
     * @constructor
     * @param data {number[]} Default is [0, 0, 0, 0] corresponding to x, y, z, and w coordinate labels.
     * @param modified {boolean} Default is false.
     */
    function Vector4(data, modified) {
        if (data === void 0) { data = [0, 0, 0, 0]; }
        if (modified === void 0) { modified = false; }
        return _super.call(this, data, modified, 4) || this;
    }
    Object.defineProperty(Vector4.prototype, "x", {
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
    Object.defineProperty(Vector4.prototype, "y", {
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
    Object.defineProperty(Vector4.prototype, "z", {
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
    Object.defineProperty(Vector4.prototype, "w", {
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
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @method applyMatrix
     * @param σ The 4x4 matrix that pre-multiplies this column vector.
     * @return {Vector4} <code>this</code>
     * @chainable
     */
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
    /**
     * @method approx
     * @param n {number}
     * @return {Vector4}
     * @chainable
     */
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
        // TODO
        return this;
    };
    Vector4.prototype.rotate = function (rotor) {
        // TODO
        return this;
    };
    Vector4.prototype.stress = function (σ) {
        this.x *= σ.x;
        this.y *= σ.y;
        this.z *= σ.z;
        this.w *= σ.w;
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
}(Coords));

function getCanvasElementById(elementId, dom) {
    if (dom === void 0) { dom = window.document; }
    mustBeString('elementId', elementId);
    mustBeObject('document', dom);
    var element = dom.getElementById(elementId);
    if (element instanceof HTMLCanvasElement) {
        return element;
    }
    else {
        throw new Error(elementId + " is not an HTMLCanvasElement.");
    }
}

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
            // FIXME: cache? Maybe, clients may use this to iterate. forEach is too slow.
            return Object.keys(this._elements).map(function (keyString) { return parseFloat(keyString); });
        },
        enumerable: true,
        configurable: true
    });
    NumberShareableMap.prototype.remove = function (key) {
        // Strong or Weak doesn't matter because the value is `undefined`.
        this.put(key, void 0);
        delete this._elements[key];
    };
    return NumberShareableMap;
}(ShareableBase));

function defaultSetUp() {
    // Do nothing yet.
}
function defaultTearDown(animateException) {
    if (animateException) {
        var message = "Exception raised during animate function: " + animateException;
        console.warn(message);
    }
}
function defaultTerminate(time) {
    mustBeNumber('time', time);
    // Never ending, because whenever asked we say nee.
    return false;
}
function animation(animate, options) {
    if (options === void 0) { options = {}; }
    var STATE_INITIAL = 1;
    var STATE_RUNNING = 2;
    var STATE_PAUSED = 3;
    var $window = expectArg('options.window', options.window || window).toNotBeNull().value;
    var setUp = expectArg('options.setUp', options.setUp || defaultSetUp).value;
    var tearDown = expectArg('options.tearDown', options.tearDown || defaultTearDown).value;
    var terminate = expectArg('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;
    var stopSignal = false; // 27 is Esc
    //  let pauseKeyPressed = false  // 19
    //  let enterKeyPressed = false  // 13
    var startTime;
    var elapsed = 0;
    var MILLIS_PER_SECOND = 1000;
    var requestID = null;
    var animateException;
    var state = STATE_INITIAL;
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
    var frameRequestCallback;
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
                // No change of state. We just record the current lap time and save it to some kind of history.
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
    return publicAPI;
}

var INITIAL_AXIS = canonicalAxis;
var INITIAL_LENGTH = 1.0;
var INITIAL_MERIDIAN = canonicalMeridian;
var INITIAL_RADIUS = 0.5;
var INITIAL_SLICE = 2 * Math.PI;
function make(axis, length, meridian, radius, sliceAngle) {
    /*
    const that: ALR = {
        get axis(): R3 {
            return axis;
        },
        get length(): number {
            return length;
        },
        get radius(): number {
            return radius;
        }
    };
    return Object.freeze(that);
    */
    return { axis: axis, length: length, meridian: meridian, radius: radius, sliceAngle: sliceAngle };
}
var ds = make(INITIAL_AXIS, INITIAL_LENGTH, INITIAL_MERIDIAN, INITIAL_RADIUS, INITIAL_SLICE);

function pointMaterialOptions() {
    var options = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    return options;
}
function lineMaterialOptions() {
    var options = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    return options;
}
function meshMaterialOptions(behaviors) {
    var options = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
    behaviors.colored = isDefined(behaviors.colored) ? behaviors.colored : true;
    behaviors.reflective = isDefined(behaviors.reflective) ? behaviors.reflective : true;
    behaviors.textured = isDefined(behaviors.textured) ? behaviors.textured : false;
    behaviors.transparent = isDefined(behaviors.transparent) ? behaviors.transparent : true;
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
    if (behaviors.textured) {
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = 2;
    }
    if (behaviors.colored) {
        options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    if (behaviors.transparent) {
        options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    if (behaviors.textured) {
        options.uniforms[GraphicsProgramSymbols.UNIFORM_IMAGE] = 'sampler2D';
    }
    return options;
}
/**
 *
 */
function materialFromOptions(contextManager, simplexMode, behaviors) {
    switch (simplexMode) {
        case SimplexMode.POINT: {
            var matOptions = pointMaterialOptions();
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof PointMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new PointMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        case SimplexMode.LINE: {
            var matOptions = lineMaterialOptions();
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof LineMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new LineMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        case SimplexMode.TRIANGLE: {
            var matOptions = meshMaterialOptions(behaviors);
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new MeshMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        default: {
            throw new Error("simplexMode not specified for materialFromOptions");
        }
    }
}

function normVectorE3(vector) {
    var x = vector.x;
    var y = vector.y;
    var z = vector.z;
    return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Reduce to the vectorE3 data structure.
 * If the value of the vector is 0, return void 0.
 */
function simplify(vector) {
    if (vector.x !== 0 || vector.y !== 0 || vector.z !== 0) {
        return { x: vector.x, y: vector.y, z: vector.z };
    }
    else {
        return void 0;
    }
}
/**
 * This function computes the initial requested direction of an object.
 */
function offsetFromOptions(options) {
    if (options.offset) {
        return simplify(options.offset);
    }
    else {
        return simplify(Geometric3.ZERO);
    }
}

/**
 * Sets the axis and meridian properties from options in the correct order.
 */
function setAxisAndMeridian(mesh, options) {
    if (isDefined(options.axis)) {
        mesh.axis = options.axis;
    }
    if (isDefined(options.meridian)) {
        mesh.meridian = options.meridian;
    }
}

function setColorOption(mesh, options, defaultColor) {
    if (isDefined(options.color)) {
        mesh.color.copy(options.color);
    }
    else if (isDefined(defaultColor)) {
        mesh.color.copy(defaultColor);
    }
}

var ATTITUDE_NAME = 'attitude';
var POSITION_NAME = 'position';
/**
 * Deprecated support for 'position' and 'attitude' in options.
 * Implementations should use the corresponding properties instead.
 */
function setDeprecatedOptions(mesh, options) {
    if (isDefined(options[POSITION_NAME])) {
        console.warn("options." + POSITION_NAME + " is deprecated. Please use the X (position vector) property instead.");
        mesh.X.copyVector(options[POSITION_NAME]);
    }
    if (isDefined(options[ATTITUDE_NAME])) {
        console.warn("options." + ATTITUDE_NAME + " is deprecated. Please use the R (attitude rotor) property instead.");
        mesh.R.copySpinor(options[ATTITUDE_NAME]);
    }
}

/**
 * Converts from a mode, k, or wireFrame option specification to a SimplexMode.
 */
function simplexModeFromOptions(options, fallback) {
    if (options === void 0) { options = {}; }
    if (isDefined(options)) {
        if (isDefined(options.mode)) {
            switch (options.mode) {
                case exports.GeometryMode.MESH: return SimplexMode.TRIANGLE;
                case exports.GeometryMode.WIRE: return SimplexMode.LINE;
                case exports.GeometryMode.POINT: return SimplexMode.POINT;
                case 'mesh': return SimplexMode.TRIANGLE;
                case 'wire': return SimplexMode.LINE;
                case 'point': return SimplexMode.POINT;
                default: {
                    throw new Error("Unknown mode: " + options.mode);
                }
            }
        }
        else if (isDefined(options.wireFrame)) {
            return mustBeBoolean('wireFrame', options.wireFrame) ? SimplexMode.LINE : fallback;
        }
        else if (isDefined(options.k)) {
            var k = mustBeInteger('k', options.k);
            switch (k) {
                case SimplexMode.EMPTY: return SimplexMode.EMPTY;
                case SimplexMode.POINT: return SimplexMode.POINT;
                case SimplexMode.LINE: return SimplexMode.LINE;
                case SimplexMode.TRIANGLE: return SimplexMode.TRIANGLE;
                default: {
                    throw new Error("k: SimplexMode must be -1, 0, 1, or 2");
                }
            }
        }
        else {
            // In the absence of any hints to the contrary we assume...
            return fallback;
        }
    }
    else {
        return fallback;
    }
}

/**
 * Reduce to the SpinorE3 to a simple object data structure.
 */
function spinorE3Object(spinor) {
    if (spinor) {
        return { a: spinor.a, xy: spinor.xy, yz: spinor.yz, zx: spinor.zx };
    }
    else {
        return void 0;
    }
}

/**
 * Reduce to the VectorE3 to a simple object data structure.
 */
function vectorE3Object(vector) {
    if (vector) {
        return { x: vector.x, y: vector.y, z: vector.z };
    }
    else {
        return void 0;
    }
}

/**
 * A Mesh in the form of an arrow that may be used to represent a vector quantity.
 */
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    /**
     *
     */
    function Arrow(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Arrow');
        var geoOptions = { kind: 'ArrowGeometry' };
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.radiusCone = 0.08;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof ArrowGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new ArrowGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (isDefined(options.length)) {
            _this.length = mustBeNumber('length', options.length);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Arrow.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Arrow.prototype, "vector", {
        /**
         * The vector that is represented by the Arrow.
         *
         * magnitude(Arrow.vector) = Arrow.length
         * direction(Arrow.vector) = Arrow.axis
         * Arrow.vector = Arrow.length * Arrow.axis
         */
        get: function () {
            return _super.prototype.getAxis.call(this).scale(this.length);
        },
        set: function (axis) {
            this.length = normVectorE3(axis);
            // Don't try to set the direction for the zero vector.
            if (this.length !== 0) {
                this.setAxis(axis);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arrow.prototype, "length", {
        /**
         * The length of the Arrow.
         * This property determines the scaling of the Arrow in all directions.
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (length) {
            this.setScale(length, length, length);
        },
        enumerable: true,
        configurable: true
    });
    return Arrow;
}(Mesh));

var uPointA = 'uPointA';
var uPointB = 'uPointB';
var uPointC = 'uPointC';
var uColorA = 'uColorA';
var uColorB = 'uColorB';
var uColorC = 'uColorC';
var vertexShaderSrc$5 = function () {
    var vs = [
        "attribute float aPointIndex;",
        "attribute float aColorIndex;",
        "uniform vec3 " + uPointA + ";",
        "uniform vec3 " + uPointB + ";",
        "uniform vec3 " + uPointC + ";",
        "uniform vec3 " + uColorA + ";",
        "uniform vec3 " + uColorB + ";",
        "uniform vec3 " + uColorC + ";",
        "uniform mat4 " + GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX + ";",
        "uniform mat4 " + GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX + ";",
        "uniform mat4 " + GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX + ";",
        "varying highp vec4 " + GraphicsProgramSymbols.VARYING_COLOR + ";",
        "",
        "void main(void) {",
        "  vec3 " + GraphicsProgramSymbols.ATTRIBUTE_POSITION + ";",
        "  vec3 " + GraphicsProgramSymbols.ATTRIBUTE_COLOR + ";",
        "  if (aPointIndex == 0.0) {",
        "    " + GraphicsProgramSymbols.ATTRIBUTE_POSITION + " = vec3(0.0, 0.0, 0.0);",
        "  }",
        "  if (aPointIndex == 1.0) {",
        "    " + GraphicsProgramSymbols.ATTRIBUTE_POSITION + " = " + uPointA + ";",
        "  }",
        "  if (aPointIndex == 2.0) {",
        "    " + GraphicsProgramSymbols.ATTRIBUTE_POSITION + " = " + uPointB + ";",
        "  }",
        "  if (aPointIndex == 3.0) {",
        "    " + GraphicsProgramSymbols.ATTRIBUTE_POSITION + " = " + uPointC + ";",
        "  }",
        "  if (aColorIndex == 1.0) {",
        "    " + GraphicsProgramSymbols.ATTRIBUTE_COLOR + " = " + uColorA + ";",
        "  }",
        "  if (aColorIndex == 2.0) {",
        "    " + GraphicsProgramSymbols.ATTRIBUTE_COLOR + " = " + uColorB + ";",
        "  }",
        "  if (aColorIndex == 3.0) {",
        "    " + GraphicsProgramSymbols.ATTRIBUTE_COLOR + " = " + uColorC + ";",
        "  }",
        "  gl_Position = " + GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX + " * " + GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX + " * " + GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX + " * vec4(" + GraphicsProgramSymbols.ATTRIBUTE_POSITION + ", 1.0);",
        "  " + GraphicsProgramSymbols.VARYING_COLOR + " = vec4(" + GraphicsProgramSymbols.ATTRIBUTE_COLOR + ", 1.0);",
        "}"
    ].join('\n');
    return vs;
};
var fragmentShaderSrc$5 = function () {
    var fs = [
        "precision mediump float;",
        "varying highp vec4 " + GraphicsProgramSymbols.VARYING_COLOR + ";",
        "",
        "void main(void) {",
        "  gl_FragColor = " + GraphicsProgramSymbols.VARYING_COLOR + ";",
        "}"
    ].join('\n');
    return fs;
};
/**
 * A 3D visual representation of a reference frame or basis vectors.
 */
var Basis = (function (_super) {
    __extends(Basis, _super);
    /**
     *
     */
    function Basis(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: ds.axis, meridian: ds.meridian }, levelUp + 1) || this;
        _this.uPointA = new Vector3Facet(uPointA);
        _this.uPointB = new Vector3Facet(uPointB);
        _this.uPointC = new Vector3Facet(uPointC);
        _this.uColorA = new ColorFacet(uColorA);
        _this.uColorB = new ColorFacet(uColorB);
        _this.uColorC = new ColorFacet(uColorC);
        _this.setLoggingName("Basis");
        _this.uPointA.vector = Vector3.vector(1, 0, 0);
        _this.colorA.copy(Color.red);
        _this.uPointB.vector = Vector3.vector(0, 1, 0);
        _this.colorB.copy(Color.green);
        _this.uPointC.vector = Vector3.vector(0, 0, 1);
        _this.colorC.copy(Color.blue);
        var primitive = {
            mode: exports.BeginMode.LINES,
            attributes: {
                aPointIndex: { values: [0, 1, 0, 2, 0, 3], size: 1, type: exports.DataType.FLOAT },
                aColorIndex: { values: [1, 1, 2, 2, 3, 3], size: 1, type: exports.DataType.FLOAT }
            }
        };
        var geometry = new GeometryArrays(contextManager, primitive);
        _this.geometry = geometry;
        geometry.release();
        var material = new ShaderMaterial(vertexShaderSrc$5(), fragmentShaderSrc$5(), [], contextManager);
        _this.material = material;
        material.release();
        _this.setFacet("Basis-" + uPointA, _this.uPointA);
        _this.setFacet("Basis-" + uPointB, _this.uPointB);
        _this.setFacet("Basis-" + uPointC, _this.uPointC);
        _this.setFacet("Basis-" + uColorA, _this.uColorA);
        _this.setFacet("Basis-" + uColorB, _this.uColorB);
        _this.setFacet("Basis-" + uColorC, _this.uColorC);
        setColorOption(_this, options, void 0);
        setDeprecatedOptions(_this, options);
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
}(Mesh));

/**
 * Converts from a mode, k, or wireFrame option specification to a GeometryMode.
 */
function geometryModeFromOptions(options, fallback, suppressWarnings) {
    if (fallback === void 0) { fallback = exports.GeometryMode.MESH; }
    if (suppressWarnings === void 0) { suppressWarnings = false; }
    if (isDefined(options)) {
        if (isDefined(options.mode)) {
            switch (options.mode) {
                case exports.GeometryMode.POINT: return options.mode;
                case exports.GeometryMode.WIRE: return options.mode;
                case exports.GeometryMode.MESH: return options.mode;
                case 'mesh': return exports.GeometryMode.MESH;
                case 'wire': return exports.GeometryMode.WIRE;
                case 'point': return exports.GeometryMode.POINT;
                default: {
                    throw new Error("mode must be POINT = " + exports.GeometryMode.POINT + ", WIRE = " + exports.GeometryMode.WIRE + ", or MESH = " + exports.GeometryMode.MESH);
                }
            }
        }
        else if (isDefined(options.wireFrame)) {
            if (!suppressWarnings) {
                console.warn("wireFrame: boolean is deprecated. Please use mode: GeometryMode instead.");
            }
            return mustBeBoolean('wireFrame', options.wireFrame) ? exports.GeometryMode.WIRE : fallback;
        }
        else if (isDefined(options.k)) {
            if (!suppressWarnings) {
                console.warn("k: SimplexMode is deprecated. Please use mode: GeometryMode instead.");
            }
            var k = mustBeInteger('k', options.k);
            switch (k) {
                case SimplexMode.POINT: return exports.GeometryMode.POINT;
                case SimplexMode.LINE: return exports.GeometryMode.WIRE;
                case SimplexMode.TRIANGLE: return exports.GeometryMode.MESH;
                default: {
                    throw new Error("k must be POINT = " + SimplexMode.POINT + ", LINE = " + SimplexMode.LINE + ", or TRIANGLE = " + SimplexMode.TRIANGLE);
                }
            }
        }
        else {
            // In the absence of any hints to the contrary we assume...
            return fallback;
        }
    }
    else {
        return fallback;
    }
}

var RADIUS_NAME = 'radius';
/**
 *
 */
var Sphere = (function (_super) {
    __extends(Sphere, _super);
    /**
     *
     */
    function Sphere(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Sphere');
        var geoMode = geometryModeFromOptions(options);
        var geoOptions = { kind: 'SphereGeometry' };
        geoOptions.mode = geoMode;
        geoOptions.azimuthSegments = options.azimuthSegments;
        geoOptions.azimuthStart = options.azimuthStart;
        geoOptions.azimuthLength = options.azimuthLength;
        geoOptions.elevationLength = options.elevationLength;
        geoOptions.elevationSegments = options.elevationSegments;
        geoOptions.elevationStart = options.elevationStart;
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.stress = void 0;
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof SphereGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new SphereGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, options.textured ? Color.white : Color.gray);
        setDeprecatedOptions(_this, options);
        _this.radius = isDefined(options.radius) ? mustBeNumber(RADIUS_NAME, options.radius) : ds.radius;
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Sphere.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Sphere.prototype, "radius", {
        get: function () {
            return this.getScaleX();
        },
        set: function (radius) {
            this.setScale(radius, radius, radius);
        },
        enumerable: true,
        configurable: true
    });
    return Sphere;
}(Mesh));

/**
 * A 3D visual representation of a box.
 */
var Box = (function (_super) {
    __extends(Box, _super);
    /**
     *
     */
    function Box(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Box');
        var geoOptions = { kind: 'BoxGeometry' };
        geoOptions.mode = geometryModeFromOptions(options);
        geoOptions.offset = vectorE3Object(options.offset);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.openBack = options.openBack;
        geoOptions.openBase = options.openBase;
        geoOptions.openFront = options.openFront;
        geoOptions.openLeft = options.openLeft;
        geoOptions.openRight = options.openRight;
        geoOptions.openCap = options.openCap;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof BoxGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new BoxGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, options.textured ? Color.white : Color.gray);
        setDeprecatedOptions(_this, options);
        if (isDefined(options.width)) {
            _this.width = mustBeNumber('width', options.width);
        }
        if (isDefined(options.height)) {
            _this.height = mustBeNumber('height', options.height);
        }
        if (isDefined(options.depth)) {
            _this.depth = mustBeNumber('depth', options.depth);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Box.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Box.prototype, "width", {
        /**
         * @default 1
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (width) {
            var y = this.getScaleY();
            var z = this.getScaleZ();
            this.setScale(width, y, z);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "height", {
        /**
         *
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (height) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, height, z);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "depth", {
        /**
         *
         */
        get: function () {
            return this.getScaleZ();
        },
        set: function (depth) {
            var x = this.getScaleX();
            var y = this.getScaleY();
            this.setScale(x, y, depth);
        },
        enumerable: true,
        configurable: true
    });
    return Box;
}(Mesh));

/**
 * A 3D visual representation of a cylinder.
 */
var Cylinder = (function (_super) {
    __extends(Cylinder, _super);
    /**
     *
     */
    function Cylinder(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Cylinder');
        var geoOptions = { kind: 'CylinderGeometry' };
        geoOptions.mode = geometryModeFromOptions(options);
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.openCap = options.openCap;
        geoOptions.openBase = options.openBase;
        geoOptions.openWall = options.openWall;
        geoOptions.heightSegments = options.heightSegments;
        geoOptions.thetaSegments = options.thetaSegments;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof CylinderGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new CylinderGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, options.textured ? Color.white : Color.gray);
        setDeprecatedOptions(_this, options);
        _this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : ds.radius;
        if (isDefined(options.length)) {
            _this.length = mustBeNumber('length', options.length);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Cylinder.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Cylinder.prototype, "length", {
        /**
         * The length of the cylinder, a scalar. Defaults to 1.
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (length) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, length, z);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cylinder.prototype, "radius", {
        /**
         * The radius of the cylinder, a scalar. Defaults to 1.
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (radius) {
            var y = this.getScaleY();
            this.setScale(radius, y, radius);
        },
        enumerable: true,
        configurable: true
    });
    return Cylinder;
}(Mesh));

function aPositionDefault$1(u) {
    return Vector3.vector(u, 0, 0);
}
function isFunctionOrNull(x) {
    return isFunction(x) || isNull(x);
}
function isFunctionOrUndefined(x) {
    return isFunction(x) || isUndefined(x);
}
function transferGeometryOptions(options, geoOptions) {
    if (isFunctionOrNull(options.aPosition)) {
        geoOptions.aPosition = options.aPosition;
    }
    else if (isUndefined(options.aPosition)) {
        geoOptions.aPosition = aPositionDefault$1;
    }
    else {
        throw new Error("aPosition must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull(options.aColor)) {
        geoOptions.aColor = options.aColor;
    }
    else if (isUndefined(options.aColor)) {
        // Do nothing.
    }
    else {
        throw new Error("aColor must be one of function, null, or undefined.");
    }
    if (isDefined(options.uMax)) {
        geoOptions.uMax = mustBeNumber('uMax', options.uMax);
    }
    else {
        geoOptions.uMax = +0.5;
    }
    if (isDefined(options.uMin)) {
        geoOptions.uMin = mustBeNumber('uMin', options.uMin);
    }
    else {
        geoOptions.uMin = -0.5;
    }
    if (isDefined(options.uSegments)) {
        geoOptions.uSegments = mustBeGE('uSegments', options.uSegments, 0);
    }
    else {
        geoOptions.uSegments = 1;
    }
}
function configPoints(contextManager, options, curve) {
    var geoOptions = { kind: 'CurveGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = exports.CurveMode.POINTS;
    var geometry = new CurveGeometry(contextManager, geoOptions);
    curve.geometry = geometry;
    geometry.release();
    var matOptions = { kind: 'PointMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    if (isFunction(options.aOpacity)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_OPACITY] = 1;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    var material = new PointMaterial(contextManager, matOptions);
    curve.material = material;
    material.release();
}
function configLines(contextManager, options, curve) {
    var geoOptions = { kind: 'CurveGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = exports.CurveMode.LINES;
    var geometry = new CurveGeometry(contextManager, geoOptions);
    curve.geometry = geometry;
    geometry.release();
    var matOptions = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    var material = new LineMaterial(contextManager, matOptions);
    curve.material = material;
    material.release();
}
/**
 * A 3D visual representation of a discrete parameterized line.
 */
var Curve = (function (_super) {
    __extends(Curve, _super);
    /**
     * Constructs a Curve.
     */
    function Curve(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, {}, levelUp + 1) || this;
        _this.setLoggingName('Curve');
        var mode = isDefined(options.mode) ? options.mode : exports.CurveMode.LINES;
        switch (mode) {
            case exports.CurveMode.POINTS: {
                configPoints(contextManager, options, _this);
                break;
            }
            case exports.CurveMode.LINES: {
                configLines(contextManager, options, _this);
                break;
            }
            default: {
                throw new Error("'" + mode + "' is not a valid option for mode.");
            }
        }
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Curve.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return Curve;
}(Mesh));

/**
 * Determines whether the actual options supplied are expected.
 *
 * Usage:
 *
 * expectOptions(['foo', 'bar'], Object.keys(options));
 *
 */
function expectOptions(expects, actuals) {
    mustBeArray('expects', expects);
    mustBeArray('actuals', actuals);
    var iLength = actuals.length;
    for (var i = 0; i < iLength; i++) {
        var actual = actuals[i];
        if (expects.indexOf(actual) < 0) {
            throw new Error(actual + " is not one of the expected options: " + JSON.stringify(expects, null, 2) + ".");
        }
    }
}

function beFunction() {
    return "be a function";
}
function mustBeFunction(name, value, contextBuilder) {
    mustSatisfy(name, isFunction(value), beFunction, contextBuilder);
    return value;
}

/**
 * Helper function for validating a named value and providing a default.
 */
function validate(name, value, defaultValue, assertFn) {
    if (isDefined(value)) {
        return assertFn(name, value);
    }
    else {
        return defaultValue;
    }
}

var COORD_MIN_DEFAULT = -1;
var COORD_MAX_DEFAULT = +1;
var GRID_SEGMENTS_DEFAULT = 10;
var OPTION_OFFSET = { name: 'offset' };
var OPTION_TILT = { name: 'tilt' };
var OPTION_STRESS = { name: 'stress' };
var OPTION_COLOR = { name: 'color', assertFn: mustBeObject };
var OPTION_POSITION_FUNCTION = { name: 'aPosition', assertFn: mustBeFunction };
var OPTION_NORMAL_FUNCTION = { name: 'aNormal', assertFn: mustBeFunction };
var OPTION_COLOR_FUNCTION = { name: 'aColor', assertFn: mustBeFunction };
var OPTION_UMIN = { name: 'uMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber };
var OPTION_UMAX = { name: 'uMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber };
var OPTION_USEGMENTS = { name: 'uSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger };
var OPTION_VMIN = { name: 'vMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber };
var OPTION_VMAX = { name: 'vMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber };
var OPTION_VSEGMENTS = { name: 'vSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger };
var OPTION_MODE = { name: 'mode', defaultValue: exports.GeometryMode.WIRE, assertFn: mustBeInteger };
var OPTIONS = [
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
    OPTION_MODE
];
var OPTION_NAMES = OPTIONS.map(function (option) { return option.name; });
function aPositionDefault$2(u, v) {
    return vec(u, v, 0);
}
function aNormalDefault(u, v) {
    mustBeNumber('u', u);
    mustBeNumber('v', v);
    return vec(0, 0, 1);
}
function isFunctionOrNull$1(x) {
    return isFunction(x) || isNull(x);
}
function isFunctionOrUndefined$1(x) {
    return isFunction(x) || isUndefined(x);
}
function transferGeometryOptions$1(source, target) {
    if (isFunctionOrNull$1(source.aPosition)) {
        target.aPosition = source.aPosition;
    }
    else if (isUndefined(source.aPosition)) {
        target.aPosition = aPositionDefault$2;
    }
    else {
        throw new Error("aPosition must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull$1(source.aNormal)) {
        target.aNormal = source.aNormal;
    }
    else if (isUndefined(source.aNormal)) {
        target.aNormal = aNormalDefault;
    }
    else {
        throw new Error("aNormal must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull$1(source.aColor)) {
        target.aColor = source.aColor;
    }
    else if (isUndefined(source.aColor)) {
        // Do nothing.
    }
    else {
        throw new Error("aColor must be one of function, null, or undefined.");
    }
    target.uMin = validate('uMin', source.uMin, COORD_MIN_DEFAULT, mustBeNumber);
    target.uMax = validate('uMax', source.uMax, COORD_MAX_DEFAULT, mustBeNumber);
    target.uSegments = validate('uSegments', source.uSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger);
    mustBeGE('uSegments', target.uSegments, 0);
    target.vMin = validate('vMin', source.vMin, COORD_MIN_DEFAULT, mustBeNumber);
    target.vMax = validate('vMax', source.vMax, COORD_MAX_DEFAULT, mustBeNumber);
    target.vSegments = validate('vSegments', source.vSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger);
    mustBeGE('vSegments', target.vSegments, 0);
}
/**
 *
 */
function configGeometry(engine, geoOptions, grid) {
    // Don't use the Geometry cache until we can better differentiate the options.
    var geometry = new GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();
    /*
    const cachedGeometry = engine.getCacheGeometry(geoOptions);
    if (cachedGeometry && cachedGeometry instanceof GridGeometry) {
        grid.geometry = cachedGeometry;
        cachedGeometry.release();
    }
    else {
        const geometry = new GridGeometry(engine, geoOptions);
        grid.geometry = geometry;
        geometry.release();
        engine.putCacheGeometry(geoOptions, geometry);
    }
    */
}
function configPoints$1(engine, options, grid) {
    var geoOptions = { kind: 'GridGeometry' };
    transferGeometryOptions$1(options, geoOptions);
    geoOptions.mode = exports.GeometryMode.POINT;
    configGeometry(engine, geoOptions, grid);
    var matOptions = { kind: 'PointMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined$1(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof PointMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new PointMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}
function configLines$1(engine, options, grid) {
    var geoOptions = { kind: 'GridGeometry' };
    transferGeometryOptions$1(options, geoOptions);
    geoOptions.mode = exports.GeometryMode.WIRE;
    configGeometry(engine, geoOptions, grid);
    var matOptions = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined$1(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }
    /*
    if (isFunction(options.aNormal)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
    }
    */
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof LineMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new LineMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}
function configMesh(engine, options, grid) {
    var geoOptions = { kind: 'GridGeometry' };
    transferGeometryOptions$1(options, geoOptions);
    geoOptions.mode = exports.GeometryMode.MESH;
    configGeometry(engine, geoOptions, grid);
    var geometry = new GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();
    var matOptions = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined$1(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have the aPosition attribute.
    }
    else {
        throw new Error();
    }
    if (isFunctionOrUndefined$1(options.aNormal)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    }
    else if (isNull(options.aNormal)) {
        // We're being instructed not to have the aNormal attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else if (isNull(options.aColor)) {
        // We're being instructed not to have the aColor attribute.
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    else if (isUndefined(options.aColor)) {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    else {
        throw new Error();
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new MeshMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}
/**
 * A 3D visual representation of a a discrete parameterized surface.
 */
var Grid = (function (_super) {
    __extends(Grid, _super);
    /**
     * Constructs a Grid.
     */
    function Grid(engine, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, engine, {}, levelUp + 1) || this;
        _this.setLoggingName('Grid');
        expectOptions(OPTION_NAMES, Object.keys(options));
        var mode = geometryModeFromOptions(options, exports.GeometryMode.WIRE);
        switch (mode) {
            case exports.GeometryMode.POINT: {
                configPoints$1(engine, options, _this);
                break;
            }
            case exports.GeometryMode.WIRE: {
                configLines$1(engine, options, _this);
                break;
            }
            case exports.GeometryMode.MESH: {
                configMesh(engine, options, _this);
                break;
            }
            default: {
                throw new Error("'" + mode + "' is not a valid option for mode.");
            }
        }
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Grid.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return Grid;
}(Mesh));

var ALLOWED_OPTIONS = ['xMin', 'xMax', 'xSegments', 'yMin', 'yMax', 'ySegments', 'z', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];
function mapOptions(options) {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    var aPosition;
    if (isDefined(options.z)) {
        mustBeFunction('z', options.z);
        aPosition = function (x, y) {
            return vec(x, y, options.z(x, y));
        };
    }
    else {
        aPosition = function (x, y) {
            return vec(x, y, 0);
        };
    }
    var uMin = validate('xMin', options.xMin, -1, mustBeNumber);
    var uMax = validate('xMax', options.xMax, +1, mustBeNumber);
    var uSegments = validate('xSegments', options.xSegments, 10, mustBeInteger);
    var vMin = validate('yMin', options.yMin, -1, mustBeNumber);
    var vMax = validate('yMax', options.yMax, +1, mustBeNumber);
    var vSegments = validate('ySegments', options.ySegments, 10, mustBeInteger);
    var mode = validate('mode', options.mode, exports.GeometryMode.WIRE, mustBeInteger);
    return {
        uMin: uMin,
        uMax: uMax,
        uSegments: uSegments,
        vMin: vMin,
        vMax: vMax,
        vSegments: vSegments,
        aPosition: aPosition,
        mode: mode
    };
}
/**
 * A grid in the xy plane.
 */
var GridXY = (function (_super) {
    __extends(GridXY, _super);
    /**
     * Constructs a GridXY
     */
    function GridXY(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, mapOptions(options), levelUp + 1) || this;
        _this.setLoggingName('GridXY');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GridXY.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return GridXY;
}(Grid));

var ALLOWED_OPTIONS$1 = ['yMin', 'yMax', 'ySegments', 'zMin', 'zMax', 'zSegments', 'x', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];
function mapOptions$1(options) {
    expectOptions(ALLOWED_OPTIONS$1, Object.keys(options));
    var aPosition;
    if (isDefined(options.x)) {
        mustBeFunction('x', options.x);
        aPosition = function (y, z) {
            return vec(options.x(y, z), y, z);
        };
    }
    else {
        aPosition = function (y, z) {
            return vec(0, y, z);
        };
    }
    var uMin = validate('yMin', options.yMin, -1, mustBeNumber);
    var uMax = validate('yMax', options.yMax, +1, mustBeNumber);
    var uSegments = validate('ySegments', options.ySegments, 10, mustBeInteger);
    var vMin = validate('zMin', options.zMin, -1, mustBeNumber);
    var vMax = validate('zMax', options.zMax, +1, mustBeNumber);
    var vSegments = validate('zSegments', options.zSegments, 10, mustBeInteger);
    var mode = validate('mode', options.mode, exports.GeometryMode.WIRE, mustBeInteger);
    return {
        uMin: uMin,
        uMax: uMax,
        uSegments: uSegments,
        vMin: vMin,
        vMax: vMax,
        vSegments: vSegments,
        aPosition: aPosition,
        mode: mode
    };
}
/**
 * A grid in the yz plane.
 */
var GridYZ = (function (_super) {
    __extends(GridYZ, _super);
    /**
     * Constructs a GridYZ.
     */
    function GridYZ(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, mapOptions$1(options), levelUp + 1) || this;
        _this.setLoggingName('GridYZ');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GridYZ.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return GridYZ;
}(Grid));

var ALLOWED_OPTIONS$2 = ['zMin', 'zMax', 'zSegments', 'xMin', 'xMax', 'xSegments', 'y', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];
function mapOptions$2(options) {
    expectOptions(ALLOWED_OPTIONS$2, Object.keys(options));
    var aPosition;
    if (isDefined(options.y)) {
        mustBeFunction('y', options.y);
        aPosition = function (z, x) {
            return vec(x, options.y(z, x), z);
        };
    }
    else {
        aPosition = function (z, x) {
            return vec(x, 0, z);
        };
    }
    var uMin = validate('zMin', options.zMin, -1, mustBeNumber);
    var uMax = validate('zMax', options.zMax, +1, mustBeNumber);
    var uSegments = validate('zSegments', options.zSegments, 10, mustBeInteger);
    var vMin = validate('xMin', options.xMin, -1, mustBeNumber);
    var vMax = validate('xMax', options.xMax, +1, mustBeNumber);
    var vSegments = validate('xSegments', options.xSegments, 10, mustBeInteger);
    var mode = validate('mode', options.mode, exports.GeometryMode.WIRE, mustBeInteger);
    return {
        uMin: uMin,
        uMax: uMax,
        uSegments: uSegments,
        vMin: vMin,
        vMax: vMax,
        vSegments: vSegments,
        aPosition: aPosition,
        mode: mode
    };
}
/**
 * A #d visual representation of a grid in the zx plane.
 */
var GridZX = (function (_super) {
    __extends(GridZX, _super);
    function GridZX(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, mapOptions$2(options), levelUp + 1) || this;
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
}(Grid));

/**
 * A collection of objects that can be treated as a single Renderable.
 */
var Group = (function (_super) {
    __extends(Group, _super);
    /**
     * Constructs
     */
    function Group() {
        var _this = _super.call(this) || this;
        /**
         * Position (vector). This is a short alias for the position property.
         */
        _this.X = Geometric3.zero(false);
        /**
         * Attitude (spinor). This is a short alias for the attitude property.
         */
        _this.R = Geometric3.one(false);
        /**
         *
         */
        _this.stress = Matrix4.one.clone();
        /**
         * Determines whether this group will be rendered.
         */
        _this.visible = true;
        _this.setLoggingName('Group');
        _this.members = new ShareableArray([]);
        return _this;
    }
    /**
     *
     */
    Group.prototype.destructor = function (levelUp) {
        this.members.release();
        this.members = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Group.prototype, "position", {
        /**
         * Position (vector). This is a long alias for the X property.
         */
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
        /**
         * Attitude (spinor). This is a long alias for the R property.
         */
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
    /**
     * Adds a Renderable item to this Group.
     */
    Group.prototype.add = function (member) {
        this.members.push(member);
    };
    /**
     * Removes a member item from this Group.
     */
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
    /**
     * Renders all the members of this Group.
     */
    Group.prototype.render = function (ambients) {
        var _this = this;
        if (this.visible) {
            this.members.forEach(function (member) {
                // Make copies of member state so that it can be restored accurately.
                // These calls are recursive so we need to use local temporary variables.
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
                // Resore the member state from the scratch variables.
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
}(ShareableBase));

var e2$1 = Vector3.vector(0, 1, 0);
var e3$1 = Vector3.vector(0, 0, 1);
/**
 * Generates a Primitive from the specified options.
 */
function hollowCylinderPrimitive(options) {
    if (options === void 0) { options = { kind: 'HollowCylinderGeometry' }; }
    var axis = (typeof options.axis === 'object') ? Vector3.copy(options.axis) : e2$1;
    var meridian = (typeof options.meridian === 'object') ? Vector3.copy(options.meridian).normalize() : e3$1;
    var outerRadius = (typeof options.outerRadius === 'number') ? options.outerRadius : 1.0;
    var innerRadius = (typeof options.innerRadius === 'number') ? options.innerRadius : 0.5;
    var sliceAngle = (typeof options.sliceAngle === 'number') ? options.sliceAngle : 2 * Math.PI;
    // Multiple builders each provide a Primitive.
    // A Primitive will typically correspond to one index buffer and several attribute buffers.
    // The Primitives are merged into a single Primitive for efficiency.
    var walls = new CylindricalShellBuilder();
    walls.height.copy(axis);
    walls.cutLine.copy(meridian).normalize().scale(outerRadius);
    walls.clockwise = true;
    walls.sliceAngle = sliceAngle;
    walls.offset.copy(axis).scale(-0.5);
    var outerWalls = walls.toPrimitive();
    walls.cutLine.normalize().scale(innerRadius);
    walls.convex = false;
    var innerWalls = walls.toPrimitive();
    var ring = new RingBuilder();
    ring.e.copy(axis).normalize();
    ring.cutLine.copy(meridian);
    ring.clockwise = true;
    ring.innerRadius = innerRadius;
    ring.outerRadius = outerRadius;
    ring.sliceAngle = sliceAngle;
    ring.offset.copy(axis).scale(0.5);
    var cap = ring.toPrimitive();
    ring.e.scale(-1);
    ring.clockwise = false;
    ring.offset.copy(axis).scale(-0.5);
    var base = ring.toPrimitive();
    return reduce([outerWalls, innerWalls, cap, base]);
}
/**
 *
 */
var HollowCylinderGeometry = (function (_super) {
    __extends(HollowCylinderGeometry, _super);
    /**
     *
     */
    function HollowCylinderGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'HollowCylinderGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, hollowCylinderPrimitive(options), {}, levelUp + 1) || this;
        _this.setLoggingName('HollowCylinderGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    HollowCylinderGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('HollowCylinderGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    HollowCylinderGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return HollowCylinderGeometry;
}(GeometryElements));

/**
 * A 3D visual representation of a hollow cylinder.
 */
var HollowCylinder = (function (_super) {
    __extends(HollowCylinder, _super);
    /**
     * Constructs a HollowCylinder.
     */
    function HollowCylinder(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('HollowCylinder');
        var geoOptions = { kind: 'HollowCylinderGeometry' };
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.outerRadius = isDefined(options.outerRadius) ? mustBeNumber('outerRadius', options.outerRadius) : ds.radius;
        geoOptions.innerRadius = isDefined(options.innerRadius) ? mustBeNumber('innerRadius', options.innerRadius) : 0.5 * geoOptions.outerRadius;
        geoOptions.sliceAngle = options.sliceAngle;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof HollowCylinderGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new HollowCylinderGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var mmo = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
        mmo.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
        mmo.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        mmo.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
        var cachedMaterial = contextManager.getCacheMaterial(mmo);
        if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
            _this.material = cachedMaterial;
            cachedMaterial.release();
        }
        else {
            var material = new MeshMaterial(contextManager, mmo);
            _this.material = material;
            material.release();
            contextManager.putCacheMaterial(mmo, material);
        }
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (isDefined(options.length)) {
            _this.length = mustBeNumber('length', options.length);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    HollowCylinder.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(HollowCylinder.prototype, "length", {
        /**
         * The length of the cylinder, a scalar. Defaults to 1.
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (length) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, length, z);
        },
        enumerable: true,
        configurable: true
    });
    return HollowCylinder;
}(Mesh));

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
/**
 * The dimensions have been adjusted so that the total height of the figure is 1.
 */
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
        // Fallback to zero for greatest compatibility.
        return 0;
    }
}
function primitiveFromOptions(texture, options) {
    var partKind = options.partKind;
    var offset = options.offset ? options.offset : { x: 0, y: 0, z: 0 };
    var dims = dimensions(partKind, options.height);
    var positions = [
        // Front
        [-0.5, -0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, +0.5, +0.5],
        [+0.5, -0.5, +0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5],
        // Back
        [+0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, +0.5, -0.5],
        [-0.5, -0.5, -0.5], [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5],
        // Left
        [+0.5, -0.5, +0.5], [+0.5, -0.5, -0.5], [+0.5, +0.5, +0.5],
        [+0.5, -0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5],
        // Right
        [-0.5, -0.5, -0.5], [-0.5, -0.5, +0.5], [-0.5, +0.5, -0.5],
        [-0.5, -0.5, +0.5], [-0.5, +0.5, +0.5], [-0.5, +0.5, -0.5],
        // Top
        [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, -0.5],
        [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5],
        // Bottom
        [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [-0.5, -0.5, +0.5],
        [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5]
    ]
        .map(function (xs) { return [dims[0] * xs[0], dims[1] * xs[1], dims[2] * xs[2]]; })
        .map(function (xs) { return [xs[0] + offset.x, xs[1] + offset.y, xs[2] + offset.z]; })
        .reduce(function (a, b) { return a.concat(b); });
    var naturalWidth = texture instanceof ImageTexture ? texture.naturalWidth : 64;
    var naturalHeight = texture instanceof ImageTexture ? texture.naturalHeight : 64;
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
        mode: exports.BeginMode.TRIANGLES,
        attributes: {
            aPosition: { values: positions, size: 3, type: exports.DataType.FLOAT },
            aCoords: { values: coords, size: 2, type: exports.DataType.FLOAT }
        }
    };
    return primitive;
}
function makeGeometry(graphics, texture, options) {
    return new GeometryArrays(graphics, primitiveFromOptions(texture, options));
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
var makeMaterial = function makeMaterial(graphics) {
    return new ShaderMaterial(vs, fs, [], graphics);
};
/**
 *
 */
var MinecraftBodyPart = (function (_super) {
    __extends(MinecraftBodyPart, _super);
    function MinecraftBodyPart(engine, texture, options, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, engine, {}, levelUp + 1) || this;
        _this.setLoggingName('MinecraftBodyPart');
        var geometry = makeGeometry(engine, texture, options);
        _this.geometry = geometry;
        geometry.release();
        var material = makeMaterial(engine);
        _this.material = material;
        material.release();
        _this.texture = texture;
        return _this;
    }
    MinecraftBodyPart.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftBodyPart;
}(Mesh));
var MinecraftHead = (function (_super) {
    __extends(MinecraftHead, _super);
    function MinecraftHead(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.Head,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftHead');
        return _this;
    }
    MinecraftHead.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftHead;
}(MinecraftBodyPart));
var MinecraftTorso = (function (_super) {
    __extends(MinecraftTorso, _super);
    function MinecraftTorso(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.Torso,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftTorso');
        return _this;
    }
    MinecraftTorso.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftTorso;
}(MinecraftBodyPart));
var MinecraftArmL = (function (_super) {
    __extends(MinecraftArmL, _super);
    function MinecraftArmL(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.LeftArm,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftArmL');
        return _this;
    }
    MinecraftArmL.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftArmL;
}(MinecraftBodyPart));
var MinecraftArmR = (function (_super) {
    __extends(MinecraftArmR, _super);
    function MinecraftArmR(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.RightArm,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftArmR');
        return _this;
    }
    MinecraftArmR.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftArmR;
}(MinecraftBodyPart));
var MinecraftLegL = (function (_super) {
    __extends(MinecraftLegL, _super);
    function MinecraftLegL(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.LeftLeg,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftLegL');
        return _this;
    }
    MinecraftLegL.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftLegL;
}(MinecraftBodyPart));
var MinecraftLegR = (function (_super) {
    __extends(MinecraftLegR, _super);
    function MinecraftLegR(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.RightLeg,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftLegR');
        return _this;
    }
    MinecraftLegR.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftLegR;
}(MinecraftBodyPart));

var e1$1 = vec(1, 0, 0);
var e2$2 = vec(0, 1, 0);
/**
 * A group of body parts arranged to look like a figure.
 */
var MinecraftFigure = (function (_super) {
    __extends(MinecraftFigure, _super);
    function MinecraftFigure(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        var height = isNumber(options.height) ? options.height : 1;
        var scale = height / 32;
        var oldSkinLayout = isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false;
        _this.head = new MinecraftHead(engine, texture, { height: height, offset: e2$2.scale(scale * 4), oldSkinLayout: oldSkinLayout });
        _this.head.position.zero().addVector(e2$2, scale * 24);
        _this.add(_this.head);
        _this.head.release();
        _this.torso = new MinecraftTorso(engine, texture, { height: height, oldSkinLayout: oldSkinLayout });
        _this.torso.position.zero().addVector(e2$2, scale * 18);
        _this.add(_this.torso);
        _this.torso.release();
        _this.armL = new MinecraftArmL(engine, texture, { height: height, offset: e2$2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.armL.position.zero().addVector(e2$2, scale * 22).addVector(e1$1, scale * 6);
        _this.add(_this.armL);
        _this.armL.release();
        _this.armR = new MinecraftArmR(engine, texture, { height: height, offset: e2$2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.armR.position.zero().addVector(e2$2, scale * 22).subVector(e1$1, scale * 6);
        _this.add(_this.armR);
        _this.armR.release();
        _this.legL = new MinecraftLegL(engine, texture, { height: height, offset: e2$2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.legL.position.zero().addVector(e2$2, scale * 10).addVector(e1$1, scale * 2);
        _this.add(_this.legL);
        _this.legL.release();
        _this.legR = new MinecraftLegR(engine, texture, { height: height, offset: e2$2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.legR.position.zero().addVector(e2$2, scale * 10).subVector(e1$1, scale * 2);
        _this.add(_this.legR);
        _this.legR.release();
        return _this;
    }
    return MinecraftFigure;
}(Group));

var vertexShaderSrc$6 = [
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
var fragmentShaderSrc$6 = [
    "precision mediump float;",
    "varying highp vec4 vColor;",
    "",
    "void main(void) {",
    "  gl_FragColor = vColor;",
    "}"
].join('\n');
/**
 * Coordinates of the cube vertices.
 */
var vertices$1 = [
    [-0.5, -0.5, +0.5],
    [-0.5, +0.5, +0.5],
    [+0.5, +0.5, +0.5],
    [+0.5, -0.5, +0.5],
    [-0.5, -0.5, -0.5],
    [-0.5, +0.5, -0.5],
    [+0.5, +0.5, -0.5],
    [+0.5, -0.5, -0.5],
];
var aCoords$1 = [];
var aFaces = [];
var ID = 'parallelepiped';
var NAME = 'Parallelepiped';
/**
 * Pushes positions and colors into the the aPositions and aColors arrays.
 * A quad call pushes two triangles, making a square face.
 * The dimensionality of each position is 3, but could be changed.
 * The first parameter, a, is used to pick the color of the entire face.
 */
function quad$1(a, b, c, d) {
    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; i++) {
        var vertex = vertices$1[indices[i]];
        var dims = vertex.length;
        for (var d_1 = 0; d_1 < dims; d_1++) {
            aCoords$1.push(vertex[d_1]);
        }
        aFaces.push(a - 1);
    }
}
quad$1(1, 0, 3, 2);
quad$1(2, 3, 7, 6);
quad$1(3, 0, 4, 7);
quad$1(6, 5, 1, 2);
quad$1(4, 5, 6, 7);
quad$1(5, 4, 0, 1);
var Parallelepiped = (function () {
    function Parallelepiped(contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        this.levelUp = levelUp;
        this.opacity = 1;
        this.transparent = false;
        this.X = Geometric3.vector(0, 0, 0);
        /**
         *
         */
        this.a = Geometric3.vector(1, 0, 0);
        this.b = Geometric3.vector(0, 1, 0);
        this.c = Geometric3.vector(0, 0, 1);
        /**
         * Face colors
         * top    - 0
         * right  - 1
         * front  - 2
         * bottom - 3
         * left   - 4
         * back   - 5
         */
        this.colors = [];
        this.refCount = 0;
        this.contextManager = exchange(this.contextManager, contextManager);
        this.addRef();
        this.colors[0] = Color.gray.clone();
        this.colors[1] = Color.gray.clone();
        this.colors[2] = Color.gray.clone();
        this.colors[3] = Color.gray.clone();
        this.colors[4] = Color.gray.clone();
        this.colors[5] = Color.gray.clone();
        if (levelUp === 0) {
            this.contextManager.synchronize(this);
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
                // There is no contextProvider so resources should already be clean.
            }
        }
        this.mesh = exchange(this.mesh, void 0);
        this.contextManager = exchange(this.contextManager, void 0);
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
        refChange(ID, NAME, +1);
        this.refCount++;
        return this.refCount;
    };
    Parallelepiped.prototype.release = function () {
        refChange(ID, NAME, -1);
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor(this.levelUp);
        }
        return this.refCount;
    };
    Parallelepiped.prototype.contextFree = function () {
        this.mesh = exchange(this.mesh, void 0);
    };
    Parallelepiped.prototype.contextGain = function () {
        if (!this.mesh) {
            var primitive = {
                mode: exports.BeginMode.TRIANGLES,
                attributes: {
                    aCoords: { values: aCoords$1, size: 3, type: exports.DataType.FLOAT },
                    aFace: { values: aFaces, size: 1, type: exports.DataType.FLOAT }
                }
            };
            var geometry = new GeometryArrays(this.contextManager, primitive);
            // geometry.mode = BeginMode.TRIANGLES;
            // geometry.setAttribute('aCoords', { values: aCoords, size: 3, type: DataType.FLOAT });
            // geometry.setAttribute('aFace', { values: aFaces, size: 1, type: DataType.FLOAT });
            var material = new ShaderMaterial(vertexShaderSrc$6, fragmentShaderSrc$6, [], this.contextManager);
            this.mesh = new Mesh(geometry, material, this.contextManager, {}, 0);
            geometry.release();
            material.release();
        }
    };
    Parallelepiped.prototype.contextLost = function () {
        this.mesh = exchange(this.mesh, void 0);
    };
    return Parallelepiped;
}());

/**
 * A 3D visual representation of a tetrahedron.
 */
var Tetrahedron = (function (_super) {
    __extends(Tetrahedron, _super);
    function Tetrahedron(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Tetrahedron');
        var geoOptions = { kind: 'TetrahedronGeometry' };
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof TetrahedronGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new TetrahedronGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Tetrahedron.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Tetrahedron.prototype, "radius", {
        /**
         *
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (radius) {
            this.setScale(radius, radius, radius);
        },
        enumerable: true,
        configurable: true
    });
    return Tetrahedron;
}(Mesh));

var FLOATS_PER_VERTEX = 3;
var BYTES_PER_FLOAT = 4;
var STRIDE = BYTES_PER_FLOAT * FLOATS_PER_VERTEX;
/**
 *
 */
var TrackGeometry = (function () {
    function TrackGeometry(contextManager) {
        this.contextManager = contextManager;
        this.scaling = Matrix4.one.clone();
        this.count = 0;
        this.N = 2;
        this.dirty = true;
        this.refCount = 1;
        this.data = new Float32Array(this.N * FLOATS_PER_VERTEX);
        this.vbo = new VertexBuffer(contextManager, this.data, exports.Usage.DYNAMIC_DRAW);
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
        var aPosition = material.getAttrib(GraphicsProgramSymbols.ATTRIBUTE_POSITION);
        aPosition.config(FLOATS_PER_VERTEX, exports.DataType.FLOAT, true, STRIDE, 0);
        aPosition.enable();
        return this;
    };
    TrackGeometry.prototype.unbind = function (material) {
        var aPosition = material.getAttrib(GraphicsProgramSymbols.ATTRIBUTE_POSITION);
        aPosition.disable();
        this.vbo.unbind();
        return this;
    };
    TrackGeometry.prototype.draw = function () {
        this.contextManager.gl.drawArrays(exports.BeginMode.LINE_STRIP, 0, this.count);
        return this;
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
    /**
     *
     */
    TrackGeometry.prototype.addPoint = function (x, y, z) {
        if (this.count === this.N) {
            this.N = this.N * 2;
            var temp = new Float32Array(this.N * FLOATS_PER_VERTEX);
            temp.set(this.data);
            this.data = temp;
            this.vbo.release();
            this.vbo = new VertexBuffer(this.contextManager, this.data, exports.Usage.DYNAMIC_DRAW);
        }
        var offset = this.count * FLOATS_PER_VERTEX;
        this.data[offset + 0] = x;
        this.data[offset + 1] = y;
        this.data[offset + 2] = z;
        this.count++;
        this.dirty = true;
    };
    /**
     *
     */
    TrackGeometry.prototype.erase = function () {
        this.count = 0;
    };
    return TrackGeometry;
}());
/**
 *
 */
var Track = (function (_super) {
    __extends(Track, _super);
    function Track(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = 
        // The TrackGeometry cannot be cached because it is dynamic.
        // The LineMaterial can be cached.
        _super.call(this, new TrackGeometry(contextManager), new LineMaterial(contextManager), contextManager, {}, levelUp + 1) || this;
        _this.setLoggingName('Track');
        // Adjust geometry reference count resulting from construction.
        var geometry = _this.geometry;
        geometry.release();
        geometry.release();
        // Adjust material reference count resulting from construction.
        var material = _this.material;
        material.release();
        material.release();
        setColorOption(_this, options, Color.gray);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Track.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    Track.prototype.addPoint = function (point) {
        if (point) {
            var geometry = this.geometry;
            geometry.addPoint(point.x, point.y, point.z);
            geometry.release();
        }
    };
    /**
     *
     */
    Track.prototype.clear = function () {
        var geometry = this.geometry;
        geometry.erase();
        geometry.release();
    };
    return Track;
}(Mesh));

/**
 * Modulo Arithmetic (Experimental).
 */
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
            mustBeInteger('size', size);
            mustBeGE('size', size, 0);
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

/**
 *
 */
var TrailConfig = (function () {
    function TrailConfig() {
        /**
         *
         */
        this.enabled = true;
        /**
         * Determines the number of animation frames between the recording of events.
         */
        this.interval = 10;
        /**
         * Determines the maximum number of historical events that form the trail.
         */
        this.retain = 10;
    }
    return TrailConfig;
}());

/**
 * <p>
 * Records the position and attitude history of a <code>Mesh</code> allowing the
 * <code>Mesh</code> to be drawn in multiple historical configurations.
 * <p>
 * <p>
 * This class is refererce counted because it maintains a reference to a <code>Mesh</code>.
 * You should call the <code>release</code> method when the trail is no longer required.
 * </p>
 *
 *
 *     // The trail is constructed, at any time, on an existing mesh.
 *     const trail = new EIGHT.Trail(mesh)
 *
 *     // Configure the Trail object, or use the defaults.
 *     trail.config.enabled = true
 *     trail.config.interval = 30
 *     trail.config.retain = 5
 *
 *     // Take a snapshot of the ball position and attitude, usually each animation frame.
 *     trail.snapshot()
 *
 *     // Draw the trail during the animation frame.
 *     trail.draw(ambients)
 *
 *     // Release the trail when no longer required, usually in the window.onunload function.
 *     trail.release()
 */
var Trail = (function (_super) {
    __extends(Trail, _super);
    /**
     * Constructs a trail for the specified mesh.
     */
    function Trail(mesh) {
        var _this = _super.call(this) || this;
        /**
         * The position history.
         */
        _this.Xs = [];
        /**
         * The attitude history.
         */
        _this.Rs = [];
        /**
         * The parameter history.
         */
        _this.Ns = [];
        /**
         * The configuration that determines how the history is recorded.
         */
        _this.config = new TrailConfig();
        _this.counter = 0;
        _this.modulo = new Modulo();
        _this.setLoggingName('Trail');
        mustBeNonNullObject('mesh', mesh);
        mesh.addRef();
        _this.mesh = mesh;
        return _this;
    }
    /**
     *
     */
    Trail.prototype.destructor = function (levelUp) {
        this.mesh.release();
        this.mesh = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     * @deprecated. Use the render method instead.
     */
    Trail.prototype.draw = function (ambients) {
        console.warn("Trail.draw is deprecated. Please use the Trail.render method instead.");
        this.render(ambients);
    };
    /**
     * Erases the trail history.
     */
    Trail.prototype.erase = function () {
        this.Ns = [];
        this.Xs = [];
        this.Rs = [];
    };
    Trail.prototype.forEach = function (callback) {
        if (this.config.enabled) {
            var Ns = this.Ns;
            var Xs = this.Xs;
            var Rs = this.Rs;
            var iLength = this.modulo.size;
            for (var i = 0; i < iLength; i++) {
                if (Xs[i] && Rs[i]) {
                    callback(Ns[i], Xs[i], Rs[i]);
                }
            }
        }
    };
    /**
     * Renders the mesh in its historical positions and attitudes.
     */
    Trail.prototype.render = function (ambients) {
        if (this.config.enabled) {
            // Save the mesh position and attitude so that we can restore them later.
            var mesh = this.mesh;
            var X = mesh.X;
            var R = mesh.R;
            // Save the position as efficiently as possible.
            var x = X.x;
            var y = X.y;
            var z = X.z;
            // Save the attitude as efficiently as possible.
            var a = R.a;
            var yz = R.yz;
            var zx = R.zx;
            var xy = R.xy;
            // Work at the Geometry and Material level for efficiency.
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
            // Restore the mesh position and attitude.
            X.x = x;
            X.y = y;
            X.z = z;
            R.a = a;
            R.yz = yz;
            R.zx = zx;
            R.xy = xy;
        }
    };
    /**
     * Records the Mesh variables according to the interval property.
     */
    Trail.prototype.snapshot = function (alpha) {
        if (alpha === void 0) { alpha = 0; }
        mustBeNumber('alpha', alpha);
        if (!this.config.enabled) {
            return;
        }
        if (this.modulo.size !== this.config.retain) {
            this.modulo.size = this.config.retain;
            this.modulo.value = 0;
        }
        if (this.counter % this.config.interval === 0) {
            var index = this.modulo.value;
            this.Ns[index] = alpha;
            if (this.Xs[index]) {
                // When populating an occupied slot, don't create new objects.
                this.Xs[index].copy(this.mesh.X);
                this.Rs[index].copy(this.mesh.R);
            }
            else {
                // When populating an empty slot, allocate a new object and make a copy.
                this.Xs[index] = Vector3.copy(this.mesh.X);
                this.Rs[index] = Spinor3.copy(this.mesh.R);
            }
            this.modulo.inc();
        }
        this.counter++;
    };
    return Trail;
}(ShareableBase));

/**
 * Reduce to the SpinorE3 data structure.
 * If the value of the spinor is 1, return void 0.
 */
function simplify$1(spinor) {
    if (spinor.a !== 1 || spinor.xy !== 0 || spinor.yz !== 0 || spinor.zx !== 0) {
        return { a: spinor.a, xy: spinor.xy, yz: spinor.yz, zx: spinor.zx };
    }
    else {
        return void 0;
    }
}
/**
 * This function computes the initial requested direction of an object.
 */
function tiltFromOptions$1(options, canonical) {
    if (options.tilt) {
        return simplify$1(options.tilt);
    }
    else if (options.axis) {
        var axis = options.axis;
        return simplify$1(Geometric3.rotorFromDirections(canonical, axis));
    }
    else {
        return simplify$1(Geometric3.ONE);
    }
}

var NOSE = [0, +1, 0];
var LLEG = [-1, -1, 0];
var RLEG = [+1, -1, 0];
var TAIL = [0, -1, 0];
var CENTER = [0, 0, 0];
var LEFT = [-0.5, 0, 0];
var canonicalAxis$4 = vec(0, 0, 1);
function concat$1(a, b) { return a.concat(b); }
/**
 * Transform a list of points by applying a tilt rotation and an offset translation.
 */
function transform(xs, options) {
    if (options.tilt || options.offset) {
        var points = xs.map(function (coords) { return Geometric3.vector(coords[0], coords[1], coords[2]); });
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
/**
 * Creates the Turtle Primitive.
 * All points lie in the the plane z = 0.
 * The height and width of the triangle are centered on the origin (0, 0).
 * The height and width range from -1 to +1.
 */
function primitive(options) {
    var values = transform([CENTER, LEFT, CENTER, TAIL, NOSE, LLEG, NOSE, RLEG, LLEG, RLEG], options).reduce(concat$1);
    var result = {
        mode: exports.BeginMode.LINES,
        attributes: {}
    };
    result.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = { values: values, size: 3, type: exports.DataType.FLOAT };
    return result;
}
/**
 * The geometry of the Bug is static so we use the conventional
 * approach based upon GeometryArrays
 */
var TurtleGeometry = (function (_super) {
    __extends(TurtleGeometry, _super);
    /**
     *
     */
    function TurtleGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'TurtleGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, primitive(options), options) || this;
        _this.setLoggingName('TurtleGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    TurtleGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('TurtleGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    TurtleGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return TurtleGeometry;
}(GeometryArrays));
/**
 * A 3D visual representation of a turtle.
 */
var Turtle = (function (_super) {
    __extends(Turtle, _super);
    function Turtle(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: ds.axis, meridian: ds.meridian }, levelUp + 1) || this;
        _this.setLoggingName('Turtle');
        var geoOptions = { kind: 'TurtleGeometry' };
        geoOptions.tilt = tiltFromOptions$1(options, canonicalAxis$4);
        geoOptions.offset = offsetFromOptions(options);
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof TurtleGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new TurtleGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.LINE), options);
        _this.material = material;
        material.release();
        _this.height = 0.1;
        _this.width = 0.0618;
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
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
            return this.getScaleX();
        },
        set: function (width) {
            var y = this.getScaleY();
            var z = this.getScaleZ();
            this.setScale(width, y, z);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Turtle.prototype, "height", {
        /**
         *
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (height) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, height, z);
        },
        enumerable: true,
        configurable: true
    });
    return Turtle;
}(Mesh));

/**
 *
 */
var Diagram3D = (function () {
    /**
     *
     */
    function Diagram3D(canvasId, camera, prism) {
        if (isDefined(canvasId)) {
            var canvasElement = document.getElementById(canvasId);
            this.ctx = canvasElement.getContext('2d');
            this.ctx.strokeStyle = "#FFFFFF";
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '24px Helvetica';
        }
        if (isDefined(camera)) {
            if (isDefined(prism)) {
                this.camera = camera;
                this.prism = prism;
            }
            else {
                this.camera = camera;
                this.prism = camera;
            }
        }
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
    Diagram3D.prototype.fill = function (fillRule /*CanvasFillRule*/) {
        this.ctx.fill(fillRule);
    };
    Diagram3D.prototype.fillText = function (text, X, maxWidth) {
        var coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillText(text, coords.x, coords.y, maxWidth);
    };
    Diagram3D.prototype.moveTo = function (X) {
        var coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.moveTo(coords.x, coords.y);
    };
    Diagram3D.prototype.lineTo = function (X) {
        var coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.lineTo(coords.x, coords.y);
    };
    Diagram3D.prototype.stroke = function () {
        this.ctx.stroke();
    };
    Diagram3D.prototype.strokeText = function (text, X, maxWidth) {
        var coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeText(text, coords.x, coords.y, maxWidth);
    };
    return Diagram3D;
}());
/**
 *
 */
function canvasCoords(X, camera, prism, width, height) {
    var cameraCoords = view(X, camera.eye, camera.look, camera.up);
    var near = prism.near;
    var far = prism.far;
    var fov = prism.fov;
    var aspect = prism.aspect;
    var imageCoords = perspective(cameraCoords, near, far, fov, aspect);
    // Convert image coordinates to screen/device coordinates.
    var x = (imageCoords.x + 1) * width / 2;
    var y = (1 - imageCoords.y) * height / 2;
    return { x: x, y: y };
}
/**
 * View transformation converts world coordinates to camera frame coordinates.
 * We first compute the camera frame (u, v, w, eye), then solve the equation
 * X = x * u + y * v * z * n + eye
 *
 * @param X The world vector.
 * @param eye The position of the camera.
 * @param look The point that the camera is aimed at.
 * @param up The approximate up direction.
 * @returns The coordinates in the camera (u, v, w) basis.
 */
function view(X, eye, look, up) {
    /**
     * Unit vector towards the camera holder (similar to e3).
     * Some texts call this the w-vector, so that (u, v, w) is a right-handed frame.
     */
    var n = vectorCopy(eye).sub(look).direction();
    /**
     * Unit vector to the right (similar to e1).
     */
    var u = vectorCopy(up).cross(n).direction();
    /**
     * Unit vector upwards (similar to e2).
     */
    var v = n.cross(u);
    var du = -dotVectorE3(eye, u);
    var dv = -dotVectorE3(eye, v);
    var dn = -dotVectorE3(eye, n);
    var x = dotVectorE3(X, u) + du;
    var y = dotVectorE3(X, v) + dv;
    var z = dotVectorE3(X, n) + dn;
    return vectorFromCoords(x, y, z);
}
/**
 * Perspective transformation projects camera coordinates onto the image space.
 * The near plane corresponds to -1. The far plane corresponds to +1.
 *
 * @param X The coordinates in the camera frame.
 * @param n The distance from the camera eye to the near plane onto which X is projected.
 * @param f The distance to the far plane.
 * @param α The angle subtended at the apex of the pyramid in the vw-plane.
 * @param aspect The ratio of the width to the height (width divided by height).
 */
function perspective(X, n, f, α, aspect) {
    /**
     * The camera coordinates (u, v, w).
     */
    var u = X.x;
    var v = X.y;
    var w = X.z;
    /**
     * tangent of one half the field of view angle.
     */
    var t = Math.tan(α / 2);
    var negW = -w;
    var x = u / (negW * aspect * t);
    var y = v / (negW * t);
    var z = ((f + n) * w + 2 * f * n) / (w * (f - n));
    return vectorFromCoords(x, y, z);
}

/**
 * A utility for loading Texture resources from a URL.
 *
 *     const loader = new EIGHT.TextureLoader(engine)
 *     loader.loadImageTexture('img/textures/solar-system/2k_earth_daymap.jpg', function(texture) {
 *       texture.minFilter = EIGHT.TextureMinFilter.NEAREST;
 *       const geometry = new EIGHT.SphereGeometry(engine, {azimuthSegments: 64, elevationSegments: 32})
 *       const material = new EIGHT.HTMLScriptsMaterial(['vs', 'fs'], document, [], engine)
 *       sphere = new EIGHT.Mesh(geometry, material, engine)
 *       geometry.release()
 *       material.release()
 *       sphere.texture = texture
 *       texture.release()
 *       scene.add(sphere)
 *     })
 */
var TextureLoader = (function () {
    /**
     * @param contextManager
     */
    function TextureLoader(contextManager) {
        this.contextManager = contextManager;
        mustBeNonNullObject('contextManager', contextManager);
    }
    /**
     * @param url The Uniform Resource Locator of the image.
     * @param onLoad
     * @param onError
     */
    TextureLoader.prototype.loadImageTexture = function (url, onLoad, onError, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        mustBeString('url', url);
        mustBeFunction('onLoad', onLoad);
        var image = new Image();
        image.onload = function () {
            var texture = new ImageTexture(image, exports.TextureTarget.TEXTURE_2D, _this.contextManager);
            texture.bind();
            texture.upload();
            texture.unbind();
            onLoad(texture);
        };
        image.onerror = function () {
            if (isFunction(onError)) {
                onError();
            }
        };
        // How to issue a CORS request for an image coming from another domain.
        // The image is fetched from the server without any credentials, i.e., cookies.
        if (isDefined(options.crossOrigin)) {
            image.crossOrigin = mustBeString('crossOrigin', options.crossOrigin);
        }
        image.src = url;
    };
    return TextureLoader;
}());

// commands

exports.WebGLBlendFunc = WebGLBlendFunc;
exports.WebGLClearColor = WebGLClearColor;
exports.WebGLDisable = WebGLDisable;
exports.WebGLEnable = WebGLEnable;
exports.OrbitControls = OrbitControls;
exports.TrackballControls = TrackballControls;
exports.Attrib = Attrib;
exports.Color = Color;
exports.Drawable = Drawable;
exports.GeometryArrays = GeometryArrays;
exports.GeometryElements = GeometryElements;
exports.GraphicsProgramSymbols = GraphicsProgramSymbols;
exports.ImageTexture = ImageTexture;
exports.Mesh = Mesh;
exports.Scene = Scene;
exports.Shader = Shader;
exports.Texture = Texture;
exports.Uniform = Uniform;
exports.Engine = Engine;
exports.VertexBuffer = VertexBuffer;
exports.IndexBuffer = IndexBuffer;
exports.vertexArraysFromPrimitive = vertexArraysFromPrimitive;
exports.AmbientLight = AmbientLight;
exports.ColorFacet = ColorFacet;
exports.DirectionalLight = DirectionalLight;
exports.ModelFacet = ModelFacet;
exports.PointSizeFacet = PointSizeFacet;
exports.ReflectionFacetE2 = ReflectionFacetE2;
exports.ReflectionFacetE3 = ReflectionFacetE3;
exports.Vector3Facet = Vector3Facet;
exports.ViewTransform = ViewTransform;
exports.frustumMatrix = frustumMatrix;
exports.PerspectiveCamera = PerspectiveCamera;
exports.PerspectiveTransform = PerspectiveTransform;
exports.perspectiveMatrix = perspectiveMatrix;
exports.viewMatrixFromEyeLookUp = viewMatrixFromEyeLookUp;
exports.ModelE2 = ModelE2;
exports.ModelE3 = ModelE3;
exports.DrawAttribute = DrawAttribute;
exports.DrawPrimitive = DrawPrimitive;
exports.reduce = reduce;
exports.Vertex = Vertex;
exports.ArrowBuilder = ArrowBuilder;
exports.ConicalShellBuilder = ConicalShellBuilder;
exports.CylindricalShellBuilder = CylindricalShellBuilder;
exports.RingBuilder = RingBuilder;
exports.Simplex = Simplex;
exports.ArrowGeometry = ArrowGeometry;
exports.BoxGeometry = BoxGeometry;
exports.CylinderGeometry = CylinderGeometry;
exports.CurveGeometry = CurveGeometry;
exports.GridGeometry = GridGeometry;
exports.SphereGeometry = SphereGeometry;
exports.TetrahedronGeometry = TetrahedronGeometry;
exports.HTMLScriptsMaterial = HTMLScriptsMaterial;
exports.LineMaterial = LineMaterial;
exports.ShaderMaterial = ShaderMaterial;
exports.MeshMaterial = MeshMaterial;
exports.PointMaterial = PointMaterial;
exports.GraphicsProgramBuilder = GraphicsProgramBuilder;
exports.acos = acos;
exports.asin = asin;
exports.atan = atan;
exports.cos = cos$3;
exports.cosh = cosh;
exports.exp = exp$3;
exports.log = log$4;
exports.norm = norm;
exports.quad = quad;
exports.sin = sin$3;
exports.sinh = sinh;
exports.sqrt = sqrt$8;
exports.tan = tan;
exports.tanh = tanh;
exports.Vector1 = Vector1;
exports.Matrix2 = Matrix2;
exports.Matrix3 = Matrix3;
exports.Matrix4 = Matrix4;
exports.Geometric2 = Geometric2;
exports.Geometric3 = Geometric3;
exports.Spinor2 = Spinor2;
exports.Spinor3 = Spinor3;
exports.Vector2 = Vector2;
exports.Vector3 = Vector3;
exports.Vector4 = Vector4;
exports.VectorN = VectorN;
exports.getCanvasElementById = getCanvasElementById;
exports.ShareableArray = ShareableArray;
exports.NumberShareableMap = NumberShareableMap;
exports.refChange = refChange;
exports.ShareableBase = ShareableBase;
exports.StringShareableMap = StringShareableMap;
exports.animation = animation;
exports.Arrow = Arrow;
exports.Basis = Basis;
exports.Sphere = Sphere;
exports.Box = Box;
exports.Cylinder = Cylinder;
exports.Curve = Curve;
exports.Grid = Grid;
exports.GridXY = GridXY;
exports.GridYZ = GridYZ;
exports.GridZX = GridZX;
exports.Group = Group;
exports.HollowCylinder = HollowCylinder;
exports.MinecraftArmL = MinecraftArmL;
exports.MinecraftArmR = MinecraftArmR;
exports.MinecraftHead = MinecraftHead;
exports.MinecraftLegL = MinecraftLegL;
exports.MinecraftLegR = MinecraftLegR;
exports.MinecraftTorso = MinecraftTorso;
exports.MinecraftFigure = MinecraftFigure;
exports.Parallelepiped = Parallelepiped;
exports.Tetrahedron = Tetrahedron;
exports.Track = Track;
exports.Trail = Trail;
exports.Turtle = Turtle;
exports.Diagram3D = Diagram3D;
exports.TextureLoader = TextureLoader;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
