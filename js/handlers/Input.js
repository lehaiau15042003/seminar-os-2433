'use strict'

import { runAlgorithms } from "./Algorithms.js";

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

export function processInputFunc(burstInput, processDisplay, drawLineInstance, getSelectedAlgorithm) {
    burstInput.addEventListener('keydown', (e) => {
        if(e.key === ' ') {
            e.preventDefault();
            let processValue = burstInput.value.trim();
            if(processValue !== '') {
                burstInput.value = processValue + ', ';
            }
        }
    });

    burstInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            let processValue = burstInput.value.trim();
            let burstTime = processValue.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            drawLineInstance.setDataBurstTime(burstTime);

            let table = document.createElement('table');
            table.className = 'table-process';

            let header = table.insertRow();
            ['Tiến trình (Process)', 'Thời gian đến (Arrival time)', 'Thời gian cần CPU (Burst time)'].forEach(text => {
                let th = document.createElement('th');
                th.innerText = text;
                header.appendChild(th);
            });

            burstTime.forEach((bt, i) => {
                let row = table.insertRow();
                [`P${i + 1}`, i, bt].forEach(val => {
                    let td = row.insertCell();
                    td.innerText = val;
                });
            });

            processDisplay.innerHTML = '';
            processDisplay.appendChild(table);
        }
    });
}