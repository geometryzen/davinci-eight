import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IFacet = require('../core/IFacet');
import ISlide = require('../slideshow/ISlide');
import ISlideHost = require('../slideshow/ISlideHost');
import Shareable = require('../utils/Shareable');
declare class Director extends Shareable implements ISlideHost {
    private slides;
    private step;
    /**
     * (canvasId: number) => Canvas3D
     */
    private contexts;
    /**
     * (sceneName: string) => Scene
     */
    private scenes;
    /**
     * (name: string) => IUniform
     */
    private drawables;
    /**
     * (name: string) => IUniform
     */
    private uniforms;
    /**
     * (canvasId: number) => scene.name
     */
    private sceneNamesByCanvasId;
    /**
     * (canvasId: number) => ((uniform.name) => IFacet)
     */
    private uniformsByCanvasId;
    constructor();
    destructor(): void;
    apply(slide: ISlide, forward: boolean): void;
    addCanvasSceneLink(canvasId: number, sceneName: string): void;
    addDrawable(name: string, drawable: IDrawable): void;
    getDrawable(name: string): IDrawable;
    removeDrawable(name: string): void;
    addToScene(drawableId: string, sceneId: string): void;
    removeFromScene(drawableId: string, sceneId: string): void;
    addFacet(name: string, uniform: IFacet): void;
    removeFacet(name: string): void;
    addCanvasUniformLink(canvasId: number, uniformName: string): void;
    /**
     *
     */
    createScene(sceneName: string, canvasIds: number[]): void;
    deleteScene(name: string): void;
    createSlide(): ISlide;
    getScene(name: string): IDrawList;
    go(step: number, instant?: boolean): void;
    forward(instant?: boolean, delay?: number): void;
    canForward(): boolean;
    backward(instant?: boolean, delay?: number): void;
    canBackward(): boolean;
    pushSlide(slide: ISlide): number;
    addCanvas(canvas: HTMLCanvasElement, canvasId: number): void;
    update(speed: number): void;
    render(): void;
}
export = Director;
