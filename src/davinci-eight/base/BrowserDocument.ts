/**
 * Intentionally undocumented.
 * This interface is defined to enable mocking in tests.
 */
interface BrowserDocument extends EventTarget {
  getElementById(elementId: string): HTMLElement;
}

export default BrowserDocument
