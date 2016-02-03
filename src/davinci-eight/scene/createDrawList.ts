import IContextProvider from '../core/IContextProvider';
import IDrawable from '../core/IDrawable';
import IDrawList from '../scene/IDrawList';
import IGraphicsProgram from '../core/IGraphicsProgram';
import IUnknownArray from '../collections/IUnknownArray';
import NumberIUnknownMap from '../collections/NumberIUnknownMap';
import refChange from '../utils/refChange';
import Shareable from '../utils/Shareable';
import StringIUnknownMap from '../collections/StringIUnknownMap';
import uuid4 from '../utils/uuid4';
import Facet from '../core/Facet';

const CLASS_NAME_DRAWLIST = "createDrawList"

/**
 * A grouping of IDrawable, by IGraphicsProgram.
 */
class DrawableGroup extends Shareable {
    private _program: IGraphicsProgram;
    private _drawables: IUnknownArray<IDrawable>;
    constructor(program: IGraphicsProgram) {
        super('DrawableGroup');
        this._program = program;
        this._program.addRef();
        this._drawables = new IUnknownArray<IDrawable>();
    }
    protected destructor(): void {
        this._program.release();
        this._program = void 0;
        this._drawables.release();
        this._drawables = void 0;
        super.destructor();
    }
    /**
     * accept provides a way to push out the IGraphicsProgram without bumping the reference count.
     */
    acceptProgram(visitor: (program: IGraphicsProgram) => void) {
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
    draw(ambients: Facet[], canvasId?: number): void {

        const program = this._program

        program.use(canvasId)

        if (ambients) {
            const aLength = ambients.length;
            for (let a = 0; a < aLength; a++) {
                const ambient = ambients[a];
                ambient.setUniforms(program, canvasId);
            }
        }

        const drawables = this._drawables
        const iLength = drawables.length;
        for (let i = 0; i < iLength; i++) {
            const drawable = drawables.getWeakRef(i)
            drawable.draw(canvasId);
        }
    }

    findOne(match: (drawable: IDrawable) => boolean): IDrawable {
        const drawables = this._drawables;
        for (let i = 0, iLength = drawables.length; i < iLength; i++) {
            const candidate = drawables.get(i);
            if (match(candidate)) {
                return candidate;
            }
            else {
                candidate.release();
            }
        }
        return void 0;
    }
    traverseDrawables(callback: (drawable: IDrawable) => void) {
        this._drawables.forEach(callback);
    }
}

/**
 * Should look like a set of IDrawable Groups. Maybe like a Scene!
 */
class DrawableGroups extends Shareable {
    /**
     * Mapping from programId to DrawableGroup ~ (IGraphicsProgram, IDrawable[])
     */
    private _groups = new StringIUnknownMap<DrawableGroup>();
    constructor() {
        super('DrawableGroups')
    }
    protected destructor(): void {
        this._groups.release()
        this._groups = void 0
        super.destructor()
    }
    add(drawable: IDrawable) {
        // Now let's see if we can get a program...
        const program: IGraphicsProgram = drawable.graphicsProgram;
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
        const graphicsProgram = drawable.graphicsProgram;
        if (graphicsProgram) {
            try {
                var group = this._groups.getWeakRef(graphicsProgram.uuid)
                if (group) {
                    return group.containsDrawable(drawable)
                }
                else {
                    return false
                }
            }
            finally {
                graphicsProgram.release()
            }
        }
        else {
            return false
        }
    }
    findOne(match: (drawable: IDrawable) => boolean): IDrawable {
        const groupIds = this._groups.keys;
        for (let i = 0, iLength = groupIds.length; i < iLength; i++) {
            const groupId = groupIds[i];
            const group = this._groups.getWeakRef(groupId);
            const found = group.findOne(match);
            if (found) {
                return found;
            }
        }
        return void 0;
    }
    remove(drawable: IDrawable) {
        const material: IGraphicsProgram = drawable.graphicsProgram;
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
                    // Do nothing.
                }
            }
            finally {
                material.release()
            }
        }
    }
    draw(ambients: Facet[], canvasId?: number) {
        const drawGroups: StringIUnknownMap<DrawableGroup> = this._groups;
        const materialKeys = drawGroups.keys;
        const materialsLength = materialKeys.length;
        for (let i = 0; i < materialsLength; i++) {
            const materialKey = materialKeys[i];
            const drawGroup = drawGroups.getWeakRef(materialKey);
            drawGroup.draw(ambients, canvasId);
        }
    }
    // FIXME: Rename to traverse
    traverseDrawables(callback: (drawable: IDrawable) => void, callback2: (program: IGraphicsProgram) => void) {
        this._groups.forEach(function(groupId, group) {
            group.acceptProgram(callback2);
            group.traverseDrawables(callback);
        });
    }
    traversePrograms(callback: (program: IGraphicsProgram) => void) {
        this._groups.forEach(function(groupId, group) {
            group.acceptProgram(callback);
        });
    }
}

export default function createDrawList(): IDrawList {
    let drawableGroups = new DrawableGroups();
    let canvasIdToManager = new NumberIUnknownMap<IContextProvider>();
    let refCount = 1;
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
        contextFree(canvasId?: number) {
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
        contextLost(canvasId?: number) {
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
        draw(ambients: Facet[], canvasId?: number): void {
            drawableGroups.draw(ambients, canvasId)
        },
        findOne(match: (drawable: IDrawable) => boolean): IDrawable {
            return drawableGroups.findOne(match);
        },
        getDrawableByName(name: string): IDrawable {
            return drawableGroups.findOne(function(drawable) { return drawable.name === name; });
        },
        getDrawablesByName(name: string): IUnknownArray<IDrawable> {
            var result = new IUnknownArray<IDrawable>()
            drawableGroups.traverseDrawables(
                function(candidate: IDrawable) {
                    if (candidate.name === name) {
                        result.push(candidate)
                    }
                },
                function(program: IGraphicsProgram) {
                    // Do nothing.
                }
            )
            return result;
        },
        remove(drawable: IDrawable) {
            drawableGroups.remove(drawable);
        },
        // FIXME: canvasId not being used?
        // FIXME: canvasId must be last parameter to be optional.
        traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IGraphicsProgram) => void) {
            drawableGroups.traverseDrawables(callback, prolog);
        }
    }
    refChange(uuid, CLASS_NAME_DRAWLIST, +1);
    return self;
}
