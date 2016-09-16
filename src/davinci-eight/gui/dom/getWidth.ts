import cssValueToPixels from './cssValueToPixels';

export default function getWidth(elem: Element) {

  var style = getComputedStyle(elem);

  return cssValueToPixels(style['border-left-width']) +
    cssValueToPixels(style['border-right-width']) +
    cssValueToPixels(style['padding-left']) +
    cssValueToPixels(style['padding-right']) +
    cssValueToPixels(style['width']);
}
