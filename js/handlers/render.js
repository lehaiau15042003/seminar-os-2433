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
    let margin = 100;
    let minTrack = Math.min(...queue);
    let maxTrack = Math.max(...queue);
    let xScale = (width - 2 * margin) / (maxTrack - minTrack || 1);
    let yStep = (height - 2 * margin) / (steps.length - 1 || 1);
    ctx.clearRect(0, 70, canvas.width, canvas.height);
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

export function renderRequest(ctx, request, headStart, width, height, margin, scaleDisk, trackMax, pathSteps = []) {
    const baselineY = margin;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, baselineY);
    ctx.lineTo(width, baselineY);
    ctx.stroke();
    let spacing = 20;
    const numbers = [];

    if(!request.includes(0)) request.unshift(0);
    if(!request.includes(trackMax)) request.push(trackMax);


    request.forEach(r => {
        const x = margin + r * scaleDisk;
        const y = margin;

        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
        ctx.strokeStyle = 'black';
        ctx.stroke();

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        let offsetX = 0;
        let offsetY = -20;

        for(let i = 0; i < numbers.length; i++) {
            const nums = numbers[i];
            const dx = Math.abs(x - nums.x);
            const dy = Math.abs(y + offsetY - nums.y);;
            if(dx < spacing && dy < 12) {
                offsetX = offsetX === 0 ? 10 : -10;
                offsetY = offsetY === -20 ? 10 : -10;
            }
        }
        ctx.fillStyle = 'black';
        ctx.fillText(r, x + offsetX, y + offsetY);
        numbers.push({
            x: x + offsetX,
            y: y + offsetY
        });
    });

    if (headStart !== null) {
        const x = margin + headStart * scaleDisk;
        const y = baselineY;
        const lineHeight = 10;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - lineHeight);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();
    
        ctx.fillStyle = 'red';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('↓', x, y - lineHeight - 30);
        ctx.fillText(headStart, x, y - lineHeight - 13);
    }
    

    if (pathSteps.length >= 2) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        const yTrack = baselineY + 40;
        for (let i = 0; i < pathSteps.length - 1; i++) {
            const x1 = margin + pathSteps[i] * scaleDisk;
            const x2 = margin + pathSteps[i + 1] * scaleDisk;
            const y1 = yTrack;
            const y2 = yTrack;
    
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
    
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(pathSteps[i], x1 + 5, y1 - 10);
        }
    
        const lastX = margin + pathSteps[pathSteps.length - 1] * scaleDisk;
        const lastY = baselineY;
        ctx.fillText(pathSteps[pathSteps.length - 1], lastX + 5, lastY - 15);
    }
}

export function renderTimeLine(ctx, width, height, margin, scaleProcess, maxTime) {
    const baselineY = margin;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, baselineY);
    ctx.lineTo(width, baselineY);
    ctx.stroke();

    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for(let i = 0; i <= maxTime; i+=2) {
        const x = margin + i * scaleProcess;
        ctx.moveTo(x, baselineY - 5);
        ctx.lineTo(x, baselineY + 5);
        ctx.stroke();
        ctx.fillText(i, x, baselineY - 20);
    }
}

