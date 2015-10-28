import SpinorE2 = require('../math/SpinorE2')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')

function quadSpinorE2(s: SpinorE2): number {
    if (isDefined(s)) {
        var s0 = s.w
        var s1 = s.xy
        if (isNumber(s0) && isNumber(s1)) {
            return s0 * s0 + s1 * s1
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