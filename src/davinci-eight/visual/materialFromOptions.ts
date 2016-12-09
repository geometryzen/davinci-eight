import ContextManager from '../core/ContextManager';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import LineMaterial from '../materials/LineMaterial';
import LineMaterialOptions from '../materials/LineMaterialOptions';
import Material from '../core/Material';
import MeshMaterial from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import PointMaterial from '../materials/PointMaterial';
import PointMaterialOptions from '../materials/PointMaterialOptions';
import SimplexMode from '../geometries/SimplexMode';

function pointMaterialOptions(): PointMaterialOptions {
    const options: PointMaterialOptions = { kind: 'LineMaterial', attributes: {}, uniforms: {} };

    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;

    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';

    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';

    options.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    return options;
}

function lineMaterialOptions(): LineMaterialOptions {
    const options: LineMaterialOptions = { kind: 'LineMaterial', attributes: {}, uniforms: {} };

    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;

    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';

    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    return options;
}

function meshMaterialOptions(): MeshMaterialOptions {
    const options: MeshMaterialOptions = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };

    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;

    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';

    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';

    options.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    return options;
}

/**
 * 
 */
export default function materialFromOptions(contextManager: ContextManager, simplexMode: SimplexMode, options: {}): Material {
    switch (simplexMode) {
        case SimplexMode.POINT: {
            const matOptions: PointMaterialOptions = pointMaterialOptions();
            const cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof PointMaterial) {
                return cachedMaterial;
            }
            else {
                const material = new PointMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        case SimplexMode.LINE: {
            const matOptions: LineMaterialOptions = lineMaterialOptions();
            const cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof LineMaterial) {
                return cachedMaterial;
            }
            else {
                const material = new LineMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        case SimplexMode.TRIANGLE: {
            const matOptions: MeshMaterialOptions = meshMaterialOptions();
            const cachedMaterial = contextManager.getCacheMaterial(matOptions);
            if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
                return cachedMaterial;
            }
            else {
                const material = new MeshMaterial(contextManager, matOptions);
                contextManager.putCacheMaterial(matOptions, material);
                return material;
            }
        }
        default: {
            throw new Error("simplexMode not specified for materialFromOptions");
        }
    }
}
