import IAnimation = require('../slideshow/IAnimation');
import IAnimationTarget = require('../slideshow/IAnimationTarget');
import IDirector = require('../slideshow/IDirector');
import ISlide = require('../slideshow/ISlide');
import Shareable = require('../utils/Shareable');
import SlideCommands = require('../slideshow/SlideCommands');
declare class Slide extends Shareable implements ISlide {
    prolog: SlideCommands;
    epilog: SlideCommands;
    /**
     * The objects that we are going to manipulate.
     */
    private targets;
    /**
     * The companions to each target that maintain animation state.
     */
    private mirrors;
    /**
     * The time standard for this Slide.
     */
    private now;
    constructor();
    protected destructor(): void;
    private ensureTarget(target);
    private ensureMirror(target);
    pushAnimation(target: IAnimationTarget, propName: string, animation: IAnimation): void;
    popAnimation(target: IAnimationTarget, propName: string): IAnimation;
    /**
     * Update all currently running animations.
     * Essentially calls `apply` on each IAnimation in the queues of active objects.
     * @method advance
     * @param interval {number} Advances the static Slide.now property.
     */
    advance(interval: number): void;
    doProlog(director: IDirector, forward: boolean): void;
    doEpilog(director: IDirector, forward: boolean): void;
    undo(director: IDirector): void;
}
export = Slide;
