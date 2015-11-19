define(["require", "exports", '../core/GraphicsProgramSymbols', '../checks/mustBeInteger', '../checks/mustBeString'], function (require, exports, GraphicsProgramSymbols, mustBeInteger, mustBeString) {
    function sizeType(size) {
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
    function glslAttribType(key, size) {
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
    return glslAttribType;
});
