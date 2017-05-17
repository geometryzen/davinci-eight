import { SpinorE2 } from '../math/SpinorE2';
import { isDefined } from '../checks/isDefined';
import { isNumber } from '../checks/isNumber';

export function quadSpinorE2(s: SpinorE2): number {
    if (isDefined(s)) {
        const α = s.a;
        const β = s.b;
        if (isNumber(α) && isNumber(β)) {
            return α * α + β * β;
        }
        else {
            return void 0;
        }
    }
    else {
        return void 0;
    }
}
