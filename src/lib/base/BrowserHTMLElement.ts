import { BrowserDocument } from './BrowserDocument';

/**
 * @hidden
 */
export interface BrowserHTMLElement extends EventTarget {
  clientLeft: number;
  clientTop: number;
  ownerDocument: BrowserDocument;
  getBoundingClientRect(): { left: number, top: number, width: number, height: number };
}
