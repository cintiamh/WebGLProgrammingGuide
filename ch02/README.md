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
