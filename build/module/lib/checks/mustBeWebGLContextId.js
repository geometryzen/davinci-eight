import { mustSatisfy } from '../checks/mustSatisfy';
function beContextId() {
    return "be 'webgl2' or 'webgl'";
}
function isWebGLContextId(x) {
    switch (x) {
        case 'webgl2': return true;
        case 'webgl': return true;
        default: return false;
    }
}
export function mustBeWebGLContextId(name, value, contextBuilder) {
    if (isWebGLContextId(value)) {
        return value;
    }
    else {
        mustSatisfy(name, false, beContextId, contextBuilder);
        return value;
    }
}
