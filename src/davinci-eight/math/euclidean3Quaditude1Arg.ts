import VectorE3 = require('../math/VectorE3')
import isDefined = require('../checks/isDefined')

function euclidean3Quaditude1Arg(vector: VectorE3): number {
    if (isDefined(vector)) {
        var x = vector.x
        var y = vector.y
        var z = vector.z
        return x * x + y * y + z * z
    }
    else {
        return void 0
    }
}

export = euclidean3Quaditude1Arg