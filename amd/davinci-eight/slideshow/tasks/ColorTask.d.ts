import ColorRGB = require('../../core/ColorRGB');
import ISlide = require('../../slideshow/ISlide');
import ISlideHost = require('../../slideshow/ISlideHost');
import ISlideTask = require('../../slideshow/ISlideTask');
import IUnknownExt = require('../../core/IUnknownExt');
import Shareable = require('../../utils/Shareable');
declare class ColorTask extends Shareable implements ISlideTask, IUnknownExt<ColorTask> {
    private name;
    color: ColorRGB;
    duration: number;
    callback: () => void;
    ease: string;
    constructor(name: string, color: ColorRGB, duration?: number);
    destructor(): void;
    incRef(): ColorTask;
    decRef(): ColorTask;
    exec(slide: ISlide, host: ISlideHost): void;
    undo(slide: ISlide, host: ISlideHost): void;
}
export = ColorTask;
