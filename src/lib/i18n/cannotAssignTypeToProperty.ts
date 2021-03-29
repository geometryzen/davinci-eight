import { mustBeString } from '../checks/mustBeString';
import { LocalizableMessage } from '../i18n/LocalizableMessage';

/**
 * @hidden
 */
export function cannotAssignTypeToProperty(type: string, name: string): LocalizableMessage {
    mustBeString('type', type);
    mustBeString('name', name);
    const message: LocalizableMessage = {
        get message(): string {
            return "Cannot assign type `" + type + "` to property `" + name + "`.";
        }
    };
    return message;
}
