import {pi, r2d, d2r, sin, cos, sqrt, vec3, mat4, camera} from "./mth.js"
import { prim } from "../res/prim.js"
import { mtl } from "../res/mtl.js"
export let globalGL
export let globalCamera
export let timeHolder
export let inputHolder
import { timer } from "./timer.js"
import { control } from "./control.js"

/*
function wheelResponse(e) {
}

function moveResponse(e) {

}

export function glForCube() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");

  globalGL.clearColor(0.12, 0.18, 0.44, 1);
  globalGL.clear(globalGL.COLOR_BUFFER_BIT);
  
  const start = Date.now();
  const vs = loadShaderAsync("vert.vert");
  const fs = loadShaderAsync("frag.frag");

  Promise.all([vs, fs]).then((res) => {
    const vstext = res[0];
    const fstext = res[1];

    const vertexSh = loadShader(gl, globalGL.VERTEX_SHADER, vstext);
    const fragmentSh = loadShader(gl, globalGL.FRAGMENT_SHADER, fstext);

    const program = globalGL.createProgram();
    globalGL.attachShader(program, vertexSh);
    globalGL.attachShader(program, fragmentSh);
    globalGL.linkProgram(program);

    const positionLoc = globalGL.getAttribLocation(program, 'in_pos');
    const normalLoc = globalGL.getAttribLocation(program, 'in_normal');

    const modelViewLoc = globalGL.getUniformLocation(program, 'modelView');

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

    const cubeVertexArray = globalGL.createVertexArray();
    globalGL.bindVertexArray(cubeVertexArray);

    const positionBuffer = globalGL.createBuffer();
    globalGL.bindBuffer(globalGL.ARRAY_BUFFER, positionBuffer);
    globalGL.bufferData(globalGL.ARRAY_BUFFER, cubeVertexPositions, globalGL.STATIC_DRAW);
    globalGL.enableVertexAttribArray(positionLoc);
    globalGL.enableVertexAttribArray(normalLoc)
    globalGL.vertexAttribPointer(
        positionLoc,  // location
        3,            // size (components per iteration)
        globalGL.FLOAT,     // type of to get from buffer
        false,        // normalize
        24,            // stride (bytes to advance each iteration)
        0,            // offset (bytes from start of buffer)
    );
    globalGL.vertexAttribPointer(
      normalLoc,  // location
      3,            // size (components per iteration)
      globalGL.FLOAT,     // type of to get from buffer
      true,        // normalize
      24,            // stride (bytes to advance each iteration)
      12,            // offset (bytes from start of buffer)
  );


    const indexBuffer = globalGL.createBuffer();
    globalGL.bindBuffer(globalGL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    globalGL.bufferData(globalGL.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, globalGL.STATIC_DRAW);
    globalGL.bindVertexArray(null);

    const render = () => {
      globalGL.clearColor(0.12, 0.18, 0.44, 1);
      globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER_BIT);

      globalGL.enable(globalGL.DEPTH_TEST);
      //globalGL.enable(globalGL.CULL_FACE);

      globalGL.bindVertexArray(cubeVertexArray);

      globalGL.useProgram(program);
      const timeFromStart = Date.now() - start;

      let modelView = new mat4()
      modelView.scale(0.5).matrRotate(timeFromStart / 500.0, new vec3(0, 1, 0)).matrRotate(timeFromStart / 200.0, new vec3(1, 0, 0))

      globalGL.uniformMatrix4fv(modelViewLoc, false, new Float32Array(modelView.toArray()));

      globalGL.drawElements(
        globalGL.TRIANGLES,
        36,                // num vertices to process
        globalGL.UNSIGNED_SHORT, // type of indices
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

  globalGL.clearColor(0.12, 0.18, 0.44, 1);
  globalGL.clear(globalGL.COLOR_BUFFER_BIT);
  
  const start = Date.now();
  const vs = loadShaderAsync("vert.vert");
  const fs = loadShaderAsync("frag.frag");

  Promise.all([vs, fs]).then((res) => {
    const vstext = res[0];
    const fstext = res[1];

    const vertexSh = loadShader(gl, globalGL.VERTEX_SHADER, vstext);
    const fragmentSh = loadShader(gl, globalGL.FRAGMENT_SHADER, fstext);

    const program = globalGL.createProgram();
    globalGL.attachShader(program, vertexSh);
    globalGL.attachShader(program, fragmentSh);
    globalGL.linkProgram(program);

    const positionLoc = globalGL.getAttribLocation(program, 'in_pos');
    const normalLoc = globalGL.getAttribLocation(program, 'in_normal');

    const modelViewLoc = globalGL.getUniformLocation(program, 'modelView');

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

    const tetrVertexArray = globalGL.createVertexArray();
    globalGL.bindVertexArray(tetrVertexArray);

    const positionBuffer = globalGL.createBuffer();
    globalGL.bindBuffer(globalGL.ARRAY_BUFFER, positionBuffer);
    globalGL.bufferData(globalGL.ARRAY_BUFFER, tetrVertexPositions, globalGL.STATIC_DRAW);
    globalGL.enableVertexAttribArray(positionLoc);
    globalGL.enableVertexAttribArray(normalLoc)
    globalGL.vertexAttribPointer(
        positionLoc,  // location
        3,            // size (components per iteration)
        globalGL.FLOAT,     // type of to get from buffer
        false,        // normalize
        24,            // stride (bytes to advance each iteration)
        0,            // offset (bytes from start of buffer)
    );
    globalGL.vertexAttribPointer(
      normalLoc,  // location
      3,            // size (components per iteration)
      globalGL.FLOAT,     // type of to get from buffer
      true,        // normalize
      24,            // stride (bytes to advance each iteration)
      12,            // offset (bytes from start of buffer)
    );


    const indexBuffer = globalGL.createBuffer();
    globalGL.bindBuffer(globalGL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    globalGL.bufferData(globalGL.ELEMENT_ARRAY_BUFFER, tetrVertexIndices, globalGL.STATIC_DRAW);
    globalGL.bindVertexArray(null);

    const render = () => {
      globalGL.clearColor(0.12, 0.18, 0.44, 1);
      globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER_BIT);

      globalGL.enable(globalGL.DEPTH_TEST);
      //globalGL.enable(globalGL.CULL_FACE);

      const timeFromStart = Date.now() - start;

      let modelView = mat4()
      modelView.scale(0.5).matrRotate(timeFromStart / 500.0, new vec3(0, 1, 0)).matrRotate(timeFromStart / 200.0, new vec3(1, 0, 0))

      globalGL.uniformMatrix4fv(modelViewLoc, false, new Float32Array(modelView.toArray()));

      globalGL.drawElements(
        globalGL.TRIANGLES,
        36,                // num vertices to process
        globalGL.UNSIGNED_SHORT, // type of indices
        0,                 // offset on bytes to indices
      );

      window.requestAnimationFrame(render);
    };
    render();
  })
} */