export function renderProcessSteps(steps, canvasId, drawLineInstance, burstTime = [] ,speed) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let margin = 50;
    const rowHeight = 40;
    const rowGap = 20;
    let maxTime = 26;
    let scaleProcess = (width - 2 * margin) / maxTime;
    let currentStep = 0;
    let arrivalTime = burstTime.map((_, i) => i);
    function showStep() {
        if(currentStep >= steps.length) return;
        let step = steps[currentStep];
        let arrival = arrivalTime[currentStep];
        let xStart = margin + step.start * scaleProcess;
        let xEnd = margin + step.end * scaleProcess;
        let y = margin + 45 + currentStep * (rowHeight + rowGap);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xStart, y);
        ctx.lineTo(xEnd, y);
        ctx.stroke();

        let xArrival = margin + arrival * scaleProcess;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.moveTo(xArrival, y - 5);
        ctx.lineTo(xArrival, y + 5);
        ctx.stroke();

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${currentStep}`, xArrival, y - 15);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.moveTo(xStart, y - 5);
        ctx.lineTo(xStart, y + 5);
        ctx.stroke();

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${step.start}`, xStart, y - 15);

        ctx.beginPath();
        ctx.setLineDash([5,5]);
        ctx.lineWidth = 2;
        ctx.moveTo(xArrival, y);
        ctx.lineTo(xStart, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.moveTo(xEnd, y - 5);
        ctx.lineTo(xEnd, y + 5);
        ctx.stroke();

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${step.end}`, xEnd, y - 15);

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('X', xEnd + 10, y);

        currentStep++;
        setTimeout(showStep, speed);
    }
    showStep();
}

export function renderReadyQueue(timeLine, readyQueueDisplay, burstTime = [], speed = 500) {
    readyQueueDisplay.innerHTML = '';

    let span_ready = document.createElement('span');
    span_ready.className = 'ready-label';
    span_ready.innerText = 'Ready: ';
    readyQueueDisplay.appendChild(span_ready);

    let currentStep = 0;
    let set = new Set();

    function showStep() {
        if (currentStep >= timeLine.length) return;

        const { time, running, ready } = timeLine[currentStep];

        let column = document.createElement('div');
        column.className = 'ready-column';

        let timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.innerText = time;
        column.appendChild(timeLabel);

        if (running && !set.has(running)) {
            let runningBox = document.createElement('div');
            runningBox.className = 'process-box running';
            let idx = parseInt(running.substring(1)) - 1;
            runningBox.innerHTML = `P<sub>${idx + 1}</sub><sup>${burstTime[idx]}</sup>`;
            column.appendChild(runningBox);
            set.add(running);
        }

        ready.forEach(p => {
            let readyBox = document.createElement('div');
            readyBox.className = 'process-box';
            let idx = parseInt(p.substring(1)) - 1;
            readyBox.innerHTML = `P<sub>${idx + 1}</sub><sup>${burstTime[idx]}</sup>`;
            column.appendChild(readyBox);
        });
        readyQueueDisplay.appendChild(column);

        currentStep++;
        setTimeout(showStep, speed);
    }

    showStep();
}

export function renderResult(waitingTimes, turnarroundTimes, resultDisplay) {
    let n = waitingTimes.length;
    let totalW = 0;
    let totalT = 0;
    let table = document.createElement('table');
    table.className = 'result-table';

    for(let i = 0; i < n; i++) {
        let row = document.createElement('tr');
        let w = waitingTimes[i];
        let t = turnarroundTimes[i];
        totalW += w;
        totalT += t;

        row.innerHTML = `
            <td>r<sub>${i + 1}</sub> = w<sub>${i + 1}</sub> = ${w}</td>
            <td>t<sub>${i + 1}</sub> = ${t}</td>
        `;
        table.appendChild(row);
    } 

    let avgRow = document.createElement('tr');
    avgRow.innerHTML = `
        <td>w<sub>tb</sub> = ${ (totalW / n).toFixed(2) }</td>
        <td>t<sub>tb</sub> = ${ (totalT / n).toFixed(2) }</td>
    `;
    table.appendChild(avgRow);
    resultDisplay.innerHTML = '';
    resultDisplay.appendChild(table);
    resultDisplay.classList.add('display');
}

export function renderTable(burstTimes, arrivalTimes, processDisplay) {
    const totalProcess = Math.max(burstTimes.length, arrivalTimes.length);
    if (totalProcess === 0) return;
    const table = document.createElement('table');
    table.className = 'table-process';

    const header = table.insertRow();
    ['Process', 'Arrival Time', 'Burst Time'].forEach(title => {
        const th = document.createElement('th');
        th.innerText = title;
        header.appendChild(th);
    });

    for (let i = 0; i < totalProcess; i++) {
        const row = table.insertRow();
        const arrival = arrivalTimes[i] !== undefined ? arrivalTimes[i] : '';
        const burst = burstTimes[i] !== undefined ? burstTimes[i] : '';
        [`P${i + 1}`, arrival, burst].forEach(val => {
            const td = row.insertCell();
            td.innerText = val;
        });
    }

    processDisplay.innerHTML = '';
    processDisplay.appendChild(table);
}