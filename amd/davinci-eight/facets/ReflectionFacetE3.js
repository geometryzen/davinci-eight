var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../checks/mustBeArray', '../checks/mustBeString', '../math/R3', '../math/Mat4R', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, CartesianE3, mustBeArray, mustBeString, R3, Mat4R, readOnly, Shareable) {
    /**
     * @class ReflectionFacetE3
     * @extends Shareable
     */
    var ReflectionFacetE3 = (function (_super) {
        __extends(ReflectionFacetE3, _super);
        /**
         * @class ReflectionFacetE3
         * @constructor
         * @param name {string} The name of the uniform variable.
         */
        function ReflectionFacetE3(name) {
            _super.call(this, 'ReflectionFacetE3');
            /**
             * @property matrix
             * @type {Mat4R}
             * @private
             */
            this.matrix = Mat4R.one();
            this.name = mustBeString('name', name);
            // The mathematics of the reflection causes a zero vector to be the identity transformation.
            this._normal = new R3().copy(CartesianE3.zero);
            this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE3.prototype, "normal", {
            /**
             * @property normal
             * @type R3
             * @readOnly
             */
            get: function () {
                return this._normal;
            },
            set: function (unused) {
                throw new Error(readOnly('normal').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ReflectionFacetE3.prototype.destructor = function () {
            this._normal = void 0;
            this.matrix = void 0;
            _super.prototype.destructor.call(this);
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {Array<number>}
         */
        ReflectionFacetE3.prototype.getProperty = function (name) {
            mustBeString('name', name);
            return void 0;
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param value {Array<number>}
         * @return {void}
         */
        ReflectionFacetE3.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeArray('value', value);
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        ReflectionFacetE3.prototype.setUniforms = function (visitor, canvasId) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.mat4(this.name, this.matrix, false, canvasId);
        };
        return ReflectionFacetE3;
    })(Shareable);
    return ReflectionFacetE3;
});
