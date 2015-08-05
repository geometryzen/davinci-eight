var CylinderBuilder = require('../mesh/CylinderBuilder');
var drawableModel = require('../objects/drawableModel');
var smartProgram = require('../programs/smartProgram');
var Node = require('../uniforms/Node');
var Arrow = (function () {
    function Arrow(ambients) {
        this.$length = 1;
        this.model = new Node();
        var headMesh = new CylinderBuilder().setRadiusTop(0.0).setRadiusBottom(0.08).setHeight(0.2).buildMesh();
        var tailMesh = new CylinderBuilder().setRadiusTop(0.01).setRadiusBottom(0.01).buildMesh();
        var shaders = smartProgram(headMesh.getAttribMeta(), [this.model.getUniformMeta(), ambients.getUniformMeta()]);
        this.headModel = new Node();
        this.headModel.setParent(this.model);
        this.head = drawableModel(headMesh, shaders, this.headModel);
        this.tailModel = new Node();
        this.tailModel.setParent(this.model);
        this.tailModel.position.y = -0.2;
        this.setLength(1);
        this.tail = drawableModel(tailMesh, shaders, this.tailModel);
    }
    Object.defineProperty(Arrow.prototype, "length", {
        get: function () {
            return this.tailModel.scale.y + 0.2;
        },
        set: function (value) {
            this.setLength(value);
        },
        enumerable: true,
        configurable: true
    });
    Arrow.prototype.setLength = function (length) {
        this.headModel.position.y = (length / 2) - 0.2;
        this.tailModel.scale.y = length - 0.2;
        return this;
    };
    Object.defineProperty(Arrow.prototype, "color", {
        set: function (value) {
            this.headModel.color = value;
            this.tailModel.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arrow.prototype, "position", {
        get: function () {
            return this.model.position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arrow.prototype, "positione", {
        set: function (value) {
            this.model.position = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arrow.prototype, "attitude", {
        get: function () {
            return this.model.attitude;
        },
        set: function (value) {
            this.model.attitude = value;
        },
        enumerable: true,
        configurable: true
    });
    Arrow.prototype.useProgram = function () {
        this.head.shaders.use();
    };
    Arrow.prototype.draw = function (ambients) {
        this.head.draw(ambients);
        this.tail.draw(ambients);
    };
    Arrow.prototype.contextFree = function () {
        this.head.contextFree();
        this.tail.contextFree();
    };
    Arrow.prototype.contextGain = function (context, contextId) {
        this.head.contextGain(context, contextId);
        this.tail.contextGain(context, contextId);
    };
    Arrow.prototype.contextLoss = function () {
        this.head.contextLoss();
        this.tail.contextLoss();
    };
    Arrow.prototype.hasContext = function () {
        return this.head.hasContext();
    };
    return Arrow;
})();
module.exports = Arrow;
