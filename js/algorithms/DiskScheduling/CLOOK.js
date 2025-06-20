'use strict'

function CLOOK(queue, headStart, direction) {
    const steps = [];
    const path = [headStart];
    let current = headStart;
    let totalMove = 0;

    let up = queue.filter(t => t > current).sort((a,b) => a - b);
    let down = queue.filter(t => t < current).sort((a,b) => b - a);

    let pathDirection = [];
    if(direction === 'up') {
        pathDirection = [...up, ...down.reverse()];
    }else if(direction === 'down') {
        pathDirection = [...down, ...up.reverse()];
    }

    pathDirection.forEach(track => {
        let distance = Math.abs(track - current);
        steps.push({
            from: current,
            to: track,
            distance: distance
        });
        totalMove += distance;
        current = track;
        path.push(current);
    });
    return {
        headStart,
        direction,
        steps,
        path,
        totalMove
    }
}

export default CLOOK;