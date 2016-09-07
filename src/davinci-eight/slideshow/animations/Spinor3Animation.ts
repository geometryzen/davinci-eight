import IAnimation from '../../slideshow/IAnimation';
import AnimationOptions from './AnimationOptions';
import IAnimationTarget from '../../slideshow/IAnimationTarget';
import {ShareableBase} from '../../core/ShareableBase';
import Spinor3 from '../../math/Spinor3';
import SpinorE3 from '../../math/SpinorE3';

/*
function loop(n: number, callback: (i: number) => void) {
    for (let i = 0; i < n; ++i) {
        callback(i)
    }
}
*/

export default class Spinor3Animation extends ShareableBase implements IAnimation {
    private from: Spinor3;
    private to: Spinor3;
    private duration: number;
    private start: number;
    private fraction: number;
    private doneCallback: () => void;
    private undoCallback: () => void;
    private ease: string;
    constructor(value: SpinorE3, duration = 300, options: AnimationOptions = {}) {
        super();
        this.setLoggingName('Spinor3Animation');
        this.from = void 0;
        this.to = Spinor3.copy(value);
        this.duration = duration;
        this.start = 0;
        this.fraction = 0;
        this.doneCallback = options.doneCallback;
        this.undoCallback = options.undoCallback;
        this.ease = options.ease;
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
    apply(target: IAnimationTarget, propName: string, now: number, offset: number) {

        if (!this.start) {
            this.start = now - offset
            if (this.from === void 0) {
                var data: number[] = target.getProperty(propName, void 0);
                if (data) {
                    this.from = Spinor3.one()
                    this.from.coords = data
                }
            }
        }

        var from = this.from;
        var to = this.to;
        var ease = this.ease;

        // Calculate animation progress / fraction.
        var fraction: number;
        if (this.duration > 0) {
            fraction = Math.min(1, (now - this.start) / (this.duration || 1))
        }
        else {
            fraction = 1
        }
        this.fraction = fraction

        // Simple easing support.
        var rolloff: number
        switch (ease) {
            case 'in':
                rolloff = 1 - (1 - fraction) * (1 - fraction)
                break
            case 'out':
                rolloff = fraction * fraction
                break
            case 'linear':
                rolloff = fraction
                break
            default:
                rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI)
                break
        }

        const lerp = Spinor3.lerp(from, to, fraction)
        target.setProperty(propName, void 0, lerp.coords)
    }
    hurry(factor: number): void {
        this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
    }
    skip(target: IAnimationTarget, propName: string): void {
        this.duration = 0;
        this.fraction = 1;
        this.done(target, propName);
    }
    extra(now: number): number {
        return now - this.start - this.duration;
    }
    done(target: IAnimationTarget, propName: string): boolean {
        if (this.fraction === 1) {
            target.setProperty(propName, void 0, this.to.coords);
            if (this.doneCallback) {
                this.doneCallback();
            }
            return true;
        }
        else {
            return false;
        }
    }
    undo(target: IAnimationTarget, propName: string): void {
        if (this.from) {
            target.setProperty(propName, void 0, this.from.coords);
            this.from = void 0;
            this.start = void 0;
            this.fraction = 0;
            if (this.doneCallback) {
                this.doneCallback();
            }
        }
    }
}
