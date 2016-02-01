import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import core from '../core';
import createDrawList from '../scene/createDrawList';
import IDrawable from '../core/IDrawable';
import IDrawList from '../scene/IDrawList';
import IUnknownArray from '../collections/IUnknownArray';
import IGraphicsProgram from '../core/IGraphicsProgram';
import MonitorList from '../scene/MonitorList';
import Shareable from '../utils/Shareable';
import Facet from '../core/Facet';

const LOGGING_NAME = 'Scene';

function ctorContext(): string {
    return LOGGING_NAME + " constructor";
}

/**
 * @class Scene
 * @extends Shareable
 */
export default class Scene extends Shareable implements IDrawList {

    /**
     * @property drawList
     * @type {IDrawList}
     * @private
     */
    private drawList: IDrawList;

    /**
     * @property monitors
     * @type {MonitorList}
     * @private
     */
    private monitors: MonitorList;

    // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
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
    constructor(monitors: IContextMonitor[] = []) {
        super(LOGGING_NAME);
        MonitorList.verify('monitors', monitors, ctorContext);

        this.drawList = createDrawList();
        this.monitors = new MonitorList(monitors);
        this.monitors.addContextListener(this);
        this.monitors.synchronize(this);
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.monitors.removeContextListener(this);
        this.monitors.release();
        this.monitors = void 0;

        this.drawList.release();
        this.drawList = void 0;
    }

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
    add(drawable: IDrawable): void {
        return this.drawList.add(drawable);
    }


    containsDrawable(drawable: IDrawable): boolean {
        return this.drawList.containsDrawable(drawable);
    }

    /**
     * <p>
     * Traverses the collection of drawables, drawing each one.
     * </p>
     * @method draw
     * @param ambients {Facet[]}
     * @param [canvasId] {number}
     * @return {void}
     * @beta
     */
    draw(ambients: Facet[], canvasId?: number): void {
        return this.drawList.draw(ambients, canvasId);
    }

    /**
     * Gets a collection of drawable elements by name.
     * @method getDrawablesByName
     * @param name {string}
     */
    getDrawablesByName(name: string): IUnknownArray<IDrawable> {
        return this.drawList.getDrawablesByName(name);
    }

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
    remove(drawable: IDrawable): void {
        return this.drawList.remove(drawable);
    }

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
    traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (material: IGraphicsProgram) => void): void {
        this.drawList.traverse(callback, canvasId, prolog);
    }

    /**
     * @method contextFree
     * @param canvasId {number}
     * @return {void}
     */
    contextFree(canvasId: number): void {
        if (core.verbose) {
            console.log(`${this._type} contextFree(canvasId=${canvasId})`);
        }
        this.drawList.contextFree(canvasId);
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        if (core.verbose) {
            console.log(`${this._type} contextGain(canvasId=${manager.canvasId})`);
        }
        this.drawList.contextGain(manager);
    }

    /**
     * @method contextLost
     * @param canvasId {number}
     * @return {void}
     */
    contextLost(canvasId: number): void {
        if (core.verbose) {
            console.log(`${this._type} contextLost(canvasId=${canvasId})`);
        }
        this.drawList.contextLost(canvasId);
    }
}
