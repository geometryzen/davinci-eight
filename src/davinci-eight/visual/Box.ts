import BoxOptions from './BoxOptions';
import BoxGeometry from '../geometries/BoxGeometry';
import BoxGeometryOptions from '../geometries/BoxGeometryOptions';
import { Color } from '../core/Color';
import { Engine } from '../core/Engine';
import GeometryMode from '../geometries/GeometryMode';
import isDefined from '../checks/isDefined';
import geometryModeFromOptions from './geometryModeFromOptions';
import materialFromOptions from './materialFromOptions';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeEngine from './mustBeEngine';
import { RigidBody } from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SimplexMode from '../geometries/SimplexMode';
import simplexModeFromOptions from './simplexModeFromOptions';

export class Box extends RigidBody {

    constructor(engine: Engine, options: BoxOptions = {}) {
        super(mustBeEngine(engine, 'Box'), 1);

        this.setLoggingName('Box');
        const geoMode: GeometryMode = geometryModeFromOptions(options);

        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        // const stress = Vector3.vector(1, 1, 1)

        const geoOptions: BoxGeometryOptions = { kind: 'BoxGeometry' };
        geoOptions.mode = geoMode;
        geoOptions.tilt = options.tilt;
        geoOptions.openBack = options.openBack;
        geoOptions.openBase = options.openBase;
        geoOptions.openFront = options.openFront;
        geoOptions.openLeft = options.openLeft;
        geoOptions.openRight = options.openRight;
        geoOptions.openCap = options.openCap;

        const cachedGeometry = engine.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof BoxGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new BoxGeometry(engine, geoOptions);
            this.geometry = geometry;
            geometry.release();
            engine.putCacheGeometry(geoOptions, geometry);
        }

        const material = materialFromOptions(engine, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        this.material = material;
        material.release();

        if (options.color) {
            this.color.copy(options.color);
        }

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        this.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1.0;
        this.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1.0;
        this.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1.0;

        this.synchUp();
    }

    /**
     * 
     */
    protected destructor(levelUp: number): void {
        this.cleanUp();
        super.destructor(levelUp + 1);
    }

    /**
     * @default 1
     */
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

    /**
     *
     */
    get depth() {
        return this.getPrincipalScale('depth');
    }
    set depth(depth: number) {
        this.setPrincipalScale('depth', depth);
    }
}
