import { BrowserDocument } from './BrowserDocument';
/**
 * Intentionally undocumented.
 * This interface is defined to enable mocking in tests.
 */
export interface BrowserWindow extends EventTarget {
    document: BrowserDocument;
    cancelAnimationFrame(handle: number): void;
    requestAnimationFrame(callback: FrameRequestCallback): number;
}
