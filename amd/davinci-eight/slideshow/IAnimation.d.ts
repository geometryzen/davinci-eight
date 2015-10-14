import IAnimationTarget = require('../slideshow/IAnimationTarget');
import IUnknown = require('../core/IUnknown');
/**
 * An animation represents the runtime aspects of changing properties.
 * @class IAnimation
 * @extends IUnknown
 */
interface IAnimation extends IUnknown {
    /**
     * @method apply
     * @param offset {number}
     * @return {void}
     */
    apply(target: IAnimationTarget, propName: string, now: number, offset: number): void;
    /**
     * @method skip
     * @return {void}
     */
    skip(target: IAnimationTarget, propName: string): void;
    /**
     * @method hurry
     * @param factor {number}
     * @return {void}
     */
    hurry(factor: number): void;
    /**
     * extra = now - start - duration, the elapsed time, as of now, since the animation finished.
     * start + duration = now - extra, when the animation finished.
     * @method extra
     * @return {number}
     */
    extra(now: number): number;
    /**
     * @method done
     * @return {boolean}
     */
    done(target: IAnimationTarget, propName: string): boolean;
    undo(target: IAnimationTarget, propName: string): void;
}
export = IAnimation;
