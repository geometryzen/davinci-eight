import DrawMode = require('../core/DrawMode');
declare function adapterOptions(options?: {
    wireFrame?: boolean;
}): {
    drawMode: DrawMode;
};
export = adapterOptions;
