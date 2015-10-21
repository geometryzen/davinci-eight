var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Color', '../utils/Shareable', '../core/Symbolic', '../math/MutableVectorE3'], function (require, exports, Color, Shareable, Symbolic, MutableVectorE3) {
    var LOGGING_NAME = 'DirectionalLight';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class DirectionalLight
     * @extends Shareable
     */
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        /**
         * Constructs a white light in the -e3 direction.
         * @class DirectionalLight
         * @constructor
         */
        function DirectionalLight() {
            _super.call(this, 'DirectionalLight');
            this.direction = new MutableVectorE3([-1, -1, -1]).normalize();
            this.color = Color.white.clone();
        }
        /**
         * @method destructor
         * @type {void}
         * @protected
         */
        DirectionalLight.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        DirectionalLight.prototype.getProperty = function (name) {
            return void 0;
        };
        DirectionalLight.prototype.setProperty = function (name, value) {
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        DirectionalLight.prototype.setUniforms = function (visitor, canvasId) {
            visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.data, canvasId);
            visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, this.color.data, canvasId);
        };
        return DirectionalLight;
    })(Shareable);
    return DirectionalLight;
});
