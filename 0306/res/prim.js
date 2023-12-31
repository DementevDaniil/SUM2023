import { globalGL, globalCamera } from "../main/main.js"
import { vec3, mat4, camera } from "../main/mth.js"

class _prim {
    blockFormat = "pppttnnncccc"
    blockSize = this.blockFormat.length * 4

    constructor(type, vertexData, indexData, mtl) {
        this.type = type
        this.trans = mat4()
        this.mtl = mtl

        const vertexArray = globalGL.createVertexArray();
        globalGL.bindVertexArray(vertexArray);
        
        const positionBuffer = globalGL.createBuffer();
        globalGL.bindBuffer(globalGL.ARRAY_BUFFER, positionBuffer);
        this.vertexData = vertexData
        this.indexData = indexData
        this.vertexArray = vertexArray
        globalGL.bufferData(globalGL.ARRAY_BUFFER, this.vertexData, globalGL.STATIC_DRAW);

        globalGL.vertexAttribPointer(
            0,  // location
            3,            // size (components per iteration)
            globalGL.FLOAT,     // type of to get from buffer
            false,        // normalize
            this.blockSize,            // stride (bytes to advance each iteration)
            0,            // offset (bytes from start of buffer)
        );

        globalGL.vertexAttribPointer(
            1,
            2,
            globalGL.FLOAT,
            false,
            this.blockSize,
            12
        ); /* texture coordinates */

        globalGL.vertexAttribPointer(
            2,
            3,
            globalGL.FLOAT,
            false,
            this.blockSize,
            20
        ); /* normal */
        
        globalGL.vertexAttribPointer(
            3,
            4,
            globalGL.FLOAT, 
            false, 
            this.blockSize,
            32
        ); /* color */

        globalGL.enableVertexAttribArray(0);
        globalGL.enableVertexAttribArray(1);
        globalGL.enableVertexAttribArray(2);
        globalGL.enableVertexAttribArray(3);

        const indexBuffer = globalGL.createBuffer();
        globalGL.bindBuffer(globalGL.ELEMENT_ARRAY_BUFFER, indexBuffer);
        globalGL.bufferData(globalGL.ELEMENT_ARRAY_BUFFER, this.indexData, globalGL.STATIC_DRAW);
        globalGL.bindVertexArray(null);

        return this
    }

    load() {

    }

    draw(world) {
        if (this.mtl != undefined && this.mtl.program != null) {
            globalGL.bindVertexArray(this.vertexArray);
            
            globalGL.useProgram(this.mtl.program);

            const camLoc = globalGL.getUniformLocation(this.mtl.program, 'camLoc')
            const vpLoc = globalGL.getUniformLocation(this.mtl.program, 'vp')

            globalGL.uniform3fv(camLoc, new Float32Array(globalCamera.loc.toArray()))
            globalGL.uniformMatrix4fv(vpLoc, false, new Float32Array(globalCamera.matrVP.toArray()));

            let wvp = mat4()
            let w = mat4()

            w = w.mul(this.trans.mul(world))
            let winv = w.inverse().transpose()
            wvp = world.mul(globalCamera.matrVP)

            const wvpLoc = globalGL.getUniformLocation(this.mtl.program, 'wvp');
            const wLoc = globalGL.getUniformLocation(this.mtl.program, 'w');
            const winvLoc = globalGL.getUniformLocation(this.mtl.program, 'winv');

            globalGL.uniformMatrix4fv(wvpLoc, false, new Float32Array(wvp.toArray()));
            globalGL.uniformMatrix4fv(wLoc, false, new Float32Array(w.toArray()));
            globalGL.uniformMatrix4fv(winvLoc, false, new Float32Array(winv.toArray()));

            globalGL.drawElements(
                globalGL.TRIANGLES,
                this.indexData.length,                // num vertices to process
                globalGL.UNSIGNED_SHORT, // type of indices
                0,                 // offset on bytes to indices
            );

            for (let i = 0; i < 4; i++) {
                if (this.mtl.tex[i] != null) {
                    globalGL.bindTexture(globalGL.TEXTURE_2D, this.mtl.tex[i].glId);
                    globalGL.activeTexture(globalGL.TEXTURE0);

                    const loc = globalGL.getUniformLocation(this.mtl.program, `Tex${i}`);
                    if (loc != null) {
                        globalGL.uniform1i(loc, i);
                    }
                }
            }
        }
    }
}

export function prim(type, vertexData, indexData, mtl) {
    return new _prim(type, vertexData, indexData, mtl)
}