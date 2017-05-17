function decodeType(gl, type) {
    if (type === gl.VERTEX_SHADER) {
        return "VERTEX_SHADER";
    }
    else if (type === gl.FRAGMENT_SHADER) {
        return "FRAGMENT_SHADER";
    }
    else {
        return "type => " + type + " shader";
    }
}
/**
 *
 */
export function makeWebGLShader(gl, source, type) {
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
            throw new Error(message);
        }
        else {
            throw new Error("Context lost while compiling " + decodeType(gl, type) + ".");
        }
    }
}
