var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Color', '../checks/mustBeObject', '../checks/mustBeString', '../utils/Shareable', '../core/Symbolic', '../math/R3'], function (require, exports, Color, mustBeObject, mustBeString, Shareable, Symbolic, R3) {
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
         * @class DirectionalLight
         * @constructor
         * @param direction {VectorE3}
         * @param color [ColorRGB = Color.white]
         */
        function DirectionalLight(direction, color) {
            if (color === void 0) { color = Color.white; }
            _super.call(this, 'DirectionalLight');
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
        DirectionalLight.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
        DirectionalLight.prototype.getProperty = function (name) {
            mustBeString('name', name);
            switch (name) {
                case DirectionalLight.PROP_COLOR: {
                    return this.color.coords;
                }
                case DirectionalLight.PROP_DIRECTION: {
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
        DirectionalLight.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeObject('value', value);
            switch (name) {
                case DirectionalLight.PROP_COLOR: {
                    this.color.coords = value;
                    break;
                }
                case DirectionalLight.PROP_DIRECTION: {
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
         * @return {DirectionalLight}
         * @chainable
         */
        DirectionalLight.prototype.setColor = function (color) {
            mustBeObject('color', color);
            this.color.copy(color);
            return this;
        };
        /**
         * @method setDirection
         * @param direction {VectorE3}
         * @return {DirectionalLight}
         * @chainable
         */
        DirectionalLight.prototype.setDirection = function (direction) {
            mustBeObject('direction', direction);
            this.direction.copy(direction).direction();
            return this;
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        DirectionalLight.prototype.setUniforms = function (visitor, canvasId) {
            visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.coords, canvasId);
            var coords = [this.color.r, this.color.g, this.color.b];
            visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, coords, canvasId);
        };
        /**
         * The name of the property that designates the color.
         * @property PROP_COLOR
         * @type {string}
         * @default 'color'
         * @static
         * @readOnly
         */
        DirectionalLight.PROP_COLOR = 'color';
        /**
         * The name of the property that designates the direction.
         * @property PROP_DIRECTION
         * @type {string}
         * @default 'direction'
         * @static
         * @readOnly
         */
        DirectionalLight.PROP_DIRECTION = 'direction';
        return DirectionalLight;
    })(Shareable);
    return DirectionalLight;
});
