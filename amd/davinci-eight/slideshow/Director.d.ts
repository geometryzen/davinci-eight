import Slide = require('../slideshow/Slide');
import IAnimationTarget = require('../slideshow/IAnimationTarget');
import IDirector = require('../slideshow/IDirector');
import IUnknownArray = require('../collections/IUnknownArray');
import Shareable = require('../utils/Shareable');
/**
 * @class Director
 */
declare class Director extends Shareable implements IDirector {
    /**
     * [0, slides.length] represents on a slide
     * A value equal to -1 represents just before the first slide.
     * A value equal to slides.length represents just after the last slide.
     * @property step
     * @type {number}
     */
    private step;
    /**
     * @property slides
     * @type {IUnknownArray<Slide>}
     */
    slides: IUnknownArray<Slide>;
    /**
     * (name: string) => IAnimationTarget
     */
    private facets;
    /**
     * @class Director
     * @constructor
     */
    constructor();
    destructor(): void;
    addFacet(facet: IAnimationTarget, facetName: string): void;
    getFacet(facetName: string): IAnimationTarget;
    removeFacet(facetName: string): IAnimationTarget;
    /**
     * Creates a new Slide.
     * @method createSlide
     * @return {Slide}
     */
    createSlide(): Slide;
    go(step: number, instant?: boolean): void;
    forward(instant?: boolean, delay?: number): void;
    canForward(): boolean;
    backward(instant?: boolean, delay?: number): void;
    canBackward(): boolean;
    pushSlide(slide: Slide): number;
    popSlide(slide: Slide): Slide;
    advance(interval: number): void;
}
export = Director;
