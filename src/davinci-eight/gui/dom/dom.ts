export function makeFullscreen(elem, horizontal = true, vertical = true) {

  elem.style.position = 'absolute';

  if (horizontal) {
    elem.style.left = 0;
    elem.style.right = 0;
  }
  if (vertical) {
    elem.style.top = 0;
    elem.style.bottom = 0;
  }

}

export function hasClass(elem, className) {
  return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
}
