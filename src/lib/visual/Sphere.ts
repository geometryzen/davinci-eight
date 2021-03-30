import { isDefined } from '../checks/isDefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { SimplexMode } from '../geometries/SimplexMode';
import { SphereGeometry } from '../geometries/SphereGeometry';
import { SphereGeometryOptions } from '../geometries/SphereGeometryOptions';
import { ds } from './Defaults';
import { geometryModeFromOptions } from './geometryModeFromOptions';
import { materialFromOptions } from './materialFromOptions';
import { offsetFromOptions } from './offsetFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { SphereOptions } from './SphereOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';

/**
 * @hidden
 */
const RADIUS_NAME = 'radius';

/**
 *
 */
export class Sphere extends Mesh<Geometry, Material> {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: SphereOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1);
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

        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.stress = void 0;
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.offset = offsetFromOptions(options);

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

        setAxisAndMeridian(this, options);
        setColorOption(this, options, options.textured ? Color.white : Color.gray);
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
        return this.getScaleX();
    }
    set radius(radius: number) {
        this.setScale(radius, radius, radius);
    }
}
