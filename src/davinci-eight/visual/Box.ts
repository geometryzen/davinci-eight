import BoxOptions from './BoxOptions';
import BoxGeometry from '../geometries/BoxGeometry';
import BoxGeometryOptions from '../geometries/BoxGeometryOptions';
import direction from './direction';
import isDefined from '../checks/isDefined';
import {MeshMaterial} from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeNumber from '../checks/mustBeNumber';
import {RigidBody} from './RigidBody';

/**
 *
 */
export class Box extends RigidBody {

    /**
     *
     * @param options
     */
    constructor(options: BoxOptions = {}, levelUp = 0) {
        super(void 0, void 0, options.engine, direction(options), levelUp + 1);
        this.setLoggingName('Box');
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        // const stress = Vector3.vector(1, 1, 1)

        const geoOptions: BoxGeometryOptions = {};
        geoOptions.engine = options.engine;
        geoOptions.tilt = options.tilt;
        geoOptions.offset = options.offset;
        geoOptions.openBack = options.openBack;
        geoOptions.openBase = options.openBase;
        geoOptions.openFront = options.openFront;
        geoOptions.openLeft = options.openLeft;
        geoOptions.openRight = options.openRight;
        geoOptions.openCap = options.openCap;
        const geometry = new BoxGeometry(geoOptions);
        this.geometry = geometry;
        geometry.release();

        const matOptions: MeshMaterialOptions = void 0;
        const material = new MeshMaterial(matOptions, options.engine);
        this.material = material;
        material.release();

        if (options.color) {
            this.color.copy(options.color);
        }
        if (options.position) {
            this.X.copyVector(options.position);
        }
        if (options.attitude) {
            this.R.copySpinor(options.attitude);
        }

        this.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1.0;
        this.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1.0;
        this.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1.0;

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
     * @default 1
     */
    get width() {
        return this.getPrincipalScale('width')
    }
    set width(width: number) {
        this.setPrincipalScale('width', width)
    }

    /**
     *
     */
    get height() {
        return this.getPrincipalScale('height')
    }
    set height(height: number) {
        this.setPrincipalScale('height', height)
    }

    /**
     *
     */
    get depth() {
        return this.getPrincipalScale('depth')
    }
    set depth(depth: number) {
        this.setPrincipalScale('depth', depth)
    }
}
