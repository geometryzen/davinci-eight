import { expectOptions } from "../checks/expectOptions";
import { isDefined } from "../checks/isDefined";
import { mustBeFunction } from "../checks/mustBeFunction";
import { mustBeInteger } from "../checks/mustBeInteger";
import { mustBeNumber } from "../checks/mustBeNumber";
import { validate } from "../checks/validate";
import { ContextManager } from "../core/ContextManager";
import { GeometryMode } from "../geometries/GeometryMode";
import { vec } from "../math/R3";
import { VectorE3 } from "../math/VectorE3";
import { Grid } from "./Grid";
import { GridOptions } from "./GridOptions";

/**
 *
 */
export interface GridZXOptions {
    zMin?: number;
    zMax?: number;
    zSegments?: number;
    xMin?: number;
    xMax?: number;
    xSegments?: number;
    y?: (z: number, x: number) => number;
    mode?: GeometryMode;
}

/**
 * @hidden
 */
const ALLOWED_OPTIONS = ["zMin", "zMax", "zSegments", "xMin", "xMax", "xSegments", "y", "contextManager", "engine", "tilt", "offset", "mode"];

/**
 * @hidden
 */
function mapOptions(options: GridZXOptions): GridOptions {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    let aPosition: (u: number, v: number) => VectorE3;
    if (isDefined(options.y)) {
        mustBeFunction("y", options.y);
        aPosition = function (z: number, x: number): VectorE3 {
            return vec(x, options.y(z, x), z);
        };
    } else {
        aPosition = function (z: number, x: number): VectorE3 {
            return vec(x, 0, z);
        };
    }
    const uMin = validate("zMin", options.zMin, -1, mustBeNumber);
    const uMax = validate("zMax", options.zMax, +1, mustBeNumber);
    const uSegments = validate("zSegments", options.zSegments, 10, mustBeInteger);
    const vMin = validate("xMin", options.xMin, -1, mustBeNumber);
    const vMax = validate("xMax", options.xMax, +1, mustBeNumber);
    const vSegments = validate("xSegments", options.xSegments, 10, mustBeInteger);
    const mode: GeometryMode = validate("mode", options.mode, GeometryMode.WIRE, mustBeInteger);
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
 * A #d visual representation of a grid in the zx plane.
 */
export class GridZX extends Grid {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options: GridZXOptions = {}, levelUp = 0) {
        super(contextManager, mapOptions(options), levelUp + 1);
        this.setLoggingName("GridZX");
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * @hidden
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
