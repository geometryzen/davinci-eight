import IAnimation from '../../slideshow/IAnimation';
import IAnimationTarget from '../../slideshow/IAnimationTarget';
import {ShareableBase} from '../../core/ShareableBase';

export default class NarrateAnimation extends ShareableBase implements IAnimation {
    private text: string;
    private duration: number;
    private start: number;
    private fraction: number;
    private callback: () => void;
    constructor(text: string, duration = 300, callback?: () => void) {
        super();
        this.setLoggingName('NarrateAnimation');
        this.text = text;
        this.duration = duration;
        this.start = 0;
        this.fraction = 0;
        this.callback = callback;
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
    apply(target: IAnimationTarget, propName: string, now: number, offset: number) {
        if (!this.start) {
            this.start = now - offset;
            const msg = new window['SpeechSynthesisUtterance']();
            var voices = window['speechSynthesis'].getVoices();
            msg.voice = voices[10]; // Note: some voices don't support altering params
            msg.voiceURI = 'native';
            msg.volume = 0.5; // 0 to 1
            // msg.rate = 1; // 0.1 to 10
            // msg.pitch = 2; //0 to 2
            msg.text = this.text;
            msg.lang = 'en-US';
            window['speechSynthesis'].speak(msg);
        }

        // Calculate animation progress / fraction.
        let fraction: number;
        if (this.duration > 0) {
            fraction = Math.min(1, (now - this.start) / (this.duration || 1));
        }
        else {
            fraction = 1;
        }
        this.fraction = fraction;

        if (target.setProperty) {
            // Nothin to do yet.
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
            if (this.callback) {
                this.callback();
                this.callback = void 0;
            }
            return true;
        }
        else {
            return false
        }
    }
    undo(target: IAnimationTarget, propName: string): void {
        this.start = void 0
        this.fraction = 0
    }
}
