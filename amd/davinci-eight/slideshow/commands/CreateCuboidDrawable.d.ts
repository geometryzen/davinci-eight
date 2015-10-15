import Cartesian3 = require('../../math/Cartesian3');
import ISlide = require('../../slideshow/ISlide');
import ISlideCommand = require('../../slideshow/ISlideCommand');
import IDirector = require('../../slideshow/IDirector');
import Shareable = require('../../utils/Shareable');
declare class CreateCuboidDrawable extends Shareable implements ISlideCommand {
    private name;
    private a;
    private b;
    private c;
    private k;
    private subdivide;
    private boundary;
    constructor(name: string, a?: Cartesian3, b?: Cartesian3, c?: Cartesian3, k?: number, subdivide?: number, boundary?: number);
    protected destructor(): void;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = CreateCuboidDrawable;
