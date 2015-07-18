import World = require('../worlds/World');
import Drawable = require('../core/Drawable');

var world = function(): World
{
    var drawables: Drawable[] = [];
    var drawGroups: {[drawGroupName:string]: Drawable[]} = {};

    var gl: WebGLRenderingContext;
    var contextId: string;

    var publicAPI: World =
    {
        get drawGroups(): {[drawGroupName:string]: Drawable[]} {return drawGroups},
        get children(): Drawable[] { return drawables; },

        contextFree(): void
        {
          for (var i = 0, length = drawables.length; i < length; i++)
          {
            drawables[i].contextFree();
          }
        },

        contextGain(context: WebGLRenderingContext, contextId: string): void
        {
          gl = context;
          contextId = contextId;
          drawables.forEach(function(drawable) {
            drawable.contextGain(context, contextId);
            var groupName = drawable.drawGroupName;
            if (!drawGroups[groupName]) {
              drawGroups[groupName] = [];
            }
            drawGroups[groupName].push(drawable);
          });
        },

        contextLoss(): void
        {
          drawables.forEach(function(drawable) {
            drawable.contextLoss();
          });
          gl = void 0;
          contextId = void 0;
        },

        hasContext(): boolean
        {
          return !!gl;
        },

        add: function(child: Drawable)
        {
          drawables.push(child);
        }
    }

    return publicAPI;
};

export = world;
