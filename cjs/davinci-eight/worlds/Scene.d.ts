/// <reference path="../../../src/davinci-eight/worlds/World.d.ts" />
declare class Scene implements World {
    private world;
    constructor();
    add(drawable: Drawable): void;
    drawGroups: {
        [drawGroupName: string]: Drawable[];
    };
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
}
export = Scene;
