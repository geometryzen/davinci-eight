define(["require", "exports", '../checks/expectArg', '../utils/refChange', '../utils/uuid4'], function (require, exports, expectArg, refChange, uuid4) {
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
        return ArrayBuffer;
    })();
    return ArrayBuffer;
});
