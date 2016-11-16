import BrowserHTMLElement from './BrowserHTMLElement';
/**
 * Intentionally undocumented.
 * This interface is defined to enable mocking in tests.
 */
interface BrowserDocument extends EventTarget {
  documentElement: BrowserHTMLElement;
  getElementById(elementId: string): HTMLElement;
}

export default BrowserDocument;
