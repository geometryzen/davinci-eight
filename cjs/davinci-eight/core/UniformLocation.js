var expectArg = require('../checks/expectArg');
function matrix4NE(a, b) {
    return a[0x0] !== b[0x0]
        || a[0x1] !== b[0x1]
        || a[0x2] !== b[0x2]
        || a[0x3] !== b[0x3]
        || a[0x4] !== b[0x4]
        || a[0x5] !== b[0x5]
        || a[0x6] !== b[0x6]
        || a[0x7] !== b[0x7]
        || a[0x8] !== b[0x8]
        || a[0x9] !== b[0x9]
        || a[0xA] !== b[0xA]
        || a[0xB] !== b[0xB]
        || a[0xC] !== b[0xC]
        || a[0xD] !== b[0xD]
        || a[0xE] !== b[0xE]
        || a[0xF] !== b[0xF];
}
/**
 * Utility class for managing a shader uniform variable.
 * @class UniformLocation
 */
var UniformLocation = (function () {
    /**
     * @class UniformLocation
     * @constructor
     * @param monitor {RenderingContextMonitor}
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     */
    function UniformLocation(monitor, name) {
        this._x = void 0;
        this._y = void 0;
        this._z = void 0;
        this._w = void 0;
        this._matrix4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(function () { return void 0; });
        this._transpose = void 0;
        this._monitor = expectArg('monitor', monitor).toBeObject().value;
        this._name = expectArg('name', name).toBeString().value;
    }
    /**
     * @method contextFree
     */
    UniformLocation.prototype.contextFree = function () {
        this.contextLoss();
    };
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     */
    UniformLocation.prototype.contextGain = function (context, program) {
        this.contextLoss();
        this._location = context.getUniformLocation(program, this._name);
        this._context = context;
    };
    /**
     * @method contextLoss
     */
    UniformLocation.prototype.contextLoss = function () {
        this._location = void 0;
        this._context = void 0;
        this._x = void 0;
        this._y = void 0;
        this._z = void 0;
        this._w = void 0;
        this._matrix4.map(function () { return void 0; });
        this._transpose = void 0;
    };
    /**
     * @method uniform1f
     * @param x
     */
    UniformLocation.prototype.uniform1f = function (x) {
        if (this._monitor.mirror) {
            if (this._x !== x) {
                this._context.uniform1f(this._location, x);
                this._x = x;
            }
        }
        else {
            this._context.uniform1f(this._location, x);
            this._x = void 0;
        }
    };
    /**
     * @method uniform2f
     * @param x {number}
     * @param y {number}
     */
    UniformLocation.prototype.uniform2f = function (x, y) {
        return this._context.uniform2f(this._location, x, y);
    };
    /**
     * @method uniform3f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    UniformLocation.prototype.uniform3f = function (x, y, z) {
        return this._context.uniform3f(this._location, x, y, z);
    };
    /**
     * @method uniform4f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param w {number}
     */
    UniformLocation.prototype.uniform4f = function (x, y, z, w) {
        return this._context.uniform4f(this._location, x, y, z, w);
    };
    /**
     * @method matrix1
     * @param transpose {boolean}
     * @param matrix {Matrix1}
     */
    UniformLocation.prototype.matrix1 = function (transpose, matrix) {
        return this._context.uniform1fv(this._location, matrix.data);
    };
    /**
     * @method matrix2
     * @param transpose {boolean}
     * @param matrix {Matrix2}
     */
    UniformLocation.prototype.matrix2 = function (transpose, matrix) {
        return this._context.uniformMatrix2fv(this._location, transpose, matrix.data);
    };
    /**
     * @method matrix3
     * @param transpose {boolean}
     * @param matrix {Matrix3}
     */
    UniformLocation.prototype.matrix3 = function (transpose, matrix) {
        return this._context.uniformMatrix3fv(this._location, transpose, matrix.data);
    };
    /**
     * @method matrix4
     * @param transpose {boolean}
     * @param matrix {Matrix4}
     */
    UniformLocation.prototype.matrix4 = function (transpose, matrix) {
        var matrix4 = this._matrix4;
        var data = matrix.data;
        if (matrix4NE(matrix4, data) || this._transpose != transpose) {
            this._context.uniformMatrix4fv(this._location, transpose, data);
            // TODO: Use Matrix4.
            matrix4[0x0] = data[0x0];
            matrix4[0x1] = data[0x1];
            matrix4[0x2] = data[0x2];
            matrix4[0x3] = data[0x3];
            matrix4[0x4] = data[0x4];
            matrix4[0x5] = data[0x5];
            matrix4[0x6] = data[0x6];
            matrix4[0x7] = data[0x7];
            matrix4[0x8] = data[0x8];
            matrix4[0x9] = data[0x9];
            matrix4[0xA] = data[0xA];
            matrix4[0xB] = data[0xB];
            matrix4[0xC] = data[0xC];
            matrix4[0xD] = data[0xD];
            matrix4[0xE] = data[0xE];
            matrix4[0xF] = data[0xF];
            this._transpose = transpose;
        }
    };
    /**
     * @method vector1
     * @param vector {Vector1}
     */
    UniformLocation.prototype.vector1 = function (vector) {
        return this._context.uniform1fv(this._location, vector.data);
    };
    /**
     * @method vector2
     * @param vector {Vector2}
     */
    UniformLocation.prototype.vector2 = function (vector) {
        return this._context.uniform2fv(this._location, vector.data);
    };
    /**
     * @method vector3
     * @param vector {Vector3}
     */
    UniformLocation.prototype.vector3 = function (vector) {
        var data = vector.data;
        var x = data[0];
        var y = data[1];
        var z = data[2];
        if (this._x !== x || this._y !== y || this._z !== z) {
            this._context.uniform3fv(this._location, data);
            this._x = x;
            this._y = y;
            this._z = z;
        }
    };
    /**
     * @method vector4
     * @param vector {Vector4}
     */
    UniformLocation.prototype.vector4 = function (vector) {
        return this._context.uniform4fv(this._location, vector.data);
    };
    /**
     * @method toString
     */
    UniformLocation.prototype.toString = function () {
        return ['uniform', this._name].join(' ');
    };
    return UniformLocation;
})();
module.exports = UniformLocation;
