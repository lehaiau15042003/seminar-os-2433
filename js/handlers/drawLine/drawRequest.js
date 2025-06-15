'use strict'

function drawRequest(ctx, request, headStart, width, height, margin, scale, trackMax) {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.strokeStyle = '#333';
    ctx.stroke();
    let spacing = 20;
    const numbers = [];
    
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

    if(!request.includes(0)) request.unshift(0);
    if(!request.includes(trackMax)) request.push(trackMax);
}

export default drawRequest;