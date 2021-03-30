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

/**
 * @hidden
 */
export interface GridYZOptions {
    yMin?: number;
    yMax?: number;
    ySegments?: number;
    zMin?: number;
    zMax?: number;
    zSegments?: number;
    x?: (y: number, z: number) => number;
    mode?: GeometryMode;
}

/**
 * @hidden
 */
const ALLOWED_OPTIONS = ['yMin', 'yMax', 'ySegments', 'zMin', 'zMax', 'zSegments', 'x', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];

/**
 * @hidden
 */
function mapOptions(options: GridYZOptions): GridOptions {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    let aPosition: (u: number, v: number) => VectorE3;
    if (isDefined(options.x)) {
        mustBeFunction('x', options.x);
        aPosition = function (y: number, z: number): VectorE3 {
            return vec(options.x(y, z), y, z);
        };
    }
    else {
        aPosition = function (y: number, z: number): VectorE3 {
            return vec(0, y, z);
        };
    }
    const uMin = validate('yMin', options.yMin, -1, mustBeNumber);
    const uMax = validate('yMax', options.yMax, +1, mustBeNumber);
    const uSegments = validate('ySegments', options.ySegments, 10, mustBeInteger);
    const vMin = validate('zMin', options.zMin, -1, mustBeNumber);
    const vMax = validate('zMax', options.zMax, +1, mustBeNumber);
    const vSegments = validate('zSegments', options.zSegments, 10, mustBeInteger);
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
 * A grid in the yz plane.
 */
export class GridYZ extends Grid {
    /**
     * Constructs a GridYZ.
     */
    constructor(contextManager: ContextManager, options: GridYZOptions = {}, levelUp = 0) {
        super(contextManager, mapOptions(options), levelUp + 1);
        this.setLoggingName('GridYZ');
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
