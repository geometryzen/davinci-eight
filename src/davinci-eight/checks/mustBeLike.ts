import mustHaveOwnProperty = require('../checks/mustHaveOwnProperty');

function mustBeLike<T>(name: string, value: T, duck: T, contextBuilder?: () => string): T {
  var props: string[] = Object.keys(duck)
  console.log("props => " + JSON.stringify(props))
  for (var i = 0, iLength = props.length; i < iLength; i++) {
    mustHaveOwnProperty(name, value, props[i], contextBuilder)
  }
  return value;
}

export = mustBeLike;
