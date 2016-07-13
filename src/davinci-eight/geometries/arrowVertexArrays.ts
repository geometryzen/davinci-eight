import ArrowBuilder from '../shapes/ArrowBuilder';
import ArrowGeometryOptions from './ArrowGeometryOptions';
import isDefined from '../checks/isDefined';
import mustBeObject from '../checks/mustBeObject';
import R3 from '../math/R3';
import Spinor3 from '../math/Spinor3';
import Vector3 from '../math/Vector3';
import VertexArrays from '../core/VertexArrays'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';

export default function arrowVertexArrays(options: ArrowGeometryOptions = {}): VertexArrays {
    mustBeObject('options', options)

    const builder = new ArrowBuilder(R3.e2, R3.e3, false);
    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1))
    builder.tilt.copySpinor(isDefined(options.tilt) ? options.tilt : Spinor3.one())
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero())
    const primitive = builder.toPrimitive()
    return vertexArraysFromPrimitive(primitive)
}
