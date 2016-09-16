export default function makeSelectable(elem: HTMLElement, selectable: boolean): void {

  if (elem === undefined || elem.style === undefined) return;

  elem.onselectstart = selectable ? function () {
    return false;
  } : function () {
    // Nothing to see here.
  };

  elem.style['MozUserSelect'] = selectable ? 'auto' : 'none';
  elem.style['KhtmlUserSelect'] = selectable ? 'auto' : 'none';
  elem['unselectable'] = selectable ? 'on' : 'off';

}
