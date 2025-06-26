'use strict'

import { renderPages, renderFrame, renderPageSteps, renderBit, renderIndex, renderDiskSteps, renderProcessSteps, renderReadyQueueFCFS, renderReadyQueue , renderResult, renderResult2, renderProcessStepsFCFS, renderReadyQueueSJF, renderReadyQueueSRTF} from './handlers/render.js'
import { runAlgorithms } from './handlers/Algorithms.js'
import { pageInputFunc, frameInputFunc, queueInputFunc, headInputFunc, processInputFunc, quantumInputFunc } from './handlers/Input.js'
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
        arrivalInput: document.getElementById('arrivalInput'),
        quantumInput: document.getElementById('quantumInput'),
        quantumDisplay: document.getElementById('quantum'),
        directionInput: document.getElementById('directionInput'),
        readyQueueDisplay: document.getElementById('ready-queue'),
        resultDisplay: document.getElementById('result'),
        runbtn: document.getElementById('run-btn'),
        algorithmsSelect: document.querySelector('.pageReplacement'),
        inputContainer: document.querySelector('.input-container'),
        inputGroupPage: document.querySelector('.input-group.page'),
        inputGroupDisk: document.querySelector('.input-group.disk'),
        inputGroupProcess: document.querySelector('.input-group.process'),
    }

    pageInputFunc(DOM.pageInput, DOM.pageDisplay, pages, DOM.indexDisplay,renderPages, renderIndex);
    frameInputFunc(DOM.frameInput, DOM.frameDisplay, renderFrame, DOM.bitDisplay, renderBit);
    queueInputFunc(DOM.queueInput, drawLineInstance);
    headInputFunc(DOM.headInput, drawLineInstance);
    processInputFunc(DOM.burstInput, DOM.arrivalInput, DOM.processDisplay);
    quantumInputFunc(DOM.quantumInput, DOM.quantumDisplay);

    DOM.runbtn.addEventListener('click', () => {
        let frameSize = parseInt(DOM.frameInput.value || DOM.frameDisplay.childElementCount, 10);
        let headStart = parseInt(DOM.headInput.value);
        let queue = (DOM.queueInput.value).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        let direction = DOM.directionInput.value;
        let burstTime = (DOM.burstInput.value).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        let arrivalTime = (DOM.arrivalInput.value).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        let quantum = parseInt(DOM.quantumInput.value);
        const minTrack = 0;
        const maxTrack = 199;
        let result = runAlgorithms({pages, frameSize, queue, headStart, direction, minTrack, maxTrack, burstTime, arrivalTime, quantum, algorithms: selectedAlgorithm});

        const pageAlgorithms = ['FIFO', 'LRU' ,'OPTIMAL', 'CLOCK'];
        const diskAlgorithms = ['FCFS_disk', 'SSTF', 'SCAN', 'CSCAN', 'LOOK', 'CLOOK'];
        const processAlgorithms = ['FCFS_process', 'SJF', 'SRTF', 'RR'];

        if(pageAlgorithms.includes(selectedAlgorithm)) {
            renderPageSteps(selectedAlgorithm, result.steps, frameSize, DOM.frameDisplay, DOM.bitDisplay, 500);
        }else if(diskAlgorithms.includes(selectedAlgorithm)) {
            renderDiskSteps(result.path, 'myCanvas', drawLineInstance, queue, 700);
        }else if(processAlgorithms.includes(selectedAlgorithm)) {
            if(selectedAlgorithm === 'FCFS_process') {
                renderProcessStepsFCFS(result.steps, 'myCanvas', drawLineInstance, burstTime, arrivalTime, 500);
                renderReadyQueueFCFS(result.timeLine, DOM.readyQueueDisplay, burstTime, 500);
                renderResult(result.waitingTimes, result.turnaroundTimes, DOM.resultDisplay);
            }else if(selectedAlgorithm === 'SJF') {
                renderProcessStepsFCFS(result.steps, 'myCanvas', drawLineInstance, burstTime, arrivalTime, 500);
                renderReadyQueueSJF(result.timeLine, DOM.readyQueueDisplay, burstTime, 500);
                renderResult(result.waitingTimes, result.turnaroundTimes, DOM.resultDisplay);
            }else if(selectedAlgorithm === 'SRTF') {
                renderProcessSteps(result.steps, 'myCanvas', drawLineInstance, burstTime, arrivalTime, 500);
                renderReadyQueueSRTF(result.timeLine, DOM.readyQueueDisplay, burstTime, 500);
                renderResult2(result.waitingTimes, result.turnaroundTimes, result.responseTimes, DOM.resultDisplay);
            }else {
                renderProcessSteps(result.steps, 'myCanvas', drawLineInstance, burstTime, arrivalTime, 500);
                renderReadyQueue(result.timeLine, DOM.readyQueueDisplay, burstTime, 500);
                renderResult2(result.waitingTimes, result.turnaroundTimes, result.responseTimes, DOM.resultDisplay);
            }
        }
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
                let algoDisplay = document.getElementById('select-algo');
                algoDisplay.textContent = `${link.textContent}-Algorithm`;
                algoDisplay.classList.remove('active');
                requestAnimationFrame(() => {
                    algoDisplay.classList.add('active');
                });

                let pageId = ['fifo', 'lru', 'optimal', 'clock'];
                let diskId = ['fcfs_disk', 'sstf', 'scan', 'cscan', 'look', 'clook'];
                let processId = ['fcfs_process', 'sjf', 'srtf', 'rr'];

                document.querySelectorAll('.input-group').forEach(group => {
                    group.style.display = 'none';
                });

                if(diskId.includes(id)) {
                    DOM.inputGroupDisk.style.display = 'block';
                    DOM.inputContainer.style.display = 'block';
                    canvas.style.display = 'block';
                }else if(processId.includes(id)){
                    DOM.inputGroupProcess.style.display = 'block';
                    DOM.inputContainer.style.display = 'block';
                    canvas.style.display = 'block';
                }else if(pageId.includes(id)){
                    DOM.inputGroupPage.style.display = 'block';
                    DOM.inputContainer.style.display = 'block';
                    canvas.style.display = 'none';
                }else {
                    canvas.style.display = 'none';
                }
                
            }
        });
    });
}
