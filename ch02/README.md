# Your First Step with WebGL

WebGL uses the `<canvas>` HTML element to display.

## What is a Canvas?

Canvas offers a convenient way to draw computer graphics dynamically using JavaScript.

The `<canvas>` tag defines a drawing area on a web page, where you can use JavaScript to draw on it.
You can draw points, lines, rectangles, circles, and so on using JavaScript.

DrawRectangle.html
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Draw a blue rectangle</title>
    </head>
    <body onload="main()">
        <canvas id="example" width="400" height="400">
            Please use a browser that supports "canvas".
        </canvas>
        <script src="drawrectangle.js"></script>
    </body>
</html>
```

DrawRectangle.js
```javascript
function main() {
    // retrieve the canvas element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the canvas element');
        return;
    }
    // Get the rendering context for 2D CG
    var ctx = canvas.getContext('2d');
    // Draw a blue rectangle
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
    ctx.fillRect(120, 10, 150, 150);
}
```

The coordinate system of the canvas element has the horizontal direction as the x-axis (right-direction is positive)
and the vertical direction as the y-axis (down-direction is positive).

The origin is located at the upper-left corner and the down direction of the y-axis is positive.

```
(0,0) +-------------------> x
      |
      |
      |
      |
      |
      |
      |
      v
      y
```

## Very simple WebGL program

HelloCanvas.js - getting WebGL context
```javascript
function initWebGL(canvas) {
    var gl;
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    return gl;
}
```

HelloCanvas.js - Rendering just a black canvas (clear)
```javascript
function start() {
    var canvas = document.getElementById("glcanvas");
    // Initialize the GL context
    var gl = initWebGL(canvas);
    // Only continue if WebGL is available and working
    if (!gl) {
        return;
    }
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
```

The getContext method for WebGL can have different arguments depending on the browser.
Possible arguments are: "webgl", "experimental-webgl", "webkit-3d", "moz-webgl";

Because WebGL is based on OpenGL, color values range from 0.0 to 1.0.

Once you specify the color, the color is retained in the WebGL system and not changed
until another color is specified by a call to gl.clearColor(). This means you don't
need to specify the clear color again if at some point in the future you want to
clear the are again using the same color.

## Draw a Point (Version 1)

For now, just for simplicity, accept that a point drawn at (0.0, 0.0, 0.0) is displayed
at the center of the `<canvas>` area.

We'll be using a filled rectangle as a point instead of a filled circle because a rectangle
can be drawn faster than a circle.

WebGL relies on a drawing mechanism called a shader, which offers a flexible and
powerful mechanism for drawing 2D and 3D objects and must be used by all WebGL applications.

HelloPoint1.js
```javascript
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
```

WebGL needs two types of shaders:

**Vertex shader**: Vertex shaders are programs that describe the traits (position,
  size, colors, and so on) of a vertex. The vertex is a point in 2D/3D space, such as the
  corner or intersection of a 2D/3D shape.

**Fragment shader**: A program that deals with per-fragment processing such as lighting.
The fragment is a WebGL term that you can consider as a kind of pixel (picture element).

The shaders are read from the JavaScript and stored in the WebGL system ready to be used
for drawing.

The shader programs must be written in the OpenGL ES shading language (GLSL ES),
which is similar to the C language.

## Initializing Shaders

```
Retrieve the <canvas> element => Get the rendering context for WebGL => Initialize shaders => Set the color for clearing <canvas> => Clear <canvas> => Draw
```

WebGL applications consists of a JavaScript program executed by the browser and shader programs that are executed within the
WebGL system.

* The vertex shader specifies the position of a point and its size. In this sample program, the position is (0.0, 0.0, 0.0)
and the size is 10.0.
* The fragment shader specifies the color of the fragments displaying the point. In this simple program, they are red
(1.0, 0.0, 0.0, 1.0).

### Vertex Shader


`gl_Position` and `gl_PointSize` are two built in variables for vertex shader. `gl_Position` is required and `gl_PointSize`
default value is 1.0.

| Type and variable | Description |
|-------------------|-------------|
| `vec4 gl_Position` | Specifies the position of a vertex |
| `float gl_PointSize` | Specifies the size of a point (in pixels) |

Note that because GLSL ES is typed, if the type is float, it needs to be `10.0`, for example, and not `10`. Because `10`
will be interpreted as integer number, not float.

Note that the value that is assigned to `gl_Position` has `1.0` added as a fourth component. This four-component coordinate
is called homogeneous coordinate and is often used in 3D graphics for processing three-dimensional information efficiently.

### Fragment Shader

A fragment is a pixel displayed on the screen.

The fragment shader is a program that processes this informationin preparation for displaying the fragment on the screen.

The job of the shader is to set the color of the point as its per-fragment operation. `gl_FragColor` is a built-in variable
only available in fragment shader, it controls the color of a fragment.

| Type and variable | Description |
|-------------------|-------------|
| `vec4 gl_FragColor` | Specifies the color of a fragment |

### The Draw Operation

`gl.drawArrays` is a powerful function that is capable of drawing a variety of basic shapes.

**`gl.drawArrays(mode, first, count)`**

Execute a vertex shader to draw shapes specified by the `mode` parameter

| Parameter | Description |
|-----------|-------------|
| `mode`    | Specifies the type of shape to be drawn. The following symbolic constants are accepted: `gl.POINTS`, `gl.LINES`, `gl.LINE_STRIP`, `gl.LINE_LOOP`, `gl.TRIANGLES`, `gl.TRIANGLE_STRIP`, and `gl.TRIANGLE_FAN`. |
| `first`   | Specifies which vertex to start drawing from (integer) |
| `count`   | Specifies the number of vertices to be used (integer) |

## The WebGL Coordinate System

* x-axis: horizontal direction, right direction positive.
* y-axis: vertical direction, up direction is positive.
* z-axis: the direction from the screen to the viewer (positive).

And the viewer eye is located at the origin (0.0, 0.0, 0.0).

**right-handed coordinate system**

### Default values

* The center position of `<canvas>`: (0.0, 0.0, 0.0)
* The two edges of the x-axis of the `<canvas>`: (-1.0, 0.0, 0.0) and (1.0, 0.0, 0.0)
* The two edges of the y-axis of the `<canvas>`: (0.0, -1.0, 0.0) and (0.0, 1.0, 0.0)

## Draw a Point (Version 2)