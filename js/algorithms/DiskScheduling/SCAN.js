'use strict'

function SCAN(queue, headStart, direction, minTrack = 0, maxTrack = 199) {
    const steps = [];
    const path = [headStart];
    let current = headStart;
    let totalMove = 0;

    let up = queue.filter(t => t > current).sort((a,b) => a - b);
    let down = queue.filter(t => t < current).sort((a,b) => b - a);

    let pathDirection = [];
    if(direction === 'up') {
        pathDirection = [...up, maxTrack, ...down];
    }else if(direction === 'down') {
        pathDirection = [...down, minTrack, ...up];
    }

    pathDirection.forEach((track) => {
        let distance = Math.abs(track - current);
        steps.push({
            from: current,
            to: track,
            distance: distance
        });
        totalMove += distance
        current = track;
        path.push(current);
    });
    console.log(steps);
    return {
        headStart,
        direction,
        steps,
        path,
        totalMove
    }
}

export default SCAN;