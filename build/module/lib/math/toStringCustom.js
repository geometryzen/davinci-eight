import { stringFromCoordinates } from '../math/stringFromCoordinates';
/**
 * @hidden
 */
export function toStringCustom(coordinates, coordToString, labels) {
    var quantityString = stringFromCoordinates(coordinates, coordToString, labels);
    return quantityString;
}
