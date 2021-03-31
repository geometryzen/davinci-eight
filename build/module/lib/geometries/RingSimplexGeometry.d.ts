import { SliceSimplexPrimitivesBuilder } from '../geometries/SliceSimplexPrimitivesBuilder';
/**
 * @hidden
 */
export declare class RingSimplexGeometry extends SliceSimplexPrimitivesBuilder {
    a: number;
    b: number;
    private e;
    private cutLine;
    constructor(a?: number, b?: number, sliceAngle?: number);
    isModified(): boolean;
    regenerate(): void;
    setModified(modified: boolean): RingSimplexGeometry;
}
