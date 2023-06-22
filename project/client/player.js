import { globalGL } from "./main.js"
import { pi, r2d, d2r, sin, cos, sqrt, vec3, mat4, camera } from "./mth.js"
import { prim } from "./res/prim.js"
import { control } from "./control.js"
import { timer } from "./timer.js"

class _player {
    constructor(pr, world) {
        this.prim = pr
        this.prim.trans = world
        let cam = camera()
        cam.setSize(500, 500)
        let loc = pr.minBB.add(pr.maxBB).div(2)
        let at = vec3()
        this.loc = vec3(loc)
    }
}

export function player(prim, world) { return new _player(prim, world) }
