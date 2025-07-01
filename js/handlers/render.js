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

export function renderPageFault(pageFault, pageFaultDisplay) {
    pageFaultDisplay.innerText = `Page Fault: ${pageFault}`;
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
        let step = steps[currentStep];

        frameRows.forEach((row, i) => {
            let cell = document.createElement('div');
            cell.className = 'cell';

            if(step.frame[i] !== undefined) {   
                if(!step.isFault) {
                    cell.innerText = "|";
                }else {
                    let extra = step.exponentIndex?.[i] !== undefined ? `<sup>${step.exponentIndex[i]}</sup>` : '';
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

export function renderDiskSteps(steps, canvasId, queue, speed = 700) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let margin = 100;
    let minTrack = Math.min(...steps);
    let maxTrack = Math.max(...steps);
    let xScale = (width - 2 * margin) / (maxTrack - minTrack);
    let yStep = (height - 2 * margin) / (steps.length - 1);
    ctx.clearRect(0, 70, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    let currentStep = 0;
    function showStep() {
        if(currentStep >= steps.length - 1) {
            let lastX = margin + (steps[steps.length - 1] - minTrack) * xScale;
            let lastY = margin + (steps.length - 1) * yStep;
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
        let x1 = margin + (steps[currentStep] - minTrack) * xScale;
        let y1 = margin + currentStep * yStep;
        let x2 = margin + (steps[currentStep + 1] - minTrack) * xScale;
        let y2 = margin + (currentStep + 1) * yStep;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        let angle = Math.atan2(y2 - y1, x2 - x1);
        let headLength = 10;
        let arrowX1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
        let arrowY1 = y2 - headLength * Math.sin(angle - Math.PI / 6);
        let arrowX2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
        let arrowY2 = y2 - headLength * Math.sin(angle + Math.PI / 6);

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

export function renderDistance(totalMove, distanceDisplay) {
    distanceDisplay.innerText = `Distance: ${totalMove}`;
}


export function renderRequest(ctx, request, headStart, width, height, margin, scaleDisk, trackMax, pathSteps = []) {
    let baselineY = margin;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, baselineY);
    ctx.lineTo(width, baselineY);
    ctx.stroke();
    let spacing = 20;
    let numbers = [];
    request = request.filter(r => r <= trackMax);
    if(!request.includes(0)) {
        request.unshift(0);
    }

    if (!request.includes(trackMax)) {
        request.push(trackMax);
    }

    request.forEach(r => {
        let x = margin + r * scaleDisk;
        let y = margin;

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
        let x = margin + headStart * scaleDisk;
        let y = baselineY;
        let lineHeight = 10;
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
        let yTrack = baselineY + 40;
        for (let i = 0; i < pathSteps.length - 1; i++) {
            let x1 = margin + pathSteps[i] * scaleDisk;
            let x2 = margin + pathSteps[i + 1] * scaleDisk;
            let y1 = yTrack;
            let y2 = yTrack;
    
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
    
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(pathSteps[i], x1 + 5, y1 - 10);
        }
    
        let lastX = margin + pathSteps[pathSteps.length - 1] * scaleDisk;
        let lastY = baselineY;
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

export function renderProcessSteps(steps, canvasId, arrivalTime = [], speed = 500) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const margin = 50;
    const rowHeight = 40;
    const rowGap = 20;

    ctx.clearRect(0, 0, width, height);

    let processSet = new Set();
    steps.forEach(s => {
        if (s.process) processSet.add(s.process);
    });
    let processList = Array.from(processSet).sort();

    let maxTime = Math.max(...steps.map(s => s.end));
    let scale = (width - 2 * margin) / maxTime;

    let lastXEndOfProcess = {};
    let drawnLabel = new Set();

    let currentStep = 0;

    renderTimeLine(ctx, width, height, margin, scale, maxTime);

    function showStep() {
        if (currentStep >= steps.length) return;

        const { process, start, end } = steps[currentStep];
        const pid = process;
        const index = parseInt(pid.slice(1)) - 1;
        const row = processList.indexOf(pid);
        const y = margin + 45 + row * (rowHeight + rowGap);

        const xStart = margin + start * scale;
        const xEnd = margin + end * scale;
        const xArrival = margin + arrivalTime[index] * scale;

        if (!drawnLabel.has(pid)) {
            ctx.font = '14px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(pid, margin - 10, y);
            drawnLabel.add(pid);
        }

        if (start > arrivalTime[index]) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'gray';
            ctx.moveTo(xArrival, y);
            ctx.lineTo(xStart, y);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.moveTo(xArrival, y - 5);
            ctx.lineTo(xArrival, y + 5);
            ctx.stroke();

            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${arrivalTime[index]}`, xArrival, y - 15);
        }

        if (lastXEndOfProcess[pid] !== undefined && lastXEndOfProcess[pid] < xStart - 1) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'gray';
            ctx.moveTo(lastXEndOfProcess[pid], y);
            ctx.lineTo(xStart, y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        lastXEndOfProcess[pid] = xEnd;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xStart, y);
        ctx.lineTo(xEnd, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(xStart, y - 5);
        ctx.lineTo(xStart, y + 5);
        ctx.stroke();
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${start}`, xStart, y - 15);

        ctx.beginPath();
        ctx.moveTo(xEnd, y - 5);
        ctx.lineTo(xEnd, y + 5);
        ctx.stroke();
        ctx.fillText(`${end}`, xEnd, y - 15);

        let isLast = true;
        if (isLast) {
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('X', xEnd + 10, y);
        }

        currentStep++;
        setTimeout(showStep, speed);
    }

    showStep();
}



export function renderReadyQueue1times(timeLine, readyQueueDisplay, burstTime = [], speed = 500) {
    readyQueueDisplay.innerHTML = '';

    let label = document.createElement('span');
    label.className = 'ready-label';
    label.innerText = 'Ready: ';
    readyQueueDisplay.appendChild(label);

    let currentStep = 0;
    let set = new Set();
    function showStep() {
        if (currentStep >= timeLine.length) return;

        let { time, running, ready } = timeLine[currentStep];

        const column = document.createElement('div');
        column.className = 'ready-column';

        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.innerText = time;
        column.appendChild(timeLabel);

        ready.forEach(p => {
            const box = document.createElement('div');
            box.className = 'process-box';
            if (p === running && !set.has(p)){
                box.classList.add('running');
                set.add(p);
            }

            let idx = parseInt(p.replace('P', '')) - 1;
            let burst = burstTime[idx] !== undefined ? burstTime[idx] : '?';
            box.innerHTML = `P<sub>${idx + 1}</sub><sup>${burst}</sup>`;
            column.appendChild(box);
        });

        readyQueueDisplay.appendChild(column);
        currentStep++;
        setTimeout(showStep, speed);
    }

    showStep();
}


export function renderResult(waitingTimes, turnaroundTimes, resultDisplay) {
    let totalW = 0;
    let totalT = 0;
    let table = document.createElement('table');
    table.className = 'result-table';

    for(let i = 0; i < waitingTimes.length; i++) {
        let row = document.createElement('tr');
        let w = waitingTimes[i];
        let t = turnaroundTimes[i];
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
        <td>w<sub>tb</sub> = ${ (totalW / waitingTimes.length).toFixed(2) }</td>
        <td>t<sub>tb</sub> = ${ (totalT / waitingTimes.length).toFixed(2) }</td>
    `;
    table.appendChild(avgRow);
    resultDisplay.innerHTML = '';
    resultDisplay.appendChild(table);
    resultDisplay.classList.add('display');
}

export function renderResult2(waitingTimes, turnarroundTimes, responseTimes, resultDisplay) {
    let totalW = 0;
    let totalT = 0;
    let totalR = 0;

    let table = document.createElement('table');
    table.className = 'result-table';

    for (let i = 0; i < waitingTimes.length; i++) {
        let w = waitingTimes[i];
        let t = turnarroundTimes[i];
        let r = responseTimes[i];

        totalW += w;
        totalT += t;
        totalR += r;

        let row = document.createElement('tr');
        row.innerHTML = `
            <td>r<sub>${i + 1}</sub> = ${r}</td>
            <td>w<sub>${i + 1}</sub> = ${w}</td>
            <td>t<sub>${i + 1}</sub> = ${t}</td>
        `;
        table.appendChild(row);
    }

    let avgRow = document.createElement('tr');
    avgRow.innerHTML = `
        <td>r<sub>tb</sub> = ${(totalR / responseTimes.length).toFixed(2)}</td>
        <td>w<sub>tb</sub> = ${(totalW / waitingTimes.length).toFixed(2)}</td>
        <td>t<sub>tb</sub> = ${(totalT / turnarroundTimes.length).toFixed(2)}</td>
    `;
    table.appendChild(avgRow);

    resultDisplay.innerHTML = '';
    resultDisplay.appendChild(table);
    resultDisplay.classList.add('display');
}

export function renderTableCPU(burstTimes, arrivalTimes, processDisplay) {
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

export function renderTablecpuIO(burstLists, arrivalTime, IOUsing, processDisplay) {
    if (!burstLists.length) return;

    let table = document.createElement('table');
    table.className = 'table-process';

    let maxLen = Math.max(...burstLists.map(list => list.length));

    let header = table.insertRow();
    let firstTh = document.createElement('th');
    firstTh.innerText = 'Process';
    header.appendChild(firstTh);

    let thArrival = document.createElement('th');
    thArrival.innerText = 'Arrival Time';
    header.appendChild(thArrival);

    let thIO = document.createElement('th');
    thIO.innerText = 'I/O Using';
    header.appendChild(thIO);

    for (let i = 0; i < maxLen; i++) {
        const th = document.createElement('th');
        th.innerText = i % 2 === 0 ? 'CPU' : 'I/O';
        header.appendChild(th);
    }

    for (let i = 0; i < burstLists.length; i++) {
        let row = table.insertRow();
        let tdName = row.insertCell();
        tdName.innerText = `P${i + 1}`;

        let tdArrival = row.insertCell();
        tdArrival.innerText = arrivalTime[i] !== undefined ? arrivalTime[i] : '';

        let tdIO = row.insertCell();
        tdIO.innerText = IOUsing[i] !== undefined ? IOUsing[i] : '';

        let burstList = burstLists[i];
        for (let j = 0; j < maxLen; j++) {
            const td = row.insertCell();
            td.innerText = burstList[j] !== undefined ? burstList[j] : '';
        }
    }

    processDisplay.innerHTML = '';
    processDisplay.appendChild(table);
}

export function renderIO(steps, canvascpuId, canvasioId, burstTimeList, arrivalTimeIO, speed = 500) {
    const canvasCPU = document.getElementById(canvascpuId);
    const canvasIO = document.getElementById(canvasioId);
    const ctxCPU = canvasCPU.getContext('2d');
    const ctxIO = canvasIO.getContext('2d');
    
    const margin = 50;
    const rowHeight = 40;
    const rowGap = 20;

    console.log(steps);

    let maxTime = Math.max(...steps.map(s => s.end), 20);
    const width = canvasCPU.width;
    const height = canvasCPU.height;
    const scale = (width - 2 * margin) / maxTime;

    renderTimeLine(ctxCPU, width, height, margin, scale, maxTime);
    renderTimeLine(ctxIO, width, height, margin, scale, maxTime);
    
    arrivalTimeIO.forEach((t, i) => {
        const x = margin + t * scale;
        ctxIO.strokeStyle = '#ff0000';
        ctxIO.beginPath();
        ctxIO.moveTo(x, margin);
        ctxIO.lineTo(x, height - margin);
        ctxIO.stroke();
    
        ctxIO.fillText(`Arr ${i}`, x + 5, margin + 10 + i * 15);
    });

    let currentStep = 0;

    function showStep() {
        if (currentStep >= steps.length) return;

        const step = steps[currentStep];
        const ctx = step.type === 'CPU' ? ctxCPU : ctxIO;
        const yOffset = margin + 45 + (parseInt(step.process.slice(1)) - 1) * (rowHeight + rowGap);
        const xStart = margin + step.start * scale;
        const xEnd = margin + step.end * scale;

        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(step.process, margin - 10, yOffset);

        ctx.strokeStyle = step.type === 'CPU' ? '#007bff' : '#28a745';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xStart, yOffset);
        ctx.lineTo(xEnd, yOffset);
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(`${step.start}`, xStart, yOffset - 10);
        ctx.fillText(`${step.end}`, xEnd, yOffset - 10);

        currentStep++;
        setTimeout(showStep, speed);
    }

    showStep();
}
