var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../models/ModelFacetE3', '../math/G3'], function (require, exports, Euclidean3, ModelFacetE3, G3) {
    /**
     * @class RigidBodyFacetE3
     * @extends ModelFacetE3
     */
    var RigidBodyFacetE3 = (function (_super) {
        __extends(RigidBodyFacetE3, _super);
        /**
         * <p>
         * Constructs a RigidBodyFacetE3.
         * </p>
         * @class RigidBodyFacetE3
         * @constructor
         * @param [type = 'RigidBodyFacetE3'] {string} The name used for reference counting.
         */
        function RigidBodyFacetE3(type) {
            if (type === void 0) { type = 'RigidBodyFacetE3'; }
            _super.call(this, type);
            /**
             * <p>
             * The <em>linear velocity</em>, a vector.
             * </p>
             * @property V
             * @type {G3}
             */
            this.V = new G3().copy(Euclidean3.zero);
            /**
             * <p>
             * The <em>rotational velocity</em>, a spinor.
             * </p>
             * @property Ω
             * @type {G3}
             */
            this.Ω = new G3();
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        RigidBodyFacetE3.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        return RigidBodyFacetE3;
    })(ModelFacetE3);
    return RigidBodyFacetE3;
});
