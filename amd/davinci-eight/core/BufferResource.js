var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/expectArg', '../checks/mustBeBoolean', '../utils/Shareable'], function (require, exports, expectArg, mustBeBoolean, Shareable) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_IBUFFER = 'IBuffer';
    // TODO: Replace this with a functional constructor to prevent tinkering?
    // TODO: Why is this object specific to one context?
    var BufferResource = (function (_super) {
        __extends(BufferResource, _super);
        function BufferResource(monitor, isElements) {
            _super.call(this, LOGGING_NAME_IBUFFER);
            this._monitor = expectArg('montor', monitor).toBeObject().value;
            this._isElements = mustBeBoolean('isElements', isElements);
            monitor.addContextListener(this);
        }
        BufferResource.prototype.destructor = function () {
            if (this._buffer) {
                this._gl.deleteBuffer(this._buffer);
                this._buffer = void 0;
            }
            this._gl = void 0;
            this._monitor.removeContextListener(this);
            this._monitor = void 0;
            this._isElements = void 0;
        };
        BufferResource.prototype.contextFree = function () {
            if (this._buffer) {
                this._gl.deleteBuffer(this._buffer);
                this._buffer = void 0;
            }
            this._gl = void 0;
        };
        BufferResource.prototype.contextGain = function (manager) {
            // FIXME: Support for multiple contexts. Do I need multiple buffers?
            // Remark. The constructor says I will only be working with one context.
            // However, if that is the case, what if someone adds me to a different context.
            // Answer, I can detect this condition by looking a canvasId.
            // But can I prevent it in the API?
            // I don't think so. That would require typed contexts.
            var gl = manager.gl;
            if (this._gl !== gl) {
                this.contextFree();
                this._gl = gl;
                this._buffer = gl.createBuffer();
            }
        };
        BufferResource.prototype.contextLoss = function () {
            this._buffer = void 0;
            this._gl = void 0;
        };
        /**
         * @method bind
         */
        BufferResource.prototype.bind = function () {
            var gl = this._gl;
            if (gl) {
                var target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
                gl.bindBuffer(target, this._buffer);
            }
            else {
                console.warn(LOGGING_NAME_IBUFFER + " bind() missing WebGL rendering context.");
            }
        };
        /**
         * @method unbind
         */
        BufferResource.prototype.unbind = function () {
            var gl = this._gl;
            if (gl) {
                var target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
                gl.bindBuffer(target, null);
            }
            else {
                console.warn(LOGGING_NAME_IBUFFER + " unbind() missing WebGL rendering context.");
            }
        };
        return BufferResource;
    })(Shareable);
    return BufferResource;
});
