var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeArray', '../checks/mustBeString', '../math/R2', '../math/Mat2R', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, mustBeArray, mustBeString, R2, Mat2R, readOnly, Shareable) {
    /**
     * @class ReflectionFacetE2
     * @extends Shareable
     */
    var ReflectionFacetE2 = (function (_super) {
        __extends(ReflectionFacetE2, _super);
        /**
         * @class ReflectionFacetE2
         * @constructor
         * @param name {string} The name of the uniform variable.
         */
        function ReflectionFacetE2(name) {
            _super.call(this, 'ReflectionFacetE2');
            /**
             * @property matrix
             * @type {Mat2R}
             * @private
             */
            this.matrix = Mat2R.one();
            this.name = mustBeString('name', name);
            // The mathematics of the reflection causes a zero vector to be the identity transformation.
            this._normal = new R2().zero();
            this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE2.prototype, "normal", {
            /**
             * @property normal
             * @type R2
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
        ReflectionFacetE2.prototype.destructor = function () {
            this._normal = void 0;
            this.matrix = void 0;
            _super.prototype.destructor.call(this);
        };
        /**
         * @method getProperty
         * @param name {string}
         * @return {Array<number>}
         */
        ReflectionFacetE2.prototype.getProperty = function (name) {
            mustBeString('name', name);
            return void 0;
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param value {Array<number>}
         * @return {void}
         */
        ReflectionFacetE2.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeArray('value', value);
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        ReflectionFacetE2.prototype.setUniforms = function (visitor, canvasId) {
            if (this._normal.modified) {
                this.matrix.reflection(this._normal);
                this._normal.modified = false;
            }
            visitor.mat2(this.name, this.matrix, false, canvasId);
        };
        return ReflectionFacetE2;
    })(Shareable);
    return ReflectionFacetE2;
});
