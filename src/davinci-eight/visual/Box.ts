import BoxOptions from './BoxOptions'
import Color from '../core/Color'
import Facet from '../core/Facet'
import Geometric3 from '../math/Geometric3'
import IContextProvider from '../core/IContextProvider'
import IGeometric3RigidBody from './IGeometric3RigidBody'
import Geometry from '../core/Geometry'
import IMaterial from '../core/IMaterial'
import isDefined from '../checks/isDefined'
import Matrix4 from '../math/Matrix4'
import mustBeNumber from '../checks/mustBeNumber'
import RigidBody from './RigidBody'
import R3 from '../math/R3'
import Spinor3 from '../math/Spinor3'
import Shareable from '../core/Shareable'
import Vector3 from '../math/Vector3'
import visualCache from './visualCache'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Box
 * @extends Shareable
 * @extends IGeometric3RigidBody
 */
export default class Box extends Shareable implements IGeometric3RigidBody {

    /**
     * @property inner
     * @type RigidBody
     * @private
     */
    private inner: IGeometric3RigidBody;

    /**
     * @class Box
     * @constructor
     * @param [options={}] {BoxOptions}
     */
    constructor(options: BoxOptions = {}) {
        // This class demonstrates how to implement RigidBody, Mesh, Drawable etc
        // without extending RigidBody and having to call the constructor as the
        // first statement.
        super('Box')
        const geometry = visualCache.box(options)
        const material = visualCache.material()
        const tilt: Spinor3 = Spinor3.one()
        const direction: Vector3 = Vector3.vector(0, 1, 0)
        // FIXME: This is too complicated now...
        this.inner = new RigidBody('Box', tilt, direction)
        this.inner.geometry = geometry
        this.inner.material = material
        geometry.release()
        material.release()
        this.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        this.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        this.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.inner.release()
        super.destructor()
    }

    /**
     * @property attitude
     * @type Geometric3
     */
    get attitude(): Geometric3 {
        return this.inner.attitude
    }
    set attitude(attitude: Geometric3) {
        this.inner.attitude = attitude
    }

    /**
     * @property axis
     * @type Geometric3
     */
    get axis(): Geometric3 {
        return this.inner.axis
    }
    set axis(axis: Geometric3) {
        this.inner.axis = axis
    }

    /**
     * @property color
     * @type Color
     */
    get color(): Color {
        return this.inner.color
    }
    set color(color: Color) {
        this.inner.color = color
    }

    /**
     * @property depth
     * @type number
     */
    get depth(): number {
        return this.inner.scale.z
    }
    set depth(depth: number) {
        mustBeNumber('depth', depth)
        this.inner.scale.z = depth
    }

    /**
     * @property tilt
     * @type Spinor3
     */
    get tilt(): Spinor3 {
        return this.inner.tilt
    }
    set tilt(tilt: Spinor3) {
        this.inner.tilt = tilt
    }

    /**
     * @property geometry
     * @type Geometry
     */
    get geometry(): Geometry {
        return this.inner.geometry
    }
    set geometry(geometry: Geometry) {
        this.inner.geometry = geometry
    }

    /**
     * @property height
     * @type number
     */
    get height(): number {
        return this.inner.scale.y
    }
    set height(height: number) {
        mustBeNumber('height', height)
        this.inner.scale.y = height
    }

    /**
     * @property initialAxis
     * @type R3
     */
    get initialAxis(): R3 {
        return this.inner.initialAxis
    }
    set initialAxis(initialAxis: R3) {
        this.inner.initialAxis = initialAxis
    }

    /**
     * @property mass
     * @type number
     */
    get mass(): number {
        return this.inner.mass
    }
    set mass(mass: number) {
        this.inner.mass = mass
    }

    /**
     * @property material
     * @type IMaterial
     */
    get material(): IMaterial {
        return this.inner.material
    }
    set material(material: IMaterial) {
        this.inner.material = material
    }

    /**
     * @property matrix
     * @type Matrix4
     */
    get matrix(): Matrix4 {
        return this.inner.matrix
    }
    set matrix(matrix: Matrix4) {
        this.inner.matrix = matrix
    }

    /**
     * @property momentum
     * @type number
     */
    get momentum(): Geometric3 {
        return this.inner.momentum
    }
    set momentum(momentum: Geometric3) {
        this.inner.momentum = momentum
    }

    /**
     * @property name
     * @type string
     */
    get name(): string {
        return this.inner.name
    }
    set name(name: string) {
        this.inner.name = name
    }

    /**
     * @property position
     * @type Geometric3
     */
    get position(): Geometric3 {
        return this.inner.position
    }
    set position(position: Geometric3) {
        this.inner.position = position
    }

    /**
     * @property scale
     * @type Vector3
     */
    get scale(): Vector3 {
        return this.inner.scale
    }
    set scale(scale: Vector3) {
        this.inner.scale = scale
    }

    /**
     * @property visible
     * @type boolean
     */
    get visible(): boolean {
        return this.inner.visible
    }
    set visible(visible: boolean) {
        this.inner.visible = visible
    }

    /**
     * @property width
     * @type number
     */
    get width(): number {
        return this.inner.scale.x
    }
    set width(width: number) {
        mustBeNumber('width', width)
        this.inner.scale.x = width
    }

    /**
     * @method contextFree
     * @param context {IContextProvider}
     * @return {void}
     */
    contextFree(context: IContextProvider): void {
        return this.inner.contextFree(context)
    }

    /**
     * @method contextGain
     * @param context {IContextProvider}
     * @return {void}
     */
    contextGain(context: IContextProvider): void {
        return this.inner.contextGain(context)
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        return this.inner.contextLost()
    }

    /**
     * @method draw
     * @parm ambients {Facet[]}
     * @return {void}
     */
    draw(ambients: Facet[]): void {
        return this.inner.draw(ambients)
    }

    /**
     * @method setUniforms
     * @return {void}
     */
    setUniforms(): void {
        return this.inner.setUniforms()
    }
}
