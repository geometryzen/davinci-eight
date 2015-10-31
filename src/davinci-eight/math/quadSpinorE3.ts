import SpinorE3 = require('../math/SpinorE3')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')

function quadSpinorE3(s: SpinorE3): number {
    if (isDefined(s)) {
        var α = s.α
        var x = s.yz
        var y = s.zx
        var z = s.xy
        if (isNumber(α) && isNumber(x) && isNumber(y) && isNumber(z)) {
            return α * α + x * x + y * y + z * z
        }
        else {
            return void 0
        }
    }
    else {
        return void 0
    }
}

export = quadSpinorE3