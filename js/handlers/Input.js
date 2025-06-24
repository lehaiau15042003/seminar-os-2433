'use strict'

import { renderTable } from "./render.js";

export function pageInputFunc(pageInput, pageDisplay, pages, indexDisplay,renderPages, renderIndex) {
    pageInput.addEventListener('input', () => {
        let value = parseInt(pageInput.value, 10);
        if(!isNaN(value)){
            pages.push(value);
            renderPages(pages, pageDisplay);
            pageInput.value = '';
        }
        renderIndex(pages, indexDisplay);
    });

    pageInput.addEventListener('keydown', (e) => {
        if(e.key === 'Backspace' && pageInput.value === '') {
            pages.pop();
            renderPages(pages, pageDisplay);
            renderIndex(pages, indexDisplay);
        }
    });
}


export function frameInputFunc(frameInput, frameDisplay, renderFrame, bitDisplay, renderBit) {
    frameInput.addEventListener('input', () => {
        let value = parseInt(frameInput.value, 10);
        if(!isNaN(value) && value > 0){
            renderFrame(value,frameDisplay);
            renderBit(value, bitDisplay);
            frameInput.value = '';
        }
    });
}

export function queueInputFunc(queueInput, drawLineInstance) {
    queueInput.addEventListener('keydown', (e) => {
        if(e.key === ' ' ) {
            e.preventDefault();
            let queueValue = queueInput.value.trim();
            if(queueValue !== '') {
                queueInput.value = queueValue + ', ';
            }
        }
    });

    queueInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            let queueValue = queueInput.value.trim();
            if(queueValue !== '' ) {
                let numbers = queueValue.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
                drawLineInstance.clear();
                numbers.forEach(track => {
                    drawLineInstance.request.push(track);
                });
                drawLineInstance.draw();
            }
        }
    });
}

export function headInputFunc(headInput, drawLineInstance) {
    headInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            let input = headInput.value.trim();
            if(input === '') return;
            let headStart = parseInt(input, 10);
            if(isNaN(headStart)) return;
            drawLineInstance.setHeadStart(headStart);
        }     
    });
}

export function processInputFunc(burstInput, arrivalInput, processDisplay) {
    let burstTimes = [];
    let arrivalTimes = [];
    burstInput.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            let burstValue = burstInput.value.trim();
            if (burstValue !== '') {
                burstInput.value = burstValue + ', ';
            }
        }
    });

    arrivalInput.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            let arrivalValue = arrivalInput.value.trim();
            if (arrivalValue !== '') {
                arrivalInput.value = arrivalValue + ', ';
            }
        }
    });

    burstInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            burstTimes = burstInput.value
                .split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n));

            renderTable(burstTimes, arrivalTimes, processDisplay);
        }
    });

    arrivalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            arrivalTimes = arrivalInput.value
                .split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n));

            renderTable(burstTimes, arrivalTimes, processDisplay);
        }
    });
}