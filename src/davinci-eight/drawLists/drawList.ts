import DrawList = require('../drawLists/DrawList');
import Drawable = require('../core/Drawable');
import expectArg = require('../checks/expectArg');

let drawList = function(): DrawList {

    let drawables: Drawable[] = [];
    let drawGroups: {[drawGroupName:string]: Drawable[]} = {};

    var gl: WebGLRenderingContext;
    var contextId: string;

    let publicAPI: DrawList = {
        get drawGroups(): {[drawGroupName:string]: Drawable[]} {return drawGroups},
        get children(): Drawable[] { return drawables; },
        contextFree(): void {
          drawables.forEach(function(drawable) {
            drawable.contextFree();
          });
          gl = void 0;
          contextId = void 0;
        },
        contextGain(context: WebGLRenderingContext, contextId: string): void {
          expectArg('context', context).toSatisfy(context instanceof WebGLRenderingContext, "context must implement WebGLRenderingContext")
          expectArg('contextId', contextId).toBeString();
          gl = context;
          contextId = contextId;
          drawables.forEach(function(drawable) {
            drawable.contextGain(context, contextId);
            let groupName = drawable.drawGroupName;
            if (!drawGroups[groupName]) {
              drawGroups[groupName] = [];
            }
            drawGroups[groupName].push(drawable);
          });
        },
        contextLoss(): void {
          drawables.forEach(function(drawable) {
            drawable.contextLoss();
          });
          gl = void 0;
          contextId = void 0;
        },
        hasContext(): boolean {
          return !!gl;
        },
        add(drawable: Drawable) {
          drawables.push(drawable);
        },
        remove(drawable: Drawable) {
          let index = drawables.indexOf(drawable);
          if (index >= 0) {
            drawables.splice(index, 1);
          }
        }
    }

    return publicAPI;
};

export = drawList;
