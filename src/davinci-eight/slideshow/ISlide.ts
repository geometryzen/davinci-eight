import IAnimation = require('../slideshow/IAnimation')
import IAnimationTarget = require('../slideshow/IAnimationTarget')

interface ISlide {
  pushAnimation(target: IAnimationTarget, propName: string, animation: IAnimation): void;
  popAnimation(target: IAnimationTarget, propName: string): IAnimation;
}

export = ISlide