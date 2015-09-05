define(["require", "exports"], function (require, exports) {
    /**
     * Utility class for managing a shader uniform variable.
     * @class ShaderUniformLocation
     */
    var ShaderUniformLocation = (function () {
        /**
         * @class ShaderUniformLocation
         * @constructor
         * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
         */
        function ShaderUniformLocation(name) {
            this.name = name;
        }
        /**
         * @method contextFree
         */
        ShaderUniformLocation.prototype.contextFree = function () {
            this.location = void 0;
            this.context = void 0;
        };
        /**
         * @method contextGain
         * @param context {WebGLRenderingContext}
         * @param program {WebGLProgram}
         */
        ShaderUniformLocation.prototype.contextGain = function (context, program) {
            if (this.context !== context) {
                this.location = context.getUniformLocation(program, this.name);
                this.context = context;
            }
        };
        /**
         * @method contextLoss
         */
        ShaderUniformLocation.prototype.contextLoss = function () {
            this.location = void 0;
            this.context = void 0;
        };
        /**
         * @method uniform1f
         * @param x
         */
        ShaderUniformLocation.prototype.uniform1f = function (x) {
            this.context.uniform1f(this.location, x);
        };
        /**
         * @method uniform2f
         * @param x {number}
         * @param y {number}
         */
        ShaderUniformLocation.prototype.uniform2f = function (x, y) {
            this.context.uniform2f(this.location, x, y);
        };
        /**
         * @method uniform3f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         */
        ShaderUniformLocation.prototype.uniform3f = function (x, y, z) {
            this.context.uniform3f(this.location, x, y, z);
        };
        /**
         * @method uniform4f
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param w {number}
         */
        ShaderUniformLocation.prototype.uniform4f = function (x, y, z, w) {
            this.context.uniform4f(this.location, x, y, z, w);
        };
        /**
         * @method uniformMatrix1
         * @param transpose {boolean}
         * @param matrix {Matrix1}
         */
        ShaderUniformLocation.prototype.uniformMatrix1 = function (transpose, matrix) {
            this.context.uniform1fv(this.location, matrix.data);
        };
        /**
         * @method uniformMatrix2
         * @param transpose {boolean}
         * @param matrix {Matrix2}
         */
        ShaderUniformLocation.prototype.uniformMatrix2 = function (transpose, matrix) {
            this.context.uniformMatrix2fv(this.location, transpose, matrix.data);
        };
        /**
         * @method uniformMatrix3
         * @param transpose {boolean}
         * @param matrix {Matrix3}
         */
        ShaderUniformLocation.prototype.uniformMatrix3 = function (transpose, matrix) {
            this.context.uniformMatrix3fv(this.location, transpose, matrix.data);
        };
        /**
         * @method uniformMatrix4
         * @param transpose {boolean}
         * @param matrix {Matrix4}
         */
        ShaderUniformLocation.prototype.uniformMatrix4 = function (transpose, matrix) {
            this.context.uniformMatrix4fv(this.location, transpose, matrix.data);
        };
        /**
         * @method uniformVector1
         * @param vector {Vector1}
         */
        ShaderUniformLocation.prototype.uniformVector1 = function (vector) {
            this.context.uniform1fv(this.location, vector.data);
        };
        /**
         * @method uniformVector2
         * @param vector {Vector2}
         */
        ShaderUniformLocation.prototype.uniformVector2 = function (vector) {
            this.context.uniform2fv(this.location, vector.data);
        };
        /**
         * @method uniformVector3
         * @param vector {Vector3}
         */
        ShaderUniformLocation.prototype.uniformVector3 = function (vector) {
            this.context.uniform3fv(this.location, vector.data);
        };
        /**
         * @method uniformVector4
         * @param vector {Vector4}
         */
        ShaderUniformLocation.prototype.uniformVector4 = function (vector) {
            this.context.uniform4fv(this.location, vector.data);
        };
        /**
         * @method toString
         */
        ShaderUniformLocation.prototype.toString = function () {
            return ["ShaderUniformLocation(", this.name, ")"].join('');
        };
        return ShaderUniformLocation;
    })();
    return ShaderUniformLocation;
});
