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
         * @method cartesian1
         * @param coords {VectorE1}
         */
        UniformLocation.prototype.cartesian1 = function (coords) {
            this._context.useProgram(this._program);
            this._context.uniform1f(this._location, coords.x);
        };
        /**
         * @method cartesian2
         * @param coords {VectorE2}
         */
        UniformLocation.prototype.cartesian2 = function (coords) {
            this._context.useProgram(this._program);
            this._context.uniform2f(this._location, coords.x, coords.y);
        };
        /**
         * @method cartesian3
         * @param coords {VectorE3}
         */
        UniformLocation.prototype.cartesian3 = function (coords) {
            if (coords) {
                this._context.useProgram(this._program);
                this._context.uniform3f(this._location, coords.x, coords.y, coords.z);
            }
        };
        /**
         * @method cartesian4
         * @param coords {VectorE4}
         */
        UniformLocation.prototype.cartesian4 = function (coords) {
            this._context.useProgram(this._program);
            this._context.uniform4f(this._location, coords.x, coords.y, coords.z, coords.w);
        };
        /**
         * @method uniform1f
         * @param x {number}
         */
        UniformLocation.prototype.uniform1f = function (x) {
            this._context.useProgram(this._program);
            this._context.uniform1f(this._location, x);
        };
        /**
         * @method uniform2f
         * @param x {number}
         * @param y {number}
         */
        UniformLocation.prototype.uniform2f = function (x, y) {
            this._context.useProgram(this._program);
            this._context.uniform2f(this._location, x, y);
        };
        /**
         * @method uniform3f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         */
        UniformLocation.prototype.uniform3f = function (x, y, z) {
            this._context.useProgram(this._program);
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
            this._context.useProgram(this._program);
            this._context.uniform4f(this._location, x, y, z, w);
        };
        /**
         * @method matrix1
         * @param transpose {boolean}
         * @param matrix {MutableNumber}
         */
        UniformLocation.prototype.matrix1 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniform1fv(this._location, matrix.data);
        };
        /**
         * @method matrix2
         * @param transpose {boolean}
         * @param matrix {Matrix2}
         */
        UniformLocation.prototype.matrix2 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniformMatrix2fv(this._location, transpose, matrix.data);
        };
        /**
         * @method matrix3
         * @param transpose {boolean}
         * @param matrix {Matrix3}
         */
        UniformLocation.prototype.matrix3 = function (transpose, matrix) {
            this._context.useProgram(this._program);
            this._context.uniformMatrix3fv(this._location, transpose, matrix.data);
        };
        /**
         * @method matrix4
         * @param transpose {boolean}
         * @param matrix {Matrix4}
         */
        UniformLocation.prototype.matrix4 = function (transpose, matrix) {
            if (matrix) {
                this._context.useProgram(this._program);
                this._context.uniformMatrix4fv(this._location, transpose, matrix.data);
            }
        };
        /**
         * @method vector2
         * @param data {number[]}
         */
        UniformLocation.prototype.vector2 = function (data) {
            this._context.useProgram(this._program);
            this._context.uniform2fv(this._location, data);
        };
        /**
         * @method vector3
         * @param data {number[]}
         */
        UniformLocation.prototype.vector3 = function (data) {
            this._context.useProgram(this._program);
            this._context.uniform3fv(this._location, data);
        };
        /**
         * @method vector4
         * @param data {number[]}
         */
        UniformLocation.prototype.vector4 = function (data) {
            this._context.useProgram(this._program);
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
