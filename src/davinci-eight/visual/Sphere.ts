import { Color } from '../core/Color';
import direction from './direction';
import { Engine } from '../core/Engine';
import isDefined from '../checks/isDefined';
import kFromOptions from './kFromOptions';
import materialFromOptions from './materialFromOptions';
import mustBeEngine from './mustBeEngine';
import mustBeNumber from '../checks/mustBeNumber';
import { RigidBody } from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SphereOptions from './SphereOptions';
import SphereGeometry from '../geometries/SphereGeometry';
import SphereGeometryOptions from '../geometries/SphereGeometryOptions';

const RADIUS_NAME = 'radius';
const RADIUS_DEFAULT = 1;

/**
 *
 */
export class Sphere extends RigidBody {

    constructor(engine: Engine, options: SphereOptions = {}, levelUp = 0) {
        super(mustBeEngine(engine, 'Sphere'), direction(options), levelUp + 1);
        this.setLoggingName('Sphere');
        const k = kFromOptions(options);

        const geoOptions: SphereGeometryOptions = {};

        geoOptions.k = k;
        geoOptions.azimuthSegments = options.azimuthSegments;
        geoOptions.azimuthStart = options.azimuthStart;
        geoOptions.azimuthLength = options.azimuthLength;
        geoOptions.elevationLength = options.elevationLength;
        geoOptions.elevationSegments = options.elevationSegments;
        geoOptions.elevationStart = options.elevationStart;
        geoOptions.offset = options.offset;
        geoOptions.stress = void 0;
        geoOptions.tilt = options.tilt;

        const geometry = new SphereGeometry(engine, geoOptions);
        this.geometry = geometry;
        geometry.release();

        const material = materialFromOptions(engine, k, options);
        this.material = material;
        material.release();

        setColorOption(this, options, k === 2 ? Color.cobalt : Color.gray);
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
}
