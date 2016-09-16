import cssValueToPixels from './cssValueToPixels';

export default function getHeight(elem: Element) {

    const style = window.getComputedStyle(elem);

    return cssValueToPixels(style['border-top-width']) +
        cssValueToPixels(style['border-bottom-width']) +
        cssValueToPixels(style['padding-top']) +
        cssValueToPixels(style['padding-bottom']) +
        cssValueToPixels(style['height']);
}
