import Geometry = require('../geometries/Geometry');
import Slide = require('../slideshow/Slide');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IFacet = require('../core/IFacet');
import ISlideHost = require('../slideshow/ISlideHost');
import Shareable = require('../utils/Shareable');
/**
 * @class Director
 */
declare class Director extends Shareable implements ISlideHost {
    private slides;
    private step;
    /**
     * (canvasId: number) => Canvas3D
     */
    /**
     * (sceneName: string) => Scene
     */
    private scenes;
    /**
     * (name: string) => IUniform
     */
    private drawables;
    private geometries;
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
    /**
     * @class Director
     * @constructor
     */
    constructor();
    destructor(): void;
    addCanvasSceneLink(canvasId: number, sceneName: string): void;
    addDrawable(name: string, drawable: IDrawable): void;
    getDrawable(name: string): IDrawable;
    removeDrawable(name: string): void;
    addGeometry(name: string, geometry: Geometry): void;
    removeGeometry(name: string): void;
    getGeometry(name: string): Geometry;
    addToScene(drawableId: string, sceneId: string): void;
    removeFromScene(drawableId: string, sceneId: string): void;
    addFacet(name: string, uniform: IFacet): void;
    removeFacet(name: string): void;
    addCanvasUniformLink(canvasId: number, uniformName: string): void;
    /**
     *
     */
    createSlide(): Slide;
    getScene(name: string): IDrawList;
    go(step: number, instant?: boolean): void;
    forward(instant?: boolean, delay?: number): void;
    canForward(): boolean;
    backward(instant?: boolean, delay?: number): void;
    canBackward(): boolean;
    pushSlide(slide: Slide): number;
    advance(interval: number): void;
}
export = Director;
