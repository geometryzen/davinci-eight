import vertexArraysFromPrimitive from './vertexArraysFromPrimitive';
import GeometryArrays from './GeometryArrays';
import GeometryElements from './GeometryElements';
import Primitive from './Primitive';
import {Engine} from './Engine';
import {Geometry} from './Geometry';

export default function geometryFromPrimitive(primitive: Primitive, engine: Engine, order?: string[]): Geometry {
    const data = vertexArraysFromPrimitive(primitive, order);
    if (primitive.indices) {
        return new GeometryElements(data, engine);
    }
    else {
        return new GeometryArrays(data, engine);
    }
}
