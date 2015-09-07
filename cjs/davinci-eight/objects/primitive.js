var isDefined = require('../checks/isDefined');
var primitive = function (mesh, program, model) {
    var $context;
    var refCount = 1;
    mesh.addRef();
    program.addRef();
    var self = {
        get mesh() {
            return mesh;
        },
        get program() {
            return program;
        },
        get model() {
            return model;
        },
        addRef: function () {
            refCount++;
            // console.log("primitive.addRef() => " + refCount);
            return refCount;
        },
        release: function () {
            refCount--;
            // console.log("primitive.release() => " + refCount);
            if (refCount === 0) {
                mesh.release();
                mesh = void 0;
                program.release();
                program = void 0;
            }
            return refCount;
        },
        contextFree: function () {
            if (isDefined($context)) {
                $context = void 0;
                mesh.contextFree();
                program.contextFree();
            }
        },
        contextGain: function (context) {
            if ($context !== context) {
                $context = context;
                mesh.contextGain(context);
                program.contextGain(context);
            }
        },
        contextLoss: function () {
            if (isDefined($context)) {
                $context = void 0;
                mesh.contextLoss();
                program.contextLoss();
            }
        },
        accept: function (visitor) {
            visitor.primitive(mesh, program, model);
        }
    };
    return self;
};
module.exports = primitive;
