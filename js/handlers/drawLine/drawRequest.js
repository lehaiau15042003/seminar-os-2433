'use strict'

function drawRequest(ctx, request, headStart, width, height, margin, scale, trackMax, pathSteps = []) {
    const baselineY = margin;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, baselineY);
    ctx.lineTo(width, baselineY);
    ctx.strokeStyle = '#333';
    ctx.stroke();
    let spacing = 20;
    const numbers = [];

    if(!request.includes(0)) request.unshift(0);
    if(!request.includes(trackMax)) request.push(trackMax);


    request.forEach(r => {
        const x = margin + r * scale;
        const y = margin;
        const lineHeight = 10;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + lineHeight);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
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
        const x = margin + headStart * scale;
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
            const x1 = margin + pathSteps[i] * scale;
            const x2 = margin + pathSteps[i + 1] * scale;
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
    
        const lastX = margin + pathSteps[pathSteps.length - 1] * scale;
        const lastY = baselineY;
        ctx.fillText(pathSteps[pathSteps.length - 1], lastX + 5, lastY - 15);
    }
    
}

export default drawRequest;