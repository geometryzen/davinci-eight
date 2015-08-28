var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var IdentityAttribProvider = require('../core/IdentityAttribProvider');
var Symbolic = require('../core/Symbolic');
var DefaultAttribProvider = (function (_super) {
    __extends(DefaultAttribProvider, _super);
    function DefaultAttribProvider() {
        _super.call(this);
    }
    DefaultAttribProvider.prototype.draw = function (context) {
        /*
        switch(this.drawMode) {
          case DrawMode.POINTS: {
            context.drawArrays(context.POINTS, 0, this.points.length * 1);
          }
          break;
          case DrawMode.LINES: {
            context.drawArrays(context.LINES, 0, this.lines.length * 2);
          }
          break;
          case DrawMode.TRIANGLES: {
            //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
            context.drawArrays(context.TRIANGLES, 0, this.geometry.faces.length * 3);
          }
          break;
          default : {
          }
        }
        */
    };
    DefaultAttribProvider.prototype.update = function () {
        return _super.prototype.update.call(this);
    };
    DefaultAttribProvider.prototype.getAttribArray = function (name) {
        return _super.prototype.getAttribArray.call(this, name);
    };
    DefaultAttribProvider.prototype.getAttribMeta = function () {
        var attributes = _super.prototype.getAttribMeta.call(this);
        attributes[Symbolic.ATTRIBUTE_POSITION] = { glslType: 'vec3', size: 3 };
        return attributes;
    };
    DefaultAttribProvider.prototype.hasElementArray = function () {
        return _super.prototype.hasElementArray.call(this);
    };
    DefaultAttribProvider.prototype.getElementArray = function () {
        return _super.prototype.getElementArray.call(this);
    };
    return DefaultAttribProvider;
})(IdentityAttribProvider);
module.exports = DefaultAttribProvider;
