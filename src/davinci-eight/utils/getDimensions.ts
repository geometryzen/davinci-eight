import exists from './exists'
import isBrowser from './isBrowser'
import WidthAndHeight from './WidthAndHeight'

export default function getDimensions(elementId: string, doc: Document): WidthAndHeight {

    const pixelDimRegExp = /\d+(\.\d*)?px/;

    if (!isBrowser() || elementId === null) {
        return {
            width: 500,
            height: 500
        };
    }

    const element = doc.getElementById(elementId);
    if (!exists(element)) {
        throw new Error("\nHTML container element '" + elementId + "' not found.");
    }

    const display = element.style.display;

    // Work around a bug in Safari
    if (display !== 'none' && display !== null) {
        if (element.clientWidth > 0 && element.clientHeight > 0) {
            return { width: element.clientWidth, height: element.clientHeight };
        }

        // a parent might be set to display:none; try reading them from styles
        const style = window.getComputedStyle ? window.getComputedStyle(element) : element.style;
        return {
            width: pixelDimRegExp.test(style.width) ? parseFloat(style.width) : 0,
            height: pixelDimRegExp.test(style.height) ? parseFloat(style.height) : 0
        };
    }

    // All *Width and *Height properties give 0 on elements with display set to none,
    // hence we show the element temporarily
    const els = element.style;

    // save style
    const originalVisibility = els.visibility;
    const originalPosition = els.position;
    const originalDisplay = els.display;

    // show element
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';

    // read the dimension
    const originalWidth = element.clientWidth;
    const originalHeight = element.clientHeight;

    // restore original css values
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;

    return {
        width: originalWidth,
        height: originalHeight
    };
}