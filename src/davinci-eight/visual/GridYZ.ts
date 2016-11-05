import contextManagerFromOptions from './contextManagerFromOptions';
import expectOptions from '../checks/expectOptions';
import { Grid } from './Grid';
import GridOptions from './GridOptions';
import isDefined from '../checks/isDefined';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import VectorE3 from '../math/VectorE3';
import R3 from '../math/R3';
import validate from '../checks/validate';
import VisualOptions from './VisualOptions';

export interface GridYZOptions extends VisualOptions {
    yMin?: number;
    yMax?: number;
    ySegments?: number;
    zMin?: number;
    zMax?: number;
    zSegments?: number;
    x?: (y: number, z: number) => number;
    k?: number;
}

const ALLOWED_OPTIONS = ['yMin', 'yMax', 'ySegments', 'zMin', 'zMax', 'zSegments', 'x', 'contextManager', 'engine', 'tilt', 'offset', 'k'];

function mapOptions(options: GridYZOptions): GridOptions {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    let aPosition: (u: number, v: number) => VectorE3;
    if (isDefined(options.x)) {
        mustBeFunction('x', options.x);
        aPosition = function (y: number, z: number): VectorE3 {
            return R3(options.x(y, z), y, z);
        };
    }
    else {
        aPosition = function (y: number, z: number): VectorE3 {
            return R3(0, y, z);
        };
    }
    const uMin = validate('yMin', options.yMin, -1, mustBeNumber);
    const uMax = validate('yMax', options.yMax, +1, mustBeNumber);
    const uSegments = validate('ySegments', options.ySegments, 10, mustBeInteger);
    const vMin = validate('zMin', options.zMin, -1, mustBeNumber);
    const vMax = validate('zMax', options.zMax, +1, mustBeNumber);
    const vSegments = validate('zSegments', options.zSegments, 10, mustBeInteger);
    return {
        engine: contextManagerFromOptions(options),
        offset: options.offset,
        tilt: options.tilt,
        stress: options.stress,
        uMin,
        uMax,
        uSegments,
        vMin,
        vMax,
        vSegments,
        aPosition,
        k: options.k
    };
}

/**
 * A grid in the yz plane.
 */
export default class GridYZ extends Grid {
    constructor(options: GridYZOptions = {}, levelUp = 0) {
        super(mapOptions(options), levelUp + 1);
        this.setLoggingName('GridYZ');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
