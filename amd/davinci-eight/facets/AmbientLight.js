var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Color', '../checks/mustBeNumber', '../checks/mustBeObject', '../utils/Shareable', '../core/GraphicsProgramSymbols'], function (require, exports, Color, mustBeNumber, mustBeObject, Shareable, GraphicsProgramSymbols) {
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
        function AmbientLight(color) {
            _super.call(this, 'AmbientLight');
            mustBeObject('color', color);
            // FIXME: Need some kind of locking for constants
            this.color = Color.white.clone();
            this.color.r = mustBeNumber('color.r', color.r);
            this.color.g = mustBeNumber('color.g', color.g);
            this.color.b = mustBeNumber('color.b', color.b);
        }
        /**
         * @method destructor
         * @type {void}
         * @protected
         */
        AmbientLight.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        AmbientLight.prototype.getProperty = function (name) {
            return void 0;
        };
        AmbientLight.prototype.setProperty = function (name, value) {
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param [canvasId] {number}
         * @return {void}
         */
        AmbientLight.prototype.setUniforms = function (visitor, canvasId) {
            var coords = [this.color.r, this.color.g, this.color.b];
            visitor.vector3(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, coords, canvasId);
        };
        return AmbientLight;
    })(Shareable);
    return AmbientLight;
});
