import Usage from './Usage';

export default function(usage: Usage, gl: WebGLRenderingContext): number {
    if (gl) {
        switch (usage) {
            case Usage.STATIC_DRAW:
                return gl.STATIC_DRAW;
            case Usage.DYNAMIC_DRAW:
                return gl.DYNAMIC_DRAW;
            default:
                throw new Error(`Unexpected usage: ${usage}`);
        }
    }
}
