/**
 * @class ShaderVariableDecl
 */
interface ShaderVariableDecl {
  /**
   * @property modifiers
   */
  modifiers: string[];
  /**
   * @property type
   */
  type: string;
  /**
   * @property name
   */
  name: string;
}

export = ShaderVariableDecl;