import Cartesian3 = require('../../math/Cartesian3');
import IAnimateOptions = require('../../slideshow/IAnimateOptions');
import ISlide = require('../../slideshow/ISlide');
import ISlideHost = require('../../slideshow/ISlideHost');
import ISlideTask = require('../../slideshow/ISlideTask');
import Shareable = require('../../utils/Shareable');
declare class MoveTask extends Shareable implements ISlideTask {
    private name;
    position: Cartesian3;
    duration: number;
    callback: () => void;
    ease: string;
    options: IAnimateOptions;
    constructor(name: string, position: Cartesian3, duration?: number);
    destructor(): void;
    exec(slide: ISlide, host: ISlideHost): void;
    undo(slide: ISlide, host: ISlideHost): void;
}
export = MoveTask;
