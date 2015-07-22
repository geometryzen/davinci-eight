
function checkMeshArgs(
  options: {
    wireFrame?: boolean
  }) {

  options = options || {};

  let wireFrame = typeof options.wireFrame === 'undefined' ? false : options.wireFrame;

  return {
    wireFrame: wireFrame
  };
}

export = checkMeshArgs;
