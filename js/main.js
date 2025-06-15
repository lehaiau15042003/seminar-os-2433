'use strict'

import { renderPages, renderFrame, renderPageSteps, renderBit, renderIndex, renderDiskSteps } from './handlers/render.js'
import { runAlgorithms } from './handlers/algorithms.js';
import { pageInputFunc, frameInputFunc, queueInputFunc, headInputFunc } from './handlers/input.js';
import drawLine from './handlers/drawLine/drawLine.js';

let pages = [];
let selectedAlgorithm = null;
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

    DOM.runbtn.addEventListener('click', () => {
        const frameSize = parseInt(DOM.frameInput.value || DOM.frameDisplay.childElementCount, 10);
        const headStart = parseInt(DOM.headInput.value);
        const queue = (DOM.queueInput.value).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const result = runAlgorithms({pages, frameSize, queue, headStart, algorithms: selectedAlgorithm});
        //renderPageSteps(selectedAlgorithm, result.steps, frameSize, DOM.frameDisplay, DOM.bitDisplay, 500);
        renderDiskSteps(result.path, 'myCanvas', DOM.drawLineInstance, queue);
        console.log('Algorithm:', selectedAlgorithm); 
        console.log('Result:', result);
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            const id = link.getAttribute('href').substring(1);
            const section = document.getElementById(id);
            const disk = document.getElementById('disk');
            if(section) {
                document.querySelectorAll('.algorithms-container section').forEach(sec => {
                    sec.classList.remove('selected');
                });
                section.classList.add('selected');
                selectedAlgorithm = section.dataset.value;

                const diskAlgorithms = ['fcfs', 'srtf', 'scan', 'cscan', 'look', 'clook'];
                if(diskAlgorithms.includes(id.toLowerCase())) {
                    disk.style.display = 'block';
                }else {
                    disk.style.display = 'none';
                }
            }
        });
    });
}
