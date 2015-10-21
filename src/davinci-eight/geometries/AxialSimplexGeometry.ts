import VectorE3 = require('../math/VectorE3')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import MutableVectorE3 = require('../math/MutableVectorE3')

/**
 * @class AxialSimplexGeometry
 * @extends SimplexGeometry
 */
class AxialSimplexGeometry extends SimplexGeometry implements IAxialGeometry<AxialSimplexGeometry> {
    /**
     * The symmetry axis used for geometry generation.
     * @property axis
     * @type {MutableVectorE3}
     */
    public axis: MutableVectorE3;
    /**
     * <p>
     * A geometry which has axial symmetry, giving it an <code>axis</code> property.
     * </p>
     * <p>
     * Calls the base class constructor.
     * Provides the <code>type</code> to the <code>SimplexGeometry</code> base class.
     * Makes a copy of the axis, normalizes the copy and initializes the <code>axis</axis> property.
     * </p>
     * @class AxialSimplexGeometry
     * @constructor
     * @param type {string} Used for reference count tracking.
     * @param axis {VectorE3} The <b>axis</b> property.
     */
    constructor(type: string, axis: VectorE3) {
        super(type)
        this.axis = MutableVectorE3.copy(axis).normalize()
    }
    /**
     * <p>
     * Sets the <code>axis</code> property to <code>void 0</code>.
     * Calls the base class destructor method.
     * </p>
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): AxialSimplexGeometry {
        this.axis.copy(axis).normalize()
        return this
    }
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): AxialSimplexGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {AxialSimplexGeometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): AxialSimplexGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}

export = AxialSimplexGeometry