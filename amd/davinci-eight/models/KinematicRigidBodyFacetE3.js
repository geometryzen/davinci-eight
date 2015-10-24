var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../models/ModelFacet', '../math/G3'], function (require, exports, Euclidean3, ModelFacet, G3) {
    /**
     * @class KinematicRigidBodyFacetE3
     * @extends ModelFacet
     */
    var KinematicRigidBodyFacetE3 = (function (_super) {
        __extends(KinematicRigidBodyFacetE3, _super);
        /**
         * <p>
         * Constructs a KinematicRigidBodyFacetE3.
         * </p>
         * @class KinematicRigidBodyFacetE3
         * @constructor
         * @param [type = 'KinematicRigidBodyFacetE3'] {string} The name used for reference counting.
         */
        function KinematicRigidBodyFacetE3(type) {
            if (type === void 0) { type = 'KinematicRigidBodyFacetE3'; }
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
        KinematicRigidBodyFacetE3.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        return KinematicRigidBodyFacetE3;
    })(ModelFacet);
    return KinematicRigidBodyFacetE3;
});
