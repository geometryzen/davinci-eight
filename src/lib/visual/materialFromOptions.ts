import { isDefined } from '../checks/isDefined';
import { ContextManager } from '../core/ContextManager';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Material } from '../core/Material';
import { MaterialKey } from '../core/MaterialKey';
import { SimplexMode } from '../geometries/SimplexMode';
import { LineMaterial } from '../materials/LineMaterial';
import { LineMaterialOptions } from '../materials/LineMaterialOptions';
import { MeshMaterial } from '../materials/MeshMaterial';
import { MeshMaterialOptions } from '../materials/MeshMaterialOptions';
import { PointMaterial } from '../materials/PointMaterial';
import { PointMaterialOptions } from '../materials/PointMaterialOptions';

/**
 * @hidden
 */
export interface PointMaterialOptionsWithKind extends PointMaterialOptions, MaterialKey {
    kind: 'PointMaterial';
}

/**
 * @hidden
 */
export interface LineMaterialOptionsWithKind extends LineMaterialOptions, MaterialKey {
    kind: 'LineMaterial';
}

/**
 * @hidden
 */
export interface MeshMaterialOptionsWithKind extends MeshMaterialOptions, MaterialKey {
    kind: 'MeshMaterial';
}

/**
 * @hidden
 */
function pointMaterialOptions(): PointMaterialOptionsWithKind {
    const options: PointMaterialOptionsWithKind = { kind: 'PointMaterial', attributes: {}, uniforms: {} };

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
function lineMaterialOptions(): LineMaterialOptionsWithKind {
    const options: LineMaterialOptionsWithKind = { kind: 'LineMaterial', attributes: {}, uniforms: {} };

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
function meshMaterialOptions(behaviors: MaterialBehaviors): MeshMaterialOptionsWithKind {
    const options: MeshMaterialOptionsWithKind = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };

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
 * Behaviors are what the end-user cares about.
 * These must be translated into implementation details.
 * @hidden
 */
export interface MaterialBehaviors {
    textured?: boolean;
    transparent?: boolean;
    emissive?: boolean;
    colored?: boolean;
    reflective?: boolean;
}

/**
 * @hidden
 */
export function materialFromOptions(contextManager: ContextManager, simplexMode: SimplexMode, behaviors: MaterialBehaviors): Material {
    switch (simplexMode) {
        case SimplexMode.POINT: {
            const matOptions: PointMaterialOptionsWithKind = pointMaterialOptions();
            return new PointMaterial(contextManager, matOptions);
        }
        case SimplexMode.LINE: {
            const matOptions: LineMaterialOptionsWithKind = lineMaterialOptions();
            return new LineMaterial(contextManager, matOptions);
        }
        case SimplexMode.TRIANGLE: {
            const matOptions: MeshMaterialOptionsWithKind = meshMaterialOptions(behaviors);
            return new MeshMaterial(contextManager, matOptions);
        }
        default: {
            throw new Error("simplexMode not specified for materialFromOptions");
        }
    }
}
