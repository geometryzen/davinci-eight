import core from '../core';
import Facet from '../core/Facet';
import IContextProvider from '../core/IContextProvider';
import Composite from './Composite';
import IDrawList from './IDrawList';
import IUnknownArray from '../collections/IUnknownArray';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import PrimitiveBuffer from './PrimitiveBuffer';
import Shareable from '../core/Shareable';
import ShareableContextListener from '../core/ShareableContextListener';

/**
 * The parts of a scene are the smallest components that
 * are heuristically sorted in order to optimize rendering.
 */
class ScenePart extends Shareable {
    private _buffer: PrimitiveBuffer;

    /**
     * Keep track of the 'parent' composite.
     */
    private _composite: Composite;

    /**
     *
     */
    constructor(buffer: PrimitiveBuffer, composite: Composite) {
        super('ScenePart')
        this._buffer = buffer
        this._buffer.addRef()
        this._composite = composite
        this._composite.addRef()
    }
    protected destructor(): void {
        this._buffer.release()
        this._composite.release()
        this._buffer = void 0;
        this._composite = void 0
        super.destructor()
    }

    draw(ambients: Facet[]) {

        const program = this._composite.program;

        program.use()

        if (ambients) {
            const aLength = ambients.length;
            for (let a = 0; a < aLength; a++) {
                const ambient = ambients[a]
                ambient.setUniforms(program);
            }
        }

        this._composite.setUniforms();

        this._buffer.draw(program)
        program.release()

    }
}

function partsFromComposite(composite: Composite): IUnknownArray<ScenePart> {
    mustBeObject('composite', composite)
    const parts = new IUnknownArray<ScenePart>();
    const buffers = composite.buffers
    const iLen = buffers.length
    for (let i = 0; i < iLen; i++) {
        const scenePart = new ScenePart(buffers.getWeakRef(i), composite)
        parts.pushWeakRef(scenePart)
    }
    buffers.release();
    return parts;
}

/**
 * @class Scene
 * @extends Shareable
 */
export default class Scene extends ShareableContextListener implements IDrawList {

    private _composites: IUnknownArray<Composite>;
    private _parts: IUnknownArray<ScenePart>;

    // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
    /**
     * <p>
     * A <code>Scene</code> is a collection of composite instances arranged in some order.
     * The precise order is implementation defined.
     * The collection may be traversed for general processing using callback/visitor functions.
     * </p>
     * @class Scene
     * @constructor
     * @param [monitors = []] {Array&lt;IContextMonitor&gt;}
     */
    constructor() {
        super('Scene')
        this._composites = new IUnknownArray<Composite>()
        this._parts = new IUnknownArray<ScenePart>()
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.detachFromMonitor()
        this._composites.release()
        this._parts.release()
        super.destructor()
    }

    /**
     * <p>
     * Adds the <code>composite</code> to this <code>Scene</code>.
     * </p>
     * @method add
     * @param composite {Composite}
     * @return {Void}
     * <p>
     * This method returns <code>undefined</code>.
     * </p>
     */
    add(composite: Composite): void {
        mustBeObject('composite', composite);
        this._composites.push(composite)

        // TODO: Control the ordering for optimization.
        const drawParts = partsFromComposite(composite)
        const iLen = drawParts.length;
        for (let i = 0; i < iLen; i++) {
            const part = drawParts.get(i)
            this._parts.push(part)
            part.release()
        }
        drawParts.release();
    }

    /**
     * @method containsDrawable
     * @param composite {Composite}
     * @return {boolean}
     */
    containsDrawable(composite: Composite): boolean {
        mustBeObject('composite', composite);
        return this._composites.indexOf(composite) >= 0
    }

    /**
     * <p>
     * Traverses the collection of scene parts drawing each one.
     * </p>
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
     * @beta
     */
    draw(ambients: Facet[]): void {
        const parts = this._parts;
        const iLen = parts.length;
        for (let i = 0; i < iLen; i++) {
            parts.getWeakRef(i).draw(ambients)
        }
    }

    /**
     * @method findOne
     * @param match {(composite: Composite) => boolean}
     * @return {Composite}
     */
    findOne(match: (composite: Composite) => boolean): Composite {
        mustBeFunction('match', match);
        return this._composites.findOne(match)
    }

    /**
     * @method getDrawableByName
     * @param name {string}
     * @return {Composite}
     */
    getDrawableByName(name: string): Composite {
        if (!core.fastPath) {
            mustBeString('name', name);
        }
        return this.findOne(function(composite) { return composite.name === name; });
    }

    /**
     * Gets a collection of composite elements by name.
     *
     * @method getDrawablesByName
     * @param name {string}
     * @rerurn {IUnknownArray}
     */
    getDrawablesByName(name: string): IUnknownArray<Composite> {
        mustBeString('name', name);
        const result = new IUnknownArray<Composite>()
        return result;
    }

    /**
     * <p>
     * Removes the <code>composite</code> from this <code>Scene</code>.
     * </p>
     *
     * @method remove
     * @param composite {Composite}
     * @return {void}
     * <p>
     * This method returns <code>undefined</code>.
     * </p>
     */
    remove(composite: Composite): void {
        mustBeObject('composite', composite);
        throw new Error("TODO")
    }

    contextFree(context: IContextProvider): void {
        for (let i = 0; i < this._composites.length; i++) {
            const composite = this._composites.getWeakRef(i);
            composite.contextFree(context);
        }
        super.contextFree(context)
    }

    contextGain(context: IContextProvider): void {
        for (let i = 0; i < this._composites.length; i++) {
            const composite = this._composites.getWeakRef(i);
            composite.contextGain(context);
        }
        super.contextGain(context)
    }

    contextLost(): void {
        for (let i = 0; i < this._composites.length; i++) {
            const composite = this._composites.getWeakRef(i);
            composite.contextLost();
        }
        super.contextLost()
    }
}
