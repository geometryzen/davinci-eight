import Cartesian3 = require('../../math/Cartesian3');
import IAnimation = require('../../animate/IAnimation');
import IAnimationClock = require('../../animate/IAnimationClock');
import IProperties = require('../../animate/IProperties');
import Shareable = require('../../utils/Shareable');
declare class MoveTo extends Shareable implements IAnimation {
    private host;
    private object;
    private key;
    private from;
    private to;
    private duration;
    private start;
    private fraction;
    private callback;
    private ease;
    constructor(host: IAnimationClock, object: IProperties, key: string, value: Cartesian3, duration?: number, callback?: () => void, ease?: string);
    protected destructor(): void;
    init(offset?: number): void;
    apply(offset?: number): void;
    hurry(factor: number): void;
    skip(): void;
    extra(): number;
    done(): boolean;
}
export = MoveTo;
