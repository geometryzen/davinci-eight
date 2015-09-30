import IContextProvider = require('../core/IContextProvider');
import GeometryElements = require('../geometries/GeometryElements');
import IDrawable = require('../core/IDrawable');
import IMaterial = require('../core/IMaterial');
import Shareable = require('../utils/Shareable');
import UniformData = require('../core/UniformData');
/**
 * @class Drawable
 * @implements IDrawable
 */
declare class Drawable<G extends GeometryElements, M extends IMaterial, U extends UniformData> extends Shareable implements IDrawable {
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
     * @property model
     * @type {U}
     */
    model: U;
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
    constructor(geometry: G, material: M, model: U);
    protected destructor(): void;
    draw(canvasId: number): void;
    contextFree(canvasId: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId: number): void;
    /**
     * @property material
     * @type {M}
     *
     * Provides a reference counted reference to the material.
     */
    material: M;
}
export = Drawable;
