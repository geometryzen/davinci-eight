import { dotVectorCartesianE2 } from '../math/dotVectorCartesianE2';
import { isDefined } from '../checks/isDefined';
import { isNumber } from '../checks/isNumber';
import { VectorE2 } from '../math/VectorE2';

export function quadVectorE2(vector: VectorE2): number {
    if (isDefined(vector)) {
        const x = vector.x;
        const y = vector.y;
        if (isNumber(x) && isNumber(y)) {
            return dotVectorCartesianE2(x, y, x, y);
        }
        else {
            return void 0;
        }
    }
    else {
        return void 0;
    }
}
