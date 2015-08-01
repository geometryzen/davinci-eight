import DataUsage = require('../core/DataUsage');
import DrawMode = require('../core/DrawMode');
declare function adapterOptions(options?: {
    wireFrame?: boolean;
    elementUsage?: DataUsage;
    positionVarName?: string;
    normalVarName?: string;
}): {
    drawMode: DrawMode;
    elementUsage: DataUsage;
    positionVarName: string;
    normalVarName: string;
};
export = adapterOptions;
