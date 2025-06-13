'use strict'

import { renderPages, renderFrame, renderSteps, renderBit, renderIndex } from './handlers/render.js'
import { runAlgorithms } from './handlers/algorithms.js';
import { pageInputFunc, frameInputFunc, queueInputFunc, headInputFunc } from './handlers/input.js';
import drawLine from './handlers/drawLine.js';

let pages = [];
window.onload = function() {
    const DOM = {
        pageInput: document.getElementById('pageInput'),
        pageDisplay: document.getElementById('page'),
        frameInput: document.getElementById('frameInput'),
        frameDisplay: document.getElementById('frame'),
        indexDisplay: document.getElementById('index'),
        bitDisplay: document.getElementById('bit'),
        queueInput: document.getElementById('queueInput'),
        headInput: document.getElementById('headInput'),
        algorithmsSelect: document.querySelector('.pageReplacement'),
        runbtn: document.getElementById('run-btn'),
        drawLineInstance: drawLine('myCanvas'),
    }

    pageInputFunc(DOM.pageInput, DOM.pageDisplay, pages, DOM.indexDisplay,renderPages, renderIndex);
    frameInputFunc(DOM.frameInput, DOM.frameDisplay, renderFrame, DOM.bitDisplay, renderBit);
    queueInputFunc(DOM.queueInput, DOM.drawLineInstance);
    headInputFunc(DOM.headInput, DOM.drawLineInstance);

    DOM.runbtn.addEventListener('click', () => {
        const frameSize = parseInt(DOM.frameInput.value || DOM.frameDisplay.childElementCount, 10);
        const algorithms = DOM.algorithmsSelect.value;
        const result = runAlgorithms(pages, frameSize, algorithms);
        renderSteps(algorithms, result.steps, frameSize, DOM.frameDisplay, DOM.bitDisplay, 500);
    });
}
