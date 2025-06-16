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

export function renderPageSteps(algorithms, steps, frameSize, frameDisplay, bitDisplay, speed = 500) {
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

export function renderDiskSteps(steps, canvasId, drawLineInstance, queue, speed = 700) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const margin = 100;
    const minTrack = Math.min(...queue);
    const maxTrack = Math.max(...queue);
    const xScale = (width - 2 * margin) / (maxTrack - minTrack || 1);
    const yStep = (height - 2 * margin) / (steps.length - 1 || 1);
    ctx.lineWidth = 2;
    let currentStep = 0;
    function showStep() {
        if(currentStep >= steps.length - 1) {
            const lastX = margin + (steps[steps.length - 1] - minTrack) * xScale;
            const lastY = margin + (steps.length - 1) * yStep;
            ctx.font = '12px Arial';
            ctx.fillStyle = '#333';
            let offsetX = 10, offsetY = -10;
            if (steps.length >= 2) {
                const prevX = margin + (steps[steps.length - 2] - minTrack) * xScale;
                const dx = lastX - prevX;
                offsetX = dx >= 0 ? 8 : -20;
                offsetY = -20;
            }
            ctx.fillText(steps[steps.length - 1], lastX + offsetX, lastY + offsetY);
            return;
        }
        const x1 = margin + (steps[currentStep] - minTrack) * xScale;
        const y1 = margin + currentStep * yStep;
        const x2 = margin + (steps[currentStep + 1] - minTrack) * xScale;
        const y2 = margin + (currentStep + 1) * yStep;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLength = 10;
        const arrowX1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
        const arrowY1 = y2 - headLength * Math.sin(angle - Math.PI / 6);
        const arrowX2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
        const arrowY2 = y2 - headLength * Math.sin(angle + Math.PI / 6);

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(arrowX1, arrowY1);
        ctx.lineTo(arrowX2, arrowY2);
        ctx.lineTo(x2, y2);
        ctx.fillStyle = '#000';
        ctx.fill();

        ctx.font = '12px Arial';
        let offsetX = (x2 - x1) >= 0 ? 8 : -20;
        let offsetY = -20;
        ctx.fillText(steps[currentStep], x1 + offsetX, y1 + offsetY);
        
        currentStep++;
        setTimeout(showStep, speed);
    }
    showStep();
}
