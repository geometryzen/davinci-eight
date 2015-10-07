import VectorN = require('../math/VectorN');
/**
 * Defined for implementation convenience.
 * All attributes of a vertex are defined through this map.
 * There are no preferred attributes. However symbolic constants exist for common attribute names.
 * [name: string]: VectorN<number>
 * @class VertexAttributeMap
 */
interface VertexAttributeMap {
    [name: string]: VectorN<number>;
}
export = VertexAttributeMap;
