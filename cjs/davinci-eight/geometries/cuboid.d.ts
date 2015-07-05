/// <reference path="../../../src/davinci-eight/geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/CuboidGeometry.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
declare var cuboid: (spec?: {
    position?: {
        name?: string;
    };
    color?: {
        name?: string;
        value?: number[];
    };
    normal?: {
        name?: string;
    };
}) => CuboidGeometry;
export = cuboid;
