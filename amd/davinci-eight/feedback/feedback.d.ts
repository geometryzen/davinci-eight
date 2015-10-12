import LocalizableMessage = require('../i18n/LocalizableMessage');
declare var feedback: {
    warn(message: LocalizableMessage): void;
};
export = feedback;
