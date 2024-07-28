const { PI, min, max } = Math;

export { default as clip_rgb } from './clip_rgb.js';
export { default as limit } from './limit.js';
export { default as type } from './type.js';
export { default as unpack } from './unpack.js';
export { default as last } from './last.js';

const TWOPI = PI * 2;
const PITHIRD = PI / 3;
const DEG2RAD = PI / 180;
const RAD2DEG = 180 / PI;

export { PI, TWOPI, PITHIRD, DEG2RAD, RAD2DEG, min, max };
