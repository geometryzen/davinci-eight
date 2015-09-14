define(["require", "exports", '../checks/expectArg', '../utils/refChange', '../utils/uuid4'], function (require, exports, expectArg, refChange, uuid4) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_BUFFER = 'Buffer';
    function checkTarget(target) {
        return target;
    }
    // TODO: Replace this with a functional constructor to prevent tinkering.
    var BufferResource = (function () {
        function BufferResource(monitor, target) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._monitor = expectArg('montor', monitor).toBeObject().value;
            this._target = checkTarget(target);
            refChange(this._uuid, LOGGING_NAME_BUFFER, +1);
            monitor.addContextListener(this);
        }
        BufferResource.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME_BUFFER, +1);
            return this._refCount;
        };
        BufferResource.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME_BUFFER, -1);
            if (this._refCount === 0) {
                this._monitor.removeContextListener(this);
                this.contextFree();
            }
            return this._refCount;
        };
        BufferResource.prototype.contextFree = function () {
            if (this._buffer) {
                this._context.deleteBuffer(this._buffer);
                this._buffer = void 0;
            }
            this._context = void 0;
        };
        BufferResource.prototype.contextGain = function (context) {
            if (this._context !== context) {
                this.contextFree();
                this._context = context;
                this._buffer = context.createBuffer();
            }
        };
        BufferResource.prototype.contextLoss = function () {
            this._buffer = void 0;
            this._context = void 0;
        };
        /**
         * @method bind
         */
        BufferResource.prototype.bind = function () {
            if (this._context) {
                this._context.bindBuffer(this._target, this._buffer);
            }
            else {
                console.warn(LOGGING_NAME_BUFFER + " bind() missing WebGLRenderingContext.");
            }
        };
        /**
         * @method unbind
         */
        BufferResource.prototype.unbind = function () {
            if (this._context) {
                this._context.bindBuffer(this._target, null);
            }
            else {
                console.warn(LOGGING_NAME_BUFFER + " unbind() missing WebGLRenderingContext.");
            }
        };
        return BufferResource;
    })();
    return BufferResource;
});
