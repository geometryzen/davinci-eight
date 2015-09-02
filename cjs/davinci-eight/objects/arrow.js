var Node = require('../uniforms/Node');
var primitive = require('../objects/primitive');
var arrowMesh = require('../mesh/arrowMesh');
var smartProgram = require('../programs/smartProgram');
var Arrow3D = require('../objects/Arrow3D');
var expectArg = require('../checks/expectArg');
var isDefined = require('../checks/isDefined');
var ArrowWrapper = (function () {
    function ArrowWrapper(primitive) {
        this.primitive = primitive;
    }
    Object.defineProperty(ArrowWrapper.prototype, "model", {
        get: function () {
            return this.primitive.model;
        },
        enumerable: true,
        configurable: true
    });
    ArrowWrapper.prototype.setMagnitude = function (magnitude) {
        expectArg('magnitude', magnitude).toBeNumber().toSatisfy(magnitude >= 0, "magnitude must be positive");
        this.primitive.model.scale.x = magnitude;
        this.primitive.model.scale.y = magnitude;
        this.primitive.model.scale.z = magnitude;
        return this;
    };
    Object.defineProperty(ArrowWrapper.prototype, "program", {
        get: function () {
            return this.primitive.program;
        },
        enumerable: true,
        configurable: true
    });
    ArrowWrapper.prototype.draw = function () {
        return this.primitive.draw();
    };
    ArrowWrapper.prototype.addRef = function () {
        return this.primitive.addRef();
    };
    ArrowWrapper.prototype.release = function () {
        return this.primitive.release();
    };
    ArrowWrapper.prototype.contextFree = function () {
        return this.primitive.contextFree();
    };
    ArrowWrapper.prototype.contextGain = function (context) {
        return this.primitive.contextGain(context);
    };
    ArrowWrapper.prototype.contextLoss = function () {
        return this.primitive.contextLoss();
    };
    ArrowWrapper.prototype.hasContext = function () {
        return this.primitive.hasContext();
    };
    return ArrowWrapper;
})();
// TODO" Should only take the UniformMetaInfos for construction.
function arrow(ambients, options) {
    options = options || {};
    var flavor = isDefined(options.flavor) ? options.flavor : 0;
    if (flavor === 0) {
        var mesh = arrowMesh(options);
        var model = new Node(options);
        var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return new ArrowWrapper(primitive(mesh, shaders, model));
    }
    else {
        return new Arrow3D(ambients, options);
    }
}
module.exports = arrow;
