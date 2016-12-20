import BoxOptions from './BoxOptions';
import BoxGeometry from '../geometries/BoxGeometry';
import BoxGeometryOptions from '../geometries/BoxGeometryOptions';
import Color from '../core/Color';
import ContextManager from '../core/ContextManager';
import { ds } from './Defaults';
import GeometryMode from '../geometries/GeometryMode';
import isDefined from '../checks/isDefined';
import geometryModeFromOptions from './geometryModeFromOptions';
import materialFromOptions from './materialFromOptions';
import mustBeNumber from '../checks/mustBeNumber';
import quadVectorE3 from '../math/quadVectorE3';
import referenceAxis from './referenceAxis';
import referenceMeridian from './referenceMeridian';
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
export class Box extends RigidBody {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: BoxOptions = {}, levelUp = 0) {
        super(contextManager, referenceAxis(options, ds.axis).direction(), referenceMeridian(options, ds.meridian).direction(), levelUp + 1);

        this.setLoggingName('Box');
        const geoMode: GeometryMode = geometryModeFromOptions(options);

        const geoOptions: BoxGeometryOptions = { kind: 'BoxGeometry' };
        geoOptions.mode = geoMode;

        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());

        geoOptions.openBack = options.openBack;
        geoOptions.openBase = options.openBase;
        geoOptions.openFront = options.openFront;
        geoOptions.openLeft = options.openLeft;
        geoOptions.openRight = options.openRight;
        geoOptions.openCap = options.openCap;

        const cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof BoxGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new BoxGeometry(contextManager, geoOptions);
            this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }

        const material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        this.material = material;
        material.release();

        if (options.color) {
            this.color.copy(options.color);
        }

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        this.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1.0;

        if (isDefined(options.height)) {
            this.height = mustBeNumber('height', options.height);
        }
        else if (isDefined(options.axis)) {
            this.height = Math.sqrt(quadVectorE3(options.axis));
        }

        if (isDefined(options.depth)) {
            this.depth = mustBeNumber('depth', options.depth);
        }
        else if (isDefined(options.meridian)) {
            this.depth = Math.sqrt(quadVectorE3(options.meridian));
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
     * @default 1
     */
    get width() {
        return this.getScaleX();
    }
    set width(width: number) {
        const y = this.getScaleY();
        const z = this.getScaleZ();
        this.setScale(width, y, z);
    }

    /**
     *
     */
    get height() {
        return this.getScaleY();
    }
    set height(height: number) {
        const x = this.getScaleX();
        const z = this.getScaleZ();
        this.setScale(x, height, z);
    }

    /**
     *
     */
    get depth() {
        return this.getScaleZ();
    }
    set depth(depth: number) {
        const x = this.getScaleX();
        const y = this.getScaleY();
        this.setScale(x, y, depth);
    }
}
