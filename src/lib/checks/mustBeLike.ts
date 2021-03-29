import { mustHaveOwnProperty } from './mustHaveOwnProperty';

/**
 * @hidden
 */
export function mustBeLike<T>(name: string, value: T, duck: T, contextBuilder?: () => string): T {
    const props: string[] = Object.keys(duck);
    for (let i = 0, iLength = props.length; i < iLength; i++) {
        mustHaveOwnProperty(name, value, props[i], contextBuilder);
    }
    return value;
}
