import core from '../core';
import Facet from '../core/Facet';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IDrawable from '../core/IDrawable';
import IDrawList from '../scene/IDrawList';
import IUnknownArray from '../collections/IUnknownArray';
import IGraphicsBuffers from '../core/IGraphicsBuffers';
import IGraphicsProgram from '../core/IGraphicsProgram';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import Shareable from '../utils/Shareable';

/**
 * @class Scene
 * @extends Shareable
 */
export default class Scene extends Shareable implements IDrawList {

    private _drawables: IUnknownArray<IDrawable>;
    private _monitor: IContextMonitor;

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
    constructor() {
        super('Scene')
        this._drawables = new IUnknownArray<IDrawable>()
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        if (this._monitor) {
            console.warn(`${this._type}.destructor but still using monitor!`)
        }
        this._drawables.release()
        super.destructor()
    }

    public attachTo(monitor: IContextMonitor) {
        monitor.addRef()
        monitor.addContextListener(this)
        this._monitor = monitor;
    }

    public detachFrom(unused: IContextMonitor) {
        if (this._monitor) {
            this._monitor.removeContextListener(this)
            this._monitor.release()
            this._monitor = void 0;
        }
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
        this._drawables.push(drawable)
    }

    /**
     * @method containsDrawable
     * @param drawable {IDrawable}
     * @return {boolean}
     */
    containsDrawable(drawable: IDrawable): boolean {
        mustBeObject('drawable', drawable);
        return this._drawables.indexOf(drawable) >= 0
    }

    /**
     * <p>
     * Traverses the collection of drawables, drawing each one.
     * </p>
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
     * @beta
     */
    draw(ambients: Facet[]): void {

        for (let i = 0; i < this._drawables.length; i++) {

            const drawable = this._drawables.getWeakRef(i);

            const graphicsProgram: IGraphicsProgram = drawable.graphicsProgram

            graphicsProgram.use()

            if (ambients) {
                const aLength = ambients.length;
                for (let a = 0; a < aLength; a++) {
                    const ambient = ambients[a]
                    ambient.setUniforms(graphicsProgram);
                }
            }

            drawable.setUniforms();

            const buffers: IGraphicsBuffers = drawable.graphicsBuffers;
            buffers.draw(graphicsProgram)
            buffers.release()

            graphicsProgram.release()
        }
    }

    /**
     * @method findOne
     * @param match {(drawable: IDrawable) => boolean}
     * @return {IDrawable}
     */
    findOne(match: (drawable: IDrawable) => boolean): IDrawable {
        mustBeFunction('match', match);
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

    /**
     * @method getDrawableByName
     * @param name {string}
     * @return {IDrawable}
     */
    getDrawableByName(name: string): IDrawable {
        if (!core.fastPath) {
            mustBeString('name', name);
        }
        return this.findOne(function(drawable) { return drawable.name === name; });
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
        const result = new IUnknownArray<IDrawable>()
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
        throw new Error("TODO")
    }

    contextFree(manager: IContextProvider): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            drawable.contextFree(manager);
        }
    }

    contextGain(manager: IContextProvider): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            drawable.contextGain(manager);
        }
    }

    contextLost(): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            drawable.contextLost();
        }
    }
}
