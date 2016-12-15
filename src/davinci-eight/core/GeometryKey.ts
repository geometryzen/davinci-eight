import Geometry from './Geometry';

/**
 * 
 */
export interface GeometryKey<G extends Geometry> {
    kind?: 'ArrowGeometry' | 'BoxGeometry' | 'CurveGeometry' | 'CylinderGeometry' | 'GridGeometry' | 'HollowCylinderGeometry' | 'SphereGeometry' | 'TetrahedronGeometry' | 'TurtleGeometry';
}

export default GeometryKey;
