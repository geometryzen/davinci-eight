import DrawMode from './DrawMode'

export default function(mode: DrawMode, gl: WebGLRenderingContext): number {
    switch (mode) {
        case DrawMode.TRIANGLE_STRIP:
            return gl.TRIANGLE_STRIP
        case DrawMode.TRIANGLES:
            return gl.TRIANGLES
        case DrawMode.LINE_STRIP:
            return gl.LINE_STRIP
        case DrawMode.LINES:
            return gl.LINES
        case DrawMode.POINTS:
            return gl.POINTS
        default:
            throw new Error(`Unexpected mode: ${mode}`)
    }
}
