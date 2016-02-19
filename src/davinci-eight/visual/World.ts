import Arrow from './Arrow'
import Color from '../core/Color'
import core from '../core'
import Box from './Box'
import Cylinder from './Cylinder'
import DrawList from './DrawList'
import G3 from '../math/G3'
import Facet from '../core/Facet'
import isDefined from '../checks/isDefined'
import AmbientLight from '../facets/AmbientLight'
import Mesh from '../core/Mesh'
import mustBeNumber from '../checks/mustBeNumber'
import readOnly from '../i18n/readOnly'
import Shareable from '../core/Shareable'
import Sphere from './Sphere'
import TrackballCameraControls from '../controls/TrackballCameraControls'
import VectorE3 from '../math/VectorE3'
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
    private _controls: TrackballCameraControls
    private _ambientLight = new AmbientLight(Color.fromRGB(0.3, 0.3, 0.3))

    /**
     * @class World
     * @constructor
     */
    constructor(renderer: WebGLRenderer, drawList: DrawList, ambients: Facet[], controls: TrackballCameraControls) {
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
     * @type TrackballCameraControls
     * @readOnly
     */
    get controls(): TrackballCameraControls {
        return this._controls;
    }
    set controls(unused: TrackballCameraControls) {
        throw new Error(readOnly('controls').message)
    }

    add(mesh: Mesh): void {
        if (core.safemode) {
            if (!(mesh instanceof Mesh)) {
                throw new Error("mesh must be an instance of Mesh")
            }
        }
        this.drawList.add(mesh)
    }

    /**
     * @method arrow
     * @return {Arrow}
     */
    arrow(
        options: {
            axis?: VectorE3;
            color?: Color;
            pos?: VectorE3;
        } = {}): Arrow {
        const arrow = new Arrow()
        if (options.axis) {
            arrow.axis = G3.fromVectorE3(options.axis)
        }
        if (options.color) {
            arrow.color.copy(options.color)
        }
        else {
            arrow.color = Color.fromRGB(0.6, 0.6, 0.6)
        }
        if (options.pos) {
            arrow.pos = G3.vector(options.pos.x, options.pos.y, options.pos.z)
        }
        this.drawList.add(arrow)
        arrow.release()
        return arrow
    }

    /**
     * @method box
     * @return {Box}
     */
    box(
        options: {
            axis?: VectorE3;
            color?: Color;
            width?: number;
            height?: number;
            depth?: number;
        } = {}): Box {
        const box = new Box(options)
        if (options.axis) {
            box.axis = G3.fromVectorE3(options.axis)
        }
        if (options.color) {
            box.color.copy(options.color)
        }
        else {
            box.color = Color.fromRGB(0.6, 0.6, 0.6)
        }
        this.drawList.add(box)
        box.release()
        return box
    }

    /**
     * @method cylinder
     * @return {Cylinder}
     */
    cylinder(
        options: {
            axis?: VectorE3;
            pos?: VectorE3;
            radius?: number;
        } = {}): Cylinder {
        const cylinder = new Cylinder()
        if (options.axis) {
            cylinder.axis = G3.vector(options.axis.x, options.axis.y, options.axis.z)
        }
        if (options.pos) {
            cylinder.pos = G3.fromVectorE3(options.pos)
        }
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
    sphere(
        options: {
            color?: Color;
            pos?: VectorE3;
            radius?: number;
        } = {}): Sphere {
        const sphere = new Sphere()
        if (options.pos) {
            sphere.pos = G3.fromVectorE3(options.pos)
        }
        sphere.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        if (options.color) {
            sphere.color.copy(options.color)
        }
        else {
            sphere.color = Color.blue
        }
        this.drawList.add(sphere)
        sphere.release()
        return sphere
    }
}
