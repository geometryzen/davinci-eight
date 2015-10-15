var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable'], function (require, exports, Shareable) {
    var TestCommand = (function (_super) {
        __extends(TestCommand, _super);
        function TestCommand(name) {
            _super.call(this, 'TestCommand');
            this.name = name;
        }
        TestCommand.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        TestCommand.prototype.redo = function (slide, director) {
            console.log("redo => " + this.name);
        };
        TestCommand.prototype.undo = function (slide, director) {
            console.log("undo => " + this.name);
        };
        return TestCommand;
    })(Shareable);
    return TestCommand;
});
