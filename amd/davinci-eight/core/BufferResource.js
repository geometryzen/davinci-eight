var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../checks/mustBeBoolean', '../checks/mustBeObject', '../utils/Shareable'], function (require, exports, isDefined, mustBeBoolean, mustBeObject, Shareable) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var CLASS_NAME = 'BufferResource';
    /**
     * @class BufferResource
     * @extends Shareable
     */
    var BufferResource = (function (_super) {
        __extends(BufferResource, _super);
        /**
         * @class BufferResource
         * @constructor
         * @param manager {IContextProvider}
         * @param isElements {boolean}
         */
        function BufferResource(manager, isElements) {
            _super.call(this, CLASS_NAME);
            this.manager = mustBeObject('manager', manager);
            this._isElements = mustBeBoolean('isElements', isElements);
            manager.addContextListener(this);
            manager.synchronize(this);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        BufferResource.prototype.destructor = function () {
            this.contextFree(this.manager.canvasId);
            this.manager.removeContextListener(this);
            this.manager = void 0;
            this._isElements = void 0;
        };
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        BufferResource.prototype.contextFree = function (canvasId) {
            if (this._buffer) {
                var gl = this.manager.gl;
                if (isDefined(gl)) {
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
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
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
        /**
         * @method contextLost
         * @return {void}
         */
        BufferResource.prototype.contextLost = function () {
            this._buffer = void 0;
        };
        /**
         * @method bind
         * @return {void}
         */
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
        /**
         * @method unbind
         * @return {void}
         */
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
    })(Shareable);
    return BufferResource;
});
