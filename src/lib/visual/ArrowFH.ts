import { Facet } from '../core/Facet';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Renderable } from '../core/Renderable';
import { Geometric3 } from '../math/Geometric3';
import { normVectorE3 } from '../math/normVectorE3';
import { VectorE3 } from '../math/VectorE3';
import { ArrowHead } from './ArrowHead';
import { ArrowOptions } from './ArrowOptions';
import { ArrowTail } from './ArrowTail';

/**
 * An arrow with a fixed head and variable length.
 */
export class ArrowFH implements Renderable {
    private readonly head: ArrowHead;
    private readonly tail: ArrowTail;
    private readonly $vector: Geometric3 = Geometric3.zero(false);
    private $vectorLock: number;
    private readonly $position: Geometric3 = Geometric3.zero(false);
    private $positionLock: number;
    private readonly $attitude: Geometric3 = Geometric3.zero(false);
    private $attitudeLock: number;
    private readonly $color: Color = Color.fromRGB(1, 1, 1);
    private $colorLock: number;
    private $isHeadVisible = true;
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options 
     */
    constructor(contextManager: ContextManager, options: Partial<ArrowOptions> = {}) {
        this.head = new ArrowHead(contextManager, options);
        this.tail = new ArrowTail(contextManager, options);

        this.$vector.copyVector(this.head.vector).addVector(this.tail.vector);
        this.$vectorLock = this.$vector.lock();

        this.$position.copyVector(this.tail.position);
        this.$positionLock = this.$position.lock();

        this.$attitude.copySpinor(this.tail.attitude);
        this.$attitudeLock = this.$attitude.lock();

        this.$color.copy(this.tail.color);
        this.$colorLock = this.$color.lock();

        this.updateHeadAttitude();
        this.updateHeadPosition();
    }
    name: string;
    transparent: boolean;
    render(ambients: Facet[]): void {
        if (this.$isHeadVisible) {
            this.head.render(ambients);
        }
        this.tail.render(ambients);
    }
    /**
     * @hidden
     */
    contextFree(): void {
        this.head.contextFree();
        this.tail.contextFree();
    }
    /**
     * @hidden
     */
    contextGain(): void {
        this.head.contextGain();
        this.tail.contextGain();
    }
    /**
     * @hidden
     */
    contextLost(): void {
        this.head.contextLost();
        this.tail.contextLost();
    }
    addRef(): number {
        this.head.addRef();
        return this.tail.addRef();
    }
    release(): number {
        this.head.release();
        return this.tail.release();
    }
    /**
     * The vector from the tail of the arrow to the head of the arrow.
     */
    get vector(): Geometric3 {
        return this.$vector;
    }
    set vector(vector: Geometric3) {
        this.$vector.unlock(this.$vectorLock);
        this.$vector.copyVector(vector);
        this.$vectorLock = this.$vector.lock();
        const magnitude = normVectorE3(vector);
        const heightShaft = magnitude - this.head.heightCone;
        if (heightShaft >= 0) {
            this.$isHeadVisible = true;
            this.tail.heightShaft = heightShaft;
            this.updateHeadPosition();
        } else {
            this.$isHeadVisible = false;
            this.tail.heightShaft = magnitude;
        }
        // Don't try to set the direction for the zero vector.
        if (magnitude > 0) {
            this.head.axis = vector;
            this.tail.axis = vector;
        }
        this.updateHeadPosition();
    }

    /**
     * @hidden
     */
    isZombie(): boolean {
        if (this.head.isZombie()) {
            if (this.tail.isZombie()) {
                return true;
            } else {
                throw new Error();
            }
        } else {
            if (this.tail.isZombie()) {
                throw new Error();
            } else {
                return false;
            }
        }
    }
    /**
     * Alias for `position`.
     */
    get X(): Geometric3 {
        return this.$position;
    }
    set X(X: Geometric3) {
        this.setPosition(X);
    }
    /**
     * The position (vector).
     */
    get position(): Geometric3 {
        return this.$position;
    }
    set position(position: Geometric3) {
        this.setPosition(position);
    }
    /**
     * Alias for `attitude`.
     */
    get R(): Geometric3 {
        return this.$attitude;
    }
    set R(R: Geometric3) {
        this.setAttitude(R);
    }
    /**
     * The attitude (spinor).
     */
    get attitude(): Geometric3 {
        return this.$attitude;
    }
    set attitude(attitude: Geometric3) {
        this.setAttitude(attitude);
    }
    get color(): Color {
        return this.$color;
    }
    set color(color: Color) {
        this.$color.unlock(this.$colorLock);
        this.$color.copy(color);
        this.$colorLock = this.$color.lock();
        this.head.color = color;
        this.tail.color = color;
    }
    private setPosition(position: Geometric3): void {
        this.$position.unlock(this.$positionLock);
        this.$position.copyVector(position);
        this.$positionLock = this.$position.lock();
        this.tail.position = position;
        this.updateHeadPosition();
    }
    private setAttitude(attitude: Geometric3): void {
        this.$attitude.unlock(this.$attitudeLock);
        this.$attitude.copySpinor(attitude);
        this.$attitudeLock = this.$attitude.lock();
        this.tail.attitude = attitude;
        this.updateHeadPosition();
        this.updateHeadAttitude();
    }
    private updateHeadPosition(): void {
        this.head.position.copyVector(this.tail.position).addVector(this.tail.vector);
    }
    private updateHeadAttitude(): void {
        this.head.attitude = this.tail.attitude;
    }
}
