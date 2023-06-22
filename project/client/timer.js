class _timer {
    constructor() {
        this.isPause = false
        this.startTime = Date.now()
        this.globalTime = 0
        this.deltaTime = 0
        this.timeFromStart = 0
        this.pauseTime = 0
        this.betFramesTime = 0
        this.oldTime = Date.now()
    }

    timeUpdate() {
        this.globalTime = Date.now() - this.startTime
        this.betFramesTime = Date.now() - this.oldTime
        if (this.isPause) {
            this.pauseTime += Date.now() - this.oldTime
            this.deltaTime = 0
        }
        else {
            this.deltaTime = this.globalTime - this.oldTime
            this.timeFromStart = this.globalTime - this.pauseTime
            // this.pauseTime = 0
        }
        this.oldTime = Date.now()
    }
}

export function timer() { return new _timer() }