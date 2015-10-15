import ISlide = require('../slideshow/ISlide');
import ISlideCommand = require('../../slideshow/ISlideCommand');
import IDirector = require('../../slideshow/IDirector');
import Shareable = require('../../utils/Shareable');
declare class TestCommand extends Shareable implements ISlideCommand {
    private name;
    constructor(name: string);
    protected destructor(): void;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = TestCommand;
