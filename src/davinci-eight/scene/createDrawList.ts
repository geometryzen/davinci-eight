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
import NumberIUnknownMap = require('../utils/NumberIUnknownMap');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');

// FIXME: This should be reference counted
class ProgramInfo {
  public program: IProgram;
  // TODO: This would be nice...
//public drawables = new IUnknownList<IDrawable>();
  public drawables: IDrawable[] = [];
  constructor(program: IProgram) {
    this.program = program;
  }
}

let createDrawList = function(): IDrawList {

  // FIXME Use StringIUnknownMap
  let programs: { [programId: string]: ProgramInfo } = {};
  var refCount: number = 1;

  // FIXME: Why keep contexts when you have managers.
  // var _context: WebGLRenderingContext;

  //var _managers: {[id: number]: ContextManager } = {};
  var _managers = new NumberIUnknownMap<ContextManager>();

  function traversePrograms(callback: (value: IProgram) => void) {
    Object.keys(programs).forEach(function(programId: string) {
      callback(programs[programId].program);
    });
  }

  function traverseProgramInfos(callback: (value: ProgramInfo) => void) {
    Object.keys(programs).forEach(function(programId: string) {
      callback(programs[programId]);
    });
  }

  let self: IDrawList = {
    addRef(): number {
      refCount++;
      // console.log("scene.addRef() => " + refCount);
      return refCount;
    },
    release(): number {
      refCount--;
      // console.log("scene.release() => " + refCount);
      if (refCount === 0) {
        self.traverse(function(drawable: IDrawable) {
          drawable.release();
        });
      }
      return refCount;
    },
    contextFree(canvasId: number) {
      self.traverse(function(drawable: IDrawable) {
        drawable.contextFree(canvasId);
      });
    },
    contextGain(manager: ContextManager) {
      if (!_managers.exists(manager.canvasId)) {
        _managers.put(manager.canvasId, manager)
        _managers[manager.canvasId] = manager;
        manager.addRef();
      }
      Object.keys(programs).forEach(function(programId: string) {
        programs[programId].drawables.forEach(function(drawable: IDrawable) {
          drawable.contextGain(manager);
        });
      });
    },
    contextLoss(canvasId) {
      Object.keys(programs).forEach(function(programId: string) {
        programs[programId].drawables.forEach(function(drawable: IDrawable) {
          drawable.contextLoss(canvasId);
        });
      });
    },
    add(drawable: IDrawable) {
      // If we have managers povide them to the drawable before asking for the program.
      // FIXME: Do we have to be careful about whether the manager has a context?
      _managers.forEach(function(id, manager) {
        drawable.contextGain(manager);
      });
      // Now let's see if we can get a program...
      let program: IProgram = drawable.material;
      if (program) {
        try {
          let programId: string = program.programId;
          if (!programs[programId]) {
            programs[programId] = new ProgramInfo(program);
          }
          programs[programId].drawables.push(drawable);
          // TODO; When drawables is IUnkownList, this will not be needed.
          drawable.addRef();
          _managers.forEach(function(id, manager) {
            program.contextGain(manager);
          });
        }
        finally {
          program.release();
        }
      }
      else {
        // Thing won't actually be kept in list of drawables because
        // it does not have a program. Do we need to track it elsewhere?
      }
    },
    remove(drawable: IDrawable) {
      let program: IProgram = drawable.material;
      if (program) {
          try {
          let programId: string = program.programId;
          if (programs[programId]) {
            let programInfo = new ProgramInfo(program);
            let index = programInfo.drawables.indexOf(drawable);
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
    uniform1f(name: string, x: number) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniform1f(name, x);
      });
    },
    uniform2f(name: string, x: number, y: number) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniform2f(name, x, y);
      });
    },
    uniform3f(name: string, x: number, y: number, z: number) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniform3f(name, x, y, z);
      });
    },
    uniform4f(name: string, x: number, y: number, z: number, w: number) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniform4f(name, x, y, z, w);
      });
    },
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniformMatrix1(name, transpose, matrix);
      });
    },
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniformMatrix2(name, transpose, matrix);
      });
    },
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniformMatrix3(name, transpose, matrix);
      });
    },
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniformMatrix4(name, transpose, matrix);
      });
    },
    uniformVector1(name: string, vector: Vector1) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniformVector1(name, vector);
      });
    },
    uniformVector2(name: string, vector: Vector2) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniformVector2(name, vector);
      });
    },
    uniformVector3(name: string, vector: Vector3) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniformVector3(name, vector);
      });
    },
    uniformVector4(name: string, vector: Vector4) {
      let canvasId = 0;
      console.warn("createDrawList using canvasId " + canvasId);
      traversePrograms(function(program: IProgram) {
        program.use(canvasId);
        program.uniformVector4(name, vector);
      });
    },
    traverse(callback: (value: IDrawable, index: number, array: IDrawable[]) => void) {
      Object.keys(programs).forEach(function(programId: string) {
        programs[programId].drawables.forEach(callback);
      });
    }
  }

  return self;
};

export = createDrawList;
