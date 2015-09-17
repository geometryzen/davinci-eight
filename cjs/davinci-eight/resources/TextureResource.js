var expectArg = require('../checks/expectArg');
var refChange = require('../utils/refChange');
var uuid4 = require('../utils/uuid4');
/**
 * Name used for reference count monitoring and logging.
 */
var LOGGING_NAME_ITEXTURE = 'ITexture';
var ms = new Array();
var os = [];
// What is the difference?
var TextureResource = (function () {
    function TextureResource(monitors, target) {
        this._refCount = 1;
        this._uuid = uuid4().generate();
        // FIXME: Supprt multiple canvas.
        var monitor = monitors[0];
        this._monitor = expectArg('montor', monitor).toBeObject().value;
        this._target = target;
        refChange(this._uuid, LOGGING_NAME_ITEXTURE, +1);
        monitor.addContextListener(this);
    }
    TextureResource.prototype.addRef = function () {
        this._refCount++;
        refChange(this._uuid, LOGGING_NAME_ITEXTURE, +1);
        return this._refCount;
    };
    TextureResource.prototype.release = function () {
        this._refCount--;
        refChange(this._uuid, LOGGING_NAME_ITEXTURE, -1);
        if (this._refCount === 0) {
            this._monitor.removeContextListener(this);
            this.contextFree();
        }
        return this._refCount;
    };
    TextureResource.prototype.contextFree = function () {
        // FIXME: I need to know which context.
        if (this._texture) {
            this._context.deleteTexture(this._texture);
            this._texture = void 0;
        }
        this._context = void 0;
    };
    TextureResource.prototype.contextGain = function (manager) {
        // FIXME: Support multiple canvas.
        var context = manager.context;
        if (this._context !== context) {
            this.contextFree();
            this._context = context;
            // I must create a texture for each monitor.
            // But I only get context events one at a time.
            this._texture = context.createTexture();
        }
    };
    TextureResource.prototype.contextLoss = function () {
        // FIXME: I need to know which context.
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
            console.warn(LOGGING_NAME_ITEXTURE + " bind() missing WebGLRenderingContext.");
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
            console.warn(LOGGING_NAME_ITEXTURE + " unbind() missing WebGLRenderingContext.");
        }
    };
    return TextureResource;
})();
module.exports = TextureResource;
