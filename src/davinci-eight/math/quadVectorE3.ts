import dotVectorCartesianE3 = require('../math/dotVectorCartesianE3')
import VectorE3 = require('../math/VectorE3')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')

function quadVectorE3(vector: VectorE3): number {
    if (isDefined(vector)) {
        var x = vector.x
        var y = vector.y
        var z = vector.z
        if (isNumber(x) && isNumber(y) && isNumber(z)) {
            return dotVectorCartesianE3(x, y, z, x, y, z)
        }
        else {
            return void 0
        }
    }
    else {
        return void 0
    }
}

export = quadVectorE3