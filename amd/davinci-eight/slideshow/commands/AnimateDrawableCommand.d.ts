import IAnimation = require('../slideshow/IAnimation');
import ISlide = require('../slideshow/ISlide');
import ISlideCommand = require('../../slideshow/ISlideCommand');
import IDirector = require('../../slideshow/IDirector');
import Shareable = require('../../utils/Shareable');
declare class AnimateDrawableCommand extends Shareable implements ISlideCommand {
    private drawableName;
    private facetName;
    private propName;
    private animation;
    constructor(drawableName: string, facetName: string, propName: string, animation: IAnimation);
    protected destructor(): void;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = AnimateDrawableCommand;
