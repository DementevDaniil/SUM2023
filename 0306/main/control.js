class _control {
    constructor() {
        // keyboard flags
        this.arrowRight = false
        this.arrowLeft = false
        this.arrowUp = false
        this.arrowDown = false
        this.pgUp = false
        this.pgDown = false
        this.shift = false
        this.ctrl = false
        // mouse flags
        this.rButton = false
        this.lButton = false
        this.mouseWheel = 0
        this.mouseX = 0
        this.mouseY = 0
        this.lMouseDeltaX = 0
        this.lMouseDeltaY = 0
        this.rMouseDeltaX = 0
        this.rMouseDeltaY = 0
    }
}

export function control() { return new _control() }
