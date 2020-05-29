"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialFromOptions = void 0;
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var isDefined_1 = require("../checks/isDefined");
var LineMaterial_1 = require("../materials/LineMaterial");
var MeshMaterial_1 = require("../materials/MeshMaterial");
var PointMaterial_1 = require("../materials/PointMaterial");
var SimplexMode_1 = require("../geometries/SimplexMode");
function pointMaterialOptions() {
    var options = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    options.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    return options;
}
function lineMaterialOptions() {
    var options = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    options.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    return options;
}
function meshMaterialOptions(behaviors) {
    var options = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
    behaviors.colored = isDefined_1.isDefined(behaviors.colored) ? behaviors.colored : true;
    behaviors.reflective = isDefined_1.isDefined(behaviors.reflective) ? behaviors.reflective : true;
    behaviors.textured = isDefined_1.isDefined(behaviors.textured) ? behaviors.textured : false;
    behaviors.transparent = isDefined_1.isDefined(behaviors.transparent) ? behaviors.transparent : true;
    options.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
    if (behaviors.textured) {
        options.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = 2;
    }
    if (behaviors.colored) {
        options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    if (behaviors.transparent) {
        options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    if (behaviors.textured) {
        options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE] = 'sampler2D';
    }
    return options;
}
/**
 *
 */
function materialFromOptions(contextManager, simplexMode, behaviors) {
    switch (simplexMode) {
        case SimplexMode_1.SimplexMode.POINT: {
            var matOptions = pointMaterialOptions();
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof PointMaterial_1.PointMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new PointMaterial_1.PointMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        case SimplexMode_1.SimplexMode.LINE: {
            var matOptions = lineMaterialOptions();
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof LineMaterial_1.LineMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new LineMaterial_1.LineMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        case SimplexMode_1.SimplexMode.TRIANGLE: {
            var matOptions = meshMaterialOptions(behaviors);
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof MeshMaterial_1.MeshMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new MeshMaterial_1.MeshMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        default: {
            throw new Error("simplexMode not specified for materialFromOptions");
        }
    }
}
exports.materialFromOptions = materialFromOptions;
