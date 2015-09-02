function existsLocation(location) {
    return location >= 0;
}
/**
 * Utility class for managing a shader attribute variable.
 * While this class may be created directly by the user, it is preferable
 * to use the ShaderAttribLocation instances managed by the ShaderProgram because
 * there will be improved integrity and context loss management.
 * @class ShaderAttribLocation.
 */
var ShaderAttribLocation = (function () {
    /**
     * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
     * In particular, this class manages buffer allocation, location caching, and data binding.
     * @class ShaderAttribLocation
     * @constructor
     * @param name {string} The name of the variable as it appears in the GLSL program.
     * @param size {number} The size of the variable as it appears in the GLSL program.
     * @param type {number} The type of the variable as it appears in the GLSL program.
     */
    function ShaderAttribLocation(name, size, type) {
        this.name = name;
    }
    ShaderAttribLocation.prototype.contextFree = function () {
        this.location = void 0;
        this._context = void 0;
    };
    ShaderAttribLocation.prototype.contextGain = function (context, program) {
        if (this._context !== context) {
            this.location = context.getAttribLocation(program, this.name);
            this._context = context;
        }
    };
    ShaderAttribLocation.prototype.contextLoss = function () {
        this.location = void 0;
        this._context = void 0;
    };
    /**
     * @method vertexAttribPointer
     * @param numComponents {number} The number of components per attribute. Must be 1,2,3, or 4.
     * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
     */
    ShaderAttribLocation.prototype.vertexAttribPointer = function (numComponents, normalized, stride, offset) {
        if (normalized === void 0) { normalized = false; }
        if (stride === void 0) { stride = 0; }
        if (offset === void 0) { offset = 0; }
        if (this._context) {
            this._context.vertexAttribPointer(this.location, numComponents, this._context.FLOAT, normalized, stride, offset);
        }
        else {
            console.warn("ShaderAttribLocation.vertexAttribPointer() missing WebGLRenderingContext");
        }
    };
    ShaderAttribLocation.prototype.enable = function () {
        if (this._context) {
            this._context.enableVertexAttribArray(this.location);
        }
        else {
            console.warn("ShaderAttribLocation.enable() missing WebGLRenderingContext");
        }
    };
    ShaderAttribLocation.prototype.disable = function () {
        if (this._context) {
            this._context.disableVertexAttribArray(this.location);
        }
        else {
            console.warn("ShaderAttribLocation.disable() missing WebGLRenderingContext");
        }
    };
    /**
     * @method toString
     */
    ShaderAttribLocation.prototype.toString = function () {
        return ["ShaderAttribLocation(", this.name, ")"].join('');
    };
    return ShaderAttribLocation;
})();
module.exports = ShaderAttribLocation;
