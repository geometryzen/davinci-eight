import TetrahedronGeometryOptions from './TetrahedronGeometryOptions';
import tetrahedronPrimitive from './tetrahedronPrimitive';
import VertexArrays from '../core/VertexArrays'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';

export default function sphereVertexArrays(options: TetrahedronGeometryOptions = {}): VertexArrays {
    const primitive = tetrahedronPrimitive(options);
    return vertexArraysFromPrimitive(primitive);
}
