import BrowserDocument from './BrowserDocument'
/**
 * Intentionally undocumented.
 * This interface is defined to enable mocking in tests.
 */
interface BrowserWindow extends EventTarget {
  document: BrowserDocument;
}

export default BrowserWindow
