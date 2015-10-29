import IAnimationTarget = require('../slideshow/IAnimationTarget');
interface IDirector {
    addFacet(facet: IAnimationTarget, facetName: string): void;
    getFacet(facetName: string): IAnimationTarget;
    removeFacet(facetName: string): IAnimationTarget;
}
export = IDirector;
