import { mustBeString } from '../checks/mustBeString';
/**
 * @hidden
 */
export function notImplemented(name) {
    mustBeString('name', name);
    var message = {
        get message() {
            return "'" + name + "' method is not yet implemented.";
        }
    };
    return message;
}
