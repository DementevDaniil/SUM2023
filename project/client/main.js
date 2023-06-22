import { io } from "socket.io-client";
import { merge } from "lodash"

import {pi, r2d, d2r, sin, cos, sqrt, vec3, mat4, camera} from "./mth.js"
import { prim } from "./res/prim.js"
import { mtl } from "./res/mtl.js"
export let globalGL
export let globalCamera
export let timeHolder
export let inputHolder
import { timer } from "./timer.js"
import { control } from "./control.js"
import { player } from "./player.js"

export function doGL() {
  const canvas = document.getElementById("glCanvas");
  globalGL = canvas.getContext("webgl2");

  globalGL.clearColor(0.55, 0.14, 0.214, 1);
  globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER);

  globalGL.clear(globalGL.DEPTH_BUFFER_BIT);
  globalGL.enable(globalGL.DEPTH_TEST)

  globalCamera = camera()
  
  globalCamera.setSize(500, 500)
  globalCamera.set(vec3(1, 1, 1), vec3(0, 0, 0), vec3(0, 1, 0))

  const vertexPositions = new Float32Array([10, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
                                            10, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
                                            11, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                                            11, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,

                                            11, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0,
                                            11, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                                            11, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0,
                                            11, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
                                            
                                            11, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            10, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            10, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            11, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            
                                            10, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            10, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            10, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            10, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            
                                            10, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            10, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            11, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            11, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            
                                            10, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            10, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            11, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            11, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
  ]);

  const vertexPositions1 = new Float32Array([-10, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
                                            -10, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
                                            -9, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                                            -9, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,
                                            
                                            -9, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0,
                                            -9, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                                            -9, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0,
                                            -9, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
                                            
                                            -9, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            -10, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            -10, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            -9, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                            
                                            -10, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            -10, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            -10, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            -10, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                            
                                            -10, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            -10, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            -9, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            -9, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            
                                            -10, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            -10, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            -9, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                            -9, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
  ]);

  const vertexIndices = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
  14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,]);

  const fieldVertexPositions = new Float32Array([
    0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1,
    0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1,
  ])
  const fieldVertexIndices = new Float32Array([0, 1, 2, 2, 3, 0])

  let cubeMat = mtl("default", vec3(0.10588,0.058824,0.113725), vec3(0.427451,0.470588,0.541176), vec3(0.3333,0.3333,0.521569), 9.84615, 1, ["../bin/textures/cgsg.png", "../bin/textures/cgsg.png"], 1)
  let cube = prim(globalGL.TRIANGLES, vertexPositions, vertexIndices, cubeMat)

  // let gridMat = mtl("default", vec3(0.10588,0.058824,0.113725), vec3(0.427451,0.470588,0.541176), vec3(0.3333,0.3333,0.521569), 9.84615, 1, [], 1)
  // let grid = prim(globalGL.TRIANGLES, fieldVertexPositions, fieldVertexIndices, gridMat)
  
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

    globalGL.clear(globalGL.DEPTH_BUFFER_BIT);

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

    cube.draw(world)
    
    //grid.draw(mat4().scale(0.8))

    window.requestAnimationFrame(render);
  }
  render();
}

const playerVertexData0 = new Float32Array([5, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
                                           5, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
                                           6, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                                           6, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,
                                         
                                           6, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0,
                                           6, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                                           6, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0,
                                           6, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
                                           
                                           6, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
                                           5, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                           5, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1,
                                           6, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                                           
                                           5, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                           5, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0,
                                           5, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0,
                                           5, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0,
                                           
                                           5, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                           5, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
                                           6, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0,
                                           6, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                                           
                                           5, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                           5, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
                                           6, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0,
                                           6, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
]);

