import Arrow from './Arrow'
import Color from '../core/Color'
import Cuboid from './Cuboid'
import Cylinder from './Cylinder'
import DrawList from './DrawList'
import Facet from '../core/Facet'
import isDefined from '../checks/isDefined'
import Mesh from '../core/Mesh'
import mustBeNumber from '../checks/mustBeNumber'
import readOnly from '../i18n/readOnly'
import Shareable from '../core/Shareable'
import Sphere from './Sphere'
import TrackballControls from '../controls/TrackballControls'
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
    private _controls: TrackballControls

    /**
     * @class World
     * @constructor
     */
    constructor(renderer: WebGLRenderer, drawList: DrawList, ambients: Facet[], controls: TrackballControls) {
        super('World')

        renderer.addRef()
        this.renderer = renderer

        drawList.addRef()
        this.drawList = drawList

        this.drawList.subscribe(renderer)

        this._ambients = ambients

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
     * @type TrackballControls
     * @readOnly
     */
    get controls(): TrackballControls {
        return this._controls;
    }
    set controls(unused: TrackballControls) {
        throw new Error(readOnly('controls').message)
    }

    add(mesh: Mesh): void {
        this.drawList.add(mesh)
    }

    /**
     * @method arrow
     * @return {Arrow}
     */
    arrow(): Arrow {
        const arrow = new Arrow()
        arrow.color = Color.fromRGB(0.6, 0.6, 0.6)
        this.drawList.add(arrow)
        arrow.release()
        return arrow
    }

    /**
     * @method cuboid
     * @return {Cuboid}
     */
    cuboid(options: { width?: number; height?: number; depth?: number } = {}): Cuboid {
        const cuboid = new Cuboid()
        cuboid.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        cuboid.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        cuboid.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1
        cuboid.color = Color.green
        this.drawList.add(cuboid)
        cuboid.release()
        return cuboid
    }

    /**
     * @method cylinder
     * @return {Cylinder}
     */
    cylinder(options: { radius?: number } = {}): Cylinder {
        const cylinder = new Cylinder()
        cylinder.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        cylinder.color = Color.magenta
        this.drawList.add(cylinder)
        cylinder.release()
        return cylinder
    }

    /**
     * @method sphere
     * @return {Sphere}
     */
    sphere(options: { radius?: number } = {}): Sphere {
        const sphere = new Sphere()
        sphere.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        sphere.color = Color.blue
        this.drawList.add(sphere)
        sphere.release()
        return sphere
    }
}
