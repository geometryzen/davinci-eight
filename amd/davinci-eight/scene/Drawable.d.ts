import IContextProvider = require('../core/IContextProvider');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IDrawable = require('../core/IDrawable');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
/**
 * @class Drawable
 * @extends Shareable
 * @extends IDrawable
 */
declare class Drawable<M extends IGraphicsProgram> extends Shareable implements IDrawable {
    /**
     * @property primitives
     * @type {DrawPrimitive[]}
     */
    primitives: DrawPrimitive[];
    /**
     * @property _material
     * @type {M}
     * @private
     */
    _material: M;
    /**
     * @property name
     * @type {string}
     * @optional
     */
    name: string;
    /**
     * FIXME This is a bad name because it is not just a collection of buffersByCanvasId.
     * A map from canvas to IBufferGeometry.
     * It's a function that returns a mesh, given a canvasId a lokup
     */
    private buffersByCanvasId;
    /**
     * @property uniforms
     * @type {StringIUnknownMap<IFacet>}
     * @private
     */
    private uniforms;
    /**
     * @property mode
     * @type {number}
     * @private
     */
    private mode;
    /**
     * @class Drawable
     * @constructor
     * @param primitives {DrawPrimitive[]}
     * @param material {M}
     * @param model {U}
     */
    constructor(primitives: DrawPrimitive[], material: M);
    protected destructor(): void;
    draw(canvasId?: number): void;
    contextFree(canvasId?: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId?: number): void;
    /**
     * @method getFacet
     * @param name {string}
     * @return {IFacet}
     */
    getFacet(name: string): IFacet;
    setFacet<T extends IFacet>(name: string, value: T): T;
    /**
     * Provides a reference counted reference to the material.
     * @property material
     * @type {M}
     */
    material: M;
}
export = Drawable;
