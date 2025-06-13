'use strict'

import { renderPages, renderFrame, renderSteps, renderBit, renderIndex } from './handlers/render.js'
import { runAlgorithms } from './handlers/algorithms.js';
import { pageInputFunc, frameInputFunc, queueInputFunc, headInputFunc } from './handlers/input.js';
import drawLine from './handlers/drawLine/drawLine.js';

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
        runbtn: document.getElementById('run-btn'),
        algorithmsSelect: document.querySelector('.pageReplacement'),
        drawLineInstance: drawLine('myCanvas'),
    }

    pageInputFunc(DOM.pageInput, DOM.pageDisplay, pages, DOM.indexDisplay,renderPages, renderIndex);
    frameInputFunc(DOM.frameInput, DOM.frameDisplay, renderFrame, DOM.bitDisplay, renderBit);
    queueInputFunc(DOM.queueInput, DOM.drawLineInstance);
    headInputFunc(DOM.headInput, DOM.drawLineInstance);

    let selectedAlgorithm = null;
    DOM.runbtn.addEventListener('click', () => {
        const frameSize = parseInt(DOM.frameInput.value || DOM.frameDisplay.childElementCount, 10);
        const algorithms = selectedAlgorithm;
        const result = runAlgorithms(pages, frameSize, algorithms);
        renderSteps(algorithms, result.steps, frameSize, DOM.frameDisplay, DOM.bitDisplay, 500);
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').substring(1);
            const section = document.getElementById(id);
            if(section) {
                document.querySelectorAll('.pageReplacement section').forEach(sec => {
                    sec.classList.remove('selected');
                });
                section.classList.add('selected');
                selectedAlgorithm = section.dataset.value;
            }
        });
    });
}
