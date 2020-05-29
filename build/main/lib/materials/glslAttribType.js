"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.glslAttribType = void 0;
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeString_1 = require("../checks/mustBeString");
function sizeType(size) {
    mustBeInteger_1.mustBeInteger('size', size);
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
    mustBeString_1.mustBeString('key', key);
    mustBeInteger_1.mustBeInteger('size', size);
    switch (key) {
        case GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR: {
            // No need to hard-code to 'vec3' anymore.
            return sizeType(size);
        }
        default: {
            return sizeType(size);
        }
    }
}
exports.glslAttribType = glslAttribType;
