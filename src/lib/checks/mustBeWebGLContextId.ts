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
function isWebGLContextId(x: any): x is 'webgl2' | 'webgl' {
    switch (x) {
        case 'webgl2': return true;
        case 'webgl': return true;
        default: return false;
    }
}

/**
 * @hidden
 */
export function mustBeWebGLContextId(name: string, value: any, contextBuilder?: () => string): 'webgl2' | 'webgl' {
    if (isWebGLContextId(value)) {
        return value;
    }
    else {
        mustSatisfy(name, false, beContextId, contextBuilder);
        return value;
    }
}
