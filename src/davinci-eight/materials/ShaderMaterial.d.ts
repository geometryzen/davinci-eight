/// <reference path="./Material.d.ts" />
interface ShaderMaterial extends Material {
  vertexShader: string;
  fragmentShader: string;
}
