import Spinor3Coords = require('../../math/Spinor3Coords');
import IAnimation = require('../../slideshow/IAnimation');
import IAnimationClock = require('../../slideshow/IAnimationClock');
import IProperties = require('../../slideshow/IProperties');
import Shareable = require('../../utils/Shareable');
declare class SpinTo extends Shareable implements IAnimation {
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
    constructor(host: IAnimationClock, object: IProperties, key: string, value: Spinor3Coords, duration?: number, callback?: () => void, ease?: string);
    protected destructor(): void;
    init(offset?: number): void;
    apply(offset?: number): void;
    hurry(factor: number): void;
    skip(): void;
    extra(): number;
    done(): boolean;
}
export = SpinTo;
