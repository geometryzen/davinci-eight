import IAnimationTarget from './IAnimationTarget';

interface SlideHost {
    getTarget(objectId: string): IAnimationTarget;
}

export default SlideHost;
