import { AbstractDrawable } from './AbstractDrawable';
import ContextManager from '../core/ContextManager';
import ContextProvider from '../core/ContextProvider';
import exchange from '../base/exchange';
import { Facet } from '../core/Facet';
import { Geometry } from './Geometry';
import GraphicsProgramSymbols from './GraphicsProgramSymbols';
import isObject from '../checks/isObject';
import isNull from '../checks/isNull';
import isNumber from '../checks/isNumber';
import isUndefined from '../checks/isUndefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import { Material } from './Material';
import { OpacityFacet } from '../facets/OpacityFacet';
import { PointSizeFacet } from '../facets/PointSizeFacet';
import { ShareableContextConsumer } from '../core/ShareableContextConsumer';
import StringShareableMap from '../collections/StringShareableMap';

const OPACITY_FACET_NAME = 'opacity';
const POINTSIZE_FACET_NAME = 'pointSize';

/**
 * This class may be used as either a base class or standalone. 
 */
export class Drawable<G extends Geometry, M extends Material> extends ShareableContextConsumer implements AbstractDrawable<G, M> {

    /**
     *
     */
    private _geometry: G;

    /**
     *
     */
    private _material: M;

    /**
     *
     */
    public name: string;

    /**
     *
     */
    private _visible = true;

    /**
     *
     */
    private _transparent = false;

    /**
     * TODO: Replace with two data structures:
     * 1. Use an array to provide fast access without object creation during rendering.
     * 2. Use a map from name to index for updates.
     */
    // private _facets: { [name: string]: Facet } = {};
    private facetMap = new StringShareableMap<Facet>();

    constructor(geometry: G, material: M, contextManager: ContextManager, levelUp = 0) {
        super(mustBeNonNullObject('contextManager', contextManager));
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

    protected destructor(levelUp: number): void {
        this.facetMap.release();

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
            return this._material.fragmentShaderSrc;
        }
        else {
            return void 0;
        }

    }
    set fragmentShaderSrc(fragmentShaderSrc: string) {
        if (this._material) {
            this._material.fragmentShaderSrc = fragmentShaderSrc;
        }
        else {
            throw new Error(`Unable to set fragmentShaderSrc because ${this._type}.material is not defined.`);
        }
    }

    /**
     *
     */
    get vertexShaderSrc(): string {
        if (this._material) {
            return this._material.vertexShaderSrc;
        }
        else {
            return void 0;
        }

    }
    set vertexShaderSrc(vertexShaderSrc: string) {
        const material = this._material;
        if (material) {
            material.vertexShaderSrc = vertexShaderSrc;
        }
        else {
            throw new Error(`Unable to set vertexShaderSrc because ${this._type}.material is not defined.`);
        }
    }

    get opacity(): number {
        const facet = <OpacityFacet>this.getFacet(OPACITY_FACET_NAME);
        if (facet) {
            return facet.opacity;
        }
        else {
            return void 0;
        }
    }
    set opacity(newOpacity: number) {
        if (isNumber(newOpacity)) {
            const facet = <OpacityFacet>this.getFacet(OPACITY_FACET_NAME);
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
        const facet = <PointSizeFacet>this.getFacet(POINTSIZE_FACET_NAME);
        if (facet) {
            return facet.pointSize;
        }
        else {
            return void 0;
        }
    }
    set pointSize(newPointSize: number) {
        if (isNumber(newPointSize)) {
            const facet = <PointSizeFacet>this.getFacet(POINTSIZE_FACET_NAME);
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

    bind(): Drawable<G, M> {
        this._geometry.bind(this._material);
        return this;
    }

    /**
     *
     */
    setUniforms(): Drawable<G, M> {
        const material = this._material;
        const keys = this.facetMap.keys;
        const keysLength = keys.length;
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i];
            const facet = this.facetMap.getWeakRef(key);
            facet.setUniforms(material);
        }
        return this;
    }

    draw(ambients?: Facet[]): Drawable<G, M> {
        if (this._visible) {
            if (ambients) {
                console.warn("draw(ambients: Facet[]) is deprecated. Please use render(ambients: Facet[]) instead.");
                this.render(ambients);
            }
            else {
                if (this._geometry) {
                    this._geometry.draw();
                }
            }
        }
        return this;
    }

    contextFree(context: ContextProvider): void {
        if (this._geometry && this._geometry.contextFree) {
            this._geometry.contextFree(context);
        }
        if (this._material && this._material.contextFree) {
            this._material.contextFree(context);
        }
        if (super.contextFree) {
            super.contextFree(context);
        }
    }

    contextGain(contextProvider: ContextProvider): void {
        if (this._geometry && this._geometry.contextGain) {
            this._geometry.contextGain(contextProvider);
        }
        if (this._material && this._material.contextGain) {
            this._material.contextGain(contextProvider);
        }
        synchFacets(this._material, this);
        if (super.contextGain) {
            super.contextGain(contextProvider);
        }
    }

    contextLost(): void {
        if (this._geometry && this._geometry.contextLost) {
            this._geometry.contextLost();
        }
        if (this._material && this._material.contextLost) {
            this._material.contextLost();
        }
        if (super.contextLost) {
            super.contextLost();
        }
    }

    /**
     * @param name {string}
     */
    getFacet(name: string): Facet {
        return this.facetMap.get(name);
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
    render(ambients: Facet[]): Drawable<G, M> {
        if (this._visible) {
            this.use().bind().setAmbients(ambients).setUniforms().draw().unbind();
        }
        return this;
    }

    setAmbients(ambients: Facet[]): Drawable<G, M> {
        const iL = ambients.length;
        for (let i = 0; i < iL; i++) {
            const facet = ambients[i];
            facet.setUniforms(this._material);
        }
        return this;
    }

    removeFacet(name: string): Facet {
        return this.facetMap.remove(name);
    }

    /**
     * @param facet
     */
    setFacet(name: string, facet: Facet): void {
        this.facetMap.put(name, facet);
    }

    unbind(): Drawable<G, M> {
        this._geometry.unbind(this._material);
        return this;
    }

    use(): Drawable<G, M> {
        this._material.use();
        return this;
    }

    /**
     * Provides a reference counted reference to the graphics buffers property.
     */
    get geometry(): G {
        if (this._geometry) {
            this._geometry.addRef();
            return this._geometry;
        }
        else {
            return void 0;
        }
    }
    set geometry(geometry: G) {
        this._geometry = exchange(this._geometry, geometry);
        if (this._geometry && this._geometry.contextGain && this.contextProvider) {
            this._geometry.contextGain(this.contextProvider);
        }
    }

    /**
     * Provides a reference counted reference to the graphics program property.
     */
    get material(): M {
        if (this._material) {
            this._material.addRef();
            return this._material;
        }
        else {
            return void 0;
        }
    }
    set material(material: M) {
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
        return this._visible;
    }
    set visible(visible: boolean) {
        mustBeBoolean('visible', visible, () => { return this._type; });
        this._visible = visible;
    }

    /**
     * @default false
     */
    get transparent(): boolean {
        return this._transparent;
    }
    set transparent(transparent: boolean) {
        mustBeBoolean('transparent', transparent, () => { return this._type; });
        this._transparent = transparent;
    }
}

/**
 * Helper function to synchronize and optimize facets.
 */
function synchFacets<G extends Geometry, M extends Material>(material: M, drawable: Drawable<G, M>) {
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
