import { Geometric2 } from '../math/Geometric2';
/**
 *
 */
var ModelE2 = (function () {
    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE2 implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelE2 at the origin and with unity attitude.
     * </p>
     */
    function ModelE2() {
        this._position = new Geometric2().zero();
        this._attitude = new Geometric2().zero().addScalar(1);
        this._position.modified = true;
        this._attitude.modified = true;
    }
    Object.defineProperty(ModelE2.prototype, "R", {
        /**
         * <p>
         * The <em>attitude</em>, a unitary spinor.
         * </p>
         */
        get: function () {
            return this._attitude;
        },
        set: function (attitude) {
            this._attitude.copy(attitude);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelE2.prototype, "X", {
        /**
         * <p>
         * The <em>position</em>, a vector.
         * The vector <b>X</b> designates the center of mass of the body (Physics).
         * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
         * </p>
         */
        get: function () {
            return this._position;
        },
        set: function (position) {
            this._position.copy(position);
        },
        enumerable: true,
        configurable: true
    });
    return ModelE2;
}());
export { ModelE2 };
/**
 * The name of the property that designates the attitude.
 */
ModelE2.PROP_ATTITUDE = 'R';
/**
 * The name of the property that designates the position.
 */
ModelE2.PROP_POSITION = 'X';
