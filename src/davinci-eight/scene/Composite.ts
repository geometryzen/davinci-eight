import IContextProvider from '../core/IContextProvider';
import GraphicsBuffers from './GraphicsBuffers';
import ShareableWebGLProgram from '../core/ShareableWebGLProgram';
import readOnly from '../i18n/readOnly';
import ShareableContextListener from '../core/ShareableContextListener';
import StringIUnknownMap from '../collections/StringIUnknownMap';
import Facet from '../core/Facet';

/**
 * @class Composite
 * @extends Shareable
 */
export default class Composite extends ShareableContextListener {

    /**
     * @property _buffers
     * @type {GraphicsBuffers}
     * @private
     */
    private _buffers: GraphicsBuffers;

    /**
     * @property _program
     * @type {ShareableWebGLProgram}
     * @private
     */
    private _program: ShareableWebGLProgram;

    /**
     * @property name
     * @type {string}
     * @optional
     */
    public name: string;

    /**
     * @property facets
     * @type {StringIUnknownMap&lt;Facet&gt;}
     * @private
     */
    private _facets: StringIUnknownMap<Facet>;

    /**
     * @class Composite
     * @constructor
     * @param buffers {GraphicsBuffers}
     * @param program {ShareableWebGLProgram}
     * @param type {string}
     */
    constructor(buffers: GraphicsBuffers, program: ShareableWebGLProgram, type: string) {
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
     * @property buffers
     * @type {GraphicsBuffers}
     * @readOnly
     */
    get buffers(): GraphicsBuffers {
        this._buffers.addRef()
        return this._buffers
    }
    set buffers(unused) {
        throw new Error(readOnly('buffers').message)
    }

    /**
     * Provides a reference counted reference to the graphics program property.
     * @property program
     * @type {ShareableWebGLProgram}
     * @readOnly
     */
    get program(): ShareableWebGLProgram {
        this._program.addRef()
        return this._program
    }
    set program(unused) {
        throw new Error(readOnly('program').message)
    }
}
