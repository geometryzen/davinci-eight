define(["require", "exports", '../utils/IUnknownArray', '../utils/NumberIUnknownMap', '../utils/refChange', '../utils/StringIUnknownMap', '../utils/uuid4'], function (require, exports, IUnknownArray, NumberIUnknownMap, refChange, StringIUnknownMap, uuid4) {
    var CLASS_NAME_DRAWLIST = "createDrawList";
    var CLASS_NAME_GROUP = "DrawableGroup";
    var CLASS_NAME_ALL = "DrawableGroups";
    // FIXME; Probably good to have another collection of DrawableGroup
    /**
     * A grouping of IDrawable, by IMaterial.
     */
    // FIXME: extends Shareable
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
        Object.defineProperty(DrawableGroup.prototype, "material", {
            get: function () {
                this._program.addRef();
                return this._program;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * accept provides a way to push out the IMaterial without bumping the reference count.
         */
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
        DrawableGroup.prototype.draw = function (ambients, canvasId) {
            var i;
            var length;
            var drawables = this._drawables;
            var material = this._program;
            material.use(canvasId);
            ambients.setUniforms(material, canvasId);
            length = drawables.length;
            for (i = 0; i < length; i++) {
                drawables.getWeakReference(i).draw(canvasId);
            }
        };
        DrawableGroup.prototype.traverseDrawables = function (callback) {
            this._drawables.forEach(callback);
        };
        return DrawableGroup;
    })();
    /**
     * Should look like a set of Drawable Groups. Maybe like a Scene!
     */
    var DrawableGroups = (function () {
        function DrawableGroups() {
            /**
             * Mapping from programId to DrawableGroup ~ (IMaterial,IDrawable[])
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
                    var programInfo = this._groups.getWeakReference(programId);
                    if (!programInfo) {
                        programInfo = new DrawableGroup(program);
                        this._groups.putWeakReference(programId, programInfo);
                    }
                    programInfo.push(drawable);
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
                        var group = this._groups.getWeakReference(programId);
                        group.remove(drawable);
                        if (group.length === 0) {
                            delete this._groups.remove(programId);
                        }
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
        DrawableGroups.prototype.draw = function (ambients, canvasId) {
            // Manually hoisted variable declarations.
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
                drawGroup = drawGroups.getWeakReference(materialKey);
                drawGroup.draw(ambients, canvasId);
            }
        };
        // FIXME: Rename to traverse
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
    })();
    var createDrawList = function () {
        var drawableGroups = new DrawableGroups();
        var canvasIdToManager = new NumberIUnknownMap();
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
            /**
             * method contextGain
             */
            contextGain: function (manager) {
                if (!canvasIdToManager.exists(manager.canvasId)) {
                    // Cache the manager.
                    canvasIdToManager.putStrongReference(manager.canvasId, manager);
                    // Broadcast to drawables and materials.
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
                // If we have canvasIdToManager povide them to the drawable before asking for the program.
                // FIXME: Do we have to be careful about whether the manager has a context?
                canvasIdToManager.forEach(function (id, manager) {
                    drawable.contextGain(manager);
                });
                drawableGroups.add(drawable);
            },
            draw: function (ambients, canvasId) {
                drawableGroups.draw(ambients, canvasId);
            },
            remove: function (drawable) {
                drawableGroups.remove(drawable);
            },
            traverse: function (callback, canvasId, prolog) {
                drawableGroups.traverseDrawables(callback, prolog);
            }
        };
        refChange(uuid, CLASS_NAME_DRAWLIST, +1);
        return self;
    };
    return createDrawList;
});
