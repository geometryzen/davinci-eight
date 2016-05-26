import ContextProvider from '../core/ContextProvider';
import {Engine} from '../core/Engine';
import exchange from '../base/exchange';
import isObject from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import {Geometry} from './Geometry';
import {AbstractDrawable} from './AbstractDrawable';
import {Material} from './Material';
import {ShareableContextConsumer} from '../core/ShareableContextConsumer';
import {Facet} from '../core/Facet';

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
    private _facets: { [name: string]: Facet }

    /**
     * @param geometry
     * @param material
     * @param engine The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    constructor(geometry: Geometry, material: Material, engine: Engine) {
        super(engine)
        this.setLoggingName('Drawable')
        if (isObject(geometry)) {
            // The assignment takes care of the addRef.
            this.geometry = geometry
        }
        if (isObject(material)) {
            // The assignment takes care of the addRef.
            this.material = material
        }
        this._facets = {}
    }

    /**
     * @param levelUp
     */
    protected destructor(levelUp: number): void {
        this._geometry = exchange(this._geometry, void 0)
        this._material = exchange(this._material, void 0)
        super.destructor(levelUp + 1)
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
            throw new Error(`Unableto  set vertexShaderSrc because ${this._type}.material is not defined.`)
        }
    }

    /**
     *
     */
    setUniforms(): void {
        const material = this._material
        const facets = this._facets
        // FIXME: Temporary object creation?
        const keys = Object.keys(facets)
        const keysLength = keys.length
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i]
            const facet = facets[key]
            facet.setUniforms(material)
        }
    }

    /**
     * @param ambients
     */
    draw(ambients: Facet[]): void {
        if (this._visible) {
            const material = this._material;

            material.use();

            const iL = ambients.length;
            for (let i = 0; i < iL; i++) {
                const facet = ambients[i]
                facet.setUniforms(material)
            }

            this.setUniforms();

            this._geometry.draw(material)
        }
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
     * @param facet
     */
    setFacet(name: string, facet: Facet): void {
        this._facets[name] = facet
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
        this._material = exchange(this._material, material)
        if (this._material && this.contextProvider) {
            this._material.contextGain(this.contextProvider)
        }
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
