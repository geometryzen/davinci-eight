import { Color } from '../core/Color';
import { ds } from './Defaults';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { materialFromOptions } from './materialFromOptions';
import { Mesh } from '../core/Mesh';
import { offsetFromOptions } from './offsetFromOptions';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { SimplexMode } from '../geometries/SimplexMode';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { TetrahedronOptions } from './TetrahedronOptions';
import { TetrahedronGeometryOptions } from '../geometries//TetrahedronGeometryOptions';
import { TetrahedronGeometry } from '../geometries/TetrahedronGeometry';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';

/**
 * A 3D visual representation of a tetrahedron.
 */
export class Tetrahedron extends Mesh<Geometry, Material> {

    constructor(contextManager: ContextManager, options: TetrahedronOptions = {}, levelUp = 0) {
        super(void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1);
        this.setLoggingName('Tetrahedron');

        const geoOptions: TetrahedronGeometryOptions = { kind: 'TetrahedronGeometry' };

        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());

        const cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof TetrahedronGeometry) {
            this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            const geometry = new TetrahedronGeometry(contextManager, geoOptions);
            this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }

        const material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        this.material = material;
        material.release();

        setAxisAndMeridian(this, options);
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
     * 
     */
    get radius(): number {
        return this.getScaleX();
    }
    set radius(radius: number) {
        this.setScale(radius, radius, radius);
    }
}
