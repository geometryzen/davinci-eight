import { mustSatisfy } from '../checks/mustSatisfy';
/**
 * @hidden
 */
function beContextId() {
    return "be 'webgl2' or 'webgl'";
}
/**
 * @hidden
 */
function isWebGLContextId(x) {
    switch (x) {
        case 'webgl2': return true;
        case 'webgl': return true;
        default: return false;
    }
}
/**
 * @hidden
 */
export function mustBeWebGLContextId(name, value, contextBuilder) {
    if (isWebGLContextId(value)) {
        return value;
    }
    else {
        mustSatisfy(name, false, beContextId, contextBuilder);
        return value;
    }
}
