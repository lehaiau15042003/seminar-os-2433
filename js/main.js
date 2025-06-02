'use strict'

import { renderPages, renderFrame, renderSteps } from './handlers/render.js'
import { runAlgorithms } from './handlers/Algorithms.js';
import { pageInputFunc, frameInputFunc } from './handlers/Input.js';

let pages = [];
window.onload = function() {
    const pageInput = document.querySelector('.pageInput');
    const pageDisplay = document.querySelector('.page');
    const frameInput = document.querySelector('.frameInput');
    const algorithmsSelect = document.querySelector('.pageReplacement');
    const frameDisplay = document.querySelector('.frame');
    const runbtn = document.getElementById('run-btn');

    pageInputFunc(pageInput, pageDisplay, pages, renderPages);
    frameInputFunc(frameInput, frameDisplay, renderFrame);

    runbtn.addEventListener('click', () => {
        const frameSize = parseInt(frameInput.value || frameDisplay.childElementCount, 10);
        const algorithms = algorithmsSelect.value;
        const result = runAlgorithms(pages, frameSize, algorithms);
        renderSteps(result.steps, frameSize, frameDisplay, 500);
    });
}