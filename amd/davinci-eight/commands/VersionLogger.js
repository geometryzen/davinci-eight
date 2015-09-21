var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    /**
     * <p>
     * Displays details about the WegGL version to the console.
     * <p>
     * <p>
     * Initializes the <code>type</code> property to <code>'VersionLogger'</code> for reference count tracking.
     * <p>
     * @class VersionLogger
     * @extends Shareable
     * @implements IContextCommand
     */
    var VersionLogger = (function (_super) {
        __extends(VersionLogger, _super);
        /**
         * @class VersionLogger
         * @constructor
         */
        function VersionLogger() {
            _super.call(this, 'VersionLogger');
        }
        /**
         * <p>
         * Logs the WebGL <code>VERSION</code> parameter to the console.
         * </p>
         * @method execute
         * @param gl {WebGLRenderingContext}
         * @return {void}
         */
        VersionLogger.prototype.execute = function (gl) {
            console.log(gl.getParameter(gl.VERSION));
        };
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        VersionLogger.prototype.destructor = function () {
        };
        return VersionLogger;
    })(Shareable);
    return VersionLogger;
});
