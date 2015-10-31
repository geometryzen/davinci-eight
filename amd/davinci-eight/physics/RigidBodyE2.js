var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../physics/ModelE2', '../math/G2'], function (require, exports, ModelE2, G2) {
    /**
     * @class RigidBodyE2
     * @extends ModelE2
     */
    var RigidBodyE2 = (function (_super) {
        __extends(RigidBodyE2, _super);
        /**
         * <p>
         * Constructs a RigidBodyE2.
         * </p>
         * @class RigidBodyE2
         * @constructor
         * @param [type = 'RigidBodyE2'] {string} The name used for reference counting.
         */
        function RigidBodyE2(type) {
            if (type === void 0) { type = 'RigidBodyE2'; }
            _super.call(this, type);
            /**
             * <p>
             * The <em>linear velocity</em>, a vector.
             * </p>
             * @property V
             * @type {G2}
             */
            this.V = new G2().zero();
            /**
             * <p>
             * The <em>rotational velocity</em>, a spinor.
             * </p>
             * @property Ω
             * @type {G2}
             */
            this.Ω = new G2().zero().addScalar(1);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        RigidBodyE2.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        return RigidBodyE2;
    })(ModelE2);
    return RigidBodyE2;
});
