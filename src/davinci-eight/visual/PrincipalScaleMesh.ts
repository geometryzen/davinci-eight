import ContextManager from '../core/ContextManager';
import {Geometry} from '../core/Geometry';
import {Mesh} from '../core/Mesh';
import {Material} from '../core/Material';
import Matrix4 from '../math/Matrix4'

export interface PrincipalScaleGeometry extends Geometry {

    /**
     *
     */
    scaling: Matrix4

    /**
     *
     */
    hasPrincipalScale(name: string): boolean

    /**
     *
     */
    getPrincipalScale(name: string): number

    /**
     *
     */
    setPrincipalScale(name: string, value: number): void
}

export default class PrincipalScaleMesh<G extends PrincipalScaleGeometry, M extends Material> extends Mesh<G, M> {
    constructor(geometry: G, material: M, contextManager: ContextManager, levelUp = 0) {
        super(geometry, material, contextManager, levelUp + 1);
        this.setLoggingName('PrincipalScaleMesh');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    protected destructor(levelUp: number) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    protected getPrincipalScale(name: string): number {
        const geometry = this.geometry;
        if (geometry) {
            const value = geometry.getPrincipalScale(name);
            geometry.release();
            return value;
        }
        else {
            throw new Error(`getPrincipalScale('${name}') is not available because geometry is not defined.`);
        }
    }

    protected setPrincipalScale(name: string, value: number): void {
        const geometry = this.geometry;
        geometry.setPrincipalScale(name, value);
        const scaling = geometry.scaling;
        this.stress.copy(scaling);
        geometry.release();
    }
}
