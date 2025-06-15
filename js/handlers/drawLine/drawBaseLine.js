'use strict'

function drawBaseLine(ctx, width, height, margin, minTrack, maxTrack, xScale, queue = []) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, 30);
    ctx.lineTo(width - margin, 30);
    ctx.stroke();

    const stepUnit = 20;

    for (let t = Math.ceil(minTrack / stepUnit) * stepUnit; t <= maxTrack; t += stepUnit) {
        const x = margin + (t - minTrack) * xScale;
        ctx.beginPath();
        ctx.moveTo(x, 25);
        ctx.lineTo(x, 35);
        ctx.stroke();

        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.fillText(t.toString(), x - 5, 20);
    }
    ctx.fillStyle = 'red';
    queue.forEach(track => {
        const x = margin + (track - minTrack) * xScale;
        ctx.beginPath();
        ctx.fill();
    });
}

export default drawBaseLine;
