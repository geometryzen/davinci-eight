var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../facets/ModelFacetE3', '../math/G3'], function (require, exports, ModelFacetE3, G3) {
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
             * @default 0
             */
            this.V = new G3().zero();
            /**
             * <p>
             * The <em>rotational velocity</em>, a bivector.
             * </p>
             * @property Ω
             * @type {G3}
             * @default <b>1</b>
             */
            this.Ω = new G3().one();
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        RigidBodyFacetE3.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        RigidBodyFacetE3.prototype.getProperty = function (name) {
            return _super.prototype.getProperty.call(this, name);
        };
        RigidBodyFacetE3.prototype.setProperty = function (name, value) {
            return _super.prototype.setProperty.call(this, name, value);
        };
        return RigidBodyFacetE3;
    })(ModelFacetE3);
    return RigidBodyFacetE3;
});
