import IContextProvider from '../core/IContextProvider';
import IDrawable from '../core/IDrawable';
import IGraphicsBuffers from '../core/IGraphicsBuffers';
import IGraphicsProgram from '../core/IGraphicsProgram';
import readOnly from '../i18n/readOnly';
import Shareable from '../utils/Shareable';
import StringIUnknownMap from '../collections/StringIUnknownMap';
import Facet from '../core/Facet';

/**
 * Name used for reference count monitoring and logging.
 */
const LOGGING_NAME = 'Drawable';

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
    private facets: StringIUnknownMap<Facet>;

    /**
     * @class Drawable
     * @constructor
     * @param graphicsBuffers {IGraphicsBuffers}
     * @param graphicsProgram {IGraphicsProgram}
     */
    constructor(graphicsBuffers: IGraphicsBuffers, graphicsProgram: IGraphicsProgram) {
        super(LOGGING_NAME)
        this._graphicsBuffers = graphicsBuffers;
        this._graphicsBuffers.addRef();
        this._graphicsProgram = graphicsProgram
        this._graphicsProgram.addRef()
        this.facets = new StringIUnknownMap<Facet>();
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._graphicsBuffers.release();
        this._graphicsBuffers = void 0;
        this._graphicsProgram.release()
        this._graphicsProgram = void 0
        this.facets.release()
        this.facets = void 0
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

        // FIXME: The name is unused. Think we should just have a list
        // and then access using either the real uniform name or a property name.
        const facets: StringIUnknownMap<Facet> = this.facets
        // TODO: Faster iteration of facets without using a callback.
        facets.forEach(function(name, uniform) {
            uniform.setUniforms(program, canvasId)
        })

        this._graphicsBuffers.draw(program, canvasId)
    }

    /**
     * @method contextFree
     * @param canvasId {number}
     */
    contextFree(canvasId: number): void {
        this._graphicsBuffers.contextFree(canvasId)
        this._graphicsProgram.contextFree(canvasId)
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        this._graphicsBuffers.contextGain(manager)
        this._graphicsProgram.contextGain(manager)
    }

    /**
     * @method contextLost
     * @param canvasId {number}
     * @return {void}
     */
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
        return this.facets.get(name)
    }

    /**
     * @method setFacet
     * @param name {string}
     * @param facet {Facet}
     * @return {void}
     */
    setFacet(name: string, facet: Facet): void {
        this.facets.put(name, facet)
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
