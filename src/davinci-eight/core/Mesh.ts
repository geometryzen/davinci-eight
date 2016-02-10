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
 * @class Mesh
 * @extends Shareable
 */
export default class Mesh extends ShareableContextListener {

    /**
     * @property _buffers
     * @type {Geometry}
     * @private
     */
    protected _buffers: Geometry;

    /**
     * @property _program
     * @type {Material}
     * @private
     */
    protected _program: Material;

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
     * @class Mesh
     * @constructor
     * @param geometry {Geometry}
     * @param material {Material}
     * @param [type = 'Mesh'] {string}
     */
    constructor(geometry: Geometry, material: Material, type = 'Mesh') {
        super(type)
        this._buffers = geometry
        this._buffers.addRef()
        this._program = material
        this._program.addRef()
        this._facets = {}
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._buffers.release()
        this._buffers = void 0
        this._program.release()
        this._program = void 0
        super.destructor()
    }

    /**
     * @method setUniforms
     * @return {void}
     */
    setUniforms(): void {
        const program = this._program
        const facets = this._facets
        // FIXME: Temporary object creation?
        const keys = Object.keys(facets)
        const keysLength = keys.length
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i]
            const facet = facets[key]
            facet.setUniforms(program)
        }
    }

    /**
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
     */
    draw(ambients: Facet[]): void {
        if (this._visible) {
            const program = this._program;

            program.use();

            const iL = ambients.length;
            for (let i = 0; i < iL; i++) {
                const ambient = ambients[i]
                ambient.setUniforms(program)
            }

            this.setUniforms();

            const buffers = this._buffers;
            const jL = buffers.length;
            for (let j = 0; j < jL; j++) {
                const buffer = buffers.getWeakRef(j)
                buffer.draw(program)
            }
        }
    }

    /**
     * @method contextFree
     * @param context {IContextProvider}
     * @return {void}
     */
    contextFree(context: IContextProvider): void {
        this._buffers.contextFree(context)
        this._program.contextFree(context)
    }

    /**
     * @method contextGain
     * @param context {IContextProvider}
     * @return {void}
     */
    contextGain(context: IContextProvider): void {
        this._buffers.contextGain(context)
        this._program.contextGain(context)
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        this._buffers.contextLost()
        this._program.contextLost()
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
     * @property geometry
     * @type {Geometry}
     * @readOnly
     */
    get geometry(): Geometry {
        this._buffers.addRef()
        return this._buffers
    }
    set geometry(unused) {
        throw new Error(readOnly('geometry').message)
    }

    /**
     * Provides a reference counted reference to the graphics program property.
     * @property material
     * @type {Material}
     * @readOnly
     */
    get material(): Material {
        this._program.addRef()
        return this._program
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
