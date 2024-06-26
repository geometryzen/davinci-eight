import { mustBeInteger } from "../checks/mustBeInteger";
import { mustBeString } from "../checks/mustBeString";
import { AttributeGlslType } from "../core/AttributeGlslType";
import { AttributeSizeType } from "../core/AttributeSizeType";
import { GraphicsProgramSymbols } from "../core/GraphicsProgramSymbols";

/**
 * @hidden
 */
function sizeType(size: AttributeSizeType): AttributeGlslType {
    mustBeInteger("size", size);
    switch (size) {
        case 1: {
            return "float";
        }
        case 2: {
            return "vec2";
        }
        case 3: {
            return "vec3";
        }
        case 4: {
            return "vec4";
        }
        default: {
            throw new Error("Can't compute the GLSL attribute type from size " + size);
        }
    }
}

/**
 * @hidden
 */
export function glslAttribType(key: string, size: AttributeSizeType): AttributeGlslType {
    mustBeString("key", key);
    mustBeInteger("size", size);
    switch (key) {
        case GraphicsProgramSymbols.ATTRIBUTE_COLOR: {
            // No need to hard-code to 'vec3' anymore.
            return sizeType(size);
        }
        default: {
            return sizeType(size);
        }
    }
}
