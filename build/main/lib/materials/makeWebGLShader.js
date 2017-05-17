"use strict";
/**
 * Utilities for the construction of WebGLShader code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
function makeWebGLShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compiled) {
        return shader;
    }
    else {
        if (!gl.isContextLost()) {
            var message = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Error compiling shader: " + message);
        }
        else {
            throw new Error("Context lost while compiling shader");
        }
    }
}
exports.makeWebGLShader = makeWebGLShader;
