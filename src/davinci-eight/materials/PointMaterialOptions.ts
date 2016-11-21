import MaterialOptions from './MaterialOptions';

interface PointMaterialOptions extends MaterialOptions {
  attributes?: { [name: string]: number };
  uniforms?: { [name: string]: string };
}

export default PointMaterialOptions;
