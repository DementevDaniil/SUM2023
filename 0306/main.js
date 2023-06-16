import {pi, sin, cos, vec3, mat4, camera} from "./mth.js"
import { prim } from "./res/prim.js"

function wheelResponse(e) {
}

function moveResponse(e) {

}

export function glForCube() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");

  gl.clearColor(0.12, 0.18, 0.44, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  const start = Date.now();
  const vs = loadShaderAsync("vert.vert");
  const fs = loadShaderAsync("frag.frag");

  Promise.all([vs, fs]).then((res) => {
    const vstext = res[0];
    const fstext = res[1];

    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vstext);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fstext);

    const program = gl.createProgram();
    gl.attachShader(program, vertexSh);
    gl.attachShader(program, fragmentSh);
    gl.linkProgram(program);

    const positionLoc = gl.getAttribLocation(program, 'in_pos');
    const normalLoc = gl.getAttribLocation(program, 'in_normal');

    const modelViewLoc = gl.getUniformLocation(program, 'modelView');

    const cubeVertexPositions = new Float32Array([0, 0, 1, 1, 0, 0, 
                                                  0, 1, 1, 1, 0, 0,
                                                  1, 1, 1, 1, 0, 0, 
                                                  1, 0, 1, 1, 0, 0,
                                                  1, 0, 1, -1, 0, 0, 
                                                  1, 1, 1, -1, 0, 0, 
                                                  1, 1, 0, -1, 0, 0, 
                                                  1, 0, 0, -1, 0, 0, 
                                                  1, 0, 0, 0, 1, 0, 
                                                  0, 0, 0, 0, 1, 0, 
                                                  0, 1, 0, 0, 1, 0, 
                                                  1, 1, 0, 0, 1, 0, 
                                                  0, 0, 0, 0, -1, 0, 
                                                  0, 0, 1, 0, -1, 0, 
                                                  0, 1, 1, 0, -1, 0, 
                                                  0, 1, 0, 0, -1, 0, 
                                                  0, 1, 1, 0, 0, 1, 
                                                  0, 1, 0, 0, 0, 1, 
                                                  1, 1, 0, 0, 0, 1,
                                                  1, 1, 1, 0, 0, 1, 
                                                  0, 0, 1, 0, 0, -1,
                                                  0, 0, 0, 0, 0, -1, 
                                                  1, 0, 0, 0, 0, -1, 
                                                  1, 0, 1, 0, 0, -1,
                                                  ]);
    
    const cubeVertexIndices = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,]);

    const cubeVertexArray = gl.createVertexArray();
    gl.bindVertexArray(cubeVertexArray);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertexPositions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.enableVertexAttribArray(normalLoc)
    gl.vertexAttribPointer(
        positionLoc,  // location
        3,            // size (components per iteration)
        gl.FLOAT,     // type of to get from buffer
        false,        // normalize
        24,            // stride (bytes to advance each iteration)
        0,            // offset (bytes from start of buffer)
    );
    gl.vertexAttribPointer(
      normalLoc,  // location
      3,            // size (components per iteration)
      gl.FLOAT,     // type of to get from buffer
      true,        // normalize
      24,            // stride (bytes to advance each iteration)
      12,            // offset (bytes from start of buffer)
  );


    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);

    const render = () => {
      gl.clearColor(0.12, 0.18, 0.44, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.DEPTH_TEST);
      //gl.enable(gl.CULL_FACE);

      gl.bindVertexArray(cubeVertexArray);

      gl.useProgram(program);
      const timeFromStart = Date.now() - start;

      let modelView = new mat4()
      modelView.scale(0.5).matrRotate(timeFromStart / 500.0, new vec3(0, 1, 0)).matrRotate(timeFromStart / 200.0, new vec3(1, 0, 0))

      gl.uniformMatrix4fv(modelViewLoc, false, new Float32Array(modelView.toArray()));

      gl.drawElements(
        gl.TRIANGLES,
        36,                // num vertices to process
        gl.UNSIGNED_SHORT, // type of indices
        0,                 // offset on bytes to indices
      );
      window.requestAnimationFrame(render);
    };
    render();
  })
}

