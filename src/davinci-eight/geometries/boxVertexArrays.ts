import BoxGeometryOptions from './BoxGeometryOptions';
import boxPrimitive from './boxPrimitive';
import VertexArrays from '../core/VertexArrays'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';

export default function boxVertexArrays(options: BoxGeometryOptions = {}): VertexArrays {
    const primitive = boxPrimitive(options);
    return vertexArraysFromPrimitive(primitive);
}
