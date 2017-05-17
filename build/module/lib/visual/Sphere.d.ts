import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { SphereOptions } from './SphereOptions';
/**
 *
 */
export declare class Sphere extends Mesh<Geometry, Material> {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: SphereOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    radius: number;
}
