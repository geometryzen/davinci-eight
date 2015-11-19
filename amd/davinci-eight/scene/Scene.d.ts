import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IUnknownArray = require('../collections/IUnknownArray');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
/**
 * @class Scene
 * @extends Shareable
 */
declare class Scene extends Shareable implements IDrawList {
    /**
     * @property drawList
     * @type {IDrawList}
     * @private
     */
    private drawList;
    /**
     * @property monitors
     * @type {MonitorList}
     * @private
     */
    private monitors;
    /**
     * <p>
     * A <code>Scene</code> is a collection of drawable instances arranged in some order.
     * The precise order is implementation defined.
     * The collection may be traversed for general processing using callback/visitor functions.
     * </p>
     * @class Scene
     * @constructor
     * @param [monitors = []] {Array&lt;IContextMonitor&gt;}
     */
    constructor(monitors?: IContextMonitor[]);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * <p>
     * Adds the <code>drawable</code> to this <code>Scene</code>.
     * </p>
     * @method add
     * @param drawable {IDrawable}
     * @return {Void}
     * <p>
     * This method returns <code>undefined</code>.
     * </p>
     */
    add(drawable: IDrawable): void;
    containsDrawable(drawable: IDrawable): boolean;
    /**
     * <p>
     * Traverses the collection of drawables, drawing each one.
     * </p>
     * @method draw
     * @param ambients {IFacet[]}
     * @param [canvasId] {number}
     * @return {void}
     * @beta
     */
    draw(ambients: IFacet[], canvasId?: number): void;
    /**
     * Gets a collection of drawable elements by name.
     * @method getDrawablesByName
     * @param name {string}
     */
    getDrawablesByName(name: string): IUnknownArray<IDrawable>;
    /**
     * <p>
     * Removes the <code>drawable</code> from this <code>Scene</code>.
     * </p>
     * @method remove
     * @param drawable {IDrawable}
     * @return {Void}
     * <p>
     * This method returns <code>undefined</code>.
     * </p>
     */
    remove(drawable: IDrawable): void;
    /**
     * <p>
     * Traverses the collection of drawables, calling the specified callback arguments.
     * </p>
     * @method traverse
     * @param callback {(drawable: IDrawable) => void} Callback function for each drawable.
     * @param canvasId {number} Identifies the canvas.
     * @param prolog {(material: IGraphicsProgram) => void} Callback function for each material.
     * @return {void}
     */
    traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (material: IGraphicsProgram) => void): void;
    contextFree(canvasId: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId: number): void;
}
export = Scene;
