import Vector = require('../math/Vector')
import Mutable = require('../math/Mutable')

/**
 * @class MutableVector
 * @xtends Mutable
 * @extends Vector
 */
interface MutableVector extends Mutable<number>, Vector {
    /**
     * @method clone
     * @return {MutableVector}
     */
    clone(): MutableVector;
    /**
     * @method sub
     * @param rhs {MutableVector}
     * @param [α = 1] {number}
     * @return {MutableVector}
     */
    sub(rhs: MutableVector, α?: number): MutableVector;
}

export = MutableVector