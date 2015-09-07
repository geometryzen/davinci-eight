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
        var refCount = 1;
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
                return refCount;
            },
            release: function () {
                refCount--;
                // console.log("scene.release() => " + refCount);
                if (refCount === 0) {
                    self.traverse(function (drawable) {
                        drawable.release();
                    });
                }
                return refCount;
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
            add: function (drawable) {
                drawable.addRef();
                var program = drawable.program;
                var programId = program.programId;
                if (!programs[programId]) {
                    programs[programId] = new ProgramInfo(program);
                }
                programs[programId].drawables.push(drawable);
                if ($context) {
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
            uniform1f: function (name, x) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniform1f(name, x);
                });
            },
            uniform2f: function (name, x, y) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniform2f(name, x, y);
                });
            },
            uniform3f: function (name, x, y, z) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniform3f(name, x, y, z);
                });
            },
            uniform4f: function (name, x, y, z, w) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniform4f(name, x, y, z, w);
                });
            },
            uniformMatrix1: function (name, transpose, matrix) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformMatrix1(name, transpose, matrix);
                });
            },
            uniformMatrix2: function (name, transpose, matrix) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformMatrix2(name, transpose, matrix);
                });
            },
            uniformMatrix3: function (name, transpose, matrix) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformMatrix3(name, transpose, matrix);
                });
            },
            uniformMatrix4: function (name, transpose, matrix) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformMatrix4(name, transpose, matrix);
                });
            },
            uniformVector1: function (name, vector) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformVector1(name, vector);
                });
            },
            uniformVector2: function (name, vector) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformVector2(name, vector);
                });
            },
            uniformVector3: function (name, vector) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformVector3(name, vector);
                });
            },
            uniformVector4: function (name, vector) {
                traversePrograms(function (program) {
                    program.use();
                    program.uniformVector4(name, vector);
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
