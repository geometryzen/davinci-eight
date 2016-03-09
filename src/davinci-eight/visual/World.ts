import Color from '../core/Color'
import DrawList from './DrawList'
import Facet from '../core/Facet'
import AmbientLight from '../facets/AmbientLight'
import AbstractDrawable from '../core/AbstractDrawable'
import CameraControls from '../controls/CameraControls'
import incLevel from '../base/incLevel';
import readOnly from '../i18n/readOnly'
import ShareableBase from '../core/ShareableBase'
import Engine from '../core/Engine'

/**
 * Intentionally undocumented.
 * The concept of creating a quick setup violates the Explicit over Implicit principle.
 */
export default class World extends ShareableBase {
    private drawList: DrawList
    private renderer: Engine
    private _ambients: Facet[]
    private _controls: CameraControls

    private _ambientLight = new AmbientLight(Color.fromRGB(0.3, 0.3, 0.3))

    constructor(renderer: Engine, drawList: DrawList, ambients: Facet[], controls: CameraControls) {
        super()
        this.setLoggingName('World')

        renderer.addRef()
        this.renderer = renderer

        drawList.addRef()
        this.drawList = drawList

        this.drawList.subscribe(renderer, true)

        this._ambients = ambients
        this._ambients.push(this._ambientLight)

        controls.addRef()
        this._controls = controls
    }

    destructor(level: number): void {
        this.controls.release()
        this.drawList.unsubscribe(true)
        this.drawList.release()
        this.renderer.release()
        super.destructor(incLevel(level))
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

    get controls(): CameraControls {
        return this._controls;
    }
    set controls(unused: CameraControls) {
        throw new Error(readOnly('controls').message)
    }

    add(drawable: AbstractDrawable): void {
        this.drawList.add(drawable)
    }
}
