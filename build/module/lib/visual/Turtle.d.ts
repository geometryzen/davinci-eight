import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
export interface TurtleOptions {
    axis?: VectorE3;
    color?: {
        r: number;
        g: number;
        b: number;
    };
    colored?: boolean;
    emissive?: boolean;
    meridian?: VectorE3;
    mode?: 'mesh' | 'wire' | 'point';
    offset?: VectorE3;
    textured?: boolean;
    tilt?: SpinorE3;
    transparent?: boolean;
    reflective?: boolean;
}
/**
 * A 3D visual representation of a turtle.
 */
export declare class Turtle extends Mesh<Geometry, Material> {
    constructor(contextManager: ContextManager, options?: TurtleOptions, levelUp?: number);
    protected destructor(levelUp: number): void;
    width: number;
    /**
     *
     */
    height: number;
}
