import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
import { SpinorE3 } from '../math/SpinorE3';
/**
 * @hidden
 */
export declare class Rotation implements Transform {
    private R;
    private names;
    constructor(R: SpinorE3, names: string[]);
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
