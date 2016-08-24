import contextManagerFromOptions from './contextManagerFromOptions';
import expectOptions from '../checks/expectOptions';
import {Grid} from './Grid';
import GridOptions from './GridOptions';
import isDefined from '../checks/isDefined';
import mustBeFunction from '../checks/mustBeFunction';
import VectorE3 from '../math/VectorE3';
import R3 from '../math/R3';
import VisualOptions from './VisualOptions';

export interface GridZXOptions extends VisualOptions {
    zMin?: number;
    zMax?: number;
    zSegments?: number;
    xMin?: number;
    xMax?: number;
    xSegments?: number;
    y?: (z: number, x: number) => number;
}

const ALLOWED_OPTIONS = ['zMin', 'zMax', 'zSegments', 'xMin', 'xMax', 'xSegments', 'x', 'engine', 'tilt', 'offset'];

function mapOptions(options: GridZXOptions): GridOptions {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    let aPosition: (u: number, v: number) => VectorE3;
    if (isDefined(options.y)) {
        mustBeFunction('y', options.y);
        aPosition = function(z: number, x: number): VectorE3 {
            return R3(x, options.y(z, x), z);
        };
    }
    return {
        engine: contextManagerFromOptions(options),
        offset: options.offset,
        tilt: options.tilt,
        stress: options.stress,
        uMin: options.zMin,
        uMax: options.zMax,
        uSegments: options.zSegments,
        vMin: options.xMin,
        vMax: options.xMax,
        vSegments: options.xSegments,
        aPosition
    };
}

/**
 * A grid in the zx plane.
 */
export default class GridZX extends Grid {
    constructor(options: GridZXOptions = {}, levelUp = 0) {
        super(mapOptions(options), levelUp + 1);
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
