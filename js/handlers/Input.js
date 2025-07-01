'use strict'

import { renderTableCPU, renderTablecpuIO } from "./render.js";

export function pageInputFunc(pageInput, pageDisplay, pages, indexDisplay,renderPages, renderIndex) {
    pageInput.addEventListener('input', () => {
        let value = parseInt(pageInput.value);
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
        let value = parseInt(frameInput.value);
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
                let numbers = queueValue.split(',').map(num => parseInt(num));
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
            let headStart = parseInt(input);
            drawLineInstance.setHeadStart(headStart);
        }     
    });
}

export function trackMaxInputFunc(trackMaxInput, drawLineInstance) {
    trackMaxInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            let input = trackMaxInput.value.trim();
            if(input === '') return;
            let trackMax = parseInt(input);
            drawLineInstance.setTrackMax(trackMax);
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

            renderTableCPU(burstTimes, arrivalTimes, processDisplay);
        }
    });

    arrivalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            arrivalTimes = arrivalInput.value
                .split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n));

            renderTableCPU(burstTimes, arrivalTimes, processDisplay);
        }
    });
}

export function quantumInputFunc(quantumInput, quantumDisplay) {
    quantumInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            let quantum = parseInt(quantumInput.value);
            if(!isNaN(quantum) && quantum > 0) {
                quantumInput.value = quantum;
                quantumDisplay.innerText = `Quantum: ${quantum}`;
                quantumDisplay.style.display = 'block';
            }
        }
    });
}

export function quantumInputIOFunc(quantumInputIO, quantumDisplay) {
    quantumInputIO.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            let quantum = parseInt(quantumInputIO.value);
            if(!isNaN(quantum) && quantum > 0) {
                quantumInputIO.value = quantum;
                quantumDisplay.innerText = `Quantum: ${quantum}`;
                quantumDisplay.style.display = 'block';
            }
        }
    });
}

export function processInputIOFunc(burstInputIO, arrivalInputIO, IOUsingInput, burstTimeList, arrivalTimeIO, IOUsing, processDisplay) {
    burstInputIO.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            let burstValue = burstInputIO.value.trim();
            if (burstValue !== '') {
                burstInputIO.value = burstValue + ', ';
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            let burstTimes = burstInputIO.value
                .split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n));

            burstTimeList.push(burstTimes);
            renderTablecpuIO(burstTimeList, arrivalTimeIO, IOUsing, processDisplay);
            burstInputIO.value = '';
        }
    });

    arrivalInputIO.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            let arrivalValue = arrivalInputIO.value.trim();
            if (arrivalValue !== '') {
                arrivalInputIO.value = arrivalValue + ', ';
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            let values = arrivalInputIO.value
                .split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n));

            arrivalTimeIO.length = 0;
            arrivalTimeIO.push(...values);
            renderTablecpuIO(burstTimeList, arrivalTimeIO, IOUsing, processDisplay);
            arrivalInputIO.value = '';
        }
    });

    IOUsingInput.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            let IOValue = IOUsingInput.value.trim();
            if (IOValue !== '') {
                IOUsingInput.value = IOValue + ', ';
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const values = IOUsingInput.value
                .split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n));

            IOUsing.length = 0;
            IOUsing.push(...values);

            renderTablecpuIO(burstTimeList, arrivalTimeIO, IOUsing, processDisplay);
            IOUsingInput.value = '';
        }
    });
}


export function numberInputIOFunc(numberInputIO, numberIODisplay) {
    numberInputIO.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            let number = numberInputIO.value.trim();
            if(number > 0) {
                numberInputIO.value = number;
                numberIODisplay.innerText = `Number I/O: ${number}`;
                numberIODisplay.style.display = 'block';
            }
        }
    });
}