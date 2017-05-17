
/**
 * Utilities for the construction of WebGLShader code.
 */

/**
 *
 */
export function makeWebGLShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
    var shader: WebGLShader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compiled) {
        return shader;
    }
    else {
        if (!gl.isContextLost()) {
            let message = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Error compiling shader: " + message);
        }
        else {
            throw new Error("Context lost while compiling shader");
        }
    }
}
