import Primitive from '../core/Primitive';
import Vector3 from '../math/Vector3';
import VertexArrays from '../core/VertexArrays';

interface GeometryBuilder {

    stress: Vector3;

    offset: Vector3;

    toPrimitives(): Primitive[];

    toVertexArrays(): VertexArrays[];
}

export default GeometryBuilder;
