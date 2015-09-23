define(["require", "exports", '../i18n/readOnly', '../math/Vector3'], function (require, exports, readOnly, Vector3) {
    /**
     * @class EulerModel
     */
    var EulerModel = (function () {
        /**
         * @class EulerModel
         * @constructor
         */
        function EulerModel() {
            this._rotation = new Vector3();
        }
        /**
         * @method setUniforms
         * @param visitor {UniformDataVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        EulerModel.prototype.setUniforms = function (visitor, canvasId) {
            console.warn("EulerModel.setUniforms");
        };
        Object.defineProperty(EulerModel.prototype, "rotation", {
            /**
             * @property rotation
             * @type {Vector3}
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
        return EulerModel;
    })();
    return EulerModel;
});
