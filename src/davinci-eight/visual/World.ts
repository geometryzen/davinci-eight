import Arrow from './Arrow'
import ArrowOptions from './ArrowOptions'
import Color from '../core/Color'
import core from '../core'
import Box from './Box'
import BoxOptions from './BoxOptions'
import Cylinder from './Cylinder'
import CylinderOptions from './CylinderOptions'
import DrawList from './DrawList'
import Facet from '../core/Facet'
import isDefined from '../checks/isDefined'
import AmbientLight from '../facets/AmbientLight'
import Drawable from '../core/Drawable'
import mustBeNumber from '../checks/mustBeNumber'
import CameraControls from '../controls/CameraControls'
import readOnly from '../i18n/readOnly'
import RigidBody from './RigidBody'
import Shareable from '../core/Shareable'
import Sphere from './Sphere'
import SphereOptions from './SphereOptions'
import VectorE3 from '../math/VectorE3'
import WebGLRenderer from '../core/WebGLRenderer'



function updateAxis(body: RigidBody, options: { axis?: VectorE3 }): void {
    if (options.axis) {
        body.axis.copyVector(options.axis).direction()
    }
}

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

    add(mesh: Drawable): void {
        if (core.safemode) {
            if (!(mesh instanceof Drawable)) {
                throw new Error("mesh must be an instance of Drawable")
            }
        }
        this.drawList.add(mesh)
    }

    /**
     * @method arrow
     * @return {Arrow}
     */
    arrow(options: ArrowOptions = {}): Arrow {
        const arrow = new Arrow(options)
        updateAxis(arrow, options)
        if (options.color) {
            arrow.color.copy(options.color)
        }
        if (isDefined(options.position)) {
            arrow.position.copyVector(options.position)
        }
        //      arrow.length = isDefined(options.length) ? mustBeNumber('length', options.length) : 1.0
        this.drawList.add(arrow)
        return arrow
    }

    /**
     * @method box
     * @return {Box}
     */
    box(options: BoxOptions = {}): Box {
        const box = new Box(options)
        if (options.color) {
            box.color.copy(options.color)
        }
        if (options.position) {
            box.position.copyVector(options.position)
        }
        box.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1.0
        box.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1.0
        box.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1.0
        this.drawList.add(box)
        return box
    }

    /**
     * @method cylinder
     * @param [options = {}] {CylinderOptions}
     * @return {Cylinder}
     */
    cylinder(options: CylinderOptions = {}): Cylinder {
        const cylinder = new Cylinder(options)
        updateAxis(cylinder, options)
        if (options.color) {
            cylinder.color.copy(options.color)
        }
        if (options.position) {
            cylinder.position.copyVector(options.position)
        }
        cylinder.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        cylinder.length = isDefined(options.length) ? mustBeNumber('length', options.length) : 1.0
        this.drawList.add(cylinder)
        return cylinder
    }

    /**
     * @method sphere
     * @return {Sphere}
     */
    sphere(options: SphereOptions = {}): Sphere {
        const sphere = new Sphere()
        if (options.color) {
            sphere.color.copy(options.color)
        }
        if (options.position) {
            sphere.position.copyVector(options.position)
        }
        sphere.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        this.drawList.add(sphere)
        return sphere
    }
}
