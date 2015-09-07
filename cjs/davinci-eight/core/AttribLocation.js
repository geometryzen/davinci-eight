var expectArg = require('../checks/expectArg');
function existsLocation(location) {
    return location >= 0;
}
/**
 * Utility class for managing a shader attribute variable.
 * While this class may be created directly by the user, it is preferable
 * to use the AttribLocation instances managed by the ShaderProgram because
 * there will be improved integrity and context loss management.
 * @class AttribLocation.
 */
var AttribLocation = (function () {
    /**
     * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
     * In particular, this class manages buffer allocation, location caching, and data binding.
     * @class AttribLocation
     * @constructor
     * @param name {string} The name of the variable as it appears in the GLSL program.
     */
    function AttribLocation(name) {
        this._enabled = void 0;
        this._name = expectArg('name', name).toBeString().value;
    }
    AttribLocation.prototype.contextFree = function () {
        this.contextLoss();
    };
    AttribLocation.prototype.contextGain = function (context, program) {
        this.contextLoss();
        this._location = context.getAttribLocation(program, this._name);
        this._context = context;
    };
    AttribLocation.prototype.contextLoss = function () {
        this._location = void 0;
        this._context = void 0;
        this._enabled = void 0;
    };
    /**
     * @method vertexPointer
     * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
     * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
     */
    AttribLocation.prototype.vertexPointer = function (size, normalized, stride, offset) {
        if (normalized === void 0) { normalized = false; }
        if (stride === void 0) { stride = 0; }
        if (offset === void 0) { offset = 0; }
        this._context.vertexAttribPointer(this._location, size, this._context.FLOAT, normalized, stride, offset);
    };
    AttribLocation.prototype.enable = function () {
        if (this._enabled !== true) {
            this._context.enableVertexAttribArray(this._location);
            this._enabled = true;
        }
    };
    AttribLocation.prototype.disable = function () {
        if (this._enabled !== false) {
            this._context.disableVertexAttribArray(this._location);
            this._enabled = false;
        }
    };
    /**
     * @method toString
     */
    AttribLocation.prototype.toString = function () {
        return ['attribute', this._name].join(' ');
    };
    return AttribLocation;
})();
module.exports = AttribLocation;
