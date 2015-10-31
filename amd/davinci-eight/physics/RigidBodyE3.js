var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../physics/ModelE3', '../math/G3'], function (require, exports, ModelE3, G3) {
    /**
     * @class RigidBodyE3
     * @extends ModelE3
     */
    var RigidBodyE3 = (function (_super) {
        __extends(RigidBodyE3, _super);
        /**
         * <p>
         * Constructs a RigidBodyE3.
         * </p>
         * @class RigidBodyE3
         * @constructor
         * @param [type = 'RigidBodyE3'] {string} The name used for reference counting.
         */
        function RigidBodyE3(type) {
            if (type === void 0) { type = 'RigidBodyE3'; }
            _super.call(this, type);
            /**
             * <p>
             * The <em>linear velocity</em>, a vector.
             * </p>
             * @property V
             * @type {G3}
             */
            this.V = new G3().zero();
            /**
             * <p>
             * The <em>rotational velocity</em>, a spinor.
             * </p>
             * @property Ω
             * @type {G3}
             */
            this.Ω = new G3().zero().addScalar(1);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        RigidBodyE3.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        return RigidBodyE3;
    })(ModelE3);
    return RigidBodyE3;
});
