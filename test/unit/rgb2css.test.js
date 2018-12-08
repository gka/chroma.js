const vows = require('vows')
const assert = require('assert');
require('es6-shim');

const rgb2css = require('../../src/converter/out/rgb2css');

const tests = {
    black: { rgb: [0,0,0], css: 'rgb(0,0,0)' },
    red: { rgb: [255,0,0], css: 'rgb(255,0,0)' },
    auto_rgba: { rgb: [255,0,0,0.25], css: 'rgba(255,0,0,0.25)' },
    force_rgba: { rgb: [255,0,0], mode:'rgba', css: 'rgba(255,0,0,1)' },
    hsl: { rgb: [255,0,0], mode:'hsl', css: 'hsl(0,100%,50%)' },
    auto_hsla: { rgb: [255,0,0,0.5], mode:'hsl', css: 'hsla(0,100%,50%,0.5)' },
    force_hsla: { rgb: [255,255,0,0.75], mode:'hsl', css: 'hsla(60,100%,50%,0.75)' },
    // white: { rgb:[255,255,255,1], css: 'rgb(255,255,255)' },
    // white_alpha: { rgb:[255,255,255,0.5], css: 'rgba(255,255,255,0.5)' },
    // hsl: { rgb:[0,0,255,0.5], css: 'hsl(240,100%,50%)', mode:'hsl' },
    // 'hsl(240,100%,50%) ': [0,0,255,1],
    // 'hsl(60,100%,50%)': [255,255,0,1],
    // 'hsla(180,100%,50%,1)': [0,255,255,1],
    // 'hsla(300,100%,50%,.25)': [255,0,255,0.25],
    // blanchedalmond: [255,235,205,1],
    // blue: [0,0,255,1],
    // blueviolet: [138,43,226,1],
    // brown: [165,42,42,1],
};

const batch = {};

Object.keys(tests).forEach(key => {
    batch[key] = {
        topic: tests[key],
        array(topic) {
            assert.equal(rgb2css(topic.rgb, topic.mode || 'rgb'), topic.css);
        },
        obj(topic) {
            let [r,g,b] = topic.rgb;
            let obj = {r,g,b,...(topic.rgb.length>3 ? {a:topic.rgb[3]}:{})};
            assert.equal(rgb2css(obj, topic.mode), topic.css);
        }
    }
});

vows
    .describe('Testing rgb2css color conversions')
    .addBatch(batch)
    .export(module);
