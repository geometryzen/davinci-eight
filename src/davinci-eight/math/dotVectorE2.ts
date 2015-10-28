import VectorE2 = require('../math/VectorE2')
import isDefined = require('../checks/isDefined')

function dotVectorE2(a: VectorE2, b: VectorE2): number {
    if (isDefined(a) && isDefined(b)) {
        return a.x * b.x + a.y * b.y
    }
    else {
        return void 0
    }
}

export = dotVectorE2