import IAnimationTarget from '../slideshow/IAnimationTarget';
import {Shareable} from '../core/Shareable';

interface IAnimation extends Shareable {
    apply(target: IAnimationTarget, propName: string, now: number, offset: number): void;
    skip(target: IAnimationTarget, propName: string): void;
    hurry(factor: number): void;
    extra(now: number): number;
    done(target: IAnimationTarget, propName: string): boolean;
    undo(target: IAnimationTarget, propName: string): void;
}

export default IAnimation;
