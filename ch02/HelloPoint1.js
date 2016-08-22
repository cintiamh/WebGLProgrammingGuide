// vertex shader program
var VSHADER_SOURCE = 'void main() {\n' +
  'gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
  'gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = 'void main() {\n' +
  'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  var canvas = document.getElementById('webgl');
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  // If we don't have a GL context, give up now
  if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      return;
  }
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
}
