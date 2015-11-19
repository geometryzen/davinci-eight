var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Color', '../checks/mustBeObject', '../checks/mustBeString', '../utils/Shareable', '../core/GraphicsProgramSymbols', '../math/R3'], function (require, exports, Color, mustBeObject, mustBeString, Shareable, GraphicsProgramSymbols, R3) {
    var LOGGING_NAME = 'DirectionalLightE3';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class DirectionalLightE3
     * @extends Shareable
     */
    var DirectionalLightE3 = (function (_super) {
        __extends(DirectionalLightE3, _super);
        /**
         * @class DirectionalLightE3
         * @constructor
         * @param direction {VectorE3}
         * @param color [ColorRGB = Color.white]
         */
        function DirectionalLightE3(direction, color) {
            if (color === void 0) { color = Color.white; }
            _super.call(this, 'DirectionalLightE3');
            mustBeObject('direction', direction);
            mustBeObject('color', color);
            this.direction = R3.copy(direction).direction();
            this.color = Color.fromColor(color);
        }
        /**
         * @method destructor
         * @type {void}
         * @protected
         */
        DirectionalLightE3.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
        DirectionalLightE3.prototype.getProperty = function (name) {
            mustBeString('name', name);
            switch (name) {
                case DirectionalLightE3.PROP_COLOR: {
                    return this.color.coords;
                }
                case DirectionalLightE3.PROP_DIRECTION: {
                    return this.direction.coords;
                }
                default: {
                    console.warn("unknown property: " + name);
                }
            }
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param value {number[]}
         * @return {void}
         */
        DirectionalLightE3.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeObject('value', value);
            switch (name) {
                case DirectionalLightE3.PROP_COLOR: {
                    this.color.coords = value;
                    break;
                }
                case DirectionalLightE3.PROP_DIRECTION: {
                    this.direction.coords = value;
                    break;
                }
                default: {
                    console.warn("unknown property: " + name);
                }
            }
        };
        /**
         * @method setColor
         * @param color {ColorRGB}
         * @return {DirectionalLightE3}
         * @chainable
         */
        DirectionalLightE3.prototype.setColor = function (color) {
            mustBeObject('color', color);
            this.color.copy(color);
            return this;
        };
        /**
         * @method setDirection
         * @param direction {VectorE3}
         * @return {DirectionalLightE3}
         * @chainable
         */
        DirectionalLightE3.prototype.setDirection = function (direction) {
            mustBeObject('direction', direction);
            this.direction.copy(direction).direction();
            return this;
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param [canvasId] {number}
         * @return {void}
         */
        DirectionalLightE3.prototype.setUniforms = function (visitor, canvasId) {
            visitor.vector3(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.coords, canvasId);
            var coords = [this.color.r, this.color.g, this.color.b];
            visitor.vector3(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, coords, canvasId);
        };
        /**
         * The name of the property that designates the color.
         * @property PROP_COLOR
         * @type {string}
         * @default 'color'
         * @static
         * @readOnly
         */
        DirectionalLightE3.PROP_COLOR = 'color';
        /**
         * The name of the property that designates the direction.
         * @property PROP_DIRECTION
         * @type {string}
         * @default 'direction'
         * @static
         * @readOnly
         */
        DirectionalLightE3.PROP_DIRECTION = 'direction';
        return DirectionalLightE3;
    })(Shareable);
    return DirectionalLightE3;
});
