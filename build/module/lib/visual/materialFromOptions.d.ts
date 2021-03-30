import { ContextManager } from '../core/ContextManager';
import { Material } from '../core/Material';
import { MaterialKey } from '../core/MaterialKey';
import { SimplexMode } from '../geometries/SimplexMode';
import { LineMaterialOptions } from '../materials/LineMaterialOptions';
import { MeshMaterialOptions } from '../materials/MeshMaterialOptions';
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
export declare function materialFromOptions(contextManager: ContextManager, simplexMode: SimplexMode, behaviors: MaterialBehaviors): Material;
