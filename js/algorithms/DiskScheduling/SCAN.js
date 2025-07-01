'use strict'

function SCAN(queue, headStart, direction, minTrack = 0, maxTrack) {
    let steps = [];
    let path = [headStart];
    let current = headStart; 
    let totalMove = 0;
    
    let up = [];
    let down = [];

    for(let i = 0; i < queue.length; i++) {
        if(queue[i] > headStart) {
            up.push(queue[i]);
        }else {
            down.push(queue[i]);
        }
    }
    up.sort((a, b) => a - b);
    down.sort((a, b) => b - a);

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