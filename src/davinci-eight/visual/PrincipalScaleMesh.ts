import ContextManager from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Mesh } from '../core/Mesh';
import { Material } from '../core/Material';
import Matrix4 from '../math/Matrix4';
import mustBeObject from '../checks/mustBeObject';

/**
 * A Geometry that can be scaled by referring to its principal properties.
 */
export interface PrincipalScaleGeometry extends Geometry {

    /**
     * The matrix that is updated following calls to the setPrincipalScale method.
     */
    scaling: Matrix4;

    hasPrincipalScale(name: string): boolean;
    getPrincipalScale(name: string): number;
    setPrincipalScale(name: string, value: number): void;
}

export default class PrincipalScaleMesh<G extends PrincipalScaleGeometry, M extends Material> extends Mesh<G, M> {
    constructor(contextManager: ContextManager, levelUp = 0) {
        // Mesh was not really designed to be extended.
        // When we start to define composites with a specific geometry and material through implementation inheritance,
        // we run into the problem that it is cumbersome to release the geometry and material.
        // This is why we transition from setting geometry and material through the constructor to setting
        // properties instead. It may be better to contain, rather than extend, the Mesh?
        super(void 0, void 0, mustBeObject('contextManager', contextManager), levelUp + 1);
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
