import VectorN from '../math/VectorN'

/**
 * Using VectorN allows G2, G3, R1, R2, R3, R4, SpinG2, SpinG3.
 */
interface VertexAttributeMap {
    [name: string]: VectorN<number>
}

export default VertexAttributeMap
