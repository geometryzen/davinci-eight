import IDirector = require('../slideshow/IDirector');
import ISlide = require('../slideshow/ISlide');
import ISlideCommand = require('../slideshow/ISlideCommand');
import Shareable = require('../utils/Shareable');
declare class SlideCommands extends Shareable implements ISlideCommand {
    private commands;
    constructor();
    protected destructor(): void;
    pushWeakRef(command: ISlideCommand): number;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = SlideCommands;
