import G3 from '../math/G3';
import mustBeObject from '../checks/mustBeObject';
import Mesh from '../core/Mesh';
import Geometry from '../core/Geometry';
import Material from '../core/Material';
import Unit from '../math/Unit'

/**
 * Convenient abstractions for Physics modeling.
 *
 * @module EIGHT
 * @submodule visual
 */

//
// RigidBody extends Mesh, which has dimensionless, mutable, attitude and position properties.
// RigidBody may have optional units and has strictly immutable types.
// This makes RigidBody useful for Physics education purposes but less so for performance graphics.
//

/**
 * @class RigidBody
 * @extends Mesh
 */
export default class RigidBody extends Mesh {

    /**
     * @property posUom
     * @type Unit
     * @private
     */
    private posUom: Unit;

    /**
     * @property _mass
     * @type G3
     * @default one
     * @private
     */
    private _mass = G3.one

    /**
     * @property _momentum
     * @type G3
     * @default zero
     * @private
     */
    private _momentum = G3.zero

    /**
     * Provides descriptive variables for translational and rotational motion.
     * This class is intended to be used as a base for bodies in the __visual__ module.
     *
     * @class RigidBody
     * @constructor
     * @param geometry {Geometry}
     * @param material {Material}
     * @param [type = 'RigidBody'] {string}
     */
    constructor(geometry: Geometry, material: Material, type = 'RigidBody') {
        super(geometry, material, type)
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }

    /**
     * Axis (vector)
     * This property is computed from the attitude spinor assuming a reference axis of e2.
     * The axis property may be updated by assignment, but not through mutation.
     *
     * @property axis
     * @type G3
     */
    public get axis(): G3 {
        // The initial axis of the geometry is e2.
        return G3.e2.rotate(this.attitude)
    }
    public set axis(axis: G3) {
        mustBeObject('axis', axis)
        this.attitude.rotorFromDirections(G3.e2, axis)
    }

    /**
     * Mass
     *
     * @property m
     * @type G3
     */
    get m(): G3 {
        return this._mass
    }
    set m(m: G3) {
        mustBeObject('m', m, () => { return this._type })
        this._mass = m
    }

    /**
     * Momentum
     *
     * @property P
     * @type G3
     */
    get P(): G3 {
        return this._momentum
    }
    set P(P: G3) {
        this._momentum = P
    }

    /**
     * Attitude (spinor)
     *
     * @property R
     * @type G3
     */
    get R(): G3 {
        return G3.fromSpinor(this.attitude)
    }
    set R(R: G3) {
        mustBeObject('R', R, () => { return this._type })
        this.attitude.copySpinor(R)
    }

    /**
     * Position (vector)
     *
     * @property X
     * @type G3
     */
    get X(): G3 {
        return G3.fromVector(this.position, this.posUom)
    }
    set X(X: G3) {
        mustBeObject('X', X, () => { return this._type })
        this.position.copy(X)
        this.posUom = X.uom
    }

    /**
     * Position (vector)
     *
     * @property pos
     * @type G3
     */
    get pos(): G3 {
        return G3.fromVector(this.position, this.posUom)
    }
    set pos(pos: G3) {
        mustBeObject('pos', pos, () => { return this._type })
        this.position.copy(pos)
        this.posUom = pos.uom
    }

    /**
     * @method getScaleX
     * @return {number}
     * @protected
     */
    protected getScaleX(): number {
        return this.scale.x
    }

    /**
     * @method setScaleX
     * @param x {number}
     * @return {void}
     * @protected
     */
    protected setScaleX(x: number): void {
        this.scale.x = x
    }

    /**
     * @method getScaleY
     * @return {number}
     * @protected
     */
    protected getScaleY(): number {
        return this.scale.y
    }

    /**
     * @method setScaleY
     * @param y {number}
     * @return {void}
     * @protected
     */
    protected setScaleY(y: number): void {
        this.scale.y = y
    }

    /**
     * @method getScaleZ
     * @return {number}
     * @protected
     */
    protected getScaleZ(): number {
        return this.scale.z
    }

    /**
     * @method setScaleZ
     * @param z {number}
     * @return {void}
     * @protected
     */
    protected setScaleZ(z: number): void {
        this.scale.z = z
    }
}
