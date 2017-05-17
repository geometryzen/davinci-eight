import { isDefined } from '../checks/isDefined';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
export function arraysEQ(a, b) {
    if (isDefined(a)) {
        if (isDefined(b)) {
            if (!isNull(a)) {
                if (!isNull(b)) {
                    var aLen = a.length;
                    var bLen = b.length;
                    if (aLen === bLen) {
                        for (var i = 0; i < aLen; i++) {
                            if (a[i] !== b[i]) {
                                return false;
                            }
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return isNull(b);
            }
        }
        else {
            return false;
        }
    }
    else {
        return isUndefined(b);
    }
}
