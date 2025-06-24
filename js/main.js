'use strict'

import { renderPages, renderFrame, renderPageSteps, renderBit, renderIndex, renderDiskSteps, renderProcessSteps } from './handlers/render.js'
import { runAlgorithms } from './handlers/Algorithms.js'
import { pageInputFunc, frameInputFunc, queueInputFunc, headInputFunc, processInputFunc } from './handlers/Input.js'
import drawLine from './handlers/drawLine.js';

let pages = [];
let selectedAlgorithm = null;
let drawLineInstance = drawLine('myCanvas');
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
        burstInput: document.getElementById('burstInput'),
        processDisplay: document.getElementById('process'),
        directionInput: document.getElementById('directionInput'),
        runbtn: document.getElementById('run-btn'),
        algorithmsSelect: document.querySelector('.pageReplacement'),
    }

    pageInputFunc(DOM.pageInput, DOM.pageDisplay, pages, DOM.indexDisplay,renderPages, renderIndex);
    frameInputFunc(DOM.frameInput, DOM.frameDisplay, renderFrame, DOM.bitDisplay, renderBit);
    queueInputFunc(DOM.queueInput, drawLineInstance);
    headInputFunc(DOM.headInput, drawLineInstance);
    processInputFunc(DOM.burstInput, DOM.processDisplay, drawLineInstance);

    DOM.runbtn.addEventListener('click', () => {
        let frameSize = parseInt(DOM.frameInput.value || DOM.frameDisplay.childElementCount, 10);
        let headStart = parseInt(DOM.headInput.value);
        let queue = (DOM.queueInput.value).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        let direction = DOM.directionInput.value;
        let burstTime = (DOM.burstInput.value).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const minTrack = 0;
        const maxTrack = 199;
        let result = runAlgorithms({pages, frameSize, queue, headStart, direction, minTrack, maxTrack, burstTime, algorithms: selectedAlgorithm});
        renderPageSteps(selectedAlgorithm, result.steps, frameSize, DOM.frameDisplay, DOM.bitDisplay, 500);
        //renderDiskSteps(result.path, 'myCanvas', drawLineInstance, queue, 700);
        // renderProcessSteps(result.steps, 'myCanvas', drawLineInstance, burstTime, 700);
        console.log('Algorithm:', selectedAlgorithm); 
        console.log('Result:', result);
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            const id = link.getAttribute('href').substring(1);
            const section = document.getElementById(id);
            const canvas = document.getElementById('canvas');
            if(section) {
                document.querySelectorAll('.algorithms-container section').forEach(sec => {
                    sec.classList.remove('selected');
                });
                section.classList.add('selected');
                selectedAlgorithm = section.dataset.value;

                const diskAlgorithms = ['fcfs_disk', 'sstf', 'scan', 'cscan', 'look', 'clook'];
                const processAlgorithms = ['fcfs_process', 'sjf', 'srtf', 'rr'];

                if(diskAlgorithms.includes(id)) {
                    drawLineInstance.setAlgo('disk');
                    drawLineInstance.clear();
                    canvas.style.display = 'block';
                }else if(processAlgorithms.includes(id)){
                    drawLineInstance.setAlgo('process');
                    drawLineInstance.clear();
                    canvas.style.display = 'block';
                }else {
                    canvas.style.display = 'none';
                }
                
            }
        });
    });
}
