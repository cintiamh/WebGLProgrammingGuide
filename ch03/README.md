# Drawing and transforming triangles

## Drawing multiple points

3D models are actually made of multiple triangles. To make a smooth complex shape, you just need to use more
triangles than a simple shape.

We'll start by learning how to manipulate a 2D triangle, but the principle is the same for more complex models,
it just needs more triangles.

Before we used `gl.drawArrays` to draw single points, but if we want to draw shapes that uses multiple
vertices, you need to use a **buffer object**.

A **buffer object** is a memory area that can store multiple vertices in WebGL system. It is used both as
a staging area for the vertex data and a way to simultaneously pass the vertices to a vertex shader.

### Sample program: MultiPoint.js

```javascript
// MultiPoint.js (c) 2012 matsuda
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n';
var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    // Define 3 vertices:
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}
```

In `initVertexBuffers` method you set a buffer values with the points positions.

Because you are using a buffer object to pass multiple vertices to a vertex shader in `initVertexBuffers`,
you need to specify the number of vertices in the object as the third parameter of `gl.drawArrays` so that
WebGL then knows to draw a shape using all the vertices in the buffer object.

### Using buffer objects

A buffer object is a mechanism provided by WebGL system that provides a memory area allocated in the system
that holds the vertices you want to draw. By creating a buffer object and then writing the vertices to the
object, you can pass multiple vertices to a vertex shader through one of its attribute variables.

There are five steps needed to pass multiple data values to a vertex shader through a buffer object.

1. Create a buffer object: `gl.createBuffer()`
2. Bind the buffer object to a target: `gl.bindBuffer()`
3. Write data into the buffer object: `gl.bufferData()`
4. Assign the buffer object to an attribute variable: `gl.vertexAttribPointer()`
5. Enable assignment: `gl.enableVertexAttribArray()`


## Hello triangle

## Moving, rotating, and scaling

