import SimplexGeometry = require('../../geometries/SimplexGeometry');
import ISlide = require('../../slideshow/ISlide');
import ISlideCommand = require('../../slideshow/ISlideCommand');
import IDirector = require('../../slideshow/IDirector');
import Shareable = require('../../utils/Shareable');
declare class CreateDrawable extends Shareable implements ISlideCommand {
    private name;
    private geometry;
    constructor(name: string, geometry: SimplexGeometry);
    protected destructor(): void;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = CreateDrawable;
