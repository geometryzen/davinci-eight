define(["require", "exports"], function (require, exports) {
    var VertexBuffer = (function () {
        function VertexBuffer() {
            this._refCount = 0;
        }
        VertexBuffer.prototype.addRef = function () {
            this._refCount++;
        };
        VertexBuffer.prototype.release = function () {
            this._refCount--;
            if (this._refCount === 0) {
                this.contextFree();
            }
        };
        VertexBuffer.prototype.contextFree = function () {
            if (this._buffer) {
                this._context.deleteBuffer(this._buffer);
                // console.log("WebGLBuffer deleted");
                this._buffer = void 0;
            }
            this._context = void 0;
        };
        VertexBuffer.prototype.contextGain = function (context) {
            if (this._context !== context) {
                this.contextFree();
                this._context = context;
                this._buffer = context.createBuffer();
            }
        };
        VertexBuffer.prototype.contextLoss = function () {
            this._buffer = void 0;
            this._context = void 0;
        };
        /**
         * @method bind
         */
        VertexBuffer.prototype.bind = function () {
            if (this._context) {
                this._context.bindBuffer(this._context.ARRAY_BUFFER, this._buffer);
            }
            else {
                console.warn("VertexBuffer.bind() missing WebGLRenderingContext.");
            }
        };
        return VertexBuffer;
    })();
    return VertexBuffer;
});
