import {Color} from '../core/Color'
import DrawList from './DrawList'
import Facet from '../core/Facet'
import {AmbientLight} from '../facets/AmbientLight'
import AbstractDrawable from '../core/AbstractDrawable'
import {TrackballControls} from '../controls/TrackballControls'
import incLevel from '../base/incLevel';
import readOnly from '../i18n/readOnly'
import ShareableBase from '../core/ShareableBase'
import {Engine} from '../core/Engine'

/**
 * Intentionally undocumented.
 * The concept of creating a quick setup violates the Explicit over Implicit principle.
 */
export default class World extends ShareableBase {
  private drawList: DrawList
  private renderer: Engine
  private _ambients: Facet[]
  private _controls: TrackballControls

  private _ambientLight = new AmbientLight(Color.fromRGB(0.3, 0.3, 0.3))

  constructor(engine: Engine, drawList: DrawList, ambients: Facet[], controls: TrackballControls) {
    super()
    this.setLoggingName('World')

    engine.addRef()
    this.renderer = engine

    drawList.addRef()
    this.drawList = drawList

    this.drawList.subscribe(engine)
    engine.synchronize(this.drawList)

    this._ambients = ambients
    this._ambients.push(this._ambientLight)

    controls.addRef()
    this._controls = controls
  }

  destructor(levelUp: number): void {
    this.controls.release()
    this.drawList.release()
    this.renderer.release()
    super.destructor(incLevel(levelUp))
  }

  get ambients(): Facet[] {
    return this._ambients;
  }
  set ambients(unused: Facet[]) {
    throw new Error(readOnly('ambients').message)
  }

  get ambientLight(): AmbientLight {
    return this._ambientLight;
  }
  set ambientLight(unused: AmbientLight) {
    throw new Error(readOnly('ambientLight').message)
  }

  get canvas(): HTMLCanvasElement {
    return this.renderer.canvas
  }
  set canvas(unused: HTMLCanvasElement) {
    throw new Error(readOnly('canvas').message)
  }

  get controls(): TrackballControls {
    return this._controls;
  }
  set controls(unused: TrackballControls) {
    throw new Error(readOnly('controls').message)
  }

  add(drawable: AbstractDrawable): void {
    this.drawList.add(drawable)
  }
}
