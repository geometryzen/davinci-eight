import { VectorE2 } from '../math/VectorE2';
import { isDefined } from '../checks/isDefined';

export function dotVectorE2(a: VectorE2, b: VectorE2): number {
    if (isDefined(a) && isDefined(b)) {
        return a.x * b.x + a.y * b.y;
    }
    else {
        return void 0;
    }
}
