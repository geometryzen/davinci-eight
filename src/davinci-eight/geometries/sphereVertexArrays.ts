import SphereGeometryOptions from './SphereGeometryOptions';
import spherePrimitive from './spherePrimitive';
import VertexArrays from '../core/VertexArrays'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';

export default function sphereVertexArrays(options: SphereGeometryOptions = {}): VertexArrays {
    const primitive = spherePrimitive(options);
    return vertexArraysFromPrimitive(primitive);
}
