import Geometry = require('../geometries/Geometry');
import Slide = require('../slideshow/Slide');
import Canvas3D = require('../scene/Canvas3D');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IFacet = require('../core/IFacet');
import IDirector = require('../slideshow/IDirector');
import IUnknownArray = require('../collections/IUnknownArray');
import Shareable = require('../utils/Shareable');
/**
 * @class Director
 */
declare class Director extends Shareable implements IDirector {
    /**
     * [0, slides.length] represents on a slide
     * A value equal to -1 represents just before the first slide.
     * A value equal to slides.length represents just after the last slide.
     * @property step
     * @type {number}
     */
    private step;
    /**
     * @property slides
     * @type {IUnknownArray<Slide>}
     */
    slides: IUnknownArray<Slide>;
    /**
     * (canvasId: number) => Canvas3D
     */
    private contexts;
    /**
     * (sceneName: string) => IDrawList
     */
    private scenes;
    /**
     * (name: string) => IDrawable
     */
    private drawables;
    /**
     * (name: string) => Geometry
     */
    private geometries;
    /**
     * (name: string) => IFacet
     */
    private facets;
    /**
     * (canvasId: number) => scene.name
     */
    private sceneNamesByCanvasId;
    /**
     * (canvasId: number) => ((facet.name) => IFacet)
     */
    private facetsByCanvasId;
    /**
     * @class Director
     * @constructor
     */
    constructor();
    destructor(): void;
    addCanvas3D(context: Canvas3D): void;
    getCanvas3D(canvasId: number): Canvas3D;
    removeCanvas3D(canvasId: number): void;
    addDrawable(drawable: IDrawable, drawableName: string): void;
    getDrawable(drawableName: string): IDrawable;
    removeDrawable(drawableName: string): IDrawable;
    addFacet(facet: IFacet, facetName: string): void;
    getFacet(facetName: string): IFacet;
    removeFacet(facetName: string): IFacet;
    addGeometry(name: string, geometry: Geometry): void;
    removeGeometry(name: string): Geometry;
    getGeometry(name: string): Geometry;
    addScene(scene: IDrawList, sceneName: string): void;
    getScene(sceneName: string): IDrawList;
    removeScene(sceneName: string): IDrawList;
    isDrawableInScene(drawableName: string, sceneName: string): boolean;
    useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): void;
    useSceneOnCanvas(sceneName: string, canvasId: number, confirm: boolean): void;
    useFacetOnCanvas(facetName: string, canvasId: number, confirm: boolean): void;
    /**
     * Creates a new Slide.
     * @method createSlide
     * @return {Slide}
     */
    createSlide(): Slide;
    go(step: number, instant?: boolean): void;
    forward(instant?: boolean, delay?: number): void;
    canForward(): boolean;
    backward(instant?: boolean, delay?: number): void;
    canBackward(): boolean;
    pushSlide(slide: Slide): number;
    advance(interval: number): void;
    render(): void;
}
export = Director;
