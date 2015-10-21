import SimplexGeometry = require('../geometries/SimplexGeometry');
import IAnimation = require('../slideshow/IAnimation');
import IDirector = require('../slideshow/IDirector');
import ISlide = require('../slideshow/ISlide');
import ISlideCommand = require('../slideshow/ISlideCommand');
import Shareable = require('../utils/Shareable');
import ColorRGB = require('../core/ColorRGB');
import VectorE3 = require('../math/VectorE3');
import SpinorE3 = require('../math/SpinorE3');
declare class SlideCommands extends Shareable implements ISlideCommand {
    private commands;
    constructor();
    protected destructor(): void;
    animateDrawable(drawableName: string, facetName: string, propName: string, animation: IAnimation): number;
    attitude(drawableName: string, attitude: SpinorE3, duration?: number, callback?: () => any): number;
    color(drawableName: string, color: ColorRGB, duration?: number, callback?: () => any): number;
    createDrawable(drawableName: string, geometry: SimplexGeometry): number;
    cuboid(drawableName: string, a?: VectorE3, b?: VectorE3, c?: VectorE3, k?: number, subdivide?: number, boundary?: number): number;
    destroyDrawable(drawableName: string): number;
    position(drawableName: string, position: VectorE3, duration?: number, callback?: () => any): number;
    useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): number;
    pushWeakRef(command: ISlideCommand): number;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = SlideCommands;
