export const pi = () => { return Math.PI }

export const d2r = (a) => { return a * (pi() / 180.0) }
export const r2d = (a) => { return a * (180.0 / pi()) }

export const sin = (x) => { return Math.sin(x) }
export const cos = (x) => { return Math.cos(x) }

export const sqrt = (x) => { return Math.sqrt(x) }

export class vec3 {
    constructor(x, y, z) {
        if (x == null) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        } else if (x.constructor.name == "vec3") {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }
    }

    toArray() {
        return [this.x, this.y, this.z]
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    neg() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    div(n) {
        this.set(this.x / n, this.y / n, this.z / n)
        return this;
    }

    cross(other) {
        let v = new vec3(this.y * other.z - this.z * other.y,
                         this.z * other.x - this.x * other.z,
                         this.x * other.y - this.y * other.x);
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    len() {
        let len = this.dot(this);

        if (len == 1 || len == 0)
            return len;
        return sqrt(len);
    }

    len2() {
        let len = this.dot(this);

        if (len == 1 || len == 0)
            return len;
        return len;
    }

    normalize() {
        let len = sqrt(this.dot(this));

        if (len == 1 || len == 0)
            return this;
        return this.div(len);
    }
}
  
export class mat4 {
    constructor(a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23,
                a30, a31, a32, a33) {
        if (a00 == null) {
            this.r0 = [1, 0, 0, 0],
            this.r1 = [0, 1, 0, 0],
            this.r2 = [0, 0, 1, 0],
            this.r3 = [0, 0, 0, 1]
            return this;
        } else if (a00.constructor.name == "mat4") {
            this.r0 = a00.r0,
            this.r1 = a00.r1,
            this.r2 = a00.r2,
            this.r3 = a00.r3;
            return this; 
        } else {
            this.r0 = [a00, a01, a02, a03],
            this.r1 = [a10, a11, a12, a13],
            this.r2 = [a20, a21, a22, a23],
            this.r3 = [a30, a31, a32, a33]
            return this;     
        }      
    }

    toArray() {
        let string = this.r0.join(' ') + ' ' + this.r1.join(' ') + ' ' + this.r2.join(' ') + ' ' + this.r3.join(' ')
        let res = string.split(' ')
        return res
    }

    determ3(a00, a01, a02,
            a10, a11, a12,
            a20, a21, a22) {
        return a00 * a11 * a22 + a01 * a12 * a20 + a02 * a10 * a21 -
               a00 * a12 * a21 - a01 * a10 * a22 - a02 * a11 * a20;
    }

    determ() {
        return this.r0[0] * this.determ3(this.r1[1], this.r1[2], this.r1[3],
                                   this.r2[1], this.r2[2], this.r2[3],
                                   this.r3[1], this.r3[2], this.r3[3]) +
               -this.r0[1] * this.determ3(this.r1[0], this.r1[2], this.r1[3],
                                   this.r2[0], this.r2[2], this.r2[3],
                                   this.r3[0], this.r3[2], this.r3[3]) +
               this.r0[2] * this.determ3(this.r1[0], this.r1[1], this.r1[3],
                                   this.r2[0], this.r2[1], this.r2[3],
                                   this.r3[0], this.r3[1], this.r3[3]) +
               -this.r0[3] * this.determ3(this.r1[0], this.r1[1], this.r1[2],
                                   this.r2[0], this.r2[1], this.r2[2],
                                   this.r3[0], this.r3[1], this.r3[2]);
    }

    identity() {
        this.r0 = [1, 0, 0, 0];
        this.r1 = [0, 1, 0, 0];
        this.r2 = [0, 0, 1, 0];
        this.r3 = [0, 0, 0, 1];
        return this;
    }

    mul(obj) {
        if (obj.constructor.name == "mat4") {
            let r = new mat4;
            r.r0[0] = this.r0[0] * obj.r0[0] + this.r0[1] * obj.r1[0] + 
                      this.r0[2] * obj.r2[0] + this.r0[3] * obj.r3[0];

            r.r0[1] = this.r0[0] * obj.r0[1] + this.r0[1] * obj.r1[1] + 
                      this.r0[2] * obj.r2[1] + this.r0[3] * obj.r3[1];
   
            r.r0[2] = this.r0[0] * obj.r0[2] + this.r0[1] * obj.r1[2] + 
                      this.r0[2] * obj.r2[2] + this.r0[3] * obj.r3[2];
   
            r.r0[3] = this.r0[0] * obj.r0[3] + this.r0[1] * obj.r1[3] + 
                      this.r0[2] * obj.r2[3] + this.r0[3] * obj.r3[3];
   
            r.r1[0] = this.r1[0] * obj.r0[0] + this.r1[1] * obj.r1[0] + 
                      this.r1[2] * obj.r2[0] + this.r1[3] * obj.r3[0];
   
            r.r1[1] = this.r1[0] * obj.r0[1] + this.r1[1] * obj.r1[1] + 
                      this.r1[2] * obj.r2[1] + this.r1[3] * obj.r3[1];
   
            r.r1[2] = this.r1[0] * obj.r0[2] + this.r1[1] * obj.r1[2] + 
                      this.r1[2] * obj.r2[2] + this.r1[3] * obj.r3[2];
   
            r.r1[3] = this.r1[0] * obj.r0[3] + this.r1[1] * obj.r1[3] + 
                      this.r1[2] * obj.r2[3] + this.r1[3] * obj.r3[3];
   
            r.r2[0] = this.r2[0] * obj.r0[0] + this.r2[1] * obj.r1[0] + 
                      this.r2[2] * obj.r2[0] + this.r2[3] * obj.r3[0];
   
            r.r2[1] = this.r2[0] * obj.r0[1] + this.r2[1] * obj.r1[1] + 
                      this.r2[2] * obj.r2[1] + this.r2[3] * obj.r3[1];
   
            r.r2[2] = this.r2[0] * obj.r0[2] + this.r2[1] * obj.r1[2] + 
                      this.r2[2] * obj.r2[2] + this.r2[3] * obj.r3[2];
   
            r.r2[3] = this.r2[0] * obj.r0[3] + this.r2[1] * obj.r1[3] + 
                      this.r2[2] * obj.r2[3] + this.r2[3] * obj.r3[3];
   
            r.r3[0] = this.r3[0] * obj.r0[0] + this.r3[1] * obj.r1[0] + 
                      this.r3[2] * obj.r2[0] + this.r3[3] * obj.r3[0];
   
            r.r3[1] = this.r3[0] * obj.r0[1] + this.r3[1] * obj.r1[1] + 
                      this.r3[2] * obj.r2[1] + this.r3[3] * obj.r3[1];
   
            r.r3[2] = this.r3[0] * obj.r0[2] + this.r3[1] * obj.r1[2] + 
                      this.r3[2] * obj.r2[2] + this.r3[3] * obj.r3[2];
   
            r.r3[3] = this.r3[0] * obj.r0[3] + this.r3[1] * obj.r1[3] + 
                      this.r3[2] * obj.r2[3] + this.r3[3] * obj.r3[3];

            this.r0 = r.r0;
            this.r1 = r.r1;
            this.r2 = r.r2;
            this.r3 = r.r3;

            return this;
        }
        else if (obj.constructor.name == "vec3") {
            let w = obj.x * this.r0[3] + obj.y * this.r1[3] + obj.z * this.r2[3] + this.r3[3];

            return vec3((obj.x * this.r0[0] + obj.y * this.r1[0] + obj.z * this.r2[0] + this.r3[0]) / w,
                        (obj.y * this.r0[1] + obj.y * this.r1[1] + obj.z * this.r2[1] + this.r3[1]) / w,
                        (obj.z * this.r0[2] + obj.y * this.r1[2] + obj.z * this.r2[2] + this.r3[2]) / w);
        }
    }

    inverse() {
        let m = new mat4;
        let det = this.determ();

        if (det == 0) {
            return this.identity()
        }

        m.r0[0] = this.determ3(this.r1[1], this.r1[2], this.r1[3],
                          this.r2[1], this.r2[2], this.r2[3],
                          this.r3[1], this.r3[2], this.r3[3]) / det;

        m.r1[0] = -this.determ3(this.r1[0], this.r1[2], this.r1[3],
                           this.r2[0], this.r2[2], this.r2[3],
                           this.r3[0], this.r3[2], this.r3[3]) / det;

        m.r2[0] = this.determ3(this.r1[0], this.r1[1], this.r1[3],
                          this.r2[0], this.r2[1], this.r2[3],
                          this.r3[0], this.r3[1], this.r3[3]) / det;

        m.r3[0] = -this.determ3(this.r1[0], this.r1[1], this.r1[2],
                           this.r2[0], this.r2[1], this.r2[2],
                           this.r3[0], this.r3[1], this.r3[2]) / det;

        m.r0[1] = -this.determ3(this.r0[1], this.r0[2], this.r0[3],
                           this.r2[1], this.r2[2], this.r2[3],
                           this.r3[1], this.r3[2], this.r3[3]) / det;

        m.r1[1] = this.determ3(this.r0[0], this.r0[2], this.r0[3],
                          this.r2[0], this.r2[2], this.r2[3],
                          this.r3[0], this.r3[2], this.r3[3]) / det;

        m.r2[1] = -this.determ3(this.r0[0], this.r0[1], this.r0[3],
                           this.r2[0], this.r2[1], this.r2[3],
                           this.r3[0], this.r3[1], this.r3[3]) / det;

        m.r3[1] = this.determ3(this.r0[0], this.r0[1], this.r0[2],
                          this.r2[0], this.r2[1], this.r2[2],
                          this.r3[0], this.r3[1], this.r3[2]) / det;

        m.r0[2] = this.determ3(this.r0[1], this.r0[2], this.r0[3],
                          this.r1[1], this.r1[2], this.r1[3],
                          this.r3[1], this.r3[2], this.r3[3]) / det;

        m.r1[2] = -this.determ3(this.r0[0], this.r0[2], this.r0[3],
                           this.r1[0], this.r1[2], this.r1[3],
                           this.r3[0], this.r3[2], this.r3[3]) / det;

        m.r2[2] = this.determ3(this.r0[0], this.r0[1], this.r0[3],
                          this.r1[0], this.r1[1], this.r1[3],
                          this.r3[0], this.r3[1], this.r3[3]) / det;

        m.r3[2] = -this.determ3(this.r0[0], this.r0[1], this.r0[2],
                           this.r1[0], this.r1[1], this.r1[2],
                           this.r3[0], this.r3[1], this.r3[2]) / det;

        m.r0[3] = this.determ3(this.r0[1], this.r0[2], this.r0[3],
                          this.r1[1], this.r1[2], this.r1[3],
                          this.r2[1], this.r2[2], this.r2[3]) / det;

        m.r1[3] = -this.determ3(this.r0[0], this.r0[2], this.r0[3],
                           this.r1[0], this.r1[2], this.r1[3],
                           this.r2[0], this.r2[2], this.r2[3]) / det;

        m.r2[3] = this.determ3(this.r0[0], this.r0[1], this.r0[3],
                          this.r1[0], this.r1[1], this.r1[3],
                          this.r2[0], this.r2[1], this.r2[3]) / det;

        m.r3[3] = -this.determ3(this.r0[0], this.r0[1], this.r0[2],
                           this.r1[0], this.r1[1], this.r1[2],
                           this.r2[0], this.r2[1], this.r2[2]) / det;
        
        this.r0 = m.r0;
        this.r1 = m.r1;
        this.r2 = m.r2;
        this.r3 = m.r3;

        return this;
    }

    transpose() {
        let m = new mat4;

        m.r0 = [this.r0[0], this.r1[0], this.r2[0], this.r3[0]];
        m.r1 = [this.r0[1], this.r1[1], this.r2[1], this.r3[1]];
        m.r2 = [this.r0[2], this.r1[2], this.r2[2], this.r3[2]];
        m.r3 = [this.r0[3], this.r1[3], this.r2[3], this.r3[3]];

        this.r0 = m.r0;
        this.r1 = m.r1;
        this.r2 = m.r2;
        this.r3 = m.r3;

        return this;
    }

    translate(other) {
        let m = new mat4;
    
        m.r0 = [1, 0, 0, 0];
        m.r1 = [0, 1, 0, 0];
        m.r2 = [0, 0, 1, 0];
        m.r3 = [other.x, other.y, other.z, 1];

        this.r0 = m.r0;
        this.r1 = m.r1;
        this.r2 = m.r2;
        this.r3 = m.r3;

        return this;
    }

    scale(n) {
        let m = new mat4;
    
        m.r0 = [n, 0, 0, 0];
        m.r1 = [0, n, 0, 0];
        m.r2 = [0, 0, n, 0];
        m.r3 = [0, 0, 0, 1];

        this.r0 = m.r0;
        this.r1 = m.r1;
        this.r2 = m.r2;
        this.r3 = m.r3;

        return this;
    }

    matrRotate(angleToDegree, r) {
        let a = d2r(angleToDegree);
        let s = sin(a);
        let c = cos(a);
        r.normalize();
        let m = new mat4;
        m.r0 = [c + r.x * r.x * (1 - c),
                r.x * r.y * (1 - c) + r.z * s,
                r.x * r.z * (1 - c) - r.y * s, 0];
        m.r1 = [r.y * r.x * (1 - c) - r.z * s,
                c + r.y * r.y * (1 - c),
                r.y * r.z * (1 - c) + r.x * s, 0];
        m.r2 = [r.z * r.x * (1 - c) + r.y * s,
                r.z * r.y * (1 - c) - r.x * s,
                c + r.z * r.z * (1 - c), 0];
        m.r3 = [0, 0, 0, 1];
        this.mul(m)

        return this;
    }

    
    setView(loc, at, up1) {
        let dir = new vec3(at)
        dir = dir.sub(loc).normalize()
        let right = new vec3(dir)
        right.cross(up1).normalize()
        let up = new vec3(right)
        up.cross(dir)
        let m = new mat4;

        m.r0 = [right.x, up.x, -dir.x, 0];
        m.r1 = [right.y, up.y, -dir.y, 0];
        m.r2 = [right.z, up.z, -dir.z, 0];
        m.r3 = [(loc.dot(right)), -loc.dot(up), loc.dot(dir), 1]
        
        this.r0 = m.r0;
        this.r1 = m.r1;
        this.r2 = m.r2;
        this.r3 = m.r3;

        return this;
    }

    setFrustum(left, right, bottom, top, near, far) {
        let m = new mat4;
      
        m.r0 = [2 * near / (right - left), 0, 0, 0];
        m.r1 = [0, 2 * near / (top - bottom), 0, 0];
        m.r2 = [(right + left) / (right - left), (top + bottom) / (top - bottom), (far + near) / (near - far), -1];
        m.r3 = [0, 0, 2 * near * far / (near - far), 0];
      
        this.r0 = m.r0;
        this.r1 = m.r1;
        this.r2 = m.r2;
        this.r3 = m.r3;

        return this;
    }
}

export class camera {
    constructor() {
        this.projSize = 0.1;
        this.projDist = 0.1;
        this.projFarClip = 2000;
    
        this.frameW = 500;
        this.frameH = 500;
        
        this.matrView = new mat4();
        this.matrProj = new mat4();
        this.matrVP = new mat4();
    
        this.loc = new vec3();     
        this.at = new vec3();   
        this.dir = new vec3();    
        this.up = new vec3();  
        this.right = new vec3();
        return this
    }

    set(loc, at, up) {
        this.matrView.setView(loc, at, up);
        this.loc = new vec3(loc);
        this.at = new vec3(at);
        this.matrVP = new mat4(this.matrView).mul(this.matrProj);
        this.dir.set(-this.matrView.r0[2],
                     -this.matrView.r1[2],
                     -this.matrView.r2[2]);
        this.up.set(-this.matrView.r0[1],
                    -this.matrView.r1[1],
                    -this.matrView.r2[1]);
        this.right.set(-this.matrView.r0[0],
                       -this.matrView.r1[0],
                       -this.matrView.r2[0]);
    }
    
    setProj(projSize, projDist, projFarClip) {
        let rx = projSize, ry = projSize;
    
        this.projDist = projDist;
        this.projSize = projSize;
        this.projFarClip = projFarClip;
    
        if (this.frameW > this.frameH)
          rx *= this.frameW / this.frameH;
        else
          ry *= this.frameH / this.frameW;
        this.matrProj.setFrustum(-rx / 2.0, rx / 2.0, -ry / 2.0, ry / 2.0, projDist, projFarClip);    
        this.matrVP = new mat4(this.matrView).mul(this.matrProj);
    }
    
    setSize(frameW, frameH) {
        if (frameW < 1)
          frameW = 1;
        if (frameH < 1)
          frameH = 1;
        this.frameW = frameW;
        this.frameH = frameH;
        this.setProj(this.projSize, this.projDist, this.projFarClip);
    }
}
