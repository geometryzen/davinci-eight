import { Shareable } from '../core/Shareable';
import { ShareableBase } from '../core/ShareableBase';
/**
 *
 */
export declare class StringShareableMap<V extends Shareable> extends ShareableBase implements Shareable {
    private elements;
    /**
     * A map of string to V extends Shareable.
     */
    constructor();
    protected destructor(levelUp: number): void;
    /**
     * Determines whether the key exists in the map with a defined value.
     */
    exists(key: string): boolean;
    get(key: string): V;
    getWeakRef(key: string): V;
    put(key: string, value: V): void;
    putWeakRef(key: string, value: V): void;
    forEach(callback: (key: string, value: V) => void): void;
    get keys(): string[];
    get values(): V[];
    remove(key: string): V;
}
