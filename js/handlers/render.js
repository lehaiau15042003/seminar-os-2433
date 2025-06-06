'use strict'

export function renderPages(pages, pageDisplay){
    pageDisplay.innerHTML = '';
    pages.forEach(p => {
        const span = document.createElement('span');
        span.className = 'page-box';
        span.innerText = p;
        pageDisplay.appendChild(span);
    });
}

export function renderFrame(count, frameDisplay) {
    frameDisplay.innerHTML = '';
    for(let i=0; i < count; i++){
        const div = document.createElement('div');
        div.className = 'frame-rows';
        div.innerText = i + 1;
        frameDisplay.appendChild(div);
    }
}

export function renderIndex(pages, indexDisplay) {
    indexDisplay.innerText = '';
    for(let i = 0; i < pages.length; i++) {
        const div = document.createElement('div');
        div.className = 'index-pages';
        div.innerText = i + 1;
        indexDisplay.appendChild(div);
    }
}

export function renderBit(count, bitDisplay) {
    bitDisplay.innerHTML = '';
    for(let i=0; i < count; i++){
        const div = document.createElement('div');
        div.className = 'bit-rows';
        div.innerHTML = `<span class="bit-value" data-index="${i}">0</span>`;
        bitDisplay.appendChild(div);
    }
}

export function renderSteps(algorithms, steps, frameSize, frameDisplay, bitDisplay, speed = 500) {
    frameDisplay.innerHTML = '';
    bitDisplay.innerHTML = '';
    const frameRows = [];
    const bitRows = [];
    for(let i=0; i < frameSize; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        frameDisplay.appendChild(row);
        frameRows.push(row);
    }

    for(let i=0; i < frameSize; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        bitDisplay.appendChild(row);
        bitRows.push(row);
    }

    let currentStep = 0;
    function showStep() {
        if(currentStep >= steps.length) return;
        const step = steps[currentStep];

        frameRows.forEach((row, i) => {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if(step.frame[i] !== undefined) {   
                if(!step.isFault) {
                    cell.innerText = "|";
                }else {
                    const extra = step.exponentIndex?.[i] !== undefined ? `<sup>${step.exponentIndex[i]}</sup>` : '';
                    cell.innerHTML = `${step.frame[i]}${extra}`;
                }
            }
            if(step.isFault && step.index === i){
                cell.classList.add('fault');
            }

            row.appendChild(cell);
        });

        bitRows.forEach((row, i) => {
            if(algorithms === 'CLOCK') {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.innerText = step.saveBit[i] !== undefined ? step.saveBit[i] : '0';
                if(step.nextPointer === i) {
                    cell.classList.add('pointer');
                }
                row.appendChild(cell);
            }
        });

        currentStep++;
        setTimeout(showStep, speed);
    }
    showStep();
}