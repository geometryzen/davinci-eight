import dotVectorCartesianE2 = require('../math/dotVectorCartesianE2')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')
import VectorE2 = require('../math/VectorE2')

function quadVectorE2(vector: VectorE2): number {
    if (isDefined(vector)) {
        var x = vector.x
        var y = vector.y
        if (isNumber(x) && isNumber(y)) {
            return dotVectorCartesianE2(x, y, x, y)
        }
        else {
            return void 0
        }
    }
    else {
        return void 0
    }
}

export = quadVectorE2