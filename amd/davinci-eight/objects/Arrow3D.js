define(["require", "exports", '../mesh/CylinderMeshBuilder', '../objects/primitive', '../programs/smartProgram', '../uniforms/Node', '../checks/isDefined'], function (require, exports, CylinderMeshBuilder, primitive, smartProgram, Node, isDefined) {
    var Arrow3D = (function () {
        function Arrow3D(ambients, options) {
            this.$magnitude = 1;
            this._refCount = 0;
            options = options || {};
            this.$coneHeight = isDefined(options.coneHeight) ? options.coneHeight : 0.2;
            this.model = new Node();
            var headMesh = new CylinderMeshBuilder(options).setRadiusTop(0.0).setRadiusBottom(0.08).setHeight(this.$coneHeight).buildMesh();
            var tailMesh = new CylinderMeshBuilder(options).setRadiusTop(0.01).setRadiusBottom(0.01).buildMesh();
            this.program = smartProgram(headMesh.getAttribMeta(), [this.model.getUniformMeta(), ambients.getUniformMeta()]);
            this.headModel = new Node();
            this.headModel.setParent(this.model);
            this.head = primitive(headMesh, this.program, this.headModel);
            this.tailModel = new Node();
            this.tailModel.setParent(this.model);
            this.setMagnitude(1);
            this.tail = primitive(tailMesh, this.program, this.tailModel);
        }
        Object.defineProperty(Arrow3D.prototype, "magnitude", {
            get: function () {
                return this.tailModel.scale.y + this.$coneHeight;
            },
            set: function (value) {
                this.setMagnitude(value);
            },
            enumerable: true,
            configurable: true
        });
        Arrow3D.prototype.setMagnitude = function (magnitude) {
            this.headModel.position.y = (magnitude - this.$coneHeight) / 2;
            this.tailModel.scale.y = magnitude - this.$coneHeight;
            this.tailModel.position.y = -this.$coneHeight / 2;
            return this;
        };
        Arrow3D.prototype.draw = function () {
            this.head.draw();
            this.tail.draw();
        };
        Arrow3D.prototype.addRef = function () {
            this._refCount++;
        };
        Arrow3D.prototype.release = function () {
            this._refCount--;
            if (this._refCount === 0) {
                this.head.release();
                this.tail.release();
            }
        };
        Arrow3D.prototype.contextFree = function () {
            this.head.contextFree();
            this.tail.contextFree();
        };
        Arrow3D.prototype.contextGain = function (context) {
            this.head.contextGain(context);
            this.tail.contextGain(context);
        };
        Arrow3D.prototype.contextLoss = function () {
            this.head.contextLoss();
            this.tail.contextLoss();
        };
        Arrow3D.prototype.hasContext = function () {
            return this.head.hasContext();
        };
        return Arrow3D;
    })();
    return Arrow3D;
});
