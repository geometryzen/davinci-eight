import {VectorN} from '../../math/VectorN'

/**
 * @module EIGHT
 * @submodule primitives
 */

/**
 * A mapping from the name of an attribute to VectorN parameterized by number.
 * Using VectorN allows Geometric2, Geometric3, Vector1, Vector2, Vector3, Vector4, Spinor2, Spinor3.
 *
 * @class VertexAttributeMap
 */
interface VertexAttributeMap {
    [name: string]: VectorN<number>
}

export default VertexAttributeMap
