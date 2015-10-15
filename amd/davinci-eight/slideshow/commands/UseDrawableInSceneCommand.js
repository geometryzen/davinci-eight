var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable'], function (require, exports, Shareable) {
    var UseDrawableInSceneCommand = (function (_super) {
        __extends(UseDrawableInSceneCommand, _super);
        function UseDrawableInSceneCommand(drawableName, sceneName, confirm) {
            _super.call(this, 'TestCommand');
            this.drawableName = drawableName;
            this.sceneName = sceneName;
            this.confirm = confirm;
        }
        UseDrawableInSceneCommand.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        UseDrawableInSceneCommand.prototype.redo = function (slide, director) {
            this.wasHere = director.isDrawableInScene(this.drawableName, this.sceneName);
            director.useDrawableInScene(this.drawableName, this.sceneName, this.confirm);
        };
        UseDrawableInSceneCommand.prototype.undo = function (slide, director) {
            director.useDrawableInScene(this.drawableName, this.sceneName, this.wasHere);
        };
        return UseDrawableInSceneCommand;
    })(Shareable);
    return UseDrawableInSceneCommand;
});
