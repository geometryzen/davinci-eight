import CylinderGeometryOptions from './CylinderGeometryOptions';
import cylinderPrimitive from './cylinderPrimitive';
import VertexArrays from '../core/VertexArrays'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';

export default function cylinderVertexArrays(options: CylinderGeometryOptions = {}): VertexArrays {
    const primitive = cylinderPrimitive(options);
    return vertexArraysFromPrimitive(primitive);
}
