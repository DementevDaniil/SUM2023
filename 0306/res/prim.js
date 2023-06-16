import {vec3, mat4, camera} from "../mth.js"

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

async function loadFileAsync(fileName) {
    try {
        const response = await fetch(fileName);
        return response.text();
      } catch(err) {
        console.log(err);
    }
}

export class prim {
    blockFormat = "pppnnn"
    blockSize = this.blockFormat.length * 4

    constructor(gl, type, vArray, iArray, shdName, fileName) {
        const vs = loadShaderAsync("./res/shaders/" + shdName + "/vert.vert");
        const fs = loadShaderAsync("./res/shaders/" + shdName + "/frag.frag");

        this.gl = gl
        this.type = type
        this.trans = new mat4()
        Promise.all([vs, fs]).then((res) => {
            const vstext = res[0];
            const fstext = res[1];
        
            const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vstext);
            const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fstext);
        
            const program = gl.createProgram();
            this.program = program
            gl.attachShader(this.program, vertexSh);
            gl.attachShader(this.program, fragmentSh);
            gl.linkProgram(this.program);

            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                let buf = gl.getProgramInfoLog(this.program);
                alert(buf);
            }

            let vArr = vArray
            let iArr = iArray
            if (fileName != "") {
                let response = loadFileAsync(fileName)
                Promise.all([response]).then((text) => {
                    let data = text.toString().split("\n")
                    let vn = 0
                    let fn = 0
                    for (let str of data) {
                        if (str[0] === "v" && str[1] === " ") {
                            vArr.push(parseInt(str[2]))
                            vArr.push(parseInt(str[3]))
                            vArr.push(parseInt(str[4]))
                            vn++
                        } else if (str[0] === "f" && str[1] === " ") {
                            let n = 0
                            let c = 0
                            let c0 = 0
                            let c1 = 0
                            let cur = ""
                            let old = ""
                            for (let i = 2; i < str.length; i++) {
                                cur = str[i]
                                if (cur !== " " && old == " ") {
                                    c = parseInt(cur)
                                    if (c < 0) c = vn + c
                                    else c--
                                    if (n == 0) c0 = c
                                    else if (n == 1) c1 = c
                                    else {
                                        fn += 3
                                        iArr.push(c0)
                                        iArr.push(c1)
                                        iArr.push(c)
                                        c1 = c
                                    }
                                    n++
                                }
                                old = cur
                            }
                        }
                    }
                    const vertexArray = gl.createVertexArray();
                    gl.bindVertexArray(vertexArray);

                    const positionBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                    this.vertexData = vArr
                    this.indexData = iArr
                    this.vertexArray = vertexArray
                    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
                    
                    const posLoc = gl.getAttribLocation(this.program, 'in_pos');
                    const normLoc = gl.getAttribLocation(this.program, 'in_normal');
                    
                    gl.enableVertexAttribArray(posLoc)
                    gl.enableVertexAttribArray(normLoc)

                    gl.vertexAttribPointer(
                        posLoc,  // location
                        3,            // size (components per iteration)
                        gl.FLOAT,     // type of to get from buffer
                        false,        // normalize
                        this.blockSize,            // stride (bytes to advance each iteration)
                        0,            // offset (bytes from start of buffer)
                    );

                    gl.vertexAttribPointer(
                        normLoc,  // location
                        3,            // size (components per iteration)
                        gl.FLOAT,     // type of to get from buffer
                        true,        // normalize
                        this.blockSize,            // stride (bytes to advance each iteration)
                        12,            // offset (bytes from start of buffer)
                    );

                    this.type = type
                    this.trans = new mat4()

                    const indexBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
                    gl.bindVertexArray(null);

                    return this
                })
            }
            const vertexArray = gl.createVertexArray();
            gl.bindVertexArray(vertexArray);
            
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            this.vertexData = vArr
            this.indexData = iArr
            this.vertexArray = vertexArray
            gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
            
