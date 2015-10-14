import Cartesian3 = require('../../math/Cartesian3');
import IAnimation = require('../../slideshow/IAnimation');
import IAnimationTarget = require('../../slideshow/IAnimationTarget');
import Shareable = require('../../utils/Shareable');
declare class Vector3Animation extends Shareable implements IAnimation {
    private from;
    private to;
    private duration;
    private start;
    private fraction;
    private callback;
    private ease;
    constructor(value: Cartesian3, duration?: number, callback?: () => void, ease?: string);
    protected destructor(): void;
    apply(target: IAnimationTarget, propName: string, now: number, offset: number): void;
    hurry(factor: number): void;
    skip(target: IAnimationTarget, propName: string): void;
    extra(now: number): number;
    done(target: IAnimationTarget, propName: string): boolean;
    undo(target: IAnimationTarget, propName: string): void;
}
export = Vector3Animation;
