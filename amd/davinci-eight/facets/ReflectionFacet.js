var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../checks/mustBeArray', '../checks/mustBeString', '../math/R3', '../math/Matrix4', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, CartesianE3, mustBeArray, mustBeString, R3, Matrix4, readOnly, Shareable) {
    /**
     * @class ReflectionFacet
     * @extends Shareable
     */
    var ReflectionFacet = (function (_super) {
        __extends(ReflectionFacet, _super);
        /**
         * @class ReflectionFacet
         * @constructor
         * @param name {string} The name of the uniform variable.
         */
        function ReflectionFacet(name) {
            _super.call(this, 'ReflectionFacet');
            /**
             * @property matrix
             * @type {Matrix4}
             * @private
             */
            this.matrix = Matrix4.one();
            this.name = mustBeString('name', name);
            // The mathematics of the reflection causes a zero vector to be the identity transformation.
            this._normal = new R3().copy(CartesianE3.zero);
            this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacet.prototype, "normal", {
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
        ReflectionFacet.prototype.destructor = function () {
            this._normal = void 0;
            this.matrix = void 0;
            _super.prototype.destructor.call(this);
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {Array<number>}
         */
        ReflectionFacet.prototype.getProperty = function (name) {
            mustBeString('name', name);
            return void 0;
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param value {Array<number>}
         * @return {void}
         */
        ReflectionFacet.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeArray('value', value);
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        ReflectionFacet.prototype.setUniforms = function (visitor, canvasId) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.uniformMatrix4(this.name, false, this.matrix, canvasId);
        };
        return ReflectionFacet;
    })(Shareable);
    return ReflectionFacet;
});
