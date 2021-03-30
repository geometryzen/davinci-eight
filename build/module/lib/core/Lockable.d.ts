/**
 * Sets the lock on the argument and returns the same argument.
 * @hidden
 */
export declare function lock<T extends Lockable>(m: T): T;
/**
 * @hidden
 */
export declare class TargetLockedError extends Error {
    /**
     * `operationName` is the name of the operation, without parentheses or parameters.
     */
    constructor(operationName: string);
}
/**
 * @hidden
 */
export declare class TargetUnlockedError extends Error {
    /**
     * `operationName` is the name of the operation, without parentheses.
     */
    constructor(operationName: string);
}
/**
 * @hidden
 */
export interface Lockable {
    /**
     * Determines whether this `Lockable` is locked.
     * If the `Lockable` is in the unlocked state then it is mutable.
     * If the `Lockable` is in the locked state then it is immutable.
     */
    isLocked(): boolean;
    /**
     * Locks this `Lockable` (preventing any further mutation),
     * and returns a token that may be used to unlock it.
     */
    lock(): number;
    /**
     * Unlocks this `Lockable` (allowing mutation),
     * using a token that was obtained from a preceding lock method call.
     */
    unlock(token: number): void;
}
/**
 * @hidden
 */
export declare function lockable(): Lockable;
/**
 * Lockable Mixin
 * @hidden
 */
export declare class LockableMixin implements Lockable {
    isLocked(): boolean;
    lock(): number;
    unlock(token: number): void;
}
