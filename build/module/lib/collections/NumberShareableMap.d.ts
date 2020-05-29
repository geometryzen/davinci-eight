import { Shareable } from '../core/Shareable';
import { ShareableBase } from '../core/ShareableBase';
export declare class NumberShareableMap<V extends Shareable> extends ShareableBase {
    private _elements;
    constructor();
    protected destructor(levelUp: number): void;
    exists(key: number): boolean;
    get(key: number): V;
    getWeakRef(index: number): V;
    put(key: number, value: V): void;
    putWeakRef(key: number, value: V): void;
    forEach(callback: (key: number, value: V) => void): void;
    get keys(): number[];
    remove(key: number): void;
}
