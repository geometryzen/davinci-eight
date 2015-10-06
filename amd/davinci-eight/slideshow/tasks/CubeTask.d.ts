import ISlide = require('../../slideshow/ISlide');
import ISlideHost = require('../../slideshow/ISlideHost');
import ISlideTask = require('../../slideshow/ISlideTask');
import Shareable = require('../../utils/Shareable');
declare class CubeTask extends Shareable implements ISlideTask {
    private name;
    private sceneNames;
    constructor(name: string, sceneNames: string[]);
    destructor(): void;
    exec(slide: ISlide, host: ISlideHost): void;
    undo(slide: ISlide, host: ISlideHost): void;
}
export = CubeTask;
