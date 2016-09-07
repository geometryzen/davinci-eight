import {Color} from './Color';
import {ColorFacet} from '../facets/ColorFacet';
import ContextManager from './ContextManager';
import {Drawable} from './Drawable';
import {Geometric3} from '../math/Geometric3';
import {Geometry} from './Geometry';
import {Material} from './Material';
import AbstractMesh from '../core/AbstractMesh';
import Matrix4 from '../math/Matrix4';
import {ModelFacet} from '../facets/ModelFacet';
import notSupported from '../i18n/notSupported';
import PropertyCollection from './PropertyCollection';
import Spinor3 from '../math/Spinor3';
import Vector3 from '../math/Vector3';

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';

/**
 *
 */
export class Mesh<G extends Geometry, M extends Material> extends Drawable<G, M> implements AbstractMesh<G, M>, PropertyCollection {

    /**
     * @param geometry
     * @param material
     * @param contextManager The <code>ContextManager</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    constructor(geometry: G, material: M, contextManager: ContextManager, levelUp = 0) {
        super(geometry, material, contextManager, levelUp + 1);
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
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.R;
        }
        else {
            throw new Error(notSupported('R').message);
        }
    }
    set R(R: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.R.copySpinor(R);
        }
        else {
            throw new Error(notSupported('R').message);
        }
    }

    /**
     * Color
     */
    get color(): Color {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME);
        if (facet) {
            return facet.color;
        }
        else {
            throw new Error(notSupported(COLOR_FACET_NAME).message);
        }
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME);
        if (facet) {
            facet.color.copy(color);
        }
        else {
            throw new Error(notSupported(COLOR_FACET_NAME).message);
        }
    }

    /**
     * Position (vector)
     */
    get X(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.X;
        }
        else {
            throw new Error(notSupported('X').message);
        }
    }
    set X(X: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.X.copyVector(X);
        }
        else {
            throw new Error(notSupported('X').message);
        }
    }

    /**
     * Stress (tensor)
     */
    get stress(): Matrix4 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.stress;
        }
        else {
            throw new Error(notSupported('stress').message);
        }
    }
    set stress(stress: Matrix4) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.stress.copy(stress);
        }
        else {
            throw new Error(notSupported('stress').message);
        }
    }
    getPropertyFormats(name: string): string[] {
        switch (name) {
            case 'color': {
                return ['number[]'];
            }
            case 'X': {
                return ['number[]'];
            }
            case 'R': {
                return ['number[]'];
            }
            default: {
                throw new Error(`'${name}' is not a valid name for getPropertyFormats.`);
            }
        }
    }

    getProperty(name: string, format: string): any {
        switch (name) {
            case 'color': {
                return [this.color.r, this.color.g, this.color.b];
            }
            case 'X': {
                return Vector3.copy(this.X).coords;
            }
            case 'R': {
                return Spinor3.copy(this.R).coords;
            }
            default: {
                throw new Error(`'${name}' is not a valid name for getProperty.`);
            }
        }
    }
    setProperty(name: string, format: string, value: any): void {
        switch (name) {
            case 'color': {
                this.color.r = value[0];
                this.color.g = value[1];
                this.color.b = value[2];
                break;
            }
            case 'X': {
                const X = Vector3.zero().clone().copyCoordinates(value);
                this.X.copyVector(X);
                break;
            }
            case 'R': {
                const R = Spinor3.one().clone().copyCoordinates(value);
                this.R.copySpinor(R);
                break;
            }
            default: {
                throw new Error(`'${name}' is not a valid name for setProperty.`);
            }
        }
        return void 0;
    }
}
