import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { SpinorE3 } from '../math/SpinorE3';
export interface TurtleOptions {
    color?: {
        r: number;
        g: number;
        b: number;
    };
    tilt?: SpinorE3;
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
