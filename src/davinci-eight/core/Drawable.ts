import { AbstractDrawable } from './AbstractDrawable';
import ContextManager from '../core/ContextManager';
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

    public name: string;

    private _geometry: G;
    private _material: M;
    private _visible = true;
    private _transparent = false;
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

    /**
     * A convenience method for calling geometry.bind(material).
     */
    bind(): Drawable<G, M> {
        this._geometry.bind(this._material);
        return this;
    }

    /**
     * Sets the Material uniforms from the Facets of this composite object,
     * and from Facets stored by the Geometry and Material.
     */
    setUniforms(): Drawable<G, M> {
        const geometry = this._geometry;
        const material = this._material;
        const keys = this.facetMap.keys;
        const keysLength = keys.length;
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i];
            const facet = this.facetMap.getWeakRef(key);
            facet.setUniforms(material);
        }
        geometry.setUniforms(material);
        material.setUniforms(material);
        return this;
    }

    /**
     * 
     */
    draw(): Drawable<G, M> {
        if (this._visible) {
            if (this._geometry) {
                this._geometry.draw();
            }
        }
        return this;
    }

    contextFree(): void {
        if (this._geometry && this._geometry.contextFree) {
            this._geometry.contextFree();
        }
        if (this._material && this._material.contextFree) {
            this._material.contextFree();
        }
        if (super.contextFree) {
            super.contextFree();
        }
    }

    contextGain(): void {
        if (this._geometry && this._geometry.contextGain) {
            this._geometry.contextGain();
        }
        if (this._material && this._material.contextGain) {
            this._material.contextGain();
        }
        synchFacets(this._material, this);
        if (super.contextGain) {
            super.contextGain();
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
     * @param name The name of the Facet.
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

    /**
     * Updates the Material uniforms from the ambient Facets argument.
     */
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
     * @param name The name of the Facet.
     * @param facet The Facet.
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
     * Provides a reference counted reference to the geometry property.
     */
    get geometry(): G {
        return exchange(void 0, this._geometry);
    }
    set geometry(geometry: G) {
        this._geometry = exchange(this._geometry, geometry);
        /*
        if (this._geometry && this._geometry.contextGain && this.contextProvider) {
            this._geometry.contextGain(this.contextProvider);
        }
        */
    }

    /**
     * Provides a reference counted reference to the material property.
     */
    get material(): M {
        return exchange(void 0, this._material);
    }
    set material(material: M) {
        this._material = exchange(this._material, material);
        /*
        if (this._material) {
            if (this.contextProvider) {
                this._material.contextGain(this.contextProvider);
            }
        }
        */
        synchFacets(this._material, this);
    }

    /**
     * @default true
     */
    get visible(): boolean {
        return this._visible;
    }
    set visible(visible: boolean) {
        mustBeBoolean('visible', visible, () => { return this.getLoggingName(); });
        this._visible = visible;
    }

    /**
     * @default false
     */
    get transparent(): boolean {
        return this._transparent;
    }
    set transparent(transparent: boolean) {
        mustBeBoolean('transparent', transparent, () => { return this.getLoggingName(); });
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
