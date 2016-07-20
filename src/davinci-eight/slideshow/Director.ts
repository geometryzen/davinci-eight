import Slide from '../slideshow/Slide';
import IAnimationTarget from '../slideshow/IAnimationTarget';
import isDefined from '../checks/isDefined';
import incLevel from '../base/incLevel';
import ShareableArray from '../collections/ShareableArray';
import mustBeDefined from '../checks/mustBeDefined';
import mustBeString from '../checks/mustBeString';
import NumberShareableMap from '../collections/NumberShareableMap';
import {ShareableBase} from '../core/ShareableBase';
import StringShareableMap from '../collections/StringShareableMap';

export default class Director extends ShareableBase {
    private step: number;
    public slides: ShareableArray<Slide>;
    private facets: { [name: string]: IAnimationTarget };
    constructor() {
        super()
        this.setLoggingName('Director')
        this.step = -1 // Position before the first slide.
        this.slides = new ShareableArray<Slide>([])
        this.facets = {}
    }
    destructor(level: number): void {
        this.slides.release()
        this.slides = void 0
        this.facets = void 0
        super.destructor(incLevel(level))
    }
    addTarget(target: IAnimationTarget, name: string): void {
        this.facets[name] = target;
    }
    getTarget(name: string): IAnimationTarget {
        return this.facets[name];
    }
    removeTarget(name: string): IAnimationTarget {
        const target = this.getTarget(name);
        delete this.facets[name]
        return target;
    }
    createSlide(): Slide {
        return new Slide()
    }
    go(step: number, instant: boolean = false): void {
        if (this.slides.length === 0) {
            return
        }
        while (step < 0) step += this.slides.length + 1
    }
    forward(instant: boolean = true, delay: number = 0) {
        if (!this.canForward()) {
            return
        }
        var slideLeaving: Slide = this.slides.getWeakRef(this.step)
        var slideEntering: Slide = this.slides.getWeakRef(this.step + 1)
        var self = this;
        var apply = function() {
            if (slideLeaving) {
                slideLeaving.doEpilog(self, true)
            }
            if (slideEntering) {
                slideEntering.doProlog(self, true)
            }
            self.step++
        }
        if (delay) {
            setTimeout(apply, delay)
        }
        else {
            apply()
        }
    }
    canForward(): boolean {
        return this.step < this.slides.length
    }
    backward(instant: boolean = true, delay: number = 0) {
        if (!this.canBackward()) {
            return
        }
        var slideLeaving = this.slides.getWeakRef(this.step)
        var slideEntering = this.slides.getWeakRef(this.step - 1)
        var self = this;
        var apply = function() {
            if (slideLeaving) {
                slideLeaving.undo(self)
                slideLeaving.doProlog(self, false)
            }
            if (slideEntering) {
                slideEntering.doEpilog(self, false)
            }
            self.step--
        }
        if (delay) {
            setTimeout(apply, delay)
        }
        else {
            apply()
        }
    }
    canBackward(): boolean {
        return this.step > -1
    }
    pushSlide(slide: Slide): number {
        return this.slides.push(slide)
    }
    popSlide(slide: Slide): Slide {
        return this.slides.pop()
    }
    advance(interval: number): void {
        let slideIndex = this.step
        if (slideIndex >= 0 && slideIndex < this.slides.length) {
            var slide: Slide = this.slides.get(slideIndex)
            if (slide) {
                try {
                    slide.advance(interval)
                }
                finally {
                    slide.release()
                }
            }
            else {
                // This should never happen if we manage the index properly.
                console.warn("No slide found at index " + this.step)
            }
        }
    }
}
