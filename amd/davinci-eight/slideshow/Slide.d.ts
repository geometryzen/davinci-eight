import IAnimation = require('../slideshow/IAnimation');
import IAnimationClock = require('../slideshow/IAnimationClock');
import IAnimateOptions = require('../slideshow/IAnimateOptions');
import IProperties = require('../slideshow/IProperties');
import ISlide = require('../slideshow/ISlide');
import ISlideHost = require('../slideshow/ISlideHost');
import ISlideTask = require('../slideshow/ISlideTask');
import Shareable = require('../utils/Shareable');
declare class Slide extends Shareable implements ISlide {
    private tasks;
    private animator;
    constructor();
    protected destructor(): void;
    clock: IAnimationClock;
    addTask<T extends ISlideTask>(task: T): T;
    animate(object: IProperties, animations: {
        [name: string]: IAnimation;
    }, options?: IAnimateOptions): void;
    update(speed: number): void;
    exec(host: ISlideHost): void;
    undo(host: ISlideHost): void;
}
export = Slide;
