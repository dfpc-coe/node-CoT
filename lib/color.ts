import _color from 'color';

/**
 * Helper functions for working with CoT Colours
 *
 * @param {Number|Number[]} color 32bit packged ARGB or [A, R, G, B]
 * @class
 */
export default class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(color: number | number[]) {
        if (!isNaN(Number(color))) {
            color = Number(color);

            this.r = (color >> 16) & 255;
            this.g = (color >>  8) & 255;
            this.b = (color >> 0) & 255;
            this.a = ((color >> 24) & 255) / 255;
        } else if (Array.isArray(color)) {
            this.a = color[0];
            this.r = color[1];
            this.g = color[2];
            this.b = color[3];
        } else {
            const c = _color(color);

            this.a = c.alpha();
            this.r = c.red();
            this.g = c.green();
            this.b = c.blue();
        }
    }

    as_32bit(): number {
        return (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
    }

    as_opacity(): number {
        return this.a;
    }

    as_argb(): number[] {
        return [this.a, this.r, this.b, this.g];
    }

    as_rgb(): number[] {
        return [this.r, this.b, this.g];
    }
}
