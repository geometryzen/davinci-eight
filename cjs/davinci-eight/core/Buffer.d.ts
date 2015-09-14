import Resource = require('../core/Resource');
interface Buffer extends Resource {
    bind(): void;
    unbind(): void;
}
export = Buffer;
