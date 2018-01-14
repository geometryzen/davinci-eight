import { isNull } from '../checks/isNull';
import { mustBeObject } from '../checks/mustBeObject';
/**
 * A wrapper around a <code>WebGLUniformLocation</code>.
 */
var Uniform = /** @class */ (function () {
    function Uniform(info) {
        if (!isNull(info)) {
            mustBeObject('info', info);
            this.name = info.name;
        }
    }
    Uniform.prototype.contextFree = function () {
        this.contextLost();
    };
    Uniform.prototype.contextGain = function (gl, program) {
        this.contextLost();
        this.gl = gl;
        // If the location is null, no uniforms are updated and no error code is generated.
        if (!isNull(this.name)) {
            this.location = gl.getUniformLocation(program, this.name);
        }
        else {
            this.location = null;
        }
    };
    Uniform.prototype.contextLost = function () {
        this.gl = void 0;
        this.location = void 0;
    };
    Uniform.prototype.uniform1f = function (x) {
        var gl = this.gl;
        if (gl) {
            gl.uniform1f(this.location, x);
        }
    };
    Uniform.prototype.uniform1i = function (x) {
        var gl = this.gl;
        if (gl) {
            gl.uniform1i(this.location, x);
        }
    };
    Uniform.prototype.uniform2f = function (x, y) {
        var gl = this.gl;
        if (gl) {
            gl.uniform2f(this.location, x, y);
        }
    };
    Uniform.prototype.uniform2i = function (x, y) {
        var gl = this.gl;
        if (gl) {
            gl.uniform2i(this.location, x, y);
        }
    };
    Uniform.prototype.uniform3f = function (x, y, z) {
        var gl = this.gl;
        if (gl) {
            gl.uniform3f(this.location, x, y, z);
        }
    };
    Uniform.prototype.uniform3i = function (x, y, z) {
        var gl = this.gl;
        if (gl) {
            gl.uniform3i(this.location, x, y, z);
        }
    };
    Uniform.prototype.uniform4f = function (x, y, z, w) {
        var gl = this.gl;
        if (gl) {
            gl.uniform4f(this.location, x, y, z, w);
        }
    };
    Uniform.prototype.uniform4i = function (x, y, z, w) {
        var gl = this.gl;
        if (gl) {
            gl.uniform4i(this.location, x, y, z, w);
        }
    };
    /**
     * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
     */
    Uniform.prototype.matrix2fv = function (transpose, value) {
        var gl = this.gl;
        if (gl) {
            gl.uniformMatrix2fv(this.location, transpose, value);
        }
    };
    /**
     * Sets a uniform location of type <code>mat3</code> in a <code>WebGLProgram</code>.
     */
    Uniform.prototype.matrix3fv = function (transpose, value) {
        var gl = this.gl;
        if (gl) {
            gl.uniformMatrix3fv(this.location, transpose, value);
        }
    };
    /**
     * Sets a uniform location of type <code>mat4</code> in a <code>WebGLProgram</code>.
     */
    Uniform.prototype.matrix4fv = function (transpose, value) {
        var gl = this.gl;
        if (gl) {
            gl.uniformMatrix4fv(this.location, transpose, value);
        }
    };
    Uniform.prototype.uniform1fv = function (data) {
        var gl = this.gl;
        if (gl) {
            gl.uniform1fv(this.location, data);
        }
    };
    Uniform.prototype.uniform2fv = function (data) {
        var gl = this.gl;
        if (gl) {
            gl.uniform2fv(this.location, data);
        }
    };
    Uniform.prototype.uniform3fv = function (data) {
        var gl = this.gl;
        if (gl) {
            gl.uniform3fv(this.location, data);
        }
    };
    Uniform.prototype.uniform4fv = function (data) {
        var gl = this.gl;
        if (gl) {
            gl.uniform4fv(this.location, data);
        }
    };
    Uniform.prototype.toString = function () {
        return ['uniform', this.name].join(' ');
    };
    return Uniform;
}());
export { Uniform };
