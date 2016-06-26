import SpinorE3 from '../math/SpinorE3';
import isDefined from '../checks/isDefined';
import isNumber from '../checks/isNumber';

export default function quadSpinorE3(s: SpinorE3): number {
    if (isDefined(s)) {
        var α = s.a
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
