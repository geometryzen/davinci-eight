import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';

function sizeType(size: number): string {
    mustBeInteger('size', size);
    switch (size) {
        case 1: {
            return 'float';
        }
        break;
        case 2: {
            return 'vec2';
        }
        break;
        case 3: {
            return 'vec3';
        }
        break;
        case 4: {
            return 'vec4';
        }
        break;
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
        break;
        default: {
            return sizeType(size);
        }
    }
}
