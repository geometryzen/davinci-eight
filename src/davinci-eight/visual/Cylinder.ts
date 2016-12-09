import direction from './direction';
import Color from '../core/Color';
import CylinderGeometry from '../geometries/CylinderGeometry';
import CylinderGeometryOptions from '../geometries/CylinderGeometryOptions';
import CylinderOptions from './CylinderOptions';
import Engine from '../core/Engine';
import Geometric3 from '../math/Geometric3';
// import geometryModeFromOptions from './geometryModeFromOptions';
import isDefined from '../checks/isDefined';
import materialFromOptions from './materialFromOptions';
import mustBeEngine from './mustBeEngine';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import offsetFromOptions from './offsetFromOptions';
import RigidBody from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SimplexMode from '../geometries/SimplexMode';
import simplexModeFromOptions from './simplexModeFromOptions';
import tiltFromOptions from './tiltFromOptions';
import { R3 } from '../math/R3';
import vec from '../math/R3';

const canonicalAxis = vec(0, 1, 0);

/**
 *
 */
export class Cylinder extends RigidBody {
    /**
     * Cache the initial axis value so that we can compute the axis at any
     * time by rotating the initial axis using the Mesh attitude.
     */
    private initialAxis: R3;

    constructor(engine: Engine, options: CylinderOptions = {}, levelUp = 0) {
        super(mustBeEngine(engine, 'Cylinder'), levelUp + 1);
        this.setLoggingName('Cylinder');
        this.initialAxis = direction(options, canonicalAxis);
        // const geoMode = geometryModeFromOptions(options);
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        // const stress = Vector3.vector(1, 1, 1)

        const geoOptions: CylinderGeometryOptions = { kind: 'CylinderGeometry' };
        // geoOptions.mode = geoMode;
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = tiltFromOptions(options, canonicalAxis);
        geoOptions.openCap = options.openCap;
        geoOptions.openBase = options.openBase;
        geoOptions.openWall = options.openWall;

        const cachedGeometry = engine.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof CylinderGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new CylinderGeometry(engine, geoOptions);
            this.geometry = geometry;
            geometry.release();
            engine.putCacheGeometry(geoOptions, geometry);
        }

        const material = materialFromOptions(engine, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        this.material = material;
        material.release();

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5;
        this.length = isDefined(options.length) ? mustBeNumber('length', options.length) : 1.0;
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

    /**
     * The length of the cylinder, a scalar. Defaults to 1.
     */
    get length(): number {
        return this.getPrincipalScale('length');
    }
    set length(length: number) {
        if (typeof length === 'number') {
            this.setPrincipalScale('length', length);
        }
        else {
            throw new Error("length must be a number");
        }
    }

    /**
     * The radius of the cylinder, a scalar. Defaults to 1.
     */
    get radius(): number {
        return this.getPrincipalScale('radius');
    }
    set radius(radius: number) {
        if (typeof radius === 'number') {
            this.setPrincipalScale('radius', radius);
        }
        else {
            throw new Error("radius must be a number");
        }
    }

    /**
     * Axis (vector)
     */
    get axis(): Geometric3 {
        return Geometric3.fromVector(this.initialAxis).rotate(this.R);
    }
    set axis(axis: Geometric3) {
        mustBeObject('axis', axis);
        this.R.rotorFromDirections(this.initialAxis, axis);
    }
}
