import contextManagerFromOptions from './contextManagerFromOptions';
import expectOptions from '../checks/expectOptions';
import {Grid} from './Grid';
import GridOptions from './GridOptions';
import isDefined from '../checks/isDefined';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import VectorE3 from '../math/VectorE3';
import R3 from '../math/R3';
import VisualOptions from './VisualOptions';

export interface GridXYOptions extends VisualOptions {
    xMin?: number;
    xMax?: number;
    xSegments?: number;
    yMin?: number;
    yMax?: number;
    ySegments?: number;
    z?: (x: number, y: number) => number;
}

const ALLOWED_OPTIONS = ['xMin', 'xMax', 'xSegments', 'yMin', 'yMax', 'ySegments', 'z', 'engine', 'tilt', 'offset'];

function override(name: string, value: number, defaultValue: number, assertFn: (name: string, value: number) => number): number {
    if (isDefined(value)) {
        return assertFn(name, value);
    }
    else {
        return defaultValue;
    }
}

function mapOptions(options: GridXYOptions): GridOptions {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    let aPosition: (u: number, v: number) => VectorE3;
    if (isDefined(options.z)) {
        mustBeFunction('z', options.z);
        aPosition = function(x: number, y: number): VectorE3 {
            return R3(x, y, options.z(x, y));
        };
    }
    const uMin = override('xMin', options.xMin, -1, mustBeNumber);
    const uMax = override('xMax', options.xMax, +1, mustBeNumber);
    const uSegments = override('xSegments', options.xSegments, 10, mustBeInteger);
    const vMin = override('yMin', options.yMin, -1, mustBeNumber);
    const vMax = override('yMax', options.yMax, +1, mustBeNumber);
    const vSegments = override('ySegments', options.ySegments, 10, mustBeInteger);
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
        aPosition
    };
}

/**
 * A grid in the xy plane.
 */
export default class GridXY extends Grid {
    constructor(options: GridXYOptions = {}, levelUp = 0) {
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
