import { isDefined } from '../checks/isDefined';
export function dotVectorE2(a, b) {
    if (isDefined(a) && isDefined(b)) {
        return a.x * b.x + a.y * b.y;
    }
    else {
        return void 0;
    }
}
