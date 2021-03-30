import { Primitive } from './Primitive';
import { VertexArrays } from './VertexArrays';
/**
 * We actually want to return both the Primitive and the order: string[] to be reversible.
 * @hidden
 */
export declare function primitiveFromVertexArrays(data: VertexArrays): Primitive;
