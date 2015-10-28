import SpinorE2 = require('../math/SpinorE2')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')

function quadSpinorE2(s: SpinorE2): number {
    if (isDefined(s)) {
        var α = s.α
        var β = s.β
        if (isNumber(α) && isNumber(β)) {
            return α * α + β * β
        }
        else {
            return void 0
        }
    }
    else {
        return void 0
    }
}

export = quadSpinorE2