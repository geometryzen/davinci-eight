import config from '../config';
import ErrorMode from './ErrorMode';

function decodeType(gl: WebGLRenderingContext, type: number): string {
    if (type === gl.VERTEX_SHADER) {
        return "VERTEX_SHADER";
    }
    else if (type === gl.FRAGMENT_SHADER) {
        return "FRAGMENT_SHADER";
    }
    else {
        return `type => ${type} shader`;
    }
}

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
            switch (config.errorMode) {
                case ErrorMode.WARNME: {
                    // Provide some extra context in WARNME mode.
                    config.warn(`Error compiling ${decodeType(gl, type)}. Cause: ${message}.`);
                }
            }
            throw new Error(message);
        }
        else {
            throw new Error(`Context lost while compiling ${decodeType(gl, type)}.`);
        }
    }
}
