var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../collections/IUnknownArray', '../collections/NumberIUnknownMap', '../utils/refChange', '../utils/Shareable', '../collections/StringIUnknownMap', '../utils/uuid4'], function (require, exports, IUnknownArray_1, NumberIUnknownMap_1, refChange_1, Shareable_1, StringIUnknownMap_1, uuid4_1) {
    var CLASS_NAME_DRAWLIST = "createDrawList";
    var CLASS_NAME_GROUP = "DrawableGroup";
    var CLASS_NAME_ALL = "DrawableGroups";
    var DrawableGroup = (function () {
        function DrawableGroup(program) {
            this._drawables = new IUnknownArray_1.default();
            this._refCount = 1;
            this._uuid = uuid4_1.default().generate();
            this._program = program;
            this._program.addRef();
            refChange_1.default(this._uuid, CLASS_NAME_GROUP, +1);
        }
        DrawableGroup.prototype.addRef = function () {
            this._refCount++;
            refChange_1.default(this._uuid, CLASS_NAME_GROUP, +1);
            return this._refCount;
        };
        DrawableGroup.prototype.release = function () {
            this._refCount--;
            refChange_1.default(this._uuid, CLASS_NAME_GROUP, -1);
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
        Object.defineProperty(DrawableGroup.prototype, "material", {
            get: function () {
                this._program.addRef();
                return this._program;
            },
            enumerable: true,
            configurable: true
        });
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
            var i;
            var length;
            var drawables = this._drawables;
            var material = this._program;
            material.use(canvasId);
            if (ambients) {
                ambients.forEach(function (ambient) {
                    ambient.setUniforms(material, canvasId);
                });
            }
            length = drawables.length;
            for (i = 0; i < length; i++) {
                var drawable = drawables.get(i);
                drawable.draw(canvasId);
                drawable.release();
            }
        };
        DrawableGroup.prototype.traverseDrawables = function (callback) {
            this._drawables.forEach(callback);
        };
        return DrawableGroup;
    })();
    var DrawableGroups = (function (_super) {
        __extends(DrawableGroups, _super);
        function DrawableGroups() {
            _super.call(this, CLASS_NAME_ALL);
            this._groups = new StringIUnknownMap_1.default();
        }
        DrawableGroups.prototype.destructor = function () {
            this._groups.release();
            this._groups = void 0;
            _super.prototype.destructor.call(this);
        };
        DrawableGroups.prototype.add = function (drawable) {
            var program = drawable.material;
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
            var material = drawable.material;
            if (material) {
                try {
                    var group = this._groups.getWeakRef(material.uuid);
                    if (group) {
                        return group.containsDrawable(drawable);
                    }
                    else {
                        return false;
                    }
                }
                finally {
                    material.release();
                }
            }
            else {
                return false;
            }
        };
        DrawableGroups.prototype.remove = function (drawable) {
            var material = drawable.material;
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
            var drawGroups;
            var materialKey;
            var materialKeys;
            var materialsLength;
            var i;
            var drawGroup;
            drawGroups = this._groups;
            materialKeys = drawGroups.keys;
            materialsLength = materialKeys.length;
            for (i = 0; i < materialsLength; i++) {
                materialKey = materialKeys[i];
                drawGroup = drawGroups.get(materialKey);
                drawGroup.draw(ambients, canvasId);
                drawGroup.release();
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
    function createDrawList() {
        var drawableGroups = new DrawableGroups();
        var canvasIdToManager = new NumberIUnknownMap_1.default();
        var refCount = 1;
        var uuid = uuid4_1.default().generate();
        var self = {
            addRef: function () {
                refCount++;
                refChange_1.default(uuid, CLASS_NAME_DRAWLIST, +1);
                return refCount;
            },
            release: function () {
                refCount--;
                refChange_1.default(uuid, CLASS_NAME_DRAWLIST, -1);
                if (refCount === 0) {
                    drawableGroups.release();
                    drawableGroups = void 0;
                    canvasIdToManager.release();
                    canvasIdToManager = void 0;
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
                }, function (program) {
                    program.contextFree(canvasId);
                });
                canvasIdToManager.remove(canvasId);
            },
            contextGain: function (manager) {
                if (!canvasIdToManager.exists(manager.canvasId)) {
                    canvasIdToManager.put(manager.canvasId, manager);
                    drawableGroups.traverseDrawables(function (drawable) {
                        drawable.contextGain(manager);
                    }, function (material) {
                        material.contextGain(manager);
                    });
                }
            },
            contextLost: function (canvasId) {
                if (canvasIdToManager.exists(canvasId)) {
                    drawableGroups.traverseDrawables(function (drawable) {
                        drawable.contextLost(canvasId);
                    }, function (material) {
                        material.contextLost(canvasId);
                    });
                    canvasIdToManager.remove(canvasId);
                }
            },
            add: function (drawable) {
                canvasIdToManager.forEach(function (id, manager) {
                    drawable.contextGain(manager);
                });
                drawableGroups.add(drawable);
            },
            containsDrawable: function (drawable) {
                return drawableGroups.containsDrawable(drawable);
            },
            draw: function (ambients, canvasId) {
                drawableGroups.draw(ambients, canvasId);
            },
            getDrawablesByName: function (name) {
                var result = new IUnknownArray_1.default();
                drawableGroups.traverseDrawables(function (candidate) {
                    if (candidate.name === name) {
                        result.push(candidate);
                    }
                }, function (program) {
                });
                return result;
            },
            remove: function (drawable) {
                drawableGroups.remove(drawable);
            },
            traverse: function (callback, canvasId, prolog) {
                drawableGroups.traverseDrawables(callback, prolog);
            }
        };
        refChange_1.default(uuid, CLASS_NAME_DRAWLIST, +1);
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createDrawList;
});
