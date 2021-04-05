import { Facet } from '../core/Facet';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Renderable } from '../core/Renderable';
import { Geometric3 } from '../math/Geometric3';
import { ArrowOptions } from './ArrowOptions';
/**
 * An arrow with a fixed head and variable length.
 */
export declare class ArrowFH implements Renderable {
    private readonly head;
    private readonly tail;
    private readonly $vector;
    private $vectorLock;
    private readonly $position;
    private $positionLock;
    private readonly $attitude;
    private $attitudeLock;
    private readonly $color;
    private $colorLock;
    private $isHeadVisible;
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     */
    constructor(contextManager: ContextManager, options?: Partial<ArrowOptions>);
    name: string;
    transparent: boolean;
    render(ambients: Facet[]): void;
    /**
     * @hidden
     */
    contextFree(): void;
    /**
     * @hidden
     */
    contextGain(): void;
    /**
     * @hidden
     */
    contextLost(): void;
    addRef(): number;
    release(): number;
    /**
     * The vector from the tail of the arrow to the head of the arrow.
     */
    get vector(): Geometric3;
    set vector(vector: Geometric3);
    /**
     * @hidden
     */
    isZombie(): boolean;
    /**
     * Alias for `position`.
     */
    get X(): Geometric3;
    set X(X: Geometric3);
    /**
     * The position (vector).
     */
    get position(): Geometric3;
    set position(position: Geometric3);
    /**
     * Alias for `attitude`.
     */
    get R(): Geometric3;
    set R(R: Geometric3);
    /**
     * The attitude (spinor).
     */
    get attitude(): Geometric3;
    set attitude(attitude: Geometric3);
    get color(): Color;
    set color(color: Color);
    private setPosition;
    private setAttitude;
    private updateHeadPosition;
    private updateHeadAttitude;
}
