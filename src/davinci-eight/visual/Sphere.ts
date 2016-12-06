import { Color } from '../core/Color';
import direction from './direction';
import { Engine } from '../core/Engine';
import { Geometric3 } from '../math/Geometric3';
import isDefined from '../checks/isDefined';
import geometryModeFromOptions from './geometryModeFromOptions';
import materialFromOptions from './materialFromOptions';
import mustBeEngine from './mustBeEngine';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import { RigidBody } from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import simplexModeFromOptions from './simplexModeFromOptions';
import SphereOptions from './SphereOptions';
import SphereGeometry from '../geometries/SphereGeometry';
import SphereGeometryOptions from '../geometries/SphereGeometryOptions';
import tiltFromOptions from './tiltFromOptions';
import { R3 } from '../math/R3';
import vec from '../math/R3';

const RADIUS_NAME = 'radius';
const RADIUS_DEFAULT = 1;
const canonicalAxis = vec(0, 1, 0);
const zero = vec(0, 0, 0);

/**
 *
 */
export class Sphere extends RigidBody {

    /**
     * Cache the initial axis value so that we can compute the axis at any
     * time by rotating the initial axis using the Mesh attitude.
     */
    private initialAxis: R3;

    constructor(engine: Engine, options: SphereOptions = {}, levelUp = 0) {
        super(mustBeEngine(engine, 'Sphere'), levelUp + 1);
        this.setLoggingName('Sphere');
        this.initialAxis = direction(options, canonicalAxis);
        const geoMode = geometryModeFromOptions(options);

        const geoOptions: SphereGeometryOptions = {};

        geoOptions.mode = geoMode;
        geoOptions.azimuthSegments = options.azimuthSegments;
        geoOptions.azimuthStart = options.azimuthStart;
        geoOptions.azimuthLength = options.azimuthLength;
        geoOptions.elevationLength = options.elevationLength;
        geoOptions.elevationSegments = options.elevationSegments;
        geoOptions.elevationStart = options.elevationStart;
        geoOptions.offset = zero;
        geoOptions.stress = void 0;
        geoOptions.tilt = tiltFromOptions(options, canonicalAxis);

        const geometry = new SphereGeometry(engine, geoOptions);
        this.geometry = geometry;
        geometry.release();

        const material = materialFromOptions(engine, simplexModeFromOptions(options), options);
        this.material = material;
        material.release();

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        if (isDefined(options.radius)) {
            this.radius = isDefined(options.radius) ? mustBeNumber(RADIUS_NAME, options.radius) : RADIUS_DEFAULT;
        }

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

    get radius() {
        return this.getPrincipalScale(RADIUS_NAME);
        // return Geometric3.scalar(r);
    }
    set radius(radius: number) {
        this.setPrincipalScale(RADIUS_NAME, mustBeNumber(RADIUS_NAME, radius));
        /*
        if (radius instanceof Geometric3) {
            this.setPrincipalScale(RADIUS_NAME, radius.a);
        }
        else if (typeof radius === 'number') {
            this.setPrincipalScale(RADIUS_NAME, mustBeNumber(RADIUS_NAME, <any>radius));
            console.warn("radius: number is deprecated. radius is a Geometric3.");
        }
        else {
            throw new Error("radius must be a Geometric3 (scalar)");
        }
        */
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
