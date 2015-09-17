define(["require", "exports", '../utils/NumberIUnknownMap'], function (require, exports, NumberIUnknownMap) {
    // FIXME: This should be reference counted
    var ProgramInfo = (function () {
        function ProgramInfo(program) {
            // TODO: This would be nice...
            //public drawables = new IUnknownList<IDrawable>();
            this.drawables = [];
            this.program = program;
        }
        return ProgramInfo;
    })();
    var createDrawList = function () {
        // FIXME Use StringIUnknownMap
        var programs = {};
        var refCount = 1;
        // FIXME: Why keep contexts when you have managers.
        // var _context: WebGLRenderingContext;
        //var _managers: {[id: number]: ContextManager } = {};
        var _managers = new NumberIUnknownMap();
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
            contextFree: function (canvasId) {
                self.traverse(function (drawable) {
                    drawable.contextFree(canvasId);
                });
            },
            contextGain: function (manager) {
                if (!_managers.exists(manager.canvasId)) {
                    _managers.put(manager.canvasId, manager);
                    _managers[manager.canvasId] = manager;
                    manager.addRef();
                }
                Object.keys(programs).forEach(function (programId) {
                    programs[programId].drawables.forEach(function (drawable) {
                        drawable.contextGain(manager);
                    });
                });
            },
            contextLoss: function (canvasId) {
                Object.keys(programs).forEach(function (programId) {
                    programs[programId].drawables.forEach(function (drawable) {
                        drawable.contextLoss(canvasId);
                    });
                });
            },
            add: function (drawable) {
                // If we have managers povide them to the drawable before asking for the program.
                // FIXME: Do we have to be careful about whether the manager has a context?
                _managers.forEach(function (id, manager) {
                    drawable.contextGain(manager);
                });
                // Now let's see if we can get a program...
                var program = drawable.material;
                if (program) {
                    try {
                        var programId = program.programId;
                        if (!programs[programId]) {
                            programs[programId] = new ProgramInfo(program);
                        }
                        programs[programId].drawables.push(drawable);
                        // TODO; When drawables is IUnkownList, this will not be needed.
                        drawable.addRef();
                        _managers.forEach(function (id, manager) {
                            program.contextGain(manager);
                        });
                    }
                    finally {
                        program.release();
                    }
                }
                else {
                }
            },
            remove: function (drawable) {
                var program = drawable.material;
                if (program) {
                    try {
                        var programId = program.programId;
                        if (programs[programId]) {
                            var programInfo = new ProgramInfo(program);
                            var index = programInfo.drawables.indexOf(drawable);
                            if (index >= 0) {
                                programInfo.drawables.splice(index, 1);
                                // TODO: When drawables is IUnknownList, this will not be needed.
                                drawable.release();
                                if (programInfo.drawables.length === 0) {
                                    delete programs[programId];
                                }
                            }
                        }
                        else {
                            throw new Error("drawable not found.");
                        }
                    }
                    finally {
                        program.release();
                    }
                }
            },
            uniform1f: function (name, x) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniform1f(name, x);
                });
            },
            uniform2f: function (name, x, y) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniform2f(name, x, y);
                });
            },
            uniform3f: function (name, x, y, z) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniform3f(name, x, y, z);
                });
            },
            uniform4f: function (name, x, y, z, w) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniform4f(name, x, y, z, w);
                });
            },
            uniformMatrix1: function (name, transpose, matrix) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformMatrix1(name, transpose, matrix);
                });
            },
            uniformMatrix2: function (name, transpose, matrix) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformMatrix2(name, transpose, matrix);
                });
            },
            uniformMatrix3: function (name, transpose, matrix) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformMatrix3(name, transpose, matrix);
                });
            },
            uniformMatrix4: function (name, transpose, matrix) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformMatrix4(name, transpose, matrix);
                });
            },
            uniformVector1: function (name, vector) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformVector1(name, vector);
                });
            },
            uniformVector2: function (name, vector) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformVector2(name, vector);
                });
            },
            uniformVector3: function (name, vector) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
                    program.uniformVector3(name, vector);
                });
            },
            uniformVector4: function (name, vector) {
                var canvasId = 0;
                console.warn("createDrawList using canvasId " + canvasId);
                traversePrograms(function (program) {
                    program.use(canvasId);
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
    return createDrawList;
});
