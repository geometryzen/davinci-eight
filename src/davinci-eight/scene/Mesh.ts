import IContextProvider from '../core/IContextProvider';
import mustBeBoolean from '../checks/mustBeBoolean'
import Geometry from './Geometry';
import Material from '../core/Material';
import readOnly from '../i18n/readOnly';
import ShareableContextListener from '../core/ShareableContextListener';
import StringIUnknownMap from '../collections/StringIUnknownMap';
import Facet from '../core/Facet';

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

    private _visible = true;

    /**
     * @property facets
     * @type {StringIUnknownMap&lt;Facet&gt;}
     * @private
     */
    private _facets: StringIUnknownMap<Facet>;

    /**
     * @class Mesh
     * @constructor
     * @param buffers {Geometry}
     * @param program {Material}
     * @param [type = 'Mesh'] {string}
     */
    constructor(buffers: Geometry, program: Material, type = 'Mesh') {
        super(type)
        this._buffers = buffers;
        this._buffers.addRef();
        this._program = program
        this._program.addRef()
        this._facets = new StringIUnknownMap<Facet>();
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
        this._facets.release()
        this._facets = void 0
        super.destructor()
    }

    /**
     * @method setUniforms
     * @return {void}
     */
    setUniforms(): void {
        const program = this._program
        const facets: StringIUnknownMap<Facet> = this._facets
        const keys = facets.keys
        const keysLength = keys.length
        for (let i = 0; i < keysLength; i++) {
            const key = keys[i]
            const facet = facets.getWeakRef(key)
            facet.setUniforms(program)
        }
    }

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

    contextFree(manager: IContextProvider): void {
        this._buffers.contextFree(manager)
        this._program.contextFree(manager)
    }

    contextGain(manager: IContextProvider): void {
        this._buffers.contextGain(manager)
        this._program.contextGain(manager)
    }

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
        return this._facets.get(name)
    }

    /**
     * @method setFacet
     * @param name {string}
     * @param facet {Facet}
     * @return {void}
     */
    setFacet(name: string, facet: Facet): void {
        this._facets.put(name, facet)
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
     */
    get visible(): boolean {
        return this._visible
    }
    set visible(visible: boolean) {
        mustBeBoolean('visible', visible, () => { return this._type })
        this._visible = visible
    }
}
