import ISlide = require('../../slideshow/ISlide');
import ISlideCommand = require('../../slideshow/ISlideCommand');
import IDirector = require('../../slideshow/IDirector');
import Shareable = require('../../utils/Shareable');
declare class UseDrawableInSceneCommand extends Shareable implements ISlideCommand {
    private drawableName;
    private sceneName;
    private confirm;
    /**
     * Enables us to restore the drawable in the event of undo.
     */
    private wasHere;
    constructor(drawableName: string, sceneName: string, confirm: boolean);
    protected destructor(): void;
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}
export = UseDrawableInSceneCommand;
