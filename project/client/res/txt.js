import { globalGL } from "../main.js"

class _texture {
    constructor(fileName) {
        this.glId = globalGL.createTexture();

        this.image = new Image();
        this.image.onload = () => {
            globalGL.bindTexture(globalGL.TEXTURE_2D, this.glId);
            globalGL.texImage2D(globalGL.TEXTURE_2D, 0, globalGL.RGBA, globalGL.RGBA, globalGL.UNSIGNED_BYTE, this.image);

            globalGL.texParameteri(globalGL.TEXTURE_2D, globalGL.TEXTURE_MIN_FILTER, globalGL.NEAREST);
            globalGL.texParameteri(globalGL.TEXTURE_2D, globalGL.TEXTURE_MAG_FILTER, globalGL.LINEAR);
        }
        this.image.src = fileName;
    }
}

export function texture(fileName) {
    return new _texture(fileName)
}
