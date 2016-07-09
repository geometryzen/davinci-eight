import vertexArraysFromPrimitive from './vertexArraysFromPrimitive';
import GeometryElements from './GeometryElements';
import Primitive from './Primitive';
import {Engine} from './Engine';
import {Geometry} from './Geometry';

export default function geometryFromPrimitive(primitive: Primitive, engine: Engine, order?: string[]): Geometry {
    const data = vertexArraysFromPrimitive(primitive, order);
    return new GeometryElements(data, engine);
}
