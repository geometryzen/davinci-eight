import ContextManager = require('../core/ContextManager');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IProgram = require('../core/IProgram');
import IUnknown = require('../core/IUnknown');
import IUnknownArray = require('../utils/IUnknownArray');
import NumberIUnknownMap = require('../utils/NumberIUnknownMap');
import refChange = require('../utils/refChange');
import StringIUnknownMap = require('../utils/StringIUnknownMap');
import uuid4 = require('../utils/uuid4');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');

let CLASS_NAME_DRAWLIST = "createDrawList";
let CLASS_NAME_GROUP = "DrawableGroup";
let CLASS_NAME_ALL = "DrawableGroups";

// FIXME; Probably good to have another collection of DrawableGroup

/**
 * A grouping of IDrawable, by IProgram.
 */
class DrawableGroup implements IUnknown {
  /**
   * I can't see this being used; it's all about the drawables!
   */
  private _program: IProgram;
  private _drawables = new IUnknownArray<IDrawable>();
  private _refCount = 1;
  private _uuid = uuid4().generate();
  constructor(program: IProgram) {
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
  /**
   * accept provides a way to push out the IProgram without bumping the reference count.
   */
  accept(visitor: (program: IProgram)=>void) {
    visitor(this._program);
  }
  get length() {
    return this._drawables.length;
  }
  push(drawable: IDrawable) { 
    this._drawables.push(drawable);
  }
  remove(drawable: IDrawable): void {
    let drawables = this._drawables;
    let index = drawables.indexOf(drawable);
    if (index >= 0) {
      drawables.splice(index, 1).forEach(function(drawable) {
        drawable.release();
      });
    }
  }
  traverse(callback: (drawable: IDrawable) => void ) {
    this._drawables.forEach(callback);
  }
}

/**
 * Should look like a set of Drawable Groups
 */
class DrawableGroups implements IUnknown {
  /**
   *
   */
  private _groups = new StringIUnknownMap<DrawableGroup>();
  private _refCount = 1;
  private _uuid = uuid4().generate();
  constructor() {
    refChange(this._uuid, CLASS_NAME_ALL, +1);
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, CLASS_NAME_ALL, +1);
    return this._refCount;
  }
  release(): number {
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
  }
  add(drawable: IDrawable) {
    // Now let's see if we can get a program...
    let program: IProgram = drawable.material;
    if (program) {
      try {
        let programId: string = program.programId;
        let programInfo = this._groups.get(programId);
        if (!programInfo) {
          programInfo = new DrawableGroup(program);
          this._groups.put(programId, programInfo);
        }
        programInfo.push(drawable);
        programInfo.release();
        // FIXME
        //_managers.forEach(function(canvasId, manager) {
        //  program.contextGain(manager);
        //});
      }
      finally {
        program.release();
      }
    }
    else {
      // Thing won't actually be kept in list of drawables because
      // it does not have a program. Do we need to track it elsewhere?
    }
  }
  remove(drawable: IDrawable) {
    let program: IProgram = drawable.material;
    if (program) {
      try {
        let programId: string = program.programId;
        if (this._groups.exists(programId)) {
          let group = this._groups.get(programId);
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
  }
  traverseDrawables(callback: (drawable: IDrawable) => void) {
    this._groups.forEach(function(groupId, group){
      group.traverse(callback);
    });
  }
  traversePrograms(callback: (program: IProgram) => void) {
    this._groups.forEach(function(groupId, group){
      group.accept(callback);
    });
  }
}

let createDrawList = function(): IDrawList {
  let drawableGroups = new DrawableGroups();
  let managers = new NumberIUnknownMap<ContextManager>();
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
    contextFree(canvasId: number) {
      drawableGroups.traverseDrawables(function(drawable){
        drawable.contextFree(canvasId);
      });
    },
    contextGain(manager: ContextManager) {
      if (!managers.exists(manager.canvasId)) {
        managers.put(manager.canvasId, manager)
      }
      drawableGroups.traverseDrawables(function(drawable){
        drawable.contextGain(manager);
      });
    },
    contextLoss(canvasId) {
      drawableGroups.traverseDrawables(function(drawable){
        drawable.contextLoss(canvasId);
      });
    },
    add(drawable: IDrawable) {
      // If we have managers povide them to the drawable before asking for the program.
      // FIXME: Do we have to be careful about whether the manager has a context?
      managers.forEach(function(id, manager) {
        drawable.contextGain(manager);
      });
      drawableGroups.add(drawable);
    },
    remove(drawable: IDrawable) {
      drawableGroups.remove(drawable);
    },
    uniform1f(name: string, x: number) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniform1f(name, x);
        });
      });
    },
    uniform2f(name: string, x: number, y: number) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniform2f(name, x, y);
        });
      });
    },
    uniform3f(name: string, x: number, y: number, z: number) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniform3f(name, x, y, z);
        });
      });
    },
    uniform4f(name: string, x: number, y: number, z: number, w: number) {
      managers.forEach(function(canvasId, manager) {
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniform4f(name, x, y, z, w);
        });
      });
    },
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniformMatrix1(name, transpose, matrix);
        });
      });
    },
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniformMatrix2(name, transpose, matrix);
        });
      });
    },
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniformMatrix3(name, transpose, matrix);
        });
      });
    },
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniformMatrix4(name, transpose, matrix);
        });
      });
    },
    uniformVector1(name: string, vector: Vector1) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniformVector1(name, vector);
        });
      });
    },
    uniformVector2(name: string, vector: Vector2) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniformVector2(name, vector);
        });
      });
    },
    uniformVector3(name: string, vector: Vector3) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniformVector3(name, vector);
        });
      });
    },
    uniformVector4(name: string, vector: Vector4) {
      managers.forEach(function(canvasId, manager){
        drawableGroups.traversePrograms(function(program: IProgram) {
          program.use(canvasId);
          program.uniformVector4(name, vector);
        });
      });
    },
    traverse(callback: (drawable: IDrawable) => void) {
      drawableGroups.traverseDrawables(callback);
    }
  }
  refChange(uuid, CLASS_NAME_DRAWLIST, +1);
  return self;
};

export = createDrawList;
