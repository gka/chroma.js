// Type definitions for Chroma.js 2.1
// Project: https://github.com/gka/chroma.js
// Definitions by: Sebastian Brückner <https://github.com/invliD>, Marcin Pacholec <https://github.com/mpacholec>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// forked for chroma-tablekit usage

/**
 * Chroma.js is a tiny library for all kinds of color conversions and color scales.
 */
declare namespace chroma {
  interface ColorSpaces {
    rgb: [number, number, number];
    lab: [number, number, number];
    rgba: [number, number, number, number];
  }

  type InterpolationMode = 'rgb' | 'lab' | 'lrgb';

  interface ColorSpaceKeys {
    'rgb': 'r' | 'g' | 'b';
    'lab': 'l' | 'a' | 'b';
    'rgba': 'r' | 'g' | 'b' | 'a';
  }

  interface ChromaStatic {
    /**
     * Creates a color from a string representation (as supported in CSS).
     * Creates a color from a number representation [0; 16777215]
     *
     * @param color The string to convert to a color.
     * @return the color object.
     */
    (color: string | number | Color): Color;

    /**
     * Create a color in the specified color space using a, b and c as values.
     *
     * @param colorSpace The color space to use. Defaults to "rgb".
     * @return the color object.
     */
    (a: number, b: number, c: number, colorSpace?: keyof ColorSpaces): Color;

    (
      a: number,
      b: number,
      c: number,
      d: number,
      colorSpace?: keyof ColorSpaces
    ): Color;

    /**
     * Create a color in the specified color space using values.
     *
     * @param values An array of values (e.g. [r, g, b, a?]).
     * @param colorSpace The color space to use. Defaults to "rgb".
     * @return the color object.
     */
    (values: number[], colorSpace?: keyof ColorSpaces): Color;

    /**
     * Create a color from a hex or string representation (as supported in CSS).
     *
     * This is an alias of chroma.css().
     *
     * @param color The string to convert to a color.
     * @return the color object.
     */
    hex(color: string): Color;

    valid(color: any, mode?: string): boolean;

    rgb(r: number, g: number, b: number): Color;

    /**
     * Mixes two colors. The mix ratio is a value between 0 and 1.
     * The color mixing produces different results based the color space used for interpolation. Defaults to LRGB.
     * @example chroma.mix('red', 'blue', 0.25) // => #bf0040
     * @example chroma.mix('red', 'blue', 0.5, 'hsl') // => #ff00ff
     */
    mix(
      color1: string | Color,
      color2: string | Color,
      f?: number,
      colorSpace?: InterpolationMode
    ): Color;

    /**
     * Alias for {@see mix}.
     */
    interpolate(
      color1: string | Color,
      color2: string | Color,
      f?: number,
      colorSpace?: InterpolationMode
    ): Color;

    css(col: string): Color;
  }

  interface Color {
    /**
     * Get and set the color opacity.
     */
    alpha(a: number): Color;
    alpha(): number;

    darken(f?: number): Color;

    mix(
      targetColor: string | Color,
      f?: number,
      colorSpace?: keyof ColorSpaces
    ): Color;

    brighten(f?: number): Color;

    /**
     * Changes the saturation of a color by manipulating the Lch chromacity.
     */
    saturate(s?: number): Color;

    /**
     * Similar to saturate, but the opposite direction.
     */
    desaturate(s?: number): Color;

    /**
     * Changes a single channel and returns the result a new chroma object.
     * @example
     * // half Lab lightness
     * chroma('orangered').set('lab.l', '*0.5')
     * @example
     * // double Lch saturation
     * chroma('darkseagreen').set('lch.c', '*2')
     */
    set<ColorSpace extends keyof ColorSpaces>(
      modechan: `${ColorSpace}.${ColorSpaceKeys[ColorSpace]}`,
      v: number | string
    ): Color;

    /**
     * Returns a single channel value.
     * Also @see set
     */
    get<ColorSpace extends keyof ColorSpaces>(
      modechan: `${ColorSpace}.${ColorSpaceKeys[ColorSpace]}`
    ): number;

    /**
     * Relative brightness, according to the
     * [WCAG]{@link http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef} definition. Normalized to
     * 0 for darkest black and 1 for lightest white.
     */
    luminance(): number;

    /**
     * Set luminance of color. The source color will be interpolated with black or white until the correct luminance is found.
     * The color space used defaults to RGB.
     */
    luminance(l: number, colorSpace?: InterpolationMode): Color;

    /**
     * Get color as hexadecimal string.
     *
     * @param mode `auto` - string will include alpha channel only if it's less than 1.
     *             `rgb`  - string will not include alpha channel.
     *             `rgba` - string will include alpha channel.
     *
     * @example
     * chroma('orange').hex() === '#ffa500'
     * chroma('orange').alpha(0.5).hex() === '#ffa50080'
     * chroma('orange').alpha(0.5).hex('rgb') === '#ffa500'
     */
    hex(mode?: 'auto' | 'rgb' | 'rgba'): string;

    /**
     * Returns a RGB() or HSL() string representation that can be used as CSS-color definition.
     * mode defaults to <code>'rgb'</code>
     */
    css(mode?: 'hsl'): string;

    /**
     * Returns an array with the red, green, and blue component, each as
     * number within the range 0..255. Chroma internally stores RGB
     * channels as floats but rounds the numbers before returning them.
     * You can pass false to prevent the rounding.
     *
     * @example
     * chroma('orange').rgb() === [255,165,0]
     * chroma('orange').darken().rgb() === [198,118,0]
     * chroma('orange').darken().rgb(false) === [198.05,118.11,0]
     */
    rgb: (round?: boolean) => ColorSpaces['rgb'];

    /**
     * Just like color.rgb but adds the alpha channel to the returned array.
     *
     * @example
     * chroma('orange').rgba() === [255,165,0,1]
     * chroma('hsla(20, 100%, 40%, 0.5)').rgba() === [204,68,0,0.5]
     */
    rgba: (round?: boolean) => ColorSpaces['rgba'];
  }
}

declare var chroma: chroma.ChromaStatic;

export = chroma;
export as namespace chroma;
