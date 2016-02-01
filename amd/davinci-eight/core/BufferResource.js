var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../checks/mustBeBoolean', '../checks/mustBeObject', '../utils/Shareable'], function (require, exports, isDefined_1, mustBeBoolean_1, mustBeObject_1, Shareable_1) {
    var CLASS_NAME = 'BufferResource';
    var BufferResource = (function (_super) {
        __extends(BufferResource, _super);
        function BufferResource(manager, isElements) {
            _super.call(this, CLASS_NAME);
            this.manager = mustBeObject_1.default('manager', manager);
            this._isElements = mustBeBoolean_1.default('isElements', isElements);
            manager.addContextListener(this);
            manager.synchronize(this);
        }
        BufferResource.prototype.destructor = function () {
            this.contextFree(this.manager.canvasId);
            this.manager.removeContextListener(this);
            this.manager = void 0;
            this._isElements = void 0;
        };
        BufferResource.prototype.contextFree = function (canvasId) {
            if (this._buffer) {
                var gl = this.manager.gl;
                if (isDefined_1.default(gl)) {
                    gl.deleteBuffer(this._buffer);
                }
                else {
                    console.error(CLASS_NAME + " must leak WebGLBuffer because WebGLRenderingContext is " + typeof gl);
                }
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
        BufferResource.prototype.bind = function () {
            var gl = this.manager.gl;
            if (gl) {
                var target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
                gl.bindBuffer(target, this._buffer);
            }
            else {
                console.warn(CLASS_NAME + " bind() missing WebGL rendering context.");
            }
        };
        BufferResource.prototype.unbind = function () {
            var gl = this.manager.gl;
            if (gl) {
                var target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
                gl.bindBuffer(target, null);
            }
            else {
                console.warn(CLASS_NAME + " unbind() missing WebGL rendering context.");
            }
        };
        return BufferResource;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BufferResource;
});
