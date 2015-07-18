import Renderer = require('../renderers/Renderer');
import World = require('../worlds/World');
import VertexUniformProvider = require('../core/VertexUniformProvider');
/**
 * @class WebGLRenderer
 * @implements Renderer
 */
declare class WebGLRenderer implements Renderer {
    private renderer;
    /**
     * @class WebGLRenderer
     * @constructor
     */
    constructor();
    /**
     * @method render
     * @param world {World}
     * @param ambientUniforms {VertexUniformProvider}
     */
    render(world: World, views: VertexUniformProvider[]): void;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
    clearColor(r: number, g: number, b: number, a: number): void;
    setClearColor(color: number, alpha?: number): void;
    setSize(width: number, height: number): void;
    domElement: HTMLCanvasElement;
}
export = WebGLRenderer;
