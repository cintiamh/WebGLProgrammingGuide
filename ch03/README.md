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

`gl.createBuffer()`
`gl.deleteBuffer(buffer)`

After creating a buffer object, you have to bind it to a "target". The target tells WebGL what type of
data the buffer object contains.

`gl.bindBuffer(target, buffer)`

Target can be:
* `gl.ARRAY_BUFFER`: Vertex data.
* `gl.ELEMENT_ARRAY_BUFFER`: index values pointing to vertex data.

`gl.bufferData(target, data, usage)`

Allocates storage and write the data specified by data to the buffer object bound to target.

`usage`: Specifies a hint about how the program is going to use the data stored in the buffer object. Used for
optimization.

* `gl.STATIC_DRAW`: The buffer object data will be specified once and used many times to draw shapes.
* `gl.STREAM_DRAW`: The buffer object data will be specified once and used a few times do draw shapes.
* `gl.DYNAMIC_DRAW`: The buffer object data will be specified repeatedly and used many times to draw shapes.

### Typed Arrays

WebGL often deals with large quantities of data of the same type, such as vertex coordinates and colors. For
optimization, typed arrays had been introduced for each data type.

| Typed Array | # of Bytes / element | Description (C types) |
|-------------|----------------------|-----------------------|
| `Int8Array` | 1 | 8-bit signed integer (signed char) |
| `Uint8Array` | 1 | 8-bit unsigned integer (unsigned char) |
| `Int16Array` | 2 | 16-bit signed integer (signed short) |
| `Uint16Array` | 2 | 16-bit unsigned integer (unsigned short) |
| `Int32Array` | 4 | 32-bit signed integer (signed int) |
| `Uint32Array` | 4 | 32-bit unsigned integer (unsigned int) |
| `Float32Array` | 4 | 32-bit floating point number (float) |
| `Float64Array` | 8 | 64-bit floating point number (double) |

Unlike the standard `Array` object in JavaScript, the methods `push()` and `pop()` are not supported.

| Methods, Properties, Constants | Description |
|--------------------------------|-------------|
| `get(index)` | Get the index-th element |
| `set(index, value)` | Set value to the index-th element |
| `set(array, offset)` | Set the elements of array from offset-th element |
| `length` | The length of the array |
| `BYTES_PER_ELEMENT` | The number of bytes per element in the array |

#### Assign the buffer object to an Attribute Variable

You can use `gl.vertexAttrib[1234]f()` to assign a single data value to an attribute variable.

With `gl.vertexAttribPointer()` we can assign a buffer object to an attribute variable.

`gl.vertexAttribPointer(location, size, type, normalized, stride, offset)`

Assign the buffer object bound to `gl.ARRAY_BUFFER` to the attribute variable specified by location.

* `location`: Specifies the storage location of an attribute variable.
* `size`: Specifies the number of components per vertex in the buffer object (1 to 4).
* `type`: Specifies the data format using one of the following:
    * `gl.UNSIGNED_BYTE` for `Uint8Array`.
    * `gl.SHORT` for `Int16Array`.
    * `gl.UNSIGNED_SHORT` for `Uint16Array`
    * `gl.INT` for `Int32Array`
    * `gl.UNSIGNED_INT` for `Uint32Array`
    * `gl.FLOAT` for `Float32Array`
* `normalized`: Either `true` or `false` to indicate whether nonfloating data should be normalized to [0, 1]
or [-1, 1]
* `stride`: Specifies the number of bytes between different vertex data elements, or zero for default stride.
* `offset`: Specifies the offset in bytes in a buffer object to indicate what number-th byte the vertex data
is stored from. If the data is stored from the beginning, offset is 0.

`gl.enableVertexAttribArray(location)`

`gl.disableVertexAttribArray(location)`

Enable the assignment fo a buffer object to the attribute variable specified by location.

You can't use `gl.vertexAttrib[1234]f()` and object buffer simultaneously.

#### The second and third parameters of gl.drawArrays()

`gl.drawArrays(mode, first, count)`

Execute a vertex shader to draw shapes specified by the mode parameter.

