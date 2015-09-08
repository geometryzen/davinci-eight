declare class BufferAttribute {
    private array;
    private itemSize;
    constructor(array: Float32Array, itemSize: number);
    length: number;
    copyAt(index1: number, attribute: BufferAttribute, index2: number): BufferAttribute;
    set(value: number, offset: number): BufferAttribute;
    setX(index: number, x: number): BufferAttribute;
    setY(index: any, y: any): BufferAttribute;
    setZ(index: any, z: any): BufferAttribute;
    setXY(index: any, x: any, y: any): BufferAttribute;
    setXYZ(index: any, x: any, y: any, z: any): BufferAttribute;
    setXYZW(index: number, x: number, y: number, z: number, w: number): BufferAttribute;
    clone(): BufferAttribute;
}
export = BufferAttribute;
