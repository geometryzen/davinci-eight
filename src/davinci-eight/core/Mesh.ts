import {Color} from './Color';
import {ColorFacet} from '../facets/ColorFacet';
import {Drawable} from './Drawable';
import {Engine} from './Engine';
import {Geometric3} from '../math/Geometric3';
import {Geometry} from './Geometry';
import {Material} from './Material';
import {OpacityFacet} from '../facets/OpacityFacet';
import AbstractMesh from '../core/AbstractMesh';
import Matrix4 from '../math/Matrix4';
import {ModelFacet} from '../facets/ModelFacet';
import {PointSizeFacet} from '../facets/PointSizeFacet';
import notSupported from '../i18n/notSupported';

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';
const OPACITY_FACET_NAME = 'opacity';
const POINT_FACET_NAME = 'point';

/**
 *
 */
export class Mesh extends Drawable implements AbstractMesh {

    /**
     * @param geometry
     * @param material
     * @param engine The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    constructor(geometry: Geometry, material: Material, engine: Engine) {
        super(geometry, material, engine)
        this.setLoggingName('Mesh')

        this.setFacet(MODEL_FACET_NAME, new ModelFacet())
        this.setFacet(COLOR_FACET_NAME, new ColorFacet())
        this.setFacet(OPACITY_FACET_NAME, new OpacityFacet())
        this.setFacet(POINT_FACET_NAME, new PointSizeFacet())
    }

    protected destructor(levelUp: number): void {
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
     * Opacity
     */
    get opacity(): number {
        const facet = <OpacityFacet>this.getFacet(OPACITY_FACET_NAME)
        if (facet) {
            return facet.opacity;
        }
        else {
            throw new Error(notSupported(OPACITY_FACET_NAME).message)
        }
    }
    set opacity(opacity: number) {
        const facet = <OpacityFacet>this.getFacet(OPACITY_FACET_NAME)
        if (facet) {
            facet.opacity = opacity;
        }
        else {
            throw new Error(notSupported(OPACITY_FACET_NAME).message)
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
