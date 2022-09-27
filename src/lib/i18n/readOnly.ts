import { mustBeString } from '../checks/mustBeString';
import { LocalizableMessage } from '../i18n/LocalizableMessage';

/**
 * @hidden
 */
export function readOnly(name: string): LocalizableMessage {
    mustBeString('name', name);
    const message: LocalizableMessage = {
        get message(): string {
            return "Property `" + name + "` is readonly.";
        }
    };
    return message;
}
