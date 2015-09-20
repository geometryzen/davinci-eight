import AttribMetaInfo = require('../core/AttribMetaInfo');
import mustBeBoolean = require('../checks/mustBeBoolean');
import mustBeDefined = require('../checks/mustBeDefined');
import UniformMetaInfo = require('../core/UniformMetaInfo');

/**
 *
 */
function fragmentShader(attributes: { [name: string]: AttribMetaInfo }, uniforms: { [name: string]: UniformMetaInfo }, vColor: boolean, vLight: boolean) {

  mustBeDefined('attributes', attributes);
  mustBeDefined('uniforms', uniforms);
  mustBeBoolean('vColor', vColor);
  mustBeBoolean('vLight', vLight);

  var lines: string[] = [];
  if (vColor) {
    lines.push("varying highp vec4 vColor;");
  }
  if (vLight) {
    lines.push("varying highp vec3 vLight;");
  }
  lines.push("void main(void) {");
  let glFragColor: string[] = [];
  if (vLight) {
    if (vColor) {
      lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
    }
    else {
      lines.push("  gl_FragColor = vec4(vLight, 1.0);");
    }
  }
  else {
    if (vColor) {
      lines.push("  gl_FragColor = vColor;");
    }
    else {
      lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
    }
  }
  lines.push("}");
  var code = lines.join("\n");
  return code;
}

export = fragmentShader;
