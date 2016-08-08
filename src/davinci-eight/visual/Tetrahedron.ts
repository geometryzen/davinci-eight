import direction from './direction';
import {MeshMaterial} from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import {RigidBody} from './RigidBody';
import TetrahedronOptions from './TetrahedronOptions';
import TetrahedronGeometryOptions from '../geometries//TetrahedronGeometryOptions';
import TetrahedronGeometry from '../geometries/TetrahedronGeometry';

/**
 *
 */
export default class Tetrahedron extends RigidBody {

    /**
     * @param options
     * @param levelUp
     */
    constructor(options: TetrahedronOptions = {}, levelUp = 0) {
        super(void 0, void 0, options.contextManager, direction(options), levelUp + 1);
        this.setLoggingName('Tetrahedron');
        const geoOptions: TetrahedronGeometryOptions = {};
        geoOptions.contextManager = options.contextManager;
        const geometry = new TetrahedronGeometry(geoOptions);
        const matOptions: MeshMaterialOptions = null;
        const material = new MeshMaterial(matOptions, options.contextManager);
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
        super.destructor(levelUp + 1);
    }

    get radius(): number {
        return this.getPrincipalScale('radius');
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius);
    }
}
