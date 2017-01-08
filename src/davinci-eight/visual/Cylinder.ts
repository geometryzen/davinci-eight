import Color from '../core/Color';
import ContextManager from '../core/ContextManager';
import CylinderGeometry from '../geometries/CylinderGeometry';
import CylinderGeometryOptions from '../geometries/CylinderGeometryOptions';
import CylinderOptions from './CylinderOptions';
import { ds } from './Defaults';
import Geometry from '../core/Geometry';
import geometryModeFromOptions from './geometryModeFromOptions';
import isDefined from '../checks/isDefined';
import Material from '../core/Material';
import materialFromOptions from './materialFromOptions';
import Mesh from '../core/Mesh';
import mustBeNumber from '../checks/mustBeNumber';
import offsetFromOptions from './offsetFromOptions';
import referenceAxis from '../core/referenceAxis';
import referenceMeridian from '../core/referenceMeridian';
import setAxisAndMeridian from './setAxisAndMeridian';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SimplexMode from '../geometries/SimplexMode';
import simplexModeFromOptions from './simplexModeFromOptions';
import spinorE3Object from './spinorE3Object';
import vectorE3Object from './vectorE3Object';

/**
 * A 3D visual representation of a cylinder.
 */
export class Cylinder extends Mesh<Geometry, Material> {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: CylinderOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1);
        this.setLoggingName('Cylinder');

        const geoOptions: CylinderGeometryOptions = { kind: 'CylinderGeometry' };
        geoOptions.mode = geometryModeFromOptions(options);

        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());

        geoOptions.openCap = options.openCap;
        geoOptions.openBase = options.openBase;
        geoOptions.openWall = options.openWall;

        geoOptions.heightSegments = options.heightSegments;
        geoOptions.thetaSegments = options.thetaSegments;

        const cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof CylinderGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new CylinderGeometry(contextManager, geoOptions);
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

        this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : ds.radius;

        if (isDefined(options.length)) {
            this.length = mustBeNumber('length', options.length);
        }

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

    /**
     * The length of the cylinder, a scalar. Defaults to 1.
     */
    get length(): number {
        return this.getScaleY();
    }
    set length(length: number) {
        const x = this.getScaleX();
        const z = this.getScaleZ();
        this.setScale(x, length, z);
    }

    /**
     * The radius of the cylinder, a scalar. Defaults to 1.
     */
    get radius(): number {
        return this.getScaleX();
    }
    set radius(radius: number) {
        const y = this.getScaleY();
        this.setScale(radius, y, radius);
    }
}
