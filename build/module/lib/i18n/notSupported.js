import { mustBeString } from '../checks/mustBeString';
/**
 * @hidden
 */
export function notSupported(name) {
    mustBeString('name', name);
    var message = {
        get message() {
            return "Method `" + name + "` is not supported.";
        }
    };
    return message;
}
