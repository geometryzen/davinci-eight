import Facet from '../core/Facet';
import ContextProvider from '../core/ContextProvider';
import AbstractDrawable from './AbstractDrawable';
import ShareableArray from '../collections/ShareableArray';
import incLevel from '../base/incLevel'
import mustBeObject from '../checks/mustBeObject';
import Geometry from './Geometry';
import ShareableBase from '../core/ShareableBase';
import ShareableContextConsumer from '../core/ShareableContextConsumer';
import {Engine} from './Engine';

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

      this._geometry.draw(material)
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
 * @class Scene
 * @extends ShareableBase
 */
export class Scene extends ShareableContextConsumer {

  private _drawables: ShareableArray<AbstractDrawable>;
  private _parts: ShareableArray<ScenePart>;

  // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
  /**
   * <p>
   * A <code>Scene</code> is a collection of drawable instances arranged in some order.
   * The precise order is implementation defined.
   * The collection may be traversed for general processing using callback/visitor functions.
   * </p>
   *
   * @class Scene
   * @constructor
   * @param engine {Engine}
   */
  constructor(engine: Engine) {
    super(engine)
    this.setLoggingName('Scene')
    mustBeObject('engine', engine)
    this._drawables = new ShareableArray<AbstractDrawable>([])
    this._parts = new ShareableArray<ScenePart>([])
    this.synchUp()
  }

  /**
   * @method destructor
   * @param levelUp {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    this.cleanUp()
    this._drawables.release()
    this._parts.release()
    super.destructor(levelUp + 1)
  }

  /**
   * <p>
   * Adds the <code>drawable</code> to this <code>Scene</code>.
   * </p>
   * @method add
   * @param drawable {AbstractDrawable}
   * @return {Void}
   * <p>
   * This method returns <code>undefined</code>.
   * </p>
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
   * @method contains
   * @param drawable {AbstractDrawable}
   * @return {boolean}
   */
  contains(drawable: AbstractDrawable): boolean {
    mustBeObject('drawable', drawable)
    return this._drawables.indexOf(drawable) >= 0
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
   * @param match {(drawable: AbstractDrawable) => boolean}
   * @return {ShareableArray}
   */
  find(match: (drawable: AbstractDrawable) => boolean): ShareableArray<AbstractDrawable> {
    return this._drawables.find(match)
  }

  /**
   * @method findOne
   * @param match {(drawable: AbstractDrawable) => boolean}
   * @return {AbstractDrawable}
   */
  findOne(match: (drawable: AbstractDrawable) => boolean): AbstractDrawable {
    return this._drawables.findOne(match)
  }

  /**
   * @method findOneByName
   * @param name {string}
   * @return {AbstractDrawable}
   */
  findOneByName(name: string): AbstractDrawable {
    return this.findOne(function(drawable) { return drawable.name === name })
  }

  /**
   * @method findByName
   * @param name {string}
   * @return {ShareableArray}
   */
  findByName(name: string): ShareableArray<AbstractDrawable> {
    return this.find(function(drawable) { return drawable.name === name })
  }

  /**
   * <p>
   * Removes the <code>drawable</code> from this <code>Scene</code>.
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
      const drawable = this._drawables.getWeakRef(i)
      drawable.contextFree(context)
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
      const drawable = this._drawables.getWeakRef(i)
      drawable.contextGain(context)
    }
    super.contextGain(context)
  }

  /**
   * @method contextLost
   * @return {void}
   */
  contextLost(): void {
    for (let i = 0; i < this._drawables.length; i++) {
      const drawable = this._drawables.getWeakRef(i)
      drawable.contextLost()
    }
    super.contextLost()
  }
}
