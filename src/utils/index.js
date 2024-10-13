const { PI, min, max } = Math;

const rnd2 = (a) => Math.round(a * 100) / 100;
const rnd3 = (a) => Math.round(a * 100) / 100;

export { default as clip_rgb } from './clip_rgb.js';
export { default as limit } from './limit.js';
export { default as type } from './type.js';
export { default as unpack } from './unpack.js';
export { default as last } from './last.js';

const TWOPI = PI * 2;
const PITHIRD = PI / 3;
const DEG2RAD = PI / 180;
const RAD2DEG = 180 / PI;

/**
 * Reverse the first three elements of an array
 *
 * @param {any[]} arr
 * @returns {any[]}
 */
function reverse3(arr) {
    return [...arr.slice(0, 3).reverse(), ...arr.slice(3)];
}

export { PI, TWOPI, PITHIRD, DEG2RAD, RAD2DEG, min, max, rnd2, rnd3, reverse3 };
