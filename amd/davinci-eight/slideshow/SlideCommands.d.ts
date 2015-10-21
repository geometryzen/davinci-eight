import SimplexGeometry = require('../geometries/SimplexGeometry');
import IAnimation = require('../slideshow/IAnimation');
import IDirector = require('../slideshow/IDirector');
import ISlide = require('../slideshow/ISlide');
import ISlideCommand = require('../slideshow/ISlideCommand');
import Shareable = require('../utils/Shareable');
import ColorRGB = require('../core/ColorRGB');
import Cartesian3 = require('../math/Cartesian3');
import Spinor3Coords = require('../math/Spinor3Coords');
declare class SlideCommands extends Shareable implements ISlideCommand {
    private commands;
    constructor();
    protected destructor(): void;
    animateDrawable(drawableName: string, facetName: string, propName: string, animation: IAnimation): number;
    attitude(drawableName: string, attitude: Spinor3Coords, duration?: number, callback?: () => any): number;
    color(drawableName: string, color: ColorRGB, duration?: number, callback?: () => any): number;
    createDrawable(drawableName: string, geometry: SimplexGeometry): number;
    cuboid(drawableName: string, a?: Cartesian3, b?: Cartesian3, c?: Cartesian3, k?: number, subdivide?: number, boundary?: number): number;
    destroyDrawable(drawableName: string): number;
    position(drawableName: string, position: Cartesian3, duration?: number, callback?: () => any): number;
    useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): number;
    pushWeakRef(command: ISlideCommand): number;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = SlideCommands;