export function glForTetrahedron() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");

  gl.clearColor(0.12, 0.18, 0.44, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  const start = Date.now();
  const vs = loadShaderAsync("vert.vert");
  const fs = loadShaderAsync("frag.frag");

  Promise.all([vs, fs]).then((res) => {
    const vstext = res[0];
    const fstext = res[1];

    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vstext);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fstext);

    const program = gl.createProgram();
    gl.attachShader(program, vertexSh);
    gl.attachShader(program, fragmentSh);
    gl.linkProgram(program);

    const positionLoc = gl.getAttribLocation(program, 'in_pos');
    const normalLoc = gl.getAttribLocation(program, 'in_normal');

    const modelViewLoc = gl.getUniformLocation(program, 'modelView');

    let tetrFacets = [
      [new vec3(1, 1, 0), new vec3(1, 0, 1), new vec3(0, 0, 0)],
      [new vec3(0, 1, 1), new vec3(1, 1, 0), new vec3(0, 0, 0)],
      [new vec3(0, 1, 1), new vec3(1, 1, 0), new vec3(1, 0, 1)],
      [new vec3(0, 1, 1), new vec3(0, 0, 0), new vec3(1, 0, 1)]
    ]
    let a00 = new vec3(tetrFacets[0][0])
    let a01 = new vec3(tetrFacets[0][1])
    let a02 = new vec3(tetrFacets[0][2])
    let a10 = new vec3(tetrFacets[1][0])
    let a11 = new vec3(tetrFacets[1][1])
    let a12 = new vec3(tetrFacets[1][2])
    let a20 = new vec3(tetrFacets[2][0])
    let a21 = new vec3(tetrFacets[2][1])
    let a22 = new vec3(tetrFacets[2][2])
    let a30 = new vec3(tetrFacets[3][0])
    let a31 = new vec3(tetrFacets[3][1])
    let a32 = new vec3(tetrFacets[3][2])
    let tetrNorms = [
      (a01.sub(a00)).cross(a02.sub(a00)),
      (a11.sub(a10)).cross(a12.sub(a10)),
      (a21.sub(a20)).cross(a22.sub(a20)),
      (a31.sub(a30)).cross(a32.sub(a30)),
    ]
    let tetrVertexPositions = new Float32Array(tetrFacets[0][0].toArray().concat(tetrNorms[0].toArray()).concat(
                                               (tetrFacets[0][1].toArray().concat(tetrNorms[0].toArray()))).concat(
                                               (tetrFacets[0][2].toArray().concat(tetrNorms[0].toArray()))).concat(
                                               (tetrFacets[1][0].toArray().concat(tetrNorms[1].toArray()))).concat(
                                               (tetrFacets[1][1].toArray().concat(tetrNorms[1].toArray()))).concat(
                                               (tetrFacets[1][2].toArray().concat(tetrNorms[1].toArray()))).concat(
                                               (tetrFacets[2][0].toArray().concat(tetrNorms[2].toArray()))).concat(
                                               (tetrFacets[2][1].toArray().concat(tetrNorms[2].toArray()))).concat(
                                               (tetrFacets[2][2].toArray().concat(tetrNorms[2].toArray()))).concat(
                                               (tetrFacets[3][0].toArray().concat(tetrNorms[3].toArray()))).concat(
                                               (tetrFacets[3][1].toArray().concat(tetrNorms[3].toArray()))).concat(
                                               (tetrFacets[3][2].toArray().concat(tetrNorms[3].toArray())))
                                               );
    
    const tetrVertexIndices = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    const tetrVertexArray = gl.createVertexArray();
    gl.bindVertexArray(tetrVertexArray);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, tetrVertexPositions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.enableVertexAttribArray(normalLoc)
    gl.vertexAttribPointer(
        positionLoc,  // location
        3,            // size (components per iteration)
        gl.FLOAT,     // type of to get from buffer
        false,        // normalize
        24,            // stride (bytes to advance each iteration)
        0,            // offset (bytes from start of buffer)
    );
    gl.vertexAttribPointer(
      normalLoc,  // location
      3,            // size (components per iteration)
      gl.FLOAT,     // type of to get from buffer
      true,        // normalize
      24,            // stride (bytes to advance each iteration)
      12,            // offset (bytes from start of buffer)
    );


    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, tetrVertexIndices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);

    const render = () => {
      gl.clearColor(0.12, 0.18, 0.44, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.DEPTH_TEST);
      //gl.enable(gl.CULL_FACE);

      const timeFromStart = Date.now() - start;

      let modelView = new mat4()
      modelView.scale(0.5).matrRotate(timeFromStart / 500.0, new vec3(0, 1, 0)).matrRotate(timeFromStart / 200.0, new vec3(1, 0, 0))

      gl.uniformMatrix4fv(modelViewLoc, false, new Float32Array(modelView.toArray()));

      gl.drawElements(
        gl.TRIANGLES,
        36,                // num vertices to process
        gl.UNSIGNED_SHORT, // type of indices
        0,                 // offset on bytes to indices
      );

      window.requestAnimationFrame(render);
    };
    render();
  })
}