const playerVertexData1 = new Float32Array([-6, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
                                           -6, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
                                           -5, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                                           -5, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,
                                           
                                           -5, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0,
                                           -5, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                                           -5, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0,
                                           -5, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
                                           
                                           -5, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                           -6, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
                                           -6, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                                           -5, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1,
                                           
                                           -6, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                           -6, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0,
                                           -6, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0,
                                           -6, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0,
                                           
                                           -6, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                           -6, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
                                           -5, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0,
                                           -5, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                                           
                                           -6, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                           -6, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
                                           -5, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0,
                                           -5, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
]);

const playerVertexData = new Float32Array([0.5, 0.5, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
                                          0.5, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
                                          1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                                          1, 0.5, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,

                                          1, 0.5, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0,
                                          1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                                          1, 1, 0.5, 1, 0, 1, 0, 0, 1, 1, 0, 0,
                                          1, 0.5, 0.5, 0, 0, 1, 0, 0, 1, 1, 0, 0,

                                          1, 0.5, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                          0.5, 0.5, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                          0.5, 1, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                                          1, 1, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 1,

                                          0.5, 0.5, 0.5, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                          0.5, 0.5, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                          0.5, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                                          0.5, 1, 0.5, 0, 0, 1, 0, 0, 0, 1, 0, 0,

                                          0.5, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                          0.5, 1, 0.5, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                          1, 1, 0.5, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                          1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,

                                          0.5, 0.5, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                          0.5, 0.5, 0.5, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                          1, 0.5, 0.5, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                                          1, 0.5, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
  ]);

const playerIndexData = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
                                       14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,]);

function loadShader(type, source) {
  const shader = globalGL.createShader(type);
                                      
  globalGL.shaderSource(shader, source);
  globalGL.compileShader(shader);
                                      
  if (!globalGL.getShaderParameter(shader, globalGL.COMPILE_STATUS)){
    let buf = globalGL.getShaderInfoLog(shader);
    console.log(buf);
  }
  return shader;
}
                                    
async function loadShaderAsync(shaderName) {
  try {
    const response = await fetch(shaderName);
      const text = await response.text();
      return text;
    } catch(err) {
      console.log(err);
    }
}

                                    
function initGL() {
  const canvas = document.getElementById("glCanvas");
  globalGL = canvas.getContext("webgl2");
  
  globalGL.clearColor(0.55, 0.14, 0.214, 1);
  globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER);

  globalGL.clear(globalGL.DEPTH_BUFFER_BIT);
  globalGL.enable(globalGL.DEPTH_TEST)

  globalCamera = camera()
  
  globalCamera.setSize(500, 500)
  globalCamera.set(vec3(10, 10, 10), vec3(0, 0, 0), vec3(0, 1, 0))
}

let footlers = []
let myFootler

