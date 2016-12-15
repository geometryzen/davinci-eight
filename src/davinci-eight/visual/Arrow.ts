import ArrowOptions from './ArrowOptions';
import ArrowGeometry from '../geometries/ArrowGeometry';
import ArrowGeometryOptions from '../geometries/ArrowGeometryOptions';
import Color from '../core/Color';
import { ds } from './Defaults';
import Engine from '../core/Engine';
import referenceAxis from './referenceAxis';
import referenceMeridian from './referenceMeridian';
import Material from '../core/Material';
import materialFromOptions from './materialFromOptions';
import offsetFromOptions from './offsetFromOptions';
import AxialMesh from './AxialMesh';
import mustBeEngine from './mustBeEngine';
import setColorOption from './setColorOption';
import setDeprecatedOptions from './setDeprecatedOptions';
import SimplexMode from '../geometries/SimplexMode';
import simplexModeFromOptions from './simplexModeFromOptions';
import spinorE3Object from './spinorE3Object';
import vectorE3Object from './vectorE3Object';

/**
 * A Mesh in the form of an arrow that may be used to represent a vector quantity.
 */
export class Arrow extends AxialMesh<ArrowGeometry, Material> {
    /**
     * 
     */
    constructor(engine: Engine, options: ArrowOptions = {}, levelUp = 0) {
        super(mustBeEngine(engine, 'Arrow'), referenceAxis(options, ds.axis), referenceMeridian(options, ds.meridian), levelUp + 1);
        this.setLoggingName('Arrow');

        const geoOptions: ArrowGeometryOptions = { kind: 'ArrowGeometry' };
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(this.referenceAxis);
        geoOptions.meridian = vectorE3Object(this.referenceMeridian);
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

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
