import { expectOptions } from '../checks/expectOptions';
import { isDefined } from '../checks/isDefined';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { validate } from '../checks/validate';
import { ContextManager } from '../core/ContextManager';
import { GeometryMode } from '../geometries/GeometryMode';
import { vec } from '../math/R3';
import { VectorE3 } from '../math/VectorE3';
import { Grid } from './Grid';
import { GridOptions } from './GridOptions';

export interface GridXYOptions {
    xMin?: number;
    xMax?: number;
    xSegments?: number;
    yMin?: number;
    yMax?: number;
    ySegments?: number;
    z?: (x: number, y: number) => number;
    mode?: GeometryMode;
}

/**
 * @hidden
 */
const ALLOWED_OPTIONS = ['xMin', 'xMax', 'xSegments', 'yMin', 'yMax', 'ySegments', 'z', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];

/**
 * @hidden
 */
function mapOptions(options: GridXYOptions): GridOptions {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    let aPosition: (u: number, v: number) => VectorE3;
    if (isDefined(options.z)) {
        mustBeFunction('z', options.z);
        aPosition = function (x: number, y: number): VectorE3 {
            return vec(x, y, options.z(x, y));
        };
    }
    else {
        aPosition = function (x: number, y: number): VectorE3 {
            return vec(x, y, 0);
        };
    }
    const uMin = validate('xMin', options.xMin, -1, mustBeNumber);
    const uMax = validate('xMax', options.xMax, +1, mustBeNumber);
    const uSegments = validate('xSegments', options.xSegments, 10, mustBeInteger);
    const vMin = validate('yMin', options.yMin, -1, mustBeNumber);
    const vMax = validate('yMax', options.yMax, +1, mustBeNumber);
    const vSegments = validate('ySegments', options.ySegments, 10, mustBeInteger);
    const mode: GeometryMode = validate('mode', options.mode, GeometryMode.WIRE, mustBeInteger);
    return {
        uMin,
        uMax,
        uSegments,
        vMin,
        vMax,
        vSegments,
        aPosition,
        mode
    };
}

/**
 * A grid in the xy plane.
 */
export class GridXY extends Grid {
    /**
     * Constructs a GridXY
     */
    constructor(contextManager: ContextManager, options: GridXYOptions = {}, levelUp = 0) {
        super(contextManager, mapOptions(options), levelUp + 1);
        this.setLoggingName('GridXY');
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
