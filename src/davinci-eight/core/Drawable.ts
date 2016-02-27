import IContextProvider from '../core/IContextProvider';
import mustBeBoolean from '../checks/mustBeBoolean'
import Geometry from './Geometry';
import Material from '../core/Material';
import readOnly from '../i18n/readOnly';
import ShareableContextListener from '../core/ShareableContextListener';
import Facet from '../core/Facet';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class Drawable
 * @extends Shareable
 */
export default class Drawable extends ShareableContextListener {

    /**
     * @property _geometry
     * @type {Geometry}
     * @private
     */
    // FIXME: Make this private again (Sphere)
    protected _geometry: Geometry;

    /**
     * @property _material
     * @type {Material}
     * @private
     */
    // FIXME: Make this private again (Sphere)
    protected _material: Material;

    /**
     * @property name
     * @type {string}
     * @optional
     */
    public name: string;

    /**
     * @property _visible
     * @type boolean
     * @private
     */
    private _visible = true;

    /**
     * @property _facets
     * @private
     */
    private _facets: { [name: string]: Facet };

    /**
     * @class Drawable
     * @constructor
     * @param geometry {Geometry}
     * @param material {Material}
     * @param [type = 'Drawable'] {string}
     */
    constructor(geometry: Geometry, material: Material, type = 'Drawable') {
        super(type)
        this._geometry = geometry
        this._geometry.addRef()
        this._material = material
        this._material.addRef()
        this._facets = {}
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._geometry.release()
        this._geometry = void 0
        this._material.release()
        this._material = void 0
        super.destructor()
    }

    /**
     * @method setUniforms
     * @return {void}
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
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
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
     * @method contextFree
     * @param context {IContextProvider}
     * @return {void}
     */
    contextFree(context: IContextProvider): void {
        this._geometry.contextFree(context)
        this._material.contextFree(context)
    }

    /**
     * @method contextGain
     * @param context {IContextProvider}
     * @return {void}
     */
    contextGain(context: IContextProvider): void {
        this._geometry.contextGain(context)
        this._material.contextGain(context)
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        this._geometry.contextLost()
        this._material.contextLost()
    }

    /**
     * @method getFacet
     * @param name {string}
     * @return {Facet}
     */
    getFacet(name: string): Facet {
        return this._facets[name]
    }

    /**
     * @method setFacet
     * @param name {string}
     * @param facet {Facet}
     * @return {void}
     */
    setFacet(name: string, facet: Facet): void {
        this._facets[name] = facet
    }

    /**
     * Provides a reference counted reference to the graphics buffers property.
     *
     * @property geometry
     * @type {Geometry}
     * @readOnly
     */
    get geometry(): Geometry {
        this._geometry.addRef()
        return this._geometry
    }
    set geometry(unused) {
        throw new Error(readOnly('geometry').message)
    }

    /**
     * Provides a reference counted reference to the graphics program property.
     *
     * @property material
     * @type {Material}
     * @readOnly
     */
    get material(): Material {
        this._material.addRef()
        return this._material
    }
    set material(unused) {
        throw new Error(readOnly('material').message)
    }

    /**
     * @property visible
     * @type boolean
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
