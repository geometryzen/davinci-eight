/**
 * Sets the lock on the argument and returns the same argument.
 */
export function lock<T extends Lockable>(m: T): T {
    m.lock();
    return m;
}

export class TargetLockedError extends Error {
    /**
     * `operationName` is the name of the operation, without parentheses or parameters.
     */
    constructor(operationName: string) {
        super(`target of operation '${operationName}' must be mutable.`);
    }
}

export class TargetUnlockedError extends Error {
    /**
     * `operationName` is the name of the operation, without parentheses.
     */
    constructor(operationName: string) {
        super(`target of operation '${operationName}' must be immutable.`);
    }
}

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

export function lockable(): Lockable {
    let lock_: number = void 0;
    const that: Lockable = {
        isLocked() {
            return typeof lock_ === 'number';
        },
        lock(): number {
            if (that.isLocked()) {
                throw new Error("already locked");
            }
            else {
                lock_ = Math.random();
                return lock_;
            }

        },
        unlock(token: number): void {
            if (typeof token !== 'number') {
                throw new Error("token must be a number.");
            }
            if (!that.isLocked()) {
                throw new Error("not locked");
            }
            else if (lock_ === token) {
                lock_ = void 0;
            }
            else {
                throw new Error("unlock denied");
            }
        }
    };
    return that;
}

/**
 * Lockable Mixin
 */
export class LockableMixin implements Lockable {

    public isLocked(): boolean {
        return typeof this['lock_'] === 'number';
    }

    public lock(): number {
        if (this.isLocked()) {
            throw new Error("already locked");
        }
        else {
            this['lock_'] = Math.random();
            return this['lock_'];
        }
    }

    public unlock(token: number): void {
        if (typeof token !== 'number') {
            throw new Error("token must be a number.");
        }
        if (!this.isLocked()) {
            throw new Error("not locked");
        }
        else if (this['lock_'] === token) {
            this['lock_'] = void 0;
        }
        else {
            throw new Error("unlock denied");
        }
    }
}
