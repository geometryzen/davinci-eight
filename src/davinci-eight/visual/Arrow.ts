import ArrowOptions from './ArrowOptions';
import ArrowGeometry from '../geometries/ArrowGeometry';
import ArrowGeometryOptions from '../geometries/ArrowGeometryOptions';
import Color from '../core/Color';
import direction from './direction';
import Engine from '../core/Engine';
import Geometric3 from '../math/Geometric3';
import Material from '../core/Material';
import materialFromOptions from './materialFromOptions';
import offsetFromOptions from './offsetFromOptions';
import PrincipalScaleMesh from './PrincipalScaleMesh';
import isGE from '../checks/isGE';
import mustBeEngine from './mustBeEngine';
import quadVectorE3 from '../math/quadVectorE3';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SimplexMode from '../geometries/SimplexMode';
import simplexModeFromOptions from './simplexModeFromOptions';
import tiltFromOptions from './tiltFromOptions';
import vec from '../math/R3';
import VectorE3 from '../math/VectorE3';

const canonicalAxis = vec(0, 1, 0);

/**
 * A Mesh in the form of an arrow that may be used to represent a vector quantity.
 */
export class Arrow extends PrincipalScaleMesh<ArrowGeometry, Material> {
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
    /**
     * 
     */
    private vectorChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;
    /**
     * 
     */
    private attitudeChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;

    constructor(engine: Engine, options: ArrowOptions = {}, levelUp = 0) {
        super(mustBeEngine(engine, 'Arrow'), levelUp + 1);
        this.setLoggingName('Arrow');

        this.direction0 = direction(options, canonicalAxis);
        this._vector = Geometric3.fromVector(this.direction0);

        const geoOptions: ArrowGeometryOptions = { kind: 'ArrowGeometry' };
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = tiltFromOptions(options, canonicalAxis);
        geoOptions.radiusCone = 0.08;

        const cachedGeometry = engine.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof ArrowGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new ArrowGeometry(engine, geoOptions);
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
     * A short alias for the axis property.
     */
    get h() {
        return this._vector;
    }
    set h(vector: Geometric3) {
        this._vector.copyVector(vector);
    }

    /**
     * A long alias for the h property.
     */
    get axis() {
        return this._vector;
    }
    set axis(vector: Geometric3) {
        this._vector.copyVector(vector);
    }
}
