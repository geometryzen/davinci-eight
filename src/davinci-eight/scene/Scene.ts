import core from '../core';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import createDrawList from '../scene/createDrawList';
import IDrawable from '../core/IDrawable';
import IDrawList from '../scene/IDrawList';
import IUnknownArray from '../collections/IUnknownArray';
import IGraphicsProgram from '../core/IGraphicsProgram';
import MonitorList from '../scene/MonitorList';
import mustBeArray from '../checks/mustBeArray';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
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
        mustBeArray('monitors', monitors);
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
        mustBeObject('drawable', drawable);
        return this.drawList.add(drawable);
    }

    /**
     * @method containsDrawable
     * @param drawable {IDrawable}
     * @return {boolean}
     */
    containsDrawable(drawable: IDrawable): boolean {
        mustBeObject('drawable', drawable);
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
        if (!core.fastPath) {
            mustBeArray('ambients', ambients);
            mustBeNumber('canvasId', canvasId);
        }
        return this.drawList.draw(ambients, canvasId);
    }

    /**
     * @method findOne
     * @param match {(drawable: IDrawable) => boolean}
     * @return {IDrawable}
     */
    findOne(match: (drawable: IDrawable) => boolean): IDrawable {
        mustBeFunction('match', match);
        return this.drawList.findOne(match);
    }

    /**
     * @method getDrawableByName
     * @param name {string}
     * @return {IDrawable}
     */
    getDrawableByName(name: string): IDrawable {
        if (!core.fastPath) {
            mustBeString('name', name);
        }
        return this.drawList.getDrawableByName(name);
    }

    /**
     * Gets a collection of drawable elements by name.
     *
     * @method getDrawablesByName
     * @param name {string}
     * @rerurn {IUnknownArray}
     */
    getDrawablesByName(name: string): IUnknownArray<IDrawable> {
        mustBeString('name', name);
        return this.drawList.getDrawablesByName(name);
    }

    /**
     * <p>
     * Removes the <code>drawable</code> from this <code>Scene</code>.
     * </p>
     *
     * @method remove
     * @param drawable {IDrawable}
     * @return {void}
     * <p>
     * This method returns <code>undefined</code>.
     * </p>
     */
    remove(drawable: IDrawable): void {
        mustBeObject('drawable', drawable);
        return this.drawList.remove(drawable);
    }

    /**
     * <p>
     * Traverses the collection of drawables, calling the specified callback arguments.
     * </p>
     *
     * @method traverse
     * @param callback {(drawable: IDrawable) => void} Callback function for each drawable.
     * @param canvasId {number} Identifies the canvas.
     * @param prolog {(material: IGraphicsProgram) => void} Callback function for each material. 
     * @return {void}
     */
    traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (material: IGraphicsProgram) => void): void {
        mustBeFunction('callback', callback);
        mustBeNumber('canvasId', canvasId);
        this.drawList.traverse(callback, canvasId, prolog);
    }

    /**
     * @method contextFree
     * @param canvasId {number}
     * @return {void}
     */
    contextFree(canvasId: number): void {
        mustBeNumber('canvasId', canvasId);
        this.drawList.contextFree(canvasId);
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        mustBeObject('manager', manager);
        this.drawList.contextGain(manager);
    }

    /**
     * @method contextLost
     * @param canvasId {number}
     * @return {void}
     */
    contextLost(canvasId: number): void {
        mustBeNumber('canvasId', canvasId);
        this.drawList.contextLost(canvasId);
    }
}
