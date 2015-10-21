import Cartesian3 = require('../math/Cartesian3')
import isDefined = require('../checks/isDefined')

function euclidean3Quaditude1Arg2Arg(a: Cartesian3, b: Cartesian3): number {
    if (isDefined(a) && isDefined(b)) {
        return a.x * b.x + a.y * b.y + a.z * b.z
    }
    else {
        return void 0
    }
}

export = euclidean3Quaditude1Arg2Arg