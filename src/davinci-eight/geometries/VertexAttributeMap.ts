import VectorN from '../math/VectorN'

/**
 * Using VectorN allows G2m, G3m, Vector1, Vector2, Vector3, Vector4, Spinor2, Spinor3.
 */
interface VertexAttributeMap {
    [name: string]: VectorN<number>
}

export default VertexAttributeMap
