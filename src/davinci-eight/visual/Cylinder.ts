import Color from '../core/Color';
import ContextManager from '../core/ContextManager';
import CylinderGeometry from '../geometries/CylinderGeometry';
import CylinderGeometryOptions from '../geometries/CylinderGeometryOptions';
import CylinderOptions from './CylinderOptions';
import { ds } from './Defaults';
import referenceAxis from './referenceAxis';
import referenceMeridian from './referenceMeridian';
import isDefined from '../checks/isDefined';
import materialFromOptions from './materialFromOptions';
import mustBeNumber from '../checks/mustBeNumber';
import offsetFromOptions from './offsetFromOptions';
import RigidBody from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SimplexMode from '../geometries/SimplexMode';
import simplexModeFromOptions from './simplexModeFromOptions';
import spinorE3Object from './spinorE3Object';
import vectorE3Object from './vectorE3Object';

/**
 *
 */
export class Cylinder extends RigidBody {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: CylinderOptions = {}, levelUp = 0) {
        super(contextManager, referenceAxis(options, ds.axis), referenceMeridian(options, ds.meridian), levelUp + 1);
        this.setLoggingName('Cylinder');
        // const geoMode = geometryModeFromOptions(options);
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        // const stress = Vector3.vector(1, 1, 1)

        const geoOptions: CylinderGeometryOptions = { kind: 'CylinderGeometry' };
        geoOptions.offset = offsetFromOptions(options);

        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(this.referenceAxis);
        geoOptions.meridian = vectorE3Object(this.referenceMeridian);

        geoOptions.openCap = options.openCap;
        geoOptions.openBase = options.openBase;
        geoOptions.openWall = options.openWall;

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

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : ds.radius;
        this.length = isDefined(options.length) ? mustBeNumber('length', options.length) : ds.length;

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
     * The radius of the cylinder, a scalar. Defaults to 1.
     */
    get radius(): number {
        return this.getPrincipalScale('radius');
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius);
    }
}
