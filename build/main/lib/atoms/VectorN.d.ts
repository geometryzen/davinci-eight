export interface VectorN<T> {
    length: number;
    getComponent(index: number): T;
    toArray(): T[];
}
