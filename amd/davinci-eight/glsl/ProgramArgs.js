var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DefaultNodeEventHandler'], function (require, exports, DefaultNodeEventHandler) {
    var ProgramArgs = (function (_super) {
        __extends(ProgramArgs, _super);
        function ProgramArgs() {
            _super.call(this);
        }
        ProgramArgs.prototype.declaration = function (kind, modifiers, type, names) {
            console.log("" + kind + " " + modifiers.join(" ") + " " + type + " " + names.join(", "));
        };
        return ProgramArgs;
    })(DefaultNodeEventHandler);
    return ProgramArgs;
});
