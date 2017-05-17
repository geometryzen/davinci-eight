import { isDefined } from '../checks/isDefined';
import { isNumber } from '../checks/isNumber';
export function quadSpinorE2(s) {
    if (isDefined(s)) {
        var α = s.a;
        var β = s.b;
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
