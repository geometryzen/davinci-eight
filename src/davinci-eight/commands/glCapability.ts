import Capability from '../commands/Capability';
import isDefined from '../checks/isDefined';
import mustBeDefined from '../checks/mustBeDefined'
import mustBeInteger from '../checks/mustBeInteger';

// Converts the Capability enum to a WebGLRenderingContext symbolic constant.
export default function glCapability(capability: Capability, gl: WebGLRenderingContext) {
    if (isDefined(capability)) {
        mustBeInteger('capability', capability)
        mustBeDefined('gl', gl)
        switch (capability) {
            case Capability.BLEND: return gl.BLEND;
            case Capability.CULL_FACE: return gl.CULL_FACE;
            case Capability.DEPTH_TEST: return gl.DEPTH_TEST;
            case Capability.POLYGON_OFFSET_FILL: return gl.POLYGON_OFFSET_FILL;
            case Capability.SCISSOR_TEST: return gl.SCISSOR_TEST;
            default: {
                throw new Error(capability + " is not a valid capability.")
            }
        }
    }
    else {
        return void 0
    }
}
