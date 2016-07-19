import {Color} from './Color';
import {ColorFacet} from '../facets/ColorFacet';
import {Drawable} from './Drawable';
import {Engine} from './Engine';
import {Geometric3} from '../math/Geometric3';
import {Geometry} from './Geometry';
import {Material} from './Material';
import AbstractMesh from '../core/AbstractMesh';
import Matrix4 from '../math/Matrix4';
import {ModelFacet} from '../facets/ModelFacet';
import notSupported from '../i18n/notSupported';

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';

/**
 *
 */
export class Mesh extends Drawable implements AbstractMesh {

    /**
     * @param geometry
     * @param material
     * @param engine The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    constructor(geometry: Geometry, material: Material, engine: Engine, levelUp = 0) {
        super(geometry, material, engine, levelUp + 1);
        this.setLoggingName('Mesh');

        this.setFacet(MODEL_FACET_NAME, new ModelFacet());
        this.setFacet(COLOR_FACET_NAME, new ColorFacet());
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

    /**
     * Attitude (spinor)
     */
    get R(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.R
        }
        else {
            throw new Error(notSupported('R').message)
        }
    }
    set R(R: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            facet.R.copySpinor(R)
        }
        else {
            throw new Error(notSupported('R').message)
        }
    }

    /**
     * Color
     */
    get color(): Color {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        if (facet) {
            return facet.color
        }
        else {
            throw new Error(notSupported(COLOR_FACET_NAME).message)
        }
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        if (facet) {
            facet.color.copy(color)
        }
        else {
            throw new Error(notSupported(COLOR_FACET_NAME).message)
        }
    }

    /**
     * Position (vector)
     */
    get X(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.X
        }
        else {
            throw new Error(notSupported('X').message)
        }
    }
    set X(X: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            facet.X.copyVector(X)
        }
        else {
            throw new Error(notSupported('X').message)
        }
    }

    /**
     * Stress (tensor)
     */
    get stress(): Matrix4 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.stress
        }
        else {
            throw new Error(notSupported('stress').message)
        }
    }
    set stress(stress: Matrix4) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            facet.stress.copy(stress)
        }
        else {
            throw new Error(notSupported('stress').message)
        }
    }

    /**
     * @param name
     * @returns
     */
    protected getPrincipalScale(name: string): number {
        const geometry = this.geometry
        if (geometry) {
            const value = geometry.getPrincipalScale(name)
            geometry.release()
            return value
        }
        else {
            throw new Error(`getPrincipalScale('${name}') is not available because geometry is not defined.`)
        }
    }

    /**
     * @param name
     * @param value
     */
    protected setPrincipalScale(name: string, value: number): void {
        const geometry = this.geometry
        geometry.setPrincipalScale(name, value)
        const scaling = geometry.scaling
        this.stress.copy(scaling)
        geometry.release()
    }
}
