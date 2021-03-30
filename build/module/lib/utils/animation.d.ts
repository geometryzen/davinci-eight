import { WindowAnimationRunner } from '../utils/WindowAnimationRunner';
import { WindowAnimationOptions } from './WindowAnimationOptions';
/**
 * @hidden
 */
export declare function animation(animate: (time: number) => void, options?: WindowAnimationOptions): WindowAnimationRunner;
