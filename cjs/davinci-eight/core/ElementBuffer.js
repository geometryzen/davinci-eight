var isDefined = require('../checks/isDefined');
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
     * @method bindBuffer
     */
    ElementBuffer.prototype.bindBuffer = function () {
        if (this._context) {
            this._context.bindBuffer(this._context.ELEMENT_ARRAY_BUFFER, this._buffer);
        }
        else {
            console.warn("ElementBuffer.bindBuffer() missing WebGLRenderingContext");
        }
    };
    /**
     * @method bufferData
     * @param data {Uint16Array}
     * @param usage {number} Optional. Defaults to STREAM_DRAW.
     */
    ElementBuffer.prototype.bufferData = function (data, usage) {
        if (this._context) {
            usage = isDefined(usage) ? usage : this._context.STREAM_DRAW;
            this._context.bufferData(this._context.ELEMENT_ARRAY_BUFFER, data, usage);
        }
        else {
            console.warn("ElementBuffer.bindBuffer() missing WebGLRenderingContext");
        }
    };
    return ElementBuffer;
})();
module.exports = ElementBuffer;
