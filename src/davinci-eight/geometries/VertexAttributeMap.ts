import VectorN from '../math/VectorN'

/**
 * Using VectorN allows G2m, G3m, R1m, R2m, R3m, R4m, SpinG2m, SpinG3m.
 */
interface VertexAttributeMap {
    [name: string]: VectorN<number>
}

export default VertexAttributeMap
