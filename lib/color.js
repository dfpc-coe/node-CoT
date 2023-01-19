import _color from 'color';

/**
 * Helper functions for working with CoT Colours
 *
 * @param {Number|Number[]} color 32bit packged ARGB or [A, R, G, B]
 * @class
 */
export default class Color {
    constructor(color) {
        if (!isNaN(Number(color))) {
             this.r = (color >> 16) & 255
             this.g = (color >>  8) & 255
             this.b = (color >> 0) & 255
             this.a = ((color >> 24) & 255) / 255;
        } else if (Array.isArray(color)) {
            this.a = color[0];
            this.r = color[1];
            this.g = color[2];
            this.b = color[3];
        } else {
            const c = _color(color);

            this.a = c.valpha;
            this.r = c.color[0];
            this.g = c.color[1];
            this.b = c.color[2];
        }
    }

    as_32bit() {
        return (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
    }

    as_opacity() {
        return this.a;
    }

    as_argb() {
        return [this.a, this.r, this.b, this.g];
    }

    as_rgb() {
        return [this.r, this.b, this.g];
    }
}
