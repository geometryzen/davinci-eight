import Attribute from '../core/Attribute';
import BeginMode from '../core/BeginMode';
import { Color } from '../core/Color';
import ContextManager from '../core/ContextManager';
import DataType from '../core/DataType';
import { Engine } from '../core/Engine';
import GeometryArrays from '../core/GeometryArrays';
import { LineMaterial } from '../materials/LineMaterial';
import mustBeEngine from './mustBeEngine';
import Primitive from '../core/Primitive';
import { RigidBody } from './RigidBody';
import setColorOption from './setColorOption';
import VisualOptions from './VisualOptions';

const NOSE = [0, +1, 0];
const LLEG = [-1, -1, 0];
const RLEG = [+1, -1, 0];
const TAIL = [0, -1, 0];
const CENTER = [0, 0, 0];
const LEFT = [-0.5, 0, 0];

function concat<T>(a: T[], b: T[]) { return a.concat(b); }
/**
 * Creates the Turtle Primitive.
 * All points lie in the the plane z = 0.
 * The height and width of the triangle are centered on the origin (0, 0).
 * The height and width range from -1 to +1.
 */

function primitive(): Primitive {
    const aPosition: Attribute = {
        values: [
            [CENTER, LEFT, CENTER, TAIL].reduce(concat),
            [NOSE, LLEG].reduce(concat),
            [NOSE, RLEG].reduce(concat),
            [LLEG, RLEG].reduce(concat)
        ].reduce(concat),
        size: CENTER.length,
        type: DataType.FLOAT
    };
    const result: Primitive = {
        mode: BeginMode.LINES,
        attributes: {
        }
    };
    result.attributes['aPosition'] = aPosition;
    return result;
}
/**
 * The geometry of the Bug is static so we use the conventional
 * approach based upon GeometryArrays
 */
class TurtleGeometry extends GeometryArrays {
    private w = 1;
    private h = 1;
    private d = 1;
    constructor(private contextManager: ContextManager) {
        super(primitive(), contextManager);
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

interface TurtleOptions extends VisualOptions {

}

export default class Turtle extends RigidBody {
    constructor(engine: Engine, options: TurtleOptions, levelUp = 0) {
        super(new TurtleGeometry(engine), new LineMaterial(engine), mustBeEngine(engine, 'Turtle'), { x: 0, y: 0, z: 1 }, levelUp + 1);
        this.setLoggingName('Turtle');
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
