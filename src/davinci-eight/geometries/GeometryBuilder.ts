import Primitive from '../core/Primitive';
import Vector3 from '../math/Vector3';
import VertexArrays from '../core/VertexArrays';

/**
 * @class GeometryBuilder
 */
interface GeometryBuilder {

    /**
     * @property stress
     * @type Vector3
     */
    stress: Vector3;

    /**
     * @property offset
     * @type Vector3
     */
    offset: Vector3;

    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    toPrimitives(): Primitive[];

    /**
     * @method toVertexArrays
     * @return {VertexArrays[]}
     */
    toVertexArrays(): VertexArrays[];
}

export default GeometryBuilder
