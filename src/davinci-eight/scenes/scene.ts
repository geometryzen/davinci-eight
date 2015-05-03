/// <reference path="./Scene.d.ts" />
import object3D = require('davinci-eight/core/object3D');

var scene = function(): Scene
{
    var kids: WebGLRenderingContextDependent[] = [];

    // TODO: What do we want out of the base object3D?
    var base = object3D();

    var that: Scene =
    {
        get children() { return kids; },

        onContextGain: function(gl: WebGLRenderingContext): void
        {
            for (var i = 0, length = kids.length; i < length; i++)
            {
                kids[i].onContextGain(gl);
            }
        },

        onContextLoss: function(): void
        {
            for (var i = 0, length = kids.length; i < length; i++) {
                kids[i].onContextLoss();
            }
        },

        tearDown: function(): void
        {
            for (var i = 0, length = kids.length; i < length; i++)
            {
                kids[i].tearDown();
            }
        },

        add: function(child: WebGLRenderingContextDependent)
        {
            kids.push(child);
        }
    }

    return that;
};

export = scene;
