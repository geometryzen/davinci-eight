define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
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
