import { mustHaveOwnProperty } from './mustHaveOwnProperty';
/**
 * @hidden
 */
export function mustBeLike(name, value, duck, contextBuilder) {
    var props = Object.keys(duck);
    for (var i = 0, iLength = props.length; i < iLength; i++) {
        mustHaveOwnProperty(name, value, props[i], contextBuilder);
    }
    return value;
}
