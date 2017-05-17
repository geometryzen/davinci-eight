import { Primitive } from './Primitive';
import { VertexArrays } from './VertexArrays';
/**
 * Converts the Primitive to the interleaved VertexArrays format.
 * This conversion is performed for eddiciency; it allows multiple attributes to be
 * combined into a single array of numbers so that it may be stored in a single vertex buffer.
 *
 * @param primitive The Primitive to be converted.
 * @param order The ordering of the attributes.
 */
export declare function vertexArraysFromPrimitive(primitive: Primitive, order?: string[]): VertexArrays;
