define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    /**
     * Utility class for managing a shader uniform variable.
     * @class UniformLocation
     */
    var UniformLocation = (function () {
        /**
         * @class UniformLocation
         * @constructor
         * @param manager {IContextProvider} Unused. May be used later e.g. for mirroring.
         * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
         */
        function UniformLocation(manager, name) {
            expectArg('manager', manager).toBeObject().value;
            this._name = expectArg('name', name).toBeString().value;
        }
        /**
         * @method contextFree
         */
        UniformLocation.prototype.contextFree = function () {
            this.contextLost();
        };
        /**
         * @method contextGain
         * @param context {WebGLRenderingContext}
         * @param program {WebGLProgram}
         */
        UniformLocation.prototype.contextGain = function (context, program) {
            this.contextLost();
            this._context = context;
            // FIXME: Uniform locations are created for a specific program,
            // which means that locations cannot be shared.
            this._location = context.getUniformLocation(program, this._name);
            this._program = program;
        };
        /**
         * @method contextLost
         */
        UniformLocation.prototype.contextLost = function () {
            this._context = void 0;
            this._location = void 0;
            this._program = void 0;
        };
        /**
         * Calls <code>uniform1f</code> on the underlying <code>WebGLUniformLocation</code>.
         * @method vec1
         * @param coords {VectorE1}
         * @return {UniformLocation}
         * @chainable
         */
        UniformLocation.prototype.vec1 = function (coords) {
            this._context.uniform1f(this._location, coords.x);
            return this;
        };
        /**
         * Calls <code>uniform2f</code> on the underlying <code>WebGLUniformLocation</code>.
         * @method vec2
         * @param coords {VectorE2}
         * @return {UniformLocation}
         * @chainable
         */
        UniformLocation.prototype.vec2 = function (coords) {
            this._context.uniform2f(this._location, coords.x, coords.y);
            return this;
        };
        /**
         * Calls <code>uniform3f</code> on the underlying <code>WebGLUniformLocation</code>.
         * @method vec3
         * @param coords {VectorE3}
         * @return {UniformLocation}
         * @chainable
         */
        UniformLocation.prototype.vec3 = function (coords) {
            this._context.uniform3f(this._location, coords.x, coords.y, coords.z);
            return this;
        };
        /**
         * Calls <code>uniform4f</code> on the underlying <code>WebGLUniformLocation</code>.
         * @method vec4
         * @param coords {VectorE4}
         * @return {UniformLocation}
         * @chainable
         */
        UniformLocation.prototype.vec4 = function (coords) {
            this._context.uniform4f(this._location, coords.x, coords.y, coords.z, coords.w);
            return this;
        };
        /**
         * @method uniform1f
         * @param x {number}
         */
        UniformLocation.prototype.uniform1f = function (x) {
            this._context.uniform1f(this._location, x);
        };
        /**
         * @method uniform2f
         * @param x {number}
         * @param y {number}
         */
        UniformLocation.prototype.uniform2f = function (x, y) {
            this._context.uniform2f(this._location, x, y);
        };
        /**
         * @method uniform3f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         */
        UniformLocation.prototype.uniform3f = function (x, y, z) {
            this._context.uniform3f(this._location, x, y, z);
        };
        /**
         * @method uniform4f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param w {number}
         */
        UniformLocation.prototype.uniform4f = function (x, y, z, w) {
            this._context.uniform4f(this._location, x, y, z, w);
        };
        /**
         * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
         * @method mat2
         * @param matrix {Mat2R}
         * @param [transpose = false] {boolean}
         * @return {UniformLocation}
         * @chainable
         */
        UniformLocation.prototype.mat2 = function (matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            this._context.uniformMatrix2fv(this._location, transpose, matrix.elements);
            return this;
        };
        /**
         * Sets a uniform location of type <code>mat3</code> in the <code>WebGLProgram</code>.
         * @method mat3
         * @param matrix {Mat3R}
         * @param [transpose = false] {boolean}
         * @return {UniformLocation}
         * @chainable
         */
        UniformLocation.prototype.mat3 = function (matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            this._context.uniformMatrix3fv(this._location, transpose, matrix.elements);
            return this;
        };
        /**
         * Sets a uniform location of type <code>mat4</code> in the <code>WebGLProgram</code>.
         * @method mat4
         * @param matrix {Mat4R}
         * @param [transpose = false] {boolean}
         * @return {UniformLocation}
         * @chainable
         */
        UniformLocation.prototype.mat4 = function (matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            this._context.uniformMatrix4fv(this._location, transpose, matrix.elements);
            return this;
        };
        /**
         * @method vector2
         * @param data {Array<number> | Float32Array}
         */
        UniformLocation.prototype.vector2 = function (data) {
            this._context.uniform2fv(this._location, data);
        };
        /**
         * @method vector3
         * @param data {number[]}
         */
        UniformLocation.prototype.vector3 = function (data) {
            this._context.uniform3fv(this._location, data);
        };
        /**
         * @method vector4
         * @param data {number[]}
         */
        UniformLocation.prototype.vector4 = function (data) {
            this._context.uniform4fv(this._location, data);
        };
        /**
         * @method toString
         */
        UniformLocation.prototype.toString = function () {
            return ['uniform', this._name].join(' ');
        };
        return UniformLocation;
    })();
    return UniformLocation;
});
