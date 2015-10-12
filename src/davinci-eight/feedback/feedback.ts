import core = require('../core')
import LocalizableMessage = require('../i18n/LocalizableMessage')

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

export = feedback