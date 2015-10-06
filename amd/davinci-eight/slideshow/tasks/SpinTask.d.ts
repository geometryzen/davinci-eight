import Spinor3Coords = require('../../math/Spinor3Coords');
import IAnimateOptions = require('../../slideshow/IAnimateOptions');
import ISlide = require('../../slideshow/ISlide');
import ISlideHost = require('../../slideshow/ISlideHost');
import ISlideTask = require('../../slideshow/ISlideTask');
import Shareable = require('../../utils/Shareable');
declare class SpinTask extends Shareable implements ISlideTask {
    private name;
    attitude: Spinor3Coords;
    duration: number;
    callback: () => void;
    ease: string;
    options: IAnimateOptions;
    constructor(name: string, attitude: Spinor3Coords, duration?: number);
    destructor(): void;
    exec(slide: ISlide, host: ISlideHost): void;
    undo(slide: ISlide, host: ISlideHost): void;
}
export = SpinTask;
