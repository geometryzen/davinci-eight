import { mustBeString } from '../checks/mustBeString';
import { LocalizableMessage } from '../i18n/LocalizableMessage';

/**
 * @hidden
 */
export function notImplemented(name: string): LocalizableMessage {
    mustBeString('name', name);
    const message: LocalizableMessage = {
        get message(): string {
            return `'${name}' method is not yet implemented.`;
        }
    };
    return message;
}
