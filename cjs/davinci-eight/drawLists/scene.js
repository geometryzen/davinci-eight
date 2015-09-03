var expectArg = require('../checks/expectArg');
var isDefined = require('../checks/isDefined');
var ProgramInfo = (function () {
    function ProgramInfo(program) {
        this.drawables = [];
        this.program = program;
    }
    return ProgramInfo;
})();
var scene = function () {
    var programs = {};
    var refCount = 0;
    var $context;
    function traversePrograms(callback) {
        Object.keys(programs).forEach(function (programId) {
            callback(programs[programId].program);
        });
    }
    function traverseProgramInfos(callback) {
        Object.keys(programs).forEach(function (programId) {
            callback(programs[programId]);
        });
    }
    var self = {
        addRef: function () {
            refCount++;
            // console.log("scene.addRef() => " + refCount);
        },
        release: function () {
            refCount--;
            // console.log("scene.release() => " + refCount);
            if (refCount === 0) {
                self.traverse(function (drawable) {
                    drawable.release();
                });
            }
        },
        contextFree: function () {
            self.traverse(function (drawable) {
                drawable.contextFree();
            });
        },
        contextGain: function (context) {
            if ($context !== context) {
                $context = expectArg('context', context).toSatisfy(context instanceof WebGLRenderingContext, "context must implement WebGLRenderingContext").value;
                Object.keys(programs).forEach(function (programId) {
                    programs[programId].drawables.forEach(function (drawable) {
                        drawable.contextGain(context);
                        var program = drawable.program;
                        var programId = program.programId;
                    });
                });
            }
        },
        contextLoss: function () {
            if (isDefined($context)) {
                $context = void 0;
                Object.keys(programs).forEach(function (programId) {
                    programs[programId].drawables.forEach(function (drawable) {
                        drawable.contextLoss();
                    });
                });
            }
        },
        hasContext: function () {
            return isDefined($context);
        },
        add: function (drawable) {
            drawable.addRef();
            var program = drawable.program;
            var programId = program.programId;
            if (!programs[programId]) {
                programs[programId] = new ProgramInfo(program);
            }
            programs[programId].drawables.push(drawable);
            if (self.hasContext()) {
                program.contextGain($context);
                drawable.contextGain($context);
            }
        },
        remove: function (drawable) {
            var program = drawable.program;
            var programId = program.programId;
            if (programs[programId]) {
                var programInfo = new ProgramInfo(program);
                var index = programInfo.drawables.indexOf(drawable);
                if (index >= 0) {
                    programInfo.drawables.splice(index, 1);
                    if (programInfo.drawables.length === 0) {
                        delete programs[programId];
                    }
                }
            }
            else {
                throw new Error("drawable not found.");
            }
        },
        setUniforms: function (values) {
            traversePrograms(function (program) {
                program.use();
                program.setUniforms(values);
            });
        },
        uniform1f: function (name, x, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniform1f(name, x, picky);
            });
        },
        uniform1fv: function (name, value, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniform1fv(name, value, picky);
            });
        },
        uniform2f: function (name, x, y, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniform2f(name, x, y, picky);
            });
        },
        uniform2fv: function (name, value, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniform2fv(name, value, picky);
            });
        },
        uniform3f: function (name, x, y, z, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniform3f(name, x, y, z, picky);
            });
        },
        uniform3fv: function (name, value, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniform3fv(name, value, picky);
            });
        },
        uniform4f: function (name, x, y, z, w, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniform4f(name, x, y, z, w, picky);
            });
        },
        uniform4fv: function (name, value, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniform4fv(name, value, picky);
            });
        },
        uniformMatrix2fv: function (name, transpose, matrix, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniformMatrix2fv(name, transpose, matrix, picky);
            });
        },
        uniformMatrix3fv: function (name, transpose, matrix, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniformMatrix3fv(name, transpose, matrix, picky);
            });
        },
        uniformMatrix4fv: function (name, transpose, matrix, picky) {
            traversePrograms(function (program) {
                program.use();
                program.uniformMatrix4fv(name, transpose, matrix, picky);
            });
        },
        traverse: function (callback) {
            Object.keys(programs).forEach(function (programId) {
                programs[programId].drawables.forEach(callback);
            });
        }
    };
    return self;
};
module.exports = scene;
