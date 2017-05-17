import { dotVectorCartesianE2 } from '../math/dotVectorCartesianE2';
import { isDefined } from '../checks/isDefined';
import { isNumber } from '../checks/isNumber';
export function quadVectorE2(vector) {
    if (isDefined(vector)) {
        var x = vector.x;
        var y = vector.y;
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
