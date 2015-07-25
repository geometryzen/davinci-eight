var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultNodeEventHandler = require('./DefaultNodeEventHandler');
var Declaration = require('./Declaration');
var ProgramArgs = (function (_super) {
    __extends(ProgramArgs, _super);
    function ProgramArgs() {
        _super.call(this);
        this.attributes = [];
        this.constants = [];
        this.uniforms = [];
        this.varyings = [];
    }
    ProgramArgs.prototype.declaration = function (kind, modifiers, type, names) {
        var targets = {};
        targets['attribute'] = this.attributes;
        targets['const'] = this.constants;
        targets['uniform'] = this.uniforms;
        targets['varying'] = this.varyings;
        var target = targets[kind];
        if (target) {
            names.forEach(function (name) {
                target.push(new Declaration(kind, modifiers, type, name));
            });
        }
        else {
            throw new Error("Unexpected declaration kind: " + kind);
        }
    };
    return ProgramArgs;
})(DefaultNodeEventHandler);
module.exports = ProgramArgs;
