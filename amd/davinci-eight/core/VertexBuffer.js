define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
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
        VertexBuffer.prototype.hasContext = function () {
            return !!this._context;
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
        /**
         * @method data
         * @param data {Float32Array}
         * @param usage {number} Optional. Defaults to DYNAMIC_DRAW.
         */
        VertexBuffer.prototype.data = function (data, usage) {
            if (this._context) {
                usage = isDefined(usage) ? usage : this._context.DYNAMIC_DRAW;
                this._context.bufferData(this._context.ARRAY_BUFFER, data, usage);
            }
            else {
                console.warn("VertexBuffer.data() missing WebGLRenderingContext.");
            }
        };
        return VertexBuffer;
    })();
    return VertexBuffer;
});
