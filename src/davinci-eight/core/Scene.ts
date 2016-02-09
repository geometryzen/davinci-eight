import Facet from '../core/Facet';
import IContextProvider from '../core/IContextProvider';
import Mesh from './Mesh';
import IDrawList from './IDrawList';
import IUnknownArray from '../collections/IUnknownArray';
import mustBeObject from '../checks/mustBeObject';
import PrimitiveBuffer from './PrimitiveBuffer';
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
    private _buffer: PrimitiveBuffer;

    /**
     * Keep track of the 'parent' mesh.
     */
    private _mesh: Mesh;

    /**
     *
     */
    constructor(buffer: PrimitiveBuffer, mesh: Mesh) {
        super('ScenePart')
        this._buffer = buffer
        this._buffer.addRef()
        this._mesh = mesh
        this._mesh.addRef()
    }

    /**
     *
     */
    protected destructor(): void {
        this._buffer.release()
        this._mesh.release()
        this._buffer = void 0;
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

            this._buffer.draw(material)
            material.release()
        }
    }
}

function partsFromMesh(mesh: Mesh): IUnknownArray<ScenePart> {
    mustBeObject('mesh', mesh)
    const parts = new IUnknownArray<ScenePart>()
    const buffers = mesh.geometry
    const iLen = buffers.length
    for (let i = 0; i < iLen; i++) {
        const scenePart = new ScenePart(buffers.getWeakRef(i), mesh)
        parts.pushWeakRef(scenePart)
    }
    buffers.release()
    return parts
}

/**
 * @class Scene
 * @extends Shareable
 */
export default class Scene extends ShareableContextListener implements IDrawList {

    private _meshes: IUnknownArray<Mesh>;
    private _parts: IUnknownArray<ScenePart>;

    // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
    /**
     * <p>
     * A <code>Scene</code> is a collection of mesh instances arranged in some order.
     * The precise order is implementation defined.
     * The collection may be traversed for general processing using callback/visitor functions.
     * </p>
     * @class Scene
     * @constructor
     * @param [monitors = []] {Array&lt;IContextMonitor&gt;}
     */
    constructor() {
        super('Scene')
        this._meshes = new IUnknownArray<Mesh>()
        this._parts = new IUnknownArray<ScenePart>()
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
     * @param mesh {Mesh}
     * @return {Void}
     * <p>
     * This method returns <code>undefined</code>.
     * </p>
     */
    add(mesh: Mesh): void {
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
     * @param mesh {Mesh}
     * @return {boolean}
     */
    contains(mesh: Mesh): boolean {
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
     * @param match {(mesh: Mesh) => boolean}
     * @return {IUnknownArray}
     */
    find(match: (mesh: Mesh) => boolean): IUnknownArray<Mesh> {
        return this._meshes.find(match)
    }

    /**
     * @method findOne
     * @param match {(mesh: Mesh) => boolean}
     * @return {Mesh}
     */
    findOne(match: (mesh: Mesh) => boolean): Mesh {
        return this._meshes.findOne(match)
    }

    /**
     * @method findOneByName
     * @param name {string}
     * @return {Mesh}
     */
    findOneByName(name: string): Mesh {
        return this.findOne(function(mesh) { return mesh.name === name })
    }

    /**
     * @method findByName
     * @param name {string}
     * @return {IUnknownArray}
     */
    findByName(name: string): IUnknownArray<Mesh> {
        return this.find(function(mesh) { return mesh.name === name })
    }

    /**
     * <p>
     * Removes the <code>mesh</code> from this <code>Scene</code>.
     * </p>
     *
     * @method remove
     * @param mesh {Mesh}
     * @return {void}
     */
    remove(mesh: Mesh): void {
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
