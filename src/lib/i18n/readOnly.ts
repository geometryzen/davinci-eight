import { LocalizableMessage } from '../i18n/LocalizableMessage';
import { mustBeString } from '../checks/mustBeString';

export function readOnly(name: string): LocalizableMessage {
    mustBeString('name', name);
    let message: LocalizableMessage = {
        get message(): string {
            return "Property `" + name + "` is readonly.";
        }
    };
    return message;
}
