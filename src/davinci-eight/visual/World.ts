import Color from '../core/Color'
import DrawList from './DrawList'
import Facet from '../core/Facet'
import AmbientLight from '../facets/AmbientLight'
import IDrawable from '../core/IDrawable'
import CameraControls from '../controls/CameraControls'
import readOnly from '../i18n/readOnly'
import Shareable from '../core/Shareable'
import WebGLRenderer from '../core/WebGLRenderer'

/**
 * Intentionally undocumented.
 * The concept of creating a quick setup violates the Explicit over Implicit principle.
 */
export default class World extends Shareable {
    private drawList: DrawList
    private renderer: WebGLRenderer
    private _ambients: Facet[]
    private _controls: CameraControls

    private _ambientLight = new AmbientLight(Color.fromRGB(0.3, 0.3, 0.3))

    constructor(renderer: WebGLRenderer, drawList: DrawList, ambients: Facet[], controls: CameraControls) {
        super('World')

        renderer.addRef()
        this.renderer = renderer

        drawList.addRef()
        this.drawList = drawList

        this.drawList.subscribe(renderer)

        this._ambients = ambients
        this._ambients.push(this._ambientLight)

        controls.addRef()
        this._controls = controls
    }

    destructor(): void {
        this.controls.release()
        this.drawList.unsubscribe()
        this.drawList.release()
        this.renderer.release()
        super.destructor()
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

    add(drawable: IDrawable): void {
        this.drawList.add(drawable)
    }
}
