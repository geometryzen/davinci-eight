import IContextProvider = require('../core/IContextProvider');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IDrawable = require('../core/IDrawable');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
/**
 * @class Drawable
 * @extends Shareable
 */
declare class Drawable extends Shareable implements IDrawable {
    /**
     * @property primitives
     * @type {DrawPrimitive[]}
     */
    primitives: DrawPrimitive[];
    /**
     * @property graphicsProgram
     * @type {IGraphicsProgram}
     * @private
     */
    graphicsProgram: IGraphicsProgram;
    /**
     * @property name
     * @type {string}
     * @optional
     */
    name: string;
    /**
     * FIXME This is a bad name because it is not just a collection of buffersByCanvasId.
     * A map from canvas to IBufferGeometry.
     * It's a function that returns a mesh, given a canvasId a lookup
     */
    private buffersByCanvasId;
    /**
     * @property facets
     * @type {StringIUnknownMap&lt;IFacet&gt;}
     * @private
     */
    private facets;
    /**
     * @class Drawable
     * @constructor
     * @param primitives {DrawPrimitive[]}
     * @param material {IGraphicsProgram}
     */
    constructor(primitives: DrawPrimitive[], material: IGraphicsProgram);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method draw
     * @param [canvasId = 0] {number}
     * @return {void}
     */
    draw(canvasId?: number): void;
    /**
     * @method contextFree
     * @param [canvasId] {number}
     */
    contextFree(canvasId?: number): void;
    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void;
    /**
     * @method contextLost
     * @param [canvasId] {number}
     * @return {void}
     */
    contextLost(canvasId?: number): void;
    /**
     * @method getFacet
     * @param name {string}
     * @return {IFacet}
     */
    getFacet(name: string): IFacet;
    /**
     * @method setFacet
     * @param name {string}
     * @param facet {IFacet}
     * @return {void}
     */
    setFacet(name: string, facet: IFacet): void;
    /**
     * Provides a reference counted reference to the graphics program.
     * @property material
     * @type {IGraphicsProgram}
     * @readOnly
     */
    material: IGraphicsProgram;
}
export = Drawable;
