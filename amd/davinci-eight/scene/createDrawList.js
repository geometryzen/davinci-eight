define(["require", "exports", '../utils/IUnknownArray', '../utils/NumberIUnknownMap', '../utils/refChange', '../utils/StringIUnknownMap', '../utils/uuid4'], function (require, exports, IUnknownArray, NumberIUnknownMap, refChange, StringIUnknownMap, uuid4) {
    var CLASS_NAME_DRAWLIST = "createDrawList";
    var CLASS_NAME_GROUP = "DrawableGroup";
    var CLASS_NAME_ALL = "DrawableGroups";
    // FIXME; Probably good to have another collection of DrawableGroup
    /**
     * A grouping of IDrawable, by IProgram.
     */
    var DrawableGroup = (function () {
        function DrawableGroup(program) {
            this._drawables = new IUnknownArray();
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._program = program;
            this._program.addRef();
            refChange(this._uuid, CLASS_NAME_GROUP, +1);
        }
        DrawableGroup.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, CLASS_NAME_GROUP, +1);
            return this._refCount;
        };
        DrawableGroup.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, CLASS_NAME_GROUP, -1);
            if (this._refCount === 0) {
                this._program.release();
                this._program = void 0;
                this._drawables.release();
                this._drawables = void 0;
                this._refCount = void 0;
                this._uuid = void 0;
                return 0;
            }
            else {
                return this._refCount;
            }
        };
        /**
         * accept provides a way to push out the IProgram without bumping the reference count.
         */
        DrawableGroup.prototype.accept = function (visitor) {
            visitor(this._program);
        };
        Object.defineProperty(DrawableGroup.prototype, "length", {
            get: function () {
                return this._drawables.length;
            },
            enumerable: true,
            configurable: true
        });
        DrawableGroup.prototype.push = function (drawable) {
            this._drawables.push(drawable);
        };
        DrawableGroup.prototype.remove = function (drawable) {
            var drawables = this._drawables;
            var index = drawables.indexOf(drawable);
            if (index >= 0) {
                drawables.splice(index, 1).forEach(function (drawable) {
                    drawable.release();
                });
            }
        };
        DrawableGroup.prototype.traverse = function (callback) {
            this._drawables.forEach(callback);
        };
        return DrawableGroup;
    })();
    /**
     * Should look like a set of Drawable Groups
     */
    var DrawableGroups = (function () {
        function DrawableGroups() {
            /**
             *
             */
            this._groups = new StringIUnknownMap();
            this._refCount = 1;
            this._uuid = uuid4().generate();
            refChange(this._uuid, CLASS_NAME_ALL, +1);
        }
        DrawableGroups.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, CLASS_NAME_ALL, +1);
            return this._refCount;
        };
        DrawableGroups.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, CLASS_NAME_ALL, -1);
            if (this._refCount === 0) {
                this._groups.release();
                this._groups = void 0;
                this._refCount = void 0;
                this._uuid = void 0;
                return 0;
            }
            else {
                return this._refCount;
            }
        };
        DrawableGroups.prototype.add = function (drawable) {
            // Now let's see if we can get a program...
            var program = drawable.material;
            if (program) {
                try {
                    var programId = program.programId;
                    var programInfo = this._groups.get(programId);
                    if (!programInfo) {
                        programInfo = new DrawableGroup(program);
                        this._groups.put(programId, programInfo);
                    }
                    programInfo.push(drawable);
                    programInfo.release();
                }
                finally {
                    program.release();
                }
            }
            else {
            }
        };
        DrawableGroups.prototype.remove = function (drawable) {
            var program = drawable.material;
            if (program) {
                try {
                    var programId = program.programId;
                    if (this._groups.exists(programId)) {
                        var group = this._groups.get(programId);
                        group.remove(drawable);
                        if (group.length === 0) {
                            delete this._groups.remove(programId);
                        }
                        group.release();
                    }
                    else {
                        throw new Error("drawable not found?!");
                    }
                }
                finally {
                    program.release();
                }
            }
        };
        DrawableGroups.prototype.traverseDrawables = function (callback) {
            this._groups.forEach(function (groupId, group) {
                group.traverse(callback);
            });
        };
        DrawableGroups.prototype.traversePrograms = function (callback) {
            this._groups.forEach(function (groupId, group) {
                group.accept(callback);
            });
        };
        return DrawableGroups;
    })();
    var createDrawList = function () {
        var drawableGroups = new DrawableGroups();
        var managers = new NumberIUnknownMap();
        var refCount = 1;
        var uuid = uuid4().generate();
        var self = {
            addRef: function () {
                refCount++;
                refChange(uuid, CLASS_NAME_DRAWLIST, +1);
                return refCount;
            },
            release: function () {
                refCount--;
                refChange(uuid, CLASS_NAME_DRAWLIST, -1);
                if (refCount === 0) {
                    drawableGroups.release();
                    drawableGroups = void 0;
                    managers.release();
                    managers = void 0;
                    refCount = void 0;
                    uuid = void 0;
                    return 0;
                }
                else {
                    return refCount;
                }
            },
            contextFree: function (canvasId) {
                drawableGroups.traverseDrawables(function (drawable) {
                    drawable.contextFree(canvasId);
                });
            },
            contextGain: function (manager) {
                if (!managers.exists(manager.canvasId)) {
                    managers.put(manager.canvasId, manager);
                }
                drawableGroups.traverseDrawables(function (drawable) {
                    drawable.contextGain(manager);
                });
            },
            contextLoss: function (canvasId) {
                drawableGroups.traverseDrawables(function (drawable) {
                    drawable.contextLoss(canvasId);
                });
            },
            add: function (drawable) {
                // If we have managers povide them to the drawable before asking for the program.
                // FIXME: Do we have to be careful about whether the manager has a context?
                managers.forEach(function (id, manager) {
                    drawable.contextGain(manager);
                });
                drawableGroups.add(drawable);
            },
            remove: function (drawable) {
                drawableGroups.remove(drawable);
            },
            uniform1f: function (name, x) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniform1f(name, x);
                    });
                });
            },
            uniform2f: function (name, x, y) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniform2f(name, x, y);
                    });
                });
            },
            uniform3f: function (name, x, y, z) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniform3f(name, x, y, z);
                    });
                });
            },
            uniform4f: function (name, x, y, z, w) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniform4f(name, x, y, z, w);
                    });
                });
            },
            uniformMatrix1: function (name, transpose, matrix) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniformMatrix1(name, transpose, matrix);
                    });
                });
            },
            uniformMatrix2: function (name, transpose, matrix) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniformMatrix2(name, transpose, matrix);
                    });
                });
            },
            uniformMatrix3: function (name, transpose, matrix) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniformMatrix3(name, transpose, matrix);
                    });
                });
            },
            uniformMatrix4: function (name, transpose, matrix) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniformMatrix4(name, transpose, matrix);
                    });
                });
            },
            uniformVector1: function (name, vector) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniformVector1(name, vector);
                    });
                });
            },
            uniformVector2: function (name, vector) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniformVector2(name, vector);
                    });
                });
            },
            uniformVector3: function (name, vector) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniformVector3(name, vector);
                    });
                });
            },
            uniformVector4: function (name, vector) {
                managers.forEach(function (canvasId, manager) {
                    drawableGroups.traversePrograms(function (program) {
                        program.use(canvasId);
                        program.uniformVector4(name, vector);
                    });
                });
            },
            traverse: function (callback) {
                drawableGroups.traverseDrawables(callback);
            }
        };
        refChange(uuid, CLASS_NAME_DRAWLIST, +1);
        return self;
    };
    return createDrawList;
});
