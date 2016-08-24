import isDefined from '../checks/isDefined';
import mustBeInteger from '../checks/mustBeInteger';

const DEFAULT_K = 2;

export default function kFromOptions(options: {k?: number}): number {
    if (isDefined(options)) {
        return isDefined(options.k) ? mustBeInteger('k', options.k) : DEFAULT_K;
    }
    else {
        return DEFAULT_K;
    }
}
