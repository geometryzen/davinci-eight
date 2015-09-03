import DrawList = require('../drawLists/DrawList');
import Drawable = require('../core/Drawable');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import ShaderProgram = require('../core/ShaderProgram');
import UniformDataInfo = require('../core/UniformDataInfo');
import UniformDataInfos = require('../core/UniformDataInfos');

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
        self.traverse(function(drawable) {
          drawable.release();
        });
      }
    },
    contextFree() {
      self.traverse(function(drawable) {
        drawable.contextFree();
      });
    },
    contextGain(context: WebGLRenderingContext) {
      if ($context !== context) {
        $context = expectArg('context', context).toSatisfy(context instanceof WebGLRenderingContext, "context must implement WebGLRenderingContext").value;
        Object.keys(programs).forEach(function(programId: string) {
          programs[programId].drawables.forEach(function(drawable) {
            drawable.contextGain(context);
            let program = drawable.program;
            let programId = program.programId;
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
    setUniforms(values: UniformDataInfos) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.setUniforms(values);
      });
    },
    uniform1f(name: string, x: number, picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform1f(name, x, picky);
      });
    },
    uniform1fv(name: string, value: number[], picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform1fv(name, value, picky);
      });
    },
    uniform2f(name: string, x: number, y: number, picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform2f(name, x, y, picky);
      });
    },
    uniform2fv(name: string, value: number[], picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform2fv(name, value, picky);
      });
    },
    uniform3f(name: string, x: number, y: number, z: number, picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform3f(name, x, y, z, picky);
      });
    },
    uniform3fv(name: string, value: number[], picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform3fv(name, value, picky);
      });
    },
    uniform4f(name: string, x: number, y: number, z: number, w: number, picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform4f(name, x, y, z, w, picky);
      });
    },
    uniform4fv(name: string, value: number[], picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniform4fv(name, value, picky);
      });
    },
    uniformMatrix2fv(name: string, transpose: boolean, matrix: Float32Array, picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniformMatrix2fv(name, transpose, matrix, picky);
      });
    },
    uniformMatrix3fv(name: string, transpose: boolean, matrix: Float32Array, picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniformMatrix3fv(name, transpose, matrix, picky);
      });
    },
    uniformMatrix4fv(name: string, transpose: boolean, matrix: Float32Array, picky: boolean) {
      traversePrograms(function(program: ShaderProgram) {
        program.use();
        program.uniformMatrix4fv(name, transpose, matrix, picky);
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
