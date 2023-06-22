import { globalGL, globalCamera } from "../main/main.js"
import { texture } from "./txt.js"

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

class _mtl {
    constructor(shdName, ka, kd, ks, ph, trans, texNames, isShade) {
        const vs = loadShaderAsync("../bin/shaders/" + shdName + "/vert.glsl");
        const fs = loadShaderAsync("../bin/shaders/" + shdName + "/frag.glsl");

        Promise.all([vs, fs]).then((res) => {
            const vstext = res[0];
            const fstext = res[1];
        
            const vertexSh = loadShader(globalGL.VERTEX_SHADER, vstext);
            const fragmentSh = loadShader(globalGL.FRAGMENT_SHADER, fstext);

            const program = globalGL.createProgram();
            this.program = program
            globalGL.attachShader(this.program, vertexSh);
            globalGL.attachShader(this.program, fragmentSh);
            globalGL.linkProgram(this.program);

            if (!globalGL.getProgramParameter(this.program, globalGL.LINK_STATUS)) {
                let buf = globalGL.getProgramInfoLog(this.program);
                alert(buf);
            }

            globalGL.useProgram(this.program)

            this.tex = []
            this.texInd = []
            let cnt = 0
            for (let texName of texNames) {
                this.tex.push(texture(texName))
                this.texInd.push(1)
                cnt++
            }
            for (cnt; cnt < 4; cnt++) {
                this.texInd.push(0)
            }
            globalGL.uniform1i(globalGL.getUniformLocation(this.program, "isTex0"), this.texInd[0])
            globalGL.uniform1i(globalGL.getUniformLocation(this.program, "isTex1"), this.texInd[1])
            globalGL.uniform1i(globalGL.getUniformLocation(this.program, "isTex2"), this.texInd[2])
            globalGL.uniform1i(globalGL.getUniformLocation(this.program, "isTex3"), this.texInd[3])
            
            let kaLoc = globalGL.getUniformLocation(this.program, "in_Ka")
            let kdLoc = globalGL.getUniformLocation(this.program, "in_Kd")
            let ksLoc = globalGL.getUniformLocation(this.program, "in_Ks")
            let phLoc = globalGL.getUniformLocation(this.program, "in_Ph")
            let transLoc = globalGL.getUniformLocation(this.program, "in_Trans")
            let isShadeLoc = globalGL.getUniformLocation(this.program, "in_IsShade")

            if (ka != undefined) globalGL.uniform3fv(kaLoc, new Float32Array(ka.toArray()))
            else globalGL.uniform3fv(kaLoc, new Float32Array(vec3().toArray()))
            if (kd != undefined) globalGL.uniform3fv(kdLoc, new Float32Array(kd.toArray()))
            else globalGL.uniform3fv(kdLoc, new Float32Array(vec3().toArray()))
            if (ks != undefined) globalGL.uniform3fv(ksLoc, new Float32Array(ks.toArray()))
            else globalGL.uniform3fv(ksLoc, new Float32Array(vec3().toArray()))
            if (ph != undefined) globalGL.uniform1f(phLoc, ph)
            else globalGL.uniform1f(phLoc, 0)
            if (trans != undefined) globalGL.uniform1f(transLoc, trans)
            else globalGL.uniform1f(transLoc, 0)
            if (isShade != undefined) globalGL.uniform1f(isShadeLoc, isShade)
            else globalGL.uniform1f(isShadeLoc, true)
        })
    }
}

export function mtl(shdName, ka, kd, ks, ph, trans, texture, isShade) {
    return new _mtl(shdName, ka, kd, ks, ph, trans, texture, isShade)
}