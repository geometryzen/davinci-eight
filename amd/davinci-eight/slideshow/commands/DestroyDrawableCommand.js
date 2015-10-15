var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable'], function (require, exports, Shareable) {
    var DestroyDrawableCommand = (function (_super) {
        __extends(DestroyDrawableCommand, _super);
        function DestroyDrawableCommand(name) {
            _super.call(this, 'DestroyDrawableCommand');
            this.name = name;
        }
        DestroyDrawableCommand.prototype.destructor = function () {
            if (this.drawable) {
                this.drawable.release();
                this.drawable = void 0;
            }
            _super.prototype.destructor.call(this);
        };
        DestroyDrawableCommand.prototype.redo = function (slide, director) {
            this.drawable = director.removeDrawable(this.name);
        };
        DestroyDrawableCommand.prototype.undo = function (slide, director) {
            director.addDrawable(this.drawable, this.name);
            this.drawable.release();
            this.drawable = void 0;
        };
        return DestroyDrawableCommand;
    })(Shareable);
    return DestroyDrawableCommand;
});
