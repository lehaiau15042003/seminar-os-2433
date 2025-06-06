'use strict'

import { renderPages, renderFrame, renderSteps, renderBit, renderIndex } from './handlers/render.js'
import { runAlgorithms } from './handlers/Algorithms.js';
import { pageInputFunc, frameInputFunc } from './handlers/Input.js';

let pages = [];
let index = [];
window.onload = function() {
    const pageInput = document.getElementById('pageInput');
    const pageDisplay = document.getElementById('page');
    const frameInput = document.getElementById('frameInput');
    const frameDisplay = document.getElementById('frame');
    const indexDisplay = document.getElementById('index');
    const bitDisplay = document.getElementById('bit');
    const algorithmsSelect = document.querySelector('.pageReplacement');
    const runbtn = document.getElementById('run-btn');

    pageInputFunc(pageInput, pageDisplay, pages, indexDisplay, index,renderPages, renderIndex);
    frameInputFunc(frameInput, frameDisplay, renderFrame, bitDisplay, renderBit);

    runbtn.addEventListener('click', () => {
        const frameSize = parseInt(frameInput.value || frameDisplay.childElementCount, 10);
        const algorithms = algorithmsSelect.value;
        const result = runAlgorithms(pages, frameSize, algorithms);
        renderSteps(algorithms, result.steps, frameSize, frameDisplay, bitDisplay, 500);
    });
}
