import IAnimation from '../slideshow/IAnimation';
import IAnimationTarget from '../slideshow/IAnimationTarget';

interface ISlide {
    pushAnimation(target: IAnimationTarget, propName: string, animation: IAnimation): void;
    popAnimation(target: IAnimationTarget, propName: string): IAnimation;
}

export default ISlide;
