import Token from './Token'
import tokenize from './tokenize'

export default function(str: string): Token[] {
  const generator = tokenize()
  let tokens: Token[] = []

  tokens = tokens.concat(generator(str))
  tokens = tokens.concat(generator(null))

  return tokens
}
