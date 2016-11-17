import BrowserWindow from '../base/BrowserWindow';

interface WindowAnimationOptions {
  setUp?: () => void;
  tearDown?: (animateException: any) => void;
  terminate?: (time: number) => boolean;
  window?: BrowserWindow;
}

export default WindowAnimationOptions;
