import Vector = require('../math/Vector')
import Mutable = require('../math/Mutable')

interface MutableVector extends Mutable<number>, Vector {
    clone(): MutableVector;
    sub(rhs: MutableVector, α?: number): MutableVector;
}

export = MutableVector
