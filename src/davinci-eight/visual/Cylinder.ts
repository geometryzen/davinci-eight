import direction from './direction';
import {Color} from '../core/Color';
import contextManagerFromOptions from './contextManagerFromOptions';
import CylinderGeometry from '../geometries/CylinderGeometry';
import CylinderGeometryOptions from '../geometries/CylinderGeometryOptions';
import CylinderOptions from './CylinderOptions';
import {Geometric3} from '../math/Geometric3';
import isDefined from '../checks/isDefined';
import kFromOptions from './kFromOptions';
import {MeshMaterial} from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeNumber from '../checks/mustBeNumber';
import {RigidBody} from './RigidBody';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';

/**
 *
 */
export class Cylinder extends RigidBody {

    /**
     * @param options
     */
    constructor(options: CylinderOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManagerFromOptions(options), direction(options), levelUp + 1);
        this.setLoggingName('Cylinder');
        const k = kFromOptions(options);
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        // const stress = Vector3.vector(1, 1, 1)

        const geoOptions: CylinderGeometryOptions = {};
        geoOptions.contextManager = contextManagerFromOptions(options);
        geoOptions.k = k;
        geoOptions.tilt = options.tilt;
        geoOptions.offset = options.offset;
        geoOptions.openCap = options.openCap;
        geoOptions.openBase = options.openBase;
        geoOptions.openWall = options.openWall;
        const geometry = new CylinderGeometry(geoOptions);
        this.geometry = geometry;
        geometry.release();

        const matOptions: MeshMaterialOptions = null;
        const material = new MeshMaterial(matOptions, contextManagerFromOptions(options));
        this.material = material;
        material.release();

        setColorOption(this, options, Color.blueviolet);
        setDeprecatedOptions(this, options);

        this.radius = isDefined(options.radius) ? Geometric3.scalar(mustBeNumber('radius', options.radius)) : Geometric3.scalar(0.5);
        this.length = isDefined(options.length) ? Geometric3.scalar(mustBeNumber('length', options.length)) : Geometric3.scalar(1.0);
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
     * The length of the cylinder, a scalar. Defaults to 1
     */
    get length() {
        const L = this.getPrincipalScale('length');
        return Geometric3.scalar(L);
    }
    set length(length: Geometric3) {
        if (length instanceof Geometric3) {
            this.setPrincipalScale('length', length.a);
        }
        else if (typeof length === 'number') {
            this.setPrincipalScale('length', <any>length);
            console.warn("length: number is deprecated. length is a Geometric3.");
        }
        else {
            throw new Error("length must be a Geometric3 (scalar)");
        }
    }

    /**
     * The radius of the cylinder, a scalar. Defaults to 1.
     */
    get radius() {
        const R = this.getPrincipalScale('radius');
        return Geometric3.scalar(R);
    }
    set radius(radius: Geometric3) {
        if (radius instanceof Geometric3) {
            this.setPrincipalScale('radius', radius.a);
        }
        else if (typeof radius === 'number') {
            this.setPrincipalScale('radius', <any>radius);
            console.warn("radius: number is deprecated. radius is a Geometric3.");
        }
        else {
            throw new Error("radius must be a Geometric3 (scalar)");
        }
    }
}
