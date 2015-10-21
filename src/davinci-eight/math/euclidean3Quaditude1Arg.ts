import Cartesian3 = require('../math/Cartesian3')
import isDefined = require('../checks/isDefined')

function euclidean3Quaditude1Arg(vector: Cartesian3): number {
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