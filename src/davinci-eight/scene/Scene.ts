import core from '../core';
import Facet from '../core/Facet';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IDrawable from '../core/IDrawable';
import IDrawList from '../scene/IDrawList';
import IUnknownArray from '../collections/IUnknownArray';
import IGraphicsBuffers from '../core/IGraphicsBuffers';
import IGraphicsProgram from '../core/IGraphicsProgram';
import MonitorList from '../scene/MonitorList';
import mustBeArray from '../checks/mustBeArray';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import NumberIUnknownMap from '../collections/NumberIUnknownMap';
import Shareable from '../utils/Shareable';
import StringIUnknownMap from '../collections/StringIUnknownMap';

const LOGGING_NAME = 'Scene';

function ctorContext(): string {
    return LOGGING_NAME + " constructor";
}

/**
 * A grouping of IDrawable, by IGraphicsProgram.
 */
class DrawableGroup extends Shareable {
    private _program: IGraphicsProgram;
    private _drawables: IUnknownArray<IDrawable>;
    constructor(program: IGraphicsProgram) {
        super('DrawableGroup');
        this._program = program;
        this._program.addRef();
        this._drawables = new IUnknownArray<IDrawable>();
    }
    protected destructor(): void {
        this._program.release();
        this._drawables.release();
        super.destructor();
    }
    /**
     * accept provides a way to push out the IGraphicsProgram without bumping the reference count.
     */
    acceptProgram(visitor: (program: IGraphicsProgram) => void) {
        visitor(this._program);
    }
    get length() {
        return this._drawables.length;
    }
    containsDrawable(drawable: IDrawable) {
        return this._drawables.indexOf(drawable) >= 0;
    }
    push(drawable: IDrawable) {
        this._drawables.push(drawable);
    }
    remove(drawable: IDrawable): void {
        let drawables = this._drawables
        let index = drawables.indexOf(drawable)
        if (index >= 0) {
            // We don't actually need the returned element so release it.
            drawables.splice(index, 1).release()
        }
    }

    /**
     * In order to be able to optimize the drawing of a single frame,
     * we take over the process from the drawable objects themselves.
     */
    draw(ambients: Facet[], canvasId: number): void {

        const graphicsProgram = this._program

        graphicsProgram.use(canvasId)

        if (ambients) {
            const aLength = ambients.length;
            for (let a = 0; a < aLength; a++) {
                const ambient = ambients[a]
                ambient.setUniforms(graphicsProgram, canvasId);
            }
        }

        const drawables = this._drawables
        const iLength = drawables.length;
        for (let i = 0; i < iLength; i++) {
            const drawable = drawables.getWeakRef(i)

            drawable.setUniforms(canvasId);

            const buffers: IGraphicsBuffers = drawable.graphicsBuffers;
            /// FIXME: Break out this method call?
            buffers.draw(graphicsProgram, canvasId)
            buffers.release()
        }
    }

    findOne(match: (drawable: IDrawable) => boolean): IDrawable {
        const drawables = this._drawables;
        for (let i = 0, iLength = drawables.length; i < iLength; i++) {
            const candidate = drawables.get(i);
            if (match(candidate)) {
                return candidate;
            }
            else {
                candidate.release();
            }
        }
        return void 0;
    }
    traverseDrawables(callback: (drawable: IDrawable) => void) {
        this._drawables.forEach(callback);
    }
}

/**
 * Should look like a set of IDrawable Groups. Maybe like a Scene!
 */
class DrawableGroups extends Shareable {
    /**
     * Mapping from programId to DrawableGroup ~ (IGraphicsProgram, IDrawable[])
     */
    private _groups = new StringIUnknownMap<DrawableGroup>();
    constructor() {
        super('DrawableGroups')
    }
    protected destructor(): void {
        this._groups.release()
        super.destructor()
    }
    add(drawable: IDrawable) {
        // Now let's see if we can get a program...
        const program: IGraphicsProgram = drawable.graphicsProgram;
        if (program) {
            try {
                let programId: string = program.uuid
                let group = this._groups.get(programId)
                if (!group) {
                    group = new DrawableGroup(program)
                    this._groups.put(programId, group)
                }
                if (!group.containsDrawable(drawable)) {
                    group.push(drawable)
                }
                group.release()
            }
            finally {
                program.release()
            }
        }
        else {
            // Thing won't actually be kept in list of drawables because
            // it does not have a program. Do we need to track it elsewhere?
        }
    }
    containsDrawable(drawable: IDrawable): boolean {
        const graphicsProgram = drawable.graphicsProgram;
        if (graphicsProgram) {
            try {
                var group = this._groups.getWeakRef(graphicsProgram.uuid)
                if (group) {
                    return group.containsDrawable(drawable)
                }
                else {
                    return false
                }
            }
            finally {
                graphicsProgram.release()
            }
        }
        else {
            return false
        }
    }
    findOne(match: (drawable: IDrawable) => boolean): IDrawable {
        const groupIds = this._groups.keys;
        for (let i = 0, iLength = groupIds.length; i < iLength; i++) {
            const groupId = groupIds[i];
            const group = this._groups.getWeakRef(groupId);
            const found = group.findOne(match);
            if (found) {
                return found;
            }
        }
        return void 0;
    }
    remove(drawable: IDrawable) {
        const material: IGraphicsProgram = drawable.graphicsProgram;
        if (material) {
            try {
                let programId: string = material.uuid
                if (this._groups.exists(programId)) {
                    let group: DrawableGroup = this._groups.get(programId)
                    try {
                        group.remove(drawable);
                        if (group.length === 0) {
                            this._groups.remove(programId).release()
                        }
                    }
                    finally {
                        group.release()
                    }
                }
                else {
                    // Do nothing.
                }
            }
            finally {
                material.release()
            }
        }
    }
    draw(ambients: Facet[], canvasId: number) {
        const drawGroups: StringIUnknownMap<DrawableGroup> = this._groups;
        const materialKeys = drawGroups.keys;
        const materialsLength = materialKeys.length;
        for (let i = 0; i < materialsLength; i++) {
            const materialKey = materialKeys[i];
            const drawGroup = drawGroups.getWeakRef(materialKey);
            drawGroup.draw(ambients, canvasId);
        }
    }
    // FIXME: Rename to traverse
    traverseDrawables(callback: (drawable: IDrawable) => void, callback2: (program: IGraphicsProgram) => void) {
        this._groups.forEach(function(groupId, group) {
            group.acceptProgram(callback2);
            group.traverseDrawables(callback);
        });
    }
    traversePrograms(callback: (program: IGraphicsProgram) => void) {
        this._groups.forEach(function(groupId, group) {
            group.acceptProgram(callback);
        });
    }
}

