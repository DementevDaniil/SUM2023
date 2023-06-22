import { io } from "socket.io-client";

import { pi, r2d, d2r, sin, cos, sqrt, vec3, mat4, camera } from "./mth.js";
import { prim } from "./res/prim.js";
import { mtl } from "./res/mtl.js";

export let globalGL;
export let globalCamera;

export let timeHolder;
export let inputHolder;
import { timer } from "./timer.js";
import { control } from "./control.js";

// main
function loadShader(type, source) {
  const shader = globalGL.createShader(type);

  globalGL.shaderSource(shader, source);
  globalGL.compileShader(shader);

  if (!globalGL.getShaderParameter(shader, globalGL.COMPILE_STATUS)) {
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
  } catch (err) {
    console.log(err);
  }
}

export function initGL() {
  const canvas = document.getElementById("glCanvas");
  globalGL = canvas.getContext("webgl2");

  globalGL.clearColor(0.55, 0.14, 0.214, 1);
  globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER);

  globalGL.clear(globalGL.DEPTH_BUFFER_BIT);

  globalGL.enable(globalGL.DEPTH_TEST);

  globalCamera = camera();

  globalCamera.setSize(500, 500);
  globalCamera.set(vec3(1, 1, 1), vec3(0, 0, 0), vec3(0, 1, 0));

  // timer initialization
  timeHolder = timer();

  // input initialization
  inputHolder = control();

  // keyboard input support
  window.addEventListener("keydown", (e) => {
    if (e.key == "p") timeHolder.isPause = timeHolder.isPause ? false : true;
    if (e.key == "PageUp") inputHolder.pgUp = true;
    if (e.key == "PageDown") inputHolder.pgDown = true;
    if (e.key == "ArrowRight") inputHolder.arrowRight = true;
    if (e.key == "ArrowLeft") inputHolder.arrowLeft = true;
    if (e.key == "ArrowUp") inputHolder.arrowUp = true;
    if (e.key == "ArrowDown") inputHolder.arrowDown = true;
    if (e.key == "Shift") inputHolder.shift = true;
    if (e.key == "Control") inputHolder.control = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key == "PageUp") inputHolder.pgUp = false;
    if (e.key == "PageDown") inputHolder.pgDown = false;
    if (e.key == "ArrowRight") inputHolder.arrowRight = false;
    if (e.key == "ArrowLeft") inputHolder.arrowLeft = false;
    if (e.key == "ArrowUp") inputHolder.arrowUp = false;
    if (e.key == "ArrowDown") inputHolder.arrowDown = false;
    if (e.key == "Shift") inputHolder.shift = false;
    if (e.key == "Control") inputHolder.control = false;
  });

  window.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
      inputHolder.lButton = true;
      inputHolder.mouseX = e.offsetX;
      inputHolder.mouseY = e.offsetY;
    }
    if (e.button == 2) {
      inputHolder.rButton = true;
      inputHolder.mouseX = e.offsetX;
      inputHolder.mouseY = e.offsetY;
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
      inputHolder.lButton = false;
    }
    if (e.button == 2) {
      inputHolder.rButton = false;
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (inputHolder.lButton) {
      inputHolder.lMouseDeltaX = e.offsetX - inputHolder.mouseX;
      inputHolder.lMouseDeltaY = e.offsetY - inputHolder.mouseY;
      inputHolder.mouseX = e.offsetX;
      inputHolder.mouseY = e.offsetY;
    }
    if (inputHolder.rButton) {
      inputHolder.rMouseDeltaX = e.offsetX - inputHolder.mouseX;
      inputHolder.rMouseDeltaY = e.offsetY - inputHolder.mouseY;
      inputHolder.mouseX = e.offsetX;
      inputHolder.mouseY = e.offsetY;
    }
  });

  globalGL.canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}

function createPlayer(n, program) {
  const vertexPositions = new Float32Array([
    0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1,
    1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,

    1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
    1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,

    1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,

    0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,

    0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,

    0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1,
    0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0,
  ]);

  const vertexIndices = new Uint16Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
    15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
  ]);

  let move = 5 * Math.pow(-1, n);
  for (let i = 0; i < vertexPositions.length; i += 12) {
    vertexPositions[i] += move;
  }

  let mat = mtl(
    program,
    vec3(0.329412, 0.223529, 0.027451),
    vec3(0.780392, 0.568627, 0.113725),
    vec3(0.992157, 0.941176, 0.807843),
    27.8974,
    1,
    ["../bin/textures/cgsg.png"],
    1
  );
  let pr = prim(globalGL.TRIANGLES, vertexPositions, vertexIndices, mat);
  return pr;
}