            const posLoc = gl.getAttribLocation(this.program, 'in_pos');
            const normLoc = gl.getAttribLocation(this.program, 'in_normal');
            
            gl.enableVertexAttribArray(posLoc)
            gl.enableVertexAttribArray(normLoc)
            
            gl.vertexAttribPointer(
                posLoc,  // location
                3,            // size (components per iteration)
                gl.FLOAT,     // type of to get from buffer
                false,        // normalize
                this.blockSize,            // stride (bytes to advance each iteration)
                0,            // offset (bytes from start of buffer)
            );
            
            gl.vertexAttribPointer(
                normLoc,  // location
                3,            // size (components per iteration)
                gl.FLOAT,     // type of to get from buffer
                true,        // normalize
                this.blockSize,            // stride (bytes to advance each iteration)
                12,            // offset (bytes from start of buffer)
            );
            
            const indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
            gl.bindVertexArray(null);
            
            return this
        })




/*
            let data = this.load(fileName)
            vArr = data[0]
            iArr = data[1]
            Promise.all([vArr, iArr]).then((res) => {
                this.gl = gl
                Promise.all([vs, fs]).then((res) => {
                    let vn = 0
                    let fn = 0
                    let ind = []
                    let v = []
                    let response = loadFileAsync(fileName)
                    Promise.all(response).then((res) => {
                        let data = res.split("\n")
                        for (str of data) {
                            if (str[0] === "v" && str[1] === " ") {
                                let pos = new vec3(parseInt(str[2]),
                                                   parseInt(str[3]),
                                                   parseInt(str[4]))
                                v.push(pos)
                                vn++
                            } else if (str[0] === "f" && str[1] === " ") {
                                let n = 0
                                let c = 0
                                let c0 = 0
                                let c1 = 0
                                let cur = ""
                                let old = ""
                                for (i = 2; i < str.length; i++) {
                                    cur = str[i]
                                    if (cur !== " " && old == " ") {
                                        c = parseInt(cur)
                                        if (c < 0) c = vn + c
                                        else c--
                                        if (n == 0) c0 = c
                                        else if (n == 1) c1 = c
                                        else {
                                            fn += 3
                                            ind.push(c0)
                                            ind.push(c1)
                                            ind.push(c)
                                            c1 = c
                                        }
                                        n++
                                    }
                                    old = cur
                                }
                            }
                        }

                        /// shaders
                        const vstext = res[0];
                        const fstext = res[1];
                        
                        const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vstext);
                        const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fstext);
                        
                        const program = gl.createProgram();
                        this.program = program
                        gl.attachShader(this.program, vertexSh);
                        gl.attachShader(this.program, fragmentSh);
                        gl.linkProgram(this.program);
                        
                        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                            let buf = gl.getProgramInfoLog(this.program);
                            alert(buf);
                        }

                        const vertexArray = gl.createVertexArray();
                        gl.bindVertexArray(vertexArray);
                    
                        const positionBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                        this.vertexData = vArr
                        this.indexData = iArr
                        this.vertexArray = vertexArray
                        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);

                        const posLoc = gl.getAttribLocation(this.program, 'in_pos');
                        const normLoc = gl.getAttribLocation(this.program, 'in_normal');

                        gl.enableVertexAttribArray(posLoc)
                        gl.enableVertexAttribArray(normLoc)
                    
                        gl.vertexAttribPointer(
                            posLoc,  // location
                            3,            // size (components per iteration)
                            gl.FLOAT,     // type of to get from buffer
                            false,        // normalize
                            this.blockSize,            // stride (bytes to advance each iteration)
                            0,            // offset (bytes from start of buffer)
                        );
                        
                        gl.vertexAttribPointer(
                            normLoc,  // location
                            3,            // size (components per iteration)
                            gl.FLOAT,     // type of to get from buffer
                            true,        // normalize
                            this.blockSize,            // stride (bytes to advance each iteration)
                            12,            // offset (bytes from start of buffer)
                        );
                        
                        this.type = type
                        this.trans = new mat4()
                        
                        const indexBuffer = gl.createBuffer();
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
                        gl.bindVertexArray(null);
                        
                        return this
                    })
                })    
            })
            
        }

            
            const vertexArray = gl.createVertexArray();
            gl.bindVertexArray(vertexArray);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            this.vertexData = vArr
            this.indexData = iArr
            this.vertexArray = vertexArray
            gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
            
            const posLoc = gl.getAttribLocation(this.program, 'in_pos');
            const normLoc = gl.getAttribLocation(this.program, 'in_normal');
            
            gl.enableVertexAttribArray(posLoc)
            gl.enableVertexAttribArray(normLoc)

            gl.vertexAttribPointer(
                posLoc,  // location
                3,            // size (components per iteration)
                gl.FLOAT,     // type of to get from buffer
                false,        // normalize
                this.blockSize,            // stride (bytes to advance each iteration)
                0,            // offset (bytes from start of buffer)
            );

            gl.vertexAttribPointer(
                normLoc,  // location
                3,            // size (components per iteration)
                gl.FLOAT,     // type of to get from buffer
                true,        // normalize
                this.blockSize,            // stride (bytes to advance each iteration)
                12,            // offset (bytes from start of buffer)
            );

            this.type = type
            this.trans = new mat4()

            const indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
            gl.bindVertexArray(null);

            return this
        })*/
    }

    draw(cam, world) {
        this.gl.bindVertexArray(this.vertexArray);
        
        this.gl.useProgram(this.program);

        let wvp = new mat4()
        let w = new mat4()

        if (this.trans == undefined) return
        w.mul(this.trans.mul(world))
        let winv = new mat4(w)
        winv.inverse().transpose()
        wvp.mul(world).mul(cam.matrVP)

        const wvpLoc = this.gl.getUniformLocation(this.program, 'wvp');
        const wLoc = this.gl.getUniformLocation(this.program, 'w');
        const winvLoc = this.gl.getUniformLocation(this.program, 'winv');

        this.gl.uniformMatrix4fv(wvpLoc, false, new Float32Array(wvp.toArray()));
        this.gl.uniformMatrix4fv(wLoc, false, new Float32Array(w.toArray()));
        this.gl.uniformMatrix4fv(winvLoc, false, new Float32Array(winv.toArray()));

        this.gl.drawElements(
            this.gl.TRIANGLES,
            this.indexData.length,                // num vertices to process
            this.gl.UNSIGNED_SHORT, // type of indices
            0,                 // offset on bytes to indices
          );
    }

    async load(fileName) {
        let vn = 0
        let fn = 0
        let ind = []
        let v = []
        let response = await fetch(fileName)
        Promise.all(response).then((res) => {
            let data = res.split("\n")
            for (str of data) {
                if (str[0] === "v" && str[1] === " ") {
                    let pos = new vec3(parseInt(str[2]),
                                       parseInt(str[3]),
                                       parseInt(str[4]))
                    v.push(pos)
                    vn++
                } else if (str[0] === "f" && str[1] === " ") {
                    let n = 0
                    let c = 0
                    let c0 = 0
                    let c1 = 0
                    let cur = ""
                    let old = ""
                    for (i = 2; i < str.length; i++) {
                        cur = str[i]
                        if (cur !== " " && old == " ") {
                            c = parseInt(cur)
                            if (c < 0) c = vn + c
                            else c--
                            if (n == 0) c0 = c
                            else if (n == 1) c1 = c
                            else {
                                fn += 3
                                ind.push(c0)
                                ind.push(c1)
                                ind.push(c)
                                c1 = c
                            }
                            n++
                        }
                        old = cur
                    }
                }
            }
            return [v, ind]
        })
    }
}