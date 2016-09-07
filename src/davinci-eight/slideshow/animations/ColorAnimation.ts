import IAnimation from '../../slideshow/IAnimation';
import AnimationOptions from './AnimationOptions';
import IAnimationTarget from '../../slideshow/IAnimationTarget';
import mustBeObject from '../../checks/mustBeObject';
import mustBeString from '../../checks/mustBeString';
import {ShareableBase} from '../../core/ShareableBase';
import {Color} from '../../core/Color';
/*
function loop(n: number, callback: (i: number) => void) {
    for (var i = 0; i < n; ++i) {
        callback(i)
    }
}
*/

export default class ColorAnimation extends ShareableBase implements IAnimation {
    private from: Color;
    private to: Color;
    private duration: number;
    private start: number;
    private fraction: number;
    private doneCallback: () => void;
    private undoCallback: () => void;
    private ease: string;
    constructor(color: { r: number; g: number; b: number }, duration = 300, options: AnimationOptions = {}) {
        super();
        this.setLoggingName('ColorAnimation');
        this.from = void 0;
        this.to = Color.copy(color);
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
    apply(target: IAnimationTarget, name: string, now: number, offset: number) {
        mustBeObject('target', target);
        mustBeString('name', name);
        if (!this.start) {
            this.start = now - offset;
            if (this.from === void 0) {
                if (target.getPropertyFormats) {
                    const fmts = target.getPropertyFormats(name);
                    if (fmts) {
                        for (let i = 0; i < fmts.length; i++) {
                            const fmt = fmts[i];
                            const data: number[] = target.getProperty(name, fmt);
                            if (data) {
                                this.from = Color.fromCoords(data);
                                break;
                            }
                            else {
                                throw new Error(`${name} is not supported by animation target.`);
                            }
                        }
                    }
                }
                else {
                    throw new Error("getPropertyFormats method is not supported by animation target.");
                }
            }
        }

        const from = this.from;
        const to = this.to;
        const ease = this.ease;

        // Calculate animation progress / fraction.
        let fraction: number;
        if (this.duration > 0) {
            fraction = Math.min(1, (now - this.start) / (this.duration || 1));
        }
        else {
            fraction = 1;
        }
        this.fraction = fraction;

        // Simple easing support.
        let rolloff: number
        switch (ease) {
            case 'in':
                rolloff = 1 - (1 - fraction) * (1 - fraction);
                break
            case 'out':
                rolloff = fraction * fraction;
                break
            case 'linear':
                rolloff = fraction;
                break
            default:
                rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI)
                break
        }
        if (target.setProperty) {
            target.setProperty(name, 'number[]', Color.lerp(from, to, rolloff).coords);
        }
        else {
            throw new Error("setProperty method is not supported by animation target.");
        }
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
            // Set final value.
            target.setProperty(propName, 'number[]', this.to.coords);
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
            target.setProperty(propName, 'number[]', this.from.coords)
            this.from = void 0;
            this.start = void 0;
            this.fraction = 0;
            if (this.undoCallback) {
                this.undoCallback();
            }
        }
    }
}
