import { mustBeString } from "../checks/mustBeString";
import { LocalizableMessage } from "../i18n/LocalizableMessage";

/**
 * @hidden
 */
export function notSupported(name: string): LocalizableMessage {
    mustBeString("name", name);
    const message: LocalizableMessage = {
        get message(): string {
            return "Method `" + name + "` is not supported.";
        }
    };
    return message;
}
