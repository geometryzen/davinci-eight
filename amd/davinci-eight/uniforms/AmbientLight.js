var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Color', '../utils/Shareable', '../core/Symbolic'], function (require, exports, Color, Shareable, Symbolic) {
    var LOGGING_NAME = 'AmbientLight';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class AmbientLight
     * @extends Shareable
     */
    var AmbientLight = (function (_super) {
        __extends(AmbientLight, _super);
        /**
         * Constructs a white light in the -e3 direction.
         * @class AmbientLight
         * @constructor
         */
        function AmbientLight() {
            _super.call(this, 'AmbientLight');
            this.color = Color.white;
        }
        /**
         * @method destructor
         * @type {void}
         * @protected
         */
        AmbientLight.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        AmbientLight.prototype.setUniforms = function (visitor, canvasId) {
            visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, this.color.data, canvasId);
        };
        return AmbientLight;
    })(Shareable);
    return AmbientLight;
});
