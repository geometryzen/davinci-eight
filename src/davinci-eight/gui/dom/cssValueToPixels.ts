import isNull from '../common/isNull';
import isUndefined from '../common/isUndefined';

const CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

export default function cssValueToPixels(val: string): number {

    if (val === '0' || isUndefined(val)) return 0;

    const match = val.match(CSS_VALUE_PIXELS);

    if (!isNull(match)) {
        return parseFloat(match[1]);
    }

    // TODO ...ems? %?

    return 0;

}
