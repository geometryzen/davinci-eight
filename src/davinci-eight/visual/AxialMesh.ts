import ContextManager from '../core/ContextManager';
import Geometric3 from '../math/Geometric3';
import Geometry from '../core/Geometry';
import isGE from '../checks/isGE';
import Mesh from '../core/Mesh';
import Material from '../core/Material';
import Matrix4 from '../math/Matrix4';
import quadVectorE3 from '../math/quadVectorE3';
import { R3 } from '../math/R3';

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

/**
 * Extension of Mesh that adds an axis property that coexists with the attitude property.
 */
export default class AxialMesh<G extends PrincipalScaleGeometry, M extends Material> extends Mesh<G, M> {
    /**
     * 
     */
    private currentAxis: Geometric3;
    /**
     * 
     */
    private currentMeridian: Geometric3;
    /**
     * 
     */
    private axisChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;
    /**
     * 
     */
    private attitudeChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;
    /**
     * 
     */
    constructor(contextManager: ContextManager, protected referenceAxis: R3, protected referenceMeridian: R3, levelUp = 0) {
        // Mesh was not really designed to be extended.
        // When we start to define composites with a specific geometry and material through implementation inheritance,
        // we run into the problem that it is cumbersome to release the geometry and material.
        // This is why we transition from setting geometry and material through the constructor to setting
        // properties instead. It may be better to contain, rather than extend, the Mesh?
        super(void 0, void 0, contextManager, levelUp + 1);
        this.setLoggingName('AxialMesh');

        this.currentAxis = Geometric3.fromVector(this.referenceAxis);
        this.currentMeridian = Geometric3.fromVector(this.referenceMeridian);

        /**
         * cascade flag prevents infinite recursion.
         */
        let cascade = true;
        this.axisChangeHandler = (eventName: string, key: string, value: number, axis: Geometric3) => {
            if (cascade) {
                cascade = false;
                this.R.rotorFromDirections(this.referenceAxis, axis);
                this.setPrincipalScale('length', Math.sqrt(quadVectorE3(axis)));
                // this.length = Math.sqrt(quadVectorE3(vector))
                cascade = true;
            }
        };
        this.attitudeChangeHandler = (eventName: string, key: string, value: number, attitude: Geometric3) => {
            if (cascade) {
                cascade = false;
                this.currentAxis.copyVector(this.referenceAxis).rotate(this.R).scale(this.length);
                cascade = true;
            }
        };

        this.currentAxis.on('change', this.axisChangeHandler);
        this.R.on('change', this.attitudeChangeHandler);

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.currentAxis.off('change', this.axisChangeHandler);
        this.R.off('change', this.attitudeChangeHandler);
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

    // The length property is not currently exposed in the d.ts.
    public get length(): number {
        return this.getPrincipalScale('length');
    }
    public set length(length: number) {
        if (isGE(length, 0)) {
            this.setPrincipalScale('length', length);
            const magnitude = Math.sqrt(quadVectorE3(this.currentAxis));
            this.currentAxis.scale(length / magnitude);
        }
        else {
            // Ignore
        }
    }

    /**
     * A short alias for the axis property.
     */
    get h() {
        return this.currentAxis;
    }
    set h(vector: Geometric3) {
        this.currentAxis.copyVector(vector);
    }

    /**
     * A long alias for the h property.
     */
    get axis() {
        return this.currentAxis;
    }
    set axis(vector: Geometric3) {
        this.currentAxis.copyVector(vector);
    }
}