/**
 * @class Scene
 * @extends Shareable
 */
export default class Scene extends Shareable implements IDrawList {

    private _drawableGroups = new DrawableGroups();
    private _canvasIdToManager = new NumberIUnknownMap<IContextProvider>();
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
        this._canvasIdToManager.release();
        this._drawableGroups.release();
        super.destructor();
    }

    public attachTo(monitor: IContextMonitor) {
        this.monitors.add(monitor);
        monitor.addContextListener(this);
    }

    public detachFrom(monitor: IContextMonitor) {
        monitor.removeContextListener(this);
        this.monitors.remove(monitor);
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
        // If we have canvasIdToManager provide them to the drawable before asking for the program.
        // FIXME: Do we have to be careful about whether the manager has a context?
        this._canvasIdToManager.forEach(function(id, manager) {
            drawable.contextGain(manager)
        });
        this._drawableGroups.add(drawable)
    }

    /**
     * @method containsDrawable
     * @param drawable {IDrawable}
     * @return {boolean}
     */
    containsDrawable(drawable: IDrawable): boolean {
        mustBeObject('drawable', drawable);
        return this._drawableGroups.containsDrawable(drawable)
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
    draw(ambients: Facet[], canvasId: number): void {
        if (!core.fastPath) {
            mustBeArray('ambients', ambients);
            mustBeNumber('canvasId', canvasId);
        }
        this._drawableGroups.draw(ambients, canvasId)
    }

    /**
     * @method findOne
     * @param match {(drawable: IDrawable) => boolean}
     * @return {IDrawable}
     */
    findOne(match: (drawable: IDrawable) => boolean): IDrawable {
        mustBeFunction('match', match);
        return this._drawableGroups.findOne(match);
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
        return this._drawableGroups.findOne(function(drawable) { return drawable.name === name; });
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
        var result = new IUnknownArray<IDrawable>()
        this._drawableGroups.traverseDrawables(
            function(candidate: IDrawable) {
                if (candidate.name === name) {
                    result.push(candidate)
                }
            },
            function(program: IGraphicsProgram) {
                // Do nothing.
            }
        )
        return result;
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
        this._drawableGroups.remove(drawable);
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
        // FIXME: canvasId is not used.
        this._drawableGroups.traverseDrawables(callback, prolog);
    }

    /**
     * @method contextFree
     * @param canvasId {number}
     * @return {void}
     */
    contextFree(canvasId: number): void {
        mustBeNumber('canvasId', canvasId);
        this._drawableGroups.traverseDrawables(
            function(drawable) {
                drawable.contextFree(canvasId)
            },
            function(program) {
                program.contextFree(canvasId)
            }
        )
        this._canvasIdToManager.remove(canvasId);
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        mustBeObject('manager', manager);
        if (!this._canvasIdToManager.exists(manager.canvasId)) {
            // Cache the manager.
            this._canvasIdToManager.put(manager.canvasId, manager)
            // Broadcast to drawables and materials.
            this._drawableGroups.traverseDrawables(
                function(drawable) {
                    drawable.contextGain(manager)
                },
                function(material) {
                    material.contextGain(manager)
                }
            )
        }
    }

    /**
     * @method contextLost
     * @param canvasId {number}
     * @return {void}
     */
    contextLost(canvasId: number): void {
        mustBeNumber('canvasId', canvasId);
        if (this._canvasIdToManager.exists(canvasId)) {
            this._drawableGroups.traverseDrawables(
                function(drawable) {
                    drawable.contextLost(canvasId)
                },
                function(material) {
                    material.contextLost(canvasId)
                }
            )
            this._canvasIdToManager.remove(canvasId)
        }
    }
}
