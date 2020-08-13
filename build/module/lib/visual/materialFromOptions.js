import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { isDefined } from '../checks/isDefined';
import { LineMaterial } from '../materials/LineMaterial';
import { MeshMaterial } from '../materials/MeshMaterial';
import { PointMaterial } from '../materials/PointMaterial';
import { SimplexMode } from '../geometries/SimplexMode';
function pointMaterialOptions() {
    var options = { kind: 'PointMaterial', attributes: {}, uniforms: {} };
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    return options;
}
function lineMaterialOptions() {
    var options = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    return options;
}
function meshMaterialOptions(behaviors) {
    var options = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
    behaviors.colored = isDefined(behaviors.colored) ? behaviors.colored : true;
    behaviors.reflective = isDefined(behaviors.reflective) ? behaviors.reflective : true;
    behaviors.textured = isDefined(behaviors.textured) ? behaviors.textured : false;
    behaviors.transparent = isDefined(behaviors.transparent) ? behaviors.transparent : true;
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
    if (behaviors.textured) {
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = 2;
    }
    if (behaviors.colored) {
        options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    if (behaviors.transparent) {
        options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    if (behaviors.textured) {
        options.uniforms[GraphicsProgramSymbols.UNIFORM_IMAGE] = 'sampler2D';
    }
    return options;
}
/**
 *
 */
export function materialFromOptions(contextManager, simplexMode, behaviors) {
    switch (simplexMode) {
        case SimplexMode.POINT: {
            var matOptions = pointMaterialOptions();
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof PointMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new PointMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        case SimplexMode.LINE: {
            var matOptions = lineMaterialOptions();
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof LineMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new LineMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        case SimplexMode.TRIANGLE: {
            var matOptions = meshMaterialOptions(behaviors);
            var cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
                return cachedMaterial;
            }
            else {
                var material = new MeshMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        default: {
            throw new Error("simplexMode not specified for materialFromOptions");
        }
    }
}
