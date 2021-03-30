import { Geometric3 } from '../math/Geometric3';
import { AbstractDrawable } from './AbstractDrawable';
import { Color } from './Color';
import { Geometry } from './Geometry';
import { Material } from './Material';

/**
 * @hidden
 */
export interface AbstractMesh<G extends Geometry, M extends Material> extends AbstractDrawable<G, M> {
    /**
     * 
     */
    R: Geometric3;
    /**
     * 
     */
    color: Color;
    /**
     * 
     */
    opacity: number;
    /**
     * 
     */
    pointSize: number;
    /**
     * 
     */
    X: Geometric3;
}
