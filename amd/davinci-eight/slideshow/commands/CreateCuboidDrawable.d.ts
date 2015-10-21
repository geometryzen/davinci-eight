import VectorE3 = require('../../math/VectorE3');
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
    constructor(name: string, a?: VectorE3, b?: VectorE3, c?: VectorE3, k?: number, subdivide?: number, boundary?: number);
    protected destructor(): void;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = CreateCuboidDrawable;
