import { LocalizableMessage } from '../i18n/LocalizableMessage';

export const feedback = {
    warn(message: LocalizableMessage) {
        console.warn(message.message);
    }
};
