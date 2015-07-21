import RenderingContextUser = require('../core/RenderingContextUser');
import UniformProvider = require('../core/UniformProvider');
import World = require('../worlds/World');
interface Renderer extends RenderingContextUser {
    domElement: HTMLCanvasElement;
    render(world: World, views: UniformProvider[]): void;
    setSize(width: number, height: number): void;
}
export = Renderer;
