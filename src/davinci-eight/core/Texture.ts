import Resource = require('../core/Resource');

interface Texture extends Resource {
  bind(): void;
  unbind(): void;
}

export = Texture;