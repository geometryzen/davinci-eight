import Facet from '../core/Facet';
import IContextProvider from '../core/IContextProvider';
import IDrawable from './IDrawable';
import ShareableArray from '../collections/ShareableArray';
import mustBeObject from '../checks/mustBeObject';
import Geometry from './Geometry';
import Shareable from '../core/Shareable';
import ShareableContextListener from '../core/ShareableContextListener';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * The parts of a scene are the smallest components that
 * are heuristically sorted in order to optimize rendering.
 */
class ScenePart extends Shareable {

    /**
     *
     */
    private _geometry: Geometry;

    /**
     * Keep track of the 'parent' mesh.
     */
    private _mesh: IDrawable;

    /**
     *
     */
    constructor(geometry: Geometry, mesh: IDrawable) {
        super('ScenePart')
        this._geometry = geometry
        this._geometry.addRef()
        this._mesh = mesh
        this._mesh.addRef()
    }

    /**
     *
     */
    protected destructor(): void {
        this._geometry.release()
        this._mesh.release()
        this._geometry = void 0;
        this._mesh = void 0
        super.destructor()
    }

    /**
     *
     */
    draw(ambients: Facet[]) {
        if (this._mesh.visible) {
            const material = this._mesh.material

            material.use()

            if (ambients) {
                const aLength = ambients.length
                for (let a = 0; a < aLength; a++) {
                    const ambient = ambients[a]
                    ambient.setUniforms(material)
                }
            }

            this._mesh.setUniforms();

            this._geometry.draw(material)
            material.release()
        }
    }
}

function partsFromMesh(mesh: IDrawable): ShareableArray<ScenePart> {
    mustBeObject('mesh', mesh)
    const parts = new ShareableArray<ScenePart>()
    const geometry = mesh.geometry
    if (geometry.isLeaf()) {
      const scenePart = new ScenePart(geometry, mesh)
      parts.pushWeakRef(scenePart)
    }
    else {
      const iLen = geometry.partsLength
      for (let i = 0; i < iLen; i++) {
          const geometryPart = geometry.getPart(i)
          // FIXME: This needs to go down to the leaves.
          const scenePart = new ScenePart(geometryPart, mesh)
          geometryPart.release()
          parts.pushWeakRef(scenePart)
      }
    }
    geometry.release()
    return parts
}

/**
 * @class Scene
 * @extends Shareable
 */
export default class Scene extends ShareableContextListener {

    private _meshes: ShareableArray<IDrawable>;
    private _parts: ShareableArray<ScenePart>;

    // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
    /**
     * <p>
     * A <code>Scene</code> is a collection of mesh instances arranged in some order.
     * The precise order is implementation defined.
     * The collection may be traversed for general processing using callback/visitor functions.
     * </p>
     * @class Scene
     * @constructor
     */
    constructor() {
        super('Scene')
        this._meshes = new ShareableArray<IDrawable>()
        this._parts = new ShareableArray<ScenePart>()
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.unsubscribe()
        this._meshes.release()
        this._parts.release()
        super.destructor()
    }

    /**
     * <p>
     * Adds the <code>mesh</code> to this <code>Scene</code>.
     * </p>
     * @method add
     * @param mesh {IDrawable}
     * @return {Void}
     * <p>
     * This method returns <code>undefined</code>.
     * </p>
     */
    add(mesh: IDrawable): void {
        mustBeObject('mesh', mesh)
        this._meshes.push(mesh)

        // TODO: Control the ordering for optimization.
        const drawParts = partsFromMesh(mesh)
        const iLen = drawParts.length;
        for (let i = 0; i < iLen; i++) {
            const part = drawParts.get(i)
            this._parts.push(part)
            part.release()
        }
        drawParts.release()
    }

    /**
     * @method contains
     * @param mesh {IDrawable}
     * @return {boolean}
     */
    contains(mesh: IDrawable): boolean {
        mustBeObject('mesh', mesh)
        return this._meshes.indexOf(mesh) >= 0
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
        const parts = this._parts
        const iLen = parts.length
        for (let i = 0; i < iLen; i++) {
            parts.getWeakRef(i).draw(ambients)
        }
    }

    /**
     * @method find
     * @param match {(mesh: IDrawable) => boolean}
     * @return {ShareableArray}
     */
    find(match: (mesh: IDrawable) => boolean): ShareableArray<IDrawable> {
        return this._meshes.find(match)
    }

    /**
     * @method findOne
     * @param match {(mesh: IDrawable) => boolean}
     * @return {IDrawable}
     */
    findOne(match: (mesh: IDrawable) => boolean): IDrawable {
        return this._meshes.findOne(match)
    }

    /**
     * @method findOneByName
     * @param name {string}
     * @return {IDrawable}
     */
    findOneByName(name: string): IDrawable {
        return this.findOne(function(mesh) { return mesh.name === name })
    }

    /**
     * @method findByName
     * @param name {string}
     * @return {ShareableArray}
     */
    findByName(name: string): ShareableArray<IDrawable> {
        return this.find(function(mesh) { return mesh.name === name })
    }

    /**
     * <p>
     * Removes the <code>mesh</code> from this <code>Scene</code>.
     * </p>
     *
     * @method remove
     * @param mesh {IDrawable}
     * @return {void}
     */
    remove(mesh: IDrawable): void {
        // TODO: Remove the appropriate parts from the scene.
        mustBeObject('mesh', mesh)
        const index = this._meshes.indexOf(mesh)
        if (index >= 0) {
            this._meshes.splice(index, 1).release()
        }
    }

    /**
     * @method contextFree
     * @param context {IContextProvider}
     * @return {void}
     */
    contextFree(context: IContextProvider): void {
        for (let i = 0; i < this._meshes.length; i++) {
            const mesh = this._meshes.getWeakRef(i)
            mesh.contextFree(context)
        }
        super.contextFree(context)
    }

    /**
     * @method contextGain
     * @param context {IContextProvider}
     * @return {void}
     */
    contextGain(context: IContextProvider): void {
        for (let i = 0; i < this._meshes.length; i++) {
            const mesh = this._meshes.getWeakRef(i)
            mesh.contextGain(context)
        }
        super.contextGain(context)
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        for (let i = 0; i < this._meshes.length; i++) {
            const mesh = this._meshes.getWeakRef(i)
            mesh.contextLost()
        }
        super.contextLost()
    }
}