export function initGL() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");

  gl.clearColor(0.55, 0.14, 0.214, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST)

  const start = Date.now();

  const vertexPositions = new Float32Array([0, 0, 1, 1, 0, 0, 
                                            0, 1, 1, 1, 0, 0,
                                            1, 1, 1, 1, 0, 0, 
                                            1, 0, 1, 1, 0, 0,
                                            1, 0, 1, -1, 0, 0, 
                                            1, 1, 1, -1, 0, 0, 
                                            1, 1, 0, -1, 0, 0, 
                                            1, 0, 0, -1, 0, 0, 
                                            1, 0, 0, 0, 1, 0, 
                                            0, 0, 0, 0, 1, 0, 
                                            0, 1, 0, 0, 1, 0, 
                                            1, 1, 0, 0, 1, 0, 
                                            0, 0, 0, 0, -1, 0, 
                                            0, 0, 1, 0, -1, 0, 
                                            0, 1, 1, 0, -1, 0, 
                                            0, 1, 0, 0, -1, 0, 
                                            0, 1, 1, 0, 0, 1, 
                                            0, 1, 0, 0, 0, 1, 
                                            1, 1, 0, 0, 0, 1,
                                            1, 1, 1, 0, 0, 1, 
                                            0, 0, 1, 0, 0, -1,
                                            0, 0, 0, 0, 0, -1, 
                                            1, 0, 0, 0, 0, -1, 
                                            1, 0, 1, 0, 0, -1,
                                            ]);

  const vertexIndices = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
  14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,]);

  // tetrahedron init
  let tetrFacets = [
    [new vec3(1, 1, 0), new vec3(1, 0, 1), new vec3(0, 0, 0)],
    [new vec3(0, 1, 1), new vec3(1, 1, 0), new vec3(0, 0, 0)],
    [new vec3(0, 1, 1), new vec3(1, 1, 0), new vec3(1, 0, 1)],
    [new vec3(0, 1, 1), new vec3(0, 0, 0), new vec3(1, 0, 1)]
  ]
  let a00 = new vec3(tetrFacets[0][0])
  let a01 = new vec3(tetrFacets[0][1])
  let a02 = new vec3(tetrFacets[0][2])
  let a10 = new vec3(tetrFacets[1][0])
  let a11 = new vec3(tetrFacets[1][1])
  let a12 = new vec3(tetrFacets[1][2])
  let a20 = new vec3(tetrFacets[2][0])
  let a21 = new vec3(tetrFacets[2][1])
  let a22 = new vec3(tetrFacets[2][2])
  let a30 = new vec3(tetrFacets[3][0])
  let a31 = new vec3(tetrFacets[3][1])
  let a32 = new vec3(tetrFacets[3][2])
  let tetrNorms = [
    (a01.sub(a00)).cross(a02.sub(a00)),
    (a11.sub(a10)).cross(a12.sub(a10)),
    (a21.sub(a20)).cross(a22.sub(a20)),
    (a31.sub(a30)).cross(a32.sub(a30)),
  ]
  let tetrVertexPositions = new Float32Array(tetrFacets[0][0].toArray().concat(tetrNorms[0].toArray()).concat(
                                             (tetrFacets[0][1].toArray().concat(tetrNorms[0].toArray()))).concat(
                                             (tetrFacets[0][2].toArray().concat(tetrNorms[0].toArray()))).concat(
                                             (tetrFacets[1][0].toArray().concat(tetrNorms[1].toArray()))).concat(
                                             (tetrFacets[1][1].toArray().concat(tetrNorms[1].toArray()))).concat(
                                             (tetrFacets[1][2].toArray().concat(tetrNorms[1].toArray()))).concat(
                                             (tetrFacets[2][0].toArray().concat(tetrNorms[2].toArray()))).concat(
                                             (tetrFacets[2][1].toArray().concat(tetrNorms[2].toArray()))).concat(
                                             (tetrFacets[2][2].toArray().concat(tetrNorms[2].toArray()))).concat(
                                             (tetrFacets[3][0].toArray().concat(tetrNorms[3].toArray()))).concat(
                                             (tetrFacets[3][1].toArray().concat(tetrNorms[3].toArray()))).concat(
                                             (tetrFacets[3][2].toArray().concat(tetrNorms[3].toArray())))
                                             );
  
  const tetrVertexIndices = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

  let globalCamera = new camera()
  
  globalCamera.setSize(500, 500)
  globalCamera.set(new vec3(1, 1, 1), new vec3(0, 0, 0), new vec3(0, 1, 0))

  let pr = new prim(gl, gl.TRIANGLES, tetrVertexPositions, tetrVertexIndices, "default", "")

  
  // const posLoc = gl.getAttribLocation(program, "in_pos");

  // const posBuf = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  // const pos = [1, 1, 0, 1, -1, 0, -1, -1, 0, -1, 1, 0, 1, 1, 0];
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  // gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(posLoc);
  // gl.useProgram(program);
  // const timeFromStart = Date.now() - start;
  // const loc = gl.getUniformLocation(program, "time");
  // gl.uniform1f(loc, timeFromStart / 1000.0);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
  new prim().loadObj("cow.obj").then((res) => {
        const render = () => {
            let cow = new prim(res)
            gl.clearColor(0.55, 0.14, 0.214, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            if (pr.program != null) {
                const timeFromStart = Date.now() - start;
                const loc = gl.getUniformLocation(pr.program, "time");
                
                let world = new mat4()
                world.scale(0.5).matrRotate(timeFromStart / 500.0, new vec3(0, 1, 0)).matrRotate(timeFromStart / 200.0, new vec3(1, 0, 0))
                
                pr.draw(globalCamera, world)
                cow.draw(globalCamera, world)
            }
            window.requestAnimationFrame(render);
        }
        render();
    })
}
