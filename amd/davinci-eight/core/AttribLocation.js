define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
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
         * @param size {number} The size of the variable as it appears in the GLSL program.
         * @param type {number} The type of the variable as it appears in the GLSL program.
         */
        function AttribLocation(name, size, type) {
            this._name = expectArg('name', name).toBeString().value;
            this._size = expectArg('size', size).toBeNumber().value;
            this._type = expectArg('type', type).toBeNumber().value;
        }
        AttribLocation.prototype.contextFree = function () {
            this._location = void 0;
            this._context = void 0;
        };
        AttribLocation.prototype.contextGain = function (context, program) {
            if (this._context !== context) {
                this._location = context.getAttribLocation(program, this._name);
                this._context = context;
            }
        };
        AttribLocation.prototype.contextLoss = function () {
            this._location = void 0;
            this._context = void 0;
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
            return this._context.vertexAttribPointer(this._location, size, this._context.FLOAT, normalized, stride, offset);
        };
        AttribLocation.prototype.enable = function () {
            return this._context.enableVertexAttribArray(this._location);
        };
        AttribLocation.prototype.disable = function () {
            return this._context.disableVertexAttribArray(this._location);
        };
        /**
         * @method toString
         */
        AttribLocation.prototype.toString = function () {
            return ['attribute', this._name].join(' ');
        };
        return AttribLocation;
    })();
    return AttribLocation;
});
