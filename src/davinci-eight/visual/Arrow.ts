import ArrowOptions from './ArrowOptions';
import ArrowGeometry from '../geometries/ArrowGeometry';
import ArrowGeometryOptions from '../geometries/ArrowGeometryOptions';
import { Color } from '../core/Color';
import { Engine } from '../core/Engine';
import { Geometric3 } from '../math/Geometric3';
import { MeshMaterial } from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import PrincipalScaleMesh from './PrincipalScaleMesh';
import isDefined from '../checks/isDefined';
import isGE from '../checks/isGE';
import mustBeDefined from '../checks/mustBeDefined';
import mustBeEngine from './mustBeEngine';
import quadVectorE3 from '../math/quadVectorE3';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import VectorE3 from '../math/VectorE3';
import Vector3 from '../math/Vector3';

function direction(options: ArrowOptions, fallback: VectorE3): VectorE3 {
    if (isDefined(options.vector)) {
        return Vector3.copy(options.vector).normalize();
    }
    else {
        return fallback;
    }
}

/**
 * <p>
 * A <code>Mesh</code> in the form of an arrow that may be used to represent a vector quantity.
 * </p>
 *
 *
 *     // Construct the arrow at any time and add it to the scene.
 *     const arrow = new EIGHT.Arrow({color: white})
 *     scene.add(arrow)
 *
 *     // Update the arrow configuration, usually inside the animation function.
 *     arrow.position = position // position is a Geometric3
 *     arrow.attitude = attitude // attitude is a Geometric3
 *     arrow.h = vector // vector is a Geometric3
 *
 *     // Release the arrow when no longer required.
 *     arrow.release()
 */
export class Arrow extends PrincipalScaleMesh<ArrowGeometry, MeshMaterial> {

    /**
     * We know what the initial direction the arrow geometry takes.
     * Since our state variable is the attitude, we must remember the
     * initial direction in order to be able to update the attitude
     * based upon a vector property.
     */
    private direction0: VectorE3;

    /**
     * The vector that this arrow represents.
     * We'll hook up a listener to this property so that mutation of the vector
     * becomes mutation of the attitude and length.
     */
    private _vector: Geometric3;

    private vectorChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;
    private attitudeChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;

    constructor(engine: Engine, options: ArrowOptions = {}, levelUp = 0) {
        super(mustBeEngine(engine, 'Arrow'), levelUp + 1);
        this.setLoggingName('Arrow');

        // TODO: This should be going into the geometry options.
        // FIXME: This should be random, or provided through options.
        this.direction0 = direction(options, Vector3.vector(0, 1, 0));
        this._vector = Geometric3.fromVector(this.direction0);

        const geoOptions: ArrowGeometryOptions = {};
        geoOptions.offset = options.offset;
        // geoOptions.stress; // Nothing corresponding to stress
        geoOptions.tilt = options.tilt;
        const geometry = new ArrowGeometry(engine, geoOptions);

        const matOptions: MeshMaterialOptions = void 0;
        const material = new MeshMaterial(engine, matOptions);

        this.geometry = geometry;
        this.material = material;

        geometry.release();
        material.release();

        if (options.color) {
            this.color.copy(options.color);
        }

        setColorOption(this, options, Color.gray);
        setDeprecatedOptions(this, options);

        /**
         * cascade flag prevents infinite recursion.
         */
        let cascade = true;
        this.vectorChangeHandler = (eventName: string, key: string, value: number, vector: Geometric3) => {
            if (cascade) {
                cascade = false;
                this.R.rotorFromDirections(this.direction0, vector);
                this.setPrincipalScale('length', Math.sqrt(quadVectorE3(vector)));
                // this.length = Math.sqrt(quadVectorE3(vector))
                cascade = true;
            }
        };
        this.attitudeChangeHandler = (eventName: string, key: string, value: number, attitude: Geometric3) => {
            if (cascade) {
                cascade = false;
                this._vector.copyVector(this.direction0).rotate(this.R).scale(this.length);
                cascade = true;
            }
        };

        this._vector.on('change', this.vectorChangeHandler);
        this.R.on('change', this.attitudeChangeHandler);

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this._vector.off('change', this.vectorChangeHandler);
        this.R.off('change', this.attitudeChangeHandler);
        super.destructor(levelUp + 1);
    }

    // The length property is not currently exposed in the d.ts.
    private get length(): number {
        return this.getPrincipalScale('length');
    }
    private set length(length: number) {
        if (isGE(length, 0)) {
            this.setPrincipalScale('length', length);
            const magnitude = Math.sqrt(quadVectorE3(this._vector));
            this._vector.scale(length / magnitude);
        }
        else {
            // Ignore
        }
    }

    /**
     * The vector from the tail of the Arrow to the head of the Arrow.
     */
    get h() {
        return this._vector;
    }
    set h(h: Geometric3) {
        mustBeDefined('h', h);
        this._vector.copyVector(h);
    }
}
