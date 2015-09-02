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

  let self: DrawList = {
    addRef(): void {
      refCount++;
      // console.log("scene.addRef() => " + refCount);
    },
    release(): void {
      refCount--;
      // console.log("scene.release() => " + refCount);
      if (refCount === 0) {
        self.traverse(function(drawable) {
          drawable.release();
        });
      }
    },
    contextGain(context: WebGLRenderingContext): void {
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
    contextLoss(): void {
      if (isDefined($context)) {
        $context = void 0;
        Object.keys(programs).forEach(function(programId: string) {
          programs[programId].drawables.forEach(function(drawable) {
            drawable.contextLoss();
          });
        });
      }
    },
    hasContext(): boolean {
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
      Object.keys(programs).forEach(function(programId) {
        let programInfo = programs[programId];
        let program = programInfo.program;
        program.use();
        program.setUniforms(values);
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
