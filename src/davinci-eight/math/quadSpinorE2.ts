import SpinorE2 from '../math/SpinorE2';
import isDefined from '../checks/isDefined';
import isNumber from '../checks/isNumber';

export default function quadSpinorE2(s: SpinorE2): number {
    if (isDefined(s)) {
        var α = s.α
        var xy = s.xy
        if (isNumber(α) && isNumber(xy)) {
            return α * α + xy * xy
        }
        else {
            return void 0
        }
    }
    else {
        return void 0
    }
}
