import { Geometric3 } from '../math/Geometric3';
/**
 *
 */
var ModelE3 = (function () {
    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE3 implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelE3 at the origin and with unity attitude.
     * </p>
     */
    function ModelE3() {
        this._position = Geometric3.zero(false);
        this._attitude = Geometric3.one(false);
        this._position.modified = true;
        this._attitude.modified = true;
    }
    Object.defineProperty(ModelE3.prototype, "R", {
        /**
         * <p>
         * The <em>attitude</em>, a rotor.
         * </p>
         */
        get: function () {
            return this._attitude;
        },
        set: function (attitude) {
            this._attitude.copySpinor(attitude);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelE3.prototype, "X", {
        /**
         * <p>
         * The <em>position</em>, a vector.
         * </p>
         */
        get: function () {
            return this._position;
        },
        set: function (position) {
            this._position.copyVector(position);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The name of the property that designates the attitude.
     */
    ModelE3.PROP_ATTITUDE = 'R';
    /**
     * The name of the property that designates the position.
     */
    ModelE3.PROP_POSITION = 'X';
    return ModelE3;
}());
export { ModelE3 };
