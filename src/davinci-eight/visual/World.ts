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
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class World
 * @extends Shareable
 */
export default class World extends Shareable {
    private drawList: DrawList
    private renderer: WebGLRenderer
    private _ambients: Facet[]
    private _controls: CameraControls
    private _ambientLight = new AmbientLight(Color.fromRGB(0.3, 0.3, 0.3))

    /**
     * @class World
     * @constructor
     */
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

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    destructor(): void {
        this.controls.release()
        this.drawList.unsubscribe()
        this.drawList.release()
        this.renderer.release()
        super.destructor()
    }

    /**
     * @property ambients
     * @type Facet[]
     * @readOnly
     */
    get ambients(): Facet[] {
        return this._ambients;
    }
    set ambients(unused: Facet[]) {
        throw new Error(readOnly('ambients').message)
    }

    /**
     * @property ambientLight
     * @type AmbientLight
     */
    get ambientLight(): AmbientLight {
        return this._ambientLight;
    }
    set ambientLight(unused: AmbientLight) {
        throw new Error(readOnly('ambientLight').message)
    }

    /**
     * @property canvas
     * @type HTMLCanvasElement
     * @readOnly
     */
    get canvas(): HTMLCanvasElement {
        return this.renderer.canvas
    }
    set canvas(unused: HTMLCanvasElement) {
        throw new Error(readOnly('canvas').message)
    }

    /**
     * @property controls
     * @type CameraControls
     * @readOnly
     */
    get controls(): CameraControls {
        return this._controls;
    }
    set controls(unused: CameraControls) {
        throw new Error(readOnly('controls').message)
    }

    /**
     * @method add
     * @param drawable {IDrawable}
     * @return {void}
     */
    add(drawable: IDrawable): void {
        this.drawList.add(drawable)
    }
}
