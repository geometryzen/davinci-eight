import Slide from '../slideshow/Slide';
import IAnimationTarget from '../slideshow/IAnimationTarget';
import isDefined from '../checks/isDefined';
import IDirector from '../slideshow/IDirector';
import IUnknownArray from '../collections/IUnknownArray';
import mustBeDefined from '../checks/mustBeDefined';
import mustBeString from '../checks/mustBeString';
import NumberIUnknownMap from '../collections/NumberIUnknownMap';
import Shareable from '../utils/Shareable';
import StringIUnknownMap from '../collections/StringIUnknownMap';

/**
 * @class Director
 */
export default class Director extends Shareable implements IDirector {
    /**
     * [0, slides.length] represents on a slide
     * A value equal to -1 represents just before the first slide.
     * A value equal to slides.length represents just after the last slide. 
     * @property step
     * @type {number}
     */
    private step: number;
    /**
     * @property slides
     * @type {IUnknownArray}
     */
    public slides: IUnknownArray<Slide>;
    /**
     * (name: string) => IAnimationTarget
     */
    private facets: { [name: string]: IAnimationTarget };
    /**
     * @class Director
     * @constructor
     */
    constructor() {
        super('Director')
        this.step = -1 // Position before the first slide.
        this.slides = new IUnknownArray<Slide>([])
        this.facets = {}
    }
    destructor(): void {
        this.slides.release()
        this.slides = void 0
        this.facets = void 0
    }
    addFacet(facet: IAnimationTarget, facetName: string): void {
        this.facets[facetName] = facet
    }
    getFacet(facetName: string): IAnimationTarget {
        return this.facets[facetName]
    }
    removeFacet(facetName: string): IAnimationTarget {
        var facet = this.getFacet(facetName)
        delete this.facets[facetName]
        return facet
    }
    /**
     * Creates a new Slide.
     * @method createSlide
     * @return {Slide}
     */
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
