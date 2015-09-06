import DrawMode = require('../core/DrawMode');
declare function adapterOptions(options?: {
    wireFrame?: boolean;
    elementUsage?: number;
    positionVarName?: string;
    normalVarName?: string;
}): {
    drawMode: DrawMode;
    elementUsage: number;
    positionVarName: string;
    normalVarName: string;
};
export = adapterOptions;
