interface BoxOptions {
  width?: number;
  height?: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  wireFrame?: boolean;
  positionVarName?: string;
  normalVarName?: string;
}

export = BoxOptions;