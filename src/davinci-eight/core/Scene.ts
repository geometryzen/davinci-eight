import {Facet} from '../core/Facet';
import ContextProvider from '../core/ContextProvider';
import {AbstractDrawable} from './AbstractDrawable';
import ShareableArray from '../collections/ShareableArray';
import incLevel from '../base/incLevel'
import mustBeObject from '../checks/mustBeObject';
import {Geometry} from './Geometry';
import {ShareableBase} from '../core/ShareableBase';
import {ShareableContextConsumer} from '../core/ShareableContextConsumer';
import {Engine} from './Engine';

/**
 * The parts of a scene are the smallest components that
 * are heuristically sorted in order to optimize rendering.
 */
class ScenePart extends ShareableBase {

    /**
     *
     */
    private _geometry: Geometry;

    /**
     * Keep track of the 'parent' drawable.
     */
    private _drawable: AbstractDrawable;

    /**
     *
     */
    constructor(geometry: Geometry, drawable: AbstractDrawable) {
        super()
        this.setLoggingName('ScenePart')
        this._geometry = geometry
        this._geometry.addRef()
        this._drawable = drawable
        this._drawable.addRef()
    }

    /**
     *
     */
    protected destructor(level: number): void {
        this._geometry.release()
        this._drawable.release()
        this._geometry = void 0;
        this._drawable = void 0
        super.destructor(incLevel(level))
    }

    /**
     *
     */
    draw(ambients: Facet[]) {
        if (this._drawable.visible) {
            const material = this._drawable.material

            material.use()

            if (ambients) {
                const aLength = ambients.length
                for (let a = 0; a < aLength; a++) {
                    const ambient = ambients[a]
                    ambient.setUniforms(material)
                }
            }

            this._drawable.setUniforms();

            this._geometry.bind(material);
            this._geometry.draw(material);
            this._geometry.unbind(material);

            material.release()
        }
    }
}

function partsFromMesh(drawable: AbstractDrawable): ShareableArray<ScenePart> {
    mustBeObject('drawable', drawable)
    const parts = new ShareableArray<ScenePart>([])
    const geometry = drawable.geometry
    if (geometry.isLeaf()) {
        const scenePart = new ScenePart(geometry, drawable)
        parts.pushWeakRef(scenePart)
    }
    else {
        const iLen = geometry.partsLength
        for (let i = 0; i < iLen; i++) {
            const geometryPart = geometry.getPart(i)
            // FIXME: This needs to go down to the leaves.
            const scenePart = new ScenePart(geometryPart, drawable)
            geometryPart.release()
            parts.pushWeakRef(scenePart)
        }
    }
    geometry.release()
    return parts
}

/**
 * A collection of drawable objects.
 */
export class Scene extends ShareableContextConsumer {

    private _drawables: ShareableArray<AbstractDrawable>;
    private _parts: ShareableArray<ScenePart>;

    /**
     * @param engine
     */
    constructor(engine: Engine, levelUp = 0) {
        super(engine);
        this.setLoggingName('Scene');
        mustBeObject('engine', engine);
        this._drawables = new ShareableArray<AbstractDrawable>([]);
        this._parts = new ShareableArray<ScenePart>([]);
        if (levelUp === 0) {
            this.synchUp()
        }
    }

    /**
     * @param levelUp
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this._drawables.release();
        this._parts.release();
        super.destructor(levelUp + 1);
    }

    /**
     * <p>
     * Adds the <code>drawable</code> to this <code>Scene</code>.
     * </p>
     *
     * @param drawable
     */
    add(drawable: AbstractDrawable): void {
        mustBeObject('drawable', drawable)
        this._drawables.push(drawable)

        // TODO: Control the ordering for optimization.
        const drawParts = partsFromMesh(drawable)
        const iLen = drawParts.length;
        for (let i = 0; i < iLen; i++) {
            const part = drawParts.get(i)
            this._parts.push(part)
            part.release()
        }
        drawParts.release()

        this.synchUp()
    }

    /**
     * @param drawable
     * @returns `true` if the drawable is contained in this scene, otherwise `false`.
     */
    contains(drawable: AbstractDrawable): boolean {
        mustBeObject('drawable', drawable)
        return this._drawables.indexOf(drawable) >= 0
    }

    /**
     * <p>
     * Traverses the collection of scene parts drawing each one.
     * </p>
     *
     * @param ambients
     */
    draw(ambients: Facet[]): void {
        const parts = this._parts
        const iLen = parts.length
        for (let i = 0; i < iLen; i++) {
            parts.getWeakRef(i).draw(ambients)
        }
    }

    /**
     * @param match
     */
    find(match: (drawable: AbstractDrawable) => boolean): ShareableArray<AbstractDrawable> {
        return this._drawables.find(match)
    }

    /**
     * @param match
     */
    findOne(match: (drawable: AbstractDrawable) => boolean): AbstractDrawable {
        return this._drawables.findOne(match)
    }

    /**
     * @param name
     */
    findOneByName(name: string): AbstractDrawable {
        return this.findOne(function(drawable) { return drawable.name === name })
    }

    /**
     * @param name
     */
    findByName(name: string): ShareableArray<AbstractDrawable> {
        return this.find(function(drawable) { return drawable.name === name })
    }

    /**
     * <p>
     * Removes the <code>drawable</code> from this <code>Scene</code>.
     * </p>
     *
     * @param drawable
     */
    remove(drawable: AbstractDrawable): void {
        // TODO: Remove the appropriate parts from the scene.
        mustBeObject('drawable', drawable)
        const index = this._drawables.indexOf(drawable)
        if (index >= 0) {
            this._drawables.splice(index, 1).release()
        }
    }

    /**
     * @param context
     */
    contextFree(context: ContextProvider): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i)
            drawable.contextFree(context)
        }
        super.contextFree(context)
    }

    /**
     * @param context
     */
    contextGain(context: ContextProvider): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i)
            drawable.contextGain(context)
        }
        super.contextGain(context)
    }

    /**
     *
     */
    contextLost(): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i)
            drawable.contextLost()
        }
        super.contextLost()
    }
}
