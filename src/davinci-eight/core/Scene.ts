import Facet from '../core/Facet';
import ContextProvider from '../core/ContextProvider';
import AbstractDrawable from './AbstractDrawable';
import ShareableArray from '../collections/ShareableArray';
import incLevel from '../base/incLevel'
import mustBeObject from '../checks/mustBeObject';
import Geometry from './Geometry';
import ShareableBase from '../core/ShareableBase';
import ShareableContextConsumer from '../core/ShareableContextConsumer';
import Engine from './Engine';

/**
 * @module EIGHT
 * @submodule core
 */

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
   * Keep track of the 'parent' mesh.
   */
  private _mesh: AbstractDrawable;

  /**
   *
   */
  constructor(geometry: Geometry, mesh: AbstractDrawable, level: number) {
    super('ScenePart', incLevel(level))
    this._geometry = geometry
    this._geometry.addRef()
    this._mesh = mesh
    this._mesh.addRef()
  }

  /**
   *
   */
  protected destructor(level: number): void {
    this._geometry.release()
    this._mesh.release()
    this._geometry = void 0;
    this._mesh = void 0
    super.destructor(incLevel(level))
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

function partsFromMesh(mesh: AbstractDrawable): ShareableArray<ScenePart> {
  mustBeObject('mesh', mesh)
  const parts = new ShareableArray<ScenePart>([], 0)
  const geometry = mesh.geometry
  if (geometry.isLeaf()) {
    const scenePart = new ScenePart(geometry, mesh, 0)
    parts.pushWeakRef(scenePart)
  }
  else {
    const iLen = geometry.partsLength
    for (let i = 0; i < iLen; i++) {
      const geometryPart = geometry.getPart(i)
      // FIXME: This needs to go down to the leaves.
      const scenePart = new ScenePart(geometryPart, mesh, 0)
      geometryPart.release()
      parts.pushWeakRef(scenePart)
    }
  }
  geometry.release()
  return parts
}

/**
 * @class Scene
 * @extends ShareableBase
 */
export default class Scene extends ShareableContextConsumer {

  private _drawables: ShareableArray<AbstractDrawable>;
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
   * @param engine {Engine}
   * @param [level = 0]
   */
  constructor(engine: Engine, level = 0) {
    super('Scene', engine, incLevel(level))
    mustBeObject('engine', engine)
    this._drawables = new ShareableArray<AbstractDrawable>([], 0)
    this._parts = new ShareableArray<ScenePart>([], 0)
    this.synchUp()
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    this.cleanUp()
    this._drawables.release()
    this._parts.release()
    super.destructor(incLevel(level))
  }

  /**
   * <p>
   * Adds the <code>mesh</code> to this <code>Scene</code>.
   * </p>
   * @method add
   * @param mesh {AbstractDrawable}
   * @return {Void}
   * <p>
   * This method returns <code>undefined</code>.
   * </p>
   */
  add(mesh: AbstractDrawable): void {
    mustBeObject('mesh', mesh)
    this._drawables.push(mesh)

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
   * @param mesh {AbstractDrawable}
   * @return {boolean}
   */
  contains(mesh: AbstractDrawable): boolean {
    mustBeObject('mesh', mesh)
    return this._drawables.indexOf(mesh) >= 0
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
   * @param match {(mesh: AbstractDrawable) => boolean}
   * @return {ShareableArray}
   */
  find(match: (mesh: AbstractDrawable) => boolean): ShareableArray<AbstractDrawable> {
    return this._drawables.find(match)
  }

  /**
   * @method findOne
   * @param match {(mesh: AbstractDrawable) => boolean}
   * @return {AbstractDrawable}
   */
  findOne(match: (mesh: AbstractDrawable) => boolean): AbstractDrawable {
    return this._drawables.findOne(match)
  }

  /**
   * @method findOneByName
   * @param name {string}
   * @return {AbstractDrawable}
   */
  findOneByName(name: string): AbstractDrawable {
    return this.findOne(function(mesh) { return mesh.name === name })
  }

  /**
   * @method findByName
   * @param name {string}
   * @return {ShareableArray}
   */
  findByName(name: string): ShareableArray<AbstractDrawable> {
    return this.find(function(mesh) { return mesh.name === name })
  }

  /**
   * <p>
   * Removes the <code>mesh</code> from this <code>Scene</code>.
   * </p>
   *
   * @method remove
   * @param drawable {AbstractDrawable}
   * @return {void}
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
   * @method contextFree
   * @param context {ContextProvider}
   * @return {void}
   */
  contextFree(context: ContextProvider): void {
    for (let i = 0; i < this._drawables.length; i++) {
      const mesh = this._drawables.getWeakRef(i)
      mesh.contextFree(context)
    }
    super.contextFree(context)
  }

  /**
   * @method contextGain
   * @param context {ContextProvider}
   * @return {void}
   */
  contextGain(context: ContextProvider): void {
    for (let i = 0; i < this._drawables.length; i++) {
      const mesh = this._drawables.getWeakRef(i)
      mesh.contextGain(context)
    }
    super.contextGain(context)
  }

  /**
   * @method contextLost
   * @return {void}
   */
  contextLost(): void {
    for (let i = 0; i < this._drawables.length; i++) {
      const mesh = this._drawables.getWeakRef(i)
      mesh.contextLost()
    }
    super.contextLost()
  }
}
