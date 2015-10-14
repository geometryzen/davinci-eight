import IAnimation = require('../slideshow/IAnimation');
import IAnimationTarget = require('../slideshow/IAnimationTarget');
import ISlideHost = require('../slideshow/ISlideHost');
import ISlideCommand = require('../slideshow/ISlideCommand');
import IUnknownArray = require('../utils/IUnknownArray');
import Shareable = require('../utils/Shareable');
declare class Slide extends Shareable {
    prolog: IUnknownArray<ISlideCommand>;
    epilog: IUnknownArray<ISlideCommand>;
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
    animate(target: IAnimationTarget, propName: string, animation: IAnimation, delay?: number, sustain?: number): void;
    /**
     * Update all currently running animations.
     * Essentially calls `apply` on each IAnimation in the queues of active objects.
     * @method advance
     * @param interval {number} Advances the static Slide.now property.
     */
    advance(interval: number): void;
    onEnter(host: ISlideHost): void;
    onExit(host: ISlideHost): void;
    undo(host: ISlideHost): void;
}
export = Slide;
