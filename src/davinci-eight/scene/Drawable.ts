import IContextProvider from '../core/IContextProvider';
import IDrawable from '../core/IDrawable';
import IGraphicsBuffers from '../core/IGraphicsBuffers';
import IGraphicsProgram from '../core/IGraphicsProgram';
import readOnly from '../i18n/readOnly';
import Shareable from '../utils/Shareable';
import StringIUnknownMap from '../collections/StringIUnknownMap';
import Facet from '../core/Facet';

/**
 * @class Drawable
 * @extends Shareable
 */
export default class Drawable extends Shareable implements IDrawable {

    /**
     * @property graphicsBuffers
     * @type {IGraphicsBuffers}
     * @private
     */
    private _graphicsBuffers: IGraphicsBuffers;

    /**
     * @property graphicsProgram
     * @type {IGraphicsProgram}
     * @private
     */
    private _graphicsProgram: IGraphicsProgram;

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
     * @class Drawable
     * @constructor
     * @param graphicsBuffers {IGraphicsBuffers}
     * @param graphicsProgram {IGraphicsProgram}
     */
    constructor(graphicsBuffers: IGraphicsBuffers, graphicsProgram: IGraphicsProgram) {
        super('Drawable')
        this._graphicsBuffers = graphicsBuffers;
        this._graphicsBuffers.addRef();
        this._graphicsProgram = graphicsProgram
        this._graphicsProgram.addRef()
        this._facets = new StringIUnknownMap<Facet>();
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._graphicsBuffers.release()
        this._graphicsBuffers = void 0
        this._graphicsProgram.release()
        this._graphicsProgram = void 0
        this._facets.release()
        this._facets = void 0
        super.destructor()
    }

    /**
     * @method draw
     * @param canvasId {number}
     * @return {void}
     */
    draw(canvasId: number): void {
        // Using the private member ensures that we don't accidentally addRef.
        const program = this._graphicsProgram

        program.use(canvasId)

        this.setUniforms(canvasId);

        this._graphicsBuffers.draw(program, canvasId)
    }

    /**
     * @method setUniforms
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(canvasId: number): void {

        const facets: StringIUnknownMap<Facet> = this._facets
        // TODO: Faster iteration of facets without using a callback.
        facets.forEach((name: string, facet: Facet) => {
            facet.setUniforms(this._graphicsProgram, canvasId)
        })

    }

    contextFree(manager: IContextProvider): void {
        this._graphicsBuffers.contextFree(manager)
        this._graphicsProgram.contextFree(manager)
    }

    contextGain(manager: IContextProvider): void {
        this._graphicsBuffers.contextGain(manager)
        this._graphicsProgram.contextGain(manager)
    }

    contextLost(canvasId: number): void {
        this._graphicsBuffers.contextLost(canvasId)
        this._graphicsProgram.contextLost(canvasId)
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
     * @property graphicsBuffers
     * @type {IGraphicsBuffers}
     * @readOnly
     */
    get graphicsBuffers(): IGraphicsBuffers {
        this._graphicsBuffers.addRef()
        return this._graphicsBuffers
    }
    set graphicsBuffers(unused) {
        throw new Error(readOnly('graphicsBuffers').message)
    }

    /**
     * Provides a reference counted reference to the graphics program property.
     * @property graphicsProgram
     * @type {IGraphicsProgram}
     * @readOnly
     */
    get graphicsProgram(): IGraphicsProgram {
        this._graphicsProgram.addRef()
        return this._graphicsProgram
    }
    set graphicsProgram(unused) {
        throw new Error(readOnly('graphicsProgram').message)
    }
}
