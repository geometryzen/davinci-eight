import { isDefined } from '../checks/isDefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { BoxGeometry } from '../geometries/BoxGeometry';
import { BoxGeometryOptions } from '../geometries/BoxGeometryOptions';
import { SimplexMode } from '../geometries/SimplexMode';
import { BoxOptions } from './BoxOptions';
import { ds } from './Defaults';
import { geometryModeFromOptions } from './geometryModeFromOptions';
import { materialFromOptions } from './materialFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';

/**
 * A 3D visual representation of a box.
 */
export class Box extends Mesh<Geometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options 
     * @param levelUp Leave as zero unless you are extending this class. 
     */
    constructor(contextManager: ContextManager, options: BoxOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1);

        this.setLoggingName('Box');

        const geoOptions: BoxGeometryOptions = { kind: 'BoxGeometry' };
        geoOptions.mode = geometryModeFromOptions(options);

        geoOptions.offset = vectorE3Object(options.offset);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());

        geoOptions.openBack = options.openBack;
        geoOptions.openBase = options.openBase;
        geoOptions.openFront = options.openFront;
        geoOptions.openLeft = options.openLeft;
        geoOptions.openRight = options.openRight;
        geoOptions.openCap = options.openCap;

        const geometry = new BoxGeometry(contextManager, geoOptions);
        this.geometry = geometry;
        geometry.release();

        const material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        this.material = material;
        material.release();

        setAxisAndMeridian(this, options);
        setColorOption(this, options, options.textured ? Color.white : Color.gray);
        setDeprecatedOptions(this, options);

        if (isDefined(options.width)) {
            this.width = mustBeNumber('width', options.width);
        }
        if (isDefined(options.height)) {
            this.height = mustBeNumber('height', options.height);
        }
        if (isDefined(options.depth)) {
            this.depth = mustBeNumber('depth', options.depth);
        }

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * @hidden
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
