import {Mesh} from '../core/Mesh';
import {MeshMaterial} from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import TetrahedronOptions from './TetrahedronOptions';
import TetrahedronGeometryOptions from '../geometries//TetrahedronGeometryOptions';
import TetrahedronGeometry from '../geometries/TetrahedronGeometry';

/**
 *
 */
export default class Tetrahedron extends Mesh {

    /**
     * @param options
     */
    constructor(options: TetrahedronOptions = {}, levelUp = 0) {
        super(void 0, void 0, options.engine, levelUp + 1);
        this.setLoggingName('Tetrahedron');
        const geoOptions: TetrahedronGeometryOptions = {};
        geoOptions.engine = options.engine;
        const geometry = new TetrahedronGeometry(geoOptions);
        const matOptions: MeshMaterialOptions = null;
        const material = new MeshMaterial(matOptions, options.engine);
        this.geometry = geometry;
        this.material = material;
        geometry.release();
        material.release();

        if (options.color) {
            this.color.copy(options.color);
        }

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1)
    }

    /**
     * @property radius
     * @type number
     * @default 1
     */
    get radius(): number {
        return this.getPrincipalScale('radius')
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius)
    }
}
