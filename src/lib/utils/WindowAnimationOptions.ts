import { BrowserWindow } from "../base/BrowserWindow";

/**
 * @hidden
 */
export interface WindowAnimationOptions {
    setUp?: () => void;
    tearDown?: (animateException: any) => void;
    terminate?: (time: number) => boolean;
    window?: BrowserWindow;
}
