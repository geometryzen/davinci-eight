import IAnimation = require('../../slideshow/IAnimation');
import IAnimationTarget = require('../../slideshow/IAnimationTarget');
import Shareable = require('../../utils/Shareable');
import Spinor3Coords = require('../../math/Spinor3Coords');
declare class Spinor3Animation extends Shareable implements IAnimation {
    private from;
    private to;
    private duration;
    private start;
    private fraction;
    private callback;
    private ease;
    constructor(value: Spinor3Coords, duration?: number, callback?: () => void, ease?: string);
    protected destructor(): void;
    apply(target: IAnimationTarget, propName: string, now: number, offset: number): void;
    hurry(factor: number): void;
    skip(target: IAnimationTarget, propName: string): void;
    extra(now: number): number;
    done(target: IAnimationTarget, propName: string): boolean;
    undo(target: IAnimationTarget, propName: string): void;
}
export = Spinor3Animation;
