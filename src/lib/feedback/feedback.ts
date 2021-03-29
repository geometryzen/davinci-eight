import { LocalizableMessage } from '../i18n/LocalizableMessage';

/**
 * @hidden
 */
export const feedback = {
    warn(message: LocalizableMessage) {
        console.warn(message.message);
    }
};
