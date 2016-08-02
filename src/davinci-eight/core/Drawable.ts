import {AbstractDrawable} from './AbstractDrawable';
import ContextManager from '../core/ContextManager';
import ContextProvider from '../core/ContextProvider';
import exchange from '../base/exchange';
import {Facet} from '../core/Facet';
import {Geometry} from './Geometry';
import GraphicsProgramSymbols from './GraphicsProgramSymbols';
import isObject from '../checks/isObject';
import isNull from '../checks/isNull';
import isNumber from '../checks/isNumber';
import isUndefined from '../checks/isUndefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import {Material} from './Material';
import {OpacityFacet} from '../facets/OpacityFacet';
import {PointSizeFacet} from '../facets/PointSizeFacet';
import {ShareableContextConsumer} from '../core/ShareableContextConsumer';

const OPACITY_FACET_NAME = 'opacity';
const POINTSIZE_FACET_NAME = 'pointSize';

/**
 * This class may be used as either a base class or standalone. 
 */
export class Drawable extends ShareableContextConsumer implements AbstractDrawable {

    /**
     *
     */
    private _geometry: Geometry

    /**
     *
     */
    private _material: Material

    /**
     *
     */
    public name: string

    /**
     *
     */
    private _visible = true

    /**
     *
     */
    private _facets: { [name: string]: Facet } = {};

    /**
     * @param geometry
     * @param material
     * @param contextManager The <code>ContextManager</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    constructor(geometry: Geometry, material: Material, contextManager: ContextManager, levelUp = 0) {
        super(contextManager);
        this.setLoggingName('Drawable');
        if (isObject(geometry)) {
            // The assignment takes care of the addRef.
            this.geometry = geometry;
        }
        if (isObject(material)) {
            // The assignment takes care of the addRef.
            this.material = material;
        }

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * @param levelUp
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }

        this._geometry = exchange(this._geometry, void 0);
        this._material = exchange(this._material, void 0);
        super.destructor(levelUp + 1);
    }

    /**
     *
     */
    get fragmentShaderSrc(): string {
        if (this._material) {
            return this._material.fragmentShaderSrc
        }
        else {
            return void 0
        }

    }
    set fragmentShaderSrc(fragmentShaderSrc: string) {
        if (this._material) {
            this._material.fragmentShaderSrc = fragmentShaderSrc
        }
        else {
            throw new Error(`Unable to set fragmentShaderSrc because ${this._type}.material is not defined.`)
        }
    }

    /**
     *
     */
    get vertexShaderSrc(): string {
        if (this._material) {
            return this._material.vertexShaderSrc
        }
        else {
            return void 0
        }

    }
    set vertexShaderSrc(vertexShaderSrc: string) {
        const material = this._material
        if (material) {
            material.vertexShaderSrc = vertexShaderSrc
        }
        else {
            throw new Error(`Unable to set vertexShaderSrc because ${this._type}.material is not defined.`)
        }
    }

    get opacity(): number {
        const facet = <OpacityFacet>this.getFacet(OPACITY_FACET_NAME)
        if (facet) {
            return facet.opacity;
        }
        else {
            return void 0;
        }
    }
    set opacity(newOpacity: number) {
        if (isNumber(newOpacity)) {
            const facet = <OpacityFacet>this.getFacet(OPACITY_FACET_NAME)
            if (facet) {
                facet.opacity = newOpacity;
            }
            else {
                this.setFacet(OPACITY_FACET_NAME, new OpacityFacet(newOpacity));
            }
        }
        else if (isUndefined(newOpacity) || isNull(newOpacity)) {
            this.removeFacet(OPACITY_FACET_NAME);
        }
        else {
            throw new TypeError("opacity must be a number, undefined, or null.");
        }
    }

    get pointSize(): number {
        const facet = <PointSizeFacet>this.getFacet(POINTSIZE_FACET_NAME)
        if (facet) {
            return facet.pointSize;
        }
        else {
            return void 0;
        }
    }
    set pointSize(newPointSize: number) {
        if (isNumber(newPointSize)) {
            const facet = <PointSizeFacet>this.getFacet(POINTSIZE_FACET_NAME)
            if (facet) {
                facet.pointSize = newPointSize;
            }
            else {
                this.setFacet(POINTSIZE_FACET_NAME, new PointSizeFacet(newPointSize));
            }
        }
        else if (isUndefined(newPointSize) || isNull(newPointSize)) {
            this.removeFacet(POINTSIZE_FACET_NAME);
        }
        else {
            throw new TypeError("pointSize must be a number, undefined, or null.");
        }
    }

