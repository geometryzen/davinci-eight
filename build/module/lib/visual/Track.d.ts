import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { LineMaterial } from '../materials/LineMaterial';
import { Matrix4 } from '../math/Matrix4';
import { VectorE3 } from '../math/VectorE3';
/**
 * @hidden
 */
export declare class TrackGeometry implements Geometry {
    private contextManager;
    scaling: Matrix4;
    private data;
    private count;
    private N;
    private dirty;
    private vbo;
    private refCount;
    constructor(contextManager: ContextManager);
    protected destructor(): void;
    bind(material: Material): TrackGeometry;
    unbind(material: Material): TrackGeometry;
    draw(): TrackGeometry;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
    addRef(): number;
    release(): number;
    /**
     *
     */
    addPoint(x: number, y: number, z: number): void;
    /**
     *
     */
    erase(): void;
}
/**
 * @hidden
 */
export interface TrackOptions {
    color?: {
        r: 0;
        g: 0;
        b: 0;
    };
}
/**
 *
 */
export declare class Track extends Mesh<TrackGeometry, LineMaterial> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: TrackOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    /**
     *
     */
    addPoint(point: VectorE3): void;
    /**
     *
     */
    clear(): void;
}
