import { Shareable } from '../core/Shareable';
/**
 * exchange(thing to release, thing to addRef)
 * @hidden
 */
export declare function exchange<T extends Shareable>(mine: T, yours: T): T;