    bind(): Drawable {
        this._geometry.bind(this._material);
        return this;
    }

    /**
     *
     */
    setUniforms(): Drawable {
        const material = this._material;
        const facets = this._facets;
        // FIXME: Temporary object creation?
        const keys = Object.keys(facets);
        const keysLength = keys.length;
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i];
            const facet = facets[key];
            facet.setUniforms(material);
        }
        return this;
    }

    draw(ambients?: Facet[]): Drawable {
        if (this._visible) {
            if (ambients) {
                console.warn("draw(ambients: Facet[]) is deprecated. Please use render(ambients: Facet[]) instead.");
                this.render(ambients);
            }
            else {
                if (this._geometry) {
                    this._geometry.draw(this._material);
                }
            }
        }
        return this;
    }

    /**
     * @param context
     */
    contextFree(context: ContextProvider): void {
        this._geometry.contextFree(context)
        this._material.contextFree(context)
        super.contextFree(context)
    }

    /**
     * @param context
     */
    contextGain(context: ContextProvider): void {
        this._geometry.contextGain(context)
        this._material.contextGain(context)
        synchFacets(this._material, this);
        super.contextGain(context)
    }

    /**
     *
     */
    contextLost(): void {
        this._geometry.contextLost()
        this._material.contextLost()
        super.contextLost()
    }

    /**
     * @param name {string}
     */
    getFacet(name: string): Facet {
        return this._facets[name]
    }

    /**
     * A convenience method for performing all of the methods required for rendering.
     * The following methods are called in order.
     * use()
     * bind()
     * setAmbients(ambients)
     * setUniforms()
     * draw()
     * unbind()
     * In particle simulations it may be useful to call the underlying method directly.
     */
    render(ambients: Facet[]): Drawable {
        if (this._visible) {
            this.use().bind().setAmbients(ambients).setUniforms().draw().unbind();
        }
        return this;
    }

    setAmbients(ambients: Facet[]): Drawable {
        const iL = ambients.length;
        for (let i = 0; i < iL; i++) {
            const facet = ambients[i];
            facet.setUniforms(this._material);
        }
        return this;
    }

    removeFacet(name: string): Facet {
        const facet = this._facets[name];
        if (facet) {
            delete this._facets[name];
        }
        return facet;
    }

    /**
     * @param facet
     */
    setFacet(name: string, facet: Facet): void {
        this._facets[name] = facet
    }

    unbind(): Drawable {
        this._geometry.unbind(this._material);
        return this;
    }

    use(): Drawable {
        this._material.use();
        return this;
    }

    /**
     * Provides a reference counted reference to the graphics buffers property.
     */
    get geometry(): Geometry {
        if (this._geometry) {
            this._geometry.addRef()
            return this._geometry
        }
        else {
            return void 0
        }
    }
    set geometry(geometry: Geometry) {
        this._geometry = exchange(this._geometry, geometry)
        if (this._geometry && this.contextProvider) {
            this._geometry.contextGain(this.contextProvider)
        }
    }

    /**
     * Provides a reference counted reference to the graphics program property.
     */
    get material(): Material {
        if (this._material) {
            this._material.addRef()
            return this._material
        }
        else {
            return void 0
        }
    }
    set material(material: Material) {
        this._material = exchange(this._material, material);
        if (this._material) {
            if (this.contextProvider) {
                this._material.contextGain(this.contextProvider);
            }
        }
        synchFacets(this._material, this);
    }

    /**
     * @default true
     */
    get visible(): boolean {
        return this._visible
    }
    set visible(visible: boolean) {
        mustBeBoolean('visible', visible, () => { return this._type })
        this._visible = visible
    }
}

/**
 * Helper function to synchronize and optimize facets.
 */
function synchFacets(material: Material, drawable: Drawable) {
    if (material) {
        // Ensure that the opacity property is initialized if the material has a corresponding uniform.
        if (material.hasUniform(GraphicsProgramSymbols.UNIFORM_OPACITY)) {
            if (!isNumber(drawable.opacity)) {
                drawable.opacity = 1.0;
            }
        }
        else {
            drawable.removeFacet(OPACITY_FACET_NAME);
        }

        // Ensure that the pointSize property is initialized if the material has a corresponding uniform.
        if (material.hasUniform(GraphicsProgramSymbols.UNIFORM_POINT_SIZE)) {
            if (!isNumber(drawable.pointSize)) {
                drawable.pointSize = 2;
            }
        }
        else {
            drawable.removeFacet(POINTSIZE_FACET_NAME);
        }
    }
}
