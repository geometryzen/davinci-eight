var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../collections/IUnknownArray', '../scene/MonitorList', '../checks/mustBeArray', '../checks/mustBeFunction', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../collections/NumberIUnknownMap', '../utils/Shareable', '../collections/StringIUnknownMap'], function (require, exports, core_1, IUnknownArray_1, MonitorList_1, mustBeArray_1, mustBeFunction_1, mustBeNumber_1, mustBeObject_1, mustBeString_1, NumberIUnknownMap_1, Shareable_1, StringIUnknownMap_1) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    var DrawableGroup = (function (_super) {
        __extends(DrawableGroup, _super);
        function DrawableGroup(program) {
            _super.call(this, 'DrawableGroup');
            this._program = program;
            this._program.addRef();
            this._drawables = new IUnknownArray_1.default();
        }
        DrawableGroup.prototype.destructor = function () {
            this._program.release();
            this._drawables.release();
            _super.prototype.destructor.call(this);
        };
        DrawableGroup.prototype.acceptProgram = function (visitor) {
            visitor(this._program);
        };
        Object.defineProperty(DrawableGroup.prototype, "length", {
            get: function () {
                return this._drawables.length;
            },
            enumerable: true,
            configurable: true
        });
        DrawableGroup.prototype.containsDrawable = function (drawable) {
            return this._drawables.indexOf(drawable) >= 0;
        };
        DrawableGroup.prototype.push = function (drawable) {
            this._drawables.push(drawable);
        };
        DrawableGroup.prototype.remove = function (drawable) {
            var drawables = this._drawables;
            var index = drawables.indexOf(drawable);
            if (index >= 0) {
                drawables.splice(index, 1).release();
            }
        };
        DrawableGroup.prototype.draw = function (ambients, canvasId) {
            var graphicsProgram = this._program;
            graphicsProgram.use(canvasId);
            if (ambients) {
                var aLength = ambients.length;
                for (var a = 0; a < aLength; a++) {
                    var ambient = ambients[a];
                    ambient.setUniforms(graphicsProgram, canvasId);
                }
            }
            var drawables = this._drawables;
            var iLength = drawables.length;
            for (var i = 0; i < iLength; i++) {
                var drawable = drawables.getWeakRef(i);
                drawable.setUniforms(canvasId);
                var buffers = drawable.graphicsBuffers;
                buffers.draw(graphicsProgram, canvasId);
                buffers.release();
            }
        };
        DrawableGroup.prototype.findOne = function (match) {
            var drawables = this._drawables;
            for (var i = 0, iLength = drawables.length; i < iLength; i++) {
                var candidate = drawables.get(i);
                if (match(candidate)) {
                    return candidate;
                }
                else {
                    candidate.release();
                }
            }
            return void 0;
        };
        DrawableGroup.prototype.traverseDrawables = function (callback) {
            this._drawables.forEach(callback);
        };
        return DrawableGroup;
    })(Shareable_1.default);
    var DrawableGroups = (function (_super) {
        __extends(DrawableGroups, _super);
        function DrawableGroups() {
            _super.call(this, 'DrawableGroups');
            this._groups = new StringIUnknownMap_1.default();
        }
        DrawableGroups.prototype.destructor = function () {
            this._groups.release();
            _super.prototype.destructor.call(this);
        };
        DrawableGroups.prototype.add = function (drawable) {
            var program = drawable.graphicsProgram;
            if (program) {
                try {
                    var programId = program.uuid;
                    var group = this._groups.get(programId);
                    if (!group) {
                        group = new DrawableGroup(program);
                        this._groups.put(programId, group);
                    }
                    if (!group.containsDrawable(drawable)) {
                        group.push(drawable);
                    }
                    group.release();
                }
                finally {
                    program.release();
                }
            }
            else {
            }
        };
        DrawableGroups.prototype.containsDrawable = function (drawable) {
            var graphicsProgram = drawable.graphicsProgram;
            if (graphicsProgram) {
                try {
                    var group = this._groups.getWeakRef(graphicsProgram.uuid);
                    if (group) {
                        return group.containsDrawable(drawable);
                    }
                    else {
                        return false;
                    }
                }
                finally {
                    graphicsProgram.release();
                }
            }
            else {
                return false;
            }
        };
        DrawableGroups.prototype.findOne = function (match) {
            var groupIds = this._groups.keys;
            for (var i = 0, iLength = groupIds.length; i < iLength; i++) {
                var groupId = groupIds[i];
                var group = this._groups.getWeakRef(groupId);
                var found = group.findOne(match);
                if (found) {
                    return found;
                }
            }
            return void 0;
        };
        DrawableGroups.prototype.remove = function (drawable) {
            var material = drawable.graphicsProgram;
            if (material) {
                try {
                    var programId = material.uuid;
                    if (this._groups.exists(programId)) {
                        var group = this._groups.get(programId);
                        try {
                            group.remove(drawable);
                            if (group.length === 0) {
                                this._groups.remove(programId).release();
                            }
                        }
                        finally {
                            group.release();
                        }
                    }
                    else {
                    }
                }
                finally {
                    material.release();
                }
            }
        };
        DrawableGroups.prototype.draw = function (ambients, canvasId) {
            var drawGroups = this._groups;
            var materialKeys = drawGroups.keys;
            var materialsLength = materialKeys.length;
            for (var i = 0; i < materialsLength; i++) {
                var materialKey = materialKeys[i];
                var drawGroup = drawGroups.getWeakRef(materialKey);
                drawGroup.draw(ambients, canvasId);
            }
        };
        DrawableGroups.prototype.traverseDrawables = function (callback, callback2) {
            this._groups.forEach(function (groupId, group) {
                group.acceptProgram(callback2);
                group.traverseDrawables(callback);
            });
        };
        DrawableGroups.prototype.traversePrograms = function (callback) {
            this._groups.forEach(function (groupId, group) {
                group.acceptProgram(callback);
            });
        };
        return DrawableGroups;
    })(Shareable_1.default);
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, LOGGING_NAME);
            this._drawableGroups = new DrawableGroups();
            this._canvasIdToManager = new NumberIUnknownMap_1.default();
            mustBeArray_1.default('monitors', monitors);
            MonitorList_1.default.verify('monitors', monitors, ctorContext);
            this.monitors = new MonitorList_1.default(monitors);
            this.monitors.addContextListener(this);
            this.monitors.synchronize(this);
        }
        Scene.prototype.destructor = function () {
            this.monitors.removeContextListener(this);
            this.monitors.release();
            this._canvasIdToManager.release();
            this._drawableGroups.release();
            _super.prototype.destructor.call(this);
        };
        Scene.prototype.attachTo = function (monitor) {
            this.monitors.add(monitor);
            monitor.addContextListener(this);
        };
        Scene.prototype.detachFrom = function (monitor) {
            monitor.removeContextListener(this);
            this.monitors.remove(monitor);
        };
        Scene.prototype.add = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            this._canvasIdToManager.forEach(function (id, manager) {
                drawable.contextGain(manager);
            });
            this._drawableGroups.add(drawable);
        };
        Scene.prototype.containsDrawable = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            return this._drawableGroups.containsDrawable(drawable);
        };
        Scene.prototype.draw = function (ambients, canvasId) {
            if (!core_1.default.fastPath) {
                mustBeArray_1.default('ambients', ambients);
                mustBeNumber_1.default('canvasId', canvasId);
            }
            this._drawableGroups.draw(ambients, canvasId);
        };
        Scene.prototype.findOne = function (match) {
            mustBeFunction_1.default('match', match);
            return this._drawableGroups.findOne(match);
        };
        Scene.prototype.getDrawableByName = function (name) {
            if (!core_1.default.fastPath) {
                mustBeString_1.default('name', name);
            }
            return this._drawableGroups.findOne(function (drawable) { return drawable.name === name; });
        };
        Scene.prototype.getDrawablesByName = function (name) {
            mustBeString_1.default('name', name);
            var result = new IUnknownArray_1.default();
            this._drawableGroups.traverseDrawables(function (candidate) {
                if (candidate.name === name) {
                    result.push(candidate);
                }
            }, function (program) {
            });
            return result;
        };
        Scene.prototype.remove = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            this._drawableGroups.remove(drawable);
        };
        Scene.prototype.traverse = function (callback, canvasId, prolog) {
            mustBeFunction_1.default('callback', callback);
            mustBeNumber_1.default('canvasId', canvasId);
            this._drawableGroups.traverseDrawables(callback, prolog);
        };
        Scene.prototype.contextFree = function (canvasId) {
            mustBeNumber_1.default('canvasId', canvasId);
            this._drawableGroups.traverseDrawables(function (drawable) {
                drawable.contextFree(canvasId);
            }, function (program) {
                program.contextFree(canvasId);
            });
            this._canvasIdToManager.remove(canvasId);
        };
        Scene.prototype.contextGain = function (manager) {
            mustBeObject_1.default('manager', manager);
            if (!this._canvasIdToManager.exists(manager.canvasId)) {
                this._canvasIdToManager.put(manager.canvasId, manager);
                this._drawableGroups.traverseDrawables(function (drawable) {
                    drawable.contextGain(manager);
                }, function (material) {
                    material.contextGain(manager);
                });
            }
        };
        Scene.prototype.contextLost = function (canvasId) {
            mustBeNumber_1.default('canvasId', canvasId);
            if (this._canvasIdToManager.exists(canvasId)) {
                this._drawableGroups.traverseDrawables(function (drawable) {
                    drawable.contextLost(canvasId);
                }, function (material) {
                    material.contextLost(canvasId);
                });
                this._canvasIdToManager.remove(canvasId);
            }
        };
        return Scene;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scene;
});
