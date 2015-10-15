var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable'], function (require, exports, Shareable) {
    var AnimateDrawableCommand = (function (_super) {
        __extends(AnimateDrawableCommand, _super);
        function AnimateDrawableCommand(drawableName, facetName, propName, animation) {
            _super.call(this, 'AnimateDrawableCommand');
            this.drawableName = drawableName;
            this.facetName = facetName;
            this.propName = propName;
            this.animation = animation;
            this.animation.addRef();
        }
        AnimateDrawableCommand.prototype.destructor = function () {
            this.animation.release();
            this.animation = void 0;
            _super.prototype.destructor.call(this);
        };
        AnimateDrawableCommand.prototype.redo = function (slide, director) {
            var drawable = director.getDrawable(this.drawableName);
            var target = drawable.getFacet(this.facetName);
            slide.pushAnimation(target, this.propName, this.animation);
        };
        AnimateDrawableCommand.prototype.undo = function (slide, director) {
            var drawable = director.getDrawable(this.drawableName);
            var target = drawable.getFacet(this.facetName);
            var animation = slide.popAnimation(target, this.propName);
            animation.release();
        };
        return AnimateDrawableCommand;
    })(Shareable);
    return AnimateDrawableCommand;
});
