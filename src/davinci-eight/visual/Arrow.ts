import ArrowOptions from './ArrowOptions';
import ArrowGeometry from '../geometries/ArrowGeometry';
import ArrowGeometryOptions from '../geometries/ArrowGeometryOptions';
import Color from '../core/Color';
import { ds } from './Defaults';
import Engine from '../core/Engine';
import Geometric3 from '../math/Geometric3';
import referenceAxis from './referenceAxis';
import referenceMeridian from './referenceMeridian';
import Material from '../core/Material';
import materialFromOptions from './materialFromOptions';
import offsetFromOptions from './offsetFromOptions';
import Mesh from '../core/Mesh';
import mustBeEngine from './mustBeEngine';
import quadVectorE3 from '../math/quadVectorE3';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SimplexMode from '../geometries/SimplexMode';
import simplexModeFromOptions from './simplexModeFromOptions';
import spinorE3Object from './spinorE3Object';
import vec from '../math/R3';
import vectorE3Object from './vectorE3Object';
import VectorE3 from '../math/VectorE3';

/**
 * A Mesh in the form of an arrow that may be used to represent a vector quantity.
 */
export class Arrow extends Mesh<ArrowGeometry, Material> {
    /**
     * 
     */
    constructor(engine: Engine, options: ArrowOptions = {}, levelUp = 0) {
        super(void 0, void 0, mustBeEngine(engine, 'Arrow'), { axis: referenceAxis(options, ds.axis), meridian: referenceMeridian(options, ds.meridian) }, levelUp + 1);
        this.setLoggingName('Arrow');

        const geoOptions: ArrowGeometryOptions = { kind: 'ArrowGeometry' };

        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis));
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian));

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
     * The axis of the Arrow.
     * This property determines both the direction and length of the Arrow.
     */
    get axis(): VectorE3 {
        const axis = Geometric3.fromVector(this.referenceAxis);
        axis.rotate(this.attitude).scale(this.length);
        return vec(axis.x, axis.y, axis.z);
    }
    set axis(axis: VectorE3) {
        const L = Math.sqrt(quadVectorE3(axis));
        const x = axis.x / L;
        const y = axis.y / L;
        const z = axis.z / L;
        this.attitude.rotorFromDirections(this.referenceAxis, { x, y, z });
        this.length = L;
    }

    get h(): VectorE3 {
        console.warn("The Arrow h property is deprecated. Please use the axis property instead.");
        return this.axis;
    }
    set h(h: VectorE3) {
        console.warn("The Arrow h property is deprecated. Please use the axis property instead.");
        this.axis = h;
    }

    /**
     * The length of the Arrow.
     * This property determines the scaling of the Arrow in all directions.
     */
    get length() {
        return this.getScaleX();
    }
    set length(length: number) {
        this.setScale(length, length, length);
    }
}
