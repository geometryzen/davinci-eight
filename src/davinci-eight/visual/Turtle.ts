import BeginMode from '../core/BeginMode';
import { Color } from '../core/Color';
import ContextManager from '../core/ContextManager';
import DataType from '../core/DataType';
import { Engine } from '../core/Engine';
import { Geometric3 } from '../math/Geometric3';
import GeometryArrays from '../core/GeometryArrays';
import { LineMaterial } from '../materials/LineMaterial';
import mustBeEngine from './mustBeEngine';
import Primitive from '../core/Primitive';
import { RigidBody } from './RigidBody';
import setColorOption from './setColorOption';
import SpinorE3 from '../math/SpinorE3';
import tiltFromOptions from './tiltFromOptions';
import vec from '../math/R3';
import VectorE3 from '../math/VectorE3';

const NOSE = [0, +1, 0];
const LLEG = [-1, -1, 0];
const RLEG = [+1, -1, 0];
const TAIL = [0, -1, 0];
const CENTER = [0, 0, 0];
const LEFT = [-0.5, 0, 0];

const canonicalAxis = vec(0, 0, 1);
const zero = vec(0, 0, 0);

function concat<T>(a: T[], b: T[]) { return a.concat(b); }

/**
 * Transform a list of points by applying a tilt rotation and an offset translation.
 */
function transform(xs: number[][], options: { tilt?: SpinorE3, offset?: VectorE3 }): number[][] {
    if (options.tilt || options.offset) {
        const points = xs.map(function (coords) { return Geometric3.vector(coords[0], coords[1], coords[2]); });
        if (options.tilt) {
            points.forEach(function (point) {
                point.rotate(options.tilt);
            });
        }
        if (options.offset) {
            points.forEach(function (point) {
                point.addVector(options.offset);
            });
        }
        return points.map(function (point) { return [point.x, point.y, point.z]; });
    }
    else {
        return xs;
    }
}

/**
 * Creates the Turtle Primitive.
 * All points lie in the the plane z = 0.
 * The height and width of the triangle are centered on the origin (0, 0).
 * The height and width range from -1 to +1.
 */
function primitive(options: { tilt?: SpinorE3, offset?: VectorE3 }): Primitive {
    const values = transform([CENTER, LEFT, CENTER, TAIL, NOSE, LLEG, NOSE, RLEG, LLEG, RLEG], options).reduce(concat);
    const result: Primitive = {
        mode: BeginMode.LINES,
        attributes: {
            'aPosition': { values, size: CENTER.length, type: DataType.FLOAT }
        }
    };
    return result;
}

interface TurtleGeometryOptions {
    tilt?: SpinorE3;
    offset?: VectorE3;
}

/**
 * The geometry of the Bug is static so we use the conventional
 * approach based upon GeometryArrays
 */
class TurtleGeometry extends GeometryArrays {
    private w = 1;
    private h = 1;
    private d = 1;
    constructor(private contextManager: ContextManager, options: TurtleGeometryOptions = {}) {
        super(contextManager, primitive(options), options);
    }

    getPrincipalScale(name: string): number {
        switch (name) {
            case 'width': {
                return this.w;
            }
            case 'height': {
                return this.h;
            }
            case 'depth': {
                return this.d;
            }
            default: {
                throw new Error(`getPrincipalScale(${name}): name is not a principal scale property.`);
            }
        }
    }

    setPrincipalScale(name: string, value: number): void {
        switch (name) {
            case 'width': {
                this.w = value;
                break;
            }
            case 'height': {
                this.h = value;
                break;
            }
            case 'depth': {
                this.d = value;
                break;
            }
            default: {
                throw new Error(`setPrinciplaScale(${name}): name is not a principal scale property.`);
            }
        }
        this.setScale(this.w, this.h, this.d);
    }
}

interface TurtleOptions {
    color?: { r: number; g: number; b: number };
    tilt?: SpinorE3;
}

export default class Turtle extends RigidBody {
    constructor(engine: Engine, options: TurtleOptions = {}, levelUp = 0) {
        super(mustBeEngine(engine, 'Turtle'), levelUp + 1);
        this.setLoggingName('Turtle');
        const geoOptions: TurtleGeometryOptions = {};
        geoOptions.tilt = tiltFromOptions(options, canonicalAxis);
        geoOptions.offset = zero;
        const geometry = new TurtleGeometry(engine, geoOptions);
        this.geometry = geometry;
        geometry.release();
        const material = new LineMaterial(engine);
        this.material = material;
        material.release();
        this.height = 0.1;
        this.width = 0.0618;

        setColorOption(this, options, Color.green);

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

    get width() {
        return this.getPrincipalScale('width');
    }
    set width(width: number) {
        this.setPrincipalScale('width', width);
    }

    /**
     *
     */
    get height() {
        return this.getPrincipalScale('height');
    }
    set height(height: number) {
        this.setPrincipalScale('height', height);
    }
}
