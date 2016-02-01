import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import mustSatisy from '../checks/mustSatisfy';

function sizeType(size: number): string {
    mustBeInteger('size', size);
    switch (size) {
        case 1: {
            return 'float';
        }
        case 2: {
            return 'vec2';
        }
        case 3: {
            return 'vec3';
        }
        case 4: {
            return 'vec4';
        }
        default: {
            throw new Error("Can't compute the GLSL attribute type from size " + size);
        }
    }
}

export default function glslAttribType(key: string, size: number): string {
    mustBeString('key', key);
    mustBeInteger('size', size);
    switch (key) {
        case GraphicsProgramSymbols.ATTRIBUTE_COLOR: {
            return 'vec3';
        }
        default: {
            return sizeType(size);
        }
    }
}
