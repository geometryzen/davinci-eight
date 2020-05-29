"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelE2 = void 0;
var Geometric2_1 = require("../math/Geometric2");
/**
 *
 */
var ModelE2 = /** @class */ (function () {
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
        this._position = new Geometric2_1.Geometric2().zero();
        this._attitude = new Geometric2_1.Geometric2().zero().addScalar(1);
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
        enumerable: false,
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
        enumerable: false,
        configurable: true
    });
    /**
     * The name of the property that designates the attitude.
     */
    ModelE2.PROP_ATTITUDE = 'R';
    /**
     * The name of the property that designates the position.
     */
    ModelE2.PROP_POSITION = 'X';
    return ModelE2;
}());
exports.ModelE2 = ModelE2;
