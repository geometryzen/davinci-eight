import Arrow from './Arrow'
import Color from '../core/Color'
import core from '../core'
import Box from './Box'
import Cylinder from './Cylinder'
import CylinderOptions from './CylinderOptions'
import DrawList from './DrawList'
import Facet from '../core/Facet'
import Geometric3 from '../math/Geometric3'
import isDefined from '../checks/isDefined'
import AmbientLight from '../facets/AmbientLight'
import Drawable from '../core/Drawable'
import mustBeNumber from '../checks/mustBeNumber'
import CameraControls from '../controls/CameraControls'
import readOnly from '../i18n/readOnly'
import RigidBody from './RigidBody'
import Shareable from '../core/Shareable'
import Sphere from './Sphere'
import VectorE3 from '../math/VectorE3'
import WebGLRenderer from '../core/WebGLRenderer'

function updateAxis(body: RigidBody, options: { axis?: VectorE3 }): void {
    if (options.axis) {
        body.axis.copyVector(options.axis).direction()
    }
}

function updateColor(body: {color: Color}, options: { color?: Color }): void {
    if (options.color) {
        body.color.copy(options.color)
    }
    else {
        body.color = Color.fromRGB(0.6, 0.6, 0.6)
    }
}

function updatePosition(body: {position: Geometric3}, options: { pos?: VectorE3 }): void {
    if (options.pos) {
        body.position.copyVector(options.pos)
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
    arrow(
        options: {
            axis?: VectorE3;
            color?: Color;
            pos?: VectorE3;
        } = {}): Arrow {
        const arrow = new Arrow(options)
        updateAxis(arrow, options)
        updateColor(arrow, options)
        updatePosition(arrow, options)
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
            pos?: VectorE3;
            width?: number;
            height?: number;
            depth?: number;
        } = {}): Box {
        const box = new Box(options)
        updateColor(box, options)
        updatePosition(box, options)
        this.drawList.add(box)
        box.release()
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
        updateColor(cylinder, options)
        updatePosition(cylinder, options)
        cylinder.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
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
        updateColor(sphere, options)
        updatePosition(sphere, options)
        sphere.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        this.drawList.add(sphere)
        sphere.release()
        return sphere
    }
}
