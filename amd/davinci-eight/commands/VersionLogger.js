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
     * @class VersionLogger
     * @extends Shareable
     * @implements IContextCommand
     */
    var VersionLogger = (function (_super) {
        __extends(VersionLogger, _super);
        function VersionLogger() {
            _super.call(this, 'VersionLogger');
        }
        VersionLogger.prototype.execute = function (gl) {
            console.log(gl.getParameter(gl.VERSION));
        };
        VersionLogger.prototype.destructor = function () {
        };
        return VersionLogger;
    })(Shareable);
    return VersionLogger;
});
