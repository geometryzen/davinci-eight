import Slide from '../slideshow/Slide';
import SlideHost from '../slideshow/SlideHost';
import {Shareable} from '../core/Shareable';

interface ISlideCommand extends Shareable {
    redo(slide: Slide, host: SlideHost): void;
    undo(slide: Slide, host: SlideHost): void;
}

export default ISlideCommand;
