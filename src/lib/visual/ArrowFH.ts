import { Facet } from '../..';
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
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options 
     * @param levelUp Leave as zero unless you are extending this class. 
     */
    constructor(contextManager: ContextManager, options: Partial<ArrowOptions> = {}, levelUp = 0) {
        this.head = new ArrowHead(contextManager, options, levelUp);
        this.tail = new ArrowTail(contextManager, options, levelUp);
        this.$vector.copyVector(this.head.vector).addVector(this.tail.vector);
        this.$vectorLock = this.$vector.lock();
        this.$position.copyVector(this.tail.position);
        this.$positionLock = this.$position.lock();
        this.$attitude.copySpinor(this.tail.attitude);
        this.$attitudeLock = this.$attitude.lock();
        this.updateHeadAttitude();
        this.updateHeadPosition();
    }
    name?: string;
    transparent?: boolean;
    render(ambients: Facet[]): void {
        this.head.render(ambients);
        this.tail.render(ambients);
    }
    contextFree?(): void {
        this.head.contextFree();
        this.tail.contextFree();
    }
    contextGain?(): void {
        this.head.contextGain();
        this.tail.contextGain();
    }
    contextLost?(): void {
        this.head.contextLost();
        this.tail.contextLost();
    }
    addRef?(): number {
        this.head.addRef();
        return this.tail.addRef();
    }
    release?(): number {
        this.head.release();
        return this.tail.release();
    }

    get vector(): VectorE3 {
        return this.$vector;
    }
    set vector(vector: VectorE3) {
        this.$vector.unlock(this.$vectorLock);
        this.$vector.copyVector(vector);
        this.$vectorLock = this.$vector.lock();
        this.length = normVectorE3(vector);
        // Don't try to set the direction for the zero vector.
        if (this.length !== 0) {
            this.head.axis = vector;
            this.tail.axis = vector;
        }
        this.updateHeadPosition();
    }

    get length() {
        return this.head.heightCone + this.tail.heightShaft;
    }
    set length(length: number) {
        // TODO
        const h = length * 0.2;
        const t = length * 0.8;
        this.head.heightCone = h;
        this.tail.heightShaft = t;
        this.updateHeadPosition();
    }

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
    get X(): Geometric3 {
        return this.$position;
    }
    set X(X: Geometric3) {
        this.setPosition(X);
    }
    get position(): Geometric3 {
        return this.$position;
    }
    set position(position: Geometric3) {
        this.setPosition(position);
    }
    get R(): Geometric3 {
        return this.$attitude;
    }
    set R(R: Geometric3) {
        this.setAttitude(R);
    }
    get attitude(): Geometric3 {
        return this.$attitude;
    }
    set attitude(attitude: Geometric3) {
        this.setAttitude(attitude);
    }
    get axis(): VectorE3 {
        return this.tail.axis;
    }
    set axis(axis: VectorE3) {
        this.head.axis = axis;
        this.tail.axis = axis;
    }
    get color(): Color {
        return this.head.color;
    }
    set color(color: Color) {
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
