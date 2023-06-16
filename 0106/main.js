function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      let buf = gl.getShaderInfoLog(shader);
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
    const gl = canvas.getContext("webgl2");

    let isMouseDown = false
    let dx = 0
    let dy = 0
    let curx = 250
    let cury = 250
    let scale = 1
    let x = 0
    let y = 0
    let mx = 0
    let my = 0

    canvas.addEventListener("mousedown", (e) => {
      x = e.offsetX;
      y = e.offsetY;
      isMouseDown = true;
    });
    
    canvas.addEventListener("mousemove", (e) => {
      if (isMouseDown) {
        dx += e.offsetX - x
        dy += e.offsetY - y
        x = e.offsetX;
        y = e.offsetY;
        // if (e.offsetX == 250) dx = 0;
        // if (e.offsetY == 250) dy = 0;
      }
      curx = e.offsetX;
      cury = e.offsetY;
    });
    
    window.addEventListener("mouseup", (e) => {
      if (isMouseDown) {
        x = 0;
        y = 0;
        mx = curx;
        my = cury;
        isMouseDown = false;
      }
    })
  
    document.addEventListener('wheel', function(e) {
      scale += e.deltaY / 1000
      e.preventDefault()
    })

    gl.clearColor(1, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    const start = Date.now();
    const vs = loadShaderAsync("vert.glsl");
    const fs = loadShaderAsync("frag.glsl");

    Promise.all([vs, fs]).then((res) => {
      const vstext = res[0];
      const fstext = res[1];

      const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vstext);
      const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fstext);
  
      const program = gl.createProgram();
      gl.attachShader(program, vertexSh);
      gl.attachShader(program, fragmentSh);
      gl.linkProgram(program);
  
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let buf = gl.getProgramInfoLog(program);
        alert(buf);
      }
  
      const posLoc = gl.getAttribLocation(program, "in_pos");
      const dxLoc = gl.getUniformLocation(program, "dx");
      const dyLoc = gl.getUniformLocation(program, "dy");
      const mxLoc = gl.getUniformLocation(program, "mx");
      const myLoc = gl.getUniformLocation(program, "my");
      const scaleLoc = gl.getUniformLocation(program, "scale");
  
      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      const pos = [1, 1, 0, 1, -1, 0, -1, -1, 0, -1, 1, 0, 1, 1, 0];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLoc);
      gl.useProgram(program);
      const timeFromStart = Date.now() - start;
      const loc = gl.getUniformLocation(program, "time");
      gl.uniform1f(loc, timeFromStart / 1000.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
      const render = () => {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);
        gl.useProgram(program);
        const timeFromStart = Date.now() - start;
        gl.uniform1f(loc, timeFromStart / 1000.0);
        gl.uniform1f(dxLoc, dx);
        gl.uniform1f(dyLoc, dy);
        gl.uniform1f(mxLoc, mx);
        mx = 0
        gl.uniform1f(myLoc, my);
        my = 0
        gl.uniform1f(scaleLoc, scale);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
        window.requestAnimationFrame(render);
      };
      render();
    })
}
