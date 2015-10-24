var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../collections/IUnknownArray', '../utils/Shareable', '../slideshow/animations/ColorAnimation', '../slideshow/animations/Vector3Animation', '../slideshow/animations/Spinor3Animation', '../slideshow/commands/AnimateDrawableCommand', '../slideshow/commands/CreateCuboidDrawable', '../slideshow/commands/CreateDrawable', '../slideshow/commands/DestroyDrawableCommand', '../slideshow/commands/UseDrawableInSceneCommand'], function (require, exports, IUnknownArray, Shareable, ColorAnimation, Vector3Animation, Spinor3Animation, AnimateDrawableCommand, CreateCuboidDrawable, CreateDrawable, DestroyDrawableCommand, UseDrawableInSceneCommand) {
    var SlideCommands = (function (_super) {
        __extends(SlideCommands, _super);
        function SlideCommands() {
            _super.call(this, 'SlideCommands');
            this.commands = new IUnknownArray();
        }
        SlideCommands.prototype.destructor = function () {
            this.commands.release();
            this.commands = void 0;
            _super.prototype.destructor.call(this);
        };
        SlideCommands.prototype.animateDrawable = function (drawableName, facetName, propName, animation) {
            return this.commands.pushWeakRef(new AnimateDrawableCommand(drawableName, facetName, propName, animation));
        };
        SlideCommands.prototype.attitude = function (drawableName, attitude, duration, callback) {
            return this.animateDrawable(drawableName, 'model', 'R', new Spinor3Animation(attitude, duration, callback));
        };
        SlideCommands.prototype.color = function (drawableName, color, duration, callback) {
            return this.animateDrawable(drawableName, 'color', 'rgb', new ColorAnimation(color, duration, callback));
        };
        SlideCommands.prototype.createDrawable = function (drawableName, geometry) {
            return this.commands.pushWeakRef(new CreateDrawable(drawableName, geometry));
        };
        SlideCommands.prototype.cuboid = function (drawableName, a, b, c, k, subdivide, boundary) {
            return this.commands.pushWeakRef(new CreateCuboidDrawable(drawableName, a, b, c, k, subdivide, boundary));
        };
        SlideCommands.prototype.destroyDrawable = function (drawableName) {
            return this.commands.pushWeakRef(new DestroyDrawableCommand(drawableName));
        };
        SlideCommands.prototype.position = function (drawableName, position, duration, callback) {
            return this.animateDrawable(drawableName, 'model', 'X', new Vector3Animation(position, duration, callback));
        };
        SlideCommands.prototype.useDrawableInScene = function (drawableName, sceneName, confirm) {
            return this.commands.pushWeakRef(new UseDrawableInSceneCommand(drawableName, sceneName, confirm));
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
    })(Shareable);
    return SlideCommands;
});
