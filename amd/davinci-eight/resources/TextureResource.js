define(["require", "exports", '../checks/expectArg', '../utils/refChange', '../utils/uuid4'], function (require, exports, expectArg, refChange, uuid4) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_TEXTURE = 'Texture';
    var TextureResource = (function () {
        function TextureResource(monitor, target) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._monitor = expectArg('montor', monitor).toBeObject().value;
            this._target = target;
            refChange(this._uuid, LOGGING_NAME_TEXTURE, +1);
            monitor.addContextListener(this);
        }
        TextureResource.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME_TEXTURE, +1);
            return this._refCount;
        };
        TextureResource.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME_TEXTURE, -1);
            if (this._refCount === 0) {
                this._monitor.removeContextListener(this);
                this.contextFree();
            }
            return this._refCount;
        };
        TextureResource.prototype.contextFree = function () {
            if (this._texture) {
                this._context.deleteTexture(this._texture);
                this._texture = void 0;
            }
            this._context = void 0;
        };
        TextureResource.prototype.contextGain = function (context) {
            if (this._context !== context) {
                this.contextFree();
                this._context = context;
                this._texture = context.createTexture();
            }
        };
        TextureResource.prototype.contextLoss = function () {
            this._texture = void 0;
            this._context = void 0;
        };
        /**
         * @method bind
         */
        TextureResource.prototype.bind = function () {
            if (this._context) {
                this._context.bindTexture(this._target, this._texture);
            }
            else {
                console.warn(LOGGING_NAME_TEXTURE + " bind(target) missing WebGLRenderingContext.");
            }
        };
        /**
         * @method unbind
         */
        TextureResource.prototype.unbind = function () {
            if (this._context) {
                this._context.bindTexture(this._target, null);
            }
            else {
                console.warn(LOGGING_NAME_TEXTURE + " unbind(target) missing WebGLRenderingContext.");
            }
        };
        return TextureResource;
    })();
    return TextureResource;
});
