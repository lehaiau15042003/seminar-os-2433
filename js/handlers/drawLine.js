'use strict'

function drawLine(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const margin = 220;
    const trackMax = 199;
    const scale = (width - 2 * margin) / trackMax;
    let currentStep = 1;
    let interval = null;

    const request = [];
    let headStart = null;

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(margin, height - margin);
        ctx.strokeStyle = '#333';
        ctx.stroke();
        const lastLabels = [];

        request.forEach(r => {
            const x = margin + r * scale;
            const y = height - margin;
            const lineHeight = 10;
        
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - lineHeight);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();
        
            drawSmartLabel(ctx, r, x, y, lastLabels);
        });

        
        if(headStart !== null) {
            const x = margin + headStart * scale;
            const y = height - margin;
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
            ctx.fillText(headStart, x, y - lineHeight - 10);
        }

        if(!request.includes(0)) {
            request.unshift(0);
        }

        if(!request.includes(trackMax)) {
            request.push(trackMax);
        }

        if(request.length > 0) {
            ctx.beginPath();
            ctx.moveTo(margin + request[0] * scale, height - margin);
            request.forEach(r => {
                const x = margin + r * scale;
                const y = height - margin;
                ctx.lineTo(x, y);
            });
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    function drawSteps(steps) {
        ctx.clearRect(0, 0, width, height);
        const y = height - margin;
        const lastLabels = [];

        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();

        for (let i = 0; i < Math.min(currentStep, steps.length); i++) {
            const x = margin + steps[i] * scale;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - 10);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            drawSmartLabel(ctx, steps[i], x, y, lastLabels);
        }

        if(currentStep > 0 && currentStep <= steps.length) {
            ctx.beginPath();
            ctx.moveTo(margin + steps[0] * scale, y);
            for(let i = 1; i < currentStep; i++) {
                const x = margin + steps[i] * scale;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }


    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const track = Math.floor((x - margin) / scale);
        if(track >= 0 && track <= trackMax && !request.includes(track)) {
            request.push(track);
            draw();
        }
    });
    return {
        draw,
        clear: () => {
            request.length = 0;
            draw();
        },

        setHeadStart: (val) => {
            headStart = val,
            draw();
        },

        addRequest: (val) => {
            if(!request.includes(val)){
                request.push(val);
                draw();
            }
        },

        stepRender: (steps) => {
            currentStep = 1;
            drawSteps(steps);
        },

        nextStep: (steps) => {
            if(currentStep < steps.length) {
                currentStep++;
                drawSteps(steps);
            }
        },

        playSteps: (steps, speed = 1000) => {
            currentStep = 1;
            if(interval) clearInterval(interval);
            interval = setInterval(() => {
                if(currentStep < steps.length) {
                    currentStep++;
                    drawSteps(steps);
                }else {
                    clearInterval(interval);
                }
            }, speed);
        },

        request
    };

    function drawSmartLabel(ctx, text, x, y, lastLabels, labelSpacing = 20) {
        const fontSize = 12;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
    
        let offsetX = 0;
        let offsetY = -20;
        for (let i = 0; i < lastLabels.length; i++) {
            const last = lastLabels[i];
            const dx = Math.abs(x - last.x);
            const dy = Math.abs(y + offsetY - last.y);
            if (dx < labelSpacing && dy < fontSize) {
                offsetY = offsetY === -20 ? 10 : -30;
                offsetX = offsetX === 0 ? 10 : -10;
            }
        }
        ctx.fillStyle = 'black';
        ctx.fillText(text, x + offsetX, y + offsetY);

        lastLabels.push({ x: x + offsetX, y: y + offsetY });
    }
}

export default drawLine;