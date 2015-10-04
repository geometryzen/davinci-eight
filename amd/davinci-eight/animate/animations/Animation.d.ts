import IAnimation = require('../../animate/IAnimation');
import IAnimationClock = require('../../animate/IAnimationClock');
import IProperties = require('../../animate/IProperties');
import Shareable = require('../../utils/Shareable');
declare class Animation extends Shareable implements IAnimation {
    private host;
    object: IProperties;
    key: string;
    from: number[];
    to: number[];
    duration: number;
    start: number;
    fraction: number;
    callback: () => void;
    ease: string;
    constructor(host: IAnimationClock, object: IProperties, key: string, value: number[], duration: number, callback: () => void, ease: string);
    protected destructor(): void;
    init(offset?: number): void;
    apply(offset?: number): void;
    hurry(factor: number): void;
    skip(): void;
    extra(): number;
    done(): boolean;
}
export = Animation;
