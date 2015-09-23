import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
declare let createMaterial: (monitors: ContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]) => IMaterial;
export = createMaterial;
