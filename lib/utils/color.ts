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

    constructor(color: string | number | number[]) {
        if (!isNaN(Number(color))) {
            color = Number(color);

            this.r = (color >> 16) & 255;
            this.g = (color >>  8) & 255;
            this.b = (color >> 0) & 255;
            this.a = ((color >> 24) & 255);
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

    /**
     * Parse a colour attribute as ATAK does: a signed 32bit ARGB integer,
     * #AARRGGBB, #RRGGBB or a CSS colour name
     */
    static from_attribute(value: string | number): Color {
        if (!isNaN(Number(value))) return new Color(Number(value));

        const hex = String(value).replace(/^#/, '');

        if (/^[0-9a-f]{8}$/i.test(hex)) {
            return new Color([0, 2, 4, 6].map((i) => parseInt(hex.slice(i, i + 2), 16)));
        } else if (/^[0-9a-f]{6}$/i.test(hex)) {
            return new Color([255, ...[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))]);
        }

        const color = new Color(String(value));
        color.a = Math.round(color.a * 255);
        return color;
    }

    as_hex(): string {
        return _color({
            r: this.r,
            g: this.g,
            b: this.b,
         }).hex();
    }

    as_hexa(): string {
        return _color({
            r: this.r,
            g: this.g,
            b: this.b,
            alpha: this.a / 255,
         }).hexa();
    }

    as_kml(): string {
        const a = Math.round(this.a).toString(16).padStart(2, '0');
        const b = Math.round(this.b).toString(16).padStart(2, '0');
        const g = Math.round(this.g).toString(16).padStart(2, '0');
        const r = Math.round(this.r).toString(16).padStart(2, '0');

        return `${a}${r}${g}${b}`.toUpperCase();
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