function drawMe() {
  /*
  window.addEventListener("keydown", (e) => {
    if (e.key == "p") myFootler.timeHolder.isPause = myFootler.timeHolder.isPause ? false : true
    if (e.key == "PageUp") myFootler.inputHolder.pgUp = true
    if (e.key == "PageDown") myFootler.inputHolder.pgDown = true
    if (e.key == "ArrowRight") myFootler.inputHolder.arrowRight = true
    if (e.key == "ArrowLeft") myFootler.inputHolder.arrowLeft = true
    if (e.key == "ArrowUp") myFootler.inputHolder.arrowUp = true
    if (e.key == "ArrowDown") myFootler.inputHolder.arrowDown = true
    if (e.key == "Shift") myFootler.inputHolder.shift = true
    if (e.key == "Control") {
      for (let i = 0; i < myFootler.prim.vertexData.length; i += 12) {
        myFootler.prim.vertexData[i] += 1
      }
    }
  })

  window.addEventListener("keyup", (e) => {
    if (e.key == "PageUp") myFootler.inputHolder.pgUp = false
    if (e.key == "PageDown") myFootler.inputHolder.pgDown = false
    if (e.key == "ArrowRight") myFootler.inputHolder.arrowRight = false
    if (e.key == "ArrowLeft") myFootler.inputHolder.arrowLeft = false
    if (e.key == "ArrowUp") myFootler.inputHolder.arrowUp = false
    if (e.key == "ArrowDown") myFootler.inputHolder.arrowDown = false
    if (e.key == "Shift") myFootler.inputHolder.shift = false
    if (e.key == "Control") myFootler.inputHolder.control = false
  })

  window.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
      myFootler.inputHolder.lButton = true
      myFootler.inputHolder.mouseX = e.offsetX
      myFootler.inputHolder.mouseY = e.offsetY
    }
    if (e.button == 2) {
      myFootler.inputHolder.rButton = true
      myFootler.inputHolder.mouseX = e.offsetX
      myFootler.inputHolder.mouseY = e.offsetY
    }
  })

  window.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
      myFootler.inputHolder.lButton = false
    }
    if (e.button == 2) {
      myFootler.inputHolder.rButton = false
    }
  })

  window.addEventListener("mousemove", (e) => {
    if (myFootler.inputHolder.lButton) {
      myFootler.inputHolder.lMouseDeltaX = e.offsetX - myFootler.inputHolder.mouseX
      myFootler.inputHolder.lMouseDeltaY = e.offsetY - myFootler.inputHolder.mouseY
      myFootler.inputHolder.mouseX = e.offsetX
      myFootler.inputHolder.mouseY = e.offsetY
    }
    if (myFootler.inputHolder.rButton) {
      myFootler.inputHolder.rMouseDeltaX = e.offsetX - myFootler.inputHolder.mouseX
      myFootler.inputHolder.rMouseDeltaY = e.offsetY - myFootler.inputHolder.mouseY
      myFootler.inputHolder.mouseX = e.offsetX
      myFootler.inputHolder.mouseY = e.offsetY
    }
  })

  globalGL.canvas.addEventListener("contextmenu", (e) => { e.preventDefault() })

  myFootler.timeHolder.timeUpdate()

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

    azimuth += myFootler.timeHolder.betFramesTime * 3 * (myFootler.inputHolder.arrowLeft - myFootler.inputHolder.arrowRight);

    elevator += myFootler.timeHolder.betFramesTime * 2 * (myFootler.inputHolder.arrowUp - myFootler.inputHolder.arrowDown);

  if (elevator < 0.08)
    elevator = 0.08;
  else if (elevator > 178.90)
    elevator = 178.90;

  dist += myFootler.timeHolder.betFramesTime / 1000.0 * (1 + myFootler.inputHolder.shift * 27) *
    (47 * (myFootler.inputHolder.pgDown - myFootler.inputHolder.pgUp));
  if (dist < 0.1)
    dist = 0.1;

  if (myFootler.inputHolder.rButton) {
    let wp, hp, sx, sy;
    let dv = vec3();

    wp = hp = globalCamera.projSize;

    sx = -myFootler.inputHolder.rMouseDeltaX * wp / 500 * dist / globalCamera.projDist;
    sy = -myFootler.inputHolder.rMouseDeltaY * hp / 500 * dist / globalCamera.projDist;

    dv = globalCamera.right.mul(sx).add(globalCamera.up.mul(sy));
    globalCamera.at = globalCamera.at.add(dv);
    globalCamera.loc = globalCamera.loc.add(dv);
  }

  globalCamera.set(mat4().rotate(elevator, vec3(1, 0, 0)).mul(mat4().rotate(azimuth, vec3(0, 1, 0))).mul(mat4().translate(globalCamera.at)).transform(vec3(0, dist, 0)),
                   globalCamera.at,
                   vec3(0, 1, 0));
                   */

  // drawing
  let world = mat4()
  myFootler.prim.draw(globalCamera, world)
}

function drawOther(footler) {
  footler.prim.draw(globalCamera, mat4())
  /*
  console.log("Other:")
  console.log(footler)
  console.log("---------/------------/-----------")*/
}

