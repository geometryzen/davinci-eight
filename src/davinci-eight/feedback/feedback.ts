import core from '../core';
import LocalizableMessage from '../i18n/LocalizableMessage';

var feedback = {
  warn(message: LocalizableMessage) {
    if (core.strict) {
      throw new Error(message.message)
    }
    else {
      console.warn(message.message)
    }
  }
}

export default feedback