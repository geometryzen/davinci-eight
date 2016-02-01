define(["require", "exports", '../checks/expectArg', '../utils/refChange', '../utils/uuid4'], function (require, exports, expectArg_1, refChange_1, uuid4_1) {
    var LOGGING_NAME_ITEXTURE = 'ITexture';
    var ms = new Array();
    var os = [];
    var TextureResource = (function () {
        function TextureResource(monitors, target) {
            this._refCount = 1;
            this._uuid = uuid4_1.default().generate();
            var monitor = monitors[0];
            this._monitor = expectArg_1.default('montor', monitor).toBeObject().value;
            this._target = target;
            refChange_1.default(this._uuid, LOGGING_NAME_ITEXTURE, +1);
            monitor.addContextListener(this);
            monitor.synchronize(this);
        }
        TextureResource.prototype.addRef = function () {
            this._refCount++;
            refChange_1.default(this._uuid, LOGGING_NAME_ITEXTURE, +1);
            return this._refCount;
        };
        TextureResource.prototype.release = function () {
            this._refCount--;
            refChange_1.default(this._uuid, LOGGING_NAME_ITEXTURE, -1);
            if (this._refCount === 0) {
                this._monitor.removeContextListener(this);
                this.contextFree();
            }
            return this._refCount;
        };
        TextureResource.prototype.contextFree = function () {
            if (this._texture) {
                this._gl.deleteTexture(this._texture);
                this._texture = void 0;
            }
            this._gl = void 0;
        };
        TextureResource.prototype.contextGain = function (manager) {
            var gl = manager.gl;
            if (this._gl !== gl) {
                this.contextFree();
                this._gl = gl;
                this._texture = gl.createTexture();
            }
        };
        TextureResource.prototype.contextLost = function () {
            this._texture = void 0;
            this._gl = void 0;
        };
        TextureResource.prototype.bind = function () {
            if (this._gl) {
                this._gl.bindTexture(this._target, this._texture);
            }
            else {
                console.warn(LOGGING_NAME_ITEXTURE + " bind() missing WebGL rendering context.");
            }
        };
        TextureResource.prototype.unbind = function () {
            if (this._gl) {
                this._gl.bindTexture(this._target, null);
            }
            else {
                console.warn(LOGGING_NAME_ITEXTURE + " unbind() missing WebGL rendering context.");
            }
        };
        return TextureResource;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureResource;
});
