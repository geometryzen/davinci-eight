import { Facet } from '../..';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Renderable } from '../core/Renderable';
import { Geometric3 } from '../math/Geometric3';
import { VectorE3 } from '../math/VectorE3';
import { ArrowOptions } from './ArrowOptions';
/**
 * An arrow with a fixed head and variable length.
 */
export declare class ArrowFH implements Renderable {
    private readonly head;
    private readonly tail;
    private readonly $vector;
    private readonly $vectorLock;
    private readonly $attitude;
    private $attitudeLock;
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: Partial<ArrowOptions>, levelUp?: number);
    name?: string;
    transparent?: boolean;
    render(ambients: Facet[]): void;
    contextFree?(): void;
    contextGain?(): void;
    contextLost?(): void;
    addRef?(): number;
    release?(): number;
    /**
     * The vector that is represented by the Arrow.
     *
     * magnitude(Arrow.vector) = Arrow.length
     * direction(Arrow.vector) = Arrow.axis
     * Arrow.vector = Arrow.length * Arrow.axis
     */
    get vector(): VectorE3;
    set vector(vector: VectorE3);
    /**
     * The length of the Arrow.
     * This property determines the scaling of the Arrow in all directions.
     */
    get length(): number;
    set length(length: number);
    isZombie(): boolean;
    get X(): Geometric3;
    set X(X: Geometric3);
    get position(): Geometric3;
    set position(position: Geometric3);
    get R(): Geometric3;
    set R(R: Geometric3);
    get attitude(): Geometric3;
    set attitude(attitude: Geometric3);
    get axis(): VectorE3;
    set axis(axis: VectorE3);
    get color(): Color;
    set color(color: Color);
}
