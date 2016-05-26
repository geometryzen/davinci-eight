import core from '../config';
import LocalizableMessage from '../i18n/LocalizableMessage';

const feedback = {
    warn(message: LocalizableMessage) {
        console.warn(message.message)
    }
}

export default feedback