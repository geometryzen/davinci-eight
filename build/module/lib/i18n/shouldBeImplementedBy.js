import { mustBeString } from '../checks/mustBeString';
export function shouldBeImplementedBy(name, type) {
    mustBeString('name', name);
    var message = {
        get message() {
            return "Method '" + name + "' should be implemented by " + type + ".";
        }
    };
    return message;
}
