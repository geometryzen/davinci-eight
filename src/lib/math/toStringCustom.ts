import { stringFromCoordinates } from "../math/stringFromCoordinates";

/**
 * @hidden
 */
export function toStringCustom(coordinates: number[], coordToString: (x: number) => string, labels: string[]): string {
    const quantityString: string = stringFromCoordinates(coordinates, coordToString, labels);
    return quantityString;
}
