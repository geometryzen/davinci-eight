import IAnimation = require('../../slideshow/IAnimation');
import IAnimationTarget = require('../../slideshow/IAnimationTarget');
import Shareable = require('../../utils/Shareable');
declare class WaitAnimation extends Shareable implements IAnimation {
    start: number;
    duration: number;
    fraction: number;
    constructor(duration: number);
    protected destructor(): void;
    apply(target: IAnimationTarget, propName: string, now: number, offset: number): void;
    skip(): void;
    hurry(factor: number): void;
    extra(now: number): number;
    done(target: IAnimationTarget, propName: string): boolean;
    undo(target: IAnimationTarget, propName: string): void;
}
export = WaitAnimation;