export function initGL() {
  const canvas = document.getElementById("glCanvas");
  globalGL = canvas.getContext("webgl2");

  globalGL.clearColor(0.55, 0.14, 0.214, 1);
  globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER);

  globalGL.enable(globalGL.DEPTH_TEST)

  globalCamera = camera()
  
  globalCamera.setSize(500, 500)
  globalCamera.set(vec3(1, 1, 1), vec3(0, 0, 0), vec3(0, 1, 0))

  const vertexPositions = new Float32Array([0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
                                            0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
                                            1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                                            1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,

                                            1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0,
                                            1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                                            1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0,
                                            1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
                                            
                                            1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            
                                            0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            
                                            0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            
                                            0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            ]);

  const vertexIndices = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
  14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,]);

  // tetrahedron init
  /*
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
  */

  let mat = mtl("default", vec3(0.329412,0.223529,0.027451), vec3(0.780392,0.568627,0.113725), vec3(0.992157,0.941176,0.807843), 27.8974, 1, ["../bin/textures/cgsg.png", "../bin/textures/cgsg.png"], 1)
  let pr = prim(globalGL.TRIANGLES, vertexPositions, vertexIndices, mat)

  // timer initialization
  timeHolder = timer()

  // input initialization
  inputHolder = control()

  // keyboard input support
  window.addEventListener("keydown", (e) => {
    if (e.key == "p") timeHolder.isPause = timeHolder.isPause ? false : true
    if (e.key == "PageUp") inputHolder.pgUp = true
    if (e.key == "PageDown") inputHolder.pgDown = true
    if (e.key == "ArrowRight") inputHolder.arrowRight = true
    if (e.key == "ArrowLeft") inputHolder.arrowLeft = true
    if (e.key == "ArrowUp") inputHolder.arrowUp = true
    if (e.key == "ArrowDown") inputHolder.arrowDown = true
    if (e.key == "Shift") inputHolder.shift = true
    if (e.key == "Control") inputHolder.control = true
  })

  window.addEventListener("keyup", (e) => {
    if (e.key == "PageUp") inputHolder.pgUp = false
    if (e.key == "PageDown") inputHolder.pgDown = false
    if (e.key == "ArrowRight") inputHolder.arrowRight = false
    if (e.key == "ArrowLeft") inputHolder.arrowLeft = false
    if (e.key == "ArrowUp") inputHolder.arrowUp = false
    if (e.key == "ArrowDown") inputHolder.arrowDown = false
    if (e.key == "Shift") inputHolder.shift = false
    if (e.key == "Control") inputHolder.control = false
  })

  window.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
      inputHolder.lButton = true
      inputHolder.mouseX = e.offsetX
      inputHolder.mouseY = e.offsetY
    }
    if (e.button == 2) {
      inputHolder.rButton = true
      inputHolder.mouseX = e.offsetX
      inputHolder.mouseY = e.offsetY
    }
  })

  window.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
      inputHolder.lButton = false
    }
    if (e.button == 2) {
      inputHolder.rButton = false
    }
  })

  window.addEventListener("mousemove", (e) => {
    if (inputHolder.lButton) {
      inputHolder.lMouseDeltaX = e.offsetX - inputHolder.mouseX
      inputHolder.lMouseDeltaY = e.offsetY - inputHolder.mouseY
      inputHolder.mouseX = e.offsetX
      inputHolder.mouseY = e.offsetY
    }
    if (inputHolder.rButton) {
      inputHolder.rMouseDeltaX = e.offsetX - inputHolder.mouseX
      inputHolder.rMouseDeltaY = e.offsetY - inputHolder.mouseY
      inputHolder.mouseX = e.offsetX
      inputHolder.mouseY = e.offsetY
    }
  })
  
  globalGL.canvas.addEventListener("contextmenu", (e) => { e.preventDefault() })

  const render = () => {
    globalGL.clearColor(0.55, 0.14, 0.214, 1);
    globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER);

    timeHolder.timeUpdate()

    // navigation
    let
      dist = globalCamera.at.sub(globalCamera.loc).len(),
      cosT = (globalCamera.loc.y - globalCamera.at.y) / dist,
      sinT = sqrt(1 - cosT * cosT),
      plen = dist * sinT,
      cosP = (globalCamera.loc.z - globalCamera.at.z) / plen,
      sinP = (globalCamera.loc.x - globalCamera.at.x) / plen,
      azimuth = r2d(Math.atan2(sinP, cosP)),
      elevator = r2d(Math.atan2(sinT, cosT));

      azimuth += timeHolder.betFramesTime * 3 * (inputHolder.arrowLeft - inputHolder.arrowRight);

      elevator += timeHolder.betFramesTime * 2 * (inputHolder.arrowUp - inputHolder.arrowDown);

    if (elevator < 0.08)
      elevator = 0.08;
    else if (elevator > 178.90)
      elevator = 178.90;

    dist += timeHolder.betFramesTime / 1000.0 * (1 + inputHolder.shift * 27) *
      (47 * (inputHolder.pgDown - inputHolder.pgUp));
    if (dist < 0.1)
      dist = 0.1;

    if (inputHolder.rButton) {
      let wp, hp, sx, sy;
      let dv = vec3();

      wp = hp = globalCamera.projSize;

      sx = -inputHolder.rMouseDeltaX * wp / 500 * dist / globalCamera.projDist;
      sy = -inputHolder.rMouseDeltaY * hp / 500 * dist / globalCamera.projDist;

      dv = globalCamera.right.mul(sx).add(globalCamera.up.mul(sy));
      globalCamera.at = globalCamera.at.add(dv);
      globalCamera.loc = globalCamera.loc.add(dv);
    }

    globalCamera.set(mat4().rotate(elevator, vec3(1, 0, 0)).mul(mat4().rotate(azimuth, vec3(0, 1, 0))).mul(mat4().translate(globalCamera.at)).transform(vec3(0, dist, 0)),
                     globalCamera.at,
                     vec3(0, 1, 0));

    // drawing
    let world = new mat4()
    world = world.scale(0.5).mul(world.rotate(timeHolder.timeFromStart / 100.0, new vec3(0, 1, 0))).mul(world.rotate(timeHolder.timeFromStart / 200.0, new vec3(1, 0, 0)))

    pr.draw(world)
    
    window.requestAnimationFrame(render);
  }
  render();
}
