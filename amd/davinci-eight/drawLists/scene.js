define(["require", "exports", '../checks/expectArg', '../checks/isDefined'], function (require, exports, expectArg, isDefined) {
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
                Object.keys(programs).forEach(function (programId) {
                    var programInfo = programs[programId];
                    var program = programInfo.program;
                    program.use();
                    program.setUniforms(values);
                });
            },
            setUniform3fv: function (name, value) {
                Object.keys(programs).forEach(function (programId) {
                    var programInfo = programs[programId];
                    var program = programInfo.program;
                    program.use();
                    program.setUniform3fv(name, value);
                });
            },
            setUniformMatrix4fv: function (name, matrix, transpose) {
                if (transpose === void 0) { transpose = false; }
                Object.keys(programs).forEach(function (programId) {
                    var programInfo = programs[programId];
                    var program = programInfo.program;
                    program.use();
                    program.setUniformMatrix4fv(name, matrix, transpose);
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
    return scene;
});
