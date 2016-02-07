var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../collections/IUnknownArray', '../core/Shareable'], function (require, exports, IUnknownArray_1, Shareable_1) {
    var SlideCommands = (function (_super) {
        __extends(SlideCommands, _super);
        function SlideCommands() {
            _super.call(this, 'SlideCommands');
            this.commands = new IUnknownArray_1.default();
        }
        SlideCommands.prototype.destructor = function () {
            this.commands.release();
            this.commands = void 0;
            _super.prototype.destructor.call(this);
        };
        SlideCommands.prototype.pushWeakRef = function (command) {
            return this.commands.pushWeakRef(command);
        };
        SlideCommands.prototype.redo = function (slide, director) {
            for (var i = 0, iLength = this.commands.length; i < iLength; i++) {
                this.commands.getWeakRef(i).redo(slide, director);
            }
        };
        SlideCommands.prototype.undo = function (slide, director) {
            for (var i = this.commands.length - 1; i >= 0; i--) {
                this.commands.getWeakRef(i).undo(slide, director);
            }
        };
        return SlideCommands;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SlideCommands;
});
