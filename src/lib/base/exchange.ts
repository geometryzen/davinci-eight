import { Shareable } from '../core/Shareable';

/**
 * exchange(thing to release, thing to addRef)
 */
export function exchange<T extends Shareable>(mine: T, yours: T): T {
    if (mine !== yours) {
        if (yours && yours.addRef) {
            yours.addRef();
        }
        if (mine && mine.release) {
            mine.release();
        }
        return yours;
    }
    else {
        // Keep mine, it's the same as yours anyway.
        return mine;
    }
}
