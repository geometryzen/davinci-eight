var expectArg = require('../checks/expectArg');
var refChange = require('../utils/refChange');
var uuid4 = require('../utils/uuid4');
/**
 *
 */
// TODO: Probably should embed the target because unlikely we will change target.
var ArrayBuffer = (function () {
    function ArrayBuffer(monitor) {
        this._refCount = 1;
        this._uuid = uuid4().generate();
        this._monitor = expectArg('montor', monitor).toBeObject().value;
        refChange(this._uuid, +1, 'ArrayBuffer');
    }
    ArrayBuffer.prototype.addRef = function () {
        refChange(this._uuid, +1, 'ArrayBuffer');
        this._refCount++;
        return this._refCount;
    };
    ArrayBuffer.prototype.release = function () {
        refChange(this._uuid, -1, 'ArrayBuffer');
        this._refCount--;
        if (this._refCount === 0) {
            this.contextFree();
        }
        return this._refCount;
    };
    ArrayBuffer.prototype.contextFree = function () {
        if (this._buffer) {
            this._context.deleteBuffer(this._buffer);
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
    /**
     * @method unbind
     */
    ArrayBuffer.prototype.unbind = function (target) {
        // Remark: Having unbind may allow us to do some accounting in future.
        if (this._context) {
            this._context.bindBuffer(target, null);
        }
        else {
            console.warn("ArrayBuffer.unbind() missing WebGLRenderingContext.");
        }
    };
    return ArrayBuffer;
})();
module.exports = ArrayBuffer;
