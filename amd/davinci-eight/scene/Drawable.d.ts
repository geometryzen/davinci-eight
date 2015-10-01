import IContextProvider = require('../core/IContextProvider');
import GeometryElements = require('../geometries/GeometryElements');
import IDrawable = require('../core/IDrawable');
import IMaterial = require('../core/IMaterial');
import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
/**
 * @class Drawable
 * @implements IDrawable
 */
declare class Drawable<G extends GeometryElements, M extends IMaterial> extends Shareable implements IDrawable {
    /**
     * @property geometry
     * @type {G}
     */
    geometry: G;
    /**
     * @property _material
     * @type {M}
     * @private
     */
    _material: M;
    /**
     * @property name
     * @type [string]
     */
    name: string;
    /**
     * FIXME This is a bad name because it is not just a collection of buffersByCanvasid.
     * A map from canvas to IBufferGeometry.
     * It's a function that returns a mesh, given a canvasId a lokup
     */
    private buffersByCanvasid;
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
     * @param geometry {G}
     * @param material {M}
     * @param model {U}
     */
    constructor(geometry: G, material: M);
    protected destructor(): void;
    draw(canvasId: number): void;
    contextFree(canvasId: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId: number): void;
    /**
     * @method getFacet
     * @param name {string}
     * @return {IFacet}
     */
    getFacet(name: string): IFacet;
    setFacet<T extends IFacet>(name: string, value: T): T;
    /**
     * @property material
     * @type {M}
     *
     * Provides a reference counted reference to the material.
     */
    material: M;
}
export = Drawable;
