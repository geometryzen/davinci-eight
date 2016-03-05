import ISlide from '../slideshow/ISlide';
import IDirector from '../slideshow/IDirector';
import Shareable from '../core/Shareable';

interface ISlideCommand extends Shareable {
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}

export default ISlideCommand;