function redraw(pr) {
  // drawing
  let world = new mat4();
  world = world
    .scale(0.5)
    .mul(world.rotate(timeHolder.timeFromStart / 100.0, new vec3(0, 1, 0)))
    .mul(world.rotate(timeHolder.timeFromStart / 200.0, new vec3(1, 0, 0)));

  pr.draw(world);
}

async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    console.log(socket.id);
    socket.on("MessageFromServer", function (msg) {
      console.log(msg);
      let textarea = document.getElementById("textarea");
      textarea.value += `${msg}\n\n`;
      textarea.scrollTop = textarea.scrollHeight;
    });
    socket.on("initGame", (n) => {
      initGL();

      const vs = loadShaderAsync("../bin/shaders/default/vert.glsl");
      const fs = loadShaderAsync("../bin/shaders/default/frag.glsl");

      Promise.all([vs, fs]).then((res) => {
        const vstext = res[0];
        const fstext = res[1];

        const vertexSh = loadShader(globalGL.VERTEX_SHADER, vstext);
        const fragmentSh = loadShader(globalGL.FRAGMENT_SHADER, fstext);

        const program = globalGL.createProgram();

        globalGL.attachShader(program, vertexSh);
        globalGL.attachShader(program, fragmentSh);
        globalGL.linkProgram(program);

        if (!globalGL.getProgramParameter(program, globalGL.LINK_STATUS)) {
          let buf = globalGL.getProgramInfoLog(program);
          alert(buf);
        }

        let myPrim = createPlayer(n, program);
        let data = JSON.stringify(myPrim);
        socket.emit("endOfInit", data);
        socket.on("startRender", (data) => {
          let info = JSON.parse(data);
          let mat = mtl(
            program,
            vec3(0.329412, 0.223529, 0.027451),
            vec3(0.780392, 0.568627, 0.113725),
            vec3(0.992157, 0.941176, 0.807843),
            27.8974,
            1,
            ["../bin/textures/cgsg.png"],
            1
          );
          let otherPrim = prim(
            info.type,
            new Float32Array(Object.values(info.vertexData)),
            new Float32Array(Object.values(info.indexData)),
            mat
          );
          const render = () => {
            globalGL.clearColor(0.55, 0.14, 0.214, 1);
            globalGL.clear(globalGL.COLOR_BUFFER_BIT | globalGL.DEPTH_BUFFER);

            globalGL.clear(globalGL.DEPTH_BUFFER_BIT);

            timeHolder.timeUpdate();

            // navigation
            let dist = globalCamera.at.sub(globalCamera.loc).len(),
              cosT = (globalCamera.loc.y - globalCamera.at.y) / dist,
              sinT = sqrt(1 - cosT * cosT),
              plen = dist * sinT,
              cosP = (globalCamera.loc.z - globalCamera.at.z) / plen,
              sinP = (globalCamera.loc.x - globalCamera.at.x) / plen,
              azimuth = r2d(Math.atan2(sinP, cosP)),
              elevator = r2d(Math.atan2(sinT, cosT));

            azimuth +=
              timeHolder.betFramesTime *
              3 *
              (inputHolder.arrowLeft - inputHolder.arrowRight);

            elevator +=
              timeHolder.betFramesTime *
              2 *
              (inputHolder.arrowUp - inputHolder.arrowDown);

            if (elevator < 0.08) elevator = 0.08;
            else if (elevator > 178.9) elevator = 178.9;

            dist +=
              (timeHolder.betFramesTime / 1000.0) *
              (1 + inputHolder.shift * 27) *
              (47 * (inputHolder.pgDown - inputHolder.pgUp));
            if (dist < 0.1) dist = 0.1;

            if (inputHolder.rButton) {
              let wp, hp, sx, sy;
              let dv = vec3();

              wp = hp = globalCamera.projSize;

              sx =
                (((-inputHolder.rMouseDeltaX * wp) / 500) * dist) /
                globalCamera.projDist;
              sy =
                (((-inputHolder.rMouseDeltaY * hp) / 500) * dist) /
                globalCamera.projDist;

              dv = globalCamera.right.mul(sx).add(globalCamera.up.mul(sy));
              globalCamera.at = globalCamera.at.add(dv);
              globalCamera.loc = globalCamera.loc.add(dv);
            }
            globalCamera.set(
              mat4()
                .rotate(elevator, vec3(1, 0, 0))
                .mul(mat4().rotate(azimuth, vec3(0, 1, 0)))
                .mul(mat4().translate(globalCamera.at))
                .transform(vec3(0, dist, 0)),
              globalCamera.at,
              vec3(0, 1, 0)
            );

            redraw(myPrim);
            redraw(otherPrim);
            window.requestAnimationFrame(render);
          };
          render();
        });
      });
    });
  });

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
