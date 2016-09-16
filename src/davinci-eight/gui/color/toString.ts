import isUndefined from '../common/isUndefined';

export default function toString(color: { r: number; g: number; b: number; a: number; hex: any }) {

  if (color.a === 1 || isUndefined(color.a)) {

    var s = color.hex.toString(16);
    while (s.length < 6) {
      s = '0' + s;
    }

    return '#' + s;

  }
  else {

    return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

  }

}
