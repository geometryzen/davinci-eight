/**
 *
 */
export default function makeWebGLShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
    const shader: WebGLShader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compiled) {
        return shader;
    }
    else {
        if (!gl.isContextLost()) {
            const message = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Error compiling shader: " + message);
        }
        else {
            throw new Error("Context lost while compiling shader");
        }
    }
}
