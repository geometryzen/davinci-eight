import IAnimation from '../../slideshow/IAnimation';
import IAnimationTarget from '../../slideshow/IAnimationTarget';
import ShareableBase from '../../core/ShareableBase';
import Spinor2 from '../../math/Spinor2';
import SpinorE2 from '../../math/SpinorE2';

function loop(n: number, callback: (i: number) => void) {
    for (var i = 0; i < n; ++i) {
        callback(i)
    }
}

export default class Spinor2Animation extends ShareableBase implements IAnimation {
    private from: Spinor2;
    private to: Spinor2;
    private duration: number;
    private start: number;
    private fraction: number;
    private callback: () => void;
    private ease: string;
    constructor(value: SpinorE2, duration: number = 300, callback?: () => void, ease?: string) {
        super('Spinor2Animation', 1)
        this.from = void 0
        this.to = Spinor2.copy(value)
        this.duration = duration
        this.start = 0
        this.fraction = 0
        this.callback = callback
        this.ease = ease
    }
    protected destructor(): void {
    }
    apply(target: IAnimationTarget, propName: string, now: number, offset: number) {

        if (!this.start) {
            this.start = now - offset
            if (this.from === void 0) {
                var data: number[] = target.getProperty(propName)
                if (data) {
                    this.from = new Spinor2()
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

        var lerp = Spinor2.lerp(from, to, fraction)
        target.setProperty(propName, lerp.coords)
    }
    hurry(factor: number): void {
        this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
    }
    skip(target: IAnimationTarget, propName: string): void {
        this.duration = 0
        this.fraction = 1
        this.done(target, propName)
    }
    extra(now: number): number {
        return now - this.start - this.duration;
    }
    done(target: IAnimationTarget, propName: string): boolean {
        if (this.fraction === 1) {
            target.setProperty(propName, this.to.coords);
            this.callback && this.callback()
            this.callback = void 0
            return true
        }
        else {
            return false
        }
    }
    undo(target: IAnimationTarget, propName: string): void {
        if (this.from) {
            target.setProperty(propName, this.from.coords)
            this.from = void 0
            this.start = void 0
            this.fraction = 0
        }
    }
}
