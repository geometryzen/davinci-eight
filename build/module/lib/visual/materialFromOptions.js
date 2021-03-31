import { isDefined } from '../checks/isDefined';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { SimplexMode } from '../geometries/SimplexMode';
import { LineMaterial } from '../materials/LineMaterial';
import { MeshMaterial } from '../materials/MeshMaterial';
import { PointMaterial } from '../materials/PointMaterial';
/**
 * @hidden
 */
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
/**
 * @hidden
 */
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
/**
 * @hidden
 */
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
 * @hidden
 */
export function materialFromOptions(contextManager, simplexMode, behaviors) {
    switch (simplexMode) {
        case SimplexMode.POINT: {
            var matOptions = pointMaterialOptions();
            return new PointMaterial(contextManager, matOptions);
        }
        case SimplexMode.LINE: {
            var matOptions = lineMaterialOptions();
            return new LineMaterial(contextManager, matOptions);
        }
        case SimplexMode.TRIANGLE: {
            var matOptions = meshMaterialOptions(behaviors);
            return new MeshMaterial(contextManager, matOptions);
        }
        default: {
            throw new Error("simplexMode not specified for materialFromOptions");
        }
    }
}
