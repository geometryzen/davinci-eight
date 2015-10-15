import ISlide = require('../slideshow/ISlide');
import ISlideCommand = require('../../slideshow/ISlideCommand');
import IDirector = require('../../slideshow/IDirector');
import Shareable = require('../../utils/Shareable');
declare class DestroyDrawableCommand extends Shareable implements ISlideCommand {
    private name;
    private drawable;
    constructor(name: string);
    protected destructor(): void;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = DestroyDrawableCommand;
