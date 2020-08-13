import { ContextManager } from '../core/ContextManager';
import { LineMaterialOptions } from '../materials/LineMaterialOptions';
import { Material } from '../core/Material';
import { MeshMaterialOptions } from '../materials/MeshMaterialOptions';
import { PointMaterialOptions } from '../materials/PointMaterialOptions';
import { SimplexMode } from '../geometries/SimplexMode';
import { MaterialKey } from '../core/MaterialKey';
export interface PointMaterialOptionsWithKind extends PointMaterialOptions, MaterialKey {
    kind: 'PointMaterial';
}
export interface LineMaterialOptionsWithKind extends LineMaterialOptions, MaterialKey {
    kind: 'LineMaterial';
}
export interface MeshMaterialOptionsWithKind extends MeshMaterialOptions, MaterialKey {
    kind: 'MeshMaterial';
}
/**
 * Behaviors are what the end-user cares about.
 * These must be translated into implementation details.
 */
export interface MaterialBehaviors {
    textured?: boolean;
    transparent?: boolean;
    emissive?: boolean;
    colored?: boolean;
    reflective?: boolean;
}
/**
 *
 */
export declare function materialFromOptions(contextManager: ContextManager, simplexMode: SimplexMode, behaviors: MaterialBehaviors): Material;
