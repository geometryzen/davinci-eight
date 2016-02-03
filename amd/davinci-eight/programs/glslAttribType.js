define(["require", "exports", '../core/GraphicsProgramSymbols', '../checks/mustBeInteger', '../checks/mustBeString'], function (require, exports, GraphicsProgramSymbols_1, mustBeInteger_1, mustBeString_1) {
    function sizeType(size) {
        mustBeInteger_1.default('size', size);
        switch (size) {
            case 1:
                {
                    return 'float';
                }
                break;
            case 2:
                {
                    return 'vec2';
                }
                break;
            case 3:
                {
                    return 'vec3';
                }
                break;
            case 4:
                {
                    return 'vec4';
                }
                break;
            default: {
                throw new Error("Can't compute the GLSL attribute type from size " + size);
            }
        }
    }
    function glslAttribType(key, size) {
        mustBeString_1.default('key', key);
        mustBeInteger_1.default('size', size);
        switch (key) {
            case GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR:
                {
                    return 'vec3';
                }
                break;
            default: {
                return sizeType(size);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = glslAttribType;
});
