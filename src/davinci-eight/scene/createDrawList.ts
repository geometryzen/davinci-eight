import IContextProvider = require('../core/IContextProvider');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import R1 = require('../math/R1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IMaterial = require('../core/IMaterial');
import IUnknown = require('../core/IUnknown');
import IUnknownArray = require('../collections/IUnknownArray');
import NumberIUnknownMap = require('../collections/NumberIUnknownMap');
import refChange = require('../utils/refChange');
import Shareable = require('../utils/Shareable')
import StringIUnknownMap = require('../collections/StringIUnknownMap');
import uuid4 = require('../utils/uuid4');
import IFacet = require('../core/IFacet');
import R2 = require('../math/R2');
import R3 = require('../math/R3');
import R4 = require('../math/R4');

let CLASS_NAME_DRAWLIST = "createDrawList";
let CLASS_NAME_GROUP = "DrawableGroup";
let CLASS_NAME_ALL = "DrawableGroups";

// FIXME; Probably good to have another collection of DrawableGroup

/**
 * A grouping of IDrawable, by IMaterial.
 */
// FIXME: extends Shareable
class DrawableGroup implements IUnknown {
    /**
     * I can't see this being used; it's all about the drawables!
     */
    private _program: IMaterial;
    private _drawables = new IUnknownArray<IDrawable>();
    private _refCount = 1;
    private _uuid = uuid4().generate();
    constructor(program: IMaterial) {
        this._program = program;
        this._program.addRef();
        refChange(this._uuid, CLASS_NAME_GROUP, +1);
    }
    addRef(): number {
        this._refCount++;
        refChange(this._uuid, CLASS_NAME_GROUP, +1);
        return this._refCount;
    }
    release(): number {
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
    }
    get material(): IMaterial {
        this._program.addRef();
        return this._program;
    }
    /**
     * accept provides a way to push out the IMaterial without bumping the reference count.
     */
    acceptProgram(visitor: (program: IMaterial) => void) {
        visitor(this._program);
    }
    get length() {
        return this._drawables.length;
    }
    containsDrawable(drawable: IDrawable) {
        return this._drawables.indexOf(drawable) >= 0;
    }
    push(drawable: IDrawable) {
        this._drawables.push(drawable);
    }
    remove(drawable: IDrawable): void {
        let drawables = this._drawables
        let index = drawables.indexOf(drawable)
        if (index >= 0) {
            // We don't actually need the returned element so release it.
            drawables.splice(index, 1).release()
        }
    }
    draw(ambients: IFacet[], canvasId: number): void {

        var i: number
        var length: number
        var drawables = this._drawables
        var material = this._program

        material.use(canvasId)

        if (ambients) {
            ambients.forEach(function(ambient) {
                ambient.setUniforms(material, canvasId)
            })
        }

        length = drawables.length
        for (i = 0; i < length; i++) {
            var drawable = drawables.get(i)
            drawable.draw(canvasId)
            drawable.release()
        }
    }
    traverseDrawables(callback: (drawable: IDrawable) => void) {
        this._drawables.forEach(callback);
    }
}

/**
 * Should look like a set of Drawable Groups. Maybe like a Scene!
 */
class DrawableGroups extends Shareable/*IDrawList*/ {
    /**
     * Mapping from programId to DrawableGroup ~ (IMaterial,IDrawable[])
     */
    private _groups = new StringIUnknownMap<DrawableGroup>();
    constructor() {
        super(CLASS_NAME_ALL)
    }
    protected destructor(): void {
        this._groups.release()
        this._groups = void 0
        super.destructor()
    }
    add(drawable: IDrawable) {
        // Now let's see if we can get a program...
        let program: IMaterial = drawable.material;
        if (program) {
            try {
                let programId: string = program.uuid
                let group = this._groups.get(programId)
                if (!group) {
                    group = new DrawableGroup(program)
                    this._groups.put(programId, group)
                }
                if (!group.containsDrawable(drawable)) {
                    group.push(drawable)
                }
                group.release()
            }
            finally {
                program.release()
            }
        }
        else {
            // Thing won't actually be kept in list of drawables because
            // it does not have a program. Do we need to track it elsewhere?
        }
    }
    containsDrawable(drawable: IDrawable): boolean {

        var material = drawable.material
        if (material) {
            try {
                var group = this._groups.getWeakRef(material.uuid)
                if (group) {
                    return group.containsDrawable(drawable)
                }
                else {
                    return false
                }
            }
            finally {
                material.release()
            }
        }
        else {
            return false
        }
    }
    remove(drawable: IDrawable) {
        let material: IMaterial = drawable.material
        if (material) {
            try {
                let programId: string = material.uuid
                if (this._groups.exists(programId)) {
                    let group: DrawableGroup = this._groups.get(programId)
                    try {
                        group.remove(drawable);
                        if (group.length === 0) {
                            this._groups.remove(programId).release()
                        }
                    }
                    finally {
                        group.release()
                    }
                }
                else {

                }
            }
            finally {
                material.release()
            }
        }
    }
    draw(ambients: IFacet[], canvasId: number) {
        // Manually hoisted variable declarations.
        var drawGroups: StringIUnknownMap<DrawableGroup>
        var materialKey: string;
        var materialKeys: string[]
        var materialsLength: number
        var i: number
        var drawGroup: DrawableGroup

        drawGroups = this._groups;
        materialKeys = drawGroups.keys
        materialsLength = materialKeys.length
        for (i = 0; i < materialsLength; i++) {
            materialKey = materialKeys[i]
            drawGroup = drawGroups.get(materialKey)
            drawGroup.draw(ambients, canvasId)
            drawGroup.release()
        }
    }
    // FIXME: Rename to traverse
    traverseDrawables(callback: (drawable: IDrawable) => void, callback2: (program: IMaterial) => void) {
        this._groups.forEach(function(groupId, group) {
            group.acceptProgram(callback2);
            group.traverseDrawables(callback);
        });
    }
    traversePrograms(callback: (program: IMaterial) => void) {
        this._groups.forEach(function(groupId, group) {
            group.acceptProgram(callback);
        });
    }
}

let createDrawList = function(): IDrawList {
    let drawableGroups = new DrawableGroups();
    let canvasIdToManager = new NumberIUnknownMap<IContextProvider>();
    let refCount: number = 1;
    let uuid = uuid4().generate();

    let self: IDrawList = {
        addRef(): number {
            refCount++;
            refChange(uuid, CLASS_NAME_DRAWLIST, +1);
            return refCount;
        },
        release(): number {
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
        contextFree(canvasId: number) {
            drawableGroups.traverseDrawables(
                function(drawable) {
                    drawable.contextFree(canvasId)
                },
                function(program) {
                    program.contextFree(canvasId)
                }
            )
            canvasIdToManager.remove(canvasId);
        },
        /**
         * method contextGain
         */
        contextGain(manager: IContextProvider) {
            if (!canvasIdToManager.exists(manager.canvasId)) {
                // Cache the manager.
                canvasIdToManager.put(manager.canvasId, manager)
                // Broadcast to drawables and materials.
                drawableGroups.traverseDrawables(
                    function(drawable) {
                        drawable.contextGain(manager)
                    },
                    function(material) {
                        material.contextGain(manager)
                    }
                )
            }
        },
        contextLost(canvasId: number) {
            if (canvasIdToManager.exists(canvasId)) {
                drawableGroups.traverseDrawables(
                    function(drawable) {
                        drawable.contextLost(canvasId)
                    },
                    function(material) {
                        material.contextLost(canvasId)
                    }
                )
                canvasIdToManager.remove(canvasId)
            }
        },
        add(drawable: IDrawable): void {
            // If we have canvasIdToManager povide them to the drawable before asking for the program.
            // FIXME: Do we have to be careful about whether the manager has a context?
            canvasIdToManager.forEach(function(id, manager) {
                drawable.contextGain(manager)
            });
            drawableGroups.add(drawable)
        },
        containsDrawable(drawable: IDrawable): boolean {
            return drawableGroups.containsDrawable(drawable)
        },
        draw(ambients: IFacet[], canvasId: number): void {
            drawableGroups.draw(ambients, canvasId)
        },
        getDrawablesByName(name: string): IUnknownArray<IDrawable> {
            var result = new IUnknownArray<IDrawable>()
            drawableGroups.traverseDrawables(
                function(candidate: IDrawable) {
                    if (candidate.name === name) {
                        result.push(candidate)
                    }
                },
                function(program: IMaterial) {
                }
            )
            return result;
        },
        remove(drawable: IDrawable) {
            drawableGroups.remove(drawable);
        },
        // FIXME: canvasId not being used?
        traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IMaterial) => void) {
            drawableGroups.traverseDrawables(callback, prolog);
        }
    }
    refChange(uuid, CLASS_NAME_DRAWLIST, +1);
    return self;
};

export = createDrawList;
