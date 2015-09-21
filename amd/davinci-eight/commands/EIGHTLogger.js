var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../utils/Shareable'], function (require, exports, core, Shareable) {
    /**
     * <p>
     * Displays details about EIGHT to the console.
     * <p>
     * @class EIGHTLogger
     * @extends Shareable
     * @implements IContextCommand
     */
    var EIGHTLogger = (function (_super) {
        __extends(EIGHTLogger, _super);
        /**
         * <p>
         * Initializes <b>the</b> `type` property to 'EIGHTLogger'.
         * </p>
         * @class EIGHTLogger
         * @constructor
         */
        function EIGHTLogger() {
            _super.call(this, 'EIGHTLogger');
        }
        /**
         * Logs the version, GitHub URL, and last modified date to the console.
         * @method execute
         * @param unused WebGLRenderingContext
         */
        EIGHTLogger.prototype.execute = function (unused) {
            console.log(core.NAMESPACE + " " + core.VERSION + " (" + core.GITHUB + ") " + core.LAST_MODIFIED);
        };
        /**
         * Does nothing.
         * @protected
         * @method destructor
         * @return void
         */
        EIGHTLogger.prototype.destructor = function () {
        };
        return EIGHTLogger;
    })(Shareable);
    return EIGHTLogger;
});
