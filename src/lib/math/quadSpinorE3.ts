import { SpinorE3 } from '../math/SpinorE3';
import { isDefined } from '../checks/isDefined';
import { isNumber } from '../checks/isNumber';

export function quadSpinorE3(s: SpinorE3): number {
    if (isDefined(s)) {
        const α = s.a;
        const x = s.yz;
        const y = s.zx;
        const z = s.xy;
        if (isNumber(α) && isNumber(x) && isNumber(y) && isNumber(z)) {
            return α * α + x * x + y * y + z * z;
        }
        else {
            return void 0;
        }
    }
    else {
        return void 0;
    }
}
