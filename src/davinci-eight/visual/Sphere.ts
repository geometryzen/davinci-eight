import Color from '../core/Color';
import ContextManager from '../core/ContextManager';
import { ds } from './Defaults';
import initialAxis from './initialAxis';
import initialMeridian from './initialMeridian';
import isDefined from '../checks/isDefined';
import geometryModeFromOptions from './geometryModeFromOptions';
import materialFromOptions from './materialFromOptions';
import mustBeNumber from '../checks/mustBeNumber';
import offsetFromOptions from './offsetFromOptions';
import RigidBody from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SimplexMode from '../geometries/SimplexMode';
import simplexModeFromOptions from './simplexModeFromOptions';
import SphereOptions from './SphereOptions';
import SphereGeometry from '../geometries/SphereGeometry';
import SphereGeometryOptions from '../geometries/SphereGeometryOptions';
import vectorE3Object from './vectorE3Object';

const RADIUS_NAME = 'radius';

/**
 *
 */
export class Sphere extends RigidBody {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: SphereOptions = {}, levelUp = 0) {
        super(contextManager, initialAxis(options, ds.axis), initialMeridian(options, ds.meridian), levelUp + 1);
        this.setLoggingName('Sphere');

        const geoMode = geometryModeFromOptions(options);

        const geoOptions: SphereGeometryOptions = { kind: 'SphereGeometry' };

        geoOptions.mode = geoMode;
        geoOptions.azimuthSegments = options.azimuthSegments;
        geoOptions.azimuthStart = options.azimuthStart;
        geoOptions.azimuthLength = options.azimuthLength;
        geoOptions.elevationLength = options.elevationLength;
        geoOptions.elevationSegments = options.elevationSegments;
        geoOptions.elevationStart = options.elevationStart;
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.stress = void 0;
        geoOptions.axis = vectorE3Object(this.initialAxis);
        geoOptions.meridian = vectorE3Object(this.initialMeridian);

        const cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof SphereGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new SphereGeometry(contextManager, geoOptions);
            this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }

        const material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        this.material = material;
        material.release();

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        this.radius = isDefined(options.radius) ? mustBeNumber(RADIUS_NAME, options.radius) : ds.radius;

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
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
    }
}