* `mode`: Specifies the type of shape to be drawn.
    * `gl.POINTS`, `gl.LINES`, `gl.LINE_STRIP`, `gl.LINE_LOOP`, `gl.TRIANGLES`, `gl.TRIANGLE_STRIP`,
    `gl.TRIANGLE_FAN`
* `first`: Specifies what number-th vertex is used to draw from (integer)
* `count`: Specifies the number of vertices to be used (integer)

## Hello triangle

```javascript
// MultiPoint.js (c) 2012 matsuda
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
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
    gl.drawArrays(gl.TRIANGLES, 0, n);
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

Differences from MultiPoint are:

* The line with `gl_PointSize = 10.0;` is not needed anymore because we're not drawing a point.
* The first parameter for `gl.drawArrays()` now is `gl.TRIANGLES`, not `gl.POINTS`.

### Basic Shapes

| Basic Shape | Mode | Description |
|-------------|------|-------------|
| Points | `gl.POINTS` | A series of points. |
| Line segments | `gl.LINES` | A series of unconnected line segments. If the number of vertices is odd, the last one is ignored. |
| Line strips | `gl.LINE_STRIP` | A series of connected line segments. |
| Line loops | `gl.LINE_LOOP` | A series of connected line segments. In addition to the lines drawn by `gl.LINE_STRIP`, the line between the last vertex and the first vertex is drawn. |
| Triangles | `gl.TRIANGLES` | A series of separate triangles. |
| Triangle strips | `gl.TRIANGLE_STRIP` | A series of connected triangles in strip fashion. |
| Triangle fans | `gl.TRIANGLE_FAN` | A series of connected triangles sharing the first vertex in fan-like fashion. |

### Hello Rectangle (HelloQuad)

WebGL cannot draw a rectangle directly, so you need to divide the rectangle into two triangles.

You need to add an extra vertex coordinate and you need to pay attention to the order of vertices.

```javascript
// extra point added, the order is important
var vertices = new Float32Array([
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
]);
var n = 4; // The number of vertices
  
gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
```

## Moving, rotating, and scaling

Transformations: move, rotate, and scale.

### Translation

To move the shape, you just need to add a translation distance for each direction to each component of the coordinates.
 
```
x' = x + Tx
y' = y + Ty
z' = z + Tz
```

They clearly aren't a per-fragment operation, so you don't need to worry about the fragment shader.

```javascript
// MultiPoint.js (c) 2012 matsuda
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
    'uniform vec4 u_Translation;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position + u_Translation;\n' +
  '}\n';
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';
 var Tx = 0.5, Ty = 0.5, Tz = 0.0;

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
  var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
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

### Rotation

Information needed for rotation:

* Rotation axis - the axis the shape will be rotated around.
* Rotation direction - clockwise or counterclockwise.
* Rotation angle - the number of degrees the shape will be rotated through.

In rotation, if the angle is positive, the rotation is performed in a counterclockwise direction around the rotation axis
looking at the shape toward the negative direction of the z-axis, this is called positive rotation. (right hand rule rotation).

```
r - distance from the origin to the point p
alpha - rotation angule from the x-axis to the point

x = r cos alpha
y = r sin alpha
```

### Sample program (RotatedTriangle.js)

```javascript
var VSHADER_SOURCE =
  // x' = x cos b - y sin b
  // y' = x sin b + y cos b
  // z' = z
  'attribute vec4 a_Position;\n' +
  'uniform float u_CosB, u_SinB;\n' +
  'void main() {\n' +
  '  gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
  '  gl_Position.y = a_Position.x * u_SinB - a_Position.y * u_CosB;\n' +
  '  gl_Position.z = a_Position.z;\n' +
  '  gl_Position.w = 1.0;\n' +
  '}\n';
  
  // Pass the data required to rotate the shape to the vertex shader
    // Convert to radians
    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);
```

### Transformation Matrix: Rotation

The transformation matrix is excellent for manipulating computer graphics.
    
```
| x' |   | cos beta  -sin beta  0 |   | x |
| y' | = | sin beta  cos beta   0 | x | y |
| z' |   |    0          0      1 |   | z |
```

This matrix is called a transformation matrix because it "transforms" the right-side vector(x, y, z) to the left-side
vector (x', y', z'). The transformation matrix representing a rotation is called a rotation matrix.

### Transformation Matrix: Translation
