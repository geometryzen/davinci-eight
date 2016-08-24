import contextManagerFromOptions from './contextManagerFromOptions';
import expectOptions from '../checks/expectOptions';
import {Grid} from './Grid';
import GridOptions from './GridOptions';
import isDefined from '../checks/isDefined';
import mustBeFunction from '../checks/mustBeFunction';
import VectorE3 from '../math/VectorE3';
import R3 from '../math/R3';
import VisualOptions from './VisualOptions';

export interface GridYZOptions extends VisualOptions {
    yMin?: number;
    yMax?: number;
    ySegments?: number;
    zMin?: number;
    zMax?: number;
    zSegments?: number;
    x?: (y: number, z: number) => number;
}

const ALLOWED_OPTIONS = ['yMin', 'yMax', 'ySegments', 'zMin', 'zMax', 'zSegments', 'x', 'engine', 'tilt', 'offset'];

function mapOptions(options: GridYZOptions): GridOptions {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    let aPosition: (u: number, v: number) => VectorE3;
    if (isDefined(options.x)) {
        mustBeFunction('x', options.x);
        aPosition = function(y: number, z: number): VectorE3 {
            return R3(options.x(y, z), y, z);
        };
    }
    return {
        engine: contextManagerFromOptions(options),
        offset: options.offset,
        tilt: options.tilt,
        stress: options.stress,
        uMin: options.yMin,
        uMax: options.yMax,
        uSegments: options.ySegments,
        vMin: options.zMin,
        vMax: options.zMax,
        vSegments: options.zSegments,
        aPosition
    };
}

/**
 * A grid in the yz plane.
 */
export default class GridYZ extends Grid {
    constructor(options: GridYZOptions = {}, levelUp = 0) {
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
