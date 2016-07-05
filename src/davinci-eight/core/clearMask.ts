import ClearBufferMask from './ClearBufferMask';
import mustSatisfy from '../checks/mustSatisfy';

/**
 * Computes the mask required for the WebGL clear method.
 */
export default function clearMask(colorFlag: boolean, depthFlag: boolean, stencilFlag: boolean, gl: WebGLRenderingContext): number {
    let mask = 0
    if (colorFlag) {
        if (gl) {
            // Experimental code to determine if documented values are correct.
            mustSatisfy('COLOR_BUFFER_BIT', gl.COLOR_BUFFER_BIT === 0x4000, () => { return 'clearMask' })
            mask |= gl.COLOR_BUFFER_BIT;
        }
        else {
            mask |= ClearBufferMask.COLOR_BUFFER_BIT;
        }
    }
    if (depthFlag) {
        if (gl) {
            // Experimental code to determine if documented values are correct.
            mustSatisfy('DEPTH_BUFFER_BIT', gl.DEPTH_BUFFER_BIT === 0x0100, () => { return 'clearMask' })
            mask |= gl.DEPTH_BUFFER_BIT
        }
        else {
            mask |= ClearBufferMask.DEPTH_BUFFER_BIT
        }
    }
    if (stencilFlag) {
        if (gl) {
            // Experimental code to determine if documented values are correct.
            mustSatisfy('STENCIL_BUFFER_BIT', gl.STENCIL_BUFFER_BIT === 0x0400, () => { return 'clearMask' })
            mask |= gl.STENCIL_BUFFER_BIT;
        }
        else {
            mask |= ClearBufferMask.STENCIL_BUFFER_BIT;
        }
    }
    return mask
}
