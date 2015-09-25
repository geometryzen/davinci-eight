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
        function BufferResource(manager, isElements) {
            _super.call(this, LOGGING_NAME_IBUFFER);
            this.manager = expectArg('montor', manager).toBeObject().value;
            this._isElements = mustBeBoolean('isElements', isElements);
            manager.addContextListener(this);
            manager.synchronize(this);
        }
        BufferResource.prototype.destructor = function () {
            if (this._buffer) {
                this.manager.gl.deleteBuffer(this._buffer);
                this._buffer = void 0;
            }
            this.manager.removeContextListener(this);
            this.manager = void 0;
            this._isElements = void 0;
        };
        BufferResource.prototype.contextFree = function () {
            if (this._buffer) {
                this.manager.gl.deleteBuffer(this._buffer);
                this._buffer = void 0;
            }
            else {
            }
        };
        BufferResource.prototype.contextGain = function (manager) {
            if (this.manager.canvasId === manager.canvasId) {
                if (!this._buffer) {
                    this._buffer = manager.gl.createBuffer();
                }
                else {
                }
            }
            else {
                console.warn("BufferResource ignoring contextGain for canvasId " + manager.canvasId);
            }
        };
        BufferResource.prototype.contextLost = function () {
            this._buffer = void 0;
        };
        /**
         * @method bind
         */
        BufferResource.prototype.bind = function () {
            var gl = this.manager.gl;
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
            var gl = this.manager.gl;
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
