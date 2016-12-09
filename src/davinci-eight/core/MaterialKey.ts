import Material from './Material';

/**
 * 
 */
export interface MaterialKey<M extends Material> {
    kind: 'PointMaterial' | 'LineMaterial' | 'MeshMaterial';
}

export default MaterialKey;
