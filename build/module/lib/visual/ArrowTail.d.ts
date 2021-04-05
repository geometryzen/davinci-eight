import { ContextManager } from '../core/ContextManager';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { ArrowTailGeometry } from '../geometries/ArrowTailGeometry';
import { VectorE3 } from '../math/VectorE3';
import { ArrowOptions } from './ArrowOptions';
/**
 * @hidden
 */
export declare class ArrowTail extends Mesh<ArrowTailGeometry, Material> {
    private readonly $heightShaft;
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: Partial<Pick<ArrowOptions, 'axis' | 'color' | 'heightShaft' | 'mode' | 'offset' | 'radiusShaft' | 'textured' | 'thetaSegments' | 'tilt'>>, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    get vector(): VectorE3;
    set vector(vector: VectorE3);
    get heightShaft(): number;
    set heightShaft(heightShaft: number);
}
