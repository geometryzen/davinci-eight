import { mustBeString } from '../checks/mustBeString';
/**
 * @hidden
 */
export function cannotAssignTypeToProperty(type, name) {
    mustBeString('type', type);
    mustBeString('name', name);
    var message = {
        get message() {
            return "Cannot assign type `" + type + "` to property `" + name + "`.";
        }
    };
    return message;
}