async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("initGame", (num) => {
    // initialization
    initGL()
    const vs = loadShaderAsync("./bin/shaders/default/vert.glsl");
    const fs = loadShaderAsync("./bin/shaders/default/frag.glsl");

    Promise.all([vs, fs]).then((res) => {
      const vstext = res[0];
      const fstext = res[1];
        
      const vertexSh = loadShader(globalGL.VERTEX_SHADER, vstext);
      const fragmentSh = loadShader(globalGL.FRAGMENT_SHADER, fstext);

      const program = globalGL.createProgram();

      globalGL.attachShader(program, vertexSh);
      globalGL.attachShader(program, fragmentSh);
      globalGL.linkProgram(program);

      let playerMat0 = mtl(program, vec3(), vec3(1), vec3(1), 8.0, 1, ["../bin/textures/cgsg.png"])
      let playerPrim0 = prim(globalGL.TRIANGLES, playerVertexData0, playerIndexData, playerMat0)
      let world = mat4()
      myFootler = player(playerPrim0, world)
      document.getElementById("textarea").value = num + 1
      // globalCamera.set(myFootler.camera.loc, myFootler.camera.at, myFootler.camera.up)

      const data = JSON.stringify(myFootler)
      socket.emit("betweenStage", data)
      socket.on("startDraw", (data) => {
        data = JSON.parse(data)
        let mat = data.prim.mtl
        let playerMtl = mtl(program, vec3(mat.ka.x, mat.ka.y, mat.ka.z), vec3(mat.kd.x, mat.kd.y, mat.kd.z), vec3(mat.ks.x, mat.ks.y, mat.ks.z),
                                          mat.ph, mat.trans, mat.texNames, mat.isShade)
        let playerPrim = prim(data.prim.type, new Float32Array(Object.values(data.prim.vertexData)), new Float32Array(Object.values(data.prim.indexData)), playerMtl)
        data.prim.trans = mat4(data.prim.trans.r0[0], data.prim.trans.r0[1], data.prim.trans.r0[2], data.prim.trans.r0[3],
                               data.prim.trans.r1[0], data.prim.trans.r1[1], data.prim.trans.r1[2], data.prim.trans.r1[3],
                               data.prim.trans.r2[0], data.prim.trans.r2[1], data.prim.trans.r2[2], data.prim.trans.r2[3],
                               data.prim.trans.r3[0], data.prim.trans.r3[1], data.prim.trans.r3[2], data.prim.trans.r3[3])
        footlers.push(player(playerPrim, data.prim.trans))

        const render = () => {
          globalGL.clearColor(0.55, 0.14, 0.214, 1);
          globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER);
      
          globalGL.clear(globalGL.DEPTH_BUFFER_BIT);

          /*
          console.log("Me:")
          console.log(myFootler)
          console.log("---------/------------/-----------")*/
          for (let pl of footlers) drawOther(pl)
          drawMe()
          window.requestAnimationFrame(render);
        }
        render();
      })
    })
    
  })
    /*
    const render = () => {
      globalGL.clearColor(0.55, 0.14, 0.214, 1);
      globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER);
  
      globalGL.clear(globalGL.DEPTH_BUFFER_BIT);
      
      window.requestAnimationFrame(render);
    }
    render();
    // socket.emit("betweenStage", footler)
  })
  */

  socket.on("numberError", (n) => {
    if (n == 1) initGL()
  })
  socket.on("disconnect", () => {
    console.log(socket.id);
  });

  document.getElementById("input").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      socket.username = document.getElementById("name").value;
      const value = document.getElementById("input").value;
      console.log(value);
      document.getElementById("input").value = "text";
      let textarea = document.getElementById("textarea");
      textarea.value += `${socket.username}: ${value}\n\n`;
      textarea.scrollTop = textarea.scrollHeight;
      socket.emit("MessageToServer", value, socket.username);
    }
  };
}

window.addEventListener("load", (event) => {
  main();
});
