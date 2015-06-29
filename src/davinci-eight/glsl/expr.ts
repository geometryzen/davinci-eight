//
// See javascript.crockford.com/tdop/tdop.html
//
/// <reference path='./Symbol.d.ts'/>
/// <reference path='./Token.d.ts'/>

var state;
/**
 * The current token.
 */
var token: Token;
var tokens: Token[];
var idx: number;

function fail(message) {
  return function() { return state.unexpected(message) }
}

/**
 * The prototype for all other symbols. Its method will usually be overridden.
 */
let original_symbol = {
  nud: function() {
    return this.children && this.children.length ? this : fail('unexpected')()
  },
  led: fail('missing operator')
}

let symbol_table: {[id:string]:Symbol} = {};

let itself: NullDenotation = function() {
  return this
}

/**
 * A function that makes symbols and looks them up in a cache.
 */
function symbol(id: string, binding_power?: number) {
  var sym: Symbol = symbol_table[id];
  binding_power = binding_power || 0
  if(sym) {
    if(binding_power > sym.lbp) {
      sym.lbp = binding_power
    }
  }
  else {
    sym = Object.create(original_symbol)
    sym.id = id 
    sym.lbp = binding_power
    symbol_table[id] = sym
  }
  return sym
}

function infix(id: string, bp: number, led?: LeftDenotation): void {
  var sym: Symbol = symbol(id, bp)
  sym.led = led || function(left) {
    this.children = [left, expression(bp)]
    this.type = 'binary'
    return this
  }
}

function infixr(id: string, bp: number, led?: LeftDenotation): Symbol {
  var sym = symbol(id, bp)
  sym.led = led || function(left) {
    this.children = [left, expression(bp - 1)]
    this.type = 'binary'
    return this
  }
  return sym
}

function prefix(id: string, nud?: NullDenotation): Symbol {
  var sym = symbol(id)
  sym.nud = nud || function() {
    this.children = [expression(70)]
    this.type = 'unary'
    return this
  }
  return sym
}

function suffix(id: string): void {
  var sym = symbol(id, 150)
  sym.led = function(left) {
    this.children = [left]
    this.type = 'suffix'
    return this
  }
}

function assignment(id: string): Symbol {
  return infixr(id, 10, function(left) {
    this.children = [left, expression(9)]
    this.assignment = true
    this.type = 'assign'
    return this
  })
}

symbol('(ident)').nud = itself
symbol('(keyword)').nud = itself
symbol('(builtin)').nud = itself
symbol('(literal)').nud = itself
symbol('(end)')

symbol(':')
symbol(';')
symbol(',')
symbol(')')
symbol(']')
symbol('}')

infixr('&&', 30)
infixr('||', 30)
infix('|', 43)
infix('^', 44)
infix('&', 45)
infix('==', 46)
infix('!=', 46)
infix('<', 47)
infix('<=', 47)
infix('>', 47)
infix('>=', 47)
infix('>>', 48)
infix('<<', 48)
infix('+', 50)
infix('-', 50)
infix('*', 60)
infix('/', 60)
infix('%', 60)
infix('?', 20, function(left: Symbol) {
  this.children = [left, expression(0), (advance(':'), expression(0))]
  this.type = 'ternary'
  return this
})
infix('.', 80, function(left) {
  token.type = 'literal'
  state.fake(token)
  this.children = [left, token]
  advance()
  return this
})
infix('[', 80, function(left) {
  this.children = [left, expression(0)]
  this.type = 'binary'
  advance(']')
  return this
})
infix('(', 80, function(left) {
  this.children = [left]
  this.type = 'call'

  if(token.data !== ')') {
    while(1) {
      this.children.push(expression(0));
      if(token.data !== ',') {
        break;
      }
      advance(',');
    }
  }
  advance(')')
  return this
})

prefix('-')
prefix('+')
prefix('!')
prefix('~')
prefix('defined')
prefix('(', function() {
  this.type = 'group'
  this.children = [expression(0)]
  advance(')')
  return this 
})
prefix('++')
prefix('--')
suffix('++')
suffix('--')

assignment('=')
assignment('+=')
assignment('-=')
assignment('*=')
assignment('/=')
assignment('%=')
assignment('&=')
assignment('|=')
assignment('^=')
assignment('>>=')
assignment('<<=')

function expr(incoming_state, incoming_tokens?: Token[]): void {

  function emit(node) {
    state.unshift(node, false)
    for(var i = 0, len = node.children.length; i < len; ++i) {
      emit(node.children[i])
    }
    state.shift()
  }

  state = incoming_state
  tokens = incoming_tokens
  idx = 0
  var result

  if(!tokens.length) {
    return
  }

  advance()
  result = expression(0)
  result.parent = state[0]
  emit(result)

  if(idx < tokens.length) {
    throw new Error('did not use all tokens')
  }

  result.parent.children = [result]
}

/**
 * The heart of top-down precedence parsing.
 * @param rbp Right Binding Power.
 */
function expression(rbp: number): Symbol {
  var left: Symbol;
  var t: Token = token

  advance()

  left = t.nud()
  while(rbp < token.lbp) {
    t = token
    advance()
    left = t.led(left)
  }
  return left
}

/**
 * Make a new token from the next simple object in the array and assign to the token variable
 */
function advance(id?): Symbol {
  var next;
  var value;
  var type;
  var output: Symbol;

  if(id && token.data !== id) {
    return state.unexpected('expected `'+ id + '`, got `'+token.data+'`')
  }

  if(idx >= tokens.length) {
    token = symbol_table['(end)']
    return
  }

  next = tokens[idx++]
  value = next.data
  type = next.type

  if(type === 'ident') {
    output = state.scope.find(value) || state.create_node()
    type = output.type
  }
  else if(type === 'builtin') {
    output = symbol_table['(builtin)']
  }
  else if(type === 'keyword') {
    output = symbol_table['(keyword)']
  }
  else if(type === 'operator') {
    output = symbol_table[value]
    if(!output) {
      return state.unexpected('unknown operator `'+value+'`')
    }
  }
  else if(type === 'float' || type === 'integer') {
    type = 'literal'
    output = symbol_table['(literal)']
  }
  else {
    return state.unexpected('unexpected token.')
  }

  if(output) {
    if(!output.nud) { output.nud = itself }
    if(!output.children) { output.children = [] }
  }

  // FIXME: This should be assigning to token?
  output = Object.create(output)
  output.token = next
  output.type = type
  if(!output.data) {
    output.data = value
  }

  // I don't think the assignment is required.
  // It also may be effing up the type safety.
  return token = output
}

export = expr;