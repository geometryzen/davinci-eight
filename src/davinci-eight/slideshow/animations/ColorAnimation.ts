import ColorRGBA = require('../../core/ColorRGBA')
import IAnimation = require('../../slideshow/IAnimation')
import IAnimationTarget = require('../../slideshow/IAnimationTarget')
import Shareable = require('../../utils/Shareable')
import Color = require('../../core/Color')

function loop(n: number, callback: (i: number) => void) {
    for (var i = 0; i < n; ++i) {
        callback(i)
    }
}

class ColorAnimation extends Shareable implements IAnimation {
    private from: Color;
    private to: Color;
    private duration: number;
    private start: number;
    private fraction: number;
    private callback: () => void;
    private ease: string;
    constructor(color: ColorRGBA, duration: number = 300, callback?: () => void, ease?: string) {
        super('ColorAnimation')
        this.from = void 0
        this.to = Color.fromColor(color)
        this.duration = duration
        this.start = 0
        this.fraction = 0
        this.callback = callback
        this.ease = ease
    }
    protected destructor(): void {
        super.destructor()
    }
    apply(target: IAnimationTarget, propName: string, now: number, offset: number) {
        if (!this.start) {
            this.start = now - offset
            if (this.from === void 0) {
                var data: number[] = target.getProperty(propName)
                if (data) {
                    this.from = Color.fromCoords(data);
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
        target.setProperty(propName, Color.interpolate(from, to, rolloff).coords)
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
            // Set final value.
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

export = ColorAnimation
