import ISlide from '../slideshow/ISlide';
import Director from '../slideshow/Director';
import {Shareable} from '../core/Shareable';

interface ISlideCommand extends Shareable {
    redo(slide: ISlide, director: Director): void;
    undo(slide: ISlide, director: Director): void;
}

export default ISlideCommand;
