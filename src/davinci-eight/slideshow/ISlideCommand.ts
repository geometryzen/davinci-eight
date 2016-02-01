import ISlide from '../slideshow/ISlide';
import IDirector from '../slideshow/IDirector';
import IUnknown from '../core/IUnknown';

interface ISlideCommand extends IUnknown {
    redo(slide: ISlide, director: IDirector): void;
    undo(slide: ISlide, director: IDirector): void;
}

export default ISlideCommand;
