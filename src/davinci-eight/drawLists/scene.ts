import DrawList = require('../drawLists/DrawList');
import Drawable = require('../core/Drawable');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import ShaderProgram = require('../core/ShaderProgram');
import Vector3 = require('../math/Vector3');

class ProgramInfo {
  public program: ShaderProgram;
  public drawables: Drawable[] = [];
  constructor(program: ShaderProgram) {
    this.program = program;
  }
}

let scene = function(): DrawList {

  let programs: { [programId: string]: ProgramInfo } = {};
  var refCount: number = 0;

  var $context: WebGLRenderingContext;

  function traversePrograms(callback: (value: ShaderProgram) => void) {
    Object.keys(programs).forEach(function(programId: string) {
      callback(programs[programId].program);
    });
  }

  function traverseProgramInfos(callback: (value: ProgramInfo) => void) {
    Object.keys(programs).forEach(function(programId: string) {
      callback(programs[programId]);
    });
  }

  let self: DrawList = {
    addRef() {
      refCount++;
      // console.log("scene.addRef() => " + refCount);
    },
    release() {
      refCount--;
      // console.log("scene.release() => " + refCount);
      if (refCount === 0) {
        self.traverse(function(drawable: Drawable) {
          drawable.release();
        });
      }
    },
    contextFree() {
      self.traverse(function(drawable: Drawable) {
        drawable.contextFree();
      });
    },
    contextGain(context: WebGLRenderingContext) {
      if ($context !== context) {
        $context = expectArg('context', context).toSatisfy(context instanceof WebGLRenderingContext, "context must implement WebGLRenderingContext").value;
        Object.keys(programs).forEach(function(programId: string) {
          programs[programId].drawables.forEach(function(drawable: Drawable) {
            drawable.contextGain(context);
            let program: ShaderProgram = drawable.program;
            let programId: string = program.programId;
          });
        });
      }
    },
    contextLoss() {
      if (isDefined($context)) {
        $context = void 0;
        Object.keys(programs).forEach(function(programId: string) {
          programs[programId].drawables.forEach(function(drawable) {
            drawable.contextLoss();
          });
        });
      }
    },
    hasContext() {
      return isDefined($context);
    },
    add(drawable: Drawable) {
      drawable.addRef();
      let program: ShaderProgram = drawable.program;
      let programId: string = program.programId;
      if (!programs[programId]) {
        programs[programId] = new ProgramInfo(program);
      }
      programs[programId].drawables.push(drawable);
      if (self.hasContext()) {
        program.contextGain($context);
        drawable.contextGain($context);
      }
    },
    remove(drawable: Drawable) {
      let program: ShaderProgram = drawable.program
      let programId: string = program.programId;
      if (programs[programId]) {
        let programInfo = new ProgramInfo(program);
        let index = programInfo.drawables.indexOf(drawable);
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
    uniform1f(name: string, x: number) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform1f(name, x);
      });
    },
    uniform1fv(name: string, value: number[]) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform1fv(name, value);
      });
    },
    uniform2f(name: string, x: number, y: number) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform2f(name, x, y);
      });
    },
    uniform2fv(name: string, value: number[]) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform2fv(name, value);
      });
    },
    uniform3f(name: string, x: number, y: number, z: number) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform3f(name, x, y, z);
      });
    },
    uniform4f(name: string, x: number, y: number, z: number, w: number) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform4f(name, x, y, z, w);
      });
    },
    uniform4fv(name: string, value: number[]) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform4fv(name, value);
      });
    },
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniformMatrix2(name, transpose, matrix);
      });
    },
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniformMatrix3(name, transpose, matrix);
      });
    },
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniformMatrix4(name, transpose, matrix);
      });
    },
    uniformVector3(name: string, vector: Vector3) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniformVector3(name, vector);
      });
    },
    traverse(callback: (value: Drawable, index: number, array: Drawable[]) => void) {
      Object.keys(programs).forEach(function(programId: string) {
        programs[programId].drawables.forEach(callback);
      });
    }
  }

  return self;
};

export = scene;
