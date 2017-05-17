import { isNull } from '../checks/isNull';
import { isNumber } from '../checks/isNumber';
import { isObject } from '../checks/isObject';
import { VectorE3 } from './VectorE3';

/**
 * Determines whether the argument supports the VectorE3 interface.
 * The argument must be a non-null object and must support the x, y, and z numeric properties.
 */
export function isVectorE3(v: any): v is VectorE3 {
    if (isObject(v) && !isNull(v)) {
        return isNumber((<VectorE3>v).x) && isNumber((<VectorE3>v).y) && isNumber((<VectorE3>v).z);
    }
    else {
        return false;
    }
}
