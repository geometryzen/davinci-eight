var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../i18n/readOnly', '../utils/Shareable', '../math/MutableVectorE3'], function (require, exports, readOnly, Shareable, MutableVectorE3) {
    /**
     * @class EulerFacet
     */
    var EulerFacet = (function (_super) {
        __extends(EulerFacet, _super);
        /**
         * @class EulerFacet
         * @constructor
         */
        function EulerFacet() {
            _super.call(this, 'EulerFacet');
            this._rotation = new MutableVectorE3();
        }
        EulerFacet.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        EulerFacet.prototype.getProperty = function (name) {
            return void 0;
        };
        EulerFacet.prototype.setProperty = function (name, value) {
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        EulerFacet.prototype.setUniforms = function (visitor, canvasId) {
            console.warn("EulerFacet.setUniforms");
        };
        Object.defineProperty(EulerFacet.prototype, "rotation", {
            /**
             * @property rotation
             * @type {MutableVectorE3}
             * @readOnly
             */
            get: function () {
                return this._rotation;
            },
            set: function (unused) {
                throw new Error(readOnly('rotation').message);
            },
            enumerable: true,
            configurable: true
        });
        return EulerFacet;
    })(Shareable);
    return EulerFacet;
});
