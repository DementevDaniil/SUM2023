import {pi, r2d, d2r, sin, cos, sqrt, vec3, mat4, camera} from "../mth.js"
import { globalGL, globalCamera } from "../main.js"
import { texture } from "./txt.js"

class _mtl {
    constructor(program, ka, kd, ks, ph, trans, texNames, isShade) {
        this.program = program

        if (!globalGL.getProgramParameter(this.program, globalGL.LINK_STATUS)) {
            let buf = globalGL.getProgramInfoLog(this.program);
            console.log(buf);
        }

        globalGL.useProgram(this.program)

        this.texNames = texNames
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

        this.ka = vec3(ka)
        this.kd = vec3(kd)
        this.ks = vec3(ks)
        this.ph = ph
        this.trans = trans
        this.isShade = isShade

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
    }
}

export function mtl(shdName, ka, kd, ks, ph, trans, texture, isShade) {
    return new _mtl(shdName, ka, kd, ks, ph, trans, texture, isShade)
}