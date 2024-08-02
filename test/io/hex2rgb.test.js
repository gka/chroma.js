import { describe, it, expect } from 'vitest';
import hex2rgb from '../../src/io/hex/hex2rgb.js';

describe('Testing HEX2RGB color conversions', () => {
    const testCases = {
        'parse simple #rrggbb HEX colors': [
            '#000000',
            '#ffffff',
            '#ff0000',
            '#00ff00',
            '#0000ff',
            '#ffff00',
            '#00ffff',
            '#ff00ff'
        ],
        'parse simple rrggbb HEX colors without #': [
            '000000',
            'ffffff',
            'ff0000',
            '00ff00',
            '0000ff',
            'ffff00',
            '00ffff',
            'ff00ff'
        ],
        'parse simple short-hand HEX colors': [
            '#000',
            '#fff',
            '#f00',
            '#0f0',
            '#00f',
            '#ff0',
            '#0ff',
            '#f0f'
        ],
        'parse simple short-hand HEX colors without #': [
            '000',
            'fff',
            'f00',
            '0f0',
            '00f',
            'ff0',
            '0ff',
            'f0f'
        ],
        'parse different #rrggbbaa HEX colors': [
            '#00000000',
            '#ffffff80',
            '#ff000040',
            '#00FF00C0',
            '#FF00FFFF'
        ],
        'parse different rrggbbaa HEX colors without #': [
            '00000000',
            'ffffff80',
            'ff000040',
            '00FF00C0',
            'FF00FFFF'
        ],
        'parse different #rgba HEX colors': [
            '#0000',
            '#fff8',
            '#f004',
            '#0F0C',
            '#F0FF'
        ],
        'parse different rgba HEX colors without #': [
            '0000',
            'fff8',
            'f004',
            '0F0C',
            'F0FF'
        ]
    };

    const expectedResults = {
        'parse simple #rrggbb HEX colors': [
            [0, 0, 0, 1],
            [255, 255, 255, 1],
            [255, 0, 0, 1],
            [0, 255, 0, 1],
            [0, 0, 255, 1],
            [255, 255, 0, 1],
            [0, 255, 255, 1],
            [255, 0, 255, 1]
        ],
        'parse simple rrggbb HEX colors without #': [
            [0, 0, 0, 1],
            [255, 255, 255, 1],
            [255, 0, 0, 1],
            [0, 255, 0, 1],
            [0, 0, 255, 1],
            [255, 255, 0, 1],
            [0, 255, 255, 1],
            [255, 0, 255, 1]
        ],
        'parse simple short-hand HEX colors': [
            [0, 0, 0, 1],
            [255, 255, 255, 1],
            [255, 0, 0, 1],
            [0, 255, 0, 1],
            [0, 0, 255, 1],
            [255, 255, 0, 1],
            [0, 255, 255, 1],
            [255, 0, 255, 1]
        ],
        'parse simple short-hand HEX colors without #': [
            [0, 0, 0, 1],
            [255, 255, 255, 1],
            [255, 0, 0, 1],
            [0, 255, 0, 1],
            [0, 0, 255, 1],
            [255, 255, 0, 1],
            [0, 255, 255, 1],
            [255, 0, 255, 1]
        ],
        'parse different #rrggbbaa HEX colors': [
            [0, 0, 0, 0],
            [255, 255, 255, 0.5],
            [255, 0, 0, 0.25],
            [0, 255, 0, 0.75],
            [255, 0, 255, 1]
        ],
        'parse different rrggbbaa HEX colors without #': [
            [0, 0, 0, 0],
            [255, 255, 255, 0.5],
            [255, 0, 0, 0.25],
            [0, 255, 0, 0.75],
            [255, 0, 255, 1]
        ],
        'parse different #rgba HEX colors': [
            [0, 0, 0, 0],
            [255, 255, 255, 0.53],
            [255, 0, 0, 0.27],
            [0, 255, 0, 0.8],
            [255, 0, 255, 1]
        ],
        'parse different rgba HEX colors without #': [
            [0, 0, 0, 0],
            [255, 255, 255, 0.53],
            [255, 0, 0, 0.27],
            [0, 255, 0, 0.8],
            [255, 0, 255, 1]
        ]
    };

    for (const [testName, hexColors] of Object.entries(testCases)) {
        it(testName, () => {
            const results = expectedResults[testName];
            hexColors.forEach((color, index) => {
                expect(hex2rgb(color)).toEqual(results[index]);
            });
        });
    }
});
