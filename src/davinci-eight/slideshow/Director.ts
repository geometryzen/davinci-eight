import IAnimationTarget from '../slideshow/IAnimationTarget';
import exchange from '../base/exchange';
import Slide from '../slideshow/Slide';
import SlideHost from '../slideshow/SlideHost';
import ShareableArray from '../collections/ShareableArray';
import {ShareableBase} from '../core/ShareableBase';
import StringShareableMap from '../collections/StringShareableMap';

export default class Director extends ShareableBase implements SlideHost {
    private slideIndex: number;
    public slides: ShareableArray<Slide>;
    private targets: StringShareableMap<IAnimationTarget>;
    constructor() {
        super();
        this.setLoggingName('Director');
        this.slideIndex = -1; // Position before the first slide.
        this.slides = new ShareableArray<Slide>([]);
        this.targets = new StringShareableMap<IAnimationTarget>();
    }
    destructor(levelUp: number): void {
        this.slides = exchange(this.slides, void 0);
        this.targets = exchange(this.targets, void 0);
        super.destructor(levelUp + 1);
    }
    putTarget(target: IAnimationTarget, objectId: string): void {
        this.targets.put(objectId, target);
    }
    getTarget(objectId: string): IAnimationTarget {
        return this.targets.get(objectId);
    }
    removeTarget(objectId: string): IAnimationTarget {
        return this.targets.remove(objectId);
    }
    go(slideIndex: number, instant = false): void {
        if (this.slides.length === 0) {
            return;
        }
        while (slideIndex < 0) slideIndex += this.slides.length + 1
    }
    forward(instant = true, delay = 0): void {
        if (!this.canForward()) {
            return;
        }
        const slideLeaving: Slide = this.slides.getWeakRef(this.slideIndex);
        const slideEntering: Slide = this.slides.getWeakRef(this.slideIndex + 1);
        const apply = () => {
            if (slideLeaving) {
                slideLeaving.doEpilog(this, true);
            }
            if (slideEntering) {
                slideEntering.doProlog(this, true);
            }
            this.slideIndex++;
        }
        if (delay) {
            setTimeout(apply, delay);
        }
        else {
            apply();
        }
    }
    canForward(): boolean {
        return this.slideIndex < this.slides.length;
    }
    backward(instant = true, delay = 0) {
        if (!this.canBackward()) {
            return;
        }
        const slideLeaving = this.slides.getWeakRef(this.slideIndex);
        const slideEntering = this.slides.getWeakRef(this.slideIndex - 1);
        const apply = () => {
            if (slideLeaving) {
                slideLeaving.undo(this);
                slideLeaving.doProlog(this, false);
            }
            if (slideEntering) {
                slideEntering.doEpilog(this, false);
            }
            this.slideIndex--;
        }
        if (delay) {
            setTimeout(apply, delay);
        }
        else {
            apply();
        }
    }
    canBackward(): boolean {
        return this.slideIndex > -1;
    }
    add(slide: Slide): Director {
        this.slides.push(slide);
        return this;
    }
    advance(interval: number): void {
        const slideIndex = this.slideIndex;
        if (slideIndex >= 0 && slideIndex < this.slides.length) {
            var slide: Slide = this.slides.get(slideIndex);
            if (slide) {
                try {
                    slide.advance(interval);
                }
                finally {
                    slide.release();
                }
            }
            else {
                // This should never happen if we manage the index properly.
                console.warn("No slide found at index " + this.slideIndex);
            }
        }
    }
}
