define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    var ArrayBuffer = (function () {
        function ArrayBuffer() {
            this._refCount = 0;
        }
        ArrayBuffer.prototype.addRef = function () {
            this._refCount++;
        };
        ArrayBuffer.prototype.release = function () {
            this._refCount--;
            if (this._refCount === 0) {
                this._free();
            }
        };
        ArrayBuffer.prototype._free = function () {
            if (this._buffer) {
                this._context.deleteBuffer(this._buffer);
                // console.log("WebGLBuffer deleted");
                this._buffer = void 0;
            }
        };
        ArrayBuffer.prototype.contextGain = function (context) {
            if (this._context !== context) {
                this._free();
                this._context = context;
                this._buffer = context.createBuffer();
            }
        };
        ArrayBuffer.prototype.contextLoss = function () {
            this._buffer = void 0;
            this._context = void 0;
        };
        ArrayBuffer.prototype.hasContext = function () {
            return !!this._context;
        };
        /**
         * @method bindBuffer
         */
        ArrayBuffer.prototype.bindBuffer = function () {
            if (this._context) {
                this._context.bindBuffer(this._context.ARRAY_BUFFER, this._buffer);
            }
            else {
                console.warn("ArrayBuffer.bindBuffer() missing WebGLRenderingContext.");
            }
        };
        /**
         * @method bufferData
         * @param data {Float32Array}
         * @param usage {number} Optional. Defaults to DYNAMIC_DRAW.
         */
        ArrayBuffer.prototype.bufferData = function (data, usage) {
            if (this._context) {
                usage = isDefined(usage) ? usage : this._context.DYNAMIC_DRAW;
                this._context.bufferData(this._context.ARRAY_BUFFER, data, usage);
            }
            else {
                console.warn("ArrayBuffer.bufferData() missing WebGLRenderingContext.");
            }
        };
        return ArrayBuffer;
    })();
    return ArrayBuffer;
});
