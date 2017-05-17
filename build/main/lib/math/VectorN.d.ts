import { Lockable } from '../core/Lockable';
/**
 *
 */
export declare class VectorN<T> implements Lockable {
    /**
     *
     */
    private readonly lock_;
    /**
     *
     */
    private size_;
    /**
     *
     */
    private data_;
    /**
     *
     */
    private modified_;
    /**
     *
     * @param data
     * @param modified
     * @param size
     */
    constructor(data: T[], modified?: boolean, size?: number);
    isLocked(): boolean;
    lock(): number;
    unlock(token: number): void;
    /**
     *
     */
    coords: T[];
    modified: boolean;
    /**
     *
     */
    readonly length: number;
    /**
     *
     */
    clone(): VectorN<T>;
    /**
     * @param index
     */
    getComponent(index: number): T;
    /**
     *
     */
    pop(): T;
    /**
     * @param value
     * @returns
     */
    push(value: T): number;
    /**
     * @param index
     * @param value
     */
    setComponent(index: number, value: T): void;
    /**
     * @param array
     * @param offset
     * @returns
     */
    toArray(array?: T[], offset?: number): T[];
    /**
     * @returns
     */
    toLocaleString(): string;
    /**
     * @returns
     */
    toString(): string;
}
