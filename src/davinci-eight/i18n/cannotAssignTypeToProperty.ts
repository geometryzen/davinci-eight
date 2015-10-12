import LocalizableMessage = require('../i18n/LocalizableMessage');
import mustBeString = require('../checks/mustBeString');
/**
 *
 */
function cannotAssignTypeToProperty(type: string, name: string): LocalizableMessage {
  mustBeString('type', type);
  mustBeString('name', name);
  let message: LocalizableMessage = {
    get message(): string {
      return "Cannot assign type `" + type + "` to property `" + name + "`."
    }
  }
  return message
}

export = cannotAssignTypeToProperty